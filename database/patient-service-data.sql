-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Other')),
    blood_group VARCHAR(5),
    height DECIMAL(5,2), -- in cm
    weight DECIMAL(5,2), -- in kg
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    address TEXT,
    insurance_provider VARCHAR(100),
    insurance_policy_number VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create allergies table
CREATE TABLE IF NOT EXISTS allergies (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    allergy_name VARCHAR(100) NOT NULL,
    severity VARCHAR(20) CHECK (severity IN ('Mild', 'Moderate', 'Severe')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create medical history table
CREATE TABLE IF NOT EXISTS medical_history (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    condition_name VARCHAR(100) NOT NULL,
    diagnosed_date DATE,
    treatment TEXT,
    is_current BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample patient profiles
-- These IDs should match user IDs from auth service
INSERT INTO patients (user_id, date_of_birth, gender, blood_group, height, weight, emergency_contact_name, emergency_contact_phone, address, insurance_provider, insurance_policy_number)
VALUES
    (7, '1985-06-15', 'Male', 'O+', 178.5, 82.5, 'Mary Johnson', '+1222333445', '123 Main St, Anytown, USA', 'Blue Cross', 'BC98765432'),
    (8, '1992-03-22', 'Female', 'A+', 165.0, 60.0, 'James Williams', '+1333444556', '456 Oak Ave, Anytown, USA', 'Aetna', 'AE76543210'),
    (9, '1978-11-30', 'Male', 'B-', 182.0, 88.0, 'Susan Brown', '+1444555667', '789 Pine Rd, Anytown, USA', 'UnitedHealth', 'UH54321098'),
    (10, '1990-08-12', 'Female', 'AB+', 170.0, 65.0, 'Michael Davis', '+1555666778', '101 Cedar Ln, Anytown, USA', 'Cigna', 'CI43210987'),
    (11, '1975-01-05', 'Male', 'A-', 175.0, 78.0, 'Jennifer Miller', '+1666777889', '202 Maple Dr, Anytown, USA', 'Humana', 'HU32109876'),
    (12, '1988-07-18', 'Female', 'O-', 163.0, 58.0, 'David Wilson', '+1777888990', '303 Birch Blvd, Anytown, USA', 'Kaiser', 'KP21098765'),
    (13, '1982-12-01', 'Male', 'B+', 180.0, 85.0, 'Elizabeth Moore', '+1888999001', '404 Walnut St, Anytown, USA', 'Anthem', 'AN10987654'),
    (14, '1995-05-20', 'Female', 'A+', 168.0, 62.0, 'Richard Taylor', '+1999000112', '505 Cherry Ave, Anytown, USA', 'Medicaid', 'MD09876543');

-- Insert sample allergies
INSERT INTO allergies (patient_id, allergy_name, severity, notes)
VALUES
    (1, 'Penicillin', 'Severe', 'Develops rash and difficulty breathing'),
    (1, 'Peanuts', 'Moderate', 'Facial swelling and hives'),
    (2, 'Shellfish', 'Severe', 'Anaphylactic reaction'),
    (3, 'Latex', 'Mild', 'Skin irritation and redness'),
    (4, 'Aspirin', 'Moderate', 'Respiratory issues'),
    (5, 'Dairy', 'Mild', 'Digestive discomfort'),
    (6, 'Sulfa drugs', 'Severe', 'Develops severe rash and fever'),
    (7, 'Ragweed', 'Moderate', 'Seasonal respiratory symptoms'),
    (8, 'Bee stings', 'Severe', 'Anaphylactic reaction');

-- Insert sample medical history
INSERT INTO medical_history (patient_id, condition_name, diagnosed_date, treatment, is_current, notes)
VALUES
    (1, 'Hypertension', '2018-03-10', 'Lisinopril 10mg daily', TRUE, 'Blood pressure well-controlled with medication'),
    (1, 'Appendicitis', '2010-06-22', 'Appendectomy', FALSE, 'Successfully treated with surgery'),
    (2, 'Asthma', '2005-11-15', 'Albuterol inhaler as needed', TRUE, 'Mild asthma, triggered by exercise and cold weather'),
    (3, 'Type 2 Diabetes', '2015-08-05', 'Metformin 500mg twice daily', TRUE, 'Diet controlled with medication support'),
    (4, 'Migraine', '2012-02-18', 'Sumatriptan as needed', TRUE, 'Occurs approximately twice monthly'),
    (5, 'Fractured wrist', '2019-01-25', 'Cast for 6 weeks', FALSE, 'Left wrist, healed completely'),
    (6, 'Depression', '2017-07-10', 'Sertraline 50mg daily', TRUE, 'Significant improvement with medication and therapy'),
    (7, 'GERD', '2016-04-30', 'Omeprazole 20mg daily', TRUE, 'Symptoms well-managed with medication and dietary changes'),
    (8, 'Hypothyroidism', '2014-09-12', 'Levothyroxine 75mcg daily', TRUE, 'Regular blood tests every 6 months'); 