-- Create medical records table
CREATE TABLE IF NOT EXISTS medical_records (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    appointment_id INTEGER,
    record_date DATE NOT NULL,
    diagnosis TEXT,
    treatment_plan TEXT,
    prescription TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create vital signs table
CREATE TABLE IF NOT EXISTS vital_signs (
    id SERIAL PRIMARY KEY,
    medical_record_id INTEGER NOT NULL REFERENCES medical_records(id) ON DELETE CASCADE,
    blood_pressure VARCHAR(10),  -- Format: "120/80"
    heart_rate INTEGER,          -- In beats per minute
    respiratory_rate INTEGER,    -- In breaths per minute
    temperature DECIMAL(4,1),    -- In Celsius
    oxygen_saturation INTEGER,   -- In percentage
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create lab results table
CREATE TABLE IF NOT EXISTS lab_results (
    id SERIAL PRIMARY KEY,
    medical_record_id INTEGER NOT NULL REFERENCES medical_records(id) ON DELETE CASCADE,
    test_name VARCHAR(100) NOT NULL,
    result TEXT NOT NULL,
    reference_range VARCHAR(100),
    is_abnormal BOOLEAN DEFAULT FALSE,
    notes TEXT,
    test_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create prescriptions table
CREATE TABLE IF NOT EXISTS prescriptions (
    id SERIAL PRIMARY KEY,
    medical_record_id INTEGER NOT NULL REFERENCES medical_records(id) ON DELETE CASCADE,
    medication_name VARCHAR(100) NOT NULL,
    dosage VARCHAR(50) NOT NULL,
    frequency VARCHAR(50) NOT NULL,
    duration VARCHAR(50),
    instructions TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample medical records for completed appointments
INSERT INTO medical_records (patient_id, doctor_id, appointment_id, record_date, diagnosis, treatment_plan, prescription, notes)
VALUES
    -- Patient 1 (Robert Johnson) with Dr. Smith (Cardiology)
    (1, 1, 1, '2024-04-10', 
     'Essential hypertension (I10)', 
     'Continue current medication. Low sodium diet. Regular exercise 30 minutes daily.',
     'Lisinopril 10mg once daily',
     'Patient reports occasional headaches in the morning. BP improved from previous visit but still above target.'),
    
    -- Patient 2 (Emily Williams) with Dr. Jones (Pediatrics)
    (2, 2, 2, '2024-04-15', 
     'Wellness examination (Z00.129)', 
     'Seasonal flu vaccination administered. Next vaccination due in 1 year.',
     'None',
     'Growth and development appropriate for age. All milestones met. No concerns reported by parents.'),
    
    -- Patient 3 (Michael Brown) with Dr. Patel (Orthopedics)
    (3, 3, 3, '2024-04-20', 
     'Chronic pain in knee (M25.562)', 
     'Continue physical therapy twice weekly for 4 more weeks. Home exercises daily.',
     'Naproxen 500mg twice daily as needed for pain',
     'MRI shows minor meniscus tear. Patient reports pain level decreased from 7/10 to 4/10 since starting PT.'),
    
    -- Patient 5 (James Miller) with Dr. Smith (Cardiology)
    (5, 1, 5, '2024-05-01', 
     'Atypical chest pain (R07.89)', 
     'Stress test scheduled for May 15. Continue current medications.',
     'Aspirin 81mg daily',
     'ECG normal. No evidence of acute coronary syndrome. Patient to monitor and report any recurring symptoms.');

-- Insert vital signs for each medical record
INSERT INTO vital_signs (medical_record_id, blood_pressure, heart_rate, respiratory_rate, temperature, oxygen_saturation)
VALUES
    (1, '130/85', 72, 16, 36.7, 98),  -- Patient 1 (Robert Johnson)
    (2, '110/70', 88, 20, 37.1, 99),  -- Patient 2 (Emily Williams)
    (3, '125/82', 76, 17, 36.8, 97),  -- Patient 3 (Michael Brown)
    (4, '118/75', 68, 15, 36.6, 99);  -- Patient 5 (James Miller)

-- Insert lab results
INSERT INTO lab_results (medical_record_id, test_name, result, reference_range, is_abnormal, notes, test_date)
VALUES
    -- For Patient 1 (Robert Johnson)
    (1, 'Total Cholesterol', '210 mg/dL', '< 200 mg/dL', TRUE, 'Slightly elevated', '2024-04-10'),
    (1, 'HDL Cholesterol', '45 mg/dL', '> 40 mg/dL', FALSE, 'Within normal range', '2024-04-10'),
    (1, 'LDL Cholesterol', '140 mg/dL', '< 130 mg/dL', TRUE, 'Moderately elevated', '2024-04-10'),
    (1, 'Triglycerides', '150 mg/dL', '< 150 mg/dL', FALSE, 'Upper limit of normal', '2024-04-10'),
    (1, 'Fasting Blood Glucose', '102 mg/dL', '70-99 mg/dL', TRUE, 'Pre-diabetic range', '2024-04-10'),
    
    -- For Patient 3 (Michael Brown)
    (3, 'Complete Blood Count', 'Normal', 'Normal parameters', FALSE, 'All values within reference range', '2024-04-20'),
    (3, 'C-Reactive Protein', '3.2 mg/L', '< 3.0 mg/L', TRUE, 'Slight elevation suggesting mild inflammation', '2024-04-20'),
    
    -- For Patient 5 (James Miller)
    (4, 'Troponin I', '< 0.01 ng/mL', '< 0.04 ng/mL', FALSE, 'No evidence of myocardial damage', '2024-05-01'),
    (4, 'BNP', '15 pg/mL', '< 100 pg/mL', FALSE, 'Normal heart function indicated', '2024-05-01'),
    (4, 'D-dimer', '210 ng/mL', '< 500 ng/mL', FALSE, 'Low probability of thrombosis', '2024-05-01');

-- Insert prescriptions
INSERT INTO prescriptions (medical_record_id, medication_name, dosage, frequency, duration, instructions, start_date, end_date, is_active)
VALUES
    -- For Patient 1 (Robert Johnson)
    (1, 'Lisinopril', '10 mg', 'Once daily', '90 days', 'Take in the morning with water', '2024-04-10', '2024-07-09', TRUE),
    
    -- For Patient 3 (Michael Brown)
    (3, 'Naproxen', '500 mg', 'Twice daily', '14 days', 'Take with food. Do not take if stomach pain occurs.', '2024-04-20', '2024-05-04', TRUE),
    (3, 'Cyclobenzaprine', '5 mg', 'Once daily at bedtime', '7 days', 'May cause drowsiness. Do not drive after taking.', '2024-04-20', '2024-04-27', FALSE),
    
    -- For Patient 5 (James Miller)
    (4, 'Aspirin', '81 mg', 'Once daily', '30 days', 'Take with food or after meals', '2024-05-01', '2024-05-31', TRUE); 