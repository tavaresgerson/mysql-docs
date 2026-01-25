### 13.1.16 Instruções CREATE PROCEDURE e CREATE FUNCTION

```sql
CREATE
    [DEFINER = user]
    PROCEDURE sp_name ([proc_parameter[,...)
    [characteristic ...] routine_body

CREATE
    [DEFINER = user]
    FUNCTION sp_name ([func_parameter[,...)
    RETURNS type
    [characteristic ...] routine_body

proc_parameter:
    [ IN | OUT | INOUT ] param_name type

func_parameter:
    param_name type

type:
    Any valid MySQL data type

characteristic: {
    COMMENT 'string'
  | LANGUAGE SQL
  | [NOT] DETERMINISTIC
  | { CONTAINS SQL | NO SQL | READS SQL DATA | MODIFIES SQL DATA }
  | SQL SECURITY { DEFINER | INVOKER }
}

routine_body:
    Valid SQL routine statement
```

Estas instruções são usadas para criar uma stored ROUTINE (uma stored PROCEDURE ou FUNCTION). Ou seja, a ROUTINE especificada torna-se conhecida pelo server. Por padrão, uma stored ROUTINE é associada ao default DATABASE. Para associar a ROUTINE explicitamente a um DATABASE específico, especifique o nome como *`db_name.sp_name`* ao criá-la.

A instrução `CREATE FUNCTION` também é usada no MySQL para suportar loadable FUNCTIONs. Consulte [Seção 13.7.3.1, “Instrução CREATE FUNCTION para Loadable Functions”](create-function-loadable.html "13.7.3.1 CREATE FUNCTION Statement for Loadable Functions"). Uma loadable FUNCTION pode ser considerada uma stored FUNCTION externa. Stored FUNCTIONs compartilham seu namespace com loadable FUNCTIONs. Consulte [Seção 9.2.5, “Análise e Resolução de Nomes de FUNCTION”](function-resolution.html "9.2.5 Function Name Parsing and Resolution"), para as regras que descrevem como o server interpreta referências a diferentes tipos de FUNCTIONs.

Para invocar uma stored PROCEDURE, use a instrução [`CALL`](call.html "13.2.1 CALL Statement") (consulte [Seção 13.2.1, “Instrução CALL”](call.html "13.2.1 CALL Statement")). Para invocar uma stored FUNCTION, referencie-a em uma expression. A FUNCTION retorna um valor durante a avaliação da expression.

[`CREATE PROCEDURE`](create-procedure.html "13.1.16 CREATE PROCEDURE and CREATE FUNCTION Statements") e [`CREATE FUNCTION`](create-function.html "13.1.13 CREATE FUNCTION Statement") requerem o privilégio [`CREATE ROUTINE`](privileges-provided.html#priv_create-routine). Se a cláusula `DEFINER` estiver presente, os privilégios necessários dependem do valor *`user`*, conforme discutido em [Seção 23.6, “Controle de Acesso a Objetos Armazenados”](stored-objects-security.html "23.6 Stored Object Access Control"). Se o binary logging estiver habilitado, [`CREATE FUNCTION`](create-function.html "13.1.13 CREATE FUNCTION Statement") pode requerer o privilégio [`SUPER`](privileges-provided.html#priv_super), conforme discutido em [Seção 23.7, “Binary Logging de Stored Programs”](stored-programs-logging.html "23.7 Stored Program Binary Logging").

Por padrão, o MySQL concede automaticamente os privilégios [`ALTER ROUTINE`](privileges-provided.html#priv_alter-routine) e [`EXECUTE`](privileges-provided.html#priv_execute) ao criador da ROUTINE. Este comportamento pode ser alterado desabilitando a variável de sistema [`automatic_sp_privileges`](server-system-variables.html#sysvar_automatic_sp_privileges). Consulte [Seção 23.2.2, “Stored Routines e Privilégios MySQL”](stored-routines-privileges.html "23.2.2 Stored Routines and MySQL Privileges").

As cláusulas `DEFINER` e `SQL SECURITY` especificam o security context a ser usado ao verificar privilégios de acesso no momento da execução da ROUTINE, conforme descrito posteriormente nesta seção.

Se o nome da ROUTINE for o mesmo nome de uma built-in SQL FUNCTION, ocorrerá um syntax error, a menos que você use um espaço entre o nome e o parêntese seguinte ao definir a ROUTINE ou ao invocá-la posteriormente. Por esta razão, evite usar nomes de FUNCTIONs SQL existentes para suas próprias stored ROUTINEs.

O SQL mode [`IGNORE_SPACE`](sql-mode.html#sqlmode_ignore_space) se aplica a built-in FUNCTIONs, não a stored ROUTINEs. É sempre permitido ter espaços após o nome de uma stored ROUTINE, independentemente de [`IGNORE_SPACE`](sql-mode.html#sqlmode_ignore_space) estar habilitado.

A lista de parâmetros entre parênteses deve estar sempre presente. Se não houver parâmetros, deve ser usada uma lista de parâmetros vazia de `()`. Os nomes dos parâmetros não diferenciam maiúsculas de minúsculas (case-sensitive).

Cada parâmetro é um parâmetro `IN` por padrão. Para especificar o contrário para um parâmetro, use a keyword `OUT` ou `INOUT` antes do nome do parâmetro.

Nota

Especificar um parâmetro como `IN`, `OUT` ou `INOUT` é válido apenas para uma `PROCEDURE`. Para uma `FUNCTION`, os parâmetros são sempre considerados parâmetros `IN`.

Um parâmetro `IN` passa um valor para dentro de uma PROCEDURE. A PROCEDURE pode modificar o valor, mas a modificação não é visível para o caller (quem chama) quando a PROCEDURE retorna. Um parâmetro `OUT` passa um valor da PROCEDURE de volta para o caller. Seu valor inicial é `NULL` dentro da PROCEDURE, e seu valor é visível para o caller quando a PROCEDURE retorna. Um parâmetro `INOUT` é inicializado pelo caller, pode ser modificado pela PROCEDURE, e qualquer alteração feita pela PROCEDURE é visível para o caller quando a PROCEDURE retorna.

Para cada parâmetro `OUT` ou `INOUT`, passe uma user-defined variable na instrução [`CALL`](call.html "13.2.1 CALL Statement") que invoca a PROCEDURE para que você possa obter seu valor quando a PROCEDURE retornar. Se você estiver chamando a PROCEDURE de dentro de outra stored PROCEDURE ou FUNCTION, você também pode passar um parâmetro de ROUTINE ou uma local routine variable como um parâmetro `OUT` ou `INOUT`. Se você estiver chamando a PROCEDURE de dentro de um TRIGGER, você também pode passar `NEW.col_name` como um parâmetro `OUT` ou `INOUT`.

Para informações sobre o efeito de condições não tratadas nos parâmetros da PROCEDURE, consulte [Seção 13.6.7.8, “Tratamento de Condições e Parâmetros OUT ou INOUT”](conditions-and-parameters.html "13.6.7.8 Condition Handling and OUT or INOUT Parameters").

Os parâmetros da ROUTINE não podem ser referenciados em instruções prepared dentro da ROUTINE; consulte [Seção 23.8, “Restrições sobre Stored Programs”](stored-program-restrictions.html "23.8 Restrictions on Stored Programs").

O exemplo a seguir mostra uma stored PROCEDURE simples que, dado um código de país, conta o número de cidades para aquele país que aparecem na tabela `city` do DATABASE `world`. O código do país é passado usando um parâmetro `IN`, e a contagem de cidades é retornada usando um parâmetro `OUT`:

```sql
mysql> delimiter //

mysql> CREATE PROCEDURE citycount (IN country CHAR(3), OUT cities INT)
       BEGIN
         SELECT COUNT(*) INTO cities FROM world.city
         WHERE CountryCode = country;
       END//
Query OK, 0 rows affected (0.01 sec)

mysql> delimiter ;

mysql> CALL citycount('JPN', @cities); -- cities in Japan
Query OK, 1 row affected (0.00 sec)

mysql> SELECT @cities;
+---------+
| @cities |
+---------+
|     248 |
+---------+
1 row in set (0.00 sec)

mysql> CALL citycount('FRA', @cities); -- cities in France
Query OK, 1 row affected (0.00 sec)

mysql> SELECT @cities;
+---------+
| @cities |
+---------+
|      40 |
+---------+
1 row in set (0.00 sec)
```

O exemplo usa o comando `delimiter` do client [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") para alterar o statement delimiter de `;` para `//` enquanto a PROCEDURE está sendo definida. Isso permite que o delimiter `;` usado no body da PROCEDURE seja passado para o server em vez de ser interpretado pelo próprio [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"). Consulte [Seção 23.1, “Definindo Stored Programs”](stored-programs-defining.html "23.1 Defining Stored Programs").

A cláusula `RETURNS` pode ser especificada apenas para uma `FUNCTION`, para a qual é obrigatória. Ela indica o return type da FUNCTION, e o body da FUNCTION deve conter uma instrução `RETURN value`. Se a instrução [`RETURN`](return.html "13.6.5.7 RETURN Statement") retornar um valor de um tipo diferente, o valor é coagido ao tipo apropriado. Por exemplo, se uma FUNCTION especificar um valor [`ENUM`](enum.html "11.3.5 The ENUM Type") ou [`SET`](set.html "11.3.6 The SET Type") na cláusula `RETURNS`, mas a instrução [`RETURN`](return.html "13.6.5.7 RETURN Statement") retornar um INTEGER, o valor retornado da FUNCTION será a string para o membro [`ENUM`](enum.html "11.3.5 The ENUM Type") ou o conjunto de membros [`SET`](set.html "11.3.6 The SET Type") correspondente.

A FUNCTION de exemplo a seguir aceita um parâmetro, executa uma operação usando uma SQL FUNCTION e retorna o resultado. Neste caso, é desnecessário usar `delimiter` porque a definição da FUNCTION não contém delimiters de instrução `;` internos:

```sql
mysql> CREATE FUNCTION hello (s CHAR(20))
    ->   RETURNS CHAR(50) DETERMINISTIC
    ->   RETURN CONCAT('Hello, ',s,'!');
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT hello('world');
+----------------+
| hello('world') |
+----------------+
| Hello, world!  |
+----------------+
1 row in set (0.00 sec)
```

Os tipos de parâmetro e os return types de FUNCTION podem ser declarados para usar qualquer data type válido. O atributo `COLLATE` pode ser usado se for precedido por uma especificação `CHARACTER SET`.

O *`routine_body`* consiste em uma instrução SQL ROUTINE válida. Esta pode ser uma instrução simples, como [`SELECT`](select.html "13.2.9 SELECT Statement") ou [`INSERT`](insert.html "13.2.5 INSERT Statement"), ou uma compound statement escrita usando `BEGIN` e `END`. Compound statements podem conter `DECLARE`s, LOOPS e outras instruções de control structure. A sintaxe para estas instruções é descrita em [Seção 13.6, “Compound Statements”](sql-compound-statements.html "13.6 Compound Statements"). Na prática, stored FUNCTIONs tendem a usar compound statements, a menos que o body consista em uma única instrução [`RETURN`](return.html "13.6.5.7 RETURN Statement").

O MySQL permite que ROUTINEs contenham instruções DDL, como `CREATE` e `DROP`. O MySQL também permite que stored PROCEDUREs (mas não stored FUNCTIONs) contenham instruções SQL transaction, como [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"). Stored FUNCTIONs não podem conter instruções que realizam COMMIT ou ROLLBACK explícito ou implícito. O suporte para estas instruções não é exigido pelo padrão SQL, que afirma que cada fornecedor de DBMS pode decidir se as permite.

Instruções que retornam um result set podem ser usadas dentro de uma stored PROCEDURE, mas não dentro de uma stored FUNCTION. Esta proibição inclui instruções [`SELECT`](select.html "13.2.9 SELECT Statement") que não possuem uma cláusula `INTO var_list` e outras instruções como [`SHOW`](show.html "13.7.5 SHOW Statements"), [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") e [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement"). Para instruções que podem ser determinadas no tempo de definição da FUNCTION como retornando um result set, ocorre um ERROR `Not allowed to return a result set from a function` ([`ER_SP_NO_RETSET`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_sp_no_retset)). Para instruções que podem ser determinadas como retornando um result set apenas em runtime, ocorre um ERROR `PROCEDURE %s can't return a result set in the given context` ([`ER_SP_BADSELECT`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_sp_badselect)).

Instruções [`USE`](use.html "13.8.4 USE Statement") dentro de stored ROUTINEs não são permitidas. Quando uma ROUTINE é invocada, um `USE db_name` implícito é realizado (e desfeito quando a ROUTINE termina). Isso faz com que a ROUTINE use o default DATABASE fornecido enquanto é executada. Referências a objetos em DATABASEs diferentes do default DATABASE da ROUTINE devem ser qualificadas com o nome do DATABASE apropriado.

Para informações adicionais sobre instruções que não são permitidas em stored ROUTINEs, consulte [Seção 23.8, “Restrições sobre Stored Programs”](stored-program-restrictions.html "23.8 Restrictions on Stored Programs").

Para informações sobre como invocar stored PROCEDUREs a partir de programas escritos em uma linguagem que possui uma interface MySQL, consulte [Seção 13.2.1, “Instrução CALL”](call.html "13.2.1 CALL Statement").

O MySQL armazena a configuração da variável de sistema [`sql_mode`](server-system-variables.html#sysvar_sql_mode) em vigor quando uma ROUTINE é criada ou alterada, e sempre executa a ROUTINE com essa configuração em vigor, *independentemente do SQL mode atual do server quando a ROUTINE começa a ser executada*.

A mudança do SQL mode do invoker (quem invoca) para o da ROUTINE ocorre após a avaliação dos argumentos e a atribuição dos valores resultantes aos parâmetros da ROUTINE. Se você definir uma ROUTINE em SQL mode estrito, mas a invocar em modo não estrito, a atribuição de argumentos aos parâmetros da ROUTINE não ocorre em modo estrito. Se você exigir que as expressions passadas para uma ROUTINE sejam atribuídas em SQL mode estrito, você deve invocar a ROUTINE com o modo estrito em vigor.

A characteristic `COMMENT` é uma extensão MySQL e pode ser usada para descrever a stored ROUTINE. Esta informação é exibida pelas instruções [`SHOW CREATE PROCEDURE`](show-create-procedure.html "13.7.5.9 SHOW CREATE PROCEDURE Statement") e [`SHOW CREATE FUNCTION`](show-create-function.html "13.7.5.8 SHOW CREATE FUNCTION Statement").

A characteristic `LANGUAGE` indica a linguagem na qual a ROUTINE está escrita. O server ignora esta characteristic; apenas SQL ROUTINEs são suportadas.

Uma ROUTINE é considerada “deterministic” se ela sempre produzir o mesmo resultado para os mesmos input parameters, e “not deterministic” caso contrário. Se nem `DETERMINISTIC` nem `NOT DETERMINISTIC` for fornecido na definição da ROUTINE, o default é `NOT DETERMINISTIC`. Para declarar que uma FUNCTION é deterministic, você deve especificar `DETERMINISTIC` explicitamente.

A avaliação da natureza de uma ROUTINE baseia-se na "honestidade" do criador: o MySQL não verifica se uma ROUTINE declarada `DETERMINISTIC` está livre de instruções que produzam resultados nondeterministic. No entanto, declarar incorretamente uma ROUTINE pode afetar os resultados ou o performance. Declarar uma ROUTINE nondeterministic como `DETERMINISTIC` pode levar a resultados inesperados, fazendo com que o optimizer faça escolhas incorretas de execution plan. Declarar uma ROUTINE deterministic como `NONDETERMINISTIC` pode diminuir o performance, impedindo que otimizações disponíveis sejam usadas.

Se o binary logging estiver habilitado, a characteristic `DETERMINISTIC` afeta quais definições de ROUTINE o MySQL aceita. Consulte [Seção 23.7, “Binary Logging de Stored Programs”](stored-programs-logging.html "23.7 Stored Program Binary Logging").

Uma ROUTINE que contém a FUNCTION [`NOW()`](date-and-time-functions.html#function_now) (ou seus sinônimos) ou [`RAND()`](mathematical-functions.html#function_rand) é nondeterministic, mas ainda pode ser replication-safe. Para [`NOW()`](date-and-time-functions.html#function_now), o binary log inclui o timestamp e replica corretamente. [`RAND()`](mathematical-functions.html#function_rand) também replica corretamente, desde que seja chamada apenas uma única vez durante a execução de uma ROUTINE. (Você pode considerar o timestamp de execução da ROUTINE e a seed de número aleatório como INPUTs implícitos que são idênticos na source e na replica.)

Várias characteristics fornecem informações sobre a natureza do uso de dados pela ROUTINE. No MySQL, estas characteristics são apenas consultivas (advisory). O server não as usa para restringir que tipos de instruções uma ROUTINE tem permissão para executar.

* `CONTAINS SQL` indica que a ROUTINE não contém instruções que leem ou escrevem dados. Este é o default se nenhuma destas characteristics for fornecida explicitamente. Exemplos de tais instruções são `SET @x = 1` ou `DO RELEASE_LOCK('abc')`, que são executadas, mas nem leem nem escrevem dados.

* `NO SQL` indica que a ROUTINE não contém instruções SQL.

* `READS SQL DATA` indica que a ROUTINE contém instruções que leem dados (por exemplo, [`SELECT`](select.html "13.2.9 SELECT Statement")), mas não instruções que escrevem dados.

* `MODIFIES SQL DATA` indica que a ROUTINE contém instruções que podem escrever dados (por exemplo, [`INSERT`](insert.html "13.2.5 INSERT Statement") ou [`DELETE`](delete.html "13.2.2 DELETE Statement")).

A characteristic `SQL SECURITY` pode ser `DEFINER` ou `INVOKER` para especificar o security context; ou seja, se a ROUTINE executa usando os privilégios da conta nomeada na cláusula `DEFINER` da ROUTINE ou do user que a invoca. Esta conta deve ter permissão para acessar o DATABASE ao qual a ROUTINE está associada. O valor default é `DEFINER`. O user que invoca a ROUTINE deve ter o privilégio [`EXECUTE`](privileges-provided.html#priv_execute) para ela, assim como a conta `DEFINER`, se a ROUTINE for executada no security context de definer.

A cláusula `DEFINER` especifica a conta MySQL a ser usada ao verificar privilégios de acesso no momento da execução da ROUTINE para ROUTINEs que possuem a characteristic `SQL SECURITY DEFINER`.

Se a cláusula `DEFINER` estiver presente, o valor *`user`* deve ser uma conta MySQL especificada como `'user_name'@'host_name'`, [`CURRENT_USER`](information-functions.html#function_current-user) ou [`CURRENT_USER()`](information-functions.html#function_current-user). Os valores *`user`* permitidos dependem dos privilégios que você possui, conforme discutido em [Seção 23.6, “Controle de Acesso a Objetos Armazenados”](stored-objects-security.html "23.6 Stored Object Access Control"). Consulte também esta seção para obter informações adicionais sobre a segurança de stored ROUTINEs.

Se a cláusula `DEFINER` for omitida, o definer default é o user que executa a instrução [`CREATE PROCEDURE`](create-procedure.html "13.1.16 CREATE PROCEDURE and CREATE FUNCTION Statements") ou [`CREATE FUNCTION`](create-function.html "13.1.13 CREATE FUNCTION Statement"). Isso é o mesmo que especificar `DEFINER = CURRENT_USER` explicitamente.

Dentro do body de uma stored ROUTINE que é definida com a characteristic `SQL SECURITY DEFINER`, a FUNCTION [`CURRENT_USER`](information-functions.html#function_current-user) retorna o valor `DEFINER` da ROUTINE. Para informações sobre auditoria de user dentro de stored ROUTINEs, consulte [Seção 6.2.18, “Auditoria de Atividade de Conta Baseada em SQL”](account-activity-auditing.html "6.2.18 SQL-Based Account Activity Auditing").

Considere a seguinte PROCEDURE, que exibe uma contagem do número de contas MySQL listadas na tabela de sistema `mysql.user`:

```sql
CREATE DEFINER = 'admin'@'localhost' PROCEDURE account_count()
BEGIN
  SELECT 'Number of accounts:', COUNT(*) FROM mysql.user;
END;
```

A PROCEDURE recebe uma conta `DEFINER` de `'admin'@'localhost'`, independentemente do user que a define. Ela executa com os privilégios dessa conta, independentemente do user que a invoca (porque a characteristic de segurança default é `DEFINER`). A PROCEDURE é bem-sucedida ou falha dependendo se o invoker possui o privilégio [`EXECUTE`](privileges-provided.html#priv_execute) para ela e se `'admin'@'localhost'` possui o privilégio [`SELECT`](privileges-provided.html#priv_select) para a tabela `mysql.user`.

Agora suponha que a PROCEDURE seja definida com a characteristic `SQL SECURITY INVOKER`:

```sql
CREATE DEFINER = 'admin'@'localhost' PROCEDURE account_count()
SQL SECURITY INVOKER
BEGIN
  SELECT 'Number of accounts:', COUNT(*) FROM mysql.user;
END;
```

A PROCEDURE ainda tem um `DEFINER` de `'admin'@'localhost'`, mas neste caso, ela executa com os privilégios do user invoker. Assim, a PROCEDURE é bem-sucedida ou falha dependendo se o invoker possui o privilégio [`EXECUTE`](privileges-provided.html#priv_execute) para ela e o privilégio [`SELECT`](privileges-provided.html#priv_select) para a tabela `mysql.user`.

O server lida com o data type de um parâmetro de ROUTINE, local routine variable criada com [`DECLARE`](declare.html "13.6.3 DECLARE Statement"), ou return value de FUNCTION da seguinte forma:

* As atribuições são verificadas quanto a incompatibilidades de data type e overflow. Problemas de conversão e overflow resultam em WARNINGs, ou ERRORs em SQL mode estrito.

* Apenas valores scalar podem ser atribuídos. Por exemplo, uma instrução como `SET x = (SELECT 1, 2)` é inválida.

* Para data types de CHARACTER, se `CHARACTER SET` for incluído na declaração, o character set especificado e seu default collation serão usados. Se o atributo `COLLATE` também estiver presente, esse collation será usado em vez do default collation.

  Se `CHARACTER SET` e `COLLATE` não estiverem presentes, o character set e collation do DATABASE em vigor no momento da criação da ROUTINE serão usados. Para evitar que o server use o character set e collation do DATABASE, forneça um `CHARACTER SET` explícito e um atributo `COLLATE` para parâmetros de character data.

  Se você alterar o character set ou collation default do DATABASE, as stored ROUTINEs que devem usar os novos defaults do DATABASE devem ser descartadas e recriadas.

  O character set e collation do DATABASE são fornecidos pelo valor das variáveis de sistema [`character_set_database`](server-system-variables.html#sysvar_character_set_database) e [`collation_database`](server-system-variables.html#sysvar_collation_database). Para mais informações, consulte [Seção 10.3.3, “Character Set e Collation do Database”](charset-database.html "10.3.3 Database Character Set and Collation").
