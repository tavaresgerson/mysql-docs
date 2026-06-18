## 12.18 Funções Usadas com Identificadores Globais de Transação (GTIDs)

As funções descritas nesta seção são usadas com a Replication baseada em GTID. É importante ter em mente que todas essas funções aceitam representações de string de GTID Sets como argumentos. Como tal, os GTID Sets devem sempre ser citados (delimitados por aspas) ao serem usados com elas. Consulte GTID Sets para mais informações.

A união de dois GTID Sets é simplesmente a representação deles como strings, unidas por uma vírgula interposta. Em outras palavras, você pode definir uma função muito simples para obter a união de dois GTID Sets, similar à criada aqui:

```sql
CREATE FUNCTION GTID_UNION(g1 TEXT, g2 TEXT)
    RETURNS TEXT DETERMINISTIC
    RETURN CONCAT(g1,',',g2);
```

Para mais informações sobre GTIDs e como essas funções GTID são usadas na prática, consulte a Seção 16.1.3, “Replication com Identificadores Globais de Transação”.

**Table 12.24 Funções GTID**

<table frame="box" rules="all" summary="Uma referência que lista funções usadas com identificadores globais de transação (GTIDs)."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>GTID_SUBSET()</code></td> <td> Retorna true se todos os GTIDs no subset também estiverem no set; caso contrário, false. </td> </tr><tr><td><code>GTID_SUBTRACT()</code></td> <td> Retorna todos os GTIDs no set que não estão no subset. </td> </tr><tr><td><code>WAIT_FOR_EXECUTED_GTID_SET()</code></td> <td> Aguarda até que os GTIDs fornecidos tenham sido executados na replica. </td> </tr><tr><td><code>WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()</code></td> <td> Use <code>WAIT_FOR_EXECUTED_GTID_SET()</code>. </td> </tr></tbody></table>

* `GTID_SUBSET(set1,set2)`

  Dados dois sets de identificadores globais de transação *`set1`* e *`set2`*, retorna true se todos os GTIDs em *`set1`* também estiverem em *`set2`*. Caso contrário, retorna false.

  Os GTID Sets usados com esta função são representados como strings, conforme mostrado nos exemplos a seguir:

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

  Dados dois sets de identificadores globais de transação *`set1`* e *`set2`*, retorna apenas aqueles GTIDs de *`set1`* que não estão em *`set2`*.

  Todos os GTID Sets usados com esta função são representados como strings e devem ser citados (delimitados por aspas), conforme mostrado nestes exemplos:

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

  Subtrair um GTID Set de si mesmo produz um set vazio, conforme mostrado aqui:

  ```sql
  mysql> SELECT GTID_SUBTRACT('3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57',
      ->     '3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57')\G
  *************************** 1. row ***************************
  GTID_SUBTRACT('3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57',
      '3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57'):
  1 row in set (0.00 sec)
  ```

* `WAIT_FOR_EXECUTED_GTID_SET(gtid_set[, timeout])`

  Aguarda até que o servidor tenha aplicado todas as transações cujos identificadores globais de transação estão contidos em *`gtid_set`*; ou seja, até que a condição GTID_SUBSET(*`gtid_subset`*, `@@GLOBAL.gtid_executed`) seja verdadeira. Consulte a Seção 16.1.3.1, “Formato e Armazenamento de GTID” para uma definição de GTID Sets.

  Se um *`timeout`* for especificado, e *`timeout`* segundos decorrerem antes que todas as transações no GTID Set tenham sido aplicadas, a função para de aguardar. O *`timeout`* é opcional, e o *timeout* padrão é de 0 segundos, caso em que a função sempre aguarda até que todas as transações no GTID Set tenham sido aplicadas. O *`timeout`* deve ser maior ou igual a 0; a partir do MySQL 5.7.18, ao rodar em Strict SQL Mode, um valor *`timeout`* negativo é imediatamente rejeitado com um erro; caso contrário, a função retorna `NULL` e levanta um *warning*.

  `WAIT_FOR_EXECUTED_GTID_SET()` monitora todos os GTIDs que são aplicados no servidor, incluindo transações que chegam de todos os Replication Channels e clientes de usuário. Não leva em consideração se os Replication Channels foram iniciados ou interrompidos.

  Para mais informações, consulte a Seção 16.1.3, “Replication com Identificadores Globais de Transação”.

  GTID Sets usados com esta função são representados como strings e, portanto, devem ser citados (delimitados por aspas), conforme mostrado no exemplo a seguir:

  ```sql
  mysql> SELECT WAIT_FOR_EXECUTED_GTID_SET('3E11FA47-71CA-11E1-9E33-C80AA9429562:1-5');
          -> 0
  ```

  Para uma descrição da sintaxe de GTID Sets, consulte a Seção 16.1.3.1, “Formato e Armazenamento de GTID”.

  Para `WAIT_FOR_EXECUTED_GTID_SET()`, o valor de retorno é o estado da Query, onde 0 representa sucesso e 1 representa *timeout*. Quaisquer outras falhas geram um erro.

  `gtid_mode` não pode ser alterado para OFF enquanto qualquer cliente estiver usando esta função para aguardar que os GTIDs sejam aplicados.

* `WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS(gtid_set[, timeout][,channel])`

  `WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()` é semelhante a `WAIT_FOR_EXECUTED_GTID_SET()` no sentido de que aguarda até que todas as transações cujos identificadores globais de transação estão contidos em *`gtid_set`* tenham sido aplicadas, ou até que *`timeout`* segundos tenham decorrido, o que ocorrer primeiro. No entanto, `WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()` se aplica a um Replication Channel específico e só para depois que as transações tiverem sido aplicadas no Channel especificado, para o qual o aplicador (applier) deve estar em execução. Em contraste, `WAIT_FOR_EXECUTED_GTID_SET()` para após as transações terem sido aplicadas, independentemente de onde foram aplicadas (em qualquer Replication Channel ou qualquer cliente de usuário), e se quaisquer Replication Channels estão ou não em execução.

  O *`timeout`* deve ser maior ou igual a 0; a partir do MySQL 5.7.18, ao rodar em Strict SQL Mode, um valor *`timeout`* negativo é imediatamente rejeitado com um erro (`ER_WRONG_ARGUMENTS`); caso contrário, `WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()` retorna `NULL` e levanta um *warning*.

  A opção *`channel`* nomeia o Replication Channel ao qual a função se aplica. Se nenhum Channel for nomeado e nenhum Channel diferente do Replication Channel padrão existir, a função se aplica ao Replication Channel padrão. Se existirem múltiplos Replication Channels, você deve especificar um Channel, pois, caso contrário, não se sabe a qual Replication Channel a função se aplica. Consulte a Seção 16.2.2, “Replication Channels” para obter mais informações sobre Replication Channels.

  > **Note**
  >
  > Como `WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()` se aplica a um Replication Channel específico, se uma transação esperada chegar em um Replication Channel diferente ou de um cliente de usuário, por exemplo, em uma situação de Failover ou recuperação manual, a função pode travar indefinidamente se nenhum *timeout* for definido. Use `WAIT_FOR_EXECUTED_GTID_SET()` em vez disso para garantir o tratamento correto de transações nessas situações.

  GTID Sets usados com `WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()` são representados como strings e devem ser citados da mesma forma que para `WAIT_FOR_EXECUTED_GTID_SET()`. Para `WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()`, o valor de retorno da função é um número positivo arbitrário. Se a Replication baseada em GTID não estiver ativa (ou seja, se o valor da variável `gtid_mode` for OFF), então este valor é indefinido e `WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()` retorna NULL. Se a Replica não estiver rodando, a função também retorna NULL.

  `gtid_mode` não pode ser alterado para OFF enquanto qualquer cliente estiver usando esta função para aguardar que os GTIDs sejam aplicados.