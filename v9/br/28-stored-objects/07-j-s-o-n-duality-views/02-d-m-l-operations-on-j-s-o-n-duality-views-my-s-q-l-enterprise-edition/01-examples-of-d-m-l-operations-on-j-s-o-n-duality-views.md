#### 27.7.2.1 Exemplos de operações DML em visualizações de dualidade JSON

Para demonstrar as diferentes operações DML que você pode executar em visualizações de dualidade JSON, crie as tabelas relacionais `clientes` e `pedidos`.

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

Em seguida, crie a visualização de dualidade JSON `customer_orders_dv`, que apresenta informações de pedidos como um documento JSON. A visualização de dualidade é construída sobre as tabelas relacionais subjacentes `clientes` e `pedidos`. A visualização de dualidade JSON `customer_orders_dv` contém os descendentes aninhados `pedidos`. A visualização usa uma anotação de tabela para permitir operações de `INSERT`, `UPDATE` e `DELETE` no objeto raiz e no objeto sub `pedidos`.

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

Agora, crie outra visualização de dualidade JSON chamada `order_dv`, projetada para apresentar informações individuais de pedidos como um documento JSON. Esta visualização também é construída sobre as tabelas relacionais subjacentes `clientes` e `pedidos`. A visualização de dualidade JSON `order_dv` contém o descendente único `cliente`. A visualização usa uma anotação de tabela para permitir operações de `INSERT`, `UPDATE` e `DELETE` no objeto raiz. Como o objeto sub é um descendente único, apenas operações de `INSERT` e `UPDATE` são permitidas nele.

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

Os seguintes exemplos usam as tabelas relacionais e as visualizações de dualidade JSON criadas anteriormente.

##### Operação de Inserção em um Documento JSON

Você pode criar documentos JSON realizando uma operação de `INSERT` na visualização de dualidade JSON. Durante uma operação de `INSERT`, você pode criar um documento completo, incluindo todos os objetos sub, ou criar apenas o objeto raiz enquanto faz referência a objetos sub existentes. Se um objeto sub tiver registros existentes, a operação de `INSERT` é transformada em uma operação de `UPDATE`.

O exemplo a seguir cria um documento JSON completo, incluindo o objeto raiz e todos os subobjetos com uma única operação `INSERT`.

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
||
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

O exemplo mostra o seguinte:

* Um único documento JSON pode inserir os dados de `clientes` e `pedidos` de forma apropriada em uma única transação atômica.

* A operação `INSERT` do documento JSON insere linhas nas tabelas relacionais `clientes` e `pedidos` através da visão de dualidade JSON.

* A visão de dualidade `customer_orders_dv` também afeta a visão de dualidade `orders_dv`, pois todas as informações são consistentes através das tabelas relacionais. Os novos pedidos adicionados também são visíveis aqui.

Observe o seguinte:

* Para operações `INSERT`, você deve especificar valores para todas as chaves no documento JSON com a seguinte exceção: Se uma coluna projetada para uma chave tiver um valor padrão, ela pode ser omitida. Nesse caso, o valor padrão é armazenado na respectiva tabela relacional.

* A coluna `orders.customer_id` não é projetada na visão de dualidade JSON `customers_orders_dv`, mas seu valor ainda é preenchido durante a operação `INSERT`. O sistema deduz valores para colunas não projetadas ou até mesmo chaves ausentes no documento com base na condição de `JOIN` do subobjeto.

* A inserção de múltiplos documentos JSON com uma única declaração `INSERT` não é suportada. Você deve inserir cada documento JSON individualmente.

O exemplo a seguir usa a operação `INSERT` para criar um documento JSON parcial. O exemplo começa com tabelas vazias para `clientes` e `pedidos`.

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

O exemplo continua a criar um documento JSON parcial referenciando subobjetos existentes e modificando esses subobjetos existentes.

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

O exemplo mostra o seguinte:

* Você pode pular a passagem de valores para subobjetos ou referenciar subobjetos existentes.

* Você pode modificar um subobjeto ao inserir dados no documento JSON.

Observe o seguinte:

* Você tem a opção de excluir elementos de um array de subobjetos aninhados.

* Você só pode modificar colunas que não são chaves primárias.

##### Operação de Atualização em um Documento JSON

Os seguintes exemplos mostram como atualizar documentos JSON com o `_id` do documento. Você pode realizar várias ações de atualização em documentos JSON, incluindo:

* Atualizar o objeto raiz
* Atualizar um subobjeto
* Atualizar um elemento dentro de um subobjeto aninhado
* Inserir um novo elemento em um subobjeto aninhado
* Excluir um elemento de um subobjeto aninhado

Se os subobjetos aninhados tiverem registros ausentes, a operação `UPDATE` se transforma em uma operação `INSERT`.

O exemplo a seguir atualiza um documento JSON completo com um único comando `UPDATE` para modificar tanto o objeto raiz quanto quaisquer subobjetos dentro do documento JSON.

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

O exemplo mostra o seguinte:

* Uma única operação de atualização em um documento JSON que atualiza as tabelas relacionais `clientes` e `pedidos` em uma única ação atômica.

* A operação `UPDATE` atualiza linhas nas tabelas `clientes` e `pedidos` através da visão de dualidade JSON.

* A visão de dualidade `customer_orders_dv` também afeta a visão de dualidade `orders_dv`, pois todas as informações são consistentes através das tabelas relacionais. Os novos pedidos adicionados também são visíveis aqui.

Observe o seguinte:

* Você deve especificar campos de chave projetando colunas primárias no documento JSON, ou seja, o `_id` do objeto raiz e o `order_id` do subobjeto.

* A atualização de vários documentos JSON com uma única declaração `UPDATE` não é suportada. Você deve inserir cada documento JSON individualmente.

O exemplo a seguir atualiza um documento JSON parcial. Isso permite modificações eficientes e direcionadas sem a necessidade de substituir todo o documento.

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

O exemplo mostra como uma única operação de atualização em um documento JSON pode inserir, modificar e excluir linhas da tabela `orders` em uma única ação atômica.

Lembre-se de que você deve especificar as chaves que projetam as colunas primárias no documento JSON, como o `_id` do objeto raiz e o `order_id` do objeto sub.

##### Operação de Exclusão em um Documento JSON

Você tem a opção de excluir um documento JSON inteiro ou apenas uma parte específica dele. Ao realizar uma exclusão parcial, quaisquer objetos sub que não tenham a marcação de modificação `DELETE` permanecerão inalterados.

O exemplo a seguir exclui um documento JSON inteiro.

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

O exemplo mostra como uma única operação de exclusão em um documento JSON exclui todos os dados das tabelas `customers` e `orders` em uma única ação atômica. As linhas são excluídas das tabelas através da visão de dualidade JSON.

Lembre-se de que a exclusão de múltiplos documentos JSON com uma única declaração `DELETE` não é suportada. Você deve excluir cada documento JSON individualmente.

O exemplo a seguir realiza uma exclusão parcial de um documento JSON. Para uma visão de dualidade JSON com um descendente único, a marcação de modificação `DELETE` não é permitida. Se um objeto sub não incluir uma marcação de modificação `DELETE`, as linhas correspondentes nos objetos sub não serão excluídas.

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

O exemplo mostra o seguinte:

* A operação de exclusão no documento JSON não exclui o objeto sub descendente único.

* A operação de exclusão não exclui o objeto sub se o modificador `DELETE` for especificado para ele.