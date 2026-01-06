#### 13.7.5.13 Declaração `SHOW CREATE VIEW`

```sql
SHOW CREATE VIEW view_name
```

Esta declaração mostra a declaração `CREATE VIEW` que cria a visualização nomeada.

```sql
mysql> SHOW CREATE VIEW v\G
*************************** 1. row ***************************
                View: v
         Create View: CREATE ALGORITHM=UNDEFINED
                      DEFINER=`bob`@`localhost`
                      SQL SECURITY DEFINER VIEW
                      `v` AS select 1 AS `a`,2 AS `b`
character_set_client: utf8
collation_connection: utf8_general_ci
```

`character_set_client` é o valor da sessão da variável de sistema `character_set_client` quando a visualização foi criada. `collation_connection` é o valor da sessão da variável de sistema `collation_connection` quando a visualização foi criada.

O uso de `SHOW CREATE VIEW` requer o privilégio `SHOW VIEW` e o privilégio `SELECT` para a vista em questão.

As informações também estão disponíveis na tabela `INFORMATION_SCHEMA` `VIEWS`. Consulte Seção 24.3.31, “A Tabela VIEWS do INFORMATION\_SCHEMA”.

O MySQL permite que você use diferentes configurações de `sql_mode` para informar ao servidor o tipo de sintaxe SQL a ser suportado. Por exemplo, você pode usar o modo SQL `ANSI` para garantir que o MySQL interprete corretamente o operador de concatenação SQL padrão, a barra dupla (`||`), em suas consultas. Se você criar uma visualização que concatena itens, você pode se preocupar que alterar a configuração de `sql_mode` para um valor diferente de `ANSI` possa fazer com que a visualização se torne inválida. Mas isso não é o caso. Independentemente de como você escreve a definição de uma visualização, o MySQL sempre a armazena da mesma maneira, em uma forma canônica. Aqui está um exemplo que mostra como o servidor altera um operador de concatenação de barra dupla para uma função `CONCAT`:

```sql
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

A vantagem de armazenar uma definição de visualização em forma canônica é que alterações feitas posteriormente no valor de `sql_mode` não afetam os resultados da visualização. No entanto, uma consequência adicional é que os comentários anteriores a `SELECT` são removidos da definição pelo servidor.
