---
sidebar_position: 3
---

# DevOps Fundamentals and Culture

Master the core principles, cultural aspects, and foundational technologies that form the backbone of successful DevOps practices and organizational transformation.

## Learning Objectives

By the end of this module, you will:
- Understand DevOps culture, principles, and organizational transformation
- Master advanced Git workflows and collaborative development practices
- Develop proficiency in Linux system administration and automation
- Build automation scripts and tools using Python and Bash
- Implement effective cross-functional communication and documentation practices

## 1. DevOps Culture and Principles

### Understanding DevOps Philosophy

**Core DevOps Principles:**
```
Collaboration over Silos
├─ Break down barriers between development and operations
├─ Shared responsibility for application lifecycle
├─ Cross-functional teams and shared goals
└─ Collective ownership of outcomes

Automation over Manual Processes
├─ Automate repetitive and error-prone tasks
├─ Infrastructure as Code (IaC) practices
├─ Continuous integration and deployment
└─ Self-service capabilities for teams

Measurement over Assumptions
├─ Data-driven decision making
├─ Continuous monitoring and feedback
├─ Performance metrics and KPIs
├─ Learning from failures and incidents
└─ Continuous improvement culture

Sharing over Hoarding
├─ Knowledge sharing and documentation
├─ Open communication and transparency
├─ Learning from failures without blame
├─ Cross-training and skill development
└─ Community building and collaboration
```

**The Three Ways of DevOps:**
```
First Way: Flow
├─ Optimize work flow from development to operations
├─ Make work visible across the value stream
├─ Reduce batch sizes and intervals
├─ Build quality into every step
└─ Continuously optimize for global goals

Second Way: Feedback
├─ Create fast feedback loops at every stage
├─ Amplify feedback to prevent problems downstream
├─ Enable constant learning and improvement
├─ Embed knowledge where we need it
└─ Create shared goals and shared pain

Third Way: Continuous Learning
├─ Foster a culture of experimentation
├─ Learn from both success and failure
├─ Practice makes perfect - repetition and practice
├─ Master discipline and continuous improvement
└─ Create organizational learning and memory
```

### Cultural Transformation Strategies

**Building DevOps Culture:**
```
Leadership and Vision
├─ Executive sponsorship and commitment
├─ Clear vision and communication
├─ Resource allocation and investment
├─ Change management and support
└─ Celebrating successes and learning from failures

Team Structure and Organization
├─ Cross-functional teams with shared goals
├─ Embedded operations in development teams
├─ Platform teams enabling self-service
├─ Communities of practice and guilds
└─ Rotation and cross-training programs

Communication and Collaboration
├─ Daily standups and regular retrospectives
├─ Shared tools and communication channels
├─ Documentation and knowledge sharing
├─ Blameless post-mortems and learning
└─ Transparent metrics and dashboards

Psychological Safety and Trust
├─ Safe to fail and learn from mistakes
├─ Encourage experimentation and innovation
├─ Support for professional development
├─ Recognition and reward systems
└─ Work-life balance and sustainability
```

**Measuring Cultural Change:**
```python
# DevOps culture assessment framework
class DevOpsCultureAssessment:
    def __init__(self):
        self.dimensions = {
            'collaboration': {
                'cross_functional_teams': 0,
                'shared_goals': 0,
                'communication_frequency': 0,
                'knowledge_sharing': 0
            },
            'automation': {
                'process_automation': 0,
                'infrastructure_as_code': 0,
                'deployment_automation': 0,
                'testing_automation': 0
            },
            'measurement': {
                'metrics_visibility': 0,
                'feedback_loops': 0,
                'data_driven_decisions': 0,
                'continuous_monitoring': 0
            },
            'learning': {
                'experimentation': 0,
                'failure_tolerance': 0,
                'skill_development': 0,
                'continuous_improvement': 0
            }
        }
    
    def assess_dimension(self, dimension, scores):
        """Assess a cultural dimension with scores 1-5"""
        if dimension in self.dimensions:
            for metric, score in scores.items():
                if metric in self.dimensions[dimension]:
                    self.dimensions[dimension][metric] = score
    
    def calculate_maturity_score(self):
        """Calculate overall DevOps culture maturity"""
        total_score = 0
        total_metrics = 0
        
        for dimension in self.dimensions.values():
            for score in dimension.values():
                total_score += score
                total_metrics += 1
        
        return total_score / total_metrics if total_metrics > 0 else 0
    
    def get_recommendations(self):
        """Get improvement recommendations based on scores"""
        recommendations = []
        
        for dim_name, dimension in self.dimensions.items():
            avg_score = sum(dimension.values()) / len(dimension)
            if avg_score < 3:
                recommendations.append(f"Focus on improving {dim_name}")
        
        return recommendations

# Example usage
assessment = DevOpsCultureAssessment()
assessment.assess_dimension('collaboration', {
    'cross_functional_teams': 4,
    'shared_goals': 3,
    'communication_frequency': 5,
    'knowledge_sharing': 2
})

print(f"Maturity Score: {assessment.calculate_maturity_score()}")
print(f"Recommendations: {assessment.get_recommendations()}")
```

### Free Resources

- [The DevOps Handbook](https://itrevolution.com/the-devops-handbook/) - Comprehensive DevOps transformation guide
- [DevOps Culture - Atlassian](https://www.atlassian.com/devops/what-is-devops/devops-culture) - Cultural transformation strategies
- [State of DevOps Report](https://cloud.google.com/devops/state-of-devops/) - Annual industry research and insights
- [DevOps Institute](https://devopsinstitute.com/) - Professional development and community resources

## 2. Advanced Git Workflows and Collaboration

### Git Workflow Strategies

**Gitflow Workflow:**
```bash
# Initialize gitflow
git flow init

# Feature development
git flow feature start new-feature
# ... develop feature ...
git flow feature finish new-feature

# Release preparation
git flow release start 1.0.0
# ... prepare release ...
git flow release finish 1.0.0

# Hotfix for production
git flow hotfix start critical-fix
# ... fix issue ...
git flow hotfix finish critical-fix
```

**GitHub Flow (Simplified):**
```bash
# Create feature branch
git checkout -b feature/user-authentication
git push -u origin feature/user-authentication

# Make changes and commit
git add .
git commit -m "Add user authentication system"
git push origin feature/user-authentication

# Create pull request (via GitHub UI)
# Review, test, and merge
git checkout main
git pull origin main
git branch -d feature/user-authentication
```

**GitLab Flow (Environment-based):**
```bash
# Feature development
git checkout -b feature/payment-integration
# ... develop and test ...
git push origin feature/payment-integration

# Merge to main after review
git checkout main
git merge feature/payment-integration

# Deploy to staging
git checkout staging
git merge main
git push origin staging

# Deploy to production
git checkout production
git merge main
git push origin production
```

### Advanced Git Techniques

**Interactive Rebase for Clean History:**
```bash
# Interactive rebase last 3 commits
git rebase -i HEAD~3

# Squash commits, edit messages, reorder
# pick abc123 Initial implementation
# squash def456 Fix typo
# squash ghi789 Add tests

# Force push to update remote branch
git push --force-with-lease origin feature-branch
```

**Git Hooks for Automation:**
```bash
#!/bin/bash
# .git/hooks/pre-commit
# Automated code quality checks

echo "Running pre-commit checks..."

# Run linting
if ! npm run lint; then
    echo "Linting failed. Please fix errors before committing."
    exit 1
fi

# Run tests
if ! npm test; then
    echo "Tests failed. Please fix failing tests before committing."
    exit 1
fi

# Check for secrets
if grep -r "API_KEY\|PASSWORD\|SECRET" --include="*.js" --include="*.py" .; then
    echo "Potential secrets detected. Please remove before committing."
    exit 1
fi

echo "Pre-commit checks passed!"
```

**Advanced Branching Strategies:**
```bash
# Trunk-based development
git checkout main
git pull origin main
git checkout -b short-lived-feature
# ... quick development (< 2 days) ...
git push origin short-lived-feature
# Create PR and merge quickly

# Feature flags for continuous deployment
git checkout main
# Deploy with feature flag disabled
git commit -m "Add feature behind flag ENABLE_NEW_FEATURE"
git push origin main
# Enable feature flag in production when ready
```

### Collaborative Development Practices

**Code Review Best Practices:**
```markdown
# Pull Request Template
## Description
Brief description of changes and why they're needed.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No merge conflicts
```

**Pair Programming and Mob Programming:**
```bash
# Git workflow for pair programming
git config user.name "Alice Smith and Bob Jones"
git config user.email "alice.smith+bob.jones@company.com"

# Commit with co-authors
git commit -m "Implement user authentication

Co-authored-by: Alice Smith <alice.smith@company.com>
Co-authored-by: Bob Jones <bob.jones@company.com>"
```

### Free Resources

- [Pro Git Book](https://git-scm.com/book/en/v2) - Complete Git reference (free online)
- [Atlassian Git Tutorials](https://www.atlassian.com/git/tutorials) - Comprehensive Git workflows
- [GitHub Flow Guide](https://guides.github.com/introduction/flow/) - Simple branching strategy
- [GitLab Flow Documentation](https://docs.gitlab.com/ee/topics/gitlab_flow.html) - Environment-based workflows

## 3. Linux System Administration and Automation

### Essential Linux Administration

**System Monitoring and Performance:**
```bash
# System resource monitoring
htop                    # Interactive process viewer
iotop                   # I/O monitoring
nethogs                 # Network usage by process
dstat                   # System resource statistics

# System information
uname -a               # System information
lscpu                  # CPU information
free -h                # Memory usage
df -h                  # Disk usage
lsblk                  # Block devices

# Process management
ps aux                 # All processes
pgrep nginx            # Find process by name
pkill -f "python app"  # Kill process by pattern
nohup command &        # Run command in background
```

**Log Management and Analysis:**
```bash
# System logs
journalctl -f                    # Follow systemd logs
journalctl -u nginx.service      # Service-specific logs
journalctl --since "1 hour ago"  # Time-based filtering

# Log rotation and management
logrotate -d /etc/logrotate.conf # Test log rotation
find /var/log -name "*.log" -mtime +30 -delete  # Cleanup old logs

# Log analysis
grep "ERROR" /var/log/application.log | wc -l    # Count errors
awk '{print $1}' /var/log/nginx/access.log | sort | uniq -c  # IP analysis
tail -f /var/log/syslog | grep --color=always "ERROR\|WARN"  # Real-time monitoring
```

**Network Configuration and Troubleshooting:**
```bash
# Network interface management
ip addr show                    # Show IP addresses
ip route show                   # Show routing table
ip link set eth0 up            # Enable interface

# Network troubleshooting
ping -c 4 google.com           # Connectivity test
traceroute google.com          # Route tracing
nmap -sn 192.168.1.0/24       # Network discovery
ss -tulpn                      # Socket statistics

# Firewall management (iptables)
iptables -L                    # List rules
iptables -A INPUT -p tcp --dport 80 -j ACCEPT  # Allow HTTP
ufw enable                     # Enable UFW firewall
ufw allow 22/tcp              # Allow SSH
```

**Service Management with systemd:**
```bash
# Service management
systemctl status nginx         # Check service status
systemctl start nginx         # Start service
systemctl stop nginx          # Stop service
systemctl restart nginx       # Restart service
systemctl enable nginx        # Enable at boot
systemctl disable nginx       # Disable at boot

# Create custom service
cat > /etc/systemd/system/myapp.service << EOF
[Unit]
Description=My Application
After=network.target

[Service]
Type=simple
User=myapp
WorkingDirectory=/opt/myapp
ExecStart=/opt/myapp/bin/start.sh
Restart=always

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable myapp
systemctl start myapp
```

### System Security and Hardening

**User and Permission Management:**
```bash
# User management
useradd -m -s /bin/bash username    # Create user with home directory
usermod -aG sudo username          # Add user to sudo group
passwd username                    # Set password
userdel -r username                # Delete user and home directory

# File permissions and ownership
chmod 755 /path/to/script          # Set executable permissions
chmod 600 /path/to/private/key     # Restrict access to owner only
chown user:group /path/to/file     # Change ownership
find /var/www -type f -exec chmod 644 {} \;  # Set file permissions recursively

# Access Control Lists (ACL)
setfacl -m u:username:rwx /path/to/directory  # Grant specific user access
getfacl /path/to/directory         # View ACL permissions
```

**SSH Configuration and Security:**
```bash
# SSH key generation and management
ssh-keygen -t ed25519 -C "your.email@example.com"  # Generate SSH key
ssh-copy-id user@server            # Copy public key to server
ssh-add ~/.ssh/id_ed25519         # Add key to SSH agent

# SSH configuration (/etc/ssh/sshd_config)
Port 2222                         # Change default port
PermitRootLogin no               # Disable root login
PasswordAuthentication no        # Disable password authentication
PubkeyAuthentication yes         # Enable key-based authentication
MaxAuthTries 3                   # Limit authentication attempts

# SSH tunneling and port forwarding
ssh -L 8080:localhost:80 user@server     # Local port forwarding
ssh -R 8080:localhost:80 user@server     # Remote port forwarding
ssh -D 1080 user@server                  # SOCKS proxy
```

### Free Resources

- [Linux Journey](https://linuxjourney.com/) - Interactive Linux learning platform
- [The Linux Command Line](http://linuxcommand.org/tlcl.php) - Free comprehensive book
- [Linux System Administration - edX](https://www.edx.org/learn/linux) - Linux Foundation courses
- [CompTIA Linux+ Resources - Professor Messer](https://www.professormesser.com/linux-plus/) - Linux certification prep

## 4. Scripting and Automation

### Python for DevOps Automation

**Infrastructure Automation Scripts:**
```python
#!/usr/bin/env python3
"""
System health monitoring and alerting script
"""
import psutil
import smtplib
import json
from datetime import datetime
from email.mime.text import MIMEText

class SystemMonitor:
    def __init__(self, config_file='monitor_config.json'):
        with open(config_file, 'r') as f:
            self.config = json.load(f)
        
        self.thresholds = self.config['thresholds']
        self.alerts = []
    
    def check_cpu_usage(self):
        """Monitor CPU usage"""
        cpu_percent = psutil.cpu_percent(interval=1)
        if cpu_percent > self.thresholds['cpu']:
            self.alerts.append(f"High CPU usage: {cpu_percent}%")
        return cpu_percent
    
    def check_memory_usage(self):
        """Monitor memory usage"""
        memory = psutil.virtual_memory()
        memory_percent = memory.percent
        if memory_percent > self.thresholds['memory']:
            self.alerts.append(f"High memory usage: {memory_percent}%")
        return memory_percent
    
    def check_disk_usage(self):
        """Monitor disk usage"""
        disk_usage = {}
        for partition in psutil.disk_partitions():
            try:
                usage = psutil.disk_usage(partition.mountpoint)
                percent = (usage.used / usage.total) * 100
                disk_usage[partition.mountpoint] = percent
                
                if percent > self.thresholds['disk']:
                    self.alerts.append(f"High disk usage on {partition.mountpoint}: {percent:.1f}%")
            except PermissionError:
                continue
        return disk_usage
    
    def check_services(self):
        """Check if critical services are running"""
        for service in self.config['critical_services']:
            try:
                # Check if process is running
                for proc in psutil.process_iter(['pid', 'name']):
                    if service in proc.info['name']:
                        break
                else:
                    self.alerts.append(f"Critical service not running: {service}")
            except Exception as e:
                self.alerts.append(f"Error checking service {service}: {str(e)}")
    
    def send_alerts(self):
        """Send email alerts if any issues found"""
        if not self.alerts:
            return
        
        smtp_config = self.config['smtp']
        msg = MIMEText('\n'.join(self.alerts))
        msg['Subject'] = f"System Alert - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
        msg['From'] = smtp_config['from']
        msg['To'] = smtp_config['to']
        
        try:
            with smtplib.SMTP(smtp_config['server'], smtp_config['port']) as server:
                server.starttls()
                server.login(smtp_config['username'], smtp_config['password'])
                server.send_message(msg)
            print(f"Alert sent: {len(self.alerts)} issues detected")
        except Exception as e:
            print(f"Failed to send alert: {str(e)}")
    
    def run_checks(self):
        """Run all monitoring checks"""
        print(f"Running system checks at {datetime.now()}")
        
        cpu = self.check_cpu_usage()
        memory = self.check_memory_usage()
        disk = self.check_disk_usage()
        self.check_services()
        
        print(f"CPU: {cpu}%, Memory: {memory}%")
        print(f"Disk usage: {disk}")
        
        if self.alerts:
            print(f"Alerts: {self.alerts}")
            self.send_alerts()
        else:
            print("All systems normal")

# Configuration file example (monitor_config.json)
config_example = {
    "thresholds": {
        "cpu": 80,
        "memory": 85,
        "disk": 90
    },
    "critical_services": ["nginx", "mysql", "redis"],
    "smtp": {
        "server": "smtp.gmail.com",
        "port": 587,
        "username": "alerts@company.com",
        "password": "app_password",
        "from": "alerts@company.com",
        "to": "admin@company.com"
    }
}

if __name__ == "__main__":
    monitor = SystemMonitor()
    monitor.run_checks()
```

**Deployment Automation Script:**
```python
#!/usr/bin/env python3
"""
Application deployment automation script
"""
import subprocess
import sys
import os
import yaml
from pathlib import Path

class ApplicationDeployer:
    def __init__(self, config_file='deploy_config.yaml'):
        with open(config_file, 'r') as f:
            self.config = yaml.safe_load(f)
        
        self.app_name = self.config['application']['name']
        self.app_path = self.config['application']['path']
        self.backup_path = self.config['backup']['path']
    
    def run_command(self, command, check=True):
        """Execute shell command and return result"""
        try:
            result = subprocess.run(
                command, 
                shell=True, 
                capture_output=True, 
                text=True, 
                check=check
            )
            return result.stdout.strip()
        except subprocess.CalledProcessError as e:
            print(f"Command failed: {command}")
            print(f"Error: {e.stderr}")
            if check:
                sys.exit(1)
            return None
    
    def create_backup(self):
        """Create backup of current application"""
        timestamp = subprocess.run(
            'date +%Y%m%d_%H%M%S', 
            shell=True, 
            capture_output=True, 
            text=True
        ).stdout.strip()
        
        backup_name = f"{self.app_name}_{timestamp}"
        backup_full_path = f"{self.backup_path}/{backup_name}"
        
        print(f"Creating backup: {backup_full_path}")
        self.run_command(f"cp -r {self.app_path} {backup_full_path}")
        
        # Keep only last 5 backups
        self.run_command(f"ls -t {self.backup_path} | tail -n +6 | xargs -I {{}} rm -rf {self.backup_path}/{{}}")
        
        return backup_full_path
    
    def stop_services(self):
        """Stop application services"""
        for service in self.config['services']:
            print(f"Stopping service: {service}")
            self.run_command(f"sudo systemctl stop {service}")
    
    def start_services(self):
        """Start application services"""
        for service in self.config['services']:
            print(f"Starting service: {service}")
            self.run_command(f"sudo systemctl start {service}")
    
    def update_code(self):
        """Update application code from repository"""
        print("Updating application code...")
        os.chdir(self.app_path)
        
        # Pull latest changes
        self.run_command("git fetch origin")
        self.run_command(f"git checkout {self.config['deployment']['branch']}")
        self.run_command("git pull origin " + self.config['deployment']['branch'])
        
        # Install dependencies
        if Path("requirements.txt").exists():
            self.run_command("pip install -r requirements.txt")
        elif Path("package.json").exists():
            self.run_command("npm install")
    
    def run_migrations(self):
        """Run database migrations if configured"""
        if 'migrations' in self.config and self.config['migrations']['enabled']:
            print("Running database migrations...")
            migration_command = self.config['migrations']['command']
            self.run_command(migration_command)
    
    def run_tests(self):
        """Run application tests"""
        if 'testing' in self.config and self.config['testing']['enabled']:
            print("Running tests...")
            test_command = self.config['testing']['command']
            result = self.run_command(test_command, check=False)
            if not result:
                print("Tests failed! Rolling back deployment...")
                return False
        return True
    
    def health_check(self):
        """Perform application health check"""
        health_url = self.config['health_check']['url']
        expected_status = self.config['health_check']['expected_status']
        
        print(f"Performing health check: {health_url}")
        result = self.run_command(
            f"curl -s -o /dev/null -w '%{{http_code}}' {health_url}",
            check=False
        )
        
        if result == str(expected_status):
            print("Health check passed!")
            return True
        else:
            print(f"Health check failed! Expected {expected_status}, got {result}")
            return False
    
    def rollback(self, backup_path):
        """Rollback to previous version"""
        print(f"Rolling back to: {backup_path}")
        self.stop_services()
        self.run_command(f"rm -rf {self.app_path}")
        self.run_command(f"cp -r {backup_path} {self.app_path}")
        self.start_services()
    
    def deploy(self):
        """Execute full deployment process"""
        print(f"Starting deployment of {self.app_name}")
        
        # Create backup
        backup_path = self.create_backup()
        
        try:
            # Stop services
            self.stop_services()
            
            # Update code
            self.update_code()
            
            # Run migrations
            self.run_migrations()
            
            # Start services
            self.start_services()
            
            # Run tests
            if not self.run_tests():
                self.rollback(backup_path)
                return False
            
            # Health check
            if not self.health_check():
                self.rollback(backup_path)
                return False
            
            print("Deployment completed successfully!")
            return True
            
        except Exception as e:
            print(f"Deployment failed: {str(e)}")
            self.rollback(backup_path)
            return False

# Example configuration (deploy_config.yaml)
config_example = """
application:
  name: "myapp"
  path: "/opt/myapp"

backup:
  path: "/opt/backups"

deployment:
  branch: "main"

services:
  - "myapp"
  - "nginx"

migrations:
  enabled: true
  command: "python manage.py migrate"

testing:
  enabled: true
  command: "python -m pytest tests/"

health_check:
  url: "http://localhost:8000/health"
  expected_status: 200
"""

if __name__ == "__main__":
    deployer = ApplicationDeployer()
    success = deployer.deploy()
    sys.exit(0 if success else 1)
```

### Bash Scripting for System Administration

**System Maintenance Script:**
```bash
#!/bin/bash
# system_maintenance.sh - Automated system maintenance script

set -euo pipefail  # Exit on error, undefined vars, pipe failures

# Configuration
LOG_FILE="/var/log/system_maintenance.log"
BACKUP_DIR="/opt/backups"
RETENTION_DAYS=30
EMAIL_ALERT="admin@company.com"

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Error handling
error_exit() {
    log "ERROR: $1"
    echo "System maintenance failed. Check $LOG_FILE for details." | \
        mail -s "System Maintenance Failed" "$EMAIL_ALERT"
    exit 1
}

# Check if running as root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        error_exit "This script must be run as root"
    fi
}

# System updates
update_system() {
    log "Starting system updates..."
    
    if command -v apt-get &> /dev/null; then
        apt-get update || error_exit "Failed to update package lists"
        apt-get upgrade -y || error_exit "Failed to upgrade packages"
        apt-get autoremove -y || error_exit "Failed to remove unused packages"
        apt-get autoclean || error_exit "Failed to clean package cache"
    elif command -v yum &> /dev/null; then
        yum update -y || error_exit "Failed to update system with yum"
        yum autoremove -y || error_exit "Failed to remove unused packages"
    elif command -v dnf &> /dev/null; then
        dnf update -y || error_exit "Failed to update system with dnf"
        dnf autoremove -y || error_exit "Failed to remove unused packages"
    fi
    
    log "System updates completed successfully"
}

# Cleanup old logs
cleanup_logs() {
    log "Cleaning up old log files..."
    
    # Rotate and compress logs older than 7 days
    find /var/log -name "*.log" -type f -mtime +7 -exec gzip {} \;
    
    # Remove compressed logs older than retention period
    find /var/log -name "*.gz" -type f -mtime +$RETENTION_DAYS -delete
    
    # Clean journal logs
    journalctl --vacuum-time=${RETENTION_DAYS}d
    
    log "Log cleanup completed"
}

# Cleanup temporary files
cleanup_temp() {
    log "Cleaning up temporary files..."
    
    # Clean /tmp (files older than 7 days)
    find /tmp -type f -mtime +7 -delete 2>/dev/null || true
    
    # Clean /var/tmp (files older than 30 days)
    find /var/tmp -type f -mtime +30 -delete 2>/dev/null || true
    
    # Clean package manager cache
    if command -v apt-get &> /dev/null; then
        apt-get clean
    elif command -v yum &> /dev/null; then
        yum clean all
    elif command -v dnf &> /dev/null; then
        dnf clean all
    fi
    
    log "Temporary file cleanup completed"
}

# Backup critical configurations
backup_configs() {
    log "Backing up critical configurations..."
    
    BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
    BACKUP_PATH="$BACKUP_DIR/config_backup_$BACKUP_DATE"
    
    mkdir -p "$BACKUP_PATH"
    
    # Backup critical directories
    CRITICAL_DIRS=(
        "/etc"
        "/var/spool/cron"
        "/home"
        "/opt"
    )
    
    for dir in "${CRITICAL_DIRS[@]}"; do
        if [[ -d "$dir" ]]; then
            log "Backing up $dir..."
            tar -czf "$BACKUP_PATH/$(basename $dir).tar.gz" -C "$(dirname $dir)" "$(basename $dir)" 2>/dev/null || \
                log "Warning: Failed to backup $dir"
        fi
    done
    
    # Remove old backups
    find "$BACKUP_DIR" -name "config_backup_*" -type d -mtime +$RETENTION_DAYS -exec rm -rf {} \; 2>/dev/null || true
    
    log "Configuration backup completed"
}

# Check disk space
check_disk_space() {
    log "Checking disk space..."
    
    # Check if any filesystem is over 90% full
    df -h | awk 'NR>1 {gsub(/%/,"",$5); if($5 > 90) print $0}' | while read line; do
        log "WARNING: Filesystem over 90% full: $line"
        echo "Disk space warning: $line" | \
            mail -s "Disk Space Alert" "$EMAIL_ALERT"
    done
    
    log "Disk space check completed"
}

# Check system services
check_services() {
    log "Checking critical services..."
    
    CRITICAL_SERVICES=(
        "ssh"
        "nginx"
        "mysql"
        "postgresql"
        "redis"
    )
    
    for service in "${CRITICAL_SERVICES[@]}"; do
        if systemctl list-unit-files | grep -q "^$service.service"; then
            if ! systemctl is-active --quiet "$service"; then
                log "WARNING: Service $service is not running"
                echo "Service $service is down" | \
                    mail -s "Service Alert" "$EMAIL_ALERT"
            else
                log "Service $service is running normally"
            fi
        fi
    done
    
    log "Service check completed"
}

# Generate system report
generate_report() {
    log "Generating system report..."
    
    REPORT_FILE="/tmp/system_report_$(date +%Y%m%d).txt"
    
    {
        echo "System Maintenance Report - $(date)"
        echo "========================================"
        echo
        echo "System Information:"
        uname -a
        echo
        echo "Uptime:"
        uptime
        echo
        echo "Memory Usage:"
        free -h
        echo
        echo "Disk Usage:"
        df -h
        echo
        echo "Top 10 Processes by CPU:"
        ps aux --sort=-%cpu | head -11
        echo
        echo "Top 10 Processes by Memory:"
        ps aux --sort=-%mem | head -11
        echo
        echo "Network Connections:"
        ss -tulpn | head -20
        echo
        echo "Recent Log Entries:"
        tail -20 "$LOG_FILE"
    } > "$REPORT_FILE"
    
    # Email the report
    mail -s "System Maintenance Report - $(hostname)" "$EMAIL_ALERT" < "$REPORT_FILE"
    
    rm "$REPORT_FILE"
    log "System report generated and sent"
}

# Main execution
main() {
    log "Starting system maintenance script"
    
    check_root
    update_system
    cleanup_logs
    cleanup_temp
    backup_configs
    check_disk_space
    check_services
    generate_report
    
    log "System maintenance completed successfully"
}

# Run main function
main "$@"
```

### Free Resources

- [Automate the Boring Stuff with Python](https://automatetheboringstuff.com/) - Python automation guide
- [Advanced Bash-Scripting Guide](https://tldp.org/LDP/abs/html/) - Comprehensive Bash scripting
- [Python for DevOps - Real Python](https://realpython.com/python-devops/) - Python DevOps tutorials
- [Shell Scripting Tutorial](https://www.shellscript.sh/) - Interactive shell scripting guide

## Hands-On Exercises

### Exercise 1: DevOps Culture Assessment

**Task:** Conduct a DevOps culture assessment for a fictional organization.

**Requirements:**
- Use the culture assessment framework provided
- Identify strengths and improvement areas
- Create an improvement roadmap
- Present findings and recommendations

### Exercise 2: Git Workflow Implementation

**Task:** Set up a complete Git workflow for a team project.

**Requirements:**
- Choose appropriate branching strategy
- Configure Git hooks for automation
- Create pull request templates
- Implement code review process
- Document workflow for team

### Exercise 3: Linux System Automation

**Task:** Create a comprehensive system monitoring and maintenance solution.

**Requirements:**
- Monitor system resources and services
- Implement automated cleanup and maintenance
- Set up alerting for critical issues
- Create backup and recovery procedures
- Document all processes and procedures

## Assessment Questions

1. **Explain the Three Ways of DevOps and how they apply to organizational transformation.**

2. **Compare and contrast different Git workflow strategies (Gitflow, GitHub Flow, GitLab Flow).**

3. **Design a system monitoring solution that covers all critical aspects of infrastructure health.**

4. **Create a cultural transformation plan for an organization moving from traditional IT to DevOps.**

5. **Implement automated deployment with rollback capabilities using scripting.**

## Next Steps

After completing this module:

1. **Practice collaborative development** using Git workflows with team members
2. **Set up monitoring and automation** in a lab environment
3. **Join DevOps communities** to learn from experienced practitioners
4. **Move to Module 2: CI/CD Pipelines** to build automated deployment systems

## Additional Resources

### Communities and Forums
- [r/devops](https://www.reddit.com/r/devops/) - DevOps community discussions
- [DevOps Institute](https://devopsinstitute.com/) - Professional development and certification
- [CNCF Community](https://www.cncf.io/community/) - Cloud native computing community
- [Local DevOps Meetups](https://www.meetup.com/) - In-person networking and learning

### Books and Publications
- [The DevOps Handbook](https://itrevolution.com/the-devops-handbook/) - Transformation guide
- [The Phoenix Project](https://itrevolution.com/the-phoenix-project/) - DevOps novel
- [Accelerate](https://itrevolution.com/accelerate-book/) - Research-based DevOps practices
- [Team Topologies](https://teamtopologies.com/) - Organizing teams for fast flow

### Tools and Platforms
- [GitHub](https://github.com/) - Git hosting and collaboration
- [GitLab](https://gitlab.com/) - Integrated DevOps platform
- [Atlassian Suite](https://www.atlassian.com/) - Collaboration and development tools
- [Slack](https://slack.com/) - Team communication and integration

Ready to build automated pipelines? Continue to **Module 2: CI/CD Pipelines and Automation** to master continuous integration and deployment!
