-- ============================================================
--  MangoBite Food Delivery – PL/SQL Component
--  Database : mangobite  (MySQL 8.0)
--  Author   : RUTUJA KARPE
--  Purpose  : Stored Procedures, Functions, Triggers, Cursor
-- ============================================================

-- ============================================================
-- SECTION 1 – STORED PROCEDURES
-- ============================================================

-- ------------------------------------------------------------
-- 1.1  place_order
--      Creates a new order record for a user.
--      Input  : user_id, address_id, delivery_fee
--      Output : new_order_id (via SELECT)
-- ------------------------------------------------------------
DROP PROCEDURE IF EXISTS place_order;
DELIMITER $$
CREATE PROCEDURE place_order(
    IN  p_user_id     INT,
    IN  p_address_id  INT,
    IN  p_delivery_fee DECIMAL(6,2)
)
BEGIN
    -- Validate that the address belongs to this user
    IF NOT EXISTS (
        SELECT 1 FROM addresses
        WHERE address_id = p_address_id
          AND user_id    = p_user_id
    ) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Address does not belong to this user.';
    END IF;

    INSERT INTO orders (user_id, address_id, total_amount, delivery_fee, status)
    VALUES (p_user_id, p_address_id, 0.00, p_delivery_fee, 'placed');

    SELECT LAST_INSERT_ID() AS new_order_id;
END$$
DELIMITER ;

-- Usage example:
-- CALL place_order(3, 7, 3.99);


-- ------------------------------------------------------------
-- 1.2  get_user_orders
--      Returns the full order history of a specific user.
--      Input  : user_id
-- ------------------------------------------------------------
DROP PROCEDURE IF EXISTS get_user_orders;
DELIMITER $$
CREATE PROCEDURE get_user_orders(IN p_user_id INT)
BEGIN
    SELECT
        o.order_id,
        o.status,
        o.total_amount,
        o.delivery_fee,
        (o.total_amount + o.delivery_fee) AS grand_total,
        o.ordered_at,
        m.name        AS item_name,
        oi.quantity,
        oi.unit_price,
        (oi.quantity * oi.unit_price) AS line_total
    FROM orders o
    JOIN orders_items oi ON o.order_id  = oi.order_id
    JOIN menu_items   m  ON oi.item_id  = m.item_id
    WHERE o.user_id = p_user_id
    ORDER BY o.ordered_at DESC;
END$$
DELIMITER ;

-- Usage example:
-- CALL get_user_orders(3);


-- ------------------------------------------------------------
-- 1.3  cancel_order
--      Cancels an order only if it is still in 'placed' status.
--      Input  : order_id, user_id (safety check)
-- ------------------------------------------------------------
DROP PROCEDURE IF EXISTS cancel_order;
DELIMITER $$
CREATE PROCEDURE cancel_order(
    IN p_order_id INT,
    IN p_user_id  INT
)
BEGIN
    DECLARE v_status VARCHAR(30);

    SELECT status INTO v_status
    FROM orders
    WHERE order_id = p_order_id AND user_id = p_user_id;

    IF v_status IS NULL THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Order not found or does not belong to this user.';
    ELSEIF v_status != 'placed' THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Only orders in placed status can be cancelled.';
    ELSE
        UPDATE orders
        SET status = 'cancelled'
        WHERE order_id = p_order_id;

        SELECT 'Order cancelled successfully.' AS message;
    END IF;
END$$
DELIMITER ;

-- Usage example:
-- CALL cancel_order(12, 3);


-- ------------------------------------------------------------
-- 1.4  update_order_status
--      Admin procedure to advance an order through its lifecycle.
--      Input  : order_id, new_status
-- ------------------------------------------------------------
DROP PROCEDURE IF EXISTS update_order_status;
DELIMITER $$
CREATE PROCEDURE update_order_status(
    IN p_order_id  INT,
    IN p_new_status ENUM('placed','confirmed','preparing','out_for_delivery','delivered','cancelled')
)
BEGIN
    IF NOT EXISTS (SELECT 1 FROM orders WHERE order_id = p_order_id) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Order not found.';
    END IF;

    UPDATE orders
    SET status = p_new_status
    WHERE order_id = p_order_id;

    SELECT CONCAT('Order ', p_order_id, ' updated to: ', p_new_status) AS message;
END$$
DELIMITER ;

-- Usage example:
-- CALL update_order_status(12, 'confirmed');


-- ------------------------------------------------------------
-- 1.5  summarize_orders  (Cursor-based procedure)
--      Iterates every order using a cursor and prints
--      OrderID + GrandTotal (food amount + delivery fee).
-- ------------------------------------------------------------
DROP PROCEDURE IF EXISTS summarize_orders;
DELIMITER $$
CREATE PROCEDURE summarize_orders()
BEGIN
    DECLARE done       INT DEFAULT 0;
    DECLARE v_order_id INT;
    DECLARE v_total    DECIMAL(10,2);
    DECLARE v_delivery DECIMAL(6,2);
    DECLARE v_grand    DECIMAL(10,2);

    DECLARE order_cursor CURSOR FOR
        SELECT order_id, total_amount, delivery_fee
        FROM   orders
        WHERE  status != 'cancelled';

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_order_summary (
        order_id   INT,
        grand_total DECIMAL(10,2)
    );

    OPEN order_cursor;

    read_loop: LOOP
        FETCH order_cursor INTO v_order_id, v_total, v_delivery;
        IF done = 1 THEN
            LEAVE read_loop;
        END IF;

        SET v_grand = v_total + v_delivery;

        INSERT INTO temp_order_summary VALUES (v_order_id, v_grand);
    END LOOP;

    CLOSE order_cursor;

    -- Return the summarized data
    SELECT * FROM temp_order_summary ORDER BY order_id;
    DROP TEMPORARY TABLE IF EXISTS temp_order_summary;
END$$
DELIMITER ;

-- Usage example:
-- CALL summarize_orders();


-- ------------------------------------------------------------
-- 1.6  get_restaurant_revenue
--      Returns total revenue generated per restaurant.
-- ------------------------------------------------------------
DROP PROCEDURE IF EXISTS get_restaurant_revenue;
DELIMITER $$
CREATE PROCEDURE get_restaurant_revenue()
BEGIN
    SELECT
        r.restaurant_id,
        r.type                        AS restaurant_name,
        COUNT(DISTINCT o.order_id)    AS total_orders,
        SUM(oi.quantity * oi.unit_price) AS total_revenue
    FROM restaurants r
    JOIN menu_items   m  ON m.restaurant_id = r.restaurant_id
    JOIN orders_items oi ON oi.item_id      = m.item_id
    JOIN orders       o  ON o.order_id      = oi.order_id
    WHERE o.status NOT IN ('cancelled')
    GROUP BY r.restaurant_id, r.type
    ORDER BY total_revenue DESC;
END$$
DELIMITER ;

-- Usage example:
-- CALL get_restaurant_revenue();


-- ============================================================
-- SECTION 2 – STORED FUNCTIONS
-- ============================================================

-- ------------------------------------------------------------
-- 2.1  get_total_items
--      Returns the total number of items (sum of qty) in an order.
--      Input  : order_id
--      Returns: INT
-- ------------------------------------------------------------
DROP FUNCTION IF EXISTS get_total_items;
DELIMITER $$
CREATE FUNCTION get_total_items(p_order_id INT)
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE v_count INT;

    SELECT COALESCE(SUM(quantity), 0)
    INTO   v_count
    FROM   orders_items
    WHERE  order_id = p_order_id;

    RETURN v_count;
END$$
DELIMITER ;

-- Usage example:
-- SELECT get_total_items(5);


-- ------------------------------------------------------------
-- 2.2  get_order_grand_total
--      Returns food total + delivery fee for a given order.
--      Input  : order_id
--      Returns: DECIMAL(10,2)
-- ------------------------------------------------------------
DROP FUNCTION IF EXISTS get_order_grand_total;
DELIMITER $$
CREATE FUNCTION get_order_grand_total(p_order_id INT)
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    DECLARE v_total    DECIMAL(10,2);
    DECLARE v_delivery DECIMAL(6,2);

    SELECT total_amount, delivery_fee
    INTO   v_total, v_delivery
    FROM   orders
    WHERE  order_id = p_order_id;

    RETURN v_total + v_delivery;
END$$
DELIMITER ;

-- Usage example:
-- SELECT get_order_grand_total(5);


-- ------------------------------------------------------------
-- 2.3  is_restaurant_active
--      Returns 1 if the restaurant is active, 0 otherwise.
--      Input  : restaurant_id
--      Returns: TINYINT
-- ------------------------------------------------------------
DROP FUNCTION IF EXISTS is_restaurant_active;
DELIMITER $$
CREATE FUNCTION is_restaurant_active(p_restaurant_id INT)
RETURNS TINYINT
DETERMINISTIC
BEGIN
    DECLARE v_active TINYINT;

    SELECT is_active
    INTO   v_active
    FROM   restaurants
    WHERE  restaurant_id = p_restaurant_id;

    RETURN COALESCE(v_active, 0);
END$$
DELIMITER ;

-- Usage example:
-- SELECT is_restaurant_active(2);


-- ------------------------------------------------------------
-- 2.4  get_user_total_spend
--      Returns the cumulative amount a user has spent.
--      Input  : user_id
--      Returns: DECIMAL(10,2)
-- ------------------------------------------------------------
DROP FUNCTION IF EXISTS get_user_total_spend;
DELIMITER $$
CREATE FUNCTION get_user_total_spend(p_user_id INT)
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    DECLARE v_spend DECIMAL(10,2);

    SELECT COALESCE(SUM(total_amount + delivery_fee), 0)
    INTO   v_spend
    FROM   orders
    WHERE  user_id = p_user_id
      AND  status  = 'delivered';

    RETURN v_spend;
END$$
DELIMITER ;

-- Usage example:
-- SELECT get_user_total_spend(3);


-- ============================================================
-- SECTION 3 – TRIGGERS
-- ============================================================

-- ------------------------------------------------------------
-- 3.1  check_item_availability  (BEFORE INSERT on orders_items)
--      Prevents ordering an unavailable menu item.
-- ------------------------------------------------------------
DROP TRIGGER IF EXISTS check_item_availability;
DELIMITER $$
CREATE TRIGGER check_item_availability
BEFORE INSERT ON orders_items
FOR EACH ROW
BEGIN
    DECLARE v_available TINYINT;

    SELECT is_available INTO v_available
    FROM   menu_items
    WHERE  item_id = NEW.item_id;

    IF v_available = 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'This item is currently unavailable.';
    END IF;
END$$
DELIMITER ;


-- ------------------------------------------------------------
-- 3.2  update_order_total  (AFTER INSERT on orders_items)
--      Recalculates orders.total_amount whenever a new item
--      line is inserted.
-- ------------------------------------------------------------
DROP TRIGGER IF EXISTS update_order_total;
DELIMITER $$
CREATE TRIGGER update_order_total
AFTER INSERT ON orders_items
FOR EACH ROW
BEGIN
    UPDATE orders
    SET    total_amount = (
               SELECT SUM(quantity * unit_price)
               FROM   orders_items
               WHERE  order_id = NEW.order_id
           )
    WHERE  order_id = NEW.order_id;
END$$
DELIMITER ;


-- ------------------------------------------------------------
-- 3.3  prevent_delivered_cancellation  (BEFORE UPDATE on orders)
--      Blocks any attempt to cancel an already-delivered order.
-- ------------------------------------------------------------
DROP TRIGGER IF EXISTS prevent_delivered_cancellation;
DELIMITER $$
CREATE TRIGGER prevent_delivered_cancellation
BEFORE UPDATE ON orders
FOR EACH ROW
BEGIN
    IF OLD.status = 'delivered' AND NEW.status = 'cancelled' THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'A delivered order cannot be cancelled.';
    END IF;
END$$
DELIMITER ;


-- ------------------------------------------------------------
-- 3.4  log_order_status_change  (AFTER UPDATE on orders)
--      Writes status transitions to an audit log table.
--      Requires: order_status_log table (created below).
-- ------------------------------------------------------------

-- Audit log table
CREATE TABLE IF NOT EXISTS order_status_log (
    log_id      INT AUTO_INCREMENT PRIMARY KEY,
    order_id    INT          NOT NULL,
    old_status  VARCHAR(30),
    new_status  VARCHAR(30),
    changed_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

DROP TRIGGER IF EXISTS log_order_status_change;
DELIMITER $$
CREATE TRIGGER log_order_status_change
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
    IF OLD.status != NEW.status THEN
        INSERT INTO order_status_log (order_id, old_status, new_status)
        VALUES (NEW.order_id, OLD.status, NEW.status);
    END IF;
END$$
DELIMITER ;


-- ------------------------------------------------------------
-- 3.5  set_default_address  (AFTER INSERT on addresses)
--      If this is the user's first address, auto-mark it default.
-- ------------------------------------------------------------
DROP TRIGGER IF EXISTS set_default_address;
DELIMITER $$
CREATE TRIGGER set_default_address
AFTER INSERT ON addresses
FOR EACH ROW
BEGIN
    DECLARE v_count INT;

    SELECT COUNT(*) INTO v_count
    FROM   addresses
    WHERE  user_id = NEW.user_id;

    IF v_count = 1 THEN
        UPDATE addresses
        SET    is_Default = 1
        WHERE  address_id = NEW.address_id;
    END IF;
END$$
DELIMITER ;


-- ============================================================
-- SECTION 4 – CURSOR DEMO (standalone block for testing)
-- ============================================================
-- The following is a standalone procedure that uses a cursor
-- to find and print users who have never placed an order.
-- Useful as a demo of cursor mechanics in a report/viva.
-- ============================================================

DROP PROCEDURE IF EXISTS find_inactive_users;
DELIMITER $$
CREATE PROCEDURE find_inactive_users()
BEGIN
    DECLARE done       INT DEFAULT 0;
    DECLARE v_user_id  INT;
    DECLARE v_name     VARCHAR(100);
    DECLARE v_email    VARCHAR(100);
    DECLARE v_order_count INT;

    DECLARE user_cursor CURSOR FOR
        SELECT user_id, name, email FROM users WHERE role = 'user';

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_inactive_users (
        user_id INT,
        name    VARCHAR(100),
        email   VARCHAR(100)
    );

    OPEN user_cursor;

    scan_loop: LOOP
        FETCH user_cursor INTO v_user_id, v_name, v_email;
        IF done = 1 THEN LEAVE scan_loop; END IF;

        SELECT COUNT(*) INTO v_order_count
        FROM   orders
        WHERE  user_id = v_user_id;

        IF v_order_count = 0 THEN
            INSERT INTO temp_inactive_users VALUES (v_user_id, v_name, v_email);
        END IF;
    END LOOP;

    CLOSE user_cursor;

    SELECT * FROM temp_inactive_users;
    DROP TEMPORARY TABLE IF EXISTS temp_inactive_users;
END$$
DELIMITER ;

-- Usage example:
-- CALL find_inactive_users();


-- ============================================================
-- SECTION 5 – USEFUL ANALYTICAL QUERIES (for reports/viva)
-- ============================================================

-- 5.1  Top 5 most ordered menu items
SELECT
    m.name,
    SUM(oi.quantity) AS total_ordered,
    SUM(oi.quantity * oi.unit_price) AS revenue
FROM orders_items oi
JOIN menu_items   m ON m.item_id = oi.item_id
GROUP BY m.item_id, m.name
ORDER BY total_ordered DESC
LIMIT 5;

-- 5.2  Orders grouped by status
SELECT status, COUNT(*) AS count
FROM   orders
GROUP BY status;

-- 5.3  Revenue per day (last 30 days)
SELECT
    DATE(ordered_at) AS order_date,
    COUNT(*)         AS orders_placed,
    SUM(total_amount + delivery_fee) AS daily_revenue
FROM orders
WHERE ordered_at >= NOW() - INTERVAL 30 DAY
GROUP BY DATE(ordered_at)
ORDER BY order_date DESC;

-- 5.4  Average order value per user
SELECT
    u.user_id,
    u.name,
    COUNT(o.order_id) AS total_orders,
    ROUND(AVG(o.total_amount + o.delivery_fee), 2) AS avg_order_value
FROM users u
JOIN orders o ON o.user_id = u.user_id
WHERE o.status = 'delivered'
GROUP BY u.user_id, u.name
ORDER BY avg_order_value DESC;

-- 5.5  Call the custom functions in a single query
SELECT
    o.order_id,
    get_total_items(o.order_id)       AS item_count,
    get_order_grand_total(o.order_id) AS grand_total
FROM orders o
ORDER BY o.ordered_at DESC
LIMIT 10;

-- ============================================================
-- END OF FILE
-- ============================================================
