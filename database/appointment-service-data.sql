-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Scheduled', 'Completed', 'Cancelled', 'No-show')),
    type VARCHAR(50) NOT NULL DEFAULT 'Regular Checkup',
    reason TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create appointments history table for tracking changes
CREATE TABLE IF NOT EXISTS appointment_history (
    id SERIAL PRIMARY KEY,
    appointment_id INTEGER NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    changed_by_user_id INTEGER NOT NULL,
    old_status VARCHAR(20),
    new_status VARCHAR(20) NOT NULL,
    reason_for_change TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample appointments (mix of past and future)
-- Past appointments (completed or cancelled)
INSERT INTO appointments (patient_id, doctor_id, appointment_date, start_time, end_time, status, type, reason, notes)
VALUES
    -- Patient 1 (Robert Johnson) with Dr. Smith (Cardiology)
    (1, 1, '2024-04-10', '10:00:00', '10:30:00', 'Completed', 'Regular Checkup', 
     'Annual heart checkup', 'Blood pressure: 130/85. Patient advised to reduce sodium intake.'),
    
    -- Patient 2 (Emily Williams) with Dr. Jones (Pediatrics)
    (2, 2, '2024-04-15', '09:00:00', '09:20:00', 'Completed', 'Vaccination', 
     'Seasonal flu vaccine', 'Vaccination administered without complications.'),
    
    -- Patient 3 (Michael Brown) with Dr. Patel (Orthopedics)
    (3, 3, '2024-04-20', '14:00:00', '14:45:00', 'Completed', 'Follow-up', 
     'Knee pain follow-up', 'Showing improvement. Recommended continuing physical therapy for 4 more weeks.'),
    
    -- Patient 4 (Emma Davis) with Dr. Kumar (Dermatology)
    (4, 4, '2024-04-25', '11:00:00', '11:30:00', 'Cancelled', 'Skin Examination', 
     'Rash on arms', 'Patient cancelled due to scheduling conflict.'),
    
    -- Patient 5 (James Miller) with Dr. Smith (Cardiology)
    (5, 1, '2024-05-01', '15:00:00', '15:30:00', 'Completed', 'ECG Test', 
     'Chest discomfort', 'ECG showed normal sinus rhythm. Advised stress test as next step.');

-- Future appointments (scheduled)
INSERT INTO appointments (patient_id, doctor_id, appointment_date, start_time, end_time, status, type, reason)
VALUES
    -- Patient 6 (Olivia Wilson) with Dr. Jones (Pediatrics)
    (6, 2, '2025-05-25', '10:00:00', '10:20:00', 'Scheduled', 'Regular Checkup', 
     'Annual wellness visit'),
    
    -- Patient 7 (William Moore) with Dr. Patel (Orthopedics)
    (7, 3, '2025-05-26', '11:00:00', '11:45:00', 'Scheduled', 'Consultation', 
     'Lower back pain evaluation'),
    
    -- Patient 8 (Sophia Taylor) with Dr. Kumar (Dermatology)
    (8, 4, '2025-05-27', '14:00:00', '14:30:00', 'Scheduled', 'Skin Examination', 
     'Mole evaluation'),
    
    -- Patient 1 (Robert Johnson) with Dr. Smith (Cardiology) - Follow-up
    (1, 1, '2025-05-28', '09:00:00', '09:30:00', 'Scheduled', 'Follow-up', 
     'Blood pressure follow-up'),
    
    -- Patient 3 (Michael Brown) with Dr. Kumar (Dermatology)
    (3, 4, '2025-05-29', '13:00:00', '13:30:00', 'Scheduled', 'Consultation', 
     'Psoriasis treatment options');

-- Insert appointment history records
INSERT INTO appointment_history (appointment_id, changed_by_user_id, old_status, new_status, reason_for_change)
VALUES
    (1, 3, 'Scheduled', 'Completed', 'Appointment completed successfully'),
    (2, 4, 'Scheduled', 'Completed', 'Appointment completed successfully'),
    (3, 5, 'Scheduled', 'Completed', 'Appointment completed successfully'),
    (4, 6, 'Scheduled', 'Cancelled', 'Patient requested cancellation'),
    (5, 3, 'Scheduled', 'Completed', 'Appointment completed successfully'); 