import React from 'react';
import { useNavigate } from 'react-router-dom';

const WarrantySuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f0f0] p-6">
      <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-12 max-w-lg w-full text-center">
        <div className="mb-6 inline-block bg-yellow-400 border-4 border-black p-4 rotate-3 animate-pulse">
           <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-20 w-20 text-black border-4 border-black p-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth={4}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-5xl font-black mb-4 uppercase italic tracking-tighter">
          Ticket Creado
        </h1>
        
        <p className="text-xl font-bold mb-8 leading-tight">
          Tu reporte de garantía ha sido enviado con éxito. Revisaremos las evidencias y te contactaremos pronto.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => navigate('/orders')}
            className="w-full bg-black text-white font-black py-4 px-8 border-4 border-black hover:bg-white hover:text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all uppercase italic text-xl"
          >
            Mis pedidos
          </button>
          
          <button
            onClick={() => navigate('/home')}
            className="w-full bg-white text-black font-black py-4 px-8 border-4 border-black hover:bg-black hover:text-white transition-all uppercase italic text-xl underline decoration-4 decoration-yellow-400"
          >
            Ir a la tienda
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarrantySuccess;
