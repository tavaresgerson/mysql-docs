#### 25.12.11.1 Tabela de configuração de conexão de replicação

Esta tabela mostra os parâmetros de configuração usados pela replica para se conectar à fonte. Os parâmetros armazenados na tabela podem ser alterados em tempo de execução com a instrução `CHANGE MASTER TO`, conforme indicado nas descrições das colunas.

Em comparação com a tabela `replication_connection_status`, a tabela `replication_connection_configuration` muda com menos frequência. Ela contém valores que definem como a replica se conecta à fonte e que permanecem constantes durante a conexão, enquanto a tabela `replication_connection_status` contém valores que mudam durante a conexão.

A tabela `replication_connection_configuration` tem as seguintes colunas. As descrições das colunas indicam as opções correspondentes `CHANGE MASTER TO` das quais os valores das colunas são obtidos, e a tabela fornecida mais adiante nesta seção mostra a correspondência entre as colunas da tabela `replication_connection_configuration` e as colunas da tabela `SHOW SLAVE STATUS` (show-slave-status.html).

- `NOME_CANAL`

  O canal de replicação que esta linha está exibindo. Há sempre um canal de replicação padrão, e mais canais de replicação podem ser adicionados. Consulte Seção 16.2.2, “Canais de Replicação” para obter mais informações. (`Opção CHANGE MASTER TO`: `FOR CHANNEL`)

- `HOST`

  O servidor de origem de replicação ao qual a replica está conectada. (`Opção CHANGE MASTER TO`: `MASTER_HOST`)

- `PORT`

  O porto usado para se conectar ao servidor de origem da replicação. (`Opção CHANGE MASTER TO`: `MASTER_PORT`)

- `USUARIO`

  O nome de usuário da conta usada para se conectar ao servidor de origem de replicação. (`Opção ALTERAR MASTER PARA`: `MASTER_USER`)

- `NETWORK_INTERFACE`

  A interface de rede à qual a replica está vinculada, se houver. (`Opção ALTERAR MASTER PARA`: `MASTER_BIND`)

- `AUTO_POSITION`

  1 se o autoposicionamento estiver em uso; caso contrário, 0. (`Opção CHANGE MASTER TO`: `MASTER_AUTO_POSITION`)

- `SSL_ALLOWED`, `SSL_CA_FILE`, `SSL_CA_PATH`, `SSL_CERTIFICATE`, `SSL_CIPHER`, `SSL_KEY`, `SSL_VERIFY_SERVER_CERTIFICATE`, `SSL_CRL_FILE`, `SSL_CRL_PATH`

  Essas colunas mostram os parâmetros SSL usados pela replica para se conectar ao servidor de origem de replicação, se houver.

  `SSL_ALLOWED` tem esses valores:

  - Sim, se uma conexão SSL para a fonte for permitida

  - `Não` se uma conexão SSL para a fonte não for permitida

  - `Ignorado` se uma conexão SSL for permitida, mas a réplica não tiver o suporte SSL habilitado

  Opções `ALTERAR MASTER PARA` para as outras colunas SSL: `MASTER_SSL_CA`, `MASTER_SSL_CAPATH`, `MASTER_SSL_CERT`, `MASTER_SSL_CIPHER`, `MASTER_SSL_CRL`, `MASTER_SSL_CRLPATH`, `MASTER_SSL_KEY`, `MASTER_SSL_VERIFY_SERVER_CERT`.

- `INTERVALO_DE_RECOMANDO_DE_CONEXÃO`

  O número de segundos entre as tentativas de conexão. (`Opção ALTERAR MASTER PARA`: `MASTER_CONNECT_RETRY`)

- `CONNECTION_RETRY_COUNT`

  O número de vezes que a réplica pode tentar se reconectar à fonte em caso de perda de conexão. (`Opção ALTERAR MASTER PARA`: `MASTER_RETRY_COUNT`)

- `HEARTBEAT_INTERVAL`

  O intervalo de batida de replicação em uma replica, medido em segundos. (`Opção CHANGE MASTER TO`: `MASTER_HEARTBEAT_PERIOD`)

- `TLS_VERSION`

  A versão TLS usada na fonte. Para informações sobre a versão TLS, consulte Seção 6.3.2, “Protocolos e cifra de conexão encriptada”. (`Opção CHANGE MASTER TO`: `MASTER_TLS_VERSION`)

  Esta coluna foi adicionada no MySQL 5.7.10.

A operação `TRUNCATE TABLE` não é permitida para a tabela `replication_connection_configuration`.

A tabela a seguir mostra a correspondência entre as colunas da tabela `replication_connection_configuration` e as colunas da consulta `SHOW SLAVE STATUS`.

<table summary="Correspondência entre as colunas replication_connection_configuration e SHOW SLAVE STATUS"><col style="width: 60%"/><col style="width: 40%"/><thead><tr> <th>PH_HTML_CODE_<code>NETWORK_INTERFACE</code>] Coluna</th> <th>PH_HTML_CODE_<code>NETWORK_INTERFACE</code>] Coluna</th> </tr></thead><tbody><tr> <td>PH_HTML_CODE_<code>AUTO_POSITION</code>]</td> <td>PH_HTML_CODE_<code>Auto_Position</code>]</td> </tr><tr> <td>PH_HTML_CODE_<code>SSL_ALLOWED</code>]</td> <td>PH_HTML_CODE_<code>Master_SSL_Allowed</code>]</td> </tr><tr> <td>PH_HTML_CODE_<code>SSL_CA_FILE</code>]</td> <td>PH_HTML_CODE_<code>Master_SSL_CA_File</code>]</td> </tr><tr> <td>PH_HTML_CODE_<code>SSL_CA_PATH</code>]</td> <td>PH_HTML_CODE_<code>Master_SSL_CA_Path</code>]</td> </tr><tr> <td><code>NETWORK_INTERFACE</code></td> <td><code>SHOW SLAVE STATUS</code><code>NETWORK_INTERFACE</code>]</td> </tr><tr> <td><code>AUTO_POSITION</code></td> <td><code>Auto_Position</code></td> </tr><tr> <td><code>SSL_ALLOWED</code></td> <td><code>Master_SSL_Allowed</code></td> </tr><tr> <td><code>SSL_CA_FILE</code></td> <td><code>Master_SSL_CA_File</code></td> </tr><tr> <td><code>SSL_CA_PATH</code></td> <td><code>Master_SSL_CA_Path</code></td> </tr><tr> <td><code>CHANNEL_NAME</code><code>NETWORK_INTERFACE</code>]</td> <td><code>CHANNEL_NAME</code><code>NETWORK_INTERFACE</code>]</td> </tr><tr> <td><code>CHANNEL_NAME</code><code>AUTO_POSITION</code>]</td> <td><code>CHANNEL_NAME</code><code>Auto_Position</code>]</td> </tr><tr> <td><code>CHANNEL_NAME</code><code>SSL_ALLOWED</code>]</td> <td><code>CHANNEL_NAME</code><code>Master_SSL_Allowed</code>]</td> </tr><tr> <td><code>CHANNEL_NAME</code><code>SSL_CA_FILE</code>]</td> <td><code>CHANNEL_NAME</code><code>Master_SSL_CA_File</code>]</td> </tr><tr> <td><code>CHANNEL_NAME</code><code>SSL_CA_PATH</code>]</td> <td><code>CHANNEL_NAME</code><code>Master_SSL_CA_Path</code>]</td> </tr><tr> <td><code>Channel_name</code><code>NETWORK_INTERFACE</code>]</td> <td><code>Channel_name</code><code>NETWORK_INTERFACE</code>]</td> </tr><tr> <td><code>Channel_name</code><code>AUTO_POSITION</code>]</td> <td><code>Channel_name</code><code>Auto_Position</code>]</td> </tr><tr> <td><code>Channel_name</code><code>SSL_ALLOWED</code>]</td> <td><code>Channel_name</code><code>Master_SSL_Allowed</code>]</td> </tr><tr> <td><code>Channel_name</code><code>SSL_CA_FILE</code>]</td> <td>Nenhum</td> </tr><tr> <td><code>Channel_name</code><code>Master_SSL_CA_File</code>]</td> <td><code>Channel_name</code><code>SSL_CA_PATH</code>]</td> </tr></tbody></table>
