import { ShoppingBag, Search, Menu, User, MapPin, ChevronDown } from 'lucide-react';

export default function Navbar({ isLoggedIn, onLogout, onLoginClick, onSearchChange }) {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass shadow-[0_4px_30px_rgba(0,0,0,0.02)] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-4 lg:gap-8">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="bg-gradient-to-br from-mango-400 to-mango-600 shadow-lg shadow-mango-200 text-white p-2 rounded-xl">
                <ShoppingBag size={24} strokeWidth={2.5} />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-gray-900 hidden sm:block">
                Mango<span className="text-mango-500">Bite</span>
              </span>
            </div>

            <button className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 px-3 md:px-4 py-2 rounded-full border border-gray-100 transition-colors cursor-pointer group">
              <MapPin size={20} className="text-mango-500 flex-shrink-0 group-hover:-translate-y-0.5 transition-transform" />
              <div className="text-left hidden md:flex flex-col">
                <span className="text-[10px] text-gray-500 font-bold uppercase leading-none">Deliver to</span>
                <span className="text-sm font-bold text-gray-900 leading-none mt-1">Add Location</span>
              </div>
              <span className="text-sm font-bold text-gray-900 leading-none md:hidden">Location</span>
              <ChevronDown size={14} className="text-gray-500 ml-1" />
            </button>
          </div>
          
          <div className="hidden lg:flex items-center space-x-10">
            <a href="#" className="font-semibold text-mango-600 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-mango-500 after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:duration-300">Home</a>
            <a href="#" className="font-semibold text-gray-500 hover:text-gray-900 transition-colors">Menu</a>
            <a href="#" className="font-semibold text-gray-500 hover:text-gray-900 transition-colors">Contact</a>
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            <div className="hidden sm:flex items-center bg-gray-50 px-4 py-2.5 rounded-full border border-gray-100 focus-within:border-mango-500 focus-within:ring-2 focus-within:ring-mango-500/20 transition-all w-48 lg:w-64 shadow-inner">
              <Search size={18} className="text-gray-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Search food or places..." 
                className="bg-transparent border-none outline-none ml-2 text-sm w-full font-medium text-gray-900 placeholder-gray-400 placeholder:select-none"
                onChange={(e) => onSearchChange?.(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-full font-semibold transition-all transform hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gray-300 active:translate-y-0 active:shadow-md">
              <ShoppingBag size={18} />
              <span className="hidden sm:inline">Cart (0)</span>
            </button>

            {isLoggedIn ? (
              <button 
                onClick={onLogout}
                className="flex items-center gap-2 bg-mango-50 text-mango-600 px-4 py-2.5 rounded-full font-semibold transition-all hover:bg-mango-100 shadow-sm border border-mango-100"
                title="Click to logout"
              >
                <div className="bg-mango-200 p-1 rounded-full">
                  <User size={16} className="text-mango-700" />
                </div>
                <span className="hidden sm:inline text-sm">Profile</span>
              </button>
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
