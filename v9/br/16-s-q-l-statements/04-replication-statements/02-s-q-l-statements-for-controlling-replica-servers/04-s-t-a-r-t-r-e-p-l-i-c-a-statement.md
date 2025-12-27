#### 15.4.2.4 Declaração `START REPLICA`

```
START REPLICA [thread_types] [until_option] [connection_options] [channel_option]

thread_types:
    [thread_type [, thread_type] ... ]

thread_type:
    IO_THREAD | SQL_THREAD

until_option:
    UNTIL {   {SQL_BEFORE_GTIDS | SQL_AFTER_GTIDS} = gtid_set
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

`START REPLICA` inicia os threads de replicação, seja juntos ou separadamente.

`START REPLICA` requer o privilégio `REPLICATION_SLAVE_ADMIN` (ou o privilégio desatualizado `SUPER`). `START REPLICA` causa um commit implícito de uma transação em andamento. Veja a Seção 15.3.3, “Declarações que causam um commit implícito”.

Para as opções de tipo de thread, você pode especificar `IO_THREAD`, `SQL_THREAD`, ambas as opções, ou nenhuma delas. Apenas os threads iniciados são afetados pela declaração.

* `START REPLICA` sem opções de tipo de thread inicia todos os threads de replicação, assim como `START REPLICA` com ambas as opções de tipo de thread.

* `IO_THREAD` inicia o thread de recebimento de replicação, que lê eventos do servidor de origem e os armazena no log de retransmissão.

* `SQL_THREAD` inicia o thread de aplicação de replicação, que lê eventos do log de retransmissão e os executa. A replica aplica transações usando um thread coordenador e vários threads de aplicação, e `SQL_THREAD` inicia todos esses threads.

Importante

`START REPLICA` envia um reconhecimento ao usuário após todos os threads de replicação terem sido iniciados. No entanto, o thread receptor de replicação ainda pode não ter se conectado ao ponto de origem com sucesso, ou um thread aplicante pode parar ao aplicar um evento logo após o início. `START REPLICA` não continua a monitorar os threads após eles terem sido iniciados, portanto, não avisa se eles pararem ou não conseguirem se conectar posteriormente. Você deve verificar o log de erro da replica para mensagens de erro geradas pelos threads de replicação, ou verificar se eles estão sendo executados satisfatoriamente com `SHOW REPLICA STATUS`. Uma declaração `START REPLICA` bem-sucedida faz com que `SHOW REPLICA STATUS` mostre `Replica_SQL_Running=Yes`, mas pode ou não mostrar `Replica_IO_Running=Yes`, porque `Replica_IO_Running=Yes` é mostrado apenas se o thread receptor estiver em execução e conectado. Para mais informações, consulte a Seção 19.1.7.1, “Verificação do Status da Replicação”.

A cláusula opcional `FOR CHANNEL channel` permite que você nomeie qual canal de replicação a declaração se aplica. Fornecer uma cláusula `FOR CHANNEL channel` aplica a declaração `START REPLICA` a um canal de replicação específico. Se nenhuma cláusula for nomeada e não houver canais extras, a declaração se aplica ao canal padrão. Se uma declaração `START REPLICA` não tiver um canal definido ao usar múltiplos canais, essa declaração inicia os threads especificados para todos os canais. Consulte a Seção 19.2.2, “Canais de Replicação” para mais informações.

Os canais de replicação para a replicação em grupo (`group_replication_applier` e `group_replication_recovery`) são gerenciados automaticamente pela instância do servidor. O `START REPLICA` não pode ser usado de forma alguma com o canal `group_replication_recovery`, e deve ser usado apenas com o canal `group_replication_applier` quando a replicação em grupo não estiver em execução. O canal `group_replication_applier` tem apenas um fio de aplicador e não tem fio de receptor, portanto, pode ser iniciado se necessário usando a opção `SQL_THREAD` sem a opção `IO_THREAD`.

O `START REPLICA` suporta autenticação de usuário e senha intercambiáveis (consulte a Seção 8.2.17, “Autenticação Intercambiável”) com as opções `USER`, `PASSWORD`, `DEFAULT_AUTH` e `PLUGIN_DIR`, conforme descrito na lista a seguir. Ao usar essas opções, você deve iniciar o fio de receptor (`IO_THREAD` opção) ou todos os fios de replicação; você não pode iniciar o fio de aplicador de replicação (`SQL_THREAD` opção) sozinho.

`USER` :   O nome do usuário para a conta. Você deve definir isso se `PASSWORD` for usado. A opção não pode ser definida como uma string vazia ou nula.

`PASSWORD` :   A senha para a conta de usuário nomeada.

`DEFAULT_AUTH` :   O nome do plugin de autenticação. O padrão é a autenticação nativa do MySQL.

`PLUGIN_DIR` :   O local do plugin de autenticação.

Importante

A senha que você definiu usando `START REPLICA` é mascarada quando é escrita nos logs do MySQL Server, nas tabelas do Schema de Desempenho e nas instruções `SHOW PROCESSLIST`. No entanto, ela é enviada em texto simples pela conexão com a instância do servidor de replica. Para proteger a senha em trânsito, use criptografia SSL/TLS, um túnel SSH ou outro método para proteger a conexão de visualização não autorizada, para a conexão entre a instância do servidor de replica e o cliente que você usa para emitir `START REPLICA`.

A cláusula `UNTIL` faz com que a replica comece a replicar, processando as transações até o ponto que você especifica na cláusula `UNTIL`, e depois para de novo. A cláusula `UNTIL` pode ser usada para fazer uma replica prosseguir até pouco antes do ponto em que você deseja pular uma transação indesejada, e depois pular a transação conforme descrito na Seção 19.1.7.3, “Pular Transações”. Para identificar uma transação, você pode usar **mysqlbinlog** com o log binário da fonte ou o log de retransmissão da replica, ou usar uma instrução `SHOW BINLOG EVENTS`.

Você também pode usar a cláusula `UNTIL` para depurar a replica processando as transações uma de cada vez ou em seções. Se você estiver usando a cláusula `UNTIL` para isso, inicie a replica com `--skip-replica-start` para impedir que o thread SQL seja executado quando o servidor de replica começar. Remova a opção ou a variável de sistema após o procedimento ser concluído, para que não seja esquecida em caso de reinício inesperado do servidor.

A instrução `SHOW REPLICA STATUS` inclui campos de saída que exibem os valores atuais da condição `UNTIL`. A condição `UNTIL` dura enquanto os threads afetados ainda estiverem em execução e é removida quando eles param.

A cláusula `UNTIL` opera na thread do aplicador de replicação (`opção SQL_THREAD`). Você pode usar a opção `SQL_THREAD` ou deixar a replica iniciar os dois threads por padrão. Se você usar apenas a opção `IO_THREAD`, a cláusula `UNTIL` será ignorada porque a thread do aplicador não será iniciada.

O ponto que você especifica na cláusula `UNTIL` pode ser qualquer um (e apenas um) dos seguintes:

`SOURCE_LOG_FILE` e `SOURCE_LOG_POS` :   Essas opções fazem com que o processo de aplicador de replicação processe transações até uma posição em seu log de relevo, identificada pelo nome do arquivo e pela posição do arquivo do ponto correspondente no log binário no servidor de origem. A thread do aplicador encontra o limite de transação mais próximo em ou após a posição especificada, termina a aplicação da transação e para ali. Para payloads de transações compactados, especifique a posição final do `Transaction_payload_event` compactado.

Essas opções ainda podem ser usadas quando a opção `GTID_ONLY` foi definida na declaração `CHANGE REPLICATION SOURCE TO` para impedir que o canal de replicação persista nomes de arquivo e posições de arquivo nos repositórios de metadados de replicação. Os nomes de arquivo e posições de arquivo são rastreados na memória.

`RELAY_LOG_FILE` e `RELAY_LOG_POS` :   Essas opções fazem com que o processo de aplicador de replicação processe transações até uma posição no log de relevo da replica, identificada pelo nome do arquivo de log de relevo e uma posição nesse arquivo. A thread do aplicador encontra o limite de transação mais próximo em ou após a posição especificada, termina a aplicação da transação e para ali. Para payloads de transações compactados, especifique a posição final do `Transaction_payload_event` compactado.

Essas opções ainda podem ser usadas quando a opção `GTID_ONLY` foi definida na declaração `CHANGE REPLICATION SOURCE TO` para impedir que o canal de replicação persista nomes de arquivos e posições de arquivos nos repositórios de metadados de replicação. Os nomes de arquivos e posições de arquivos são rastreados na memória.

`SQL_BEFORE_GTIDS` :   Esta opção faz com que o aplicador de replicação comece a processar transações e pare quando encontrar qualquer transação que esteja no conjunto de GTID especificado. A transação encontrada do conjunto de GTID não é aplicada, assim como nenhuma das outras transações no conjunto de GTID. A opção aceita um conjunto de GTID que contém um ou mais identificadores de transação global como argumento (veja Conjuntos de GTID). As transações em um conjunto de GTID não aparecem necessariamente na ordem de seus GTIDs no fluxo de replicação, então a transação antes da qual o aplicador para não é necessariamente a mais antiga.

`SQL_AFTER_GTIDS` :   Esta opção faz com que o aplicador de replicação comece a processar transações e pare quando tiver processado todas as transações em um conjunto de GTID especificado. A opção aceita um conjunto de GTID que contém um ou mais identificadores de transação global como argumento (veja Conjuntos de GTID).

Com `SQL_AFTER_GTIDS`, os threads de replicação param após processarem todas as transações no conjunto de GTID. As transações são processadas na ordem recebida, portanto, é possível que elas incluam transações que não fazem parte do conjunto de GTID, mas que são recebidas (e processadas) antes que todas as transações do conjunto tenham sido confirmadas. Por exemplo, a execução de `START REPLICA ATÉ SQL_AFTER_GTIDS = 3E11FA47-71CA-11E1-9E33-C80AA9429562:11-56` faz com que a replica obtenha (e processe) todas as transações da fonte até que todas as transações com os números de sequência 11 a 56 tenham sido processadas, e então pare sem processar nenhuma transação adicional após esse ponto ter sido alcançado.

`SQL_AFTER_MTS_GAPS` :   Esta opção faz com que a replica processe transações até o ponto em que não haja mais lacunas na sequência de transações executadas a partir do log de retransmissão. Ao usar uma replica multithread, há a possibilidade de lacunas ocorrerem nas seguintes situações:

    * O thread do coordenador é interrompido.
    * Um erro ocorre nos threads do aplicável.
    * **mysqld** é encerrado inesperadamente.

    Quando um canal de replicação tem lacunas, o banco de dados da replica está em um estado que nunca poderia ter existido na fonte. A replica rastreia as lacunas internamente e não permite as instruções `ALTERAR SOURCE DE REPLICA PARA` que removeriam as informações da lacuna se fossem executadas.

Todas as réplicas são multithread por padrão. Quando `replica_preserve_commit_order=ON` na replica (o padrão), as lacunas não devem ocorrer, exceto nas situações específicas listadas na descrição desta variável. Se `replica_preserve_commit_order` for `OFF`, a ordem de confirmação das transações não é preservada, portanto, a chance de lacunas ocorrerem é muito maior.