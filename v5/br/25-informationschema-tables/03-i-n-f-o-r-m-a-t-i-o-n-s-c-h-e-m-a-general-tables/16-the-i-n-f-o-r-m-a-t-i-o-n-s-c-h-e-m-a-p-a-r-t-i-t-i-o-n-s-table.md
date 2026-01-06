### 24.3.16 A tabela INFORMATION\_SCHEMA PARTITIONS

A tabela `PARTITIONS` fornece informações sobre as partições de tabela. Cada linha desta tabela corresponde a uma partição ou subpartição individual de uma tabela particionada. Para obter mais informações sobre a partição de tabelas, consulte Capítulo 22, *Partição*.

A tabela `PARTITIONS` tem as seguintes colunas:

- `TABLE_CATALOG`

  O nome do catálogo ao qual a tabela pertence. Esse valor é sempre `def`.

- `TABLE_SCHEMA`

  O nome do esquema (banco de dados) ao qual a tabela pertence.

- `NOME_TABELA`

  O nome da tabela que contém a partição.

- `PARTITION_NAME`

  O nome da partição.

- `SUBPARTITION_NAME`

  Se a linha da tabela `PARTITIONS` representar uma subpartição, o nome da subpartição; caso contrário, `NULL`.

- `POSIÇÃO_ORDINAL_DA_PARTIÇÃO`

  Todas as partições são indexadas na mesma ordem em que são definidas, com o número `1` sendo o atribuído à primeira partição. O índice pode mudar à medida que partições são adicionadas, removidas e reorganizadas; o número exibido reflete a ordem atual, levando em conta quaisquer alterações no índice.

- `SUBPARTITION_ORDINAL_POSITION`

  As subpartições dentro de uma partição específica também são indexadas e reindexadas da mesma maneira que as partições são indexadas dentro de uma tabela.

- `PARTITION_METHOD`

  Um dos valores `RANGE`, `LIST`, `HASH`, `HASH LINEAR`, `KEY` ou `KEY LINEAR`; ou seja, um dos tipos de particionamento disponíveis, conforme discutido em Seção 22.2, “Tipos de particionamento”.

- `SUBPARTITION_METHOD`

  Um dos valores `HASH`, `HASH LINEAR`, `CHAVE` ou `CHAVE LINEAR`; ou seja, um dos tipos de subpartição disponíveis, conforme discutido em Seção 22.2.6, “Subpartição”.

- `PARTITION_EXPRESSION`

  A expressão para a função de partição usada na instrução `CREATE TABLE` ou `ALTER TABLE` que criou o esquema de partição atual da tabela.

  Por exemplo, considere uma tabela particionada criada no banco de dados `test` usando esta declaração:

  ```sql
  CREATE TABLE tp (
      c1 INT,
      c2 INT,
      c3 VARCHAR(25)
  )
  PARTITION BY HASH(c1 + c2)
  PARTITIONS 4;
  ```

  A coluna `PARTITION_EXPRESSION` na linha de uma tabela `PARTITIONS` para uma partição desta tabela exibe `c1 + c2`, conforme mostrado aqui:

  ```sql
  mysql> SELECT DISTINCT PARTITION_EXPRESSION
         FROM INFORMATION_SCHEMA.PARTITIONS
         WHERE TABLE_NAME='tp' AND TABLE_SCHEMA='test';
  +----------------------+
  | PARTITION_EXPRESSION |
  +----------------------+
  | c1 + c2              |
  +----------------------+
  ```

  Para uma tabela `[NDB]` (mysql-cluster.html) que não esteja explicitamente particionada, essa coluna está vazia. Para tabelas que utilizam outros mecanismos de armazenamento e que não estejam particionadas, essa coluna é `NULL`.

- `SUBPARTITION_EXPRESSION`

  Isso funciona da mesma maneira para a expressão de subpartição que define a subpartição para uma tabela, assim como a expressão `PARTITION_EXPRESSION` faz com a expressão de partição usada para definir a partição de uma tabela.

  Se a tabela não tiver subpartições, essa coluna será `NULL`.

- `PARTITION_DESCRIPTION`

  Esta coluna é usada para partições de tipo RANGE e LIST. Para uma partição de tipo `RANGE`, ela contém o conjunto de valores definido na cláusula `VALUES LESS THAN` da partição, que pode ser um inteiro ou `MAXVALUE`. Para uma partição de tipo `LIST`, esta coluna contém os valores definidos na cláusula `VALUES IN` da partição, que é uma lista de valores inteiros separados por vírgula.

  Para partições cuja `PARTITION_METHOD` é diferente de `RANGE` ou `LIST`, esta coluna é sempre `NULL`.

- `TABELA_LINHAS`

  O número de linhas da tabela na partição.

  Para tabelas particionadas do tipo `InnoDB`, o número de linhas fornecido na coluna `TABLE_ROWS` é apenas um valor estimado usado na otimização do SQL e pode não ser sempre exato.

  Para tabelas de `NDB`, você também pode obter essas informações usando o utilitário **ndb\_desc**.

- `AVG_ROW_LENGTH`

  O comprimento médio das linhas armazenadas nesta partição ou subpartição, em bytes. Isso é o mesmo que `DATA_LENGTH` dividido por `TABLE_ROWS`.

  Para tabelas de `NDB`, você também pode obter essas informações usando o utilitário **ndb\_desc**.

- `DATA_LENGTH`

  O comprimento total de todas as linhas armazenadas nesta partição ou subpartição, em bytes; ou seja, o número total de bytes armazenados na partição ou subpartição.

  Para tabelas de `NDB`, você também pode obter essas informações usando o utilitário **ndb\_desc**.

- `MAX_DATA_LENGTH`

  O número máximo de bytes que podem ser armazenados nesta partição ou subpartição.

  Para tabelas de `NDB`, você também pode obter essas informações usando o utilitário **ndb\_desc**.

- `INDEX_LENGTH`

  O comprimento do arquivo de índice para esta partição ou subpartição, em bytes.

  Para partições de tabelas de `NDB`, independentemente de as tabelas usarem partição implícita ou explícita, o valor da coluna `INDEX_LENGTH` é sempre 0. No entanto, você pode obter informações equivalentes usando o utilitário **ndb\_desc**.

- `DATA_FREE`

  O número de bytes alocados para a partição ou subpartição, mas não utilizados.

  Para tabelas de `NDB`, você também pode obter essas informações usando o utilitário **ndb\_desc**.

- `CREATE_TIME`

  O momento em que a partição ou subpartição foi criada.

- `UPDATE_TIME`

  O horário em que a partição ou subpartição foi modificada pela última vez.

- `CHECK_TIME`

  A última vez que a tabela a qual esta partição ou subpartição pertence foi verificada.

  Para tabelas particionadas de `InnoDB`, o valor é sempre `NULL`.

- `CHECKSUM`

  O valor do checksum, se houver; caso contrário, `NULL`.

- `PARTITION_COMMENT`

  O texto do comentário, se a partição tiver um. Se não, este valor está vazio.

  O comprimento máximo de um comentário de partição é definido como 1024 caracteres, e a largura de exibição da coluna `PARTITION_COMMENT` também é de 1024 caracteres, para corresponder a esse limite.

- `NODEGROUP`

  Este é o grupo de nós ao qual a partição pertence. Para as tabelas do NDB Cluster, este é sempre `default`. Para tabelas particionadas usando motores de armazenamento diferentes de `NDB`, o valor também é `default`. Caso contrário, esta coluna está vazia.

- `TABLESPACE_NAME`

  O nome do espaço de tabelas ao qual a partição pertence. O valor é sempre `DEFAULT`, a menos que a tabela utilize o mecanismo de armazenamento `NDB` (consulte as *Notas* no final desta seção).

#### Notas

- `PARTITIONS` é uma tabela `INFORMATION_SCHEMA` não padrão.

- Uma tabela que utiliza outro mecanismo de armazenamento, diferente de `NDB` e que não está particionada, tem uma única linha na tabela `PARTITIONS`. No entanto, os valores das colunas `PARTITION_NAME`, `SUBPARTITION_NAME`, `PARTITION_ORDINAL_POSITION`, `SUBPARTITION_ORDINAL_POSITION`, `PARTITION_METHOD`, `SUBPARTITION_METHOD`, `PARTITION_EXPRESSION`, `SUBPARTITION_EXPRESSION` e `PARTITION_DESCRIPTION` são todos `NULL`. Além disso, a coluna `PARTITION_COMMENT` neste caso está em branco.

- Uma tabela `NDB` que não está explicitamente particionada tem uma linha na tabela `PARTITIONS` para cada nó de dados no cluster NDB. Para cada linha dessa natureza:

  - As colunas `SUBPARTITION_NAME`, `SUBPARTITION_ORDINAL_POSITION`, `SUBPARTITION_METHOD`, `SUBPARTITION_EXPRESSION`, `CREATE_TIME`, `UPDATE_TIME`, `CHECK_TIME`, `CHECKSUM` e `TABLESPACE_NAME` estão todas `NULL`.

  - O `PARTITION_METHOD` é sempre `KEY`.

  - A coluna `NODEGROUP` é `default`.

  - As colunas `PARTITION_EXPRESSION` e `PARTITION_COMMENT` estão vazias.
