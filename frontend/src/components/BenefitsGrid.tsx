import React from 'react';

const benefits = [
  {
    number: '01',
    title: 'Inspección Rigurosa',
    desc: 'Cada dispositivo pasa por más de 40 puntos de verificación con técnicos certificados antes de salir de nuestro almacén.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 32, height: 32 }}>
        <path d="M9 12l2 2 4-4m5.618A4 4 0 1 1 6 19.382V21m12-3h-18M3 3l18 18" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Garantía de 90 Días',
    desc: 'Si algo falla en los primeros 3 meses, lo resolvemos sin preguntas. Compra con total tranquilidad.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 32, height: 32 }}>
        <path d="M9 12l2 2 4-4M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Envío Express',
    desc: 'Recibe tu pedido en 24-48 horas. Empaque protegido con materiales reciclables en cada envío.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 32, height: 32 }}>
        <path d="M13 16V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1zm8-1V8m-5 1h.01M8 13h5m-3-6v6m0 0h5m0 0v-6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Soporte Humano',
    desc: 'Técnicos reales, no bots. Resolvemos cualquier duda por chat, mail o teléfono, siempre disponibles.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 32, height: 32 }}>
        <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    number: '05',
    title: 'Precios Justos',
    desc: 'Hasta 40% más barato que comprar nuevo. Misma calidad, mejor precio, menor impacto.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 32, height: 32 }}>
        <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    number: '06',
    title: 'Sostenibilidad',
    desc: 'Cada reacondicionado evita 50kg de residuos electrónicos. Tecnología responsable.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 32, height: 32 }}>
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 12l3-3m0 0l7 7a3 3 0 1 0 4-4L5 9m4 8l5 5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export const BenefitsGrid: React.FC = () => {
  return (
    <section style={{ padding: '6rem 0', background: 'var(--bg-secondary)' }}>
      <div className="page-container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <p style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '3px',
            color: 'var(--accent)',
            marginBottom: '1rem',
          }}>
            Nuestra promesa
          </p>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 600,
            letterSpacing: '-1px',
          }}>
            ¿Por qué elegir SafeTech?
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2px',
          background: 'var(--border)',
          border: '2px solid var(--border)',
        }}>
          {benefits.map((b, idx) => (
            <div
              key={idx}
              className="animate-slide-up"
              style={{
                padding: '2.5rem 2rem',
                background: 'var(--bg-secondary)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                transition: 'var(--transition)',
                animationDelay: `${idx * 0.1}s`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-muted)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-secondary)';
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
              }}>
                <span style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '3rem',
                  fontWeight: 600,
                  color: 'var(--border)',
                  lineHeight: 1,
                }}>
                  {b.number}
                </span>
                <div style={{ color: 'var(--accent)' }}>
                  {b.icon}
                </div>
              </div>
              <div>
                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  marginBottom: '0.5rem',
                }}>
                  {b.title}
                </h3>
                <p style={{
                  fontSize: '0.95rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                }}>
                  {b.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: '4rem',
          padding: '2.5rem',
          background: 'var(--bg-dark)',
          color: 'var(--bg-secondary)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '3rem',
          alignItems: 'center',
          textAlign: 'center',
        }}>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontStyle: 'italic' }}>
            Más de 5,000 dispositivos reacondicionados en 2025
          </p>
          <p style={{ color: 'var(--text-muted)' }}>
            Evaluados por un equipo de 12 técnicos certificados
          </p>
          <p style={{ color: 'var(--text-muted)' }}>
            97% de satisfacción en encuestas de post-venta
          </p>
        </div>
      </div>
    </section>
  );
};