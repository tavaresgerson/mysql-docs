### 11.3.2 Os Tipos CHAR e VARCHAR

Os tipos `CHAR` e `VARCHAR` são semelhantes, mas diferem na forma como são armazenados e recuperados. Eles também diferem no comprimento máximo e em se os espaços em branco (trailing spaces) são retidos.

Os tipos `CHAR` e `VARCHAR` são declarados com um comprimento que indica o número máximo de caracteres que você deseja armazenar. Por exemplo, `CHAR(30)` pode conter até 30 caracteres.

O comprimento de uma coluna `CHAR` é fixo para o comprimento que você declara ao criar a tabela. O comprimento pode ser qualquer valor de 0 a 255. Quando valores `CHAR` são armazenados, eles são preenchidos à direita (right-padded) com espaços até o comprimento especificado. Quando valores `CHAR` são recuperados, os trailing spaces são removidos, a menos que o SQL mode `PAD_CHAR_TO_FULL_LENGTH` esteja habilitado.

Valores em colunas `VARCHAR` são strings de comprimento variável. O comprimento pode ser especificado como um valor de 0 a 65.535. O comprimento máximo efetivo de um `VARCHAR` está sujeito ao tamanho máximo da Row (65.535 bytes, que é compartilhado entre todas as colunas) e ao character set utilizado. Consulte a Seção 8.4.7, “Limits on Table Column Count and Row Size”.

Em contraste com `CHAR`, os valores `VARCHAR` são armazenados como um prefixo de comprimento de 1 byte ou 2 bytes mais os dados. O prefixo de comprimento indica o número de bytes no valor. Uma coluna usa um byte de comprimento se os valores exigirem no máximo 255 bytes, e dois bytes de comprimento se os valores puderem exigir mais de 255 bytes.

Se o strict SQL mode não estiver habilitado e você atribuir um valor a uma coluna `CHAR` ou `VARCHAR` que exceda o comprimento máximo da coluna, o valor é truncado para se ajustar e um warning é gerado. Para o truncamento de caracteres não-espaciais, você pode fazer com que ocorra um error (em vez de um warning) e suprimir a inserção do valor usando o strict SQL mode. Consulte a Seção 5.1.10, “Server SQL Modes”.

Para colunas `VARCHAR`, os trailing spaces que excedem o comprimento da coluna são truncados antes da inserção e um warning é gerado, independentemente do SQL mode em uso. Para colunas `CHAR`, o truncamento de excesso de trailing spaces a partir de valores inseridos é realizado silenciosamente, independentemente do SQL mode.

Valores `VARCHAR` não são preenchidos (padded) quando são armazenados. Os trailing spaces são retidos quando os valores são armazenados e recuperados, em conformidade com o SQL padrão.

A tabela a seguir ilustra as diferenças entre `CHAR` e `VARCHAR`, mostrando o resultado do armazenamento de vários valores de string em colunas `CHAR(4)` e `VARCHAR(4)` (assumindo que a coluna usa um character set de byte único, como `latin1`).

<table summary="Ilustração da diferença entre os requisitos de armazenamento CHAR e VARCHAR, mostrando o armazenamento necessário para vários valores de string nas colunas CHAR(4) e VARCHAR(4)."><col style="width: 15%"/><col style="width: 15%"/><col style="width: 20%"/><col style="width: 15%"/><col style="width: 20%"/><thead><tr> <th>Valor</th> <th><code>CHAR(4)</code></th> <th>Armazenamento Necessário</th> <th><code>VARCHAR(4)</code></th> <th>Armazenamento Necessário</th> </tr></thead><tbody><tr> <th><code>''</code></th> <td><code>'    '</code></td> <td>4 bytes</td> <td><code>''</code></td> <td>1 byte</td> </tr><tr> <th><code>'ab'</code></th> <td><code>'ab  '</code></td> <td>4 bytes</td> <td><code>'ab'</code></td> <td>3 bytes</td> </tr><tr> <th><code>'abcd'</code></th> <td><code>'abcd'</code></td> <td>4 bytes</td> <td><code>'abcd'</code></td> <td>5 bytes</td> </tr><tr> <th><code>'abcdefgh'</code></th> <td><code>'abcd'</code></td> <td>4 bytes</td> <td><code>'abcd'</code></td> <td>5 bytes</td> </tr> </tbody></table>

Os valores mostrados como armazenados na última Row da tabela se aplicam *apenas quando não se usa o strict SQL mode*; se o strict mode estiver habilitado, os valores que excedem o comprimento da coluna *não são armazenados*, e resulta em um error.

O `InnoDB` codifica campos de comprimento fixo maiores ou iguais a 768 bytes como campos de comprimento variável, que podem ser armazenados fora da página (off-page). Por exemplo, uma coluna `CHAR(255)` pode exceder 768 bytes se o comprimento máximo de byte do character set for maior que 3, como acontece com `utf8mb4`.

Se um determinado valor for armazenado nas colunas `CHAR(4)` e `VARCHAR(4)`, os valores recuperados das colunas nem sempre são os mesmos, pois os trailing spaces são removidos das colunas `CHAR` após a recuperação. O exemplo a seguir ilustra esta diferença:

```sql
mysql> CREATE TABLE vc (v VARCHAR(4), c CHAR(4));
Query OK, 0 rows affected (0.01 sec)

mysql> INSERT INTO vc VALUES ('ab  ', 'ab  ');
Query OK, 1 row affected (0.00 sec)

mysql> SELECT CONCAT('(', v, ')'), CONCAT('(', c, ')') FROM vc;
+---------------------+---------------------+
| CONCAT('(', v, ')') | CONCAT('(', c, ')') |
+---------------------+---------------------+
| (ab  )              | (ab)                |
+---------------------+---------------------+
1 row in set (0.06 sec)
```

Os valores nas colunas `CHAR`, `VARCHAR` e `TEXT` são ordenados e comparados de acordo com a collation do character set atribuído à coluna.

Todas as collations do MySQL são do tipo `PAD SPACE`. Isso significa que todos os valores `CHAR`, `VARCHAR` e `TEXT` são comparados sem levar em conta quaisquer trailing spaces. "Comparação" neste contexto não inclui o operador de pattern-matching `LIKE`, para o qual os trailing spaces são significativos. Por exemplo:

```sql
mysql> CREATE TABLE names (myname CHAR(10));
Query OK, 0 rows affected (0.03 sec)

mysql> INSERT INTO names VALUES ('Jones');
Query OK, 1 row affected (0.00 sec)

mysql> SELECT myname = 'Jones', myname = 'Jones  ' FROM names;
+------------------+--------------------+
| myname = 'Jones' | myname = 'Jones  ' |
+------------------+--------------------+
|                1 |                  1 |
+------------------+--------------------+
1 row in set (0.00 sec)

mysql> SELECT myname LIKE 'Jones', myname LIKE 'Jones  ' FROM names;
+---------------------+-----------------------+
| myname LIKE 'Jones' | myname LIKE 'Jones  ' |
+---------------------+-----------------------+
|                   1 |                     0 |
+---------------------+-----------------------+
1 row in set (0.00 sec)
```

Isso não é afetado pelo server SQL mode.

Nota

Para mais informações sobre character sets e collations do MySQL, consulte o Capítulo 10, *Character Sets, Collations, Unicode*. Para informações adicionais sobre requisitos de armazenamento, consulte a Seção 11.7, “Data Type Storage Requirements”.

Nesses casos em que os caracteres de preenchimento (pad characters) finais são removidos ou as comparações os ignoram, se uma coluna tiver um Index que exija valores exclusivos, a inserção de valores na coluna que diferem apenas no número de caracteres de preenchimento finais resulta em um duplicate-key error. Por exemplo, se uma tabela contiver `'a'`, uma tentativa de armazenar `'a '` causará um duplicate-key error.