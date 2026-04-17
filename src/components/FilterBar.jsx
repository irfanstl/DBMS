import { SlidersHorizontal, ChevronDown, CheckCircle2 } from 'lucide-react';

export default function FilterBar() {
  return (
    <div className="mb-8">
      <div className="flex gap-3 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-1">
        <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-full text-sm font-bold shadow-md shadow-gray-900/20 shrink-0 hover:bg-gray-800 transition-all active:scale-95">
          <SlidersHorizontal size={16} /> Filters
        </button>
        <button className="flex items-center gap-1.5 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-bold shrink-0 hover:border-mango-500 hover:text-mango-600 hover:bg-mango-50/50 transition-all shadow-sm active:scale-95">
          Sort By <ChevronDown size={14} className="text-gray-400" />
        </button>
        <button className="flex items-center gap-1.5 px-5 py-2.5 bg-mango-50 border border-mango-200 text-mango-700 rounded-full text-sm font-bold shrink-0 hover:bg-mango-100 transition-all shadow-sm active:scale-95">
          <CheckCircle2 size={16} /> Local Offers
        </button>
        <button className="flex items-center gap-1.5 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-bold shrink-0 hover:border-mango-500 hover:text-mango-600 hover:bg-mango-50/50 transition-all shadow-sm active:scale-95">
          Rating 4.0+
        </button>
        <button className="flex items-center gap-1.5 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-bold shrink-0 hover:border-mango-500 hover:text-mango-600 hover:bg-mango-50/50 transition-all shadow-sm active:scale-95">
          Under 30 Min
        </button>
        <button className="flex items-center gap-1.5 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-bold shrink-0 hover:border-mango-500 hover:text-mango-600 hover:bg-mango-50/50 transition-all shadow-sm active:scale-95">
          Price <ChevronDown size={14} className="text-gray-400" />
        </button>
      </div>
    </div>
  );
}
