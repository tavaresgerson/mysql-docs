#### 15.4.2.3 ALTERE A FONTE DE REPLICAÇÃO PARA Declaração

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

`CHANGE REPLICATION SOURCE TO` altera os parâmetros que o servidor de replicação usa para se conectar à fonte e ler dados da fonte. Também atualiza o conteúdo dos repositórios de metadados de replicação (consulte a Seção 19.2.4, “Repositórios de Log de Relógio e Metadados de Replicação”). No MySQL 8.0.23 e versões posteriores, use `CHANGE REPLICATION SOURCE TO` no lugar da declaração desatualizada `CHANGE MASTER TO`.

O `CHANGE REPLICATION SOURCE TO` requer o privilégio `REPLICATION_SLAVE_ADMIN` (ou o privilégio descontinuado `SUPER`).

As opções que você não especificar em uma declaração `CHANGE REPLICATION SOURCE TO` mantêm seu valor, exceto conforme indicado na discussão a seguir. Portanto, na maioria dos casos, não há necessidade de especificar opções que não mudam.

Os valores usados para `SOURCE_HOST` e outras opções `CHANGE REPLICATION SOURCE TO` são verificados quanto a caracteres de retorno de linha (`\n` ou `0x0A`). A presença desses caracteres nesses valores faz com que a declaração falhe com um erro.

A cláusula opcional `FOR CHANNEL channel` permite que você nomeie qual canal de replicação a declaração se aplica. A cláusula `FOR CHANNEL channel` aplica a declaração `CHANGE REPLICATION SOURCE TO` a um canal de replicação específico e é usada para adicionar um novo canal ou modificar um canal existente. Por exemplo, para adicionar um novo canal chamado `channel2`:

```
CHANGE REPLICATION SOURCE TO SOURCE_HOST=host1, SOURCE_PORT=3002 FOR CHANNEL 'channel2';
```

Se nenhuma cláusula for nomeada e não houver canais extras, uma declaração `CHANGE REPLICATION SOURCE TO` será aplicada ao canal padrão, cujo nome é a string vazia (""). Quando você configurou vários canais de replicação, cada declaração `CHANGE REPLICATION SOURCE TO` deve nomear um canal usando a cláusula `FOR CHANNEL channel`. Consulte a Seção 19.2.2, “Canais de Replicação”, para obter mais informações.

Para algumas das opções da declaração `CHANGE REPLICATION SOURCE TO`, você deve emitir uma declaração `STOP REPLICA` antes de emitir uma declaração `CHANGE REPLICATION SOURCE TO` (e uma declaração `START REPLICA` depois). Às vezes, você só precisa interromper o fio de SQL de replicação (aplicador) ou o fio de I/O de replicação (receptor), e não ambos:

- Quando o fio de aplicação é interrompido, você pode executar `CHANGE REPLICATION SOURCE TO` usando qualquer combinação permitida de opções `RELAY_LOG_FILE`, `RELAY_LOG_POS` e `SOURCE_DELAY`, mesmo que o fio de recebimento de replicação esteja em execução. Nenhuma outra opção pode ser usada com essa declaração quando o fio de recebimento estiver em execução.

- Quando o fio receptor é interrompido, você pode executar `CHANGE REPLICATION SOURCE TO` usando qualquer uma das opções para essa declaração (em qualquer combinação permitida) *exceto* `RELAY_LOG_FILE`, `RELAY_LOG_POS`, `SOURCE_DELAY` ou `SOURCE_AUTO_POSITION = 1`, mesmo quando o fio aplicante estiver em execução.

- Tanto o fio do receptor quanto o fio do aplicador devem ser interrompidos antes de emitir uma declaração `CHANGE REPLICATION SOURCE TO` que utilize `SOURCE_AUTO_POSITION = 1`, `GTID_ONLY = 1` ou `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS`.

Você pode verificar o estado atual do fio do aplicador de replicação e do fio do receptor de replicação usando `SHOW REPLICA STATUS`. Observe que o canal do aplicador de replicação de grupo (`group_replication_applier`) não tem um fio de receptor, apenas um fio de aplicador.

As declarações `CHANGE REPLICATION SOURCE TO` têm vários efeitos colaterais e interações que você deve estar ciente de antemão:

- `CHANGE REPLICATION SOURCE TO` causa um commit implícito de uma transação em andamento. Veja a Seção 15.3.3, “Declarações que causam um commit implícito”.

- `CHANGE REPLICATION SOURCE TO` faz com que os valores anteriores para `SOURCE_HOST`, `SOURCE_PORT`, `SOURCE_LOG_FILE` e `SOURCE_LOG_POS` sejam escritos no log de erros, juntamente com outras informações sobre o estado da replica antes da execução.

- Se você estiver usando a replicação baseada em declarações e tabelas temporárias, é possível que uma declaração `CHANGE REPLICATION SOURCE TO` que siga uma declaração `STOP REPLICA` deixe tabelas temporárias na replica. Um aviso (`ER_WARN_OPEN_TEMP_TABLES_MUST_BE_ZERO`) é emitido sempre que isso ocorre. Você pode evitar isso nesses casos, garantindo que o valor da variável de status do sistema `Replica_open_temp_tables` ou `Slave_open_temp_tables` seja igual a 0 antes de executar uma declaração `CHANGE REPLICATION SOURCE TO` desse tipo.

- Ao usar uma replica multithread (`replica_parallel_workers` > 0), parar a replicação pode causar lacunas na sequência de transações que foram executadas a partir do log de retransmissão, independentemente de a replicação ter sido parada intencionalmente ou de outra forma. Quando essas lacunas existem, a emissão de `CHANGE REPLICATION SOURCE TO` falha. A solução para essa situação é emitir `START REPLICA UNTIL SQL_AFTER_MTS_GAPS`, que garante que as lacunas sejam fechadas. A partir do MySQL 8.0.26, o processo de verificação de lacunas na sequência de transações é ignorado completamente quando a replicação baseada em GTID e o autoposicionamento de GTID estão em uso, porque as lacunas nas transações podem ser resolvidas usando o autoposicionamento de GTID. Nessa situação, `CHANGE REPLICATION SOURCE TO` ainda pode ser usado.

As seguintes opções estão disponíveis para as declarações `CHANGE REPLICATION SOURCE TO`:

- `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS = {OFF | LOCAL | uuid}`

  Faz com que o canal de replicação atribua um GTID às transações replicadas que não possuem um, permitindo a replicação de uma fonte que não usa replicação baseada em GTID para uma replica que a usa. Para uma replica de múltiplas fontes, você pode ter uma mistura de canais que usam `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` e canais que não o usam. O padrão é `OFF`, o que significa que o recurso não é usado.

  `LOCAL` atribui um GTID que inclui o próprio UUID da replica (a configuração `server_uuid`). `uuid` atribui um GTID que inclui o UUID especificado, como a configuração `server_uuid` para o servidor de origem da replicação. O uso de um UUID não local permite diferenciar as transações que se originaram na replica daquelas que se originaram na origem, e, para uma replica de múltiplas origens, entre as transações que se originaram em diferentes origens. O UUID que você escolher tem significado apenas para o uso exclusivo da replica. Se alguma das transações enviadas pela origem já tiver um GTID, esse GTID é mantido.

  Os canais específicos para a Replicação em Grupo não podem usar `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS`, mas um canal de replicação assíncrona para outra fonte em uma instância do servidor que é membro de um grupo de Replicação em Grupo pode fazê-lo. Nesse caso, não especifique o nome do grupo de Replicação em Grupo como o UUID para a criação dos GTIDs.

  Para definir `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` para `LOCAL` ou `uuid`, a replica deve ter `gtid_mode=ON` definido, e isso não pode ser alterado posteriormente. Esta opção é para uso com uma fonte que tem replicação com posição de arquivo de log binário, portanto, `SOURCE_AUTO_POSITION=1` não pode ser definido para o canal. Tanto o fio de SQL de replicação quanto o fio de I/O de replicação (receptor) devem ser interrompidos antes de definir esta opção.

  Importante

  Um conjunto de replicação configurado com `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` em qualquer canal não pode ser promovido para substituir o servidor de origem da replicação, caso seja necessário um failover, e um backup feito da replica não pode ser usado para restaurar o servidor de origem da replicação. A mesma restrição se aplica à substituição ou restauração de outras réplicas que utilizam `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` em qualquer canal.

  Para obter mais informações e restrições, consulte a Seção 19.1.3.6, “Replicação de uma fonte sem GTIDs para uma réplica com GTIDs”.

- `GET_SOURCE_PUBLIC_KEY = {0|1}`

  Habilita a troca de senha baseada em par de chaves RSA, solicitando a chave pública da fonte. A opção está desabilitada por padrão.

  Esta opção se aplica a réplicas que se autenticam com o plugin de autenticação `caching_sha2_password`. Para conexões por contas que se autenticam usando este plugin, a fonte não envia a chave pública a menos que seja solicitada, portanto, ela deve ser solicitada ou especificada no cliente. Se `SOURCE_PUBLIC_KEY_PATH` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `GET_SOURCE_PUBLIC_KEY`. Se você estiver usando uma conta de usuário de replicação que se autentica com o plugin `caching_sha2_password` (que é o padrão a partir do MySQL 8.0) e não estiver usando uma conexão segura, você deve especificar esta opção ou a opção `SOURCE_PUBLIC_KEY_PATH` para fornecer a chave pública RSA à réplica.

- `GTID_ONLY = {0|1}`

  Para impedir que os nomes de arquivos e as posições de arquivos persistam nos repositórios de metadados de replicação. A opção `GTID_ONLY` está disponível a partir do MySQL 8.0.27. A opção `GTID_ONLY` está desabilitada por padrão para canais de replicação assíncronos, mas está habilitada por padrão para canais de replicação em grupo e não pode ser desabilitada para eles.

  Para canais de replicação com essa configuração, as posições de arquivo na memória ainda são rastreadas e as posições de arquivo ainda podem ser observadas para fins de depuração em mensagens de erro e por meio de interfaces como as instruções `SHOW REPLICA STATUS` (onde elas são mostradas como inválidas se estiverem desatualizadas). No entanto, as escritas e leituras necessárias para persistir e verificar as posições de arquivo são evitadas em situações em que a replicação baseada em GTID não as exija realmente, incluindo a fila de transações e o processo do aplicativo.

  Essa opção só pode ser usada se o fio de SQL de replicação (aplicável) e o fio de I/O de replicação (receptor) estiverem parados. Para definir `GTID_ONLY = 1` para um canal de replicação, os GTIDs devem estar em uso no servidor (`gtid_mode = ON`), e o registro binário baseado em linhas deve estar em uso na fonte (a replicação baseada em declarações não é suportada). As opções `REQUIRE_ROW_FORMAT = 1` e `SOURCE_AUTO_POSITION = 1` devem ser definidas para o canal de replicação.

  Quando `GTID_ONLY = 1` está definido, a replica usa `replica_parallel_workers=1` se essa variável de sistema estiver definida como zero para o servidor, portanto, é sempre tecnicamente uma aplicação multi-threaded. Isso ocorre porque uma aplicação multi-threaded usa posições salvas em vez dos repositórios de metadados de replicação para localizar o início de uma transação que precisa ser reaplicada.

  Se você desabilitar `GTID_ONLY` após configurá-lo, os registros do relé existentes serão excluídos e as posições dos arquivos binários conhecidos serão mantidas, mesmo que estejam desatualizados. As posições dos arquivos binários e do log do relé nos repositórios de metadados de replicação podem ser inválidas, e um aviso será retornado se esse for o caso. Desde que `SOURCE_AUTO_POSITION` ainda esteja habilitado, o posicionamento automático do GTID será usado para fornecer o posicionamento correto.

  Se você também desabilitar `SOURCE_AUTO_POSITION`, as posições de arquivo do log binário e do log de retransmissão nos repositórios de metadados de replicação são usadas para posicionamento se forem válidas. Se forem marcadas como inválidas, você deve fornecer um nome e uma posição válidos para o arquivo de log binário (`SOURCE_LOG_FILE` e `SOURCE_LOG_POS`). Se você também fornecer um nome e uma posição de arquivo de log de retransmissão (`RELAY_LOG_FILE` e `RELAY_LOG_POS`), os logs de retransmissão são preservados e a posição do aplicável é definida para a posição declarada. O GTID auto-skip garante que quaisquer transações já aplicadas sejam ignoradas, mesmo que a eventual posição do aplicável não seja correta.

- `IGNORE_SERVER_IDS = (server_id_list)`

  Faz com que a replica ignore eventos originados dos servidores especificados. A opção aceita uma lista separada por vírgula de 0 ou mais IDs de servidor. Eventos de rotação e exclusão de logs dos servidores não são ignorados e são registrados no log do retransmissor.

  Na replicação circular, o servidor de origem normalmente atua como o terminador de seus próprios eventos, para que eles não sejam aplicados mais de uma vez. Assim, essa opção é útil na replicação circular quando um dos servidores no círculo é removido. Suponha que você tenha uma configuração de replicação circular com 4 servidores, com IDs de servidor 1, 2, 3 e 4, e o servidor 3 falha. Ao preencher a lacuna iniciando a replicação do servidor 2 para o servidor 4, você pode incluir `IGNORE_SERVER_IDS = (3)` na declaração `CHANGE REPLICATION SOURCE TO` que você emite no servidor 4 para dizer que ele deve usar o servidor 2 como sua fonte em vez do servidor 3. Isso faz com que ele ignore e não propague quaisquer declarações que tenham origem no servidor que deixou de ser usado.

  Se `IGNORE_SERVER_IDS` contiver o ID do próprio servidor e o servidor foi iniciado com a opção `--replicate-same-server-id` habilitada, um erro será gerado.

  Nota

  Quando os identificadores globais de transações (GTIDs) são usados para a replicação, as transações que já foram aplicadas são ignoradas automaticamente, portanto, a função `IGNORE_SERVER_IDS` não é necessária e está desatualizada. Se o `gtid_mode=ON` for definido para o servidor, um aviso de desatualização será emitido se você incluir a opção `IGNORE_SERVER_IDS` em uma declaração `CHANGE REPLICATION SOURCE TO`.

  O repositório de metadados de origem e a saída do `SHOW REPLICA STATUS` fornecem a lista dos servidores que estão atualmente ignorados. Para mais informações, consulte a Seção 19.2.4.2, “Repositórios de Metadados de Replicação”, e a Seção 15.7.7.35, “Instrução SHOW REPLICA STATUS”.

  Se uma declaração `CHANGE REPLICATION SOURCE TO` for emitida sem qualquer opção `IGNORE_SERVER_IDS`, a lista existente será preservada. Para limpar a lista de servidores ignorados, é necessário usar a opção com uma lista vazia:

  ```
  CHANGE REPLICATION SOURCE TO IGNORE_SERVER_IDS = ();
  ```

  `RESET REPLICA ALL` limpa `IGNORE_SERVER_IDS`.

  Nota

  Um aviso de depreciação é emitido se `SET GTID_MODE=ON` for emitido quando qualquer canal tiver IDs de servidor existentes definidos com `IGNORE_SERVER_IDS`. Antes de iniciar a replicação baseada em GTID, verifique e limpe todas as listas de IDs de servidor ignorados nos servidores envolvidos. A declaração `SHOW REPLICA STATUS` exibe a lista de IDs ignorados, se houver uma. Se você receber o aviso de depreciação, ainda pode limpar uma lista após `gtid_mode=ON` ser definido, emitindo uma declaração `CHANGE REPLICATION SOURCE TO` contendo a opção `IGNORE_SERVER_IDS` com uma lista vazia.

- `NETWORK_NAMESPACE = 'namespace'`

  O espaço de nome de rede a ser usado para conexões TCP/IP ao servidor de origem da replicação ou, se a pilha de comunicação MySQL estiver em uso, para as conexões de comunicação de grupo da Replicação em Grupo. O comprimento máximo do valor da string é de 64 caracteres. Se esta opção for omitida, as conexões da réplica usam o namespace padrão (global). Em plataformas que não implementam suporte para espaço de nome de rede, ocorre falha quando a réplica tenta se conectar à fonte. Para obter informações sobre espaços de nome de rede, consulte a Seção 7.1.14, “Suporte a Espaço de Nome de Rede”. `NETWORK_NAMESPACE` está disponível a partir do MySQL 8.0.22.

- `PRIVILEGE_CHECKS_USER = {NULL | 'account'}`

  Nomeia uma conta de usuário que fornece um contexto de segurança para o canal especificado. `NULL`, que é o padrão, significa que não é usado nenhum contexto de segurança. `PRIVILEGE_CHECKS_USER` está disponível a partir do MySQL 8.0.18.

  O nome de usuário e o nome do host da conta de usuário devem seguir a sintaxe descrita na Seção 8.2.4, “Especificação de Nomes de Conta”, e o usuário não pode ser um usuário anônimo (com um nome de usuário em branco) ou o `CURRENT_USER`. A conta deve ter o privilégio `REPLICATION_APPLIER`, além dos privilégios necessários para executar as transações replicadas no canal. Para obter detalhes dos privilégios necessários para a conta, consulte a Seção 19.3.3, “Verificação de Privilégios de Replicação”. Quando você reiniciar o canal de replicação, as verificações de privilégios são aplicadas a partir desse ponto. Se você não especificar um canal e nenhum outro canal existir, a declaração é aplicada ao canal padrão.

  O uso do registro binário baseado em linhas é fortemente recomendado quando `PRIVILEGE_CHECKS_USER` está definido, e você pode definir `REQUIRE_ROW_FORMAT` para impor isso. Por exemplo, para iniciar verificações de privilégios no canal `channel_1` em uma replica em execução, execute as seguintes declarações:

  ```
  STOP REPLICA FOR CHANNEL 'channel_1';

  CHANGE REPLICATION SOURCE TO
      PRIVILEGE_CHECKS_USER = 'user'@'host',
      REQUIRE_ROW_FORMAT = 1,
      FOR CHANNEL 'channel_1';

  START REPLICA FOR CHANNEL 'channel_1';
  ```

- `RELAY_LOG_FILE = 'relay_log_file'` , `RELAY_LOG_POS = 'relay_log_pos'`

  O nome do arquivo de log de retransmissão e a localização nesse arquivo, onde o fio de SQL de replicação começa a ler o log de retransmissão da réplica na próxima vez que o fio começar. `RELAY_LOG_FILE` pode usar um caminho absoluto ou relativo e usa o mesmo nome de base que `SOURCE_LOG_FILE`. O comprimento máximo do valor da string é de 511 caracteres.

  Uma declaração `CHANGE REPLICATION SOURCE TO` usando `RELAY_LOG_FILE`, `RELAY_LOG_POS` ou ambas as opções pode ser executada em uma replica em execução quando o thread de SQL de replicação (aplicador) é interrompido. Os logs de retransmissão são preservados se pelo menos um dos threads de aplicador de replicação e o thread de I/O de replicação (receptor) estiverem em execução. Se ambos os threads forem interrompidos, todos os arquivos de log de retransmissão serão excluídos, a menos que pelo menos uma das opções `RELAY_LOG_FILE` ou `RELAY_LOG_POS` seja especificada. Para o canal de aplicador de replicação de grupo (`group_replication_applier`), que possui apenas um thread de aplicador e nenhum thread de receptor, este é o caso se o thread de aplicador for interrompido, mas com esse canal você não pode usar as opções `RELAY_LOG_FILE` e `RELAY_LOG_POS`.

- `REQUIRE_ROW_FORMAT = {0|1}`

  Permite que apenas eventos de replicação baseados em linhas sejam processados pelo canal de replicação. Esta opção impede que o aplicativo de replicação tome ações como a criação de tabelas temporárias e a execução de solicitações `LOAD DATA INFILE` (código de erro 0), o que aumenta a segurança do canal. A opção `REQUIRE_ROW_FORMAT` está desabilitada por padrão para canais de replicação assíncrona, mas está habilitada por padrão para canais de replicação em grupo e não pode ser desabilitada para eles. Para obter mais informações, consulte a Seção 19.3.3, “Verificação de privilégios de replicação”. `REQUIRE_ROW_FORMAT` está disponível a partir do MySQL 8.0.19.

- `REQUIRE_TABLE_PRIMARY_KEY_CHECK = {STREAM | ON | OFF | GENERATE}`

  Disponível a partir do MySQL 8.0.20, essa opção permite que um conjunto de réplicas defina sua própria política para verificações de chave primária, conforme descrito a seguir:

  - `ON`: Os conjuntos de réplica `sql_require_primary_key = ON`; qualquer declaração `CREATE TABLE` ou `ALTER TABLE` replicada deve resultar em uma tabela que contenha uma chave primária.

  - `OFF`: Os conjuntos de réplica são definidos em `sql_require_primary_key = OFF`; nenhuma declaração de réplica `CREATE TABLE` ou `ALTER TABLE` é verificada quanto à presença de uma chave primária.

  - `STREAM`: A replica usa o valor de `sql_require_primary_key` da fonte para cada transação. Este é o valor padrão e o comportamento padrão.

  - `GENERATE`: Adicionada no MySQL 8.0.32, isso faz com que a replica gere uma chave primária invisível para qualquer tabela `InnoDB` que, ao ser replicada, não tenha uma chave primária. Consulte a Seção 15.1.20.11, “Chaves Primárias Invisíveis Geradas”, para obter mais informações.

    `GENERATE` não é compatível com a replicação em grupo; você pode usar `ON`, `OFF` ou `STREAM`.

  Uma divergência baseada na presença de uma chave primária invisível gerada apenas em uma tabela de origem ou replica é suportada pelo MySQL Replication, desde que a origem suporte GIPKs (MySQL 8.0.30 e versões posteriores) e a replica use a versão 8.0.32 ou posterior do MySQL. Se você usar GIPKs em uma replica e replicar a partir de uma origem usando o MySQL 8.0.29 ou versões anteriores, você deve estar ciente de que, neste caso, tais divergências no esquema, além do GIPK extra na replica, não são suportadas e podem resultar em erros de replicação.

  Para a replicação de múltiplas fontes, definir `REQUIRE_TABLE_PRIMARY_KEY_CHECK` para `ON` ou `OFF` permite que a replica normalize o comportamento em todos os canais de replicação para diferentes fontes e mantenha um ajuste consistente para `sql_require_primary_key`. O uso de `ON` protege contra a perda acidental de chaves primárias quando múltiplas fontes atualizam o mesmo conjunto de tabelas. O uso de `OFF` permite que fontes que podem manipular chaves primárias trabalhem ao lado de fontes que não podem.

  No caso de múltiplas réplicas, quando `REQUIRE_TABLE_PRIMARY_KEY_CHECK` é definido como `GENERATE`, a chave primária invisível gerada por uma réplica específica é independente de qualquer chave desse tipo adicionada em qualquer outra réplica. Isso significa que, se as chaves primárias invisíveis geradas estiverem em uso, os valores nas colunas da chave primária gerada em diferentes réplicas não serão garantidos como os mesmos. Isso pode ser um problema ao realizar uma falha para essa réplica.

  Quando `PRIVILEGE_CHECKS_USER` é `NULL` (o padrão), a conta de usuário não precisa de privilégios de nível de administração para definir variáveis de sessão restritas. Definir essa opção para um valor diferente de `NULL` significa que, quando `REQUIRE_TABLE_PRIMARY_KEY_CHECK` é `ON`, `OFF` ou `GENERATE`, a conta de usuário não requer privilégios de nível de administração de sessão para definir variáveis de sessão restritas, como `sql_require_primary_key`, evitando a necessidade de conceder tais privilégios à conta. Para mais informações, consulte a Seção 19.3.3, “Verificação de Privilégios de Replicação”.

- `SOURCE_AUTO_POSITION = {0|1}`

  Faz com que a replica tente se conectar à fonte usando a funcionalidade de autoposicionamento da replicação baseada em GTID, em vez de uma posição baseada em um arquivo de log binário. Esta opção é usada para iniciar uma replicação usando a replicação baseada em GTID. O padrão é 0, o que significa que a autoposição de GTID e a replicação baseada em GTID não são usadas. Esta opção só pode ser usada com `CHANGE REPLICATION SOURCE TO` se o thread de SQL de replicação (aplicador) e o thread de I/O de replicação (receptor) estiverem parados.

  Tanto a réplica quanto a fonte devem ter GTIDs habilitados (`GTID_MODE=ON`, `ON_PERMISSIVE,` ou `OFF_PERMISSIVE` na réplica e `GTID_MODE=ON` na fonte). `SOURCE_LOG_FILE`, `SOURCE_LOG_POS`, `RELAY_LOG_FILE` e `RELAY_LOG_POS` não podem ser especificados juntos com `SOURCE_AUTO_POSITION = 1`. Se a replicação de múltiplas fontes estiver habilitada na réplica, você precisa definir a opção `SOURCE_AUTO_POSITION = 1` para cada canal de replicação aplicável.

  Com `SOURCE_AUTO_POSITION = 1` definido, na inicialização da conexão, a replica envia um GTID definido que contém as transações que ela já recebeu, comprometeu ou ambas. A fonte responde enviando todas as transações registradas em seu log binário cujos GTID não estão incluídos no GTID definido enviado pela replica. Essa troca garante que a fonte só envie as transações com um GTID que a replica ainda não tenha registrado ou comprometido. Se a replica receber transações de mais de uma fonte, como no caso de uma topologia em forma de diamante, a função de auto-salto garante que as transações não sejam aplicadas duas vezes. Para detalhes sobre como o GTID definido enviado pela replica é calculado, consulte a Seção 19.1.3.3, “Posicionamento Automático do GTID”.

  Se alguma das transações que deveriam ser enviadas pela fonte tiver sido excluída do log binário da fonte ou adicionada ao conjunto de GTIDs na variável de sistema `gtid_purged` por outro método, a fonte envia o erro `ER_SOURCE_HAS_PURGED_REQUIRED_GTIDS` para a replica, e a replicação não começa. Os GTIDs das transações excluídas são identificados e listados no log de erros da fonte na mensagem de aviso `ER_FOUND_MISSING_GTIDS`. Além disso, se durante a troca de transações for encontrado que a replica registrou ou confirmou transações com o UUID da fonte no GTID, mas a fonte não as confirmou, a fonte envia o erro `ER_REPLICA_HAS_MORE_GTIDS_THAN_SOURCE` para a replica e a replicação não começa. Para obter informações sobre como lidar com essas situações, consulte a Seção 19.1.3.3, “Posicionamento Automático de GTIDs”.

  Você pode verificar se a replicação está sendo executada com o posicionamento automático do GTID habilitado verificando a tabela do Schema de Desempenho `replication_connection_status` ou a saída do `SHOW REPLICA STATUS`. Desabilitando a opção `SOURCE_AUTO_POSITION` novamente, a replica retorna à replicação baseada em arquivos.

- `SOURCE_BIND = 'interface_name'`

  Determina qual das interfaces de rede da réplica será escolhida para se conectar à fonte, para uso em réplicas que possuem múltiplas interfaces de rede. Especifique o endereço IP da interface de rede. O comprimento máximo do valor da string é de 255 caracteres.

  O endereço IP configurado com esta opção, se houver, pode ser visto na coluna `Source_Bind` do resultado do `SHOW REPLICA STATUS`. No repositório de metadados da fonte, na tabela `mysql.slave_master_info`, o valor pode ser visto na coluna `Source_bind`. A capacidade de vincular uma replica a uma interface de rede específica também é suportada pelo NDB Cluster.

- `SOURCE_COMPRESSION_ALGORITHMS = 'algorithm[,algorithm][,algorithm]'`

  Especifica um, dois ou três dos algoritmos de compressão permitidos para conexões ao servidor de origem da replicação, separados por vírgulas. O valor da string máxima é de 99 caracteres. O valor padrão é `uncompressed`.

  Os algoritmos disponíveis são `zlib`, `zstd` e `uncompressed`, os mesmos que para a variável de sistema `protocol_compression_algorithms`. Os algoritmos podem ser especificados em qualquer ordem, mas não há uma ordem de preferência — o processo de negociação de algoritmos tenta usar `zlib`, depois `zstd`, depois `uncompressed`, se forem especificados. `SOURCE_COMPRESSION_ALGORITHMS` está disponível a partir do MySQL 8.0.18.

  O valor de `SOURCE_COMPRESSION_ALGORITHMS` só se aplica se a variável de sistema `replica_compressed_protocol` ou `slave_compressed_protocol` estiver desativada. Se `replica_compressed_protocol` ou `slave_compressed_protocol` estiver ativado, ele tem precedência sobre `SOURCE_COMPRESSION_ALGORITHMS` e as conexões à fonte utilizam a compressão `zlib` se tanto a fonte quanto a replica suportam esse algoritmo. Para mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

  A compressão de transações de log binário (disponível a partir do MySQL 8.0.20), que é ativada pela variável de sistema `binlog_transaction_compression`, também pode ser usada para economizar largura de banda. Se você fizer isso em combinação com a compressão de conexões, a compressão de conexões terá menos oportunidade de agir nos dados, mas ainda poderá comprimir cabeçalhos e aqueles eventos e cargas úteis das transações que não estiverem compactados. Para obter mais informações sobre a compressão de transações de log binário, consulte a Seção 7.4.4.5, “Compressão de Transações de Log Binário”.

- `SOURCE_CONNECT_RETRY = interval`

  Especifica o intervalo em segundos entre as tentativas de reconexão que a réplica faz após a conexão com a fonte expirar. O intervalo padrão é de 60 segundos.

  O número de tentativas é limitado pela opção `SOURCE_RETRY_COUNT`. Se as configurações padrão forem usadas, a replica aguarda 60 segundos entre as tentativas de reconexão (`SOURCE_CONNECT_RETRY=60`), e continua tentando reconectar nessa taxa por 60 dias (`SOURCE_RETRY_COUNT=86400`). Esses valores são registrados no repositório de metadados da fonte e mostrados na tabela do Schema de Desempenho `replication_connection_configuration`.

- `SOURCE_CONNECTION_AUTO_FAILOVER = {0|1}`

  Ativa o mecanismo de falha de conexão assíncrona para um canal de replicação se um ou mais servidores de origem de replicação alternativos estiverem disponíveis (assim, quando houver vários servidores MySQL ou grupos de servidores que compartilham os dados replicados). `SOURCE_CONNECTION_AUTO_FAILOVER` está disponível a partir do MySQL 8.0.22. O padrão é 0, o que significa que o mecanismo não está ativado. Para obter informações completas e instruções para configurar essa funcionalidade, consulte a Seção 19.4.9.2, “Falha de Conexão Assíncrona para Replicas”.

  O mecanismo de falha de conexão assíncrona assume o controle após as tentativas de reconexão controladas por `SOURCE_CONNECT_RETRY` e `SOURCE_RETRY_COUNT` serem esgotadas. Ele reconecta a replica a uma fonte alternativa escolhida de uma lista de fontes especificada, que você gerencia usando as funções `asynchronous_connection_failover_add_source` e `asynchronous_connection_failover_delete_source`. Para adicionar e remover grupos gerenciados de servidores, use as funções `asynchronous_connection_failover_add_managed` e `asynchronous_connection_failover_delete_managed` em vez disso. Para obter mais informações, consulte a Seção 19.4.9, “Alternar fontes e réplicas com falha de conexão assíncrona”.

  Importante

  1. Você só pode definir `SOURCE_CONNECTION_AUTO_FAILOVER = 1` quando o autoposicionamento do GTID estiver em uso (`SOURCE_AUTO_POSITION = 1`).

  2. Quando você definir `SOURCE_CONNECTION_AUTO_FAILOVER = 1`, defina `SOURCE_RETRY_COUNT` e `SOURCE_CONNECT_RETRY` para números mínimos que permitam apenas algumas tentativas de reatribuição com a mesma fonte, caso a falha de conexão seja causada por uma interrupção transitória da rede. Caso contrário, o mecanismo de failover de conexão assíncrona não pode ser ativado prontamente. Valores adequados são `SOURCE_RETRY_COUNT=3` e `SOURCE_CONNECT_RETRY=10`, que fazem a replica reatribuir a conexão 3 vezes com intervalos de 10 segundos entre elas.

  3. Quando você definir `SOURCE_CONNECTION_AUTO_FAILOVER = 1`, os repositórios de metadados de replicação devem conter as credenciais para uma conta de usuário de replicação que possa ser usada para se conectar a todos os servidores na lista de origem para o canal de replicação. A conta também deve ter permissões `SELECT` nas tabelas do Schema de Desempenho. Essas credenciais podem ser definidas usando a instrução `CHANGE REPLICATION SOURCE TO` com as opções `SOURCE_USER` e `SOURCE_PASSWORD`. Para mais informações, consulte a Seção 19.4.9, “Alternar fontes e réplicas com failover de conexão assíncrona”.

  4. A partir do MySQL 8.0.27, ao definir `SOURCE_CONNECTION_AUTO_FAILOVER = 1`, o failover de conexão assíncrona para réplicas é ativado automaticamente se esse canal de replicação estiver em um primário de replicação em grupo em modo de primário único. Com essa função ativa, se o primário que está replicando sair offline ou entrar em um estado de erro, o novo primário começa a replicação no mesmo canal quando é eleito. Se você deseja usar a função, esse canal de replicação também deve ser configurado em todos os servidores secundários do grupo de replicação e em quaisquer novos membros que se juntem (se os servidores forem provisionados usando a funcionalidade de clone do MySQL, isso acontece automaticamente). Se você não deseja usar a função, desative-a usando a função `group_replication_disable_member_action()` para desabilitar a ação do membro de replicação em grupo `mysql_start_failover_channels_if_primary`, que está habilitada por padrão. Para mais informações, consulte a Seção 19.4.9.2, “Failover de Conexão Assíncrona para Réplicas”.

- `SOURCE_DELAY = interval`

  Especifica quantos segundos a réplica deve ficar atrasada em relação à fonte. Um evento recebido da fonte não é executado até que tenha passado pelo menos `interval` segundos após sua execução na fonte. `interval` deve ser um inteiro não negativo no intervalo de 0 a 231−1. O valor padrão é 0. Para mais informações, consulte a Seção 19.4.11, “Replicação Atrasada”.

  Uma declaração `CHANGE REPLICATION SOURCE TO` usando a opção `SOURCE_DELAY` pode ser executada em uma replica em execução quando o thread de SQL de replicação é interrompido.

- `SOURCE_HEARTBEAT_PERIOD = interval`

  Controla o intervalo do batimento cardíaco, o que interrompe o tempo de espera da conexão que ocorre na ausência de dados, se a conexão ainda estiver boa. Um sinal de batimento cardíaco é enviado para a replica após esse número de segundos, e o período de espera é redefinido sempre que o log binário da fonte é atualizado com um evento. Os batimentos cardíacos são, portanto, enviados pela fonte apenas se não houver eventos não enviados no arquivo de log binário por um período maior que este.

  O intervalo de batimentos cardíacos `interval` é um valor decimal com o intervalo de 0 a 4294967 segundos e uma resolução em milissegundos; o menor valor não nulo é 0,001. Definir `interval` para 0 desabilita os batimentos cardíacos completamente. O intervalo de batimentos cardíacos tem como padrão metade do valor da variável de sistema `replica_net_timeout` ou `slave_net_timeout`. Ele é registrado no repositório de metadados de origem e exibido na tabela do esquema de desempenho `replication_connection_configuration`.

  A variável de sistema `replica_net_timeout` (a partir do MySQL 8.0.26) ou `slave_net_timeout` (antes do MySQL 8.0.26) especifica o número de segundos que a replica espera por mais dados ou por um sinal de batida de coração da fonte, antes que a replica considere a conexão interrompida, interrompa a leitura e tente reconectar. O valor padrão é de 60 segundos (um minuto). Observe que uma alteração no valor ou no ajuste padrão de `replica_net_timeout` ou `slave_net_timeout` não altera automaticamente o intervalo de batida de coração, seja ele definido explicitamente ou esteja usando um padrão calculado anteriormente. Um aviso é emitido se você definir o valor global de `replica_net_timeout` ou `slave_net_timeout` para um valor menor que o intervalo atual de batida de coração. Se `replica_net_timeout` ou `slave_net_timeout` for alterado, você também deve emitir `CHANGE REPLICATION SOURCE TO` para ajustar o intervalo de batida de coração para um valor apropriado, para que o sinal de batida de coração ocorra antes do tempo limite da conexão. Se você não fizer isso, o sinal de batida de coração não terá efeito, e se nenhum dado for recebido da fonte, a replica pode fazer tentativas repetidas de reconexão, criando threads de dump de zumbi.

- `SOURCE_HOST = 'host_name'`

  O nome do host ou o endereço IP do servidor de origem da replicação. A réplica usa isso para se conectar à origem. O comprimento máximo do valor da string é de 255 caracteres.

  Se você especificar `SOURCE_HOST` ou `SOURCE_PORT`, a replica assume que o servidor de origem é diferente do anterior (mesmo que o valor da opção seja o mesmo que seu valor atual). Nesse caso, os valores antigos do nome e da posição do arquivo de log binário da origem são considerados não mais aplicáveis, portanto, se você não especificar `SOURCE_LOG_FILE` e `SOURCE_LOG_POS` na declaração, `SOURCE_LOG_FILE=''` e `SOURCE_LOG_POS=4` são anexados silenciosamente a ela.

  Definir `SOURCE_HOST=''` (ou seja, definir explicitamente seu valor para uma string vazia) *não* é a mesma coisa que não definir `SOURCE_HOST` de forma alguma. Tentar definir `SOURCE_HOST` para uma string vazia falha com um erro.

- `SOURCE_LOG_FILE = 'source_log_name'`, `SOURCE_LOG_POS = source_log_pos`

  O nome do arquivo de log binário e a localização nesse arquivo, onde a thread de I/O de replicação (receptor) começa a ler o log binário da fonte na próxima vez que a thread for iniciada. Especifique essas opções se você estiver usando a replicação baseada na posição do arquivo de log binário.

  `SOURCE_LOG_FILE` deve incluir o sufixo numérico de um arquivo de log binário específico disponível no servidor de origem, por exemplo, `SOURCE_LOG_FILE='binlog.000145'`. O comprimento máximo do valor da string é de 511 caracteres.

  `SOURCE_LOG_POS` é a posição numérica para que a replica comece a ler nesse arquivo. `SOURCE_LOG_POS=4` representa o início dos eventos em um arquivo de log binário.

  Se você especificar qualquer um dos `SOURCE_LOG_FILE` ou `SOURCE_LOG_POS`, não poderá especificar `SOURCE_AUTO_POSITION = 1`, que é para replicação baseada em GTID.

  Se nenhum dos `SOURCE_LOG_FILE` ou `SOURCE_LOG_POS` for especificado, a replica usa as últimas coordenadas do *thread SQL de replicação* antes que `CHANGE REPLICATION SOURCE TO` fosse emitido. Isso garante que não haja nenhuma interrupção na replicação, mesmo que o thread SQL de aplicação (aplicador) de replicação tenha chegado atrasado em comparação com o thread de I/O de replicação (receptor).

- `SOURCE_PASSWORD = 'password'`

  A senha da conta de usuário de replicação a ser usada para se conectar ao servidor de origem de replicação. O comprimento máximo do valor da string é de 32 caracteres. Se você especificar `SOURCE_PASSWORD`, `SOURCE_USER` também é necessário.

  A senha usada para uma conta de usuário de replicação em uma declaração `CHANGE REPLICATION SOURCE TO` é limitada a 32 caracteres de comprimento. Tentar usar uma senha com mais de 32 caracteres faz com que o `CHANGE REPLICATION SOURCE TO` falhe.

  A senha é mascarada nos logs do MySQL Server, nas tabelas do Schema de Desempenho e nas instruções `SHOW PROCESSLIST`.

- `SOURCE_PORT = port_num`

  O número da porta TCP/IP que a réplica usa para se conectar ao servidor de origem da replicação.

  Nota

  A replicação não pode usar arquivos de socket Unix. Você deve ser capaz de se conectar ao servidor de origem da replicação usando TCP/IP.

  Se você especificar `SOURCE_HOST` ou `SOURCE_PORT`, a replica assume que o servidor de origem é diferente do anterior (mesmo que o valor da opção seja o mesmo que seu valor atual). Nesse caso, os valores antigos do nome e da posição do arquivo de log binário da origem são considerados não mais aplicáveis, portanto, se você não especificar `SOURCE_LOG_FILE` e `SOURCE_LOG_POS` na declaração, `SOURCE_LOG_FILE=''` e `SOURCE_LOG_POS=4` são anexados silenciosamente a ela.

- `SOURCE_PUBLIC_KEY_PATH = 'key_file_name'`

  Habilita a troca de senha baseada em par de chaves RSA fornecendo o nome do caminho para um arquivo que contém uma cópia do lado do replicador da chave pública necessária pela fonte. O arquivo deve estar no formato PEM. O valor da string máxima é de 511 caracteres.

  Esta opção se aplica a réplicas que se autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. (Para `sha256_password`, `SOURCE_PUBLIC_KEY_PATH` pode ser usado apenas se o MySQL foi construído usando o OpenSSL.) Se você estiver usando uma conta de usuário de replicação que se autentica com o plugin `caching_sha2_password` (que é o padrão a partir do MySQL 8.0), e você não estiver usando uma conexão segura, você deve especificar essa opção ou a opção `GET_SOURCE_PUBLIC_KEY=1` para fornecer a chave pública RSA à réplica.

- `SOURCE_RETRY_COUNT = count`

  Define o número máximo de tentativas de reconexão que a réplica faz após o tempo de conexão com a fonte expirar, conforme determinado pela variável de sistema `replica_net_timeout` ou `slave_net_timeout`. Se a réplica precisar se reconectar, a primeira tentativa de reconexão ocorre imediatamente após o tempo de expiração. O valor padrão é de 86400 tentativas.

  O intervalo entre as tentativas é especificado pela opção `SOURCE_CONNECT_RETRY`. Se as configurações padrão forem usadas, a replica aguarda 60 segundos entre as tentativas de reconexão (`SOURCE_CONNECT_RETRY=60`), e continua tentando reconectar nessa taxa por 60 dias (`SOURCE_RETRY_COUNT=86400`). Um valor de 0 para `SOURCE_RETRY_COUNT` significa que não há limite no número de tentativas de reconexão, então a replica continua tentando reconectar indefinidamente.

  Os valores para `SOURCE_CONNECT_RETRY` e `SOURCE_RETRY_COUNT` são registrados no repositório de metadados da fonte e mostrados na tabela do Schema de Desempenho `replication_connection_configuration`. `SOURCE_RETRY_COUNT` substitui a opção de inicialização do servidor `--master-retry-count`.

- `SOURCE_SSL = {0|1}`

  Especifique se a replica criptografa a conexão de replicação. O padrão é 0, o que significa que a replica não criptografa a conexão de replicação. Se você definir `SOURCE_SSL=1`, você pode configurar a criptografia usando as opções `SOURCE_SSL_xxx` e `SOURCE_TLS_xxx`.

  Definir `SOURCE_SSL=1` para uma conexão de replicação e, em seguida, definir mais opções `SOURCE_SSL_xxx` não corresponde a definir `--ssl-mode=REQUIRED` para o cliente, conforme descrito nas Opções de comando para conexões criptografadas. Com `SOURCE_SSL=1`, a tentativa de conexão só tem sucesso se uma conexão criptografada puder ser estabelecida. Uma conexão de replicação não retorna para uma conexão não criptografada, portanto, não há configuração correspondente à configuração `--ssl-mode=PREFERRED` para replicação. Se `SOURCE_SSL=0` for definida, isso corresponde a `--ssl-mode=DISABLED`.

  Importante

  Para ajudar a prevenir ataques sofisticados de homem no meio (man-in-the-middle), é importante que a replica verifique a identidade do servidor. Você pode especificar opções adicionais de `SOURCE_SSL_xxx` para corresponder aos ajustes `--ssl-mode=VERIFY_CA` e `--ssl-mode=VERIFY_IDENTITY`, que são uma escolha melhor do que o ajuste padrão para ajudar a prevenir esse tipo de ataque. Com esses ajustes, a replica verifica se o certificado do servidor é válido e se o nome do host que a replica está usando corresponde à identidade no certificado do servidor. Para implementar um desses níveis de verificação, você deve primeiro garantir que o certificado da CA do servidor esteja disponível de forma confiável para a replica, caso contrário, problemas de disponibilidade ocorrerão. Por essa razão, eles não são o ajuste padrão.

- `SOURCE_SSL_xxx`, `SOURCE_TLS_xxx`

  Especifique como a replica usa criptografia e cifra para proteger a conexão de replicação. Essas opções podem ser alteradas mesmo em réplicas compiladas sem suporte SSL. Elas são salvas no repositório de metadados da fonte, mas são ignoradas se a replica não tiver o suporte SSL habilitado. O comprimento máximo do valor das opções `SOURCE_SSL_xxx` e `SOURCE_TLS_xxx` com valor de string é de 511 caracteres, com exceção de `SOURCE_TLS_CIPHERSUITES`, para o qual é de 4000 caracteres.

  As opções `SOURCE_SSL_xxx` e `SOURCE_TLS_xxx` desempenham as mesmas funções que as opções de cliente `--ssl-xxx` e `--tls-xxx`, descritas nas Opções de Comando para Conexões Encriptadas. A correspondência entre os dois conjuntos de opções e o uso das opções `SOURCE_SSL_xxx` e `SOURCE_TLS_xxx` para configurar uma conexão segura são explicados na Seção 19.3.1, “Configurando a Replicação para Usar Conexões Encriptadas”.

- `SOURCE_USER = 'user_name'`

  O nome de usuário para a conta de usuário de replicação a ser usada para se conectar ao servidor de origem de replicação. O valor da string tem um comprimento máximo de 96 caracteres.

  Para a Replicação em Grupo, essa conta deve existir em todos os membros do grupo de replicação. Ela é usada para a recuperação distribuída se a pilha de comunicação XCom estiver em uso para o grupo e também é usada para conexões de comunicação de grupo se a pilha de comunicação MySQL estiver em uso para o grupo. Com a pilha de comunicação MySQL, a conta deve ter a permissão `GROUP_REPLICATION_STREAM`.

  É possível definir um nome de usuário vazio especificando `SOURCE_USER=''`, mas o canal de replicação não pode ser iniciado com um nome de usuário vazio. Em versões anteriores ao MySQL 8.0.21, defina apenas um nome de usuário vazio `SOURCE_USER` se precisar limpar credenciais previamente usadas dos repositórios de metadados de replicação por motivos de segurança. Não use o canal depois disso, devido a um bug nessas versões que pode substituir um nome de usuário padrão se um nome de usuário vazio for lido dos repositórios (por exemplo, durante um reinício automático de um canal de replicação de grupo). A partir do MySQL 8.0.21, é válido definir um nome de usuário vazio `SOURCE_USER` e usar o canal depois disso se você sempre fornecer credenciais de usuário usando a instrução `START REPLICA` ou `START GROUP_REPLICATION` que inicia o canal de replicação. Essa abordagem significa que o canal de replicação sempre precisa de intervenção do operador para ser reiniciado, mas as credenciais do usuário não são registradas nos repositórios de metadados de replicação.

  Importante

  Para se conectar à fonte usando uma conta de usuário de replicação que autentica com o plugin `caching_sha2_password`, você deve configurar uma conexão segura conforme descrito na Seção 19.3.1, “Configurando a Replicação para Usar Conexões Encriptadas”, ou habilitar a conexão não encriptada para suportar a troca de senhas usando um par de chaves RSA. O plugin de autenticação `caching_sha2_password` é o padrão para novos usuários criados a partir do MySQL 8.0 (veja a Seção 8.4.1.2, “Cacheamento de Autenticação Encripável SHA-2”). Se a conta de usuário que você criar ou usar para replicação usar este plugin de autenticação e você não estiver usando uma conexão segura, você deve habilitar a troca de senhas baseada em par de chaves RSA para uma conexão bem-sucedida. Você pode fazer isso usando a opção `SOURCE_PUBLIC_KEY_PATH` ou a opção `GET_SOURCE_PUBLIC_KEY=1` para esta declaração.

- `SOURCE_ZSTD_COMPRESSION_LEVEL = level`

  O nível de compressão a ser usado para conexões ao servidor de origem da replicação que utilizam o algoritmo de compressão `zstd`. `SOURCE_ZSTD_COMPRESSION_LEVEL` está disponível a partir do MySQL 8.0.18. Os níveis permitidos variam de 1 a 22, com valores maiores indicando níveis de compressão crescentes. O nível padrão é 3.

  O ajuste do nível de compressão não afeta as conexões que não utilizam a compressão `zstd`. Para mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

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

Para que o procedimento de alternar uma replica existente para uma nova fonte durante o failover, consulte a Seção 19.4.8, “Alternar fontes durante o failover”.

Quando os GTIDs estão em uso na fonte e na replica, especifique o posicionamento automático do GTID em vez de fornecer a posição do arquivo de log binário, como no exemplo a seguir. Para obter instruções completas sobre como configurar e iniciar a replicação baseada em GTIDs em servidores novos ou parados, servidores online ou réplicas adicionais, consulte a Seção 19.1.3, “Replicação com Identificadores Globais de Transação”.

```
CHANGE REPLICATION SOURCE TO
  SOURCE_HOST='source3.example.com',
  SOURCE_USER='replication',
  SOURCE_PASSWORD='password',
  SOURCE_PORT=3306,
  SOURCE_AUTO_POSITION = 1,
  FOR CHANNEL "source_3";
```

Neste exemplo, a replicação de múltiplas fontes está em uso, e a instrução `CHANGE REPLICATION SOURCE TO` é aplicada ao canal de replicação `"source_3"` que conecta a replica ao host especificado. Para obter orientações sobre a configuração da replicação de múltiplas fontes, consulte a Seção 19.1.5, “Replicação de Múltiplas Fontes do MySQL”.

O próximo exemplo mostra como fazer com que a replica aplique transações de arquivos de log de retransmissão que você deseja repetir. Para isso, a fonte não precisa ser acessível. Você pode usar `CHANGE REPLICATION SOURCE TO` para localizar a posição do log de retransmissão onde você deseja que a replica comece a reaplicar as transações e, em seguida, iniciar o thread SQL:

```
CHANGE REPLICATION SOURCE TO
  RELAY_LOG_FILE='replica-relay-bin.006',
  RELAY_LOG_POS=4025;
START REPLICA SQL_THREAD;
```

`CHANGE REPLICATION SOURCE TO` também pode ser usado para pular transações no log binário que estão causando a interrupção da replicação. O método apropriado para fazer isso depende se os GTIDs estão em uso ou não. Para obter instruções sobre como pular transações usando `CHANGE REPLICATION SOURCE TO` ou outro método, consulte a Seção 19.1.7.3, “Pular Transações”.
