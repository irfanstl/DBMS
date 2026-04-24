import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Save, X, UtensilsCrossed } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RestaurantAdmin() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    img: '',
    time: '',
    cal: ''
  });

  // Fetch all restaurants on mount (for demo purposes, simulating a partner picking their restau)
  useEffect(() => {
    fetch('/api/restaurants')
      .then(res => res.json())
      .then(data => setRestaurants(data))
      .catch(err => console.error(err));
  }, []);

  // Fetch menu when a restaurant is selected
  useEffect(() => {
    if (selectedRestaurantId) {
      fetchMenu();
    } else {
      setMenuItems([]);
    }
  }, [selectedRestaurantId]);

  const fetchMenu = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/restaurants/${selectedRestaurantId}/menu`);
      const data = await res.json();
      setMenuItems(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load menu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({ name: '', price: '', description: '', img: '', time: '', cal: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      price: item.price.replace('₹', ''), // Remove currency symbol for editing
      description: item.description || '',
      img: item.img || '',
      time: item.time || '',
      cal: item.cal || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRestaurantId) return toast.error("Please select a restaurant first");

    const endpoint = editingItem ? `/api/menu/${editingItem.id}` : '/api/menu';
    const method = editingItem ? 'PUT' : 'POST';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, restaurantId: selectedRestaurantId })
      });

      if (res.ok) {
        toast.success(editingItem ? "Menu item updated!" : "Menu item added!");
        setIsModalOpen(false);
        fetchMenu();
      } else {
        throw new Error("Failed to save");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    
    try {
      const res = await fetch(`/api/menu/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Item deleted!");
        fetchMenu();
      } else {
        throw new Error("Failed to delete");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffcf2] pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
              <UtensilsCrossed className="text-mango-500" /> Partner Menu Dashboard
            </h1>
            <p className="text-gray-500 font-medium mt-2">Manage your restaurant's food items and offerings</p>
          </div>
          
          <div className="w-full sm:w-auto">
            <label className="block text-sm font-bold text-gray-700 mb-1">Select Your Restaurant</label>
            <select 
              value={selectedRestaurantId} 
              onChange={(e) => setSelectedRestaurantId(e.target.value)}
              className="w-full sm:w-64 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-mango-500 font-medium"
            >
              <option value="">-- Choose Restaurant --</option>
              {restaurants.map(r => (
                <option key={r.id} value={r.id}>{r.name} ({r.type})</option>
              ))}
            </select>
          </div>
        </div>

        {selectedRestaurantId ? (
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-extrabold text-gray-900">Current Menu Items</h2>
              <button 
                onClick={openAddModal}
                className="bg-mango-500 hover:bg-mango-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-sm"
              >
                <Plus size={18} /> Add New Item
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-sm text-gray-400 font-bold uppercase tracking-wider bg-white">
                    <th className="p-4 pl-6">Item</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Details</th>
                    <th className="p-4 text-right pr-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {isLoading ? (
                    <tr><td colSpan="4" className="p-8 text-center text-gray-400 font-medium">Loading menu...</td></tr>
                  ) : menuItems.length === 0 ? (
                    <tr><td colSpan="4" className="p-8 text-center text-gray-400 font-medium">Your menu is currently empty. Add your first item!</td></tr>
                  ) : (
                    menuItems.map(item => (
                      <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                              {item.img ? (
                                <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                  <UtensilsCrossed size={16} />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900">{item.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-extrabold text-gray-900">{item.price}</td>
                        <td className="p-4">
                          <div className="text-xs text-gray-500 font-medium space-y-1">
                            <div><span className="font-bold text-gray-700">Time:</span> {item.time || 'N/A'}</div>
                            <div><span className="font-bold text-gray-700">Cal:</span> {item.cal || 'N/A'}</div>
                          </div>
                        </td>
                        <td className="p-4 text-right pr-6">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => openEditModal(item)}
                              className="p-2 text-gray-400 hover:text-mango-600 hover:bg-mango-50 rounded-lg transition-colors"
                              title="Edit Item"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => handleDelete(item.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] border border-gray-100 border-dashed p-12 text-center shadow-sm">
            <UtensilsCrossed size={48} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-extrabold text-gray-900 mb-2">Select a Restaurant</h2>
            <p className="text-gray-500 font-medium">Please choose your restaurant from the dropdown above to manage its menu items.</p>
          </div>
        )}

      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden animate-fadeIn">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-extrabold text-gray-900">{editingItem ? 'Edit Menu Item' : 'Add New Item'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 p-1 rounded-full hover:bg-gray-200 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Item Name *</label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-mango-500" placeholder="e.g. Spicy Chicken Burger" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Price (₹) *</label>
                  <input required type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-mango-500" placeholder="e.g. 12.99" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Image URL</label>
                  <input type="url" name="img" value={formData.img} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-mango-500" placeholder="https://..." />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Prep Time</label>
                  <input type="text" name="time" value={formData.time} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-mango-500" placeholder="e.g. 15-20 min" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Calories</label>
                  <input type="text" name="cal" value={formData.cal} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-mango-500" placeholder="e.g. 450 kcal" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-mango-500 resize-none" placeholder="Describe the dish..."></textarea>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="bg-mango-500 hover:bg-mango-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-sm">
                  <Save size={18} /> {editingItem ? 'Save Changes' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
