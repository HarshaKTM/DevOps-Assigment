import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/authService';
import '../styles/theme.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient'
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate form
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    setLoading(true);
    
    try {
      // Omit confirmPassword from API request
      const { confirmPassword, ...apiData } = formData;
      
      const response = await authApi.register(apiData);
      
      // Store token in localStorage
      localStorage.setItem('token', response.token);
      
      // Redirect based on user role
      if (response.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (response.user.role === 'doctor') {
        navigate('/doctor/dashboard');
      } else {
        navigate('/patient/dashboard');
      }
    } catch (error) {
      setError(error?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
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
            <h1>Join Our Healthcare Community</h1>
            <p>Create an account to access personalized healthcare services and manage your medical information securely.</p>
          </div>
        </section>

        <section className="auth-section">
          <div className="container">
            <div className="auth-form">
              <h2>Create Your Account</h2>
              
              {error && (
                <div className="alert alert-error">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="firstName" className="form-label">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="form-control"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="lastName" className="form-label">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="form-control"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-control"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <small className="form-text">Password must be at least 8 characters long</small>
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className="form-control"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="role" className="form-label">I am a</label>
                  <select
                    id="role"
                    name="role"
                    className="form-control"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="patient">Patient</option>
                    <option value="doctor">Healthcare Provider</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Register'}
                  </button>
                </div>
              </form>
              
              <div className="auth-links">
                <p>
                  Already have an account? <Link to="/login">Login</Link>
                </p>
              </div>
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

export default RegisterPage; 