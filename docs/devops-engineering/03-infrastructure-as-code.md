---
sidebar_position: 5
---

# Infrastructure as Code and Configuration Management

Master infrastructure automation through code, enabling consistent, scalable, and maintainable infrastructure deployments across multiple cloud providers and environments.

## Learning Objectives

By the end of this module, you will:
- Design and implement Infrastructure as Code (IaC) solutions using Terraform and cloud-native tools
- Master configuration management with Ansible, Chef, and Puppet
- Build multi-cloud infrastructure automation strategies
- Implement infrastructure security and compliance automation
- Develop infrastructure monitoring, cost optimization, and state management practices

## 1. Infrastructure as Code Fundamentals

### Terraform Mastery

**Advanced Terraform Configuration:**
```hcl
# main.tf - Multi-environment infrastructure
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.0"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.0"
    }
  }
  
  backend "s3" {
    bucket         = "terraform-state-bucket"
    key            = "infrastructure/terraform.tfstate"
    region         = "us-west-2"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}

# Provider configurations
provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Environment   = var.environment
      Project       = var.project_name
      ManagedBy     = "terraform"
      Owner         = var.owner
      CostCenter    = var.cost_center
    }
  }
}

# Data sources
data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]
  
  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

# Local values for computed configurations
locals {
  azs = slice(data.aws_availability_zones.available.names, 0, 3)
  
  common_tags = {
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "terraform"
  }
  
  vpc_cidr = "10.0.0.0/16"
  
  private_subnets = [
    "10.0.1.0/24",
    "10.0.2.0/24",
    "10.0.3.0/24"
  ]
  
  public_subnets = [
    "10.0.101.0/24",
    "10.0.102.0/24",
    "10.0.103.0/24"
  ]
}

# VPC Module
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  
  name = "${var.project_name}-${var.environment}-vpc"
  cidr = local.vpc_cidr
  
  azs             = local.azs
  private_subnets = local.private_subnets
  public_subnets  = local.public_subnets
  
  enable_nat_gateway = true
  enable_vpn_gateway = false
  enable_dns_hostnames = true
  enable_dns_support = true
  
  # VPC Flow Logs
  enable_flow_log                      = true
  create_flow_log_cloudwatch_iam_role  = true
  create_flow_log_cloudwatch_log_group = true
  
  tags = local.common_tags
}

# Security Groups
resource "aws_security_group" "web" {
  name_prefix = "${var.project_name}-web-"
  vpc_id      = module.vpc.vpc_id
  
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = merge(local.common_tags, {
    Name = "${var.project_name}-web-sg"
  })
}

# Application Load Balancer
resource "aws_lb" "main" {
  name               = "${var.project_name}-${var.environment}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.web.id]
  subnets           = module.vpc.public_subnets
  
  enable_deletion_protection = var.environment == "production"
  
  access_logs {
    bucket  = aws_s3_bucket.alb_logs.bucket
    prefix  = "alb"
    enabled = true
  }
  
  tags = local.common_tags
}

# EKS Cluster
module "eks" {
  source = "terraform-aws-modules/eks/aws"
  
  cluster_name    = "${var.project_name}-${var.environment}"
  cluster_version = "1.28"
  
  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets
  
  # Cluster endpoint configuration
  cluster_endpoint_private_access = true
  cluster_endpoint_public_access  = true
  cluster_endpoint_public_access_cidrs = var.allowed_cidr_blocks
  
  # Cluster logging
  cluster_enabled_log_types = ["api", "audit", "authenticator", "controllerManager", "scheduler"]
  
  # Node groups
  eks_managed_node_groups = {
    general = {
      desired_size = 2
      max_size     = 10
      min_size     = 1
      
      instance_types = ["t3.medium"]
      capacity_type  = "ON_DEMAND"
      
      k8s_labels = {
        Environment = var.environment
        NodeGroup   = "general"
      }
      
      update_config = {
        max_unavailable_percentage = 25
      }
    }
    
    spot = {
      desired_size = 2
      max_size     = 5
      min_size     = 0
      
      instance_types = ["t3.medium", "t3a.medium", "t2.medium"]
      capacity_type  = "SPOT"
      
      k8s_labels = {
        Environment = var.environment
        NodeGroup   = "spot"
      }
      
      taints = {
        spot = {
          key    = "spot"
          value  = "true"
          effect = "NO_SCHEDULE"
        }
      }
    }
  }
  
  tags = local.common_tags
}

# RDS Database
resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-${var.environment}-db-subnet-group"
  subnet_ids = module.vpc.private_subnets
  
  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}-db-subnet-group"
  })
}

resource "aws_db_instance" "main" {
  identifier = "${var.project_name}-${var.environment}-db"
  
  engine         = "postgres"
  engine_version = "15.4"
  instance_class = var.db_instance_class
  
  allocated_storage     = 20
  max_allocated_storage = 100
  storage_type         = "gp3"
  storage_encrypted    = true
  
  db_name  = var.db_name
  username = var.db_username
  password = var.db_password
  
  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  
  backup_retention_period = var.environment == "production" ? 7 : 1
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"
  
  skip_final_snapshot = var.environment != "production"
  deletion_protection = var.environment == "production"
  
  performance_insights_enabled = true
  monitoring_interval         = 60
  monitoring_role_arn        = aws_iam_role.rds_monitoring.arn
  
  tags = local.common_tags
}

# S3 Buckets with versioning and encryption
resource "aws_s3_bucket" "app_data" {
  bucket = "${var.project_name}-${var.environment}-app-data-${random_string.bucket_suffix.result}"
  
  tags = local.common_tags
}

resource "aws_s3_bucket_versioning" "app_data" {
  bucket = aws_s3_bucket.app_data.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "app_data" {
  bucket = aws_s3_bucket.app_data.id
  
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "app_data" {
  bucket = aws_s3_bucket.app_data.id
  
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# CloudWatch Log Groups
resource "aws_cloudwatch_log_group" "app_logs" {
  name              = "/aws/application/${var.project_name}-${var.environment}"
  retention_in_days = var.environment == "production" ? 30 : 7
  
  tags = local.common_tags
}

# Random string for unique resource naming
resource "random_string" "bucket_suffix" {
  length  = 8
  special = false
  upper   = false
}
```

**Variables and Outputs:**
```hcl
# variables.tf
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-west-2"
}

variable "environment" {
  description = "Environment name"
  type        = string
  validation {
    condition     = contains(["dev", "staging", "production"], var.environment)
    error_message = "Environment must be dev, staging, or production."
  }
}

variable "project_name" {
  description = "Project name"
  type        = string
}

variable "owner" {
  description = "Resource owner"
  type        = string
}

variable "cost_center" {
  description = "Cost center for billing"
  type        = string
}

variable "allowed_cidr_blocks" {
  description = "CIDR blocks allowed to access EKS cluster"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "db_name" {
  description = "Database name"
  type        = string
}

variable "db_username" {
  description = "Database username"
  type        = string
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

# outputs.tf
output "vpc_id" {
  description = "VPC ID"
  value       = module.vpc.vpc_id
}

output "private_subnets" {
  description = "Private subnet IDs"
  value       = module.vpc.private_subnets
}

output "public_subnets" {
  description = "Public subnet IDs"
  value       = module.vpc.public_subnets
}

output "eks_cluster_endpoint" {
  description = "EKS cluster endpoint"
  value       = module.eks.cluster_endpoint
}

output "eks_cluster_name" {
  description = "EKS cluster name"
  value       = module.eks.cluster_name
}

output "rds_endpoint" {
  description = "RDS endpoint"
  value       = aws_db_instance.main.endpoint
  sensitive   = true
}

output "load_balancer_dns" {
  description = "Load balancer DNS name"
  value       = aws_lb.main.dns_name
}
```

### Multi-Cloud Infrastructure Patterns

**Azure Resource Manager (ARM) Template:**
```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "environment": {
      "type": "string",
      "allowedValues": ["dev", "staging", "production"],
      "metadata": {
        "description": "Environment name"
      }
    },
    "projectName": {
      "type": "string",
      "metadata": {
        "description": "Project name for resource naming"
      }
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]",
      "metadata": {
        "description": "Location for all resources"
      }
    }
  },
  "variables": {
    "vnetName": "[concat(parameters('projectName'), '-', parameters('environment'), '-vnet')]",
    "subnetName": "[concat(parameters('projectName'), '-', parameters('environment'), '-subnet')]",
    "nsgName": "[concat(parameters('projectName'), '-', parameters('environment'), '-nsg')]",
    "aksName": "[concat(parameters('projectName'), '-', parameters('environment'), '-aks')]",
    "acrName": "[concat(parameters('projectName'), parameters('environment'), 'acr', uniqueString(resourceGroup().id))]",
    "logAnalyticsName": "[concat(parameters('projectName'), '-', parameters('environment'), '-logs')]"
  },
  "resources": [
    {
      "type": "Microsoft.Network/virtualNetworks",
      "apiVersion": "2021-02-01",
      "name": "[variables('vnetName')]",
      "location": "[parameters('location')]",
      "properties": {
        "addressSpace": {
          "addressPrefixes": ["10.0.0.0/16"]
        },
        "subnets": [
          {
            "name": "[variables('subnetName')]",
            "properties": {
              "addressPrefix": "10.0.1.0/24",
              "networkSecurityGroup": {
                "id": "[resourceId('Microsoft.Network/networkSecurityGroups', variables('nsgName'))]"
              }
            }
          }
        ]
      },
      "dependsOn": [
        "[resourceId('Microsoft.Network/networkSecurityGroups', variables('nsgName'))]"
      ]
    },
    {
      "type": "Microsoft.Network/networkSecurityGroups",
      "apiVersion": "2021-02-01",
      "name": "[variables('nsgName')]",
      "location": "[parameters('location')]",
      "properties": {
        "securityRules": [
          {
            "name": "AllowHTTPS",
            "properties": {
              "protocol": "Tcp",
              "sourcePortRange": "*",
              "destinationPortRange": "443",
              "sourceAddressPrefix": "*",
              "destinationAddressPrefix": "*",
              "access": "Allow",
              "priority": 1000,
              "direction": "Inbound"
            }
          }
        ]
      }
    },
    {
      "type": "Microsoft.ContainerRegistry/registries",
      "apiVersion": "2021-06-01-preview",
      "name": "[variables('acrName')]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "Basic"
      },
      "properties": {
        "adminUserEnabled": false
      }
    },
    {
      "type": "Microsoft.OperationalInsights/workspaces",
      "apiVersion": "2021-06-01",
      "name": "[variables('logAnalyticsName')]",
      "location": "[parameters('location')]",
      "properties": {
        "sku": {
          "name": "PerGB2018"
        },
        "retentionInDays": 30
      }
    },
    {
      "type": "Microsoft.ContainerService/managedClusters",
      "apiVersion": "2021-05-01",
      "name": "[variables('aksName')]",
      "location": "[parameters('location')]",
      "identity": {
        "type": "SystemAssigned"
      },
      "properties": {
        "dnsPrefix": "[concat(parameters('projectName'), '-', parameters('environment'))]",
        "agentPoolProfiles": [
          {
            "name": "nodepool1",
            "count": 2,
            "vmSize": "Standard_D2s_v3",
            "osType": "Linux",
            "mode": "System",
            "vnetSubnetID": "[resourceId('Microsoft.Network/virtualNetworks/subnets', variables('vnetName'), variables('subnetName'))]"
          }
        ],
        "servicePrincipalProfile": {
          "clientId": "msi"
        },
        "addonProfiles": {
          "omsagent": {
            "enabled": true,
            "config": {
              "logAnalyticsWorkspaceResourceID": "[resourceId('Microsoft.OperationalInsights/workspaces', variables('logAnalyticsName'))]"
            }
          }
        }
      },
      "dependsOn": [
        "[resourceId('Microsoft.Network/virtualNetworks', variables('vnetName'))]",
        "[resourceId('Microsoft.OperationalInsights/workspaces', variables('logAnalyticsName'))]"
      ]
    }
  ],
  "outputs": {
    "aksClusterName": {
      "type": "string",
      "value": "[variables('aksName')]"
    },
    "acrLoginServer": {
      "type": "string",
      "value": "[reference(resourceId('Microsoft.ContainerRegistry/registries', variables('acrName'))).loginServer]"
    }
  }
}
```

**Google Cloud Deployment Manager:**
```yaml
# gcp-infrastructure.yaml
imports:
- path: templates/vpc.py
- path: templates/gke.py
- path: templates/cloudsql.py

resources:
- name: vpc-network
  type: templates/vpc.py
  properties:
    project: $(env["project"])
    region: us-central1
    
- name: gke-cluster
  type: templates/gke.py
  properties:
    project: $(env["project"])
    zone: us-central1-a
    network: $(ref.vpc-network.selfLink)
    
- name: postgres-instance
  type: templates/cloudsql.py
  properties:
    project: $(env["project"])
    region: us-central1
    tier: db-f1-micro
```

### Free Resources

- [Terraform Documentation](https://www.terraform.io/docs) - Complete Terraform reference
- [AWS CloudFormation Templates](https://aws.amazon.com/cloudformation/templates/) - Pre-built infrastructure templates
- [Azure Resource Manager Templates](https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/) - ARM template documentation
- [Google Cloud Deployment Manager](https://cloud.google.com/deployment-manager/docs) - GCP infrastructure automation

## 2. Configuration Management

### Ansible Automation

**Advanced Ansible Playbooks:**
```yaml
# site.yml - Main playbook
---
- name: Configure web servers
  hosts: webservers
  become: yes
  vars:
    app_name: myapp
    app_version: "{{ lookup('env', 'APP_VERSION') | default('latest') }}"
    app_port: 8080
    nginx_port: 80
  
  pre_tasks:
    - name: Update package cache
      package:
        update_cache: yes
      when: ansible_os_family == "Debian"
    
    - name: Install required packages
      package:
        name:
          - curl
          - wget
          - unzip
          - htop
        state: present

  roles:
    - common
    - docker
    - nginx
    - monitoring
    - security

  post_tasks:
    - name: Verify application is running
      uri:
        url: "http://localhost:{{ nginx_port }}/health"
        method: GET
        status_code: 200
      retries: 5
      delay: 10

- name: Configure database servers
  hosts: dbservers
  become: yes
  vars:
    postgres_version: 13
    postgres_port: 5432
    
  roles:
    - common
    - postgresql
    - monitoring
    - security
    - backup

- name: Configure load balancers
  hosts: loadbalancers
  become: yes
  vars:
    backend_servers: "{{ groups['webservers'] }}"
    
  roles:
    - common
    - haproxy
    - monitoring
    - security
```

**Complex Role Structure:**
```yaml
# roles/docker/tasks/main.yml
---
- name: Add Docker GPG key
  apt_key:
    url: https://download.docker.com/linux/ubuntu/gpg
    state: present
  when: ansible_os_family == "Debian"

- name: Add Docker repository
  apt_repository:
    repo: "deb [arch=amd64] https://download.docker.com/linux/ubuntu {{ ansible_distribution_release }} stable"
    state: present
  when: ansible_os_family == "Debian"

- name: Install Docker
  package:
    name: docker-ce
    state: present

- name: Start and enable Docker service
  systemd:
    name: docker
    state: started
    enabled: yes

- name: Add users to docker group
  user:
    name: "{{ item }}"
    groups: docker
    append: yes
  loop: "{{ docker_users | default([]) }}"

- name: Install Docker Compose
  pip:
    name: docker-compose
    state: present

- name: Configure Docker daemon
  template:
    src: daemon.json.j2
    dest: /etc/docker/daemon.json
    backup: yes
  notify: restart docker

- name: Deploy application containers
  docker_compose:
    project_name: "{{ app_name }}"
    definition:
      version: '3.8'
      services:
        app:
          image: "{{ app_image }}:{{ app_version }}"
          ports:
            - "{{ app_port }}:{{ app_port }}"
          environment:
            - DATABASE_URL={{ database_url }}
            - REDIS_URL={{ redis_url }}
          volumes:
            - app_data:/app/data
          restart: unless-stopped
          healthcheck:
            test: ["CMD", "curl", "-f", "http://localhost:{{ app_port }}/health"]
            interval: 30s
            timeout: 10s
            retries: 3
        
        redis:
          image: redis:7-alpine
          ports:
            - "6379:6379"
          volumes:
            - redis_data:/data
          restart: unless-stopped
      
      volumes:
        app_data:
        redis_data:
  register: docker_compose_result

- name: Wait for application to be ready
  uri:
    url: "http://localhost:{{ app_port }}/health"
    method: GET
    status_code: 200
  retries: 30
  delay: 10
  when: docker_compose_result.changed
```

**Dynamic Inventory and Vault Integration:**
```python
#!/usr/bin/env python3
# dynamic_inventory.py - AWS EC2 dynamic inventory
import boto3
import json
import argparse

class EC2Inventory:
    def __init__(self):
        self.inventory = {}
        self.read_cli_args()
        
        if self.args.list:
            self.inventory = self.get_inventory()
        elif self.args.host:
            self.inventory = self.get_host_info(self.args.host)
        
        print(json.dumps(self.inventory, indent=2))
    
    def read_cli_args(self):
        parser = argparse.ArgumentParser()
        parser.add_argument('--list', action='store_true')
        parser.add_argument('--host', action='store')
        self.args = parser.parse_args()
    
    def get_inventory(self):
        ec2 = boto3.client('ec2')
        
        inventory = {
            '_meta': {
                'hostvars': {}
            }
        }
        
        # Get all running instances
        response = ec2.describe_instances(
            Filters=[
                {'Name': 'instance-state-name', 'Values': ['running']}
            ]
        )
        
        for reservation in response['Reservations']:
            for instance in reservation['Instances']:
                # Get instance details
                instance_id = instance['InstanceId']
                private_ip = instance.get('PrivateIpAddress', '')
                public_ip = instance.get('PublicIpAddress', '')
                
                # Get tags
                tags = {tag['Key']: tag['Value'] for tag in instance.get('Tags', [])}
                
                # Group by environment
                environment = tags.get('Environment', 'untagged')
                if environment not in inventory:
                    inventory[environment] = {'hosts': []}
                
                # Group by role
                role = tags.get('Role', 'untagged')
                if role not in inventory:
                    inventory[role] = {'hosts': []}
                
                # Add to groups
                inventory[environment]['hosts'].append(private_ip)
                inventory[role]['hosts'].append(private_ip)
                
                # Add host variables
                inventory['_meta']['hostvars'][private_ip] = {
                    'instance_id': instance_id,
                    'public_ip': public_ip,
                    'instance_type': instance['InstanceType'],
                    'tags': tags,
                    'ansible_host': public_ip if public_ip else private_ip
                }
        
        return inventory
    
    def get_host_info(self, hostname):
        return {}

if __name__ == '__main__':
    EC2Inventory()
```

### Infrastructure Testing and Validation

**Ansible Testing with Molecule:**
```yaml
# molecule/default/molecule.yml
---
dependency:
  name: galaxy
driver:
  name: docker
platforms:
  - name: instance
    image: quay.io/ansible/molecule-ubuntu:18.04
    pre_build_image: true
provisioner:
  name: ansible
  inventory:
    host_vars:
      instance:
        app_name: testapp
        app_version: latest
verifier:
  name: ansible
```

**Infrastructure Testing with Terratest:**
```go
// test/terraform_test.go
package test

import (
    "testing"
    "time"
    
    "github.com/gruntwork-io/terratest/modules/aws"
    "github.com/gruntwork-io/terratest/modules/terraform"
    "github.com/stretchr/testify/assert"
)

func TestTerraformInfrastructure(t *testing.T) {
    t.Parallel()
    
    // Configure Terraform options
    terraformOptions := &terraform.Options{
        TerraformDir: "../",
        Vars: map[string]interface{}{
            "environment":   "test",
            "project_name":  "terratest",
            "aws_region":    "us-west-2",
            "db_name":       "testdb",
            "db_username":   "testuser",
            "db_password":   "testpass123",
        },
    }
    
    // Clean up resources after test
    defer terraform.Destroy(t, terraformOptions)
    
    // Deploy infrastructure
    terraform.InitAndApply(t, terraformOptions)
    
    // Test VPC creation
    vpcId := terraform.Output(t, terraformOptions, "vpc_id")
    assert.NotEmpty(t, vpcId)
    
    // Verify VPC exists in AWS
    aws.GetVpcById(t, vpcId, "us-west-2")
    
    // Test EKS cluster
    clusterName := terraform.Output(t, terraformOptions, "eks_cluster_name")
    assert.NotEmpty(t, clusterName)
    
    // Verify EKS cluster is active
    cluster := aws.GetEksCluster(t, "us-west-2", clusterName)
    assert.Equal(t, "ACTIVE", *cluster.Status)
    
    // Test RDS instance
    rdsEndpoint := terraform.Output(t, terraformOptions, "rds_endpoint")
    assert.NotEmpty(t, rdsEndpoint)
    
    // Test Load Balancer
    lbDns := terraform.Output(t, terraformOptions, "load_balancer_dns")
    assert.NotEmpty(t, lbDns)
    
    // Additional validation can be added here
    // - Test network connectivity
    // - Verify security groups
    // - Check resource tags
    // - Validate backup configurations
}

func TestInfrastructureCompliance(t *testing.T) {
    t.Parallel()
    
    terraformOptions := &terraform.Options{
        TerraformDir: "../",
        PlanFilePath: "./terraform.plan",
    }
    
    // Generate plan
    terraform.InitAndPlan(t, terraformOptions)
    
    // Parse plan for compliance checks
    plan := terraform.ShowWithStruct(t, terraformOptions)
    
    // Check that all resources have required tags
    for _, resource := range plan.PlannedValues.RootModule.Resources {
        if resource.Type == "aws_instance" || 
           resource.Type == "aws_db_instance" ||
           resource.Type == "aws_s3_bucket" {
            
            tags := resource.Values["tags"].(map[string]interface{})
            assert.Contains(t, tags, "Environment")
            assert.Contains(t, tags, "Project")
            assert.Contains(t, tags, "ManagedBy")
        }
    }
    
    // Check encryption settings
    for _, resource := range plan.PlannedValues.RootModule.Resources {
        if resource.Type == "aws_s3_bucket" {
            // Verify S3 bucket has encryption
            assert.True(t, hasEncryption(resource))
        }
        
        if resource.Type == "aws_db_instance" {
            // Verify RDS has encryption
            storageEncrypted := resource.Values["storage_encrypted"].(bool)
            assert.True(t, storageEncrypted)
        }
    }
}

func hasEncryption(resource *terraform.PlannedValue) bool {
    // Implementation to check if resource has encryption enabled
    // This would depend on the specific resource type and configuration
    return true
}
```

### Free Resources

- [Ansible Documentation](https://docs.ansible.com/) - Complete Ansible automation guide
- [Molecule Testing Framework](https://molecule.readthedocs.io/) - Ansible role testing
- [Terratest](https://terratest.gruntwork.io/) - Infrastructure testing framework
- [Chef Infra Documentation](https://docs.chef.io/) - Configuration management with Chef

## 3. State Management and Collaboration

### Advanced State Management

**Terraform Remote State and Locking:**
```hcl
# backend.tf - Remote state configuration
terraform {
  backend "s3" {
    bucket         = "terraform-state-bucket"
    key            = "environments/production/terraform.tfstate"
    region         = "us-west-2"
    encrypt        = true
    dynamodb_table = "terraform-locks"
    
    # Workspace-specific state files
    workspace_key_prefix = "workspaces"
  }
}

# State bucket creation (separate configuration)
resource "aws_s3_bucket" "terraform_state" {
  bucket = "terraform-state-bucket"
  
  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id
  
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id
  
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_dynamodb_table" "terraform_locks" {
  name           = "terraform-locks"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "LockID"
  
  attribute {
    name = "LockID"
    type = "S"
  }
  
  tags = {
    Name = "Terraform State Lock Table"
  }
}
```

**Workspace Management Script:**
```bash
#!/bin/bash
# terraform-workspace-manager.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Configuration
ENVIRONMENTS=("dev" "staging" "production")
TERRAFORM_DIR="$PROJECT_ROOT/terraform"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if terraform is installed
    if ! command -v terraform &> /dev/null; then
        error "Terraform is not installed"
    fi
    
    # Check if AWS CLI is configured
    if ! aws sts get-caller-identity &> /dev/null; then
        error "AWS CLI is not configured or credentials are invalid"
    fi
    
    # Check if terraform directory exists
    if [[ ! -d "$TERRAFORM_DIR" ]]; then
        error "Terraform directory not found: $TERRAFORM_DIR"
    fi
    
    log "Prerequisites check passed"
}

init_terraform() {
    local env=$1
    log "Initializing Terraform for environment: $env"
    
    cd "$TERRAFORM_DIR"
    
    # Initialize terraform
    terraform init -reconfigure
    
    # Create or select workspace
    if terraform workspace list | grep -q "$env"; then
        terraform workspace select "$env"
    else
        terraform workspace new "$env"
    fi
    
    log "Terraform initialized for environment: $env"
}

plan_infrastructure() {
    local env=$1
    log "Planning infrastructure for environment: $env"
    
    cd "$TERRAFORM_DIR"
    terraform workspace select "$env"
    
    # Generate plan
    terraform plan \
        -var-file="environments/${env}.tfvars" \
        -out="${env}.tfplan"
    
    log "Plan generated for environment: $env"
}

apply_infrastructure() {
    local env=$1
    log "Applying infrastructure for environment: $env"
    
    cd "$TERRAFORM_DIR"
    terraform workspace select "$env"
    
    # Apply the plan
    if [[ -f "${env}.tfplan" ]]; then
        terraform apply "${env}.tfplan"
        rm "${env}.tfplan"
    else
        warn "No plan file found, running apply with auto-approve"
        terraform apply \
            -var-file="environments/${env}.tfvars" \
            -auto-approve
    fi
    
    log "Infrastructure applied for environment: $env"
}

destroy_infrastructure() {
    local env=$1
    
    if [[ "$env" == "production" ]]; then
        error "Cannot destroy production environment with this script"
    fi
    
    warn "This will destroy all infrastructure in environment: $env"
    read -p "Are you sure? Type 'yes' to confirm: " confirmation
    
    if [[ "$confirmation" != "yes" ]]; then
        log "Destruction cancelled"
        return
    fi
    
    log "Destroying infrastructure for environment: $env"
    
    cd "$TERRAFORM_DIR"
    terraform workspace select "$env"
    
    terraform destroy \
        -var-file="environments/${env}.tfvars" \
        -auto-approve
    
    log "Infrastructure destroyed for environment: $env"
}

validate_configuration() {
    local env=$1
    log "Validating configuration for environment: $env"
    
    cd "$TERRAFORM_DIR"
    terraform workspace select "$env"
    
    # Validate syntax
    terraform validate
    
    # Format check
    terraform fmt -check=true -diff=true
    
    # Security scan (if tfsec is installed)
    if command -v tfsec &> /dev/null; then
        tfsec .
    fi
    
    log "Configuration validation passed for environment: $env"
}

show_usage() {
    cat << EOF
Usage: $0 <command> <environment>

Commands:
    init        Initialize Terraform for environment
    plan        Generate execution plan
    apply       Apply infrastructure changes
    destroy     Destroy infrastructure (not allowed for production)
    validate    Validate configuration
    
Environments:
    dev         Development environment
    staging     Staging environment
    production  Production environment

Examples:
    $0 init dev
    $0 plan staging
    $0 apply production
    $0 validate dev
EOF
}

main() {
    if [[ $# -lt 2 ]]; then
        show_usage
        exit 1
    fi
    
    local command=$1
    local environment=$2
    
    # Validate environment
    if [[ ! " ${ENVIRONMENTS[@]} " =~ " ${environment} " ]]; then
        error "Invalid environment: $environment"
    fi
    
    check_prerequisites
    
    case $command in
        init)
            init_terraform "$environment"
            ;;
        plan)
            init_terraform "$environment"
            plan_infrastructure "$environment"
            ;;
        apply)
            init_terraform "$environment"
            apply_infrastructure "$environment"
            ;;
        destroy)
            init_terraform "$environment"
            destroy_infrastructure "$environment"
            ;;
        validate)
            init_terraform "$environment"
            validate_configuration "$environment"
            ;;
        *)
            error "Unknown command: $command"
            ;;
    esac
}

main "$@"
```

### Free Resources

- [Terraform State Management](https://www.terraform.io/docs/language/state/index.html) - State management best practices
- [Ansible Vault](https://docs.ansible.com/ansible/latest/user_guide/vault.html) - Secrets management
- [Git Hooks for Infrastructure](https://pre-commit.com/) - Pre-commit hooks for IaC
- [Infrastructure Testing Guide](https://www.hashicorp.com/blog/testing-hashicorp-terraform) - Testing strategies

## Hands-On Exercises

### Exercise 1: Multi-Cloud Infrastructure Deployment

**Task:** Deploy identical infrastructure across AWS, Azure, and GCP.

**Requirements:**
- Use Terraform with provider-specific modules
- Implement consistent tagging and naming conventions
- Set up monitoring and logging for all environments
- Create automated testing and validation

### Exercise 2: Configuration Management at Scale

**Task:** Configure 100+ servers with Ansible using dynamic inventory.

**Requirements:**
- Dynamic inventory from cloud providers
- Role-based configuration management
- Secrets management with Ansible Vault
- Automated testing with Molecule

### Exercise 3: Infrastructure State Management

**Task:** Implement enterprise-grade state management and collaboration.

**Requirements:**
- Remote state with locking
- Workspace management for multiple environments
- State backup and recovery procedures
- Team collaboration workflows

## Assessment Questions

1. **Design a multi-cloud infrastructure strategy that ensures consistency and portability.**

2. **Implement a comprehensive configuration management solution for a large-scale deployment.**

3. **Create a state management strategy that supports team collaboration and prevents conflicts.**

4. **Design infrastructure testing and validation pipelines for continuous compliance.**

5. **Develop a disaster recovery plan for infrastructure state and configuration.**

## Next Steps

After completing this module:

1. **Deploy production infrastructure** using IaC best practices
2. **Implement configuration management** at enterprise scale
3. **Master state management** and team collaboration
4. **Move to Module 4: Containerization and Orchestration** to learn container platforms

## Additional Resources

### Tools and Platforms
- [Terraform Cloud](https://cloud.hashicorp.com/products/terraform) - Terraform collaboration platform
- [Ansible Tower/AWX](https://www.ansible.com/products/tower) - Ansible automation platform
- [Pulumi](https://www.pulumi.com/) - Modern infrastructure as code
- [CDK (Cloud Development Kit)](https://aws.amazon.com/cdk/) - Infrastructure as code using programming languages

### Advanced Topics
- [Terragrunt](https://terragrunt.gruntwork.io/) - Terraform wrapper for DRY configurations
- [Atlantis](https://www.runatlantis.io/) - Terraform pull request automation
- [Checkov](https://www.checkov.io/) - Static code analysis for infrastructure
- [Infracost](https://www.infracost.io/) - Cloud cost estimation for Terraform

Ready to master containers and orchestration? Continue to **Module 4: Containerization and Orchestration** to learn Docker and Kubernetes!
