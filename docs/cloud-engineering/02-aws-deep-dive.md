---
sidebar_position: 3
---

# AWS Deep Dive

Master Amazon Web Services (AWS), the world's most comprehensive and widely adopted cloud platform, with hands-on examples and real-world scenarios.

## AWS Global Infrastructure

Understanding AWS infrastructure is crucial for designing resilient and performant applications.

### Regions and Availability Zones

**AWS Regions:**
```bash
# A region is a physical location with multiple data centers
# Each region is completely independent
# Choose regions based on:
- Latency to users
- Data sovereignty requirements
- Service availability
- Cost considerations

# Major AWS Regions:
us-east-1      # N. Virginia (largest, most services)
us-west-2      # Oregon
eu-west-1      # Ireland
ap-southeast-1 # Singapore
```

**Availability Zones (AZs):**
```bash
# AZs are isolated data centers within a region
# Each region has 2-6 AZs (typically 3)
# AZs are connected by high-speed, low-latency networking
# Design for multi-AZ deployment for high availability

# Example: us-east-1 AZs
us-east-1a
us-east-1b
us-east-1c
us-east-1d
us-east-1e
us-east-1f
```

**Edge Locations:**
```bash
# Content delivery network (CDN) endpoints
# 400+ edge locations globally
# Used by CloudFront and other services
# Bring content closer to users
```

### AWS CLI Setup and Configuration

**Installing AWS CLI:**
```bash
# Linux/macOS
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Verify installation
aws --version

# Windows (PowerShell)
msiexec.exe /i https://awscli.amazonaws.com/AWSCLIV2.msi
```

**AWS CLI Configuration:**
```bash
# Configure default profile
aws configure
# AWS Access Key ID: [Enter your access key]
# AWS Secret Access Key: [Enter your secret key]
# Default region name: us-east-1
# Default output format: json

# Configure named profiles
aws configure --profile production
aws configure --profile development

# Use specific profile
aws s3 ls --profile production

# Set environment variables
export AWS_PROFILE=production
export AWS_DEFAULT_REGION=us-east-1
```

**AWS CLI Best Practices:**
```bash
# Use IAM roles instead of access keys when possible
# Rotate access keys regularly
# Use least privilege principle
# Enable MFA for sensitive operations
# Use AWS CLI profiles for different environments
```

## Core AWS Services

### Compute Services

**Amazon EC2 (Elastic Compute Cloud):**

EC2 provides scalable virtual servers in the cloud.

**Instance Types:**
```bash
# General Purpose
t3.micro    # Burstable, 1 vCPU, 1 GB RAM (Free Tier)
t3.small    # Burstable, 2 vCPU, 2 GB RAM
m5.large    # Balanced, 2 vCPU, 8 GB RAM

# Compute Optimized
c5.large    # High-performance processors
c5.xlarge   # CPU-intensive applications

# Memory Optimized
r5.large    # High memory-to-vCPU ratio
x1e.xlarge  # High memory applications

# Storage Optimized
i3.large    # High sequential read/write
d2.xlarge   # Distributed file systems
```

**Launching EC2 Instances:**
```bash
# List available AMIs (Amazon Machine Images)
aws ec2 describe-images \
    --owners amazon \
    --filters "Name=name,Values=amzn2-ami-hvm-*" \
    --query 'Images[*].[ImageId,Name,CreationDate]' \
    --output table

# Create key pair
aws ec2 create-key-pair \
    --key-name MyKeyPair \
    --query 'KeyMaterial' \
    --output text > MyKeyPair.pem
chmod 400 MyKeyPair.pem

# Launch instance
aws ec2 run-instances \
    --image-id ami-0abcdef1234567890 \
    --count 1 \
    --instance-type t3.micro \
    --key-name MyKeyPair \
    --security-group-ids sg-12345678 \
    --subnet-id subnet-12345678 \
    --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=MyWebServer}]'

# List instances
aws ec2 describe-instances \
    --query 'Reservations[*].Instances[*].[InstanceId,State.Name,PublicIpAddress,Tags[?Key==`Name`].Value|[0]]' \
    --output table
```

**EC2 User Data (Bootstrap Scripts):**
```bash
#!/bin/bash
# This script runs when the instance first starts

# Update system
yum update -y

# Install Apache web server
yum install -y httpd

# Start Apache and enable auto-start
systemctl start httpd
systemctl enable httpd

# Create a simple web page
echo "<h1>Hello from AWS EC2!</h1>" > /var/www/html/index.html
echo "<p>Instance ID: $(curl -s http://169.254.169.254/latest/meta-data/instance-id)</p>" >> /var/www/html/index.html
echo "<p>Availability Zone: $(curl -s http://169.254.169.254/latest/meta-data/placement/availability-zone)</p>" >> /var/www/html/index.html

# Configure firewall
systemctl start firewalld
systemctl enable firewalld
firewall-cmd --permanent --add-service=http
firewall-cmd --reload
```

**AWS Lambda (Serverless Computing):**

Lambda runs code without provisioning servers.

**Creating a Lambda Function:**
```python
# lambda_function.py
import json
import boto3
from datetime import datetime

def lambda_handler(event, context):
    """
    Simple Lambda function that processes events
    """
    
    # Get current timestamp
    timestamp = datetime.now().isoformat()
    
    # Process the event
    message = event.get('message', 'Hello from Lambda!')
    
    # Example: Write to CloudWatch Logs
    print(f"Processing message: {message} at {timestamp}")
    
    # Example: Interact with other AWS services
    # s3 = boto3.client('s3')
    # dynamodb = boto3.resource('dynamodb')
    
    # Return response
    return {
        'statusCode': 200,
        'body': json.dumps({
            'message': message,
            'timestamp': timestamp,
            'function_name': context.function_name
        })
    }
```

**Deploying Lambda with AWS CLI:**
```bash
# Create deployment package
zip function.zip lambda_function.py

# Create Lambda function
aws lambda create-function \
    --function-name MyLambdaFunction \
    --runtime python3.9 \
    --role arn:aws:iam::123456789012:role/lambda-execution-role \
    --handler lambda_function.lambda_handler \
    --zip-file fileb://function.zip \
    --description "My first Lambda function"

# Invoke Lambda function
aws lambda invoke \
    --function-name MyLambdaFunction \
    --payload '{"message": "Hello from CLI!"}' \
    response.json

# View response
cat response.json
```

### Storage Services

**Amazon S3 (Simple Storage Service):**

S3 provides object storage with industry-leading scalability and durability.

**S3 Storage Classes:**
```bash
# Standard: Frequently accessed data
# Standard-IA: Infrequently accessed data
# One Zone-IA: Infrequently accessed, single AZ
# Glacier: Long-term archival (minutes to hours retrieval)
# Glacier Deep Archive: Long-term archival (12+ hours retrieval)
# Intelligent-Tiering: Automatic cost optimization
```

**S3 Operations:**
```bash
# Create bucket
aws s3 mb s3://my-unique-bucket-name-12345

# Upload file
aws s3 cp myfile.txt s3://my-unique-bucket-name-12345/

# Upload with metadata
aws s3 cp myfile.txt s3://my-unique-bucket-name-12345/ \
    --metadata "author=john,project=demo"

# Sync directory
aws s3 sync ./local-folder s3://my-unique-bucket-name-12345/remote-folder/

# List objects
aws s3 ls s3://my-unique-bucket-name-12345/ --recursive

# Download file
aws s3 cp s3://my-unique-bucket-name-12345/myfile.txt ./downloaded-file.txt

# Set public read access
aws s3api put-object-acl \
    --bucket my-unique-bucket-name-12345 \
    --key myfile.txt \
    --acl public-read
```

**S3 Bucket Policies:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::my-unique-bucket-name-12345/*"
    }
  ]
}
```

**Amazon EBS (Elastic Block Store):**

EBS provides persistent block storage for EC2 instances.

**EBS Volume Types:**
```bash
# General Purpose SSD (gp3/gp2)
# - Balanced price/performance
# - 3,000-16,000 IOPS
# - Use cases: Boot volumes, development environments

# Provisioned IOPS SSD (io2/io1)
# - High IOPS performance
# - Up to 64,000 IOPS
# - Use cases: Databases, I/O intensive applications

# Throughput Optimized HDD (st1)
# - Low cost, high throughput
# - Use cases: Big data, data warehouses

# Cold HDD (sc1)
# - Lowest cost
# - Use cases: Infrequent access
```

**EBS Operations:**
```bash
# Create EBS volume
aws ec2 create-volume \
    --size 10 \
    --volume-type gp3 \
    --availability-zone us-east-1a \
    --tag-specifications 'ResourceType=volume,Tags=[{Key=Name,Value=MyDataVolume}]'

# Attach volume to instance
aws ec2 attach-volume \
    --volume-id vol-12345678 \
    --instance-id i-12345678 \
    --device /dev/sdf

# Create snapshot
aws ec2 create-snapshot \
    --volume-id vol-12345678 \
    --description "Backup of MyDataVolume"

# List snapshots
aws ec2 describe-snapshots --owner-ids self
```

### Database Services

**Amazon RDS (Relational Database Service):**

RDS provides managed relational databases.

**Supported Database Engines:**
```bash
# MySQL
# PostgreSQL
# MariaDB
# Oracle
# Microsoft SQL Server
# Amazon Aurora (MySQL/PostgreSQL compatible)
```

**Creating RDS Instance:**
```bash
# Create DB subnet group
aws rds create-db-subnet-group \
    --db-subnet-group-name mydb-subnet-group \
    --db-subnet-group-description "Subnet group for my database" \
    --subnet-ids subnet-12345678 subnet-87654321

# Create RDS instance
aws rds create-db-instance \
    --db-instance-identifier mydb-instance \
    --db-instance-class db.t3.micro \
    --engine mysql \
    --master-username admin \
    --master-user-password MySecurePassword123 \
    --allocated-storage 20 \
    --db-subnet-group-name mydb-subnet-group \
    --vpc-security-group-ids sg-12345678 \
    --backup-retention-period 7 \
    --multi-az \
    --storage-encrypted

# Connect to RDS instance
mysql -h mydb-instance.abcdefghijk.us-east-1.rds.amazonaws.com -u admin -p
```

**Amazon DynamoDB (NoSQL Database):**

DynamoDB is a fully managed NoSQL database service.

**DynamoDB Operations:**
```bash
# Create table
aws dynamodb create-table \
    --table-name Users \
    --attribute-definitions \
        AttributeName=UserId,AttributeType=S \
    --key-schema \
        AttributeName=UserId,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST

# Put item
aws dynamodb put-item \
    --table-name Users \
    --item '{
        "UserId": {"S": "user123"},
        "Name": {"S": "John Doe"},
        "Email": {"S": "john@example.com"},
        "Age": {"N": "30"}
    }'

# Get item
aws dynamodb get-item \
    --table-name Users \
    --key '{"UserId": {"S": "user123"}}'

# Query items
aws dynamodb scan --table-name Users
```

### Networking Services

**Amazon VPC (Virtual Private Cloud):**

VPC provides isolated network environments in AWS.

**VPC Components:**
```bash
# VPC: Virtual network dedicated to your account
# Subnets: Range of IP addresses in your VPC
# Internet Gateway: Allows communication with internet
# NAT Gateway: Allows outbound internet access for private subnets
# Route Tables: Control where network traffic is directed
# Security Groups: Virtual firewalls for instances
# NACLs: Subnet-level security
```

**Creating VPC with CLI:**
```bash
# Create VPC
aws ec2 create-vpc \
    --cidr-block 10.0.0.0/16 \
    --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=MyVPC}]'

# Create Internet Gateway
aws ec2 create-internet-gateway \
    --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=MyIGW}]'

# Attach Internet Gateway to VPC
aws ec2 attach-internet-gateway \
    --internet-gateway-id igw-12345678 \
    --vpc-id vpc-12345678

# Create public subnet
aws ec2 create-subnet \
    --vpc-id vpc-12345678 \
    --cidr-block 10.0.1.0/24 \
    --availability-zone us-east-1a \
    --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=PublicSubnet}]'

# Create private subnet
aws ec2 create-subnet \
    --vpc-id vpc-12345678 \
    --cidr-block 10.0.2.0/24 \
    --availability-zone us-east-1b \
    --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=PrivateSubnet}]'

# Create route table for public subnet
aws ec2 create-route-table \
    --vpc-id vpc-12345678 \
    --tag-specifications 'ResourceType=route-table,Tags=[{Key=Name,Value=PublicRouteTable}]'

# Add route to internet gateway
aws ec2 create-route \
    --route-table-id rtb-12345678 \
    --destination-cidr-block 0.0.0.0/0 \
    --gateway-id igw-12345678

# Associate route table with subnet
aws ec2 associate-route-table \
    --route-table-id rtb-12345678 \
    --subnet-id subnet-12345678
```

**Security Groups:**
```bash
# Create security group
aws ec2 create-security-group \
    --group-name WebServerSG \
    --description "Security group for web servers" \
    --vpc-id vpc-12345678

# Add inbound rules
aws ec2 authorize-security-group-ingress \
    --group-id sg-12345678 \
    --protocol tcp \
    --port 80 \
    --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
    --group-id sg-12345678 \
    --protocol tcp \
    --port 443 \
    --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
    --group-id sg-12345678 \
    --protocol tcp \
    --port 22 \
    --source-group sg-87654321  # SSH from bastion host SG only
```

**Elastic Load Balancer (ELB):**

ELB distributes incoming traffic across multiple targets.

**Application Load Balancer (ALB):**
```bash
# Create Application Load Balancer
aws elbv2 create-load-balancer \
    --name MyALB \
    --subnets subnet-12345678 subnet-87654321 \
    --security-groups sg-12345678

# Create target group
aws elbv2 create-target-group \
    --name MyTargets \
    --protocol HTTP \
    --port 80 \
    --vpc-id vpc-12345678 \
    --health-check-path /health

# Register targets
aws elbv2 register-targets \
    --target-group-arn arn:aws:elasticloadbalancing:us-east-1:123456789012:targetgroup/MyTargets/1234567890123456 \
    --targets Id=i-12345678 Id=i-87654321

# Create listener
aws elbv2 create-listener \
    --load-balancer-arn arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/app/MyALB/1234567890123456 \
    --protocol HTTP \
    --port 80 \
    --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:us-east-1:123456789012:targetgroup/MyTargets/1234567890123456
```

## AWS Identity and Access Management (IAM)

IAM controls access to AWS services and resources securely.

### IAM Components

**Users, Groups, and Roles:**
```bash
# Users: Individual people or services
# Groups: Collection of users with similar permissions
# Roles: Set of permissions that can be assumed by users or services
# Policies: Documents that define permissions
```

**Creating IAM Users:**
```bash
# Create user
aws iam create-user --user-name john-doe

# Create access key for user
aws iam create-access-key --user-name john-doe

# Attach policy to user
aws iam attach-user-policy \
    --user-name john-doe \
    --policy-arn arn:aws:iam::aws:policy/ReadOnlyAccess

# Create and attach inline policy
aws iam put-user-policy \
    --user-name john-doe \
    --policy-name S3Access \
    --policy-document file://s3-policy.json
```

**IAM Policies:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::my-bucket/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket"
      ],
      "Resource": "arn:aws:s3:::my-bucket"
    }
  ]
}
```

**IAM Roles:**
```bash
# Create role trust policy
cat > trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

# Create role
aws iam create-role \
    --role-name EC2S3AccessRole \
    --assume-role-policy-document file://trust-policy.json

# Attach policy to role
aws iam attach-role-policy \
    --role-name EC2S3AccessRole \
    --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess

# Create instance profile
aws iam create-instance-profile \
    --instance-profile-name EC2S3AccessProfile

# Add role to instance profile
aws iam add-role-to-instance-profile \
    --instance-profile-name EC2S3AccessProfile \
    --role-name EC2S3AccessRole
```

### Multi-Factor Authentication (MFA)

**Enabling MFA:**
```bash
# Create virtual MFA device
aws iam create-virtual-mfa-device \
    --virtual-mfa-device-name john-doe-mfa \
    --outfile QRCode.png \
    --bootstrap-method QRCodePNG

# Enable MFA device (after scanning QR code)
aws iam enable-mfa-device \
    --user-name john-doe \
    --serial-number arn:aws:iam::123456789012:mfa/john-doe-mfa \
    --authentication-code1 123456 \
    --authentication-code2 789012
```

## AWS Monitoring and Logging

### Amazon CloudWatch

CloudWatch provides monitoring and observability for AWS resources.

**CloudWatch Metrics:**
```bash
# List available metrics
aws cloudwatch list-metrics --namespace AWS/EC2

# Get metric statistics
aws cloudwatch get-metric-statistics \
    --namespace AWS/EC2 \
    --metric-name CPUUtilization \
    --dimensions Name=InstanceId,Value=i-12345678 \
    --statistics Average \
    --start-time 2024-01-15T00:00:00Z \
    --end-time 2024-01-15T23:59:59Z \
    --period 3600

# Create custom metric
aws cloudwatch put-metric-data \
    --namespace MyApp/Performance \
    --metric-data MetricName=ResponseTime,Value=150,Unit=Milliseconds
```

**CloudWatch Alarms:**
```bash
# Create alarm
aws cloudwatch put-metric-alarm \
    --alarm-name HighCPUUtilization \
    --alarm-description "Alarm when CPU exceeds 80%" \
    --metric-name CPUUtilization \
    --namespace AWS/EC2 \
    --statistic Average \
    --period 300 \
    --threshold 80 \
    --comparison-operator GreaterThanThreshold \
    --dimensions Name=InstanceId,Value=i-12345678 \
    --evaluation-periods 2 \
    --alarm-actions arn:aws:sns:us-east-1:123456789012:high-cpu-topic

# List alarms
aws cloudwatch describe-alarms --state-value ALARM
```

**CloudWatch Logs:**
```bash
# Create log group
aws logs create-log-group --log-group-name /aws/lambda/my-function

# Create log stream
aws logs create-log-stream \
    --log-group-name /aws/lambda/my-function \
    --log-stream-name 2024/01/15/stream1

# Put log events
aws logs put-log-events \
    --log-group-name /aws/lambda/my-function \
    --log-stream-name 2024/01/15/stream1 \
    --log-events timestamp=1642204800000,message="Function started"

# Query logs
aws logs filter-log-events \
    --log-group-name /aws/lambda/my-function \
    --filter-pattern "ERROR"
```

### AWS CloudTrail

CloudTrail provides governance, compliance, and audit for your AWS account.

**Setting up CloudTrail:**
```bash
# Create S3 bucket for CloudTrail logs
aws s3 mb s3://my-cloudtrail-logs-12345

# Create CloudTrail
aws cloudtrail create-trail \
    --name MyCloudTrail \
    --s3-bucket-name my-cloudtrail-logs-12345 \
    --include-global-service-events \
    --is-multi-region-trail

# Start logging
aws cloudtrail start-logging --name MyCloudTrail

# Look up events
aws cloudtrail lookup-events \
    --lookup-attributes AttributeKey=EventName,AttributeValue=CreateUser \
    --start-time 2024-01-15T00:00:00Z \
    --end-time 2024-01-15T23:59:59Z
```

## Practical AWS Projects

### Project 1: Three-Tier Web Application

Build a scalable web application with presentation, application, and database tiers.

**Architecture:**
```
Internet Gateway
    ↓
Application Load Balancer (Public Subnets)
    ↓
Web Servers (Private Subnets)
    ↓
RDS Database (Private Subnets)
```

**Implementation Steps:**

**1. Create VPC and Networking:**
```bash
# Create VPC
aws ec2 create-vpc --cidr-block 10.0.0.0/16

# Create subnets
aws ec2 create-subnet --vpc-id vpc-12345678 --cidr-block 10.0.1.0/24 --availability-zone us-east-1a  # Public 1
aws ec2 create-subnet --vpc-id vpc-12345678 --cidr-block 10.0.2.0/24 --availability-zone us-east-1b  # Public 2
aws ec2 create-subnet --vpc-id vpc-12345678 --cidr-block 10.0.3.0/24 --availability-zone us-east-1a  # Private 1
aws ec2 create-subnet --vpc-id vpc-12345678 --cidr-block 10.0.4.0/24 --availability-zone us-east-1b  # Private 2

# Create and attach Internet Gateway
aws ec2 create-internet-gateway
aws ec2 attach-internet-gateway --internet-gateway-id igw-12345678 --vpc-id vpc-12345678

# Create NAT Gateway
aws ec2 create-nat-gateway --subnet-id subnet-12345678 --allocation-id eipalloc-12345678
```

**2. Launch Web Servers:**
```bash
# Create launch template
aws ec2 create-launch-template \
    --launch-template-name WebServerTemplate \
    --launch-template-data '{
        "ImageId": "ami-0abcdef1234567890",
        "InstanceType": "t3.micro",
        "KeyName": "MyKeyPair",
        "SecurityGroupIds": ["sg-12345678"],
        "UserData": "'$(base64 -w 0 user-data.sh)'"
    }'

# Create Auto Scaling Group
aws autoscaling create-auto-scaling-group \
    --auto-scaling-group-name WebServerASG \
    --launch-template LaunchTemplateName=WebServerTemplate,Version=1 \
    --min-size 2 \
    --max-size 4 \
    --desired-capacity 2 \
    --vpc-zone-identifier "subnet-12345678,subnet-87654321"
```

**3. Set up Database:**
```bash
# Create RDS subnet group
aws rds create-db-subnet-group \
    --db-subnet-group-name webapp-db-subnet-group \
    --db-subnet-group-description "Subnet group for web app database" \
    --subnet-ids subnet-12345678 subnet-87654321

# Create RDS instance
aws rds create-db-instance \
    --db-instance-identifier webapp-database \
    --db-instance-class db.t3.micro \
    --engine mysql \
    --master-username admin \
    --master-user-password SecurePassword123 \
    --allocated-storage 20 \
    --db-subnet-group-name webapp-db-subnet-group \
    --vpc-security-group-ids sg-87654321
```

### Project 2: Serverless Data Processing Pipeline

Build a serverless pipeline to process data using Lambda, S3, and DynamoDB.

**Architecture:**
```
S3 Bucket (Data Upload)
    ↓ (Trigger)
Lambda Function (Process Data)
    ↓ (Store Results)
DynamoDB Table
```

**Implementation:**

**1. Create S3 Bucket:**
```bash
aws s3 mb s3://data-processing-pipeline-12345
```

**2. Create DynamoDB Table:**
```bash
aws dynamodb create-table \
    --table-name ProcessedData \
    --attribute-definitions \
        AttributeName=FileId,AttributeType=S \
        AttributeName=ProcessedAt,AttributeType=S \
    --key-schema \
        AttributeName=FileId,KeyType=HASH \
        AttributeName=ProcessedAt,KeyType=RANGE \
    --billing-mode PAY_PER_REQUEST
```

**3. Create Lambda Function:**
```python
import json
import boto3
import csv
from datetime import datetime
from urllib.parse import unquote_plus

s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('ProcessedData')

def lambda_handler(event, context):
    for record in event['Records']:
        bucket = record['s3']['bucket']['name']
        key = unquote_plus(record['s3']['object']['key'])
        
        # Download file from S3
        response = s3.get_object(Bucket=bucket, Key=key)
        content = response['Body'].read().decode('utf-8')
        
        # Process CSV data
        csv_reader = csv.DictReader(content.splitlines())
        processed_count = 0
        
        for row in csv_reader:
            # Process each row and store in DynamoDB
            table.put_item(
                Item={
                    'FileId': key,
                    'ProcessedAt': datetime.now().isoformat(),
                    'Data': row,
                    'Status': 'Processed'
                }
            )
            processed_count += 1
        
        print(f"Processed {processed_count} records from {key}")
    
    return {
        'statusCode': 200,
        'body': json.dumps('Processing complete')
    }
```

**4. Set up S3 Event Notification:**
```bash
# Create notification configuration
cat > notification.json << EOF
{
    "LambdaConfigurations": [
        {
            "Id": "ProcessDataNotification",
            "LambdaFunctionArn": "arn:aws:lambda:us-east-1:123456789012:function:ProcessDataFunction",
            "Events": ["s3:ObjectCreated:*"],
            "Filter": {
                "Key": {
                    "FilterRules": [
                        {
                            "Name": "suffix",
                            "Value": ".csv"
                        }
                    ]
                }
            }
        }
    ]
}
EOF

# Apply notification configuration
aws s3api put-bucket-notification-configuration \
    --bucket data-processing-pipeline-12345 \
    --notification-configuration file://notification.json
```

## AWS Security Best Practices

### Security Fundamentals

**1. Identity and Access Management:**
```bash
# Use IAM roles instead of access keys
# Implement least privilege principle
# Enable MFA for all users
# Rotate credentials regularly
# Use AWS Organizations for multi-account management
```

**2. Network Security:**
```bash
# Use VPCs to isolate resources
# Implement security groups and NACLs
# Use private subnets for databases and internal services
# Enable VPC Flow Logs for monitoring
# Use AWS WAF for web application protection
```

**3. Data Protection:**
```bash
# Encrypt data at rest and in transit
# Use AWS KMS for key management
# Enable S3 bucket versioning and MFA delete
# Implement backup and disaster recovery
# Use AWS Secrets Manager for sensitive data
```

**4. Monitoring and Compliance:**
```bash
# Enable CloudTrail for all regions
# Set up CloudWatch alarms for security events
# Use AWS Config for compliance monitoring
# Implement AWS GuardDuty for threat detection
# Regular security assessments and penetration testing
```

### Security Services

**AWS KMS (Key Management Service):**
```bash
# Create customer managed key
aws kms create-key \
    --description "My application encryption key" \
    --key-usage ENCRYPT_DECRYPT

# Create alias for key
aws kms create-alias \
    --alias-name alias/my-app-key \
    --target-key-id 12345678-1234-1234-1234-123456789012

# Encrypt data
aws kms encrypt \
    --key-id alias/my-app-key \
    --plaintext "Hello World" \
    --output text \
    --query CiphertextBlob

# Decrypt data
aws kms decrypt \
    --ciphertext-blob fileb://encrypted-data \
    --output text \
    --query Plaintext | base64 --decode
```

**AWS Secrets Manager:**
```bash
# Create secret
aws secretsmanager create-secret \
    --name MyDatabasePassword \
    --description "Password for production database" \
    --secret-string '{"username":"admin","password":"MySecurePassword123"}'

# Retrieve secret
aws secretsmanager get-secret-value \
    --secret-id MyDatabasePassword \
    --query SecretString \
    --output text
```

## Free Learning Resources

### AWS Official Resources
- [AWS Free Tier](https://aws.amazon.com/free/) - 12 months of free services
- [AWS Training and Certification](https://aws.amazon.com/training/) - Free digital courses
- [AWS Hands-On Tutorials](https://aws.amazon.com/getting-started/hands-on/) - Step-by-step guides
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/) - Best practices

### Documentation and Guides
- [AWS Documentation](https://docs.aws.amazon.com/) - Comprehensive service documentation
- [AWS CLI User Guide](https://docs.aws.amazon.com/cli/latest/userguide/) - Command line interface guide
- [AWS SDK Documentation](https://aws.amazon.com/tools/) - Programming language SDKs

### Practice and Certification
- [AWS Skill Builder](https://skillbuilder.aws/) - Free learning platform
- [AWS Cloud Quest](https://aws.amazon.com/training/digital/aws-cloud-quest/) - Gamified learning
- [AWS Certification](https://aws.amazon.com/certification/) - Industry-recognized certifications

### Community Resources
- [AWS re:Post](https://repost.aws/) - Community Q&A platform
- [AWS Samples GitHub](https://github.com/aws-samples) - Code samples and templates
- [AWS Architecture Center](https://aws.amazon.com/architecture/) - Reference architectures

## Next Steps

After mastering AWS fundamentals:

1. **Choose Specialization**: Focus on specific AWS services (compute, storage, networking, etc.)
2. **Learn Infrastructure as Code**: AWS CloudFormation, AWS CDK, Terraform
3. **Explore Containers**: Amazon ECS, EKS, Fargate
4. **Study DevOps**: CI/CD pipelines, AWS CodePipeline, CodeBuild
5. **Pursue Certification**: AWS Cloud Practitioner → Solutions Architect Associate
6. **Join Communities**: 
   - [r/aws](https://www.reddit.com/r/aws/)
   - [AWS User Groups](https://aws.amazon.com/developer/community/usergroups/)

Continue to **Infrastructure as Code** to learn how to manage AWS resources programmatically, or explore **Container Orchestration** for modern application deployment strategies!
