import { useState, useEffect } from 'react';
import { User, Settings, ShoppingBag, MapPin, LogOut, Store, Plus, ShieldCheck, Bell, UtensilsCrossed } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile({ user, onLogout, onLoginClick }) {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [myRestaurant, setMyRestaurant] = useState(null);
  const [newAddress, setNewAddress] = useState({ line1: '', line2: '', city: '', zip: '' });
  const navigate = useNavigate();

  const fetchAddresses = () => {
    fetch('/api/addresses').then(r => r.json()).then(setAddresses).catch(console.error);
  };

  useEffect(() => {
    if (activeTab === 'orders') {
      fetch('/api/orders').then(r => r.json()).then(setOrders).catch(console.error);
    } else if (activeTab === 'addresses') {
      fetchAddresses();
    } else if (activeTab === 'notifications') {
      fetch('/api/notifications').then(r => r.json()).then(setNotifications).catch(console.error);
    } else if (activeTab === 'restaurant' && (user?.role === 'partner' || user?.role === 'admin')) {
      fetch('/api/my-restaurant').then(r => r.json()).then(setMyRestaurant).catch(console.error);
    }
  }, [activeTab]);

  const handleSaveAddress = async () => {
    if (!newAddress.line1 || !newAddress.city || !newAddress.zip) {
      return alert("Please fill in required fields");
    }
    const street = [newAddress.line1, newAddress.line2].filter(Boolean).join(', ');
    const res = await fetch('/api/addresses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ street, city: newAddress.city, zip: newAddress.zip, type: 'Home' })
    });
    if (res.ok) { setNewAddress({ line1: '', line2: '', city: '', zip: '' }); fetchAddresses(); }
  };

  if (!user) {
    return (
      <div className="bg-[#fffcf2] min-h-screen pt-40 pb-20 flex flex-col items-center justify-center text-center px-4">
        <User size={64} className="text-mango-300 mb-6" />
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">You are not logged in</h2>
        <p className="text-gray-500 mb-8 max-w-md font-medium">Sign in to view your profile, manage orders, and save delivery addresses.</p>
        <button onClick={onLoginClick} className="bg-mango-500 hover:bg-mango-600 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-mango-500/30 transition-transform active:scale-95">
          Sign In / Create Account
        </button>
      </div>
    );
  }

  const tabs = [
    { id: 'orders', label: 'My Orders', icon: <ShoppingBag size={18} /> },
    { id: 'addresses', label: 'Saved Addresses', icon: <MapPin size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];


  if (user?.role === 'partner' || user?.role === 'admin') {
    tabs.splice(3, 0, { id: 'restaurant', label: 'Manage Restaurant', icon: <UtensilsCrossed size={18} /> });
  }

  return (
    <div className="bg-[#fffcf2] min-h-screen pb-20 pt-28 sm:pt-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8">My Account</h1>
        <div className="flex flex-col md:flex-row gap-8">

          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 mb-6 flex flex-col items-center text-center">
              {user?.profilePic ? (
                <img src={user.profilePic} alt={user.name} className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-mango-100" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-mango-100 text-mango-600 flex items-center justify-center text-3xl font-black mb-4">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              )}
              <h2 className="text-xl font-bold text-gray-900">{user?.name || 'Guest User'}</h2>
              <p className="text-sm text-gray-400 font-medium mb-4">{user?.email}</p>
              <span className={`text-xs font-bold uppercase px-3 py-1 rounded-lg ${user?.role === 'partner' ? 'bg-blue-100 text-blue-700' : user?.role === 'admin' ? 'bg-mango-100 text-mango-700' : 'bg-gray-100 text-gray-600'}`}>
                {user?.role || 'User'}
              </span>
            </div>

            <nav className="bg-white rounded-[2rem] p-4 shadow-sm border border-gray-100 flex flex-col gap-1">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors w-full text-left ${activeTab === tab.id ? 'bg-mango-50 text-mango-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                  {tab.icon} {tab.label}
                </button>
              ))}

              <div className="h-px bg-gray-100 my-2" />

              {user?.role !== 'partner' && (
                <button onClick={() => navigate('/partner')} className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-gray-600 hover:bg-gray-50 transition-colors w-full text-left">
                  <Store size={18} className="text-blue-500" /> Partner with Us
                </button>
              )}

              {user?.role === 'admin' && (
                <button onClick={() => navigate('/admin')} className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-mango-600 bg-mango-50 hover:bg-mango-100 transition-colors w-full text-left mt-2 border border-mango-100">
                  <ShieldCheck size={18} /> Admin Panel
                </button>
              )}

              <button onClick={onLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-red-500 hover:bg-red-50 transition-colors w-full text-left mt-2">
                <LogOut size={18} /> Logout
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-gray-100 min-h-[500px]">

              {/* ORDERS */}
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Recent Orders</h2>
                  {orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order, i) => (
                        <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 rounded-2xl bg-gray-50/50 hover:bg-white hover:shadow-md transition-all gap-4">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <span className="font-extrabold text-gray-900">#{order.order_id || order.id}</span>
                              <span className="text-xs font-bold px-2.5 py-1 bg-green-100 text-green-700 rounded-full">{order.status || 'Placed'}</span>
                            </div>
                            <div className="text-sm text-gray-500 font-medium mb-1">{order.name || order.items}</div>
                            <div className="text-xs text-gray-400">{order.ordered_at ? new Date(order.ordered_at).toLocaleDateString() : order.date}</div>
                          </div>
                          <div className="text-left sm:text-right">
                            <div className="font-extrabold text-lg text-gray-900">₹{order.total_amount || order.total}</div>
                            <button className="text-mango-600 hover:text-mango-700 text-sm font-bold mt-1">Reorder</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <ShoppingBag size={48} className="mx-auto text-gray-200 mb-4" />
                      <p className="text-gray-400 font-medium">No orders yet. Start ordering!</p>
                    </div>
                  )}
                </div>
              )}

              {/* ADDRESSES */}
              {activeTab === 'addresses' && (
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Saved Addresses</h2>
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 mb-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><MapPin size={18} className="text-mango-500" /> Add Delivery Address</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Address Line 1 *</label>
                        <input type="text" value={newAddress.line1} onChange={e => setNewAddress({ ...newAddress, line1: e.target.value })} placeholder="House No, Building, Street" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-mango-500 text-sm font-medium" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Address Line 2 (Optional)</label>
                        <input type="text" value={newAddress.line2} onChange={e => setNewAddress({ ...newAddress, line2: e.target.value })} placeholder="Locality, Area" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-mango-500 text-sm font-medium" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">City *</label>
                        <input type="text" value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} placeholder="Mumbai" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-mango-500 text-sm font-medium" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">PIN Code *</label>
                        <input type="text" value={newAddress.zip} onChange={e => setNewAddress({ ...newAddress, zip: e.target.value })} placeholder="400001" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-mango-500 text-sm font-medium" />
                      </div>
                      <div className="md:col-span-2">
                        <button onClick={handleSaveAddress} className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-xl transition-colors">Save Address</button>
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
                          <p className="text-sm font-medium text-gray-500">{addr.street}<br />{addr.city} {addr.zip}</p>
                        </div>
                      </div>
                    )) : (
                      <p className="text-center text-gray-400 font-medium py-8">No saved addresses yet.</p>
                    )}
                  </div>
                </div>
              )}

              {/* NOTIFICATIONS */}
              {activeTab === 'notifications' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-extrabold text-gray-900">Notifications</h2>
                    {notifications.length > 0 && (
                      <button onClick={() => fetch('/api/notifications', { method: 'DELETE' }).then(() => setNotifications([]))}
                        className="text-sm font-bold text-gray-400 hover:text-red-500 transition-colors">
                        Mark all read
                      </button>
                    )}
                  </div>
                  {notifications.length > 0 ? (
                    <div className="space-y-3">
                      {notifications.map(n => (
                        <div key={n.notification_id} className={`p-4 rounded-2xl border transition-all ${n.is_read ? 'bg-gray-50 border-gray-100' : 'bg-mango-50/40 border-mango-200'}`}>
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <p className="font-bold text-gray-900 text-sm">{n.title}</p>
                              <p className="text-sm text-gray-500 font-medium mt-1">{n.message}</p>
                            </div>
                            {!n.is_read && <span className="w-2.5 h-2.5 rounded-full bg-mango-500 mt-1.5 shrink-0" />}
                          </div>
                          <p className="text-xs text-gray-400 mt-2">{new Date(n.created_at).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <Bell size={48} className="mx-auto text-gray-200 mb-4" />
                      <p className="text-gray-400 font-medium">No notifications yet.</p>
                    </div>
                  )}
                </div>
              )}

              {/* MANAGE RESTAURANT */}
              {activeTab === 'restaurant' && (user?.role === 'partner' || user?.role === 'admin') && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-extrabold text-gray-900">Manage Restaurant</h2>
                    <button onClick={() => navigate('/restaurant-admin')}
                      className="bg-mango-500 hover:bg-mango-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-sm">
                      <UtensilsCrossed size={16} /> Full Menu Manager
                    </button>
                  </div>
                  {myRestaurant ? (
                    <div className="space-y-6">
                      <div className="relative rounded-[1.5rem] overflow-hidden h-44 bg-gray-100">
                        {myRestaurant.img && <img src={myRestaurant.img} alt={myRestaurant.name} className="w-full h-full object-cover" />}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                          <div>
                            <h3 className="text-2xl font-extrabold text-white">{myRestaurant.name}</h3>
                            <p className="text-white/80 text-sm font-medium">{myRestaurant.type}</p>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {[
                          { label: 'Status', value: myRestaurant.is_active ? '✅ Active' : '⏳ Pending Review' },
                          { label: 'Rating', value: '⭐ ' + (myRestaurant.rating || 'New') },
                          { label: 'Delivery Time', value: myRestaurant.delivery_time || 'N/A' },
                          { label: 'Delivery Fee', value: myRestaurant.delivery_fee ? '₹' + myRestaurant.delivery_fee : 'Free' },
                          { label: 'Address', value: myRestaurant.address || 'Not set' },
                        ].map(item => (
                          <div key={item.label} className="bg-gray-50 rounded-2xl p-4">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{item.label}</p>
                            <p className="font-bold text-gray-900 text-sm">{item.value}</p>
                          </div>
                        ))}
                      </div>
                      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-start gap-4">
                        <UtensilsCrossed className="text-blue-500 shrink-0 mt-1" size={24} />
                        <div>
                          <p className="font-bold text-blue-900">Ready to manage your menu?</p>
                          <p className="text-sm text-blue-700/80 font-medium mt-1">Use the Full Menu Manager to add, edit, or remove food items from your restaurant's menu.</p>
                          <button onClick={() => navigate('/restaurant-admin')} className="mt-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-xl text-sm transition-colors">
                            Open Menu Manager →
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <Store size={56} className="mx-auto text-gray-200 mb-4" />
                      <h3 className="text-xl font-extrabold text-gray-900 mb-2">No Restaurant Found</h3>
                      <p className="text-gray-500 font-medium mb-6 max-w-sm mx-auto">You haven't registered a restaurant yet. Partner with us to list your restaurant.</p>
                      <button onClick={() => navigate('/partner')} className="bg-mango-500 hover:bg-mango-600 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-sm shadow-mango-500/30">
                        Register Restaurant
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* SETTINGS */}
              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Account Settings</h2>
                  <div className="space-y-6 max-w-2xl">
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
                      <h3 className="font-bold text-gray-900 mb-4">Personal Information</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Full Name</label>
                          <input type="text" defaultValue={user?.name} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-mango-500 text-sm font-medium" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Email Address</label>
                          <input type="email" defaultValue={user?.email} disabled className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-sm font-medium text-gray-400 cursor-not-allowed" />
                        </div>
                      </div>
                      <button className="mt-4 bg-gray-900 hover:bg-gray-800 text-white font-bold py-2.5 px-6 rounded-xl transition-colors text-sm">Save Changes</button>
                    </div>
                    <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
                      <h3 className="font-bold text-red-700 mb-2">Danger Zone</h3>
                      <p className="text-sm text-red-600/80 mb-4 font-medium">Once you delete your account, there is no going back.</p>
                      <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 px-6 rounded-xl transition-all text-sm flex items-center gap-2">
                        <LogOut size={16} /> Delete Account
                      </button>
                    </div>
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
