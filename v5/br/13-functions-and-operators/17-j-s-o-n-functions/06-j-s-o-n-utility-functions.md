### 12.17.6 Funções de Utilitário JSON

Esta seção documenta funções de utilidade que atuam em valores JSON ou strings que podem ser analisados como valores JSON. `JSON_PRETTY()` exibe um valor JSON em um formato fácil de ler. `JSON_STORAGE_SIZE()` mostra a quantidade de espaço de armazenamento usado por um dado valor JSON.

- `JSON_PRETTY(json_val)`

  Fornece a impressão bonita dos valores JSON semelhantes à implementada no PHP e em outros idiomas e sistemas de banco de dados. O valor fornecido deve ser um valor JSON ou uma representação de string válida de um valor JSON. Espaços em branco e novas linhas estranhas presentes neste valor não têm efeito na saída. Para um valor `NULL`, a função retorna `NULL`. Se o valor não for um documento JSON ou não puder ser analisado como um, a função falha com um erro.

  A formatação da saída desta função segue as seguintes regras:

  - Cada elemento de matriz ou membro de objeto aparece em uma linha separada, indentado em um nível adicional em comparação com seu pai.

  - Cada nível de indentação adiciona dois espaços à frente.

  - Uma vírgula que separa elementos de array individuais ou membros de objeto é impressa antes da nova linha que separa os dois elementos ou membros.

  - A chave e o valor de um membro de objeto são separados por um ponto e vírgula seguido de um espaço (`:`).

  - Um objeto ou array vazio é impresso em uma única linha. Não há espaço impresso entre a brace de abertura e a brace de fechamento.

  - Caracteres especiais em escalares de string e nomes de chaves são escapados seguindo as mesmas regras usadas pela função `JSON_QUOTE()`.

  ```sql
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
       >    "value1"},"5",     "77" ,
       >       {"key2":["value3","valueX",
       > "valueY"]},"j", "2"   ]')\G  # nested arrays and objects
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

  Adicionado no MySQL 5.7.22.

- `JSON_STORAGE_SIZE(json_val)`

  Essa função retorna o número de bytes usados para armazenar a representação binária de um documento JSON. Quando o argumento é uma coluna `JSON`, este é o espaço usado para armazenar o documento JSON. *`json_val`* deve ser um documento JSON válido ou uma string que possa ser analisada como um. No caso em que é uma string, a função retorna a quantidade de espaço de armazenamento na representação binária do JSON que é criada ao analisar a string como JSON e convertê-la para binário. Ela retorna `NULL` se o argumento for `NULL`.

  Um erro ocorre quando *`json_val`* não é `NULL` e não é (ou não pode ser) convertido com sucesso em um documento JSON.

  Para ilustrar o comportamento dessa função quando usada com uma coluna `JSON` como argumento, criamos uma tabela chamada `jtable` contendo uma coluna `jcol` de tipo `JSON`, inserimos um valor JSON na tabela e, em seguida, obtemos o espaço de armazenamento usado por essa coluna com `JSON_STORAGE_SIZE()`, conforme mostrado aqui:

  ```sql
  mysql> CREATE TABLE jtable (jcol JSON);
  Query OK, 0 rows affected (0.42 sec)

  mysql> INSERT INTO jtable VALUES
      ->     ('{"a": 1000, "b": "wxyz", "c": "[1, 3, 5, 7]"}');
  Query OK, 1 row affected (0.04 sec)

  mysql> SELECT
      ->     jcol,
      ->     JSON_STORAGE_SIZE(jcol) AS Size
      -> FROM jtable;
  +-----------------------------------------------+------+
  | jcol                                          | Size |
  +-----------------------------------------------+------+
  | {"a": 1000, "b": "wxyz", "c": "[1, 3, 5, 7]"} |   47 |
  +-----------------------------------------------+------+
  1 row in set (0.00 sec)
  ```

  De acordo com o resultado de `JSON_STORAGE_SIZE()`, o documento JSON inserido na coluna ocupa 47 bytes. Após uma atualização, a função mostra o armazenamento usado pelo novo valor definido:

  ```sql
  mysql> UPDATE jtable
  mysql>     SET jcol = '{"a": 4.55, "b": "wxyz", "c": "[true, false]"}';
  Query OK, 1 row affected (0.04 sec)
  Rows matched: 1  Changed: 1  Warnings: 0

  mysql> SELECT
      ->     jcol,
      ->     JSON_STORAGE_SIZE(jcol) AS Size
      -> FROM jtable;
  +------------------------------------------------+------+
  | jcol                                           | Size |
  +------------------------------------------------+------+
  | {"a": 4.55, "b": "wxyz", "c": "[true, false]"} |   56 |
  +------------------------------------------------+------+
  1 row in set (0.00 sec)
  ```

  Essa função também mostra o espaço atualmente utilizado para armazenar um documento JSON em uma variável do usuário:

  ```sql
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

  Para um literal JSON, essa função também retorna o espaço de armazenamento atual usado, conforme mostrado aqui:

  ```sql
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

  Essa função foi adicionada no MySQL 5.7.22.
