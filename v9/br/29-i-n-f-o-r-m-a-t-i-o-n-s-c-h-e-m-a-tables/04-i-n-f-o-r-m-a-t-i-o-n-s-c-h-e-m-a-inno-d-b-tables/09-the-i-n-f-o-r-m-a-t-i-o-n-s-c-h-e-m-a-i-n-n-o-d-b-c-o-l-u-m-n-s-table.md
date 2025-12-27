### 28.4.9 A Tabela INFORMATION_SCHEMA INNODB_COLUMNS

A tabela `INNODB_COLUMNS` fornece metadados sobre as colunas das tabelas `InnoDB`.

Para informações de uso relacionadas e exemplos, consulte a Seção 17.15.3, “Objetos de Schema INFORMATION_SCHEMA da Tabela INNODB”.

A tabela `INNODB_COLUMNS` tem as seguintes colunas:

* `TABLE_ID`

  Um identificador que representa a tabela associada à coluna; o mesmo valor que `INNODB_TABLES.TABLE_ID`.

* `NAME`

  O nome da coluna. Esses nomes podem ser maiúsculos ou minúsculos, dependendo da configuração `lower_case_table_names`. Não há nomes especiais reservados pelo sistema para colunas.

* `POS`

  A posição ordinal da coluna na tabela, começando de 0 e incrementando sequencialmente. Quando uma coluna é removida, as colunas restantes são reordenadas para que a sequência não tenha lacunas. O valor `POS` para uma coluna gerada virtualmente codifica o número de sequência da coluna e a posição ordinal da coluna. Para mais informações, consulte a descrição da coluna `POS` na Seção 28.4.29, “A Tabela INNODB_VIRTUAL do Schema INFORMATION_SCHEMA”.

* `MTYPE`

  Significa “tipo principal”. Um identificador numérico para o tipo de coluna. 1 = `VARCHAR`, 2 = `CHAR`, 3 = `FIXBINARY`, 4 = `BINARY`, 5 = `BLOB`, 6 = `INT`, 7 = `SYS_CHILD`, 8 = `SYS`, 9 = `FLOAT`, 10 = `DOUBLE`, 11 = `DECIMAL`, 12 = `VARMYSQL`, 13 = `MYSQL`, 14 = `GEOMETRY`.

* `PRTYPE`

  O “tipo preciso” do `InnoDB`, um valor binário com bits representando o tipo de dados MySQL, código do conjunto de caracteres e não-nulidade.

* `LEN`

  O comprimento da coluna, por exemplo, 4 para `INT` e 8 para `BIGINT`. Para colunas de caracteres em conjuntos de caracteres multibyte, esse valor de comprimento é o comprimento máximo em bytes necessário para representar uma definição como `VARCHAR(N)`; ou seja, pode ser `2*N`, `3*N` e assim por diante, dependendo da codificação de caracteres.

* `HAS_DEFAULT`

  Um valor booleano que indica se uma coluna que foi adicionada instantaneamente usando `ALTER TABLE ... ADD COLUMN` com `ALGORITHM=INSTANT` tem um valor padrão. Todas as colunas adicionadas instantaneamente têm um valor padrão, o que torna essa coluna um indicador de se a coluna foi adicionada instantaneamente.

* `DEFAULT_VALUE`

  O valor padrão inicial de uma coluna que foi adicionada instantaneamente usando `ALTER TABLE ... ADD COLUMN` com `ALGORITHM=INSTANT`. Se o valor padrão for `NULL` ou não for especificado, essa coluna reporta `NULL`. Um valor padrão não `NULL` especificado explicitamente é exibido em um formato binário interno. Modificações subsequentes do valor padrão da coluna não alteram o valor reportado por essa coluna.

#### Exemplo

```
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_COLUMNS where TABLE_ID = 71\G
*************************** 1. row ***************************
     TABLE_ID: 71
         NAME: col1
          POS: 0
        MTYPE: 6
       PRTYPE: 1027
          LEN: 4
  HAS_DEFAULT: 0
DEFAULT_VALUE: NULL
*************************** 2. row ***************************
     TABLE_ID: 71
         NAME: col2
          POS: 1
        MTYPE: 2
       PRTYPE: 524542
          LEN: 10
  HAS_DEFAULT: 0
DEFAULT_VALUE: NULL
*************************** 3. row ***************************
     TABLE_ID: 71
         NAME: col3
          POS: 2
        MTYPE: 1
       PRTYPE: 524303
          LEN: 10
  HAS_DEFAULT: 0
DEFAULT_VALUE: NULL
```

#### Notas

* Você deve ter o privilégio `PROCESS` para consultar essa tabela.

* Use a tabela `COLUMNS` do `INFORMATION_SCHEMA` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas dessa tabela, incluindo tipos de dados e valores padrão.