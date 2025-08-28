---
sidebar_position: 4
---

# Azure Deep Dive

Master Microsoft Azure, the comprehensive cloud platform designed for enterprise applications, with hands-on examples and real-world scenarios focusing on hybrid cloud capabilities and enterprise integration.

## Azure Global Infrastructure

Understanding Azure's global infrastructure is essential for designing resilient and compliant applications.

### Azure Geography and Regions

**Azure Geographies:**
```bash
# Azure organizes infrastructure into geographies for data residency
# Each geography contains multiple regions
# Geographies ensure data residency and compliance requirements

# Major Azure Geographies:
Americas        # United States, Canada, Brazil
Europe         # UK, Germany, France, Netherlands, etc.
Asia Pacific   # Japan, Australia, India, Southeast Asia
Middle East    # UAE, Qatar
Africa         # South Africa
```

**Azure Regions:**
```bash
# Azure has 60+ regions worldwide (more than any cloud provider)
# Each region has multiple data centers
# Regions are paired for disaster recovery

# Major Azure Regions:
East US         # Virginia (Primary US region)
West US 2       # Washington State
North Europe    # Ireland
West Europe     # Netherlands
Southeast Asia  # Singapore
East Asia       # Hong Kong
```

**Availability Zones:**
```bash
# Physically separate data centers within a region
# Each zone has independent power, cooling, and networking
# Minimum of 3 zones in supported regions
# Connected by high-speed, low-latency networking

# Zone-redundant services automatically replicate across zones
# Zone-aware services allow you to specify zones
```

### Azure CLI Setup and Configuration

**Installing Azure CLI:**
```bash
# Linux (Ubuntu/Debian)
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# macOS (Homebrew)
brew update && brew install azure-cli

# Windows (PowerShell as Administrator)
Invoke-WebRequest -Uri https://aka.ms/installazurecliwindows -OutFile .\AzureCLI.msi
Start-Process msiexec.exe -Wait -ArgumentList '/I AzureCLI.msi /quiet'

# Verify installation
az --version
```

**Azure CLI Authentication:**
```bash
# Interactive login (opens browser)
az login

# Login with service principal
az login --service-principal -u <app-id> -p <password> --tenant <tenant-id>

# Login with managed identity (from Azure VM)
az login --identity

# Set default subscription
az account set --subscription "My Subscription"

# List available subscriptions
az account list --output table

# Show current account info
az account show
```

**Azure CLI Configuration:**
```bash
# Configure default settings
az configure

# Set default resource group and location
az configure --defaults group=myResourceGroup location=eastus

# Set output format
az configure --defaults output=table

# View current configuration
az configure --list-defaults
```

## Core Azure Services

### Compute Services

**Azure Virtual Machines:**

Azure VMs provide scalable compute resources with extensive customization options.

**VM Series and Sizes:**
```bash
# General Purpose
B-series    # Burstable, cost-effective for variable workloads
D-series    # Balanced CPU-to-memory ratio
A-series    # Entry-level, development/test workloads

# Compute Optimized
F-series    # High CPU-to-memory ratio
FX-series   # High-performance computing

# Memory Optimized
E-series    # High memory-to-CPU ratio
M-series    # Largest memory configurations
G-series    # Memory and storage optimized

# Storage Optimized
L-series    # High disk throughput and IO
```

**Creating Virtual Machines:**
```bash
# Create resource group
az group create --name myResourceGroup --location eastus

# List available VM images
az vm image list --output table
az vm image list --publisher Canonical --offer UbuntuServer --all --output table

# Create VM with SSH key authentication
az vm create \
    --resource-group myResourceGroup \
    --name myVM \
    --image UbuntuLTS \
    --size Standard_B2s \
    --admin-username azureuser \
    --generate-ssh-keys \
    --public-ip-sku Standard \
    --storage-sku Premium_LRS

# Create Windows VM
az vm create \
    --resource-group myResourceGroup \
    --name myWindowsVM \
    --image Win2019Datacenter \
    --size Standard_D2s_v3 \
    --admin-username azureuser \
    --admin-password MySecurePassword123!

# List VMs
az vm list --output table

# Get VM details
az vm show --resource-group myResourceGroup --name myVM

# Start/Stop VMs
az vm start --resource-group myResourceGroup --name myVM
az vm stop --resource-group myResourceGroup --name myVM
az vm deallocate --resource-group myResourceGroup --name myVM
```

**VM Custom Script Extension:**
```bash
# Create script file
cat > install-webserver.sh << 'EOF'
#!/bin/bash
apt-get update
apt-get install -y nginx
systemctl start nginx
systemctl enable nginx

# Create custom index page
cat > /var/www/html/index.html << 'HTML'
<!DOCTYPE html>
<html>
<head>
    <title>Azure VM Web Server</title>
</head>
<body>
    <h1>Hello from Azure!</h1>
    <p>Server: $(hostname)</p>
    <p>IP Address: $(hostname -I)</p>
    <p>Timestamp: $(date)</p>
</body>
</html>
HTML

# Configure firewall
ufw allow 'Nginx Full'
EOF

# Apply script to VM
az vm extension set \
    --resource-group myResourceGroup \
    --vm-name myVM \
    --name customScript \
    --publisher Microsoft.Azure.Extensions \
    --settings '{"fileUris":["https://raw.githubusercontent.com/your-repo/install-webserver.sh"],"commandToExecute":"./install-webserver.sh"}'
```

**Azure Functions (Serverless):**

Azure Functions provide event-driven serverless compute.

**Creating Azure Functions:**
```bash
# Create Function App
az functionapp create \
    --resource-group myResourceGroup \
    --consumption-plan-location eastus \
    --runtime node \
    --runtime-version 18 \
    --functions-version 4 \
    --name myFunctionApp \
    --storage-account mystorageaccount

# Create HTTP trigger function
func new --name HttpTrigger --template "HTTP trigger"
```

**Sample Azure Function (Node.js):**
```javascript
// index.js
const { app } = require('@azure/functions');

app.http('HttpTrigger', {
    methods: ['GET', 'POST'],
    authLevel: 'function',
    handler: async (request, context) => {
        context.log('HTTP trigger function processed a request.');

        const name = request.query.get('name') || 
                    (await request.text()) || 
                    'World';

        // Example: Interact with other Azure services
        const responseData = {
            message: `Hello, ${name}!`,
            timestamp: new Date().toISOString(),
            requestId: context.invocationId,
            functionName: context.functionName
        };

        return {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(responseData)
        };
    }
});
```

**Deploy Function:**
```bash
# Deploy function app
func azure functionapp publish myFunctionApp

# Test function
curl "https://myfunctionapp.azurewebsites.net/api/HttpTrigger?name=Azure"
```

### Storage Services

**Azure Storage Account:**

Azure Storage provides scalable cloud storage for various data types.

**Storage Account Types:**
```bash
# Standard General Purpose v2 (GPv2)
# - Blob, File, Queue, Table storage
# - Hot, Cool, Archive tiers
# - Most cost-effective for most scenarios

# Premium Block Blobs
# - High-performance blob storage
# - Low latency for small objects

# Premium File Shares
# - High-performance file shares
# - For enterprise workloads

# Premium Page Blobs
# - For Azure VM disks
# - High IOPS and throughput
```

**Creating Storage Account:**
```bash
# Create storage account
az storage account create \
    --name mystorageaccount \
    --resource-group myResourceGroup \
    --location eastus \
    --sku Standard_LRS \
    --kind StorageV2 \
    --access-tier Hot

# Get storage account keys
az storage account keys list \
    --resource-group myResourceGroup \
    --account-name mystorageaccount

# Set environment variable for key
export AZURE_STORAGE_KEY=$(az storage account keys list \
    --resource-group myResourceGroup \
    --account-name mystorageaccount \
    --query '[0].value' -o tsv)

export AZURE_STORAGE_ACCOUNT=mystorageaccount
```

**Blob Storage Operations:**
```bash
# Create container
az storage container create --name mycontainer

# Upload blob
az storage blob upload \
    --file myfile.txt \
    --container-name mycontainer \
    --name myfile.txt

# Upload with metadata
az storage blob upload \
    --file myfile.txt \
    --container-name mycontainer \
    --name myfile.txt \
    --metadata author=john project=demo

# List blobs
az storage blob list --container-name mycontainer --output table

# Download blob
az storage blob download \
    --container-name mycontainer \
    --name myfile.txt \
    --file downloaded-file.txt

# Set blob tier (for cost optimization)
az storage blob set-tier \
    --container-name mycontainer \
    --name myfile.txt \
    --tier Cool

# Generate SAS token for secure access
az storage blob generate-sas \
    --container-name mycontainer \
    --name myfile.txt \
    --permissions r \
    --expiry 2024-12-31T23:59:59Z
```

**Azure Files (Managed File Shares):**
```bash
# Create file share
az storage share create --name myfileshare --quota 100

# Upload file to share
az storage file upload \
    --share-name myfileshare \
    --source myfile.txt \
    --path myfile.txt

# Mount file share on Linux
sudo mkdir /mnt/myfileshare
sudo mount -t cifs //mystorageaccount.file.core.windows.net/myfileshare /mnt/myfileshare \
    -o vers=3.0,username=mystorageaccount,password=$AZURE_STORAGE_KEY,dir_mode=0777,file_mode=0777

# Mount file share on Windows
net use Z: \\mystorageaccount.file.core.windows.net\myfileshare /u:AZURE\mystorageaccount $AZURE_STORAGE_KEY
```

### Database Services

**Azure SQL Database:**

Azure SQL Database provides managed relational database services.

**Creating SQL Database:**
```bash
# Create SQL server
az sql server create \
    --name myserver \
    --resource-group myResourceGroup \
    --location eastus \
    --admin-user myadmin \
    --admin-password MySecurePassword123!

# Configure firewall rule
az sql server firewall-rule create \
    --resource-group myResourceGroup \
    --server myserver \
    --name AllowMyIP \
    --start-ip-address 0.0.0.0 \
    --end-ip-address 0.0.0.0

# Create database
az sql db create \
    --resource-group myResourceGroup \
    --server myserver \
    --name mydatabase \
    --service-objective Basic

# Get connection string
az sql db show-connection-string \
    --server myserver \
    --name mydatabase \
    --client sqlcmd
```

**Connecting to Azure SQL Database:**
```bash
# Using sqlcmd
sqlcmd -S myserver.database.windows.net -d mydatabase -U myadmin -P MySecurePassword123!

# Example queries
SELECT @@VERSION;
CREATE TABLE Users (ID int, Name varchar(50));
INSERT INTO Users VALUES (1, 'John Doe');
SELECT * FROM Users;
```

**Azure Cosmos DB (NoSQL):**

Cosmos DB provides globally distributed, multi-model database service.

**Creating Cosmos DB Account:**
```bash
# Create Cosmos DB account
az cosmosdb create \
    --resource-group myResourceGroup \
    --name mycosmosdb \
    --kind GlobalDocumentDB \
    --locations regionName=eastus failoverPriority=0 isZoneRedundant=False \
    --locations regionName=westus failoverPriority=1 isZoneRedundant=False \
    --default-consistency-level Eventual \
    --enable-multiple-write-locations true

# Create database
az cosmosdb sql database create \
    --account-name mycosmosdb \
    --resource-group myResourceGroup \
    --name mydatabase

# Create container
az cosmosdb sql container create \
    --account-name mycosmosdb \
    --resource-group myResourceGroup \
    --database-name mydatabase \
    --name mycontainer \
    --partition-key-path "/userId" \
    --throughput 400
```

**Cosmos DB Operations (using Azure CLI):**
```bash
# Insert document
az cosmosdb sql container create \
    --account-name mycosmosdb \
    --resource-group myResourceGroup \
    --database-name mydatabase \
    --name mycontainer \
    --partition-key-path "/userId"

# Note: For actual document operations, you'd typically use SDKs
# Here's a Node.js example:
```

**Cosmos DB Node.js Example:**
```javascript
// cosmos-example.js
const { CosmosClient } = require("@azure/cosmos");

const endpoint = "https://mycosmosdb.documents.azure.com:443/";
const key = "your-primary-key";
const client = new CosmosClient({ endpoint, key });

async function main() {
    const database = client.database("mydatabase");
    const container = database.container("mycontainer");

    // Create document
    const newItem = {
        id: "1",
        userId: "user123",
        name: "John Doe",
        email: "john@example.com",
        createdAt: new Date().toISOString()
    };

    const { resource: createdItem } = await container.items.create(newItem);
    console.log("Created item:", createdItem);

    // Query documents
    const querySpec = {
        query: "SELECT * FROM c WHERE c.userId = @userId",
        parameters: [
            {
                name: "@userId",
                value: "user123"
            }
        ]
    };

    const { resources: items } = await container.items.query(querySpec).fetchAll();
    console.log("Query results:", items);
}

main().catch(console.error);
```

### Networking Services

**Azure Virtual Network (VNet):**

VNets provide isolated network environments in Azure.

**VNet Components:**
```bash
# Virtual Network: Isolated network in Azure
# Subnets: Segments within VNet
# Network Security Groups (NSGs): Subnet/NIC-level firewalls
# Application Security Groups (ASGs): Logical grouping of VMs
# Route Tables: Custom routing rules
# VNet Peering: Connect VNets
# VPN Gateway: Site-to-site connectivity
```

**Creating Virtual Network:**
```bash
# Create VNet
az network vnet create \
    --resource-group myResourceGroup \
    --name myVNet \
    --address-prefix 10.0.0.0/16 \
    --subnet-name mySubnet \
    --subnet-prefix 10.0.1.0/24

# Create additional subnet
az network vnet subnet create \
    --resource-group myResourceGroup \
    --vnet-name myVNet \
    --name myPrivateSubnet \
    --address-prefix 10.0.2.0/24

# List VNets
az network vnet list --output table

# Show VNet details
az network vnet show \
    --resource-group myResourceGroup \
    --name myVNet
```

**Network Security Groups:**
```bash
# Create NSG
az network nsg create \
    --resource-group myResourceGroup \
    --name myNSG

# Create security rules
az network nsg rule create \
    --resource-group myResourceGroup \
    --nsg-name myNSG \
    --name AllowSSH \
    --protocol tcp \
    --priority 1000 \
    --destination-port-range 22 \
    --access allow

az network nsg rule create \
    --resource-group myResourceGroup \
    --nsg-name myNSG \
    --name AllowHTTP \
    --protocol tcp \
    --priority 1001 \
    --destination-port-range 80 \
    --access allow

# Associate NSG with subnet
az network vnet subnet update \
    --resource-group myResourceGroup \
    --vnet-name myVNet \
    --name mySubnet \
    --network-security-group myNSG
```

**Azure Load Balancer:**

Azure provides multiple load balancing solutions.

**Application Gateway (Layer 7):**
```bash
# Create public IP for Application Gateway
az network public-ip create \
    --resource-group myResourceGroup \
    --name myAGPublicIPAddress \
    --allocation-method Static \
    --sku Standard

# Create Application Gateway
az network application-gateway create \
    --name myAppGateway \
    --location eastus \
    --resource-group myResourceGroup \
    --vnet-name myVNet \
    --subnet mySubnet \
    --capacity 2 \
    --sku Standard_v2 \
    --http-settings-cookie-based-affinity Disabled \
    --frontend-port 80 \
    --http-settings-port 80 \
    --http-settings-protocol Http \
    --public-ip-address myAGPublicIPAddress
```

**Load Balancer (Layer 4):**
```bash
# Create public IP for Load Balancer
az network public-ip create \
    --resource-group myResourceGroup \
    --name myLBPublicIP \
    --sku Standard

# Create Load Balancer
az network lb create \
    --resource-group myResourceGroup \
    --name myLoadBalancer \
    --sku Standard \
    --public-ip-address myLBPublicIP \
    --frontend-ip-name myFrontEnd \
    --backend-pool-name myBackEndPool

# Create health probe
az network lb probe create \
    --resource-group myResourceGroup \
    --lb-name myLoadBalancer \
    --name myHealthProbe \
    --protocol tcp \
    --port 80

# Create load balancer rule
az network lb rule create \
    --resource-group myResourceGroup \
    --lb-name myLoadBalancer \
    --name myHTTPRule \
    --protocol tcp \
    --frontend-port 80 \
    --backend-port 80 \
    --frontend-ip-name myFrontEnd \
    --backend-pool-name myBackEndPool \
    --probe-name myHealthProbe
```

## Azure Identity and Access Management

Azure Active Directory (Azure AD) provides comprehensive identity and access management.

### Azure Active Directory Fundamentals

**Core Concepts:**
```bash
# Tenant: Instance of Azure AD for an organization
# Users: Individual identities (employees, guests)
# Groups: Collections of users or devices
# Applications: Software that integrates with Azure AD
# Service Principals: Identity for applications/services
# Managed Identities: Azure-managed service principals
```

**Managing Users and Groups:**
```bash
# Create user
az ad user create \
    --display-name "John Doe" \
    --password MySecurePassword123! \
    --user-principal-name john@yourdomain.onmicrosoft.com

# Create group
az ad group create \
    --display-name "Developers" \
    --mail-nickname developers

# Add user to group
az ad group member add \
    --group "Developers" \
    --member-id $(az ad user show --id john@yourdomain.onmicrosoft.com --query objectId -o tsv)

# List users
az ad user list --output table

# List groups
az ad group list --output table
```

### Role-Based Access Control (RBAC)

**Built-in Roles:**
```bash
# Owner: Full access including access management
# Contributor: Full access except access management
# Reader: Read-only access
# User Access Administrator: Manage user access only

# Service-specific roles:
# Virtual Machine Contributor
# Storage Account Contributor
# SQL DB Contributor
# Network Contributor
```

**Assigning Roles:**
```bash
# Assign role to user at subscription level
az role assignment create \
    --assignee john@yourdomain.onmicrosoft.com \
    --role "Virtual Machine Contributor" \
    --scope "/subscriptions/$(az account show --query id -o tsv)"

# Assign role to group at resource group level
az role assignment create \
    --assignee-object-id $(az ad group show --group "Developers" --query objectId -o tsv) \
    --role "Contributor" \
    --resource-group myResourceGroup

# List role assignments
az role assignment list --assignee john@yourdomain.onmicrosoft.com --output table

# Create custom role
az role definition create --role-definition '{
    "Name": "Custom VM Operator",
    "Description": "Can start and stop VMs",
    "Actions": [
        "Microsoft.Compute/virtualMachines/start/action",
        "Microsoft.Compute/virtualMachines/powerOff/action",
        "Microsoft.Compute/virtualMachines/read"
    ],
    "AssignableScopes": ["/subscriptions/'$(az account show --query id -o tsv)'"]
}'
```

### Managed Identity

**System-Assigned Managed Identity:**
```bash
# Enable system-assigned managed identity for VM
az vm identity assign \
    --resource-group myResourceGroup \
    --name myVM

# Get managed identity details
az vm identity show \
    --resource-group myResourceGroup \
    --name myVM
```

**User-Assigned Managed Identity:**
```bash
# Create user-assigned managed identity
az identity create \
    --resource-group myResourceGroup \
    --name myUserAssignedIdentity

# Assign to VM
az vm identity assign \
    --resource-group myResourceGroup \
    --name myVM \
    --identities myUserAssignedIdentity
```

**Using Managed Identity in Code:**
```javascript
// managed-identity-example.js
const { DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");

async function main() {
    // DefaultAzureCredential automatically uses managed identity when running on Azure
    const credential = new DefaultAzureCredential();
    
    const vaultName = "mykeyvault";
    const url = `https://${vaultName}.vault.azure.net`;
    
    const client = new SecretClient(url, credential);
    
    try {
        const secret = await client.getSecret("database-password");
        console.log("Retrieved secret:", secret.value);
    } catch (error) {
        console.error("Error retrieving secret:", error);
    }
}

main().catch(console.error);
```

## Azure Monitoring and Management

### Azure Monitor

Azure Monitor provides comprehensive monitoring for Azure resources and applications.

**Azure Monitor Components:**
```bash
# Metrics: Numerical data about resource performance
# Logs: Text-based data stored in Log Analytics
# Alerts: Notifications based on metrics or logs
# Application Insights: Application performance monitoring
# Service Map: Visualizes application dependencies
```

**Setting up Log Analytics Workspace:**
```bash
# Create Log Analytics workspace
az monitor log-analytics workspace create \
    --resource-group myResourceGroup \
    --workspace-name myLogAnalyticsWorkspace \
    --location eastus

# Get workspace ID and key
az monitor log-analytics workspace show \
    --resource-group myResourceGroup \
    --workspace-name myLogAnalyticsWorkspace \
    --query customerId -o tsv

az monitor log-analytics workspace get-shared-keys \
    --resource-group myResourceGroup \
    --workspace-name myLogAnalyticsWorkspace
```

**Creating Alerts:**
```bash
# Create action group for notifications
az monitor action-group create \
    --resource-group myResourceGroup \
    --name myActionGroup \
    --short-name myAG \
    --email-receivers name=admin email=admin@example.com

# Create metric alert
az monitor metrics alert create \
    --name "High CPU Alert" \
    --resource-group myResourceGroup \
    --scopes /subscriptions/$(az account show --query id -o tsv)/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM \
    --condition "avg Percentage CPU > 80" \
    --window-size 5m \
    --evaluation-frequency 1m \
    --action myActionGroup \
    --description "Alert when CPU exceeds 80%"
```

**Kusto Queries (KQL) for Log Analytics:**
```kql
// Query VM performance data
Perf
| where ObjectName == "Processor" and CounterName == "% Processor Time"
| where TimeGenerated > ago(1h)
| summarize avg(CounterValue) by Computer, bin(TimeGenerated, 5m)
| render timechart

// Query application logs
AppTraces
| where TimeGenerated > ago(24h)
| where SeverityLevel >= 2  // Warning and above
| summarize count() by tostring(Properties.Category), bin(TimeGenerated, 1h)
| render columnchart

// Query security events
SecurityEvent
| where TimeGenerated > ago(7d)
| where EventID == 4625  // Failed logon attempts
| summarize count() by Account, Computer
| top 10 by count_
```

### Application Insights

Application Insights provides deep application performance monitoring.

**Setting up Application Insights:**
```bash
# Create Application Insights resource
az monitor app-insights component create \
    --app myAppInsights \
    --location eastus \
    --resource-group myResourceGroup \
    --application-type web

# Get instrumentation key
az monitor app-insights component show \
    --app myAppInsights \
    --resource-group myResourceGroup \
    --query instrumentationKey -o tsv
```

**Instrumenting Node.js Application:**
```javascript
// app-insights-setup.js
const appInsights = require("applicationinsights");

// Initialize Application Insights
appInsights.setup("your-instrumentation-key")
    .setAutoDependencyCorrelation(true)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true, true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectConsole(true)
    .setUseDiskRetryCaching(true)
    .setSendLiveMetrics(false)
    .setDistributedTracingMode(appInsights.DistributedTracingModes.AI)
    .start();

const client = appInsights.defaultClient;

// Custom telemetry
client.trackEvent({
    name: "UserLogin",
    properties: {
        userId: "user123",
        loginMethod: "oauth"
    }
});

client.trackMetric({
    name: "ProcessingTime",
    value: 150
});

client.trackDependency({
    name: "Database Query",
    data: "SELECT * FROM Users",
    duration: 45,
    success: true,
    dependencyTypeName: "SQL"
});
```

## Practical Azure Projects

### Project 1: Scalable Web Application with Azure App Service

Build a complete web application using Azure App Service, SQL Database, and Storage.

**Architecture:**
```
Internet → Azure Front Door → App Service → Azure SQL Database
                          ↓
                    Azure Storage Account
                          ↓
                    Application Insights
```

**Implementation Steps:**

**1. Create App Service Plan and Web App:**
```bash
# Create App Service Plan
az appservice plan create \
    --name myAppServicePlan \
    --resource-group myResourceGroup \
    --sku B1 \
    --is-linux

# Create Web App
az webapp create \
    --resource-group myResourceGroup \
    --plan myAppServicePlan \
    --name myWebApp \
    --runtime "NODE|18-lts"

# Configure app settings
az webapp config appsettings set \
    --resource-group myResourceGroup \
    --name myWebApp \
    --settings \
        DATABASE_URL="Server=myserver.database.windows.net;Database=mydatabase;User=myadmin;Password=MySecurePassword123!;" \
        STORAGE_ACCOUNT_NAME="mystorageaccount" \
        APPINSIGHTS_INSTRUMENTATIONKEY="your-instrumentation-key"
```

**2. Deploy Application Code:**
```javascript
// app.js - Express.js application
const express = require('express');
const sql = require('mssql');
const multer = require('multer');
const { BlobServiceClient } = require('@azure/storage-blob');
const appInsights = require('applicationinsights');

// Initialize Application Insights
appInsights.setup().start();
const client = appInsights.defaultClient;

const app = express();
app.use(express.json());

// Database configuration
const dbConfig = {
    server: process.env.DATABASE_SERVER,
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    options: {
        encrypt: true,
        enableArithAbort: true
    }
};

// Storage configuration
const storageAccountName = process.env.STORAGE_ACCOUNT_NAME;
const storageAccountKey = process.env.STORAGE_ACCOUNT_KEY;
const blobServiceClient = new BlobServiceClient(
    `https://${storageAccountName}.blob.core.windows.net`,
    { accountName: storageAccountName, accountKey: storageAccountKey }
);

// Multer configuration for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Routes
app.get('/', (req, res) => {
    client.trackEvent({ name: 'HomePage' });
    res.json({ 
        message: 'Azure Web App is running!',
        timestamp: new Date().toISOString()
    });
});

app.get('/users', async (req, res) => {
    try {
        const startTime = Date.now();
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().query('SELECT * FROM Users');
        
        const duration = Date.now() - startTime;
        client.trackDependency({
            name: 'SQL Query',
            data: 'SELECT * FROM Users',
            duration: duration,
            success: true,
            dependencyTypeName: 'SQL'
        });

        res.json(result.recordset);
    } catch (error) {
        client.trackException({ exception: error });
        res.status(500).json({ error: error.message });
    }
});

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const containerName = 'uploads';
        const blobName = `${Date.now()}-${req.file.originalname}`;
        
        const containerClient = blobServiceClient.getContainerClient(containerName);
        await containerClient.createIfNotExists({ access: 'blob' });
        
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        await blockBlobClient.upload(req.file.buffer, req.file.size);

        client.trackEvent({
            name: 'FileUpload',
            properties: {
                fileName: req.file.originalname,
                fileSize: req.file.size,
                blobName: blobName
            }
        });

        res.json({
            message: 'File uploaded successfully',
            blobName: blobName,
            url: blockBlobClient.url
        });
    } catch (error) {
        client.trackException({ exception: error });
        res.status(500).json({ error: error.message });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
```

**3. Set up Continuous Deployment:**
```bash
# Configure GitHub deployment
az webapp deployment source config \
    --resource-group myResourceGroup \
    --name myWebApp \
    --repo-url https://github.com/yourusername/your-repo \
    --branch main \
    --manual-integration

# Or use Azure DevOps
az webapp deployment source config \
    --resource-group myResourceGroup \
    --name myWebApp \
    --repo-url https://dev.azure.com/yourorg/yourproject/_git/yourrepo \
    --branch main
```

### Project 2: Serverless Data Processing Pipeline

Build a serverless pipeline using Azure Functions, Event Grid, and Cosmos DB.

**Architecture:**
```
Blob Storage → Event Grid → Azure Function → Cosmos DB
                              ↓
                        Service Bus Queue
                              ↓
                        Processing Function
```

**Implementation:**

**1. Create Event Grid Topic:**
```bash
# Create Event Grid topic
az eventgrid topic create \
    --resource-group myResourceGroup \
    --name myEventGridTopic \
    --location eastus

# Get topic endpoint and key
az eventgrid topic show \
    --resource-group myResourceGroup \
    --name myEventGridTopic \
    --query endpoint -o tsv

az eventgrid topic key list \
    --resource-group myResourceGroup \
    --name myEventGridTopic \
    --query key1 -o tsv
```

**2. Create Azure Function for Data Processing:**
```javascript
// function.js - Blob trigger function
const { app } = require('@azure/functions');
const { CosmosClient } = require('@azure/cosmos');

const cosmosClient = new CosmosClient({
    endpoint: process.env.COSMOS_ENDPOINT,
    key: process.env.COSMOS_KEY
});

app.storageBlob('blobTrigger', {
    path: 'data/{name}',
    connection: 'AzureWebJobsStorage',
    handler: async (blob, context) => {
        context.log('Processing blob:', context.triggerMetadata.name);

        try {
            // Parse blob content (assuming JSON)
            const content = blob.toString();
            const data = JSON.parse(content);

            // Process data
            const processedData = {
                id: context.triggerMetadata.name.replace(/[^a-zA-Z0-9]/g, ''),
                originalFileName: context.triggerMetadata.name,
                processedAt: new Date().toISOString(),
                recordCount: Array.isArray(data) ? data.length : 1,
                data: data,
                status: 'processed'
            };

            // Store in Cosmos DB
            const database = cosmosClient.database('ProcessingDB');
            const container = database.container('ProcessedData');
            
            await container.items.create(processedData);

            context.log('Data processed and stored successfully');

            // Send notification via Service Bus
            // Implementation would use Service Bus SDK

        } catch (error) {
            context.log.error('Error processing blob:', error);
            
            // Store error information
            const errorData = {
                id: `error-${Date.now()}`,
                fileName: context.triggerMetadata.name,
                error: error.message,
                timestamp: new Date().toISOString(),
                status: 'error'
            };

            const database = cosmosClient.database('ProcessingDB');
            const container = database.container('ErrorLog');
            await container.items.create(errorData);

            throw error;
        }
    }
});
```

**3. Deploy Function with ARM Template:**
```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "functionAppName": {
            "type": "string",
            "metadata": {
                "description": "Name of the Function App"
            }
        },
        "storageAccountName": {
            "type": "string",
            "metadata": {
                "description": "Name of the storage account"
            }
        }
    },
    "variables": {
        "hostingPlanName": "[concat(parameters('functionAppName'), '-plan')]"
    },
    "resources": [
        {
            "type": "Microsoft.Web/serverfarms",
            "apiVersion": "2021-02-01",
            "name": "[variables('hostingPlanName')]",
            "location": "[resourceGroup().location]",
            "sku": {
                "name": "Y1",
                "tier": "Dynamic"
            },
            "properties": {
                "name": "[variables('hostingPlanName')]",
                "computeMode": "Dynamic"
            }
        },
        {
            "type": "Microsoft.Web/sites",
            "apiVersion": "2021-02-01",
            "name": "[parameters('functionAppName')]",
            "location": "[resourceGroup().location]",
            "kind": "functionapp",
            "dependsOn": [
                "[resourceId('Microsoft.Web/serverfarms', variables('hostingPlanName'))]"
            ],
            "properties": {
                "serverFarmId": "[resourceId('Microsoft.Web/serverfarms', variables('hostingPlanName'))]",
                "siteConfig": {
                    "appSettings": [
                        {
                            "name": "AzureWebJobsStorage",
                            "value": "[concat('DefaultEndpointsProtocol=https;AccountName=', parameters('storageAccountName'), ';AccountKey=', listKeys(resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName')), '2021-04-01').keys[0].value)]"
                        },
                        {
                            "name": "FUNCTIONS_EXTENSION_VERSION",
                            "value": "~4"
                        },
                        {
                            "name": "FUNCTIONS_WORKER_RUNTIME",
                            "value": "node"
                        }
                    ]
                }
            }
        }
    ]
}
```

## Azure Security Best Practices

### Azure Security Center

Azure Security Center provides unified security management and threat protection.

**Enabling Security Center:**
```bash
# Enable Security Center standard tier
az security pricing create \
    --name VirtualMachines \
    --tier Standard

# Get security recommendations
az security task list --output table

# Get security alerts
az security alert list --output table
```

### Azure Key Vault

Key Vault provides secure storage for secrets, keys, and certificates.

**Creating and Using Key Vault:**
```bash
# Create Key Vault
az keyvault create \
    --name myKeyVault \
    --resource-group myResourceGroup \
    --location eastus \
    --enabled-for-disk-encryption true \
    --enabled-for-deployment true \
    --enabled-for-template-deployment true

# Set access policy
az keyvault set-policy \
    --name myKeyVault \
    --upn user@domain.com \
    --secret-permissions get list set delete

# Store secret
az keyvault secret set \
    --vault-name myKeyVault \
    --name "database-password" \
    --value "MySecurePassword123!"

# Retrieve secret
az keyvault secret show \
    --vault-name myKeyVault \
    --name "database-password" \
    --query value -o tsv
```

### Network Security

**Azure Firewall:**
```bash
# Create Azure Firewall subnet
az network vnet subnet create \
    --resource-group myResourceGroup \
    --vnet-name myVNet \
    --name AzureFirewallSubnet \
    --address-prefix 10.0.3.0/26

# Create public IP for firewall
az network public-ip create \
    --name azureFirewallPublicIP \
    --resource-group myResourceGroup \
    --allocation-method Static \
    --sku Standard

# Create Azure Firewall
az network firewall create \
    --name myFirewall \
    --resource-group myResourceGroup \
    --location eastus

# Configure firewall IP
az network firewall ip-config create \
    --firewall-name myFirewall \
    --name myFirewallIpConfig \
    --public-ip-address azureFirewallPublicIP \
    --resource-group myResourceGroup \
    --vnet-name myVNet
```

## Free Learning Resources

### Azure Official Resources
- [Azure Free Account](https://azure.microsoft.com/free/) - $200 credit + 12 months free services
- [Microsoft Learn](https://docs.microsoft.com/learn/azure/) - Interactive learning paths
- [Azure Documentation](https://docs.microsoft.com/azure/) - Comprehensive documentation
- [Azure Architecture Center](https://docs.microsoft.com/azure/architecture/) - Best practices and patterns

### Hands-on Learning
- [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/) - Ready-to-deploy templates
- [Azure Samples](https://github.com/Azure-Samples) - Code samples and examples
- [Azure Citadel](https://azurecitadel.com/) - Technical training content

### Certification Paths
- [Azure Fundamentals (AZ-900)](https://docs.microsoft.com/certifications/azure-fundamentals/) - Entry-level certification
- [Azure Administrator (AZ-104)](https://docs.microsoft.com/certifications/azure-administrator/) - Infrastructure management
- [Azure Solutions Architect (AZ-305)](https://docs.microsoft.com/certifications/azure-solutions-architect/) - Advanced architecture

### Community Resources
- [Azure Community](https://techcommunity.microsoft.com/t5/azure/ct-p/Azure) - Microsoft Tech Community
- [r/AZURE](https://www.reddit.com/r/AZURE/) - Reddit community
- [Azure Updates](https://azure.microsoft.com/updates/) - Latest Azure announcements

## Next Steps

After mastering Azure fundamentals:

1. **Advanced Azure Services**: AI/ML services, IoT Hub, DevOps
2. **Azure DevOps**: CI/CD pipelines, Azure Repos, Boards
3. **Hybrid Cloud**: Azure Arc, Azure Stack
4. **Governance**: Azure Policy, Blueprints, Cost Management
5. **Certification**: Progress through Azure certification paths
6. **Join Communities**: 
   - [Azure User Groups](https://www.meetup.com/topics/azure/)
   - [Microsoft Tech Community](https://techcommunity.microsoft.com/)

Continue to **Google Cloud Platform Deep Dive** to learn GCP services, or explore **Infrastructure as Code** for automated Azure deployments!
