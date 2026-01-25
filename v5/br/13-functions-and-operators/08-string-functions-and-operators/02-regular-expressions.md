### 12.8.2 Expressões Regulares

**Tabela 12.14 Funções e Operadores de Expressão Regular**

<table frame="box" rules="all" summary="Uma referência que lista funções e operadores de expressão regular."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>NOT REGEXP</code></td> <td> Negação de REGEXP </td> </tr><tr><td><code>REGEXP</code></td> <td> Se a string corresponde à expressão regular </td> </tr><tr><td><code>RLIKE</code></td> <td> Se a string corresponde à expressão regular </td> </tr></tbody></table>

Uma expressão regular é uma maneira poderosa de especificar um padrão para uma busca complexa. Esta seção discute os operadores disponíveis para correspondência de expressão regular e ilustra, com exemplos, alguns dos caracteres e construções especiais que podem ser usados para operações de expressão regular. Veja também a Seção 3.3.4.7, “Pattern Matching”.

O MySQL usa a implementação de expressões regulares de Henry Spencer, que visa a conformidade com POSIX 1003.2. O MySQL usa a versão estendida para suportar operações de correspondência de padrão de expressão regular em instruções SQL. Esta seção não contém todos os detalhes que podem ser encontrados na página de manual `regex(7)` de Henry Spencer. Essa página de manual está incluída nas distribuições de código-fonte do MySQL, no arquivo `regex.7` no diretório `regex`.

* Descrições de Funções e Operadores de Expressão Regular
* Sintaxe de Expressão Regular

#### Descrições de Funções e Operadores de Expressão Regular

* `expr NOT REGEXP pat`, `expr NOT RLIKE pat`

  Isso é o mesmo que `NOT (expr REGEXP pat)`.

* `expr REGEXP pat`, `expr RLIKE pat`

  Retorna 1 se a string *`expr`* corresponde à expressão regular especificada pelo padrão *`pat`*, 0 caso contrário. Se *`expr`* ou *`pat`* for `NULL`, o valor de retorno é `NULL`.

  `RLIKE` é um sinônimo para `REGEXP`.

  O padrão pode ser uma expressão regular estendida, cuja sintaxe é discutida em Sintaxe de Expressão Regular. O padrão não precisa ser uma string literal. Por exemplo, pode ser especificado como uma expressão de string ou coluna de tabela.

  Nota

  O MySQL usa sintaxe de escape C em strings (por exemplo, `\n` para representar o caractere de nova linha). Se você quiser que seu argumento *`expr`* ou *`pat`* contenha um `\`, você deve duplicá-lo. (A menos que o modo SQL `NO_BACKSLASH_ESCAPES` esteja habilitado, nesse caso, nenhum caractere de escape é usado.)

  As operações de expressão regular usam o conjunto de caracteres e o collation dos argumentos de expressão de string e padrão ao decidir o tipo de um caractere e realizar a comparação. Se os argumentos tiverem conjuntos de caracteres ou collations diferentes, as regras de coercibilidade se aplicam conforme descrito na Seção 10.8.4, “Collation Coercibility in Expressions”. Se qualquer um dos argumentos for uma string binária, os argumentos são tratados de forma case-sensitive (sensível a maiúsculas/minúsculas) como strings binárias.

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

  Os operadores `REGEXP` e `RLIKE` funcionam no modo byte-wise, portanto, eles não são seguros para multibyte e podem produzir resultados inesperados com conjuntos de caracteres multibyte. Além disso, esses operadores comparam caracteres por seus valores de byte e caracteres acentuados podem não ser comparados como iguais, mesmo que um determinado collation os trate como iguais.

#### Sintaxe de Expressão Regular

Uma expressão regular descreve um conjunto de strings. A expressão regular mais simples é aquela que não contém caracteres especiais. Por exemplo, a expressão regular `hello` corresponde a `hello` e nada mais.

Expressões regulares não triviais usam certas construções especiais para que possam corresponder a mais de uma string. Por exemplo, a expressão regular `hello|world` contém o operador de alternância `|` e corresponde a `hello` ou `world`.

Como um exemplo mais complexo, a expressão regular `B[an]*s` corresponde a qualquer uma das strings `Bananas`, `Baaaaas`, `Bs` e qualquer outra string que comece com um `B`, termine com um `s`, e contenha qualquer número de caracteres `a` ou `n` entre eles.

Uma expressão regular para o operador `REGEXP` pode usar qualquer um dos seguintes caracteres e construções especiais:

* `^`

  Corresponde ao início de uma string.

  ```sql
  mysql> SELECT 'fo\nfo' REGEXP '^fo$';                   -> 0
  mysql> SELECT 'fofo' REGEXP '^fo';                      -> 1
  ```

* `$`

  Corresponde ao fim de uma string.

  ```sql
  mysql> SELECT 'fo\no' REGEXP '^fo\no$';                 -> 1
  mysql> SELECT 'fo\no' REGEXP '^fo$';                    -> 0
  ```

* `.`

  Corresponde a qualquer caractere (incluindo retorno de carro e nova linha).

  ```sql
  mysql> SELECT 'fofo' REGEXP '^f.*$';                    -> 1
  mysql> SELECT 'fo\r\nfo' REGEXP '^f.*$';                -> 1
  ```

* `a*`

  Corresponde a qualquer sequência de zero ou mais caracteres `a`.

  ```sql
  mysql> SELECT 'Ban' REGEXP '^Ba*n';                     -> 1
  mysql> SELECT 'Baaan' REGEXP '^Ba*n';                   -> 1
  mysql> SELECT 'Bn' REGEXP '^Ba*n';                      -> 1
  ```

* `a+`

  Corresponde a qualquer sequência de um ou mais caracteres `a`.

  ```sql
  mysql> SELECT 'Ban' REGEXP '^Ba+n';                     -> 1
  mysql> SELECT 'Bn' REGEXP '^Ba+n';                      -> 0
  ```

* `a?`

  Corresponde a zero ou um caractere `a`.

  ```sql
  mysql> SELECT 'Bn' REGEXP '^Ba?n';                      -> 1
  mysql> SELECT 'Ban' REGEXP '^Ba?n';                     -> 1
  mysql> SELECT 'Baan' REGEXP '^Ba?n';                    -> 0
  ```

* `de|abc`

  Alternância; corresponde a qualquer uma das sequências `de` ou `abc`.

  ```sql
  mysql> SELECT 'pi' REGEXP 'pi|apa';                     -> 1
  mysql> SELECT 'axe' REGEXP 'pi|apa';                    -> 0
  mysql> SELECT 'apa' REGEXP 'pi|apa';                    -> 1
  mysql> SELECT 'apa' REGEXP '^(pi|apa)$';                -> 1
  mysql> SELECT 'pi' REGEXP '^(pi|apa)$';                 -> 1
  mysql> SELECT 'pix' REGEXP '^(pi|apa)$';                -> 0
  ```

* `(abc)*`

  Corresponde a zero ou mais instâncias da sequência `abc`.

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

  Para ser mais preciso, `a{n}` corresponde exatamente a *`n`* instâncias de `a`. `a{n,}` corresponde a *`n`* ou mais instâncias de `a`. `a{m,n}` corresponde a *`m`* até *`n`* instâncias de `a`, inclusive. Se *`m`* e *`n`* forem fornecidos, *`m`* deve ser menor ou igual a *`n`*.

  *`m`* e *`n`* devem estar no intervalo de `0` a `RE_DUP_MAX` (padrão 255), inclusive.

  ```sql
  mysql> SELECT 'abcde' REGEXP 'a[bcd]{2}e';              -> 0
  mysql> SELECT 'abcde' REGEXP 'a[bcd]{3}e';              -> 1
  mysql> SELECT 'abcde' REGEXP 'a[bcd]{1,10}e';           -> 1
  ```

* `[a-dX]`, `[^a-dX]`

  Corresponde a qualquer caractere que seja (ou não seja, se `^` for usado) `a`, `b`, `c`, `d` ou `X`. Um caractere `-` entre dois outros caracteres forma um intervalo que corresponde a todos os caracteres do primeiro caractere ao segundo. Por exemplo, `[0-9]` corresponde a qualquer dígito decimal. Para incluir um caractere literal `]`, ele deve seguir imediatamente o colchete de abertura `[`. Para incluir um caractere literal `-`, ele deve ser escrito primeiro ou por último. Qualquer caractere que não tenha um significado especial definido dentro de um par `[]` corresponde apenas a si mesmo.

  ```sql
  mysql> SELECT 'aXbc' REGEXP '[a-dXYZ]';                 -> 1
  mysql> SELECT 'aXbc' REGEXP '^[a-dXYZ]$';               -> 0
  mysql> SELECT 'aXbc' REGEXP '^[a-dXYZ]+$';              -> 1
  mysql> SELECT 'aXbc' REGEXP '^[^a-dXYZ]+$';             -> 0
  mysql> SELECT 'gheis' REGEXP '^[^a-dXYZ]+$';            -> 1
  mysql> SELECT 'gheisa' REGEXP '^[^a-dXYZ]+$';           -> 0
  ```

* `[.characters.]`

  Dentro de uma expressão entre colchetes (escrita usando `[` e `]`), corresponde à sequência de caracteres daquele elemento de collation. `characters` é um único caractere ou um nome de caractere como `newline`. A tabela a seguir lista os nomes de caracteres permitidos.

  A tabela a seguir mostra os nomes de caracteres permitidos e os caracteres aos quais eles correspondem. Para caracteres fornecidos como valores numéricos, os valores são representados em octal.

  <table summary="Nomes de caracteres permitidos e caracteres aos quais eles correspondem. Para economizar espaço, o emparelhamento de colunas Nome e Caractere são apresentados em um formato de tabela de quatro colunas nesta ordem: Nome, Caractere, Nome, Caractere. Para caracteres fornecidos como valores numéricos, os valores são representados em octal."><col style="width: 25%"/><col style="width: 25%"/><col style="width: 25%"/><col style="width: 25%"/><thead><tr> <th>Nome</th> <th>Caractere</th> <th>Nome</th> <th>Caractere</th> </tr></thead><tbody><tr> <th><code>NUL</code></th> <td><code>0</code></td> <td><code>SOH</code></td> <td><code>001</code></td> </tr><tr> <th><code>STX</code></th> <td><code>002</code></td> <td><code>ETX</code></td> <td><code>003</code></td> </tr><tr> <th><code>EOT</code></th> <td><code>004</code></td> <td><code>ENQ</code></td> <td><code>005</code></td> </tr><tr> <th><code>ACK</code></th> <td><code>006</code></td> <td><code>BEL</code></td> <td><code>007</code></td> </tr><tr> <th><code>alert</code></th> <td><code>007</code></td> <td><code>BS</code></td> <td><code>010</code></td> </tr><tr> <th><code>backspace</code></th> <td><code>'\b'</code></td> <td><code>HT</code></td> <td><code>011</code></td> </tr><tr> <th><code>tab</code></th> <td><code>'\t'</code></td> <td><code>LF</code></td> <td><code>012</code></td> </tr><tr> <th><code>newline</code></th> <td><code>'\n'</code></td> <td><code>VT</code></td> <td><code>013</code></td> </tr><tr> <th><code>vertical-tab</code></th> <td><code>'\v'</code></td> <td><code>FF</code></td> <td><code>014</code></td> </tr><tr> <th><code>form-feed</code></th> <td><code>'\f'</code></td> <td><code>CR</code></td> <td><code>015</code></td> </tr><tr> <th><code>carriage-return</code></th> <td><code>'\r'</code></td> <td><code>SO</code></td> <td><code>016</code></td> </tr><tr> <th><code>SI</code></th> <td><code>017</code></td> <td><code>DLE</code></td> <td><code>020</code></td> </tr><tr> <th><code>DC1</code></th> <td><code>021</code></td> <td><code>DC2</code></td> <td><code>022</code></td> </tr><tr> <th><code>DC3</code></th> <td><code>023</code></td> <td><code>DC4</code></td> <td><code>024</code></td> </tr><tr> <th><code>NAK</code></th> <td><code>025</code></td> <td><code>SYN</code></td> <td><code>026</code></td> </tr><tr> <th><code>ETB</code></th> <td><code>027</code></td> <td><code>CAN</code></td> <td><code>030</code></td> </tr><tr> <th><code>EM</code></th> <td><code>031</code></td> <td><code>SUB</code></td> <td><code>032</code></td> </tr><tr> <th><code>ESC</code></th> <td><code>033</code></td> <td><code>IS4</code></td> <td><code>034</code></td> </tr><tr> <th><code>FS</code></th> <td><code>034</code></td> <td><code>IS3</code></td> <td><code>035</code></td> </tr><tr> <th><code>GS</code></th> <td><code>035</code></td> <td><code>IS2</code></td> <td><code>036</code></td> </tr><tr> <th><code>RS</code></th> <td><code>036</code></td> <td><code>IS1</code></td> <td><code>037</code></td> </tr><tr> <th><code>US</code></th> <td><code>037</code></td> <td><code>space</code></td> <td><code>' '</code></td> </tr><tr> <th><code>exclamation-mark</code></th> <td><code>'!'</code></td> <td><code>quotation-mark</code></td> <td><code>'"'</code></td> </tr><tr> <th><code>number-sign</code></th> <td><code>'#'</code></td> <td><code>dollar-sign</code></td> <td><code>'$'</code></td> </tr><tr> <th><code>percent-sign</code></th> <td><code>'%'</code></td> <td><code>ampersand</code></td> <td><code>'&amp;'</code></td> </tr><tr> <th><code>apostrophe</code></th> <td><code>'\''</code></td> <td><code>left-parenthesis</code></td> <td><code>'('</code></td> </tr><tr> <th><code>right-parenthesis</code></th> <td><code>')'</code></td> <td><code>asterisk</code></td> <td><code>'*'</code></td> </tr><tr> <th><code>plus-sign</code></th> <td><code>'+'</code></td> <td><code>comma</code></td> <td><code>','</code></td> </tr><tr> <th><code>hyphen</code></th> <td><code>'-'</code></td> <td><code>hyphen-minus</code></td> <td><code>'-'</code></td> </tr><tr> <th><code>period</code></th> <td><code>'.'</code></td> <td><code>full-stop</code></td> <td><code>'.'</code></td> </tr><tr> <th><code>slash</code></th> <td><code>'/'</code></td> <td><code>solidus</code></td> <td><code>'/'</code></td> </tr><tr> <th><code>zero</code></th> <td><code>'0'</code></td> <td><code>one</code></td> <td><code>'1'</code></td> </tr><tr> <th><code>two</code></th> <td><code>'2'</code></td> <td><code>three</code></td> <td><code>'3'</code></td> </tr><tr> <th><code>four</code></th> <td><code>'4'</code></td> <td><code>five</code></td> <td><code>'5'</code></td> </tr><tr> <th><code>six</code></th> <td><code>'6'</code></td> <td><code>seven</code></td> <td><code>'7'</code></td> </tr><tr> <th><code>eight</code></th> <td><code><code>'8'</code></td> <td><code>nine</code></td> <td><code>'9'</code></td> </tr><tr> <th><code>colon</code></th> <td><code>':'</code></td> <td><code>semicolon</code></td> <td><code>';'</code></td> </tr><tr> <th><code>less-than-sign</code></th> <td><code>'&lt;'</code></td> <td><code>equals-sign</code></td> <td><code>'='</code></td> </tr><tr> <th><code>greater-than-sign</code></th> <td><code>'&gt;'</code></td> <td><code>question-mark</code></td> <td><code>'?'</code></td> </tr><tr> <th><code>commercial-at</code></th> <td><code>'@'</code></td> <td><code>left-square-bracket</code></td> <td><code>'['</code></td> </tr><tr> <th><code>backslash</code></th> <td><code>'\\'</code></td> <td><code>reverse-solidus</code></td> <td><code>'\\'</code></td> </tr><tr> <th><code>right-square-bracket</code></th> <td><code>']'</code></td> <td><code>circumflex</code></td> <td><code>'^'</code></td> </tr><tr> <th><code>circumflex-accent</code></th> <td><code>'^'</code></td> <td><code>underscore</code></td> <td><code>'_'</code></td> </tr><tr> <th><code>low-line</code></th> <td><code>'_'</code></td> <td><code>grave-accent</code></td> <td><code>'`'</code></td> </tr><tr> <th><code>left-brace</code></th> <td><code>'{'</code></td> <td><code>left-curly-bracket</code></td> <td><code>'{'</code></td> </tr><tr> <th><code>vertical-line</code></th> <td><code>'|'</code></td> <td><code>right-brace</code></td> <td><code>'}'</code></td> </tr><tr> <th><code>right-curly-bracket</code></th> <td><code>'}'</code></td> <td><code>tilde</code></td> <td><code>'~'</code></td> </tr><tr> <th><code>DEL</code></th> <td><code>177</code></td> <td></td> <td></td> </tr></tbody></table>

  ```sql
  mysql> SELECT '~' REGEXP '.~.';                     -> 1
  mysql> SELECT '~' REGEXP '.tilde.';                 -> 1
  ```

* `[=character_class=]`

  Dentro de uma expressão entre colchetes (escrita usando `[` e `]`), `[=character_class=]` representa uma classe de equivalência. Corresponde a todos os caracteres com o mesmo valor de collation, incluindo ele próprio. Por exemplo, se `o` e `(+)` são membros de uma classe de equivalência, `=o=`, `=(+)=` e `[o(+)]` são todos sinônimos. Uma classe de equivalência não pode ser usada como ponto final de um range.

* `[:character_class:]`

  Dentro de uma expressão entre colchetes (escrita usando `[` e `]`), `[:character_class:]` representa uma classe de caracteres que corresponde a todos os caracteres pertencentes a essa classe. A tabela a seguir lista os nomes de classe padrão. Esses nomes representam as classes de caracteres definidas na página de manual `ctype(3)`. Uma localidade (locale) específica pode fornecer outros nomes de classe. Uma classe de caracteres não pode ser usada como ponto final de um range.

  <table summary="Nomes de classe de caracteres e o significado de cada classe."><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Nome da Classe de Caracteres</th> <th>Significado</th> </tr></thead><tbody><tr> <td><code>alnum</code></td> <td>Caracteres alfanuméricos</td> </tr><tr> <td><code>alpha</code></td> <td>Caracteres alfabéticos</td> </tr><tr> <td><code>blank</code></td> <td>Caracteres de espaço em branco</td> </tr><tr> <td><code>cntrl</code></td> <td>Caracteres de controle</td> </tr><tr> <td><code>digit</code></td> <td>Caracteres de dígito</td> </tr><tr> <td><code>graph</code></td> <td>Caracteres gráficos</td> </tr><tr> <td><code>lower</code></td> <td>Caracteres alfabéticos em minúsculas</td> </tr><tr> <td><code>print</code></td> <td>Caracteres gráficos ou de espaço</td> </tr><tr> <td><code>punct</code></td> <td>Caracteres de pontuação</td> </tr><tr> <td><code>space</code></td> <td>Espaço, tabulação, nova linha e retorno de carro</td> </tr><tr> <td><code>upper</code></td> <td>Caracteres alfabéticos em maiúsculas</td> </tr><tr> <td><code>xdigit</code></td> <td>Caracteres de dígito hexadecimal</td> </tr></tbody></table>

  ```sql
  mysql> SELECT 'justalnums' REGEXP ':alnum:+';       -> 1
  mysql> SELECT '!!' REGEXP ':alnum:+';               -> 0
  ```

* `:<:`, `:>:`

  Esses marcadores representam limites de palavras (word boundaries). Eles correspondem, respectivamente, ao início e ao fim das palavras. Uma palavra é uma sequência de caracteres de palavra que não é precedida ou seguida por caracteres de palavra. Um caractere de palavra é um caractere alfanumérico na classe `alnum` ou um underscore (`_`).

  ```sql
  mysql> SELECT 'a word a' REGEXP ':<:word:>:';   -> 1
  mysql> SELECT 'a xword a' REGEXP ':<:word:>:';  -> 0
  ```

Para usar uma instância literal de um caractere especial em uma expressão regular, preceda-o por duas barras invertidas (\\). O parser do MySQL interpreta uma das barras invertidas, e a biblioteca de expressão regular interpreta a outra. Por exemplo, para corresponder à string `1+2` que contém o caractere especial `+`, apenas a última das seguintes expressões regulares está correta:

```sql
mysql> SELECT '1+2' REGEXP '1+2';                       -> 0
mysql> SELECT '1+2' REGEXP '1\+2';                      -> 0
mysql> SELECT '1+2' REGEXP '1\\+2';                     -> 1
```
