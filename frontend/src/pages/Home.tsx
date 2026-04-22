import { ProductList } from '../components/ProductList';

export default function Home() {
  return (
    <div className="page-container">
      <div className="stagger-1">
        <h2 className="section-subhead">Certified Refurbished</h2>
        <h1 className="section-headline">Discover<br />Premium Tech.</h1>
      </div>
      
      <div className="mt-8">
        <ProductList />
      </div>
    </div>
  );
}
