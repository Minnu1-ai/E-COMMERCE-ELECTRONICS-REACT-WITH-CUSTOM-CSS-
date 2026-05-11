import { useState } from 'react';

function Contact() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setSent(false), 3000);
    }, 1500);
  };

  return (
    <main className="page">
      <section className="contact-hero">
        <h1>Get in Touch</h1>
        <p>We'd love to hear from you. Our team is always here to help.</p>
      </section>

      <section className="contact-layout">
        <div className="contact-info-col">
          <div className="contact-card">
            <div className="contact-icon-box"><i className="fas fa-map-marker-alt"></i></div>
            <div>
              <h4 className="contact-card-title">Our Office</h4>
              <p className="contact-card-text">123 Tech Boulevard, Innovation City, CA 94043</p>
            </div>
          </div>
          <div className="contact-card">
            <div className="contact-icon-box"><i className="fas fa-phone"></i></div>
            <div>
              <h4 className="contact-card-title">Phone</h4>
              <p className="contact-card-text">+1 (555) 123-4567</p>
            </div>
          </div>
          <div className="contact-card">
            <div className="contact-icon-box"><i className="fas fa-envelope"></i></div>
            <div>
              <h4 className="contact-card-title">Email</h4>
              <p className="contact-card-text">support@techhaven.com</p>
            </div>
          </div>
        </div>

        <div className="contact-form-col">
          <form className="contact-form" onSubmit={handleSubmit}>
            <h3 className="contact-form-title">Send Us a Message</h3>
            <div className="contact-name-row">
              <div className="contact-name-col">
                <label>Your Name</label>
                <input type="text" required />
              </div>
              <div className="contact-name-col">
                <label>Email Address</label>
                <input type="email" required />
              </div>
            </div>
            <div>
              <label>Subject</label>
              <input type="text" required />
            </div>
            <div>
              <label>Message</label>
              <textarea required />
            </div>
            <button type="submit" className="btn-contact-submit" disabled={sending}>
              {sent ? (
                <><i className="fas fa-check"></i> Message Sent!</>
              ) : sending ? (
                'Sending...'
              ) : (
                'Send Message'
              )}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default Contact;
