### 14.8.1 Funções e operadores de comparação de strings

**Tabela 14.13 Funções e operadores de comparação de strings**

<table summary="Uma referência que lista funções e operadores de comparação de strings."><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td>[[<code>LIKE</code>]]</td> <td>Encontre padrões simples</td> </tr><tr><td>[[<code>NOT LIKE</code>]]</td> <td>Negação de correspondência de padrão simples</td> </tr><tr><td>[[<code>STRCMP()</code>]]</td> <td>Compare duas strings</td> </tr></tbody></table>

Se uma função de string receber uma string binária como argumento, a string resultante também será uma string binária. Um número convertido em string é tratado como uma string binária. Isso afeta apenas as comparações.

Normalmente, se alguma expressão em uma comparação de strings for sensível ao caso, a comparação será realizada de forma sensível ao caso.

Se uma função de string for invocada dentro do cliente **mysql**, as strings binárias são exibidas usando notação hexadecimal, dependendo do valor do `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O Cliente de Linha de Comando MySQL”.

- `expr LIKE pat [ESCAPE 'escape_char']`

  Contagem de padrões usando um padrão SQL. Retorna `1` (`TRUE`) ou `0` (`FALSE`). Se qualquer um de `expr` ou `pat` for `NULL`, o resultado é `NULL`.

  O padrão não precisa ser uma string literal. Por exemplo, ele pode ser especificado como uma expressão de string ou coluna de tabela. Neste último caso, a coluna deve ser definida como um dos tipos de dados de string do MySQL (consulte a Seção 13.3, “Tipos de Dados de String”).

  De acordo com o padrão SQL, `LIKE` realiza a correspondência por caractere, podendo, portanto, produzir resultados diferentes do operador de comparação `=`:

  ```
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

  Em particular, os espaços em branco finais são sempre significativos. Isso difere das comparações realizadas com o operador `=`, para as quais a significância dos espaços em branco finais em strings não binárias (valores `CHAR`, `VARCHAR` e `TEXT`) depende do atributo pad da collation usada para a comparação. Para mais informações, consulte o tratamento de espaços em branco finais em comparações.

  Com `LIKE`, você pode usar os seguintes dois caracteres curinga no padrão:

  - `%` corresponde a qualquer número de caracteres, mesmo zero caracteres.

  - `_` corresponde exatamente a um caractere.

  ```
  mysql> SELECT 'David!' LIKE 'David_';
          -> 1
  mysql> SELECT 'David!' LIKE '%D%v%';
          -> 1
  ```

  Para testar instâncias literais de um caractere de comodinho, anteceda-o pelo caractere de escape. Se você não especificar o caractere `ESCAPE`, o `\` é assumido, a menos que o modo SQL `NO_BACKSLASH_ESCAPES` esteja habilitado. Nesse caso, nenhum caractere de escape é usado.

  - `\%` corresponde a um caractere `%`.

  - `_` corresponde a um caractere `_`.

  ```
  mysql> SELECT 'David!' LIKE 'David_';
          -> 0
  mysql> SELECT 'David_' LIKE 'David_';
          -> 1
  ```

  Para especificar um caractere de escape diferente, use a cláusula `ESCAPE`:

  ```
  mysql> SELECT 'David_' LIKE 'David|_' ESCAPE '|';
          -> 1
  ```

  A sequência de escape deve ter uma única caractere para especificar o caractere de escape ou ser vazia para especificar que nenhum caractere de escape é usado. A expressão deve ser avaliada como uma constante no momento da execução. Se o modo `NO_BACKSLASH_ESCAPES` SQL estiver habilitado, a sequência não pode ser vazia.

  As seguintes declarações ilustram que as comparações de cadeias não são sensíveis ao caso, a menos que um dos operandos seja sensível ao caso (utilize uma ordenação sensível ao caso ou seja uma string binária):

  ```
  mysql> SELECT 'abc' LIKE 'ABC';
          -> 1
  mysql> SELECT 'abc' LIKE _utf8mb4 'ABC' COLLATE utf8mb4_0900_as_cs;
          -> 0
  mysql> SELECT 'abc' LIKE _utf8mb4 'ABC' COLLATE utf8mb4_bin;
          -> 0
  mysql> SELECT 'abc' LIKE BINARY 'ABC';
          -> 0
  ```

  Como uma extensão do SQL padrão, o MySQL permite `LIKE` em expressões numéricas.

  ```
  mysql> SELECT 10 LIKE '1%';
          -> 1
  ```

  No caso de expressões que contenham tipos de dados que não sejam compatíveis, o MySQL tenta realizar uma conversão implícita da expressão para uma string. Consulte a Seção 14.3, “Conversão de Tipo na Avaliação da Expressão”.

  Nota

  O MySQL usa a sintaxe de escape C em strings (por exemplo, `\n` para representar o caractere de nova linha). Se você quiser que uma string `LIKE` contenha um literal `\`, você deve duplicá-la. (A menos que o modo SQL `NO_BACKSLASH_ESCAPES` esteja habilitado, nesse caso, nenhum caractere de escape é usado.) Por exemplo, para procurar `\n`, especifique-o como `\\n`. Para procurar `\`, especifique-o como `\\\\`; isso ocorre porque os backslashes são removidos uma vez pelo analisador e novamente quando a correspondência do padrão é feita, deixando apenas um backslash para ser correspondido.

  Exceção: No final da string de padrão, o backslash pode ser especificado como `\\`. No final da string, o backslash representa ele mesmo porque não há nada para escapar. Suponha que uma tabela contenha os seguintes valores:

  ```
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

  ```
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

- `expr NOT LIKE pat [ESCAPE 'escape_char']`

  Isto é o mesmo que `NOT (expr LIKE pat [ESCAPE 'escape_char'])`.

  Nota

  Consultas agregadas que envolvem comparações `NOT LIKE` com colunas que contêm `NULL` podem gerar resultados inesperados. Por exemplo, considere a tabela e os dados a seguir:

  ```
  CREATE TABLE foo (bar VARCHAR(10));

  INSERT INTO foo VALUES (NULL), (NULL);
  ```

  A consulta `SELECT COUNT(*) FROM foo WHERE bar LIKE '%baz%';` retorna `0`. Você pode supor que `SELECT COUNT(*) FROM foo WHERE bar NOT LIKE '%baz%';` retornaria `2`. No entanto, isso não é o caso: a segunda consulta retorna `0`. Isso ocorre porque `NULL NOT LIKE expr` sempre retorna `NULL`, independentemente do valor de `expr`. O mesmo vale para consultas agregadas que envolvem `NULL` e comparações usando `NOT RLIKE` ou `NOT REGEXP`. Nesses casos, você deve testar explicitamente para `NOT NULL` usando `OR` (e não `AND`), como mostrado aqui:

  ```
  SELECT COUNT(*) FROM foo WHERE bar NOT LIKE '%baz%' OR bar IS NULL;
  ```

- `STRCMP(expr1,expr2)`

  `STRCMP()` retorna `0` se as strings forem iguais, `-1` se o primeiro argumento for menor que o segundo de acordo com a ordem de classificação atual, e `NULL` se qualquer um dos argumentos for `NULL`. De outra forma, ele retorna `1`.

  ```
  mysql> SELECT STRCMP('text', 'text2');
          -> -1
  mysql> SELECT STRCMP('text2', 'text');
          -> 1
  mysql> SELECT STRCMP('text', 'text');
          -> 0
  ```

  `STRCMP()` realiza a comparação usando a ordenação dos argumentos.

  ```
  mysql> SET @s1 = _utf8mb4 'x' COLLATE utf8mb4_0900_ai_ci;
  mysql> SET @s2 = _utf8mb4 'X' COLLATE utf8mb4_0900_ai_ci;
  mysql> SET @s3 = _utf8mb4 'x' COLLATE utf8mb4_0900_as_cs;
  mysql> SET @s4 = _utf8mb4 'X' COLLATE utf8mb4_0900_as_cs;
  mysql> SELECT STRCMP(@s1, @s2), STRCMP(@s3, @s4);
  +------------------+------------------+
  | STRCMP(@s1, @s2) | STRCMP(@s3, @s4) |
  +------------------+------------------+
  |                0 |               -1 |
  +------------------+------------------+
  ```

  Se as collation estiverem incompatíveis, um dos argumentos deve ser convertido para ser compatível com o outro. Veja a Seção 12.8.4, “Coercitividade da Collation em Expressões”.

  ```
  mysql> SET @s1 = _utf8mb4 'x' COLLATE utf8mb4_0900_ai_ci;
  mysql> SET @s2 = _utf8mb4 'X' COLLATE utf8mb4_0900_ai_ci;
  mysql> SET @s3 = _utf8mb4 'x' COLLATE utf8mb4_0900_as_cs;
  mysql> SET @s4 = _utf8mb4 'X' COLLATE utf8mb4_0900_as_cs;
  -->
  mysql> SELECT STRCMP(@s1, @s3);
  ERROR 1267 (HY000): Illegal mix of collations (utf8mb4_0900_ai_ci,IMPLICIT)
  and (utf8mb4_0900_as_cs,IMPLICIT) for operation 'strcmp'
  mysql> SELECT STRCMP(@s1, @s3 COLLATE utf8mb4_0900_ai_ci);
  +---------------------------------------------+
  | STRCMP(@s1, @s3 COLLATE utf8mb4_0900_ai_ci) |
  +---------------------------------------------+
  |                                           0 |
  +---------------------------------------------+
  ```
