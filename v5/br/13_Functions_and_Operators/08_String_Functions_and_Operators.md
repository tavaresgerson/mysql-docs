## 12.8 Funções e operadores de strings

**Tabela 12.12 Funções e operadores de cadeia**

<table frame="box" rules="all" summary="A reference that lists string functions and operators."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Name</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>ASCII()</code></td> <td>Retorne o valor numérico do caractere mais à esquerda</td> </tr><tr><td><code>BIN()</code></td> <td>Retorne uma string contendo a representação binária de um número</td> </tr><tr><td><code>BIT_LENGTH()</code></td> <td>Retorne o comprimento do argumento em bits</td> </tr><tr><td><code>CHAR()</code></td> <td>Retorne o caractere para cada inteiro passado</td> </tr><tr><td><code>CHAR_LENGTH()</code></td> <td>Retorne o número de caracteres no argumento</td> </tr><tr><td><code>CHARACTER_LENGTH()</code></td> <td>Sinônimo de CHAR_LENGTH()</td> </tr><tr><td><code>CONCAT()</code></td> <td>Retorno da string concatenada</td> </tr><tr><td><code>CONCAT_WS()</code></td> <td>Retorno concatenado com separador</td> </tr><tr><td><code>ELT()</code></td> <td>Retorne a string no número de índice</td> </tr><tr><td><code>EXPORT_SET()</code></td> <td>Retorne uma string onde, para cada bit definido no valor bits, você recebe uma string "on" e, para cada bit não definido, uma string "off".</td> </tr><tr><td><code>FIELD()</code></td> <td>Índice (posição) do primeiro argumento nos argumentos subsequentes</td> </tr><tr><td><code>FIND_IN_SET()</code></td> <td>Índice (posição) do primeiro argumento dentro do segundo argumento</td> </tr><tr><td><code>FORMAT()</code></td> <td>Retorne um número formatado para o número especificado de casas decimais</td> </tr><tr><td><code>FROM_BASE64()</code></td> <td>Decodifique a string codificada em base64 e retorne o resultado</td> </tr><tr><td><code>HEX()</code></td> <td>Representação hexadecimal de valor decimal ou de cadeia</td> </tr><tr><td><code>INSERT()</code></td> <td>Insira subdivisão na posição especificada até o número especificado de caracteres</td> </tr><tr><td><code>INSTR()</code></td> <td>Retorne o índice da primeira ocorrência da subcadeia</td> </tr><tr><td><code>LCASE()</code></td> <td>Sinônimo de LOWER()</td> </tr><tr><td><code>LEFT()</code></td> <td>Retorne o número mais à esquerda de caracteres conforme especificado</td> </tr><tr><td><code>LENGTH()</code></td> <td>Retorne o comprimento de uma string em bytes</td> </tr><tr><td><code>LIKE</code></td> <td>Encontre padrões simples</td> </tr><tr><td><code>LOAD_FILE()</code></td> <td>Carregue o arquivo nomeado</td> </tr><tr><td><code>LOCATE()</code></td> <td>Retorne a posição da primeira ocorrência da subcadeia</td> </tr><tr><td><code>LOWER()</code></td> <td>Retorne o argumento em minúsculas</td> </tr><tr><td><code>LPAD()</code></td> <td>Retorne o argumento de string, preenchido à esquerda com a string especificada</td> </tr><tr><td><code>LTRIM()</code></td> <td>Remova espaços em branco iniciais</td> </tr><tr><td><code>MAKE_SET()</code></td> <td>Retorne um conjunto de strings separadas por vírgula que possuem o bit correspondente definido em bits</td> </tr><tr><td><code>MATCH()</code></td> <td>Realizar uma pesquisa de texto completo</td> </tr><tr><td><code>MID()</code></td> <td>Retorne uma subcadeia que comece a partir da posição especificada</td> </tr><tr><td><code>NOT LIKE</code></td> <td>Negação de correspondência de padrão simples</td> </tr><tr><td><code>NOT REGEXP</code></td> <td>Negación de REGEXP</td> </tr><tr><td><code>OCT()</code></td> <td>Retorne uma string contendo a representação octal de um número</td> </tr><tr><td><code>OCTET_LENGTH()</code></td> <td>Sinônimo de LENGTH()</td> </tr><tr><td><code>ORD()</code></td> <td>Código de caractere de retorno para o caractere mais à esquerda do argumento</td> </tr><tr><td><code>POSITION()</code></td> <td>Sinônimo para LOCATE()</td> </tr><tr><td><code>QUOTE()</code></td> <td>Elimine o argumento para uso em uma declaração SQL</td> </tr><tr><td><code>REGEXP</code></td> <td>Se a cadeia corresponde à expressão regular</td> </tr><tr><td><code>REPEAT()</code></td> <td>Repita uma cadeia o número especificado de vezes</td> </tr><tr><td><code>REPLACE()</code></td> <td>Substitua as ocorrências de uma string especificada</td> </tr><tr><td><code>REVERSE()</code></td> <td>Reverter os caracteres em uma string</td> </tr><tr><td><code>RIGHT()</code></td> <td>Retorne o número especificado de caracteres à direita</td> </tr><tr><td><code>RLIKE</code></td> <td>Se a cadeia corresponde à expressão regular</td> </tr><tr><td><code>RPAD()</code></td> <td>Adicione a string o número especificado de vezes</td> </tr><tr><td><code>RTRIM()</code></td> <td>Remova espaços finais</td> </tr><tr><td><code>SOUNDEX()</code></td> <td>Retorne uma string soundex</td> </tr><tr><td><code>SOUNDS LIKE</code></td> <td>Compare sons</td> </tr><tr><td><code>SPACE()</code></td> <td>Retorne uma cadeia com o número especificado de espaços</td> </tr><tr><td><code>STRCMP()</code></td> <td>Compare duas strings</td> </tr><tr><td><code>SUBSTR()</code></td> <td>Retorne a subcadeia conforme especificado</td> </tr><tr><td><code>SUBSTRING()</code></td> <td>Retorne a subcadeia conforme especificado</td> </tr><tr><td><code>SUBSTRING_INDEX()</code></td> <td>Retorne uma subcadeia de uma string antes do número especificado de ocorrências do delimitador</td> </tr><tr><td><code>TO_BASE64()</code></td> <td>Retorne o argumento convertido em uma string base-64</td> </tr><tr><td><code>TRIM()</code></td> <td>Remova espaços em branco iniciais e finais</td> </tr><tr><td><code>UCASE()</code></td> <td>Sinônimo de UPPER()</td> </tr><tr><td><code>UNHEX()</code></td> <td>Retorne uma string contendo a representação hexadecimal de um número</td> </tr><tr><td><code>UPPER()</code></td> <td>Converta para maiúsculas</td> </tr><tr><td><code>WEIGHT_STRING()</code></td> <td>Devolva a string de peso para uma string</td> </tr></tbody></table>

As funções com valor de cadeia de caracteres retornam `NULL` se o comprimento do resultado fosse maior que o valor da variável de sistema `max_allowed_packet`. Veja a Seção 5.1.1, “Configurando o servidor”.

Para funções que operam em posições de string, a primeira posição é numerada como 1.

Para funções que aceitam argumentos de comprimento, os argumentos não inteiros são arredondados para o número inteiro mais próximo.

* `ASCII(str)`

Retorna o valor numérico do caractere mais à esquerda da string *`str`*. Retorna `0` se *`str`* for uma string vazia. Retorna `NULL` se *`str`* for `NULL`. `ASCII()` funciona para caracteres de 8 bits.

  ```sql
  mysql> SELECT ASCII('2');
          -> 50
  mysql> SELECT ASCII(2);
          -> 50
  mysql> SELECT ASCII('dx');
          -> 100
  ```

Veja também a função `ORD()`.

* `BIN(N)`

Retorna uma representação em cadeia do valor binário de *`N`*, onde *`N`* é um número longlong (`BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT)). Isso é equivalente a `CONV(N,10,2)`. Retorna `NULL` se *`N`* for `NULL`.

  ```sql
  mysql> SELECT BIN(12);
          -> '1100'
  ```

* `BIT_LENGTH(str)`

Retorna o comprimento da string *`str`* em bits.

  ```sql
  mysql> SELECT BIT_LENGTH('text');
          -> 32
  ```

* `CHAR(N,... [USING charset_name])`(string-functions.html#function_char)

`CHAR()` interpreta cada argumento *`N`* como um inteiro e retorna uma string composta pelos caracteres fornecidos pelos valores de código desses inteiros. Os valores de `NULL` são ignorados.

  ```sql
  mysql> SELECT CHAR(77,121,83,81,'76');
          -> 'MySQL'
  mysql> SELECT CHAR(77,77.3,'77.3');
          -> 'MMM'
  ```

`CHAR()` argumentos maiores que 255 são convertidos em vários bytes de resultado. Por exemplo, `CHAR(256)` é equivalente a `CHAR(1,0)`, e `CHAR(256*256)` é equivalente a `CHAR(1,0,0)`:

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

Se `USING` for fornecido e a string de resultado for ilegal para o conjunto de caracteres fornecido, um aviso é emitido. Além disso, se o modo SQL rigoroso estiver habilitado, o resultado de `CHAR()` se torna `NULL`.

Se `CHAR()` for invocado dentro do cliente **mysql**, as cadeias binárias são exibidas usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 4.5.1, “mysql — O cliente de string de comando MySQL”.

* `CHAR_LENGTH(str)`

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

* `CHARACTER_LENGTH(str)`

`CHARACTER_LENGTH()` é sinônimo de `CHAR_LENGTH()`.

* `CONCAT(str1,str2,...)`

Retorna a string que resulta da concatenação dos argumentos. Pode ter um ou mais argumentos. Se todos os argumentos forem strings não binárias, o resultado é uma string não binária. Se os argumentos incluem quaisquer strings binárias, o resultado é uma string binária. Um argumento numérico é convertido para sua forma equivalente em string não binária.

`CONCAT()` retorna `NULL` se houver algum argumento em `NULL`.

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

Se `CONCAT()` for invocado dentro do cliente **mysql**, os resultados de cadeia binária são exibidos usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 4.5.1, “mysql — O cliente de string de comando MySQL”.

* `CONCAT_WS(separator,str1,str2,...)`

`CONCAT_WS()` significa "Concatenar com separador" e é uma forma especial de `CONCAT()`. O primeiro argumento é o separador para os demais argumentos. O separador é adicionado entre as strings a serem concatenadas. O separador pode ser uma string, assim como o restante dos argumentos. Se o separador for `NULL`, o resultado é `NULL`.

  ```sql
  mysql> SELECT CONCAT_WS(',', 'First name', 'Second name', 'Last Name');
          -> 'First name,Second name,Last Name'
  mysql> SELECT CONCAT_WS(',', 'First name', NULL, 'Last Name');
          -> 'First name,Last Name'
  ```

`CONCAT_WS()` não ignora cadeias de texto vazias. No entanto, ele ignora quaisquer valores de `NULL` após o argumento do separador.

* `ELT(N,str1,str2,str3,...)`

`ELT()` retorna o *`N`*º elemento da lista de strings: *`str1`* se *`N`* = `1`, *`str2`* se *`N`* = `2`, e assim por diante. Retorna `NULL` se *`N`* é menor que `1` ou maior que o número de argumentos. `ELT()` é o complemento de `FIELD()`.

  ```sql
  mysql> SELECT ELT(1, 'Aa', 'Bb', 'Cc', 'Dd');
          -> 'Aa'
  mysql> SELECT ELT(4, 'Aa', 'Bb', 'Cc', 'Dd');
          -> 'Dd'
  ```

* `EXPORT_SET(bits,on,off[,separator[,number_of_bits]])`(string-functions.html#function_export-set)

Retorna uma string de tal forma que, para cada bit definido no valor *`bits`*, você recebe uma string *`on`* e, para cada bit não definido no valor, você recebe uma string *`off`*. Os bits em *`bits`* são examinados de direita para esquerda (de bits de menor ordem para bits de maior ordem). As strings são adicionadas ao resultado de esquerda para direita, separadas pela string *`separator`* (o padrão é o caractere de vírgula `,`). O número de bits examinados é dado por *`number_of_bits`*, que tem um padrão de 64 se não for especificado. *`number_of_bits`* é clicado silenciosamente para 64 se for maior que 64. É tratado como um inteiro não assinado, então um valor de −1 é efetivamente o mesmo que 64.

  ```sql
  mysql> SELECT EXPORT_SET(5,'Y','N',',',4);
          -> 'Y,N,Y,N'
  mysql> SELECT EXPORT_SET(6,'1','0',',',10);
          -> '0,1,1,0,0,0,0,0,0,0'
  ```

* `FIELD(str,str1,str2,str3,...)`

Retorna o índice (posição) de *`str`* na lista *`str1`*, *`str2`*, *`str3`*, *`...`*. Retorna `0` se *`str`* não for encontrado.

Se todos os argumentos para `FIELD()` forem strings, todos os argumentos são comparados como strings. Se todos os argumentos forem números, eles são comparados como números. Caso contrário, os argumentos são comparados como duplos.

Se *`str`* for `NULL`, o valor de retorno é `0`, pois `NULL` não realiza comparação de igualdade com qualquer valor. `FIELD()` é o complemento de `ELT()`.

  ```sql
  mysql> SELECT FIELD('Bb', 'Aa', 'Bb', 'Cc', 'Dd', 'Ff');
          -> 2
  mysql> SELECT FIELD('Gg', 'Aa', 'Bb', 'Cc', 'Dd', 'Ff');
          -> 0
  ```

* `FIND_IN_SET(str,strlist)`

Retorna um valor no intervalo de 1 a *`N`* se a string *`str`* estiver na lista de strings *`strlist`* composta por substratos de *`N`*. Uma lista de strings é uma string composta por substratos separados por caracteres `,`. Se o primeiro argumento for uma string constante e o segundo for uma coluna do tipo `SET`, a função `FIND_IN_SET()` é otimizada para usar aritmética de bits. Retorna `0` se *`str`* não estiver em *`strlist`* ou se *`strlist`* for a string vazia. Retorna `NULL` se qualquer um dos argumentos for `NULL`. Esta função não funciona corretamente se o primeiro argumento contiver um caractere de vírgula (`,`).

  ```sql
  mysql> SELECT FIND_IN_SET('b','a,b,c,d');
          -> 2
  ```

* `FORMAT(X,D[,locale])`

Formata o número *`X`* para um formato como `'#,###,###.##'`, arredondado para *`D`* casas decimais, e retorna o resultado como uma string. Se *`D`* é `0`, o resultado não tem ponto decimal ou parte fracionária.

O terceiro parâmetro opcional permite especificar um local a ser usado para o ponto decimal do número do resultado, o separador de milhares e a separação entre os separadores. Os valores de local permitidos são os mesmos dos valores legais para a variável de sistema `lc_time_names` (consulte Seção 10.16, “Suporte de Locale do MySQL Server”). Se nenhum local for especificado, o padrão é `'en_US'`.

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

* `FROM_BASE64(str)`

Toma uma string codificada com as regras de codificação base-64 usadas por `TO_BASE64()` e retorna o resultado decodificado como uma string binária. O resultado é `NULL` se o argumento for `NULL` ou não for uma string válida base-64. Veja a descrição de `TO_BASE64()` para detalhes sobre as regras de codificação e decodificação.

  ```sql
  mysql> SELECT TO_BASE64('abc'), FROM_BASE64(TO_BASE64('abc'));
          -> 'JWJj', 'abc'
  ```

Se `FROM_BASE64()` for invocado dentro do cliente **mysql**, as cadeias binárias são exibidas usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 4.5.1, “mysql — O cliente de string de comando MySQL”.

* `HEX(str)`, `HEX(N)`

Para um argumento de cadeia *`str`*, `HEX()` retorna uma representação hexadecimal da cadeia *`str`* onde cada byte de cada caractere em *`str`* é convertido em dois dígitos hexadecimais. (Caracteres multibyte, portanto, se tornam mais do que dois dígitos.) A operação inversa é realizada pela função `UNHEX()`.

Para um argumento numérico *`N`*, `HEX()` retorna uma representação em cadeia hexadecimal da representação do valor de *`N`* tratado como um número de tipo longlong (`BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT)). Isso é equivalente a `CONV(N,10,16)`. A operação inversa é realizada por `CONV(HEX(N),16,10)`.

  ```sql
  mysql> SELECT X'616263', HEX('abc'), UNHEX(HEX('abc'));
          -> 'abc', 616263, 'abc'
  mysql> SELECT HEX(255), CONV(HEX(255),16,10);
          -> 'FF', 255
  ```

* `INSERT(str,pos,len,newstr)`

Retorna a string *`str`*, com a subcadeia que começa na posição *`pos`* e tem *`len`* caracteres substituída pela string *`newstr`*. Retorna a string original se *`pos`* não estiver dentro do comprimento da string. Substitui o resto da string a partir da posição *`pos`* se *`len`* não estiver dentro do comprimento do resto da string. Retorna *`NULL`* se qualquer argumento for *`NULL`*.

  ```sql
  mysql> SELECT INSERT('Quadratic', 3, 4, 'What');
          -> 'QuWhattic'
  mysql> SELECT INSERT('Quadratic', -1, 4, 'What');
          -> 'Quadratic'
  mysql> SELECT INSERT('Quadratic', 3, 100, 'What');
          -> 'QuWhat'
  ```

Essa função é segura para multibytes.

* `INSTR(str,substr)`

Retorna a posição da primeira ocorrência da subcadeia *`substr`* na cadeia *`str`*. Isso é o mesmo que a forma de dois argumentos de `LOCATE()`, exceto que a ordem dos argumentos é invertida.

  ```sql
  mysql> SELECT INSTR('foobarbar', 'bar');
          -> 4
  mysql> SELECT INSTR('xbar', 'foobar');
          -> 0
  ```

Essa função é segura para multibytes e é sensível ao caso apenas se pelo menos um argumento for uma string binária.

* `LCASE(str)`

`LCASE()` é sinônimo de `LOWER()`.

`LCASE()` usado em uma visualização é reescrito como `LOWER()` ao armazenar a definição da visualização. (Bug #12844279)

* `LEFT(str,len)`

Retorna os caracteres *`len`* mais à esquerda da string *`str`*, ou `NULL` se houver algum argumento como `NULL`.

  ```sql
  mysql> SELECT LEFT('foobarbar', 5);
          -> 'fooba'
  ```

Essa função é segura para multibytes.

* `LENGTH(str)`

Retorna o comprimento da string *`str`*, medido em bytes. Um caractere multibyte é considerado múltiplos bytes. Isso significa que, para uma string que contém cinco caracteres de 2 bytes, `LENGTH()` retorna `10`, enquanto `CHAR_LENGTH()` retorna `5`.

  ```sql
  mysql> SELECT LENGTH('text');
          -> 4
  ```

Nota

A função espacial `Length()` OpenGIS é denominada `ST_Length()` no MySQL.

* `LOAD_FILE(file_name)`

Leitura do arquivo e retorno dos conteúdos do arquivo como uma string. Para usar esta função, o arquivo deve estar localizado no host do servidor, você deve especificar o nome completo do caminho do arquivo e deve ter o privilégio `FILE`. O arquivo deve ser legível por todos e seu tamanho deve ser menor que `max_allowed_packet` bytes. Se a variável de sistema `secure_file_priv` estiver definida como um nome de diretório não vazio, o arquivo a ser carregado deve estar localizado nesse diretório.

Se o arquivo não existir ou não puder ser lido porque uma das condições anteriores não for atendida, a função retorna `NULL`.

A variável de sistema `character_set_filesystem` controla a interpretação dos nomes de arquivos que são fornecidos como strings literais.

  ```sql
  mysql> UPDATE t
              SET blob_col=LOAD_FILE('/tmp/picture')
              WHERE id=1;
  ```

* `LOCATE(substr,str)`, `LOCATE(substr,str,pos)`

A primeira sintaxe retorna a posição da primeira ocorrência da subcadeia *`substr`* na cadeia *`str`*. A segunda sintaxe retorna a posição da primeira ocorrência da subcadeia *`substr`* na cadeia *`str`*, começando na posição *`pos`*. Retorna `0` se *`substr`* não estiver em *`str`*. Retorna `NULL` se *`substr`* ou *`str`* é `NULL`.

  ```sql
  mysql> SELECT LOCATE('bar', 'foobarbar');
          -> 4
  mysql> SELECT LOCATE('xbar', 'foobar');
          -> 0
  mysql> SELECT LOCATE('bar', 'foobarbar', 5);
          -> 7
  ```

Essa função é segura para multibytes e é sensível ao caso apenas se pelo menos um argumento for uma string binária.

* `LOWER(str)`

Retorna a string *`str`* com todos os caracteres alterados para minúsculas de acordo com o mapeamento atual do conjunto de caracteres. O padrão é `latin1` (cp1252 da Europa Ocidental).

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

Para coletas de conjuntos de caracteres Unicode, `LOWER()` e `UPPER()` funcionam de acordo com o Algoritmo de Cotação Unicode (UCA) na versão do nome da cotação, se houver uma, e UCA 4.0.0 se nenhuma versão for especificada. Por exemplo, `utf8_unicode_520_ci` funciona de acordo com UCA 5.2.0, enquanto `utf8_unicode_ci` funciona de acordo com UCA 4.0.0. Veja a Seção 10.10.1, “Conjunto de Caracteres Unicode”.

Essa função é segura para multibytes.

Nas versões anteriores do MySQL, `LOWER()` usado em uma visão foi reescrito como `LCASE()` ao armazenar a definição da visão. No MySQL 5.7, `LOWER()` nunca é reescrito em tais casos, mas `LCASE()` usado em visões é, em vez disso, reescrito como `LOWER()`. (Bug #12844279)

* `LPAD(str,len,padstr)`

Retorna a string *`str`*, preenchida com a string *`padstr`* até um comprimento de *`len`* caracteres. Se *`str`* for mais longo que *`len`*, o valor de retorno é encurtado para *`len`* caracteres.

  ```sql
  mysql> SELECT LPAD('hi',4,'??');
          -> '??hi'
  mysql> SELECT LPAD('hi',1,'??');
          -> 'h'
  ```

* `LTRIM(str)`

Retorna a string *`str`* com os caracteres de espaço inicial removidos.

  ```sql
  mysql> SELECT LTRIM('  barbar');
          -> 'barbar'
  ```

Essa função é segura para multibytes.

* `MAKE_SET(bits,str1,str2,...)`

Retorna um conjunto de valores (uma string contendo substratos separados por caracteres `,`), consistindo nas strings que possuem o bit correspondente em *`bits`*. *`str1`* corresponde ao bit 0, *`str2`* ao bit 1, e assim por diante. Os valores de `NULL` em *`str1`*, *`str2`*, `...` não são anexados ao resultado.

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

* `MID(str,pos)`, `MID(str FROM pos)`[(string-functions.html#function_mid)]], `MID(str,pos,len)`, [`MID(str FROM pos FOR len)`][(string-functions.html#function_mid)]

`MID(str,pos,len)` é sinônimo de `SUBSTRING(str,pos,len)`.

* `OCT(N)`

Retorna uma representação em cadeia do valor octal de *`N`*, onde *`N`* é um número longlong (`BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT)). Isso é equivalente a `CONV(N,10,8)`. Retorna `NULL` se *`N`* for `NULL`.

  ```sql
  mysql> SELECT OCT(12);
          -> '14'
  ```

* `OCTET_LENGTH(str)`

`OCTET_LENGTH()` é sinônimo de `LENGTH()`.

* `ORD(str)`

Se o caractere mais à esquerda da string *`str`* for um caractere multibyte, retorne o código desse caractere, calculado a partir dos valores numéricos de seus bytes constituintes, usando esta fórmula:

  ```sql
    (1st byte code)
  + (2nd byte code * 256)
  + (3rd byte code * 256^2) ...
  ```

Se o caractere mais à esquerda não for um caractere multibyte, `ORD()` retorna o mesmo valor que a função `ASCII()`.

  ```sql
  mysql> SELECT ORD('2');
          -> 50
  ```

* `POSITION(substr IN str)`(string-functions.html#function_position)

`POSITION(substr IN str)`](string-functions.html#function_position) é sinônimo de `LOCATE(substr,str)`.

* `QUOTE(str)`

Cita uma cadeia para produzir um resultado que pode ser usado como um valor de dados devidamente escapado em uma declaração SQL. A cadeia é devolvida entre aspas simples e com cada instância de barra invertida (`\`), aspas simples (`'`), ASCII `NUL` e Ctrl+Z precedida por uma barra invertida. Se o argumento for `NULL`, o valor de retorno é a palavra “NULL” sem as aspas simples envolvendo.

  ```sql
  mysql> SELECT QUOTE('Don\'t!');
          -> 'Don\'t!'
  mysql> SELECT QUOTE(NULL);
          -> NULL
  ```

Para comparação, veja as regras de citação para strings literais e dentro da API C na Seção 9.1.1, “Strings Literals”, e mysql\_real\_escape\_string\_quote().

* `REPEAT(str,count)`

Retorna uma string composta pela string *`str`* repetida *`count`* vezes. Se *`count`* for menor que 1, retorna uma string vazia. Retorna `NULL` se *`str`* ou *`count`* forem `NULL`.

  ```sql
  mysql> SELECT REPEAT('MySQL', 3);
          -> 'MySQLMySQLMySQL'
  ```

* `REPLACE(str,from_str,to_str)`

Retorna a string *`str`* com todas as ocorrências da string *`from_str`* substituídas pela string *`to_str`*. `REPLACE()` realiza uma correspondência sensível ao caso quando procura *`from_str`*.

  ```sql
  mysql> SELECT REPLACE('www.mysql.com', 'w', 'Ww');
          -> 'WwWwWw.mysql.com'
  ```

Essa função é segura para multibytes.

* `REVERSE(str)`

Retorna a string *`str`* com a ordem dos caracteres invertida.

  ```sql
  mysql> SELECT REVERSE('abc');
          -> 'cba'
  ```

Essa função é segura para multibytes.

* `RIGHT(str,len)`

Retorna os caracteres mais à direita do *`len`* da string *`str`*, ou `NULL` se houver algum argumento que seja `NULL`.

  ```sql
  mysql> SELECT RIGHT('foobarbar', 4);
          -> 'rbar'
  ```

Essa função é segura para multibytes.

* `RPAD(str,len,padstr)`

Retorna a string *`str`*, preenchida com a string *`padstr`* até um comprimento de *`len`* caracteres. Se *`str`* for mais longo que *`len`*, o valor de retorno é encurtado para *`len`* caracteres.

  ```sql
  mysql> SELECT RPAD('hi',5,'?');
          -> 'hi???'
  mysql> SELECT RPAD('hi',1,'?');
          -> 'h'
  ```

Essa função é segura para multibytes.

* `RTRIM(str)`

Retorna a string *`str`* com os caracteres de espaço em branco finais removidos.

  ```sql
  mysql> SELECT RTRIM('barbar   ');
          -> 'barbar'
  ```

Essa função é segura para multibytes.

* `SOUNDEX(str)`

Retorna uma string de soundex de *`str`*. Duas strings que soam quase iguais devem ter strings de soundex idênticas. Uma string padrão de soundex tem quatro caracteres, mas a função `SUBSTRING()` retorna uma string arbitrariamente longa. Você pode usar `SUBSTRING()` no resultado para obter uma string de soundex padrão. Todos os caracteres não alfabéticos em *`str`* são ignorados. Todos os caracteres alfabéticos internacionais fora da faixa A-Z são tratados como vogais.

Importante

Ao usar `SOUNDEX()`, você deve estar ciente das seguintes limitações:

+ Essa função, conforme implementada atualmente, é destinada a funcionar bem com strings que estão apenas no idioma inglês. Strings em outros idiomas podem não produzir resultados confiáveis.

+ Esta função não é garantida para fornecer resultados consistentes com strings que utilizam conjuntos de caracteres multibyte, incluindo `utf-8`. Consulte o Bug #22638 para mais informações.

  ```sql
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

Retorna uma string composta por caracteres de espaço *`N`*.

  ```sql
  mysql> SELECT SPACE(6);
          -> '      '
  ```

* `SUBSTR(str,pos)`, `SUBSTR(str FROM pos)`[(string-functions.html#function_substr)]], `SUBSTR(str,pos,len)`, [`SUBSTR(str FROM pos FOR len)`][(string-functions.html#function_substr)]

`SUBSTR()` é sinônimo de `SUBSTRING()`.

* `SUBSTRING(str,pos)`, `SUBSTRING(str FROM pos)`[(string-functions.html#function_substring)]], `SUBSTRING(str,pos,len)`, [`SUBSTRING(str FROM pos FOR len)`][(string-functions.html#function_substring)]

Os formulários sem o argumento *`len`* retornam uma subcadeia da string *`str`* a partir da posição *`pos`*. Os formulários com o argumento *`len`* retornam uma subcadeia de *`len`* caracteres de comprimento a partir da string *`str`*, a partir da posição *`pos`*. Os formulários que usam `FROM` são a sintaxe padrão do SQL. Também é possível usar um valor negativo para *`pos`*. Neste caso, o início da subcadeia é *`pos`* caracteres a partir do final da string, em vez do início. Um valor negativo pode ser usado para *`pos`* em qualquer uma das formas desta função. Um valor de 0 para *`pos`* retorna uma string vazia.

Para todas as formas de `SUBSTRING()`, a posição do primeiro caractere na cadeia a partir da qual a subcadeia deve ser extraída é considerada como `1`.

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

Se *`len`* for menor que 1, o resultado é a string vazia.

* `SUBSTRING_INDEX(str,delim,count)`

Retorna a subcadeia da string *`str`* antes das ocorrências do delimitador *`delim`* na string. Se *`count`* for positivo, tudo à esquerda do delimitador final (contando da esquerda para a direita) é retornado. Se *`count`* for negativo, tudo à direita do delimitador final (contando da direita para a esquerda) é retornado. `SUBSTRING_INDEX()` realiza uma correspondência sensível ao caso quando procura por *`delim`*.

  ```sql
  mysql> SELECT SUBSTRING_INDEX('www.mysql.com', '.', 2);
          -> 'www.mysql'
  mysql> SELECT SUBSTRING_INDEX('www.mysql.com', '.', -2);
          -> 'mysql.com'
  ```

Essa função é segura para multibytes.

* `TO_BASE64(str)`

Converte o argumento de cadeia de caracteres para a forma codificada em base-64 e retorna o resultado como uma cadeia de caracteres com o conjunto de caracteres de conexão e a ordenação. Se o argumento não for uma cadeia de caracteres, ele é convertido em uma cadeia de caracteres antes da conversão ocorrer. O resultado é `NULL` se o argumento for `NULL`. As cadeias de caracteres codificadas em base-64 podem ser decodificadas usando a função `FROM_BASE64()`.

  ```sql
  mysql> SELECT TO_BASE64('abc'), FROM_BASE64(TO_BASE64('abc'));
          -> 'JWJj', 'abc'
  ```

Existem diferentes esquemas de codificação base-64. São as regras de codificação e decodificação utilizadas pelo `TO_BASE64()` e `FROM_BASE64()`:

+ O codificação para o valor alfabético 62 é `'+'`.

+ O codificação para o valor alfabético 63 é `'/'`.

+ A saída codificada consiste em grupos de 4 caracteres imprimíveis. Cada 3 bytes dos dados de entrada são codificados usando 4 caracteres. Se o último grupo estiver incompleto, ele é preenchido com caracteres `'='` até atingir uma extensão de 4.

+ Uma nova string é adicionada após cada 76 caracteres de saída codificada para dividir a saída longa em várias strings.

+ O Decoding reconhece e ignora nova string, retorno de carro, tabulação e espaço.

* `TRIM([{BOTH | LEADING | TRAILING} [remstr] FROM] str)`](string-functions.html#function_trim), [`TRIM([remstr FROM] str)`](string-functions.html#function_trim)

Retorna a string *`str`* com todos os prefixos ou sufixos de *`remstr`* removidos. Se nenhum dos especificadores `BOTH`, `LEADING` ou `TRAILING` for fornecido, `BOTH` é assumido. *`remstr`* é opcional e, se não especificado, os espaços são removidos.

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

* `UCASE(str)`

`UCASE()` é sinônimo de `UPPER()`.

Em MySQL 5.7, `UCASE()` usado em uma visão é reescrito como `UPPER()` ao armazenar a definição da visão. (Bug #12844279)

* `UNHEX(str)`

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

Os caracteres na string de argumento devem ser dígitos hexadecimais válidos: `'0'` .. `'9'`, `'A'` .. `'F'`, `'a'` .. `'f'`. Se o argumento contiver quaisquer dígitos não hexadecimais, o resultado é `NULL`:

  ```sql
  mysql> SELECT UNHEX('GG');
  +-------------+
  | UNHEX('GG') |
  +-------------+
  | NULL        |
  +-------------+
  ```

Um resultado de `NULL` pode ocorrer se o argumento de `UNHEX()` for uma coluna de `BINARY`, porque os valores são preenchidos com `0x00` bytes ao serem armazenados, mas esses bytes não são removidos na recuperação. Por exemplo, `'41'` é armazenado em uma coluna de `CHAR(3)` como `'41 '` e recuperado como `'41'` (com o espaço de preenchimento final removido), então `UNHEX()` para o valor da coluna retorna `X'41'`. Por outro lado, `'41'` é armazenado em uma coluna de `BINARY(3)` como `'41\0'` e recuperado como `'41\0'` (com o byte de preenchimento final `0x00` não removido). `'\0'` não é um dígito hexadecimal legal, então `UNHEX()` para o valor da coluna retorna `NULL`.

Para um argumento numérico *`N`*, o inverso de `HEX(N)` não é realizado por `UNHEX()`. Use `CONV(HEX(N),16,10)` em vez disso. Veja a descrição de `HEX()`.

Se `UNHEX()` for invocado dentro do cliente **mysql**, as cadeias binárias são exibidas usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 4.5.1, “mysql — O cliente de string de comando MySQL”.

* `UPPER(str)`

Retorna a string *`str`* com todos os caracteres alterados para maiúsculas de acordo com o mapeamento atual do conjunto de caracteres. O padrão é `latin1` (cp1252 da Europa Ocidental).

  ```sql
  mysql> SELECT UPPER('Hej');
          -> 'HEJ'
  ```

Consulte a descrição de `LOWER()` para obter informações que também se aplicam a `UPPER()`. Isso incluiu informações sobre como realizar a conversão de maiúsculas e minúsculas de strings binárias (`BINARY`, `VARBINARY`, `BLOB`) para as quais essas funções são ineficazes, e informações sobre dobramento de caso para conjuntos de caracteres Unicode.

Essa função é segura para multibytes.

Nas versões anteriores do MySQL, `UPPER()` usado em uma visão foi reescrito como `UCASE()` ao armazenar a definição da visão. No MySQL 5.7, `UPPER()` nunca é reescrito em tais casos, mas `UCASE()` usado em visões é, em vez disso, reescrito como `UPPER()`. (Bug #12844279)

* `WEIGHT_STRING(str [AS {CHAR|BINARY}(N)] [LEVEL levels] [flags])`(string-functions.html#function_weight-string)

  `levels: N [ASC|DESC|REVERSE] [, N [ASC|DESC|REVERSE]] ...`

Essa função retorna a string de peso para a string de entrada. O valor de retorno é uma string binária que representa o valor de comparação e ordenação da string. Ela tem essas propriedades:

+ Se `WEIGHT_STRING(str1)` = `WEIGHT_STRING(str2)`, então `str1 = str2` (*`str1`* e *`str2`* são considerados iguais)

+ Se `WEIGHT_STRING(str1)` < `WEIGHT_STRING(str2)`, então `str1 < str2` (*`str1`* ordena antes de *`str2`*)

`WEIGHT_STRING()` é uma função de depuração destinada ao uso interno. Seu comportamento pode mudar sem aviso entre as versões do MySQL. Ela pode ser usada para testar e depurar colatinas, especialmente se você estiver adicionando uma nova cotação. Veja a Seção 10.14, “Adicionando uma cotação a um conjunto de caracteres”.

Esta lista resume brevemente os argumentos. Mais detalhes são dados na discussão que segue a lista.

+ *`str`*: A expressão da string de entrada.

+ `AS` cláusula: Opcional; transfira a string de entrada para um tipo e comprimento determinados.

+ `LEVEL` cláusula: Opcional; especifique os níveis de peso para o valor de retorno.

+ *`flags`*: Opcional; não utilizado.

A string de entrada, *`str`*, é uma expressão de string. Se a entrada for uma string não binária (caractere), como `CHAR`, `VARCHAR` ou `TEXT`, o valor de retorno contém os pesos de ordenação para a string. Se a entrada for uma string binária (byte), como `BINARY`, `VARBINARY` ou `BLOB`, o valor de retorno é o mesmo que a entrada (o peso de cada byte em uma string binária é o valor do byte). Se a entrada for `NULL`, `WEIGHT_STRING()` retorna `NULL`.

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

Os exemplos anteriores usam `HEX()` para exibir o resultado de `WEIGHT_STRING()`. Como o resultado é um valor binário, `HEX()` pode ser especialmente útil quando o resultado contém valores não imprimíveis, para exibí-lo em forma imprimível:

  ```sql
  mysql> SET @s = CONVERT(X'C39F' USING utf8) COLLATE utf8_czech_ci;
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

A cláusula `LEVEL` pode ser dada para especificar que o valor de retorno deve conter pesos para níveis específicos de cotação.

O especificador *`levels`* que segue a palavra-chave `LEVEL` pode ser dado como uma lista de um ou mais inteiros separados por vírgulas, ou como uma faixa de dois inteiros separados por uma barra. Espaços em branco em torno dos caracteres de pontuação não importam.

Exemplos:

  ```sql
  LEVEL 1
  LEVEL 2, 3, 5
  LEVEL 1-3
  ```

Qualquer nível menor que 1 é tratado como 1. Qualquer nível maior que o máximo para a correção de cadeia de entrada é tratado como máximo para a correção. O máximo varia por correção, mas nunca é maior que 6.

Em uma lista de níveis, os níveis devem ser apresentados em ordem crescente. Em uma faixa de níveis, se o segundo número for menor que o primeiro, ele é tratado como o primeiro número (por exemplo, 4-2 é o mesmo que 4-4).

Se a cláusula `LEVEL` for omitida, o MySQL assume `LEVEL 1 - max`, onde *`max`* é o nível máximo para a correção de texto.

Se `LEVEL` for especificado usando sintaxe de lista (e não sintaxe de intervalo), qualquer número de nível pode ser seguido por esses modificadores:

+ `ASC`: Retorne os pesos sem modificação. Este é o padrão.

+ `DESC`: Retorne pesos inversos de forma bit a bit (por exemplo, `0x78f0 DESC` = `0x870f`).

+ `REVERSE`: Retorne os pesos na ordem inversa (ou seja, os pesos para a string invertida, com o primeiro caractere como último e o último como primeiro).

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

A cláusula *`flags`* atualmente não é utilizada.

Se `WEIGHT_STRING()` for invocado dentro do cliente **mysql**, as cadeias binárias são exibidas usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 4.5.1, “mysql — O cliente de string de comando MySQL”.

### 12.8.1 Funções e operadores de comparação de strings

**Tabela 12.13 Funções e operadores de comparação de strings**

<table frame="box" rules="all" summary="A reference that lists string comparison functions and operators."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Name</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>LIKE</code></td> <td>Encontre padrões simples</td> </tr><tr><td><code>NOT LIKE</code></td> <td>Negação de correspondência de padrão simples</td> </tr><tr><td><code>STRCMP()</code></td> <td>Compare duas strings</td> </tr></tbody></table>

Se uma função de cadeia receber uma cadeia binária como argumento, a cadeia resultante também será uma cadeia binária. Um número convertido em uma cadeia é tratado como uma cadeia binária. Isso afeta apenas as comparações.

Normalmente, se qualquer expressão em uma comparação de string for sensível ao caso, a comparação é realizada de forma sensível ao caso.

Se uma função de cadeia for invocada dentro do cliente **mysql**, as cadeias binárias são exibidas usando notação hexadecimal, dependendo do valor do `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 4.5.1, “mysql — O cliente de string de comando MySQL”.

* `expr LIKE pat [ESCAPE 'escape_char']`(string-comparison-functions.html#operator_like)

Contagem de padrões usando um padrão SQL. Retorna `1` (`TRUE`) ou `0` (`FALSE`). Se algum de *`expr`* ou *`pat`* for `NULL`, o resultado é `NULL`.

O padrão não precisa ser uma string literal. Por exemplo, ele pode ser especificado como uma expressão de string ou coluna de tabela. Neste último caso, a coluna deve ser definida como um dos tipos de dados de string do MySQL (consulte a Seção 11.3, “Tipos de dados de string”).

De acordo com o padrão SQL, `LIKE` realiza a correspondência por caractere, portanto, pode produzir resultados diferentes da comparação operador `=`:

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

Em particular, os espaços em branco finais são significativos, o que não é verdade para comparações de strings não binárias (os valores de `CHAR`, `VARCHAR` e `TEXT`) realizadas com o operador `=`:

  ```sql
  mysql> SELECT 'a' = 'a ', 'a' LIKE 'a ';
  +------------+---------------+
  | 'a' = 'a ' | 'a' LIKE 'a ' |
  +------------+---------------+
  |          1 |             0 |
  +------------+---------------+
  1 row in set (0.00 sec)
  ```

Com `LIKE`, você pode usar os seguintes dois caracteres curinga no padrão:

+ `%` corresponde a qualquer número de caracteres, mesmo zero caracteres.

+ `_` corresponde exatamente a um caractere.

  ```sql
  mysql> SELECT 'David!' LIKE 'David_';
          -> 1
  mysql> SELECT 'David!' LIKE '%D%v%';
          -> 1
  ```

Para testar instâncias literais de um caractere comodínio, anteceda-o pelo caractere de escape. Se você não especificar o caractere `ESCAPE`, assume-se `\`, a menos que o modo SQL `NO_BACKSLASH_ESCAPES` esteja habilitado. Nesse caso, nenhum caractere de escape é usado.

+ `\%` corresponde a um caractere de `%`.

+ `\_` corresponde a um caractere de `_`.

  ```sql
  mysql> SELECT 'David!' LIKE 'David\_';
          -> 0
  mysql> SELECT 'David_' LIKE 'David\_';
          -> 1
  ```

Para especificar um caractere de escape diferente, use a cláusula `ESCAPE`:

  ```sql
  mysql> SELECT 'David_' LIKE 'David|_' ESCAPE '|';
          -> 1
  ```

A sequência de escape deve ter um único caractere para especificar o caractere de escape, ou deve ser vazia para especificar que nenhum caractere de escape é usado. A expressão deve ser avaliada como uma constante no momento da execução. Se o modo `NO_BACKSLASH_ESCAPES` SQL estiver habilitado, a sequência não pode ser vazia.

As seguintes declarações ilustram que as comparações de cadeias não são sensíveis ao caso, a menos que uma das operações seja sensível ao caso (utilize uma collation sensível ao caso ou seja uma cadeia binária):

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

Como uma extensão do SQL padrão, o MySQL permite `LIKE` em expressões numéricas.

  ```sql
  mysql> SELECT 10 LIKE '1%';
          -> 1
  ```

No caso de tais situações, o MySQL tenta realizar a conversão implícita da expressão em uma string. Veja a Seção 12.3, “Conversão de Tipo na Avaliação da Expressão”.

Nota

O MySQL utiliza a sintaxe de escape C em strings (por exemplo, `\n` para representar o caractere de nova string). Se você deseja que uma string `LIKE` contenha um literal `\`, você deve duplicá-la. (A menos que o modo SQL `NO_BACKSLASH_ESCAPES` esteja habilitado, nesse caso, nenhum caractere de escape é usado.) Por exemplo, para procurar `\n`, especifique-o como `\\n`. Para procurar `\`, especifique-o como `\\\\`; isso ocorre porque os traços são removidos uma vez pelo analisador e novamente quando a correspondência do padrão é feita, deixando um único traço para ser correspondido.

Exceção: No final da string de padrão, a barra invertida pode ser especificada como `\\`. No final da string, a barra invertida representa a si mesma porque não há nada a seguir para escapar. Suponha que uma tabela contenha os seguintes valores:

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

Para testar valores que terminam com barra invertida, você pode combinar os valores usando qualquer um dos seguintes padrões:

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

* `expr NOT LIKE pat [ESCAPE 'escape_char']`(string-comparison-functions.html#operator_not-like)

Isto é o mesmo que `NOT (expr LIKE pat [ESCAPE 'escape_char'])`.

Nota

Consultas agregadas que envolvem comparações `NOT LIKE` com colunas que contêm (string-comparison-functions.html#operator_not-like) podem gerar resultados inesperados. Por exemplo, considere a tabela e os dados a seguir:

  ```sql
  CREATE TABLE foo (bar VARCHAR(10));

  INSERT INTO foo VALUES (NULL), (NULL);
  ```

A consulta `SELECT COUNT(*) FROM foo WHERE bar LIKE '%baz%';` retorna `0`. Você pode supor que `SELECT COUNT(*) FROM foo WHERE bar NOT LIKE '%baz%';` retornaria `2`. No entanto, isso não é o caso: a segunda consulta retorna `0`. Isso ocorre porque `NULL NOT LIKE expr` sempre retorna `NULL`, independentemente do valor de *`expr`*. O mesmo vale para consultas agregadas que envolvem `NULL` e comparações usando [`NOT RLIKE`](regexp.html#operator_not-regexp) ou [`NOT REGEXP`](regexp.html#operator_not-regexp). Nesses casos, você deve testar explicitamente para `NOT NULL` usando `OR` (e não `AND`, como mostrado aqui:

  ```sql
  SELECT COUNT(*) FROM foo WHERE bar NOT LIKE '%baz%' OR bar IS NULL;
  ```

* `STRCMP(expr1,expr2)`

`STRCMP()` retorna `0` se as cadeias de caracteres forem iguais, `-1` se o primeiro argumento for menor que o segundo de acordo com a ordem de classificação atual, e `1` caso contrário.

  ```sql
  mysql> SELECT STRCMP('text', 'text2');
          -> -1
  mysql> SELECT STRCMP('text2', 'text');
          -> 1
  mysql> SELECT STRCMP('text', 'text');
          -> 0
  ```

`STRCMP()` realiza a comparação usando a collation dos argumentos.

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

Se as colatações forem incompatíveis, um dos argumentos deve ser convertido para ser compatível com o outro. Veja a Seção 10.8.4, “Coercitividade da Colatação em Expressões”.

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

### 12.8.2 Regras de Expressão Regulares

**Tabela 12.14 Funções e operadores de expressão regular**

<table frame="box" rules="all" summary="A reference that lists regular expression functions and operators."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Name</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>NOT REGEXP</code></td> <td>Negación de REGEXP</td> </tr><tr><td><code>REGEXP</code></td> <td>Se a cadeia corresponde à expressão regular</td> </tr><tr><td><code>RLIKE</code></td> <td>Se a cadeia corresponde à expressão regular</td> </tr></tbody></table>

Uma expressão regular é uma maneira poderosa de especificar um padrão para uma busca complexa. Esta seção discute os operadores disponíveis para correspondência com expressão regular e ilustra, com exemplos, alguns dos caracteres especiais e construções que podem ser usados para operações de expressão regular. Veja também a Seção 3.3.4.7, “Correspondência de Padrão”.

O MySQL utiliza a implementação de expressões regulares de Henry Spencer, que visa conformidade com o POSIX 1003.2. O MySQL utiliza a versão estendida para suportar operações de correspondência de padrões de expressão regular em declarações SQL. Esta seção não contém todos os detalhes que podem ser encontrados na página do manual `regex(7)` de Henry Spencer. Essa página do manual está incluída nas distribuições de código-fonte do MySQL, no arquivo `regex.7` sob o diretório `regex`.

* Descrições das funções e operadores de expressão regular
* Sintaxe da expressão regular

#### Descrições das funções e operadores de expressão regular

* `expr NOT REGEXP pat`(regexp.html#operator_not-regexp), `expr NOT RLIKE pat`(regexp.html#operator_not-regexp)

Isto é o mesmo que `NOT (expr REGEXP pat)`.

* `expr REGEXP pat`(regexp.html#operator_regexp), `expr RLIKE pat`(regexp.html#operator_regexp)

Devolve 1 se a string *`expr`* corresponder à expressão regular especificada pelo padrão *`pat`*, caso contrário, 0. Se *`expr`* ou *`pat`* for `NULL`, o valor de retorno é `NULL`.

`RLIKE` é sinônimo de `REGEXP`.

O padrão pode ser uma expressão regular estendida, cuja sintaxe é discutida na Sintaxe de Expressões Regulares. O padrão não precisa ser uma string literal. Por exemplo, ele pode ser especificado como uma expressão de string ou coluna de tabela.

Nota

O MySQL utiliza a sintaxe de escape C em strings (por exemplo, `\n` para representar o caractere de nova string). Se você deseja que seu *`expr`* ou *`pat`* argumento contenha um literal `\`, você deve duplicá-lo. (A menos que o modo SQL `NO_BACKSLASH_ESCAPES` esteja habilitado, nesse caso, nenhum caractere de escape é usado.)

As operações de expressão regular utilizam o conjunto de caracteres e a ordenação da expressão e do padrão de string quando decidem o tipo de um caractere e realizam a comparação. Se os argumentos tiverem conjuntos de caracteres ou ordenações diferentes, as regras de coercibilidade se aplicam conforme descrito na Seção 10.8.4, “Coercibilidade de ordenação em expressões”. Se qualquer argumento for uma string binária, os argumentos são tratados de forma sensível ao caso como strings binárias.

  ```sql
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

Aviso

Os operadores `REGEXP` e `RLIKE` funcionam de forma por byte, portanto, não são seguros para multibytes e podem produzir resultados inesperados com conjuntos de caracteres multibytes. Além disso, esses operadores comparam caracteres por seus valores de byte e caracteres acentuados podem não ser considerados iguais, mesmo que uma determinada ordenação os trate como iguais.

#### Sintaxe de Expressão Regular

Uma expressão regular descreve um conjunto de cadeias de caracteres. A expressão regular mais simples é aquela que não possui caracteres especiais. Por exemplo, a expressão regular `hello` corresponde a `hello` e nada mais.

As expressões regulares não triviais utilizam certos construtos especiais para que possam corresponder a mais de uma cadeia. Por exemplo, a expressão regular `hello|world` contém o operador de alternância `|` e corresponde ao `hello` ou `world`.

Como exemplo mais complexo, a expressão regular `B[an]*s` corresponde a qualquer uma das cadeias de caracteres `Bananas`, `Baaaaas`, `Bs` e qualquer outra cadeia de caracteres que comece com um `B`, termine com um `s` e contenha qualquer número de caracteres `a` ou `n` entre eles.

Uma expressão regular para o operador `REGEXP` pode usar qualquer um dos seguintes caracteres especiais e construções:

* `^`

Conjuntar o início de uma cadeia.

  ```sql
  mysql> SELECT 'fo\nfo' REGEXP '^fo$';                   -> 0
  mysql> SELECT 'fofo' REGEXP '^fo';                      -> 1
  ```

* `$`

Conecte as extremidades de uma corda.

  ```sql
  mysql> SELECT 'fo\no' REGEXP '^fo\no$';                 -> 1
  mysql> SELECT 'fo\no' REGEXP '^fo$';                    -> 0
  ```

* `.`

Corresponda a qualquer caractere (incluindo retorno de carro e nova string).

  ```sql
  mysql> SELECT 'fofo' REGEXP '^f.*$';                    -> 1
  mysql> SELECT 'fo\r\nfo' REGEXP '^f.*$';                -> 1
  ```

* `a*`

Corresponda a qualquer sequência de zero ou mais caracteres `a`.

  ```sql
  mysql> SELECT 'Ban' REGEXP '^Ba*n';                     -> 1
  mysql> SELECT 'Baaan' REGEXP '^Ba*n';                   -> 1
  mysql> SELECT 'Bn' REGEXP '^Ba*n';                      -> 1
  ```

* `a+`

Corresponda a qualquer sequência de um ou mais caracteres `a`.

  ```sql
  mysql> SELECT 'Ban' REGEXP '^Ba+n';                     -> 1
  mysql> SELECT 'Bn' REGEXP '^Ba+n';                      -> 0
  ```

* `a?`

Corresponda com zero ou um caractere `a`.

  ```sql
  mysql> SELECT 'Bn' REGEXP '^Ba?n';                      -> 1
  mysql> SELECT 'Ban' REGEXP '^Ba?n';                     -> 1
  mysql> SELECT 'Baan' REGEXP '^Ba?n';                    -> 0
  ```

* `de|abc`

Alternância; corresponda a qualquer uma das sequências `de` ou `abc`.

  ```sql
  mysql> SELECT 'pi' REGEXP 'pi|apa';                     -> 1
  mysql> SELECT 'axe' REGEXP 'pi|apa';                    -> 0
  mysql> SELECT 'apa' REGEXP 'pi|apa';                    -> 1
  mysql> SELECT 'apa' REGEXP '^(pi|apa)$';                -> 1
  mysql> SELECT 'pi' REGEXP '^(pi|apa)$';                 -> 1
  mysql> SELECT 'pix' REGEXP '^(pi|apa)$';                -> 0
  ```

* `(abc)*`

Corresponda zero ou mais instâncias da sequência `abc`.

  ```sql
  mysql> SELECT 'pi' REGEXP '^(pi)*$';                    -> 1
  mysql> SELECT 'pip' REGEXP '^(pi)*$';                   -> 0
  mysql> SELECT 'pipi' REGEXP '^(pi)*$';                  -> 1
  ```

* `{1}`, `{2,3}`

Repetição; as notações `{n}` e `{m,n}` fornecem uma maneira mais geral de escrever expressões regulares que correspondem a muitas ocorrências do átomo anterior (ou “pedaço”) do padrão. *`m`* e *`n`* são inteiros.

+ `a*`

Pode ser escrito como `a{0,}`.

+ `a+`

Pode ser escrito como `a{1,}`.

+ `a?`

Pode ser escrito como `a{0,1}`.

Para ser mais preciso, `a{n}` corresponde exatamente a instâncias de *`n`* de `a`. `a{n,}` corresponde a *`n`* ou mais instâncias de `a`. `a{m,n}` corresponde a *`m`* até *`n`* de `a`, inclusive. Se ambos *`m`* e *`n`* forem fornecidos, *`m`* deve ser menor ou igual a *`n`*.

*`m`* e *`n`* devem estar na faixa de `0` a `RE_DUP_MAX` (padrão 255), inclusive.

  ```sql
  mysql> SELECT 'abcde' REGEXP 'a[bcd]{2}e';              -> 0
  mysql> SELECT 'abcde' REGEXP 'a[bcd]{3}e';              -> 1
  mysql> SELECT 'abcde' REGEXP 'a[bcd]{1,10}e';           -> 1
  ```

* `[a-dX]`, `[^a-dX]`

Converte qualquer caractere que seja (ou não seja, se `^` for usado) `a`, `b`, `c`, `d` ou `X`. Um caractere `-` entre dois outros caracteres forma uma faixa que corresponde a todos os caracteres do primeiro caractere ao segundo. Por exemplo, `[0-9]` corresponde a qualquer dígito decimal. Para incluir um caractere literal `]`, ele deve seguir imediatamente o parêntese de abertura `[`. Para incluir um caractere literal `-`, ele deve ser escrito primeiro ou último. Qualquer caractere que não tenha um significado especial definido dentro de um par `[]` corresponde apenas a si mesmo.

  ```sql
  mysql> SELECT 'aXbc' REGEXP '[a-dXYZ]';                 -> 1
  mysql> SELECT 'aXbc' REGEXP '^[a-dXYZ]$';               -> 0
  mysql> SELECT 'aXbc' REGEXP '^[a-dXYZ]+$';              -> 1
  mysql> SELECT 'aXbc' REGEXP '^[^a-dXYZ]+$';             -> 0
  mysql> SELECT 'gheis' REGEXP '^[^a-dXYZ]+$';            -> 1
  mysql> SELECT 'gheisa' REGEXP '^[^a-dXYZ]+$';           -> 0
  ```

* `[.characters.]`

Dentro de uma expressão em colchetes (escrita usando `[` e `]`), corresponde à sequência de caracteres desse elemento de comparação. `characters` é um único caractere ou um nome de caractere como `newline`. O quadro a seguir lista os nomes de caracteres permitidos.

A tabela a seguir mostra os nomes de caracteres permitidos e os caracteres que correspondem a eles. Para caracteres fornecidos como valores numéricos, os valores são representados em octal.

  <table summary="Permissible character names and characters they match. To save space, the column pairing of Name and Character are presented in a four column table format in this order: Name, Character, Name, Character. For characters given as numeric values, the values are represented in octal."><col style="width: 25%"/><col style="width: 25%"/><col style="width: 25%"/><col style="width: 25%"/><thead><tr> <th>Name</th> <th>Character</th> <th>Name</th> <th>Character</th> </tr></thead><tbody><tr> <th><code>NUL</code></th> <td><code>0</code></td> <td><code>SOH</code></td> <td><code>001</code></td> </tr><tr> <th><code>STX</code></th> <td><code>002</code></td> <td><code>ETX</code></td> <td><code>003</code></td> </tr><tr> <th><code>EOT</code></th> <td><code>004</code></td> <td><code>ENQ</code></td> <td><code>005</code></td> </tr><tr> <th><code>ACK</code></th> <td><code>006</code></td> <td><code>BEL</code></td> <td><code>007</code></td> </tr><tr> <th><code>alert</code></th> <td><code>007</code></td> <td><code>BS</code></td> <td><code>010</code></td> </tr><tr> <th><code>backspace</code></th> <td><code>'\b'</code></td> <td><code>HT</code></td> <td><code>011</code></td> </tr><tr> <th><code>tab</code></th> <td><code>'\t'</code></td> <td><code>LF</code></td> <td><code>012</code></td> </tr><tr> <th><code>newline</code></th> <td><code>'\n'</code></td> <td><code>VT</code></td> <td><code>013</code></td> </tr><tr> <th><code>vertical-tab</code></th> <td><code>'\v'</code></td> <td><code>FF</code></td> <td><code>014</code></td> </tr><tr> <th><code>form-feed</code></th> <td><code>'\f'</code></td> <td><code>CR</code></td> <td><code>015</code></td> </tr><tr> <th><code>carriage-return</code></th> <td><code>'\r'</code></td> <td><code>SO</code></td> <td><code>016</code></td> </tr><tr> <th><code>SI</code></th> <td><code>017</code></td> <td><code>DLE</code></td> <td><code>020</code></td> </tr><tr> <th><code>DC1</code></th> <td><code>021</code></td> <td><code>DC2</code></td> <td><code>022</code></td> </tr><tr> <th><code>DC3</code></th> <td><code>023</code></td> <td><code>DC4</code></td> <td><code>024</code></td> </tr><tr> <th><code>NAK</code></th> <td><code>025</code></td> <td><code>SYN</code></td> <td><code>026</code></td> </tr><tr> <th><code>ETB</code></th> <td><code>027</code></td> <td><code>CAN</code></td> <td><code>030</code></td> </tr><tr> <th><code>EM</code></th> <td><code>031</code></td> <td><code>SUB</code></td> <td><code>032</code></td> </tr><tr> <th><code>ESC</code></th> <td><code>033</code></td> <td><code>IS4</code></td> <td><code>034</code></td> </tr><tr> <th><code>FS</code></th> <td><code>034</code></td> <td><code>IS3</code></td> <td><code>035</code></td> </tr><tr> <th><code>GS</code></th> <td><code>035</code></td> <td><code>IS2</code></td> <td><code>036</code></td> </tr><tr> <th><code>RS</code></th> <td><code>036</code></td> <td><code>IS1</code></td> <td><code>037</code></td> </tr><tr> <th><code>US</code></th> <td><code>037</code></td> <td><code>space</code></td> <td><code>' '</code></td> </tr><tr> <th><code>exclamation-mark</code></th> <td><code>'!'</code></td> <td><code>quotation-mark</code></td> <td><code>'"'</code></td> </tr><tr> <th><code>number-sign</code></th> <td><code>'#'</code></td> <td><code>dollar-sign</code></td> <td><code>'$'</code></td> </tr><tr> <th><code>percent-sign</code></th> <td><code>'%'</code></td> <td><code>ampersand</code></td> <td><code>'&amp;'</code></td> </tr><tr> <th><code>apostrophe</code></th> <td><code>'\''</code></td> <td><code>left-parenthesis</code></td> <td><code>'('</code></td> </tr><tr> <th><code>right-parenthesis</code></th> <td><code>')'</code></td> <td><code>asterisk</code></td> <td><code>'*'</code></td> </tr><tr> <th><code>plus-sign</code></th> <td><code>'+'</code></td> <td><code>comma</code></td> <td><code>','</code></td> </tr><tr> <th><code>hyphen</code></th> <td><code>'-'</code></td> <td><code>hyphen-minus</code></td> <td><code>'-'</code></td> </tr><tr> <th><code>period</code></th> <td><code>'.'</code></td> <td><code>full-stop</code></td> <td><code>'.'</code></td> </tr><tr> <th><code>slash</code></th> <td><code>'/'</code></td> <td><code>solidus</code></td> <td><code>'/'</code></td> </tr><tr> <th><code>zero</code></th> <td><code>'0'</code></td> <td><code>one</code></td> <td><code>'1'</code></td> </tr><tr> <th><code>two</code></th> <td><code>'2'</code></td> <td><code>three</code></td> <td><code>'3'</code></td> </tr><tr> <th><code>four</code></th> <td><code>'4'</code></td> <td><code>five</code></td> <td><code>'5'</code></td> </tr><tr> <th><code>six</code></th> <td><code>'6'</code></td> <td><code>seven</code></td> <td><code>'7'</code></td> </tr><tr> <th><code>eight</code></th> <td><code>'8'</code></td> <td><code>nine</code></td> <td><code>'9'</code></td> </tr><tr> <th><code>colon</code></th> <td><code>':'</code></td> <td><code>semicolon</code></td> <td><code>';'</code></td> </tr><tr> <th><code>less-than-sign</code></th> <td><code>'&lt;'</code></td> <td><code>equals-sign</code></td> <td><code>'='</code></td> </tr><tr> <th><code>greater-than-sign</code></th> <td><code>'&gt;'</code></td> <td><code>question-mark</code></td> <td><code>'?'</code></td> </tr><tr> <th><code>commercial-at</code></th> <td><code>'@'</code></td> <td><code>left-square-bracket</code></td> <td><code>'['</code></td> </tr><tr> <th><code>backslash</code></th> <td><code>'\\'</code></td> <td><code>reverse-solidus</code></td> <td><code>'\\'</code></td> </tr><tr> <th><code>right-square-bracket</code></th> <td><code>']'</code></td> <td><code>circumflex</code></td> <td><code>'^'</code></td> </tr><tr> <th><code>circumflex-accent</code></th> <td><code>'^'</code></td> <td><code>underscore</code></td> <td><code>'_'</code></td> </tr><tr> <th><code>low-line</code></th> <td><code>'_'</code></td> <td><code>grave-accent</code></td> <td><code>'`'</code></td> </tr><tr> <th><code>left-brace</code></th> <td><code>'{'</code></td> <td><code>left-curly-bracket</code></td> <td><code>'{'</code></td> </tr><tr> <th><code>vertical-line</code></th> <td><code>'|'</code></td> <td><code>right-brace</code></td> <td><code>'}'</code></td> </tr><tr> <th><code>right-curly-bracket</code></th> <td><code>'}'</code></td> <td><code>tilde</code></td> <td><code>'~'</code></td> </tr><tr> <th><code>DEL</code></th> <td><code>177</code></td> <td></td> <td></td> </tr></tbody></table>

  ```sql
  mysql> SELECT '~' REGEXP '[[.~.]]';                     -> 1
  mysql> SELECT '~' REGEXP '[[.tilde.]]';                 -> 1
  ```

* `[=character_class=]`

Dentro de uma expressão em chaves (escrita usando `[` e `]`), `[=character_class=]` representa uma classe de equivalência. Ela corresponde a todos os caracteres com o mesmo valor de collation, incluindo a si mesma. Por exemplo, se `o` e `(+)` são os membros de uma classe de equivalência, `[[=o=]]`, `[[=(+)=]]` e `[o(+)]` são todos sinônimos. Uma classe de equivalência não pode ser usada como um ponto final de uma faixa.

* `[:character_class:]`

Dentro de uma expressão entre chaves (escrita usando `[` e `]`), `[:character_class:]` representa uma classe de caracteres que corresponde a todos os caracteres pertencentes a essa classe. O seguinte quadro lista os nomes padrão das classes. Esses nomes representam as classes de caracteres definidas na página do manual `ctype(3)`. Um local específico pode fornecer outros nomes de classe. Uma classe de caracteres não pode ser usada como um ponto final de uma faixa.

  <table summary="Character class names and the meaning of each class."><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Character Class Name</th> <th>Significado</th> </tr></thead><tbody><tr> <td><code>alnum</code></td> <td>Caracteres alfanuméricos</td> </tr><tr> <td><code>alpha</code></td> <td>Caracteres alfabéticos</td> </tr><tr> <td><code>blank</code></td> <td>Caracteres de espaço em branco</td> </tr><tr> <td><code>cntrl</code></td> <td>Caracteres de controle</td> </tr><tr> <td><code>digit</code></td> <td>Caracteres numéricos</td> </tr><tr> <td><code>graph</code></td> <td>Personagens gráficos</td> </tr><tr> <td><code>lower</code></td> <td>letras alfabéticas minúsculas</td> </tr><tr> <td><code>print</code></td> <td>Caracteres gráficos ou espaciais</td> </tr><tr> <td><code>punct</code></td> <td>Caracteres de pontuação</td> </tr><tr> <td><code>space</code></td> <td>Espaço, tabulação, nova string e retorno de carro</td> </tr><tr> <td><code>upper</code></td> <td>Letras maiúsculas alfabéticas</td> </tr><tr> <td><code>xdigit</code></td> <td>Caracteres de dígitos hexadecimais</td> </tr></tbody></table>

  ```sql
  mysql> SELECT 'justalnums' REGEXP '[[:alnum:]]+';       -> 1
  mysql> SELECT '!!' REGEXP '[[:alnum:]]+';               -> 0
  ```

* `[[:<:]]`, `[[:>:]]`

Esses marcadores representam os limites das palavras. Eles correspondem ao início e ao fim das palavras, respectivamente. Uma palavra é uma sequência de caracteres de palavra que não é precedida ou seguida por caracteres de palavra. Um caractere de palavra é um caractere alfanumérico na classe `alnum` ou um underscore (`_`).

  ```sql
  mysql> SELECT 'a word a' REGEXP '[[:<:]]word[[:>:]]';   -> 1
  mysql> SELECT 'a xword a' REGEXP '[[:<:]]word[[:>:]]';  -> 0
  ```

Para usar uma instância literal de um caractere especial em uma expressão regular, anteceda-o com dois caracteres de barra invertida (\). O analisador do MySQL interpreta um dos traços de barra, e a biblioteca de expressão regular interpreta o outro. Por exemplo, para corresponder à string `1+2` que contém o caractere especial `+`, apenas a última das seguintes expressões regulares é a correta:

```sql
mysql> SELECT '1+2' REGEXP '1+2';                       -> 0
mysql> SELECT '1+2' REGEXP '1\+2';                      -> 0
mysql> SELECT '1+2' REGEXP '1\\+2';                     -> 1
```

### 12.8.3 Conjunto de caracteres e correção de resultados de funções

O MySQL tem muitos operadores e funções que retornam uma string. Esta seção responde à pergunta: Qual é o conjunto de caracteres e a correção de tal string?

Para funções simples que aceitam entrada de cadeia e retornam um resultado em cadeia como saída, o conjunto de caracteres e a correção da saída são os mesmos da principal valor de entrada. Por exemplo, `UPPER(X)` retorna uma cadeia com a mesma cadeia de caracteres e correção que *`X`*. O mesmo se aplica para `INSTR()`, `LCASE()`, `LOWER()`, `LTRIM()`, `MID()`, `REPEAT()`, `REPLACE()`, `REVERSE()`, `RIGHT()`, `RPAD()`, `RTRIM()`, `SOUNDEX()`, `SUBSTRING()`, `TRIM()`, `UCASE()` e `UPPER()`.

Nota

A função `REPLACE()`, ao contrário de todas as outras funções, sempre ignora a ordenação da entrada de cadeia e realiza uma comparação sensível ao caso.

Se uma entrada de cadeia ou o resultado de uma função for uma cadeia binária, a cadeia tem o conjunto de caracteres e a ordenação `binary`. Isso pode ser verificado usando as funções `CHARSET()` e `COLLATION()`, que ambas retornam `binary` para um argumento de cadeia binária:

```sql
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

Para operações que convertem em dados de caracteres, o conjunto de caracteres e a ordenação das cadeias resultantes das operações são definidos pelas variáveis de sistema `character_set_connection` e `collation_connection`, que determinam o conjunto de caracteres e a ordenação de conexão padrão (ver Seção 10.4, “Conjunto de caracteres e ordenação de conexão”). Isso se aplica apenas a `CAST()`, `CONV()`, `FORMAT()`, `HEX()` e `SPACE()`.

A partir do MySQL 5.7.19, uma exceção ao princípio anterior ocorre para expressões para colunas geradas virtualmente. Nessas expressões, o conjunto de caracteres da tabela é usado para resultados de `CONV()` ou `HEX()`, independentemente do conjunto de caracteres da conexão.

Se houver alguma dúvida sobre o conjunto de caracteres ou a ordenação do resultado retornado por uma função de string, use a função `CHARSET()` ou `COLLATION()` para descobrir:

```sql
mysql> SELECT USER(), CHARSET(USER()), COLLATION(USER());
+----------------+-----------------+-------------------+
| USER()         | CHARSET(USER()) | COLLATION(USER()) |
+----------------+-----------------+-------------------+
| test@localhost | utf8            | utf8_general_ci   |
+----------------+-----------------+-------------------+
mysql> SELECT CHARSET(COMPRESS('abc')), COLLATION(COMPRESS('abc'));
+--------------------------+----------------------------+
| CHARSET(COMPRESS('abc')) | COLLATION(COMPRESS('abc')) |
+--------------------------+----------------------------+
| binary                   | binary                     |
+--------------------------+----------------------------+
```
