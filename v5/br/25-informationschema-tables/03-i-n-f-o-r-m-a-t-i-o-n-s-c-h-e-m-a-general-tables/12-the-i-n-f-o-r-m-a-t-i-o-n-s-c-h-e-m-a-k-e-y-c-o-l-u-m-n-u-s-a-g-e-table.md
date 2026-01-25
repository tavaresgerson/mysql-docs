### 24.3.12 A Tabela INFORMATION_SCHEMA KEY_COLUMN_USAGE

A tabela [`KEY_COLUMN_USAGE`](information-schema-key-column-usage-table.html "24.3.12 The INFORMATION_SCHEMA KEY_COLUMN_USAGE Table") descreve quais colunas de chave possuem constraints.

A tabela [`KEY_COLUMN_USAGE`](information-schema-key-column-usage-table.html "24.3.12 The INFORMATION_SCHEMA KEY_COLUMN_USAGE Table") possui as seguintes Columns:

* `CONSTRAINT_CATALOG`

  O nome do Catalog ao qual a constraint pertence. Este valor é sempre `def`.

* `CONSTRAINT_SCHEMA`

  O nome do Schema (Database) ao qual a constraint pertence.

* `CONSTRAINT_NAME`

  O nome da constraint.

* `TABLE_CATALOG`

  O nome do Catalog ao qual a Table pertence. Este valor é sempre `def`.

* `TABLE_SCHEMA`

  O nome do Schema (Database) ao qual a Table pertence.

* `TABLE_NAME`

  O nome da Table que possui a constraint.

* `COLUMN_NAME`

  O nome da Column que possui a constraint.

  Se a constraint for uma Foreign Key, esta é a Column da Foreign Key, e não a Column que a Foreign Key referencia.

* `ORDINAL_POSITION`

  A posição da Column dentro da constraint, e não a posição da Column dentro da Table. As posições das Columns são numeradas a partir de 1.

* `POSITION_IN_UNIQUE_CONSTRAINT`

  `NULL` para constraints unique e Primary Key. Para constraints Foreign Key, esta Column é a posição ordinal na Key da Table que está sendo referenciada.

* `REFERENCED_TABLE_SCHEMA`

  O nome do Schema (Database) referenciado pela constraint.

* `REFERENCED_TABLE_NAME`

  O nome da Table referenciada pela constraint.

* `REFERENCED_COLUMN_NAME`

  O nome da Column referenciada pela constraint.

Suponha que existam duas Tables, `t1` e `t3`, que possuem as seguintes definições:

```sql
CREATE TABLE t1
(
    s1 INT,
    s2 INT,
    s3 INT,
    PRIMARY KEY(s3)
) ENGINE=InnoDB;

CREATE TABLE t3
(
    s1 INT,
    s2 INT,
    s3 INT,
    KEY(s1),
    CONSTRAINT CO FOREIGN KEY (s2) REFERENCES t1(s3)
) ENGINE=InnoDB;
```

Para essas duas Tables, a tabela [`KEY_COLUMN_USAGE`](information-schema-key-column-usage-table.html "24.3.12 The INFORMATION_SCHEMA KEY_COLUMN_USAGE Table") possui duas linhas:

* Uma linha com `CONSTRAINT_NAME` = `'PRIMARY'`, `TABLE_NAME` = `'t1'`, `COLUMN_NAME` = `'s3'`, `ORDINAL_POSITION` = `1`, `POSITION_IN_UNIQUE_CONSTRAINT` = `NULL`.

* Uma linha com `CONSTRAINT_NAME` = `'CO'`, `TABLE_NAME` = `'t3'`, `COLUMN_NAME` = `'s2'`, `ORDINAL_POSITION` = `1`, `POSITION_IN_UNIQUE_CONSTRAINT` = `1`.