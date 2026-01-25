#### 13.7.5.13 Declaração SHOW CREATE VIEW

```sql
SHOW CREATE VIEW view_name
```

Esta declaração mostra a instrução [`CREATE VIEW`](create-view.html "13.1.21 CREATE VIEW Statement") que cria a View nomeada.

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

`character_set_client` é o valor de sessão da variável de sistema [`character_set_client`](server-system-variables.html#sysvar_character_set_client) quando a View foi criada. `collation_connection` é o valor de sessão da variável de sistema [`collation_connection`](server-system-variables.html#sysvar_collation_connection) quando a View foi criada.

O uso de [`SHOW CREATE VIEW`](show-create-view.html "13.7.5.13 SHOW CREATE VIEW Statement") requer o privilégio [`SHOW VIEW`](privileges-provided.html#priv_show-view), e o privilégio [`SELECT`](privileges-provided.html#priv_select) para a View em questão.

As informações da View também estão disponíveis na tabela `INFORMATION_SCHEMA` [`VIEWS`](information-schema-views-table.html "24.3.31 The INFORMATION_SCHEMA VIEWS Table"). Consulte [Seção 24.3.31, “The INFORMATION_SCHEMA VIEWS Table”](information-schema-views-table.html "24.3.31 The INFORMATION_SCHEMA VIEWS Table").

O MySQL permite que você use diferentes configurações de [`sql_mode`](server-system-variables.html#sysvar_sql_mode) para informar ao server o tipo de sintaxe SQL a ser suportada. Por exemplo, você pode usar o SQL mode [`ANSI`](sql-mode.html#sqlmode_ansi) para garantir que o MySQL interprete corretamente o operador padrão de concatenação SQL, a barra dupla (`||`), em suas Queries. Se você então criar uma View que concatena itens, você pode se preocupar que a alteração da configuração de [`sql_mode`](server-system-variables.html#sysvar_sql_mode) para um valor diferente de [`ANSI`](sql-mode.html#sqlmode_ansi) possa tornar a View inválida. Mas não é o caso. Independentemente de como você escreve a definição de uma View, o MySQL sempre a armazena da mesma forma, em um formato canônico. Aqui está um exemplo que mostra como o server altera um operador de concatenação de barra dupla para uma função [`CONCAT()`](string-functions.html#function_concat):

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

A vantagem de armazenar uma definição de View em formato canônico é que as alterações feitas posteriormente no valor de [`sql_mode`](server-system-variables.html#sysvar_sql_mode) não afetam os resultados da View. No entanto, uma consequência adicional é que os comentários anteriores ao [`SELECT`](select.html "13.2.9 SELECT Statement") são removidos da definição pelo server.