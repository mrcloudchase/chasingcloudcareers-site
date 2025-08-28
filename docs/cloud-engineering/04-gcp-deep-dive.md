---
sidebar_position: 5
---

# Google Cloud Platform Deep Dive

Master Google Cloud Platform (GCP), Google's comprehensive cloud platform known for its advanced data analytics, machine learning capabilities, and innovative container technologies.

## GCP Global Infrastructure

Understanding GCP's global infrastructure is crucial for designing performant and resilient applications.

### Regions and Zones

**GCP Regions:**
```bash
# GCP has 35+ regions across 6 continents
# Each region has multiple zones (typically 3 or more)
# Regions are independent geographic areas

# Major GCP Regions:
us-central1     # Iowa, USA (Primary US region)
us-east1        # South Carolina, USA
us-west1        # Oregon, USA
europe-west1    # Belgium
europe-west2    # London, UK
asia-southeast1 # Singapore
asia-northeast1 # Tokyo, Japan
```

**Availability Zones:**
```bash
# Zones are isolated data centers within regions
# Each zone has independent power, cooling, networking
# Zones connected by high-bandwidth, low-latency network
# Zone names: region-zone (e.g., us-central1-a, us-central1-b)

# List available zones
gcloud compute zones list

# List regions
gcloud compute regions list
```

**Edge Locations:**
```bash
# 140+ edge locations globally
# Used by Cloud CDN and other edge services
# Bring content closer to users
# Reduce latency and improve performance
```

### Google Cloud SDK Setup

**Installing Google Cloud SDK:**
```bash
# Linux/macOS
curl https://sdk.cloud.google.com | bash
exec -l $SHELL

# Alternative: Download and extract
wget https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-cli-linux-x86_64.tar.gz
tar -xf google-cloud-cli-linux-x86_64.tar.gz
./google-cloud-sdk/install.sh

# macOS (Homebrew)
brew install --cask google-cloud-sdk

# Windows (PowerShell)
(New-Object Net.WebClient).DownloadFile("https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe", "$env:Temp\GoogleCloudSDKInstaller.exe")
& $env:Temp\GoogleCloudSDKInstaller.exe

# Verify installation
gcloud --version
```

**Authentication and Configuration:**
```bash
# Initialize gcloud and authenticate
gcloud init

# Login with user account
gcloud auth login

# Login with service account
gcloud auth activate-service-account --key-file=path/to/service-account.json

# Set default project
gcloud config set project PROJECT_ID

# Set default region and zone
gcloud config set compute/region us-central1
gcloud config set compute/zone us-central1-a

# List current configuration
gcloud config list

# Create named configuration
gcloud config configurations create production
gcloud config configurations activate production
```

**Service Account Management:**
```bash
# Create service account
gcloud iam service-accounts create my-service-account \
    --description="Service account for application" \
    --display-name="My Service Account"

# Generate key file
gcloud iam service-accounts keys create ~/key.json \
    --iam-account=my-service-account@PROJECT_ID.iam.gserviceaccount.com

# Set environment variable
export GOOGLE_APPLICATION_CREDENTIALS=~/key.json

# Grant roles to service account
gcloud projects add-iam-policy-binding PROJECT_ID \
    --member="serviceAccount:my-service-account@PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/compute.instanceAdmin"
```

## Core GCP Services

### Compute Services

**Google Compute Engine:**

Compute Engine provides scalable virtual machines with various machine types and configurations.

**Machine Types:**
```bash
# General Purpose
e2-standard-2   # 2 vCPUs, 8 GB RAM (cost-optimized)
n2-standard-4   # 4 vCPUs, 16 GB RAM (balanced)
n1-standard-8   # 8 vCPUs, 30 GB RAM (first generation)

# Compute Optimized
c2-standard-4   # 4 vCPUs, 16 GB RAM (high-performance)
c2d-standard-8  # 8 vCPUs, 32 GB RAM (AMD processors)

# Memory Optimized
m2-ultramem-208 # 208 vCPUs, 5.7 TB RAM (extreme memory)
m1-megamem-96   # 96 vCPUs, 1.4 TB RAM (high memory)

# Custom machine types
custom-4-8192   # 4 vCPUs, 8 GB RAM (custom configuration)
```

**Creating VM Instances:**
```bash
# List available images
gcloud compute images list

# Create VM instance
gcloud compute instances create my-instance \
    --zone=us-central1-a \
    --machine-type=e2-medium \
    --image-family=ubuntu-2004-lts \
    --image-project=ubuntu-os-cloud \
    --boot-disk-size=20GB \
    --boot-disk-type=pd-standard \
    --tags=http-server,https-server

# Create VM with startup script
gcloud compute instances create web-server \
    --zone=us-central1-a \
    --machine-type=e2-medium \
    --image-family=ubuntu-2004-lts \
    --image-project=ubuntu-os-cloud \
    --metadata-from-file startup-script=startup.sh \
    --tags=web-server

# List instances
gcloud compute instances list

# Get instance details
gcloud compute instances describe my-instance --zone=us-central1-a

# SSH into instance
gcloud compute ssh my-instance --zone=us-central1-a

# Stop/Start instances
gcloud compute instances stop my-instance --zone=us-central1-a
gcloud compute instances start my-instance --zone=us-central1-a
```

**Startup Script Example:**
```bash
#!/bin/bash
# startup.sh - VM initialization script

# Update system
apt-get update
apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
usermod -aG docker $USER

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install nginx
apt-get install -y nginx

# Configure nginx
cat > /etc/nginx/sites-available/default << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /var/www/html;
    index index.html index.htm index.nginx-debian.html;

    server_name _;

    location / {
        try_files $uri $uri/ =404;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF

# Create custom index page
cat > /var/www/html/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>GCP Web Server</title>
</head>
<body>
    <h1>Hello from Google Cloud!</h1>
    <p>Instance: <span id="instance"></span></p>
    <p>Zone: <span id="zone"></span></p>
    <p>Timestamp: <span id="timestamp"></span></p>

    <script>
        // Get instance metadata
        fetch('/computeMetadata/v1/instance/name', {
            headers: {'Metadata-Flavor': 'Google'}
        }).then(r => r.text()).then(name => {
            document.getElementById('instance').textContent = name;
        });

        fetch('/computeMetadata/v1/instance/zone', {
            headers: {'Metadata-Flavor': 'Google'}
        }).then(r => r.text()).then(zone => {
            document.getElementById('zone').textContent = zone.split('/').pop();
        });

        document.getElementById('timestamp').textContent = new Date().toISOString();
    </script>
</body>
</html>
EOF

# Start services
systemctl enable nginx
systemctl start nginx

# Configure firewall
ufw allow 'Nginx Full'
ufw allow ssh
ufw --force enable
```

**Google Cloud Functions (Serverless):**

Cloud Functions provide event-driven serverless compute.

**Creating Cloud Functions:**
```bash
# Create simple HTTP function
mkdir my-function && cd my-function

# Create package.json
cat > package.json << 'EOF'
{
  "name": "my-function",
  "version": "1.0.0",
  "main": "index.js",
  "dependencies": {
    "@google-cloud/functions-framework": "^3.0.0"
  }
}
EOF

# Create function code
cat > index.js << 'EOF'
const functions = require('@google-cloud/functions-framework');

// HTTP Cloud Function
functions.http('helloWorld', (req, res) => {
  const name = req.query.name || req.body.name || 'World';
  
  res.json({
    message: `Hello, ${name}!`,
    timestamp: new Date().toISOString(),
    method: req.method,
    headers: req.headers
  });
});

// Pub/Sub Cloud Function
functions.cloudEvent('helloPubSub', (cloudEvent) => {
  const message = cloudEvent.data.message;
  const data = message.data ? Buffer.from(message.data, 'base64').toString() : 'No data';
  
  console.log(`Received message: ${data}`);
  console.log(`Message ID: ${message.messageId}`);
  console.log(`Publish time: ${message.publishTime}`);
});
EOF

# Deploy HTTP function
gcloud functions deploy my-http-function \
    --runtime nodejs18 \
    --trigger-http \
    --entry-point helloWorld \
    --allow-unauthenticated

# Deploy Pub/Sub function
gcloud functions deploy my-pubsub-function \
    --runtime nodejs18 \
    --trigger-topic my-topic \
    --entry-point helloPubSub

# Test HTTP function
curl "https://REGION-PROJECT_ID.cloudfunctions.net/my-http-function?name=GCP"

# List functions
gcloud functions list
```

**Advanced Cloud Function Example:**
```javascript
// advanced-function.js
const functions = require('@google-cloud/functions-framework');
const { Storage } = require('@google-cloud/storage');
const { Firestore } = require('@google-cloud/firestore');
const { PubSub } = require('@google-cloud/pubsub');

const storage = new Storage();
const firestore = new Firestore();
const pubsub = new PubSub();

// Cloud Storage trigger function
functions.cloudEvent('processFile', async (cloudEvent) => {
  const file = cloudEvent.data;
  const bucketName = file.bucket;
  const fileName = file.name;

  console.log(`Processing file: ${fileName} from bucket: ${bucketName}`);

  try {
    // Download file from Cloud Storage
    const bucket = storage.bucket(bucketName);
    const fileObj = bucket.file(fileName);
    const [contents] = await fileObj.download();

    // Process file (example: count lines if text file)
    const lines = contents.toString().split('\n').length;

    // Store metadata in Firestore
    const docRef = firestore.collection('processed-files').doc();
    await docRef.set({
      fileName: fileName,
      bucketName: bucketName,
      processedAt: new Date(),
      lineCount: lines,
      fileSize: file.size,
      contentType: file.contentType
    });

    // Publish completion message
    const topic = pubsub.topic('file-processed');
    await topic.publish(Buffer.from(JSON.stringify({
      fileName: fileName,
      status: 'completed',
      lineCount: lines
    })));

    console.log(`Successfully processed ${fileName}`);
  } catch (error) {
    console.error('Error processing file:', error);
    
    // Store error in Firestore
    const errorRef = firestore.collection('processing-errors').doc();
    await errorRef.set({
      fileName: fileName,
      error: error.message,
      timestamp: new Date()
    });

    throw error;
  }
});
```

### Storage Services

**Google Cloud Storage:**

Cloud Storage provides object storage with global accessibility and multiple storage classes.

**Storage Classes:**
```bash
# Standard: Frequently accessed data
# Nearline: Accessed less than once per month
# Coldline: Accessed less than once per quarter
# Archive: Accessed less than once per year
```

**Cloud Storage Operations:**
```bash
# Create bucket
gsutil mb gs://my-unique-bucket-name-12345

# Create bucket with specific location and storage class
gsutil mb -l us-central1 -c nearline gs://my-nearline-bucket

# List buckets
gsutil ls

# Upload file
gsutil cp myfile.txt gs://my-unique-bucket-name-12345/

# Upload directory recursively
gsutil cp -r ./my-directory gs://my-unique-bucket-name-12345/

# Download file
gsutil cp gs://my-unique-bucket-name-12345/myfile.txt ./downloaded-file.txt

# List objects in bucket
gsutil ls gs://my-unique-bucket-name-12345/

# Set object metadata
gsutil setmeta -h "Content-Type:application/json" \
    -h "Cache-Control:public,max-age=3600" \
    gs://my-unique-bucket-name-12345/myfile.txt

# Make object public
gsutil acl ch -u AllUsers:R gs://my-unique-bucket-name-12345/myfile.txt

# Sync directories
gsutil rsync -r ./local-dir gs://my-unique-bucket-name-12345/remote-dir/

# Set lifecycle policy
cat > lifecycle.json << 'EOF'
{
  "rule": [
    {
      "action": {"type": "SetStorageClass", "storageClass": "NEARLINE"},
      "condition": {"age": 30}
    },
    {
      "action": {"type": "SetStorageClass", "storageClass": "COLDLINE"},
      "condition": {"age": 90}
    },
    {
      "action": {"type": "Delete"},
      "condition": {"age": 365}
    }
  ]
}
EOF

gsutil lifecycle set lifecycle.json gs://my-unique-bucket-name-12345/
```

**Cloud Storage with Client Libraries:**
```javascript
// storage-example.js
const { Storage } = require('@google-cloud/storage');

const storage = new Storage();

async function uploadFile(bucketName, fileName, filePath) {
  try {
    await storage.bucket(bucketName).upload(filePath, {
      destination: fileName,
      metadata: {
        metadata: {
          uploadedBy: 'nodejs-app',
          uploadedAt: new Date().toISOString()
        }
      }
    });

    console.log(`${filePath} uploaded to ${bucketName}/${fileName}`);
  } catch (error) {
    console.error('Upload error:', error);
  }
}

async function downloadFile(bucketName, fileName, destPath) {
  try {
    await storage.bucket(bucketName).file(fileName).download({
      destination: destPath
    });

    console.log(`${bucketName}/${fileName} downloaded to ${destPath}`);
  } catch (error) {
    console.error('Download error:', error);
  }
}

async function listFiles(bucketName) {
  try {
    const [files] = await storage.bucket(bucketName).getFiles();
    
    console.log('Files in bucket:');
    files.forEach(file => {
      console.log(`- ${file.name} (${file.metadata.size} bytes)`);
    });
  } catch (error) {
    console.error('List error:', error);
  }
}

// Usage
uploadFile('my-bucket', 'data.json', './local-data.json');
downloadFile('my-bucket', 'data.json', './downloaded-data.json');
listFiles('my-bucket');
```

**Persistent Disks:**
```bash
# Create persistent disk
gcloud compute disks create my-disk \
    --size=100GB \
    --zone=us-central1-a \
    --type=pd-ssd

# Create disk from snapshot
gcloud compute disks create my-disk-from-snapshot \
    --source-snapshot=my-snapshot \
    --zone=us-central1-a

# Attach disk to instance
gcloud compute instances attach-disk my-instance \
    --disk=my-disk \
    --zone=us-central1-a

# Create snapshot
gcloud compute disks snapshot my-disk \
    --snapshot-names=my-snapshot \
    --zone=us-central1-a

# List disks and snapshots
gcloud compute disks list
gcloud compute snapshots list
```

### Database Services

**Cloud SQL:**

Cloud SQL provides fully managed relational databases (MySQL, PostgreSQL, SQL Server).

**Creating Cloud SQL Instance:**
```bash
# Create MySQL instance
gcloud sql instances create my-mysql-instance \
    --database-version=MYSQL_8_0 \
    --tier=db-f1-micro \
    --region=us-central1 \
    --root-password=MySecurePassword123!

# Create PostgreSQL instance
gcloud sql instances create my-postgres-instance \
    --database-version=POSTGRES_14 \
    --tier=db-f1-micro \
    --region=us-central1 \
    --root-password=MySecurePassword123!

# Create database
gcloud sql databases create mydatabase \
    --instance=my-mysql-instance

# Create user
gcloud sql users create myuser \
    --instance=my-mysql-instance \
    --password=UserPassword123!

# Connect to instance
gcloud sql connect my-mysql-instance --user=root

# Set authorized networks (allow connections from specific IPs)
gcloud sql instances patch my-mysql-instance \
    --authorized-networks=203.0.113.0/24
```

**Cloud SQL Proxy Connection:**
```bash
# Download Cloud SQL Proxy
wget https://dl.google.com/cloudsql/cloud_sql_proxy.linux.amd64 -O cloud_sql_proxy
chmod +x cloud_sql_proxy

# Start proxy
./cloud_sql_proxy -instances=PROJECT_ID:REGION:INSTANCE_NAME=tcp:3306

# Connect through proxy
mysql -h 127.0.0.1 -u root -p
```

**Firestore (NoSQL Document Database):**

Firestore provides a scalable NoSQL document database.

**Firestore Operations:**
```bash
# Enable Firestore API
gcloud services enable firestore.googleapis.com

# Create Firestore database (done through console or programmatically)
```

**Firestore with Node.js:**
```javascript
// firestore-example.js
const { Firestore } = require('@google-cloud/firestore');

const firestore = new Firestore();

async function addDocument() {
  try {
    const docRef = firestore.collection('users').doc('user123');
    await docRef.set({
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
      createdAt: new Date(),
      preferences: {
        theme: 'dark',
        notifications: true
      }
    });

    console.log('Document added successfully');
  } catch (error) {
    console.error('Error adding document:', error);
  }
}

async function getDocument() {
  try {
    const docRef = firestore.collection('users').doc('user123');
    const doc = await docRef.get();

    if (doc.exists) {
      console.log('Document data:', doc.data());
    } else {
      console.log('No such document!');
    }
  } catch (error) {
    console.error('Error getting document:', error);
  }
}

async function queryCollection() {
  try {
    const snapshot = await firestore.collection('users')
      .where('age', '>=', 18)
      .where('preferences.notifications', '==', true)
      .orderBy('age')
      .limit(10)
      .get();

    snapshot.forEach(doc => {
      console.log(doc.id, '=>', doc.data());
    });
  } catch (error) {
    console.error('Error querying collection:', error);
  }
}

async function updateDocument() {
  try {
    const docRef = firestore.collection('users').doc('user123');
    await docRef.update({
      age: 31,
      'preferences.theme': 'light',
      lastUpdated: new Date()
    });

    console.log('Document updated successfully');
  } catch (error) {
    console.error('Error updating document:', error);
  }
}

async function deleteDocument() {
  try {
    await firestore.collection('users').doc('user123').delete();
    console.log('Document deleted successfully');
  } catch (error) {
    console.error('Error deleting document:', error);
  }
}

// Real-time listeners
function listenToDocument() {
  const docRef = firestore.collection('users').doc('user123');
  
  const unsubscribe = docRef.onSnapshot(doc => {
    if (doc.exists) {
      console.log('Document updated:', doc.data());
    }
  });

  // Call unsubscribe() to stop listening
  return unsubscribe;
}

// Usage
addDocument();
getDocument();
queryCollection();
updateDocument();
// deleteDocument();
// const unsubscribe = listenToDocument();
```

### Networking Services

**Virtual Private Cloud (VPC):**

VPC provides isolated network environments in GCP.

**VPC Components:**
```bash
# VPC Network: Global virtual network
# Subnets: Regional IP address ranges
# Firewall Rules: Network-level security
# Routes: Traffic routing rules
# VPC Peering: Connect VPC networks
# Cloud VPN: Site-to-site connectivity
# Cloud Interconnect: Dedicated connectivity
```

**Creating VPC Networks:**
```bash
# Create custom VPC network
gcloud compute networks create my-vpc \
    --subnet-mode=custom \
    --bgp-routing-mode=regional

# Create subnet
gcloud compute networks subnets create my-subnet \
    --network=my-vpc \
    --range=10.0.1.0/24 \
    --region=us-central1

# Create additional subnet in different region
gcloud compute networks subnets create my-subnet-west \
    --network=my-vpc \
    --range=10.0.2.0/24 \
    --region=us-west1

# List networks and subnets
gcloud compute networks list
gcloud compute networks subnets list

# Create firewall rules
gcloud compute firewall-rules create allow-ssh \
    --network=my-vpc \
    --allow=tcp:22 \
    --source-ranges=0.0.0.0/0 \
    --target-tags=ssh-allowed

gcloud compute firewall-rules create allow-http \
    --network=my-vpc \
    --allow=tcp:80,tcp:443 \
    --source-ranges=0.0.0.0/0 \
    --target-tags=web-server

gcloud compute firewall-rules create allow-internal \
    --network=my-vpc \
    --allow=tcp,udp,icmp \
    --source-ranges=10.0.0.0/16

# List firewall rules
gcloud compute firewall-rules list
```

**Load Balancing:**

GCP provides various load balancing options for different use cases.

**HTTP(S) Load Balancer:**
```bash
# Create instance template
gcloud compute instance-templates create web-server-template \
    --machine-type=e2-medium \
    --image-family=ubuntu-2004-lts \
    --image-project=ubuntu-os-cloud \
    --tags=web-server \
    --metadata-from-file startup-script=startup.sh

# Create managed instance group
gcloud compute instance-groups managed create web-server-group \
    --template=web-server-template \
    --size=3 \
    --zone=us-central1-a

# Set up autoscaling
gcloud compute instance-groups managed set-autoscaling web-server-group \
    --zone=us-central1-a \
    --max-num-replicas=10 \
    --min-num-replicas=2 \
    --target-cpu-utilization=0.7

# Create health check
gcloud compute health-checks create http web-server-health-check \
    --port=80 \
    --request-path=/health

# Create backend service
gcloud compute backend-services create web-server-backend \
    --protocol=HTTP \
    --health-checks=web-server-health-check \
    --global

# Add instance group to backend service
gcloud compute backend-services add-backend web-server-backend \
    --instance-group=web-server-group \
    --instance-group-zone=us-central1-a \
    --global

# Create URL map
gcloud compute url-maps create web-server-map \
    --default-service=web-server-backend

# Create HTTP proxy
gcloud compute target-http-proxies create web-server-proxy \
    --url-map=web-server-map

# Create global forwarding rule
gcloud compute forwarding-rules create web-server-forwarding-rule \
    --global \
    --target-http-proxy=web-server-proxy \
    --ports=80

# Get load balancer IP
gcloud compute forwarding-rules describe web-server-forwarding-rule --global
```

## Google Kubernetes Engine (GKE)

GKE provides managed Kubernetes clusters with Google's expertise in container orchestration.

### Creating GKE Clusters

**Standard GKE Cluster:**
```bash
# Create GKE cluster
gcloud container clusters create my-gke-cluster \
    --zone=us-central1-a \
    --num-nodes=3 \
    --machine-type=e2-medium \
    --disk-size=20GB \
    --enable-autorepair \
    --enable-autoupgrade \
    --enable-autoscaling \
    --min-nodes=1 \
    --max-nodes=10

# Get cluster credentials
gcloud container clusters get-credentials my-gke-cluster --zone=us-central1-a

# Verify connection
kubectl get nodes
```

**GKE Autopilot (Fully Managed):**
```bash
# Create Autopilot cluster
gcloud container clusters create-auto my-autopilot-cluster \
    --region=us-central1

# Get credentials
gcloud container clusters get-credentials my-autopilot-cluster --region=us-central1
```

**Advanced GKE Configuration:**
```bash
# Create cluster with custom networking
gcloud container clusters create advanced-cluster \
    --zone=us-central1-a \
    --network=my-vpc \
    --subnetwork=my-subnet \
    --cluster-secondary-range-name=pods \
    --services-secondary-range-name=services \
    --enable-ip-alias \
    --enable-network-policy \
    --enable-shielded-nodes \
    --workload-pool=PROJECT_ID.svc.id.goog

# Create node pool with specific configuration
gcloud container node-pools create high-mem-pool \
    --cluster=advanced-cluster \
    --zone=us-central1-a \
    --machine-type=n2-highmem-2 \
    --num-nodes=2 \
    --enable-autorepair \
    --enable-autoupgrade \
    --node-taints=workload-type=memory-intensive:NoSchedule
```

### Deploying Applications to GKE

**Sample Application Deployment:**
```yaml
# app-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: gcp-web-app
  labels:
    app: gcp-web-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: gcp-web-app
  template:
    metadata:
      labels:
        app: gcp-web-app
    spec:
      containers:
      - name: web-app
        image: gcr.io/PROJECT_ID/web-app:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: database-url
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: gcp-web-app-service
spec:
  selector:
    app: gcp-web-app
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer

---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: gcp-web-app-ingress
  annotations:
    kubernetes.io/ingress.global-static-ip-name: "web-app-ip"
    networking.gke.io/managed-certificates: "web-app-ssl-cert"
spec:
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: gcp-web-app-service
            port:
              number: 80

---
apiVersion: networking.gke.io/v1
kind: ManagedCertificate
metadata:
  name: web-app-ssl-cert
spec:
  domains:
    - myapp.example.com
```

**Deploy Application:**
```bash
# Build and push Docker image
docker build -t gcr.io/PROJECT_ID/web-app:latest .
docker push gcr.io/PROJECT_ID/web-app:latest

# Create secrets
kubectl create secret generic app-secrets \
    --from-literal=database-url="postgresql://user:pass@host:5432/db"

# Reserve static IP
gcloud compute addresses create web-app-ip --global

# Apply Kubernetes manifests
kubectl apply -f app-deployment.yaml

# Check deployment status
kubectl get deployments
kubectl get pods
kubectl get services
kubectl get ingress
```

## GCP AI and Machine Learning Services

GCP excels in AI/ML services, offering both pre-trained APIs and custom ML platforms.

### AI Platform and Vertex AI

**Vertex AI Setup:**
```bash
# Enable Vertex AI API
gcloud services enable aiplatform.googleapis.com

# Create Vertex AI dataset
gcloud ai datasets create \
    --display-name="my-dataset" \
    --metadata-schema-uri="gs://google-cloud-aiplatform/schema/dataset/metadata/image_1.0.0.yaml" \
    --region=us-central1
```

**Custom Model Training:**
```python
# vertex-ai-training.py
from google.cloud import aiplatform
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib

# Initialize Vertex AI
aiplatform.init(project='PROJECT_ID', location='us-central1')

def train_model():
    # Load and prepare data
    # This is a placeholder - replace with your actual data loading
    data = pd.read_csv('gs://my-bucket/training-data.csv')
    X = data.drop('target', axis=1)
    y = data['target']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
    
    # Train model
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Evaluate model
    accuracy = model.score(X_test, y_test)
    print(f"Model accuracy: {accuracy}")
    
    # Save model
    joblib.dump(model, 'model.pkl')
    
    return model

def deploy_model():
    # Upload model to Vertex AI
    model = aiplatform.Model.upload(
        display_name="my-custom-model",
        artifact_uri="gs://my-bucket/model-artifacts/",
        serving_container_image_uri="gcr.io/cloud-aiplatform/prediction/sklearn-cpu.0-24:latest"
    )
    
    # Deploy model to endpoint
    endpoint = model.deploy(
        machine_type="n1-standard-2",
        min_replica_count=1,
        max_replica_count=3
    )
    
    return endpoint

# Usage
if __name__ == "__main__":
    model = train_model()
    endpoint = deploy_model()
    print(f"Model deployed to endpoint: {endpoint.resource_name}")
```

### Pre-trained AI APIs

**Vision API:**
```javascript
// vision-api-example.js
const vision = require('@google-cloud/vision');

const client = new vision.ImageAnnotatorClient();

async function analyzeImage(imagePath) {
  try {
    // Detect text in image
    const [textResult] = await client.textDetection(imagePath);
    const textAnnotations = textResult.textAnnotations;
    console.log('Text detected:', textAnnotations[0]?.description);

    // Detect objects
    const [objectResult] = await client.objectLocalization(imagePath);
    const objects = objectResult.localizedObjectAnnotations;
    objects.forEach(object => {
      console.log(`Object: ${object.name} (${object.score})`);
    });

    // Detect faces
    const [faceResult] = await client.faceDetection(imagePath);
    const faces = faceResult.faceAnnotations;
    console.log(`Found ${faces.length} face(s)`);

    // Safe search detection
    const [safeSearchResult] = await client.safeSearchDetection(imagePath);
    const safeSearch = safeSearchResult.safeSearchAnnotation;
    console.log('Safe search results:', safeSearch);

  } catch (error) {
    console.error('Vision API error:', error);
  }
}

// Usage
analyzeImage('gs://my-bucket/image.jpg');
// or local file: analyzeImage('./local-image.jpg');
```

**Natural Language API:**
```javascript
// natural-language-example.js
const language = require('@google-cloud/language');

const client = new language.LanguageServiceClient();

async function analyzeText(text) {
  try {
    // Analyze sentiment
    const [sentimentResult] = await client.analyzeSentiment({
      document: {
        content: text,
        type: 'PLAIN_TEXT'
      }
    });

    const sentiment = sentimentResult.documentSentiment;
    console.log('Sentiment:', {
      score: sentiment.score,
      magnitude: sentiment.magnitude
    });

    // Extract entities
    const [entitiesResult] = await client.analyzeEntities({
      document: {
        content: text,
        type: 'PLAIN_TEXT'
      }
    });

    const entities = entitiesResult.entities;
    entities.forEach(entity => {
      console.log(`Entity: ${entity.name} (${entity.type})`);
    });

    // Classify text
    const [classificationResult] = await client.classifyText({
      document: {
        content: text,
        type: 'PLAIN_TEXT'
      }
    });

    const categories = classificationResult.categories;
    categories.forEach(category => {
      console.log(`Category: ${category.name} (${category.confidence})`);
    });

  } catch (error) {
    console.error('Natural Language API error:', error);
  }
}

// Usage
analyzeText('Google Cloud Platform provides excellent machine learning services.');
```

## GCP Data Analytics Services

### BigQuery

BigQuery is GCP's fully managed, serverless data warehouse for analytics.

**BigQuery Operations:**
```bash
# Create dataset
bq mk --dataset PROJECT_ID:my_dataset

# Create table from schema
bq mk --table PROJECT_ID:my_dataset.my_table \
    name:STRING,age:INTEGER,email:STRING,created_at:TIMESTAMP

# Load data from CSV
bq load --source_format=CSV \
    --skip_leading_rows=1 \
    PROJECT_ID:my_dataset.my_table \
    gs://my-bucket/data.csv \
    name:STRING,age:INTEGER,email:STRING,created_at:TIMESTAMP

# Run query
bq query --use_legacy_sql=false '
SELECT 
  name,
  age,
  COUNT(*) as count
FROM `PROJECT_ID.my_dataset.my_table`
WHERE age > 18
GROUP BY name, age
ORDER BY count DESC
LIMIT 10'

# Export query results
bq extract --destination_format=CSV \
    PROJECT_ID:my_dataset.query_results \
    gs://my-bucket/results.csv
```

**BigQuery with Node.js:**
```javascript
// bigquery-example.js
const { BigQuery } = require('@google-cloud/bigquery');

const bigquery = new BigQuery();

async function createDataset() {
  const datasetId = 'my_dataset';
  
  try {
    const [dataset] = await bigquery.createDataset(datasetId);
    console.log(`Dataset ${dataset.id} created.`);
  } catch (error) {
    console.error('Error creating dataset:', error);
  }
}

async function createTable() {
  const datasetId = 'my_dataset';
  const tableId = 'users';
  
  const schema = [
    { name: 'id', type: 'INTEGER', mode: 'REQUIRED' },
    { name: 'name', type: 'STRING', mode: 'REQUIRED' },
    { name: 'email', type: 'STRING', mode: 'NULLABLE' },
    { name: 'age', type: 'INTEGER', mode: 'NULLABLE' },
    { name: 'created_at', type: 'TIMESTAMP', mode: 'REQUIRED' }
  ];

  try {
    const [table] = await bigquery
      .dataset(datasetId)
      .createTable(tableId, { schema });
    
    console.log(`Table ${table.id} created.`);
  } catch (error) {
    console.error('Error creating table:', error);
  }
}

async function insertData() {
  const datasetId = 'my_dataset';
  const tableId = 'users';
  
  const rows = [
    { id: 1, name: 'John Doe', email: 'john@example.com', age: 30, created_at: new Date() },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25, created_at: new Date() }
  ];

  try {
    await bigquery.dataset(datasetId).table(tableId).insert(rows);
    console.log('Data inserted successfully');
  } catch (error) {
    console.error('Error inserting data:', error);
  }
}

async function runQuery() {
  const query = `
    SELECT 
      name,
      age,
      EXTRACT(YEAR FROM created_at) as year_created
    FROM \`PROJECT_ID.my_dataset.users\`
    WHERE age > 25
    ORDER BY age DESC
  `;

  try {
    const [rows] = await bigquery.query(query);
    
    console.log('Query results:');
    rows.forEach(row => {
      console.log(`${row.name}: ${row.age} years old (created in ${row.year_created})`);
    });
  } catch (error) {
    console.error('Error running query:', error);
  }
}

// Usage
async function main() {
  await createDataset();
  await createTable();
  await insertData();
  await runQuery();
}

main().catch(console.error);
```

### Pub/Sub (Messaging)

Pub/Sub provides scalable messaging for event-driven architectures.

**Pub/Sub Operations:**
```bash
# Create topic
gcloud pubsub topics create my-topic

# Create subscription
gcloud pubsub subscriptions create my-subscription --topic=my-topic

# Publish message
gcloud pubsub topics publish my-topic --message="Hello, Pub/Sub!"

# Pull messages
gcloud pubsub subscriptions pull my-subscription --auto-ack

# List topics and subscriptions
gcloud pubsub topics list
gcloud pubsub subscriptions list
```

**Pub/Sub with Node.js:**
```javascript
// pubsub-example.js
const { PubSub } = require('@google-cloud/pubsub');

const pubsub = new PubSub();

async function publishMessage(topicName, data) {
  try {
    const topic = pubsub.topic(topicName);
    
    // Publish message with attributes
    const messageId = await topic.publish(Buffer.from(JSON.stringify(data)), {
      source: 'nodejs-app',
      timestamp: new Date().toISOString()
    });
    
    console.log(`Message ${messageId} published to ${topicName}`);
  } catch (error) {
    console.error('Error publishing message:', error);
  }
}

function subscribeToMessages(subscriptionName) {
  const subscription = pubsub.subscription(subscriptionName);

  const messageHandler = message => {
    console.log(`Received message: ${message.data.toString()}`);
    console.log(`Attributes:`, message.attributes);
    
    // Process message
    try {
      const data = JSON.parse(message.data.toString());
      console.log('Parsed data:', data);
      
      // Acknowledge message
      message.ack();
    } catch (error) {
      console.error('Error processing message:', error);
      message.nack(); // Negative acknowledgment
    }
  };

  const errorHandler = error => {
    console.error('Subscription error:', error);
  };

  // Listen for messages
  subscription.on('message', messageHandler);
  subscription.on('error', errorHandler);

  console.log(`Listening for messages on ${subscriptionName}`);

  // Return function to stop listening
  return () => {
    subscription.removeListener('message', messageHandler);
    subscription.removeListener('error', errorHandler);
  };
}

// Usage
async function main() {
  // Publish messages
  await publishMessage('my-topic', { 
    userId: 'user123', 
    action: 'login', 
    timestamp: Date.now() 
  });

  // Subscribe to messages
  const stopListening = subscribeToMessages('my-subscription');

  // Stop listening after 30 seconds
  setTimeout(() => {
    stopListening();
    console.log('Stopped listening for messages');
  }, 30000);
}

main().catch(console.error);
```

## Practical GCP Projects

### Project 1: Serverless Data Pipeline

Build a complete serverless data processing pipeline using Cloud Functions, Pub/Sub, and BigQuery.

**Architecture:**
```
Cloud Storage → Cloud Function → Pub/Sub → Cloud Function → BigQuery
                     ↓                           ↓
               Error Handling              Data Validation
                     ↓                           ↓
                Cloud Logging            Cloud Monitoring
```

**Implementation:**

**1. Data Ingestion Function:**
```javascript
// data-ingestion-function/index.js
const functions = require('@google-cloud/functions-framework');
const { PubSub } = require('@google-cloud/pubsub');
const { Storage } = require('@google-cloud/storage');

const pubsub = new PubSub();
const storage = new Storage();

functions.cloudEvent('processUploadedFile', async (cloudEvent) => {
  const file = cloudEvent.data;
  const bucketName = file.bucket;
  const fileName = file.name;

  console.log(`Processing file: ${fileName} from bucket: ${bucketName}`);

  try {
    // Skip processing for certain file types
    if (!fileName.endsWith('.json') && !fileName.endsWith('.csv')) {
      console.log('Skipping non-data file');
      return;
    }

    // Download and validate file
    const bucket = storage.bucket(bucketName);
    const fileObj = bucket.file(fileName);
    const [exists] = await fileObj.exists();

    if (!exists) {
      throw new Error('File does not exist');
    }

    // Get file metadata
    const [metadata] = await fileObj.getMetadata();
    
    // Publish message to processing topic
    const topic = pubsub.topic('data-processing');
    const message = {
      bucketName: bucketName,
      fileName: fileName,
      fileSize: metadata.size,
      contentType: metadata.contentType,
      timeCreated: metadata.timeCreated,
      processingId: `proc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    await topic.publish(Buffer.from(JSON.stringify(message)));
    console.log('File queued for processing:', message.processingId);

  } catch (error) {
    console.error('Error in file ingestion:', error);
    
    // Publish to error topic
    const errorTopic = pubsub.topic('processing-errors');
    await errorTopic.publish(Buffer.from(JSON.stringify({
      fileName: fileName,
      bucketName: bucketName,
      error: error.message,
      timestamp: new Date().toISOString()
    })));
  }
});
```

**2. Data Processing Function:**
```javascript
// data-processing-function/index.js
const functions = require('@google-cloud/functions-framework');
const { BigQuery } = require('@google-cloud/bigquery');
const { Storage } = require('@google-cloud/storage');
const { PubSub } = require('@google-cloud/pubsub');

const bigquery = new BigQuery();
const storage = new Storage();
const pubsub = new PubSub();

functions.cloudEvent('processDataFile', async (cloudEvent) => {
  const message = cloudEvent.data.message;
  const data = JSON.parse(Buffer.from(message.data, 'base64').toString());

  console.log('Processing data file:', data);

  try {
    const { bucketName, fileName, processingId } = data;

    // Download file content
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fileName);
    const [contents] = await file.download();

    let records;
    if (fileName.endsWith('.json')) {
      records = JSON.parse(contents.toString());
    } else if (fileName.endsWith('.csv')) {
      // Simple CSV parsing (use a proper CSV library in production)
      const lines = contents.toString().split('\n');
      const headers = lines[0].split(',');
      records = lines.slice(1).filter(line => line.trim()).map(line => {
        const values = line.split(',');
        const record = {};
        headers.forEach((header, index) => {
          record[header.trim()] = values[index]?.trim();
        });
        return record;
      });
    }

    // Validate and transform data
    const validRecords = records.filter(record => {
      // Add your validation logic here
      return record && Object.keys(record).length > 0;
    }).map(record => ({
      ...record,
      processing_id: processingId,
      processed_at: new Date().toISOString(),
      source_file: fileName
    }));

    // Insert into BigQuery
    const dataset = bigquery.dataset('analytics');
    const table = dataset.table('processed_data');

    if (validRecords.length > 0) {
      await table.insert(validRecords);
      console.log(`Inserted ${validRecords.length} records into BigQuery`);
    }

    // Publish completion message
    const completionTopic = pubsub.topic('processing-complete');
    await completionTopic.publish(Buffer.from(JSON.stringify({
      processingId: processingId,
      fileName: fileName,
      recordsProcessed: validRecords.length,
      completedAt: new Date().toISOString()
    })));

  } catch (error) {
    console.error('Error processing data:', error);
    
    // Publish error message
    const errorTopic = pubsub.topic('processing-errors');
    await errorTopic.publish(Buffer.from(JSON.stringify({
      processingId: data.processingId,
      fileName: data.fileName,
      error: error.message,
      timestamp: new Date().toISOString()
    })));
  }
});
```

**3. Deployment Script:**
```bash
#!/bin/bash
# deploy-pipeline.sh

PROJECT_ID="your-project-id"
REGION="us-central1"

# Create Pub/Sub topics
gcloud pubsub topics create data-processing
gcloud pubsub topics create processing-complete
gcloud pubsub topics create processing-errors

# Create subscriptions
gcloud pubsub subscriptions create data-processing-sub --topic=data-processing
gcloud pubsub subscriptions create processing-complete-sub --topic=processing-complete
gcloud pubsub subscriptions create processing-errors-sub --topic=processing-errors

# Create BigQuery dataset and table
bq mk --dataset ${PROJECT_ID}:analytics

bq mk --table ${PROJECT_ID}:analytics.processed_data \
    id:STRING,name:STRING,email:STRING,age:INTEGER,processing_id:STRING,processed_at:TIMESTAMP,source_file:STRING

# Create Cloud Storage bucket
gsutil mb gs://${PROJECT_ID}-data-pipeline

# Deploy Cloud Functions
cd data-ingestion-function
gcloud functions deploy processUploadedFile \
    --runtime nodejs18 \
    --trigger-event google.storage.object.finalize \
    --trigger-resource ${PROJECT_ID}-data-pipeline \
    --region ${REGION}

cd ../data-processing-function
gcloud functions deploy processDataFile \
    --runtime nodejs18 \
    --trigger-topic data-processing \
    --region ${REGION}

echo "Data pipeline deployed successfully!"
echo "Upload files to gs://${PROJECT_ID}-data-pipeline to trigger processing"
```

### Project 2: Multi-Region Web Application

Build a globally distributed web application using GKE, Cloud SQL, and Cloud CDN.

**Architecture:**
```
Global Load Balancer → Cloud CDN → Regional GKE Clusters
                                        ↓
                                   Cloud SQL (Multi-region)
                                        ↓
                                   Cloud Storage
```

**Terraform Configuration:**
```hcl
# main.tf
terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.primary_region
}

# VPC Network
resource "google_compute_network" "main" {
  name                    = "main-network"
  auto_create_subnetworks = false
}

# Subnets for different regions
resource "google_compute_subnetwork" "primary" {
  name          = "primary-subnet"
  ip_cidr_range = "10.0.1.0/24"
  region        = var.primary_region
  network       = google_compute_network.main.id

  secondary_ip_range {
    range_name    = "pods"
    ip_cidr_range = "10.1.0.0/16"
  }

  secondary_ip_range {
    range_name    = "services"
    ip_cidr_range = "10.2.0.0/16"
  }
}

resource "google_compute_subnetwork" "secondary" {
  name          = "secondary-subnet"
  ip_cidr_range = "10.0.2.0/24"
  region        = var.secondary_region
  network       = google_compute_network.main.id

  secondary_ip_range {
    range_name    = "pods"
    ip_cidr_range = "10.3.0.0/16"
  }

  secondary_ip_range {
    range_name    = "services"
    ip_cidr_range = "10.4.0.0/16"
  }
}

# GKE Clusters
resource "google_container_cluster" "primary" {
  name     = "primary-cluster"
  location = var.primary_region

  network    = google_compute_network.main.name
  subnetwork = google_compute_subnetwork.primary.name

  remove_default_node_pool = true
  initial_node_count       = 1

  ip_allocation_policy {
    cluster_secondary_range_name  = "pods"
    services_secondary_range_name = "services"
  }

  workload_identity_config {
    workload_pool = "${var.project_id}.svc.id.goog"
  }
}

resource "google_container_node_pool" "primary_nodes" {
  name       = "primary-nodes"
  location   = var.primary_region
  cluster    = google_container_cluster.primary.name
  node_count = 2

  node_config {
    preemptible  = false
    machine_type = "e2-medium"

    service_account = google_service_account.gke.email
    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform"
    ]
  }

  autoscaling {
    min_node_count = 1
    max_node_count = 5
  }
}

# Cloud SQL
resource "google_sql_database_instance" "main" {
  name             = "main-database"
  database_version = "POSTGRES_14"
  region           = var.primary_region

  settings {
    tier = "db-f1-micro"

    backup_configuration {
      enabled = true
    }

    ip_configuration {
      ipv4_enabled = false
      private_network = google_compute_network.main.id
    }
  }

  depends_on = [google_service_networking_connection.private_vpc_connection]
}

resource "google_sql_database" "database" {
  name     = "webapp"
  instance = google_sql_database_instance.main.name
}

# Service Account for GKE
resource "google_service_account" "gke" {
  account_id   = "gke-service-account"
  display_name = "GKE Service Account"
}

# Variables
variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "primary_region" {
  description = "Primary region"
  type        = string
  default     = "us-central1"
}

variable "secondary_region" {
  description = "Secondary region"
  type        = string
  default     = "us-east1"
}
```

## Free Learning Resources

### GCP Official Resources
- [Google Cloud Free Tier](https://cloud.google.com/free) - $300 credit + always free services
- [Google Cloud Skills Boost](https://www.cloudskillsboost.google/) - Hands-on labs and learning paths
- [Google Cloud Documentation](https://cloud.google.com/docs) - Comprehensive documentation
- [Google Cloud Architecture Center](https://cloud.google.com/architecture) - Best practices and patterns

### Hands-on Learning
- [Google Cloud Codelabs](https://codelabs.developers.google.com/cloud) - Interactive tutorials
- [Qwiklabs](https://www.qwiklabs.com/) - Hands-on cloud training
- [Google Cloud Samples](https://github.com/GoogleCloudPlatform) - Code samples and examples

### Certification Paths
- [Cloud Digital Leader](https://cloud.google.com/certification/cloud-digital-leader) - Business-focused certification
- [Associate Cloud Engineer](https://cloud.google.com/certification/cloud-engineer) - Foundational technical certification
- [Professional Cloud Architect](https://cloud.google.com/certification/cloud-architect) - Advanced architecture certification

### Community Resources
- [Google Cloud Community](https://cloud.google.com/community) - Official community hub
- [r/googlecloud](https://www.reddit.com/r/googlecloud/) - Reddit community
- [Google Cloud Blog](https://cloud.google.com/blog) - Latest updates and tutorials

## Next Steps

After mastering GCP fundamentals:

1. **Advanced GCP Services**: AI/ML Platform, Data Analytics, IoT Core
2. **Multi-Cloud Integration**: Anthos, hybrid deployments
3. **DevOps on GCP**: Cloud Build, Cloud Deploy, GitOps
4. **Data Engineering**: Dataflow, Dataproc, BigQuery ML
5. **Certification**: Progress through GCP certification paths
6. **Join Communities**: 
   - [Google Developer Groups](https://developers.google.com/community/gdg)
   - [Google Cloud User Groups](https://cloud.google.com/community/user-groups)

Continue to **Infrastructure as Code** to learn automated GCP deployments, or explore **Multi-Cloud Architecture** for advanced cloud strategies spanning all three major providers!
