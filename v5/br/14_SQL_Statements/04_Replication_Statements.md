## 13.4 Declarações de Replicação

A replicação pode ser controlada através da interface SQL usando as declarações descritas nesta seção. As declarações são divididas em um grupo que controla os servidores de origem da replicação, um grupo que controla os servidores de replicação e um grupo que pode ser aplicado a qualquer servidor em uma topologia de replicação.

### 13.4.1 Esses são os comandos SQL para controlar os servidores de origem da replicação

Esta seção discute declarações para gerenciar servidores de origem de replicação. A Seção 13.4.2, “Declarações SQL para controle de servidores de replicação”, discute declarações para gerenciar servidores de replicação.

Além das declarações descritas aqui, as seguintes declarações `SHOW` são usadas com servidores de origem na replicação. Para obter informações sobre essas declarações, consulte a Seção 13.7.5, “Declarações SHOW”.

* `SHOW BINARY LOGS`
* `SHOW BINLOG EVENTS`
* `SHOW MASTER STATUS`
* `SHOW SLAVE HOSTS`

#### 13.4.1.1 Declaração de PURGE BINARY LOGS

```sql
PURGE { BINARY | MASTER } LOGS {
    TO 'log_name'
  | BEFORE datetime_expr
}
```

O log binário é um conjunto de arquivos que contêm informações sobre as modificações de dados feitas pelo servidor MySQL. O log consiste em um conjunto de arquivos de log binário, além de um arquivo de índice (consulte a Seção 5.4.4, “O Log Binário”).

A declaração `PURGE BINARY LOGS` exclui todos os arquivos de registro binários listados no arquivo de índice de registro antes do nome ou data especificada do arquivo de registro. `BINARY` e `MASTER` são sinônimos. Os arquivos de registro excluídos também são removidos da lista registrada no arquivo de índice, de modo que o arquivo de registro especificado se torna o primeiro na lista.

`PURGE BINARY LOGS` exige o privilégio `BINLOG_ADMIN`. Essa declaração não tem efeito se o servidor não foi iniciado com a opção `--log-bin` para habilitar o registro binário.

Exemplos:

```sql
PURGE BINARY LOGS TO 'mysql-bin.010';
PURGE BINARY LOGS BEFORE '2019-04-02 22:46:26';
```

O argumento *`datetime_expr`* da variante `BEFORE` deve ser avaliado para um valor de `DATETIME` (um valor no formato `'YYYY-MM-DD hh:mm:ss'`).

Essa declaração é segura para ser executada enquanto as réplicas estão replicando. Você não precisa interromper o processo. Se você tiver uma réplica ativa que atualmente está lendo um dos arquivos de registro que você está tentando excluir, essa declaração não exclui o arquivo de registro que está em uso ou quaisquer arquivos de registro posteriores a esse, mas exclui quaisquer arquivos de registro anteriores. Uma mensagem de aviso é emitida nessa situação. No entanto, se uma réplica não estiver conectada e você por acaso limpar um dos arquivos de registro que ela ainda não leu, a réplica não pode replicar após se reconectar.

Para limpar os arquivos de registro binários com segurança, siga este procedimento:

1. Em cada réplica, use `SHOW SLAVE STATUS` para verificar qual arquivo de registro está sendo lido.

2. Obtenha uma lista dos arquivos de registro binário no servidor de origem de replicação com `SHOW BINARY LOGS`.

3. Determine o arquivo de registro mais antigo entre todas as réplicas. Este é o arquivo alvo. Se todas as réplicas estiverem atualizadas, este é o último arquivo de registro na lista.

4. Faça um backup de todos os arquivos de registro que você está prestes a excluir. (Este passo é opcional, mas sempre aconselhável.)

5. Limpe todos os arquivos de registro até, mas não incluindo, o arquivo alvo.

Você também pode definir a variável de sistema `expire_logs_days` para expirar arquivos de log binários automaticamente após um número determinado de dias (consulte Seção 5.1.7, “Variáveis do Sistema do Servidor”). Se você estiver usando replicação, você deve definir a variável não inferior ao número máximo de dias em que suas réplicas podem ficar para trás em relação à fonte.

`PURGE BINARY LOGS TO` e `PURGE BINARY LOGS BEFORE` falham com um erro quando os arquivos de registro binários listados no arquivo `.index` foram removidos do sistema por outros meios (como o uso do **rm** no Linux). (Bug #18199, Bug #18453) Para lidar com tais erros, edite o arquivo `.index` (que é um arquivo de texto simples) manualmente para garantir que ele liste apenas os arquivos de registro binários que estão realmente presentes, e então execute novamente a declaração `PURGE BINARY LOGS` que falhou.

#### 13.4.1.2 Declaração de RESET MASTER

```sql
RESET MASTER
```

Aviso

Use esta declaração com cautela para garantir que você não perca nenhum dado de arquivo de registro binário desejado e histórico de execução do GTID.

`RESET MASTER` exige o privilégio `RELOAD`.

Para um servidor onde o registro binário está habilitado (`log_bin` é `ON`), `RESET MASTER` exclui todos os arquivos de registro binário existentes e refaz o arquivo do índice do registro binário, redefinindo o servidor ao seu estado antes do início do registro binário. Um novo arquivo de registro binário vazio é criado para que o registro binário possa ser reiniciado.

Para um servidor onde GTIDs estão em uso (`gtid_mode` é `ON`), emitir `RESET MASTER` refaz o histórico de execução do GTID. O valor da variável de sistema `gtid_purged` é definido como uma string vazia (`''`), o valor global (mas não o valor de sessão) da variável de sistema `gtid_executed` é definido como uma string vazia, e a tabela `mysql.gtid_executed` é limpa (ver tabela mysql.gtid_executed). Se o servidor habilitado para GTIDs tiver registro binário habilitado, `RESET MASTER` também refaz o registro binário conforme descrito acima. Note que `RESET MASTER` é o método para refazer o histórico de execução do GTID, mesmo que o servidor habilitado para GTIDs seja uma replica onde o registro binário está desativado; `RESET SLAVE` não tem efeito no histórico de execução do GTID. Para mais informações sobre a refaça do histórico de execução do GTID, consulte Refazendo o Histórico de Execução do GTID.

Importante

Os efeitos do `RESET MASTER` diferem dos do `PURGE BINARY LOGS` em 2 maneiras-chave:

1. `RESET MASTER` remove *todos* os arquivos de registro binários que estão listados no arquivo de índice, deixando apenas um único arquivo de registro binário vazio com um sufixo numérico de `.000001`, enquanto a numeração não é redefinida por `PURGE BINARY LOGS`.

2. `RESET MASTER` *não* deve ser usado enquanto houver réplicas em execução. O comportamento de `RESET MASTER` quando usado enquanto houver réplicas em execução é indefinido (e, portanto, não é suportado), enquanto `PURGE BINARY LOGS` pode ser usado com segurança enquanto houver réplicas em execução.

Veja também a Seção 13.4.1.1, “Declaração de PURGE BINARY LOGS”.

`RESET MASTER` pode ser útil quando você configura a fonte e a replica pela primeira vez, para que você possa verificar a configuração da seguinte forma:

1. Inicie a fonte e a replica, e inicie a replicação (consulte a Seção 16.1.2, “Configurando a replicação com base na posição do arquivo de registro binário”).

2. Execute algumas consultas de teste na fonte. 3. Verifique se as consultas foram replicadas para a replica. 4. Quando a replicação estiver funcionando corretamente, emita `STOP SLAVE` seguido de `RESET SLAVE` na replica, e, em seguida, verifique se quaisquer dados indesejados não existem mais na replica.

5. Emitir `RESET MASTER` sobre a fonte para limpar as consultas de teste.

Após verificar a configuração, reiniciar a fonte e a replica e garantir que nenhum dado indesejado ou arquivos de registro binário gerados durante o teste permaneçam na fonte ou na replica, você pode iniciar a replica e começar a replicar.

#### 13.4.1.3 Declaração sql_log_bin SET

```sql
SET sql_log_bin = {OFF|ON}
```

A variável `sql_log_bin` controla se o registro no log binário está habilitado para a sessão atual (assumindo que o próprio log binário está habilitado). O valor padrão é `ON`. Para desabilitar ou habilitar o registro binário para a sessão atual, defina a variável de sessão `sql_log_bin` para `OFF` ou `ON`.

Defina essa variável para `OFF` para uma sessão que desabilite temporariamente o registro binário enquanto faz alterações na fonte que você não deseja replicar para a replica.

Definir o valor da sessão desta variável do sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 5.1.8.1, “Privilégios da Variável do Sistema”.

Não é possível definir o valor da sessão de `sql_log_bin` dentro de uma transação ou subconsulta.

* Definir essa variável como `OFF` impede que GTIDs sejam atribuídos a transações no log binário. Se você está usando GTIDs para replicação, isso significa que, mesmo quando o registro binário é habilitado novamente, os GTIDs escritos no log a partir desse ponto não consideram quaisquer transações que ocorreram no meio do caminho, portanto, na prática, essas transações são perdidas.

A variável global `sql_log_bin` é somente de leitura e não pode ser modificada. O escopo global é desaconselhado; espere que ele seja removido em uma versão futura do MySQL.

### 13.4.2 Esses são os comandos SQL para controlar os servidores replicados

Esta seção discute declarações para gerenciamento de servidores replicados. A Seção 13.4.1, “Declarações SQL para Controle de Servidores de Fonte de Replicação”, discute declarações para gerenciamento de servidores de fonte.

Além das declarações descritas aqui, `SHOW SLAVE STATUS` e `SHOW RELAYLOG EVENTS` também são usadas com réplicas. Para informações sobre essas declarações, consulte a Seção 13.7.5.34, “Declaração SLAVE STATUS”, e a Seção 13.7.5.32, “Declaração SHOW RELAYLOG EVENTS”.

#### 13.4.2.1 Mudar o MASTER para a declaração

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

`CHANGE MASTER TO` altera os parâmetros que a réplica usa para se conectar ao servidor de origem de replicação, para ler o log binário da fonte e para ler o log de relevo da réplica. Também atualiza o conteúdo dos repositórios de metadados de replicação (consulte a Seção 16.2.4, “Repositórios de Log de Relevo e Metadados de Replicação”). `CHANGE MASTER TO` exige o privilégio `SUPER`.

Antes do MySQL 5.7.4, os threads de replicação devem ser interrompidos, usando `STOP SLAVE`, se necessário, antes de emitir essa declaração. No MySQL 5.7.4 e versões posteriores, você pode emitir declarações `CHANGE MASTER TO` em uma replica em execução sem fazer isso, dependendo dos estados do thread de SQL de replicação e do thread de I/O de replicação. As regras que regem esse uso são fornecidas mais adiante nesta seção.

Ao usar uma replica multithread (ou seja, `slave_parallel_workers` é maior que 0), parar a replica pode causar “lacunas” na sequência de transações que foram executadas a partir do log de relevo, independentemente de a replica ter sido parada intencionalmente ou de outra forma. Quando tais lacunas existem, emitir `CHANGE MASTER TO` falha. A solução para essa situação é emitir `START SLAVE UNTIL SQL_AFTER_MTS_GAPS` que garante que as lacunas sejam fechadas.

A cláusula opcional `FOR CHANNEL channel` permite que você nomeie qual canal de replicação a declaração se aplica. Fornecer uma cláusula `FOR CHANNEL channel` aplica a declaração `CHANGE MASTER TO` a um canal de replicação específico e é usada para adicionar um novo canal ou modificar um canal existente. Por exemplo, para adicionar um novo canal chamado channel2:

```sql
CHANGE MASTER TO MASTER_HOST=host1, MASTER_PORT=3002 FOR CHANNEL 'channel2'
```

Se nenhuma cláusula for nomeada e não houver canais extras, a declaração se aplica ao canal padrão.

Ao utilizar múltiplos canais de replicação, se uma declaração `CHANGE MASTER TO` não nomear um canal utilizando uma cláusula `FOR CHANNEL channel`, ocorre um erro. Consulte a Seção 16.2.2, “Canais de Replicação”, para obter mais informações.

As opções não especificadas mantêm seu valor, exceto conforme indicado na discussão a seguir. Assim, na maioria dos casos, não há necessidade de especificar opções que não mudam. Por exemplo, se a senha para se conectar ao servidor de fonte de replicação mudou, emita esta declaração para informar a réplica sobre a nova senha:

```sql
CHANGE MASTER TO MASTER_PASSWORD='new3cret';
```

`MASTER_HOST`, `MASTER_USER`, `MASTER_PASSWORD` e `MASTER_PORT` fornecem informações à réplica sobre como se conectar ao servidor de origem de replicação:

* `MASTER_HOST` e `MASTER_PORT` são o nome do host (ou endereço IP) do host mestre e sua porta TCP/IP.

Nota

A replicação não pode usar arquivos de socket Unix. Você deve ser capaz de se conectar ao servidor de origem de replicação usando TCP/IP.

Se você especificar a opção `MASTER_HOST` ou `MASTER_PORT`, a replica assume que a fonte é diferente da anterior (mesmo que o valor da opção seja o mesmo que seu valor atual). Neste caso, os valores antigos do nome e posição do arquivo de log binário da fonte são considerados não mais aplicáveis, portanto, se você não especificar `MASTER_LOG_FILE` e `MASTER_LOG_POS` na declaração, `MASTER_LOG_FILE=''` e `MASTER_LOG_POS=4` são anexados silenciosamente a ela.

Definir `MASTER_HOST=''` (ou seja, definir explicitamente seu valor para uma string vazia) *não* é o mesmo que não definir `MASTER_HOST` de forma alguma. A partir do MySQL 5.5, tentar definir `MASTER_HOST` para uma string vazia falha com um erro. Anteriormente, definir `MASTER_HOST` para uma string vazia fazia com que `START SLAVE` falhasse posteriormente. (Bug #28796)

Os valores usados para `MASTER_HOST` e outras opções de `CHANGE MASTER TO` são verificados quanto a caracteres de retorno de string (`\n` ou `0x0A`) e a presença desses caracteres nesses valores faz com que a declaração falhe com `ER_MASTER_INFO`. (Bug #11758581, Bug #50801)

* `MASTER_USER` e `MASTER_PASSWORD` são o nome de usuário e a senha da conta a ser usada para se conectar à fonte. Se você especificar `MASTER_PASSWORD`, `MASTER_USER` também é necessário. A senha usada para uma conta de usuário de replicação em uma declaração `CHANGE MASTER TO` é limitada a 32 caracteres de comprimento; antes do MySQL 5.7.5, se a senha fosse mais longa, a declaração teria sucesso, mas quaisquer caracteres em excesso seriam truncados silenciosamente. No MySQL 5.7.5 e posterior, tentar usar uma senha de mais de 32 caracteres faz com que `CHANGE MASTER TO` falhe. (Bug #11752299, Bug #43439)

É possível definir um nome de usuário vazio especificando `MASTER_USER=''`, mas o canal de replicação não pode ser iniciado com um nome de usuário vazio. Defina apenas um nome de usuário vazio `MASTER_USER` se você precisar limpar as credenciais anteriormente usadas dos repositórios da replicação por motivos de segurança e não tente usar o canal posteriormente.

O texto de uma declaração de `CHANGE MASTER TO`, incluindo os valores para `MASTER_USER` e `MASTER_PASSWORD`, pode ser visto na saída de uma declaração concorrente `SHOW PROCESSLIST`. (O texto completo de uma declaração de `START SLAVE` também é visível para `SHOW PROCESSLIST`.

Definir `MASTER_SSL=1` para uma conexão de replicação e, em seguida, não definir mais opções de `MASTER_SSL_xxx` corresponde a definir `--ssl-mode=REQUIRED` para o cliente, conforme descrito nas Opções de comando para conexões criptografadas. Com `MASTER_SSL=1`, a tentativa de conexão só tem sucesso se uma conexão criptografada puder ser estabelecida. Uma conexão de replicação não retorna a uma conexão não criptografada, portanto, não há definição correspondente ao ajuste `--ssl-mode=PREFERRED` para replicação. Se `MASTER_SSL=0` for definido, isso corresponde a `--ssl-mode=DISABLED`.

Importante

Para ajudar a prevenir ataques sofisticados de homem no meio, é importante que a replica verifique a identidade do servidor. Você pode especificar opções adicionais de `MASTER_SSL_xxx` para corresponder aos ajustes de `--ssl-mode=VERIFY_CA` e `--ssl-mode=VERIFY_IDENTITY`, que são uma escolha melhor do que o ajuste padrão para ajudar a prevenir esse tipo de ataque. Com esses ajustes, a replica verifica que o certificado do servidor é válido e verifica que o nome de host que a replica está usando corresponde à identidade no certificado do servidor. Para implementar um desses níveis de verificação, você deve primeiro garantir que o certificado da CA do servidor esteja disponível de forma confiável para a replica, caso contrário, problemas de disponibilidade resultarão. Por esse motivo, eles não são o ajuste padrão.

As opções `MASTER_SSL_xxx` e a opção `MASTER_TLS_VERSION` especificam como a replica usa criptografia e cifra para proteger a conexão de replicação. Essas opções podem ser alteradas mesmo em réplicas que são compiladas sem suporte SSL. Elas são salvas no repositório de metadados da fonte, mas são ignoradas se a replica não tiver o suporte SSL habilitado. As opções `MASTER_SSL_xxx` e `MASTER_TLS_VERSION` realizam as mesmas funções que as opções de cliente `--ssl-xxx` e `--tls-version` descritas em Opções de comando para conexões criptografadas. A correspondência entre os dois conjuntos de opções e o uso das opções `MASTER_SSL_xxx` e `MASTER_TLS_VERSION` para configurar uma conexão segura é explicado na Seção 16.3.8, “Configurando a replicação para usar conexões criptografadas”.

As opções `MASTER_HEARTBEAT_PERIOD`, `MASTER_CONNECT_RETRY` e `MASTER_RETRY_COUNT` controlam como a replica reconhece que a conexão com a fonte foi perdida e tenta reconectar.

* A variável de sistema `slave_net_timeout` especifica o número de segundos que a réplica espera por mais dados ou um sinal de batida de coração do fonte, antes que a réplica considere a conexão quebrada, abortem a leitura e tente se reconectar. O valor padrão é de 60 segundos (um minuto). Antes do MySQL 5.7.7, o valor padrão era de 3600 segundos (uma hora).

* O intervalo de batimento cardíaco, que interrompe o tempo de espera da conexão que ocorre na ausência de dados, se a conexão ainda estiver boa, é controlado pela opção `MASTER_HEARTBEAT_PERIOD`. Um sinal de batimento cardíaco é enviado para a réplica após esse número de segundos, e o período de espera é redefinido sempre que o log binário da fonte é atualizado com um evento. Os batimentos cardíacos são, portanto, enviados pela fonte apenas se não houver eventos não enviados no arquivo de log binário por um período maior que este. O intervalo de batimento cardíaco *`interval`* é um valor decimal com o intervalo de 0 a 4294967 segundos e uma resolução em milissegundos; o menor valor não nulo é 0,001. Definir *`interval`* para 0 desativa os batimentos cardíacos completamente. O intervalo de batimento cardíaco padrão é metade do valor da variável de sistema `slave_net_timeout`. Ele é registrado no repositório de metadados da fonte e mostrado na tabela do `replication_connection_configuration` do Schema de Desempenho.

* Antes do MySQL 5.7.4, a ausência de `MASTER_HEARTBEAT_PERIOD` fazia com que `CHANGE MASTER TO` redefinisse o intervalo de batimento cardíaco para o valor padrão (metade do valor da variável de sistema `slave_net_timeout`), e `Slave_received_heartbeats` para 0. O intervalo de batimento cardíaco não é mais redefinido, exceto pelo `RESET SLAVE`. (Bug #18185490)

* Observe que uma alteração no valor ou configuração padrão de `slave_net_timeout` não altera automaticamente o intervalo do batimento cardíaco, seja ele definido explicitamente ou utilizando um padrão previamente calculado. Um aviso é emitido se você definir `@@GLOBAL.slave_net_timeout` para um valor menor que o intervalo atual do batimento cardíaco. Se `slave_net_timeout` for alterado, você também deve emitir `CHANGE MASTER TO` para ajustar o intervalo do batimento cardíaco para um valor apropriado, de modo que o sinal do batimento cardíaco ocorra antes do tempo limite de conexão. Se você não fizer isso, o sinal do batimento cardíaco não terá efeito, e se nenhum dado for recebido da fonte, a replica pode realizar tentativas repetidas de reconexão, criando threads de dump zumbi.

* Se a réplica precisar se reconectar, a primeira tentativa de reconexão ocorre imediatamente após o tempo limite. `MASTER_CONNECT_RETRY` especifica o intervalo entre as tentativas de reconexão, e `MASTER_RETRY_COUNT` limita o número de tentativas de reconexão. Se as configurações padrão forem usadas, a réplica aguarda 60 segundos entre as tentativas de reconexão (`MASTER_CONNECT_RETRY=60`), e continua tentando se reconectar nessa taxa por 60 dias (`MASTER_RETRY_COUNT=86400`). Um valor de 0 para `MASTER_RETRY_COUNT` significa que não há limite no número de tentativas de reconexão, então a réplica continua tentando se reconectar indefinidamente. Esses valores são registrados no repositório de metadados da fonte e mostrados na tabela do `replication_connection_configuration` do Schema de Desempenho. `MASTER_RETRY_COUNT` substitui a opção de inicialização do servidor `--master-retry-count`.

`MASTER_DELAY` especifica quantos segundos o replica deve ficar para trás em relação à fonte. Um evento recebido da fonte não é executado até pelo menos *`interval`* segundos depois de sua execução na fonte. O padrão é 0. Um erro ocorre se *`interval`* não for um inteiro não negativo no intervalo de 0 a 231-1. Para mais informações, consulte a Seção 16.3.10, “Replicação Atrasa”.

A partir do MySQL 5.7, uma declaração `CHANGE MASTER TO` que emprega a opção `MASTER_DELAY` pode ser executada em uma replica em execução quando o thread SQL de replicação é interrompido.

`MASTER_BIND` é para uso em réplicas que possuem múltiplas interfaces de rede, e determina qual das interfaces de rede da réplica é escolhida para se conectar à fonte.

O endereço configurado com esta opção, se houver, pode ser visto na coluna `Master_Bind` do resultado do `SHOW SLAVE STATUS`. Se você estiver usando uma tabela para o repositório de metadados da fonte (servidor iniciado com `master_info_repository=TABLE`), o valor também pode ser visto na coluna `Master_bind` da tabela `mysql.slave_master_info`.

A capacidade de vincular uma replica a uma interface de rede específica também é suportada pelo NDB Cluster.

`MASTER_LOG_FILE` e `MASTER_LOG_POS` são as coordenadas nas quais a thread de I/O de replicação deve começar a ler a partir da fonte na próxima vez que a thread começa. `RELAY_LOG_FILE` e `RELAY_LOG_POS` são as coordenadas nas quais a thread de replicação SQL deve começar a ler a partir do log de relevo na próxima vez que a thread começa. Se você especificar alguma dessas opções, não pode especificar `MASTER_AUTO_POSITION = 1` (descrito mais tarde nesta seção). Se nenhuma das opções de `MASTER_LOG_FILE` ou `MASTER_LOG_POS` é especificada, a replica usa as últimas coordenadas da *thread de replicação SQL* antes que `CHANGE MASTER TO` foi emitida. Isso garante que não haja descontinuidade na replicação, mesmo que a thread de replicação SQL tenha sido atrasada em comparação com a thread de I/O de replicação, quando você simplesmente deseja alterar, por exemplo, a senha a ser usada.

A partir do MySQL 5.7, uma declaração `CHANGE MASTER TO` que emprega `RELAY_LOG_FILE`, `RELAY_LOG_POS` ou ambas as opções pode ser executada em uma replica em execução quando o thread SQL de replicação é interrompido. Antes do MySQL 5.7.4, `CHANGE MASTER TO` exclui todos os arquivos de log de relevo e inicia um novo, a menos que você especifique `RELAY_LOG_FILE` ou `RELAY_LOG_POS`. Nesse caso, os arquivos de log de relevo são mantidos; a variável global `relay_log_purge` é definida silenciosamente em 0. No MySQL 5.7.4 e posterior, os logs de relevo são preservados se pelo menos um dos threads SQL de replicação e o thread de I/O de replicação estiver em execução. Se ambos os threads forem interrompidos, todos os arquivos de log de relevo são excluídos, a menos que pelo menos um dos `RELAY_LOG_FILE` ou `RELAY_LOG_POS` seja especificado. Para o canal do aplicador de replicação de grupo (`group_replication_applier`), que tem apenas um thread SQL e nenhum thread de I/O, este é o caso se o thread SQL for interrompido, mas com esse canal você não pode usar as opções `RELAY_LOG_FILE` e `RELAY_LOG_POS`.

`RELAY_LOG_FILE` pode usar um caminho absoluto ou relativo e usa o mesmo nome de base que `MASTER_LOG_FILE`. (Bug #12190)

Quando o `MASTER_AUTO_POSITION = 1` é usado com o `CHANGE MASTER TO`, a replica tenta se conectar à fonte usando o recurso de autoposicionamento da replicação baseada em GTID, em vez de uma posição baseada em arquivo de log binário. A partir do MySQL 5.7, esta opção só pode ser empregada pelo `CHANGE MASTER TO` se o thread de SQL de replicação e o thread de I/O de replicação forem interrompidos. Tanto a replica quanto a fonte devem ter GTIDs habilitados (`GTID_MODE=ON`, `ON_PERMISSIVE,` ou `OFF_PERMISSIVE` na replica, e `GTID_MODE=ON` na fonte). O `MASTER_LOG_FILE`, `MASTER_LOG_POS`, `RELAY_LOG_FILE` e `RELAY_LOG_POS` não podem ser especificados juntamente com o `MASTER_AUTO_POSITION = 1`. Se a replicação de múltiplas fontes estiver habilitada na replica, é necessário definir a opção `MASTER_AUTO_POSITION = 1` para cada canal de replicação aplicável.

Com `MASTER_AUTO_POSITION = 1` definido, na mão de aperto inicial da conexão, a replica envia um GTID definido contendo as transações que ela já recebeu, comprometeu ou ambas. A fonte responde enviando todas as transações registradas em seu log binário cujos GTID não estão incluídos no GTID definido enviado pela replica. Essa troca garante que a fonte só envie as transações com um GTID que a replica não tenha registrado ou comprometido já. Se a replica receber transações de mais de uma fonte, como no caso de uma topologia de diamante, a função de auto-salto garante que as transações não sejam aplicadas duas vezes. Para detalhes sobre como o GTID definido enviado pela replica é calculado, consulte a Seção 16.1.3.3, “Posicionamento Automático do GTID”.

Se alguma das transações que devem ser enviadas pela fonte tiver sido eliminada do log binário da fonte ou adicionada ao conjunto de GTIDs na variável de sistema `gtid_purged`, por outro método, a fonte envia o erro `ER_MASTER_HAS_PURGED_REQUIRED_GTIDS` para a replica, e a replicação não é iniciada. Além disso, se durante a troca de transações for descoberto que a replica gravou ou comprometeu transações com o UUID da fonte no GTID, mas a fonte não as comprometeu, a fonte envia o erro `ER_SLAVE_HAS_MORE_GTIDS_THAN_MASTER` para a replica e a replicação não é iniciada. Para informações sobre como lidar com essas situações, consulte a Seção 16.1.3.3, “Autoposicionamento GTID”.

`IGNORE_SERVER_IDS` recebe uma lista de IDs de servidor separados por vírgula de 0 ou mais servidores. Eventos originados nos servidores correspondentes são ignorados, com exceção dos eventos de rotação e exclusão de logs, que ainda são registrados no log do relé.

Na replicação circular, o servidor de origem normalmente atua como o terminador de seus próprios eventos, para que eles não sejam aplicados mais de uma vez. Assim, esta opção é útil na replicação circular quando um dos servidores no círculo é removido. Suponha que você tenha uma configuração de replicação circular com 4 servidores, tendo IDs de servidor 1, 2, 3 e 4, e o servidor 3 falha. Ao preencher a lacuna iniciando a replicação do servidor 2 para o servidor 4, você pode incluir `IGNORE_SERVER_IDS = (3)` na declaração `CHANGE MASTER TO` que você emite no servidor 4 para dizer que ele deve usar o servidor 2 como sua fonte em vez do servidor 3. Isso faz com que ele ignore e não propague quaisquer declarações que tenham origem com o servidor que não está mais em uso.

Se uma declaração `CHANGE MASTER TO` for emitida sem qualquer opção `IGNORE_SERVER_IDS`, qualquer lista existente será preservada. Para limpar a lista de servidores ignorados, é necessário usar a opção com uma lista vazia:

```sql
CHANGE MASTER TO IGNORE_SERVER_IDS = ();
```

Antes do MySQL 5.7.5, `RESET SLAVE ALL` não tem efeito na lista de IDs do servidor. No MySQL 5.7.5 e versões posteriores, `RESET SLAVE ALL` limpa `IGNORE_SERVER_IDS`. (Bug #18816897)

Se o `IGNORE_SERVER_IDS` contiver a própria ID do servidor e o servidor foi iniciado com a opção `--replicate-same-server-id` habilitada, um erro resulta.

O repositório de metadados de origem e a saída de `SHOW SLAVE STATUS` fornecem a lista dos servidores que estão atualmente ignorados. Para mais informações, consulte a Seção 16.2.4.2, “Repositórios de Metadados de Replicação”, e a Seção 13.7.5.34, “Declaração SHOW SLAVE STATUS”.

Invocar `CHANGE MASTER TO` faz com que os valores anteriores para `MASTER_HOST`, `MASTER_PORT`, `MASTER_LOG_FILE` e `MASTER_LOG_POS` sejam escritos no log de erro, juntamente com outras informações sobre o estado da replica antes da execução.

`CHANGE MASTER TO` causa um compromisso implícito de uma transação em andamento. Veja a Seção 13.3.3, “Declarações que causam um compromisso implícito”.

Em MySQL 5.7.4 e versões posteriores, a exigência estrita de executar `STOP SLAVE` antes de emitir qualquer declaração `CHANGE MASTER TO` (e `START SLAVE` posteriormente) é removida. Em vez de depender se a replica está parada, o comportamento de `CHANGE MASTER TO` depende (em MySQL 5.7.4 e versões posteriores) dos estados do thread de SQL de replicação e do thread de I/O de replicação; qual desses threads está parado ou em execução agora determina as opções que podem ou não ser usadas com uma declaração `CHANGE MASTER TO` em um determinado momento. As regras para fazer essa determinação estão listadas aqui:

* Se o thread SQL estiver parado, você pode executar `CHANGE MASTER TO` usando qualquer combinação que, de outra forma, seja permitida das opções `RELAY_LOG_FILE`, `RELAY_LOG_POS` e `MASTER_DELAY`, mesmo que o thread de I/O de replicação esteja em execução. Nenhuma outra opção pode ser usada com essa declaração quando o thread de I/O estiver em execução.

* Se o thread de I/O estiver parado, você pode executar `CHANGE MASTER TO` usando qualquer uma das opções para essa declaração (em qualquer combinação permitida) *exceto* `RELAY_LOG_FILE`, `RELAY_LOG_POS`, `MASTER_DELAY` ou `MASTER_AUTO_POSITION = 1`, mesmo quando o thread de SQL estiver em execução.

* Tanto o thread SQL quanto o thread de E/S devem ser interrompidos antes de emitir uma declaração `CHANGE MASTER TO` que emprega `MASTER_AUTO_POSITION = 1`.

Você pode verificar o estado atual do thread de replicação SQL e do thread de I/O de replicação usando `SHOW SLAVE STATUS`. Observe que o canal do aplicativo de replicação de grupo (`group_replication_applier`) não tem um thread de I/O, apenas um thread SQL.

Para mais informações, consulte a Seção 16.3.7, “Alteração de fontes durante o failover”.

Se você estiver usando replicação baseada em declarações e tabelas temporárias, é possível que uma declaração `CHANGE MASTER TO` após uma declaração `STOP SLAVE` deixe tabelas temporárias no replica. A partir do MySQL 5.7, um aviso (`ER_WARN_OPEN_TEMP_TABLES_MUST_BE_ZERO`) é emitido sempre que isso ocorre. Você pode evitar isso nesses casos, garantindo que o valor da variável de status do sistema `Slave_open_temp_tables` seja igual a 0 antes de executar tal declaração `CHANGE MASTER TO`.

`CHANGE MASTER TO` é útil para configurar uma replica quando você tem o instantâneo do servidor de origem de replicação e registrou as coordenadas do log binário da fonte correspondentes ao momento do instantâneo. Após carregar o instantâneo na replica para sincronizá-la com a fonte, você pode executar `CHANGE MASTER TO MASTER_LOG_FILE='log_name', MASTER_LOG_POS=log_pos` na replica para especificar as coordenadas nas quais a replica deve começar a ler o log binário da fonte.

O exemplo a seguir altera o servidor de origem da replicação que a réplica usa e estabelece as coordenadas do log binário da fonte a partir das quais a réplica começa a ler. Isso é usado quando você deseja configurar a réplica para replicar a fonte:

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

O próximo exemplo mostra uma operação que é empregada com menos frequência. É usada quando a replica tem arquivos de registro de relevo que você deseja que ela execute novamente por algum motivo. Para fazer isso, a fonte não precisa ser acessível. Você só precisa usar `CHANGE MASTER TO` e iniciar o thread SQL (`START SLAVE SQL_THREAD`):

```sql
CHANGE MASTER TO
  RELAY_LOG_FILE='replica-relay-bin.006',
  RELAY_LOG_POS=4025;
```

A tabela a seguir mostra o comprimento máximo permitido para as opções de valor de cadeia.

<table summary="The maximum permissible length for CHANGE MASTER TO string-valued options."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Option</th> <th>Maximum Length</th> </tr></thead><tbody><tr> <td><code>MASTER_HOST</code></td> <td>60</td> </tr><tr> <td><code>MASTER_USER</code></td> <td>96</td> </tr><tr> <td><code>MASTER_PASSWORD</code></td> <td>32</td> </tr><tr> <td><code>MASTER_LOG_FILE</code></td> <td>511</td> </tr><tr> <td><code>RELAY_LOG_FILE</code></td> <td>511</td> </tr><tr> <td><code>MASTER_SSL_CA</code></td> <td>511</td> </tr><tr> <td><code>MASTER_SSL_CAPATH</code></td> <td>511</td> </tr><tr> <td><code>MASTER_SSL_CERT</code></td> <td>511</td> </tr><tr> <td><code>MASTER_SSL_CRL</code></td> <td>511</td> </tr><tr> <td><code>MASTER_SSL_CRLPATH</code></td> <td>511</td> </tr><tr> <td><code>MASTER_SSL_KEY</code></td> <td>511</td> </tr><tr> <td><code>MASTER_SSL_CIPHER</code></td> <td>511</td> </tr><tr> <td><code>MASTER_TLS_VERSION</code></td> <td>511</td> </tr></tbody></table>

#### 13.4.2.2 Filtro de Replicação de Alterações
#### 13.4.2.3 Declaração de Filtro de Replicação de Alterações

```sql
CHANGE REPLICATION FILTER filter[, filter][, ...]

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
    db_name.table_name[, db_table_name][, ...]
wild_tbl_list:
    'db_pattern.table_pattern'[, 'db_pattern.table_pattern'][, ...]

db_pair_list:
    (db_pair)[, (db_pair)][, ...]

db_pair:
    from_db, to_db
```

`CHANGE REPLICATION FILTER` define uma ou mais regras de filtragem de replicação no replica no mesmo modo em que se inicia a replica `mysqld` com opções de filtragem de replicação, como `--replicate-do-db` ou `--replicate-wild-ignore-table`. Os filtros definidos usando esta declaração diferem daqueles definidos usando as opções do servidor em dois aspectos-chave:

1. A declaração não exige o reinício do servidor para entrar em vigor, apenas que o thread de replicação SQL seja parado usando `STOP SLAVE SQL_THREAD` primeiro (e reiniciado com `START SLAVE SQL_THREAD` depois).

2. Os efeitos da declaração não são persistentes; quaisquer filtros definidos usando `CHANGE REPLICATION FILTER` são perdidos após o reinício da replica `mysqld`.

`CHANGE REPLICATION FILTER` exige o privilégio `SUPER`.

Nota

Os filtros de replicação não podem ser configurados em uma instância do servidor MySQL configurada para Replicação por Grupo, porque filtrar as transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente.

A lista a seguir mostra as opções do `CHANGE REPLICATION FILTER` e como elas se relacionam com as opções do servidor `--replicate-*`:

* `REPLICATE_DO_DB`: Inclua atualizações com base no nome do banco de dados. É equivalente a `--replicate-do-db`.

* `REPLICATE_IGNORE_DB`: Exclua atualizações com base no nome do banco de dados. É equivalente a `--replicate-ignore-db`.

* `REPLICATE_DO_TABLE`: Inclua atualizações com base no nome da tabela. É equivalente a `--replicate-do-table`.

* `REPLICATE_IGNORE_TABLE`: Exclua atualizações com base no nome da tabela. É equivalente a `--replicate-ignore-table`.

* `REPLICATE_WILD_DO_TABLE`: Inclua atualizações com base no nome da tabela de correspondência de padrões de caracteres curinga. É equivalente a `--replicate-wild-do-table`.

* `REPLICATE_WILD_IGNORE_TABLE`: Exclua atualizações com base no nome da tabela de correspondência de padrões de caractere. É equivalente a `--replicate-wild-ignore-table`.

* `REPLICATE_REWRITE_DB`: Realize atualizações na replica após substituir o novo nome na replica pelo banco de dados especificado na fonte. É equivalente a `--replicate-rewrite-db`.

Os efeitos precisos dos filtros `REPLICATE_DO_DB` e `REPLICATE_IGNORE_DB` dependem do fato de que a replicação baseada em declarações ou baseada em strings esteja em vigor. Consulte a Seção 16.2.5, “Como os servidores avaliam as regras de filtragem de replicação”, para obter mais informações.

Várias regras de filtragem de replicação podem ser criadas em uma única declaração `CHANGE REPLICATION FILTER` ao separar as regras com vírgulas, como mostrado aqui:

```sql
CHANGE REPLICATION FILTER
    REPLICATE_DO_DB = (d1), REPLICATE_IGNORE_DB = (d2);
```

Emitir a declaração mostrada acima é equivalente a iniciar a réplica `mysqld` com as opções `--replicate-do-db=d1` `--replicate-ignore-db=d2`.

Se a mesma regra de filtragem for especificada várias vezes, apenas a *última* regra é usada. Por exemplo, as duas declarações mostradas aqui têm exatamente o mesmo efeito, porque a primeira regra `REPLICATE_DO_DB` na primeira declaração é ignorada:

```sql
CHANGE REPLICATION FILTER
    REPLICATE_DO_DB = (db1, db2), REPLICATE_DO_DB = (db3, db4);

CHANGE REPLICATION FILTER
    REPLICATE_DO_DB = (db3,db4);
```

Cuidado

Esse comportamento difere da opção de filtro `--replicate-*`, onde especificar a mesma opção várias vezes causa a criação de múltiplas regras de filtro.

Os nomes de tabelas e bancos de dados que não contenham caracteres especiais não precisam ser citados. Os valores usados com `REPLICATION_WILD_TABLE` e `REPLICATION_WILD_IGNORE_TABLE` são expressões de string, possivelmente contendo (caracteres) caracteres de comodinho (wildcards), e, portanto, devem ser citados. Isso é mostrado nas seguintes declarações de exemplo:

```sql
CHANGE REPLICATION FILTER
    REPLICATE_WILD_DO_TABLE = ('db1.old%');

CHANGE REPLICATION FILTER
    REPLICATE_WILD_IGNORE_TABLE = ('db1.new%', 'db2.new%');
```

Os valores usados com `REPLICATE_REWRITE_DB` representam *pares* de nomes de banco de dados; cada um desses valores deve ser fechado entre parênteses. A seguinte declaração reescreve as declarações que ocorrem no banco de dados `db1` na fonte para o banco de dados `db2` na replica:

```sql
CHANGE REPLICATION FILTER REPLICATE_REWRITE_DB = ((db1, db2));
```

A declaração que acabou de ser mostrada contém dois conjuntos de parênteses, um envolvendo o par de nomes de banco de dados e o outro envolvendo toda a lista. Isso é talvez mais facilmente visto no exemplo seguinte, que cria duas regras `rewrite-db`, uma reescrevendo o banco de dados `dbA` para `dbB`, e outra reescrevendo o banco de dados `dbC` para `dbD`:

```sql
CHANGE REPLICATION FILTER
  REPLICATE_REWRITE_DB = ((dbA, dbB), (dbC, dbD));
```

Essa declaração não altera as regras de filtragem de replicação existentes; para desativar todos os filtros de um determinado tipo, defina o valor do filtro em uma lista explicitamente vazia, conforme mostrado neste exemplo, que remove todas as regras existentes de `REPLICATE_DO_DB` e `REPLICATE_IGNORE_DB`:

```sql
CHANGE REPLICATION FILTER
    REPLICATE_DO_DB = (), REPLICATE_IGNORE_DB = ();
```

Definir um filtro para ser vazio dessa maneira remove todas as regras existentes, não cria nenhuma nova e não restaura nenhuma regra definida na inicialização do mysqld usando as opções `--replicate-*` na string de comando ou no arquivo de configuração.

Os valores utilizados com `REPLICATE_WILD_DO_TABLE` e `REPLICATE_WILD_IGNORE_TABLE` devem estar no formato `db_name.tbl_name`. Antes do MySQL 5.7.5, isso não era rigorosamente aplicado, embora o uso de valores não conformes com essas opções possa levar a resultados errados (Bug #18095449).

Para mais informações, consulte a Seção 16.2.5, “Como os servidores avaliam as regras de filtragem de replicação”.

#### 13.4.2.3 Declaração de RESET SLAVE

```sql
RESET SLAVE [ALL] [channel_option]

channel_option:
    FOR CHANNEL channel
```

`RESET SLAVE` faz com que a replica esqueça sua posição de replicação no log binário da fonte. Esta declaração é destinada a ser usada para um início limpo: ela limpa os repositórios de metadados de replicação, exclui todos os arquivos de log de releio e inicia um novo arquivo de log de releio. Ela também redefere para 0 o atraso de replicação especificado com a opção `MASTER_DELAY` para `CHANGE MASTER TO`.

Nota

Todos os arquivos de registro do relé são excluídos, mesmo que não tenham sido completamente executados pelo thread de replicação do SQL. (Essa é uma condição que provavelmente existe em uma replica se você tiver emitido uma declaração `STOP SLAVE` ou se a replica estiver altamente carregada.)

Para um servidor onde GTIDs estão em uso (`gtid_mode` é `ON`), emitir `RESET SLAVE` não afeta o histórico de execução do GTID. A declaração não altera os valores de `gtid_executed` ou `gtid_purged`, ou a tabela `mysql.gtid_executed`. Se você precisar redefinir o histórico de execução do GTID, use `RESET MASTER`, mesmo que o servidor habilitado para GTID seja uma replica onde o registro binário está desativado.

`RESET SLAVE` exige o privilégio `RELOAD`.

Para usar `RESET SLAVE`, as threads de replicação devem ser interrompidas, portanto, em uma replica em execução, use `STOP SLAVE` antes de emitir `RESET SLAVE`. Para usar `RESET SLAVE` em um membro do grupo de replicação em grupo, o status do membro deve ser `OFFLINE`, o que significa que o plugin está carregado, mas o membro atualmente não pertence a nenhum grupo. Um membro do grupo pode ser desativado usando uma declaração `STOP GROUP REPLICATION`.

A cláusula opcional `FOR CHANNEL channel` permite que você nomeie qual canal de replicação a declaração se aplica. A inclusão da cláusula `FOR CHANNEL channel` aplica a declaração `RESET SLAVE` a um canal de replicação específico. Combinar a cláusula `FOR CHANNEL channel` com a opção `ALL` exclui o canal especificado. Se nenhum canal estiver nomeado e não houver canais adicionais, a declaração se aplica ao canal padrão. Emitir uma declaração `RESET SLAVE ALL` sem a cláusula `FOR CHANNEL channel` quando existem vários canais de replicação exclui *todos* os canais de replicação e recria apenas o canal padrão. Consulte a Seção 16.2.2, “Canais de Replicação”, para obter mais informações.

`RESET SLAVE` não altera nenhum parâmetro de conexão de replicação, como o nome do host da fonte e a porta, ou o nome da conta de usuário de replicação e sua senha.

* A partir do MySQL 5.7.24, quando `master_info_repository=TABLE` é definido no servidor, os parâmetros de conexão de replicação são preservados na tabela `InnoDB` resistente a falhas `mysql.slave_master_info` como parte da operação `RESET SLAVE`. Eles também são retidos na memória. No caso de uma saída inesperada do servidor ou reinício deliberado após a emissão de `RESET SLAVE`, mas antes de emitir `START SLAVE`, os parâmetros de conexão de replicação são recuperados da tabela e reutilizados para a nova conexão.

* Quando `master_info_repository=FILE` é definido no servidor (o que é o padrão no MySQL 5.7), os parâmetros de conexão de replicação são mantidos apenas na memória. Se a replica `mysqld` for reiniciada imediatamente após a emissão de `RESET SLAVE` devido a uma saída inesperada do servidor ou reinício deliberado, os parâmetros de conexão são perdidos. Nesse caso, você deve emitir uma declaração `CHANGE MASTER TO` após o início do servidor para respeificar os parâmetros de conexão antes de emitir `START SLAVE`.

Se você deseja redefinir os parâmetros de conexão intencionalmente, você precisa usar `RESET SLAVE ALL`, que limpa os parâmetros de conexão. Nesse caso, você deve emitir uma declaração `CHANGE MASTER TO` após o início do servidor para especificar os novos parâmetros de conexão.

`RESET SLAVE` causa um compromisso implícito de uma transação em andamento. Veja a Seção 13.3.3, “Declarações que causam um compromisso implícito”.

Se o thread de replicação SQL estivesse em meio à replicação de tabelas temporárias quando foi interrompido e `RESET SLAVE` for emitido, essas tabelas temporárias replicadas serão excluídas na réplica.

Antes do MySQL 5.7.5, `RESET SLAVE` também tinha o efeito de redefinir tanto o período do batimento cardíaco (`Slave_heartbeat_period`) quanto `SSL_VERIFY_SERVER_CERT`. Esse problema é corrigido no MySQL 5.7.5 e versões posteriores. (Bug #18777899, Bug #18778485)

Antes do MySQL 5.7.5, `RESET SLAVE ALL` não limpava a lista `IGNORE_SERVER_IDS` definida por `CHANGE MASTER TO`. No MySQL 5.7.5 e versões posteriores, a declaração limpa a lista. (Bug #18816897)

Nota

Quando usado em um nó de replicação do NDB Cluster, o `RESET SLAVE` limpa a tabela `mysql.ndb_apply_status`. Você deve ter em mente ao usar essa declaração que o `ndb_apply_status` usa o mecanismo de armazenamento `NDB` e, portanto, é compartilhado por todos os nós SQL conectados ao clúster de replicação.

Você pode sobrepor esse comportamento emitindo `SET` `GLOBAL @@` `ndb_clear_apply_status=OFF` antes de executar `RESET SLAVE`, o que impede que a replica apague a tabela `ndb_apply_status` nesses casos.

#### 13.4.2.4 Sintaxe do contador de pular sql_slave_ em nível global SET

```sql
SET GLOBAL sql_slave_skip_counter = N
```

Esta declaração omite os próximos eventos *`N`* do mestre. Isso é útil para recuperar de paradas de replicação causadas por uma declaração.

Essa declaração é válida apenas quando os threads escravos não estão em execução. Caso contrário, ela produz um erro.

Ao usar essa declaração, é importante entender que o log binário é, na verdade, organizado como uma sequência de grupos conhecidos como grupos de eventos. Cada grupo de eventos consiste em uma sequência de eventos.

* Para tabelas transacionais, um grupo de eventos corresponde a uma transação.

* Para tabelas não transacionais, um grupo de eventos corresponde a uma única instrução SQL.

Nota

Uma única transação pode conter alterações em tabelas tanto transacionais quanto não transacionais.

Quando você usa `SET GLOBAL sql_slave_skip_counter` para pular eventos e o resultado está no meio de um grupo, o escravo continua a pular eventos até atingir o final do grupo. A execução então começa com o próximo grupo de eventos.

#### 13.4.2.5 Declaração de Início de Escravo

```sql
START SLAVE [thread_types] [until_option] [connection_options] [channel_option]

thread_types:
    [thread_type [, thread_type] ... ]

thread_type:
    IO_THREAD | SQL_THREAD

until_option:
    UNTIL {   {SQL_BEFORE_GTIDS | SQL_AFTER_GTIDS} = gtid_set
          |   MASTER_LOG_FILE = 'log_name', MASTER_LOG_POS = log_pos
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

`START SLAVE` inicia as threads de replicação, juntas ou separadamente. A declaração requer o privilégio `SUPER`. `START SLAVE` causa um compromisso implícito de uma transação em andamento (consulte Seção 13.3.3, “Declarações que causam um compromisso implícito”).

Para as opções de tipo de thread, você pode especificar `IO_THREAD`, `SQL_THREAD`, ambos, ou nenhum deles. Apenas os threads que estão sendo iniciados são afetados pela declaração.

* `START SLAVE` sem opções de tipo de thread inicia todas as threads de replicação, assim como `START SLAVE` com ambas as opções de tipo de thread.

* `IO_THREAD` inicia o thread do receptor de replicação, que lê eventos do servidor fonte e os armazena no log de relevo.

* `SQL_THREAD` inicia o thread do aplicador de replicação, que lê eventos do log do relé e os executa. Uma replica multithread (com `slave_parallel_workers` > 0) aplica transações usando um thread de coordenador e vários threads de aplicador, e `SQL_THREAD` inicia todos esses.

Importante

`START SLAVE` envia um reconhecimento ao usuário após todas as threads de replicação terem sido iniciadas. No entanto, o thread receptor de replicação ainda pode não ter se conectado ao ponto de origem com sucesso, ou um thread aplicando pode parar ao aplicar um evento logo após o início. `START SLAVE` não continua a monitorar as threads após elas terem sido iniciadas, portanto, não o alerta se elas pararem ou não conseguirem se conectar posteriormente. Você deve verificar o log de erro da replica para mensagens de erro geradas pelas threads de replicação, ou verificar se elas estão sendo executadas satisfatoriamente com `SHOW SLAVE STATUS`. Uma declaração `START SLAVE` bem-sucedida faz com que `SHOW SLAVE STATUS` mostre `Slave_SQL_Running=Yes`, mas pode ou não mostrar `Slave_IO_Running=Yes`, porque `Slave_IO_Running=Yes` é mostrado apenas se o thread receptor estiver em execução e conectado. Para mais informações, consulte a Seção 16.1.7.1, “Verificação do Status de Replicação”.

A cláusula opcional `FOR CHANNEL channel` permite que você nomeie qual canal de replicação a declaração se aplica. A inclusão da cláusula `FOR CHANNEL channel` aplica a declaração `START SLAVE` a um canal de replicação específico. Se nenhuma cláusula for nomeada e não houver canais extras, a declaração se aplica ao canal padrão. Se uma declaração `START SLAVE` não tiver um canal definido ao usar vários canais, esta declaração inicia os threads especificados para todos os canais. Consulte a Seção 16.2.2, “Canais de Replicação”, para obter mais informações.

Os canais de replicação para a Replicação de Grupo (`group_replication_applier` e `group_replication_recovery`) são gerenciados automaticamente pela instância do servidor. O único canal de Replicação de Grupo com o qual você pode interagir é o canal `group_replication_applier`. Esse canal tem apenas um thread de aplicador e não tem thread de receptor, portanto, ele pode ser iniciado usando a opção `SQL_THREAD` sem a opção `IO_THREAD`. O `START SLAVE` não pode ser usado de forma alguma com o canal `group_replication_recovery`.

O `START SLAVE` suporta autenticação de usuário e senha intercambiável (consulte a Seção 6.2.13, “Autenticação Intercambiável”) com as opções `USER`, `PASSWORD`, `DEFAULT_AUTH` e `PLUGIN_DIR`, conforme descrito na lista a seguir. Ao usar essas opções, você deve iniciar o thread do receptor (opção `IO_THREAD`), ou todos os threads de replicação; não pode iniciar o thread do aplicável de replicação (opção `SQL_THREAD` sozinho.

`USER` :   O nome do usuário para a conta. Você deve definir isso se `PASSWORD` for usado. A opção não pode ser definida como uma string vazia ou nula.

`PASSWORD` :   A senha para a conta de usuário nomeada.

`DEFAULT_AUTH` :   O nome do plugin de autenticação. O padrão é a autenticação nativa do MySQL.

`PLUGIN_DIR` :   Localização do plugin de autenticação.

Importante

A senha que você definiu usando `START SLAVE` é mascarada quando é escrita nos logs do MySQL Server, nas tabelas do Gerenciador de desempenho e nas instruções `SHOW PROCESSLIST`. No entanto, ela é enviada em texto plano sobre a conexão com a instância do servidor replica. Para proteger a senha em trânsito, use criptografia SSL/TLS, um túnel SSH ou outro método para proteger a conexão de visualização não autorizada, para a conexão entre a instância do servidor replica e o cliente que você usa para emitir `START SLAVE`.

A cláusula `UNTIL` faz com que a replica comece a replicar, processando as transações até o ponto que você especifica na cláusula `UNTIL`, e depois pare novamente. A cláusula `UNTIL` pode ser usada para fazer com que a replica prossiga até pouco antes do ponto em que você deseja pular uma transação indesejada, e depois pule a transação conforme descrito na Seção 16.1.7.3, “Pular Transações”. Para identificar uma transação, você pode usar **mysqlbinlog** com o log binário da fonte ou o log de relevo da replica, ou usar uma declaração `SHOW BINLOG EVENTS`.

Você também pode usar a cláusula `UNTIL` para depuração da replicação, processando transações uma de cada vez ou em seções. Se você estiver usando a cláusula `UNTIL` para fazer isso, inicie a replica com a opção `--skip-slave-start` para evitar que o thread do SQL seja executado quando o servidor de replicação for iniciado. Remova a opção após o procedimento ser concluído, para que não seja esquecida em caso de reinício inesperado do servidor.

A declaração `SHOW SLAVE STATUS` inclui campos de saída que exibem os valores atuais da condição `UNTIL`. A condição `UNTIL` dura enquanto os threads afetados ainda estão em execução e é removida quando eles param.

A cláusula `UNTIL` opera na thread do aplicador de replicação (opção `SQL_THREAD`). Você pode usar a opção `SQL_THREAD` ou deixar a replica padrão para iniciar ambos os threads. Se você usar a opção `IO_THREAD` sozinha, a cláusula `UNTIL` é ignorada porque a thread do aplicador não é iniciada.

O ponto que você especifica na cláusula `UNTIL` pode ser uma das seguintes opções (e apenas uma delas):

`SOURCE_LOG_FILE` e `SOURCE_LOG_POS` : Essas opções fazem com que o processo de aplicação de replicação transfira transações até uma posição em seu log de relevo, identificada pelo nome do arquivo e pela posição do arquivo do ponto correspondente no log binário no servidor de origem. O thread de aplicação encontra o limite de transação mais próximo em ou após a posição especificada, termina a aplicação da transação e para ali.

`RELAY_LOG_FILE` e `RELAY_LOG_POS` : Essas opções fazem com que o processo de aplicação de replicação transfira transações até uma posição no log de relevo da replica, identificada pelo nome do arquivo do log de relevo e uma posição nesse arquivo. O thread do aplicável encontra o limite de transação mais próximo em ou após a posição especificada, termina a aplicação da transação e para ali.

`SQL_BEFORE_GTIDS` :   Essa opção faz com que o aplicativo de replicação comece a processar as transações e pare quando encontrar qualquer transação que esteja no conjunto especificado de GTID. A transação encontrada no conjunto de GTID não é aplicada, assim como nenhuma das outras transações no conjunto de GTID. A opção recebe um conjunto de GTID que contém um ou mais identificadores de transação global como argumento (consulte Conjuntos de GTID). As transações em um conjunto de GTID não aparecem necessariamente na corrente de replicação na ordem de seus GTIDs, então a transação antes da qual o aplicativo pára não é necessariamente a mais antiga.

`SQL_AFTER_GTIDS` :   Essa opção faz com que o aplicativo de replicação comece a processar transações e pare quando tiver processado todas as transações em um conjunto especificado de GTID. A opção recebe um conjunto de GTID contendo um ou mais identificadores de transação global como argumento (consulte Conjuntos de GTID).

Com `SQL_AFTER_GTIDS`, os threads de replicação param após terem processado todas as transações no conjunto GTID. As transações são processadas na ordem recebida, portanto, é possível que essas transações incluam aquelas que não fazem parte do conjunto GTID, mas que são recebidas (e processadas) antes de todas as transações do conjunto terem sido comprometidas. Por exemplo, a execução de `START SLAVE UNTIL SQL_AFTER_GTIDS = 3E11FA47-71CA-11E1-9E33-C80AA9429562:11-56` faz com que a replica obtenha (e processe) todas as transações da fonte até que todas as transações com os números de sequência de 11 a 56 tenham sido processadas, e então pare sem processar quaisquer transações adicionais após esse ponto ter sido alcançado.

`SQL_AFTER_GTIDS` não é compatível com escravos multi-threaded. Se esta opção for usada com um escravo multi-threaded, um aviso é exibido e o escravo muda para o modo de thread único. Dependendo do caso de uso, pode ser possível usar `START SLAVE UNTIL MASTER_LOG_POS` ou `START SLAVE UNTIL SQL_BEFORE_GTIDS` em vez disso. Você também pode usar `WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()`, que espera até que a posição correta seja alcançada, mas não para o thread do escravo.

`SQL_AFTER_MTS_GAPS` :   Apenas para uma replica multithreading (com `slave_parallel_workers` > 0), esta opção faz com que o processo de replicação execute transações até o ponto em que não haja mais lacunas na sequência de transações executadas a partir do log de relevo. Ao usar uma replica multithreading, há uma chance de lacunas ocorrerem nas seguintes situações:

* O thread do coordenador é interrompido.
* Um erro ocorre nos threads do aplicador.
* `mysqld` é desligado inesperadamente.

Quando um canal de replicação tem lacunas, o banco de dados da replica está em um estado que nunca teria existido na fonte. A replica rastreia as lacunas internamente e não permite as declarações `CHANGE MASTER TO` que removeriam as informações da lacuna se fossem executadas.

A emissão de `START SLAVE` em uma replica multithread com lacunas na sequência de transações executadas a partir do log de relevo gera um aviso. Para corrigir essa situação, a solução é usar `START SLAVE UNTIL SQL_AFTER_MTS_GAPS`. Consulte a Seção 16.4.1.32, “Replicação e Inconsistências de Transações”, para obter mais informações.

Se você precisar alterar uma replica multithreading falha para modo de thread único, você pode emitir a seguinte série de declarações, na ordem mostrada:

    ```sql
    START SLAVE UNTIL SQL_AFTER_MTS_GAPS;
    SET @@GLOBAL.slave_parallel_workers = 0;
    START SLAVE SQL_THREAD;
    ```

#### 13.4.2.6 Declaração de PARAR SLAVE

```sql
STOP SLAVE [thread_types] [channel_option]

thread_types:
    [thread_type [, thread_type] ... ]

thread_type: IO_THREAD | SQL_THREAD

channel_option:
    FOR CHANNEL channel
```

Para interromper os threads de replicação. `STOP SLAVE` requer o privilégio `SUPER`. A melhor prática recomendada é executar `STOP SLAVE` na replica antes de interromper o servidor de replicação (consulte a Seção 5.1.16, “O processo de desligamento do servidor”, para mais informações).

*Ao usar o formato de registro baseado em string*: Você deve executar `STOP SLAVE` ou `STOP SLAVE SQL_THREAD` na réplica antes de desligar o servidor de réplica, se você estiver replicando quaisquer tabelas que utilizem um motor de armazenamento não transacional (consulte a *Nota* mais adiante nesta seção).

Assim como `START SLAVE`, esta declaração pode ser usada com as opções `IO_THREAD` e `SQL_THREAD` para nomear o(s) thread(s) a serem interrompido(s). Observe que o canal do aplicativo de replicação de grupo (`group_replication_applier`) não tem thread(s) de I/O de replicação, apenas um thread de SQL de replicação. Portanto, usando a opção `SQL_THREAD`, esse canal é interrompido completamente.

`STOP SLAVE` causa um compromisso implícito de uma transação em andamento. Veja a Seção 13.3.3, “Declarações que causam um compromisso implícito”.

`gtid_next` deve ser definido como `AUTOMATIC` antes de emitir essa declaração.

Você pode controlar o tempo que o `STOP SLAVE` espera antes de expirar, definindo a variável de sistema `rpl_stop_slave_timeout`. Isso pode ser usado para evitar deadlocks entre o `STOP SLAVE` e outros comandos SQL que utilizam diferentes conexões de cliente para a replica. Quando o valor do tempo de espera é alcançado, o cliente que emitiu o comando retorna uma mensagem de erro e para de esperar, mas a instrução `STOP SLAVE` permanece em vigor. Uma vez que os threads de replicação deixam de ser ocupados, a instrução `STOP SLAVE` é executada e a replica para.

Algumas declarações `CHANGE MASTER TO` são permitidas enquanto a replica está em execução, dependendo dos estados do thread de SQL de replicação e do thread de E/S de replicação. No entanto, usar `STOP SLAVE` antes de executar `CHANGE MASTER TO` nesses casos ainda é suportado. Consulte a Seção 13.4.2.1, “Declaração CHANGE MASTER TO”, e a Seção 16.3.7, “Alternar fontes durante o failover”, para obter mais informações.

A cláusula opcional `FOR CHANNEL channel` permite que você nomeie qual canal de replicação a declaração se aplica. A inclusão da cláusula `FOR CHANNEL channel` aplica a declaração `STOP SLAVE` a um canal de replicação específico. Se nenhum canal for nomeado e não houver canais extras, a declaração se aplica ao canal padrão. Se uma declaração `STOP SLAVE` não nomear um canal ao usar vários canais, essa declaração interrompe os threads especificados para todos os canais. Esta declaração não pode ser usada com o canal `group_replication_recovery`. Consulte a Seção 16.2.2, “Canais de Replicação”, para obter mais informações.

*Ao usar replicação baseada em declarações*: alterar a fonte enquanto ela tem tabelas temporárias abertas é potencialmente inseguro. Esse é um dos motivos pelos quais a replicação baseada em declarações de tabelas temporárias não é recomendada. Você pode descobrir se há alguma tabela temporária na replica verificando o valor de `Slave_open_temp_tables`; ao usar replicação baseada em declarações, esse valor deve ser 0 antes de executar `CHANGE MASTER TO`. Se houver alguma tabela temporária aberta na replica, emitir uma declaração `CHANGE MASTER TO` após emitir uma declaração `STOP SLAVE` causa um aviso `ER_WARN_OPEN_TEMP_TABLES_MUST_BE_ZERO`.

Quando se usa uma replica multithread (`slave_parallel_workers` é um valor não nulo), quaisquer lacunas na sequência de transações executadas a partir do log de relevo são fechadas como parte do processo de parada dos threads do trabalhador. Se a replica for parada inesperadamente (por exemplo, devido a um erro em um thread do trabalhador ou outro thread emitindo `KILL`) enquanto uma declaração `STOP SLAVE` está sendo executada, a sequência de transações executadas a partir do log de relevo pode se tornar inconsistente. Consulte a Seção 16.4.1.32, “Replicação e Inconsistências de Transações”, para obter mais informações.

Se o grupo atual de eventos de replicação tiver modificado uma ou mais tabelas não transacionais, o SLAVE para aguardar até 60 segundos para que o grupo de eventos seja concluído, a menos que você emita uma declaração `KILL QUERY` ou `KILL CONNECTION` para o thread de SQL de replicação. Se o grupo de eventos permanecer incompleto após o tempo limite, uma mensagem de erro é registrada.

### 13.4.3 Esses são os comandos SQL para controlar a replicação de grupos

Esta seção fornece informações sobre as declarações usadas para controlar os servidores que executam o plugin de replicação de grupo do MySQL. Consulte o Capítulo 17, *Replicação de grupo*, para obter mais informações.

#### 13.4.3.1 Declaração de GRUPO_REPLICATION START

```sql
START GROUP_REPLICATION
```

Começa a Replicação em Grupo nesta instância do servidor. Esta declaração requer o privilégio `SUPER`. Se `super_read_only=ON` e o membro devem se juntar como primário, `super_read_only` é definido como `OFF` uma vez que a Replicação em Grupo é iniciada com sucesso.

Um servidor que participa de um grupo no modo single-primary deve usar `skip_replica_start=ON`. Caso contrário, o servidor não é permitido participar de um grupo como secundário.

#### 13.4.3.2 Declaração de Replicação de Grupo STOP

```sql
STOP GROUP_REPLICATION
```

Para de replicação em grupo. Essa declaração requer o privilégio `GROUP_REPLICATION_ADMIN` ou `SUPER`. Assim que você emitir `STOP GROUP_REPLICATION`, o membro é configurado para `super_read_only=ON`, o que garante que nenhuma escrita possa ser feita no membro enquanto a replicação em grupo é interrompida. Todos os outros canais de replicação em execução no membro também são interrompidos.

Aviso

Use essa declaração com extrema cautela, pois ela remove a instância do servidor do grupo, o que significa que ela não é mais protegida pelos mecanismos de garantia de consistência da Replicação de Grupo. Para garantir a segurança total, certifique-se de que suas aplicações não possam mais se conectar à instância antes de emitir essa declaração, para evitar qualquer chance de leituras obsoletas.