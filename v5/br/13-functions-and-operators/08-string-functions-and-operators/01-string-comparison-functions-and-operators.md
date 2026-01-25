### 12.8.1 Funções e Operadores de Comparação de String

**Table 12.13 Funções e Operadores de Comparação de String**

<table frame="box" rules="all" summary="Uma referência que lista funções e operadores de comparação de string."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>LIKE</code></td> <td> Correspondência simples de padrão </td> </tr><tr><td><code>NOT LIKE</code></td> <td> Negação de correspondência simples de padrão </td> </tr><tr><td><code>STRCMP()</code></td> <td> Compara duas strings </td> </tr></tbody></table>

Se uma função de string recebe uma string binária como argumento, a string resultante também é uma string binária. Um número convertido para string é tratado como uma string binária. Isso afeta apenas as comparações.

Normalmente, se qualquer expressão em uma comparação de string for *case-sensitive* (sensível a maiúsculas/minúsculas), a comparação é executada de forma *case-sensitive*.

Se uma função de string for invocada a partir do cliente **mysql**, as strings binárias são exibidas usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para mais informações sobre essa opção, consulte Seção 4.5.1, “mysql — O Cliente de Linha de Comando do MySQL”.

* `expr LIKE pat [ESCAPE 'escape_char']`

  Correspondência de padrão usando um padrão SQL. Retorna `1` (`TRUE`) ou `0` (`FALSE`). Se *`expr`* ou *`pat`* for `NULL`, o resultado é `NULL`.

  O padrão não precisa ser uma string literal. Por exemplo, ele pode ser especificado como uma expressão de string ou coluna de tabela. Neste último caso, a coluna deve ser definida como um dos tipos de string do MySQL (consulte Seção 11.3, “String Data Types”).

  Pelo padrão SQL, `LIKE` executa a correspondência caractere por caractere, podendo assim produzir resultados diferentes do operador de comparação `=`:

  ```sql
  mysql> SELECT 'ä' LIKE 'ae' COLLATE latin1_german2_ci;
  +-----------------------------------------+
  | 'ä' LIKE 'ae' COLLATE latin1_german2_ci |
  +-----------------------------------------+
  |                                       0 |
  +-----------------------------------------+
  mysql> SELECT 'ä' = 'ae' COLLATE latin1_german2_ci;
  +--------------------------------------+
  | 'ä' = 'ae' COLLATE latin1_german2_ci |
  +--------------------------------------+
  |                                    1 |
  +--------------------------------------+
  ```

  Em particular, espaços à direita (*trailing spaces*) são significativos, o que não é verdade para comparações de strings não binárias (valores `CHAR`, `VARCHAR` e `TEXT`) realizadas com o operador `=`:

  ```sql
  mysql> SELECT 'a' = 'a ', 'a' LIKE 'a ';
  +------------+---------------+
  | 'a' = 'a ' | 'a' LIKE 'a ' |
  +------------+---------------+
  |          1 |             0 |
  +------------+---------------+
  1 row in set (0.00 sec)
  ```

  Com `LIKE`, você pode usar os dois seguintes caracteres *wildcard* (curinga) no padrão:

  + `%` corresponde a qualquer número de caracteres, até mesmo zero caracteres.

  + `_` corresponde a exatamente um caractere.

  ```sql
  mysql> SELECT 'David!' LIKE 'David_';
          -> 1
  mysql> SELECT 'David!' LIKE '%D%v%';
          -> 1
  ```

  Para testar instâncias literais de um caractere *wildcard*, preceda-o pelo caractere de escape. Se você não especificar o caractere `ESCAPE`, `\` é assumido, a menos que o modo SQL `NO_BACKSLASH_ESCAPES` esteja habilitado. Nesse caso, nenhum caractere de escape é usado.

  + `\%` corresponde a um caractere `%`.

  + `\_` corresponde a um caractere `_`.

  ```sql
  mysql> SELECT 'David!' LIKE 'David_';
          -> 0
  mysql> SELECT 'David_' LIKE 'David_';
          -> 1
  ```

  Para especificar um caractere de escape diferente, use a cláusula `ESCAPE`:

  ```sql
  mysql> SELECT 'David_' LIKE 'David|_' ESCAPE '|';
          -> 1
  ```

  A sequência de escape deve ter um caractere de comprimento para especificar o caractere de escape, ou ser vazia para especificar que nenhum caractere de escape é usado. A expressão deve ser avaliada como uma constante no momento da execução. Se o modo SQL `NO_BACKSLASH_ESCAPES` estiver habilitado, a sequência não pode ser vazia.

  As seguintes instruções ilustram que as comparações de string não são *case-sensitive*, a menos que um dos operandos seja *case-sensitive* (use uma *collation case-sensitive* ou seja uma string binária):

  ```sql
  mysql> SELECT 'abc' LIKE 'ABC';
          -> 1
  mysql> SELECT 'abc' LIKE _latin1 'ABC' COLLATE latin1_general_cs;
          -> 0
  mysql> SELECT 'abc' LIKE _latin1 'ABC' COLLATE latin1_bin;
          -> 0
  mysql> SELECT 'abc' LIKE BINARY 'ABC';
          -> 0
  ```

  Como uma extensão ao SQL padrão, o MySQL permite o uso de `LIKE` em expressões numéricas.

  ```sql
  mysql> SELECT 10 LIKE '1%';
          -> 1
  ```

  Nesses casos, o MySQL tenta realizar a conversão implícita da expressão para uma string. Consulte Seção 12.3, “Type Conversion in Expression Evaluation”.

  Note

  O MySQL usa a sintaxe de escape C em strings (por exemplo, `\n` para representar o caractere de nova linha). Se você quiser que uma string `LIKE` contenha um `\` literal, você deve duplicá-lo. (A menos que o modo SQL `NO_BACKSLASH_ESCAPES` esteja habilitado, caso em que nenhum caractere de escape é usado.) Por exemplo, para buscar por `\n`, especifique-o como `\\n`. Para buscar por `\`, especifique-o como `\\\\`; isso ocorre porque as barras invertidas são removidas uma vez pelo *parser* e novamente quando a correspondência de padrão é feita, restando uma única barra invertida para ser comparada.

  Exceção: No final da string de padrão, a barra invertida pode ser especificada como `\\`. No final da string, a barra invertida representa a si mesma, pois não há nada a seguir para escapar. Suponha que uma tabela contenha os seguintes valores:

  ```sql
  mysql> SELECT filename FROM t1;
  +--------------+
  | filename     |
  +--------------+
  | C:           |
  | C:\          |
  | C:\Programs  |
  | C:\Programs\ |
  +--------------+
  ```

  Para testar valores que terminam com barra invertida, você pode corresponder os valores usando qualquer um dos seguintes padrões:

  ```sql
  mysql> SELECT filename, filename LIKE '%\\' FROM t1;
  +--------------+---------------------+
  | filename     | filename LIKE '%\\' |
  +--------------+---------------------+
  | C:           |                   0 |
  | C:\          |                   1 |
  | C:\Programs  |                   0 |
  | C:\Programs\ |                   1 |
  +--------------+---------------------+

  mysql> SELECT filename, filename LIKE '%\\\\' FROM t1;
  +--------------+-----------------------+
  | filename     | filename LIKE '%\\\\' |
  +--------------+-----------------------+
  | C:           |                     0 |
  | C:\          |                     1 |
  | C:\Programs  |                     0 |
  | C:\Programs\ |                     1 |
  +--------------+-----------------------+
  ```

* `expr NOT LIKE pat [ESCAPE 'escape_char']`

  Isso é o mesmo que `NOT (expr LIKE pat [ESCAPE 'escape_char'])`.

  Note

  *Queries* de agregação envolvendo comparações `NOT LIKE` com colunas contendo `NULL` podem gerar resultados inesperados. Por exemplo, considere a seguinte tabela e dados:

  ```sql
  CREATE TABLE foo (bar VARCHAR(10));

  INSERT INTO foo VALUES (NULL), (NULL);
  ```

  A *Query* `SELECT COUNT(*) FROM foo WHERE bar LIKE '%baz%';` retorna `0`. Você pode assumir que `SELECT COUNT(*) FROM foo WHERE bar NOT LIKE '%baz%';` retornaria `2`. No entanto, este não é o caso: A segunda *query* retorna `0`. Isso ocorre porque `NULL NOT LIKE expr` sempre retorna `NULL`, independentemente do valor de *`expr`*. O mesmo é verdade para *queries* de agregação envolvendo `NULL` e comparações usando `NOT RLIKE` ou `NOT REGEXP`. Nesses casos, você deve testar explicitamente por `NOT NULL` usando `OR` (e não `AND`), como mostrado aqui:

  ```sql
  SELECT COUNT(*) FROM foo WHERE bar NOT LIKE '%baz%' OR bar IS NULL;
  ```

* `STRCMP(expr1,expr2)`

  `STRCMP()` retorna `0` se as strings forem iguais, `-1` se o primeiro argumento for menor que o segundo de acordo com a ordem de classificação atual e `1` caso contrário.

  ```sql
  mysql> SELECT STRCMP('text', 'text2');
          -> -1
  mysql> SELECT STRCMP('text2', 'text');
          -> 1
  mysql> SELECT STRCMP('text', 'text');
          -> 0
  ```

  `STRCMP()` executa a comparação usando a *collation* dos argumentos.

  ```sql
  mysql> SET @s1 = _latin1 'x' COLLATE latin1_general_ci;
  mysql> SET @s2 = _latin1 'X' COLLATE latin1_general_ci;
  mysql> SET @s3 = _latin1 'x' COLLATE latin1_general_cs;
  mysql> SET @s4 = _latin1 'X' COLLATE latin1_general_cs;
  mysql> SELECT STRCMP(@s1, @s2), STRCMP(@s3, @s4);
  +------------------+------------------+
  | STRCMP(@s1, @s2) | STRCMP(@s3, @s4) |
  +------------------+------------------+
  |                0 |                1 |
  +------------------+------------------+
  ```

  Se as *collations* forem incompatíveis, um dos argumentos deve ser convertido para ser compatível com o outro. Consulte Seção 10.8.4, “Collation Coercibility in Expressions”.

  ```sql
  mysql> SELECT STRCMP(@s1, @s3);
  ERROR 1267 (HY000): Illegal mix of collations (latin1_general_ci,IMPLICIT)
  and (latin1_general_cs,IMPLICIT) for operation 'strcmp'
  mysql> SELECT STRCMP(@s1, @s3 COLLATE latin1_general_ci);
  +--------------------------------------------+
  | STRCMP(@s1, @s3 COLLATE latin1_general_ci) |
  +--------------------------------------------+
  |                                          0 |
  +--------------------------------------------+
  ```
