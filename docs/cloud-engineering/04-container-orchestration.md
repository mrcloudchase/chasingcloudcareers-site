---
sidebar_position: 5
---

# Container Orchestration

Master containerization with Docker and orchestration with Kubernetes to build, deploy, and manage modern cloud-native applications.

## Introduction to Containers

Containers revolutionize how we package, distribute, and run applications by providing lightweight, portable, and consistent environments.

### What are Containers?

**Traditional Deployment vs Containers:**
```bash
# Traditional Deployment:
Application → Operating System → Physical Hardware
- Heavy resource usage
- Environment inconsistencies
- Slow deployment
- Difficult scaling

# Container Deployment:
Application → Container Runtime → Operating System → Hardware
- Lightweight and efficient
- Consistent environments
- Fast deployment
- Easy scaling
```

**Container Benefits:**
- **Portability**: Run anywhere (dev, test, prod)
- **Consistency**: Same environment across all stages
- **Efficiency**: Better resource utilization than VMs
- **Scalability**: Quick scaling up/down
- **Isolation**: Applications don't interfere with each other
- **Speed**: Fast startup and deployment times

### Containers vs Virtual Machines

```bash
# Virtual Machines:
Host OS → Hypervisor → [Guest OS + App] × N
- Each VM includes full OS (GBs)
- Slower boot times (minutes)
- Higher resource overhead
- Strong isolation

# Containers:
Host OS → Container Runtime → [App + Dependencies] × N
- Share host OS kernel (MBs)
- Fast boot times (seconds)
- Lower resource overhead
- Process-level isolation
```

## Docker Fundamentals

Docker is the most popular containerization platform, providing tools to build, ship, and run containers.

### Installing Docker

**Linux (Ubuntu/Debian):**
```bash
# Update package index
sudo apt update

# Install required packages
sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Verify installation
docker --version
docker run hello-world
```

**macOS:**
```bash
# Install Docker Desktop
# Download from: https://www.docker.com/products/docker-desktop

# Or using Homebrew
brew install --cask docker

# Start Docker Desktop and verify
docker --version
```

**Windows:**
```bash
# Install Docker Desktop for Windows
# Download from: https://www.docker.com/products/docker-desktop

# Or using Chocolatey
choco install docker-desktop

# Verify installation
docker --version
```

### Docker Core Concepts

**Images and Containers:**
```bash
# Image: Read-only template for creating containers
# Container: Running instance of an image

# Analogy:
# Image = Class (blueprint)
# Container = Object (instance)
```

**Docker Architecture:**
```bash
# Docker Client: Command-line interface
# Docker Daemon: Background service managing containers
# Docker Registry: Repository for images (Docker Hub)
# Dockerfile: Instructions to build images
```

### Basic Docker Commands

**Working with Images:**
```bash
# List local images
docker images
docker image ls

# Search for images on Docker Hub
docker search nginx

# Pull image from registry
docker pull nginx
docker pull nginx:1.21-alpine  # Specific tag

# Remove image
docker rmi nginx
docker image rm nginx

# Build image from Dockerfile
docker build -t myapp:1.0 .

# Tag image
docker tag myapp:1.0 myapp:latest

# Push image to registry
docker push myusername/myapp:1.0
```

**Working with Containers:**
```bash
# Run container
docker run nginx                    # Foreground
docker run -d nginx                 # Background (detached)
docker run -d --name webserver nginx  # With custom name
docker run -d -p 8080:80 nginx      # Port mapping

# List containers
docker ps           # Running containers
docker ps -a        # All containers (including stopped)

# Stop container
docker stop webserver
docker stop $(docker ps -q)  # Stop all running containers

# Start stopped container
docker start webserver

# Restart container
docker restart webserver

# Remove container
docker rm webserver
docker rm $(docker ps -aq)  # Remove all containers

# Execute commands in running container
docker exec -it webserver bash
docker exec webserver ls /etc

# View container logs
docker logs webserver
docker logs -f webserver  # Follow logs

# Inspect container
docker inspect webserver

# View container resource usage
docker stats webserver
```

### Creating Docker Images

**Dockerfile Basics:**
```dockerfile
# Dockerfile for a simple web application
FROM node:16-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership of app directory
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start application
CMD ["npm", "start"]
```

**Dockerfile Best Practices:**
```dockerfile
# Multi-stage build example
FROM node:16-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM node:16-alpine AS production

WORKDIR /app

# Copy only necessary files from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]
```

**Building and Running Custom Images:**
```bash
# Build image
docker build -t mywebapp:1.0 .

# Build with build arguments
docker build --build-arg NODE_ENV=production -t mywebapp:1.0 .

# Run custom image
docker run -d -p 3000:3000 --name webapp mywebapp:1.0

# Run with environment variables
docker run -d -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL=postgresql://user:pass@db:5432/mydb \
  --name webapp mywebapp:1.0

# Run with volume mounts
docker run -d -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  --name webapp mywebapp:1.0
```

### Docker Networking

**Network Types:**
```bash
# Bridge: Default network for containers
# Host: Container uses host network directly
# None: No networking
# Custom: User-defined networks
```

**Working with Networks:**
```bash
# List networks
docker network ls

# Create custom network
docker network create mynetwork
docker network create --driver bridge --subnet=172.20.0.0/16 mynetwork

# Run containers on custom network
docker run -d --name web --network mynetwork nginx
docker run -d --name app --network mynetwork myapp:1.0

# Connect existing container to network
docker network connect mynetwork existing-container

# Inspect network
docker network inspect mynetwork

# Remove network
docker network rm mynetwork
```

**Container Communication:**
```bash
# Containers on same network can communicate by name
# Example: web container connecting to database container

# Run database
docker run -d --name postgres --network mynetwork \
  -e POSTGRES_DB=mydb \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  postgres:13

# Run web app (can connect to postgres by name)
docker run -d --name webapp --network mynetwork \
  -e DATABASE_URL=postgresql://user:password@postgres:5432/mydb \
  -p 3000:3000 \
  mywebapp:1.0
```

### Docker Volumes

**Volume Types:**
```bash
# Named volumes: Managed by Docker
# Bind mounts: Mount host directory
# tmpfs mounts: Temporary filesystem in memory
```

**Working with Volumes:**
```bash
# Create named volume
docker volume create mydata

# List volumes
docker volume ls

# Inspect volume
docker volume inspect mydata

# Run container with named volume
docker run -d --name database \
  -v mydata:/var/lib/postgresql/data \
  postgres:13

# Run container with bind mount
docker run -d --name webapp \
  -v $(pwd)/app:/app \
  -v $(pwd)/logs:/app/logs \
  mywebapp:1.0

# Run container with tmpfs mount
docker run -d --name cache \
  --tmpfs /tmp:rw,noexec,nosuid,size=100m \
  redis:6

# Remove volume
docker volume rm mydata

# Remove unused volumes
docker volume prune
```

### Docker Compose

Docker Compose defines and runs multi-container applications using YAML files.

**Installing Docker Compose:**
```bash
# Linux
sudo curl -L "https://github.com/docker/compose/releases/download/v2.12.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version

# Note: Docker Desktop includes Docker Compose
```

**Basic docker-compose.yml:**
```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:password@db:5432/mydb
    depends_on:
      - db
      - redis
    volumes:
      - ./logs:/app/logs
    networks:
      - app-network

  db:
    image: postgres:13
    environment:
      - POSTGRES_DB=mydb
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network

  redis:
    image: redis:6-alpine
    networks:
      - app-network

volumes:
  postgres_data:

networks:
  app-network:
    driver: bridge
```

**Advanced Docker Compose Example:**
```yaml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - web
    networks:
      - frontend
    restart: unless-stopped

  web:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        - NODE_ENV=production
    environment:
      - DATABASE_URL=postgresql://user:${DB_PASSWORD}@db:5432/mydb
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
    volumes:
      - ./uploads:/app/uploads
    networks:
      - frontend
      - backend
    restart: unless-stopped
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '0.5'
          memory: 512M

  db:
    image: postgres:13
    environment:
      - POSTGRES_DB=mydb
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    networks:
      - backend
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d mydb"]
      interval: 30s
      timeout: 10s
      retries: 3

  redis:
    image: redis:6-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    networks:
      - backend
    restart: unless-stopped

  monitoring:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml:ro
    networks:
      - monitoring
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:

networks:
  frontend:
  backend:
  monitoring:
```

**Docker Compose Commands:**
```bash
# Start services
docker-compose up
docker-compose up -d  # Detached mode

# Build and start
docker-compose up --build

# Start specific service
docker-compose up web

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# View running services
docker-compose ps

# View logs
docker-compose logs
docker-compose logs -f web  # Follow logs for specific service

# Execute command in service
docker-compose exec web bash
docker-compose exec db psql -U user -d mydb

# Scale services
docker-compose up --scale web=3

# Restart services
docker-compose restart
docker-compose restart web
```

## Introduction to Kubernetes

Kubernetes (K8s) is an open-source container orchestration platform that automates deployment, scaling, and management of containerized applications.

### Kubernetes Architecture

**Master Components:**
```bash
# API Server: Frontend for Kubernetes control plane
# etcd: Distributed key-value store for cluster data
# Scheduler: Assigns pods to nodes
# Controller Manager: Runs controller processes
```

**Node Components:**
```bash
# kubelet: Agent that runs on each node
# kube-proxy: Network proxy on each node
# Container Runtime: Docker, containerd, or CRI-O
```

**Key Concepts:**
```bash
# Pod: Smallest deployable unit (one or more containers)
# Service: Stable network endpoint for pods
# Deployment: Manages replica sets and rolling updates
# Namespace: Virtual clusters within physical cluster
# ConfigMap: Configuration data for applications
# Secret: Sensitive data like passwords and keys
```

### Setting Up Kubernetes

**Local Development Options:**

**1. Minikube:**
```bash
# Install minikube
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Start minikube
minikube start

# Enable addons
minikube addons enable dashboard
minikube addons enable ingress

# Access dashboard
minikube dashboard
```

**2. Kind (Kubernetes in Docker):**
```bash
# Install kind
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.17.0/kind-linux-amd64
chmod +x ./kind
sudo mv ./kind /usr/local/bin/kind

# Create cluster
kind create cluster --name dev-cluster

# Create multi-node cluster
cat > kind-config.yaml << EOF
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
- role: worker
- role: worker
EOF

kind create cluster --config kind-config.yaml --name multi-node
```

**3. Docker Desktop:**
```bash
# Enable Kubernetes in Docker Desktop settings
# Kubernetes will be available automatically
```

**Installing kubectl:**
```bash
# Linux
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# macOS
brew install kubectl

# Windows
choco install kubernetes-cli

# Verify installation
kubectl version --client
```

### Basic Kubernetes Objects

**Pods:**
```yaml
# pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
  labels:
    app: nginx
spec:
  containers:
  - name: nginx
    image: nginx:1.21
    ports:
    - containerPort: 80
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
```

**Deployments:**
```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.21
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "64Mi"
            cpu: "250m"
          limits:
            memory: "128Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
```

**Services:**
```yaml
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: nginx
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  type: ClusterIP  # ClusterIP, NodePort, LoadBalancer
---
# NodePort service example
apiVersion: v1
kind: Service
metadata:
  name: nginx-nodeport
spec:
  selector:
    app: nginx
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
    nodePort: 30080
  type: NodePort
```

**ConfigMaps and Secrets:**
```yaml
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  database_host: "postgres.example.com"
  database_port: "5432"
  log_level: "info"
  config.properties: |
    database.host=postgres.example.com
    database.port=5432
    log.level=info
---
# secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  database_password: cGFzc3dvcmQxMjM=  # base64 encoded
  api_key: YWJjZGVmZ2hpams=  # base64 encoded
stringData:
  username: admin  # Will be automatically base64 encoded
```

### kubectl Commands

**Basic Operations:**
```bash
# Apply configuration
kubectl apply -f deployment.yaml
kubectl apply -f .  # Apply all YAML files in directory

# Get resources
kubectl get pods
kubectl get deployments
kubectl get services
kubectl get all

# Describe resources
kubectl describe pod nginx-pod
kubectl describe deployment nginx-deployment

# Delete resources
kubectl delete pod nginx-pod
kubectl delete -f deployment.yaml
kubectl delete deployment nginx-deployment

# Edit resources
kubectl edit deployment nginx-deployment
```

**Working with Pods:**
```bash
# Get pods with more information
kubectl get pods -o wide
kubectl get pods --show-labels

# Execute commands in pod
kubectl exec -it nginx-pod -- bash
kubectl exec nginx-pod -- ls /etc

# Port forwarding
kubectl port-forward pod/nginx-pod 8080:80

# View logs
kubectl logs nginx-pod
kubectl logs -f nginx-pod  # Follow logs
kubectl logs nginx-pod -c container-name  # Multi-container pod

# Copy files
kubectl cp nginx-pod:/etc/nginx/nginx.conf ./nginx.conf
kubectl cp ./local-file nginx-pod:/tmp/
```

**Scaling and Updates:**
```bash
# Scale deployment
kubectl scale deployment nginx-deployment --replicas=5

# Rolling update
kubectl set image deployment/nginx-deployment nginx=nginx:1.22

# Check rollout status
kubectl rollout status deployment/nginx-deployment

# View rollout history
kubectl rollout history deployment/nginx-deployment

# Rollback
kubectl rollout undo deployment/nginx-deployment
kubectl rollout undo deployment/nginx-deployment --to-revision=2
```

### Kubernetes Networking

**Service Types:**
```yaml
# ClusterIP (default) - Internal cluster access only
apiVersion: v1
kind: Service
metadata:
  name: internal-service
spec:
  selector:
    app: backend
  ports:
  - port: 80
    targetPort: 8080
  type: ClusterIP

---
# NodePort - Exposes service on each node's IP
apiVersion: v1
kind: Service
metadata:
  name: nodeport-service
spec:
  selector:
    app: web
  ports:
  - port: 80
    targetPort: 80
    nodePort: 30080
  type: NodePort

---
# LoadBalancer - Cloud provider load balancer
apiVersion: v1
kind: Service
metadata:
  name: loadbalancer-service
spec:
  selector:
    app: web
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer
```

**Ingress:**
```yaml
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: web-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: web-service
            port:
              number: 80
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: api-service
            port:
              number: 8080
  tls:
  - hosts:
    - myapp.example.com
    secretName: tls-secret
```

### Kubernetes Storage

**Persistent Volumes and Claims:**
```yaml
# persistent-volume.yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: postgres-pv
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: manual
  hostPath:
    path: /data/postgres

---
# persistent-volume-claim.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
  storageClassName: manual

---
# Using PVC in deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:13
        env:
        - name: POSTGRES_DB
          value: mydb
        - name: POSTGRES_USER
          value: user
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: password
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
      volumes:
      - name: postgres-storage
        persistentVolumeClaim:
          claimName: postgres-pvc
```

## Practical Kubernetes Projects

### Project 1: Full-Stack Web Application

Deploy a complete web application with frontend, backend, database, and monitoring.

**Directory Structure:**
```
k8s-webapp/
├── frontend/
│   ├── Dockerfile
│   └── k8s/
├── backend/
│   ├── Dockerfile
│   └── k8s/
├── database/
│   └── k8s/
├── monitoring/
│   └── k8s/
└── ingress/
```

**Frontend Deployment:**
```yaml
# frontend/k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  labels:
    app: frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: myregistry/frontend:1.0
        ports:
        - containerPort: 3000
        env:
        - name: REACT_APP_API_URL
          value: "http://api.myapp.com"
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
  name: frontend-service
spec:
  selector:
    app: frontend
  ports:
  - port: 80
    targetPort: 3000
  type: ClusterIP
```

**Backend Deployment:**
```yaml
# backend/k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  labels:
    app: backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: myregistry/backend:1.0
        ports:
        - containerPort: 8080
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: database-secret
              key: url
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: jwt-secret
        - name: REDIS_URL
          value: "redis://redis-service:6379"
        resources:
          requests:
            memory: "256Mi"
            cpu: "200m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 60
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: backend-service
spec:
  selector:
    app: backend
  ports:
  - port: 80
    targetPort: 8080
  type: ClusterIP
```

**Database StatefulSet:**
```yaml
# database/k8s/statefulset.yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
spec:
  serviceName: postgres-service
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:13
        env:
        - name: POSTGRES_DB
          value: myapp
        - name: POSTGRES_USER
          value: myuser
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: database-secret
              key: password
        ports:
        - containerPort: 5432
        volumeMounts:
        - name: postgres-data
          mountPath: /var/lib/postgresql/data
        resources:
          requests:
            memory: "256Mi"
            cpu: "200m"
          limits:
            memory: "512Mi"
            cpu: "500m"
  volumeClaimTemplates:
  - metadata:
      name: postgres-data
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 10Gi

---
apiVersion: v1
kind: Service
metadata:
  name: postgres-service
spec:
  selector:
    app: postgres
  ports:
  - port: 5432
    targetPort: 5432
  type: ClusterIP
```

**Redis Cache:**
```yaml
# database/k8s/redis.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
      - name: redis
        image: redis:6-alpine
        ports:
        - containerPort: 6379
        resources:
          requests:
            memory: "64Mi"
            cpu: "50m"
          limits:
            memory: "128Mi"
            cpu: "100m"

---
apiVersion: v1
kind: Service
metadata:
  name: redis-service
spec:
  selector:
    app: redis
  ports:
  - port: 6379
    targetPort: 6379
  type: ClusterIP
```

**Ingress Configuration:**
```yaml
# ingress/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - myapp.example.com
    secretName: app-tls
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port:
              number: 80
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: backend-service
            port:
              number: 80
```

**Secrets and ConfigMaps:**
```yaml
# secrets.yaml
apiVersion: v1
kind: Secret
metadata:
  name: database-secret
type: Opaque
stringData:
  password: "supersecretpassword"
  url: "postgresql://myuser:supersecretpassword@postgres-service:5432/myapp"

---
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
stringData:
  jwt-secret: "your-jwt-secret-key"

---
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  log_level: "info"
  max_connections: "100"
  timeout: "30s"
```

**Deployment Script:**
```bash
#!/bin/bash
# deploy.sh

# Create namespace
kubectl create namespace myapp

# Apply secrets and configmaps
kubectl apply -f secrets.yaml -n myapp
kubectl apply -f configmap.yaml -n myapp

# Deploy database
kubectl apply -f database/k8s/ -n myapp

# Wait for database to be ready
kubectl wait --for=condition=ready pod -l app=postgres -n myapp --timeout=300s

# Deploy backend
kubectl apply -f backend/k8s/ -n myapp

# Wait for backend to be ready
kubectl wait --for=condition=ready pod -l app=backend -n myapp --timeout=300s

# Deploy frontend
kubectl apply -f frontend/k8s/ -n myapp

# Deploy ingress
kubectl apply -f ingress/ -n myapp

echo "Deployment complete!"
echo "Check status with: kubectl get all -n myapp"
```

### Project 2: CI/CD Pipeline with Kubernetes

Set up automated deployment pipeline using GitHub Actions and Kubernetes.

**.github/workflows/deploy.yml:**
```yaml
name: Build and Deploy to Kubernetes

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
    - name: Checkout repository
      uses: actions/checkout@v3

    - name: Log in to Container Registry
      uses: docker/login-action@v2
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}

    - name: Extract metadata
      id: meta
      uses: docker/metadata-action@v4
      with:
        images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
        tags: |
          type=ref,event=branch
          type=ref,event=pr
          type=sha,prefix={{branch}}-

    - name: Build and push Docker image
      uses: docker/build-push-action@v3
      with:
        context: .
        push: true
        tags: ${{ steps.meta.outputs.tags }}
        labels: ${{ steps.meta.outputs.labels }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
    - name: Checkout repository
      uses: actions/checkout@v3

    - name: Configure kubectl
      uses: azure/k8s-set-context@v1
      with:
        method: kubeconfig
        kubeconfig: ${{ secrets.KUBE_CONFIG }}

    - name: Deploy to Kubernetes
      run: |
        # Update image tag in deployment
        sed -i "s|IMAGE_TAG|${{ github.sha }}|g" k8s/deployment.yaml
        
        # Apply Kubernetes manifests
        kubectl apply -f k8s/ -n production
        
        # Wait for rollout to complete
        kubectl rollout status deployment/myapp -n production --timeout=300s

    - name: Verify deployment
      run: |
        kubectl get pods -n production
        kubectl get services -n production
```

## Multi-Cloud Kubernetes Services

Kubernetes provides a consistent container orchestration platform across all major cloud providers, enabling true cloud portability.

### Cloud-Managed Kubernetes Comparison

| Feature | AWS EKS | Azure AKS | GCP GKE | 
|---------|---------|-----------|---------|
| **Control Plane** | Managed | Managed | Managed |
| **Node Management** | Self-managed or Fargate | VM Scale Sets | Node Pools |
| **Networking** | VPC CNI | Azure CNI/Kubenet | VPC-native |
| **Load Balancing** | ALB/NLB | Azure Load Balancer | Cloud Load Balancing |
| **Storage** | EBS CSI | Azure Disk/Files | Persistent Disk |
| **Monitoring** | CloudWatch | Azure Monitor | Cloud Operations |
| **Cost** | $0.10/hour per cluster | Free control plane | $0.10/hour per cluster |

### Amazon EKS (Elastic Kubernetes Service)

**Creating EKS Cluster:**
```bash
# Install eksctl
curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
sudo mv /tmp/eksctl /usr/local/bin

# Create cluster
eksctl create cluster \
  --name my-cluster \
  --version 1.24 \
  --region us-west-2 \
  --nodegroup-name standard-workers \
  --node-type t3.medium \
  --nodes 3 \
  --nodes-min 1 \
  --nodes-max 4 \
  --managed

# Configure kubectl
aws eks update-kubeconfig --region us-west-2 --name my-cluster

# Verify connection
kubectl get nodes
```

**EKS with Terraform:**
```hcl
# eks-cluster.tf
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 19.0"

  cluster_name    = "my-cluster"
  cluster_version = "1.24"

  vpc_id                         = module.vpc.vpc_id
  subnet_ids                     = module.vpc.private_subnets
  cluster_endpoint_public_access = true

  eks_managed_node_groups = {
    main = {
      name = "main"

      instance_types = ["t3.medium"]

      min_size     = 1
      max_size     = 10
      desired_size = 3
    }
  }

  tags = {
    Environment = "dev"
    Terraform   = "true"
  }
}
```

### Google GKE (Google Kubernetes Engine)

**Creating GKE Cluster:**
```bash
# Install gcloud CLI
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init

# Create cluster
gcloud container clusters create my-cluster \
  --zone us-central1-a \
  --num-nodes 3 \
  --enable-autoscaling \
  --min-nodes 1 \
  --max-nodes 10 \
  --machine-type e2-medium

# Get credentials
gcloud container clusters get-credentials my-cluster --zone us-central1-a

# Verify connection
kubectl get nodes
```

### Azure AKS (Azure Kubernetes Service)

**Creating AKS Cluster:**
```bash
# Install Azure CLI
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Login to Azure
az login

# Create resource group
az group create --name myResourceGroup --location eastus

# Create AKS cluster
az aks create \
  --resource-group myResourceGroup \
  --name myAKSCluster \
  --node-count 3 \
  --enable-addons monitoring \
  --generate-ssh-keys

# Get credentials
az aks get-credentials --resource-group myResourceGroup --name myAKSCluster

# Verify connection
kubectl get nodes
```

## Container Security Best Practices

### Image Security

**Secure Base Images:**
```dockerfile
# Use official, minimal base images
FROM node:16-alpine  # Alpine is smaller and more secure

# Use specific tags, not 'latest'
FROM node:16.17.0-alpine

# Use distroless images for production
FROM gcr.io/distroless/nodejs:16

# Multi-stage builds to reduce attack surface
FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM gcr.io/distroless/nodejs:16
COPY --from=builder /app/node_modules ./node_modules
COPY . .
CMD ["app.js"]
```

**Image Scanning:**
```bash
# Scan images for vulnerabilities
docker scan myapp:1.0

# Use Trivy for comprehensive scanning
trivy image myapp:1.0

# Integrate scanning in CI/CD
- name: Run Trivy vulnerability scanner
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: 'myapp:${{ github.sha }}'
    format: 'sarif'
    output: 'trivy-results.sarif'
```

### Runtime Security

**Security Contexts:**
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secure-pod
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
    runAsGroup: 1000
    fsGroup: 1000
  containers:
  - name: app
    image: myapp:1.0
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      capabilities:
        drop:
        - ALL
        add:
        - NET_BIND_SERVICE
    volumeMounts:
    - name: tmp
      mountPath: /tmp
    - name: cache
      mountPath: /app/cache
  volumes:
  - name: tmp
    emptyDir: {}
  - name: cache
    emptyDir: {}
```

**Network Policies:**
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress

---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-frontend-to-backend
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend
    ports:
    - protocol: TCP
      port: 8080
```

### Resource Management

**Resource Quotas:**
```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: compute-quota
  namespace: production
spec:
  hard:
    requests.cpu: "4"
    requests.memory: 8Gi
    limits.cpu: "8"
    limits.memory: 16Gi
    persistentvolumeclaims: "10"
    pods: "10"

---
apiVersion: v1
kind: LimitRange
metadata:
  name: limit-range
  namespace: production
spec:
  limits:
  - default:
      cpu: "500m"
      memory: "512Mi"
    defaultRequest:
      cpu: "100m"
      memory: "128Mi"
    type: Container
```

## Free Learning Resources

### Docker Resources
- [Docker Documentation](https://docs.docker.com/) - Official Docker documentation
- [Docker Hub](https://hub.docker.com/) - Container image registry
- [Play with Docker](https://labs.play-with-docker.com/) - Browser-based Docker playground
- [Docker Curriculum](https://docker-curriculum.com/) - Beginner-friendly tutorial

### Kubernetes Resources
- [Kubernetes Documentation](https://kubernetes.io/docs/) - Official Kubernetes documentation
- [Kubernetes Tutorials](https://kubernetes.io/docs/tutorials/) - Step-by-step tutorials
- [Play with Kubernetes](https://labs.play-with-k8s.com/) - Browser-based Kubernetes playground
- [Katacoda Kubernetes](https://www.katacoda.com/courses/kubernetes) - Interactive scenarios

### Practice Platforms
- [KillerCoda](https://killercoda.com/) - Interactive Kubernetes scenarios
- [Kubernetes the Hard Way](https://github.com/kelseyhightower/kubernetes-the-hard-way) - Learn K8s internals
- [CKAD Exercises](https://github.com/dgkanatsios/CKAD-exercises) - Certification practice

### Cloud Provider Resources
- [AWS EKS Workshop](https://www.eksworkshop.com/) - Hands-on EKS learning
- [Google Cloud Kubernetes Engine](https://cloud.google.com/kubernetes-engine/docs) - GKE documentation
- [Azure Kubernetes Service](https://docs.microsoft.com/en-us/azure/aks/) - AKS documentation

## Next Steps

After mastering container orchestration:

1. **Advanced Kubernetes**: Service mesh (Istio), operators, custom resources
2. **GitOps**: ArgoCD, Flux for continuous deployment
3. **Observability**: Prometheus, Grafana, Jaeger for monitoring
4. **Security**: Falco, OPA Gatekeeper, Pod Security Standards
5. **Certification**: CKA, CKAD, CKS certifications
6. **Join Communities**: 
   - [r/kubernetes](https://www.reddit.com/r/kubernetes/)
   - [Kubernetes Slack](https://slack.k8s.io/)

Continue to **Multi-Cloud Architecture** to learn advanced cloud strategies, or explore **DevOps and CI/CD** for complete automation pipelines!
