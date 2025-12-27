#### 15.7.7.4 Declaração de Caracteres

```
SHOW {CHARACTER SET | CHARSET}
    [LIKE 'pattern' | WHERE expr]
```

A declaração `SHOW CHARACTER SET` exibe todos os conjuntos de caracteres disponíveis. A cláusula `LIKE`, se presente, indica quais nomes de conjuntos de caracteres devem ser correspondidos. A cláusula `WHERE` pode ser usada para selecionar linhas com condições mais gerais, conforme discutido na Seção 28.8, “Extensões para Declarações SHOW”. Por exemplo:

```
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

A saída da `SHOW CHARACTER SET` tem essas colunas:

* `Charset`

  O nome do conjunto de caracteres.

* `Descrição`

  Uma descrição do conjunto de caracteres.

* `Coligação padrão`

  A coligação padrão para o conjunto de caracteres.

* `Maxlen`

  O número máximo de bytes necessários para armazenar um caractere.

O conjunto de caracteres `filename` é para uso interno apenas; consequentemente, a `SHOW CHARACTER SET` não o exibe.

As informações sobre o conjunto de caracteres também estão disponíveis na tabela `CHARACTER_SETS` do `INFORMATION_SCHEMA`.