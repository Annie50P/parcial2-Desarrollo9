import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section style={{
      minHeight: '90vh',
      display: 'flex',
      alignItems: 'center',
      padding: '6rem 0',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '60%',
        height: '100%',
        background: 'var(--bg-dark)',
        clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)',
      }} />

      <div style={{
        position: 'absolute',
        top: '50%',
        right: '10%',
        transform: 'translateY(-50%)',
        width: '500px',
        height: '500px',
        border: '2px solid rgba(255,255,255,0.1)',
        borderRadius: '50%',
      }} />
      <div style={{
        position: 'absolute',
        top: '50%',
        right: '15%',
        transform: 'translateY(-50%)',
        width: '300px',
        height: '300px',
        border: '2px solid rgba(255,255,255,0.15)',
        borderRadius: '50%',
      }} />

      <div className="page-container" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: 700 }}>
          <p style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '3px',
            color: 'var(--accent)',
            marginBottom: '1.5rem',
            animation: 'slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both',
          }}>
            Tecnología que funciona — planeta que descansa
          </p>

          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(3rem, 7vw, 5.5rem)',
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: '-2px',
            marginBottom: '2rem',
            animation: 'slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both',
          }}>
            Dispositivos certificados.
            <br />
            <span style={{ color: 'var(--accent)' }}>Garantía real.</span>
          </h1>

          <p style={{
            fontSize: '1.2rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            maxWidth: 500,
            marginBottom: '3rem',
            animation: 'slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both',
          }}>
            Cada equipo reacondicionado pasa 40+ puntos de inspección.
            <br />
            Hasta 40% más barato. Misma calidad.
          </p>

          <div style={{
            display: 'flex',
            gap: '1rem',
            animation: 'slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both',
          }}>
            <button
              onClick={() => navigate('/home')}
              className="btn-primary"
              style={{ padding: '16px 36px', fontSize: '0.9rem' }}
            >
              Ver catálogo
            </button>
          </div>

          <div style={{
            display: 'flex',
            gap: '3rem',
            marginTop: '4rem',
            animation: 'slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both',
          }}>
            <div>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 600 }}>40+</p>
              <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)' }}>Puntos de inspección</p>
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 600 }}>90</p>
              <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)' }}>Días de garantía</p>
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 600 }}>-40%</p>
              <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)' }}>vs precio nuevo</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};