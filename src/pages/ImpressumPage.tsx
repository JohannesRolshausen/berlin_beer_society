import '../styles/ImpressumPage.css';

function ImpressumPage() {
  return (
    <div className="impressum-page">
      <h1>Impressum</h1>
      <div className="impressum-content">

        <h3>Angaben gemäß § 5 TMG</h3>
        <p>
          <strong>Martin Rolshausen</strong><br/>
          Kastanienallee 98B<br/>
          10435 Berlin<br/>
          Deutschland
        </p>
        <p>
          <strong>Telefon:</strong> 0163/4790539<br/>
          <strong>E-Mail:</strong> <a href="mailto:info@beersociety.berlin">info@beersociety.berlin</a><br/>
          <strong>Website:</strong> <a href="https://www.beersociety.berlin" target="_blank">www.beersociety.berlin</a>
        </p>

        <h3>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h3>
        <p>
          <strong>Martin Rolshausen</strong><br/>
          Kastanienallee 98B<br/>
          10435 Berlin<br/>
          Deutschland
        </p>
      </div>
    </div>
  );
}

export default ImpressumPage; 