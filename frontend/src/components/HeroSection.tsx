import React from 'react';
import { useNavigate } from 'react-router-dom';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="hero-section page-container stagger-1">
      <div className="hero-content">
        <h2 className="section-subhead">Tecnología Premium. Impacto Mínimo.</h2>
        <h1 className="section-headline">Compra Tech<br />Refurbished Premium</h1>
        <p className="hero-desc stagger-2">Únete a la economía circular. Encuentra dispositivos certificados a una fracción de su precio original con calidad garantizada.</p>
        <div className="hero-actions stagger-3">
          <button className="btn-primary" onClick={() => navigate('/home')}>
            <span>Explorar Catálogo</span>
          </button>
        </div>
      </div>
    </section>
  );
};
