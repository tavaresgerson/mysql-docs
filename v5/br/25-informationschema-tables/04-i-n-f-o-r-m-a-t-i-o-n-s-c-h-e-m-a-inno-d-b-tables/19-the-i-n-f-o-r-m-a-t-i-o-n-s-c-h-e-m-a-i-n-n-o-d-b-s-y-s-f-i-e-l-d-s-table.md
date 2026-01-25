### 24.4.19 A Tabela INFORMATION_SCHEMA INNODB_SYS_FIELDS

A tabela [`INNODB_SYS_FIELDS`](information-schema-innodb-sys-fields-table.html "24.4.19 The INFORMATION_SCHEMA INNODB_SYS_FIELDS Table") fornece metadata sobre as colunas chave (fields) de Indexes do `InnoDB`, equivalente à informação da tabela `SYS_FIELDS` no dicionário de dados do `InnoDB`.

Para informações de uso e exemplos relacionados, consulte a [Seção 14.16.3, “Tabelas de Sistema INFORMATION_SCHEMA do InnoDB”](innodb-information-schema-system-tables.html "14.16.3 InnoDB INFORMATION_SCHEMA System Tables").

A tabela [`INNODB_SYS_FIELDS`](information-schema-innodb-sys-fields-table.html "24.4.19 The INFORMATION_SCHEMA INNODB_SYS_FIELDS Table") possui estas colunas:

* `INDEX_ID`

  Um identificador para o Index associado a este key field; o mesmo valor que `INNODB_SYS_INDEXES.INDEX_ID`.

* `NAME`

  O nome da coluna original da tabela; o mesmo valor que `INNODB_SYS_COLUMNS.NAME`.

* `POS`

  A posição ordinal do key field dentro do Index, começando em 0 e incrementando sequencialmente. Quando uma coluna é removida, as colunas restantes são reordenadas para que a sequência não tenha lacunas.

#### Exemplo

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_FIELDS WHERE INDEX_ID = 117\G
*************************** 1. row ***************************
INDEX_ID: 117
    NAME: col1
     POS: 0
```

#### Notas

* Você deve ter o privilégio [`PROCESS`](privileges-provided.html#priv_process) para fazer uma Query nesta tabela.

* Use a tabela INFORMATION_SCHEMA [`COLUMNS`](information-schema-columns-table.html "24.3.5 The INFORMATION_SCHEMA COLUMNS Table") ou o comando [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement") para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores default.