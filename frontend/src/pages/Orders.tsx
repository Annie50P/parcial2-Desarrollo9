import React from 'react';
import { useOrders } from '../hooks/useOrders';
import { Link } from 'react-router-dom';

const Orders: React.FC = () => {
  const { data: orders, isLoading, isError } = useOrders();

  if (isLoading) {
    return <div className="text-center py-10">Loading orders...</div>;
  }

  if (isError) {
    return <div className="text-center py-10 text-red-500">Error fetching orders</div>;
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>
        <div className="bg-gray-50 border border-gray-200 text-center py-12 rounded-lg">
          <p className="text-gray-500 text-lg">You have no orders yet</p>
          <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-medium mt-4 inline-block">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      <div className="space-y-6">
        {orders.map((order) => {
          const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
          
          return (
            <div key={order._id} className="bg-white border rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b flex flex-wrap justify-between items-center gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order Placed</p>
                  <p className="font-medium">{new Date(order.createdAt || Date.now()).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="font-medium">${order.total_amount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Items</p>
                  <p className="font-medium">{totalItems}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                    ${order.status === 'paid' ? 'bg-green-100 text-green-800' : 
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : 
                      'bg-yellow-100 text-yellow-800'}`}>
                    {order.status}
                  </span>
                </div>
                <div>
                  <Link 
                    to={`/warranties?orderId=${order._id}`}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Solicitar Garantía
                  </Link>
                </div>
              </div>
              
              <div className="px-6 py-4">
                <h4 className="text-md font-medium mb-3">Items in your order</h4>
                <ul className="divide-y divide-gray-200">
                  {order.items.map((item, index) => (
                    <li key={index} className="py-3 flex items-center">
                      {item.product?.image_urls?.[0] && (
                        <img 
                          src={item.product.image_urls[0]} 
                          alt={item.product.name} 
                          className="h-16 w-16 object-cover rounded mr-4"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{item.product?.name || 'Unknown Product'}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity} | Price: ${item.price.toFixed(2)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
