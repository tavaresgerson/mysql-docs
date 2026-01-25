### 24.4.18 A Tabela INFORMATION_SCHEMA INNODB_SYS_DATAFILES

A tabela [`INNODB_SYS_DATAFILES`](information-schema-innodb-sys-datafiles-table.html "24.4.18 The INFORMATION_SCHEMA INNODB_SYS_DATAFILES Table") fornece informações de path de Data File para tablespaces `InnoDB` file-per-table e gerais, sendo equivalente às informações contidas na tabela `SYS_DATAFILES` no dicionário de dados `InnoDB`.

Para informações de uso e exemplos relacionados, consulte [Seção 14.16.3, “Tabelas de Sistema INFORMATION_SCHEMA do InnoDB”](innodb-information-schema-system-tables.html "14.16.3 InnoDB INFORMATION_SCHEMA System Tables").

Nota

A tabela `INFORMATION_SCHEMA` [`FILES`](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table") relata metadados para todos os tipos de tablespace `InnoDB`, incluindo tablespaces file-per-table, tablespaces gerais, o system tablespace, o temporary tablespace e undo tablespaces, se presentes.

A tabela [`INNODB_SYS_DATAFILES`](information-schema-innodb-sys-datafiles-table.html "24.4.18 The INFORMATION_SCHEMA INNODB_SYS_DATAFILES Table") possui as seguintes colunas:

* `SPACE`

  O ID do tablespace.

* `PATH`

  O path do Data File do tablespace. Se um tablespace [file-per-table](glossary.html#glos_file_per_table "file-per-table") for criado em um local fora do diretório de dados do MySQL, o valor do path é um path de diretório totalmente qualificado. Caso contrário, o path é relativo ao diretório de dados.

#### Exemplo

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_DATAFILES WHERE SPACE = 57\G
*************************** 1. row ***************************
SPACE: 57
 PATH: ./test/t1.ibd
```

#### Notas

* Você deve ter o privilégio [`PROCESS`](privileges-provided.html#priv_process) para realizar uma Query nesta tabela.

* Use a tabela `INFORMATION_SCHEMA` [`COLUMNS`](information-schema-columns-table.html "24.3.5 The INFORMATION_SCHEMA COLUMNS Table") ou a instrução [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement") para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores default.