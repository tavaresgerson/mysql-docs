#### 19.1.3.1 Formato e Armazenamento do GTID

Um identificador de transação global (GTID) é um identificador único criado e associado a cada transação realizada no servidor de origem (a fonte). Esse identificador é único não apenas para o servidor em que foi gerado, mas também é único em todos os servidores de uma determinada topologia de replicação.

A atribuição de GTID distingue entre as transações do cliente, que são comprometidas na fonte, e as transações replicadas, que são reproduzidas em uma réplica. Quando uma transação do cliente é comprometida na fonte, ela recebe um novo GTID, desde que a transação tenha sido escrita no log binário. As transações do cliente são garantidas para ter GTIDs que aumentam de forma monótona sem lacunas entre os números gerados. Se uma transação do cliente não for escrita no log binário (por exemplo, porque a transação foi filtrada ou a transação era apenas de leitura), ela não recebe um GTID no servidor de origem.

As transações replicadas retêm o mesmo GTID que foi atribuído à transação no servidor de origem. O GTID está presente antes de a transação replicada começar a ser executada e é persistido mesmo se a transação replicada não for escrita no log binário na replica ou for filtrada na replica. A tabela de sistema MySQL `mysql.gtid_executed` é usada para preservar os GTIDs atribuídos a todas as transações aplicadas em um servidor MySQL, exceto aquelas que estão armazenadas em um arquivo de log binário atualmente ativo.

A função de desvio automático para GTIDs significa que uma transação comprometida na fonte pode ser aplicada no máximo uma vez na replica, o que ajuda a garantir a consistência. Uma vez que uma transação com um GTID específico tenha sido comprometida em um servidor específico, qualquer tentativa de executar uma transação subsequente com o mesmo GTID é ignorada por esse servidor. Nenhum erro é gerado e nenhuma declaração na transação é executada.

Se uma transação com um GTID específico já começou a ser executada em um servidor, mas ainda não foi confirmada ou revertida, qualquer tentativa de iniciar uma transação concorrente no servidor com o mesmo GTID é bloqueada. O servidor não começa a executar a transação concorrente nem retorna o controle ao cliente. Uma vez que a primeira tentativa da transação é confirmada ou revertida, as sessões concorrentes que estavam bloqueadas no mesmo GTID podem prosseguir. Se a primeira tentativa for revertida, uma sessão concorrente prossegue para tentar a transação, e quaisquer outras sessões concorrentes que estavam bloqueadas no mesmo GTID permanecem bloqueadas. Se a primeira tentativa for confirmada, todas as sessões concorrentes deixam de ser bloqueadas e ignoram automaticamente todas as instruções da transação.

Um GTID é representado como um par de coordenadas, separados por um caractere de colon (`:`), como mostrado aqui:

```
GTID = source_id:transaction_id
```

O `source_id` identifica o servidor de origem. Normalmente, o `server_uuid` da fonte é usado para esse propósito. O \*`transaction_id` é um número de sequência determinado pela ordem em que a transação foi comprometida no servidor de origem. Por exemplo, a primeira transação a ser comprometida tem `1` como seu `transaction_id`, e a décima transação a ser comprometida no mesmo servidor de origem é atribuída um `transaction_id` de `10`. Não é possível que uma transação tenha `0` como número de sequência em um GTID. Por exemplo, a vigésima terceira transação a ser comprometida originalmente no servidor com o UUID `3E11FA47-71CA-11E1-9E33-C80AA9429562` tem este GTID:

```
3E11FA47-71CA-11E1-9E33-C80AA9429562:23
```

O limite superior para os números de sequência dos GTIDs em uma instância do servidor é o número de valores não negativos para um inteiro de 64 bits assinado (2 elevado à potência de 63 menos 1, ou 9.223.372.036.854.775.807). Se o servidor ficar sem GTIDs, ele executa a ação especificada por `binlog_error_action`. A partir do MySQL 8.0.23, uma mensagem de aviso é emitida quando a instância do servidor está se aproximando do limite.

O GTID de uma transação é exibido na saída do **mysqlbinlog** e é usado para identificar uma transação individual nas tabelas de status de replicação do Gerenciador de Desempenho, por exemplo, `replication_applier_status_by_worker`. O valor armazenado pela variável de sistema `gtid_next` (`@@GLOBAL.gtid_next`) é um único GTID.

##### Kits GTID

Um conjunto de GTID é um conjunto que compreende um ou mais GTIDs individuais ou intervalos de GTIDs. Conjuntos de GTID são usados em um servidor MySQL de várias maneiras. Por exemplo, os valores armazenados pelas variáveis de sistema `gtid_executed` e `gtid_purged` são conjuntos de GTID. As cláusulas `START REPLICA` (ou antes do MySQL 8.0.22, `START SLAVE`) `UNTIL SQL_BEFORE_GTIDS` e `UNTIL SQL_AFTER_GTIDS` podem ser usadas para fazer com que um processo de replicação transações apenas até o primeiro GTID em um conjunto de GTID, ou parar após o último GTID em um conjunto de GTID. As funções internas `GTID_SUBSET()` e `GTID_SUBTRACT()` requerem conjuntos de GTID como entrada.

Uma série de GTIDs provenientes do mesmo servidor pode ser reduzida a uma única expressão, como mostrado aqui:

```
3E11FA47-71CA-11E1-9E33-C80AA9429562:1-5
```

O exemplo acima representa as primeiras cinco transações originadas no servidor MySQL cujo `server_uuid` é `3E11FA47-71CA-11E1-9E33-C80AA9429562`. Vários GTIDs únicos ou intervalos de GTIDs originados do mesmo servidor também podem ser incluídos em uma única expressão, com os GTIDs ou intervalos separados por colchetes, como no exemplo a seguir:

```
3E11FA47-71CA-11E1-9E33-C80AA9429562:1-3:11:47-49
```

Um conjunto de GTID pode incluir qualquer combinação de GTID individuais e intervalos de GTID, e pode incluir GTID provenientes de diferentes servidores. Este exemplo mostra o conjunto de GTID armazenado na variável de sistema `gtid_executed` (`@@GLOBAL.gtid_executed`) de uma replica que aplicou transações de mais de uma fonte:

```
2174B383-5441-11E8-B90A-C80AA9429562:1-3, 24DA167-0C0C-11E8-8442-00059A3C7B00:1-19
```

Quando os conjuntos GTID são retornados a partir de variáveis do servidor, os UUIDs estão em ordem alfabética e os intervalos numéricos são combinados e em ordem crescente.

A sintaxe para um conjunto de GTID é a seguinte:

```
gtid_set:
    uuid_set [, uuid_set] ...
    | ''

uuid_set:
    uuid:interval[:interval]...

uuid:
    hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh

h:
    [0-9|A-F]

interval:
    n[-n]

    (n >= 1)
```

##### Tabela mysql.gtid\_executed

Os GTIDs são armazenados em uma tabela chamada `gtid_executed`, no banco de dados `mysql`. Uma linha nesta tabela contém, para cada GTID ou conjunto de GTIDs que ele representa, o UUID do servidor de origem e os IDs de transação de início e fim do conjunto; para uma linha que referencia apenas um único GTID, esses dois últimos valores são os mesmos.

A tabela `mysql.gtid_executed` é criada (se ainda não existir) quando o MySQL Server é instalado ou atualizado, usando uma instrução `CREATE TABLE` semelhante à mostrada aqui:

```
CREATE TABLE gtid_executed (
    source_uuid CHAR(36) NOT NULL,
    interval_start BIGINT(20) NOT NULL,
    interval_end BIGINT(20) NOT NULL,
    PRIMARY KEY (source_uuid, interval_start)
)
```

Aviso

Assim como outras tabelas do sistema MySQL, não tente criar ou modificar essa tabela sozinho.

A tabela `mysql.gtid_executed` é fornecida para uso interno pelo servidor MySQL. Ela permite que uma replica use GTIDs quando o registro binário está desativado na replica, e permite a retenção do estado do GTID quando os registros binários foram perdidos. Observe que a tabela `mysql.gtid_executed` é limpa se você emitir `RESET MASTER`.

Os GTIDs são armazenados na tabela `mysql.gtid_executed` apenas quando `gtid_mode` é `ON` ou `ON_PERMISSIVE`. Se o registro binário estiver desativado (`log_bin` é `OFF`), ou se `log_replica_updates` ou `log_slave_updates` estiver desativado, o servidor armazena o GTID pertencente a cada transação junto com a transação no buffer quando a transação é confirmada, e o thread de segundo plano adiciona periodicamente o conteúdo do buffer como uma ou mais entradas na tabela `mysql.gtid_executed`. Além disso, a tabela é comprimida periodicamente a uma taxa configurável pelo usuário, conforme descrito em Compressão de Tabela mysql.gtid\_executed.

Se o registro binário estiver habilitado (`log_bin` é `ON`), a partir do MySQL 8.0.17, apenas para o mecanismo de armazenamento `InnoDB`, o servidor atualiza a tabela `mysql.gtid_executed` da mesma maneira que quando o registro binário ou o registro de atualização de réplicas está desativado, armazenando o GTID para cada transação no momento do commit da transação. No entanto, em versões anteriores ao MySQL 8.0.17 e para outros mecanismos de armazenamento, o servidor atualiza apenas a tabela `mysql.gtid_executed` quando o log binário é rotado ou o servidor é desligado. Nesses momentos, o servidor escreve GTIDs para todas as transações que foram escritas no log binário anterior na tabela `mysql.gtid_executed`. Esta situação se aplica a uma fonte anterior ao MySQL 8.0.17, ou a uma réplica anterior ao MySQL 8.0.17 onde o registro binário está habilitado, ou com mecanismos de armazenamento diferentes de `InnoDB`, tem as seguintes consequências:

- Em caso de parada inesperada do servidor, o conjunto de GTIDs do arquivo de log binário atual não é salvo na tabela `mysql.gtid_executed`. Esses GTIDs são adicionados à tabela a partir do arquivo de log binário durante a recuperação para que a replicação possa continuar. A exceção a isso é se você desabilitar o registro binário quando o servidor for reiniciado (usando `--skip-log-bin` ou `--disable-log-bin`). Nesse caso, o servidor não pode acessar o arquivo de log binário para recuperar os GTIDs, então a replicação não pode ser iniciada.

- A tabela `mysql.gtid_executed` não contém um registro completo dos GTIDs para todas as transações executadas. Essas informações são fornecidas pelo valor global da variável de sistema `gtid_executed`. Em versões anteriores ao MySQL 8.0.17 e com motores de armazenamento diferentes de `InnoDB`, sempre use `@@GLOBAL.gtid_executed`, que é atualizado após cada commit, para representar o estado do GTID para o servidor MySQL, em vez de consultar a tabela `mysql.gtid_executed`.

O servidor MySQL pode gravar na tabela `mysql.gtid_executed` mesmo quando o servidor estiver no modo de leitura somente ou super leitura somente. Em versões anteriores ao MySQL 8.0.17, isso garante que o arquivo de log binário ainda possa ser rotado nesses modos. Se a tabela `mysql.gtid_executed` não puder ser acessada para gravações e o arquivo de log binário for rotado por qualquer motivo que não seja o alcance do tamanho máximo do arquivo (`max_binlog_size`), o arquivo de log binário atual continua sendo usado. Uma mensagem de erro é retornada ao cliente que solicitou a rotação, e uma mensagem de aviso é registrada no servidor. Se a tabela `mysql.gtid_executed` não puder ser acessada para gravações e `max_binlog_size` for alcançado, o servidor responde de acordo com sua configuração `binlog_error_action`. Se `IGNORE_ERROR` for definido, um erro é registrado no servidor e o registro binário é interrompido, ou se `ABORT_SERVER` for definido, o servidor é desligado.

##### Compressão da tabela mysql.gtid\_executed

Com o passar do tempo, a tabela `mysql.gtid_executed` pode ficar cheia de muitas linhas que se referem a GTIDs individuais que surgem no mesmo servidor e cujos IDs de transação formam uma faixa, semelhante ao que é mostrado aqui:

```
+--------------------------------------+----------------+--------------+
| source_uuid                          | interval_start | interval_end |
|--------------------------------------+----------------+--------------|
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 37             | 37           |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 38             | 38           |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 39             | 39           |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 40             | 40           |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 41             | 41           |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 42             | 42           |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 43             | 43           |
...
```

Para economizar espaço, o servidor MySQL pode comprimir a tabela `mysql.gtid_executed` periodicamente, substituindo cada conjunto dessas linhas por uma única linha que abrange todo o intervalo dos identificadores de transação, da seguinte forma:

```
+--------------------------------------+----------------+--------------+
| source_uuid                          | interval_start | interval_end |
|--------------------------------------+----------------+--------------|
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 37             | 43           |
...
```

O servidor pode realizar a compressão usando um fio de primeiro plano dedicado chamado `thread/sql/compress_gtid_table`. Esse fio não está listado na saída de `SHOW PROCESSLIST`, mas pode ser visto como uma linha na tabela `threads`, conforme mostrado aqui:

```
mysql> SELECT * FROM performance_schema.threads WHERE NAME LIKE '%gtid%'\G
*************************** 1. row ***************************
          THREAD_ID: 26
               NAME: thread/sql/compress_gtid_table
               TYPE: FOREGROUND
     PROCESSLIST_ID: 1
   PROCESSLIST_USER: NULL
   PROCESSLIST_HOST: NULL
     PROCESSLIST_DB: NULL
PROCESSLIST_COMMAND: Daemon
   PROCESSLIST_TIME: 1509
  PROCESSLIST_STATE: Suspending
   PROCESSLIST_INFO: NULL
   PARENT_THREAD_ID: 1
               ROLE: NULL
       INSTRUMENTED: YES
            HISTORY: YES
    CONNECTION_TYPE: NULL
       THREAD_OS_ID: 18677
```

Quando o registro binário está habilitado no servidor, esse método de compressão não é utilizado, e, em vez disso, a tabela `mysql.gtid_executed` é comprimida em cada rotação do registro binário. No entanto, quando o registro binário está desativado no servidor, o thread `thread/sql/compress_gtid_table` dorme até que um número especificado de transações tenha sido executado, e então acorda para realizar a compressão da tabela `mysql.gtid_executed`. Ele dorme novamente até que o mesmo número de transações tenha ocorrido, e então acorda para realizar a compressão novamente, repetindo esse loop indefinidamente. O número de transações que transcorrem antes da tabela ser comprimida, e, portanto, a taxa de compressão, é controlado pelo valor da variável de sistema `gtid_executed_compression_period`. Definir esse valor para 0 significa que o thread nunca acorda, o que significa que esse método de compressão explícito não é utilizado. Em vez disso, a compressão ocorre implicitamente conforme necessário.

A partir do MySQL 8.0.17, as transações `InnoDB` são escritas na tabela `mysql.gtid_executed` por um processo separado para as transações não `InnoDB`. Esse processo é controlado por um fio de thread diferente, `innodb/clone_gtid_thread`. Esse fio de persistência de GTID coleta GTIDs em grupos, os descarrega na tabela `mysql.gtid_executed` e, em seguida, comprime a tabela. Se o servidor tiver uma mistura de transações `InnoDB` e não `InnoDB`, que são escritas na tabela `mysql.gtid_executed` individualmente, a compressão realizada pelo fio de thread `compress_gtid_table` interfere no trabalho do fio de thread de persistência de GTID e pode desacelerá-lo significativamente. Por essa razão, a partir dessa versão, recomenda-se que você defina `gtid_executed_compression_period` para 0, para que o fio de thread `compress_gtid_table` nunca seja ativado.

A partir do MySQL 8.0.23, o valor padrão do `gtid_executed_compression_period` é 0, e tanto as transações `InnoDB` quanto as não `InnoDB` são escritas na tabela `mysql.gtid_executed` pelo fio persistente GTID.

Para versões anteriores ao MySQL 8.0.17, o valor padrão de 1000 para `gtid_executed_compression_period` pode ser usado, o que significa que a compressão da tabela é realizada após cada 1000 transações. Você também pode escolher um valor alternativo. Nesses lançamentos, se você definir um valor de 0 e o registro binário estiver desativado, a compressão explícita não será realizada na tabela `mysql.gtid_executed`, e você deve estar preparado para um aumento potencialmente grande na quantidade de espaço em disco que pode ser necessário para a tabela se você fizer isso.

Quando uma instância do servidor é iniciada, se `gtid_executed_compression_period` estiver definido para um valor diferente de zero e a thread `thread/sql/compress_gtid_table` for lançada, na maioria das configurações do servidor, a compressão explícita é realizada para a tabela `mysql.gtid_executed`. Em versões anteriores ao MySQL 8.0.17, quando o registro binário está habilitado, a compressão é acionada pelo fato do log binário ser rotado no início. Em versões a partir do MySQL 8.0.20, a compressão é acionada pelo lançamento da thread. Nas versões intermediárias, a compressão não ocorre no início.
