#### 21.6.8.2 Usando o NDB Cluster Management Client para Criar um Backup

Antes de iniciar um backup, certifique-se de que o cluster esteja configurado corretamente para realizar um. (Consulte [Seção 21.6.8.3, “Configuração para Backups do NDB Cluster”](mysql-cluster-backup-configuration.html "21.6.8.3 Configuration for NDB Cluster Backups").)

O comando `START BACKUP` é usado para criar um backup:

```sql
START BACKUP [backup_id] [wait_option] [snapshot_option]

wait_option:
WAIT {STARTED | COMPLETED} | NOWAIT

snapshot_option:
SNAPSHOTSTART | SNAPSHOTEND
```

Backups sucessivos são identificados automaticamente de forma sequencial, portanto, o *`backup_id`*, um inteiro maior ou igual a 1, é opcional; se for omitido, o próximo valor disponível é utilizado. Se um valor *`backup_id`* existente for usado, o backup falha com o erro Backup failed: file already exists. Se usado, o *`backup_id`* deve seguir `START BACKUP` imediatamente, antes que qualquer outra opção seja utilizada.

O *`wait_option`* pode ser usado para determinar quando o controle é retornado ao management client após a emissão de um comando `START BACKUP`, conforme mostrado na lista a seguir:

* Se `NOWAIT` for especificado, o management client exibe um prompt imediatamente, como visto aqui:

  ```sql
  ndb_mgm> START BACKUP NOWAIT
  ndb_mgm>
  ```

  Neste caso, o management client pode ser usado mesmo enquanto imprime informações de progresso do backup process.

* Com `WAIT STARTED`, o management client aguarda até que o backup tenha iniciado antes de retornar o controle ao usuário, conforme mostrado aqui:

  ```sql
  ndb_mgm> START BACKUP WAIT STARTED
  Waiting for started, this may take several minutes
  Node 2: Backup 3 started from node 1
  ndb_mgm>
  ```

* **`WAIT COMPLETED`** faz com que o management client aguarde até que o backup process esteja completo antes de retornar o controle ao usuário.

`WAIT COMPLETED` é o padrão.

Um *`snapshot_option`* pode ser usado para determinar se o backup corresponde ao estado do cluster quando `START BACKUP` foi emitido, ou quando foi concluído. `SNAPSHOTSTART` faz com que o backup corresponda ao estado do cluster quando o backup começou; `SNAPSHOTEND` faz com que o backup reflita o estado do cluster quando o backup foi finalizado. `SNAPSHOTEND` é o padrão e corresponde ao comportamento encontrado em versões anteriores do NDB Cluster.

Note

Se você usar a opção `SNAPSHOTSTART` com `START BACKUP`, e o parâmetro [`CompressedBackup`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-compressedbackup) estiver habilitado, apenas os arquivos de data e control são compactados — o log file não é compactado.

Se um *`wait_option`* e um *`snapshot_option`* forem usados, eles podem ser especificados em qualquer ordem. Por exemplo, todos os comandos a seguir são válidos, assumindo que não haja um backup existente com o ID 4:

```sql
START BACKUP WAIT STARTED SNAPSHOTSTART
START BACKUP SNAPSHOTSTART WAIT STARTED
START BACKUP 4 WAIT COMPLETED SNAPSHOTSTART
START BACKUP SNAPSHOTEND WAIT COMPLETED
START BACKUP 4 NOWAIT SNAPSHOTSTART
```

O procedimento para criar um backup consiste nas seguintes etapas:

1. Inicie o management client ([**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client")), se ainda não estiver em execução.

2. Execute o comando **`START BACKUP`**. Isso produz várias linhas de output indicando o progresso do backup, conforme mostrado aqui:

   ```sql
   ndb_mgm> START BACKUP
   Waiting for completed, this may take several minutes
   Node 2: Backup 1 started from node 1
   Node 2: Backup 1 started from node 1 completed
    StartGCP: 177 StopGCP: 180
    #Records: 7362 #LogRecords: 0
    Data: 453648 bytes Log: 0 bytes
   ndb_mgm>
   ```

3. Quando o backup tiver iniciado, o management client exibe esta mensagem:

   ```sql
   Backup backup_id started from node node_id
   ```

   *`backup_id`* é o identificador exclusivo para este backup específico. Este identificador é salvo no cluster log, se não tiver sido configurado de outra forma. *`node_id`* é o identificador do management server que está coordenando o backup com os data nodes. Neste ponto do backup process, o cluster recebeu e processou a solicitação de backup. Isso não significa que o backup tenha terminado. Um exemplo desta declaração é mostrado aqui:

   ```sql
   Node 2: Backup 1 started from node 1
   ```

4. O management client indica, com uma mensagem como esta, que o backup foi iniciado:

   ```sql
   Backup backup_id started from node node_id completed
   ```

   Assim como no caso da notificação de que o backup foi iniciado, *`backup_id`* é o identificador exclusivo para este backup específico, e *`node_id`* é o ID do node do management server que está coordenando o backup com os data nodes. Este output é acompanhado por informações adicionais, incluindo checkpoints globais relevantes, o número de records dos quais foi feito backup, e o tamanho dos data, conforme mostrado aqui:

   ```sql
   Node 2: Backup 1 started from node 1 completed
    StartGCP: 177 StopGCP: 180
    #Records: 7362 #LogRecords: 0
    Data: 453648 bytes Log: 0 bytes
   ```

Também é possível realizar um backup a partir do system shell invocando [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client") com a opção `-e` ou [`--execute`](mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_execute), conforme mostrado neste exemplo:

```sql
$> ndb_mgm -e "START BACKUP 6 WAIT COMPLETED SNAPSHOTSTART"
```

Ao usar `START BACKUP` desta forma, você deve especificar o backup ID.

Backups do Cluster são criados por padrão no subdiretório `BACKUP` do [`DataDir`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datadir) em cada data node. Isso pode ser sobrescrito para um ou mais data nodes individualmente, ou para todos os data nodes do cluster no arquivo `config.ini` usando o parâmetro de configuração [`BackupDataDir`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-backupdatadir). Os arquivos de backup criados para um backup com um determinado *`backup_id`* são armazenados em um subdiretório chamado `BACKUP-backup_id` no diretório de backup.

**Cancelando backups.** Para cancelar ou abortar um backup que já esteja em progresso, execute as seguintes etapas:

1. Inicie o management client.
2. Execute este comando:

   ```sql
   ndb_mgm> ABORT BACKUP backup_id
   ```

   O número *`backup_id`* é o identificador do backup que foi incluído na resposta do management client quando o backup foi iniciado (na mensagem `Backup backup_id started from node management_node_id`).

3. O management client reconhece a solicitação de abort com `Abort of backup backup_id ordered`.

   Note

   Neste ponto, o management client ainda não recebeu uma resposta dos cluster data nodes para esta solicitação, e o backup ainda não foi efetivamente abortado.

4. Depois que o backup for abortado, o management client relata este fato de uma maneira semelhante à mostrada aqui:

   ```sql
   Node 1: Backup 3 started from 5 has been aborted.
     Error: 1321 - Backup aborted by user request: Permanent error: User defined error
   Node 3: Backup 3 started from 5 has been aborted.
     Error: 1323 - 1323: Permanent error: Internal error
   Node 2: Backup 3 started from 5 has been aborted.
     Error: 1323 - 1323: Permanent error: Internal error
   Node 4: Backup 3 started from 5 has been aborted.
     Error: 1323 - 1323: Permanent error: Internal error
   ```

   Neste exemplo, mostramos o sample output para um cluster com 4 data nodes, onde o número de sequência do backup a ser abortado é `3`, e o management node ao qual o cluster management client está conectado tem o node ID `5`. O primeiro node a concluir sua parte no abort do backup relata que o motivo do abort foi devido a uma solicitação do usuário. (Os nodes restantes relatam que o backup foi abortado devido a um erro interno não especificado.)

   Note

   Não há garantia de que os cluster nodes respondam a um comando `ABORT BACKUP` em qualquer ordem específica.

   As mensagens `Backup backup_id started from node management_node_id has been aborted` significam que o backup foi terminado e que todos os arquivos relacionados a este backup foram removidos do cluster file system.

Também é possível abortar um backup em progresso a partir de um system shell usando este comando:

```sql
$> ndb_mgm -e "ABORT BACKUP backup_id"
```

Note

Se não houver nenhum backup com o ID *`backup_id`* em execução quando um `ABORT BACKUP` for emitido, o management client não fará nenhuma resposta, nem será indicado no cluster log que um comando abort inválido foi enviado.