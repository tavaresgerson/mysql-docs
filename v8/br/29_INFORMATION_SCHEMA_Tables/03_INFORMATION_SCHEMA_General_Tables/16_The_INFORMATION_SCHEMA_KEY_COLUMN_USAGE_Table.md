### 28.3.16 A tabela INFORMATION\_SCHEMA KEY\_COLUMN\_USAGE

A tabela `KEY_COLUMN_USAGE` descreve quais colunas-chave têm restrições. Essa tabela não fornece informações sobre partes de chave funcional, pois são expressões e a tabela fornece informações apenas sobre colunas.

A tabela `KEY_COLUMN_USAGE` tem essas colunas:

- `CONSTRAINT_CATALOG`

  O nome do catálogo ao qual a restrição pertence. Esse valor é sempre `def`.

- `CONSTRAINT_SCHEMA`

  O nome do esquema (banco de dados) ao qual a restrição pertence.

- `CONSTRAINT_NAME`

  O nome da restrição.

- `TABLE_CATALOG`

  O nome do catálogo ao qual a tabela pertence. Esse valor é sempre `def`.

- `TABLE_SCHEMA`

  O nome do esquema (banco de dados) ao qual a tabela pertence.

- `TABLE_NAME`

  O nome da tabela que possui a restrição.

- `COLUMN_NAME`

  O nome da coluna que possui a restrição.

  Se a restrição for uma chave estrangeira, então esta é a coluna da chave estrangeira, e não a coluna que a chave estrangeira referencia.

- `ORDINAL_POSITION`

  A posição da coluna dentro da restrição, e não a posição da coluna dentro da tabela. As posições das colunas são numeradas a partir do número 1.

- `POSITION_IN_UNIQUE_CONSTRAINT`

  `NULL` para restrições de chave primária e únicas. Para restrições de chave estrangeira, essa coluna é a posição ordinal na chave da tabela que está sendo referenciada.

- `REFERENCED_TABLE_SCHEMA`

  O nome do esquema referenciado pela restrição.

- `REFERENCED_TABLE_NAME`

  O nome da tabela referenciada pela restrição.

- `REFERENCED_COLUMN_NAME`

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

- Uma linha com `CONSTRAINT_NAME` = `'PRIMARY'`, `TABLE_NAME` = `'t1'`, `COLUMN_NAME` = `'s3'`, `ORDINAL_POSITION` = `1`, `POSITION_IN_UNIQUE_CONSTRAINT` = `NULL`.

  Para `NDB`: Este valor é sempre `NULL`.

- Uma linha com `CONSTRAINT_NAME` = `'CO'`, `TABLE_NAME` = `'t3'`, `COLUMN_NAME` = `'s2'`, `ORDINAL_POSITION` = `1`, `POSITION_IN_UNIQUE_CONSTRAINT` = `1`.
