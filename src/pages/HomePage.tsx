import '../styles/HomePage.css';
import '../styles/ImageCredit.css';

function HomePage() {
  return (
    <div className="home-page">
      <div className="main-image-container image-container">
        <img 
          src="/katharina_und_martin_rolshausen.jpg" 
          alt="Katharina und Martin Rolshausen with beer glasses" 
          className="main-image" 
        />
        <div className="image-credit">Foto: Uli Weis</div>
      </div>
    </div>
  );
}

export default HomePage; 