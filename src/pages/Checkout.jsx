import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, MapPin, CheckCircle, ShieldCheck, Clock } from 'lucide-react';

export default function Checkout() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [address, setAddress] = useState({ line1: '', line2: '', line3: '', city: '', zip: '', coordinates: null });
  const [savedAddresses, setSavedAddresses] = useState([]);

  useEffect(() => {
    fetch('/api/cart')
      .then(res => res.json())
      .then(data => {
        setCart(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
      
    fetch('/api/addresses')
      .then(res => res.json())
      .then(data => setSavedAddresses(data))
      .catch(console.error);
  }, []);

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = cart.length > 0 ? 3.99 : 0;
  const total = subtotal + deliveryFee;

  const handleCheckout = async (e) => {
    if (e) e.preventDefault();
    if (cart.length === 0) return;
    setIsProcessing(true);
    
    const loadScript = () => {
      return new Promise((resolve) => {
        if(window.Razorpay) return resolve(true);
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    const res = await loadScript();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      setIsProcessing(false);
      return;
    }

    try {
      // 1. Create order on our backend
      const result = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Math.round(total * 100) })
      });
      const order = await result.json();

      // 2. Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        amount: order.amount,
        currency: order.currency,
        name: 'MangoBite',
        description: 'Food Delivery Order',
        order_id: order.id,
        handler: async function (response) {
          try {
            const res = await fetch('/api/confirm-order', { 
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                deliveryFee: deliveryFee, 
                addressId: savedAddresses.length > 0 ? savedAddresses[0].id : 1 
              })
            });
            if (res.ok) {
              window.dispatchEvent(new Event('navDataUpdated'));
              setIsProcessing(false);
              navigate('/order-success');
            } else {
              const data = await res.json();
              alert('Failed to place order: ' + (data.error || data.message));
              setIsProcessing(false);
            }
          } catch(err) {
            console.error('Failed to confirm order', err);
            alert('Failed to confirm order. Please try again.');
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: 'Irfan Khan',
          email: 'irfan@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#f59e0b'
        }
      };
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      
      paymentObject.on('payment.failed', function (response) {
        alert("Payment Failed");
        setIsProcessing(false);
      });
      
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
    }
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
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <MapPin className="text-mango-500" />
                  <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Delivery Address</h2>
                </div>
              </div>

              {savedAddresses.length > 0 && (
                <div className="mb-6 space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Saved Addresses</label>
                  <div className="grid gap-3">
                    {savedAddresses.map(addr => {
                      const addrParts = addr.street.split(', ');
                      return (
                      <div 
                        key={addr.id}
                        onClick={() => setAddress({
                          line1: addrParts[0] || addr.street,
                          line2: addrParts[1] || '',
                          line3: addrParts[2] || '',
                          city: addr.city,
                          zip: addr.zip,
                          coordinates: null
                        })}
                        className={`p-3 rounded-xl border-2 cursor-pointer transition-colors ${address.line1 === (addrParts[0] || addr.street) ? 'border-mango-500 bg-mango-50 dark:bg-mango-900/20' : 'border-gray-100 dark:border-gray-700 hover:border-mango-300'}`}
                      >
                        <div className="font-bold text-gray-900 dark:text-white text-sm">{addr.type}</div>
                        <div className="text-xs text-gray-500 mt-1">{addr.street}, {addr.city} {addr.zip}</div>
                      </div>
                    )})}
                  </div>
                  <div className="text-center text-xs font-bold text-gray-400 py-3">- OR ENTER MANUALLY -</div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-gray-300 ml-2">Address Line 1 (Mandatory) *</label>
                  <input type="text" required value={address.line1} onChange={(e)=>setAddress({...address, line1: e.target.value})} className="w-full px-5 py-3 rounded-xl border-2 border-mango-100 dark:border-mango-900/50 bg-white dark:bg-gray-900 focus:outline-none focus:border-mango-500 font-bold text-sm dark:text-white" placeholder="House No, Building, Street" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Address Line 2 (Optional)</label>
                  <input type="text" value={address.line2} onChange={(e)=>setAddress({...address, line2: e.target.value})} className="w-full px-5 py-3 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:border-mango-500 font-bold text-sm dark:text-white" placeholder="Locality, Area, Sector" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Address Line 3 (Optional)</label>
                  <input type="text" value={address.line3} onChange={(e)=>setAddress({...address, line3: e.target.value})} className="w-full px-5 py-3 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:border-mango-500 font-bold text-sm dark:text-white" placeholder="Landmark" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" required value={address.city} onChange={(e)=>setAddress({...address, city: e.target.value})} className="w-full px-5 py-3 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:border-mango-500 font-bold text-sm dark:text-white" placeholder="City *" />
                  <input type="text" required value={address.zip} onChange={(e)=>setAddress({...address, zip: e.target.value})} className="w-full px-5 py-3 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:border-mango-500 font-bold text-sm dark:text-white" placeholder="Zip Code *" />
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
