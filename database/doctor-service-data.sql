-- Create doctors table
CREATE TABLE IF NOT EXISTS doctors (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE,
    specialization VARCHAR(100) NOT NULL,
    license_number VARCHAR(50) NOT NULL UNIQUE,
    years_of_experience INTEGER NOT NULL,
    bio TEXT,
    education TEXT,
    consultation_fee DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create doctor availability table
CREATE TABLE IF NOT EXISTS doctor_availability (
    id SERIAL PRIMARY KEY,
    doctor_id INTEGER NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),  -- 0: Sunday, 1: Monday, etc.
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(doctor_id, day_of_week)
);

-- Insert sample doctor profiles
-- These IDs should match user IDs from auth service
INSERT INTO doctors (user_id, specialization, license_number, years_of_experience, bio, education, consultation_fee)
VALUES
    (3, 'Cardiology', 'LIC123456', 15, 
     'Dr. John Smith is a board-certified cardiologist with extensive experience in treating cardiovascular diseases.',
     'MD from Harvard Medical School, Cardiology Fellowship at Johns Hopkins Hospital',
     150.00),
    
    (4, 'Pediatrics', 'LIC789012', 10, 
     'Dr. Sarah Jones specializes in pediatric care and has helped thousands of children lead healthier lives.',
     'MD from Stanford University, Pediatric Residency at Children''s Hospital of Philadelphia',
     120.00),
    
    (5, 'Orthopedics', 'LIC345678', 12, 
     'Dr. Raj Patel is an orthopedic surgeon specializing in sports medicine and joint replacement.',
     'MD from Yale School of Medicine, Orthopedic Surgery Residency at Mayo Clinic',
     180.00),
    
    (6, 'Dermatology', 'LIC901234', 8, 
     'Dr. Priya Kumar is a dermatologist who specializes in both medical and cosmetic dermatology.',
     'MD from University of California, San Francisco, Dermatology Residency at New York University',
     160.00);

-- Insert sample availability for doctors
-- Dr. Smith (Cardiology)
INSERT INTO doctor_availability (doctor_id, day_of_week, start_time, end_time)
VALUES
    (1, 1, '09:00:00', '17:00:00'), -- Monday
    (1, 3, '09:00:00', '17:00:00'), -- Wednesday
    (1, 5, '09:00:00', '13:00:00'); -- Friday morning

-- Dr. Jones (Pediatrics)
INSERT INTO doctor_availability (doctor_id, day_of_week, start_time, end_time)
VALUES
    (2, 1, '08:00:00', '16:00:00'), -- Monday
    (2, 2, '08:00:00', '16:00:00'), -- Tuesday
    (2, 3, '13:00:00', '19:00:00'), -- Wednesday afternoon/evening
    (2, 4, '08:00:00', '16:00:00'); -- Thursday

-- Dr. Patel (Orthopedics)
INSERT INTO doctor_availability (doctor_id, day_of_week, start_time, end_time)
VALUES
    (3, 2, '09:00:00', '18:00:00'), -- Tuesday
    (3, 4, '09:00:00', '18:00:00'), -- Thursday
    (3, 6, '10:00:00', '15:00:00'); -- Saturday

-- Dr. Kumar (Dermatology)
INSERT INTO doctor_availability (doctor_id, day_of_week, start_time, end_time)
VALUES
    (4, 1, '10:00:00', '18:00:00'), -- Monday
    (4, 3, '10:00:00', '18:00:00'), -- Wednesday
    (4, 5, '10:00:00', '16:00:00'); -- Friday 