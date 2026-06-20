## 1.6 Conformidade com os Padrões MySQL

Esta seção descreve como o MySQL se relaciona com os padrões ANSI/ISO SQL. O MySQL Server tem muitas extensões ao padrão SQL, e aqui você pode descobrir quais são elas e como usá-las. Você também pode encontrar informações sobre funcionalidades que faltam no MySQL Server e como contornar algumas das diferenças.

O padrão SQL tem evoluído desde 1986 e existem várias versões. Neste manual, “SQL-92” se refere ao padrão lançado em 1992. “SQL:1999”, “SQL:2003”, “SQL:2008” e “SQL:2011” se referem às versões do padrão lançadas nos anos correspondentes, sendo a última a versão mais recente. Usamos a frase “o padrão SQL” ou “SQL padrão” para significar a versão atual do Padrão SQL em qualquer momento.

Um dos nossos principais objetivos com o produto é continuar a trabalhar em direção à conformidade com o padrão SQL, mas sem sacrificar velocidade ou confiabilidade. Não temos medo de adicionar extensões ao SQL ou suporte para recursos não SQL, se isso aumentar significativamente a usabilidade do MySQL Server para um grande segmento da nossa base de usuários. A interface `HANDLER` é um exemplo dessa estratégia. Veja a Seção 13.2.4, “Declaração HANDLER”.

Continuamos a suportar bancos de dados transacionais e não transacionais para atender tanto ao uso crítico de 24/7 quanto ao uso pesado de Web ou registro.

O MySQL Server foi originalmente projetado para trabalhar com bancos de dados de tamanho médio (10 a 100 milhões de strings, ou cerca de 100 MB por tabela) em sistemas de computador pequenos. Hoje, o MySQL Server lida com bancos de dados do tamanho de terabytes, mas o código também pode ser compilado em uma versão reduzida adequada para dispositivos portáteis e embutidos. O design compacto do servidor MySQL permite o desenvolvimento em ambas as direções sem conflitos na árvore de código-fonte.

Não estamos direcionando suporte em tempo real, embora as capacidades de replicação do MySQL ofereçam funcionalidades significativas.

MySQL suporta os níveis ODBC de 0 a 3,51.

O MySQL suporta o agrupamento de bancos de dados de alta disponibilidade usando o mecanismo de armazenamento `NDBCLUSTER`. Veja o Capítulo 21, *MySQL NDB Cluster 7.5 e NDB Cluster 7.6*.

Implementamos a funcionalidade XML que suporta a maioria do padrão W3C XPath. Veja a Seção 12.11, “Funções XML”.

O MySQL (5.7.8 e versões posteriores) suporta um tipo de dados JSON nativo conforme definido pelo RFC 7159 e baseado no padrão ECMAScript (ECMA-262). Consulte a Seção 11.5, “O Tipo de Dados JSON”. O MySQL também implementa um subconjunto das funções SQL/JSON especificadas por um rascunho de pré-publicação do padrão SQL:2016; consulte a Seção 12.17, “Funções JSON”, para mais informações.

### Selecionando modos SQL

O servidor MySQL pode operar em diferentes modos SQL e pode aplicar esses modos de maneira diferente para diferentes clientes, dependendo do valor da variável de sistema `sql_mode`. Os administradores de banco de dados podem definir o modo SQL global para atender aos requisitos operacionais do servidor do site, e cada aplicativo pode definir seu modo SQL de sessão de acordo com suas próprias necessidades.

Os modos afetam a sintaxe SQL que o MySQL suporta e as verificações de validação de dados que ele realiza. Isso facilita o uso do MySQL em diferentes ambientes e o uso do MySQL junto com outros servidores de banco de dados.

### Executando o MySQL no Modo ANSI

Para executar o MySQL Server no modo ANSI, inicie `mysqld` com a opção `--ansi`. Executar o servidor no modo ANSI é o mesmo que iniciá-lo com as seguintes opções:

```sql
--transaction-isolation=SERIALIZABLE --sql-mode=ANSI
```

Para obter o mesmo efeito em tempo de execução, execute essas duas declarações:

```sql
SET GLOBAL TRANSACTION ISOLATION LEVEL SERIALIZABLE;
SET GLOBAL sql_mode = 'ANSI';
```

Você pode ver que definir a variável de sistema `sql_mode` para `'ANSI'` habilita todas as opções de modo SQL que são relevantes para o modo ANSI, conforme segue:

```sql
mysql> SET GLOBAL sql_mode='ANSI';
mysql> SELECT @@GLOBAL.sql_mode;
        -> 'REAL_AS_FLOAT,PIPES_AS_CONCAT,ANSI_QUOTES,IGNORE_SPACE,ANSI'
```

Executar o servidor no modo ANSI com `--ansi` não é exatamente o mesmo que configurar o modo SQL para `'ANSI'`, pois a opção `--ansi` também define o nível de isolamento de transação.

### 1.6.1 Extensões do MySQL para SQL Padrão

O MySQL Server suporta algumas extensões que provavelmente não são encontradas em outros SGBD SQL. Esteja ciente de que, se você as usar, seu código não será portátil para outros servidores SQL. Em alguns casos, você pode escrever código que inclui extensões do MySQL, mas ainda é portátil, usando comentários da seguinte forma:

```sql
/*! MySQL-specific code */
```

Neste caso, o MySQL Server analisa e executa o código dentro do comentário como faria com qualquer outra declaração SQL, mas outros servidores SQL ignoram as extensões. Por exemplo, o MySQL Server reconhece a palavra-chave `STRAIGHT_JOIN` na seguinte declaração, mas outros servidores não:

```sql
SELECT /*! STRAIGHT_JOIN */ col1 FROM table1,table2 WHERE ...
```

Se você adicionar um número de versão após o caractere `!`, a sintaxe dentro do comentário é executada apenas se a versão do MySQL for maior ou igual ao número de versão especificado. A cláusula `KEY_BLOCK_SIZE` no comentário a seguir é executada apenas por servidores do MySQL 5.1.10 ou superior:

```sql
CREATE TABLE t1(a INT, KEY (a)) /*!50110 KEY_BLOCK_SIZE=1024 */;
```

As descrições a seguir listam as extensões do MySQL, organizadas por categoria.

**Organização de dados no disco**

O MySQL Server mapeia cada banco de dados a um diretório sob o diretório de dados do MySQL e mapeia as tabelas dentro de um banco de dados a nomes de arquivos no diretório do banco de dados. Isso tem algumas implicações:

+ Os nomes de banco de dados e de tabela são sensíveis ao caso em caracteres no MySQL Server em sistemas operacionais que têm nomes de arquivos sensíveis ao caso (como a maioria dos sistemas Unix). Veja a Seção 9.2.3, “Sensibilidade ao caso do identificador”.

+ Você pode usar comandos padrão do sistema para fazer backup, renomear, mover, excluir e copiar tabelas que são gerenciadas pelo motor de armazenamento `MyISAM`. Por exemplo, é possível renomear uma tabela `MyISAM` renomeando os arquivos `.MYD`, `.MYI` e `.frm` aos quais a tabela corresponde. (No entanto, é preferível usar `RENAME TABLE` ou `ALTER TABLE ... RENAME` e deixar o servidor renomear os arquivos.)

**Sintaxe de linguagem geral**

+ Por padrão, as strings podem ser encerradas por `"` e também por `'`. Se o modo SQL `ANSI_QUOTES` estiver habilitado, as strings podem ser encerradas apenas por `'` e o servidor interpreta as strings encerradas por `"` como identificadores.

+ `\` é o caractere de escape em strings. + Em declarações SQL, você pode acessar tabelas de diferentes bancos de dados com a sintaxe *`db_name.tbl_name`*. Alguns servidores SQL fornecem a mesma funcionalidade, mas chamam isso de `User space`. O MySQL Server não suporta espaços de tabela, como os usados em declarações como esta: `CREATE TABLE ralph.my_table ... IN my_tablespace`.

**Sintaxe da declaração SQL**

+ As declarações `ANALYZE TABLE`, `CHECK TABLE`, `OPTIMIZE TABLE` e `REPAIR TABLE`.

+ As declarações `CREATE DATABASE`, `DROP DATABASE` e `ALTER DATABASE`. Veja a Seção 13.1.11, “Declaração CREATE DATABASE”, Seção 13.1.22, “Declaração DROP DATABASE” e Seção 13.1.1, “Declaração ALTER DATABASE”.

+ A declaração `DO`. + `EXPLAIN SELECT` para obter uma descrição de como as tabelas são processadas pelo otimizador de consulta.

+ As declarações `FLUSH` e `RESET`.

+ A declaração `SET`. Veja a Seção 13.7.4.1, “Sintaxe do SET para atribuição de variáveis”.

+ A declaração `SHOW`. Veja a Seção 13.7.5, “Declarações SHOW”. As informações produzidas por muitas das declarações `SHOW` específicas do MySQL podem ser obtidas de maneira mais padrão usando `SELECT` para consultar `INFORMATION_SCHEMA`. Veja o Capítulo 24, *Tabelas do SCHEMA DE INFORMAÇÃO*.

+ Uso de `LOAD DATA`. Em muitos casos, essa sintaxe é compatível com a Oracle `LOAD DATA`. Veja a Seção 13.2.6, “Instrução LOAD DATA”.

+ Uso de `RENAME TABLE`. Veja a Seção 13.1.33, “Instrução RENAME TABLE”.

+ Uso de `REPLACE` em vez de `DELETE` mais `INSERT`. Veja a Seção 13.2.8, “Instrução REPLACE”.

+ Uso de `CHANGE col_name`, `DROP col_name`, ou `DROP INDEX`, `IGNORE` ou `RENAME` em declarações `ALTER TABLE`. Uso de múltiplas cláusulas `ADD`, `ALTER`, `DROP`, ou `CHANGE` em uma declaração `ALTER TABLE`. Ver Seção 13.1.8, “Declaração ALTER TABLE”.

+ Uso de nomes de índice, índices em um prefixo de uma coluna e uso de `INDEX` ou `KEY` em declarações de `CREATE TABLE`. Veja a Seção 13.1.18, “Declaração CREATE TABLE”.

+ Uso de `TEMPORARY` ou `IF NOT EXISTS` com `CREATE TABLE`.

+ Uso de `IF EXISTS` com `DROP TABLE` e `DROP DATABASE`.

+ A capacidade de descartar várias tabelas com uma única declaração `DROP TABLE`.

+ As cláusulas `ORDER BY` e `LIMIT` das declarações `UPDATE` e `DELETE`.

+ `INSERT INTO tbl_name SET col_name = ...` sintaxe.

+ A cláusula `DELAYED` das declarações `INSERT` e `REPLACE`.

+ A cláusula `LOW_PRIORITY` das declarações `INSERT`, `REPLACE`, `DELETE` e `UPDATE`.

+ Uso de `INTO OUTFILE` ou `INTO DUMPFILE` nas declarações de `SELECT`. Ver Seção 13.2.9, “Instrução SELECT”.

+ Opções como `STRAIGHT_JOIN` ou `SQL_SMALL_RESULT` nas declarações de `SELECT`.

+ Você não precisa nomear todas as colunas selecionadas na cláusula `GROUP BY`. Isso oferece melhor desempenho para algumas consultas muito específicas, mas bastante normais. Veja a Seção 12.19, “Funções Agregadas”.

+ Você pode especificar `ASC` e `DESC` com `GROUP BY`, não apenas com `ORDER BY`.

+ A capacidade de definir variáveis em uma declaração com o operador de atribuição `:=`. Veja a Seção 9.4, “Variáveis Definidas pelo Usuário”.

**Tipos de dados**

+ Os tipos de dados `MEDIUMINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `SET` e `ENUM`, e os vários tipos de dados `BLOB` e `TEXT`.

+ Os atributos dos tipos de dados `AUTO_INCREMENT`, `BINARY`, `NULL`, `UNSIGNED` e `ZEROFILL`.

**Funções e operadores**

+ Para facilitar a migração de usuários de outros ambientes SQL, o MySQL Server suporta aliases para muitas funções. Por exemplo, todas as funções de string suportam tanto a sintaxe SQL padrão quanto a sintaxe ODBC.

O MySQL Server entende os operadores `||` e `&&` para significar OU lógico e E, como na linguagem de programação C. No MySQL Server, `||` e `OR` são sinônimos, assim como `&&` e `AND`. Devido a essa sintaxe agradável, o MySQL Server não suporta o operador padrão SQL `||` para concatenação de strings; use `CONCAT()` em vez disso. Como o `CONCAT()` aceita qualquer número de argumentos, é fácil converter o uso do operador `||` para o MySQL Server.

+ Uso de `COUNT(DISTINCT value_list)` quando *`value_list`* tem mais de um elemento.

+ As comparações de strings são sensíveis ao caso por padrão, com a ordem de classificação determinada pela codificação do conjunto de caracteres atual, que é `latin1` (cp1252 da Europa Ocidental) por padrão. Para realizar comparações sensíveis ao caso em vez disso, você deve declarar suas colunas com o atributo `BINARY` ou usar a transformação `BINARY`, que faz com que as comparações sejam feitas usando os valores dos códigos de caracteres subjacentes, em vez de uma ordem lexical.

+ O operador `%` é sinônimo de `MOD()`. Isso significa que `N % M` é equivalente a `MOD(N,M)`. `%` é compatível com programadores C e para compatibilidade com PostgreSQL.

Os operadores `=`, `<>`, `<=`, `<`, `>=`, `>`, `<<`, `>>`, `<=>`, `AND`, `OR` ou `LIKE` podem ser usados em expressões na lista de colunas de saída (à esquerda do `FROM`) em declarações de `SELECT`. Por exemplo:

  ```sql
  mysql> SELECT col1=1 AND col2=2 FROM my_table;
  ```

+ A função `LAST_INSERT_ID()` retorna o valor mais recente da `AUTO_INCREMENT`. Veja a Seção 12.15, “Funções de Informação”.

+ `LIKE` é permitido em valores numéricos.

+ Os operadores de expressão regular `REGEXP` e `NOT REGEXP` são extensões.

+ `CONCAT()` ou `CHAR()` com um argumento ou mais de dois argumentos. (No MySQL Server, essas funções podem receber um número variável de argumentos.)

as funções `BIT_COUNT()`, `CASE`, `ELT()`, `FROM_DAYS()`, `FORMAT()`, `IF()`, `PASSWORD()`, `ENCRYPT()`, `MD5()`, `ENCODE()`, `DECODE()`, `PERIOD_ADD()`, `PERIOD_DIFF()`, `TO_DAYS()` e `WEEKDAY()`.

+ Uso de `TRIM()` para cortar substratos. O SQL padrão suporta a remoção de apenas caracteres únicos.

+ As funções `GROUP BY` têm as funções `STD()`, `BIT_OR()`, `BIT_AND()`, `BIT_XOR()` e `GROUP_CONCAT()`. Veja a Seção 12.19, “Funções Agregadas”.

### 1.6.2 Diferenças entre MySQL e SQL Padrão

Tentamos fazer com que o MySQL Server siga o padrão ANSI SQL e o padrão ODBC SQL, mas o MySQL Server realiza operações de maneira diferente em alguns casos:

* Há várias diferenças entre os sistemas de privilégios MySQL e os sistemas de privilégios padrão do SQL. Por exemplo, no MySQL, os privilégios de uma tabela não são revogados automaticamente quando você exclui uma tabela. Você deve emitir explicitamente uma declaração `REVOKE` para revogar os privilégios de uma tabela. Para mais informações, consulte a Seção 13.7.1.6, “Declaração REVOKE”.

* A função `CAST()` não suporta cast para `REAL` (FLOAT, DOUBLE) ou `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT. Veja a Seção 12.10, “Funções e Operadores de Cast”.

#### 1.6.2.1 SELECT INTO TABLE Diferenças

O MySQL Server não suporta a extensão `SELECT ... INTO TABLE` do Sybase SQL. Em vez disso, o MySQL Server suporta a sintaxe SQL padrão `INSERT INTO ... SELECT`, que é basicamente a mesma coisa. Veja a Seção 13.2.5.1, “Instrução INSERT ... SELECT”. Por exemplo:

```sql
INSERT INTO tbl_temp2 (fld_id)
    SELECT tbl_temp1.fld_order_id
    FROM tbl_temp1 WHERE tbl_temp1.fld_order_id > 100;
```

Como alternativa, você pode usar `SELECT ... INTO OUTFILE` ou `CREATE TABLE ... SELECT`.

Você pode usar `SELECT ... INTO` com variáveis definidas pelo usuário. A mesma sintaxe também pode ser usada dentro de rotinas armazenadas usando cursor e variáveis locais. Veja a Seção 13.2.9.1, “Instrução SELECT ... INTO”.

#### 1.6.2.2 ATUALIZAÇÃO Diferenças

Se você acessar uma coluna da tabela que será atualizada em uma expressão, o `UPDATE` usa o valor atual da coluna. A segunda atribuição na declaração seguinte define o `col2` com o valor atual (atualizado) do `col1`, e não o valor original do `col1`. O resultado é que o `col1` e o `col2` têm o mesmo valor. Esse comportamento difere do SQL padrão.

```sql
UPDATE t1 SET col1 = col1 + 1, col2 = col1;
```

#### 1.6.2.3 Diferenças entre a restrição de chave estrangeira

A implementação do MySQL de restrições de chave estrangeira difere do padrão SQL nos seguintes aspectos-chave:

* Se houver várias strings na tabela principal com o mesmo valor da chave referenciada, `InnoDB` realiza uma verificação de chave estrangeira como se as outras strings da tabela principal com o mesmo valor da chave não existissem. Por exemplo, se você definir uma restrição de tipo `RESTRICT`, e houver uma string filha com várias strings da tabela principal, `InnoDB` não permite a exclusão de nenhuma das strings da tabela principal.

* Se `ON UPDATE CASCADE` ou `ON UPDATE SET NULL` recorrer para atualizar a *mesma tabela* que já havia atualizado durante a mesma cascata, ele age como `RESTRICT`. Isso significa que você não pode usar operações `ON UPDATE CASCADE` ou `ON UPDATE SET NULL` auto-referenciais. Isso é para evitar loops infinitos resultantes de atualizações cascatadas. Uma operação auto-referencial `ON DELETE SET NULL`, por outro lado, é possível, assim como uma auto-referencial `ON DELETE CASCADE`. As operações cascatadas não podem ser aninhadas em mais de 15 níveis de profundidade.

* Em uma declaração SQL que insere, exclui ou atualiza muitas strings, as restrições de chave estrangeira (como restrições únicas) são verificadas string por string. Ao realizar verificações de chave estrangeira, `InnoDB` define bloqueios compartilhados em nível de string em registros filhos ou parentes que ele deve examinar. O MySQL verifica as restrições de chave estrangeira imediatamente; o controle não é adiado para o commit da transação. De acordo com o padrão SQL, o comportamento padrão deve ser o controle adiado. Ou seja, as restrições são verificadas apenas após o *conjunto completo da declaração SQL* ter sido processado. Isso significa que não é possível excluir uma string que se refere a si mesma usando uma chave estrangeira.

* Nenhum mecanismo de armazenamento, incluindo `InnoDB`, reconhece ou aplica a cláusula `MATCH` usada nas definições de restrição de integridade referencial. O uso de uma cláusula explícita `MATCH` não tem o efeito especificado, e faz com que as cláusulas `ON DELETE` e `ON UPDATE` sejam ignoradas. Especificar a cláusula `MATCH` deve ser evitado.

A cláusula `MATCH` no padrão SQL controla como os valores de `NULL` em uma chave estrangeira composta (com várias colunas) são tratados ao comparar com uma chave primária na tabela referenciada. O MySQL essencialmente implementa a semântica definida por `MATCH SIMPLE`, que permite que uma chave estrangeira seja totalmente ou parcialmente `NULL`. Nesse caso, uma string (de uma tabela subordinada) contendo tal chave estrangeira pode ser inserida, mesmo que não corresponda a nenhuma string na tabela referenciada (matriz). (É possível implementar outras semânticas usando gatilhos.)

* O MySQL exige que as colunas referenciadas sejam indexadas por razões de desempenho. No entanto, o MySQL não exige que as colunas referenciadas sejam `UNIQUE` ou sejam declaradas `NOT NULL`.

Uma restrição `FOREIGN KEY` que faz referência a uma chave não `UNIQUE` não é SQL padrão, mas sim uma extensão `InnoDB`. O motor de armazenamento `NDB`, por outro lado, requer uma chave única explícita (ou chave primária) em qualquer coluna referenciada como chave estrangeira.

O manuseio de referências de chave estrangeira para chaves não únicas ou chaves que contêm valores `NULL` não está bem definido para operações como `UPDATE` ou `DELETE CASCADE`. Você é aconselhado a usar chaves estrangeiras que fazem referência apenas às chaves `UNIQUE` (incluindo `PRIMARY`) e `NOT NULL`.

* Para motores de armazenamento que não suportam chaves estrangeiras (como `MyISAM`), o MySQL Server analisa e ignora as especificações de chave estrangeira.

* O MySQL analisa, mas ignora as especificações "inline `REFERENCES`" (conforme definido no padrão SQL) onde as referências são definidas como parte da especificação da coluna. O MySQL aceita as cláusulas `REFERENCES` apenas quando especificadas como parte de uma especificação `FOREIGN KEY` separada.

Definir uma coluna para usar uma cláusula `REFERENCES tbl_name(col_name)` não tem efeito real e *serve apenas como uma nota ou comentário para você, indicando que a coluna que você está definindo atualmente é destinada a se referir a uma coluna em outra tabela*. É importante perceber quando usar essa sintaxe que:

+ O MySQL não realiza qualquer tipo de verificação para garantir que *`col_name`* realmente exista em *`tbl_name`* (ou até mesmo que *`tbl_name`* em si exista).

+ O MySQL não realiza nenhuma ação em *`tbl_name`* como a exclusão de strings em resposta a ações realizadas em strings da tabela que você está definindo; em outras palavras, essa sintaxe não induz nenhum comportamento de `ON DELETE` ou `ON UPDATE`. (Embora você possa escrever uma cláusula `ON DELETE` ou `ON UPDATE` como parte da cláusula `REFERENCES`, ela também é ignorada.)

+ Essa sintaxe cria uma *coluna*; ela **não** cria nenhum tipo de índice ou chave.

Você pode usar uma coluna assim criada como uma coluna de junção, como mostrado aqui:

  ```sql
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

Quando usado dessa forma, a cláusula `REFERENCES` não é exibida na saída de `SHOW CREATE TABLE` ou `DESCRIBE`:

  ```sql
  SHOW CREATE TABLE shirt\G
  *************************** 1. row ***************************
  Table: shirt
  Create Table: CREATE TABLE `shirt` (
  `id` smallint(5) unsigned NOT NULL auto_increment,
  `style` enum('t-shirt','polo','dress') NOT NULL,
  `color` enum('red','blue','orange','white','black') NOT NULL,
  `owner` smallint(5) unsigned NOT NULL,
  PRIMARY KEY  (`id`)
  ) ENGINE=MyISAM DEFAULT CHARSET=latin1
  ```

Para informações sobre restrições de chave estrangeira, consulte a Seção 13.1.18.5, “Restrições de chave estrangeira”.

#### 1.6.2.4 '--' como início de um comentário

O SQL padrão usa a sintaxe C `/* this is a comment */` para comentários, e o MySQL Server também suporta essa sintaxe. O MySQL também suporta extensões para essa sintaxe que permitem que SQL específico do MySQL seja incorporado no comentário; veja Seção 9.6, “Comentários”.

O MySQL Server também usa `#` como caractere de comentário inicial. Isso não é padrão.

O SQL padrão também usa “`--`” como uma sequência de comentário inicial. O MySQL Server suporta uma variante do estilo de comentário `--`; a sequência de comentário inicial `--` é aceita como tal, mas deve ser seguida por um caractere de espaço, como um espaço ou uma nova string. O espaço é destinado a evitar problemas com consultas SQL geradas que utilizam construções como as seguintes, que atualizam o saldo para refletir uma cobrança:

```sql
UPDATE account SET balance=balance-charge
WHERE account_id=user_id
```

Considere o que acontece quando `charge` tem um valor negativo, como `-1`, que pode ser o caso quando um valor é creditado na conta. Neste caso, a declaração gerada parece assim:

```sql
UPDATE account SET balance=balance--1
WHERE account_id=5752;
```

`balance--1` é um padrão SQL válido, mas `--` é interpretado como o início de um comentário, e parte da expressão é descartada. O resultado é uma declaração que tem um significado completamente diferente do que se pretendia:

```sql
UPDATE account SET balance=balance
WHERE account_id=5752;
```

Essa declaração não produz nenhuma alteração de valor. Para evitar que isso aconteça, o MySQL exige um caractere de espaço em branco após o `--` para que ele seja reconhecido como uma sequência de comentário inicial no MySQL Server, para que uma expressão como `balance--1` seja sempre segura para uso.

### 1.6.3 Como o MySQL lida com restrições

O MySQL permite que você trabalhe tanto com tabelas transacionais que permitem o cancelamento, quanto com tabelas não transacionais que não permitem. Por isso, o tratamento de restrições é um pouco diferente no MySQL do que em outros DBMSs. Devemos lidar com o caso em que você inseriu ou atualizou muitas strings em uma tabela não transacional para a qual as alterações não podem ser canceladas quando ocorre um erro.

A filosofia básica é que o MySQL Server tenta produzir um erro para qualquer coisa que ele possa detectar durante a análise de uma declaração a ser executada e tenta se recuperar de quaisquer erros que ocorram durante a execução da declaração. Fazemos isso na maioria dos casos, mas ainda não para todos.

As opções que o MySQL tem quando ocorre um erro são parar a declaração no meio ou recuperar o melhor possível do problema e continuar. Por padrão, o servidor segue o último curso. Isso significa, por exemplo, que o servidor pode forçar valores inválidos para os valores válidos mais próximos.

Várias opções de modo SQL estão disponíveis para fornecer maior controle sobre o tratamento de valores de dados inválidos e se continuar a execução da declaração ou abortar quando ocorrerem erros. Usando essas opções, você pode configurar o MySQL Server para agir de uma maneira mais tradicional, semelhante a outros DBMSs que rejeitam entradas inadequadas. O modo SQL pode ser configurado globalmente na inicialização do servidor para afetar todos os clientes. Clientes individuais podem configurar o modo SQL em tempo de execução, o que permite que cada cliente selecione o comportamento mais apropriado para suas necessidades. Veja a Seção 5.1.10, “Modos SQL do Servidor”.

As seções a seguir descrevem como o MySQL Server lida com diferentes tipos de restrições.

#### 1.6.3.1 Constrangimentos de Índices PRIMARY KEY e UNIQUE

Normalmente, erros ocorrem em declarações de mudança de dados (como `INSERT` ou `UPDATE`) que violariam restrições de chave primária, chave única ou chave estrangeira. Se você estiver usando um motor de armazenamento transacional, como `InnoDB`, o MySQL automaticamente desfaz a declaração. Se você estiver usando um motor de armazenamento não transacional, o MySQL para o processamento da declaração na string para a qual o erro ocorreu e deixa quaisquer strings restantes não processadas.

O MySQL suporta uma palavra-chave `IGNORE` para `INSERT`, `UPDATE`, e assim por diante. Se você a usar, o MySQL ignora violações de chave primária ou única e continua processando com a próxima string. Veja a seção para a declaração que você está usando (Seção 13.2.5, “Declaração de Inserção”, Seção 13.2.11, “Declaração de Atualização”, e assim por diante).

Você pode obter informações sobre o número de strings que foram inseridas ou atualizadas na verdade com a função `mysql_info()` da API C. Você também pode usar a declaração `SHOW WARNINGS`. Veja `mysql_info()`, e Seção 13.7.5.40, “Declaração SHOW WARNINGS”.

As tabelas `InnoDB` e `NDB` suportam chaves estrangeiras. Veja a Seção 1.6.3.2, “Restrições de chave estrangeira”.

#### 1.6.3.2 Restrições de Chave Estrangeira

As chaves estrangeiras permitem que você faça referência cruzada a dados relacionados entre tabelas, e as restrições de chave estrangeira ajudam a manter esses dados dispersos consistentes.

O MySQL suporta as referências de chave estrangeira `ON UPDATE` e `ON DELETE` nas declarações `CREATE TABLE` e `ALTER TABLE`. As ações referenciais disponíveis são `RESTRICT` (a padrão), `CASCADE`, `SET NULL` e `NO ACTION`.

`SET DEFAULT` também é suportada pelo MySQL Server, mas atualmente é rejeitada como inválida pelo `InnoDB`. Como o MySQL não suporta verificação de restrições diferida, `NO ACTION` é tratado como `RESTRICT`. Para a sintaxe exata suportada pelo MySQL para chaves estrangeiras, consulte a Seção 13.1.18.5, “Restrições de CHAVE ESTRANGEIRA”.

`MATCH FULL`, `MATCH PARTIAL` e `MATCH SIMPLE` são permitidos, mas seu uso deve ser evitado, pois eles fazem com que o MySQL Server ignore qualquer cláusula `ON DELETE` ou `ON UPDATE` usada na mesma declaração. As opções `MATCH` não têm nenhum outro efeito no MySQL, que, na verdade, impõe a semântica `MATCH SIMPLE` em tempo integral.

O MySQL exige que as colunas de chave estrangeira sejam indexadas; se você criar uma tabela com uma restrição de chave estrangeira, mas sem índice em uma coluna específica, um índice é criado.

Você pode obter informações sobre chaves estrangeiras da tabela do esquema de informações `KEY_COLUMN_USAGE`. Um exemplo de consulta contra essa tabela é mostrado aqui:

```sql
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

Informações sobre chaves estrangeiras nas tabelas `InnoDB` também podem ser encontradas nas tabelas `INNODB_SYS_FOREIGN` e `INNODB_SYS_FOREIGN_COLS`, no banco de dados `INFORMATION_SCHEMA`.

As tabelas `InnoDB` e `NDB` suportam chaves estrangeiras.

#### 1.6.3.3 Restrições para dados inválidos

O MySQL 5.7.5 e versões posteriores usam o modo SQL estrito por padrão, que trata valores inválidos de forma que o servidor os rejeita e interrompe a declaração na qual ocorrem (veja Seção 5.1.10, “Modos SQL do servidor”). Anteriormente, o MySQL era muito mais indulgente com valores incorretos usados na entrada de dados; isso agora exige a desativação do modo estrito, o que não é recomendado. O restante desta seção discute o comportamento antigo seguido pelo MySQL quando o modo estrito foi desativado.

Se você não estiver usando o modo estrito, então, sempre que você inserir um valor “incorreto” em uma coluna, como um `NULL` em uma coluna `NOT NULL` ou um valor numérico muito grande em uma coluna numérica, o MySQL define a coluna para o “melhor valor possível” em vez de produzir um erro: As seguintes regras descrevem mais detalhadamente como isso funciona:

* Se você tentar armazenar um valor fora do intervalo em uma coluna numérica, o MySQL Server armazena, em vez disso, zero, o menor valor possível, ou o maior valor possível, o que for mais próximo do valor inválido.

* Para cadeias de caracteres, o MySQL armazena ou a cadeia de caracteres vazia ou o máximo da cadeia de caracteres que pode ser armazenada na coluna.

* Se você tentar armazenar uma string que não começa com um número em uma coluna numérica, o MySQL Server armazena 0.

* Os valores inválidos para as colunas `ENUM` e `SET` são tratados conforme descrito na Seção 1.6.3.4, “Restrições ENUM e SET”.

* O MySQL permite que você armazene certos valores de data incorretos nas colunas `DATE` e `DATETIME` (como `'2000-02-31'` ou `'2000-02-00'`). Neste caso, quando um aplicativo não habilitou o modo SQL rigoroso, cabe ao aplicativo validar as datas antes de armazená-las. Se o MySQL puder armazenar um valor de data e recuperar exatamente o mesmo valor, o MySQL o armazena como dado. Se a data estiver totalmente errada (fora da capacidade do servidor de armazená-la), o valor especial de data "zero" `'0000-00-00'` é armazenado na coluna em vez disso.

* Se você tentar armazenar `NULL` em uma coluna que não aceita valores de `NULL`, ocorrerá um erro para declarações `INSERT` de uma única string. Para declarações `INSERT` de várias strings ou para declarações `INSERT INTO ... SELECT`, o MySQL Server armazena o valor padrão implícito para o tipo de dados da coluna. Em geral, isso é `0` para tipos numéricos, a string vazia (`''`) para tipos de string e o valor “zero” para tipos de data e hora. Os valores padrão implícitos são discutidos na Seção 11.6, “Valores padrão de tipo de dados”.

* Se uma declaração `INSERT` especificar nenhum valor para uma coluna, o MySQL insere seu valor padrão se a definição da coluna incluir uma cláusula explícita `DEFAULT`. Se a definição não tiver tal cláusula `DEFAULT`, o MySQL insere o valor padrão implícito para o tipo de dados da coluna.

A razão para usar as regras anteriores quando o modo estrito não está em vigor é que não podemos verificar essas condições até que a declaração tenha começado a ser executada. Não podemos simplesmente reverter se encontrarmos um problema após atualizar algumas strings, porque o mecanismo de armazenamento pode não suportar o rollback. A opção de terminar a declaração não é muito boa; neste caso, a atualização seria “metade feita”, o que é provavelmente o pior cenário possível. Neste caso, é melhor “fazer o melhor que você pode” e, em seguida, continuar como se nada tivesse acontecido.

Você pode selecionar um tratamento mais rigoroso dos valores de entrada usando os modos SQL `STRICT_TRANS_TABLES` ou `STRICT_ALL_TABLES`:

```sql
SET sql_mode = 'STRICT_TRANS_TABLES';
SET sql_mode = 'STRICT_ALL_TABLES';
```

`STRICT_TRANS_TABLES` permite o modo estrito para motores de armazenamento transacional e, também, até certo ponto, para motores não transacionais. Funciona da seguinte forma:

* Para motores de armazenamento transacional, valores de dados ruins que ocorram em qualquer parte de uma declaração fazem com que a declaração seja interrompida e revertida.

* Para motores de armazenamento não transacionais, uma declaração é interrompida se o erro ocorrer na primeira string a ser inserida ou atualizada. (Quando o erro ocorre na primeira string, a declaração pode ser interrompida para deixar a tabela inalterada, assim como para uma tabela transacional.) Erros em strings após a primeira não interrompem a declaração, porque a tabela já foi alterada pela primeira string. Em vez disso, os valores de dados incorretos são ajustados e resultam em avisos em vez de erros. Em outras palavras, com `STRICT_TRANS_TABLES`, um valor errado faz com que o MySQL reaja a todos os atualizações feitas até então, se isso puder ser feito sem alterar a tabela. Mas, uma vez que a tabela tenha sido alterada, erros adicionais resultam em ajustes e avisos.

Para verificações ainda mais rigorosas, habilite `STRICT_ALL_TABLES`. Isso é o mesmo que `STRICT_TRANS_TABLES`, exceto que, para motores de armazenamento não transacionais, os erros abortam a declaração mesmo para dados ruins nas strings que seguem a primeira string. Isso significa que, se um erro ocorrer em meio a uma inserção ou atualização de várias strings para uma tabela não transacional, um update parcial resulta. As strings anteriores são inseridas ou atualizadas, mas as que estão no ponto do erro não são. Para evitar isso em tabelas não transacionais, use declarações de uma única string ou, caso as advertências de conversão sejam aceitáveis em vez de erros, use [[`STRICT_TRANS_TABLES`]. Para evitar problemas desde o início, não use o MySQL para verificar o conteúdo das colunas. É mais seguro (e muitas vezes mais rápido) deixar que o aplicativo garanta que ele envie apenas valores válidos para o banco de dados.

Com qualquer uma das opções de modo rigoroso, você pode fazer com que os erros sejam tratados como avisos usando `INSERT IGNORE` ou `UPDATE IGNORE` em vez de `INSERT` ou `UPDATE` sem `IGNORE`.

#### 1.6.3.4 Restrições de ENUM e SET

As colunas `ENUM` e `SET` fornecem uma maneira eficiente de definir colunas que podem conter apenas um conjunto específico de valores. Veja a Seção 11.3.5, “O Tipo ENUM”, e a Seção 11.3.6, “O Tipo SET”.

A menos que o modo estrito seja desativado (não é recomendado, mas veja a Seção 5.1.10, “Modos SQL do servidor”), a definição de uma coluna `ENUM` ou `SET` atua como uma restrição para os valores inseridos na coluna. Um erro ocorre para valores que não satisfazem essas condições:

* Um valor `ENUM` deve ser um dos listados na definição da coluna, ou o equivalente numérico interno do mesmo. O valor não pode ser o valor de erro (ou seja, 0 ou a string vazia). Para uma coluna definida como `ENUM('a','b','c')`, valores como `''`, `'d'` ou `'ax'` são inválidos e são rejeitados.

* Um valor `SET` deve ser uma string vazia ou um valor que consista apenas nos valores listados na definição da coluna, separados por vírgulas. Para uma coluna definida como `SET('a','b','c')`, valores como `'d'` ou `'a,b,c,d'` são inválidos e são rejeitados.

Os erros por valores inválidos podem ser suprimidos no modo estrito se você usar `INSERT IGNORE` ou `UPDATE IGNORE`. Neste caso, um aviso é gerado em vez de um erro. Para `ENUM`, o valor é inserido como o membro de erro (`0`). Para `SET`, o valor é inserido conforme dado, exceto que quaisquer substratos inválidos são excluídos. Por exemplo, `'a,x,b,y'` resulta em um valor de `'a,b'`.