import React from 'react';

const benefits = [
  {
    title: 'Productos Certificados A/B/C',
    desc: 'Cada dispositivo pasa por más de 40 puntos de inspección por expertos.',
    icon: '🔍',
  },
  {
    title: 'Garantía de 90 Días',
    desc: 'Compra con seguridad. Cubrimos cualquier falla de hardware en los primeros 3 meses.',
    icon: '🛡️',
  },
  {
    title: 'Envío Rápido',
    desc: 'Recibe tus compras en 24-48 horas a cualquier parte del país.',
    icon: '📦',
  },
  {
    title: 'Soporte 24/7',
    desc: 'Nuestro equipo de atención al cliente está siempre disponible para ti.',
    icon: '💬',
  }
];

export const BenefitsGrid: React.FC = () => {
  return (
    <section className="benefits-section page-container stagger-2">
      <h2 className="section-subhead" style={{marginBottom: '2.5rem', textAlign: 'center'}}>¿Por qué elegir SafeTech?</h2>
      <div className="benefits-grid">
        {benefits.map((b, idx) => (
          <div key={idx} className="benefit-card">
            <div className="benefit-icon">{b.icon}</div>
            <h3 className="benefit-title">{b.title}</h3>
            <p className="benefit-desc">{b.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
