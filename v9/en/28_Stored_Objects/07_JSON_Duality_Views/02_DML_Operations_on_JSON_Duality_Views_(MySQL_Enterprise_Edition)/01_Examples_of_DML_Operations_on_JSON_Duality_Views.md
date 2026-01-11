#### 27.7.2.1 Examples of DML Operations on JSON Duality Views

To demonstrate the different DML operations you can execute on JSON duality views, create the `customers` and `orders` relational tables.

```
CREATE TABLE customers (
  customer_id INT PRIMARY KEY,
  name VARCHAR(100)
);

CREATE TABLE orders (
  order_id INT PRIMARY KEY,
  customer_id INT,
  product VARCHAR(100),
  amount DECIMAL(10,2),
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);
```

Next, create the JSON duality view `customer_orders_dv`, which presents order information as a JSON document. The duality view is built on the underlying relational tables `customers` and `orders`. The `customer_orders_dv` JSON duality view contains the nested descendent `orders`. The view uses a table annotation to allow `INSERT`, `UPDATE`, and `DELETE` operations on the root object and sub-object `orders`.

```
CREATE OR REPLACE JSON RELATIONAL DUALITY VIEW customer_orders_dv AS
SELECT JSON_DUALITY_OBJECT( WITH(INSERT,UPDATE,DELETE)
    '_id': customer_id,
    'customer_name': name,
    'orders': (
        SELECT JSON_ARRAYAGG(
            JSON_DUALITY_OBJECT( WITH(INSERT,UPDATE,DELETE)
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
```

Now create another JSON duality view named `order_dv`, which is designed to present individual order information as a JSON document. This view is also built on the underlying relational tables `customers` and `orders`. The `order_dv` JSON duality view contains the singleton descendent `customer`. The view uses a table annotation to allow `INSERT`, `UPDATE`, and `DELETE` operations on the root object. Since the sub-object is a singleton descendent, only `INSERT` and `UPDATE` operations are permitted on it.

```
CREATE OR REPLACE JSON RELATIONAL DUALITY VIEW order_dv AS
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

The following examples use the relational tables and JSON duality views previously created.

##### Insert Operation on a JSON Document

You can create JSON documents by performing an `INSERT` operation on the JSON duality view. During an `INSERT` operation, you can either create a complete document, including all sub-objects, or create only the root object while referencing existing sub-objects. If a sub-object has existing records, the `INSERT` operation is transformed into an `UPDATE` operation.

The following example creates an entire JSON document, including the root object and all sub-objects with a single `INSERT` operation.

```
mysql> INSERT INTO customer_orders_dv VALUES ( '{  "customer_name": "Alice",
    "_id": 1,
    "orders": [
      {"order_id": 1, "product": "Laptop", "amount": 1299.99},
      {"order_id": 2, "product": "Mouse", "amount": 19.99}
    ]
}');
Query OK, 3 rows affected (0.018 sec)
Rows affected: 3  Warnings: 0.
mysql> SELECT * FROM customer_orders_dv;
+--------------------------------------------------+
| data                                             |
+--------------------------------------------------+
|{                                                 |
| "_id": 1,                                        |
|  "orders": [                                     |
|    {                                             |
|      "amount": 1299.99,                          |
|      "product": "Laptop",                        |
|      "order_id": 1                               |
|    },                                            |
|    {                                             |
|      "amount": 19.99,                            |
|      "product": "Mouse",                         |
|      "order_id": 2                               |
|    }                                             |
|  ],                                              |
|  "_metadata": {                                  |
|    "etag": "e6d40eabf2e070ffd2719c6755d50f1a"    |
|  },                                              |
|  "customer_name": "Alice"                        |
|}                                                 |
+--------------------------------------------------+
mysql> SELECT * FROM customers;
+-------------+-------+
| customer_id | name  |
+-------------+-------+
|           1 | Alice |
+-------------+-------+
1 row in set (0.006 sec)
mysql> SELECT * FROM orders;
+----------+-------------+---------+---------+
| order_id | customer_id | product | amount  |
+----------+-------------+---------+---------+
|        1 |           1 | Laptop  | 1299.99 |
|        2 |           1 | Mouse   |   19.99 |
+----------+-------------+---------+---------+
2 rows in set (0.005 sec)
mysql> SELECT * FROM orders_dv;
+--------------------------------------------------+
| data                                             |
+--------------------------------------------------+
|{                                                 |
|  "_id": 1,                                       |
|  "amount": 1299.99,                              |
|  "product": "Laptop",                            |
|  "customer": {                                   |
|    "customer_id": 1,                             |
|    "customer_name": "Alice"                      |
|  },                                              |
|  "_metadata": {                                  |
|    "etag": "52f3a7039e0bc75dd31fc7239227d6bb"    |
|  }                                               |
|}                                                 |
|                                                  |
|{                                                 |
|  "_id": 2,                                       |
|  "amount": 19.99,                                |
|  "product": "Mouse",                             |
|  "customer": {                                   |
|    "customer_id": 1,                             |
|    "customer_name": "Alice"                      |
|  },                                              |
|  "_metadata": {                                  |
|    "etag": "305bd687b1c71ef35561e1b2a2481083"    |
|  }                                               |
|}                                                 |
+--------------------------------------------------+
```

The example shows the following:

* A single JSON document can insert both `customers` and `orders` data appropriately in one atomic transaction.

* The JSON document `INSERT` operation inserts rows in the relational tables `customers` and `orders` through the JSON duality view.

* The duality view `customer_orders_dv` also impacts the duality view `orders_dv` since all information is made consistent through the relational tables. The new orders added are also visible here.

Note the following:

* For `INSERT` operations, you must specify values for all keys in the JSON document with the following exception: If a projected column for a key has a default value, it can be omitted. In such cases, the default value is stored in the respective relational table.

* The `orders.customer_id` column is not projected in the `customers_orders_dv` JSON duality view, but its value is still populated during the `INSERT` operation. The system deduces values for unprojected columns, or even missing keys in the document, based on the sub-object's `JOIN` condition.

* Inserting multiple JSON documents with a single `INSERT` statement is not supported. You must insert each JSON document individually.

The following example uses the `INSERT` operation to create a partial JSON document. The example starts with empty tables for `customers` and `orders`.

```
mysql> INSERT INTO customer_orders_dv VALUES ( '{
       "customer_name": "Alice",
        "_id": 1 }');
Query OK, 1 row affected (0.023 sec)
Rows affected: 1  Warnings: 0.
mysql> SELECT * FROM customer_orders_dv;
+--------------------------------------------------+
| data                                             |
+--------------------------------------------------+
|{                                                 |
|  "_id": 1,                                       |
|  "orders": null,                                 |
|  "_metadata": {                                  |
|    "etag": "847e705fbe181f5b9360da3a911204df"    |
|  },                                              |
|  "customer_name": "Alice"                        |
|}                                                 |
+--------------------------------------------------+
mysql> SELECT * FROM customers;
+-------------+-------+
| customer_id | name  |
+-------------+-------+
|           1 | Alice |
+-------------+-------+
1 row in set (0.004 sec)
mysql> SELECT * FROM orders;
Empty set (0.002 sec)
```

The example continues to create a partial JSON document by referencing existing sub-objects and modifying those existing sub-objects.

```
mysql> INSERT INTO order_dv VALUES('{
       "_id" : 1,
       "product" : "Laptop",
       "amount" : 1299.99,
       "customer" : {
                     "customer_id" : 1,
                     "customer_name" : "Alice_junior"
                   }
       }');
Query OK, 3 rows affected (0.018 sec)
Rows affected: 3  Warnings: 0.
mysql> SELECT * FROM order_dv;
+--------------------------------------------------+
| data                                             |
+--------------------------------------------------+
|{                                                 |
|  "_id": 1,                                       |
|  "amount": 1299.99,                              |
|  "product": "Laptop",                            |
|  "customer": {                                   |
|    "customer_id": 1,                             |
|    "customer_name": "Alice_junior"               |
|  },                                              |
|  "_metadata": {                                  |
|    "etag": "77d9965d5eaa089583d213442b19a5a6"    |
|  }                                               |
|}                                                 |
+--------------------------------------------------+
mysql> SELECT * FROM customers;
+-------------+--------------+
| customer_id | name         |
+-------------+--------------+
|           1 | Alice_junior |
+-------------+--------------+
1 row in set (0.003 sec)
mysql> SELECT * FROM orders;
+----------+-------------+---------+---------+
| order_id | customer_id | product | amount  |
+----------+-------------+---------+---------+
|        1 |           1 | Laptop  | 1299.99 |
+----------+-------------+---------+---------+
1 row in set (0.003 sec)
```

The example shows the following:

* You can skip passing values for sub-objects or refer to existing sub-objects.

* You can modify a sub-object while inserting data into the JSON document.

Note the following:

* You have the option to delete elements from a nested sub-object array.

* You can only modify non-primary key columns.

##### Update Operation on a JSON Document

The following examples show how to update JSON documents with the document's `_id`. You can perform a variety of update actions on JSON documents, including:

* Updating the root object
* Updating a sub-object
* Updating an element within a nested sub-object
* Inserting a new element into a nested sub-object
* Deleting an element from a nested sub-object

If nested sub-objects have missing records, the `UPDATE` operation transforms into an `INSERT` operation.

The following example updates a complete JSON document with a single `UPDATE` command to modify both the root object and any sub-objects within the JSON document.

```
mysql> SELECT * FROM customers;
+-------------+-------+
| customer_id | name  |
+-------------+-------+
|           1 | Alice |
+-------------+-------+
1 row in set (0.002 sec)
mysql> SELECT * FROM orders;
+----------+-------------+---------+---------+
| order_id | customer_id | product | amount  |
+----------+-------------+---------+---------+
|        1 |           1 | Laptop  | 1299.99 |
|        2 |           1 | Mouse   |   19.99 |
+----------+-------------+---------+---------+
2 rows in set (0.006 sec)
mysql> UPDATE customer_orders_dv SET data = '{
       "_id" : 1,
       "customer_name" : "Alice_junior",
       "orders" : [
                    {
                      "order_id" : 1,
                      "product" : "Laptop",
                      "amount"  : 699.99
                    },
                    {
                      "order_id" : 2,
                      "product" : "Mouse",
                      "amount"  : 9.99
                    }
                  ]
       }' WHERE JSON_EXTRACT(data, '$._id') = 1;
Query OK, 3 rows affected, 1 warning (0.012 sec)
Rows affected: 3  Warnings: 1.
mysql> SELECT * FROM customer_orders_dv;
+--------------------------------------------------+
| data                                             |
+--------------------------------------------------+
|{                                                 |
|  "_id": 1,                                       |
|  "orders": [                                     |
|    {                                             |
|      "amount": 699.99,                           |
|      "product": "Laptop",                        |
|      "order_id": 1                               |
|    },                                            |
|    {                                             |
|      "amount": 9.99,                             |
|      "product": "Mouse",                         |
|      "order_id": 2                               |
|    }                                             |
|  ],                                              |
|  "_metadata": {                                  |
|    "etag": "a567b190aba288b5efef62343ebae901"    |
|  },                                              |
|  "customer_name": "Alice_junior"                 |
|}                                                 |
+--------------------------------------------------+
mysql> SELECT * FROM customers;
+-------------+---------------+
| customer_id | name          |
+-------------+---------------+
|           1 | Alice_junior  |
+-------------+---------------+
1 row in set (0.002 sec)
mysql> SELECT * FROM orders;
+----------+-------------+---------+--------+
| order_id | customer_id | product | amount |
+----------+-------------+---------+--------+
|        1 |           1 | Laptop  | 699.99 |
|        2 |           1 | Mouse   |   9.99 |
+----------+-------------+---------+--------+
2 rows in set (0.004 sec)
mysql> SELECT * FROM order_dv;
+--------------------------------------------------+
| data                                             |
+--------------------------------------------------+
|{                                                 |
|  "_id": 1,                                       |
|  "amount": 699.99,                               |
|  "product": "Laptop",                            |
|  "customer": {                                   |
|    "customer_id": 1,                             |
|    "customer_name": "Alice_junior"               |
|  },                                              |
|  "_metadata": {                                  |
|    "etag": "989a494c383f0a8bd9395868dd89575d"    |
|  }                                               |
|}                                                 |
|{                                                 |
|  "_id": 2,                                       |
|  "amount": 9.99,                                 |
|  "product": "Mouse",                             |
|  "customer": {                                   |
|    "customer_id": 1,                             |
|    "customer_name": "Alice_junior"               |
|  },                                              |
|  "_metadata": {                                  |
|    "etag": "b21e3dd50ef83c0f9fb81ac4d1283ec0"    |
|  }                                               |
|}                                                 |
+--------------------------------------------------+
```

The example shows the following:

* A single update operation on a JSON document that updates the relational tables `customers` and `orders` in one atomic action.

* The `UPDATE` operation updates rows in the `customers` and `orders` tables through the JSON duality view.

* The duality view `customer_orders_dv` also impacts the duality view `orders_dv` since all information is made consistent through the relational tables. The new orders added are also visible here.

Note the following:

* You must specify key fields projecting primary columns in the JSON document, namely the root object's `_id` and the sub-object's `order_id`.

* Updating multiple JSON documents with a single `UPDATE` statement is not supported. You must insert each JSON document individually.

The following example updates a partial JSON document. This allows for efficient and targeted modifications without needing to replace the entire document.

```
mysql> SELECT * FROM customers;
+-------------+-------+
| customer_id | name  |
+-------------+-------+
|           1 | Alice |
+-------------+-------+
1 row in set (0.002 sec)
mysql> SELECT * FROM orders;
+----------+-------------+---------+---------+
| order_id | customer_id | product | amount  |
+----------+-------------+---------+---------+
|        1 |           1 | Laptop  | 1299.99 |
|        2 |           1 | Mouse   |   19.99 |
+----------+-------------+---------+---------+
2 rows in set (0.002 sec)
mysql> UPDATE customer_orders_dv SET data = '
{
"_id" : 1,
"customer_name" : "Alice",
"orders" : [
             {
               "order_id" : 1,
               "product" : "Laptop",
               "amount"  : 1299.99
             },
             {

               "order_id" : 3,
               "product" : "Keyboard",
               "amount"  : 29.99
             }
           ]
}';
Query OK, 2 rows affected, 1 warning (0.011 sec)
Rows affected: 2  Warnings: 1.
mysql> SELECT * FROM customer_orders_dv;
+--------------------------------------------------+
| data                                             |
+--------------------------------------------------+
|{                                                 |
|  "_id": 1,                                       |
|  "orders": [                                     |
|    {                                             |
|      "amount": 1299.99,                          |
|      "product": "Laptop",                        |
|      "order_id": 1                               |
|    },                                            |
|    {                                             |
|      "amount": 29.99,                            |
|      "product": "Keyboard",                      |
|      "order_id": 3                               |
|    }                                             |
|  ],                                              |
|  "_metadata": {                                  |
|    "etag": "0bbea4e26d455cd1458a3ebf6e05cdd7"    |
|  },                                              |
|  "customer_name": "Alice"                        |
|}                                                 |
+--------------------------------------------------+
mysql> SELECT * FROM customers;
+-------------+-------+
| customer_id | name  |
+-------------+-------+
|           1 | Alice |
+-------------+-------+
1 row in set (0.002 sec)
mysql> SELECT * FROM orders;
+----------+-------------+----------+---------+
| order_id | customer_id | product  | amount  |
+----------+-------------+----------+---------+
|        1 |           1 | Laptop   | 1299.99 |
|        3 |           1 | Keyboard |   29.99 |
+----------+-------------+----------+---------+
2 rows in set (0.003 sec)
```

The example shows how a single update operation on a JSON document can insert, modify, and delete rows from the `orders` table in a single atomic action.

Note that you must specify the keys that project the primary columns in the JSON document, such as the root object's `_id` and sub-object's `order_id`.

##### Delete Operation on a JSON Document

You have the option to delete an entire JSON document, or only a specific part of it. When performing a partial delete, any sub-objects that do not have the `DELETE` modification tag will remain unchanged.

The following example deletes an entire JSON document.

```
mysql> SELECT * FROM customers;
+-------------+-------+
| customer_id | name  |
+-------------+-------+
|           1 | Alice |
+-------------+-------+
1 row in set (0.004 sec)
mysql> SELECT * FROM orders;
+----------+-------------+---------+---------+
| order_id | customer_id | product | amount  |
+----------+-------------+---------+---------+
|        1 |           1 | Laptop  | 1299.99 |
|        2 |           1 | Mouse   |   19.99 |
+----------+-------------+---------+---------+
2 rows in set (0.003 sec)
mysql> DELETE FROM customer_orders_dv WHERE JSON_VALUE(data, "$._id") = 1;
Query OK, 3 rows affected (0.015 sec)
mysql> SELECT * FROM customers;
Empty set (0.002 sec)
mysql> SELECT * FROM orders;
Empty set (0.002 sec)
```

The example shows how a single delete operation on a JSON document deletes all data from the `customers` and `orders` tables in a single atomic action. The rows are deleted from the tables through the JSON duality view.

Note that deleting multiple JSON documents with a single `DELETE` statement is not supported. You must delete each JSON document individually.

The following example performs a partial delete of a JSON document. For a JSON duality view with a singleton descendent, the `DELETE` modification tag is not allowed. If a sub-object does not include a `DELETE` modification tag, the corresponding rows in the sub-objects will not be deleted.

```
mysql> SELECT * FROM customers;
+-------------+-------+
| customer_id | name  |
+-------------+-------+
|           1 | Alice |
+-------------+-------+
1 row in set (0.004 sec)
mysql> SELECT * FROM orders;
+----------+-------------+---------+---------+
| order_id | customer_id | product | amount  |
+----------+-------------+---------+---------+
|        1 |           1 | Laptop  | 1299.99 |
|        2 |           1 | Mouse   |   19.99 |
+----------+-------------+---------+---------+
2 rows in set (0.003 sec)
mysql> DELETE FROM order_dv WHERE JSON_VALUE(data, "$._id") = 1;
Query OK, 1 row affected (0.009 sec)
mysql> SELECT * FROM customers;
+-------------+-------+
| customer_id | name  |
+-------------+-------+
|           1 | Alice |
+-------------+-------+
1 row in set (0.004 sec)
mysql> SELECT * FROM orders;
+----------+-------------+---------+---------+
| order_id | customer_id | product | amount  |
+----------+-------------+---------+---------+
|        1 |           1 | Laptop  | 1299.99 |
+----------+-------------+---------+---------+
1 row in set (0.006 sec)
```

The example shows the following:

* The delete operation on the JSON document does not delete the singleton descendent sub-object.

* The delete operation does not delete the sub-object if the `DELETE` modifier is specified for it.
