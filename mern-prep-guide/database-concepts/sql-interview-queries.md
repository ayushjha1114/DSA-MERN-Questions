# ---------------------SQL Interview Queries ----------------------------

## Employees Table

```sql
CREATE TABLE Employees (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  department VARCHAR(100),
  salary INT,
  join_date DATE
);
```

**Query:** Find the top 3 highest-paid employees in the 'Engineering' department, ordered by salary descending.

```sql
SELECT id, name, salary
FROM Employees
WHERE department = 'Engineering'
ORDER BY salary DESC
LIMIT 3;
```

---

## Orders and Customers Tables

```sql
CREATE TABLE Orders (
  id INT PRIMARY KEY,
  customer_id INT,
  order_date DATE,
  amount DECIMAL
);

CREATE TABLE Customers (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  region VARCHAR(50)
);
```

**Query:** Find the total order amount for each customer in the 'West' region.  
Return: `customer_name`, `total_amount` — order by total descending.

```sql
SELECT c.name AS customer_name, SUM(o.amount) AS total_amount
FROM Customers c
JOIN Orders o ON c.id = o.customer_id
WHERE c.region = 'West'
GROUP BY c.name
ORDER BY total_amount DESC;
```



## Get the 5th Highest Salary from an Employee Table

To retrieve only the 5th highest **distinct** salary from an `employee` table, you can use the following SQL queries:

### Query 1

```sql
SELECT DISTINCT salary
FROM employee
ORDER BY salary DESC
LIMIT 1 OFFSET 4;
```

**Explanation:**
- `ORDER BY salary DESC`: Sorts salaries from highest to lowest.
- `DISTINCT`: Removes duplicates (important if multiple employees have the same salary).
- `LIMIT 1 OFFSET 4`: Skips the top 4 and returns the 5th one.

**Example:**  
If salaries are: `100k, 90k, 90k, 80k, 70k, 60k`,  
then the 5th distinct highest salary is **70k**.

---

### Query 2

```sql
SELECT MIN(salary) AS fifth_highest_salary
FROM (
    SELECT DISTINCT salary
    FROM employee
    ORDER BY salary DESC
    LIMIT 5
) AS top5;
```

**Explanation:**
- **Inner query:** Fetches the top 5 distinct salaries in descending order.
- **Outer query:** Picks the smallest one out of those — i.e., the 5th highest.



## ✅ General SQL Query to Find Duplicates

```sql
SELECT column1, column2, COUNT(*)
FROM table_name
GROUP BY column1, column2
HAVING COUNT(*) > 1;
```
> Replace `column1, column2` with the columns that should be unique together.

---

### 🔍 Example: Find Duplicate Emails in `users` Table

```sql
SELECT email, COUNT(*) AS count
FROM users
GROUP BY email
HAVING COUNT(*) > 1;
```

---

### 🧾 Example: Find Full Duplicate Rows

If you want to find all columns duplicated (entire row repeated):

```sql
SELECT *, COUNT(*)
FROM users
GROUP BY id, name, email -- or all columns
HAVING COUNT(*) > 1;
```

---

## ✅ 1. Using LIMIT and OFFSET (MySQL, PostgreSQL)

```sql
-- 3rd highest salary (N = 3)
SELECT DISTINCT salary
FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET 2;
```
- `OFFSET N-1`: Skips the top N−1 salaries  
- `LIMIT 1`: Picks the N-th salary




## Employee Salary Data

| EMPID | SAL  | Month | Year |
|-------|------|-------|------|
| 1     | 1000 | 1     | 2024 |
| 1     | 3000 | 2     | 2024 |
| 1     | 2000 | 3     | 2024 |
| 1     | 1000 | 4     | 2024 |
| 2     | 2000 | 1     | 2024 |
| 2     | 500  | 2     | 2024 |
| 2     | 400  | 3     | 2024 |
| 2     | 1000 | 4     | 2024 |
| 3     | 700  | 1     | 2024 |
| 3     | 500  | 2     | 2024 |
| 3     | 400  | 3     | 2024 |
| 3     | 2000 | 4     | 2024 |

---

### Question

**Which employee receives the maximum salary for the first quarter (Q1) of 2024?**

- **Q1 months:** January, February, March (Month 1, 2, 3)

---

### SQL Query

```sql
SELECT EMPID, SUM(SAL) AS total_q1_salary
FROM Employee
WHERE Month IN (1, 2, 3) AND Year = 2024
GROUP BY EMPID
ORDER BY total_q1_salary DESC
LIMIT 1;
```

---

### Step-by-step Calculation

| EMPID | Month 1 | Month 2 | Month 3 | Q1 Total |
|-------|---------|---------|---------|----------|
| 1     | 1000    | 3000    | 2000    | 6000     |
| 2     | 2000    | 500     | 400     | 2900     |
| 3     | 700     | 500     | 400     | 1600     |

**Employee 1 receives the maximum salary in Q1 2024 (₹6000).**




Let's analyze your two tables and show the output of different types of joins (`LEFT JOIN`, `RIGHT JOIN`, and `INNER JOIN`) using the condition `T1.A = T2.A`.

## Tables

**T1**

| A | B | C |
|---|---|---|
| 1 | 2 | 4 |
| 2 | 3 | 5 |

**T2**

| A    | B | C |
|------|---|---|
| 1    | 4 | 3 |
| NULL | 3 | 4 |

---

## 🔗 Join on `T1.A = T2.A`

### 1. INNER JOIN

```sql
SELECT * FROM T1 INNER JOIN T2 ON T1.A = T2.A;
```
✅ Only matching rows from both tables (where `T1.A = T2.A`):

| T1.A | T1.B | T1.C | T2.A | T2.B | T2.C |
|------|------|------|------|------|------|
| 1    | 2    | 4    | 1    | 4    | 3    |

---

### 2. LEFT JOIN

```sql
SELECT * FROM T1 LEFT JOIN T2 ON T1.A = T2.A;
```
✅ All rows from T1, matched rows from T2, `NULL` if no match:

| T1.A | T1.B | T1.C | T2.A | T2.B | T2.C |
|------|------|------|------|------|------|
| 1    | 2    | 4    | 1    | 4    | 3    |
| 2    | 3    | 5    | NULL | NULL | NULL |

---

### 3. RIGHT JOIN

```sql
SELECT * FROM T1 RIGHT JOIN T2 ON T1.A = T2.A;
```
✅ All rows from T2, matched rows from T1, `NULL` if no match:

| T1.A | T1.B | T1.C | T2.A | T2.B | T2.C |
|------|------|------|------|------|------|
| 1    | 2    | 4    | 1    | 4    | 3    |
| NULL | NULL | NULL | NULL | 3    | 4    |

---

## Selecting Rows Where `T2.A IS NULL`

If you want to select the row where `T2.A IS NULL`, use:

```sql
SELECT * FROM T2 WHERE A IS NULL;
```
✅ Output:

| A    | B | C |
|------|---|---|
| NULL | 3 | 4 |


To find artists who released more than 2 albums, where each album has an average song duration of more than 200 seconds, you can use the following SQL queries:

---

### 1. Get Albums with Average Song Duration > 200 Seconds

```sql
SELECT artist_id
FROM albums a
JOIN songs s ON a.album_id = s.album_id
GROUP BY a.album_id, a.artist_id
HAVING AVG(s.duration) > 200;
```

This query gets all albums where the average song duration is greater than 200 seconds, grouped by album.

---

### 2. Get Artists with More Than 2 Such Albums

```sql
SELECT artist_id
FROM (
    SELECT a.album_id, a.artist_id
    FROM albums a
    JOIN songs s ON a.album_id = s.album_id
    GROUP BY a.album_id, a.artist_id
    HAVING AVG(s.duration) > 200
) AS album_stats
GROUP BY artist_id
HAVING COUNT(DISTINCT album_id) > 2;
```

---

### 3. Get Artist Names (Optional)

If you want to return artist names, join with the `artists` table:

```sql
SELECT ar.name
FROM (
    SELECT a.album_id, a.artist_id
    FROM albums a
    JOIN songs s ON a.album_id = s.album_id
    GROUP BY a.album_id, a.artist_id
    HAVING AVG(s.duration) > 200
) AS album_stats
JOIN artists ar ON album_stats.artist_id = ar.artist_id
GROUP BY ar.artist_id, ar.name
HAVING COUNT(DISTINCT album_stats.album_id) > 2;
```

---

### Explanation

- **albums**: Contains album-level info (`album_id`, `artist_id`).
- **songs**: Contains individual songs (`song_id`, `album_id`, `duration` in seconds).
- The subquery filters albums where the average duration of songs is > 200 seconds.
- The outer query groups by `artist_id` and counts how many such albums they have.
- `HAVING COUNT(...) > 2` ensures only artists with more than 2 such albums are returned.

Let me know if your schema is different (e.g., table or column names).



# LeetCode 176: Second Highest Salary - Solution

## Problem Statement

### Example 1:

```
Input: 
Employee table:
+----+--------+
| id | salary |
+----+--------+
| 1  | 100    |
| 2  | 200    |
| 3  | 300    |
+----+--------+

Output: 
+---------------------+
| SecondHighestSalary |
+---------------------+
| 200                 |
+---------------------+
```

### Example 2:

```
Input: 
Employee table:
+----+--------+
| id | salary |
+----+--------+
| 1  | 100    |
+----+--------+

Output: 
+---------------------+
| SecondHighestSalary |
+---------------------+
| null                |
+---------------------+
```

## Solution

```sql
SELECT (SELECT DISTINCT salary FROM Employee ORDER BY salary DESC LIMIT 1 OFFSET 1) AS SecondHighestSalary;
```

## Explanation

### Pattern: `SELECT (<subquery>) AS columnName`

This pattern is used when:
* You want to run a **subquery that returns a single value** (e.g., a number, a string, or a date)
* And you want to **give that result a name (alias)**

### Key Rule

The **subquery inside `()`** must return a single value (i.e., one row and one column).

If it returns:
* **More than one row** → ❌ You'll get an error: *"more than one row returned by a subquery used as an expression"*
* **No rows** → ✅ It will return `NULL`

### How the Solution Works

1. **Inner subquery**: `SELECT DISTINCT salary FROM Employee ORDER BY salary DESC LIMIT 1 OFFSET 1`
   - `DISTINCT salary`: Gets unique salary values
   - `ORDER BY salary DESC`: Sorts salaries in descending order
   - `LIMIT 1 OFFSET 1`: Skips the first (highest) salary and gets the next one

2. **Outer query**: Wraps the subquery and gives it an alias `SecondHighestSalary`

3. **Edge case handling**: If there's no second highest salary (like in Example 2), the subquery returns no rows, which becomes `NULL` in the final result



# LeetCode 181: Employees Earning More Than Their Managers - Solution

## Problem Statement

**181. Employees Earning More Than Their Managers**

### Example 1:

```
Input: 
Employee table:
+----+-------+--------+-----------+
| id | name  | salary | managerId |
+----+-------+--------+-----------+
| 1  | Joe   | 70000  | 3         |
| 2  | Henry | 80000  | 4         |
| 3  | Sam   | 60000  | Null      |
| 4  | Max   | 90000  | Null      |
+----+-------+--------+-----------+

Output: 
+----------+
| Employee |
+----------+
| Joe      |
+----------+

Explanation: Joe is the only employee who earns more than his manager.
```

## Solution

```sql
SELECT e1.name AS Employee
FROM Employee e1
JOIN Employee e2 ON e1.managerId = e2.id
WHERE e1.salary > e2.salary;
```

## Alternative Solution

```sql
SELECT e1.name AS Employee
FROM Employee e1, Employee e2
WHERE e1.managerId = e2.id AND e1.salary > e2.salary;
```



# LeetCode 182: Duplicate Emails - Solution

## Problem Statement

**182. Duplicate Emails**

### Example 1:

```
Input: 
Person table:
+----+---------+
| id | email   |
+----+---------+
| 1  | a@b.com |
| 2  | c@d.com |
| 3  | a@b.com |
+----+---------+

Output: 
+---------+
| Email   |
+---------+
| a@b.com |
+---------+

Explanation: a@b.com is repeated two times.
```

## Solution

```sql
SELECT email AS Email 
FROM Person 
GROUP BY email 
HAVING COUNT(email) > 1;
```

## Alternative Solution

```sql
SELECT DISTINCT p1.email AS Email
FROM Person p1
JOIN Person p2 ON p1.email = p2.email AND p1.id != p2.id;
```


# LeetCode 183: Customers Who Never Order - Solution

## Problem Statement

**183. Customers Who Never Order**

### Example 1:

```
Input: 
Customers table:
+----+-------+
| id | name  |
+----+-------+
| 1  | Joe   |
| 2  | Henry |
| 3  | Sam   |
| 4  | Max   |
+----+-------+

Orders table:
+----+------------+
| id | customerId |
+----+------------+
| 1  | 3          |
| 2  | 1          |
+----+------------+

Output: 
+-----------+
| Customers |
+-----------+
| Henry     |
| Max       |
+-----------+
```

## Solution 1: NOT IN (Subquery)

```sql
SELECT c.name AS "Customers" 
FROM Customers c
WHERE id NOT IN (SELECT customerId FROM Orders);
```

## Solution 2: LEFT JOIN

```sql
SELECT c.name AS "Customers"
FROM Customers c
LEFT JOIN Orders o ON c.id = o.customerId
WHERE o.customerId IS NULL;
```

## Solution 3: NOT EXISTS

```sql
SELECT c.name AS "Customers"
FROM Customers c
WHERE NOT EXISTS (
    SELECT 1 FROM Orders o WHERE o.customerId = c.id
);
```


# LeetCode 196: Delete Duplicate Emails - Solution

## Problem Statement

**196. Delete Duplicate Emails**

### Example 1:

```
Input: 
Person table:
+----+------------------+
| id | email            |
+----+------------------+
| 1  | john@example.com |
| 2  | bob@example.com  |
| 3  | john@example.com |
+----+------------------+

Output: 
+----+------------------+
| id | email            |
+----+------------------+
| 1  | john@example.com |
| 2  | bob@example.com  |
+----+------------------+

Explanation: john@example.com is repeated two times. We keep the row with the smallest Id = 1.
```

## Solution 1: DELETE with NOT IN (PostgreSQL)

```sql
DELETE FROM Person 
WHERE id NOT IN (
    SELECT MIN(id) FROM Person GROUP BY email
);
```

**Note**: This works in PostgreSQL but may cause issues in MySQL due to the restriction on modifying a table while selecting from it in the same statement.

## Solution 2: DELETE with Self Join (MySQL Compatible)

```sql
DELETE p1 FROM Person p1
INNER JOIN Person p2 
WHERE p1.email = p2.email AND p1.id > p2.id;
```



# LeetCode 627: Swap Salary - Solution

## Problem Statement

**627. Swap Salary**

Write a solution to swap all `'f'` and `'m'` values (i.e., change all `'f'` values to `'m'` and vice versa) with a **single update statement** and no intermediate temporary tables.

Note that you must write a single update statement, **do not** write any select statement for this problem.

### Example 1:

```
Input: 
Salary table:
+----+------+-----+--------+
| id | name | sex | salary |
+----+------+-----+--------+
| 1  | A    | m   | 2500   |
| 2  | B    | f   | 1500   |
| 3  | C    | m   | 5500   |
| 4  | D    | f   | 500    |
+----+------+-----+--------+

Output: 
+----+------+-----+--------+
| id | name | sex | salary |
+----+------+-----+--------+
| 1  | A    | f   | 2500   |
| 2  | B    | m   | 1500   |
| 3  | C    | f   | 5500   |
| 4  | D    | m   | 500    |
+----+------+-----+--------+

Explanation: 
(1, A) and (3, C) were changed from 'm' to 'f'.
(2, B) and (4, D) were changed from 'f' to 'm'.
```

## Solution 1: CASE Statement (Recommended)

```sql
UPDATE Salary 
SET sex = CASE 
    WHEN sex = 'm' THEN 'f'
    WHEN sex = 'f' THEN 'm' 
    ELSE sex 
END;
```


# 577. Employee Bonus

## Problem Statement

Write a solution to report the name and bonus amount of each employee with a bonus **less than** `1000`.

Return the result table in **any order**.

## Example

### Input

**Employee table:**
```
+-------+--------+------------+--------+
| empId | name   | supervisor | salary |
+-------+--------+------------+--------+
| 3     | Brad   | null       | 4000   |
| 1     | John   | 3          | 1000   |
| 2     | Dan    | 3          | 2000   |
| 4     | Thomas | 3          | 4000   |
+-------+--------+------------+--------+
```

**Bonus table:**
```
+-------+-------+
| empId | bonus |
+-------+-------+
| 2     | 500   |
| 4     | 2000  |
+-------+-------+
```

### Output
```
+------+-------+
| name | bonus |
+------+-------+
| Brad | null  |
| John | null  |
| Dan  | 500   |
+------+-------+
```

## Solution

```sql
-- Write your PostgreSQL query statement below
SELECT e.name, b.bonus 
FROM Employee e
LEFT JOIN Bonus b ON b.empId = e.empId
WHERE b.bonus < 1000 OR b.bonus IS NULL;
```




# 511. Game Play Analysis I

## Problem Statement

Write a solution to find the **first login date** for each player.

Return the result table in **any order**.

## Example

### Input

**Activity table:**
```
+-----------+-----------+------------+--------------+
| player_id | device_id | event_date | games_played |
+-----------+-----------+------------+--------------+
| 1         | 2         | 2016-03-01 | 5            |
| 1         | 2         | 2016-05-02 | 6            |
| 2         | 3         | 2017-06-25 | 1            |
| 3         | 1         | 2016-03-02 | 0            |
| 3         | 4         | 2018-07-03 | 5            |
+-----------+-----------+------------+--------------+
```

### Output
```
+-----------+-------------+
| player_id | first_login |
+-----------+-------------+
| 1         | 2016-03-01  |
| 2         | 2017-06-25  |
| 3         | 2016-03-02  |
+-----------+-------------+
```

## Solution

```sql
-- Write your PostgreSQL query statement below
SELECT player_id, MIN(event_date) AS first_login 
FROM Activity
GROUP BY player_id 
ORDER BY player_id;
```

### Delete a Record from a Table Without a Unique Identifier

This is a classic SQL problem: deleting a row from a table that has **no primary key**, **no unique column**, and possibly **duplicate rows**.

#### Example Table

```sql
CREATE TABLE employees (
    name VARCHAR(50),
    department VARCHAR(50),
    salary INT
);
```

**Sample Data:**

| name  | department | salary |
|-------|------------|--------|
| John  | Sales      | 5000   |
| John  | Sales      | 5000   | <!-- duplicate -->
| Alice | HR         | 6000   |

Here, there’s no unique column to identify a single row (both "John | Sales | 5000" look identical).

---

### How to Delete a Record Without a Unique Identifier

#### 1. Use `LIMIT` (MySQL, PostgreSQL)

If you want to delete just **one** of the duplicate rows:

```sql
DELETE FROM employees
WHERE name = 'John' AND department = 'Sales' AND salary = 5000
LIMIT 1;
```

This deletes only **one** matching row.  
Useful when duplicates exist and you want to remove just one.