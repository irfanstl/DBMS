import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function OrderSuccess() {
  return (
    <div className="bg-[#fffcf2] min-h-screen pt-40 pb-20 flex flex-col items-center justify-center text-center px-4">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 max-w-md w-full relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-mango-400 to-green-500"></div>
        <CheckCircle size={80} className="text-green-500 mx-auto mb-6 drop-shadow-md" />
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Order Placed!</h1>
        <p className="text-gray-500 font-medium mb-6">Your delicious food is being prepared and will be delivered shortly.</p>
        
        <div className="bg-gray-50 rounded-2xl p-4 mb-8">
          <p className="text-sm text-gray-500 font-medium mb-1">Order Number</p>
          <p className="text-xl font-extrabold text-gray-900">#ORD-{Math.floor(1000 + Math.random() * 9000)}</p>
        </div>

        <Link to="/" className="w-full block bg-mango-500 hover:bg-mango-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-mango-500/30 transition-transform active:scale-[0.98]">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
