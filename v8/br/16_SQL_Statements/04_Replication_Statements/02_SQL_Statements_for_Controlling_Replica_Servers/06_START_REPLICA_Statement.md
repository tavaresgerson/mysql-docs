#### 15.4.2.6 Declaração START REPLICA

```
START REPLICA [thread_types] [until_option] [connection_options] [channel_option]

thread_types:
    [thread_type [, thread_type] ... ]

thread_type:
    IO_THREAD | SQL_THREAD

until_option:
    UNTIL {   {SQL_BEFORE_GTIDS | SQL_AFTER_GTIDS} = gtid_set
          |   MASTER_LOG_FILE = 'log_name', MASTER_LOG_POS = log_pos
          |   SOURCE_LOG_FILE = 'log_name', SOURCE_LOG_POS = log_pos
          |   RELAY_LOG_FILE = 'log_name', RELAY_LOG_POS = log_pos
          |   SQL_AFTER_MTS_GAPS  }

connection_options:
    [USER='user_name'] [PASSWORD='user_pass'] [DEFAULT_AUTH='plugin_name'] [PLUGIN_DIR='plugin_dir']


channel_option:
    FOR CHANNEL channel

gtid_set:
    uuid_set [, uuid_set] ...
    | ''

uuid_set:
    uuid:interval[:interval]...

uuid:
    hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh

h:
    [0-9,A-F]

interval:
    n[-n]

    (n >= 1)
```

`START REPLICA` inicia os threads de replicação, juntos ou separadamente. A partir do MySQL 8.0.22, use `START REPLICA` no lugar de `START SLAVE`, que é desatualizado a partir dessa versão. Em versões anteriores ao MySQL 8.0.22, use `START SLAVE`.

`START REPLICA` requer o privilégio `REPLICATION_SLAVE_ADMIN` (ou o privilégio desatualizado `SUPER`). `START REPLICA` causa um commit implícito de uma transação em andamento. Veja a Seção 15.3.3, “Instruções que causam um commit implícito”.

Para as opções de tipo de fio, você pode especificar `IO_THREAD`, `SQL_THREAD`, ambos ou nenhum deles. Somente os fios que estão sendo iniciados são afetados pela declaração.

- `START REPLICA` sem opções de tipo de fio inicia todos os fios de replicação, assim como `START REPLICA` com ambas as opções de tipo de fio.

- `IO_THREAD` inicia a thread do receptor de replicação, que lê os eventos do servidor de origem e os armazena no log de retransmissão.

- `SQL_THREAD` inicia o fio do aplicador de replicação, que lê eventos do log de retransmissão e os executa. Uma replica multithread (com `replica_parallel_workers` ou `slave_parallel_workers` > 0) aplica transações usando um fio de coordenador e vários fios de aplicador, e `SQL_THREAD` inicia todos esses fios.

Importante

`START REPLICA` envia um reconhecimento ao usuário após todos os threads de replicação terem sido iniciados. No entanto, o thread receptor de replicação ainda pode não ter se conectado ao ponto de origem com sucesso, ou um thread aplicante pode parar ao aplicar um evento logo após o início. `START REPLICA` não continua a monitorar os threads após eles terem sido iniciados, portanto, não avisa se eles pararem ou não conseguirem se conectar posteriormente. Você deve verificar o log de erro da replica para mensagens de erro geradas pelos threads de replicação, ou verificar se eles estão sendo executados satisfatoriamente com `SHOW REPLICA STATUS`. Uma declaração `START REPLICA` bem-sucedida faz com que `SHOW REPLICA STATUS` mostre `Replica_SQL_Running=Yes`, mas pode ou não mostrar `Replica_IO_Running=Yes`, porque `Replica_IO_Running=Yes` só é mostrado se o thread receptor estiver em execução e conectado. Para mais informações, consulte a Seção 19.1.7.1, “Verificação do Status da Replicação”.

A cláusula opcional `FOR CHANNEL channel` permite que você nomeie qual canal de replicação a declaração se aplica. A cláusula `FOR CHANNEL channel` aplica a declaração `START REPLICA` a um canal de replicação específico. Se nenhuma cláusula for nomeada e não houver canais extras, a declaração se aplica ao canal padrão. Se uma declaração `START REPLICA` não tiver um canal definido ao usar múltiplos canais, essa declaração inicia os threads especificados para todos os canais. Consulte a Seção 19.2.2, “Canais de Replicação”, para obter mais informações.

Os canais de replicação para a Replicação em Grupo (`group_replication_applier` e `group_replication_recovery`) são gerenciados automaticamente pela instância do servidor. O canal `START REPLICA` não pode ser usado com o canal `group_replication_recovery`, e deve ser usado apenas com o canal `group_replication_applier` quando a Replicação em Grupo não estiver em execução. O canal `group_replication_applier` tem apenas um fio de aplicador e não tem fio de receptor, portanto, pode ser iniciado se necessário usando a opção `SQL_THREAD` sem a opção `IO_THREAD`.

O `START REPLICA` suporta a autenticação de usuário e senha intercambiável (consulte a Seção 8.2.17, “Autenticação Intercambiável”) com as opções `USER`, `PASSWORD`, `DEFAULT_AUTH` e `PLUGIN_DIR`, conforme descrito na lista a seguir. Ao usar essas opções, você deve iniciar o thread do receptor (opção `IO_THREAD`) ou todos os threads de replicação; você não pode iniciar o thread do aplicável de replicação (opção `SQL_THREAD`) sozinho.

`USER` :   O nome do usuário para a conta. Você deve definir isso se `PASSWORD` for usado. A opção não pode ser definida para uma string vazia ou nula.

`PASSWORD` :   A senha da conta de usuário nomeado.

`DEFAULT_AUTH` :   O nome do plugin de autenticação. O padrão é a autenticação nativa do MySQL.

`PLUGIN_DIR` :   Localização do plugin de autenticação.

Importante

A senha que você definiu usando `START REPLICA` é mascarada quando é escrita nos logs do MySQL Server, nas tabelas do Schema de Desempenho e nas instruções `SHOW PROCESSLIST`. No entanto, ela é enviada em texto simples pela conexão com a instância do servidor replica. Para proteger a senha durante a transmissão, use criptografia SSL/TLS, um túnel SSH ou outro método para proteger a conexão de visualização não autorizada, para a conexão entre a instância do servidor replica e o cliente que você usa para emitir `START REPLICA`.

A cláusula `UNTIL` faz com que a replica comece a replicar, processando as transações até o ponto especificado na cláusula `UNTIL`, e depois para de novo. A cláusula `UNTIL` pode ser usada para fazer com que a replica prossiga até pouco antes do ponto em que você deseja pular uma transação indesejada, e depois pule a transação conforme descrito na Seção 19.1.7.3, “Pular Transações”. Para identificar uma transação, você pode usar **mysqlbinlog** com o log binário da fonte ou o log de retransmissão da replica, ou usar uma declaração `SHOW BINLOG EVENTS`.

Você também pode usar a cláusula `UNTIL` para depuração da replicação, processando transações uma de cada vez ou em seções. Se você estiver usando a cláusula `UNTIL` para isso, inicie a replica com a opção `--skip-slave-start`, ou a partir do MySQL 8.0.24, a variável de sistema `skip_slave_start`, para evitar que o thread SQL seja executado quando o servidor de replicação for iniciado. Remova a opção ou a configuração da variável de sistema após o procedimento ser concluído, para que não seja esquecida em caso de reinício inesperado do servidor.

A declaração `SHOW REPLICA STATUS` inclui campos de saída que exibem os valores atuais da condição `UNTIL`. A condição `UNTIL` dura enquanto os threads afetados ainda estiverem em execução e é removida quando eles param.

A cláusula `UNTIL` opera na thread do aplicador de replicação (opção `SQL_THREAD`). Você pode usar a opção `SQL_THREAD` ou deixar a replica iniciar ambos os threads por padrão. Se você usar apenas a opção `IO_THREAD`, a cláusula `UNTIL` será ignorada porque a thread do aplicador não será iniciada.

O ponto que você especificar na cláusula `UNTIL` pode ser qualquer uma (e apenas uma) das seguintes opções:

`SOURCE_LOG_FILE` e `SOURCE_LOG_POS` (a partir do MySQL 8.0.23), ou `MASTER_LOG_FILE` e `MASTER_LOG_POS` (para o MySQL 8.0.22): Essas opções fazem com que o processo de aplicação de replicação transfira transações até uma posição em seu log de retransmissão, identificada pelo nome do arquivo e pela posição do arquivo do ponto correspondente no log binário no servidor de origem. O fio de aplicação encontra o limite de transação mais próximo na posição especificada ou após ela, termina a aplicação da transação e para por aí. Para cargas de trabalho de transações comprimidas, especifique a posição final do `Transaction_payload_event` comprimido.

```
These options can still be used when the `GTID_ONLY` option was set on the `CHANGE REPLICATION SOURCE TO` statement to stop the replication channel from persisting file names and file positions in the replication metadata repositories. The file names and file positions are tracked in memory.
```

`RELAY_LOG_FILE` e `RELAY_LOG_POS` :   Essas opções fazem com que o processo de aplicação de replicação processe transações até uma posição no log de retransmissão da replica, identificada pelo nome do arquivo do log de retransmissão e uma posição nesse arquivo. O fio de aplicação encontra a borda de transação mais próxima na posição especificada ou após essa posição, termina a aplicação da transação e para por aí. Para cargas de trabalho de transações comprimidas, especifique a posição final do `Transaction_payload_event` comprimido.

```
These options can still be used when the `GTID_ONLY` option was set on the `CHANGE REPLICATION SOURCE TO` statement to stop the replication channel from persisting file names and file positions in the replication metadata repositories. The file names and file positions are tracked in memory.
```

`SQL_BEFORE_GTIDS` :   Essa opção faz com que o aplicativo de replicação comece a processar transações e pare quando encontrar qualquer transação que esteja no conjunto de GTID especificado. A transação encontrada no conjunto de GTID não é aplicada, assim como nenhuma das outras transações no conjunto de GTID. A opção aceita um conjunto de GTID contendo um ou mais identificadores globais de transação como argumento (veja Conjuntos de GTID). As transações em um conjunto de GTID não aparecem necessariamente na sequência de seus GTIDs no fluxo de replicação, portanto, a transação antes da qual o aplicativo para não é necessariamente a mais antiga.

`SQL_AFTER_GTIDS` :   Essa opção faz com que o aplicativo de replicação comece a processar transações e pare quando tiver processado todas as transações em um conjunto de GTID especificado. A opção aceita um conjunto de GTID contendo um ou mais identificadores globais de transação como argumento (consulte Conjuntos de GTID).

```
With `SQL_AFTER_GTIDS`, the replication threads stop after they have processed all transactions in the GTID set. Transactions are processed in the order received, so it is possible that these include transactions which are not part of the GTID set, but which are received (and processed) before all transactions in the set have been committed. For example, executing `START REPLICA UNTIL SQL_AFTER_GTIDS = 3E11FA47-71CA-11E1-9E33-C80AA9429562:11-56` causes the replica to obtain (and process) all transactions from the source until all of the transactions having the sequence numbers 11 through 56 have been processed, and then to stop without processing any additional transactions after that point has been reached.

`SQL_AFTER_GTIDS` is not compatible with the multi-threaded applier. If this option is used with the multi-threaded applier, a warning is raised, and the replica switches to single-threaded mode. Depending on the use case, it may be possible to to use `START REPLICA UNTIL MASTER_LOG_POS` or `START REPLICA UNTIL SQL_BEFORE_GTIDS`. You can also use `WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()`, which waits until the correct position is reached, but does not stop the applier thread.
```

`SQL_AFTER_MTS_GAPS` :   Apenas para uma replica multithreading (com `replica_parallel_workers` ou `slave_parallel_workers` > 0), esta opção faz com que o processo de replicação processe as transações até o ponto em que não haja mais lacunas na sequência de transações executadas a partir do log de retransmissão. Ao usar uma replica multithreading, há uma chance de lacunas ocorrerem nas seguintes situações:

````
* The coordinator thread is stopped.
* An error occurs in the applier threads.
* **mysqld** shuts down unexpectedly.

When a replication channel has gaps, the replica’s database is in a state that might never have existed on the source. The replica tracks the gaps internally and disallows `CHANGE REPLICATION SOURCE TO` statements that would remove the gap information if they executed.

Before MySQL 8.0.26, issuing `START REPLICA` on a multithreaded replica with gaps in the sequence of transactions executed from the relay log generates a warning. To correct this situation, the solution is to use `START REPLICA UNTIL SQL_AFTER_MTS_GAPS`. See Section 19.5.1.34, “Replication and Transaction Inconsistencies” for more information.

From MySQL 8.0.26, the process of checking for gaps in the sequence of transactions is skipped entirely when GTID-based replication and GTID auto-positioning (`SOURCE_AUTO_POSITION=1`) are in use for the channel, because gaps in transactions can be resolved using GTID auto-positioning. In that situation, `START REPLICA UNTIL SQL_AFTER_MTS_GAPS` just stops the applier thread when it finds the first transaction to execute, and does not attempt to check for gaps in the sequence of transactions. You can also continue to use `CHANGE REPLICATION SOURCE TO` statements as normal, and relay log recovery is possible for the channel.

From MySQL 8.0.27, all replicas are multithreaded by default. When `replica_preserve_commit_order=ON` or `slave_preserve_commit_order=ON` is set for the replica, which is also the default setting from MySQL 8.0.27, gaps should not occur except in the specific situations listed in the description for `replica_preserve_commit_order` and `slave_preserve_commit_order`. If `replica_preserve_commit_order=OFF` or `slave_preserve_commit_order=OFF` is set for the replica, which is the default before MySQL 8.0.27, the commit order of transactions is not preserved, so the chance of gaps occurring is much larger.

If GTIDs are not in use and you need to change a failed multithreaded replica to single-threaded mode, you can issue the following series of statements, in the order shown:

```
START SLAVE UNTIL SQL_AFTER_MTS_GAPS;
SET @@GLOBAL.slave_parallel_workers = 0;
START SLAVE SQL_THREAD;

Or from MySQL 8.0.26:
START REPLICA UNTIL SQL_AFTER_MTS_GAPS;
SET @@GLOBAL.replica_parallel_workers = 0;
START REPLICA SQL_THREAD;
```
````
