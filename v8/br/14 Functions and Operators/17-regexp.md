### 14.8.2 Expressões Regulares

**Tabela 14.14 Funções e Operadores de Expressões Regulares**

<table><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>NOT REGEXP</code></td> <td>Negação da expressão regular</td> </tr><tr><td><code>REGEXP</code></td> <td>Se a string corresponde à expressão regular</td> </tr><tr><td><code>REGEXP_INSTR()</code></td> <td>Índice inicial da substring que corresponde à expressão regular</td> </tr><tr><td><code>REGEXP_LIKE()</code></td> <td>Se a string corresponde à expressão regular</td> </tr><tr><td><code>REGEXP_REPLACE()</code></td> <td>Substitua substrings que correspondem à expressão regular</td> </tr><tr><td><code>REGEXP_SUBSTR()</code></td> <td>Retorne a substring que corresponde à expressão regular</td> </tr><tr><td><code>RLIKE</code></td> <td>Se a string corresponde à expressão regular</td> </tr></tbody></table>

Uma expressão regular é uma maneira poderosa de especificar um padrão para uma busca complexa. Esta seção discute as funções e operadores disponíveis para a correspondência de expressões regulares e ilustra, com exemplos, alguns dos caracteres especiais e construções que podem ser usados para operações de expressões regulares. Veja também  Seção 5.3.4.7, “Correspondência de Padrões”.

O MySQL implementa suporte a expressões regulares usando Componentes Internacionais para Unicode (ICU), que fornece suporte completo para Unicode e é seguro para multibyte.

O uso de uma string binária com qualquer uma das funções de expressão regular do MySQL é rejeitado com `ER_CHARACTER_SET_MISMATCH`.

*  Descrição das Funções e Operadores de Expressão Regular
*  Sintaxe de Expressão Regular
*  Controle de Recursos de Expressão Regular

#### Descrição das Funções e Operadores de Expressão Regular

* `expr NOT REGEXP pat`, `expr NOT RLIKE pat`

  Isto é o mesmo que `NOT (expr REGEXP pat)`.
* `expr REGEXP pat`, `expr RLIKE pat`

Retorna 1 se a string *`expr`* corresponder à expressão regular especificada pelo padrão *`pat`*, 0 caso contrário. Se *`expr`* ou *`pat`* for `NULL`, o valor de retorno é `NULL`.

`REGEXP` e `RLIKE` são sinônimos de `REGEXP_LIKE()`.

Para obter informações adicionais sobre como ocorre a correspondência, consulte a descrição para `REGEXP_LIKE()`.

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
[`REGEXP_INSTR(expr, pat[, pos[, occurrence[, return_option[, match_type]]]])`](regexp.html#function_regexp-instr)

Retorna o índice inicial da subcadeia da string *`expr`* que corresponde à expressão regular especificada pelo padrão *`pat`*, 0 se não houver correspondência. Se *`expr`* ou *`pat`* for `NULL`, o valor de retorno é `NULL`. Os índices de caracteres começam em 1.

`REGEXP_INSTR()` aceita esses argumentos opcionais:

+ *`pos`*: A posição em *`expr`* a partir da qual a pesquisa deve começar. Se omitido, o padrão é 1.
+ *`occurrence`*: Qual ocorrência de uma correspondência a ser pesquisada. Se omitido, o padrão é 1.
+ *`return_option`*: Que tipo de posição deve ser retornado. Se este valor for 0, `REGEXP_INSTR()` retorna o índice da primeira letra da subcadeia correspondente. Se este valor for 1, `REGEXP_INSTR()` retorna o índice seguinte à subcadeia correspondente. Se omitido, o padrão é 0.
+ *`match_type`*: Uma string que especifica como realizar a correspondência. O significado é conforme descrito para `REGEXP_LIKE()`.

Para obter informações adicionais sobre como ocorre a correspondência, consulte a descrição para `REGEXP_LIKE()`.

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
* `REGEXP_LIKE(expr, pat[, match_type])`

Retorna 1 se a string *`expr`* corresponder à expressão regular especificada pelo padrão *`pat`*, 0 caso contrário. Se *`expr`* ou *`pat`* for `NULL`, o valor de retorno é `NULL`.

O padrão pode ser uma expressão regular estendida, cuja sintaxe é discutida na Sintaxe de Expressões Regulares. O padrão não precisa ser uma string literal. Por exemplo, ele pode ser especificado como uma expressão de string ou coluna de tabela.

O argumento opcional *`match_type`* é uma string que pode conter qualquer ou todas as seguintes letras, especificando como realizar a correspondência:

  + `c`: Correspondência sensível a maiúsculas e minúsculas.
  + `i`: Correspondência sensível a maiúsculas e minúsculas.
  + `m`: Modo de múltiplas linhas. Reconheça terminadores de linha dentro da string. O comportamento padrão é corresponder aos terminadores de linha apenas no início e no final da expressão da string.
  + `n`: O caractere `.` corresponde aos terminadores de linha. O comportamento padrão é que o correspondência de `.`, `^` e `$` pare no final de uma linha.
  + `u`: Terminadores de linha exclusivos do Unix. Apenas o caractere nova linha é reconhecido como um terminal de linha pelos operadores de correspondência `.`, `^` e `$`.

  Se caracteres que especificam opções contraditórias forem especificados dentro de *`match_type`*, o mais à direita prevalece.

  Por padrão, as operações de expressão regular usam o conjunto de caracteres e a ordenação do *`expr`* e *`pat`* argumentos ao decidir o tipo de um caractere e realizar a comparação. Se os argumentos tiverem conjuntos de caracteres ou ordenações diferentes, regras de coercibilidade se aplicam conforme descrito na Seção 12.8.4, “Coercibilidade de Ordenação em Expressões”. Argumentos podem ser especificados com indicadores explícitos de ordenação para alterar o comportamento da comparação.

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

  *`match_type`* pode ser especificado com as letras `c` ou `i` para ignorar a sensibilidade de caso padrão. Exceção: Se qualquer argumento for uma string binária, os argumentos são tratados de forma sensível a maiúsculas e minúsculas como strings binárias, mesmo se *`match_type`* contiver o caractere `i`.

  ::: info Nota

  O MySQL usa a sintaxe de escape C em strings (por exemplo, `\n` para representar o caractere nova linha). Se você deseja que o argumento *`expr`* ou *`pat`* contenha um literal `\`, você deve duplicá-lo. (A menos que o modo SQL `NO_BACKSLASH_ESCAPES` esteja habilitado, caso em que nenhum caractere de escape é usado.)

Substitui as ocorrências na string *`expr`* que correspondem à expressão regular especificada pelo padrão *`pat`* pela string de substituição *`repl`*, e retorna a string resultante. Se *`expr`*, *`pat`* ou *`repl`* for `NULL`, o valor de retorno é `NULL`.

`REGEXP_REPLACE()` aceita esses argumentos opcionais:

+ *`pos`*: A posição em *`expr`* onde a busca deve começar. Se omitido, o padrão é 1.
+ *`occurrence`*: Qual ocorrência de uma correspondência para substituir. Se omitido, o padrão é 0 (o que significa “substituir todas as ocorrências”).
+ *`match_type`*: Uma string que especifica como realizar a correspondência. O significado é conforme descrito para `REGEXP_LIKE()`.

O resultado retornado por essa função usa o conjunto de caracteres e a ordenação da expressão em que as correspondências são pesquisadas.

Para obter informações adicionais sobre como a correspondência ocorre, consulte a descrição para `REGEXP_LIKE()`.

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
[`REGEXP_SUBSTR(expr, pat[, pos[, occurrence[, match_type]]])`](regexp.html#function_regexp-substr)

Retorna a subcadeia da string *`expr`* que corresponde à expressão regular especificada pelo padrão *`pat`*, `NULL` se não houver correspondência. Se *`expr`* ou *`pat`* for `NULL`, o valor de retorno é `NULL`.

`REGEXP_SUBSTR()` aceita esses argumentos opcionais:

+ *`pos`*: A posição em *`expr`* onde a busca deve começar. Se omitido, o padrão é 1.
+ *`occurrence`*: Qual ocorrência de uma correspondência para pesquisar. Se omitido, o padrão é 1.
+ *`match_type`*: Uma string que especifica como realizar a correspondência. O significado é conforme descrito para `REGEXP_LIKE()`.

O resultado retornado por essa função usa o conjunto de caracteres e a ordenação da expressão em que as correspondências são pesquisadas.

Para obter informações adicionais sobre como a correspondência ocorre, consulte a descrição para `REGEXP_LIKE()`.

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

#### Sintaxe de Expressões Regulares


Uma expressão regular descreve um conjunto de strings. A expressão regular mais simples é aquela que não contém caracteres especiais. Por exemplo, a expressão regular `hello` corresponde a `hello` e nada mais.

Expressões regulares não triviais usam certas construções especiais para que possam corresponder a mais de uma string. Por exemplo, a expressão regular `hello|world` contém o operador de alternância `|` e corresponde a `hello` ou `world`.

Como exemplo mais complexo, a expressão regular `B[an]*s` corresponde a qualquer uma das strings `Bananas`, `Baaaaas`, `Bs` e qualquer outra string que comece com um `B`, termine com um `s` e contenha qualquer número de caracteres `a` ou `n` entre eles.

A lista a seguir abrange alguns dos caracteres especiais e construções básicas que podem ser usados em expressões regulares. Para informações sobre a sintaxe completa de expressões regulares suportada pela biblioteca ICU usada para implementar suporte a expressões regulares, visite o site da International Components for Unicode.

* `^`

  Corresponde ao início de uma string.

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
* `$`

  Corresponde ao final de uma string.

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
* `.`

  Corresponde a qualquer caractere (incluindo retorno de carro e nova linha, embora para corresponder a esses no meio de uma string, o caractere de controle de correspondência de múltiplas linhas `m` (multiple line) ou o modificador `(?m)` dentro do padrão deve ser fornecido).

  ```
  mysql> SELECT REGEXP_LIKE('fo\nfo', '^fo$');                   -> 0
  mysql> SELECT REGEXP_LIKE('fofo', '^fo');                      -> 1
  ```
* `a*`

  Corresponde a qualquer sequência de zero ou mais caracteres `a`.

  ```
  mysql> SELECT REGEXP_LIKE('fo\no', '^fo\no$');                 -> 1
  mysql> SELECT REGEXP_LIKE('fo\no', '^fo$');                    -> 0
  ```
* `a+`

  Corresponde a qualquer sequência de um ou mais caracteres `a`.

  ```
  mysql> SELECT REGEXP_LIKE('fofo', '^f.*$');                    -> 1
  mysql> SELECT REGEXP_LIKE('fo\r\nfo', '^f.*$');                -> 0
  mysql> SELECT REGEXP_LIKE('fo\r\nfo', '^f.*$', 'm');           -> 1
  mysql> SELECT REGEXP_LIKE('fo\r\nfo', '(?m)^f.*$');           -> 1
  ```
* `a?`

  Corresponde a zero ou um caractere `a`.

  ```
  mysql> SELECT REGEXP_LIKE('Ban', '^Ba*n');                     -> 1
  mysql> SELECT REGEXP_LIKE('Baaan', '^Ba*n');                   -> 1
  mysql> SELECT REGEXP_LIKE('Bn', '^Ba*n');                      -> 1
  ```
* `de|abc`

  Alternância; corresponde a uma das sequências `de` ou `abc`.

  ```
  mysql> SELECT REGEXP_LIKE('Ban', '^Ba+n');                     -> 1
  mysql> SELECT REGEXP_LIKE('Bn', '^Ba+n');                      -> 0
  ```
* `(abc)*`

  Corresponde a zero ou mais instâncias da sequência `abc`.

  ```
  mysql> SELECT REGEXP_LIKE('Bn', '^Ba?n');                      -> 1
  mysql> SELECT REGEXP_LIKE('Ban', '^Ba?n');                     -> 1
  mysql> SELECT REGEXP_LIKE('Baan', '^Ba?n');                    -> 0
  ```
* `{1}`, `{2,3}`

  Repetição; as notações `{n}` e `{m,n}` fornecem uma maneira mais geral de escrever expressões regulares que correspondem a muitas ocorrências do átomo anterior (ou “pedaço”) do padrão. *`m`* e *`n`* são inteiros.

  + `a*`

Pode ser escrito como `a{0,}`.
  + `a+`

    Pode ser escrito como `a{1,}`.
  + `a?`

    Pode ser escrito como `a{0,1}`.

  Para ser mais preciso, `a{n}` corresponde exatamente *`n`* instâncias de `a`. `a{n,}` corresponde *`n`* ou mais instâncias de `a`. `a{m,n}` corresponde *`m`* até *`n`* instâncias de `a`, inclusive. Se tanto *`m`* quanto *`n`* forem fornecidos, *`m`* deve ser menor ou igual a *`n`*.

  ```
  mysql> SELECT REGEXP_LIKE('pi', 'pi|apa');                     -> 1
  mysql> SELECT REGEXP_LIKE('axe', 'pi|apa');                    -> 0
  mysql> SELECT REGEXP_LIKE('apa', 'pi|apa');                    -> 1
  mysql> SELECT REGEXP_LIKE('apa', '^(pi|apa)$');                -> 1
  mysql> SELECT REGEXP_LIKE('pi', '^(pi|apa)$');                 -> 1
  mysql> SELECT REGEXP_LIKE('pix', '^(pi|apa)$');                -> 0
  ```
* `[a-dX]`, `[^a-dX]`

  Concorrerá a qualquer caractere que seja (ou não seja, se `^` for usado) `a`, `b`, `c`, `d` ou `X`. Um caractere `-` entre dois outros caracteres forma uma faixa que corresponde a todos os caracteres do primeiro caractere ao segundo. Por exemplo, `[0-9]` corresponde a qualquer dígito decimal. Para incluir um caractere literal `]` ao final, ele deve seguir imediatamente o parêntese de abertura `[`. Para incluir um caractere literal `-`, ele deve ser escrito primeiro ou último. Qualquer caractere que não tenha um significado especial definido dentro de um par `[]` corresponde apenas a si mesmo.

  ```
  mysql> SELECT REGEXP_LIKE('pi', '^(pi)*$');                    -> 1
  mysql> SELECT REGEXP_LIKE('pip', '^(pi)*$');                   -> 0
  mysql> SELECT REGEXP_LIKE('pipi', '^(pi)*$');                  -> 1
  ```
* `[=character_class=]`

  Dentro de uma expressão em parênteses (escrita usando `[` e `]`), `[=character_class=]` representa uma classe de equivalência. Concorrerá a todos os caracteres com o mesmo valor de collation, incluindo o próprio caractere. Por exemplo, se `o` e `(+)` são os membros de uma classe de equivalência, `[[=o=]]`, `[[=(+)=]]` e `[o(+)]` são todos sinônimos. Uma classe de equivalência não pode ser usada como um ponto final de uma faixa.
* `[:character_class:]`

  Dentro de uma expressão em parênteses (escrita usando `[` e `]`), `[:character_class:]` representa uma classe de caracteres que corresponde a todos os caracteres pertencentes a essa classe. A tabela a seguir lista os nomes padrão das classes. Esses nomes representam as classes de caracteres definidas na página de manual `ctype(3)`. Um determinado local pode fornecer outros nomes de classe. Uma classe de caracteres não pode ser usada como um ponto final de uma faixa.

<table><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Nome da Classe do Caractere</th> <th>Significado</th> </tr></thead><tbody><tr> <td><code>alnum</code></td> <td>Caracteres alfanuméricos</td> </tr><tr> <td><code>alpha</code></td> <td>Caracteres alfabéticos</td> </tr><tr> <td><code>blank</code></td> <td>Caracteres de espaço em branco</td> </tr><tr> <td><code>cntrl</code></td> <td>Caracteres de controle</td> </tr><tr> <td><code>digit</code></td> <td>Caracteres numéricos</td> </tr><tr> <td><code>graph</code></td> <td>Caracteres gráficos</td> </tr><tr> <td><code>lower</code></td> <td>Caracteres alfabéticos minúsculos</td> </tr><tr> <td><code>print</code></td> <td>Caracteres gráficos ou espaços</td> </tr><tr> <td><code>punct</code></td> <td>Caracteres de pontuação</td> </tr><tr> <td><code>space</code></td> <td>Espaço, tabulação, nova linha e retorno de carro</td> </tr><tr> <td><code>upper</code></td> <td>Caracteres alfabéticos maiúsculos</td> </tr><tr> <td><code>xdigit</code></td> <td>Caracteres numéricos hexadecimais</td> </tr></tbody></table>

```
  mysql> SELECT REGEXP_LIKE('abcde', 'a[bcd]{2}e');              -> 0
  mysql> SELECT REGEXP_LIKE('abcde', 'a[bcd]{3}e');              -> 1
  mysql> SELECT REGEXP_LIKE('abcde', 'a[bcd]{1,10}e');           -> 1
  ```

Para usar uma instância literal de um caractere especial em uma expressão regular, anteceda-o com dois caracteres barra invertida (\). O analisador MySQL interpreta um dos barras invertidas, e a biblioteca de expressões regulares interpreta a outra. Por exemplo, para corresponder à string `1+2` que contém o caractere especial `+`, apenas a seguinte expressão regular é a correta:

```
  mysql> SELECT REGEXP_LIKE('aXbc', '[a-dXYZ]');                 -> 1
  mysql> SELECT REGEXP_LIKE('aXbc', '^[a-dXYZ]$');               -> 0
  mysql> SELECT REGEXP_LIKE('aXbc', '^[a-dXYZ]+$');              -> 1
  mysql> SELECT REGEXP_LIKE('aXbc', '^[^a-dXYZ]+$');             -> 0
  mysql> SELECT REGEXP_LIKE('gheis', '^[^a-dXYZ]+$');            -> 1
  mysql> SELECT REGEXP_LIKE('gheisa', '^[^a-dXYZ]+$');           -> 0
  ```

#### Recurso de Expressão Regular Controle

 `REGEXP_LIKE()` e funções semelhantes usam recursos que podem ser controlados definindo variáveis de sistema:

* O mecanismo de correspondência utiliza memória para sua pilha interna. Para controlar a memória máxima disponível para a pilha em bytes, defina a variável de sistema `regexp_stack_limit`.
* O mecanismo de correspondência opera em etapas. Para controlar o número máximo de etapas realizadas pelo mecanismo (e, portanto, indiretamente o tempo de execução), defina a variável de sistema `regexp_time_limit`. Como esse limite é expresso em número de etapas, ele afeta o tempo de execução apenas indiretamente. Tipicamente, é da ordem de milissegundos.