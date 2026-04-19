import { useState, useEffect } from 'react';
import { User, Settings, ShoppingBag, MapPin, CreditCard, LogOut, Store, Plus, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile({ user, onLogout, onLoginClick }) {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (activeTab === 'orders') {
      fetch('/api/orders')
        .then(res => res.json())
        .then(data => setOrders(data))
        .catch(err => console.error(err));
    } else if (activeTab === 'addresses') {
      fetch('/api/addresses')
        .then(res => res.json())
        .then(data => setAddresses(data))
        .catch(err => console.error(err));
    }
  }, [activeTab]);

  if (!user) {
    return (
      <div className="bg-[#fffcf2] min-h-screen pt-40 pb-20 flex flex-col items-center justify-center text-center px-4">
        <User size={64} className="text-mango-300 mb-6" />
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">You are not logged in</h2>
        <p className="text-gray-500 mb-8 max-w-md font-medium">Please sign in or create an account to view your profile, manage orders, and save delivery addresses.</p>
        <button onClick={onLoginClick} className="bg-mango-500 hover:bg-mango-600 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-mango-500/30 transition-transform active:scale-95">
          Sign In / Create Account
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#fffcf2] min-h-screen pb-20 pt-28 sm:pt-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8">My Account</h1>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 mb-6 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-mango-100 text-mango-600 flex items-center justify-center text-3xl font-black mb-4">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <h2 className="text-xl font-bold text-gray-900">{user?.name || 'Guest User'}</h2>
              <p className="text-sm text-gray-400 font-medium mb-4">{user?.email || 'guest@example.com'}</p>
              <div className="mb-4">
                <span className="text-xs font-bold uppercase px-3 py-1 bg-gray-100 text-gray-600 rounded-lg">{user?.role || 'User'}</span>
              </div>
              <button className="text-sm font-bold text-mango-600 bg-mango-50 px-4 py-2 rounded-xl w-full hover:bg-mango-100 transition-colors">
                Edit Profile
              </button>
            </div>

            <nav className="bg-white rounded-[2rem] p-4 shadow-sm border border-gray-100 flex flex-col gap-1">
              {[
                { id: 'orders', label: 'My Orders', icon: <ShoppingBag size={18} /> },
                { id: 'addresses', label: 'Saved Addresses', icon: <MapPin size={18} /> },
                { id: 'payments', label: 'Payment Methods', icon: <CreditCard size={18} /> },
                { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors w-full text-left
                    ${activeTab === tab.id ? 'bg-mango-50 text-mango-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
              
              <div className="h-px bg-gray-100 my-2"></div>
              
              {/* Partner CTA */}
              <button
                onClick={() => setActiveTab('partner')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors w-full text-left
                  ${activeTab === 'partner' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Store size={18} className={activeTab === 'partner' ? 'text-blue-600' : 'text-blue-500'} /> 
                Partner with Us
              </button>

              {/* Admin Panel Access */}
              {user?.role === 'admin' && (
                <button
                  onClick={() => navigate('/admin')}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-mango-600 bg-mango-50 hover:bg-mango-100 transition-colors w-full text-left mt-2 border border-mango-100"
                >
                  <ShieldCheck size={18} /> Admin Panel
                </button>
              )}

              <button onClick={onLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-red-500 hover:bg-red-50 transition-colors w-full text-left mt-2">
                <LogOut size={18} /> Logout
              </button>
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-gray-100 min-h-[500px]">
              
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Recent Orders</h2>
                  {orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order, i) => (
                        <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 rounded-2xl bg-gray-50/50 hover:bg-white hover:shadow-md transition-all gap-4">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <span className="font-extrabold text-gray-900">{order.id}</span>
                              <span className="text-xs font-bold px-2.5 py-1 bg-green-100 text-green-700 rounded-full">{order.status}</span>
                            </div>
                            <div className="text-sm text-gray-500 font-medium mb-1">{order.items}</div>
                            <div className="text-xs text-gray-400">{order.date}</div>
                          </div>
                          <div className="text-left sm:text-right">
                            <div className="font-extrabold text-lg text-gray-900">{order.total}</div>
                            <button className="text-mango-600 hover:text-mango-700 text-sm font-bold mt-1">Reorder</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <ShoppingBag size={48} className="mx-auto text-gray-200 mb-4 animate-pulse" />
                      <p className="text-gray-400 font-medium">Loading orders...</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'partner' && (
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Store size={28} className="text-blue-500" />
                    <h2 className="text-2xl font-extrabold text-gray-900">Partner with MangoBite</h2>
                  </div>
                  <p className="text-gray-500 font-medium mb-8">Are you a restaurant owner or a seller? Join our platform to reach thousands of hungry customers.</p>
                  
                  <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 md:p-8 text-center max-w-2xl mx-auto">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <Plus size={24} className="text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Add your Restaurant</h3>
                    <p className="text-blue-800/70 text-sm mb-6 max-w-md mx-auto">
                      Fill out our partner application form. We will review your details and get you onboarded within 48 hours.
                    </p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95">
                      Apply as Partner
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Account Settings</h2>
                  
                  <div className="space-y-6 max-w-2xl">
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
                      <h3 className="font-bold text-gray-900 mb-4">Personal Information</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Full Name</label>
                          <input type="text" defaultValue="Irfan Khan" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-mango-500 focus:ring-1 focus:ring-mango-500 text-sm font-medium" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Email Address</label>
                          <input type="email" defaultValue="irfan@example.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-mango-500 focus:ring-1 focus:ring-mango-500 text-sm font-medium" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Phone Number</label>
                          <input type="tel" defaultValue="+1 234 567 8900" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-mango-500 focus:ring-1 focus:ring-mango-500 text-sm font-medium" />
                        </div>
                      </div>
                      <button className="mt-4 bg-gray-900 hover:bg-gray-800 text-white font-bold py-2.5 px-6 rounded-xl transition-colors text-sm">
                        Save Changes
                      </button>
                    </div>

                    <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
                      <h3 className="font-bold text-red-700 mb-2">Danger Zone</h3>
                      <p className="text-sm text-red-600/80 mb-4 font-medium">Once you delete your account, there is no going back. Please be certain.</p>
                      <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-sm active:scale-95 text-sm flex items-center gap-2">
                        <LogOut size={16} /> Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'addresses' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-extrabold text-gray-900">Saved Addresses</h2>
                    <button className="bg-mango-50 text-mango-600 font-bold px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-mango-100 transition-colors text-sm">
                      <Plus size={16} /> Add New
                    </button>
                  </div>

                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 mb-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <MapPin size={18} className="text-mango-500" /> Add Delivery Address
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Street Address</label>
                        <input type="text" placeholder="123 Food Street" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-mango-500 focus:ring-1 focus:ring-mango-500 text-sm font-medium" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">City</label>
                        <input type="text" placeholder="New York" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-mango-500 focus:ring-1 focus:ring-mango-500 text-sm font-medium" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Zip Code</label>
                        <input type="text" placeholder="10001" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-mango-500 focus:ring-1 focus:ring-mango-500 text-sm font-medium" />
                      </div>
                      <div className="md:col-span-2 mt-2">
                        {/* Map Point Placeholder */}
                        <div className="w-full h-32 bg-blue-50/50 border border-blue-100 border-dashed rounded-xl flex flex-col items-center justify-center text-blue-500 mb-4 hover:bg-blue-50 transition-colors cursor-pointer">
                          <MapPin size={24} className="mb-2" />
                          <span className="font-bold text-sm">Click to set exact map point</span>
                        </div>
                        <button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-xl transition-colors">
                          Save Address
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {addresses.length > 0 ? addresses.map(addr => (
                      <div key={addr.id} className={`border-2 rounded-2xl p-4 flex items-start gap-4 ${addr.isDefault ? 'border-mango-500 bg-mango-50/30' : 'border-gray-100 bg-white'}`}>
                        <div className={`p-2 rounded-full mt-1 ${addr.isDefault ? 'bg-mango-100 text-mango-600' : 'bg-gray-100 text-gray-500'}`}><MapPin size={20} /></div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-extrabold text-gray-900">{addr.type}</h4>
                            {addr.isDefault && <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-mango-500 text-white rounded-full">Default</span>}
                          </div>
                          <p className="text-sm font-medium text-gray-500">{addr.street}<br/>{addr.city} {addr.zip}</p>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-8">
                        <p className="text-gray-400 font-medium">Loading addresses...</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'payments' && (
                <div className="animate-in fade-in duration-500">
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Payment Methods</h2>
                  <div className="bg-[#fcfcfc] border-2 border-dashed border-gray-100 rounded-[2rem] p-10 text-center">
                    <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-50">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" alt="Razorpay" className="w-16 h-16 object-contain" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Primary Payment: Razorpay</h3>
                    <p className="text-gray-500 font-medium max-w-sm mx-auto mb-8">
                      Your payments are securely handled by Razorpay. You can pay using UPI, Cards, or Netbanking during checkout.
                    </p>
                    <button className="bg-gray-900 text-white font-bold py-3 px-8 rounded-xl hover:bg-black transition-all">
                      Manage Razorpay Account
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
