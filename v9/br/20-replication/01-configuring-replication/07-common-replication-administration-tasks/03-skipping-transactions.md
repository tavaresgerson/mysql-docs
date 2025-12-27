#### 19.1.7.3 Saltar Transações

Se a replicação parar devido a um problema com um evento em uma transação replicada, você pode retomar a replicação saltando a transação falha na replica. Antes de saltar uma transação, certifique-se de que o thread de I/O de replicação (receptor) e o thread de aplicação de SQL (aplicador) estejam parados.

Primeiro, você precisa identificar o evento replicado que causou o erro. Os detalhes do erro e da última transação aplicada com sucesso são registrados na tabela do Schema de Desempenho `replication_applier_status_by_worker`. Você pode usar **mysqlbinlog** para recuperar e exibir os eventos que foram registrados na época do erro. Para obter instruções sobre como fazer isso, consulte a Seção 9.5, “Recuperação Ponto em Ponto (Incremental)”. Alternativamente, você pode emitir `SHOW RELAYLOG EVENTS` na replica ou `SHOW BINLOG EVENTS` na fonte.

Antes de saltar a transação e reiniciar a replica, verifique os seguintes pontos:

* A transação que parou a replicação veio de uma fonte desconhecida ou não confiável? Se sim, investigue a causa, caso haja alguma consideração de segurança que indique que a replica não deve ser reiniciada.

* A transação que parou a replicação precisa ser aplicada na replica? Se sim, faça as correções apropriadas e aplique a transação novamente, ou reconcilie manualmente os dados na replica.

* A transação que parou a replicação precisava ser aplicada na fonte? Se não, desfaça a transação manualmente no servidor onde ela ocorreu originalmente.

Para saltar a transação, escolha um dos seguintes métodos conforme apropriado:

* Quando GTIDs estão em uso (`gtid_mode` é `ON`), veja a Seção 19.1.7.3.1, “Saltar Transações com GTIDs”.

* Quando os GTIDs não estão em uso ou estão sendo implementados (`gtid_mode` é `OFF`, `OFF_PERMISSIVE` ou `ON_PERMISSIVE`), consulte a Seção 19.1.7.3.2, “Ignorar Transações Sem GTIDs”.

* Se você habilitou a atribuição de GTIDs em um canal de replicação usando a opção `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` da declaração `CHANGE REPLICATION SOURCE TO`, consulte a Seção 19.1.7.3.2, “Ignorar Transações Sem GTIDs”. Usar `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` em um canal de replicação não é a mesma coisa que introduzir replicação baseada em GTIDs para o canal, e você não pode usar o método de ignorar transações para replicação baseada em GTIDs com esses canais.

Para reiniciar a replicação após ignorar a transação, execute `START REPLICA`, com a cláusula `FOR CHANNEL` se a replica for uma replica de múltiplos canais.

##### 19.1.7.3.1 Ignorar Transações Com GTIDs

Quando os GTIDs estão em uso (`gtid_mode` é `ON`), o GTID de uma transação confirmada é persistido na replica, mesmo que o conteúdo da transação seja filtrado. Essa funcionalidade impede que uma replica retorne transações filtradas anteriormente quando se reconectar à fonte usando a autoposição de GTIDs. Também pode ser usado para ignorar uma transação na replica, commitando uma transação vazia no lugar da transação falhando.

Esse método de ignorar transações não é adequado quando você habilitou a atribuição de GTIDs em um canal de replicação usando a opção `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` da declaração `CHANGE REPLICATION SOURCE TO`.

Se a transação que falhou gerou um erro em um thread de trabalhador, você pode obter seu GTID diretamente do campo `APPLYING_TRANSACTION` na tabela do Schema de Desempenho `replication_applier_status_by_worker`. Para ver qual transação é, execute `SHOW RELAYLOG EVENTS` na replica ou `SHOW BINLOG EVENTS` na fonte e procure na saída por uma transação precedida por esse GTID.

Quando você tiver avaliado a transação que falhou para qualquer outra ação apropriada, conforme descrito anteriormente (como considerações de segurança), para ignorá-la, comemore uma transação vazia na replica que tenha o mesmo GTID que a transação que falhou. Por exemplo:

```
SET GTID_NEXT='aaa-bbb-ccc-ddd:N';
BEGIN;
COMMIT;
SET GTID_NEXT='AUTOMATIC';
```

A presença dessa transação vazia na replica significa que, quando você emitir uma declaração `START REPLICA` para reiniciar a replicação, a replica usa a função de desvio automático para ignorar a transação que falhou, porque ela vê que uma transação com esse GTID já foi aplicada. Se a replica for uma replica de múltiplas fontes, você não precisa especificar o nome do canal ao cometer a transação vazia, mas você precisa especificar o nome do canal ao emitir `START REPLICA`.

Observe que, se o registro binário estiver em uso nesta replica, a transação vazia entra no fluxo de replicação se a replica se tornar uma fonte ou primária no futuro. Se você precisar evitar essa possibilidade, considere limpar e purgar os logs binários da replica, como neste exemplo:

```
FLUSH LOGS;
PURGE BINARY LOGS TO 'binlog.000146';
```

O GTID da transação vazia é persistido, mas a própria transação é removida ao purgar os arquivos de log binário.

##### 19.1.7.3.2 Desvio de Transações Sem GTIDs
English:
If the failing transaction generated an error in a worker thread, you can obtain its GTID directly from the `APPLYING_TRANSACTION` field in the Performance Schema table `replication_applier_status_by_worker`. To see what the transaction is, issue `SHOW RELAYLOG EVENTS` on the replica or `SHOW BINLOG EVENTS` on the source, and search the output for a transaction preceded by that GTID.

When you have assessed the failing transaction for any other appropriate actions as described previously (such as security considerations), to skip it, commit an empty transaction on the replica that has the same GTID as the failing transaction. For example:

```
SET GLOBAL sql_replica_skip_counter = N
```

The presence of this empty transaction on the replica means that when you issue a `START REPLICA` statement to restart replication, the replica uses the auto-skip function to ignore the failing transaction, because it sees a transaction with that GTID has already been applied. If the replica is a multi-source replica, you do not need to specify the channel name when you commit the empty transaction, but you do need to specify the channel name when you issue `START REPLICA`.

Note that if binary logging is in use on this replica, the empty transaction enters the replication stream if the replica becomes a source or primary in the future. If you need to avoid this possibility, consider flushing and purging the replica's binary logs, as in this example:

```
CHANGE REPLICATION SOURCE TO SOURCE_LOG_FILE='source_log_name', SOURCE_LOG_POS=source_log_pos;
```

The GTID of the empty transaction is persisted, but the transaction itself is removed by purging the binary log files.

Para ignorar transações que falham quando os GTIDs não estão em uso ou estão sendo implementados (`gtid_mode` é `OFF`, `OFF_PERMISSIVE` ou `ON_PERMISSIVE`), você pode ignorar um número especificado de eventos emitindo `SET GLOBAL sql_replica_skip_counter`. Alternativamente, você pode ignorar um evento ou eventos emitindo uma declaração `CHANGE REPLICATION SOURCE TO` para avançar a posição do log binário de origem.

Esses métodos também são adequados quando você habilitou a atribuição de GTIDs em um canal de replicação usando a opção `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` da declaração `CHANGE REPLICATION SOURCE TO`.

Ao usar esses métodos, é importante entender que você não está necessariamente ignorando uma transação completa, como é o caso sempre com o método baseado em GTID descrito anteriormente. Esses métodos não baseados em GTIDs não estão cientes das transações como tal, mas operam em eventos. O log binário é organizado como uma sequência de grupos conhecidos como grupos de eventos, e cada grupo de eventos consiste em uma sequência de eventos.

* Para tabelas transacionais, um grupo de eventos corresponde a uma transação.

* Para tabelas não transacionais, um grupo de eventos corresponde a uma única declaração SQL.

Embora seja possível que uma única transação contenha alterações em tabelas transacionais e não transacionais, o suporte para tais transações é desatualizado e você deve esperar que seja removido em uma versão futura do MySQL. Veja a Seção 19.5.1.36, “Replicação e Transações”. Para algumas das razões dessa desatualização, veja a Seção 19.1.3.7, “Restrições na Replicação com GTIDs”.

Quando você usa uma declaração `SET GLOBAL sql_replica_skip_counter` para pular eventos e a posição resultante estiver no meio de um grupo de eventos, a replica continua a pular eventos até chegar ao final do grupo. A execução então começa com o próximo grupo de eventos. A declaração `CHANGE REPLICATION SOURCE TO` não tem essa função, então você deve ter cuidado para identificar a localização correta para reiniciar a replicação no início de um grupo de eventos. No entanto, ao usar `CHANGE REPLICATION SOURCE TO`, você não precisa contar os eventos que precisam ser pular, como faz com `SET GLOBAL sql_replica_skip_counter`, e, em vez disso, você pode simplesmente especificar a localização para reiniciar.

###### 19.1.7.3.2.1 Pular Transações com `SET GLOBAL sql_replica_skip_counter`

Quando você avaliou a transação falhando para quaisquer outras ações apropriadas, conforme descrito anteriormente (como considerações de segurança), conte o número de eventos que você precisa pular. Um evento normalmente corresponde a uma declaração SQL no log binário, mas note que as declarações que usam `AUTO_INCREMENT` ou `LAST_INSERT_ID()` contam como dois eventos no log binário. Quando a compressão de transações no log binário está em uso, um payload de transação comprimido (`Transaction_payload_event`) é contado como um único valor de contador, então todos os eventos dentro dele são pular como uma unidade.

Se você quiser pular a transação completa, você pode contar os eventos até o final da transação, ou você pode apenas pular o grupo de eventos relevante. Lembre-se de que, com `SET GLOBAL sql_replica_skip_counter`, a replica continua a pular até o final de um grupo de eventos. Certifique-se de não pular muito para frente e ir para o próximo grupo de eventos ou transação para que ele também não seja pular.

Emita a declaração `SET` da seguinte forma, onde *`N`* é o número de eventos da fonte a serem ignorados:

```
CHANGE REPLICATION SOURCE TO SOURCE_AUTO_POSITION=0, SOURCE_LOG_FILE='binlog.000145', SOURCE_LOG_POS=235;
CHANGE REPLICATION SOURCE TO SOURCE_AUTO_POSITION=1;
```

Esta declaração não pode ser emitida se `gtid_mode=ON` estiver definido ou se as threads de I/O de replicação (receptor) e SQL (aplicador) estiverem em execução.

A declaração `SET GLOBAL sql_replica_skip_counter` não tem efeito imediato. Quando você emitir a declaração `START REPLICA` da próxima vez após essa declaração `SET`, o novo valor da variável de sistema `sql_replica_skip_counter` é aplicado e os eventos são ignorados. Essa declaração `START REPLICA` também define automaticamente o valor da variável de sistema de volta para

0. Se a replica for uma replica de múltiplas fontes, quando você emitir essa declaração `START REPLICA`, a cláusula `FOR CHANNEL` é necessária. Certifique-se de nomear o canal correto, caso contrário, os eventos serão ignorados no canal errado.

###### 19.1.7.3.2.2 Ignorar Transações com CHANGE REPLICATION SOURCE TO

Quando você tiver avaliado a transação falhando para quaisquer outras ações apropriadas, conforme descrito anteriormente (como considerações de segurança), identifique as coordenadas (arquivo e posição) no log binário da fonte que representam uma posição adequada para reiniciar a replicação. Isso pode ser o início do grupo de eventos após o evento que causou o problema ou o início da próxima transação. A thread de I/O de replicação (receptor) começa a ler a partir da fonte nessas coordenadas da próxima vez que a thread começar, ignorando o evento falhando. Certifique-se de que você identificou a posição com precisão, porque essa declaração não leva em conta os grupos de eventos.

Emita a declaração `CHANGE REPLICATION SOURCE TO` da seguinte forma, onde *`source_log_name`* é o arquivo de log binário que contém a posição de reinício, e *`source_log_pos`* é o número que representa a posição de reinício conforme declarado no arquivo de log binário:



Se a replica for uma replica de múltiplos canais, você deve usar a cláusula `FOR CHANNEL` para nomear o canal apropriado na declaração `CHANGE REPLICATION SOURCE TO`.

Esta declaração não pode ser emitida se `SOURCE_AUTO_POSITION` for `1`, ou se os threads de I/O de replicação (receptor) e SQL (aplicador) estiverem em execução. Se você precisar usar esse método de pular uma transação quando `SOURCE_AUTO_POSITION=1`, você pode alterar o ajuste para `SOURCE_AUTO_POSITION=0` enquanto emite a declaração, e depois alterá-lo novamente. Por exemplo:

