import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/authService';
import '../styles/theme.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await authApi.login(email, password);
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
      setError(error?.response?.data?.message || 'Invalid login credentials');
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
            <h1>Welcome to the Healthcare Portal</h1>
            <p>Access your health information securely and connect with healthcare professionals.</p>
          </div>
        </section>

        <section className="auth-section">
          <div className="container">
            <div className="auth-form">
              <h2>Login to Your Account</h2>
              
              {error && (
                <div className="alert alert-error">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                  </button>
                </div>
              </form>
              
              <div className="auth-links">
                <p>
                  <Link to="/forgot-password">Forgot your password?</Link>
                </p>
                <p>
                  Don't have an account? <Link to="/register">Register</Link>
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

export default LoginPage; 