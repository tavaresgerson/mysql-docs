## 1.6 Conformidade com os Padrões MySQL

Esta seção descreve como o MySQL se relaciona com os padrões ANSI/ISO SQL. O MySQL Server tem muitas extensões ao padrão SQL, e aqui você pode descobrir quais são elas e como usá-las. Você também pode encontrar informações sobre funcionalidades que faltam no MySQL Server e como contornar algumas das diferenças.

O padrão SQL tem evoluído desde 1986 e existem várias versões. Neste manual, “SQL-92” se refere ao padrão lançado em 1992. “SQL:1999”, “SQL:2003”, “SQL:2008” e “SQL:2011” se referem às versões do padrão lançadas nos anos correspondentes, sendo a última a versão mais recente. Usamos a frase “o padrão SQL” ou “SQL padrão” para significar a versão atual do Padrão SQL em qualquer momento.

Um dos nossos principais objetivos com o produto é continuar a trabalhar em direção à conformidade com o padrão SQL, mas sem sacrificar velocidade ou confiabilidade. Não temos medo de adicionar extensões ao SQL ou suporte para recursos não SQL, se isso aumentar significativamente a usabilidade do MySQL Server para um grande segmento da nossa base de usuários. A interface `HANDLER` é um exemplo dessa estratégia. Veja a Seção 15.2.5, “Declaração HANDLER”.

Continuamos a suportar bancos de dados transacionais e não transacionais para atender tanto ao uso crítico de 24/7 quanto ao uso pesado de Web ou registro.

O MySQL Server foi originalmente projetado para trabalhar com bancos de dados de tamanho médio (10 a 100 milhões de linhas, ou cerca de 100 MB por tabela) em sistemas de computador pequenos. Hoje, o MySQL Server lida com bancos de dados do tamanho de terabytes.

Não estamos direcionando suporte em tempo real, embora as capacidades de replicação do MySQL ofereçam funcionalidades significativas.

MySQL suporta os níveis ODBC de 0 a 3,51.

O MySQL suporta o agrupamento de bancos de dados de alta disponibilidade usando o mecanismo de armazenamento `NDBCLUSTER`. Veja o Capítulo 25, *MySQL NDB Cluster 8.0*.

Implementamos a funcionalidade XML que suporta a maioria do padrão W3C XPath. Veja a Seção 14.11, “Funções XML”.

O MySQL suporta um tipo de dados JSON nativo conforme definido pelo RFC 7159 e baseado no padrão ECMAScript (ECMA-262). Veja a Seção 13.5, “O Tipo de Dados JSON”. O MySQL também implementa um subconjunto das funções SQL/JSON especificadas por um rascunho pré-publicação do padrão SQL:2016; consulte a Seção 14.17, “Funções JSON”, para mais informações.

### Selecionando modos SQL

O servidor MySQL pode operar em diferentes modos SQL e pode aplicar esses modos de maneira diferente para diferentes clientes, dependendo do valor da variável de sistema `sql_mode`. Os administradores de banco de dados podem definir o modo SQL global para atender aos requisitos operacionais do servidor do site, e cada aplicativo pode definir seu modo SQL de sessão de acordo com suas próprias necessidades.

Os modos afetam a sintaxe SQL que o MySQL suporta e as verificações de validação de dados que ele realiza. Isso facilita o uso do MySQL em diferentes ambientes e o uso do MySQL junto com outros servidores de banco de dados.

Para mais informações sobre a configuração do modo SQL, consulte a Seção 7.1.11, “Modos SQL do servidor”.

### Executando o MySQL no Modo ANSI

Para executar o MySQL Server no modo ANSI, inicie o **mysqld** com a opção `--ansi`. Executar o servidor no modo ANSI é o mesmo que iniciá-lo com as seguintes opções:

```
--transaction-isolation=SERIALIZABLE --sql-mode=ANSI
```

Para obter o mesmo efeito em tempo de execução, execute essas duas declarações:

```
SET GLOBAL TRANSACTION ISOLATION LEVEL SERIALIZABLE;
SET GLOBAL sql_mode = 'ANSI';
```

Você pode ver que definir a variável de sistema `sql_mode` para `'ANSI'` habilita todas as opções de modo SQL que são relevantes para o modo ANSI, conforme segue:

```
mysql> SET GLOBAL sql_mode='ANSI';
mysql> SELECT @@GLOBAL.sql_mode;
        -> 'REAL_AS_FLOAT,PIPES_AS_CONCAT,ANSI_QUOTES,IGNORE_SPACE,ANSI'
```

Executar o servidor no modo ANSI com `--ansi` não é exatamente o mesmo que configurar o modo SQL para `'ANSI'`, pois a opção `--ansi` também define o nível de isolamento de transação.

Veja a Seção 7.1.7, “Opções de comando do servidor”.

### 1.6.1 Extensões do MySQL para SQL Padrão

O MySQL Server suporta algumas extensões que você provavelmente não encontrará em outros SGBD SQL. Esteja ciente de que, se você as usar, seu código provavelmente não será portátil para outros servidores SQL. Em alguns casos, você pode escrever código que inclui extensões do MySQL, mas ainda é portátil, usando comentários da seguinte forma:

```
/*! MySQL-specific code */
```

Neste caso, o MySQL Server analisa e executa o código dentro do comentário como faria com qualquer outra declaração SQL, mas outros servidores SQL devem ignorar as extensões. Por exemplo, o MySQL Server reconhece a palavra-chave `STRAIGHT_JOIN` na seguinte declaração, mas outros servidores não devem:

```
SELECT /*! STRAIGHT_JOIN */ col1 FROM table1,table2 WHERE ...
```

Se você adicionar um número de versão após o caractere `!`, a sintaxe dentro do comentário é executada apenas se a versão do MySQL for maior ou igual ao número de versão especificado. A cláusula `KEY_BLOCK_SIZE` no comentário a seguir é executada apenas por servidores do MySQL 5.1.10 ou superior:

```
CREATE TABLE t1(a INT, KEY (a)) /*!50110 KEY_BLOCK_SIZE=1024 */;
```

As descrições a seguir listam as extensões do MySQL, organizadas por categoria.

* Organização de dados em disco

O MySQL Server mapeia cada banco de dados a um diretório sob o diretório de dados do MySQL e mapeia as tabelas dentro de um banco de dados a nomes de arquivo no diretório do banco de dados. Consequentemente, os nomes de banco de dados e de tabela são sensíveis ao caso em maiúsculas no MySQL Server em sistemas operacionais que têm nomes de arquivos sensíveis ao caso (como a maioria dos sistemas Unix). Veja a Seção 11.2.3, “Sensibilidade ao Caso do Identificador”.

* Sintaxe de linguagem geral

+ Por padrão, as strings podem ser encerradas por `"` e também por `'`. Se o modo SQL `ANSI_QUOTES` estiver habilitado, as strings podem ser encerradas apenas por `'` e o servidor interpreta as strings encerradas por `"` como identificadores.

+ `\` é o caractere de escape em strings.
  + Em declarações SQL, você pode acessar tabelas de diferentes bancos com a sintaxe *`db_name.tbl_name`*. Alguns servidores SQL fornecem a mesma funcionalidade, mas chamam isso de `User space`. O MySQL Server não suporta espaços de tabela, como os usados em declarações como esta: `CREATE TABLE ralph.my_table ... IN my_tablespace`.

* Sintaxe da declaração SQL

+ As declarações `ANALYZE TABLE`, `CHECK TABLE`, `OPTIMIZE TABLE` e `REPAIR TABLE`.

+ As declarações `CREATE DATABASE`, `DROP DATABASE` e `ALTER DATABASE`. Veja a Seção 15.1.12, “Declaração CREATE DATABASE”, Seção 15.1.24, “Declaração DROP DATABASE” e Seção 15.1.2, “Declaração ALTER DATABASE”.

+ A declaração `DO`.  
+ `EXPLAIN SELECT`(explain.html "15.8.2 EXPLAIN Statement") para obter uma descrição de como as tabelas são processadas pelo otimizador de consulta.

+ As declarações `FLUSH` e `RESET`.

+ A declaração `SET`. Veja a Seção 15.7.6.1, “Sintaxe do SET para atribuição de variáveis”.

+ A declaração `SHOW`. Veja a Seção 15.7.7, “Declarações SHOW”. As informações produzidas por muitas das declarações `SHOW` específicas do MySQL podem ser obtidas de maneira mais padrão usando `SELECT` para consultar `INFORMATION_SCHEMA`. Veja o Capítulo 28, *Tabelas do SCHEMA_INFORMACAO.

+ Uso de `LOAD DATA`. Em muitos casos, essa sintaxe é compatível com a Oracle `LOAD DATA`. Veja a Seção 15.2.9, “Instrução LOAD DATA”.

+ Uso de `RENAME TABLE`. Veja a Seção 15.1.36, “Instrução RENAME TABLE”.

+ Uso de `REPLACE` em vez de `DELETE` mais `INSERT`. Veja a Seção 15.2.12, “Instrução REPLACE”.

+ Uso de `CHANGE col_name`, `DROP col_name`, ou `DROP INDEX`, `IGNORE` ou `RENAME` em declarações `ALTER TABLE`. Uso de múltiplas cláusulas `ADD`, `ALTER`, `DROP`, ou `CHANGE` em uma declaração `ALTER TABLE`. Ver Seção 15.1.9, “Declaração ALTER TABLE”.

+ Uso de nomes de índice, índices em um prefixo de uma coluna e uso de `INDEX` ou `KEY` em declarações [`CREATE TABLE`](create-table.html "15.1.20 CREATE TABLE Statement"). Veja a Seção 15.1.20, “Declaração CREATE TABLE”.

+ Uso de `TEMPORARY` ou `IF NOT EXISTS` com [`CREATE TABLE`](create-table.html "15.1.20 CREATE TABLE Statement").

+ Uso de `IF EXISTS` com `DROP TABLE` e `DROP DATABASE`.

+ A capacidade de descartar várias tabelas com uma única declaração `DROP TABLE`.

+ As cláusulas `ORDER BY` e `LIMIT` das declarações `UPDATE` e `DELETE`.

+ sintaxe `INSERT INTO tbl_name SET col_name = ...`.

+ A cláusula `DELAYED` das declarações `INSERT` e `REPLACE`.

+ A cláusula `LOW_PRIORITY` das declarações `INSERT`, `REPLACE`, `DELETE` e `UPDATE`.

+ Uso de `INTO OUTFILE` ou `INTO DUMPFILE` em declarações `SELECT`. Veja a Seção 15.2.13, “Instrução SELECT”.

+ Opções como `STRAIGHT_JOIN` ou `SQL_SMALL_RESULT` em declarações de `SELECT`.

+ Você não precisa nomear todas as colunas selecionadas na cláusula `GROUP BY`. Isso oferece melhor desempenho para algumas consultas muito específicas, mas bastante normais. Veja a Seção 14.19, “Funções agregadas”.

+ Você pode especificar `ASC` e `DESC` com `GROUP BY`, não apenas com `ORDER BY`.

+ A capacidade de definir variáveis em uma declaração com o operador de atribuição `:=`. Veja a Seção 11.4, “Variáveis Definidas pelo Usuário”.

* Tipos de dados

+ Os tipos de dados `MEDIUMINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `SET` e `ENUM` e os vários tipos de dados `BLOB` e `TEXT`.

+ os atributos dos tipos de dados `AUTO_INCREMENT`, `BINARY`, `NULL`, `UNSIGNED` e `ZEROFILL`.

* Funções e operadores

+ Para facilitar a migração de usuários de outros ambientes SQL, o MySQL Server suporta aliases para muitas funções. Por exemplo, todas as funções de string suportam tanto a sintaxe SQL padrão quanto a sintaxe ODBC.

O MySQL Server entende os operadores `||` e `&&` para significar OU lógico e E, como na linguagem de programação C. No MySQL Server, `||` e `OR` são sinônimos, assim como `&&` e `AND`. Devido a essa sintaxe agradável, o MySQL Server não suporta o operador padrão SQL `||` para concatenação de strings; use `CONCAT()` em vez disso. Como `CONCAT()` aceita qualquer número de argumentos, é fácil converter o uso do operador `||` para o MySQL Server.

+ Uso de `COUNT(DISTINCT value_list)`](aggregate-functions.html#function_count) quando *`value_list`* tem mais de um elemento.

+ As comparações de string são case-insensitive por padrão, com a ordem de classificação determinada pela collation do conjunto de caracteres atual, que é `utf8mb4` por padrão. Para realizar comparações case-sensitive em vez disso, você deve declarar suas colunas com o atributo `BINARY` ou usar a `BINARY` cast, que faz com que as comparações sejam feitas usando os valores dos códigos de caracteres subjacentes em vez de uma ordem lexical.

+ O operador `%` é sinônimo de `MOD()`. Ou seja, `N % M` é equivalente a `MOD(N,M)`. `%` é compatível com programadores C e para compatibilidade com PostgreSQL.

Os operadores `=`, `<>`, `<=`, `<`, `>=`, `>`, `<<`, `>>`, `<=>`, `AND`, `OR`, ou `LIKE` podem ser usados em expressões na lista de colunas de saída (à esquerda do `FROM`) em declarações `SELECT`. Por exemplo:

    ```
    mysql> SELECT col1=1 AND col2=2 FROM my_table;
    ```

+ A função `LAST_INSERT_ID()` retorna o valor mais recente da `AUTO_INCREMENT`. Veja a Seção 14.15, “Funções de Informação”.

+ `LIKE` é permitido em valores numéricos.

+ Os operadores de expressão regular `REGEXP` e `NOT REGEXP` estendem a expressão regular padrão.

+ `CONCAT()` ou `CHAR()` com um argumento ou mais de dois argumentos. (No MySQL Server, essas funções podem receber um número variável de argumentos.)

as funções `BIT_COUNT()`, `CASE`, `ELT()`, `FROM_DAYS()`, `FORMAT()`, `IF()`, `MD5()`, `PERIOD_ADD()`, `PERIOD_DIFF()`, `TO_DAYS()` e `WEEKDAY()`.

+ Uso de `TRIM()` para cortar substratos. O SQL padrão suporta a remoção de apenas caracteres únicos.

+ As funções `GROUP BY` têm as funções `STD()`, `BIT_OR()`, `BIT_AND()`, `BIT_XOR()` e `GROUP_CONCAT()`. Veja a Seção 14.19, “Funções Agregadas”.

### 1.6.2 Diferenças entre MySQL e SQL Padrão

Tentamos fazer com que o MySQL Server siga o padrão ANSI SQL e o padrão ODBC SQL, mas o MySQL Server realiza operações de maneira diferente em alguns casos:

* Há várias diferenças entre os sistemas de privilégios MySQL e os sistemas de privilégios padrão do SQL. Por exemplo, no MySQL, os privilégios de uma tabela não são revogados automaticamente quando você exclui uma tabela. Você deve emitir explicitamente uma declaração `REVOKE` para revogar os privilégios de uma tabela. Para mais informações, consulte a Seção 15.7.1.8, “Declaração REVOKE”.

* A função `CAST()` não suporta cast para `REAL` - FLOAT, DOUBLE") ou `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"). Veja a Seção 14.10, “Funções e Operadores de Cast”.

#### 1.6.2.1 SELECT INTO TABLE Diferenças

O MySQL Server não suporta a extensão `SELECT ... INTO TABLE` Sybase SQL. Em vez disso, o MySQL Server suporta a sintaxe SQL padrão `INSERT INTO ... SELECT`(insert-select.html "15.2.7.1 INSERT ... SELECT Statement"), que é basicamente a mesma coisa. Veja a Seção 15.2.7.1, “Instrução INSERT ... SELECT”. Por exemplo:

```
INSERT INTO tbl_temp2 (fld_id)
    SELECT tbl_temp1.fld_order_id
    FROM tbl_temp1 WHERE tbl_temp1.fld_order_id > 100;
```

Como alternativa, você pode usar `SELECT ... INTO OUTFILE` (select-into.html "15.2.13.1 SELECT ... INTO Statement") ou `CREATE TABLE ... SELECT` (create-table.html "15.1.20 CREATE TABLE Statement").

Você pode usar `SELECT ... INTO` (select.html "15.2.13 SELECT Statement") com variáveis definidas pelo usuário. A mesma sintaxe também pode ser usada dentro de rotinas armazenadas usando cursor e variáveis locais. Veja a Seção 15.2.13.1, “Instrução SELECT ... INTO”.

#### 1.6.2.2 ATUALIZAÇÃO Diferenças

Se você acessar uma coluna da tabela que será atualizada em uma expressão, o `UPDATE` usa o valor atual da coluna. A segunda atribuição na declaração seguinte define o `col2` para o valor atual (atualizado) do `col1`, e não o valor original do `col1`. O resultado é que o `col1` e o `col2` têm o mesmo valor. Esse comportamento difere do SQL padrão.

```
UPDATE t1 SET col1 = col1 + 1, col2 = col1;
```

#### 1.6.2.3 Diferenças entre a restrição de chave estrangeira

A implementação do MySQL de restrições de chave estrangeira difere do padrão SQL nos seguintes aspectos-chave:

* Se houver várias linhas na tabela principal com o mesmo valor da chave referenciada, `InnoDB` realiza uma verificação de chave estrangeira como se as outras linhas da tabela principal com o mesmo valor da chave não existissem. Por exemplo, se você definir uma restrição de tipo `RESTRICT`, e houver uma linha filha com várias linhas da tabela principal, `InnoDB` não permite a exclusão de nenhuma das linhas da tabela principal.

* Se `ON UPDATE CASCADE` ou `ON UPDATE SET NULL` recorrer para atualizar a *mesma tabela* que já havia atualizado durante a mesma cascata, ele age como `RESTRICT`. Isso significa que você não pode usar operações `ON UPDATE CASCADE` ou `ON UPDATE SET NULL` auto-referenciais. Isso é para evitar loops infinitos resultantes de atualizações cascatadas. Uma operação auto-referencial `ON DELETE SET NULL`, por outro lado, é possível, assim como uma auto-referencial `ON DELETE CASCADE`. As operações cascatadas não podem ser aninhadas em mais de 15 níveis de profundidade.

* Em uma declaração SQL que insere, exclui ou atualiza muitas linhas, as restrições de chave estrangeira (como restrições únicas) são verificadas linha por linha. Ao realizar verificações de chave estrangeira, o `InnoDB` define bloqueios compartilhados em nível de linha em registros filhos ou parentes que ele deve examinar. O MySQL verifica as restrições de chave estrangeira imediatamente; o controle não é adiado para o compromisso da transação. De acordo com o padrão SQL, o comportamento padrão deve ser o controle adiado. Ou seja, as restrições são verificadas apenas após o *conjunto completo da declaração SQL* ter sido processado. Isso significa que não é possível excluir uma linha que se refere a si mesma usando uma chave estrangeira.

* Nenhum mecanismo de armazenamento, incluindo `InnoDB`, reconhece ou aplica a cláusula `MATCH` usada em definições de restrição de integridade referencial. O uso de uma cláusula explícita `MATCH` não tem o efeito especificado, e faz com que as cláusulas `ON DELETE` e `ON UPDATE` sejam ignoradas. Especificar a cláusula `MATCH` deve ser evitado.

A cláusula `MATCH` no padrão SQL controla como os valores de `NULL` em uma chave estrangeira composta (com várias colunas) são tratados ao comparar com uma chave primária na tabela referenciada. O MySQL essencialmente implementa a semântica definida por `MATCH SIMPLE`, que permite que uma chave estrangeira seja totalmente ou parcialmente `NULL`. Nesse caso, uma linha (de uma tabela subordinada) contendo tal chave estrangeira pode ser inserida, mesmo que não corresponda a nenhuma linha na tabela referenciada (matriz). (É possível implementar outras semânticas usando gatilhos.)

* O MySQL exige que as colunas referenciadas sejam indexadas por razões de desempenho. No entanto, o MySQL não exige que as colunas referenciadas sejam `UNIQUE` ou sejam declaradas `NOT NULL`.

Uma restrição `FOREIGN KEY` que faz referência a uma chave não `UNIQUE` não é SQL padrão, mas sim uma extensão `InnoDB`. O motor de armazenamento `NDB`, por outro lado, requer uma chave única explícita (ou chave primária) em qualquer coluna referenciada como chave estrangeira.

O manuseio de referências de chave estrangeira para chaves não únicas ou chaves que contêm valores `NULL` não está bem definido para operações como `UPDATE` ou `DELETE CASCADE`. Você é aconselhado a usar chaves estrangeiras que fazem referência apenas às chaves `UNIQUE` (incluindo `PRIMARY`) e `NOT NULL`.

* Para motores de armazenamento que não suportam chaves estrangeiras (como `MyISAM`), o MySQL Server analisa e ignora as especificações de chave estrangeira.

* O MySQL analisa, mas ignora as especificações "inline `REFERENCES`" (conforme definido no padrão SQL) onde as referências são definidas como parte da especificação da coluna. O MySQL aceita as cláusulas `REFERENCES` apenas quando especificadas como parte de uma especificação `FOREIGN KEY` separada.

Definir uma coluna para usar uma cláusula `REFERENCES tbl_name(col_name)` não tem efeito real e *serve apenas como uma nota ou comentário para você de que a coluna que você está definindo atualmente é destinada a se referir a uma coluna em outra tabela*. É importante perceber quando usar essa sintaxe que:

+ O MySQL não realiza qualquer tipo de verificação para garantir que *`col_name`* realmente exista em *`tbl_name`* (ou até mesmo que *`tbl_name`* em si exista).

+ O MySQL não realiza nenhuma ação em *`tbl_name`* como a exclusão de linhas em resposta a ações realizadas em linhas da tabela que você está definindo; em outras palavras, essa sintaxe não induz nenhum comportamento de `ON DELETE` ou `ON UPDATE`. (Embora você possa escrever uma cláusula `ON DELETE` ou `ON UPDATE` como parte da cláusula `REFERENCES`, ela também é ignorada.)

+ Essa sintaxe cria uma *coluna*; ela **não** cria nenhum tipo de índice ou chave.

Você pode usar uma coluna assim criada como uma coluna de junção, como mostrado aqui:

  ```
  CREATE TABLE person (
      id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
      name CHAR(60) NOT NULL,
      PRIMARY KEY (id)
  );

  CREATE TABLE shirt (
      id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
      style ENUM('t-shirt', 'polo', 'dress') NOT NULL,
      color ENUM('red', 'blue', 'orange', 'white', 'black') NOT NULL,
      owner SMALLINT UNSIGNED NOT NULL REFERENCES person(id),
      PRIMARY KEY (id)
  );

  INSERT INTO person VALUES (NULL, 'Antonio Paz');

  SELECT @last := LAST_INSERT_ID();

  INSERT INTO shirt VALUES
  (NULL, 'polo', 'blue', @last),
  (NULL, 'dress', 'white', @last),
  (NULL, 't-shirt', 'blue', @last);

  INSERT INTO person VALUES (NULL, 'Lilliana Angelovska');

  SELECT @last := LAST_INSERT_ID();

  INSERT INTO shirt VALUES
  (NULL, 'dress', 'orange', @last),
  (NULL, 'polo', 'red', @last),
  (NULL, 'dress', 'blue', @last),
  (NULL, 't-shirt', 'white', @last);

  SELECT * FROM person;
  +----+---------------------+
  | id | name                |
  +----+---------------------+
  |  1 | Antonio Paz         |
  |  2 | Lilliana Angelovska |
  +----+---------------------+

  SELECT * FROM shirt;
  +----+---------+--------+-------+
  | id | style   | color  | owner |
  +----+---------+--------+-------+
  |  1 | polo    | blue   |     1 |
  |  2 | dress   | white  |     1 |
  |  3 | t-shirt | blue   |     1 |
  |  4 | dress   | orange |     2 |
  |  5 | polo    | red    |     2 |
  |  6 | dress   | blue   |     2 |
  |  7 | t-shirt | white  |     2 |
  +----+---------+--------+-------+


  SELECT s.* FROM person p INNER JOIN shirt s
     ON s.owner = p.id
   WHERE p.name LIKE 'Lilliana%'
     AND s.color <> 'white';

  +----+-------+--------+-------+
  | id | style | color  | owner |
  +----+-------+--------+-------+
  |  4 | dress | orange |     2 |
  |  5 | polo  | red    |     2 |
  |  6 | dress | blue   |     2 |
  +----+-------+--------+-------+
  ```

Quando utilizado dessa forma, a cláusula `REFERENCES` não é exibida na saída de (show-create-table.html "15.7.7.10 SHOW CREATE TABLE Statement") ou `DESCRIBE`:

  ```
  SHOW CREATE TABLE shirt\G
  *************************** 1. row ***************************
  Table: shirt
  Create Table: CREATE TABLE `shirt` (
  `id` smallint(5) unsigned NOT NULL auto_increment,
  `style` enum('t-shirt','polo','dress') NOT NULL,
  `color` enum('red','blue','orange','white','black') NOT NULL,
  `owner` smallint(5) unsigned NOT NULL,
  PRIMARY KEY  (`id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  ```

Para informações sobre restrições de chave estrangeira, consulte a Seção 15.1.20.5, “Restrições de chave estrangeira”.

#### 1.6.2.4 '--' como início de um comentário

O SQL padrão usa a sintaxe C `/* this is a comment */` para comentários, e o MySQL Server também suporta essa sintaxe. O MySQL também suporta extensões para essa sintaxe que permitem que SQL específico do MySQL seja incorporado no comentário; veja a Seção 11.7, “Comentários”.

O MySQL Server também usa `#` como caractere de comentário inicial. Isso não é padrão.

O SQL padrão também usa “`--`” como uma sequência de comentário inicial. O MySQL Server suporta uma variante do estilo de comentário `--`; a sequência de comentário inicial `--` é aceita como tal, mas deve ser seguida por um caractere de espaço, como um espaço ou uma nova linha. O espaço é destinado a evitar problemas com consultas SQL geradas que utilizam construções como as seguintes, que atualizam o saldo para refletir uma cobrança:

```
UPDATE account SET balance=balance-charge
WHERE account_id=user_id
```

Considere o que acontece quando `charge` tem um valor negativo, como `-1`, que pode ser o caso quando um valor é creditado na conta. Neste caso, a declaração gerada parece assim:

```
UPDATE account SET balance=balance--1
WHERE account_id=5752;
```

`balance--1` é um padrão SQL válido, mas `--` é interpretado como o início de um comentário, e parte da expressão é descartada. O resultado é uma declaração que tem um significado completamente diferente do que se pretendia:

```
UPDATE account SET balance=balance
WHERE account_id=5752;
```

Essa declaração não produz nenhuma alteração de valor. Para evitar que isso aconteça, o MySQL exige um caractere de espaço em branco após o `--` para que ele seja reconhecido como uma sequência de comentário inicial no MySQL Server, para que uma expressão como `balance--1` seja sempre segura para uso.

### 1.6.3 Como o MySQL lida com restrições

O MySQL permite que você trabalhe tanto com tabelas transacionais que permitem o cancelamento, quanto com tabelas não transacionais que não permitem. Por isso, o tratamento de restrições é um pouco diferente no MySQL do que em outros DBMSs. Devemos lidar com o caso em que você inseriu ou atualizou muitas linhas em uma tabela não transacional para a qual as alterações não podem ser canceladas quando ocorre um erro.

A filosofia básica é que o MySQL Server tenta produzir um erro para qualquer coisa que ele possa detectar durante a análise de uma declaração a ser executada e tenta se recuperar de quaisquer erros que ocorram durante a execução da declaração. Fazemos isso na maioria dos casos, mas ainda não para todos.

As opções que o MySQL tem quando ocorre um erro são parar a declaração no meio ou recuperar o melhor possível do problema e continuar. Por padrão, o servidor segue o último curso. Isso significa, por exemplo, que o servidor pode forçar valores inválidos para os valores válidos mais próximos.

Várias opções de modo SQL estão disponíveis para fornecer maior controle sobre o tratamento de valores de dados inválidos e se continuar a execução da declaração ou abortar quando ocorrerem erros. Usando essas opções, você pode configurar o MySQL Server para agir de uma maneira mais tradicional, semelhante a outros DBMSs que rejeitam entradas inadequadas. O modo SQL pode ser configurado globalmente na inicialização do servidor para afetar todos os clientes. Clientes individuais podem configurar o modo SQL em tempo de execução, o que permite que cada cliente selecione o comportamento mais apropriado para suas necessidades. Veja a Seção 7.1.11, “Modos SQL do servidor”.

As seções a seguir descrevem como o MySQL Server lida com diferentes tipos de restrições.

#### 1.6.3.1 Constrastes de Chave Primária e Índice Único

Normalmente, erros ocorrem em declarações de mudança de dados (como `INSERT` ou `UPDATE`) que violariam restrições de chave primária, chave única ou chave estrangeira. Se você estiver usando um motor de armazenamento transacional, como `InnoDB`, o MySQL automaticamente desfaz a declaração. Se você estiver usando um motor de armazenamento não transacional, o MySQL para o processamento da declaração na linha para a qual o erro ocorreu e deixa quaisquer linhas restantes não processadas.

O MySQL suporta uma palavra-chave `IGNORE` para `INSERT`, `UPDATE` e assim por diante. Se você a usar, o MySQL ignora violações de chave primária ou única e continua processando com a próxima linha. Veja a seção para a declaração que você está usando (Seção 15.2.7, “Declaração de Inserção”, Seção 15.2.17, “Declaração de Atualização” e assim por diante).

Você pode obter informações sobre o número de linhas que foram inseridas ou atualizadas na verdade com a função `mysql_info()` da API C. Você também pode usar a declaração [[`SHOW WARNINGS`][(show-warnings.html "15.7.7.42 SHOW WARNINGS Statement")]]. Veja mysql_info(), e Seção 15.7.7.42, “Declaração SHOW WARNINGS”.

As tabelas `InnoDB` e `NDB` suportam chaves estrangeiras. Veja a Seção 1.6.3.2, “Restrições de chave estrangeira”.

#### 1.6.3.2 Restrições de Chave Estrangeira

As chaves estrangeiras permitem que você faça referência cruzada a dados relacionados entre tabelas, e as restrições de chave estrangeira ajudam a manter esses dados dispersos consistentes.

O MySQL suporta as referências de chave estrangeira `ON UPDATE` e `ON DELETE` nas declarações `CREATE TABLE` e `ALTER TABLE`. As ações referenciais disponíveis são `RESTRICT`, `CASCADE`, `SET NULL` e `NO ACTION` (padrão).

`SET DEFAULT` também é suportada pelo MySQL Server, mas atualmente é rejeitada como inválida pelo `InnoDB`. Como o MySQL não suporta verificação de restrições diferida, `NO ACTION` é tratado como `RESTRICT`. Para a sintaxe exata suportada pelo MySQL para chaves estrangeiras, consulte a Seção 15.1.20.5, “Restrições de CHAVE ESTRANGEIRA”.

`MATCH FULL`, `MATCH PARTIAL` e `MATCH SIMPLE` são permitidos, mas seu uso deve ser evitado, pois eles fazem com que o MySQL Server ignore qualquer cláusula `ON DELETE` ou `ON UPDATE` usada na mesma declaração. As opções `MATCH` não têm nenhum outro efeito no MySQL, que, na verdade, impõe a semântica `MATCH SIMPLE` em tempo integral.

O MySQL exige que as colunas de chave estrangeira sejam indexadas; se você criar uma tabela com uma restrição de chave estrangeira, mas sem índice em uma coluna específica, um índice é criado.

Você pode obter informações sobre chaves estrangeiras da tabela do esquema de informações `KEY_COLUMN_USAGE`. Um exemplo de consulta contra essa tabela é mostrado aqui:

```
mysql> SELECT TABLE_SCHEMA, TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME
     > FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
     > WHERE REFERENCED_TABLE_SCHEMA IS NOT NULL;
+--------------+---------------+-------------+-----------------+
| TABLE_SCHEMA | TABLE_NAME    | COLUMN_NAME | CONSTRAINT_NAME |
+--------------+---------------+-------------+-----------------+
| fk1          | myuser        | myuser_id   | f               |
| fk1          | product_order | customer_id | f2              |
| fk1          | product_order | product_id  | f1              |
+--------------+---------------+-------------+-----------------+
3 rows in set (0.01 sec)
```

Informações sobre chaves estrangeiras nas tabelas `InnoDB` também podem ser encontradas nas tabelas `INNODB_FOREIGN` e `INNODB_FOREIGN_COLS`, no banco de dados `INFORMATION_SCHEMA`.

As tabelas `InnoDB` e `NDB` suportam chaves estrangeiras.

#### 1.6.3.3 Restrições impostas a dados inválidos

Por padrão, o MySQL 8.0 rejeita valores de dados inválidos ou inadequados e interrompe a declaração na qual eles ocorrem. É possível alterar esse comportamento para ser mais tolerante com valores inválidos, de modo que o servidor os coerça para valores válidos para a entrada de dados, desabilitando o modo SQL rigoroso (consulte Seção 7.1.11, “Modos SQL do servidor”), mas isso não é recomendado.

Versões mais antigas do MySQL empregavam o comportamento indulgente por padrão; para uma descrição desse comportamento, consulte Restrições de dados inválidos.

#### 1.6.3.4 Restrições de ENUM e SET

As colunas `ENUM` e `SET` fornecem uma maneira eficiente de definir colunas que podem conter apenas um conjunto específico de valores. Veja a Seção 13.3.5, “O Tipo ENUM”, e a Seção 13.3.6, “O Tipo SET”.

A menos que o modo estrito seja desativado (não é recomendado, mas veja a Seção 7.1.11, “Modos SQL do servidor”), a definição de uma coluna `ENUM` ou `SET` atua como uma restrição para os valores inseridos na coluna. Um erro ocorre para valores que não satisfazem essas condições:

* Um valor `ENUM` deve ser um dos listados na definição da coluna, ou o equivalente numérico interno do mesmo. O valor não pode ser o valor de erro (ou seja, 0 ou a string vazia). Para uma coluna definida como `ENUM('a','b','c')`, valores como `''`, `'d'` ou `'ax'` são inválidos e são rejeitados.

* Um valor `SET` deve ser uma string vazia ou um valor que consista apenas nos valores listados na definição da coluna, separados por vírgulas. Para uma coluna definida como `SET('a','b','c')`, valores como `'d'` ou `'a,b,c,d'` são inválidos e são rejeitados.

Os erros por valores inválidos podem ser suprimidos no modo estrito se você usar `INSERT IGNORE`(insert.html "15.2.7 INSERT Statement") ou `UPDATE IGNORE`. Neste caso, um aviso é gerado em vez de um erro. Para `ENUM`, o valor é inserido como o membro de erro (`0`). Para `SET`, o valor é inserido conforme dado, exceto que quaisquer substratos inválidos são excluídos. Por exemplo, `'a,x,b,y'` resulta em um valor de `'a,b'`.