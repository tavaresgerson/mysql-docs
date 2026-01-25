#### 13.7.5.36 Instrução SHOW TABLE STATUS

```sql
SHOW TABLE STATUS
    [{FROM | IN} db_name]
    [LIKE 'pattern' | WHERE expr]
```

O `SHOW TABLE STATUS` funciona como o `SHOW TABLES`, mas fornece muita informação sobre cada tabela que não é `TEMPORARY`. Você também pode obter essa lista usando o comando [**mysqlshow --status *`db_name`***](mysqlshow.html "4.5.7 mysqlshow — Display Database, Table, and Column Information"). A cláusula `LIKE`, se presente, indica quais nomes de tabela devem ser correspondidos. A cláusula `WHERE` pode ser fornecida para selecionar linhas usando condições mais gerais, conforme discutido na [Seção 24.8, “Extensões para Instruções SHOW”](extended-show.html "24.8 Extensions to SHOW Statements").

Esta instrução também exibe informações sobre views.

A saída de `SHOW TABLE STATUS` possui as seguintes colunas:

* `Name`

  O nome da tabela.

* `Engine`

  A storage engine para a tabela. Consulte o [Capítulo 14, *The InnoDB Storage Engine*](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"), e o [Capítulo 15, *Alternative Storage Engines*](storage-engines.html "Chapter 15 Alternative Storage Engines").

  Para tabelas particionadas, `Engine` mostra o nome da storage engine usada por todas as partitions.

* `Version`

  O número da versão do arquivo `.frm` da tabela.

* `Row_format`

  O formato de armazenamento de linha (`Fixed`, `Dynamic`, `Compressed`, `Redundant`, `Compact`). Para tabelas `MyISAM`, `Dynamic` corresponde ao que o [**myisamchk -dvv**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility") reporta como `Packed`. O formato de tabela `InnoDB` é `Redundant` ou `Compact` ao usar o formato de arquivo `Antelope`, ou `Compressed` ou `Dynamic` ao usar o formato de arquivo `Barracuda`.

* `Rows`

  O número de linhas. Algumas storage engines, como `MyISAM`, armazenam a contagem exata. Para outras storage engines, como `InnoDB`, este valor é uma aproximação e pode variar do valor real em até 40% a 50%. Nesses casos, use `SELECT COUNT(*)` para obter uma contagem precisa.

  O valor de `Rows` é `NULL` para tabelas `INFORMATION_SCHEMA`.

  Para tabelas [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"), a contagem de linhas é apenas uma estimativa aproximada usada na otimização de SQL. (Isso também é verdade se a tabela [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") for particionada.)

* `Avg_row_length`

  O comprimento médio da linha.

  Consulte as notas no final desta seção para obter informações relacionadas.

* `Data_length`

  Para `MyISAM`, `Data_length` é o comprimento do arquivo de dados, em bytes.

  Para `InnoDB`, `Data_length` é a quantidade aproximada de espaço alocado para o clustered index, em bytes. Especificamente, é o tamanho do clustered index, em páginas, multiplicado pelo tamanho da página `InnoDB`.

  Consulte as notas no final desta seção para obter informações sobre outras storage engines.

* `Max_data_length`

  Para `MyISAM`, `Max_data_length` é o comprimento máximo do arquivo de dados. Este é o número total de bytes de dados que podem ser armazenados na tabela, dado o tamanho do ponteiro de dados usado.

  Não utilizado para `InnoDB`.

  Consulte as notas no final desta seção para obter informações sobre outras storage engines.

* `Index_length`

  Para `MyISAM`, `Index_length` é o comprimento do arquivo de Index, em bytes.

  Para `InnoDB`, `Index_length` é a quantidade aproximada de espaço alocado para non-clustered indexes, em bytes. Especificamente, é a soma dos tamanhos de non-clustered index, em páginas, multiplicada pelo tamanho da página `InnoDB`.

  Consulte as notas no final desta seção para obter informações sobre outras storage engines.

* `Data_free`

  O número de bytes alocados, mas não utilizados.

  Tabelas `InnoDB` relatam o free space (espaço livre) do tablespace ao qual a tabela pertence. Para uma tabela localizada no shared tablespace, este é o free space do shared tablespace. Se você estiver usando múltiplos tablespaces e a tabela tiver seu próprio tablespace, o free space é apenas para essa tabela. Free space significa o número de bytes em extents completamente livres, menos uma margem de segurança. Mesmo que o free space seja exibido como 0, pode ser possível inserir linhas, desde que novos extents não precisem ser alocados.

  Para NDB Cluster, `Data_free` mostra o espaço alocado em disco para, mas não usado por, uma tabela ou fragmento Disk Data no disco. (O uso de recursos de dados na memória é relatado pela coluna `Data_length`.)

  Para tabelas particionadas, este valor é apenas uma estimativa e pode não estar absolutamente correto. Um método mais preciso para obter esta informação em tais casos é consultar a tabela [`PARTITIONS`](information-schema-partitions-table.html "24.3.16 The INFORMATION_SCHEMA PARTITIONS Table") do `INFORMATION_SCHEMA`, conforme mostrado neste exemplo:

  ```sql
  SELECT SUM(DATA_FREE)
      FROM  INFORMATION_SCHEMA.PARTITIONS
      WHERE TABLE_SCHEMA = 'mydb'
      AND   TABLE_NAME   = 'mytable';
  ```

  Para obter mais informações, consulte a [Seção 24.3.16, “The INFORMATION_SCHEMA PARTITIONS Table”](information-schema-partitions-table.html "24.3.16 The INFORMATION_SCHEMA PARTITIONS Table").

* `Auto_increment`

  O próximo valor `AUTO_INCREMENT`.

* `Create_time`

  Quando a tabela foi criada.

* `Update_time`

  Quando o arquivo de dados foi atualizado pela última vez. Para algumas storage engines, este valor é `NULL`. Por exemplo, `InnoDB` armazena múltiplas tabelas em seu [system tablespace](glossary.html#glos_system_tablespace "system tablespace") e o timestamp do arquivo de dados não se aplica. Mesmo com o modo [file-per-table](glossary.html#glos_file_per_table "file-per-table"), onde cada tabela `InnoDB` está em um arquivo `.ibd` separado, o [change buffering](glossary.html#glos_change_buffering "change buffering") pode atrasar a gravação no arquivo de dados, de modo que o tempo de modificação do arquivo é diferente do tempo da última inserção, atualização ou exclusão. Para `MyISAM`, o timestamp do arquivo de dados é usado; no entanto, no Windows, o timestamp não é atualizado por updates, de modo que o valor é impreciso.

  `Update_time` exibe um valor de timestamp para o último [`UPDATE`](update.html "13.2.11 UPDATE Statement"), [`INSERT`](insert.html "13.2.5 INSERT Statement") ou [`DELETE`](delete.html "13.2.2 DELETE Statement") realizado em tabelas `InnoDB` que não são particionadas. Para MVCC, o valor do timestamp reflete o tempo de [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"), que é considerado o tempo da última atualização. Os timestamps não são persistidos quando o servidor é reiniciado ou quando a tabela é desalojada do cache de dicionário de dados do `InnoDB`.

  A coluna `Update_time` também mostra essa informação para tabelas `InnoDB` particionadas.

* `Check_time`

  Quando a tabela foi verificada pela última vez. Nem todas as storage engines atualizam este tempo, caso em que o valor é sempre `NULL`.

  Para tabelas [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") particionadas, `Check_time` é sempre `NULL`.

* `Collation`

  A collation padrão da tabela. A saída não lista explicitamente o character set padrão da tabela, mas o nome da collation começa com o nome do character set.

* `Checksum`

  O valor de checksum ativo, se houver.

* `Create_options`

  Opções extras usadas com [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement").

  `Create_options` mostra `partitioned` para uma tabela particionada.

  `Create_options` mostra a opção `ENCRYPTION` especificada ao criar ou alterar um tablespace file-per-table.

  Ao criar uma tabela com [strict mode](glossary.html#glos_strict_mode "strict mode") desabilitado, o formato de linha padrão da storage engine é usado se o formato de linha especificado não for suportado. O formato de linha real da tabela é reportado na coluna `Row_format`. `Create_options` mostra o formato de linha que foi especificado na instrução [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement").

  Ao alterar a storage engine de uma tabela, as opções de tabela que não são aplicáveis à nova storage engine são mantidas na definição da tabela para permitir reverter a tabela com suas opções definidas anteriormente para a storage engine original, se necessário. `Create_options` pode mostrar opções retidas.

* `Comment`

  O comentário usado ao criar a tabela (ou informações sobre por que o MySQL não pôde acessar as informações da tabela).

##### Notas

* Para tabelas `InnoDB`, `SHOW TABLE STATUS` não fornece estatísticas precisas, exceto para o tamanho físico reservado pela tabela. A contagem de linhas é apenas uma estimativa aproximada usada na otimização de SQL.

* Para tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), a saída desta instrução mostra valores apropriados para as colunas `Avg_row_length` e `Data_length`, com a exceção de que as colunas [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") não são levadas em consideração.

* Para tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), `Data_length` inclui dados armazenados apenas na memória principal; as colunas `Max_data_length` e `Data_free` se aplicam a Disk Data.

* Para tabelas NDB Cluster Disk Data, `Max_data_length` mostra o espaço alocado para a parte de disco de uma tabela ou fragmento Disk Data. (O uso de recursos de dados na memória é relatado pela coluna `Data_length`.)

* Para tabelas `MEMORY`, os valores de `Data_length`, `Max_data_length` e `Index_length` aproximam a quantidade real de memória alocada. O algoritmo de alocação reserva memória em grandes quantidades para reduzir o número de operações de alocação.

* Para views, todas as colunas exibidas por `SHOW TABLE STATUS` são `NULL`, exceto que `Name` indica o nome da view e `Comment` diz `VIEW`.

As informações da tabela também estão disponíveis na tabela [`TABLES`](information-schema-tables-table.html "24.3.25 The INFORMATION_SCHEMA TABLES Table") do `INFORMATION_SCHEMA`. Consulte a [Seção 24.3.25, “The INFORMATION_SCHEMA TABLES Table”](information-schema-tables-table.html "24.3.25 The INFORMATION_SCHEMA TABLES Table").