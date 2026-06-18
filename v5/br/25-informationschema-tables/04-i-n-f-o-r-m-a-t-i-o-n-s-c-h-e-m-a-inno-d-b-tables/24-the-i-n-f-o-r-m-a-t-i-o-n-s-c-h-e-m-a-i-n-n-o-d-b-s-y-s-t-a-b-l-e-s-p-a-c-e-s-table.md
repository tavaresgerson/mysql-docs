### 24.4.24 A Tabela INFORMATION_SCHEMA INNODB_SYS_TABLESPACES

A tabela `INNODB_SYS_TABLESPACES` fornece metadados sobre `tablespaces` `InnoDB` file-per-table e general tablespaces, equivalente às informações na tabela `SYS_TABLESPACES` no data dictionary do `InnoDB`.

Para informações de uso e exemplos relacionados, consulte Seção 14.16.3, “Tabelas do Sistema INFORMATION_SCHEMA do InnoDB”.

Nota

A tabela `FILES` do `INFORMATION_SCHEMA` reporta metadados para todos os tipos de tablespace do `InnoDB`, incluindo file-per-table tablespaces, general tablespaces, o system tablespace, o temporary tablespace e undo tablespaces, se presentes.

A tabela `INNODB_SYS_TABLESPACES` possui estas colunas:

* `SPACE`

  O ID do tablespace.

* `NAME`

  O schema (database) e o nome da tabela.

* `FLAG`

  Um valor numérico que representa informações de nível de bit sobre o formato do tablespace e as características de armazenamento.

* `FILE_FORMAT`

  O formato de arquivo do tablespace. Por exemplo, Antelope, Barracuda, ou `Any` (general tablespaces suportam qualquer row format). Os dados neste campo são interpretados a partir das informações dos flags do tablespace que residem no .ibd file. Para mais informações sobre os formatos de arquivo do `InnoDB`, consulte Seção 14.10, “Gerenciamento do Formato de Arquivo do InnoDB”.

* `ROW_FORMAT`

  O row format do tablespace (`Compact or Redundant`, `Dynamic` ou `Compressed`). Os dados nesta coluna são interpretados a partir das informações dos flags do tablespace que residem no `.ibd` file.

* `PAGE_SIZE`

  O page size do tablespace. Os dados nesta coluna são interpretados a partir das informações dos flags do tablespace que residem no `.ibd` file.

* `ZIP_PAGE_SIZE`

  O zip page size do tablespace. Os dados nesta coluna são interpretados a partir das informações dos flags do tablespace que residem no `.ibd` file.

* `SPACE_TYPE`

  O tipo de tablespace. Valores possíveis incluem `General` para general tablespaces e `Single` para file-per-table tablespaces.

* `FS_BLOCK_SIZE`

  O block size do sistema de arquivos, que é o tamanho da unidade usada para *hole punching*. Esta coluna se refere ao recurso de transparent page compression do `InnoDB`.

* `FILE_SIZE`

  O tamanho aparente do arquivo, que representa o tamanho máximo do arquivo, descompactado. Esta coluna se refere ao recurso de transparent page compression do `InnoDB`.

* `ALLOCATED_SIZE`

  O tamanho real do arquivo, que é a quantidade de espaço alocado no disco. Esta coluna se refere ao recurso de transparent page compression do `InnoDB`.

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

* Você deve ter o privilégio `PROCESS` para realizar Query nesta tabela.

* Use a tabela `COLUMNS` do `INFORMATION_SCHEMA` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo data types e valores padrão.

* Como os flags do tablespace são sempre zero para todos os formatos de arquivo Antelope (diferente dos flags de tabela), não há como determinar a partir deste inteiro de flag se o row format do tablespace é Redundant ou Compact. Como resultado, os valores possíveis para o campo `ROW_FORMAT` são “Compact or Redundant”, “Compressed” ou “Dynamic.”

* Com a introdução dos general tablespaces, os dados do system tablespace do `InnoDB` (para SPACE 0) são expostos em `INNODB_SYS_TABLESPACES`.