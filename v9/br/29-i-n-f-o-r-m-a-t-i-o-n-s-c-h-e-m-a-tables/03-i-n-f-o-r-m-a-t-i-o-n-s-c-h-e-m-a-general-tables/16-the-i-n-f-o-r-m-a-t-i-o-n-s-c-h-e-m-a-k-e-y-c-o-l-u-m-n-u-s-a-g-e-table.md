### 28.3.16 A Tabela `INFORMATION_SCHEMA.KEY_COLUMN_USAGE`

A tabela `KEY_COLUMN_USAGE` descreve quais colunas de chave têm restrições. Esta tabela não fornece informações sobre as partes funcionais da chave, pois elas são expressões e a tabela fornece informações apenas sobre as colunas.

A tabela `KEY_COLUMN_USAGE` tem as seguintes colunas:

* `CONSTRAINT_CATALOG`

  O nome do catálogo ao qual a restrição pertence. Este valor é sempre `def`.

* `CONSTRAINT_SCHEMA`

  O nome do esquema (banco de dados) ao qual a restrição pertence.

* `CONSTRAINT_NAME`

  O nome da restrição.

* `TABLE_CATALOG`

  O nome do catálogo ao qual a tabela pertence. Este valor é sempre `def`.

* `TABLE_SCHEMA`

  O nome do esquema (banco de dados) ao qual a tabela pertence.

* `TABLE_NAME`

  O nome da tabela que possui a restrição.

* `COLUMN_NAME`

  O nome da coluna que possui a restrição.

  Se a restrição for uma chave estrangeira, então esta é a coluna da chave estrangeira, não a coluna que a chave estrangeira referencia.

* `ORDINAL_POSITION`

  A posição da coluna dentro da restrição, não a posição da coluna dentro da tabela. As posições das colunas são numeradas a partir de 1.

* `POSITION_IN_UNIQUE_CONSTRAINT`

  `NULL` para restrições únicas e de chave primária. Para restrições de chave estrangeira, esta coluna é a posição ordinal na chave da tabela que está sendo referenciada.

* `REFERENCED_TABLE_SCHEMA`

  O nome do esquema referenciado pela restrição.

* `REFERENCED_TABLE_NAME`

  O nome da tabela referenciada pela restrição.

* `REFERENCED_COLUMN_NAME`

  O nome da coluna referenciada pela restrição.

Suponha que existam duas tabelas chamadas `t1` e `t3` que têm as seguintes definições:

```
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

Para essas duas tabelas, a tabela `KEY_COLUMN_USAGE` tem duas linhas:

* Uma linha com `CONSTRAINT_NAME` = `'PRIMARY'`, `TABLE_NAME` = `'t1'`, `COLUMN_NAME` = `'s3'`, `ORDINAL_POSITION` = `1`, `POSITION_IN_UNIQUE_CONSTRAINT` = `NULL`.

  Para `NDB`: Esse valor é sempre `NULL`.

* Uma linha com `CONSTRAINT_NAME` = `'CO'`, `TABLE_NAME` = `'t3'`, `COLUMN_NAME` = `'s2'`, `ORDINAL_POSITION` = `1`, `POSITION_IN_UNIQUE_CONSTRAINT` = `1`.