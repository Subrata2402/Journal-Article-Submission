import React from 'react';
import '../../assets/styles/layout/footer.scss';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Article Submission System</h3>
          <p>A modern platform for publishing and exploring scientific journals.</p>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><a href="#">Home</a></li>
            <li><a href="#">Journals</a></li>
            <li><a href="#">Submit Article</a></li>
            <li><a href="#">About Us</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contact</h3>
          <ul className="footer-contact">
            <li>Email: info@articlesubmission.com</li>
            <li>Phone: +1 (555) 123-4567</li>
            <li>Address: 123 Publication St, Research City</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Article Submission System. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;