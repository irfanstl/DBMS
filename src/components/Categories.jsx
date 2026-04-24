import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Categories({ searchQuery = '' }) {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/categories?q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [searchQuery]);

  const handleCategoryClick = (name) => {
    navigate(`/search?q=${encodeURIComponent(name)}`);
  };

  return (
    <section className="py-8 bg-[#fffcf2] dark:bg-gray-950 relative z-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight px-2">What are you craving?</h2>
        
        <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-8 pt-2 px-2 -mx-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory">
          
          {isLoading ? (
            // Skeleton Loader for categories
            Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center gap-3 min-w-[110px] py-6 px-4 rounded-[2rem] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 snap-start shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded-full mt-1 animate-pulse delay-75"></div>
              </div>
            ))
          ) : (
            // Render Actual Categories
            categories.map((category, index) => (
              <button 
                key={category.id || category.category_id || index} 
                onClick={() => handleCategoryClick(category.name)}
                className={`flex flex-col items-center justify-center gap-3 min-w-[110px] py-6 px-4 rounded-[2rem] transition-all duration-300 transform hover:-translate-y-2 snap-start
                  ${index === 0 
                    ? 'bg-mango-500 text-white shadow-xl shadow-mango-500/40' 
                    : 'bg-white dark:bg-gray-800 hover:bg-mango-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 dark:border-gray-700 hover:border-mango-200 hover:shadow-xl hover:shadow-mango-100/50'
                  }`}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center overflow-hidden shadow-inner border-2 transition-all duration-300
                  ${index === 0 ? 'border-white/40' : 'border-transparent' }
                `}>
                  <img src={category.img} alt={category.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <span className={`font-bold text-[15px] ${index === 0 ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  {category.name}
                </span>
              </button>
            ))
          )}

        </div>
      </div>
    </section>
  );
}
