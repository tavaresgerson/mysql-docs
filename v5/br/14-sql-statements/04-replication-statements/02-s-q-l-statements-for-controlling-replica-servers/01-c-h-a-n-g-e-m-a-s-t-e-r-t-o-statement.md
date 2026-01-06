#### 13.4.2.1 ALTERAR MASTER PARA Declaração

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

`CHANGE MASTER TO` altera os parâmetros que a replica usa para se conectar ao servidor de origem da replicação, para ler o log binário da origem e para ler o log de retransmissão da replica. Também atualiza o conteúdo dos repositórios de metadados de replicação (veja Seção 16.2.4, “Repositórios de Log de Retransmissão e Metadados de Replicação”). O `CHANGE MASTER TO` requer o privilégio `SUPER`.

Antes do MySQL 5.7.4, os threads de replicação devem ser interrompidos, usando `STOP SLAVE`, se necessário, antes de emitir essa declaração. No MySQL 5.7.4 e versões posteriores, você pode emitir declarações `CHANGE MASTER TO` em uma replica em execução sem fazer isso, dependendo dos estados do thread de SQL de replicação e do thread de I/O de replicação. As regras que regem esse uso são fornecidas mais adiante nesta seção.

Ao usar uma replica multithreading (ou seja, quando `slave_parallel_workers` é maior que 0), parar a replica pode causar "lacunas" na sequência de transações que foram executadas a partir do log de retransmissão, independentemente de a replica ter sido parada intencionalmente ou não. Quando essas lacunas existem, emitir `CHANGE MASTER TO` falha. A solução para essa situação é emitir `START SLAVE UNTIL SQL_AFTER_MTS_GAPS`, o que garante que as lacunas sejam fechadas.

A cláusula opcional `FOR CHANNEL channel` permite que você nomeie qual canal de replicação a declaração se aplica. Ao fornecer uma cláusula `FOR CHANNEL channel`, a declaração `CHANGE MASTER TO` é aplicada a um canal de replicação específico e é usada para adicionar um novo canal ou modificar um canal existente. Por exemplo, para adicionar um novo canal chamado channel2:

```sql
CHANGE MASTER TO MASTER_HOST=host1, MASTER_PORT=3002 FOR CHANNEL 'channel2'
```

Se nenhuma cláusula for nomeada e não houver canais extras, a declaração se aplica ao canal padrão.

Ao usar múltiplos canais de replicação, se uma declaração `CHANGE MASTER TO` não nomear um canal usando uma cláusula `FOR CHANNEL channel`, ocorre um erro. Consulte Seção 16.2.2, “Canais de Replicação” para obter mais informações.

As opções não especificadas mantêm seu valor, exceto conforme indicado na discussão a seguir. Assim, na maioria dos casos, não é necessário especificar opções que não mudam. Por exemplo, se a senha para se conectar ao servidor de origem da replicação mudou, emita essa declaração para informar a replica sobre a nova senha:

```sql
CHANGE MASTER TO MASTER_PASSWORD='new3cret';
```

`MASTER_HOST`, `MASTER_USER`, `MASTER_PASSWORD` e `MASTER_PORT` fornecem informações à replica sobre como se conectar ao servidor de origem de replicação:

- `MASTER_HOST` e `MASTER_PORT` são o nome do host (ou endereço IP) do host mestre e sua porta TCP/IP.

  Nota

  A replicação não pode usar arquivos de socket Unix. Você deve ser capaz de se conectar ao servidor de origem da replicação usando TCP/IP.

  Se você especificar a opção `MASTER_HOST` ou `MASTER_PORT`, a replica assume que a fonte é diferente da anterior (mesmo que o valor da opção seja o mesmo que seu valor atual). Nesse caso, os valores antigos do nome e da posição do arquivo de log binário da fonte são considerados não mais aplicáveis, então, se você não especificar `MASTER_LOG_FILE` e `MASTER_LOG_POS` na declaração, `MASTER_LOG_FILE=''` e `MASTER_LOG_POS=4` são anexados silenciosamente a ela.

  Definir `MASTER_HOST=''` (ou seja, definir explicitamente seu valor para uma string vazia) *não* é o mesmo que não definir `MASTER_HOST` de forma alguma. A partir do MySQL 5.5, tentar definir `MASTER_HOST` para uma string vazia falha com um erro. Anteriormente, definir `MASTER_HOST` para uma string vazia causava o falhanço subsequente de `START SLAVE`. (Bug #28796)

  Os valores usados para `MASTER_HOST` e outras opções de `ALTERAR MASTER PARA` são verificados quanto a caracteres de retorno de linha (`\n` ou `0x0A`); a presença desses caracteres nesses valores faz com que a declaração falhe com `ER_MASTER_INFO`. (Bug #11758581, Bug #50801)

- `MASTER_USER` e `MASTER_PASSWORD` são o nome de usuário e a senha da conta a ser usada para se conectar à fonte. Se você especificar `MASTER_PASSWORD`, `MASTER_USER` também é necessário. A senha usada para uma conta de usuário de replicação em uma declaração `CHANGE MASTER TO` é limitada a 32 caracteres de comprimento; antes do MySQL 5.7.5, se a senha fosse mais longa, a declaração teria sucesso, mas quaisquer caracteres em excesso seriam truncados silenciosamente. No MySQL 5.7.5 e versões posteriores, tentar usar uma senha de mais de 32 caracteres faz com que `CHANGE MASTER TO` falhe. (Bug
  \#11752299, Bug #43439)

  É possível definir um nome de usuário vazio especificando `MASTER_USER=''`, mas o canal de replicação não pode ser iniciado com um nome de usuário vazio. Defina apenas um nome de usuário `MASTER_USER` vazio se precisar limpar credenciais anteriormente usadas dos repositórios da replicação por motivos de segurança e não tente usar o canal depois disso.

  O texto de uma declaração de execução `CHANGE MASTER TO`, incluindo os valores para `MASTER_USER` e `MASTER_PASSWORD`, pode ser visto na saída de uma declaração `SHOW PROCESSLIST` concorrente. (O texto completo de uma declaração `START SLAVE` também é visível na `SHOW PROCESSLIST`.)

Definir `MASTER_SSL=1` para uma conexão de replicação e, em seguida, não definir mais opções `MASTER_SSL_xxx` corresponde a definir `--ssl-mode=REQUIRED` para o cliente, conforme descrito em Opções de comando para conexões criptografadas. Com `MASTER_SSL=1`, a tentativa de conexão só terá sucesso se uma conexão criptografada puder ser estabelecida. Uma conexão de replicação não retorna para uma conexão não criptografada, portanto, não há configuração correspondente ao ajuste `--ssl-mode=PREFERRED` para a replicação. Se `MASTER_SSL=0` for definido, isso corresponde a `--ssl-mode=DISABLED`.

Importante

Para ajudar a prevenir ataques sofisticados de homem no meio (man-in-the-middle), é importante que a replica verifique a identidade do servidor. Você pode especificar opções adicionais de `MASTER_SSL_xxx` para corresponder às configurações `--ssl-mode=VERIFY_CA` e `--ssl-mode=VERIFY_IDENTITY`, que são uma escolha melhor do que o ajuste padrão para ajudar a prevenir esse tipo de ataque. Com essas configurações, a replica verifica se o certificado do servidor é válido e se o nome do host que a replica está usando corresponde à identidade no certificado do servidor. Para implementar um desses níveis de verificação, você deve primeiro garantir que o certificado CA do servidor esteja disponível de forma confiável para a replica, caso contrário, problemas de disponibilidade ocorrerão. Por essa razão, eles não são o ajuste padrão.

As opções `MASTER_SSL_xxx` e `MASTER_TLS_VERSION` especificam como a replica usa criptografia e cifra para proteger a conexão de replicação. Essas opções podem ser alteradas mesmo em réplicas compiladas sem suporte SSL. Elas são salvas no repositório de metadados de origem, mas são ignoradas se a replica não tiver o suporte SSL habilitado. As opções `MASTER_SSL_xxx` e `MASTER_TLS_VERSION` realizam as mesmas funções que as opções de cliente `--ssl-xxx` e `--tls-version` descritas em Opções de comando para conexões criptografadas. A correspondência entre os dois conjuntos de opções e o uso das opções `MASTER_SSL_xxx` e `MASTER_TLS_VERSION` para configurar uma conexão segura é explicada em Seção 16.3.8, “Configurando a replicação para usar conexões criptografadas”.

As opções `MASTER_HEARTBEAT_PERIOD`, `MASTER_CONNECT_RETRY` e `MASTER_RETRY_COUNT` controlam como a replica reconhece que a conexão com a fonte foi perdida e tenta reconectar.

- A variável de sistema [`slave_net_timeout`](https://pt.wikipedia.org/wiki/Replicação_\(banco_de_dados\)#sysvar_slave_net_timeout) especifica o número de segundos que a replica espera por mais dados ou por um sinal de batida de coração do servidor de origem, antes que a replica considere a conexão interrompida, interrompa a leitura e tente se reconectar. O valor padrão é de 60 segundos (um minuto). Antes do MySQL 5.7.7, o valor padrão era de 3600 segundos (uma hora).

- O intervalo do batimento cardíaco, que interrompe o tempo de espera da conexão que ocorre na ausência de dados, se a conexão ainda estiver boa, é controlado pela opção `MASTER_HEARTBEAT_PERIOD`. Um sinal de batimento cardíaco é enviado para a replica após esse número de segundos, e o período de espera é redefinido sempre que o log binário da fonte é atualizado com um evento. Os batimentos cardíacos são, portanto, enviados pela fonte apenas se não houver eventos não enviados no arquivo de log binário por um período maior que este. O intervalo do batimento cardíaco *`interval`* é um valor decimal com o intervalo de 0 a 4294967 segundos e uma resolução em milissegundos; o menor valor não nulo é 0,001. Definir *`interval`* para 0 desabilita os batimentos cardíacos completamente. O intervalo do batimento cardíaco é padrão metade do valor da variável de sistema `slave_net_timeout`. Ele é registrado no repositório de metadados da fonte e exibido na tabela do Schema de Desempenho `replication_connection_configuration`.

- Antes do MySQL 5.7.4, a ausência de `MASTER_HEARTBEAT_PERIOD` fazia com que `CHANGE MASTER TO` redefinisse o intervalo do batimento cardíaco para o valor padrão (metade do valor da variável de sistema `slave_net_timeout`), e `Slave_received_heartbeats` para 0. O intervalo do batimento cardíaco agora não é redefinido, exceto por `RESET SLAVE` (reset-slave.html). (Bug #18185490)

- Observe que uma alteração no valor ou configuração padrão de `slave_net_timeout` não altera automaticamente o intervalo do batimento cardíaco, seja ele definido explicitamente ou esteja usando um valor padrão previamente calculado. Uma mensagem de aviso é emitida se você definir `@@GLOBAL.slave_net_timeout` para um valor menor que o intervalo atual do batimento cardíaco. Se `slave_net_timeout` for alterado, você também deve emitir `CHANGE MASTER TO` para ajustar o intervalo do batimento cardíaco para um valor apropriado, de modo que o sinal do batimento cardíaco ocorra antes do tempo limite da conexão. Se você não fizer isso, o sinal do batimento cardíaco não terá efeito, e se nenhum dado for recebido da fonte, a réplica pode fazer tentativas repetidas de reconexão, criando threads de dump de zumbi.

- Se a replica precisar se reconectar, a primeira tentativa de reconexão ocorre imediatamente após o tempo limite. `MASTER_CONNECT_RETRY` especifica o intervalo entre as tentativas de reconexão, e `MASTER_RETRY_COUNT` limita o número de tentativas de reconexão. Se as configurações padrão forem usadas, a replica aguarda 60 segundos entre as tentativas de reconexão (`MASTER_CONNECT_RETRY=60`) e continua tentando se reconectar nessa taxa por 60 dias (`MASTER_RETRY_COUNT=86400`). Um valor de 0 para `MASTER_RETRY_COUNT` significa que não há limite no número de tentativas de reconexão, então a replica continua tentando se reconectar indefinidamente. Esses valores são registrados no repositório de metadados de origem e mostrados na tabela do Schema de Desempenho `replication_connection_configuration`. `MASTER_RETRY_COUNT` substitui a opção de inicialização do servidor `--master-retry-count` (`replication-options-replica.html#option_mysqld_master-retry-count`).

`MASTER_DELAY` especifica quantos segundos a réplica deve ficar atrasada em relação à fonte. Um evento recebido da fonte não é executado até que pelo menos *`interval`* segundos depois de sua execução na fonte. O padrão é 0. Um erro ocorre se *`interval`* não for um inteiro não negativo no intervalo de 0 a 231−1. Para mais informações, consulte Seção 16.3.10, “Replicação Atrasada”.

A partir do MySQL 5.7, uma instrução `CHANGE MASTER TO` que utiliza a opção `MASTER_DELAY` pode ser executada em uma replica em execução quando o thread SQL de replicação é interrompido.

`MASTER_BIND` é para uso em réplicas com múltiplas interfaces de rede e determina qual das interfaces de rede da réplica será escolhida para se conectar à fonte.

O endereço configurado com esta opção, se houver, pode ser visto na coluna `Master_Bind` do resultado da consulta `SHOW SLAVE STATUS` (show-slave-status.html). Se você estiver usando uma tabela para o repositório de metadados da fonte (o servidor foi iniciado com `master_info_repository=TABLE` (replication-options-replica.html#sysvar\_master\_info)), o valor também pode ser visto na coluna `Master_bind` da tabela `mysql.slave_master_info`.

A capacidade de vincular uma replica a uma interface de rede específica também é suportada pelo NDB Cluster.

`MASTER_LOG_FILE` e `MASTER_LOG_POS` são as coordenadas nas quais a thread de I/O de replicação deve começar a ler a partir da fonte da próxima vez que a thread começar. `RELAY_LOG_FILE` e `RELAY_LOG_POS` são as coordenadas nas quais a thread de SQL de replicação deve começar a ler a partir do log de retransmissão da próxima vez que a thread começar. Se você especificar qualquer uma dessas opções, não pode especificar `MASTER_AUTO_POSITION = 1` (descrito mais adiante nesta seção). Se nenhuma das coordenadas de `MASTER_LOG_FILE` ou `MASTER_LOG_POS` for especificada, a replica usa as últimas coordenadas da *thread de SQL de replicação* antes de `CHANGE MASTER TO` ser emitido. Isso garante que não haja interrupção na replicação, mesmo que a thread de SQL de replicação tenha sido atrasada em relação à thread de I/O de replicação, quando você apenas deseja alterar, por exemplo, a senha a ser usada.

A partir do MySQL 5.7, uma instrução `CHANGE MASTER TO` que utiliza `RELAY_LOG_FILE`, `RELAY_LOG_POS` ou ambas as opções pode ser executada em uma replica em execução quando o thread SQL de replicação é interrompido. Antes do MySQL 5.7.4, o `CHANGE MASTER TO` exclui todos os arquivos de log de relevo e inicia um novo, a menos que você especifique `RELAY_LOG_FILE` ou `RELAY_LOG_POS`. Nesse caso, os arquivos de log de relevo são mantidos; a variável global `relay_log_purge` é definida silenciosamente para 0. No MySQL 5.7.4 e versões posteriores, os logs de relevo são preservados se pelo menos um dos threads SQL de replicação e o thread de E/S de replicação estiverem em execução. Se ambos os threads forem interrompidos, todos os arquivos de log de relevo serão excluídos, a menos que pelo menos uma das opções `RELAY_LOG_FILE` ou `RELAY_LOG_POS` seja especificada. Para o canal do aplicativo de replicação de grupo (`group_replication_applier`), que possui apenas um thread SQL e nenhum thread de E/S, esse é o caso se o thread SQL for interrompido, mas com esse canal você não pode usar as opções `RELAY_LOG_FILE` e `RELAY_LOG_POS`.

`RELAY_LOG_FILE` pode usar um caminho absoluto ou relativo e usa o mesmo nome de base que `MASTER_LOG_FILE`. (Bug #12190)

Quando `MASTER_AUTO_POSITION = 1` é usado com `CHANGE MASTER TO`, a replica tenta se conectar à fonte usando o recurso de autoposicionamento da replicação baseada em GTID, em vez de uma posição baseada em um arquivo de log binário. A partir do MySQL 5.7, esta opção só pode ser empregada por `CHANGE MASTER TO` se o fio de SQL de replicação e o fio de I/O de replicação estiverem parados. A replica e a fonte devem ter GTIDs habilitados (`GTID_MODE=ON`, `ON_PERMISSIVE` ou `OFF_PERMISSIVE` na replica, e `GTID_MODE=ON` na fonte). `MASTER_LOG_FILE`, `MASTER_LOG_POS`, `RELAY_LOG_FILE` e `RELAY_LOG_POS` não podem ser especificados juntamente com `MASTER_AUTO_POSITION = 1`. Se a replicação de múltiplas fontes estiver habilitada na replica, você precisa definir a opção `MASTER_AUTO_POSITION = 1` para cada canal de replicação aplicável.

Com `MASTER_AUTO_POSITION = 1` definido, na inicialização da conexão, a replica envia um conjunto de GTID que contém as transações que ela já recebeu, comprometeu ou ambas. A fonte responde enviando todas as transações registradas em seu log binário cujos GTID não estão incluídos no conjunto de GTID enviado pela replica. Essa troca garante que a fonte só envie as transações com um GTID que a replica ainda não tenha registrado ou comprometido. Se a replica receber transações de mais de uma fonte, como no caso de uma topologia em forma de diamante, a função de auto-pular garante que as transações não sejam aplicadas duas vezes. Para detalhes sobre como o conjunto de GTID enviado pela replica é calculado, consulte Seção 16.1.3.3, “Posicionamento Automático de GTID”.

Se alguma das transações que deveriam ser enviadas pela fonte tiver sido excluída do log binário da fonte ou adicionada ao conjunto de GTIDs na variável de sistema `gtid_purged` por outro método, a fonte envia o erro `ER_MASTER_HAS_PURGED_REQUIRED_GTIDS` para a replica, e a replica não inicia a replicação. Além disso, se durante a troca de transações for encontrado que a replica registrou ou confirmou transações com o UUID da fonte no GTID, mas a fonte não as confirmou, a fonte envia o erro `ER_SLAVE_HAS_MORE_GTIDS_THAN_MASTER` para a replica e a replica não inicia a replicação. Para obter informações sobre como lidar com essas situações, consulte Seção 16.1.3.3, “Posicionamento Automático de GTIDs”.

`IGNORE_SERVER_IDS` recebe uma lista separada por vírgula de 0 ou mais IDs de servidor. Eventos originados nos servidores correspondentes são ignorados, com exceção dos eventos de rotação e exclusão de logs, que ainda são registrados no log do retransmissor.

Na replicação circular, o servidor de origem normalmente atua como o terminador de seus próprios eventos, para que eles não sejam aplicados mais de uma vez. Assim, essa opção é útil na replicação circular quando um dos servidores no círculo é removido. Suponha que você tenha uma configuração de replicação circular com 4 servidores, com IDs de servidor 1, 2, 3 e 4, e o servidor 3 falha. Ao preencher a lacuna iniciando a replicação do servidor 2 para o servidor 4, você pode incluir `IGNORE_SERVER_IDS = (3)` na declaração `CHANGE MASTER TO` que você emite no servidor 4 para dizer que ele deve usar o servidor 2 como sua fonte em vez do servidor 3. Isso faz com que ele ignore e não propague quaisquer declarações que tenham origem no servidor que deixou de ser usado.

Se uma declaração `CHANGE MASTER TO` for emitida sem a opção `IGNORE_SERVER_IDS`, a lista existente será preservada. Para limpar a lista de servidores ignorados, é necessário usar a opção com uma lista vazia:

```sql
CHANGE MASTER TO IGNORE_SERVER_IDS = ();
```

Antes do MySQL 5.7.5, o comando `RESET SLAVE ALL` não tem efeito na lista de IDs do servidor. No MySQL 5.7.5 e versões posteriores, o comando `RESET SLAVE ALL` limpa `IGNORE_SERVER_IDS`. (Bug #18816897)

Se `IGNORE_SERVER_IDS` contém o ID do próprio servidor e o servidor foi iniciado com a opção `--replicate-same-server-id` habilitada, um erro será gerado.

O repositório de metadados de origem e a saída de `SHOW SLAVE STATUS` fornecem a lista dos servidores que estão atualmente ignorados. Para mais informações, consulte Seção 16.2.4.2, “Repositórios de Metadados de Replicação” e Seção 13.7.5.34, “Declaração SHOW SLAVE STATUS”.

Ao invocar `CHANGE MASTER TO`, os valores anteriores para `MASTER_HOST`, `MASTER_PORT`, `MASTER_LOG_FILE` e `MASTER_LOG_POS` são escritos no log de erro, juntamente com outras informações sobre o estado da replica antes da execução.

`CHANGE MASTER TO` causa um commit implícito de uma transação em andamento. Veja Seção 13.3.3, “Instruções que causam um commit implícito”.

No MySQL 5.7.4 e versões posteriores, a exigência estrita de executar `STOP SLAVE` antes de emitir qualquer declaração `CHANGE MASTER TO` (e `START SLAVE` depois) é removida. Em vez de depender se a replica está parada, o comportamento do `CHANGE MASTER TO` depende (no MySQL 5.7.4 e versões posteriores) dos estados do fio de SQL de replicação e do fio de I/O de replicação; qual desses fios está parado ou em execução agora determina as opções que podem ou não podem ser usadas com uma declaração `CHANGE MASTER TO` em um determinado momento. As regras para fazer essa determinação estão listadas aqui:

- Se o fio SQL estiver parado, você pode executar `CHANGE MASTER TO` usando qualquer combinação permitida, mesmo que o fio de I/O de replicação esteja em execução. Nenhuma outra opção pode ser usada com essa instrução quando o fio de I/O estiver em execução.

- Se a thread de E/S estiver parada, você pode executar `CHANGE MASTER TO` usando qualquer uma das opções desta instrução (em qualquer combinação permitida) *exceto* `RELAY_LOG_FILE`, `RELAY_LOG_POS`, `MASTER_DELAY` ou `MASTER_AUTO_POSITION = 1`, mesmo quando a thread SQL estiver em execução.

- Tanto o fio SQL quanto o fio de E/S devem ser interrompidos antes de emitir uma declaração `CHANGE MASTER TO` que utilize `MASTER_AUTO_POSITION = 1`.

Você pode verificar o estado atual do fio de replicação SQL e do fio de E/S de replicação usando `SHOW SLAVE STATUS`. Observe que o canal do aplicador de replicação em grupo (`group_replication_applier`) não tem um fio de E/S, apenas um fio de SQL.

Para obter mais informações, consulte Seção 16.3.7, “Alteração de fontes durante o failover”.

Se você estiver usando replicação baseada em declarações e tabelas temporárias, é possível que uma declaração `CHANGE MASTER TO` após uma declaração `STOP SLAVE` deixe tabelas temporárias na replica. A partir do MySQL 5.7, um aviso (`ER_WARN_OPEN_TEMP_TABLES_MUST_BE_ZERO`) é emitido sempre que isso ocorre. Você pode evitar isso nesses casos, garantindo que o valor da variável de status do sistema `Slave_open_temp_tables` seja igual a 0 antes de executar tal declaração `CHANGE MASTER TO`.

`CHANGE MASTER TO` é útil para configurar uma replica quando você tem o instantâneo do servidor de origem da replicação e registrou as coordenadas do log binário da fonte correspondentes ao momento do instantâneo. Após carregar o instantâneo na replica para sincronizá-la com a fonte, você pode executar `CHANGE MASTER TO MASTER_LOG_FILE='log_name', MASTER_LOG_POS=log_pos` na replica para especificar as coordenadas nas quais a replica deve começar a ler o log binário da fonte.

O exemplo a seguir altera o servidor de origem da replicação que a replica usa e estabelece as coordenadas do log binário da fonte a partir da qual a replica começa a ler. Isso é usado quando você deseja configurar a replica para replicar a fonte:

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

O próximo exemplo mostra uma operação que é empregada com menos frequência. Ela é usada quando a replica tem arquivos de log de relevo que você deseja que ela execute novamente por algum motivo. Para fazer isso, a fonte não precisa ser acessível. Você só precisa usar `CHANGE MASTER TO` e iniciar o thread SQL (`START SLAVE SQL_THREAD`):

```sql
CHANGE MASTER TO
  RELAY_LOG_FILE='replica-relay-bin.006',
  RELAY_LOG_POS=4025;
```

A tabela a seguir mostra o comprimento máximo permitido para as opções de valor de string.

<table summary="O comprimento máximo permitido para a opção CHANGE MASTER TO ser uma opção de valor de string."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Opção</th> <th>Comprimento máximo</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CODE_<code class="literal">MASTER_SSL_KEY</code>]</td> <td>60</td> </tr><tr> <td>[[PH_HTML_CODE_<code class="literal">MASTER_SSL_KEY</code>]</td> <td>96</td> </tr><tr> <td>[[PH_HTML_CODE_<code class="literal">MASTER_TLS_VERSION</code>]</td> <td>32</td> </tr><tr> <td>[[<code class="literal">MASTER_LOG_FILE</code>]]</td> <td>511</td> </tr><tr> <td>[[<code class="literal">RELAY_LOG_FILE</code>]]</td> <td>511</td> </tr><tr> <td>[[<code class="literal">MASTER_SSL_CA</code>]]</td> <td>511</td> </tr><tr> <td>[[<code class="literal">MASTER_SSL_CAPATH</code>]]</td> <td>511</td> </tr><tr> <td>[[<code class="literal">MASTER_SSL_CERT</code>]]</td> <td>511</td> </tr><tr> <td>[[<code class="literal">MASTER_SSL_CRL</code>]]</td> <td>511</td> </tr><tr> <td>[[<code class="literal">MASTER_SSL_CRLPATH</code>]]</td> <td>511</td> </tr><tr> <td>[[<code class="literal">MASTER_SSL_KEY</code>]]</td> <td>511</td> </tr><tr> <td>[[<code class="literal">MASTER_USER</code><code class="literal">MASTER_SSL_KEY</code>]</td> <td>511</td> </tr><tr> <td>[[<code class="literal">MASTER_TLS_VERSION</code>]]</td> <td>511</td> </tr></tbody></table>
