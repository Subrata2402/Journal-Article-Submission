import React from 'react';
import { IoInformationCircleOutline, IoPeopleOutline, IoBookOutline, IoSchoolOutline, IoNewspaperOutline, IoTrophyOutline } from 'react-icons/io5';
import '../assets/styles/pages/about.scss';

const AboutPage = () => {
  return (
    <div className="about-page">
      <header className="page-header">
        <h1>About Our Journal</h1>
        <p>Learn more about our mission, values, and the team behind the Article Submission System</p>
      </header>
      
      <section className="about-section">
        <div className="section-header">
          <IoInformationCircleOutline className="section-icon" />
          <h2>Our Mission</h2>
        </div>
        <div className="section-content">
          <p>The Article Submission System was founded in 2020 with a clear mission: to democratize academic publishing and make scholarly communication more accessible, efficient, and transparent.</p>
          <p>We aim to connect researchers, academics, and innovative thinkers from around the world, providing them with a platform to share groundbreaking ideas and contribute to the advancement of knowledge across various disciplines.</p>
        </div>
      </section>
      
      <section className="about-section">
        <div className="section-header">
          <IoBookOutline className="section-icon" />
          <h2>Our Journals</h2>
        </div>
        <div className="section-content">
          <p>Our platform hosts a diverse range of peer-reviewed journals spanning multiple disciplines, including but not limited to:</p>
          <div className="journal-categories">
            <div className="category">
              <span className="category-icon science">
                <IoSchoolOutline />
              </span>
              <h3>Science & Technology</h3>
              <p>Latest research in physical sciences, computer science, engineering, and technological innovations.</p>
            </div>
            <div className="category">
              <span className="category-icon medicine">
                <IoNewspaperOutline />
              </span>
              <h3>Medicine & Health</h3>
              <p>Cutting-edge research in medical science, public health, and healthcare management.</p>
            </div>
            <div className="category">
              <span className="category-icon psychology">
                <IoTrophyOutline />
              </span>
              <h3>Social Sciences</h3>
              <p>Research in psychology, sociology, economics, and other social science disciplines.</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="about-section">
        <div className="section-header">
          <IoPeopleOutline className="section-icon" />
          <h2>Our Team</h2>
        </div>
        <div className="section-content">
          <p>Behind the Article Submission System is a dedicated team of professionals committed to advancing scholarly communication.</p>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-image placeholder"></div>
              <h3>Dr. Sarah Johnson</h3>
              <p className="member-title">Chief Editor</p>
              <p className="member-bio">Dr. Johnson has over 15 years of experience in academic publishing and research methodology.</p>
            </div>
            <div className="team-member">
              <div className="member-image placeholder"></div>
              <h3>Prof. Michael Chen</h3>
              <p className="member-title">Scientific Director</p>
              <p className="member-bio">Professor Chen oversees the scientific integrity of all publications on our platform.</p>
            </div>
            <div className="team-member">
              <div className="member-image placeholder"></div>
              <h3>Dr. Emily Rodriguez</h3>
              <p className="member-title">Peer Review Coordinator</p>
              <p className="member-bio">Dr. Rodriguez manages our network of expert reviewers across multiple disciplines.</p>
            </div>
            <div className="team-member">
              <div className="member-image placeholder"></div>
              <h3>Robert Thompson</h3>
              <p className="member-title">Technical Director</p>
              <p className="member-bio">Robert leads our development team, ensuring the platform remains cutting-edge.</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="about-section">
        <div className="section-header">
          <IoInformationCircleOutline className="section-icon" />
          <h2>Our Peer Review Process</h2>
        </div>
        <div className="section-content">
          <p>We are committed to maintaining the highest standards of academic integrity through our rigorous peer review process:</p>
          <ol className="process-list">
            <li>
              <span className="process-number">1</span>
              <div className="process-details">
                <h3>Initial Submission</h3>
                <p>Authors submit their manuscripts through our electronic submission system.</p>
              </div>
            </li>
            <li>
              <span className="process-number">2</span>
              <div className="process-details">
                <h3>Editorial Assessment</h3>
                <p>The journal's editorial team reviews the manuscript for scope and quality.</p>
              </div>
            </li>
            <li>
              <span className="process-number">3</span>
              <div className="process-details">
                <h3>Peer Review</h3>
                <p>Each manuscript is reviewed by at least two independent experts in the field.</p>
              </div>
            </li>
            <li>
              <span className="process-number">4</span>
              <div className="process-details">
                <h3>Decision</h3>
                <p>Based on the reviews, the editor makes a decision to accept, request revisions, or reject.</p>
              </div>
            </li>
            <li>
              <span className="process-number">5</span>
              <div className="process-details">
                <h3>Publication</h3>
                <p>After final approval, the article is formatted and published online.</p>
              </div>
            </li>
          </ol>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;