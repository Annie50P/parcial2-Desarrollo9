import React from 'react';
import { useProducts } from '../hooks/useProducts';

export const ProductList: React.FC = () => {
  const { data: products, isLoading, isError, error } = useProducts();

  if (isLoading) {
    return <div className="text-center py-4">Cargando productos...</div>;
  }

  if (isError) {
    return <div className="text-red-500 text-center py-4">Error: {error?.message}</div>;
  }

  if (!products || products.length === 0) {
    return <div className="text-center py-4">No hay productos disponibles.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {products.map((product) => (
        <div key={product._id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
          {product.image_urls && product.image_urls.length > 0 && (
             <img src={product.image_urls[0]} alt={product.name} className="w-full h-48 object-cover mb-4 rounded" />
          )}
          <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
          <p className="text-gray-600 mb-2 truncate">{product.description}</p>
          <div className="flex justify-between items-center mt-4">
            <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              Condición: {product.condition}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2">Stock disponible: {product.stock}</p>
        </div>
      ))}
    </div>
  );
};