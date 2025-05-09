import { MedicalRecord } from '../../store/slices/medicalRecordsSlice';

// Generate dates
const today = new Date();
const lastWeek = new Date(today);
lastWeek.setDate(lastWeek.getDate() - 7);
const lastMonth = new Date(today);
lastMonth.setDate(lastMonth.getDate() - 30);
const twoMonthsAgo = new Date(today);
twoMonthsAgo.setDate(twoMonthsAgo.getDate() - 60);
const sixMonthsAgo = new Date(today);
sixMonthsAgo.setDate(sixMonthsAgo.getDate() - 180);

export const mockMedicalRecords: MedicalRecord[] = [
  {
    id: 1,
    patientId: 101,
    recordType: 'lab_result',
    title: 'Complete Blood Count',
    description: 'Blood test results show normal red and white blood cell counts. Hemoglobin levels within normal range.',
    date: lastWeek.toISOString().split('T')[0],
    performedBy: 'Dr. Sarah Johnson',
    fileUrl: 'https://example.com/files/cbc_results.pdf',
    attachments: [
      {
        name: 'CBC Results.pdf',
        url: 'https://example.com/files/cbc_results.pdf',
        type: 'application/pdf',
        size: 245000
      }
    ],
    createdAt: lastWeek.toISOString(),
    updatedAt: lastWeek.toISOString()
  },
  {
    id: 2,
    patientId: 101,
    recordType: 'prescription',
    title: 'Amoxicillin',
    description: 'Prescription for respiratory infection. 500mg three times daily for 10 days.',
    date: lastWeek.toISOString().split('T')[0],
    performedBy: 'Dr. Michael Lee',
    fileUrl: 'https://example.com/files/amoxicillin_prescription.pdf',
    attachments: [
      {
        name: 'Amoxicillin Prescription.pdf',
        url: 'https://example.com/files/amoxicillin_prescription.pdf',
        type: 'application/pdf',
        size: 125000
      }
    ],
    createdAt: lastWeek.toISOString(),
    updatedAt: lastWeek.toISOString()
  },
  {
    id: 3,
    patientId: 101,
    recordType: 'diagnosis',
    title: 'Acute Bronchitis',
    description: 'Patient diagnosed with acute bronchitis. Symptoms include persistent cough and mild fever.',
    date: lastWeek.toISOString().split('T')[0],
    performedBy: 'Dr. Michael Lee',
    createdAt: lastWeek.toISOString(),
    updatedAt: lastWeek.toISOString()
  },
  {
    id: 4,
    patientId: 101,
    recordType: 'imaging',
    title: 'Chest X-Ray',
    description: 'Chest X-ray shows no significant abnormalities in lungs or heart.',
    date: lastMonth.toISOString().split('T')[0],
    performedBy: 'Dr. James Wilson',
    fileUrl: 'https://example.com/files/chest_xray.jpg',
    attachments: [
      {
        name: 'Chest X-Ray.jpg',
        url: 'https://example.com/files/chest_xray.jpg',
        type: 'image/jpeg',
        size: 1500000
      },
      {
        name: 'Radiologist Report.pdf',
        url: 'https://example.com/files/xray_report.pdf',
        type: 'application/pdf',
        size: 350000
      }
    ],
    createdAt: lastMonth.toISOString(),
    updatedAt: lastMonth.toISOString()
  },
  {
    id: 5,
    patientId: 101,
    recordType: 'vaccination',
    title: 'Influenza Vaccine',
    description: 'Annual flu vaccination administered. No adverse reactions observed.',
    date: twoMonthsAgo.toISOString().split('T')[0],
    performedBy: 'Dr. Lisa Taylor',
    createdAt: twoMonthsAgo.toISOString(),
    updatedAt: twoMonthsAgo.toISOString()
  },
  {
    id: 6,
    patientId: 101,
    recordType: 'visit_summary',
    title: 'Annual Physical Examination',
    description: 'Routine physical examination completed. Overall health status is good.',
    date: sixMonthsAgo.toISOString().split('T')[0],
    performedBy: 'Dr. Sarah Johnson',
    fileUrl: 'https://example.com/files/annual_physical_summary.pdf',
    attachments: [
      {
        name: 'Annual Physical Summary.pdf',
        url: 'https://example.com/files/annual_physical_summary.pdf',
        type: 'application/pdf',
        size: 420000
      }
    ],
    createdAt: sixMonthsAgo.toISOString(),
    updatedAt: sixMonthsAgo.toISOString()
  },
  {
    id: 7,
    patientId: 101,
    recordType: 'lab_result',
    title: 'Lipid Panel',
    description: 'Cholesterol levels slightly elevated. LDL: 135 mg/dL, HDL: 45 mg/dL, Triglycerides: 155 mg/dL',
    date: sixMonthsAgo.toISOString().split('T')[0],
    performedBy: 'Dr. Sarah Johnson',
    fileUrl: 'https://example.com/files/lipid_panel_results.pdf',
    attachments: [
      {
        name: 'Lipid Panel Results.pdf',
        url: 'https://example.com/files/lipid_panel_results.pdf',
        type: 'application/pdf',
        size: 220000
      }
    ],
    createdAt: sixMonthsAgo.toISOString(),
    updatedAt: sixMonthsAgo.toISOString()
  },
  {
    id: 8,
    patientId: 101,
    recordType: 'other',
    title: 'Nutrition Consultation',
    description: 'Dietary recommendations for reducing cholesterol and improving cardiovascular health.',
    date: sixMonthsAgo.toISOString().split('T')[0],
    performedBy: 'Jane Wilson, RD',
    createdAt: sixMonthsAgo.toISOString(),
    updatedAt: sixMonthsAgo.toISOString()
  }
]; 