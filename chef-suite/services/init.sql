-- Chef Suite Database Schema
-- PostgreSQL 15+

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('chef', 'manager', 'admin')),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Recipes table
CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    ingredients JSONB NOT NULL,
    instructions TEXT NOT NULL,
    version INTEGER DEFAULT 1,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Recipe versions for git-style versioning
CREATE TABLE recipe_versions (
    id SERIAL PRIMARY KEY,
    recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    changes JSONB NOT NULL, -- Store diff/changes
    previous_version INTEGER,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inventory changes log
CREATE TABLE inventory_changes (
    id SERIAL PRIMARY KEY,
    item_name VARCHAR(200) NOT NULL,
    change_type VARCHAR(20) NOT NULL CHECK (change_type IN ('addition', 'removal', 'adjustment', 'spoilage')),
    quantity DECIMAL(10,2),
    unit VARCHAR(20),
    reason TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Menu changes tracking
CREATE TABLE menu_changes (
    id SERIAL PRIMARY KEY,
    dish_name VARCHAR(200) NOT NULL,
    change_type VARCHAR(20) NOT NULL CHECK (change_type IN ('added', 'removed', 'modified')),
    details JSONB,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved BOOLEAN DEFAULT FALSE,
    approved_by INTEGER REFERENCES users(id),
    approved_at TIMESTAMP
);

-- System logs for audit trail
CREATE TABLE system_logs (
    id SERIAL PRIMARY KEY,
    action VARCHAR(100) NOT NULL,
    user_id INTEGER REFERENCES users(id),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    details JSONB,
    ip_address INET,
    user_agent TEXT
);

-- Indexes for performance
CREATE INDEX idx_recipes_created_by ON recipes(created_by);
CREATE INDEX idx_recipes_active ON recipes(is_active);
CREATE INDEX idx_recipe_versions_recipe_id ON recipe_versions(recipe_id);
CREATE INDEX idx_inventory_changes_created_at ON inventory_changes(created_at);
CREATE INDEX idx_menu_changes_created_at ON menu_changes(created_at);
CREATE INDEX idx_system_logs_timestamp ON system_logs(timestamp);
CREATE INDEX idx_system_logs_user_id ON system_logs(user_id);

-- Insert default admin user (password: admin123 - change immediately!)
INSERT INTO users (username, password_hash, role, email) 
VALUES ('admin', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6fMhJ6VwO', 'admin', 'admin@brenhamcc.com');

-- Insert sample chef user
INSERT INTO users (username, password_hash, role, email)
VALUES ('chef', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6fMhJ6VwO', 'chef', 'chef@brenhamcc.com');