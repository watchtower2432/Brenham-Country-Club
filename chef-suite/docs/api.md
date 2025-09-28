# Chef Suite API Documentation

## Overview

The Chef Suite API provides RESTful endpoints for managing culinary operations at Brenham Country Club. Built with FastAPI and PostgreSQL, it offers secure, auditable access to recipe management, inventory tracking, and operational analytics.

## Base URL
```
http://localhost:8000
```

## Authentication

All API endpoints (except login) require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Login
**POST** `/auth/login`

Request body:
```json
{
  "username": "chef",
  "password": "password"
}
```

Response:
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer"
}
```

## Recipes

### Get All Recipes
**GET** `/recipes`

Returns a list of all recipes with their current versions.

Response:
```json
[
  {
    "id": 1,
    "name": "Classic Beef Wellington",
    "ingredients": [
      {"name": "beef tenderloin", "quantity": 2, "unit": "lbs"},
      {"name": "puff pastry", "quantity": 1, "unit": "sheet"}
    ],
    "instructions": "Season the beef...",
    "version": 1,
    "created_by": 1,
    "created_at": "2025-01-15T10:30:00Z"
  }
]
```

### Create Recipe
**POST** `/recipes`

Request body:
```json
{
  "name": "New Recipe Name",
  "ingredients": [
    {"name": "ingredient1", "quantity": 1, "unit": "cup"}
  ],
  "instructions": "Step by step instructions..."
}
```

### Get Recipe Versions
**GET** `/recipes/{recipe_id}/versions`

Returns version history for a specific recipe.

## Inventory

### Log Inventory Change
**POST** `/inventory/changes`

Request body:
```json
{
  "item_name": "Tomatoes",
  "change_type": "addition",
  "quantity": 10,
  "unit": "lbs",
  "reason": "Weekly delivery"
}
```

## Audit Logs

### Get System Logs
**GET** `/system/logs?limit=50&user_id=1`

Query parameters:
- `limit`: Number of logs to return (default: 50)
- `user_id`: Filter by user ID
- `action`: Filter by action type

## Menu Management

### Log Menu Change
**POST** `/menu/changes`

Request body:
```json
{
  "dish_name": "Grilled Salmon",
  "change_type": "modified",
  "details": {
    "price_change": {"old": 28.00, "new": 32.00},
    "allergen_added": "nuts"
  }
}
```

## Error Responses

All endpoints return standard HTTP status codes:

- `200`: Success
- `401`: Unauthorized (invalid/missing token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not found
- `422`: Validation error
- `500`: Internal server error

Error response format:
```json
{
  "detail": "Error description"
}
```

## Rate Limiting

- 100 requests per minute per user
- 1000 requests per hour per user

## Data Models

### User Roles
- `chef`: Can view and edit recipes, log inventory changes
- `manager`: All chef permissions plus menu management
- `admin`: Full system access including user management

### Change Types
- Recipes: `created`, `modified`, `versioned`
- Inventory: `addition`, `removal`, `adjustment`, `spoilage`
- Menu: `added`, `removed`, `modified`

## Security Features

- JWT tokens expire after 24 hours
- All changes are logged with user attribution
- Passwords are hashed with bcrypt
- SQL injection protection via parameterized queries
- CORS enabled for frontend integration

## Development

To run the API locally:

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

API documentation is automatically available at `http://localhost:8000/docs` when running.