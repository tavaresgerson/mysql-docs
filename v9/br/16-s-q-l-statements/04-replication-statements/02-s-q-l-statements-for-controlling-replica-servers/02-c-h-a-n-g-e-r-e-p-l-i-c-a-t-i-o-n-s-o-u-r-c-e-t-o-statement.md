#### 15.4.2.2 ALTERAR A FONTE DE REPLICAÇÃO PARA `Statement`

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

`ALTERAR A FONTE DE REPLICAÇÃO PARA` altera os parâmetros que o servidor de replicação usa para se conectar à fonte e ler dados da fonte. Também atualiza o conteúdo dos repositórios de metadados de replicação (consulte a Seção 19.2.4, “Repositórios de Log de Relay e Metadados de Replicação”).

`ALTERAR A FONTE DE REPLICAÇÃO PARA` requer o privilégio `REPLICATION_SLAVE_ADMIN` (ou o privilégio desatualizado `SUPER`).

As opções que você não especificar em uma declaração `ALTERAR A FONTE DE REPLICAÇÃO PARA` retêm seu valor, exceto conforme indicado na discussão a seguir. Portanto, na maioria dos casos, não é necessário especificar opções que não mudam.

Os valores usados para `SOURCE_HOST` e outras opções de `ALTERAR A FONTE DE REPLICAÇÃO PARA` são verificados quanto a caracteres de retorno de linha (`\n` ou `0x0A`). A presença desses caracteres nesses valores faz com que a declaração falhe com um erro.

A cláusula opcional `FOR CHANNEL channel` permite que você nomeie qual canal de replicação a declaração se aplica. Fornecer uma cláusula `FOR CHANNEL channel` aplica a declaração `ALTERAR A FONTE DE REPLICAÇÃO PARA` a um canal de replicação específico e é usado para adicionar um novo canal ou modificar um canal existente. Por exemplo, para adicionar um novo canal chamado `channel2`:

```
CHANGE REPLICATION SOURCE TO SOURCE_HOST=host1, SOURCE_PORT=3002 FOR CHANNEL 'channel2';
```

Se nenhuma cláusula for nomeada e não houver canais extras, uma declaração `ALTERAR A FONTE DE REPLICAÇÃO PARA` se aplica ao canal padrão, cujo nome é a string vazia (""). Quando você configurou vários canais de replicação, cada declaração `ALTERAR A FONTE DE REPLICAÇÃO PARA` deve nomear um canal usando a cláusula `FOR CHANNEL channel`. Consulte a Seção 19.2.2, “Canais de Replicação” para mais informações.

Para algumas das opções da declaração `ALTERAR FONTE DE REPLICA PARA`, você deve emitir uma declaração `STOP REPLICA` antes de emitir uma declaração `ALTERAR FONTE DE REPLICA PARA` (e uma declaração `START REPLICA` depois). Às vezes, você só precisa parar o fio de SQL do aplicável de replicação (aplicador) ou o fio de E/S de replicação (receptor), e não ambos:

* Quando o fio do aplicável é parado, você pode executar `ALTERAR FONTE DE REPLICA PARA` usando qualquer combinação que seja permitida de `RELAY_LOG_FILE`, `RELAY_LOG_POS` e `SOURCE_DELAY` opções, mesmo que o fio de I/O do receptor de replicação esteja em execução. Nenhuma outra opção pode ser usada com essa declaração quando o fio do receptor estiver em execução.

* Quando o fio do receptor é parado, você pode executar `ALTERAR FONTE DE REPLICA PARA` usando qualquer uma das opções para essa declaração (em qualquer combinação permitida) *exceto* `RELAY_LOG_FILE`, `RELAY_LOG_POS`, `SOURCE_DELAY` ou `SOURCE_AUTO_POSITION = 1`, mesmo quando o fio do aplicável estiver em execução.

* Tanto o fio do receptor quanto o fio do aplicável devem ser parados antes de emitir uma declaração `ALTERAR FONTE DE REPLICA PARA` que emprega `SOURCE_AUTO_POSITION = 1`, `GTID_ONLY = 1` ou `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS`.

Você pode verificar o estado atual do fio do aplicável de replicação e do fio do receptor de replicação usando `SHOW REPLICA STATUS`. Note que o canal de aplicável de replicação de grupo (`group_replication_applier`) não tem um fio do receptor, apenas um fio do aplicável.

As declarações `ALTERAR FONTE DE REPLICA PARA` têm vários efeitos colaterais e interações que você deve estar ciente de antemão:

* `ALTERAR FONTE DE REPLICA PARA` causa um commit implícito de uma transação em andamento. Veja a Seção 15.3.3, “Declarações que Causam um Commit Implícito”.

* `ALTERAR A FONTE DE REPLICA PARA` faz com que os valores anteriores para `SOURCE_HOST`, `SOURCE_PORT`, `SOURCE_LOG_FILE` e `SOURCE_LOG_POS` sejam escritos no log de erro, juntamente com outras informações sobre o estado da replica antes da execução.

* Se você estiver usando replicação baseada em instruções e tabelas temporárias, é possível que uma instrução `ALTERAR A FONTE DE REPLICA PARA` após uma instrução `STOP REPLICA` deixe tabelas temporárias na replica. Um aviso (`ER_WARN_OPEN_TEMP_TABLES_MUST_BE_ZERO`) é emitido sempre que isso ocorre. Você pode evitar isso nesses casos, garantindo que o valor da variável de status do sistema `Replica_open_temp_tables` seja igual a 0 antes de executar uma instrução `ALTERAR A FONTE DE REPLICA PARA` desse tipo.

* Parar a replica pode causar lacunas na sequência de transações que foram executadas a partir do log de retransmissão, independentemente de a replica ter sido parada intencionalmente ou de outra forma. No MySQL 9.5, essas lacunas podem ser resolvidas usando o autoposicionamento do GTID.

As seguintes opções estão disponíveis para as instruções `ALTERAR A FONTE DE REPLICA PARA`:

* `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS = {OFF | LOCAL | uuid}`

  Faz com que o canal de replicação atribua um GTID às transações replicadas que não possuem um, permitindo a replicação de uma fonte que não usa replicação baseada em GTID para uma replica que a usa. Para uma replica de múltiplas fontes, você pode ter uma mistura de canais que usam `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` e canais que não o fazem. O padrão é `OFF`, o que significa que o recurso não é usado.

`LOCAL` atribui um GTID que inclui o próprio UUID da réplica (a configuração `server_uuid`). `uuid` atribui um GTID que inclui o UUID especificado, como a configuração `server_uuid` do servidor de origem da replicação. O uso de um UUID não local permite diferenciar as transações que se originaram na réplica daqueles que se originaram na fonte, e, para uma réplica de múltiplas fontes, entre as transações que se originaram em diferentes fontes. O UUID que você escolher tem significado apenas para o uso exclusivo da réplica. Se alguma das transações enviadas pela fonte já tiver um GTID, esse GTID será mantido.

Os canais específicos para a Replicação em Grupo não podem usar `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS`, mas um canal de replicação assíncrona para outra fonte em uma instância do servidor que é membro do grupo de Replicação em Grupo pode fazê-lo. Nesse caso, não especifique o nome do grupo de Replicação em Grupo como o UUID para a criação dos GTIDs.

Para definir `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` para `LOCAL` ou `uuid`, a réplica deve ter `gtid_mode=ON` definido e isso não pode ser alterado posteriormente. Esta opção é para uso com uma fonte que tem replicação com base na posição do arquivo de log binário, então `SOURCE_AUTO_POSITION=1` não pode ser definido para o canal. Tanto o fio de SQL de replicação quanto o fio de I/O de replicação (receptor) devem ser interrompidos antes de definir esta opção.

Importante

Um conjunto de réplicas configurado com `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` em qualquer canal não pode ser promovido para substituir o servidor de origem da replicação no caso de ser necessário um failover, e um backup feito da réplica não pode ser usado para restaurar o servidor de origem da replicação. A mesma restrição se aplica à substituição ou restauração de outras réplicas que usam `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` em qualquer canal.

Para obter mais restrições e informações, consulte a Seção 19.1.3.6, “Replicação a partir de uma fonte sem GTIDs para uma réplica com GTIDs”.

* `GET_SOURCE_PUBLIC_KEY = {0|1}`

  Habilita a troca de senha baseada em par de chaves RSA solicitando a chave pública da fonte. A opção está desabilitada por padrão.

  Esta opção aplica-se a réplicas que autenticam-se com o plugin de autenticação `caching_sha2_password`. Para conexões por contas que autenticam-se usando este plugin, a fonte não envia a chave pública a menos que seja solicitada, portanto, ela deve ser solicitada ou especificada no cliente. Se `SOURCE_PUBLIC_KEY_PATH` for fornecido e especificar um arquivo de chave pública válido, ele tem precedência sobre `GET_SOURCE_PUBLIC_KEY`. Se você estiver usando uma conta de usuário de replicação que autentica-se com o plugin `caching_sha2_password` (o padrão) e não estiver usando uma conexão segura, você deve especificar esta opção ou a opção `SOURCE_PUBLIC_KEY_PATH` para fornecer a chave pública RSA à réplica.

* `GTID_ONLY = {0|1}`

  Parapaga o persistência de nomes de arquivos e posições de arquivos no canal de replicação nos repositórios de metadados de replicação. `GTID_ONLY` está desabilitada por padrão para canais de replicação assíncronos, mas está habilitada por padrão para canais de replicação de grupo, para os quais não pode ser desabilitada.

Para canais de replicação com essa configuração, as posições de arquivo na memória ainda são rastreadas, e as posições de arquivo ainda podem ser observadas para fins de depuração em mensagens de erro e por meio de interfaces como as declarações `SHOW REPLICA STATUS` (onde são mostradas como inválidas se estiverem desatualizadas). No entanto, as escritas e leituras necessárias para persistir e verificar as posições de arquivo são evitadas em situações em que a replicação baseada em GTID não as exija realmente, incluindo a fila de transações e o processo do aplicativo.

Esta opção só pode ser usada se o thread de SQL de replicação (aplicador) e o thread de I/O de replicação (receptor) estiverem parados. Para definir `GTID_ONLY = 1` para um canal de replicação, os GTIDs devem estar em uso no servidor (`gtid_mode = ON`), e o registro binário baseado em linhas deve estar em uso na fonte (a replicação baseada em declarações não é suportada). As opções `REQUIRE_ROW_FORMAT = 1` e `SOURCE_AUTO_POSITION = 1` devem ser definidas para o canal de replicação.

Quando `GTID_ONLY = 1` é definido, a replica usa `replica_parallel_workers=1` se essa variável de sistema estiver definida como zero para o servidor, portanto, é sempre tecnicamente um aplicador multisserial. Isso ocorre porque um aplicador multisserial usa posições salvas em vez dos repositórios de metadados de replicação para localizar o início de uma transação que ele precisa reaplicar.

Se você desabilitar `GTID_ONLY` após defini-lo, os logs de relevo existentes são excluídos e as posições de arquivo do log binário conhecido existente são persistidas, mesmo que estejam desatualizadas. As posições de arquivo do log binário e do log de relevo nos repositórios de metadados de replicação podem ser inválidas, e um aviso é retornado se esse for o caso. Desde que `SOURCE_AUTO_POSITION` ainda esteja habilitado, o autoposicionamento de GTID é usado para fornecer a posição correta.

Se você também desabilitar `SOURCE_AUTO_POSITION`, as posições dos arquivos do log binário e do log de retransmissão nos repositórios de metadados de replicação são usadas para posicionamento se forem válidas. Se forem marcadas como inválidas, você deve fornecer um nome e uma posição válidos do arquivo de log binário (`SOURCE_LOG_FILE` e `SOURCE_LOG_POS`). Se você também fornecer um nome e uma posição de arquivo de log de retransmissão (`RELAY_LOG_FILE` e `RELAY_LOG_POS`), os logs de retransmissão são preservados e a posição do aplicável é definida para a posição declarada. O GTID auto-skip garante que quaisquer transações já aplicadas sejam ignoradas, mesmo que a eventual posição do aplicável não seja correta.

* `IGNORE_SERVER_IDS = (server_id_list)`

  Faz com que a replica ignore eventos originados dos servidores especificados. A opção aceita uma lista de IDs de servidor separados por vírgula de 0 ou mais IDs de servidor. Eventos de rotação e exclusão de logs dos servidores não são ignorados e são registrados no log de retransmissão.

  Na replicação circular, o servidor de origem normalmente atua como o terminal de seus próprios eventos, para que não sejam aplicados mais de uma vez. Assim, essa opção é útil na replicação circular quando um dos servidores no círculo é removido. Suponha que você tenha uma configuração de replicação circular com 4 servidores, tendo IDs de servidor 1, 2, 3 e 4, e o servidor 3 falha. Ao preencher a lacuna iniciando a replicação do servidor 2 para o servidor 4, você pode incluir `IGNORE_SERVER_IDS = (3)` na declaração `CHANGE REPLICATION SOURCE TO` que você emite no servidor 4 para dizer que ele deve usar o servidor 2 como sua fonte em vez do servidor 3. Isso faz com que ele ignore e não propague quaisquer declarações que tenham origem no servidor que deixou de ser usado.

Se `IGNORE_SERVER_IDS` contém o ID do próprio servidor e o servidor foi iniciado com a opção `--replicate-same-server-id` habilitada, um erro ocorre.

O repositório de metadados de replicação e a saída do comando `SHOW REPLICA STATUS` fornecem a lista dos servidores que estão atualmente ignorados. Para obter mais informações, consulte a Seção 19.2.4.2, “Repositórios de Metadados de Replicação”, e a Seção 15.7.7.36, “Instrução SHOW REPLICA STATUS”.

Se uma instrução `CHANGE REPLICATION SOURCE TO` for emitida sem `IGNORE_SERVER_IDS`, qualquer lista existente será preservada. Para limpar a lista de servidores ignorados, é necessário usar a opção com uma lista vazia, como este:

```
  CHANGE REPLICATION SOURCE TO IGNORE_SERVER_IDS = ();
  ```

`RESET REPLICA ALL` também limpa `IGNORE_SERVER_IDS`.

Quando identificadores de transações globais (GTIDs) são usados para replicação, as transações que já foram aplicadas são automaticamente ignoradas. Por isso, `IGNORE_SERVER_IDS` não é compatível com `gtid_mode=ON`. Se `gtid_mode` estiver em `ON`, a instrução `CHANGE REPLICATION SOURCE TO` com uma lista não vazia de `IGNORE_SERVER_IDS` é rejeitada com um erro. Da mesma forma, se qualquer canal de replicação existente foi criado com uma lista de IDs de servidor a serem ignorados, a instrução `SET gtid_mode=ON` também é rejeitada. Antes de iniciar a replicação baseada em GTIDs, verifique e limpe quaisquer listas de IDs de servidor ignorados nos servidores envolvidos; você pode fazer isso verificando a saída do `SHOW REPLICA STATUS`. Nesses casos, você pode limpar a lista emitindo `CHANGE REPLICATION SOURCE TO` com uma lista vazia de IDs de servidor, como mostrado anteriormente.

* `NETWORK_NAMESPACE = 'namespace'`

O namespace de rede a ser usado para conexões TCP/IP com o servidor de origem da replicação ou, se a pilha de comunicação MySQL estiver em uso, para as conexões de comunicação de grupo da Replicação em Grupo. O comprimento máximo do valor da string é de 64 caracteres. Se esta opção for omitida, as conexões da réplica usarão o namespace padrão (global). Em plataformas que não implementam suporte a namespaces de rede, ocorrerá falha quando a réplica tentar se conectar à fonte. Para obter informações sobre namespaces de rede, consulte a Seção 7.1.14, “Suporte a Namespace de Rede”.

* `PRIVILEGE_CHECKS_USER = {NULL | 'account'}`

  Nomeia uma conta de usuário que fornece um contexto de segurança para o canal especificado. `NULL`, que é o padrão, significa que não é usado nenhum contexto de segurança.

  O nome do usuário e o nome do host da conta de usuário devem seguir a sintaxe descrita na Seção 8.2.4, “Especificação de Nomes de Conta” e o usuário não deve ser um usuário anônimo (com um nome de usuário em branco) ou o `CURRENT_USER`. A conta deve ter o privilégio `REPLICATION_APPLIER`, além dos privilégios necessários para executar as transações replicadas no canal. Para obter detalhes dos privilégios necessários pela conta, consulte a Seção 19.3.3, “Verificação de Privilégios de Replicação”. Quando você reiniciar o canal de replicação, as verificações de privilégios são aplicadas a partir desse ponto. Se você não especificar um canal e não houver outros canais, a declaração é aplicada ao canal padrão.

  O uso do registro binário baseado em linhas é altamente recomendado quando `PRIVILEGE_CHECKS_USER` é definido e você pode definir `REQUIRE_ROW_FORMAT` para impor isso. Por exemplo, para iniciar as verificações de privilégios no canal `channel_1` em uma réplica em execução, execute as seguintes declarações:

  ```
  STOP REPLICA FOR CHANNEL 'channel_1';

  CHANGE REPLICATION SOURCE TO
      PRIVILEGE_CHECKS_USER = 'user'@'host',
      REQUIRE_ROW_FORMAT = 1,
      FOR CHANNEL 'channel_1';

  START REPLICA FOR CHANNEL 'channel_1';
  ```

* `RELAY_LOG_FILE = 'relay_log_file'` , `RELAY_LOG_POS = 'relay_log_pos'`

  O nome do arquivo de log do retransmissor e a localização nesse arquivo, onde o thread de SQL de replicação começa a ler o log do retransmissor da replica na próxima vez que o thread começar. `RELAY_LOG_FILE` pode usar um caminho absoluto ou relativo e usa o mesmo nome de base que `SOURCE_LOG_FILE`. O comprimento máximo do valor da string é de 511 caracteres.

  Uma declaração `ALTERAR REPLICAÇÃO DE FONTE PARA` usando `RELAY_LOG_FILE`, `RELAY_LOG_POS` ou ambas as opções pode ser executada em uma replica em execução quando o thread de SQL de replicação (aplicável) é parado. Os logs do retransmissor são preservados se pelo menos um dos threads de aplicável de replicação e o thread de I/O de replicação (receptor) estiverem em execução. Se ambos os threads forem parados, todos os arquivos de log do retransmissor serão excluídos, a menos que pelo menos um de `RELAY_LOG_FILE` ou `RELAY_LOG_POS` seja especificado. Para o canal de aplicável de replicação de grupo (`group_replication_applier`), que tem apenas um thread de aplicável e nenhum thread de receptor, esse é o caso se o thread de aplicável for parado, mas com esse canal você não pode usar as opções `RELAY_LOG_FILE` e `RELAY_LOG_POS`.

* `REQUIRE_ROW_FORMAT = {0|1}`

  Permite que apenas eventos de replicação baseados em linhas sejam processados pelo canal de replicação. Esta opção impede que o aplicável de replicação tome ações como criar tabelas temporárias e executar solicitações `LOAD DATA INFILE`, o que aumenta a segurança do canal. A opção `REQUIRE_ROW_FORMAT` é desabilitada por padrão para canais de replicação assíncronos, mas é habilitada por padrão para canais de replicação de grupo e não pode ser desabilitada para eles. Para mais informações, consulte a Seção 19.3.3, “Verificação de privilégios de replicação”.

* `REQUIRE_TABLE_PRIMARY_KEY_CHECK = {STREAM | ON | OFF | GENERATE}`

Esta opção permite que um conjunto de réplicas defina sua própria política para verificações de chave primária, da seguinte forma:

+ `ON`: A réplica define `sql_require_primary_key = ON`; qualquer declaração `CREATE TABLE` ou `ALTER TABLE` replicada deve resultar em uma tabela que contenha uma chave primária.

+ `OFF`: A réplica define `sql_require_primary_key = OFF`; nenhuma declaração `CREATE TABLE` ou `ALTER TABLE` replicada é verificada quanto à presença de uma chave primária.

+ `STREAM`: A réplica usa o valor de `sql_require_primary_key` replicado da fonte para cada transação. Este é o valor padrão e o comportamento padrão.

+ `GENERATE`: Faz com que a réplica gere uma chave primária invisível para qualquer tabela `InnoDB` que, ao ser replicada, não tenha uma chave primária. Consulte a Seção 15.1.24.11, “Chaves Primárias Invisíveis Geradas”, para obter mais informações.

`GENERATE` não é compatível com a Replicação por Grupo; você pode usar `ON`, `OFF` ou `STREAM`.

Uma divergência baseada na presença de uma chave primária invisível gerada apenas em uma tabela da fonte ou da réplica é suportada pela Replicação MySQL desde que a fonte suporte GIPKs e a réplica use a versão 8.0.32 ou posterior do MySQL. Se você usar GIPKs em uma réplica com a fonte usando uma versão anterior do MySQL, tais divergências no esquema, além da chave primária extra na réplica, não são suportadas e podem resultar em erros de replicação.

Para a replicação de múltiplas fontes, definir `REQUIRE_TABLE_PRIMARY_KEY_CHECK` para `ON` ou `OFF` permite que a replica normalize o comportamento em todos os canais de replicação para diferentes fontes e mantenha um ajuste consistente para `sql_require_primary_key`. Usar `ON` protege contra a perda acidental de chaves primárias quando múltiplas fontes atualizam o mesmo conjunto de tabelas. Usar `OFF` permite que fontes que podem manipular chaves primárias trabalhem ao lado de fontes que não podem.

No caso de múltiplas réplicas, quando `REQUIRE_TABLE_PRIMARY_KEY_CHECK` é definido como `GENERATE`, a chave primária invisível gerada por uma replica específica é independente de qualquer chave adicionada em qualquer outra replica. Isso significa que, se chaves primárias invisíveis geradas estiverem em uso, os valores nas colunas da chave primária gerada em diferentes réplicas não são garantidos como os mesmos. Isso pode ser um problema ao fazer uma falha para uma dessas réplicas.

Quando `PRIVILEGE_CHECKS_USER` é `NULL` (o padrão), a conta de usuário não precisa de privilégios de nível de administração para definir variáveis de sessão restritas. Definir essa opção para um valor diferente de `NULL` significa que, quando `REQUIRE_TABLE_PRIMARY_KEY_CHECK` é `ON`, `OFF` ou `GENERATE`, a conta de usuário não requer privilégios de nível de administração de sessão para definir variáveis de sessão restritas, como `sql_require_primary_key`, evitando a necessidade de conceder tais privilégios à conta. Para mais informações, consulte a Seção 19.3.3, “Verificação de privilégios de replicação”.

* `SOURCE_AUTO_POSITION = {0|1}`

Faz com que a replica tente se conectar à fonte usando a funcionalidade de autoposicionamento da replicação baseada em GTID, em vez de uma posição baseada em um arquivo de log binário. Esta opção é usada para iniciar uma replicação usando a replicação baseada em GTID. O padrão é 0, o que significa que o autoposicionamento de GTID e a replicação baseada em GTID não são usados. Esta opção pode ser usada com `ALTERAR FONTE DE REPLICAÇÃO PARA` apenas se o fio de transação SQL (aplicável) e o fio de I/O de replicação (receptor) estiverem parados.

Tanto a replica quanto a fonte devem ter GTIDs habilitados (`GTID_MODE=ON`, `ON_PERMISSIVE` ou `OFF_PERMISSIVE` na replica, e `GTID_MODE=ON` na fonte). `SOURCE_LOG_FILE`, `SOURCE_LOG_POS`, `RELAY_LOG_FILE` e `RELAY_LOG_POS` não podem ser especificados juntos com `SOURCE_AUTO_POSITION = 1`. Se a replicação de múltiplas fontes estiver habilitada na replica, você precisa definir a opção `SOURCE_AUTO_POSITION = 1` para cada canal de replicação aplicável.

Com `SOURCE_AUTO_POSITION = 1` definido, na mão de aperto inicial da conexão, a replica envia um conjunto de GTID que contém as transações que ela já recebeu, comprometeu ou ambas. A fonte responde enviando todas as transações registradas em seu log binário cujos GTIDs não estão incluídos no conjunto de GTIDs enviado pela replica. Essa troca garante que a fonte só envie as transações com um GTID que a replica ainda não tenha registrado ou comprometido. Se a replica receber transações de mais de uma fonte, como no caso de uma topologia de diamante, a função de autodesvio garante que as transações não sejam aplicadas duas vezes. Para detalhes de como o conjunto de GTIDs enviado pela replica é calculado, consulte a Seção 19.1.3.3, “Autoposicionamento de GTID”.

Se alguma das transações que deveriam ser enviadas pela fonte tiver sido excluída do log binário da fonte ou adicionada ao conjunto de GTIDs na variável de sistema `gtid_purged` por outro método, a fonte envia o erro `ER_SOURCE_HAS_PURGED_REQUIRED_GTIDS` para a replica, e a replica não inicia a replicação. Os GTIDs das transações excluídas são identificados e listados no log de erro da fonte na mensagem de aviso `ER_FOUND_MISSING_GTIDS`. Além disso, se durante a troca de transações for encontrado que a replica registrou ou confirmou transações com o UUID da fonte no GTID, mas a fonte não as confirmou, a fonte envia o erro `ER_REPLICA_HAS_MORE_GTIDS_THAN_SOURCE` para a replica e a replica não inicia a replicação. Para obter informações sobre como lidar com essas situações, consulte a Seção 19.1.3.3, “GTID Auto-Posição”.

Você pode ver se a replicação está sendo executada com a autoposição de GTIDs habilitada verificando a tabela do Schema de Desempenho `replication_connection_status` ou a saída de `SHOW REPLICA STATUS`. Desabilitando a opção `SOURCE_AUTO_POSITION` novamente, a replica retorna à replicação baseada em arquivos.

* `SOURCE_BIND = 'interface_name'`

  Determina qual das interfaces de rede da replica será escolhida para se conectar à fonte, para uso em réplicas que têm múltiplas interfaces de rede. Especifique o endereço IP da interface de rede. O comprimento máximo do valor da string é de 255 caracteres.

O endereço IP configurado com esta opção, se houver, pode ser visto na coluna `Source_Bind` do resultado da consulta `SHOW REPLICA STATUS`. No repositório de metadados da fonte `mysql.slave_master_info`, o valor pode ser visto na coluna `Source_bind`. A capacidade de vincular uma replica a uma interface de rede específica também é suportada pelo NDB Cluster.

* `SOURCE_COMPRESSION_ALGORITHMS = 'algorithm[,algorithm][,algorithm]'`

  Especifica um, dois ou três dos algoritmos de compressão permitidos para conexões com o servidor de origem da replicação, separados por vírgulas. O comprimento máximo do valor da string é de 99 caracteres. O valor padrão é `uncompressed`.

  Os algoritmos disponíveis são `zlib`, `zstd` e `uncompressed`, os mesmos que para a variável de sistema `protocol_compression_algorithms`. Os algoritmos podem ser especificados em qualquer ordem, mas não há uma ordem de preferência - o processo de negociação de algoritmos tenta usar `zlib`, depois `zstd` e, em seguida, `uncompressed`, se forem especificados.

  O valor de `SOURCE_COMPRESSION_ALGORITHMS` só se aplica se a variável de sistema `replica_compressed_protocol` estiver desabilitada. Se `replica_compressed_protocol` estiver habilitado, ele tem precedência sobre `SOURCE_COMPRESSION_ALGORITHMS` e as conexões com a fonte usam compressão `zlib` se tanto a fonte quanto a replica suportar esse algoritmo. Para mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

A compressão de transações de log binário é ativada pela variável de sistema `binlog_transaction_compression` e também pode ser usada para economizar largura de banda. Se você fizer isso em combinação com a compressão de conexões, a compressão de conexões terá menos oportunidades de agir nos dados, mas ainda poderá comprimir cabeçalhos e os eventos e cargas de trabalho das transações que não estiverem compactados. Para obter mais informações sobre a compressão de transações de log binário, consulte a Seção 7.4.4.5, “Compressão de Transações de Log Binário”.

* `SOURCE_CONNECT_RETRY = interval`

  Especifica o intervalo em segundos entre as tentativas de reconexão que a réplica faz após a conexão com a fonte falhar. O intervalo padrão é de 60 segundos.

  O número de tentativas é limitado pela opção `SOURCE_RETRY_COUNT`. Se os ajustes padrão forem usados, a réplica aguarda 60 segundos entre as tentativas de reconexão (`SOURCE_CONNECT_RETRY=60`) e continua tentando reconectar nessa taxa por 10 minutos (`SOURCE_RETRY_COUNT=10`). Esses valores são registrados no repositório de metadados da fonte e mostrados na tabela `replication_connection_configuration` do Schema de Desempenho.

* `SOURCE_CONNECTION_AUTO_FAILOVER = {0|1}`

  Ativa o mecanismo de failover de conexão assíncrono para um canal de replicação se um ou mais servidores de origem de replicação alternativos estiverem disponíveis (ou seja, quando houver vários servidores MySQL ou grupos de servidores que compartilham os dados replicados). O padrão é 0, o que significa que o mecanismo não é ativado. Para obter informações completas e instruções para configurar essa funcionalidade, consulte a Seção 19.4.9.2, “Failover de Conexão Assíncrona para Replicas”.

O mecanismo de falha de conexão assíncrona assume o controle após as tentativas de reconexão controladas por `SOURCE_CONNECT_RETRY` e `SOURCE_RETRY_COUNT` serem esgotadas. Ele reconecta a replica a uma fonte alternativa escolhida de uma lista de fontes especificada, que você pode gerenciar usando as funções `asynchronous_connection_failover_add_source()` e `asynchronous_connection_failover_delete_source()`. Para adicionar e remover grupos gerenciados de servidores, use `asynchronous_connection_failover_add_managed()` e `asynchronous_connection_failover_delete_managed()` em vez disso. Para obter mais informações, consulte a Seção 19.4.9, “Alternar fontes e réplicas com falha de conexão assíncrona”.

Importante

1. Você só pode definir `SOURCE_CONNECTION_AUTO_FAILOVER = 1` quando o posicionamento automático de GTID estiver em uso (`SOURCE_AUTO_POSITION = 1`).

2. Quando você definir `SOURCE_CONNECTION_AUTO_FAILOVER = 1`, defina `SOURCE_RETRY_COUNT` e `SOURCE_CONNECT_RETRY` para números mínimos que permitam apenas algumas tentativas de reposição com a mesma fonte, caso a falha de conexão seja causada por uma interrupção transitória na rede. Caso contrário, o mecanismo de falha de conexão assíncrona não pode ser ativado prontamente. Valores adequados são `SOURCE_RETRY_COUNT=3` e `SOURCE_CONNECT_RETRY=10`, que fazem a replica tentar a conexão 3 vezes com intervalos de 10 segundos entre elas.

3. Quando você define `SOURCE_CONNECTION_AUTO_FAILOVER = 1`, os repositórios de metadados de replicação devem conter as credenciais para uma conta de usuário de replicação que possa ser usada para se conectar a todos os servidores na lista de origem para o canal de replicação. A conta também deve ter permissões `SELECT` nas tabelas do Schema de Desempenho. Essas credenciais podem ser definidas usando a instrução `ALTERAR REPLICAÇÃO DE ORIGEM PARA`, com as opções `SOURCE_USER` e `SOURCE_PASSWORD`. Para mais informações, consulte a Seção 19.4.9, “Alternar origens e réplicas com failover de conexão assíncrona”.

4. Quando você define `SOURCE_CONNECTION_AUTO_FAILOVER = 1`, o failover de conexão assíncrona para réplicas é ativado automaticamente se este canal de replicação estiver em um primário de Replicação em Grupo em um grupo em modo de primário único. Com essa função ativa, se o primário que está replicando sair offline ou entrar em um estado de erro, o novo primário começa a replicação no mesmo canal quando é eleito. Se você deseja usar a função, este canal de replicação também deve ser configurado em todos os servidores secundários do grupo de replicação e em quaisquer novos membros que se juntem. (Se os servidores forem provisionados usando a funcionalidade clone do MySQL, tudo isso acontece automaticamente.) Se você não deseja usar a função, desative-a usando a função `group_replication_disable_member_action()` para desabilitar a ação de membro da Replicação em Grupo `mysql_start_failover_channels_if_primary`, que está habilitada por padrão. Para mais informações, consulte a Seção 19.4.9.2, “Failover de Conexão Assíncrona para Réplicas”.

* `SOURCE_DELAY = intervalo`

Especifica quantos segundos o replica deve ficar atrasado em relação à fonte. Um evento recebido da fonte não é executado até que pelo menos *`interval`* segundos depois de sua execução na fonte. *`interval`* deve ser um inteiro não negativo no intervalo de 0 a 231−1. O padrão é 0. Para mais informações, consulte a Seção 19.4.11, “Replicação Atrasada”.

A declaração `CHANGE REPLICATION SOURCE TO` usando a opção `SOURCE_DELAY` pode ser executada em uma replica em execução quando o thread SQL de replicação é parado.

* `SOURCE_HEARTBEAT_PERIOD = interval`

  Controla o intervalo de batida de coração, que interrompe o tempo limite de conexão ocorrendo na ausência de dados se a conexão ainda estiver boa. Um sinal de batida de coração é enviado para a replica após esse número de segundos, e o período de espera é redefinido sempre que o log binário da fonte é atualizado com um evento. Os batimentos de coração são, portanto, enviados pela fonte apenas se não houver eventos não enviados no arquivo de log binário por um período maior que este.

  O intervalo de batida de coração *`interval`* é um valor decimal com o intervalo de 0 a 4294967 segundos e uma resolução em milissegundos; o menor valor não nulo é 0,001. Definir *`interval`* para 0 desabilita os batimentos de coração completamente. O intervalo de batida de coração padrão é metade do valor da variável de sistema `replica_net_timeout`. Ele é registrado no repositório de metadados da fonte e exibido na tabela `replication_connection_configuration` do Schema de Desempenho.

A variável de sistema `replica_net_timeout` especifica o número de segundos que a replica espera por mais dados ou por um sinal de batida de coração do fonte, antes que a replica considere a conexão interrompida, interrompa a leitura e tente se reconectar. O valor padrão é de 60 segundos (um minuto). Observe que uma alteração no valor ou no ajuste padrão de `replica_net_timeout` não altera automaticamente o intervalo de batida de coração, seja ele definido explicitamente ou esteja usando um valor padrão previamente calculado. Uma mensagem de aviso é emitida se você definir o valor global de `replica_net_timeout` para um valor menor que o intervalo atual de batida de coração. Se `replica_net_timeout` for alterado, você também deve emitir `CHANGE REPLICATION SOURCE TO` para ajustar o intervalo de batida de coração para um valor apropriado, para que o sinal de batida de coração ocorra antes do tempo limite da conexão. Se você não fizer isso, o sinal de batida de coração não terá efeito, e se nenhum dado for recebido do fonte, a replica pode fazer tentativas repetidas de reconexão, criando threads de dump de zumbi.

* `SOURCE_HOST = 'host_name'`

  O nome do host ou o endereço IP do servidor de fonte de replicação. A replica usa isso para se conectar à fonte. O comprimento máximo do valor da string é de 255 caracteres.

  Se você especificar `SOURCE_HOST` ou `SOURCE_PORT`, a replica assume que o servidor de fonte é diferente do anterior (mesmo que o valor da opção seja o mesmo que seu valor atual.) Nesse caso, os valores antigos para o nome e a posição do arquivo de log binário da fonte são considerados não mais aplicáveis, então, se você não especificar `SOURCE_LOG_FILE` e `SOURCE_LOG_POS` na declaração, `SOURCE_LOG_FILE=''` e `SOURCE_LOG_POS=4` são anexados silenciosamente a ela.

Definir `SOURCE_HOST=''` (ou seja, definindo seu valor explicitamente para uma string vazia) *não* é a mesma coisa que não definir `SOURCE_HOST` de forma alguma. Tentar definir `SOURCE_HOST` para uma string vazia falha com um erro.

* `SOURCE_LOG_FILE = 'source_log_name'`, `SOURCE_LOG_POS = source_log_pos`

  O nome do arquivo de log binário e a localização nesse arquivo, onde o thread de I/O de replicação (receptor) começa a ler o log binário da fonte da próxima vez que o thread começar. Especifique essas opções se estiver usando replicação baseada em posição do arquivo de log binário.

  `SOURCE_LOG_FILE` deve incluir o sufixo numérico de um arquivo de log binário específico que está disponível no servidor de origem, por exemplo, `SOURCE_LOG_FILE='binlog.000145'`. O comprimento máximo do valor da string é de 511 caracteres.

  `SOURCE_LOG_POS` é a posição numérica para que a replica comece a ler nesse arquivo. `SOURCE_LOG_POS=4` representa o início dos eventos em um arquivo de log binário.

  Se você especificar qualquer um de `SOURCE_LOG_FILE` ou `SOURCE_LOG_POS`, não pode especificar `SOURCE_AUTO_POSITION = 1`, que é para replicação baseada em GTID.

  Se nenhum de `SOURCE_LOG_FILE` ou `SOURCE_LOG_POS` for especificado, a replica usa as últimas coordenadas do *thread SQL de replicação* antes que `CHANGE REPLICATION SOURCE TO` fosse emitido. Isso garante que não haja interrupção na replicação, mesmo que o thread SQL de replicação (aplicador) tenha chegado tarde em comparação com o thread de I/O de replicação (receptor).

* `SOURCE_PASSWORD = 'password'`

  A senha para a conta de usuário de replicação a ser usada para se conectar ao servidor de origem de replicação. O comprimento máximo do valor da string é de 32 caracteres. Se você especificar `SOURCE_PASSWORD`, `SOURCE_USER` também é necessário.

A senha usada para uma conta de usuário de replicação em uma declaração `ALTERAR FONTE DE REPLICA PARA` é limitada a 32 caracteres de comprimento. Tentar usar uma senha com mais de 32 caracteres faz com que `ALTERAR FONTE DE REPLICA PARA` falhe.

A senha é mascarada nos logs do MySQL Server, nas tabelas do Schema de Desempenho e nas declarações `SHOW PROCESSLIST`.

* `SOURCE_PORT = port_num`

  O número de porta TCP/IP que a replica usa para se conectar ao servidor de fonte de replicação.

  Observação

  A replicação não pode usar arquivos de sockets Unix. Você deve ser capaz de se conectar ao servidor de fonte de replicação usando TCP/IP.

  Se você especificar `SOURCE_HOST` ou `SOURCE_PORT`, a replica assume que o servidor de fonte é diferente do anterior (mesmo que o valor da opção seja o mesmo que seu valor atual). Nesse caso, os valores antigos para o nome e a posição do arquivo de log binário da fonte são considerados não mais aplicáveis, então, se você não especificar `SOURCE_LOG_FILE` e `SOURCE_LOG_POS` na declaração, `SOURCE_LOG_FILE=''` e `SOURCE_LOG_POS=4` são anexados silenciosamente a ela.

* `SOURCE_PUBLIC_KEY_PATH = 'key_file_name'`

  Habilita a troca de senha baseada em par de chaves RSA fornecendo o nome do caminho de um arquivo que contém uma cópia do lado da replica da chave pública necessária pelo fonte. O arquivo deve estar no formato PEM. O comprimento máximo do valor da string é de 511 caracteres.

Esta opção se aplica a réplicas que se autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. (Para `sha256_password`, `SOURCE_PUBLIC_KEY_PATH` pode ser usado apenas se o MySQL foi compilado usando OpenSSL. Se você estiver usando uma conta de usuário de replicação que se autentica com o plugin `caching_sha2_password` (o padrão), e não estiver usando uma conexão segura, você deve especificar essa opção ou a opção `GET_SOURCE_PUBLIC_KEY=1` para fornecer a chave pública RSA à replica.)

* `SOURCE_RETRY_COUNT = count`

  Define o número máximo de tentativas de reconexão que a replica faz após o tempo de conexão com a fonte expirar, conforme determinado pela variável de sistema `replica_net_timeout`. Se a replica precisar se reconectar, a primeira tentativa ocorre imediatamente após o tempo de expiração. O valor padrão é de 10 tentativas.

  O intervalo entre as tentativas é especificado pela opção `SOURCE_CONNECT_RETRY`. Se os ajustes padrão forem usados, a replica aguarda 60 segundos entre as tentativas de reconexão (`SOURCE_CONNECT_RETRY=60`), e continua tentando se reconectar nessa taxa por 10 minutos (`SOURCE_RETRY_COUNT=10`). Um valor de 0 para `SOURCE_RETRY_COUNT` significa que não há limite no número de tentativas de reconexão, então a replica continua tentando se reconectar indefinidamente.

  Os valores para `SOURCE_CONNECT_RETRY` e `SOURCE_RETRY_COUNT` são registrados no repositório de metadados da fonte e mostrados na tabela `replication_connection_configuration` do Schema de Desempenho. `SOURCE_RETRY_COUNT` substitui a opção de inicialização do servidor `--master-retry-count`.

* `SOURCE_SSL = {0|1}`

Especifique se a replica criptografa a conexão de replicação. O padrão é 1, o que significa que você pode configurar a criptografia usando as opções `SOURCE_SSL_xxx` e `SOURCE_TLS_xxx`. Se você definir `SOURCE_SSL=0`, a replica não criptografa a conexão de replicação.

Com o ajuste `SOURCE_SSL=1` para uma conexão de replicação, nenhuma configuração adicional das opções `SOURCE_SSL_xxx` corresponde à configuração `--ssl-mode=REQUIRED` para o cliente, conforme descrito nas Opções de comando para conexões criptografadas. Com `SOURCE_SSL=1`, a tentativa de conexão só tem sucesso se uma conexão criptografada puder ser estabelecida. Uma conexão de replicação não retorna para uma conexão não criptografada, portanto, não há configuração correspondente ao ajuste `--ssl-mode=PREFERRED` para a replicação. Se `SOURCE_SSL=0` for definido, isso corresponde a `--ssl-mode=DISABLED`.

Importante

Para ajudar a prevenir ataques sofisticados de intermediário, é importante que a replica verifique a identidade do servidor. Você pode especificar opções adicionais de `SOURCE_SSL_xxx` para corresponder aos ajustes `--ssl-mode=VERIFY_CA` e `--ssl-mode=VERIFY_IDENTITY`, que são uma escolha melhor do que o ajuste padrão para ajudar a prevenir esse tipo de ataque. Com esses ajustes, a replica verifica que o certificado do servidor é válido e verifica se o nome do host que a replica está usando corresponde à identidade no certificado do servidor. Para implementar um desses níveis de verificação, você deve primeiro garantir que o certificado CA do servidor esteja disponível de forma confiável para a replica, caso contrário, problemas de disponibilidade resultarão. Por essa razão, eles não são o ajuste padrão.

* `SOURCE_SSL_xxx`, `SOURCE_TLS_xxx`

Especifique como a replica usa criptografia e cifra para proteger a conexão de replicação. Essas opções podem ser alteradas mesmo em réplicas compiladas sem suporte SSL. Elas são salvas no repositório de metadados da fonte, mas são ignoradas se a replica não tiver o suporte SSL habilitado. O comprimento máximo do valor para as opções `SOURCE_SSL_xxx` e `SOURCE_TLS_xxx` de valor de string é de 511 caracteres, com exceção de `SOURCE_TLS_CIPHERSUITES`, para a qual é de 4000 caracteres.

As opções `SOURCE_SSL_xxx` e `SOURCE_TLS_xxx` realizam as mesmas funções que as opções de cliente `--ssl-xxx` e `--tls-xxx` descritas em Opções de comando para conexões criptografadas. A correspondência entre os dois conjuntos de opções e o uso das opções `SOURCE_SSL_xxx` e `SOURCE_TLS_xxx` para configurar uma conexão segura é explicada na Seção 19.3.1, “Configurando a replicação para usar conexões criptografadas”.

* `SOURCE_USER = 'user_name'`

  O nome do usuário para a conta de usuário de replicação a ser usada para se conectar ao servidor de origem da replicação. O comprimento máximo do valor de string é de 96 caracteres.

  Para a replicação em grupo, essa conta deve existir em todos os membros do grupo de replicação. Ela é usada para recuperação distribuída se a pilha de comunicação XCom estiver em uso para o grupo e também é usada para conexões de comunicação de grupo se a pilha de comunicação MySQL estiver em uso para o grupo. Com a pilha de comunicação MySQL, a conta deve ter a permissão `GROUP_REPLICATION_STREAM`.

É possível definir um nome de usuário vazio especificando `SOURCE_USER=''`, mas o canal de replicação não pode ser iniciado com um nome de usuário vazio. É válido definir um nome de usuário `SOURCE_USER` vazio e usar o canal posteriormente se você sempre fornecer credenciais de usuário usando a instrução `START REPLICA` ou `START GROUP_REPLICATION` que inicia o canal de replicação. Essa abordagem significa que o canal de replicação sempre precisa de intervenção do operador para ser reiniciado, mas as credenciais de usuário não são registradas nos repositórios de metadados de replicação.

Importante

Para se conectar à fonte usando uma conta de usuário de replicação que autentica com o plugin `caching_sha2_password`, você deve configurar uma conexão segura conforme descrito na Seção 19.3.1, “Configurando a Replicação para Usar Conexões Encriptadas”, ou habilitar a conexão não encriptada para suportar a troca de senhas usando um par de chaves RSA. O plugin de autenticação `caching_sha2_password` é o padrão para novos usuários (veja a Seção 8.4.1.1, “Caching SHA-2 Pluggable Authentication”). Se a conta de usuário que você cria ou usa para replicação usar este plugin de autenticação e você não estiver usando uma conexão segura, você deve habilitar a troca de senha baseada em par de chaves RSA para uma conexão bem-sucedida. Você pode fazer isso usando a opção `SOURCE_PUBLIC_KEY_PATH` ou a opção `GET_SOURCE_PUBLIC_KEY=1` para essa instrução.

* `SOURCE_ZSTD_COMPRESSION_LEVEL = level`

O nível de compressão a ser usado para conexões ao servidor de origem de replicação que usam o algoritmo de compressão `zstd`. Os níveis permitidos são de 1 a 22, com valores maiores indicando níveis crescentes de compressão. O nível padrão é 3.

O ajuste do nível de compressão não tem efeito em conexões que não utilizam compressão `zstd`. Para obter mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

##### Exemplos

`CHANGE REPLICATION SOURCE TO` é útil para configurar uma replica quando você tem o instantâneo da fonte e registrou as coordenadas do log binário da fonte correspondentes ao momento do instantâneo. Após carregar o instantâneo na replica para sincronizá-la com a fonte, você pode executar `CHANGE REPLICATION SOURCE TO SOURCE_LOG_FILE='log_name', SOURCE_LOG_POS=log_pos` na replica para especificar as coordenadas nas quais a replica deve começar a ler o log binário da fonte. O exemplo a seguir altera o servidor de origem que a replica usa e estabelece as coordenadas do log binário da fonte a partir das quais a replica começa a ler:

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

Para o procedimento de alternar uma replica existente para uma nova fonte durante o failover, consulte a Seção 19.4.8, “Alternar Fontes Durante o Failover”.

Quando GTIDs estão em uso na fonte e na replica, especifique o posicionamento automático do GTID em vez de fornecer a posição do arquivo de log binário, como no exemplo a seguir. Para obter instruções completas sobre como configurar e iniciar a replicação baseada em GTIDs em servidores novos ou parados, servidores online ou réplicas adicionais, consulte a Seção 19.1.3, “Replicação com Identificadores Globais de Transação”.

```
CHANGE REPLICATION SOURCE TO
  SOURCE_HOST='source3.example.com',
  SOURCE_USER='replication',
  SOURCE_PASSWORD='password',
  SOURCE_PORT=3306,
  SOURCE_AUTO_POSITION = 1,
  FOR CHANNEL "source_3";
```

Neste exemplo, a replicação de múltiplas fontes está em uso, e a instrução `CHANGE REPLICATION SOURCE TO` é aplicada ao canal de replicação `"source_3"` que conecta a replica ao host especificado. Para obter orientações sobre como configurar a replicação de múltiplas fontes, consulte a Seção 19.1.5, “Replicação de Múltiplas Fontes MySQL”.

O próximo exemplo mostra como fazer com que a replica aplique transações de arquivos de log de retransmissão que você deseja repetir. Para isso, a fonte não precisa ser acessível. Você pode usar `CHANGE REPLICATION SOURCE TO` para localizar a posição do log de retransmissão onde você deseja que a replica comece a reaplicar as transações e, em seguida, iniciar o thread SQL:

```
CHANGE REPLICATION SOURCE TO
  RELAY_LOG_FILE='replica-relay-bin.006',
  RELAY_LOG_POS=4025;
START REPLICA SQL_THREAD;
```

`CHANGE REPLICATION SOURCE TO` também pode ser usado para pular transações no log binário que estão causando a parada da replicação. O método apropriado para fazer isso depende se GTIDs estão em uso ou não. Para instruções sobre como pular transações usando `CHANGE REPLICATION SOURCE TO` ou outro método, consulte a Seção 19.1.7.3, “Pular Transações”.