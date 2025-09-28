#!/bin/bash

# Chef Suite Backup and Rollback Script
# Version: 1.0
# Author: Jason, Executive Chef
# Date: September 28, 2025

set -e  # Exit on any error

# Configuration
BACKUP_DIR="/opt/chef-suite/backups"
LOG_FILE="/var/log/chef-suite/backup.log"
RETENTION_DAYS=30
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Database connection details (from environment)
DB_HOST=${DB_HOST:-"localhost"}
DB_NAME=${DB_NAME:-"chef_suite"}
DB_USER=${DB_USER:-"chef_user"}
DB_PASSWORD=${DB_PASSWORD:-"secure_password_2025"}

# Logging function
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Create backup directory if it doesn't exist
setup_backup_dir() {
    if [ ! -d "$BACKUP_DIR" ]; then
        mkdir -p "$BACKUP_DIR"
        chmod 700 "$BACKUP_DIR"
        log "Created backup directory: $BACKUP_DIR"
    fi
}

# Backup PostgreSQL database
backup_database() {
    local backup_file="$BACKUP_DIR/db_backup_$TIMESTAMP.sql.gz"
    log "Starting database backup: $backup_file"

    PGPASSWORD="$DB_PASSWORD" pg_dump \
        --host="$DB_HOST" \
        --username="$DB_USER" \
        --dbname="$DB_NAME" \
        --no-password \
        --format=custom \
        --compress=9 \
        --file="$backup_file"

    log "Database backup completed: $backup_file"
    echo "$backup_file"
}

# Backup application data and configurations
backup_application() {
    local backup_file="$BACKUP_DIR/app_backup_$TIMESTAMP.tar.gz"
    log "Starting application backup: $backup_file"

    # Backup directories (adjust paths as needed)
    tar -czf "$backup_file" \
        --exclude='*.log' \
        --exclude='node_modules' \
        --exclude='.git' \
        /opt/chef-suite/backend \
        /opt/chef-suite/frontend \
        /opt/chef-suite/services

    log "Application backup completed: $backup_file"
    echo "$backup_file"
}

# Clean up old backups
cleanup_old_backups() {
    log "Cleaning up backups older than $RETENTION_DAYS days"

    find "$BACKUP_DIR" -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete
    find "$BACKUP_DIR" -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete

    log "Cleanup completed"
}

# Verify backup integrity
verify_backup() {
    local backup_file="$1"
    local file_type="${backup_file##*.}"

    log "Verifying backup: $backup_file"

    if [[ "$file_type" == "gz" ]]; then
        if [[ "$backup_file" == *"sql.gz" ]]; then
            # Verify PostgreSQL backup
            PGPASSWORD="$DB_PASSWORD" pg_restore --list "$backup_file" > /dev/null
        else
            # Verify tar.gz archive
            tar -tzf "$backup_file" > /dev/null
        fi
    fi

    log "Backup verification successful: $backup_file"
}

# Rollback database from backup
rollback_database() {
    local backup_file="$1"

    if [ ! -f "$backup_file" ]; then
        log "ERROR: Backup file not found: $backup_file"
        exit 1
    fi

    log "Starting database rollback from: $backup_file"

    # Create pre-rollback backup
    local pre_rollback_backup="$BACKUP_DIR/pre_rollback_$TIMESTAMP.sql.gz"
    backup_database > /dev/null 2>&1
    mv "$(cat)" "$pre_rollback_backup"
    log "Pre-rollback backup created: $pre_rollback_backup"

    # Stop application services
    log "Stopping application services..."
    docker-compose -f /opt/chef-suite/services/docker-compose.yml stop backend frontend

    # Drop and recreate database
    PGPASSWORD="$DB_PASSWORD" psql \
        --host="$DB_HOST" \
        --username="$DB_USER" \
        --dbname="postgres" \
        --command="DROP DATABASE IF EXISTS $DB_NAME;"

    PGPASSWORD="$DB_PASSWORD" psql \
        --host="$DB_HOST" \
        --username="$DB_USER" \
        --dbname="postgres" \
        --command="CREATE DATABASE $DB_NAME;"

    # Restore from backup
    PGPASSWORD="$DB_PASSWORD" pg_restore \
        --host="$DB_HOST" \
        --username="$DB_USER" \
        --dbname="$DB_NAME" \
        --no-password \
        --clean \
        --if-exists \
        --create \
        "$backup_file"

    # Restart services
    log "Restarting application services..."
    docker-compose -f /opt/chef-suite/services/docker-compose.yml start backend frontend

    log "Database rollback completed successfully"
}

# Send notification (placeholder - integrate with your notification system)
send_notification() {
    local subject="$1"
    local message="$2"

    log "Sending notification: $subject"

    # Example: Send email or Slack notification
    # echo "$message" | mail -s "$subject" admin@brenhamcc.com
    # curl -X POST -H 'Content-type: application/json' --data "{\"text\":\"$message\"}" $SLACK_WEBHOOK

    log "Notification sent"
}

# Main backup function
perform_backup() {
    log "=== Starting Chef Suite Backup ==="

    setup_backup_dir

    # Perform backups
    db_backup=$(backup_database)
    app_backup=$(backup_application)

    # Verify backups
    verify_backup "$db_backup"
    verify_backup "$app_backup"

    # Cleanup old backups
    cleanup_old_backups

    # Send success notification
    send_notification \
        "Chef Suite Backup Completed" \
        "Backup completed successfully. Database: $db_backup, Application: $app_backup"

    log "=== Backup completed successfully ==="
}

# Main rollback function
perform_rollback() {
    local backup_file="$1"

    if [ -z "$backup_file" ]; then
        log "ERROR: No backup file specified for rollback"
        echo "Usage: $0 rollback <backup_file>"
        exit 1
    fi

    log "=== Starting Chef Suite Rollback ==="

    # Confirm rollback (in production, you might want interactive confirmation)
    read -p "Are you sure you want to rollback to $backup_file? This will overwrite current data. (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log "Rollback cancelled by user"
        exit 0
    fi

    rollback_database "$backup_file"

    send_notification \
        "Chef Suite Rollback Completed" \
        "System rolled back to backup: $backup_file"

    log "=== Rollback completed successfully ==="
}

# Main script logic
case "$1" in
    "backup")
        perform_backup
        ;;
    "rollback")
        perform_rollback "$2"
        ;;
    "cleanup")
        setup_backup_dir
        cleanup_old_backups
        ;;
    "list")
        echo "Available backups in $BACKUP_DIR:"
        ls -la "$BACKUP_DIR"/*.sql.gz "$BACKUP_DIR"/*.tar.gz 2>/dev/null || echo "No backups found"
        ;;
    *)
        echo "Usage: $0 {backup|rollback <backup_file>|cleanup|list}"
        echo ""
        echo "Commands:"
        echo "  backup    - Create full system backup"
        echo "  rollback  - Rollback database to specified backup"
        echo "  cleanup   - Remove old backups"
        echo "  list      - List available backups"
        exit 1
        ;;
esac