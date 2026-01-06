#### 13.7.5.4 Declaração de COLAÇÃO DE MOSTRA

```sql
SHOW COLLATION
    [LIKE 'pattern' | WHERE expr]
```

Esta declaração lista as collation suportadas pelo servidor. Por padrão, o resultado da consulta `SHOW COLLATION` inclui todas as collation disponíveis. A cláusula `LIKE` (funções de comparação de strings # operador\_like), se presente, indica quais nomes de collation devem ser correspondidos. A cláusula `WHERE` pode ser usada para selecionar linhas com condições mais gerais, conforme discutido na Seção 24.8, “Extensões para Declarações SHOW”. Por exemplo:

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

A saída `SHOW COLLATION` tem essas colunas:

- `Colaboração`

  O nome da agregação.

- `Charset`

  O nome do conjunto de caracteres com o qual a ordenação está associada.

- `Id`

  O ID de agregação.

- `Padrão`

  Se a ordenação é a opção padrão para o conjunto de caracteres.

- `Compilado`

  Se o conjunto de caracteres é compilado no servidor.

- `Sortlen`

  Isso está relacionado à quantidade de memória necessária para ordenar cadeias de caracteres expressas no conjunto de caracteres.

Para ver a collation padrão para cada conjunto de caracteres, use a seguinte instrução. `Default` é uma palavra reservada, então para usá-la como um identificador, ela deve ser citada como tal:

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

Informações de colagem também estão disponíveis na tabela `INFORMATION_SCHEMA` `COLLATIONS`. Veja Seção 24.3.3, “A Tabela INFORMATION\_SCHEMA COLLATIONS”.
