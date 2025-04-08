import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/ContactUs.css';

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      alert('Thank you for your message! We will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="contact-page-wrapper">
      <Container className="contact-container">
        <h1 className="text-center main-title">
          <span className="title-word title-word-1">Get</span>
          <span className="title-word title-word-2">In</span>
          <span className="title-word title-word-3">Touch</span>
        </h1>
        
        <Row className="contact-content">
          <Col lg={5} className="contact-info-col">
            <div className="contact-info-wrapper">
              <h2 className="section-title">
                <span className="title-decoration"></span>
                Our Team
              </h2>
              
              <div className="team-member-card">
                <div className="member-avatar pulse-animation">
                  <img 
                    src="https://scontent.fccu13-1.fna.fbcdn.net/v/t39.30808-1/434214438_456423916724051_4369114781458385561_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=104&ccb=1-7&_nc_sid=1d2534&_nc_ohc=fcgLDSbLOtgQ7kNvgGWc73w&_nc_oc=AdnbI_Yegm5LEqDmPBUqWyvzD335NN_ez6l_2Xo4SuwIMHOY5ePSKn-sXhc-qfUrZpBFFNKADFBSap7EUUTbHAZf&_nc_zt=24&_nc_ht=scontent.fccu13-1.fna&_nc_gid=zlunHj82hOaSHBHyhYd1NA&oh=00_AYGt8FfiKHCUQslUQX8L2D9YghnykkMZtlKvJ7vLsYs-1Q&oe=67EEB519" 
                    alt="Milan Sahoo"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = "https://via.placeholder.com/150?text=Milan+Sahoo"
                    }}
                  />
                </div>
                <div className="member-info">
                  <h3>Milan Sahoo</h3>
                  <p className="position">Diploma in Computer Science & Engineering</p>
                  <div className="contact-details">
                    <div className="detail-item">
                      <i className="fas fa-university"></i>
                      <span>Brainware University</span>
                    </div>
                    <div className="detail-item">
                      <i className="fas fa-envelope"></i>
                      <span>milansahoo7211662005@gmail.com</span>
                    </div>
                    <div className="detail-item">
                      <i className="fas fa-phone"></i>
                      <span>+91 6296740204</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="team-member-card">
                <div className="member-avatar pulse-animation">
                  <img 
                    src="https://scontent.fccu13-3.fna.fbcdn.net/v/t39.30808-6/480167425_944035017845672_4672074549928901803_n.jpg?stp=dst-jpg_p526x296_tt6&_nc_cat=108&ccb=1-7&_nc_sid=833d8c&_nc_ohc=O_RqcGZ6RaEQ7kNvgHq2laH&_nc_oc=Adm9tjAVR0QfweqKKUQy6TGfEbg5NNeuGH4thYiPDDAS97Pnzuj_vSgsQYyDtbvwkBse9qrKDlsY0ANyhwkGX7yq&_nc_zt=23&_nc_ht=scontent.fccu13-3.fna&_nc_gid=1Cj17XcYu0VdnOrY_U8oQA&oh=00_AYHftyn-nFw3N3XUTIp10tFA7DTOSg4QDi369vXp7FA_OA&oe=67EEC180" 
                    alt="Malay Maity"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = "https://via.placeholder.com/150?text=Malay+Maity"
                    }}
                  />
                </div>
                <div className="member-info">
                  <h3>Malay Maity</h3>
                  <p className="position">Diploma in Computer Science & Engineering</p>
                  <div className="contact-details">
                    <div className="detail-item">
                      <i className="fas fa-university"></i>
                      <span>Brainware University</span>
                    </div>
                    <div className="detail-item">
                      <i className="fas fa-envelope"></i>
                      <span>maitymalay27747@gmail.com</span>
                    </div>
                    <div className="detail-item">
                      <i className="fas fa-phone"></i>
                      <span>+91 99329 63141</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="general-info-card">
                <h3 className="info-title">
                  <i className="fas fa-info-circle"></i>
                  General Inquiries
                </h3>
                <div className="info-details">
                  <div className="detail-item">
                    <i className="fas fa-envelope"></i>
                    <span>support@foodieexpress.com</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-phone"></i>
                    <span>+91 18**********</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>Brainware University, Barasat, Kolkata, West Bengal, India</span>
                  </div>
                </div>
              </div>
            </div>
          </Col>
          
          <Col lg={7} className="contact-form-col">
            <div className="contact-form-wrapper">
              <h2 className="section-title">
                <span className="title-decoration"></span>
                Send Us a Message
              </h2>
              
              <Form onSubmit={handleSubmit} className="animated-form">
                <Form.Group className="form-group floating-label">
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <Form.Label>Your Name</Form.Label>
                  <div className="underline"></div>
                </Form.Group>
                
                <Form.Group className="form-group floating-label">
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <Form.Label>Email Address</Form.Label>
                  <div className="underline"></div>
                </Form.Group>
                
                <Form.Group className="form-group floating-label">
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  <Form.Label>Phone Number</Form.Label>
                  <div className="underline"></div>
                </Form.Group>
                
                <Form.Group className="form-group floating-label">
                  <Form.Control
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                  <Form.Label>Subject</Form.Label>
                  <div className="underline"></div>
                </Form.Group>
                
                <Form.Group className="form-group floating-label">
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                  <Form.Label>Your Message</Form.Label>
                  <div className="underline"></div>
                </Form.Group>
                
                <Button
                  type="submit"
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
      
      <div className="contact-decoration">
        <div className="decoration-circle circle-1"></div>
        <div className="decoration-circle circle-2"></div>
        <div className="decoration-circle circle-3"></div>
      </div>
    </div>
  );
}

export default ContactUs;