import { ShoppingBag, Search, Menu, User, MapPin, ChevronDown, Bell, Moon, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Navbar({ isLoggedIn, user, onLogout, onLoginClick, onSearchChange }) {
  const [cartCount, setCartCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const navigate = useNavigate();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const fetchNavData = () => {
    fetch('/api/cart').then(res => res.json()).then(data => {
      setCartCount(data.reduce((acc, item) => acc + item.quantity, 0));
    });
    fetch('/api/notifications').then(res => res.json()).then(setNotifications);
  };

  useEffect(() => {
    fetchNavData();
    window.addEventListener('navDataUpdated', fetchNavData);
    return () => window.removeEventListener('navDataUpdated', fetchNavData);
  }, []);

  const clearNotifications = async () => {
    const res = await fetch('/api/notifications', { method: 'DELETE' });
    setNotifications(await res.json());
    setIsNotifOpen(false);
  };

  const toggleDarkMode = () => {
    setIsDark(!isDark);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass shadow-[0_4px_30px_rgba(0,0,0,0.02)] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-4 lg:gap-8">
            <Link to="/" className="flex items-center gap-2 cursor-pointer group">
              <div className="flex items-center justify-center w-12 h-12 transition-transform group-hover:scale-110">
                <img src="/icon.png" alt="MangoBite" className="w-full h-full brand-icon" />
              </div>
            <span className="font-extrabold text-2xl tracking-tight text-gray-900 hidden sm:block">
              Mango<span className="text-mango-500">Bite</span>
            </span>
          </Link>


        </div>

        <div className="hidden lg:flex items-center space-x-10">
          <Link to="/" className="font-semibold text-mango-600 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-mango-500 after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:duration-300">Home</Link>
          <Link to="/contact" className="font-semibold text-gray-500 hover:text-gray-900 transition-colors">Contact</Link>

        </div>

        <div className="flex items-center gap-3 md:gap-5">
          <div className="hidden sm:flex items-center bg-gray-50 px-4 py-2.5 rounded-full border border-gray-100 focus-within:border-mango-500 focus-within:ring-2 focus-within:ring-mango-500/20 transition-all w-48 lg:w-64 shadow-inner">
            <Search size={18} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search food or places..."
              className="bg-transparent border-none outline-none ml-2 text-sm w-full font-medium text-gray-900 placeholder-gray-400 placeholder:select-none"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                onSearchChange?.(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchValue.trim()) {
                  navigate(`/search?q=${encodeURIComponent(searchValue)}`);
                  setSearchValue('');
                  onSearchChange?.('');
                }
              }}
            />
          </div>

          {/* Dark Mode & Notifications */}
          <div className="hidden lg:flex items-center gap-2">
            <button onClick={toggleDarkMode} className="p-2 text-gray-500 hover:text-mango-600 bg-gray-50 hover:bg-mango-50 rounded-full transition-colors border border-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 dark:text-gray-300">
              <Moon size={20} />
            </button>
            <div className="relative">
              <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="relative p-2 text-gray-500 hover:text-mango-600 bg-gray-50 hover:bg-mango-50 rounded-full transition-colors border border-gray-100">
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                )}
              </button>
              {isNotifOpen && (
                <div className="absolute right-0 mt-3 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                  <div className="p-3 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-extrabold text-gray-900">Notifications</h3>
                    {notifications.length > 0 && (
                      <button onClick={clearNotifications} className="text-xs font-bold text-gray-500 hover:text-red-500 flex items-center gap-1 transition-colors">
                        <Trash2 size={12} /> Clear all
                      </button>
                    )}
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-sm font-medium text-gray-500">You're all caught up!</div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className="p-3 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <p className="text-sm font-medium text-gray-800 mb-1">{n.message}</p>
                          <span className="text-xs font-bold text-gray-400">{n.time}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <Link to="/cart" className="relative hidden sm:flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-full font-semibold transition-all transform hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gray-300 active:translate-y-0 active:shadow-md">
            <ShoppingBag size={18} />
            <span className="hidden sm:inline">Cart</span>
            <span className="absolute -top-2 -right-2 bg-red-500 border-2 border-white text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-md">{cartCount}</span>
          </Link>

          {isLoggedIn ? (
            <Link
              to="/profile"
              className="flex items-center gap-2 bg-mango-50 text-mango-600 px-4 py-2.5 rounded-full font-semibold transition-all hover:bg-mango-100 shadow-sm border border-mango-100"
            >
              <div className="bg-mango-200 p-1 rounded-full">
                <User size={16} className="text-mango-700" />
              </div>
              <span className="hidden sm:inline text-sm">Profile</span>
            </Link>
          ) : (
            <button
              onClick={onLoginClick}
              className="flex items-center gap-2 bg-mango-500 hover:bg-mango-600 text-white px-6 py-2.5 rounded-full font-bold transition-all shadow-md hover:shadow-lg hover:shadow-mango-500/30 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Login
            </button>
          )}

          <button className="md:hidden p-2 text-gray-600 bg-gray-50 rounded-full">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </div>
    </nav>
  );
}
