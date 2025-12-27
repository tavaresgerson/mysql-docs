#### 19.1.3.1 Formato e Armazenamento do GTID

O identificador global de transação (GTID) é um identificador único criado e associado a cada transação comprometida no servidor de origem (a fonte). Esse identificador é único não apenas para o servidor em que foi gerado, mas também é único em todos os servidores de uma topologia de replicação dada.

A atribuição do GTID distingue entre as transações do cliente, que são comprometidas na fonte, e as transações replicadas, que são reproduzidas em uma replica. Quando uma transação do cliente é comprometida na fonte, ela recebe um novo GTID, desde que a transação tenha sido escrita no log binário. As transações do cliente são garantidas para ter GTIDs que aumentam de forma monótona sem lacunas entre os números gerados. Se uma transação do cliente não for escrita no log binário (por exemplo, porque a transação foi filtrada ou a transação era apenas de leitura), ela não recebe um GTID no servidor de origem.

As transações replicadas retêm o mesmo GTID que foi atribuído à transação no servidor de origem. O GTID está presente antes de a transação replicada começar a ser executada e é persistido mesmo se a transação replicada não for escrita no log binário na replica ou for filtrada na replica. A tabela de sistema `mysql.gtid_executed` é usada para preservar os GTIDs atribuídos a todas as transações aplicadas em um servidor MySQL, exceto aquelas que são armazenadas em um arquivo de log binário atualmente ativo.

A função de auto-pular para GTIDs significa que uma transação comprometida na fonte pode ser aplicada no máximo uma vez na replica, o que ajuda a garantir a consistência. Uma vez que uma transação com um GTID específico tenha sido comprometida em um servidor específico, qualquer tentativa de executar uma transação subsequente com o mesmo GTID é ignorada por esse servidor. Não é gerado nenhum erro e nenhuma declaração da transação é executada.

Se uma transação com um GTID específico tiver começado a ser executada em um servidor, mas ainda não tiver sido comprometida ou revertida, qualquer tentativa de iniciar uma transação concorrente no servidor com o mesmo GTID é bloqueada. O servidor não começa a executar a transação concorrente nem retorna o controle ao cliente. Uma vez que a primeira tentativa da transação seja comprometida ou revertida, as sessões concorrentes que estavam bloqueadas no mesmo GTID podem prosseguir. Se a primeira tentativa for revertida, uma sessão concorrente prossegue para tentar a transação, e quaisquer outras sessões concorrentes que estavam bloqueadas no mesmo GTID permanecem bloqueadas. Se a primeira tentativa for comprometida, todas as sessões concorrentes deixam de ser bloqueadas e o auto-pular todas as declarações da transação.

Um GTID é representado como um par de coordenadas, separado por um caractere de colon (`:`), como mostrado aqui:

```
GTID = source_id:transaction_id
```

O *`source_id`* identifica o servidor de origem. Normalmente, o *`server_uuid`* do provedor é usado para esse propósito. O *`transaction_id`* é um número de sequência determinado pela ordem em que a transação foi confirmada no provedor. Por exemplo, a primeira transação a ser confirmada tem o *`transaction_id`* `1`, e a décima transação a ser confirmada no mesmo servidor de origem recebe um *`transaction_id`* de `10`. Não é possível que uma transação tenha `0` como número de sequência em um GTID. Por exemplo, a vigésima terceira transação a ser confirmada originalmente no servidor com o UUID `3E11FA47-71CA-11E1-9E33-C80AA9429562` tem este GTID:

```
3E11FA47-71CA-11E1-9E33-C80AA9429562:23
```

O limite superior para números de sequência para GTIDs em uma instância do servidor é o número de valores não negativos para um inteiro de 64 bits assinado (`263 - 1`, ou `9223372036854775807`). Se o servidor ficar sem GTIDs, ele executa a ação especificada por `binlog_error_action`. Uma mensagem de aviso é emitida quando a instância do servidor está se aproximando do limite.

O MySQL 9.5 também suporta GTIDs marcados. Um GTID marcado consiste em três partes, separadas por caracteres de colon, como mostrado aqui:

```
GTID = source_id:tag:transaction_id
```

Neste caso, o *`source_id`* e *`transaction_id`* são definidos anteriormente. O *`tag`* é uma string definida pelo usuário usada para identificar um grupo específico de transações; veja a descrição da variável de sistema `gtid_next` para a sintaxe permitida. *Exemplo*: a dezoito nona transação a ser confirmada originalmente no servidor com o UUID `ed102faf-eb00-11eb-8f20-0c5415bfaa1d` e o tag `Domain_1` tem este GTID:

```
ed102faf-eb00-11eb-8f20-0c5415bfaa1d:Domain_1:117
```

O GTID de uma transação é exibido na saída do **mysqlbinlog** e é usado para identificar uma transação individual nas tabelas de status de replicação do Schema de Desempenho, por exemplo, `replication_applier_status_by_worker`. O valor armazenado pela variável de sistema `gtid_next` (`@@GLOBAL.gtid_next`) é um único GTID.

##### Conjuntos de GTID

Um conjunto de GTID é um conjunto que compreende um ou mais GTIDs únicos ou intervalos de GTIDs. Conjuntos de GTID são usados em um servidor MySQL de várias maneiras. Por exemplo, os valores armazenados pelas variáveis de sistema `gtid_executed` e `gtid_purged` são conjuntos de GTID. As opções de inicialização `UNTIL SQL_BEFORE_GTIDS` e `UNTIL SQL_AFTER_GTIDS` da opção `START REPLICA` podem ser usadas para fazer um processo de replicação transações apenas até o primeiro GTID em um conjunto de GTID, ou parar após o último GTID em um conjunto de GTID. As funções embutidas `GTID_SUBSET()` e `GTID_SUBTRACT()` requerem conjuntos de GTID como entrada.

Um intervalo de GTIDs originários do mesmo servidor pode ser reduzido a uma única expressão, como mostrado aqui:

```
3E11FA47-71CA-11E1-9E33-C80AA9429562:1-5
```

O exemplo acima representa as primeiras cinco transações originadas no servidor MySQL cujo `server_uuid` é `3E11FA47-71CA-11E1-9E33-C80AA9429562. Múltiplos GTIDs únicos ou intervalos de GTIDs originários do mesmo servidor também podem ser incluídos em uma única expressão, com os GTIDs ou intervalos separados por colchetes, como no exemplo a seguir:

```
3E11FA47-71CA-11E1-9E33-C80AA9429562:1-3:11:47-49
```

Um conjunto de GTID pode incluir qualquer combinação de GTIDs únicos e intervalos de GTIDs, e pode incluir GTIDs originários de servidores diferentes. Este exemplo mostra o conjunto de GTID armazenado na variável de sistema `gtid_executed` (`@@GLOBAL.gtid_executed`) de uma replica que aplicou transações de mais de uma fonte:

```
2174B383-5441-11E8-B90A-C80AA9429562:1-3, 24DA167-0C0C-11E8-8442-00059A3C7B00:1-19
```

Quando os conjuntos de GTID são retornados a partir de variáveis do servidor, os UUIDs estão em ordem alfabética e os intervalos numéricos são fundidos e em ordem crescente.

Ao construir um conjunto de GTID, uma etiqueta definida pelo usuário é tratada como parte do UUID. Isso significa que múltiplos GTIDs originados do mesmo servidor e com a mesma etiqueta podem ser incluídos em uma única expressão, como mostrado neste exemplo:

```
3E11FA47-71CA-11E1-9E33-C80AA9429562:Domain_1:1-3:11:47-49
```

GTIDs originados do mesmo servidor, mas com diferentes etiquetas, são tratados de maneira semelhante aos originados de servidores diferentes, como este:

```
3E11FA47-71CA-11E1-9E33-C80AA9429562:Domain_1:1-3:15-21, 3E11FA47-71CA-11E1-9E33-C80AA9429562:Domain_2:8-52
```

A sintaxe completa para um conjunto de GTID é a seguinte:

```
gtid_set:
    uuid_set [, uuid_set] ...
    | ''

uuid_set:
    uuid:[tag:]interval[:interval]...

uuid:
    hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh

h:
    [0-9|A-F]

tag:
    [a-z_][a-z0-9_]{0,31}

interval:
    m[-n]

    (m >= 1; n > m)
```

##### Tabela mysql.gtid_executed

Os GTIDs são armazenados em uma tabela chamada `gtid_executed`, no banco de dados `mysql`. Uma linha nesta tabela contém, para cada GTID ou conjunto de GTIDs que ele representa, o UUID do servidor de origem, a etiqueta definida pelo usuário (se houver) e os IDs de transação de início e fim do conjunto; para uma linha que referencia apenas um único GTID, esses dois últimos valores são os mesmos.

A tabela `mysql.gtid_executed` é criada (se ainda não existir) quando o MySQL Server é instalado ou atualizado, usando uma instrução `CREATE TABLE` semelhante à mostrada aqui:

```
CREATE TABLE gtid_executed (
  source_uuid CHAR(36) NOT NULL,
  interval_start BIGINT NOT NULL,
  interval_end BIGINT NOT NULL,
  gtid_tag CHAR(32) NOT NULL,
  PRIMARY KEY (source_uuid, gtid_tag, interval_start)
);
```

Aviso

Como com outras tabelas do sistema MySQL, não tente criar ou modificar esta tabela por conta própria.

A tabela `mysql.gtid_executed` é fornecida para uso interno pelo servidor MySQL. Ela permite que uma replica use GTIDs quando o registro binário está desativado na replica, e permite a retenção do estado do GTID quando os logs binários foram perdidos. Note que a tabela `mysql.gtid_executed` é limpa se você emitir `RESET BINARY LOGS AND GTIDS`.

Os GTIDs são armazenados na tabela `mysql.gtid_executed` apenas quando o `gtid_mode` está ativado ou em `ON_PERMISSIVE`. Se o registro binário estiver desativado (`log_bin` estiver em `OFF`) ou se o `log_replica_updates` estiver desativado, o servidor armazena o GTID pertencente a cada transação junto com a transação no buffer quando a transação é confirmada, e o thread de segundo plano adiciona periodicamente o conteúdo do buffer como uma ou mais entradas à tabela `mysql.gtid_executed`. Além disso, a tabela é comprimida periodicamente a uma taxa configurável pelo usuário, conforme descrito em mysql.gtid_executed Table Compression.

Se o registro binário estiver ativado (`log_bin` estiver em `ON`), apenas para o motor de armazenamento `InnoDB`, o servidor atualiza a tabela `mysql.gtid_executed` da mesma maneira que quando o registro binário ou o registro de atualização de replica estiver desativado, armazenando o GTID para cada transação no momento do commit da transação. Para outros motores de armazenamento, o servidor atualiza a tabela `mysql.gtid_executed` apenas quando o log binário for rotado ou o servidor for desligado. Nesses momentos, o servidor escreve GTIDs para todas as transações que foram escritas no log binário anterior na tabela `mysql.gtid_executed`.

Se a tabela `mysql.gtid_executed` não puder ser acessada para gravações e o arquivo de log binário for rotado por qualquer motivo que não seja o alcance do tamanho máximo do arquivo (`max_binlog_size`), o arquivo de log binário atual continua sendo usado. Uma mensagem de erro é retornada ao cliente que solicitou a rotação, e uma mensagem de aviso é registrada no servidor. Se a tabela `mysql.gtid_executed` não puder ser acessada para gravações e `max_binlog_size` for alcançado, o servidor responde de acordo com a configuração de `binlog_error_action`. Se `IGNORE_ERROR` for definido, um erro é registrado no servidor e o registro binário é interrompido, ou se `ABORT_SERVER` for definido, o servidor é desligado.

##### Compressão da Tabela `mysql.gtid\_executed`

Com o passar do tempo, a tabela `mysql.gtid_executed` pode ficar cheia de muitas linhas que se referem a GTIDs individuais que são gerados no mesmo servidor, têm a mesma tag de GTID (se houver) e cujos IDs de transação formam um intervalo, semelhante ao que é mostrado aqui:

```
+--------------------------------------+----------------+--------------+----------+
| source_uuid                          | interval_start | interval_end | gtid_tag |
|--------------------------------------+----------------+--------------|----------+
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 31             | 31           | Domain_1 |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 32             | 32           | Domain_1 |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 33             | 33           | Domain_1 |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 34             | 34           | Domain_1 |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 35             | 35           | Domain_1 |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 36             | 36           | Domain_2 |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 37             | 37           | Domain_2 |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 38             | 38           | Domain_2 |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 39             | 39           | Domain_2 |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 40             | 40           | Domain_1 |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 41             | 41           | Domain_1 |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 42             | 42           | Domain_1 |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 43             | 43           | Domain_1 |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 44             | 44           | Domain_2 |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 45             | 45           | Domain_2 |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 46             | 46           | Domain_2 |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 47             | 47           | Domain_1 |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 48             | 48           | Domain_1 |
...
```

Para economizar espaço, o servidor MySQL pode comprimir a tabela `mysql.gtid_executed` periodicamente, substituindo cada conjunto dessas linhas por uma única linha que abrange todo o intervalo dos identificadores de transação, assim:

```
+--------------------------------------+----------------+--------------+----------+
| source_uuid                          | interval_start | interval_end | gtid_tag |
|--------------------------------------+----------------+--------------|----------+
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 31             | 35           | Domain_1 |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 36             | 39           | Domain_2 |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 40             | 43           | Domain_1 |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 44             | 46           | Domain_2 |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 47             | 48           | Domain_1 |
...
```

O servidor pode realizar a compressão usando um fio de primeiro plano dedicado chamado `thread/sql/compress_gtid_table`. Esse fio não está listado na saída de `SHOW PROCESSLIST`, mas pode ser visto como uma linha na tabela `threads`, como mostrado aqui:

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

Quando o registro binário está habilitado no servidor, esse método de compressão não é utilizado e, em vez disso, a tabela `mysql.gtid_executed` é comprimida em cada rotação do log binário. No entanto, quando o registro binário está desativado no servidor, o thread `thread/sql/compress_gtid_table` dorme até que um número especificado de transações tenha sido executado, então acorda para realizar a compressão da tabela `mysql.gtid_executed`. Ele então dorme até que o mesmo número de transações tenha ocorrido, então acorda para realizar a compressão novamente, repetindo esse loop indefinidamente. O número de transações que transcorrem antes da tabela ser comprimida, e, portanto, a taxa de compressão, é controlado pelo valor da variável de sistema `gtid_executed_compression_period`. Definir esse valor para 0 significa que o thread nunca acorda, o que significa que esse método de compressão explícito não é utilizado. Em vez disso, a compressão ocorre implicitamente conforme necessário.
As transações `InnoDB` são escritas na tabela `mysql.gtid_executed` por um processo separado do usado para transações que envolvem outros motores de armazenamento além do `InnoDB`. Esse processo é controlado por um thread diferente, `innodb/clone_gtid_thread`. Esse thread persistente GTID coleta GTIDs em grupos, os descarrega para a tabela `mysql.gtid_executed` e, em seguida, comprime a tabela. Se o servidor tiver uma mistura de transações `InnoDB` e não `InnoDB`, que são escritas na tabela `mysql.gtid_executed` individualmente, a compressão realizada pelo thread `compress_gtid_table` interfere no trabalho do thread persistente GTID e pode desacelerá-lo significativamente. Por essa razão, recomenda-se que você defina `gtid_executed_compression_period` para 0, para que o thread `compress_gtid_table` nunca seja ativado.

O valor padrão para `gtid_executed_compression_period` é 0, e todas as transações, independentemente do motor de armazenamento, são escritas na tabela `mysql.gtid_executed` pelo fio persistente GTID.

Quando uma instância do servidor é iniciada, se `gtid_executed_compression_period` for definido para um valor diferente de 0 e o fio `thread/sql/compress_gtid_table` for iniciado, na maioria das configurações do servidor, a compressão explícita é realizada para a tabela `mysql.gtid_executed`. A compressão é acionada pelo lançamento do fio.