#### 15.7.7.35 Mostrar status da réplica Comentário

```
SHOW {REPLICA | SLAVE} STATUS [FOR CHANNEL channel]
```

Esta declaração fornece informações de status sobre os parâmetros essenciais dos fios replicados. A partir do MySQL 8.0.22, use `SHOW REPLICA STATUS` no lugar de `SHOW SLAVE STATUS`, que é desatualizado a partir dessa versão. Em versões anteriores ao MySQL 8.0.22, use `SHOW SLAVE STATUS`. A declaração requer o privilégio `REPLICATION CLIENT` (ou o privilégio desatualizado `SUPER`).

`SHOW REPLICA STATUS` é não-bloqueador. Quando executado simultaneamente com `STOP REPLICA`, `SHOW REPLICA STATUS` retorna sem esperar que `STOP REPLICA` termine de encerrar o thread de aplicação de replicação SQL (aplicador) ou o thread de I/O de replicação (receptor) (ou ambos). Isso permite o uso em monitoramento e outras aplicações onde obter uma resposta imediata de `SHOW REPLICA STATUS` é mais importante do que garantir que ele tenha retornado os dados mais recentes. A palavra-chave SLAVE foi substituída por REPLICA no MySQL 8.0.22.

Se você emitir essa declaração usando o cliente **mysql**, pode usar um `\G` como delimitador de declaração em vez de um ponto e vírgula para obter um layout vertical mais legível:

```
mysql> SHOW REPLICA STATUS\G
*************************** 1. row ***************************
             Replica_IO_State: Waiting for source to send event
                  Source_Host: 127.0.0.1
                  Source_User: root
                  Source_Port: 13000
                Connect_Retry: 1
              Source_Log_File: master-bin.000001
          Read_Source_Log_Pos: 927
               Relay_Log_File: slave-relay-bin.000002
                Relay_Log_Pos: 1145
        Relay_Source_Log_File: master-bin.000001
           Replica_IO_Running: Yes
          Replica_SQL_Running: Yes
              Replicate_Do_DB:
          Replicate_Ignore_DB:
           Replicate_Do_Table:
       Replicate_Ignore_Table:
      Replicate_Wild_Do_Table:
  Replicate_Wild_Ignore_Table:
                   Last_Errno: 0
                   Last_Error:
                 Skip_Counter: 0
          Exec_Source_Log_Pos: 927
              Relay_Log_Space: 1355
              Until_Condition: None
               Until_Log_File:
                Until_Log_Pos: 0
           Source_SSL_Allowed: No
           Source_SSL_CA_File:
           Source_SSL_CA_Path:
              Source_SSL_Cert:
            Source_SSL_Cipher:
               Source_SSL_Key:
        Seconds_Behind_Source: 0
Source_SSL_Verify_Server_Cert: No
                Last_IO_Errno: 0
                Last_IO_Error:
               Last_SQL_Errno: 0
               Last_SQL_Error:
  Replicate_Ignore_Server_Ids:
             Source_Server_Id: 1
                  Source_UUID: 73f86016-978b-11ee-ade5-8d2a2a562feb
             Source_Info_File: mysql.slave_master_info
                    SQL_Delay: 0
          SQL_Remaining_Delay: NULL
    Replica_SQL_Running_State: Replica has read all relay log; waiting for more updates
           Source_Retry_Count: 10
                  Source_Bind:
      Last_IO_Error_Timestamp:
     Last_SQL_Error_Timestamp:
               Source_SSL_Crl:
           Source_SSL_Crlpath:
           Retrieved_Gtid_Set: 73f86016-978b-11ee-ade5-8d2a2a562feb:1-3
            Executed_Gtid_Set: 73f86016-978b-11ee-ade5-8d2a2a562feb:1-3
                Auto_Position: 1
         Replicate_Rewrite_DB:
                 Channel_Name:
           Source_TLS_Version:
       Source_public_key_path:
        Get_Source_public_key: 0
            Network_Namespace:
```

O Schema de Desempenho fornece tabelas que exibem informações de replicação. Isso é semelhante às informações disponíveis a partir da declaração `SHOW REPLICA STATUS`, mas representadas em formato de tabela. Para detalhes, consulte a Seção 29.12.11, “Tabelas de Replicação do Schema de Desempenho”.

A partir do MySQL 8.0.27, você pode definir a opção `GTID_ONLY` na instrução `CHANGE REPLICATION SOURCE TO` para impedir que um canal de replicação persista nomes de arquivos e posições de arquivos nos repositórios de metadados de replicação. Com essa configuração, as posições de arquivo do log binário de origem e do log de retransmissão são rastreadas na memória. A instrução `SHOW REPLICA STATUS` ainda exibe as posições de arquivo no uso normal. No entanto, como as posições de arquivo não são atualizadas regularmente no repositório de metadados de conexão e no repositório de metadados do aplicável, exceto em algumas situações, elas provavelmente estarão desatualizadas se o servidor for reiniciado.

Para um canal de replicação com a configuração `GTID_ONLY` após o início do servidor, as posições de arquivo de leitura e aplicada para o arquivo binário de log de origem (`Read_Source_Log_Pos` e `Exec_Source_Log_Pos`) são definidas como zero, e os nomes dos arquivos (`Source_Log_File` e `Relay_Source_Log_File`) são definidos como `INVALID`. O nome do arquivo de log de relevo (`Relay_Log_File`) é definido de acordo com a configuração relay\_log\_recovery, seja um novo arquivo criado no início do servidor ou o primeiro arquivo de log de relevo presente. A posição do arquivo (`Relay_Log_Pos`) é definida para a posição 4, e o auto-salto GTID é usado para ignorar quaisquer transações no arquivo que já tenham sido aplicadas.

Quando o fio receptor entra em contato com a fonte e obtém informações de posição válidas, a posição de leitura (`Read_Source_Log_Pos`) e o nome do arquivo (`Source_Log_File`) são atualizados com os dados corretos e tornam-se válidos. Quando o fio aplicador aplica uma transação da fonte ou pula uma transação já executada, a posição executada (`Exec_Source_Log_Pos`) e o nome do arquivo (`Relay_Source_Log_File`) são atualizados com os dados corretos e tornam-se válidos. A posição do arquivo de log de relé (`Relay_Log_Pos`) também é atualizada nesse momento.

A lista a seguir descreve os campos retornados por `SHOW REPLICA STATUS`. Para obter informações adicionais sobre a interpretação de seus significados, consulte a Seção 19.1.7.1, “Verificação do Status de Replicação”.

- `Replica_IO_State`

  Uma cópia do campo `State` do `SHOW PROCESSLIST` de saída para o fio de I/O de replicação (receptor). Isso informa o que a thread está fazendo: tentando se conectar à fonte, esperando eventos da fonte, reconectando-se à fonte, e assim por diante. Para uma lista dos possíveis estados, consulte a Seção 10.14.5, “Estados de Fios de I/O de Replicação (Receptor) Thread States”).

- `Source_Host`

  O hospedeiro de origem ao qual a replica está conectada.

- `Source_User`

  O nome de usuário da conta usada para se conectar à fonte.

- `Source_Port`

  O porto costumava se conectar à fonte.

- `Connect_Retry`

  O número de segundos entre os tentativas de conexão (padrão 60). Isso pode ser definido com uma declaração `CHANGE REPLICATION SOURCE TO` (a partir do MySQL 8.0.23) ou declaração `CHANGE MASTER TO` (antes do MySQL 8.0.23).

- `Source_Log_File`

  O nome do arquivo de log binário de origem a partir do qual o thread de I/O (receptor) está lendo atualmente. Isso é definido como `INVALID` para um canal de replicação com a configuração `GTID_ONLY` após o início do servidor. Ele será atualizado quando a replica entrar em contato com a origem.

- `Read_Source_Log_Pos`

  A posição no arquivo de log binário atual da fonte até a qual o thread de I/O (receptor) leu. Isso é definido como zero para um canal de replicação com a configuração `GTID_ONLY` após o início do servidor. Ele será atualizado quando a replica entrar em contato com a fonte.

- `Relay_Log_File`

  O nome do arquivo de registro de relé a partir do qual o thread SQL (aplicável) está lendo e executando atualmente.

- `Relay_Log_Pos`

  A posição no arquivo de registro do retransmissor atual até a qual o thread do SQL (aplicável) leu e executou.

- `Relay_Source_Log_File`

  O nome do arquivo de log binário de origem que contém o evento mais recente executado pela thread do SQL (aplicável). Isso é definido como `INVALID` para um canal de replicação com a configuração `GTID_ONLY` após o início do servidor. Ele será atualizado quando uma transação for executada ou ignorada.

- `Replica_IO_Running`

  Se a thread de I/O de replicação (receptor) foi iniciada e se conectou com sucesso à fonte. Internamente, o estado dessa thread é representado por um dos seguintes três valores:

  - **MYSQL\_REPLICA\_NOT\_RUN.** A thread de I/O de replicação (receptor) não está em execução. Para este estado, `Replica_IO_Running` é `No`.

  - **MYSQL\_REPLICA\_RUN\_NOT\_CONNECT.** A thread de I/O de replicação (receptor) está em execução, mas não está conectada a uma fonte de replicação. Para este estado, `Replica_IO_Running` é `Connecting`.

  - **MYSQL\_REPLICA\_RUN\_CONNECT.** A thread de I/O de replicação (receptor) está em execução e está conectada a uma fonte de replicação. Para este estado, `Replica_IO_Running` é `Yes`.

- `Replica_SQL_Running`

  Se o fio de replicação SQL (aplicável) foi iniciado.

- `Replicate_Do_DB`, `Replicate_Ignore_DB`

  Os nomes de quaisquer bancos de dados especificados com as opções `--replicate-do-db` e `--replicate-ignore-db` ou a instrução `CHANGE REPLICATION FILTER`. Se a cláusula `FOR CHANNEL` foi usada, os filtros de replicação específicos do canal são mostrados. Caso contrário, os filtros de replicação para cada canal de replicação são mostrados.

- `Replicate_Do_Table`, `Replicate_Ignore_Table`, `Replicate_Wild_Do_Table`, `Replicate_Wild_Ignore_Table`

  Os nomes de quaisquer tabelas especificados com as opções `--replicate-do-table`, `--replicate-ignore-table`, `--replicate-wild-do-table` e `--replicate-wild-ignore-table`, ou a declaração `CHANGE REPLICATION FILTER`. Se a cláusula `FOR CHANNEL` foi usada, os filtros de replicação específicos do canal são mostrados. Caso contrário, os filtros de replicação para cada canal de replicação são mostrados.

- `Last_Errno`, `Last_Error`

  Essas colunas são aliases para `Last_SQL_Errno` e `Last_SQL_Error`.

  A emissão de `RESET MASTER` ou `RESET REPLICA` redefiniu os valores exibidos nessas colunas.

  Nota

  Quando o fio de replicação SQL recebe um erro, ele relata o erro primeiro e, em seguida, para o fio SQL. Isso significa que há uma pequena janela de tempo durante a qual `SHOW REPLICA STATUS` exibe um valor não nulo para `Last_SQL_Errno`, mesmo que `Replica_SQL_Running` ainda mostre `Yes`.

- `Skip_Counter`

  O valor atual da variável de sistema `sql_slave_skip_counter`. Veja a sintaxe de SET GLOBAL sql\_slave\_skip\_counter.

- `Exec_Source_Log_Pos`

  A posição no arquivo de log binário atual da fonte para a qual o thread de SQL de replicação leu e executou, marcando o início da próxima transação ou evento a ser processado. Isso é definido como zero para um canal de replicação com a configuração `GTID_ONLY` após o início do servidor. Ele será atualizado quando uma transação for executada ou ignorada.

  Você pode usar esse valor com a opção `SOURCE_LOG_POS` da instrução `CHANGE REPLICATION SOURCE TO` (a partir do MySQL 8.0.23) ou a opção `MASTER_LOG_POS` da instrução `CHANGE MASTER TO` (antes do MySQL 8.0.23) ao iniciar uma nova replica a partir de uma replica existente, para que a nova replica leia a partir desse ponto. As coordenadas fornecidas por (`Relay_Source_Log_File`, `Exec_Source_Log_Pos`) no log binário da fonte correspondem às coordenadas fornecidas por (`Relay_Log_File`, `Relay_Log_Pos`) no log de retransmissão.

  Inconsistências na sequência das transações do log de retransmissão que foram executadas podem fazer com que esse valor seja um “nível mínimo”. Em outras palavras, as transações que aparecem antes da posição são garantidas como tendo sido executadas, mas as transações após a posição podem ter sido executadas ou não. Se essas lacunas precisam ser corrigidas, use `START REPLICA UNTIL SQL_AFTER_MTS_GAPS`. Consulte a Seção 19.5.1.34, “Replicação e Inconsistências de Transações”, para obter mais informações.

- `Relay_Log_Space`

  O tamanho total combinado de todos os arquivos de registro de relé existentes.

- `Until_Condition`, `Until_Log_File`, `Until_Log_Pos`

  Os valores especificados na cláusula `UNTIL` da declaração `START REPLICA`.

  `Until_Condition` tem esses valores:

  - `None` se nenhuma cláusula `UNTIL` foi especificada.

  - `Source` se a replica estiver lendo até uma posição específica no log binário da fonte.

  - `Relay` se a replica estiver lendo até uma posição específica no log do retransmissor.

  - `SQL_BEFORE_GTIDS` se o fio de SQL de replicação estiver processando transações até atingir a primeira transação cujo GTID está listado no `gtid_set`.

  - `SQL_AFTER_GTIDS` se os threads de replicação estiverem processando todas as transações até que a última transação no `gtid_set` tenha sido processada por ambos os threads.

  - `SQL_AFTER_MTS_GAPS` se os threads SQL de uma replica multithread estiverem em execução até que mais lacunas não sejam encontradas no log de retransmissão.

  `Until_Log_File` e `Until_Log_Pos` indicam o nome e a posição do arquivo de log que definem as coordenadas em que o thread de replicação do SQL para de executar.

  Para obter mais informações sobre as cláusulas `UNTIL`, consulte a Seção 15.4.2.7, “Instrução START SLAVE”.

- `Source_SSL_Allowed`, `Source_SSL_CA_File`, `Source_SSL_CA_Path`, `Source_SSL_Cert`, `Source_SSL_Cipher`, `Source_SSL_CRL_File`, `Source_SSL_CRL_Path`, `Source_SSL_Key`, `Source_SSL_Verify_Server_Cert`

  Esses campos mostram os parâmetros SSL usados pela replica para se conectar à fonte, se houver.

  `Source_SSL_Allowed` tem esses valores:

  - `Yes` se uma conexão SSL para a fonte for permitida.

  - `No` se uma conexão SSL para a fonte não for permitida.

  - `Ignored` se uma conexão SSL for permitida, mas o servidor replicador não tiver o suporte SSL habilitado.

  Os valores dos outros campos relacionados ao SSL correspondem aos valores das opções `SOURCE_SSL_*` da declaração `CHANGE REPLICATION SOURCE TO` (a partir do MySQL 8.0.23) ou das opções `MASTER_SSL_*` da declaração `CHANGE MASTER TO` (antes do MySQL 8.0.23). Veja a Seção 15.4.2.1, “ALTERAR MASTER PARA Declaração”.

- `Seconds_Behind_Source`

  Esse campo indica o quão “tardia” é a réplica:

  - Quando a réplica está processando ativamente as atualizações, este campo mostra a diferença entre o timestamp atual na réplica e o timestamp original registrado na fonte para o evento que está sendo processado na réplica.

  - Quando nenhum evento está sendo processado na replica, esse valor é 0.

  Em essência, este campo mede a diferença de tempo em segundos entre o fio de replicação SQL (aplicador) e o fio de I/O de replicação (receptor). Se a conexão de rede entre a fonte e a réplica for rápida, o fio de receptor de replicação está muito próximo da fonte, então este campo é uma boa aproximação de quão atrasado o fio de aplicador de replicação está em relação à fonte. Se a rede for lenta, isso *não* é uma boa aproximação; o fio de aplicador de replicação pode estar frequentemente atrasado em relação ao fio de receptor de replicação que lê lentamente, então `Seconds_Behind_Source` muitas vezes mostra um valor de 0, mesmo que o fio de receptor de replicação esteja atrasado em relação à fonte. Em outras palavras, *esta coluna é útil apenas para redes rápidas*.

  Essa computação da diferença de tempo funciona mesmo se a fonte e a réplica não tiverem tempos de relógio idênticos, desde que a diferença, calculada quando o fio de recebimento da réplica começa, permaneça constante a partir daí. Quaisquer alterações, incluindo atualizações do NTP, podem levar a desalinhamentos de relógio que podem tornar o cálculo do `Seconds_Behind_Source` menos confiável.

  No MySQL 8.0, este campo é `NULL` (definido como indefinido ou desconhecido) se o thread do aplicável de replicação não estiver em execução ou se o thread do aplicável tiver consumido todo o log de retransmissão e o thread do receptor de replicação não estiver em execução. (Em versões mais antigas do MySQL, este campo era `NULL` se o thread do aplicável de replicação ou o thread do receptor de replicação não estivesse em execução ou não estivesse conectado à fonte.) Se o thread do receptor de replicação estiver em execução, mas o log de retransmissão estiver esgotado, `Seconds_Behind_Source` é definido como 0.

  O valor de `Seconds_Behind_Source` é baseado nos timestamps armazenados nos eventos, que são preservados através da replicação. Isso significa que, se uma fonte M1 for ela mesma uma replica de M0, qualquer evento do log binário de M1 que tenha origem no log binário de M0 terá o timestamp de M0 para esse evento. Isso permite que o MySQL replique `TIMESTAMP` com sucesso. No entanto, o problema para `Seconds_Behind_Source` é que, se M1 também receber atualizações diretas de clientes, o valor de `Seconds_Behind_Source` flutua aleatoriamente porque, às vezes, o último evento de M1 tem origem em M0 e, outras vezes, é o resultado de uma atualização direta em M1.

  Ao usar uma replica multithreading, você deve ter em mente que esse valor é baseado em `Exec_Source_Log_Pos`, e, portanto, pode não refletir a posição da transação mais recentemente comprometida.

- `Last_IO_Errno`, `Last_IO_Error`

  O número do erro e a mensagem de erro do erro mais recente que causou o bloqueio da thread de I/O de replicação (receptor). Um número de erro de 0 e uma mensagem de string vazia significam “sem erro”. Se o valor `Last_IO_Error` não estiver vazio, os valores de erro também aparecem no log de erro da replica.

  As informações sobre erros de E/S incluem um timestamp que mostra quando ocorreu o último erro de thread de E/S (receptor). Esse timestamp usa o formato `YYMMDD hh:mm:ss` e aparece na coluna `Last_IO_Error_Timestamp`.

  A emissão de `RESET MASTER` ou `RESET REPLICA` redefiniu os valores exibidos nessas colunas.

- `Last_SQL_Errno`, `Last_SQL_Error`

  O número do erro e a mensagem de erro do erro mais recente que causou o travamento do fio de replicação do SQL (aplicável). Um número de erro de 0 e uma mensagem de string vazia significam “sem erro”. Se o valor `Last_SQL_Error` não estiver vazio, os valores de erro também aparecem no log de erro da replica.

  Se a replica for multithreading, o thread de replicação SQL é o coordenador dos threads de trabalho. Neste caso, o campo `Last_SQL_Error` mostra exatamente o que a coluna `Last_Error_Message` na tabela do Gerenciamento de Desempenho `replication_applier_status_by_coordinator` mostra. O valor do campo é modificado para sugerir que pode haver mais falhas nos outros threads de trabalho, que podem ser observadas na tabela `replication_applier_status_by_worker` que mostra o status de cada thread de trabalho. Se essa tabela não estiver disponível, o log de erro da replica pode ser usado. O log ou a tabela `replication_applier_status_by_worker` também devem ser usados para saber mais sobre a falha mostrada por `SHOW REPLICA STATUS` ou a tabela coordenadora.

  As informações de erro do SQL incluem um timestamp que mostra quando o erro mais recente do thread do SQL (aplicador) ocorreu. Esse timestamp usa o formato `YYMMDD hh:mm:ss` e aparece na coluna `Last_SQL_Error_Timestamp`.

  A emissão de `RESET MASTER` ou `RESET REPLICA` redefiniu os valores exibidos nessas colunas.

  No MySQL 8.0, todos os códigos e mensagens de erro exibidos nas colunas `Last_SQL_Errno` e `Last_SQL_Error` correspondem aos valores de erro listados na Referência de Mensagens de Erro do Servidor. Isso não era sempre verdade nas versões anteriores. (Bug #11760365, Bug #52768)

- `Replicate_Ignore_Server_Ids`

  Quaisquer IDs de servidor que tenham sido especificados usando a opção `IGNORE_SERVER_IDS` da declaração `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO`, para que a replica ignore eventos desses servidores. Esta opção é usada em uma configuração de replicação circular ou de múltiplas fontes quando um dos servidores é removido. Se algum ID de servidor tiver sido definido dessa maneira, uma lista de um ou mais números, separados por vírgula, será exibida. Se nenhum ID de servidor tiver sido definido, o campo ficará em branco.

  Nota

  O valor `Ignored_server_ids` na tabela `slave_master_info` também mostra os IDs dos servidores a serem ignorados, mas como uma lista separada por espaços, precedida pelo número total de IDs de servidores a serem ignorados. Por exemplo, se uma declaração `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` contendo a opção `IGNORE_SERVER_IDS = (2,6,9)` tiver sido emitida para dizer a uma réplica que ignore fontes com o ID de servidor 2, 6 ou 9, essa informação aparece conforme mostrado aqui:

  ```
  	Replicate_Ignore_Server_Ids: 2, 6, 9
  ```

  ```
  	Ignored_server_ids: 3, 2, 6, 9
  ```

  A filtragem `Replicate_Ignore_Server_Ids` é realizada pela thread de E/S (receptor), e não pela thread de SQL (aplicador), o que significa que os eventos que são filtrados não são escritos no log de retransmissão. Isso difere das ações de filtragem realizadas por opções do servidor, como `--replicate-do-table`, que se aplicam à thread de aplicador.

  Nota

  A partir do MySQL 8.0, um aviso de depreciação é emitido se `SET GTID_MODE=ON` for emitido quando qualquer canal tiver IDs de servidor existentes definidos com `IGNORE_SERVER_IDS`. Antes de iniciar a replicação baseada em GTID, use `SHOW REPLICA STATUS` para verificar e limpar todas as listas de ID de servidor ignoradas nos servidores envolvidos. Você pode limpar uma lista emitindo uma declaração `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` contendo a opção `IGNORE_SERVER_IDS` com uma lista vazia.

- `Source_Server_Id`

  O valor `server_id` da fonte.

- `Source_UUID`

  O valor `server_uuid` da fonte.

- `Source_Info_File`

  A localização do arquivo `master.info`, cujo uso já foi desaconselhado. Por padrão, a partir do MySQL 8.0, uma tabela é usada em vez do repositório de metadados de conexão da replica.

- `SQL_Delay`

  O número de segundos que a réplica deve ficar atrasada em relação à fonte.

- `SQL_Remaining_Delay`

  Quando `Replica_SQL_Running_State` é `Waiting until MASTER_DELAY seconds after source executed event`, este campo contém o número de segundos de atraso restantes. Em outros momentos, este campo é `NULL`.

- `Replica_SQL_Running_State`

  O estado do fio SQL (análogo ao `Replica_IO_State`). O valor é idêntico ao valor `State` do fio SQL, conforme exibido pelo `SHOW PROCESSLIST`. A seção 10.14.6, “Estados de Fios SQL de Replicação”, fornece uma lista dos possíveis estados.

- `Source_Retry_Count`

  O número de vezes que a réplica pode tentar se reconectar à fonte em caso de perda de conexão. Esse valor pode ser definido usando a opção `SOURCE_RETRY_COUNT` | `MASTER_RETRY_COUNT` da instrução `CHANGE REPLICATION SOURCE TO` (a partir do MySQL 8.0.23) ou da instrução `CHANGE MASTER TO` (antes do MySQL 8.0.23), ou a opção de servidor mais antiga `--master-retry-count` (ainda suportada para compatibilidade reversa).

- `Source_Bind`

  A interface de rede à qual a replica está vinculada, se houver. Isso é definido usando a opção `SOURCE_BIND` | `MASTER_BIND` para a declaração `CHANGE REPLICATION SOURCE TO` (a partir do MySQL 8.0.23) ou a declaração `CHANGE MASTER TO` (antes do MySQL 8.0.23).

- `Last_IO_Error_Timestamp`

  Um timestamp no formato `YYMMDD hh:mm:ss` que mostra quando ocorreu o último erro de E/S.

- `Last_SQL_Error_Timestamp`

  Um marcador de tempo no formato `YYMMDD hh:mm:ss` que mostra quando ocorreu o último erro SQL.

- `Retrieved_Gtid_Set`

  O conjunto de IDs de transação global correspondentes a todas as transações recebidas por esta réplica. Vazio se os GTIDs não estiverem em uso. Consulte Conjuntos de GTIDs para obter mais informações.

  Este é o conjunto de todos os GTIDs que existem ou existiram nos registros do retransmissor. Cada GTID é adicionado assim que o `Gtid_log_event` é recebido. Isso pode fazer com que transações parcialmente transmitidas tenham seus GTIDs incluídos no conjunto.

  Quando todos os registros de relé são perdidos devido à execução de `RESET REPLICA` ou `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO`, ou devido aos efeitos da opção `--relay-log-recovery`, o conjunto é limpo. Quando `relay_log_purge = 1`, o registro de relé mais recente é sempre mantido e o conjunto não é limpo.

- `Executed_Gtid_Set`

  O conjunto de IDs de transações globais registrados no log binário. Isso é o mesmo valor da variável de sistema global `gtid_executed` neste servidor, bem como o valor de `Executed_Gtid_Set` na saída de `SHOW MASTER STATUS` neste servidor. Vazio se os GTIDs não estiverem em uso. Consulte Conjuntos de GTIDs para obter mais informações.

- `Auto_Position`

  1 se o autoposicionamento do GTID estiver em uso para o canal, caso contrário, 0.

- `Replicate_Rewrite_DB`

  O valor `Replicate_Rewrite_DB` exibe quaisquer regras de filtragem de replicação especificadas. Por exemplo, se a seguinte regra de filtro de replicação foi definida:

  ```
  CHANGE REPLICATION FILTER REPLICATE_REWRITE_DB=((db1,db2), (db3,db4));
  ```

  o valor `Replicate_Rewrite_DB` exibe:

  ```
  Replicate_Rewrite_DB: (db1,db2),(db3,db4)
  ```

  Para obter mais informações, consulte a Seção 15.4.2.2, “Declaração de REPLICAÇÃO DE MUDANÇAS”.

- `Channel_name`

  O canal de replicação que está sendo exibido. Há sempre um canal de replicação padrão, e mais canais de replicação podem ser adicionados. Consulte a Seção 19.2.2, “Canais de Replicação”, para obter mais informações.

- `Master_TLS_Version`

  A versão TLS usada na fonte. Para informações sobre a versão TLS, consulte a Seção 8.3.2, “Protocolos e cifra de conexão criptografada TLS”.

- `Source_public_key_path`

  O nome do caminho de um arquivo que contém uma cópia do lado do replicador da chave pública necessária pelo ponto de origem para a troca de senhas baseada em pares de chaves RSA. O arquivo deve estar no formato PEM. Esta coluna se aplica a réplicas que se autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`.

  Se `Source_public_key_path` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `Get_source_public_key`.

- `Get_source_public_key`

  Se solicitar à fonte a chave pública necessária para a troca de senhas baseada em pares de chaves RSA. Esta coluna se aplica a réplicas que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, a fonte não envia a chave pública a menos que seja solicitada.

  Se `Source_public_key_path` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `Get_source_public_key`.

- `Network_Namespace`

  O nome do espaço de rede; vazio se a conexão estiver usando o espaço de rede padrão (global). Para informações sobre espaços de rede, consulte a Seção 7.1.14, “Suporte a Espaço de Rede”. Esta coluna foi adicionada no MySQL 8.0.22.
