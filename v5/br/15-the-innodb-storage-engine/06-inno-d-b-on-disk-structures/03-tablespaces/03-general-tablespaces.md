#### 14.6.3.3 Tablespaces Gerais

Um tablespace geral é um tablespace `InnoDB` compartilhado que é criado usando a sintaxe `CREATE TABLESPACE`. As capacidades e recursos dos tablespaces gerais são descritos nos seguintes tópicos nesta seção:

* Capacidades de Tablespace Geral
* Criando um Tablespace Geral
* Adicionando Tabelas a um Tablespace Geral
* Suporte a Row Format de Tablespace Geral
* Movendo Tabelas Entre Tablespaces Usando ALTER TABLE
* Eliminando um Tablespace Geral
* Limitações de Tablespace Geral

##### Capacidades de Tablespace Geral

Tablespaces gerais fornecem as seguintes capacidades:

* Similar ao system tablespace, os tablespaces gerais são tablespaces compartilhados capazes de armazenar dados para múltiplas tabelas.

* Tablespaces gerais têm uma potencial vantagem de memória sobre os tablespaces *file-per-table*. O servidor mantém os metadados do tablespace na memória durante a vida útil do tablespace. Múltiplas tabelas em menos tablespaces gerais consomem menos memória para metadados de tablespace do que o mesmo número de tabelas em tablespaces *file-per-table* separados.

* Os arquivos de dados do tablespace geral podem ser colocados em um diretório relativo ou independente do *data directory* do MySQL, o que oferece muitas das capacidades de gerenciamento de armazenamento e arquivos de dados dos tablespaces *file-per-table*. Assim como nos tablespaces *file-per-table*, a capacidade de colocar arquivos de dados fora do *data directory* do MySQL permite gerenciar o desempenho de tabelas críticas separadamente, configurar RAID ou DRBD para tabelas específicas, ou vincular tabelas a discos particulares, por exemplo.

* Tablespaces gerais suportam os formatos de arquivo Antelope e Barracuda e, portanto, suportam todos os *row formats* de tabela e recursos associados. Com suporte para ambos os formatos de arquivo, os tablespaces gerais não dependem das configurações `innodb_file_format` ou `innodb_file_per_table`, nem estas variáveis têm qualquer efeito sobre os tablespaces gerais.

* A opção `TABLESPACE` pode ser usada com `CREATE TABLE` para criar tabelas em tablespaces gerais, tablespace *file-per-table* ou no system tablespace.

* A opção `TABLESPACE` pode ser usada com `ALTER TABLE` para mover tabelas entre tablespaces gerais, tablespaces *file-per-table* e o system tablespace.

##### Criando um Tablespace Geral

Tablespaces gerais são criados usando a sintaxe `CREATE TABLESPACE`.

```sql
CREATE TABLESPACE tablespace_name
    ADD DATAFILE 'file_name'
    [FILE_BLOCK_SIZE = value]
        [ENGINE [=] engine_name]
```

Um tablespace geral pode ser criado no *data directory* ou fora dele. Para evitar conflitos com tablespaces *file-per-table* criados implicitamente, a criação de um tablespace geral em um subdiretório abaixo do *data directory* não é suportada. Ao criar um tablespace geral fora do *data directory*, o diretório deve existir antes de criar o tablespace.

Um arquivo .isl é criado no *data directory* do MySQL quando um tablespace geral é criado fora do *data directory* do MySQL.

Exemplos:

Criando um tablespace geral no *data directory*:

```sql
mysql> CREATE TABLESPACE `ts1` ADD DATAFILE 'ts1.ibd' Engine=InnoDB;
```

Criando um tablespace geral em um diretório fora do *data directory*:

```sql
mysql> CREATE TABLESPACE `ts1` ADD DATAFILE '/my/tablespace/directory/ts1.ibd' Engine=InnoDB;
```

Você pode especificar um caminho que seja relativo ao *data directory*, contanto que o diretório do tablespace não esteja abaixo do *data directory*. Neste exemplo, o diretório `my_tablespace` está no mesmo nível do *data directory*:

```sql
mysql> CREATE TABLESPACE `ts1` ADD DATAFILE '../my_tablespace/ts1.ibd' Engine=InnoDB;
```

Nota

A cláusula `ENGINE = InnoDB` deve ser definida como parte da instrução `CREATE TABLESPACE`, ou `InnoDB` deve ser definido como o *storage engine* padrão (`default_storage_engine=InnoDB`).

##### Adicionando Tabelas a um Tablespace Geral

Após criar um tablespace geral, as instruções `CREATE TABLE tbl_name ... TABLESPACE [=] tablespace_name` ou `ALTER TABLE tbl_name TABLESPACE [=] tablespace_name` podem ser usadas para adicionar tabelas ao tablespace, conforme mostrado nos seguintes exemplos:

`CREATE TABLE`:

```sql
mysql> CREATE TABLE t1 (c1 INT PRIMARY KEY) TABLESPACE ts1;
```

`ALTER TABLE`:

```sql
mysql> ALTER TABLE t2 TABLESPACE ts1;
```

Nota

O suporte para adicionar *partitions* de tabela a tablespaces compartilhados foi descontinuado no MySQL 5.7.24; espera-se que seja removido em uma futura versão do MySQL. Tablespaces compartilhados incluem o `InnoDB` system tablespace e os tablespaces gerais.

Para informações detalhadas sobre a sintaxe, consulte `CREATE TABLE` e `ALTER TABLE`.

##### Suporte a Row Format de Tablespace Geral

Tablespaces gerais suportam todos os *row formats* de tabela (`REDUNDANT`, `COMPACT`, `DYNAMIC`, `COMPRESSED`) com a ressalva de que tabelas compactadas e não compactadas não podem coexistir no mesmo tablespace geral devido a diferentes tamanhos de *page* física.

Para que um tablespace geral contenha tabelas compactadas (`ROW_FORMAT=COMPRESSED`), a opção `FILE_BLOCK_SIZE` deve ser especificada, e o valor de `FILE_BLOCK_SIZE` deve ser um tamanho de *page* compactada válido em relação ao valor de `innodb_page_size`. Além disso, o tamanho da *page* física da tabela compactada (`KEY_BLOCK_SIZE`) deve ser igual a `FILE_BLOCK_SIZE/1024`. Por exemplo, se `innodb_page_size=16KB` e `FILE_BLOCK_SIZE=8K`, o `KEY_BLOCK_SIZE` da tabela deve ser 8.

A tabela a seguir mostra as combinações permitidas de `innodb_page_size`, `FILE_BLOCK_SIZE` e `KEY_BLOCK_SIZE`. Os valores de `FILE_BLOCK_SIZE` também podem ser especificados em bytes. Para determinar um valor válido de `KEY_BLOCK_SIZE` para um dado `FILE_BLOCK_SIZE`, divida o valor de `FILE_BLOCK_SIZE` por 1024. A compressão de tabela não é suportada para tamanhos de *page* `InnoDB` de 32K e 64K. Para mais informações sobre `KEY_BLOCK_SIZE`, consulte `CREATE TABLE` e a Seção 14.9.1.2, “Criando Tabelas Compactadas”.

**Tabela 14.3 Combinações Permitidas de Page Size, FILE_BLOCK_SIZE e KEY_BLOCK_SIZE para Tabelas Compactadas**

| InnoDB Page Size (innodb_page_size) | Valor Permitido de FILE_BLOCK_SIZE | Valor Permitido de KEY_BLOCK_SIZE |
| :--- | :--- | :--- |
| 64KB | 64K (65536) | A Compressão não é suportada |
| 32KB | 32K (32768) | A Compressão não é suportada |
| 16KB | 16K (16384) | Nenhum. Se `innodb_page_size` for igual a `FILE_BLOCK_SIZE`, o tablespace não pode conter uma tabela compactada. |
| 16KB | 8K (8192) | 8 |
| 16KB | 4K (4096) | 4 |
| 16KB | 2K (2048) | 2 |
| 16KB | 1K (1024) | 1 |
| 8KB | 8K (8192) | Nenhum. Se `innodb_page_size` for igual a `FILE_BLOCK_SIZE`, o tablespace não pode conter uma tabela compactada. |
| 8KB | 4K (4096) | 4 |
| 8KB | 2K (2048) | 2 |
| 8KB | 1K (1024) | 1 |
| 4KB | 4K (4096) | Nenhum. Se `innodb_page_size` for igual a `FILE_BLOCK_SIZE`, o tablespace não pode conter uma tabela compactada. |
| 4K | 2K (2048) | 2 |
| 4KB | 1K (1024) | 1 |

Este exemplo demonstra a criação de um tablespace geral e a adição de uma tabela compactada. O exemplo assume um `innodb_page_size` padrão de 16KB. O `FILE_BLOCK_SIZE` de 8192 exige que a tabela compactada tenha um `KEY_BLOCK_SIZE` de 8.

```sql
mysql> CREATE TABLESPACE `ts2` ADD DATAFILE 'ts2.ibd' FILE_BLOCK_SIZE = 8192 Engine=InnoDB;

mysql> CREATE TABLE t4 (c1 INT PRIMARY KEY) TABLESPACE ts2 ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;
```

Se você não especificar `FILE_BLOCK_SIZE` ao criar um tablespace geral, `FILE_BLOCK_SIZE` usa como padrão `innodb_page_size`. Quando `FILE_BLOCK_SIZE` é igual a `innodb_page_size`, o tablespace pode conter apenas tabelas com um *row format* não compactado (os *row formats* `COMPACT`, `REDUNDANT` e `DYNAMIC`).

##### Movendo Tabelas Entre Tablespaces Usando ALTER TABLE

`ALTER TABLE` com a opção `TABLESPACE` pode ser usado para mover uma tabela para um tablespace geral existente, para um novo tablespace *file-per-table* ou para o system tablespace.

Nota

O suporte para colocar *partitions* de tabela em tablespaces compartilhados foi descontinuado no MySQL 5.7.24; espera-se que seja removido em uma futura versão do MySQL. Tablespaces compartilhados incluem o `InnoDB` system tablespace e os tablespaces gerais.

Para mover uma tabela de um tablespace *file-per-table* ou do system tablespace para um tablespace geral, especifique o nome do tablespace geral. O tablespace geral deve existir. Consulte `ALTER TABLESPACE` para mais informações.

```sql
ALTER TABLE tbl_name TABLESPACE [=] tablespace_name;
```

Para mover uma tabela de um tablespace geral ou tablespace *file-per-table* para o system tablespace, especifique `innodb_system` como o nome do tablespace.

```sql
ALTER TABLE tbl_name TABLESPACE [=] innodb_system;
```

Para mover uma tabela do system tablespace ou de um tablespace geral para um tablespace *file-per-table*, especifique `innodb_file_per_table` como o nome do tablespace.

```sql
ALTER TABLE tbl_name TABLESPACE [=] innodb_file_per_table;
```

As operações `ALTER TABLE ... TABLESPACE` causam uma reconstrução completa da tabela (*full table rebuild*), mesmo que o atributo `TABLESPACE` não tenha mudado de seu valor anterior.

A sintaxe `ALTER TABLE ... TABLESPACE` não suporta a movimentação de uma tabela de um tablespace temporário para um tablespace persistente.

A cláusula `DATA DIRECTORY` é permitida com `CREATE TABLE ... TABLESPACE=innodb_file_per_table`, mas não é suportada para uso em combinação com a opção `TABLESPACE` em outros casos.

Restrições se aplicam ao mover tabelas de tablespaces criptografados. Consulte Limitações de Criptografia.

##### Eliminando um Tablespace Geral

A instrução `DROP TABLESPACE` é usada para eliminar um tablespace geral `InnoDB`.

Todas as tabelas devem ser eliminadas do tablespace antes de uma operação `DROP TABLESPACE`. Se o tablespace não estiver vazio, `DROP TABLESPACE` retorna um erro.

Use uma Query semelhante à seguinte para identificar tabelas em um tablespace geral.

```sql
mysql> SELECT a.NAME AS space_name, b.NAME AS table_name FROM INFORMATION_SCHEMA.INNODB_TABLESPACES a,
       INFORMATION_SCHEMA.INNODB_TABLES b WHERE a.SPACE=b.SPACE AND a.NAME LIKE 'ts1';
+------------+------------+
| space_name | table_name |
+------------+------------+
| ts1        | test/t1    |
| ts1        | test/t2    |
| ts1        | test/t3    |
+------------+------------+
```

Se uma operação `DROP TABLESPACE` em um tablespace geral *vazio* retornar um erro, o tablespace pode conter uma tabela temporária ou intermediária órfã que foi deixada por uma operação `ALTER TABLE` interrompida por uma saída do servidor. Para mais informações, consulte a Seção 14.22.3, “Troubleshooting InnoDB Data Dictionary Operations”.

Um tablespace geral `InnoDB` não é excluído automaticamente quando a última tabela no tablespace é eliminada. O tablespace deve ser eliminado explicitamente usando `DROP TABLESPACE tablespace_name`.

Um tablespace geral não pertence a nenhum Database específico. Uma operação `DROP DATABASE` pode eliminar tabelas que pertencem a um tablespace geral, mas não pode eliminar o tablespace, mesmo que a operação `DROP DATABASE` elimine todas as tabelas que pertencem a ele.

Semelhante ao system tablespace, truncar ou eliminar tabelas armazenadas em um tablespace geral cria espaço livre internamente no arquivo de dados .ibd do tablespace geral, o qual pode ser usado apenas para novos dados `InnoDB`. O espaço não é liberado de volta ao sistema operacional, como ocorre quando um tablespace *file-per-table* é excluído durante uma operação `DROP TABLE`.

Este exemplo demonstra como eliminar um tablespace geral `InnoDB`. O tablespace geral `ts1` é criado com uma única tabela. A tabela deve ser eliminada antes de eliminar o tablespace.

```sql
mysql> CREATE TABLESPACE `ts1` ADD DATAFILE 'ts1.ibd' Engine=InnoDB;

mysql> CREATE TABLE t1 (c1 INT PRIMARY KEY) TABLESPACE ts1 Engine=InnoDB;

mysql> DROP TABLE t1;

mysql> DROP TABLESPACE ts1;
```

Nota

`tablespace_name` é um identificador sensível a maiúsculas e minúsculas no MySQL.

##### Limitações de Tablespace Geral

* Um tablespace gerado ou existente não pode ser alterado para um tablespace geral.

* A criação de tablespaces gerais temporários não é suportada.
* Tablespaces gerais não suportam tabelas temporárias.
* Tabelas armazenadas em um tablespace geral só podem ser abertas em versões do MySQL que suportam tablespaces gerais.

* Semelhante ao system tablespace, truncar ou eliminar tabelas armazenadas em um tablespace geral cria espaço livre internamente no arquivo de dados .ibd do tablespace geral, o qual pode ser usado apenas para novos dados `InnoDB`. O espaço não é liberado de volta ao sistema operacional, como ocorre com os tablespaces *file-per-table*.

  Além disso, uma operação `ALTER TABLE` de cópia de tabela em uma tabela que reside em um tablespace compartilhado (um tablespace geral ou o system tablespace) pode aumentar a quantidade de espaço usado pelo tablespace. Tais operações requerem tanto espaço adicional quanto os dados na tabela mais os *Indexes*. O espaço adicional necessário para a operação `ALTER TABLE` de cópia de tabela não é liberado de volta ao sistema operacional, como ocorre com os tablespaces *file-per-table*.

* `ALTER TABLE ... DISCARD TABLESPACE` e `ALTER TABLE ... IMPORT TABLESPACE` não são suportados para tabelas que pertencem a um tablespace geral.

* O suporte para colocar *partitions* de tabela em tablespaces gerais foi descontinuado no MySQL 5.7.24; espera-se que seja removido em uma futura versão do MySQL.

* A cláusula `ADD DATAFILE` não é suportada em um ambiente de Replication onde a origem (*source*) e a réplica (*replica*) residem no mesmo *host*, pois isso faria com que a origem e a réplica criassem um tablespace com o mesmo nome e no mesmo local.