import { ArrowLeft, Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch('/api/cart').then(res => res.json()).then(setCart);
  }, []);

  const updateQuantity = async (id, action) => {
    const res = await fetch(`/api/cart/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action })
    });
    setCart(await res.json());
  };

  const removeItem = async (id) => {
    const res = await fetch(`/api/cart/${id}`, { method: 'DELETE' });
    setCart(await res.json());
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = cart.length > 0 ? 3.99 : 0;
  const total = subtotal + deliveryFee;

  return (
    <div className="bg-[#fffcf2] min-h-screen pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center gap-4 mb-8">
          <Link to="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={24} className="text-gray-900" />
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Cart</h1>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <p className="text-gray-500 font-medium">Your cart is empty.</p>
                <Link to="/" className="text-mango-600 font-bold mt-2 inline-block hover:underline">Explore Menu</Link>
              </div>
            ) : cart.map(item => (
              <div key={item.id} className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-4 items-center shadow-sm">
                <img src={item.img} alt={item.name} className="w-24 h-24 object-cover rounded-xl" />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-extrabold text-gray-900">{item.name}</h3>
                    <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="font-extrabold text-mango-600 mb-3">₹{item.price}</div>
                  
                  <div className="flex items-center gap-3 bg-gray-50 w-fit rounded-lg p-1 border border-gray-100">
                    <button onClick={() => updateQuantity(item.id, 'sub')} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-white rounded-md transition-colors shadow-sm">
                      <Minus size={14} />
                    </button>
                    <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 'add')} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-white rounded-md transition-colors shadow-sm">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Summary */}
          <div>
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-28">
              <h2 className="text-xl font-extrabold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-500 font-medium text-sm">
                  <span>Subtotal</span>
                  <span className="text-gray-900 font-bold">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500 font-medium text-sm">
                  <span>Delivery Fee</span>
                  <span className="text-gray-900 font-bold">₹{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500 font-medium text-sm pt-4 border-t border-gray-100">
                  <span className="text-gray-900 font-extrabold text-lg">Total</span>
                  <span className="text-mango-600 font-black text-xl">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <Link to="/checkout" className="w-full bg-mango-500 hover:bg-mango-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-mango-500/30 transition-transform active:scale-[0.98] flex items-center justify-center gap-2">
                Checkout Now
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
