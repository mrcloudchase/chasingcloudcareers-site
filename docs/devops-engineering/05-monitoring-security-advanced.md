---
sidebar_position: 7
---

# Monitoring, Security, and Advanced Practices

Master comprehensive observability, implement enterprise security practices, and develop advanced DevOps capabilities for large-scale, mission-critical systems.

## Learning Objectives

By the end of this module, you will:
- Design and implement comprehensive observability and monitoring solutions
- Master DevSecOps practices and security automation throughout the development lifecycle
- Apply Site Reliability Engineering (SRE) principles and practices
- Optimize application and infrastructure performance at scale
- Build advanced automation and workflow orchestration systems

## 1. Comprehensive Observability and Monitoring

### The Three Pillars of Observability

**Metrics, Logs, and Traces Integration:**
```yaml
# observability-stack.yaml - Complete observability platform
apiVersion: v1
kind: Namespace
metadata:
  name: observability

---
# Prometheus for metrics
apiVersion: apps/v1
kind: Deployment
metadata:
  name: prometheus
  namespace: observability
spec:
  replicas: 2
  selector:
    matchLabels:
      app: prometheus
  template:
    metadata:
      labels:
        app: prometheus
    spec:
      serviceAccountName: prometheus
      containers:
      - name: prometheus
        image: prom/prometheus:v2.45.0
        ports:
        - containerPort: 9090
        args:
        - '--config.file=/etc/prometheus/prometheus.yml'
        - '--storage.tsdb.path=/prometheus'
        - '--web.console.libraries=/etc/prometheus/console_libraries'
        - '--web.console.templates=/etc/prometheus/consoles'
        - '--storage.tsdb.retention.time=30d'
        - '--web.enable-lifecycle'
        - '--web.enable-admin-api'
        - '--storage.tsdb.wal-compression'
        volumeMounts:
        - name: config
          mountPath: /etc/prometheus
        - name: storage
          mountPath: /prometheus
        resources:
          requests:
            memory: "2Gi"
            cpu: "500m"
          limits:
            memory: "4Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /-/healthy
            port: 9090
          initialDelaySeconds: 30
          timeoutSeconds: 30
        readinessProbe:
          httpGet:
            path: /-/ready
            port: 9090
          initialDelaySeconds: 5
          timeoutSeconds: 5
      volumes:
      - name: config
        configMap:
          name: prometheus-config
      - name: storage
        persistentVolumeClaim:
          claimName: prometheus-storage

---
# Grafana for visualization
apiVersion: apps/v1
kind: Deployment
metadata:
  name: grafana
  namespace: observability
spec:
  replicas: 1
  selector:
    matchLabels:
      app: grafana
  template:
    metadata:
      labels:
        app: grafana
    spec:
      containers:
      - name: grafana
        image: grafana/grafana:10.0.0
        ports:
        - containerPort: 3000
        env:
        - name: GF_SECURITY_ADMIN_PASSWORD
          valueFrom:
            secretKeyRef:
              name: grafana-secrets
              key: admin-password
        - name: GF_INSTALL_PLUGINS
          value: "grafana-piechart-panel,grafana-worldmap-panel"
        volumeMounts:
        - name: storage
          mountPath: /var/lib/grafana
        - name: config
          mountPath: /etc/grafana/provisioning
        resources:
          requests:
            memory: "256Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "200m"
      volumes:
      - name: storage
        persistentVolumeClaim:
          claimName: grafana-storage
      - name: config
        configMap:
          name: grafana-config

---
# Jaeger for distributed tracing
apiVersion: apps/v1
kind: Deployment
metadata:
  name: jaeger
  namespace: observability
spec:
  replicas: 1
  selector:
    matchLabels:
      app: jaeger
  template:
    metadata:
      labels:
        app: jaeger
    spec:
      containers:
      - name: jaeger
        image: jaegertracing/all-in-one:1.47
        ports:
        - containerPort: 16686
        - containerPort: 14268
        env:
        - name: COLLECTOR_ZIPKIN_HOST_PORT
          value: ":9411"
        - name: SPAN_STORAGE_TYPE
          value: "elasticsearch"
        - name: ES_SERVER_URLS
          value: "http://elasticsearch:9200"
        resources:
          requests:
            memory: "256Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "200m"

---
# Elasticsearch for log storage
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: elasticsearch
  namespace: observability
spec:
  serviceName: elasticsearch
  replicas: 3
  selector:
    matchLabels:
      app: elasticsearch
  template:
    metadata:
      labels:
        app: elasticsearch
    spec:
      containers:
      - name: elasticsearch
        image: docker.elastic.co/elasticsearch/elasticsearch:8.8.0
        ports:
        - containerPort: 9200
        - containerPort: 9300
        env:
        - name: cluster.name
          value: "observability-cluster"
        - name: node.name
          valueFrom:
            fieldRef:
              fieldPath: metadata.name
        - name: discovery.seed_hosts
          value: "elasticsearch-0.elasticsearch,elasticsearch-1.elasticsearch,elasticsearch-2.elasticsearch"
        - name: cluster.initial_master_nodes
          value: "elasticsearch-0,elasticsearch-1,elasticsearch-2"
        - name: ES_JAVA_OPTS
          value: "-Xms1g -Xmx1g"
        - name: xpack.security.enabled
          value: "false"
        volumeMounts:
        - name: data
          mountPath: /usr/share/elasticsearch/data
        resources:
          requests:
            memory: "2Gi"
            cpu: "500m"
          limits:
            memory: "4Gi"
            cpu: "1000m"
  volumeClaimTemplates:
  - metadata:
      name: data
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 10Gi

---
# Fluentd for log collection
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: fluentd
  namespace: observability
spec:
  selector:
    matchLabels:
      app: fluentd
  template:
    metadata:
      labels:
        app: fluentd
    spec:
      serviceAccountName: fluentd
      containers:
      - name: fluentd
        image: fluent/fluentd-kubernetes-daemonset:v1-debian-elasticsearch
        env:
        - name: FLUENT_ELASTICSEARCH_HOST
          value: "elasticsearch"
        - name: FLUENT_ELASTICSEARCH_PORT
          value: "9200"
        - name: FLUENT_ELASTICSEARCH_SCHEME
          value: "http"
        volumeMounts:
        - name: varlog
          mountPath: /var/log
        - name: varlibdockercontainers
          mountPath: /var/lib/docker/containers
          readOnly: true
        - name: config
          mountPath: /fluentd/etc
        resources:
          requests:
            memory: "200Mi"
            cpu: "100m"
          limits:
            memory: "400Mi"
            cpu: "200m"
      volumes:
      - name: varlog
        hostPath:
          path: /var/log
      - name: varlibdockercontainers
        hostPath:
          path: /var/lib/docker/containers
      - name: config
        configMap:
          name: fluentd-config
```

**Advanced Monitoring Configuration:**
```yaml
# prometheus-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
  namespace: observability
data:
  prometheus.yml: |
    global:
      scrape_interval: 15s
      evaluation_interval: 15s
      external_labels:
        cluster: 'production'
        region: 'us-west-2'

    rule_files:
      - "/etc/prometheus/rules/*.yml"

    alerting:
      alertmanagers:
      - static_configs:
        - targets:
          - alertmanager:9093

    scrape_configs:
    # Kubernetes API server
    - job_name: 'kubernetes-apiservers'
      kubernetes_sd_configs:
      - role: endpoints
      scheme: https
      tls_config:
        ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
      bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
      relabel_configs:
      - source_labels: [__meta_kubernetes_namespace, __meta_kubernetes_service_name, __meta_kubernetes_endpoint_port_name]
        action: keep
        regex: default;kubernetes;https

    # Kubernetes nodes
    - job_name: 'kubernetes-nodes'
      kubernetes_sd_configs:
      - role: node
      scheme: https
      tls_config:
        ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
      bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
      relabel_configs:
      - action: labelmap
        regex: __meta_kubernetes_node_label_(.+)
      - target_label: __address__
        replacement: kubernetes.default.svc:443
      - source_labels: [__meta_kubernetes_node_name]
        regex: (.+)
        target_label: __metrics_path__
        replacement: /api/v1/nodes/${1}/proxy/metrics

    # Kubernetes pods
    - job_name: 'kubernetes-pods'
      kubernetes_sd_configs:
      - role: pod
      relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
        action: replace
        target_label: __metrics_path__
        regex: (.+)
      - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
        action: replace
        regex: ([^:]+)(?::\d+)?;(\d+)
        replacement: $1:$2
        target_label: __address__
      - action: labelmap
        regex: __meta_kubernetes_pod_label_(.+)
      - source_labels: [__meta_kubernetes_namespace]
        action: replace
        target_label: kubernetes_namespace
      - source_labels: [__meta_kubernetes_pod_name]
        action: replace
        target_label: kubernetes_pod_name

    # Application metrics
    - job_name: 'application-metrics'
      kubernetes_sd_configs:
      - role: endpoints
      relabel_configs:
      - source_labels: [__meta_kubernetes_service_annotation_prometheus_io_scrape]
        action: keep
        regex: true
      - source_labels: [__meta_kubernetes_service_annotation_prometheus_io_scheme]
        action: replace
        target_label: __scheme__
        regex: (https?)
      - source_labels: [__meta_kubernetes_service_annotation_prometheus_io_path]
        action: replace
        target_label: __metrics_path__
        regex: (.+)
      - source_labels: [__address__, __meta_kubernetes_service_annotation_prometheus_io_port]
        action: replace
        target_label: __address__
        regex: ([^:]+)(?::\d+)?;(\d+)
        replacement: $1:$2
      - action: labelmap
        regex: __meta_kubernetes_service_label_(.+)
      - source_labels: [__meta_kubernetes_namespace]
        action: replace
        target_label: kubernetes_namespace
      - source_labels: [__meta_kubernetes_service_name]
        action: replace
        target_label: kubernetes_name

  rules.yml: |
    groups:
    - name: kubernetes.rules
      rules:
      - alert: KubernetesNodeReady
        expr: kube_node_status_condition{condition="Ready",status="true"} == 0
        for: 10m
        labels:
          severity: critical
        annotations:
          summary: "Kubernetes Node not ready"
          description: "Node {{ $labels.node }} has been unready for more than 10 minutes"

      - alert: KubernetesPodCrashLooping
        expr: rate(kube_pod_container_status_restarts_total[15m]) > 0
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Pod is crash looping"
          description: "Pod {{ $labels.namespace }}/{{ $labels.pod }} is crash looping"

      - alert: KubernetesHighCPUUsage
        expr: (sum by (instance) (rate(container_cpu_usage_seconds_total[5m])) * 100) > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage detected"
          description: "CPU usage is above 80% on {{ $labels.instance }}"

      - alert: KubernetesHighMemoryUsage
        expr: (sum by (instance) (container_memory_working_set_bytes) / sum by (instance) (container_spec_memory_limit_bytes) * 100) > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage detected"
          description: "Memory usage is above 80% on {{ $labels.instance }}"

    - name: application.rules
      rules:
      - alert: ApplicationHighErrorRate
        expr: (sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m]))) * 100 > 5
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High application error rate"
          description: "Application error rate is above 5% for more than 5 minutes"

      - alert: ApplicationHighLatency
        expr: histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le)) > 0.5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High application latency"
          description: "95th percentile latency is above 500ms for more than 5 minutes"
```

**Custom Metrics and Instrumentation:**
```python
#!/usr/bin/env python3
"""
Advanced application instrumentation with custom metrics
"""
import time
import random
from prometheus_client import Counter, Histogram, Gauge, start_http_server
from opentelemetry import trace
from opentelemetry.exporter.jaeger.thrift import JaegerExporter
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.instrumentation.flask import FlaskInstrumentor
from opentelemetry.instrumentation.requests import RequestsInstrumentor
from flask import Flask, request, jsonify
import logging
import structlog

# Configure structured logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()

# Configure OpenTelemetry tracing
trace.set_tracer_provider(TracerProvider())
tracer = trace.get_tracer(__name__)

jaeger_exporter = JaegerExporter(
    agent_host_name="jaeger",
    agent_port=6831,
)

span_processor = BatchSpanProcessor(jaeger_exporter)
trace.get_tracer_provider().add_span_processor(span_processor)

# Prometheus metrics
REQUEST_COUNT = Counter(
    'http_requests_total',
    'Total HTTP requests',
    ['method', 'endpoint', 'status']
)

REQUEST_LATENCY = Histogram(
    'http_request_duration_seconds',
    'HTTP request latency',
    ['method', 'endpoint']
)

ACTIVE_CONNECTIONS = Gauge(
    'active_connections',
    'Number of active connections'
)

BUSINESS_METRICS = Counter(
    'business_events_total',
    'Business events counter',
    ['event_type', 'user_type']
)

DATABASE_OPERATIONS = Histogram(
    'database_operation_duration_seconds',
    'Database operation duration',
    ['operation', 'table']
)

CACHE_OPERATIONS = Counter(
    'cache_operations_total',
    'Cache operations counter',
    ['operation', 'result']
)

# Flask application
app = Flask(__name__)

# Instrument Flask and requests
FlaskInstrumentor().instrument_app(app)
RequestsInstrumentor().instrument()

class MetricsMiddleware:
    def __init__(self, app):
        self.app = app
        self.app.before_request(self.before_request)
        self.app.after_request(self.after_request)
        
    def before_request(self):
        request.start_time = time.time()
        ACTIVE_CONNECTIONS.inc()
        
        logger.info(
            "Request started",
            method=request.method,
            path=request.path,
            remote_addr=request.remote_addr,
            user_agent=request.headers.get('User-Agent')
        )
    
    def after_request(self, response):
        request_latency = time.time() - request.start_time
        
        REQUEST_COUNT.labels(
            method=request.method,
            endpoint=request.endpoint or 'unknown',
            status=response.status_code
        ).inc()
        
        REQUEST_LATENCY.labels(
            method=request.method,
            endpoint=request.endpoint or 'unknown'
        ).observe(request_latency)
        
        ACTIVE_CONNECTIONS.dec()
        
        logger.info(
            "Request completed",
            method=request.method,
            path=request.path,
            status_code=response.status_code,
            duration=request_latency,
            response_size=response.content_length
        )
        
        return response

# Apply middleware
MetricsMiddleware(app)

@app.route('/health')
def health():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "timestamp": time.time()})

@app.route('/ready')
def ready():
    """Readiness check endpoint"""
    # Perform dependency checks here
    dependencies = {
        "database": check_database(),
        "cache": check_cache(),
        "external_api": check_external_api()
    }
    
    all_ready = all(dependencies.values())
    status_code = 200 if all_ready else 503
    
    return jsonify({
        "status": "ready" if all_ready else "not ready",
        "dependencies": dependencies,
        "timestamp": time.time()
    }), status_code

@app.route('/api/users', methods=['GET', 'POST'])
def users():
    """Users API endpoint with custom metrics"""
    with tracer.start_as_current_span("users_api") as span:
        span.set_attribute("http.method", request.method)
        span.set_attribute("http.url", request.url)
        
        if request.method == 'POST':
            # Simulate user creation
            user_data = request.get_json()
            user_type = user_data.get('type', 'regular')
            
            # Business metric
            BUSINESS_METRICS.labels(
                event_type='user_created',
                user_type=user_type
            ).inc()
            
            # Simulate database operation
            with tracer.start_as_current_span("database_insert") as db_span:
                db_start = time.time()
                simulate_database_operation('insert', 'users')
                db_duration = time.time() - db_start
                
                DATABASE_OPERATIONS.labels(
                    operation='insert',
                    table='users'
                ).observe(db_duration)
                
                db_span.set_attribute("db.operation", "insert")
                db_span.set_attribute("db.table", "users")
                db_span.set_attribute("db.duration", db_duration)
            
            logger.info(
                "User created",
                user_type=user_type,
                user_id=user_data.get('id'),
                database_duration=db_duration
            )
            
            return jsonify({"message": "User created", "id": user_data.get('id')}), 201
        
        else:
            # Simulate cache check
            cache_start = time.time()
            cache_hit = simulate_cache_operation('get', 'users_list')
            cache_duration = time.time() - cache_start
            
            CACHE_OPERATIONS.labels(
                operation='get',
                result='hit' if cache_hit else 'miss'
            ).inc()
            
            if not cache_hit:
                # Simulate database query
                with tracer.start_as_current_span("database_select") as db_span:
                    db_start = time.time()
                    users = simulate_database_operation('select', 'users')
                    db_duration = time.time() - db_start
                    
                    DATABASE_OPERATIONS.labels(
                        operation='select',
                        table='users'
                    ).observe(db_duration)
                    
                    db_span.set_attribute("db.operation", "select")
                    db_span.set_attribute("db.table", "users")
                    db_span.set_attribute("db.rows_returned", len(users))
            
            logger.info(
                "Users retrieved",
                cache_hit=cache_hit,
                cache_duration=cache_duration,
                user_count=len(users) if not cache_hit else "cached"
            )
            
            return jsonify({"users": users if not cache_hit else "cached_data"})

def check_database():
    """Check database connectivity"""
    try:
        # Simulate database check
        time.sleep(random.uniform(0.01, 0.05))
        return random.choice([True, True, True, False])  # 75% success rate
    except Exception as e:
        logger.error("Database check failed", error=str(e))
        return False

def check_cache():
    """Check cache connectivity"""
    try:
        # Simulate cache check
        time.sleep(random.uniform(0.005, 0.02))
        return random.choice([True, True, True, True, False])  # 80% success rate
    except Exception as e:
        logger.error("Cache check failed", error=str(e))
        return False

def check_external_api():
    """Check external API connectivity"""
    try:
        # Simulate external API check
        time.sleep(random.uniform(0.1, 0.3))
        return random.choice([True, True, False])  # 66% success rate
    except Exception as e:
        logger.error("External API check failed", error=str(e))
        return False

def simulate_database_operation(operation, table):
    """Simulate database operation"""
    # Simulate varying latency
    latency = random.uniform(0.01, 0.1)
    time.sleep(latency)
    
    if operation == 'select':
        return [{"id": i, "name": f"User {i}"} for i in range(1, 11)]
    elif operation == 'insert':
        return {"id": random.randint(1000, 9999)}
    
    return None

def simulate_cache_operation(operation, key):
    """Simulate cache operation"""
    # Simulate cache hit/miss
    time.sleep(random.uniform(0.001, 0.005))
    return random.choice([True, False])  # 50% hit rate

@app.route('/metrics')
def metrics():
    """Prometheus metrics endpoint"""
    from prometheus_client import generate_latest, CONTENT_TYPE_LATEST
    return generate_latest(), 200, {'Content-Type': CONTENT_TYPE_LATEST}

if __name__ == '__main__':
    # Start Prometheus metrics server
    start_http_server(8000)
    
    logger.info("Application starting", port=5000, metrics_port=8000)
    
    # Start Flask application
    app.run(host='0.0.0.0', port=5000, debug=False)
```

### Free Resources

- [Prometheus Documentation](https://prometheus.io/docs/) - Complete monitoring solution
- [Grafana Documentation](https://grafana.com/docs/) - Visualization and dashboards
- [Jaeger Documentation](https://www.jaegertracing.io/docs/) - Distributed tracing
- [OpenTelemetry](https://opentelemetry.io/) - Observability framework

## 2. DevSecOps and Security Automation

### Security in the Development Lifecycle

**Automated Security Pipeline:**
```yaml
# .github/workflows/security-pipeline.yml
name: DevSecOps Security Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  security-scan:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      security-events: write
      
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      # Static Application Security Testing (SAST)
      - name: Run CodeQL Analysis
        uses: github/codeql-action/init@v2
        with:
          languages: javascript, python
          queries: security-extended,security-and-quality

      - name: Autobuild
        uses: github/codeql-action/autobuild@v2

      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v2

      # Secret scanning
      - name: Run TruffleHog OSS
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: main
          head: HEAD
          extra_args: --debug --only-verified

      # Dependency scanning
      - name: Run Snyk to check for vulnerabilities
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

      # Infrastructure as Code scanning
      - name: Run Checkov
        uses: bridgecrewio/checkov-action@master
        with:
          directory: .
          framework: terraform,kubernetes,dockerfile
          output_format: sarif
          output_file_path: checkov-results.sarif

      - name: Upload Checkov results to GitHub Security tab
        uses: github/codeql-action/upload-sarif@v2
        if: always()
        with:
          sarif_file: checkov-results.sarif

      # License compliance
      - name: FOSSA Scan
        uses: fossa-contrib/fossa-action@v2
        with:
          api-key: ${{ secrets.FOSSA_API_KEY }}

  container-security:
    runs-on: ubuntu-latest
    needs: security-scan
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Build Docker image
        run: |
          docker build -t ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }} .

      # Container vulnerability scanning
      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
          format: 'sarif'
          output: 'trivy-results.sarif'

      - name: Upload Trivy scan results
        uses: github/codeql-action/upload-sarif@v2
        if: always()
        with:
          sarif_file: 'trivy-results.sarif'

      # Container configuration scanning
      - name: Run Dockle
        run: |
          curl -L -o dockle.deb https://github.com/goodwithtech/dockle/releases/download/v0.4.10/dockle_0.4.10_Linux-64bit.deb
          sudo dpkg -i dockle.deb
          dockle --exit-code 1 --exit-level warn ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}

      # Runtime security scanning
      - name: Run Falco rules check
        run: |
          docker run --rm -v $(pwd):/workspace falcosecurity/falco:latest \
            falco --dry-run -r /workspace/security/falco-rules.yaml

  compliance-check:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      # CIS Benchmark compliance
      - name: Run Docker Bench Security
        run: |
          docker run --rm --net host --pid host --userns host --cap-add audit_control \
            -e DOCKER_CONTENT_TRUST=$DOCKER_CONTENT_TRUST \
            -v /etc:/etc:ro \
            -v /usr/bin/containerd:/usr/bin/containerd:ro \
            -v /usr/bin/runc:/usr/bin/runc:ro \
            -v /usr/lib/systemd:/usr/lib/systemd:ro \
            -v /var/lib:/var/lib:ro \
            -v /var/run/docker.sock:/var/run/docker.sock:ro \
            --label docker_bench_security \
            docker/docker-bench-security

      # Kubernetes security scanning
      - name: Run kube-score
        run: |
          curl -L https://github.com/zegl/kube-score/releases/download/v1.16.1/kube-score_1.16.1_linux_amd64.tar.gz | tar xz
          ./kube-score score k8s/*.yaml

      # Policy as Code validation
      - name: Run OPA Conftest
        run: |
          curl -L https://github.com/open-policy-agent/conftest/releases/download/v0.46.0/conftest_0.46.0_Linux_x86_64.tar.gz | tar xz
          ./conftest verify --policy security/policies k8s/*.yaml
```

**Security Policies as Code:**
```rego
# security/policies/kubernetes.rego
package kubernetes.security

# Deny containers running as root
deny[msg] {
    input.kind == "Deployment"
    input.spec.template.spec.containers[_].securityContext.runAsUser == 0
    msg := "Container must not run as root user"
}

# Require security context
deny[msg] {
    input.kind == "Deployment"
    container := input.spec.template.spec.containers[_]
    not container.securityContext
    msg := "Container must define securityContext"
}

# Require resource limits
deny[msg] {
    input.kind == "Deployment"
    container := input.spec.template.spec.containers[_]
    not container.resources.limits
    msg := "Container must define resource limits"
}

# Deny privileged containers
deny[msg] {
    input.kind == "Deployment"
    input.spec.template.spec.containers[_].securityContext.privileged == true
    msg := "Privileged containers are not allowed"
}

# Require read-only root filesystem
deny[msg] {
    input.kind == "Deployment"
    container := input.spec.template.spec.containers[_]
    not container.securityContext.readOnlyRootFilesystem == true
    msg := "Container must have read-only root filesystem"
}

# Deny containers with capabilities
deny[msg] {
    input.kind == "Deployment"
    container := input.spec.template.spec.containers[_]
    container.securityContext.capabilities.add
    msg := "Containers must not add capabilities"
}

# Require non-root user
deny[msg] {
    input.kind == "Deployment"
    container := input.spec.template.spec.containers[_]
    not container.securityContext.runAsNonRoot == true
    msg := "Container must run as non-root user"
}

# Network policy requirements
deny[msg] {
    input.kind == "Deployment"
    not input.metadata.labels["network-policy"]
    msg := "Deployment must have network-policy label"
}

# Image scanning requirements
deny[msg] {
    input.kind == "Deployment"
    container := input.spec.template.spec.containers[_]
    not startswith(container.image, "registry.company.com/")
    msg := "Container image must come from approved registry"
}

# Service account requirements
deny[msg] {
    input.kind == "Deployment"
    not input.spec.template.spec.serviceAccountName
    msg := "Deployment must specify serviceAccountName"
}
```

**Runtime Security Monitoring:**
```yaml
# falco-rules.yaml - Runtime security rules
- rule: Detect Shell in Container
  desc: Detect shell execution in container
  condition: >
    spawned_process and container and
    (proc.name in (shell_binaries) or
     proc.name in (bash, sh, zsh, fish, csh, ksh))
  output: >
    Shell spawned in container (user=%user.name container_id=%container.id
    container_name=%container.name shell=%proc.name parent=%proc.pname
    cmdline=%proc.cmdline)
  priority: WARNING
  tags: [container, shell, mitre_execution]

- rule: Detect Privilege Escalation
  desc: Detect privilege escalation attempts
  condition: >
    spawned_process and container and
    (proc.name in (sudo, su, doas) or
     proc.cmdline contains "chmod +s" or
     proc.cmdline contains "setuid")
  output: >
    Privilege escalation attempt detected (user=%user.name
    container_id=%container.id container_name=%container.name
    command=%proc.cmdline)
  priority: HIGH
  tags: [container, privilege_escalation, mitre_privilege_escalation]

- rule: Detect Network Activity
  desc: Detect unexpected network activity
  condition: >
    inbound_outbound and container and
    not proc.name in (allowed_network_processes) and
    not fd.sport in (allowed_ports) and
    not fd.dport in (allowed_ports)
  output: >
    Unexpected network activity (user=%user.name container_id=%container.id
    container_name=%container.name connection=%fd.name)
  priority: WARNING
  tags: [container, network, mitre_command_and_control]

- rule: Detect File System Changes
  desc: Detect unauthorized file system modifications
  condition: >
    open_write and container and
    (fd.name startswith /etc or
     fd.name startswith /usr/bin or
     fd.name startswith /usr/sbin or
     fd.name startswith /bin or
     fd.name startswith /sbin) and
    not proc.name in (allowed_system_processes)
  output: >
    Unauthorized file system modification (user=%user.name
    container_id=%container.id container_name=%container.name
    file=%fd.name command=%proc.cmdline)
  priority: HIGH
  tags: [container, filesystem, mitre_persistence]

- rule: Detect Crypto Mining
  desc: Detect potential cryptocurrency mining activity
  condition: >
    spawned_process and container and
    (proc.name in (xmrig, cpuminer, cgminer, bfgminer) or
     proc.cmdline contains "stratum+tcp" or
     proc.cmdline contains "mining" or
     proc.cmdline contains "cryptonight")
  output: >
    Potential crypto mining activity detected (user=%user.name
    container_id=%container.id container_name=%container.name
    command=%proc.cmdline)
  priority: CRITICAL
  tags: [container, crypto_mining, mitre_impact]
```

### Secrets Management and Encryption

**HashiCorp Vault Integration:**
```python
#!/usr/bin/env python3
"""
Secrets management with HashiCorp Vault
"""
import hvac
import os
import json
import base64
from cryptography.fernet import Fernet
from kubernetes import client, config
import logging

logger = logging.getLogger(__name__)

class SecretsManager:
    def __init__(self, vault_url=None, vault_token=None):
        self.vault_url = vault_url or os.getenv('VAULT_ADDR', 'http://vault:8200')
        self.vault_token = vault_token or os.getenv('VAULT_TOKEN')
        
        # Initialize Vault client
        self.vault_client = hvac.Client(
            url=self.vault_url,
            token=self.vault_token
        )
        
        # Initialize Kubernetes client
        try:
            config.load_incluster_config()
        except:
            config.load_kube_config()
        
        self.k8s_client = client.CoreV1Api()
        
        # Initialize encryption key
        self.encryption_key = self._get_or_create_encryption_key()
        self.cipher_suite = Fernet(self.encryption_key)
    
    def _get_or_create_encryption_key(self):
        """Get or create encryption key from Vault"""
        try:
            # Try to read existing key
            response = self.vault_client.secrets.kv.v2.read_secret_version(
                path='encryption/master-key'
            )
            return response['data']['data']['key'].encode()
        except:
            # Create new key if doesn't exist
            key = Fernet.generate_key()
            self.vault_client.secrets.kv.v2.create_or_update_secret(
                path='encryption/master-key',
                secret={'key': key.decode()}
            )
            return key
    
    def store_secret(self, path, secret_data, encrypt=True):
        """Store secret in Vault with optional encryption"""
        try:
            if encrypt:
                # Encrypt sensitive data
                encrypted_data = {}
                for key, value in secret_data.items():
                    if isinstance(value, str):
                        encrypted_value = self.cipher_suite.encrypt(value.encode())
                        encrypted_data[key] = base64.b64encode(encrypted_value).decode()
                    else:
                        encrypted_data[key] = value
                
                # Store encrypted data
                self.vault_client.secrets.kv.v2.create_or_update_secret(
                    path=path,
                    secret=encrypted_data
                )
            else:
                # Store unencrypted data
                self.vault_client.secrets.kv.v2.create_or_update_secret(
                    path=path,
                    secret=secret_data
                )
            
            logger.info(f"Secret stored successfully at path: {path}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to store secret: {str(e)}")
            return False
    
    def retrieve_secret(self, path, decrypt=True):
        """Retrieve secret from Vault with optional decryption"""
        try:
            response = self.vault_client.secrets.kv.v2.read_secret_version(path=path)
            secret_data = response['data']['data']
            
            if decrypt:
                # Decrypt sensitive data
                decrypted_data = {}
                for key, value in secret_data.items():
                    if isinstance(value, str):
                        try:
                            encrypted_value = base64.b64decode(value.encode())
                            decrypted_value = self.cipher_suite.decrypt(encrypted_value)
                            decrypted_data[key] = decrypted_value.decode()
                        except:
                            # Value might not be encrypted
                            decrypted_data[key] = value
                    else:
                        decrypted_data[key] = value
                
                return decrypted_data
            else:
                return secret_data
                
        except Exception as e:
            logger.error(f"Failed to retrieve secret: {str(e)}")
            return None
    
    def create_k8s_secret(self, name, namespace, secret_data, secret_type='Opaque'):
        """Create Kubernetes secret from Vault data"""
        try:
            # Encode secret data
            encoded_data = {}
            for key, value in secret_data.items():
                encoded_data[key] = base64.b64encode(value.encode()).decode()
            
            # Create secret object
            secret = client.V1Secret(
                metadata=client.V1ObjectMeta(
                    name=name,
                    namespace=namespace,
                    annotations={
                        'vault.hashicorp.com/agent-inject': 'true',
                        'vault.hashicorp.com/role': 'myapp',
                        'vault.hashicorp.com/agent-inject-secret-config': f'secret/data/{name}'
                    }
                ),
                type=secret_type,
                data=encoded_data
            )
            
            # Create or update secret
            try:
                self.k8s_client.create_namespaced_secret(
                    namespace=namespace,
                    body=secret
                )
                logger.info(f"Created Kubernetes secret: {name}")
            except client.ApiException as e:
                if e.status == 409:  # Secret already exists
                    self.k8s_client.patch_namespaced_secret(
                        name=name,
                        namespace=namespace,
                        body=secret
                    )
                    logger.info(f"Updated Kubernetes secret: {name}")
                else:
                    raise
            
            return True
            
        except Exception as e:
            logger.error(f"Failed to create Kubernetes secret: {str(e)}")
            return False
    
    def rotate_secret(self, path, new_secret_data):
        """Rotate secret with versioning"""
        try:
            # Store new version
            self.store_secret(path, new_secret_data)
            
            # Get secret metadata
            response = self.vault_client.secrets.kv.v2.read_secret_metadata(path=path)
            current_version = response['data']['current_version']
            
            # Keep only last 5 versions
            if current_version > 5:
                versions_to_delete = list(range(1, current_version - 4))
                self.vault_client.secrets.kv.v2.delete_secret_versions(
                    path=path,
                    versions=versions_to_delete
                )
            
            logger.info(f"Secret rotated successfully: {path}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to rotate secret: {str(e)}")
            return False
    
    def audit_secret_access(self, path):
        """Audit secret access logs"""
        try:
            # This would typically integrate with Vault's audit logs
            # For demonstration, we'll show how to query audit data
            
            audit_data = {
                'path': path,
                'access_count': 0,
                'last_accessed': None,
                'accessed_by': []
            }
            
            # In a real implementation, you would query Vault's audit logs
            # or integrate with your logging system
            
            return audit_data
            
        except Exception as e:
            logger.error(f"Failed to audit secret access: {str(e)}")
            return None

# Usage example
if __name__ == "__main__":
    secrets_manager = SecretsManager()
    
    # Store application secrets
    app_secrets = {
        'database_url': 'postgresql://user:password@db:5432/myapp',
        'api_key': 'sk-1234567890abcdef',
        'jwt_secret': 'super-secret-jwt-key'
    }
    
    secrets_manager.store_secret('myapp/production', app_secrets)
    
    # Retrieve secrets
    retrieved_secrets = secrets_manager.retrieve_secret('myapp/production')
    print("Retrieved secrets:", retrieved_secrets)
    
    # Create Kubernetes secret
    secrets_manager.create_k8s_secret(
        name='myapp-secrets',
        namespace='production',
        secret_data=retrieved_secrets
    )
    
    # Rotate secrets
    new_secrets = app_secrets.copy()
    new_secrets['api_key'] = 'sk-new-key-0987654321'
    secrets_manager.rotate_secret('myapp/production', new_secrets)
```

### Free Resources

- [OWASP DevSecOps Guideline](https://owasp.org/www-project-devsecops-guideline/) - DevSecOps best practices
- [HashiCorp Vault](https://www.vaultproject.io/) - Secrets management
- [Falco Security Monitoring](https://falco.org/) - Runtime security monitoring
- [Open Policy Agent](https://www.openpolicyagent.org/) - Policy as code

## 3. Site Reliability Engineering (SRE)

### SRE Principles and Practices

**Service Level Objectives (SLOs) and Error Budgets:**
```python
#!/usr/bin/env python3
"""
SRE Service Level Objectives and Error Budget Management
"""
import time
import json
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict
from typing import List, Dict, Optional
import requests
import logging

logger = logging.getLogger(__name__)

@dataclass
class SLI:
    """Service Level Indicator"""
    name: str
    description: str
    query: str
    unit: str
    good_threshold: float
    
@dataclass
class SLO:
    """Service Level Objective"""
    name: str
    description: str
    sli: SLI
    target: float  # e.g., 99.9 for 99.9%
    window: str    # e.g., "30d" for 30 days
    
@dataclass
class ErrorBudget:
    """Error Budget calculation"""
    slo_name: str
    target: float
    actual: float
    budget_remaining: float
    budget_consumed: float
    is_exhausted: bool
    time_to_exhaustion: Optional[str]

class SREMonitor:
    def __init__(self, prometheus_url: str):
        self.prometheus_url = prometheus_url
        self.slis = self._define_slis()
        self.slos = self._define_slos()
    
    def _define_slis(self) -> List[SLI]:
        """Define Service Level Indicators"""
        return [
            SLI(
                name="availability",
                description="Percentage of successful requests",
                query="""
                (
                  sum(rate(http_requests_total{status!~"5.."}[5m])) /
                  sum(rate(http_requests_total[5m]))
                ) * 100
                """,
                unit="percentage",
                good_threshold=99.0
            ),
            SLI(
                name="latency_p99",
                description="99th percentile response time",
                query="""
                histogram_quantile(0.99,
                  sum(rate(http_request_duration_seconds_bucket[5m])) by (le)
                ) * 1000
                """,
                unit="milliseconds",
                good_threshold=500.0
            ),
            SLI(
                name="error_rate",
                description="Percentage of error responses",
                query="""
                (
                  sum(rate(http_requests_total{status=~"5.."}[5m])) /
                  sum(rate(http_requests_total[5m]))
                ) * 100
                """,
                unit="percentage",
                good_threshold=1.0
            ),
            SLI(
                name="throughput",
                description="Requests per second",
                query="sum(rate(http_requests_total[5m]))",
                unit="requests/second",
                good_threshold=100.0
            )
        ]
    
    def _define_slos(self) -> List[SLO]:
        """Define Service Level Objectives"""
        sli_map = {sli.name: sli for sli in self.slis}
        
        return [
            SLO(
                name="availability_slo",
                description="Service availability must be >= 99.9%",
                sli=sli_map["availability"],
                target=99.9,
                window="30d"
            ),
            SLO(
                name="latency_slo",
                description="99th percentile latency must be <= 500ms",
                sli=sli_map["latency_p99"],
                target=500.0,
                window="30d"
            ),
            SLO(
                name="error_rate_slo",
                description="Error rate must be <= 0.1%",
                sli=sli_map["error_rate"],
                target=0.1,
                window="30d"
            )
        ]
    
    def query_prometheus(self, query: str, time_range: str = "30d") -> Dict:
        """Query Prometheus for metrics"""
        try:
            # Calculate time range
            end_time = datetime.now()
            if time_range.endswith('d'):
                days = int(time_range[:-1])
                start_time = end_time - timedelta(days=days)
            elif time_range.endswith('h'):
                hours = int(time_range[:-1])
                start_time = end_time - timedelta(hours=hours)
            else:
                start_time = end_time - timedelta(days=30)
            
            # Query Prometheus
            params = {
                'query': query,
                'start': start_time.isoformat(),
                'end': end_time.isoformat(),
                'step': '5m'
            }
            
            response = requests.get(
                f"{self.prometheus_url}/api/v1/query_range",
                params=params,
                timeout=30
            )
            response.raise_for_status()
            
            return response.json()
            
        except Exception as e:
            logger.error(f"Failed to query Prometheus: {str(e)}")
            return {}
    
    def calculate_sli_value(self, sli: SLI, time_range: str = "30d") -> float:
        """Calculate current SLI value"""
        try:
            result = self.query_prometheus(sli.query, time_range)
            
            if result.get('status') == 'success' and result.get('data', {}).get('result'):
                # Get the latest value
                values = result['data']['result'][0]['values']
                if values:
                    latest_value = float(values[-1][1])
                    return latest_value
            
            return 0.0
            
        except Exception as e:
            logger.error(f"Failed to calculate SLI value for {sli.name}: {str(e)}")
            return 0.0
    
    def calculate_error_budget(self, slo: SLO) -> ErrorBudget:
        """Calculate error budget for an SLO"""
        try:
            # Get current SLI value
            current_value = self.calculate_sli_value(slo.sli, slo.window)
            
            # Calculate error budget
            if slo.sli.name in ["availability"]:
                # For availability, higher is better
                actual_performance = current_value
                target_performance = slo.target
                
                if actual_performance >= target_performance:
                    budget_remaining = 100.0
                    budget_consumed = 0.0
                else:
                    budget_consumed = ((target_performance - actual_performance) / 
                                     (100 - target_performance)) * 100
                    budget_remaining = max(0, 100 - budget_consumed)
                    
            elif slo.sli.name in ["error_rate"]:
                # For error rate, lower is better
                actual_performance = current_value
                target_performance = slo.target
                
                if actual_performance <= target_performance:
                    budget_remaining = 100.0
                    budget_consumed = 0.0
                else:
                    budget_consumed = (actual_performance / target_performance) * 100
                    budget_remaining = max(0, 100 - budget_consumed)
                    
            elif slo.sli.name in ["latency_p99"]:
                # For latency, lower is better
                actual_performance = current_value
                target_performance = slo.target
                
                if actual_performance <= target_performance:
                    budget_remaining = 100.0
                    budget_consumed = 0.0
                else:
                    budget_consumed = ((actual_performance - target_performance) / 
                                     target_performance) * 100
                    budget_remaining = max(0, 100 - budget_consumed)
            else:
                budget_remaining = 100.0
                budget_consumed = 0.0
            
            is_exhausted = budget_remaining <= 0
            
            # Estimate time to exhaustion (simplified)
            time_to_exhaustion = None
            if budget_remaining > 0 and budget_consumed > 0:
                # This is a simplified calculation
                consumption_rate = budget_consumed / 30  # per day
                if consumption_rate > 0:
                    days_remaining = budget_remaining / consumption_rate
                    time_to_exhaustion = f"{days_remaining:.1f} days"
            
            return ErrorBudget(
                slo_name=slo.name,
                target=slo.target,
                actual=current_value,
                budget_remaining=budget_remaining,
                budget_consumed=budget_consumed,
                is_exhausted=is_exhausted,
                time_to_exhaustion=time_to_exhaustion
            )
            
        except Exception as e:
            logger.error(f"Failed to calculate error budget for {slo.name}: {str(e)}")
            return ErrorBudget(
                slo_name=slo.name,
                target=slo.target,
                actual=0.0,
                budget_remaining=0.0,
                budget_consumed=100.0,
                is_exhausted=True,
                time_to_exhaustion=None
            )
    
    def generate_sre_report(self) -> Dict:
        """Generate comprehensive SRE report"""
        report = {
            'timestamp': datetime.now().isoformat(),
            'slis': [],
            'slos': [],
            'error_budgets': [],
            'alerts': [],
            'recommendations': []
        }
        
        # Calculate SLI values
        for sli in self.slis:
            current_value = self.calculate_sli_value(sli)
            report['slis'].append({
                'name': sli.name,
                'description': sli.description,
                'current_value': current_value,
                'unit': sli.unit,
                'good_threshold': sli.good_threshold,
                'status': 'good' if current_value >= sli.good_threshold else 'bad'
            })
        
        # Calculate SLO compliance and error budgets
        for slo in self.slos:
            error_budget = self.calculate_error_budget(slo)
            
            report['slos'].append({
                'name': slo.name,
                'description': slo.description,
                'target': slo.target,
                'actual': error_budget.actual,
                'window': slo.window,
                'status': 'compliant' if not error_budget.is_exhausted else 'violated'
            })
            
            report['error_budgets'].append(asdict(error_budget))
            
            # Generate alerts
            if error_budget.is_exhausted:
                report['alerts'].append({
                    'severity': 'critical',
                    'message': f"Error budget exhausted for {slo.name}",
                    'slo': slo.name,
                    'budget_remaining': error_budget.budget_remaining
                })
            elif error_budget.budget_remaining < 10:
                report['alerts'].append({
                    'severity': 'warning',
                    'message': f"Error budget low for {slo.name}",
                    'slo': slo.name,
                    'budget_remaining': error_budget.budget_remaining
                })
        
        # Generate recommendations
        for error_budget in report['error_budgets']:
            if error_budget['is_exhausted']:
                report['recommendations'].append({
                    'priority': 'high',
                    'action': f"Immediate attention required for {error_budget['slo_name']}",
                    'description': "Error budget is exhausted. Consider implementing emergency measures."
                })
            elif error_budget['budget_remaining'] < 25:
                report['recommendations'].append({
                    'priority': 'medium',
                    'action': f"Monitor {error_budget['slo_name']} closely",
                    'description': "Error budget is running low. Review recent changes and performance."
                })
        
        return report
    
    def should_halt_deployments(self) -> bool:
        """Determine if deployments should be halted based on error budgets"""
        for slo in self.slos:
            error_budget = self.calculate_error_budget(slo)
            if error_budget.is_exhausted:
                logger.warning(f"Deployment halt recommended: {slo.name} error budget exhausted")
                return True
        return False

# Usage example
if __name__ == "__main__":
    sre_monitor = SREMonitor("http://prometheus:9090")
    
    # Generate SRE report
    report = sre_monitor.generate_sre_report()
    print(json.dumps(report, indent=2))
    
    # Check if deployments should be halted
    if sre_monitor.should_halt_deployments():
        print("🚨 DEPLOYMENT HALT RECOMMENDED - Error budgets exhausted")
    else:
        print("✅ Deployments can proceed - Error budgets healthy")
```

### Incident Management and Post-Mortems

**Automated Incident Response:**
```python
#!/usr/bin/env python3
"""
Automated Incident Management System
"""
import json
import time
from datetime import datetime, timedelta
from enum import Enum
from dataclasses import dataclass, field
from typing import List, Dict, Optional
import requests
import logging

logger = logging.getLogger(__name__)

class IncidentSeverity(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class IncidentStatus(Enum):
    OPEN = "open"
    INVESTIGATING = "investigating"
    IDENTIFIED = "identified"
    MONITORING = "monitoring"
    RESOLVED = "resolved"
    CLOSED = "closed"

@dataclass
class IncidentAction:
    timestamp: datetime
    action: str
    user: str
    details: str

@dataclass
class Incident:
    id: str
    title: str
    description: str
    severity: IncidentSeverity
    status: IncidentStatus
    created_at: datetime
    updated_at: datetime
    resolved_at: Optional[datetime] = None
    affected_services: List[str] = field(default_factory=list)
    actions: List[IncidentAction] = field(default_factory=list)
    metrics: Dict = field(default_factory=dict)
    root_cause: Optional[str] = None
    resolution: Optional[str] = None

class IncidentManager:
    def __init__(self, config: Dict):
        self.config = config
        self.incidents: Dict[str, Incident] = {}
        self.notification_channels = config.get('notification_channels', {})
        self.escalation_rules = config.get('escalation_rules', {})
        
    def create_incident(self, 
                       title: str, 
                       description: str, 
                       severity: IncidentSeverity,
                       affected_services: List[str] = None) -> Incident:
        """Create a new incident"""
        incident_id = f"INC-{int(time.time())}"
        
        incident = Incident(
            id=incident_id,
            title=title,
            description=description,
            severity=severity,
            status=IncidentStatus.OPEN,
            created_at=datetime.now(),
            updated_at=datetime.now(),
            affected_services=affected_services or []
        )
        
        self.incidents[incident_id] = incident
        
        # Log incident creation
        self._add_action(incident, "created", "system", f"Incident created with severity {severity.value}")
        
        # Send notifications
        self._send_notifications(incident, "Incident Created")
        
        # Auto-escalate critical incidents
        if severity == IncidentSeverity.CRITICAL:
            self._escalate_incident(incident)
        
        logger.info(f"Created incident {incident_id}: {title}")
        return incident
    
    def update_incident_status(self, incident_id: str, status: IncidentStatus, user: str = "system") -> bool:
        """Update incident status"""
        if incident_id not in self.incidents:
            return False
        
        incident = self.incidents[incident_id]
        old_status = incident.status
        incident.status = status
        incident.updated_at = datetime.now()
        
        if status == IncidentStatus.RESOLVED:
            incident.resolved_at = datetime.now()
        
        self._add_action(incident, "status_changed", user, f"Status changed from {old_status.value} to {status.value}")
        
        # Send status update notifications
        self._send_notifications(incident, f"Status Updated: {status.value}")
        
        logger.info(f"Updated incident {incident_id} status to {status.value}")
        return True
    
    def add_incident_note(self, incident_id: str, note: str, user: str) -> bool:
        """Add a note to an incident"""
        if incident_id not in self.incidents:
            return False
        
        incident = self.incidents[incident_id]
        incident.updated_at = datetime.now()
        
        self._add_action(incident, "note_added", user, note)
        
        logger.info(f"Added note to incident {incident_id}")
        return True
    
    def resolve_incident(self, incident_id: str, resolution: str, user: str) -> bool:
        """Resolve an incident"""
        if incident_id not in self.incidents:
            return False
        
        incident = self.incidents[incident_id]
        incident.status = IncidentStatus.RESOLVED
        incident.resolved_at = datetime.now()
        incident.updated_at = datetime.now()
        incident.resolution = resolution
        
        self._add_action(incident, "resolved", user, f"Incident resolved: {resolution}")
        
        # Send resolution notifications
        self._send_notifications(incident, "Incident Resolved")
        
        # Generate post-mortem if critical
        if incident.severity in [IncidentSeverity.CRITICAL, IncidentSeverity.HIGH]:
            self._generate_postmortem_template(incident)
        
        logger.info(f"Resolved incident {incident_id}")
        return True
    
    def _add_action(self, incident: Incident, action: str, user: str, details: str):
        """Add an action to incident timeline"""
        action_obj = IncidentAction(
            timestamp=datetime.now(),
            action=action,
            user=user,
            details=details
        )
        incident.actions.append(action_obj)
    
    def _send_notifications(self, incident: Incident, event_type: str):
        """Send incident notifications"""
        try:
            # Determine notification channels based on severity
            channels = []
            if incident.severity == IncidentSeverity.CRITICAL:
                channels = self.notification_channels.get('critical', [])
            elif incident.severity == IncidentSeverity.HIGH:
                channels = self.notification_channels.get('high', [])
            else:
                channels = self.notification_channels.get('default', [])
            
            message = self._format_notification_message(incident, event_type)
            
            for channel in channels:
                if channel['type'] == 'slack':
                    self._send_slack_notification(channel['webhook'], message)
                elif channel['type'] == 'email':
                    self._send_email_notification(channel['recipients'], message)
                elif channel['type'] == 'pagerduty':
                    self._send_pagerduty_notification(channel['integration_key'], incident)
        
        except Exception as e:
            logger.error(f"Failed to send notifications: {str(e)}")
    
    def _format_notification_message(self, incident: Incident, event_type: str) -> str:
        """Format notification message"""
        duration = ""
        if incident.resolved_at and incident.created_at:
            duration = str(incident.resolved_at - incident.created_at)
        
        message = f"""
🚨 **{event_type}**

**Incident ID:** {incident.id}
**Title:** {incident.title}
**Severity:** {incident.severity.value.upper()}
**Status:** {incident.status.value.upper()}
**Affected Services:** {', '.join(incident.affected_services)}
**Created:** {incident.created_at.strftime('%Y-%m-%d %H:%M:%S')}
"""
        
        if incident.resolved_at:
            message += f"**Resolved:** {incident.resolved_at.strftime('%Y-%m-%d %H:%M:%S')}\n"
            message += f"**Duration:** {duration}\n"
        
        if incident.resolution:
            message += f"**Resolution:** {incident.resolution}\n"
        
        return message
    
    def _send_slack_notification(self, webhook_url: str, message: str):
        """Send Slack notification"""
        try:
            payload = {
                'text': message,
                'username': 'Incident Manager',
                'icon_emoji': ':rotating_light:'
            }
            
            response = requests.post(webhook_url, json=payload, timeout=10)
            response.raise_for_status()
            
        except Exception as e:
            logger.error(f"Failed to send Slack notification: {str(e)}")
    
    def _send_pagerduty_notification(self, integration_key: str, incident: Incident):
        """Send PagerDuty notification"""
        try:
            payload = {
                'routing_key': integration_key,
                'event_action': 'trigger' if incident.status != IncidentStatus.RESOLVED else 'resolve',
                'dedup_key': incident.id,
                'payload': {
                    'summary': incident.title,
                    'severity': incident.severity.value,
                    'source': 'incident-manager',
                    'custom_details': {
                        'incident_id': incident.id,
                        'affected_services': incident.affected_services,
                        'description': incident.description
                    }
                }
            }
            
            response = requests.post(
                'https://events.pagerduty.com/v2/enqueue',
                json=payload,
                timeout=10
            )
            response.raise_for_status()
            
        except Exception as e:
            logger.error(f"Failed to send PagerDuty notification: {str(e)}")
    
    def _escalate_incident(self, incident: Incident):
        """Escalate incident based on rules"""
        try:
            escalation_rule = self.escalation_rules.get(incident.severity.value, {})
            
            if escalation_rule:
                # Add escalation action
                self._add_action(
                    incident, 
                    "escalated", 
                    "system", 
                    f"Auto-escalated due to {incident.severity.value} severity"
                )
                
                # Send escalation notifications
                escalation_channels = escalation_rule.get('channels', [])
                for channel in escalation_channels:
                    if channel['type'] == 'pagerduty':
                        self._send_pagerduty_notification(channel['integration_key'], incident)
        
        except Exception as e:
            logger.error(f"Failed to escalate incident: {str(e)}")
    
    def _generate_postmortem_template(self, incident: Incident) -> str:
        """Generate post-mortem template"""
        template = f"""
# Post-Mortem: {incident.title}

**Incident ID:** {incident.id}
**Date:** {incident.created_at.strftime('%Y-%m-%d')}
**Duration:** {incident.resolved_at - incident.created_at if incident.resolved_at else 'Ongoing'}
**Severity:** {incident.severity.value.upper()}

## Summary
{incident.description}

## Timeline
"""
        
        for action in incident.actions:
            template += f"- **{action.timestamp.strftime('%H:%M:%S')}** [{action.user}] {action.action}: {action.details}\n"
        
        template += f"""

## Root Cause
{incident.root_cause or 'TBD - To be determined during post-mortem review'}

## Resolution
{incident.resolution or 'TBD - To be documented'}

## Impact Assessment
- **Affected Services:** {', '.join(incident.affected_services)}
- **User Impact:** TBD
- **Business Impact:** TBD

## Action Items
- [ ] Immediate fixes implemented
- [ ] Monitoring improvements
- [ ] Process improvements
- [ ] Documentation updates
- [ ] Training requirements

## Lessons Learned
TBD - To be filled during post-mortem meeting

## Prevention Measures
TBD - Actions to prevent similar incidents

---
*This post-mortem was auto-generated. Please review and complete all TBD sections.*
"""
        
        # Save template to file or send to documentation system
        filename = f"postmortem-{incident.id}-{incident.created_at.strftime('%Y%m%d')}.md"
        with open(filename, 'w') as f:
            f.write(template)
        
        logger.info(f"Generated post-mortem template: {filename}")
        return template
    
    def get_incident_metrics(self, days: int = 30) -> Dict:
        """Get incident metrics for reporting"""
        cutoff_date = datetime.now() - timedelta(days=days)
        recent_incidents = [
            incident for incident in self.incidents.values()
            if incident.created_at >= cutoff_date
        ]
        
        metrics = {
            'total_incidents': len(recent_incidents),
            'by_severity': {},
            'by_status': {},
            'mean_time_to_resolution': 0,
            'incidents_by_service': {},
            'resolution_rate': 0
        }
        
        # Count by severity
        for severity in IncidentSeverity:
            count = len([i for i in recent_incidents if i.severity == severity])
            metrics['by_severity'][severity.value] = count
        
        # Count by status
        for status in IncidentStatus:
            count = len([i for i in recent_incidents if i.status == status])
            metrics['by_status'][status.value] = count
        
        # Calculate MTTR
        resolved_incidents = [
            i for i in recent_incidents 
            if i.status == IncidentStatus.RESOLVED and i.resolved_at
        ]
        
        if resolved_incidents:
            total_resolution_time = sum([
                (i.resolved_at - i.created_at).total_seconds()
                for i in resolved_incidents
            ])
            metrics['mean_time_to_resolution'] = total_resolution_time / len(resolved_incidents) / 3600  # hours
            metrics['resolution_rate'] = len(resolved_incidents) / len(recent_incidents) * 100
        
        # Count by affected service
        for incident in recent_incidents:
            for service in incident.affected_services:
                metrics['incidents_by_service'][service] = metrics['incidents_by_service'].get(service, 0) + 1
        
        return metrics

# Usage example
if __name__ == "__main__":
    config = {
        'notification_channels': {
            'critical': [
                {'type': 'slack', 'webhook': 'https://hooks.slack.com/services/...'},
                {'type': 'pagerduty', 'integration_key': 'your-pagerduty-key'}
            ],
            'high': [
                {'type': 'slack', 'webhook': 'https://hooks.slack.com/services/...'}
            ],
            'default': [
                {'type': 'email', 'recipients': ['team@company.com']}
            ]
        },
        'escalation_rules': {
            'critical': {
                'channels': [
                    {'type': 'pagerduty', 'integration_key': 'escalation-key'}
                ]
            }
        }
    }
    
    incident_manager = IncidentManager(config)
    
    # Create a critical incident
    incident = incident_manager.create_incident(
        title="Database Connection Pool Exhausted",
        description="All database connections are in use, causing 500 errors",
        severity=IncidentSeverity.CRITICAL,
        affected_services=["user-service", "order-service"]
    )
    
    # Update incident status
    incident_manager.update_incident_status(incident.id, IncidentStatus.INVESTIGATING, "john.doe")
    
    # Add investigation notes
    incident_manager.add_incident_note(
        incident.id, 
        "Identified connection leak in user-service. Deploying fix.", 
        "jane.smith"
    )
    
    # Resolve incident
    incident_manager.resolve_incident(
        incident.id,
        "Fixed connection leak and increased pool size from 10 to 20 connections",
        "jane.smith"
    )
    
    # Get metrics
    metrics = incident_manager.get_incident_metrics()
    print(json.dumps(metrics, indent=2))
```

### Free Resources

- [Google SRE Books](https://sre.google/books/) - Comprehensive SRE practices
- [SRE Workbook](https://sre.google/workbook/) - Practical SRE implementation
- [Prometheus Alerting](https://prometheus.io/docs/alerting/latest/) - Monitoring and alerting
- [PagerDuty Incident Response](https://response.pagerduty.com/) - Incident management guide

## Hands-On Exercises

### Exercise 1: Complete Observability Stack

**Task:** Deploy and configure a comprehensive observability platform.

**Requirements:**
- Metrics collection with Prometheus
- Log aggregation with ELK stack
- Distributed tracing with Jaeger
- Custom dashboards and alerting
- SLI/SLO monitoring and error budget tracking

### Exercise 2: DevSecOps Pipeline Implementation

**Task:** Build a complete security-integrated CI/CD pipeline.

**Requirements:**
- Static and dynamic security testing
- Container vulnerability scanning
- Secrets management integration
- Policy as code enforcement
- Runtime security monitoring

### Exercise 3: SRE Practice Implementation

**Task:** Implement SRE practices for a production service.

**Requirements:**
- Define SLIs, SLOs, and error budgets
- Implement automated incident response
- Create post-mortem processes
- Build capacity planning and performance optimization
- Establish on-call procedures and runbooks

## Assessment Questions

1. **Design a comprehensive observability strategy for a microservices architecture.**

2. **Implement a DevSecOps pipeline that integrates security at every stage.**

3. **Create an SRE framework with SLOs, error budgets, and incident management.**

4. **Design a performance optimization strategy for high-scale applications.**

5. **Develop an advanced automation framework for complex operational workflows.**

## Congratulations! 🎉

You have completed the comprehensive DevOps Engineering learning path! You now have the knowledge and skills to:

- **Build and manage** production-ready infrastructure and applications
- **Implement** comprehensive CI/CD pipelines and automation
- **Design** secure, scalable, and observable systems
- **Apply** SRE principles and practices for reliability
- **Lead** DevOps transformation initiatives

## Next Steps in Your DevOps Career

### **Immediate Actions:**
1. **Build a portfolio** showcasing your DevOps projects and implementations
2. **Contribute to open source** DevOps tools and projects
3. **Join professional communities** and attend DevOps conferences
4. **Pursue certifications** from major cloud providers and DevOps tools
5. **Start mentoring** others beginning their DevOps journey

### **Career Advancement Opportunities:**
- **Senior DevOps Engineer**: Lead complex infrastructure and automation projects
- **Platform Engineer**: Build and maintain developer platforms and tooling
- **Site Reliability Engineer**: Focus on system reliability and performance
- **DevOps Architect**: Design enterprise-scale DevOps solutions
- **Engineering Manager**: Lead DevOps teams and drive organizational transformation

### **Continuous Learning:**
- Stay updated with emerging technologies (AI/ML Ops, Edge Computing, Quantum Computing)
- Explore specialized areas (FinOps, GreenOps, DataOps)
- Develop business and leadership skills
- Build expertise in specific industries or domains

## Additional Resources

### Professional Development
- [DevOps Institute](https://devopsinstitute.com/) - Professional development and certification
- [CNCF Training](https://www.cncf.io/training/) - Cloud native computing education
- [Linux Foundation Training](https://training.linuxfoundation.org/) - Open source technology training
- [AWS Training](https://aws.amazon.com/training/) - Cloud platform expertise

### Communities and Networking
- [DevOps Days](https://devopsdays.org/) - Global DevOps conference series
- [KubeCon + CloudNativeCon](https://events.linuxfoundation.org/) - Cloud native computing conferences
- [SREcon](https://www.usenix.org/conferences/srecon) - Site Reliability Engineering conference
- [Local Meetups](https://www.meetup.com/) - Regional DevOps and cloud native groups

**Your DevOps engineering journey is just beginning. The skills you've developed will enable you to build the future of software delivery and operations. Keep learning, keep building, and keep pushing the boundaries of what's possible!** 🚀
