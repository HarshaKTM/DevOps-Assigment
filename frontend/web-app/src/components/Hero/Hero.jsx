import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/theme.css';

const Hero = ({ 
  title,
  subtitle,
  showButtons = false,
  primaryButtonText = "Get Started",
  primaryButtonLink = "/register",
  secondaryButtonText = "Learn More",
  secondaryButtonLink = "/learn-more"
}) => {
  return (
    <section className="hero">
      <div className="container">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
        
        {showButtons && (
          <div className="cta-buttons">
            <Link to={primaryButtonLink} className="btn btn-primary">
              {primaryButtonText}
            </Link>
            <Link to={secondaryButtonLink} className="btn btn-outline">
              {secondaryButtonText}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero; 