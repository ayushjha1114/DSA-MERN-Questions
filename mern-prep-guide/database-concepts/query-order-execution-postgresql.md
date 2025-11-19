# Order of execution of a query in PostgreSQL

A concise, interview-ready summary of the logical order PostgreSQL evaluates a typical `SELECT` query and why it matters.

## Logical order of execution (typical SELECT)
1. `WITH` (CTE) — common table expressions (logically first; pre-PG12 materialized, now inlined unless `MATERIALIZED`).
2. `FROM` — assemble source rows, evaluate table expressions, subqueries in `FROM`, `JOIN`s and their `ON` conditions.
3. `WHERE` — filter rows produced by `FROM`/`JOIN`.
4. `GROUP BY` — group rows into groups.
5. `HAVING` — filter groups (can use aggregates).
6. `SELECT` — compute select-list expressions (receives grouped/aggregated values).
7. `WINDOW` — evaluate window functions (after aggregation, before `ORDER BY`).
8. `DISTINCT` — remove duplicate rows.
9. `ORDER BY` — sort the final result (can reference select aliases).
10. `LIMIT` / `OFFSET` — trim the result set.

Mnemonic: `WITH → FROM → WHERE → GROUP BY → HAVING → SELECT → WINDOW → DISTINCT → ORDER BY → LIMIT/OFFSET`

## Important details

- FROM vs WHERE vs JOIN ... ON  
  - `JOIN ... ON` conditions are evaluated while forming join pairs.  
  - For `INNER JOIN`, `ON` and `WHERE` both filter rows.  
  - For `OUTER JOIN`, `ON` controls matching; `WHERE` is applied after the join and can remove rows produced by the outer join (possibly turning it effectively into an inner join).

Example:
```sql
SELECT *
FROM a
LEFT JOIN b ON a.id = b.a_id AND b.active = true
WHERE b.some_col IS NULL;  -- may filter out rows where b is present → be careful
```

- WHERE vs HAVING  
  - `WHERE` filters rows before grouping.  
  - `HAVING` filters groups and can reference aggregates (e.g., `HAVING SUM(x) > 10`).  
  - Wrong: `WHERE SUM(x) > 10` — invalid.

- SELECT and aggregates  
  - Aggregates are computed at `GROUP BY`; non-aggregated columns in `SELECT` must appear in `GROUP BY` (Postgres enforces standard behavior).

- Window functions  
  - Evaluated after grouping/aggregation and before `ORDER BY`.  
  - They annotate rows (do not reduce row count).

- CTEs (`WITH`)  
  - Logically first. Pre-PG12 they acted as optimization fences (materialized); since PG12 they are inlined when possible unless `MATERIALIZED` is specified.

- Subqueries  
  - Subqueries in `FROM` behave as input relations.  
  - Correlated subqueries in `SELECT` or `WHERE` are evaluated per row (can be expensive).  
  - Use `LATERAL` to reference preceding `FROM` items.

- DISTINCT, ORDER BY, LIMIT  
  - `DISTINCT` removes duplicates after `SELECT` (and after window functions if present).  
  - `ORDER BY` can reference select aliases because it runs after `SELECT`.  
  - `LIMIT`/`OFFSET` applied last.

## Example to illustrate order
```sql
WITH recent AS (
  SELECT * FROM orders WHERE created_at > now() - interval '30 days'
)
SELECT 
  u.id,
  u.name,
  SUM(oi.qty * oi.price) AS revenue,
  ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY SUM(oi.qty * oi.price) DESC) AS rn
FROM users u
JOIN recent o ON o.user_id = u.id          -- FROM + JOIN
JOIN order_items oi ON oi.order_id = o.id
WHERE u.active = true                      -- WHERE
GROUP BY u.id, u.name                      -- GROUP BY (aggregates computed)
HAVING SUM(oi.qty * oi.price) > 100       -- HAVING (filter groups)
-- WINDOW functions evaluated here (ROW_NUMBER)
ORDER BY revenue DESC                      -- ORDER BY
LIMIT 10;                                  -- LIMIT
```

## Physical vs logical execution
The planner may reorder and push down operations for performance (predicate pushdown, index use, parallelism), but logical semantics must be preserved. Use `EXPLAIN (ANALYZE, VERBOSE)` to inspect the physical plan.

## Practical tips (interview-friendly)
- If a filter uses aggregates → use `HAVING`. To filter rows before aggregation for performance → use `WHERE`.  
- Watch outer joins + `WHERE` filters — they can change semantics.  
- Prefer CTEs for clarity; avoid `MATERIALIZED` unless you need materialization or want to prevent inlining.
- Use `EXPLAIN` to understand actual execution.

