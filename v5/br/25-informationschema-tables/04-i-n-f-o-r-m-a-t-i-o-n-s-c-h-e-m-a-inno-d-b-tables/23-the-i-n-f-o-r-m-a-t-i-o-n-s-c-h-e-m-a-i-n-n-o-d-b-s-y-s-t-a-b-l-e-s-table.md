### 24.4.23 A Tabela INNODB_SYS_TABLES do INFORMATION_SCHEMA

A tabela [`INNODB_SYS_TABLES`](information-schema-innodb-sys-tables-table.html "24.4.23 The INFORMATION_SCHEMA INNODB_SYS_TABLES Table") fornece metadata sobre tabelas `InnoDB`, equivalente às informações da tabela `SYS_TABLES` no dicionário de dados do `InnoDB`.

Para informações de uso e exemplos relacionados, consulte [Seção 14.16.3, “Tabelas do Sistema INFORMATION_SCHEMA do InnoDB”](innodb-information-schema-system-tables.html "14.16.3 InnoDB INFORMATION_SCHEMA System Tables").

A tabela [`INNODB_SYS_TABLES`](information-schema-innodb-sys-tables-table.html "24.4.23 The INFORMATION_SCHEMA INNODB_SYS_TABLES Table") possui as seguintes colunas:

* `TABLE_ID`

  Um identificador para a tabela `InnoDB`. Este valor é único em todos os Databases na instância.

* `NAME`

  O nome da tabela, precedido pelo nome do schema (Database) quando apropriado (por exemplo, `test/t1`). Os nomes dos Databases e tabelas de usuário estão no mesmo formato de maiúsculas/minúsculas em que foram originalmente definidos, possivelmente influenciados pela configuração [`lower_case_table_names`](server-system-variables.html#sysvar_lower_case_table_names).

* `FLAG`

  Um valor numérico que representa informações de nível de bit sobre o formato da tabela e as características de armazenamento.

* `N_COLS`

  O número de colunas na tabela. O número reportado inclui três colunas ocultas criadas pelo `InnoDB` (`DB_ROW_ID`, `DB_TRX_ID` e `DB_ROLL_PTR`). O número reportado também inclui [virtual generated columns](glossary.html#glos_virtual_generated_column "virtual generated column"), se estiverem presentes.

* `SPACE`

  Um identificador para o tablespace onde a tabela reside. 0 significa o [system tablespace](glossary.html#glos_system_tablespace "system tablespace") do `InnoDB`. Qualquer outro número representa um tablespace [file-per-table](glossary.html#glos_file_per-table "file-per-table") ou um general tablespace. Este identificador permanece o mesmo após uma instrução [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement"). Para tablespaces file-per-table, este identificador é único para tabelas em todos os Databases na instância.

* `FILE_FORMAT`

  O file format da tabela (`Antelope` ou `Barracuda`).

* `ROW_FORMAT`

  O row format da tabela (`Compact`, `Redundant`, `Dynamic` ou `Compressed`).

* `ZIP_PAGE_SIZE`

  O zip page size. Aplica-se apenas a tabelas com um row format de `Compressed`.

* `SPACE_TYPE`

  O tipo de tablespace ao qual a tabela pertence. Os valores possíveis incluem `System` para o system tablespace, `General` para general tablespaces, e `Single` para file-per-table tablespaces. Tabelas atribuídas ao system tablespace usando [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") ou [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") `TABLESPACE=innodb_system` têm um `SPACE_TYPE` de `General`. Para mais informações, consulte [`CREATE TABLESPACE`](create-tablespace.html "13.1.19 CREATE TABLESPACE Statement").

#### Exemplo

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_TABLES WHERE TABLE_ID = 214\G
*************************** 1. row ***************************
     TABLE_ID: 214
         NAME: test/t1
         FLAG: 129
       N_COLS: 4
        SPACE: 233
  FILE_FORMAT: Antelope
   ROW_FORMAT: Compact
ZIP_PAGE_SIZE: 0
   SPACE_TYPE: General
```

#### Notas

* Você deve ter o privilégio [`PROCESS`](privileges-provided.html#priv_process) para consultar esta tabela.

* Use a tabela [`COLUMNS`](information-schema-columns-table.html "24.3.5 The INFORMATION_SCHEMA COLUMNS Table") do `INFORMATION_SCHEMA` ou a instrução [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement") para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores default.