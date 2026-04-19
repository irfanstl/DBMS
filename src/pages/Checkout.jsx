import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, MapPin, CheckCircle, ShieldCheck, Clock } from 'lucide-react';

export default function Checkout() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/cart')
      .then(res => res.json())
      .then(data => {
        setCart(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = cart.length > 0 ? 3.99 : 0;
  const total = subtotal + deliveryFee;

  const handleCheckout = (e) => {
    if (e) e.preventDefault();
    if (cart.length === 0) return;
    setIsProcessing(true);
    setTimeout(() => {
      navigate('/order-success');
    }, 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex gap-2">
          <div className="w-4 h-4 bg-mango-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-4 h-4 bg-mango-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-4 h-4 bg-mango-500 rounded-full animate-bounce"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fffcf2] dark:bg-gray-950 min-h-screen pt-28 pb-20 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-8">Checkout</h1>

        <form onSubmit={handleCheckout} className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {/* Delivery Section */}
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="text-mango-500" />
                <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Delivery Address</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-gray-300 ml-2">Address 1 (Mandatory) *</label>
                  <input type="text" required className="w-full px-5 py-3 rounded-xl border-2 border-mango-100 dark:border-mango-900/50 bg-white dark:bg-gray-900 focus:outline-none focus:border-mango-500 font-bold text-sm dark:text-white" placeholder="House No, Building, Street" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Address 2 (Optional)</label>
                  <input type="text" className="w-full px-5 py-3 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:border-mango-500 font-bold text-sm dark:text-white" placeholder="Landmark, Area" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" className="w-full px-5 py-3 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:border-mango-500 font-bold text-sm dark:text-white" placeholder="City" />
                  <input type="text" className="w-full px-5 py-3 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:border-mango-500 font-bold text-sm dark:text-white" placeholder="Zip Code" />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-[2rem] p-8 shadow-xl shadow-gray-200/10 sticky top-28">
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                {/* Dynamic Item List */}
                <div className="pb-4 border-b border-gray-100 dark:border-gray-700 space-y-3 max-h-48 overflow-y-auto pr-2">
                  {cart.length === 0 ? (
                    <p className="text-xs text-gray-400 font-bold text-center py-4">No items in cart</p>
                  ) : cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-mango-50 dark:bg-mango-900/30 text-mango-600 dark:text-mango-400 rounded flex items-center justify-center font-bold text-[10px]">{item.quantity}x</span>
                        <span className="font-bold text-gray-700 dark:text-gray-300">{item.name}</span>
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Delivery Logistics */}
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-3 text-xs font-bold text-gray-500 dark:text-gray-400">
                    <MapPin size={14} className="text-mango-500" />
                    <span>Restaurant: {cart[0]?.restaurantName || 'Mango Hub Express'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-gray-500 dark:text-gray-400">
                    <Clock size={14} className="text-mango-500" />
                    <span>Estimate: 35-45 Mins</span>
                  </div>
                </div>

                <div className="flex justify-between text-gray-500 dark:text-gray-400 font-medium text-sm pt-4">
                  <span>Subtotal</span>
                  <span className="text-gray-900 dark:text-white font-bold">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500 dark:text-gray-400 font-medium text-sm">
                  <span>Delivery Fee</span>
                  <span className="text-gray-900 dark:text-white font-bold">₹{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-900 dark:text-white font-extrabold text-lg pt-6 border-t border-gray-100 dark:border-gray-700">
                  <span>Total</span>
                  <span className="text-mango-600 dark:text-mango-400 font-black text-2xl">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isProcessing || cart.length === 0}
                className="w-full bg-mango-500 hover:bg-mango-600 disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 text-white font-black py-5 rounded-2xl shadow-lg shadow-mango-500/30 transition-all active:scale-95 flex items-center justify-center min-h-[64px]"
              >
                {isProcessing ? (
                  <div className="flex gap-2">
                    <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce"></div>
                  </div>
                ) : (
                  'Pay with Razorpay'
                )}
              </button>
              
              <p className="text-[10px] text-center text-gray-400 font-bold uppercase mt-4 tracking-widest">
                Trusted by 50,000+ Customers
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
