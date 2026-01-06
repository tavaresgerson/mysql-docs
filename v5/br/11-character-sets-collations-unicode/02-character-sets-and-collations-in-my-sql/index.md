## 10.2 Conjuntos de caracteres e collation no MySQL

10.2.1 Repertório de Caracteres

10.2.2 UTF-8 para metadados

O MySQL Server suporta vários conjuntos de caracteres. Para exibir os conjuntos de caracteres disponíveis, use a tabela `INFORMATION_SCHEMA` `CHARACTER_SETS` ou a instrução `SHOW CHARACTER SET`. Uma lista parcial segue. Para obter informações mais completas, consulte a Seção 10.10, “Conjunto de caracteres e coligações suportadas”.

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

Um conjunto de caracteres específico sempre tem pelo menos uma ordenação, e a maioria dos conjuntos de caracteres tem várias. Para listar as ordenações de exibição para um conjunto de caracteres, use a tabela `INFORMATION_SCHEMA` `COLLATIONS` ou a instrução `SHOW COLLATION`.

Por padrão, a instrução `SHOW COLLATION` exibe todas as collation disponíveis. Ela aceita uma cláusula opcional `LIKE` ou `WHERE` que indica quais nomes de collation devem ser exibidos. Por exemplo, para ver as collation para o conjunto de caracteres padrão, `latin1` (cp1252 da Europa Ocidental), use esta instrução:

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

As colorações `latin1` têm os seguintes significados.

<table summary="Conjunto de caracteres latin1, conforme descrito no exemplo anterior, e o significado de cada collation."><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Collation</th> <th>Significado</th> </tr></thead><tbody><tr> <td>[[<code class="literal">latin1_bin</code>]]</td> <td>Binário de acordo com a codificação [[<code class="literal">latin1</code>]]</td> </tr><tr> <td>[[<code class="literal">latin1_danish_ci</code>]]</td> <td>Dinamarquês/Norueguês</td> </tr><tr> <td>[[<code class="literal">latin1_general_ci</code>]]</td> <td>Multilíngue (Europa Ocidental)</td> </tr><tr> <td>[[<code class="literal">latin1_general_cs</code>]]</td> <td>Multilíngue (ISO Europa Ocidental), sensível ao caso</td> </tr><tr> <td>[[<code class="literal">latin1_german1_ci</code>]]</td> <td>alemão DIN-1 (ordem do dicionário)</td> </tr><tr> <td>[[<code class="literal">latin1_german2_ci</code>]]</td> <td>alemão DIN-2 (ordem de catálogo telefônico)</td> </tr><tr> <td>[[<code class="literal">latin1_spanish_ci</code>]]</td> <td>Espanhol moderno</td> </tr><tr> <td>[[<code class="literal">latin1_swedish_ci</code>]]</td> <td>Sueca/Finlandesa</td> </tr></tbody></table>

As refeições têm essas características gerais:

- Duas sequências de caracteres diferentes não podem ter a mesma ordem de classificação.

- Cada conjunto de caracteres tem uma *collation padrão*. Por exemplo, as collation padrão para `latin1` e `utf8` são `latin1_swedish_ci` e `utf8_general_ci`, respectivamente. A tabela `CHARACTER_SETS` do `INFORMATION_SCHEMA` e a instrução `SHOW CHARACTER SET` indicam a collation padrão para cada conjunto de caracteres. A tabela `COLLATIONS` do `INFORMATION_SCHEMA` e a instrução `SHOW COLLATION` têm uma coluna que indica, para cada collation, se ela é a padrão para seu conjunto de caracteres (`Sim` se for, vazia se não for).

- Os nomes das ordenações começam com o nome do conjunto de caracteres com o qual estão associados, geralmente seguidos por um ou mais sufixos que indicam outras características da ordenação. Para obter informações adicionais sobre as convenções de nomeação, consulte a Seção 10.3.1, “Convenções de Nomenclatura de Ordenação”.

Quando um conjunto de caracteres tem várias collation, pode não ser claro qual a collation mais adequada para uma determinada aplicação. Para evitar escolher uma collation inadequada, realize algumas comparações com valores de dados representativos para garantir que uma determinada collation ordene os valores da maneira que você espera.
