import Restaurants from '../components/Restaurants';

export default function AllRestaurants() {
  return (
    <div className="pt-24 min-h-screen bg-[#fffcf2]">
      <Restaurants hideSeeAll={true} />
    </div>
  );
}
