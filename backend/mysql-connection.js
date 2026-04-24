import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Create the connection pool for MySQL
// Make sure to create a .env file in the backend folder with your credentials
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'irfan@786', // Replace with your MySQL password
  database: process.env.DB_NAME || 'mangobite',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ==========================================
// EXAMPLES: Calling MySQL Stored Procedures (PL/SQL equivalent)
// ==========================================

export const getUserOrdersViaProcedure = async (userId) => {
  try {
    // Calling the stored procedure from database/schema.sql
    const [rows] = await pool.execute('CALL get_user_orders(?)', [userId]);
    
    // Stored procedures return an array of result sets. 
    // The actual data is usually in the first element.
    return rows[0]; 
  } catch (error) {
    console.error("Error calling get_user_orders procedure:", error);
    throw error;
  }
};

export const addRestaurant = async ({ name, type, delivery_time, delivery_fee, img, address, category_id, is_active }) => {
  try {
    const [result] = await pool.execute(
      'INSERT INTO restaurants (name, type, delivery_time, delivery_fee, img, address, category_id, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, type, delivery_time, delivery_fee, img, address || '', category_id || null, is_active ?? 0]
    );
    return result;
  } catch (error) {
    console.error("Error adding restaurant:", error);
    throw error;
  }
};

export const getAddresses = async (userId) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM addresses WHERE user_id = ?', [userId]);
    return rows;
  } catch (error) {
    console.error("Error fetching addresses:", error);
    throw error;
  }
};

export const addAddress = async (userId, street, city, zip, type = 'Home', isDefault = 0) => {
  try {
    const [result] = await pool.execute(
      'INSERT INTO addresses (user_id, street, city, zip, type, is_Default) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, street, city, zip, type, isDefault]
    );
    return result;
  } catch (error) {
    console.error("Error adding address:", error);
    throw error;
  }
};

export const getRestaurants = async (searchQuery = '') => {
  try {
    let query = 'SELECT * FROM restaurants WHERE is_active = 1';
    let params = [];
    if (searchQuery) {
      query += ' AND (name LIKE ? OR type LIKE ?)';
      const term = `%${searchQuery}%`;
      params.push(term, term);
    }
    const [rows] = await pool.execute(query, params);
    return rows;
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return [];
  }
};

export const getCategories = async () => {
  try {
    const [rows] = await pool.execute('SELECT * FROM categories');
    return rows;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const getFeaturedItems = async (searchQuery = '') => {
  try {
    let query = 'SELECT * FROM menu_items';
    let params = [];
    if (searchQuery) {
      query += ' WHERE name LIKE ?';
      params.push(`%${searchQuery}%`);
    }
    query += ' LIMIT 10';
    const [rows] = await pool.execute(query, params);
    return rows;
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return [];
  }
};

export const getPendingRestaurants = async () => {
  try {
    const [rows] = await pool.execute('SELECT * FROM restaurants WHERE is_active = 0');
    return rows;
  } catch (error) {
    console.error("Error fetching pending restaurants:", error);
    return [];
  }
};

export const getAllRestaurantsAdmin = async () => {
  try {
    const [rows] = await pool.execute('SELECT * FROM restaurants ORDER BY is_active ASC');
    return rows;
  } catch (error) {
    console.error("Error fetching all restaurants:", error);
    return [];
  }
};

export const approveRestaurant = async (restaurantId) => {
  try {
    const [result] = await pool.execute('UPDATE restaurants SET is_active = 1 WHERE restaurant_id = ?', [restaurantId]);
    return result;
  } catch (error) {
    console.error("Error approving restaurant:", error);
    throw error;
  }
};

export const getCart = async (userId) => {
  try {
    const [rows] = await pool.execute(
      `SELECT c.cart_id, c.item_id as id, c.quantity, m.name, m.price, m.img 
       FROM cart c 
       JOIN menu_items m ON c.item_id = m.item_id 
       WHERE c.user_id = ?`,
      [userId]
    );
    return rows;
  } catch (error) {
    console.error("Error fetching cart:", error);
    return [];
  }
};

export const addToCart = async (userId, itemId, quantity = 1) => {
  try {
    // Check if item exists in cart
    const [existing] = await pool.execute('SELECT * FROM cart WHERE user_id = ? AND item_id = ?', [userId, itemId]);
    if (existing.length > 0) {
      await pool.execute('UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND item_id = ?', [quantity, userId, itemId]);
    } else {
      await pool.execute('INSERT INTO cart (user_id, item_id, quantity) VALUES (?, ?, ?)', [userId, itemId, quantity]);
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};

export const removeFromCart = async (userId, itemId) => {
  try {
    const [existing] = await pool.execute('SELECT quantity FROM cart WHERE user_id = ? AND item_id = ?', [userId, itemId]);
    if (existing.length > 0) {
      if (existing[0].quantity > 1) {
        await pool.execute('UPDATE cart SET quantity = quantity - 1 WHERE user_id = ? AND item_id = ?', [userId, itemId]);
      } else {
        await pool.execute('DELETE FROM cart WHERE user_id = ? AND item_id = ?', [userId, itemId]);
      }
    }
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw error;
  }
};

export const clearCart = async (userId) => {
  await pool.execute('DELETE FROM cart WHERE user_id = ?', [userId]);
};

export const getOrders = async (userId) => {
  try {
    const [rows] = await pool.execute(
      `SELECT o.order_id as id, DATE_FORMAT(o.ordered_at, '%M %d, %Y') as date, CONCAT('₹', o.total_amount) as total, o.status,
       (SELECT GROUP_CONCAT(CONCAT(m.name, ' x ', oi.quantity) SEPARATOR ', ')
        FROM orders_items oi JOIN menu_items m ON oi.item_id = m.item_id
        WHERE oi.order_id = o.order_id) as items
       FROM orders o WHERE o.user_id = ? ORDER BY o.ordered_at DESC`,
      [userId]
    );
    return rows;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

export const placeOrderViaProcedure = async (userId, addressId, deliveryFee) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    // 1. Calculate total from cart
    const [cartItems] = await connection.execute(
      'SELECT c.item_id, c.quantity, m.price FROM cart c JOIN menu_items m ON c.item_id = m.item_id WHERE c.user_id = ?',
      [userId]
    );
    
    if (cartItems.length === 0) throw new Error("Cart is empty");
    
    const subtotal = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);
    const totalAmount = subtotal + deliveryFee;
    
    // 2. Insert into orders
    const [orderResult] = await connection.execute(
      'INSERT INTO orders (user_id, address_id, total_amount, delivery_fee) VALUES (?, ?, ?, ?)',
      [userId, addressId, totalAmount, deliveryFee]
    );
    const orderId = orderResult.insertId;
    
    // 3. Insert into orders_items
    for (const item of cartItems) {
      await connection.execute(
        'INSERT INTO orders_items (order_id, item_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
        [orderId, item.item_id, item.quantity, item.price]
      );
    }
    
    // 4. Clear cart
    await connection.execute('DELETE FROM cart WHERE user_id = ?', [userId]);
    
    await connection.commit();
    return orderId;
  } catch (error) {
    await connection.rollback();
    console.error("Transaction failed:", error);
    throw error;
  } finally {
    connection.release();
  }
};

export const addMenuItem = async (restaurantId, categoryId, name, price, description, img, time, cal) => {
  const [result] = await pool.execute(
    'INSERT INTO menu_items (restaurant_id, category_id, name, price, description, img, time, cal) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [restaurantId, categoryId || 1, name, price, description, img, time, cal]
  );
  return result;
};

export const updateMenuItem = async (itemId, name, price, description, img, time, cal) => {
  const [result] = await pool.execute(
    'UPDATE menu_items SET name = ?, price = ?, description = ?, img = ?, time = ?, cal = ? WHERE item_id = ?',
    [name, price, description, img, time, cal, itemId]
  );
  return result;
};

export const deleteMenuItem = async (itemId) => {
  const [result] = await pool.execute('DELETE FROM menu_items WHERE item_id = ?', [itemId]);
  return result;
};

export const getRestaurantMenu = async (restaurantId) => {
  const [rows] = await pool.execute('SELECT * FROM menu_items WHERE restaurant_id = ?', [restaurantId]);
  return rows;
};

export { pool };
export default pool;

export const syncUser = async (email, name, profilePic, role) => {
  try {
    const [rows] = await pool.execute('SELECT user_id, role FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
      return { user_id: rows[0].user_id, role: rows[0].role, isNew: false };
    } else {
      const [result] = await pool.execute(
        'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        [name, email, 'FIREBASE_AUTH', role || 'user']
      );
      return { user_id: result.insertId, role: role || 'user', isNew: true };
    }
  } catch (error) {
    console.error('Error syncing user:', error);
    throw error;
  }
};
