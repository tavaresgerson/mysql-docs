### 12.8.2 Expressões Regulares

**Tabela 12.14 Funções e operadores de expressão regular**

<table frame="box" rules="all" summary="Uma referência que lista funções e operadores de expressão regular."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td>[[<code>NOT REGEXP</code>]]</td> <td>Negação de REGEXP</td> </tr><tr><td>[[<code>REGEXP</code>]]</td> <td>Se a cadeia corresponde à expressão regular</td> </tr><tr><td>[[<code>RLIKE</code>]]</td> <td>Se a cadeia corresponde à expressão regular</td> </tr></tbody></table>

Uma expressão regular é uma maneira poderosa de especificar um padrão para uma busca complexa. Esta seção discute os operadores disponíveis para a correspondência com expressões regulares e ilustra, com exemplos, alguns dos caracteres especiais e construções que podem ser usados para operações com expressões regulares. Veja também a Seção 3.3.4.7, “Correspondência de Padrões”.

O MySQL utiliza a implementação de expressões regulares de Henry Spencer, que visa a conformidade com o POSIX 1003.2. O MySQL utiliza a versão estendida para suportar operações de correspondência de padrões de expressões regulares em instruções SQL. Esta seção não contém todos os detalhes que podem ser encontrados na página de manual `regex(7)` de Henry Spencer. Essa página de manual está incluída nas distribuições de código-fonte do MySQL, no arquivo `regex.7` sob o diretório `regex`.

- Funções e descrições dos operadores de expressão regular
- Sintaxe de Expressões Regulares

#### Funções e descrições dos operadores de expressão regular

- `expr NOT REGEXP pat`, `expr NOT RLIKE pat`

  Isso é o mesmo que `NOT (expr REGEXP pat)`.

- `expr REGEXP pat`, `expr RLIKE pat`

  Retorna 1 se a string *`expr`* corresponder à expressão regular especificada pelo padrão *`pat`*, caso contrário, retorna 0. Se qualquer um de *`expr`* ou *`pat`* for `NULL`, o valor de retorno será `NULL`.

  `RLIKE` é um sinônimo de `REGEXP`.

  O padrão pode ser uma expressão regular estendida, cuja sintaxe é discutida na Sintaxe de Expressões Regulares. O padrão não precisa ser uma string literal. Por exemplo, ele pode ser especificado como uma expressão de string ou coluna de tabela.

  Nota

  O MySQL usa a sintaxe de escape C em strings (por exemplo, `\n` para representar o caractere de nova linha). Se você deseja que o argumento *`expr`* ou *`pat`* contenha um `\` literal, você deve duplicá-lo. (A menos que o modo SQL `NO_BACKSLASH_ESCAPES` esteja habilitado, caso em que nenhum caractere de escape é usado.)

  As operações de expressão regular usam o conjunto de caracteres e a ordenação da expressão e do padrão da string como argumentos para decidir o tipo de um caractere e realizar a comparação. Se os argumentos tiverem conjuntos de caracteres ou ordenações diferentes, as regras de coercibilidade se aplicam conforme descrito na Seção 10.8.4, “Coercibilidade de Ordenação em Expressões”. Se qualquer argumento for uma string binária, os argumentos são tratados de forma sensível a maiúsculas e minúsculas como strings binárias.

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

  Os operadores `REGEXP` e `RLIKE` funcionam de forma de byte, portanto, não são seguros para multibytes e podem produzir resultados inesperados com conjuntos de caracteres multibytes. Além disso, esses operadores comparam caracteres por seus valores de byte e caracteres acentuados podem não ser considerados iguais, mesmo que uma determinada ordenação os trate como iguais.

#### Sintaxe de Expressões Regulares

Uma expressão regular descreve um conjunto de cadeias de caracteres. A expressão regular mais simples é aquela que não contém caracteres especiais. Por exemplo, a expressão regular `hello` corresponde a `hello` e nada mais.

Expressões regulares não triviais usam certas construções especiais para que possam corresponder a mais de uma string. Por exemplo, a expressão regular `hello|world` contém o operador de alternância `|` e corresponde ao `hello` ou ao `world`.

Como exemplo mais complexo, a expressão regular `B[an]*s` corresponde a qualquer uma das cadeias `Bananas`, `Baaaaas`, `Bs` e qualquer outra cadeia que comece com um `B`, termine com um `s` e contenha qualquer número de caracteres `a` ou `n` entre eles.

Uma expressão regular para o operador `REGEXP` pode usar qualquer um dos seguintes caracteres e construções especiais:

- `^`

  Conjuntar o início de uma string.

  ```sql
  mysql> SELECT 'fo\nfo' REGEXP '^fo$';                   -> 0
  mysql> SELECT 'fofo' REGEXP '^fo';                      -> 1
  ```

- `$`

  Conecte as extremidades de uma corda.

  ```sql
  mysql> SELECT 'fo\no' REGEXP '^fo\no$';                 -> 1
  mysql> SELECT 'fo\no' REGEXP '^fo$';                    -> 0
  ```

- `.`

  Corresponda a qualquer caractere (incluindo retorno de carro e nova linha).

  ```sql
  mysql> SELECT 'fofo' REGEXP '^f.*$';                    -> 1
  mysql> SELECT 'fo\r\nfo' REGEXP '^f.*$';                -> 1
  ```

- `a*`

  Conforme qualquer sequência de zero ou mais caracteres `a`.

  ```sql
  mysql> SELECT 'Ban' REGEXP '^Ba*n';                     -> 1
  mysql> SELECT 'Baaan' REGEXP '^Ba*n';                   -> 1
  mysql> SELECT 'Bn' REGEXP '^Ba*n';                      -> 1
  ```

- `a+`

  Conjuntamente com qualquer sequência de um ou mais caracteres `a`.

  ```sql
  mysql> SELECT 'Ban' REGEXP '^Ba+n';                     -> 1
  mysql> SELECT 'Bn' REGEXP '^Ba+n';                      -> 0
  ```

- `a?`

  Corresponda a zero ou um caractere `a`.

  ```sql
  mysql> SELECT 'Bn' REGEXP '^Ba?n';                      -> 1
  mysql> SELECT 'Ban' REGEXP '^Ba?n';                     -> 1
  mysql> SELECT 'Baan' REGEXP '^Ba?n';                    -> 0
  ```

- `de|abc`

  Alternância; corresponda a qualquer uma das sequências `de` ou `abc`.

  ```sql
  mysql> SELECT 'pi' REGEXP 'pi|apa';                     -> 1
  mysql> SELECT 'axe' REGEXP 'pi|apa';                    -> 0
  mysql> SELECT 'apa' REGEXP 'pi|apa';                    -> 1
  mysql> SELECT 'apa' REGEXP '^(pi|apa)$';                -> 1
  mysql> SELECT 'pi' REGEXP '^(pi|apa)$';                 -> 1
  mysql> SELECT 'pix' REGEXP '^(pi|apa)$';                -> 0
  ```

- `(abc)*`

  Corresponda a zero ou mais instâncias da sequência `abc`.

  ```sql
  mysql> SELECT 'pi' REGEXP '^(pi)*$';                    -> 1
  mysql> SELECT 'pip' REGEXP '^(pi)*$';                   -> 0
  mysql> SELECT 'pipi' REGEXP '^(pi)*$';                  -> 1
  ```

- `{1}`, `{2,3}`

  Repetição; a notação `{n}` e `{m,n}` oferece uma maneira mais geral de escrever expressões regulares que correspondem a muitas ocorrências do átomo anterior (ou “pedaço”) do padrão. *`m`* e *`n`* são inteiros.

  - `a*`

    Pode ser escrito como `a{0,}`.

  - `a+`

    Pode ser escrito como `a{1,}`.

  - `a?`

    Pode ser escrito como `a{0,1}`.

  Para ser mais preciso, `a{n}` corresponde exatamente a *`n`* instâncias de `a`. `a{n,}` corresponde a *`n`* ou mais instâncias de `a`. `a{m,n}` corresponde a *`m`* até *`n`* instâncias de `a`, inclusive. Se ambos *`m`* e *`n`* forem fornecidos, *`m`* deve ser menor ou igual a *`n`*.

  - `m` \* e \* `n` \* devem estar no intervalo de `0` a `RE_DUP_MAX` (padrão 255), inclusive.

  ```sql
  mysql> SELECT 'abcde' REGEXP 'a[bcd]{2}e';              -> 0
  mysql> SELECT 'abcde' REGEXP 'a[bcd]{3}e';              -> 1
  mysql> SELECT 'abcde' REGEXP 'a[bcd]{1,10}e';           -> 1
  ```

- `[a-dX]`, `[^a-dX]`

  Converte qualquer caractere que seja (ou não seja, se `^` for usado) `a`, `b`, `c`, `d` ou `X`. Um caractere `-` entre dois outros caracteres forma uma faixa que corresponde a todos os caracteres do primeiro caractere ao segundo. Por exemplo, `[0-9]` corresponde a qualquer dígito decimal. Para incluir um caractere literal `]` literal, ele deve seguir imediatamente o parêntese de abertura `[`. Para incluir um caractere literal `-`, ele deve ser escrito primeiro ou último. Qualquer caractere que não tenha um significado especial definido dentro de um par `[]` corresponde apenas a si mesmo.

  ```sql
  mysql> SELECT 'aXbc' REGEXP '[a-dXYZ]';                 -> 1
  mysql> SELECT 'aXbc' REGEXP '^[a-dXYZ]$';               -> 0
  mysql> SELECT 'aXbc' REGEXP '^[a-dXYZ]+$';              -> 1
  mysql> SELECT 'aXbc' REGEXP '^[^a-dXYZ]+$';             -> 0
  mysql> SELECT 'gheis' REGEXP '^[^a-dXYZ]+$';            -> 1
  mysql> SELECT 'gheisa' REGEXP '^[^a-dXYZ]+$';           -> 0
  ```

- `[.caracteres.]`

  Dentro de uma expressão entre colchetes (escrita usando `[` e `]`), corresponde à sequência de caracteres desse elemento de comparação. `characters` é um único caractere ou um nome de caractere como `newline`. A tabela a seguir lista os nomes de caracteres permitidos.

  A tabela a seguir mostra os nomes de caracteres permitidos e os caracteres que eles correspondem. Para caracteres fornecidos como valores numéricos, os valores são representados em octal.

  <table summary="Nomes de caracteres permitidos e caracteres que correspondem a eles. Para economizar espaço, a combinação da coluna Nome e Caractere é apresentada em um formato de tabela de quatro colunas, na seguinte ordem: Nome, Caractere, Nome, Caractere. Para caracteres fornecidos como valores numéricos, os valores são representados em octal."><col style="width: 25%"/><col style="width: 25%"/><col style="width: 25%"/><col style="width: 25%"/><thead><tr> <th>Nome</th> <th>Personagem</th> <th>Nome</th> <th>Personagem</th> </tr></thead><tbody><tr> <th>[[PH_HTML_CODE_<code>apostrophe</code>]</th> <td>[[PH_HTML_CODE_<code>apostrophe</code>]</td> <td>[[PH_HTML_CODE_<code>left-parenthesis</code>]</td> <td>[[PH_HTML_CODE_<code>'('</code>]</td> </tr><tr> <th>[[PH_HTML_CODE_<code>right-parenthesis</code>]</th> <td>[[PH_HTML_CODE_<code>')'</code>]</td> <td>[[PH_HTML_CODE_<code>asterisk</code>]</td> <td>[[PH_HTML_CODE_<code>'*'</code>]</td> </tr><tr> <th>[[PH_HTML_CODE_<code>plus-sign</code>]</th> <td>[[PH_HTML_CODE_<code>'+'</code>]</td> <td>[[<code>0</code><code>apostrophe</code>]</td> <td>[[<code>0</code><code>apostrophe</code>]</td> </tr><tr> <th>[[<code>0</code><code>left-parenthesis</code>]</th> <td>[[<code>0</code><code>'('</code>]</td> <td>[[<code>0</code><code>right-parenthesis</code>]</td> <td>[[<code>0</code><code>')'</code>]</td> </tr><tr> <th>[[<code>0</code><code>asterisk</code>]</th> <td>[[<code>0</code><code>'*'</code>]</td> <td>[[<code>0</code><code>plus-sign</code>]</td> <td>[[<code>0</code><code>'+'</code>]</td> </tr><tr> <th>[[<code>SOH</code><code>apostrophe</code>]</th> <td>[[<code>SOH</code><code>apostrophe</code>]</td> <td>[[<code>SOH</code><code>left-parenthesis</code>]</td> <td>[[<code>SOH</code><code>'('</code>]</td> </tr><tr> <th>[[<code>SOH</code><code>right-parenthesis</code>]</th> <td>[[<code>SOH</code><code>')'</code>]</td> <td>[[<code>SOH</code><code>asterisk</code>]</td> <td>[[<code>SOH</code><code>'*'</code>]</td> </tr><tr> <th>[[<code>SOH</code><code>plus-sign</code>]</th> <td>[[<code>SOH</code><code>'+'</code>]</td> <td>[[<code>001</code><code>apostrophe</code>]</td> <td>[[<code>001</code><code>apostrophe</code>]</td> </tr><tr> <th>[[<code>001</code><code>left-parenthesis</code>]</th> <td>[[<code>001</code><code>'('</code>]</td> <td>[[<code>001</code><code>right-parenthesis</code>]</td> <td>[[<code>001</code><code>')'</code>]</td> </tr><tr> <th>[[<code>001</code><code>asterisk</code>]</th> <td>[[<code>001</code><code>'*'</code>]</td> <td>[[<code>001</code><code>plus-sign</code>]</td> <td>[[<code>001</code><code>'+'</code>]</td> </tr><tr> <th>[[<code>STX</code><code>apostrophe</code>]</th> <td>[[<code>STX</code><code>apostrophe</code>]</td> <td>[[<code>STX</code><code>left-parenthesis</code>]</td> <td>[[<code>STX</code><code>'('</code>]</td> </tr><tr> <th>[[<code>STX</code><code>right-parenthesis</code>]</th> <td>[[<code>STX</code><code>')'</code>]</td> <td>[[<code>STX</code><code>asterisk</code>]</td> <td>[[<code>STX</code><code>'*'</code>]</td> </tr><tr> <th>[[<code>STX</code><code>plus-sign</code>]</th> <td>[[<code>STX</code><code>'+'</code>]</td> <td>[[<code>002</code><code>apostrophe</code>]</td> <td>[[<code>002</code><code>apostrophe</code>]</td> </tr><tr> <th>[[<code>002</code><code>left-parenthesis</code>]</th> <td>[[<code>002</code><code>'('</code>]</td> <td>[[<code>002</code><code>right-parenthesis</code>]</td> <td>[[<code>002</code><code>')'</code>]</td> </tr><tr> <th>[[<code>002</code><code>asterisk</code>]</th> <td>[[<code>002</code><code>'*'</code>]</td> <td>[[<code>002</code><code>plus-sign</code>]</td> <td>[[<code>002</code><code>'+'</code>]</td> </tr><tr> <th>[[<code>ETX</code><code>apostrophe</code>]</th> <td>[[<code>ETX</code><code>apostrophe</code>]</td> <td>[[<code>ETX</code><code>left-parenthesis</code>]</td> <td>[[<code>ETX</code><code>'('</code>]</td> </tr><tr> <th>[[<code>ETX</code><code>right-parenthesis</code>]</th> <td>[[<code>ETX</code><code>')'</code>]</td> <td>[[<code>ETX</code><code>asterisk</code>]</td> <td>[[<code>ETX</code><code>'*'</code>]</td> </tr><tr> <th>[[<code>ETX</code><code>plus-sign</code>]</th> <td>[[<code>ETX</code><code>'+'</code>]</td> <td>[[<code>003</code><code>apostrophe</code>]</td> <td>[[<code>003</code><code>apostrophe</code>]</td> </tr><tr> <th>[[<code>003</code><code>left-parenthesis</code>]</th> <td>[[<code>003</code><code>'('</code>]</td> <td>[[<code>003</code><code>right-parenthesis</code>]</td> <td>[[<code>003</code><code>')'</code>]</td> </tr><tr> <th>[[<code>003</code><code>asterisk</code>]</th> <td>[[<code>003</code><code>'*'</code>]</td> <td>[[<code>003</code><code>plus-sign</code>]</td> <td>[[<code>003</code><code>'+'</code>]</td> </tr><tr> <th>[[<code>EOT</code><code>apostrophe</code>]</th> <td>[[<code>EOT</code><code>apostrophe</code>]</td> <td>[[<code>EOT</code><code>left-parenthesis</code>]</td> <td>[[<code>EOT</code><code>'('</code>]</td> </tr><tr> <th>[[<code>EOT</code><code>right-parenthesis</code>]</th> <td>[[<code>EOT</code><code>')'</code>]</td> <td>[[<code>EOT</code><code>asterisk</code>]</td> <td>[[<code>EOT</code><code>'*'</code>]</td> </tr><tr> <th>[[<code>EOT</code><code>plus-sign</code>]</th> <td>[[<code>EOT</code><code>'+'</code>]</td> <td>[[<code>004</code><code>apostrophe</code>]</td> <td>[[<code>004</code><code>apostrophe</code>]</td> </tr><tr> <th>[[<code>004</code><code>left-parenthesis</code>]</th> <td>[[<code>004</code><code>'('</code>]</td> <td>[[<code>004</code><code>right-parenthesis</code>]</td> <td>[[<code>004</code><code>')'</code>]</td> </tr><tr> <th>[[<code>004</code><code>asterisk</code>]</th> <td>[[<code>004</code><code>'*'</code>]</td> <td>[[<code>004</code><code>plus-sign</code>]</td> <td>[[<code>004</code><code>'+'</code>]</td> </tr><tr> <th>[[<code>apostrophe</code>]]</th> <td>[[<code>ENQ</code><code>apostrophe</code>]</td> <td>[[<code>left-parenthesis</code>]]</td> <td>[[<code>'('</code>]]</td> </tr><tr> <th>[[<code>right-parenthesis</code>]]</th> <td>[[<code>')'</code>]]</td> <td>[[<code>asterisk</code>]]</td> <td>[[<code>'*'</code>]]</td> </tr><tr> <th>[[<code>plus-sign</code>]]</th> <td>[[<code>'+'</code>]]</td> <td>[[<code>005</code><code>apostrophe</code>]</td> <td>[[<code>005</code><code>apostrophe</code>]</td> </tr><tr> <th>[[<code>005</code><code>left-parenthesis</code>]</th> <td>[[<code>005</code><code>'('</code>]</td> <td>[[<code>005</code><code>right-parenthesis</code>]</td> <td>[[<code>005</code><code>')'</code>]</td> </tr><tr> <th>[[<code>005</code><code>asterisk</code>]</th> <td>[[<code>005</code><code>'*'</code>]</td> <td>[[<code>005</code><code>plus-sign</code>]</td> <td>[[<code>005</code><code>'+'</code>]</td> </tr><tr> <th>[[<code>ACK</code><code>apostrophe</code>]</th> <td>[[<code>ACK</code><code>apostrophe</code>]</td> <td>[[<code>ACK</code><code>left-parenthesis</code>]</td> <td>[[<code>ACK</code><code>'('</code>]</td> </tr><tr> <th>[[<code>ACK</code><code>right-parenthesis</code>]</th> <td>[[<code>ACK</code><code>')'</code>]</td> <td>[[<code>ACK</code><code>asterisk</code>]</td> <td>[[<code>ACK</code><code>'*'</code>]</td> </tr><tr> <th>[[<code>ACK</code><code>plus-sign</code>]</th> <td>[[<code>ACK</code><code>'+'</code>]</td> <td>[[<code>006</code><code>apostrophe</code>]</td> <td>[[<code>006</code><code>apostrophe</code>]</td> </tr><tr> <th>[[<code>006</code><code>left-parenthesis</code>]</th> <td>[[<code>006</code><code>'('</code>]</td> <td>[[<code>006</code><code>right-parenthesis</code>]</td> <td>[[<code>006</code><code>')'</code>]</td> </tr><tr> <th>[[<code>006</code><code>asterisk</code>]</th> <td>[[<code>006</code><code>'*'</code>]</td> <td>[[<code>006</code><code>plus-sign</code>]</td> <td>[[<code>006</code><code>'+'</code>]</td> </tr><tr> <th>[[<code>BEL</code><code>apostrophe</code>]</th> <td>[[<code>BEL</code><code>apostrophe</code>]</td> <td>[[<code>BEL</code><code>left-parenthesis</code>]</td> <td>[[<code>BEL</code><code>'('</code>]</td> </tr><tr> <th>[[<code>BEL</code><code>right-parenthesis</code>]</th> <td>[[<code>BEL</code><code>')'</code>]</td> <td>[[<code>BEL</code><code>asterisk</code>]</td> <td>[[<code>BEL</code><code>'*'</code>]</td> </tr><tr> <th>[[<code>BEL</code><code>plus-sign</code>]</th> <td>[[<code>BEL</code><code>'+'</code>]</td> <td>[[<code>007</code><code>apostrophe</code>]</td> <td>[[<code>007</code><code>apostrophe</code>]</td> </tr><tr> <th>[[<code>007</code><code>left-parenthesis</code>]</th> <td>[[<code>007</code><code>'('</code>]</td> <td>[[<code>007</code><code>right-parenthesis</code>]</td> <td>[[<code>007</code><code>')'</code>]</td> </tr><tr> <th>[[<code>007</code><code>asterisk</code>]</th> <td>[[<code>007</code><code>'*'</code>]</td> <td>[[<code>007</code><code>plus-sign</code>]</td> <td>[[<code>007</code><code>'+'</code>]</td> </tr><tr> <th>[[<code>alert</code><code>apostrophe</code>]</th> <td>[[<code>alert</code><code>apostrophe</code>]</td> <td>[[<code>alert</code><code>left-parenthesis</code>]</td> <td>[[<code>alert</code><code>'('</code>]</td> </tr><tr> <th>[[<code>alert</code><code>right-parenthesis</code>]</th> <td>[[<code>alert</code><code>')'</code>]</td> <td>[[<code>alert</code><code>asterisk</code>]</td> <td>[[<code>alert</code><code>'*'</code>]</td> </tr><tr> <th>[[<code>alert</code><code>plus-sign</code>]</th> <td>[[<code>alert</code><code>'+'</code>]</td> <td>[[<code>007</code><code>apostrophe</code>]</td> <td>[[<code>007</code><code>apostrophe</code>]</td> </tr><tr> <th>[[<code>007</code><code>left-parenthesis</code>]</th> <td>[[<code>007</code><code>'('</code>]</td> <td>[[<code>007</code><code>right-parenthesis</code>]</td> <td>[[<code>007</code><code>')'</code>]</td> </tr><tr> <th>[[<code>007</code><code>asterisk</code>]</th> <td>[[<code>007</code><code>'*'</code>]</td> <td>[[<code>007</code><code>plus-sign</code>]</td> <td>[[<code>007</code><code>'+'</code>]</td> </tr><tr> <th>[[<code>BS</code><code>apostrophe</code>]</th> <td>[[<code>BS</code><code>apostrophe</code>]</td> <td>[[<code>BS</code><code>left-parenthesis</code>]</td> <td>[[<code>BS</code><code>'('</code>]</td> </tr><tr> <th>[[<code>BS</code><code>right-parenthesis</code>]</th> <td>[[<code>BS</code><code>')'</code>]</td> <td>[[<code>BS</code><code>asterisk</code>]</td> <td>[[<code>BS</code><code>'*'</code>]</td> </tr><tr> <th>[[<code>BS</code><code>plus-sign</code>]</th> <td>[[<code>BS</code><code>'+'</code>]</td> <td></td> <td></td> </tr></tbody></table>

  ```sql
  mysql> SELECT '~' REGEXP '[[.~.]]';                     -> 1
  mysql> SELECT '~' REGEXP '[[.tilde.]]';                 -> 1
  ```

- `[=classe_de_personagem=]`

  Dentro de uma expressão de conjunto (escrita usando `[` e `]`), `[=character_class=]` representa uma classe de equivalência. Ela corresponde a todos os caracteres com o mesmo valor de ordenação, incluindo o próprio caractere. Por exemplo, se `o` e `(+)` são os membros de uma classe de equivalência, `[[=o=]]`, `[[=(+)=]]` e `[o(+)]` são todos sinônimos. Uma classe de equivalência não pode ser usada como um ponto final de uma faixa.

- `[:classe_caracteres:]`

  Dentro de uma expressão entre colchetes (escrita usando `[` e `]`), `[:character_class:]` representa uma classe de caracteres que corresponde a todos os caracteres pertencentes a essa classe. A tabela a seguir lista os nomes padrão das classes. Esses nomes representam as classes de caracteres definidas na página do manual `ctype(3)`. Um determinado local pode fornecer outros nomes de classes. Uma classe de caracteres não pode ser usada como um ponto final de uma faixa.

  <table summary="Nomes das classes de personagens e o significado de cada classe."><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Nome da Classe de Personagem</th> <th>Significado</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CODE_<code>upper</code>]</td> <td>Caracteres alfanuméricos</td> </tr><tr> <td>[[PH_HTML_CODE_<code>upper</code>]</td> <td>Caracteres alfabéticos</td> </tr><tr> <td>[[<code>blank</code>]]</td> <td>Caracteres de espaço em branco</td> </tr><tr> <td>[[<code>cntrl</code>]]</td> <td>Caracteres de controle</td> </tr><tr> <td>[[<code>digit</code>]]</td> <td>Caracteres digitais</td> </tr><tr> <td>[[<code>graph</code>]]</td> <td>Personagens gráficos</td> </tr><tr> <td>[[<code>lower</code>]]</td> <td>Letras minúsculas</td> </tr><tr> <td>[[<code>print</code>]]</td> <td>Caracteres gráficos ou espaciais</td> </tr><tr> <td>[[<code>punct</code>]]</td> <td>Caracteres de pontuação</td> </tr><tr> <td>[[<code>space</code>]]</td> <td>Espaço, tabulação, nova linha e retorno de carroceria</td> </tr><tr> <td>[[<code>upper</code>]]</td> <td>Letras maiúsculas</td> </tr><tr> <td>[[<code>alpha</code><code>upper</code>]</td> <td>Caracteres de dígitos hexadecimais</td> </tr></tbody></table>

  ```sql
  mysql> SELECT 'justalnums' REGEXP '[[:alnum:]]+';       -> 1
  mysql> SELECT '!!' REGEXP '[[:alnum:]]+';               -> 0
  ```

- `[[:<:]]`, `[[:>:]]`

  Esses marcadores representam os limites das palavras. Eles correspondem ao início e ao fim das palavras, respectivamente. Uma palavra é uma sequência de caracteres de palavra que não é precedida ou seguida por caracteres de palavra. Um caractere de palavra é um caractere alfanumérico da classe `alnum` ou um sublinhado (`_`).

  ```sql
  mysql> SELECT 'a word a' REGEXP '[[:<:]]word[[:>:]]';   -> 1
  mysql> SELECT 'a xword a' REGEXP '[[:<:]]word[[:>:]]';  -> 0
  ```

Para usar uma instância literal de um caractere especial em uma expressão regular, anteceda-o com dois caracteres barra invertida (\\). O analisador do MySQL interpreta um dos barra invertidas, e a biblioteca de expressões regulares interpreta o outro. Por exemplo, para corresponder à string `1+2` que contém o caractere especial `+`, apenas a seguinte expressão regular é a correta:

```sql
mysql> SELECT '1+2' REGEXP '1+2';                       -> 0
mysql> SELECT '1+2' REGEXP '1\+2';                      -> 0
mysql> SELECT '1+2' REGEXP '1\\+2';                     -> 1
```
