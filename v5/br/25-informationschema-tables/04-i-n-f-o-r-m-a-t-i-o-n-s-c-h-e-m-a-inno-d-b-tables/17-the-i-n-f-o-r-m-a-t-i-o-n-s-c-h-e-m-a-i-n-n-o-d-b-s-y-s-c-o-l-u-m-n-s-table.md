### 24.4.17 A Tabela INFORMATION_SCHEMA INNODB_SYS_COLUMNS

A tabela [`INNODB_SYS_COLUMNS`](information-schema-innodb-sys-columns-table.html "24.4.17 A Tabela INFORMATION_SCHEMA INNODB_SYS_COLUMNS") fornece metadata sobre as colunas da tabela `InnoDB`, equivalente às informações da tabela `SYS_COLUMNS` no data dictionary do `InnoDB`.

Para informações de uso e exemplos relacionados, consulte a [Seção 14.16.3, “Tabelas do Sistema INFORMATION_SCHEMA do InnoDB”](innodb-information-schema-system-tables.html "14.16.3 Tabelas do Sistema INFORMATION_SCHEMA do InnoDB").

A tabela [`INNODB_SYS_COLUMNS`](information-schema-innodb-sys-columns-table.html "24.4.17 A Tabela INFORMATION_SCHEMA INNODB_SYS_COLUMNS") possui as seguintes colunas:

* `TABLE_ID`

  Um identificador que representa a tabela associada à coluna; o mesmo valor que `INNODB_SYS_TABLES.TABLE_ID`.

* `NAME`

  O nome da coluna. Esses nomes podem estar em maiúsculas ou minúsculas, dependendo da configuração de [`lower_case_table_names`](server-system-variables.html#sysvar_lower_case_table_names). Não há nomes especiais reservados pelo sistema para colunas.

* `POS`

  A posição ordinal da coluna dentro da tabela, começando em 0 e incrementando sequencialmente. Quando uma coluna é descartada (dropped), as colunas restantes são reordenadas para que a sequência não tenha lacunas. O valor de `POS` para uma coluna gerada virtualmente codifica o número de sequência da coluna e a posição ordinal da coluna. Para mais informações, consulte a descrição da coluna `POS` na [Seção 24.4.26, “A Tabela INFORMATION_SCHEMA INNODB_SYS_VIRTUAL”](information-schema-innodb-sys-virtual-table.html "24.4.26 A Tabela INFORMATION_SCHEMA INNODB_SYS_VIRTUAL").

* `MTYPE`

  Significa "tipo principal" (main type). Um identificador numérico para o tipo de coluna. 1 = `VARCHAR`, 2 = `CHAR`, 3 = `FIXBINARY`, 4 = `BINARY`, 5 = `BLOB`, 6 = `INT`, 7 = `SYS_CHILD`, 8 = `SYS`, 9 = `FLOAT`, 10 = `DOUBLE`, 11 = `DECIMAL`, 12 = `VARMYSQL`, 13 = `MYSQL`, 14 = `GEOMETRY`.

* `PRTYPE`

  O "tipo preciso" (`precise type`) do `InnoDB`, um valor binário com bits que representam o tipo de dado MySQL, o código do character set e a nulidade (nullability).

* `LEN`

  O comprimento da coluna (length), por exemplo, 4 para `INT` e 8 para `BIGINT`. Para colunas de caracteres em character sets multibyte, este valor de comprimento é o comprimento máximo em bytes necessário para representar uma definição como `VARCHAR(N)`; ou seja, pode ser `2*N`, `3*N`, e assim por diante, dependendo da codificação de caracteres (character encoding).

#### Exemplo

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_COLUMNS where TABLE_ID = 71\G
*************************** 1. row ***************************
TABLE_ID: 71
    NAME: col1
     POS: 0
   MTYPE: 6
  PRTYPE: 1027
     LEN: 4
*************************** 2. row ***************************
TABLE_ID: 71
    NAME: col2
     POS: 1
   MTYPE: 2
  PRTYPE: 524542
     LEN: 10
*************************** 3. row ***************************
TABLE_ID: 71
    NAME: col3
     POS: 2
   MTYPE: 1
  PRTYPE: 524303
     LEN: 10
```

#### Notas

* Você deve ter o privilégio [`PROCESS`](privileges-provided.html#priv_process) para consultar (query) esta tabela.

* Use a tabela [`COLUMNS`](information-schema-columns-table.html "24.3.5 A Tabela INFORMATION_SCHEMA COLUMNS") do `INFORMATION_SCHEMA` ou o statement [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement") para visualizar informações adicionais sobre as colunas desta tabela, incluindo data types e valores default.