## 14.8 Funções e Operadores de String

14.8.1 Funções e Operadores de Comparação de String

14.8.2 Expressões Regulares

14.8.3 Conjunto de Caracteres e Cotação dos Resultados das Funções

**Tabela 14.12 Funções e Operadores de String**

<table> frame="box" rules="all" summary="Uma referência que lista funções de string e operadores.">
<tr><th>Nome</th> <th>Descrição</th> </tr>
<tr><td>ASCII()</td> <td> Retorna o valor numérico do caractere mais à esquerda </td> </tr>
<tr><td>BIN()</td> <td> Retorna uma string contendo a representação binária de um número </td> </tr>
<tr><td>BIT_LENGTH()</td> <td> Retorna o comprimento do argumento em bits </td> </tr>
<tr><td>CHAR()</td> <td> Retorna o caractere para cada inteiro passado </td> </tr>
<tr><td>CHAR_LENGTH()</td> <td> Retorna o número de caracteres na string </td> </tr>
<tr><td>CHARACTER_LENGTH()</td> <td> Síntese de CHAR_LENGTH() </td> </tr>
<tr><td>CONCAT()</td> <td> Retorna uma string concatenada </td> </tr>
<tr><td>CONCAT_WS()</td> <td> Retorna uma string concatenada com um separador </td> </tr>
<tr><td>ELT()</td> <td> Retorna uma string no índice número </td> </tr>
<tr><td>EXPORT_SET()</td> <td> Retorna uma string de tal forma que, para cada bit definido no valor, você obtém uma string "on" e para cada bit definido, obtém uma string "off" </td> </tr>
<tr><td>FIELD()</td> <td> Índice (posição) do primeiro argumento nos argumentos subsequentes </td> </tr>
<tr><td>FIND_IN_SET()</td> <td> Índice (posição) do primeiro argumento dentro do segundo argumento </td> </tr>
<tr><td>FORMAT()</td> <td> Retorna um número formatado para um número decimal especificado </td> </tr>
<tr><td>FROM_BASE64()</td> <td> Decodifica a string base64 e retorna o resultado </td> </tr>
<tr><td>HEX()</td> <td> Representação hexadecimal de um valor decimal ou string </td> </tr>
<tr><td>INSERT()</td> <td> Insere uma subcadeia na posição especificada até o número especificado de caracteres </td> </tr>
<tr><td>INSTR()</td> <td> Retorna o índice da primeira ocorrência de uma subcadeia </td> </tr>
<tr><td>LCASE()</td> <td> Síntese de LOWER() </td> </tr>
<tr><td>LEFT()</td> <td> Retorna o número de caracteres mais à esquerda especificados </td> </tr>
<tr><td>LENGTH()</td> <td> Retorna o comprimento de uma string em bytes </td> </tr>
<tr><td>LIKE</td> <td> Simples correspondência de padrões </td> </tr>
<tr><td><a class="link" href="string-functions.html#function_

As funções de valor de cadeia de caracteres retornam `NULL` se o comprimento do resultado fosse maior que o valor da variável de sistema `max_allowed_packet`. Veja a Seção 7.1.1, “Configurando o Servidor”.

Para funções que operam em posições de cadeia de caracteres, a primeira posição é numerada como 1.

Para funções que aceitam argumentos de comprimento, os argumentos não inteiros são arredondados para o inteiro mais próximo.

* `ASCII(str)`

  Retorna o valor numérico do caractere mais à esquerda da cadeia de caracteres *`str`*. Retorna `0` se *`str`* for a cadeia de caracteres vazia. Retorna `NULL` se *`str`* for `NULL`. `ASCII()` funciona para caracteres de 8 bits.

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

  Retorna uma representação de cadeia de caracteres do valor binário de *`N`*, onde *`N`* é um número de longlong (`BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT`). Isso é equivalente a `CONV(N,10,2)`. Retorna `NULL` se *`N`* for `NULL`.

  ```
  mysql> SELECT BIN(12);
          -> '1100'
  ```

* `BIT_LENGTH(str)`

  Retorna o comprimento da cadeia de caracteres *`str`* em bits. Retorna `NULL` se *`str`* for `NULL`.

  ```
  mysql> SELECT BIT_LENGTH('text');
          -> 32
  ```

* `CHAR(N,... [USING charset_name])`

  `CHAR()` interpreta cada argumento *`N`* como um inteiro e retorna uma cadeia de caracteres composta pelos caracteres dados pelos valores de código desses inteiros. Os valores `NULL` são ignorados.

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

  Por padrão, `CHAR()` retorna uma cadeia de caracteres binária. Para produzir uma cadeia de caracteres em um conjunto de caracteres específico, use a cláusula opcional `USING`:

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

  Se `USING` for fornecido e a cadeia de caracteres resultante for ilegal para o conjunto de caracteres fornecido, uma mensagem de aviso é emitida. Além disso, se o modo SQL rigoroso estiver habilitado, o resultado de `CHAR()` se torna `NULL`.

Se `CHAR()` for invocado dentro do cliente **mysql**, as cadeias binárias são exibidas usando notação hexadecimal, dependendo do valor da opção `--binary-as-hex`. Para obter mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O Cliente de Linha de Comando do MySQL”.

Argumentos de `CHAR()` maiores que 255 são convertidos em múltiplos bytes de resultado. Por exemplo, `CHAR(256)` é equivalente a `CHAR(1,0)`, e `CHAR(256*256)` é equivalente a `CHAR(1,0,0)`:

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

  Retorna o comprimento da string *`str`*, medido em pontos de código. Um caractere multibyte é contado como um único ponto de código. Isso significa que, para uma string contendo dois caracteres de 3 bytes, `LENGTH()` retorna `6`, enquanto `CHAR_LENGTH()` retorna `2`, como mostrado aqui:

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

  `CHAR_LENGTH()` retorna `NULL` se *`str`* for `NULL`.

* `CHARACTER_LENGTH(str)`

  `CHARACTER_LENGTH()` é um sinônimo de `CHAR_LENGTH()`.

* `CONCAT(str1,str2,...)`

  Retorna a string resultante da concatenação dos argumentos. Pode ter um ou mais argumentos. Se todos os argumentos forem cadeias não binárias, o resultado é uma cadeia não binária. Se os argumentos incluir quaisquer cadeias binárias, o resultado é uma cadeia binária. Um argumento numérico é convertido para sua forma equivalente não binária.

  `CONCAT()` retorna `NULL` se qualquer argumento for `NULL`.

  ```
  mysql> SELECT CONCAT('My', 'S', 'QL');
          -> 'MySQL'
  mysql> SELECT CONCAT('My', NULL, 'QL');
          -> NULL
  mysql> SELECT CONCAT(14.3);
          -> '14.3'
  ```

  Para strings com aspas, a concatenação pode ser realizada colocando as strings uma ao lado da outra:

  ```
  mysql> SELECT 'My' 'S' 'QL';
          -> 'MySQL'
  ```

  Se `CONCAT()` for invocado dentro do cliente **mysql**, os resultados das cadeias binárias são exibidos usando notação hexadecimal, dependendo do valor da opção `--binary-as-hex`. Para obter mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O Cliente de Linha de Comando do MySQL”.

* `CONCAT_WS(separador,str1,str2,...)`

`CONCAT_WS()` significa Concatenar com Sepador e é uma forma especial de `CONCAT()`. O primeiro argumento é o separador para o resto dos argumentos. O separador é adicionado entre as strings a serem concatenadas. O separador pode ser uma string, assim como o resto dos argumentos. Se o separador for `NULL`, o resultado será `NULL`.

```
  mysql> SELECT CONCAT_WS(',', 'First name', 'Second name', 'Last Name');
          -> 'First name,Second name,Last Name'
  mysql> SELECT CONCAT_WS(',', 'First name', NULL, 'Last Name');
          -> 'First name,Last Name'
  ```

`CONCAT_WS()` não pula strings vazias. No entanto, ele pula quaisquer valores `NULL` após o argumento do separador.

* `ELT(N,str1,str2,str3,...)`

  `ELT()` retorna o *`N`*º elemento da lista de strings: *`str1`* se *`N`* = `1`, *`str2`* se *`N`* = `2`, e assim por diante. Retorna `NULL` se *`N`* for menor que `1`, maior que o número de argumentos ou `NULL`. `ELT()` é o complemento de `FIELD()`.

```
  mysql> SELECT ELT(1, 'Aa', 'Bb', 'Cc', 'Dd');
          -> 'Aa'
  mysql> SELECT ELT(4, 'Aa', 'Bb', 'Cc', 'Dd');
          -> 'Dd'
  ```

[`EXPORT_SET(bits,on,off[,separator[,number_of_bits]])`](string-functions.html#function_export-set)

  Retorna uma string de modo que, para cada bit definido no valor *`bits`*, você recebe uma string *`on`* e, para cada bit não definido no valor, você recebe uma string *`off`*. Os bits em *`bits`* são examinados da direita para a esquerda (de bits de menor ordem para bits de maior ordem). As strings são adicionadas ao resultado da esquerda para a direita, separadas pelo caractere *`separator`* (o padrão é o caractere vírgula `,`). O número de bits examinados é dado por *`number_of_bits`*, que tem um valor padrão de 64 se não especificado. *`number_of_bits`* é acionado silenciosamente para 64 se for maior que 64. Ele é tratado como um inteiro sem sinal, então um valor de −1 é efetivamente o mesmo que 64.

  ```
  mysql> SELECT EXPORT_SET(5,'Y','N',',',4);
          -> 'Y,N,Y,N'
  mysql> SELECT EXPORT_SET(6,'1','0',',',10);
          -> '0,1,1,0,0,0,0,0,0,0'
  ```

* `FIELD(str,str1,str2,str3,...)`

  Retorna o índice (posição) de *`str`* na lista *`str1`*, *`str2`*, *`str3`*, `...`. Retorna `0` se *`str`* não for encontrado.

Se todos os argumentos de `FIELD()` forem strings, todos os argumentos são comparados como strings. Se todos os argumentos forem números, eles são comparados como números. Caso contrário, os argumentos são comparados como duplos.

Se *`str`* for `NULL`, o valor de retorno é `0` porque `NULL` falha na comparação de igualdade com qualquer valor. `FIELD()` é o complemento de `ELT()`.

```
  mysql> SELECT FIELD('Bb', 'Aa', 'Bb', 'Cc', 'Dd', 'Ff');
          -> 2
  mysql> SELECT FIELD('Gg', 'Aa', 'Bb', 'Cc', 'Dd', 'Ff');
          -> 0
  ```

* `FIND_IN_SET(str,strlist)`

  Retorna um valor na faixa de 1 a *`N`* se a string *`str`* estiver na lista de strings *`strlist`*, que consiste em *`N`* substrings. Uma lista de strings é uma string composta por substrings separados por caracteres `,`. Se o primeiro argumento for uma string constante e o segundo for uma coluna do tipo `SET`, a função `FIND_IN_SET()` é otimizada para usar aritmética de bits. Retorna `0` se *`str`* não estiver em *`strlist`* ou se *`strlist`* for a string vazia. Retorna `NULL` se qualquer argumento for `NULL`. Esta função não funciona corretamente se o primeiro argumento contiver um caractere `,` (vírgula).

  ```
  mysql> SELECT FIND_IN_SET('b','a,b,c,d');
          -> 2
  ```

* `FORMAT(X,D[,locale])`

  Formata o número *`X`* para um formato como `'#,###,###.##'`, arredondado a *`D`* casas decimais, e retorna o resultado como uma string. Se *`D`* for `0`, o resultado não tem ponto decimal ou parte fracionária. Se *`X`* ou *`D`* for `NULL`, a função retorna `NULL`.

  O parâmetro opcional terceiro habilita uma região para ser especificada a ser usada para o ponto decimal do número de resultado, o separador de milhares e a agrupamento entre separadores. Os valores de região permitidos são os mesmos que os valores legais para a variável de sistema `lc_time_names` (veja Seção 12.16, “Suporte de Região do MySQL Server”). Se a região for `NULL` ou não especificada, a região padrão é `'en_US'`.

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

Pede uma string codificada com as regras de codificação base-64 usadas pelo `TO_BASE64()`, e retorna o resultado decodificado como uma string binária. O resultado é `NULL` se o argumento for `NULL` ou não for uma string base-64 válida. Veja a descrição do `TO_BASE64()` para detalhes sobre as regras de codificação e decodificação.

```
  mysql> SELECT TO_BASE64('abc'), FROM_BASE64(TO_BASE64('abc'));
          -> 'JWJj', 'abc'
  ```

Se `FROM_BASE64()` for invocado dentro do cliente **mysql**, as strings binárias são exibidas usando a notação hexadecimal. Você pode desabilitar esse comportamento configurando o valor de `--binary-as-hex` para `0` ao iniciar o cliente **mysql**. Para mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O Cliente de Linha de Comando do MySQL”.

* `HEX(str)`, `HEX(N)`

  Para um argumento de string *`str`*, `HEX()` retorna uma representação hexadecimal da string *`str`* onde cada byte de cada caractere em *`str`* é convertido em dois dígitos hexadecimais. (Caracteres multibyte, portanto, se tornam mais de dois dígitos.) A operação inversa é realizada pela função `UNHEX()`.

  Para um argumento numérico *`N`*, `HEX()` retorna uma representação hexadecimal da string do valor de *`N`* tratado como um número de longlong (`BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")) . Isso é equivalente a `CONV(N,10,16)`. A operação inversa é realizada por `CONV(HEX(N),16,10)`.

  Para um argumento `NULL`, essa função retorna `NULL`.

```
  mysql> SELECT X'616263', HEX('abc'), UNHEX(HEX('abc'));
          -> 'abc', 616263, 'abc'
  mysql> SELECT HEX(255), CONV(HEX(255),16,10);
          -> 'FF', 255
  ```

* `INSERT(str,pos,len,newstr)`

  Retorna a string *`str`*, com a subcadeia começando na posição *`pos`* e de *`len`* caracteres longa substituída pela string *`newstr`*. Retorna a string original se *`pos`* não estiver dentro do comprimento da string. Substitui o resto da string a partir da posição *`pos`* se *`len`* não estiver dentro do comprimento do resto da string. Retorna `NULL` se qualquer argumento for `NULL`.

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

  Retorna a posição da primeira ocorrência da substring *`substr`* na string *`str`*. Isso é o mesmo que a forma de dois argumentos de `LOCATE()`, exceto que a ordem dos argumentos é invertida.

  ```
  mysql> SELECT INSTR('foobarbar', 'bar');
          -> 4
  mysql> SELECT INSTR('xbar', 'foobar');
          -> 0
  ```

  Essa função é segura para multibytes e é sensível ao caso apenas se pelo menos um argumento for uma string binária. Se qualquer argumento for `NULL`, essa função retorna `NULL`.

* `LCASE(str)`

  `LCASE()` é sinônimo de `LOWER()`.

  `LCASE()` usado em uma visão é reescrito como `LOWER()` ao armazenar a definição da visão. (Bug #12844279)

* `LEFT(str,len)`

  Retorna os caracteres mais à esquerda de *`len`* caracteres da string *`str`*, ou `NULL` se qualquer argumento for `NULL`.

  ```
  mysql> SELECT LEFT('foobarbar', 5);
          -> 'fooba'
  ```

  Essa função é segura para multibytes.

* `LENGTH(str)`

  Retorna o comprimento da string *`str`*, medido em bytes. Um caractere multibyte é contado como múltiplos bytes. Isso significa que, para uma string contendo cinco caracteres de 2 bytes, `LENGTH()` retorna `10`, enquanto `CHAR_LENGTH()` retorna `5`. Retorna `NULL` se *`str`* for `NULL`.

  ```
  mysql> SELECT LENGTH('text');
          -> 4
  ```

  Nota

  A função espacial `Length()` OpenGIS é chamada `ST_Length()` no MySQL.

* `LOAD_FILE(file_name)`

  Leia o arquivo e retorne o conteúdo do arquivo como uma string. Para usar essa função, o arquivo deve estar localizado no host do servidor, você deve especificar o nome completo do caminho do arquivo e você deve ter o privilégio `FILE`. O arquivo deve ser legível pelo servidor e seu tamanho deve ser menor que `max_allowed_packet` bytes. Se a variável de sistema `secure_file_priv` for definida como um nome de diretório não vazio, o arquivo a ser carregado deve estar localizado nesse diretório.

Se o arquivo não existir ou não puder ser lido porque uma das condições anteriores não for atendida, a função retorna `NULL`.

A variável de sistema `character_set_filesystem` controla a interpretação dos nomes de arquivos fornecidos como strings literais.

```
  mysql> UPDATE t
              SET blob_col=LOAD_FILE('/tmp/picture')
              WHERE id=1;
  ```

* `LOCATE(substr,str)`, `LOCATE(substr,str,pos)`

  O primeiro sintaxe retorna a posição da primeira ocorrência do sub-string *`substr`* na string *`str`*. O segundo sintaxe retorna a posição da primeira ocorrência do sub-string *`substr`* na string *`str`*, começando na posição *`pos`*. Retorna `0` se *`substr`* não estiver em *`str`*. Retorna `NULL` se algum argumento for `NULL`.

  ```
  mysql> SELECT LOCATE('bar', 'foobarbar');
          -> 4
  mysql> SELECT LOCATE('xbar', 'foobar');
          -> 0
  mysql> SELECT LOCATE('bar', 'foobarbar', 5);
          -> 7
  ```

  Esta função é segura para multibytes e é sensível ao caso apenas se pelo menos um argumento for uma string binária.

* `LOWER(str)`

  Retorna a string *`str`* com todos os caracteres alterados para minúsculas de acordo com a mapeamento do conjunto de caracteres atual, ou `NULL` se *`str`* for `NULL`. O conjunto de caracteres padrão é `utf8mb4`.

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

  Para colunas de conjuntos de caracteres Unicode, `LOWER()` e `UPPER()` funcionam de acordo com o Algoritmo de Cotações Unicode (UCA) da versão no nome da cota, se houver, e UCA 4.0.0 se nenhuma versão for especificada. Por exemplo, `utf8mb4_0900_ai_ci` e `utf8mb3_unicode_520_ci` funcionam de acordo com UCA 9.0.0 e 5.2.0, respectivamente, enquanto `utf8mb3_unicode_ci` funciona de acordo com UCA 4.0.0. Veja a Seção 12.10.1, “Juntos de Caracteres Unicode”.

  Esta função é segura para multibytes.

`LCASE()` usado em visualizações é reescrito como `LOWER()`.

* `LPAD(str,len,padstr)`

  Retorna a string *`str`*, preenchida à esquerda com a string *`padstr`* até uma extensão de *`len`* caracteres. Se *`str`* for maior que *`len`*, o valor de retorno é encurtado para *`len`* caracteres.

  ```
  mysql> SELECT LPAD('hi',4,'??');
          -> '??hi'
  mysql> SELECT LPAD('hi',1,'??');
          -> 'h'
  ```

  Retorna `NULL` se qualquer um de seus argumentos for `NULL`.

* `LTRIM(str)`

  Retorna a string *`str`* com caracteres de espaço em branco removidos. Retorna `NULL` se *`str`* for `NULL`.

  ```
  mysql> SELECT LTRIM('  barbar');
          -> 'barbar'
  ```

  Esta função é segura para multibytes.

* `MAKE_SET(bits,str1,str2,...)`

  Retorna um valor de conjunto (uma string contendo substrings separados por `,` caracteres) consistindo das strings que têm o bit correspondente em *`bits`* definido. *`str1`* corresponde ao bit 0, *`str2`* ao bit 1, e assim por diante. Valores `NULL` em *`str1`*, *`str2`*, `...` não são anexados ao resultado.

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

* `MID(str,pos)`, `MID(str FROM pos)`, `MID(str,pos,len)`, `MID(str FROM pos FOR len)`

  `MID(str,pos,len)` é um sinônimo de `SUBSTRING(str,pos,len)`.

* `OCT(N)`

  Retorna uma representação de string do valor octal de *`N`*, onde *`N`* é um número `longlong` (`BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT`). Isso é equivalente a `CONV(N,10,8)`. Retorna `NULL` se *`N`* for `NULL`.

  ```
  mysql> SELECT OCT(12);
          -> '14'
  ```

* `OCTET_LENGTH(str)`

  `OCTET_LENGTH()` é um sinônimo de `LENGTH()`.

* `ORD(str)`

  Se o caractere mais à esquerda da string *`str`* for um caractere multibyte, retorna o código desse caractere, calculado a partir dos valores numéricos de seus bytes constituintes usando esta fórmula:

  ```
    (1st byte code)
  + (2nd byte code * 256)
  + (3rd byte code * 256^2) ...
  ```

  Se o caractere mais à esquerda não for um caractere multibyte, `ORD()` retorna o mesmo valor que a função `ASCII()`. O função retorna `NULL` se *`str`* for `NULL`.

  ```
  mysql> SELECT ORD('2');
          -> 50
  ```

* `POSITION(substr IN str)`

  `POSITION(substr IN str)` é um sinônimo de `LOCATE(substr,str)`.

* `QUOTE(str)`

  Cita uma string para produzir um resultado que pode ser usado como um valor de dados escapado corretamente em uma instrução SQL. A string é devolvida entre aspas simples e com cada ocorrência de barra invertida (`\`), aspas simples (`'`), ASCII `NUL` e Control+Z precedidas por uma barra invertida. Se o argumento for `NULL`, o valor de retorno é a palavra “NULL” sem as aspas simples.

  ```
  mysql> SELECT QUOTE('Don\'t!');
          -> 'Don\'t!'
  mysql> SELECT QUOTE(NULL);
          -> NULL
  ```

  Para comparação, veja as regras de citação para strings literais e dentro da API C na Seção 11.1.1, “Strings Literais”, e mysql_real_escape_string_quote().

* `REPEAT(str,count)`

  Devolve uma string composta pela string *`str`* repetida *`count`* vezes. Se *`count`* for menor que 1, devolve uma string vazia. Devolve `NULL` se *`str`* ou *`count`* for `NULL`.

  ```
  mysql> SELECT REPEAT('MySQL', 3);
          -> 'MySQLMySQLMySQL'
  ```

* `REPLACE(str,from_str,to_str)`

  Devolve a string *`str`* com todas as ocorrências da string *`from_str`* substituídas pela string *`to_str`*. A função `REPLACE()` realiza uma correspondência sensível a maiúsculas e minúsculas ao procurar por *`from_str`*.

  ```
  mysql> SELECT REPLACE('www.mysql.com', 'w', 'Ww');
          -> 'WwWwWw.mysql.com'
  ```

  Esta função é segura para multibytes. Devolve `NULL` se qualquer um dos seus argumentos for `NULL`.

* `REVERSE(str)`

  Devolve a string *`str`* com a ordem dos caracteres invertida, ou `NULL` se *`str`* for `NULL`.

  ```
  mysql> SELECT REVERSE('abc');
          -> 'cba'
  ```

  Esta função é segura para multibytes.

* `RIGHT(str,len)`

  Devolve os *`len`* caracteres mais à direita da string *`str`*, ou `NULL` se qualquer argumento for `NULL`.

  ```
  mysql> SELECT RIGHT('foobarbar', 4);
          -> 'rbar'
  ```

  Esta função é segura para multibytes.

Retorna a string *`str`*, preenchida à direita com a string *`padstr`* até uma extensão de *`len`* caracteres. Se *`str`* for mais longo que *`len`*, o valor de retorno é encurtado para *`len`* caracteres. Se *`str`*, *`padstr`* ou *`len`* forem `NULL`, a função retorna `NULL`.

```
  mysql> SELECT RPAD('hi',5,'?');
          -> 'hi???'
  mysql> SELECT RPAD('hi',1,'?');
          -> 'h'
  ```

Esta função é segura para multibytes.

* `RTRIM(str)`

Retorna a string *`str`* com caracteres de espaço em branco finais removidos.

```
  mysql> SELECT RTRIM('barbar   ');
          -> 'barbar'
  ```

Esta função é segura para multibytes e retorna `NULL` se *`str`* for `NULL`.

* `SOUNDEX(str)`

Retorna uma string soundex de *`str`*, ou `NULL` se *`str`* for `NULL`. Duas strings que soam quase iguais devem ter strings soundex idênticas. Uma string soundex padrão tem quatro caracteres, mas a função `SOUNDEX()` retorna uma string arbitrariamente longa. Você pode usar `SUBSTRING()` no resultado para obter uma string soundex padrão. Todos os caracteres não alfanuméricos em *`str`* são ignorados. Todos os caracteres alfanuméricos internacionais fora da faixa de A-Z são tratados como vogais.

Importante

Ao usar `SOUNDEX()`, você deve estar ciente das seguintes limitações:

+ Esta função, conforme implementada atualmente, é destinada a funcionar bem com strings que estão apenas no idioma inglês. Strings em outros idiomas podem não produzir resultados confiáveis.

+ Esta função não é garantida para fornecer resultados consistentes com strings que usam conjuntos de caracteres multibytes, incluindo `utf-8`. Consulte o Bug #22638 para mais informações.

```
  mysql> SELECT SOUNDEX('Hello');
          -> 'H400'
  mysql> SELECT SOUNDEX('Quadratically');
          -> 'Q36324'
  ```

Nota

Esta função implementa o algoritmo original Soundex, não a versão aprimorada mais popular (também descrita por D. Knuth). A diferença é que a versão original descarta as vogais primeiro e os duplicados em segundo lugar, enquanto a versão aprimorada descarta os duplicados em primeiro lugar e as vogais em segundo lugar.

* `expr1 SOUNDS LIKE expr2`

Isso é o mesmo que `SOUNDEX(expr1) = SOUNDEX(expr2)`.

* `SPACE(N)`

  Retorna uma string composta por *`N`* caracteres de espaço, ou `NULL` se *`N`* for `NULL`.

  ```
  mysql> SELECT SPACE(6);
          -> '      '
  ```

* `SUBSTR(str,pos)`, `SUBSTR(str FROM pos)`, `SUBSTR(str,pos,len)`, `SUBSTR(str FROM pos FOR len)`

  `SUBSTR()` é sinônimo de `SUBSTRING()`.

* `SUBSTR(str,pos)`, `SUBSTR(str FROM pos)`, `SUBSTR(str,pos,len)`, `SUBSTR(str FROM pos FOR len)`

  As formas sem um argumento de *`len`* retornam uma subcadeia a partir da string *`str`* a partir da posição *`pos`*. As formas com um argumento de *`len`* retornam uma subcadeia de *`len`* caracteres a partir da string *`str`*, a partir da posição *`pos`*. As formas que usam `FROM` são a sintaxe padrão do SQL. Também é possível usar um valor negativo para *`pos`*. Neste caso, o início da subcadeia é *`pos`* caracteres a partir do final da string, em vez do início. Um valor negativo pode ser usado para *`pos`* em qualquer uma das formas desta função. Um valor de 0 para *`pos`* retorna uma string vazia.

  Para todas as formas de `SUBSTRING()`, a posição do primeiro caractere na string a partir da qual a subcadeia deve ser extraída é contada como `1`.

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

  Esta função é segura para multibytes. Retorna `NULL` se qualquer um de seus argumentos for `NULL`.

  Se *`len`* for menor que 1, o resultado é a string vazia.

* `SUBSTRING_INDEX(str,delim,count)`

  Retorna a subcadeia da string *`str`* antes de *`count`* ocorrências do delimitador *`delim`*. Se *`count`* for positivo, tudo à esquerda do delimitador final (contando da esquerda) é retornado. Se *`count`* for negativo, tudo à direita do delimitador final (contando da direita) é retornado. `SUBSTRING_INDEX()` realiza uma correspondência sensível a maiúsculas e minúsculas ao procurar por *`delim`*.

```
  mysql> SELECT SUBSTRING_INDEX('www.mysql.com', '.', 2);
          -> 'www.mysql'
  mysql> SELECT SUBSTRING_INDEX('www.mysql.com', '.', -2);
          -> 'mysql.com'
  ```

Essa função é segura para multibytes.

`SUBSTRING_INDEX()` retorna `NULL` se qualquer um de seus argumentos for `NULL`.

* `TO_BASE64(str)`

  Converte o argumento de string para a forma codificada em base-64 e retorna o resultado como uma string de caracteres com o conjunto de caracteres de conexão e a ordenação. Se o argumento não for uma string, ele é convertido em uma string antes da conversão ocorrer. O resultado é `NULL` se o argumento for `NULL`. Strings codificadas em base-64 podem ser decodificadas usando a função `FROM_BASE64()`.

  ```
  mysql> SELECT TO_BASE64('abc'), FROM_BASE64(TO_BASE64('abc'));
          -> 'JWJj', 'abc'
  ```

  Existem diferentes esquemas de codificação em base-64. Essas são as regras de codificação e decodificação usadas por `TO_BASE64()` e `FROM_BASE64()`:

  + A codificação para o valor do alfabeto 62 é `'+'`.

  + A codificação para o valor do alfabeto 63 é `'/'`.

  + A saída codificada consiste em grupos de 4 caracteres imprimíveis. Cada 3 bytes dos dados de entrada são codificados usando 4 caracteres. Se o último grupo estiver incompleto, ele é preenchido com caracteres `=` até uma extensão de 4.

  + Uma nova linha é adicionada após cada 76 caracteres de saída codificada para dividir a saída longa em várias linhas.

  + A decodificação reconhece e ignora nova linha, retorno de carro, tabulação e espaço.

[`TRIM([{BOTH | LEADING | TRAILING} [remstr] FROM] str)`](string-functions.html#function_trim), `TRIM(

  Retorna a string *`str`* com todos os prefixos ou sufixos de *`remstr`* removidos. Se nenhum dos especificadores `BOTH`, `LEADING` ou `TRAILING` for fornecido, `BOTH` é assumido. *`remstr`* é opcional e, se não especificado, espaços são removidos.

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

  `UCASE()` é um sinônimo de `UPPER()`.

  `UCASE()` usado dentro de vistas é reescrito como `UPPER()`.

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

Os caracteres na string de argumento devem ser dígitos hexadecimais legais: `'0'` .. `'9'`, `'A'` .. `'F'`, `'a'` .. `'f'`. Se o argumento contiver dígitos não hexadecimais ou for `NULL`, o resultado é `NULL`:

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

Um resultado `NULL` também pode ocorrer se o argumento para `UNHEX()` for uma coluna `BINARY`, porque os valores são preenchidos com bytes `0x00` ao serem armazenados, mas esses bytes não são removidos na recuperação. Por exemplo, `'41'` é armazenado em uma coluna `CHAR(3)` como `'41 '` e recuperado como `'41'` (com o espaço de preenchimento final removido), então `UNHEX()` para o valor da coluna retorna `X'41'`. Por outro lado, `'41'` é armazenado em uma coluna `BINARY(3)` como `'41\0'` e recuperado como `'41\0'` (com o byte de preenchimento final `0x00` não removido). `'\0'` não é um dígito hexadecimal legal, então `UNHEX()` para o valor da coluna retorna `NULL`.

Para um argumento numérico *`N`*, o inverso de `HEX(N)` não é realizado por `UNHEX()`. Use `CONV(HEX(N),16,10)` em vez disso. Veja a descrição de `HEX()`.

Se `UNHEX()` for invocado dentro do cliente **mysql**, strings binárias são exibidas usando notação hexadecimal, dependendo do valor da opção `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O Cliente de Linha de Comando do MySQL”.

* `UPPER(str)`

  Retorna a string *`str`* com todos os caracteres alterados para maiúsculas de acordo com a mapeamento do conjunto de caracteres atual, ou `NULL` se *`str`* for `NULL`. O conjunto de caracteres padrão é `utf8mb4`.

```
  mysql> SELECT UPPER('Hej');
          -> 'HEJ'
  ```

Consulte a descrição da função `LOWER()` para obter informações que também se aplicam à função `UPPER()`. Isso inclui informações sobre como realizar a conversão de maiúsculas e minúsculas de strings binárias (`BINARY`, `VARBINARY`, `BLOB`), para as quais essas funções são ineficazes, e informações sobre o dobramento de maiúsculas para conjuntos de caracteres Unicode.

Esta função é segura para multibytes.

A função `UCASE()` usada em consultas é reescrita como `UPPER()`.

* `WEIGHT_STRING(str [AS {CHAR|BINARY}(N)] [flags])`

Esta função retorna a string de peso para a string de entrada. O valor de retorno é uma string binária que representa o valor de comparação e ordenação da string, ou `NULL` se o argumento for `NULL`. Ela tem as seguintes propriedades:

+ Se `WEIGHT_STRING(str1)` = `WEIGHT_STRING(str2)`, então `str1 = str2` (*`str1`* e *`str2`* são considerados iguais)

+ Se `WEIGHT_STRING(str1)` < `WEIGHT_STRING(str2)`, então `str1 < str2` (*`str1`* é ordenado antes de *`str2*`)

`WEIGHT_STRING()` é uma função de depuração destinada ao uso interno. Seu comportamento pode mudar sem aviso entre as versões do MySQL. Ela pode ser usada para testar e depurar colunas, especialmente se você estiver adicionando uma nova coluna. Consulte a Seção 12.14, “Adicionando uma Coluna a um Conjunto de Caracteres”.

Esta lista resume brevemente os argumentos. Mais detalhes são fornecidos na discussão que segue a lista.

+ *`str`*: A expressão da string de entrada.

+ Cláusula `AS`: Opcional; caste a string de entrada para um tipo e comprimento específicos.

+ *`flags`*: Opcional; não utilizado.

A string de entrada, *`str`*, é uma expressão de string. Se a entrada for uma string não binária (caractere), como um valor `CHAR`, `VARCHAR` ou `TEXT`, o valor de retorno contém os pesos de ordenação para a string. Se a entrada for uma string binária (byte), como um valor `BINARY`, `VARBINARY` ou `BLOB`, o valor de retorno é o mesmo da entrada (o peso de cada byte em uma string binária é o valor do byte). Se a entrada for `NULL`, `WEIGHT_STRING()` retorna `NULL`.

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

Os exemplos anteriores usam `HEX()` para exibir o resultado de `WEIGHT_STRING()`. Como o resultado é um valor binário, `HEX()` pode ser especialmente útil quando o resultado contém valores não imprimíveis, para exibí-lo em formato imprimível:

```
  mysql> SET @s = CONVERT(X'C39F' USING utf8mb4) COLLATE utf8mb4_czech_ci;
  mysql> SELECT HEX(WEIGHT_STRING(@s));
  +------------------------+
  | HEX(WEIGHT_STRING(@s)) |
  +------------------------+
  | 0FEA0FEA               |
  +------------------------+
  ```

Para valores de retorno não `NULL`, o tipo de dados do valor é `VARBINARY` se sua comprimento estiver dentro do comprimento máximo para `VARBINARY`, caso contrário, o tipo de dados é `BLOB`.

A cláusula `AS` pode ser usada para converter a string de entrada em uma string não binária ou binária e para forçá-la a um comprimento específico:

+ `AS CHAR(N)` converte a string em uma string não binária e preenche-a à direita com espaços até um comprimento de *`N`* caracteres. *`N`* deve ser no mínimo 1. Se *`N`* for menor que o comprimento da string de entrada, a string é truncada para *`N`* caracteres. Não há aviso para o truncamento.

+ `AS BINARY(N)` é semelhante, mas converte a string em uma string binária, *`N`* é medido em bytes (não caracteres), e o preenchimento usa bytes `0x00` (não espaços).

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

A cláusula *`flags`* atualmente não é usada.

Se `WEIGHT_STRING()` for invocado dentro do cliente **mysql**, as strings binárias são exibidas usando notação hexadecimal, dependendo do valor da opção `--binary-as-hex`. Para obter mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O cliente de linha de comando do MySQL”.