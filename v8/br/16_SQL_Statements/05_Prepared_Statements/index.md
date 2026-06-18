## 15.5 Declarações Preparadas

15.5.1 Declaração PREPARE

15.5.2 Declaração EXECUTE

15.5.3 DECOMMISSIONAR PREPARAR a declaração

O MySQL 8.0 oferece suporte a instruções preparadas no lado do servidor. Esse suporte aproveita o protocolo binário eficiente cliente/servidor. O uso de instruções preparadas com marcadores para valores de parâmetros oferece os seguintes benefícios:

- Menos overhead para a análise da declaração cada vez que ela é executada. Tipicamente, as aplicações de banco de dados processam grandes volumes de declarações quase idênticas, com apenas alterações nos valores literais ou variáveis em cláusulas como `WHERE` para consultas e exclusões, `SET` para atualizações e `VALUES` para inserções.

- Proteção contra ataques de injeção SQL. Os valores dos parâmetros podem conter caracteres de delimitador e citação SQL não escapados.

As seções a seguir fornecem uma visão geral das características das declarações preparadas:

- Declarações preparadas em programas de aplicação
- Declarações preparadas em scripts SQL
- PREPARAR, EXECUTAR e DESLOCAR DADOS PREPARAR DADOS Statement
  Portuguese (Brazilian): DADOS Statement
- Sintaxe SQL permitida em declarações preparadas

### Declarações preparadas em programas de aplicação

Você pode usar instruções preparadas no lado do servidor por meio de interfaces de programação do cliente, incluindo a biblioteca de clientes da API C MySQL para programas em C, o MySQL Connector/J para programas em Java e o MySQL Connector/NET para programas que utilizam tecnologias .NET. Por exemplo, a API C fornece um conjunto de chamadas de função que compõem sua API de instruções preparadas. Veja a Interface de Instrução Preparada da API C. Outras interfaces de linguagem podem fornecer suporte para instruções preparadas que utilizam o protocolo binário, vinculando a biblioteca de clientes C, um exemplo sendo a extensão `mysqli`, disponível no PHP 5.0 e superior.

### Declarações preparadas em scripts SQL

Uma interface alternativa para SQL de instruções preparadas está disponível. Essa interface não é tão eficiente quanto o uso do protocolo binário através de uma API de instruções preparadas, mas não requer programação, pois está disponível diretamente no nível SQL:

- Você pode usá-lo quando não houver uma interface de programação disponível para você.

- Você pode usá-lo a partir de qualquer programa que possa enviar instruções SQL para o servidor a ser executado, como o programa cliente **mysql**.

- Você pode usá-lo mesmo se o cliente estiver usando uma versão antiga da biblioteca do cliente.

A sintaxe SQL para instruções preparadas é destinada a ser usada em situações como essas:

- Para testar como as declarações preparadas funcionam em sua aplicação antes de codificá-las.

- Para usar declarações preparadas quando você não tem acesso a uma API de programação que as suporte.

- Para solucionar problemas de aplicativo de forma interativa com instruções preparadas.

- Para criar um caso de teste que reproduza um problema com declarações preparadas, para que você possa enviar um relatório de erro.

### PREPARAR, EXECUTAR e DESLOCAR DADOS PREPARAR DADOS Statement&#xA;Portuguese (Brazilian): DADOS Statement

A sintaxe SQL para instruções preparadas é baseada em três instruções SQL:

- `PREPARE` prepara uma declaração para execução (consulte a Seção 15.5.1, “Declaração PREPARE”).

- `EXECUTE` executa uma instrução preparada (consulte a Seção 15.5.2, “Instrução EXECUTE”).

- `DEALLOCATE PREPARE` emite uma declaração preparada (consulte a Seção 15.5.3, “Declaração DEALLOCATE PREPARE”).

Os exemplos a seguir mostram duas maneiras equivalentes de preparar uma declaração que calcula a hipotenusa de um triângulo, dados os comprimentos dos dois lados.

O primeiro exemplo mostra como criar uma declaração preparada usando uma literal de string para fornecer o texto da declaração:

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

O segundo exemplo é semelhante, mas fornece o texto da declaração como uma variável do usuário:

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

Uma declaração preparada também é global para a sessão. Se você criar uma declaração preparada dentro de uma rotina armazenada, ela não é realocada quando a rotina armazenada termina.

Para evitar que muitas declarações preparadas sejam criadas simultaneamente, defina a variável de sistema `max_prepared_stmt_count`. Para impedir o uso de declarações preparadas, defina o valor para 0.

### Sintaxe SQL permitida em declarações preparadas

As seguintes instruções SQL podem ser usadas como instruções preparadas:

```
ALTER TABLE
ALTER USER {DEFAULT ROLE}
ANALYZE TABLE
CACHE INDEX
CALL
CHANGE {MASTER | REPLICATION FILTER}
CHECKSUM
COMMIT
{CREATE | DROP} INDEX
{CREATE | RENAME | DROP} DATABASE
{CREATE | DROP} TABLE
{CREATE | RENAME | DROP} USER
{CREATE | DROP} VIEW
DELETE
DO
FLUSH
GRANT {ROLE}
INSERT
INSERT ... SELECT
INSTALL PLUGIN
KILL
LOAD INDEX INTO CACHE
OPTIMIZE TABLE
RENAME TABLE
REPAIR TABLE
REPLACE
RESET {MASTER | REPLICA}
REVOKE {ALL | ROLE}
SELECT
SET {PASSWORD | RESOURCE GROUP | ROLE | VARIABLE}
SHOW {BINLOG EVENTS | BINARY LOGS | CHARACTER SETS | COLLATIONS | DATABASES | ENGINE |
      ERRORS | EVENTS | FIELDS | FUNCTION CODE | FUNCTION STATUS | GRANTS | KEYS | OPEN TABLES |
      PLUGINS | PRIVILEGES | PROCEDURE CODE | PROCEDURE STATUS | PROCESSLIST | PROFILE | PROFILES |
      RELAYLOG EVENTS | REPLICAS | REPLICA STATUS | STATUS | PROCEDURE STATUS | TABLE STATUS | TABLES |
      TRIGGERS | VARIABLES | WARNINGS}
SHOW CREATE { DATABASE | EVENT | FUNCTION | PROCEDURE | TABLE | TRIGGER | USER | VIEW}
REPLICA {START | STOP}
TRUNCATE
UNINSTALL PLUGIN
UPDATE
```

Outras declarações não são apoiadas.

Para conformidade com o padrão SQL, que afirma que as declarações de diagnóstico não podem ser preparadas, o MySQL não suporta o seguinte como declarações preparadas:

- `SHOW WARNINGS`, `SHOW COUNT(*) WARNINGS`

- `SHOW ERRORS`, `SHOW COUNT(*) ERRORS`

- Declarações que contenham qualquer referência à variável de sistema `warning_count` ou `error_count`.

De modo geral, as declarações que não são permitidas em instruções preparadas do SQL também não são permitidas em programas armazenados. As exceções são mencionadas na Seção 27.8, “Restrições em Programas Armazenados”.

Alterações nos metadados das tabelas ou visualizações referenciadas por declarações preparadas são detectadas e causam a reparação automática da declaração quando ela for executada novamente. Para mais informações, consulte a Seção 10.10.3, “Cache de Declarações Preparadas e Programas Armazenados”.

Os marcadores podem ser usados para os argumentos da cláusula `LIMIT` ao usar instruções preparadas. Veja a Seção 15.2.13, “Instrução SELECT”.

Em declarações preparadas `CALL` usadas com `PREPARE` e `EXECUTE`, o suporte de substitutos para os parâmetros `OUT` e `INOUT` está disponível a partir do MySQL 8.0. Veja a Seção 15.2.1, “Instrução CALL”, para um exemplo e uma solução para versões anteriores. Os substitutos podem ser usados para os parâmetros `IN`, independentemente da versão.

A sintaxe SQL para declarações preparadas não pode ser usada de forma aninhada. Ou seja, uma declaração passada para `PREPARE` não pode ser, por si só, uma declaração `PREPARE`, `EXECUTE` ou `DEALLOCATE PREPARE`.

A sintaxe SQL para instruções preparadas é distinta do uso de chamadas de API de instruções preparadas. Por exemplo, você não pode usar a função `mysql_stmt_prepare()` da API C para preparar uma instrução `PREPARE`, `EXECUTE` ou `DEALLOCATE PREPARE`.

A sintaxe SQL para declarações preparadas pode ser usada dentro de procedimentos armazenados, mas não em funções armazenadas ou gatilhos. No entanto, um cursor não pode ser usado para uma declaração dinâmica que é preparada e executada com `PREPARE` e `EXECUTE`. A declaração para um cursor é verificada no momento da criação do cursor, então a declaração não pode ser dinâmica.

A sintaxe SQL para instruções preparadas não suporta múltiplas instruções (ou seja, várias instruções dentro de uma única string separadas por caracteres `;`).

Para escrever programas em C que utilizam a instrução SQL `CALL` para executar procedimentos armazenados que contêm instruções preparadas, a bandeira `CLIENT_MULTI_RESULTS` deve ser habilitada. Isso ocorre porque cada `CALL` retorna um resultado para indicar o status da chamada, além de quaisquer conjuntos de resultados que possam ser retornados por instruções executadas dentro do procedimento.

`CLIENT_MULTI_RESULTS` pode ser habilitado quando você chama `mysql_real_connect()`, seja explicitamente passando a própria bandeira `CLIENT_MULTI_RESULTS`, ou implicitamente passando `CLIENT_MULTI_STATEMENTS` (que também habilita `CLIENT_MULTI_RESULTS`). Para informações adicionais, consulte a Seção 15.2.1, “Instrução CALL”.
