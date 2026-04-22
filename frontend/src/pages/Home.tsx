import { ProductList } from '../components/ProductList';

export default function Home() {
  return (
    <div>
      <h2>Bienvenido al Catálogo de SafeTech</h2>
      <p>Explora nuestros productos reacondicionados con garantía.</p>
      
      <div className="mt-8">
        <ProductList />
      </div>
    </div>
  );
}
