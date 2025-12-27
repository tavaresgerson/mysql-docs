#### 15.7.7.15 Declaração `SHOW CREATE VIEW`

```
SHOW CREATE VIEW view_name
```

Esta declaração mostra a declaração `CREATE VIEW` que cria a visão nomeada.

```
mysql> SHOW CREATE VIEW v\G
*************************** 1. row ***************************
                View: v
         Create View: CREATE ALGORITHM=UNDEFINED
                      DEFINER=`bob`@`localhost`
                      SQL SECURITY DEFINER VIEW
                      `v` AS select 1 AS `a`,2 AS `b`
character_set_client: utf8mb4
collation_connection: utf8mb4_0900_ai_ci
```

`character_set_client` é o valor de sessão da variável de sistema `character_set_client` quando a visão foi criada. `collation_connection` é o valor de sessão da variável de sistema `collation_connection` quando a visão foi criada.

O uso da declaração `SHOW CREATE VIEW` requer o privilégio `SHOW VIEW` e o privilégio `SELECT` para a visão em questão.

As informações da visão também estão disponíveis na tabela `VIEWS` do `INFORMATION_SCHEMA`. Veja a Seção 28.3.53, “A Tabela VIEWS do INFORMATION_SCHEMA”.

Esta declaração também funciona para mostrar a declaração `CREATE JSON DUALITY VIEW` necessária para criar uma visão de dualidade JSON. Você também pode obter informações sobre visões de dualidade JSON das tabelas `JSON_DUALITY_VIEWS`, `JSON_DUALITY_VIEW_COLUMNS`, `JSON_DUALITY_VIEW_LINKS` e `JSON_DUALITY_VIEW_TABLES`. Veja também a Seção 27.7.3, “Metadados da Visão de Dualidade JSON”.

O seguinte exemplo mostra a declaração `SHOW CREATE VIEW` usada para criar uma visão de dualidade JSON:

```
mysql> SHOW CREATE VIEW order_dv\G
*************************** 1. row ***************************
                View: order_dv
         Create View: CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER JSON RELATIONAL DUALITY VIEW `order_dv`
                      AS select json_duality_object( WITH (INSERT,UPDATE,DELETE) '_id':`orders`.`order_id`,'product':`orders`.`product`,'amount':`orders`.`amount`,'customer':
                      (select json_duality_object( WITH (INSERT,UPDATE) 'customer_id':`customers`.`customer_id`,'customer_name':`customers`.`name`)
                      from `customers` where (`customers`.`customer_id` = `orders`.`customer_id`))) AS `Name_exp_1` from `orders`
character_set_client: utf8mb4
collation_connection: utf8mb4_0900_ai_ci
1 row in set (0.002 sec)
```

O MySQL permite que você use diferentes configurações do `sql_mode` para informar ao servidor o tipo de sintaxe SQL a ser suportado. Por exemplo, você pode usar o modo SQL ANSI para garantir que o MySQL interprete corretamente o operador de concatenação SQL padrão, a barra dupla (`||`), em suas consultas. Se você criar uma visualização que concatene itens, pode se preocupar que alterar a configuração `sql_mode` para um valor diferente de `ANSI` possa fazer com que a visualização se torne inválida. Mas isso não é o caso. Independentemente de como você escreva a definição de uma visualização, o MySQL sempre a armazena da mesma maneira, em uma forma canônica. Aqui está um exemplo que mostra como o servidor altera um operador de concatenação de barra dupla para uma função `CONCAT()`:

```
mysql> SET sql_mode = 'ANSI';
Query OK, 0 rows affected (0.00 sec)

mysql> CREATE VIEW test.v AS SELECT 'a' || 'b' as col1;
Query OK, 0 rows affected (0.01 sec)

mysql> SHOW CREATE VIEW test.v\G
*************************** 1. row ***************************
                View: v
         Create View: CREATE VIEW "v" AS select concat('a','b') AS "col1"
...
1 row in set (0.00 sec)
```

A vantagem de armazenar a definição de uma visualização em forma canônica é que alterações feitas posteriormente no valor de `sql_mode` não afetam os resultados da visualização. No entanto, uma consequência adicional é que os comentários anteriores ao `SELECT` são removidos da definição pelo servidor.