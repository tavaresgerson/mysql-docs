### 24.4.17 A tabela INFORMATION_SCHEMA INNODB_SYS_COLUMNS

A tabela `[INNODB_SYS_COLUMNS]` (information-schema-innodb-sys-columns-table.html) fornece metadados sobre as colunas das tabelas `InnoDB`, equivalentes às informações da tabela `SYS_COLUMNS` no dicionário de dados `InnoDB`.

Para informações de uso relacionadas e exemplos, consulte Seção 14.16.3, “Tabelas do Sistema InnoDB INFORMATION_SCHEMA”.

A tabela [`INNODB_SYS_COLUMNS`](https://pt.wikipedia.org/wiki/Tabela_information-schema-innodb-sys-columns) possui as seguintes colunas:

- `TABLE_ID`

  Um identificador que representa a tabela associada à coluna; o mesmo valor que `INNODB_SYS_TABLES.TABLE_ID`.

- `NOME`

  O nome da coluna. Esses nomes podem ser maiúsculos ou minúsculos, dependendo da configuração de `lower_case_table_names`. Não há nomes especiais reservados pelo sistema para colunas.

- `POS`

  A posição ordinal da coluna na tabela, começando de 0 e incrementando sequencialmente. Quando uma coluna é removida, as colunas restantes são reordenadas para que a sequência não tenha lacunas. O valor `POS` para uma coluna gerada virtualmente codifica o número de sequência da coluna e a posição ordinal da coluna. Para mais informações, consulte a descrição da coluna `POS` em Seção 24.4.26, “A Tabela INFORMATION_SCHEMA INNODB_SYS_VIRTUAL”.

- `MTYPE`

  Representa “tipo principal”. Um identificador numérico para o tipo de coluna. 1 = `VARCHAR`, 2 = `CHAR`, 3 = `FIXBINARY`, 4 = `BINARY`, 5 = `BLOB`, 6 = `INT`, 7 = `SYS_CHILD`, 8 = `SYS`, 9 = `FLOAT`, 10 = `DOUBLE`, 11 = `DECIMAL`, 12 = `VARMYSQL`, 13 = `MYSQL`, 14 = `GEOMETRY`.

- `PRTYPE`

  O tipo "preciso" do `InnoDB`, um valor binário com bits que representam o tipo de dados MySQL, o código do conjunto de caracteres e a nulidade.

- `LEN`

  O comprimento da coluna, por exemplo, 4 para `INT` e 8 para `BIGINT`. Para colunas de caracteres em conjuntos de caracteres multibyte, esse valor de comprimento é o comprimento máximo em bytes necessário para representar uma definição como `VARCHAR(N)`; ou seja, pode ser `2*N`, `3*N`, e assim por diante, dependendo da codificação de caracteres.

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

- Você deve ter o privilégio `PROCESSO` para consultar esta tabela.

- Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.
