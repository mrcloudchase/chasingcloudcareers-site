---
sidebar_position: 4
---

# Multi-Cloud Infrastructure and Networking

Master advanced infrastructure design and networking across multiple cloud platforms, implementing high availability, disaster recovery, and hybrid cloud solutions.

## Learning Objectives

By the end of this module, you will:
- Design and implement advanced multi-cloud networking architectures
- Master Infrastructure as Code (IaC) across AWS, Azure, and GCP
- Build high availability and disaster recovery solutions
- Implement hybrid and multi-cloud integration patterns
- Optimize network performance and security across cloud platforms

## 1. Advanced Multi-Cloud Networking

### Cross-Cloud Connectivity Patterns

**VPC Peering and Transit Gateways:**
```python
# Multi-cloud networking architecture comparison
class MultiCloudNetworking:
    def __init__(self):
        self.connectivity_options = {
            'aws': {
                'vpc_peering': {
                    'description': 'Direct connection between VPCs',
                    'limitations': 'No transitive routing, same region preferred',
                    'use_cases': ['Simple VPC-to-VPC connectivity', 'Low latency requirements']
                },
                'transit_gateway': {
                    'description': 'Central hub for VPC connectivity',
                    'limitations': 'Regional service, additional cost',
                    'use_cases': ['Complex multi-VPC architectures', 'Centralized routing']
                },
                'vpn_gateway': {
                    'description': 'IPSec VPN connections',
                    'limitations': 'Internet-dependent, variable performance',
                    'use_cases': ['Hybrid connectivity', 'Site-to-site connections']
                },
                'direct_connect': {
                    'description': 'Dedicated network connection',
                    'limitations': 'Higher cost, setup complexity',
                    'use_cases': ['High bandwidth requirements', 'Consistent performance']
                }
            },
            'azure': {
                'vnet_peering': {
                    'description': 'Direct connection between VNets',
                    'limitations': 'No transitive routing, address space overlap issues',
                    'use_cases': ['VNet-to-VNet connectivity', 'Resource sharing']
                },
                'virtual_wan': {
                    'description': 'Global transit network architecture',
                    'limitations': 'Complex setup, additional cost',
                    'use_cases': ['Global connectivity', 'SD-WAN integration']
                },
                'vpn_gateway': {
                    'description': 'Site-to-site and point-to-site VPN',
                    'limitations': 'Internet-dependent, throughput limits',
                    'use_cases': ['Hybrid connectivity', 'Remote access']
                },
                'expressroute': {
                    'description': 'Private connection to Azure',
                    'limitations': 'Higher cost, provider dependency',
                    'use_cases': ['Enterprise connectivity', 'High bandwidth']
                }
            },
            'gcp': {
                'vpc_peering': {
                    'description': 'Global VPC network peering',
                    'limitations': 'Subnet IP range restrictions',
                    'use_cases': ['Cross-project connectivity', 'Shared services']
                },
                'shared_vpc': {
                    'description': 'Centralized network management',
                    'limitations': 'Organization-level configuration',
                    'use_cases': ['Centralized network control', 'Resource sharing']
                },
                'cloud_vpn': {
                    'description': 'IPSec VPN connections',
                    'limitations': 'Internet-dependent, encryption overhead',
                    'use_cases': ['Hybrid connectivity', 'Multi-cloud connections']
                },
                'cloud_interconnect': {
                    'description': 'Dedicated connection to GCP',
                    'limitations': 'Location restrictions, setup complexity',
                    'use_cases': ['High bandwidth', 'Low latency requirements']
                }
            }
        }
    
    def compare_connectivity_options(self):
        """Compare connectivity options across cloud providers"""
        print("Multi-Cloud Connectivity Options Comparison:")
        print("=" * 60)
        
        for cloud, options in self.connectivity_options.items():
            print(f"\n{cloud.upper()} Connectivity Options:")
            for option_name, details in options.items():
                print(f"\n  {option_name.replace('_', ' ').title()}:")
                print(f"    Description: {details['description']}")
                print(f"    Limitations: {details['limitations']}")
                print(f"    Use Cases: {', '.join(details['use_cases'])}")

# Usage
networking = MultiCloudNetworking()
networking.compare_connectivity_options()
```

**Terraform Multi-Cloud Network Implementation:**
```hcl
# multi-cloud-network.tf - Terraform configuration for multi-cloud networking

# AWS Provider Configuration
provider "aws" {
  alias  = "us_west"
  region = "us-west-2"
}

provider "aws" {
  alias  = "us_east"
  region = "us-east-1"
}

# Azure Provider Configuration
provider "azurerm" {
  features {}
}

# GCP Provider Configuration
provider "google" {
  project = var.gcp_project_id
  region  = "us-central1"
}

# AWS VPC in US-West-2
resource "aws_vpc" "main_us_west" {
  provider             = aws.us_west
  cidr_block           = "10.1.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "main-vpc-us-west"
    Environment = "production"
    Cloud       = "aws"
  }
}

# AWS VPC in US-East-1
resource "aws_vpc" "main_us_east" {
  provider             = aws.us_east
  cidr_block           = "10.2.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "main-vpc-us-east"
    Environment = "production"
    Cloud       = "aws"
  }
}

# AWS Transit Gateway for multi-region connectivity
resource "aws_ec2_transit_gateway" "main" {
  provider                        = aws.us_west
  description                     = "Main Transit Gateway"
  default_route_table_association = "enable"
  default_route_table_propagation = "enable"

  tags = {
    Name = "main-tgw"
  }
}

# Azure Resource Group
resource "azurerm_resource_group" "main" {
  name     = "cloud-engineering-rg"
  location = "East US"

  tags = {
    Environment = "production"
    Cloud       = "azure"
  }
}

# Azure Virtual Network
resource "azurerm_virtual_network" "main" {
  name                = "main-vnet"
  address_space       = ["10.3.0.0/16"]
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name

  tags = {
    Environment = "production"
    Cloud       = "azure"
  }
}

# Azure Subnets
resource "azurerm_subnet" "public" {
  name                 = "public-subnet"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.3.1.0/24"]
}

resource "azurerm_subnet" "private" {
  name                 = "private-subnet"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.3.2.0/24"]
}

# GCP VPC Network
resource "google_compute_network" "main" {
  name                    = "main-vpc"
  auto_create_subnetworks = false
  routing_mode           = "GLOBAL"
}

# GCP Subnets
resource "google_compute_subnetwork" "public" {
  name          = "public-subnet"
  ip_cidr_range = "10.4.1.0/24"
  region        = "us-central1"
  network       = google_compute_network.main.id

  secondary_ip_range {
    range_name    = "pods"
    ip_cidr_range = "10.4.16.0/20"
  }

  secondary_ip_range {
    range_name    = "services"
    ip_cidr_range = "10.4.32.0/20"
  }
}

resource "google_compute_subnetwork" "private" {
  name          = "private-subnet"
  ip_cidr_range = "10.4.2.0/24"
  region        = "us-central1"
  network       = google_compute_network.main.id

  private_ip_google_access = true
}

# Cross-cloud VPN connections
resource "aws_vpn_gateway" "main" {
  provider = aws.us_west
  vpc_id   = aws_vpc.main_us_west.id

  tags = {
    Name = "main-vpn-gateway"
  }
}

resource "azurerm_virtual_network_gateway" "main" {
  name                = "main-vpn-gateway"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name

  type     = "Vpn"
  vpn_type = "RouteBased"

  active_active = false
  enable_bgp    = false
  sku           = "VpnGw1"

  ip_configuration {
    name                          = "vnetGatewayConfig"
    public_ip_address_id          = azurerm_public_ip.vpn_gateway.id
    private_ip_address_allocation = "Dynamic"
    subnet_id                     = azurerm_subnet.gateway.id
  }
}

resource "azurerm_public_ip" "vpn_gateway" {
  name                = "vpn-gateway-pip"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  allocation_method   = "Dynamic"
}

resource "azurerm_subnet" "gateway" {
  name                 = "GatewaySubnet"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.3.255.0/27"]
}

# GCP VPN Gateway
resource "google_compute_vpn_gateway" "main" {
  name    = "main-vpn-gateway"
  network = google_compute_network.main.id
  region  = "us-central1"
}

# Network Security Groups and Firewall Rules
resource "aws_security_group" "web" {
  provider    = aws.us_west
  name_prefix = "web-sg"
  vpc_id      = aws_vpc.main_us_west.id

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

  tags = {
    Name = "web-security-group"
  }
}

resource "azurerm_network_security_group" "web" {
  name                = "web-nsg"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name

  security_rule {
    name                       = "HTTP"
    priority                   = 1001
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "80"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  security_rule {
    name                       = "HTTPS"
    priority                   = 1002
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "443"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  tags = {
    Environment = "production"
  }
}

resource "google_compute_firewall" "web" {
  name    = "web-firewall"
  network = google_compute_network.main.name

  allow {
    protocol = "tcp"
    ports    = ["80", "443"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["web-server"]
}

# Variables
variable "gcp_project_id" {
  description = "GCP Project ID"
  type        = string
}

# Outputs
output "aws_vpc_id" {
  value = aws_vpc.main_us_west.id
}

output "azure_vnet_id" {
  value = azurerm_virtual_network.main.id
}

output "gcp_network_id" {
  value = google_compute_network.main.id
}
```

### Network Performance Optimization

**Global Load Balancing and Traffic Management:**
```python
# Global load balancing configuration across clouds
import json
from typing import Dict, List

class GlobalLoadBalancingConfig:
    def __init__(self):
        self.load_balancer_configs = {
            'aws_global_accelerator': {
                'service': 'AWS Global Accelerator',
                'type': 'Network Layer (Layer 4)',
                'features': [
                    'Anycast IP addresses',
                    'Global traffic distribution',
                    'Health checking and failover',
                    'DDoS protection',
                    'Performance insights'
                ],
                'routing_policies': [
                    'Performance-based routing',
                    'Geographic routing',
                    'Weighted routing'
                ]
            },
            'azure_traffic_manager': {
                'service': 'Azure Traffic Manager',
                'type': 'DNS-based (Layer 7)',
                'features': [
                    'DNS-based load balancing',
                    'Global endpoint monitoring',
                    'Automatic failover',
                    'Geographic routing',
                    'Nested profiles'
                ],
                'routing_policies': [
                    'Performance routing',
                    'Geographic routing',
                    'Priority routing',
                    'Weighted routing',
                    'Multivalue routing'
                ]
            },
            'azure_front_door': {
                'service': 'Azure Front Door',
                'type': 'Application Layer (Layer 7)',
                'features': [
                    'Global HTTP load balancing',
                    'SSL termination',
                    'Web Application Firewall',
                    'URL-based routing',
                    'Session affinity'
                ],
                'routing_policies': [
                    'Latency-based routing',
                    'Priority-based routing',
                    'Weighted routing'
                ]
            },
            'gcp_global_load_balancer': {
                'service': 'Google Cloud Load Balancing',
                'type': 'Global (Layer 4 and 7)',
                'features': [
                    'Global anycast VIPs',
                    'Cross-region load balancing',
                    'Autoscaling integration',
                    'SSL termination',
                    'Cloud CDN integration'
                ],
                'routing_policies': [
                    'Round robin',
                    'Least connections',
                    'IP hash',
                    'Geographic routing'
                ]
            }
        }
    
    def generate_aws_global_accelerator_config(self, endpoints: List[Dict]) -> str:
        """Generate AWS Global Accelerator configuration"""
        config = {
            "Name": "GlobalWebApp",
            "IpAddressType": "IPV4",
            "Enabled": True,
            "Attributes": {
                "FlowLogsEnabled": True,
                "FlowLogsS3Bucket": "global-accelerator-flow-logs",
                "FlowLogsS3Prefix": "flow-logs/"
            },
            "Listeners": [
                {
                    "Protocol": "TCP",
                    "PortRanges": [
                        {"From": 80, "To": 80},
                        {"From": 443, "To": 443}
                    ],
                    "ClientAffinity": "SOURCE_IP",
                    "EndpointGroups": []
                }
            ]
        }
        
        for endpoint in endpoints:
            endpoint_group = {
                "EndpointGroupRegion": endpoint["region"],
                "TrafficDialPercentage": endpoint.get("traffic_percentage", 100),
                "HealthCheckIntervalSeconds": 30,
                "HealthCheckPath": "/health",
                "Endpoints": [
                    {
                        "EndpointId": endpoint["endpoint_id"],
                        "Weight": endpoint.get("weight", 100)
                    }
                ]
            }
            config["Listeners"][0]["EndpointGroups"].append(endpoint_group)
        
        return json.dumps(config, indent=2)
    
    def generate_azure_traffic_manager_config(self, endpoints: List[Dict]) -> str:
        """Generate Azure Traffic Manager configuration"""
        config = {
            "type": "Microsoft.Network/trafficmanagerprofiles",
            "apiVersion": "2018-08-01",
            "name": "global-web-app-tm",
            "location": "global",
            "properties": {
                "profileStatus": "Enabled",
                "trafficRoutingMethod": "Performance",
                "dnsConfig": {
                    "relativeName": "global-web-app",
                    "ttl": 60
                },
                "monitorConfig": {
                    "protocol": "HTTPS",
                    "port": 443,
                    "path": "/health",
                    "intervalInSeconds": 30,
                    "timeoutInSeconds": 10,
                    "toleratedNumberOfFailures": 3
                },
                "endpoints": []
            }
        }
        
        for i, endpoint in enumerate(endpoints):
            endpoint_config = {
                "name": f"endpoint-{i+1}",
                "type": "Microsoft.Network/trafficManagerProfiles/azureEndpoints",
                "properties": {
                    "endpointStatus": "Enabled",
                    "targetResourceId": endpoint["resource_id"],
                    "weight": endpoint.get("weight", 100),
                    "priority": endpoint.get("priority", i+1),
                    "endpointLocation": endpoint["location"]
                }
            }
            config["properties"]["endpoints"].append(endpoint_config)
        
        return json.dumps(config, indent=2)
    
    def generate_gcp_global_lb_config(self, backends: List[Dict]) -> str:
        """Generate GCP Global Load Balancer configuration"""
        config = {
            "name": "global-web-app-lb",
            "description": "Global load balancer for web application",
            "urlMap": {
                "name": "global-web-app-url-map",
                "defaultService": "global-web-app-backend-service",
                "hostRules": [
                    {
                        "hosts": ["example.com", "www.example.com"],
                        "pathMatcher": "path-matcher-1"
                    }
                ],
                "pathMatchers": [
                    {
                        "name": "path-matcher-1",
                        "defaultService": "global-web-app-backend-service",
                        "pathRules": [
                            {
                                "paths": ["/api/*"],
                                "service": "api-backend-service"
                            }
                        ]
                    }
                ]
            },
            "backendService": {
                "name": "global-web-app-backend-service",
                "protocol": "HTTP",
                "timeoutSec": 30,
                "healthChecks": ["global-web-app-health-check"],
                "backends": []
            },
            "healthCheck": {
                "name": "global-web-app-health-check",
                "type": "HTTP",
                "httpHealthCheck": {
                    "port": 80,
                    "requestPath": "/health",
                    "checkIntervalSec": 30,
                    "timeoutSec": 10,
                    "unhealthyThreshold": 3,
                    "healthyThreshold": 2
                }
            }
        }
        
        for backend in backends:
            backend_config = {
                "group": backend["instance_group"],
                "balancingMode": "UTILIZATION",
                "maxUtilization": 0.8,
                "capacityScaler": backend.get("capacity_scaler", 1.0)
            }
            config["backendService"]["backends"].append(backend_config)
        
        return json.dumps(config, indent=2)
    
    def compare_global_load_balancing(self):
        """Compare global load balancing options"""
        print("Global Load Balancing Comparison:")
        print("=" * 50)
        
        for lb_type, config in self.load_balancer_configs.items():
            print(f"\n{config['service']} ({lb_type.upper()}):")
            print(f"  Type: {config['type']}")
            print("  Features:")
            for feature in config['features']:
                print(f"    - {feature}")
            print("  Routing Policies:")
            for policy in config['routing_policies']:
                print(f"    - {policy}")

# Usage example
global_lb = GlobalLoadBalancingConfig()
global_lb.compare_global_load_balancing()

# Generate sample configurations
aws_endpoints = [
    {"region": "us-west-2", "endpoint_id": "arn:aws:elasticloadbalancing:us-west-2:123456789012:loadbalancer/app/my-lb/50dc6c495c0c9188", "traffic_percentage": 70},
    {"region": "us-east-1", "endpoint_id": "arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/app/my-lb/50dc6c495c0c9188", "traffic_percentage": 30}
]

print("\nAWS Global Accelerator Configuration:")
print(global_lb.generate_aws_global_accelerator_config(aws_endpoints))
```

### Free Resources

- [AWS VPC Documentation](https://docs.aws.amazon.com/vpc/) - Complete VPC networking guide
- [Azure Virtual Network Documentation](https://docs.microsoft.com/en-us/azure/virtual-network/) - Azure networking fundamentals
- [Google Cloud VPC Documentation](https://cloud.google.com/vpc/docs) - GCP networking concepts
- [Terraform Multi-Cloud Examples](https://registry.terraform.io/browse/modules) - Infrastructure as Code templates

## 2. Infrastructure as Code (IaC) Mastery

### Advanced Terraform Patterns

**Multi-Cloud Terraform Modules:**
```hcl
# modules/multi-cloud-web-app/main.tf
# Reusable module for deploying web applications across clouds

variable "cloud_provider" {
  description = "Cloud provider (aws, azure, gcp)"
  type        = string
  validation {
    condition     = contains(["aws", "azure", "gcp"], var.cloud_provider)
    error_message = "Cloud provider must be aws, azure, or gcp."
  }
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "application_name" {
  description = "Application name"
  type        = string
}

variable "instance_count" {
  description = "Number of instances"
  type        = number
  default     = 2
}

variable "instance_type" {
  description = "Instance type/size"
  type        = string
  default     = "small"
}

# Local values for cloud-specific configurations
locals {
  instance_types = {
    aws = {
      small  = "t3.micro"
      medium = "t3.small"
      large  = "t3.medium"
    }
    azure = {
      small  = "Standard_B1s"
      medium = "Standard_B2s"
      large  = "Standard_B4ms"
    }
    gcp = {
      small  = "e2-micro"
      medium = "e2-small"
      large  = "e2-medium"
    }
  }
  
  common_tags = {
    Environment   = var.environment
    Application   = var.application_name
    ManagedBy     = "terraform"
    CloudProvider = var.cloud_provider
  }
}

# AWS Resources
resource "aws_instance" "web" {
  count         = var.cloud_provider == "aws" ? var.instance_count : 0
  ami           = data.aws_ami.ubuntu[0].id
  instance_type = local.instance_types.aws[var.instance_type]
  
  vpc_security_group_ids = [aws_security_group.web[0].id]
  subnet_id              = data.aws_subnets.public[0].ids[count.index % length(data.aws_subnets.public[0].ids)]
  
  user_data = base64encode(templatefile("${path.module}/scripts/user_data.sh", {
    application_name = var.application_name
  }))
  
  tags = merge(local.common_tags, {
    Name = "${var.application_name}-web-${count.index + 1}"
  })
}

resource "aws_security_group" "web" {
  count       = var.cloud_provider == "aws" ? 1 : 0
  name_prefix = "${var.application_name}-web-"
  vpc_id      = data.aws_vpc.default[0].id
  
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
    Name = "${var.application_name}-web-sg"
  })
}

# Azure Resources
resource "azurerm_linux_virtual_machine" "web" {
  count               = var.cloud_provider == "azure" ? var.instance_count : 0
  name                = "${var.application_name}-web-${count.index + 1}"
  resource_group_name = data.azurerm_resource_group.main[0].name
  location            = data.azurerm_resource_group.main[0].location
  size                = local.instance_types.azure[var.instance_type]
  
  disable_password_authentication = true
  
  network_interface_ids = [azurerm_network_interface.web[count.index].id]
  
  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }
  
  source_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-focal"
    sku       = "20_04-lts-gen2"
    version   = "latest"
  }
  
  admin_username = "azureuser"
  
  admin_ssh_key {
    username   = "azureuser"
    public_key = file("~/.ssh/id_rsa.pub")
  }
  
  custom_data = base64encode(templatefile("${path.module}/scripts/user_data.sh", {
    application_name = var.application_name
  }))
  
  tags = local.common_tags
}

resource "azurerm_network_interface" "web" {
  count               = var.cloud_provider == "azure" ? var.instance_count : 0
  name                = "${var.application_name}-web-nic-${count.index + 1}"
  location            = data.azurerm_resource_group.main[0].location
  resource_group_name = data.azurerm_resource_group.main[0].name
  
  ip_configuration {
    name                          = "internal"
    subnet_id                     = data.azurerm_subnet.public[0].id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.web[count.index].id
  }
  
  tags = local.common_tags
}

resource "azurerm_public_ip" "web" {
  count               = var.cloud_provider == "azure" ? var.instance_count : 0
  name                = "${var.application_name}-web-pip-${count.index + 1}"
  resource_group_name = data.azurerm_resource_group.main[0].name
  location            = data.azurerm_resource_group.main[0].location
  allocation_method   = "Static"
  
  tags = local.common_tags
}

# GCP Resources
resource "google_compute_instance" "web" {
  count        = var.cloud_provider == "gcp" ? var.instance_count : 0
  name         = "${var.application_name}-web-${count.index + 1}"
  machine_type = local.instance_types.gcp[var.instance_type]
  zone         = data.google_compute_zones.available[0].names[count.index % length(data.google_compute_zones.available[0].names)]
  
  boot_disk {
    initialize_params {
      image = data.google_compute_image.ubuntu[0].self_link
    }
  }
  
  network_interface {
    network    = data.google_compute_network.default[0].self_link
    subnetwork = data.google_compute_subnetwork.default[0].self_link
    
    access_config {
      // Ephemeral public IP
    }
  }
  
  metadata_startup_script = templatefile("${path.module}/scripts/user_data.sh", {
    application_name = var.application_name
  })
  
  tags = ["web-server", var.environment]
  
  labels = {
    environment   = var.environment
    application   = var.application_name
    managed_by    = "terraform"
    cloud_provider = var.cloud_provider
  }
}

# Data sources for each cloud provider
data "aws_vpc" "default" {
  count   = var.cloud_provider == "aws" ? 1 : 0
  default = true
}

data "aws_subnets" "public" {
  count = var.cloud_provider == "aws" ? 1 : 0
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default[0].id]
  }
}

data "aws_ami" "ubuntu" {
  count       = var.cloud_provider == "aws" ? 1 : 0
  most_recent = true
  owners      = ["099720109477"] # Canonical
  
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"]
  }
}

data "azurerm_resource_group" "main" {
  count = var.cloud_provider == "azure" ? 1 : 0
  name  = "cloud-engineering-rg"
}

data "azurerm_subnet" "public" {
  count                = var.cloud_provider == "azure" ? 1 : 0
  name                 = "public-subnet"
  virtual_network_name = "main-vnet"
  resource_group_name  = data.azurerm_resource_group.main[0].name
}

data "google_compute_network" "default" {
  count = var.cloud_provider == "gcp" ? 1 : 0
  name  = "default"
}

data "google_compute_subnetwork" "default" {
  count  = var.cloud_provider == "gcp" ? 1 : 0
  name   = "default"
  region = "us-central1"
}

data "google_compute_image" "ubuntu" {
  count   = var.cloud_provider == "gcp" ? 1 : 0
  family  = "ubuntu-2004-lts"
  project = "ubuntu-os-cloud"
}

data "google_compute_zones" "available" {
  count  = var.cloud_provider == "gcp" ? 1 : 0
  region = "us-central1"
}

# Outputs
output "instance_ips" {
  description = "Public IP addresses of web instances"
  value = var.cloud_provider == "aws" ? aws_instance.web[*].public_ip : (
    var.cloud_provider == "azure" ? azurerm_public_ip.web[*].ip_address : 
    google_compute_instance.web[*].network_interface.0.access_config.0.nat_ip
  )
}

output "instance_ids" {
  description = "Instance IDs"
  value = var.cloud_provider == "aws" ? aws_instance.web[*].id : (
    var.cloud_provider == "azure" ? azurerm_linux_virtual_machine.web[*].id : 
    google_compute_instance.web[*].id
  )
}
```

**Terraform Workspace Management:**
```bash
#!/bin/bash
# terraform-multi-cloud-deploy.sh - Deploy to multiple clouds with workspaces

set -euo pipefail

# Configuration
ENVIRONMENTS=("dev" "staging" "production")
CLOUDS=("aws" "azure" "gcp")
TERRAFORM_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
}

check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if terraform is installed
    if ! command -v terraform &> /dev/null; then
        error "Terraform is not installed"
    fi
    
    # Check cloud CLI tools
    if ! command -v aws &> /dev/null; then
        warn "AWS CLI is not installed"
    fi
    
    if ! command -v az &> /dev/null; then
        warn "Azure CLI is not installed"
    fi
    
    if ! command -v gcloud &> /dev/null; then
        warn "Google Cloud SDK is not installed"
    fi
    
    log "Prerequisites check completed"
}

init_terraform() {
    local environment=$1
    local cloud=$2
    local workspace_name="${environment}-${cloud}"
    
    log "Initializing Terraform for workspace: $workspace_name"
    
    cd "$TERRAFORM_DIR"
    
    # Initialize terraform
    terraform init -reconfigure
    
    # Create or select workspace
    if terraform workspace list | grep -q "$workspace_name"; then
        terraform workspace select "$workspace_name"
    else
        terraform workspace new "$workspace_name"
    fi
    
    log "Terraform initialized for workspace: $workspace_name"
}

plan_infrastructure() {
    local environment=$1
    local cloud=$2
    local workspace_name="${environment}-${cloud}"
    
    log "Planning infrastructure for workspace: $workspace_name"
    
    cd "$TERRAFORM_DIR"
    terraform workspace select "$workspace_name"
    
    # Generate plan
    terraform plan \
        -var="environment=$environment" \
        -var="cloud_provider=$cloud" \
        -var-file="environments/${environment}.tfvars" \
        -out="${workspace_name}.tfplan"
    
    log "Plan generated for workspace: $workspace_name"
}

apply_infrastructure() {
    local environment=$1
    local cloud=$2
    local workspace_name="${environment}-${cloud}"
    
    log "Applying infrastructure for workspace: $workspace_name"
    
    cd "$TERRAFORM_DIR"
    terraform workspace select "$workspace_name"
    
    # Apply the plan
    if [[ -f "${workspace_name}.tfplan" ]]; then
        terraform apply "${workspace_name}.tfplan"
        rm "${workspace_name}.tfplan"
    else
        warn "No plan file found, running apply with auto-approve"
        terraform apply \
            -var="environment=$environment" \
            -var="cloud_provider=$cloud" \
            -var-file="environments/${environment}.tfvars" \
            -auto-approve
    fi
    
    log "Infrastructure applied for workspace: $workspace_name"
}

destroy_infrastructure() {
    local environment=$1
    local cloud=$2
    local workspace_name="${environment}-${cloud}"
    
    if [[ "$environment" == "production" ]]; then
        error "Cannot destroy production environment with this script"
    fi
    
    warn "This will destroy all infrastructure in workspace: $workspace_name"
    read -p "Are you sure? Type 'yes' to confirm: " confirmation
    
    if [[ "$confirmation" != "yes" ]]; then
        log "Destruction cancelled"
        return
    fi
    
    log "Destroying infrastructure for workspace: $workspace_name"
    
    cd "$TERRAFORM_DIR"
    terraform workspace select "$workspace_name"
    
    terraform destroy \
        -var="environment=$environment" \
        -var="cloud_provider=$cloud" \
        -var-file="environments/${environment}.tfvars" \
        -auto-approve
    
    log "Infrastructure destroyed for workspace: $workspace_name"
}

deploy_multi_cloud() {
    local environment=$1
    
    log "Starting multi-cloud deployment for environment: $environment"
    
    for cloud in "${CLOUDS[@]}"; do
        info "Deploying to $cloud..."
        init_terraform "$environment" "$cloud"
        plan_infrastructure "$environment" "$cloud"
        apply_infrastructure "$environment" "$cloud"
    done
    
    log "Multi-cloud deployment completed for environment: $environment"
}

show_status() {
    log "Terraform workspace status:"
    
    cd "$TERRAFORM_DIR"
    terraform workspace list
    
    echo
    log "Current workspace resources:"
    terraform show -json | jq -r '.values.root_module.resources[]? | "\(.type): \(.name)"' 2>/dev/null || echo "No resources found"
}

show_usage() {
    cat << EOF
Usage: $0 <command> [environment] [cloud]

Commands:
    init <env> <cloud>      Initialize Terraform for specific environment and cloud
    plan <env> <cloud>      Generate execution plan
    apply <env> <cloud>     Apply infrastructure changes
    destroy <env> <cloud>   Destroy infrastructure (not allowed for production)
    deploy-multi <env>      Deploy to all clouds for environment
    status                  Show workspace status
    
Environments: ${ENVIRONMENTS[*]}
Clouds: ${CLOUDS[*]}

Examples:
    $0 init dev aws
    $0 plan staging azure
    $0 apply production gcp
    $0 deploy-multi dev
    $0 status
EOF
}

main() {
    if [[ $# -lt 1 ]]; then
        show_usage
        exit 1
    fi
    
    local command=$1
    
    check_prerequisites
    
    case $command in
        init)
            if [[ $# -ne 3 ]]; then
                error "Usage: $0 init <environment> <cloud>"
            fi
            init_terraform "$2" "$3"
            ;;
        plan)
            if [[ $# -ne 3 ]]; then
                error "Usage: $0 plan <environment> <cloud>"
            fi
            init_terraform "$2" "$3"
            plan_infrastructure "$2" "$3"
            ;;
        apply)
            if [[ $# -ne 3 ]]; then
                error "Usage: $0 apply <environment> <cloud>"
            fi
            init_terraform "$2" "$3"
            apply_infrastructure "$2" "$3"
            ;;
        destroy)
            if [[ $# -ne 3 ]]; then
                error "Usage: $0 destroy <environment> <cloud>"
            fi
            init_terraform "$2" "$3"
            destroy_infrastructure "$2" "$3"
            ;;
        deploy-multi)
            if [[ $# -ne 2 ]]; then
                error "Usage: $0 deploy-multi <environment>"
            fi
            deploy_multi_cloud "$2"
            ;;
        status)
            show_status
            ;;
        *)
            error "Unknown command: $command"
            ;;
    esac
}

main "$@"
```

### Free Resources

- [Terraform Documentation](https://www.terraform.io/docs) - Complete Terraform reference
- [Terraform Registry](https://registry.terraform.io/) - Pre-built modules and providers
- [AWS CloudFormation Templates](https://aws.amazon.com/cloudformation/templates/) - AWS infrastructure templates
- [Azure Resource Manager Templates](https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/) - Azure ARM templates

## 3. High Availability and Disaster Recovery

### Multi-Region Deployment Strategies

**Disaster Recovery Planning:**
```python
# Disaster recovery planning and implementation across clouds
import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional

class DisasterRecoveryPlanner:
    def __init__(self):
        self.recovery_strategies = {
            'backup_restore': {
                'rto': '4-24 hours',
                'rpo': '1-24 hours',
                'cost': 'Low',
                'complexity': 'Low',
                'description': 'Restore from backups in alternate region'
            },
            'pilot_light': {
                'rto': '1-4 hours',
                'rpo': '15 minutes - 1 hour',
                'cost': 'Medium',
                'complexity': 'Medium',
                'description': 'Minimal infrastructure running in DR region'
            },
            'warm_standby': {
                'rto': '15 minutes - 1 hour',
                'rpo': '5-15 minutes',
                'cost': 'High',
                'complexity': 'High',
                'description': 'Scaled-down version running in DR region'
            },
            'hot_standby': {
                'rto': '0-15 minutes',
                'rpo': '0-5 minutes',
                'cost': 'Very High',
                'complexity': 'Very High',
                'description': 'Full duplicate environment with real-time sync'
            }
        }
    
    def calculate_business_impact(self, 
                                 annual_revenue: float, 
                                 downtime_hours: float,
                                 recovery_costs: float) -> Dict:
        """Calculate business impact of downtime"""
        hourly_revenue = annual_revenue / (365 * 24)
        revenue_loss = hourly_revenue * downtime_hours
        total_impact = revenue_loss + recovery_costs
        
        return {
            'hourly_revenue': hourly_revenue,
            'revenue_loss': revenue_loss,
            'recovery_costs': recovery_costs,
            'total_impact': total_impact,
            'impact_percentage': (total_impact / annual_revenue) * 100
        }
    
    def recommend_dr_strategy(self, 
                            business_criticality: str,
                            budget_constraint: str,
                            technical_complexity: str) -> str:
        """Recommend DR strategy based on requirements"""
        
        # Define scoring matrix
        strategy_scores = {
            'backup_restore': 0,
            'pilot_light': 0,
            'warm_standby': 0,
            'hot_standby': 0
        }
        
        # Business criticality scoring
        if business_criticality == 'critical':
            strategy_scores['hot_standby'] += 3
            strategy_scores['warm_standby'] += 2
            strategy_scores['pilot_light'] += 1
        elif business_criticality == 'high':
            strategy_scores['warm_standby'] += 3
            strategy_scores['pilot_light'] += 2
            strategy_scores['hot_standby'] += 1
        elif business_criticality == 'medium':
            strategy_scores['pilot_light'] += 3
            strategy_scores['warm_standby'] += 2
            strategy_scores['backup_restore'] += 1
        else:  # low
            strategy_scores['backup_restore'] += 3
            strategy_scores['pilot_light'] += 1
        
        # Budget constraint scoring
        if budget_constraint == 'unlimited':
            strategy_scores['hot_standby'] += 2
            strategy_scores['warm_standby'] += 1
        elif budget_constraint == 'high':
            strategy_scores['warm_standby'] += 2
            strategy_scores['pilot_light'] += 1
        elif budget_constraint == 'medium':
            strategy_scores['pilot_light'] += 2
            strategy_scores['backup_restore'] += 1
        else:  # low
            strategy_scores['backup_restore'] += 2
        
        # Technical complexity scoring
        if technical_complexity == 'high':
            strategy_scores['hot_standby'] += 2
            strategy_scores['warm_standby'] += 1
        elif technical_complexity == 'medium':
            strategy_scores['warm_standby'] += 2
            strategy_scores['pilot_light'] += 1
        else:  # low
            strategy_scores['pilot_light'] += 1
            strategy_scores['backup_restore'] += 2
        
        # Find best strategy
        best_strategy = max(strategy_scores, key=strategy_scores.get)
        return best_strategy
    
    def generate_dr_plan(self, 
                        application_name: str,
                        primary_region: str,
                        dr_region: str,
                        strategy: str) -> Dict:
        """Generate comprehensive DR plan"""
        
        plan = {
            'application': application_name,
            'primary_region': primary_region,
            'dr_region': dr_region,
            'strategy': strategy,
            'strategy_details': self.recovery_strategies[strategy],
            'implementation_steps': [],
            'testing_schedule': {},
            'roles_responsibilities': {},
            'communication_plan': {},
            'recovery_procedures': {}
        }
        
        # Implementation steps based on strategy
        if strategy == 'backup_restore':
            plan['implementation_steps'] = [
                'Set up automated backups in primary region',
                'Configure cross-region backup replication',
                'Create infrastructure templates for DR region',
                'Document restoration procedures',
                'Set up monitoring and alerting'
            ]
        elif strategy == 'pilot_light':
            plan['implementation_steps'] = [
                'Deploy minimal infrastructure in DR region',
                'Set up data replication to DR region',
                'Create auto-scaling configurations',
                'Configure DNS failover',
                'Implement health checks and monitoring'
            ]
        elif strategy == 'warm_standby':
            plan['implementation_steps'] = [
                'Deploy scaled-down infrastructure in DR region',
                'Configure real-time data synchronization',
                'Set up load balancer with health checks',
                'Implement automated failover procedures',
                'Configure monitoring and alerting'
            ]
        elif strategy == 'hot_standby':
            plan['implementation_steps'] = [
                'Deploy full infrastructure in DR region',
                'Configure active-active data replication',
                'Set up global load balancing',
                'Implement automatic failover',
                'Configure comprehensive monitoring'
            ]
        
        # Testing schedule
        plan['testing_schedule'] = {
            'backup_testing': 'Monthly',
            'failover_testing': 'Quarterly',
            'full_dr_drill': 'Semi-annually',
            'communication_test': 'Monthly'
        }
        
        # Roles and responsibilities
        plan['roles_responsibilities'] = {
            'incident_commander': 'Senior Operations Manager',
            'technical_lead': 'Principal Cloud Engineer',
            'communication_lead': 'IT Manager',
            'business_stakeholder': 'Product Owner',
            'external_vendors': 'Cloud Provider Support'
        }
        
        return plan
    
    def generate_aws_dr_config(self, primary_region: str, dr_region: str) -> str:
        """Generate AWS-specific DR configuration"""
        config = {
            'primary_region': primary_region,
            'dr_region': dr_region,
            'services': {
                'rds': {
                    'cross_region_backup': True,
                    'read_replica': True,
                    'automated_backup_retention': 7
                },
                's3': {
                    'cross_region_replication': True,
                    'versioning': True,
                    'lifecycle_policies': True
                },
                'ec2': {
                    'ami_copying': True,
                    'snapshot_copying': True,
                    'launch_templates': True
                },
                'route53': {
                    'health_checks': True,
                    'failover_routing': True,
                    'dns_failover': True
                }
            },
            'automation': {
                'lambda_functions': [
                    'automated-failover',
                    'health-monitoring',
                    'backup-verification'
                ],
                'cloudformation_templates': [
                    'dr-infrastructure',
                    'networking-setup',
                    'security-groups'
                ]
            }
        }
        return json.dumps(config, indent=2)
    
    def compare_dr_strategies(self):
        """Compare disaster recovery strategies"""
        print("Disaster Recovery Strategies Comparison:")
        print("=" * 60)
        
        for strategy, details in self.recovery_strategies.items():
            print(f"\n{strategy.replace('_', ' ').title()}:")
            print(f"  RTO: {details['rto']}")
            print(f"  RPO: {details['rpo']}")
            print(f"  Cost: {details['cost']}")
            print(f"  Complexity: {details['complexity']}")
            print(f"  Description: {details['description']}")

# Usage example
dr_planner = DisasterRecoveryPlanner()

# Compare strategies
dr_planner.compare_dr_strategies()

# Calculate business impact
business_impact = dr_planner.calculate_business_impact(
    annual_revenue=10000000,  # $10M annual revenue
    downtime_hours=4,         # 4 hours downtime
    recovery_costs=50000      # $50K recovery costs
)

print(f"\nBusiness Impact Analysis:")
print(f"Hourly Revenue: ${business_impact['hourly_revenue']:,.2f}")
print(f"Revenue Loss: ${business_impact['revenue_loss']:,.2f}")
print(f"Total Impact: ${business_impact['total_impact']:,.2f}")
print(f"Impact Percentage: {business_impact['impact_percentage']:.2f}%")

# Get DR strategy recommendation
recommended_strategy = dr_planner.recommend_dr_strategy(
    business_criticality='high',
    budget_constraint='medium',
    technical_complexity='medium'
)

print(f"\nRecommended DR Strategy: {recommended_strategy.replace('_', ' ').title()}")

# Generate DR plan
dr_plan = dr_planner.generate_dr_plan(
    application_name='E-commerce Platform',
    primary_region='us-west-2',
    dr_region='us-east-1',
    strategy=recommended_strategy
)

print(f"\nDR Plan Implementation Steps:")
for i, step in enumerate(dr_plan['implementation_steps'], 1):
    print(f"  {i}. {step}")
```

### Free Resources

- [AWS Disaster Recovery](https://aws.amazon.com/disaster-recovery/) - AWS DR strategies and services
- [Azure Site Recovery](https://docs.microsoft.com/en-us/azure/site-recovery/) - Azure disaster recovery solutions
- [Google Cloud Disaster Recovery](https://cloud.google.com/architecture/disaster-recovery) - GCP DR planning guide
- [Multi-Cloud DR Best Practices](https://cloud.google.com/architecture/disaster-recovery-planning-guide) - Cross-cloud DR strategies

## Hands-On Exercises

### Exercise 1: Multi-Cloud Network Architecture

**Task:** Design and implement a global network architecture spanning AWS, Azure, and GCP.

**Requirements:**
- VPC/VNet setup in each cloud with proper CIDR planning
- Cross-cloud connectivity using VPN or dedicated connections
- Global load balancing and traffic management
- Network security implementation with firewalls and security groups
- Performance monitoring and optimization

### Exercise 2: Infrastructure as Code Multi-Cloud Deployment

**Task:** Create reusable Terraform modules for multi-cloud application deployment.

**Requirements:**
- Develop cloud-agnostic Terraform modules
- Implement proper variable management and outputs
- Create environment-specific configurations
- Set up automated testing and validation
- Document module usage and best practices

### Exercise 3: Disaster Recovery Implementation

**Task:** Implement a comprehensive disaster recovery solution.

**Requirements:**
- Choose appropriate DR strategy based on business requirements
- Set up cross-region data replication and backup
- Implement automated failover mechanisms
- Create DR testing and validation procedures
- Document recovery procedures and runbooks

## Assessment Questions

1. **Design a multi-cloud network architecture that provides high availability and optimal performance for a global application.**

2. **Compare different Infrastructure as Code tools and recommend the best approach for a multi-cloud environment.**

3. **Develop a comprehensive disaster recovery strategy that balances cost, complexity, and business requirements.**

4. **Implement network security controls that work consistently across AWS, Azure, and GCP.**

5. **Design a global load balancing solution that can handle traffic distribution across multiple cloud providers.**

## Next Steps

After completing this module:

1. **Build complex multi-cloud architectures** using advanced networking patterns
2. **Master Infrastructure as Code** with Terraform and cloud-native tools
3. **Implement disaster recovery solutions** for critical applications
4. **Move to Module 3: Cloud Security and Compliance** to learn advanced security practices

## Additional Resources

### Advanced Networking
- [AWS Advanced Networking](https://aws.amazon.com/products/networking/) - AWS networking services
- [Azure Networking Documentation](https://docs.microsoft.com/en-us/azure/networking/) - Azure networking fundamentals
- [Google Cloud Networking](https://cloud.google.com/products/networking) - GCP networking solutions
- [Multi-Cloud Networking Patterns](https://cloud.google.com/architecture/networking) - Architecture patterns

### Infrastructure as Code
- [Terraform Best Practices](https://www.terraform.io/docs/cloud/guides/recommended-practices/index.html) - Terraform optimization
- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/) - AWS Cloud Development Kit
- [Azure Bicep](https://docs.microsoft.com/en-us/azure/azure-resource-manager/bicep/) - Azure infrastructure language
- [Google Cloud Deployment Manager](https://cloud.google.com/deployment-manager/docs) - GCP infrastructure automation

Ready to secure your multi-cloud infrastructure? Continue to **Module 3: Cloud Security and Compliance** to master advanced security practices!
