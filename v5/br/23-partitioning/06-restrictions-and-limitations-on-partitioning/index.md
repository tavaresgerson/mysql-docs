## 22.6 Restrições e Limitações sobre a Partição

22.6.1 Partição de Chaves, Chaves Primárias e Chaves Únicas

22.6.2 Limitações de Partição Relacionadas a Motores de Armazenamento

22.6.3 Limitações de Partição Relacionadas a Funções

22.6.4 Partição e bloqueio

Esta seção discute as restrições e limitações atuais do suporte à partição do MySQL.

**Construções proibidas.** As seguintes construções não são permitidas em expressões de particionamento:

- Procedimentos armazenados, funções armazenadas, funções carregáveis ou plugins.

- Variáveis declaradas ou variáveis do usuário.

Para uma lista de funções SQL permitidas em expressões de particionamento, consulte Seção 22.6.3, “Limitações de particionamento relacionadas a funções”.

Operadores aritméticos e lógicos.

O uso dos operadores aritméticos `+`, `-` e `*` é permitido em expressões de partição. No entanto, o resultado deve ser um valor inteiro ou `NULL` (exceto no caso da partição `[LINEAR] KEY`, conforme discutido em outro lugar neste capítulo; consulte Seção 22.2, “Tipos de Partição” para mais informações).

O operador `DIV` também é suportado, e o operador `/` não é permitido. (Bug #30188, Bug #33182)

Os operadores de bits `|`, `&`, `^`, `<<`, `>>` e `~` não são permitidos em expressões de particionamento.

**Declarações HANDLER.** Anteriormente, a declaração `HANDLER` não era suportada com tabelas particionadas. Essa limitação foi removida a partir do MySQL 5.7.1.

Modo SQL do servidor.

As tabelas que utilizam particionamento definido pelo usuário não preservam o modo SQL em vigor no momento em que foram criadas. Como discutido em Seção 5.1.10, “Modos SQL do Servidor”, os resultados de muitas funções e operadores do MySQL podem mudar de acordo com o modo SQL do servidor. Portanto, uma mudança no modo SQL a qualquer momento após a criação de tabelas particionadas pode levar a mudanças significativas no comportamento dessas tabelas e facilmente causar corrupção ou perda de dados. Por essas razões, **é fortemente recomendado que você nunca mude o modo SQL do servidor após criar tabelas particionadas**.

**Exemplos.** Os exemplos a seguir ilustram algumas mudanças no comportamento de tabelas particionadas devido a uma alteração no modo SQL do servidor:

1. **Tratamento de erros.** Suponha que você crie uma tabela particionada cuja expressão de particionamento é uma como `column DIV 0` ou `column MOD 0`, como mostrado aqui:

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

   No entanto, ao alterar o modo SQL do servidor para tratar a divisão por zero como um erro e para impor um tratamento de erro rigoroso, a mesma instrução `INSERT` falha, como mostrado aqui:

   ```sql
   mysql> SET sql_mode='STRICT_ALL_TABLES,ERROR_FOR_DIVISION_BY_ZERO';
   Query OK, 0 rows affected (0.00 sec)

   mysql> INSERT INTO tn VALUES (NULL), (0), (1);
   ERROR 1365 (22012): Division by 0
   ```

2. **Acessibilidade da tabela.** Às vezes, uma mudança no modo SQL do servidor pode tornar tabelas particionadas inutilizáveis. A seguinte instrução `CREATE TABLE` pode ser executada com sucesso apenas se o modo `NO_UNSIGNED_SUBTRACTION` estiver em vigor:

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

   Se você remover o modo SQL do servidor `NO_UNSIGNED_SUBTRACTION` após criar `tu`, você pode não conseguir mais acessar essa tabela:

   ```sql
   mysql> SET sql_mode='';
   Query OK, 0 rows affected (0.00 sec)

   mysql> SELECT * FROM tu;
   ERROR 1563 (HY000): Partition constant is out of partition function domain
   mysql> INSERT INTO tu VALUES (20);
   ERROR 1563 (HY000): Partition constant is out of partition function domain
   ```

   Veja também Seção 5.1.10, "Modos SQL do Servidor".

Os modos do servidor SQL também afetam a replicação de tabelas particionadas. Modos de SQL diferentes na fonte e na replica podem levar a expressões de particionamento a serem avaliadas de maneira diferente; isso pode causar que a distribuição dos dados entre as partições seja diferente nas cópias da fonte e da replica de uma determinada tabela, e até mesmo causar inserções em tabelas particionadas que têm sucesso na fonte, mas falham na replica. Para obter os melhores resultados, você deve sempre usar o mesmo modo de SQL do servidor na fonte e na replica.

**Considerações sobre o desempenho.** Algumas das consequências das operações de particionamento no desempenho estão listadas a seguir:

- **Operações do sistema de arquivos.** As operações de particionamento e re-particionamento (como `ALTER TABLE` com `PARTITION BY ...`, `REORGANIZE PARTITION` ou `REMOVE PARTITIONING`) dependem das operações do sistema de arquivos para sua implementação. Isso significa que a velocidade dessas operações é afetada por fatores como o tipo e as características do sistema de arquivos, a velocidade do disco, o espaço de troca, a eficiência de manipulação de arquivos do sistema operacional e as opções e variáveis do servidor MySQL relacionadas à manipulação de arquivos. Em particular, você deve garantir que o `large_files_support` esteja habilitado e que o `open_files_limit` esteja configurado corretamente. Para tabelas particionadas usando o motor de armazenamento `MyISAM`, aumentar o `myisam_max_sort_file_size` pode melhorar o desempenho; as operações de particionamento e re-particionamento envolvendo tabelas `InnoDB` podem ser tornadas mais eficientes ao habilitar o `innodb_file_per_table`.

  Veja também Número máximo de partições.

- **Uso de descritores de arquivo para tabelas `MyISAM` e particionamento.** Para uma tabela `MyISAM` particionada, o MySQL usa 2 descritores de arquivo para cada partição, para cada tabela aberta. Isso significa que você precisa de muitos mais descritores de arquivo para realizar operações em uma tabela `MyISAM` particionada do que em uma tabela que é idêntica a ela, exceto que esta última tabela não está particionada, especialmente ao realizar operações de `ALTER TABLE` (alter-table-partition-operations.html).

  Suponha uma tabela `MyISAM` `t` com 100 particionamentos, como a tabela criada por esta instrução SQL:

  ```sql
  CREATE TABLE t (c1 VARCHAR(50))
  PARTITION BY KEY (c1) PARTITIONS 100
  ENGINE=MYISAM;
  ```

  Nota

  Por simplicidade, usaremos a partição `KEY` para a tabela mostrada neste exemplo, mas o uso de descritores de arquivo conforme descrito aqui se aplica a todas as tabelas `MyISAM` particionadas, independentemente do tipo de particionamento utilizado. Tabelas particionadas usando outros motores de armazenamento, como `InnoDB`, não são afetadas por este problema.

  Agora, suponha que você queira repartir `t` para que ele tenha 101 partições, usando a declaração mostrada aqui:

  ```sql
  ALTER TABLE t PARTITION BY KEY (c1) PARTITIONS 101;
  ```

  Para processar essa instrução `ALTER TABLE`, o MySQL usa 402 descritores de arquivo — ou seja, dois para cada uma das 100 partições originais, mais dois para cada uma das 101 novas partições. Isso ocorre porque todas as partições (velhas e novas) devem ser abertas simultaneamente durante a reorganização dos dados da tabela. Recomenda-se que, se você espera realizar tais operações, certifique-se de que a variável de sistema `open_files_limit` não esteja definida muito baixa para acomodá-las.

- **Bloqueios de tabelas.** Geralmente, o processo que executa uma operação de particionamento em uma tabela obtém um bloqueio de escrita na tabela. As leituras dessas tabelas são relativamente não afetadas; as operações pendentes de `INSERT` e `UPDATE` são realizadas assim que a operação de particionamento for concluída. Para exceções específicas do `InnoDB` a essa limitação, consulte Operações de particionamento.

- **Motor de armazenamento.** As operações de particionamento, consultas e operações de atualização tendem a ser geralmente mais rápidas com tabelas `MyISAM` do que com tabelas `InnoDB` ou `NDB` (mysql-cluster.html).

- **Indekses; poda de partições.** Assim como as tabelas não particionadas, o uso adequado de índices pode acelerar significativamente as consultas em tabelas particionadas. Além disso, projetar tabelas particionadas e consultas nessas tabelas para aproveitar a poda de partições pode melhorar o desempenho drasticamente. Consulte Seção 22.4, “Poda de Partições” para obter mais informações.

  Anteriormente, a otimização por empilhamento de condições de índice não era suportada para tabelas particionadas. Essa limitação foi removida no MySQL 5.7.3. Veja Seção 8.2.1.5, “Otimização por Empilhamento de Condições de Índice”.

- **Desempenho com LOAD DATA.** No MySQL 5.7, o `LOAD DATA` utiliza o buffer para melhorar o desempenho. Você deve estar ciente de que o buffer utiliza 130 KB de memória por partição para alcançar isso.

**Número máximo de partições.** O número máximo possível de partições para uma tabela específica que não utiliza o mecanismo de armazenamento `NDB` é

8192. Esse número inclui subpartições.

O número máximo de partições definidas pelo usuário para uma tabela usando o mecanismo de armazenamento `NDB` é determinado de acordo com a versão do software NDB Cluster em uso, o número de nós de dados e outros fatores. Consulte NDB e partição definida pelo usuário para obter mais informações.

Se, ao criar tabelas com um grande número de partições (mas menos do que o máximo), você encontrar uma mensagem de erro como "Erro ... do mecanismo de armazenamento: Sem recursos ao abrir o arquivo", você pode resolver o problema aumentando o valor da variável de sistema `open_files_limit`. No entanto, isso depende do sistema operacional e pode não ser possível ou aconselhável em todas as plataformas; consulte Seção B.3.2.16, “Arquivo Não Encontrado e Erros Semelhantes” para obter mais informações. Em alguns casos, o uso de um grande número (centenas) de partições também pode não ser aconselhável devido a outras preocupações, portanto, o uso de mais partições não leva automaticamente a melhores resultados.

Veja também Operações do sistema de arquivos.

**Cache de consulta não suportado.** O cache de consulta não é suportado para tabelas particionadas e é desativado automaticamente para consultas que envolvem tabelas particionadas. O cache de consulta não pode ser ativado para essas consultas.

**Caches de chaves por partição.** No MySQL 5.7, os caches de chaves são suportados para tabelas particionadas de `MyISAM`, usando as instruções `CACHE INDEX` e `LOAD INDEX INTO CACHE`. As caches de chaves podem ser definidas para uma, várias ou todas as partições, e índices para uma, várias ou todas as partições podem ser pré-carregados em caches de chaves.

**Chaves estrangeiras não são suportadas para tabelas particionadas do InnoDB.** Tabelas particionadas usando o mecanismo de armazenamento `InnoDB` não suportam chaves estrangeiras. Mais especificamente, isso significa que as seguintes duas afirmações são verdadeiras:

1. Nenhuma definição de uma tabela `InnoDB` que utilize partição definida pelo usuário pode conter referências de chave estrangeira; nenhuma tabela `InnoDB` cuja definição contenha referências de chave estrangeira pode ser particionada.

2. Nenhuma definição de tabela `InnoDB` pode conter uma referência de chave estrangeira para uma tabela particionada pelo usuário; nenhuma tabela `InnoDB` com particionamento definido pelo usuário pode conter colunas referenciadas por chaves estrangeiras.

O escopo das restrições listadas acima inclui todas as tabelas que utilizam o mecanismo de armazenamento `InnoDB. `CREATE TABLE`(criar-chave-estrangeira-tabela.html) e`ALTER TABLE\` (alterar-tabela.html) instruções que resultarão em tabelas que violam essas restrições não são permitidas.

**ALTER TABLE ... ORDER BY.** Uma instrução `ALTER TABLE ... ORDER BY coluna` executada em uma tabela particionada faz com que as linhas sejam ordenadas apenas dentro de cada partição.

**Efeitos nas declarações REPLACE por modificação de chaves primárias.** Em alguns casos, pode ser desejável (veja Seção 22.6.1, “Chaves de Partição, Chaves Primárias e Chaves Únicas”] modificar a chave primária de uma tabela. Esteja ciente de que, se sua aplicação usa as declarações `REPLACE` e você fizer isso, os resultados dessas declarações podem ser drasticamente alterados. Consulte Seção 13.2.8, “Declaração REPLACE” para obter mais informações e um exemplo.

**Índices FULLTEXT.** As tabelas particionadas não suportam índices ou pesquisas `FULLTEXT`, mesmo para tabelas particionadas que utilizam o mecanismo de armazenamento `InnoDB` ou `MyISAM`.

**Colunas espaciais.** Colunas com tipos de dados espaciais, como `POINT` ou `GEOMETRY`, não podem ser usadas em tabelas particionadas.

Tabelas temporárias. As tabelas temporárias não podem ser particionadas. (Bug #17497)

\*\*Tabelas de log. Não é possível particionar as tabelas de log; uma declaração `ALTER TABLE ... PARTITION BY ...` em uma tabela desse tipo falha com um erro.

**Tipo de dados da chave de particionamento.** Uma chave de particionamento deve ser uma coluna inteira ou uma expressão que resolva em um inteiro. Expressões que utilizam colunas `ENUM` (enum.html) não podem ser usadas. O valor da coluna ou expressão também pode ser `NULL`. (Veja Seção 22.2.7, “Como o particionamento do MySQL lida com NULLs”).

Existem duas exceções a essa restrição:

1. Ao particionar por \[`LINEAR` `KEY`], é possível usar colunas de qualquer tipo de dado MySQL válido, exceto `TEXT` ou `BLOB` como chaves de particionamento, porque as funções internas de hashing de chaves do MySQL produzem o tipo de dado correto a partir desses tipos. Por exemplo, as seguintes duas instruções de `CREATE TABLE` são válidas:

   ```sql
   CREATE TABLE tkc (c1 CHAR)
   PARTITION BY KEY(c1)
   PARTITIONS 4;

   CREATE TABLE tke
       ( c1 ENUM('red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet') )
   PARTITION BY LINEAR KEY(c1)
   PARTITIONS 6;
   ```

2. Ao particionar por `COLUNAS DE RANGEM` ou `COLUNAS DE LISTA`, é possível usar colunas de texto, ``DATA` e ``DATA/Hora`. Por exemplo, cada uma das seguintes instruções de `[`CREATE TABLE\`]\(create-table.html) é válida:

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

Nenhuma das exceções anteriores se aplica aos tipos de coluna `BLOB` ou `TEXT`.

**Subconsultas.** Uma chave de particionamento não pode ser uma subconsulta, mesmo que essa subconsulta resolva a um valor inteiro ou `NULL`.

**Prefixos de índice de colunas não são suportados para partição por chave.** Ao criar uma tabela que é particionada por chave, quaisquer colunas na chave de partição que utilizem prefixos de coluna não são usadas na função de partição da tabela. Considere a seguinte declaração `CREATE TABLE`, que tem três colunas `VARCHAR` e cuja chave primária utiliza todas as três colunas e especifica prefixos para duas delas:

```sql
CREATE TABLE t1 (
    a VARCHAR(10000),
    b VARCHAR(25),
    c VARCHAR(10),
    PRIMARY KEY (a(10), b, c(2))
) PARTITION BY KEY() PARTITIONS 2;
```

Essa declaração é aceita, mas a tabela resultante é criada como se você tivesse emitido a seguinte declaração, usando apenas a coluna da chave primária que não inclui um prefixo (coluna `b`) para a chave de particionamento:

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

Isso também ocorre ao alterar ou atualizar essas tabelas e inclui casos em que as colunas usadas na função de particionamento são definidas implicitamente como as da chave primária da tabela, utilizando uma cláusula `PARTITION BY KEY()` vazia.

Este é um problema conhecido que é resolvido no MySQL 8.0 ao desativar o comportamento permissivo; no MySQL 8.0, se quaisquer colunas que utilizam prefixos forem incluídas na função de particionamento de uma tabela, o servidor registra uma advertência apropriada para cada coluna, ou levanta um erro descritivo, se necessário. (Permitir o uso de colunas com prefixos em chaves de particionamento está sujeito à remoção total em uma futura versão do MySQL.)

Para obter informações gerais sobre a partição de tabelas por chave, consulte Seção 22.2.5, “Partição por Chave”.

**Problemas com subpartições.** As subpartições devem usar a partição `HASH` ou `KEY`. Apenas as partições `RANGE` e `LIST` podem ser subpartidas; as partições `HASH` e `KEY` não podem ser subpartidas.

`SUBPARTITION BY KEY` exige que a(s) coluna(s) de subpartição seja(m) especificada(s) explicitamente, ao contrário do caso com `PARTITION BY KEY`, onde ela(s) pode(m) ser omitida(s) (nesse caso, a coluna da chave primária da tabela é usada por padrão). Considere a tabela criada por esta declaração:

```sql
CREATE TABLE ts (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30)
);
```

Você pode criar uma tabela com as mesmas colunas, particionada por `KEY`, usando uma declaração como esta:

```sql
CREATE TABLE ts (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30)
)
PARTITION BY KEY()
PARTITIONS 4;
```

A declaração anterior é tratada como se tivesse sido escrita assim, com a coluna da chave primária da tabela sendo usada como coluna de particionamento:

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

Este é um problema conhecido (veja o bug #51470).

Opções **DATA DIRECTORY** e **INDEX DIRECTORY**. As opções **DATA DIRECTORY** e **INDEX DIRECTORY** estão sujeitas às seguintes restrições quando usadas com tabelas particionadas:

- As opções de nível de tabela `DATA DIRECTORY` e `INDEX DIRECTORY` são ignoradas (veja o bug #32091).

- No Windows, as opções `DATA DIRECTORY` e `INDEX DIRECTORY` não são suportadas para partições ou subpartições individuais de tabelas de `MyISAM`. No entanto, você pode usar `DATA DIRECTORY` para partições ou subpartições individuais de tabelas de `InnoDB`.

**Reparando e reconstruindo tabelas particionadas.** As instruções `CHECK TABLE`, `OPTIMIZE TABLE`, `ANALYZE TABLE` e `REPAIR TABLE` são suportadas para tabelas particionadas.

Além disso, você pode usar `ALTER TABLE ... REBUILD PARTITION` para reconstruir uma ou mais partições de uma tabela particionada; `ALTER TABLE ... REORGANIZE PARTITION` também faz com que as partições sejam reconstruídas. Consulte Seção 13.1.8, “Instrução ALTER TABLE” para obter mais informações sobre essas duas instruções.

A partir do MySQL 5.7.2, as operações `ANALYZE`, `CHECK`, `OPTIMIZE`, `REPAIR` e `TRUNCATE` são suportadas com subpartições. A sintaxe `REBUILD` também era aceita antes do MySQL 5.7.5, embora isso não tivesse efeito. (Bug #19075411, Bug #73130) Veja também Seção 13.1.8.1, “Operações de Partição de Tabela ALTER”.

**mysqlcheck**, **myisamchk** e **myisampack** não são suportados com tabelas particionadas.

**OPÇÃO PARA EXPORTAÇÃO (LIMPE TABELAS).** A opção `FOR EXPORT` da instrução `FLUSH TABLES` não é suportada para tabelas `InnoDB` particionadas no MySQL 5.7.4 e versões anteriores. (Bug #16943907)

**Delimitadores de arquivos para partições e subpartições.** Os nomes de arquivos de partições e subpartições incluem delimitadores gerados, como `#P#` e `#SP#`. A letra desses delimitadores pode variar e não deve ser considerada como certa.
