import { useState, useEffect } from 'react';
import { Flame, Clock, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Featured({ searchQuery = '', hideSeeAll = false }) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/featured?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        setItems(data);
      } catch (error) {
        console.error("Failed to fetch featured items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [searchQuery]);

  return (
    <section className="py-24 bg-white rounded-t-[3rem] shadow-[0_-20px_40px_rgba(0,0,0,0.02)] relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Popular Menu</h2>
            <p className="text-gray-500 font-medium text-lg">Explore some of our best-selling dishes</p>
          </div>
          {!hideSeeAll && (
            <button className="text-mango-600 font-bold hover:text-mango-700 transition-colors flex items-center gap-1 group">
              See all menu 
              <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
            </button>
          )}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="bg-white rounded-[2rem] p-4 border border-gray-100 shadow-sm animate-pulse">
                <div className="w-full aspect-square bg-gray-200 rounded-[1.5rem] mb-5"></div>
                <div className="h-6 bg-gray-200 rounded-full w-3/4 mb-3"></div>
                <div className="flex items-center gap-2 mb-5">
                   <div className="h-4 bg-gray-200 rounded-full w-16"></div>
                   <div className="h-4 bg-gray-200 rounded-full w-12"></div>
                </div>
                <div className="flex justify-between mt-auto pt-2">
                  <div className="h-8 bg-gray-200 rounded-full w-20"></div>
                  <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            ))
          ) : (
            items.map((item) => (
              <div key={item.id} className="group bg-white rounded-[2rem] p-4 border border-gray-100/80 shadow-sm hover:shadow-2xl hover:shadow-mango-100/50 transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative w-full aspect-square rounded-[1.5rem] overflow-hidden mb-5 bg-mango-50">
                  <img src={item.img} alt={item.name} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-out" />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-gray-800 flex items-center gap-1.5 shadow-sm">
                    <Flame size={14} className="text-mango-500" /> Popular
                  </div>
                </div>
                
                <div className="px-2">
                  <h3 className="font-bold text-xl text-gray-900 mb-2 truncate">{item.name}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-5 font-semibold">
                    <span className="flex items-center gap-1.5"><Clock size={16} className="text-gray-400" /> {item.time}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-mango-200"></span>
                    <span>{item.cal}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-2xl font-extrabold text-gray-900">{item.price}</span>
                    <button 
                      onClick={async () => {
                        try {
                          const res = await fetch('/api/cart', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({id: item.id}) });
                          if (res.ok) {
                            window.dispatchEvent(new Event('navDataUpdated'));
                            toast.success('Added to Cart!', {
                              style: { borderRadius: '10px', background: '#333', color: '#fff' }
                            });
                          } else {
                            toast.error('Session expired. Please log out and log back in.');
                          }
                        } catch (e) {
                          toast.error('Failed to add to cart');
                        }
                      }}
                      className="bg-mango-50 text-mango-600 p-3 rounded-full hover:bg-mango-500 hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-md hover:rotate-90"
                    >
                      <Plus size={22} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
