### 27.7.1 Creating JSON Duality Views

The `CREATE JSON RELATIONAL DUALITY VIEW` statement is an extension of the `CREATE VIEW` statement. There are some additional clauses with `CREATE JSON RELATIONAL DUALITY VIEW`, and some restrictions on the `SELECT` statement. The `RELATIONAL` keyword is optional, and is omitted in examples.

In this example, we create two tables, `customers` and `orders`, and insert some data into each table:

```
mysql> CREATE TABLE customers (
  customer_id INT PRIMARY KEY,
  name VARCHAR(100)
);
mysql> CREATE TABLE orders (
  order_id INT PRIMARY KEY,
  customer_id INT,
  product VARCHAR(100),
  amount DECIMAL(10,2),
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);
mysql> INSERT INTO customers VALUES (1, "Alice"), (2, "Bob");
Query OK, 2 rows affected (0.009 sec)
Records: 2  Duplicates: 0  Warnings: 0
mysql> INSERT INTO orders VALUES (1, 1, "Milk", 10), (2, 1, "Curd", 5), (3, 2, "Flour", 20), (4, 2, "Biscuits", 5);
Query OK, 4 rows affected (0.007 sec)
Records: 4  Duplicates: 0  Warnings: 0
```

The JSON duality views `customer_orders_dv` and `order_dv` give us a hierarchical view of the data in the table. We can create them using the following SQL statements:

```
mysql> CREATE JSON RELATIONAL DUALITY VIEW customer_orders_dv AS
SELECT JSON_DUALITY_OBJECT(
    '_id': customer_id,
    'customer_name': name,
    'orders': (
        SELECT JSON_ARRAYAGG(
            JSON_DUALITY_OBJECT(
                'order_id': order_id,
                'product': product,
                'amount': amount
            )
        )
        FROM orders
        WHERE orders.customer_id = customers.customer_id
    )
)
FROM customers;
mysql> CREATE JSON RELATIONAL DUALITY VIEW order_dv AS
SELECT JSON_DUALITY_OBJECT( WITH(INSERT,UPDATE,DELETE)
    '_id' : order_id,
    'product' : product,
    'amount' : amount,
    'customer': (
        SELECT JSON_DUALITY_OBJECT( WITH(INSERT,UPDATE)
                'customer_id': customer_id,
                'customer_name': name
              )
        FROM customers
        WHERE customers.customer_id = orders.customer_id
    )
)
FROM orders;
```

JSON duality views support `SELECT` statements in the same way as regular views, allowing you to retrieve the relevant data. The result set is structured with a single column named `data`, and a unique row identifier named `_id`. You can also use `WHERE` clauses to filter results. See the following example:

```
mysql> SELECT JSON_PRETTY(data) FROM customer_orders_dv WHERE data->'$._id' = 1 \G
*************************** 1. row ***************************
JSON_PRETTY(data): {
  "_id": 1,
  "orders": [
    {
      "amount": 10.00,
      "product": "Milk",
      "order_id": 1
    },
    {
      "amount": 5.00,
      "product": "Curd",
      "order_id": 2
    }
  ],
  "_metadata": {
    "etag": "a6f0e76602398bc2df6fdd09494ae07b"
  },
  "customer_name": "Alice"
}
1 row in set (0.006 sec)
mysql> SELECT JSON_PRETTY(data) FROM order_dv WHERE data->'$._id' = 2 \G
*************************** 1. row ***************************
JSON_PRETTY(data): {
  "_id": 2,
  "amount": 5.00,
  "product": "Curd",
  "customer": {
    "customer_id": 1,
    "customer_name": "Alice"
  },
  "_metadata": {
    "etag": "c73b5526988116524f005b3ae73bbea8"
  }
}
1 row in set (0.004 sec)
```
