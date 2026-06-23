## 26.6 Restrições e Limitações sobre Partição

Esta seção discute as restrições e limitações atuais sobre o suporte à partição do MySQL.

**Construções proibidas.** As seguintes construções não são permitidas em expressões de particionamento:

* Procedimentos armazenados, funções armazenadas, funções carregáveis ou plugins.

* Variáveis declaradas ou variáveis do usuário.

Para uma lista de funções SQL que são permitidas em expressões de particionamento, consulte a Seção 26.6.3, “Limitações de particionamento relacionadas a funções”.

Operadores aritméticos e lógicos.

O uso dos operadores aritméticos `+`, `-` e `*` é permitido em expressões de particionamento. No entanto, o resultado deve ser um valor inteiro ou `NULL` (exceto no caso da particionamento `[LINEAR] KEY`, conforme discutido em outra parte deste capítulo; consulte a Seção 26.2, “Tipos de particionamento”, para mais informações).

O operador `DIV` também é suportado; o operador `/` não é permitido.

Os operadores de bits `|`, `&`, `^`, `<<`, `>>` e `~` não são permitidos em expressões de particionamento.

Modo SQL do servidor.

As tabelas que empregam partição definida pelo usuário não preservam o modo SQL em vigor no momento em que foram criadas. Como discutido em outros lugares deste Manual (veja a Seção 7.1.11, “Modos SQL do servidor”), os resultados de muitas funções e operadores do MySQL podem mudar de acordo com o modo SQL do servidor. Portanto, uma mudança no modo SQL em qualquer momento após a criação de tabelas particionadas pode levar a mudanças significativas no comportamento dessas tabelas, e facilmente pode levar à corrupção ou perda de dados. Por essas razões, **é fortemente recomendado que você nunca mude o modo SQL do servidor após criar tabelas particionadas**.

Para uma dessas mudanças no modo SQL do servidor que torna tabelas particionadas inutilizáveis, considere a seguinte declaração `CREATE TABLE`, que pode ser executada com sucesso apenas se o modo `NO_UNSIGNED_SUBTRACTION` estiver em vigor:

```
mysql> SELECT @@sql_mode;
+------------+
| @@sql_mode |
+------------+
|            |
+------------+
1 row in set (0.00 sec)

mysql> CREATE TABLE tu (c1 BIGINT UNSIGNED)
    ->   PARTITION BY RANGE(c1 - 10) (
    ->     PARTITION p0 VALUES LESS THAN (-5),
    ->     PARTITION p1 VALUES LESS THAN (0),
    ->     PARTITION p2 VALUES LESS THAN (5),
    ->     PARTITION p3 VALUES LESS THAN (10),
    ->     PARTITION p4 VALUES LESS THAN (MAXVALUE)
    -> );
ERROR 1563 (HY000): Partition constant is out of partition function domain

mysql> SET sql_mode='NO_UNSIGNED_SUBTRACTION';
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT @@sql_mode;
+-------------------------+
| @@sql_mode              |
+-------------------------+
| NO_UNSIGNED_SUBTRACTION |
+-------------------------+
1 row in set (0.00 sec)

mysql> CREATE TABLE tu (c1 BIGINT UNSIGNED)
    ->   PARTITION BY RANGE(c1 - 10) (
    ->     PARTITION p0 VALUES LESS THAN (-5),
    ->     PARTITION p1 VALUES LESS THAN (0),
    ->     PARTITION p2 VALUES LESS THAN (5),
    ->     PARTITION p3 VALUES LESS THAN (10),
    ->     PARTITION p4 VALUES LESS THAN (MAXVALUE)
    -> );
Query OK, 0 rows affected (0.05 sec)
```

Se você remover o modo SQL do servidor `NO_UNSIGNED_SUBTRACTION` após criar o `tu`, você pode não conseguir mais acessar essa tabela:

```
mysql> SET sql_mode='';
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT * FROM tu;
ERROR 1563 (HY000): Partition constant is out of partition function domain
mysql> INSERT INTO tu VALUES (20);
ERROR 1563 (HY000): Partition constant is out of partition function domain
```

Veja também a Seção 7.1.11, “Modos SQL do servidor”.

Os modos do SQL do servidor também afetam a replicação de tabelas particionadas. Modos SQL distintos na fonte e na replica podem levar a expressões de particionamento a serem avaliadas de maneira diferente; isso pode causar a distribuição dos dados entre as partições a ser diferente nas cópias da fonte e da replica de uma tabela dada, e pode até causar inserções em tabelas particionadas que têm sucesso na fonte, mas falham na replica. Para obter os melhores resultados, você deve sempre usar o mesmo modo do SQL do servidor na fonte e na replica.

**Considerações sobre o desempenho.** Algumas das consequências das operações de particionamento no desempenho são apresentadas na lista a seguir:

* **Operações do sistema de arquivos.** As operações de particionamento e re-particionamento (como `ALTER TABLE` com `PARTITION BY ...`, `REORGANIZE PARTITION` ou `REMOVE PARTITIONING`) dependem de operações do sistema de arquivos para sua implementação. Isso significa que a velocidade dessas operações é afetada por fatores como o tipo e as características do sistema de arquivos, a velocidade do disco, o espaço de troca, a eficiência de manipulação de arquivos do sistema operacional e as opções e variáveis do servidor MySQL relacionadas à manipulação de arquivos. Em particular, você deve garantir que `large_files_support` esteja habilitado e que `open_files_limit` esteja configurado corretamente. As operações de particionamento e re-particionamento que envolvem tabelas de `InnoDB` podem ser mais eficientes ao habilitar `innodb_file_per_table`.

Veja também o número máximo de partições.

* **Blocos de tabela.** Geralmente, o processo que executa uma operação de particionamento em uma tabela obtém um bloqueio de escrita na tabela. As leituras dessas tabelas são relativamente não afetadas; as operações pendentes `INSERT` e `UPDATE` são realizadas assim que a operação de particionamento tiver sido concluída. Para exceções específicas do `InnoDB` a essa limitação, consulte Operações de Particionamento.

* **Indeks; poda de partições.** Assim como em tabelas não particionadas, o uso adequado de índices pode acelerar significativamente as consultas em tabelas particionadas. Além disso, projetar tabelas particionadas e consultas nessas tabelas para aproveitar a poda de partições pode melhorar o desempenho de forma dramática. Consulte a Seção 26.4, “Poda de Partições”, para mais informações.

O empurrão de condição de índice é suportado para tabelas particionadas. Consulte a Seção 10.2.1.6, “Otimização do Empurrão de Condição de Índice”.

* **Desempenho com LOAD DATA.** No MySQL 8.0, `LOAD DATA` usa bufferização para melhorar o desempenho. Você deve estar ciente de que o buffer usa 130 KB de memória por partição para alcançar isso.

**Número máximo de partições.** O número máximo possível de partições para uma tabela específica que não utiliza o mecanismo de armazenamento `NDB` é

1. Este número inclui subdivisões.

O número máximo de partições definidas pelo usuário para uma tabela usando o mecanismo de armazenamento `NDB` é determinado de acordo com a versão do software NDB Cluster que está sendo usada, o número de nós de dados e outros fatores. Consulte NDB e partição definida pelo usuário, para mais informações.

Se, ao criar tabelas com um grande número de partições (mas menos que o máximo), você encontrar uma mensagem de erro, como Got error ... from storage engine: Out of resources when opening file, você pode ser capaz de resolver o problema aumentando o valor da variável de sistema `open_files_limit`. No entanto, isso depende do sistema operacional e pode não ser possível ou aconselhável em todas as plataformas; consulte a Seção B.3.2.16, “File Not Found and Similar Errors”, para mais informações. Em alguns casos, o uso de um grande número (centenas) de partições também pode não ser aconselhável devido a outras preocupações, portanto, o uso de mais partições não leva automaticamente a melhores resultados.

Veja também Operações do sistema de arquivos.

**Chaves estrangeiras não são suportadas para tabelas particionadas do InnoDB.** Tabelas particionadas usando o mecanismo de armazenamento `InnoDB` não suportam chaves estrangeiras. Mais especificamente, isso significa que as seguintes duas afirmações são verdadeiras:

1. Nenhuma definição de uma tabela `InnoDB` que utilize partição definida pelo usuário pode conter referências de chave estrangeira; nenhuma tabela `InnoDB` cuja definição contenha referências de chave estrangeira pode ser particionada.

2. Nenhuma definição de tabela `InnoDB` pode conter uma referência de chave estrangeira para uma tabela particionada por usuário; nenhuma tabela `InnoDB` com particionamento definido pelo usuário pode conter colunas referenciadas por chaves estrangeiras.

O escopo das restrições listadas acima inclui todas as tabelas que utilizam o mecanismo de armazenamento `InnoDB`. As declarações `CREATE TABLE` e `ALTER TABLE` que resultarão em tabelas que violam essas restrições não são permitidas.

**ALTER TABLE ... ORDER BY.** Uma declaração `ALTER TABLE ... ORDER BY column` executada em uma tabela particionada faz com que as linhas sejam ordenadas apenas dentro de cada particionamento.

**ADICAR COLUNA ... ALGORITMO=IMMEDIATO.** Uma vez que você realize `ALTER TABLE ... ADD COLUMN ... ALGORITHM=INSTANT` em uma tabela particionada, não é mais possível trocar as particionamentos com essa tabela.

**Efeitos nas declarações REPLACE por modificação de chaves primárias.** Em alguns casos, pode ser desejável (ver Seção 26.6.1, “Chaves de Partição, Chaves Primárias e Chaves Únicas”) modificar a chave primária de uma tabela. Esteja ciente de que, se sua aplicação utiliza declarações `REPLACE` e você fizer isso, os resultados dessas declarações podem ser drasticamente alterados. Consulte a Seção 15.2.12, “Declaração REPLACE”, para mais informações e um exemplo.

**Índices FULLTEXT.** As tabelas particionadas não suportam índices ou pesquisas `FULLTEXT`.

**Colunas espaciais.** Colunas com tipos de dados espaciais, como `POINT` ou `GEOMETRY`, não podem ser usadas em tabelas particionadas.

Tabelas temporárias. As tabelas temporárias não podem ser divididas.

**Tabelas de registro.** Não é possível particionar as tabelas de registro; uma declaração `ALTER TABLE ... PARTITION BY ...` em uma tabela desse tipo falha com um erro.

**Tipo de dados do chave de particionamento.** Uma chave de particionamento deve ser uma coluna inteira ou uma expressão que resolva em um inteiro. As expressões que empregam colunas `ENUM` não podem ser usadas. O valor da coluna ou expressão também pode ser `NULL`; veja Seção 26.2.7, “Como o MySQL Particionamento lida com NULL”.

Existem duas exceções a essa restrição:

1. Ao particionar por `LINEAR` `KEY`, é possível usar colunas de qualquer tipo de dados válido do MySQL, exceto `TEXT` ou `BLOB` como chaves de particionamento, porque as funções internas de hashing de chaves produzem o tipo de dados correto desses tipos. Por exemplo, as seguintes duas declarações `CREATE TABLE` são válidas:

   ```
   CREATE TABLE tkc (c1 CHAR)
   PARTITION BY KEY(c1)
   PARTITIONS 4;

   CREATE TABLE tke
       ( c1 ENUM('red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet') )
   PARTITION BY LINEAR KEY(c1)
   PARTITIONS 6;
   ```

2. Ao particionar por `RANGE COLUMNS` ou `LIST COLUMNS`, é possível usar as colunas string, `DATE` e `DATETIME`. Por exemplo, cada uma das seguintes declarações de `CREATE TABLE` é válida:

   ```
   CREATE TABLE rc (c1 INT, c2 DATE)
   PARTITION BY RANGE COLUMNS(c2) (
       PARTITION p0 VALUES LESS THAN('1990-01-01'),
       PARTITION p1 VALUES LESS THAN('1995-01-01'),
       PARTITION p2 VALUES LESS THAN('2000-01-01'),
       PARTITION p3 VALUES LESS THAN('2005-01-01'),
       PARTITION p4 VALUES LESS THAN(MAXVALUE)
   );

   CREATE TABLE lc (c1 INT, c2 CHAR(1))
   PARTITION BY LIST COLUMNS(c2) (
       PARTITION p0 VALUES IN('a', 'd', 'g', 'j', 'm', 'p', 's', 'v', 'y'),
       PARTITION p1 VALUES IN('b', 'e', 'h', 'k', 'n', 'q', 't', 'w', 'z'),
       PARTITION p2 VALUES IN('c', 'f', 'i', 'l', 'o', 'r', 'u', 'x', NULL)
   );
   ```

Nenhuma das exceções anteriores se aplica aos tipos de colunas `BLOB` ou `TEXT`.

**Subconsultas. Uma chave de particionamento não pode ser uma subconsulta, mesmo que essa subconsulta resolva a um valor inteiro ou `NULL`.

**Prefixos de índice de colunas não são suportados para partição de chave.** Ao criar uma tabela que é particionada por chave, quaisquer colunas na chave de partição que utilizem prefixos de coluna não são utilizados na função de partição da tabela. Considere a seguinte declaração `CREATE TABLE`, que tem três colunas `VARCHAR`, e cuja chave primária utiliza todas as três colunas e especifica prefixos para duas delas:

```
CREATE TABLE t1 (
    a VARCHAR(10000),
    b VARCHAR(25),
    c VARCHAR(10),
    PRIMARY KEY (a(10), b, c(2))
) PARTITION BY KEY() PARTITIONS 2;
```

Essa declaração é aceita, mas a tabela resultante é, na verdade, criada como se você tivesse emitido a seguinte declaração, usando apenas a coluna da chave primária que não inclui um prefixo (coluna `b`) para a chave de particionamento:

```
CREATE TABLE t1 (
    a VARCHAR(10000),
    b VARCHAR(25),
    c VARCHAR(10),
    PRIMARY KEY (a(10), b, c(2))
) PARTITION BY KEY(b) PARTITIONS 2;
```

Antes do MySQL 8.0.21, não foi emitido nenhum aviso ou fornecida qualquer outra indicação de que isso ocorresse, exceto no caso em que todas as colunas especificadas para a chave de particionamento usassem prefixos, no qual caso a declaração falhou, mas com uma mensagem de erro enganosa, conforme mostrado aqui:

```
mysql> CREATE TABLE t2 (
    ->     a VARCHAR(10000),
    ->     b VARCHAR(25),
    ->     c VARCHAR(10),
    ->     PRIMARY KEY (a(10), b(5), c(2))
    -> ) PARTITION BY KEY() PARTITIONS 2;
ERROR 1503 (HY000): A PRIMARY KEY must include all columns in the
table's partitioning function
```

Isso também ocorreu ao realizar `ALTER TABLE` ou ao atualizar essas tabelas.

Esse comportamento permissivo é desaconselhado a partir do MySQL 8.0.21 (e está sujeito à remoção em uma versão futura do MySQL). A partir do MySQL 8.0.21, o uso de uma ou mais colunas com um prefixo na chave de particionamento resulta em um aviso para cada coluna desse tipo, conforme mostrado aqui:

```
mysql> CREATE TABLE t1 (
    ->     a VARCHAR(10000),
    ->     b VARCHAR(25),
    ->     c VARCHAR(10),
    ->     PRIMARY KEY (a(10), b, c(2))
    -> ) PARTITION BY KEY() PARTITIONS 2;
Query OK, 0 rows affected, 2 warnings (1.25 sec)

mysql> SHOW WARNINGS\G
*************************** 1. row ***************************
  Level: Warning
   Code: 1681
Message: Column 'test.t1.a' having prefix key part 'a(10)' is ignored by the
partitioning function. Use of prefixed columns in the PARTITION BY KEY() clause
is deprecated and will be removed in a future release.
*************************** 2. row ***************************
  Level: Warning
   Code: 1681
Message: Column 'test.t1.c' having prefix key part 'c(2)' is ignored by the
partitioning function. Use of prefixed columns in the PARTITION BY KEY() clause
is deprecated and will be removed in a future release.
2 rows in set (0.00 sec)
```

Isso inclui casos em que as colunas usadas na função de particionamento são definidas implicitamente como as da chave primária da tabela, empregando uma cláusula `PARTITION BY KEY()` vazia.

Em MySQL 8.0.21 e versões posteriores, se todas as colunas especificadas para a chave de particionamento utilizarem prefixos, a declaração `CREATE TABLE` usada falha com uma mensagem de erro que identifica o problema corretamente:

```
mysql> CREATE TABLE t1 (
    ->     a VARCHAR(10000),
    ->     b VARCHAR(25),
    ->     c VARCHAR(10),
    ->     PRIMARY KEY (a(10), b(5), c(2))
    -> ) PARTITION BY KEY() PARTITIONS 2;
ERROR 1503 (HY000): A PRIMARY KEY must include all columns in the table's
partitioning function (prefixed columns are not considered).
```

Para informações gerais sobre a partição de tabelas por chave, consulte a Seção 26.2.5, “Partição por Chave”.

**Problemas com subpartições.** As subpartições devem usar a partição `HASH` ou `KEY`. Apenas as partições `RANGE` e `LIST` podem ser subpartidas; as partições `HASH` e `KEY` não podem ser subpartidas.

`SUBPARTITION BY KEY` exige que a coluna ou colunas de subpartição sejam especificadas explicitamente, ao contrário do caso de `PARTITION BY KEY`, onde ela pode ser omitida (caso em que a coluna da chave primária da tabela é usada por padrão). Considere a tabela criada por esta declaração:

```
CREATE TABLE ts (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30)
);
```

Você pode criar uma tabela com as mesmas colunas, dividida por `KEY`, usando uma declaração como esta:

```
CREATE TABLE ts (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30)
)
PARTITION BY KEY()
PARTITIONS 4;
```

A declaração anterior é tratada como se tivesse sido escrita assim, com a coluna da chave primária da tabela sendo usada como a coluna de partição:

```
CREATE TABLE ts (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30)
)
PARTITION BY KEY(id)
PARTITIONS 4;
```

No entanto, a seguinte declaração que tenta criar uma tabela subpartida usando a coluna padrão como a coluna de subpartição falha, e a coluna deve ser especificada para que a declaração seja bem-sucedida, como mostrado aqui:

```
mysql> CREATE TABLE ts (
    ->     id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ->     name VARCHAR(30)
    -> )
    -> PARTITION BY RANGE(id)
    -> SUBPARTITION BY KEY()
    -> SUBPARTITIONS 4
    -> (
    ->     PARTITION p0 VALUES LESS THAN (100),
    ->     PARTITION p1 VALUES LESS THAN (MAXVALUE)
    -> );
ERROR 1064 (42000): You have an error in your SQL syntax; check the manual that
corresponds to your MySQL server version for the right syntax to use near ')

mysql> CREATE TABLE ts (
    ->     id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ->     name VARCHAR(30)
    -> )
    -> PARTITION BY RANGE(id)
    -> SUBPARTITION BY KEY(id)
    -> SUBPARTITIONS 4
    -> (
    ->     PARTITION p0 VALUES LESS THAN (100),
    ->     PARTITION p1 VALUES LESS THAN (MAXVALUE)
    -> );
Query OK, 0 rows affected (0.07 sec)
```

Este é um problema conhecido (veja o Bug #51470).

Opções de **DIRITÁRIO DE DADOS e INDICE DE DADOS**. As opções de nível de tabela `DATA DIRECTORY` e `INDEX DIRECTORY` são ignoradas (ver Bug #32091). Você pode empregar essas opções para partições individuais ou subpartições das tabelas `InnoDB`. A partir do MySQL 8.0.21, o diretório especificado em uma cláusula `DATA DIRECTORY` deve ser conhecido por `InnoDB`. Para mais informações, consulte o uso da Cláusula de DIRITÁRIO DE DADOS.

**Reparando e reconstruindo tabelas particionadas.** As declarações `CHECK TABLE`, `OPTIMIZE TABLE`, `ANALYZE TABLE` e `REPAIR TABLE` são suportadas para tabelas particionadas.

Além disso, você pode usar `ALTER TABLE ... REBUILD PARTITION` para reconstruir uma ou mais partições de uma tabela particionada; `ALTER TABLE ... REORGANIZE PARTITION` também faz com que as partições sejam reconstruídas. Consulte a Seção 15.1.9, “Instrução ALTER TABLE”, para obter mais informações sobre essas duas instruções.

As operações `ANALYZE`, `CHECK`, `OPTIMIZE`, `REPAIR` e `TRUNCATE` são suportadas com subpartições. Veja a Seção 15.1.9.1, “Operações de Partição de Tabela”.

**Delimitadores de nome de arquivo para partições e subpartições.** Os nomes de arquivos de partição e subpartição incluem delimitadores gerados, como `#P#` e `#SP#`. A grafia dessas delimitações pode variar e não deve ser considerada como certa.

### 26.6.1 Chaves de Partição, Chaves Primárias e Chaves Únicas

Esta seção discute a relação entre as chaves de partição e as chaves primárias e as chaves únicas. A regra que rege essa relação pode ser expressa da seguinte forma: Todas as colunas utilizadas na expressão de partição de uma tabela particionada devem fazer parte de todas as chaves únicas que a tabela pode ter.

Em outras palavras, *toda chave única na tabela deve usar todas as colunas na expressão de particionamento da tabela*. (Isso também inclui a chave primária da tabela, uma vez que é, por definição, uma chave única. Este caso específico é discutido mais tarde nesta seção.) Por exemplo, cada uma das seguintes declarações de criação de tabela é inválida:

```
CREATE TABLE t1 (
    col1 INT NOT NULL,
    col2 DATE NOT NULL,
    col3 INT NOT NULL,
    col4 INT NOT NULL,
    UNIQUE KEY (col1, col2)
)
PARTITION BY HASH(col3)
PARTITIONS 4;

CREATE TABLE t2 (
    col1 INT NOT NULL,
    col2 DATE NOT NULL,
    col3 INT NOT NULL,
    col4 INT NOT NULL,
    UNIQUE KEY (col1),
    UNIQUE KEY (col3)
)
PARTITION BY HASH(col1 + col3)
PARTITIONS 4;
```

Em cada caso, a tabela proposta teria pelo menos uma chave única que não incluísse todas as colunas utilizadas na expressão de particionamento.

Cada uma das seguintes declarações é válida e representa uma maneira de fazer com que a declaração correspondente de criação de tabela inválida funcione:

```
CREATE TABLE t1 (
    col1 INT NOT NULL,
    col2 DATE NOT NULL,
    col3 INT NOT NULL,
    col4 INT NOT NULL,
    UNIQUE KEY (col1, col2, col3)
)
PARTITION BY HASH(col3)
PARTITIONS 4;

CREATE TABLE t2 (
    col1 INT NOT NULL,
    col2 DATE NOT NULL,
    col3 INT NOT NULL,
    col4 INT NOT NULL,
    UNIQUE KEY (col1, col3)
)
PARTITION BY HASH(col1 + col3)
PARTITIONS 4;
```

Esse exemplo mostra o erro produzido nesses casos:

```
mysql> CREATE TABLE t3 (
    ->     col1 INT NOT NULL,
    ->     col2 DATE NOT NULL,
    ->     col3 INT NOT NULL,
    ->     col4 INT NOT NULL,
    ->     UNIQUE KEY (col1, col2),
    ->     UNIQUE KEY (col3)
    -> )
    -> PARTITION BY HASH(col1 + col3)
    -> PARTITIONS 4;
ERROR 1491 (HY000): A PRIMARY KEY must include all columns in the table's partitioning function
```

A declaração `CREATE TABLE` falha porque tanto `col1` quanto `col3` estão incluídos na chave de particionamento proposta, mas nenhuma dessas colunas faz parte das chaves únicas da tabela. Isso mostra uma possível solução para a definição de tabela inválida:

```
mysql> CREATE TABLE t3 (
    ->     col1 INT NOT NULL,
    ->     col2 DATE NOT NULL,
    ->     col3 INT NOT NULL,
    ->     col4 INT NOT NULL,
    ->     UNIQUE KEY (col1, col2, col3),
    ->     UNIQUE KEY (col3)
    -> )
    -> PARTITION BY HASH(col3)
    -> PARTITIONS 4;
Query OK, 0 rows affected (0.05 sec)
```

Neste caso, a chave de particionamento proposta `col3` faz parte de ambas as chaves únicas, e a declaração de criação da tabela é bem-sucedida.

A tabela a seguir não pode ser particionada de forma alguma, porque não há como incluir em uma chave de particionamento quaisquer colunas que pertençam a chaves exclusivas:

```
CREATE TABLE t4 (
    col1 INT NOT NULL,
    col2 INT NOT NULL,
    col3 INT NOT NULL,
    col4 INT NOT NULL,
    UNIQUE KEY (col1, col3),
    UNIQUE KEY (col2, col4)
);
```

Como toda chave primária é, por definição, uma chave única, essa restrição também inclui a chave primária da tabela, se ela tiver uma. Por exemplo, as duas afirmações seguintes são inválidas:

```
CREATE TABLE t5 (
    col1 INT NOT NULL,
    col2 DATE NOT NULL,
    col3 INT NOT NULL,
    col4 INT NOT NULL,
    PRIMARY KEY(col1, col2)
)
PARTITION BY HASH(col3)
PARTITIONS 4;

CREATE TABLE t6 (
    col1 INT NOT NULL,
    col2 DATE NOT NULL,
    col3 INT NOT NULL,
    col4 INT NOT NULL,
    PRIMARY KEY(col1, col3),
    UNIQUE KEY(col2)
)
PARTITION BY HASH( YEAR(col2) )
PARTITIONS 4;
```

Em ambos os casos, a chave primária não inclui todas as colunas referenciadas na expressão de particionamento. No entanto, as duas próximas declarações são válidas:

```
CREATE TABLE t7 (
    col1 INT NOT NULL,
    col2 DATE NOT NULL,
    col3 INT NOT NULL,
    col4 INT NOT NULL,
    PRIMARY KEY(col1, col2)
)
PARTITION BY HASH(col1 + YEAR(col2))
PARTITIONS 4;

CREATE TABLE t8 (
    col1 INT NOT NULL,
    col2 DATE NOT NULL,
    col3 INT NOT NULL,
    col4 INT NOT NULL,
    PRIMARY KEY(col1, col2, col4),
    UNIQUE KEY(col2, col1)
)
PARTITION BY HASH(col1 + YEAR(col2))
PARTITIONS 4;
```

Se uma tabela não tiver chaves únicas, o que inclui não ter uma chave primária, então essa restrição não se aplica e você pode usar qualquer coluna ou colunas na expressão de particionamento, desde que o tipo de coluna seja compatível com o tipo de particionamento.

Por essa mesma razão, você não pode adicionar uma chave única a uma tabela particionada posteriormente, a menos que a chave inclua todas as colunas usadas pela expressão de particionamento da tabela. Considere a tabela particionada criada conforme mostrado aqui:

```
mysql> CREATE TABLE t_no_pk (c1 INT, c2 INT)
    ->     PARTITION BY RANGE(c1) (
    ->         PARTITION p0 VALUES LESS THAN (10),
    ->         PARTITION p1 VALUES LESS THAN (20),
    ->         PARTITION p2 VALUES LESS THAN (30),
    ->         PARTITION p3 VALUES LESS THAN (40)
    ->     );
Query OK, 0 rows affected (0.12 sec)
```

É possível adicionar uma chave primária ao `t_no_pk` usando qualquer uma dessas declarações `ALTER TABLE`:

```
#  possible PK
mysql> ALTER TABLE t_no_pk ADD PRIMARY KEY(c1);
Query OK, 0 rows affected (0.13 sec)
Records: 0  Duplicates: 0  Warnings: 0

# drop this PK
mysql> ALTER TABLE t_no_pk DROP PRIMARY KEY;
Query OK, 0 rows affected (0.10 sec)
Records: 0  Duplicates: 0  Warnings: 0

#  use another possible PK
mysql> ALTER TABLE t_no_pk ADD PRIMARY KEY(c1, c2);
Query OK, 0 rows affected (0.12 sec)
Records: 0  Duplicates: 0  Warnings: 0

# drop this PK
mysql> ALTER TABLE t_no_pk DROP PRIMARY KEY;
Query OK, 0 rows affected (0.09 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

No entanto, a próxima afirmação falha, porque `c1` faz parte da chave de particionamento, mas não faz parte da chave primária proposta:

```
#  fails with error 1503
mysql> ALTER TABLE t_no_pk ADD PRIMARY KEY(c2);
ERROR 1503 (HY000): A PRIMARY KEY must include all columns in the table's partitioning function
```

Como o `t_no_pk` tem apenas `c1` em sua expressão de particionamento, tentar adicionar uma chave única em `c2` sozinho falha. No entanto, você pode adicionar uma chave única que use tanto `c1` quanto `c2`.

Essas regras também se aplicam a tabelas não particionadas existentes que você deseja particionar usando `ALTER TABLE ... PARTITION BY`. Considere uma tabela `np_pk` criada conforme mostrado aqui:

```
mysql> CREATE TABLE np_pk (
    ->     id INT NOT NULL AUTO_INCREMENT,
    ->     name VARCHAR(50),
    ->     added DATE,
    ->     PRIMARY KEY (id)
    -> );
Query OK, 0 rows affected (0.08 sec)
```

A seguinte declaração `ALTER TABLE` falha com um erro, porque a coluna `added` não faz parte de nenhuma chave única na tabela:

```
mysql> ALTER TABLE np_pk
    ->     PARTITION BY HASH( TO_DAYS(added) )
    ->     PARTITIONS 4;
ERROR 1503 (HY000): A PRIMARY KEY must include all columns in the table's partitioning function
```

No entanto, essa declaração que utiliza a coluna `id` para a coluna de partição é válida, conforme mostrado aqui:

```
mysql> ALTER TABLE np_pk
    ->     PARTITION BY HASH(id)
    ->     PARTITIONS 4;
Query OK, 0 rows affected (0.11 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

No caso de `np_pk`, a única coluna que pode ser usada como parte de uma expressão de partição é `id`; se você deseja particionar esta tabela usando qualquer outra coluna ou colunas na expressão de partição, você deve primeiro modificar a tabela, adicionando a coluna ou colunas desejadas à chave primária, ou descartando a chave primária por completo.

### 26.6.2 Limitações de Partição Relacionadas a Motores de Armazenamento

No MySQL 8.0, o suporte à partição não é fornecido pelo próprio servidor MySQL, mas sim pelo próprio manipulador de partição do mecanismo de armazenamento de tabela. No MySQL 8.0, apenas os mecanismos de armazenamento `InnoDB` e `NDB` fornecem manipuladores de partição nativos. Isso significa que tabelas particionadas não podem ser criadas usando qualquer outro mecanismo de armazenamento que esses. (Você deve estar usando o MySQL NDB Cluster com o mecanismo de armazenamento `NDB` para criar tabelas `NDB`.)

**Engenho de armazenamento InnoDB. `InnoDB` Chaves estrangeiras e particionamento do MySQL não são compatíveis. Tabelas particionadas `InnoDB` não podem ter referências de chave estrangeira, nem podem ter colunas referenciadas por chaves estrangeiras. Tabelas `InnoDB` que têm ou que são referenciadas por chaves estrangeiras não podem ser particionadas.

`ALTER TABLE ... OPTIMIZE PARTITION` não funciona corretamente com tabelas particionadas que utilizam `InnoDB`. Em vez disso, use `ALTER TABLE ... REBUILD PARTITION` e `ALTER TABLE ... ANALYZE PARTITION`, para tais tabelas. Para mais informações, consulte a Seção 15.1.9.1, “Operações de Partição de Tabela”.

**Divisão definida pelo usuário e o motor de armazenamento NDB (NDB Cluster).** A divisão por `KEY` (incluindo `LINEAR KEY`) é o único tipo de divisão suportada pelo motor de armazenamento `NDB`. Não é possível, sob circunstâncias normais, em NDB Cluster criar uma tabela NDB Cluster usando qualquer tipo de divisão diferente de `LINEAR` `KEY`, e tentar fazer isso falha com um erro.

*Exceção (não para produção)*: É possível ignorar essa restrição definindo a variável de sistema `new` nos nós do SQL do NDB Cluster como `ON`. Se optar por fazer isso, deve estar ciente de que as tabelas que utilizam tipos de particionamento que não são `[LINEAR] KEY` não são suportadas em produção. *Nesses casos, você pode criar e usar tabelas com tipos de particionamento que não são `KEY` ou `LINEAR KEY`, mas isso deve ser feito totalmente por sua conta e risco*. Deve também estar ciente de que essa funcionalidade já foi descontinuada e está sujeita à remoção sem aviso prévio em uma futura versão do NDB Cluster.

O número máximo de partições que podem ser definidas para uma tabela `NDB` depende do número de nós de dados e grupos de nós no clúster, da versão do software NDB Cluster em uso e de outros fatores. Consulte Partição definida por NDB e Partição definida pelo usuário, para obter mais informações.

O valor máximo de dados de tamanho fixo que podem ser armazenados por partição em uma tabela `NDB` é de 128 TB. Anteriormente, esse valor era de 16 GB.

`CREATE TABLE` e `ALTER TABLE` declarações que causem que uma tabela `NDB` particionada pelo usuário não atenda a um dos dois requisitos ou a ambos não são permitidas e falham com um erro:

1. A tabela deve ter uma chave primária explícita. 2. Todas as colunas listadas na expressão de particionamento da tabela devem fazer parte da chave primária.

**Exceção.** Se uma tabela `NDB` com partição de usuário for criada usando uma lista de colunas vazia (ou seja, usando `PARTITION BY KEY()` ou `PARTITION BY LINEAR KEY()`, então não é necessário uma chave primária explícita.

**Seleção de partição.** A seleção de partição não é suportada para as tabelas `NDB`. Consulte a Seção 26.5, “Seleção de partição”, para obter mais informações.

**Atualização de tabelas particionadas.** Ao realizar uma atualização, as tabelas que são particionadas por `KEY` devem ser descarregadas e recarregadas. As tabelas particionadas usando motores de armazenamento que não são `InnoDB` não podem ser atualizadas do MySQL 5.7 ou versões anteriores para o MySQL 8.0 ou versões posteriores; você deve ou descartar a partição dessas tabelas com `ALTER TABLE ... REMOVE PARTITIONING` ou convertê-las para `InnoDB` usando `ALTER TABLE ... ENGINE=INNODB` antes da atualização.

Para obter informações sobre a conversão das tabelas `MyISAM` para `InnoDB`, consulte a Seção 17.6.1.5, “Conversão de tabelas de MyISAM para InnoDB”.

### 26.6.3 Limitações de Partição Relativas a Funções

Esta seção discute as limitações na Partição do MySQL relacionadas especificamente às funções usadas em expressões de partição.

Apenas as funções MySQL mostradas na lista a seguir são permitidas em expressões de particionamento:

* `ABS()`
* `CEILING()` (consulte CEILING() e FLOOR() e FLOOR()"))

* `DATEDIFF()`
* `DAY()`
* `DAYOFMONTH()`
* `DAYOFWEEK()`
* `DAYOFYEAR()`
* `EXTRACT()` (veja a função EXTRACT() com especificador de semana na função com especificador de semana)

* `FLOOR()` (consulte CEILING() e FLOOR() e FLOOR()"))

* `HOUR()`
* `MICROSECOND()`
* `MINUTE()`
* `MOD()`
* `MONTH()`
* `QUARTER()`
* `SECOND()`
* `TIME_TO_SEC()`
* `TO_DAYS()`
* `TO_SECONDS()`
* `UNIX_TIMESTAMP()` (com colunas `TIMESTAMP`)

* `WEEKDAY()`
* `YEAR()`
* `YEARWEEK()`

No MySQL 8.0, o corte de partições é suportado para as funções `TO_DAYS()`, `TO_SECONDS()`, `YEAR()` e `UNIX_TIMESTAMP()`. Consulte a Seção 26.4, “Corte de Partições”, para obter mais informações.

**CEILING() e FLOOR().** Cada uma dessas funções retorna um inteiro apenas se for passada um argumento de um tipo numérico exato, como um dos tipos `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") ou `DECIMAL` - DECIMAL, NUMERIC"). Isso significa, por exemplo, que a seguinte declaração `CREATE TABLE` falha com um erro, como mostrado aqui:

```
mysql> CREATE TABLE t (c FLOAT) PARTITION BY LIST( FLOOR(c) )(
    ->     PARTITION p0 VALUES IN (1,3,5),
    ->     PARTITION p1 VALUES IN (2,4,6)
    -> );
ERROR 1490 (HY000): The PARTITION function returns the wrong type
```

**Função EXTRACT() com especificador WEEK.** O valor retornado pela função `EXTRACT()`, quando usada como `EXTRACT(WEEK FROM col)`, depende do valor da variável de sistema `default_week_format`. Por essa razão, `EXTRACT()` não é permitido como função de particionamento quando especifica a unidade como `WEEK`. (Bug #54483)

Consulte a Seção 14.6.2, “Funções Matemáticas”, para obter mais informações sobre os tipos de retorno dessas funções, bem como a Seção 13.1, “Tipos de Dados Numéricos”.