#### 13.7.5.4 Instrução SHOW COLLATION

```sql
SHOW COLLATION
    [LIKE 'pattern' | WHERE expr]
```

Esta instrução lista as collations suportadas pelo servidor. Por padrão, a saída de [`SHOW COLLATION`](show-collation.html "13.7.5.4 SHOW COLLATION Statement") inclui todas as collations disponíveis. A cláusula [`LIKE`](string-comparison-functions.html#operator_like), se presente, indica quais nomes de collation devem ser correspondidos. A cláusula `WHERE` pode ser fornecida para selecionar linhas usando condições mais gerais, conforme discutido na [Seção 24.8, “Extensões às Instruções SHOW”](extended-show.html "24.8 Extensions to SHOW Statements"). Por exemplo:

```sql
mysql> SHOW COLLATION WHERE Charset = 'latin1';
+-------------------+---------+----+---------+----------+---------+
| Collation         | Charset | Id | Default | Compiled | Sortlen |
+-------------------+---------+----+---------+----------+---------+
| latin1_german1_ci | latin1  |  5 |         | Yes      |       1 |
| latin1_swedish_ci | latin1  |  8 | Yes     | Yes      |       1 |
| latin1_danish_ci  | latin1  | 15 |         | Yes      |       1 |
| latin1_german2_ci | latin1  | 31 |         | Yes      |       2 |
| latin1_bin        | latin1  | 47 |         | Yes      |       1 |
| latin1_general_ci | latin1  | 48 |         | Yes      |       1 |
| latin1_general_cs | latin1  | 49 |         | Yes      |       1 |
| latin1_spanish_ci | latin1  | 94 |         | Yes      |       1 |
+-------------------+---------+----+---------+----------+---------+
```

A saída de [`SHOW COLLATION`](show-collation.html "13.7.5.4 SHOW COLLATION Statement") possui estas colunas:

* `Collation`

  O nome da collation.

* `Charset`

  O nome do character set ao qual a collation está associada.

* `Id`

  O ID da collation.

* `Default`

  Indica se a collation é o padrão (default) para seu character set.

* `Compiled`

  Indica se o character set está compilado no servidor.

* `Sortlen`

  Isto está relacionado à quantidade de memória necessária para ordenar strings expressas no character set.

Para ver a collation padrão para cada character set, use a seguinte instrução. `Default` é uma palavra reservada, portanto, para usá-la como um identificador, ela deve ser citada como tal:

```sql
mysql> SHOW COLLATION WHERE `Default` = 'Yes';
+---------------------+----------+----+---------+----------+---------+
| Collation           | Charset  | Id | Default | Compiled | Sortlen |
+---------------------+----------+----+---------+----------+---------+
| big5_chinese_ci     | big5     |  1 | Yes     | Yes      |       1 |
| dec8_swedish_ci     | dec8     |  3 | Yes     | Yes      |       1 |
| cp850_general_ci    | cp850    |  4 | Yes     | Yes      |       1 |
| hp8_english_ci      | hp8      |  6 | Yes     | Yes      |       1 |
| koi8r_general_ci    | koi8r    |  7 | Yes     | Yes      |       1 |
| latin1_swedish_ci   | latin1   |  8 | Yes     | Yes      |       1 |
...
```

As informações de collation também estão disponíveis na tabela [`COLLATIONS`](information-schema-collations-table.html "24.3.3 The INFORMATION_SCHEMA COLLATIONS Table") do `INFORMATION_SCHEMA`. Consulte a [Seção 24.3.3, “A Tabela COLLATIONS do INFORMATION_SCHEMA”](information-schema-collations-table.html "24.3.3 The INFORMATION_SCHEMA COLLATIONS Table").