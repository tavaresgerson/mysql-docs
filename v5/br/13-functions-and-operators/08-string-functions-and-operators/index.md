## 12.8 Funções e operadores de strings

12.8.1 Funções e operadores de comparação de strings

12.8.2 Expressões Regulares

12.8.3 Conjunto de caracteres e comparação dos resultados das funções

**Tabela 12.12 Funções e operadores de strings**

<table frame="box" rules="all" summary="Uma referência que lista funções e operadores de string."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td><a class="link" href="string-functions.html#function_ascii">[[PH_HTML_CODE_<code>FIELD()</code>]</a></td> <td>Retorne o valor numérico do caractere mais à esquerda</td> </tr><tr><td><a class="link" href="string-functions.html#function_bin">[[PH_HTML_CODE_<code>FIELD()</code>]</a></td> <td>Retorne uma string contendo a representação binária de um número</td> </tr><tr><td><a class="link" href="string-functions.html#function_bit-length">[[PH_HTML_CODE_<code>FORMAT()</code>]</a></td> <td>Comprimento de retorno do argumento em bits</td> </tr><tr><td><a class="link" href="string-functions.html#function_char">[[PH_HTML_CODE_<code>FROM_BASE64()</code>]</a></td> <td>Retorne o caractere para cada inteiro passado</td> </tr><tr><td><a class="link" href="string-functions.html#function_char-length">[[PH_HTML_CODE_<code>HEX()</code>]</a></td> <td>Número de caracteres de retorno no argumento</td> </tr><tr><td><a class="link" href="string-functions.html#function_character-length">[[PH_HTML_CODE_<code>INSERT()</code>]</a></td> <td>Sinônimo de CHAR_LENGTH()</td> </tr><tr><td><a class="link" href="string-functions.html#function_concat">[[PH_HTML_CODE_<code>INSTR()</code>]</a></td> <td>Retorne a string concatenada</td> </tr><tr><td><a class="link" href="string-functions.html#function_concat-ws">[[PH_HTML_CODE_<code>LCASE()</code>]</a></td> <td>Concatenar e retornar com separador</td> </tr><tr><td><a class="link" href="string-functions.html#function_elt">[[PH_HTML_CODE_<code>LEFT()</code>]</a></td> <td>Retorne a string no número de índice</td> </tr><tr><td><a class="link" href="string-functions.html#function_export-set">[[PH_HTML_CODE_<code>LENGTH()</code>]</a></td> <td>Retorne uma string onde, para cada bit definido no valor bits, você recebe uma string "on" e, para cada bit não definido, você recebe uma string "off".</td> </tr><tr><td><a class="link" href="string-functions.html#function_field">[[<code>FIELD()</code>]]</a></td> <td>Índice (posição) do primeiro argumento nos argumentos subsequentes</td> </tr><tr><td><a class="link" href="string-functions.html#function_find-in-set">[[<code>BIN()</code><code>FIELD()</code>]</a></td> <td>Índice (posição) do primeiro argumento dentro do segundo argumento</td> </tr><tr><td><a class="link" href="string-functions.html#function_format">[[<code>FORMAT()</code>]]</a></td> <td>Retorne um número formatado para o número especificado de casas decimais</td> </tr><tr><td><a class="link" href="string-functions.html#function_from-base64">[[<code>FROM_BASE64()</code>]]</a></td> <td>Decodificar a string codificada em base64 e retornar o resultado</td> </tr><tr><td><a class="link" href="string-functions.html#function_hex">[[<code>HEX()</code>]]</a></td> <td>Representação hexadecimal de valor decimal ou de cadeia</td> </tr><tr><td><a class="link" href="string-functions.html#function_insert">[[<code>INSERT()</code>]]</a></td> <td>Insira a subcadeia na posição especificada até o número especificado de caracteres</td> </tr><tr><td><a class="link" href="string-functions.html#function_instr">[[<code>INSTR()</code>]]</a></td> <td>Retorne o índice da primeira ocorrência da subcadeia</td> </tr><tr><td><a class="link" href="string-functions.html#function_lcase">[[<code>LCASE()</code>]]</a></td> <td>Sinônimo de LOWER()</td> </tr><tr><td><a class="link" href="string-functions.html#function_left">[[<code>LEFT()</code>]]</a></td> <td>Retorne o número de caracteres mais à esquerda conforme especificado</td> </tr><tr><td><a class="link" href="string-functions.html#function_length">[[<code>LENGTH()</code>]]</a></td> <td>Retorne o comprimento de uma string em bytes</td> </tr><tr><td><a class="link" href="string-comparison-functions.html#operator_like">[[<code>BIT_LENGTH()</code><code>FIELD()</code>]</a></td> <td>Encontre padrões simples</td> </tr><tr><td><a class="link" href="string-functions.html#function_load-file">[[<code>BIT_LENGTH()</code><code>FIELD()</code>]</a></td> <td>Carregue o arquivo nomeado</td> </tr><tr><td><a class="link" href="string-functions.html#function_locate">[[<code>BIT_LENGTH()</code><code>FORMAT()</code>]</a></td> <td>Retorne a posição da primeira ocorrência da subcadeia</td> </tr><tr><td><a class="link" href="string-functions.html#function_lower">[[<code>BIT_LENGTH()</code><code>FROM_BASE64()</code>]</a></td> <td>Devolva o argumento em minúsculas</td> </tr><tr><td><a class="link" href="string-functions.html#function_lpad">[[<code>BIT_LENGTH()</code><code>HEX()</code>]</a></td> <td>Retorne o argumento de string, preenchido à esquerda com a string especificada</td> </tr><tr><td><a class="link" href="string-functions.html#function_ltrim">[[<code>BIT_LENGTH()</code><code>INSERT()</code>]</a></td> <td>Remova espaços em branco iniciais</td> </tr><tr><td><a class="link" href="string-functions.html#function_make-set">[[<code>BIT_LENGTH()</code><code>INSTR()</code>]</a></td> <td>Retorne um conjunto de strings separadas por vírgula que tenham o bit correspondente definido em bits</td> </tr><tr><td><a class="link" href="fulltext-search.html#function_match">[[<code>BIT_LENGTH()</code><code>LCASE()</code>]</a></td> <td>Realize uma pesquisa de texto completo</td> </tr><tr><td><a class="link" href="string-functions.html#function_mid">[[<code>BIT_LENGTH()</code><code>LEFT()</code>]</a></td> <td>Retorne uma subcadeia a partir da posição especificada</td> </tr><tr><td><a class="link" href="string-comparison-functions.html#operator_not-like">[[<code>BIT_LENGTH()</code><code>LENGTH()</code>]</a></td> <td>Negação de correspondência de padrão simples</td> </tr><tr><td><a class="link" href="regexp.html#operator_not-regexp">[[<code>CHAR()</code><code>FIELD()</code>]</a></td> <td>Negação de REGEXP</td> </tr><tr><td><a class="link" href="string-functions.html#function_oct">[[<code>CHAR()</code><code>FIELD()</code>]</a></td> <td>Retorne uma string contendo a representação octal de um número</td> </tr><tr><td><a class="link" href="string-functions.html#function_octet-length">[[<code>CHAR()</code><code>FORMAT()</code>]</a></td> <td>Sinônimo de LENGTH()</td> </tr><tr><td><a class="link" href="string-functions.html#function_ord">[[<code>CHAR()</code><code>FROM_BASE64()</code>]</a></td> <td>Código de caractere de retorno para o caractere mais à esquerda do argumento</td> </tr><tr><td><a class="link" href="string-functions.html#function_position">[[<code>CHAR()</code><code>HEX()</code>]</a></td> <td>Sinônimo de LOCATE()</td> </tr><tr><td><a class="link" href="string-functions.html#function_quote">[[<code>CHAR()</code><code>INSERT()</code>]</a></td> <td>Escape o argumento para uso em uma declaração SQL</td> </tr><tr><td><a class="link" href="regexp.html#operator_regexp">[[<code>CHAR()</code><code>INSTR()</code>]</a></td> <td>Se a cadeia corresponde à expressão regular</td> </tr><tr><td><a class="link" href="string-functions.html#function_repeat">[[<code>CHAR()</code><code>LCASE()</code>]</a></td> <td>Repita uma string o número especificado de vezes</td> </tr><tr><td><a class="link" href="string-functions.html#function_replace">[[<code>CHAR()</code><code>LEFT()</code>]</a></td> <td>Substitua as ocorrências de uma string especificada</td> </tr><tr><td><a class="link" href="string-functions.html#function_reverse">[[<code>CHAR()</code><code>LENGTH()</code>]</a></td> <td>Inverter os caracteres de uma string</td> </tr><tr><td><a class="link" href="string-functions.html#function_right">[[<code>CHAR_LENGTH()</code><code>FIELD()</code>]</a></td> <td>Retorne o número especificado de caracteres à direita</td> </tr><tr><td><a class="link" href="regexp.html#operator_regexp">[[<code>CHAR_LENGTH()</code><code>FIELD()</code>]</a></td> <td>Se a cadeia corresponde à expressão regular</td> </tr><tr><td><a class="link" href="string-functions.html#function_rpad">[[<code>CHAR_LENGTH()</code><code>FORMAT()</code>]</a></td> <td>Adicione a string o número especificado de vezes</td> </tr><tr><td><a class="link" href="string-functions.html#function_rtrim">[[<code>CHAR_LENGTH()</code><code>FROM_BASE64()</code>]</a></td> <td>Remova espaços em branco finais</td> </tr><tr><td><a class="link" href="string-functions.html#function_soundex">[[<code>CHAR_LENGTH()</code><code>HEX()</code>]</a></td> <td>Retorne uma string soundex</td> </tr><tr><td><a class="link" href="string-functions.html#operator_sounds-like">[[<code>CHAR_LENGTH()</code><code>INSERT()</code>]</a></td> <td>Compare os sons</td> </tr><tr><td><a class="link" href="string-functions.html#function_space">[[<code>CHAR_LENGTH()</code><code>INSTR()</code>]</a></td> <td>Retorne uma string com o número especificado de espaços</td> </tr><tr><td><a class="link" href="string-comparison-functions.html#function_strcmp">[[<code>CHAR_LENGTH()</code><code>LCASE()</code>]</a></td> <td>Compare duas strings</td> </tr><tr><td><a class="link" href="string-functions.html#function_substr">[[<code>CHAR_LENGTH()</code><code>LEFT()</code>]</a></td> <td>Retorne a subcadeia especificada</td> </tr><tr><td><a class="link" href="string-functions.html#function_substring">[[<code>CHAR_LENGTH()</code><code>LENGTH()</code>]</a></td> <td>Retorne a subcadeia especificada</td> </tr><tr><td><a class="link" href="string-functions.html#function_substring-index">[[<code>CHARACTER_LENGTH()</code><code>FIELD()</code>]</a></td> <td>Retorne uma subcadeia de uma string antes do número especificado de ocorrências do delimitador</td> </tr><tr><td><a class="link" href="string-functions.html#function_to-base64">[[<code>CHARACTER_LENGTH()</code><code>FIELD()</code>]</a></td> <td>Retorne o argumento convertido em uma string base-64</td> </tr><tr><td><a class="link" href="string-functions.html#function_trim">[[<code>CHARACTER_LENGTH()</code><code>FORMAT()</code>]</a></td> <td>Remova espaços em branco no início e no final</td> </tr><tr><td><a class="link" href="string-functions.html#function_ucase">[[<code>CHARACTER_LENGTH()</code><code>FROM_BASE64()</code>]</a></td> <td>Sinônimo de UPPER()</td> </tr><tr><td><a class="link" href="string-functions.html#function_unhex">[[<code>CHARACTER_LENGTH()</code><code>HEX()</code>]</a></td> <td>Retorne uma string contendo a representação hexadecimal de um número</td> </tr><tr><td><a class="link" href="string-functions.html#function_upper">[[<code>CHARACTER_LENGTH()</code><code>INSERT()</code>]</a></td> <td>Converta para maiúsculas</td> </tr><tr><td><a class="link" href="string-functions.html#function_weight-string">[[<code>CHARACTER_LENGTH()</code><code>INSTR()</code>]</a></td> <td>Retorne a string de peso para uma string</td> </tr></tbody></table>

As funções de valor de cadeia de caracteres retornam `NULL` se o comprimento do resultado fosse maior que o valor da variável de sistema `max_allowed_packet`. Veja a Seção 5.1.1, “Configurando o servidor”.

Para funções que operam em posições de string, a primeira posição é numerada como 1.

Para funções que aceitam argumentos de comprimento, os argumentos não inteiros são arredondados para o inteiro mais próximo.

- `ASCII(str)`

  Retorna o valor numérico do caractere mais à esquerda da string *`str`*. Retorna `0` se *`str`* for a string vazia. Retorna `NULL` se *`str`* for `NULL`. `ASCII()` funciona para caracteres de 8 bits.

  ```sql
  mysql> SELECT ASCII('2');
          -> 50
  mysql> SELECT ASCII(2);
          -> 50
  mysql> SELECT ASCII('dx');
          -> 100
  ```

  Veja também a função `ORD()`.

- `BIN(N)`

  Retorna uma representação em string do valor binário de *`N`*, onde *`N`* é um número longlong (`BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT`). Isso é equivalente a `CONV(N,10,2)`. Retorna `NULL` se *`N`* for `NULL\`.

  ```sql
  mysql> SELECT BIN(12);
          -> '1100'
  ```

- `BIT_LENGTH(str)`

  Retorna o comprimento da string *`str`* em bits.

  ```sql
  mysql> SELECT BIT_LENGTH('text');
          -> 32
  ```

- `CHAR(N,... [USANDO charset_name])`

  `CHAR()` interpreta cada argumento *`N`* como um inteiro e retorna uma string composta pelos caracteres fornecidos pelos valores de código desses inteiros. Os valores `NULL` são ignorados.

  ```sql
  mysql> SELECT CHAR(77,121,83,81,'76');
          -> 'MySQL'
  mysql> SELECT CHAR(77,77.3,'77.3');
          -> 'MMM'
  ```

  Os argumentos `CHAR()` maiores que 255 são convertidos em múltiplos bytes de resultado. Por exemplo, `CHAR(256)` é equivalente a `CHAR(1,0)`, e `CHAR(256*256)` é equivalente a `CHAR(1,0,0)`:

  ```sql
  mysql> SELECT HEX(CHAR(1,0)), HEX(CHAR(256));
  +----------------+----------------+
  | HEX(CHAR(1,0)) | HEX(CHAR(256)) |
  +----------------+----------------+
  | 0100           | 0100           |
  +----------------+----------------+
  mysql> SELECT HEX(CHAR(1,0,0)), HEX(CHAR(256*256));
  +------------------+--------------------+
  | HEX(CHAR(1,0,0)) | HEX(CHAR(256*256)) |
  +------------------+--------------------+
  | 010000           | 010000             |
  +------------------+--------------------+
  ```

  Por padrão, `CHAR()` retorna uma string binária. Para produzir uma string em um conjunto de caracteres específico, use a cláusula opcional `USING`:

  ```sql
  mysql> SELECT CHARSET(CHAR(X'65')), CHARSET(CHAR(X'65' USING utf8));
  +----------------------+---------------------------------+
  | CHARSET(CHAR(X'65')) | CHARSET(CHAR(X'65' USING utf8)) |
  +----------------------+---------------------------------+
  | binary               | utf8                            |
  +----------------------+---------------------------------+
  ```

  Se `USING` for fornecido e a string de resultado for ilegal para o conjunto de caracteres fornecido, um aviso é emitido. Além disso, se o modo SQL rigoroso estiver ativado, o resultado da função `CHAR()` se torna `NULL`.

  Se a função `CHAR()` for invocada dentro do cliente **mysql**, as cadeias binárias são exibidas usando notação hexadecimal, dependendo do valor da opção `--binary-as-hex`. Para obter mais informações sobre essa opção, consulte a Seção 4.5.1, “mysql — O cliente de linha de comando do MySQL”.

- `CHAR_LENGTH(str)`

  Retorna o comprimento da string *`str`*, medido em pontos de código. Um caractere multibyte é considerado um único ponto de código. Isso significa que, para uma string que contém dois caracteres de 3 bytes, `LENGTH()` retorna `6`, enquanto `CHAR_LENGTH()` retorna `2`, como mostrado aqui:

  ```sql
  mysql> SET @dolphin:='海豚';
  Query OK, 0 rows affected (0.01 sec)

  mysql> SELECT LENGTH(@dolphin), CHAR_LENGTH(@dolphin);
  +------------------+-----------------------+
  | LENGTH(@dolphin) | CHAR_LENGTH(@dolphin) |
  +------------------+-----------------------+
  |                6 |                     2 |
  +------------------+-----------------------+
  1 row in set (0.00 sec)
  ```

- `CHARACTER_LENGTH(str)`

  `CHARACTER_LENGTH()` é sinônimo de `CHAR_LENGTH()`.

- `CONCAT(str1, str2, ...)`

  Retorna a string resultante da concatenação dos argumentos. Pode ter um ou mais argumentos. Se todos os argumentos forem strings não binárias, o resultado será uma string não binária. Se os argumentos incluir quaisquer strings binárias, o resultado será uma string binária. Um argumento numérico é convertido para sua forma equivalente de string não binária.

  `CONCAT()` retorna `NULL` se qualquer argumento for `NULL`.

  ```sql
  mysql> SELECT CONCAT('My', 'S', 'QL');
          -> 'MySQL'
  mysql> SELECT CONCAT('My', NULL, 'QL');
          -> NULL
  mysql> SELECT CONCAT(14.3);
          -> '14.3'
  ```

  Para strings citadas, a concatenação pode ser realizada colocando as strings uma ao lado da outra:

  ```sql
  mysql> SELECT 'My' 'S' 'QL';
          -> 'MySQL'
  ```

  Se a função `CONCAT()` for invocada dentro do cliente **mysql**, os resultados das cadeias binárias são exibidos usando a notação hexadecimal, dependendo do valor da opção `--binary-as-hex`. Para obter mais informações sobre essa opção, consulte a Seção 4.5.1, “mysql — O cliente de linha de comando do MySQL”.

- `CONCAT_WS(separador,str1,str2,...)`

  `CONCAT_WS()` significa Concatenar com Sepador e é uma forma especial da função `CONCAT()`. O primeiro argumento é o separador para os demais argumentos. O separador é adicionado entre as strings a serem concatenadas. O separador pode ser uma string, assim como os demais argumentos. Se o separador for `NULL`, o resultado será `NULL`.

  ```sql
  mysql> SELECT CONCAT_WS(',', 'First name', 'Second name', 'Last Name');
          -> 'First name,Second name,Last Name'
  mysql> SELECT CONCAT_WS(',', 'First name', NULL, 'Last Name');
          -> 'First name,Last Name'
  ```

  `CONCAT_WS()` não ignora cadeias vazias. No entanto, ele ignora quaisquer valores `NULL` após o argumento separador.

- `ELT(N,str1,str2,str3,...)`

  `ELT()` retorna o \*`N`\*º elemento da lista de strings: *`str1`* se *`N`* = `1`, *`str2`* se *`N`* = `2`, e assim por diante. Retorna `NULL` se *`N`* for menor que `1` ou maior que o número de argumentos. `ELT()` é o complemento de `FIELD()`.

  ```sql
  mysql> SELECT ELT(1, 'Aa', 'Bb', 'Cc', 'Dd');
          -> 'Aa'
  mysql> SELECT ELT(4, 'Aa', 'Bb', 'Cc', 'Dd');
          -> 'Dd'
  ```

- [`EXPORT_SET(bits, on, off[, separator[, número_de_bits]])`](string-functions.html#function_export-set)

  Retorna uma string de tal forma que, para cada bit definido no valor *`bits`*, você recebe uma string *`on`* e, para cada bit não definido no valor, você recebe uma string *`off`*. Os bits em *`bits`* são examinados da direita para a esquerda (de bits de menor ordem para bits de maior ordem). As strings são adicionadas ao resultado da esquerda para a direita, separadas pela string *`separator`* (o padrão é o caractere vírgula `,`). O número de bits examinados é dado por *`number_of_bits`*, que tem um valor padrão de 64 se não for especificado. *`number_of_bits`* é acionado silenciosamente para 64 se for maior que 64. Ele é tratado como um inteiro não assinado, então um valor de −1 é efetivamente o mesmo que 64.

  ```sql
  mysql> SELECT EXPORT_SET(5,'Y','N',',',4);
          -> 'Y,N,Y,N'
  mysql> SELECT EXPORT_SET(6,'1','0',',',10);
          -> '0,1,1,0,0,0,0,0,0,0'
  ```

- `FIELD(str,str1,str2,str3,...)`

  Retorna o índice (posição) de *`str`* na lista *`str1`*, *`str2`*, *`str3`*, *...*. Retorna `0` se *`str`* não for encontrado.

  Se todos os argumentos de `FIELD()` forem strings, todos os argumentos são comparados como strings. Se todos os argumentos forem números, eles são comparados como números. Caso contrário, os argumentos são comparados como duplos.

  Se *`str`* for `NULL`, o valor de retorno será `0` porque `NULL` falha na comparação de igualdade com qualquer valor. `FIELD()` é o complemento de `ELT()`.

  ```sql
  mysql> SELECT FIELD('Bb', 'Aa', 'Bb', 'Cc', 'Dd', 'Ff');
          -> 2
  mysql> SELECT FIELD('Gg', 'Aa', 'Bb', 'Cc', 'Dd', 'Ff');
          -> 0
  ```

- `FIND_IN_SET(str, strlist)`

  Retorna um valor no intervalo de 1 a *`N`* se a string *`str`* estiver na lista de strings *`strlist`* composta por *`N`* substrings. Uma lista de strings é uma string composta por substrings separados por caracteres `,`. Se o primeiro argumento for uma string constante e o segundo for uma coluna do tipo `SET`, a função `FIND_IN_SET()` é otimizada para usar aritmética de bits. Retorna `0` se *`str`* não estiver em *`strlist`* ou se *`strlist`* for a string vazia. Retorna `NULL` se qualquer um dos argumentos for `NULL`. Esta função não funciona corretamente se o primeiro argumento contiver um caractere `,` (vírgula).

  ```sql
  mysql> SELECT FIND_IN_SET('b','a,b,c,d');
          -> 2
  ```

- `FORMAT(X, D[, locale])`

  Formata o número *`X`* para um formato como `'#,###,###.##'`, arredondado a *`D`* casas decimais, e retorna o resultado como uma string. Se *`D`* for `0`, o resultado não terá ponto decimal ou parte fracionária.

  O terceiro parâmetro opcional permite especificar um local para ser usado para o ponto decimal do número de resultado, o separador de milhares e a separação entre os separadores. Os valores de local permitidos são os mesmos dos valores legais para a variável de sistema `lc_time_names` (consulte a Seção 10.16, “Suporte de Local do MySQL Server”). Se nenhum local for especificado, o padrão é `'en_US'`.

  ```sql
  mysql> SELECT FORMAT(12332.123456, 4);
          -> '12,332.1235'
  mysql> SELECT FORMAT(12332.1,4);
          -> '12,332.1000'
  mysql> SELECT FORMAT(12332.2,0);
          -> '12,332'
  mysql> SELECT FORMAT(12332.2,2,'de_DE');
          -> '12.332,20'
  ```

- `FROM_BASE64(str)`

  Toma uma string codificada com as regras de codificação base-64 usadas pelo `TO_BASE64()`, e retorna o resultado decodificado como uma string binária. O resultado é `NULL` se o argumento for `NULL` ou não for uma string base-64 válida. Consulte a descrição do `TO_BASE64()` para obter detalhes sobre as regras de codificação e decodificação.

  ```sql
  mysql> SELECT TO_BASE64('abc'), FROM_BASE64(TO_BASE64('abc'));
          -> 'JWJj', 'abc'
  ```

  Se `FROM_BASE64()` for invocado dentro do cliente **mysql**, as cadeias binárias são exibidas usando notação hexadecimal, dependendo do valor da opção `--binary-as-hex`. Para obter mais informações sobre essa opção, consulte a Seção 4.5.1, “mysql — O cliente de linha de comando do MySQL”.

- `HEX(str)`, `HEX(N)`

  Para um argumento de string *`str`*, `HEX()` retorna uma representação hexadecimal da string *`str`* onde cada byte de cada caractere em *`str`* é convertido em dois dígitos hexadecimais. (Caracteres multibyte, portanto, se tornam mais de dois dígitos.) A operação inversa é realizada pela função `UNHEX()`.

  Para um argumento numérico *`N`*, `HEX()` retorna uma representação hexadecimal da string do valor de *`N`* tratado como um número de tipo `longlong` (`BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT`). Isso é equivalente a `CONV(N,10,16)`. A operação inversa é realizada por `CONV(HEX(N),16,10)\`.

  ```sql
  mysql> SELECT X'616263', HEX('abc'), UNHEX(HEX('abc'));
          -> 'abc', 616263, 'abc'
  mysql> SELECT HEX(255), CONV(HEX(255),16,10);
          -> 'FF', 255
  ```

- `INSERT(str, pos, len, newstr)`

  Retorna a string *`str`*, com a subcadeia começando na posição *`pos`* e com *`len`* caracteres de comprimento substituída pela string *`newstr`*. Retorna a string original se *`pos`* não estiver dentro do comprimento da string. Substitui o resto da string a partir da posição *`pos`* se *`len`* não estiver dentro do comprimento do resto da string. Retorna `NULL` se algum argumento for `NULL`.

  ```sql
  mysql> SELECT INSERT('Quadratic', 3, 4, 'What');
          -> 'QuWhattic'
  mysql> SELECT INSERT('Quadratic', -1, 4, 'What');
          -> 'Quadratic'
  mysql> SELECT INSERT('Quadratic', 3, 100, 'What');
          -> 'QuWhat'
  ```

  Essa função é segura para multibytes.

- `INSTR(str,substr)`

  Retorna a posição da primeira ocorrência da subcadeia *`substr`* na string *`str`*. Isso é o mesmo que a forma de dois argumentos da função `LOCATE()`, exceto que a ordem dos argumentos é invertida.

  ```sql
  mysql> SELECT INSTR('foobarbar', 'bar');
          -> 4
  mysql> SELECT INSTR('xbar', 'foobar');
          -> 0
  ```

  Essa função é segura para multibytes e é case-sensitive apenas se pelo menos um argumento for uma string binária.

- `LCASE(str)`

  `LCASE()` é um sinônimo de `LOWER()`.

  `LCASE()` usado em uma vista é reescrito como `LOWER()` ao armazenar a definição da vista. (Bug #12844279)

- `LEFT(str, len)`

  Retorna os caracteres *`len`* mais à esquerda da string *`str`*, ou `NULL` se algum argumento for `NULL`.

  ```sql
  mysql> SELECT LEFT('foobarbar', 5);
          -> 'fooba'
  ```

  Essa função é segura para multibytes.

- `LENGTH(str)`

  Retorna o comprimento da string *`str`*, medido em bytes. Um caractere multibyte é contado como múltiplos bytes. Isso significa que, para uma string que contém cinco caracteres de 2 bytes, o `LENGTH()` retorna `10`, enquanto o `CHAR_LENGTH()` retorna `5`.

  ```sql
  mysql> SELECT LENGTH('text');
          -> 4
  ```

  Nota

  A função espacial `Length()` do OpenGIS é chamada `ST_Length()` no MySQL.

- `LOAD_FILE(nome_do_arquivo)`

  Leitura do arquivo e retorno do conteúdo do arquivo como uma string. Para usar essa função, o arquivo deve estar localizado no host do servidor, você deve especificar o nome completo do caminho do arquivo e você deve ter o privilégio `FILE`. O arquivo deve ser legível por todos e seu tamanho deve ser menor que `max_allowed_packet` bytes. Se a variável de sistema `secure_file_priv` estiver definida como um nome de diretório não vazio, o arquivo a ser carregado deve estar localizado nesse diretório.

  Se o arquivo não existir ou não puder ser lido porque uma das condições anteriores não for atendida, a função retorna `NULL`.

  A variável de sistema `character_set_filesystem` controla a interpretação dos nomes de arquivos fornecidos como strings literais.

  ```sql
  mysql> UPDATE t
              SET blob_col=LOAD_FILE('/tmp/picture')
              WHERE id=1;
  ```

- `LOCATE(substr,str)` e `LOCATE(substr,str,pos)`

  A primeira sintaxe retorna a posição da primeira ocorrência da subcadeia *`substr`* na string *`str`*. A segunda sintaxe retorna a posição da primeira ocorrência da subcadeia *`substr`* na string *`str`*, começando na posição *`pos`*. Retorna `0` se *`substr`* não estiver em *`str`*. Retorna `NULL` se *`substr`* ou *`str`* estiverem `NULL`.

  ```sql
  mysql> SELECT LOCATE('bar', 'foobarbar');
          -> 4
  mysql> SELECT LOCATE('xbar', 'foobar');
          -> 0
  mysql> SELECT LOCATE('bar', 'foobarbar', 5);
          -> 7
  ```

  Essa função é segura para multibytes e é case-sensitive apenas se pelo menos um argumento for uma string binária.

- `LOWER(str)`

  Retorna a string *`str`* com todos os caracteres alterados para maiúsculas conforme a configuração atual do mapeamento de conjuntos de caracteres. O padrão é `latin1` (cp1252, Europa Ocidental).

  ```sql
  mysql> SELECT LOWER('QUADRATICALLY');
          -> 'quadratically'
  ```

  `LOWER()` (e `UPPER()`) são ineficazes quando aplicados a strings binárias (`BINARY`, `VARBINARY`, `BLOB`). Para realizar a conversão de maiúsculas e minúsculas de uma string binária, primeiro converta-a em uma string não binária usando um conjunto de caracteres apropriado para os dados armazenados na string:

  ```sql
  mysql> SET @str = BINARY 'New York';
  mysql> SELECT LOWER(@str), LOWER(CONVERT(@str USING latin1));
  +-------------+-----------------------------------+
  | LOWER(@str) | LOWER(CONVERT(@str USING latin1)) |
  +-------------+-----------------------------------+
  | New York    | new york                          |
  +-------------+-----------------------------------+
  ```

  Para a comparação de conjuntos de caracteres Unicode, `LOWER()` e `UPPER()` funcionam de acordo com o Algoritmo de Comparação Unicode (UCA) da versão indicada no nome da comparação, se houver uma, e UCA 4.0.0, se nenhuma versão for especificada. Por exemplo, `utf8_unicode_520_ci` funciona de acordo com o UCA 5.2.0, enquanto `utf8_unicode_ci` funciona de acordo com o UCA 4.0.0. Veja a Seção 10.10.1, “Conjunto de Caracteres Unicode”.

  Essa função é segura para multibytes.

  Em versões anteriores do MySQL, `LOWER()` usado dentro de uma vista era reescrito como `LCASE()` ao armazenar a definição da vista. No MySQL 5.7, `LOWER()` nunca é reescrito nessas situações, mas `LCASE()` usado dentro das vistas é reescrito como `LOWER()`. (Bug #12844279)

- `LPAD(str,len,padstr)`

  Retorna a string *`str`*, preenchida à esquerda com a string *`padstr`* até atingir uma extensão de *`len`* caracteres. Se *`str`* for mais longa que *`len`*, o valor de retorno é encurtado para *`len`* caracteres.

  ```sql
  mysql> SELECT LPAD('hi',4,'??');
          -> '??hi'
  mysql> SELECT LPAD('hi',1,'??');
          -> 'h'
  ```

- `LTRIM(str)`

  Retorna a string *`str`* com os caracteres de espaço em branco removidos.

  ```sql
  mysql> SELECT LTRIM('  barbar');
          -> 'barbar'
  ```

  Essa função é segura para multibytes.

- `MAKE_SET(bits,str1,str2,...)`

  Retorna um conjunto de valores (uma string contendo substrings separados por caracteres `,`) consistindo das strings que têm o bit correspondente em *`bits`* definido. *`str1`* corresponde ao bit 0, *`str2`* ao bit 1, e assim por diante. Valores `NULL` em *`str1`*, *`str2`*, `...` não são anexados ao resultado.

  ```sql
  mysql> SELECT MAKE_SET(1,'a','b','c');
          -> 'a'
  mysql> SELECT MAKE_SET(1 | 4,'hello','nice','world');
          -> 'hello,world'
  mysql> SELECT MAKE_SET(1 | 4,'hello','nice',NULL,'world');
          -> 'hello'
  mysql> SELECT MAKE_SET(0,'a','b','c');
          -> ''
  ```

- `MID(str, pos)`, `MID(str FROM pos)`, `MID(str, pos, len)`, `MID(str FROM pos FOR len)`

  `MID(str, pos, len)` é sinônimo de `SUBSTRING(str, pos, len)`.

- `OCT(N)`

  Retorna uma representação em string do valor octal de *`N`*, onde *`N`* é um número longlong (`BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT`). Isso é equivalente a `CONV(N,10,8)`. Retorna `NULL` se *`N`* for `NULL\`.

  ```sql
  mysql> SELECT OCT(12);
          -> '14'
  ```

- `OCTET_LENGTH(str)`

  `OCTET_LENGTH()` é sinônimo de `LENGTH()`.

- `ORD(str)`

  Se o caractere mais à esquerda da string *`str`* for um caractere multibyte, retorne o código desse caractere, calculado a partir dos valores numéricos de seus bytes constituintes usando esta fórmula:

  ```sql
    (1st byte code)
  + (2nd byte code * 256)
  + (3rd byte code * 256^2) ...
  ```

  Se o caractere mais à esquerda não for um caractere multibyte, o `ORD()` retorna o mesmo valor que a função `ASCII()`.

  ```sql
  mysql> SELECT ORD('2');
          -> 50
  ```

- `POSITION(substr IN str)`

  `POSITION(substr IN str)` é sinônimo de `LOCATE(substr, str)`.

- `CITE(str)`

  Cita uma string para produzir um resultado que pode ser usado como um valor de dados corretamente escapado em uma instrução SQL. A string é retornada entre aspas simples e com cada instância de barra invertida (`\`), aspas simples (`'`), ASCII `NUL` e Control+Z precedidas por uma barra invertida. Se o argumento for `NULL`, o valor de retorno é a palavra “NULL” sem as aspas simples.

  ```sql
  mysql> SELECT QUOTE('Don\'t!');
          -> 'Don\'t!'
  mysql> SELECT QUOTE(NULL);
          -> NULL
  ```

  Para comparação, consulte as regras de citação para strings literais e dentro da API C na Seção 9.1.1, “Strings Literais”, e mysql\_real\_escape\_string\_quote().

- `REPETIR(str, count)`

  Retorna uma string composta pela string *`str`* repetida *`count`* vezes. Se *`count`* for menor que 1, retorna uma string vazia. Retorna `NULL` se *`str`* ou *`count`* forem `NULL`.

  ```sql
  mysql> SELECT REPEAT('MySQL', 3);
          -> 'MySQLMySQLMySQL'
  ```

- `REPLACE(str, from_str, to_str)`

  Retorna a string *`str`* com todas as ocorrências da string *`from_str`* substituídas pela string *`to_str`*. O método `REPLACE()` realiza uma correspondência sensível a maiúsculas e minúsculas ao procurar por *`from_str`*.

  ```sql
  mysql> SELECT REPLACE('www.mysql.com', 'w', 'Ww');
          -> 'WwWwWw.mysql.com'
  ```

  Essa função é segura para multibytes.

- `REVERSE(str)`

  Retorna a string *`str`* com a ordem dos caracteres invertida.

  ```sql
  mysql> SELECT REVERSE('abc');
          -> 'cba'
  ```

  Essa função é segura para multibytes.

- `RIGHT(str, len)`

  Retorna os caracteres *`len`* mais à direita da string *`str`*, ou `NULL` se algum argumento for `NULL`.

  ```sql
  mysql> SELECT RIGHT('foobarbar', 4);
          -> 'rbar'
  ```

  Essa função é segura para multibytes.

- `RPAD(str, len, padstr)`

  Retorna a string *`str`*, preenchida à direita com a string *`padstr`* até atingir uma extensão de *`len`* caracteres. Se *`str`* for mais longa que *`len`*, o valor de retorno é encurtado para *`len`* caracteres.

  ```sql
  mysql> SELECT RPAD('hi',5,'?');
          -> 'hi???'
  mysql> SELECT RPAD('hi',1,'?');
          -> 'h'
  ```

  Essa função é segura para multibytes.

- `RTRIM(str)`

  Retorna a string *`str`* com os caracteres de espaço em branco finais removidos.

  ```sql
  mysql> SELECT RTRIM('barbar   ');
          -> 'barbar'
  ```

  Essa função é segura para multibytes.

- `SOUNDEX(str)`

  Retorna uma string de soundex de *`str`*. Duas strings que soam quase iguais devem ter strings de soundex idênticas. Uma string de soundex padrão tem quatro caracteres, mas a função `SOUNDEX()` retorna uma string arbitrariamente longa. Você pode usar `SUBSTRING()` no resultado para obter uma string de soundex padrão. Todos os caracteres não alfabéticos em *`str`* são ignorados. Todos os caracteres alfabéticos internacionais fora da faixa de A-Z são tratados como vogais.

  Importante

  Ao usar `SOUNDEX()`, você deve estar ciente das seguintes limitações:

  - Essa função, conforme implementada atualmente, é destinada a funcionar bem com strings que estão apenas no idioma inglês. Strings em outros idiomas podem não produzir resultados confiáveis.

  - Esta função não garante resultados consistentes com strings que utilizam conjuntos de caracteres multibyte, incluindo `utf-8`. Consulte o Bug #22638 para obter mais informações.

  ```sql
  mysql> SELECT SOUNDEX('Hello');
          -> 'H400'
  mysql> SELECT SOUNDEX('Quadratically');
          -> 'Q36324'
  ```

  Nota

  Essa função implementa o algoritmo original Soundex, e não a versão aprimorada mais popular (também descrita por D. Knuth). A diferença é que a versão original descarta as vogais primeiro e duplica as consoantes depois, enquanto a versão aprimorada descarta as duplicatas primeiro e as vogais depois.

- `expr1 SOA COMO expr2`

  Isso é o mesmo que `SOUNDEX(expr1) = SOUNDEX(expr2)`.

- `ESPACO(N)`

  Retorna uma string composta por *`N`* caracteres de espaço.

  ```sql
  mysql> SELECT SPACE(6);
          -> '      '
  ```

- `SUBSTR(str, pos)`, `SUBSTR(str FROM pos)`, `SUBSTR(str, pos, len)`, `SUBSTR(str FROM pos FOR len)`

  `SUBSTR()` é sinônimo de `SUBSTRING()`.

- `SUBSTRING(str, pos)`, `SUBSTRING(str FROM pos)`, `SUBSTRING(str, pos, len)`, `SUBSTRING(str FROM pos FOR len)`

  Os formulários sem o argumento `*len*` retornam uma subcadeia da string `*str*` a partir da posição `*pos*`. Os formulários com o argumento `*len*` retornam uma subcadeia de `*len*` caracteres da string `*str*`, a partir da posição `*pos*`. Os formulários que usam `FROM` são a sintaxe padrão do SQL. Também é possível usar um valor negativo para `*pos*`. Neste caso, o início da subcadeia está `*pos*` caracteres a partir do final da string, em vez do início. Um valor negativo pode ser usado para `*pos*` em qualquer um dos formulários desta função. Um valor de 0 para `*pos*` retorna uma string vazia.

  Para todas as formas de `SUBSTRING()`, a posição do primeiro caractere na string a partir da qual a subcadeia deve ser extraída é considerada como `1`.

  ```sql
  mysql> SELECT SUBSTRING('Quadratically',5);
          -> 'ratically'
  mysql> SELECT SUBSTRING('foobarbar' FROM 4);
          -> 'barbar'
  mysql> SELECT SUBSTRING('Quadratically',5,6);
          -> 'ratica'
  mysql> SELECT SUBSTRING('Sakila', -3);
          -> 'ila'
  mysql> SELECT SUBSTRING('Sakila', -5, 3);
          -> 'aki'
  mysql> SELECT SUBSTRING('Sakila' FROM -4 FOR 2);
          -> 'ki'
  ```

  Essa função é segura para multibytes.

  Se *`len`* for menor que 1, o resultado será a string vazia.

- `SUBSTRING_INDEX(str, delim, count)`

  Retorna a subcadeia da string *`str`* antes de *`count`* ocorrências do delimitador *`delim`*. Se *`count`* for positivo, tudo à esquerda do delimitador final (contando da esquerda para a direita) é retornado. Se *`count`* for negativo, tudo à direita do delimitador final (contando da direita para a esquerda) é retornado. A função `SUBSTRING_INDEX()` realiza uma correspondência sensível a maiúsculas e minúsculas ao procurar por *`delim`*.

  ```sql
  mysql> SELECT SUBSTRING_INDEX('www.mysql.com', '.', 2);
          -> 'www.mysql'
  mysql> SELECT SUBSTRING_INDEX('www.mysql.com', '.', -2);
          -> 'mysql.com'
  ```

  Essa função é segura para multibytes.

- `TO_BASE64(str)`

  Converte o argumento de string para a forma codificada em base-64 e retorna o resultado como uma string de caracteres com o conjunto de caracteres de conexão e a ordenação. Se o argumento não for uma string, ele é convertido em uma string antes da conversão ocorrer. O resultado é `NULL` se o argumento for `NULL`. Strings codificadas em base-64 podem ser decodificadas usando a função `FROM_BASE64()`.

  ```sql
  mysql> SELECT TO_BASE64('abc'), FROM_BASE64(TO_BASE64('abc'));
          -> 'JWJj', 'abc'
  ```

  Existem diferentes esquemas de codificação base-64. Estes são as regras de codificação e decodificação usadas pelo `TO_BASE64()` e `FROM_BASE64()`:

  - O codificação para o valor do alfabeto 62 é `'+'`.

  - O codificação para o valor do alfabeto 63 é `'/'`.

  - A saída codificada consiste em grupos de 4 caracteres imprimíveis. Cada 3 bytes dos dados de entrada são codificados usando 4 caracteres. Se o último grupo estiver incompleto, ele é preenchido com caracteres `='` até atingir uma extensão de 4.

  - Uma nova linha é adicionada após cada 76 caracteres de saída codificada para dividir a saída longa em várias linhas.

  - O Decoding reconhece e ignora novas linhas, retorno de carro, tabulação e espaços.

- [`TRIM([{BOTH | LEADING | TRAILING} [remstr] FROM] str)`](string-functions.html#function_trim), `TRIM([remstr FROM] str)`

  Retorna a string *`str`* com todos os prefixos ou sufixos de *`remstr`* removidos. Se nenhum dos especificadores `BOTH`, `LEADING` ou `TRAILING` for fornecido, o `BOTH` é assumido. *`remstr`* é opcional e, se não especificado, os espaços são removidos.

  ```sql
  mysql> SELECT TRIM('  bar   ');
          -> 'bar'
  mysql> SELECT TRIM(LEADING 'x' FROM 'xxxbarxxx');
          -> 'barxxx'
  mysql> SELECT TRIM(BOTH 'x' FROM 'xxxbarxxx');
          -> 'bar'
  mysql> SELECT TRIM(TRAILING 'xyz' FROM 'barxxyz');
          -> 'barx'
  ```

  Essa função é segura para multibytes.

- `UCASE(str)`

  `UCASE()` é um sinônimo de `UPPER()`.

  No MySQL 5.7, `UCASE()` usado em uma visualização é reescrito como `UPPER()` ao armazenar a definição da visualização. (Bug #12844279)

- `UNHEX(str)`

  Para um argumento de string *`str`*, `UNHEX(str)` interpreta cada par de caracteres no argumento como um número hexadecimal e o converte para o byte representado pelo número. O valor de retorno é uma string binária.

  ```sql
  mysql> SELECT UNHEX('4D7953514C');
          -> 'MySQL'
  mysql> SELECT X'4D7953514C';
          -> 'MySQL'
  mysql> SELECT UNHEX(HEX('string'));
          -> 'string'
  mysql> SELECT HEX(UNHEX('1267'));
          -> '1267'
  ```

  Os caracteres na string de argumento devem ser algarismos hexadecimais válidos: `'0'` .. `'9'`, `'A'` .. `'F'`, `'a'` .. `'f'`. Se o argumento contiver quaisquer algarismos não hexadecimais, o resultado será `NULL`:

  ```sql
  mysql> SELECT UNHEX('GG');
  +-------------+
  | UNHEX('GG') |
  +-------------+
  | NULL        |
  +-------------+
  ```

  Um resultado `NULL` pode ocorrer se o argumento de `UNHEX()` for uma coluna `BINARY`, porque os valores são preenchidos com bytes `0x00` ao serem armazenados, mas esses bytes não são removidos na recuperação. Por exemplo, `'41'` é armazenado em uma coluna `CHAR(3)` como `'41 '` e recuperado como `'41'` (com o espaço de preenchimento final removido), então `UNHEX()` para o valor da coluna retorna `X'41'`. Por outro lado, `'41'` é armazenado em uma coluna `BINARY(3)` como `'41\0'` e recuperado como `'41\0'` (com o byte de preenchimento final `0x00` não removido). `'\0'` não é um dígito hexadecimal legal, então `UNHEX()` para o valor da coluna retorna `NULL`.

  Para um argumento numérico *`N`*, o inverso de `HEX(N)` não é realizado pelo `UNHEX()`. Use `CONV(HEX(N),16,10)` em vez disso. Veja a descrição do `HEX()`.

  Se a função `UNHEX()` for invocada dentro do cliente **mysql**, as cadeias binárias são exibidas usando a notação hexadecimal, dependendo do valor da opção `--binary-as-hex`. Para obter mais informações sobre essa opção, consulte a Seção 4.5.1, “mysql — O cliente de linha de comando do MySQL”.

- `UPPER(str)`

  Retorna a string *`str`* com todos os caracteres alterados para maiúsculas de acordo com a configuração atual de mapeamento de conjuntos de caracteres. O padrão é `latin1` (cp1252 da Europa Ocidental).

  ```sql
  mysql> SELECT UPPER('Hej');
          -> 'HEJ'
  ```

  Consulte a descrição da função `LOWER()` para obter informações que também se aplicam à função `UPPER()`. Isso inclui informações sobre como realizar a conversão de maiúsculas e minúsculas de strings binárias (`BINARY`, `VARBINARY`, `BLOB`), para as quais essas funções são ineficazes, e informações sobre o dobramento de maiúsculas para conjuntos de caracteres Unicode.

  Essa função é segura para multibytes.

  Em versões anteriores do MySQL, `UPPER()` usado dentro de uma vista era reescrito como `UCASE()` ao armazenar a definição da vista. No MySQL 5.7, `UPPER()` nunca é reescrito nessas situações, mas `UCASE()` usado dentro das vistas é reescrito como `UPPER()`. (Bug #12844279)

- `WEIGHT_STRING(str [AS {CHAR|BINARY}(N)] [LEVEL níveis] [flags])`

  `levels: N [ASC|DESC|REVERSE] [, N [ASC|DESC|REVERSE]] ...`

  Essa função retorna a string de peso para a string de entrada. O valor de retorno é uma string binária que representa o valor de comparação e ordenação da string. Ela tem essas propriedades:

  - Se `WEIGHT_STRING(str1)` = `WEIGHT_STRING(str2)`, então `str1 = str2` (*`str1`* e *`str2`* são considerados iguais)

  - Se `WEIGHT_STRING(str1)` < `WEIGHT_STRING(str2)`, então `str1 < str2` (*`str1`* é ordenado antes de *`str2`*)

  `WEIGHT_STRING()` é uma função de depuração destinada ao uso interno. Seu comportamento pode mudar sem aviso entre as versões do MySQL. Pode ser usada para testar e depurar colateias, especialmente se você estiver adicionando uma nova colateia. Veja a Seção 10.14, “Adicionando uma Colateia a um Conjunto de Caracteres”.

  Esta lista resume brevemente os argumentos. Mais detalhes são fornecidos na discussão que segue a lista.

  - *`str`*: A expressão de string de entrada.

  - Cláusula `AS`: Opcional; converta a string de entrada para um tipo e comprimento específicos.

  - Cláusula `LEVEL`: Opcional; especifique os níveis de peso para o valor de retorno.

  - *`flags`*: Opcional; não utilizado.

  A string de entrada, *`str`*, é uma expressão de string. Se a entrada for uma string não binária (caractere), como um valor `CHAR`, `VARCHAR` ou `TEXT`, o valor de retorno contém os pesos de ordenação da string. Se a entrada for uma string binária (byte), como um valor `BINARY`, `VARBINARY` ou `BLOB`, o valor de retorno é o mesmo da entrada (o peso de cada byte em uma string binária é o valor do byte). Se a entrada for `NULL`, `WEIGHT_STRING()` retorna `NULL`.

  Exemplos:

  ```sql
  mysql> SET @s = _latin1 'AB' COLLATE latin1_swedish_ci;
  mysql> SELECT @s, HEX(@s), HEX(WEIGHT_STRING(@s));
  +------+---------+------------------------+
  | @s   | HEX(@s) | HEX(WEIGHT_STRING(@s)) |
  +------+---------+------------------------+
  | AB   | 4142    | 4142                   |
  +------+---------+------------------------+
  ```

  ```sql
  mysql> SET @s = _latin1 'ab' COLLATE latin1_swedish_ci;
  mysql> SELECT @s, HEX(@s), HEX(WEIGHT_STRING(@s));
  +------+---------+------------------------+
  | @s   | HEX(@s) | HEX(WEIGHT_STRING(@s)) |
  +------+---------+------------------------+
  | ab   | 6162    | 4142                   |
  +------+---------+------------------------+
  ```

  ```sql
  mysql> SET @s = CAST('AB' AS BINARY);
  mysql> SELECT @s, HEX(@s), HEX(WEIGHT_STRING(@s));
  +------+---------+------------------------+
  | @s   | HEX(@s) | HEX(WEIGHT_STRING(@s)) |
  +------+---------+------------------------+
  | AB   | 4142    | 4142                   |
  +------+---------+------------------------+
  ```

  ```sql
  mysql> SET @s = CAST('ab' AS BINARY);
  mysql> SELECT @s, HEX(@s), HEX(WEIGHT_STRING(@s));
  +------+---------+------------------------+
  | @s   | HEX(@s) | HEX(WEIGHT_STRING(@s)) |
  +------+---------+------------------------+
  | ab   | 6162    | 6162                   |
  +------+---------+------------------------+
  ```

  Os exemplos anteriores usam `HEX()` para exibir o resultado da função `WEIGHT_STRING()`. Como o resultado é um valor binário, `HEX()` pode ser especialmente útil quando o resultado contém valores não imprimíveis, para exibí-lo em formato imprimível:

  ```sql
  mysql> SET @s = CONVERT(X'C39F' USING utf8) COLLATE utf8_czech_ci;
  mysql> SELECT HEX(WEIGHT_STRING(@s));
  +------------------------+
  | HEX(WEIGHT_STRING(@s)) |
  +------------------------+
  | 0FEA0FEA               |
  +------------------------+
  ```

  Para valores de retorno que não sejam `NULL`, o tipo de dados do valor é `VARBINARY` se sua extensão estiver dentro do comprimento máximo para `VARBINARY`, caso contrário, o tipo de dados é `BLOB`.

  A cláusula `AS` pode ser usada para converter a string de entrada em uma string não binária ou binária e para forçá-la a ter uma determinada extensão:

  - `AS CHAR(N)` converte a string para uma string não binária e a preenche à direita com espaços até atingir uma extensão de *`N`* caracteres. *`N`* deve ser no mínimo 1. Se *`N`* for menor que a extensão da string de entrada, a string é truncada até *`N`* caracteres. Não há aviso para o truncamento.

  - `AS BINARY(N)` é semelhante, mas converte a string em uma string binária. *`N`* é medido em bytes (não em caracteres), e o preenchimento usa bytes `0x00` (não espaços).

  ```sql
  mysql> SET NAMES 'latin1';
  mysql> SELECT HEX(WEIGHT_STRING('ab' AS CHAR(4)));
  +-------------------------------------+
  | HEX(WEIGHT_STRING('ab' AS CHAR(4))) |
  +-------------------------------------+
  | 41422020                            |
  +-------------------------------------+
  mysql> SET NAMES 'utf8';
  mysql> SELECT HEX(WEIGHT_STRING('ab' AS CHAR(4)));
  +-------------------------------------+
  | HEX(WEIGHT_STRING('ab' AS CHAR(4))) |
  +-------------------------------------+
  | 0041004200200020                    |
  +-------------------------------------+
  ```

  ```sql
  mysql> SELECT HEX(WEIGHT_STRING('ab' AS BINARY(4)));
  +---------------------------------------+
  | HEX(WEIGHT_STRING('ab' AS BINARY(4))) |
  +---------------------------------------+
  | 61620000                              |
  +---------------------------------------+
  ```

  A cláusula `LEVEL` pode ser usada para especificar que o valor de retorno deve conter pesos para níveis de ordenação específicos.

  O especificador *`levels`* após a palavra-chave `LEVEL` pode ser fornecido como uma lista de um ou mais inteiros separados por vírgulas, ou como um intervalo de dois inteiros separados por uma barra. O espaço em branco ao redor dos caracteres de pontuação não importa.

  Exemplos:

  ```sql
  LEVEL 1
  LEVEL 2, 3, 5
  LEVEL 1-3
  ```

  Qualquer nível menor que 1 é tratado como 1. Qualquer nível maior que o máximo para a ordenação da string de entrada é tratado como o máximo para a ordenação. O máximo varia de acordo com a ordenação, mas nunca é maior que 6.

  Em uma lista de níveis, os níveis devem ser apresentados em ordem crescente. Em uma faixa de níveis, se o segundo número for menor que o primeiro, ele será tratado como o primeiro número (por exemplo, 4-2 é o mesmo que 4-4).

  Se a cláusula `LEVEL` for omitida, o MySQL assume `LEVEL 1 - max`, onde *`max`* é o nível máximo para a colagem.

  Se o `LEVEL` for especificado usando a sintaxe de lista (e não a sintaxe de intervalo), qualquer número de nível pode ser seguido por esses modificadores:

  - `ASC`: Retorne os pesos sem modificação. Este é o padrão.

  - `DESC`: Retorna pesos inversos bit a bit (por exemplo, `0x78f0 DESC` = `0x870f`).

  - `REVERSE`: Retorne os pesos na ordem inversa (ou seja, os pesos para a string invertida, com o primeiro caractere como último e o último como primeiro).

  Exemplos:

  ```sql
  mysql> SELECT HEX(WEIGHT_STRING(0x007fff LEVEL 1));
  +--------------------------------------+
  | HEX(WEIGHT_STRING(0x007fff LEVEL 1)) |
  +--------------------------------------+
  | 007FFF                               |
  +--------------------------------------+
  ```

  ```sql
  mysql> SELECT HEX(WEIGHT_STRING(0x007fff LEVEL 1 DESC));
  +-------------------------------------------+
  | HEX(WEIGHT_STRING(0x007fff LEVEL 1 DESC)) |
  +-------------------------------------------+
  | FF8000                                    |
  +-------------------------------------------+
  ```

  ```sql
  mysql> SELECT HEX(WEIGHT_STRING(0x007fff LEVEL 1 REVERSE));
  +----------------------------------------------+
  | HEX(WEIGHT_STRING(0x007fff LEVEL 1 REVERSE)) |
  +----------------------------------------------+
  | FF7F00                                       |
  +----------------------------------------------+
  ```

  ```sql
  mysql> SELECT HEX(WEIGHT_STRING(0x007fff LEVEL 1 DESC REVERSE));
  +---------------------------------------------------+
  | HEX(WEIGHT_STRING(0x007fff LEVEL 1 DESC REVERSE)) |
  +---------------------------------------------------+
  | 0080FF                                            |
  +---------------------------------------------------+
  ```

  A cláusula *`flags`* atualmente não é usada.

  Se `WEIGHT_STRING()` for invocado dentro do cliente **mysql**, as strings binárias são exibidas usando notação hexadecimal, dependendo do valor da opção `--binary-as-hex`. Para obter mais informações sobre essa opção, consulte a Seção 4.5.1, “mysql — O cliente de linha de comando do MySQL”.
