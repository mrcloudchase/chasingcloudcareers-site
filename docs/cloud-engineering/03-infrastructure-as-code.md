---
sidebar_position: 4
---

# Infrastructure as Code (IaC)

Master the practice of managing and provisioning infrastructure through code rather than manual processes, using tools like Terraform, AWS CloudFormation, and Ansible.

## What is Infrastructure as Code?

Infrastructure as Code (IaC) is the practice of managing and provisioning computing infrastructure through machine-readable definition files, rather than physical hardware configuration or interactive configuration tools.

### Benefits of Infrastructure as Code

**Consistency and Repeatability:**
```bash
# Manual process (error-prone):
1. Log into AWS Console
2. Click through UI to create resources
3. Hope you remember all settings
4. Repeat for different environments

# IaC process (reliable):
1. Write infrastructure definition once
2. Deploy to dev, staging, production
3. Same configuration every time
4. Version controlled and reviewable
```

**Version Control:**
- Infrastructure changes tracked in Git
- Rollback to previous versions
- Collaboration through pull requests
- Audit trail of all changes

**Speed and Efficiency:**
- Provision entire environments in minutes
- Automate repetitive tasks
- Reduce human error
- Enable self-service infrastructure

**Cost Management:**
- Easily tear down unused environments
- Standardize resource configurations
- Prevent configuration drift
- Optimize resource usage

### IaC Tools Comparison

**Terraform (HashiCorp):**
```bash
# Pros:
- Multi-cloud support (AWS, Azure, GCP, etc.)
- Large ecosystem of providers
- Declarative syntax (HCL)
- Strong state management
- Plan before apply

# Cons:
- Learning curve for HCL
- State file management complexity
- Not cloud-native
```

**AWS CloudFormation:**
```bash
# Pros:
- Native AWS integration
- No additional tools needed
- Rollback capabilities
- Stack dependencies
- Free to use

# Cons:
- AWS-only
- JSON/YAML can be verbose
- Limited programming constructs
- Slower than Terraform
```

**Azure Resource Manager (ARM) Templates:**
```bash
# Pros:
- Native Azure integration
- Declarative JSON syntax
- Built-in validation
- Incremental deployments

# Cons:
- Azure-only
- Complex JSON syntax
- Limited reusability
```

**Ansible:**
```bash
# Pros:
- Agentless
- Simple YAML syntax
- Configuration management + provisioning
- Large module library

# Cons:
- Procedural (not declarative)
- No built-in state management
- Can be slow for large infrastructures
```

## Terraform Fundamentals

Terraform is the most popular multi-cloud IaC tool, using HashiCorp Configuration Language (HCL).

### Installing Terraform

**Linux/macOS:**
```bash
# Download Terraform
wget https://releases.hashicorp.com/terraform/1.6.0/terraform_1.6.0_linux_amd64.zip

# Extract and install
unzip terraform_1.6.0_linux_amd64.zip
sudo mv terraform /usr/local/bin/

# Verify installation
terraform version

# Enable tab completion
terraform -install-autocomplete
```

**Using Package Managers:**
```bash
# Ubuntu/Debian
curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add -
sudo apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"
sudo apt-get update && sudo apt-get install terraform

# macOS (Homebrew)
brew tap hashicorp/tap
brew install hashicorp/tap/terraform

# Windows (Chocolatey)
choco install terraform
```

### Terraform Basics

**Core Concepts:**
```bash
# Provider: Plugin that interacts with APIs (AWS, Azure, GCP)
# Resource: Infrastructure component (EC2 instance, S3 bucket)
# Data Source: Read-only information from provider
# Variable: Input parameters
# Output: Return values
# Module: Reusable Terraform configuration
```

**Basic Terraform Workflow:**
```bash
terraform init     # Initialize working directory
terraform plan     # Preview changes
terraform apply    # Apply changes
terraform destroy  # Destroy infrastructure
```

### Your First Terraform Configuration

**main.tf:**
```hcl
# Configure the AWS Provider
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Variables
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

# Data source to get latest Amazon Linux AMI
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

# Create VPC
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "terraform-vpc"
  }
}

# Create Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "terraform-igw"
  }
}

# Create public subnet
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = data.aws_availability_zones.available.names[0]
  map_public_ip_on_launch = true

  tags = {
    Name = "terraform-public-subnet"
  }
}

# Get available AZs
data "aws_availability_zones" "available" {
  state = "available"
}

# Create route table
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name = "terraform-public-rt"
  }
}

# Associate route table with subnet
resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

# Create security group
resource "aws_security_group" "web" {
  name_prefix = "terraform-web-"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Restrict this in production
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "terraform-web-sg"
  }
}

# Create EC2 instance
resource "aws_instance" "web" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.web.id]

  user_data = <<-EOF
              #!/bin/bash
              yum update -y
              yum install -y httpd
              systemctl start httpd
              systemctl enable httpd
              echo "<h1>Hello from Terraform!</h1>" > /var/www/html/index.html
              echo "<p>Instance ID: $(curl -s http://169.254.169.254/latest/meta-data/instance-id)</p>" >> /var/www/html/index.html
              EOF

  tags = {
    Name = "terraform-web-server"
  }
}

# Outputs
output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main.id
}

output "public_ip" {
  description = "Public IP address of the web server"
  value       = aws_instance.web.public_ip
}

output "website_url" {
  description = "URL of the website"
  value       = "http://${aws_instance.web.public_ip}"
}
```

**Deploy the Infrastructure:**
```bash
# Initialize Terraform
terraform init

# Validate configuration
terraform validate

# Plan deployment
terraform plan

# Apply changes
terraform apply

# View outputs
terraform output

# Access website
curl http://$(terraform output -raw public_ip)

# Destroy infrastructure when done
terraform destroy
```

### Terraform State Management

**Understanding State:**
```bash
# Terraform state tracks resource mappings
# Stored in terraform.tfstate file by default
# Contains sensitive information
# Should be stored remotely for teams
```

**Remote State with S3:**
```hcl
# backend.tf
terraform {
  backend "s3" {
    bucket         = "my-terraform-state-bucket"
    key            = "infrastructure/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-state-lock"
  }
}
```

**Create S3 Backend Resources:**
```bash
# Create S3 bucket for state
aws s3 mb s3://my-terraform-state-bucket-12345

# Enable versioning
aws s3api put-bucket-versioning \
    --bucket my-terraform-state-bucket-12345 \
    --versioning-configuration Status=Enabled

# Create DynamoDB table for state locking
aws dynamodb create-table \
    --table-name terraform-state-lock \
    --attribute-definitions AttributeName=LockID,AttributeType=S \
    --key-schema AttributeName=LockID,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST
```

### Terraform Variables and Outputs

**variables.tf:**
```hcl
variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

variable "instance_count" {
  description = "Number of instances to create"
  type        = number
  default     = 1
}

variable "allowed_cidr_blocks" {
  description = "CIDR blocks allowed to access the instance"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "instance_tags" {
  description = "Tags to apply to instances"
  type        = map(string)
  default = {
    Environment = "dev"
    Project     = "terraform-demo"
  }
}

variable "enable_monitoring" {
  description = "Enable detailed monitoring"
  type        = bool
  default     = false
}
```

**terraform.tfvars:**
```hcl
environment    = "production"
instance_count = 3
allowed_cidr_blocks = [
  "10.0.0.0/8",
  "172.16.0.0/12"
]
instance_tags = {
  Environment = "production"
  Project     = "web-app"
  Owner       = "devops-team"
}
enable_monitoring = true
```

**outputs.tf:**
```hcl
output "instance_ids" {
  description = "IDs of the EC2 instances"
  value       = aws_instance.web[*].id
}

output "instance_public_ips" {
  description = "Public IP addresses of the EC2 instances"
  value       = aws_instance.web[*].public_ip
}

output "load_balancer_dns" {
  description = "DNS name of the load balancer"
  value       = aws_lb.main.dns_name
}

output "database_endpoint" {
  description = "RDS instance endpoint"
  value       = aws_db_instance.main.endpoint
  sensitive   = true  # Mark sensitive outputs
}
```

### Terraform Modules

Modules are reusable Terraform configurations that encapsulate related resources.

**Module Structure:**
```
modules/
└── vpc/
    ├── main.tf
    ├── variables.tf
    ├── outputs.tf
    └── README.md
```

**modules/vpc/main.tf:**
```hcl
# VPC Module
resource "aws_vpc" "main" {
  cidr_block           = var.cidr_block
  enable_dns_hostnames = var.enable_dns_hostnames
  enable_dns_support   = var.enable_dns_support

  tags = merge(
    var.tags,
    {
      Name = var.name
    }
  )
}

resource "aws_internet_gateway" "main" {
  count  = var.create_igw ? 1 : 0
  vpc_id = aws_vpc.main.id

  tags = merge(
    var.tags,
    {
      Name = "${var.name}-igw"
    }
  )
}

resource "aws_subnet" "public" {
  count = length(var.public_subnet_cidrs)

  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_cidrs[count.index]
  availability_zone       = var.availability_zones[count.index]
  map_public_ip_on_launch = true

  tags = merge(
    var.tags,
    {
      Name = "${var.name}-public-${count.index + 1}"
      Type = "public"
    }
  )
}

resource "aws_subnet" "private" {
  count = length(var.private_subnet_cidrs)

  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_subnet_cidrs[count.index]
  availability_zone = var.availability_zones[count.index]

  tags = merge(
    var.tags,
    {
      Name = "${var.name}-private-${count.index + 1}"
      Type = "private"
    }
  )
}

# Route table for public subnets
resource "aws_route_table" "public" {
  count  = var.create_igw ? 1 : 0
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main[0].id
  }

  tags = merge(
    var.tags,
    {
      Name = "${var.name}-public-rt"
    }
  )
}

resource "aws_route_table_association" "public" {
  count = length(aws_subnet.public)

  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public[0].id
}
```

**modules/vpc/variables.tf:**
```hcl
variable "name" {
  description = "Name prefix for resources"
  type        = string
}

variable "cidr_block" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  type        = list(string)
  default     = ["10.0.3.0/24", "10.0.4.0/24"]
}

variable "availability_zones" {
  description = "Availability zones"
  type        = list(string)
}

variable "enable_dns_hostnames" {
  description = "Enable DNS hostnames in VPC"
  type        = bool
  default     = true
}

variable "enable_dns_support" {
  description = "Enable DNS support in VPC"
  type        = bool
  default     = true
}

variable "create_igw" {
  description = "Create Internet Gateway"
  type        = bool
  default     = true
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}
```

**modules/vpc/outputs.tf:**
```hcl
output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main.id
}

output "vpc_cidr_block" {
  description = "CIDR block of the VPC"
  value       = aws_vpc.main.cidr_block
}

output "public_subnet_ids" {
  description = "IDs of the public subnets"
  value       = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  description = "IDs of the private subnets"
  value       = aws_subnet.private[*].id
}

output "internet_gateway_id" {
  description = "ID of the Internet Gateway"
  value       = var.create_igw ? aws_internet_gateway.main[0].id : null
}
```

**Using the Module:**
```hcl
# main.tf
module "vpc" {
  source = "./modules/vpc"

  name               = "my-app"
  cidr_block         = "10.0.0.0/16"
  availability_zones = ["us-east-1a", "us-east-1b"]
  
  public_subnet_cidrs  = ["10.0.1.0/24", "10.0.2.0/24"]
  private_subnet_cidrs = ["10.0.3.0/24", "10.0.4.0/24"]

  tags = {
    Environment = "production"
    Project     = "web-app"
  }
}

# Use module outputs
resource "aws_instance" "web" {
  ami           = data.aws_ami.amazon_linux.id
  instance_type = "t3.micro"
  subnet_id     = module.vpc.public_subnet_ids[0]

  tags = {
    Name = "web-server"
  }
}
```

## AWS CloudFormation

CloudFormation is AWS's native Infrastructure as Code service using JSON or YAML templates.

### CloudFormation Basics

**Template Structure:**
```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'Description of the template'

Parameters:
  # Input parameters

Mappings:
  # Static lookup tables

Conditions:
  # Conditional resource creation

Resources:
  # AWS resources to create

Outputs:
  # Return values
```

### Simple CloudFormation Template

**vpc-template.yaml:**
```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'VPC with public and private subnets'

Parameters:
  EnvironmentName:
    Description: Environment name prefix
    Type: String
    Default: MyEnvironment

  VpcCIDR:
    Description: CIDR block for VPC
    Type: String
    Default: 10.0.0.0/16

  PublicSubnetCIDR:
    Description: CIDR block for public subnet
    Type: String
    Default: 10.0.1.0/24

  PrivateSubnetCIDR:
    Description: CIDR block for private subnet
    Type: String
    Default: 10.0.2.0/24

Resources:
  VPC:
    Type: AWS::EC2::VPC
    Properties:
      CidrBlock: !Ref VpcCIDR
      EnableDnsHostnames: true
      EnableDnsSupport: true
      Tags:
        - Key: Name
          Value: !Sub ${EnvironmentName}-VPC

  InternetGateway:
    Type: AWS::EC2::InternetGateway
    Properties:
      Tags:
        - Key: Name
          Value: !Sub ${EnvironmentName}-IGW

  InternetGatewayAttachment:
    Type: AWS::EC2::VPCGatewayAttachment
    Properties:
      InternetGatewayId: !Ref InternetGateway
      VpcId: !Ref VPC

  PublicSubnet:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref VPC
      AvailabilityZone: !Select [0, !GetAZs '']
      CidrBlock: !Ref PublicSubnetCIDR
      MapPublicIpOnLaunch: true
      Tags:
        - Key: Name
          Value: !Sub ${EnvironmentName}-Public-Subnet

  PrivateSubnet:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref VPC
      AvailabilityZone: !Select [1, !GetAZs '']
      CidrBlock: !Ref PrivateSubnetCIDR
      MapPublicIpOnLaunch: false
      Tags:
        - Key: Name
          Value: !Sub ${EnvironmentName}-Private-Subnet

  NatGatewayEIP:
    Type: AWS::EC2::EIP
    DependsOn: InternetGatewayAttachment
    Properties:
      Domain: vpc

  NatGateway:
    Type: AWS::EC2::NatGateway
    Properties:
      AllocationId: !GetAtt NatGatewayEIP.AllocationId
      SubnetId: !Ref PublicSubnet
      Tags:
        - Key: Name
          Value: !Sub ${EnvironmentName}-NAT-Gateway

  PublicRouteTable:
    Type: AWS::EC2::RouteTable
    Properties:
      VpcId: !Ref VPC
      Tags:
        - Key: Name
          Value: !Sub ${EnvironmentName}-Public-Routes

  DefaultPublicRoute:
    Type: AWS::EC2::Route
    DependsOn: InternetGatewayAttachment
    Properties:
      RouteTableId: !Ref PublicRouteTable
      DestinationCidrBlock: 0.0.0.0/0
      GatewayId: !Ref InternetGateway

  PublicSubnetRouteTableAssociation:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      RouteTableId: !Ref PublicRouteTable
      SubnetId: !Ref PublicSubnet

  PrivateRouteTable:
    Type: AWS::EC2::RouteTable
    Properties:
      VpcId: !Ref VPC
      Tags:
        - Key: Name
          Value: !Sub ${EnvironmentName}-Private-Routes

  DefaultPrivateRoute:
    Type: AWS::EC2::Route
    Properties:
      RouteTableId: !Ref PrivateRouteTable
      DestinationCidrBlock: 0.0.0.0/0
      NatGatewayId: !Ref NatGateway

  PrivateSubnetRouteTableAssociation:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      RouteTableId: !Ref PrivateRouteTable
      SubnetId: !Ref PrivateSubnet

Outputs:
  VPC:
    Description: VPC ID
    Value: !Ref VPC
    Export:
      Name: !Sub ${EnvironmentName}-VPCID

  PublicSubnet:
    Description: Public subnet ID
    Value: !Ref PublicSubnet
    Export:
      Name: !Sub ${EnvironmentName}-PUB-SN

  PrivateSubnet:
    Description: Private subnet ID
    Value: !Ref PrivateSubnet
    Export:
      Name: !Sub ${EnvironmentName}-PRI-SN
```

**Deploy CloudFormation Stack:**
```bash
# Create stack
aws cloudformation create-stack \
    --stack-name my-vpc-stack \
    --template-body file://vpc-template.yaml \
    --parameters ParameterKey=EnvironmentName,ParameterValue=Production

# Check stack status
aws cloudformation describe-stacks \
    --stack-name my-vpc-stack \
    --query 'Stacks[0].StackStatus'

# List stack resources
aws cloudformation list-stack-resources \
    --stack-name my-vpc-stack

# Get stack outputs
aws cloudformation describe-stacks \
    --stack-name my-vpc-stack \
    --query 'Stacks[0].Outputs'

# Update stack
aws cloudformation update-stack \
    --stack-name my-vpc-stack \
    --template-body file://vpc-template-updated.yaml

# Delete stack
aws cloudformation delete-stack \
    --stack-name my-vpc-stack
```

### CloudFormation Nested Stacks

**master-template.yaml:**
```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'Master template for web application infrastructure'

Parameters:
  EnvironmentName:
    Type: String
    Default: WebApp

Resources:
  NetworkStack:
    Type: AWS::CloudFormation::Stack
    Properties:
      TemplateURL: https://s3.amazonaws.com/my-templates/vpc-template.yaml
      Parameters:
        EnvironmentName: !Ref EnvironmentName

  SecurityStack:
    Type: AWS::CloudFormation::Stack
    DependsOn: NetworkStack
    Properties:
      TemplateURL: https://s3.amazonaws.com/my-templates/security-template.yaml
      Parameters:
        EnvironmentName: !Ref EnvironmentName
        VPC: !GetAtt NetworkStack.Outputs.VPC

  ApplicationStack:
    Type: AWS::CloudFormation::Stack
    DependsOn: [NetworkStack, SecurityStack]
    Properties:
      TemplateURL: https://s3.amazonaws.com/my-templates/application-template.yaml
      Parameters:
        EnvironmentName: !Ref EnvironmentName
        VPC: !GetAtt NetworkStack.Outputs.VPC
        PublicSubnet: !GetAtt NetworkStack.Outputs.PublicSubnet
        SecurityGroup: !GetAtt SecurityStack.Outputs.WebSecurityGroup
```

## Configuration Management with Ansible

Ansible is an agentless automation tool that can provision infrastructure and configure systems.

### Installing Ansible

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install ansible

# CentOS/RHEL
sudo yum install epel-release
sudo yum install ansible

# macOS
brew install ansible

# Python pip
pip install ansible

# Verify installation
ansible --version
```

### Ansible Basics

**Inventory File (hosts.ini):**
```ini
[webservers]
web1 ansible_host=10.0.1.10 ansible_user=ec2-user
web2 ansible_host=10.0.1.11 ansible_user=ec2-user

[databases]
db1 ansible_host=10.0.2.10 ansible_user=ec2-user

[all:vars]
ansible_ssh_private_key_file=~/.ssh/my-key.pem
```

**Simple Playbook (webserver.yml):**
```yaml
---
- name: Configure web servers
  hosts: webservers
  become: yes
  vars:
    http_port: 80
    max_clients: 200

  tasks:
    - name: Install Apache
      yum:
        name: httpd
        state: present

    - name: Start and enable Apache
      systemd:
        name: httpd
        state: started
        enabled: yes

    - name: Create index.html
      template:
        src: index.html.j2
        dest: /var/www/html/index.html
        owner: apache
        group: apache
        mode: '0644'
      notify: restart apache

    - name: Configure firewall
      firewalld:
        port: "{{ http_port }}/tcp"
        permanent: yes
        state: enabled
        immediate: yes

  handlers:
    - name: restart apache
      systemd:
        name: httpd
        state: restarted
```

**Template (templates/index.html.j2):**
```html
<!DOCTYPE html>
<html>
<head>
    <title>{{ ansible_hostname }}</title>
</head>
<body>
    <h1>Welcome to {{ ansible_hostname }}</h1>
    <p>Server IP: {{ ansible_default_ipv4.address }}</p>
    <p>OS: {{ ansible_distribution }} {{ ansible_distribution_version }}</p>
    <p>Configured by Ansible on {{ ansible_date_time.date }}</p>
</body>
</html>
```

**Run Playbook:**
```bash
# Check syntax
ansible-playbook --syntax-check webserver.yml

# Dry run
ansible-playbook --check webserver.yml

# Run playbook
ansible-playbook -i hosts.ini webserver.yml

# Run with verbose output
ansible-playbook -i hosts.ini webserver.yml -v
```

### Ansible for AWS Provisioning

**AWS EC2 Provisioning Playbook:**
```yaml
---
- name: Provision AWS infrastructure
  hosts: localhost
  connection: local
  gather_facts: no
  vars:
    region: us-east-1
    instance_type: t3.micro
    ami_id: ami-0abcdef1234567890
    key_name: my-key-pair

  tasks:
    - name: Create VPC
      amazon.aws.ec2_vpc_net:
        name: ansible-vpc
        cidr_block: 10.0.0.0/16
        region: "{{ region }}"
        state: present
        tags:
          Environment: Development
      register: vpc

    - name: Create public subnet
      amazon.aws.ec2_vpc_subnet:
        vpc_id: "{{ vpc.vpc.id }}"
        cidr: 10.0.1.0/24
        region: "{{ region }}"
        az: "{{ region }}a"
        map_public: yes
        state: present
        tags:
          Name: Public Subnet
      register: public_subnet

    - name: Create Internet Gateway
      amazon.aws.ec2_vpc_igw:
        vpc_id: "{{ vpc.vpc.id }}"
        region: "{{ region }}"
        state: present
        tags:
          Name: ansible-igw
      register: igw

    - name: Create security group
      amazon.aws.ec2_group:
        name: web-sg
        description: Security group for web servers
        vpc_id: "{{ vpc.vpc.id }}"
        region: "{{ region }}"
        rules:
          - proto: tcp
            ports:
              - 80
              - 443
            cidr_ip: 0.0.0.0/0
          - proto: tcp
            ports:
              - 22
            cidr_ip: 0.0.0.0/0
        tags:
          Name: web-security-group
      register: security_group

    - name: Launch EC2 instances
      amazon.aws.ec2_instance:
        name: "web-server-{{ item }}"
        image_id: "{{ ami_id }}"
        instance_type: "{{ instance_type }}"
        key_name: "{{ key_name }}"
        vpc_subnet_id: "{{ public_subnet.subnet.id }}"
        security_groups:
          - "{{ security_group.group_id }}"
        region: "{{ region }}"
        state: present
        wait: yes
        tags:
          Environment: Development
          Role: WebServer
      loop: [1, 2]
      register: ec2_instances

    - name: Display instance information
      debug:
        msg: "Instance {{ item.instances[0].tags.Name }} has IP {{ item.instances[0].public_ip_address }}"
      loop: "{{ ec2_instances.results }}"
```

## Practical IaC Projects

### Project 1: Multi-Tier Web Application with Terraform

Create a complete web application infrastructure with load balancer, auto scaling, and RDS database.

**Directory Structure:**
```
terraform-webapp/
├── main.tf
├── variables.tf
├── outputs.tf
├── modules/
│   ├── networking/
│   ├── security/
│   ├── compute/
│   └── database/
└── environments/
    ├── dev/
    ├── staging/
    └── prod/
```

**main.tf:**
```hcl
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Data sources
data "aws_availability_zones" "available" {
  state = "available"
}

# Networking module
module "networking" {
  source = "./modules/networking"

  environment        = var.environment
  vpc_cidr          = var.vpc_cidr
  availability_zones = slice(data.aws_availability_zones.available.names, 0, 2)
  
  tags = var.common_tags
}

# Security module
module "security" {
  source = "./modules/security"

  environment = var.environment
  vpc_id      = module.networking.vpc_id
  
  tags = var.common_tags
}

# Database module
module "database" {
  source = "./modules/database"

  environment           = var.environment
  vpc_id               = module.networking.vpc_id
  private_subnet_ids   = module.networking.private_subnet_ids
  database_security_group_id = module.security.database_security_group_id
  
  db_instance_class    = var.db_instance_class
  db_name             = var.db_name
  db_username         = var.db_username
  db_password         = var.db_password
  
  tags = var.common_tags
}

# Compute module
module "compute" {
  source = "./modules/compute"

  environment             = var.environment
  vpc_id                 = module.networking.vpc_id
  public_subnet_ids      = module.networking.public_subnet_ids
  private_subnet_ids     = module.networking.private_subnet_ids
  web_security_group_id  = module.security.web_security_group_id
  app_security_group_id  = module.security.app_security_group_id
  
  instance_type          = var.instance_type
  min_size              = var.min_size
  max_size              = var.max_size
  desired_capacity      = var.desired_capacity
  
  database_endpoint     = module.database.database_endpoint
  
  tags = var.common_tags
}
```

**modules/compute/main.tf:**
```hcl
# Launch template for web servers
resource "aws_launch_template" "web" {
  name_prefix   = "${var.environment}-web-"
  image_id      = data.aws_ami.amazon_linux.id
  instance_type = var.instance_type
  key_name      = var.key_name

  vpc_security_group_ids = [var.web_security_group_id]

  iam_instance_profile {
    name = aws_iam_instance_profile.web.name
  }

  user_data = base64encode(templatefile("${path.module}/user_data.sh", {
    database_endpoint = var.database_endpoint
  }))

  tag_specifications {
    resource_type = "instance"
    tags = merge(var.tags, {
      Name = "${var.environment}-web-server"
      Type = "web"
    })
  }

  lifecycle {
    create_before_destroy = true
  }
}

# Auto Scaling Group
resource "aws_autoscaling_group" "web" {
  name                = "${var.environment}-web-asg"
  vpc_zone_identifier = var.private_subnet_ids
  target_group_arns   = [aws_lb_target_group.web.arn]
  health_check_type   = "ELB"
  health_check_grace_period = 300

  min_size         = var.min_size
  max_size         = var.max_size
  desired_capacity = var.desired_capacity

  launch_template {
    id      = aws_launch_template.web.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "${var.environment}-web-asg"
    propagate_at_launch = false
  }

  dynamic "tag" {
    for_each = var.tags
    content {
      key                 = tag.key
      value               = tag.value
      propagate_at_launch = true
    }
  }
}

# Application Load Balancer
resource "aws_lb" "web" {
  name               = "${var.environment}-web-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.web_security_group_id]
  subnets            = var.public_subnet_ids

  enable_deletion_protection = false

  tags = merge(var.tags, {
    Name = "${var.environment}-web-alb"
  })
}

# Target Group
resource "aws_lb_target_group" "web" {
  name     = "${var.environment}-web-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = var.vpc_id

  health_check {
    enabled             = true
    healthy_threshold   = 2
    interval            = 30
    matcher             = "200"
    path                = "/health"
    port                = "traffic-port"
    protocol            = "HTTP"
    timeout             = 5
    unhealthy_threshold = 2
  }

  tags = merge(var.tags, {
    Name = "${var.environment}-web-tg"
  })
}

# Listener
resource "aws_lb_listener" "web" {
  load_balancer_arn = aws_lb.web.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.web.arn
  }
}

# IAM role for instances
resource "aws_iam_role" "web" {
  name = "${var.environment}-web-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })

  tags = var.tags
}

resource "aws_iam_instance_profile" "web" {
  name = "${var.environment}-web-profile"
  role = aws_iam_role.web.name
}

# Attach CloudWatch agent policy
resource "aws_iam_role_policy_attachment" "cloudwatch_agent" {
  role       = aws_iam_role.web.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy"
}

# Data source for AMI
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}
```

**modules/compute/user_data.sh:**
```bash
#!/bin/bash
yum update -y
yum install -y httpd mysql

# Install CloudWatch agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/amazon_linux/amd64/latest/amazon-cloudwatch-agent.rpm
rpm -U ./amazon-cloudwatch-agent.rpm

# Start and enable Apache
systemctl start httpd
systemctl enable httpd

# Create a simple web application
cat > /var/www/html/index.php << 'EOF'
<?php
$servername = "${database_endpoint}";
$username = "admin";
$password = "password";
$dbname = "webapp";

try {
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db_status = "Connected";
} catch(PDOException $e) {
    $db_status = "Connection failed: " . $e->getMessage();
}

$instance_id = file_get_contents('http://169.254.169.254/latest/meta-data/instance-id');
$az = file_get_contents('http://169.254.169.254/latest/meta-data/placement/availability-zone');
?>

<!DOCTYPE html>
<html>
<head>
    <title>Web Application</title>
</head>
<body>
    <h1>Hello from AWS!</h1>
    <p>Instance ID: <?php echo $instance_id; ?></p>
    <p>Availability Zone: <?php echo $az; ?></p>
    <p>Database Status: <?php echo $db_status; ?></p>
    <p>Timestamp: <?php echo date('Y-m-d H:i:s'); ?></p>
</body>
</html>
EOF

# Create health check endpoint
echo "OK" > /var/www/html/health

# Install PHP
yum install -y php php-mysql

# Restart Apache
systemctl restart httpd
```

### Project 2: GitOps Pipeline with Terraform Cloud

Set up a GitOps workflow using Terraform Cloud for automated infrastructure deployment.

**terraform-cloud-setup.tf:**
```hcl
terraform {
  cloud {
    organization = "my-org"
    
    workspaces {
      name = "production-infrastructure"
    }
  }
}

# Configure workspace variables via Terraform Cloud UI:
# - AWS_ACCESS_KEY_ID (sensitive)
# - AWS_SECRET_ACCESS_KEY (sensitive)
# - TF_VAR_environment = "production"
# - TF_VAR_db_password (sensitive)
```

**.github/workflows/terraform.yml:**
```yaml
name: 'Terraform'

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  terraform:
    name: 'Terraform'
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3

    - name: Setup Terraform
      uses: hashicorp/setup-terraform@v2
      with:
        cli_config_credentials_token: ${{ secrets.TF_API_TOKEN }}

    - name: Terraform Format
      id: fmt
      run: terraform fmt -check
      continue-on-error: true

    - name: Terraform Init
      id: init
      run: terraform init

    - name: Terraform Validate
      id: validate
      run: terraform validate -no-color

    - name: Terraform Plan
      id: plan
      if: github.event_name == 'pull_request'
      run: terraform plan -no-color
      continue-on-error: true

    - name: Update Pull Request
      uses: actions/github-script@v6
      if: github.event_name == 'pull_request'
      env:
        PLAN: "terraform\n${{ steps.plan.outputs.stdout }}"
      with:
        script: |
          const output = `#### Terraform Format and Style 🖌\`${{ steps.fmt.outcome }}\`
          #### Terraform Initialization ⚙️\`${{ steps.init.outcome }}\`
          #### Terraform Validation 🤖\`${{ steps.validate.outcome }}\`
          #### Terraform Plan 📖\`${{ steps.plan.outcome }}\`
          
          <details><summary>Show Plan</summary>
          
          \`\`\`\n
          ${process.env.PLAN}
          \`\`\`
          
          </details>`;
          
          github.rest.issues.createComment({
            issue_number: context.issue.number,
            owner: context.repo.owner,
            repo: context.repo.repo,
            body: output
          })

    - name: Terraform Plan Status
      if: steps.plan.outcome == 'failure'
      run: exit 1

    - name: Terraform Apply
      if: github.ref == 'refs/heads/main' && github.event_name == 'push'
      run: terraform apply -auto-approve
```

## IaC Best Practices

### Security Best Practices

**1. Secrets Management:**
```bash
# Never hardcode secrets in IaC files
# Use secret management services
# Rotate secrets regularly
# Use least privilege access

# Terraform example with AWS Secrets Manager
data "aws_secretsmanager_secret_version" "db_password" {
  secret_id = "prod/database/password"
}

resource "aws_db_instance" "main" {
  password = data.aws_secretsmanager_secret_version.db_password.secret_string
  # ... other configuration
}
```

**2. State File Security:**
```bash
# Use remote state storage
# Enable encryption at rest
# Implement state locking
# Restrict access to state files
# Regular state backups
```

**3. Resource Tagging:**
```hcl
# Consistent tagging strategy
variable "common_tags" {
  description = "Common tags for all resources"
  type        = map(string)
  default = {
    Environment   = "production"
    Project       = "web-app"
    Owner         = "devops-team"
    CostCenter    = "engineering"
    ManagedBy     = "terraform"
  }
}

# Apply tags to all resources
resource "aws_instance" "web" {
  # ... configuration
  
  tags = merge(var.common_tags, {
    Name = "web-server"
    Role = "frontend"
  })
}
```

### Code Organization

**1. Directory Structure:**
```
project/
├── environments/
│   ├── dev/
│   ├── staging/
│   └── prod/
├── modules/
│   ├── networking/
│   ├── compute/
│   └── database/
├── scripts/
└── docs/
```

**2. Module Design:**
```bash
# Single responsibility principle
# Reusable and composable
# Well-documented interfaces
# Semantic versioning for modules
# Input validation
```

**3. Environment Management:**
```hcl
# Use workspace or separate directories
# Environment-specific variables
# Consistent naming conventions
# Separate state files per environment
```

### Testing and Validation

**1. Static Analysis:**
```bash
# Terraform
terraform fmt -check
terraform validate
tflint

# CloudFormation
cfn-lint template.yaml
aws cloudformation validate-template --template-body file://template.yaml

# Ansible
ansible-lint playbook.yml
ansible-playbook --syntax-check playbook.yml
```

**2. Security Scanning:**
```bash
# Terraform security scanning
checkov -f main.tf
terrascan scan -t aws

# CloudFormation security scanning
cfn_nag_scan --input-path template.yaml
```

**3. Integration Testing:**
```bash
# Terratest for Terraform
# Kitchen for infrastructure testing
# Molecule for Ansible testing
```

## Free Learning Resources

### Terraform Resources
- [Terraform Documentation](https://www.terraform.io/docs) - Official Terraform documentation
- [Terraform Registry](https://registry.terraform.io/) - Modules and providers
- [HashiCorp Learn](https://learn.hashicorp.com/terraform) - Interactive tutorials
- [Terraform Best Practices](https://www.terraform-best-practices.com/) - Community best practices

### AWS CloudFormation Resources
- [CloudFormation Documentation](https://docs.aws.amazon.com/cloudformation/) - Official AWS documentation
- [CloudFormation Templates](https://aws.amazon.com/cloudformation/templates/) - Sample templates
- [AWS Quick Starts](https://aws.amazon.com/quickstart/) - Reference deployments

### Ansible Resources
- [Ansible Documentation](https://docs.ansible.com/) - Official Ansible documentation
- [Ansible Galaxy](https://galaxy.ansible.com/) - Community roles and collections
- [Ansible Examples](https://github.com/ansible/ansible-examples) - Example playbooks

### Practice Platforms
- [Terraform Cloud](https://cloud.hashicorp.com/products/terraform) - Free tier available
- [AWS Free Tier](https://aws.amazon.com/free/) - Practice with real AWS resources
- [Katacoda](https://www.katacoda.com/) - Interactive scenarios

## Next Steps

After mastering Infrastructure as Code:

1. **Advanced IaC**: Learn advanced Terraform features, custom providers
2. **GitOps**: Implement GitOps workflows with ArgoCD, Flux
3. **Policy as Code**: Open Policy Agent (OPA), Sentinel
4. **Multi-Cloud**: Terraform with multiple cloud providers
5. **Container Orchestration**: Kubernetes, Docker Swarm
6. **Join Communities**: 
   - [r/Terraform](https://www.reddit.com/r/Terraform/)
   - [HashiCorp Community](https://discuss.hashicorp.com/)

Continue to **Container Orchestration** to learn Docker and Kubernetes, or explore **Multi-Cloud Architecture** for advanced cloud strategies!
