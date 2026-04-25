import React, { useState } from 'react';

const benefits = [
  {
    number: '01',
    title: 'Inspección Rigurosa',
    desc: 'Cada dispositivo pasa por más de 40 puntos de verificación con técnicos certificados antes de salir de nuestro almacén.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 22, height: 22 }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Garantía de 90 Días',
    desc: 'Si algo falla en los primeros 3 meses, lo resolvemos sin preguntas. Compra con total tranquilidad.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 22, height: 22 }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Envío Express',
    desc: 'Recibe tu pedido en 24–48 horas. Empaque protegido con materiales reciclables en cada envío.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 22, height: 22 }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Soporte Humano',
    desc: 'Técnicos reales, no bots. Resolvemos cualquier duda por chat, mail o teléfono, siempre disponibles.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 22, height: 22 }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
  },
  {
    number: '05',
    title: 'Precios Justos',
    desc: 'Hasta 40% más barato que comprar nuevo. Misma calidad, mejor precio, menor impacto ambiental.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 22, height: 22 }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    number: '06',
    title: 'Sostenibilidad',
    desc: 'Cada reacondicionado evita 50 kg de residuos electrónicos. Tecnología responsable con el planeta.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 22, height: 22 }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.249 2.249 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643" />
      </svg>
    ),
  },
];

const BenefitCard: React.FC<{ b: typeof benefits[0]; delay: number }> = ({ b, delay }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="animate-slide-up"
      style={{
        padding: '2rem',
        background: hovered ? 'var(--ink)' : 'var(--white)',
        border: `1.5px solid ${hovered ? 'var(--ink)' : 'var(--line)'}`,
        borderRadius: 'var(--radius-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
        animationDelay: `${delay}s`,
        cursor: 'default',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? 'var(--shadow-lg)' : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
        <span style={{
          fontSize: '3.5rem',
          fontWeight: 800,
          color: hovered ? 'rgba(255,255,255,0.12)' : 'var(--line)',
          lineHeight: 1,
          userSelect: 'none',
          letterSpacing: '-0.05em',
          transition: 'color 0.3s ease',
        }}>
          {b.number}
        </span>
        <div style={{
          color: hovered ? 'rgba(255,255,255,0.7)' : 'var(--accent)',
          transition: 'color 0.3s ease',
          marginTop: '0.25rem',
          flexShrink: 0,
        }}>
          {b.icon}
        </div>
      </div>

      <div>
        <h3 style={{
          fontSize: '1.05rem',
          fontWeight: 700,
          color: hovered ? 'var(--white)' : 'var(--ink)',
          marginBottom: '0.5rem',
          letterSpacing: '-0.02em',
          transition: 'color 0.3s ease',
        }}>
          {b.title}
        </h3>
        <p style={{
          fontSize: '0.875rem',
          color: hovered ? 'rgba(255,255,255,0.55)' : 'var(--ink2)',
          lineHeight: 1.65,
          transition: 'color 0.3s ease',
        }}>
          {b.desc}
        </p>
      </div>
    </div>
  );
};

export const BenefitsGrid: React.FC = () => {
  return (
    <section style={{ padding: '7rem 0', background: 'var(--cream)' }}>
      <div className="page-container">

        {/* Header */}
        <div style={{ marginBottom: '4rem', maxWidth: 620 }}>
          <p style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: 'var(--accent)',
            marginBottom: '1rem',
          }}>
            Nuestra promesa
          </p>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3.25rem)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            color: 'var(--ink)',
            lineHeight: 1.05,
            marginBottom: '1rem',
          }}>
            ¿Por qué elegir SafeTech?
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--ink2)', lineHeight: 1.65 }}>
            Más que tecnología reacondicionada. Un servicio completo con garantías reales.
          </p>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.25rem',
        }}>
          {benefits.map((b, i) => (
            <BenefitCard key={i} b={b} delay={i * 0.06} />
          ))}
        </div>

        {/* Banner inferior */}
        <div style={{
          marginTop: '4rem',
          padding: '2.5rem 3rem',
          background: 'linear-gradient(135deg, var(--accent) 0%, #4A40EE 100%)',
          borderRadius: 'var(--radius-card)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1.5rem',
        }}>
          <div>
            <p style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--white)', marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>
              Más de 5,000 dispositivos reacondicionados en 2025
            </p>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)' }}>
              Cada uno inspeccionado, certificado y garantizado.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
            {[['12', 'técnicos'], ['97%', 'satisfacción'], ['40+', 'puntos']] .map(([v, l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--white)', letterSpacing: '-0.04em', lineHeight: 1 }}>{v}</p>
                <p style={{ fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '1px' }}>{l}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
