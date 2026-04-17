import Hero from '../components/Hero';
import Categories from '../components/Categories';
import TopBrands from '../components/TopBrands';
import Restaurants from '../components/Restaurants';
import Featured from '../components/Featured';

export default function Home({ searchQuery = '' }) {
  return (
    <main>
      <Hero />
      <Categories searchQuery={searchQuery} />
      <TopBrands searchQuery={searchQuery} />
      <Restaurants searchQuery={searchQuery} />
      <Featured searchQuery={searchQuery} />
    </main>
  );
}
