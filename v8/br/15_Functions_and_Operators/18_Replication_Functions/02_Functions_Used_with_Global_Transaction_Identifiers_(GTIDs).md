### 14.18.2 Funções utilizadas com identificadores de transação global (GTIDs)

As funções descritas nesta seção são usadas com replicação baseada em GTID. É importante ter em mente que todas essas funções aceitam representações de cadeias de conjuntos de GTID como argumentos. Como tal, os conjuntos de GTID devem ser sempre citados quando usados com eles. Consulte Conjuntos de GTID para obter mais informações.

A união de dois conjuntos de GTID é simplesmente suas representações como strings, unidas por uma vírgula interposta. Em outras palavras, você pode definir uma função muito simples para obter a união de dois conjuntos de GTID, semelhante àquela criada aqui:

```
CREATE FUNCTION GTID_UNION(g1 TEXT, g2 TEXT)
    RETURNS TEXT DETERMINISTIC
    RETURN CONCAT(g1,',',g2);
```

Para obter mais informações sobre GTIDs e como essas funções de GTID são usadas na prática, consulte a Seção 19.1.3, “Replicação com Identificadores Globais de Transação”.

**Tabela 14.26 Funções GTID**

<table summary="Uma referência que lista as funções usadas com identificadores de transação global (GTIDs)."><thead><tr><th>Nome</th> <th>Descrição</th> <th>Desatualizado</th> </tr></thead><tbody><tr><th>[[<code>GTID_SUBSET()</code>]]</th> <td>Retorne verdadeiro se todos os GTIDs no subconjunto também estiverem no conjunto; caso contrário, falso.</td> <td></td> </tr><tr><th>[[<code>GTID_SUBTRACT()</code>]]</th> <td>Retorne todos os GTIDs em um conjunto que não estão em um subconjunto.</td> <td></td> </tr><tr><th>[[<code>WAIT_FOR_EXECUTED_GTID_SET()</code>]]</th> <td>Aguarde até que os GTIDs fornecidos tenham sido executados na replica.</td> <td></td> </tr><tr><th>[[<code>WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()</code>]]</th> <td>Use [[<code>WAIT_FOR_EXECUTED_GTID_SET()</code>]].</td> <td>8.0.18</td> </tr></tbody></table>

- `GTID_SUBSET(set1,set2)`

  Dado dois conjuntos de identificadores de transação global `set1` e `set2`, retorna verdadeiro se todos os GTIDs em `set1` também estiverem em `set2`. Retorna `NULL` se `set1` ou `set2` for `NULL`. Retorna falso caso contrário.

  Os conjuntos de GTID usados com essa função são representados como strings, conforme mostrado nos exemplos a seguir:

  ```
  mysql> SELECT GTID_SUBSET('3E11FA47-71CA-11E1-9E33-C80AA9429562:23',
      ->     '3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57')\G
  *************************** 1. row ***************************
  GTID_SUBSET('3E11FA47-71CA-11E1-9E33-C80AA9429562:23',
      '3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57'): 1
  1 row in set (0.00 sec)

  mysql> SELECT GTID_SUBSET('3E11FA47-71CA-11E1-9E33-C80AA9429562:23-25',
      ->     '3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57')\G
  *************************** 1. row ***************************
  GTID_SUBSET('3E11FA47-71CA-11E1-9E33-C80AA9429562:23-25',
      '3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57'): 1
  1 row in set (0.00 sec)

  mysql> SELECT GTID_SUBSET('3E11FA47-71CA-11E1-9E33-C80AA9429562:20-25',
      ->     '3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57')\G
  *************************** 1. row ***************************
  GTID_SUBSET('3E11FA47-71CA-11E1-9E33-C80AA9429562:20-25',
      '3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57'): 0
  1 row in set (0.00 sec)
  ```

- `GTID_SUBTRACT(set1,set2)`

  Dadas duas séries de identificadores de transações globais `set1` e `set2`, retorne apenas os GTIDs de `set1` que não estão em `set2`. Retorne `NULL` se `set1` ou `set2` for `NULL`.

  Todos os conjuntos de GTID usados com essa função são representados como strings e devem ser citados, conforme mostrado nesses exemplos:

  ```
  mysql> SELECT GTID_SUBTRACT('3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57',
      ->     '3E11FA47-71CA-11E1-9E33-C80AA9429562:21')\G
  *************************** 1. row ***************************
  GTID_SUBTRACT('3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57',
      '3E11FA47-71CA-11E1-9E33-C80AA9429562:21'): 3e11fa47-71ca-11e1-9e33-c80aa9429562:22-57
  1 row in set (0.00 sec)

  mysql> SELECT GTID_SUBTRACT('3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57',
      ->     '3E11FA47-71CA-11E1-9E33-C80AA9429562:20-25')\G
  *************************** 1. row ***************************
  GTID_SUBTRACT('3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57',
      '3E11FA47-71CA-11E1-9E33-C80AA9429562:20-25'): 3e11fa47-71ca-11e1-9e33-c80aa9429562:26-57
  1 row in set (0.00 sec)

  mysql> SELECT GTID_SUBTRACT('3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57',
      ->     '3E11FA47-71CA-11E1-9E33-C80AA9429562:23-24')\G
  *************************** 1. row ***************************
  GTID_SUBTRACT('3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57',
      '3E11FA47-71CA-11E1-9E33-C80AA9429562:23-24'): 3e11fa47-71ca-11e1-9e33-c80aa9429562:21-22:25-57
  1 row in set (0.01 sec)
  ```

  Subtrair um conjunto de GTID de si mesmo produz um conjunto vazio, como mostrado aqui:

  ```
  mysql> SELECT GTID_SUBTRACT('3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57',
      ->     '3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57')\G
  *************************** 1. row ***************************
  GTID_SUBTRACT('3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57',
      '3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57'):
  1 row in set (0.00 sec)
  ```

- `WAIT_FOR_EXECUTED_GTID_SET(gtid_set[, timeout])`

  Aguarde até que o servidor tenha aplicado todas as transações cujos identificadores de transação global estejam contidos em `gtid_set`; ou seja, até que a condição GTID\_SUBSET(`gtid_subset`, `@@GLOBAL.gtid_executed`) seja atendida. Consulte a Seção 19.1.3.1, “Formato e Armazenamento de GTID”, para uma definição dos conjuntos de GTID.

  Se um tempo de espera for especificado e `timeout` segundos se passarem antes que todas as transações no conjunto GTID sejam aplicadas, a função para de esperar. `timeout` é opcional e o tempo de espera padrão é de 0 segundos, caso em que a função sempre espera até que todas as transações no conjunto GTID sejam aplicadas. `timeout` deve ser maior ou igual a 0; ao ser executado no modo SQL rigoroso, um valor negativo de `timeout` é rejeitado imediatamente com um erro (`ER_WRONG_ARGUMENTS`); caso contrário, a função retorna `NULL` e emite uma mensagem de aviso.

  O `WAIT_FOR_EXECUTED_GTID_SET()` monitora todos os GTIDs aplicados no servidor, incluindo as transações que chegam de todos os canais de replicação e clientes de usuários. Ele não leva em consideração se os canais de replicação foram iniciados ou interrompidos.

  Para obter mais informações, consulte a Seção 19.1.3, “Replicação com Identificadores de Transação Global”.

  Os conjuntos de GTID usados com essa função são representados como strings e, portanto, devem ser entre aspas, conforme mostrado no exemplo a seguir:

  ```
  mysql> SELECT WAIT_FOR_EXECUTED_GTID_SET('3E11FA47-71CA-11E1-9E33-C80AA9429562:1-5');
          -> 0
  ```

  Para uma descrição da sintaxe dos conjuntos GTID, consulte a Seção 19.1.3.1, “Formato e Armazenamento do GTID”.

  Para `WAIT_FOR_EXECUTED_GTID_SET()`, o valor de retorno é o estado da consulta, onde 0 representa sucesso e 1 representa o tempo de espera. Qualquer outra falha gera um erro.

  `gtid_mode` não pode ser alterado para OFF enquanto qualquer cliente estiver usando essa função para aguardar a aplicação dos GTIDs.

- `WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS(gtid_set[, timeout][,channel])`

  `WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()` está desatualizado. Use `WAIT_FOR_EXECUTED_GTID_SET()` em vez disso, que funciona independentemente do canal de replicação ou do cliente do usuário através do qual as transações especificadas chegam ao servidor.
