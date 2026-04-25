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
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setCounting(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePos({ x, y });
    }
  };

  const c1 = useCountUp(40, 900, counting);
  const c2 = useCountUp(90, 1000, counting);
  const c3 = useCountUp(40, 1100, counting);

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      style={{
        minHeight: '100vh',
        background: 'var(--ink)',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
      }}
    >
      {/* Noise texture */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.035,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        pointerEvents: 'none',
      }} />

      {/* Gradient blob that follows mouse */}
      <div style={{
        position: 'absolute',
        width: '800px',
        height: '800px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)',
        left: `${mousePos.x}%`,
        top: `${mousePos.y}%`,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        transition: 'transform 0.4s ease-out',
        filter: 'blur(40px)',
      }} />

      {/* Diagonal lines */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `repeating-linear-gradient(
          45deg,
          transparent,
          transparent 80px,
          rgba(255,255,255,0.015) 80px,
          rgba(255,255,255,0.015) 81px
        )`,
        pointerEvents: 'none',
      }} />

      <div className="page-container" style={{ position: 'relative', zIndex: 2, paddingTop: '6rem', paddingBottom: '6rem' }}>
        <div style={{ display: 'flex', gap: '4rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>

          <div style={{ flex: '1 1 560px', maxWidth: 680 }}>
            <p
              className="animate-slide-up stagger-1"
              style={{
                fontSize: '0.68rem',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '3px',
                color: 'var(--gray)',
                marginBottom: '1.75rem',
                fontFamily: 'var(--font-sans)',
              }}
            >
              Tecnología reacondicionada
            </p>

            <h1
              className="animate-slide-up stagger-2"
              style={{
                fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
                fontWeight: 300,
                color: 'var(--white)',
                lineHeight: 1.08,
                letterSpacing: '-0.035em',
                marginBottom: '1.5rem',
                fontFamily: 'var(--font-display)',
              }}
            >
              Dispositivos que<br />
              <em style={{ fontStyle: 'italic', fontWeight: 400 }}>funcionan.</em>
            </h1>

            <p
              className="animate-slide-up stagger-3"
              style={{
                fontSize: 'clamp(0.95rem, 1.5vw, 1.05rem)',
                color: 'rgba(255,255,255,0.5)',
                lineHeight: 1.75,
                maxWidth: 440,
                marginBottom: '2.25rem',
                fontFamily: 'var(--font-sans)',
                fontWeight: 300,
              }}
            >
              Cada equipo pasa por 40+ puntos de inspección técnica.
              Hasta 40% más barato que nuevo. Garantía de 90 días incluida.
            </p>

            <div className="animate-slide-up stagger-4" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/home')}
                style={{
                  background: 'var(--white)',
                  color: 'var(--ink)',
                  border: 'none',
                  borderRadius: '2px',
                  padding: '13px 26px',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  fontFamily: 'var(--font-sans)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'all 0.25s ease',
                  letterSpacing: '0.3px',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.transform = '';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '';
                }}
              >
                Ver catálogo
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>

              <button
                onClick={() => navigate('/login')}
                style={{
                  background: 'transparent',
                  color: 'rgba(255,255,255,0.6)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  borderRadius: '2px',
                  padding: '13px 22px',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  fontFamily: 'var(--font-sans)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  letterSpacing: '0.3px',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.6)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'white';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.25)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.6)';
                }}
              >
                Iniciar sesión
              </button>
            </div>

            <div
              ref={statsRef}
              className="animate-slide-up stagger-5"
              style={{
                display: 'flex',
                gap: '2.25rem',
                marginTop: '3.5rem',
                paddingTop: '1.75rem',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                flexWrap: 'wrap',
              }}
            >
              {[
                { value: `${c1}+`, label: 'PUNTOS DE INSPECCIÓN' },
                { value: `${c2}d`, label: 'GARANTÍA' },
                { value: `−${c3}%`, label: 'VS PRECIO NUEVO' },
              ].map((s, i) => (
                <div key={i}>
                  <p style={{
                    fontSize: 'clamp(1.35rem, 2.2vw, 1.75rem)',
                    fontWeight: 300,
                    color: 'var(--white)',
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                    marginBottom: '0.2rem',
                    fontFamily: 'var(--font-display)',
                  }}>
                    {s.value}
                  </p>
                  <p style={{
                    fontSize: '0.6rem',
                    fontWeight: 500,
                    color: 'rgba(255,255,255,0.35)',
                    letterSpacing: '1.5px',
                    fontFamily: 'var(--font-sans)',
                  }}>
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Product cards decorativas */}
          <div style={{
            flex: '0 0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
            opacity: 0.5,
          }} className="hero-deco-grid">
            {[
              { label: 'iPhone', sub: 'Excellent' },
              { label: 'MacBook', sub: 'Good' },
              { label: 'iPad', sub: 'Excellent' },
              { label: 'AirPods', sub: 'Fair' },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  width: 110,
                  padding: '0.875rem',
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '3px',
                }}
              >
                <div style={{
                  width: '100%',
                  height: 55,
                  background: 'rgba(255,255,255,0.04)',
                  borderRadius: '2px',
                  marginBottom: '0.625rem',
                }} />
                <p style={{ fontSize: '0.7rem', fontWeight: 500, color: 'rgba(255,255,255,0.75)', marginBottom: 2, fontFamily: 'var(--font-sans)' }}>
                  {item.label}
                </p>
                <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-sans)' }}>
                  {item.sub}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .hero-deco-grid { display: none !important; } }
      `}</style>
    </section>
  );
};