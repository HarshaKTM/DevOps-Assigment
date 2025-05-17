-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Stored as hash
    role VARCHAR(20) NOT NULL CHECK (role IN ('patient', 'doctor', 'admin')),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create refresh token table
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample admins (password: Admin123!)
INSERT INTO users (username, email, password, role, first_name, last_name, phone)
VALUES
    ('admin1', 'admin1@healthcare.com', '$2a$10$SomeHashForAdmin1Password', 'admin', 'Admin', 'User', '+1234567890'),
    ('admin2', 'admin2@healthcare.com', '$2a$10$SomeHashForAdmin2Password', 'admin', 'System', 'Admin', '+1987654321');

-- Insert sample doctors (password: Doctor123!)
INSERT INTO users (username, email, password, role, first_name, last_name, phone)
VALUES
    ('drsmith', 'drsmith@healthcare.com', '$2a$10$SomeHashForDrSmithPassword', 'doctor', 'John', 'Smith', '+1122334455'),
    ('drjones', 'drjones@healthcare.com', '$2a$10$SomeHashForDrJonesPassword', 'doctor', 'Sarah', 'Jones', '+1555666777'),
    ('drpatel', 'drpatel@healthcare.com', '$2a$10$SomeHashForDrPatelPassword', 'doctor', 'Raj', 'Patel', '+1888999000'),
    ('drkumar', 'drkumar@healthcare.com', '$2a$10$SomeHashForDrKumarPassword', 'doctor', 'Priya', 'Kumar', '+1444333222');

-- Insert sample patients (password: Patient123!)
INSERT INTO users (username, email, password, role, first_name, last_name, phone)
VALUES
    ('patient1', 'patient1@example.com', '$2a$10$SomeHashForPatient1Password', 'patient', 'Robert', 'Johnson', '+1222333444'),
    ('patient2', 'patient2@example.com', '$2a$10$SomeHashForPatient2Password', 'patient', 'Emily', 'Williams', '+1333444555'),
    ('patient3', 'patient3@example.com', '$2a$10$SomeHashForPatient3Password', 'patient', 'Michael', 'Brown', '+1444555666'),
    ('patient4', 'patient4@example.com', '$2a$10$SomeHashForPatient4Password', 'patient', 'Emma', 'Davis', '+1555666777'),
    ('patient5', 'patient5@example.com', '$2a$10$SomeHashForPatient5Password', 'patient', 'James', 'Miller', '+1666777888'),
    ('patient6', 'patient6@example.com', '$2a$10$SomeHashForPatient6Password', 'patient', 'Olivia', 'Wilson', '+1777888999'),
    ('patient7', 'patient7@example.com', '$2a$10$SomeHashForPatient7Password', 'patient', 'William', 'Moore', '+1888999000'),
    ('patient8', 'patient8@example.com', '$2a$10$SomeHashForPatient8Password', 'patient', 'Sophia', 'Taylor', '+1999000111'); 