import { useState, useEffect } from 'react';

export default function TopBrands({ searchQuery = '' }) {
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/brands?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        setBrands(data);
      } catch (error) {
        console.error("Failed to fetch top brands:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBrands();
  }, [searchQuery]);

  return (
    <section className="py-12 bg-white rounded-t-[3rem] shadow-[0_-20px_40px_rgba(0,0,0,0.02)] relative z-30 -mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-8 tracking-tight px-2">Top Brands for You</h2>
        <div className="flex gap-8 overflow-x-auto pb-6 px-4 -mx-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-x">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="flex flex-col items-center gap-3 shrink-0 animate-pulse snap-start">
                <div className="w-20 h-20 rounded-full bg-gray-200"></div>
                <div className="h-3 w-16 bg-gray-200 rounded-full mt-1"></div>
              </div>
            ))
          ) : (
            brands.map((brand) => (
              <div key={brand.id} className="flex flex-col items-center gap-3 cursor-pointer group shrink-0 snap-start">
                <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center bg-white border-gray-100 p-2 shadow-sm transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-105 group-hover:shadow-lg`}>
                  <img src={brand.img} alt={brand.name} className="w-full h-full object-contain" />
                </div>
                <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors">{brand.name}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
