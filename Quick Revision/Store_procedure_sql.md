# ✅ Stored Procedures in PostgreSQL

In PostgreSQL, stored procedures can be created using the `CREATE PROCEDURE` statement (PostgreSQL 11+). However, functions (`CREATE FUNCTION`) are more commonly used for return values and business logic. Procedures are better suited for transactional operations where you might want to use `CALL`.

### Example: Stored Procedure (No Return Value)

```sql
CREATE PROCEDURE increase_salary(emp_id INT, increment NUMERIC)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE employees
    SET salary = salary + increment
    WHERE id = emp_id;
END;
$$;
```

To call this procedure:

```sql
CALL increase_salary(3, 500);
```

---

## ✅ Function in PostgreSQL (With Return Value)

If you want a return value (like in `SELECT`), use a function instead:

```sql
CREATE FUNCTION get_employee_salary(emp_id INT)
RETURNS NUMERIC
LANGUAGE plpgsql
AS $$
DECLARE
    emp_salary NUMERIC;
BEGIN
    SELECT salary INTO emp_salary FROM employees WHERE id = emp_id;
    RETURN emp_salary;
END;
$$;
```

To run:

```sql
SELECT get_employee_salary(3);
```

---

## 🔁 Triggers in PostgreSQL

A trigger automatically runs a function in response to an event like `INSERT`, `UPDATE`, or `DELETE` on a table.

### Steps to Create a Trigger:

1. **Create a Table to Store Logs**

```sql
CREATE TABLE salary_changes (
    emp_id INT,
    old_salary NUMERIC,
    new_salary NUMERIC,
    change_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

2. **Create the Trigger Function**

```sql
CREATE FUNCTION log_salary_change()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.salary <> OLD.salary THEN
        INSERT INTO salary_changes(emp_id, old_salary, new_salary)
        VALUES (OLD.id, OLD.salary, NEW.salary);
    END IF;
    RETURN NEW;
END;
$$;
```

3. **Attach the Trigger to the Employees Table**

```sql
CREATE TRIGGER trg_log_salary
AFTER UPDATE ON employees
FOR EACH ROW
WHEN (OLD.salary IS DISTINCT FROM NEW.salary)
EXECUTE FUNCTION log_salary_change();
```

Now, any time a salary is updated, the change is logged.

---

## 🔹 FUNCTION vs PROCEDURE vs TRIGGER — What's the Difference?

| Feature         | Function                          | Procedure                        | Trigger                              |
|------------------|-----------------------------------|-----------------------------------|--------------------------------------|
| **What is it?**  | A routine that returns a value    | A routine that doesn’t return a value | A way to automatically run logic on table changes |
| **Call with**    | `SELECT`                         | `CALL`                           | Runs automatically on events         |
| **Returns**      | Yes (must return something)      | No (cannot return directly)      | No direct return, but can affect other tables |
| **Use case**     | Get data, calculations, business logic | Batch actions, complex logic     | Audit logs, auto-calculations, data validation |
| **When to use?** | When you need a result           | When you want to perform tasks   | When you want to react to table changes |

---

## 🛍️ Sample Use Cases in an E-commerce App

### 📌 1. Function — Get Total Cart Value

You need to calculate the total amount of a user's cart.

#### SQL Function

```sql
CREATE FUNCTION get_cart_total(user_id INT)
RETURNS NUMERIC
LANGUAGE plpgsql
AS $$
DECLARE
    total NUMERIC;
BEGIN
    SELECT SUM(quantity * price)
    INTO total
    FROM cart_items
    WHERE user_id = user_id;

    RETURN COALESCE(total, 0);
END;
$$;
```

#### Node.js (Express Route)

```javascript
app.get('/cart/total/:userId', async (req, res) => {
    const { userId } = req.params;
    const result = await pool.query('SELECT get_cart_total($1) AS total', [userId]);
    res.json({ total: result.rows[0].total });
});
```

---

### 📌 2. Procedure — Place Order (Multi-Step Operation)

Placing an order might involve:

- Inserting into `orders`
- Moving items from `cart_items` to `order_items`
- Clearing the cart

#### SQL Stored Procedure

```sql
CREATE PROCEDURE place_order(user_id INT)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO orders(user_id, order_date)
    VALUES (user_id, NOW());

    INSERT INTO order_items(order_id, product_id, quantity, price)
    SELECT currval(pg_get_serial_sequence('orders','id')), product_id, quantity, price
    FROM cart_items
    WHERE user_id = user_id;

    DELETE FROM cart_items WHERE user_id = user_id;
END;
$$;
```

#### Node.js (Express Route)

```javascript
app.post('/order/place', async (req, res) => {
    const { userId } = req.body;
    await pool.query('CALL place_order($1)', [userId]);
    res.json({ message: 'Order placed successfully' });
});
```

---

### 📌 3. Trigger — Log Inventory Changes Automatically

When a product's stock is updated, log it.

#### Create Inventory Log Table

```sql
CREATE TABLE inventory_log (
    product_id INT,
    old_stock INT,
    new_stock INT,
    changed_at TIMESTAMP DEFAULT NOW()
);
```

#### Trigger Function

```sql
CREATE FUNCTION log_inventory_change()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.stock <> OLD.stock THEN
        INSERT INTO inventory_log(product_id, old_stock, new_stock)
        VALUES (OLD.id, OLD.stock, NEW.stock);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

#### Attach Trigger to Products Table

```sql
CREATE TRIGGER trg_inventory_log
AFTER UPDATE ON products
FOR EACH ROW
WHEN (OLD.stock IS DISTINCT FROM NEW.stock)
EXECUTE FUNCTION log_inventory_change();
```

You don’t need to do anything in Node.js — it happens automatically when stock is updated!

---

## ✅ Summary of Benefits

| Feature   | Benefit in Your App                          |
|-----------|----------------------------------------------|
| **Function** | Reuse logic like cart totals or discount calculations |
| **Procedure** | Perform multi-step actions like order placement |
| **Trigger**   | Automatically log or enforce rules (inventory, auditing) |