### 28.3.26 A Tabela `INFORMATION\_SCHEMA\_PARTITIONS`

A tabela `PARTITIONS` fornece informações sobre as partições das tabelas. Cada linha desta tabela corresponde a uma partição ou subpartição individual de uma tabela particionada. Para obter mais informações sobre a particionamento de tabelas, consulte o Capítulo 26, *Particionamento*.

A tabela `PARTITIONS` tem as seguintes colunas:

* `TABLE_CATALOG`

  O nome do catálogo ao qual a tabela pertence. Esse valor é sempre `def`.

* `TABLE_SCHEMA`

  O nome do esquema (banco de dados) ao qual a tabela pertence.

* `TABLE_NAME`

  O nome da tabela que contém a partição.

* `PARTITION_NAME`

  O nome da partição.

* `SUBPARTITION_NAME`

  Se a linha da tabela `PARTITIONS` representar uma subpartição, o nome da subpartição; caso contrário, `NULL`.

  Para `NDB`: Esse valor é sempre `NULL`.

* `PARTITION_ORDINAL_POSITION`

  Todas as partições são indexadas na mesma ordem em que são definidas, com `1` sendo o número atribuído à primeira partição. A indexação pode mudar à medida que partições são adicionadas, excluídas e reorganizadas; o número exibido nesta coluna reflete a ordem atual, levando em conta quaisquer mudanças na indexação.

* `SUBPARTITION_ORDINAL_POSITION`

  Subpartições dentro de uma partição dada também são indexadas e reindexadas da mesma maneira que as partições são indexadas dentro de uma tabela.

* `PARTITION_METHOD`

  Um dos valores `RANGE`, `LIST`, `HASH`, `LINEAR HASH`, `KEY` ou `LINEAR KEY`; ou seja, um dos tipos de particionamento disponíveis conforme discutido na Seção 26.2, *Tipos de Particionamento*.

* `SUBPARTITION_METHOD`

  Um dos valores `HASH`, `LINEAR HASH`, `KEY` ou `LINEAR KEY`; ou seja, um dos tipos de subparticionamento disponíveis conforme discutido na Seção 26.2.6, *Subparticionamento*.

* `PARTITION_EXPRESSION`

A expressão para a função de partição usada na instrução `CREATE TABLE` ou `ALTER TABLE` que criou o esquema de partição atual da tabela.

Por exemplo, considere uma tabela particionada criada no banco de dados `test` usando esta instrução:

```
  CREATE TABLE tp (
      c1 INT,
      c2 INT,
      c3 VARCHAR(25)
  )
  PARTITION BY HASH(c1 + c2)
  PARTITIONS 4;
  ```

A coluna `PARTITION_EXPRESSION` na linha de uma tabela `PARTITIONS` para uma partição desta tabela exibe `c1 + c2`, conforme mostrado aqui:

```
  mysql> SELECT DISTINCT PARTITION_EXPRESSION
         FROM INFORMATION_SCHEMA.PARTITIONS
         WHERE TABLE_NAME='tp' AND TABLE_SCHEMA='test';
  +----------------------+
  | PARTITION_EXPRESSION |
  +----------------------+
  | c1 + c2              |
  +----------------------+
  ```

Para uma tabela que não é explicitamente particionada, esta coluna é sempre `NULL`, independentemente do mecanismo de armazenamento.

* `SUBPARTITION_EXPRESSION`

  Funciona da mesma forma para a expressão de subpartição que define a subpartição para uma tabela como a `PARTITION_EXPRESSION` faz para a expressão de partição usada para definir o esquema de partição de uma tabela.

  Se a tabela não tiver subpartições, esta coluna é `NULL`.

* `PARTITION_DESCRIPTION`

  Esta coluna é usada para partições `RANGE` e `LIST`. Para uma partição `RANGE`, ela contém o valor definido na cláusula `VALUES LESS THAN` da partição, que pode ser um inteiro ou `MAXVALUE`. Para uma partição `LIST`, esta coluna contém os valores definidos na cláusula `VALUES IN` da partição, que é uma lista de valores inteiros separados por vírgula.

  Para partições cuja `PARTITION_METHOD` é diferente de `RANGE` ou `LIST`, esta coluna é sempre `NULL`.

* `TABLE_ROWS`

  O número de linhas da tabela na partição.

  Para tabelas `InnoDB` particionadas, o número de linhas dado na coluna `TABLE_ROWS` é apenas um valor estimado usado na otimização do SQL e pode não ser sempre exato.

  Para tabelas `NDB`, você também pode obter esta informação usando o utilitário **ndb\_desc**.

* `AVG_ROW_LENGTH`

O comprimento médio das linhas armazenadas nesta partição ou subpartição, em bytes. Isso é o mesmo que `DATA_LENGTH` dividido por `TABLE_ROWS`.

Para tabelas `NDB`, você também pode obter essas informações usando o utilitário **ndb\_desc**.

* `DATA_LENGTH`

  O comprimento total de todas as linhas armazenadas nesta partição ou subpartição, em bytes; ou seja, o número total de bytes armazenados na partição ou subpartição.

  Para tabelas `NDB`, você também pode obter essas informações usando o utilitário **ndb\_desc**.

* `MAX_DATA_LENGTH`

  O número máximo de bytes que podem ser armazenados nesta partição ou subpartição.

  Para tabelas `NDB`, você também pode obter essas informações usando o utilitário **ndb\_desc**.

* `INDEX_LENGTH`

  O comprimento do arquivo de índice para esta partição ou subpartição, em bytes.

  Para partições de tabelas `NDB`, independentemente de as tabelas usarem particionamento implícito ou explícito, o valor da coluna `INDEX_LENGTH` é sempre 0. No entanto, você pode obter informações equivalentes usando o utilitário **ndb\_desc**.

* `DATA_FREE`

  O número de bytes alocados para a partição ou subpartição, mas não utilizados.

  Para tabelas `NDB`, você também pode obter essas informações usando o utilitário **ndb\_desc**.

* `CREATE_TIME`

  O tempo em que a partição ou subpartição foi criada.

* `UPDATE_TIME`

  O tempo em que a partição ou subpartição foi modificada pela última vez.

* `CHECK_TIME`

  A última vez que a tabela a qual esta partição ou subpartição pertence foi verificada.

  Para tabelas `InnoDB` particionadas, o valor é sempre `NULL`.

* `CHECKSUM`

  O valor do checksum, se houver; caso contrário, `NULL`.

* `PARTITION_COMMENT`

  O texto do comentário, se a partição tiver um. Se não, esse valor está vazio.

O comprimento máximo de um comentário de partição é definido como 1024 caracteres, e a largura de exibição da coluna `PARTITION_COMMENT` também é de 1024 caracteres, para corresponder a esse limite.

* `NODEGROUP`

  Este é o grupo de nós ao qual a partição pertence. Para as tabelas do NDB Cluster, este é sempre `default`. Para tabelas particionadas usando motores de armazenamento diferentes do `NDB`, o valor também é `default`. Caso contrário, esta coluna está em branco.

* `TABLESPACE_NAME`

  O nome do tablespace ao qual a partição pertence. O valor é sempre `DEFAULT`, a menos que a tabela use o motor de armazenamento `NDB` (consulte as *Notas* no final desta seção).

#### Notas

* `PARTITIONS` é uma tabela não padrão do `INFORMATION_SCHEMA`.

* Uma tabela que usa qualquer motor de armazenamento diferente do `NDB` e que não está particionada tem uma linha na tabela `PARTITIONS`. No entanto, os valores das colunas `PARTITION_NAME`, `SUBPARTITION_NAME`, `PARTITION_ORDINAL_POSITION`, `SUBPARTITION_ORDINAL_POSITION`, `PARTITION_METHOD`, `SUBPARTITION_METHOD`, `PARTITION_EXPRESSION`, `SUBPARTITION_EXPRESSION`, e `PARTITION_DESCRIPTION` são todos `NULL`. Além disso, a coluna `PARTITION_COMMENT` neste caso está em branco.

* Uma tabela `NDB` que não está explicitamente particionada tem uma linha na tabela `PARTITIONS` para cada nó de dados no cluster NDB. Para cada linha dessa natureza:

  + As colunas `SUBPARTITION_NAME`, `SUBPARTITION_ORDINAL_POSITION`, `SUBPARTITION_METHOD`, `PARTITION_EXPRESSION`, `SUBPARTITION_EXPRESSION`, `CREATE_TIME`, `UPDATE_TIME`, `CHECK_TIME`, `CHECKSUM`, e `TABLESPACE_NAME` são todas `NULL`.

  + A coluna `PARTITION_METHOD` é sempre `AUTO`.

  + A coluna `NODEGROUP` é `default`.

  + A coluna `PARTITION_COMMENT` está em branco.