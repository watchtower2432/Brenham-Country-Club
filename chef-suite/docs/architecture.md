# Chef Suite Architecture Guide

## System Overview

Chef Suite is a comprehensive culinary operations management system designed for enterprise-grade reliability, security, and auditability. The system integrates multiple open-source components with custom FastAPI backend services.

## Core Components

### 1. Backend Services (FastAPI + PostgreSQL)
- **Purpose**: Custom API endpoints, authentication, audit logging
- **Technology**: Python 3.11+, FastAPI, PostgreSQL 15
- **Responsibilities**:
  - JWT-based authentication
  - Recipe versioning and change tracking
  - Inventory change logging
  - Menu modification tracking
  - System audit trails
  - User role management

### 2. Recipe Management (Tandoor Recipes)
- **Purpose**: Self-hosted recipe database and meal planning
- **Technology**: Django-based application
- **Integration**: REST API calls for recipe synchronization
- **Features**: Recipe scaling, nutritional information, shopping lists

### 3. Inventory Management (Grocy)
- **Purpose**: Stock tracking and inventory management
- **Technology**: PHP-based web application
- **Integration**: API integration for real-time stock updates
- **Features**: Barcode scanning, expiration tracking, consumption logging

### 4. Analytics Dashboard (Metabase)
- **Purpose**: Business intelligence and operational reporting
- **Technology**: Clojure-based analytics platform
- **Integration**: Direct PostgreSQL connection for live dashboards
- **Features**: Custom queries, scheduled reports, data visualization

### 5. Frontend Dashboard (React)
- **Purpose**: Unified user interface for all operations
- **Technology**: React 18, Material-UI, Axios
- **Features**: Responsive design, real-time updates, role-based navigation

## Database Schema

### Core Tables

```sql
-- User management and authentication
users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  password_hash VARCHAR(255),
  role VARCHAR(20) CHECK (role IN ('chef', 'manager', 'admin')),
  email VARCHAR(100),
  created_at TIMESTAMP,
  last_login TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
)

-- Recipe storage with versioning
recipes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200),
  ingredients JSONB,
  instructions TEXT,
  version INTEGER DEFAULT 1,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
)

-- Git-style recipe versioning
recipe_versions (
  id SERIAL PRIMARY KEY,
  recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
  version INTEGER,
  changes JSONB,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP
)

-- Inventory change tracking
inventory_changes (
  id SERIAL PRIMARY KEY,
  item_name VARCHAR(200),
  change_type VARCHAR(20),
  quantity DECIMAL(10,2),
  unit VARCHAR(20),
  reason TEXT,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP
)

-- Menu change logging
menu_changes (
  id SERIAL PRIMARY KEY,
  dish_name VARCHAR(200),
  change_type VARCHAR(20),
  details JSONB,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP,
  approved BOOLEAN DEFAULT FALSE,
  approved_by INTEGER REFERENCES users(id),
  approved_at TIMESTAMP
)

-- Comprehensive audit logging
system_logs (
  id SERIAL PRIMARY KEY,
  action VARCHAR(100),
  user_id INTEGER REFERENCES users(id),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  details JSONB,
  ip_address INET,
  user_agent TEXT
)
```

## Security Architecture

### Authentication & Authorization
- **JWT Tokens**: 24-hour expiration, secure storage
- **Role-Based Access**: Hierarchical permissions (chef < manager < admin)
- **Password Security**: bcrypt hashing, complexity requirements
- **Session Management**: Automatic logout on inactivity

### Data Protection
- **Encryption**: TLS 1.3 for all communications
- **Database Security**: Parameterized queries, connection pooling
- **Audit Trails**: Immutable logging of all changes
- **Backup Security**: Encrypted offsite backups

### Network Security
- **Reverse Proxy**: NGINX with SSL termination
- **Firewall**: Restricted ports and IP whitelisting
- **Rate Limiting**: API protection against abuse
- **CORS**: Configured for frontend domain only

## Deployment Architecture

### Docker Compose Stack
```yaml
services:
  postgres:     # Database layer
  tandoor:      # Recipe management
  grocy:        # Inventory tracking
  metabase:     # Analytics
  backend:      # Custom API services
  frontend:     # React dashboard
  nginx:        # Reverse proxy & SSL
```

### Production Considerations
- **Load Balancing**: Multiple backend instances
- **Database Replication**: Master-slave PostgreSQL setup
- **Monitoring**: Prometheus + Grafana stack
- **Backup Strategy**: Daily automated backups with 30-day retention

## Integration Patterns

### API Communication
- **RESTful APIs**: Standard HTTP methods and status codes
- **JSON Format**: Consistent data serialization
- **Error Handling**: Structured error responses
- **Versioning**: API versioning for backward compatibility

### Data Synchronization
- **Event-Driven**: Change events trigger cross-service updates
- **Idempotent Operations**: Safe retry mechanisms
- **Conflict Resolution**: Version-based conflict detection
- **Rollback Support**: Transactional operations with compensation

## Monitoring & Observability

### Application Metrics
- **Performance**: Response times, throughput, error rates
- **Business KPIs**: Recipe usage, inventory turnover, menu changes
- **Security Events**: Failed logins, permission violations
- **System Health**: CPU, memory, disk usage

### Logging Strategy
- **Structured Logging**: JSON format with consistent fields
- **Log Levels**: DEBUG, INFO, WARN, ERROR
- **Centralized Storage**: Elasticsearch or similar
- **Retention Policy**: 90 days hot, 1 year cold storage

## Scalability Considerations

### Horizontal Scaling
- **Stateless Services**: Backend can scale horizontally
- **Database Sharding**: Partition by tenant or time
- **Caching Layer**: Redis for session and API caching
- **CDN Integration**: Static asset delivery

### Performance Optimization
- **Database Indexing**: Optimized for common query patterns
- **Query Optimization**: Efficient SQL with proper joins
- **Caching Strategy**: Application-level and database caching
- **Asset Optimization**: Minified JS/CSS, image optimization

## Disaster Recovery

### Backup Strategy
- **Database Backups**: Daily full, hourly incremental
- **File Backups**: Recipe images, configuration files
- **Offsite Storage**: Encrypted cloud storage
- **Recovery Testing**: Quarterly DR exercises

### Business Continuity
- **RTO/RPO**: 4-hour recovery time, 1-hour data loss tolerance
- **Failover**: Automatic service failover
- **Communication**: Incident response procedures
- **Testing**: Regular failover and recovery testing

## Development Workflow

### CI/CD Pipeline
- **GitHub Actions**: Automated testing and deployment
- **Code Quality**: Linting, security scanning, test coverage
- **Environment Promotion**: Dev → Staging → Production
- **Rollback Procedures**: Automated rollback on failures

### Testing Strategy
- **Unit Tests**: Component-level testing
- **Integration Tests**: API and service integration
- **End-to-End Tests**: Full user workflow testing
- **Performance Tests**: Load and stress testing

This architecture provides a solid foundation for scalable, secure, and maintainable culinary operations management while remaining cost-effective through open-source components.