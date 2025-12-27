### 12.3.4 Conjunto de Caracteres da Tabela e Colagem

Cada tabela tem um conjunto de caracteres da tabela e uma colagem da tabela. As instruções `CREATE TABLE` e `ALTER TABLE` têm cláusulas opcionais para especificar o conjunto de caracteres da tabela e a colagem:

```
CREATE TABLE tbl_name (column_list)
    [[DEFAULT] CHARACTER SET charset_name]
    [COLLATE collation_name]]

ALTER TABLE tbl_name
    [[DEFAULT] CHARACTER SET charset_name]
    [COLLATE collation_name]
```

Exemplo:

```
CREATE TABLE t1 ( ... )
CHARACTER SET latin1 COLLATE latin1_danish_ci;
```

O MySQL escolhe o conjunto de caracteres da tabela e a colagem da tabela da seguinte maneira:

* Se tanto `CHARACTER SET charset_name` quanto `COLLATE collation_name` forem especificados, o conjunto de caracteres *`charset_name`* e a colagem *`collation_name`* serão usados.

* Se `CHARACTER SET charset_name` for especificado sem `COLLATE`, o conjunto de caracteres *`charset_name`* e sua colagem padrão serão usados. Para ver a colagem padrão para cada conjunto de caracteres, use a instrução `SHOW CHARACTER SET` ou consulte a tabela `INFORMATION_SCHEMA` `CHARACTER_SETS`.

* Se `COLLATE collation_name` for especificado sem `CHARACTER SET`, o conjunto de caracteres associado a *`collation_name`* e a colagem *`collation_name`* serão usados.

* Caso contrário (nem `CHARACTER SET` nem `COLLATE` sejam especificados), o conjunto de caracteres da base de dados e a colagem serão usados.

O conjunto de caracteres da tabela e a colagem serão usados como valores padrão para as definições de coluna se a coluna não especificar o conjunto de caracteres da coluna e a colagem. O conjunto de caracteres da tabela e a colagem são extensões do MySQL; não há tais coisas no SQL padrão.