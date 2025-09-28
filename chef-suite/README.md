# Chef Suite - Brenham Country Club

A comprehensive, open-source culinary operations management system designed to streamline recipe management, inventory tracking, menu building, and operational analytics at Brenham Country Club.

## 🏗️ Architecture Overview

This system consists of modular components:

- **Backend**: FastAPI (Python) with PostgreSQL for audit logging and API endpoints
- **Frontend**: React dashboard for change tracking and rollback
- **Services**: Docker containers for Grocy (inventory), Tandoor Recipes (meal planning), and Metabase (analytics)
- **Infrastructure**: Docker Compose, NGINX, SSL certificates

## 📁 Project Structure

```
chef-suite/
├── backend/          # FastAPI + PostgreSQL backend
├── frontend/         # React dashboard
├── services/         # Docker configs for external services
├── docs/            # Architecture, API, training guides
├── scripts/         # Backup, rollback, alerts
└── .github/workflows/ # CI/CD pipelines
```

## 🚀 Quick Start

1. Clone this repository
2. Run `docker-compose up` from the services directory
3. Set up the backend: `cd backend && pip install -r requirements.txt && uvicorn main:app --reload`
4. Set up the frontend: `cd frontend && npm install && npm start`

## 🔐 Security Features

- Role-based access control (Chef, Manager, Admin)
- JWT authentication
- Two-factor authentication for admins
- Immutable audit logs

## 📊 Key Features

- Recipe versioning with git-style diffs
- Inventory tracking with spoilage alerts
- Menu change tracking and rollback
- Operational analytics dashboard
- Automated notifications and digests

## 🛠️ Development

See individual README files in each component directory for detailed setup instructions.

## 📚 Documentation

- [API Documentation](./docs/api.md)
- [Architecture Guide](./docs/architecture.md)
- [User Training](./docs/training.md)

## 🤝 Contributing

This is an open-source initiative. Contributions welcome!

---

**Executive Chef Jason**  
Brenham Country Club