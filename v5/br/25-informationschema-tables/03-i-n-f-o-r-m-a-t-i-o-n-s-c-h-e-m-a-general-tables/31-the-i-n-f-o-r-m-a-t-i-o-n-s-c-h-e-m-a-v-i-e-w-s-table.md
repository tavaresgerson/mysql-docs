### 24.3.31 A Tabela VIEWS do INFORMATION_SCHEMA

A tabela [`VIEWS`](information-schema-views-table.html "24.3.31 A Tabela VIEWS do INFORMATION_SCHEMA") fornece informações sobre as views em Databases. Você deve ter o privilégio [`SHOW VIEW`](privileges-provided.html#priv_show-view) para acessar esta tabela.

A tabela [`VIEWS`](information-schema-views-table.html "24.3.31 A Tabela VIEWS do INFORMATION_SCHEMA") possui estas colunas:

* `TABLE_CATALOG`

  O nome do Catalog ao qual a view pertence. Este valor é sempre `def`.

* `TABLE_SCHEMA`

  O nome do Schema (Database) ao qual a view pertence.

* `TABLE_NAME`

  O nome da view.

* `VIEW_DEFINITION`

  A instrução [`SELECT`](select.html "13.2.9 SELECT Statement") que fornece a definição da view. Esta coluna contém a maior parte do que você vê na coluna `Create Table` produzida por [`SHOW CREATE VIEW`](show-create-view.html "13.7.5.13 SHOW CREATE VIEW Statement"). Omita as palavras antes de [`SELECT`](select.html "13.2.9 SELECT Statement") e omita as palavras `WITH CHECK OPTION`. Suponha que a instrução original fosse:

  ```sql
  CREATE VIEW v AS
    SELECT s2,s1 FROM t
    WHERE s1 > 5
    ORDER BY s1
    WITH CHECK OPTION;
  ```

  Então, a definição da view se parece com isto:

  ```sql
  SELECT s2,s1 FROM t WHERE s1 > 5 ORDER BY s1
  ```

* `CHECK_OPTION`

  O valor do atributo `CHECK_OPTION`. O valor é um de `NONE`, `CASCADE` ou `LOCAL`.

* `IS_UPDATABLE`

  O MySQL define um flag, chamado flag de updatability da view, no momento da instrução [`CREATE VIEW`](create-view.html "13.1.21 CREATE VIEW Statement"). O flag é definido como `YES` (verdadeiro) se [`UPDATE`](update.html "13.2.11 UPDATE Statement") e [`DELETE`](delete.html "13.2.2 DELETE Statement") (e operações similares) forem legais para a view. Caso contrário, o flag é definido como `NO` (falso). A coluna `IS_UPDATABLE` na tabela [`VIEWS`](information-schema-views-table.html "24.3.31 A Tabela VIEWS do INFORMATION_SCHEMA") exibe o status deste flag.

  Se uma view não for updatable, instruções como [`UPDATE`](update.html "13.2.11 UPDATE Statement"), [`DELETE`](delete.html "13.2.2 DELETE Statement") e [`INSERT`](insert.html "13.2.5 INSERT Statement") são ilegais e são rejeitadas. (Mesmo que uma view seja updatable, pode não ser possível inserir dados nela; para detalhes, consulte a [Seção 23.5.3, “Views Updatable e Insertable”](view-updatability.html "23.5.3 Updatable and Insertable Views").)

  O flag `IS_UPDATABLE` pode não ser confiável se uma view depender de uma ou mais outras views, e uma dessas views subjacentes for atualizada. Independentemente do valor de `IS_UPDATABLE`, o servidor mantém o rastreamento da updatability de uma view e rejeita corretamente as operações de alteração de dados em views que não são updatable. Se o valor de `IS_UPDATABLE` para uma view se tornar impreciso devido a alterações em views subjacentes, o valor pode ser atualizado excluindo e recriando a view.

* `DEFINER`

  A conta do usuário que criou a view, no formato `'user_name'@'host_name'`.

* `SECURITY_TYPE`

  A característica `SQL SECURITY` da view. O valor é um de `DEFINER` ou `INVOKER`.

* `CHARACTER_SET_CLIENT`

  O valor de sessão da variável de sistema [`character_set_client`](server-system-variables.html#sysvar_character_set_client) quando a view foi criada.

* `COLLATION_CONNECTION`

  O valor de sessão da variável de sistema [`collation_connection`](server-system-variables.html#sysvar_collation_connection) quando a view foi criada.

#### Notas

O MySQL permite diferentes configurações de [`sql_mode`](server-system-variables.html#sysvar_sql_mode) para informar ao servidor o tipo de sintaxe SQL a ser suportada. Por exemplo, você pode usar o SQL mode [`ANSI`](sql-mode.html#sqlmode_ansi) para garantir que o MySQL interprete corretamente o operador de concatenação SQL padrão, a barra dupla (`||`), nas suas Queries. Se você então criar uma view que concatena itens, você pode se preocupar que mudar a configuração de [`sql_mode`](server-system-variables.html#sysvar_sql_mode) para um valor diferente de [`ANSI`](sql-mode.html#sqlmode_ansi) possa fazer com que a view se torne inválida. Mas este não é o caso. Não importa como você escreva a definição de uma view, o MySQL sempre a armazena da mesma forma, em um formato canônico. Aqui está um exemplo que mostra como o servidor altera um operador de concatenação de barra dupla para uma função [`CONCAT()`](string-functions.html#function_concat):

```sql
mysql> SET sql_mode = 'ANSI';
Query OK, 0 rows affected (0.00 sec)

mysql> CREATE VIEW test.v AS SELECT 'a' || 'b' as col1;
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT VIEW_DEFINITION FROM INFORMATION_SCHEMA.VIEWS
       WHERE TABLE_SCHEMA = 'test' AND TABLE_NAME = 'v';
+----------------------------------+
| VIEW_DEFINITION                  |
+----------------------------------+
| select concat('a','b') AS `col1` |
+----------------------------------+
1 row in set (0.00 sec)
```

A vantagem de armazenar uma definição de view em formato canônico é que as alterações feitas posteriormente no valor de [`sql_mode`](server-system-variables.html#sysvar_sql_mode) não afetam os resultados da view. No entanto, uma consequência adicional é que os comentários anteriores à instrução [`SELECT`](select.html "13.2.9 SELECT Statement") são removidos da definição pelo servidor.
