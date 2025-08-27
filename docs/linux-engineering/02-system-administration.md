---
sidebar_position: 3
---

# System Administration

Learn essential system administration skills including user management, process control, and system monitoring.

## User and Group Management

Understanding user and group management is crucial for maintaining secure, multi-user Linux systems.

### Understanding Users and Groups

**Users in Linux:**
- **Root User**: Superuser with unlimited privileges (UID 0)
- **System Users**: Used by services and daemons (UID 1-999)
- **Regular Users**: Human users (UID 1000+)

**Groups:**
- **Primary Group**: User's main group (specified in /etc/passwd)
- **Secondary Groups**: Additional groups user belongs to
- **System Groups**: Used by system services

### Key System Files

**`/etc/passwd`** - User account information
```bash
# View user information
cat /etc/passwd

# Example line:
# john:x:1001:1001:John Doe:/home/john:/bin/bash
# Format: username:password:UID:GID:full_name:home_dir:shell
```

**`/etc/group`** - Group information
```bash
# View group information
cat /etc/group

# Example line:
# developers:x:1002:john,jane,bob
# Format: group_name:password:GID:members
```

**`/etc/shadow`** - Encrypted passwords (root access only)
```bash
# View shadow file (requires sudo)
sudo cat /etc/shadow

# Contains encrypted passwords and password policies
```

### User Management Commands

**Adding Users**
```bash
# Add new user (interactive)
sudo adduser newuser

# Add user with specific options
sudo useradd -m -s /bin/bash -c "Full Name" username

# Options explained:
# -m: Create home directory
# -s: Specify shell
# -c: Add comment (full name)
# -d: Specify home directory path
# -g: Specify primary group
# -G: Specify secondary groups
```

**Modifying Users**
```bash
# Change user's full name
sudo usermod -c "New Full Name" username

# Change user's shell
sudo usermod -s /bin/zsh username

# Add user to group
sudo usermod -a -G groupname username

# Change user's home directory
sudo usermod -d /new/home/path -m username

# Lock user account
sudo usermod -L username

# Unlock user account
sudo usermod -U username
```

**Deleting Users**
```bash
# Delete user (keep home directory)
sudo userdel username

# Delete user and home directory
sudo userdel -r username

# Force deletion (even if user is logged in)
sudo userdel -f username
```

**Password Management**
```bash
# Change your own password
passwd

# Change another user's password (as root)
sudo passwd username

# Set password expiration
sudo passwd -e username  # Force change on next login

# Lock/unlock account
sudo passwd -l username  # Lock
sudo passwd -u username  # Unlock

# View password status
sudo passwd -S username
```

### Group Management Commands

**Creating Groups**
```bash
# Create new group
sudo groupadd developers

# Create group with specific GID
sudo groupadd -g 2000 admins

# Create system group
sudo groupadd -r systemgroup
```

**Modifying Groups**
```bash
# Add user to group
sudo gpasswd -a username groupname

# Remove user from group
sudo gpasswd -d username groupname

# Set group administrators
sudo gpasswd -A admin1,admin2 groupname

# Change group name
sudo groupmod -n newname oldname
```

**Deleting Groups**
```bash
# Delete group
sudo groupdel groupname

# Note: Cannot delete if it's a user's primary group
```

### Practical User Management Examples

**Example 1: Setting up a Development Team**
```bash
# 1. Create developers group
sudo groupadd developers

# 2. Create shared directory
sudo mkdir /opt/projects
sudo chown root:developers /opt/projects
sudo chmod 775 /opt/projects

# 3. Add users to developers group
sudo usermod -a -G developers alice
sudo usermod -a -G developers bob
sudo usermod -a -G developers charlie

# 4. Verify group membership
groups alice
id alice
```

**Example 2: Creating Service Account**
```bash
# Create system user for web service
sudo useradd -r -s /bin/false -d /var/www webservice

# Set up directory with proper ownership
sudo mkdir -p /var/www
sudo chown webservice:webservice /var/www
sudo chmod 755 /var/www
```

### Hands-on Exercise: User Management

```bash
# 1. Create test users and groups
sudo groupadd testgroup
sudo useradd -m -G testgroup testuser1
sudo useradd -m -G testgroup testuser2

# 2. Set passwords
sudo passwd testuser1
sudo passwd testuser2

# 3. Create shared directory
sudo mkdir /tmp/shared
sudo chown root:testgroup /tmp/shared
sudo chmod 775 /tmp/shared

# 4. Test access (switch users)
sudo su - testuser1
# Create file in shared directory
touch /tmp/shared/user1_file.txt
exit

# 5. Verify and clean up
ls -la /tmp/shared/
sudo userdel -r testuser1
sudo userdel -r testuser2
sudo groupdel testgroup
```

## Process Management

Understanding and managing processes is essential for system administration and troubleshooting.

### Understanding Processes

**What is a Process?**
- Running instance of a program
- Has unique Process ID (PID)
- Consumes system resources (CPU, memory)
- Has parent-child relationships

**Process States:**
- **Running (R)**: Currently executing
- **Sleeping (S)**: Waiting for event
- **Stopped (T)**: Suspended
- **Zombie (Z)**: Finished but not cleaned up
- **Uninterruptible Sleep (D)**: Waiting for I/O

### Viewing Processes

**`ps` Command - Process Status**
```bash
# Show processes for current user
ps

# Show all processes (BSD style)
ps aux

# Show all processes (System V style)
ps -ef

# Show process tree
ps -ef --forest
# or
pstree

# Show processes for specific user
ps -u username

# Show specific process
ps -p PID
```

**Understanding ps Output:**
```bash
ps aux
# USER  PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
# john 1234  0.5  2.1  12345  6789 pts/0    S    10:30   0:05 firefox
```

**Fields Explained:**
- **USER**: Process owner
- **PID**: Process ID
- **%CPU**: CPU usage percentage
- **%MEM**: Memory usage percentage
- **VSZ**: Virtual memory size
- **RSS**: Resident set size (physical memory)
- **TTY**: Terminal associated with process
- **STAT**: Process state
- **START**: Start time
- **TIME**: CPU time used
- **COMMAND**: Command that started process

**`top` Command - Real-time Process Monitoring**
```bash
# Start top
top

# Useful top commands while running:
# q - quit
# k - kill process (enter PID)
# r - renice process (change priority)
# P - sort by CPU usage
# M - sort by memory usage
# 1 - show individual CPU cores
# h - help
```

**`htop` - Enhanced Process Viewer**
```bash
# Install htop (if not available)
sudo apt update && sudo apt install htop

# Run htop
htop

# Features:
# - Colored output
# - Mouse support
# - Easy process killing
# - System resource graphs
```

### Managing Processes

**Starting Processes**
```bash
# Run command in foreground
firefox

# Run command in background
firefox &

# Run command and disconnect from terminal
nohup long_running_command &

# Start with specific priority (nice value)
nice -n 10 cpu_intensive_task
```

**Process Control with Job Control**
```bash
# Start process
sleep 100

# Suspend process (Ctrl+Z)
# [1]+  Stopped    sleep 100

# List jobs
jobs

# Resume in background
bg %1

# Resume in foreground  
fg %1

# Kill job
kill %1
```

**Killing Processes**
```bash
# Kill by PID (TERM signal)
kill PID

# Force kill (KILL signal)
kill -9 PID
# or
kill -KILL PID

# Kill by process name
killall firefox

# Kill processes by pattern
pkill -f "python script.py"

# Interactive process killer
sudo pkill -u username
```

**Common Signals:**
- **TERM (15)**: Polite termination request (default)
- **KILL (9)**: Force termination (cannot be ignored)
- **HUP (1)**: Hangup (often reloads configuration)
- **INT (2)**: Interrupt (Ctrl+C)
- **STOP (19)**: Suspend process
- **CONT (18)**: Continue suspended process

### Process Priority and Nice Values

**Understanding Priority:**
- Nice values range from -20 (highest priority) to 19 (lowest priority)
- Default nice value is 0
- Only root can set negative nice values

**Changing Priority:**
```bash
# Start with specific nice value
nice -n 5 command

# Change priority of running process
renice 10 PID

# Change priority by process name
renice 5 -p $(pgrep firefox)
```

### Practical Process Management Examples

**Example 1: Finding Resource-Heavy Processes**
```bash
# Find processes using most CPU
ps aux --sort=-%cpu | head -10

# Find processes using most memory
ps aux --sort=-%mem | head -10

# Find processes by name
pgrep -l firefox
```

**Example 2: Managing Runaway Process**
```bash
# 1. Identify the problem process
top
# Look for high CPU/memory usage

# 2. Get detailed information
ps -p PID -o pid,ppid,cmd,%cpu,%mem

# 3. Try graceful termination first
kill PID

# 4. If that doesn't work, force kill
kill -9 PID

# 5. Verify it's gone
ps -p PID
```

### Hands-on Exercise: Process Management

```bash
# 1. Start some test processes
sleep 300 &
sleep 400 &
yes > /dev/null &  # CPU intensive process

# 2. Monitor processes
jobs
ps aux | grep sleep
top  # Press 'q' to quit

# 3. Practice process control
# Suspend a process
kill -STOP $(pgrep sleep | head -1)

# Resume it
kill -CONT $(pgrep sleep | head -1)

# 4. Clean up
killall sleep
killall yes
```

## System Monitoring

Effective system monitoring helps maintain system health and troubleshoot issues.

### System Resource Monitoring

**CPU Monitoring**
```bash
# Real-time CPU usage
top
htop

# CPU information
cat /proc/cpuinfo
lscpu

# Load average
uptime
cat /proc/loadavg

# CPU usage over time
sar -u 1 5  # 1 second intervals, 5 times
```

**Memory Monitoring**
```bash
# Memory usage summary
free -h

# Detailed memory information
cat /proc/meminfo

# Memory usage by process
ps aux --sort=-%mem | head -10

# Real-time memory monitoring
watch -n 1 'free -h'
```

**Disk Usage Monitoring**
```bash
# Disk space usage by filesystem
df -h

# Directory space usage
du -h /path/to/directory

# Find largest directories
du -h / 2>/dev/null | sort -rh | head -10

# Disk I/O statistics
iostat -x 1 5

# Real-time disk usage
iotop  # May need to install: sudo apt install iotop
```

**Network Monitoring**
```bash
# Network interface statistics
ip addr show
ifconfig  # Legacy command

# Network connections
netstat -tuln
ss -tuln  # Modern replacement for netstat

# Network traffic
iftop  # Install: sudo apt install iftop
nethogs  # Install: sudo apt install nethogs

# Ping and connectivity
ping -c 4 google.com
traceroute google.com
```

### System Logs

**Log File Locations**
```bash
# System logs directory
ls -la /var/log/

# Common log files:
/var/log/syslog      # General system messages
/var/log/auth.log    # Authentication logs
/var/log/kern.log    # Kernel messages
/var/log/dmesg       # Boot messages
/var/log/apache2/    # Web server logs (if installed)
/var/log/mysql/      # Database logs (if installed)
```

**Viewing Logs**
```bash
# View recent system messages
tail -f /var/log/syslog

# View boot messages
dmesg | less

# View authentication attempts
sudo tail -f /var/log/auth.log

# Search logs for specific patterns
grep "error" /var/log/syslog
grep "failed" /var/log/auth.log
```

**Using journalctl (systemd systems)**
```bash
# View all journal entries
journalctl

# Follow journal in real-time
journalctl -f

# View logs for specific service
journalctl -u ssh.service

# View logs for specific time period
journalctl --since "2024-01-15 10:00:00"
journalctl --since "1 hour ago"

# View logs with specific priority
journalctl -p err  # Error level and above
```

### System Performance Tools

**`vmstat` - Virtual Memory Statistics**
```bash
# Display current stats
vmstat

# Continuous monitoring (1 second intervals)
vmstat 1

# Display in MB
vmstat -S M 1
```

**`iostat` - I/O Statistics**
```bash
# Display I/O statistics
iostat

# Continuous monitoring with extended stats
iostat -x 1

# Display specific device
iostat -x sda 1
```

**`sar` - System Activity Reporter**
```bash
# CPU utilization
sar -u 1 5

# Memory utilization
sar -r 1 5

# Network statistics
sar -n DEV 1 5

# I/O statistics
sar -b 1 5
```

### Practical Monitoring Examples

**Example 1: Investigating High Load**
```bash
# 1. Check load average
uptime

# 2. Identify CPU-heavy processes
top -o %CPU

# 3. Check I/O wait
iostat -x 1

# 4. Look for disk space issues
df -h

# 5. Check memory usage
free -h
```

**Example 2: Monitoring Script**
```bash
#!/bin/bash
# Simple system monitoring script

echo "=== System Monitor Report ==="
echo "Date: $(date)"
echo ""

echo "=== Load Average ==="
uptime

echo ""
echo "=== Memory Usage ==="
free -h

echo ""
echo "=== Disk Usage ==="
df -h

echo ""
echo "=== Top 5 CPU Processes ==="
ps aux --sort=-%cpu | head -6

echo ""
echo "=== Top 5 Memory Processes ==="
ps aux --sort=-%mem | head -6
```

### Hands-on Exercise: System Monitoring

```bash
# 1. Create monitoring directory
mkdir ~/monitoring_practice
cd ~/monitoring_practice

# 2. Create the monitoring script above
nano system_monitor.sh
chmod +x system_monitor.sh

# 3. Run monitoring commands
./system_monitor.sh

# 4. Generate some load for testing
# Terminal 1: CPU load
yes > /dev/null &

# Terminal 2: Memory usage (be careful with size)
python3 -c "
import time
data = []
for i in range(100000):
    data.append('x' * 1000)
    if i % 10000 == 0:
        print(f'Allocated {i} blocks')
    time.sleep(0.01)
"

# 5. Monitor the impact
top
htop
./system_monitor.sh

# 6. Clean up
killall yes
# Stop the Python script with Ctrl+C
```

## Service Management with systemd

Modern Linux distributions use systemd to manage system services.

### Understanding systemd

**What is systemd?**
- System and service manager for Linux
- Replaces traditional init systems
- Manages services, mount points, devices, and more
- Uses unit files to define services

**Unit Types:**
- **service**: System services (daemons)
- **target**: Groups of units (like runlevels)
- **mount**: Mount points
- **timer**: Scheduled tasks (like cron)
- **socket**: Network sockets

### Managing Services

**Basic Service Commands**
```bash
# Start a service
sudo systemctl start service_name

# Stop a service
sudo systemctl stop service_name

# Restart a service
sudo systemctl restart service_name

# Reload service configuration
sudo systemctl reload service_name

# Enable service (start at boot)
sudo systemctl enable service_name

# Disable service (don't start at boot)
sudo systemctl disable service_name

# Check service status
systemctl status service_name
```

**Viewing Services**
```bash
# List all services
systemctl list-units --type=service

# List enabled services
systemctl list-unit-files --type=service --state=enabled

# List failed services
systemctl --failed

# List all unit files
systemctl list-unit-files
```

### Common Service Examples

**SSH Service Management**
```bash
# Check SSH service status
systemctl status ssh

# Start SSH service
sudo systemctl start ssh

# Enable SSH to start at boot
sudo systemctl enable ssh

# View SSH service logs
journalctl -u ssh.service
```

**Web Server Management (Apache)**
```bash
# Install Apache (if needed)
sudo apt update && sudo apt install apache2

# Start Apache
sudo systemctl start apache2

# Enable Apache
sudo systemctl enable apache2

# Check status
systemctl status apache2

# View logs
journalctl -u apache2.service -f
```

### Creating Custom Services

**Example: Simple Backup Service**

1. **Create the script:**
```bash
sudo nano /usr/local/bin/backup_script.sh
```

```bash
#!/bin/bash
# Simple backup script

BACKUP_DIR="/backup"
SOURCE_DIR="/home"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/backup_$DATE.tar.gz $SOURCE_DIR

echo "Backup completed: backup_$DATE.tar.gz"
```

2. **Make it executable:**
```bash
sudo chmod +x /usr/local/bin/backup_script.sh
```

3. **Create service unit file:**
```bash
sudo nano /etc/systemd/system/backup.service
```

```ini
[Unit]
Description=Backup Service
After=network.target

[Service]
Type=oneshot
ExecStart=/usr/local/bin/backup_script.sh
User=root

[Install]
WantedBy=multi-user.target
```

4. **Enable and test the service:**
```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable the service
sudo systemctl enable backup.service

# Start the service
sudo systemctl start backup.service

# Check status
systemctl status backup.service
```

### Hands-on Exercise: Service Management

```bash
# 1. Explore current services
systemctl list-units --type=service | head -20
systemctl --failed

# 2. Practice with SSH service
systemctl status ssh
sudo systemctl stop ssh
systemctl status ssh
sudo systemctl start ssh

# 3. Check service logs
journalctl -u ssh.service --since "1 hour ago"

# 4. Create a simple test service
sudo nano /etc/systemd/system/hello.service

# Add this content:
[Unit]
Description=Hello World Service
After=network.target

[Service]
Type=oneshot
ExecStart=/bin/echo "Hello from systemd service!"
StandardOutput=journal

[Install]
WantedBy=multi-user.target

# 5. Test the service
sudo systemctl daemon-reload
sudo systemctl start hello.service
systemctl status hello.service
journalctl -u hello.service

# 6. Clean up
sudo systemctl disable hello.service
sudo rm /etc/systemd/system/hello.service
sudo systemctl daemon-reload
```

## Free Learning Resources

### Interactive Practice
- [Linux Journey - Process Utilization](https://linuxjourney.com/lesson/monitor-processes-ps-command)
- [OverTheWire Bandit Levels 10-15](https://overthewire.org/wargames/bandit/) - Process and user management
- [Katacoda Linux Administration](https://www.katacoda.com/courses/linux) - Hands-on labs

### Documentation
- [Ubuntu Server Guide - User Management](https://ubuntu.com/server/docs/security-users)
- [systemd Documentation](https://www.freedesktop.org/wiki/Software/systemd/)
- [Linux System Administrator's Guide](https://tldp.org/LDP/sag/html/)

### Video Tutorials
- [Linux Academy - System Administration](https://linuxacademy.com/) - Free tier available
- [edX - Linux System Administration](https://www.edx.org/course/linux-system-administration)

### Practice Labs
- [VirtualBox Labs](https://www.virtualbox.org/) - Create your own lab environment
- [Vagrant](https://www.vagrantup.com/) - Automated VM provisioning for practice

## Next Steps

After mastering system administration:

1. **Practice Regularly**: Set up a home lab with multiple VMs
2. **Learn Automation**: Move to shell scripting and configuration management
3. **Explore Security**: Learn about system hardening and security practices
4. **Join Communities**: 
   - [r/linuxadmin](https://www.reddit.com/r/linuxadmin/)
   - [Linux.org System Administration](https://www.linux.org/forums/linux-system-administration.53/)

Continue to **Shell Scripting and Automation** to learn how to automate system administration tasks!
