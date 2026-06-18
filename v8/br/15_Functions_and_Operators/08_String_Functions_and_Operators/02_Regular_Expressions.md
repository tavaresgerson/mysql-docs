### 14.8.2 Expressões Regulares

**Tabela 14.14 Funções e operadores de expressão regular**

<table summary="Uma referência que lista funções e operadores de expressão regular."><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td>[[<code>NOT REGEXP</code>]]</td> <td>Negação de REGEXP</td> </tr><tr><td>[[<code>REGEXP</code>]]</td> <td>Se a cadeia corresponde à expressão regular</td> </tr><tr><td>[[<code>REGEXP_INSTR()</code>]]</td> <td>Índice inicial de correspondência de subcadeia com expressão regular</td> </tr><tr><td>[[<code>REGEXP_LIKE()</code>]]</td> <td>Se a cadeia corresponde à expressão regular</td> </tr><tr><td>[[<code>REGEXP_REPLACE()</code>]]</td> <td>Substitua substrings que correspondem à expressão regular</td> </tr><tr><td>[[<code>REGEXP_SUBSTR()</code>]]</td> <td>Retorne a substring que corresponda à expressão regular</td> </tr><tr><td>[[<code>RLIKE</code>]]</td> <td>Se a cadeia corresponde à expressão regular</td> </tr></tbody></table>

Uma expressão regular é uma maneira poderosa de especificar um padrão para uma busca complexa. Esta seção discute as funções e operadores disponíveis para a correspondência com expressões regulares e ilustra, com exemplos, alguns dos caracteres especiais e construções que podem ser usados para operações com expressões regulares. Veja também a Seção 5.3.4.7, “Correspondência de Padrões”.

O MySQL implementa suporte a expressões regulares usando os Componentes Internacionais para Unicode (ICU), que oferece suporte completo ao Unicode e é seguro para multibyte. (Antes do MySQL 8.0.4, o MySQL usava a implementação de expressões regulares de Henry Spencer, que opera de forma byte a byte e não é segura para multibyte. Para informações sobre como as aplicações que usam expressões regulares podem ser afetadas pela mudança de implementação, consulte Considerações sobre a Compatibilidade com Expressões Regulares.)

Antes do MySQL 8.0.22, era possível usar argumentos de string binária com essas funções, mas eles produziam resultados inconsistentes. No MySQL 8.0.22 e versões posteriores, o uso de uma string binária com qualquer uma das funções de expressão regular do MySQL é rejeitado com `ER_CHARACTER_SET_MISMATCH`.

- Funções e descrições dos operadores de expressão regular
- Sintaxe de Expressões Regulares
- Controle de Recursos de Expressões Regulares
- Considerações sobre a compatibilidade com expressões regulares

#### Funções e descrições dos operadores de expressão regular

- `expr NOT REGEXP pat`, `expr NOT RLIKE pat`

  Isto é o mesmo que `NOT (expr REGEXP pat)`.

- `expr REGEXP pat`, `expr RLIKE pat`

  Retorna 1 se a string `expr` corresponder à expressão regular especificada pelo padrão `pat`, caso contrário, retorna 0. Se `expr` ou `pat` for `NULL`, o valor de retorno é `NULL`.

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

- `REGEXP_INSTR(expr, pat[, pos[, occurrence[, return_option[, match_type]]]])`

  Retorna o índice inicial da subcadeia da string `expr` que corresponde à expressão regular especificada pelo padrão `pat`, 0 se não houver correspondência. Se `expr` ou `pat` for `NULL`, o valor de retorno é `NULL`. Os índices de caracteres começam em 1.

  `REGEXP_INSTR()` aceita esses argumentos opcionais:

  - `pos`: A posição em `expr` onde a busca deve começar. Se omitida, o padrão é 1.

  - `occurrence`: Qual ocorrência de uma correspondência para pesquisar. Se omitido, o padrão é 1.

  - `return_option`: Que tipo de posição retornar. Se este valor for 0, `REGEXP_INSTR()` retorna a posição do primeiro caractere da substring correspondente. Se este valor for 1, `REGEXP_INSTR()` retorna a posição após a substring correspondente. Se omitido, o padrão é 0.

  - `match_type`: Uma string que especifica como realizar a correspondência. O significado é o descrito para `REGEXP_LIKE()`.

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

- `REGEXP_LIKE(expr, pat[, match_type])`

  Retorna 1 se a string `expr` corresponder à expressão regular especificada pelo padrão `pat`, caso contrário, retorna 0. Se `expr` ou `pat` for `NULL`, o valor de retorno é `NULL`.

  O padrão pode ser uma expressão regular estendida, cuja sintaxe é discutida na Sintaxe de Expressões Regulares. O padrão não precisa ser uma string literal. Por exemplo, ele pode ser especificado como uma expressão de string ou coluna de tabela.

  O argumento opcional `match_type` é uma string que pode conter qualquer ou todos os seguintes caracteres, especificando como realizar a correspondência:

  - `c`: Correspondência sensível a maiúsculas e minúsculas.

  - `i`: Correspondência não sensível a maiúsculas e minúsculas.

  - `m`: Modo de múltiplas linhas. Reconheça os terminadores de linha dentro da string. O comportamento padrão é corresponder aos terminadores de linha apenas no início e no final da expressão da string.

  - `n`: O caractere `.` corresponde a terminadores de linha. O padrão é que o `.` corresponda para parar no final de uma linha.

  - `u`: Finalizações de linha apenas para Unix. Apenas o caractere de nova linha é reconhecido como finalização de linha pelos operadores de correspondência `.`, `^` e `$`.

  Se os caracteres que especificam opções contraditórias forem especificados dentro de `match_type`, o último deles terá precedência.

  Por padrão, as operações de expressão regular usam o conjunto de caracteres e a ordenação dos argumentos `expr` e `pat` ao decidir o tipo de um caractere e realizar a comparação. Se os argumentos tiverem conjuntos de caracteres ou ordenações diferentes, as regras de coercibilidade se aplicam conforme descrito na Seção 12.8.4, “Coercibilidade de Ordenação em Expressões”. Os argumentos podem ser especificados com indicadores de ordenação explícitos para alterar o comportamento da comparação.

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

  `match_type` pode ser especificado com os caracteres `c` ou `i` para ignorar a sensibilidade à maiúscula ou minúscula padrão. Exceção: Se qualquer um dos argumentos for uma string binária, os argumentos são tratados de forma sensível à maiúscula ou minúscula como strings binárias, mesmo que `match_type` contenha o caractere `i`.

  Nota

  O MySQL usa a sintaxe de escape C em strings (por exemplo, `\n` para representar o caractere de nova linha). Se você deseja que o argumento `expr` ou `pat` contenha um literal `\`, você deve duplicá-lo. (A menos que o modo SQL `NO_BACKSLASH_ESCAPES` esteja habilitado, caso em que nenhum caractere de escape é usado.)

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

- `REGEXP_REPLACE(expr, pat, repl[, pos[, occurrence[, match_type]]])`

  Substitui as ocorrências na string `expr` que correspondem à expressão regular especificada pelo padrão `pat` pela string de substituição `repl`, e retorna a string resultante. Se `expr`, `pat` ou `repl` for `NULL`, o valor de retorno é `NULL`.

  `REGEXP_REPLACE()` aceita esses argumentos opcionais:

  - `pos`: A posição em `expr` onde a busca deve começar. Se omitida, o padrão é 1.

  - `occurrence`: Qual ocorrência de uma correspondência para substituir. Se omitido, o padrão é 0 (o que significa "substituir todas as ocorrências").

  - `match_type`: Uma string que especifica como realizar a correspondência. O significado é o descrito para `REGEXP_LIKE()`.

  Antes do MySQL 8.0.17, o resultado retornado por essa função usava o conjunto de caracteres `UTF-16`; no MySQL 8.0.17 e versões posteriores, o conjunto de caracteres e a collation da expressão pesquisada são usados. (Bug #94203, Bug #29308212)

  Para obter informações adicionais sobre como ocorre a correspondência, consulte a descrição para `REGEXP_LIKE()`.

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

- `REGEXP_SUBSTR(expr, pat[, pos[, occurrence[, match_type]]])`

  Retorna a subcadeia da string `expr` que corresponde à expressão regular especificada pelo padrão `pat`, `NULL` se não houver correspondência. Se `expr` ou `pat` for `NULL`, o valor de retorno é `NULL`.

  `REGEXP_SUBSTR()` aceita esses argumentos opcionais:

  - `pos`: A posição em `expr` onde a busca deve começar. Se omitida, o padrão é 1.

  - `occurrence`: Qual ocorrência de uma correspondência para pesquisar. Se omitido, o padrão é 1.

  - `match_type`: Uma string que especifica como realizar a correspondência. O significado é o descrito para `REGEXP_LIKE()`.

  Antes do MySQL 8.0.17, o resultado retornado por essa função usava o conjunto de caracteres `UTF-16`; no MySQL 8.0.17 e versões posteriores, o conjunto de caracteres e a collation da expressão pesquisada são usados. (Bug #94203, Bug #29308212)

  Para obter informações adicionais sobre como ocorre a correspondência, consulte a descrição para `REGEXP_LIKE()`.

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

#### Sintaxe de Expressões Regulares

Uma expressão regular descreve um conjunto de cadeias de caracteres. A expressão regular mais simples é aquela que não contém caracteres especiais. Por exemplo, a expressão regular `hello` corresponde a `hello` e nada mais.

Expressões regulares não triviais usam certas construções especiais para que possam corresponder a mais de uma string. Por exemplo, a expressão regular `hello|world` contém o operador de alternância `|` e corresponde ao `hello` ou `world`.

Como exemplo mais complexo, a expressão regular `B[an]*s` corresponde a qualquer uma das cadeias `Bananas`, `Baaaaas`, `Bs` e qualquer outra cadeia que comece com `B`, termine com `s` e contenha qualquer número de caracteres `a` ou `n` entre eles.

A lista a seguir abrange alguns dos caracteres especiais básicos e construções que podem ser usados em expressões regulares. Para obter informações sobre a sintaxe completa de expressões regulares suportada pela biblioteca ICU usada para implementar suporte a expressões regulares, visite o site International Components for Unicode.

- `^`

  Conjuntar o início de uma string.

  ```
  mysql> SELECT REGEXP_LIKE('fo\nfo', '^fo$');                   -> 0
  mysql> SELECT REGEXP_LIKE('fofo', '^fo');                      -> 1
  ```

- `$`

  Conecte as extremidades de uma corda.

  ```
  mysql> SELECT REGEXP_LIKE('fo\no', '^fo\no$');                 -> 1
  mysql> SELECT REGEXP_LIKE('fo\no', '^fo$');                    -> 0
  ```

- `.`

  Conforme qualquer caractere (incluindo retorno de carro e nova linha, embora para corresponder a esses caracteres no meio de uma string, o caractere de controle de correspondência `m` (multilinha) ou o modificador `(?m)` dentro do padrão deve ser fornecido).

  ```
  mysql> SELECT REGEXP_LIKE('fofo', '^f.*$');                    -> 1
  mysql> SELECT REGEXP_LIKE('fo\r\nfo', '^f.*$');                -> 0
  mysql> SELECT REGEXP_LIKE('fo\r\nfo', '^f.*$', 'm');           -> 1
  mysql> SELECT REGEXP_LIKE('fo\r\nfo', '(?m)^f.*$');           -> 1
  ```

- `a*`

  Conforme qualquer sequência de zero ou mais caracteres `a`.

  ```
  mysql> SELECT REGEXP_LIKE('Ban', '^Ba*n');                     -> 1
  mysql> SELECT REGEXP_LIKE('Baaan', '^Ba*n');                   -> 1
  mysql> SELECT REGEXP_LIKE('Bn', '^Ba*n');                      -> 1
  ```

- `a+`

  Conforme qualquer sequência de um ou mais caracteres `a`.

  ```
  mysql> SELECT REGEXP_LIKE('Ban', '^Ba+n');                     -> 1
  mysql> SELECT REGEXP_LIKE('Bn', '^Ba+n');                      -> 0
  ```

- `a?`

  Conforme `a` um ou zero caracteres.

  ```
  mysql> SELECT REGEXP_LIKE('Bn', '^Ba?n');                      -> 1
  mysql> SELECT REGEXP_LIKE('Ban', '^Ba?n');                     -> 1
  mysql> SELECT REGEXP_LIKE('Baan', '^Ba?n');                    -> 0
  ```

- `de|abc`

  Alternância; corresponda a qualquer uma das sequências `de` ou `abc`.

  ```
  mysql> SELECT REGEXP_LIKE('pi', 'pi|apa');                     -> 1
  mysql> SELECT REGEXP_LIKE('axe', 'pi|apa');                    -> 0
  mysql> SELECT REGEXP_LIKE('apa', 'pi|apa');                    -> 1
  mysql> SELECT REGEXP_LIKE('apa', '^(pi|apa)$');                -> 1
  mysql> SELECT REGEXP_LIKE('pi', '^(pi|apa)$');                 -> 1
  mysql> SELECT REGEXP_LIKE('pix', '^(pi|apa)$');                -> 0
  ```

- `(abc)*`

  Corresponda a zero ou mais instâncias da sequência `abc`.

  ```
  mysql> SELECT REGEXP_LIKE('pi', '^(pi)*$');                    -> 1
  mysql> SELECT REGEXP_LIKE('pip', '^(pi)*$');                   -> 0
  mysql> SELECT REGEXP_LIKE('pipi', '^(pi)*$');                  -> 1
  ```

- `{1}`, `{2,3}`

  Repetição; as notações `{n}` e `{m,n}` fornecem uma maneira mais geral de escrever expressões regulares que correspondem a muitas ocorrências do átomo anterior (ou “pedaço”) do padrão. `m` e `n` são inteiros.

  - `a*`

    Pode ser escrito como `a{0,}`.

  - `a+`

    Pode ser escrito como `a{1,}`.

  - `a?`

    Pode ser escrito como `a{0,1}`.

  Para ser mais preciso, `a{n}` corresponde exatamente a `n` instâncias de `a`. `a{n,}` corresponde a `n` ou mais instâncias de `a`. `a{m,n}` corresponde a `m` até `n` instâncias de `a`, inclusive. Se ambos `m` e `n` forem fornecidos, `m` deve ser menor ou igual a `n`.

  ```
  mysql> SELECT REGEXP_LIKE('abcde', 'a[bcd]{2}e');              -> 0
  mysql> SELECT REGEXP_LIKE('abcde', 'a[bcd]{3}e');              -> 1
  mysql> SELECT REGEXP_LIKE('abcde', 'a[bcd]{1,10}e');           -> 1
  ```

- `[a-dX]`, `[^a-dX]`

  Converte qualquer caractere que seja (ou não seja, se `^` for usado) `a`, `b`, `c`, `d` ou `X`. Um caractere `-` entre dois outros caracteres forma uma faixa que corresponde a todos os caracteres do primeiro ao segundo. Por exemplo, `[0-9]` corresponde a qualquer dígito decimal. Para incluir um caractere literal `]`, ele deve seguir imediatamente o parêntese de abertura `[`. Para incluir um caractere literal `-`, ele deve ser escrito primeiro ou último. Qualquer caractere que não tenha um significado especial definido dentro de um par `[]` corresponde apenas a si mesmo.

  ```
  mysql> SELECT REGEXP_LIKE('aXbc', '[a-dXYZ]');                 -> 1
  mysql> SELECT REGEXP_LIKE('aXbc', '^[a-dXYZ]$');               -> 0
  mysql> SELECT REGEXP_LIKE('aXbc', '^[a-dXYZ]+$');              -> 1
  mysql> SELECT REGEXP_LIKE('aXbc', '^[^a-dXYZ]+$');             -> 0
  mysql> SELECT REGEXP_LIKE('gheis', '^[^a-dXYZ]+$');            -> 1
  mysql> SELECT REGEXP_LIKE('gheisa', '^[^a-dXYZ]+$');           -> 0
  ```

- `[=character_class=]`

  Dentro de uma expressão de intervalo (escrita usando `[` e `]`), `[=character_class=]` representa uma classe de equivalência. Ela corresponde a todos os caracteres com o mesmo valor de collation, incluindo a si mesma. Por exemplo, se `o` e `(+)` são os membros de uma classe de equivalência, `[[=o=]]`, `[[=(+)=]]` e `[o(+)]` são todos sinônimos. Uma classe de equivalência não pode ser usada como um ponto final de uma faixa.

- `[:character_class:]`

  Dentro de uma expressão entre colchetes (escrita usando `[` e `]`), `[:character_class:]` representa uma classe de caracteres que corresponde a todos os caracteres pertencentes a essa classe. A tabela a seguir lista os nomes padrão das classes. Esses nomes representam as classes de caracteres definidas na página de manual `ctype(3)`. Um determinado local pode fornecer outros nomes de classes. Uma classe de caracteres não pode ser usada como um ponto final de uma faixa.

  <table summary="Nomes das classes de personagens e o significado de cada classe."><thead><tr> <th>Nome da Classe de Personagem</th> <th>Significado</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CODE_<code>upper</code>]</td> <td>Caracteres alfanuméricos</td> </tr><tr> <td>[[PH_HTML_CODE_<code>upper</code>]</td> <td>Caracteres alfabéticos</td> </tr><tr> <td>[[<code>blank</code>]]</td> <td>Caracteres de espaço em branco</td> </tr><tr> <td>[[<code>cntrl</code>]]</td> <td>Caracteres de controle</td> </tr><tr> <td>[[<code>digit</code>]]</td> <td>Caracteres digitais</td> </tr><tr> <td>[[<code>graph</code>]]</td> <td>Personagens gráficos</td> </tr><tr> <td>[[<code>lower</code>]]</td> <td>Letras minúsculas</td> </tr><tr> <td>[[<code>print</code>]]</td> <td>Caracteres gráficos ou espaciais</td> </tr><tr> <td>[[<code>punct</code>]]</td> <td>Caracteres de pontuação</td> </tr><tr> <td>[[<code>space</code>]]</td> <td>Espaço, tabulação, nova linha e retorno de carroceria</td> </tr><tr> <td>[[<code>upper</code>]]</td> <td>Letras maiúsculas</td> </tr><tr> <td>[[<code>alpha</code><code>upper</code>]</td> <td>Caracteres de dígitos hexadecimais</td> </tr></tbody></table>

  ```
  mysql> SELECT REGEXP_LIKE('justalnums', '[[:alnum:]]+');       -> 1
  mysql> SELECT REGEXP_LIKE('!!', '[[:alnum:]]+');               -> 0
  ```

  Como o ICU reconhece todos os caracteres alfabéticos em `utf16_general_ci`, algumas classes de caracteres podem não funcionar tão rapidamente quanto as faixas de caracteres. Por exemplo, `[a-zA-Z]` é conhecido por funcionar muito mais rapidamente do que `[[:alpha:]]`, e `[0-9]` geralmente é muito mais rápido do que `[[:digit:]]`. Se você está migrando aplicativos usando `[[:alpha:]]` ou `[[:digit:]]` de uma versão mais antiga do MySQL, você deve substituí-los pelas faixas equivalentes para uso com o MySQL 8.0.

Para usar uma instância literal de um caractere especial em uma expressão regular, anteceda-o com dois caracteres barra invertida (//). O analisador do MySQL interpreta um dos barra invertidas, e a biblioteca de expressões regulares interpreta a outra. Por exemplo, para corresponder à string `1+2` que contém o caractere especial `+`, apenas a seguinte expressão regular é a correta:

```
mysql> SELECT REGEXP_LIKE('1+2', '1+2');                       -> 0
mysql> SELECT REGEXP_LIKE('1+2', '1\+2');                      -> 0
mysql> SELECT REGEXP_LIKE('1+2', '1\\+2');                     -> 1
```

#### Controle de Recursos de Expressões Regulares

As funções `REGEXP_LIKE()` e similares utilizam recursos que podem ser controlados definindo variáveis do sistema:

- O motor de partidas usa memória para sua pilha interna. Para controlar a memória máxima disponível para a pilha em bytes, defina a variável de sistema `regexp_stack_limit`.

- O motor de partidas funciona em etapas. Para controlar o número máximo de etapas realizadas pelo motor (e, portanto, indiretamente o tempo de execução), defina a variável de sistema `regexp_time_limit`. Como esse limite é expresso em número de etapas, ele afeta o tempo de execução apenas indiretamente. Normalmente, é da ordem de milissegundos.

#### Considerações sobre a compatibilidade com expressões regulares

Antes do MySQL 8.0.4, o MySQL usava a biblioteca de expressões regulares Henry Spencer para suportar operações de expressões regulares, em vez do International Components for Unicode (ICU). A discussão a seguir descreve as diferenças entre as bibliotecas Spencer e ICU que podem afetar as aplicações:

- Com a biblioteca Spencer, os operadores `REGEXP` e `RLIKE` funcionam de forma de byte, portanto, não são seguros para multibytes e podem produzir resultados inesperados com conjuntos de caracteres multibytes. Além disso, esses operadores comparam caracteres por seus valores de byte e caracteres acentuados podem não ser considerados iguais, mesmo que uma determinada ordenação os trate como iguais.

  O ICU tem suporte completo para Unicode e é seguro para multibyte. Suas funções de expressão regular tratam todas as strings como `UTF-16`. Você deve ter em mente que os índices posicionais são baseados em blocos de 16 bits e não em pontos de código. Isso significa que, quando passados para tais funções, caracteres que usam mais de um bloco podem produzir resultados inesperados, como os mostrados aqui:

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

  Os caracteres dentro do Plano Multilíngue Básico do Unicode, que inclui caracteres usados pela maioria das línguas modernas, são seguros a esse respeito:

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

  Os emojis, como o caractere “sushi” `🍣` (U+1F363) usado nos dois primeiros exemplos, não estão incluídos no Plano Multilíngue Básico, mas sim no Plano Multilíngue Suplementar do Unicode. Outro problema pode surgir com emojis e outros caracteres de 4 bytes quando `REGEXP_SUBSTR()` ou uma função semelhante começa a pesquisar no meio de um caractere. Cada uma das duas declarações no exemplo a seguir começa a partir da segunda posição de 2 bytes no primeiro argumento. A primeira declaração trabalha com uma string composta exclusivamente por caracteres de 2 bytes (BMP). A segunda declaração contém caracteres de 4 bytes que são interpretados incorretamente no resultado porque os dois primeiros bytes são removidos e, assim, o restante dos dados do caractere está desalinhado.

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

- Para o operador `.`, a biblioteca Spencer corresponde a caracteres de finalizador de linha (retorno de carro, nova linha) em qualquer lugar nas expressões de string, incluindo no meio. Para corresponder aos caracteres de finalizador de linha no meio das strings com o ICU, especifique o caractere de controle de correspondência `m`.

- A biblioteca Spencer suporta marcadores de limites de palavras no início e no final (notação `[[:<:]]` e `[[:>:]]`). O ICU não. Para o ICU, você pode usar `\b` para corresponder aos limites de palavras; duplicar a barra invertida porque o MySQL a interpreta como o caractere de escape dentro das strings.

- A biblioteca Spencer suporta expressões de colchetes de elementos de agregação (notação `[.characters.]`). O ICU

- Para contagem de repetições (notação `{n}` e `{m,n}`), a biblioteca Spencer tem um máximo de 255. O ICU não tem tal limite, embora o número máximo de etapas do mecanismo de correspondência possa ser limitado definindo a variável de sistema `regexp_time_limit`.

- O ICU interpreta os parênteses como metacaracteres. Para especificar um literal aberto `(` ou um parêntese fechado `)` em uma expressão regular, ele deve ser escapado:

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

- A ICU também interpreta os colchetes como metacaracteres, mas apenas o colchete aberto precisa ser escapado para ser usado como um caractere literal:

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
