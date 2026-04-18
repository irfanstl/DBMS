import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, MapPin, CheckCircle } from 'lucide-react';

export default function Checkout() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      navigate('/order-success');
    }, 2000);
  };

  return (
    <div className="bg-[#fffcf2] min-h-screen pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8">Checkout</h1>

        <form onSubmit={handleCheckout} className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="text-mango-500" />
                <h2 className="text-xl font-extrabold text-gray-900">Delivery Details</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Full Address</label>
                  <input type="text" required className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-mango-500 text-sm font-medium" placeholder="123 Food Street, Apt 4B" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">City</label>
                    <input type="text" required className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-mango-500 text-sm font-medium" placeholder="New York" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Zip Code</label>
                    <input type="text" required className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-mango-500 text-sm font-medium" placeholder="10001" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="text-mango-500" />
                <h2 className="text-xl font-extrabold text-gray-900">Payment Method</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Card Number</label>
                  <input type="text" required className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-mango-500 text-sm font-medium" placeholder="0000 0000 0000 0000" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Expiry Date</label>
                    <input type="text" required className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-mango-500 text-sm font-medium" placeholder="MM/YY" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">CVV</label>
                    <input type="text" required className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-mango-500 text-sm font-medium" placeholder="123" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-28">
              <h2 className="text-xl font-extrabold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-500 font-medium text-sm">
                  <span>Subtotal</span>
                  <span className="text-gray-900 font-bold">$40.97</span>
                </div>
                <div className="flex justify-between text-gray-500 font-medium text-sm">
                  <span>Delivery Fee</span>
                  <span className="text-gray-900 font-bold">$3.99</span>
                </div>
                <div className="flex justify-between text-gray-500 font-medium text-sm pt-4 border-t border-gray-100">
                  <span className="text-gray-900 font-extrabold text-lg">Total</span>
                  <span className="text-mango-600 font-black text-xl">$44.96</span>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isProcessing}
                className="w-full bg-mango-500 hover:bg-mango-600 disabled:bg-mango-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-mango-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isProcessing ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
