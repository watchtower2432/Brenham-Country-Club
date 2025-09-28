from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Optional
import jwt
import datetime
import os
from dotenv import load_dotenv
import psycopg2
from psycopg2.extras import RealDictCursor

load_dotenv()

app = FastAPI(title="Chef Suite API", version="1.0.0")

# Security
security = HTTPBearer()

# Database connection
def get_db():
    conn = psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"),
        database=os.getenv("DB_NAME", "chef_suite"),
        user=os.getenv("DB_USER", "chef_user"),
        password=os.getenv("DB_PASSWORD", "secure_password_2025")
    )
    return conn

# JWT Secret
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")

# Models
class User(BaseModel):
    id: int
    username: str
    role: str  # chef, manager, admin

class Recipe(BaseModel):
    id: Optional[int]
    name: str
    ingredients: List[dict]
    instructions: str
    version: int = 1
    created_by: int
    created_at: datetime.datetime

class RecipeVersion(BaseModel):
    id: int
    recipe_id: int
    version: int
    changes: dict
    created_by: int
    created_at: datetime.datetime

# Authentication
def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

def get_current_user(token_data: dict = Depends(verify_token)):
    return User(id=token_data["user_id"], username=token_data["username"], role=token_data["role"])

# Routes
@app.get("/")
async def root():
    return {"message": "Chef Suite API"}

@app.post("/auth/login")
async def login(username: str, password: str):
    # Simplified login - in production, verify against database
    if username == "chef" and password == "password":
        token = jwt.encode({
            "user_id": 1,
            "username": username,
            "role": "chef",
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, SECRET_KEY, algorithm="HS256")
        return {"access_token": token, "token_type": "bearer"}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/recipes", response_model=List[Recipe])
async def get_recipes(current_user: User = Depends(get_current_user)):
    conn = get_db()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute("SELECT * FROM recipes ORDER BY created_at DESC")
    recipes = cursor.fetchall()
    conn.close()
    return recipes

@app.post("/recipes", response_model=Recipe)
async def create_recipe(recipe: Recipe, current_user: User = Depends(get_current_user)):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO recipes (name, ingredients, instructions, version, created_by, created_at)
        VALUES (%s, %s, %s, %s, %s, %s) RETURNING id
    """, (recipe.name, recipe.ingredients, recipe.instructions, recipe.version, current_user.id, datetime.datetime.now()))
    recipe_id = cursor.fetchone()[0]
    conn.commit()
    conn.close()
    recipe.id = recipe_id
    return recipe

@app.get("/recipes/{recipe_id}/versions", response_model=List[RecipeVersion])
async def get_recipe_versions(recipe_id: int, current_user: User = Depends(get_current_user)):
    conn = get_db()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute("SELECT * FROM recipe_versions WHERE recipe_id = %s ORDER BY version DESC", (recipe_id,))
    versions = cursor.fetchall()
    conn.close()
    return versions

# Audit logging
@app.middleware("http")
async def log_requests(request, call_next):
    start_time = datetime.datetime.now()
    response = await call_next(request)
    process_time = datetime.datetime.now() - start_time
    
    # Log to database
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO system_logs (action, user_id, timestamp, details)
        VALUES (%s, %s, %s, %s)
    """, ("api_request", getattr(request.state, 'user_id', None), start_time, f"{request.method} {request.url} - {response.status_code}"))
    conn.commit()
    conn.close()
    
    return response