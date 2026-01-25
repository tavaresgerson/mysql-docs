### 10.3.4 Character Set e Collation da Tabela

Toda tabela possui um character set de tabela e uma collation de tabela. As instruções `CREATE TABLE` e `ALTER TABLE` possuem cláusulas opcionais para especificar o character set e a collation da tabela:

```sql
CREATE TABLE tbl_name (column_list)
    DEFAULT] CHARACTER SET charset_name]
    [COLLATE collation_name

ALTER TABLE tbl_name
    DEFAULT] CHARACTER SET charset_name]
    [COLLATE collation_name]
```

Exemplo:

```sql
CREATE TABLE t1 ( ... )
CHARACTER SET latin1 COLLATE latin1_danish_ci;
```

O MySQL escolhe o character set e a collation da tabela da seguinte maneira:

* Se ambos `CHARACTER SET charset_name` e `COLLATE collation_name` forem especificados, o character set *`charset_name`* e a collation *`collation_name`* são utilizados.

* Se `CHARACTER SET charset_name` for especificado sem `COLLATE`, o character set *`charset_name`* e sua collation padrão são utilizados. Para ver a collation padrão de cada character set, use a instrução `SHOW CHARACTER SET` ou faça uma Query na tabela `CHARACTER_SETS` do `INFORMATION_SCHEMA`.

* Se `COLLATE collation_name` for especificado sem `CHARACTER SET`, o character set associado a *`collation_name`* e a collation *`collation_name`* são utilizados.

* Caso contrário (se nem `CHARACTER SET` nem `COLLATE` for especificado), o character set e a collation do Database são utilizados.

O character set e a collation da tabela são usados como valores padrão para as definições de Column se o character set e a collation da Column não forem especificados em definições de Column individuais. O character set e a collation da tabela são extensões do MySQL; não existem elementos como esses no SQL padrão.