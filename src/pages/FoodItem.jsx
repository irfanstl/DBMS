import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Clock, Flame, MessageSquare, Plus, Minus, ShoppingBag } from 'lucide-react';

export default function FoodItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [food, setFood] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchFoodData = async () => {
      try {
        const [foodRes, commentsRes] = await Promise.all([
          fetch(`/api/food/${id}`),
          fetch(`/api/food/${id}/comments`)
        ]);
        
        if (foodRes.ok) {
          setFood(await foodRes.json());
          setComments(await commentsRes.json());
        } else {
          // fallback if not found
          navigate('/');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFoodData();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fffcf2] pt-32 pb-20 animate-pulse">
        <div className="max-w-4xl mx-auto px-4">
          <div className="w-full h-80 bg-gray-200 rounded-3xl mb-8"></div>
          <div className="h-10 w-1/2 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-6 w-full bg-gray-200 rounded-full mb-2"></div>
        </div>
      </div>
    );
  }

  if (!food) return null;

  return (
    <div className="bg-[#fffcf2] min-h-screen pb-20 pt-28 sm:pt-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-gray-500 hover:text-mango-600 transition-colors font-bold mb-6">
          <ArrowLeft size={20} /> Back
        </button>

        <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-xl shadow-gray-200/50 mb-8 border border-gray-100">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="w-full h-64 sm:h-80 rounded-[2rem] overflow-hidden bg-mango-50">
              <img src={food.img} alt={food.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            
            <div>
              <span className="bg-mango-100 text-mango-700 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider mb-4 inline-block">
                {food.category || 'Specialty'}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-4">{food.name}</h1>
              
              <div className="flex items-center gap-4 mb-6">
                <span className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg font-bold text-sm border border-green-100">
                  <Star size={16} className="fill-green-700" /> {food.rating} ({food.reviewsCount} reviews)
                </span>
                <span className="flex items-center gap-1.5 text-gray-500 font-medium text-sm">
                  <Clock size={16} /> {food.time}
                </span>
                <span className="flex items-center gap-1.5 text-gray-500 font-medium text-sm">
                  <Flame size={16} className="text-mango-500" /> {food.cal}
                </span>
              </div>

              <p className="text-gray-600 font-medium leading-relaxed mb-8">
                {food.description || "A delicious and freshly prepared meal guaranteed to satisfy your cravings. Prepared with the finest ingredients."}
              </p>

              <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                <div className="text-3xl font-extrabold text-gray-900">{food.price}</div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-gray-100 rounded-xl p-1">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600 hover:text-mango-600 transition-colors">
                      <Minus size={16} strokeWidth={3} />
                    </button>
                    <span className="w-10 text-center font-bold text-gray-900">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600 hover:text-mango-600 transition-colors">
                      <Plus size={16} strokeWidth={3} />
                    </button>
                  </div>
                  <button className="bg-mango-500 hover:bg-mango-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-mango-200 transition-all active:scale-95 whitespace-nowrap text-sm">
                    <ShoppingBag size={16} /> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
            <MessageSquare size={24} className="text-mango-500" /> Reviews & Comments
          </h2>
          
          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-mango-100 text-mango-700 font-extrabold flex items-center justify-center shrink-0">
                        {comment.avatar}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{comment.name}</div>
                        <div className="text-xs text-gray-400 font-medium">{comment.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg">
                      {[...Array(comment.rating)].map((_, i) => (
                        <Star key={i} size={12} className="text-mango-500 fill-mango-500" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 font-medium text-sm leading-relaxed">{comment.comment}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 border-dashed">
                <p className="text-gray-400 font-medium">No comments yet. Be the first to review this item!</p>
              </div>
            )}
          </div>
        </div>

        {/* More from this restaurant (Related Items) */}
        <div className="mt-16">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-extrabold text-gray-900">More from this restaurant</h2>
            <Link to={`/restaurant/${food.restaurantId}`} className="text-mango-600 font-bold hover:underline text-sm">See all menu</Link>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="relative w-full h-40 rounded-2xl overflow-hidden mb-4 bg-gray-100">
                  <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80" alt="Related food" className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-gray-900 flex items-center gap-1 shadow-sm">
                    <Flame size={12} className="text-mango-500" /> Popular
                  </div>
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-1">Delicious Salad</h3>
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-3">
                  <span className="flex items-center gap-1"><Clock size={12} /> 10-15 min</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span>150 kcal</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-extrabold text-gray-900">₹8.50</span>
                  <button className="bg-mango-50 text-mango-600 p-2 rounded-full hover:bg-mango-500 hover:text-white transition-colors">
                    <Plus size={16} strokeWidth={3} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
