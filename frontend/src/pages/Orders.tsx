import React from 'react';
import { useOrders } from '../hooks/useOrders';
import { Link } from 'react-router-dom';

const Orders: React.FC = () => {
  const { data: orders, isLoading, isError } = useOrders();

  const isWithin90Days = (dateString?: string) => {
    if (!dateString) return false;
    const orderDate = new Date(dateString).getTime();
    const now = Date.now();
    const ninetyDaysInMs = 90 * 24 * 60 * 60 * 1000;
    return now - orderDate <= ninetyDaysInMs;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f0f0f0] flex items-center justify-center p-10">
        <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-bounce font-black uppercase italic text-2xl">
          Cargando pedidos...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#f0f0f0] flex items-center justify-center p-10">
        <div className="bg-red-100 border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] font-black uppercase italic text-2xl text-red-600">
          Error al cargar pedidos
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-[#f0f0f0] py-12 px-6">
        <div className="max-w-4xl mx-auto bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-12 text-center">
          <h1 className="text-5xl font-black mb-6 uppercase italic tracking-tighter">Mis Pedidos</h1>
          <p className="text-xl font-bold text-gray-600 mb-8">No tienes pedidos registrados aún.</p>
          <Link 
            to="/home" 
            className="inline-block bg-black text-white font-black py-4 px-10 border-4 border-black hover:bg-white hover:text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all uppercase italic text-2xl"
          >
            Ir a comprar
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f0f0] py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-6xl font-black mb-12 uppercase italic tracking-tighter border-b-8 border-black pb-4 inline-block">
          Mis Pedidos
        </h1>
        
        <div className="space-y-12">
          {orders.map((order) => {
            const canRequestWarranty = isWithin90Days(order.createdAt);
            const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
            
            return (
              <div key={order._id} className="bg-white border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                {/* Header del pedido */}
                <div className="bg-yellow-400 border-b-4 border-black px-8 py-6 flex flex-wrap justify-between items-center gap-6">
                  <div className="space-y-1">
                    <p className="text-xs font-black uppercase opacity-60">Fecha del pedido</p>
                    <p className="text-xl font-black">{new Date(order.createdAt || Date.now()).toLocaleDateString()}</p>
                  </div>
                  <div className="space-y-1 text-center">
                    <p className="text-xs font-black uppercase opacity-60">Total</p>
                    <p className="text-xl font-black text-white bg-black px-3 py-1 border-2 border-black">${order.total_amount.toFixed(2)}</p>
                  </div>
                  <div className="space-y-1 text-center">
                    <p className="text-xs font-black uppercase opacity-60">Estado</p>
                    <p className="text-xl font-black uppercase italic underline decoration-4 underline-offset-4">{order.status}</p>
                  </div>
                  <div>
                    {canRequestWarranty ? (
                      <Link 
                        to={`/warranties/new?orderId=${order._id}`}
                        className="inline-block bg-black text-white font-black py-3 px-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:bg-white hover:text-black hover:shadow-none transition-all uppercase italic text-sm"
                      >
                        Solicitar Garantía
                      </Link>
                    ) : (
                      <span className="inline-block bg-gray-200 text-gray-500 font-black py-3 px-6 border-4 border-gray-400 uppercase italic text-sm cursor-not-allowed">
                        Garantía Expirada
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Items del pedido */}
                <div className="p-8">
                  <h4 className="text-2xl font-black mb-6 uppercase italic underline decoration-black decoration-4 underline-offset-8">Productos ({totalItems}):</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-6 border-4 border-black p-4 group hover:bg-black hover:text-white transition-colors">
                        {item.product?.image_urls?.[0] && (
                          <div className="w-24 h-24 border-4 border-black overflow-hidden flex-shrink-0">
                            <img 
                              src={item.product.image_urls[0]} 
                              alt={item.product.name} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                            />
                          </div>
                        )}
                        <div className="space-y-1">
                          <p className="text-xl font-black uppercase leading-tight">{item.product?.name || 'Producto Desconocido'}</p>
                          <div className="flex gap-4 font-bold opacity-80 italic">
                            <span>Cant: {item.quantity}</span>
                            <span>|</span>
                            <span>Precio: ${item.price.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Orders;
