## 10.2 Conjuntos de Caracteres e Collations no MySQL

10.2.1 Repertório de Conjuntos de Caracteres

10.2.2 UTF-8 para Metadados

O MySQL Server suporta múltiplos conjuntos de caracteres. Para exibir os conjuntos de caracteres disponíveis, use a tabela `CHARACTER_SETS` do `INFORMATION_SCHEMA` ou a instrução `SHOW CHARACTER SET`. Uma listagem parcial segue abaixo. Para informações mais completas, consulte a Seção 10.10, “Conjuntos de Caracteres e Collations Suportados”.

```sql
mysql> SHOW CHARACTER SET;
+----------+---------------------------------+---------------------+--------+
| Charset  | Description                     | Default collation   | Maxlen |
+----------+---------------------------------+---------------------+--------+
| big5     | Big5 Traditional Chinese        | big5_chinese_ci     |      2 |
...
| latin1   | cp1252 West European            | latin1_swedish_ci   |      1 |
| latin2   | ISO 8859-2 Central European     | latin2_general_ci   |      1 |
...
| utf8     | UTF-8 Unicode                   | utf8_general_ci     |      3 |
| ucs2     | UCS-2 Unicode                   | ucs2_general_ci     |      2 |
...
| utf8mb4  | UTF-8 Unicode                   | utf8mb4_general_ci  |      4 |
...
| binary   | Binary pseudo charset           | binary              |      1 |
...
```

Por padrão, a instrução `SHOW CHARACTER SET` exibe todos os conjuntos de caracteres disponíveis. Ela aceita uma cláusula opcional `LIKE` ou `WHERE` que indica quais nomes de conjuntos de caracteres devem ser correspondidos. Por exemplo:

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

Um determinado conjunto de caracteres sempre tem pelo menos uma collation, e a maioria dos conjuntos de caracteres tem várias. Para listar as collations de exibição para um conjunto de caracteres, use a tabela `COLLATIONS` do `INFORMATION_SCHEMA` ou a instrução `SHOW COLLATION`.

Por padrão, a instrução `SHOW COLLATION` exibe todas as collations disponíveis. Ela aceita uma cláusula opcional `LIKE` ou `WHERE` que indica quais nomes de collation exibir. Por exemplo, para ver as collations para o conjunto de caracteres padrão, `latin1` (cp1252 West European), use esta instrução:

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

As collations `latin1` têm os seguintes significados.

<table summary="collations do conjunto de caracteres latin1, conforme descrito no exemplo anterior, e o significado de cada collation."><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Collation</th> <th>Significado</th> </tr></thead><tbody><tr> <td><code>latin1_bin</code></td> <td>Binário de acordo com a codificação `latin1`</td> </tr><tr> <td><code>latin1_danish_ci</code></td> <td>Dinamarquês/Norueguês</td> </tr><tr> <td><code>latin1_general_ci</code></td> <td>Multilíngue (Europa Ocidental)</td> </tr><tr> <td><code>latin1_general_cs</code></td> <td>Multilíngue (ISO Europa Ocidental), sensível a maiúsculas e minúsculas</td> </tr><tr> <td><code>latin1_german1_ci</code></td> <td>Alemão DIN-1 (ordem de dicionário)</td> </tr><tr> <td><code>latin1_german2_ci</code></td> <td>Alemão DIN-2 (ordem de lista telefônica)</td> </tr><tr> <td><code>latin1_spanish_ci</code></td> <td>Espanhol Moderno</td> </tr><tr> <td><code>latin1_swedish_ci</code></td> <td>Sueco/Finlandês</td> </tr></tbody></table>

As collations possuem estas características gerais:

* Dois conjuntos de caracteres diferentes não podem ter a mesma collation.
* Cada conjunto de caracteres tem uma *collation padrão*. Por exemplo, as collations padrão para `latin1` e `utf8` são `latin1_swedish_ci` e `utf8_general_ci`, respectivamente. A tabela `CHARACTER_SETS` do `INFORMATION_SCHEMA` e a instrução `SHOW CHARACTER SET` indicam a collation padrão para cada conjunto de caracteres. A tabela `COLLATIONS` do `INFORMATION_SCHEMA` e a instrução `SHOW COLLATION` possuem uma coluna que indica se cada collation é a padrão para seu conjunto de caracteres (`Yes`, se for, vazio, se não for).

* Os nomes das collations começam com o nome do conjunto de caracteres ao qual estão associadas, geralmente seguidos por um ou mais sufixos que indicam outras características da collation. Para informações adicionais sobre convenções de nomenclatura, consulte a Seção 10.3.1, “Convenções de Nomenclatura de Collation”.

Quando um conjunto de caracteres tem múltiplas collations, pode não estar claro qual é a mais adequada para uma determinada aplicação. Para evitar a escolha de uma collation inadequada, realize algumas comparações com valores de dados representativos para garantir que uma determinada collation ordene os valores da maneira esperada.