#### 21.6.8.2 Usar o cliente de gerenciamento de cluster do NDB para criar um backup

Antes de iniciar uma cópia de segurança, certifique-se de que o clúster está configurado corretamente para realizar uma. (Consulte Seção 21.6.8.3, “Configuração para Cópias de Segurança de Clúster NDB”).

O comando `START BACKUP` é usado para criar um backup:

```sql
START BACKUP [backup_id] [wait_option] [snapshot_option]

wait_option:
WAIT {STARTED | COMPLETED} | NOWAIT

snapshot_option:
SNAPSHOTSTART | SNAPSHOTEND
```

Os backups sucessivos são identificados automaticamente sequencialmente, portanto, o *`backup_id`*, um número inteiro maior ou igual a 1, é opcional; se omitido, o próximo valor disponível é usado. Se um valor existente de *`backup_id`* for usado, o backup falhará com o erro Backup falhou: arquivo já existe. Se usado, o *`backup_id`* deve seguir imediatamente `START BACKUP` antes que qualquer outra opção seja usada.

A opção *`wait_option`* pode ser usada para determinar quando o controle é devolvido ao cliente de gerenciamento após a emissão do comando *`START BACKUP`*, conforme mostrado na lista a seguir:

- Se `NOWAIT` for especificado, o cliente de gerenciamento exibe um prompt imediatamente, como visto aqui:

  ```sql
  ndb_mgm> START BACKUP NOWAIT
  ndb_mgm>
  ```

  Nesse caso, o cliente de gerenciamento pode ser usado mesmo enquanto ele imprime informações de progresso do processo de backup.

- Com `WAIT STARTED`, o cliente de gerenciamento aguarda até que o backup seja iniciado antes de retornar o controle ao usuário, como mostrado aqui:

  ```sql
  ndb_mgm> START BACKUP WAIT STARTED
  Waiting for started, this may take several minutes
  Node 2: Backup 3 started from node 1
  ndb_mgm>
  ```

- `WAIT COMPLETED` faz com que o cliente de gerenciamento espere até que o processo de backup esteja concluído antes de retornar o controle ao usuário.

`WAIT COMPLETED` é o padrão.

Uma opção *`snapshot_option`* pode ser usada para determinar se o backup corresponde ao estado do cluster quando o comando `START BACKUP` foi emitido ou quando ele foi concluído. `SNAPSHOTSTART` faz com que o backup corresponda ao estado do cluster quando o backup começou; `SNAPSHOTEND` faz com que o backup reflita o estado do cluster quando o backup foi concluído. `SNAPSHOTEND` é o padrão e corresponde ao comportamento encontrado em versões anteriores do NDB Cluster.

Nota

Se você usar a opção `SNAPSHOTSTART` com `START BACKUP` e o parâmetro `CompressedBackup` estiver habilitado, apenas os arquivos de dados e de controle serão comprimidos — o arquivo de log não será comprimido.

Se ambos os parâmetros `wait_option` e `snapshot_option` forem usados, eles podem ser especificados em qualquer ordem. Por exemplo, todos os seguintes comandos são válidos, assumindo que não há um backup existente com o ID 4:

```sql
START BACKUP WAIT STARTED SNAPSHOTSTART
START BACKUP SNAPSHOTSTART WAIT STARTED
START BACKUP 4 WAIT COMPLETED SNAPSHOTSTART
START BACKUP SNAPSHOTEND WAIT COMPLETED
START BACKUP 4 NOWAIT SNAPSHOTSTART
```

O procedimento para criar um backup consiste nas seguintes etapas:

1. Inicie o cliente de gerenciamento (**ndb\_mgm**), se ainda não estiver em execução.

2. Execute o comando **`START BACKUP`**. Isso produz várias linhas de saída indicando o progresso do backup, conforme mostrado aqui:

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

3. Quando o backup começa, o cliente de gerenciamento exibe esta mensagem:

   ```sql
   Backup backup_id started from node node_id
   ```

   *`backup_id`* é o identificador único para este backup específico. Este identificador é salvo no log do cluster, se não tiver sido configurado de outra forma. *`node_id`* é o identificador do servidor de gerenciamento que está coordenando o backup com os nós de dados. Neste ponto do processo de backup, o cluster recebeu e processou o pedido de backup. Isso não significa que o backup tenha terminado. Um exemplo dessa declaração é mostrado aqui:

   ```sql
   Node 2: Backup 1 started from node 1
   ```

4. O cliente de gerenciamento indica com uma mensagem como esta que o backup começou:

   ```sql
   Backup backup_id started from node node_id completed
   ```

   Assim como na notificação de que o backup foi iniciado, *`backup_id`* é o identificador único desse backup específico, e *`node_id`* é o ID do nó do servidor de gerenciamento que está coordenando o backup com os nós de dados. Essa saída é acompanhada por informações adicionais, incluindo pontos de verificação globais relevantes, o número de registros feitos backup e o tamanho dos dados, conforme mostrado aqui:

   ```sql
   Node 2: Backup 1 started from node 1 completed
    StartGCP: 177 StopGCP: 180
    #Records: 7362 #LogRecords: 0
    Data: 453648 bytes Log: 0 bytes
   ```

Também é possível realizar um backup a partir da shell do sistema invocando **ndb\_mgm** com a opção `-e` ou `--execute`, como mostrado neste exemplo:

```sql
$> ndb_mgm -e "START BACKUP 6 WAIT COMPLETED SNAPSHOTSTART"
```

Ao usar `START BACKUP` dessa maneira, você deve especificar o ID do backup.

Os backups em cluster são criados por padrão no subdiretório `BACKUP` do diretório `[DataDir]` (mysql-cluster-ndbd-definition.html#ndbparam-ndb-datadir) em cada nó de dados. Isso pode ser alterado para um ou mais nós de dados individualmente, ou para todos os nós de dados do cluster no arquivo `config.ini` usando o parâmetro de configuração `[BackupDataDir]` (mysql-cluster-ndbd-definition.html#ndbparam-ndb-backupdatadir). Os arquivos de backup criados para um backup com um *`backup_id`* específico são armazenados em um subdiretório chamado `BACKUP-backup_id` no diretório de backup.

**Cancelamento de backups.** Para cancelar ou abortar um backup que já está em andamento, siga os passos abaixo:

1. Inicie o cliente de gerenciamento.

2. Execute este comando:

   ```sql
   ndb_mgm> ABORT BACKUP backup_id
   ```

   O número *`backup_id`* é o identificador do backup que foi incluído na resposta do cliente de gerenciamento quando o backup foi iniciado (na mensagem `Backup backup_id iniciado a partir do nó management_node_id`).

3. O cliente de gerenciamento reconhece o pedido de interrupção com `Interrupção do backup backup_id solicitado`.

   Nota

   Neste momento, o cliente de gerenciamento ainda não recebeu uma resposta dos nós de dados do clúster a essa solicitação, e o backup ainda não foi realmente interrompido.

4. Após o backup ter sido interrompido, o cliente de gerenciamento relata esse fato de maneira semelhante à mostrada aqui:

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

   Neste exemplo, mostramos a saída de amostra para um clúster com 4 nós de dados, onde o número de sequência do backup a ser abortado é `3`, e o nó de gerenciamento ao qual o cliente de gerenciamento do clúster está conectado tem o ID de nó `5`. O primeiro nó a completar sua parte no cancelamento do backup relata que a razão para o cancelamento foi devido a um pedido do usuário. (Os nós restantes relatam que o backup foi cancelado devido a um erro interno não especificado.)

   Nota

   Não há garantia de que os nós do cluster respondam a um comando `ABORT BACKUP` em qualquer ordem específica.

   As mensagens "O backup backup\_id iniciado a partir do node management\_node\_id foi abortado" significam que o backup foi encerrado e que todos os arquivos relacionados a este backup foram removidos do sistema de arquivos do cluster.

É também possível interromper um backup em andamento a partir de uma janela de sistema usando este comando:

```sql
$> ndb_mgm -e "ABORT BACKUP backup_id"
```

Nota

Se não houver um backup com o ID *`backup_id`* em execução quando um `ABORT BACKUP` for emitido, o cliente de gerenciamento não responderá, e também não será indicado no log do clúster que um comando de interrupção inválido foi enviado.
