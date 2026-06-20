## 12.18 Funções utilizadas com Identificadores de Transação Global (GTIDs)

As funções descritas nesta seção são usadas com replicação baseada em GTID. É importante ter em mente que todas essas funções aceitam representações de cadeia de conjuntos de GTID como argumentos. Como tal, os conjuntos de GTID devem ser sempre citados quando usados com eles. Consulte Conjuntos de GTID para obter mais informações.

A união de dois conjuntos de GTID é simplesmente suas representações como strings, unidas com uma vírgula interposta. Em outras palavras, você pode definir uma função muito simples para obter a união de dois conjuntos de GTID, semelhante àquela criada aqui:

```sql
CREATE FUNCTION GTID_UNION(g1 TEXT, g2 TEXT)
    RETURNS TEXT DETERMINISTIC
    RETURN CONCAT(g1,',',g2);
```

Para mais informações sobre GTIDs e como essas funções GTID são usadas na prática, consulte a Seção 16.1.3, “Replicação com Identificadores de Transação Global”.

**Tabela 12.24 Funções GTID**

<table frame="box" rules="all" summary="A reference that lists functions used with global transaction identifiers (GTIDs)."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Name</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>GTID_SUBSET()</code></td> <td>Retorne verdadeiro se todos os GTIDs no subconjunto também estiverem no conjunto; caso contrário, falso.</td> </tr><tr><td><code>GTID_SUBTRACT()</code></td> <td>Retorne todos os GTIDs no conjunto que não estão no subconjunto.</td> </tr><tr><td><code>WAIT_FOR_EXECUTED_GTID_SET()</code></td> <td>Aguarde até que os GTIDs fornecidos tenham sido executados na replica.</td> </tr><tr><td><code>WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()</code></td> <td>Uso<code>WAIT_FOR_EXECUTED_GTID_SET()</code>. </td> </tr></tbody></table>

* `GTID_SUBSET(set1,set2)`

Dado dois conjuntos de identificadores de transação global *`set1`* e *`set2`*, retorna verdadeiro se todos os GTIDs em *`set1`* também estiverem em *`set2`*. De outra forma, retorna falso.

Os conjuntos de GTID utilizados com esta função são representados como strings, conforme mostrado nos exemplos a seguir:

  ```sql
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

* `GTID_SUBTRACT(set1,set2)`

Dado dois conjuntos de identificadores de transação global *`set1`* e *`set2`*, retorne apenas os GTIDs de *`set1`* que não estão em *`set2`*.

Todos os conjuntos GTID usados com essa função são representados como strings e devem ser citados, conforme mostrado nesses exemplos:

  ```sql
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

  ```sql
  mysql> SELECT GTID_SUBTRACT('3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57',
      ->     '3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57')\G
  *************************** 1. row ***************************
  GTID_SUBTRACT('3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57',
      '3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57'):
  1 row in set (0.00 sec)
  ```

* `WAIT_FOR_EXECUTED_GTID_SET(gtid_set[, timeout])`(gtid-functions.html#function_wait-for-executed-gtid-set)

Aguarde até que o servidor tenha aplicado todas as transações cujos identificadores de transação global estejam contidos em *`gtid_set`*; ou seja, até que a condição GTID_SUBSET(*`gtid_subset`*, `@@GLOBAL.gtid_executed`) seja atendida. Consulte a Seção 16.1.3.1, “Formato e Armazenamento do GTID”, para uma definição dos conjuntos GTID.

Se um tempo de espera for especificado e *`timeout`* segundos se passarem antes que todas as transações no conjunto GTID tenham sido aplicadas, a função para de esperar. *`timeout`* é opcional e o tempo de espera padrão é 0 segundos, caso em que a função sempre espera até que todas as transações no conjunto GTID tenham sido aplicadas. *`timeout`* deve ser maior ou igual a 0; a partir do MySQL 5.7.18, quando executado no modo SQL rigoroso, um valor negativo de *`timeout`* é imediatamente rejeitado com um erro; caso contrário, a função retorna `NULL`, e emite uma advertência.

`WAIT_FOR_EXECUTED_GTID_SET()` monitora todos os GTIDs que são aplicados no servidor, incluindo as transações que chegam de todos os canais de replicação e clientes de usuários. Não leva em conta se os canais de replicação foram iniciados ou interrompidos.

Para mais informações, consulte a Seção 16.1.3, “Replicação com Identificadores de Transação Global”.

Os conjuntos de GTID usados com essa função são representados como strings e, portanto, devem ser citados como mostrado no exemplo a seguir:

  ```sql
  mysql> SELECT WAIT_FOR_EXECUTED_GTID_SET('3E11FA47-71CA-11E1-9E33-C80AA9429562:1-5');
          -> 0
  ```

Para uma descrição da sintaxe dos conjuntos GTID, consulte a Seção 16.1.3.1, “Formato e Armazenamento do GTID”.

Para `WAIT_FOR_EXECUTED_GTID_SET()`, o valor de retorno é o estado da consulta, onde 0 representa sucesso e 1 representa o tempo de espera. Qualquer outra falha gera um erro.

`gtid_mode` não pode ser alterado para OFF enquanto qualquer cliente estiver usando essa função para esperar que os GTIDs sejam aplicados.

* `WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS(gtid_set[, timeout][,channel])`(gtid-functions.html#function_wait-until-sql-thread-after-gtids)

`WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()` é semelhante a `WAIT_FOR_EXECUTED_GTID_SET()`, pois aguarda até que todas as transações cujos identificadores de transação global estejam contidos em *`gtid_set`* tenham sido aplicados, ou até que *`timeout`* segundos tenham decorrido, o que ocorrer primeiro. No entanto, `WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()` aplica-se a um canal de replicação específico e para de aplicar apenas após as transações terem sido aplicadas no canal especificado, para o qual o aplicante deve estar em execução. Em contraste, `WAIT_FOR_EXECUTED_GTID_SET()` para após as transações terem sido aplicadas, independentemente de onde foram aplicadas (em qualquer canal de replicação ou qualquer cliente do usuário), e se algum canal de replicação está em execução ou

*`timeout`* deve ser maior ou igual a 0; a partir do MySQL 5.7.18, quando executado no modo SQL rigoroso, um valor negativo de *`timeout`* é imediatamente rejeitado com um erro (`ER_WRONG_ARGUMENTS`); caso contrário, `WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()` retorna `NULL` e emite uma advertência.

As opções *`channel`* indicam o canal de replicação ao qual a função se aplica. Se não houver um canal nomeado e não houver outros canais além do canal de replicação padrão, a função se aplica ao canal de replicação padrão. Se houver vários canais de replicação, você deve especificar um canal, pois não se sabe qual canal de replicação a função se aplica. Consulte a Seção 16.2.2, “Canais de Replicação”, para obter mais informações sobre os canais de replicação.

Nota

Porque `WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()` se aplica a um canal de replicação específico, se uma transação esperada chegar em um canal de replicação diferente ou de um cliente de usuário, por exemplo, em uma situação de failover ou recuperação manual, a função pode ficar indefinidamente suspensa se nenhum tempo limite for definido. Use `WAIT_FOR_EXECUTED_GTID_SET()` em vez disso para garantir o tratamento correto das transações nessas situações.

Os conjuntos de GTID usados com `WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()` são representados como strings e devem ser citados da mesma maneira que para `WAIT_FOR_EXECUTED_GTID_SET()`. Para `WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()`, o valor de retorno da função é um número positivo arbitrário. Se a replicação baseada em GTID não estiver ativa (ou seja, se o valor da variável `gtid_mode` for OFF), então esse valor é indefinido e `WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()` retorna NULL. Se a replica não estiver em execução, a função também retorna NULL.

`gtid_mode` não pode ser alterado para OFF enquanto qualquer cliente estiver usando essa função para esperar que os GTIDs sejam aplicados.