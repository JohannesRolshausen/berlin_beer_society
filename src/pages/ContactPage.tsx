import '../styles/StandardPage.css';
import '../styles/ContactPage.css';

function ContactPage() {
  return (
    <div className="standard-page">
      <h1>Kontakt</h1>
      <div className="standard-content">
      <p>Wir freuen uns auf Ihre Nachricht!</p>
      <div className="standard-email">
        <a href="mailto:info@beersociety.berlin" className="standard-email-link">info@beersociety.berlin</a>
      </div>
      </div>
    </div>
  );
}

export default ContactPage; 