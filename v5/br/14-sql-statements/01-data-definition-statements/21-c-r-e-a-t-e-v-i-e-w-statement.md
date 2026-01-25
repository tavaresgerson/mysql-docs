### 13.1.21 Instrução CREATE VIEW

```sql
CREATE
    [OR REPLACE]
    [ALGORITHM = {UNDEFINED | MERGE | TEMPTABLE}]
    [DEFINER = user]
    [SQL SECURITY { DEFINER | INVOKER }]
    VIEW view_name [(column_list)]
    AS select_statement
    [WITH [CASCADED | LOCAL] CHECK OPTION]
```

A instrução [`CREATE VIEW`](create-view.html "13.1.21 CREATE VIEW Statement") cria uma nova view, ou substitui uma view existente se a cláusula `OR REPLACE` for fornecida. Se a view não existir, [`CREATE OR REPLACE VIEW`](create-view.html "13.1.21 CREATE VIEW Statement") é o mesmo que [`CREATE VIEW`](create-view.html "13.1.21 CREATE VIEW Statement"). Se a view já existir, [`CREATE OR REPLACE VIEW`](create-view.html "13.1.21 CREATE VIEW Statement") a substitui.

Para obter informações sobre restrições no uso de views, consulte [Seção 23.9, “Restrictions on Views”](view-restrictions.html "23.9 Restrictions on Views").

O *`select_statement`* é uma instrução [`SELECT`](select.html "13.2.9 SELECT Statement") que fornece a definição da view. (Selecionar a partir da view realiza a seleção, na prática, utilizando a instrução [`SELECT`](select.html "13.2.9 SELECT Statement").) O *`select_statement`* pode selecionar a partir de base tables ou de outras views.

A definição da view é “congelada” no momento da criação e não é afetada por alterações subsequentes nas definições das tables subjacentes. Por exemplo, se uma view for definida como `SELECT *` em uma table, novas colunas adicionadas à table posteriormente não se tornam parte da view, e colunas removidas da table resultam em um erro ao selecionar a partir da view.

A cláusula `ALGORITHM` afeta como o MySQL processa a view. As cláusulas `DEFINER` e `SQL SECURITY` especificam o contexto de segurança a ser usado ao verificar os privilégios de acesso no momento da invocação da view. A cláusula `WITH CHECK OPTION` pode ser fornecida para restringir `inserts` ou `updates` nas linhas das tables referenciadas pela view. Essas cláusulas são descritas posteriormente nesta seção.

A instrução [`CREATE VIEW`](create-view.html "13.1.21 CREATE VIEW Statement") exige o privilégio [`CREATE VIEW`](privileges-provided.html#priv_create-view) para a view, e algum privilégio para cada coluna selecionada pela instrução [`SELECT`](select.html "13.2.9 SELECT Statement"). Para colunas usadas em outras partes da instrução [`SELECT`](select.html "13.2.9 SELECT Statement"), você deve ter o privilégio [`SELECT`](privileges-provided.html#priv_select). Se a cláusula `OR REPLACE` estiver presente, você também deve ter o privilégio [`DROP`](privileges-provided.html#priv_drop) para a view. Se a cláusula `DEFINER` estiver presente, os privilégios exigidos dependem do valor *`user`*, conforme discutido em [Seção 23.6, “Stored Object Access Control”](stored-objects-security.html "23.6 Stored Object Access Control").

Quando uma view é referenciada, a verificação de privilégios ocorre conforme descrito posteriormente nesta seção.

Uma view pertence a um Database. Por padrão, uma nova view é criada no Database padrão. Para criar a view explicitamente em um Database específico, use a sintaxe *`db_name.view_name`* para qualificar o nome da view com o nome do Database:

```sql
CREATE VIEW test.v AS SELECT * FROM t;
```

Nomes de table ou view não qualificados na instrução [`SELECT`](select.html "13.2.9 SELECT Statement") também são interpretados em relação ao Database padrão. Uma view pode fazer referência a tables ou views em outros Databases qualificando o nome da table ou view com o nome do Database apropriado.

Dentro de um Database, base tables e views compartilham o mesmo namespace, portanto, uma base table e uma view não podem ter o mesmo nome.

As colunas recuperadas pela instrução [`SELECT`](select.html "13.2.9 SELECT Statement") podem ser referências simples a colunas de table, ou expressões que usam funções, valores constantes, operadores, e assim por diante.

Uma view deve ter nomes de coluna exclusivos, sem duplicatas, assim como uma base table. Por padrão, os nomes das colunas recuperadas pela instrução [`SELECT`](select.html "13.2.9 SELECT Statement") são usados para os nomes das colunas da view. Para definir nomes explícitos para as colunas da view, especifique a cláusula opcional *`column_list`* como uma lista de identificadores separados por vírgulas. O número de nomes em *`column_list`* deve ser o mesmo que o número de colunas recuperadas pela instrução [`SELECT`](select.html "13.2.9 SELECT Statement").

Uma view pode ser criada a partir de diversos tipos de instruções [`SELECT`](select.html "13.2.9 SELECT Statement"). Ela pode se referir a base tables ou outras views. Pode usar `joins`, [`UNION`](union.html "13.2.9.3 UNION Clause") e subqueries. A instrução [`SELECT`](select.html "13.2.9 SELECT Statement") nem precisa se referir a nenhuma table:

```sql
CREATE VIEW v_today (today) AS SELECT CURRENT_DATE;
```

O exemplo a seguir define uma view que seleciona duas colunas de outra table, bem como uma expressão calculada a partir dessas colunas:

```sql
mysql> CREATE TABLE t (qty INT, price INT);
mysql> INSERT INTO t VALUES(3, 50);
mysql> CREATE VIEW v AS SELECT qty, price, qty*price AS value FROM t;
mysql> SELECT * FROM v;
+------+-------+-------+
| qty  | price | value |
+------+-------+-------+
|    3 |    50 |   150 |
+------+-------+-------+
```

A definição de uma view está sujeita às seguintes restrições:

* A instrução [`SELECT`](select.html "13.2.9 SELECT Statement") não pode fazer referência a system variables ou user-defined variables.

* Dentro de um stored program, a instrução [`SELECT`](select.html "13.2.9 SELECT Statement") não pode fazer referência a parâmetros de programa ou local variables.

* A instrução [`SELECT`](select.html "13.2.9 SELECT Statement") não pode fazer referência a parâmetros de prepared statement.

* Qualquer table ou view referenciada na definição deve existir. Se, após a criação da view, uma table ou view à qual a definição se refere for removida (`dropped`), o uso da view resultará em um erro. Para verificar a definição de uma view em busca de problemas desse tipo, use a instrução [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement").

* A definição não pode fazer referência a uma `TEMPORARY` table, e você não pode criar uma view `TEMPORARY`.

* Você não pode associar um `trigger` a uma view.
* `Aliases` (apelidos) para nomes de coluna na instrução [`SELECT`](select.html "13.2.9 SELECT Statement") são verificados em relação ao comprimento máximo de coluna de 64 caracteres (não o comprimento máximo de `alias` de 256 caracteres).

`ORDER BY` é permitido em uma definição de view, mas é ignorado se você selecionar a partir de uma view usando uma instrução que tenha seu próprio `ORDER BY`.

Para outras opções ou cláusulas na definição, elas são adicionadas às opções ou cláusulas da instrução que referencia a view, mas o efeito é indefinido. Por exemplo, se uma definição de view incluir uma cláusula `LIMIT`, e você selecionar a partir da view usando uma instrução que tenha sua própria cláusula `LIMIT`, é indefinido qual limite se aplica. Este mesmo princípio se aplica a opções como `ALL`, `DISTINCT` ou `SQL_SMALL_RESULT` que seguem a palavra-chave [`SELECT`](select.html "13.2.9 SELECT Statement"), e a cláusulas como `INTO`, `FOR UPDATE`, `LOCK IN SHARE MODE` e `PROCEDURE`.

Os resultados obtidos a partir de uma view podem ser afetados se você alterar o ambiente de processamento de querys, modificando system variables:

```sql
mysql> CREATE VIEW v (mycol) AS SELECT 'abc';
Query OK, 0 rows affected (0.01 sec)

mysql> SET sql_mode = '';
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT "mycol" FROM v;
+-------+
| mycol |
+-------+
| mycol |
+-------+
1 row in set (0.01 sec)

mysql> SET sql_mode = 'ANSI_QUOTES';
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT "mycol" FROM v;
+-------+
| mycol |
+-------+
| abc   |
+-------+
1 row in set (0.00 sec)
```

As cláusulas `DEFINER` e `SQL SECURITY` determinam qual conta MySQL usar ao verificar os privilégios de acesso para a view quando uma instrução que referencia a view é executada. Os valores válidos da característica `SQL SECURITY` são `DEFINER` (o padrão) e `INVOKER`. Estes indicam que os privilégios necessários devem ser detidos pelo usuário que definiu ou invocou a view, respectivamente.

Se a cláusula `DEFINER` estiver presente, o valor *`user`* deve ser uma conta MySQL especificada como `'user_name'@'host_name'`, [`CURRENT_USER`](information-functions.html#function_current-user), ou [`CURRENT_USER()`](information-functions.html#function_current-user). Os valores *`user`* permitidos dependem dos privilégios que você possui, conforme discutido em [Seção 23.6, “Stored Object Access Control”](stored-objects-security.html "23.6 Stored Object Access Control"). Consulte também essa seção para obter informações adicionais sobre a segurança de views.

Se a cláusula `DEFINER` for omitida, o `definer` padrão é o usuário que executa a instrução [`CREATE VIEW`](create-view.html "13.1.21 CREATE VIEW Statement"). Isso é o mesmo que especificar `DEFINER = CURRENT_USER` explicitamente.

Dentro de uma definição de view, a função [`CURRENT_USER`](information-functions.html#function_current-user) retorna o valor `DEFINER` da view por padrão. Para views definidas com a característica `SQL SECURITY INVOKER`, [`CURRENT_USER`](information-functions.html#function_current-user) retorna a conta do `invoker` (invocador) da view. Para informações sobre auditoria de usuários em views, consulte [Seção 6.2.18, “SQL-Based Account Activity Auditing”](account-activity-auditing.html "6.2.18 SQL-Based Account Activity Auditing").

Dentro de uma stored routine que é definida com a característica `SQL SECURITY DEFINER`, [`CURRENT_USER`](information-functions.html#function_current-user) retorna o valor `DEFINER` da rotina. Isso também afeta uma view definida dentro dessa rotina, se a definição da view contiver um valor `DEFINER` de [`CURRENT_USER`](information-functions.html#function_current-user).

O MySQL verifica os privilégios da view da seguinte forma:

* No momento da definição da view, o criador da view deve ter os privilégios necessários para usar os objetos de nível superior acessados pela view. Por exemplo, se a definição da view se referir a colunas de table, o criador deve ter algum privilégio para cada coluna na lista de `select` da definição, e o privilégio [`SELECT`](privileges-provided.html#priv_select) para cada coluna usada em outras partes da definição. Se a definição se referir a uma stored function, apenas os privilégios necessários para invocar a função podem ser verificados. Os privilégios exigidos no momento da invocação da função podem ser verificados apenas durante sua execução: Para diferentes invocações, diferentes caminhos de execução dentro da função podem ser tomados.

* O usuário que referencia uma view deve ter privilégios apropriados para acessá-la ([`SELECT`](privileges-provided.html#priv_select) para selecionar a partir dela, [`INSERT`](privileges-provided.html#priv_insert) para inserir nela, e assim por diante.)

* Quando uma view é referenciada, os privilégios para objetos acessados pela view são verificados em relação aos privilégios detidos pela conta `DEFINER` da view ou pelo `invoker`, dependendo se a característica `SQL SECURITY` é `DEFINER` ou `INVOKER`, respectivamente.

* Se a referência a uma view causar a execução de uma stored function, a verificação de privilégios para as instruções executadas dentro da função dependerá se a característica `SQL SECURITY` da função é `DEFINER` ou `INVOKER`. Se a característica de segurança for `DEFINER`, a função é executada com os privilégios da conta `DEFINER`. Se a característica for `INVOKER`, a função é executada com os privilégios determinados pela característica `SQL SECURITY` da view.

Exemplo: Uma view pode depender de uma stored function, e essa função pode invocar outras stored routines. Por exemplo, a seguinte view invoca uma stored function `f()`:

```sql
CREATE VIEW v AS SELECT * FROM t WHERE t.id = f(t.name);
```

Suponha que `f()` contenha uma instrução como esta:

```sql
IF name IS NULL then
  CALL p1();
ELSE
  CALL p2();
END IF;
```

Os privilégios exigidos para executar instruções dentro de `f()` precisam ser verificados quando `f()` é executada. Isso pode significar que privilégios são necessários para `p1()` ou `p2()`, dependendo do caminho de execução dentro de `f()`. Esses privilégios devem ser verificados em `runtime` (tempo de execução), e o usuário que deve possuir os privilégios é determinado pelos valores `SQL SECURITY` da view `v` e da função `f()`.

As cláusulas `DEFINER` e `SQL SECURITY` para views são extensões do SQL padrão. No SQL padrão, as views são tratadas usando as regras para `SQL SECURITY DEFINER`. O padrão afirma que o `definer` da view, que é o mesmo que o proprietário do `schema` da view, obtém privilégios aplicáveis na view (por exemplo, [`SELECT`](privileges-provided.html#priv_select)) e pode concedê-los. O MySQL não possui o conceito de “proprietário” de `schema`, então o MySQL adiciona uma cláusula para identificar o `definer`. A cláusula `DEFINER` é uma extensão cuja intenção é ter o que o padrão possui; ou seja, um registro permanente de quem definiu a view. É por isso que o valor `DEFINER` padrão é a conta do criador da view.

A cláusula opcional `ALGORITHM` é uma extensão do MySQL ao SQL padrão. Ela afeta como o MySQL processa a view. `ALGORITHM` aceita três valores: `MERGE`, `TEMPTABLE` ou `UNDEFINED`. Para mais informações, consulte [Seção 23.5.2, “View Processing Algorithms”](view-algorithms.html "23.5.2 View Processing Algorithms"), bem como [Seção 8.2.2.4, “Optimizing Derived Tables and View References with Merging or Materialization”](derived-table-optimization.html "8.2.2.4 Optimizing Derived Tables and View References with Merging or Materialization").

Algumas views são `updatable` (atualizáveis). Ou seja, você pode usá-las em instruções como [`UPDATE`](update.html "13.2.11 UPDATE Statement"), [`DELETE`](delete.html "13.2.2 DELETE Statement") ou [`INSERT`](insert.html "13.2.5 INSERT Statement") para atualizar o conteúdo da table subjacente. Para que uma view seja `updatable`, deve haver uma relação um-para-um entre as linhas na view e as linhas na table subjacente. Existem também outras construções que tornam uma view não-updatable.

Uma generated column em uma view é considerada `updatable` porque é possível atribuir um valor a ela. No entanto, se tal coluna for atualizada explicitamente, o único valor permitido é `DEFAULT`. Para obter informações sobre `generated columns`, consulte [Seção 13.1.18.7, “CREATE TABLE and Generated Columns”](create-table-generated-columns.html "13.1.18.7 CREATE TABLE and Generated Columns").

A cláusula `WITH CHECK OPTION` pode ser fornecida para uma view `updatable` para evitar `inserts` ou `updates` em linhas, exceto aquelas para as quais a cláusula `WHERE` no *`select_statement`* é verdadeira.

Em uma cláusula `WITH CHECK OPTION` para uma view `updatable`, as palavras-chave `LOCAL` e `CASCADED` determinam o escopo do teste de verificação quando a view é definida em termos de outra view. A palavra-chave `LOCAL` restringe o `CHECK OPTION` apenas à view que está sendo definida. `CASCADED` faz com que as verificações das views subjacentes também sejam avaliadas. Quando nenhuma das palavras-chave é fornecida, o padrão é `CASCADED`.

Para mais informações sobre views `updatable` e a cláusula `WITH CHECK OPTION`, consulte [Seção 23.5.3, “Updatable and Insertable Views”](view-updatability.html "23.5.3 Updatable and Insertable Views"), e [Seção 23.5.4, “The View WITH CHECK OPTION Clause”](view-check-option.html "23.5.4 The View WITH CHECK OPTION Clause").

Views criadas antes do MySQL 5.7.3 contendo `ORDER BY integer` podem resultar em erros no momento da avaliação da view. Considere estas definições de view, que usam `ORDER BY` com um número ordinal:

```sql
CREATE VIEW v1 AS SELECT x, y, z FROM t ORDER BY 2;
CREATE VIEW v2 AS SELECT x, 1, z FROM t ORDER BY 2;
```

No primeiro caso, `ORDER BY 2` refere-se a uma coluna nomeada `y`. No segundo caso, refere-se a uma constante 1. Para `querys` que selecionam a partir de qualquer uma das views menos de 2 colunas (o número nomeado na cláusula `ORDER BY`), ocorre um erro se o servidor avaliar a view usando o algoritmo `MERGE`. Exemplos:

```sql
mysql> SELECT x FROM v1;
ERROR 1054 (42S22): Unknown column '2' in 'order clause'
mysql> SELECT x FROM v2;
ERROR 1054 (42S22): Unknown column '2' in 'order clause'
```

A partir do MySQL 5.7.3, para lidar com definições de view como esta, o servidor as escreve de forma diferente no arquivo `.frm` que armazena a definição da view. Essa diferença é visível com [`SHOW CREATE VIEW`](show-create-view.html "13.7.5.13 SHOW CREATE VIEW Statement"). Anteriormente, o arquivo `.frm` continha isto para a cláusula `ORDER BY 2`:

```sql
For v1: ORDER BY 2
For v2: ORDER BY 2
```

A partir do 5.7.3, o arquivo `.frm` contém isto:

```sql
For v1: ORDER BY `t`.`y`
For v2: ORDER BY ''
```

Ou seja, para `v1`, 2 é substituído por uma referência ao nome da coluna referenciada. Para `v2`, 2 é substituído por uma expressão string constante (ordenar por uma constante não tem efeito, então ordenar por qualquer constante funciona).

Se você tiver erros de avaliação de view como os descritos, remova (`drop`) e recrie a view para que o arquivo `.frm` contenha a representação atualizada da view. Alternativamente, para views como `v2` que ordenam por um valor constante, remova e recrie a view sem a cláusula `ORDER BY`.