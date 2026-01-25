#### 13.4.2.1 Declaração CHANGE MASTER TO

```sql
CHANGE MASTER TO option [, option] ... [ channel_option ]

option: {
    MASTER_BIND = 'interface_name'
  | MASTER_HOST = 'host_name'
  | MASTER_USER = 'user_name'
  | MASTER_PASSWORD = 'password'
  | MASTER_PORT = port_num
  | MASTER_CONNECT_RETRY = interval
  | MASTER_RETRY_COUNT = count
  | MASTER_DELAY = interval
  | MASTER_HEARTBEAT_PERIOD = interval
  | MASTER_LOG_FILE = 'source_log_name'
  | MASTER_LOG_POS = source_log_pos
  | MASTER_AUTO_POSITION = {0|1}
  | RELAY_LOG_FILE = 'relay_log_name'
  | RELAY_LOG_POS = relay_log_pos
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
  | IGNORE_SERVER_IDS = (server_id_list)
}

channel_option:
    FOR CHANNEL channel

server_id_list:
    [server_id [, server_id] ... ]
```

[`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") altera os parâmetros que a Replica usa para se conectar ao servidor Source de replicação, para ler o Binary Log do Source e para ler o Relay Log da Replica. Também atualiza o conteúdo dos repositórios de metadados de replicação (veja [Seção 16.2.4, “Relay Log e Repositórios de Metadados de Replicação”](replica-logs.html "16.2.4 Relay Log e Repositórios de Metadados de Replicação")). `CHANGE MASTER TO` requer o privilégio [`SUPER`](privileges-provided.html#priv_super).

Antes do MySQL 5.7.4, os Threads de replicação devem ser interrompidos, usando [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement") se necessário, antes de emitir esta declaração. No MySQL 5.7.4 e posterior, você pode emitir declarações `CHANGE MASTER TO` em uma Replica em execução sem fazer isso, dependendo dos estados do SQL Thread de replicação e do I/O Thread de replicação. As regras que regem esse uso são fornecidas posteriormente nesta seção.

Ao usar uma Replica multithreaded (ou seja, [`slave_parallel_workers`](replication-options-replica.html#sysvar_slave_parallel_workers) é maior que 0), parar a Replica pode causar "gaps" (lacunas) na sequência de transações que foram executadas a partir do Relay Log, independentemente de a Replica ter sido interrompida intencionalmente ou não. Quando tais gaps existem, a emissão de [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") falha. A solução nesta situação é emitir [`START SLAVE UNTIL SQL_AFTER_MTS_GAPS`](start-slave.html "13.4.2.5 START SLAVE Statement"), o que garante que os gaps sejam fechados.

A cláusula opcional `FOR CHANNEL channel` permite que você nomeie a qual Channel de replicação a declaração se aplica. Fornecer uma cláusula `FOR CHANNEL channel` aplica a declaração `CHANGE MASTER TO` a um Channel de replicação específico e é usada para adicionar um novo Channel ou modificar um Channel existente. Por exemplo, para adicionar um novo Channel chamado channel2:

```sql
CHANGE MASTER TO MASTER_HOST=host1, MASTER_PORT=3002 FOR CHANNEL 'channel2'
```

Se nenhuma cláusula for nomeada e não existirem Channels extras, a declaração se aplica ao Channel padrão.

Ao usar múltiplos Channels de replicação, se uma declaração `CHANGE MASTER TO` não nomear um Channel usando uma cláusula `FOR CHANNEL channel`, ocorrerá um erro. Veja [Seção 16.2.2, “Replication Channels”](replication-channels.html "16.2.2 Replication Channels") para mais informações.

As opções não especificadas retêm seu valor, exceto conforme indicado na discussão a seguir. Assim, na maioria dos casos, não há necessidade de especificar opções que não mudam. Por exemplo, se a senha para conectar ao servidor Source de replicação mudou, emita esta declaração para informar a Replica sobre a nova senha:

```sql
CHANGE MASTER TO MASTER_PASSWORD='new3cret';
```

`MASTER_HOST`, `MASTER_USER`, `MASTER_PASSWORD` e `MASTER_PORT` fornecem informações à Replica sobre como se conectar ao seu servidor Source de replicação:

* `MASTER_HOST` e `MASTER_PORT` são o nome do host (ou endereço IP) do host Source e sua porta TCP/IP.

  Nota

  A replicação não pode usar arquivos de socket Unix. Você deve ser capaz de se conectar ao servidor Source de replicação usando TCP/IP.

  Se você especificar a opção `MASTER_HOST` ou `MASTER_PORT`, a Replica assume que o Source é diferente de antes (mesmo que o valor da opção seja o mesmo que seu valor atual). Neste caso, os valores antigos para o nome e a posição do arquivo Binary Log do Source são considerados não mais aplicáveis, então se você não especificar `MASTER_LOG_FILE` e `MASTER_LOG_POS` na declaração, `MASTER_LOG_FILE=''` e `MASTER_LOG_POS=4` são silenciosamente anexados a ela.

  Configurar `MASTER_HOST=''` (ou seja, definir explicitamente seu valor como uma string vazia) *não* é o mesmo que não definir `MASTER_HOST`. A partir do MySQL 5.5, tentar definir `MASTER_HOST` como uma string vazia falha com um erro. Anteriormente, definir `MASTER_HOST` como uma string vazia fazia com que [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") falhasse subsequentemente. (Bug #28796)

  Os valores usados para `MASTER_HOST` e outras opções de `CHANGE MASTER TO` são verificados quanto a caracteres de quebra de linha (`\n` ou `0x0A`); a presença de tais caracteres nestes valores faz com que a declaração falhe com [`ER_MASTER_INFO`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_master_info). (Bug #11758581, Bug #50801)

* `MASTER_USER` e `MASTER_PASSWORD` são o nome de usuário e a senha da conta a ser usada para conectar ao Source. Se você especificar `MASTER_PASSWORD`, `MASTER_USER` também é obrigatório. A senha usada para uma conta de usuário de replicação em uma declaração `CHANGE MASTER TO` é limitada a 32 caracteres de comprimento; antes do MySQL 5.7.5, se a senha fosse mais longa, a declaração era bem-sucedida, mas quaisquer caracteres em excesso eram truncados silenciosamente. No MySQL 5.7.5 e posterior, tentar usar uma senha com mais de 32 caracteres faz com que `CHANGE MASTER TO` falhe. (Bug #11752299, Bug #43439)

  É possível definir um nome de usuário vazio especificando `MASTER_USER=''`, mas o Channel de replicação não pode ser iniciado com um nome de usuário vazio. Defina um nome de usuário `MASTER_USER` vazio apenas se você precisar limpar credenciais usadas anteriormente dos repositórios da Replica por motivos de segurança e não tente usar o Channel depois.

  O texto de uma declaração [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") em execução, incluindo valores para `MASTER_USER` e `MASTER_PASSWORD`, pode ser visto na saída de uma declaração [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement") concorrente. (O texto completo de uma declaração [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") também é visível para [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement").)

Configurar `MASTER_SSL=1` para uma conexão de replicação e, em seguida, não configurar mais opções `MASTER_SSL_xxx` corresponde a configurar `--ssl-mode=REQUIRED` para o cliente, conforme descrito em [Opções de Comando para Conexões Criptografadas](connection-options.html#encrypted-connection-options "Command Options for Encrypted Connections"). Com `MASTER_SSL=1`, a tentativa de conexão só é bem-sucedida se uma conexão criptografada puder ser estabelecida. Uma conexão de replicação não retorna a uma conexão não criptografada, portanto, não há configuração correspondente à configuração `--ssl-mode=PREFERRED` para replicação. Se `MASTER_SSL=0` for configurado, isso corresponde a `--ssl-mode=DISABLED`.

Importante

Para ajudar a prevenir ataques sofisticados de man-in-the-middle, é importante que a Replica verifique a identidade do servidor. Você pode especificar opções `MASTER_SSL_xxx` adicionais para corresponder às configurações `--ssl-mode=VERIFY_CA` e `--ssl-mode=VERIFY_IDENTITY`, que são uma escolha melhor do que a configuração padrão para ajudar a prevenir este tipo de ataque. Com estas configurações, a Replica verifica se o certificado do servidor é válido e verifica se o nome do host que a Replica está usando corresponde à identidade no certificado do servidor. Para implementar um desses níveis de verificação, você deve primeiro garantir que o certificado CA para o servidor esteja confiavelmente disponível para a Replica, caso contrário, resultarão problemas de disponibilidade. Por esta razão, estas não são as configurações padrão.

As opções `MASTER_SSL_xxx` e a opção `MASTER_TLS_VERSION` especificam como a Replica usa criptografia e ciphers para proteger a conexão de replicação. Estas opções podem ser alteradas mesmo em Replicas que são compiladas sem suporte a SSL. Elas são salvas no repositório de metadados do Source, mas são ignoradas se a Replica não tiver o suporte a SSL habilitado. As opções `MASTER_SSL_xxx` e `MASTER_TLS_VERSION` executam as mesmas funções que as opções de cliente `--ssl-xxx` e `--tls-version` descritas em [Opções de Comando para Conexões Criptografadas](connection-options.html#encrypted-connection-options "Command Options for Encrypted Connections"). A correspondência entre os dois conjuntos de opções, e o uso das opções `MASTER_SSL_xxx` e `MASTER_TLS_VERSION` para configurar uma conexão segura, é explicada em [Seção 16.3.8, “Configurando a Replicação para Usar Conexões Criptografadas”](replication-encrypted-connections.html "16.3.8 Setting Up Replication to Use Encrypted Connections").

As opções `MASTER_HEARTBEAT_PERIOD`, `MASTER_CONNECT_RETRY` e `MASTER_RETRY_COUNT` controlam como a Replica reconhece que a conexão com o Source foi perdida e tenta se reconectar.

* A variável de sistema [`slave_net_timeout`](replication-options-replica.html#sysvar_slave_net_timeout) especifica o número de segundos que a Replica espera por mais dados ou por um sinal de Heartbeat do Source, antes que a Replica considere a conexão interrompida, aborte a leitura e tente se reconectar. O valor padrão é 60 segundos (um minuto). Antes do MySQL 5.7.7, o padrão era 3600 segundos (uma hora).

* O intervalo de Heartbeat, que impede o timeout da conexão de ocorrer na ausência de dados se a conexão ainda estiver boa, é controlado pela opção `MASTER_HEARTBEAT_PERIOD`. Um sinal de Heartbeat é enviado à Replica após esse número de segundos, e o período de espera é redefinido sempre que o Binary Log do Source é atualizado com um evento. Os Heartbeats são, portanto, enviados pelo Source somente se não houver eventos não enviados no arquivo Binary Log por um período maior do que este. O intervalo de Heartbeat *`interval`* é um valor decimal com um intervalo de 0 a 4294967 segundos e uma resolução em milissegundos; o menor valor não zero é 0.001. Definir *`interval`* como 0 desabilita completamente os Heartbeats. O intervalo de Heartbeat assume como padrão metade do valor da variável de sistema [`slave_net_timeout`](replication-options-replica.html#sysvar_slave_net_timeout). Ele é registrado no repositório de metadados do Source e mostrado na tabela [`replication_connection_configuration`](performance-schema-replication-connection-configuration-table.html "25.12.11.1 The replication_connection_configuration Table") do Performance Schema.

* Antes do MySQL 5.7.4, não incluir `MASTER_HEARTBEAT_PERIOD` fazia com que `CHANGE MASTER TO` redefinisse o intervalo de Heartbeat para o padrão (metade do valor da variável de sistema [`slave_net_timeout`](replication-options-replica.html#sysvar_slave_net_timeout)) e [`Slave_received_heartbeats`](server-status-variables.html#statvar_Slave_received_heartbeats) para 0. O intervalo de Heartbeat agora não é redefinido, exceto por [`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement"). (Bug #18185490)

* Note que uma mudança no valor ou na configuração padrão de [`slave_net_timeout`](replication-options-replica.html#sysvar_slave_net_timeout) não altera automaticamente o intervalo de Heartbeat, seja ele definido explicitamente ou usando um padrão calculado anteriormente. Um aviso é emitido se você definir `@@GLOBAL.slave_net_timeout` para um valor menor que o do intervalo de Heartbeat atual. Se [`slave_net_timeout`](replication-options-replica.html#sysvar_slave_net_timeout) for alterado, você também deve emitir [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") para ajustar o intervalo de Heartbeat para um valor apropriado, de modo que o sinal de Heartbeat ocorra antes do timeout da conexão. Se você não fizer isso, o sinal de Heartbeat não terá efeito e, se nenhum dado for recebido do Source, a Replica pode fazer tentativas repetidas de reconexão, criando dump threads zumbis.

* Se a Replica precisar se reconectar, a primeira repetição ocorre imediatamente após o timeout. `MASTER_CONNECT_RETRY` especifica o intervalo entre as tentativas de reconexão, e `MASTER_RETRY_COUNT` limita o número de tentativas de reconexão. Se ambas as configurações padrão forem usadas, a Replica espera 60 segundos entre as tentativas de reconexão (`MASTER_CONNECT_RETRY=60`) e continua tentando se reconectar a essa taxa por 60 dias (`MASTER_RETRY_COUNT=86400`). Uma configuração de 0 para `MASTER_RETRY_COUNT` significa que não há limite para o número de tentativas de reconexão, então a Replica continua tentando se reconectar indefinidamente. Esses valores são registrados no repositório de metadados do Source e mostrados na tabela [`replication_connection_configuration`](performance-schema-replication-connection-configuration-table.html "25.12.11.1 The replication_connection_configuration Table") do Performance Schema. `MASTER_RETRY_COUNT` substitui a opção de inicialização do servidor [`--master-retry-count`](replication-options-replica.html#option_mysqld_master-retry-count).

`MASTER_DELAY` especifica quantos segundos a Replica deve atrasar em relação ao Source. Um evento recebido do Source não é executado até pelo menos *`interval`* segundos depois de sua execução no Source. O padrão é 0. Ocorre um erro se *`interval`* não for um inteiro não negativo no intervalo de 0 a 231−1. Para mais informações, veja [Seção 16.3.10, “Delayed Replication”](replication-delayed.html "16.3.10 Delayed Replication").

A partir do MySQL 5.7, uma declaração `CHANGE MASTER TO` que emprega a opção `MASTER_DELAY` pode ser executada em uma Replica em execução quando o SQL Thread de replicação está parado.

`MASTER_BIND` é para uso em Replicas com múltiplas interfaces de rede e determina qual das interfaces de rede da Replica é escolhida para conectar-se ao Source.

O endereço configurado com esta opção, se houver, pode ser visto na coluna `Master_Bind` da saída de [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement"). Se você estiver usando uma tabela para o repositório de metadados do Source (servidor iniciado com [`master_info_repository=TABLE`](replication-options-replica.html#sysvar_master_info_repository)), o valor também pode ser visto como a coluna `Master_bind` da tabela `mysql.slave_master_info`.

A capacidade de vincular uma Replica a uma interface de rede específica também é suportada pelo NDB Cluster.

`MASTER_LOG_FILE` e `MASTER_LOG_POS` são as coordenadas nas quais o I/O Thread de replicação deve começar a ler do Source na próxima vez que o Thread iniciar. `RELAY_LOG_FILE` e `RELAY_LOG_POS` são as coordenadas nas quais o SQL Thread de replicação deve começar a ler do Relay Log na próxima vez que o Thread iniciar. Se você especificar qualquer uma destas opções, não poderá especificar `MASTER_AUTO_POSITION = 1` (descrito posteriormente nesta seção). Se nem `MASTER_LOG_FILE` nem `MASTER_LOG_POS` for especificado, a Replica usará as últimas coordenadas do *SQL Thread de replicação* antes que [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") fosse emitido. Isso garante que não haja descontinuidade na replicação, mesmo que o SQL Thread de replicação estivesse atrasado em comparação com o I/O Thread de replicação, quando você deseja apenas mudar, digamos, a senha a ser usada.

A partir do MySQL 5.7, uma declaração `CHANGE MASTER TO` empregando `RELAY_LOG_FILE`, `RELAY_LOG_POS`, ou ambas as opções pode ser executada em uma Replica em execução quando o SQL Thread de replicação está parado. Antes do MySQL 5.7.4, `CHANGE MASTER TO` exclui todos os arquivos de Relay Log e inicia um novo, a menos que você especifique `RELAY_LOG_FILE` ou `RELAY_LOG_POS`. Nesse caso, os arquivos de Relay Log são mantidos; a variável global [`relay_log_purge`](replication-options-replica.html#sysvar_relay_log_purge) é definida silenciosamente para 0. No MySQL 5.7.4 e posterior, os Relay Logs são preservados se pelo menos um dos SQL Thread de replicação e o I/O Thread de replicação estiver em execução. Se ambos os Threads estiverem parados, todos os arquivos de Relay Log serão excluídos, a menos que pelo menos um de `RELAY_LOG_FILE` ou `RELAY_LOG_POS` seja especificado. Para o Channel aplicador do Group Replication (`group_replication_applier`), que tem apenas um SQL Thread e nenhum I/O Thread, este é o caso se o SQL Thread estiver parado, mas com esse Channel você não pode usar as opções `RELAY_LOG_FILE` e `RELAY_LOG_POS`.

`RELAY_LOG_FILE` pode usar um path absoluto ou relativo e usa o mesmo nome base que `MASTER_LOG_FILE`. (Bug #12190)

Quando `MASTER_AUTO_POSITION = 1` é usado com `CHANGE MASTER TO`, a Replica tenta se conectar ao Source usando o recurso de auto-positioning da replicação baseada em GTID, em vez de uma posição baseada em arquivo Binary Log. A partir do MySQL 5.7, esta opção pode ser empregada por `CHANGE MASTER TO` apenas se tanto o SQL Thread de replicação quanto o I/O Thread de replicação estiverem parados. Tanto a Replica quanto o Source devem ter GTIDs habilitados ([`GTID_MODE=ON`](replication-options-gtids.html#sysvar_gtid_mode), `ON_PERMISSIVE`, ou `OFF_PERMISSIVE` na Replica, e [`GTID_MODE=ON`](replication-options-gtids.html#sysvar_gtid_mode) no Source). `MASTER_LOG_FILE`, `MASTER_LOG_POS`, `RELAY_LOG_FILE` e `RELAY_LOG_POS` não podem ser especificados junto com `MASTER_AUTO_POSITION = 1`. Se a replicação multi-source estiver habilitada na Replica, você precisa definir a opção `MASTER_AUTO_POSITION = 1` para cada Channel de replicação aplicável.

Com `MASTER_AUTO_POSITION = 1` configurado, no handshake de conexão inicial, a Replica envia um GTID set contendo as transações que já recebeu, cometeu ou ambas. O Source responde enviando todas as transações registradas em seu Binary Log cujo GTID não está incluído no GTID set enviado pela Replica. Essa troca garante que o Source envie apenas as transações com um GTID que a Replica ainda não registrou ou cometeu. Se a Replica receber transações de mais de um Source, como no caso de uma topologia em diamante, a função de auto-skip garante que as transações não sejam aplicadas duas vezes. Para detalhes de como o GTID set enviado pela Replica é calculado, veja [Seção 16.1.3.3, “GTID Auto-Positioning”](replication-gtids-auto-positioning.html "16.1.3.3 GTID Auto-Positioning").

Se alguma das transações que deveriam ser enviadas pelo Source tiver sido purgada do Binary Log do Source, ou adicionada ao conjunto de GTIDs na variável de sistema [`gtid_purged`](replication-options-gtids.html#sysvar_gtid_purged) por outro método, o Source envia o erro [`ER_MASTER_HAS_PURGED_REQUIRED_GTIDS`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_master_has_purged_required_gtids) à Replica, e a replicação não inicia. Além disso, se durante a troca de transações for descoberto que a Replica registrou ou cometeu transações com o UUID do Source no GTID, mas o Source em si não as cometeu, o Source envia o erro [`ER_SLAVE_HAS_MORE_GTIDS_THAN_MASTER`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_slave_has_more_gtids_than_master) à Replica e a replicação não inicia. Para obter informações sobre como lidar com essas situações, veja [Seção 16.1.3.3, “GTID Auto-Positioning”](replication-gtids-auto-positioning.html "16.1.3.3 GTID Auto-Positioning").

`IGNORE_SERVER_IDS` aceita uma lista separada por vírgulas de 0 ou mais Server IDs. Eventos originados dos servidores correspondentes são ignorados, com exceção de eventos de rotação e exclusão de log, que ainda são registrados no Relay Log.

Na replicação circular, o servidor de origem normalmente atua como o terminador de seus próprios eventos, para que não sejam aplicados mais de uma vez. Assim, esta opção é útil na replicação circular quando um dos servidores no círculo é removido. Suponha que você tenha uma configuração de replicação circular com 4 servidores, com Server IDs 1, 2, 3 e 4, e o servidor 3 falhe. Ao preencher a lacuna iniciando a replicação do servidor 2 para o servidor 4, você pode incluir `IGNORE_SERVER_IDS = (3)` na declaração [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") que você emite no servidor 4 para dizer-lhe para usar o servidor 2 como seu Source em vez do servidor 3. Isso faz com que ele ignore e não propague quaisquer declarações que se originaram no servidor que não está mais em uso.

Se uma declaração [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") for emitida sem qualquer opção `IGNORE_SERVER_IDS`, qualquer lista existente é preservada. Para limpar a lista de servidores ignorados, é necessário usar a opção com uma lista vazia:

```sql
CHANGE MASTER TO IGNORE_SERVER_IDS = ();
```

Antes do MySQL 5.7.5, [`RESET SLAVE ALL`](reset-slave.html "13.4.2.3 RESET SLAVE Statement") não tinha efeito na lista de Server IDs. No MySQL 5.7.5 e posterior, `RESET SLAVE ALL` limpa `IGNORE_SERVER_IDS`. (Bug #18816897)

Se `IGNORE_SERVER_IDS` contiver o próprio ID do servidor e o servidor foi iniciado com a opção [`--replicate-same-server-id`](replication-options-replica.html#option_mysqld_replicate-same-server-id) habilitada, um erro é resultado.

O repositório de metadados do Source e a saída de [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement") fornecem a lista de servidores que estão sendo ignorados atualmente. Para mais informações, veja [Seção 16.2.4.2, “Replication Metadata Repositories”](replica-logs-status.html "16.2.4.2 Replication Metadata Repositories") e [Seção 13.7.5.34, “SHOW SLAVE STATUS Statement”](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement").

Invocar [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") faz com que os valores anteriores de `MASTER_HOST`, `MASTER_PORT`, `MASTER_LOG_FILE` e `MASTER_LOG_POS` sejam gravados no error log, juntamente com outras informações sobre o estado da Replica antes da execução.

`CHANGE MASTER TO` causa um commit implícito de uma transação em andamento. Veja [Seção 13.3.3, “Statements That Cause an Implicit Commit”](implicit-commit.html "13.3.3 Statements That Cause an Implicit Commit").

No MySQL 5.7.4 e posterior, o requisito estrito de executar [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement") antes de emitir qualquer declaração [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") (e [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") depois) é removido. Em vez de depender se a Replica está parada, o comportamento de `CHANGE MASTER TO` depende (no MySQL 5.7.4 e posterior) dos estados do SQL Thread de replicação e do I/O Thread de replicação; qual desses Threads está parado ou em execução agora determina as opções que podem ou não ser usadas com uma declaração `CHANGE MASTER TO` em um determinado momento. As regras para fazer essa determinação estão listadas aqui:

* Se o SQL Thread estiver parado, você pode executar `CHANGE MASTER TO` usando qualquer combinação que seja permitida de opções `RELAY_LOG_FILE`, `RELAY_LOG_POS` e `MASTER_DELAY`, mesmo que o I/O Thread de replicação esteja em execução. Nenhuma outra opção pode ser usada com esta declaração quando o I/O Thread estiver em execução.

* Se o I/O Thread estiver parado, você pode executar `CHANGE MASTER TO` usando qualquer uma das opções para esta declaração (em qualquer combinação permitida) *exceto* `RELAY_LOG_FILE`, `RELAY_LOG_POS`, `MASTER_DELAY` ou `MASTER_AUTO_POSITION = 1`, mesmo quando o SQL Thread estiver em execução.

* Tanto o SQL Thread quanto o I/O Thread devem ser parados antes de emitir uma declaração `CHANGE MASTER TO` que empregue `MASTER_AUTO_POSITION = 1`.

Você pode verificar o estado atual do SQL Thread de replicação e do I/O Thread de replicação usando [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement"). Note que o Channel aplicador do Group Replication (`group_replication_applier`) não tem um I/O Thread, apenas um SQL Thread.

Para mais informações, veja [Seção 16.3.7, “Switching Sources During Failover”](replication-solutions-switch.html "16.3.7 Switching Sources During Failover").

Se você estiver usando replicação baseada em declaração e tabelas temporárias, é possível que uma declaração `CHANGE MASTER TO` após uma declaração `STOP SLAVE` deixe tabelas temporárias para trás na Replica. A partir do MySQL 5.7, um aviso ([`ER_WARN_OPEN_TEMP_TABLES_MUST_BE_ZERO`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_warn_open_temp_tables_must_be_zero)) é emitido sempre que isso ocorre. Você pode evitar isso, nesses casos, certificando-se de que o valor da variável de status do sistema [`Slave_open_temp_tables`](server-status-variables.html#statvar_Slave_open_temp_tables) seja igual a 0 antes de executar tal declaração `CHANGE MASTER TO`.

[`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") é útil para configurar uma Replica quando você tem o snapshot do servidor Source de replicação e registrou as coordenadas do Binary Log do Source correspondentes ao tempo do snapshot. Depois de carregar o snapshot na Replica para sincronizá-lo com o Source, você pode executar `CHANGE MASTER TO MASTER_LOG_FILE='log_name', MASTER_LOG_POS=log_pos` na Replica para especificar as coordenadas nas quais a Replica deve começar a ler o Binary Log do Source.

O exemplo a seguir altera o servidor Source de replicação que a Replica usa e estabelece as coordenadas do Binary Log do Source a partir das quais a Replica começa a ler. Isso é usado quando você deseja configurar a Replica para replicar o Source:

```sql
CHANGE MASTER TO
  MASTER_HOST='source2.example.com',
  MASTER_USER='replication',
  MASTER_PASSWORD='password',
  MASTER_PORT=3306,
  MASTER_LOG_FILE='source2-bin.001',
  MASTER_LOG_POS=4,
  MASTER_CONNECT_RETRY=10;
```

O próximo exemplo mostra uma operação que é menos frequentemente empregada. É usada quando a Replica tem arquivos de Relay Log que você deseja que ela execute novamente por algum motivo. Para fazer isso, o Source não precisa estar acessível. Você só precisa usar [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") e iniciar o SQL Thread (`START SLAVE SQL_THREAD`):

```sql
CHANGE MASTER TO
  RELAY_LOG_FILE='replica-relay-bin.006',
  RELAY_LOG_POS=4025;
```

A tabela a seguir mostra o comprimento máximo permitido para as opções de valor de string.

<table summary="O comprimento máximo permitido para as opções de valor de string de CHANGE MASTER TO."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Opção</th> <th>Comprimento Máximo</th> </tr></thead><tbody><tr> <td><code>MASTER_HOST</code></td> <td>60</td> </tr><tr> <td><code>MASTER_USER</code></td> <td>96</td> </tr><tr> <td><code>MASTER_PASSWORD</code></td> <td>32</td> </tr><tr> <td><code>MASTER_LOG_FILE</code></td> <td>511</td> </tr><tr> <td><code>RELAY_LOG_FILE</code></td> <td>511</td> </tr><tr> <td><code>MASTER_SSL_CA</code></td> <td>511</td> </tr><tr> <td><code>MASTER_SSL_CAPATH</code></td> <td>511</td> </tr><tr> <td><code>MASTER_SSL_CERT</code></td> <td>511</td> </tr><tr> <td><code>MASTER_SSL_CRL</code></td> <td>511</td> </tr><tr> <td><code>MASTER_SSL_CRLPATH</code></td> <td>511</td> </tr><tr> <td><code>MASTER_SSL_KEY</code></td> <td>511</td> </tr><tr> <td><code>MASTER_SSL_CIPHER</code></td> <td>511</td> </tr><tr> <td><code>MASTER_TLS_VERSION</code></td> <td>511</td> </tr></tbody></table>