import '../styles/StandardPage.css';
import '../styles/ImageCredit.css';

function AboutPage() {
  return (
    <div className="standard-page">
      <h1>Über uns</h1>
      <div className="page-image-container image-container">
        <img 
          src="/Ueber_uns_Foto_Uli_Weis.jpg" 
          alt="Berlin Beer Society" 
          className="page-image" 
        />
        <div className="image-credit">Foto: Uli Weis</div>
      </div>
      <div className="standard-content">
        <p>Eine Reise nach Belgien vor vielen Jahren. Der Plan war, möglichst viel zu erfahren über ein belgisches Kulturgut: Comics. Der Plan ging auf. Zurück nach Deutschland kam aber – vollkommen unbeabsichtigt – die Erkenntnis: Bier ist mehr als Pils, Helles und Weizen. Aus dieser wundervollen Entdeckung wuchsen erst die Neugier, dann das Wissen und schließlich die Leidenschaft: unter anderem die Ausbildung zu Diplom-Biersommeliers, die Gründung der Saarbrücker Beer Society, die Eröffnung eines Pop-up-Bierladens, Tastings in der Gastronomie und Kurse an Volkshochschulen. Seit 2024 leben wir in Berlin, wo wir uns als BERLIN BEER SOCIETY für die Bierkultur engagieren. </p>
        <p>Und mit all dem kam die Erkenntnis: <br></br>
        Bier reimt sich auf Wir.
        </p>
        <p>
        Wir, das sind:
        </p>
        <p>Katharina Rolshausen, geboren 1973 in Vorarlberg, Diplom-Pädagogin, Journalistin, Autorin, Kaffee-, Käse- und Biersommelière.</p>
        <p>Martin Rolshausen, geboren 1967 im Saarland, Einzelhandelskaufmann, Journalist, Autor, Kaffee- und Biersommelier.</p>
      </div>
    </div>
  );
}

export default AboutPage; 