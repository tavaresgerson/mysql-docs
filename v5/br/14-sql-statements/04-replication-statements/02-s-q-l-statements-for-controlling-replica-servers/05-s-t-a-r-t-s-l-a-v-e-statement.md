#### 13.4.2.5 Instrução START SLAVE

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

`START SLAVE` inicia os threads de replicação, seja em conjunto ou separadamente. A instrução requer o privilégio [`SUPER`](privileges-provided.html#priv_super). `START SLAVE` causa um commit implícito de uma transação em andamento (veja [Seção 13.3.3, “Instruções que Causam um Commit Implícito”](implicit-commit.html "13.3.3 Instruções que Causam um Commit Implícito")).

Para as opções de tipo de thread, você pode especificar `IO_THREAD`, `SQL_THREAD`, ambas, ou nenhuma delas. Apenas os threads que são iniciados são afetados pela instrução.

* `START SLAVE` sem opções de tipo de thread inicia todos os threads de replicação, assim como `START SLAVE` com ambas as opções de tipo de thread.

* `IO_THREAD` inicia o replication receiver thread (thread receptor de replicação), que lê eventos do servidor de origem e os armazena no relay log.

* `SQL_THREAD` inicia o replication applier thread (thread aplicador de replicação), que lê eventos do relay log e os executa. Uma replica multithreaded (com [`slave_parallel_workers`](replication-options-replica.html#sysvar_slave_parallel_workers) > 0) aplica transações usando um coordinator thread e múltiplos applier threads, e `SQL_THREAD` inicia todos eles.

Importante

`START SLAVE` envia um reconhecimento ao usuário depois que todos os threads de replicação foram iniciados. No entanto, o replication receiver thread pode ainda não ter se conectado à origem com sucesso, ou um applier thread pode parar ao aplicar um evento logo após iniciar. `START SLAVE` não continua monitorando os threads depois que são iniciados, portanto, não avisa se eles pararem subsequentemente ou não conseguirem se conectar. Você deve verificar o error log da replica em busca de mensagens de erro geradas pelos threads de replicação, ou verificar se eles estão sendo executados satisfatoriamente com [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement"). Uma instrução `START SLAVE` bem-sucedida faz com que [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement") mostre `Slave_SQL_Running=Yes`, mas pode ou não mostrar `Slave_IO_Running=Yes`, porque `Slave_IO_Running=Yes` é exibido apenas se o receiver thread estiver em execução e conectado. Para mais informações, veja [Seção 16.1.7.1, “Verificando o Status da Replicação”](replication-administration-status.html "16.1.7.1 Checking Replication Status").

A cláusula opcional `FOR CHANNEL channel` permite que você nomeie a qual channel de replicação a instrução se aplica. Fornecer uma cláusula `FOR CHANNEL channel` aplica a instrução `START SLAVE` a um channel de replicação específico. Se nenhuma cláusula for nomeada e não existirem channels extras, a instrução se aplica ao default channel. Se uma instrução `START SLAVE` não tiver um channel definido ao usar múltiplos channels, esta instrução inicia os threads especificados para todos os channels. Consulte [Seção 16.2.2, “Replication Channels”](replication-channels.html "16.2.2 Replication Channels") para mais informações.

Os channels de replicação para o Group Replication (`group_replication_applier` e `group_replication_recovery`) são gerenciados automaticamente pela instância do servidor. O único channel do Group Replication com o qual você pode interagir é o channel `group_replication_applier`. Este channel tem apenas um applier thread e não tem um receiver thread, então ele pode ser iniciado usando a opção `SQL_THREAD` sem a opção `IO_THREAD`. `START SLAVE` não pode ser usado de forma alguma com o channel `group_replication_recovery`.

`START SLAVE` suporta autenticação pluggable por usuário-senha (veja [Seção 6.2.13, “Pluggable Authentication”](pluggable-authentication.html "6.2.13 Pluggable Authentication")) com as opções `USER`, `PASSWORD`, `DEFAULT_AUTH` e `PLUGIN_DIR`, conforme descrito na lista a seguir. Ao usar estas opções, você deve iniciar o receiver thread (opção `IO_THREAD`) ou todos os threads de replicação; você não pode iniciar o replication applier thread (opção `SQL_THREAD`) sozinho.

`USER` : O nome de usuário para a conta. Você deve definir isso se `PASSWORD` for usado. A opção não pode ser definida como uma string vazia ou nula.

`PASSWORD` : A senha para a conta de usuário nomeada.

`DEFAULT_AUTH` : O nome do plugin de autenticação. O padrão é a autenticação nativa do MySQL.

`PLUGIN_DIR` : A localização do plugin de autenticação.

Importante

A senha que você define usando `START SLAVE` é mascarada quando é escrita nos logs do MySQL Server, nas tabelas do Performance Schema e nas instruções [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement"). No entanto, ela é enviada em texto simples pela conexão para a instância do servidor replica. Para proteger a senha em trânsito, use a criptografia SSL/TLS, um SSH tunnel ou outro método de proteção da conexão contra visualização não autorizada, para a conexão entre a instância do servidor replica e o cliente que você usa para emitir `START SLAVE`.

A cláusula `UNTIL` faz com que a replica inicie a replicação, processe transações até o ponto que você especificar na cláusula `UNTIL` e, em seguida, pare novamente. A cláusula `UNTIL` pode ser usada para fazer uma replica prosseguir até um ponto logo antes de onde você deseja pular uma transação indesejada e, em seguida, pular a transação conforme descrito em [Seção 16.1.7.3, “Pulando Transações”](replication-administration-skip.html "16.1.7.3 Skipping Transactions"). Para identificar uma transação, você pode usar [**mysqlbinlog**](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files") com o binary log da origem ou o relay log da replica, ou usar uma instrução [`SHOW BINLOG EVENTS`](show-binlog-events.html "13.7.5.2 SHOW BINLOG EVENTS Statement").

Você também pode usar a cláusula `UNTIL` para depurar a replicação processando transações uma de cada vez ou em seções. Se estiver usando a cláusula `UNTIL` para fazer isso, inicie a replica com a opção [`--skip-slave-start`](replication-options-replica.html#option_mysqld_skip-slave-start) para evitar que o SQL thread seja executado quando o servidor replica iniciar. Remova a opção após a conclusão do procedimento, para que não seja esquecida no evento de uma reinicialização inesperada do servidor.

A instrução [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement") inclui campos de saída que exibem os valores atuais da condição `UNTIL`. A condição `UNTIL` dura enquanto os threads afetados ainda estiverem em execução e é removida quando eles param.

A cláusula `UNTIL` opera no replication applier thread (opção `SQL_THREAD`). Você pode usar a opção `SQL_THREAD` ou deixar que a replica use o padrão de iniciar ambos os threads. Se você usar apenas a opção `IO_THREAD`, a cláusula `UNTIL` será ignorada porque o applier thread não é iniciado.

O ponto que você especifica na cláusula `UNTIL` pode ser qualquer uma (e apenas uma) das seguintes opções:

`SOURCE_LOG_FILE` e `SOURCE_LOG_POS` : Estas opções fazem com que o replication applier processe transações até uma posição em seu relay log, identificada pelo nome do arquivo e posição do arquivo do ponto correspondente no binary log no servidor de origem. O applier thread encontra o limite de transação mais próximo, ou após a posição especificada, finaliza a aplicação da transação e para ali.

`RELAY_LOG_FILE` e `RELAY_LOG_POS` : Estas opções fazem com que o replication applier processe transações até uma posição no relay log da replica, identificada pelo nome do arquivo do relay log e uma posição naquele arquivo. O applier thread encontra o limite de transação mais próximo, ou após a posição especificada, finaliza a aplicação da transação e para ali.

`SQL_BEFORE_GTIDS` : Esta opção faz com que o replication applier comece a processar transações e pare quando encontrar qualquer transação que esteja no GTID set especificado. A transação encontrada do GTID set não é aplicada, nem quaisquer outras transações no GTID set. A opção recebe como argumento um GTID set contendo um ou mais identificadores de transação global (veja [GTID Sets](replication-gtids-concepts.html#replication-gtids-concepts-gtid-sets "GTID Sets")). As transações em um GTID set não aparecem necessariamente no replication stream na ordem de seus GTIDs, portanto, a transação antes da qual o applier para não é necessariamente a mais antiga.

`SQL_AFTER_GTIDS` : Esta opção faz com que o replication applier comece a processar transações e pare quando tiver processado todas as transações em um GTID set especificado. A opção recebe como argumento um GTID set contendo um ou mais identificadores de transação global (veja [GTID Sets](replication-gtids-concepts.html#replication-gtids-concepts-gtid-sets "GTID Sets")).

    Com `SQL_AFTER_GTIDS`, os threads de replicação param depois de terem processado todas as transações no GTID set. As transações são processadas na ordem recebida, portanto, é possível que estas incluam transações que não fazem parte do GTID set, mas que são recebidas (e processadas) antes que todas as transações no set tenham sido committed. Por exemplo, a execução de `START SLAVE UNTIL SQL_AFTER_GTIDS = 3E11FA47-71CA-11E1-9E33-C80AA9429562:11-56` faz com que a replica obtenha (e processe) todas as transações da origem até que todas as transações com os números de sequência 11 a 56 tenham sido processadas, e então pare sem processar quaisquer transações adicionais após esse ponto ter sido alcançado.

    `SQL_AFTER_GTIDS` não é compatível com replicas multi-threaded. Se esta opção for usada com uma replica multi-threaded, um aviso será levantado, e o slave alterna para o modo single-threaded. Dependendo do caso de uso, pode ser possível usar `START SLAVE UNTIL MASTER_LOG_POS` ou `START SLAVE UNTIL SQL_BEFORE_GTIDS` em seu lugar. Você também pode usar [`WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()`](gtid-functions.html#function_wait-until-sql-thread-after-gtids), que espera até que a posição correta seja alcançada, mas não para o slave thread.

`SQL_AFTER_MTS_GAPS` : Apenas para uma replica multithreaded (com [`slave_parallel_workers`](replication-options-replica.html#sysvar_slave_parallel_workers) > 0), esta opção faz com que a replica processe transações até o ponto em que não há mais lacunas (gaps) na sequência de transações executadas a partir do relay log. Ao usar uma replica multithreaded, existe a chance de ocorrência de lacunas nas seguintes situações:

    * O coordinator thread é parado.
    * Ocorre um erro nos applier threads.
    * [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") é desligado inesperadamente.

Quando um channel de replicação tem lacunas, o database da replica está em um estado que pode nunca ter existido na origem. A replica rastreia as lacunas internamente e não permite instruções [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") que removeriam as informações da lacuna se executadas.

A emissão de `START SLAVE` em uma replica multithreaded com lacunas na sequência de transações executadas a partir do relay log gera um aviso. Para corrigir esta situação, a solução é usar `START SLAVE UNTIL SQL_AFTER_MTS_GAPS`. Veja [Seção 16.4.1.32, “Replicação e Inconsistências de Transação”](replication-features-transaction-inconsistencies.html "16.4.1.32 Replication and Transaction Inconsistencies") para mais informações.

Se você precisar mudar uma replica multithreaded com falha para o modo single-threaded, você pode emitir a seguinte série de instruções, na ordem mostrada:

```sql
    START SLAVE UNTIL SQL_AFTER_MTS_GAPS;
    SET @@GLOBAL.slave_parallel_workers = 0;
    START SLAVE SQL_THREAD;
    ```