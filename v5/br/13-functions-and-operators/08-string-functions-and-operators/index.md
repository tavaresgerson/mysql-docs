## 12.8 Funções e Operadores de String

12.8.1 Funções e Operadores de Comparação de String

12.8.2 Expressões Regulares

12.8.3 Conjunto de Caracteres (Character Set) e Collation dos Resultados de Funções

**Tabela 12.12 Funções e Operadores de String**

<table frame="box" rules="all" summary="Uma referência que lista funções e operadores de string."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>ASCII()</code></td> <td> Retorna o valor numérico do caractere mais à esquerda </td> </tr><tr><td><code>BIN()</code></td> <td> Retorna uma string contendo a representação binária de um número </td> </tr><tr><td><code>BIT_LENGTH()</code></td> <td> Retorna o comprimento do argumento em bits </td> </tr><tr><td><code>CHAR()</code></td> <td> Retorna o caractere para cada inteiro passado </td> </tr><tr><td><code>CHAR_LENGTH()</code></td> <td> Retorna o número de caracteres no argumento </td> </tr><tr><td><code>CHARACTER_LENGTH()</code></td> <td> Sinônimo para CHAR_LENGTH() </td> </tr><tr><td><code>CONCAT()</code></td> <td> Retorna a string concatenada </td> </tr><tr><td><code>CONCAT_WS()</code></td> <td> Retorna a string concatenada com separador </td> </tr><tr><td><code>ELT()</code></td> <td> Retorna a string no número do Index </td> </tr><tr><td><code>EXPORT_SET()</code></td> <td> Retorna uma string tal que, para cada bit definido (set) no valor bits, você obtém uma string 'on' e para cada bit não definido, você obtém uma string 'off' </td> </tr><tr><td><code>FIELD()</code></td> <td> Index (posição) do primeiro argumento nos argumentos subsequentes </td> </tr><tr><td><code>FIND_IN_SET()</code></td> <td> Index (posição) do primeiro argumento dentro do segundo argumento </td> </tr><tr><td><code>FORMAT()</code></td> <td> Retorna um número formatado para o número especificado de casas decimais </td> </tr><tr><td><code>FROM_BASE64()</code></td> <td> Decodifica a string codificada em base64 e retorna o resultado </td> </tr><tr><td><code>HEX()</code></td> <td> Representação hexadecimal de um valor decimal ou de string </td> </tr><tr><td><code>INSERT()</code></td> <td> Insere uma substring em uma posição especificada até um número especificado de caracteres </td> </tr><tr><td><code>INSTR()</code></td> <td> Retorna o Index da primeira ocorrência da substring </td> </tr><tr><td><code>LCASE()</code></td> <td> Sinônimo para LOWER() </td> </tr><tr><td><code>LEFT()</code></td> <td> Retorna o número de caracteres mais à esquerda conforme especificado </td> </tr><tr><td><code>LENGTH()</code></td> <td> Retorna o comprimento de uma string em bytes </td> </tr><tr><td><code>LIKE</code></td> <td> Correspondência de padrão simples </td> </tr><tr><td><code>LOAD_FILE()</code></td> <td> Carrega o arquivo nomeado </td> </tr><tr><td><code>LOCATE()</code></td> <td> Retorna a posição da primeira ocorrência da substring </td> </tr><tr><td><code>LOWER()</code></td> <td> Retorna o argumento em minúsculas </td> </tr><tr><td><code>LPAD()</code></td> <td> Retorna o argumento string, preenchido à esquerda com a string especificada </td> </tr><tr><td><code>LTRIM()</code></td> <td> Remove espaços iniciais </td> </tr><tr><td><code>MAKE_SET()</code></td> <td> Retorna um SET de strings separadas por vírgulas que têm o bit correspondente em bits definido (set) </td> </tr><tr><td><code>MATCH()</code></td> <td> Executa pesquisa full-text </td> </tr><tr><td><code>MID()</code></td> <td> Retorna uma substring começando da posição especificada </td> </tr><tr><td><code>NOT LIKE</code></td> <td> Negação de correspondência de padrão simples </td> </tr><tr><td><code>NOT REGEXP</code></td> <td> Negação de REGEXP </td> </tr><tr><td><code>OCT()</code></td> <td> Retorna uma string contendo a representação octal de um número </td> </tr><tr><td><code>OCTET_LENGTH()</code></td> <td> Sinônimo para LENGTH() </td> </tr><tr><td><code>ORD()</code></td> <td> Retorna o código do caractere mais à esquerda do argumento </td> </tr><tr><td><code>POSITION()</code></td> <td> Sinônimo para LOCATE() </td> </tr><tr><td><code>QUOTE()</code></td> <td> Escapa o argumento para uso em uma instrução SQL </td> </tr><tr><td><code>REGEXP</code></td> <td> Se a string corresponde à expressão regular </td> </tr><tr><td><code>REPEAT()</code></td> <td> Repete uma string o número especificado de vezes </td> </tr><tr><td><code>REPLACE()</code></td> <td> Substitui ocorrências de uma string especificada </td> </tr><tr><td><code>REVERSE()</code></td> <td> Inverte os caracteres em uma string </td> </tr><tr><td><code>RIGHT()</code></td> <td> Retorna o número especificado de caracteres mais à direita </td> </tr><tr><td><code>RLIKE</code></td> <td> Se a string corresponde à expressão regular </td> </tr><tr><td><code>RPAD()</code></td> <td> Preenche a string à direita o número especificado de vezes </td> </tr><tr><td><code>RTRIM()</code></td> <td> Remove espaços finais </td> </tr><tr><td><code>SOUNDEX()</code></td> <td> Retorna uma string soundex </td> </tr><tr><td><code>SOUNDS LIKE</code></td> <td> Compara sons </td> </tr><tr><td><code>SPACE()</code></td> <td> Retorna uma string com o número especificado de espaços </td> </tr><tr><td><code>STRCMP()</code></td> <td> Compara duas strings </td> </tr><tr><td><code>SUBSTR()</code></td> <td> Retorna a substring conforme especificado </td> </tr><tr><td><code>SUBSTRING()</code></td> <td> Retorna a substring conforme especificado </td> </tr><tr><td><code>SUBSTRING_INDEX()</code></td> <td> Retorna uma substring de uma string antes do número especificado de ocorrências do delimitador </td> </tr><tr><td><code>TO_BASE64()</code></td> <td> Retorna o argumento convertido para uma string base-64 </td> </tr><tr><td><code>TRIM()</code></td> <td> Remove espaços iniciais e finais </td> </tr><tr><td><code>UCASE()</code></td> <td> Sinônimo para UPPER() </td> </tr><tr><td><code>UNHEX()</code></td> <td> Retorna uma string contendo a representação hexadecimal de um número </td> </tr><tr><td><code>UPPER()</code></td> <td> Converte para maiúsculas </td> </tr><tr><td><code>WEIGHT_STRING()</code></td> <td> Retorna a string de peso para uma string </td> </tr></tbody></table>

Funções que retornam valores de string retornam `NULL` se o comprimento do resultado for maior do que o valor da variável de sistema `max_allowed_packet`. Consulte a Seção 5.1.1, “Configurando o Servidor”.

Para funções que operam em posições de string, a primeira posição é numerada como 1.

Para funções que aceitam argumentos de comprimento, argumentos não inteiros são arredondados para o inteiro mais próximo.

* `ASCII(str)`

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

* `BIN(N)`

  Retorna uma representação de string do valor binário de *`N`*, onde *`N`* é um número longlong (`BIGINT`). Isso é equivalente a `CONV(N,10,2)`. Retorna `NULL` se *`N`* for `NULL`.

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

* `CHAR(N,... [USING charset_name])`

  `CHAR()` interpreta cada argumento *`N`* como um inteiro e retorna uma string consistindo dos caracteres fornecidos pelos valores de código desses inteiros. Valores `NULL` são ignorados.

  ```sql
  mysql> SELECT CHAR(77,121,83,81,'76');
          -> 'MySQL'
  mysql> SELECT CHAR(77,77.3,'77.3');
          -> 'MMM'
  ```

  Argumentos de `CHAR()` maiores que 255 são convertidos em múltiplos bytes de resultado. Por exemplo, `CHAR(256)` é equivalente a `CHAR(1,0)`, e `CHAR(256*256)` é equivalente a `CHAR(1,0,0)`:

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

  Por padrão, `CHAR()` retorna uma string binária. Para produzir uma string em um determinado character set, use a cláusula opcional `USING`:

  ```sql
  mysql> SELECT CHARSET(CHAR(X'65')), CHARSET(CHAR(X'65' USING utf8));
  +----------------------+---------------------------------+
  | CHARSET(CHAR(X'65')) | CHARSET(CHAR(X'65' USING utf8)) |
  +----------------------+---------------------------------+
  | binary               | utf8                            |
  +----------------------+---------------------------------+
  ```

  Se `USING` for fornecido e a string de resultado for ilegal para o character set fornecido, um warning é emitido. Além disso, se o modo SQL estrito estiver habilitado, o resultado de `CHAR()` se torna `NULL`.

  Se `CHAR()` for invocado de dentro do cliente **mysql**, strings binárias são exibidas usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 4.5.1, “mysql — O Cliente de Linha de Comando MySQL”.

* `CHAR_LENGTH(str)`

  Retorna o comprimento da string *`str`*, medido em pontos de código (code points). Um caractere multibyte conta como um único ponto de código. Isso significa que, para uma string contendo dois caracteres de 3 bytes, `LENGTH()` retorna `6`, enquanto `CHAR_LENGTH()` retorna `2`, conforme mostrado aqui:

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

  `CHARACTER_LENGTH()` é um sinônimo para `CHAR_LENGTH()`.

* `CONCAT(str1,str2,...)`

  Retorna a string que resulta da concatenação dos argumentos. Pode ter um ou mais argumentos. Se todos os argumentos forem strings não binárias, o resultado é uma string não binária. Se os argumentos incluírem quaisquer strings binárias, o resultado é uma string binária. Um argumento numérico é convertido para sua forma de string não binária equivalente.

  `CONCAT()` retorna `NULL` se qualquer argumento for `NULL`.

  ```sql
  mysql> SELECT CONCAT('My', 'S', 'QL');
          -> 'MySQL'
  mysql> SELECT CONCAT('My', NULL, 'QL');
          -> NULL
  mysql> SELECT CONCAT(14.3);
          -> '14.3'
  ```

  Para strings entre aspas, a concatenação pode ser realizada colocando as strings lado a lado:

  ```sql
  mysql> SELECT 'My' 'S' 'QL';
          -> 'MySQL'
  ```

  Se `CONCAT()` for invocado de dentro do cliente **mysql**, resultados de strings binárias são exibidos usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 4.5.1, “mysql — O Cliente de Linha de Comando MySQL”.

* `CONCAT_WS(separator,str1,str2,...)`

  `CONCAT_WS()` significa "Concatenate With Separator" (Concatenar Com Separador) e é uma forma especial de `CONCAT()`. O primeiro argumento é o separador para o restante dos argumentos. O separador é adicionado entre as strings a serem concatenadas. O separador pode ser uma string, assim como o restante dos argumentos. Se o separador for `NULL`, o resultado é `NULL`.

  ```sql
  mysql> SELECT CONCAT_WS(',', 'First name', 'Second name', 'Last Name');
          -> 'First name,Second name,Last Name'
  mysql> SELECT CONCAT_WS(',', 'First name', NULL, 'Last Name');
          -> 'First name,Last Name'
  ```

  `CONCAT_WS()` não pula strings vazias. No entanto, ele pula quaisquer valores `NULL` após o argumento separador.

* `ELT(N,str1,str2,str3,...)`

  `ELT()` retorna o *`N`*-ésimo elemento da lista de strings: *`str1`* se *`N`* = `1`, *`str2`* se *`N`* = `2`, e assim por diante. Retorna `NULL` se *`N`* for menor que `1` ou maior que o número de argumentos. `ELT()` é o complemento de `FIELD()`.

  ```sql
  mysql> SELECT ELT(1, 'Aa', 'Bb', 'Cc', 'Dd');
          -> 'Aa'
  mysql> SELECT ELT(4, 'Aa', 'Bb', 'Cc', 'Dd');
          -> 'Dd'
  ```

* [`EXPORT_SET(bits,on,off[,separator[,number_of_bits)`](string-functions.html#function_export-set)

  Retorna uma string tal que, para cada bit definido (set) no valor *`bits`*, você obtém uma string *`on`* e para cada bit não definido no valor, você obtém uma string *`off`*. Os bits em *`bits`* são examinados da direita para a esquerda (da ordem baixa para a ordem alta). As strings são adicionadas ao resultado da esquerda para a direita, separadas pela string *`separator`* (o padrão é o caractere vírgula `,`). O número de bits examinados é dado por *`number_of_bits`*, que tem um padrão de 64 se não for especificado. *`number_of_bits`* é silenciosamente limitado a 64 se for maior que 64. É tratado como um inteiro sem sinal, portanto, um valor de −1 é efetivamente o mesmo que 64.

  ```sql
  mysql> SELECT EXPORT_SET(5,'Y','N',',',4);
          -> 'Y,N,Y,N'
  mysql> SELECT EXPORT_SET(6,'1','0',',',10);
          -> '0,1,1,0,0,0,0,0,0,0'
  ```

* `FIELD(str,str1,str2,str3,...)`

  Retorna o Index (posição) de *`str`* na lista *`str1`*, *`str2`*, *`str3`*, `...`. Retorna `0` se *`str`* não for encontrado.

  Se todos os argumentos para `FIELD()` forem strings, todos os argumentos são comparados como strings. Se todos os argumentos forem números, eles são comparados como números. Caso contrário, os argumentos são comparados como double.

  Se *`str`* for `NULL`, o valor de retorno é `0`, pois `NULL` falha na comparação de igualdade com qualquer valor. `FIELD()` é o complemento de `ELT()`.

  ```sql
  mysql> SELECT FIELD('Bb', 'Aa', 'Bb', 'Cc', 'Dd', 'Ff');
          -> 2
  mysql> SELECT FIELD('Gg', 'Aa', 'Bb', 'Cc', 'Dd', 'Ff');
          -> 0
  ```

* `FIND_IN_SET(str,strlist)`

  Retorna um valor no intervalo de 1 a *`N`* se a string *`str`* estiver na lista de strings *`strlist`* que consiste em *`N`* substrings. Uma lista de strings é uma string composta por substrings separadas por caracteres `,`. Se o primeiro argumento for uma string constante e o segundo for uma coluna do tipo `SET`, a função `FIND_IN_SET()` é otimizada para usar aritmética de bits. Retorna `0` se *`str`* não estiver em *`strlist`* ou se *`strlist`* for a string vazia. Retorna `NULL` se qualquer um dos argumentos for `NULL`. Esta função não funciona corretamente se o primeiro argumento contiver um caractere de vírgula (`,`).

  ```sql
  mysql> SELECT FIND_IN_SET('b','a,b,c,d');
          -> 2
  ```

* `FORMAT(X,D[,locale])`

  Formata o número *`X`* para um formato como `'#,###,###.##'`, arredondado para *`D`* casas decimais, e retorna o resultado como uma string. Se *`D`* for `0`, o resultado não tem ponto decimal ou parte fracionária.

  O terceiro parâmetro opcional permite que um locale seja especificado para ser usado para o ponto decimal, separador de milhares e agrupamento entre separadores do número resultante. Os valores de locale permitidos são os mesmos que os valores legais para a variável de sistema `lc_time_names` (consulte a Seção 10.16, “Suporte a Locale no Servidor MySQL”). Se nenhum locale for especificado, o padrão é `'en_US'`.

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

  Recebe uma string codificada com as regras base-64 usadas por `TO_BASE64()` e retorna o resultado decodificado como uma string binária. O resultado é `NULL` se o argumento for `NULL` ou não for uma string base-64 válida. Consulte a descrição de `TO_BASE64()` para detalhes sobre as regras de codificação e decodificação.

  ```sql
  mysql> SELECT TO_BASE64('abc'), FROM_BASE64(TO_BASE64('abc'));
          -> 'JWJj', 'abc'
  ```

  Se `FROM_BASE64()` for invocado de dentro do cliente **mysql**, strings binárias são exibidas usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 4.5.1, “mysql — O Cliente de Linha de Comando MySQL”.

* `HEX(str)`, `HEX(N)`

  Para um argumento string *`str`*, `HEX()` retorna uma representação de string hexadecimal de *`str`* onde cada byte de cada caractere em *`str`* é convertido em dois dígitos hexadecimais. (Caracteres multibyte, portanto, se tornam mais de dois dígitos). O inverso desta operação é realizado pela função `UNHEX()`.

  Para um argumento numérico *`N`*, `HEX()` retorna uma representação de string hexadecimal do valor de *`N`* tratado como um número longlong (`BIGINT`). Isso é equivalente a `CONV(N,10,16)`. O inverso desta operação é realizado por `CONV(HEX(N),16,10)`.

  ```sql
  mysql> SELECT X'616263', HEX('abc'), UNHEX(HEX('abc'));
          -> 'abc', 616263, 'abc'
  mysql> SELECT HEX(255), CONV(HEX(255),16,10);
          -> 'FF', 255
  ```

* `INSERT(str,pos,len,newstr)`

  Retorna a string *`str`*, com a substring que começa na posição *`pos`* e tem *`len`* caracteres de comprimento substituída pela string *`newstr`*. Retorna a string original se *`pos`* não estiver dentro do comprimento da string. Substitui o restante da string a partir da posição *`pos`* se *`len`* não estiver dentro do comprimento do restante da string. Retorna `NULL` se qualquer argumento for `NULL`.

  ```sql
  mysql> SELECT INSERT('Quadratic', 3, 4, 'What');
          -> 'QuWhattic'
  mysql> SELECT INSERT('Quadratic', -1, 4, 'What');
          -> 'Quadratic'
  mysql> SELECT INSERT('Quadratic', 3, 100, 'What');
          -> 'QuWhat'
  ```

  Esta função é segura para multibyte.

* `INSTR(str,substr)`

  Retorna a posição da primeira ocorrência da substring *`substr`* na string *`str`*. Isso é o mesmo que a forma de dois argumentos de `LOCATE()`, exceto que a ordem dos argumentos é invertida.

  ```sql
  mysql> SELECT INSTR('foobarbar', 'bar');
          -> 4
  mysql> SELECT INSTR('xbar', 'foobar');
          -> 0
  ```

  Esta função é segura para multibyte e diferencia maiúsculas de minúsculas (case-sensitive) apenas se pelo menos um argumento for uma string binária.

* `LCASE(str)`

  `LCASE()` é um sinônimo para `LOWER()`.

  `LCASE()` usado em uma view é reescrito como `LOWER()` ao armazenar a definição da view. (Bug #12844279)

* `LEFT(str,len)`

  Retorna os *`len`* caracteres mais à esquerda da string *`str`*, ou `NULL` se qualquer argumento for `NULL`.

  ```sql
  mysql> SELECT LEFT('foobarbar', 5);
          -> 'fooba'
  ```

  Esta função é segura para multibyte.

* `LENGTH(str)`

  Retorna o comprimento da string *`str`*, medido em bytes. Um caractere multibyte conta como múltiplos bytes. Isso significa que, para uma string contendo cinco caracteres de 2 bytes, `LENGTH()` retorna `10`, enquanto `CHAR_LENGTH()` retorna `5`.

  ```sql
  mysql> SELECT LENGTH('text');
          -> 4
  ```

  Nota

  A função espacial OpenGIS `Length()` é nomeada `ST_Length()` no MySQL.

* `LOAD_FILE(file_name)`

  Lê o arquivo e retorna o conteúdo do arquivo como uma string. Para usar esta função, o arquivo deve estar localizado no host do servidor, você deve especificar o nome completo do caminho para o arquivo e deve ter o privilégio `FILE`. O arquivo deve ser legível por todos e seu tamanho deve ser inferior a `max_allowed_packet` bytes. Se a variável de sistema `secure_file_priv` estiver definida para um nome de diretório não vazio, o arquivo a ser carregado deve estar localizado nesse diretório.

  Se o arquivo não existir ou não puder ser lido porque uma das condições anteriores não foi satisfeita, a função retorna `NULL`.

  A variável de sistema `character_set_filesystem` controla a interpretação dos nomes de arquivo fornecidos como strings literais.

  ```sql
  mysql> UPDATE t
              SET blob_col=LOAD_FILE('/tmp/picture')
              WHERE id=1;
  ```

* `LOCATE(substr,str)`, `LOCATE(substr,str,pos)`

  A primeira sintaxe retorna a posição da primeira ocorrência da substring *`substr`* na string *`str`*. A segunda sintaxe retorna a posição da primeira ocorrência da substring *`substr`* na string *`str`*, começando na posição *`pos`*. Retorna `0` se *`substr`* não estiver em *`str`*. Retorna `NULL` se *`substr`* ou *`str`* for `NULL`.

  ```sql
  mysql> SELECT LOCATE('bar', 'foobarbar');
          -> 4
  mysql> SELECT LOCATE('xbar', 'foobar');
          -> 0
  mysql> SELECT LOCATE('bar', 'foobarbar', 5);
          -> 7
  ```

  Esta função é segura para multibyte e diferencia maiúsculas de minúsculas apenas se pelo menos um argumento for uma string binária.

* `LOWER(str)`

  Retorna a string *`str`* com todos os caracteres alterados para minúsculas de acordo com o mapeamento do conjunto de caracteres atual. O padrão é `latin1` (cp1252 Europa Ocidental).

  ```sql
  mysql> SELECT LOWER('QUADRATICALLY');
          -> 'quadratically'
  ```

  `LOWER()` (e `UPPER()`) são ineficazes quando aplicados a strings binárias (`BINARY`, `VARBINARY`, `BLOB`). Para realizar a conversão de maiúsculas/minúsculas de uma string binária, primeiro converta-a para uma string não binária usando um character set apropriado para os dados armazenados na string:

  ```sql
  mysql> SET @str = BINARY 'New York';
  mysql> SELECT LOWER(@str), LOWER(CONVERT(@str USING latin1));
  +-------------+-----------------------------------+
  | LOWER(@str) | LOWER(CONVERT(@str USING latin1)) |
  +-------------+-----------------------------------+
  | New York    | new york                          |
  +-------------+-----------------------------------+
  ```

  Para collations de character sets Unicode, `LOWER()` e `UPPER()` funcionam de acordo com a versão do Unicode Collation Algorithm (UCA) presente no nome da collation, se houver, e UCA 4.0.0 se nenhuma versão for especificada. Por exemplo, `utf8_unicode_520_ci` funciona de acordo com UCA 5.2.0, enquanto `utf8_unicode_ci` funciona de acordo com UCA 4.0.0. Consulte a Seção 10.10.1, “Conjuntos de Caracteres Unicode”.

  Esta função é segura para multibyte.

  Em versões anteriores do MySQL, `LOWER()` usado em uma view era reescrito como `LCASE()` ao armazenar a definição da view. No MySQL 5.7, `LOWER()` nunca é reescrito nesses casos, mas `LCASE()` usado em views é reescrito como `LOWER()`. (Bug #12844279)

* `LPAD(str,len,padstr)`

  Retorna a string *`str`*, preenchida à esquerda (left-padded) com a string *`padstr`* até um comprimento de *`len`* caracteres. Se *`str`* for mais longa que *`len`*, o valor de retorno é encurtado para *`len`* caracteres.

  ```sql
  mysql> SELECT LPAD('hi',4,'??');
          -> '??hi'
  mysql> SELECT LPAD('hi',1,'??');
          -> 'h'
  ```

* `LTRIM(str)`

  Retorna a string *`str`* com caracteres de espaço iniciais removidos.

  ```sql
  mysql> SELECT LTRIM('  barbar');
          -> 'barbar'
  ```

  Esta função é segura para multibyte.

* `MAKE_SET(bits,str1,str2,...)`

  Retorna um valor SET (uma string contendo substrings separadas por caracteres `,`) consistindo das strings que têm o bit correspondente em *`bits`* definido (set). *`str1`* corresponde ao bit 0, *`str2`* ao bit 1, e assim por diante. Valores `NULL` em *`str1`*, *`str2`*, `...` não são anexados ao resultado.

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

* `MID(str,pos)`, `MID(str FROM pos)`, `MID(str,pos,len)`, `MID(str FROM pos FOR len)`

  `MID(str,pos,len)` é um sinônimo para `SUBSTRING(str,pos,len)`.

* `OCT(N)`

  Retorna uma representação de string do valor octal de *`N`*, onde *`N`* é um número longlong (`BIGINT`). Isso é equivalente a `CONV(N,10,8)`. Retorna `NULL` se *`N`* for `NULL`.

  ```sql
  mysql> SELECT OCT(12);
          -> '14'
  ```

* `OCTET_LENGTH(str)`

  `OCTET_LENGTH()` é um sinônimo para `LENGTH()`.

* `ORD(str)`

  Se o caractere mais à esquerda da string *`str`* for um caractere multibyte, retorna o código para esse caractere, calculado a partir dos valores numéricos de seus bytes constituintes usando esta fórmula:

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

* `POSITION(substr IN str)`

  `POSITION(substr IN str)` é um sinônimo para `LOCATE(substr,str)`.

* `QUOTE(str)`

  Coloca aspas em uma string para produzir um resultado que pode ser usado como um valor de dados propriamente escapado em uma instrução SQL. A string é retornada entre aspas simples e com cada instância de barra invertida (`\`), aspa simples (`'`), ASCII `NUL` e Control+Z precedida por uma barra invertida. Se o argumento for `NULL`, o valor de retorno é a palavra “NULL” sem aspas simples.

  ```sql
  mysql> SELECT QUOTE('Don\'t!');
          -> 'Don\'t!'
  mysql> SELECT QUOTE(NULL);
          -> NULL
  ```

  Para comparação, consulte as regras de citação para literais de string e dentro da API C na Seção 9.1.1, “Literais de String”, e mysql_real_escape_string_quote().

* `REPEAT(str,count)`

  Retorna uma string consistindo da string *`str`* repetida *`count`* vezes. Se *`count`* for menor que 1, retorna uma string vazia. Retorna `NULL` se *`str`* ou *`count`* for `NULL`.

  ```sql
  mysql> SELECT REPEAT('MySQL', 3);
          -> 'MySQLMySQLMySQL'
  ```

* `REPLACE(str,from_str,to_str)`

  Retorna a string *`str`* com todas as ocorrências da string *`from_str`* substituídas pela string *`to_str`*. `REPLACE()` executa uma correspondência que diferencia maiúsculas de minúsculas (case-sensitive) ao procurar por *`from_str`*.

  ```sql
  mysql> SELECT REPLACE('www.mysql.com', 'w', 'Ww');
          -> 'WwWwWw.mysql.com'
  ```

  Esta função é segura para multibyte.

* `REVERSE(str)`

  Retorna a string *`str`* com a ordem dos caracteres invertida.

  ```sql
  mysql> SELECT REVERSE('abc');
          -> 'cba'
  ```

  Esta função é segura para multibyte.

* `RIGHT(str,len)`

  Retorna os *`len`* caracteres mais à direita da string *`str`*, ou `NULL` se qualquer argumento for `NULL`.

  ```sql
  mysql> SELECT RIGHT('foobarbar', 4);
          -> 'rbar'
  ```

  Esta função é segura para multibyte.

* `RPAD(str,len,padstr)`

  Retorna a string *`str`*, preenchida à direita (right-padded) com a string *`padstr`* até um comprimento de *`len`* caracteres. Se *`str`* for mais longa que *`len`*, o valor de retorno é encurtado para *`len`* caracteres.

  ```sql
  mysql> SELECT RPAD('hi',5,'?');
          -> 'hi???'
  mysql> SELECT RPAD('hi',1,'?');
          -> 'h'
  ```

  Esta função é segura para multibyte.

* `RTRIM(str)`

  Retorna a string *`str`* com caracteres de espaço finais removidos.

  ```sql
  mysql> SELECT RTRIM('barbar   ');
          -> 'barbar'
  ```

  Esta função é segura para multibyte.

* `SOUNDEX(str)`

  Retorna uma string soundex de *`str`*. Duas strings que soam quase iguais devem ter strings soundex idênticas. Uma string soundex padrão tem quatro caracteres de comprimento, mas a função `SOUNDEX()` retorna uma string arbitrariamente longa. Você pode usar `SUBSTRING()` no resultado para obter uma string soundex padrão. Todos os caracteres não alfabéticos em *`str`* são ignorados. Todos os caracteres alfabéticos internacionais fora do intervalo A-Z são tratados como vogais.

  Importante

  Ao usar `SOUNDEX()`, você deve estar ciente das seguintes limitações:

  + Esta função, conforme implementada atualmente, destina-se a funcionar bem apenas com strings que estão no idioma Inglês. Strings em outros idiomas podem não produzir resultados confiáveis.

  + Não há garantia de que esta função forneça resultados consistentes com strings que usam character sets multibyte, incluindo `utf-8`. Consulte o Bug #22638 para mais informações.

  ```sql
  mysql> SELECT SOUNDEX('Hello');
          -> 'H400'
  mysql> SELECT SOUNDEX('Quadratically');
          -> 'Q36324'
  ```

  Nota

  Esta função implementa o algoritmo Soundex original, e não a versão aprimorada mais popular (também descrita por D. Knuth). A diferença é que a versão original descarta as vogais primeiro e as duplicatas em segundo, enquanto a versão aprimorada descarta as duplicatas primeiro e as vogais em segundo.

* `expr1 SOUNDS LIKE expr2`

  Isso é o mesmo que `SOUNDEX(expr1) = SOUNDEX(expr2)`.

* `SPACE(N)`

  Retorna uma string consistindo de *`N`* caracteres de espaço.

  ```sql
  mysql> SELECT SPACE(6);
          -> '      '
  ```

* `SUBSTR(str,pos)`, `SUBSTR(str FROM pos)`, `SUBSTR(str,pos,len)`, `SUBSTR(str FROM pos FOR len)`

  `SUBSTR()` é um sinônimo para `SUBSTRING()`.

* `SUBSTRING(str,pos)`, `SUBSTRING(str FROM pos)`, `SUBSTRING(str,pos,len)`, `SUBSTRING(str FROM pos FOR len)`

  As formas sem um argumento *`len`* retornam uma substring da string *`str`* começando na posição *`pos`*. As formas com um argumento *`len`* retornam uma substring de *`len`* caracteres de comprimento da string *`str`*, começando na posição *`pos`*. As formas que usam `FROM` são sintaxe SQL padrão. Também é possível usar um valor negativo para *`pos`*. Neste caso, o início da substring é *`pos`* caracteres a partir do final da string, em vez do início. Um valor negativo pode ser usado para *`pos`* em qualquer uma das formas desta função. Um valor de 0 para *`pos`* retorna uma string vazia.

  Para todas as formas de `SUBSTRING()`, a posição do primeiro caractere na string da qual a substring deve ser extraída é contada como `1`.

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

  Esta função é segura para multibyte.

  Se *`len`* for menor que 1, o resultado é a string vazia.

* `SUBSTRING_INDEX(str,delim,count)`

  Retorna a substring da string *`str`* antes de *`count`* ocorrências do delimitador *`delim`*. Se *`count`* for positivo, tudo à esquerda do delimitador final (contando a partir da esquerda) é retornado. Se *`count`* for negativo, tudo à direita do delimitador final (contando a partir da direita) é retornado. `SUBSTRING_INDEX()` executa uma correspondência que diferencia maiúsculas de minúsculas ao procurar por *`delim`*.

  ```sql
  mysql> SELECT SUBSTRING_INDEX('www.mysql.com', '.', 2);
          -> 'www.mysql'
  mysql> SELECT SUBSTRING_INDEX('www.mysql.com', '.', -2);
          -> 'mysql.com'
  ```

  Esta função é segura para multibyte.

* `TO_BASE64(str)`

  Converte o argumento string para a forma codificada em base-64 e retorna o resultado como uma string de caracteres com o character set e collation da conexão. Se o argumento não for uma string, ele é convertido para uma string antes que a conversão ocorra. O resultado é `NULL` se o argumento for `NULL`. Strings codificadas em base-64 podem ser decodificadas usando a função `FROM_BASE64()`.

  ```sql
  mysql> SELECT TO_BASE64('abc'), FROM_BASE64(TO_BASE64('abc'));
          -> 'JWJj', 'abc'
  ```

  Existem diferentes esquemas de codificação base-64. Estas são as regras de codificação e decodificação usadas por `TO_BASE64()` e `FROM_BASE64()`:

  + A codificação para o valor de alfabeto 62 é `'+'`.
  + A codificação para o valor de alfabeto 63 é `'/'`.
  + A saída codificada consiste em grupos de 4 caracteres imprimíveis. Cada 3 bytes dos dados de entrada são codificados usando 4 caracteres. Se o último grupo estiver incompleto, ele é preenchido com caracteres `'='` até um comprimento de 4.
  + Uma quebra de linha (newline) é adicionada após cada 76 caracteres da saída codificada para dividir a saída longa em várias linhas.
  + A decodificação reconhece e ignora quebra de linha, retorno de carro, tabulação e espaço.

* [`TRIM([{BOTH | LEADING | TRAILING} [remstr] FROM] str)`](string-functions.html#function_trim), `TRIM([remstr FROM] str)`

  Retorna a string *`str`* com todos os prefixos ou sufixos *`remstr`* removidos. Se nenhum dos especificadores `BOTH`, `LEADING` ou `TRAILING` for fornecido, `BOTH` é assumido. *`remstr`* é opcional e, se não for especificado, espaços são removidos.

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

  Esta função é segura para multibyte.

* `UCASE(str)`

  `UCASE()` é um sinônimo para `UPPER()`.

  No MySQL 5.7, `UCASE()` usado em uma view é reescrito como `UPPER()` ao armazenar a definição da view. (Bug #12844279)

* `UNHEX(str)`

  Para um argumento string *`str`*, `UNHEX(str)` interpreta cada par de caracteres no argumento como um número hexadecimal e o converte para o byte representado pelo número. O valor de retorno é uma string binária.

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

  Os caracteres na string do argumento devem ser dígitos hexadecimais válidos: `'0'` .. `'9'`, `'A'` .. `'F'`, `'a'` .. `'f'`. Se o argumento contiver quaisquer dígitos não hexadecimais, o resultado é `NULL`:

  ```sql
  mysql> SELECT UNHEX('GG');
  +-------------+
  | UNHEX('GG') |
  +-------------+
  | NULL        |
  +-------------+
  ```

  Um resultado `NULL` pode ocorrer se o argumento para `UNHEX()` for uma coluna `BINARY`, porque os valores são preenchidos com bytes `0x00` quando armazenados, mas esses bytes não são removidos na recuperação. Por exemplo, `'41'` é armazenado em uma coluna `CHAR(3)` como `'41 '` e recuperado como `'41'` (com o espaço de preenchimento final removido), então `UNHEX()` para o valor da coluna retorna `X'41'`. Por outro lado, `'41'` é armazenado em uma coluna `BINARY(3)` como `'41\0'` e recuperado como `'41\0'` (com o byte de preenchimento `0x00` final não removido). `'\0'` não é um dígito hexadecimal válido, então `UNHEX()` para o valor da coluna retorna `NULL`.

  Para um argumento numérico *`N`*, o inverso de `HEX(N)` não é realizado por `UNHEX()`. Use `CONV(HEX(N),16,10)` em seu lugar. Consulte a descrição de `HEX()`.

  Se `UNHEX()` for invocado de dentro do cliente **mysql**, strings binárias são exibidas usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 4.5.1, “mysql — O Cliente de Linha de Comando MySQL”.

* `UPPER(str)`

  Retorna a string *`str`* com todos os caracteres alterados para maiúsculas de acordo com o mapeamento do conjunto de caracteres atual. O padrão é `latin1` (cp1252 Europa Ocidental).

  ```sql
  mysql> SELECT UPPER('Hej');
          -> 'HEJ'
  ```

  Consulte a descrição de `LOWER()` para informações que também se aplicam a `UPPER()`. Isso inclui informações sobre como executar a conversão de maiúsculas/minúsculas de strings binárias (`BINARY`, `VARBINARY`, `BLOB`) para as quais essas funções são ineficazes, e informações sobre o dobramento de maiúsculas/minúsculas (case folding) para character sets Unicode.

  Esta função é segura para multibyte.

  Em versões anteriores do MySQL, `UPPER()` usado em uma view era reescrito como `UCASE()` ao armazenar a definição da view. No MySQL 5.7, `UPPER()` nunca é reescrito nesses casos, mas `UCASE()` usado em views é reescrito como `UPPER()`. (Bug #12844279)

* `WEIGHT_STRING(str [AS {CHAR|BINARY}(N)] [LEVEL levels] [flags])`

  `levels: N [ASC|DESC|REVERSE] [, N [ASC|DESC|REVERSE ...`

  Esta função retorna a string de peso (weight string) para a string de entrada. O valor de retorno é uma string binária que representa o valor de comparação e ordenação da string. Possui estas propriedades:

  + Se `WEIGHT_STRING(str1)` = `WEIGHT_STRING(str2)`, então `str1 = str2` (*`str1`* e *`str2`* são consideradas iguais)

  + Se `WEIGHT_STRING(str1)` < `WEIGHT_STRING(str2)`, então `str1 < str2` (*`str1`* ordena antes de *`str2`*)

  `WEIGHT_STRING()` é uma função de debug destinada a uso interno. Seu comportamento pode mudar sem aviso entre as versões do MySQL. Pode ser usada para testar e depurar collations, especialmente se você estiver adicionando uma nova collation. Consulte a Seção 10.14, “Adicionando uma Collation a um Character Set”.

  Esta lista resume brevemente os argumentos. Mais detalhes são fornecidos na discussão a seguir:

  + *`str`*: A expressão da string de entrada.

  + Cláusula `AS`: Opcional; converte (cast) a string de entrada para um determinado tipo e comprimento.

  + Cláusula `LEVEL`: Opcional; especifica os níveis de peso (weight levels) para o valor de retorno.

  + *`flags`*: Opcional; não utilizado.

  A string de entrada, *`str`*, é uma expressão string. Se a entrada for uma string não binária (caractere), como um valor `CHAR`, `VARCHAR` ou `TEXT`, o valor de retorno contém os pesos de collation para a string. Se a entrada for uma string binária (byte), como um valor `BINARY`, `VARBINARY` ou `BLOB`, o valor de retorno é o mesmo que a entrada (o peso para cada byte em uma string binária é o valor do byte). Se a entrada for `NULL`, `WEIGHT_STRING()` retorna `NULL`.

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

  Os exemplos anteriores usam `HEX()` para exibir o resultado de `WEIGHT_STRING()`. Como o resultado é um valor binário, `HEX()` pode ser especialmente útil quando o resultado contém valores não imprimíveis, para exibi-lo em formato imprimível:

  ```sql
  mysql> SET @s = CONVERT(X'C39F' USING utf8) COLLATE utf8_czech_ci;
  mysql> SELECT HEX(WEIGHT_STRING(@s));
  +------------------------+
  | HEX(WEIGHT_STRING(@s)) |
  +------------------------+
  | 0FEA0FEA               |
  +------------------------+
  ```

  Para valores de retorno não-`NULL`, o tipo de dados do valor é `VARBINARY` se seu comprimento estiver dentro do comprimento máximo para `VARBINARY`; caso contrário, o tipo de dados é `BLOB`.

  A cláusula `AS` pode ser fornecida para converter a string de entrada para uma string não binária ou binária e forçá-la a um determinado comprimento:

  + `AS CHAR(N)` converte a string para uma string não binária e a preenche à direita com espaços para um comprimento de *`N`* caracteres. *`N`* deve ser pelo menos 1. Se *`N`* for menor que o comprimento da string de entrada, a string é truncada para *`N`* caracteres. Nenhum warning ocorre para truncamento.

  + `AS BINARY(N)` é semelhante, mas converte a string para uma string binária, *`N`* é medido em bytes (não caracteres), e o preenchimento usa bytes `0x00` (não espaços).

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

  A cláusula `LEVEL` pode ser fornecida para especificar que o valor de retorno deve conter pesos para níveis de collation específicos.

  O especificador *`levels`* após a palavra-chave `LEVEL` pode ser fornecido como uma lista de um ou mais inteiros separados por vírgulas, ou como um intervalo de dois inteiros separados por um traço. Espaços em branco ao redor dos caracteres de pontuação não importam.

  Exemplos:

  ```sql
  LEVEL 1
  LEVEL 2, 3, 5
  LEVEL 1-3
  ```

  Qualquer level menor que 1 é tratado como 1. Qualquer level maior que o máximo para a collation da string de entrada é tratado como o máximo para a collation. O máximo varia por collation, mas nunca é maior que 6.

  Em uma lista de levels, os levels devem ser fornecidos em ordem crescente. Em um intervalo de levels, se o segundo número for menor que o primeiro, ele é tratado como o primeiro número (por exemplo, 4-2 é o mesmo que 4-4).

  Se a cláusula `LEVEL` for omitida, o MySQL assume `LEVEL 1 - max`, onde *`max`* é o level máximo para a collation.

  Se `LEVEL` for especificado usando a sintaxe de lista (não sintaxe de intervalo), qualquer número de level pode ser seguido por estes modificadores:

  + `ASC`: Retorna os pesos sem modificação. Este é o padrão.

  + `DESC`: Retorna pesos invertidos bitwise (por exemplo, `0x78f0 DESC` = `0x870f`).

  + `REVERSE`: Retorna os pesos em ordem inversa (ou seja, os pesos para a string invertida, com o primeiro caractere por último e o último primeiro).

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

  Se `WEIGHT_STRING()` for invocado de dentro do cliente **mysql**, strings binárias são exibidas usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 4.5.1, “mysql — O Cliente de Linha de Comando MySQL”.