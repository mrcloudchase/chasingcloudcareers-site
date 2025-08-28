---
sidebar_position: 6
---

# Cloud-Native Development and Containers

Master modern cloud-native application development, containerization, serverless computing, and microservices architecture across multiple cloud platforms.

## Learning Objectives

By the end of this module, you will:
- Build and deploy cloud-native applications using modern development practices
- Master containerization with Docker and orchestration with Kubernetes
- Implement serverless architectures and event-driven systems
- Design and implement microservices architectures with service mesh
- Develop CI/CD pipelines optimized for cloud-native applications

## 1. Cloud-Native Application Development

### Twelve-Factor App Methodology

**Cloud-Native Application Framework:**
```python
# Cloud-native application following twelve-factor principles
import os
import json
import logging
import signal
import sys
from datetime import datetime
from typing import Dict, List, Optional
from flask import Flask, request, jsonify
from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST
import redis
import psycopg2
from psycopg2.extras import RealDictCursor

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format='{"timestamp": "%(asctime)s", "level": "%(levelname)s", "message": "%(message)s", "module": "%(name)s"}',
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger(__name__)

class CloudNativeApp:
    def __init__(self):
        self.app = Flask(__name__)
        self.config = self._load_config()
        self.metrics = self._setup_metrics()
        self.db_pool = None
        self.redis_client = None
        self.shutdown_requested = False
        
        # Setup signal handlers for graceful shutdown
        signal.signal(signal.SIGTERM, self._signal_handler)
        signal.signal(signal.SIGINT, self._signal_handler)
        
        self._setup_routes()
        self._setup_health_checks()
        self._setup_database()
        self._setup_cache()
    
    def _load_config(self) -> Dict:
        """Load configuration from environment variables (Factor III: Config)"""
        config = {
            # Database configuration
            'DATABASE_URL': os.getenv('DATABASE_URL', 'postgresql://localhost:5432/myapp'),
            'DATABASE_POOL_SIZE': int(os.getenv('DATABASE_POOL_SIZE', '10')),
            
            # Cache configuration
            'REDIS_URL': os.getenv('REDIS_URL', 'redis://localhost:6379'),
            'CACHE_TTL': int(os.getenv('CACHE_TTL', '300')),
            
            # Application configuration
            'APP_NAME': os.getenv('APP_NAME', 'cloud-native-app'),
            'APP_VERSION': os.getenv('APP_VERSION', '1.0.0'),
            'ENVIRONMENT': os.getenv('ENVIRONMENT', 'development'),
            'PORT': int(os.getenv('PORT', '8080')),
            'LOG_LEVEL': os.getenv('LOG_LEVEL', 'INFO'),
            
            # External service configuration
            'API_KEY': os.getenv('API_KEY'),
            'WEBHOOK_URL': os.getenv('WEBHOOK_URL'),
            
            # Feature flags
            'ENABLE_METRICS': os.getenv('ENABLE_METRICS', 'true').lower() == 'true',
            'ENABLE_CACHING': os.getenv('ENABLE_CACHING', 'true').lower() == 'true',
        }
        
        # Validate required configuration
        required_configs = ['DATABASE_URL', 'REDIS_URL']
        missing_configs = [key for key in required_configs if not config.get(key)]
        if missing_configs:
            logger.error(f"Missing required configuration: {missing_configs}")
            sys.exit(1)
        
        logger.info(f"Configuration loaded for {config['APP_NAME']} v{config['APP_VERSION']}")
        return config
    
    def _setup_metrics(self) -> Dict:
        """Setup Prometheus metrics (Factor XI: Logs as event streams)"""
        return {
            'request_count': Counter('http_requests_total', 'Total HTTP requests', ['method', 'endpoint', 'status']),
            'request_duration': Histogram('http_request_duration_seconds', 'HTTP request duration', ['method', 'endpoint']),
            'database_operations': Counter('database_operations_total', 'Database operations', ['operation', 'table']),
            'cache_operations': Counter('cache_operations_total', 'Cache operations', ['operation', 'result']),
            'business_events': Counter('business_events_total', 'Business events', ['event_type'])
        }
    
    def _setup_database(self):
        """Setup database connection pool (Factor IV: Backing services)"""
        try:
            self.db_pool = psycopg2.pool.ThreadedConnectionPool(
                minconn=1,
                maxconn=self.config['DATABASE_POOL_SIZE'],
                dsn=self.config['DATABASE_URL']
            )
            logger.info("Database connection pool initialized")
        except Exception as e:
            logger.error(f"Failed to initialize database pool: {str(e)}")
            sys.exit(1)
    
    def _setup_cache(self):
        """Setup Redis cache connection (Factor IV: Backing services)"""
        if self.config['ENABLE_CACHING']:
            try:
                self.redis_client = redis.from_url(self.config['REDIS_URL'])
                self.redis_client.ping()
                logger.info("Redis cache connection established")
            except Exception as e:
                logger.error(f"Failed to connect to Redis: {str(e)}")
                # Continue without cache in development
                if self.config['ENVIRONMENT'] == 'production':
                    sys.exit(1)
    
    def _setup_routes(self):
        """Setup application routes"""
        
        @self.app.route('/health', methods=['GET'])
        def health_check():
            """Health check endpoint (Factor VII: Port binding)"""
            return jsonify({
                'status': 'healthy',
                'timestamp': datetime.utcnow().isoformat(),
                'version': self.config['APP_VERSION'],
                'environment': self.config['ENVIRONMENT']
            })
        
        @self.app.route('/ready', methods=['GET'])
        def readiness_check():
            """Readiness check endpoint"""
            checks = {
                'database': self._check_database(),
                'cache': self._check_cache() if self.config['ENABLE_CACHING'] else True
            }
            
            all_ready = all(checks.values())
            status_code = 200 if all_ready else 503
            
            return jsonify({
                'status': 'ready' if all_ready else 'not ready',
                'checks': checks,
                'timestamp': datetime.utcnow().isoformat()
            }), status_code
        
        @self.app.route('/metrics', methods=['GET'])
        def metrics():
            """Prometheus metrics endpoint"""
            if not self.config['ENABLE_METRICS']:
                return 'Metrics disabled', 404
            return generate_latest(), 200, {'Content-Type': CONTENT_TYPE_LATEST}
        
        @self.app.route('/api/users', methods=['GET', 'POST'])
        def users():
            """Users API endpoint with caching and metrics"""
            start_time = datetime.utcnow()
            
            try:
                if request.method == 'POST':
                    return self._create_user(request.get_json())
                else:
                    return self._get_users()
            finally:
                # Record metrics
                duration = (datetime.utcnow() - start_time).total_seconds()
                self.metrics['request_duration'].labels(
                    method=request.method,
                    endpoint='/api/users'
                ).observe(duration)
        
        @self.app.route('/api/users/<int:user_id>', methods=['GET', 'PUT', 'DELETE'])
        def user_detail(user_id):
            """Individual user operations"""
            if request.method == 'GET':
                return self._get_user(user_id)
            elif request.method == 'PUT':
                return self._update_user(user_id, request.get_json())
            elif request.method == 'DELETE':
                return self._delete_user(user_id)
        
        @self.app.before_request
        def before_request():
            """Log incoming requests"""
            logger.info(f"Request: {request.method} {request.path} from {request.remote_addr}")
        
        @self.app.after_request
        def after_request(response):
            """Log response and record metrics"""
            logger.info(f"Response: {response.status_code} for {request.method} {request.path}")
            
            # Record request metrics
            self.metrics['request_count'].labels(
                method=request.method,
                endpoint=request.endpoint or 'unknown',
                status=response.status_code
            ).inc()
            
            return response
    
    def _create_user(self, user_data: Dict) -> tuple:
        """Create a new user"""
        if not user_data or 'email' not in user_data:
            return jsonify({'error': 'Email is required'}), 400
        
        conn = None
        try:
            conn = self.db_pool.getconn()
            with conn.cursor(cursor_factory=RealDictCursor) as cursor:
                cursor.execute(
                    "INSERT INTO users (email, name, created_at) VALUES (%s, %s, %s) RETURNING id, email, name, created_at",
                    (user_data['email'], user_data.get('name'), datetime.utcnow())
                )
                user = dict(cursor.fetchone())
                conn.commit()
                
                # Record business event
                self.metrics['business_events'].labels(event_type='user_created').inc()
                self.metrics['database_operations'].labels(operation='insert', table='users').inc()
                
                # Invalidate cache
                if self.redis_client:
                    self.redis_client.delete('users:all')
                    self.metrics['cache_operations'].labels(operation='delete', result='success').inc()
                
                logger.info(f"User created: {user['id']}")
                return jsonify(user), 201
                
        except Exception as e:
            if conn:
                conn.rollback()
            logger.error(f"Error creating user: {str(e)}")
            return jsonify({'error': 'Internal server error'}), 500
        finally:
            if conn:
                self.db_pool.putconn(conn)
    
    def _get_users(self) -> tuple:
        """Get all users with caching"""
        cache_key = 'users:all'
        
        # Try cache first
        if self.redis_client:
            try:
                cached_users = self.redis_client.get(cache_key)
                if cached_users:
                    self.metrics['cache_operations'].labels(operation='get', result='hit').inc()
                    return jsonify(json.loads(cached_users)), 200
                else:
                    self.metrics['cache_operations'].labels(operation='get', result='miss').inc()
            except Exception as e:
                logger.warning(f"Cache error: {str(e)}")
        
        # Fetch from database
        conn = None
        try:
            conn = self.db_pool.getconn()
            with conn.cursor(cursor_factory=RealDictCursor) as cursor:
                cursor.execute("SELECT id, email, name, created_at FROM users ORDER BY created_at DESC")
                users = [dict(row) for row in cursor.fetchall()]
                
                self.metrics['database_operations'].labels(operation='select', table='users').inc()
                
                # Cache the result
                if self.redis_client:
                    try:
                        self.redis_client.setex(
                            cache_key,
                            self.config['CACHE_TTL'],
                            json.dumps(users, default=str)
                        )
                        self.metrics['cache_operations'].labels(operation='set', result='success').inc()
                    except Exception as e:
                        logger.warning(f"Cache set error: {str(e)}")
                
                return jsonify(users), 200
                
        except Exception as e:
            logger.error(f"Error fetching users: {str(e)}")
            return jsonify({'error': 'Internal server error'}), 500
        finally:
            if conn:
                self.db_pool.putconn(conn)
    
    def _get_user(self, user_id: int) -> tuple:
        """Get a specific user"""
        conn = None
        try:
            conn = self.db_pool.getconn()
            with conn.cursor(cursor_factory=RealDictCursor) as cursor:
                cursor.execute("SELECT id, email, name, created_at FROM users WHERE id = %s", (user_id,))
                user = cursor.fetchone()
                
                self.metrics['database_operations'].labels(operation='select', table='users').inc()
                
                if user:
                    return jsonify(dict(user)), 200
                else:
                    return jsonify({'error': 'User not found'}), 404
                    
        except Exception as e:
            logger.error(f"Error fetching user {user_id}: {str(e)}")
            return jsonify({'error': 'Internal server error'}), 500
        finally:
            if conn:
                self.db_pool.putconn(conn)
    
    def _update_user(self, user_id: int, user_data: Dict) -> tuple:
        """Update a user"""
        if not user_data:
            return jsonify({'error': 'No data provided'}), 400
        
        conn = None
        try:
            conn = self.db_pool.getconn()
            with conn.cursor(cursor_factory=RealDictCursor) as cursor:
                # Build dynamic update query
                update_fields = []
                values = []
                
                if 'email' in user_data:
                    update_fields.append('email = %s')
                    values.append(user_data['email'])
                
                if 'name' in user_data:
                    update_fields.append('name = %s')
                    values.append(user_data['name'])
                
                if not update_fields:
                    return jsonify({'error': 'No valid fields to update'}), 400
                
                update_fields.append('updated_at = %s')
                values.append(datetime.utcnow())
                values.append(user_id)
                
                query = f"UPDATE users SET {', '.join(update_fields)} WHERE id = %s RETURNING id, email, name, created_at, updated_at"
                cursor.execute(query, values)
                
                user = cursor.fetchone()
                if user:
                    conn.commit()
                    self.metrics['database_operations'].labels(operation='update', table='users').inc()
                    
                    # Invalidate cache
                    if self.redis_client:
                        self.redis_client.delete('users:all')
                    
                    return jsonify(dict(user)), 200
                else:
                    return jsonify({'error': 'User not found'}), 404
                    
        except Exception as e:
            if conn:
                conn.rollback()
            logger.error(f"Error updating user {user_id}: {str(e)}")
            return jsonify({'error': 'Internal server error'}), 500
        finally:
            if conn:
                self.db_pool.putconn(conn)
    
    def _delete_user(self, user_id: int) -> tuple:
        """Delete a user"""
        conn = None
        try:
            conn = self.db_pool.getconn()
            with conn.cursor() as cursor:
                cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
                
                if cursor.rowcount > 0:
                    conn.commit()
                    self.metrics['database_operations'].labels(operation='delete', table='users').inc()
                    self.metrics['business_events'].labels(event_type='user_deleted').inc()
                    
                    # Invalidate cache
                    if self.redis_client:
                        self.redis_client.delete('users:all')
                    
                    return jsonify({'message': 'User deleted successfully'}), 200
                else:
                    return jsonify({'error': 'User not found'}), 404
                    
        except Exception as e:
            if conn:
                conn.rollback()
            logger.error(f"Error deleting user {user_id}: {str(e)}")
            return jsonify({'error': 'Internal server error'}), 500
        finally:
            if conn:
                self.db_pool.putconn(conn)
    
    def _check_database(self) -> bool:
        """Check database connectivity"""
        conn = None
        try:
            conn = self.db_pool.getconn()
            with conn.cursor() as cursor:
                cursor.execute("SELECT 1")
                return True
        except Exception as e:
            logger.error(f"Database health check failed: {str(e)}")
            return False
        finally:
            if conn:
                self.db_pool.putconn(conn)
    
    def _check_cache(self) -> bool:
        """Check cache connectivity"""
        try:
            if self.redis_client:
                self.redis_client.ping()
                return True
            return False
        except Exception as e:
            logger.error(f"Cache health check failed: {str(e)}")
            return False
    
    def _signal_handler(self, signum, frame):
        """Handle shutdown signals gracefully (Factor IX: Disposability)"""
        logger.info(f"Received signal {signum}, initiating graceful shutdown...")
        self.shutdown_requested = True
    
    def _setup_health_checks(self):
        """Setup comprehensive health checks"""
        @self.app.route('/health/live', methods=['GET'])
        def liveness_check():
            """Kubernetes liveness probe"""
            if self.shutdown_requested:
                return jsonify({'status': 'shutting down'}), 503
            return jsonify({'status': 'alive'}), 200
    
    def run(self):
        """Run the application (Factor VII: Port binding)"""
        logger.info(f"Starting {self.config['APP_NAME']} v{self.config['APP_VERSION']} on port {self.config['PORT']}")
        
        try:
            self.app.run(
                host='0.0.0.0',
                port=self.config['PORT'],
                debug=self.config['ENVIRONMENT'] == 'development'
            )
        except KeyboardInterrupt:
            logger.info("Application interrupted by user")
        finally:
            self._cleanup()
    
    def _cleanup(self):
        """Cleanup resources on shutdown"""
        logger.info("Cleaning up resources...")
        
        if self.db_pool:
            self.db_pool.closeall()
            logger.info("Database connections closed")
        
        if self.redis_client:
            self.redis_client.close()
            logger.info("Redis connection closed")
        
        logger.info("Graceful shutdown completed")

# Database schema setup
DATABASE_SCHEMA = """
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
"""

if __name__ == '__main__':
    app = CloudNativeApp()
    app.run()
```

### Free Resources

- [The Twelve-Factor App](https://12factor.net/) - Cloud-native application methodology
- [Cloud Native Computing Foundation](https://www.cncf.io/) - Cloud native technologies
- [Microservices Patterns](https://microservices.io/patterns/) - Microservices architecture patterns
- [Spring Boot Documentation](https://spring.io/projects/spring-boot) - Java cloud-native framework

## 2. Containerization and Orchestration

### Advanced Docker and Kubernetes

**Production-Ready Dockerfile:**
```dockerfile
# Multi-stage Dockerfile for Python cloud-native application
# Build stage
FROM python:3.11-slim as builder

# Set build arguments
ARG APP_VERSION=1.0.0
ARG BUILD_DATE
ARG VCS_REF

# Install build dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Create virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Production stage
FROM python:3.11-slim as production

# Set labels for metadata
LABEL maintainer="cloud-engineering-team@company.com" \
      version="${APP_VERSION}" \
      build-date="${BUILD_DATE}" \
      vcs-ref="${VCS_REF}" \
      description="Cloud-native Python application"

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    libpq5 \
    curl \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Create non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Copy virtual environment from builder stage
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Set working directory
WORKDIR /app

# Copy application code
COPY --chown=appuser:appuser . .

# Create necessary directories
RUN mkdir -p /app/logs && chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8080

# Run application
CMD ["python", "app.py"]
```

**Kubernetes Deployment with Best Practices:**
```yaml
# kubernetes-manifests.yaml - Production Kubernetes deployment
apiVersion: v1
kind: Namespace
metadata:
  name: cloud-native-app
  labels:
    name: cloud-native-app
    environment: production

---
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: cloud-native-app
data:
  APP_NAME: "cloud-native-app"
  ENVIRONMENT: "production"
  LOG_LEVEL: "INFO"
  ENABLE_METRICS: "true"
  ENABLE_CACHING: "true"
  CACHE_TTL: "300"
  DATABASE_POOL_SIZE: "20"

---
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
  namespace: cloud-native-app
type: Opaque
data:
  DATABASE_URL: cG9zdGdyZXNxbDovL3VzZXI6cGFzc3dvcmRAcG9zdGdyZXM6NTQzMi9teWFwcA== # base64 encoded
  REDIS_URL: cmVkaXM6Ly9yZWRpczozNjM3 # base64 encoded
  API_KEY: eW91ci1hcGkta2V5LWhlcmU= # base64 encoded

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cloud-native-app
  namespace: cloud-native-app
  labels:
    app: cloud-native-app
    version: v1.0.0
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: cloud-native-app
  template:
    metadata:
      labels:
        app: cloud-native-app
        version: v1.0.0
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "8080"
        prometheus.io/path: "/metrics"
    spec:
      serviceAccountName: cloud-native-app
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        fsGroup: 1000
      containers:
      - name: app
        image: cloud-native-app:v1.0.0
        imagePullPolicy: Always
        ports:
        - containerPort: 8080
          name: http
          protocol: TCP
        env:
        - name: PORT
          value: "8080"
        envFrom:
        - configMapRef:
            name: app-config
        - secretRef:
            name: app-secrets
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health/live
            port: http
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /ready
            port: http
          initialDelaySeconds: 5
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3
        startupProbe:
          httpGet:
            path: /health
            port: http
          initialDelaySeconds: 10
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 30
        securityContext:
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
          capabilities:
            drop:
            - ALL
        volumeMounts:
        - name: tmp
          mountPath: /tmp
        - name: logs
          mountPath: /app/logs
      volumes:
      - name: tmp
        emptyDir: {}
      - name: logs
        emptyDir: {}
      nodeSelector:
        kubernetes.io/arch: amd64
      tolerations:
      - key: "spot"
        operator: "Equal"
        value: "true"
        effect: "NoSchedule"
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
          - weight: 100
            podAffinityTerm:
              labelSelector:
                matchExpressions:
                - key: app
                  operator: In
                  values:
                  - cloud-native-app
              topologyKey: kubernetes.io/hostname

---
apiVersion: v1
kind: Service
metadata:
  name: cloud-native-app-service
  namespace: cloud-native-app
  labels:
    app: cloud-native-app
  annotations:
    prometheus.io/scrape: "true"
    prometheus.io/port: "8080"
    prometheus.io/path: "/metrics"
spec:
  selector:
    app: cloud-native-app
  ports:
  - port: 80
    targetPort: http
    protocol: TCP
    name: http
  type: ClusterIP

---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: cloud-native-app-ingress
  namespace: cloud-native-app
  annotations:
    kubernetes.io/ingress.class: "nginx"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/rate-limit: "100"
    nginx.ingress.kubernetes.io/rate-limit-window: "1m"
spec:
  tls:
  - hosts:
    - api.example.com
    secretName: cloud-native-app-tls
  rules:
  - host: api.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: cloud-native-app-service
            port:
              number: 80

---
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: cloud-native-app-pdb
  namespace: cloud-native-app
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: cloud-native-app

---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: cloud-native-app-hpa
  namespace: cloud-native-app
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: cloud-native-app
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 10
        periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
      - type: Percent
        value: 50
        periodSeconds: 60

---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: cloud-native-app
  namespace: cloud-native-app

---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: cloud-native-app
  name: cloud-native-app-role
rules:
- apiGroups: [""]
  resources: ["configmaps", "secrets"]
  verbs: ["get", "list"]

---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: cloud-native-app-binding
  namespace: cloud-native-app
subjects:
- kind: ServiceAccount
  name: cloud-native-app
  namespace: cloud-native-app
roleRef:
  kind: Role
  name: cloud-native-app-role
  apiGroup: rbac.authorization.k8s.io
```

### Free Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/) - Complete Kubernetes reference
- [Docker Documentation](https://docs.docker.com/) - Docker containerization guide
- [Helm Charts](https://helm.sh/) - Kubernetes package manager
- [Kubernetes the Hard Way](https://github.com/kelseyhightower/kubernetes-the-hard-way) - Learn Kubernetes internals

## 3. Serverless Computing and Event-Driven Architecture

### Multi-Cloud Serverless Implementation

**AWS Lambda with Event-Driven Architecture:**
```python
# AWS Lambda function with comprehensive event handling
import json
import boto3
import logging
from datetime import datetime
from typing import Dict, Any, List
import os
import uuid

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

class ServerlessEventProcessor:
    def __init__(self):
        self.dynamodb = boto3.resource('dynamodb')
        self.s3 = boto3.client('s3')
        self.sns = boto3.client('sns')
        self.sqs = boto3.client('sqs')
        self.eventbridge = boto3.client('events')
        
        # Configuration from environment variables
        self.table_name = os.environ.get('DYNAMODB_TABLE', 'events')
        self.bucket_name = os.environ.get('S3_BUCKET', 'event-data')
        self.sns_topic_arn = os.environ.get('SNS_TOPIC_ARN')
        self.sqs_queue_url = os.environ.get('SQS_QUEUE_URL')
    
    def lambda_handler(self, event: Dict[str, Any], context: Any) -> Dict[str, Any]:
        """Main Lambda handler for multiple event sources"""
        try:
            # Log the incoming event
            logger.info(f"Processing event: {json.dumps(event)}")
            
            # Determine event source and route accordingly
            event_source = self._determine_event_source(event)
            
            if event_source == 'api_gateway':
                return self._handle_api_gateway_event(event, context)
            elif event_source == 's3':
                return self._handle_s3_event(event, context)
            elif event_source == 'dynamodb':
                return self._handle_dynamodb_event(event, context)
            elif event_source == 'sqs':
                return self._handle_sqs_event(event, context)
            elif event_source == 'eventbridge':
                return self._handle_eventbridge_event(event, context)
            elif event_source == 'sns':
                return self._handle_sns_event(event, context)
            else:
                logger.warning(f"Unknown event source: {event_source}")
                return self._create_response(400, {'error': 'Unknown event source'})
        
        except Exception as e:
            logger.error(f"Error processing event: {str(e)}")
            return self._create_response(500, {'error': 'Internal server error'})
    
    def _determine_event_source(self, event: Dict[str, Any]) -> str:
        """Determine the source of the event"""
        if 'httpMethod' in event:
            return 'api_gateway'
        elif 'Records' in event:
            if event['Records'][0].get('eventSource') == 'aws:s3':
                return 's3'
            elif event['Records'][0].get('eventSource') == 'aws:dynamodb':
                return 'dynamodb'
            elif event['Records'][0].get('eventSource') == 'aws:sqs':
                return 'sqs'
            elif event['Records'][0].get('EventSource') == 'aws:sns':
                return 'sns'
        elif 'source' in event and event['source'] == 'aws.events':
            return 'eventbridge'
        
        return 'unknown'
    
    def _handle_api_gateway_event(self, event: Dict[str, Any], context: Any) -> Dict[str, Any]:
        """Handle API Gateway events"""
        http_method = event['httpMethod']
        path = event['path']
        
        logger.info(f"API Gateway: {http_method} {path}")
        
        if http_method == 'POST' and path == '/events':
            return self._create_event(event)
        elif http_method == 'GET' and path.startswith('/events'):
            return self._get_events(event)
        else:
            return self._create_response(404, {'error': 'Not found'})
    
    def _handle_s3_event(self, event: Dict[str, Any], context: Any) -> Dict[str, Any]:
        """Handle S3 events"""
        for record in event['Records']:
            bucket = record['s3']['bucket']['name']
            key = record['s3']['object']['key']
            event_name = record['eventName']
            
            logger.info(f"S3 Event: {event_name} for {bucket}/{key}")
            
            # Process the S3 object
            self._process_s3_object(bucket, key, event_name)
        
        return {'statusCode': 200, 'body': 'S3 events processed'}
    
    def _handle_dynamodb_event(self, event: Dict[str, Any], context: Any) -> Dict[str, Any]:
        """Handle DynamoDB stream events"""
        for record in event['Records']:
            event_name = record['eventName']
            
            if event_name in ['INSERT', 'MODIFY', 'REMOVE']:
                self._process_dynamodb_change(record)
        
        return {'statusCode': 200, 'body': 'DynamoDB events processed'}
    
    def _handle_sqs_event(self, event: Dict[str, Any], context: Any) -> Dict[str, Any]:
        """Handle SQS events"""
        for record in event['Records']:
            message_body = json.loads(record['body'])
            receipt_handle = record['receiptHandle']
            
            logger.info(f"Processing SQS message: {message_body}")
            
            # Process the message
            success = self._process_sqs_message(message_body)
            
            if success:
                # Delete message from queue
                self.sqs.delete_message(
                    QueueUrl=self.sqs_queue_url,
                    ReceiptHandle=receipt_handle
                )
        
        return {'statusCode': 200, 'body': 'SQS messages processed'}
    
    def _handle_eventbridge_event(self, event: Dict[str, Any], context: Any) -> Dict[str, Any]:
        """Handle EventBridge events"""
        source = event.get('source')
        detail_type = event.get('detail-type')
        detail = event.get('detail', {})
        
        logger.info(f"EventBridge: {source} - {detail_type}")
        
        # Process based on event type
        if source == 'myapp.orders':
            self._process_order_event(detail_type, detail)
        elif source == 'myapp.users':
            self._process_user_event(detail_type, detail)
        
        return {'statusCode': 200, 'body': 'EventBridge event processed'}
    
    def _handle_sns_event(self, event: Dict[str, Any], context: Any) -> Dict[str, Any]:
        """Handle SNS events"""
        for record in event['Records']:
            message = json.loads(record['Sns']['Message'])
            subject = record['Sns']['Subject']
            
            logger.info(f"SNS: {subject}")
            
            # Process the SNS message
            self._process_sns_message(subject, message)
        
        return {'statusCode': 200, 'body': 'SNS events processed'}
    
    def _create_event(self, event: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new event"""
        try:
            body = json.loads(event['body'])
            
            # Validate required fields
            if 'event_type' not in body or 'data' not in body:
                return self._create_response(400, {'error': 'Missing required fields'})
            
            # Create event record
            event_id = str(uuid.uuid4())
            timestamp = datetime.utcnow().isoformat()
            
            table = self.dynamodb.Table(self.table_name)
            table.put_item(
                Item={
                    'event_id': event_id,
                    'event_type': body['event_type'],
                    'data': body['data'],
                    'timestamp': timestamp,
                    'source': 'api',
                    'processed': False
                }
            )
            
            # Publish to SNS for downstream processing
            if self.sns_topic_arn:
                self.sns.publish(
                    TopicArn=self.sns_topic_arn,
                    Message=json.dumps({
                        'event_id': event_id,
                        'event_type': body['event_type'],
                        'timestamp': timestamp
                    }),
                    Subject=f"New Event: {body['event_type']}"
                )
            
            return self._create_response(201, {
                'event_id': event_id,
                'message': 'Event created successfully'
            })
        
        except Exception as e:
            logger.error(f"Error creating event: {str(e)}")
            return self._create_response(500, {'error': 'Failed to create event'})
    
    def _get_events(self, event: Dict[str, Any]) -> Dict[str, Any]:
        """Get events with optional filtering"""
        try:
            query_params = event.get('queryStringParameters') or {}
            event_type = query_params.get('event_type')
            limit = int(query_params.get('limit', '10'))
            
            table = self.dynamodb.Table(self.table_name)
            
            if event_type:
                # Query by event type
                response = table.query(
                    IndexName='event_type-timestamp-index',
                    KeyConditionExpression='event_type = :event_type',
                    ExpressionAttributeValues={':event_type': event_type},
                    Limit=limit,
                    ScanIndexForward=False
                )
            else:
                # Scan all events
                response = table.scan(Limit=limit)
            
            events = response.get('Items', [])
            
            return self._create_response(200, {
                'events': events,
                'count': len(events)
            })
        
        except Exception as e:
            logger.error(f"Error getting events: {str(e)}")
            return self._create_response(500, {'error': 'Failed to get events'})
    
    def _process_s3_object(self, bucket: str, key: str, event_name: str):
        """Process S3 object changes"""
        try:
            if event_name.startswith('ObjectCreated'):
                # Get object metadata
                response = self.s3.head_object(Bucket=bucket, Key=key)
                
                # Store event in DynamoDB
                table = self.dynamodb.Table(self.table_name)
                table.put_item(
                    Item={
                        'event_id': str(uuid.uuid4()),
                        'event_type': 'file_uploaded',
                        'data': {
                            'bucket': bucket,
                            'key': key,
                            'size': response['ContentLength'],
                            'last_modified': response['LastModified'].isoformat()
                        },
                        'timestamp': datetime.utcnow().isoformat(),
                        'source': 's3',
                        'processed': False
                    }
                )
                
                logger.info(f"Processed S3 upload: {bucket}/{key}")
        
        except Exception as e:
            logger.error(f"Error processing S3 object: {str(e)}")
    
    def _process_dynamodb_change(self, record: Dict[str, Any]):
        """Process DynamoDB stream changes"""
        try:
            event_name = record['eventName']
            
            # Extract relevant data based on event type
            if event_name == 'INSERT':
                new_image = record['dynamodb']['NewImage']
                logger.info(f"DynamoDB INSERT: {new_image}")
            elif event_name == 'MODIFY':
                old_image = record['dynamodb']['OldImage']
                new_image = record['dynamodb']['NewImage']
                logger.info(f"DynamoDB MODIFY: {old_image} -> {new_image}")
            elif event_name == 'REMOVE':
                old_image = record['dynamodb']['OldImage']
                logger.info(f"DynamoDB REMOVE: {old_image}")
            
            # Publish change event
            if self.sns_topic_arn:
                self.sns.publish(
                    TopicArn=self.sns_topic_arn,
                    Message=json.dumps({
                        'event_type': f'dynamodb_{event_name.lower()}',
                        'table': record['eventSourceARN'].split('/')[-3],
                        'timestamp': datetime.utcnow().isoformat()
                    }),
                    Subject=f"DynamoDB {event_name}"
                )
        
        except Exception as e:
            logger.error(f"Error processing DynamoDB change: {str(e)}")
    
    def _process_sqs_message(self, message: Dict[str, Any]) -> bool:
        """Process SQS message"""
        try:
            # Simulate message processing
            logger.info(f"Processing message: {message}")
            
            # Store processed message
            table = self.dynamodb.Table(self.table_name)
            table.put_item(
                Item={
                    'event_id': str(uuid.uuid4()),
                    'event_type': 'message_processed',
                    'data': message,
                    'timestamp': datetime.utcnow().isoformat(),
                    'source': 'sqs',
                    'processed': True
                }
            )
            
            return True
        
        except Exception as e:
            logger.error(f"Error processing SQS message: {str(e)}")
            return False
    
    def _process_order_event(self, detail_type: str, detail: Dict[str, Any]):
        """Process order-related events"""
        logger.info(f"Processing order event: {detail_type}")
        
        if detail_type == 'Order Created':
            # Handle new order
            order_id = detail.get('order_id')
            customer_id = detail.get('customer_id')
            
            # Send notification
            if self.sns_topic_arn:
                self.sns.publish(
                    TopicArn=self.sns_topic_arn,
                    Message=json.dumps({
                        'order_id': order_id,
                        'customer_id': customer_id,
                        'status': 'created'
                    }),
                    Subject='New Order Created'
                )
    
    def _process_user_event(self, detail_type: str, detail: Dict[str, Any]):
        """Process user-related events"""
        logger.info(f"Processing user event: {detail_type}")
        
        if detail_type == 'User Registered':
            # Handle new user registration
            user_id = detail.get('user_id')
            email = detail.get('email')
            
            # Send welcome email (simulate)
            logger.info(f"Sending welcome email to {email}")
    
    def _process_sns_message(self, subject: str, message: Dict[str, Any]):
        """Process SNS message"""
        logger.info(f"Processing SNS message: {subject}")
        
        # Store SNS message
        table = self.dynamodb.Table(self.table_name)
        table.put_item(
            Item={
                'event_id': str(uuid.uuid4()),
                'event_type': 'sns_notification',
                'data': {
                    'subject': subject,
                    'message': message
                },
                'timestamp': datetime.utcnow().isoformat(),
                'source': 'sns',
                'processed': True
            }
        )
    
    def _create_response(self, status_code: int, body: Dict[str, Any]) -> Dict[str, Any]:
        """Create HTTP response"""
        return {
            'statusCode': status_code,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            },
            'body': json.dumps(body)
        }

# Initialize the processor
processor = ServerlessEventProcessor()

def lambda_handler(event, context):
    """AWS Lambda entry point"""
    return processor.lambda_handler(event, context)
```

### Free Resources

- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/) - Serverless computing on AWS
- [Azure Functions Documentation](https://docs.microsoft.com/en-us/azure/azure-functions/) - Azure serverless platform
- [Google Cloud Functions](https://cloud.google.com/functions/docs) - GCP serverless functions
- [Serverless Framework](https://www.serverless.com/) - Multi-cloud serverless deployment

## Hands-On Exercises

### Exercise 1: Cloud-Native Application Development

**Task:** Build a complete cloud-native application following twelve-factor principles.

**Requirements:**
- Implement all twelve factors in application design
- Use environment-based configuration
- Implement comprehensive logging and monitoring
- Create health checks and graceful shutdown
- Deploy to multiple cloud platforms

### Exercise 2: Kubernetes Production Deployment

**Task:** Deploy a multi-tier application to production Kubernetes cluster.

**Requirements:**
- Create production-ready Kubernetes manifests
- Implement security best practices
- Set up monitoring and observability
- Configure auto-scaling and load balancing
- Implement CI/CD pipeline for deployments

### Exercise 3: Serverless Event-Driven Architecture

**Task:** Build a comprehensive event-driven system using serverless technologies.

**Requirements:**
- Design event-driven architecture with multiple event sources
- Implement serverless functions across different cloud providers
- Set up event routing and processing
- Implement error handling and retry mechanisms
- Create monitoring and alerting for serverless functions

## Assessment Questions

1. **Design a cloud-native application architecture that follows twelve-factor principles and can be deployed across multiple cloud platforms.**

2. **Implement a comprehensive Kubernetes deployment strategy with security, monitoring, and auto-scaling.**

3. **Create an event-driven serverless architecture that can handle high-volume, real-time data processing.**

4. **Design a microservices architecture with proper service discovery, communication, and fault tolerance.**

5. **Implement a CI/CD pipeline optimized for cloud-native applications with automated testing and deployment.**

## Next Steps

After completing this module:

1. **Build production cloud-native applications** using modern development practices
2. **Master container orchestration** with Kubernetes in production environments
3. **Implement serverless architectures** for scalable, event-driven systems
4. **Move to Module 5: Advanced Cloud Architecture** to learn enterprise-scale solutions

## Additional Resources

### Development Frameworks
- [Spring Boot](https://spring.io/projects/spring-boot) - Java cloud-native framework
- [Express.js](https://expressjs.com/) - Node.js web framework
- [FastAPI](https://fastapi.tiangolo.com/) - Python API framework
- [ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/) - .NET cloud-native framework

### Container Orchestration
- [Kubernetes Documentation](https://kubernetes.io/docs/) - Complete Kubernetes reference
- [Helm](https://helm.sh/) - Kubernetes package manager
- [Istio](https://istio.io/) - Service mesh platform
- [Prometheus](https://prometheus.io/) - Monitoring and alerting

Ready to master enterprise cloud architecture? Continue to **Module 5: Advanced Cloud Architecture and Optimization** to complete your cloud engineering expertise!
