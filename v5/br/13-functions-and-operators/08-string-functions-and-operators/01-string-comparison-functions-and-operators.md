### 12.8.1 Funções e operadores de comparação de strings

**Tabela 12.13 Funções e operadores de comparação de strings**

<table frame="box" rules="all" summary="Uma referência que lista funções e operadores de comparação de strings."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>LIKE</code></td> <td>Encontre padrões simples</td> </tr><tr><td><code>NOT LIKE</code></td> <td>Negação de correspondência de padrão simples</td> </tr><tr><td><code>STRCMP()</code></td> <td>Compare duas strings</td> </tr></tbody></table>

Se uma função de string receber uma string binária como argumento, a string resultante também será uma string binária. Um número convertido em string é tratado como uma string binária. Isso afeta apenas as comparações.

Normalmente, se alguma expressão em uma comparação de strings for sensível ao caso, a comparação será realizada de forma sensível ao caso.

Se uma função de string for invocada dentro do cliente **mysql**, as strings binárias são exibidas usando notação hexadecimal, dependendo do valor da opção `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 4.5.1, “mysql — O Cliente de Linha de Comando MySQL”.

- `expr LIKE pat [ESCAPE 'caractere_de_escape']`

  Contagem de padrões usando um padrão SQL. Retorna `1` (`TRUE`) ou `0` (`FALSE`). Se qualquer um de *`expr`* ou *`pat`* for `NULL`, o resultado será `NULL`.

  O padrão não precisa ser uma string literal. Por exemplo, ele pode ser especificado como uma expressão de string ou coluna de tabela. Neste último caso, a coluna deve ser definida como um dos tipos de dados de string do MySQL (consulte a Seção 11.3, “Tipos de Dados de String”).

  De acordo com o padrão SQL, `LIKE` realiza a comparação caracter a caractere, podendo, portanto, produzir resultados diferentes do operador de comparação `=`:

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

  Em particular, os espaços em branco finais são significativos, o que não é verdade para comparações de strings não binárias (`CHAR`, `VARCHAR` e `TEXT` valores) realizadas com o operador `=`:

  ```sql
  mysql> SELECT 'a' = 'a ', 'a' LIKE 'a ';
  +------------+---------------+
  | 'a' = 'a ' | 'a' LIKE 'a ' |
  +------------+---------------+
  |          1 |             0 |
  +------------+---------------+
  1 row in set (0.00 sec)
  ```

  Com `LIKE`, você pode usar os seguintes dois caracteres de caractere curinga no padrão:

  - `%` corresponde a qualquer número de caracteres, mesmo zero caracteres.

  - `_` corresponde exatamente a um caractere.

  ```sql
  mysql> SELECT 'David!' LIKE 'David_';
          -> 1
  mysql> SELECT 'David!' LIKE '%D%v%';
          -> 1
  ```

  Para testar instâncias literais de um caractere de comodinho, anteceda-o pelo caractere de escape. Se você não especificar o caractere `ESCAPE`, `\` é assumido, a menos que o modo SQL `NO_BACKSLASH_ESCAPES` esteja habilitado. Nesse caso, nenhum caractere de escape é usado.

  - `\%` corresponde a um caractere `%`.

  - `_` corresponde a um caractere `_`.

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

  A sequência de escape deve ter uma única caractere para especificar o caractere de escape ou ser vazia para especificar que nenhum caractere de escape é usado. A expressão deve ser avaliada como uma constante no momento da execução. Se o modo SQL `NO_BACKSLASH_ESCAPES` estiver habilitado, a sequência não pode ser vazia.

  As seguintes declarações ilustram que as comparações de cadeias não são sensíveis ao caso, a menos que um dos operandos seja sensível ao caso (utilize uma ordenação sensível ao caso ou seja uma string binária):

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

  Como uma extensão do SQL padrão, o MySQL permite o uso do operador `LIKE` em expressões numéricas.

  ```sql
  mysql> SELECT 10 LIKE '1%';
          -> 1
  ```

  No caso de expressões que contenham tipos de dados que não sejam compatíveis, o MySQL tenta realizar uma conversão implícita da expressão para uma string. Consulte a Seção 12.3, “Conversão de Tipo na Avaliação da Expressão”.

  Nota

  O MySQL usa a sintaxe de escape C em strings (por exemplo, `\n` para representar o caractere de nova linha). Se você deseja que uma string `LIKE` contenha um `\`, você deve duplicá-lo. (A menos que o modo SQL `NO_BACKSLASH_ESCAPES` esteja habilitado, nesse caso, nenhum caractere de escape é usado.) Por exemplo, para buscar `\n`, especifique-o como `\\n`. Para buscar `\`, especifique-o como `\\\\`; isso ocorre porque os backslashes são removidos uma vez pelo analisador e novamente quando a correspondência do padrão é feita, deixando apenas uma barra invertida para ser correspondida.

  Exceção: No final da string de padrão, o backslash pode ser especificado como `\\`. No final da string, o backslash representa a si mesmo porque não há nada a seguir para escapar. Suponha que uma tabela contenha os seguintes valores:

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

- `expr NOT LIKE pat [ESCAPE 'caractere_de_escape']`

  Isso é o mesmo que `NOT (expr LIKE pat [ESCAPE 'escape_char'])`.

  Nota

  Consultas agregadas que envolvem comparações `NOT LIKE` com colunas que contêm `NULL` podem gerar resultados inesperados. Por exemplo, considere a tabela e os dados a seguir:

  ```sql
  CREATE TABLE foo (bar VARCHAR(10));

  INSERT INTO foo VALUES (NULL), (NULL);
  ```

  A consulta `SELECT COUNT(*) FROM foo WHERE bar LIKE '%baz%';` retorna `0`. Você pode supor que `SELECT COUNT(*) FROM foo WHERE bar NOT LIKE '%baz%';` retornaria `2`. No entanto, isso não é o caso: a segunda consulta retorna `0`. Isso ocorre porque `NULL NOT LIKE expr` sempre retorna `NULL`, independentemente do valor de *`expr`*. O mesmo vale para consultas agregadas que envolvem `NULL` e comparações usando `NOT RLIKE` ou `NOT REGEXP`. Nesses casos, você deve testar explicitamente por `NOT NULL` usando `OR` (e não `AND`), como mostrado aqui:

  ```sql
  SELECT COUNT(*) FROM foo WHERE bar NOT LIKE '%baz%' OR bar IS NULL;
  ```

- `STRCMP(expr1, expr2)`

  `STRCMP()` retorna `0` se as cadeias forem iguais, `-1` se o primeiro argumento for menor que o segundo de acordo com a ordem de classificação atual e `1` caso contrário.

  ```sql
  mysql> SELECT STRCMP('text', 'text2');
          -> -1
  mysql> SELECT STRCMP('text2', 'text');
          -> 1
  mysql> SELECT STRCMP('text', 'text');
          -> 0
  ```

  `STRCMP()` realiza a comparação usando a ordenação dos argumentos.

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

  Se as collation estiverem incompatíveis, um dos argumentos deve ser convertido para ser compatível com o outro. Veja a Seção 10.8.4, “Coercitividade da Collation em Expressões”.

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
