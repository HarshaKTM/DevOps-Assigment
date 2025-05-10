import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import '../../styles/theme.css';
import '../../styles/dashboard.css';

const PatientDashboard = () => {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to get user data
    setTimeout(() => {
      setUser({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        dateOfBirth: '1980-05-15',
        gender: 'Male',
        phoneNumber: '(123) 456-7890',
      });
      
      // Simulate API call to get appointments
      setAppointments([
        {
          id: 1,
          date: '2023-12-15',
          time: '10:00 AM',
          doctor: 'Dr. Jane Smith',
          specialty: 'Cardiology',
          status: 'scheduled'
        },
        {
          id: 2,
          date: '2023-12-20',
          time: '2:30 PM',
          doctor: 'Dr. Robert Johnson',
          specialty: 'Dermatology',
          status: 'scheduled'
        }
      ]);
      
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="container" style={{ padding: '3rem 0', textAlign: 'center' }}>
          <h2>Loading dashboard...</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="hero">
        <div className="container">
          <h1>Welcome, {user.firstName}!</h1>
          <p>Manage your healthcare needs all in one place.</p>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="container">
          <div className="dashboard-grid">
            <div className="dashboard-sidebar">
              <div className="user-profile card">
                <div className="card-content">
                  <div className="profile-header">
                    <div className="avatar">
                      <img src="https://i.pravatar.cc/150?u=patient" alt="Profile" />
                    </div>
                    <h3>{user.firstName} {user.lastName}</h3>
                    <p>{user.email}</p>
                  </div>
                  
                  <div className="profile-details">
                    <div className="detail-row">
                      <span className="detail-label">Date of Birth:</span>
                      <span className="detail-value">{user.dateOfBirth}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Gender:</span>
                      <span className="detail-value">{user.gender}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Phone:</span>
                      <span className="detail-value">{user.phoneNumber}</span>
                    </div>
                  </div>
                  
                  <div className="profile-actions">
                    <Link to="/patient/profile" className="btn btn-outline">Edit Profile</Link>
                  </div>
                </div>
              </div>
              
              <div className="dashboard-nav card">
                <div className="card-content">
                  <h3>Quick Links</h3>
                  <ul className="dashboard-menu">
                    <li className="active"><Link to="/patient/dashboard"><i className="fas fa-home"></i> Dashboard</Link></li>
                    <li><Link to="/patient/appointments"><i className="fas fa-calendar-alt"></i> Appointments</Link></li>
                    <li><Link to="/patient/medical-records"><i className="fas fa-file-medical"></i> Medical Records</Link></li>
                    <li><Link to="/patient/prescriptions"><i className="fas fa-prescription-bottle-alt"></i> Prescriptions</Link></li>
                    <li><Link to="/patient/doctors"><i className="fas fa-user-md"></i> My Doctors</Link></li>
                    <li><Link to="/patient/messages"><i className="fas fa-envelope"></i> Messages</Link></li>
                    <li><Link to="/patient/billing"><i className="fas fa-file-invoice-dollar"></i> Billing</Link></li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="dashboard-main">
              <div className="card">
                <div className="card-content">
                  <div className="card-header">
                    <h3>Upcoming Appointments</h3>
                    <Link to="/patient/appointments/new" className="btn btn-sm btn-primary">Schedule New</Link>
                  </div>
                  
                  {appointments.length > 0 ? (
                    <div className="appointments-list">
                      {appointments.map(appointment => (
                        <div key={appointment.id} className="appointment-item">
                          <div className="appointment-date">
                            <div className="date-badge">
                              <span className="month">{new Date(appointment.date).toLocaleString('default', { month: 'short' })}</span>
                              <span className="day">{new Date(appointment.date).getDate()}</span>
                            </div>
                            <span className="time">{appointment.time}</span>
                          </div>
                          
                          <div className="appointment-details">
                            <h4>{appointment.doctor}</h4>
                            <p>{appointment.specialty}</p>
                          </div>
                          
                          <div className="appointment-actions">
                            <span className={`status-badge status-${appointment.status}`}>
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </span>
                            <div className="action-buttons">
                              <button className="btn btn-sm btn-outline">Reschedule</button>
                              <button className="btn btn-sm btn-outline">Cancel</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <div className="empty-icon">
                        <i className="fas fa-calendar-times"></i>
                      </div>
                      <p>You have no upcoming appointments.</p>
                      <Link to="/patient/appointments/new" className="btn btn-primary">Schedule Appointment</Link>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid">
                <div className="card">
                  <div className="card-content">
                    <div className="card-icon">
                      <i className="fas fa-stethoscope"></i>
                    </div>
                    <h3>Find a Doctor</h3>
                    <p>Search for specialists and primary care physicians in your network.</p>
                    <Link to="/patient/find-doctor" className="btn btn-outline">Search</Link>
                  </div>
                </div>
                
                <div className="card">
                  <div className="card-content">
                    <div className="card-icon">
                      <i className="fas fa-file-medical-alt"></i>
                    </div>
                    <h3>Medical Records</h3>
                    <p>View and download your medical records, test results, and treatment history.</p>
                    <Link to="/patient/medical-records" className="btn btn-outline">View Records</Link>
                  </div>
                </div>
                
                <div className="card">
                  <div className="card-content">
                    <div className="card-icon">
                      <i className="fas fa-comments"></i>
                    </div>
                    <h3>Message Your Doctor</h3>
                    <p>Communicate securely with your healthcare providers.</p>
                    <Link to="/patient/messages" className="btn btn-outline">Send Message</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PatientDashboard; 