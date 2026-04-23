import { HeroSection } from '../components/HeroSection';
import { BenefitsGrid } from '../components/BenefitsGrid';
import { FeaturedProducts } from '../components/FeaturedProducts';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div>
      <HeroSection />
      <BenefitsGrid />
      <FeaturedProducts />

      <section style={{
        padding: '6rem 0',
        background: 'var(--accent)',
        color: 'white',
      }}>
        <div className="page-container" style={{ textAlign: 'center' }}>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 600,
            marginBottom: '1rem',
            color: 'white',
          }}>
            Empieza a comprar tecnología que vale la pena
          </h2>
          <p style={{
            fontSize: '1.1rem',
            marginBottom: '2.5rem',
            opacity: 0.9,
          }}>
            Sin trampas. Sin sorpresas. Solo dispositivos que funcionan.
          </p>
          <button
            onClick={() => navigate('/home')}
            style={{
              background: 'white',
              color: 'var(--accent)',
              border: '2px solid white',
              padding: '16px 40px',
              fontFamily: 'var(--font-display)',
              fontSize: '0.9rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              cursor: 'pointer',
              transition: 'var(--transition)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              (e.currentTarget as HTMLButtonElement).style.color = 'white';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'white';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--accent)';
            }}
          >
            Ver catálogo ahora
          </button>
        </div>
      </section>

      <footer style={{
        padding: '3rem 0',
        background: 'var(--bg-dark)',
        color: 'var(--bg-muted)',
      }}>
        <div className="page-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontStyle: 'italic' }}>SafeTech</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>© 2025 SafeTech. Tecnología reacondicionada responsablemente.</p>
        </div>
      </footer>
    </div>
  );
}