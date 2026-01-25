### 22.2.5 Particionamento por KEY

O particionamento por KEY é semelhante ao particionamento por HASH, exceto que, onde o particionamento por HASH emprega uma expressão definida pelo usuário, a função de hashing para particionamento por KEY é fornecida pelo servidor MySQL. O NDB Cluster usa [`MD5()`](encryption-functions.html#function_md5) para este fim; para tabelas que usam outros Storage Engines, o servidor emprega sua própria função de hashing interna, baseada no mesmo algoritmo que [`PASSWORD()`](encryption-functions.html#function_password).

As regras de sintaxe para `CREATE TABLE ... PARTITION BY KEY` são semelhantes às de criação de uma tabela particionada por HASH. As principais diferenças estão listadas aqui:

* `KEY` é usado em vez de `HASH`.

* `KEY` aceita apenas uma lista de zero ou mais nomes de coluna. Quaisquer colunas usadas como chave de particionamento (partitioning key) devem compreender parte ou a totalidade da Primary Key da tabela, se a tabela tiver uma. Quando nenhum nome de coluna é especificado como chave de particionamento, a Primary Key da tabela é usada, se houver. Por exemplo, a seguinte instrução [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") é válida no MySQL 5.7:

  ```sql
  CREATE TABLE k1 (
      id INT NOT NULL PRIMARY KEY,
      name VARCHAR(20)
  )
  PARTITION BY KEY()
  PARTITIONS 2;
  ```

  Se não houver Primary Key, mas houver uma Unique Key, a Unique Key será usada para a chave de particionamento:

  ```sql
  CREATE TABLE k1 (
      id INT NOT NULL,
      name VARCHAR(20),
      UNIQUE KEY (id)
  )
  PARTITION BY KEY()
  PARTITIONS 2;
  ```

  No entanto, se a coluna da Unique Key não fosse definida como `NOT NULL`, a instrução anterior falharia.

  Em ambos os casos, a chave de particionamento é a coluna `id`, embora não seja exibida na saída de [`SHOW CREATE TABLE`](show-create-table.html "13.7.5.10 SHOW CREATE TABLE Statement") ou na coluna `PARTITION_EXPRESSION` da tabela [`PARTITIONS`](information-schema-partitions-table.html "24.3.16 The INFORMATION_SCHEMA PARTITIONS Table") do Information Schema.

  Ao contrário do que acontece com outros tipos de particionamento, as colunas usadas para particionamento por `KEY` não estão restritas a valores integer ou `NULL`. Por exemplo, a seguinte instrução [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") é válida:

  ```sql
  CREATE TABLE tm1 (
      s1 CHAR(32) PRIMARY KEY
  )
  PARTITION BY KEY(s1)
  PARTITIONS 10;
  ```

  A instrução precedente *não* seria válida, caso um tipo de particionamento diferente fosse especificado. (Neste caso, usar simplesmente `PARTITION BY KEY()` também seria válido e teria o mesmo efeito que `PARTITION BY KEY(s1)`, já que `s1` é a Primary Key da tabela.)

  Para informações adicionais sobre este tópico, consulte [Section 22.6, “Restrictions and Limitations on Partitioning”](partitioning-limitations.html "22.6 Restrictions and Limitations on Partitioning").

  Colunas com index prefixes (prefixos de índice) não são suportadas em chaves de particionamento. Isso significa que colunas [`CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), [`BINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types") e [`VARBINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types") podem ser usadas em uma chave de particionamento, desde que não empreguem prefixes; como um prefixo deve ser especificado para colunas [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") e [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") em definições de Index, não é possível usar colunas desses dois tipos em chaves de particionamento. No MySQL 5.7, colunas usando prefixes são permitidas ao criar, alterar ou atualizar tabelas particionadas, mesmo que não estejam incluídas na chave de particionamento da tabela. Este é um problema conhecido no MySQL 5.7 que foi resolvido no MySQL 8.0, onde este comportamento permissivo é descontinuado (deprecated), e o servidor exibe avisos ou erros apropriados ao tentar usar tais colunas nesses casos. Consulte [Column index prefixes not supported for key partitioning](partitioning-limitations.html#partitioning-limitations-prefixes "Column index prefixes not supported for key partitioning"), para mais informações e exemplos.

  Note

  Tabelas que usam o Storage Engine [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") são implicitamente particionadas por `KEY`, usando a Primary Key da tabela como chave de particionamento (assim como em outros Storage Engines do MySQL). Caso a tabela NDB Cluster não tenha uma Primary Key explícita, a Primary Key “oculta” gerada pelo Storage Engine [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") para cada tabela NDB Cluster é usada como chave de particionamento.

  Se você definir um esquema de particionamento explícito para uma tabela [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), a tabela deve ter uma Primary Key explícita, e quaisquer colunas usadas na expressão de particionamento devem fazer parte dessa chave. No entanto, se a tabela usar uma expressão de particionamento “vazia”—isto é, `PARTITION BY KEY()` sem referências de coluna—então nenhuma Primary Key explícita é exigida.

  Você pode observar este particionamento usando o utilitário [**ndb_desc**](mysql-cluster-programs-ndb-desc.html "21.5.10 ndb_desc — Describe NDB Tables") (com a opção `-p`).

  Important

  Para uma tabela particionada por KEY, você não pode executar um `ALTER TABLE DROP PRIMARY KEY`, pois isso gera o erro ERROR 1466 (HY000): Field in list of fields for partition function not found in table. Isso não é um problema para tabelas NDB Cluster que são particionadas por `KEY`; nesses casos, a tabela é reorganizada usando a Primary Key “oculta” como a nova chave de particionamento da tabela. Consulte [Chapter 21, *MySQL NDB Cluster 7.5 and NDB Cluster 7.6*](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6").

Também é possível particionar uma tabela por linear key. Aqui está um exemplo simples:

```sql
CREATE TABLE tk (
    col1 INT NOT NULL,
    col2 CHAR(5),
    col3 DATE
)
PARTITION BY LINEAR KEY (col1)
PARTITIONS 3;
```

O uso de `LINEAR` tem o mesmo efeito no particionamento por `KEY` que tem no particionamento por `HASH`, com o número da partição sendo derivado usando um algoritmo de potências de dois em vez de aritmética modular. Consulte [Section 22.2.4.1, “LINEAR HASH Partitioning”](partitioning-linear-hash.html "22.2.4.1 LINEAR HASH Partitioning"), para uma descrição deste algoritmo e suas implicações.