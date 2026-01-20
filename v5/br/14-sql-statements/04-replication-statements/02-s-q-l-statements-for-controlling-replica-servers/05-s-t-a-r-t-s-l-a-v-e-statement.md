#### 13.4.2.5 Declaração de início de escravo

```sql
START SLAVE [thread_types] [until_option] [connection_options] [channel_option]

thread_types:
    [thread_type [, thread_type] ... ]

thread_type:
    IO_THREAD | SQL_THREAD

until_option:
    UNTIL {   {SQL_BEFORE_GTIDS | SQL_AFTER_GTIDS} = gtid_set
          |   MASTER_LOG_FILE = 'log_name', MASTER_LOG_POS = log_pos
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

`START SLAVE` inicia os threads de replicação, juntos ou separadamente. A instrução requer o privilégio `SUPER`. `START SLAVE` causa um commit implícito de uma transação em andamento (veja Seção 13.3.3, “Instruções que Causam um Commit Implícito”).

Para as opções de tipo de thread, você pode especificar `IO_THREAD`, `SQL_THREAD`, ambos ou nenhum deles. Somente os threads iniciados são afetados pela declaração.

- `START SLAVE` sem opções de tipo de thread inicia todas as threads de replicação, assim como `START SLAVE` com ambas as opções de tipo de thread.

- `IO_THREAD` inicia o thread do receptor de replicação, que lê os eventos do servidor de origem e os armazena no log de retransmissão.

- `SQL_THREAD` inicia o thread do aplicável de replicação, que lê eventos do log de retransmissão e os executa. Uma replica multithread (com `slave_parallel_workers` > 0) aplica transações usando um thread de coordenador e vários threads de aplicável, e `SQL_THREAD` inicia todos esses threads.

Importante

`START SLAVE` envia um aviso ao usuário após todos os threads de replicação terem sido iniciados. No entanto, o thread receptor de replicação ainda pode não ter se conectado ao ponto de origem com sucesso, ou um thread aplicante pode parar ao aplicar um evento logo após o início. `START SLAVE` não continua a monitorar os threads após eles terem sido iniciados, portanto, não avisa se eles pararem ou não conseguirem se conectar posteriormente. Você deve verificar o log de erro da replica para mensagens de erro geradas pelos threads de replicação, ou verificar se eles estão sendo executados satisfatoriamente com `SHOW SLAVE STATUS`. Uma declaração `START SLAVE` bem-sucedida faz com que `SHOW SLAVE STATUS` mostre `Slave_SQL_Running=Yes`, mas pode ou não mostrar `Slave_IO_Running=Yes`, porque `Slave_IO_Running=Yes` é mostrado apenas se o thread receptor estiver em execução e conectado. Para mais informações, consulte Seção 16.1.7.1, “Verificação do Status da Replicação”.

A cláusula opcional `FOR CHANNEL channel` permite que você nomeie qual canal de replicação a declaração se aplica. Ao fornecer uma cláusula `FOR CHANNEL channel`, a declaração `START SLAVE` é aplicada a um canal de replicação específico. Se nenhuma cláusula for nomeada e não houver canais extras, a declaração se aplica ao canal padrão. Se uma declaração `START SLAVE` não tiver um canal definido ao usar múltiplos canais, essa declaração inicia os threads especificados para todos os canais. Consulte Seção 16.2.2, “Canais de Replicação” para obter mais informações.

Os canais de replicação para a Replicação em Grupo (`group_replication_applier` e `group_replication_recovery`) são gerenciados automaticamente pela instância do servidor. O único canal de Replicação em Grupo com o qual você pode interagir é o canal `group_replication_applier`. Esse canal tem apenas um thread de aplicador e não tem thread de receptor, portanto, ele pode ser iniciado usando a opção `SQL_THREAD` sem a opção `IO_THREAD`. O `START SLAVE` não pode ser usado com o canal `group_replication_recovery` de forma alguma.

`START SLAVE` suporta autenticação de usuário e senha intercambiáveis (consulte Seção 6.2.13, “Autenticação Intercambiável”) com as opções `USER`, `PASSWORD`, `DEFAULT_AUTH` e `PLUGIN_DIR`, conforme descrito na lista a seguir. Ao usar essas opções, você deve iniciar o thread do receptor (`IO_THREAD` opção) ou todos os threads de replicação; você não pode iniciar o thread do aplicador de replicação (`SQL_THREAD` opção) sozinho.

`USER` :   O nome do usuário para a conta. Você deve definir isso se `PASSWORD` for usado. A opção não pode ser definida para uma string vazia ou nula.

`PASSWORD` :   A senha da conta do usuário nomeado.

`DEFAULT_AUTH` :   O nome do plugin de autenticação. O padrão é a autenticação nativa do MySQL.

`PLUGIN_DIR` :   O local do plugin de autenticação.

Importante

A senha que você definiu usando `START SLAVE` é mascarada quando é escrita nos logs do MySQL Server, nas tabelas do Schema de Desempenho e nas instruções `SHOW PROCESSLIST`. No entanto, ela é enviada em texto simples pela conexão com a instância do servidor replica. Para proteger a senha durante a transmissão, use criptografia SSL/TLS, um túnel SSH ou outro método para proteger a conexão de visualização não autorizada, para a conexão entre a instância do servidor replica e o cliente que você usa para emitir `START SLAVE`.

A cláusula `UNTIL` faz com que a replica comece a replicar, processando as transações até o ponto especificado na cláusula `UNTIL`, e depois para novamente. A cláusula `UNTIL` pode ser usada para fazer com que a replica prossiga até pouco antes do ponto em que você deseja pular uma transação indesejada, e depois pular a transação conforme descrito em Seção 16.1.7.3, “Pular Transações”. Para identificar uma transação, você pode usar **mysqlbinlog** com o log binário da fonte ou o log de retransmissão da replica, ou usar uma declaração `SHOW BINLOG EVENTS`]\(show-binlog-events.html).

Você também pode usar a cláusula `UNTIL` para depuração da replicação, processando transações uma de cada vez ou em seções. Se você estiver usando a cláusula `UNTIL` para isso, inicie a replica com a opção `--skip-slave-start` para evitar que o thread SQL seja executado quando o servidor de replicação for iniciado. Remova a opção após o procedimento ser concluído, para que ela não seja esquecida em caso de reinício inesperado do servidor.

A instrução `SHOW SLAVE STATUS` inclui campos de saída que exibem os valores atuais da condição `UNTIL`. A condição `UNTIL` dura enquanto os threads afetados ainda estiverem em execução e é removida quando eles param.

A cláusula `UNTIL` opera na thread do aplicador de replicação (`opção SQL_THREAD`). Você pode usar a opção `SQL_THREAD` ou deixar a replica iniciar ambos os threads por padrão. Se você usar apenas a opção `IO_THREAD`, a cláusula `UNTIL` será ignorada porque a thread do aplicador não será iniciada.

O ponto que você especificar na cláusula `UNTIL` pode ser qualquer uma (e apenas uma) das seguintes opções:

`SOURCE_LOG_FILE` e `SOURCE_LOG_POS`: Essas opções fazem com que o processo de aplicação de replicação processe transações até uma posição em seu log de retransmissão, identificada pelo nome do arquivo e pela posição do arquivo do ponto correspondente no log binário no servidor de origem. O thread de aplicação encontra o limite de transação mais próximo na posição especificada ou após ela, termina a aplicação da transação e para por aí.

`RELAY_LOG_FILE` e `RELAY_LOG_POS`: Essas opções fazem com que o processo de aplicação de replicação transações até uma posição no log de retransmissão da replica, identificada pelo nome do arquivo de log de retransmissão e uma posição nesse arquivo. O thread de aplicação encontra o limite de transação mais próximo na posição especificada ou após ela, termina a aplicação da transação e para por aí.

`SQL_BEFORE_GTIDS` : Esta opção faz com que o aplicativo de replicação comece a processar transações e pare quando encontrar qualquer transação que esteja no conjunto de GTID especificado. A transação encontrada no conjunto de GTID não é aplicada, assim como nenhuma das outras transações no conjunto de GTID. A opção aceita um conjunto de GTID contendo um ou mais identificadores globais de transação como argumento (consulte conjuntos de GTID). As transações em um conjunto de GTID não aparecem necessariamente na sequência de seus GTIDs no fluxo de replicação, portanto, a transação antes da qual o aplicativo para não é necessariamente a mais antiga.

`SQL_AFTER_GTIDS` : Esta opção faz com que o aplicativo de replicação comece a processar transações e pare quando tiver processado todas as transações de um conjunto de GTID especificado. A opção aceita um conjunto de GTID que contém um ou mais identificadores globais de transação como argumento (consulte conjuntos de GTID).

```
With `SQL_AFTER_GTIDS`, the replication threads stop after they have processed all transactions in the GTID set. Transactions are processed in the order received, so it is possible that these include transactions which are not part of the GTID set, but which are received (and processed) before all transactions in the set have been committed. For example, executing `START SLAVE UNTIL SQL_AFTER_GTIDS = 3E11FA47-71CA-11E1-9E33-C80AA9429562:11-56` causes the replica to obtain (and process) all transactions from the source until all of the transactions having the sequence numbers 11 through 56 have been processed, and then to stop without processing any additional transactions after that point has been reached.

`SQL_AFTER_GTIDS` is not compatible with with multi-threaded slaves. If this option is used with a multi-threaded slave, a warning is raised, and the slave switches to single-threaded mode. Depending on the use case, it may be possible to to use `START SLAVE UNTIL MASTER_LOG_POS` or `START SLAVE UNTIL SQL_BEFORE_GTIDS` instead. You can also use `WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()`, which waits until the correct position is reached, but does not stop the slave thread.
```

`SQL_AFTER_MTS_GAPS` :   Apenas para uma replica multithreading (com `slave_parallel_workers` > 0), esta opção faz com que o processo de replicação processe transações até o ponto em que não haja mais lacunas na sequência de transações executadas a partir do log de retransmissão. Ao usar uma replica multithreading, há a possibilidade de lacunas ocorrerem nas seguintes situações:

````
* The coordinator thread is stopped.
* An error occurs in the applier threads.
* **mysqld** shuts down unexpectedly.

When a replication channel has gaps, the replica’s database is in a state that might never have existed on the source. The replica tracks the gaps internally and disallows `CHANGE MASTER TO` statements that would remove the gap information if they executed.

Issuing `START SLAVE` on a multithreaded replica with gaps in the sequence of transactions executed from the relay log generates a warning. To correct this situation, the solution is to use `START SLAVE UNTIL SQL_AFTER_MTS_GAPS`. See Section 16.4.1.32, “Replication and Transaction Inconsistencies” for more information.

If you need to change a failed multithreaded replica to single-threaded mode, you can issue the following series of statements, in the order shown:

```sql
START SLAVE UNTIL SQL_AFTER_MTS_GAPS;
SET @@GLOBAL.slave_parallel_workers = 0;
START SLAVE SQL_THREAD;
```
````
