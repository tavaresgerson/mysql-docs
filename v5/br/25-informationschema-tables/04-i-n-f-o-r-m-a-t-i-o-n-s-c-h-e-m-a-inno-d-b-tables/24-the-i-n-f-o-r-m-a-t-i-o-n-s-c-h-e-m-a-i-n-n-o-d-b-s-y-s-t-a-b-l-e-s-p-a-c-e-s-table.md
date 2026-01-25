### 24.4.24 A Tabela INFORMATION_SCHEMA INNODB_SYS_TABLESPACES

A tabela [`INNODB_SYS_TABLESPACES`](information-schema-innodb-sys-tablespaces-table.html "24.4.24 The INFORMATION_SCHEMA INNODB_SYS_TABLESPACES Table") fornece metadados sobre `tablespaces` `InnoDB` file-per-table e general tablespaces, equivalente às informações na tabela `SYS_TABLESPACES` no data dictionary do `InnoDB`.

Para informações de uso e exemplos relacionados, consulte [Seção 14.16.3, “Tabelas do Sistema INFORMATION_SCHEMA do InnoDB”](innodb-information-schema-system-tables.html "14.16.3 InnoDB INFORMATION_SCHEMA System Tables").

Nota

A tabela [`FILES`](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table") do `INFORMATION_SCHEMA` reporta metadados para todos os tipos de tablespace do `InnoDB`, incluindo file-per-table tablespaces, general tablespaces, o system tablespace, o temporary tablespace e undo tablespaces, se presentes.

A tabela [`INNODB_SYS_TABLESPACES`](information-schema-innodb-sys-tablespaces-table.html "24.4.24 The INFORMATION_SCHEMA INNODB_SYS_TABLESPACES Table") possui estas colunas:

* `SPACE`

  O ID do tablespace.

* `NAME`

  O schema (database) e o nome da tabela.

* `FLAG`

  Um valor numérico que representa informações de nível de bit sobre o formato do tablespace e as características de armazenamento.

* `FILE_FORMAT`

  O formato de arquivo do tablespace. Por exemplo, [Antelope](glossary.html#glos_antelope "Antelope"), [Barracuda](glossary.html#glos_barracuda "Barracuda"), ou `Any` ([general tablespaces](glossary.html#glos_general_tablespace "general tablespace") suportam qualquer row format). Os dados neste campo são interpretados a partir das informações dos flags do tablespace que residem no [.ibd file](glossary.html#glos_ibd_file ".ibd file"). Para mais informações sobre os formatos de arquivo do `InnoDB`, consulte [Seção 14.10, “Gerenciamento do Formato de Arquivo do InnoDB”](innodb-file-format.html "14.10 InnoDB File-Format Management").

* `ROW_FORMAT`

  O row format do tablespace (`Compact or Redundant`, `Dynamic` ou `Compressed`). Os dados nesta coluna são interpretados a partir das informações dos flags do tablespace que residem no [`.ibd` file](glossary.html#glos_ibd_file ".ibd file").

* `PAGE_SIZE`

  O page size do tablespace. Os dados nesta coluna são interpretados a partir das informações dos flags do tablespace que residem no [`.ibd` file](glossary.html#glos_ibd_file ".ibd file").

* `ZIP_PAGE_SIZE`

  O zip page size do tablespace. Os dados nesta coluna são interpretados a partir das informações dos flags do tablespace que residem no [`.ibd` file](glossary.html#glos_ibd_file ".ibd file").

* `SPACE_TYPE`

  O tipo de tablespace. Valores possíveis incluem `General` para general tablespaces e `Single` para file-per-table tablespaces.

* `FS_BLOCK_SIZE`

  O block size do sistema de arquivos, que é o tamanho da unidade usada para *hole punching*. Esta coluna se refere ao recurso de [transparent page compression](innodb-page-compression.html "14.9.2 InnoDB Page Compression") do `InnoDB`.

* `FILE_SIZE`

  O tamanho aparente do arquivo, que representa o tamanho máximo do arquivo, descompactado. Esta coluna se refere ao recurso de [transparent page compression](innodb-page-compression.html "14.9.2 InnoDB Page Compression") do `InnoDB`.

* `ALLOCATED_SIZE`

  O tamanho real do arquivo, que é a quantidade de espaço alocado no disco. Esta coluna se refere ao recurso de [transparent page compression](innodb-page-compression.html "14.9.2 InnoDB Page Compression") do `InnoDB`.

#### Exemplo

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_TABLESPACES WHERE SPACE = 26\G
*************************** 1. row ***************************
         SPACE: 26
          NAME: test/t1
          FLAG: 0
   FILE_FORMAT: Antelope
    ROW_FORMAT: Compact or Redundant
     PAGE_SIZE: 16384
 ZIP_PAGE_SIZE: 0
    SPACE_TYPE: Single
 FS_BLOCK_SIZE: 4096
     FILE_SIZE: 98304
ALLOCATED_SIZE: 65536
```

#### Notas

* Você deve ter o privilégio [`PROCESS`](privileges-provided.html#priv_process) para realizar Query nesta tabela.

* Use a tabela [`COLUMNS`](information-schema-columns-table.html "24.3.5 The INFORMATION_SCHEMA COLUMNS Table") do `INFORMATION_SCHEMA` ou a instrução [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement") para visualizar informações adicionais sobre as colunas desta tabela, incluindo data types e valores padrão.

* Como os flags do tablespace são sempre zero para todos os formatos de arquivo Antelope (diferente dos flags de tabela), não há como determinar a partir deste inteiro de flag se o row format do tablespace é Redundant ou Compact. Como resultado, os valores possíveis para o campo `ROW_FORMAT` são “Compact or Redundant”, “Compressed” ou “Dynamic.”

* Com a introdução dos general tablespaces, os dados do system tablespace do `InnoDB` (para SPACE 0) são expostos em `INNODB_SYS_TABLESPACES`.