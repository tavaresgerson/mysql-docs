### 15.1.27 Declaração `CREATE VIEW`

```
CREATE
    [OR REPLACE]
    [ALGORITHM = {UNDEFINED | MERGE | TEMPTABLE}]
    [MATERIALIZED] ...
    [DEFINER = user]
    [SQL SECURITY { DEFINER | INVOKER }]
    VIEW view_name [(column_list)]
    AS select_statement
    [WITH [CASCADED | LOCAL] CHECK OPTION]

CREATE
    [ALGORITHM = {UNDEFINED | MERGE | TEMPTABLE}]
    [DEFINER = user]
    [SQL SECURITY { DEFINER | INVOKER }]
    [IF NOT EXISTS] VIEW view_name [(column_list)]
    AS select_statement
    [WITH [CASCADED | LOCAL] CHECK OPTION]
```

A declaração `CREATE VIEW` cria uma nova visualização ou substitui uma visualização existente, se a cláusula `OR REPLACE` for fornecida. Se a visualização não existir, `CREATE OR REPLACE VIEW` é a mesma coisa que `CREATE VIEW`. Se a visualização já existir, `CREATE OR REPLACE VIEW` a substitui.

As visualizações materializadas só são suportadas no MySQL HeatWave. Veja a consulta Visualizações Materializadas para saber mais.

O *`select_statement`* é uma declaração `SELECT` que fornece a definição da visualização. (Selecionar a partir da visualização, na verdade, usa a declaração `SELECT`.) O *`select_statement`* pode selecionar de tabelas base ou de outras visualizações. A declaração `SELECT` pode usar uma declaração `VALUES` como sua fonte, ou pode ser substituída por uma declaração `TABLE`, como com `CREATE TABLE ... SELECT`.

`IF NOT EXISTS` faz com que a visualização seja criada se ela ainda não existir. Se a visualização já existir e `IF NOT EXISTS` for especificada, a declaração é bem-sucedida com um aviso em vez de um erro; nesse caso, a definição da visualização não é alterada. Por exemplo:

```
mysql> CREATE VIEW v1 AS SELECT c1, c3 FROM t1;
Query OK, 0 rows affected (0.01 sec)

mysql> CREATE VIEW v1 AS SELECT c1, c3 FROM t1;
ERROR 1050 (42S01): Table 'v1' already exists
mysql> CREATE VIEW IF NOT EXISTS v1 AS SELECT c1, c3 FROM t1;
Query OK, 0 rows affected, 1 warning (0.01 sec)

mysql> SHOW WARNINGS;
+-------+------+---------------------------+
| Level | Code | Message                   |
+-------+------+---------------------------+
| Note  | 1050 | Table 'v1' already exists |
+-------+------+---------------------------+
1 row in set (0.00 sec)

mysql> SHOW CREATE VIEW v1\G
*************************** 1. row ***************************
                View: v1
         Create View: CREATE ALGORITHM=UNDEFINED DEFINER=`vuser`@`localhost` SQL
SECURITY DEFINER VIEW `v1` AS select `t1`.`c1` AS `c1`,`t1`.`c3` AS `c3` from `t1`
character_set_client: utf8mb4
collation_connection: utf8mb4_0900_ai_ci
1 row in set (0.00 sec)
```

`IF NOT EXISTS` e `OR REPLACE` são mutuamente exclusivos e não podem ser usados juntos na mesma declaração `CREATE VIEW`. Tentar fazê-lo faz com que a declaração seja rejeitada com um erro de sintaxe.

Para informações sobre restrições de uso de visualizações, consulte a Seção 27.11, “Restrições de Visualizações”.

A definição da visualização é “congelada” no momento da criação e não é afetada por alterações subsequentes nas definições das tabelas subjacentes. Por exemplo, se uma visualização é definida como `SELECT *` em uma tabela, novas colunas adicionadas à tabela mais tarde não se tornam parte da visualização, e colunas excluídas da tabela resultam em um erro ao selecionar a partir da visualização.

A cláusula `ALGORITHM` afeta a forma como o MySQL processa a visualização. As cláusulas `DEFINER` e `SQL SECURITY` especificam o contexto de segurança a ser utilizado ao verificar os privilégios de acesso no momento da invocação da visualização. A cláusula `WITH CHECK OPTION` pode ser usada para restringir as inserções ou atualizações a linhas em tabelas referenciadas pela visualização. Essas cláusulas são descritas mais adiante nesta seção.

A instrução `CREATE VIEW` requer o privilégio `CREATE VIEW` para a visualização e alguns privilégios para cada coluna selecionada pela instrução `SELECT`. Para colunas usadas em outras partes da instrução `SELECT`, você deve ter o privilégio `SELECT`. Se a cláusula `OR REPLACE` estiver presente, você também deve ter o privilégio `DROP` para a visualização. Se a cláusula `DEFINER` estiver presente, os privilégios necessários dependem do valor de *`user`*, conforme discutido na Seção 27.8, “Controle de Acesso a Objetos Armazenados”.

Quando uma visualização é referenciada, a verificação de privilégios ocorre conforme descrito mais adiante nesta seção.

Uma visualização pertence a um banco de dados. Por padrão, uma nova visualização é criada no banco de dados padrão. Para criar a visualização explicitamente em um determinado banco de dados, use a sintaxe *`db_name.view_name`* para qualificar o nome da visualização com o nome do banco de dados:

```
CREATE VIEW test.v AS SELECT * FROM t;
```

Nomes de tabelas ou visualizações não qualificados na instrução `SELECT` também são interpretados em relação ao banco de dados padrão. Uma visualização pode referenciar tabelas ou visualizações em outros bancos de dados, qualificando o nome da tabela ou visualização com o nome do banco de dados apropriado.

Dentro de um banco de dados, tabelas base e visualizações compartilham o mesmo namespace, então uma tabela base e uma visualização não podem ter o mesmo nome.

Colunas recuperadas pela instrução `SELECT` podem ser referências simples a colunas de tabelas ou expressões que usam funções, valores constantes, operadores, e assim por diante.

Uma visualização deve ter nomes de colunas únicos, sem duplicatas, assim como uma tabela base. Por padrão, os nomes das colunas recuperadas pela instrução `SELECT` são usados para os nomes das colunas da visualização. Para definir nomes explícitos para as colunas da visualização, especifique a cláusula opcional *`column_list`* como uma lista de identificadores separados por vírgula. O número de nomes em *`column_list`* deve ser igual ao número de colunas recuperadas pela instrução `SELECT`.

Uma visualização pode ser criada a partir de vários tipos de instruções `SELECT`. Ela pode referenciar tabelas base ou outras visualizações. Ela pode usar junções, `UNION` e subconsultas. A instrução `SELECT` nem precisa referenciar nenhuma tabela:

```
CREATE VIEW v_today (today) AS SELECT CURRENT_DATE;
```

O exemplo seguinte define uma visualização que seleciona duas colunas de outra tabela, bem como uma expressão calculada a partir dessas colunas:

```
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

A definição de uma visualização está sujeita às seguintes restrições:

* A instrução `SELECT` não pode referenciar variáveis de sistema ou variáveis definidas pelo usuário.

* Dentro de um programa armazenado, a instrução `SELECT` não pode referenciar parâmetros de programa ou variáveis locais.

* A instrução `SELECT` não pode referenciar parâmetros de instruções preparadas.

* Qualquer tabela ou visualização referenciada na definição deve existir. Se, após a criação da visualização, uma tabela ou visualização que a definição refere for excluída, o uso da visualização resulta em um erro. Para verificar a definição de uma visualização em busca de problemas desse tipo, use a instrução `CHECK TABLE`.

* A definição não pode referenciar uma tabela `TEMPORARY`, e você não pode criar uma visualização `TEMPORARY`.

* Você não pode associar um gatilho a uma visualização.
* Os aliases para os nomes de colunas na instrução `SELECT` são verificados contra o comprimento máximo de 64 caracteres (não o comprimento máximo de alias de 256 caracteres).

A cláusula `ORDER BY` é permitida em uma definição de visualização, mas é ignorada se você selecionar de uma visualização usando uma instrução que tenha sua própria cláusula `ORDER BY`.

Para outras opções ou cláusulas na definição, elas são adicionadas às opções ou cláusulas da instrução que referencia a visualização, mas o efeito é indefinido. Por exemplo, se uma definição de visualização inclui uma cláusula `LIMIT`, e você selecionar da visualização usando uma instrução que tenha sua própria cláusula `LIMIT`, é indefinido qual limite se aplica. Esse mesmo princípio se aplica a opções como `ALL`, `DISTINCT` ou `SQL_SMALL_RESULT` que seguem a palavra-chave `SELECT`, e a cláusulas como `INTO`, `FOR UPDATE`, `FOR SHARE`, `LOCK IN SHARE MODE` e `PROCEDURE`.

Os resultados obtidos a partir de uma visualização podem ser afetados se você alterar o ambiente de processamento de consulta alterando variáveis de sistema:

```
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

As cláusulas `DEFINER` e `SQL SECURITY` determinam qual conta do MySQL usar ao verificar os privilégios de acesso para a visualização quando uma instrução é executada que referencia a visualização. Os valores válidos de características `SQL SECURITY` são `DEFINER` (o padrão) e `INVOKER`. Esses indicam que os privilégios necessários devem ser mantidos pelo usuário que definiu ou invocou a visualização, respectivamente.

Se a cláusula `DEFINER` estiver presente, o valor *`user`* deve ser uma conta do MySQL especificada como `'user_name'@'host_name'`, `CURRENT_USER` ou `CURRENT_USER()`. Os valores *`user`* permitidos dependem dos privilégios que você possui, conforme discutido na Seção 27.8, “Controle de Acesso a Objetos Armazenados”. Veja também essa seção para informações adicionais sobre a segurança da visualização.

Se a cláusula `DEFINER` for omitida, o definidor padrão é o usuário que executa a instrução `CREATE VIEW`. Isso é o mesmo que especificar explicitamente `DEFINER = CURRENT_USER`.

Dentro de uma definição de visualização, a função `CURRENT_USER` retorna o valor `DEFINER` da visualização por padrão. Para visualizações definidas com a característica `SQL SECURITY INVOKER`, `CURRENT_USER` retorna a conta da conta que invoca a visualização. Para informações sobre auditoria de usuários dentro de visualizações, consulte a Seção 8.2.23, “Auditorização de Atividades de Conta Baseada em SQL”.

Dentro de uma rotina armazenada que é definida com a característica `SQL SECURITY DEFINER`, `CURRENT_USER` retorna o valor `DEFINER` da rotina. Isso também afeta uma visualização definida dentro de tal rotina, se a definição da visualização contiver um valor `DEFINER` de `CURRENT_USER`.

O MySQL verifica os privilégios de visualizações da seguinte forma:

* No momento da definição da visualização, o criador da visualização deve ter os privilégios necessários para usar os objetos de nível superior acessados pela visualização. Por exemplo, se a definição da visualização se refere a colunas de tabelas, o criador deve ter algum privilégio para cada coluna na lista de seleção da definição, e o privilégio `SELECT` para cada coluna usada em outro lugar na definição. Se a definição se refere a uma função armazenada, apenas os privilégios necessários para invocar a função podem ser verificados. Os privilégios requeridos no momento da invocação da função podem ser verificados apenas conforme ela é executada: Para diferentes invocações, caminhos de execução diferentes dentro da função podem ser tomados.

* O usuário que referencia uma visualização deve ter privilégios apropriados para acessá-la (`SELECT` para selecionar dela, `INSERT` para inserir nela, e assim por diante).

* Quando uma visualização foi referenciada, os privilégios para os objetos acessados pela visualização são verificados contra os privilégios detidos pela conta `DEFINER` ou pelo invocador da visualização, dependendo se a característica `SQL SECURITY` é `DEFINER` ou `INVOKER`, respectivamente.

* Se uma referência a uma vista causar a execução de uma função armazenada, a verificação de privilégios para as instruções executadas dentro da função depende se a característica `SQL SECURITY` da função é `DEFINER` ou `INVOKER`. Se a característica de segurança for `DEFINER`, a função é executada com os privilégios da conta `DEFINER`. Se a característica for `INVOKER`, a função é executada com os privilégios determinados pela característica `SQL SECURITY` da vista.

Exemplo: Uma vista pode depender de uma função armazenada, e essa função pode invocar outras rotinas armazenadas. Por exemplo, a seguinte vista invoca uma função armazenada `f()`:

```
CREATE VIEW v AS SELECT * FROM t WHERE t.id = f(t.name);
```

Suponha que `f()` contenha uma instrução como esta:

```
IF name IS NULL then
  CALL p1();
ELSE
  CALL p2();
END IF;
```

Os privilégios necessários para executar instruções dentro de `f()` precisam ser verificados quando `f()` é executado. Isso pode significar que são necessários privilégios para `p1()` ou `p2()`, dependendo do caminho de execução dentro de `f()`. Esses privilégios devem ser verificados em tempo de execução, e o usuário que deve possuir os privilégios é determinado pelos valores de `SQL SECURITY` da vista `v` e da função `f()`.

As cláusulas `DEFINER` e `SQL SECURITY` para vistas são extensões do SQL padrão. No SQL padrão, as vistas são manipuladas usando as regras para `SQL SECURITY DEFINER`. O padrão diz que o definidor da vista, que é o mesmo que o proprietário do esquema da vista, obtém privilégios aplicáveis à vista (por exemplo, `SELECT`) e pode concedê-los. O MySQL não tem o conceito de um "proprietário" de esquema, então o MySQL adiciona uma cláusula para identificar o definidor. A cláusula `DEFINER` é uma extensão onde a intenção é ter o que o padrão tem; ou seja, um registro permanente de quem definiu a vista. É por isso que o valor padrão de `DEFINER` é a conta do criador da vista.

A cláusula `ALGORITHM` opcional é uma extensão do MySQL para o SQL padrão. Ela afeta como o MySQL processa a visualização. `ALGORITHM` aceita três valores: `MERGE`, `TEMPTABLE` ou `UNDEFINED`. Para mais informações, consulte a Seção 27.6.2, “Algoritmos de Processamento de Visualizações”, bem como a Seção 10.2.2.4, “Otimização de Tabelas Derivadas, Referências a Visualizações e Expressões de Tabela Comuns com Mergulhamento ou Materialização”.

Algumas visualizações são atualizáveis. Ou seja, você pode usá-las em instruções como `UPDATE`, `DELETE` ou `INSERT` para atualizar o conteúdo da tabela subjacente. Para que uma visualização seja atualizável, deve haver uma relação um-para-um entre as linhas da visualização e as linhas da tabela subjacente. Há também certas outras construções que tornam uma visualização não atualizável.

Uma coluna gerada em uma visualização é considerada atualizável porque é possível atribuir a ela. No entanto, se tal coluna for atualizada explicitamente, o único valor permitido é `DEFAULT`. Para informações sobre colunas geradas, consulte a Seção 15.1.24.8, “CREATE TABLE e Colunas Geradas”.

A cláusula `WITH CHECK OPTION` pode ser dada para uma visualização atualizável para impedir inserções ou atualizações de linhas, exceto aquelas para as quais a cláusula `WHERE` no *`select_statement`* é verdadeira.

Em uma cláusula `WITH CHECK OPTION` para uma visualização atualizável, as palavras-chave `LOCAL` e `CASCADED` determinam o escopo da verificação de controle quando a visualização é definida em termos de outra visualização. A palavra-chave `LOCAL` restringe a `CHECK OPTION` apenas à visualização que está sendo definida. `CASCADED` faz com que as verificações para visualizações subjacentes sejam avaliadas também. Quando nenhuma das palavras-chave é dada, o padrão é `CASCADED`.

Para obter mais informações sobre visualizações atualizáveis e a cláusula `WITH CHECK OPTION`, consulte a Seção 27.6.3, “Visualizações atualizáveis e inseríveis”, e a Seção 27.6.4, “A cláusula WITH CHECK OPTION da visualização”.