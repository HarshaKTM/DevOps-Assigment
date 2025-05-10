-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20),
    phone VARCHAR(20),
    address TEXT,
    medical_history TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create doctors table
CREATE TABLE IF NOT EXISTS doctors (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id),
    doctor_id INTEGER REFERENCES doctors(id),
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    reason TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create medical records table
CREATE TABLE IF NOT EXISTS medical_records (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id),
    doctor_id INTEGER REFERENCES doctors(id),
    appointment_id INTEGER REFERENCES appointments(id),
    diagnosis TEXT,
    prescription TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_patients_user_id ON patients(user_id);
CREATE INDEX IF NOT EXISTS idx_doctors_user_id ON doctors(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_medical_records_patient_id ON medical_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_doctor_id ON medical_records(doctor_id); 