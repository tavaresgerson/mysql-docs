#### 15.7.7.5 Declaração SHOW COLLATION

```
SHOW COLLATION
    [LIKE 'pattern' | WHERE expr]
```

Esta declaração lista as collationes suportadas pelo servidor. Por padrão, a saída de `SHOW COLLATION` inclui todas as collationes disponíveis. A cláusula `LIKE`, se presente, indica quais nomes de collationes devem ser correspondidos. A cláusula `WHERE` pode ser usada para selecionar linhas com condições mais gerais, conforme discutido na Seção 28.8, “Extensões para Declarações SHOW”. Por exemplo:

```
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

A saída de `SHOW COLLATION` tem estas colunas:

* `Collation`

  O nome da collation.

* `Charset`

  O nome do conjunto de caracteres com o qual a collation está associada.

* `Id`

  O ID da collation.

* `Default`

  Se a collation é a default para seu conjunto de caracteres.

* `Compiled`

  Se o conjunto de caracteres está compilado no servidor.

* `Sortlen`

  Isso está relacionado à quantidade de memória necessária para ordenar strings expressas no conjunto de caracteres.

* `Pad_attribute`

  O atributo de padronização da collation, um dos `NO PAD` ou `PAD SPACE`. Este atributo afeta se espaços finais são significativos em comparações de strings; para mais informações, consulte Tratamento de Espaços Finais em Comparações.

Para ver a collation default para cada conjunto de caracteres, use a seguinte declaração. `Default` é uma palavra reservada, então para usá-la como identificador, ela deve ser citada como tal:

```
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

As informações sobre collation também estão disponíveis na tabela `INFORMATION_SCHEMA.COLLATIONS`. Veja a Seção 28.3.6, “A Tabela INFORMATION_SCHEMA COLLATIONS”.