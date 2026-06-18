#### 15.1.20.10 Colunas Invisíveis

O MySQL suporta colunas invisíveis a partir do MySQL 8.0.23. Uma coluna invisível é normalmente oculta para consultas, mas pode ser acessada se referida explicitamente. Antes do MySQL 8.0.23, todas as colunas são visíveis.

Como ilustração de quando colunas invisíveis podem ser úteis, suponha que um aplicativo use consultas `SELECT *` para acessar uma tabela e precise continuar funcionando sem modificações, mesmo se a tabela for alterada para adicionar uma nova coluna que o aplicativo não espera que esteja lá. Em uma consulta `SELECT *`, o `*` avalia todas as colunas da tabela, exceto aquelas que são invisíveis, então a solução é adicionar a nova coluna como uma coluna invisível. A coluna permanece "oculta" das consultas `SELECT *`, e o aplicativo continua funcionando como antes. Uma versão mais recente do aplicativo pode referenciar a coluna invisível, se necessário, fazendo referência explícita a ela.

As seções a seguir detalham como o MySQL trata as colunas invisíveis.

- Declarações DDL e Colunas Invisíveis
- Declarações DML e Colunas Invisíveis
- Metadados da Coluna Invisível
- O Log Binário e as Colunas Invisíveis

##### Declarações DDL e Colunas Invisíveis

As colunas são visíveis por padrão. Para especificar explicitamente a visibilidade de uma nova coluna, use uma palavra-chave `VISIBLE` ou `INVISIBLE` como parte da definição da coluna para `CREATE TABLE` ou `ALTER TABLE`:

```
CREATE TABLE t1 (
  i INT,
  j DATE INVISIBLE
) ENGINE = InnoDB;
ALTER TABLE t1 ADD COLUMN k INT INVISIBLE;
```

Para alterar a visibilidade de uma coluna existente, use uma palavra-chave `VISIBLE` ou `INVISIBLE` com uma das cláusulas de modificação de coluna `ALTER TABLE`:

```
ALTER TABLE t1 CHANGE COLUMN j j DATE VISIBLE;
ALTER TABLE t1 MODIFY COLUMN j DATE INVISIBLE;
ALTER TABLE t1 ALTER COLUMN j SET VISIBLE;
```

Uma tabela deve ter pelo menos uma coluna visível. Tentar tornar todas as colunas invisíveis produz um erro.

Colunas invisíveis suportam os atributos comuns das colunas: `NULL`, `NOT NULL`, `AUTO_INCREMENT` e assim por diante.

As colunas geradas podem ser invisíveis.

As definições de índice podem nomear colunas invisíveis, incluindo definições para índices `PRIMARY KEY` e `UNIQUE`. Embora uma tabela deva ter pelo menos uma coluna visível, uma definição de índice não precisa ter nenhuma coluna visível.

Uma coluna invisível que cai de uma tabela é removida da forma usual de qualquer definição de índice que nomeie a coluna.

As restrições de chave estrangeira podem ser definidas em colunas invisíveis, e as restrições de chave estrangeira podem referenciar colunas invisíveis.

As restrições `CHECK` podem ser definidas em colunas invisíveis. Para novas ou modificadas linhas, a violação de uma restrição `CHECK` em uma coluna invisível produz um erro.

`CREATE TABLE ... LIKE` inclui colunas invisíveis, e elas são invisíveis na nova tabela.

`CREATE TABLE ... SELECT` não inclui colunas invisíveis, a menos que sejam explicitamente referenciadas na parte `SELECT`. No entanto, mesmo que explicitamente referenciadas, uma coluna que é invisível na tabela existente será visível na nova tabela:

```
mysql> CREATE TABLE t1 (col1 INT, col2 INT INVISIBLE);
mysql> CREATE TABLE t2 AS SELECT col1, col2 FROM t1;
mysql> SHOW CREATE TABLE t2\G
*************************** 1. row ***************************
       Table: t2
Create Table: CREATE TABLE `t2` (
  `col1` int DEFAULT NULL,
  `col2` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```

Se a invisibilidade deve ser preservada, forneça uma definição para a coluna invisível na parte `CREATE TABLE` da declaração `CREATE TABLE ... SELECT`:

```
mysql> CREATE TABLE t1 (col1 INT, col2 INT INVISIBLE);
mysql> CREATE TABLE t2 (col2 INT INVISIBLE) AS SELECT col1, col2 FROM t1;
mysql> SHOW CREATE TABLE t2\G
*************************** 1. row ***************************
       Table: t2
Create Table: CREATE TABLE `t2` (
  `col1` int DEFAULT NULL,
  `col2` int DEFAULT NULL /*!80023 INVISIBLE */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```

As visualizações podem se referir a colunas invisíveis ao referenciá-las explicitamente na declaração `SELECT` que define a visualização. Alterar a visibilidade de uma coluna após definir uma visualização que a referencia não altera o comportamento da visualização.

##### Declarações DML e Colunas Invisíveis

Para as declarações `SELECT`, uma coluna invisível não faz parte do conjunto de resultados, a menos que seja explicitamente referenciada na lista de seleção. Em uma lista de seleção, as abreviações `*` e `tbl_name.*` não incluem colunas invisíveis. As junções naturais não incluem colunas invisíveis.

Considere a seguinte sequência de afirmações:

```
mysql> CREATE TABLE t1 (col1 INT, col2 INT INVISIBLE);
mysql> INSERT INTO t1 (col1, col2) VALUES(1, 2), (3, 4);

mysql> SELECT * FROM t1;
+------+
| col1 |
+------+
|    1 |
|    3 |
+------+

mysql> SELECT col1, col2 FROM t1;
+------+------+
| col1 | col2 |
+------+------+
|    1 |    2 |
|    3 |    4 |
+------+------+
```

O primeiro `SELECT` não faz referência à coluna invisível `col2` na lista de seleção (porque `*` não inclui colunas invisíveis), então `col2` não aparece no resultado da declaração. O segundo `SELECT` faz referência explícita a `col2`, então a coluna aparece no resultado.

A declaração `TABLE t1` produz o mesmo resultado que a primeira declaração `SELECT`. Como não há como especificar colunas em uma declaração `TABLE`, a `TABLE` nunca exibe colunas invisíveis.

Para declarações que criam novas linhas, uma coluna invisível recebe seu valor padrão implícito, a menos que seja explicitamente referenciada e atribuída um valor. Para informações sobre o tratamento de valores padrão implícitos, consulte Tratamento de Valores Padrão Implícitos.

Para `INSERT` (e `REPLACE`, para linhas não substituídas), a atribuição padrão implícita ocorre com uma lista de colunas ausente, uma lista de colunas vazia ou uma lista de colunas não vazia que não inclui a coluna invisível:

```
CREATE TABLE t1 (col1 INT, col2 INT INVISIBLE);
INSERT INTO t1 VALUES(...);
INSERT INTO t1 () VALUES(...);
INSERT INTO t1 (col1) VALUES(...);
```

Para as duas primeiras declarações `INSERT`, a lista `VALUES()` deve fornecer um valor para cada coluna visível e nenhuma coluna invisível. Para a terceira declaração `INSERT`, a lista `VALUES()` deve fornecer o mesmo número de valores que o número de colunas nomeadas; o mesmo vale quando você usa `VALUES ROW()` em vez de `VALUES()`.

Para `LOAD DATA` e `LOAD XML`, a atribuição padrão implícita ocorre com uma lista de colunas ausente ou uma lista de colunas não vazia que não inclui a coluna invisível. As linhas de entrada não devem incluir um valor para a coluna invisível.

Para atribuir um valor diferente do padrão implícito para as declarações anteriores, nomeie explicitamente a coluna invisível na lista de colunas e forneça um valor para ela.

`INSERT INTO ... SELECT *` e `REPLACE INTO ... SELECT *` não incluem colunas invisíveis porque `*` não inclui colunas invisíveis. A atribuição padrão implícita ocorre conforme descrito anteriormente.

Para declarações que inserem ou ignoram novas linhas, ou que substituem ou modificam linhas existentes, com base em valores em um índice `PRIMARY KEY` ou `UNIQUE`, o MySQL trata as colunas invisíveis da mesma forma que as colunas visíveis: As colunas invisíveis participam de comparações de valores de chave. Especificamente, se uma nova linha tiver o mesmo valor que uma linha existente para um valor de chave único, esses comportamentos ocorrem independentemente se as colunas do índice são visíveis ou invisíveis:

- Com o modificador `IGNORE`, `INSERT`, `LOAD DATA` e `LOAD XML`, ignore a nova linha.

- `REPLACE` substitui a linha existente pela nova linha. Com o modificador `REPLACE`, `LOAD DATA` e `LOAD XML` fazem o mesmo.

- `INSERT ... ON DUPLICATE KEY UPDATE` atualiza a linha existente.

Para atualizar colunas invisíveis para declarações `UPDATE`, nomeie-as e atribua um valor, assim como para colunas visíveis.

##### Metadados da Coluna Invisível

Informações sobre se uma coluna é visível ou invisível estão disponíveis na coluna `EXTRA` da tabela Schema de Informações `COLUMNS` ou na saída `SHOW COLUMNS`. Por exemplo:

```
mysql> SELECT TABLE_NAME, COLUMN_NAME, EXTRA
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = 'test' AND TABLE_NAME = 't1';
+------------+-------------+-----------+
| TABLE_NAME | COLUMN_NAME | EXTRA     |
+------------+-------------+-----------+
| t1         | i           |           |
| t1         | j           |           |
| t1         | k           | INVISIBLE |
+------------+-------------+-----------+
```

As colunas são visíveis por padrão, portanto, nesse caso, `EXTRA` não exibe informações de visibilidade. Para colunas invisíveis, `EXTRA` exibe `INVISIBLE`.

`SHOW CREATE TABLE` exibe colunas invisíveis na definição da tabela, com a palavra-chave `INVISIBLE` em um comentário específico da versão:

```
mysql> SHOW CREATE TABLE t1\G
*************************** 1. row ***************************
       Table: t1
Create Table: CREATE TABLE `t1` (
  `i` int DEFAULT NULL,
  `j` int DEFAULT NULL,
  `k` int DEFAULT NULL /*!80023 INVISIBLE */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```

O **mysqldump** e `mysqlpump` usam `SHOW CREATE TABLE`, então eles incluem colunas invisíveis nas definições de tabelas descarregadas. Eles também incluem valores de colunas invisíveis nos dados descarregados.

Ao recarregar um arquivo de dump em uma versão mais antiga do MySQL que não suporta colunas invisíveis, o comentário específico da versão é ignorado, o que torna as colunas invisíveis visíveis.

##### O Log Binário e as Colunas Invisíveis

O MySQL trata as colunas invisíveis da seguinte forma em relação aos eventos no log binário:

- Os eventos de criação de tabelas incluem o atributo `INVISIBLE` para colunas invisíveis.

- Colunas invisíveis são tratadas como colunas visíveis em eventos de linha. Elas são incluídas conforme necessário, de acordo com a configuração da variável de sistema `binlog_row_image`.

- Quando eventos de linha são aplicados, as colunas invisíveis são tratadas como colunas visíveis em eventos de linha. Em particular, o algoritmo e o índice a serem usados são escolhidos de acordo com a configuração da variável de sistema `slave_rows_search_algorithms`.

- Colunas invisíveis são tratadas como colunas visíveis ao calcular sets de escrita. Em particular, os sets de escrita incluem índices definidos em colunas invisíveis.

- O comando **mysqlbinlog** inclui a visibilidade nos metadados das colunas.
