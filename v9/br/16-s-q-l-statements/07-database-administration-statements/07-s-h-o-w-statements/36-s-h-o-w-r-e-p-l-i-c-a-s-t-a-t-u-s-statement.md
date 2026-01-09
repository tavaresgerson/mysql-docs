#### 15.7.7.36 Declaração de STATUS DA REPLICA

```
SHOW REPLICA STATUS [FOR CHANNEL channel]
```

Esta declaração fornece informações de status sobre os parâmetros essenciais dos threads da replica. A declaração requer o privilégio `REPLICATION CLIENT` (ou o privilégio desatualizado `SUPER`).

`SHOW REPLICA STATUS` é não-bloqueador. Quando executado em conjunto com `STOP REPLICA`, `SHOW REPLICA STATUS` retorna sem esperar que `STOP REPLICA` termine de encerrar o thread de SQL (aplicador) de replicação ou o thread de I/O (receptor) de replicação (ou ambos). Isso permite o uso em monitoramento e outras aplicações onde obter uma resposta imediata de `SHOW REPLICA STATUS` é mais importante do que garantir que ele tenha retornado os dados mais recentes.

Se você emitir esta declaração usando o cliente **mysql**, você pode usar um delimitador de declaração `\G` em vez de um ponto e vírgula para obter um layout vertical mais legível:

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

O Schema de Desempenho fornece tabelas que exibem informações de replicação. Isso é semelhante às informações disponíveis a partir da declaração `SHOW REPLICA STATUS`, mas representadas em forma de tabela. Para detalhes, consulte a Seção 29.12.11, “Tabelas de Replicação do Schema de Desempenho”.

Você pode definir a opção `GTID_ONLY` para a declaração `CHANGE REPLICATION SOURCE TO` para impedir que um canal de replicação persista nomes de arquivos e posições de arquivo nos repositórios de metadados de replicação. Com essa configuração, as posições de arquivo do log binário de origem e do log de relevo são rastreadas na memória. A declaração `SHOW REPLICA STATUS` ainda exibe as posições de arquivo no uso normal. No entanto, como as posições de arquivo não estão sendo atualizadas regularmente no repositório de metadados de conexão e no repositório de metadados do aplicador, exceto em algumas situações, elas provavelmente estarão desatualizadas se o servidor for reiniciado.

Para um canal de replicação com a configuração `GTID_ONLY` após o início do servidor, as posições de arquivo de leitura e aplicada do arquivo binário de log de origem (`Read_Source_Log_Pos` e `Exec_Source_Log_Pos`) são definidas como zero, e os nomes dos arquivos (`Source_Log_File` e `Relay_Source_Log_File`) são definidos como `INVALID`. O nome do arquivo de log de retransmissão (`Relay_Log_File`) é definido de acordo com a configuração relay_log_recovery, seja um novo arquivo que foi criado no início do servidor ou o primeiro arquivo de log de retransmissão presente. A posição do arquivo (`Relay_Log_Pos`) é definida na posição 4, e o auto-salto do GTID é usado para pular quaisquer transações no arquivo que já foram aplicadas.

Quando o thread receptor entra em contato com a origem e obtém informações de posição válidas, a posição de leitura (`Read_Source_Log_Pos`) e o nome do arquivo (`Source_Log_File`) são atualizados com os dados corretos e tornam-se válidos. Quando o thread aplicador aplica uma transação da origem ou pula uma transação já executada, a posição executada (`Exec_Source_Log_Pos`) e o nome do arquivo (`Relay_Source_Log_File`) são atualizados com os dados corretos e tornam-se válidos. A posição do arquivo de log de retransmissão (`Relay_Log_Pos`) também é atualizada nesse momento.

A lista a seguir descreve os campos retornados por `SHOW REPLICA STATUS`. Para obter informações adicionais sobre a interpretação de seus significados, consulte a Seção 19.1.7.1, “Verificação do Status da Replicação”.

* `Replica_IO_State`

  Uma cópia do campo `State` da saída `SHOW PROCESSLIST` para o thread de I/O de replicação (receptor). Isso informa o que o thread está fazendo: tentando se conectar à origem, esperando eventos da origem, reconectando-se à origem, e assim por diante. Para uma lista de possíveis estados, consulte a Seção 10.14.5, “Estados de Thread de I/O de Replicação (Receptor)”).

* `Source_Host`

O hospedeiro de origem ao qual a replica está conectada.

* `Source_User`

  O nome do usuário da conta usada para se conectar à origem.

* `Source_Port`

  A porta usada para se conectar à origem.

* `Connect_Retry`

  O número de segundos entre os tentativas de conexão (padrão 60). Isso pode ser definido com uma declaração `ALTERAR A ORIGEM DA REPLICA`.

* `Source_Log_File`

  O nome do arquivo de log binário de origem a partir do qual o thread de I/O (receptor) está lendo atualmente. Isso é definido como `INVALIDO` para um canal de replicação com a configuração `GTID_ONLY` após o início de um servidor. Ele será atualizado quando a replica entrar em contato com a origem.

* `Read_Source_Log_Pos`

  A posição no arquivo de log binário de origem atual até a qual o thread de I/O (receptor) leu. Isso é definido como zero para um canal de replicação com a configuração `GTID_ONLY` após o início de um servidor. Ele será atualizado quando a replica entrar em contato com a origem.

* `Relay_Log_File`

  O nome do arquivo de log de retransmissão a partir do qual o thread de SQL (aplicador) está lendo e executando atualmente.

* `Relay_Log_Pos`

  A posição no arquivo de log de retransmissão atual até a qual o thread de SQL (aplicador) leu e executou.

* `Relay_Source_Log_File`

  O nome do arquivo de log binário de origem que contém o evento mais recente executado pelo thread de SQL (aplicador). Isso é definido como `INVALIDO` para um canal de replicação com a configuração `GTID_ONLY` após o início de um servidor. Ele será atualizado quando uma transação for executada ou ignorada.

* `Replica_IO_Running`

  Se o thread de I/O de replicação (receptor) foi iniciado e se conectou com sucesso à origem. Internamente, o estado desse thread é representado por um dos seguintes três valores:

+ **MYSQL_REPLICA_REPLICA_NOT_EXECUTADA.** A thread de I/O de replicação (receptor) não está sendo executada. Para este estado, `Replica_IO_Running` é `No`.

+ **MYSQL_REPLICA_EXECUTADA_NÃO_CONECTADA.** A thread de I/O de replicação (receptor) está sendo executada, mas não está conectada a uma fonte de replicação. Para este estado, `Replica_IO_Running` é `Conectando`.

+ **MYSQL_REPLICA_EXECUTADA_CONECTADA.** A thread de I/O de replicação (receptor) está sendo executada e está conectada a uma fonte de replicação. Para este estado, `Replica_IO_Running` é `Sim`.

* `Replica_SQL_EXECUTADA`

  Se a thread de SQL de replicação (aplicador) foi iniciada.

* `Replicate_Do_DB`, `Replicate_Ignore_DB`

  Os nomes de quaisquer bancos de dados especificados com as opções `--replicate-do-db` e `--replicate-ignore-db`, ou a declaração `ALTER REPLICATION FILTER`. Se a cláusula `FOR CHANNEL` foi usada, os filtros de replicação específicos do canal são mostrados. Caso contrário, os filtros de replicação para cada canal de replicação são mostrados.

* `Replicate_Do_Table`, `Replicate_Ignore_Table`, `Replicate_Wild_Do_Table`, `Replicate_Wild_Ignore_Table`

  Os nomes de quaisquer tabelas especificadas com as opções `--replicate-do-table`, `--replicate-ignore-table`, `--replicate-wild-do-table` e `--replicate-wild-ignore-table`, ou a declaração `ALTER REPLICATION FILTER`. Se a cláusula `FOR CHANNEL` foi usada, os filtros de replicação específicos do canal são mostrados. Caso contrário, os filtros de replicação para cada canal de replicação são mostrados.

* `Last_Errno`, `Last_Error`

  Essas colunas são aliases para `Last_SQL_Errno` e `Last_SQL_Error`.

  A execução de `RESET BINARY LOGS AND GTIDS` ou `RESET REPLICA` redefiniu os valores mostrados nessas colunas.

Nota

Quando o fio de replicação SQL recebe um erro, ele relata o erro primeiro e, em seguida, para o fio SQL. Isso significa que há uma pequena janela de tempo durante a qual o `SHOW REPLICA STATUS` exibe um valor diferente de zero para `Last_SQL_Errno`, mesmo que `Replica_SQL_Running` ainda mostre `Yes`.

* `Skip_Counter`

  O valor atual da variável de sistema `sql_replica_skip_counter`.

* `Exec_Source_Log_Pos`

  A posição no arquivo binário de log de origem atual para a qual o fio SQL de replicação leu e executou, marcando o início da próxima transação ou evento a ser processado. Isso é definido para zero para um canal de replicação com o ajuste `GTID_ONLY` após o início de um servidor. Ele será atualizado quando uma transação for executada ou ignorada.

  Você pode usar esse valor com a opção `SOURCE_LOG_POS` da declaração `CHANGE REPLICATION SOURCE TO` ao iniciar uma nova replica a partir de uma replica existente, para que a nova replica leia a partir desse ponto. As coordenadas fornecidas por (`Relay_Source_Log_File`, `Exec_Source_Log_Pos`) no log binário da origem correspondem às coordenadas fornecidas por (`Relay_Log_File`, `Relay_Log_Pos`) no log de retransmissão.

  Inconsistências na sequência de transações do log de retransmissão que foram executadas podem fazer com que esse valor seja um "limite mínimo". Em outras palavras, transações que aparecem antes da posição são garantidas para terem sido concluídas, mas transações após a posição podem ter sido concluídas ou não. Se essas lacunas precisam ser corrigidas, use `START REPLICA UNTIL SQL_AFTER_MTS_GAPS`. Consulte a Seção 19.5.1.35, “Inconsistências de Replicação e Transações”, para obter mais informações.

* `Relay_Log_Space`

  O tamanho combinado total de todos os arquivos de log de retransmissão existentes.

* `Until_Condition`, `Until_Log_File`, `Until_Log_Pos`

Os valores especificados na cláusula `UNTIL` da declaração `START REPLICA`.

`Until_Condition` tem esses valores:

+ `None` se nenhuma cláusula `UNTIL` foi especificada.

+ `Source` se a replica estiver lendo até uma posição dada no log binário da fonte.

+ `Relay` se a replica estiver lendo até uma posição dada no log de retransmissão dela.

+ `SQL_BEFORE_GTIDS` se o thread SQL de replicação estiver processando transações até alcançar a primeira transação cujo GTID está listado no `gtid_set`.

+ `SQL_AFTER_GTIDS` se os threads de replicação estiverem processando todas as transações até que a última transação no `gtid_set` tenha sido processada por ambos os threads.

+ `SQL_AFTER_MTS_GAPS` se os threads SQL de uma replica multithread estiverem em execução até que mais lacunas não sejam encontradas no log de retransmissão.

`Until_Log_File` e `Until_Log_Pos` indicam o nome do arquivo de log e a posição que definem as coordenadas em que o thread SQL de replicação para de executar.

Para mais informações sobre as cláusulas `UNTIL`, consulte a Seção 15.4.2.4, “Declaração START REPLICA”.

* `Source_SSL_Allowed`, `Source_SSL_CA_File`, `Source_SSL_CA_Path`, `Source_SSL_Cert`, `Source_SSL_Cipher`, `Source_SSL_CRL_File`, `Source_SSL_CRL_Path`, `Source_SSL_Key`, `Source_SSL_Verify_Server_Cert`

Esses campos mostram os parâmetros SSL usados pela replica para se conectar à fonte, se houver.

`Source_SSL_Allowed` tem esses valores:

+ `Yes` se uma conexão SSL com a fonte é permitida.

+ `No` se uma conexão SSL com a fonte não é permitida.

+ `Ignored` se uma conexão SSL é permitida, mas o servidor da replica não tem suporte SSL habilitado.

Os valores dos outros campos relacionados ao SSL correspondem aos valores das opções `SOURCE_SSL_*` da declaração `CHANGE REPLICATION SOURCE TO`.

* `Seconds_Behind_Source`

Este campo indica o quão "tarde" a replica está:

+ Quando a replica está processando ativamente atualizações, este campo mostra a diferença entre o timestamp atual na replica e o timestamp original registrado na fonte para o evento atualmente sendo processado na replica.

+ Quando nenhum evento está sendo processado na replica, este valor é 0.

Em essência, este campo mede a diferença de tempo em segundos entre o thread de SQL de replicação (aplicador) e o thread de I/O de replicação (receptor). Se a conexão de rede entre a fonte e a replica for rápida, o thread de receptor de replicação está muito próximo da fonte, então este campo é uma boa aproximação de quão tarde o thread de aplicador de replicação está em relação à fonte. Se a rede for lenta, isso *não* é uma boa aproximação; o thread de aplicador de replicação pode muitas vezes ficar atrasado em relação ao thread de receptor de replicação de leitura lenta, então `Seconds_Behind_Source` muitas vezes mostra um valor de 0, mesmo que o thread de receptor de replicação esteja atrasado em relação à fonte. Em outras palavras, *esta coluna é útil apenas para redes rápidas*.

Esta computação da diferença de tempo funciona mesmo se a fonte e a replica não tiverem tempos de relógio idênticos, desde que a diferença, calculada quando o thread de receptor de replicação começa, permaneça constante a partir daí. Quaisquer alterações, incluindo atualizações do NTP, podem levar a distorções no relógio que podem tornar o cálculo de `Seconds_Behind_Source` menos confiável.

No MySQL 9.5, este campo é `NULL` (definido como desconhecido ou nulo) se o thread do aplicável de replicação não estiver em execução ou se o thread do aplicável tiver consumido todo o log de relevo e o thread do receptor de replicação não estiver em execução. (Em versões mais antigas do MySQL, este campo era `NULL` se o thread do aplicável de replicação ou o thread do receptor de replicação não estivesse em execução ou não estivesse conectado à fonte.) Se o thread do receptor de replicação estiver em execução, mas o log de relevo estiver esgotado, `Seconds_Behind_Source` é definido como 0.

O valor de `Seconds_Behind_Source` é baseado nos timestamps armazenados nos eventos, que são preservados através da replicação. Isso significa que, se uma fonte M1 é ela mesma uma réplica de M0, qualquer evento do log binário de M1 que tenha origem no log binário de M0 tem o timestamp de M0 para esse evento. Isso permite que o MySQL replique o `TIMESTAMP` com sucesso. No entanto, o problema para `Seconds_Behind_Source` é que, se M1 também receber atualizações diretas de clientes, o valor de `Seconds_Behind_Source` flutua aleatoriamente porque, às vezes, o último evento de M1 tem origem em M0 e, outras vezes, é o resultado de uma atualização direta em M1.

Ao usar uma replica multithread, você deve ter em mente que este valor é baseado em `Exec_Source_Log_Pos`, e, portanto, pode não refletir a posição da transação mais recentemente comprometida.

* `Last_IO_Errno`, `Last_IO_Error`

O número de erro e a mensagem de erro do erro mais recente que causou o travamento do thread de I/O de replicação (receptor). Um número de erro de 0 e uma mensagem de string vazia significam “sem erro”. Se o valor de `Last_IO_Error` não estiver vazio, os valores de erro também aparecem no log de erro da replica.

As informações sobre erros de E/S incluem um timestamp que mostra quando ocorreu o erro mais recente do thread de E/S (receptor). Esse timestamp usa o formato *`YYMMDD hh:mm:ss`* e aparece na coluna `Last_IO_Error_Timestamp`.

A execução de `RESET BINARY LOGS AND GTIDS` ou `RESET REPLICA` redefiniu os valores exibidos nessas colunas.

* `Last_SQL_Errno`, `Last_SQL_Error`

O número de erro e a mensagem de erro do erro mais recente que causou o cancelamento do thread de SQL (aplicador) de replicação. Um número de erro de 0 e uma mensagem de erro da string vazia significam “sem erro”. Se o valor de `Last_SQL_Error` não estiver vazio, os valores de erro também aparecem no log de erro da replica.

Se a replica for multithread, o thread de SQL de replicação é o coordenador para os threads de trabalho. Nesse caso, o campo `Last_SQL_Error` exibe exatamente o que o campo `Last_Error_Message` na tabela `replication_applier_status_by_coordinator` do Schema de Desempenho mostra. O valor do campo é modificado para sugerir que pode haver mais falhas nos outros threads de trabalho, que podem ser vistas na tabela `replication_applier_status_by_worker` que mostra o status de cada thread de trabalho. Se essa tabela não estiver disponível, o log de erro da replica pode ser usado. O log ou a tabela `replication_applier_status_by_worker` também devem ser usados para saber mais sobre a falha mostrada por `SHOW REPLICA STATUS` ou a tabela coordenador.

As informações sobre erros de SQL incluem um timestamp que mostra quando ocorreu o erro mais recente do thread de SQL (aplicador). Esse timestamp usa o formato *`YYMMDD hh:mm:ss`* e aparece na coluna `Last_SQL_Error_Timestamp`.

A execução de `RESET BINARY LOGS AND GTIDS` ou `RESET REPLICA` redefiniu os valores exibidos nessas colunas.

No MySQL 9.5, todos os códigos de erro e mensagens exibidos nas colunas `Last_SQL_Errno` e `Last_SQL_Error` correspondem aos valores de erro listados na Referência de Mensagens de Erro do Servidor. Isso não era sempre verdade nas versões anteriores. (Bug #11760365, Bug
  #52768)

* `Replicate_Ignore_Server_Ids`

  Quaisquer IDs de servidor que tenham sido especificados usando a opção `IGNORE_SERVER_IDS` da instrução `CHANGE REPLICATION SOURCE TO`, para que a replica ignore eventos desses servidores. Essa opção é usada em uma configuração de replicação circular ou de múltiplas fontes quando um dos servidores é removido. Se algum ID de servidor tiver sido definido dessa maneira, uma lista de vírgulas separando um ou mais números é exibida. Se nenhum ID de servidor tiver sido definido, o campo fica em branco.

  Nota

  O valor `Ignored_server_ids` na tabela `slave_master_info` também mostra os IDs de servidor a serem ignorados, mas como uma lista delimitada por espaços, precedida pelo número total de IDs de servidor a serem ignorados. Por exemplo, se uma instrução `CHANGE REPLICATION SOURCE TO` contendo a opção `IGNORE_SERVER_IDS = (2,6,9)` tiver sido emitida para dizer a uma replica que ignore fontes com o ID de servidor 2, 6 ou 9, essa informação aparece conforme mostrado aqui:

  ```
  	Replicate_Ignore_Server_Ids: 2, 6, 9
  ```

  ```
  	Ignored_server_ids: 3, 2, 6, 9
  ```

  O filtro `Replicate_Ignore_Server_Ids` é realizado pelo thread de I/O (receptor), em vez do thread SQL (aplicador), o que significa que eventos que são filtrados não são escritos no log de retransmissão. Isso difere das ações de filtragem tomadas por opções de servidor como `--replicate-do-table`, que se aplicam ao thread aplicador.

Se `SET gtid_mode=ON` for emitido quando algum canal tiver IDs de servidor existentes definidos com `IGNORE_SERVER_IDS`, a declaração é rejeitada com um erro. Antes de iniciar a replicação baseada em GTID, use `SHOW REPLICA STATUS` para verificar e limpar todas as listas de ID de servidor ignoradas nos servidores envolvidos. Você pode limpar uma lista emitindo uma declaração `CHANGE REPLICATION SOURCE TO` usando `IGNORE_SERVER_IDS=()— ou seja, com uma lista vazia de IDs de servidor.

* `Source_Server_Id`

  O valor `server_id` da fonte.

* `Source_UUID`

  O valor `server_uuid` da fonte.

* `Source_Info_File`

  A localização do arquivo `master.info`, cujo uso agora é desaconselhado. Por padrão, uma tabela é usada em vez do repositório de metadados de conexão da replica.

* `SQL_Delay`

  O número de segundos que a replica deve ficar atrasada em relação à fonte.

* `SQL_Remaining_Delay`

  Quando `Replica_SQL_Running_State` é `Waiting until SOURCE_DELAY seconds after source executed event`, este campo contém o número de segundos de atraso restantes. Em outros momentos, este campo é `NULL`.

* `Replica_SQL_Running_State`

  O estado do thread SQL (análogo ao `Replica_IO_State`). O valor é idêntico ao valor `State` do thread SQL conforme exibido por `SHOW PROCESSLIST`. A seção 10.14.6, “Replication SQL Thread States”, fornece uma lista de possíveis estados.

* `Source_Retry_Count`

  O número de vezes que a replica pode tentar se reconectar à fonte no caso de uma conexão perdida. Esse valor pode ser definido usando a opção `SOURCE_RETRY_COUNT` da declaração `CHANGE REPLICATION SOURCE TO`.

* `Source_Bind`

  A interface de rede à qual a replica está vinculada, se houver. Isso é definido usando a opção `SOURCE_BIND` para a declaração `CHANGE REPLICATION SOURCE TO`.

* `Last_IO_Error_Timestamp`

Um timestamp no formato *`YYMMDD hh:mm:ss`* que mostra quando ocorreu o último erro de E/S.

* `Last_SQL_Error_Timestamp`

  Um timestamp no formato *`YYMMDD hh:mm:ss`* que mostra quando ocorreu o último erro SQL.

* `Retrieved_Gtid_Set`

  O conjunto de IDs de transação global correspondente a todas as transações recebidas por esta réplica. Vazio se os GTIDs não estiverem em uso. Consulte Conjuntos de GTIDs para mais informações.

  Este é o conjunto de todos os GTIDs que existem ou existiram nos logs do repositório. Cada GTID é adicionado assim que o `Gtid_log_event` é recebido. Isso pode fazer com que transações parcialmente transmitidas tenham seus GTIDs incluídos no conjunto.

  Quando todos os logs do repositório são perdidos devido à execução de `RESET REPLICA` ou `CHANGE REPLICATION SOURCE TO`, ou devido aos efeitos da opção `--relay-log-recovery`, o conjunto é limpo. Quando `relay_log_purge = 1`, o log do repositório mais recente é sempre mantido e o conjunto não é limpo.

* `Executed_Gtid_Set`

  O conjunto de IDs de transação global escritos no log binário. Isso é o mesmo valor para a variável de sistema `gtid_executed` global neste servidor, bem como o valor para `Executed_Gtid_Set` na saída de `SHOW BINARY LOG STATUS` neste servidor. Vazio se os GTIDs não estiverem em uso. Consulte Conjuntos de GTIDs para mais informações.

* `Auto_Position`

  1 se o autoposicionamento de GTID estiver em uso para o canal, caso contrário 0.

* `Replicate_Rewrite_DB`

  O valor `Replicate_Rewrite_DB` exibe quaisquer regras de filtragem de replicação especificadas. Por exemplo, se a seguinte regra de filtro de replicação foi definida:

  ```
  CHANGE REPLICATION FILTER REPLICATE_REWRITE_DB=((db1,db2), (db3,db4));
  ```

  o valor `Replicate_Rewrite_DB` exibe:

  ```
  Replicate_Rewrite_DB: (db1,db2),(db3,db4)
  ```

  Para mais informações, consulte a Seção 15.4.2.1, “Instrução de Filtro de Replicação”.

* `Channel_name`

O canal de replicação que está sendo exibido. Sempre há um canal de replicação padrão, e mais canais de replicação podem ser adicionados. Consulte a Seção 19.2.2, “Canais de Replicação” para obter mais informações.

* `Master_TLS_Version`

  A versão TLS usada na fonte. Para informações sobre a versão TLS, consulte a Seção 8.3.2, “Protocolos e Cifras de Conexão Encriptada TLS”.

* `Source_public_key_path`

  O nome do caminho de um arquivo que contém uma cópia do lado do replicador da chave pública necessária pela fonte para a troca de senhas baseada em pares de chaves RSA. O arquivo deve estar no formato PEM. Esta coluna se aplica a réplicas que autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`.

  Se `Source_public_key_path` for fornecido e especificar um arquivo de chave pública válido, ele tem precedência sobre `Get_source_public_key`.

* `Get_source_public_key`

  Se solicitar à fonte a chave pública necessária para a troca de senhas baseada em pares de chaves RSA. Esta coluna se aplica a réplicas que autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, a fonte não envia a chave pública a menos que seja solicitada.

  Se `Source_public_key_path` for fornecido e especificar um arquivo de chave pública válido, ele tem precedência sobre `Get_source_public_key`.

* `Network_Namespace`

  O nome do namespace de rede; vazio se a conexão usar o namespace padrão (global). Para informações sobre namespaces de rede, consulte a Seção 7.1.14, “Suporte a Namespace de Rede”.