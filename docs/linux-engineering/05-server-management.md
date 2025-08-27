---
sidebar_position: 6
---

# Server Management and Performance

Master web server configuration, database management, and system performance optimization.

## Web Server Management

Web servers are fundamental components of modern infrastructure. Learn to configure and manage popular web servers.

### Apache HTTP Server

Apache is one of the most widely used web servers, known for its flexibility and extensive module system.

**Installation and Basic Setup:**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install apache2

# CentOS/RHEL
sudo yum install httpd
# or on newer versions
sudo dnf install httpd

# Start and enable Apache
sudo systemctl start apache2    # Ubuntu/Debian
sudo systemctl start httpd     # CentOS/RHEL
sudo systemctl enable apache2  # Ubuntu/Debian
sudo systemctl enable httpd    # CentOS/RHEL

# Check status
sudo systemctl status apache2
```

**Apache Configuration Files:**
```bash
# Main configuration files
/etc/apache2/apache2.conf           # Ubuntu/Debian main config
/etc/httpd/conf/httpd.conf          # CentOS/RHEL main config

# Virtual host configurations
/etc/apache2/sites-available/       # Ubuntu/Debian
/etc/httpd/conf.d/                  # CentOS/RHEL

# Module configurations
/etc/apache2/mods-available/        # Ubuntu/Debian
/etc/httpd/conf.modules.d/          # CentOS/RHEL

# Document root
/var/www/html/                      # Default web directory
```

**Basic Apache Configuration:**
```bash
# Edit main configuration
sudo nano /etc/apache2/apache2.conf

# Key directives:
ServerRoot /etc/apache2
Listen 80
User www-data
Group www-data
DocumentRoot /var/www/html
DirectoryIndex index.html index.php

# Security settings
ServerTokens Prod
ServerSignature Off

# Performance settings
Timeout 60
KeepAlive On
MaxKeepAliveRequests 100
KeepAliveTimeout 5
```

**Virtual Hosts Configuration:**
```bash
# Create virtual host file
sudo nano /etc/apache2/sites-available/example.com.conf

# Virtual host configuration:
<VirtualHost *:80>
    ServerName example.com
    ServerAlias www.example.com
    DocumentRoot /var/www/example.com
    
    # Logging
    ErrorLog ${APACHE_LOG_DIR}/example.com_error.log
    CustomLog ${APACHE_LOG_DIR}/example.com_access.log combined
    
    # Directory permissions
    <Directory /var/www/example.com>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>

# Enable the site
sudo a2ensite example.com.conf

# Create document root
sudo mkdir -p /var/www/example.com
sudo chown -R www-data:www-data /var/www/example.com

# Test configuration
sudo apache2ctl configtest

# Reload Apache
sudo systemctl reload apache2
```

**SSL/HTTPS Configuration:**
```bash
# Enable SSL module
sudo a2enmod ssl

# Create SSL virtual host
sudo nano /etc/apache2/sites-available/example.com-ssl.conf

<VirtualHost *:443>
    ServerName example.com
    DocumentRoot /var/www/example.com
    
    # SSL Configuration
    SSLEngine on
    SSLCertificateFile /etc/ssl/certs/example.com.crt
    SSLCertificateKeyFile /etc/ssl/private/example.com.key
    
    # Security headers
    Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    
    # Logging
    ErrorLog ${APACHE_LOG_DIR}/example.com_ssl_error.log
    CustomLog ${APACHE_LOG_DIR}/example.com_ssl_access.log combined
</VirtualHost>

# Enable headers module and site
sudo a2enmod headers
sudo a2ensite example.com-ssl.conf
sudo systemctl reload apache2
```

### Nginx Web Server

Nginx is known for high performance, low resource usage, and excellent reverse proxy capabilities.

**Installation and Basic Setup:**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx
# or
sudo dnf install nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

**Nginx Configuration Structure:**
```bash
# Main configuration
/etc/nginx/nginx.conf

# Site configurations
/etc/nginx/sites-available/    # Ubuntu/Debian
/etc/nginx/conf.d/            # CentOS/RHEL

# Document root
/var/www/html/                # Default

# Log files
/var/log/nginx/access.log
/var/log/nginx/error.log
```

**Basic Nginx Configuration:**
```bash
# Edit main configuration
sudo nano /etc/nginx/nginx.conf

# Main context configuration:
user www-data;
worker_processes auto;
pid /run/nginx.pid;

events {
    worker_connections 768;
    use epoll;
    multi_accept on;
}

http {
    # Basic Settings
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    server_tokens off;
    
    # MIME types
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    
    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Include site configurations
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
```

**Nginx Server Blocks (Virtual Hosts):**
```bash
# Create server block configuration
sudo nano /etc/nginx/sites-available/example.com

server {
    listen 80;
    listen [::]:80;
    
    server_name example.com www.example.com;
    root /var/www/example.com;
    index index.html index.htm index.php;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Main location block
    location / {
        try_files $uri $uri/ =404;
    }
    
    # PHP processing (if needed)
    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
    }
    
    # Deny access to hidden files
    location ~ /\. {
        deny all;
    }
    
    # Static file caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Logging
    access_log /var/log/nginx/example.com.access.log;
    error_log /var/log/nginx/example.com.error.log;
}

# Enable the site
sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

**Nginx SSL Configuration:**
```bash
# SSL server block
sudo nano /etc/nginx/sites-available/example.com-ssl

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    
    server_name example.com www.example.com;
    root /var/www/example.com;
    
    # SSL Configuration
    ssl_certificate /etc/ssl/certs/example.com.crt;
    ssl_certificate_key /etc/ssl/private/example.com.key;
    
    # SSL Security
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=63072000" always;
    
    # Rest of configuration...
    location / {
        try_files $uri $uri/ =404;
    }
}

# HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name example.com www.example.com;
    return 301 https://$server_name$request_uri;
}
```

### Let's Encrypt SSL Certificates

**Installing Certbot:**
```bash
# Ubuntu/Debian
sudo apt install certbot python3-certbot-apache python3-certbot-nginx

# CentOS/RHEL
sudo yum install certbot python3-certbot-apache python3-certbot-nginx
```

**Obtaining SSL Certificates:**
```bash
# For Apache
sudo certbot --apache -d example.com -d www.example.com

# For Nginx
sudo certbot --nginx -d example.com -d www.example.com

# Manual certificate generation
sudo certbot certonly --standalone -d example.com -d www.example.com

# Test automatic renewal
sudo certbot renew --dry-run

# Set up automatic renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Practical Web Server Examples

**Example 1: Multi-Site Apache Configuration Script**
```bash
#!/bin/bash

create_apache_vhost() {
    local domain=$1
    local doc_root="/var/www/$domain"
    
    echo "Creating virtual host for $domain..."
    
    # Create document root
    sudo mkdir -p "$doc_root"
    sudo chown -R www-data:www-data "$doc_root"
    sudo chmod -R 755 "$doc_root"
    
    # Create index file
    cat > /tmp/index.html << EOF
<!DOCTYPE html>
<html>
<head>
    <title>Welcome to $domain</title>
</head>
<body>
    <h1>$domain is working!</h1>
    <p>This is the default page for $domain</p>
</body>
</html>
EOF
    
    sudo mv /tmp/index.html "$doc_root/"
    
    # Create virtual host configuration
    sudo tee "/etc/apache2/sites-available/$domain.conf" > /dev/null << EOF
<VirtualHost *:80>
    ServerName $domain
    ServerAlias www.$domain
    DocumentRoot $doc_root
    
    ErrorLog \${APACHE_LOG_DIR}/${domain}_error.log
    CustomLog \${APACHE_LOG_DIR}/${domain}_access.log combined
    
    <Directory $doc_root>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    # Security headers
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
</VirtualHost>
EOF
    
    # Enable site
    sudo a2ensite "$domain.conf"
    
    echo "Virtual host created for $domain"
}

# Enable required modules
sudo a2enmod rewrite
sudo a2enmod headers
sudo a2enmod ssl

# Create multiple sites
domains=("site1.local" "site2.local" "site3.local")

for domain in "${domains[@]}"; do
    create_apache_vhost "$domain"
done

# Test configuration
if sudo apache2ctl configtest; then
    sudo systemctl reload apache2
    echo "Apache configuration reloaded successfully"
else
    echo "Apache configuration test failed"
fi
```

**Example 2: Nginx Load Balancer Configuration**
```bash
#!/bin/bash

# Create load balancer configuration
sudo tee /etc/nginx/conf.d/load_balancer.conf > /dev/null << 'EOF'
# Upstream backend servers
upstream backend_servers {
    least_conn;  # Load balancing method
    server 192.168.1.10:8080 weight=3 max_fails=3 fail_timeout=30s;
    server 192.168.1.11:8080 weight=2 max_fails=3 fail_timeout=30s;
    server 192.168.1.12:8080 weight=1 max_fails=3 fail_timeout=30s backup;
}

# Health check location
upstream backend_health {
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
    server 192.168.1.12:8080;
}

server {
    listen 80;
    server_name app.example.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name app.example.com;
    
    # SSL configuration
    ssl_certificate /etc/ssl/certs/app.example.com.crt;
    ssl_certificate_key /etc/ssl/private/app.example.com.key;
    
    # Logging
    access_log /var/log/nginx/app.example.com.access.log;
    error_log /var/log/nginx/app.example.com.error.log;
    
    # Main application
    location / {
        proxy_pass http://backend_servers;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
        
        # Buffer settings
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
    }
    
    # Health check endpoint
    location /health {
        access_log off;
        proxy_pass http://backend_health/health;
        proxy_set_header Host $host;
    }
    
    # Static files (served directly by Nginx)
    location /static/ {
        alias /var/www/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

echo "Load balancer configuration created"
echo "Test with: sudo nginx -t"
echo "Reload with: sudo systemctl reload nginx"
```

## Database Management

Database servers are critical components that require proper installation, configuration, and maintenance.

### MySQL/MariaDB

**Installation:**
```bash
# Ubuntu/Debian - MySQL
sudo apt update
sudo apt install mysql-server

# Ubuntu/Debian - MariaDB
sudo apt install mariadb-server

# CentOS/RHEL - MySQL
sudo yum install mysql-server
# or
sudo dnf install mysql-server

# CentOS/RHEL - MariaDB
sudo yum install mariadb-server
# or
sudo dnf install mariadb-server

# Start and enable service
sudo systemctl start mysql      # or mariadb
sudo systemctl enable mysql     # or mariadb
```

**Initial Security Setup:**
```bash
# Run security script
sudo mysql_secure_installation

# Manual security steps:
mysql -u root -p

-- Set root password (if not set)
ALTER USER 'root'@'localhost' IDENTIFIED BY 'strong_password';

-- Remove anonymous users
DELETE FROM mysql.user WHERE User='';

-- Disable remote root login
DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');

-- Remove test database
DROP DATABASE IF EXISTS test;
DELETE FROM mysql.db WHERE Db='test' OR Db='test\\_%';

-- Reload privileges
FLUSH PRIVILEGES;
```

**Basic MySQL Configuration:**
```bash
# Edit MySQL configuration
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf

# Key settings:
[mysqld]
# Basic settings
bind-address = 127.0.0.1
port = 3306
datadir = /var/lib/mysql
socket = /var/run/mysqld/mysqld.sock

# Performance settings
max_connections = 100
innodb_buffer_pool_size = 128M
innodb_log_file_size = 64M
query_cache_size = 16M
query_cache_limit = 1M

# Security settings
local-infile = 0
skip-show-database

# Logging
log_error = /var/log/mysql/error.log
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 2

# Binary logging (for replication)
log_bin = /var/log/mysql/mysql-bin.log
binlog_expire_logs_seconds = 604800  # 7 days

# Restart MySQL after configuration changes
sudo systemctl restart mysql
```

**Database and User Management:**
```sql
-- Connect to MySQL
mysql -u root -p

-- Create database
CREATE DATABASE myapp_production;
CREATE DATABASE myapp_development;

-- Create user with specific privileges
CREATE USER 'myapp_user'@'localhost' IDENTIFIED BY 'secure_password';
CREATE USER 'myapp_user'@'192.168.1.%' IDENTIFIED BY 'secure_password';

-- Grant privileges
GRANT SELECT, INSERT, UPDATE, DELETE ON myapp_production.* TO 'myapp_user'@'localhost';
GRANT ALL PRIVILEGES ON myapp_development.* TO 'myapp_user'@'localhost';

-- Create read-only user
CREATE USER 'readonly_user'@'localhost' IDENTIFIED BY 'readonly_password';
GRANT SELECT ON myapp_production.* TO 'readonly_user'@'localhost';

-- Create backup user
CREATE USER 'backup_user'@'localhost' IDENTIFIED BY 'backup_password';
GRANT SELECT, LOCK TABLES, SHOW VIEW, EVENT, TRIGGER ON *.* TO 'backup_user'@'localhost';

-- Reload privileges
FLUSH PRIVILEGES;

-- Show users and privileges
SELECT User, Host FROM mysql.user;
SHOW GRANTS FOR 'myapp_user'@'localhost';
```

### PostgreSQL

**Installation:**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# CentOS/RHEL
sudo yum install postgresql-server postgresql-contrib
# or
sudo dnf install postgresql-server postgresql-contrib

# Initialize database (CentOS/RHEL only)
sudo postgresql-setup initdb

# Start and enable service
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**PostgreSQL Configuration:**
```bash
# Switch to postgres user
sudo -u postgres psql

-- Set password for postgres user
\password postgres

-- Exit psql
\q

# Edit PostgreSQL configuration
sudo nano /etc/postgresql/13/main/postgresql.conf

# Key settings:
listen_addresses = 'localhost'
port = 5432
max_connections = 100
shared_buffers = 128MB
effective_cache_size = 4GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100

# Edit client authentication
sudo nano /etc/postgresql/13/main/pg_hba.conf

# Example pg_hba.conf entries:
# TYPE  DATABASE        USER            ADDRESS                 METHOD
local   all             postgres                                peer
local   all             all                                     md5
host    all             all             127.0.0.1/32            md5
host    all             all             ::1/128                 md5
host    all             all             192.168.1.0/24          md5

# Restart PostgreSQL
sudo systemctl restart postgresql
```

**PostgreSQL Database Management:**
```bash
# Connect as postgres user
sudo -u postgres psql

-- Create database
CREATE DATABASE myapp_production;
CREATE DATABASE myapp_development;

-- Create user
CREATE USER myapp_user WITH PASSWORD 'secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE myapp_production TO myapp_user;
GRANT ALL PRIVILEGES ON DATABASE myapp_development TO myapp_user;

-- Create read-only user
CREATE USER readonly_user WITH PASSWORD 'readonly_password';
GRANT CONNECT ON DATABASE myapp_production TO readonly_user;
\c myapp_production
GRANT USAGE ON SCHEMA public TO readonly_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO readonly_user;

-- List databases and users
\l
\du

-- Connect to specific database
\c myapp_production

-- Show tables
\dt

-- Exit psql
\q
```

### Database Backup and Recovery

**MySQL Backup Scripts:**
```bash
#!/bin/bash

# MySQL backup script
BACKUP_DIR="/backup/mysql"
DATE=$(date +%Y%m%d_%H%M%S)
MYSQL_USER="backup_user"
MYSQL_PASSWORD="backup_password"
DATABASES=("myapp_production" "myapp_development")

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Function to backup single database
backup_database() {
    local db_name=$1
    local backup_file="$BACKUP_DIR/${db_name}_${DATE}.sql"
    
    echo "Backing up database: $db_name"
    
    if mysqldump -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" \
        --single-transaction \
        --routines \
        --triggers \
        "$db_name" > "$backup_file"; then
        
        # Compress backup
        gzip "$backup_file"
        echo "Backup completed: ${backup_file}.gz"
        
        # Set permissions
        chmod 600 "${backup_file}.gz"
        
        return 0
    else
        echo "Backup failed for database: $db_name"
        return 1
    fi
}

# Backup all databases
for db in "${DATABASES[@]}"; do
    backup_database "$db"
done

# Clean up old backups (keep 7 days)
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +7 -delete

echo "Backup process completed"
```

**PostgreSQL Backup Script:**
```bash
#!/bin/bash

# PostgreSQL backup script
BACKUP_DIR="/backup/postgresql"
DATE=$(date +%Y%m%d_%H%M%S)
PG_USER="postgres"
DATABASES=("myapp_production" "myapp_development")

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Function to backup single database
backup_database() {
    local db_name=$1
    local backup_file="$BACKUP_DIR/${db_name}_${DATE}.sql"
    
    echo "Backing up database: $db_name"
    
    if sudo -u "$PG_USER" pg_dump "$db_name" > "$backup_file"; then
        # Compress backup
        gzip "$backup_file"
        echo "Backup completed: ${backup_file}.gz"
        
        # Set permissions
        chmod 600 "${backup_file}.gz"
        
        return 0
    else
        echo "Backup failed for database: $db_name"
        return 1
    fi
}

# Backup all databases
for db in "${DATABASES[@]}"; do
    backup_database "$db"
done

# Clean up old backups (keep 7 days)
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +7 -delete

echo "Backup process completed"
```

**Database Restoration:**
```bash
# MySQL restoration
mysql -u root -p myapp_production < backup_file.sql

# PostgreSQL restoration
sudo -u postgres psql myapp_production < backup_file.sql

# Or create new database and restore
sudo -u postgres createdb myapp_restored
sudo -u postgres psql myapp_restored < backup_file.sql
```

## Performance Monitoring and Optimization

System performance monitoring helps identify bottlenecks and optimize resource usage.

### System Performance Monitoring

**CPU Monitoring:**
```bash
# Real-time CPU monitoring
top
htop

# CPU usage by process
ps aux --sort=-%cpu | head -10

# CPU information
lscpu
cat /proc/cpuinfo

# Load average monitoring
uptime
cat /proc/loadavg

# Historical CPU data
sar -u 1 10  # CPU usage every second for 10 seconds
sar -u -f /var/log/sysstat/saXX  # Historical data
```

**Memory Monitoring:**
```bash
# Memory usage
free -h
cat /proc/meminfo

# Memory usage by process
ps aux --sort=-%mem | head -10

# Detailed memory analysis
sudo pmap -x PID  # Memory map for specific process
sudo smem -t      # Memory usage with swap

# Memory statistics over time
sar -r 1 10  # Memory usage every second
vmstat 1 10  # Virtual memory statistics
```

**Disk I/O Monitoring:**
```bash
# Disk usage
df -h
du -sh /var/log/*

# Disk I/O statistics
iostat -x 1 10
iotop  # Real-time I/O monitoring

# Find large files
find / -type f -size +100M -exec ls -lh {} \; 2>/dev/null

# Disk performance testing
sudo hdparm -tT /dev/sda  # Read performance test
sudo dd if=/dev/zero of=/tmp/test bs=1M count=1024  # Write test
```

**Network Monitoring:**
```bash
# Network interface statistics
cat /proc/net/dev
ip -s link show

# Network connections
ss -tuln
netstat -tuln

# Network traffic monitoring
iftop -i eth0
nethogs
nload

# Network performance testing
iperf3 -s  # Server mode
iperf3 -c server_ip  # Client mode
```

### Performance Optimization Techniques

**System Tuning:**
```bash
# Kernel parameters for performance
sudo nano /etc/sysctl.d/99-performance.conf

# Network performance
net.core.rmem_max = 16777216
net.core.wmem_max = 16777216
net.ipv4.tcp_rmem = 4096 87380 16777216
net.ipv4.tcp_wmem = 4096 65536 16777216
net.ipv4.tcp_congestion_control = bbr

# File system performance
vm.dirty_ratio = 15
vm.dirty_background_ratio = 5
vm.swappiness = 10

# Apply settings
sudo sysctl -p /etc/sysctl.d/99-performance.conf
```

**Web Server Optimization:**
```bash
# Apache performance tuning
sudo nano /etc/apache2/mods-available/mpm_prefork.conf

<IfModule mpm_prefork_module>
    StartServers             8
    MinSpareServers          5
    MaxSpareServers         20
    ServerLimit            256
    MaxRequestWorkers      256
    MaxConnectionsPerChild   0
</IfModule>

# Enable compression
sudo a2enmod deflate
sudo nano /etc/apache2/mods-available/deflate.conf

<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Nginx performance tuning
sudo nano /etc/nginx/nginx.conf

worker_processes auto;
worker_connections 1024;
worker_rlimit_nofile 2048;

# Enable gzip compression
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_comp_level 6;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

# Buffer sizes
client_body_buffer_size 128k;
client_max_body_size 10m;
client_header_buffer_size 1k;
large_client_header_buffers 4 4k;
output_buffers 1 32k;
postpone_output 1460;
```

**Database Optimization:**
```bash
# MySQL performance tuning
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf

[mysqld]
# InnoDB settings
innodb_buffer_pool_size = 1G  # 70-80% of available RAM
innodb_log_file_size = 256M
innodb_log_buffer_size = 8M
innodb_flush_log_at_trx_commit = 1
innodb_file_per_table = 1

# Query cache
query_cache_type = 1
query_cache_size = 64M
query_cache_limit = 2M

# Connection settings
max_connections = 200
thread_cache_size = 8
table_open_cache = 2000

# PostgreSQL performance tuning
sudo nano /etc/postgresql/13/main/postgresql.conf

# Memory settings
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 4MB
maintenance_work_mem = 64MB

# Checkpoint settings
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100

# Connection settings
max_connections = 100
```

### Comprehensive Performance Monitoring Script

```bash
#!/bin/bash

#############################################
# System Performance Monitor
# Description: Comprehensive system monitoring
# Version: 1.0
#############################################

REPORT_FILE="/tmp/performance_report_$(date +%Y%m%d_%H%M%S).txt"
ALERT_THRESHOLDS=(
    "CPU_THRESHOLD=80"
    "MEMORY_THRESHOLD=80"
    "DISK_THRESHOLD=85"
    "LOAD_THRESHOLD=2.0"
)

# Load thresholds
for threshold in "${ALERT_THRESHOLDS[@]}"; do
    export "$threshold"
done

log_section() {
    echo "=== $1 ===" | tee -a "$REPORT_FILE"
    echo "Timestamp: $(date)" | tee -a "$REPORT_FILE"
    echo "" | tee -a "$REPORT_FILE"
}

check_cpu_usage() {
    log_section "CPU Usage Analysis"
    
    # Current CPU usage
    cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | sed 's/%us,//')
    echo "Current CPU Usage: ${cpu_usage}%" | tee -a "$REPORT_FILE"
    
    # Load average
    load_avg=$(uptime | awk -F'load average:' '{print $2}' | awk '{print $1}' | sed 's/,//')
    echo "Load Average (1min): $load_avg" | tee -a "$REPORT_FILE"
    
    # Top CPU processes
    echo "Top 5 CPU-consuming processes:" | tee -a "$REPORT_FILE"
    ps aux --sort=-%cpu | head -6 | tee -a "$REPORT_FILE"
    
    # CPU usage alert
    cpu_num=$(echo "$cpu_usage" | cut -d'.' -f1)
    if [ "$cpu_num" -gt "$CPU_THRESHOLD" ]; then
        echo "ALERT: High CPU usage detected!" | tee -a "$REPORT_FILE"
    fi
    
    echo "" | tee -a "$REPORT_FILE"
}

check_memory_usage() {
    log_section "Memory Usage Analysis"
    
    # Memory statistics
    free -h | tee -a "$REPORT_FILE"
    
    # Memory usage percentage
    memory_usage=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
    echo "Memory Usage: ${memory_usage}%" | tee -a "$REPORT_FILE"
    
    # Top memory processes
    echo "Top 5 memory-consuming processes:" | tee -a "$REPORT_FILE"
    ps aux --sort=-%mem | head -6 | tee -a "$REPORT_FILE"
    
    # Memory usage alert
    if [ "$memory_usage" -gt "$MEMORY_THRESHOLD" ]; then
        echo "ALERT: High memory usage detected!" | tee -a "$REPORT_FILE"
    fi
    
    echo "" | tee -a "$REPORT_FILE"
}

check_disk_usage() {
    log_section "Disk Usage Analysis"
    
    # Disk space usage
    df -h | tee -a "$REPORT_FILE"
    
    # Check for high disk usage
    echo "Disk usage alerts:" | tee -a "$REPORT_FILE"
    df -h | awk 'NR>1 {
        usage = substr($5, 1, length($5)-1)
        if (usage > 85) 
            print "ALERT: " $6 " is " $5 " full"
    }' | tee -a "$REPORT_FILE"
    
    # Largest directories
    echo "Largest directories in /:" | tee -a "$REPORT_FILE"
    du -sh /* 2>/dev/null | sort -hr | head -5 | tee -a "$REPORT_FILE"
    
    echo "" | tee -a "$REPORT_FILE"
}

check_network_usage() {
    log_section "Network Usage Analysis"
    
    # Network interfaces
    echo "Network interfaces:" | tee -a "$REPORT_FILE"
    ip addr show | grep -E '^[0-9]+:|inet ' | tee -a "$REPORT_FILE"
    
    # Network connections
    echo "Active network connections:" | tee -a "$REPORT_FILE"
    ss -tuln | head -10 | tee -a "$REPORT_FILE"
    
    # Network statistics
    echo "Network interface statistics:" | tee -a "$REPORT_FILE"
    cat /proc/net/dev | head -3 | tee -a "$REPORT_FILE"
    
    echo "" | tee -a "$REPORT_FILE"
}

check_system_services() {
    log_section "System Services Status"
    
    # Critical services to check
    services=("ssh" "apache2" "nginx" "mysql" "postgresql" "fail2ban")
    
    for service in "${services[@]}"; do
        if systemctl is-active --quiet "$service" 2>/dev/null; then
            echo "✓ $service is running" | tee -a "$REPORT_FILE"
        elif systemctl list-unit-files | grep -q "^$service"; then
            echo "✗ $service is installed but not running" | tee -a "$REPORT_FILE"
        fi
    done
    
    echo "" | tee -a "$REPORT_FILE"
}

check_log_files() {
    log_section "Log File Analysis"
    
    # Check log file sizes
    echo "Large log files (>100MB):" | tee -a "$REPORT_FILE"
    find /var/log -type f -size +100M -exec ls -lh {} \; 2>/dev/null | tee -a "$REPORT_FILE"
    
    # Recent errors
    echo "Recent system errors:" | tee -a "$REPORT_FILE"
    journalctl --since "1 hour ago" --priority=err --no-pager | tail -10 | tee -a "$REPORT_FILE"
    
    echo "" | tee -a "$REPORT_FILE"
}

generate_summary() {
    log_section "Performance Summary"
    
    # System uptime
    echo "System uptime: $(uptime -p)" | tee -a "$REPORT_FILE"
    
    # System load
    echo "System load: $(uptime | awk -F'load average:' '{print $2}')" | tee -a "$REPORT_FILE"
    
    # Memory summary
    echo "Memory: $(free -h | awk 'NR==2{print $3 "/" $2 " (" int($3*100/$2) "%)"}')" | tee -a "$REPORT_FILE"
    
    # Disk summary
    echo "Root disk: $(df -h / | awk 'NR==2{print $3 "/" $2 " (" $5 ")"}')" | tee -a "$REPORT_FILE"
    
    # Recommendations
    echo "" | tee -a "$REPORT_FILE"
    echo "Recommendations:" | tee -a "$REPORT_FILE"
    
    # CPU recommendations
    cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | sed 's/%us,//' | cut -d'.' -f1)
    if [ "$cpu_usage" -gt 80 ]; then
        echo "- Consider optimizing CPU-intensive processes" | tee -a "$REPORT_FILE"
    fi
    
    # Memory recommendations
    memory_usage=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
    if [ "$memory_usage" -gt 80 ]; then
        echo "- Consider adding more RAM or optimizing memory usage" | tee -a "$REPORT_FILE"
    fi
    
    # Disk recommendations
    df -h | awk 'NR>1 {
        usage = substr($5, 1, length($5)-1)
        if (usage > 85) 
            print "- Clean up disk space on " $6
    }' | tee -a "$REPORT_FILE"
    
    echo "" | tee -a "$REPORT_FILE"
}

# Main execution
main() {
    echo "Starting comprehensive performance analysis..."
    echo "Report will be saved to: $REPORT_FILE"
    echo ""
    
    check_cpu_usage
    check_memory_usage
    check_disk_usage
    check_network_usage
    check_system_services
    check_log_files
    generate_summary
    
    echo "Performance analysis completed!"
    echo "Report saved to: $REPORT_FILE"
    
    # Display summary
    echo ""
    echo "=== Quick Summary ==="
    tail -20 "$REPORT_FILE"
}

# Check if running with specific checks
case "${1:-all}" in
    cpu)
        check_cpu_usage
        ;;
    memory)
        check_memory_usage
        ;;
    disk)
        check_disk_usage
        ;;
    network)
        check_network_usage
        ;;
    services)
        check_system_services
        ;;
    logs)
        check_log_files
        ;;
    all)
        main
        ;;
    *)
        echo "Usage: $0 [cpu|memory|disk|network|services|logs|all]"
        exit 1
        ;;
esac
```

## Free Learning Resources

### Web Server Resources
- [Apache HTTP Server Documentation](https://httpd.apache.org/docs/) - Official Apache documentation
- [Nginx Documentation](https://nginx.org/en/docs/) - Official Nginx documentation
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/) - SSL certificate automation

### Database Resources
- [MySQL Documentation](https://dev.mysql.com/doc/) - Official MySQL documentation
- [PostgreSQL Documentation](https://www.postgresql.org/docs/) - Official PostgreSQL documentation
- [MariaDB Knowledge Base](https://mariadb.com/kb/en/) - MariaDB documentation

### Performance Monitoring
- [Linux Performance](http://www.brendangregg.com/linuxperf.html) - Brendan Gregg's performance tools
- [System Performance Tuning](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/monitoring_and_managing_system_status_and_performance/) - Red Hat guide
- [Ubuntu Server Performance](https://ubuntu.com/server/docs/performance-tuning) - Ubuntu performance guide

### Practice Labs
- [VirtualBox](https://www.virtualbox.org/) - Create test environments
- [Vagrant](https://www.vagrantup.com/) - Automated VM provisioning
- [Docker](https://www.docker.com/) - Containerized applications

## Next Steps

After mastering server management and performance:

1. **Practice Regularly**: Set up test environments with multiple services
2. **Learn Automation**: Explore configuration management tools (Ansible, Puppet)
3. **Study Containerization**: Docker and Kubernetes
4. **Explore Monitoring**: Prometheus, Grafana, ELK stack
5. **Join Communities**: 
   - [r/sysadmin](https://www.reddit.com/r/sysadmin/)
   - [Server Fault](https://serverfault.com/)

Congratulations! You've completed the comprehensive Linux Engineering learning path. You now have the skills to:
- Navigate and manage Linux systems effectively
- Administer users, processes, and services
- Write automation scripts
- Configure networking and security
- Manage web servers and databases
- Monitor and optimize system performance

Continue practicing these skills and consider specializing in areas like cloud infrastructure, DevOps, or cybersecurity!
