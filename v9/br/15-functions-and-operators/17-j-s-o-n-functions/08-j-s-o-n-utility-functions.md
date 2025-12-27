### 14.17.8 Funções Utilitárias JSON

Esta seção documenta funções utilitárias que atuam em valores JSON ou em strings que podem ser analisadas como valores JSON. `JSON_PRETTY()` exibe um valor JSON em um formato fácil de ler. `JSON_STORAGE_SIZE()` e `JSON_STORAGE_FREE()` mostram, respectivamente, a quantidade de espaço de armazenamento usado por um valor JSON dado e a quantidade de espaço restante em uma coluna `JSON` após uma atualização parcial.

* `JSON_PRETTY(json_val)`

  Fornece a impressão bonita de valores JSON, semelhante à implementada em PHP e por outros idiomas e sistemas de banco de dados. O valor fornecido deve ser um valor JSON ou uma representação válida de uma string de valor JSON. Espaços em branco e novas linhas estranhas presentes neste valor não têm efeito na saída. Para um valor `NULL`, a função retorna `NULL`. Se o valor não for um documento JSON ou não puder ser analisado como um, a função falha com um erro.

  O formato da saída desta função segue as seguintes regras:

  + Cada elemento de matriz ou membro de objeto aparece em uma linha separada, indentado em um nível adicional em comparação com seu pai.

  + Cada nível de indentação adiciona dois espaços à esquerda.
  + Uma vírgula que separa elementos individuais de matriz ou membros de objeto é impressa antes da nova linha que separa os dois elementos ou membros.

  + A chave e o valor de um membro de objeto são separados por uma vírgula seguida de um espaço (`:`).

  + Um objeto ou matriz vazio é impresso em uma única linha. Não é impresso espaço entre a chave de abertura e a chave de fechamento.

  + Caracteres especiais em escalares de string e nomes de chaves são escapados empregando as mesmas regras usadas pela função `JSON_QUOTE()`.

  ```
  mysql> SELECT JSON_PRETTY('123'); # scalar
  +--------------------+
  | JSON_PRETTY('123') |
  +--------------------+
  | 123                |
  +--------------------+

  mysql> SELECT JSON_PRETTY("[1,3,5]"); # array
  +------------------------+
  | JSON_PRETTY("[1,3,5]") |
  +------------------------+
  | [
    1,
    3,
    5
  ]      |
  +------------------------+

  mysql> SELECT JSON_PRETTY('{"a":"10","b":"15","x":"25"}'); # object
  +---------------------------------------------+
  | JSON_PRETTY('{"a":"10","b":"15","x":"25"}') |
  +---------------------------------------------+
  | {
    "a": "10",
    "b": "15",
    "x": "25"
  }   |
  +---------------------------------------------+

  mysql> SELECT JSON_PRETTY('["a",1,{"key1":
      '>    "value1"},"5",     "77" ,
      '>       {"key2":["value3","valueX",
      '> "valueY"]},"j", "2"   ]')\G  # nested arrays and objects
  *************************** 1. row ***************************
  JSON_PRETTY('["a",1,{"key1":
               "value1"},"5",     "77" ,
                  {"key2":["value3","valuex",
            "valuey"]},"j", "2"   ]'): [
    "a",
    1,
    {
      "key1": "value1"
    },
    "5",
    "77",
    {
      "key2": [
        "value3",
        "valuex",
        "valuey"
      ]
    },
    "j",
    "2"
  ]
  ```

* `JSON_STORAGE_FREE(json_val)`

Para um valor de coluna `JSON`, essa função mostra quanto espaço de armazenamento foi liberado em sua representação binária após ser atualizado in-place usando `JSON_SET()`, `JSON_REPLACE()` ou `JSON_REMOVE()`. O argumento também pode ser um documento JSON válido ou uma string que pode ser analisada como um—seja como um valor literal ou como o valor de uma variável do usuário—neste caso, a função retorna 0. Ele retorna um valor positivo e não nulo se o argumento for um valor de coluna `JSON` que foi atualizado conforme descrito anteriormente, de modo que sua representação binária ocupe menos espaço do que antes da atualização. Para uma coluna `JSON` que foi atualizada de modo que sua representação binária seja a mesma ou maior que antes, ou se a atualização não conseguiu aproveitar uma atualização parcial, ele retorna 0; ele retorna `NULL` se o argumento for `NULL`.

Se *`json_val`* não for `NULL` e também não for um documento JSON válido ou não puder ser analisado com sucesso como um, resulta em um erro.

Neste exemplo, criamos uma tabela contendo uma coluna `JSON`, depois inserimos uma linha contendo um objeto JSON:

```
  mysql> CREATE TABLE jtable (jcol JSON);
  Query OK, 0 rows affected (0.38 sec)

  mysql> INSERT INTO jtable VALUES
      ->     ('{"a": 10, "b": "wxyz", "c": "[true, false]"}');
  Query OK, 1 row affected (0.04 sec)

  mysql> SELECT * FROM jtable;
  +----------------------------------------------+
  | jcol                                         |
  +----------------------------------------------+
  | {"a": 10, "b": "wxyz", "c": "[true, false]"} |
  +----------------------------------------------+
  1 row in set (0.00 sec)
  ```

Agora, atualizamos o valor da coluna usando `JSON_SET()` de modo que uma atualização parcial possa ser realizada; neste caso, substituímos o valor apontado pela chave `c` (o array `[true, false]`) por um que ocupa menos espaço (o inteiro `1`):

```
  mysql> UPDATE jtable
      ->     SET jcol = JSON_SET(jcol, "$.a", 10, "$.b", "wxyz", "$.c", 1);
  Query OK, 1 row affected (0.03 sec)
  Rows matched: 1  Changed: 1  Warnings: 0

  mysql> SELECT * FROM jtable;
  +--------------------------------+
  | jcol                           |
  +--------------------------------+
  | {"a": 10, "b": "wxyz", "c": 1} |
  +--------------------------------+
  1 row in set (0.00 sec)

  mysql> SELECT JSON_STORAGE_FREE(jcol) FROM jtable;
  +-------------------------+
  | JSON_STORAGE_FREE(jcol) |
  +-------------------------+
  |                      14 |
  +-------------------------+
  1 row in set (0.00 sec)
  ```

Os efeitos das atualizações parciais sucessivas neste espaço livre são cumulativos, como mostrado neste exemplo usando `JSON_SET()` para reduzir o espaço ocupado pelo valor com a chave `b` (e sem fazer outras alterações):

```
  mysql> UPDATE jtable
      ->     SET jcol = JSON_SET(jcol, "$.a", 10, "$.b", "wx", "$.c", 1);
  Query OK, 1 row affected (0.03 sec)
  Rows matched: 1  Changed: 1  Warnings: 0

  mysql> SELECT JSON_STORAGE_FREE(jcol) FROM jtable;
  +-------------------------+
  | JSON_STORAGE_FREE(jcol) |
  +-------------------------+
  |                      16 |
  +-------------------------+
  1 row in set (0.00 sec)
  ```

Atualizar a coluna sem usar `JSON_SET()`, `JSON_REPLACE()` ou `JSON_REMOVE()` significa que o otimizador não pode realizar a atualização in-place; nesse caso, `JSON_STORAGE_FREE()` retorna 0, como mostrado aqui:

```
  mysql> UPDATE jtable SET jcol = '{"a": 10, "b": 1}';
  Query OK, 1 row affected (0.05 sec)
  Rows matched: 1  Changed: 1  Warnings: 0

  mysql> SELECT JSON_STORAGE_FREE(jcol) FROM jtable;
  +-------------------------+
  | JSON_STORAGE_FREE(jcol) |
  +-------------------------+
  |                       0 |
  +-------------------------+
  1 row in set (0.00 sec)
  ```

Atualizações parciais de documentos JSON podem ser realizadas apenas nos valores da coluna. Para uma variável de usuário que armazena um valor JSON, o valor é sempre completamente substituído, mesmo quando a atualização é realizada usando `JSON_SET()`:

```
  mysql> SET @j = '{"a": 10, "b": "wxyz", "c": "[true, false]"}';
  Query OK, 0 rows affected (0.00 sec)

  mysql> SET @j = JSON_SET(@j, '$.a', 10, '$.b', 'wxyz', '$.c', '1');
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT @j, JSON_STORAGE_FREE(@j) AS Free;
  +----------------------------------+------+
  | @j                               | Free |
  +----------------------------------+------+
  | {"a": 10, "b": "wxyz", "c": "1"} |    0 |
  +----------------------------------+------+
  1 row in set (0.00 sec)
  ```

Para um literal JSON, essa função sempre retorna 0:

```
  mysql> SELECT JSON_STORAGE_FREE('{"a": 10, "b": "wxyz", "c": "1"}') AS Free;
  +------+
  | Free |
  +------+
  |    0 |
  +------+
  1 row in set (0.00 sec)
  ```

* `JSON_STORAGE_SIZE(json_val)`

Essa função retorna o número de bytes usados para armazenar a representação binária de um documento JSON. Quando o argumento é uma coluna `JSON`, esse é o espaço usado para armazenar o documento JSON como ele foi inserido na coluna, antes de quaisquer atualizações parciais que possam ter sido realizadas nele posteriormente. *`json_val`* deve ser um documento JSON válido ou uma string que pode ser analisada como um. No caso em que é uma string, a função retorna a quantidade de espaço de armazenamento na representação binária JSON que é criada ao analisar a string como JSON e convertê-la para binário. Ela retorna `NULL` se o argumento for `NULL`.

Um erro resulta quando *`json_val`* não é `NULL` e não é—ou não pode ser analisado com sucesso como—um documento JSON.

Para ilustrar o comportamento dessa função quando usada com uma coluna `JSON` como seu argumento, criamos uma tabela chamada `jtable` contendo uma coluna `jcol` `JSON`, inserimos um valor JSON na tabela e, em seguida, obtemos o espaço de armazenamento usado por essa coluna com `JSON_STORAGE_SIZE()`, como mostrado aqui:

```
  mysql> CREATE TABLE jtable (jcol JSON);
  Query OK, 0 rows affected (0.42 sec)

  mysql> INSERT INTO jtable VALUES
      ->     ('{"a": 1000, "b": "wxyz", "c": "[1, 3, 5, 7]"}');
  Query OK, 1 row affected (0.04 sec)

  mysql> SELECT
      ->     jcol,
      ->     JSON_STORAGE_SIZE(jcol) AS Size,
      ->     JSON_STORAGE_FREE(jcol) AS Free
      -> FROM jtable;
  +-----------------------------------------------+------+------+
  | jcol                                          | Size | Free |
  +-----------------------------------------------+------+------+
  | {"a": 1000, "b": "wxyz", "c": "[1, 3, 5, 7]"} |   47 |    0 |
  +-----------------------------------------------+------+------+
  1 row in set (0.00 sec)
  ```

De acordo com a saída de `JSON_STORAGE_SIZE()`, o documento JSON inserido na coluna ocupa 47 bytes. Também verificamos a quantidade de espaço liberado por quaisquer atualizações parciais anteriores da coluna usando `JSON_STORAGE_FREE()`; como ainda não foram realizadas atualizações, isso é 0, conforme esperado.

Em seguida, realizamos uma `UPDATE` na tabela que deve resultar em uma atualização parcial do documento armazenado em `jcol`, e depois testamos o resultado conforme mostrado aqui:

```
  mysql> UPDATE jtable SET jcol =
      ->     JSON_SET(jcol, "$.b", "a");
  Query OK, 1 row affected (0.04 sec)
  Rows matched: 1  Changed: 1  Warnings: 0

  mysql> SELECT
      ->     jcol,
      ->     JSON_STORAGE_SIZE(jcol) AS Size,
      ->     JSON_STORAGE_FREE(jcol) AS Free
      -> FROM jtable;
  +--------------------------------------------+------+------+
  | jcol                                       | Size | Free |
  +--------------------------------------------+------+------+
  | {"a": 1000, "b": "a", "c": "[1, 3, 5, 7]"} |   47 |    3 |
  +--------------------------------------------+------+------+
  1 row in set (0.00 sec)
  ```

O valor retornado por `JSON_STORAGE_FREE()` na consulta anterior indica que uma atualização parcial do documento JSON foi realizada, e que isso liberou 3 bytes de espaço usados para armazená-lo. O resultado retornado por `JSON_STORAGE_SIZE()` permanece inalterado pela atualização parcial.

Atualizações parciais são suportadas para atualizações usando `JSON_SET()`, `JSON_REPLACE()` ou `JSON_REMOVE()`. A atribuição direta de um valor a uma coluna `JSON` não pode ser parcialmente atualizada; após uma atualização desse tipo, `JSON_STORAGE_SIZE()` sempre mostra o espaço usado para o valor recém-definido:

```
  mysql> UPDATE jtable
  mysql>     SET jcol = '{"a": 4.55, "b": "wxyz", "c": "[true, false]"}';
  Query OK, 1 row affected (0.04 sec)
  Rows matched: 1  Changed: 1  Warnings: 0

  mysql> SELECT
      ->     jcol,
      ->     JSON_STORAGE_SIZE(jcol) AS Size,
      ->     JSON_STORAGE_FREE(jcol) AS Free
      -> FROM jtable;
  +------------------------------------------------+------+------+
  | jcol                                           | Size | Free |
  +------------------------------------------------+------+------+
  | {"a": 4.55, "b": "wxyz", "c": "[true, false]"} |   56 |    0 |
  +------------------------------------------------+------+------+
  1 row in set (0.00 sec)
  ```

Uma variável de usuário JSON não pode ser parcialmente atualizada. Isso significa que essa função sempre mostra o espaço atualmente usado para armazenar um documento JSON em uma variável de usuário:

```
  mysql> SET @j = '[100, "sakila", [1, 3, 5], 425.05]';
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT @j, JSON_STORAGE_SIZE(@j) AS Size;
  +------------------------------------+------+
  | @j                                 | Size |
  +------------------------------------+------+
  | [100, "sakila", [1, 3, 5], 425.05] |   45 |
  +------------------------------------+------+
  1 row in set (0.00 sec)

  mysql> SET @j = JSON_SET(@j, '$[1]', "json");
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT @j, JSON_STORAGE_SIZE(@j) AS Size;
  +----------------------------------+------+
  | @j                               | Size |
  +----------------------------------+------+
  | [100, "json", [1, 3, 5], 425.05] |   43 |
  +----------------------------------+------+
  1 row in set (0.00 sec)

  mysql> SET @j = JSON_SET(@j, '$[2][0]', JSON_ARRAY(10, 20, 30));
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT @j, JSON_STORAGE_SIZE(@j) AS Size;
  +---------------------------------------------+------+
  | @j                                          | Size |
  +---------------------------------------------+------+
  | [100, "json", [[10, 20, 30], 3, 5], 425.05] |   56 |
  +---------------------------------------------+------+
  1 row in set (0.00 sec)
  ```

Para um literal JSON, essa função sempre retorna o espaço de armazenamento atual usado:

```
  mysql> SELECT
      ->     JSON_STORAGE_SIZE('[100, "sakila", [1, 3, 5], 425.05]') AS A,
      ->     JSON_STORAGE_SIZE('{"a": 1000, "b": "a", "c": "[1, 3, 5, 7]"}') AS B,
      ->     JSON_STORAGE_SIZE('{"a": 1000, "b": "wxyz", "c": "[1, 3, 5, 7]"}') AS C,
      ->     JSON_STORAGE_SIZE('[100, "json", [[10, 20, 30], 3, 5], 425.05]') AS D;
  +----+----+----+----+
  | A  | B  | C  | D  |
  +----+----+----+----+
  | 45 | 44 | 47 | 56 |
  +----+----+----+----+
  1 row in set (0.00 sec)
  ```