---
sidebar_position: 2
---

# Linux Fundamentals

Master the essential concepts and skills needed to work effectively with Linux systems.

## What is Linux?

Linux is a free, open-source operating system kernel that forms the foundation of many distributions (distros). Understanding Linux is crucial for modern engineering roles.

### Key Concepts to Understand

**Operating System vs Kernel:**
- **Kernel**: The core that manages hardware and system resources
- **Distribution**: Complete OS package (kernel + software + package manager)
- **Shell**: Command-line interface to interact with the system

**Popular Linux Distributions:**
- **Ubuntu**: Beginner-friendly, great documentation
- **CentOS/RHEL**: Enterprise-focused, stable
- **Debian**: Stable, minimal, community-driven
- **Arch**: Rolling release, cutting-edge

## Setting Up Your Linux Environment

### Option 1: Virtual Machine (Recommended for Beginners)

**Step 1: Install VirtualBox**
- Download: [VirtualBox](https://www.virtualbox.org/wiki/Downloads)
- Free virtualization software for Windows/Mac/Linux

**Step 2: Download Ubuntu Desktop**
- Get Ubuntu 22.04 LTS: [Ubuntu Download](https://ubuntu.com/download/desktop)
- LTS = Long Term Support (5 years of updates)

**Step 3: Create Virtual Machine**
```bash
# Recommended VM Settings:
- RAM: 4GB minimum (8GB preferred)
- Storage: 25GB minimum
- Enable virtualization in BIOS if needed
```

**Detailed Setup Guide:**
- [VirtualBox Ubuntu Installation](https://ubuntu.com/tutorials/how-to-run-ubuntu-desktop-on-a-virtual-machine-using-virtualbox)

### Option 2: Dual Boot (Advanced)

**Warning**: This modifies your computer's boot process. Backup your data first!

**Resources:**
- [Ubuntu Dual Boot Guide](https://help.ubuntu.com/community/WindowsDualBoot)
- [Dual Boot Safety Tips](https://www.howtogeek.com/214571/how-to-dual-boot-linux-on-your-pc/)

### Option 3: Cloud-Based Linux (Free Tiers)

**AWS Free Tier:**
- 12 months free EC2 t2.micro instance
- [AWS Free Tier](https://aws.amazon.com/free/)

**Google Cloud Platform:**
- $300 credit for new users
- [GCP Free Tier](https://cloud.google.com/free)

## Linux File System Structure

Understanding the Linux directory structure is fundamental to system administration.

### Root Directory (/) and Key Subdirectories

```
/                    # Root directory (not to be confused with /root)
├── bin/            # Essential user binaries (commands)
├── boot/           # Boot loader files
├── dev/            # Device files
├── etc/            # System configuration files
├── home/           # User home directories
├── lib/            # Shared libraries
├── media/          # Removable media mount points
├── mnt/            # Temporary mount points
├── opt/            # Optional software packages
├── proc/           # Virtual filesystem (process info)
├── root/           # Root user's home directory
├── run/            # Runtime data
├── sbin/           # System binaries
├── srv/            # Service data
├── sys/            # Virtual filesystem (system info)
├── tmp/            # Temporary files
├── usr/            # User programs and data
└── var/            # Variable data (logs, databases)
```

### Key Directories Explained

**`/home/username/`** - Your personal directory
```bash
# Example: If your username is "john"
/home/john/         # Your home directory
/home/john/Desktop/ # Desktop files
/home/john/Documents/ # Documents folder
```

**`/etc/`** - Configuration files
```bash
/etc/passwd         # User account information
/etc/hosts          # Hostname to IP mappings
/etc/fstab          # Filesystem mount information
```

**`/var/log/`** - System logs
```bash
/var/log/syslog     # System messages
/var/log/auth.log   # Authentication logs
/var/log/apache2/   # Web server logs
```

### Hands-on Exercise: Explore the File System

Open your terminal and run these commands:

```bash
# Navigate to root directory
cd /

# List contents with details
ls -la

# Explore your home directory
cd ~
pwd  # Print working directory

# Check disk usage of directories
du -h --max-depth=1 /

# View system information
cat /etc/os-release
```

## Basic Command Line Navigation

The command line is your primary interface for Linux system administration.

### Essential Navigation Commands

**`pwd`** - Print Working Directory
```bash
pwd
# Output: /home/username
# Shows your current location in the file system
```

**`ls`** - List Directory Contents
```bash
# Basic listing
ls

# Detailed listing with permissions, size, date
ls -l

# Show hidden files (starting with .)
ls -a

# Combine options
ls -la

# Human-readable file sizes
ls -lh

# Sort by modification time (newest first)
ls -lt
```

**`cd`** - Change Directory
```bash
# Go to home directory
cd ~
# or simply
cd

# Go to root directory
cd /

# Go to parent directory
cd ..

# Go to previous directory
cd -

# Go to specific directory
cd /var/log

# Use tab completion for efficiency
cd /ho<TAB>  # Completes to /home/
```

### File and Directory Operations

**Creating Directories**
```bash
# Create single directory
mkdir my_project

# Create multiple directories
mkdir dir1 dir2 dir3

# Create nested directories
mkdir -p projects/web/frontend

# Create with specific permissions
mkdir -m 755 public_folder
```

**Creating Files**
```bash
# Create empty file
touch newfile.txt

# Create multiple files
touch file1.txt file2.txt file3.txt

# Create file with content using echo
echo "Hello Linux!" > greeting.txt

# Append to file
echo "Second line" >> greeting.txt
```

**Copying Files and Directories**
```bash
# Copy file
cp source.txt destination.txt

# Copy file to directory
cp file.txt /home/user/documents/

# Copy directory recursively
cp -r source_directory/ destination_directory/

# Copy with preservation of attributes
cp -p file.txt backup_file.txt

# Interactive copy (ask before overwriting)
cp -i file.txt existing_file.txt
```

**Moving and Renaming**
```bash
# Move file to directory
mv file.txt /home/user/documents/

# Rename file
mv oldname.txt newname.txt

# Move directory
mv old_directory/ /path/to/new/location/

# Move multiple files
mv *.txt /home/user/documents/
```

**Removing Files and Directories**
```bash
# Remove file
rm file.txt

# Remove multiple files
rm file1.txt file2.txt

# Remove with confirmation
rm -i important_file.txt

# Remove directory and contents
rm -r directory_name/

# Force removal (be careful!)
rm -rf directory_name/

# Remove empty directory
rmdir empty_directory/
```

### Hands-on Exercise: File Operations

Practice these operations:

```bash
# 1. Create a project structure
mkdir -p ~/linux_practice/{documents,scripts,backups}

# 2. Navigate and create files
cd ~/linux_practice/documents
touch readme.txt notes.txt

# 3. Add content to files
echo "This is my Linux learning journey" > readme.txt
echo "Important notes about Linux commands" > notes.txt

# 4. Copy files
cp readme.txt readme_backup.txt
cp *.txt ../backups/

# 5. List and verify
ls -la
ls -la ../backups/

# 6. Practice navigation
cd ../scripts
pwd
cd ..
ls -la
```

## File Permissions and Ownership

Linux uses a robust permission system to control access to files and directories.

### Understanding Permission Structure

Every file and directory has three types of permissions for three categories of users:

**Permission Types:**
- **r (read)**: View file contents or list directory contents
- **w (write)**: Modify file or create/delete files in directory  
- **x (execute)**: Run file as program or access directory

**User Categories:**
- **Owner (u)**: The user who owns the file
- **Group (g)**: Users in the file's group
- **Others (o)**: All other users

### Reading Permission Display

```bash
ls -l filename.txt
# Output: -rw-r--r-- 1 user group 1024 Jan 15 10:30 filename.txt
```

**Breaking down `-rw-r--r--`:**
```
-          rw-       r--       r--
File Type  Owner     Group     Others
-          read+write read      read
```

**File Type Indicators:**
- `-`: Regular file
- `d`: Directory
- `l`: Symbolic link
- `b`: Block device
- `c`: Character device

### Numeric Permission System

Permissions can also be represented numerically:

```
r = 4 (read)
w = 2 (write)  
x = 1 (execute)
```

**Common Permission Combinations:**
- `755`: rwxr-xr-x (owner: full, group/others: read+execute)
- `644`: rw-r--r-- (owner: read+write, group/others: read only)
- `600`: rw------- (owner: read+write, group/others: no access)
- `777`: rwxrwxrwx (everyone: full access - rarely recommended)

### Changing Permissions with chmod

**Using Symbolic Mode:**
```bash
# Add execute permission for owner
chmod u+x script.sh

# Remove write permission for group
chmod g-w file.txt

# Set read-only for everyone
chmod a-w file.txt

# Multiple changes
chmod u+x,g+r,o-w file.txt
```

**Using Numeric Mode:**
```bash
# Set specific permissions
chmod 755 script.sh    # rwxr-xr-x
chmod 644 document.txt # rw-r--r--
chmod 600 private.txt  # rw-------

# Recursive permission change
chmod -R 755 /path/to/directory/
```

### Changing Ownership with chown

```bash
# Change owner
sudo chown newowner file.txt

# Change owner and group
sudo chown newowner:newgroup file.txt

# Change only group
sudo chown :newgroup file.txt
# or
sudo chgrp newgroup file.txt

# Recursive ownership change
sudo chown -R user:group /path/to/directory/
```

### Practical Examples

**Making a Script Executable:**
```bash
# Create a script
echo '#!/bin/bash' > myscript.sh
echo 'echo "Hello from my script!"' >> myscript.sh

# Check current permissions
ls -l myscript.sh
# Output: -rw-r--r-- 1 user group 48 Jan 15 10:30 myscript.sh

# Make executable
chmod +x myscript.sh

# Verify change
ls -l myscript.sh
# Output: -rwxr-xr-x 1 user group 48 Jan 15 10:30 myscript.sh

# Run the script
./myscript.sh
```

**Securing Sensitive Files:**
```bash
# Create a file with sensitive data
echo "password123" > secret.txt

# Secure it (owner read/write only)
chmod 600 secret.txt

# Verify
ls -l secret.txt
# Output: -rw------- 1 user group 12 Jan 15 10:30 secret.txt
```

### Hands-on Exercise: Permissions Practice

```bash
# 1. Create test environment
mkdir ~/permissions_test
cd ~/permissions_test

# 2. Create files with different purposes
touch public_doc.txt
touch private_doc.txt
touch executable_script.sh

# 3. Set appropriate permissions
chmod 644 public_doc.txt    # Public readable
chmod 600 private_doc.txt   # Private
chmod 755 executable_script.sh # Executable

# 4. Verify permissions
ls -l

# 5. Test access (try as different user if possible)
# Create content
echo "Public information" > public_doc.txt
echo "Private information" > private_doc.txt
echo '#!/bin/bash\necho "Script running!"' > executable_script.sh

# 6. Test execution
./executable_script.sh
```

## Free Learning Resources

### Interactive Tutorials
- [Linux Journey](https://linuxjourney.com/) - Interactive, beginner-friendly lessons
- [OverTheWire Bandit](https://overthewire.org/wargames/bandit/) - Command line challenges
- [Katacoda Linux Scenarios](https://www.katacoda.com/courses/linux) - Browser-based labs

### Documentation
- [Ubuntu Documentation](https://help.ubuntu.com/) - Comprehensive Ubuntu guides
- [Arch Linux Wiki](https://wiki.archlinux.org/) - Excellent technical documentation
- [Linux Documentation Project](https://tldp.org/) - Classic Linux guides

### Video Courses
- [Linux Command Line Basics - Udacity](https://www.udacity.com/course/linux-command-line-basics--ud595)
- [Introduction to Linux - edX](https://www.edx.org/course/introduction-to-linux)

### Practice Environments
- [Replit Linux Environment](https://replit.com/) - Browser-based Linux terminal
- [JSLinux](https://bellard.org/jslinux/) - Linux emulator in browser

## Next Steps

After mastering these fundamentals:

1. **Practice Daily**: Use Linux as your primary development environment
2. **Explore System Administration**: Move to user management and process control
3. **Learn Shell Scripting**: Automate repetitive tasks
4. **Join Communities**: 
   - [r/linux4noobs](https://www.reddit.com/r/linux4noobs/)
   - [Linux.org Forums](https://www.linux.org/forums/)
   - [Ask Ubuntu](https://askubuntu.com/)

Continue to **System Administration** to learn user management, process control, and system monitoring!
