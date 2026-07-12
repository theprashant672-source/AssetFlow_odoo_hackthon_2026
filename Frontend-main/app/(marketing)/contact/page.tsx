import SectionHeading from "../components/SectionHeading";

import ContactForm from "./ContactForm";

export default function ContactPage() {
  return (
    <main>
      <div className="page-hero">
        <SectionHeading title="Contact NovaAssets" sub="We are here to help. Reach out to us for any inquiries." />
      </div>

      <section className="section contact-section">
        <div className="contact-grid">
          <div className="contact-info">
            <div className="info-card info-card--full">
              <span className="info-icon">📍</span>
              <div>
                <h4>Address</h4>
                <p>
                  A-109Y, Sector 80, Noida
                  <br />
                  Uttar Pradesh, 201305
                </p>
              </div>
            </div>
            <div className="contact-info-row">
              <div className="info-card">
                <span className="info-icon">📞</span>
                <div>
                  <h4>Call Us</h4>
                  <p>+91 9540263987</p>
                  <p>+91 9354299513</p>
                </div>
              </div>
              <div className="info-card">
                <span className="info-icon">✉</span>
                <div>
                  <h4>Email Us</h4>
                  <p>info@avavbusiness.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form">
            <ContactForm />
          </div>
        </div>

        <div className="map-placeholder">
          <div className="map-inner">
            <span>🗺️</span>
            <p>A-109Y, Sector 80, Noida, Uttar Pradesh 201305</p>
            <a
              href="https://maps.google.com/?q=A-109Y+Sector+80+Noida"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              Open in Google Maps
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

