## 12.11 Funções XML

**Tabela 12.16 Funções XML**

<table frame="box" rules="all" summary="Uma referência que lista funções XML."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>ExtractValue()</code></td> <td> Extrai um valor de uma string XML usando a notação XPath </td> </tr><tr><td><code>UpdateXML()</code></td> <td> Retorna o fragmento XML substituído </td> </tr> </tbody></table>

Esta seção discute o XML e funcionalidades relacionadas no MySQL.

Note

É possível obter saída formatada em XML do MySQL nos clientes **mysql** e **mysqldump**, invocando-os com a opção `--xml`. Veja Seção 4.5.1, “mysql — O Cliente de Linha de Comando MySQL”, e Seção 4.5.4, “mysqldump — Um Programa de Backup de Database”.

Duas funções que fornecem recursos básicos de XPath 1.0 (XML Path Language, versão 1.0) estão disponíveis. Algumas informações básicas sobre a sintaxe e uso do XPath são fornecidas mais adiante nesta seção; no entanto, uma discussão aprofundada sobre esses tópicos está além do escopo deste manual, e você deve consultar o padrão XML Path Language (XPath) 1.0 para obter informações definitivas. Um recurso útil para aqueles novos no XPath ou que desejam uma atualização dos conceitos básicos é o Zvon.org XPath Tutorial, que está disponível em vários idiomas.

Note

Estas funções permanecem em desenvolvimento. Continuamos a aprimorar estes e outros aspectos da funcionalidade XML e XPath no MySQL 5.7 e versões posteriores. Você pode discuti-las, fazer perguntas e obter ajuda de outros usuários no [Fórum de Usuários MySQL XML](https://forums.mysql.com/list.php?44).

As expressões XPath usadas com estas funções suportam variáveis de usuário (user variables) e variáveis locais de stored programs. Variáveis de usuário são verificadas de forma fraca (weakly checked); variáveis locais a stored programs são verificadas de forma forte (strongly checked) (veja também Bug #26518):

* **Variáveis de usuário (verificação fraca).** Variáveis que usam a sintaxe `$@variable_name` (ou seja, user variables) não são verificadas. Nenhum warning ou error é emitido pelo server se uma variável tiver o tipo errado ou não tiver sido previamente atribuída com um valor. Isso também significa que o usuário é totalmente responsável por quaisquer erros tipográficos, pois nenhum warning é dado se (por exemplo) `$@myvairable` for usado onde `$@myvariable` era a intenção.

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

* **Variáveis em stored programs (verificação forte).** Variáveis que usam a sintaxe `$variable_name` podem ser declaradas e usadas com estas funções quando são chamadas dentro de stored programs. Tais variáveis são locais ao stored program no qual são definidas e são fortemente verificadas quanto ao tipo e valor.

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

  **Parâmetros.** Variáveis usadas em expressões XPath dentro de stored routines que são passadas como parâmetros também estão sujeitas a verificação forte.

As expressões que contêm variáveis de usuário ou variáveis locais a stored programs devem, caso contrário (exceto pela notação), estar em conformidade com as regras para expressões XPath que contêm variáveis, conforme estabelecido na especificação XPath 1.0.

Note

Uma variável de usuário usada para armazenar uma expressão XPath é tratada como uma string vazia. Devido a isso, não é possível armazenar uma expressão XPath como uma variável de usuário. (Bug #32911)

* `ExtractValue(xml_frag, xpath_expr)`

  `ExtractValue()` aceita dois argumentos de string, um fragmento de marcação XML *`xml_frag`* e uma expressão XPath *`xpath_expr`* (também conhecida como locator); ela retorna o texto (`CDATA`) do primeiro text node que é filho do elemento ou elementos correspondidos pela expressão XPath.

  Usar esta função é o equivalente a realizar uma correspondência usando o *`xpath_expr`* após anexar `/text()`. Em outras palavras, `ExtractValue('<a><b>Sakila</b></a>', '/a/b')` e `ExtractValue('<a><b>Sakila</b></a>', '/a/b/text()')` produzem o mesmo resultado.

  Se múltiplas correspondências forem encontradas, o conteúdo do primeiro child text node de cada elemento correspondente é retornado (na ordem correspondida) como uma única string delimitada por espaços.

  Se nenhum text node correspondente for encontrado para a expressão (incluindo o `/text()` implícito)—por qualquer motivo, desde que *`xpath_expr`* seja válido, e *`xml_frag`* consista em elementos que estejam aninhados e fechados corretamente—uma string vazia é retornada. Nenhuma distinção é feita entre uma correspondência em um elemento vazio e nenhuma correspondência. Isso é intencional (by design).

  Se você precisar determinar se nenhum elemento correspondente foi encontrado em *`xml_frag`* ou se tal elemento foi encontrado, mas não continha child text nodes, você deve testar o resultado de uma expressão que usa a função XPath `count()`. Por exemplo, ambas as instruções retornam uma string vazia, conforme mostrado aqui:

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

  No entanto, você pode determinar se houve realmente um elemento correspondente usando o seguinte:

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

  `ExtractValue()` retorna apenas `CDATA` e não retorna nenhuma tag que possa estar contida dentro de uma tag correspondente, nem qualquer um de seus conteúdos (veja o resultado retornado como `val1` no exemplo a seguir).

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

  Esta função usa a collation SQL atual para fazer comparações com `contains()`, executando a mesma agregação de collation que outras string functions (como `CONCAT()`), levando em consideração a coercibilidade da collation de seus argumentos; veja Seção 10.8.4, “Coercibilidade de Collation em Expressões”, para uma explicação das regras que governam este comportamento.

  (Anteriormente, a comparação binária—ou seja, case-sensitive—era sempre usada.)

  `NULL` é retornado se *`xml_frag`* contiver elementos que não estejam aninhados ou fechados corretamente, e um warning é gerado, conforme mostrado neste exemplo:

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

* `UpdateXML(xml_target, xpath_expr, new_xml)`

  Esta função substitui uma única porção de um dado fragmento de marcação XML *`xml_target`* por um novo fragmento XML *`new_xml`* e então retorna o XML alterado. A porção de *`xml_target`* que é substituída corresponde a uma expressão XPath *`xpath_expr`* fornecida pelo usuário.

  Se nenhuma expressão correspondente a *`xpath_expr`* for encontrada, ou se múltiplas correspondências forem encontradas, a função retorna o fragmento XML *`xml_target`* original. Todos os três argumentos devem ser strings.

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

Note

Uma discussão aprofundada da sintaxe e uso do XPath está além do escopo deste manual. Consulte a especificação XML Path Language (XPath) 1.0 para obter informações definitivas. Um recurso útil para aqueles novos no XPath ou que desejam uma atualização dos conceitos básicos é o Zvon.org XPath Tutorial, que está disponível em vários idiomas.

Descrições e exemplos de algumas expressões XPath básicas a seguir:

* `/tag`

  Corresponde a `<tag/>` se e somente se `<tag/>` for o root element.

  Exemplo: `/a` tem uma correspondência em `<a><b/></a>` porque corresponde à tag mais externa (root). Não corresponde ao elemento *`a`* interno em `<b><a/></b>` porque, neste caso, ele é o child de outro elemento.

* `/tag1/tag2`

  Corresponde a `<tag2/>` se e somente se for um child de `<tag1/>`, e `<tag1/>` for o root element.

  Exemplo: `/a/b` corresponde ao elemento *`b`* no fragmento XML `<a><b/></a>` porque é um child do root element *`a`*. Não tem uma correspondência em `<b><a/></b>` porque, neste caso, *`b`* é o root element (e, portanto, child de nenhum outro elemento). Nem a expressão XPath tem uma correspondência em `<a><c><b/></c></a>`; aqui, *`b`* é um descendente de *`a`*, mas não é um child de *`a`*.

  Essa construção é extensível a três ou mais elementos. Por exemplo, a expressão XPath `/a/b/c` corresponde ao elemento *`c`* no fragmento `<a><b><c/></b></a>`.

* `//tag`

  Corresponde a qualquer instância de `<tag>`.

  Exemplo: `//a` corresponde ao elemento *`a`* em qualquer um dos seguintes: `<a><b><c/></b></a>`; `<c><a><b/></a></b>`; `<c><b><a/></b></c>`.

  `//` pode ser combinado com `/`. Por exemplo, `//a/b` corresponde ao elemento *`b`* em qualquer um dos fragmentos `<a><b/></a>` ou `<c><a><b/></a></c>`.

  Note

  `//tag` é o equivalente a `/descendant-or-self::*/tag`. Um erro comum é confundi-lo com `/descendant-or-self::tag`, embora a última expressão possa, na verdade, levar a resultados muito diferentes, como pode ser visto aqui:

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

* O operador `*` atua como um “wildcard” que corresponde a qualquer elemento. Por exemplo, a expressão `/*/b` corresponde ao elemento *`b`* em qualquer um dos fragmentos XML `<a><b/></a>` ou `<c><b/></c>`. No entanto, a expressão não produz uma correspondência no fragmento `<b><a/></b>` porque *`b`* deve ser um child de algum outro elemento. O wildcard pode ser usado em qualquer posição: A expressão `/*/b/*` corresponde a qualquer child de um elemento *`b`* que, por sua vez, não é o root element.

* Você pode corresponder a qualquer um de vários locators usando o operador `|` (`UNION`). Por exemplo, a expressão `//b|//c` corresponde a todos os elementos *`b`* e *`c`* no XML target.

* Também é possível corresponder a um elemento com base no valor de um ou mais de seus attributes. Isso é feito usando a sintaxe `tag[@attribute="value"]`. Por exemplo, a expressão `//b[@id="idB"]` corresponde ao segundo elemento *`b`* no fragmento `<a><b id="idA"/><c/><b id="idB"/></a>`. Para corresponder a *qualquer* elemento que tenha `attribute="value"`, use a expressão XPath `//*[attribute="value"]`.

  Para filtrar múltiplos valores de attribute, simplesmente use múltiplas cláusulas de comparação de attribute em sucessão. Por exemplo, a expressão `//b[@c="x"][@d="y"]` corresponde ao elemento `<b c="x" d="y"/>` que ocorre em qualquer lugar em um determinado fragmento XML.

  Para encontrar elementos para os quais o mesmo attribute corresponde a qualquer um de vários valores, você pode usar múltiplos locators unidos pelo operador `|`. Por exemplo, para corresponder a todos os elementos *`b`* cujos attributes *`c`* têm um dos valores 23 ou 17, use a expressão `//b[@c="23"]|//b[@c="17"]`. Você também pode usar o operador lógico `or` para este propósito: `//b[@c="23" or @c="17"]`.

  Note

  A diferença entre `or` e `|` é que `or` une condições, enquanto `|` une conjuntos de resultados (result sets).

**Limitações do XPath.** A sintaxe XPath suportada por estas funções está atualmente sujeita às seguintes limitações:

* Comparação de nodeset para nodeset (como `'/a/b[@c=@d]'`) não é suportada.

* Todos os operadores de comparação XPath padrão são suportados. (Bug #22823)

* Expressões de locator relativas são resolvidas no contexto do root node. Por exemplo, considere a seguinte query e resultado:

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

  Neste caso, o locator `a/b` é resolvido para `/a/b`.

  Locators relativos também são suportados dentro de predicates. No exemplo a seguir, `d[../@c="1"]` é resolvido como `/a/b[@c="1"]/d`:

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

* Locators prefixados com expressões que avaliam como scalar values — incluindo referências a variáveis, literais, números e chamadas de scalar function — não são permitidos, e seu uso resulta em um error.

* O operador `::` não é suportado em combinação com node types como os seguintes:

  + `axis::comment()`
  + `axis::text()`
  + `axis::processing-instructions()`
  + `axis::node()`

  No entanto, name tests (como `axis::name` e `axis::*`) são suportados, conforme mostrado nestes exemplos:

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

* Navegação “para cima e para baixo” (up-and-down) não é suportada em casos em que o path levaria “acima” do root element. Ou seja, você não pode usar expressões que correspondam a descendentes de ancestors de um determinado elemento, onde um ou mais dos ancestors do elemento atual também são ancestors do root element (veja Bug #16321).

* As seguintes funções XPath não são suportadas, ou têm problemas conhecidos conforme indicado:

  + `id()`
  + `lang()`
  + `local-name()`
  + `name()`
  + `namespace-uri()`
  + `normalize-space()`
  + `starts-with()`
  + `string()`
  + `substring-after()`
  + `substring-before()`
  + `translate()`
* Os seguintes axes não são suportados:

  + `following-sibling`
  + `following`
  + `preceding-sibling`
  + `preceding`

Expressões XPath passadas como argumentos para `ExtractValue()` e `UpdateXML()` podem conter o caractere de dois pontos (`:`) em seletores de elemento, o que permite seu uso com marcação que emprega notação de XML namespaces. Por exemplo:

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

Isso é semelhante em alguns aspectos ao que é permitido pelo Apache Xalan e alguns outros parsers, e é muito mais simples do que exigir declarações de namespace ou o uso das funções `namespace-uri()` e `local-name()`.

**Tratamento de Erros.** Tanto para `ExtractValue()` quanto para `UpdateXML()`, o locator XPath usado deve ser válido e o XML a ser pesquisado deve consistir em elementos que estejam aninhados e fechados corretamente. Se o locator for inválido, um error é gerado:

```sql
mysql> SELECT ExtractValue('<a>c</a><b/>', '/&a');
ERROR 1105 (HY000): XPATH syntax error: '&a'
```

Se *`xml_frag`* não consistir em elementos que estejam aninhados e fechados corretamente, `NULL` é retornado e um warning é gerado, conforme mostrado neste exemplo:

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

O XML de substituição usado como terceiro argumento para `UpdateXML()` *não* é verificado para determinar se consiste apenas em elementos que estão aninhados e fechados corretamente.

**Injeção XPath.** A injeção de código (code injection) ocorre quando código malicioso é introduzido no sistema para obter acesso não autorizado a privilégios e dados. É baseada na exploração de suposições feitas por desenvolvedores sobre o tipo e conteúdo dos dados inseridos pelos usuários. O XPath não é exceção a este respeito.

Um cenário comum em que isso pode acontecer é o caso de um aplicativo que lida com a autorização comparando a combinação de um nome de login e password com aqueles encontrados em um arquivo XML, usando uma expressão XPath como esta:

```sql
//user[login/text()='neapolitan' and password/text()='1c3cr34m']/attribute::id
```

Este é o equivalente XPath de um SQL statement como este:

```sql
SELECT id FROM users WHERE login='neapolitan' AND password='1c3cr34m';
```

Um aplicativo PHP que emprega XPath pode lidar com o processo de login assim:

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

Nenhuma verificação é realizada na entrada. Isso significa que um usuário mal-intencionado pode “short-circuit” o teste inserindo `' or 1=1` tanto para o login name quanto para o password, resultando em `$xpath` sendo avaliado conforme mostrado aqui:

```sql
//user[login/text()='' or 1=1 and password/text()='' or 1=1]/attribute::id
```

Uma vez que a expressão dentro dos colchetes sempre avalia como `true`, é efetivamente o mesmo que esta, que corresponde ao attribute `id` de cada elemento `user` no documento XML:

```sql
//user/attribute::id
```

Uma maneira pela qual este ataque em particular pode ser evitado é simplesmente citando os nomes das variáveis a serem interpoladas na definição de `$xpath`, forçando os valores passados de um Web form a serem convertidos em strings:

```sql
$xpath = "//user[login/text()='$login' and password/text()='$password']/attribute::id";
```

Esta é a mesma estratégia frequentemente recomendada para prevenir ataques de SQL injection. Em geral, as práticas que você deve seguir para prevenir ataques de injeção XPath são as mesmas para prevenir SQL injection:

* Nunca aceite dados não testados de usuários em sua aplicação.
* Verifique o tipo de todos os dados submetidos pelo usuário; rejeite ou converta dados que sejam do tipo errado.

* Teste dados numéricos para valores fora do intervalo (out of range); trunque, arredonde ou rejeite valores que estejam fora do intervalo. Teste strings para caracteres ilegais e remova-os ou rejeite a entrada que os contenha.

* Não exiba mensagens de error explícitas que possam fornecer a um usuário não autorizado pistas que poderiam ser usadas para comprometer o sistema; registre-as em um arquivo ou database table em vez disso.

Assim como os ataques de SQL injection podem ser usados para obter informações sobre database schemas, a injeção XPath pode ser usada para percorrer arquivos XML e descobrir sua estrutura, conforme discutido no artigo de Amit Klein, Blind XPath Injection (arquivo PDF, 46KB).

Também é importante verificar a saída (output) que está sendo enviada de volta ao cliente. Considere o que pode acontecer quando usamos a função `ExtractValue()` do MySQL:

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

Como `ExtractValue()` retorna múltiplas correspondências como uma única string delimitada por espaços, este ataque de injeção fornece todos os IDs válidos contidos em `users.xml` ao usuário como uma única linha de saída. Como salvaguarda extra, você também deve testar a saída antes de retorná-la ao usuário. Aqui está um exemplo simples:

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

Em geral, as diretrizes para retornar dados aos usuários de forma segura são as mesmas para aceitar input do usuário. Elas podem ser resumidas como:

* Sempre teste os dados de saída quanto ao tipo e valores permitidos.
* Nunca permita que usuários não autorizados vejam mensagens de error que possam fornecer informações sobre o aplicativo que poderiam ser usadas para explorá-lo.