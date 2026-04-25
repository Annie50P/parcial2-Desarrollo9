import React, { useState, useEffect } from 'react';

const benefits = [
  {
    number: '40+',
    label: 'PUNTOS',
    title: 'Inspección Rigurosa',
    desc: 'Cada dispositivo pasa por más de 40 puntos de verificación con técnicos certificados.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} style={{ width: 24, height: 24 }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    number: '90',
    suffix: 'días',
    label: 'GARANTÍA',
    title: 'Garantía Total',
    desc: 'Si algo falla en los primeros 3 meses, lo resolvemos sin preguntas.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} style={{ width: 24, height: 24 }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    number: '40%',
    prefix: '−',
    label: 'AHORRO',
    title: 'Precios Justos',
    desc: 'Hasta 40% más barato que comprar nuevo. Misma calidad, mejor precio.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} style={{ width: 24, height: 24 }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const BenefitItem: React.FC<{ b: typeof benefits[0]; index: number }> = ({ b, index }) => {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300 + index * 150);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        padding: '2.5rem 2rem',
        background: 'var(--white)',
        border: '1px solid var(--line)',
        transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        cursor: 'pointer',
        overflow: 'hidden',
      }}
    >
      {/* Hover fill effect */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'var(--ink)',
        transform: hovered ? 'scaleY(1)' : 'scaleY(0)',
        transformOrigin: 'bottom',
        transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)',
        zIndex: 0,
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Icon */}
        <div style={{
          color: hovered ? 'rgba(255,255,255,0.5)' : 'var(--ink)',
          marginBottom: '1.5rem',
          transition: 'color 0.4s ease',
        }}>
          {b.icon}
        </div>

        {/* Number big */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: '0.5rem' }}>
          {b.prefix && (
            <span style={{
              fontSize: '1.5rem',
              fontWeight: 300,
              color: hovered ? 'rgba(255,255,255,0.4)' : 'var(--ink)',
              fontFamily: 'var(--font-display)',
              transition: 'color 0.4s ease',
            }}>
              {b.prefix}
            </span>
          )}
          <span style={{
            fontSize: 'clamp(2rem, 4vw, 2.75rem)',
            fontWeight: 300,
            color: hovered ? 'var(--white)' : 'var(--ink)',
            fontFamily: 'var(--font-display)',
            lineHeight: 1,
            letterSpacing: '-0.03em',
            transition: 'color 0.4s ease',
          }}>
            {b.number}
          </span>
          {b.suffix && (
            <span style={{
              fontSize: '0.9rem',
              fontWeight: 300,
              color: hovered ? 'rgba(255,255,255,0.4)' : 'var(--ink)',
              fontFamily: 'var(--font-display)',
              transition: 'color 0.4s ease',
            }}>
              {b.suffix}
            </span>
          )}
        </div>

        {/* Label small */}
        <p style={{
          fontSize: '0.6rem',
          fontWeight: 500,
          color: hovered ? 'rgba(255,255,255,0.35)' : 'var(--gray)',
          letterSpacing: '2px',
          marginBottom: '1.25rem',
          fontFamily: 'var(--font-sans)',
          transition: 'color 0.4s ease',
        }}>
          {b.label}
        </p>

        {/* Title */}
        <h3 style={{
          fontSize: '1.15rem',
          fontWeight: 400,
          color: hovered ? 'var(--white)' : 'var(--ink)',
          marginBottom: '0.5rem',
          letterSpacing: '-0.01em',
          fontFamily: 'var(--font-display)',
          transition: 'color 0.4s ease',
        }}>
          {b.title}
        </h3>

        {/* Desc */}
        <p style={{
          fontSize: '0.85rem',
          color: hovered ? 'rgba(255,255,255,0.55)' : 'var(--ink2)',
          lineHeight: 1.65,
          fontFamily: 'var(--font-sans)',
          fontWeight: 300,
          transition: 'color 0.4s ease',
        }}>
          {b.desc}
        </p>
      </div>

      {/* Corner accent on hover */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: 40,
        height: 40,
        borderTop: `2px solid ${hovered ? 'rgba(255,255,255,0.3)' : 'transparent'}`,
        borderRight: `2px solid ${hovered ? 'rgba(255,255,255,0.3)' : 'transparent'}`,
        transition: 'all 0.4s ease',
        borderRadius: '0 4px 0 0',
      }} />
    </div>
  );
};

export const BenefitsGrid: React.FC = () => {
  return (
    <section style={{ padding: '7rem 0', background: 'var(--cream)' }}>
      <div className="page-container">

        {/* Header */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '4rem',
          maxWidth: 560,
          margin: '0 auto 4rem'
        }}>
          <p style={{
            fontSize: '0.65rem',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '3px',
            color: 'var(--gray)',
            marginBottom: '1.25rem',
            fontFamily: 'var(--font-sans)',
          }}>
            Nuestra promesa
          </p>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 300,
            letterSpacing: '-0.02em',
            color: 'var(--ink)',
            lineHeight: 1.15,
            fontFamily: 'var(--font-display)',
          }}>
            ¿Por qué elegir SafeTech?
          </h2>
        </div>

        {/* Grid - 3 cards grandes */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.5rem',
        }}>
          {benefits.map((b, i) => (
            <BenefitItem key={i} b={b} index={i} />
          ))}
        </div>

        {/* Stats bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '4rem',
          marginTop: '4rem',
          paddingTop: '2rem',
          borderTop: '1px solid var(--line)',
        }}>
          {[
            { value: '5,000+', label: 'Dispositivos reacondicionados' },
            { value: '12', label: 'Técnicos certificados' },
            { value: '97%', label: 'Satisfacción' },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <p style={{
                fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
                fontWeight: 300,
                color: 'var(--ink)',
                fontFamily: 'var(--font-display)',
                letterSpacing: '-0.02em',
              }}>
                {stat.value}
              </p>
              <p style={{
                fontSize: '0.7rem',
                fontWeight: 400,
                color: 'var(--gray)',
                marginTop: '0.25rem',
                fontFamily: 'var(--font-sans)',
              }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};