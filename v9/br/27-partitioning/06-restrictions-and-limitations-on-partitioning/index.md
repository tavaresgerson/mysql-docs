## Restrições e Limitações de Partição

26.6.1 Chaves de Partição, Chaves Primárias e Chaves Únicas

26.6.2 Limitações de Partição Relacionadas aos Motores de Armazenamento

26.6.3 Limitações de Partição Relacionadas às Funções

Esta seção discute as restrições e limitações atuais no suporte à partição do MySQL.

**Construções proibidas.** As seguintes construções não são permitidas em expressões de partição:

* Procedimentos armazenados, funções armazenadas, funções carregáveis ou plugins.

* Variáveis declaradas ou variáveis de usuário.

Para uma lista de funções SQL que são permitidas em expressões de partição, consulte a Seção 26.6.3, “Limitações de Partição Relacionadas às Funções”.

**Operadores aritméticos e lógicos.**

O uso dos operadores aritméticos `+`, `-` e `*` é permitido em expressões de partição. No entanto, o resultado deve ser um valor inteiro ou `NULL` (exceto no caso da partição `[LINEAR] KEY`, conforme discutido em outro lugar neste capítulo; consulte a Seção 26.2, “Tipos de Partição”, para mais informações).

O operador `DIV` também é suportado; o operador `/` não é permitido.

Os operadores de bits `|`, `&`, `^`, `<<`, `>>` e `~` não são permitidos em expressões de partição.

**Modo SQL do servidor.**

As tabelas que utilizam particionamento definido pelo usuário não preservam o modo SQL em vigor no momento em que foram criadas. Como discutido em outro lugar neste Manual (veja a Seção 7.1.11, “Modos SQL do Servidor”), os resultados de muitas funções e operadores do MySQL podem mudar de acordo com o modo SQL do servidor. Portanto, uma mudança no modo SQL a qualquer momento após a criação de tabelas particionadas pode levar a mudanças significativas no comportamento dessas tabelas e facilmente causar corrupção ou perda de dados. Por essas razões, **é fortemente recomendado que você nunca mude o modo SQL do servidor após criar tabelas particionadas**.

Para uma dessas mudanças no modo SQL do servidor que tornam tabelas particionadas inutilizáveis, considere a seguinte instrução `CREATE TABLE`, que só pode ser executada com sucesso se o modo `NO_UNSIGNED_SUBTRACTION` estiver em vigor:

```
mysql> SELECT @@sql_mode;
+------------+
| @@sql_mode |
+------------+
||
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

Se você remover o modo `NO_UNSIGNED_SUBTRACTION` do modo SQL do servidor após criar `tu`, você pode não conseguir mais acessar essa tabela:

```
mysql> SET sql_mode='';
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT * FROM tu;
ERROR 1563 (HY000): Partition constant is out of partition function domain
mysql> INSERT INTO tu VALUES (20);
ERROR 1563 (HY000): Partition constant is out of partition function domain
```

Veja também a Seção 7.1.11, “Modos SQL do Servidor”.

Os modos SQL do servidor também impactam a replicação de tabelas particionadas. Modos SQL diferentes na fonte e na replica podem levar a expressões de particionamento a serem avaliadas de maneira diferente; isso pode causar que a distribuição de dados entre as partições seja diferente nas cópias da fonte e da replica de uma determinada tabela e até mesmo causar inserções em tabelas particionadas que tenham sucesso na fonte falharem na replica. Para obter os melhores resultados, você deve sempre usar o mesmo modo SQL do servidor na fonte e na replica.

**Considerações de desempenho.** Alguns efeitos das operações de particionamento no desempenho são fornecidos na seguinte lista:

* **Operações no sistema de arquivos.** As operações de particionamento e re-particionamento (como `ALTER TABLE` com `PARTITION BY ...`, `REORGANIZE PARTITION` ou `REMOVE PARTITIONING`) dependem das operações no sistema de arquivos para sua implementação. Isso significa que a velocidade dessas operações é afetada por fatores como o tipo e as características do sistema de arquivos, a velocidade do disco, o espaço de troca, a eficiência de manipulação de arquivos do sistema operacional e as opções e variáveis do servidor MySQL relacionadas à manipulação de arquivos. Em particular, você deve garantir que `large_files_support` esteja habilitado e que `open_files_limit` esteja configurado corretamente. As operações de particionamento e re-particionamento que envolvem tabelas `InnoDB` podem ser tornadas mais eficientes ao habilitar `innodb_file_per_table`.

  Veja também o Número máximo de particionamentos.

* **Bloqueios de tabela.** Geralmente, o processo que executa uma operação de particionamento em uma tabela obtém um bloqueio de escrita na tabela. Leitura de tabelas dessas não é afetada de forma significativa; operações de `INSERT` e `UPDATE` pendentes são realizadas assim que a operação de particionamento for concluída. Para exceções específicas do `InnoDB` a essa limitação, consulte Operações de particionamento.

* **Indekses; poda de particionamento.** Como em tabelas não particionadas, o uso adequado de índices pode acelerar significativamente as consultas em tabelas particionadas. Além disso, projetar tabelas e consultas particionadas nessas tabelas para aproveitar a poda de particionamento pode melhorar o desempenho drasticamente. Consulte a Seção 26.4, “Poda de particionamento”, para mais informações.

  O empurrão de condições de índice é suportado para tabelas particionadas. Consulte a Seção 10.2.1.6, “Otimização de empurrão de condições de índice”.

* **Desempenho com LOAD DATA.** No MySQL 9.5, o `LOAD DATA` utiliza bufferização para melhorar o desempenho. Você deve estar ciente de que o buffer utiliza 130 KB de memória por partição para alcançar isso.

**Número máximo de partições.** O número máximo possível de partições para uma tabela específica que não utiliza o mecanismo de armazenamento `NDB` é

8192. Esse número inclui subpartições.

O número máximo possível de partições definidas pelo usuário para uma tabela que utiliza o mecanismo de armazenamento `NDB` é determinado de acordo com a versão do software NDB Cluster em uso, o número de nós de dados e outros fatores. Consulte NDB e partição definida pelo usuário, para mais informações.

Se, ao criar tabelas com um grande número de partições (mas menos que o máximo), você encontrar uma mensagem de erro como Got error ... from storage engine: Out of resources ao abrir o arquivo, você pode ser capaz de resolver o problema aumentando o valor da variável de sistema `open_files_limit`. No entanto, isso depende do sistema operacional e pode não ser possível ou aconselhável em todas as plataformas; consulte Seção B.3.2.16, “Arquivo Não Encontrado e Erros Semelhantes”, para mais informações. Em alguns casos, o uso de um grande número (centenas) de partições também pode não ser aconselhável devido a outras preocupações, portanto, o uso de mais partições não leva automaticamente a melhores resultados.

Veja também Operações do sistema de arquivos.

**Chaves estrangeiras não suportadas para tabelas InnoDB particionadas.** Tabelas particionadas que utilizam o mecanismo de armazenamento `InnoDB` não suportam chaves estrangeiras. Mais especificamente, isso significa que as seguintes duas declarações são verdadeiras:

1. Nenhuma definição de uma tabela `InnoDB` que utilize partição definida pelo usuário pode conter referências a chaves estrangeiras; nenhuma tabela `InnoDB` cuja definição contém referências a chaves estrangeiras pode ser particionada.

2. Nenhuma definição de tabela `InnoDB` pode conter uma referência de chave estrangeira para uma tabela particionada por usuário; nenhuma tabela `InnoDB` com particionamento definido pelo usuário pode conter colunas referenciadas por chaves estrangeiras.

O escopo das restrições listadas inclui todas as tabelas que utilizam o mecanismo de armazenamento `InnoDB`. As instruções `CREATE TABLE` e `ALTER TABLE` que resultam em tabelas que violam essas restrições não são permitidas.

**ALTER TABLE ... ORDER BY.** Uma instrução `ALTER TABLE ... ORDER BY column` executada em uma tabela particionada causa a ordenação de linhas apenas dentro de cada partição.

**ADD COLUMN ... ALGORITHM=INSTANT.** Uma vez que você execute `ALTER TABLE ... ADD COLUMN ... ALGORITHM=INSTANT` em uma tabela particionada, não é mais possível trocar partições com essa tabela.

**Efeitos nas instruções REPLACE por modificação de chaves primárias.** Em alguns casos, pode ser desejável (veja a Seção 26.6.1, “Chaves de Partição, Chaves Primárias e Chaves Únicas”) modificar a chave primária de uma tabela. Esteja ciente de que, se sua aplicação usa instruções `REPLACE` e você fizer isso, os resultados dessas instruções podem ser drasticamente alterados. Consulte a Seção 15.2.12, “Instrução REPLACE”, para mais informações e um exemplo.

**Índices FULLTEXT.** Tabelas particionadas não suportam índices ou buscas `FULLTEXT`.

**Colunas espaciais.** Colunas com tipos de dados espaciais, como `POINT` ou `GEOMETRY`, não podem ser usadas em tabelas particionadas.

**Tabelas temporárias.** Tabelas temporárias não podem ser particionadas.

**Tabelas de log.** Não é possível particionar as tabelas de log; uma instrução `ALTER TABLE ... PARTITION BY ...` em uma tabela desse tipo falha com um erro.

**Tipo de dado da chave de particionamento.** Uma chave de particionamento deve ser uma coluna inteira ou uma expressão que resolva para um inteiro. Expressões que utilizam colunas `ENUM` não podem ser usadas. O valor da coluna ou expressão também pode ser `NULL`; veja a Seção 26.2.7, “Como o particionamento do MySQL lida com `NULL`”.

Há duas exceções a essa restrição:

1. Quando particionando por [`LINEAR`] `KEY`, é possível usar colunas de qualquer tipo de dado MySQL válido, exceto `TEXT` ou `BLOB`, como chaves de particionamento, porque as funções internas de hashing de chaves produzem o tipo de dado correto a partir desses tipos. Por exemplo, as seguintes duas instruções `CREATE TABLE` são válidas:

   ```
   CREATE TABLE tkc (c1 CHAR)
   PARTITION BY KEY(c1)
   PARTITIONS 4;

   CREATE TABLE tke
       ( c1 ENUM('red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet') )
   PARTITION BY LINEAR KEY(c1)
   PARTITIONS 6;
   ```

2. Quando particionando por `RANGE COLUMNS` ou `LIST COLUMNS`, é possível usar colunas `STRING`, `DATE` e `DATETIME`. Por exemplo, cada uma das seguintes instruções `CREATE TABLE` é válida:

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

**Subconsultas.** Uma chave de particionamento não pode ser uma subconsulta, mesmo que essa subconsulta resolva para um valor inteiro ou `NULL`.

**Prefixos de índice de coluna não são suportados para particionamento por chave.** Ao criar uma tabela que é particionada por chave, quaisquer colunas na chave de particionamento que utilizem prefixos de coluna não são permitidas na função de particionamento da tabela. Considere a seguinte instrução `CREATE TABLE`, que tem três colunas `VARCHAR` e cuja chave primária utiliza todas as três colunas e especifica um prefixo para uma delas. Esta instrução é rejeitada com um erro, conforme mostrado aqui:

```
mysql> USE d;
Database changed
mysql> CREATE TABLE t1 (
    ->     a VARCHAR(10000),
    ->     b VARCHAR(25),
    ->     c VARCHAR(10),
    ->     PRIMARY KEY (a(10), b, c)
    -> ) PARTITION BY KEY() PARTITIONS 2;
ERROR 6123 (HY000): Column 'd.t1.a' having prefix key part 'a(10)' in the
PARTITION BY KEY() clause is not supported.
```

Para informações gerais sobre particionamento de tabelas por chave, consulte a Seção 26.2.5, “Particionamento por Chave”.

**Problemas com subpartições.** As subpartições devem usar a partição `HASH` ou `KEY`. Apenas as partições `RANGE` e `LIST` podem ser subpartidas; as partições `HASH` e `KEY` não podem ser subpartidas.

`SUBPARTITION BY KEY` exige que a(s) coluna(s) de subpartição seja(m) especificada(s) explicitamente, ao contrário do caso da partição `PARTITION BY KEY`, onde ela pode ser omitida (nesse caso, a coluna da chave primária da tabela é usada por padrão). Considere a tabela criada por essa declaração:

```
CREATE TABLE ts (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30)
);
```

Você pode criar uma tabela com as mesmas colunas, particionada por `KEY`, usando uma declaração como esta:

```
CREATE TABLE ts (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30)
)
PARTITION BY KEY()
PARTITIONS 4;
```

A declaração anterior é tratada como se tivesse sido escrita assim, com a coluna da chave primária da tabela sendo usada como coluna de particionamento:

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

**Opções de diretório de dados e diretório de índice.** As opções de nível de tabela `DATA DIRECTORY` e `INDEX DIRECTORY` são ignoradas (veja o Bug #32091). Você pode usar essas opções para partições ou subpartições individuais de tabelas `InnoDB`. O diretório especificado em uma cláusula `DATA DIRECTORY` deve ser conhecido pelo `InnoDB`. Para mais informações, consulte Usando a cláusula DATA DIRECTORY.

**Reparando e reconstruindo tabelas particionadas.** As declarações `CHECK TABLE`, `OPTIMIZE TABLE`, `ANALYZE TABLE` e `REPAIR TABLE` são suportadas para tabelas particionadas.

Além disso, você pode usar `ALTER TABLE ... REBUILD PARTITION` para reconstruir uma ou mais partições de uma tabela particionada; `ALTER TABLE ... REORGANIZE PARTITION` também faz com que as partições sejam reconstruídas. Consulte a Seção 15.1.11, “Instrução ALTER TABLE”, para obter mais informações sobre essas duas instruções.

As operações `ANALYZE`, `CHECK`, `OPTIMIZE`, `REPAIR` e `TRUNCATE` são suportadas com subpartições. Consulte a Seção 15.1.11.1, “Operações de Partição ALTER TABLE”.

**Delimitadores de nome de arquivo para partições e subpartições.** Os nomes de arquivo de partições e subpartições incluem delimitadores gerados, como `#P#` e `#SP#`. A letra desses delimitadores pode variar e não deve ser dependente.