#### 15.4.2.1 ALTERAR MASTER PARA Declaração

```
CHANGE MASTER TO option [, option] ... [ channel_option ]

option: {
    MASTER_BIND = 'interface_name'
  | MASTER_HOST = 'host_name'
  | MASTER_USER = 'user_name'
  | MASTER_PASSWORD = 'password'
  | MASTER_PORT = port_num
  | PRIVILEGE_CHECKS_USER = {'account' | NULL}
  | REQUIRE_ROW_FORMAT = {0|1}
  | REQUIRE_TABLE_PRIMARY_KEY_CHECK = {STREAM | ON | OFF}
  | ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS = {OFF | LOCAL | uuid}
  | MASTER_LOG_FILE = 'source_log_name'
  | MASTER_LOG_POS = source_log_pos
  | MASTER_AUTO_POSITION = {0|1}
  | RELAY_LOG_FILE = 'relay_log_name'
  | RELAY_LOG_POS = relay_log_pos
  | MASTER_HEARTBEAT_PERIOD = interval
  | MASTER_CONNECT_RETRY = interval
  | MASTER_RETRY_COUNT = count
  | SOURCE_CONNECTION_AUTO_FAILOVER = {0|1}
  | MASTER_DELAY = interval
  | MASTER_COMPRESSION_ALGORITHMS = 'algorithm[,algorithm][,algorithm]'
  | MASTER_ZSTD_COMPRESSION_LEVEL = level
  | MASTER_SSL = {0|1}
  | MASTER_SSL_CA = 'ca_file_name'
  | MASTER_SSL_CAPATH = 'ca_directory_name'
  | MASTER_SSL_CERT = 'cert_file_name'
  | MASTER_SSL_CRL = 'crl_file_name'
  | MASTER_SSL_CRLPATH = 'crl_directory_name'
  | MASTER_SSL_KEY = 'key_file_name'
  | MASTER_SSL_CIPHER = 'cipher_list'
  | MASTER_SSL_VERIFY_SERVER_CERT = {0|1}
  | MASTER_TLS_VERSION = 'protocol_list'
  | MASTER_TLS_CIPHERSUITES = 'ciphersuite_list'
  | MASTER_PUBLIC_KEY_PATH = 'key_file_name'
  | GET_MASTER_PUBLIC_KEY = {0|1}
  | NETWORK_NAMESPACE = 'namespace'
  | IGNORE_SERVER_IDS = (server_id_list),
  | GTID_ONLY = {0|1}
}

channel_option:
    FOR CHANNEL channel

server_id_list:
    [server_id [, server_id] ... ]
```

`CHANGE MASTER TO` altera os parâmetros que o servidor de replicação usa para se conectar à fonte e para ler dados da fonte. Também atualiza o conteúdo dos repositórios de metadados de replicação (consulte a Seção 19.2.4, “Repositórios de Log de Relay e Metadados de Replicação”). A partir do MySQL 8.0.23, use `CHANGE REPLICATION SOURCE TO` no lugar de `CHANGE MASTER TO`, que é desatualizado a partir dessa versão. Em versões anteriores ao MySQL 8.0.23, use `CHANGE MASTER TO`.

O `CHANGE MASTER TO` requer o privilégio `REPLICATION_SLAVE_ADMIN` (ou o privilégio descontinuado `SUPER`).

As opções que você não especificar em uma declaração `CHANGE MASTER TO` mantêm seu valor, exceto conforme indicado na discussão a seguir. Portanto, na maioria dos casos, não há necessidade de especificar opções que não mudam.

Os valores usados para `SOURCE_HOST` e outras opções `CHANGE REPLICATION SOURCE TO` são verificados quanto a caracteres de retorno de linha (`\n` ou `0x0A`). A presença desses caracteres nesses valores faz com que a declaração falhe com um erro.

A cláusula opcional `FOR CHANNEL channel` permite que você nomeie qual canal de replicação a declaração se aplica. A cláusula `FOR CHANNEL channel` aplica a declaração `CHANGE MASTER TO` a um canal de replicação específico e é usada para adicionar um novo canal ou modificar um canal existente. Por exemplo, para adicionar um novo canal chamado `channel2`:

```
CHANGE MASTER TO MASTER_HOST=host1, MASTER_PORT=3002 FOR CHANNEL 'channel2'
```

Se nenhuma cláusula for nomeada e não houver canais extras, uma declaração `CHANGE MASTER TO` será aplicada ao canal padrão, cujo nome é a string vazia (""). Quando você configurou vários canais de replicação, cada declaração `CHANGE MASTER TO` deve nomear um canal usando a cláusula `FOR CHANNEL channel`. Consulte a Seção 19.2.2, “Canais de Replicação”, para obter mais informações.

Para algumas das opções da declaração `CHANGE MASTER TO`, você deve emitir uma declaração `STOP SLAVE` antes de emitir uma declaração `CHANGE MASTER TO` (e uma declaração `START SLAVE` depois). Às vezes, você só precisa interromper o fio de SQL de replicação (aplicador) ou o fio de I/O de replicação (receptor), e não ambos:

- Quando o fio de aplicação é interrompido, você pode executar `CHANGE MASTER TO` usando qualquer combinação permitida de opções `RELAY_LOG_FILE`, `RELAY_LOG_POS` e `MASTER_DELAY`, mesmo que o fio de recebimento de replicação esteja em execução. Nenhuma outra opção pode ser usada com essa declaração quando o fio de recebimento estiver em execução.

- Quando o fio receptor é interrompido, você pode executar `CHANGE MASTER TO` usando qualquer uma das opções para essa declaração (em qualquer combinação permitida) *exceto* `RELAY_LOG_FILE`, `RELAY_LOG_POS`, `MASTER_DELAY` ou `MASTER_AUTO_POSITION = 1`, mesmo quando o fio aplicante estiver em execução.

- Tanto o fio do receptor quanto o fio do aplicador devem ser interrompidos antes de emitir uma declaração `CHANGE MASTER TO` que utilize `MASTER_AUTO_POSITION = 1`, `GTID_ONLY = 1` ou `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS`.

Você pode verificar o estado atual do fio do aplicador de replicação e do fio do receptor de replicação usando `SHOW SLAVE STATUS`. Observe que o canal do aplicador de replicação de grupo (`group_replication_applier`) não tem um fio de receptor, apenas um fio de aplicador.

As declarações `CHANGE MASTER TO` têm vários efeitos colaterais e interações que você deve estar ciente de antemão:

- `CHANGE MASTER TO` causa um commit implícito de uma transação em andamento. Veja a Seção 15.3.3, “Declarações que causam um commit implícito”.

- `CHANGE MASTER TO` faz com que os valores anteriores para `MASTER_HOST`, `MASTER_PORT`, `MASTER_LOG_FILE` e `MASTER_LOG_POS` sejam escritos no log de erros, juntamente com outras informações sobre o estado da replica antes da execução.

- Se você estiver usando a replicação baseada em declarações e tabelas temporárias, é possível que uma declaração `CHANGE MASTER TO` que siga uma declaração `STOP SLAVE` deixe tabelas temporárias na replica. Um aviso (`ER_WARN_OPEN_TEMP_TABLES_MUST_BE_ZERO`) é emitido sempre que isso ocorre. Você pode evitar isso nesses casos, garantindo que o valor da variável de status do sistema `Replica_open_temp_tables` ou `Slave_open_temp_tables` seja igual a 0 antes de executar uma declaração `CHANGE MASTER TO` desse tipo.

- Ao usar uma replica multithread (`replica_parallel_workers` > 0 ou `slave_parallel_workers` > 0), parar a replicação pode causar lacunas na sequência de transações que foram executadas a partir do log de retransmissão, independentemente de a replicação ter sido parada intencionalmente ou de outra forma. Quando essas lacunas existem, a emissão de `CHANGE MASTER TO` falha. A solução para essa situação é emitir `START SLAVE UNTIL SQL_AFTER_MTS_GAPS`, que garante que as lacunas sejam fechadas. A partir do MySQL 8.0.26, o processo de verificação de lacunas na sequência de transações é ignorado completamente quando a replicação baseada em GTID e o autoposicionamento de GTID estão em uso, porque as lacunas nas transações podem ser resolvidas usando o autoposicionamento de GTID. Nessa situação, `CHANGE MASTER TO` ainda pode ser usado.

As seguintes opções estão disponíveis para as declarações `CHANGE MASTER TO`:

`ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS = {OFF | LOCAL | uuid}` :   Faz com que o canal de replicação atribua um GTID às transações replicadas que não possuem um, permitindo a replicação de uma fonte que não usa replicação baseada em GTID para uma replica que a usa. Para uma replica de múltiplas fontes, você pode ter uma mistura de canais que usam `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` e canais que não o usam. O padrão é `OFF`, o que significa que o recurso não é usado.

```
`LOCAL` assigns a GTID including the replica's own UUID (the `server_uuid` setting). `uuid` assigns a GTID including the specified UUID, such as the `server_uuid` setting for the replication source server. Using a nonlocal UUID lets you differentiate between transactions that originated on the replica and transactions that originated on the source, and for a multi-source replica, between transactions that originated on different sources. The UUID you choose only has significance for the replica's own use. If any of the transactions sent by the source do have a GTID already, that GTID is retained.

Channels specific to Group Replication cannot use `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS`, but an asynchronous replication channel for another source on a server instance that is a Group Replication group member can do so. In that case, do not specify the Group Replication group name as the UUID for creating the GTIDs.

To set `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` to `LOCAL` or `uuid`, the replica must have `gtid_mode=ON` set, and this cannot be changed afterwards. This option is for use with a source that has binary log file position based replication, so `MASTER_AUTO_POSITION=1` cannot be set for the channel. Both the replication SQL thread and the replication I/O (receiver) thread must be stopped before setting this option.

Important

A replica set up with `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` on any channel cannot be promoted to replace the replication source server in the event that a failover is required, and a backup taken from the replica cannot be used to restore the replication source server. The same restriction applies to replacing or restoring other replicas that use `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` on any channel.

For further restrictions and information, see Section 19.1.3.6, “Replication From a Source Without GTIDs to a Replica With GTIDs”.
```

`GET_MASTER_PUBLIC_KEY = {0|1}` : Permite a troca de senha com base em um par de chaves RSA, solicitando a chave pública da fonte. A opção está desativada por padrão.

```
This option applies to replicas that authenticate with the `caching_sha2_password` authentication plugin. For connections by accounts that authenticate using this plugin, the source does not send the public key unless requested, so it must be requested or specified in the client. If `MASTER_PUBLIC_KEY_PATH` is given and specifies a valid public key file, it takes precedence over `GET_MASTER_PUBLIC_KEY`. If you are using a replication user account that authenticates with the `caching_sha2_password` plugin (which is the default from MySQL 8.0), and you are not using a secure connection, you must specify either this option or the `MASTER_PUBLIC_KEY_PATH` option to provide the RSA public key to the replica.
```

`GTID_ONLY = {0|1}` :   Para que o canal de replicação não persista nomes de arquivos e posições de arquivos nos repositórios de metadados de replicação. A opção `GTID_ONLY` está disponível a partir do MySQL 8.0.27. A opção `GTID_ONLY` está desabilitada por padrão para canais de replicação assíncrona, mas está habilitada por padrão para canais de replicação em grupo e não pode ser desabilitada para eles.

```
For replication channels with this setting, in-memory file positions are still tracked, and file positions can still be observed for debugging purposes in error messages and through interfaces such as `SHOW REPLICA STATUS` statements (where they are shown as being invalid if they are out of date). However, the writes and reads required to persist and check the file positions are avoided in situations where GTID-based replication does not actually require them, including the transaction queuing and application process.

This option can be used only if both the replication SQL (applier) thread and replication I/O (receiver) thread are stopped. To set `GTID_ONLY = 1` for a replication channel, GTIDs must be in use on the server (`gtid_mode = ON`), and row-based binary logging must be in use on the source (statement-based replication is not supported). The options `REQUIRE_ROW_FORMAT = 1` and `SOURCE_AUTO_POSITION = 1` must be set for the replication channel.

When `GTID_ONLY = 1` is set, the replica uses `replica_parallel_workers=1` if that system variable is set to zero for the server, so it is always technically a multi-threaded applier. This is because a multi-threaded applier uses saved positions rather than the replication metadata repositories to locate the start of a transaction that it needs to reapply.

If you disable `GTID_ONLY` after setting it, the existing relay logs are deleted and the existing known binary log file positions are persisted, even if they are stale. The file positions for the binary log and relay log in the replication metadata repositories might be invalid, and a warning is returned if this is the case. Provided that `SOURCE_AUTO_POSITION` is still enabled, GTID auto-positioning is used to provide the correct positioning.

If you also disable `SOURCE_AUTO_POSITION`, the file positions for the binary log and relay log in the replication metadata repositories are used for positioning if they are valid. If they are marked as invalid, you must provide a valid binary log file name and position (`SOURCE_LOG_FILE` and `SOURCE_LOG_POS`). If you also provide a relay log file name and position (`RELAY_LOG_FILE` and `RELAY_LOG_POS`), the relay logs are preserved and the applier position is set to the stated position. GTID auto-skip ensures that any transactions already applied are skipped even if the eventual applier position is not correct.
```

`IGNORE_SERVER_IDS = (server_id_list)` :   Faz com que a replica ignore eventos originados dos servidores especificados. A opção aceita uma lista de IDs de servidores separados por vírgula, com 0 ou mais servidores. Eventos de rotação e exclusão de logs dos servidores não são ignorados e são registrados no log do retransmissor.

````
In circular replication, the originating server normally acts as the terminator of its own events, so that they are not applied more than once. Thus, this option is useful in circular replication when one of the servers in the circle is removed. Suppose that you have a circular replication setup with 4 servers, having server IDs 1, 2, 3, and 4, and server 3 fails. When bridging the gap by starting replication from server 2 to server 4, you can include `IGNORE_SERVER_IDS = (3)` in the `CHANGE MASTER TO` statement that you issue on server 4 to tell it to use server 2 as its source instead of server 3. Doing so causes it to ignore and not to propagate any statements that originated with the server that is no longer in use.

If `IGNORE_SERVER_IDS` contains the server's own ID and the server was started with the `--replicate-same-server-id` option enabled, an error results.

Note

When global transaction identifiers (GTIDs) are used for replication, transactions that have already been applied are automatically ignored, so the `IGNORE_SERVER_IDS` function is not required and is deprecated. If `gtid_mode=ON` is set for the server, a deprecation warning is issued if you include the `IGNORE_SERVER_IDS` option in a `CHANGE MASTER TO` statement.

The source metadata repository and the output of `SHOW REPLICA STATUS` provide the list of servers that are currently ignored. For more information, see Section 19.2.4.2, “Replication Metadata Repositories”, and Section 15.7.7.35, “SHOW REPLICA STATUS Statement”.

If a `CHANGE MASTER TO` statement is issued without any `IGNORE_SERVER_IDS` option, any existing list is preserved. To clear the list of ignored servers, it is necessary to use the option with an empty list:

```
CHANGE MASTER TO IGNORE_SERVER_IDS = ();
```

`RESET REPLICA ALL` clears `IGNORE_SERVER_IDS`.

Note

A deprecation warning is issued if `SET GTID_MODE=ON` is issued when any channel has existing server IDs set with `IGNORE_SERVER_IDS`. Before starting GTID-based replication, check for and clear all ignored server ID lists on the servers involved. The `SHOW REPLICA STATUS` statement displays the list of ignored IDs, if there is one. If you do receive the deprecation warning, you can still clear a list after `gtid_mode=ON` is set by issuing a `CHANGE MASTER TO` statement containing the `IGNORE_SERVER_IDS` option with an empty list.
````

`MASTER_AUTO_POSITION = {0|1}` :   Faz com que a replica tente se conectar à fonte usando o recurso de autoposicionamento da replicação baseada em GTID, em vez de uma posição baseada em um arquivo de log binário. Esta opção é usada para iniciar uma replicação usando a replicação baseada em GTID. O padrão é 0, o que significa que o autoposicionamento de GTID e a replicação baseada em GTID não são usados. Esta opção pode ser usada com `CHANGE MASTER TO` apenas se o thread de SQL de replicação (aplicador) e o thread de I/O de replicação (receptor) estiverem parados.

```
Both the replica and the source must have GTIDs enabled (`GTID_MODE=ON`, `ON_PERMISSIVE,` or `OFF_PERMISSIVE` on the replica, and `GTID_MODE=ON` on the source). `MASTER_LOG_FILE`, `MASTER_LOG_POS`, `RELAY_LOG_FILE`, and `RELAY_LOG_POS` cannot be specified together with `MASTER_AUTO_POSITION = 1`. If multi-source replication is enabled on the replica, you need to set the `MASTER_AUTO_POSITION = 1` option for each applicable replication channel.

With `MASTER_AUTO_POSITION = 1` set, in the initial connection handshake, the replica sends a GTID set containing the transactions that it has already received, committed, or both. The source responds by sending all transactions recorded in its binary log whose GTID is not included in the GTID set sent by the replica. This exchange ensures that the source only sends the transactions with a GTID that the replica has not already recorded or committed. If the replica receives transactions from more than one source, as in the case of a diamond topology, the auto-skip function ensures that the transactions are not applied twice. For details of how the GTID set sent by the replica is computed, see Section 19.1.3.3, “GTID Auto-Positioning”.

If any of the transactions that should be sent by the source have been purged from the source's binary log, or added to the set of GTIDs in the `gtid_purged` system variable by another method, the source sends the error `ER_SOURCE_HAS_PURGED_REQUIRED_GTIDS` to the replica, and replication does not start. The GTIDs of the missing purged transactions are identified and listed in the source's error log in the warning message `ER_FOUND_MISSING_GTIDS`. Also, if during the exchange of transactions it is found that the replica has recorded or committed transactions with the source's UUID in the GTID, but the source itself has not committed them, the source sends the error `ER_REPLICA_HAS_MORE_GTIDS_THAN_SOURCE` to the replica and replication does not start. For information on how to handle these situations, see Section 19.1.3.3, “GTID Auto-Positioning”.

You can see whether replication is running with GTID auto-positioning enabled by checking the Performance Schema `replication_connection_status` table or the output of `SHOW REPLICA STATUS`. Disabling the `MASTER_AUTO_POSITION` option again makes the replica revert to file-based replication.
```

`MASTER_BIND = 'interface_name'` :   Determina qual das interfaces de rede da réplica será escolhida para se conectar à fonte, para uso em réplicas que possuem múltiplas interfaces de rede. Especifique o endereço IP da interface de rede. O comprimento máximo do valor da string é de 255 caracteres.

```
The IP address configured with this option, if any, can be seen in the `Master_Bind` column of the output from `SHOW REPLICA STATUS`. In the source metadata repository table `mysql.slave_master_info`, the value can be seen as the `Master_bind` column. The ability to bind a replica to a specific network interface is also supported by NDB Cluster.
```

`MASTER_COMPRESSION_ALGORITHMS = 'algorithm[,algorithm][,algorithm]'` : Especifica um, dois ou três dos algoritmos de compressão permitidos para conexões ao servidor de origem da replicação, separados por vírgulas. O comprimento máximo do valor da string é de 99 caracteres. O valor padrão é `uncompressed`.

```
The available algorithms are `zlib`, `zstd`, and `uncompressed`, the same as for the `protocol_compression_algorithms` system variable. The algorithms can be specified in any order, but it is not an order of preference - the algorithm negotiation process attempts to use `zlib`, then `zstd`, then `uncompressed`, if they are specified. `MASTER_COMPRESSION_ALGORITHMS` is available as of MySQL 8.0.18.

The value of `MASTER_COMPRESSION_ALGORITHMS` applies only if the `replica_compressed_protocol` or `slave_compressed_protocol` system variable is disabled. If `replica_compressed_protocol` or `slave_compressed_protocol` is enabled, it takes precedence over `MASTER_COMPRESSION_ALGORITHMS` and connections to the source use `zlib` compression if both source and replica support that algorithm. For more information, see Section 6.2.8, “Connection Compression Control”.

Binary log transaction compression (available as of MySQL 8.0.20), which is activated by the `binlog_transaction_compression` system variable, can also be used to save bandwidth. If you do this in combination with connection compression, connection compression has less opportunity to act on the data, but can still compress headers and those events and transaction payloads that are uncompressed. For more information on binary log transaction compression, see Section 7.4.4.5, “Binary Log Transaction Compression”.
```

`MASTER_CONNECT_RETRY = interval` : Especifica o intervalo em segundos entre as tentativas de reconexão que a réplica faz após o tempo de conexão com a fonte expirar. O intervalo padrão é de 60 segundos.

```
The attempts are limited by the `MASTER_RETRY_COUNT` option. If both the default settings are used, the replica waits 60 seconds between reconnection attempts (`MASTER_CONNECT_RETRY=60`), and keeps attempting to reconnect at this rate for 60 days (`MASTER_RETRY_COUNT=86400`). These values are recorded in the source metadata repository and shown in the `replication_connection_configuration` Performance Schema table.
```

`MASTER_DELAY = interval` : Especifica quantos segundos o replica deve ficar atrasado em relação à fonte. Um evento recebido da fonte não é executado até que tenha passado pelo menos `interval` segundos após sua execução na fonte. `interval` deve ser um inteiro não negativo no intervalo de 0 a 231−1. O padrão é 0. Para mais informações, consulte a Seção 19.4.11, “Replicação Atrasada”.

```
A `CHANGE MASTER TO` statement employing the `MASTER_DELAY` option can be executed on a running replica when the replication SQL thread is stopped.
```

`MASTER_HEARTBEAT_PERIOD = interval` :   Controla o intervalo do batimento cardíaco, que interrompe o tempo de espera da conexão se a conexão ainda estiver boa, na ausência de dados. Um sinal de batimento cardíaco é enviado para a replica após esse número de segundos, e o período de espera é redefinido sempre que o log binário da fonte é atualizado com um evento. Os batimentos cardíacos são, portanto, enviados pela fonte apenas se não houver eventos não enviados no arquivo de log binário por um período maior que este.

```
The heartbeat interval *`interval`* is a decimal value having the range 0 to 4294967 seconds and a resolution in milliseconds; the smallest nonzero value is 0.001. Setting *`interval`* to 0 disables heartbeats altogether. The heartbeat interval defaults to half the value of the `replica_net_timeout` or `slave_net_timeout` system variable. It is recorded in the source metadata repository and shown in the `replication_connection_configuration` Performance Schema table.

The system variable `replica_net_timeout` (from MySQL 8.0.26) or `slave_net_timeout` (before MySQL 8.0.26) specifies the number of seconds that the replica waits for either more data or a heartbeat signal from the source, before the replica considers the connection broken, aborts the read, and tries to reconnect. The default value is 60 seconds (one minute). Note that a change to the value or default setting of `replica_net_timeout` or `slave_net_timeout` does not automatically change the heartbeat interval, whether that has been set explicitly or is using a previously calculated default. A warning is issued if you set the global value of `replica_net_timeout` or `slave_net_timeout` to a value less than that of the current heartbeat interval. If `replica_net_timeout` or `slave_net_timeout` is changed, you must also issue `CHANGE MASTER TO` to adjust the heartbeat interval to an appropriate value so that the heartbeat signal occurs before the connection timeout. If you do not do this, the heartbeat signal has no effect, and if no data is received from the source, the replica can make repeated reconnection attempts, creating zombie dump threads.
```

`MASTER_HOST = 'host_name'` :   O nome do host ou o endereço IP do servidor de origem da replicação. A réplica usa isso para se conectar à origem. O comprimento máximo do valor da string é de 255 caracteres. Antes do MySQL 8.0.17, era de 60 caracteres.

```
If you specify `MASTER_HOST` or `MASTER_PORT`, the replica assumes that the source server is different from before (even if the option value is the same as its current value.) In this case, the old values for the source's binary log file name and position are considered no longer applicable, so if you do not specify `MASTER_LOG_FILE` and `MASTER_LOG_POS` in the statement, `MASTER_LOG_FILE=''` and `MASTER_LOG_POS=4` are silently appended to it.

Setting `MASTER_HOST=''` (that is, setting its value explicitly to an empty string) is *not* the same as not setting `MASTER_HOST` at all. Trying to set `MASTER_HOST` to an empty string fails with an error.
```

`MASTER_LOG_FILE = 'source_log_name'`, `MASTER_LOG_POS = source_log_pos` :   O nome do arquivo de log binário e a localização nesse arquivo, onde a thread de I/O de replicação (receptor) começa a ler o log binário da fonte na próxima vez que a thread começar. Especifique essas opções se você estiver usando a replicação baseada na posição do arquivo de log binário.

```
`MASTER_LOG_FILE` must include the numeric suffix of a specific binary log file that is available on the source server, for example, `MASTER_LOG_FILE='binlog.000145'`. The maximum length of the string value is 511 characters.

`MASTER_LOG_POS` is the numeric position for the replica to start reading in that file. `MASTER_LOG_POS=4` represents the start of the events in a binary log file.

If you specify either of `MASTER_LOG_FILE` or `MASTER_LOG_POS`, you cannot specify `MASTER_AUTO_POSITION = 1`, which is for GTID-based replication.

If neither of `MASTER_LOG_FILE` or `MASTER_LOG_POS` is specified, the replica uses the last coordinates of the *replication SQL (applier) thread* before `CHANGE MASTER TO` was issued. This ensures that there is no discontinuity in replication, even if the replication SQL (applier) thread was late compared to the replication I/O (receiver) thread.
```

`MASTER_PASSWORD = 'password'` :   A senha para a conta de usuário de replicação a ser usada para se conectar ao servidor de origem de replicação. O comprimento máximo do valor da string é de 32 caracteres. Se você especificar `MASTER_PASSWORD`, `MASTER_USER` também é necessário.

```
The password used for a replication user account in a `CHANGE MASTER TO` statement is limited to 32 characters in length. Trying to use a password of more than 32 characters causes `CHANGE MASTER TO` to fail.

The password is masked in MySQL Server’s logs, Performance Schema tables, and `SHOW PROCESSLIST` statements.
```

`MASTER_PORT = port_num` :   O número da porta TCP/IP que a réplica usa para se conectar ao servidor de origem da replicação.

```
Note

Replication cannot use Unix socket files. You must be able to connect to the replication source server using TCP/IP.

If you specify `MASTER_HOST` or `MASTER_PORT`, the replica assumes that the source server is different from before (even if the option value is the same as its current value). In this case, the old values for the source's binary log file name and position are considered no longer applicable, so if you do not specify `MASTER_LOG_FILE` and `MASTER_LOG_POS` in the statement, `MASTER_LOG_FILE=''` and `MASTER_LOG_POS=4` are silently appended to it.
```

`MASTER_PUBLIC_KEY_PATH = 'key_file_name'` :   Habilita a troca de senha baseada em par de chaves RSA fornecendo o nome do caminho para um arquivo que contém uma cópia do lado do replicador da chave pública necessária pela fonte. O arquivo deve estar no formato PEM. O comprimento máximo do valor da string é de 511 caracteres.

```
This option applies to replicas that authenticate with the `sha256_password` or `caching_sha2_password` authentication plugin. (For `sha256_password`, `MASTER_PUBLIC_KEY_PATH` can be used only if MySQL was built using OpenSSL.) If you are using a replication user account that authenticates with the `caching_sha2_password` plugin (which is the default from MySQL 8.0), and you are not using a secure connection, you must specify either this option or the `GET_MASTER_PUBLIC_KEY=1` option to provide the RSA public key to the replica.
```

`MASTER_RETRY_COUNT = count` :   Define o número máximo de tentativas de reconexão que a réplica faz após o tempo de conexão com a fonte expirar, conforme determinado pela variável de sistema `replica_net_timeout` ou `slave_net_timeout`. Se a réplica precisar se reconectar, a primeira tentativa de reconexão ocorre imediatamente após o tempo de expiração. O valor padrão é de 86400 tentativas.

```
The interval between the attempts is specified by the `MASTER_CONNECT_RETRY` option. If both the default settings are used, the replica waits 60 seconds between reconnection attempts (`MASTER_CONNECT_RETRY=60`), and keeps attempting to reconnect at this rate for 60 days (`MASTER_RETRY_COUNT=86400`). A setting of 0 for `MASTER_RETRY_COUNT` means that there is no limit on the number of reconnection attempts, so the replica keeps trying to reconnect indefinitely.

The values for `MASTER_CONNECT_RETRY` and `MASTER_RETRY_COUNT` are recorded in the source metadata repository and shown in the `replication_connection_configuration` Performance Schema table. `MASTER_RETRY_COUNT` supersedes the `--master-retry-count` server startup option.
```

`MASTER_SSL = {0|1}` : Especifique se a replica criptografa a conexão de replicação. O padrão é 0, o que significa que a replica não criptografa a conexão de replicação. Se você definir `MASTER_SSL=1`, você pode configurar a criptografia usando as opções `MASTER_SSL_xxx` e `MASTER_TLS_xxx`.

```
Setting `MASTER_SSL=1` for a replication connection and then setting no further `MASTER_SSL_xxx` options corresponds to setting `--ssl-mode=REQUIRED` for the client, as described in Command Options for Encrypted Connections. With `MASTER_SSL=1`, the connection attempt only succeeds if an encrypted connection can be established. A replication connection does not fall back to an unencrypted connection, so there is no setting corresponding to the `--ssl-mode=PREFERRED` setting for replication. If `MASTER_SSL=0` is set, this corresponds to `--ssl-mode=DISABLED`.

Important

To help prevent sophisticated man-in-the-middle attacks, it is important for the replica to verify the server’s identity. You can specify additional `MASTER_SSL_xxx` options to correspond to the settings `--ssl-mode=VERIFY_CA` and `--ssl-mode=VERIFY_IDENTITY`, which are a better choice than the default setting to help prevent this type of attack. With these settings, the replica checks that the server’s certificate is valid, and checks that the host name the replica is using matches the identity in the server’s certificate. To implement one of these levels of verification, you must first ensure that the CA certificate for the server is reliably available to the replica, otherwise availability issues will result. For this reason, they are not the default setting.
```

`MASTER_SSL_xxx`, `MASTER_TLS_xxx` :   Especifique como a replica usa criptografia e cifra para proteger a conexão de replicação. Essas opções podem ser alteradas mesmo em réplicas compiladas sem suporte SSL. Elas são salvas no repositório de metadados da fonte, mas são ignoradas se a replica não tiver o suporte SSL habilitado. O comprimento máximo do valor para as opções com valor de string `MASTER_SSL_xxx` e `MASTER_TLS_xxx` é de 511 caracteres, com exceção de `MASTER_TLS_CIPHERSUITES`, para o qual é de 4000 caracteres.

```
The `MASTER_SSL_xxx` and `MASTER_TLS_xxx` options perform the same functions as the `--ssl-xxx` and `--tls-xxx` client options described in Command Options for Encrypted Connections. The correspondence between the two sets of options, and the use of the `MASTER_SSL_xxx` and `MASTER_TLS_xxx` options to set up a secure connection, is explained in Section 19.3.1, “Setting Up Replication to Use Encrypted Connections”.
```

`MASTER_USER = 'user_name'` :   O nome do usuário para a conta de usuário de replicação a ser usada para se conectar ao servidor de origem de replicação. O comprimento máximo do valor da string é de 96 caracteres.

```
For Group Replication, this account must exist on every member of the replication group. It is used for distributed recovery if the XCom communication stack is in use for the group, and also used for group communication connections if the MySQL communication stack is in use for the group. With the MySQL communication stack, the account must have the `GROUP_REPLICATION_STREAM` permission.

It is possible to set an empty user name by specifying `MASTER_USER=''`, but the replication channel cannot be started with an empty user name. In releases before MySQL 8.0.21, only set an empty `MASTER_USER` user name if you need to clear previously used credentials from the replication metadata repositories for security purposes. Do not use the channel afterwards, due to a bug in these releases that can substitute a default user name if an empty user name is read from the repositories (for example, during an automatic restart of a Group Replication channel). From MySQL 8.0.21, it is valid to set an empty `MASTER_USER` user name and use the channel afterwards if you always provide user credentials using the `START REPLICA` statement or `START GROUP_REPLICATION` statement that starts the replication channel. This approach means that the replication channel always needs operator intervention to restart, but the user credentials are not recorded in the replication metadata repositories.

Important

To connect to the source using a replication user account that authenticates with the `caching_sha2_password` plugin, you must either set up a secure connection as described in Section 19.3.1, “Setting Up Replication to Use Encrypted Connections”, or enable the unencrypted connection to support password exchange using an RSA key pair. The `caching_sha2_password` authentication plugin is the default for new users created from MySQL 8.0 (for details, see Section 8.4.1.2, “Caching SHA-2 Pluggable Authentication”). If the user account that you create or use for replication uses this authentication plugin, and you are not using a secure connection, you must enable RSA key pair-based password exchange for a successful connection. You can do this using either the `MASTER_PUBLIC_KEY_PATH` option or the `GET_MASTER_PUBLIC_KEY=1` option for this statement.
```

`MASTER_ZSTD_COMPRESSION_LEVEL = level` :   O nível de compressão a ser utilizado para conexões ao servidor de origem da replicação que utilizam o algoritmo de compressão `zstd`. Os níveis permitidos variam de 1 a 22, com valores maiores indicando níveis de compressão crescentes. O nível padrão é 3. `MASTER_ZSTD_COMPRESSION_LEVEL` está disponível a partir do MySQL 8.0.18.

```
The compression level setting has no effect on connections that do not use `zstd` compression. For more information, see Section 6.2.8, “Connection Compression Control”.
```

`NETWORK_NAMESPACE = 'namespace'` :   O espaço de rede a ser utilizado para as conexões TCP/IP com o servidor de origem da replicação ou, se a pilha de comunicação MySQL estiver em uso, para as conexões de comunicação de grupo da Replicação em Grupo. O comprimento máximo do valor da string é de 64 caracteres. Se esta opção for omitida, as conexões da réplica utilizam o namespace padrão (global). Em plataformas que não implementam suporte para espaço de rede, ocorre falha quando a réplica tenta se conectar à origem. Para obter informações sobre espaços de rede, consulte a Seção 7.1.14, “Suporte a Espaço de Rede”. `NETWORK_NAMESPACE` está disponível a partir do MySQL 8.0.22.

`PRIVILEGE_CHECKS_USER = {NULL | 'account'}` :   Nomeia uma conta de usuário que fornece um contexto de segurança para o canal especificado. `NULL`, que é o padrão, significa que não é usado nenhum contexto de segurança. `PRIVILEGE_CHECKS_USER` está disponível a partir do MySQL 8.0.18.

````
The user name and host name for the user account must follow the syntax described in Section 8.2.4, “Specifying Account Names”, and the user must not be an anonymous user (with a blank user name) or the `CURRENT_USER`. The account must have the `REPLICATION_APPLIER` privilege, plus the required privileges to execute the transactions replicated on the channel. For details of the privileges required by the account, see Section 19.3.3, “Replication Privilege Checks”. When you restart the replication channel, the privilege checks are applied from that point on. If you do not specify a channel and no other channels exist, the statement is applied to the default channel.

The use of row-based binary logging is strongly recommended when `PRIVILEGE_CHECKS_USER` is set, and you can set `REQUIRE_ROW_FORMAT` to enforce this. For example, to start privilege checks on the channel `channel_1` on a running replica, issue the following statements:

```
mysql> STOP REPLICA FOR CHANNEL 'channel_1';
mysql> CHANGE MASTER TO
         PRIVILEGE_CHECKS_USER = 'priv_repl'@'%.example.com',
         REQUIRE_ROW_FORMAT = 1,
         FOR CHANNEL 'channel_1';
mysql> START REPLICA FOR CHANNEL 'channel_1';
```

For releases from MySQL 8.0.22, use `START REPLICA` and `STOP REPLICA`, and for releases before MySQL 8.0.22, use `START SLAVE` and `STOP SLAVE`. The statements work in the same way, only the terminology has changed.
````

`RELAY_LOG_FILE = 'relay_log_file'` , `RELAY_LOG_POS = 'relay_log_pos'` :   O nome do arquivo de log do relé e a localização nesse arquivo, onde o fio de SQL de replicação começa a ler o log de relé da réplica na próxima vez que o fio começar. `RELAY_LOG_FILE` pode usar um caminho absoluto ou relativo e usa o mesmo nome de base que `MASTER_LOG_FILE`. O comprimento máximo do valor da string é de 511 caracteres.

```
A `CHANGE MASTER TO` statement using `RELAY_LOG_FILE`, `RELAY_LOG_POS`, or both options can be executed on a running replica when the replication SQL thread is stopped. Relay logs are preserved if at least one of the replication SQL (applier) thread and the replication I/O (receiver) thread is running. If both threads are stopped, all relay log files are deleted unless at least one of `RELAY_LOG_FILE` or `RELAY_LOG_POS` is specified. For the Group Replication applier channel (`group_replication_applier`), which only has an applier thread and no receiver thread, this is the case if the applier thread is stopped, but with that channel you cannot use the `RELAY_LOG_FILE` and `RELAY_LOG_POS` options.
```

`REQUIRE_ROW_FORMAT = {0|1}` :   Permite que apenas eventos de replicação baseados em linhas sejam processados pelo canal de replicação. Esta opção impede que o aplicável de replicação tome ações como a criação de tabelas temporárias e a execução de solicitações `LOAD DATA INFILE`s, o que aumenta a segurança do canal. A opção `REQUIRE_ROW_FORMAT` está desativada por padrão para canais de replicação assíncrona, mas está ativada por padrão para canais de replicação em grupo e não pode ser desativada para eles. Para mais informações, consulte a Seção 19.3.3, “Verificação de privilégios de replicação”. `REQUIRE_ROW_FORMAT` está disponível a partir do MySQL 8.0.19.

`REQUIRE_TABLE_PRIMARY_KEY_CHECK = {STREAM | ON | OFF}` : Permite que uma replica selecione sua própria política para verificações de chave primária. O padrão é `STREAM`. `REQUIRE_TABLE_PRIMARY_KEY_CHECK` está disponível a partir do MySQL 8.0.20.

```
When the option is set to `ON` for a replication channel, the replica always uses the value `ON` for the `sql_require_primary_key` system variable in replication operations, requiring a primary key. When the option is set to `OFF`, the replica always uses the value `OFF` for the `sql_require_primary_key` system variable in replication operations, so that a primary key is never required, even if the source required one. When the `REQUIRE_TABLE_PRIMARY_KEY_CHECK` option is set to `STREAM`, which is the default, the replica uses whatever value is replicated from the source for each transaction.

For multisource replication, setting `REQUIRE_TABLE_PRIMARY_KEY_CHECK` to `ON` or `OFF` enables a replica to normalize behavior across the replication channels for different sources, and keep a consistent setting for the `sql_require_primary_key` system variable. Using `ON` safeguards against the accidental loss of primary keys when multiple sources update the same set of tables. Using `OFF` allows sources that can manipulate primary keys to work alongside sources that cannot.

When `PRIVILEGE_CHECKS_USER` is set, setting `REQUIRE_TABLE_PRIMARY_KEY_CHECK` to `ON` or `OFF` means that the user account does not need session administration level privileges to set restricted session variables, which are required to change the value of `sql_require_primary_key` to match the source's setting for each transaction. For more information, see Section 19.3.3, “Replication Privilege Checks”.
```

`SOURCE_CONNECTION_AUTO_FAILOVER = {0|1}` :   Ativa o mecanismo de falha de conexão assíncrona para um canal de replicação se um ou mais servidores de origem de replicação alternativos estiverem disponíveis (assim, quando houver vários servidores MySQL ou grupos de servidores que compartilham os dados replicados). `SOURCE_CONNECTION_AUTO_FAILOVER` está disponível a partir do MySQL 8.0.22. O padrão é 0, o que significa que o mecanismo não está ativado. Para obter informações completas e instruções para configurar essa funcionalidade, consulte a Seção 19.4.9.2, “Falha de Conexão Assíncrona para Replicas”.

```
The asynchronous connection failover mechanism takes over after the reconnection attempts controlled by `MASTER_CONNECT_RETRY` and `MASTER_RETRY_COUNT` are exhausted. It reconnects the replica to an alternative source chosen from a specified source list, which you manage using the `asynchronous_connection_failover_add_source` and `asynchronous_connection_failover_delete_source` functions. To add and remove managed groups of servers, use the `asynchronous_connection_failover_add_managed` and `asynchronous_connection_failover_delete_managed` functions instead. For more information, see Section 19.4.9, “Switching Sources and Replicas with Asynchronous Connection Failover”.

Important

1. You can only set `SOURCE_CONNECTION_AUTO_FAILOVER = 1` when GTID auto-positioning is in use (`MASTER_AUTO_POSITION = 1`).

2. When you set `SOURCE_CONNECTION_AUTO_FAILOVER = 1`, set `MASTER_RETRY_COUNT` and `MASTER_CONNECT_RETRY` to minimal numbers that just allow a few retry attempts with the same source in a short time, in case the connection failure is caused by a transient network outage. Otherwise the asynchronous connection failover mechanism cannot be activated promptly. Suitable values are `MASTER_RETRY_COUNT=3` and `MASTER_CONNECT_RETRY=10`, which make the replica retry the connection 3 times with 10-second intervals between.

3. When you set `SOURCE_CONNECTION_AUTO_FAILOVER = 1`, the replication metadata repositories must contain the credentials for a replication user account that can be used to connect to all the servers on the source list for the replication channel. These credentials can be set using the `CHANGE REPLICATION SOURCE TO` statement with the `MASTER_USER` and `MASTER_PASSWORD` options. For more information, see Section 19.4.9, “Switching Sources and Replicas with Asynchronous Connection Failover”.

4. From MySQL 8.0.27, when you set `SOURCE_CONNECTION_AUTO_FAILOVER = 1`, asynchronous connection failover for replicas is automatically activated if this replication channel is on a Group Replication primary in a group in single-primary mode. With this function active, if the primary that is replicating goes offline or into an error state, the new primary starts replication on the same channel when it is elected. If you want to use the function, this replication channel must also be set up on all the secondary servers in the replication group, and on any new joining members. (If the servers are provisioned using MySQL’s clone functionality, this all happens automatically.) If you do not want to use the function, disable it by using the `group_replication_disable_member_action` function to disable the Group Replication member action `mysql_start_failover_channels_if_primary`, which is enabled by default. For more information, see Section 19.4.9.2, “Asynchronous Connection Failover for Replicas”.
```

##### Exemplos

`CHANGE MASTER TO` é útil para configurar uma replica quando você tem o instantâneo da fonte e registrou as coordenadas do log binário da fonte correspondentes ao momento do instantâneo. Após carregar o instantâneo na replica para sincronizá-la com a fonte, você pode executar `CHANGE MASTER TO MASTER_LOG_FILE='log_name', MASTER_LOG_POS=log_pos` na replica para especificar as coordenadas nas quais a replica deve começar a ler o log binário da fonte. O exemplo a seguir altera o servidor fonte que a replica usa e estabelece as coordenadas do log binário da fonte a partir das quais a replica começa a ler:

```
CHANGE MASTER TO
  MASTER_HOST='source2.example.com',
  MASTER_USER='replication',
  MASTER_PASSWORD='password',
  MASTER_PORT=3306,
  MASTER_LOG_FILE='source2-bin.001',
  MASTER_LOG_POS=4,
  MASTER_CONNECT_RETRY=10;
```

Para que o procedimento de alternar uma replica existente para uma nova fonte durante o failover, consulte a Seção 19.4.8, “Alternar fontes durante o failover”.

Quando os GTIDs estão em uso na fonte e na replica, especifique o posicionamento automático do GTID em vez de fornecer a posição do arquivo de log binário, como no exemplo a seguir. Para obter instruções completas sobre como configurar e iniciar a replicação baseada em GTIDs em servidores novos ou parados, servidores online ou réplicas adicionais, consulte a Seção 19.1.3, “Replicação com Identificadores Globais de Transação”.

```
CHANGE MASTER TO
  MASTER_HOST='source3.example.com',
  MASTER_USER='replication',
  MASTER_PASSWORD='password',
  MASTER_PORT=3306,
  MASTER_AUTO_POSITION = 1,
  FOR CHANNEL "source_3";
```

Neste exemplo, a replicação de múltiplas fontes está em uso, e a instrução `CHANGE MASTER TO` é aplicada ao canal de replicação `"source_3"` que conecta a replica ao host especificado. Para obter orientações sobre a configuração da replicação de múltiplas fontes, consulte a Seção 19.1.5, “Replicação de Múltiplas Fontes do MySQL”.

O próximo exemplo mostra como fazer com que a replica aplique transações de arquivos de log de retransmissão que você deseja repetir. Para isso, a fonte não precisa ser acessível. Você pode usar `CHANGE MASTER TO` para localizar a posição do log de retransmissão onde você deseja que a replica comece a reaplicar as transações e, em seguida, iniciar o thread SQL:

```
CHANGE MASTER TO
  RELAY_LOG_FILE='replica-relay-bin.006',
  RELAY_LOG_POS=4025;
START SLAVE SQL_THREAD;
```

`CHANGE MASTER TO` também pode ser usado para pular transações no log binário que estão causando a interrupção da replicação. O método apropriado para fazer isso depende se os GTIDs estão em uso ou não. Para obter instruções sobre como pular transações usando `CHANGE MASTER TO` ou outro método, consulte a Seção 19.1.7.3, “Pular Transações”.
