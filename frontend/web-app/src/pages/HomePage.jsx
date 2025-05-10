import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/theme.css';

const HomePage = () => {
  return (
    <div className="page-container">
      <header className="header">
        <div className="container header-container">
          <div className="logo">
            <Link to="/">
              <img src="/logo.png" alt="Healthcare Portal" />
            </Link>
          </div>
          <button className="mobile-menu-button">
            <i className="fas fa-bars"></i>
          </button>
          <ul className="nav-menu">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/login" className="btn btn-outline">Log In</Link></li>
          </ul>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container">
            <h1>Your Healthcare, Simplified</h1>
            <p>Securely access medical services, schedule appointments, and view your health records all in one place.</p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary">Get Started</Link>
              <Link to="/learn-more" className="btn btn-outline">Learn More</Link>
            </div>
          </div>
        </section>

        <section className="features">
          <div className="container">
            <h2>How We Can Help You</h2>
            <div className="grid">
              <div className="card feature">
                <div className="feature-icon">
                  <i className="fas fa-calendar-check"></i>
                </div>
                <div className="card-content">
                  <h3>Appointment Scheduling</h3>
                  <p>Book appointments with healthcare providers quickly and conveniently from anywhere.</p>
                </div>
              </div>
              
              <div className="card feature">
                <div className="feature-icon">
                  <i className="fas fa-file-medical-alt"></i>
                </div>
                <div className="card-content">
                  <h3>Medical Records</h3>
                  <p>Access your complete medical history, test results, and treatment plans in one secure location.</p>
                </div>
              </div>
              
              <div className="card feature">
                <div className="feature-icon">
                  <i className="fas fa-user-md"></i>
                </div>
                <div className="card-content">
                  <h3>Doctor Consultations</h3>
                  <p>Connect with your healthcare providers through secure messaging and virtual consultations.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="about-section">
          <div className="container">
            <div className="grid">
              <div className="content">
                <h2>Quality Healthcare for Everyone</h2>
                <p>Our platform is designed to make healthcare accessible, streamlined, and personalized for every patient. We believe in a patient-centered approach that puts you in control of your health journey.</p>
                <p>Our network includes top specialists, primary care physicians, and healthcare professionals who are committed to providing the highest standard of care.</p>
                <Link to="/about" className="btn btn-primary">About Us</Link>
              </div>
              <div className="image">
                <img src="/images/healthcare-team.jpg" alt="Healthcare professionals" />
              </div>
            </div>
          </div>
        </section>

        <section className="call-section">
          <div className="container grid">
            <div className="card">
              <div className="card-content">
                <h3>Find a Doctor</h3>
                <p>Search our network of healthcare providers by specialty, location, or availability.</p>
                <Link to="/find-doctor" className="btn btn-outline">Search Now</Link>
              </div>
            </div>
            
            <div className="card">
              <div className="card-content">
                <h3>Emergency Services</h3>
                <p>Quick access to emergency care information and locations near you.</p>
                <Link to="/emergency" className="btn btn-outline">Learn More</Link>
              </div>
            </div>
            
            <div className="card">
              <div className="card-content">
                <h3>Health Resources</h3>
                <p>Educational materials and resources to help you make informed health decisions.</p>
                <Link to="/resources" className="btn btn-outline">View Resources</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="cta">
          <div className="container">
            <h2>Ready to take control of your healthcare journey?</h2>
            <p>Join thousands of patients who have streamlined their healthcare experience with our platform.</p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-accent">Create an Account</Link>
              <Link to="/contact" className="btn btn-outline">Contact Us</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-section">
              <h4>Healthcare Portal</h4>
              <p>Connecting patients with healthcare services securely and efficiently.</p>
            </div>
            
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/services">Services</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Patient Resources</h4>
              <ul className="footer-links">
                <li><Link to="/appointments">Appointments</Link></li>
                <li><Link to="/medical-records">Medical Records</Link></li>
                <li><Link to="/find-doctor">Find a Doctor</Link></li>
                <li><Link to="/faq">FAQ</Link></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Contact Us</h4>
              <ul className="footer-links">
                <li>123 Healthcare Ave</li>
                <li>Medical City, MC 12345</li>
                <li>Phone: (123) 456-7890</li>
                <li>Email: info@healthcare-portal.com</li>
              </ul>
            </div>
          </div>
          
          <div className="copyright">
            <p>&copy; {new Date().getFullYear()} Healthcare Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage; 