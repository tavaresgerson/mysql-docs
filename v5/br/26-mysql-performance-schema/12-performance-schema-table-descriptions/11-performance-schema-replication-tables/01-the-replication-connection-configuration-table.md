#### 25.12.11.1 A Tabela replication_connection_configuration

Esta tabela exibe os parâmetros de configuração utilizados pela Replica para conectar-se à Source. Os parâmetros armazenados na tabela podem ser alterados em tempo de execução com a instrução [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement"), conforme indicado nas descrições das colunas.

Em comparação com a tabela [`replication_connection_status`](performance-schema-replication-connection-status-table.html "25.12.11.2 The replication_connection_status Table"), a [`replication_connection_configuration`](performance-schema-replication-connection-configuration-table.html "25.12.11.1 A replication_connection_configuration Table") muda com menos frequência. Ela contém valores que definem como a Replica se conecta à Source e que permanecem constantes durante a Connection, enquanto a [`replication_connection_status`](performance-schema-replication-connection-status-table.html "25.12.11.2 The replication_connection_status Table") contém valores que mudam durante a Connection.

A tabela [`replication_connection_configuration`](performance-schema-replication-connection-configuration-table.html "25.12.11.1 The replication_connection_configuration Table") possui as seguintes colunas. As descrições das colunas indicam as opções correspondentes do `CHANGE MASTER TO` a partir das quais os valores da coluna são extraídos, e a tabela apresentada posteriormente nesta seção mostra a correspondência entre as colunas de [`replication_connection_configuration`](performance-schema-replication-connection-configuration-table.html "25.12.11.1 The replication_connection_configuration Table") e as colunas de [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement").

* `CHANNEL_NAME`

  O Replication Channel que esta linha está exibindo. Sempre existe um Replication Channel padrão, e mais canais podem ser adicionados. Consulte [Seção 16.2.2, “Replication Channels”](replication-channels.html "16.2.2 Replication Channels") para mais informações. (Opção do `CHANGE MASTER TO`: `FOR CHANNEL`)

* `HOST`

  O servidor Source de Replication ao qual a Replica está conectada. (Opção do `CHANGE MASTER TO`: `MASTER_HOST`)

* `PORT`

  A porta usada para conectar-se ao servidor Source de Replication. (Opção do `CHANGE MASTER TO`: `MASTER_PORT`)

* `USER`

  O nome de usuário da conta usada para conectar-se ao servidor Source de Replication. (Opção do `CHANGE MASTER TO`: `MASTER_USER`)

* `NETWORK_INTERFACE`

  A interface de rede à qual a Replica está vinculada, se houver. (Opção do `CHANGE MASTER TO`: `MASTER_BIND`)

* `AUTO_POSITION`

  1 se o Autopositioning estiver em uso; caso contrário, 0. (Opção do `CHANGE MASTER TO`: `MASTER_AUTO_POSITION`)

* `SSL_ALLOWED`, `SSL_CA_FILE`, `SSL_CA_PATH`, `SSL_CERTIFICATE`, `SSL_CIPHER`, `SSL_KEY`, `SSL_VERIFY_SERVER_CERTIFICATE`, `SSL_CRL_FILE`, `SSL_CRL_PATH`

  Estas colunas mostram os parâmetros SSL usados pela Replica para conectar-se ao servidor Source de Replication, se houver.

  `SSL_ALLOWED` tem os seguintes valores:

  + `Yes` se uma Connection SSL para a Source for permitida

  + `No` se uma Connection SSL para a Source não for permitida

  + `Ignored` se uma Connection SSL for permitida, mas a Replica não tiver o suporte SSL ativado

  Opções do `CHANGE MASTER TO` para as outras colunas SSL: `MASTER_SSL_CA`, `MASTER_SSL_CAPATH`, `MASTER_SSL_CERT`, `MASTER_SSL_CIPHER`, `MASTER_SSL_CRL`, `MASTER_SSL_CRLPATH`, `MASTER_SSL_KEY`, `MASTER_SSL_VERIFY_SERVER_CERT`.

* `CONNECTION_RETRY_INTERVAL`

  O número de segundos entre as tentativas de Retry da Connection. (Opção do `CHANGE MASTER TO`: `MASTER_CONNECT_RETRY`)

* `CONNECTION_RETRY_COUNT`

  O número de vezes que a Replica pode tentar reconectar-se à Source em caso de perda da Connection. (Opção do `CHANGE MASTER TO`: `MASTER_RETRY_COUNT`)

* `HEARTBEAT_INTERVAL`

  O intervalo do Heartbeat de Replication em uma Replica, medido em segundos. (Opção do `CHANGE MASTER TO`: `MASTER_HEARTBEAT_PERIOD`)

* `TLS_VERSION`

  A versão TLS utilizada na Source. Para informações sobre a versão TLS, consulte [Seção 6.3.2, “Encrypted Connection TLS Protocols and Ciphers”](encrypted-connection-protocols-ciphers.html "6.3.2 Encrypted Connection TLS Protocols and Ciphers"). (Opção do `CHANGE MASTER TO`: `MASTER_TLS_VERSION`)

  Esta coluna foi adicionada no MySQL 5.7.10.

A instrução [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") não é permitida para a tabela [`replication_connection_configuration`](performance-schema-replication-connection-configuration-table.html "25.12.11.1 The replication_connection_configuration Table").

A tabela a seguir mostra a correspondência entre as colunas de [`replication_connection_configuration`](performance-schema-replication-connection-configuration-table.html "25.12.11.1 The replication_connection_configuration Table") e as colunas de [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement").

<table summary="Correspondência entre as colunas de replication_connection_configuration e as colunas de SHOW SLAVE STATUS"><col style="width: 60%"/><col style="width: 40%"/><thead><tr> <th>Coluna <code>replication_connection_configuration</code></th> <th>Coluna <code>SHOW SLAVE STATUS</code></th> </tr></thead><tbody><tr> <td><code>CHANNEL_NAME</code></td> <td><code>Channel_name</code></td> </tr><tr> <td><code>HOST</code></td> <td><code>Master_Host</code></td> </tr><tr> <td><code>PORT</code></td> <td><code>Master_Port</code></td> </tr><tr> <td><code>USER</code></td> <td><code>Master_User</code></td> </tr><tr> <td><code>NETWORK_INTERFACE</code></td> <td><code>Master_Bind</code></td> </tr><tr> <td><code>AUTO_POSITION</code></td> <td><code>Auto_Position</code></td> </tr><tr> <td><code>SSL_ALLOWED</code></td> <td><code>Master_SSL_Allowed</code></td> </tr><tr> <td><code>SSL_CA_FILE</code></td> <td><code>Master_SSL_CA_File</code></td> </tr><tr> <td><code>SSL_CA_PATH</code></td> <td><code>Master_SSL_CA_Path</code></td> </tr><tr> <td><code>SSL_CERTIFICATE</code></td> <td><code>Master_SSL_Cert</code></td> </tr><tr> <td><code>SSL_CIPHER</code></td> <td><code>Master_SSL_Cipher</code></td> </tr><tr> <td><code>SSL_KEY</code></td> <td><code>Master_SSL_Key</code></td> </tr><tr> <td><code>SSL_VERIFY_SERVER_CERTIFICATE</code></td> <td><code>Master_SSL_Verify_Server_Cert</code></td> </tr><tr> <td><code>SSL_CRL_FILE</code></td> <td><code>Master_SSL_Crl</code></td> </tr><tr> <td><code>SSL_CRL_PATH</code></td> <td><code>Master_SSL_Crlpath</code></td> </tr><tr> <td><code>CONNECTION_RETRY_INTERVAL</code></td> <td><code>Connect_Retry</code></td> </tr><tr> <td><code>CONNECTION_RETRY_COUNT</code></td> <td><code>Master_Retry_Count</code></td> </tr><tr> <td><code>HEARTBEAT_INTERVAL</code></td> <td>Nenhuma</td> </tr><tr> <td><code>TLS_VERSION</code></td> <td><code>Master_TLS_Version</code></td> </tr> </tbody></table>
