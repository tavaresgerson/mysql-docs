## 22.6 Restrições e Limitações sobre Partição

Esta seção discute as restrições e limitações atuais sobre o suporte à partição do MySQL.

**Construções proibidas.** As seguintes construções não são permitidas em expressões de particionamento:

* Procedimentos armazenados, funções armazenadas, funções carregáveis ou plugins.

* Variáveis declaradas ou variáveis do usuário.

Para uma lista de funções SQL que são permitidas em expressões de particionamento, consulte a Seção 22.6.3, “Limitações de particionamento relacionadas a funções”.

Operadores aritméticos e lógicos.

O uso dos operadores aritméticos `+`, `-` e `*` é permitido em expressões de particionamento. No entanto, o resultado deve ser um valor inteiro ou `NULL` (exceto no caso do particionamento `[LINEAR] KEY`, conforme discutido em outra parte deste capítulo; consulte a Seção 22.2, “Tipos de particionamento”, para mais informações).

O operador `DIV` também é suportado, e o operador `/` não é permitido. (Bug #30188, Bug #33182)

Os operadores de bits `|`, `&`, `^`, `<<`, `>>` e `~` não são permitidos em expressões de particionamento.

**Declarações do HANDLER.** Anteriormente, a declaração `HANDLER` não era suportada com tabelas particionadas. Essa limitação é removida a partir do MySQL 5.7.1.

Modo SQL do servidor.

As tabelas que empregam partição definida pelo usuário não preservam o modo SQL em vigor no momento em que foram criadas. Como discutido na Seção 5.1.10, “Modos SQL do servidor”, os resultados de muitas funções e operadores do MySQL podem mudar de acordo com o modo SQL do servidor. Portanto, uma mudança no modo SQL em qualquer momento após a criação de tabelas particionadas pode levar a mudanças significativas no comportamento dessas tabelas e facilmente resultar em corrupção ou perda de dados. Por essas razões, **é fortemente recomendado que você nunca mude o modo SQL do servidor após criar tabelas particionadas**.

**Exemplos.** Os exemplos a seguir ilustram algumas mudanças no comportamento de tabelas particionadas devido a uma alteração no modo SQL do servidor:

1. **Tratamento de erros.** Suponha que você crie uma tabela particionada cuja expressão de particionamento é uma dessas, como `column DIV 0` ou `column MOD 0`, conforme mostrado aqui:

   ```sql
   mysql> CREATE TABLE tn (c1 INT)
       ->     PARTITION BY LIST(1 DIV c1) (
       ->       PARTITION p0 VALUES IN (NULL),
       ->       PARTITION p1 VALUES IN (1)
       -> );
   Query OK, 0 rows affected (0.05 sec)
   ```

O comportamento padrão do MySQL é retornar `NULL` para o resultado de uma divisão por zero, sem produzir nenhum erro:

   ```sql
   mysql> SELECT @@sql_mode;
   +------------+
   | @@sql_mode |
   +------------+
   |            |
   +------------+
   1 row in set (0.00 sec)


   mysql> INSERT INTO tn VALUES (NULL), (0), (1);
   Query OK, 3 rows affected (0.00 sec)
   Records: 3  Duplicates: 0  Warnings: 0
   ```

No entanto, alterar o modo SQL do servidor para tratar a divisão por zero como um erro e impor um tratamento rigoroso de erros faz com que a mesma declaração `INSERT` falhe, como mostrado aqui:

   ```sql
   mysql> SET sql_mode='STRICT_ALL_TABLES,ERROR_FOR_DIVISION_BY_ZERO';
   Query OK, 0 rows affected (0.00 sec)

   mysql> INSERT INTO tn VALUES (NULL), (0), (1);
   ERROR 1365 (22012): Division by 0
   ```

2. **Acessibilidade da tabela.** Às vezes, uma mudança no modo SQL do servidor pode tornar as tabelas particionadas inutilizáveis. A seguinte declaração `CREATE TABLE` pode ser executada com sucesso apenas se o modo `NO_UNSIGNED_SUBTRACTION` estiver em vigor:

   ```sql
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

   ```sql
   mysql> SET sql_mode='';
   Query OK, 0 rows affected (0.00 sec)

   mysql> SELECT * FROM tu;
   ERROR 1563 (HY000): Partition constant is out of partition function domain
   mysql> INSERT INTO tu VALUES (20);
   ERROR 1563 (HY000): Partition constant is out of partition function domain
   ```

Veja também a Seção 5.1.10, “Modos SQL do servidor”.

Os modos do SQL do servidor também afetam a replicação de tabelas particionadas. Modos SQL distintos na fonte e na replica podem levar a expressões de particionamento a serem avaliadas de maneira diferente; isso pode causar a distribuição dos dados entre as partições a ser diferente nas cópias da fonte e da replica de uma tabela dada, e pode até causar inserções em tabelas particionadas que têm sucesso na fonte, mas falham na replica. Para obter os melhores resultados, você deve sempre usar o mesmo modo do SQL do servidor na fonte e na replica.

**Considerações sobre o desempenho.** Algumas das consequências das operações de particionamento no desempenho são apresentadas na lista a seguir:

* **Operações do sistema de arquivos.** As operações de particionamento e re-particionamento (como `ALTER TABLE` com `PARTITION BY ...`, `REORGANIZE PARTITION` ou `REMOVE PARTITIONING`) dependem de operações do sistema de arquivos para sua implementação. Isso significa que a velocidade dessas operações é afetada por fatores como o tipo e as características do sistema de arquivos, a velocidade do disco, o espaço de troca, a eficiência de manipulação de arquivos do sistema operacional e as opções e variáveis do servidor MySQL relacionadas à manipulação de arquivos. Em particular, você deve garantir que `large_files_support` esteja habilitado e que `open_files_limit` esteja configurado corretamente. Para tabelas particionadas usando o mecanismo de armazenamento `MyISAM`, aumentar `myisam_max_sort_file_size` pode melhorar o desempenho; as operações de particionamento e re-particionamento envolvendo tabelas `InnoDB` podem ser feitas de forma mais eficiente ao habilitar `innodb_file_per_table`.

Veja também o número máximo de partições.

* **Uso de descritores de arquivo de partição em MyISAM.** Para uma tabela `MyISAM` particionada, o MySQL usa 2 descritores de arquivo para cada partição, para cada tabela aberta. Isso significa que você precisa de muitos mais descritores de arquivo para realizar operações em uma tabela `MyISAM` particionada do que em uma tabela que é idêntica a ela, exceto que esta última tabela não está particionada, especialmente ao realizar operações `ALTER TABLE`.

Suponha uma tabela `MyISAM` `t` com 100 partições, como a tabela criada por esta declaração SQL:

  ```sql
  CREATE TABLE t (c1 VARCHAR(50))
  PARTITION BY KEY (c1) PARTITIONS 100
  ENGINE=MYISAM;
  ```

Nota

Por simplicidade, usamos a partição `KEY` para a tabela mostrada neste exemplo, mas o uso de descritor de arquivo conforme descrito aqui se aplica a todas as tabelas `MyISAM` particionadas, independentemente do tipo de particionamento empregado. As tabelas particionadas que utilizam outros motores de armazenamento, como `InnoDB`, não são afetadas por este problema.

Agora, suponha que você queira repartir `t` para que ele tenha 101 partições, usando a declaração mostrada aqui:

  ```sql
  ALTER TABLE t PARTITION BY KEY (c1) PARTITIONS 101;
  ```

Para processar esta declaração `ALTER TABLE`, o MySQL utiliza 402 descritores de arquivo, ou seja, dois para cada uma das 100 partições originais, mais dois para cada uma das 101 novas partições. Isso ocorre porque todas as partições (antigas e novas) devem ser abertas simultaneamente durante a reorganização dos dados da tabela. É recomendável que, se você espera realizar tais operações, você deve garantir que a variável de sistema `open_files_limit` não seja definida muito baixa para acomodá-las.

* **Blocos de tabela.** Geralmente, o processo que executa uma operação de particionamento em uma tabela obtém um bloqueio de escrita na tabela. As leituras dessas tabelas são relativamente não afetadas; as operações pendentes `INSERT` e `UPDATE` são realizadas assim que a operação de particionamento tiver sido concluída. Para exceções específicas do `InnoDB` a essa limitação, consulte Operações de Particionamento.

* **Motor de armazenamento.** As operações de particionamento, consultas e operações de atualização geralmente tendem a ser mais rápidas com as tabelas `MyISAM` do que com as tabelas `InnoDB` ou `NDB`.

* **Indeks; poda de partições.** Assim como em tabelas não particionadas, o uso adequado de índices pode acelerar significativamente as consultas em tabelas particionadas. Além disso, projetar tabelas particionadas e consultas nessas tabelas para aproveitar a poda de partições pode melhorar o desempenho de forma dramática. Consulte a Seção 22.4, “Poda de Partições”, para mais informações.

Anteriormente, a empurrada da condição de índice não era suportada para tabelas particionadas. Essa limitação foi removida no MySQL 5.7.3. Veja a Seção 8.2.1.5, “Otimização da Empurrada da Condição do Índice”.

* **Desempenho com LOAD DATA.** No MySQL 5.7, `LOAD DATA` usa bufferização para melhorar o desempenho. Você deve estar ciente de que o buffer usa 130 KB de memória por partição para alcançar isso.

**Número máximo de partições.** O número máximo possível de partições para uma tabela específica que não utiliza o mecanismo de armazenamento `NDB` é

8192. Este número inclui subdivisões.

O número máximo de partições definidas pelo usuário para uma tabela usando o mecanismo de armazenamento `NDB` é determinado de acordo com a versão do software NDB Cluster que está sendo usada, o número de nós de dados e outros fatores. Consulte NDB e partição definida pelo usuário, para mais informações.

Se, ao criar tabelas com um grande número de partições (mas menos que o máximo), você encontrar uma mensagem de erro, como Got error ... from storage engine: Out of resources when opening file, você pode ser capaz de resolver o problema aumentando o valor da variável de sistema `open_files_limit`. No entanto, isso depende do sistema operacional e pode não ser possível ou aconselhável em todas as plataformas; consulte a Seção B.3.2.16, “File Not Found and Similar Errors”, para mais informações. Em alguns casos, o uso de um grande número (centenas) de partições também pode não ser aconselhável devido a outras preocupações, portanto, o uso de mais partições não leva automaticamente a melhores resultados.

Veja também Operações do sistema de arquivos.

**Cache de consulta não suportado.** O cache de consulta não é suportado para tabelas particionadas e é automaticamente desativado para consultas que envolvem tabelas particionadas. O cache de consulta não pode ser ativado para tais consultas.

**Caches de chave por partição.** No MySQL 5.7, os caches de chave são suportados para tabelas `MyISAM` particionadas, usando as declarações `CACHE INDEX` e `LOAD INDEX INTO CACHE`. Caches de chave podem ser definidos para uma, várias ou todas as partições, e índices para uma, várias ou todas as partições podem ser pré-carregados nos caches de chave.

**Chaves estrangeiras não são suportadas para tabelas particionadas do InnoDB.** Tabelas particionadas usando o mecanismo de armazenamento `InnoDB` não suportam chaves estrangeiras. Mais especificamente, isso significa que as seguintes duas afirmações são verdadeiras:

1. Nenhuma definição de uma tabela `InnoDB` que utilize partição definida pelo usuário pode conter referências de chave estrangeira; nenhuma tabela `InnoDB` cuja definição contenha referências de chave estrangeira pode ser particionada.

2. Nenhuma definição de tabela `InnoDB` pode conter uma referência de chave estrangeira para uma tabela particionada pelo usuário; nenhuma tabela `InnoDB` com particionamento definido pelo usuário pode conter colunas referenciadas por chaves estrangeiras.

O escopo das restrições listadas acima inclui todas as tabelas que utilizam o mecanismo de armazenamento `InnoDB`. As declarações `CREATE TABLE` e `ALTER TABLE` que resultarão em tabelas que violam essas restrições não são permitidas.

**ALTER TABLE ... ORDER BY.** Uma declaração `ALTER TABLE ... ORDER BY column` executada em uma tabela particionada faz com que as strings sejam ordenadas apenas dentro de cada particionamento.

**Efeitos nas declarações REPLACE por modificação de chaves primárias.** Em alguns casos, pode ser desejável (ver Seção 22.6.1, "Chaves de Partição, Chaves Primárias e Chaves Únicas") modificar a chave primária de uma tabela. Esteja ciente de que, se sua aplicação utiliza declarações `REPLACE` e você fizer isso, os resultados dessas declarações podem ser drasticamente alterados. Consulte a Seção 13.2.8, "Declaração REPLACE", para mais informações e um exemplo.

**Índices FULLTEXT.** As tabelas particionadas não suportam índices `FULLTEXT` ou pesquisas, mesmo para tabelas particionadas que utilizam o mecanismo de armazenamento `InnoDB` ou `MyISAM`.

**Colunas espaciais.** Colunas com tipos de dados espaciais, como `POINT` ou `GEOMETRY`, não podem ser usadas em tabelas particionadas.

Tabelas temporárias. As tabelas temporárias não podem ser divididas. (Bug #17497)

**Tabelas de registro.** Não é possível particionar as tabelas de registro; uma declaração `ALTER TABLE ... PARTITION BY ...` em uma tabela desse tipo falha com um erro.

**Tipo de dados da chave de particionamento.** Uma chave de particionamento deve ser uma coluna inteira ou uma expressão que resolva em um inteiro. As expressões que empregam colunas `ENUM` não podem ser usadas. O valor da coluna ou expressão também pode ser `NULL`. (Veja a Seção 22.2.7, “Como o MySQL Particionamento lida com NULL”.)

Existem duas exceções a essa restrição:

1. Ao particionar por `LINEAR` `KEY`, é possível usar colunas de qualquer tipo de dados válido do MySQL, exceto `TEXT` ou `BLOB` como chaves de particionamento, porque as funções internas de hashing de chave do MySQL produzem o tipo de dados correto a partir desses tipos. Por exemplo, as seguintes duas declarações de `CREATE TABLE` são válidas:

   ```sql
   CREATE TABLE tkc (c1 CHAR)
   PARTITION BY KEY(c1)
   PARTITIONS 4;

   CREATE TABLE tke
       ( c1 ENUM('red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet') )
   PARTITION BY LINEAR KEY(c1)
   PARTITIONS 6;
   ```

2. Ao particionar por `RANGE COLUMNS` ou `LIST COLUMNS`, é possível usar as colunas string, `DATE` e `DATETIME`. Por exemplo, cada uma das seguintes declarações de `CREATE TABLE` é válida:

   ```sql
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

**Prefixos de índice de coluna não são suportados para partição de chave.** Ao criar uma tabela que é particionada por chave, quaisquer colunas na chave de partição que utilizem prefixos de coluna não são utilizados na função de partição da tabela. Considere a seguinte declaração `CREATE TABLE`, que tem três colunas `VARCHAR`, e cuja chave primária utiliza todas as três colunas e especifica prefixos para duas delas:

```sql
CREATE TABLE t1 (
    a VARCHAR(10000),
    b VARCHAR(25),
    c VARCHAR(10),
    PRIMARY KEY (a(10), b, c(2))
) PARTITION BY KEY() PARTITIONS 2;
```

Essa declaração é aceita, mas a tabela resultante é, na verdade, criada como se você tivesse emitido a seguinte declaração, usando apenas a coluna da chave primária que não inclui um prefixo (coluna `b`) para a chave de particionamento:

```sql
CREATE TABLE t1 (
    a VARCHAR(10000),
    b VARCHAR(25),
    c VARCHAR(10),
    PRIMARY KEY (a(10), b, c(2))
) PARTITION BY KEY(b) PARTITIONS 2;
```

Não é emitido nenhum aviso ou qualquer outra indicação de que isso ocorreu, exceto no caso em que todas as colunas especificadas para a chave de particionamento utilizam prefixos, caso em que a declaração falha com a mensagem de erro mostrada aqui:

```sql
mysql> CREATE TABLE t2 (
    ->     a VARCHAR(10000),
    ->     b VARCHAR(25),
    ->     c VARCHAR(10),
    ->     PRIMARY KEY (a(10), b(5), c(2))
    -> ) PARTITION BY KEY() PARTITIONS 2;
ERROR 1503 (HY000): A PRIMARY KEY must include all columns in the
table's partitioning function
```

Isso também ocorre ao alterar ou atualizar essas tabelas, e inclui casos em que as colunas usadas na função de particionamento são definidas implicitamente como as da chave primária da tabela, empregando uma cláusula `PARTITION BY KEY()` vazia.

Este é um problema conhecido que é resolvido no MySQL 8.0, desativando o comportamento permissivo; no MySQL 8.0, se houver colunas que utilizam prefixos incluídas na função de particionamento de uma tabela, o servidor registra um aviso apropriado para cada coluna desse tipo, ou levanta um erro descritivo, se necessário. (Permitir o uso de colunas com prefixos em chaves de particionamento está sujeito à remoção total em uma versão futura do MySQL.)

Para informações gerais sobre a partição de tabelas por chave, consulte a Seção 22.2.5, “Partição por Chave”.

**Problemas com subpartições.** As subpartições devem usar a partição `HASH` ou `KEY`. Apenas as partições `RANGE` e `LIST` podem ser subpartidas; as partições `HASH` e `KEY` não podem ser subpartidas.

`SUBPARTITION BY KEY` exige que a coluna ou colunas de subpartição sejam especificadas explicitamente, ao contrário do caso de `PARTITION BY KEY`, onde ela pode ser omitida (caso em que a coluna da chave primária da tabela é usada por padrão). Considere a tabela criada por esta declaração:

```sql
CREATE TABLE ts (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30)
);
```

Você pode criar uma tabela com as mesmas colunas, dividida por `KEY`, usando uma declaração como esta:

```sql
CREATE TABLE ts (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30)
)
PARTITION BY KEY()
PARTITIONS 4;
```

A declaração anterior é tratada como se tivesse sido escrita assim, com a coluna da chave primária da tabela sendo usada como a coluna de partição:

```sql
CREATE TABLE ts (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30)
)
PARTITION BY KEY(id)
PARTITIONS 4;
```

No entanto, a seguinte declaração que tenta criar uma tabela subpartida usando a coluna padrão como a coluna de subpartição falha, e a coluna deve ser especificada para que a declaração seja bem-sucedida, como mostrado aqui:

```sql
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

Opções de **DIRITÓRIO DE DADOS e DIRITÓRIO DE ÍNDICES**. `DATA DIRECTORY` e `INDEX DIRECTORY` estão sujeitos às seguintes restrições quando utilizados com tabelas particionadas:

As opções de nível de tabela `DATA DIRECTORY` e `INDEX DIRECTORY` são ignoradas (ver Bug #32091).

* Em Windows, as opções `DATA DIRECTORY` e `INDEX DIRECTORY` não são suportadas para partições individuais ou subpartições das tabelas `MyISAM`. No entanto, você pode usar `DATA DIRECTORY` para partições individuais ou subpartições das tabelas `InnoDB`.

**Reparando e reconstruindo tabelas particionadas.** As declarações `CHECK TABLE`, `OPTIMIZE TABLE`, `ANALYZE TABLE` e `REPAIR TABLE` são suportadas para tabelas particionadas.

Além disso, você pode usar `ALTER TABLE ... REBUILD PARTITION` para reconstruir uma ou mais partições de uma tabela particionada; `ALTER TABLE ... REORGANIZE PARTITION` também faz com que as partições sejam reconstruídas. Consulte a Seção 13.1.8, “Instrução ALTER TABLE”, para obter mais informações sobre essas duas instruções.

A partir do MySQL 5.7.2, as operações `ANALYZE`, `CHECK`, `OPTIMIZE`, `REPAIR` e `TRUNCATE` são suportadas com subpartições. `REBUILD` também foi aceito como sintaxe antes do MySQL 5.7.5, embora isso não tenha tido efeito. (Bug #19075411, Bug #73130) Veja também a Seção 13.1.8.1, “Operações de Partição de Tabela”.

**mysqlcheck**, **myisamchk** e **myisampack** não são suportados com tabelas particionadas.

**Opção para exportação (FLUSH TABLES).** A opção `FOR EXPORT` da declaração `FLUSH TABLES` não é suportada para tabelas `InnoDB` particionadas no MySQL 5.7.4 e versões anteriores. (Bug #16943907)

**Delimitadores de nome de arquivo para partições e subpartições.** Os nomes de arquivos de partição e subpartição incluem delimitadores gerados, como `#P#` e `#SP#`. A grafia dessas delimitadoras pode variar e não deve ser considerada como certa.

### 22.6.1 Chaves de Partição, Chaves Primárias e Chaves Únicas

Esta seção discute a relação entre as chaves de partição e as chaves primárias e as chaves únicas. A regra que rege essa relação pode ser expressa da seguinte forma: Todas as colunas utilizadas na expressão de partição de uma tabela particionada devem fazer parte de todas as chaves únicas que a tabela pode ter.

Em outras palavras, *toda chave única na tabela deve usar todas as colunas na expressão de particionamento da tabela*. (Isso também inclui a chave primária da tabela, uma vez que é, por definição, uma chave única. Este caso específico é discutido mais tarde nesta seção.) Por exemplo, cada uma das seguintes declarações de criação de tabela é inválida:

```sql
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

```sql
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

```sql
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

```sql
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

```sql
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

```sql
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

```sql
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

```sql
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

```sql
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

```sql
#  fails with error 1503
mysql> ALTER TABLE t_no_pk ADD PRIMARY KEY(c2);
ERROR 1503 (HY000): A PRIMARY KEY must include all columns in the table's partitioning function
```

Como o `t_no_pk` tem apenas `c1` em sua expressão de particionamento, tentar adicionar uma chave única em `c2` sozinha falha. No entanto, você pode adicionar uma chave única que use tanto `c1` quanto `c2`.

Essas regras também se aplicam a tabelas não particionadas existentes que você deseja particionar usando `ALTER TABLE ... PARTITION BY`. Considere uma tabela `np_pk` criada conforme mostrado aqui:

```sql
mysql> CREATE TABLE np_pk (
    ->     id INT NOT NULL AUTO_INCREMENT,
    ->     name VARCHAR(50),
    ->     added DATE,
    ->     PRIMARY KEY (id)
    -> );
Query OK, 0 rows affected (0.08 sec)
```

A seguinte declaração `ALTER TABLE` falha com um erro, porque a coluna `added` não faz parte de nenhuma chave única na tabela:

```sql
mysql> ALTER TABLE np_pk
    ->     PARTITION BY HASH( TO_DAYS(added) )
    ->     PARTITIONS 4;
ERROR 1503 (HY000): A PRIMARY KEY must include all columns in the table's partitioning function
```

No entanto, essa declaração que utiliza a coluna `id` para a coluna de partição é válida, conforme mostrado aqui:

```sql
mysql> ALTER TABLE np_pk
    ->     PARTITION BY HASH(id)
    ->     PARTITIONS 4;
Query OK, 0 rows affected (0.11 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

No caso de `np_pk`, a única coluna que pode ser usada como parte de uma expressão de partição é `id`; se você deseja particionar esta tabela usando qualquer outra coluna ou colunas na expressão de partição, você deve primeiro modificar a tabela, adicionando a coluna ou colunas desejadas à chave primária, ou descartando a chave primária por completo.

### 22.6.2 Limitações de Partição Relacionadas a Motores de Armazenamento

As seguintes limitações se aplicam ao uso de motores de armazenamento com particionamento definido pelo usuário de tabelas.

**Motor de armazenamento MERGE.** A partição definida pelo usuário e o motor de armazenamento `MERGE` não são compatíveis. As tabelas que utilizam o motor de armazenamento `MERGE` não podem ser particionadas. As tabelas particionadas não podem ser mescladas.

**Motor de armazenamento FEDERATED.** A partição de tabelas `FEDERATED` não é suportada; não é possível criar tabelas `FEDERATED` particionadas.

**Engenho de armazenamento CSV.** Tabelas particionadas usando o `CSV` não são suportadas; não é possível criar tabelas particionadas `CSV`.

**Engenho de armazenamento InnoDB. `InnoDB` Chaves estrangeiras e particionamento do MySQL não são compatíveis. Tabelas particionadas `InnoDB` não podem ter referências de chave estrangeira, nem podem ter colunas referenciadas por chaves estrangeiras. Tabelas `InnoDB` que têm ou que são referenciadas por chaves estrangeiras não podem ser particionadas.

`InnoDB` não suporta o uso de múltiplos discos para subpartições. (Atualmente, isso é suportado apenas por `MyISAM`.)

Além disso, `ALTER TABLE ... OPTIMIZE PARTITION` não funciona corretamente com tabelas particionadas que utilizam o mecanismo de armazenamento `InnoDB`. Em vez disso, use `ALTER TABLE ... REBUILD PARTITION` e `ALTER TABLE ... ANALYZE PARTITION`, para tais tabelas. Para mais informações, consulte a Seção 13.1.8.1, “Operações de Partição de Tabela”.

**Divisão definida pelo usuário e o motor de armazenamento NDB (NDB Cluster).** A divisão por `KEY` (incluindo `LINEAR KEY`) é o único tipo de divisão suportada pelo motor de armazenamento `NDB`. Não é possível, sob circunstâncias normais, em NDB Cluster criar uma tabela NDB Cluster usando qualquer tipo de divisão diferente de [`LINEAR` `KEY`, e tentar fazer isso falha com um erro.

*Exceção (não para produção)*: É possível ignorar essa restrição definindo a variável de sistema `new` nos nós do SQL do NDB Cluster como `ON`. Se optar por fazer isso, deve estar ciente de que as tabelas que utilizam tipos de particionamento que não são `[LINEAR] KEY` não são suportadas em produção. *Nesses casos, você pode criar e usar tabelas com tipos de particionamento que não são `KEY` ou `LINEAR KEY`, mas isso deve ser feito totalmente por sua conta e risco*. Deve também estar ciente de que essa funcionalidade já foi descontinuada e está sujeita à remoção sem aviso prévio em uma futura versão do NDB Cluster.

O número máximo de partições que podem ser definidas para uma tabela `NDB` depende do número de nós de dados e grupos de nós no clúster, da versão do software NDB Cluster em uso e de outros fatores. Consulte Partição definida por NDB e Partição definida pelo usuário, para obter mais informações.

A partir do MySQL NDB Cluster 7.5.2, o valor máximo de dados de tamanho fixo que podem ser armazenados por partição em uma tabela `NDB` é de 128 TB. Anteriormente, esse valor era de 16 GB.

`CREATE TABLE` e `ALTER TABLE` declarações que causariam uma tabela `NDB` particionada pelo usuário a não atender a um dos dois requisitos ou a ambos não são permitidas e falham com um erro:

1. A tabela deve ter uma chave primária explícita. 2. Todas as colunas listadas na expressão de particionamento da tabela devem fazer parte da chave primária.

**Exceção.** Se uma tabela `NDB` com partição de usuário for criada usando uma lista de colunas vazia (ou seja, usando `PARTITION BY KEY()` ou `PARTITION BY LINEAR KEY()`), então não é necessário uma chave primária explícita.

**Seleção de partição.** A seleção de partição não é suportada para as tabelas `NDB`. Consulte a Seção 22.5, “Seleção de partição”, para obter mais informações.

**Atualização de tabelas particionadas.** Ao realizar uma atualização, as tabelas que são particionadas por `KEY` e que utilizam qualquer mecanismo de armazenamento que não `NDB` devem ser descarregadas e recarregadas.

**O mesmo mecanismo de armazenamento para todas as partições.** Todas as partições de uma tabela particionada devem usar o mesmo mecanismo de armazenamento e deve ser o mesmo mecanismo de armazenamento usado pela tabela como um todo. Além disso, se não especificar um motor no nível da tabela, então deve fazer uma das seguintes ações ao criar ou alterar uma tabela particionada:

* Não especifique nenhum motor para *qualquer* partição ou subpartição

* Especifique o motor para *todas* as partições ou subpartições

### 22.6.3 Limitações de Partição Relativas a Funções

Esta seção discute as limitações na Partição do MySQL relacionadas especificamente às funções usadas em expressões de partição.

Apenas as funções MySQL mostradas na lista a seguir são permitidas em expressões de particionamento:

* `ABS()`
* `CEILING()` (consulte CEILING() e FLOOR() e FLOOR()"))

* `DATEDIFF()`
* `DAY()`
* `DAYOFMONTH()`
* `DAYOFWEEK()`
* `DAYOFYEAR()`
* `EXTRACT()` (ver função EXTRACT() com especificador de semana na função com especificador de semana)]]

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
* `UNIX_TIMESTAMP()` (com as colunas `TIMESTAMP`)

* `WEEKDAY()`
* `YEAR()`
* `YEARWEEK()`

No MySQL 5.7, o corte de partições é suportado para as funções `TO_DAYS()`, `TO_SECONDS()`, `YEAR()` e `UNIX_TIMESTAMP()`. Consulte a Seção 22.4, “Corte de Partições”, para obter mais informações.

**CEILING() e FLOOR().** Cada uma dessas funções retorna um inteiro apenas se for passada um argumento de um tipo numérico exato, como um dos tipos `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") ou `DECIMAL` - DECIMAL, NUMERIC"). Isso significa, por exemplo, que a seguinte declaração `CREATE TABLE` falha com um erro, como mostrado aqui:

```sql
mysql> CREATE TABLE t (c FLOAT) PARTITION BY LIST( FLOOR(c) )(
    ->     PARTITION p0 VALUES IN (1,3,5),
    ->     PARTITION p1 VALUES IN (2,4,6)
    -> );
ERROR 1490 (HY000): The PARTITION function returns the wrong type
```

**Função EXTRACT() com especificador WEEK.** O valor retornado pela função `EXTRACT()`, quando usada como `EXTRACT(WEEK FROM col)`, depende do valor da variável de sistema `default_week_format`. Por essa razão, `EXTRACT()` não é permitido como função de particionamento quando especifica a unidade como `WEEK`. (Bug #54483)

Consulte a Seção 12.6.2, “Funções Matemáticas”, para obter mais informações sobre os tipos de retorno dessas funções, bem como a Seção 11.1, “Tipos de Dados Numéricos”.

### 22.6.4 Partição e bloqueio

Para motores de armazenamento, como `MyISAM` que executam bloqueios de nível de tabela ao executar instruções DML ou DDL, uma declaração em versões mais antigas do MySQL (5.6.5 e anteriores) que afetava uma tabela particionada impunha um bloqueio na tabela como um todo; ou seja, todas as partições eram bloqueadas até que a declaração fosse concluída. No MySQL 5.7, a poda de bloqueio de partição elimina blocos desnecessários em muitos casos, e a maioria das declarações que leem ou atualizam uma tabela particionada `MyISAM` causa apenas o bloqueio das partições que realmente contêm as strings que satisfazem a condição `SELECT` da declaração `WHERE` são bloqueadas. Por exemplo, uma `SELECT` de uma tabela particionada `MyISAM` bloqueia apenas as partições que realmente contêm as strings que satisfazem a condição `SELECT` da declaração `WHERE` são bloqueadas.

Para declarações que afetam tabelas particionadas usando motores de armazenamento como `InnoDB`, que empregam bloqueio em nível de string e não realizam (ou não precisam realizar) os bloqueios antes da poda de partição, isso não é um problema.

Os próximos parágrafos discutem os efeitos da poda de bloqueio de partição para várias declarações do MySQL em tabelas que utilizam motores de armazenamento que empregam bloqueios em nível de tabela.

#### Efeitos em declarações DML

As declarações `SELECT` (incluindo aquelas que contêm uniões ou junções) bloqueiam apenas as partições que realmente precisam ser lidas. Isso também se aplica a `SELECT ... PARTITION`.

Um `UPDATE` poda blocos apenas para tabelas nas quais não são atualizados os campos de particionamento.

`REPLACE` e `INSERT` bloqueiam apenas as partições que possuem strings a serem inseridas ou substituídas. No entanto, se um valor `AUTO_INCREMENT` for gerado para qualquer coluna de partição, todas as partições serão bloqueadas.

`INSERT ... ON DUPLICATE KEY UPDATE` é podado enquanto nenhuma coluna de particionamento é atualizada.

`INSERT ... SELECT` bloqueia apenas as partições na tabela de origem que precisam ser lidas, embora todas as partições na tabela de destino estejam bloqueadas.

As bloqueadoras impostas por declarações `LOAD DATA` em tabelas particionadas não podem ser reduzidas.

A presença de `BEFORE INSERT` ou `BEFORE UPDATE` que utiliza qualquer coluna de particionamento de uma tabela particionada significa que as bloqueadas em declarações `INSERT` e `UPDATE` que atualizam esta tabela não podem ser eliminadas, uma vez que o gatilho pode alterar seus valores: Um gatilho `BEFORE INSERT` em qualquer uma das colunas de particionamento da tabela significa que as bloqueadas por `INSERT` ou `REPLACE` não podem ser eliminadas, uma vez que o gatilho `BEFORE INSERT` pode alterar as colunas de particionamento de uma string antes de a string ser inserida, forçando a string para uma partição diferente do que seria de outra forma. Um gatilho `BEFORE UPDATE` em uma coluna de particionamento significa que as bloqueadas impostas por `UPDATE` ou `INSERT ... ON DUPLICATE KEY UPDATE` não podem ser eliminadas.

#### Declarações DDL afetadas

`CREATE VIEW` não causa bloqueios.

`ALTER TABLE ... EXCHANGE PARTITION` libera bloqueios; apenas a tabela trocada e a partição trocada são bloqueadas.

`ALTER TABLE ... TRUNCATE PARTITION` limpa os bloqueios; apenas as partições que devem ser esvaziadas são bloqueadas.

Além disso, as declarações `ALTER TABLE` assumem bloqueios de metadados no nível da tabela.

#### Outras declarações

`LOCK TABLES` não pode podar bloqueios de partição.

`CALL stored_procedure(expr)` suporta poda de bloqueio, mas a avaliação de *`expr`*

As declarações `DO` e `SET` não suportam o corte de bloqueio de particionamento.