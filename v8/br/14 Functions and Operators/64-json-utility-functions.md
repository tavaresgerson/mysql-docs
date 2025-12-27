### 14.17.8 Funções Utilitárias JSON

Esta seção documenta funções utilitárias que atuam em valores JSON ou em strings que podem ser analisadas como valores JSON. `JSON_PRETTY()` exibe um valor JSON em um formato fácil de ler. `JSON_STORAGE_SIZE()` e `JSON_STORAGE_FREE()` mostram, respectivamente, a quantidade de espaço de armazenamento usado por um dado valor JSON e a quantidade de espaço restante em uma coluna `JSON` após uma atualização parcial.

*  `JSON_PRETTY(json_val)`

  Fornece a impressão bonita de valores JSON, semelhante à implementada no PHP e em outros idiomas e sistemas de banco de dados. O valor fornecido deve ser um valor JSON ou uma representação válida de uma string de valor JSON. Espaços em branco e novas linhas em excesso presentes neste valor não têm efeito na saída. Para um valor `NULL`, a função retorna `NULL`. Se o valor não for um documento JSON ou não puder ser analisado como um, a função falha com um erro.

  O formato da saída desta função segue as seguintes regras:

  + Cada elemento de matriz ou membro de objeto aparece em uma linha separada, indentado em um nível adicional em comparação com seu pai.
  + Cada nível de indentação adiciona dois espaços à esquerda.
  + Uma vírgula que separa elementos de matriz individuais ou membros de objeto é impressa antes da nova linha que separa os dois elementos ou membros.
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
*  `JSON_STORAGE_FREE(json_val)`
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
  ```6XzEPpwY24```
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
  ```F3wTS0JrBV```
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
  ```AGjOkGiMqV```
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
  ```Ihu6mzrd8r```
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
  ```lCJ6pqDael```
  mysql> SELECT JSON_STORAGE_FREE('{"a": 10, "b": "wxyz", "c": "1"}') AS Free;
  +------+
  | Free |
  +------+
  |    0 |
  +------+
  1 row in set (0.00 sec)
  ```jXIEkzkzkK```
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
  ```ChUEZUK1Ed```
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
  ```jT8Qb9O2wU```
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
  ```3GbbMzcpgB```
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
  ```7bLCn5DCOV```
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
  ```ShpNaEsF1k```