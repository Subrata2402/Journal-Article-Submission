import React, { useState } from 'react';
import {
  IoMailOutline,
  IoCallOutline,
  IoLocationOutline,
  IoSendOutline,
  IoPersonOutline,
  IoNewspaperOutline,
  IoCheckmarkCircleOutline,
  IoInformationCircleOutline
} from 'react-icons/io5';
import FormField from '../components/forms/FormField';
import TextArea from '../components/forms/TextArea';
import Spinner from '../components/common/Spinner';
import toastUtil from '../utils/toastUtil';
import '../assets/styles/pages/contact.scss';
import { FaRegQuestionCircle } from 'react-icons/fa';

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for the field being edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message should be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call with timeout
    setTimeout(() => {
      setIsSubmitting(false);
      toastUtil.success('Your message has been sent successfully! We will get back to you soon.');

      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1500);

    // In a real application, you would make an API call like this:
    // try {
    //   await httpService.post(API_ENDPOINTS.CONTACT, formData);
    //   toastUtil.success('Your message has been sent successfully!');
    //   setFormData({ name: '', email: '', subject: '', message: '' });
    // } catch (error) {
    //   toastUtil.error('Failed to send message. Please try again later.');
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

  return (
    <div className="contact-page">
      <header className="page-header">
        <h1>Contact Us</h1>
        <p>Have questions or need assistance? We're here to help you with any inquiries.</p>
      </header>

      <div className="contact-container">
        <div className="contact-info-section">
          <div className="section-header">
            <IoInformationCircleOutline className="section-icon" />
            <h2>Get In Touch</h2>
          </div>

          <div className="contact-info-content">
            <p>Feel free to reach out to us with any questions about our journal submission process, publication requirements, or if you need technical assistance.</p>

            <div className="contact-methods">
              <div className="contact-method">
                <div className="method-icon">
                  <IoMailOutline />
                </div>
                <div className="method-details">
                  <h3>Email</h3>
                  <div className="contact-item">
                    <strong>General Inquiries:</strong> info@journalsystem.com
                  </div>
                  <div className="contact-item">
                    <strong>Submission Support:</strong> submissions@journalsystem.com
                  </div>
                  <div className="contact-item">
                    <strong>Technical Support:</strong> tech@journalsystem.com
                  </div>
                </div>
              </div>

              <div className="contact-method">
                <div className="method-icon">
                  <IoCallOutline />
                </div>
                <div className="method-details">
                  <h3>Phone</h3>
                  <div className="contact-item">
                    <strong>Main Office:</strong> +1 (555) 123-4567
                  </div>
                  <div className="contact-item">
                    <strong>Support Line:</strong> +1 (555) 765-4321
                  </div>
                  <div className="contact-item">
                    <strong>Hours:</strong> Monday-Friday, 9AM-5PM EST
                  </div>
                </div>
              </div>

              <div className="contact-method">
                <div className="method-icon">
                  <IoLocationOutline />
                </div>
                <div className="method-details">
                  <h3>Address</h3>
                  <address className="address">
                    123 Academic Blvd<br />
                    Research Park<br />
                    California, CA 90210<br />
                    United States
                  </address>
                </div>
              </div>
            </div>

            <div className="response-time">
              <h3>Response Time</h3>
              <p>We strive to respond to all inquiries within 1-2 business days. For urgent matters, please call our support line directly.</p>
            </div>
          </div>
        </div>

        <div className="contact-form-section">
          <div className="section-header">
            <IoSendOutline className="section-icon" />
            <h2>Send Us a Message</h2>
          </div>

          <form onSubmit={handleSubmit} className="contact-form">
            <FormField
              label="Your Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              error={errors.name}
              required
              icon={<IoPersonOutline />}
            />

            <FormField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email address"
              error={errors.email}
              required
              icon={<IoMailOutline />}
            />

            <FormField
              label="Subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="What is your inquiry about?"
              error={errors.subject}
              required
              icon={<IoNewspaperOutline />}
            />

            <TextArea
              label="Message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="How can we help you? Please provide as much detail as possible."
              rows={6}
              error={errors.message}
              required
            />

            <div className="form-privacy-notice">
              <p>By submitting this form, you agree to our <a href="#">Privacy Policy</a>. We'll only use your information to respond to your inquiry.</p>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="primary-button submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Spinner size="small" />
                    Sending...
                  </>
                ) : (
                  <>
                    <IoCheckmarkCircleOutline />
                    Send Message
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="faq-section">
        <div className="section-header">
          <FaRegQuestionCircle className='section-icon' />
          <h2>Frequently Asked Questions</h2>
        </div>
        <div className="faq-content">
          <div className="faq-item">
            <h3>How long does the review process take?</h3>
            <p>Typically, the initial review takes 2-4 weeks. The complete peer review process may take 2-3 months depending on the journal and complexity of the submission.</p>
          </div>

          <div className="faq-item">
            <h3>What file formats do you accept for manuscript submissions?</h3>
            <p>We accept manuscripts in PDF format. Supplementary materials can be submitted in PDF, DOC, DOCX, XLS, or XLSX formats.</p>
          </div>

          <div className="faq-item">
            <h3>How can I check the status of my submission?</h3>
            <p>You can log into your account and check the status of your submission in the "My Articles" section of your dashboard.</p>
          </div>

          <div className="faq-item">
            <h3>What happens if my article is rejected?</h3>
            <p>If your article is rejected, you'll receive detailed feedback from reviewers. You may revise your work based on this feedback and resubmit, or consider submitting to a different journal.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;