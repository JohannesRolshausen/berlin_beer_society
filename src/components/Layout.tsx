import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import '../styles/Layout.css';

function Layout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Helper function to check if a link is active
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close mobile menu when a link is clicked
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <header>
          <div className="sidebar">
            <div className="logo-container">
              <Link to="/">
                <img src="/logo.jpg" alt="Berlin Beer Society Logo" className="logo" />
              </Link>
            </div>
            
            {/* Mobile menu toggle button */}
            <button 
              className="mobile-menu-toggle" 
              onClick={toggleMobileMenu}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
            
            {/* Desktop navigation */}
            <nav className="navigation desktop-nav">
              <ul>
                <li className={isActive('/blog') ? 'active' : ''}>
                  <Link to="/blog">Berlin Beer Blog</Link>
                </li>
                <li className={isActive('/tastings') ? 'active' : ''}>
                  <Link to="/tastings">Tastings & mehr</Link>
                </li>
                <li className={isActive('/termine') ? 'active' : ''}>
                  <Link to="/termine">Termine</Link>
                </li>
                <li className={isActive('/about') ? 'active' : ''}>
                  <Link to="/about">Über uns</Link>
                </li>
                <li className={isActive('/contact') ? 'active' : ''}>
                  <Link to="/contact">Kontakt</Link>
                </li>
              </ul>
            </nav>
            
            {/* Mobile navigation */}
            <nav className={`navigation mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
              <ul>
                <li className={isActive('/blog') ? 'active' : ''}>
                  <Link to="/blog" onClick={closeMobileMenu}>Berlin Beer Blog</Link>
                </li>
                <li className={isActive('/tastings') ? 'active' : ''}>
                  <Link to="/tastings" onClick={closeMobileMenu}>Tastings & mehr</Link>
                </li>
                <li className={isActive('/termine') ? 'active' : ''}>
                  <Link to="/termine" onClick={closeMobileMenu}>Termine</Link>
                </li>
                <li className={isActive('/about') ? 'active' : ''}>
                  <Link to="/about" onClick={closeMobileMenu}>Über uns</Link>
                </li>
                <li className={isActive('/contact') ? 'active' : ''}>
                  <Link to="/contact" onClick={closeMobileMenu}>Kontakt</Link>
                </li>
              </ul>
            </nav>
          </div>
          
          <div className="main-content">
            <Outlet />
          </div>
        </header>
        
        <footer>
          <Link to="/impressum" className="impressum-link">Impressum</Link>
        </footer>
      </div>
    </div>
  );
}

export default Layout; 