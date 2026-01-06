### 10.3.4 Conjunto de caracteres da tabela e classificação

Cada tabela tem um conjunto de caracteres de tabela e uma ordenação de tabela. As instruções `CREATE TABLE` e `ALTER TABLE` têm cláusulas opcionais para especificar o conjunto de caracteres de tabela e a ordenação de tabela:

```sql
CREATE TABLE tbl_name (column_list)
    [[DEFAULT] CHARACTER SET charset_name]
    [COLLATE collation_name]]

ALTER TABLE tbl_name
    [[DEFAULT] CHARACTER SET charset_name]
    [COLLATE collation_name]
```

Exemplo:

```sql
CREATE TABLE t1 ( ... )
CHARACTER SET latin1 COLLATE latin1_danish_ci;
```

O MySQL escolhe o conjunto de caracteres da tabela e a ordenação da seguinte maneira:

- Se ambos `CHARACTER SET charset_name` e `COLLATE collation_name` forem especificados, o conjunto de caracteres *`charset_name`* e a ordenação *`collation_name`* serão usados.

- Se `CHARACTER SET charset_name` for especificado sem `COLLATE`, o conjunto de caracteres `charset_name`\* e sua collation padrão serão usados. Para ver a collation padrão para cada conjunto de caracteres, use a instrução `SHOW CHARACTER SET` ou consulte a tabela `INFORMATION_SCHEMA` `CHARACTER_SETS`.

- Se `COLLATE collation_name` for especificado sem `CHARACTER SET`, o conjunto de caracteres associado a *`collation_name`* e a collation *`collation_name`* serão usados.

- Caso contrário (nem `CHARACTER SET` nem `COLLATE` sejam especificados), o conjunto de caracteres e a collation do banco de dados serão usados.

O conjunto de caracteres de tabela e a ordenação são usados como valores padrão para as definições de coluna se o conjunto de caracteres de coluna e a ordenação não forem especificados nas definições de coluna individuais. O conjunto de caracteres de tabela e a ordenação são extensões do MySQL; não há nada parecido no SQL padrão.
