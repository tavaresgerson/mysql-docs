## 10.2 Character Sets e Collations no MySQL

10.2.1 Repertório de Character Sets

10.2.2 UTF-8 para Metadata

O MySQL Server suporta múltiplos *character sets*. Para exibir os *character sets* disponíveis, use a tabela `CHARACTER_SETS` do `INFORMATION_SCHEMA` ou o comando `SHOW CHARACTER SET`. Segue-se uma lista parcial. Para informações mais completas, consulte a Seção 10.10, “Character Sets e Collations Suportados”.

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

Por padrão, o comando `SHOW CHARACTER SET` exibe todos os *character sets* disponíveis. Ele aceita uma cláusula opcional `LIKE` ou `WHERE` que indica quais nomes de *character set* devem ser correspondidos. Por exemplo:

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

Um determinado *character set* sempre tem pelo menos um *collation*, e a maioria dos *character sets* tem vários. Para listar os *collations* de exibição para um *character set*, use a tabela `COLLATIONS` do `INFORMATION_SCHEMA` ou o comando `SHOW COLLATION`.

Por padrão, o comando `SHOW COLLATION` exibe todos os *collations* disponíveis. Ele aceita uma cláusula opcional `LIKE` ou `WHERE` que indica quais nomes de *collation* devem ser exibidos. Por exemplo, para ver os *collations* para o *character set* padrão, `latin1` (cp1252 Europa Ocidental), use este comando:

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

Os *collations* `latin1` têm os seguintes significados.

<table summary="Os collations do character set latin1, conforme descritos no exemplo anterior, e o significado de cada collation."><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Collation</th> <th>Significado</th> </tr></thead><tbody><tr> <td><code>latin1_bin</code></td> <td>Binário de acordo com a codificação <code>latin1</code></td> </tr><tr> <td><code>latin1_danish_ci</code></td> <td>Dinamarquês/Norueguês</td> </tr><tr> <td><code>latin1_general_ci</code></td> <td>Multilíngue (Europa Ocidental)</td> </tr><tr> <td><code>latin1_general_cs</code></td> <td>Multilíngue (ISO Europa Ocidental), case-sensitive</td> </tr><tr> <td><code>latin1_german1_ci</code></td> <td>Alemão DIN-1 (ordem de dicionário)</td> </tr><tr> <td><code>latin1_german2_ci</code></td> <td>Alemão DIN-2 (ordem de lista telefônica)</td> </tr><tr> <td><code>latin1_spanish_ci</code></td> <td>Espanhol Moderno</td> </tr><tr> <td><code>latin1_swedish_ci</code></td> <td>Sueco/Finlandês</td> </tr></tbody></table>

Collations têm estas características gerais:

* Dois *character sets* diferentes não podem ter o mesmo *collation*.
* Cada *character set* possui um *default collation*. Por exemplo, os *default collations* para `latin1` e `utf8` são `latin1_swedish_ci` e `utf8_general_ci`, respectivamente. A tabela `CHARACTER_SETS` do `INFORMATION_SCHEMA` e o comando `SHOW CHARACTER SET` indicam o *default collation* para cada *character set*. A tabela `COLLATIONS` do `INFORMATION_SCHEMA` e o comando `SHOW COLLATION` possuem uma coluna que indica se um *collation* é o padrão para seu respectivo *character set* (`Yes` se for, vazio se não for).

* Os nomes dos *collations* começam com o nome do *character set* ao qual estão associados, geralmente seguidos por um ou mais sufixos que indicam outras características do *collation*. Para informações adicionais sobre convenções de nomenclatura, consulte a Seção 10.3.1, “Convenções de Nomenclatura de Collation”.

Quando um *character set* tem múltiplos *collations*, pode não estar claro qual *collation* é o mais adequado para uma determinada aplicação. Para evitar a escolha de um *collation* inadequado, realize algumas comparações com valores de dados representativos para garantir que um determinado *collation* ordene os valores da maneira que você espera.