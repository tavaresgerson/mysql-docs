#### 29.12.11.12 A tabela de configuração de conexão de replicação

Esta tabela mostra os parâmetros de configuração usados pela replica para se conectar à fonte. Os parâmetros armazenados na tabela podem ser alterados em tempo de execução com a instrução `ALTERAR A FONTE DE REPLICA`.

Comparada à tabela `replication_connection_status`, a `replication_connection_configuration` muda com menos frequência. Ela contém valores que definem como a replica se conecta à fonte e que permanecem constantes durante a conexão, enquanto `replication_connection_status` contém valores que mudam durante a conexão.

A tabela `replication_connection_configuration` tem as seguintes colunas. As descrições das colunas indicam as opções correspondentes `ALTERAR A FONTE DE REPLICA PARA` das quais os valores das colunas são tirados, e a tabela fornecida mais adiante nesta seção mostra a correspondência entre as colunas `replication_connection_configuration` e as colunas `SHOW REPLICA STATUS`.

* `CHANNEL_NAME`

  O canal de replicação que esta linha está exibindo. Há sempre um canal de replicação padrão, e mais canais de replicação podem ser adicionados. Veja a Seção 19.2.2, “Canais de Replicação” para mais informações. (`Opção `ALTERAR A FONTE DE REPLICA PARA`: `FOR CHANNEL`)

* `HOST`

  O nome do host da fonte ao qual a replica está conectada. (`Opção `ALTERAR A FONTE DE REPLICA PARA`: `SOURCE_HOST`)

* `PORT`

  A porta usada para se conectar à fonte. (`Opção `ALTERAR A FONTE DE REPLICA PARA`: `SOURCE_PORT`)

* `USER`

  O nome de usuário da conta de usuário de replicação usada para se conectar à fonte. (`Opção `ALTERAR A FONTE DE REPLICA PARA`: `SOURCE_USER`)

* `NETWORK_INTERFACE`

  A interface de rede à qual a replica está vinculada, se houver. (`Opção `ALTERAR A FONTE DE REPLICA PARA`: `SOURCE_BIND`)

* `AUTO_POSITION`

1 se o autoposicionamento do GTID estiver em uso; caso contrário, 0. (`Opção `ALTERAR A FONTE DE REPLICA`: `SOURCE_AUTO_POSITION`)

* `SSL_ALLOWED`, `SSL_CA_FILE`, `SSL_CA_PATH`, `SSL_CERTIFICATE`, `SSL_CIPHER`, `SSL_KEY`, `SSL_VERIFY_SERVER_CERTIFICATE`, `SSL_CRL_FILE`, `SSL_CRL_PATH`

Essas colunas mostram os parâmetros SSL usados pela replica para se conectar à fonte, se houver.

`SSL_ALLOWED` tem esses valores:

+ `Sim` se uma conexão SSL com a fonte for permitida

+ `Não` se uma conexão SSL com a fonte não for permitida

+ `Ignorada` se uma conexão SSL for permitida, mas a replica não tiver o suporte SSL habilitado (`Opções `ALTERAR A FONTE DE REPLICA`: `SOURCE_SSL_CA`, `SOURCE_SSL_CAPATH`, `SOURCE_SSL_CERT`, `SOURCE_SSL_CIPHER`, `SOURCE_SSL_CRL`, `SOURCE_SSL_CRLPATH`, `SOURCE_SSL_KEY`, `SOURCE_SSL_VERIFY_SERVER_CERT`)

* `INTERVALO_DE_REPROVOS_CONEXAO`

O número de segundos entre os tentativos de conexão. (`Opção `ALTERAR A FONTE DE REPLICA`: `SOURCE_CONNECT_RETRY`)

* `CONTAS_DE_REPROVOS_CONEXAO`

O número de vezes que a replica pode tentar se reconectar à fonte no caso de uma conexão perdida (`Opção `ALTERAR A FONTE DE REPLICA`: `SOURCE_RETRY_COUNT`)

* `INTERVALO_DE_BATALHA_DE_REPLICA`

O intervalo de batida de replicação em uma replica, medido em segundos (`Opção `ALTERAR A FONTE DE REPLICA`: `SOURCE_HEARTBEAT_PERIOD`)

* `VERSAO_TLS`

A lista das versões do protocolo TLS permitidas pela replica para a conexão de replicação. Para informações sobre a versão TLS, consulte a Seção 8.3.2, “Protocolos e Cifras de Conexão TLS Encriptada”. (`Opção `ALTERAR A FONTE DE REPLICA`: `SOURCE_TLS_VERSION`)

* `TLS_CIPHERESUITES`

A lista de conjuntos de cifra permitidos pela réplica para a conexão de replicação. Para informações sobre conjuntos de cifra TLS, consulte a Seção 8.3.2, “Protocolos e conjuntos de cifra TLS de conexão encriptada”. (`Opção CHANGE REPLICATION SOURCE TO`: `SOURCE_TLS_CIPHERSUITES`)

* `PUBLIC_KEY_PATH`

  O nome do caminho de um arquivo que contém uma cópia do lado da réplica da chave pública necessária pelo fonte para a troca de senha com par de chaves RSA. O arquivo deve estar no formato PEM. Esta coluna se aplica a réplicas que autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. (`Opção CHANGE REPLICATION SOURCE TO`: `SOURCE_PUBLIC_KEY_PATH`)

  Se `PUBLIC_KEY_PATH` for fornecido e especificar um arquivo de chave pública válido, ele tem precedência sobre `GET_PUBLIC_KEY`.

* `GET_PUBLIC_KEY`

  Se solicitar da fonte a chave pública necessária para a troca de senha com par de chaves RSA. Esta coluna se aplica a réplicas que autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, a fonte não envia a chave pública a menos que seja solicitada. (`Opção CHANGE REPLICATION SOURCE TO`: `GET_SOURCE_PUBLIC_KEY`)

  Se `PUBLIC_KEY_PATH` for fornecido e especificar um arquivo de chave pública válido, ele tem precedência sobre `GET_PUBLIC_KEY`.

* `NETWORK_NAMESPACE`

  O nome do namespace de rede; vazio se a conexão usar o namespace padrão (global). Para informações sobre namespaces de rede, consulte a Seção 7.1.14, “Suporte a Namespace de Rede”.

* `COMPRESSION_ALGORITHM`

  Os algoritmos de compressão permitidos para conexões com a fonte. (`Opção CHANGE REPLICATION SOURCE TO`: `SOURCE_COMPRESSION_ALGORITHMS`)

  Para mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

* `ZSTD_COMPRESSION_LEVEL`

O nível de compressão a ser usado para conexões à fonte que utilizam o algoritmo de compressão `zstd`. (`Opção CHANGE REPLICATION SOURCE TO`: `SOURCE_ZSTD_COMPRESSION_LEVEL`)

Para obter mais informações, consulte a Seção 6.2.8, “Controle de compressão de conexão”.

* `SOURCE_CONNECTION_AUTO_FAILOVER`

  Se o mecanismo de failover de conexão assíncrona está ativado para este canal de replicação. (`Opção CHANGE REPLICATION SOURCE TO`: `SOURCE_CONNECTION_AUTO_FAILOVER`)

  Para obter mais informações, consulte a Seção 19.4.9, “Alternar fontes e réplicas com failover de conexão assíncrona”.

* `GTID_ONLY`

  Indica se este canal usa apenas GTIDs para a fila de transações e o processo do aplicativo e para a recuperação, e não persiste nomes e posições de arquivos do log binário e do log de retransmissão nos repositórios de metadados de replicação. (`Opção CHANGE REPLICATION SOURCE TO`: `GTID_ONLY`)

  Para obter mais informações, consulte a Seção 20.4.1, “GTIDs e replicação em grupo”.

A tabela `replication_connection_configuration` tem esses índices:

* Chave primária em (`CHANNEL_NAME`)

O `TRUNCATE TABLE` não é permitido para a tabela `replication_connection_configuration`.

A tabela a seguir mostra a correspondência entre as colunas `replication_connection_configuration` e as colunas `SHOW REPLICA STATUS`.

<table summary="Correspondência entre as colunas `replication_connection_configuration` e `SHOW REPLICA STATUS`">
<tr><th><code>replication_connection_configuration</code></th><th><code>SHOW REPLICA STATUS</code></th></tr>
<tr><th><code>CHANNEL_NAME</code></th><th><code>Channel_name</code></th></tr>
<tr><th><code>HOST</code></th><th><code>Source_Host</code></th></tr>
<tr><th><code>PORT</code></th><th><code>Source_Port</code></th></tr>
<tr><th><code>USER</code></th><th><code>Source_User</code></th></tr>
<tr><th><code>NETWORK_INTERFACE</code></th><th><code>Source_Bind</code></th></tr>
<tr><th><code>AUTO_POSITION</code></th><th><code>Auto_Position</code></th></tr>
<tr><th><code>SSL_ALLOWED</code></th><th><code>Source_SSL_Allowed</code></th></tr>
<tr><th><code>SSL_CA_FILE</code></th><th><code>Source_SSL_CA_File</code></th></tr>
<tr><th><code>SSL_CA_PATH</code></th><th><code>Source_SSL_CA_Path</code></th></tr>
<tr><th><code>SSL_CERTIFICATE</code></th><th><code>Source_SSL_Cert</code></th></tr>
<tr><th><code>SSL_CIPHER</code></th><th><code>Source_SSL_Cipher</code></th></tr>
<tr><th><code>SSL_KEY</code></th><th><code>Source_SSL_Key</code></th></tr>
<tr><th><code>SSL_VERIFY_SERVER_CERTIFICATE</code></th><th><code>Source_SSL_Verify_Server_Cert</code></th></tr>
<tr><th><code>SSL_CRL_FILE</code></th><th><code>Source_SSL_Crl</code></th></tr>
<tr><th><code>SSL_CRL_PATH</code></th><th><code>Source_SSL_Crlpath</code></th></tr>
<tr><th><code>CONNECTION_RETRY_INTERVAL</code></th><th><code>Source_Connect_Retry</code></th></tr>
<tr><th><code>CONNECTION_RETRY_COUNT</code></th><th><code>Source_Retry_Count</code></th></tr>
<tr><th><code>HEARTBEAT_INTERVAL</code></th><th>Nenhum</th></tr>
<tr><th><code>TLS_VERSION</code></th><th><code>Source_TLS_Version</code></th></tr>
<tr><th><code>PUBLIC_KEY_PATH</code></th><th><code>Source_public_key_path</code></th></tr>
<tr><th><code>GET_PUBLIC_KEY</code></th><th><code>Get_source_public_key</code></th></tr>
<tr><th><code>NETWORK_NAMESPACE</code></th><th><code>Network_Namespace</code></th></tr>
<tr><th><code>COMPRESSION_ALGORITHM</code></th><th>[Nenhum]</th></tr>
<tr><th><code>ZSTD_COMPRESSION_LEVEL</code></th><th>[Nenhum]</th></tr>
<tr><th><code>GTID_ONLY</code></th><th>[Nenhum]</th></tr>
</table>