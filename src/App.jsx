import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginModal from './components/LoginModal';
import Home from './pages/Home';
import RestaurantDetails from './pages/RestaurantDetails';
import FoodItem from './pages/FoodItem';
import Profile from './pages/Profile';
import AllRestaurants from './pages/AllRestaurants';
import Cart from './pages/Cart';
import Contact from './pages/Contact';
import SearchResults from './pages/SearchResults';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Admin from './pages/Admin';

export default function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('user_data');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user_data');
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#fffcf2] dark:bg-gray-950 font-sans selection:bg-mango-200 selection:text-mango-900 overflow-x-hidden pt-20 transition-colors duration-300">
        <Navbar 
          isLoggedIn={isLoggedIn} 
          user={user}
          onLogout={handleLogout}
          onLoginClick={() => setIsLoginOpen(true)} 
          onSearchChange={setSearchQuery}
        />
        <LoginModal 
          isOpen={isLoginOpen} 
          onClose={() => setIsLoginOpen(false)} 
          onLogin={(userData) => {
            localStorage.setItem('user_data', JSON.stringify(userData));
            setUser(userData);
            setIsLoggedIn(true);
            setIsLoginOpen(false);
          }} 
        />
        
        <Routes>
          <Route path="/" element={<Home searchQuery={searchQuery} />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/restaurants" element={<AllRestaurants />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/restaurant/:id" element={<RestaurantDetails />} />
          <Route path="/food/:id" element={<FoodItem />} />
          <Route path="/profile" element={<Profile user={user} onLogout={handleLogout} onLoginClick={() => setIsLoginOpen(true)} />} />
          <Route path="/admin" element={user?.role === 'admin' ? <Admin /> : <Navigate to="/" replace />} />
        </Routes>
        
        <footer className="bg-gray-900 text-white py-12 relative z-10 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="text-2xl font-extrabold text-white tracking-tight mb-4 flex items-center gap-2">MangoBite <span className="text-mango-500">.</span></h3>
                <p className="text-gray-400">The fastest food delivery service in your city. Freshness guaranteed.</p>
              </div>
              <div>
                <h4 className="font-bold mb-4 text-gray-100">Quick Links</h4>
                <div className="flex flex-col space-y-2 text-gray-400">
                  <a href="#" className="hover:text-mango-500 transition-colors">About Us</a>
                  <a href="#" className="hover:text-mango-500 transition-colors">Contact</a>
                  <a href="#" className="hover:text-mango-500 transition-colors">Partners</a>
                </div>
              </div>
              <div>
                <h4 className="font-bold mb-4 text-gray-100">Legal</h4>
                <div className="flex flex-col space-y-2 text-gray-400">
                  <a href="#" className="hover:text-mango-500 transition-colors">Terms of Service</a>
                  <a href="#" className="hover:text-mango-500 transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-mango-500 transition-colors">Refund Policy</a>
                </div>
              </div>
              <div>
                <h4 className="font-bold mb-4 text-gray-100">Download App</h4>
                <div className="flex flex-col space-y-3">
                  <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl flex items-center gap-3 transition-colors border border-gray-700">
                    <div className="text-left">
                      <div className="text-[10px] text-gray-400">GET IT ON</div>
                      <div className="text-sm font-bold">Google Play</div>
                    </div>
                  </button>
                  <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl flex items-center gap-3 transition-colors border border-gray-700">
                    <div className="text-left">
                      <div className="text-[10px] text-gray-400">Download on the</div>
                      <div className="text-sm font-bold">App Store</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between text-gray-500 text-sm">
              <p>&copy; 2026 MangoBite Inc. All rights reserved.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="hover:text-white transition-colors">Twitter</a>
                <a href="#" className="hover:text-white transition-colors">Instagram</a>
                <a href="#" className="hover:text-white transition-colors">Facebook</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
