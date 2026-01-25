### 24.4.21 A Tabela INNODB_SYS_FOREIGN_COLS do INFORMATION_SCHEMA

A tabela [`INNODB_SYS_FOREIGN_COLS`](information-schema-innodb-sys-foreign-cols-table.html "24.4.21 A Tabela INNODB_SYS_FOREIGN_COLS do INFORMATION_SCHEMA") fornece informações de status sobre as colunas de `Foreign Keys` do `InnoDB`, equivalente às informações da tabela `SYS_FOREIGN_COLS` no dicionário de dados do `InnoDB`.

Para informações de uso e exemplos relacionados, consulte [Seção 14.16.3, “Tabelas do Sistema INFORMATION_SCHEMA do InnoDB”](innodb-information-schema-system-tables.html "14.16.3 Tabelas do Sistema INFORMATION_SCHEMA do InnoDB").

A tabela [`INNODB_SYS_FOREIGN_COLS`](information-schema-innodb-sys-foreign-cols-table.html "24.4.21 A Tabela INNODB_SYS_FOREIGN_COLS do INFORMATION_SCHEMA") possui as seguintes colunas:

* `ID`

  O `index` da `Foreign Key` associado a este campo de chave de `index`, usando o mesmo valor de `INNODB_SYS_FOREIGN.ID`.

* `FOR_COL_NAME`

  O nome da coluna associada na tabela filha (`child table`).

* `REF_COL_NAME`

  O nome da coluna associada na tabela pai (`parent table`).

* `POS`

  A posição ordinal deste campo de chave dentro do `index` da `Foreign Key`, começando em 0.

#### Exemplo

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_FOREIGN_COLS WHERE ID = 'test/fk1'\G
*************************** 1. row ***************************
          ID: test/fk1
FOR_COL_NAME: parent_id
REF_COL_NAME: id
         POS: 0
```

#### Notas

* Você deve ter o privilégio [`PROCESS`](privileges-provided.html#priv_process) para realizar `Query` nesta tabela.

* Use a tabela [`COLUMNS`](information-schema-columns-table.html "24.3.5 A Tabela COLUMNS do INFORMATION_SCHEMA") do `INFORMATION_SCHEMA` ou a instrução [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement") para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados (`data types`) e valores padrão.