## 14.8 Funções e operadores de strings

**Tabela 14.12 Funções e operadores de cadeia**

<table frame="box" rules="all" summary="A reference that lists string functions and operators."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Name</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>ASCII()</code></td> <td>Retorne o valor numérico do caractere mais à esquerda</td> </tr><tr><td><code>BIN()</code></td> <td>Retorne uma string contendo a representação binária de um número</td> </tr><tr><td><code>BIT_LENGTH()</code></td> <td>Retorne o comprimento do argumento em bits</td> </tr><tr><td><code>CHAR()</code></td> <td>Retorne o caractere para cada inteiro passado</td> </tr><tr><td><code>CHAR_LENGTH()</code></td> <td>Retorne o número de caracteres no argumento</td> </tr><tr><td><code>CHARACTER_LENGTH()</code></td> <td>Sinônimo de CHAR_LENGTH()</td> </tr><tr><td><code>CONCAT()</code></td> <td>Retorno da string concatenada</td> </tr><tr><td><code>CONCAT_WS()</code></td> <td>Retorno concatenado com separador</td> </tr><tr><td><code>ELT()</code></td> <td>Retorne a string no número de índice</td> </tr><tr><td><code>EXPORT_SET()</code></td> <td>Retorne uma string onde, para cada bit definido no valor bits, você recebe uma string "on" e, para cada bit não definido, uma string "off".</td> </tr><tr><td><code>FIELD()</code></td> <td>Índice (posição) do primeiro argumento nos argumentos subsequentes</td> </tr><tr><td><code>FIND_IN_SET()</code></td> <td>Índice (posição) do primeiro argumento dentro do segundo argumento</td> </tr><tr><td><code>FORMAT()</code></td> <td>Retorne um número formatado para o número especificado de casas decimais</td> </tr><tr><td><code>FROM_BASE64()</code></td> <td>Decodifique a string codificada em base64 e retorne o resultado</td> </tr><tr><td><code>HEX()</code></td> <td>Representação hexadecimal de valor decimal ou de cadeia</td> </tr><tr><td><code>INSERT()</code></td> <td>Insira subdivisão na posição especificada até o número especificado de caracteres</td> </tr><tr><td><code>INSTR()</code></td> <td>Retorne o índice da primeira ocorrência da subcadeia</td> </tr><tr><td><code>LCASE()</code></td> <td>Sinônimo de LOWER()</td> </tr><tr><td><code>LEFT()</code></td> <td>Retorne o número mais à esquerda de caracteres conforme especificado</td> </tr><tr><td><code>LENGTH()</code></td> <td>Retorne o comprimento de uma string em bytes</td> </tr><tr><td><code>LIKE</code></td> <td>Encontre padrões simples</td> </tr><tr><td><code>LOAD_FILE()</code></td> <td>Carregue o arquivo nomeado</td> </tr><tr><td><code>LOCATE()</code></td> <td>Retorne a posição da primeira ocorrência da subcadeia</td> </tr><tr><td><code>LOWER()</code></td> <td>Retorne o argumento em minúsculas</td> </tr><tr><td><code>LPAD()</code></td> <td>Retorne o argumento de string, preenchido à esquerda com a string especificada</td> </tr><tr><td><code>LTRIM()</code></td> <td>Remova espaços em branco iniciais</td> </tr><tr><td><code>MAKE_SET()</code></td> <td>Retorne um conjunto de strings separadas por vírgula que possuem o bit correspondente definido em bits</td> </tr><tr><td><code>MATCH()</code></td> <td>Realizar uma pesquisa de texto completo</td> </tr><tr><td><code>MID()</code></td> <td>Retorne uma subcadeia que comece a partir da posição especificada</td> </tr><tr><td><code>NOT LIKE</code></td> <td>Negação de correspondência de padrão simples</td> </tr><tr><td><code>NOT REGEXP</code></td> <td>Negación de REGEXP</td> </tr><tr><td><code>OCT()</code></td> <td>Retorne uma string contendo a representação octal de um número</td> </tr><tr><td><code>OCTET_LENGTH()</code></td> <td>Sinônimo de LENGTH()</td> </tr><tr><td><code>ORD()</code></td> <td>Código de caractere de retorno para o caractere mais à esquerda do argumento</td> </tr><tr><td><code>POSITION()</code></td> <td>Sinônimo para LOCATE()</td> </tr><tr><td><code>QUOTE()</code></td> <td>Elimine o argumento para uso em uma declaração SQL</td> </tr><tr><td><code>REGEXP</code></td> <td>Se a cadeia corresponde à expressão regular</td> </tr><tr><td><code>REGEXP_INSTR()</code></td> <td>Índice inicial de correspondência de subcadeia com expressão regular</td> </tr><tr><td><code>REGEXP_LIKE()</code></td> <td>Se a cadeia corresponde à expressão regular</td> </tr><tr><td><code>REGEXP_REPLACE()</code></td> <td>Substitua substratos que correspondem à expressão regular</td> </tr><tr><td><code>REGEXP_SUBSTR()</code></td> <td>Retorne substring que correspondam à expressão regular</td> </tr><tr><td><code>REPEAT()</code></td> <td>Repita uma cadeia o número especificado de vezes</td> </tr><tr><td><code>REPLACE()</code></td> <td>Substitua as ocorrências de uma string especificada</td> </tr><tr><td><code>REVERSE()</code></td> <td>Reverter os caracteres em uma string</td> </tr><tr><td><code>RIGHT()</code></td> <td>Retorne o número especificado de caracteres à direita</td> </tr><tr><td><code>RLIKE</code></td> <td>Se a cadeia corresponde à expressão regular</td> </tr><tr><td><code>RPAD()</code></td> <td>Adicione a string o número especificado de vezes</td> </tr><tr><td><code>RTRIM()</code></td> <td>Remova espaços finais</td> </tr><tr><td><code>SOUNDEX()</code></td> <td>Retorne uma string soundex</td> </tr><tr><td><code>SOUNDS LIKE</code></td> <td>Compare sons</td> </tr><tr><td><code>SPACE()</code></td> <td>Retorne uma cadeia com o número especificado de espaços</td> </tr><tr><td><code>STRCMP()</code></td> <td>Compare duas strings</td> </tr><tr><td><code>SUBSTR()</code></td> <td>Retorne a subcadeia conforme especificado</td> </tr><tr><td><code>SUBSTRING()</code></td> <td>Retorne a subcadeia conforme especificado</td> </tr><tr><td><code>SUBSTRING_INDEX()</code></td> <td>Retorne uma subcadeia de uma string antes do número especificado de ocorrências do delimitador</td> </tr><tr><td><code>TO_BASE64()</code></td> <td>Retorne o argumento convertido em uma string base-64</td> </tr><tr><td><code>TRIM()</code></td> <td>Remova espaços em branco iniciais e finais</td> </tr><tr><td><code>UCASE()</code></td> <td>Sinônimo de UPPER()</td> </tr><tr><td><code>UNHEX()</code></td> <td>Retorne uma string contendo a representação hexadecimal de um número</td> </tr><tr><td><code>UPPER()</code></td> <td>Converta para maiúsculas</td> </tr><tr><td><code>WEIGHT_STRING()</code></td> <td>Devolva a string de peso para uma string</td> </tr></tbody></table>

As funções com valor de cadeia de caracteres retornam `NULL` se o comprimento do resultado fosse maior que o valor da variável de sistema `max_allowed_packet`. Veja a Seção 7.1.1, “Configurando o servidor”.

Para funções que operam em posições de string, a primeira posição é numerada como 1.

Para funções que aceitam argumentos de comprimento, os argumentos não inteiros são arredondados para o número inteiro mais próximo.

* `ASCII(str)`

Retorna o valor numérico do caractere mais à esquerda da string *`str`*. Retorna `0` se *`str`* for uma string vazia. Retorna `NULL` se *`str`* for `NULL`. `ASCII()` funciona para caracteres de 8 bits.

  ```
  mysql> SELECT ASCII('2');
          -> 50
  mysql> SELECT ASCII(2);
          -> 50
  mysql> SELECT ASCII('dx');
          -> 100
  ```

Veja também a função `ORD()`.

* `BIN(N)`

Retorna uma representação em cadeia do valor binário de *`N`*, onde *`N`* é um número longlong (`BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT)). Isso é equivalente a `CONV(N,10,2)`. Retorna `NULL` se *`N`* é `NULL`.

  ```
  mysql> SELECT BIN(12);
          -> '1100'
  ```

* `BIT_LENGTH(str)`

Retorna o comprimento da string *`str`* em bits. Retorna `NULL` se *`str`* for `NULL`.

  ```
  mysql> SELECT BIT_LENGTH('text');
          -> 32
  ```

* `CHAR(N,... [USING charset_name])`(string-functions.html#function_char)

`CHAR()` interpreta cada argumento *`N`* como um inteiro e retorna uma string composta pelos caracteres dados pelos valores de código desses inteiros. Os valores de `NULL` são ignorados.

  ```
  mysql> SELECT CHAR(77,121,83,81,'76');
  +--------------------------------------------------+
  | CHAR(77,121,83,81,'76')                          |
  +--------------------------------------------------+
  | 0x4D7953514C                                     |
  +--------------------------------------------------+
  1 row in set (0.00 sec)

  mysql> SELECT CHAR(77,77.3,'77.3');
  +--------------------------------------------+
  | CHAR(77,77.3,'77.3')                       |
  +--------------------------------------------+
  | 0x4D4D4D                                   |
  +--------------------------------------------+
  1 row in set (0.00 sec)
  ```

Por padrão, `CHAR()` retorna uma string binária. Para produzir uma string em um conjunto de caracteres específico, use a cláusula opcional `USING`:

  ```
  mysql> SELECT CHAR(77,121,83,81,'76' USING utf8mb4);
  +---------------------------------------+
  | CHAR(77,121,83,81,'76' USING utf8mb4) |
  +---------------------------------------+
  | MySQL                                 |
  +---------------------------------------+
  1 row in set (0.00 sec)

  mysql> SELECT CHAR(77,77.3,'77.3' USING utf8mb4);
  +------------------------------------+
  | CHAR(77,77.3,'77.3' USING utf8mb4) |
  +------------------------------------+
  | MMM                                |
  +------------------------------------+
  1 row in set, 1 warning (0.00 sec)

  mysql> SHOW WARNINGS;
  +---------+------+-------------------------------------------+
  | Level   | Code | Message                                   |
  +---------+------+-------------------------------------------+
  | Warning | 1292 | Truncated incorrect INTEGER value: '77.3' |
  +---------+------+-------------------------------------------+
  1 row in set (0.00 sec)
  ```

Se `USING` for fornecido e a string de resultado for ilegal para o conjunto de caracteres fornecido, um aviso é emitido. Além disso, se o modo SQL rigoroso estiver habilitado, o resultado de `CHAR()` se torna `NULL`.

Se `CHAR()` for invocado dentro do cliente **mysql**, as cadeias binárias são exibidas usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O cliente de linha de comando MySQL”.

`CHAR()` argumentos maiores que 255 são convertidos em vários bytes de resultado. Por exemplo, `CHAR(256)` é equivalente a `CHAR(1,0)`, e `CHAR(256*256)` é equivalente a `CHAR(1,0,0)`:

  ```
  mysql> SELECT HEX(CHAR(1,0)), HEX(CHAR(256));
  +----------------+----------------+
  | HEX(CHAR(1,0)) | HEX(CHAR(256)) |
  +----------------+----------------+
  | 0100           | 0100           |
  +----------------+----------------+
  1 row in set (0.00 sec)

  mysql> SELECT HEX(CHAR(1,0,0)), HEX(CHAR(256*256));
  +------------------+--------------------+
  | HEX(CHAR(1,0,0)) | HEX(CHAR(256*256)) |
  +------------------+--------------------+
  | 010000           | 010000             |
  +------------------+--------------------+
  1 row in set (0.00 sec)
  ```

* `CHAR_LENGTH(str)`

Retorna o comprimento da string *`str`*, medido em pontos de código. Um caractere multibyte é considerado um único ponto de código. Isso significa que, para uma string que contém dois caracteres de 3 bytes, `LENGTH()` retorna `6`, enquanto `CHAR_LENGTH()` retorna `2`, como mostrado aqui:

  ```
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

`CHAR_LENGTH()` retorna `NULL` se *`str`* é `NULL`.

* `CHARACTER_LENGTH(str)`

`CHARACTER_LENGTH()` é sinônimo de `CHAR_LENGTH()`.

* `CONCAT(str1,str2,...)`

Retorna a string que resulta da concatenação dos argumentos. Pode ter um ou mais argumentos. Se todos os argumentos forem strings não binárias, o resultado é uma string não binária. Se os argumentos incluem quaisquer strings binárias, o resultado é uma string binária. Um argumento numérico é convertido para sua forma equivalente em string não binária.

`CONCAT()` retorna `NULL` se houver algum argumento em `NULL`.

  ```
  mysql> SELECT CONCAT('My', 'S', 'QL');
          -> 'MySQL'
  mysql> SELECT CONCAT('My', NULL, 'QL');
          -> NULL
  mysql> SELECT CONCAT(14.3);
          -> '14.3'
  ```

Para strings citadas, a concatenação pode ser realizada colocando as strings uma ao lado da outra:

  ```
  mysql> SELECT 'My' 'S' 'QL';
          -> 'MySQL'
  ```

Se `CONCAT()` for invocado dentro do cliente **mysql**, os resultados de cadeia binária são exibidos usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O cliente de linha de comando MySQL”.

* `CONCAT_WS(separator,str1,str2,...)`

`CONCAT_WS()` significa "Concatenar com separador" e é uma forma especial de `CONCAT()`. O primeiro argumento é o separador para os demais argumentos. O separador é adicionado entre as strings a serem concatenadas. O separador pode ser uma string, assim como o restante dos argumentos. Se o separador for `NULL`, o resultado é `NULL`.

  ```
  mysql> SELECT CONCAT_WS(',', 'First name', 'Second name', 'Last Name');
          -> 'First name,Second name,Last Name'
  mysql> SELECT CONCAT_WS(',', 'First name', NULL, 'Last Name');
          -> 'First name,Last Name'
  ```

`CONCAT_WS()` não ignora cadeias de texto vazias. No entanto, ele ignora quaisquer valores de `NULL` após o argumento do separador.

* `ELT(N,str1,str2,str3,...)`

`ELT()` retorna o *`N`*º elemento da lista de strings: *`str1`* se *`N`* = `1`, *`str2`* se *`N`* = `2`, e assim por diante. Retorna `NULL` se *`N`* é menor que `1`, maior que o número de argumentos, ou `NULL`. `ELT()` é o complemento de `FIELD()`.

  ```
  mysql> SELECT ELT(1, 'Aa', 'Bb', 'Cc', 'Dd');
          -> 'Aa'
  mysql> SELECT ELT(4, 'Aa', 'Bb', 'Cc', 'Dd');
          -> 'Dd'
  ```

* `EXPORT_SET(bits,on,off[,separator[,number_of_bits]])`(string-functions.html#function_export-set)

Retorna uma string de tal forma que, para cada bit definido no valor *`bits`*, você recebe uma string *`on`* e, para cada bit não definido no valor, você recebe uma string *`off`*. Os bits em *`bits`* são examinados de direita para esquerda (de bits de menor ordem para bits de maior ordem). As strings são adicionadas ao resultado de esquerda para direita, separadas pela string *`separator`* (o padrão é o caractere vírgula `,`). O número de bits examinados é dado por *`number_of_bits`*, que tem um padrão de 64 se não for especificado. *`number_of_bits`* é clicado silenciosamente para 64 se for maior que 64. É tratado como um inteiro não assinado, então um valor de −1 é efetivamente o mesmo que 64.

  ```
  mysql> SELECT EXPORT_SET(5,'Y','N',',',4);
          -> 'Y,N,Y,N'
  mysql> SELECT EXPORT_SET(6,'1','0',',',10);
          -> '0,1,1,0,0,0,0,0,0,0'
  ```

* `FIELD(str,str1,str2,str3,...)`

Retorna o índice (posição) de *`str`* na lista de *`str1`*, *`str2`*, *`str3`*, *`...`*. Retorna `0` se *`str`* não for encontrado.

Se todos os argumentos de `FIELD()` forem strings, todos os argumentos são comparados como strings. Se todos os argumentos forem números, eles são comparados como números. Caso contrário, os argumentos são comparados como duplos.

Se *`str`* é `NULL`, o valor de retorno é `0`, porque `NULL` não realiza a comparação de igualdade com qualquer valor. `FIELD()` é o complemento de `ELT()`.

  ```
  mysql> SELECT FIELD('Bb', 'Aa', 'Bb', 'Cc', 'Dd', 'Ff');
          -> 2
  mysql> SELECT FIELD('Gg', 'Aa', 'Bb', 'Cc', 'Dd', 'Ff');
          -> 0
  ```

* `FIND_IN_SET(str,strlist)`

Retorna um valor no intervalo de 1 a *`N`* se a string *`str`* estiver na lista de strings *`strlist`* composta por substratos de *`N`*. Uma lista de strings é uma string composta por substratos separados por caracteres `,`. Se o primeiro argumento for uma string constante e o segundo for uma coluna do tipo `SET`, a função `FIND_IN_SET()` é otimizada para usar aritmética de bits. Retorna `0` se *`str`* não estiver em *`strlist`* ou se *`strlist`* for a string vazia. Retorna `NULL` se qualquer um dos argumentos for `NULL`. Esta função não funciona corretamente se o primeiro argumento contiver um caractere de vírgula (`,`).

  ```
  mysql> SELECT FIND_IN_SET('b','a,b,c,d');
          -> 2
  ```

* `FORMAT(X,D[,locale])`

Formata o número *`X`* para um formato como `'#,###,###.##'`, arredondado para *`D`* casas decimais, e retorna o resultado como uma string. Se *`D`* é `0`, o resultado não tem ponto decimal ou parte fracionária. Se *`X`* ou *`D`* é `NULL`, a função retorna `NULL`.

O terceiro parâmetro opcional permite especificar um local a ser usado para o ponto decimal do número do resultado, o separador de milhares e a separação entre os separadores. Os valores de local permitidos são os mesmos dos valores legais para a variável de sistema `lc_time_names` (consulte Seção 12.16, “Suporte de Locale do MySQL Server”). Se o local for `NULL` ou não especificado, o local padrão é `'en_US'`.

  ```
  mysql> SELECT FORMAT(12332.123456, 4);
          -> '12,332.1235'
  mysql> SELECT FORMAT(12332.1,4);
          -> '12,332.1000'
  mysql> SELECT FORMAT(12332.2,0);
          -> '12,332'
  mysql> SELECT FORMAT(12332.2,2,'de_DE');
          -> '12.332,20'
  ```

* `FROM_BASE64(str)`

Toma uma string codificada com as regras de codificação base-64 usadas por `TO_BASE64()` e retorna o resultado decodificado como uma string binária. O resultado é `NULL` se o argumento for `NULL` ou não for uma string válida base-64. Veja a descrição de `TO_BASE64()` para detalhes sobre as regras de codificação e decodificação.

  ```
  mysql> SELECT TO_BASE64('abc'), FROM_BASE64(TO_BASE64('abc'));
          -> 'JWJj', 'abc'
  ```

Se `FROM_BASE64()` for invocado dentro do cliente **mysql**, as cadeias binárias são exibidas usando notação hexadecimal. Você pode desabilitar esse comportamento definindo o valor de `--binary-as-hex` para `0` ao iniciar o cliente **mysql**. Para mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O cliente de linha de comando MySQL”.

* `HEX(str)`, `HEX(N)`

Para um argumento de cadeia *`str`*, `HEX()` retorna uma representação hexadecimal da cadeia *`str`* onde cada byte de cada caractere em *`str`* é convertido em dois dígitos hexadecimais. (Caracteres multibyte, portanto, se tornam mais do que dois dígitos.) A operação inversa é realizada pela função `UNHEX()`.

Para um argumento numérico *`N`*, `HEX()` retorna uma representação em cadeia hexadecimal da representação do valor de *`N`* tratado como um número de tipo longlong (`BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT)). Isso é equivalente a `CONV(N,10,16)`. A operação inversa é realizada por `CONV(HEX(N),16,10)`.

Para um argumento `NULL`, esta função retorna `NULL`.

  ```
  mysql> SELECT X'616263', HEX('abc'), UNHEX(HEX('abc'));
          -> 'abc', 616263, 'abc'
  mysql> SELECT HEX(255), CONV(HEX(255),16,10);
          -> 'FF', 255
  ```

* `INSERT(str,pos,len,newstr)`

Retorna a string *`str`*, com a subcadeia que começa na posição *`pos`* e tem *`len`* caracteres de comprimento substituída pela string *`newstr`*. Retorna a string original se *`pos`* não estiver dentro do comprimento da string. Substitui o resto da string a partir da posição *`pos`* se *`len`* não estiver dentro do comprimento do resto da string. Retorna *`NULL`* se qualquer argumento for *`NULL`*.

  ```
  mysql> SELECT INSERT('Quadratic', 3, 4, 'What');
          -> 'QuWhattic'
  mysql> SELECT INSERT('Quadratic', -1, 4, 'What');
          -> 'Quadratic'
  mysql> SELECT INSERT('Quadratic', 3, 100, 'What');
          -> 'QuWhat'
  ```

Essa função é segura para multibytes.

* `INSTR(str,substr)`

Retorna a posição da primeira ocorrência da subcadeia *`substr`* na cadeia *`str`*. Isso é o mesmo que a forma de dois argumentos do `LOCATE()`, exceto que a ordem dos argumentos é invertida.

  ```
  mysql> SELECT INSTR('foobarbar', 'bar');
          -> 4
  mysql> SELECT INSTR('xbar', 'foobar');
          -> 0
  ```

Essa função é segura para multibytes e é sensível ao caso apenas se pelo menos um argumento for uma string binária. Se qualquer argumento for `NULL`, essa função retorna `NULL`.

* `LCASE(str)`

`LCASE()` é sinônimo de `LOWER()`.

`LCASE()` usado em uma visualização é reescrito como `LOWER()` ao armazenar a definição da visualização. (Bug #12844279)

* `LEFT(str,len)`

Retorna os caracteres *`len`* mais à esquerda da string *`str`*, ou `NULL` se houver algum argumento como `NULL`.

  ```
  mysql> SELECT LEFT('foobarbar', 5);
          -> 'fooba'
  ```

Essa função é segura para multibytes.

* `LENGTH(str)`

Retorna o comprimento da string *`str`*, medido em bytes. Um caractere multibyte é contado como múltiplos bytes. Isso significa que, para uma string que contém cinco caracteres de 2 bytes, `LENGTH()` retorna `10`, enquanto `CHAR_LENGTH()` retorna `5`. Retorna `NULL` se *`str`* é `NULL`.

  ```
  mysql> SELECT LENGTH('text');
          -> 4
  ```

Nota

A função espacial `Length()` OpenGIS é denominada `ST_Length()` no MySQL.

* `LOAD_FILE(file_name)`

Leitura do arquivo e retorno dos conteúdos do arquivo como uma string. Para usar esta função, o arquivo deve estar localizado no host do servidor, você deve especificar o nome completo do caminho do arquivo e deve ter o privilégio `FILE`. O arquivo deve ser legível pelo servidor e seu tamanho deve ser menor que `max_allowed_packet` bytes. Se a variável de sistema `secure_file_priv` estiver definida como um nome de diretório não vazio, o arquivo a ser carregado deve estar localizado nesse diretório. (Antes do MySQL 8.0.17, o arquivo deve ser legível por todos, não apenas legível pelo servidor.)

Se o arquivo não existir ou não puder ser lido porque uma das condições anteriores não for atendida, a função retorna `NULL`.

A variável de sistema `character_set_filesystem` controla a interpretação dos nomes de arquivos que são fornecidos como strings literais.

  ```
  mysql> UPDATE t
              SET blob_col=LOAD_FILE('/tmp/picture')
              WHERE id=1;
  ```

* `LOCATE(substr,str)`, `LOCATE(substr,str,pos)`

A primeira sintaxe retorna a posição da primeira ocorrência da subcadeia *`substr`* na cadeia *`str`*. A segunda sintaxe retorna a posição da primeira ocorrência da subcadeia *`substr`* na cadeia *`str`*, começando na posição *`pos`*. Retorna `0` se *`substr`* não estiver em *`str`*. Retorna `NULL` se qualquer argumento for `NULL`.

  ```
  mysql> SELECT LOCATE('bar', 'foobarbar');
          -> 4
  mysql> SELECT LOCATE('xbar', 'foobar');
          -> 0
  mysql> SELECT LOCATE('bar', 'foobarbar', 5);
          -> 7
  ```

Essa função é segura para multibytes e é sensível ao caso apenas se pelo menos um argumento for uma string binária.

* `LOWER(str)`

Retorna a string *`str`* com todos os caracteres alterados para minúsculas de acordo com o mapeamento atual do conjunto de caracteres, ou `NULL` se *`str`* for `NULL`. O conjunto de caracteres padrão é `utf8mb4`.

  ```
  mysql> SELECT LOWER('QUADRATICALLY');
          -> 'quadratically'
  ```

`LOWER()` (e `UPPER()`) são ineficazes quando aplicados a strings binárias (`BINARY`, `VARBINARY`, `BLOB`). Para realizar a conversão de maiúsculas e minúsculas de uma string binária, primeiro converta-a em uma string não binária usando um conjunto de caracteres apropriado para os dados armazenados na string:

  ```
  mysql> SET @str = BINARY 'New York';
  mysql> SELECT LOWER(@str), LOWER(CONVERT(@str USING utf8mb4));
  +-------------+------------------------------------+
  | LOWER(@str) | LOWER(CONVERT(@str USING utf8mb4)) |
  +-------------+------------------------------------+
  | New York    | new york                           |
  +-------------+------------------------------------+
  ```

Para coletas de conjuntos de caracteres Unicode, `LOWER()` e `UPPER()` funcionam de acordo com o Algoritmo de Cotação Unicode (UCA) na versão do nome da cotação, se houver uma, e UCA 4.0.0 se nenhuma versão for especificada. Por exemplo, `utf8mb4_0900_ai_ci` e `utf8mb3_unicode_520_ci` funcionam de acordo com UCA 9.0.0 e 5.2.0, respectivamente, enquanto `utf8mb3_unicode_ci` funciona de acordo com UCA 4.0.0. Veja a Seção 12.10.1, “Conjunto de Caracteres Unicode”.

Essa função é segura para multibytes.

`LCASE()` usado dentro de visualizações é reescrito como `LOWER()`.

* `LPAD(str,len,padstr)`

Retorna a string *`str`*, preenchida com a string *`padstr`* até um comprimento de *`len`* caracteres. Se *`str`* for mais longo que *`len`*, o valor de retorno é encurtado para *`len`* caracteres.

  ```
  mysql> SELECT LPAD('hi',4,'??');
          -> '??hi'
  mysql> SELECT LPAD('hi',1,'??');
          -> 'h'
  ```

Retorna `NULL` se qualquer um de seus argumentos for `NULL`.

* `LTRIM(str)`

Retorna a string *`str`* com os caracteres de espaço inicial removidos. Retorna `NULL` se *`str`* é `NULL`.

  ```
  mysql> SELECT LTRIM('  barbar');
          -> 'barbar'
  ```

Essa função é segura para multibytes.

* `MAKE_SET(bits,str1,str2,...)`

Retorna um conjunto de valores (uma string contendo substratos separados por caracteres `,`) composto pelas strings que têm o bit correspondente em *`bits`* definido. *`str1`* corresponde ao bit 0, *`str2`* ao bit 1, e assim por diante. Os valores de `NULL` em *`str1`*, *`str2`*, `...` não são anexados ao resultado.

  ```
  mysql> SELECT MAKE_SET(1,'a','b','c');
          -> 'a'
  mysql> SELECT MAKE_SET(1 | 4,'hello','nice','world');
          -> 'hello,world'
  mysql> SELECT MAKE_SET(1 | 4,'hello','nice',NULL,'world');
          -> 'hello'
  mysql> SELECT MAKE_SET(0,'a','b','c');
          -> ''
  ```

* `MID(str,pos)`, `MID(str FROM pos)` (string-functions.html#function_mid), `MID(str,pos,len)`, `MID(str FROM pos FOR len)` (string-functions.html#function_mid)

`MID(str,pos,len)` é sinônimo de `SUBSTRING(str,pos,len)`.

* `OCT(N)`

Retorna uma representação em cadeia do valor octal de *`N`*, onde *`N`* é um número long (`BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT)). Isso é equivalente a `CONV(N,10,8)`. Retorna `NULL` se *`N`* é `NULL`.

  ```
  mysql> SELECT OCT(12);
          -> '14'
  ```

* `OCTET_LENGTH(str)`

`OCTET_LENGTH()` é sinônimo de `LENGTH()`.

* `ORD(str)`

Se o caractere mais à esquerda da string *`str`* for um caractere multibyte, retorne o código desse caractere, calculado a partir dos valores numéricos de seus bytes constituintes, usando esta fórmula:

  ```
    (1st byte code)
  + (2nd byte code * 256)
  + (3rd byte code * 256^2) ...
  ```

Se o caractere mais à esquerda não for um caractere multibyte, `ORD()` retorna o mesmo valor que a função `ASCII()`. A função retorna `NULL` se *`str`* é `NULL`.

  ```
  mysql> SELECT ORD('2');
          -> 50
  ```

* `POSITION(substr IN str)`(string-functions.html#function_position)

`POSITION(substr IN str)`](string-functions.html#function_position) é sinônimo de `LOCATE(substr,str)`.

* `QUOTE(str)`

Cita uma cadeia para produzir um resultado que pode ser usado como um valor de dados devidamente escapado em uma declaração SQL. A cadeia é devolvida entre aspas simples e com cada instância de barra invertida (`\`), aspas simples (`'`), ASCII `NUL` e Ctrl+Z precedida por uma barra invertida. Se o argumento for `NULL`, o valor de retorno é a palavra “NULL” sem as aspas simples envolvendo.

  ```
  mysql> SELECT QUOTE('Don\'t!');
          -> 'Don\'t!'
  mysql> SELECT QUOTE(NULL);
          -> NULL
  ```

Para comparação, veja as regras de citação para strings literais e dentro da API C na Seção 11.1.1, “Strings Literals”, e mysql_real_escape_string_quote().

* `REPEAT(str,count)`

Retorna uma string composta pela string *`str`* repetida *`count`* vezes. Se *`count`* for menor que 1, retorna uma string vazia. Retorna `NULL` se *`str`* ou *`count`* for `NULL`.

  ```
  mysql> SELECT REPEAT('MySQL', 3);
          -> 'MySQLMySQLMySQL'
  ```

* `REPLACE(str,from_str,to_str)`

Retorna a string *`str`* com todas as ocorrências da string *`from_str`* substituídas pela string *`to_str`*. `REPLACE()` realiza uma correspondência sensível ao caso quando procura *`from_str`*.

  ```
  mysql> SELECT REPLACE('www.mysql.com', 'w', 'Ww');
          -> 'WwWwWw.mysql.com'
  ```

Essa função é segura para multibytes. Ela retorna `NULL` se qualquer um de seus argumentos for `NULL`.

* `REVERSE(str)`

Retorna a string *`str`* com a ordem dos caracteres invertida, ou `NULL` se *`str`* é `NULL`.

  ```
  mysql> SELECT REVERSE('abc');
          -> 'cba'
  ```

Essa função é segura para multibytes.

* `RIGHT(str,len)`

Retorna os caracteres mais à direita do *`len`* da string *`str`*, ou `NULL` se algum argumento for `NULL`.

  ```
  mysql> SELECT RIGHT('foobarbar', 4);
          -> 'rbar'
  ```

Essa função é segura para multibytes.

* `RPAD(str,len,padstr)`

Retorna a string *`str`*, preenchida com a string *`padstr`* até um comprimento de *`len`* caracteres. Se *`str`* for mais longo que *`len`*, o valor de retorno é encurtado para *`len`* caracteres. Se *`str`*, *`padstr`*, ou *`len`* for `NULL`, a função retorna *`NULL`*.

  ```
  mysql> SELECT RPAD('hi',5,'?');
          -> 'hi???'
  mysql> SELECT RPAD('hi',1,'?');
          -> 'h'
  ```

Essa função é segura para multibytes.

* `RTRIM(str)`

Retorna a string *`str`* com os caracteres de espaço em branco finais removidos.

  ```
  mysql> SELECT RTRIM('barbar   ');
          -> 'barbar'
  ```

Essa função é segura para multibytes e retorna `NULL` se *`str`* é `NULL`.

* `SOUNDEX(str)`

Retorna uma string de soundex de *`str`*, ou `NULL` se *`str`* for `NULL`. Duas strings que soam quase iguais devem ter strings de soundex idênticas. Uma string padrão de soundex tem quatro caracteres, mas a função `SOUNDEX()` retorna uma string arbitrariamente longa. Você pode usar `SUBSTRING()` no resultado para obter uma string de soundex padrão. Todos os caracteres não alfabéticos em *`str`* são ignorados. Todos os caracteres alfabéticos internacionais fora da faixa A-Z são tratados como vogais.

Importante

Ao usar `SOUNDEX()`, você deve estar ciente das seguintes limitações:

+ Essa função, conforme implementada atualmente, é destinada a funcionar bem com strings que estão apenas no idioma inglês. Strings em outros idiomas podem não produzir resultados confiáveis.

+ Esta função não é garantida para fornecer resultados consistentes com strings que utilizam conjuntos de caracteres multibyte, incluindo `utf-8`. Consulte o Bug #22638 para mais informações.

  ```
  mysql> SELECT SOUNDEX('Hello');
          -> 'H400'
  mysql> SELECT SOUNDEX('Quadratically');
          -> 'Q36324'
  ```

Nota

Essa função implementa o algoritmo original Soundex, não a versão aprimorada mais popular (também descrita por D. Knuth). A diferença é que a versão original descarta as vogais primeiro e os duplicados em segundo lugar, enquanto a versão aprimorada descarta os duplicados primeiro e as vogais em segundo lugar.

* `expr1 SOUNDS LIKE expr2`(string-functions.html#operator_sounds-like)

Isto é o mesmo que `SOUNDEX(expr1) = SOUNDEX(expr2)`(string-functions.html#function_soundex).

* `SPACE(N)`

Retorna uma string composta por caracteres de espaço *`N`*, ou `NULL`, se *`N`* for `NULL`.

  ```
  mysql> SELECT SPACE(6);
          -> '      '
  ```

* `SUBSTR(str,pos)`, `SUBSTR(str FROM pos)`[(string-functions.html#function_substr)]], `SUBSTR(str,pos,len)`, [`SUBSTR(str FROM pos FOR len)`][(string-functions.html#function_substr)]

`SUBSTR()` é sinônimo de `SUBSTRING()`.

* `SUBSTRING(str,pos)`, `SUBSTRING(str FROM pos)`[(string-functions.html#function_substring)]], `SUBSTRING(str,pos,len)`, `SUBSTRING(str FROM pos FOR len)`[(string-functions.html#function_substring)]

Os formulários sem o argumento *`len`* retornam uma subcadeia da string *`str`* a partir da posição *`pos`*. Os formulários com o argumento *`len`* retornam uma subcadeia de *`len`* caracteres de comprimento a partir da string *`str`*, a partir da posição *`pos`*. Os formulários que usam `FROM` são a sintaxe padrão do SQL. Também é possível usar um valor negativo para *`pos`*. Neste caso, o início da subcadeia é *`pos`* caracteres a partir do final da string, em vez do início. Um valor negativo pode ser usado para *`pos`* em qualquer uma das formas desta função. Um valor de 0 para *`pos`* retorna uma string vazia.

Para todas as formas de `SUBSTRING()`, a posição do primeiro caractere na cadeia a partir da qual a subcadeia deve ser extraída é considerada como `1`.

  ```
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

Essa função é segura para multibytes. Ela retorna `NULL` se qualquer um de seus argumentos for `NULL`.

Se *`len`* for menor que 1, o resultado é a string vazia.

* `SUBSTRING_INDEX(str,delim,count)`

Retorna a subcadeia da string *`str`* antes das ocorrências do delimitador *`delim`* na string. Se *`count`* for positivo, tudo à esquerda do delimitador final (contando da esquerda para a direita) é retornado. Se *`count`* for negativo, tudo à direita do delimitador final (contando da direita para a esquerda) é retornado. `SUBSTRING_INDEX()` realiza uma correspondência sensível ao caso quando procura por *`delim`*.

  ```
  mysql> SELECT SUBSTRING_INDEX('www.mysql.com', '.', 2);
          -> 'www.mysql'
  mysql> SELECT SUBSTRING_INDEX('www.mysql.com', '.', -2);
          -> 'mysql.com'
  ```

Essa função é segura para multibytes.

`SUBSTRING_INDEX()` retorna `NULL` se qualquer um de seus argumentos for `NULL`.

* `TO_BASE64(str)`

Converte o argumento de cadeia de caracteres para a forma codificada em base-64 e retorna o resultado como uma cadeia de caracteres com o conjunto de caracteres de conexão e a ordenação. Se o argumento não for uma cadeia de caracteres, ele é convertido em uma cadeia de caracteres antes da conversão ocorrer. O resultado é `NULL` se o argumento for `NULL`. As cadeias de caracteres codificadas em base-64 podem ser decodificadas usando a função `FROM_BASE64()`.

  ```
  mysql> SELECT TO_BASE64('abc'), FROM_BASE64(TO_BASE64('abc'));
          -> 'JWJj', 'abc'
  ```

Existem diferentes esquemas de codificação base-64. São as regras de codificação e decodificação utilizadas pelo `TO_BASE64()` e `FROM_BASE64()`:

+ O codificação para o valor alfabético 62 é `'+'`.

+ O codificação para o valor alfabético 63 é `'/'`.

+ A saída codificada consiste em grupos de 4 caracteres imprimíveis. Cada 3 bytes dos dados de entrada são codificados usando 4 caracteres. Se o último grupo estiver incompleto, ele é preenchido com caracteres `'='` até atingir uma extensão de 4.

+ Uma nova linha é adicionada após cada 76 caracteres de saída codificada para dividir a saída longa em várias linhas.

+ O Decoding reconhece e ignora nova linha, retorno de carro, tabulação e espaço.

* `TRIM([{BOTH | LEADING | TRAILING} [remstr] FROM] str)`](string-functions.html#function_trim), [`TRIM([remstr FROM] str)`](string-functions.html#function_trim)

Retorna a string *`str`* com todos os prefixos ou sufixos de *`remstr`* removidos. Se nenhum dos especificadores `BOTH`, `LEADING` ou `TRAILING` for fornecido, `BOTH` é assumido. *`remstr`* é opcional e, se não especificado, os espaços são removidos.

  ```
  mysql> SELECT TRIM('  bar   ');
          -> 'bar'
  mysql> SELECT TRIM(LEADING 'x' FROM 'xxxbarxxx');
          -> 'barxxx'
  mysql> SELECT TRIM(BOTH 'x' FROM 'xxxbarxxx');
          -> 'bar'
  mysql> SELECT TRIM(TRAILING 'xyz' FROM 'barxxyz');
          -> 'barx'
  ```

Essa função é segura para multibytes. Ela retorna `NULL` se qualquer um de seus argumentos for `NULL`.

* `UCASE(str)`

`UCASE()` é sinônimo de `UPPER()`.

`UCASE()` usado em visualizações é reescrito como `UPPER()`.

* `UNHEX(str)`

Para um argumento de string *`str`*, `UNHEX(str)` interpreta cada par de caracteres no argumento como um número hexadecimal e o converte para o byte representado pelo número. O valor de retorno é uma string binária.

  ```
  mysql> SELECT UNHEX('4D7953514C');
          -> 'MySQL'
  mysql> SELECT X'4D7953514C';
          -> 'MySQL'
  mysql> SELECT UNHEX(HEX('string'));
          -> 'string'
  mysql> SELECT HEX(UNHEX('1267'));
          -> '1267'
  ```

Os caracteres na string de argumento devem ser dígitos hexadecimais válidos: `'0'` .. `'9'`, `'A'` .. `'F'`, `'a'` .. `'f'`. Se o argumento contiver quaisquer dígitos não hexadecimais ou for ele mesmo `NULL`, o resultado é `NULL`:

  ```
  mysql> SELECT UNHEX('GG');
  +-------------+
  | UNHEX('GG') |
  +-------------+
  | NULL        |
  +-------------+

  mysql> SELECT UNHEX(NULL);
  +-------------+
  | UNHEX(NULL) |
  +-------------+
  | NULL        |
  +-------------+
  ```

Um resultado de `NULL` também pode ocorrer se o argumento de `UNHEX()` for uma coluna de `BINARY`, porque os valores são preenchidos com `0x00` bytes ao serem armazenados, mas esses bytes não são removidos na recuperação. Por exemplo, `'41'` é armazenado em uma coluna de `CHAR(3)` como `'41 '` e recuperado como `'41'` (com o espaço de preenchimento final removido), então `UNHEX()` para o valor da coluna retorna `X'41'`. Em contraste, `'41'` é armazenado em uma coluna de `BINARY(3)` como `'41\0'` e recuperado como `'41\0'` (com o byte de preenchimento final `0x00` não removido). `'\0'` não é um dígito hexadecimal legal, então `UNHEX()` para o valor da coluna retorna `NULL`.

Para um argumento numérico *`N`*, o inverso de `HEX(N)` não é realizado por `UNHEX()`. Use `CONV(HEX(N),16,10)` em vez disso. Veja a descrição de `HEX()`.

Se `UNHEX()` for invocado dentro do cliente **mysql**, as cadeias binárias são exibidas usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O cliente de linha de comando MySQL”.

* `UPPER(str)`

Retorna a string *`str`* com todos os caracteres alterados para maiúsculas de acordo com o mapeamento atual do conjunto de caracteres, ou `NULL` se *`str`* for `NULL`. O conjunto de caracteres padrão é `utf8mb4`.

  ```
  mysql> SELECT UPPER('Hej');
          -> 'HEJ'
  ```

Consulte a descrição de `LOWER()` para obter informações que também se aplicam a `UPPER()`. Isso incluiu informações sobre como realizar a conversão de maiúsculas e minúsculas de strings binárias (`BINARY`, `VARBINARY`, `BLOB`) para as quais essas funções são ineficazes, e informações sobre dobramento de caso para conjuntos de caracteres Unicode.

Essa função é segura para multibytes.

`UCASE()` usado em visualizações é reescrito como `UPPER()`.

* `WEIGHT_STRING(str [AS {CHAR|BINARY}(N)] [flags])`(string-functions.html#function_weight-string)

Essa função retorna a string de peso para a string de entrada. O valor de retorno é uma string binária que representa o valor de comparação e ordenação da string, ou `NULL` se o argumento for `NULL`. Possui essas propriedades:

+ Se `WEIGHT_STRING(str1)` = `WEIGHT_STRING(str2)`, então `str1 = str2` (*`str1`* e *`str2`* são considerados iguais)

+ Se `WEIGHT_STRING(str1)` < `WEIGHT_STRING(str2)`, então `str1 < str2` (*`str1`* ordena antes de *`str2`*)

`WEIGHT_STRING()` é uma função de depuração destinada ao uso interno. Seu comportamento pode mudar sem aviso entre as versões do MySQL. Ela pode ser usada para testar e depurar colatinas, especialmente se você estiver adicionando uma nova cotação. Veja a Seção 12.14, “Adicionando uma cotação a um conjunto de caracteres”.

Esta lista resume brevemente os argumentos. Mais detalhes são dados na discussão que segue a lista.

+ *`str`*: A expressão da string de entrada.

+ `AS` cláusula: Opcional; transfira a string de entrada para um tipo e comprimento determinados.

+ *`flags`*: Opcional; não utilizado.

A string de entrada, *`str`*, é uma expressão de string. Se a entrada for uma string não binária (caractere), como `CHAR`, `VARCHAR` ou `TEXT`, o valor de retorno contém os pesos de ordenação para a string. Se a entrada for uma string binária (byte), como `BINARY`, `VARBINARY` ou `BLOB`, o valor de retorno é o mesmo que a entrada (o peso de cada byte em uma string binária é o valor do byte). Se a entrada for `NULL`, `WEIGHT_STRING()` retorna `NULL`.

Exemplos:

  ```
  mysql> SET @s = _utf8mb4 'AB' COLLATE utf8mb4_0900_ai_ci;
  mysql> SELECT @s, HEX(@s), HEX(WEIGHT_STRING(@s));
  +------+---------+------------------------+
  | @s   | HEX(@s) | HEX(WEIGHT_STRING(@s)) |
  +------+---------+------------------------+
  | AB   | 4142    | 1C471C60               |
  +------+---------+------------------------+
  ```

  ```
  mysql> SET @s = _utf8mb4 'ab' COLLATE utf8mb4_0900_ai_ci;
  mysql> SELECT @s, HEX(@s), HEX(WEIGHT_STRING(@s));
  +------+---------+------------------------+
  | @s   | HEX(@s) | HEX(WEIGHT_STRING(@s)) |
  +------+---------+------------------------+
  | ab   | 6162    | 1C471C60               |
  +------+---------+------------------------+
  ```

  ```
  mysql> SET @s = CAST('AB' AS BINARY);
  mysql> SELECT @s, HEX(@s), HEX(WEIGHT_STRING(@s));
  +------+---------+------------------------+
  | @s   | HEX(@s) | HEX(WEIGHT_STRING(@s)) |
  +------+---------+------------------------+
  | AB   | 4142    | 4142                   |
  +------+---------+------------------------+
  ```

  ```
  mysql> SET @s = CAST('ab' AS BINARY);
  mysql> SELECT @s, HEX(@s), HEX(WEIGHT_STRING(@s));
  +------+---------+------------------------+
  | @s   | HEX(@s) | HEX(WEIGHT_STRING(@s)) |
  +------+---------+------------------------+
  | ab   | 6162    | 6162                   |
  +------+---------+------------------------+
  ```

Os exemplos anteriores usam `HEX()` para exibir o resultado de `WEIGHT_STRING()`. Como o resultado é um valor binário, `HEX()` pode ser especialmente útil quando o resultado contém valores não imprimíveis, para exibí-lo em forma imprimível:

  ```
  mysql> SET @s = CONVERT(X'C39F' USING utf8mb4) COLLATE utf8mb4_czech_ci;
  mysql> SELECT HEX(WEIGHT_STRING(@s));
  +------------------------+
  | HEX(WEIGHT_STRING(@s)) |
  +------------------------+
  | 0FEA0FEA               |
  +------------------------+
  ```

Para valores de retorno não `NULL`, o tipo de dados do valor é `VARBINARY` se sua extensão estiver dentro do comprimento máximo para `VARBINARY`, caso contrário, o tipo de dados é `BLOB`.

A cláusula `AS` pode ser usada para converter a string de entrada em uma string não binária ou binária e para forçá-la a um comprimento dado:

+ `AS CHAR(N)` converte a cadeia de caracteres em uma cadeia não binária e a preenche à direita com espaços até uma extensão de *`N`* caracteres. *`N`* deve ser pelo menos 1. Se *`N`* for menor que a extensão da cadeia de caracteres de entrada, a cadeia de caracteres é truncada até *`N`* caracteres. Não há aviso para o corte.

+ `AS BINARY(N)` é semelhante, mas converte a string em uma string binária, *`N`* é medido em bytes (não em caracteres), e o preenchimento usa `0x00` bytes (não espaços).

  ```
  mysql> SET NAMES 'latin1';
  mysql> SELECT HEX(WEIGHT_STRING('ab' AS CHAR(4)));
  +-------------------------------------+
  | HEX(WEIGHT_STRING('ab' AS CHAR(4))) |
  +-------------------------------------+
  | 41422020                            |
  +-------------------------------------+
  mysql> SET NAMES 'utf8mb4';
  mysql> SELECT HEX(WEIGHT_STRING('ab' AS CHAR(4)));
  +-------------------------------------+
  | HEX(WEIGHT_STRING('ab' AS CHAR(4))) |
  +-------------------------------------+
  | 1C471C60                            |
  +-------------------------------------+
  ```

  ```
  mysql> SELECT HEX(WEIGHT_STRING('ab' AS BINARY(4)));
  +---------------------------------------+
  | HEX(WEIGHT_STRING('ab' AS BINARY(4))) |
  +---------------------------------------+
  | 61620000                              |
  +---------------------------------------+
  ```

A cláusula *`flags`* atualmente não é utilizada.

Se `WEIGHT_STRING()` for invocado dentro do cliente **mysql**, as cadeias binárias são exibidas usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O cliente de linha de comando MySQL”.

### 14.8.1 Funções e operadores de comparação de strings

**Tabela 14.13 Funções e operadores de comparação de strings**

<table frame="box" rules="all" summary="A reference that lists string comparison functions and operators."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Name</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>LIKE</code></td> <td>Encontre padrões simples</td> </tr><tr><td><code>NOT LIKE</code></td> <td>Negação de correspondência de padrão simples</td> </tr><tr><td><code>STRCMP()</code></td> <td>Compare duas strings</td> </tr></tbody></table>

Se uma função de cadeia receber uma cadeia binária como argumento, a cadeia resultante também será uma cadeia binária. Um número convertido em uma cadeia é tratado como uma cadeia binária. Isso afeta apenas as comparações.

Normalmente, se qualquer expressão em uma comparação de string for sensível ao caso, a comparação é realizada de forma sensível ao caso.

Se uma função de cadeia for invocada dentro do cliente **mysql**, as cadeias binárias são exibidas usando notação hexadecimal, dependendo do valor do `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O cliente de linha de comando MySQL”.

* `expr LIKE pat [ESCAPE 'escape_char']`(string-comparison-functions.html#operator_like)

Contagem de padrões usando um padrão SQL. Retorna `1` (`TRUE`) ou `0` (`FALSE`). Se algum de *`expr`* ou *`pat`* for `NULL`, o resultado é `NULL`.

O padrão não precisa ser uma string literal. Por exemplo, ele pode ser especificado como uma expressão de string ou coluna de tabela. Neste último caso, a coluna deve ser definida como um dos tipos de dados de string do MySQL (consulte a Seção 13.3, “Tipos de dados de string”).

De acordo com o padrão SQL, `LIKE` realiza a correspondência por caractere, portanto, pode produzir resultados diferentes da comparação operador `=`:

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

Em particular, os espaços finais são sempre significativos. Isso difere das comparações realizadas com o operador `=`, para as quais a importância dos espaços finais em strings não binárias (os valores `CHAR`, `VARCHAR` e `TEXT`) depende do atributo de preenchimento da collation utilizada para a comparação. Para mais informações, consulte o tratamento de espaços finais em comparações.

Com `LIKE`, você pode usar os seguintes dois caracteres curinga no padrão:

+ `%` corresponde a qualquer número de caracteres, mesmo zero caracteres.

+ `_` corresponde exatamente a um caractere.

  ```
  mysql> SELECT 'David!' LIKE 'David_';
          -> 1
  mysql> SELECT 'David!' LIKE '%D%v%';
          -> 1
  ```

Para testar instâncias literais de um caractere comodínio, anteceda-o pelo caractere de escape. Se você não especificar o caractere `ESCAPE`, assume-se `\`, a menos que o modo SQL `NO_BACKSLASH_ESCAPES` esteja habilitado. Nesse caso, nenhum caractere de escape é usado.

+ `\%` corresponde a um caractere de `%`.

+ `_` corresponde a um caractere de `_`.

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

A sequência de escape deve ter um único caractere para especificar o caractere de escape, ou deve ser vazia para especificar que nenhum caractere de escape é usado. A expressão deve ser avaliada como uma constante no momento da execução. Se o modo `NO_BACKSLASH_ESCAPES` SQL estiver habilitado, a sequência não pode ser vazia.

As seguintes declarações ilustram que as comparações de cadeias não são sensíveis ao caso, a menos que uma das operações seja sensível ao caso (utilize uma collation sensível ao caso ou seja uma cadeia binária):

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

No caso de tais situações, o MySQL tenta realizar a conversão implícita da expressão em uma string. Veja a Seção 14.3, “Conversão de Tipo na Avaliação da Expressão”.

Nota

O MySQL utiliza a sintaxe de escape C em strings (por exemplo, `\n` para representar o caractere de nova linha). Se você deseja que uma string `LIKE` contenha um literal `\`, você deve duplicá-la. (A menos que o modo SQL `NO_BACKSLASH_ESCAPES` esteja habilitado, nesse caso, nenhum caractere de escape é usado.) Por exemplo, para procurar `\n`, especifique-o como `\\n`. Para procurar `\`, especifique-o como `\\\\`; isso ocorre porque os traços são removidos uma vez pelo analisador e novamente quando a correspondência do padrão é feita, deixando um único traço para ser correspondido.

Exceção: No final da string de padrão, a barra invertida pode ser especificada como `\\`. No final da string, a barra invertida representa a si mesma porque não há nada a seguir para escapar. Suponha que uma tabela contenha os seguintes valores:

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

Para testar valores que terminam com barra invertida, você pode combinar os valores usando qualquer um dos seguintes padrões:

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

* `expr NOT LIKE pat [ESCAPE 'escape_char']`(string-comparison-functions.html#operator_not-like)

Isto é o mesmo que `NOT (expr LIKE pat [ESCAPE 'escape_char'])`.

Nota

Consultas agregadas que envolvem comparações `NOT LIKE` com colunas que contêm `NULL` podem gerar resultados inesperados. Por exemplo, considere a tabela e os dados a seguir:

  ```
  CREATE TABLE foo (bar VARCHAR(10));

  INSERT INTO foo VALUES (NULL), (NULL);
  ```

A consulta `SELECT COUNT(*) FROM foo WHERE bar LIKE '%baz%';` retorna `0`. Você pode supor que `SELECT COUNT(*) FROM foo WHERE bar NOT LIKE '%baz%';` retornaria `2`. No entanto, isso não é o caso: a segunda consulta retorna `0`. Isso ocorre porque `NULL NOT LIKE expr` sempre retorna `NULL`, independentemente do valor de *`expr`*. O mesmo vale para consultas agregadas que envolvem `NULL` e comparações usando [`NOT RLIKE`](regexp.html#operator_not-regexp) ou [`NOT REGEXP`](regexp.html#operator_not-regexp). Nesses casos, você deve testar explicitamente para `NOT NULL` usando `OR` (e não `AND`), como mostrado aqui:

  ```
  SELECT COUNT(*) FROM foo WHERE bar NOT LIKE '%baz%' OR bar IS NULL;
  ```

* `STRCMP(expr1,expr2)`

`STRCMP()` retorna `0` se as cadeias de caracteres forem iguais, `-1` se o primeiro argumento for menor que o segundo de acordo com a ordem de classificação atual, e `NULL` se qualquer um dos argumentos for `NULL`. Retorna `1` caso contrário.

  ```
  mysql> SELECT STRCMP('text', 'text2');
          -> -1
  mysql> SELECT STRCMP('text2', 'text');
          -> 1
  mysql> SELECT STRCMP('text', 'text');
          -> 0
  ```

`STRCMP()` realiza a comparação usando a collation dos argumentos.

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

Se as colatações forem incompatíveis, um dos argumentos deve ser convertido para ser compatível com o outro. Veja a Seção 12.8.4, “Coercitividade da Colatação em Expressões”.

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

### 14.8.2 Regras de Expressão Regulares

**Tabela 14.14 Funções e operadores de expressão regular**

<table frame="box" rules="all" summary="A reference that lists regular expression functions and operators."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Name</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>NOT REGEXP</code></td> <td>Negación de REGEXP</td> </tr><tr><td><code>REGEXP</code></td> <td>Se a cadeia corresponde à expressão regular</td> </tr><tr><td><code>REGEXP_INSTR()</code></td> <td>Índice inicial de correspondência de subcadeia com expressão regular</td> </tr><tr><td><code>REGEXP_LIKE()</code></td> <td>Se a cadeia corresponde à expressão regular</td> </tr><tr><td><code>REGEXP_REPLACE()</code></td> <td>Substitua substratos que correspondem à expressão regular</td> </tr><tr><td><code>REGEXP_SUBSTR()</code></td> <td>Retorne substring que correspondam à expressão regular</td> </tr><tr><td><code>RLIKE</code></td> <td>Se a cadeia corresponde à expressão regular</td> </tr></tbody></table>

Uma expressão regular é uma maneira poderosa de especificar um padrão para uma busca complexa. Esta seção discute as funções e operadores disponíveis para correspondência de expressão regular e ilustra, com exemplos, alguns dos caracteres especiais e construções que podem ser usados para operações de expressão regular. Veja também a Seção 5.3.4.7, “Correspondência de Padrão”.

O MySQL implementa suporte a expressão regular usando Componentes Internacionais para Unicode (ICU), que oferece suporte completo ao Unicode e é seguro para multibyte. (Antes do MySQL 8.0.4, o MySQL usava a implementação de expressões regulares de Henry Spencer, que opera de forma por byte e não é segura para multibyte. Para informações sobre as maneiras pelas quais as aplicações que usam expressões regulares podem ser afetadas pela mudança de implementação, consulte Considerações de Compatibilidade com Expressões Regulares.)

Antes do MySQL 8.0.22, era possível usar argumentos de string binária com essas funções, mas eles produziam resultados inconsistentes. No MySQL 8.0.22 e versões posteriores, o uso de uma string binária com qualquer uma das funções de expressão regular do MySQL é rejeitado com `ER_CHARACTER_SET_MISMATCH`.

* Descrições de Função e Operador de Expressão Reguladora
* Sintaxe de Expressão Reguladora
* Controle de Recursos de Expressão Reguladora
* Considerações de Compatibilidade de Expressão Reguladora

#### Descrições das funções e operadores de expressão regular

* `expr NOT REGEXP pat`(regexp.html#operator_not-regexp), `expr NOT RLIKE pat`(regexp.html#operator_not-regexp)

Isto é o mesmo que `NOT (expr REGEXP pat)`.

* `expr REGEXP pat`(regexp.html#operator_regexp), `expr RLIKE pat`(regexp.html#operator_regexp)

Devolve 1 se a string *`expr`* corresponder à expressão regular especificada pelo padrão *`pat`*, caso contrário, 0. Se *`expr`* ou *`pat`* for `NULL`, o valor de retorno é `NULL`.

`REGEXP` e `RLIKE` são sinônimos de `REGEXP_LIKE()`.

Para informações adicionais sobre como ocorre a correspondência, consulte a descrição para `REGEXP_LIKE()`.

  ```
  mysql> SELECT 'Michael!' REGEXP '.*';
  +------------------------+
  | 'Michael!' REGEXP '.*' |
  +------------------------+
  |                      1 |
  +------------------------+
  mysql> SELECT 'new*\n*line' REGEXP 'new\\*.\\*line';
  +---------------------------------------+
  | 'new*\n*line' REGEXP 'new\\*.\\*line' |
  +---------------------------------------+
  |                                     0 |
  +---------------------------------------+
  mysql> SELECT 'a' REGEXP '^[a-d]';
  +---------------------+
  | 'a' REGEXP '^[a-d]' |
  +---------------------+
  |                   1 |
  +---------------------+
  ```

* `REGEXP_INSTR(expr, pat[, pos[, occurrence[, return_option[, match_type]]]])`(regexp.html#function_regexp-instr)

Retorna o índice inicial da subcadeia da string *`expr`* que corresponde à expressão regular especificada pelo padrão *`pat`*, 0 se não houver correspondência. Se *`expr`* ou *`pat`* é `NULL`, o valor de retorno é `NULL`. Os índices de caracteres começam em 1.

`REGEXP_INSTR()` aceita esses argumentos opcionais:

+ *`pos`*: A posição em *`expr`* onde a busca deve começar. Se omitida, o padrão é 1.

+ *`occurrence`*: Qual ocorrência de uma correspondência para pesquisar. Se omitido, o padrão é 1.

+ *`return_option`*: Que tipo de posição retornar. Se este valor for 0, `REGEXP_INSTR()` retorna a posição do primeiro caractere da substring correspondente. Se este valor for 1, `REGEXP_INSTR()` retorna a posição seguinte à substring correspondente. Se omitido, o padrão é 0.

+ *`match_type`*: Uma cadeia que especifica como realizar a correspondência. O significado é descrito para `REGEXP_LIKE()`.

Para informações adicionais sobre como ocorre a correspondência, consulte a descrição para `REGEXP_LIKE()`.

  ```
  mysql> SELECT REGEXP_INSTR('dog cat dog', 'dog');
  +------------------------------------+
  | REGEXP_INSTR('dog cat dog', 'dog') |
  +------------------------------------+
  |                                  1 |
  +------------------------------------+
  mysql> SELECT REGEXP_INSTR('dog cat dog', 'dog', 2);
  +---------------------------------------+
  | REGEXP_INSTR('dog cat dog', 'dog', 2) |
  +---------------------------------------+
  |                                     9 |
  +---------------------------------------+
  mysql> SELECT REGEXP_INSTR('aa aaa aaaa', 'a{2}');
  +-------------------------------------+
  | REGEXP_INSTR('aa aaa aaaa', 'a{2}') |
  +-------------------------------------+
  |                                   1 |
  +-------------------------------------+
  mysql> SELECT REGEXP_INSTR('aa aaa aaaa', 'a{4}');
  +-------------------------------------+
  | REGEXP_INSTR('aa aaa aaaa', 'a{4}') |
  +-------------------------------------+
  |                                   8 |
  +-------------------------------------+
  ```

* `REGEXP_LIKE(expr, pat[, match_type])`(regexp.html#function_regexp-like)

Devolve 1 se a string *`expr`* corresponder à expressão regular especificada pelo padrão *`pat`*, caso contrário, 0. Se *`expr`* ou *`pat`* for `NULL`, o valor de retorno é `NULL`.

O padrão pode ser uma expressão regular estendida, cuja sintaxe é discutida na Sintaxe de Expressões Regulares. O padrão não precisa ser uma string literal. Por exemplo, ele pode ser especificado como uma expressão de string ou coluna de tabela.

O argumento opcional *`match_type`* é uma string que pode conter qualquer ou todos os seguintes caracteres, especificando como realizar a correspondência:

+ `c`: Contagem sensível ao caso.  
  + `i`: Contagem insensível ao caso.  
  + `m`: Modo de múltiplas linhas. Reconheça terminadores de linha dentro da string. O comportamento padrão é corresponder terminadores de linha apenas no início e no fim da expressão da string.

+ `n`: O caractere `.` corresponde a terminadores de linha. O padrão é que o `.` corresponda para parar no final de uma linha.

+ `u`: Apenas as extremidades de linha do Unix. Apenas o caractere de nova linha é reconhecido como uma extremidade de linha pelos operadores de correspondência `.`, `^` e `$`.

Se os caracteres que especificam opções contraditórias forem especificados dentro de *`match_type`*, o último à direita prevalece.

Por padrão, as operações de expressão regular utilizam o conjunto de caracteres e a ordenação do *`expr`* e *`pat`* quando decidem o tipo de um caractere e realizam a comparação. Se os argumentos tiverem conjuntos de caracteres ou ordenações diferentes, as regras de coercibilidade se aplicam conforme descrito na Seção 12.8.4, “Coercibilidade de Ordenação em Expressões”. Os argumentos podem ser especificados com indicadores explícitos de ordenação para alterar o comportamento da comparação.

  ```
  mysql> SELECT REGEXP_LIKE('CamelCase', 'CAMELCASE');
  +---------------------------------------+
  | REGEXP_LIKE('CamelCase', 'CAMELCASE') |
  +---------------------------------------+
  |                                     1 |
  +---------------------------------------+
  mysql> SELECT REGEXP_LIKE('CamelCase', 'CAMELCASE' COLLATE utf8mb4_0900_as_cs);
  +------------------------------------------------------------------+
  | REGEXP_LIKE('CamelCase', 'CAMELCASE' COLLATE utf8mb4_0900_as_cs) |
  +------------------------------------------------------------------+
  |                                                                0 |
  +------------------------------------------------------------------+
  ```

*`match_type`* pode ser especificado com os caracteres `c` ou `i` para ignorar a sensibilidade de caso padrão. Exceção: Se qualquer argumento for uma string binária, os argumentos são tratados de acordo com a sensibilidade de caso como strings binárias, mesmo que *`match_type`* contenha o caractere `i`.

Nota

O MySQL utiliza a sintaxe de escape C em strings (por exemplo, `\n` para representar o caractere de nova linha). Se você deseja que seu argumento *`expr`* ou *`pat`* contenha um literal `\`, você deve duplicá-lo. (A menos que o modo SQL `NO_BACKSLASH_ESCAPES` esteja habilitado, nesse caso, nenhum caractere de escape é usado.)

  ```
  mysql> SELECT REGEXP_LIKE('Michael!', '.*');
  +-------------------------------+
  | REGEXP_LIKE('Michael!', '.*') |
  +-------------------------------+
  |                             1 |
  +-------------------------------+
  mysql> SELECT REGEXP_LIKE('new*\n*line', 'new\\*.\\*line');
  +----------------------------------------------+
  | REGEXP_LIKE('new*\n*line', 'new\\*.\\*line') |
  +----------------------------------------------+
  |                                            0 |
  +----------------------------------------------+
  mysql> SELECT REGEXP_LIKE('a', '^[a-d]');
  +----------------------------+
  | REGEXP_LIKE('a', '^[a-d]') |
  +----------------------------+
  |                          1 |
  +----------------------------+
  ```

  ```
  mysql> SELECT REGEXP_LIKE('abc', 'ABC');
  +---------------------------+
  | REGEXP_LIKE('abc', 'ABC') |
  +---------------------------+
  |                         1 |
  +---------------------------+
  mysql> SELECT REGEXP_LIKE('abc', 'ABC', 'c');
  +--------------------------------+
  | REGEXP_LIKE('abc', 'ABC', 'c') |
  +--------------------------------+
  |                              0 |
  +--------------------------------+
  ```

* `REGEXP_REPLACE(expr, pat, repl[, pos[, occurrence[, match_type]]])`(regexp.html#function_regexp-replace)

Substitui as ocorrências na string *`expr`* que correspondem à expressão regular especificada pelo padrão *`pat`* com a string de substituição *`repl`*, e retorna a string resultante. Se *`expr`*, *`pat`* ou *`repl`* for `NULL`, o valor de retorno é `NULL`.

`REGEXP_REPLACE()` aceita esses argumentos opcionais:

+ *`pos`*: A posição em *`expr`* na qual a busca deve ser iniciada. Se omitida, o padrão é 1.

+ *`occurrence`*: Qual ocorrência de uma correspondência a ser substituída. Se omitido, o padrão é 0 (o que significa "substituir todas as ocorrências").

+ *`match_type`*: Uma cadeia que especifica como realizar a correspondência. O significado é descrito para `REGEXP_LIKE()`.

Antes do MySQL 8.0.17, o resultado retornado por essa função usava o conjunto de caracteres `UTF-16`; no MySQL 8.0.17 e versões posteriores, o conjunto de caracteres e a correção da expressão que busca correspondências são usados. (Bug #94203, Bug #29308212)

Para informações adicionais sobre como ocorre a correspondência, consulte a descrição para `REGEXP_LIKE()`.

  ```
  mysql> SELECT REGEXP_REPLACE('a b c', 'b', 'X');
  +-----------------------------------+
  | REGEXP_REPLACE('a b c', 'b', 'X') |
  +-----------------------------------+
  | a X c                             |
  +-----------------------------------+
  mysql> SELECT REGEXP_REPLACE('abc def ghi', '[a-z]+', 'X', 1, 3);
  +----------------------------------------------------+
  | REGEXP_REPLACE('abc def ghi', '[a-z]+', 'X', 1, 3) |
  +----------------------------------------------------+
  | abc def X                                          |
  +----------------------------------------------------+
  ```

* `REGEXP_SUBSTR(expr, pat[, pos[, occurrence[, match_type]]])`(regexp.html#function_regexp-substr)

Retorna a subcadeia da string *`expr`* que corresponde à expressão regular especificada pelo padrão *`pat`*, `NULL`, se não houver correspondência. Se *`expr`* ou *`pat`* for `NULL`, o valor de retorno é `NULL`.

`REGEXP_SUBSTR()` aceita esses argumentos opcionais:

+ *`pos`*: A posição em *`expr`* onde a busca deve começar. Se omitida, o padrão é 1.

+ *`occurrence`*: Qual ocorrência de uma correspondência para pesquisar. Se omitido, o padrão é 1.

+ *`match_type`*: Uma cadeia que especifica como realizar a correspondência. O significado é descrito para `REGEXP_LIKE()`.

Antes do MySQL 8.0.17, o resultado retornado por essa função usava o conjunto de caracteres `UTF-16`; no MySQL 8.0.17 e versões posteriores, o conjunto de caracteres e a correção da expressão que busca correspondências são usados. (Bug #94203, Bug #29308212)

Para informações adicionais sobre como ocorre a correspondência, consulte a descrição para `REGEXP_LIKE()`.

  ```
  mysql> SELECT REGEXP_SUBSTR('abc def ghi', '[a-z]+');
  +----------------------------------------+
  | REGEXP_SUBSTR('abc def ghi', '[a-z]+') |
  +----------------------------------------+
  | abc                                    |
  +----------------------------------------+
  mysql> SELECT REGEXP_SUBSTR('abc def ghi', '[a-z]+', 1, 3);
  +----------------------------------------------+
  | REGEXP_SUBSTR('abc def ghi', '[a-z]+', 1, 3) |
  +----------------------------------------------+
  | ghi                                          |
  +----------------------------------------------+
  ```

#### Sintaxe de Expressão Regular

Uma expressão regular descreve um conjunto de cadeias de caracteres. A expressão regular mais simples é aquela que não possui caracteres especiais. Por exemplo, a expressão regular `hello` corresponde a `hello` e nada mais.

As expressões regulares não triviais utilizam certos construtos especiais para que possam corresponder a mais de uma cadeia. Por exemplo, a expressão regular `hello|world` contém o operador de alternância `|` e corresponde ao `hello` ou `world`.

Como exemplo mais complexo, a expressão regular `B[an]*s` corresponde a qualquer uma das cadeias de caracteres `Bananas`, `Baaaaas`, `Bs` e qualquer outra cadeia de caracteres que comece com um `B`, termine com um `s` e contenha qualquer número de caracteres `a` ou `n` entre eles.

A lista a seguir abrange alguns dos caracteres especiais básicos e construções que podem ser usados em expressões regulares. Para informações sobre a sintaxe completa de expressões regulares compatível com a biblioteca ICU usada para implementar suporte a expressões regulares, visite o site [International Components for Unicode][(https://unicode-org.github.io/icu/userguide/)].

* `^`

Conjuntar o início de uma cadeia.

  ```
  mysql> SELECT REGEXP_LIKE('fo\nfo', '^fo$');                   -> 0
  mysql> SELECT REGEXP_LIKE('fofo', '^fo');                      -> 1
  ```

* `$`

Conecte as extremidades de uma corda.

  ```
  mysql> SELECT REGEXP_LIKE('fo\no', '^fo\no$');                 -> 1
  mysql> SELECT REGEXP_LIKE('fo\no', '^fo$');                    -> 0
  ```

* `.`

Corresponda qualquer caractere (incluindo retorno de carro e nova linha, embora para corresponder a esses caracteres no meio de uma string, o `m` (multilinha) ou o modificador de modificador dentro do padrão `(?m)` deve ser dado).

  ```
  mysql> SELECT REGEXP_LIKE('fofo', '^f.*$');                    -> 1
  mysql> SELECT REGEXP_LIKE('fo\r\nfo', '^f.*$');                -> 0
  mysql> SELECT REGEXP_LIKE('fo\r\nfo', '^f.*$', 'm');           -> 1
  mysql> SELECT REGEXP_LIKE('fo\r\nfo', '(?m)^f.*$');           -> 1
  ```

* `a*`

Corresponda a qualquer sequência de zero ou mais caracteres `a`.

  ```
  mysql> SELECT REGEXP_LIKE('Ban', '^Ba*n');                     -> 1
  mysql> SELECT REGEXP_LIKE('Baaan', '^Ba*n');                   -> 1
  mysql> SELECT REGEXP_LIKE('Bn', '^Ba*n');                      -> 1
  ```

* `a+`

Corresponda a qualquer sequência de um ou mais caracteres `a`.

  ```
  mysql> SELECT REGEXP_LIKE('Ban', '^Ba+n');                     -> 1
  mysql> SELECT REGEXP_LIKE('Bn', '^Ba+n');                      -> 0
  ```

* `a?`

Corresponda com zero ou um caractere `a`.

  ```
  mysql> SELECT REGEXP_LIKE('Bn', '^Ba?n');                      -> 1
  mysql> SELECT REGEXP_LIKE('Ban', '^Ba?n');                     -> 1
  mysql> SELECT REGEXP_LIKE('Baan', '^Ba?n');                    -> 0
  ```

* `de|abc`

Alternância; corresponda a qualquer uma das sequências `de` ou `abc`.

  ```
  mysql> SELECT REGEXP_LIKE('pi', 'pi|apa');                     -> 1
  mysql> SELECT REGEXP_LIKE('axe', 'pi|apa');                    -> 0
  mysql> SELECT REGEXP_LIKE('apa', 'pi|apa');                    -> 1
  mysql> SELECT REGEXP_LIKE('apa', '^(pi|apa)$');                -> 1
  mysql> SELECT REGEXP_LIKE('pi', '^(pi|apa)$');                 -> 1
  mysql> SELECT REGEXP_LIKE('pix', '^(pi|apa)$');                -> 0
  ```

* `(abc)*`

Corresponda zero ou mais instâncias da sequência `abc`.

  ```
  mysql> SELECT REGEXP_LIKE('pi', '^(pi)*$');                    -> 1
  mysql> SELECT REGEXP_LIKE('pip', '^(pi)*$');                   -> 0
  mysql> SELECT REGEXP_LIKE('pipi', '^(pi)*$');                  -> 1
  ```

* `{1}`, `{2,3}`

Repetição; a notação `{n}` e `{m,n}` fornece uma maneira mais geral de escrever expressões regulares que correspondem a muitas ocorrências do átomo anterior (ou “pedaço”) do padrão. *`m`* e *`n`* são inteiros.

+ `a*`

Pode ser escrito como `a{0,}`.

+ `a+`

Pode ser escrito como `a{1,}`.

+ `a?`

Pode ser escrito como `a{0,1}`.

Para ser mais preciso, `a{n}` corresponde exatamente a *`n`* instâncias de `a`. `a{n,}` corresponde a *`n`* ou mais instâncias de `a`. `a{m,n}` corresponde a *`m`* através de *`n`* instâncias de `a`, inclusive. Se ambos *`m`* e *`n`* forem fornecidos, *`m`* deve ser menor ou igual a *`n`*.

  ```
  mysql> SELECT REGEXP_LIKE('abcde', 'a[bcd]{2}e');              -> 0
  mysql> SELECT REGEXP_LIKE('abcde', 'a[bcd]{3}e');              -> 1
  mysql> SELECT REGEXP_LIKE('abcde', 'a[bcd]{1,10}e');           -> 1
  ```

* `[a-dX]`, `[^a-dX]`

Converte qualquer caractere que seja (ou não seja, se `^` for usado) `a`, `b`, `c`, `d` ou `X`. Um caractere `-` entre dois outros caracteres forma uma faixa que corresponde a todos os caracteres do primeiro caractere ao segundo. Por exemplo, `[0-9]` corresponde a qualquer dígito decimal. Para incluir um caractere literal `]`, ele deve seguir imediatamente o parêntese de abertura `[`. Para incluir um caractere literal `-`, ele deve ser escrito primeiro ou último. Qualquer caractere que não tenha um significado especial definido dentro de um par `[]` corresponde apenas a si mesmo.

  ```
  mysql> SELECT REGEXP_LIKE('aXbc', '[a-dXYZ]');                 -> 1
  mysql> SELECT REGEXP_LIKE('aXbc', '^[a-dXYZ]$');               -> 0
  mysql> SELECT REGEXP_LIKE('aXbc', '^[a-dXYZ]+$');              -> 1
  mysql> SELECT REGEXP_LIKE('aXbc', '^[^a-dXYZ]+$');             -> 0
  mysql> SELECT REGEXP_LIKE('gheis', '^[^a-dXYZ]+$');            -> 1
  mysql> SELECT REGEXP_LIKE('gheisa', '^[^a-dXYZ]+$');           -> 0
  ```

* `[=character_class=]`

Dentro de uma expressão em chaves (escrita usando `[` e `]`), `[=character_class=]` representa uma classe de equivalência. Ela corresponde a todos os caracteres com o mesmo valor de collation, incluindo a si mesma. Por exemplo, se `o` e `(+)` são os membros de uma classe de equivalência, `[[=o=]]`, `[[=(+)=]]` e `[o(+)]` são todos sinônimos. Uma classe de equivalência não pode ser usada como um ponto final de uma faixa.

* `[:character_class:]`

Dentro de uma expressão entre chaves (escrita usando `[` e `]`), `[:character_class:]` representa uma classe de caracteres que corresponde a todos os caracteres pertencentes a essa classe. O seguinte quadro lista os nomes padrão das classes. Esses nomes representam as classes de caracteres definidas na página do manual `ctype(3)`. Um local específico pode fornecer outros nomes de classe. Uma classe de caracteres não pode ser usada como um ponto final de uma faixa.

  <table summary="Character class names and the meaning of each class."><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Character Class Name</th> <th>Significado</th> </tr></thead><tbody><tr> <td><code>alnum</code></td> <td>Caracteres alfanuméricos</td> </tr><tr> <td><code>alpha</code></td> <td>Caracteres alfabéticos</td> </tr><tr> <td><code>blank</code></td> <td>Caracteres de espaço em branco</td> </tr><tr> <td><code>cntrl</code></td> <td>Caracteres de controle</td> </tr><tr> <td><code>digit</code></td> <td>Caracteres numéricos</td> </tr><tr> <td><code>graph</code></td> <td>Personagens gráficos</td> </tr><tr> <td><code>lower</code></td> <td>letras alfabéticas minúsculas</td> </tr><tr> <td><code>print</code></td> <td>Caracteres gráficos ou espaciais</td> </tr><tr> <td><code>punct</code></td> <td>Caracteres de pontuação</td> </tr><tr> <td><code>space</code></td> <td>Espaço, tabulação, nova linha e retorno de carro</td> </tr><tr> <td><code>upper</code></td> <td>Letras maiúsculas alfabéticas</td> </tr><tr> <td><code>xdigit</code></td> <td>Caracteres de dígitos hexadecimais</td> </tr></tbody></table>

  ```
  mysql> SELECT REGEXP_LIKE('justalnums', '[[:alnum:]]+');       -> 1
  mysql> SELECT REGEXP_LIKE('!!', '[[:alnum:]]+');               -> 0
  ```

Como a ICU é consciente de todos os caracteres alfabéticos em `utf16_general_ci`, algumas classes de caracteres podem não funcionar tão rapidamente quanto as faixas de caracteres. Por exemplo, `[a-zA-Z]` é conhecido por funcionar muito mais rapidamente do que `[[:alpha:]]`, e `[0-9]` é geralmente muito mais rápido do que `[[:digit:]]`. Se você está migrando aplicativos usando `[[:alpha:]]` ou `[[:digit:]]` a partir de uma versão anterior do MySQL, você deve substituí-los pelos intervalos equivalentes para uso com o MySQL 8.0.

Para usar uma instância literal de um caractere especial em uma expressão regular, anteceda-o com dois caracteres de barra invertida (\). O analisador do MySQL interpreta um dos traços de barra, e a biblioteca de expressão regular interpreta o outro. Por exemplo, para corresponder à string `1+2` que contém o caractere especial `+`, apenas a última das seguintes expressões regulares é a correta:

```
mysql> SELECT REGEXP_LIKE('1+2', '1+2');                       -> 0
mysql> SELECT REGEXP_LIKE('1+2', '1\+2');                      -> 0
mysql> SELECT REGEXP_LIKE('1+2', '1\\+2');                     -> 1
```

#### Controle de Recursos de Expressão Regular

`REGEXP_LIKE()` e funções semelhantes utilizam recursos que podem ser controlados definindo variáveis do sistema:

* O motor de jogo utiliza memória para sua pilha interna. Para controlar a memória máxima disponível para a pilha em bytes, defina a variável de sistema `regexp_stack_limit`.

* O motor de jogo opera em etapas. Para controlar o número máximo de etapas realizadas pelo motor (e, portanto, indiretamente o tempo de execução), defina a variável de sistema `regexp_time_limit`. Como esse limite é expresso em número de etapas, ele afeta o tempo de execução apenas indiretamente. Tipicamente, é da ordem de milissegundos.

#### Considerações sobre compatibilidade com expressão regular

Antes do MySQL 8.0.4, o MySQL usava a biblioteca de expressão regular Henry Spencer para suportar operações de expressão regular, em vez dos Componentes Internacionais para Unicode (ICU). A discussão a seguir descreve as diferenças entre as bibliotecas Spencer e ICU que podem afetar as aplicações:

* Com a biblioteca Spencer, os operadores `REGEXP` e `RLIKE` trabalham de forma por byte, portanto, não são seguros para multibyte e podem produzir resultados inesperados com conjuntos de caracteres multibyte. Além disso, esses operadores comparam caracteres por seus valores de byte e caracteres acentuados podem não ser comparados como iguais, mesmo que uma determinada ordenação os trate como iguais.

O ICU tem suporte completo para Unicode e é seguro para multibyte. Seus funções de expressão regular tratam todas as strings como `UTF-16`. Você deve ter em mente que os índices posicionais são baseados em fragmentos de 16 bits e não em pontos de código. Isso significa que, quando passados a tais funções, caracteres que usam mais de um fragmento podem produzir resultados inesperados, como os mostrados aqui:

  ```
  mysql> SELECT REGEXP_INSTR('🍣🍣b', 'b');
  +--------------------------+
  | REGEXP_INSTR('??b', 'b') |
  +--------------------------+
  |                        5 |
  +--------------------------+
  1 row in set (0.00 sec)

  mysql> SELECT REGEXP_INSTR('🍣🍣bxxx', 'b', 4);
  +--------------------------------+
  | REGEXP_INSTR('??bxxx', 'b', 4) |
  +--------------------------------+
  |                              5 |
  +--------------------------------+
  1 row in set (0.00 sec)
  ```

Os caracteres dentro do Plano Multilíngue Básico Unicode, que inclui caracteres usados pela maioria das línguas modernas, são seguros a esse respeito:

  ```
  mysql> SELECT REGEXP_INSTR('бжb', 'b');
  +----------------------------+
  | REGEXP_INSTR('бжb', 'b')   |
  +----------------------------+
  |                          3 |
  +----------------------------+
  1 row in set (0.00 sec)

  mysql> SELECT REGEXP_INSTR('עבb', 'b');
  +----------------------------+
  | REGEXP_INSTR('עבb', 'b')   |
  +----------------------------+
  |                          3 |
  +----------------------------+
  1 row in set (0.00 sec)

  mysql> SELECT REGEXP_INSTR('µå周çб', '周');
  +------------------------------------+
  | REGEXP_INSTR('µå周çб', '周')       |
  +------------------------------------+
  |                                  3 |
  +------------------------------------+
  1 row in set (0.00 sec)
  ```

Os emojis, como o caractere “sushi” `🍣` (U+1F363) usado nos dois primeiros exemplos, não estão incluídos no Plano Multilíngue Básico, mas sim no Plano Multilíngue Suplementar do Unicode. Outro problema pode surgir com emojis e outros caracteres de 4 bytes quando `REGEXP_SUBSTR()` ou uma função semelhante começa a pesquisar no meio de um caractere. Cada uma das duas declarações no exemplo a seguir começa a partir da segunda posição de 2 bytes no primeiro argumento. A primeira declaração trabalha em uma string composta exclusivamente por caracteres de 2 bytes (BMP). A segunda declaração contém caracteres de 4 bytes que são interpretados incorretamente no resultado porque os dois primeiros bytes são removidos e, portanto, o restante dos dados do caractere está desalinhado.

  ```
  mysql> SELECT REGEXP_SUBSTR('周周周周', '.*', 2);
  +----------------------------------------+
  | REGEXP_SUBSTR('周周周周', '.*', 2)     |
  +----------------------------------------+
  | 周周周                                 |
  +----------------------------------------+
  1 row in set (0.00 sec)

  mysql> SELECT REGEXP_SUBSTR('🍣🍣🍣🍣', '.*', 2);
  +--------------------------------+
  | REGEXP_SUBSTR('????', '.*', 2) |
  +--------------------------------+
  | ?㳟揘㳟揘㳟揘                  |
  +--------------------------------+
  1 row in set (0.00 sec)
  ```

* Para o operador `.`, a biblioteca Spencer corresponde caracteres de finalizador de linha (retorno de carro, nova linha) em qualquer parte das expressões de string, incluindo no meio. Para corresponder aos caracteres de finalizador de linha no meio das strings com o ICU, especifique o caractere de controle de correspondência `m`.

* A biblioteca Spencer suporta marcadores de fronteira de início e fim de palavra (a notação `[[:<:]]` e `[[:>:]]`). O ICU não. Para o ICU, você pode usar `\b` para corresponder a fronteiras de palavra; duplicar o backslash porque o MySQL o interpreta como o caractere de escape dentro das strings.

* A biblioteca Spencer suporta expressões de colheita de elementos entre chaves (notação `[.characters.]`). O ICU

* Para contagem de repetições (as notações `{n}` e `{m,n}`), a biblioteca Spencer tem um máximo de 255. O ICU não tem tal limite, embora o número máximo de etapas do motor de correspondência possa ser limitado pela definição da variável de sistema `regexp_time_limit`.

* O ICU interpreta os parênteses como caracteres meta. Para especificar um literal aberto `(` ou parênteses fechados `)` em uma expressão regular, ele deve ser escapado:

  ```
  mysql> SELECT REGEXP_LIKE('(', '(');
  ERROR 3692 (HY000): Mismatched parenthesis in regular expression.
  mysql> SELECT REGEXP_LIKE('(', '\\(');
  +-------------------------+
  | REGEXP_LIKE('(', '\\(') |
  +-------------------------+
  |                       1 |
  +-------------------------+
  mysql> SELECT REGEXP_LIKE(')', ')');
  ERROR 3692 (HY000): Mismatched parenthesis in regular expression.
  mysql> SELECT REGEXP_LIKE(')', '\\)');
  +-------------------------+
  | REGEXP_LIKE(')', '\\)') |
  +-------------------------+
  |                       1 |
  +-------------------------+
  ```

* O ICU também interpreta os colchetes como caracteres meta, mas apenas o colchete aberto precisa ser escamado para ser usado como um caractere literal:

  ```
  mysql> SELECT REGEXP_LIKE('[', '[');
  ERROR 3696 (HY000): The regular expression contains an
  unclosed bracket expression.
  mysql> SELECT REGEXP_LIKE('[', '\\[');
  +-------------------------+
  | REGEXP_LIKE('[', '\\[') |
  +-------------------------+
  |                       1 |
  +-------------------------+
  mysql> SELECT REGEXP_LIKE(']', ']');
  +-----------------------+
  | REGEXP_LIKE(']', ']') |
  +-----------------------+
  |                     1 |
  +-----------------------+
  ```

### 14.8.3 Conjunto de caracteres e correção de resultados de funções

O MySQL tem muitos operadores e funções que retornam uma string. Esta seção responde à pergunta: Qual é o conjunto de caracteres e a correção de tal string?

Para funções simples que aceitam entrada de cadeia de caracteres e retornam um resultado em cadeia de caracteres como saída, o conjunto de caracteres e a ordenação da saída são os mesmos da principal valor de entrada. Por exemplo, `UPPER(X)` retorna uma cadeia de caracteres com a mesma cadeia de caracteres e ordenação que *`X`*. O mesmo se aplica para `INSTR()`, `LCASE()`, `LOWER()`, `LTRIM()`, `MID()`, `REPEAT()`, `REPLACE()`, `REVERSE()`, `RIGHT()`, `RPAD()`, `RTRIM()`, `SOUNDEX()`, `SUBSTRING()`, `TRIM()`, `UCASE()` e `UPPER()`.

Nota

A função `REPLACE()`, ao contrário de todas as outras funções, sempre ignora a ordenação da entrada de cadeia e realiza uma comparação sensível ao caso.

Se uma entrada de cadeia ou o resultado de uma função for uma cadeia binária, a cadeia tem o conjunto de caracteres e a ordenação `binary`. Isso pode ser verificado usando as funções `CHARSET()` e `COLLATION()`, que ambas retornam `binary` para um argumento de cadeia binária:

```
mysql> SELECT CHARSET(BINARY 'a'), COLLATION(BINARY 'a');
+---------------------+-----------------------+
| CHARSET(BINARY 'a') | COLLATION(BINARY 'a') |
+---------------------+-----------------------+
| binary              | binary                |
+---------------------+-----------------------+
```

Para operações que combinam várias entradas de cadeia e retornam uma saída de cadeia única, as “regras de agregação” do SQL padrão se aplicam para determinar a codificação do resultado:

* Se ocorrer um `COLLATE Y` explícito, use *`Y`*.

* Se ocorrerem `COLLATE Y` e `COLLATE Z` explícitos, levante um erro.

* Caso contrário, se todas as codificações forem *`Y`*, use *`Y`*.

* Caso contrário, o resultado não tem ordenação.

Por exemplo, com `CASE ... WHEN a THEN b WHEN b THEN c COLLATE X END`, a ordenação resultante é *`X`*. O mesmo se aplica para `UNION`, `||`, `CONCAT()`, `ELT()`, `GREATEST()`, `IF()` e `LEAST()`.

Para operações que convertem em dados de caracteres, o conjunto de caracteres e a ordenação das cadeias resultantes das operações são definidos pelas variáveis de sistema `character_set_connection` e `collation_connection`, que determinam o conjunto de caracteres e a ordenação de conexão padrão (ver Seção 12.4, “Conjunto de caracteres e ordenação de conexão”). Isso se aplica apenas a `BIN_TO_UUID()`, `CAST()`, `CONV()`, `FORMAT()`, `HEX()` e `SPACE()`.

Uma exceção ao princípio anterior ocorre para expressões para colunas geradas virtualmente. Nesses casos, o conjunto de caracteres da tabela é usado para resultados de `BIN_TO_UUID()`, `CONV()` ou `HEX()`, independentemente do conjunto de caracteres de conexão.

Se houver alguma dúvida sobre o conjunto de caracteres ou a ordenação do resultado retornado por uma função de string, use a função `CHARSET()` ou `COLLATION()` para descobrir:

```
mysql> SELECT USER(), CHARSET(USER()), COLLATION(USER());
+----------------+-----------------+--------------------+
| USER()         | CHARSET(USER()) | COLLATION(USER())  |
+----------------+-----------------+--------------------+
| test@localhost | utf8mb3         | utf8mb3_general_ci |
+----------------+-----------------+--------------------+
mysql> SELECT CHARSET(COMPRESS('abc')), COLLATION(COMPRESS('abc'));
+--------------------------+----------------------------+
| CHARSET(COMPRESS('abc')) | COLLATION(COMPRESS('abc')) |
+--------------------------+----------------------------+
| binary                   | binary                     |
+--------------------------+----------------------------+
```
