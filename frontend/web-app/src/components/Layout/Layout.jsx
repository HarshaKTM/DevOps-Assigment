import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/theme.css';

const Layout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <div className="page-container">
      <header className="header">
        <div className="container header-container">
          <div className="logo">
            <Link to="/">
              <img src="/logo.png" alt="Healthcare Portal" />
            </Link>
          </div>
          <button className="mobile-menu-button" onClick={toggleMobileMenu} aria-label="Toggle menu">
            <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
          <ul className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/login" className="btn btn-outline">Log In</Link></li>
          </ul>
        </div>
      </header>

      <main>
        {children}
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

export default Layout; 