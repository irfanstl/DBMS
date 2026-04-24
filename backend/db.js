// ==========================================
// MOCK MYSQL DATABASE (Relational Data)
// ==========================================
export const mysqlDB = {
  categories: [
    { id: 1, name: 'Burger', img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=300&q=80' },
    { id: 2, name: 'Pizza', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&q=80' },
    { id: 3, name: 'Sushi', img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=300&q=80' },
    { id: 4, name: 'Healthy', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&q=80' },
    { id: 5, name: 'Desserts', img: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=300&q=80' },
    { id: 6, name: 'Drinks', img: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&q=80' },
  ],
  
  // MySQL stores the core relational metrics and foreign keys
  restaurants: [
    { id: 1, rating: 4.9, reviewsCount: "1.2k", deliveryTime: "15-25 min", type: "Healthy • Vegan", deliveryFee: "Free", img: "https://images.unsplash.com/photo-1493770348161-369560ae357d?w=600&q=80" },
    { id: 2, rating: 4.7, reviewsCount: "850", deliveryTime: "30-45 min", type: "Asian • Spicy", deliveryFee: "₹1.99", img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80" },
    { id: 3, rating: 4.6, reviewsCount: "420", deliveryTime: "25-35 min", type: "Italian • Pizza", deliveryFee: "₹2.50", img: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&q=80" },
  ],

  topBrands: [
    { id: 1, name: "Burger King", img: "https://upload.wikimedia.org/wikipedia/commons/8/85/Burger_King_logo_%281999%29.svg", color: "bg-white border-gray-100" },
    { id: 2, name: "Starbucks", img: "https://upload.wikimedia.org/wikipedia/en/d/d3/Starbucks_Corporation_Logo_2011.svg", color: "bg-white border-gray-100" },
    { id: 3, name: "McDonald's", img: "https://upload.wikimedia.org/wikipedia/commons/3/36/McDonald%27s_Golden_Arches.svg", color: "bg-white border-gray-100" },
  ],

  featuredItems: [
    { id: 1, name: "Spicy Mango Chicken", price: "₹14.99", time: "15-20 min", cal: "450 kcal", img: "https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?w=500&q=80", restaurantId: 1, description: "A fiery and sweet blend of grilled chicken glazed with fresh mango sauce.", rating: 4.8, reviewsCount: 120, category: "Main Course" },
    { id: 2, name: "Tropical Fruit Bowl", price: "₹9.50", time: "10-15 min", cal: "250 kcal", img: "https://images.unsplash.com/photo-1490474418585-ba9ce8c0afcd?w=500&q=80", restaurantId: 1, description: "A refreshing mix of seasonal tropical fruits topped with honey and mint.", rating: 4.5, reviewsCount: 85, category: "Desserts" },
    { id: 3, name: "Classic Beef Burger", price: "₹12.99", time: "20-25 min", cal: "850 kcal", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80", restaurantId: 2, description: "Juicy beef patty with fresh lettuce, tomatoes, and our secret sauce in a toasted bun.", rating: 4.9, reviewsCount: 340, category: "Starters" },
  ],

  photos: [
    { id: 1, restaurantId: 1, url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80", caption: "Main Dining Area" },
    { id: 2, restaurantId: 1, url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80", caption: "Cozy Interior" },
  ]
};

// ==========================================
// MOCK MONGODB DATABASE (Document Data)
// ==========================================
export const mongoDB = {
  // MongoDB stores dynamic, document-based content like titles, descriptions, and unstructured data
  restaurantDetails: [
    { 
      restaurantId: 1, 
      title: "The Mango Grove", 
      description: "A premium vegan and healthy food restaurant focusing on organic ingredients and fresh tropical flavors."
    },
    { 
      restaurantId: 2, 
      title: "Spicy Kingdom", 
      description: "Authentic Asian cuisine with a modern twist. Known for our signature spicy noodles and rich broths."
    },
    { 
      restaurantId: 3, 
      title: "Bella Italia", 
      description: "Traditional wood-fired pizzas and homemade pasta prepared with recipes passed down through generations."
    }
  ],

  reviews: [
    { id: "rev_1", restaurantId: 1, name: "Aarav Sharma", avatar: "A", date: "April 14, 2026", rating: 5, comment: "Absolutely incredible food! The mango chicken was juicy and perfectly spiced." },
    { id: "rev_2", restaurantId: 1, name: "Priya Patel", avatar: "P", date: "April 10, 2026", rating: 4, comment: "Great ambiance and even better food. The portions are generous." },
    { id: "rev_3", restaurantId: 2, name: "Rahul Mehta", avatar: "R", date: "April 7, 2026", rating: 5, comment: "Best restaurant in the area, hands down. The staff is friendly and the food is always fresh." },
  ],

  foodComments: [
    { id: "fcom_1", foodId: 1, name: "Sita", avatar: "S", rating: 5, date: "April 15, 2026", comment: "The best chicken I've ever had! The mango glaze is perfect." },
    { id: "fcom_2", foodId: 1, name: "Ravi", avatar: "R", rating: 4, date: "April 12, 2026", comment: "Really good, but a bit too spicy for my taste." },
    { id: "fcom_3", foodId: 3, name: "John", avatar: "J", rating: 5, date: "April 10, 2026", comment: "Classic and delicious." }
  ],

  cart: [
    { id: 1, name: "Spicy Mango Chicken", price: 14.99, quantity: 2, image: "https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?w=200&q=80" },
    { id: 2, name: "Classic Beef Burger", price: 12.99, quantity: 1, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80" }
  ],

  notifications: [
    { id: "notif_1", message: "Your order #ORD-1092 has been delivered!", time: "2 hours ago", isRead: false },
    { id: "notif_2", message: "Special offer: 20% off on all pizzas today.", time: "1 day ago", isRead: false },
    { id: "notif_3", message: "Welcome to MangoBite! Get started by adding a delivery address.", time: "2 days ago", isRead: true }
  ],

  orders: [
    { id: '#ORD-9999', date: 'April 18, 2026', items: 'Spicy Mango Chicken x 2', total: '₹29.98', status: 'Delivered' },
    { id: '#ORD-8888', date: 'April 10, 2026', items: 'Classic Beef Burger x 1', total: '₹12.99', status: 'Delivered' }
  ],

  sessions: [
    { sessionId: "sess_xyz123", userId: 1, expiresAt: "2026-12-31T23:59:59Z", device: "Mobile App" }
  ],

  logs: [
    { logId: "log_1", timestamp: "2026-04-18T10:15:00Z", action: "USER_LOGIN", details: "User 1 logged in successfully." },
    { logId: "log_2", timestamp: "2026-04-18T10:16:29Z", action: "API_REQUEST", details: "GET /api/restaurants - Status 200" }
  ]
};