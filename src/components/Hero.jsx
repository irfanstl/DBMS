import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mango-100/80 text-mango-600 font-bold text-sm mb-6 shadow-sm border border-mango-200/50">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mango-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-mango-500"></span>
              </span>
              Fastest Delivery in Town
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-6">
              Get Your Favorite <br/> Food
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-mango-500 to-mango-600">
                {" "}Delivered Fast
              </span>
            </h1>
            
            <p className="text-lg lg:text-xl text-gray-600 mb-10 max-w-2xl mx-auto lg:mx-0 font-medium">
              Discover the best local restaurants and get delicious meals delivered right to your doorstep in minutes. Craving something? We've got it.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button onClick={() => {
                const el = document.getElementById('restaurants');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }} className="flex items-center justify-center gap-2 bg-gradient-to-r from-mango-500 to-mango-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl shadow-mango-500/30 hover:shadow-2xl hover:shadow-mango-500/40 hover:-translate-y-1 active:translate-y-0 transition-all duration-300">
                Order Now <ArrowRight size={20} strokeWidth={2.5} />
              </button>
              <Link to="/restaurants" className="flex items-center justify-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-bold text-lg border-2 border-gray-100 hover:border-mango-200 hover:bg-mango-50 transition-all duration-300">
                Explore Menu
              </Link>
            </div>
            
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <div className="flex -space-x-4">
                {[1,2,3].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-12 h-12 rounded-full border-4 border-[#fffcf2] shadow-sm z-10" alt="Customer" style={{ zIndex: 10 - i }} />
                ))}
              </div>
              <div className="text-center sm:text-left">
                <div className="flex items-center gap-1 text-mango-500 justify-center sm:justify-start">
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                </div>
                <p className="text-sm font-bold text-gray-700 mt-1">4.9/5 <span className="font-medium text-gray-500">from 2k+ reviews</span></p>
              </div>
            </div>
          </div>

          {/* Right Content - Graphic */}
          <div className="relative mt-12 lg:mt-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-mango-300/30 rounded-full blur-[80px] -z-10"></div>
            <img 
              src="/hero_food.png" 
              alt="Delicious Food" 
              className="w-full max-w-lg mx-auto drop-shadow-[0_30px_50px_rgba(255,175,0,0.4)] animate-float"
            />
            
            {/* Floating Badge */}
            <div className="absolute top-10 right-0 lg:-right-4 glass px-6 py-4 rounded-2xl animate-float shadow-xl border border-white/50" style={{animationDelay: '1.5s'}}>
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2.5 rounded-full text-green-600 shadow-sm">
                  <Star size={20} fill="currentColor" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Top Rated</p>
                  <p className="font-extrabold text-gray-900 leading-tight">Fresh Taste</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
