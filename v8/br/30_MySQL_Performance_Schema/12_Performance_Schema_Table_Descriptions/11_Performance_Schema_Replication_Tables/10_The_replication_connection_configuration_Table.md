#### 29.12.11.10 A tabela replication\_connection\_configuration

Esta tabela mostra os parâmetros de configuração usados pela replica para se conectar à fonte. Os parâmetros armazenados na tabela podem ser alterados em tempo de execução com a instrução `CHANGE REPLICATION SOURCE TO` (a partir do MySQL 8.0.23) ou a instrução `CHANGE MASTER TO` (antes do MySQL 8.0.23).

Comparado à tabela `replication_connection_status`, a tabela `replication_connection_configuration` muda com menos frequência. Ela contém valores que definem como a replica se conecta à fonte e que permanecem constantes durante a conexão, enquanto a tabela `replication_connection_status` contém valores que mudam durante a conexão.

A tabela `replication_connection_configuration` tem as seguintes colunas. As descrições das colunas indicam as opções correspondentes `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` a partir das quais os valores das colunas são obtidos, e a tabela fornecida mais adiante nesta seção mostra a correspondência entre as colunas `replication_connection_configuration` e as colunas `SHOW REPLICA STATUS`.

- `CHANNEL_NAME`

  O canal de replicação que esta linha está exibindo. Há sempre um canal de replicação padrão, e mais canais de replicação podem ser adicionados. Consulte a Seção 19.2.2, “Canais de Replicação” para obter mais informações. (Opção `CHANGE REPLICATION SOURCE TO`: `FOR CHANNEL`, opção `CHANGE MASTER TO`: `FOR CHANNEL`)

- `HOST`

  O nome do host da fonte ao qual a replica está conectada. (Opção `CHANGE REPLICATION SOURCE TO`: `SOURCE_HOST`, opção `CHANGE MASTER TO`: `MASTER_HOST`)

- `PORT`

  O porto usado para se conectar à fonte. (Opção `CHANGE REPLICATION SOURCE TO`: `SOURCE_PORT`, opção `CHANGE MASTER TO`: `MASTER_PORT`)

- `USER`

  O nome de usuário da conta de usuário de replicação usada para se conectar à fonte. (Opção `CHANGE REPLICATION SOURCE TO`: `SOURCE_USER`, opção `CHANGE MASTER TO`: `MASTER_USER`)

- `NETWORK_INTERFACE`

  A interface de rede à qual a réplica está vinculada, se houver. (Opção `CHANGE REPLICATION SOURCE TO`: `SOURCE_BIND`, opção `CHANGE MASTER TO`: `MASTER_BIND`)

- `AUTO_POSITION`

  1 se o autoposicionamento do GTID estiver em uso; caso contrário, 0. (Opção `CHANGE REPLICATION SOURCE TO` `SOURCE_AUTO_POSITION` e opção `CHANGE MASTER TO` `MASTER_AUTO_POSITION`)

- `SSL_ALLOWED`, `SSL_CA_FILE`, `SSL_CA_PATH`, `SSL_CERTIFICATE`, `SSL_CIPHER`, `SSL_KEY`, `SSL_VERIFY_SERVER_CERTIFICATE`, `SSL_CRL_FILE`, `SSL_CRL_PATH`

  Essas colunas mostram os parâmetros SSL usados pela replica para se conectar à fonte, se houver.

  `SSL_ALLOWED` tem esses valores:

  - `Yes` se uma conexão SSL para a fonte for permitida

  - `No` se uma conexão SSL para a fonte não for permitida

  - `Ignored` se uma conexão SSL for permitida, mas a replica não tiver o suporte SSL habilitado

  (Opções `CHANGE REPLICATION SOURCE TO` para as outras colunas SSL: `SOURCE_SSL_CA`, `SOURCE_SSL_CAPATH`, `SOURCE_SSL_CERT`, `SOURCE_SSL_CIPHER`, `SOURCE_SSL_CRL`, `SOURCE_SSL_CRLPATH`, `SOURCE_SSL_KEY`, `SOURCE_SSL_VERIFY_SERVER_CERT`.

  Opções `CHANGE MASTER TO` para as outras colunas SSL: `MASTER_SSL_CA`, `MASTER_SSL_CAPATH`, `MASTER_SSL_CERT`, `MASTER_SSL_CIPHER`, `MASTER_SSL_CRL`, `MASTER_SSL_CRLPATH`, `MASTER_SSL_KEY`, `MASTER_SSL_VERIFY_SERVER_CERT`.

- `CONNECTION_RETRY_INTERVAL`

  O número de segundos entre as tentativas de conexão. (Opção `CHANGE REPLICATION SOURCE TO`: `SOURCE_CONNECT_RETRY`, opção `CHANGE MASTER TO`: `MASTER_CONNECT_RETRY`)

- `CONNECTION_RETRY_COUNT`

  O número de vezes que a réplica pode tentar se reconectar à fonte em caso de perda de conexão. (Opção `CHANGE REPLICATION SOURCE TO`: `SOURCE_RETRY_COUNT`, opção `CHANGE MASTER TO`: `MASTER_RETRY_COUNT`)

- `HEARTBEAT_INTERVAL`

  O intervalo de batida de replicação em uma replica, medido em segundos. (Opção `CHANGE REPLICATION SOURCE TO`: `SOURCE_HEARTBEAT_PERIOD`, opção `CHANGE MASTER TO`: `MASTER_HEARTBEAT_PERIOD`)

- `TLS_VERSION`

  A lista das versões do protocolo TLS permitidas pela réplica para a conexão de replicação. Para informações sobre a versão do TLS, consulte a Seção 8.3.2, “Protocolos e cifra de conexão TLS criptografada”. (Opção `CHANGE REPLICATION SOURCE TO`: `SOURCE_TLS_VERSION`, opção `CHANGE MASTER TO`: `MASTER_TLS_VERSION`)

- `TLS_CIPHERSUITES`

  A lista de conjuntos de cifras permitidos pela réplica para a conexão de replicação. Para informações sobre conjuntos de cifras TLS, consulte a Seção 8.3.2, “Protocolos e cifras TLS de conexão encriptada”. (Opção `CHANGE REPLICATION SOURCE TO`: `SOURCE_TLS_CIPHERSUITES`, opção `CHANGE MASTER TO`: `MASTER_TLS_CIPHERSUITES`)

- `PUBLIC_KEY_PATH`

  O nome do caminho de um arquivo que contém uma cópia do lado do replicador da chave pública necessária pelo ponto de origem para a troca de senhas baseada em pares de chaves RSA. O arquivo deve estar no formato PEM. Esta coluna se aplica a réplicas que se autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. (Opção `CHANGE REPLICATION SOURCE TO`: `SOURCE_PUBLIC_KEY_PATH`, opção `CHANGE MASTER TO`: `MASTER_PUBLIC_KEY_PATH`)

  Se `PUBLIC_KEY_PATH` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `GET_PUBLIC_KEY`.

- `GET_PUBLIC_KEY`

  Se solicitar a chave pública necessária para a troca de senhas baseada em pares de chaves RSA da fonte. Esta coluna se aplica a réplicas que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, a fonte não envia a chave pública a menos que seja solicitada. (Opção `CHANGE REPLICATION SOURCE TO`: `GET_SOURCE_PUBLIC_KEY`, opção `CHANGE MASTER TO`: `GET_MASTER_PUBLIC_KEY`)

  Se `PUBLIC_KEY_PATH` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `GET_PUBLIC_KEY`.

- `NETWORK_NAMESPACE`

  O nome do espaço de rede; vazio se a conexão estiver usando o espaço de rede padrão (global). Para informações sobre espaços de rede, consulte a Seção 7.1.14, “Suporte a Espaço de Rede”. Esta coluna foi adicionada no MySQL 8.0.22.

- `COMPRESSION_ALGORITHM`

  Os algoritmos de compressão permitidos para conexões à fonte. (Opção `CHANGE REPLICATION SOURCE TO`: `SOURCE_COMPRESSION_ALGORITHMS`, opção `CHANGE MASTER TO`: `MASTER_COMPRESSION_ALGORITHMS`)

  Para obter mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

  Esta coluna foi adicionada no MySQL 8.0.18.

- `ZSTD_COMPRESSION_LEVEL`

  O nível de compressão a ser usado para conexões à fonte que utilizam o algoritmo de compressão `zstd`. (Opção `CHANGE REPLICATION SOURCE TO`: `SOURCE_ZSTD_COMPRESSION_LEVEL`, opção `CHANGE MASTER TO`: `MASTER_ZSTD_COMPRESSION_LEVEL`)

  Para obter mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

  Esta coluna foi adicionada no MySQL 8.0.18.

- `SOURCE_CONNECTION_AUTO_FAILOVER`

  Se o mecanismo de falha de reposição de conexão assíncrona está ativado para este canal de replicação. (Opção `CHANGE REPLICATION SOURCE TO`: `SOURCE_CONNECTION_AUTO_FAILOVER`, opção `CHANGE MASTER TO`: `SOURCE_CONNECTION_AUTO_FAILOVER`)

  Para obter mais informações, consulte a Seção 19.4.9, “Alternar fontes e réplicas com falha de reatamento de conexão assíncrona”.

  Esta coluna foi adicionada no MySQL 8.0.22.

- `GTID_ONLY`

  Indica se este canal utiliza apenas GTIDs para a fila de transações e o processo de aplicação e para a recuperação, e não persiste os nomes e posições dos arquivos de log binário e log de retransmissão nos repositórios de metadados de replicação. (Opção `CHANGE REPLICATION SOURCE TO`: `GTID_ONLY`, opção `CHANGE MASTER TO`: `GTID_ONLY`)

  Para obter mais informações, consulte a Seção 20.4.1, “GTIDs e Replicação de Grupo”.

  Esta coluna foi adicionada no MySQL 8.0.27.

A tabela `replication_connection_configuration` tem esses índices:

- Chave primária em (`CHANNEL_NAME`)

`TRUNCATE TABLE` não é permitido para a tabela `replication_connection_configuration`.

A tabela a seguir mostra a correspondência entre as colunas `replication_connection_configuration` e as colunas `SHOW REPLICA STATUS`.

<table summary="Correspondência entre as colunas replication_connection_configuration e as colunas SHOW REPLICA STATUS"><thead><tr> <th>[[PH_HTML_CODE_<code>NETWORK_INTERFACE</code>] Coluna</th> <th>[[PH_HTML_CODE_<code>NETWORK_INTERFACE</code>] Coluna</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CODE_<code>AUTO_POSITION</code>]</td> <td>[[PH_HTML_CODE_<code>Auto_Position</code>]</td> </tr><tr> <td>[[PH_HTML_CODE_<code>SSL_ALLOWED</code>]</td> <td>[[PH_HTML_CODE_<code>Source_SSL_Allowed</code>]</td> </tr><tr> <td>[[PH_HTML_CODE_<code>SSL_CA_FILE</code>]</td> <td>[[PH_HTML_CODE_<code>Source_SSL_CA_File</code>]</td> </tr><tr> <td>[[PH_HTML_CODE_<code>SSL_CA_PATH</code>]</td> <td>[[PH_HTML_CODE_<code>Source_SSL_CA_Path</code>]</td> </tr><tr> <td>[[<code>NETWORK_INTERFACE</code>]]</td> <td>[[<code>SHOW REPLICA STATUS</code><code>NETWORK_INTERFACE</code>]</td> </tr><tr> <td>[[<code>AUTO_POSITION</code>]]</td> <td>[[<code>Auto_Position</code>]]</td> </tr><tr> <td>[[<code>SSL_ALLOWED</code>]]</td> <td>[[<code>Source_SSL_Allowed</code>]]</td> </tr><tr> <td>[[<code>SSL_CA_FILE</code>]]</td> <td>[[<code>Source_SSL_CA_File</code>]]</td> </tr><tr> <td>[[<code>SSL_CA_PATH</code>]]</td> <td>[[<code>Source_SSL_CA_Path</code>]]</td> </tr><tr> <td>[[<code>CHANNEL_NAME</code><code>NETWORK_INTERFACE</code>]</td> <td>[[<code>CHANNEL_NAME</code><code>NETWORK_INTERFACE</code>]</td> </tr><tr> <td>[[<code>CHANNEL_NAME</code><code>AUTO_POSITION</code>]</td> <td>[[<code>CHANNEL_NAME</code><code>Auto_Position</code>]</td> </tr><tr> <td>[[<code>CHANNEL_NAME</code><code>SSL_ALLOWED</code>]</td> <td>[[<code>CHANNEL_NAME</code><code>Source_SSL_Allowed</code>]</td> </tr><tr> <td>[[<code>CHANNEL_NAME</code><code>SSL_CA_FILE</code>]</td> <td>[[<code>CHANNEL_NAME</code><code>Source_SSL_CA_File</code>]</td> </tr><tr> <td>[[<code>CHANNEL_NAME</code><code>SSL_CA_PATH</code>]</td> <td>[[<code>CHANNEL_NAME</code><code>Source_SSL_CA_Path</code>]</td> </tr><tr> <td>[[<code>Channel_name</code><code>NETWORK_INTERFACE</code>]</td> <td>[[<code>Channel_name</code><code>NETWORK_INTERFACE</code>]</td> </tr><tr> <td>[[<code>Channel_name</code><code>AUTO_POSITION</code>]</td> <td>[[<code>Channel_name</code><code>Auto_Position</code>]</td> </tr><tr> <td>[[<code>Channel_name</code><code>SSL_ALLOWED</code>]</td> <td>[[<code>Channel_name</code><code>Source_SSL_Allowed</code>]</td> </tr><tr> <td>[[<code>Channel_name</code><code>SSL_CA_FILE</code>]</td> <td>Nenhum</td> </tr><tr> <td>[[<code>Channel_name</code><code>Source_SSL_CA_File</code>]</td> <td>[[<code>Channel_name</code><code>SSL_CA_PATH</code>]</td> </tr><tr> <td>[[<code>Channel_name</code><code>Source_SSL_CA_Path</code>]</td> <td>[[<code>HOST</code><code>NETWORK_INTERFACE</code>]</td> </tr><tr> <td>[[<code>HOST</code><code>NETWORK_INTERFACE</code>]</td> <td>[[<code>HOST</code><code>AUTO_POSITION</code>]</td> </tr><tr> <td>[[<code>HOST</code><code>Auto_Position</code>]</td> <td>[[<code>HOST</code><code>SSL_ALLOWED</code>]</td> </tr><tr> <td>[[<code>HOST</code><code>Source_SSL_Allowed</code>]</td> <td>[Nenhu<code>NETWORK_INTERFACE</code></td> </tr><tr> <td>[[<code>HOST</code><code>SSL_CA_FILE</code>]</td> <td>[Nenhu<code>NETWORK_INTERFACE</code></td> </tr><tr> <td>[[<code>HOST</code><code>Source_SSL_CA_File</code>]</td> <td>[Nenhu<code>NETWORK_INTERFACE</code></td> </tr></tbody></table>
