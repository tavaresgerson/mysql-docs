#### 13.7.5.34 Declaração de exibição do status do escravo

```sql
SHOW SLAVE STATUS [FOR CHANNEL channel]
```

Esta declaração fornece informações de status sobre os parâmetros essenciais dos threads replicados. Ela requer o privilégio `SUPER` ou `REPLICATION CLIENT`.

Se você emitir essa declaração usando o cliente **mysql**, você pode usar um delimitador de declaração `\G` em vez de um ponto e vírgula para obter um layout vertical mais legível:

```sql
mysql> SHOW SLAVE STATUS\G
*************************** 1. row ***************************
               Slave_IO_State: Waiting for master to send event
                  Master_Host: localhost
                  Master_User: repl
                  Master_Port: 13000
                Connect_Retry: 60
              Master_Log_File: source-bin.000002
          Read_Master_Log_Pos: 1307
               Relay_Log_File: replica-relay-bin.000003
                Relay_Log_Pos: 1508
        Relay_Master_Log_File: source-bin.000002
             Slave_IO_Running: Yes
            Slave_SQL_Running: Yes
              Replicate_Do_DB:
          Replicate_Ignore_DB:
           Replicate_Do_Table:
       Replicate_Ignore_Table:
      Replicate_Wild_Do_Table:
  Replicate_Wild_Ignore_Table:
                   Last_Errno: 0
                   Last_Error:
                 Skip_Counter: 0
          Exec_Master_Log_Pos: 1307
              Relay_Log_Space: 1858
              Until_Condition: None
               Until_Log_File:
                Until_Log_Pos: 0
           Master_SSL_Allowed: No
           Master_SSL_CA_File:
           Master_SSL_CA_Path:
              Master_SSL_Cert:
            Master_SSL_Cipher:
               Master_SSL_Key:
        Seconds_Behind_Master: 0
Master_SSL_Verify_Server_Cert: No
                Last_IO_Errno: 0
                Last_IO_Error:
               Last_SQL_Errno: 0
               Last_SQL_Error:
  Replicate_Ignore_Server_Ids:
             Master_Server_Id: 1
                  Master_UUID: 3e11fa47-71ca-11e1-9e33-c80aa9429562
             Master_Info_File: /var/mysqld.2/data/master.info
                    SQL_Delay: 0
          SQL_Remaining_Delay: NULL
      Slave_SQL_Running_State: Reading event from the relay log
           Master_Retry_Count: 10
                  Master_Bind:
      Last_IO_Error_Timestamp:
     Last_SQL_Error_Timestamp:
               Master_SSL_Crl:
           Master_SSL_Crlpath:
           Retrieved_Gtid_Set: 3e11fa47-71ca-11e1-9e33-c80aa9429562:1-5
            Executed_Gtid_Set: 3e11fa47-71ca-11e1-9e33-c80aa9429562:1-5
                Auto_Position: 1
         Replicate_Rewrite_DB:
                 Channel_name:
           Master_TLS_Version: TLSv1.2
```

O Schema de Desempenho fornece tabelas que exibem informações de replicação. Isso é semelhante às informações disponíveis a partir da declaração `SHOW SLAVE STATUS`, mas representadas em formato de tabela. Para detalhes, consulte Seção 25.12.11, “Tabelas de Replicação do Schema de Desempenho”.

A lista a seguir descreve os campos retornados por `SHOW SLAVE STATUS`. Para obter informações adicionais sobre a interpretação de seus significados, consulte Seção 16.1.7.1, “Verificação do Status de Replicação”.

- `Slave_IO_State`

  Uma cópia do campo `State` da saída do `SHOW PROCESSLIST` para a thread de E/S de replica. Isso informa o que a thread está fazendo: tentando se conectar à fonte, esperando eventos da fonte, reconectando-se à fonte, e assim por diante. Para uma lista de estados possíveis, consulte Seção 8.14.6, “Estados de Thread de E/S de Replicação”.

- `Master_Host`

  O hospedeiro de origem ao qual a replica está conectada.

- `Master_User`

  O nome de usuário da conta usada para se conectar à fonte.

- `Master_Port`

  O porto costumava se conectar à fonte.

- `Conectar_Retry`

  O número de segundos entre as tentativas de conexão (padrão 60). Isso pode ser configurado com a instrução `CHANGE MASTER TO`.

- `Master_Log_File`

  O nome do arquivo de log binário de origem a partir do qual a thread de E/S está lendo atualmente.

- `Leia o log de posição do mestre`

  A posição no arquivo de log binário de origem atual até a qual o thread de E/S leu.

- `Relay_Log_File`

  O nome do arquivo de registro de relé a partir do qual o thread SQL está lendo e executando atualmente.

- `Relay_Log_Pos`

  A posição no arquivo de registro do retransmissor atual até a qual o thread SQL leu e executou.

- `Relay_Master_Log_File`

  O nome do arquivo de log binário de origem que contém o evento mais recente executado pelo thread SQL.

- `Slave_IO_Running`

  Se a thread de E/S foi iniciada e se conectou com sucesso à fonte. Internamente, o estado dessa thread é representado por um dos seguintes três valores:

  - **MYSQL_SLAVE_NOT_RUN.** A thread de I/O da replica não está em execução. Para este estado, `Slave_IO_Running` é `No`.

  - **MYSQL_SLAVE_RUN_NOT_CONNECT.** A thread de I/O da replica está em execução, mas não está conectada a uma fonte de replicação. Para este estado, `Slave_IO_Running` é `Conectando`.

  - **MYSQL_SLAVE_RUN_CONNECT.** A thread de I/O da replica está em execução e está conectada a uma fonte de replicação. Para este estado, `Slave_IO_Running` é `Sim`.

  O valor da variável de status do sistema `Slave_running` corresponde a esse valor.

- `Slave_SQL_Running`

  Se o fio SQL foi iniciado.

- `Replicate_Do_DB`, `Replicate_Ignore_DB`

  As listas de bancos de dados especificadas com as opções `--replicate-do-db` e `--replicate-ignore-db`, se houver.

- `Replicar_Na_Tabela`, `Replicar_Ignorar_Na_Tabela`, `Replicar_Com_Caracteres_Especiais_Na_Tabela`, `Replicar_Com_Caracteres_Especiais_Ignorar_Na_Tabela`

  As listas de tabelas especificadas com as opções `--replicate-do-table`, `--replicate-ignore-table`, `--replicate-wild-do-table` e `--replicate-wild-ignore-table`, se houver.

- `Last_Errno`, `Last_Error`

  Essas colunas são aliases para `Last_SQL_Errno` e `Last_SQL_Error`.

  A emissão de `RESET MASTER` ou `RESET SLAVE` redefiniu os valores exibidos nessas colunas.

  Nota

  Quando o fio de replicação SQL recebe um erro, ele relata o erro primeiro e, em seguida, para o fio SQL. Isso significa que há uma pequena janela de tempo durante a qual `SHOW SLAVE STATUS` mostra um valor diferente de zero para `Last_SQL_Errno`, mesmo que `Slave_SQL_Running` ainda mostre `Sim`.

- `Contator de pular`

  O valor atual da variável de sistema [`sql_slave_skip_counter`](https://pt.wikibooks.org/wiki/Replication_options_replica.html#sysvar_sql_slave_skip_counter). Consulte [Seção 13.4.2.4, "Sintaxe de SET GLOBAL sql_slave_skip_counter"](https://pt.wikibooks.org/wiki/Replication_options_replica.html#set-global-sql-slave-skip-counter).

- `Exec_Master_Log_Pos`

  A posição no arquivo de log binário de origem atual para a qual o thread SQL leu e executou, marcando o início da próxima transação ou evento a ser processado. Você pode usar esse valor com a opção `MASTER_LOG_POS` da instrução `CHANGE MASTER TO` ao iniciar uma nova replica a partir de uma replica existente, para que a nova replica leia a partir desse ponto. As coordenadas fornecidas por (`Relay_Master_Log_File`, `Exec_Master_Log_Pos`) no log binário da origem correspondem às coordenadas fornecidas por (`Relay_Log_File`, `Relay_Log_Pos`) no log do retransmissor.

  Inconsistências na sequência das transações do log de retransmissão que foram executadas podem fazer com que esse valor seja um "limite mínimo". Em outras palavras, as transações que aparecem antes da posição são garantidas para terem sido concluídas, mas as transações após a posição podem ter sido concluídas ou não. Se essas lacunas precisam ser corrigidas, use `START SLAVE UNTIL SQL_AFTER_MTS_GAPS`. Consulte Seção 16.4.1.32, “Replicação e Inconsistências de Transações” para obter mais informações.

- `Relay_Log_Space`

  O tamanho total combinado de todos os arquivos de registro de relé existentes.

- `Até_Condição`, `Até_Arquivo_Log`, `Até_Pos_Log`

  Os valores especificados na cláusula `UNTIL` da declaração `START SLAVE`.

  `Até_Condição` tem esses valores:

  - `Nenhum` se nenhuma cláusula `UNTIL` foi especificada

  - `Master` se a replica estiver lendo até uma posição específica no log binário da fonte

  - `Relay` se a réplica estiver lendo até uma posição específica no log de retransmissão

  - `SQL_BEFORE_GTIDS` se o thread SQL da replica estiver processando transações até atingir a primeira transação cujo GTID está listado no `gtid_set`.

  - `SQL_AFTER_GTIDS` se as threads da replica estiverem processando todas as transações até que a última transação no `gtid_set` tenha sido processada por ambas as threads.

  - `SQL_AFTER_MTS_GAPS` se os threads SQL de uma replica multithread estiverem em execução até que mais lacunas não sejam encontradas no log de retransmissão.

  `Until_Log_File` e `Until_Log_Pos` indicam o nome do arquivo de log e a posição que definem as coordenadas em que o thread SQL para de executar.

  Para mais informações sobre as cláusulas `UNTIL`, consulte Seção 13.4.2.5, "Instrução START SLAVE".

- `Master_SSL_Allowed`, `Master_SSL_CA_File`, `Master_SSL_CA_Path`, `Master_SSL_Cert`, `Master_SSL_Cipher`, `Master_SSL_CRL_File`, `Master_SSL_CRL_Path`, `Master_SSL_Key`, `Master_SSL_Verify_Server_Cert`

  Esses campos mostram os parâmetros SSL usados pela replica para se conectar à fonte, se houver.

  `Master_SSL_Allowed` tem esses valores:

  - Sim, se uma conexão SSL para a fonte for permitida

  - `Não` se uma conexão SSL para a fonte não for permitida

  - `Ignorado` se uma conexão SSL for permitida, mas o servidor replicador não tiver o suporte SSL habilitado

  Os valores dos outros campos relacionados ao SSL correspondem aos valores das opções `MASTER_SSL_CA`, `MASTER_SSL_CAPATH`, `MASTER_SSL_CERT`, `MASTER_SSL_CIPHER`, `MASTER_SSL_CRL`, `MASTER_SSL_CRLPATH`, `MASTER_SSL_KEY` e `MASTER_SSL_VERIFY_SERVER_CERT` da declaração `ALTERAR MASTER PARA` (change-master-to.html). Veja Seção 13.4.2.1, “Declaração ALTERAR MASTER PARA”.

- `Segundos_Atrás_do_Master`

  Esse campo indica o quão “tardia” é a réplica:

  - Quando a réplica está processando ativamente as atualizações, este campo mostra a diferença entre o timestamp atual na réplica e o timestamp original registrado na fonte para o evento que está sendo processado na réplica.

  - Quando nenhum evento está sendo processado na replica, esse valor é 0.

  Em essência, este campo mede a diferença de tempo em segundos entre o fio de SQL da replica e o fio de E/S da replica. Se a conexão de rede entre a fonte e a replica for rápida, o fio de E/S da replica estará muito próximo da fonte, então este campo é uma boa aproximação de quão atrasado o fio de SQL da replica está em relação à fonte. Se a rede for lenta, isso *não* é uma boa aproximação; o fio de SQL da replica pode estar frequentemente atrasado em relação ao fio de E/S da replica que lê lentamente, então `Seconds_Behind_Master` muitas vezes mostra um valor de 0, mesmo que o fio de E/S esteja atrasado em relação à fonte. Em outras palavras, *esta coluna é útil apenas para redes rápidas*.

  Essa computação da diferença de tempo funciona mesmo se a fonte e a réplica não tiverem tempos de relógio idênticos, desde que a diferença, calculada quando a thread de E/S da réplica começa, permaneça constante a partir daí. Quaisquer alterações — incluindo atualizações do NTP — podem levar a desalinhamentos de relógio que podem tornar o cálculo de `Seconds_Behind_Master` menos confiável.

  No MySQL 5.7, este campo é `NULL` (definido como indefinido ou desconhecido) se o fio de SQL da replica não estiver em execução ou se o fio de I/O da replica não estiver em execução e o log de retransmissão tiver sido consumido. (Em versões mais antigas do MySQL, este campo era `NULL` se o fio de SQL da replica ou o fio de I/O da replica não estivesse em execução ou não estivesse conectado à fonte.) Se o fio de I/O estiver em execução, mas o log de retransmissão estiver esgotado, `Seconds_Behind_Master` é definido como 0.

  O valor de `Seconds_Behind_Master` é baseado nos timestamps armazenados nos eventos, que são preservados através da replicação. Isso significa que, se uma fonte M1 for ela mesma uma réplica de M0, qualquer evento do log binário de M1 que tenha origem no log binário de M0 terá o timestamp de M0 para esse evento. Isso permite que o MySQL replique o `TIMESTAMP` (datetime.html) com sucesso. No entanto, o problema para `Seconds_Behind_Master` é que, se M1 também receber atualizações diretas de clientes, o valor de `Seconds_Behind_Master` flutua aleatoriamente porque, às vezes, o último evento de M1 tem origem em M0 e, outras vezes, é o resultado de uma atualização direta em M1.

  Ao usar uma replica multithreading, você deve ter em mente que esse valor é baseado em `Exec_Master_Log_Pos`, e, portanto, pode não refletir a posição da transação mais recentemente confirmada.

- `Last_IO_Errno`, `Last_IO_Error`

  O número do erro e a mensagem de erro do erro mais recente que causou o bloqueio da thread de E/S. Um número de erro de 0 e uma mensagem de uma string vazia significam “sem erro”. Se o valor `Last_IO_Error` não estiver vazio, os valores de erro também aparecem no log de erro da replica.

  As informações sobre erros de E/S incluem um timestamp que mostra quando o erro mais recente da thread de E/S ocorreu. Esse timestamp usa o formato *`YYMMDD hh:mm:ss`* e aparece na coluna `Last_IO_Error_Timestamp`.

  A emissão de `RESET MASTER` ou `RESET SLAVE` redefiniu os valores exibidos nessas colunas.

- `Last_SQL_Errno`, `Last_SQL_Error`

  O número do erro e a mensagem de erro do erro mais recente que causou o término do thread SQL. Um número de erro de 0 e uma mensagem de string vazia significam “sem erro”. Se o valor `Last_SQL_Error` não estiver vazio, os valores do erro também aparecem no log de erro da replica.

  Se a replica for multithreading, o thread SQL é o coordenador dos threads de trabalho. Nesse caso, o campo `Last_SQL_Error` mostra exatamente o que a coluna `Last_Error_Message` na tabela do Schema de Desempenho `replication_applier_status_by_coordinator` mostra. O valor do campo é modificado para sugerir que pode haver mais falhas nos outros threads de trabalho, que podem ser vistas na tabela `replication_applier_status_by_worker` que mostra o status de cada thread de trabalho. Se essa tabela não estiver disponível, o log de erro da replica pode ser usado. O log ou a tabela `replication_applier_status_by_worker` também deve ser usada para saber mais sobre a falha mostrada por `SHOW SLAVE STATUS` ou a tabela do coordenador.

  As informações de erro SQL incluem um timestamp que mostra quando o erro mais recente do thread SQL ocorreu. Esse timestamp usa o formato *`YYMMDD hh:mm:ss`* e aparece na coluna `Last_SQL_Error_Timestamp`.

  A emissão de `RESET MASTER` ou `RESET SLAVE` redefiniu os valores exibidos nessas colunas.

  No MySQL 5.7, todos os códigos de erro e mensagens exibidos nas colunas `Last_SQL_Errno` e `Last_SQL_Error` correspondem aos valores de erro listados em Referência de Mensagem de Erro do Servidor. Isso não era sempre verdade em versões anteriores. (Bug #11760365, Bug #52768)

- `Replicate_Ignore_Server_Ids`

  No MySQL 5.7, você define uma replica para ignorar eventos de 0 ou mais fontes usando a opção `IGNORE_SERVER_IDS` da instrução `CHANGE MASTER TO`. Por padrão, essa opção está em branco e geralmente é modificada apenas ao usar uma configuração de replicação circular ou de múltiplas fontes. A mensagem exibida para `Replicate_Ignore_Server_Ids` quando não está em branco consiste em uma lista separada por vírgula de um ou mais números, indicando os IDs de servidor a serem ignorados. Por exemplo:

  ```sql
  	Replicate_Ignore_Server_Ids: 2, 6, 9
  ```

  Nota

  `Ignored_server_ids` também mostra os IDs dos servidores a serem ignorados, mas é uma lista delimitada por espaços, que é precedida pelo número total de IDs de servidores a serem ignorados. Por exemplo, se uma declaração `CHANGE MASTER TO` contendo a opção `IGNORE_SERVER_IDS = (2,6,9)` tiver sido emitida para dizer a uma réplica que ignore fontes com o ID de servidor 2, 6 ou 9, essa informação aparece conforme mostrado aqui:

  ```sql
  	Ignored_server_ids: 3, 2, 6, 9
  ```

  O primeiro número (neste caso, `3`) indica o número de IDs de servidor que estão sendo ignoradas.

  O filtro `Replicate_Ignore_Server_Ids` é realizado pela thread de E/S, e não pela thread SQL, o que significa que os eventos que são filtrados não são escritos no log de retransmissão. Isso difere das ações de filtragem realizadas por opções do servidor, como `--replicate-do-table`, que se aplicam à thread SQL.

- `Master_Server_Id`

  O valor do [`server_id`](https://docs.mariadb.org/mariadb/en/latest/replication-options.html#sysvar_server_id) da fonte.

- `Master_UUID`

  O valor [`server_uuid`](https://pt.wikipedia.org/wiki/Replicação_de_servidor#sysvar_server_uuid) da fonte.

- `Master_Info_File`

  Localização do arquivo `master.info`.

- `SQL_Delay`

  O número de segundos que a réplica deve ficar atrasada em relação à fonte.

- `SQL_Remaining_Delay`

  Quando `Slave_SQL_Running_State` é `Aguardando até que o evento MASTER_DELAY segundos após o evento do mestre seja executado`, este campo contém o número de segundos de atraso restantes. Em outros momentos, este campo é `NULL`.

- `Slave_SQL_Running_State`

  O estado do fio SQL (análogo ao `Slave_IO_State`). O valor é idêntico ao valor `State` do fio SQL SQL, conforme exibido por `SHOW PROCESSLIST`. Seção 8.14.7, “Estados dos fios SQL Replica da Replicação”, fornece uma lista dos possíveis estados

- `Master_Retry_Count`

  O número de vezes que a réplica pode tentar se reconectar à fonte em caso de perda de conexão. Esse valor pode ser definido usando a opção `MASTER_RETRY_COUNT` da instrução `CHANGE MASTER TO` (preferível) ou a opção de servidor mais antiga `--master-retry-count` (replicação-options-replica.html#option_mysqld_master-retry-count) (ainda suportada para compatibilidade reversa).

- `Master_Bind`

  A interface de rede à qual a replica está vinculada, se houver. Isso é definido usando a opção `MASTER_BIND` para a declaração `CHANGE MASTER TO`.

- `Último_Erro_de_Entrada/Saída_Timestamp`

  Um timestamp no formato *`YYMMDD hh:mm:ss`* que mostra quando ocorreu o último erro de E/S.

- `Último_timestamp_do_erro_SQL`

  Um timestamp no formato *`YYMMDD hh:mm:ss`* que mostra quando o erro SQL mais recente ocorreu.

- `Retrieved_Gtid_Set`

  O conjunto de IDs de transação global correspondentes a todas as transações recebidas por esta réplica. Vazio se os GTIDs não estiverem em uso. Consulte GTID Sets para obter mais informações.

  Este é o conjunto de todos os GTIDs que existem ou existiram nos registros do retransmissor. Cada GTID é adicionado assim que o `Gtid_log_event` é recebido. Isso pode fazer com que transações parcialmente transmitidas tenham seus GTIDs incluídos no conjunto.

  Quando todos os logs de relé são perdidos devido à execução de `RESET SLAVE` ou `CHANGE MASTER TO`, ou devido aos efeitos da opção `--relay-log-recovery`, o conjunto é limpo. Quando `relay_log_purge = 1`, o log de relé mais recente é sempre mantido e o conjunto não é limpo.

- `Executed_Gtid_Set`

  O conjunto de IDs de transações globais escritos no log binário. Isso é o mesmo valor da variável de sistema global `gtid_executed` neste servidor, bem como o valor para `Executed_Gtid_Set` na saída de `SHOW MASTER STATUS` neste servidor. Vazio se os GTIDs não estiverem em uso. Consulte GTID Sets para obter mais informações.

- `Auto_Position`

  1 se o autoposicionamento estiver em uso; caso contrário, 0.

- `Replicate_Rewrite_DB`

  O valor `Replicate_Rewrite_DB` exibe quaisquer regras de filtragem de replicação especificadas. Por exemplo, se a seguinte regra de filtro de replicação foi definida:

  ```sql
  CHANGE REPLICATION FILTER REPLICATE_REWRITE_DB=((db1,db2), (db3,db4));
  ```

  o valor `Replicate_Rewrite_DB` exibe:

  ```sql
  Replicate_Rewrite_DB: (db1,db2),(db3,db4)
  ```

  Para mais informações, consulte Seção 13.4.2.2, “Declaração de REPLICAÇÃO DE MUDANÇAS”.

- `Channel_name`

  O canal de replicação que está sendo exibido. Sempre há um canal de replicação padrão, e mais canais de replicação podem ser adicionados. Consulte Seção 16.2.2, “Canais de Replicação” para obter mais informações.

- `Master_TLS_Version`

  A versão TLS usada na fonte. Para informações sobre a versão TLS, consulte Seção 6.3.2, “Protocolos e cifra de conexão encriptada”. Esta coluna foi adicionada no MySQL 5.7.10.
