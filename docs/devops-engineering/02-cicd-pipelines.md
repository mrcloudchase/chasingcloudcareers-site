---
sidebar_position: 4
---

# CI/CD Pipelines and Automation

Master continuous integration and continuous deployment practices, building robust automated pipelines that enable rapid, reliable software delivery at scale.

## Learning Objectives

By the end of this module, you will:
- Design and implement comprehensive CI/CD pipelines
- Master automated testing strategies and quality assurance
- Build sophisticated deployment automation with rollback capabilities
- Optimize pipeline performance and troubleshoot complex issues
- Integrate multiple tools and platforms in cohesive workflows

## 1. Continuous Integration Fundamentals

### CI Pipeline Architecture

**Core CI Components:**
```yaml
# .github/workflows/ci.yml - GitHub Actions CI Pipeline
name: Continuous Integration

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  NODE_VERSION: '18'
  PYTHON_VERSION: '3.11'

jobs:
  code-quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint code
        run: npm run lint
      
      - name: Format check
        run: npm run format:check
      
      - name: Type check
        run: npm run type-check

  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run security audit
        run: npm audit --audit-level=moderate
      
      - name: Scan for secrets
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: main
          head: HEAD

  unit-tests:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [16, 18, 20]
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:unit -- --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: testdb
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run database migrations
        run: npm run db:migrate
        env:
          DATABASE_URL: postgres://postgres:postgres@localhost:5432/testdb
      
      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgres://postgres:postgres@localhost:5432/testdb
          REDIS_URL: redis://localhost:6379

  build:
    runs-on: ubuntu-latest
    needs: [code-quality, security-scan, unit-tests, integration-tests]
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
      
      - name: Build Docker image
        run: |
          docker build -t myapp:${{ github.sha }} .
          docker tag myapp:${{ github.sha }} myapp:latest
      
      - name: Save Docker image
        run: docker save myapp:${{ github.sha }} | gzip > myapp-image.tar.gz
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build-artifacts
          path: |
            dist/
            myapp-image.tar.gz
```

### Advanced Testing Strategies

**Test Pyramid Implementation:**
```javascript
// Unit Tests (70% of test suite)
// tests/unit/userService.test.js
import { describe, it, expect, jest } from '@jest/globals';
import { UserService } from '../../src/services/UserService.js';
import { UserRepository } from '../../src/repositories/UserRepository.js';

jest.mock('../../src/repositories/UserRepository.js');

describe('UserService', () => {
  let userService;
  let mockUserRepository;

  beforeEach(() => {
    mockUserRepository = new UserRepository();
    userService = new UserService(mockUserRepository);
  });

  describe('createUser', () => {
    it('should create user with valid data', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'securePassword123'
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue({ id: 1, ...userData });

      const result = await userService.createUser(userData);

      expect(result).toEqual({ id: 1, ...userData });
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userData.email);
      expect(mockUserRepository.create).toHaveBeenCalledWith(userData);
    });

    it('should throw error for duplicate email', async () => {
      const userData = { email: 'existing@example.com' };
      mockUserRepository.findByEmail.mockResolvedValue({ id: 1 });

      await expect(userService.createUser(userData))
        .rejects.toThrow('User with this email already exists');
    });
  });
});

// Integration Tests (20% of test suite)
// tests/integration/userAPI.test.js
import request from 'supertest';
import { app } from '../../src/app.js';
import { database } from '../../src/database.js';

describe('User API Integration', () => {
  beforeAll(async () => {
    await database.migrate.latest();
  });

  afterAll(async () => {
    await database.destroy();
  });

  beforeEach(async () => {
    await database.seed.run();
  });

  describe('POST /api/users', () => {
    it('should create user and return 201', async () => {
      const userData = {
        email: 'newuser@example.com',
        name: 'New User',
        password: 'securePassword123'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(Number),
        email: userData.email,
        name: userData.name
      });
      expect(response.body.password).toBeUndefined();
    });
  });
});

// End-to-End Tests (10% of test suite)
// tests/e2e/userRegistration.test.js
import { test, expect } from '@playwright/test';

test.describe('User Registration Flow', () => {
  test('should complete full registration process', async ({ page }) => {
    // Navigate to registration page
    await page.goto('/register');
    
    // Fill registration form
    await page.fill('[data-testid="email-input"]', 'e2e@example.com');
    await page.fill('[data-testid="name-input"]', 'E2E Test User');
    await page.fill('[data-testid="password-input"]', 'securePassword123');
    await page.fill('[data-testid="confirm-password-input"]', 'securePassword123');
    
    // Submit form
    await page.click('[data-testid="register-button"]');
    
    // Verify success
    await expect(page.locator('[data-testid="success-message"]'))
      .toContainText('Registration successful');
    
    // Verify redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    
    // Verify user is logged in
    await expect(page.locator('[data-testid="user-menu"]'))
      .toContainText('E2E Test User');
  });
});
```

**Performance and Load Testing:**
```javascript
// tests/performance/loadTest.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

export let errorRate = new Rate('errors');

export let options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 200 }, // Ramp up to 200 users
    { duration: '5m', target: 200 }, // Stay at 200 users
    { duration: '2m', target: 0 },   // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(99)<1500'], // 99% of requests must complete below 1.5s
    http_req_failed: ['rate<0.1'],     // Error rate must be below 10%
    errors: ['rate<0.1'],              // Custom error rate
  },
};

export default function () {
  // Test user registration
  let registrationPayload = JSON.stringify({
    email: `user${Math.random()}@example.com`,
    name: 'Load Test User',
    password: 'testPassword123'
  });

  let registrationResponse = http.post(
    'http://localhost:3000/api/users',
    registrationPayload,
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );

  let registrationSuccess = check(registrationResponse, {
    'registration status is 201': (r) => r.status === 201,
    'registration response time < 500ms': (r) => r.timings.duration < 500,
  });

  errorRate.add(!registrationSuccess);

  if (registrationSuccess) {
    // Test user login
    let loginPayload = JSON.stringify({
      email: JSON.parse(registrationPayload).email,
      password: 'testPassword123'
    });

    let loginResponse = http.post(
      'http://localhost:3000/api/auth/login',
      loginPayload,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    let loginSuccess = check(loginResponse, {
      'login status is 200': (r) => r.status === 200,
      'login response time < 300ms': (r) => r.timings.duration < 300,
      'login returns token': (r) => JSON.parse(r.body).token !== undefined,
    });

    errorRate.add(!loginSuccess);
  }

  sleep(1);
}
```

### Free Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions) - Complete CI/CD with GitHub Actions
- [GitLab CI/CD Guide](https://docs.gitlab.com/ee/ci/) - Comprehensive GitLab CI/CD
- [Jenkins User Handbook](https://www.jenkins.io/doc/book/) - Open source automation server
- [Testing Best Practices - Google](https://testing.googleblog.com/) - Testing strategies and techniques

## 2. Continuous Deployment Strategies

### Deployment Patterns

**Blue-Green Deployment:**
```yaml
# .github/workflows/blue-green-deploy.yml
name: Blue-Green Deployment

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Determine current environment
        id: current-env
        run: |
          CURRENT=$(curl -s https://api.example.com/health | jq -r '.environment // "blue"')
          if [ "$CURRENT" = "blue" ]; then
            echo "current=blue" >> $GITHUB_OUTPUT
            echo "target=green" >> $GITHUB_OUTPUT
          else
            echo "current=green" >> $GITHUB_OUTPUT
            echo "target=blue" >> $GITHUB_OUTPUT
          fi
      
      - name: Deploy to target environment
        run: |
          echo "Deploying to ${{ steps.current-env.outputs.target }} environment"
          
          # Deploy application to target environment
          kubectl set image deployment/myapp-${{ steps.current-env.outputs.target }} \
            app=myapp:${{ github.sha }} \
            -n production
          
          # Wait for rollout to complete
          kubectl rollout status deployment/myapp-${{ steps.current-env.outputs.target }} \
            -n production --timeout=300s
      
      - name: Run smoke tests
        run: |
          TARGET_URL="https://${{ steps.current-env.outputs.target }}.example.com"
          
          # Health check
          curl -f "$TARGET_URL/health" || exit 1
          
          # Basic functionality tests
          npm run test:smoke -- --baseUrl="$TARGET_URL"
      
      - name: Switch traffic
        run: |
          # Update load balancer to point to new environment
          kubectl patch service myapp-service \
            -p '{"spec":{"selector":{"version":"${{ steps.current-env.outputs.target }}"}}}' \
            -n production
          
          echo "Traffic switched to ${{ steps.current-env.outputs.target }} environment"
      
      - name: Verify deployment
        run: |
          # Wait for DNS propagation and verify
          sleep 30
          curl -f https://api.example.com/health
          
          # Run full test suite against production
          npm run test:production
```

**Canary Deployment with Istio:**
```yaml
# canary-deployment.yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: myapp-rollout
spec:
  replicas: 10
  strategy:
    canary:
      steps:
      - setWeight: 10
      - pause: {duration: 2m}
      - setWeight: 20
      - pause: {duration: 2m}
      - setWeight: 50
      - pause: {duration: 2m}
      - setWeight: 100
      canaryService: myapp-canary
      stableService: myapp-stable
      trafficRouting:
        istio:
          virtualService:
            name: myapp-vs
            routes:
            - primary
      analysis:
        templates:
        - templateName: success-rate
        args:
        - name: service-name
          value: myapp-canary
        - name: prometheus-server
          value: http://prometheus:9090
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: myapp
        image: myapp:latest
        ports:
        - containerPort: 8080
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"

---
apiVersion: argoproj.io/v1alpha1
kind: AnalysisTemplate
metadata:
  name: success-rate
spec:
  args:
  - name: service-name
  - name: prometheus-server
  metrics:
  - name: success-rate
    interval: 30s
    count: 5
    successCondition: result[0] >= 0.95
    failureLimit: 3
    provider:
      prometheus:
        address: "{{args.prometheus-server}}"
        query: |
          sum(rate(http_requests_total{service="{{args.service-name}}",status!~"5.."}[2m])) /
          sum(rate(http_requests_total{service="{{args.service-name}}"}[2m]))
```

**Feature Flag Deployment:**
```javascript
// Feature flag implementation
class FeatureFlags {
  constructor(configService) {
    this.configService = configService;
    this.flags = new Map();
    this.loadFlags();
  }

  async loadFlags() {
    try {
      const flags = await this.configService.getFeatureFlags();
      flags.forEach(flag => {
        this.flags.set(flag.name, flag);
      });
    } catch (error) {
      console.error('Failed to load feature flags:', error);
    }
  }

  isEnabled(flagName, context = {}) {
    const flag = this.flags.get(flagName);
    if (!flag) return false;

    // Global enable/disable
    if (!flag.enabled) return false;

    // User-based rollout
    if (flag.userRollout && context.userId) {
      const userHash = this.hashUserId(context.userId);
      return userHash < flag.userRollout.percentage;
    }

    // Environment-based rollout
    if (flag.environmentRollout) {
      return flag.environmentRollout.includes(context.environment);
    }

    // Time-based rollout
    if (flag.timeRollout) {
      const now = new Date();
      const startTime = new Date(flag.timeRollout.startTime);
      const endTime = new Date(flag.timeRollout.endTime);
      return now >= startTime && now <= endTime;
    }

    return flag.defaultValue || false;
  }

  hashUserId(userId) {
    // Simple hash function for user-based rollouts
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash) % 100;
  }
}

// Usage in application
const featureFlags = new FeatureFlags(configService);

app.get('/api/users', async (req, res) => {
  const useNewUserAPI = featureFlags.isEnabled('new-user-api', {
    userId: req.user.id,
    environment: process.env.NODE_ENV
  });

  if (useNewUserAPI) {
    return newUserController.getUsers(req, res);
  } else {
    return legacyUserController.getUsers(req, res);
  }
});
```

### Rollback and Recovery Strategies

**Automated Rollback Pipeline:**
```yaml
# .github/workflows/rollback.yml
name: Automated Rollback

on:
  workflow_dispatch:
    inputs:
      target_version:
        description: 'Version to rollback to'
        required: true
      environment:
        description: 'Environment to rollback'
        required: true
        type: choice
        options:
        - staging
        - production

jobs:
  rollback:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Validate rollback target
        run: |
          # Verify target version exists
          if ! git rev-parse --verify ${{ github.event.inputs.target_version }}; then
            echo "Invalid target version: ${{ github.event.inputs.target_version }}"
            exit 1
          fi
          
          # Verify target version is older than current
          CURRENT_COMMIT=$(kubectl get deployment myapp -o jsonpath='{.metadata.annotations.deployment\.kubernetes\.io/revision}')
          if [ "${{ github.event.inputs.target_version }}" = "$CURRENT_COMMIT" ]; then
            echo "Target version is the same as current version"
            exit 1
          fi
      
      - name: Create rollback backup
        run: |
          # Backup current state before rollback
          kubectl get deployment myapp -o yaml > rollback-backup-$(date +%Y%m%d-%H%M%S).yaml
          
          # Store backup in artifact
          echo "BACKUP_FILE=rollback-backup-$(date +%Y%m%d-%H%M%S).yaml" >> $GITHUB_ENV
      
      - name: Execute rollback
        run: |
          echo "Rolling back to version: ${{ github.event.inputs.target_version }}"
          
          # Rollback deployment
          kubectl rollout undo deployment/myapp --to-revision=${{ github.event.inputs.target_version }}
          
          # Wait for rollback to complete
          kubectl rollout status deployment/myapp --timeout=300s
      
      - name: Verify rollback
        run: |
          # Health check
          kubectl wait --for=condition=available deployment/myapp --timeout=300s
          
          # Application health check
          HEALTH_URL="https://${{ github.event.inputs.environment }}.example.com/health"
          curl -f "$HEALTH_URL" || exit 1
          
          # Run smoke tests
          npm run test:smoke -- --baseUrl="https://${{ github.event.inputs.environment }}.example.com"
      
      - name: Notify team
        if: always()
        run: |
          STATUS="${{ job.status }}"
          if [ "$STATUS" = "success" ]; then
            MESSAGE="✅ Rollback to ${{ github.event.inputs.target_version }} completed successfully"
          else
            MESSAGE="❌ Rollback to ${{ github.event.inputs.target_version }} failed"
          fi
          
          curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"$MESSAGE\"}" \
            ${{ secrets.SLACK_WEBHOOK_URL }}
      
      - name: Upload backup
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: rollback-backup
          path: ${{ env.BACKUP_FILE }}
```

### Free Resources

- [Argo Rollouts Documentation](https://argoproj.github.io/argo-rollouts/) - Advanced deployment strategies
- [Istio Traffic Management](https://istio.io/latest/docs/concepts/traffic-management/) - Service mesh deployments
- [Feature Flags Guide - LaunchDarkly](https://launchdarkly.com/blog/) - Feature flag best practices
- [Deployment Strategies - Kubernetes](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) - Kubernetes deployment patterns

## 3. Pipeline Optimization and Troubleshooting

### Performance Optimization

**Pipeline Caching Strategies:**
```yaml
# Optimized GitHub Actions with caching
name: Optimized CI Pipeline

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      # Cache dependencies
      - name: Cache Node modules
        uses: actions/cache@v3
        with:
          path: ~/.npm
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-node-
      
      # Cache Docker layers
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Cache Docker layers
        uses: actions/cache@v3
        with:
          path: /tmp/.buildx-cache
          key: ${{ runner.os }}-buildx-${{ github.sha }}
          restore-keys: |
            ${{ runner.os }}-buildx-
      
      # Parallel job execution
      - name: Install dependencies
        run: npm ci
      
      - name: Run linting and tests in parallel
        run: |
          npm run lint &
          npm run test:unit &
          npm run test:integration &
          wait
      
      # Optimized Docker build
      - name: Build Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: false
          tags: myapp:latest
          cache-from: type=local,src=/tmp/.buildx-cache
          cache-to: type=local,dest=/tmp/.buildx-cache-new,mode=max
      
      # Move cache to avoid ever-growing cache
      - name: Move cache
        run: |
          rm -rf /tmp/.buildx-cache
          mv /tmp/.buildx-cache-new /tmp/.buildx-cache
```

**Pipeline Monitoring and Metrics:**
```python
#!/usr/bin/env python3
"""
CI/CD Pipeline Monitoring and Analytics
"""
import requests
import json
import time
from datetime import datetime, timedelta
import matplotlib.pyplot as plt
import pandas as pd

class PipelineMonitor:
    def __init__(self, github_token, repo_owner, repo_name):
        self.github_token = github_token
        self.repo_owner = repo_owner
        self.repo_name = repo_name
        self.base_url = f"https://api.github.com/repos/{repo_owner}/{repo_name}"
        self.headers = {
            'Authorization': f'token {github_token}',
            'Accept': 'application/vnd.github.v3+json'
        }
    
    def get_workflow_runs(self, days=30):
        """Get workflow runs from the last N days"""
        since = (datetime.now() - timedelta(days=days)).isoformat()
        url = f"{self.base_url}/actions/runs"
        
        params = {
            'created': f'>={since}',
            'per_page': 100
        }
        
        response = requests.get(url, headers=self.headers, params=params)
        response.raise_for_status()
        
        return response.json()['workflow_runs']
    
    def analyze_pipeline_performance(self, runs):
        """Analyze pipeline performance metrics"""
        metrics = {
            'total_runs': len(runs),
            'success_rate': 0,
            'failure_rate': 0,
            'avg_duration': 0,
            'builds_per_day': 0,
            'slowest_jobs': [],
            'failure_reasons': {}
        }
        
        if not runs:
            return metrics
        
        # Success/failure rates
        successful_runs = [r for r in runs if r['conclusion'] == 'success']
        failed_runs = [r for r in runs if r['conclusion'] == 'failure']
        
        metrics['success_rate'] = len(successful_runs) / len(runs) * 100
        metrics['failure_rate'] = len(failed_runs) / len(runs) * 100
        
        # Average duration (in minutes)
        durations = []
        for run in runs:
            if run['created_at'] and run['updated_at']:
                created = datetime.fromisoformat(run['created_at'].replace('Z', '+00:00'))
                updated = datetime.fromisoformat(run['updated_at'].replace('Z', '+00:00'))
                duration = (updated - created).total_seconds() / 60
                durations.append(duration)
        
        metrics['avg_duration'] = sum(durations) / len(durations) if durations else 0
        
        # Builds per day
        days_span = (datetime.now() - datetime.fromisoformat(runs[-1]['created_at'].replace('Z', '+00:00'))).days
        metrics['builds_per_day'] = len(runs) / max(days_span, 1)
        
        return metrics
    
    def get_job_details(self, run_id):
        """Get detailed job information for a workflow run"""
        url = f"{self.base_url}/actions/runs/{run_id}/jobs"
        response = requests.get(url, headers=self.headers)
        response.raise_for_status()
        
        return response.json()['jobs']
    
    def identify_bottlenecks(self, runs, sample_size=10):
        """Identify performance bottlenecks in recent runs"""
        bottlenecks = []
        
        # Analyze recent runs
        recent_runs = runs[:sample_size]
        
        for run in recent_runs:
            jobs = self.get_job_details(run['id'])
            
            for job in jobs:
                if job['started_at'] and job['completed_at']:
                    started = datetime.fromisoformat(job['started_at'].replace('Z', '+00:00'))
                    completed = datetime.fromisoformat(job['completed_at'].replace('Z', '+00:00'))
                    duration = (completed - started).total_seconds() / 60
                    
                    bottlenecks.append({
                        'job_name': job['name'],
                        'duration': duration,
                        'run_id': run['id'],
                        'status': job['conclusion']
                    })
        
        # Sort by duration to find slowest jobs
        bottlenecks.sort(key=lambda x: x['duration'], reverse=True)
        
        return bottlenecks[:10]  # Top 10 slowest jobs
    
    def generate_report(self):
        """Generate comprehensive pipeline report"""
        print("Generating CI/CD Pipeline Report...")
        
        # Get workflow runs
        runs = self.get_workflow_runs(30)
        
        # Analyze performance
        metrics = self.analyze_pipeline_performance(runs)
        
        # Identify bottlenecks
        bottlenecks = self.identify_bottlenecks(runs)
        
        # Generate report
        report = f"""
CI/CD Pipeline Performance Report
Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

=== OVERVIEW ===
Total Runs (30 days): {metrics['total_runs']}
Success Rate: {metrics['success_rate']:.1f}%
Failure Rate: {metrics['failure_rate']:.1f}%
Average Duration: {metrics['avg_duration']:.1f} minutes
Builds per Day: {metrics['builds_per_day']:.1f}

=== PERFORMANCE BOTTLENECKS ===
Top 5 Slowest Jobs:
"""
        
        for i, bottleneck in enumerate(bottlenecks[:5], 1):
            report += f"{i}. {bottleneck['job_name']}: {bottleneck['duration']:.1f} minutes\n"
        
        report += f"""
=== RECOMMENDATIONS ===
"""
        
        # Generate recommendations based on metrics
        if metrics['avg_duration'] > 15:
            report += "- Consider optimizing build times with better caching\n"
        
        if metrics['failure_rate'] > 10:
            report += "- High failure rate detected, review test stability\n"
        
        if metrics['builds_per_day'] > 50:
            report += "- Consider implementing build queuing or parallel execution\n"
        
        return report
    
    def create_dashboard(self, runs):
        """Create visual dashboard of pipeline metrics"""
        # Prepare data
        df = pd.DataFrame([
            {
                'date': datetime.fromisoformat(run['created_at'].replace('Z', '+00:00')).date(),
                'status': run['conclusion'],
                'duration': self._calculate_duration(run)
            }
            for run in runs
        ])
        
        # Create subplots
        fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(15, 10))
        
        # Success rate over time
        daily_stats = df.groupby(['date', 'status']).size().unstack(fill_value=0)
        if 'success' in daily_stats.columns and 'failure' in daily_stats.columns:
            success_rate = daily_stats['success'] / (daily_stats['success'] + daily_stats['failure']) * 100
            ax1.plot(success_rate.index, success_rate.values)
            ax1.set_title('Success Rate Over Time')
            ax1.set_ylabel('Success Rate (%)')
        
        # Build duration distribution
        ax2.hist(df['duration'].dropna(), bins=20, alpha=0.7)
        ax2.set_title('Build Duration Distribution')
        ax2.set_xlabel('Duration (minutes)')
        ax2.set_ylabel('Frequency')
        
        # Builds per day
        builds_per_day = df.groupby('date').size()
        ax3.bar(builds_per_day.index, builds_per_day.values)
        ax3.set_title('Builds per Day')
        ax3.set_ylabel('Number of Builds')
        
        # Status distribution
        status_counts = df['status'].value_counts()
        ax4.pie(status_counts.values, labels=status_counts.index, autopct='%1.1f%%')
        ax4.set_title('Build Status Distribution')
        
        plt.tight_layout()
        plt.savefig('pipeline_dashboard.png', dpi=300, bbox_inches='tight')
        plt.show()
    
    def _calculate_duration(self, run):
        """Calculate run duration in minutes"""
        if run['created_at'] and run['updated_at']:
            created = datetime.fromisoformat(run['created_at'].replace('Z', '+00:00'))
            updated = datetime.fromisoformat(run['updated_at'].replace('Z', '+00:00'))
            return (updated - created).total_seconds() / 60
        return None

# Usage example
if __name__ == "__main__":
    monitor = PipelineMonitor(
        github_token="your_github_token",
        repo_owner="your_org",
        repo_name="your_repo"
    )
    
    # Generate report
    report = monitor.generate_report()
    print(report)
    
    # Create dashboard
    runs = monitor.get_workflow_runs(30)
    monitor.create_dashboard(runs)
```

### Free Resources

- [Pipeline Optimization Guide - GitLab](https://docs.gitlab.com/ee/ci/pipelines/pipeline_efficiency.html) - Performance optimization techniques
- [GitHub Actions Best Practices](https://docs.github.com/en/actions/learn-github-actions/usage-limits-billing-and-administration) - Optimization and limits
- [Jenkins Performance Tuning](https://www.jenkins.io/doc/book/scaling/) - Scaling and optimization
- [CI/CD Metrics and KPIs](https://www.atlassian.com/continuous-delivery/principles/continuous-integration-vs-delivery-vs-deployment) - Measuring pipeline success

## Hands-On Exercises

### Exercise 1: Complete CI/CD Pipeline Implementation

**Task:** Build a comprehensive CI/CD pipeline for a web application.

**Requirements:**
- Multi-stage pipeline with quality gates
- Automated testing at multiple levels
- Security scanning and compliance checks
- Deployment automation with rollback capabilities
- Monitoring and alerting integration

### Exercise 2: Advanced Deployment Strategy

**Task:** Implement canary deployment with automated rollback.

**Requirements:**
- Canary deployment configuration
- Automated performance monitoring
- Success criteria definition
- Automatic rollback triggers
- Traffic splitting and management

### Exercise 3: Pipeline Optimization Project

**Task:** Optimize an existing slow CI/CD pipeline.

**Requirements:**
- Performance analysis and bottleneck identification
- Caching strategy implementation
- Parallel execution optimization
- Resource usage optimization
- Before/after performance comparison

## Assessment Questions

1. **Design a CI/CD pipeline that ensures zero-downtime deployments for a critical production system.**

2. **Compare different deployment strategies (blue-green, canary, rolling) and their trade-offs.**

3. **Implement automated rollback mechanisms with proper monitoring and alerting.**

4. **Create a comprehensive testing strategy that balances speed and coverage.**

5. **Design a pipeline optimization strategy for a high-frequency deployment environment.**

## Next Steps

After completing this module:

1. **Build production-ready pipelines** with comprehensive testing and deployment automation
2. **Implement advanced deployment strategies** in real-world scenarios
3. **Optimize pipeline performance** and troubleshoot complex issues
4. **Move to Module 3: Infrastructure as Code** to automate infrastructure provisioning

## Additional Resources

### Tools and Platforms
- [GitHub Actions](https://github.com/features/actions) - Native GitHub CI/CD
- [GitLab CI/CD](https://docs.gitlab.com/ee/ci/) - Integrated DevOps platform
- [Jenkins](https://www.jenkins.io/) - Open source automation server
- [CircleCI](https://circleci.com/) - Cloud-based CI/CD platform

### Advanced Topics
- [Argo CD](https://argoproj.github.io/argo-cd/) - GitOps continuous delivery
- [Tekton](https://tekton.dev/) - Kubernetes-native CI/CD
- [Spinnaker](https://spinnaker.io/) - Multi-cloud continuous delivery
- [Flux](https://fluxcd.io/) - GitOps toolkit for Kubernetes

Ready to automate your infrastructure? Continue to **Module 3: Infrastructure as Code and Configuration Management** to master infrastructure automation!
