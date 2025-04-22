import '../styles/StandardPage.css';
import '../styles/ImageCredit.css';

function TastingsPage() {
  return (
    <div className="standard-page">
      <h1>Tastings & mehr</h1>
      <div className="page-image-container image-container">
        <img 
          src="/Tastings_Foto_Uli_Weis.jpg" 
          alt="Berlin Beer Society Tastings" 
          className="page-image" 
        />
        <div className="image-credit">Foto: Uli Weis</div>
      </div>
      <div className="standard-content">
        <p>In den vergangenen Jahren haben wir über 100 "bierige" Veranstaltungen durchgeführt. Ob VHS-Seminar, Firmenevent, private Feier, Messepräsenz, Gourmet-Menü, Craft Beer-Lounge: Die <b>Berlin Beer Society</b> sorgt für unterhaltsame und genussvolle Ausflüge in die Welt von Hopfen und Malz. </p>
        <p>Eine Auswahl unserer Themen:</p>
        <p>
        <ul style={{ listStyleType: 'none', paddingLeft: '1rem' }}>
          <li>Klassisch: Ausgezeichnete Biere, Belgische Bierkultur, Craft Beer für Neugierige</li>
          <li>Foodpairing: Bier & Schokolade, Bier & Käse, Bier & Tappas</li>
          <li>Für Fortgeschrittene: Bier & Politik, Dunkle Begierde, Fassgelagertes Bier</li>
        </ul>
        </p>
        <p><b>Unsere Angebote für die Gastronomie:</b></p>
        <p style={{ marginLeft: '1rem' }}>Mitarbeiterschulung, individuelle Bierkarten, Veranstaltungen, Konzeptentwicklung rund ums Bier</p>
      </div>
    </div>
  );
}

export default TastingsPage; 