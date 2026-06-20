## 13.5 Declarações Preparadas

O MySQL 5.7 oferece suporte a declarações preparadas no lado do servidor. Esse suporte aproveita o protocolo binário eficiente cliente/servidor. Usar declarações preparadas com marcadores para valores de parâmetros tem os seguintes benefícios:

* Menos overhead para a análise da declaração cada vez que ela é executada. Tipicamente, as aplicações de banco de dados processam grandes volumes de declarações quase idênticas, com apenas mudanças nos valores literais ou variáveis em cláusulas como `WHERE` para consultas e exclusões, `SET` para atualizações e `VALUES` para inserções.

* Proteção contra ataques de injeção SQL. Os valores dos parâmetros podem conter caracteres de citação e delimitadores SQL não escapados.

As seções a seguir fornecem uma visão geral das características das declarações preparadas:

* Declarações preparadas em programas de aplicação * Declarações preparadas em scripts SQL * Declarações PREPARE, EXECUTE e DEALLOCATE PREPARE * Sintaxe SQL permitida em declarações preparadas

### Declarações preparadas em programas de aplicação

Você pode usar instruções preparadas do lado do servidor por meio de interfaces de programação do cliente, incluindo a biblioteca de clientes da API C MySQL para programas em C, MySQL Connector/J para programas em Java e MySQL Connector/NET para programas que utilizam tecnologias .NET. Por exemplo, a API C oferece um conjunto de chamadas de função que compõem sua API de instruções preparadas. Veja a Interface de Instrução Preparada da API C. Outras interfaces de linguagem podem oferecer suporte para instruções preparadas que utilizam o protocolo binário, vinculando a biblioteca de clientes C, um exemplo sendo a extensão `mysqli`, disponível no PHP 5.0 e superior.

### Declarações preparadas em scripts SQL

Uma interface SQL alternativa para declarações preparadas está disponível. Essa interface não é tão eficiente quanto usar o protocolo binário através de uma API de declaração preparada, mas não requer programação, pois está disponível diretamente no nível SQL:

* Você pode usá-lo quando não há uma interface de programação disponível para você.

* Você pode usá-lo a partir de qualquer programa que possa enviar instruções SQL para o servidor a ser executado, como o programa cliente **mysql**.

* Você pode usá-lo mesmo se o cliente estiver usando uma versão antiga da biblioteca do cliente.

A sintaxe SQL para declarações preparadas é destinada a ser usada em situações como essas:

* Para testar como as declarações preparadas funcionam em sua aplicação antes de codificá-la.

* Para usar declarações preparadas quando você não tem acesso a uma API de programação que as suporte.

* Para solucionar problemas de aplicação de forma interativa com declarações preparadas.

* Para criar um caso de teste que reproduza um problema com declarações preparadas, para que você possa fazer um relatório de erro.

### PREPARAR, EXECUTAR e DESLOCAR AFIRMAS PREPARAR

A sintaxe SQL para declarações preparadas é baseada em três instruções SQL:

* `PREPARE` prepara uma declaração para execução (consulte a Seção 13.5.1, “Declaração PREPARE”).

* `EXECUTE` executa uma declaração preparada (consulte a Seção 13.5.2, “Declaração EXECUTE”).

* `DEALLOCATE PREPARE` emite uma declaração preparada (consulte a Seção 13.5.3, “DEALLOCATE PREPARE Statement”).

Os exemplos a seguir mostram duas maneiras equivalentes de preparar uma declaração que calcula a hipotenusa de um triângulo, dados os comprimentos dos dois lados.

O primeiro exemplo mostra como criar uma declaração preparada usando uma literal de string para fornecer o texto da declaração:

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

O segundo exemplo é semelhante, mas fornece o texto da declaração como uma variável do usuário:

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

Aqui está um exemplo adicional que demonstra como escolher a tabela na qual realizar uma consulta em tempo de execução, armazenando o nome da tabela como uma variável do usuário:

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

Uma declaração preparada é específica para a sessão na qual foi criada. Se você encerrar uma sessão sem liberar uma declaração preparada anteriormente, o servidor a libera automaticamente.

Uma declaração preparada também é global para a sessão. Se você criar uma declaração preparada dentro de uma rotina armazenada, ela não é realocada quando a rotina armazenada termina.

Para evitar que muitas declarações preparadas sejam criadas simultaneamente, defina a variável de sistema `max_prepared_stmt_count`. Para impedir o uso de declarações preparadas, defina o valor para 0.

### Sintaxe SQL Permitida em Declarações Preparadas

Os seguintes comandos SQL podem ser usados como comandos preparados:

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

Outras declarações não são suportadas.

Para conformidade com o padrão SQL, que afirma que as declarações de diagnóstico não são preparáveis, o MySQL não suporta o seguinte como declarações preparadas:

* `SHOW WARNINGS`, `SHOW COUNT(*) WARNINGS`

* `SHOW ERRORS`, `SHOW COUNT(*) ERRORS`

* Declarações que contenham qualquer referência à variável de sistema `warning_count` ou `error_count`.

De modo geral, as declarações que não são permitidas em declarações preparadas do SQL também não são permitidas em programas armazenados. As exceções são mencionadas na Seção 23.8, “Restrições em programas armazenados”.

Alterações de metadados em tabelas ou visualizações referenciadas por declarações preparadas são detectadas e causam a reparação automática da declaração quando executada novamente. Para mais informações, consulte a Seção 8.10.4, “Cache de declarações preparadas e programas armazenados”.

Os marcadores podem ser usados para os argumentos da cláusula `LIMIT` ao usar declarações preparadas. Veja a Seção 13.2.9, “Declaração SELECT”.

Nas declarações preparadas `CALL` usadas com `PREPARE` e `EXECUTE`, o suporte de marcador para os parâmetros `OUT` e `INOUT` está disponível a partir do MySQL 5.7. Consulte a Seção 13.2.1, “Declaração CALL”, para um exemplo e uma solução para versões anteriores. Os marcadores podem ser usados para os parâmetros `IN`, independentemente da versão.

A sintaxe SQL para declarações preparadas não pode ser usada de forma aninhada. Isso significa que uma declaração passada para `PREPARE` não pode ser, por si só, uma declaração de `PREPARE`, `EXECUTE` ou `DEALLOCATE PREPARE`.

A sintaxe SQL para declarações preparadas é distinta da utilização de chamadas de API de declarações preparadas. Por exemplo, você não pode usar a função C API `mysql_stmt_prepare()` para preparar uma declaração `PREPARE`, `EXECUTE` ou `DEALLOCATE PREPARE`.

A sintaxe SQL para declarações preparadas pode ser usada em procedimentos armazenados, mas não em funções armazenadas ou gatilhos. No entanto, um cursor não pode ser usado para uma declaração dinâmica que é preparada e executada com `PREPARE` e `EXECUTE`. A declaração para um cursor é verificada no momento da criação do cursor, então a declaração não pode ser dinâmica.

A sintaxe SQL para declarações preparadas não suporta múltiplas declarações (ou seja, múltiplas declarações dentro de uma única cadeia de caracteres separadas por caracteres `;`).

As declarações preparadas utilizam o cache de consulta nas condições descritas na Seção 8.10.3.1, “Como o cache de consulta funciona”.

Para escrever programas em C que utilizam a instrução SQL `CALL` para executar procedimentos armazenados que contêm instruções preparadas, a bandeira `CLIENT_MULTI_RESULTS` deve ser habilitada. Isso ocorre porque cada `CALL` retorna um resultado para indicar o status da chamada, além de quaisquer conjuntos de resultados que possam ser retornados por instruções executadas dentro do procedimento.

`CLIENT_MULTI_RESULTS` pode ser habilitado quando você chama `mysql_real_connect()`, explicitamente passando a própria bandeira `CLIENT_MULTI_RESULTS`, ou implicitamente passando `CLIENT_MULTI_STATEMENTS` (que também habilita `CLIENT_MULTI_RESULTS`). Para informações adicionais, consulte a Seção 13.2.1, “Instrução CALL”.

### 13.5.1 Declaração PREPARE

```sql
PREPARE stmt_name FROM preparable_stmt
```

A declaração `PREPARE` prepara uma declaração SQL e atribui a ela um nome, *`stmt_name`*, pelo qual se referirá à declaração mais tarde. A declaração preparada é executada com `EXECUTE` e liberada com `DEALLOCATE PREPARE`. Para exemplos, consulte a Seção 13.5, “Declarações Preparadas”.

Os nomes dos nomes de declaração não são sensíveis ao caso. *`preparable_stmt`* é uma literal de cadeia de caracteres ou uma variável do usuário que contém o texto da declaração SQL. O texto deve representar uma única declaração, não várias declarações. Dentro da declaração, os caracteres `?` podem ser usados como marcadores de parâmetro para indicar onde os valores dos dados devem ser vinculados à consulta posteriormente, quando você executá-la. Os caracteres `?` não devem ser fechados entre aspas, mesmo que você pretenda vinculá-los a valores de cadeia de caracteres. Os marcadores de parâmetro podem ser usados apenas onde os valores dos dados devem aparecer, não para palavras-chave SQL, identificadores, etc.

Se uma declaração preparada com o nome dado já existir, ela é desalocada implicitamente antes de a nova declaração ser preparada. Isso significa que, se a nova declaração contiver um erro e não puder ser preparada, um erro é retornado e nenhuma declaração com o nome dado existe.

O escopo de uma declaração preparada é a sessão na qual ela é criada, o que tem várias implicações:

* Uma declaração preparada criada em uma sessão não está disponível para outras sessões.

* Quando uma sessão termina, seja de forma normal ou anormal, suas declarações preparadas não existem mais. Se o auto-reconexão estiver habilitado, o cliente não é notificado de que a conexão foi perdida. Por esse motivo, os clientes podem desejar desativar o auto-reconexão. Veja o Controle de Reconexão Automática.

* Uma declaração preparada criada dentro de um programa armazenado continua a existir após o programa terminar de ser executado e pode ser executada fora do programa posteriormente.

* Uma declaração preparada em contexto de programa armazenado não pode se referir a parâmetros de procedimento ou função armazenada ou variáveis locais, porque elas deixam de estar no escopo quando o programa termina e não estariam disponíveis se a declaração fosse executada posteriormente fora do programa. Como uma solução alternativa, consulte em vez disso as variáveis definidas pelo usuário, que também têm escopo de sessão; veja Seção 9.4, “Variáveis Definidas pelo Usuário”.

### 13.5.2 Instrução EXECUTE

```sql
EXECUTE stmt_name
    [USING @var_name [, @var_name] ...]
```

Após preparar uma declaração com `PREPARE`, você a executa com uma declaração `EXECUTE` que se refere ao nome da declaração preparada. Se a declaração preparada contiver quaisquer marcadores de parâmetro, você deve fornecer uma cláusula `USING` que lista as variáveis do usuário que contêm os valores que serão vinculados aos parâmetros. Os valores dos parâmetros podem ser fornecidos apenas por variáveis do usuário, e a cláusula `USING` deve nomear exatamente tantas variáveis quanto o número de marcadores de parâmetro na declaração.

Você pode executar uma declaração preparada dada várias vezes, passando diferentes variáveis para ela ou definindo as variáveis com diferentes valores antes de cada execução.

Para exemplos, veja a Seção 13.5, “Declarações Preparadas”.

### 13.5.3 Declaração de PREALLOCATE PREPARAR

```sql
{DEALLOCATE | DROP} PREPARE stmt_name
```

Para desalojar uma declaração preparada produzida com `PREPARE`, use uma declaração `DEALLOCATE PREPARE` que faça referência ao nome da declaração preparada. Tentar executar uma declaração preparada após desalojá-la resulta em um erro. Se forem criadas demasiadas declarações preparadas e não forem desalojadas pela declaração `DEALLOCATE PREPARE` ou pelo fim da sessão, você pode encontrar o limite superior imposto pela variável de sistema `max_prepared_stmt_count`.

Para exemplos, veja a Seção 13.5, “Declarações Preparadas”.