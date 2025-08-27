---
sidebar_position: 4
---

# Shell Scripting and Automation

Master Bash scripting to automate system administration tasks and improve efficiency.

## Introduction to Shell Scripting

Shell scripting allows you to automate repetitive tasks, combine multiple commands, and create powerful system administration tools.

### What is a Shell Script?

A shell script is a text file containing a series of commands that the shell can execute. It's like a program written in the shell's command language.

**Benefits of Shell Scripting:**
- **Automation**: Eliminate repetitive manual tasks
- **Consistency**: Ensure tasks are performed the same way every time
- **Efficiency**: Save time and reduce human error
- **Integration**: Combine multiple tools and commands
- **Scheduling**: Run tasks automatically with cron

### Choosing Your Shell

**Common Shells:**
- **Bash** (Bourne Again Shell): Most popular, default on most Linux systems
- **Zsh** (Z Shell): Enhanced features, popular with developers
- **Fish** (Friendly Interactive Shell): User-friendly with good defaults
- **Dash**: Lightweight, POSIX-compliant

**Check Your Current Shell:**
```bash
echo $SHELL
# Output: /bin/bash

# List available shells
cat /etc/shells
```

**For this guide, we'll use Bash** - it's the most widely supported and portable.

## Basic Script Structure

### Creating Your First Script

**Step 1: Create the script file**
```bash
nano hello_world.sh
```

**Step 2: Add the shebang and content**
```bash
#!/bin/bash
# This is a comment
# My first shell script

echo "Hello, World!"
echo "Today is: $(date)"
echo "Current user: $USER"
echo "Current directory: $(pwd)"
```

**Step 3: Make it executable**
```bash
chmod +x hello_world.sh
```

**Step 4: Run the script**
```bash
./hello_world.sh
```

### Understanding the Shebang

The **shebang** (`#!`) tells the system which interpreter to use:

```bash
#!/bin/bash          # Use Bash
#!/bin/sh            # Use system shell (usually dash)
#!/usr/bin/env bash  # Use bash from PATH (more portable)
#!/usr/bin/python3   # Use Python 3
```

### Script Structure Best Practices

```bash
#!/bin/bash

#############################################
# Script Name: example_script.sh
# Description: Brief description of what the script does
# Author: Your Name
# Date: 2024-01-15
# Version: 1.0
#############################################

# Exit on any error
set -e

# Exit on undefined variables
set -u

# Global variables
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="/var/log/script.log"

# Functions
function main() {
    echo "Script starting..."
    # Main logic here
    echo "Script completed successfully"
}

# Script execution
main "$@"
```

## Variables and Data Types

### Variable Declaration and Usage

**Basic Variables:**
```bash
#!/bin/bash

# Variable assignment (no spaces around =)
name="John Doe"
age=30
is_admin=true

# Using variables
echo "Name: $name"
echo "Age: $age"
echo "Admin: $is_admin"

# Alternative syntax
echo "Name: ${name}"
echo "Age: ${age}"
```

**Environment Variables:**
```bash
#!/bin/bash

# Common environment variables
echo "User: $USER"
echo "Home: $HOME"
echo "Path: $PATH"
echo "Shell: $SHELL"
echo "Current directory: $PWD"

# Setting environment variables
export MY_VAR="Hello World"
echo "My variable: $MY_VAR"
```

**Command Line Arguments:**
```bash
#!/bin/bash

# Script arguments
echo "Script name: $0"
echo "First argument: $1"
echo "Second argument: $2"
echo "All arguments: $@"
echo "Number of arguments: $#"

# Example usage: ./script.sh arg1 arg2 arg3
```

**Special Variables:**
```bash
#!/bin/bash

echo "Process ID: $$"
echo "Exit status of last command: $?"
echo "All arguments as single string: $*"
echo "All arguments as array: $@"
echo "Number of arguments: $#"
```

### Variable Scope and Types

**Local vs Global Variables:**
```bash
#!/bin/bash

global_var="I'm global"

function test_scope() {
    local local_var="I'm local"
    global_var="Modified global"
    
    echo "Inside function:"
    echo "Local: $local_var"
    echo "Global: $global_var"
}

echo "Before function: $global_var"
test_scope
echo "After function: $global_var"
# echo "Local outside function: $local_var"  # This would cause an error
```

**Arrays:**
```bash
#!/bin/bash

# Declare array
fruits=("apple" "banana" "orange" "grape")

# Access elements
echo "First fruit: ${fruits[0]}"
echo "All fruits: ${fruits[@]}"
echo "Number of fruits: ${#fruits[@]}"

# Add element
fruits+=("mango")

# Loop through array
for fruit in "${fruits[@]}"; do
    echo "Fruit: $fruit"
done
```

**Associative Arrays (Bash 4+):**
```bash
#!/bin/bash

# Declare associative array
declare -A colors
colors[red]="#FF0000"
colors[green]="#00FF00"
colors[blue]="#0000FF"

# Access elements
echo "Red color code: ${colors[red]}"

# Loop through associative array
for color in "${!colors[@]}"; do
    echo "$color: ${colors[$color]}"
done
```

### Hands-on Exercise: Variables

```bash
#!/bin/bash
# File: variable_practice.sh

# 1. Create variables for system information
hostname=$(hostname)
current_date=$(date +"%Y-%m-%d %H:%M:%S")
disk_usage=$(df -h / | awk 'NR==2 {print $5}')

# 2. Create an array of important directories
important_dirs=("/etc" "/var/log" "/home" "/tmp")

# 3. Display information
echo "=== System Information ==="
echo "Hostname: $hostname"
echo "Date: $current_date"
echo "Root disk usage: $disk_usage"
echo ""

echo "=== Important Directories ==="
for dir in "${important_dirs[@]}"; do
    if [ -d "$dir" ]; then
        echo "$dir exists"
    else
        echo "$dir does not exist"
    fi
done
```

## Control Structures

### Conditional Statements

**Basic if Statement:**
```bash
#!/bin/bash

age=25

if [ $age -ge 18 ]; then
    echo "You are an adult"
fi
```

**if-else Statement:**
```bash
#!/bin/bash

read -p "Enter your age: " age

if [ $age -ge 18 ]; then
    echo "You are an adult"
else
    echo "You are a minor"
fi
```

**if-elif-else Statement:**
```bash
#!/bin/bash

read -p "Enter your score: " score

if [ $score -ge 90 ]; then
    echo "Grade: A"
elif [ $score -ge 80 ]; then
    echo "Grade: B"
elif [ $score -ge 70 ]; then
    echo "Grade: C"
elif [ $score -ge 60 ]; then
    echo "Grade: D"
else
    echo "Grade: F"
fi
```

**Test Operators:**
```bash
#!/bin/bash

# Numeric comparisons
# -eq (equal), -ne (not equal), -lt (less than)
# -le (less or equal), -gt (greater than), -ge (greater or equal)

# String comparisons
# = (equal), != (not equal), -z (empty), -n (not empty)

# File tests
# -f (regular file), -d (directory), -e (exists)
# -r (readable), -w (writable), -x (executable)

file="/etc/passwd"

if [ -f "$file" ]; then
    echo "$file is a regular file"
fi

if [ -r "$file" ]; then
    echo "$file is readable"
fi

if [ -w "$file" ]; then
    echo "$file is writable"
else
    echo "$file is not writable"
fi
```

**Advanced Conditional Syntax:**
```bash
#!/bin/bash

# Using [[ ]] (recommended for Bash)
name="John"

if [[ $name == "John" ]]; then
    echo "Hello John!"
fi

# Pattern matching
if [[ $name == J* ]]; then
    echo "Name starts with J"
fi

# Multiple conditions
age=25
if [[ $age -ge 18 && $age -le 65 ]]; then
    echo "Working age"
fi

# Logical operators: && (and), || (or), ! (not)
```

### Case Statements

```bash
#!/bin/bash

read -p "Enter your choice (start/stop/restart/status): " action

case $action in
    start)
        echo "Starting service..."
        ;;
    stop)
        echo "Stopping service..."
        ;;
    restart)
        echo "Restarting service..."
        ;;
    status)
        echo "Checking service status..."
        ;;
    *)
        echo "Invalid option. Use: start, stop, restart, or status"
        exit 1
        ;;
esac
```

### Loops

**for Loop:**
```bash
#!/bin/bash

# Loop through a list
for fruit in apple banana orange; do
    echo "Fruit: $fruit"
done

# Loop through array
fruits=("apple" "banana" "orange")
for fruit in "${fruits[@]}"; do
    echo "Fruit: $fruit"
done

# Loop through files
for file in /etc/*.conf; do
    if [ -f "$file" ]; then
        echo "Config file: $file"
    fi
done

# C-style for loop
for ((i=1; i<=5; i++)); do
    echo "Number: $i"
done
```

**while Loop:**
```bash
#!/bin/bash

# Basic while loop
counter=1
while [ $counter -le 5 ]; do
    echo "Counter: $counter"
    ((counter++))
done

# Reading file line by line
while IFS= read -r line; do
    echo "Line: $line"
done < /etc/passwd

# Infinite loop with break condition
while true; do
    read -p "Enter 'quit' to exit: " input
    if [ "$input" = "quit" ]; then
        break
    fi
    echo "You entered: $input"
done
```

**until Loop:**
```bash
#!/bin/bash

# until loop (opposite of while)
counter=1
until [ $counter -gt 5 ]; do
    echo "Counter: $counter"
    ((counter++))
done
```

### Practical Control Structure Examples

**Example 1: System Health Check Script**
```bash
#!/bin/bash

echo "=== System Health Check ==="

# Check disk usage
disk_usage=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $disk_usage -gt 80 ]; then
    echo "WARNING: Disk usage is ${disk_usage}%"
else
    echo "OK: Disk usage is ${disk_usage}%"
fi

# Check memory usage
memory_usage=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
if [ $memory_usage -gt 80 ]; then
    echo "WARNING: Memory usage is ${memory_usage}%"
else
    echo "OK: Memory usage is ${memory_usage}%"
fi

# Check load average
load_avg=$(uptime | awk -F'load average:' '{print $2}' | awk '{print $1}' | sed 's/,//')
if (( $(echo "$load_avg > 2.0" | bc -l) )); then
    echo "WARNING: Load average is $load_avg"
else
    echo "OK: Load average is $load_avg"
fi
```

**Example 2: User Management Script**
```bash
#!/bin/bash

function create_user() {
    local username=$1
    
    if id "$username" &>/dev/null; then
        echo "User $username already exists"
        return 1
    fi
    
    sudo useradd -m -s /bin/bash "$username"
    echo "User $username created successfully"
}

function delete_user() {
    local username=$1
    
    if ! id "$username" &>/dev/null; then
        echo "User $username does not exist"
        return 1
    fi
    
    sudo userdel -r "$username"
    echo "User $username deleted successfully"
}

# Main menu
while true; do
    echo ""
    echo "User Management Script"
    echo "1. Create user"
    echo "2. Delete user"
    echo "3. List users"
    echo "4. Exit"
    read -p "Choose an option: " choice
    
    case $choice in
        1)
            read -p "Enter username to create: " username
            create_user "$username"
            ;;
        2)
            read -p "Enter username to delete: " username
            delete_user "$username"
            ;;
        3)
            echo "Current users:"
            cut -d: -f1 /etc/passwd | sort
            ;;
        4)
            echo "Goodbye!"
            exit 0
            ;;
        *)
            echo "Invalid option"
            ;;
    esac
done
```

## Functions

Functions help organize code, reduce repetition, and make scripts more maintainable.

### Function Syntax

**Basic Function Definition:**
```bash
#!/bin/bash

# Method 1: function keyword
function greet() {
    echo "Hello, $1!"
}

# Method 2: without function keyword (preferred)
greet_user() {
    local name=$1
    echo "Hello, $name!"
}

# Calling functions
greet "World"
greet_user "John"
```

### Function Parameters and Return Values

```bash
#!/bin/bash

# Function with multiple parameters
calculate_sum() {
    local num1=$1
    local num2=$2
    local result=$((num1 + num2))
    echo $result  # Return value via echo
}

# Function with return status
is_file_executable() {
    local file=$1
    
    if [ -x "$file" ]; then
        return 0  # Success
    else
        return 1  # Failure
    fi
}

# Using functions
sum=$(calculate_sum 10 20)
echo "Sum: $sum"

if is_file_executable "/bin/ls"; then
    echo "/bin/ls is executable"
else
    echo "/bin/ls is not executable"
fi
```

### Advanced Function Features

**Functions with Variable Arguments:**
```bash
#!/bin/bash

print_all_args() {
    echo "Function received $# arguments:"
    for arg in "$@"; do
        echo "  - $arg"
    done
}

print_all_args "apple" "banana" "orange"
```

**Functions with Global and Local Variables:**
```bash
#!/bin/bash

global_counter=0

increment_counter() {
    local increment=${1:-1}  # Default to 1 if no argument
    global_counter=$((global_counter + increment))
    echo "Counter incremented by $increment"
}

get_counter() {
    echo $global_counter
}

increment_counter 5
increment_counter
echo "Current counter: $(get_counter)"
```

### Practical Function Examples

**Example 1: Logging Functions**
```bash
#!/bin/bash

LOG_FILE="/tmp/script.log"

log_message() {
    local level=$1
    local message=$2
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    echo "[$timestamp] [$level] $message" | tee -a "$LOG_FILE"
}

log_info() {
    log_message "INFO" "$1"
}

log_warning() {
    log_message "WARNING" "$1"
}

log_error() {
    log_message "ERROR" "$1"
}

# Usage
log_info "Script started"
log_warning "This is a warning message"
log_error "This is an error message"
```

**Example 2: File Backup Functions**
```bash
#!/bin/bash

backup_file() {
    local source_file=$1
    local backup_dir=${2:-"/backup"}
    
    # Validate input
    if [ ! -f "$source_file" ]; then
        echo "Error: $source_file does not exist"
        return 1
    fi
    
    # Create backup directory if it doesn't exist
    mkdir -p "$backup_dir"
    
    # Create backup with timestamp
    local filename=$(basename "$source_file")
    local timestamp=$(date '+%Y%m%d_%H%M%S')
    local backup_file="${backup_dir}/${filename}.${timestamp}.bak"
    
    if cp "$source_file" "$backup_file"; then
        echo "Backup created: $backup_file"
        return 0
    else
        echo "Error: Failed to create backup"
        return 1
    fi
}

restore_backup() {
    local backup_file=$1
    local restore_path=$2
    
    if [ ! -f "$backup_file" ]; then
        echo "Error: Backup file $backup_file does not exist"
        return 1
    fi
    
    if cp "$backup_file" "$restore_path"; then
        echo "File restored from $backup_file to $restore_path"
        return 0
    else
        echo "Error: Failed to restore file"
        return 1
    fi
}

# Usage examples
backup_file "/etc/hosts"
backup_file "/etc/passwd" "/home/user/backups"
```

## Input/Output and File Operations

### Reading User Input

**Basic Input:**
```bash
#!/bin/bash

# Simple input
read -p "Enter your name: " name
echo "Hello, $name!"

# Input with timeout
if read -t 10 -p "Enter something (10 seconds): " input; then
    echo "You entered: $input"
else
    echo "Timeout reached"
fi

# Silent input (for passwords)
read -s -p "Enter password: " password
echo ""  # New line after silent input
echo "Password entered (hidden)"
```

**Advanced Input Handling:**
```bash
#!/bin/bash

# Input validation
while true; do
    read -p "Enter a number between 1 and 10: " number
    
    if [[ $number =~ ^[0-9]+$ ]] && [ $number -ge 1 ] && [ $number -le 10 ]; then
        echo "Valid number: $number"
        break
    else
        echo "Invalid input. Please try again."
    fi
done

# Multiple choice input
select option in "Option 1" "Option 2" "Option 3" "Quit"; do
    case $option in
        "Option 1")
            echo "You chose Option 1"
            ;;
        "Option 2")
            echo "You chose Option 2"
            ;;
        "Option 3")
            echo "You chose Option 3"
            ;;
        "Quit")
            break
            ;;
        *)
            echo "Invalid option"
            ;;
    esac
done
```

### File Operations

**Reading Files:**
```bash
#!/bin/bash

# Read entire file
file_content=$(cat /etc/hostname)
echo "Hostname: $file_content"

# Read file line by line
while IFS= read -r line; do
    echo "Line: $line"
done < /etc/passwd

# Read specific lines
head -5 /etc/passwd  # First 5 lines
tail -5 /etc/passwd  # Last 5 lines
sed -n '10,15p' /etc/passwd  # Lines 10-15
```

**Writing Files:**
```bash
#!/bin/bash

# Write to file (overwrite)
echo "Hello World" > output.txt

# Append to file
echo "Second line" >> output.txt

# Write multiple lines
cat > config.txt << EOF
# Configuration file
server_name=localhost
port=8080
debug=true
EOF

# Write with variables
cat > info.txt << EOF
User: $USER
Date: $(date)
Directory: $(pwd)
EOF
```

**File Testing and Manipulation:**
```bash
#!/bin/bash

file="/etc/passwd"

# File tests
if [ -f "$file" ]; then
    echo "$file is a regular file"
    echo "Size: $(stat -c%s "$file") bytes"
    echo "Modified: $(stat -c%y "$file")"
    echo "Permissions: $(stat -c%A "$file")"
fi

# Directory operations
mkdir -p /tmp/test_dir
cd /tmp/test_dir

# Create test files
touch file1.txt file2.txt file3.log

# Find files
echo "Text files:"
find . -name "*.txt"

echo "All files modified in last hour:"
find . -mmin -60

# File processing
echo "Processing files:"
for file in *.txt; do
    if [ -f "$file" ]; then
        echo "Processing $file"
        # Add timestamp to file
        echo "Processed on $(date)" >> "$file"
    fi
done
```

### Practical I/O Examples

**Example 1: Configuration File Parser**
```bash
#!/bin/bash

parse_config() {
    local config_file=$1
    
    if [ ! -f "$config_file" ]; then
        echo "Error: Configuration file $config_file not found"
        return 1
    fi
    
    echo "Parsing configuration file: $config_file"
    
    while IFS='=' read -r key value; do
        # Skip comments and empty lines
        [[ $key =~ ^[[:space:]]*# ]] && continue
        [[ -z $key ]] && continue
        
        # Remove leading/trailing whitespace
        key=$(echo "$key" | xargs)
        value=$(echo "$value" | xargs)
        
        echo "Config: $key = $value"
        
        # You can set variables dynamically
        declare -g "CONFIG_$key"="$value"
        
    done < "$config_file"
}

# Create sample config file
cat > sample.conf << EOF
# Sample configuration
server_name=localhost
port=8080
debug=true
# This is a comment
database_host=db.example.com
EOF

# Parse the configuration
parse_config "sample.conf"

# Access parsed values
echo "Server: $CONFIG_server_name"
echo "Port: $CONFIG_port"
```

**Example 2: Log File Analyzer**
```bash
#!/bin/bash

analyze_log() {
    local log_file=$1
    
    if [ ! -f "$log_file" ]; then
        echo "Error: Log file $log_file not found"
        return 1
    fi
    
    echo "=== Log File Analysis: $log_file ==="
    
    # Total lines
    total_lines=$(wc -l < "$log_file")
    echo "Total lines: $total_lines"
    
    # Error count
    error_count=$(grep -c -i "error" "$log_file" 2>/dev/null || echo 0)
    echo "Error entries: $error_count"
    
    # Warning count
    warning_count=$(grep -c -i "warning" "$log_file" 2>/dev/null || echo 0)
    echo "Warning entries: $warning_count"
    
    # Most recent entries
    echo ""
    echo "Last 5 entries:"
    tail -5 "$log_file"
    
    # Top IP addresses (if it's an access log)
    if grep -q "^\S\+ \S\+ \S\+" "$log_file" 2>/dev/null; then
        echo ""
        echo "Top 5 IP addresses:"
        awk '{print $1}' "$log_file" | sort | uniq -c | sort -nr | head -5
    fi
}

# Create sample log file for testing
cat > sample.log << EOF
2024-01-15 10:00:01 INFO Application started
2024-01-15 10:00:02 INFO User login: john
2024-01-15 10:00:03 WARNING High memory usage
2024-01-15 10:00:04 ERROR Database connection failed
2024-01-15 10:00:05 INFO User logout: john
EOF

# Analyze the log
analyze_log "sample.log"
```

## Error Handling and Debugging

### Exit Codes and Error Handling

**Understanding Exit Codes:**
```bash
#!/bin/bash

# Exit codes:
# 0 = Success
# 1-255 = Various error conditions

# Check exit code of last command
ls /nonexistent_directory
echo "Exit code: $?"

# Set custom exit codes
function divide() {
    local a=$1
    local b=$2
    
    if [ $b -eq 0 ]; then
        echo "Error: Division by zero"
        return 1
    fi
    
    echo $((a / b))
    return 0
}

# Use the function
if divide 10 2; then
    echo "Division successful"
else
    echo "Division failed"
fi
```

**Error Handling Strategies:**
```bash
#!/bin/bash

# Strategy 1: Exit on any error
set -e  # Exit immediately if a command exits with a non-zero status

# Strategy 2: Exit on undefined variables
set -u  # Exit if trying to use an undefined variable

# Strategy 3: Pipe failure detection
set -o pipefail  # Exit if any command in a pipeline fails

# Combine all three
set -euo pipefail

# Handle errors gracefully
function safe_command() {
    local command="$1"
    
    if ! $command; then
        echo "Error: Command '$command' failed"
        return 1
    fi
}

# Trap errors
function cleanup() {
    echo "Cleaning up..."
    # Remove temporary files, etc.
}

trap cleanup EXIT  # Run cleanup on script exit
trap 'echo "Error on line $LINENO"' ERR  # Show error line number
```

### Debugging Techniques

**Debug Mode:**
```bash
#!/bin/bash

# Enable debug mode
set -x  # Print commands before executing them

echo "This will show the command being executed"
ls /tmp

# Disable debug mode
set +x

echo "This won't show the command"

# Conditional debugging
DEBUG=${DEBUG:-false}

debug_echo() {
    if [ "$DEBUG" = "true" ]; then
        echo "DEBUG: $*"
    fi
}

debug_echo "This is a debug message"

# Run with: DEBUG=true ./script.sh
```

**Logging for Debugging:**
```bash
#!/bin/bash

LOG_LEVEL=${LOG_LEVEL:-INFO}
LOG_FILE=${LOG_FILE:-/tmp/script.log}

log() {
    local level=$1
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    # Log levels: DEBUG, INFO, WARNING, ERROR
    case $LOG_LEVEL in
        DEBUG)
            level_num=0
            ;;
        INFO)
            level_num=1
            ;;
        WARNING)
            level_num=2
            ;;
        ERROR)
            level_num=3
            ;;
    esac
    
    case $level in
        DEBUG)
            msg_level_num=0
            ;;
        INFO)
            msg_level_num=1
            ;;
        WARNING)
            msg_level_num=2
            ;;
        ERROR)
            msg_level_num=3
            ;;
    esac
    
    if [ $msg_level_num -ge $level_num ]; then
        echo "[$timestamp] [$level] $message" | tee -a "$LOG_FILE"
    fi
}

# Usage
log DEBUG "This is a debug message"
log INFO "Script started"
log WARNING "This is a warning"
log ERROR "This is an error"
```

### Practical Error Handling Example

```bash
#!/bin/bash

# Robust backup script with error handling
set -euo pipefail

BACKUP_SOURCE="/home/user/documents"
BACKUP_DEST="/backup"
LOG_FILE="/var/log/backup.log"

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"
}

# Cleanup function
cleanup() {
    local exit_code=$?
    if [ $exit_code -ne 0 ]; then
        log "ERROR: Script failed with exit code $exit_code"
    fi
    log "Backup script finished"
}

# Error handler
error_handler() {
    local line_number=$1
    log "ERROR: Script failed at line $line_number"
    exit 1
}

# Set up traps
trap cleanup EXIT
trap 'error_handler $LINENO' ERR

# Validation function
validate_environment() {
    log "INFO: Validating environment"
    
    if [ ! -d "$BACKUP_SOURCE" ]; then
        log "ERROR: Source directory $BACKUP_SOURCE does not exist"
        exit 1
    fi
    
    if [ ! -w "$(dirname "$BACKUP_DEST")" ]; then
        log "ERROR: Cannot write to backup destination parent directory"
        exit 1
    fi
    
    if ! command -v rsync >/dev/null 2>&1; then
        log "ERROR: rsync command not found"
        exit 1
    fi
    
    log "INFO: Environment validation passed"
}

# Backup function
perform_backup() {
    log "INFO: Starting backup from $BACKUP_SOURCE to $BACKUP_DEST"
    
    # Create backup directory with timestamp
    local backup_dir="$BACKUP_DEST/backup_$(date +%Y%m%d_%H%M%S)"
    
    if ! mkdir -p "$backup_dir"; then
        log "ERROR: Failed to create backup directory $backup_dir"
        exit 1
    fi
    
    # Perform backup with rsync
    if rsync -av --progress "$BACKUP_SOURCE/" "$backup_dir/"; then
        log "INFO: Backup completed successfully to $backup_dir"
        
        # Calculate backup size
        local backup_size=$(du -sh "$backup_dir" | cut -f1)
        log "INFO: Backup size: $backup_size"
    else
        log "ERROR: Backup failed"
        exit 1
    fi
}

# Main execution
main() {
    log "INFO: Backup script started"
    validate_environment
    perform_backup
    log "INFO: Backup script completed successfully"
}

# Run main function
main "$@"
```

## Hands-on Exercise: Complete Automation Script

Create a comprehensive system maintenance script that demonstrates all the concepts learned:

```bash
#!/bin/bash

#############################################
# System Maintenance Script
# Description: Automated system maintenance tasks
# Author: Linux Engineering Student
# Version: 1.0
#############################################

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="/tmp/maintenance.log"
BACKUP_DIR="/tmp/maintenance_backup"
MAX_LOG_SIZE=1048576  # 1MB

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log() {
    local level=$1
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "[$timestamp] [$level] $message" | tee -a "$LOG_FILE"
}

log_info() {
    log "INFO" "$*"
    echo -e "${BLUE}[INFO]${NC} $*"
}

log_warning() {
    log "WARNING" "$*"
    echo -e "${YELLOW}[WARNING]${NC} $*"
}

log_error() {
    log "ERROR" "$*"
    echo -e "${RED}[ERROR]${NC} $*"
}

log_success() {
    log "SUCCESS" "$*"
    echo -e "${GREEN}[SUCCESS]${NC} $*"
}

# Cleanup function
cleanup() {
    local exit_code=$?
    if [ $exit_code -eq 0 ]; then
        log_success "Maintenance script completed successfully"
    else
        log_error "Maintenance script failed with exit code $exit_code"
    fi
}

trap cleanup EXIT

# System information functions
get_system_info() {
    log_info "Gathering system information"
    
    echo "=== System Information ==="
    echo "Hostname: $(hostname)"
    echo "OS: $(cat /etc/os-release | grep PRETTY_NAME | cut -d'"' -f2)"
    echo "Kernel: $(uname -r)"
    echo "Uptime: $(uptime -p)"
    echo "Load Average: $(uptime | awk -F'load average:' '{print $2}')"
    echo ""
}

check_disk_usage() {
    log_info "Checking disk usage"
    
    echo "=== Disk Usage ==="
    df -h
    echo ""
    
    # Check for high disk usage
    while read -r filesystem usage mountpoint; do
        usage_percent=$(echo "$usage" | sed 's/%//')
        if [ "$usage_percent" -gt 80 ]; then
            log_warning "High disk usage on $mountpoint: $usage"
        fi
    done < <(df -h | awk 'NR>1 {print $1, $5, $6}')
}

check_memory_usage() {
    log_info "Checking memory usage"
    
    echo "=== Memory Usage ==="
    free -h
    echo ""
    
    # Check for high memory usage
    memory_percent=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
    if [ "$memory_percent" -gt 80 ]; then
        log_warning "High memory usage: ${memory_percent}%"
    fi
}

check_running_services() {
    log_info "Checking critical services"
    
    echo "=== Service Status ==="
    
    # List of critical services to check
    services=("ssh" "cron" "systemd-resolved")
    
    for service in "${services[@]}"; do
        if systemctl is-active --quiet "$service"; then
            log_success "$service is running"
        else
            log_error "$service is not running"
        fi
    done
    echo ""
}

cleanup_temp_files() {
    log_info "Cleaning up temporary files"
    
    # Clean /tmp files older than 7 days
    find /tmp -type f -mtime +7 -delete 2>/dev/null || true
    
    # Clean user cache (if running as user)
    if [ -d "$HOME/.cache" ]; then
        find "$HOME/.cache" -type f -mtime +30 -delete 2>/dev/null || true
    fi
    
    log_success "Temporary files cleaned"
}

rotate_logs() {
    log_info "Rotating log files"
    
    # Rotate our own log if it's too big
    if [ -f "$LOG_FILE" ] && [ $(stat -c%s "$LOG_FILE") -gt $MAX_LOG_SIZE ]; then
        mv "$LOG_FILE" "${LOG_FILE}.old"
        touch "$LOG_FILE"
        log_info "Log file rotated"
    fi
}

backup_important_configs() {
    log_info "Backing up important configuration files"
    
    mkdir -p "$BACKUP_DIR"
    
    # List of important config files
    config_files=(
        "/etc/hosts"
        "/etc/hostname"
        "/etc/fstab"
        "$HOME/.bashrc"
        "$HOME/.profile"
    )
    
    for config in "${config_files[@]}"; do
        if [ -f "$config" ]; then
            cp "$config" "$BACKUP_DIR/$(basename "$config").$(date +%Y%m%d)" 2>/dev/null || true
            log_success "Backed up $config"
        fi
    done
}

show_menu() {
    echo ""
    echo "=== System Maintenance Menu ==="
    echo "1. Full system check"
    echo "2. Disk usage check"
    echo "3. Memory usage check"
    echo "4. Service status check"
    echo "5. Clean temporary files"
    echo "6. Backup configurations"
    echo "7. View maintenance log"
    echo "8. Exit"
    echo ""
}

run_full_check() {
    log_info "Running full system maintenance check"
    
    get_system_info
    check_disk_usage
    check_memory_usage
    check_running_services
    cleanup_temp_files
    rotate_logs
    backup_important_configs
    
    log_success "Full system check completed"
}

view_log() {
    if [ -f "$LOG_FILE" ]; then
        echo "=== Recent Log Entries ==="
        tail -20 "$LOG_FILE"
    else
        echo "No log file found"
    fi
}

# Main menu loop
main() {
    log_info "System maintenance script started"
    
    while true; do
        show_menu
        read -p "Choose an option (1-8): " choice
        
        case $choice in
            1)
                run_full_check
                ;;
            2)
                check_disk_usage
                ;;
            3)
                check_memory_usage
                ;;
            4)
                check_running_services
                ;;
            5)
                cleanup_temp_files
                ;;
            6)
                backup_important_configs
                ;;
            7)
                view_log
                ;;
            8)
                log_info "Exiting maintenance script"
                exit 0
                ;;
            *)
                log_error "Invalid option: $choice"
                ;;
        esac
        
        echo ""
        read -p "Press Enter to continue..."
    done
}

# Check if running with arguments for automation
if [ $# -gt 0 ]; then
    case $1 in
        --full-check)
            run_full_check
            ;;
        --disk-check)
            check_disk_usage
            ;;
        --memory-check)
            check_memory_usage
            ;;
        --service-check)
            check_running_services
            ;;
        --cleanup)
            cleanup_temp_files
            ;;
        --backup)
            backup_important_configs
            ;;
        --help)
            echo "Usage: $0 [--full-check|--disk-check|--memory-check|--service-check|--cleanup|--backup|--help]"
            exit 0
            ;;
        *)
            log_error "Unknown argument: $1"
            exit 1
            ;;
    esac
else
    # Interactive mode
    main
fi
```

## Free Learning Resources

### Interactive Scripting Practice
- [Bash Scripting Tutorial](https://linuxconfig.org/bash-scripting-tutorial-for-beginners) - Comprehensive guide
- [ShellCheck](https://www.shellcheck.net/) - Online shell script analyzer
- [Explainshell](https://explainshell.com/) - Explains shell commands

### Advanced Scripting
- [Advanced Bash-Scripting Guide](https://tldp.org/LDP/abs/html/) - Comprehensive reference
- [Bash Hackers Wiki](https://wiki.bash-hackers.org/) - Advanced techniques
- [Google Shell Style Guide](https://google.github.io/styleguide/shellguide.html) - Best practices

### Practice Challenges
- [HackerRank Shell](https://www.hackerrank.com/domains/shell) - Scripting challenges
- [Bash Pitfalls](https://mywiki.wooledge.org/BashPitfalls) - Common mistakes to avoid

### Video Tutorials
- [Bash Scripting Full Course](https://www.youtube.com/watch?v=e7BufAVwDiM) - Free YouTube course
- [Linux Academy Bash Scripting](https://linuxacademy.com/) - Professional courses

## Next Steps

After mastering shell scripting:

1. **Practice Daily**: Write scripts for your daily tasks
2. **Learn Advanced Topics**: Regular expressions, sed, awk
3. **Explore Configuration Management**: Ansible, Puppet, Chef
4. **Study Security**: Learn about secure scripting practices
5. **Join Communities**: 
   - [r/bash](https://www.reddit.com/r/bash/)
   - [Unix & Linux Stack Exchange](https://unix.stackexchange.com/)

Continue to **Network Configuration and Security** to learn about Linux networking, firewalls, and system security!
