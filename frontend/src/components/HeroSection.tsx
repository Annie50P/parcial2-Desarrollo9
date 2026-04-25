import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function useCountUp(target: number, duration = 1100, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.floor(eased * target));
      if (p < 1) requestAnimationFrame(step);
      else setValue(target);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return value;
}

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [counting, setCounting] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setCounting(true); },
      { threshold: 0.2 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const c1 = useCountUp(40, 900, counting);
  const c2 = useCountUp(90, 1000, counting);
  const c3 = useCountUp(40, 1100, counting);

  return (
    <section style={{
      minHeight: '100vh',
      background: 'var(--ink)',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Grid decorativo de fondo */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
      }} />

      {/* Glow de acento */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        right: '-5%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(91,80,255,0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="page-container" style={{ position: 'relative', zIndex: 2, paddingTop: '6rem', paddingBottom: '6rem' }}>
        <div style={{ display: 'flex', gap: '4rem', alignItems: 'center', flexWrap: 'wrap' }}>

          {/* ── Contenido izquierdo ── */}
          <div style={{ flex: '1 1 560px', maxWidth: 680 }}>

            {/* Pill badge */}
            <div
              className="animate-slide-up stagger-1"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(91,80,255,0.15)',
                border: '1px solid rgba(91,80,255,0.35)',
                borderRadius: 20,
                padding: '5px 14px',
                marginBottom: '2.5rem',
              }}
            >
              <span style={{ width: 7, height: 7, background: '#A09AFF', borderRadius: '50%', flexShrink: 0 }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#A09AFF', letterSpacing: '0.3px' }}>
                Dispositivos certificados · 90 días de garantía
              </span>
            </div>

            {/* Headline principal */}
            <h1
              className="animate-slide-up stagger-2"
              style={{
                fontSize: 'clamp(3rem, 7.5vw, 6.5rem)',
                fontWeight: 800,
                color: 'var(--white)',
                lineHeight: 1.0,
                letterSpacing: '-0.045em',
                marginBottom: '2rem',
              }}
            >
              Tecnología<br />
              de segunda<br />
              <span style={{
                background: 'linear-gradient(135deg, #A09AFF 0%, #5B50FF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                sin igual.
              </span>
            </h1>

            {/* Descripción */}
            <p
              className="animate-slide-up stagger-3"
              style={{
                fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
                color: 'rgba(255,255,255,0.55)',
                lineHeight: 1.7,
                maxWidth: 500,
                marginBottom: '2.75rem',
              }}
            >
              Cada equipo pasa 40+ puntos de inspección técnica.
              Hasta 40% más barato que nuevo. Garantía real incluida.
            </p>

            {/* CTAs */}
            <div className="animate-slide-up stagger-4" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/home')}
                style={{
                  background: 'var(--accent)',
                  color: 'var(--white)',
                  border: 'none',
                  borderRadius: 'var(--radius-ui)',
                  padding: '14px 34px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-display)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  transition: 'var(--transition)',
                  letterSpacing: '-0.01em',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'var(--accent-hover)';
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 28px rgba(91,80,255,0.45)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'var(--accent)';
                  (e.currentTarget as HTMLButtonElement).style.transform = '';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '';
                }}
              >
                Ver catálogo
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>

              <button
                onClick={() => navigate('/login')}
                style={{
                  background: 'transparent',
                  color: 'rgba(255,255,255,0.65)',
                  border: '1.5px solid rgba(255,255,255,0.15)',
                  borderRadius: 'var(--radius-ui)',
                  padding: '14px 28px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  fontFamily: 'var(--font-display)',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.4)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'white';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.15)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.65)';
                }}
              >
                Iniciar sesión
              </button>
            </div>

            {/* Stats */}
            <div
              ref={statsRef}
              className="animate-slide-up stagger-5"
              style={{
                display: 'flex',
                gap: '2.5rem',
                marginTop: '5rem',
                paddingTop: '2.5rem',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                flexWrap: 'wrap',
              }}
            >
              {[
                { value: `${c1}+`, label: 'Puntos de inspección' },
                { value: `${c2}d`,  label: 'Garantía incluida'   },
                { value: `−${c3}%`, label: 'vs precio nuevo'     },
              ].map((s, i) => (
                <div key={i}>
                  <p style={{
                    fontSize: 'clamp(1.75rem, 3vw, 2.75rem)',
                    fontWeight: 800,
                    color: 'var(--white)',
                    letterSpacing: '-0.04em',
                    lineHeight: 1,
                    marginBottom: '0.375rem',
                  }}>
                    {s.value}
                  </p>
                  <p style={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.35)',
                    textTransform: 'uppercase',
                    letterSpacing: '1.2px',
                  }}>
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Cards decorativas derecha ── */}
          <div style={{
            flex: '0 0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '14px',
            opacity: 0.65,
          }} className="hero-deco-grid">
            {[
              { label: 'iPhone 13', sub: 'Excellent', price: '$529' },
              { label: 'MacBook Air', sub: 'Good', price: '$849' },
              { label: 'iPad Pro', sub: 'Excellent', price: '$399' },
              { label: 'AirPods Pro', sub: 'Fair', price: '$129' },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  width: 145,
                  padding: '1.25rem',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12,
                  backdropFilter: 'blur(8px)',
                  animationDelay: `${0.1 + i * 0.08}s`,
                }}
                className="animate-slide-up"
              >
                <div style={{
                  width: '100%',
                  height: 80,
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: 8,
                  marginBottom: '0.875rem',
                }} />
                <p style={{ fontSize: '0.82rem', fontWeight: 700, color: 'rgba(255,255,255,0.75)', marginBottom: 3 }}>
                  {item.label}
                </p>
                <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', marginBottom: 6 }}>
                  {item.sub}
                </p>
                <p style={{ fontSize: '0.95rem', fontWeight: 800, color: '#A09AFF' }}>
                  {item.price}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Ocultar grid deco en móvil */}
      <style>{`
        @media (max-width: 900px) { .hero-deco-grid { display: none !important; } }
      `}</style>
    </section>
  );
};
