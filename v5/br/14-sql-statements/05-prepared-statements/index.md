## 13.5 Prepared Statements

[13.5.1 Instrução PREPARE](prepare.html)

[13.5.2 Instrução EXECUTE](execute.html)

[13.5.3 Instrução DEALLOCATE PREPARE](deallocate-prepare.html)

O MySQL 5.7 oferece suporte a prepared statements (instruções preparadas) do lado do servidor. Esse suporte tira proveito do protocolo binário eficiente cliente/servidor. Usar prepared statements com *placeholders* (marcadores de posição) para valores de parâmetros traz os seguintes benefícios:

* Menos *overhead* para analisar (parsing) a instrução cada vez que é executada. Tipicamente, aplicações de Database processam grandes volumes de instruções quase idênticas, com mudanças apenas em valores literais ou variáveis em cláusulas como `WHERE` para queries e deletes, `SET` para updates e `VALUES` para inserts.

* Proteção contra ataques de SQL injection. Os valores dos parâmetros podem conter aspas e caracteres delimitadores SQL não escapados.

As seções a seguir fornecem uma visão geral das características dos prepared statements:

* [Prepared Statements em Programas de Aplicação](sql-prepared-statements.html#prepared-statements-in-applications "Prepared Statements em Programas de Aplicação")
* [Prepared Statements em Scripts SQL](sql-prepared-statements.html#prepared-statements-in-scripts "Prepared Statements em Scripts SQL")
* [Instruções PREPARE, EXECUTE e DEALLOCATE PREPARE](sql-prepared-statements.html#prepared-statement-types "Instruções PREPARE, EXECUTE e DEALLOCATE PREPARE")
* [Sintaxe SQL Permitida em Prepared Statements](sql-prepared-statements.html#prepared-statements-permitted "Sintaxe SQL Permitida em Prepared Statements")

### Prepared Statements em Programas de Aplicação

Você pode usar prepared statements do lado do servidor através de interfaces de programação de cliente, incluindo a [biblioteca cliente MySQL C API](/doc/c-api/5.7/en/) para programas C, o [MySQL Connector/J](/doc/connector-j/en/) para programas Java e o [MySQL Connector/NET](/doc/connector-net/en/) para programas que usam tecnologias .NET. Por exemplo, o C API fornece um conjunto de chamadas de função que compõem sua API de prepared statement. Consulte [C API Prepared Statement Interface](/doc/c-api/5.7/en/c-api-prepared-statement-interface.html). Outras interfaces de linguagem podem fornecer suporte para prepared statements que usam o protocolo binário ao vincular (linking) a biblioteca cliente C, sendo um exemplo a [`mysqli` extension](http://php.net/mysqli), disponível no PHP 5.0 e superior.

### Prepared Statements em Scripts SQL

Uma interface SQL alternativa para prepared statements está disponível. Esta interface não é tão eficiente quanto usar o protocolo binário por meio de uma API de prepared statement, mas não requer programação, pois está disponível diretamente no nível SQL:

* Você pode usá-la quando nenhuma interface de programação estiver disponível para você.

* Você pode usá-la a partir de qualquer programa que possa enviar instruções SQL para o servidor para serem executadas, como o programa cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client").

* Você pode usá-la mesmo que o cliente esteja usando uma versão antiga da biblioteca cliente.

A sintaxe SQL para prepared statements destina-se a ser usada em situações como estas:

* Para testar como os prepared statements funcionam em sua aplicação antes de codificá-la.

* Para usar prepared statements quando você não tem acesso a uma API de programação que os suporte.

* Para solucionar problemas de aplicação interativamente usando prepared statements.

* Para criar um caso de teste que reproduza um problema com prepared statements, para que você possa registrar um relatório de bug.

### Instruções PREPARE, EXECUTE e DEALLOCATE PREPARE

A sintaxe SQL para prepared statements é baseada em três instruções SQL:

* [`PREPARE`](prepare.html "13.5.1 Instrução PREPARE") prepara uma instrução para execução (consulte [Seção 13.5.1, “Instrução PREPARE”](prepare.html "13.5.1 Instrução PREPARE")).

* [`EXECUTE`](execute.html "13.5.2 Instrução EXECUTE") executa um prepared statement (consulte [Seção 13.5.2, “Instrução EXECUTE”](execute.html "13.5.2 Instrução EXECUTE")).

* [`DEALLOCATE PREPARE`](deallocate-prepare.html "13.5.3 Instrução DEALLOCATE PREPARE") libera um prepared statement (consulte [Seção 13.5.3, “Instrução DEALLOCATE PREPARE”](deallocate-prepare.html "13.5.3 Instrução DEALLOCATE PREPARE")).

Os exemplos a seguir mostram duas maneiras equivalentes de preparar uma instrução que calcula a hipotenusa de um triângulo, dadas as medidas dos dois lados.

O primeiro exemplo mostra como criar um prepared statement usando um literal de *string* para fornecer o texto da instrução:

```sql
mysql> PREPARE stmt1 FROM 'SELECT SQRT(POW(?,2) + POW(?,2)) AS hypotenuse';
mysql> SET @a = 3;
mysql> SET @b = 4;
mysql> EXECUTE stmt1 USING @a, @b;
+------------+
| hypotenuse |
+------------+
|          5 |
+------------+
mysql> DEALLOCATE PREPARE stmt1;
```

O segundo exemplo é semelhante, mas fornece o texto da instrução como uma variável de usuário:

```sql
mysql> SET @s = 'SELECT SQRT(POW(?,2) + POW(?,2)) AS hypotenuse';
mysql> PREPARE stmt2 FROM @s;
mysql> SET @a = 6;
mysql> SET @b = 8;
mysql> EXECUTE stmt2 USING @a, @b;
+------------+
| hypotenuse |
+------------+
|         10 |
+------------+
mysql> DEALLOCATE PREPARE stmt2;
```

Aqui está um exemplo adicional que demonstra como escolher a table na qual realizar uma Query em tempo de execução, armazenando o nome da table como uma variável de usuário:

```sql
mysql> USE test;
mysql> CREATE TABLE t1 (a INT NOT NULL);
mysql> INSERT INTO t1 VALUES (4), (8), (11), (32), (80);

mysql> SET @table = 't1';
mysql> SET @s = CONCAT('SELECT * FROM ', @table);

mysql> PREPARE stmt3 FROM @s;
mysql> EXECUTE stmt3;
+----+
| a  |
+----+
|  4 |
|  8 |
| 11 |
| 32 |
| 80 |
+----+

mysql> DEALLOCATE PREPARE stmt3;
```

Um prepared statement é específico para a sessão na qual foi criado. Se você encerrar uma sessão sem desalocar um prepared statement previamente, o servidor o desaloca automaticamente.

Um prepared statement também é global para a sessão. Se você criar um prepared statement dentro de uma stored routine, ele não será desalocado quando a stored routine terminar.

Para se proteger contra a criação simultânea de muitos prepared statements, defina a variável de sistema [`max_prepared_stmt_count`](server-system-variables.html#sysvar_max_prepared_stmt_count). Para impedir o uso de prepared statements, defina o valor como 0.

### Sintaxe SQL Permitida em Prepared Statements

As seguintes instruções SQL podem ser usadas como prepared statements:

```sql
ALTER TABLE
ALTER USER
ANALYZE TABLE
CACHE INDEX
CALL
CHANGE MASTER
CHECKSUM {TABLE | TABLES}
COMMIT
{CREATE | DROP} INDEX
{CREATE | RENAME | DROP} DATABASE
{CREATE | DROP} TABLE
{CREATE | RENAME | DROP} USER
{CREATE | DROP} VIEW
DELETE
DO
FLUSH {TABLE | TABLES | TABLES WITH READ LOCK | HOSTS | PRIVILEGES
  | LOGS | STATUS | MASTER | SLAVE | DES_KEY_FILE | USER_RESOURCES}
GRANT
INSERT
INSTALL PLUGIN
KILL
LOAD INDEX INTO CACHE
OPTIMIZE TABLE
RENAME TABLE
REPAIR TABLE
REPLACE
RESET {MASTER | SLAVE | QUERY CACHE}
REVOKE
SELECT
SET
SHOW BINLOG EVENTS
SHOW CREATE {PROCEDURE | FUNCTION | EVENT | TABLE | VIEW}
SHOW {MASTER | BINARY} LOGS
SHOW {MASTER | SLAVE} STATUS
SLAVE {START | STOP}
TRUNCATE TABLE
UNINSTALL PLUGIN
UPDATE
```

Outras instruções não são suportadas.

Para conformidade com o padrão SQL, que afirma que instruções de diagnóstico não são preparáveis, o MySQL não suporta o seguinte como prepared statements:

* `SHOW WARNINGS`, `SHOW COUNT(*) WARNINGS`

* `SHOW ERRORS`, `SHOW COUNT(*) ERRORS`

* Instruções que contenham qualquer referência à variável de sistema [`warning_count`](server-system-variables.html#sysvar_warning_count) ou [`error_count`](server-system-variables.html#sysvar_error_count).

Geralmente, instruções não permitidas em prepared statements SQL também não são permitidas em stored programs. As exceções são observadas na [Seção 23.8, “Restrições em Stored Programs”](stored-program-restrictions.html "23.8 Restrições em Stored Programs").

Alterações de metadados em tables ou views referenciadas por prepared statements são detectadas e causam a repreparação automática da instrução na próxima vez em que ela for executada. Para mais informações, consulte [Seção 8.10.4, “Caching de Prepared Statements e Stored Programs”](statement-caching.html "8.10.4 Caching de Prepared Statements e Stored Programs").

Placeholders podem ser usados para os argumentos da cláusula `LIMIT` ao usar prepared statements. Consulte [Seção 13.2.9, “Instrução SELECT”](select.html "13.2.9 Instrução SELECT").

Em instruções [`CALL`](call.html "13.2.1 Instrução CALL") preparadas e usadas com [`PREPARE`](prepare.html "13.5.1 Instrução PREPARE") e [`EXECUTE`](execute.html "13.5.2 Instrução EXECUTE"), o suporte a placeholder para parâmetros `OUT` e `INOUT` está disponível a partir do MySQL 5.7. Consulte [Seção 13.2.1, “Instrução CALL”](call.html "13.2.1 Instrução CALL"), para um exemplo e uma solução alternativa para versões anteriores. Placeholders podem ser usados para parâmetros `IN` independentemente da versão.

A sintaxe SQL para prepared statements não pode ser usada de forma aninhada (*nested*). Ou seja, uma instrução passada para [`PREPARE`](prepare.html "13.5.1 Instrução PREPARE") não pode ser ela mesma uma instrução [`PREPARE`](prepare.html "13.5.1 Instrução PREPARE"), [`EXECUTE`](execute.html "13.5.2 Instrução EXECUTE") ou [`DEALLOCATE PREPARE`](deallocate-prepare.html "13.5.3 Instrução DEALLOCATE PREPARE").

A sintaxe SQL para prepared statements é distinta do uso de chamadas de API de prepared statement. Por exemplo, você não pode usar a função C API [`mysql_stmt_prepare()`](/doc/c-api/5.7/en/mysql-stmt-prepare.html) para preparar uma instrução [`PREPARE`](prepare.html "13.5.1 Instrução PREPARE"), [`EXECUTE`](execute.html "13.5.2 Instrução EXECUTE") ou [`DEALLOCATE PREPARE`](deallocate-prepare.html "13.5.3 Instrução DEALLOCATE PREPARE").

A sintaxe SQL para prepared statements pode ser usada dentro de stored procedures, mas não em stored functions ou triggers. No entanto, um cursor não pode ser usado para uma instrução dinâmica que é preparada e executada com [`PREPARE`](prepare.html "13.5.1 Instrução PREPARE") e [`EXECUTE`](execute.html "13.5.2 Instrução EXECUTE"). A instrução para um cursor é verificada no momento da criação do cursor, portanto, a instrução não pode ser dinâmica.

A sintaxe SQL para prepared statements não suporta *multi-statements* (isto é, múltiplas instruções dentro de uma única string separadas por caracteres `;`).

Prepared statements usam o query cache sob as condições descritas na [Seção 8.10.3.1, “Como o Query Cache Opera”](query-cache-operation.html "8.10.3.1 Como o Query Cache Opera").

Para escrever programas C que usam a instrução SQL [`CALL`](call.html "13.2.1 Instrução CALL") para executar stored procedures que contêm prepared statements, o *flag* `CLIENT_MULTI_RESULTS` deve estar habilitado. Isso ocorre porque cada [`CALL`](call.html "13.2.1 Instrução CALL") retorna um resultado para indicar o status da chamada, além de quaisquer result sets que possam ser retornados por instruções executadas dentro da procedure.

`CLIENT_MULTI_RESULTS` pode ser habilitado ao chamar [`mysql_real_connect()`](/doc/c-api/5.7/en/mysql-real-connect.html), seja explicitamente passando o próprio flag `CLIENT_MULTI_RESULTS`, ou implicitamente passando `CLIENT_MULTI_STATEMENTS` (o que também habilita `CLIENT_MULTI_RESULTS`). Para informações adicionais, consulte [Seção 13.2.1, “Instrução CALL”](call.html "13.2.1 Instrução CALL").