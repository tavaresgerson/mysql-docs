## 15.4 Declarações de Replicação

A replicação pode ser controlada através da interface SQL usando as declarações descritas nesta seção. As declarações são divididas em um grupo que controla os servidores de origem, um grupo que controla os servidores de replicação e um grupo que pode ser aplicado a qualquer servidor de replicação.

### 15.4.1 Ensaios SQL para o controle de servidores de origem

Esta seção discute declarações para gerenciar servidores de origem de replicação. A Seção 15.4.2, “Declarações SQL para controle de servidores de replicação”, discute declarações para gerenciar servidores de replicação.

Além das declarações descritas aqui, as seguintes declarações `SHOW` são usadas com servidores de origem na replicação. Para obter informações sobre essas declarações, consulte a Seção 15.7.7, “Declarações SHOW”.

* `SHOW BINARY LOGS`
* `SHOW BINLOG EVENTS`
* `SHOW MASTER STATUS`
* [`SHOW REPLICAS`](show-replicas.html "15.7.7.33 SHOW REPLICAS Statement") (ou antes do MySQL 8.0.22, [`SHOW SLAVE HOSTS`](show-slave-hosts.html "15.7.7.34 SHOW SLAVE HOSTS | SHOW REPLICAS Statement"))

#### 15.4.1.1 Declaração de PURGE BINARY LOGS

```
PURGE { BINARY | MASTER } LOGS {
    TO 'log_name'
  | BEFORE datetime_expr
}
```

O log binário é um conjunto de arquivos que contêm informações sobre as modificações de dados feitas pelo servidor MySQL. O log consiste em um conjunto de arquivos de log binário, além de um arquivo de índice (consulte a Seção 7.4.4, “O Log Binário”).

A declaração `PURGE BINARY LOGS` exclui todos os arquivos de registro binários listados no arquivo de índice de registro antes do nome ou data especificada do arquivo de registro. `BINARY` e `MASTER` são sinônimos. Os arquivos de registro excluídos também são removidos da lista registrada no arquivo de índice, de modo que o arquivo de registro especificado se torna o primeiro na lista.

`PURGE BINARY LOGS` exige o privilégio `BINLOG_ADMIN`. Esta declaração não tem efeito se o servidor não foi iniciado com a opção `--log-bin` para habilitar o registro binário.

Exemplos:

```
PURGE BINARY LOGS TO 'mysql-bin.010';
PURGE BINARY LOGS BEFORE '2019-04-02 22:46:26';
```

O argumento *`datetime_expr`* da variante `BEFORE` deve avaliar para um valor de `DATETIME` (um valor no formato `'YYYY-MM-DD hh:mm:ss'`).

`PURGE BINARY LOGS` é seguro para executar enquanto as réplicas estão se replicando. Você não precisa interromper o processo. Se você tiver uma réplica ativa que atualmente está lendo um dos arquivos de registro que você está tentando excluir, esta declaração não exclui o arquivo de registro que está em uso ou qualquer arquivo de registro posterior a esse, mas exclui qualquer arquivo de registro anterior. Uma mensagem de aviso é emitida nesta situação. No entanto, se uma réplica não estiver conectada e você por acaso limpar um dos arquivos de registro que ela ainda não leu, a réplica não pode se replicar após se reconectar.

`PURGE BINARY LOGS` não deve ser emitido enquanto uma declaração `LOCK INSTANCE FOR BACKUP`(lock-instance-for-backup.html "15.3.5 LOCK INSTANCE FOR BACKUP and UNLOCK INSTANCE Statements") estiver em vigor para a instância, porque ela contradiz as regras do bloqueio de backup ao remover arquivos do servidor. A partir do MySQL 8.0.28, isso é proibido.

Para limpar os arquivos de registro binários com segurança, siga este procedimento:

1. Em cada réplica, use `SHOW REPLICA STATUS`(show-replica-status.html "15.7.7.35 SHOW REPLICA STATUS Statement") para verificar qual arquivo de registro está sendo lido.

2. Obtenha uma lista dos arquivos de registro binário na fonte com `SHOW BINARY LOGS`.

3. Determine o arquivo de registro mais antigo entre todas as réplicas. Este é o arquivo alvo. Se todas as réplicas estiverem atualizadas, este é o último arquivo de registro na lista.

4. Faça um backup de todos os arquivos de registro que você está prestes a excluir. (Este passo é opcional, mas sempre aconselhável.)

5. Limpe todos os arquivos de registro até, mas não incluindo, o arquivo alvo.

`PURGE BINARY LOGS TO` e `PURGE BINARY LOGS BEFORE` falham com um erro quando os arquivos de registro binários listados no arquivo `.index` foram removidos do sistema por outros meios (como o uso do **rm** no Linux). (Bug #18199, Bug #18453) Para lidar com tais erros, edite o arquivo `.index` (que é um arquivo de texto simples) manualmente para garantir que ele liste apenas os arquivos de registro binários que estão realmente presentes, e então execute novamente a declaração `PURGE BINARY LOGS` que falhou.

Os arquivos de registro binários são removidos automaticamente após o período de expiração do log binário do servidor. A remoção dos arquivos pode ocorrer na inicialização e quando o log binário é esvaziado. O período de expiração padrão do log binário é de 30 dias. Você pode especificar um período de expiração alternativo usando a variável de sistema `binlog_expire_logs_seconds`. Se você estiver usando replicação, você deve especificar um período de expiração que não seja menor que o tempo máximo em que suas réplicas podem ficar para trás em relação à fonte.

#### 15.4.1.2 Declaração de RESET MASTER

Nota

Essa declaração é substituída em versões posteriores do MySQL por `RESET BINARY LOGS AND GTIDS`, e deve ser considerada desatualizada. Consulte a declaração RESET BINARY LOGS AND GTIDS, no *Manual do MySQL 8.4*, para mais informações.

```
RESET MASTER [TO binary_log_file_index_number]
```

Aviso

Use esta declaração com cautela para garantir que você não perca nenhum dado de arquivo de registro binário desejado e histórico de execução do GTID.

`RESET MASTER` exige o privilégio `RELOAD`.

Para um servidor onde o registro binário está habilitado (`log_bin` é `ON`), `RESET MASTER` exclui todos os arquivos de registro binário existentes e refaz o arquivo do índice do registro binário, redefinindo o servidor ao seu estado antes do início do registro binário. Um novo arquivo de registro binário vazio é criado para que o registro binário possa ser reiniciado.

Para um servidor onde GTIDs estão em uso (`gtid_mode` é `ON`), emitir `RESET MASTER` refaz o histórico de execução do GTID. O valor da variável de sistema `gtid_purged` é definido como uma string vazia (`''`), o valor global (mas não o valor de sessão) da variável de sistema `gtid_executed` é definido como uma string vazia, e a tabela `mysql.gtid_executed` é limpa (ver tabela mysql.gtid_executed). Se o servidor habilitado para GTIDs tiver registro binário habilitado, `RESET MASTER` também refaz o registro binário conforme descrito acima. Note que `RESET MASTER` é o método para refazer o histórico de execução do GTID, mesmo que o servidor habilitado para GTIDs seja uma replica onde o registro binário está desativado; [`RESET REPLICA`](reset-replica.html "15.4.2.4 RESET REPLICA Statement") não tem efeito no histórico de execução do GTID. Para mais informações sobre a refaça do histórico de execução do GTID, consulte Refazendo o Histórico de Execução do GTID.

A emissão de `RESET MASTER` sem a cláusula opcional `TO` exclui todos os arquivos de registro binário listados no arquivo de índice, refaz o arquivo de índice de registro binário para estar vazio e cria um novo arquivo de registro binário começando em `1`. Use a cláusula opcional `TO` para iniciar o índice do arquivo de registro binário a partir de um número diferente de `1` após o reajuste.

Verifique se você está usando um valor razoável para o número do índice. Se você inserir um valor incorreto, pode corrigir isso emitindo outra declaração `RESET MASTER` com ou sem a cláusula `TO`. Se você não corrigir um valor fora do intervalo, o servidor não pode ser reiniciado.

O exemplo a seguir demonstra o uso da cláusula `TO`:

```
RESET MASTER TO 1234;

SHOW BINARY LOGS;
+-------------------+-----------+-----------+
| Log_name          | File_size | Encrypted |
+-------------------+-----------+-----------+
| source-bin.001234 |       154 | No        |
+-------------------+-----------+-----------+
```

Importante

Os efeitos do `RESET MASTER` sem a cláusula `TO` diferem dos efeitos do `PURGE BINARY LOGS` em duas maneiras-chave:

1. `RESET MASTER` remove *todos* os arquivos de registro binários listados no arquivo de índice, deixando apenas um único arquivo de registro binário vazio com um sufixo numérico de `.000001`, enquanto a numeração não é redefinida por `PURGE BINARY LOGS`.

2. `RESET MASTER` *não* deve ser utilizado enquanto houver réplicas em execução. O comportamento de `RESET MASTER` quando utilizado enquanto houver réplicas em execução é indefinido (e, portanto, não é suportado), enquanto `PURGE BINARY LOGS`(purge-binary-logs.html "15.4.1.1 PURGE BINARY LOGS Statement") pode ser utilizado com segurança enquanto houver réplicas em execução.

Veja também a Seção 15.4.1.1, “Declaração de PURGE BINARY LOGS”.

`RESET MASTER` sem a cláusula `TO` pode ser útil quando você configura uma fonte e replica pela primeira vez, para que você possa verificar a configuração da seguinte forma:

1. Inicie a fonte e a replica, e inicie a replicação (consulte a Seção 19.1.2, “Configurando a Replicação com Base na Posição do Arquivo de Registro Binário”).

2. Execute algumas consultas de teste na fonte.
3. Verifique se as consultas foram replicadas para a replica.
4. Quando a replicação estiver funcionando corretamente, emita `STOP REPLICA` (stop-replica.html "15.4.2.8 STOP REPLICA Statement") seguido de `RESET REPLICA` (reset-replica.html "15.4.2.4 RESET REPLICA Statement") na replica, e, em seguida, verifique se não existem dados indesejados das consultas de teste na replica.

5. Remova os dados indesejados da fonte, em seguida, emita `RESET MASTER` para purgar quaisquer entradas de log binário e identificadores associados a ela.

Após verificar a configuração, reiniciar a fonte e a replica e garantir que nenhum dado indesejado ou arquivos de registro binário gerados durante o teste permaneçam na fonte ou na replica, você pode iniciar a replica e começar a replicar.

#### 15.4.1.3 Declaração sql_log_bin SET

```
SET sql_log_bin = {OFF|ON}
```

A variável `sql_log_bin` controla se o registro no log binário está habilitado para a sessão atual (assumindo que o próprio log binário está habilitado). O valor padrão é `ON`. Para desabilitar ou habilitar o registro binário para a sessão atual, defina a variável de sessão `sql_log_bin` para `OFF` ou `ON`.

Defina essa variável para `OFF` para uma sessão que desabilite temporariamente o registro binário enquanto faz alterações na fonte que você não deseja replicar para a replica.

Definir o valor da sessão desta variável do sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios da Variável do Sistema”.

Não é possível definir o valor da sessão de `sql_log_bin` dentro de uma transação ou subconsulta.

* Definir essa variável como `OFF` impede que novos GTIDs sejam atribuídos a transações no log binário*. Se você está usando GTIDs para replicação, isso significa que, mesmo quando o registro binário é habilitado novamente, os GTIDs escritos no log a partir deste ponto não consideram quaisquer transações que ocorreram no meio do caminho, portanto, na prática, essas transações são perdidas.

O **mysqldump** adiciona uma declaração `SET @@SESSION.sql_log_bin=0` a um arquivo de dump de um servidor onde GTIDs estão em uso, o que desativa o registro binário enquanto o arquivo de dump está sendo recarregado. A declaração impede que novos GTIDs sejam gerados e atribuídos às transações no arquivo de dump à medida que são executadas, para que os GTIDs originais das transações sejam usados.

### 15.4.2 Esses são os comandos SQL para controlar os servidores replicados

Esta seção discute declarações para gerenciamento de servidores replicados. A Seção 15.4.1, “Declarações SQL para Controle de Servidores de Fonte”, discute declarações para gerenciamento de servidores de origem.

Além das declarações descritas aqui, `SHOW REPLICA STATUS` (show-replica-status.html "15.7.7.35 SHOW REPLICA STATUS Statement") e `SHOW RELAYLOG EVENTS` (show-relaylog-events.html "15.7.7.32 SHOW RELAYLOG EVENTS Statement") também são usadas com réplicas. Para informações sobre essas declarações, consulte a Seção 15.7.7.35, “Declaração SHOW REPLICA STATUS”, e a Seção 15.7.7.32, “Declaração SHOW RELAYLOG EVENTS”.

#### 15.4.2.1 Mudar o Master para a declaração

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

`CHANGE MASTER TO` altera os parâmetros que o servidor de replicação usa para se conectar à fonte e para ler dados da fonte. Também atualiza o conteúdo dos repositórios de metadados de replicação (consulte Seção 19.2.4, “Repositórios de Log de Relay e Metadados de Replicação”). A partir do MySQL 8.0.23, use `CHANGE REPLICATION SOURCE TO` no lugar de [`CHANGE MASTER TO`](change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement"), que é descontinuado a partir dessa versão. Em versões anteriores ao MySQL 8.0.23, use [`CHANGE MASTER TO`](change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement").

`CHANGE MASTER TO` exige o privilégio `REPLICATION_SLAVE_ADMIN` (ou o privilégio descontinuado `SUPER`).

As opções que você não especifica em uma declaração `CHANGE MASTER TO`(change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement") retêm seu valor, exceto conforme indicado na discussão a seguir. Na maioria dos casos, portanto, não há necessidade de especificar opções que não mudam.

Os valores utilizados para `SOURCE_HOST` e outras opções de `CHANGE REPLICATION SOURCE TO` são verificados quanto a caracteres de retorno de linha (`\n` ou `0x0A`). A presença desses caracteres nesses valores faz com que a declaração falhe com um erro.

A cláusula opcional `FOR CHANNEL channel` permite que você nomeie qual canal de replicação a declaração se aplica. Fornecer uma cláusula `FOR CHANNEL channel` aplica a declaração `CHANGE MASTER TO` a um canal de replicação específico e é usada para adicionar um novo canal ou modificar um canal existente. Por exemplo, para adicionar um novo canal chamado `channel2`:

```
CHANGE MASTER TO MASTER_HOST=host1, MASTER_PORT=3002 FOR CHANNEL 'channel2'
```

Se nenhuma cláusula for nomeada e não houver canais extras, uma declaração `CHANGE MASTER TO` se aplica ao canal padrão, cujo nome é a string vazia (""). Quando você configurou vários canais de replicação, cada declaração `CHANGE MASTER TO` deve nomear um canal usando a cláusula `FOR CHANNEL channel`. Consulte a Seção 19.2.2, “Canais de Replicação”, para obter mais informações.

Para algumas das opções da declaração `CHANGE MASTER TO`(change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement"), você deve emitir uma declaração `STOP SLAVE`(stop-replica.html "15.4.2.8 STOP REPLICA Statement") antes de emitir uma declaração `CHANGE MASTER TO` (e uma declaração `START SLAVE`(start-replica.html "15.4.2.6 START REPLICA Statement") posteriormente). Às vezes, você só precisa parar o thread de replicação SQL (aplicável) ou o thread de I/O de replicação (receptor), e não ambos:

* Quando o fio do aplicativo é interrompido, você pode executar `CHANGE MASTER TO` usando qualquer combinação que seja permitida, inclusive `RELAY_LOG_FILE`, `RELAY_LOG_POS` e `MASTER_DELAY`, mesmo que o fio do receptor de replicação esteja em execução. Nenhuma outra opção pode ser usada com essa declaração quando o fio do receptor estiver em execução.

* Quando o fio receptor é interrompido, você pode executar `CHANGE MASTER TO` usando qualquer uma das opções para essa declaração (em qualquer combinação permitida) *exceto* `RELAY_LOG_FILE`, `RELAY_LOG_POS`, `MASTER_DELAY` ou `MASTER_AUTO_POSITION = 1`, mesmo quando o fio aplicador está em execução.

* O fio receptor e o fio aplicador devem ser interrompidos antes de emitir uma declaração `CHANGE MASTER TO` (change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement") que emprega `MASTER_AUTO_POSITION = 1`, `GTID_ONLY = 1` ou `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS`.

Você pode verificar o estado atual do thread do aplicador de replicação e do thread do receptor de replicação usando `SHOW SLAVE STATUS`(show-replica-status.html "15.7.7.35 SHOW REPLICA STATUS Statement"). Observe que o canal do aplicador de replicação de grupo (`group_replication_applier`) não tem um thread de receptor, apenas um thread de aplicador.

As declarações `CHANGE MASTER TO` têm vários efeitos colaterais e interações que você deve estar ciente de antemão:

* `CHANGE MASTER TO` causa um compromisso implícito de uma transação em andamento. Veja a Seção 15.3.3, “Declarações que causam um compromisso implícito”.

* `CHANGE MASTER TO` faz com que os valores anteriores para `MASTER_HOST`, `MASTER_PORT`, `MASTER_LOG_FILE` e `MASTER_LOG_POS` sejam escritos no log de erro, juntamente com outras informações sobre o estado da replica antes da execução.

* Se você estiver usando replicação baseada em declarações e tabelas temporárias, é possível que uma declaração `CHANGE MASTER TO` (change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement") após uma declaração `STOP SLAVE` (stop-replica.html "15.4.2.8 STOP REPLICA Statement") deixe tabelas temporárias no replica. Um aviso (`ER_WARN_OPEN_TEMP_TABLES_MUST_BE_ZERO`) é emitido sempre que isso ocorre. Você pode evitar isso nesses casos, garantindo que o valor da variável de status do sistema `Replica_open_temp_tables` ou `Slave_open_temp_tables` seja igual a 0 antes de executar tal declaração `CHANGE MASTER TO`.

* Ao usar uma replica multithread (`replica_parallel_workers` > 0 ou `slave_parallel_workers` > 0), parar a replicação pode causar lacunas na sequência de transações que foram executadas a partir do log de relevo, independentemente de a replicação ter sido parada intencionalmente ou de outra forma. Quando tais lacunas existem, a emissão de `CHANGE MASTER TO` falha. A solução para essa situação é emitir `START SLAVE UNTIL SQL_AFTER_MTS_GAPS`(start-replica.html "15.4.2.6 START REPLICA Statement") que garante que as lacunas sejam fechadas. A partir do MySQL 8.0.26, o processo de verificação de lacunas na sequência de transações é ignorado completamente quando a replicação baseada em GTID e o autoposicionamento de GTID estão em uso, porque as lacunas nas transações podem ser resolvidas usando o autoposicionamento de GTID. Nessa situação, `CHANGE MASTER TO`(change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement") ainda pode ser usado.

As seguintes opções estão disponíveis para as declarações `CHANGE MASTER TO`:

`ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS = {OFF | LOCAL | uuid}` :   Torna o canal de replicação atribuir um GTID às transações replicadas que não possuem um, permitindo a replicação a partir de uma fonte que não usa replicação baseada em GTID, para uma replica que a usa. Para uma replica de várias fontes, você pode ter uma mistura de canais que usam `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS`, e canais que não usam. O padrão é `OFF`, o que significa que o recurso não é usado.

`LOCAL` atribui um GTID que inclui o próprio UUID da réplica (a configuração `server_uuid`). `uuid` atribui um GTID que inclui o UUID especificado, como a configuração `server_uuid` para o servidor de origem da replicação. O uso de um UUID não local permite diferenciar as transações que se originaram na réplica e as transações que se originaram na fonte, e, para uma replica de múltiplas fontes, entre as transações que se originaram em diferentes fontes. O UUID que você escolhe só tem significado para o uso próprio da réplica. Se alguma das transações enviadas pela fonte tiver um GTID já existente, esse GTID é mantido.

Os canais específicos para a Replicação por Grupo não podem usar `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS`, mas um canal de replicação assíncrona para outra fonte em uma instância do servidor que é membro do grupo de Replicação por Grupo pode fazer isso. Nesse caso, não especifique o nome do grupo de Replicação por Grupo como o UUID para criar os GTIDs.

Para definir `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` para `LOCAL` ou `uuid`, a replicação deve ter `gtid_mode=ON` definido, e isso não pode ser alterado posteriormente. Esta opção é para uso com uma fonte que tem replicação com posição de arquivo de log binário, então `MASTER_AUTO_POSITION=1` não pode ser definido para o canal. Tanto o fio de SQL de replicação quanto o fio de I/O (receptor) de replicação devem ser interrompidos antes de definir esta opção.

Importante

Um conjunto de réplica configurado com `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` em qualquer canal não pode ser promovido para substituir o servidor de origem da replicação, caso seja necessário um failover, e um backup retirado da réplica não pode ser usado para restaurar o servidor de origem da replicação. A mesma restrição se aplica à substituição ou restauração de outras réplicas que utilizam `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` em qualquer canal.

Para mais restrições e informações, consulte a Seção 19.1.3.6, “Replicação a partir de uma fonte sem GTIDs para uma réplica com GTIDs”.

`GET_MASTER_PUBLIC_KEY = {0|1}` :   Permite a troca de senha baseada em par de chave RSA, solicitando a chave pública da fonte. A opção é desativada por padrão.

Esta opção se aplica a réplicas que se autenticam com o plugin de autenticação `caching_sha2_password`. Para conexões por contas que se autenticam usando este plugin, a fonte não envia a chave pública a menos que seja solicitado, portanto, deve ser solicitada ou especificada no cliente. Se `MASTER_PUBLIC_KEY_PATH` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `GET_MASTER_PUBLIC_KEY`. Se você estiver usando uma conta de usuário de replicação que se autentica com o plugin `caching_sha2_password` (que é o padrão a partir do MySQL 8.0), e você não estiver usando uma conexão segura, você deve especificar esta opção ou a opção `MASTER_PUBLIC_KEY_PATH` para fornecer a chave pública RSA à réplica.

`GTID_ONLY = {0|1}` :   Para de persistir os nomes de arquivos e as posições de arquivos nos repositórios de metadados de replicação. A opção `GTID_ONLY` está disponível a partir do MySQL 8.0.27. A opção `GTID_ONLY` é desativada por padrão para canais de replicação assíncrona, mas é ativada por padrão para canais de Replicação por Grupo, e não pode ser desativada para eles.

Para canais de replicação com essa configuração, as posições de arquivo em memória ainda são rastreadas e as posições de arquivo ainda podem ser observadas para fins de depuração em mensagens de erro e através de interfaces como as declarações `SHOW REPLICA STATUS` (onde elas são mostradas como inválidas se estiverem desatualizadas). No entanto, as gravações e leituras necessárias para persistir e verificar as posições de arquivo são evitadas em situações em que a replicação baseada em GTID não as exige realmente, incluindo a fila de transações e o processo do aplicativo.

Esta opção só pode ser usada se o thread de SQL de replicação (aplicável) e o thread de I/O de replicação (receptor) estiverem parados. Para definir `GTID_ONLY = 1` para um canal de replicação, os GTIDs devem estar em uso no servidor (`gtid_mode = ON` (replication-options-gtids.html#sysvar_gtid_mode)), e o registro binário baseado em linha deve estar em uso na fonte (a replicação baseada em declarações não é suportada). As opções `REQUIRE_ROW_FORMAT = 1` e `SOURCE_AUTO_POSITION = 1` devem ser definidas para o canal de replicação.

Quando `GTID_ONLY = 1` é definido, a replica usa `replica_parallel_workers=1` se essa variável de sistema estiver definida como zero para o servidor, portanto, é sempre tecnicamente um aplicativo multi-threaded. Isso ocorre porque um aplicativo multi-threaded usa posições salvas em vez dos repositórios de metadados de replicação para localizar o início de uma transação que ele precisa reaplicar.

Se você desabilitar `GTID_ONLY` após configurá-lo, os registros existentes do relé serão excluídos e as posições dos arquivos binários conhecidos serão mantidas, mesmo que sejam obsoletos. As posições dos arquivos binários e dos registros do relé nos repositórios de metadados de replicação podem ser inválidas, e um aviso será retornado se esse for o caso. Desde que `SOURCE_AUTO_POSITION` ainda esteja habilitado, o posicionamento automático do GTID é usado para fornecer o posicionamento correto.

Se você também desabilitar `SOURCE_AUTO_POSITION`, as posições dos arquivos do log binário e do log de releio nos repositórios de metadados de replicação são usadas para posicionamento se forem válidas. Se forem marcadas como inválidas, você deve fornecer um nome e posição válida do arquivo de log binário (`SOURCE_LOG_FILE` e `SOURCE_LOG_POS`). Se você também fornecer um nome e posição de arquivo de log de releio (`RELAY_LOG_FILE` e `RELAY_LOG_POS`), os logs de releio são preservados e a posição do aplicável é definida na posição declarada. O GTID auto-skip garante que quaisquer transações já aplicadas sejam ignoradas mesmo que a eventual posição do aplicável não seja correta.

`IGNORE_SERVER_IDS = (server_id_list)` :   Torna a réplica ignorar eventos originados dos servidores especificados. A opção aceita uma lista de IDs de servidor separados por vírgula, de 0 ou mais servidores. Eventos de rotação e exclusão de logs dos servidores não são ignorados e são registrados no log do relé.

Na replicação circular, o servidor de origem normalmente atua como o terminador de seus próprios eventos, para que eles não sejam aplicados mais de uma vez. Assim, esta opção é útil na replicação circular quando um dos servidores no círculo é removido. Suponha que você tenha um conjunto de replicação circular com 4 servidores, tendo IDs de servidor 1, 2, 3 e 4, e o servidor 3 falha. Ao preencher a lacuna iniciando a replicação do servidor 2 para o servidor 4, você pode incluir `IGNORE_SERVER_IDS = (3)` na declaração `CHANGE MASTER TO` que você emite no servidor 4 para dizer que ele deve usar o servidor 2 como sua fonte em vez do servidor 3. Isso faz com que ele ignore e não propague quaisquer declarações que tenham origem com o servidor que não está mais em uso.

Se `IGNORE_SERVER_IDS` contiver a própria ID do servidor e o servidor foi iniciado com a opção `--replicate-same-server-id` habilitada, um erro resulta.

Nota

Quando são usados identificadores de transações globais (GTIDs) para replicação, as transações que já foram aplicadas são ignoradas automaticamente, portanto, a função `IGNORE_SERVER_IDS` não é necessária e é descontinuada. Se `gtid_mode=ON` for definido para o servidor, um aviso de descontinuidade é emitido se você incluir a opção `IGNORE_SERVER_IDS` em uma declaração `CHANGE MASTER TO`.

O repositório de metadados de origem e a saída de `SHOW REPLICA STATUS`](show-replica-status.html "15.7.7.35 SHOW REPLICA STATUS Statement") fornecem a lista dos servidores que estão atualmente ignorados. Para mais informações, consulte a Seção 19.2.4.2, “Repositórios de Metadados de Replicação”, e a Seção 15.7.7.35, “Declaração SHOW REPLICA STATUS”.

Se uma declaração `CHANGE MASTER TO` for emitida sem qualquer opção `IGNORE_SERVER_IDS`, qualquer lista existente será preservada. Para limpar a lista de servidores ignorados, é necessário usar a opção com uma lista vazia:

    ```
    CHANGE MASTER TO IGNORE_SERVER_IDS = ();
    ```

`RESET REPLICA ALL` (reset-replica.html "15.4.2.4 RESET REPLICA Statement") limpa `IGNORE_SERVER_IDS`.

Nota

Um aviso de depreciação é emitido se `SET GTID_MODE=ON` for emitido quando qualquer canal tiver IDs de servidor existentes definidos com `IGNORE_SERVER_IDS`. Antes de iniciar a replicação baseada em GTID, verifique e limpe todas as listas de IDs de servidor ignoradas nos servidores envolvidos. A declaração `SHOW REPLICA STATUS`(show-replica-status.html "15.7.7.35 SHOW REPLICA STATUS Statement") exibe a lista de IDs ignorados, se houver uma. Se você receber o aviso de depreciação, ainda pode limpar uma lista após `gtid_mode=ON` ser definido, emitindo uma declaração `CHANGE MASTER TO`(change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement") contendo a opção `IGNORE_SERVER_IDS` com uma lista vazia.

`MASTER_AUTO_POSITION = {0|1}` :   Faz com que a replica tente se conectar à fonte usando o recurso de autoposicionamento da replicação baseada em GTID, em vez de uma posição baseada em arquivo de log binário. Esta opção é usada para iniciar uma replicação usando replicação baseada em GTID. O padrão é 0, o que significa que o autoposicionamento GTID e a replicação baseada em GTID não são usados. Esta opção pode ser usada apenas com `CHANGE MASTER TO` se o thread SQL de replicação (aplicável) e o thread de I/O de replicação (receptor) forem interrompidos.

Tanto a réplica quanto a fonte devem ter GTIDs habilitados (`GTID_MODE=ON`, `ON_PERMISSIVE,` ou `OFF_PERMISSIVE` na réplica e `GTID_MODE=ON` na fonte). `MASTER_LOG_FILE`, `MASTER_LOG_POS`, `RELAY_LOG_FILE` e `RELAY_LOG_POS` não podem ser especificados juntos com `MASTER_AUTO_POSITION = 1`. Se a replicação de múltiplas fontes estiver habilitada na réplica, você precisa definir a opção `MASTER_AUTO_POSITION = 1` para cada canal de replicação aplicável.

Com `MASTER_AUTO_POSITION = 1` definido, na mão de aperto inicial da conexão, a replica envia um GTID definido contendo as transações que ela já recebeu, comprometeu ou ambas. A fonte responde enviando todas as transações registradas em seu log binário cujos GTID não estão incluídos no GTID definido enviado pela replica. Essa troca garante que a fonte só envie as transações com um GTID que a replica não tenha registrado ou comprometido já. Se a replica receber transações de mais de uma fonte, como no caso de uma topologia de diamante, a função de auto-salto garante que as transações não sejam aplicadas duas vezes. Para detalhes sobre como o GTID definido enviado pela replica é calculado, consulte a Seção 19.1.3.3, “Posicionamento Automático do GTID”.

Se alguma das transações que devem ser enviadas pela fonte tiver sido eliminada do log binário da fonte ou adicionada ao conjunto de GTIDs na variável de sistema `gtid_purged` por outro método, a fonte envia o erro `ER_SOURCE_HAS_PURGED_REQUIRED_GTIDS` para a replica, e a replicação não começa. Os GTIDs das transações eliminadas são identificados e listados no log de erro da fonte na mensagem de aviso `ER_FOUND_MISSING_GTIDS`. Além disso, se durante a troca de transações for encontrado que a replica registrou ou comprometeu transações com o UUID da fonte na GTID, mas a fonte não as comprometeu, a fonte envia o erro `ER_REPLICA_HAS_MORE_GTIDS_THAN_SOURCE` para a replica e a replicação não começa. Para informações sobre como lidar com essas situações, consulte a Seção 19.1.3.3, “Autoposicionamento GTID”.

Você pode verificar se a replicação está sendo executada com o posicionamento automático do GTID habilitado verificando a tabela do Schema de desempenho `replication_connection_status` ou a saída de [`SHOW REPLICA STATUS`](show-replica-status.html "15.7.7.35 SHOW REPLICA STATUS Statement"). Desabilitando novamente a opção `MASTER_AUTO_POSITION`, a replicação volta a ser baseada em arquivos.

`MASTER_BIND = 'interface_name'` :   Determina qual das interfaces de rede do replica é escolhida para se conectar à fonte, para uso em réplicas que têm múltiplas interfaces de rede. Especifique o endereço IP da interface de rede. O comprimento máximo do valor da string é de 255 caracteres.

O endereço IP configurado com esta opção, se houver, pode ser visto na coluna `Master_Bind` do resultado da saída de [`SHOW REPLICA STATUS`](show-replica-status.html "15.7.7.35 SHOW REPLICA STATUS Statement"). No repositório de metadados de origem, na tabela `mysql.slave_master_info`, o valor pode ser visto na coluna [[`Master_bind`]. A capacidade de vincular uma replica a uma interface de rede específica também é suportada pelo NDB Cluster.

`MASTER_COMPRESSION_ALGORITHMS = 'algorithm[,algorithm][,algorithm]'` : Especifica um, dois ou três dos algoritmos de compressão permitidos para conexões ao servidor de origem de replicação, separados por vírgulas. O valor máximo da cadeia é de 99 caracteres. O valor padrão é `uncompressed`.

Os algoritmos disponíveis são `zlib`, `zstd` e `uncompressed`, os mesmos que para a variável de sistema `protocol_compression_algorithms`. Os algoritmos podem ser especificados em qualquer ordem, mas não é uma ordem de preferência - o processo de negociação de algoritmos tenta usar `zlib`, depois `zstd`, depois `uncompressed`, se forem especificados. `MASTER_COMPRESSION_ALGORITHMS` está disponível a partir do MySQL 8.0.18.

O valor de `MASTER_COMPRESSION_ALGORITHMS` só se aplica se a variável de sistema `replica_compressed_protocol` ou `slave_compressed_protocol` estiver desativada. Se `replica_compressed_protocol` ou `slave_compressed_protocol` estiver habilitado, ele tem precedência sobre `MASTER_COMPRESSION_ALGORITHMS` e as conexões à fonte utilizam a compressão de `zlib` se tanto a fonte quanto a replica o suportem. Para mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

A compressão de transações de log binário (disponível a partir do MySQL 8.0.20), que é ativada pela variável de sistema `binlog_transaction_compression`, também pode ser usada para economizar largura de banda. Se você fizer isso em combinação com compressão de conexão, a compressão de conexão terá menos oportunidade de agir nos dados, mas ainda pode comprimir cabeçalhos e aqueles eventos e cargas de trabalho de transações que não estão comprimidos. Para mais informações sobre compressão de transações de log binário, consulte a Seção 7.4.4.5, “Compressão de Transações de Log Binário”.

`MASTER_CONNECT_RETRY = interval` : Especifica o intervalo em segundos entre as tentativas de reconexão que a réplica faz após o tempo de conexão com a fonte expirar. O intervalo padrão é de 60 segundos.

As tentativas são limitadas pela opção `MASTER_RETRY_COUNT`. Se as configurações padrão forem usadas, a replica aguarda 60 segundos entre as tentativas de reconexão (`MASTER_CONNECT_RETRY=60`) e continua tentando reconectar nessa taxa por 60 dias (`MASTER_RETRY_COUNT=86400`). Esses valores são registrados no repositório de metadados da fonte e mostrados na tabela do Schema de Desempenho `replication_connection_configuration`.

`MASTER_DELAY = interval` : Especifica quantos segundos o replica deve ficar para trás em relação à fonte. Um evento recebido da fonte não é executado até pelo menos *`interval`* segundos depois de sua execução na fonte. *`interval`* deve ser um número inteiro não negativo no intervalo de 0 a 231-1. O padrão é 0. Para mais informações, consulte a Seção 19.4.11, “Replicação Atrasa”.

Uma declaração `CHANGE MASTER TO` que utilize a opção `MASTER_DELAY` pode ser executada em uma replica em execução quando o thread de SQL de replicação é interrompido.

`MASTER_HEARTBEAT_PERIOD = interval` :   Controla o intervalo do batimento cardíaco, que impede o tempo de espera de conexão de ocorrer na ausência de dados, se a conexão ainda estiver boa. Um sinal de batimento cardíaco é enviado para a réplica após esse número de segundos, e o período de espera é redefinido sempre que o log binário da fonte é atualizado com um evento. Os batimentos cardíacos são, portanto, enviados pela fonte apenas se não houver eventos não enviados no arquivo de log binário por um período maior que este.

O intervalo de batimentos cardíacos *`interval`* é um valor decimal com o intervalo de 0 a 4294967 segundos e uma resolução em milissegundos; o menor valor não nulo é 0,001. Definir *`interval`* como 0 desativa os batimentos cardíacos completamente. O intervalo de batimentos cardíacos é definido como metade do valor da variável do sistema `replica_net_timeout` ou `slave_net_timeout`. Ele é registrado no repositório de metadados de origem e mostrado na tabela do `replication_connection_configuration` do Schema de Desempenho.

A variável de sistema `replica_net_timeout` (do MySQL 8.0.26) ou `slave_net_timeout` (antes do MySQL 8.0.26) especifica o número de segundos que a replica espera por mais dados ou um sinal de batida de coração do fonte, antes de a replica considerar a conexão quebrada, abortar a leitura e tentar reconectar. O valor padrão é de 60 segundos (um minuto). Observe que uma mudança no valor ou configuração padrão de `replica_net_timeout` ou `slave_net_timeout` não altera automaticamente o intervalo de batida de coração, seja ele definido explicitamente ou esteja usando um padrão previamente calculado. Um aviso é emitido se você definir o valor global de `replica_net_timeout` ou `slave_net_timeout` para um valor menor que o intervalo atual de batida de coração. Se `replica_net_timeout` ou `slave_net_timeout` for alterado, você também deve emitir [`CHANGE MASTER TO`](change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement") para ajustar o intervalo de batida de coração para um valor apropriado, para que o sinal de batida de coração ocorra antes do tempo limite da conexão. Se você não fizer isso, o sinal de batida de coração não terá efeito, e se nenhum dado for recebido do fonte, a replica pode fazer tentativas repetidas de reconexão, criando threads de dump zumbi.

`MASTER_HOST = 'host_name'` :   O nome do host ou o endereço IP do servidor de origem da replicação. A réplica usa isso para se conectar à fonte. O comprimento máximo do valor da string é de 255 caracteres. Antes do MySQL 8.0.17, era de 60 caracteres.

Se você especificar `MASTER_HOST` ou `MASTER_PORT`, a replica assume que o servidor de origem é diferente do anterior (mesmo que o valor da opção seja o mesmo que seu valor atual). Neste caso, os valores antigos do nome e posição do arquivo de log binário da fonte são considerados não mais aplicáveis, portanto, se você não especificar `MASTER_LOG_FILE` e `MASTER_LOG_POS` na declaração, `MASTER_LOG_FILE=''` e `MASTER_LOG_POS=4` são anexados silenciosamente a ela.

Definir `MASTER_HOST=''` (ou seja, definir explicitamente seu valor para uma string vazia) *não* é o mesmo que não definir `MASTER_HOST` de forma alguma. Tentar definir `MASTER_HOST` para uma string vazia falha com um erro.

`MASTER_LOG_FILE = 'source_log_name'`, `MASTER_LOG_POS = source_log_pos` :   O nome do arquivo de registro binário e a localização nesse arquivo, na qual o thread de I/O de replicação (receptor) começa a ler o registro binário da fonte na próxima vez que o thread começa. Especifique essas opções se você estiver usando replicação com base na posição do arquivo de registro binário.

`MASTER_LOG_FILE` deve incluir o sufixo numérico de um arquivo de log binário específico que está disponível no servidor de origem, por exemplo, `MASTER_LOG_FILE='binlog.000145'`. O comprimento máximo do valor da string é de 511 caracteres.

`MASTER_LOG_POS` é a posição numérica para que a replica comece a ler nesse arquivo. `MASTER_LOG_POS=4` representa o início dos eventos em um arquivo de registro binário.

Se você especificar qualquer um dos `MASTER_LOG_FILE` ou `MASTER_LOG_POS`, não poderá especificar `MASTER_AUTO_POSITION = 1`, que é para replicação baseada em GTID.

Se nenhum dos `MASTER_LOG_FILE` ou `MASTER_LOG_POS` for especificado, a replica usa as últimas coordenadas do *thread de aplicação SQL de replicação* antes de `CHANGE MASTER TO` ser emitido. Isso garante que não haja descontinuidade na replicação, mesmo que o thread de aplicação SQL de replicação tenha sido atrasado em comparação com o thread de recepção de I/O de replicação.

`MASTER_PASSWORD = 'password'` :   A senha para a conta de usuário de replicação a ser usada para se conectar ao servidor de origem de replicação. O valor da cadeia de caracteres máxima é de 32 caracteres. Se você especificar `MASTER_PASSWORD`, `MASTER_USER` também é necessário.

A senha usada para uma conta de usuário de replicação em uma declaração `CHANGE MASTER TO` é limitada a 32 caracteres de comprimento. Tentar usar uma senha com mais de 32 caracteres faz com que `CHANGE MASTER TO` falhe.

A senha é mascarada nos logs do MySQL Server, nas tabelas do Gerenciador de desempenho e nas declarações `SHOW PROCESSLIST` e (show-processlist.html "15.7.7.29 SHOW PROCESSLIST Statement").

`MASTER_PORT = port_num` :   O número da porta TCP/IP que a replica usa para se conectar ao servidor de origem de replicação.

Nota

A replicação não pode usar arquivos de socket Unix. Você deve ser capaz de se conectar ao servidor de origem de replicação usando TCP/IP.

Se você especificar `MASTER_HOST` ou `MASTER_PORT`, a replica assume que o servidor de origem é diferente do anterior (mesmo que o valor da opção seja o mesmo que seu valor atual). Neste caso, os valores antigos do nome e posição do arquivo de log binário da fonte são considerados não mais aplicáveis, portanto, se você não especificar `MASTER_LOG_FILE` e `MASTER_LOG_POS` na declaração, `MASTER_LOG_FILE=''` e `MASTER_LOG_POS=4` são anexados silenciosamente a ela.

`MASTER_PUBLIC_KEY_PATH = 'key_file_name'` :   Permite a troca de senha baseada em par de chave RSA fornecendo o nome do caminho de um arquivo que contém uma cópia do lado do replicador da chave pública necessária pelo ponto de origem. O arquivo deve estar no formato PEM. O valor máximo da string é de 511 caracteres.

Esta opção se aplica a réplicas que se autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. (Para `sha256_password`, `MASTER_PUBLIC_KEY_PATH` pode ser usado apenas se o MySQL foi construído usando OpenSSL. Se você está usando uma conta de usuário de replicação que se autentica com o plugin `caching_sha2_password` (que é o padrão a partir do MySQL 8.0), e você não está usando uma conexão segura, você deve especificar esta opção ou a opção `GET_MASTER_PUBLIC_KEY=1` para fornecer a chave pública RSA à réplica.

`MASTER_RETRY_COUNT = count` :   Define o número máximo de tentativas de reconexão que a réplica faz após o tempo de conexão com a fonte expirar, conforme determinado pela variável de sistema `replica_net_timeout` ou `slave_net_timeout`. Se a réplica precisar se reconectar, a primeira tentativa ocorre imediatamente após o tempo de expiração. O padrão é de 86400 tentativas.

O intervalo entre as tentativas é especificado pela opção `MASTER_CONNECT_RETRY`. Se as configurações padrão forem usadas, a replica aguarda 60 segundos entre as tentativas de reconexão (`MASTER_CONNECT_RETRY=60`) e continua tentando reconectar nessa taxa por 60 dias (`MASTER_RETRY_COUNT=86400`). Um ajuste de 0 para `MASTER_RETRY_COUNT` significa que não há limite no número de tentativas de reconexão, então a replica continua tentando reconectar indefinidamente.

Os valores para `MASTER_CONNECT_RETRY` e `MASTER_RETRY_COUNT` são registrados no repositório de metadados da fonte e mostrados na tabela do Schema de Desempenho `replication_connection_configuration`. `MASTER_RETRY_COUNT` substitui a opção de inicialização do servidor `--master-retry-count`.

`MASTER_SSL = {0|1}` : Especifique se a replica criptografa a conexão de replicação. O padrão é 0, o que significa que a replica não criptografa a conexão de replicação. Se você definir `MASTER_SSL=1`, pode configurar a criptografia usando as opções `MASTER_SSL_xxx` e `MASTER_TLS_xxx`.

Definir `MASTER_SSL=1` para uma conexão de replicação e, em seguida, não definir mais opções de `MASTER_SSL_xxx` corresponde a definir `--ssl-mode=REQUIRED` para o cliente, conforme descrito nas Opções de comando para conexões criptografadas. Com `MASTER_SSL=1`, a tentativa de conexão só tem sucesso se uma conexão criptografada puder ser estabelecida. Uma conexão de replicação não retorna a uma conexão não criptografada, portanto, não há definição correspondente ao ajuste `--ssl-mode=PREFERRED` para replicação. Se `MASTER_SSL=0` for definido, isso corresponde a `--ssl-mode=DISABLED`.

Importante

Para ajudar a prevenir ataques sofisticados de homem no meio, é importante que a replica verifique a identidade do servidor. Você pode especificar opções adicionais de `MASTER_SSL_xxx` para corresponder aos ajustes de `--ssl-mode=VERIFY_CA` e `--ssl-mode=VERIFY_IDENTITY`, que são uma escolha melhor do que o ajuste padrão para ajudar a prevenir esse tipo de ataque. Com esses ajustes, a replica verifica que o certificado do servidor é válido e verifica que o nome do host que a replica está usando corresponde à identidade no certificado do servidor. Para implementar um desses níveis de verificação, você deve primeiro garantir que o certificado da CA do servidor esteja disponível de forma confiável para a replica, caso contrário, problemas de disponibilidade resultarão. Por esse motivo, eles não são o ajuste padrão.

`MASTER_SSL_xxx`, `MASTER_TLS_xxx` : Especifique como a replica usa criptografia e cifra para proteger a conexão de replicação. Essas opções podem ser alteradas mesmo em réplicas que são compiladas sem suporte SSL. Elas são salvas no repositório de metadados da fonte, mas são ignoradas se a replica não tiver suporte SSL habilitado. O comprimento máximo do valor para as opções de valor de string `MASTER_SSL_xxx` e `MASTER_TLS_xxx` é de 511 caracteres, com exceção de `MASTER_TLS_CIPHERSUITES`, para a qual é de 4000 caracteres.

As opções `MASTER_SSL_xxx` e `MASTER_TLS_xxx` realizam as mesmas funções que as opções de cliente `--ssl-xxx` e `--tls-xxx` descritas nas Opções de comando para conexões criptografadas. A correspondência entre os dois conjuntos de opções e o uso das opções `MASTER_SSL_xxx` e `MASTER_TLS_xxx` para configurar uma conexão segura é explicado na Seção 19.3.1, “Configurando a Replicação para usar conexões criptografadas”.

`MASTER_USER = 'user_name'` :   O nome do usuário para a conta de usuário de replicação a ser usada para se conectar ao servidor de origem de replicação. O comprimento máximo do valor da string é de 96 caracteres.

Para a Replicação por Grupo, essa conta deve existir em todos os membros do grupo de replicação. Ela é usada para recuperação distribuída se a pilha de comunicação XCom estiver em uso para o grupo, e também é usada para conexões de comunicação de grupo se a pilha de comunicação MySQL estiver em uso para o grupo. Com a pilha de comunicação MySQL, a conta deve ter a permissão `GROUP_REPLICATION_STREAM`.

É possível definir um nome de usuário vazio especificando `MASTER_USER=''`, mas o canal de replicação não pode ser iniciado com um nome de usuário vazio. Em versões anteriores ao MySQL 8.0.21, defina apenas um nome de usuário vazio `MASTER_USER` se você precisar limpar as credenciais previamente usadas dos repositórios de metadados de replicação por motivos de segurança. Não use o canal posteriormente, devido a um bug nessas versões que pode substituir um nome de usuário padrão se um nome de usuário vazio for lido dos repositórios (por exemplo, durante um reinício automático de um canal de Replicação de Grupo). A partir do MySQL 8.0.21, é válido definir um nome de usuário vazio `MASTER_USER` e usar o canal posteriormente se você sempre fornecer credenciais de usuário usando a declaração [`START REPLICA`](start-replica.html "15.4.2.6 START REPLICA Statement") ou declaração [`START GROUP_REPLICATION`](start-group-replication.html "15.4.3.1 START GROUP_REPLICATION Statement") que inicia o canal de replicação. Essa abordagem significa que o canal de replicação sempre precisa de intervenção do operador para reiniciar, mas as credenciais do usuário não são registradas nos repositórios de metadados de replicação.

Importante

Para se conectar à fonte usando uma conta de usuário de replicação que se autentica com o plugin `caching_sha2_password`, você deve configurar uma conexão segura conforme descrito na Seção 19.3.1, “Configurando a Replicação para Usar Conexões Encriptadas”, ou habilitar a conexão não encriptada para suportar a troca de senhas usando um par de chaves RSA. O plugin de autenticação `caching_sha2_password` é o padrão para novos usuários criados a partir do MySQL 8.0 (para detalhes, consulte a Seção 8.4.1.2, “Cacheamento de Autenticação Substituível SHA-2”). Se a conta de usuário que você cria ou usa para replicação usar este plugin de autenticação, e você não está usando uma conexão segura, você deve habilitar a troca de senha baseada em par de chaves RSA para uma conexão bem-sucedida. Você pode fazer isso usando a opção `MASTER_PUBLIC_KEY_PATH` ou a opção `GET_MASTER_PUBLIC_KEY=1` para esta declaração.

`MASTER_ZSTD_COMPRESSION_LEVEL = level` : O nível de compressão a ser utilizado para conexões ao servidor de origem de replicação que utiliza o algoritmo de compressão `zstd`. Os níveis permitidos são de 1 a 22, com valores maiores indicando níveis de compressão crescentes. O nível padrão é 3. `MASTER_ZSTD_COMPRESSION_LEVEL` está disponível a partir do MySQL 8.0.18.

O ajuste do nível de compressão não afeta as conexões que não utilizam compressão `zstd`. Para mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

`NETWORK_NAMESPACE = 'namespace'` :   O espaço de rede a ser utilizado para conexões TCP/IP ao servidor de origem de replicação ou, se o stack de comunicação MySQL estiver em uso, para as conexões de comunicação de grupo da Replicação em Grupo. O comprimento máximo do valor da string é de 64 caracteres. Se esta opção for omitida, as conexões da réplica utilizam o namespace padrão (global). Em plataformas que não implementam suporte a namespaces de rede, ocorre falha quando a réplica tenta se conectar à fonte. Para informações sobre namespaces de rede, consulte a Seção 7.1.14, “Suporte a Namespace de Rede”. `NETWORK_NAMESPACE` está disponível a partir do MySQL 8.0.22.

`PRIVILEGE_CHECKS_USER = {NULL | 'account'}` :   Nomeia uma conta de usuário que fornece um contexto de segurança para o canal especificado. `NULL`, que é o padrão, significa que não é usado nenhum contexto de segurança. `PRIVILEGE_CHECKS_USER` está disponível a partir do MySQL 8.0.18.

O nome de usuário e o nome do host da conta do usuário devem seguir a sintaxe descrita na Seção 8.2.4, “Especificação de Nomes de Conta”, e o usuário não deve ser um usuário anônimo (com um nome de usuário em branco) ou o `CURRENT_USER`. A conta deve ter o privilégio `REPLICATION_APPLIER`, além dos privilégios necessários para executar as transações replicadas no canal. Para obter detalhes dos privilégios necessários para a conta, consulte a Seção 19.3.3, “Verificação de Privilegios de Replicação”. Quando você reiniciar o canal de replicação, as verificações de privilégios são aplicadas a partir desse ponto. Se você não especificar um canal e não houver outros canais, a declaração é aplicada ao canal padrão.

O uso de registro binário baseado em linha é fortemente recomendado quando `PRIVILEGE_CHECKS_USER` está definido, e você pode definir `REQUIRE_ROW_FORMAT` para impor isso. Por exemplo, para iniciar verificações de privilégios no canal `channel_1` em uma replica em execução, emita as seguintes declarações:

    ```
    mysql> STOP REPLICA FOR CHANNEL 'channel_1';
    mysql> CHANGE MASTER TO
             PRIVILEGE_CHECKS_USER = 'priv_repl'@'%.example.com',
             REQUIRE_ROW_FORMAT = 1,
             FOR CHANNEL 'channel_1';
    mysql> START REPLICA FOR CHANNEL 'channel_1';
    ```

Para as versões do MySQL 8.0.22, use `START REPLICA` e `STOP REPLICA`, e para as versões anteriores ao MySQL 8.0.22, use `START SLAVE` e `STOP SLAVE`. As declarações funcionam da mesma maneira, apenas a terminologia mudou.

`RELAY_LOG_FILE = 'relay_log_file'` , `RELAY_LOG_POS = 'relay_log_pos'` :   O nome do arquivo de registro de releio e a localização nesse arquivo, na qual o thread de replicação SQL começa a ler o log de releio da réplica na próxima vez que o thread começa. `RELAY_LOG_FILE` pode usar um caminho absoluto ou relativo e usa o mesmo nome de base que `MASTER_LOG_FILE`. O comprimento máximo do valor da string é de 511 caracteres.

Uma declaração `CHANGE MASTER TO` que utiliza `RELAY_LOG_FILE`, `RELAY_LOG_POS` ou ambas as opções pode ser executada em uma replica em execução quando o fio de SQL de replicação é interrompido. Os logs de releio são preservados se pelo menos um dos fios de SQL de replicação (aplicável) e o fio de I/O de replicação (receptor) estiver em execução. Se ambos os fios forem interrompidos, todos os arquivos de log de releio serão excluídos, a menos que pelo menos um dos `RELAY_LOG_FILE` ou `RELAY_LOG_POS` seja especificado. Para o canal de aplicável de replicação de grupo (`group_replication_applier`), que possui apenas um fio aplicável e nenhum fio receptor, este é o caso se o fio aplicável estiver interrompido, mas com esse canal não é possível usar as opções `RELAY_LOG_FILE` e `RELAY_LOG_POS`.

`REQUIRE_ROW_FORMAT = {0|1}` :   Permite que apenas eventos de replicação baseados em linha sejam processados pelo canal de replicação. Esta opção impede que o aplicativo de replicação tome ações como a criação de tabelas temporárias e a execução de solicitações `LOAD DATA INFILE`, o que aumenta a segurança do canal. A opção `REQUIRE_ROW_FORMAT` é desativada por padrão para canais de replicação assíncrona, mas é ativada por padrão para canais de Replicação por Grupo, e não pode ser desativada para eles. Para mais informações, consulte a Seção 19.3.3, “Verificação de Privilégios de Replicação”. `REQUIRE_ROW_FORMAT` está disponível a partir do MySQL 8.0.19.

`REQUIRE_TABLE_PRIMARY_KEY_CHECK = {STREAM | ON | OFF}` : Permite que uma replica selecione sua própria política para verificações de chave primária. O padrão é `STREAM`. `REQUIRE_TABLE_PRIMARY_KEY_CHECK` está disponível a partir do MySQL 8.0.20.

Quando a opção está definida para `ON` para um canal de replicação, a replica sempre usa o valor `ON` para a variável de sistema `sql_require_primary_key` nas operações de replicação, exigindo uma chave primária. Quando a opção está definida para `OFF`, a replica sempre usa o valor `OFF` para a variável de sistema `sql_require_primary_key` nas operações de replicação, de modo que uma chave primária nunca é necessária, mesmo que a fonte a exija. Quando a opção `REQUIRE_TABLE_PRIMARY_KEY_CHECK` está definida para `STREAM`, que é a opção padrão, a replica usa qualquer valor que seja replicado a partir da fonte para cada transação.

Para a replicação de múltiplas fontes, definir `REQUIRE_TABLE_PRIMARY_KEY_CHECK` para `ON` ou `OFF` permite que uma replica normalize o comportamento em todos os canais de replicação para diferentes fontes e mantenha um ajuste consistente para a variável do sistema `sql_require_primary_key`. O uso de `ON` protege contra a perda acidental de chaves primárias quando múltiplas fontes atualizam o mesmo conjunto de tabelas. O uso de `OFF` permite que fontes que podem manipular chaves primárias trabalhem ao lado de fontes que não podem.

Quando `PRIVILEGE_CHECKS_USER` está definido, definir `REQUIRE_TABLE_PRIMARY_KEY_CHECK` para `ON` ou `OFF` significa que a conta do usuário não precisa de privilégios de nível de administração de sessão para definir variáveis de sessão restritas, que são necessárias para alterar o valor de `sql_require_primary_key` para corresponder ao ajuste da fonte para cada transação. Para mais informações, consulte a Seção 19.3.3, “Verificações de Privilégios de Replicação”.

`SOURCE_CONNECTION_AUTO_FAILOVER = {0|1}` :   Ativa o mecanismo de falha de conexão assíncrona para um canal de replicação se um ou mais servidores de fonte de replicação alternativa estiverem disponíveis (assim, quando há vários servidores MySQL ou grupos de servidores que compartilham os dados replicados). `SOURCE_CONNECTION_AUTO_FAILOVER` está disponível a partir do MySQL 8.0.22. O padrão é 0, o que significa que o mecanismo não é ativado. Para obter informações completas e instruções para configurar essa funcionalidade, consulte a Seção 19.4.9.2, “Falha de Conexão Assíncrona para Replicação”.

O mecanismo de falha de conexão assíncrona assume após as tentativas de reconexão controladas por `MASTER_CONNECT_RETRY` e `MASTER_RETRY_COUNT` serem esgotadas. Ele reconecta a réplica a uma fonte alternativa escolhida de uma lista de fontes especificada, que você gerencia usando as funções `asynchronous_connection_failover_add_source` e `asynchronous_connection_failover_delete_source`. Para adicionar e remover grupos gerenciados de servidores, use as funções `asynchronous_connection_failover_add_managed` e `asynchronous_connection_failover_delete_managed` em vez disso. Para mais informações, consulte a Seção 19.4.9, “Alternar fontes e réplicas com falha de conexão de conexão assíncrona”.

Importante

1. Você só pode definir `SOURCE_CONNECTION_AUTO_FAILOVER = 1` quando o autoposicionamento do GTID está em uso (`MASTER_AUTO_POSITION = 1`).

2. Ao definir `SOURCE_CONNECTION_AUTO_FAILOVER = 1`, defina `MASTER_RETRY_COUNT` e `MASTER_CONNECT_RETRY` para números mínimos que permitam apenas algumas tentativas de tentativa com a mesma fonte em um curto período de tempo, caso a falha de conexão seja causada por uma interrupção transitória da rede. Caso contrário, o mecanismo de failover de conexão assíncrona não pode ser ativado prontamente. Os valores adequados são `MASTER_RETRY_COUNT=3` e `MASTER_CONNECT_RETRY=10`, que fazem a replica repetir a conexão 3 vezes com intervalos de 10 segundos entre elas.

3. Quando você definir `SOURCE_CONNECTION_AUTO_FAILOVER = 1`, os repositórios de metadados de replicação devem conter as credenciais de uma conta de usuário de replicação que pode ser usada para se conectar a todos os servidores na lista de origem para o canal de replicação. Essas credenciais podem ser definidas usando a declaração `CHANGE REPLICATION SOURCE TO`(change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") com as opções `MASTER_USER` e `MASTER_PASSWORD`. Para mais informações, consulte a Seção 19.4.9, “Alternar fontes e réplicas com failover de conexão assíncrona”.

4. A partir do MySQL 8.0.27, quando você define `SOURCE_CONNECTION_AUTO_FAILOVER = 1`, o failover de conexão assíncrona para réplicas é ativado automaticamente se esse canal de replicação estiver em um primário de Replicação por Grupo em modo de primário único. Com essa função ativa, se o primário que está replicando sair do ar ou entrar em um estado de erro, o novo primário começa a replicação no mesmo canal quando é eleito. Se você deseja usar a função, esse canal de replicação também deve ser configurado em todos os servidores secundários do grupo de replicação e em quaisquer novos membros que se juntem. (Se os servidores forem projetados usando a funcionalidade de clonagem do MySQL, tudo isso acontece automaticamente.) Se você não deseja usar a função, desative-a usando a função `group_replication_disable_member_action` para desativar a ação do membro de Replicação por Grupo `mysql_start_failover_channels_if_primary`, que é ativada por padrão. Para mais informações, consulte a Seção 19.4.9.2, “Failover de Conexão Assíncrona para Réplicas”.

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

Para o procedimento de alternar uma replica existente para uma nova fonte durante o failover, consulte a Seção 19.4.8, “Alternar fontes durante o failover”.

Quando os GTIDs estão em uso no servidor de origem e na replica, especifique a autoposição do GTID em vez de fornecer a posição do arquivo de log binário, como no exemplo a seguir. Para obter instruções completas sobre como configurar e iniciar a replicação baseada em GTIDs em servidores novos ou parados, servidores online ou réplicas adicionais, consulte a Seção 19.1.3, “Replicação com Identificadores Globais de Transação”.

```
CHANGE MASTER TO
  MASTER_HOST='source3.example.com',
  MASTER_USER='replication',
  MASTER_PASSWORD='password',
  MASTER_PORT=3306,
  MASTER_AUTO_POSITION = 1,
  FOR CHANNEL "source_3";
```

Neste exemplo, a replicação de várias fontes está em uso, e a declaração `CHANGE MASTER TO` é aplicada ao canal de replicação `"source_3"` que conecta a réplica ao host especificado. Para obter orientações sobre a configuração da replicação de várias fontes, consulte a Seção 19.1.5, “Replicação de várias fontes do MySQL”.

O próximo exemplo mostra como fazer a replica aplicar transações de arquivos de registro de relevo que você deseja repetir. Para isso, a fonte não precisa ser acessível. Você pode usar `CHANGE MASTER TO` para localizar a posição do registro de relevo onde você deseja que a replica comece a reaplicar as transações, e então iniciar o thread SQL:

```
CHANGE MASTER TO
  RELAY_LOG_FILE='replica-relay-bin.006',
  RELAY_LOG_POS=4025;
START SLAVE SQL_THREAD;
```

`CHANGE MASTER TO` também pode ser usado para ignorar transações no log binário que estão causando o término da replicação. O método apropriado para fazer isso depende se GTIDs estão em uso ou não. Para instruções sobre como ignorar transações usando `CHANGE MASTER TO` (change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement") ou outro método, consulte a Seção 19.1.7.3, “Ignorar Transações”.

#### 15.4.2.2 Declaração do filtro de replicação de alterações

```
CHANGE REPLICATION FILTER filter[, filter]
	[, ...] [FOR CHANNEL channel]

filter: {
    REPLICATE_DO_DB = (db_list)
  | REPLICATE_IGNORE_DB = (db_list)
  | REPLICATE_DO_TABLE = (tbl_list)
  | REPLICATE_IGNORE_TABLE = (tbl_list)
  | REPLICATE_WILD_DO_TABLE = (wild_tbl_list)
  | REPLICATE_WILD_IGNORE_TABLE = (wild_tbl_list)
  | REPLICATE_REWRITE_DB = (db_pair_list)
}

db_list:
    db_name[, db_name][, ...]

tbl_list:
    db_name.table_name[, db_name.table_name][, ...]
wild_tbl_list:
    'db_pattern.table_pattern'[, 'db_pattern.table_pattern'][, ...]

db_pair_list:
    (db_pair)[, (db_pair)][, ...]

db_pair:
    from_db, to_db
```

`CHANGE REPLICATION FILTER` define uma ou mais regras de filtragem de replicação no replica no mesmo modo em que se inicia o **mysqld** com opções de filtragem de replicação, como `--replicate-do-db` ou `--replicate-wild-ignore-table`. Os filtros definidos usando esta declaração diferem daqueles definidos usando as opções do servidor em dois aspectos-chave:

1. A declaração não exige o reinício do servidor para entrar em vigor, apenas que o fio de replicação SQL seja parado primeiro usando `STOP REPLICA SQL_THREAD` e depois reiniciado com `START REPLICA SQL_THREAD` (e (start-replica.html "15.4.2.6 START REPLICA Statement")).

2. Os efeitos da declaração não são persistentes; quaisquer filtros definidos usando `CHANGE REPLICATION FILTER` são perdidos após o reinício da replica **mysqld**.

`CHANGE REPLICATION FILTER` exige o privilégio `REPLICATION_SLAVE_ADMIN` (ou o privilégio descontinuado `SUPER`).

Utilize a cláusula `FOR CHANNEL channel` para tornar um filtro de replicação específico para um canal de replicação, por exemplo, em uma replica multi-fonte. Os filtros aplicados sem uma cláusula específica `FOR CHANNEL` são considerados filtros globais, o que significa que são aplicados a todos os canais de replicação.

Nota

Os filtros de replicação global não podem ser configurados em uma instância do servidor MySQL que está configurada para Replicação por Grupo, porque filtrar transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente. Filtros de replicação específicos para canais podem ser configurados em canais de replicação que não estão diretamente envolvidos com a Replicação por Grupo, como quando um membro do grupo também atua como replica para uma fonte que está fora do grupo. Eles não podem ser configurados nos canais `group_replication_applier` ou `group_replication_recovery`.

A lista a seguir mostra as opções do `CHANGE REPLICATION FILTER` e como elas se relacionam com as opções do servidor `--replicate-*`:

* `REPLICATE_DO_DB`: Inclua atualizações com base no nome do banco de dados. É equivalente a `--replicate-do-db`.

* `REPLICATE_IGNORE_DB`: Exclua atualizações com base no nome do banco de dados. É equivalente a `--replicate-ignore-db`.

* `REPLICATE_DO_TABLE`: Inclua atualizações com base no nome da tabela. É equivalente a `--replicate-do-table`.

* `REPLICATE_IGNORE_TABLE`: Exclua atualizações com base no nome da tabela. É equivalente a `--replicate-ignore-table`.

* `REPLICATE_WILD_DO_TABLE`: Inclua atualizações com base no nome da tabela de correspondência de padrões de caractere. É equivalente a `--replicate-wild-do-table`.

* `REPLICATE_WILD_IGNORE_TABLE`: Exclua atualizações com base no nome da tabela de correspondência de padrões de caractere. É equivalente a `--replicate-wild-ignore-table`.

* `REPLICATE_REWRITE_DB`: Realize atualizações na replica após substituir o novo nome na replica pelo banco de dados especificado na fonte. É equivalente a `--replicate-rewrite-db`.

Os efeitos precisos dos filtros `REPLICATE_DO_DB` e `REPLICATE_IGNORE_DB` dependem do fato de que a replicação baseada em declarações ou baseada em linhas esteja em vigor. Consulte a Seção 19.2.5, “Como os servidores avaliam as regras de filtragem de replicação”, para obter mais informações.

Várias regras de filtragem de replicação podem ser criadas em uma única declaração `CHANGE REPLICATION FILTER` ao separar as regras com vírgulas, como mostrado aqui:

```
CHANGE REPLICATION FILTER
    REPLICATE_DO_DB = (d1), REPLICATE_IGNORE_DB = (d2);
```

Emitir a declaração mostrada acima é equivalente a iniciar a replica **mysqld** com as opções `--replicate-do-db=d1` `--replicate-ignore-db=d2`.

Em uma replica multi-fonte, que utiliza vários canais de replicação para processar transações de diferentes fontes, use a cláusula `FOR CHANNEL channel` para definir um filtro de replicação em um canal de replicação:

```
CHANGE REPLICATION FILTER REPLICATE_DO_DB = (d1) FOR CHANNEL channel_1;
```

Isso permite que você crie um filtro de replicação específico para um canal para filtrar dados selecionados de uma fonte. Quando uma cláusula `FOR CHANNEL` é fornecida, a declaração do filtro de replicação atua nesse canal de replicação, removendo qualquer filtro de replicação existente que tenha o mesmo tipo de filtro que os filtros especificados, e substituindo-os pelo filtro especificado. Os tipos de filtro que não são explicitamente listados na declaração não são modificados. Se emitida contra um canal de replicação que não está configurado, a declaração falha com um erro ER_SLAVE_CONFIGURATION. Se emitida contra canais de replicação de grupo, a declaração falha com um erro ER_SLAVE_CHANNEL_OPERATION_NOT_ALLOWED.

Em uma réplica com vários canais de replicação configurados, emitir `CHANGE REPLICATION FILTER` sem a cláusula `FOR CHANNEL` configura o filtro de replicação para cada canal de replicação configurado e para os filtros de replicação global. Para cada tipo de filtro, se o tipo de filtro estiver listado na declaração, então quaisquer regras de filtro existentes desse tipo são substituídas pelas regras de filtro especificadas na declaração mais recentemente emitida; caso contrário, o valor antigo do tipo de filtro é mantido. Para mais informações, consulte a Seção 19.2.5.4, “Filtros com base em canais de replicação”.

Se a mesma regra de filtragem for especificada várias vezes, apenas a *última* regra é usada. Por exemplo, as duas declarações mostradas aqui têm exatamente o mesmo efeito, porque a primeira regra `REPLICATE_DO_DB` na primeira declaração é ignorada:

```
CHANGE REPLICATION FILTER
    REPLICATE_DO_DB = (db1, db2), REPLICATE_DO_DB = (db3, db4);

CHANGE REPLICATION FILTER
    REPLICATE_DO_DB = (db3, db4);
```

Cuidado

Esse comportamento difere da opção de filtro `--replicate-*`, onde especificar a mesma opção várias vezes causa a criação de múltiplas regras de filtro.

Os nomes de tabelas e bancos de dados que não contenham caracteres especiais não precisam ser citados. Os valores usados com `REPLICATION_WILD_TABLE` e `REPLICATION_WILD_IGNORE_TABLE` são expressões de cadeia, possivelmente contendo (caracteres) caracteres de comodinho (wildcards), e, portanto, devem ser citados. Isso é mostrado nas seguintes declarações de exemplo:

```
CHANGE REPLICATION FILTER
    REPLICATE_WILD_DO_TABLE = ('db1.old%');

CHANGE REPLICATION FILTER
    REPLICATE_WILD_IGNORE_TABLE = ('db1.new%', 'db2.new%');
```

Os valores usados com `REPLICATE_REWRITE_DB` representam *pares* de nomes de banco de dados; cada um desses valores deve ser fechado entre parênteses. A seguinte declaração reescreve as declarações que ocorrem no banco de dados `db1` na fonte para o banco de dados `db2` na replica:

```
CHANGE REPLICATION FILTER REPLICATE_REWRITE_DB = ((db1, db2));
```

A declaração que acabou de ser mostrada contém dois conjuntos de parênteses, um envolvendo o par de nomes de banco de dados e o outro envolvendo toda a lista. Isso é talvez mais facilmente visto no exemplo seguinte, que cria duas regras `rewrite-db`, uma reescrevendo o banco de dados `dbA` para `dbB`, e outra reescrevendo o banco de dados `dbC` para `dbD`:

```
CHANGE REPLICATION FILTER
  REPLICATE_REWRITE_DB = ((dbA, dbB), (dbC, dbD));
```

A declaração `CHANGE REPLICATION FILTER` substitui as regras de filtragem de replicação apenas para os tipos de filtro e canais de replicação afetados pela declaração e deixa as outras regras e canais inalterados. Se você deseja desativar todos os filtros de um determinado tipo, defina o valor do filtro em uma lista explicitamente vazia, como mostrado neste exemplo, que remove todas as regras existentes `REPLICATE_DO_DB` e `REPLICATE_IGNORE_DB`:

```
CHANGE REPLICATION FILTER
    REPLICATE_DO_DB = (), REPLICATE_IGNORE_DB = ();
```

Definir um filtro para ficar vazio dessa maneira remove todas as regras existentes, não cria nenhuma nova e não restaura nenhuma regra definida na inicialização do mysqld usando as opções `--replicate-*` na linha de comando ou no arquivo de configuração.

A declaração `RESET REPLICA ALL`(reset-replica.html "15.4.2.4 RESET REPLICA Statement") remove os filtros de replicação específicos de canal que foram definidos em canais excluídos pela declaração. Quando o canal ou canais excluídos são recriados, quaisquer filtros de replicação globais especificados para a replica são copiados para eles, e nenhum filtro de replicação específico de canal é aplicado.

Para mais informações, consulte a Seção 19.2.5, “Como os servidores avaliam as regras de filtragem de replicação”.

#### 15.4.2.3 TROQUE A FONTE DE REPLICAÇÃO PELO Statement

```
CHANGE REPLICATION SOURCE TO option [, option] ... [ channel_option ]

option: {
    SOURCE_BIND = 'interface_name'
  | SOURCE_HOST = 'host_name'
  | SOURCE_USER = 'user_name'
  | SOURCE_PASSWORD = 'password'
  | SOURCE_PORT = port_num
  | PRIVILEGE_CHECKS_USER = {NULL | 'account'}
  | REQUIRE_ROW_FORMAT = {0|1}
  | REQUIRE_TABLE_PRIMARY_KEY_CHECK = {STREAM | ON | OFF | GENERATE}
  | ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS = {OFF | LOCAL | uuid}
  | SOURCE_LOG_FILE = 'source_log_name'
  | SOURCE_LOG_POS = source_log_pos
  | SOURCE_AUTO_POSITION = {0|1}
  | RELAY_LOG_FILE = 'relay_log_name'
  | RELAY_LOG_POS = relay_log_pos
  | SOURCE_HEARTBEAT_PERIOD = interval
  | SOURCE_CONNECT_RETRY = interval
  | SOURCE_RETRY_COUNT = count
  | SOURCE_CONNECTION_AUTO_FAILOVER = {0|1}
  | SOURCE_DELAY = interval
  | SOURCE_COMPRESSION_ALGORITHMS = 'algorithm[,algorithm][,algorithm]'
  | SOURCE_ZSTD_COMPRESSION_LEVEL = level
  | SOURCE_SSL = {0|1}
  | SOURCE_SSL_CA = 'ca_file_name'
  | SOURCE_SSL_CAPATH = 'ca_directory_name'
  | SOURCE_SSL_CERT = 'cert_file_name'
  | SOURCE_SSL_CRL = 'crl_file_name'
  | SOURCE_SSL_CRLPATH = 'crl_directory_name'
  | SOURCE_SSL_KEY = 'key_file_name'
  | SOURCE_SSL_CIPHER = 'cipher_list'
  | SOURCE_SSL_VERIFY_SERVER_CERT = {0|1}
  | SOURCE_TLS_VERSION = 'protocol_list'
  | SOURCE_TLS_CIPHERSUITES = 'ciphersuite_list'
  | SOURCE_PUBLIC_KEY_PATH = 'key_file_name'
  | GET_SOURCE_PUBLIC_KEY = {0|1}
  | NETWORK_NAMESPACE = 'namespace'
  | IGNORE_SERVER_IDS = (server_id_list),
  | GTID_ONLY = {0|1}
}

channel_option:
    FOR CHANNEL channel

server_id_list:
    [server_id [, server_id] ... ]
```

`CHANGE REPLICATION SOURCE TO` altera os parâmetros que o servidor de replicação usa para se conectar à fonte e ler dados da fonte. Também atualiza o conteúdo dos repositórios de metadados de replicação (consulte Seção 19.2.4, “Repositórios de Log de Relay e Metadados de Replicação”). No MySQL 8.0.23 e versões posteriores, use `CHANGE REPLICATION SOURCE TO`(change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") em vez da declaração descontinuada `CHANGE MASTER TO`.

`CHANGE REPLICATION SOURCE TO` exige o privilégio `REPLICATION_SLAVE_ADMIN` (ou o privilégio descontinuado `SUPER`).

As opções que você não especifica em uma declaração `CHANGE REPLICATION SOURCE TO`(change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") retêm seu valor, exceto conforme indicado na discussão a seguir. Na maioria dos casos, portanto, não há necessidade de especificar opções que não mudam.

Os valores utilizados para `SOURCE_HOST` e outras opções de `CHANGE REPLICATION SOURCE TO` são verificados quanto a caracteres de retorno de linha (`\n` ou `0x0A`). A presença desses caracteres nesses valores faz com que a declaração falhe com um erro.

A cláusula opcional `FOR CHANNEL channel` permite que você nomeie qual canal de replicação a declaração se aplica. Fornecer a cláusula `FOR CHANNEL channel` aplica a declaração `CHANGE REPLICATION SOURCE TO` a um canal de replicação específico e é usada para adicionar um novo canal ou modificar um canal existente. Por exemplo, para adicionar um novo canal chamado `channel2`:

```
CHANGE REPLICATION SOURCE TO SOURCE_HOST=host1, SOURCE_PORT=3002 FOR CHANNEL 'channel2';
```

Se nenhuma cláusula for nomeada e não houver canais extras, uma declaração `CHANGE REPLICATION SOURCE TO` se aplica ao canal padrão, cujo nome é a string vazia (""). Quando você configurou vários canais de replicação, cada declaração (change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") `CHANGE REPLICATION SOURCE TO` deve nomear um canal usando a cláusula `FOR CHANNEL channel`. Consulte a Seção 19.2.2, “Canais de Replicação”, para obter mais informações.

Para algumas das opções da declaração `CHANGE REPLICATION SOURCE TO`(change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement"), você deve emitir uma declaração `STOP REPLICA` antes de emitir uma declaração [`CHANGE REPLICATION SOURCE TO`(change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") (e uma declaração [`START REPLICA`(start-replica.html "15.4.2.6 START REPLICA Statement") depois). Às vezes, você só precisa parar o fio de replicação SQL (aplicável) ou o fio de I/O de replicação (receptor), não ambos:

* Quando o fio do aplicável é interrompido, você pode executar `CHANGE REPLICATION SOURCE TO` usando qualquer combinação que seja permitida, inclusive `RELAY_LOG_FILE`, `RELAY_LOG_POS` e `SOURCE_DELAY`, mesmo que o fio do receptor de replicação esteja em execução. Nenhuma outra opção pode ser usada com essa declaração quando o fio do receptor estiver em execução.

* Quando o fio receptor é interrompido, você pode executar `CHANGE REPLICATION SOURCE TO` usando qualquer uma das opções para essa declaração (em qualquer combinação permitida) *exceto* `RELAY_LOG_FILE`, `RELAY_LOG_POS`, `SOURCE_DELAY` ou `SOURCE_AUTO_POSITION = 1`, mesmo quando o fio aplicador está em execução.

* O fio receptor e o fio aplicador devem ser interrompidos antes de emitir uma declaração `CHANGE REPLICATION SOURCE TO` (change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") que emprega `SOURCE_AUTO_POSITION = 1`, `GTID_ONLY = 1` ou `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS`.

Você pode verificar o estado atual do thread do aplicador de replicação e do thread do receptor de replicação usando `SHOW REPLICA STATUS`(show-replica-status.html "15.7.7.35 SHOW REPLICA STATUS Statement"). Observe que o canal do aplicador de replicação de grupo (`group_replication_applier`) não tem um thread de receptor, apenas um thread de aplicador.

As declarações `CHANGE REPLICATION SOURCE TO` têm vários efeitos colaterais e interações que você deve estar ciente de antemão:

* `CHANGE REPLICATION SOURCE TO` causa um compromisso implícito de uma transação em andamento. Veja a Seção 15.3.3, “Declarações que causam um compromisso implícito”.

* `CHANGE REPLICATION SOURCE TO` faz com que os valores anteriores para `SOURCE_HOST`, `SOURCE_PORT`, `SOURCE_LOG_FILE` e `SOURCE_LOG_POS` sejam escritos no log de erro, juntamente com outras informações sobre o estado da replica antes da execução.

* Se você estiver usando replicação baseada em declarações e tabelas temporárias, é possível que uma declaração `CHANGE REPLICATION SOURCE TO` (change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") após uma declaração `STOP REPLICA` (stop-replica.html "15.4.2.8 STOP REPLICA Statement") deixe tabelas temporárias no replica. Um aviso (`ER_WARN_OPEN_TEMP_TABLES_MUST_BE_ZERO`) é emitido sempre que isso ocorre. Você pode evitar isso nesses casos, garantindo que o valor da variável de status do sistema `Replica_open_temp_tables` ou `Slave_open_temp_tables` seja igual a 0 antes de executar tal declaração `CHANGE REPLICATION SOURCE TO` (change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement").

* Ao usar uma replica multithread (`replica_parallel_workers` > 0), parar a replicação pode causar lacunas na sequência de transações que foram executadas a partir do log de relevo, independentemente de a replicação ter sido parada intencionalmente ou de outra forma. Quando tais lacunas existem, a emissão de `CHANGE REPLICATION SOURCE TO` falha. A solução para essa situação é emitir `START REPLICA UNTIL SQL_AFTER_MTS_GAPS` (start-replica.html "15.4.2.6 START REPLICA Statement") que garante que as lacunas sejam fechadas. A partir do MySQL 8.0.26, o processo de verificação de lacunas na sequência de transações é ignorado completamente quando a replicação baseada em GTID e o autoposicionamento de GTID estão em uso, porque as lacunas nas transações podem ser resolvidas usando o autoposicionamento de GTID. Nessa situação, `CHANGE REPLICATION SOURCE TO` ainda pode ser usado.

As seguintes opções estão disponíveis para as declarações `CHANGE REPLICATION SOURCE TO`:

* `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS = {OFF | LOCAL | uuid}`(change-replication-source-to.html#crs-opt-assign_gtids_to_anonymous_transactions)

Torna o canal de replicação atribuir um GTID às transações replicadas que não possuem um, permitindo a replicação a partir de uma fonte que não usa replicação baseada em GTID, para uma replica que a usa. Para uma replica de várias fontes, você pode ter uma mistura de canais que usam `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` e canais que não o fazem. O padrão é `OFF`, o que significa que o recurso não é usado.

`LOCAL` atribui um GTID que inclui o próprio UUID da réplica (a configuração `server_uuid`). `uuid` atribui um GTID que inclui o UUID especificado, como a configuração `server_uuid` para o servidor de origem da replicação. O uso de um UUID não local permite diferenciar as transações que se originaram na réplica e as transações que se originaram na fonte, e, para uma replica de múltiplas fontes, entre as transações que se originaram em diferentes fontes. O UUID que você escolhe só tem significado para o uso próprio da réplica. Se alguma das transações enviadas pela fonte tiver um GTID já existente, esse GTID é mantido.

Os canais específicos para Replicação por Grupo não podem usar `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS`, mas um canal de replicação assíncrona para outra fonte em uma instância do servidor que é membro do grupo de Replicação por Grupo pode fazer isso. Nesse caso, não especifique o nome do grupo de Replicação por Grupo como o UUID para criar os GTIDs.

Para definir `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` para `LOCAL` ou `uuid`, a replicação deve ter `gtid_mode=ON` definido, e isso não pode ser alterado posteriormente. Esta opção é para uso com uma fonte que tem replicação com posição de arquivo de log binário, então `SOURCE_AUTO_POSITION=1` não pode ser definido para o canal. Tanto o fio de SQL de replicação quanto o fio de I/O (receptor) de replicação devem ser interrompidos antes de definir esta opção.

Importante

Um conjunto de réplica configurado com `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` em qualquer canal não pode ser promovido para substituir o servidor de origem da replicação, caso seja necessário um failover, e um backup retirado da réplica não pode ser usado para restaurar o servidor de origem da replicação. A mesma restrição se aplica à substituição ou restauração de outras réplicas que utilizam `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` em qualquer canal.

Para mais restrições e informações, consulte a Seção 19.1.3.6, “Replicação a partir de uma fonte sem GTIDs para uma réplica com GTIDs”.

* `GET_SOURCE_PUBLIC_KEY = {0|1}`(change-replication-source-to.html#crs-opt-get_source_public_key)

Permite a troca de senha baseada em par de chave RSA, solicitando a chave pública da fonte. A opção é desativada por padrão.

Esta opção se aplica a réplicas que se autenticam com o plugin de autenticação `caching_sha2_password`. Para conexões por contas que se autenticam usando este plugin, a fonte não envia a chave pública a menos que seja solicitada, portanto, ela deve ser solicitada ou especificada no cliente. Se `SOURCE_PUBLIC_KEY_PATH` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `GET_SOURCE_PUBLIC_KEY`. Se você estiver usando uma conta de usuário de replicação que se autentica com o plugin `caching_sha2_password` (que é o padrão a partir do MySQL 8.0), e você não estiver usando uma conexão segura, você deve especificar essa opção ou a opção `SOURCE_PUBLIC_KEY_PATH` para fornecer a chave pública RSA à réplica.

* `GTID_ONLY = {0|1}`

Parapage o canal de replicação não persistir nomes de arquivos e posições de arquivo nos repositórios de metadados de replicação. `GTID_ONLY` está disponível a partir do MySQL 8.0.27. A opção `GTID_ONLY` é desativada por padrão para canais de replicação assíncrona, mas é ativada por padrão para canais de Replicação por Grupo, e não pode ser desativada para eles.

Para canais de replicação com essa configuração, as posições de arquivo em memória ainda são rastreadas e as posições de arquivo ainda podem ser observadas para fins de depuração em mensagens de erro e através de interfaces como as declarações `SHOW REPLICA STATUS` (show-replica-status.html "15.7.7.35 SHOW REPLICA STATUS Statement") (onde elas são mostradas como inválidas se estiverem desatualizadas). No entanto, as gravações e leituras necessárias para persistir e verificar as posições de arquivo são evitadas em situações em que a replicação baseada em GTID não as exige realmente, incluindo a fila de transações e o processo de aplicação.

Essa opção só pode ser usada se o thread de SQL de replicação (aplicável) e o thread de I/O de replicação (receptor) estiverem parados. Para definir `GTID_ONLY = 1` para um canal de replicação, os GTIDs devem estar em uso no servidor (`gtid_mode = ON`), e o registro binário baseado em linha deve estar em uso na fonte (a replicação baseada em declarações não é suportada). As opções `REQUIRE_ROW_FORMAT = 1` e `SOURCE_AUTO_POSITION = 1` devem ser definidas para o canal de replicação.

Quando `GTID_ONLY = 1` é definido, a replica usa `replica_parallel_workers=1` se essa variável de sistema estiver definida como zero para o servidor, portanto, é sempre tecnicamente um aplicativo multi-threaded. Isso ocorre porque um aplicativo multi-threaded usa posições salvas em vez dos repositórios de metadados de replicação para localizar o início de uma transação que ele precisa reaplicar.

Se você desabilitar `GTID_ONLY` após configurá-lo, os registros existentes do relé serão excluídos e as posições dos arquivos binários conhecidos serão mantidas, mesmo que sejam obsoletos. As posições dos arquivos binários e dos registros do relé nos repositórios de metadados de replicação podem ser inválidas, e um aviso será retornado se esse for o caso. Desde que `SOURCE_AUTO_POSITION` ainda esteja habilitado, o posicionamento automático do GTID é usado para fornecer o posicionamento correto.

Se você também desabilitar `SOURCE_AUTO_POSITION`, as posições dos arquivos do log binário e do log de retransmissão nos repositórios de metadados de replicação são usadas para posicionamento se forem válidas. Se forem marcadas como inválidas, você deve fornecer um nome e posição válida do arquivo de log binário (`SOURCE_LOG_FILE` e `SOURCE_LOG_POS`). Se você também fornecer um nome e posição de arquivo de log de retransmissão (`RELAY_LOG_FILE` e `RELAY_LOG_POS`), os logs de retransmissão são preservados e a posição do aplicável é definida na posição declarada. O GTID auto-skip garante que quaisquer transações já aplicadas sejam ignoradas mesmo que a eventual posição do aplicável não seja correta.

* `IGNORE_SERVER_IDS = (server_id_list)`(change-replication-source-to.html#crs-opt-ignore_server_ids)

Torna a réplica ignorar eventos originados dos servidores especificados. A opção recebe uma lista de IDs de servidor separados por vírgula, de 0 ou mais servidores. Eventos de rotação e exclusão de logs dos servidores não são ignorados e são registrados no log do relé.

Na replicação circular, o servidor de origem normalmente atua como o terminador de seus próprios eventos, para que eles não sejam aplicados mais de uma vez. Assim, esta opção é útil na replicação circular quando um dos servidores no círculo é removido. Suponha que você tenha uma configuração de replicação circular com 4 servidores, tendo IDs de servidor 1, 2, 3 e 4, e o servidor 3 falha. Ao preencher a lacuna iniciando a replicação do servidor 2 para o servidor 4, você pode incluir `IGNORE_SERVER_IDS = (3)` na declaração `CHANGE REPLICATION SOURCE TO` que você emite no servidor 4 para dizer que ele deve usar o servidor 2 como sua fonte em vez do servidor 3. Isso faz com que ele ignore e não propague quaisquer declarações que tenham origem com o servidor que não está mais em uso.

Se `IGNORE_SERVER_IDS` contiver a própria ID do servidor e o servidor foi iniciado com a opção `--replicate-same-server-id` habilitada, um erro resulta.

Nota

Quando são utilizados identificadores de transações globais (GTIDs) para replicação, as transações que já foram aplicadas são ignoradas automaticamente, portanto, a função `IGNORE_SERVER_IDS` não é necessária e é descontinuada. Se `gtid_mode=ON` for definido para o servidor, um aviso de descontinuidade é emitido se você incluir a opção `IGNORE_SERVER_IDS` em uma declaração `CHANGE REPLICATION SOURCE TO`(change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement").

O repositório de metadados de origem e a saída de `SHOW REPLICA STATUS`(show-replica-status.html "15.7.7.35 SHOW REPLICA STATUS Statement") fornecem a lista dos servidores que estão atualmente ignorados. Para mais informações, consulte a Seção 19.2.4.2, “Repositórios de Metadados de Replicação”, e a Seção 15.7.7.35, “Declaração SHOW REPLICA STATUS”.

Se uma declaração `CHANGE REPLICATION SOURCE TO` for emitida sem qualquer opção (change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement"), qualquer lista existente será preservada. Para limpar a lista de servidores ignorados, é necessário usar a opção com uma lista vazia:

  ```
  CHANGE REPLICATION SOURCE TO IGNORE_SERVER_IDS = ();
  ```

`RESET REPLICA ALL` (reset-replica.html "15.4.2.4 RESET REPLICA Statement") limpa `IGNORE_SERVER_IDS`.

Nota

Um aviso de depreciação é emitido se `SET GTID_MODE=ON` for emitido quando qualquer canal tiver IDs de servidor existentes definidos com `IGNORE_SERVER_IDS`. Antes de iniciar a replicação baseada em GTID, verifique e limpe todas as listas de IDs de servidor ignoradas nos servidores envolvidos. A declaração `SHOW REPLICA STATUS` exibe a lista de IDs ignorados, se houver uma. Se você receber o aviso de depreciação, ainda pode limpar uma lista após `gtid_mode=ON` ser definido, emitindo uma declaração [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") contendo a opção `IGNORE_SERVER_IDS` com uma lista vazia.

* `NETWORK_NAMESPACE = 'namespace'`(change-replication-source-to.html#crs-opt-network_namespace)

O espaço de rede a ser usado para conexões TCP/IP ao servidor de origem de replicação ou, se o stack de comunicação MySQL estiver em uso, para as conexões de comunicação de grupo da Replicação em Grupo. O comprimento máximo do valor da string é de 64 caracteres. Se esta opção for omitida, as conexões da réplica utilizam o namespace padrão (global). Em plataformas que não implementam suporte a namespace de rede, ocorre falha quando a réplica tenta se conectar à fonte. Para informações sobre namespaces de rede, consulte a Seção 7.1.14, “Suporte a Namespace de Rede”. `NETWORK_NAMESPACE` está disponível a partir do MySQL 8.0.22.

* `PRIVILEGE_CHECKS_USER = {NULL | 'account'}`(change-replication-source-to.html#crs-opt-privilege_checks_user)

Nomeia uma conta de usuário que fornece um contexto de segurança para o canal especificado. `NULL`, que é o padrão, significa que não é usado nenhum contexto de segurança. `PRIVILEGE_CHECKS_USER` está disponível a partir do MySQL 8.0.18.

O nome de usuário e o nome do host da conta do usuário devem seguir a sintaxe descrita na Seção 8.2.4, “Especificação de Nomes de Conta”, e o usuário não deve ser um usuário anônimo (com um nome de usuário em branco) ou o `CURRENT_USER`. A conta deve ter o privilégio `REPLICATION_APPLIER`, além dos privilégios necessários para executar as transações replicadas no canal. Para obter detalhes dos privilégios necessários para a conta, consulte a Seção 19.3.3, “Verificação de Privilegios de Replicação”. Quando você reiniciar o canal de replicação, as verificações de privilégios são aplicadas a partir desse ponto. Se você não especificar um canal e não houver outros canais, a declaração é aplicada ao canal padrão.

O uso de registro binário baseado em linha é fortemente recomendado quando `PRIVILEGE_CHECKS_USER` está definido, e você pode definir `REQUIRE_ROW_FORMAT` para impor isso. Por exemplo, para iniciar verificações de privilégios no canal `channel_1` em uma replica em execução, emita as seguintes declarações:

  ```
  STOP REPLICA FOR CHANNEL 'channel_1';

  CHANGE REPLICATION SOURCE TO
      PRIVILEGE_CHECKS_USER = 'user'@'host',
      REQUIRE_ROW_FORMAT = 1,
      FOR CHANNEL 'channel_1';

  START REPLICA FOR CHANNEL 'channel_1';
  ```

* `RELAY_LOG_FILE = 'relay_log_file'`(change-replication-source-to.html#crs-opt-relay_log_file), `RELAY_LOG_POS = 'relay_log_pos'`(change-replication-source-to.html#crs-opt-relay_log_file)

O nome do arquivo de registro de releio e a localização nesse arquivo, na qual o thread de replicação SQL começa a ler o log de releio da réplica na próxima vez que o thread começa, `RELAY_LOG_FILE` pode usar um caminho absoluto ou relativo e usa o mesmo nome de base que `SOURCE_LOG_FILE`. O comprimento máximo do valor da string é de 511 caracteres.

Uma declaração `CHANGE REPLICATION SOURCE TO` que utiliza `RELAY_LOG_FILE`, `RELAY_LOG_POS` ou ambas as opções pode ser executada em uma replica em execução quando o thread de SQL de aplicação (aplicativo) de replicação é interrompido. Os logs de relevo são preservados se pelo menos um dos threads de aplicação de replicação e o thread de E/S de replicação (receptor) estiver em execução. Se ambos os threads forem interrompidos, todos os arquivos de log de relevo serão excluídos, a menos que pelo menos um dos `RELAY_LOG_FILE` ou `RELAY_LOG_POS` seja especificado. Para o canal de aplicativo de replicação de grupo (`group_replication_applier`), que possui apenas um thread de aplicativo e nenhum thread de receptor, este é o caso se o thread de aplicativo for interrompido, mas com esse canal não é possível usar as opções `RELAY_LOG_FILE` e `RELAY_LOG_POS`.

* `REQUIRE_ROW_FORMAT = {0|1}`

Permite que apenas eventos de replicação baseados em linha sejam processados pelo canal de replicação. Esta opção impede que o aplicável de replicação tome ações como a criação de tabelas temporárias e a execução de solicitações `LOAD DATA INFILE`, o que aumenta a segurança do canal. A opção `REQUIRE_ROW_FORMAT` é desativada por padrão para canais de replicação assíncrona, mas é ativada por padrão para canais de Replicação por Grupo e não pode ser desativada para eles. Para mais informações, consulte a Seção 19.3.3, “Verificação de Privilegios de Replicação”. `REQUIRE_ROW_FORMAT` está disponível a partir do MySQL 8.0.19.

* `REQUIRE_TABLE_PRIMARY_KEY_CHECK = {STREAM | ON | OFF | GENERATE}`(change-replication-source-to.html#crs-opt-require_table_primary_key_check)

Disponível a partir do MySQL 8.0.20, essa opção permite que uma replica defina sua própria política para verificações de chave primária, conforme segue:

+ `ON`: Os conjuntos de réplica `sql_require_primary_key = ON` (server-system-variables.html#sysvar_sql_require_primary_key); qualquer declaração replicada `CREATE TABLE` (create-table.html "15.1.20 CREATE TABLE Statement") ou `ALTER TABLE` (alter-table.html "15.1.9 ALTER TABLE Statement") deve resultar em uma tabela que contenha uma chave primária.

+ `OFF`: Os conjuntos de réplica `sql_require_primary_key = OFF`; nenhuma declaração replicada `CREATE TABLE` ou `ALTER TABLE` é verificada quanto à presença de uma chave primária.

+ `STREAM`: A replica usa qualquer valor de `sql_require_primary_key` que é replicado a partir da fonte para cada transação. Este é o valor padrão e o comportamento padrão.

+ `GENERATE`: Adicionada no MySQL 8.0.32, isso faz com que a replica gere uma chave primária invisível para qualquer tabela `InnoDB` que, ao ser replicada, não tenha uma chave primária. Consulte a Seção 15.1.20.11, “Chaves Primárias Invisíveis Geradas”, para mais informações.

`GENERATE` não é compatível com a Replicação por Grupo; você pode usar `ON`, `OFF` ou `STREAM`.

Uma divergência baseada na presença de uma chave primária invisível gerada exclusivamente em uma tabela de origem ou replica é suportada pelo MySQL Replication, desde que a origem suporte GIPKs (MySQL 8.0.30 e versões posteriores) e a replica utilize a versão 8.0.32 ou posterior do MySQL. Se você usar GIPKs em uma replica e replicar a partir de uma origem usando MySQL 8.0.29 ou versões anteriores, você deve estar ciente de que, neste caso, tais divergências no esquema, além do GIPK extra na replica, não são suportadas e podem resultar em erros de replicação.

Para a replicação de múltiplas fontes, definir `REQUIRE_TABLE_PRIMARY_KEY_CHECK` para `ON` ou `OFF` permite que a replica normalize o comportamento em todos os canais de replicação para diferentes fontes e mantenha um ajuste consistente para `sql_require_primary_key`. O uso de `ON` protege contra a perda acidental de chaves primárias quando múltiplas fontes atualizam o mesmo conjunto de tabelas. O uso de `OFF` permite que fontes que podem manipular chaves primárias trabalhem ao lado de fontes que não podem.

No caso de múltiplas réplicas, quando `REQUIRE_TABLE_PRIMARY_KEY_CHECK` está definido como `GENERATE`, a chave primária invisível gerada adicionada por uma réplica dada é independente de qualquer chave adicionada em qualquer outra réplica. Isso significa que, se as chaves primárias invisíveis geradas estiverem em uso, os valores nas colunas da chave primária gerada em diferentes réplicas não são garantidos como sendo os mesmos. Isso pode ser um problema ao falhar para uma dessas réplicas.

Quando `PRIVILEGE_CHECKS_USER` é `NULL` (o padrão), a conta de usuário não precisa de privilégios de nível de administração para definir variáveis de sessão restritas. Definir esta opção para um valor diferente de `NULL` significa que, quando `REQUIRE_TABLE_PRIMARY_KEY_CHECK` é `ON`, `OFF` ou `GENERATE`, a conta de usuário não requer privilégios de nível de administração de sessão para definir variáveis de sessão restritas, como `sql_require_primary_key`, evitando a necessidade de conceder tais privilégios à conta. Para mais informações, consulte a Seção 19.3.3, “Verificação de Privilégios de Replicação”.

* `SOURCE_AUTO_POSITION = {0|1}`(change-replication-source-to.html#crs-opt-source_auto_position)

Faz com que a replica tente se conectar à fonte usando a característica de autoposicionamento da replicação baseada em GTID, em vez de uma posição baseada em arquivo de registro binário. Esta opção é usada para iniciar uma replica usando replicação baseada em GTID. O padrão é 0, o que significa que o autoposicionamento GTID e a replicação baseada em GTID não são usados. Esta opção pode ser usada apenas com `CHANGE REPLICATION SOURCE TO` se o thread de SQL de replicação (aplicável) e o thread de I/O de replicação (receptor) forem interrompidos.

Tanto a réplica quanto a fonte devem ter GTIDs habilitados (`GTID_MODE=ON`, `ON_PERMISSIVE,` ou `OFF_PERMISSIVE` na réplica e `GTID_MODE=ON` na fonte). `SOURCE_LOG_FILE`, `SOURCE_LOG_POS`, `RELAY_LOG_FILE` e `RELAY_LOG_POS` não podem ser especificados juntamente com `SOURCE_AUTO_POSITION = 1`. Se a replicação de múltiplas fontes estiver habilitada na réplica, você precisa definir a opção `SOURCE_AUTO_POSITION = 1` para cada canal de replicação aplicável.

Com `SOURCE_AUTO_POSITION = 1` definido, na mão de aperto inicial da conexão, a replica envia um GTID definido contendo as transações que ela já recebeu, comprometeu ou ambas. A fonte responde enviando todas as transações registradas em seu log binário cujos GTID não estão incluídos no GTID definido enviado pela replica. Essa troca garante que a fonte só envie as transações com um GTID que a replica não tenha registrado ou comprometido já. Se a replica receber transações de mais de uma fonte, como no caso de uma topologia de diamante, a função de auto-salto garante que as transações não sejam aplicadas duas vezes. Para detalhes sobre como o GTID definido enviado pela replica é calculado, consulte a Seção 19.1.3.3, “Posicionamento Automático do GTID”.

Se alguma das transações que devem ser enviadas pela fonte tiver sido eliminada do log binário da fonte ou adicionada ao conjunto de GTIDs na variável de sistema `gtid_purged`, por outro método, a fonte envia o erro `ER_SOURCE_HAS_PURGED_REQUIRED_GTIDS` para a replica, e a replicação não é iniciada. Os GTIDs das transações eliminadas são identificados e listados no log de erro da fonte na mensagem de aviso `ER_FOUND_MISSING_GTIDS`. Além disso, se durante a troca de transações for descoberto que a replica registrou ou comprometeu transações com o UUID da fonte, mas a fonte não as comprometeu, a fonte envia o erro `ER_REPLICA_HAS_MORE_GTIDS_THAN_SOURCE` para a replica e a replicação não é iniciada. Para informações sobre como lidar com essas situações, consulte a Seção 19.1.3.3, “Posicionamento Automático de GTIDs”.

Você pode verificar se a replicação está sendo executada com o posicionamento automático do GTID habilitado verificando a tabela do Schema de desempenho `replication_connection_status` ou a saída de [`SHOW REPLICA STATUS`](show-replica-status.html "15.7.7.35 SHOW REPLICA STATUS Statement"). Desabilitando novamente a opção `SOURCE_AUTO_POSITION`, a replica retorna à replicação baseada em arquivos.

* `SOURCE_BIND = 'interface_name'`(change-replication-source-to.html#crs-opt-source_bind)

Determina qual das interfaces de rede do replica é escolhida para se conectar à fonte, para uso em réplicas que têm múltiplas interfaces de rede. Especifique o endereço IP da interface de rede. O comprimento máximo do valor da string é de 255 caracteres.

O endereço IP configurado com esta opção, se houver, pode ser visto na coluna `Source_Bind` do resultado da saída de [`SHOW REPLICA STATUS`](show-replica-status.html "15.7.7.35 SHOW REPLICA STATUS Statement"). No repositório de metadados de origem na tabela `mysql.slave_master_info`, o valor pode ser visto na coluna `Source_bind`. A capacidade de vincular uma replica a uma interface de rede específica também é suportada pelo NDB Cluster.

* `SOURCE_COMPRESSION_ALGORITHMS = 'algorithm[,algorithm][,algorithm]'`(change-replication-source-to.html#crs-opt-source_compression_algorithms)

Especifica um, dois ou três dos algoritmos de compressão permitidos para conexões ao servidor de origem de replicação, separados por vírgulas. O valor máximo da cadeia de caracteres é de 99 caracteres. O valor padrão é `uncompressed`.

Os algoritmos disponíveis são `zlib`, `zstd` e `uncompressed`, os mesmos que para a variável de sistema `protocol_compression_algorithms`. Os algoritmos podem ser especificados em qualquer ordem, mas não é uma ordem de preferência - o processo de negociação de algoritmos tenta usar `zlib`, depois `zstd`, depois `uncompressed`, se forem especificados. `SOURCE_COMPRESSION_ALGORITHMS` está disponível a partir do MySQL 8.0.18.

O valor de `SOURCE_COMPRESSION_ALGORITHMS` só se aplica se a variável de sistema `replica_compressed_protocol` ou `slave_compressed_protocol` estiver desativada. Se `replica_compressed_protocol` ou `slave_compressed_protocol` estiver habilitado, ele tem precedência sobre `SOURCE_COMPRESSION_ALGORITHMS` e as conexões à fonte utilizam a compressão de `zlib` se tanto a fonte quanto a replica suportam esse algoritmo. Para mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

A compressão de transações de log binário (disponível a partir do MySQL 8.0.20), que é ativada pela variável de sistema `binlog_transaction_compression`, também pode ser usada para economizar largura de banda. Se você fizer isso em combinação com compressão de conexão, a compressão de conexão terá menos oportunidade de agir nos dados, mas ainda pode comprimir cabeçalhos e aqueles eventos e cargas de trabalho de transações que não estão comprimidos. Para mais informações sobre compressão de transações de log binário, consulte a Seção 7.4.4.5, “Compressão de Transações de Log Binário”.

* `SOURCE_CONNECT_RETRY = interval`(change-replication-source-to.html#crs-opt-source_connect_retry)

Especifica o intervalo em segundos entre as tentativas de reconexão que a réplica faz após o tempo de conexão com a fonte expirar. O intervalo padrão é de 60 segundos.

O número de tentativas é limitado pela opção `SOURCE_RETRY_COUNT`. Se as configurações padrão forem usadas, a replica aguarda 60 segundos entre as tentativas de reconexão (`SOURCE_CONNECT_RETRY=60`) e continua tentando reconectar nessa taxa por 60 dias (`SOURCE_RETRY_COUNT=86400`). Esses valores são registrados no repositório de metadados da fonte e mostrados na tabela do Schema de Desempenho `replication_connection_configuration`.

* `SOURCE_CONNECTION_AUTO_FAILOVER = {0|1}`(change-replication-source-to.html#crs-opt-source_connection_auto_failover)

Ativa o mecanismo de falha de conexão assíncrona para um canal de replicação se um ou mais servidores alternativos de fonte de replicação estiverem disponíveis (assim, quando há vários servidores MySQL ou grupos de servidores que compartilham os dados replicados). `SOURCE_CONNECTION_AUTO_FAILOVER` está disponível a partir do MySQL 8.0.22. O padrão é 0, o que significa que o mecanismo não está ativado. Para obter informações completas e instruções para configurar essa funcionalidade, consulte a Seção 19.4.9.2, “Falha de Conexão Assíncrona para Replicação”.

O mecanismo de falha de conexão assíncrona assume após as tentativas de reconexão controladas por `SOURCE_CONNECT_RETRY` e `SOURCE_RETRY_COUNT` serem esgotadas. Ele reconecta a réplica a uma fonte alternativa escolhida de uma lista de fontes especificada, que você gerencia usando as funções `asynchronous_connection_failover_add_source` e `asynchronous_connection_failover_delete_source`. Para adicionar e remover grupos gerenciados de servidores, use as funções `asynchronous_connection_failover_add_managed` e `asynchronous_connection_failover_delete_managed` em vez disso. Para mais informações, consulte a Seção 19.4.9, “Alternar fontes e réplicas com falha de conexão de conexão assíncrona”.

Importante

1. Você só pode definir `SOURCE_CONNECTION_AUTO_FAILOVER = 1` quando o autoposicionamento do GTID está em uso (`SOURCE_AUTO_POSITION = 1`).

2. Ao definir `SOURCE_CONNECTION_AUTO_FAILOVER = 1`, defina `SOURCE_RETRY_COUNT` e `SOURCE_CONNECT_RETRY` com números mínimos que permitam apenas algumas tentativas de tentativa com a mesma fonte, caso a falha de conexão seja causada por uma interrupção transitória da rede. Caso contrário, o mecanismo de failover de conexão assíncrona não pode ser ativado prontamente. Os valores adequados são `SOURCE_RETRY_COUNT=3` e `SOURCE_CONNECT_RETRY=10`, que fazem a replica repetir a conexão 3 vezes com intervalos de 10 segundos entre elas.

3. Quando você definir `SOURCE_CONNECTION_AUTO_FAILOVER = 1`, os repositórios de metadados de replicação devem conter as credenciais de uma conta de usuário de replicação que pode ser usada para se conectar a todos os servidores na lista de origem para o canal de replicação. A conta também deve ter `SELECT` permissões nas tabelas do Schema de desempenho. Essas credenciais podem ser definidas usando a declaração [`CHANGE REPLICATION SOURCE TO`(change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") com as opções `SOURCE_USER` e `SOURCE_PASSWORD`. Para mais informações, consulte a Seção 19.4.9, “Alternar fontes e réplicas com failover de conexão assíncrona”.

4. A partir do MySQL 8.0.27, quando você define `SOURCE_CONNECTION_AUTO_FAILOVER = 1`, o failover de conexão assíncrona para réplicas é ativado automaticamente se esse canal de replicação estiver em um primário de Replicação por Grupo em modo de primário único. Com essa função ativa, se o primário que está replicando sair do ar ou entrar em um estado de erro, o novo primário começa a replicação no mesmo canal quando é eleito. Se você deseja usar a função, esse canal de replicação também deve ser configurado em todos os servidores secundários do grupo de replicação e em quaisquer novos membros que se juntem. (Se os servidores forem projetados usando a funcionalidade de clonagem do MySQL, tudo isso acontece automaticamente.) Se você não deseja usar a função, desative-a usando a função `group_replication_disable_member_action()` para desativar a ação do membro de Replicação por Grupo `mysql_start_failover_channels_if_primary`, que é ativada por padrão. Para mais informações, consulte a Seção 19.4.9.2, “Failover de Conexão Assíncrona para Réplicas”.

* `SOURCE_DELAY = interval`(change-replication-source-to.html#crs-opt-source_delay)

Especifica quantos segundos o replica deve ficar para trás em relação à fonte. Um evento recebido da fonte não é executado até que pelo menos *`interval`* segundos depois de sua execução na fonte. *`interval`* deve ser um número inteiro não negativo na faixa de 0 a 231-1. O padrão é 0. Para mais informações, consulte a Seção 19.4.11, “Replicação Atrasa”.

Uma declaração `CHANGE REPLICATION SOURCE TO` que utiliza a opção `SOURCE_DELAY` pode ser executada em uma replica em execução quando o thread de SQL de replicação é interrompido.

* `SOURCE_HEARTBEAT_PERIOD = interval`(change-replication-source-to.html#crs-opt-source_heartbeat_period)

Controla o intervalo do batimento cardíaco, que impede o tempo de espera de conexão de ocorrer na ausência de dados, se a conexão ainda estiver boa. Um sinal de batimento cardíaco é enviado para a replica após esse número de segundos, e o período de espera é redefinido sempre que o log binário da fonte é atualizado com um evento. Os batimentos cardíacos são, portanto, enviados pela fonte apenas se não houver eventos não enviados no arquivo de log binário por um período maior que este.

O intervalo de batimentos cardíacos *`interval`* é um valor decimal com o intervalo de 0 a 4294967 segundos e uma resolução em milissegundos; o menor valor não nulo é 0,001. Definindo *`interval`* para 0, os batimentos cardíacos são desativados completamente. O intervalo de batimentos cardíacos é definido como metade do valor da variável do sistema `replica_net_timeout` ou `slave_net_timeout`. Ele é registrado no repositório de metadados de origem e mostrado na tabela do Schema de Desempenho `replication_connection_configuration`.

A variável de sistema `replica_net_timeout` (do MySQL 8.0.26) ou `slave_net_timeout` (antes do MySQL 8.0.26) especifica o número de segundos que a replica espera por mais dados ou um sinal de batida de coração da fonte, antes de a replica considerar a conexão quebrada, abortar a leitura e tentar reconectar. O valor padrão é de 60 segundos (um minuto). Observe que uma mudança no valor ou configuração padrão de `replica_net_timeout` ou `slave_net_timeout` não altera automaticamente o intervalo de batida de coração, seja ele definido explicitamente ou esteja usando um padrão previamente calculado. Um aviso é emitido se você definir o valor global de `replica_net_timeout` ou `slave_net_timeout` para um valor menor que o intervalo atual de batida de coração. Se `replica_net_timeout` ou `slave_net_timeout` for alterado, você também deve emitir [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") para ajustar o intervalo de batida de coração para um valor apropriado, para que o sinal de batida de coração ocorra antes do tempo limite da conexão. Se você não fizer isso, o sinal de batida de coração não terá efeito, e se nenhum dado for recebido da fonte, a replica pode fazer tentativas repetidas de reconexão, criando threads de dump zumbi.

* `SOURCE_HOST = 'host_name'`(change-replication-source-to.html#crs-opt-source_host)

O nome de domínio ou endereço IP do servidor de origem da replicação. A réplica usa isso para se conectar à fonte. O valor máximo da cadeia é de 255 caracteres.

Se você especificar `SOURCE_HOST` ou `SOURCE_PORT`, a replica assume que o servidor de origem é diferente do anterior (mesmo que o valor da opção seja o mesmo que seu valor atual). Neste caso, os valores antigos do nome e posição do arquivo de log binário da origem são considerados não mais aplicáveis, portanto, se você não especificar `SOURCE_LOG_FILE` e `SOURCE_LOG_POS` na declaração, `SOURCE_LOG_FILE=''` e `SOURCE_LOG_POS=4` são anexados silenciosamente a ela.

Definir `SOURCE_HOST=''` (ou seja, definir explicitamente seu valor para uma string vazia) *não* é o mesmo que não definir `SOURCE_HOST` de forma alguma. Tentar definir `SOURCE_HOST` para uma string vazia falha com um erro.

* `SOURCE_LOG_FILE = 'source_log_name'`(change-replication-source-to.html#crs-opt-source_log_file), `SOURCE_LOG_POS = source_log_pos`(change-replication-source-to.html#crs-opt-source_log_file)

O nome do arquivo de registro binário e a localização nesse arquivo, na qual a thread de I/O de replicação (receptor) começa a ler o registro binário da fonte na próxima vez que a thread começa. Especifique essas opções se estiver usando replicação com base na posição do arquivo de registro binário.

`SOURCE_LOG_FILE` deve incluir o sufixo numérico de um arquivo de log binário específico que está disponível no servidor de origem, por exemplo, `SOURCE_LOG_FILE='binlog.000145'`. O comprimento máximo do valor da string é de 511 caracteres.

`SOURCE_LOG_POS` é a posição numérica para que a replica comece a ler nesse arquivo. `SOURCE_LOG_POS=4` representa o início dos eventos em um arquivo de registro binário.

Se você especificar qualquer um dos `SOURCE_LOG_FILE` ou `SOURCE_LOG_POS`, não poderá especificar `SOURCE_AUTO_POSITION = 1`, que é para replicação baseada em GTID.

Se nenhum dos `SOURCE_LOG_FILE` ou `SOURCE_LOG_POS` for especificado, a replica usa as últimas coordenadas do *thread SQL de replicação* antes de `CHANGE REPLICATION SOURCE TO` ser emitido. Isso garante que não haja descontinuidade na replicação, mesmo que o thread SQL (aplicador) de replicação tenha sido atrasado em comparação com o thread de I/O (receptor) de replicação.

* `SOURCE_PASSWORD = 'password'`(change-replication-source-to.html#crs-opt-source_password)

A senha para a conta de usuário de replicação a ser usada para se conectar ao servidor de origem de replicação. O valor da cadeia de caracteres máxima é de 32 caracteres. Se você especificar `SOURCE_PASSWORD`, `SOURCE_USER` também é necessário.

A senha usada para uma conta de usuário de replicação em uma declaração `CHANGE REPLICATION SOURCE TO` é limitada a 32 caracteres de comprimento. Tentar usar uma senha com mais de 32 caracteres faz com que `CHANGE REPLICATION SOURCE TO` falhe.

A senha é mascarada nos logs do MySQL Server, nas tabelas do Gerenciador de desempenho e nas declarações `SHOW PROCESSLIST` e (show-processlist.html "15.7.7.29 SHOW PROCESSLIST Statement").

* `SOURCE_PORT = port_num`(change-replication-source-to.html#crs-opt-source_port)

O número do port TCP/IP que a réplica usa para se conectar ao servidor de origem de replicação.

Nota

A replicação não pode usar arquivos de socket Unix. Você deve ser capaz de se conectar ao servidor de origem de replicação usando TCP/IP.

Se você especificar `SOURCE_HOST` ou `SOURCE_PORT`, a replica assume que o servidor de origem é diferente do anterior (mesmo que o valor da opção seja o mesmo que seu valor atual). Neste caso, os valores antigos do nome e posição do arquivo de log binário da origem são considerados não mais aplicáveis, portanto, se você não especificar `SOURCE_LOG_FILE` e `SOURCE_LOG_POS` na declaração, `SOURCE_LOG_FILE=''` e `SOURCE_LOG_POS=4` são anexados silenciosamente a ela.

* `SOURCE_PUBLIC_KEY_PATH = 'key_file_name'`(change-replication-source-to.html#crs-opt-source_public_key_path)

Permite a troca de senha baseada em par de chave RSA fornecendo o nome do caminho de um arquivo que contém uma cópia do lado do replicador da chave pública necessária pelo ponto de origem. O arquivo deve estar no formato PEM. O valor máximo da string é de 511 caracteres.

Esta opção se aplica a réplicas que se autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. (Para `sha256_password`, `SOURCE_PUBLIC_KEY_PATH` pode ser usado apenas se o MySQL foi construído usando OpenSSL. Se você está usando uma conta de usuário de replicação que se autentica com o plugin `caching_sha2_password` (que é o padrão a partir do MySQL 8.0), e você não está usando uma conexão segura, você deve especificar esta opção ou a opção `GET_SOURCE_PUBLIC_KEY=1` para fornecer a chave pública RSA à réplica.

* `SOURCE_RETRY_COUNT = count`(change-replication-source-to.html#crs-opt-source_retry_count)

Define o número máximo de tentativas de reconexão que a réplica faz após o tempo de conexão com a fonte expirar, conforme determinado pela variável de sistema `replica_net_timeout` ou `slave_net_timeout`. Se a réplica precisar se reconectar, a primeira tentativa ocorre imediatamente após o tempo de expiração. O padrão é 86400 tentativas.

O intervalo entre as tentativas é especificado pela opção `SOURCE_CONNECT_RETRY`. Se as configurações padrão forem usadas, a replica aguarda 60 segundos entre as tentativas de reconexão (`SOURCE_CONNECT_RETRY=60`) e continua tentando reconectar nessa taxa por 60 dias (`SOURCE_RETRY_COUNT=86400`). Um ajuste de 0 para `SOURCE_RETRY_COUNT` significa que não há limite no número de tentativas de reconexão, então a replica continua tentando reconectar indefinidamente.

Os valores para `SOURCE_CONNECT_RETRY` e `SOURCE_RETRY_COUNT` são registrados no repositório de metadados da fonte e mostrados na tabela do Schema de Desempenho `replication_connection_configuration`. `SOURCE_RETRY_COUNT` substitui a opção de inicialização do servidor `--master-retry-count`.

* `SOURCE_SSL = {0|1}`

Especifique se a replica criptografa a conexão de replicação. O padrão é 0, o que significa que a replica não criptografa a conexão de replicação. Se você definir `SOURCE_SSL=1`, pode configurar a criptografia usando as opções `SOURCE_SSL_xxx` e `SOURCE_TLS_xxx`.

Definir `SOURCE_SSL=1` para uma conexão de replicação e, em seguida, não definir mais opções de `SOURCE_SSL_xxx` corresponde a definir `--ssl-mode=REQUIRED` para o cliente, conforme descrito nas Opções de comando para conexões criptografadas. Com `SOURCE_SSL=1`, a tentativa de conexão só tem sucesso se uma conexão criptografada puder ser estabelecida. Uma conexão de replicação não retorna a uma conexão não criptografada, portanto, não há definição correspondente ao ajuste `--ssl-mode=PREFERRED` para replicação. Se `SOURCE_SSL=0` for definido, isso corresponde a `--ssl-mode=DISABLED`.

Importante

Para ajudar a prevenir ataques sofisticados de homem no meio, é importante que a replica verifique a identidade do servidor. Você pode especificar opções adicionais de `SOURCE_SSL_xxx` para corresponder aos ajustes de `--ssl-mode=VERIFY_CA` e `--ssl-mode=VERIFY_IDENTITY`, que são uma escolha melhor do que o ajuste padrão para ajudar a prevenir esse tipo de ataque. Com esses ajustes, a replica verifica que o certificado do servidor é válido e verifica que o nome de host que a replica está usando corresponde à identidade no certificado do servidor. Para implementar um desses níveis de verificação, você deve primeiro garantir que o certificado da CA do servidor esteja disponível de forma confiável para a replica, caso contrário, problemas de disponibilidade resultarão. Por esse motivo, eles não são o ajuste padrão.

* `SOURCE_SSL_xxx`, `SOURCE_TLS_xxx`

Especifique como a replica usa criptografia e cifra para proteger a conexão de replicação. Essas opções podem ser alteradas mesmo em réplicas que são compiladas sem suporte SSL. Elas são salvas no repositório de metadados da fonte, mas são ignoradas se a replica não tiver o suporte SSL habilitado. O comprimento máximo do valor para as opções de valor de string `SOURCE_SSL_xxx` e `SOURCE_TLS_xxx` é de 511 caracteres, com exceção de `SOURCE_TLS_CIPHERSUITES`, para a qual é de 4000 caracteres.

As opções `SOURCE_SSL_xxx` e `SOURCE_TLS_xxx` realizam as mesmas funções que as opções de cliente `--ssl-xxx` e `--tls-xxx` descritas nas Opções de comando para conexões criptografadas. A correspondência entre os dois conjuntos de opções e o uso das opções `SOURCE_SSL_xxx` e `SOURCE_TLS_xxx` para configurar uma conexão segura é explicado na Seção 19.3.1, “Configurando a Replicação para usar conexões criptografadas”.

* `SOURCE_USER = 'user_name'`(change-replication-source-to.html#crs-opt-source_user)

O nome de usuário para a conta de usuário de replicação a ser usada para se conectar ao servidor de origem de replicação. O valor da cadeia de caracteres tem um comprimento máximo de 96 caracteres.

Para a Replicação por Grupo, essa conta deve existir em todos os membros do grupo de replicação. Ela é usada para recuperação distribuída se a pilha de comunicação XCom estiver em uso para o grupo, e também é usada para conexões de comunicação de grupo se a pilha de comunicação MySQL estiver em uso para o grupo. Com a pilha de comunicação MySQL, a conta deve ter a permissão `GROUP_REPLICATION_STREAM`.

É possível definir um nome de usuário vazio especificando `SOURCE_USER=''`, mas o canal de replicação não pode ser iniciado com um nome de usuário vazio. Em versões anteriores ao MySQL 8.0.21, defina apenas um nome de usuário vazio `SOURCE_USER` se você precisar limpar as credenciais previamente usadas dos repositórios de metadados de replicação por motivos de segurança. Não use o canal posteriormente, devido a um bug nessas versões que pode substituir um nome de usuário padrão se um nome de usuário vazio for lido dos repositórios (por exemplo, durante um reinício automático de um canal de Replicação de Grupo). A partir do MySQL 8.0.21, é válido definir um nome de usuário vazio `SOURCE_USER` e usar o canal posteriormente se você sempre fornecer credenciais de usuário usando a declaração [`START REPLICA`](start-replica.html "15.4.2.6 START REPLICA Statement") ou declaração [`START GROUP_REPLICATION`](start-group-replication.html "15.4.3.1 START GROUP_REPLICATION Statement") que inicia o canal de replicação. Essa abordagem significa que o canal de replicação sempre precisa de intervenção do operador para reiniciar, mas as credenciais do usuário não são registradas nos repositórios de metadados de replicação.

Importante

Para se conectar à fonte usando uma conta de usuário de replicação que se autentica com o plugin `caching_sha2_password`, você deve configurar uma conexão segura conforme descrito na Seção 19.3.1, “Configurando a Replicação para Usar Conexões Encriptadas”, ou habilitar a conexão não encriptada para suportar a troca de senhas usando um par de chaves RSA. O plugin de autenticação `caching_sha2_password` é o padrão para novos usuários criados a partir do MySQL 8.0 (consulte a Seção 8.4.1.2, “Cacheamento de Autenticação Substituível SHA-2”). Se a conta de usuário que você cria ou usa para replicação usar este plugin de autenticação, e você não está usando uma conexão segura, você deve habilitar a troca de senhas baseada em par de chaves RSA para uma conexão bem-sucedida. Você pode fazer isso usando a opção `SOURCE_PUBLIC_KEY_PATH` ou a opção `GET_SOURCE_PUBLIC_KEY=1` para esta declaração.

* `SOURCE_ZSTD_COMPRESSION_LEVEL = level`(change-replication-source-to.html#crs-opt-source_zstd_compression_level)

O nível de compressão a ser usado para conexões ao servidor de origem de replicação que utilizam o algoritmo de compressão `zstd`. `SOURCE_ZSTD_COMPRESSION_LEVEL` está disponível a partir do MySQL 8.0.18. Os níveis permitidos são de 1 a 22, com valores maiores indicando níveis crescentes de compressão. O nível padrão é 3.

O ajuste do nível de compressão não afeta as conexões que não utilizam compressão `zstd`. Para mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

##### Exemplos

`CHANGE REPLICATION SOURCE TO` é útil para configurar uma replica quando você tem o instantâneo da fonte e registrou as coordenadas do log binário da fonte correspondentes ao momento do instantâneo. Após carregar o instantâneo na replica para sincronizá-la com a fonte, você pode executar `CHANGE REPLICATION SOURCE TO SOURCE_LOG_FILE='log_name', SOURCE_LOG_POS=log_pos` na replica para especificar as coordenadas nas quais a replica deve começar a ler o log binário da fonte. O exemplo a seguir altera o servidor fonte que a replica usa e estabelece as coordenadas do log binário da fonte a partir das quais a replica começa a ler:

```
CHANGE REPLICATION SOURCE TO
  SOURCE_HOST='source2.example.com',
  SOURCE_USER='replication',
  SOURCE_PASSWORD='password',
  SOURCE_PORT=3306,
  SOURCE_LOG_FILE='source2-bin.001',
  SOURCE_LOG_POS=4,
  SOURCE_CONNECT_RETRY=10;
```

Para o procedimento de alternar uma replica existente para uma nova fonte durante o failover, consulte a Seção 19.4.8, “Alternar fontes durante o failover”.

Quando os GTIDs estão em uso no servidor de origem e na replica, especifique a autoposição do GTID em vez de fornecer a posição do arquivo de log binário, como no exemplo a seguir. Para obter instruções completas sobre como configurar e iniciar a replicação baseada em GTIDs em servidores novos ou parados, servidores online ou réplicas adicionais, consulte a Seção 19.1.3, “Replicação com Identificadores Globais de Transação”.

```
CHANGE REPLICATION SOURCE TO
  SOURCE_HOST='source3.example.com',
  SOURCE_USER='replication',
  SOURCE_PASSWORD='password',
  SOURCE_PORT=3306,
  SOURCE_AUTO_POSITION = 1,
  FOR CHANNEL "source_3";
```

Neste exemplo, a replicação de várias fontes está em uso, e a declaração `CHANGE REPLICATION SOURCE TO` é aplicada ao canal de replicação `"source_3"` que conecta a réplica ao host especificado. Para obter orientações sobre a configuração da replicação de várias fontes, consulte a Seção 19.1.5, “Replicação de várias fontes do MySQL”.

O próximo exemplo mostra como fazer a replica aplicar transações de arquivos de registro de relevo que você deseja repetir. Para isso, a fonte não precisa ser acessível. Você pode usar `CHANGE REPLICATION SOURCE TO` para localizar a posição do registro de relevo onde você deseja que a replica comece a reaplicar as transações, e então iniciar o fio SQL:

```
CHANGE REPLICATION SOURCE TO
  RELAY_LOG_FILE='replica-relay-bin.006',
  RELAY_LOG_POS=4025;
START REPLICA SQL_THREAD;
```

`CHANGE REPLICATION SOURCE TO` também pode ser usado para ignorar transações no log binário que estão causando o término da replicação. O método apropriado para fazer isso depende se os GTIDs estão em uso ou não. Para instruções sobre como ignorar transações usando `CHANGE REPLICATION SOURCE TO` ou outro método, consulte a Seção 19.1.7.3, “Ignorar Transações”.

#### 15.4.2.4 Declaração de RESET REPLICA

```
RESET REPLICA [ALL] [channel_option]

channel_option:
    FOR CHANNEL channel
```

`RESET REPLICA` faz com que a replica esqueça sua posição no log binário da fonte. A partir do MySQL 8.0.22, use `RESET REPLICA` no lugar de `RESET SLAVE`, que é descontinuado a partir dessa versão. Em versões anteriores ao MySQL 8.0.22, use `RESET SLAVE`.

Esta declaração é destinada a ser usada para um início limpo; ela limpa os repositórios de metadados de replicação, exclui todos os arquivos de registro de relevo e inicia um novo arquivo de registro de relevo. Ela também redefine para 0 o atraso de replicação especificado com a opção `SOURCE_DELAY` | `MASTER_DELAY` da declaração `CHANGE REPLICATION SOURCE TO` (a partir do MySQL 8.0.23) ou da declaração [`CHANGE MASTER TO`](change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement") (antes do MySQL 8.0.23).

Nota

Todos os arquivos de registro do relé são excluídos, mesmo que não tenham sido completamente executados pelo thread de replicação do SQL. (Essa é uma condição que provavelmente existe em uma replica se você tiver emitido uma declaração `STOP REPLICA` (stop-replica.html "15.4.2.8 STOP REPLICA Statement") ou se a replica estiver altamente carregada.)

Para um servidor onde os GTIDs estão em uso (`gtid_mode` é `ON`), emitir `RESET REPLICA` não afeta o histórico de execução do GTID. A declaração não altera os valores de `gtid_executed` ou `gtid_purged`, ou a tabela `mysql.gtid_executed`. Se você precisar redefinir o histórico de execução do GTID, use [`RESET MASTER`](reset-master.html "15.4.1.2 RESET MASTER Statement"), mesmo que o servidor habilitado para GTID seja uma replica onde o registro binário está desativado.

`RESET REPLICA` exige o privilégio `RELOAD`.

Para usar `RESET REPLICA`, o fio de replicação SQL e o fio de I/O de replicação (receptor) devem ser interrompidos, portanto, em uma replica em execução, use `STOP REPLICA`(stop-replica.html "15.4.2.8 STOP REPLICA Statement") antes de emitir `RESET REPLICA`. Para usar `RESET REPLICA` em um membro de um grupo de replicação, o status do membro deve ser `OFFLINE`, o que significa que o plugin está carregado, mas o membro atualmente não pertence a nenhum grupo. Um membro de um grupo pode ser desativado usando uma declaração `STOP GROUP REPLICATION`(stop-group-replication.html "15.4.3.2 STOP GROUP_REPLICATION Statement").

A cláusula opcional `FOR CHANNEL channel` permite que você nomeie qual canal de replicação a declaração se aplica. Fornecer a cláusula `FOR CHANNEL channel` aplica a declaração `RESET REPLICA` a um canal de replicação específico. Combinar a cláusula `FOR CHANNEL channel` com a opção `ALL` exclui o canal especificado. Se nenhum canal estiver nomeado e não houver canais adicionais, a declaração se aplica ao canal padrão. Emitir uma declaração `RESET REPLICA ALL` sem a cláusula `FOR CHANNEL channel` quando existem vários canais de replicação exclui *todos* os canais de replicação e recria apenas o canal padrão. Consulte a Seção 19.2.2, “Canais de Replicação”, para obter mais informações.

`RESET REPLICA` não altera nenhum parâmetro de conexão de replicação, que incluem o nome do host e a porta da fonte, a conta de usuário de replicação e sua senha, a conta `PRIVILEGE_CHECKS_USER`, a opção `REQUIRE_ROW_FORMAT`, a opção `REQUIRE_TABLE_PRIMARY_KEY_CHECK` e a opção `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS`. Se você deseja alterar algum dos parâmetros de conexão de replicação, pode fazer isso usando uma declaração `CHANGE REPLICATION SOURCE TO`(change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") (do MySQL 8.0.23) ou declaração `CHANGE MASTER TO` (antes do MySQL 8.0.23) após o início do servidor. Se você deseja remover todos os parâmetros de conexão de replicação, use `RESET REPLICA ALL`. `RESET REPLICA ALL` também limpa a lista `IGNORE_SERVER_IDS` definida por `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO`. Quando você usou `RESET REPLICA ALL`, se deseja usar a instância como replica novamente, você precisa emitir uma declaração `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` após o início do servidor para especificar novos parâmetros de conexão.

A partir do MySQL 8.0.27, você pode definir a opção `GTID_ONLY` na declaração `CHANGE REPLICATION SOURCE TO`(change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") para impedir que um canal de replicação persista nomes de arquivo e posições de arquivo nos repositórios de metadados de replicação. Quando você emite uma declaração `RESET REPLICA`, os repositórios de metadados de replicação são sincronizados. `RESET REPLICA ALL` exclui, em vez de atualizar, os repositórios, então eles são sincronizados implicitamente.

No caso de uma saída inesperada do servidor ou reinício deliberado após a emissão de `RESET REPLICA` mas antes de emitir `START REPLICA`(start-replica.html "15.4.2.6 START REPLICA Statement"), a retenção dos parâmetros de conexão de replicação depende do repositório utilizado para os metadados de replicação:

* Quando `master_info_repository=TABLE` e `relay_log_info_repository=TABLE` são definidos no servidor (que são as configurações padrão do MySQL 8.0), os parâmetros de conexão de replicação são preservados nas tabelas seguras em caso de falha `InnoDB` `mysql.slave_master_info` e `mysql.slave_relay_log_info` como parte da operação `RESET REPLICA`. Eles também são retidos na memória. No caso de uma saída inesperada do servidor ou reinício deliberado após a emissão de `RESET REPLICA`, mas antes de emitir [`START REPLICA`](start-replica.html "15.4.2.6 START REPLICA Statement"), os parâmetros de conexão de replicação são recuperados das tabelas e reaplicados ao canal. Esta situação se aplica a partir do MySQL 8.0.13 para o repositório de metadados de conexão e a partir do MySQL 8.0.19 para o repositório de metadados do aplicável.

* Se `master_info_repository=FILE` e `relay_log_info_repository=FILE` estiverem definidos no servidor, que é descontinuado a partir do MySQL 8.0, ou se o lançamento do MySQL Server for anterior aos especificados acima, os parâmetros de conexão da replicação são mantidos apenas na memória. Se o **mysqld** da replica for reiniciado imediatamente após a emissão de `RESET REPLICA` devido a uma saída inesperada do servidor ou reinício deliberado, os parâmetros de conexão são perdidos. Nesse caso, você deve emitir uma declaração `CHANGE REPLICATION SOURCE TO` (a partir do MySQL 8.0.23) ou declaração `CHANGE MASTER TO` (antes do MySQL 8.0.23) após o início do servidor para respeificar os parâmetros de conexão antes de emitir `START REPLICA` ((start-replica.html "15.4.2.6 START REPLICA Statement")).

`RESET REPLICA` não altera as configurações dos filtros de replicação (como `--replicate-ignore-table`) para os canais afetados pela declaração. No entanto, `RESET REPLICA ALL` remove os filtros de replicação que foram definidos nos canais excluídos pela declaração. Quando o canal ou canais excluídos são recriados, quaisquer filtros de replicação globais especificados para a replica são copiados para eles, e nenhum filtro de replicação específico do canal é aplicado. Para mais informações, consulte a Seção 19.2.5.4, “Filtros baseados em canais de replicação”.

`RESET REPLICA` causa um compromisso implícito de uma transação em andamento. Veja a Seção 15.3.3, “Declarações que causam um compromisso implícito”.

Se o fio de replicação SQL estivesse em meio à replicação de tabelas temporárias quando foi interrompido e `RESET REPLICA` for emitido, essas tabelas temporárias replicadas serão excluídas na replica.

Nota

Quando usado em um nó de replicação do NDB Cluster, o `RESET REPLICA` limpa a tabela `mysql.ndb_apply_status`. Você deve ter em mente ao usar essa declaração que o `ndb_apply_status` usa o mecanismo de armazenamento `NDB` e, portanto, é compartilhado por todos os nós SQL conectados ao cluster.

Você pode sobrepor esse comportamento emitindo `SET` `GLOBAL @@` `ndb_clear_apply_status=OFF` antes de executar `RESET REPLICA`, o que impede que a replica apague a tabela `ndb_apply_status` nesses casos.

#### 15.4.2.5 Declaração de RESET SLAVE

```
RESET {SLAVE | REPLICA} [ALL] [channel_option]

channel_option:
    FOR CHANNEL channel
```

Torna a réplica esquecer sua posição no log binário da fonte. A partir do MySQL 8.0.22, `RESET SLAVE`(reset-slave.html "15.4.2.5 RESET SLAVE Statement") é desatualizado e o alias `RESET REPLICA` deve ser usado em vez disso. Em versões anteriores ao MySQL 8.0.22, use `RESET SLAVE`. A declaração funciona da mesma maneira que antes, apenas a terminologia usada para a declaração e sua saída mudou. Ambas as versões da declaração atualizam as mesmas variáveis de status quando usadas. Consulte a documentação de `RESET REPLICA`(reset-replica.html "15.4.2.4 RESET REPLICA Statement") para uma descrição da declaração.

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

`START REPLICA` inicia os fios de replicação, juntos ou separadamente. A partir do MySQL 8.0.22, use `START REPLICA` no lugar de `START SLAVE`, que é descontinuado a partir dessa versão. Em versões anteriores ao MySQL 8.0.22, use `START SLAVE`.

`START REPLICA` exige o privilégio `REPLICATION_SLAVE_ADMIN` (ou o privilégio descontinuado `SUPER`). `START REPLICA` causa um compromisso implícito de uma transação em andamento. Veja a Seção 15.3.3, “Declarações que Causam um Compromisso Implícito”.

Para as opções de tipo de fio, você pode especificar `IO_THREAD`, `SQL_THREAD`, ambos, ou nenhum deles. Apenas os fios que estão sendo iniciados são afetados pela declaração.

* `START REPLICA` sem opções de tipo de fio inicia todas as threads de replicação, assim como `START REPLICA` com ambas as opções de tipo de fio.

* `IO_THREAD` inicia o fio do receptor de replicação, que lê eventos do servidor de origem e os armazena no log de relevo.

* `SQL_THREAD` inicia o fio aplicador de replicação, que lê eventos do log de relé e os executa. Uma replica multithread (com `replica_parallel_workers` ou `slave_parallel_workers` > 0) aplica transações usando um fio coordenador e vários fios aplicadores, e `SQL_THREAD` inicia todos esses.

Importante

`START REPLICA` envia um reconhecimento ao usuário após todas as threads de replicação terem sido iniciadas. No entanto, o thread receptor de replicação ainda pode não ter se conectado ao ponto de origem com sucesso, ou um thread aplicável pode parar ao aplicar um evento logo após o início. `START REPLICA` não continua a monitorar as threads após elas terem sido iniciadas, portanto, não o alerta se elas pararem ou não puderem se conectar posteriormente. Você deve verificar o log de erro da replica para mensagens de erro geradas pelas threads de replicação, ou verificar se elas estão sendo executadas satisfatoriamente com [`SHOW REPLICA STATUS`](show-replica-status.html "15.7.7.35 SHOW REPLICA STATUS Statement"). Uma declaração `START REPLICA` bem-sucedida faz com que [`SHOW REPLICA STATUS`](show-replica-status.html "15.7.7.35 SHOW REPLICA STATUS Statement") mostre `Replica_SQL_Running=Yes`, mas pode ou não mostrar `Replica_IO_Running=Yes`, porque `Replica_IO_Running=Yes` é mostrado apenas se o thread receptor estiver em execução e conectado. Para mais informações, consulte a Seção 19.1.7.1, “Verificação do Status de Replicação”.

A cláusula opcional `FOR CHANNEL channel` permite que você nomeie qual canal de replicação a declaração se aplica. Fornecer a cláusula `FOR CHANNEL channel` aplica a declaração `START REPLICA` a um canal de replicação específico. Se nenhuma cláusula for nomeada e não houver canais extras, a declaração se aplica ao canal padrão. Se uma declaração `START REPLICA` não tiver um canal definido ao usar vários canais, esta declaração inicia os threads especificados para todos os canais. Consulte a Seção 19.2.2, “Canais de Replicação”, para obter mais informações.

Os canais de replicação para a Replicação de Grupo (`group_replication_applier` e `group_replication_recovery`) são gerenciados automaticamente pela instância do servidor. O `START REPLICA` não pode ser usado de forma alguma com o canal `group_replication_recovery`, e deve ser usado apenas com o canal `group_replication_applier` quando a Replicação de Grupo não estiver em execução. O canal `group_replication_applier` tem apenas um fio de aplicador e não tem fio de receptor, portanto, pode ser iniciado se necessário, usando a opção `SQL_THREAD` sem a opção `IO_THREAD`.

`START REPLICA` suporta autenticação de usuário e senha intercambiável (consulte a Seção 8.2.17, “Autenticação Intercambiável”) com as opções `USER`, `PASSWORD`, `DEFAULT_AUTH` e `PLUGIN_DIR`, conforme descrito na lista a seguir. Ao usar essas opções, você deve iniciar o thread do receptor (opção `IO_THREAD`) ou todos os threads de replicação; não pode iniciar o thread do aplicável de replicação (opção `SQL_THREAD`) sozinho.

`USER` :   O nome do usuário para a conta. Você deve definir isso se `PASSWORD` for usado. A opção não pode ser definida como uma string vazia ou nula.

`PASSWORD` :   A senha da conta de usuário nomeada.

`DEFAULT_AUTH` :   O nome do plugin de autenticação. O padrão é a autenticação nativa do MySQL.

`PLUGIN_DIR` :   Localização do plugin de autenticação.

Importante

A senha que você definiu usando `START REPLICA` é mascarada quando é escrita nos logs do MySQL Server, nas tabelas do Gerenciador de desempenho e nas instruções `SHOW PROCESSLIST`. No entanto, ela é enviada em texto plano sobre a conexão com a instância do servidor de replica. Para proteger a senha em trânsito, use criptografia SSL/TLS, um túnel SSH ou outro método para proteger a conexão de visualização não autorizada, para a conexão entre a instância do servidor de replica e o cliente que você usa para emitir `START REPLICA`.

A cláusula `UNTIL` faz com que a replica comece a replicar, processando as transações até o ponto que você especifica na cláusula `UNTIL`, e depois pare novamente. A cláusula `UNTIL` pode ser usada para fazer com que a replica prossiga até pouco antes do ponto onde você deseja pular uma transação indesejada, e depois pule a transação conforme descrito na Seção 19.1.7.3, “Pular Transações”. Para identificar uma transação, você pode usar **mysqlbinlog** com o log binário da fonte ou o log de relevo da replica, ou usar uma declaração `SHOW BINLOG EVENTS`.

Você também pode usar a cláusula `UNTIL` para depuração da replicação, processando transações uma de cada vez ou em seções. Se você estiver usando a cláusula `UNTIL` para fazer isso, inicie a replica com a opção `--skip-slave-start`, ou a partir do MySQL 8.0.24, a variável de sistema `skip_slave_start`, para evitar que o thread SQL seja executado quando o servidor de replicação é iniciado. Remova a configuração da opção ou variável de sistema após o procedimento ser concluído, para que não seja esquecida em caso de reinício inesperado do servidor.

A declaração `SHOW REPLICA STATUS` inclui campos de saída que exibem os valores atuais da condição `UNTIL`. A condição `UNTIL` dura enquanto os fios afetados ainda estão em execução e é removida quando eles param.

A cláusula `UNTIL` opera na thread do aplicador de replicação (opção `SQL_THREAD`). Você pode usar a opção `SQL_THREAD` ou deixar a replica padrão para iniciar ambos os threads. Se você usar a opção `IO_THREAD` sozinha, a cláusula `UNTIL` é ignorada porque o thread do aplicador não é iniciado.

O ponto que você especifica na cláusula `UNTIL` pode ser uma (e apenas uma) das seguintes opções:

`SOURCE_LOG_FILE` e `SOURCE_LOG_POS` (do MySQL 8.0.23), ou `MASTER_LOG_FILE` e `MASTER_LOG_POS` (para o MySQL 8.0.22):   Essas opções fazem com que o processo de aplicação de replicação transfira transações até uma posição em seu log de relevo, identificada pelo nome do arquivo e pela posição do arquivo do ponto correspondente no log binário no servidor de origem. O fio do aplicador encontra o limite de transação mais próximo em ou após a posição especificada, termina a aplicação da transação e para ali. Para payloads de transação comprimidos, especifique a posição final do `Transaction_payload_event` comprimido.

Essas opções ainda podem ser usadas quando a opção `GTID_ONLY` foi definida na declaração `CHANGE REPLICATION SOURCE TO`(change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") para impedir que o canal de replicação persista nomes de arquivo e posições de arquivo nos repositórios de metadados de replicação. Os nomes de arquivo e posições de arquivo são rastreados na memória.

`RELAY_LOG_FILE` e `RELAY_LOG_POS` : Essas opções fazem com que o processo de aplicação de replicação transfira transações até uma posição no log de relevo da replica, identificada pelo nome do arquivo do log de relevo e uma posição nesse arquivo. O fio do aplicável encontra o limite de transação mais próximo em ou após a posição especificada, termina a aplicação da transação e para lá. Para cargas de trabalho de transação comprimidas, especifique a posição final do `Transaction_payload_event` comprimido.

Essas opções ainda podem ser usadas quando a opção `GTID_ONLY` foi definida na declaração `CHANGE REPLICATION SOURCE TO`(change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") para impedir que o canal de replicação persista nomes de arquivo e posições de arquivo nos repositórios de metadados de replicação. Os nomes de arquivo e posições de arquivo são rastreados na memória.

`SQL_BEFORE_GTIDS` :   Essa opção faz com que o aplicativo de replicação comece a processar as transações e pare quando encontrar qualquer transação que esteja no conjunto especificado de GTID. A transação encontrada no conjunto de GTID não é aplicada, assim como nenhuma das outras transações no conjunto de GTID. A opção recebe um conjunto de GTID que contém um ou mais identificadores de transação global como argumento (consulte Conjuntos de GTID). As transações em um conjunto de GTID não aparecem necessariamente na corrente de replicação na ordem de seus GTIDs, então a transação antes da qual o aplicativo pára não é necessariamente a mais antiga.

`SQL_AFTER_GTIDS` :   Essa opção faz com que o aplicativo de replicação comece a processar transações e pare quando tiver processado todas as transações em um conjunto especificado de GTID. A opção recebe um conjunto de GTID contendo um ou mais identificadores de transação global como argumento (consulte Conjuntos de GTID).

Com `SQL_AFTER_GTIDS`, os fios de replicação param após terem processado todas as transações no conjunto GTID. As transações são processadas na ordem recebida, portanto, é possível que essas transações incluam aquelas que não fazem parte do conjunto GTID, mas que são recebidas (e processadas) antes de todas as transações do conjunto terem sido comprometidas. Por exemplo, a execução de `START REPLICA UNTIL SQL_AFTER_GTIDS = 3E11FA47-71CA-11E1-9E33-C80AA9429562:11-56` faz com que a replica obtenha (e processe) todas as transações da fonte até que todas as transações com os números de sequência de 11 a 56 tenham sido processadas, e então pare sem processar quaisquer transações adicionais após esse ponto ter sido alcançado.

`SQL_AFTER_GTIDS` não é compatível com o aplicador multi-threaded. Se esta opção for usada com o aplicador multi-threaded, um aviso é exibido e a replica muda para o modo de thread único. Dependendo do caso de uso, é possível usar `START REPLICA UNTIL MASTER_LOG_POS` ou `START REPLICA UNTIL SQL_BEFORE_GTIDS`. Você também pode usar `WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()`, que espera até que a posição correta seja alcançada, mas não para o thread do aplicador.

`SQL_AFTER_MTS_GAPS` :   Apenas para uma replica multithreading (com `replica_parallel_workers` ou `slave_parallel_workers` > 0), esta opção faz o processo de replicação de transações até o ponto em que não há mais lacunas na sequência de transações executadas a partir do log de relevo. Ao usar uma replica multithreading, há uma chance de lacunas ocorrerem nas seguintes situações:

* O fio do coordenador é interrompido.
* Um erro ocorre nos fios do aplicador.
* O **mysqld** é desligado inesperadamente.

Quando um canal de replicação tem lacunas, o banco de dados da replica está em um estado que nunca teria existido na fonte. A replica rastreia as lacunas internamente e não permite as declarações `CHANGE REPLICATION SOURCE TO` (change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") que removeriam as informações da lacuna se fossem executadas.

Antes do MySQL 8.0.26, emitir `START REPLICA` em uma replica multithread com lacunas na sequência de transações executadas a partir do log de relevo gera um aviso. Para corrigir essa situação, a solução é usar `START REPLICA UNTIL SQL_AFTER_MTS_GAPS`. Consulte a Seção 19.5.1.34, “Replicação e Inconsistências de Transação”, para obter mais informações.

A partir do MySQL 8.0.26, o processo de verificação de lacunas na sequência de transações é ignorado completamente quando a replicação baseada em GTID e o autoposicionamento de GTID (`SOURCE_AUTO_POSITION=1`) estão em uso para o canal, porque as lacunas nas transações podem ser resolvidas usando o autoposicionamento de GTID. Nessa situação, `START REPLICA UNTIL SQL_AFTER_MTS_GAPS` apenas para o thread do aplicável quando ele encontra a primeira transação a ser executada e não tenta verificar lacunas na sequência de transações. Você também pode continuar a usar as declarações `CHANGE REPLICATION SOURCE TO`(change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") como de costume, e a recuperação de log de releio é possível para o canal.

A partir do MySQL 8.0.27, todas as réplicas são multithreadadas por padrão. Quando `replica_preserve_commit_order=ON` ou `slave_preserve_commit_order=ON` é definido para a réplica, que também é o ajuste padrão do MySQL 8.0.27, não devem ocorrer lacunas, exceto nas situações específicas listadas na descrição para `replica_preserve_commit_order` e `slave_preserve_commit_order`. Se `replica_preserve_commit_order=OFF` ou `slave_preserve_commit_order=OFF` é definido para a réplica, que é o ajuste padrão antes do MySQL 8.0.27, a ordem de compromisso das transações não é preservada, portanto, a chance de ocorrerem lacunas é muito maior.

Se os GTIDs não estiverem em uso e você precise alterar uma replica multithreading falha para modo de thread único, você pode emitir a seguinte série de declarações, na ordem mostrada:

    ```
    START SLAVE UNTIL SQL_AFTER_MTS_GAPS;
    SET @@GLOBAL.slave_parallel_workers = 0;
    START SLAVE SQL_THREAD;

    Or from MySQL 8.0.26:
    START REPLICA UNTIL SQL_AFTER_MTS_GAPS;
    SET @@GLOBAL.replica_parallel_workers = 0;
    START REPLICA SQL_THREAD;
    ```

#### 15.4.2.7 Declaração de Início de Escravo

```
START {SLAVE | REPLICA} [thread_types] [until_option] [connection_options] [channel_option]

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

Começa os threads de replicação. A partir do MySQL 8.0.22, `START SLAVE` é descontinuado e o alias `START REPLICA` deve ser usado em vez disso. A declaração funciona da mesma maneira que antes, apenas a terminologia usada para a declaração e sua saída mudou. Ambas as versões da declaração atualizam as mesmas variáveis de status quando usadas. Por favor, consulte a documentação para `START REPLICA` para uma descrição da declaração.

#### 15.4.2.8 Declaração STOP REPLICA

```
STOP REPLICA [thread_types] [channel_option]

thread_types:
    [thread_type [, thread_type] ... ]

thread_type: IO_THREAD | SQL_THREAD

channel_option:
    FOR CHANNEL channel
```

Parapage o roteiros de replicação. A partir do MySQL 8.0.22, use `STOP REPLICA` em vez de `STOP SLAVE`, que já está desatualizado. Em versões anteriores ao MySQL 8.0.22, use `STOP SLAVE`.

`STOP REPLICA` exige o privilégio `REPLICATION_SLAVE_ADMIN` (ou o privilégio descontinuado `SUPER`). A melhor prática recomendada é executar `STOP REPLICA` na replica antes de parar o servidor da replica (consulte a Seção 7.1.19, “O processo de desligamento do servidor”, para mais informações).

Assim como `START REPLICA`(start-replica.html "15.4.2.6 START REPLICA Statement"), esta declaração pode ser usada com as opções `IO_THREAD` e `SQL_THREAD` para nomear o(s) fio(s) de replicação a serem interrompido(s). Observe que o canal do aplicativo de replicação de grupo (`group_replication_applier`) não tem fio(s) de I/O (receptor) de replicação, apenas um fio de SQL de replicação (aplicativo). Portanto, usando a opção `SQL_THREAD` interrompe completamente esse canal.

`STOP REPLICA` causa um compromisso implícito de uma transação em andamento. Veja a Seção 15.3.3, “Declarações que causam um compromisso implícito”.

`gtid_next` deve ser definido como `AUTOMATIC` antes de emitir essa declaração.

Você pode controlar quanto tempo o `STOP REPLICA` espera antes de expirar o tempo de espera, definindo a variável do sistema `rpl_stop_replica_timeout` (a partir do MySQL 8.0.26) ou `rpl_stop_slave_timeout` (antes do MySQL 8.0.26). Isso pode ser usado para evitar deadlocks entre o `STOP REPLICA` e outros comandos SQL que utilizam diferentes conexões de cliente para a replica. Quando o valor do tempo de espera é alcançado, o cliente que emitiu o comando retorna uma mensagem de erro e para de esperar, mas a instrução `STOP REPLICA` permanece em vigor. Uma vez que os threads de replicação deixam de ser ocupados, a instrução `STOP REPLICA` é executada e a replica para.

Algumas declarações `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` são permitidas enquanto a replica está em execução, dependendo dos estados dos threads de replicação. No entanto, usar `STOP REPLICA` antes de executar uma declaração `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` nesses casos ainda é suportada. Consulte a Seção 15.4.2.3, “Declaração de MUDAR a Fonte de REPLICAÇÃO”, a Seção 15.4.2.1, “Declaração de MUDAR o MESTRE”, e a Seção 19.4.8, “Mudança de Fontes Durante o Failover”, para obter mais informações.

A cláusula opcional `FOR CHANNEL channel` permite que você nomeie qual canal de replicação a declaração se aplica. Fornecer a cláusula `FOR CHANNEL channel` aplica a declaração `STOP REPLICA` a um canal de replicação específico. Se nenhum canal for nomeado e não houver canais extras, a declaração se aplica ao canal padrão. Se uma declaração `STOP REPLICA` não nomear um canal ao usar vários canais, essa declaração para de interromper os threads especificados para todos os canais. Consulte a Seção 19.2.2, “Canais de Replicação”, para obter mais informações.

Os canais de replicação para a Replicação de Grupo (`group_replication_applier` e `group_replication_recovery`) são gerenciados automaticamente pela instância do servidor. O canal `STOP REPLICA` não pode ser usado de forma alguma com o canal `group_replication_recovery`, e deve ser usado apenas com o canal `group_replication_applier` quando a Replicação de Grupo não estiver em execução. O canal `group_replication_applier` tem apenas um fio aplicável e não tem fio receptor, portanto, pode ser interrompido, se necessário, usando a opção `SQL_THREAD` sem a opção `IO_THREAD`.

Quando a replica é multithreaded (`replica_parallel_workers` ou `slave_parallel_workers` é um valor não nulo), quaisquer lacunas na sequência de transações executadas a partir do log de relevo são fechadas como parte da parada dos threads do trabalhador. Se a replica for parada inesperadamente (por exemplo, devido a um erro em um thread de trabalhador ou outro thread emitindo `KILL`) enquanto uma declaração `STOP REPLICA` está sendo executada, a sequência de transações executadas a partir do log de relevo pode se tornar inconsistente. Consulte a Seção 19.5.1.34, “Replicação e Inconsistências de Transação”, para obter mais informações.

Quando a fonte estiver usando o formato de registro binário baseado em linha, você deve executar `STOP REPLICA` ou `STOP REPLICA SQL_THREAD` na replica antes de desligar o servidor de replicação, se você estiver replicando quaisquer tabelas que utilizem um motor de armazenamento não transacional. Se o grupo de eventos de replicação atual tiver modificado uma ou mais tabelas não transacionais, `STOP REPLICA` aguarda até 60 segundos para que o grupo de eventos seja concluído, a menos que você emita uma declaração `KILL QUERY` (kill.html "15.7.8.4 KILL Statement") ou `KILL CONNECTION` (kill.html "15.7.8.4 KILL Statement") para o thread SQL de replicação. Se o grupo de eventos permanecer incompleto após o tempo limite, uma mensagem de erro é registrada.

Quando a fonte está usando o formato de registro binário baseado em declarações, alterar a fonte enquanto ela tem tabelas temporárias abertas é potencialmente inseguro. Esse é um dos motivos pelos quais a replicação baseada em declarações de tabelas temporárias não é recomendada. Você pode descobrir se há alguma tabela temporária na replica verificando o valor de `Replica_open_temp_tables` ou `Slave_open_temp_tables`. Ao usar a replicação baseada em declarações, esse valor deve ser 0 antes de executar `CHANGE REPLICATION SOURCE TO` (change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") | `CHANGE MASTER TO`. Se houver alguma tabela temporária aberta na replica, emitir uma declaração `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` após emitir uma declaração `STOP REPLICA` causa um aviso `ER_WARN_OPEN_TEMP_TABLES_MUST_BE_ZERO`.

#### 15.4.2.9 Declaração de PARAR SLAVE

```
STOP {SLAVE | REPLICA} [thread_types] [channel_option]

thread_types:
    [thread_type [, thread_type] ... ]

thread_type: IO_THREAD | SQL_THREAD

channel_option:
    FOR CHANNEL channel
```

Parapage o roteiros de replicação. A partir do MySQL 8.0.22, `STOP SLAVE` é descontinuado e o alias `STOP REPLICA` deve ser usado em vez disso. A declaração funciona da mesma maneira que antes, apenas a terminologia usada para a declaração e sua saída mudou. Ambas as versões da declaração atualizam as mesmas variáveis de status quando usadas. Por favor, consulte a documentação para `STOP REPLICA` para uma descrição da declaração.

### 15.4.3 Esses são os comandos SQL para controlar a replicação de grupos

Esta seção fornece informações sobre as declarações utilizadas para controlar a replicação do grupo.

#### 15.4.3.1 Declaração START GROUP_REPLICATION

```
  START GROUP_REPLICATION
          [USER='user_name']
          [, PASSWORD='user_pass']
          [, DEFAULT_AUTH='plugin_name']
```

Começa a replicação em grupo. Essa declaração requer o privilégio `GROUP_REPLICATION_ADMIN` (ou o privilégio descontinuado `SUPER`). Se `super_read_only=ON` estiver definido e o membro deve se juntar como principal, `super_read_only` é definido como `OFF` uma vez que a Replicação em Grupo seja iniciada com sucesso.

Um servidor que participa de um grupo no modo single-primary deve usar `skip_replica_start=ON`. Caso contrário, o servidor não tem permissão para se juntar a um grupo como secundário.

No MySQL 8.0.21 e versões posteriores, você pode especificar credenciais de usuário para recuperação distribuída na declaração `START GROUP_REPLICATION` usando as opções `USER`, `PASSWORD` e `DEFAULT_AUTH`, conforme segue:

* `USER`: O usuário de replicação para recuperação distribuída. Para obter instruções sobre como configurar essa conta, consulte a Seção 20.2.1.3, “Credenciais do usuário para recuperação distribuída”. Não é possível especificar uma string vazia ou nula, ou omitir a opção `USER` se `PASSWORD` for especificado.

* `PASSWORD`: A senha da conta de usuário de replicação. A senha não pode ser criptografada, mas é mascarada no log de consulta.

* `DEFAULT_AUTH`: O nome do plugin de autenticação utilizado para a conta de usuário de replicação. Se você não especificar esta opção, a autenticação nativa do MySQL (o plugin `mysql_native_password` é assumido). Esta opção atua como um aviso para o servidor, e o doador para recuperação distribuída a ela prevalece se um plugin diferente for associado à conta de usuário nesse servidor. O plugin de autenticação usado por padrão ao criar contas de usuário no MySQL 8 é o plugin de autenticação de cache SHA-2 (`caching_sha2_password`). Consulte a Seção 8.2.17, “Autenticação Conectada”, para mais informações sobre plugins de autenticação.

Essas credenciais são usadas para recuperação distribuída no canal `group_replication_recovery`. Quando você especifica credenciais de usuário no `START GROUP_REPLICATION`, as credenciais são salvas apenas na memória e são removidas por uma declaração `STOP GROUP_REPLICATION` ou desligamento do servidor. Você deve emitir uma declaração `START GROUP_REPLICATION` para fornecer as credenciais novamente. Esse método, portanto, não é compatível com o início da Replicação em Grupo automaticamente no início do servidor, conforme especificado pela variável de sistema `group_replication_start_on_boot`.

As credenciais do usuário especificadas em `START GROUP_REPLICATION` têm precedência sobre quaisquer credenciais do usuário definidas para o canal `group_replication_recovery` usando uma declaração `CHANGE REPLICATION SOURCE TO` (a partir do MySQL 8.0.23) ou uma declaração [`CHANGE MASTER TO`](change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement") (antes do MySQL 8.0.23). Observe que as credenciais do usuário definidas usando essas declarações são armazenadas nos repositórios de metadados de replicação e são usadas quando `START GROUP_REPLICATION` é especificado sem credenciais do usuário, incluindo iniciações automáticas se a variável de sistema `group_replication_start_on_boot` for definida como `ON`. Para obter os benefícios de segurança da especificação de credenciais do usuário em `START GROUP_REPLICATION`, certifique-se de que `group_replication_start_on_boot` esteja definido como `OFF` (o padrão é `ON`), e exclua quaisquer credenciais do usuário previamente definidas para o canal `group_replication_recovery`, seguindo as instruções na Seção 20.6.3, “Segurando Conexões de Recuperação Distribuída”.

Enquanto um membro está retornando a um grupo de replicação, seu status pode ser exibido como `OFFLINE` ou `ERROR` antes de o grupo completar as verificações de compatibilidade e aceitá-lo como membro. Quando o membro está acompanhando as transações do grupo, seu status é `RECOVERING`.

#### 15.4.3.2 Declaração STOP GROUP_REPLICATION

```
STOP GROUP_REPLICATION
```

Para de replicar o grupo. Essa declaração requer o privilégio `GROUP_REPLICATION_ADMIN` (ou o privilégio descontinuado `SUPER`). Assim que você emitir `STOP GROUP_REPLICATION`(stop-group-replication.html "15.4.3.2 STOP GROUP_REPLICATION Statement"), o membro é definido como `super_read_only=ON`, o que garante que nenhuma escrita possa ser feita no membro enquanto a replicação do grupo é interrompida. Todos os outros canais de replicação assíncrona que estão em execução no membro também são interrompidos. Todas as credenciais de usuário que você especificou na declaração `START GROUP_REPLICATION`(start-group-replication.html "15.4.3.1 START GROUP_REPLICATION Statement") quando iniciou a replicação do grupo neste membro são removidas da memória e devem ser fornecidas quando você iniciar a replicação do grupo novamente.

Aviso

Use essa declaração com extrema cautela, pois ela remove a instância do servidor do grupo, o que significa que ela não é mais protegida pelos mecanismos de garantia de consistência da Replicação de Grupo. Para garantir a segurança total, certifique-se de que suas aplicações não possam mais se conectar à instância antes de emitir essa declaração, para evitar qualquer chance de leituras obsoletas.

A declaração `STOP GROUP_REPLICATION` interrompe os canais de replicação assíncrona nos membros do grupo, mas não compromete implicitamente as transações em andamento neles, como a declaração (stop-replica.html "15.4.2.8 STOP REPLICA Statement") faz. Isso ocorre porque, em um membro do grupo de replicação de grupo, uma transação adicional comprometida durante a operação de desligamento deixaria o membro inconsistente com o grupo e causaria um problema com a reconexão. Para evitar compromissos falhados para transações em andamento enquanto se interrompe a replicação de grupo, a partir do MySQL 8.0.28, a declaração `STOP GROUP_REPLICATION` não pode ser emitida enquanto um GTID é atribuído como o valor da variável de sistema `gtid_next`.

A variável de sistema `group_replication_components_stop_timeout` especifica o tempo durante o qual a Replicação em Grupo espera que cada um de seus módulos complete os processos em andamento após a emissão dessa declaração. O tempo limite é usado para resolver situações em que os componentes da Replicação em Grupo não podem ser interrompidos normalmente, o que pode acontecer se o membro for expulso do grupo enquanto estiver em um estado de erro, ou enquanto um processo como o MySQL Enterprise Backup estiver mantendo um bloqueio global em tabelas no membro. Nessas situações, o membro não pode interromper o thread do aplicável ou completar o processo de recuperação distribuída para se reagrupar. `STOP GROUP_REPLICATION` não é concluído até que a situação seja resolvida (por exemplo, pelo bloqueio ser liberado) ou o tempo limite do componente expire e os módulos sejam desligados, independentemente de seu status. Antes do MySQL 8.0.27, o tempo limite padrão do componente é de 31536000 segundos, ou 365 dias. Com essa configuração, o tempo limite do componente não ajuda em situações como as descritas acima, então um valor mais baixo é recomendado nessas versões do MySQL 8.0. A partir do MySQL 8.0.27, o valor padrão é de 300 segundos; isso significa que os componentes da Replicação em Grupo são interrompidos após 5 minutos se a situação não for resolvida antes desse tempo, permitindo que o membro seja reiniciado e se reagrupe.