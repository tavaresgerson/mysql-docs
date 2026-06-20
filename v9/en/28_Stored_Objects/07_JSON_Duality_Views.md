## 27.7 JSON Duality Views

MySQL 9.5 supports JSON duality views. Also known as JSON relational duality views, these objects are stored queries that when invoked produce a set of values in JSON format. In effect, a JSON duality view acts as a virtual JSON document, or as a collection of virtual JSON documents.

With JSON duality views, you can establish a mapping between relational tables and a hierarchical multi-level JSON document, effectively unifying structured (relational) and semi-structured (JSON) data. This allows you to harness the strength of both models (perfect synergy of JSON models with REST APIs, and referential integrity of relational models), and gives your applications the option to read and write using either data model.

The discussion in the next few sections describes the syntax for creating, altering, and dropping JSON duality views, shows some examples of how to use them, and provides information about obtaining related metadata.

DML operations on JSON duality views are supported only on MySQL Enterprise Edition. See Section 27.7.2, “DML Operations on JSON Duality Views (MySQL Enterprise Edition)”"), for more information.


### 27.7.1 Creating JSON Duality Views

The [`CREATE JSON RELATIONAL DUALITY VIEW`](create-json-duality-view.html "15.1.17 CREATE JSON DUALITY VIEW Statement") statement is an extension of the `CREATE VIEW` statement. There are some additional clauses with [`CREATE JSON RELATIONAL DUALITY VIEW`](create-json-duality-view.html "15.1.17 CREATE JSON DUALITY VIEW Statement"), and some restrictions on the `SELECT` statement. The `RELATIONAL` keyword is optional, and is omitted in examples.

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


### 27.7.2 DML Operations on JSON Duality Views (MySQL Enterprise Edition)

In MySQL Enterprise Edition, DML operations are supported on JSON duality views. DML enables seamless `INSERT`, `UPDATE`, and `DELETE` operations directly in developer-friendly JSON documents while ensuring data consistency through the underlying relational schema.

DML operations on JSON duality views involves several orchestrated steps working together:

* Document validation: The JSON duality view automatically validates the input JSON document for correct syntax and ensures it matches the expected schema.

* Type conversion: JSON data types are seamlessly mapped to database data types.

* Sub-statement generation: The JSON duality view decomposes and generates the necessary DML operations targeting the normalized base tables.

* Sub-statement execution: The final step is executing the sequenced DML sub-statements as a single atomic operation.

* Optimistic concurrency control: As an additional preventative measure the JSON duality view prevents conflicting read-write operations in stateless REST calls.

JSON duality views introduces modification tags, which are annotations that specify the intended operation (`INSERT`, `UPDATE`, or `DELETE`) on each JSON object/sub-object. If modification tags are not specified, the object or sub-object is treated as read-only, and DML operations are not permitted. This intent-driven system is vital for:

* Preventing accidental data changes.
* Enforcing business rules at every level (root, singleton, nested).

* Making operations explicit and auditable.

Inserting objects for JSON duality views on self referencing tables and circularly referencing tables is supported.

Generated statements for DML operations on JSON duality view are executed as sub-statements of DML operations on view.

Sub-statement execution does not use any new metadata locks or row locks.

If any sub-statement fails, all sub-statements are rolled back.

For a projected column with `AUTO_INCREMENT`, a value for the column must be specified explicitly. If not, then it must be possible to deduce the column value from the join condition; otherwise, the operation is rejected with an error.

For execution of all generated sub-statements, triggers defined on the base tables of a JSON duality view are executed.

For base tables of JSON duality views linked by referential constraints, sub-statement execution includes execution of any foreign key referential actions which may be defined; failure of a foreign key cascading operation causes the DML operation to be rejected with an error.

DML operations on JSON duality view and their sub-statements are replicated consistently. Should execution of any sub-statement fail, any other sub-statements which are part of this operation are not replicated.

You should be aware that one `INSERT`, `UPDATE`, or `DELETE` statement on a duality view may lead to multiple insert, update, or delete operations on the view's base tables.

A JSON document which is used as input for data modification operations is validated to make sure that its schema matches that of a JSON document generated by the JSON duality view.


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


#### 27.7.2.2 JSON Duality Views—Concurrency

DML operations for JSON duality views in MySQL Enterprise Edition support lockless optimistic concurrency control (LOCC).

The use of LOCC safeguards against conflicts and data inconsistencies for concurrent operations. This is especially important for read and write operations that use separate stateless calls, such as REST requests.

Consider the following example:

* A user accesses data in a mobile application with a `REST GET` request, and then later on decides to update some information with a `REST PUT` request.

* If another user updates the underlying data with another `REST PUT` request between the time of the previous `REST GET` and `REST PUT` requests, the second `REST PUT` request will overwrite the data, making it inconsistent.

This situation occurs because the resources cannot be locked down for a non-deteministic time between the two REST requests. More importantly, REST calls are stateless, and there is no guarantee that the calls will use the same connection with the database where the transaction started.

To address this, LOCC checks at the point of update whether the data has changed since it was last read. If the data was changed, the update is rejected, which allows the application to handle the conflict appropriately.

LOCC uses built-in `ETAG()` computation support, and uses `ETAG()` values stored in the `etag` field of the `_metadata` sub-object in the JSON documents. The `etag` field represents a hash of the document's current state excluding (by default) `_metadata`. It serves as a signature that uniquely identifies the object.

Note

`BLOB` types are stored as binary but represented in base64-encoded format when projected as `SELECT` output. This means that the `etag` value can be different when run with the same input as a `BLOB`, and as hand-crafted base64-formatted string.

Concurrency is handled as follows:

1. The user reads data (using `SELECT`), storing it locally.

2. The user modifies the local copy of the data, leaving the generated `etag` value unchanged.

3. Execution of an `UPDATE` statement reconstructs the object (including metadata) using `SELECT` and persists any changes only if the reconstructed state (that is, the result of `ETAG()` on the reconstructed object) matches the state last read.

4. If the `etag` values do not match, MySQL raises an error, which applications can handle by re-reading the data and retrying the operation if desired.

The `etag` value serves as a control value only, and is not stored; it is generated at `SELECT` or `UPDATE` execution time.


#### 27.7.2.3 Requirements for DML Operations and Table Annotations

Review the following requirements and restrictions for table annotations and DML operations on JSON duality views.

##### Requirements and Restrictions for Insert Annotations

The root object and sub-objects of a document must have the `INSERT` annotation. Any referenced sub-objects must exist.

If a sub-object is updated as part of an insert operation, this sub-object must have the `UPDATE` annotation. *Exception*: If a given sub-object already exists and is referenced in the object being inserted or updated, no annotation check is performed.

Attempting to insert `NULL` or an empty object is rejected with an error.

Insert operations must not result in any constraint violations. This includes `NULL`, primary key, unique Key, check, and foreign key constraints.

Values for primary key columns must be specified. It is possible in some cases to deduce a primary key column value from a `JOIN`. If primary key values are not supplied, and cannot be deduced from a join condition, the insert is rejected with an error.

Values for columns other than primary keys may be omitted. In such cases, either the column's default value, if applicable, or `NULL` is stored in those columns.

When values columns used in the join condition of objects and sub-objects are specified, the values of the columns used in the join condition must be same.

If the value for a column is not specified and it is part of a sub-object's join condition, the value from the other operand is used in its place. In the `INSERT` statement shown in this example, the value of column `t2.f3` is not specified. `t2.f3` is used in the join condition for `ChildNode`, specifying the value as `t1.f1`. In this case, `t2.f3` is copied from `t1.f1`.

```
CREATE TABLE t1 (f1 INT PRIMARY KEY, f2 INT);
CREATE TABLE t2 (f3 INT PRIMARY KEY REFERENCES t1(f1), f4 INT);

INSERT INTO t1 VALUES (1, 2);
INSERT INTO t2 VALUES (1, 200);

CREATE OR REPLACE JSON DUALITY VIEW dv1
AS
  SELECT JSON_DUALITY_OBJECT(
    WITH(INSERT, UPDATE, DELETE)
    "_id" : f3,
    "f4" : f4,
    "ChildNode" , (SELECT JSON_DUALITY_OBJECT
                    (WITH(INSERT, UPDATE)
                    "f1" : f1,
                    "f2" : f2
                      )
                   FROM t1 WHERE t1.f1 = t2.f3)
) FROM t2;

INSERT INTO dv1 VALUES('{ "f4" : 400, "ChildNode" : { "f1" : 3,  "f2" : 4 } }');
```

Since, according to the view definition for `dv1`, the columns used in the join condition should match, the value for `t1.f1` is copied from `t2.f3`. If no value is specified for either column used in the join condition, the insert operation is rejected with an error.

Similarly, if a column used in a join condition is not projected in the JSON duality view, the value for the column which is not projected is copied from other column used in the join condition.

In some cases, for an object, not specifying a complete sub-object is allowed. This is the case if either of the following conditions is true:

* Rows matching the join condition already exist in the sub-object's table

* Skipping the insertion of this sub-object does not violate any table constraints.

When the root object being inserted references only existing sub-objects, then only the root object is inserted.

When the root object being inserted references only some of all existing sub-objects, then only the root object is inserted. Sub-objects which are not specified are not deleted.

When the root object being inserted references existing sub-objects and modifies some columns not part of the table's primary key, the root object is inserted, and any sub-objects are updated.

If an object or sub-object is defined on the same table at any level of the JSON duality view's definition, values for the columns must be the same; if they are not, the operation is rejected with an error.

Inserts of multiple objects are not allowed on JSON duality views.

The following types of `INSERT` statements are not allowed on JSON duality views:

* Statements using `HIGH_PRIORITY` or `DELAYED`

* `INSERT ... ON DUPLICATE KEY UPDATE` statement

* `INSERT ... SELECT` statement

##### Requirements and Restrictions for Update Annotations

Update operations on the root object and its sub-objects require the `UPDATE` annotation, and are rejected with an error without it. Referenced sub-objects must exist.

If a sub-object is inserted as part of an update operation, then the object must have the `INSERT` annotation. Otherwise, the operation is rejected with an error with the following exceptions:

* If a sub-object already exists and is referenced in the object being updated, or if it would be replaced with another existing sub-object in the table, no check for annotations is performed.

* If a sub-object is modified and the `UPDATE` annotation is not specified, only the existence of the sub-object is checked. An error is not reported for a missing annotation.

If a sub-object is a descendant of an element that is deleted, then the sub-object must have a `DELETE` annotation.

Updating JSON objects to an empty object or `NULL` is not allowed. Updates of primary key column values of the root object and sub-objects are not allowed.

Any update operation resulting in a constraint violation is rejected with an error. Such constraints include `NULL`, primary key, unique key, check, and foreign key constraints.

For update operations, all projected column values must be specified. Any missing sub-objects or elements in sub-objects are deleted.

If an object and its sub-object columns are not modified, base tables are updated.

If an object is modified but sub-object columns are not modified, then only the object's base table is updated.

If both object and sub-object columns are modified, then the base tables for both objects is updated.

If a new sub-object is inserted by the update, then a new row is inserted in the sub-object's table.

If an existing sub-object is missing (or deleted), the row for this sub-object is deleted.

If the deletion of an object caused by an update results in a table constraint violation, the update is rejected with an error.

Replacement of a sub-object with an existing sub-object in the base table is supported.

If multiple sub-objects are projected from the same table, the same value must be specified for all such sub-objects.

The `etag` supplied for an update operation must match the `etag` generated for the same object.

##### Requirements and Restrictions for Delete Annotations

If a root object must be deleted, then an object of a document must have a `DELETE` annotation.

A singleton sub-object must not be deleted.

Nested sub-objects must not be deleted if the `DELETE` annotation is not specified.

If sub-object has a `DELETE` annotation, then all elements of the nested sub-object must be deleted.

A delete operation is rejected with an error if referential constraint fails.

Singleton sub-objects are not deleted.


#### 27.7.2.4 Limitations on DML Operations

The following limitations or restrictions apply to all data modification operations (`INSERT`, `UPDATE`, and `DELETE` statements) on JSON duality views:

* Multiple `INSERT`, `UPDATE`, and `DELETE` operations on a JSON document is not supported.

* Auto-increment column projection is supported, but populating generated values is not supported.

* The `EXPLAIN` statement is not supported.

* The `REPLACE` statement is not supported.

* `LOAD DATA` and `LOAD XML` are not supported.

* `INSERT ... FROM SELECT` is not supported.
* Multi-table `UPDATE` and `DELETE` statements are not allowed.

* `INSERT ... ON DUPLICATE KEY UPDATE` is not allowed.

* The `LOW_PRIORITY` and `IGNORE` clauses are not supported.

* Data modification operations on an SQL view defined over a JSON duality view are not supported.

* Updates of multiple objects is not supported. Updates require a `WHERE` clause that identifies a single row.


### 27.7.3 JSON Duality View Metadata

You can obtain information about existing JSON duality views from the following Information Schema tables which have been implemented in this release:

* `JSON_DUALITY_VIEWS`: Provides per-view information about JSON duality views.

* `JSON_DUALITY_VIEW_COLUMNS`: Provides information about columns defined in JSON duality views.

* `JSON_DUALITY_VIEW_LINKS`: Describes parent-child relationships between JSON duality views and their base tables.

* `JSON_DUALITY_VIEW_TABLES`: Provides information about tables referenced by JSON duality views.

See the descriptions of the individual tables for more information.

JSON duality views are also supported as a feature by the Option Tracker component, which exposes a status variable [`option_tracker_usage:JSON Duality View`](option-tracker-component-status-variables.html#statvar_option_tracker_usage-JSON_Duality_View); this variable stores the number of times that any JSON duality views have been opened by the server.
