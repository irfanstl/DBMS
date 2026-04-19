import { useSearchParams } from 'react-router-dom';
import Restaurants from '../components/Restaurants';
import Featured from '../components/Featured';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  return (
    <div className="pt-24 min-h-screen bg-[#fffcf2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Search Results for <span className="text-mango-500">"{query}"</span>
        </h1>
      </div>
      
      <div className="space-y-12">
        <Restaurants searchQuery={query} hideSeeAll={true} />
        <Featured searchQuery={query} hideSeeAll={true} />
      </div>
    </div>
  );
}
