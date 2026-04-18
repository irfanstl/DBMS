import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Clock } from 'lucide-react';
import FilterBar from './FilterBar';

export default function Restaurants({ searchQuery = '', hideSeeAll = false }) {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/restaurants?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        setRestaurants(data);
      } catch (error) {
        console.error("Failed to fetch restaurants:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurants();
  }, [searchQuery]);

  return (
    <section id="restaurants" className="py-20 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Top Restaurants Near You</h2>
            <p className="text-gray-500 font-medium">Discover places that deliver to your location</p>
          </div>
          {!hideSeeAll && (
            <Link to="/restaurants" className="text-mango-600 font-bold hover:text-mango-700 transition-colors flex items-center gap-1 group">
              See all restaurants 
              <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
            </Link>
          )}
        </div>

        <FilterBar />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Skeleton Loader
            Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-2xl mb-4"></div>
                <div className="h-6 bg-gray-200 rounded-full w-3/4 mb-3"></div>
                <div className="flex gap-2 mb-4">
                  <div className="h-4 bg-gray-200 rounded-full w-20"></div>
                  <div className="h-4 bg-gray-200 rounded-full w-20"></div>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-between">
                   <div className="h-4 bg-gray-200 rounded-full w-16"></div>
                   <div className="h-4 bg-gray-200 rounded-full w-16"></div>
                </div>
              </div>
            ))
          ) : (
            // Actual Restaurant Cards
            restaurants.map((rest) => (
              <Link to={`/restaurant/${rest.id}`} key={rest.id} className="group bg-white rounded-3xl p-4 border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-mango-100/40 transition-all duration-300 transform hover:-translate-y-1 block">
                <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-5">
                  <img src={rest.img} alt={rest.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out" />
                  
                  {/* Floating delivery time badge */}
                  <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-extrabold text-gray-900 flex items-center gap-1.5 shadow-lg">
                    <Clock size={14} className="text-mango-500" /> {rest.deliveryTime}
                  </div>
                </div>
                
                <div className="px-2">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-2xl text-gray-900 truncate pr-2">{rest.name}</h3>
                    <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-lg text-sm font-bold shrink-0">
                      <Star size={14} fill="currentColor" /> {rest.rating}
                    </div>
                  </div>
                  
                  <div className="text-sm font-medium text-gray-500 mb-4">
                    {rest.type} • {rest.reviews} ratings
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 text-sm font-bold text-gray-700">
                      <MapPin size={16} className="text-gray-400" /> Free Delivery
                    </div>
                    <span className="text-sm font-extrabold text-mango-600 bg-mango-50 px-3 py-1.5 rounded-full">
                      Fee: {rest.deliveryFee}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
