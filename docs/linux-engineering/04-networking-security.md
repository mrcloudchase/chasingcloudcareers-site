---
sidebar_position: 5
---

# Network Configuration and Security

Master Linux networking fundamentals, security practices, and system hardening techniques.

## Linux Networking Fundamentals

Understanding networking is essential for system administration, troubleshooting, and security.

### Network Interfaces and Configuration

**Understanding Network Interfaces:**
- **Physical interfaces**: eth0, eth1 (Ethernet), wlan0 (WiFi)
- **Virtual interfaces**: lo (loopback), docker0, br0 (bridge)
- **Modern naming**: enp0s3, wlp2s0 (predictable interface names)

**Viewing Network Interfaces:**
```bash
# Modern command (preferred)
ip addr show
# or shorter
ip a

# Legacy command (still widely used)
ifconfig

# Show only active interfaces
ip link show up

# Show specific interface
ip addr show eth0
```

**Understanding Interface Output:**
```bash
ip addr show eth0
# 2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
#     link/ether 08:00:27:12:34:56 brd ff:ff:ff:ff:ff:ff
#     inet 192.168.1.100/24 brd 192.168.1.255 scope global dynamic eth0
#        valid_lft 86400sec preferred_lft 86400sec
```

**Key Information Explained:**
- **UP**: Interface is active
- **mtu 1500**: Maximum Transmission Unit
- **link/ether**: MAC address
- **inet**: IPv4 address with subnet mask (/24)
- **brd**: Broadcast address

### Network Configuration Methods

**Temporary Configuration (lost on reboot):**
```bash
# Assign IP address
sudo ip addr add 192.168.1.100/24 dev eth0

# Bring interface up/down
sudo ip link set eth0 up
sudo ip link set eth0 down

# Add default route
sudo ip route add default via 192.168.1.1

# Add specific route
sudo ip route add 10.0.0.0/8 via 192.168.1.1
```

**Permanent Configuration - Ubuntu/Debian (Netplan):**
```bash
# Edit netplan configuration
sudo nano /etc/netplan/01-network-manager-all.yaml
```

```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    eth0:
      dhcp4: false
      addresses:
        - 192.168.1.100/24
      gateway4: 192.168.1.1
      nameservers:
        addresses:
          - 8.8.8.8
          - 8.8.4.4
```

```bash
# Apply configuration
sudo netplan apply

# Test configuration
sudo netplan try
```

**Permanent Configuration - CentOS/RHEL:**
```bash
# Edit interface configuration
sudo nano /etc/sysconfig/network-scripts/ifcfg-eth0
```

```bash
TYPE=Ethernet
BOOTPROTO=static
NAME=eth0
DEVICE=eth0
ONBOOT=yes
IPADDR=192.168.1.100
NETMASK=255.255.255.0
GATEWAY=192.168.1.1
DNS1=8.8.8.8
DNS2=8.8.4.4
```

```bash
# Restart networking
sudo systemctl restart network
# or on newer systems
sudo systemctl restart NetworkManager
```

### Routing and DNS

**Viewing and Managing Routes:**
```bash
# Show routing table
ip route show
# or
route -n

# Show default route
ip route show default

# Add route
sudo ip route add 10.0.0.0/8 via 192.168.1.1

# Delete route
sudo ip route del 10.0.0.0/8

# Add default route
sudo ip route add default via 192.168.1.1
```

**DNS Configuration:**
```bash
# View current DNS servers
cat /etc/resolv.conf

# Example resolv.conf
nameserver 8.8.8.8
nameserver 8.8.4.4
search example.com

# Test DNS resolution
nslookup google.com
dig google.com
host google.com

# Flush DNS cache (Ubuntu)
sudo systemd-resolve --flush-caches
```

### Network Troubleshooting Tools

**Connectivity Testing:**
```bash
# Test connectivity to host
ping -c 4 google.com

# Test specific port connectivity
telnet google.com 80
# or using nc (netcat)
nc -zv google.com 80

# Trace route to destination
traceroute google.com
# or
tracepath google.com

# Test network path MTU
ping -M do -s 1472 google.com
```

**Network Statistics and Monitoring:**
```bash
# Show network connections
netstat -tuln  # TCP/UDP listening ports
netstat -an    # All connections
ss -tuln       # Modern replacement for netstat

# Show network interface statistics
cat /proc/net/dev
# or
ip -s link show

# Monitor network traffic
iftop          # Install: sudo apt install iftop
nethogs        # Install: sudo apt install nethogs
nload          # Install: sudo apt install nload

# Capture network packets
sudo tcpdump -i eth0
sudo tcpdump -i eth0 port 80
```

**Network Configuration Files:**
```bash
# Important network files
/etc/hosts              # Static hostname to IP mappings
/etc/hostname           # System hostname
/etc/resolv.conf        # DNS configuration
/etc/nsswitch.conf      # Name service switch configuration
/etc/services           # Port to service mappings
```

### Practical Networking Examples

**Example 1: Network Diagnostic Script**
```bash
#!/bin/bash

echo "=== Network Diagnostic Report ==="
echo "Date: $(date)"
echo ""

# System hostname
echo "Hostname: $(hostname)"
echo "FQDN: $(hostname -f 2>/dev/null || echo 'Not configured')"
echo ""

# Network interfaces
echo "=== Network Interfaces ==="
ip addr show | grep -E '^[0-9]+:|inet '
echo ""

# Routing table
echo "=== Routing Table ==="
ip route show
echo ""

# DNS configuration
echo "=== DNS Configuration ==="
cat /etc/resolv.conf
echo ""

# Test connectivity
echo "=== Connectivity Tests ==="
targets=("8.8.8.8" "google.com" "github.com")

for target in "${targets[@]}"; do
    if ping -c 1 -W 2 "$target" >/dev/null 2>&1; then
        echo "✓ $target - Reachable"
    else
        echo "✗ $target - Unreachable"
    fi
done
echo ""

# Active connections
echo "=== Active Network Connections ==="
ss -tuln | head -10
echo ""

# Network usage
echo "=== Network Interface Statistics ==="
cat /proc/net/dev | head -3
```

**Example 2: Port Scanner Script**
```bash
#!/bin/bash

scan_port() {
    local host=$1
    local port=$2
    local timeout=1
    
    if timeout $timeout bash -c "echo >/dev/tcp/$host/$port" 2>/dev/null; then
        echo "Port $port: Open"
        return 0
    else
        echo "Port $port: Closed"
        return 1
    fi
}

scan_host() {
    local host=$1
    shift
    local ports=("$@")
    
    echo "Scanning $host..."
    
    for port in "${ports[@]}"; do
        scan_port "$host" "$port"
    done
}

# Usage example
if [ $# -lt 2 ]; then
    echo "Usage: $0 <host> <port1> [port2] [port3] ..."
    echo "Example: $0 google.com 80 443 22"
    exit 1
fi

host=$1
shift
ports=("$@")

scan_host "$host" "${ports[@]}"
```

## Firewall Configuration

Linux provides several firewall solutions to control network traffic and enhance security.

### Understanding iptables

**iptables Basics:**
- **Tables**: filter, nat, mangle, raw
- **Chains**: INPUT, OUTPUT, FORWARD
- **Targets**: ACCEPT, DROP, REJECT, LOG

**Basic iptables Commands:**
```bash
# View current rules
sudo iptables -L -n -v

# View rules with line numbers
sudo iptables -L --line-numbers

# Save current rules (Ubuntu/Debian)
sudo iptables-save > /etc/iptables/rules.v4

# Restore rules
sudo iptables-restore < /etc/iptables/rules.v4

# Clear all rules (be careful!)
sudo iptables -F
sudo iptables -X
sudo iptables -Z
```

**Common iptables Rules:**
```bash
# Allow loopback traffic
sudo iptables -A INPUT -i lo -j ACCEPT
sudo iptables -A OUTPUT -o lo -j ACCEPT

# Allow established and related connections
sudo iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Allow SSH (port 22)
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# Allow HTTP and HTTPS
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Allow specific IP address
sudo iptables -A INPUT -s 192.168.1.100 -j ACCEPT

# Block specific IP address
sudo iptables -A INPUT -s 192.168.1.200 -j DROP

# Set default policies
sudo iptables -P INPUT DROP
sudo iptables -P FORWARD DROP
sudo iptables -P OUTPUT ACCEPT

# Delete specific rule
sudo iptables -D INPUT 3  # Delete rule number 3
```

### UFW (Uncomplicated Firewall)

UFW is a user-friendly front-end for iptables, commonly used on Ubuntu.

**Basic UFW Commands:**
```bash
# Enable UFW
sudo ufw enable

# Disable UFW
sudo ufw disable

# Check status
sudo ufw status
sudo ufw status verbose

# Reset to defaults
sudo ufw --force reset
```

**UFW Rule Examples:**
```bash
# Allow SSH
sudo ufw allow ssh
# or
sudo ufw allow 22

# Allow HTTP and HTTPS
sudo ufw allow http
sudo ufw allow https
# or
sudo ufw allow 80
sudo ufw allow 443

# Allow specific port range
sudo ufw allow 1000:2000/tcp

# Allow from specific IP
sudo ufw allow from 192.168.1.100

# Allow from specific subnet
sudo ufw allow from 192.168.1.0/24

# Allow specific service from specific IP
sudo ufw allow from 192.168.1.100 to any port 22

# Deny traffic
sudo ufw deny 23  # Deny telnet

# Delete rule
sudo ufw delete allow 80
# or by rule number
sudo ufw status numbered
sudo ufw delete 2
```

**Advanced UFW Configuration:**
```bash
# Set default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow specific interface
sudo ufw allow in on eth0 to any port 22

# Rate limiting (protection against brute force)
sudo ufw limit ssh

# Application profiles
sudo ufw app list
sudo ufw allow 'Apache Full'
sudo ufw allow 'OpenSSH'

# Logging
sudo ufw logging on
sudo ufw logging medium
```

### firewalld (CentOS/RHEL/Fedora)

**Basic firewalld Commands:**
```bash
# Check status
sudo systemctl status firewalld
sudo firewall-cmd --state

# Start/stop firewalld
sudo systemctl start firewalld
sudo systemctl stop firewalld

# Get default zone
sudo firewall-cmd --get-default-zone

# List all zones
sudo firewall-cmd --get-zones

# List active zones
sudo firewall-cmd --get-active-zones

# Get zone information
sudo firewall-cmd --zone=public --list-all
```

**firewalld Rules:**
```bash
# Add service
sudo firewall-cmd --zone=public --add-service=http --permanent
sudo firewall-cmd --zone=public --add-service=https --permanent

# Add port
sudo firewall-cmd --zone=public --add-port=8080/tcp --permanent

# Add source
sudo firewall-cmd --zone=public --add-source=192.168.1.0/24 --permanent

# Remove service/port
sudo firewall-cmd --zone=public --remove-service=http --permanent
sudo firewall-cmd --zone=public --remove-port=8080/tcp --permanent

# Reload configuration
sudo firewall-cmd --reload

# List services and ports
sudo firewall-cmd --zone=public --list-services
sudo firewall-cmd --zone=public --list-ports
```

### Practical Firewall Examples

**Example 1: Secure Web Server Setup**
```bash
#!/bin/bash

# UFW configuration for web server
echo "Configuring firewall for web server..."

# Reset UFW
sudo ufw --force reset

# Set default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH (change port if using non-standard)
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow specific management IP (replace with your IP)
sudo ufw allow from 203.0.113.100 to any port 22

# Rate limit SSH to prevent brute force
sudo ufw limit ssh

# Enable logging
sudo ufw logging on

# Enable UFW
sudo ufw enable

echo "Firewall configured successfully"
sudo ufw status verbose
```

**Example 2: Database Server Firewall**
```bash
#!/bin/bash

# Secure database server (MySQL/PostgreSQL)
echo "Configuring firewall for database server..."

# Reset and set defaults
sudo ufw --force reset
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH from management network only
sudo ufw allow from 192.168.1.0/24 to any port 22

# Allow MySQL from application servers only
sudo ufw allow from 10.0.1.0/24 to any port 3306

# Allow PostgreSQL from application servers only
sudo ufw allow from 10.0.1.0/24 to any port 5432

# Enable and show status
sudo ufw enable
sudo ufw status verbose
```

## System Security and Hardening

Securing a Linux system involves multiple layers of protection and following security best practices.

### User and Access Security

**Password Security:**
```bash
# Set password policies
sudo nano /etc/login.defs

# Key settings:
PASS_MAX_DAYS   90      # Maximum password age
PASS_MIN_DAYS   1       # Minimum password age
PASS_WARN_AGE   7       # Warning days before expiration
PASS_MIN_LEN    8       # Minimum password length

# Install and configure PAM for password complexity
sudo apt install libpam-pwquality  # Ubuntu/Debian
# or
sudo yum install libpwquality      # CentOS/RHEL

# Configure password complexity
sudo nano /etc/security/pwquality.conf

# Example settings:
minlen = 12
minclass = 3
maxrepeat = 2
dcredit = -1    # At least 1 digit
ucredit = -1    # At least 1 uppercase
lcredit = -1    # At least 1 lowercase
ocredit = -1    # At least 1 special character
```

**Account Security:**
```bash
# Lock user account
sudo usermod -L username
# or
sudo passwd -l username

# Unlock user account
sudo usermod -U username
# or
sudo passwd -u username

# Set account expiration
sudo chage -E 2024-12-31 username

# Force password change on next login
sudo chage -d 0 username

# View account aging information
sudo chage -l username

# Disable unused accounts
sudo usermod -s /sbin/nologin username

# Remove user from sudo group
sudo deluser username sudo  # Ubuntu/Debian
# or
sudo gpasswd -d username wheel  # CentOS/RHEL
```

**SSH Security:**
```bash
# Edit SSH configuration
sudo nano /etc/ssh/sshd_config

# Recommended security settings:
Port 2222                          # Change default port
PermitRootLogin no                  # Disable root login
PasswordAuthentication no           # Use key-based auth only
PubkeyAuthentication yes            # Enable public key auth
MaxAuthTries 3                      # Limit authentication attempts
ClientAliveInterval 300             # Client timeout
ClientAliveCountMax 2               # Max client alive messages
AllowUsers user1 user2              # Limit allowed users
DenyUsers baduser                   # Deny specific users
Protocol 2                          # Use SSH protocol 2 only

# Restart SSH service
sudo systemctl restart sshd
```

**SSH Key Management:**
```bash
# Generate SSH key pair
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
# or for better security
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy public key to server
ssh-copy-id -i ~/.ssh/id_rsa.pub user@server
# or manually
cat ~/.ssh/id_rsa.pub | ssh user@server 'mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys'

# Set proper permissions
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub

# Use SSH agent for key management
eval $(ssh-agent)
ssh-add ~/.ssh/id_rsa

# SSH config for easier connections
nano ~/.ssh/config

# Example config:
Host webserver
    HostName 192.168.1.100
    User admin
    Port 2222
    IdentityFile ~/.ssh/webserver_key
```

### File System Security

**File Permissions and Attributes:**
```bash
# Set secure permissions for important files
sudo chmod 600 /etc/shadow
sudo chmod 644 /etc/passwd
sudo chmod 644 /etc/group
sudo chmod 600 /etc/gshadow

# Set immutable attribute (prevents modification)
sudo chattr +i /etc/passwd
sudo chattr +i /etc/shadow

# View file attributes
lsattr /etc/passwd

# Remove immutable attribute
sudo chattr -i /etc/passwd

# Find files with SUID/SGID bits
find / -type f \( -perm -4000 -o -perm -2000 \) -exec ls -l {} \; 2>/dev/null

# Find world-writable files
find / -type f -perm -002 -exec ls -l {} \; 2>/dev/null

# Find files without owner
find / -nouser -o -nogroup 2>/dev/null
```

**Access Control Lists (ACLs):**
```bash
# Install ACL support
sudo apt install acl  # Ubuntu/Debian

# Set ACL permissions
setfacl -m u:username:rw file.txt      # User permissions
setfacl -m g:groupname:r file.txt      # Group permissions
setfacl -m o::--- file.txt             # Other permissions

# View ACL permissions
getfacl file.txt

# Remove ACL
setfacl -b file.txt

# Set default ACL for directory
setfacl -d -m u:username:rwx /path/to/directory
```

### System Monitoring and Auditing

**System Logging:**
```bash
# Important log files
/var/log/auth.log       # Authentication logs
/var/log/syslog         # System messages
/var/log/kern.log       # Kernel messages
/var/log/secure         # Security logs (CentOS/RHEL)
/var/log/messages       # General messages (CentOS/RHEL)

# Monitor authentication attempts
sudo tail -f /var/log/auth.log

# Search for failed login attempts
grep "Failed password" /var/log/auth.log

# Search for successful logins
grep "Accepted password" /var/log/auth.log

# Monitor system logs in real-time
sudo journalctl -f

# View logs for specific service
sudo journalctl -u ssh.service

# View logs for specific time period
sudo journalctl --since "2024-01-15 10:00:00"
```

**Process Monitoring:**
```bash
# Monitor running processes
ps aux | grep -v "$(whoami)"  # Processes not owned by current user

# Find processes listening on network ports
sudo netstat -tulpn
# or
sudo ss -tulpn

# Monitor system calls (advanced)
sudo strace -p PID

# Monitor file access
sudo lsof +D /etc  # Files open in /etc directory
sudo lsof -i :22   # Processes using port 22
```

**Intrusion Detection:**
```bash
# Install and configure fail2ban
sudo apt install fail2ban  # Ubuntu/Debian

# Configure fail2ban
sudo nano /etc/fail2ban/jail.local

# Example configuration:
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3

# Start fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Check fail2ban status
sudo fail2ban-client status
sudo fail2ban-client status sshd

# Unban IP address
sudo fail2ban-client set sshd unbanip 192.168.1.100
```

### Security Scanning and Assessment

**Port Scanning (from another system):**
```bash
# Install nmap
sudo apt install nmap

# Basic port scan
nmap target_ip

# Scan specific ports
nmap -p 22,80,443 target_ip

# Scan port range
nmap -p 1-1000 target_ip

# Service version detection
nmap -sV target_ip

# OS detection
nmap -O target_ip

# Aggressive scan (use carefully)
nmap -A target_ip
```

**Vulnerability Assessment:**
```bash
# Install lynis (security auditing tool)
sudo apt install lynis

# Run security audit
sudo lynis audit system

# Check for rootkits
sudo apt install rkhunter
sudo rkhunter --check

# Check for malware
sudo apt install clamav
sudo freshclam  # Update virus definitions
sudo clamscan -r /home  # Scan home directory
```

### Practical Security Examples

**Example 1: Security Hardening Script**
```bash
#!/bin/bash

echo "=== Linux Security Hardening Script ==="

# Update system
echo "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install security tools
echo "Installing security tools..."
sudo apt install -y fail2ban ufw rkhunter lynis

# Configure SSH security
echo "Hardening SSH configuration..."
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup

# SSH hardening settings
sudo sed -i 's/#PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo sed -i 's/#MaxAuthTries 6/MaxAuthTries 3/' /etc/ssh/sshd_config

# Restart SSH
sudo systemctl restart sshd

# Configure firewall
echo "Configuring firewall..."
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw --force enable

# Configure fail2ban
echo "Configuring fail2ban..."
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Set file permissions
echo "Setting secure file permissions..."
sudo chmod 600 /etc/shadow
sudo chmod 644 /etc/passwd

# Disable unused services
echo "Disabling unused services..."
services_to_disable=("telnet" "rsh" "rlogin")
for service in "${services_to_disable[@]}"; do
    if systemctl is-enabled "$service" 2>/dev/null; then
        sudo systemctl disable "$service"
        echo "Disabled $service"
    fi
done

# Configure automatic updates (Ubuntu/Debian)
echo "Configuring automatic security updates..."
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades

echo "Security hardening completed!"
echo "Please reboot the system to ensure all changes take effect."
```

**Example 2: Security Monitoring Script**
```bash
#!/bin/bash

LOG_FILE="/var/log/security_monitor.log"

log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"
}

check_failed_logins() {
    local failed_count=$(grep "Failed password" /var/log/auth.log | wc -l)
    if [ "$failed_count" -gt 10 ]; then
        log_message "WARNING: $failed_count failed login attempts detected"
    fi
}

check_root_logins() {
    local root_logins=$(grep "session opened for user root" /var/log/auth.log | wc -l)
    if [ "$root_logins" -gt 0 ]; then
        log_message "WARNING: $root_logins root login sessions detected"
    fi
}

check_new_users() {
    local new_users=$(find /home -maxdepth 1 -type d -mtime -1 | wc -l)
    if [ "$new_users" -gt 1 ]; then  # Subtract 1 for /home itself
        log_message "INFO: New user directories created in last 24 hours"
    fi
}

check_suspicious_processes() {
    # Check for processes running as root that shouldn't be
    suspicious_procs=$(ps aux | awk '$1=="root" && $11!~/^\[/ && $11!~/^\//' | wc -l)
    if [ "$suspicious_procs" -gt 20 ]; then
        log_message "WARNING: High number of root processes: $suspicious_procs"
    fi
}

check_network_connections() {
    # Check for unusual network connections
    external_connections=$(netstat -an | grep ESTABLISHED | grep -v "127.0.0.1\|::1" | wc -l)
    if [ "$external_connections" -gt 50 ]; then
        log_message "WARNING: High number of external connections: $external_connections"
    fi
}

# Main monitoring
log_message "Starting security monitoring check"

check_failed_logins
check_root_logins
check_new_users
check_suspicious_processes
check_network_connections

log_message "Security monitoring check completed"
```

## Hands-on Exercise: Complete Network Security Setup

Create a comprehensive network security configuration:

```bash
#!/bin/bash

#############################################
# Complete Network Security Setup Script
# Description: Configure networking and security
# Version: 1.0
#############################################

set -euo pipefail

LOG_FILE="/tmp/network_security_setup.log"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"
}

# Network configuration function
configure_network() {
    log "Configuring network settings..."
    
    # Backup current configuration
    sudo cp /etc/netplan/01-network-manager-all.yaml /etc/netplan/01-network-manager-all.yaml.backup 2>/dev/null || true
    
    # Create static IP configuration (modify as needed)
    cat > /tmp/network-config.yaml << EOF
network:
  version: 2
  renderer: networkd
  ethernets:
    eth0:
      dhcp4: true
      dhcp6: false
      nameservers:
        addresses:
          - 8.8.8.8
          - 8.8.4.4
          - 1.1.1.1
EOF
    
    log "Network configuration created (DHCP with custom DNS)"
}

# Firewall configuration
configure_firewall() {
    log "Configuring UFW firewall..."
    
    # Reset UFW
    sudo ufw --force reset
    
    # Set default policies
    sudo ufw default deny incoming
    sudo ufw default allow outgoing
    
    # Allow SSH (modify port as needed)
    sudo ufw allow 22/tcp
    
    # Allow common services (uncomment as needed)
    # sudo ufw allow 80/tcp   # HTTP
    # sudo ufw allow 443/tcp  # HTTPS
    # sudo ufw allow 53/udp   # DNS
    
    # Rate limit SSH
    sudo ufw limit ssh
    
    # Enable logging
    sudo ufw logging on
    
    # Enable firewall
    sudo ufw --force enable
    
    log "Firewall configured successfully"
}

# SSH hardening
harden_ssh() {
    log "Hardening SSH configuration..."
    
    # Backup SSH config
    sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup
    
    # Create hardened SSH config
    sudo tee /etc/ssh/sshd_config.new > /dev/null << EOF
# Hardened SSH Configuration
Port 22
Protocol 2

# Authentication
PermitRootLogin no
PasswordAuthentication yes  # Change to 'no' after setting up key auth
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys

# Security settings
MaxAuthTries 3
MaxSessions 2
LoginGraceTime 60
ClientAliveInterval 300
ClientAliveCountMax 2

# Disable unused features
X11Forwarding no
AllowTcpForwarding no
GatewayPorts no
PermitTunnel no

# Logging
SyslogFacility AUTH
LogLevel INFO

# Allow only specific users (modify as needed)
# AllowUsers admin user1 user2
EOF
    
    # Validate SSH config
    if sudo sshd -t -f /etc/ssh/sshd_config.new; then
        sudo mv /etc/ssh/sshd_config.new /etc/ssh/sshd_config
        log "SSH configuration updated successfully"
    else
        log "ERROR: SSH configuration validation failed"
        sudo rm /etc/ssh/sshd_config.new
        return 1
    fi
}

# Install security tools
install_security_tools() {
    log "Installing security tools..."
    
    # Update package list
    sudo apt update
    
    # Install security packages
    sudo apt install -y \
        fail2ban \
        ufw \
        rkhunter \
        lynis \
        unattended-upgrades \
        logwatch \
        aide
    
    log "Security tools installed"
}

# Configure fail2ban
configure_fail2ban() {
    log "Configuring fail2ban..."
    
    # Create fail2ban local configuration
    sudo tee /etc/fail2ban/jail.local > /dev/null << EOF
[DEFAULT]
# Ban time in seconds (1 hour)
bantime = 3600

# Time window to count failures (10 minutes)
findtime = 600

# Number of failures before ban
maxretry = 3

# Email notifications (configure as needed)
# destemail = admin@example.com
# sendername = Fail2Ban
# mta = sendmail

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 7200

[apache-auth]
enabled = false
port = http,https
filter = apache-auth
logpath = /var/log/apache2/*error.log
maxretry = 6

[apache-noscript]
enabled = false
port = http,https
filter = apache-noscript
logpath = /var/log/apache2/*access.log
maxretry = 6
EOF
    
    # Enable and start fail2ban
    sudo systemctl enable fail2ban
    sudo systemctl restart fail2ban
    
    log "Fail2ban configured and started"
}

# System hardening
system_hardening() {
    log "Applying system hardening..."
    
    # Disable unused network protocols
    echo "install dccp /bin/true" | sudo tee -a /etc/modprobe.d/blacklist-rare-network.conf
    echo "install sctp /bin/true" | sudo tee -a /etc/modprobe.d/blacklist-rare-network.conf
    echo "install rds /bin/true" | sudo tee -a /etc/modprobe.d/blacklist-rare-network.conf
    echo "install tipc /bin/true" | sudo tee -a /etc/modprobe.d/blacklist-rare-network.conf
    
    # Kernel security parameters
    sudo tee /etc/sysctl.d/99-security.conf > /dev/null << EOF
# IP Spoofing protection
net.ipv4.conf.default.rp_filter = 1
net.ipv4.conf.all.rp_filter = 1

# Ignore ICMP redirects
net.ipv4.conf.all.accept_redirects = 0
net.ipv6.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0
net.ipv6.conf.default.accept_redirects = 0

# Ignore send redirects
net.ipv4.conf.all.send_redirects = 0
net.ipv4.conf.default.send_redirects = 0

# Disable source packet routing
net.ipv4.conf.all.accept_source_route = 0
net.ipv6.conf.all.accept_source_route = 0
net.ipv4.conf.default.accept_source_route = 0
net.ipv6.conf.default.accept_source_route = 0

# Log Martians
net.ipv4.conf.all.log_martians = 1
net.ipv4.conf.default.log_martians = 1

# Ignore ICMP ping requests
net.ipv4.icmp_echo_ignore_all = 0

# Ignore Directed pings
net.ipv4.icmp_echo_ignore_broadcasts = 1

# Disable IPv6 if not needed
# net.ipv6.conf.all.disable_ipv6 = 1
# net.ipv6.conf.default.disable_ipv6 = 1
EOF
    
    # Apply sysctl settings
    sudo sysctl -p /etc/sysctl.d/99-security.conf
    
    log "System hardening applied"
}

# Create monitoring script
create_monitoring_script() {
    log "Creating security monitoring script..."
    
    sudo tee /usr/local/bin/security_monitor.sh > /dev/null << 'EOF'
#!/bin/bash

ALERT_EMAIL="admin@example.com"  # Configure as needed
LOG_FILE="/var/log/security_monitor.log"

log_alert() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ALERT: $*" | tee -a "$LOG_FILE"
    # Uncomment to send email alerts
    # echo "$*" | mail -s "Security Alert - $(hostname)" "$ALERT_EMAIL"
}

# Check for failed SSH attempts
failed_ssh=$(grep "Failed password" /var/log/auth.log | grep "$(date '+%b %d')" | wc -l)
if [ "$failed_ssh" -gt 10 ]; then
    log_alert "High number of SSH failures today: $failed_ssh"
fi

# Check for new users
new_users=$(awk -F: '$3 >= 1000 && $3 < 65534 {print $1}' /etc/passwd | wc -l)
if [ "$new_users" -gt 5 ]; then  # Adjust threshold as needed
    log_alert "High number of user accounts: $new_users"
fi

# Check disk usage
disk_usage=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$disk_usage" -gt 90 ]; then
    log_alert "High disk usage: ${disk_usage}%"
fi

# Check for suspicious processes
suspicious_procs=$(ps aux | grep -E "(nc|netcat|ncat)" | grep -v grep | wc -l)
if [ "$suspicious_procs" -gt 0 ]; then
    log_alert "Suspicious network tools detected: $suspicious_procs processes"
fi

# Check system load
load_avg=$(uptime | awk -F'load average:' '{print $2}' | awk '{print $1}' | sed 's/,//')
if (( $(echo "$load_avg > 5.0" | bc -l) )); then
    log_alert "High system load: $load_avg"
fi
EOF
    
    sudo chmod +x /usr/local/bin/security_monitor.sh
    
    # Add to crontab for regular monitoring
    (crontab -l 2>/dev/null; echo "*/15 * * * * /usr/local/bin/security_monitor.sh") | crontab -
    
    log "Security monitoring script created and scheduled"
}

# Generate security report
generate_report() {
    log "Generating security configuration report..."
    
    cat > /tmp/security_report.txt << EOF
=== Network Security Configuration Report ===
Generated: $(date)
Hostname: $(hostname)

=== Network Configuration ===
$(ip addr show | grep -E '^[0-9]+:|inet ')

=== Firewall Status ===
$(sudo ufw status verbose)

=== SSH Configuration ===
Port: $(grep "^Port" /etc/ssh/sshd_config || echo "22 (default)")
Root Login: $(grep "^PermitRootLogin" /etc/ssh/sshd_config || echo "Not explicitly set")
Password Auth: $(grep "^PasswordAuthentication" /etc/ssh/sshd_config || echo "Not explicitly set")

=== Fail2ban Status ===
$(sudo fail2ban-client status 2>/dev/null || echo "Fail2ban not running")

=== Active Network Connections ===
$(ss -tuln | head -10)

=== Security Tools Installed ===
$(dpkg -l | grep -E "(fail2ban|ufw|rkhunter|lynis)" | awk '{print $2, $3}')

=== Recommendations ===
1. Configure SSH key-based authentication
2. Change default SSH port if needed
3. Set up log monitoring and alerting
4. Regular security updates
5. Periodic security audits with lynis
EOF
    
    log "Security report generated: /tmp/security_report.txt"
    cat /tmp/security_report.txt
}

# Main execution
main() {
    log "Starting network security setup..."
    
    # Check if running as root or with sudo
    if [ "$EUID" -eq 0 ]; then
        log "ERROR: Don't run this script as root. Use sudo for individual commands."
        exit 1
    fi
    
    # Install security tools
    install_security_tools
    
    # Configure network (commented out to avoid disruption)
    # configure_network
    
    # Configure firewall
    configure_firewall
    
    # Harden SSH
    harden_ssh
    
    # Configure fail2ban
    configure_fail2ban
    
    # Apply system hardening
    system_hardening
    
    # Create monitoring script
    create_monitoring_script
    
    # Generate report
    generate_report
    
    log "Network security setup completed successfully!"
    echo ""
    echo "IMPORTANT: Please review the configuration and test SSH connectivity"
    echo "before closing your current session!"
}

# Run main function
main "$@"
```

## Free Learning Resources

### Networking Resources
- [Linux Network Administration Guide](https://tldp.org/LDP/nag2/index.html) - Comprehensive networking guide
- [Netfilter/iptables Tutorial](https://www.netfilter.org/documentation/HOWTO/netfilter-hacking-HOWTO.html)
- [TCP/IP Illustrated](https://www.tcpipguide.com/) - Free online TCP/IP guide

### Security Resources
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework) - Security best practices
- [CIS Controls](https://www.cisecurity.org/controls/) - Critical security controls
- [OWASP Security Guidelines](https://owasp.org/) - Web application security

### Practice Labs
- [VulnHub](https://www.vulnhub.com/) - Vulnerable VMs for practice
- [OverTheWire Security Games](https://overthewire.org/wargames/) - Security challenges
- [PentesterLab](https://pentesterlab.com/) - Web application security

### Documentation
- [Ubuntu Security Guide](https://ubuntu.com/security) - Ubuntu-specific security
- [Red Hat Security Guide](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/security_hardening/) - Enterprise security
- [Arch Linux Security](https://wiki.archlinux.org/title/Security) - Comprehensive security wiki

## Next Steps

After mastering networking and security:

1. **Practice Regularly**: Set up test environments and practice configurations
2. **Learn Advanced Topics**: VPNs, network monitoring, intrusion detection
3. **Explore Containers**: Docker networking and security
4. **Study Compliance**: PCI DSS, HIPAA, SOX requirements
5. **Join Communities**: 
   - [r/netsec](https://www.reddit.com/r/netsec/)
   - [Information Security Stack Exchange](https://security.stackexchange.com/)

Continue to **Server Management and Performance** to learn about web servers, databases, and system optimization!
