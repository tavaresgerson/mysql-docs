## 15.5 Declarações Preparadas

15.5.1 Declaração PREPARE

15.5.2 Declaração EXECUTE

15.5.3 Declaração DEALLOCATE PREPARE

O MySQL 9.5 oferece suporte para declarações preparadas no lado do servidor. Esse suporte aproveita o protocolo binário eficiente entre cliente e servidor. O uso de declarações preparadas com marcadores para valores de parâmetros oferece os seguintes benefícios:

* Menos overhead para a análise da declaração cada vez que ela é executada. Tipicamente, as aplicações de banco de dados processam grandes volumes de declarações quase idênticas, com apenas alterações nos valores literais ou variáveis em cláusulas como `WHERE` para consultas e exclusões, `SET` para atualizações e `VALUES` para inserções.

* Proteção contra ataques de injeção SQL. Os valores dos parâmetros podem conter caracteres de delimitador e citação SQL não escapados.

As seções a seguir fornecem uma visão geral das características das declarações preparadas:

* Declarações Preparadas em Programas de Aplicação
* Declarações Preparadas em Scripts SQL
* Declarações PREPARE, EXECUTE e DEALLOCATE PREPARE
* Sintaxe SQL Permitida em Declarações Preparadas

### Declarações Preparadas em Programas de Aplicação

Você pode usar declarações preparadas no lado do servidor por meio de interfaces de programação cliente, incluindo a biblioteca de clientes da API C para programas em C, MySQL Connector/J para programas em Java e MySQL Connector/NET para programas que utilizam tecnologias .NET. Por exemplo, a API C fornece um conjunto de chamadas de função que compõem sua API de declaração preparada. Veja a Interface de Declaração Preparada da API C. Outras interfaces de linguagem podem fornecer suporte para declarações preparadas que utilizam o protocolo binário ao vincular a biblioteca de clientes C, um exemplo sendo a extensão `mysqli`, disponível no PHP 5.0 e posterior.

### Declarações Preparadas em Scripts SQL

Uma interface alternativa para SQL com instruções preparadas está disponível. Essa interface não é tão eficiente quanto usar o protocolo binário por meio de uma API de instruções preparadas, mas não requer programação, pois está disponível diretamente no nível SQL:

* Você pode usá-la quando não houver uma interface de programação disponível.

* Você pode usá-la a partir de qualquer programa que possa enviar instruções SQL para serem executadas, como o programa cliente **mysql**.

* Você pode usá-la mesmo se o cliente estiver usando uma versão antiga da biblioteca de clientes.

A sintaxe SQL para instruções preparadas é destinada a ser usada em situações como essas:

* Para testar como as instruções preparadas funcionam em sua aplicação antes de codificá-las.

* Para usar instruções preparadas quando não houver acesso a uma API de programação que as suporte.

* Para solucionar problemas de aplicativo de forma interativa com instruções preparadas.

* Para criar um caso de teste que reproduza um problema com instruções preparadas, para que você possa enviar um relatório de erro.

### Instruções PREPARE, EXECUTE e DEALLOCATE

A sintaxe SQL para instruções preparadas é baseada em três instruções SQL:

* `PREPARE` prepara uma instrução para execução (veja Seção 15.5.1, “Instrução PREPARE”).

* `EXECUTE` executa uma instrução preparada (veja Seção 15.5.2, “Instrução EXECUTE”).

* `DEALLOCATE PREPARE` libera uma instrução preparada (veja Seção 15.5.3, “Instrução DEALLOCATE PREPARE”).

Os seguintes exemplos mostram duas maneiras equivalentes de preparar uma instrução que calcula a hipotenusa de um triângulo dados os comprimentos dos dois lados.

O primeiro exemplo mostra como criar uma instrução preparada usando uma literal de string para fornecer o texto da instrução:

```
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

```
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

Aqui está um exemplo adicional que demonstra como escolher a tabela em que realizar uma consulta em tempo de execução, armazenando o nome da tabela como uma variável de usuário:

```
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

Uma declaração preparada é específica para a sessão em que foi criada. Se você encerrar uma sessão sem liberar uma declaração preparada anteriormente, o servidor a libera automaticamente.

Uma declaração preparada também é global para a sessão. Se você criar uma declaração preparada dentro de uma rotina armazenada, ela não é liberada quando a rotina armazenada termina.

Para evitar que muitas declarações preparadas sejam criadas simultaneamente, defina a variável de sistema `max_prepared_stmt_count`. Para impedir o uso de declarações preparadas, defina o valor para 0.

### Sintaxe SQL Permitida em Declarações Preparadas

Os seguintes comandos SQL podem ser usados como declarações preparadas:

```
ALTER {INSTANCE | TABLE | USER}
ANALYZE
CALL
CHANGE {REPLICATION SOURCE TO | REPLICATION FILTER}
CHECKSUM
COMMIT
{CREATE | DROP} INDEX
{CREATE | DROP | RENAME} DATABASE
{CREATE | DROP | RENAME} TABLE
{CREATE | DROP | RENAME} USER
DEALLOCATE PREPARE
DROP VIEW
DELETE
DO
EXECUTE
FLUSH
GRANT {ROLE}
INSERT
INSTALL PLUGIN
KILL
OPTIMIZE
PREPARE
REPAIR TABLE
REPLACE
REPLICA {START | STOP}
RESET
REVOKE {ALL | ROLE}
SELECT
SET ROLE
SHOW {BINLOG EVENTS | BINARY LOGS | BINARY LOG STATUS | CHARACTER SETS | COLLATIONS | DATABASES | ENGINES |
      ERRORS | EVENTS | FIELDS | FUNCTION CODE | FUNCTION STATUS | GRANTS | KEYS | OPEN TABLES |
      PLUGINS | PRIVILEGES | PROCEDURE CODE | PROCEDURE STATUS | PROCESSLIST | PROFILE | PROFILES |
      RELAYLOG EVENTS | REPLICAS | REPLICA STATUS | STATUS | PROCEDURE STATUS | TABLE STATUS | TABLES |
      TRIGGERS | VARIABLES | WARNINGS}
SHOW CREATE { DATABASE | EVENT | FUNCTION | PROCEDURE | TABLE | TRIGGER | USER | VIEW}
TRUNCATE
UNINSTALL PLUGIN
UPDATE
```

Nota

`CREATE TABLE ... START TRANSACTION` não é suportada em declarações preparadas.

Outros comandos não são suportados.

Para conformidade com o padrão SQL, que afirma que os comandos de diagnóstico não são preparáveis, o MySQL não suporta o seguinte como declarações preparadas:

* `SHOW COUNT(*) WARNINGS`
* `SHOW COUNT(*) ERRORS`
* Comandos que contenham qualquer referência à variável de sistema `warning_count` ou `error_count`.

Geralmente, comandos não permitidos em declarações preparadas SQL também não são permitidos em programas armazenados. Exceções são mencionadas na Seção 27.10, “Restrições em Programas Armazenados”.

Alterações de metadados em tabelas ou visualizações referenciadas por declarações preparadas são detectadas e causam a reparação automática da declaração quando ela é executada novamente. Para mais informações, consulte a Seção 10.10.3, “Cache de Declarações Preparadas e Programas Armazenados”.

Os marcadores podem ser usados para os argumentos da cláusula `LIMIT` ao usar instruções preparadas. Veja a Seção 15.2.13, “Instrução SELECT”.

Os marcadores não são suportados em instruções preparadas que contêm DDL de evento. Tentar usar um marcador em tal instrução é rejeitado por `PREPARE` com o ERRO 6413 (HY000): Parâmetros dinâmicos só podem ser usados em instruções DML. Em vez disso, você pode fazer isso de forma reutilizável ao montar o texto contendo o SQL de evento no corpo de um procedimento armazenado, passando quaisquer partes variáveis do SQL como parâmetros `IN` para o procedimento armazenado; então você pode preparar o texto montado com uma instrução `PREPARE` (também dentro do corpo do procedimento armazenado), então invocar o procedimento usando os valores de parâmetro desejados. Veja a Seção 15.1.15, “Instrução CREATE EVENT”, para um exemplo.

Em instruções `CALL` preparadas usadas com `PREPARE` e `EXECUTE`, o suporte para marcadores de parâmetros `OUT` e `INOUT` está disponível a partir do MySQL 9.5. Veja a Seção 15.2.1, “Instrução CALL”, para um exemplo e uma solução para versões anteriores. Os marcadores podem ser usados para parâmetros `IN`, independentemente da versão.

A sintaxe SQL para instruções preparadas não pode ser usada de forma aninhada. Ou seja, uma instrução passada para `PREPARE` não pode ser ela mesma uma instrução `PREPARE`, `EXECUTE` ou `DEALLOCATE PREPARE`.

A sintaxe SQL para instruções preparadas é distinta do uso de chamadas de API de instruções preparadas. Por exemplo, você não pode usar a função C `mysql_stmt_prepare()` para preparar uma instrução `PREPARE`, `EXECUTE` ou `DEALLOCATE PREPARE`.

A sintaxe SQL para instruções preparadas pode ser usada dentro de procedimentos armazenados, mas não em funções armazenadas ou gatilhos. No entanto, um cursor não pode ser usado para uma declaração dinâmica que é preparada e executada com `PREPARE` e `EXECUTE`. A declaração para um cursor é verificada no momento da criação do cursor, portanto, a declaração não pode ser dinâmica.

A sintaxe SQL para instruções preparadas não suporta múltiplas declarações (ou seja, múltiplas declarações dentro de uma única string separadas por caracteres `;`).

Para escrever programas em C que usam a instrução `CALL` SQL para executar procedimentos armazenados que contêm instruções preparadas, a bandeira `CLIENT_MULTI_RESULTS` deve ser habilitada. Isso ocorre porque cada `CALL` retorna um resultado para indicar o status da chamada, além de quaisquer conjuntos de resultados que possam ser retornados por declarações executadas dentro do procedimento.

`CLIENT_MULTI_RESULTS` pode ser habilitado ao chamar `mysql_real_connect()`, seja explicitamente passando a própria bandeira `CLIENT_MULTI_RESULTS`, ou implicitamente passando `CLIENT_MULTI_STATEMENTS` (que também habilita `CLIENT_MULTI_RESULTS`). Para obter informações adicionais, consulte a Seção 15.2.1, “Instrução CALL”.