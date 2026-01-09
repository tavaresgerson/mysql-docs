## 12.11 Funções XML

**Tabela 12.16 Funções XML**

<table frame="box" rules="all" summary="Uma referência que lista as funções XML."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td>[[<code>ExtractValue()</code>]]</td> <td>Extrair um valor de uma string XML usando a notação XPath</td> </tr><tr><td>[[<code>UpdateXML()</code>]]</td> <td>Retorno substituiu o fragmento XML</td> </tr></tbody></table>

Esta seção discute o XML e as funcionalidades relacionadas no MySQL.

Nota

É possível obter saída formatada em XML do MySQL nos clientes **mysql** e **mysqldump** ao invocá-los com a opção `--xml`. Veja a Seção 4.5.1, “mysql — O Cliente de Linha de Comando do MySQL”, e a Seção 4.5.4, “mysqldump — Um Programa de Backup de Banco de Dados”.

Dois recursos que oferecem funcionalidades básicas do XPath 1.0 (Linguagem de Caminho XML, versão 1.0) estão disponíveis. Algumas informações básicas sobre a sintaxe e o uso do XPath são fornecidas mais adiante nesta seção; no entanto, uma discussão aprofundada desses tópicos está além do escopo deste manual, e você deve consultar o padrão XML Path Language (XPath) 1.0 para obter informações definitivas. Um recurso útil para aqueles que são novos no XPath ou que desejam um reforço nos conceitos básicos é o Zvon.org XPath Tutorial, que está disponível em vários idiomas.

Nota

Essas funções continuam em desenvolvimento. Continuamos a melhorar essas e outros aspectos da funcionalidade do XML e XPath no MySQL 5.7 e em versões posteriores. Você pode discutir essas funcionalidades, fazer perguntas sobre elas e obter ajuda de outros usuários no [Fórum de Usuários de XML do MySQL](https://forums.mysql.com/list.php?44).

As expressões XPath usadas com essas funções suportam variáveis de usuário e variáveis de programas armazenados localmente. As variáveis de usuário são verificadas de forma fraca; as variáveis locais dos programas armazenados são verificadas de forma forte (consulte também o bug #26518):

- **Variáveis de usuário (verificação fraca).** As variáveis que usam a sintaxe `$@variable_name` (ou seja, variáveis de usuário) não são verificadas. O servidor não emite avisos ou erros se uma variável tiver o tipo errado ou não tiver sido atribuído um valor anteriormente. Isso também significa que o usuário é totalmente responsável por quaisquer erros tipográficos, pois não são emitidos avisos se, por exemplo, `$@myvairable` for usado onde `$@myvariable` foi intencional.

  Exemplo:

  ```sql
  mysql> SET @xml = '<a><b>X</b><b>Y</b></a>';
  Query OK, 0 rows affected (0.00 sec)

  mysql> SET @i =1, @j = 2;
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT @i, ExtractValue(@xml, '//b[$@i]');
  +------+--------------------------------+
  | @i   | ExtractValue(@xml, '//b[$@i]') |
  +------+--------------------------------+
  |    1 | X                              |
  +------+--------------------------------+
  1 row in set (0.00 sec)

  mysql> SELECT @j, ExtractValue(@xml, '//b[$@j]');
  +------+--------------------------------+
  | @j   | ExtractValue(@xml, '//b[$@j]') |
  +------+--------------------------------+
  |    2 | Y                              |
  +------+--------------------------------+
  1 row in set (0.00 sec)

  mysql> SELECT @k, ExtractValue(@xml, '//b[$@k]');
  +------+--------------------------------+
  | @k   | ExtractValue(@xml, '//b[$@k]') |
  +------+--------------------------------+
  | NULL |                                |
  +------+--------------------------------+
  1 row in set (0.00 sec)
  ```

- **Variáveis em programas armazenados (verificação rigorosa).** Variáveis que utilizam a sintaxe `$nome_da_variável` podem ser declaradas e usadas com essas funções quando chamadas dentro de programas armazenados. Essas variáveis são locais para o programa armazenado em que são definidas e são verificadas rigorosamente quanto ao tipo e ao valor.

  Exemplo:

  ```sql
  mysql> DELIMITER |

  mysql> CREATE PROCEDURE myproc ()
      -> BEGIN
      ->   DECLARE i INT DEFAULT 1;
      ->   DECLARE xml VARCHAR(25) DEFAULT '<a>X</a><a>Y</a><a>Z</a>';
      ->
      ->   WHILE i < 4 DO
      ->     SELECT xml, i, ExtractValue(xml, '//a[$i]');
      ->     SET i = i+1;
      ->   END WHILE;
      -> END |
  Query OK, 0 rows affected (0.01 sec)

  mysql> DELIMITER ;

  mysql> CALL myproc();
  +--------------------------+---+------------------------------+
  | xml                      | i | ExtractValue(xml, '//a[$i]') |
  +--------------------------+---+------------------------------+
  | <a>X</a><a>Y</a><a>Z</a> | 1 | X                            |
  +--------------------------+---+------------------------------+
  1 row in set (0.00 sec)

  +--------------------------+---+------------------------------+
  | xml                      | i | ExtractValue(xml, '//a[$i]') |
  +--------------------------+---+------------------------------+
  | <a>X</a><a>Y</a><a>Z</a> | 2 | Y                            |
  +--------------------------+---+------------------------------+
  1 row in set (0.01 sec)

  +--------------------------+---+------------------------------+
  | xml                      | i | ExtractValue(xml, '//a[$i]') |
  +--------------------------+---+------------------------------+
  | <a>X</a><a>Y</a><a>Z</a> | 3 | Z                            |
  +--------------------------+---+------------------------------+
  1 row in set (0.01 sec)
  ```

  **Parâmetros.** As variáveis usadas em expressões XPath dentro de rotinas armazenadas que são passadas como parâmetros também estão sujeitas a verificações rigorosas.

As expressões que contêm variáveis de usuário ou variáveis locais de programas armazenados devem, de outra forma (exceto para notação), seguir as regras para expressões XPath que contêm variáveis, conforme especificado na especificação do XPath 1.0.

Nota

Uma variável de usuário usada para armazenar uma expressão XPath é tratada como uma string vazia. Por isso, não é possível armazenar uma expressão XPath como uma variável de usuário. (Bug #32911)

- `ExtractValue(xml_frag, xpath_expr)`

  `ExtractValue()` recebe dois argumentos de string, um fragmento de marcação XML *`xml_frag`* e uma expressão XPath *`xpath_expr`* (também conhecida como localizador); ele retorna o texto (`CDATA`) do primeiro nó de texto que é um filho do elemento ou elementos correspondidos pela expressão XPath.

  Usar essa função é equivalente a realizar uma correspondência usando o *`xpath_expr`* após a adição de `/text()`. Em outras palavras, `ExtractValue('<a><b>Sakila</b></a>', '/a/b')` e `ExtractValue('<a><b>Sakila</b></a>', '/a/b/text()')` produzem o mesmo resultado.

  Se forem encontrados vários resultados, o conteúdo do primeiro nó de texto de um elemento correspondente é retornado (na ordem em que foram encontrados) como uma única string separada por espaços.

  Se não for encontrado nenhum nó de texto correspondente à expressão (incluindo o implícito `/text()`) — por qualquer motivo, desde que *`xpath_expr`* seja válido e *`xml_frag`* consista em elementos corretamente aninhados e fechados — uma string vazia é retornada. Não há distinção entre uma correspondência em um elemento vazio e nenhuma correspondência. Isso é por design.

  Se você precisar determinar se nenhum elemento correspondente foi encontrado em *`xml_frag`* ou se um elemento foi encontrado, mas não continha nenhum nó de texto filho, você deve testar o resultado de uma expressão que usa a função XPath `count()`. Por exemplo, ambas as seguintes declarações retornam uma string vazia, como mostrado aqui:

  ```sql
  mysql> SELECT ExtractValue('<a><b/></a>', '/a/b');
  +-------------------------------------+
  | ExtractValue('<a><b/></a>', '/a/b') |
  +-------------------------------------+
  |                                     |
  +-------------------------------------+
  1 row in set (0.00 sec)

  mysql> SELECT ExtractValue('<a><c/></a>', '/a/b');
  +-------------------------------------+
  | ExtractValue('<a><c/></a>', '/a/b') |
  +-------------------------------------+
  |                                     |
  +-------------------------------------+
  1 row in set (0.00 sec)
  ```

  No entanto, você pode determinar se realmente havia um elemento correspondente usando o seguinte:

  ```sql
  mysql> SELECT ExtractValue('<a><b/></a>', 'count(/a/b)');
  +-------------------------------------+
  | ExtractValue('<a><b/></a>', 'count(/a/b)') |
  +-------------------------------------+
  | 1                                   |
  +-------------------------------------+
  1 row in set (0.00 sec)

  mysql> SELECT ExtractValue('<a><c/></a>', 'count(/a/b)');
  +-------------------------------------+
  | ExtractValue('<a><c/></a>', 'count(/a/b)') |
  +-------------------------------------+
  | 0                                   |
  +-------------------------------------+
  1 row in set (0.01 sec)
  ```

  Importante

  `ExtractValue()` retorna apenas `CDATA` e não retorna nenhuma tag que possa estar contida em uma tag correspondente, nem nenhum de seus conteúdos (veja o resultado retornado como `val1` no exemplo a seguir).

  ```sql
  mysql> SELECT
      ->   ExtractValue('<a>ccc<b>ddd</b></a>', '/a') AS val1,
      ->   ExtractValue('<a>ccc<b>ddd</b></a>', '/a/b') AS val2,
      ->   ExtractValue('<a>ccc<b>ddd</b></a>', '//b') AS val3,
      ->   ExtractValue('<a>ccc<b>ddd</b></a>', '/b') AS val4,
      ->   ExtractValue('<a>ccc<b>ddd</b><b>eee</b></a>', '//b') AS val5;

  +------+------+------+------+---------+
  | val1 | val2 | val3 | val4 | val5    |
  +------+------+------+------+---------+
  | ccc  | ddd  | ddd  |      | ddd eee |
  +------+------+------+------+---------+
  ```

  Essa função usa a collation SQL atual para fazer comparações com `contains()`, realizando a mesma agregação de collation que outras funções de string (como `CONCAT()`), levando em consideração a coercibilidade da collation de seus argumentos; consulte a Seção 10.8.4, “Coercibilidade de Collation em Expressões”, para uma explicação das regras que regem esse comportamento.

  (Anteriormente, a comparação binária — ou seja, sensível ao caso — sempre era usada.)

  `NULL` é retornado se *`xml_frag`* contiver elementos que não estão corretamente aninhados ou fechados, e uma mensagem de aviso é gerada, como mostrado neste exemplo:

  ```sql
  mysql> SELECT ExtractValue('<a>c</a><b', '//a');
  +-----------------------------------+
  | ExtractValue('<a>c</a><b', '//a') |
  +-----------------------------------+
  | NULL                              |
  +-----------------------------------+
  1 row in set, 1 warning (0.00 sec)

  mysql> SHOW WARNINGS\G
  *************************** 1. row ***************************
    Level: Warning
     Code: 1525
  Message: Incorrect XML value: 'parse error at line 1 pos 11:
           END-OF-INPUT unexpected ('>' wanted)'
  1 row in set (0.00 sec)

  mysql> SELECT ExtractValue('<a>c</a><b/>', '//a');
  +-------------------------------------+
  | ExtractValue('<a>c</a><b/>', '//a') |
  +-------------------------------------+
  | c                                   |
  +-------------------------------------+
  1 row in set (0.00 sec)
  ```

- `UpdateXML(xml_target, xpath_expr, new_xml)`

  Essa função substitui uma única parte de um fragmento dado de marcação XML *`xml_target`* por um novo fragmento XML *`new_xml`*, e depois retorna o XML alterado. A parte de *`xml_target`* que é substituída corresponde a uma expressão XPath *`xpath_expr`* fornecida pelo usuário.

  Se não for encontrado nenhum expressão que corresponda a *`xpath_expr`*, ou se forem encontrados vários correspondentes, a função retorna o fragmento XML original de *`xml_target`*. Todos os três argumentos devem ser strings.

  ```sql
  mysql> SELECT
      ->   UpdateXML('<a><b>ccc</b><d></d></a>', '/a', '<e>fff</e>') AS val1,
      ->   UpdateXML('<a><b>ccc</b><d></d></a>', '/b', '<e>fff</e>') AS val2,
      ->   UpdateXML('<a><b>ccc</b><d></d></a>', '//b', '<e>fff</e>') AS val3,
      ->   UpdateXML('<a><b>ccc</b><d></d></a>', '/a/d', '<e>fff</e>') AS val4,
      ->   UpdateXML('<a><d></d><b>ccc</b><d></d></a>', '/a/d', '<e>fff</e>') AS val5
      -> \G

  *************************** 1. row ***************************
  val1: <e>fff</e>
  val2: <a><b>ccc</b><d></d></a>
  val3: <a><e>fff</e><d></d></a>
  val4: <a><b>ccc</b><e>fff</e></a>
  val5: <a><d></d><b>ccc</b><d></d></a>
  ```

Nota

Uma discussão aprofundada sobre a sintaxe e o uso do XPath está além do escopo deste manual. Consulte a especificação do XML Path Language (XPath) 1.0 para obter informações definitivas. Um recurso útil para aqueles que são novos no XPath ou que desejam um reforço nos conceitos básicos é o Zvon.org XPath Tutorial, que está disponível em vários idiomas.

Segue abaixo descrições e exemplos de algumas expressões básicas do XPath:

- /tag

  Converte `<tag/>` em correspondência se e somente se `<tag/>` for o elemento raiz.

  Exemplo: `/a` tem uma correspondência em `<a><b/></a>` porque corresponde à tag mais externa (raiz). Não corresponde ao elemento `*a`` interno em `<b><a/></b>\` porque, neste caso, é filho de outro elemento.

- `/tag1/tag2`

  Converte elementos `<tag2/>` se e somente se forem filhos de `<tag1/>`, e `<tag1/>` é o elemento raiz.

  Exemplo: `/a/b` corresponde ao elemento *`b`* no fragmento XML `<a><b/></a>` porque é um filho do elemento raiz *`a`*. Não há correspondência em `<b><a/></b>` porque, neste caso, *`b`* é o elemento raiz (e, portanto, filho de nenhum outro elemento). A expressão XPath também não tem correspondência em `<a><c><b/></c></a>`; aqui, *`b`* é um descendente de *`a`*, mas não é realmente um filho de *`a`*.

  Esse construto pode ser estendido para três ou mais elementos. Por exemplo, a expressão XPath `/a/b/c` corresponde ao elemento *`c`* no fragmento `<a><b><c/></b></a>`.

- `//tag`

  Converte qualquer instância de `<tag>`.

  Exemplo: `//a` corresponde ao elemento *`a`* em qualquer um dos seguintes: `<a><b><c/></b></a>`; `<c><a><b/></a></b>`; `<c><b><a/></b></c>`.

  `//` pode ser combinado com `/`. Por exemplo, `//a/b` corresponde ao elemento *`b`* em qualquer um dos fragmentos `<a><b/></a>` ou `<c><a><b/></a></c>`.

  Nota

  `//tag` é equivalente a `/descendant-or-self::*/tag`. Um erro comum é confundir isso com `/descendant-or-self::tag`, embora a expressão última possa levar a resultados muito diferentes, como pode ser visto aqui:

  ```sql
  mysql> SET @xml = '<a><b><c>w</c><b>x</b><d>y</d>z</b></a>';
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT @xml;
  +-----------------------------------------+
  | @xml                                    |
  +-----------------------------------------+
  | <a><b><c>w</c><b>x</b><d>y</d>z</b></a> |
  +-----------------------------------------+
  1 row in set (0.00 sec)

  mysql> SELECT ExtractValue(@xml, '//b[1]');
  +------------------------------+
  | ExtractValue(@xml, '//b[1]') |
  +------------------------------+
  | x z                          |
  +------------------------------+
  1 row in set (0.00 sec)

  mysql> SELECT ExtractValue(@xml, '//b[2]');
  +------------------------------+
  | ExtractValue(@xml, '//b[2]') |
  +------------------------------+
  |                              |
  +------------------------------+
  1 row in set (0.01 sec)

  mysql> SELECT ExtractValue(@xml, '/descendant-or-self::*/b[1]');
  +---------------------------------------------------+
  | ExtractValue(@xml, '/descendant-or-self::*/b[1]') |
  +---------------------------------------------------+
  | x z                                               |
  +---------------------------------------------------+
  1 row in set (0.06 sec)

  mysql> SELECT ExtractValue(@xml, '/descendant-or-self::*/b[2]');
  +---------------------------------------------------+
  | ExtractValue(@xml, '/descendant-or-self::*/b[2]') |
  +---------------------------------------------------+
  |                                                   |
  +---------------------------------------------------+
  1 row in set (0.00 sec)


  mysql> SELECT ExtractValue(@xml, '/descendant-or-self::b[1]');
  +-------------------------------------------------+
  | ExtractValue(@xml, '/descendant-or-self::b[1]') |
  +-------------------------------------------------+
  | z                                               |
  +-------------------------------------------------+
  1 row in set (0.00 sec)

  mysql> SELECT ExtractValue(@xml, '/descendant-or-self::b[2]');
  +-------------------------------------------------+
  | ExtractValue(@xml, '/descendant-or-self::b[2]') |
  +-------------------------------------------------+
  | x                                               |
  +-------------------------------------------------+
  1 row in set (0.00 sec)
  ```

- O operador `*` atua como um "caractere curinga" que corresponde a qualquer elemento. Por exemplo, a expressão `/*/b` corresponde ao elemento `*``b`\* em qualquer um dos fragmentos XML `<a><b/></a>` ou `<c><b/></c>`. No entanto, a expressão não produz uma correspondência no fragmento `<b><a/></b>` porque `*``b`\* deve ser um filho de algum outro elemento. O caractere curinga pode ser usado em qualquer posição: a expressão `/*/b/*` corresponde a qualquer filho de um elemento `*``b`\* que não seja ele mesmo o elemento raiz.

- Você pode combinar qualquer um dos vários localizadores usando o operador `|` (`UNION`). Por exemplo, a expressão `//b|//c` combina todos os elementos *`b`* e *`c`* no alvo XML.

- Também é possível combinar um elemento com base no valor de um ou mais de seus atributos. Isso é feito usando a sintaxe `tag[@attribute="value"]`. Por exemplo, a expressão `//b[@id="idB"]` combina o segundo elemento *b* no fragmento `<a><b id="idA"/><c/><b id="idB"/></a>`. Para combinar com *qualquer* elemento que tenha `attribute="value"`, use a expressão XPath `//*[attribute="value"]`.

  Para filtrar múltiplos valores de atributo, basta usar múltiplas cláusulas de comparação de atributo em sequência. Por exemplo, a expressão `//b[@c="x"][@d="y"]` corresponde ao elemento `<b c="x" d="y"/>` que ocorre em qualquer lugar de um fragmento XML dado.

  Para encontrar elementos para os quais o mesmo atributo corresponda a qualquer um dos vários valores, você pode usar múltiplos locatores unidos pelo operador `|`. Por exemplo, para corresponder a todos os elementos `*b*` cujos atributos `*c*` tenham qualquer um dos valores 23 ou 17, use a expressão `//b[@c="23"]|//b[@c="17"]`. Você também pode usar o operador lógico `ou` para esse propósito: `//b[@c="23" or @c="17"]`.

  Nota

  A diferença entre `or` e `|` é que `or` une condições, enquanto `|` une conjuntos de resultados.

**Limitações do XPath.** A sintaxe XPath suportada por essas funções está atualmente sujeita às seguintes limitações:

- A comparação entre conjuntos de nós (como `'/a/b[@c=@d]'`) não é suportada.

- Todos os operadores de comparação padrão do XPath são suportados. (Bug #22823)

- As expressões de localizador relativo são resolvidas no contexto do nó raiz. Por exemplo, considere a seguinte consulta e resultado:

  ```sql
  mysql> SELECT ExtractValue(
      ->   '<a><b c="1">X</b><b c="2">Y</b></a>',
      ->    'a/b'
      -> ) AS result;
  +--------+
  | result |
  +--------+
  | X Y    |
  +--------+
  1 row in set (0.03 sec)
  ```

  Neste caso, o localizador `a/b` resolve-se em `/a/b`.

  Os localizadores relativos também são suportados dentro dos predicados. No exemplo a seguir, `d[../@c="1"]` é resolvido como `/a/b[@c="1"]/d`:

  ```sql
  mysql> SELECT ExtractValue(
      ->      '<a>
      ->        <b c="1"><d>X</d></b>
      ->        <b c="2"><d>X</d></b>
      ->      </a>',
      ->      'a/b/d[../@c="1"]')
      -> AS result;
  +--------+
  | result |
  +--------+
  | X      |
  +--------+
  1 row in set (0.00 sec)
  ```

- Os localizadores prefixados com expressões que avaliam como valores escalares — incluindo referências de variáveis, literais, números e chamadas de funções escalares — não são permitidos e seu uso resulta em um erro.

- O operador `::` não é suportado em combinação com tipos de nó, como os seguintes:

  - `axis::comment()`
  - `axis::text()`
  - `axis::processamento-instruções()`
  - `axis::node()`

  No entanto, os testes de nome (como `axis::name` e `axis::*`) são suportados, como mostrado nesses exemplos:

  ```sql
  mysql> SELECT ExtractValue('<a><b>x</b><c>y</c></a>','/a/child::b');
  +-------------------------------------------------------+
  | ExtractValue('<a><b>x</b><c>y</c></a>','/a/child::b') |
  +-------------------------------------------------------+
  | x                                                     |
  +-------------------------------------------------------+
  1 row in set (0.02 sec)

  mysql> SELECT ExtractValue('<a><b>x</b><c>y</c></a>','/a/child::*');
  +-------------------------------------------------------+
  | ExtractValue('<a><b>x</b><c>y</c></a>','/a/child::*') |
  +-------------------------------------------------------+
  | x y                                                   |
  +-------------------------------------------------------+
  1 row in set (0.01 sec)
  ```

- A navegação “para cima e para baixo” não é suportada em casos em que o caminho levaria “acima” do elemento raiz. Ou seja, você não pode usar expressões que correspondem a descendentes de ancestrais de um determinado elemento, onde um ou mais dos ancestrais do elemento atual também são ancestrais do elemento raiz (veja o Bug #16321).

- As seguintes funções do XPath não são suportadas ou têm problemas conhecidos, conforme indicado:

  - `id()`
  - `lang()`
  - `local-name()`
  - `nome()`
  - `namespace-uri()`
  - `normalizar-espaço()`
  - `começa com()`
  - `string()`
  - `substring-after()`
  - `substring-before()`
  - `translate()`

- Os seguintes eixos não são suportados:

  - `following-sibling`
  - `seguindo`
  - `precedente-irmão`
  - precedente

As expressões XPath passadas como argumentos para `ExtractValue()` e `UpdateXML()` podem conter o caractere colon (`:`) em seletores de elementos, o que permite seu uso com marcação que utiliza a notação de namespaces XML. Por exemplo:

```sql
mysql> SET @xml = '<a>111<b:c>222<d>333</d><e:f>444</e:f></b:c></a>';
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT ExtractValue(@xml, '//e:f');
+-----------------------------+
| ExtractValue(@xml, '//e:f') |
+-----------------------------+
| 444                         |
+-----------------------------+
1 row in set (0.00 sec)

mysql> SELECT UpdateXML(@xml, '//b:c', '<g:h>555</g:h>');
+--------------------------------------------+
| UpdateXML(@xml, '//b:c', '<g:h>555</g:h>') |
+--------------------------------------------+
| <a>111<g:h>555</g:h></a>                   |
+--------------------------------------------+
1 row in set (0.00 sec)
```

Isso é semelhante, em alguns aspectos, ao que é permitido pelo Apache Xalan e por alguns outros analisadores, e é muito mais simples do que exigir declarações de namespace ou o uso das funções `namespace-uri()` e `local-name()`.

**Tratamento de erros.** Para tanto o `ExtractValue()` quanto o `UpdateXML()`, o localizador XPath utilizado deve ser válido e o XML a ser pesquisado deve conter elementos corretamente aninhados e fechados. Se o localizador for inválido, um erro será gerado:

```sql
mysql> SELECT ExtractValue('<a>c</a><b/>', '/&a');
ERROR 1105 (HY000): XPATH syntax error: '&a'
```

Se *`xml_frag`* não contiver elementos corretamente aninhados e fechados, `NULL` é retornado e uma mensagem de aviso é gerada, como mostrado neste exemplo:

```sql
mysql> SELECT ExtractValue('<a>c</a><b', '//a');
+-----------------------------------+
| ExtractValue('<a>c</a><b', '//a') |
+-----------------------------------+
| NULL                              |
+-----------------------------------+
1 row in set, 1 warning (0.00 sec)

mysql> SHOW WARNINGS\G
*************************** 1. row ***************************
  Level: Warning
   Code: 1525
Message: Incorrect XML value: 'parse error at line 1 pos 11:
         END-OF-INPUT unexpected ('>' wanted)'
1 row in set (0.00 sec)

mysql> SELECT ExtractValue('<a>c</a><b/>', '//a');
+-------------------------------------+
| ExtractValue('<a>c</a><b/>', '//a') |
+-------------------------------------+
| c                                   |
+-------------------------------------+
1 row in set (0.00 sec)
```

Importante

O XML de substituição usado como o terceiro argumento para `UpdateXML()` *não* é verificado para determinar se ele consiste apenas em elementos que estão corretamente aninhados e fechados.

**Injeção de XPath.** A injeção de código ocorre quando um código malicioso é introduzido no sistema para obter acesso não autorizado a privilégios e dados. Ela se baseia na exploração de suposições feitas pelos desenvolvedores sobre o tipo e o conteúdo dos dados inseridos pelos usuários. O XPath não é exceção a essa regra.

Um cenário comum em que isso pode acontecer é o caso de aplicativos que lidam com a autorização ao combinar a combinação de um nome de login e senha com as encontradas em um arquivo XML, usando uma expressão XPath como esta:

```sql
//user[login/text()='neapolitan' and password/text()='1c3cr34m']/attribute::id
```

Este é o equivalente do XPath a uma declaração SQL como esta:

```sql
SELECT id FROM users WHERE login='neapolitan' AND password='1c3cr34m';
```

Uma aplicação PHP que utiliza XPath pode gerenciar o processo de login da seguinte forma:

```sql
<?php

  $file     =   "users.xml";

  $login    =   $POST["login"];
  $password =   $POST["password"];

  $xpath = "//user[login/text()=$login and password/text()=$password]/attribute::id";

  if( file_exists($file) )
  {
    $xml = simplexml_load_file($file);

    if($result = $xml->xpath($xpath))
      echo "You are now logged in as user $result[0].";
    else
      echo "Invalid login name or password.";
  }
  else
    exit("Failed to open $file.");

?>
```

Não são realizados nenhum tipo de verificação na entrada. Isso significa que um usuário malicioso pode "quebrar o circuito" do teste ao inserir `' ou 1=1` tanto para o nome de login quanto para a senha, resultando na avaliação do `$xpath` conforme mostrado aqui:

```sql
//user[login/text()='' or 1=1 and password/text()='' or 1=1]/attribute::id
```

Como a expressão dentro dos colchetes sempre avalia como `true`, ela é efetivamente a mesma que esta, que corresponde ao atributo `id` de todos os elementos `user` no documento XML:

```sql
//user/attribute::id
```

Uma maneira de contornar esse ataque específico é simplesmente citar os nomes das variáveis a serem interpoladas na definição de `$xpath`, forçando que os valores passados de um formulário da Web sejam convertidos em strings:

```sql
$xpath = "//user[login/text()='$login' and password/text()='$password']/attribute::id";
```

Essa é a mesma estratégia que é frequentemente recomendada para prevenir ataques de injeção SQL. Em geral, as práticas que você deve seguir para prevenir ataques de injeção XPath são as mesmas que para prevenir ataques de injeção SQL:

- Nunca aceitou dados não testados dos usuários em sua aplicação.

- Verifique todos os dados enviados pelos usuários quanto ao tipo; rejeite ou converta os dados que estejam no tipo errado

- Teste os dados numéricos para valores fora do intervalo; trunque, arredonde ou rejeite valores que estejam fora do intervalo. Teste as strings para caracteres ilegais e remova-os ou rejeite a entrada que os contenha.

- Não exiba mensagens de erro explícitas que possam fornecer pistas a um usuário não autorizado para comprometer o sistema; registre essas informações em um arquivo ou tabela de banco de dados.

Assim como os ataques de injeção SQL podem ser usados para obter informações sobre esquemas de banco de dados, a injeção XPath também pode ser usada para percorrer arquivos XML e descobrir sua estrutura, conforme discutido no artigo de Amit Klein, "Blind XPath Injection" (arquivo PDF, 46KB).

Também é importante verificar a saída que está sendo enviada de volta ao cliente. Considere o que pode acontecer quando usamos a função `ExtractValue()` do MySQL:

```sql
mysql> SELECT ExtractValue(
    ->     LOAD_FILE('users.xml'),
    ->     '//user[login/text()="" or 1=1 and password/text()="" or 1=1]/attribute::id'
    -> ) AS id;
+-------------------------------+
| id                            |
+-------------------------------+
| 00327 13579 02403 42354 28570 |
+-------------------------------+
1 row in set (0.01 sec)
```

Como o `ExtractValue()` retorna múltiplos resultados como uma única string separada por espaços, esse ataque de injeção fornece a cada usuário todas as IDs válidas contidas em `users.xml` como uma única linha de saída. Como uma proteção extra, você também deve testar a saída antes de devolvê-la ao usuário. Aqui está um exemplo simples:

```sql
mysql> SELECT @id = ExtractValue(
    ->     LOAD_FILE('users.xml'),
    ->     '//user[login/text()="" or 1=1 and password/text()="" or 1=1]/attribute::id'
    -> );
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT IF(
    ->     INSTR(@id, ' ') = 0,
    ->     @id,
    ->     'Unable to retrieve user ID')
    -> AS singleID;
+----------------------------+
| singleID                   |
+----------------------------+
| Unable to retrieve user ID |
+----------------------------+
1 row in set (0.00 sec)
```

Em geral, as diretrizes para devolver dados aos usuários de forma segura são as mesmas que para aceitar a entrada do usuário. Essas diretrizes podem ser resumidas da seguinte forma:

- Sempre teste os dados de saída quanto ao tipo e aos valores permitidos.
- Nunca permita que usuários não autorizados vejam mensagens de erro que possam fornecer informações sobre o aplicativo que possam ser usadas para explorá-lo.
