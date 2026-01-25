#### 13.7.5.3 Instrução SHOW CHARACTER SET

```sql
SHOW {CHARACTER SET | CHARSET}
    [LIKE 'pattern' | WHERE expr]
```

A instrução [`SHOW CHARACTER SET`](show-character-set.html "13.7.5.3 SHOW CHARACTER SET Statement") exibe todos os character sets disponíveis. A cláusula [`LIKE`](string-comparison-functions.html#operator_like), se presente, indica quais nomes de character sets devem ser correspondidos. A cláusula `WHERE` pode ser fornecida para selecionar linhas usando condições mais gerais, conforme discutido na [Seção 24.8, “Extensions to SHOW Statements”](extended-show.html "24.8 Extensions to SHOW Statements"). Por exemplo:

```sql
mysql> SHOW CHARACTER SET LIKE 'latin%';
+---------+-----------------------------+-------------------+--------+
| Charset | Description                 | Default collation | Maxlen |
+---------+-----------------------------+-------------------+--------+
| latin1  | cp1252 West European        | latin1_swedish_ci |      1 |
| latin2  | ISO 8859-2 Central European | latin2_general_ci |      1 |
| latin5  | ISO 8859-9 Turkish          | latin5_turkish_ci |      1 |
| latin7  | ISO 8859-13 Baltic          | latin7_general_ci |      1 |
+---------+-----------------------------+-------------------+--------+
```

A saída de [`SHOW CHARACTER SET`](show-character-set.html "13.7.5.3 SHOW CHARACTER SET Statement") possui estas colunas:

* `Charset`

  O nome do character set.

* `Description`

  Uma descrição do character set.

* `Default collation`

  O collation padrão para o character set.

* `Maxlen`

  O número máximo de bytes necessários para armazenar um caractere.

O character set `filename` é apenas para uso interno; consequentemente, [`SHOW CHARACTER SET`](show-character-set.html "13.7.5.3 SHOW CHARACTER SET Statement") não o exibe.

As informações do character set também estão disponíveis na tabela [`CHARACTER_SETS`](information-schema-character-sets-table.html "24.3.2 The INFORMATION_SCHEMA CHARACTER_SETS Table") do `INFORMATION_SCHEMA`.