#### 25.6.8.2 Usando o Cliente de Gerenciamento de NDB Cluster para Criar um Backup

Antes de iniciar um backup, certifique-se de que o cluster está corretamente configurado para realizar uma. (Veja a Seção 25.6.8.3, “Configuração para Backups de NDB Cluster”.)

O comando `START BACKUP` é usado para criar um backup e tem a sintaxe mostrada aqui:

```
START BACKUP [backup_id]
    [encryption_option]
    [wait_option]
    [snapshot_option]

encryption_option:
ENCRYPT [PASSWORD=password]

password:
{'password_string' | "password_string"}

wait_option:
WAIT {STARTED | COMPLETED} | NOWAIT

snapshot_option:
SNAPSHOTSTART | SNAPSHOTEND
```

Os backups subsequentes são identificados automaticamente sequencialmente, então o *`backup_id`*, um inteiro maior ou igual a 1, é opcional; se omitido, o próximo valor disponível é usado. Se um valor existente de *`backup_id`* for usado, o backup falha com o erro Backup falhou: arquivo já existe. Se usado, o *`backup_id`* deve ser seguido imediatamente após as palavras-chave `START BACKUP`, antes que quaisquer outras opções sejam usadas.

`START BACKUP` suporta a criação de backups criptografados usando `ENCRYPT PASSWORD=password`. O *`password`* deve atender a todos os seguintes requisitos:

* Usa qualquer um dos caracteres ASCII imprimíveis, exceto `!`, `'`, `"`, `$`, `%`, `\` e `^`

* Tem no máximo 256 caracteres
* Está entre aspas simples ou duplas

Quando `ENCRYPT PASSWORD='password'` é usado, o registro de dados do backup e os arquivos de log escritos por cada nó de dados são criptografados com uma chave derivada do *`password`* fornecido pelo usuário e um sal criptografado aleatoriamente usando uma função de derivação de chave (KDF) que emprega o algoritmo PBKDF2-SHA256 para gerar uma chave de criptografia simétrica para aquele arquivo. Esta função tem a forma mostrada aqui:

```
key = KDF(random_salt, password)
```

A chave assim gerada é então usada para criptografar os dados do backup usando AES 256 CBC inline, e a criptografia simétrica é empregada para criptografar o conjunto de arquivos de backup (com a chave gerada).

Nota

O NDB Cluster *nunca* salva a senha fornecida pelo usuário ou a chave de criptografia gerada.

A opção `PASSWORD` pode ser omitida de *`encryption_option`*. Neste caso, o cliente de gerenciamento solicita ao usuário uma senha.

É possível usar `PASSWORD` para definir uma senha vazia (`''` ou `""`), mas isso não é recomendado.

Um backup criptografado pode ser descriptografado usando qualquer um dos seguintes comandos:

* **ndb\_restore** `--decrypt` `--backup-password=password`

* **ndbxfrm** `--decrypt-password=password` *`input_file`* *`output_file`*

* **ndb\_print\_backup\_file** `-P` *`password`* *`file_name`*

* **ndb\_restore** `--decrypt` `--backup-password-from-stdin`

* **ndbxfrm** `--decrypt-password-from-stdin` *`input_file`* *`output_file`*

* **ndb\_print\_backup\_file** `--backup-password=password` *`file_name`*

* **ndb\_print\_backup\_file** `--backup-password-from-stdin` *`file_name`*

* **ndb\_mgm** `--backup-password-from-stdin` `--execute "START BACKUP ..."`

Veja as descrições desses programas para obter mais informações, como opções adicionais que podem ser necessárias.

A *`wait_option`* pode ser usada para determinar quando o controle é retornado ao cliente de gerenciamento após a emissão de um comando `START BACKUP`, conforme mostrado na lista a seguir:

* Se `NOWAIT` for especificado, o cliente de gerenciamento exibe um prompt imediatamente, como visto aqui:

  ```
  ndb_mgm> START BACKUP NOWAIT
  ndb_mgm>
  ```

  Neste caso, o cliente de gerenciamento pode ser usado mesmo enquanto ele imprime informações de progresso do processo de backup.

* Com `WAIT STARTED` o cliente de gerenciamento espera até que o backup seja iniciado antes de retornar o controle ao usuário, como mostrado aqui:

  ```
  ndb_mgm> START BACKUP WAIT STARTED
  Waiting for started, this may take several minutes
  Node 2: Backup 3 started from node 1
  ndb_mgm>
  ```

* **`WAIT COMPLETED`** faz com que o cliente de gerenciamento espere até que o processo de backup seja concluído antes de retornar o controle ao usuário.

`WAIT COMPLETED` é o padrão.

Uma opção *`snapshot_option`* pode ser usada para determinar se o backup corresponde ao estado do clúster quando o comando `START BACKUP` foi emitido ou quando ele foi concluído. `SNAPSHOTSTART` faz com que o backup corresponda ao estado do clúster quando o backup começou; `SNAPSHOTEND` faz com que o backup reflita o estado do clúster quando o backup foi concluído. `SNAPSHOTEND` é a opção padrão e corresponde ao comportamento encontrado em versões anteriores do NDB Cluster.

Nota

Se você usar a opção `SNAPSHOTSTART` com `START BACKUP`, e o parâmetro `CompressedBackup` estiver habilitado, apenas os dados e os arquivos de controle serão comprimidos — o arquivo de log não será comprimido.

Se forem usadas tanto a opção `wait_option` quanto a opção `snapshot_option`, elas podem ser especificadas em qualquer ordem. Por exemplo, todos os seguintes comandos são válidos, assumindo que não há um backup existente com o ID 4:

```
START BACKUP WAIT STARTED SNAPSHOTSTART
START BACKUP SNAPSHOTSTART WAIT STARTED
START BACKUP 4 WAIT COMPLETED SNAPSHOTSTART
START BACKUP SNAPSHOTEND WAIT COMPLETED
START BACKUP 4 NOWAIT SNAPSHOTSTART
```

O procedimento para criar um backup consiste nas seguintes etapas:

1. Inicie o cliente de gerenciamento (**ndb\_mgm**), se ele ainda não estiver em execução.

2. Execute o comando **`START BACKUP`**. Isso produz várias linhas de saída indicando o progresso do backup, conforme mostrado aqui:

   ```
   ndb_mgm> START BACKUP
   Waiting for completed, this may take several minutes
   Node 2: Backup 1 started from node 1
   Node 2: Backup 1 started from node 1 completed
    StartGCP: 177 StopGCP: 180
    #Records: 7362 #LogRecords: 0
    Data: 453648 bytes Log: 0 bytes
   ndb_mgm>
   ```

3. Quando o backup tiver começado, o cliente de gerenciamento exibe esta mensagem:

   ```
   Backup backup_id started from node node_id
   ```

   *`backup_id`* é o identificador único para este backup específico. Esse identificador é salvo no log do clúster, se não tiver sido configurado de outra forma. *`node_id`* é o identificador do servidor de gerenciamento que está coordenando o backup com os nós de dados. Neste ponto do processo de backup, o clúster recebeu e processou a solicitação de backup. Isso não significa que o backup tenha sido concluído. Um exemplo dessa declaração é mostrado aqui:

   ```
   Node 2: Backup 1 started from node 1
   ```

4. O cliente de gerenciamento indica com uma mensagem como esta que o backup foi iniciado:

   ```
   Backup backup_id started from node node_id completed
   ```

   Assim como a notificação de que o backup foi iniciado, *`backup_id`* é o identificador único para este backup específico, e *`node_id`* é o ID do nó do servidor de gerenciamento que está coordenando o backup com os nós de dados. Esta saída é acompanhada por informações adicionais, incluindo pontos de verificação globais relevantes, o número de registros que foram feitos backups e o tamanho dos dados, conforme mostrado aqui:

   ```
   Node 2: Backup 1 started from node 1 completed
    StartGCP: 177 StopGCP: 180
    #Records: 7362 #LogRecords: 0
    Data: 453648 bytes Log: 0 bytes
   ```

   Também é possível realizar um backup a partir da shell do sistema invocando **ndb\_mgm** com a opção `-e` ou `--execute`, como mostrado neste exemplo:

```
$> ndb_mgm -e "START BACKUP 6 WAIT COMPLETED SNAPSHOTSTART"
```

Ao usar `START BACKUP` desta maneira, você deve especificar o ID do backup.

Os backups de cluster são criados por padrão no subdiretório `BACKUP` do `DataDir` em cada nó de dados. Isso pode ser sobrescrito para um ou mais nós de dados individualmente, ou para todos os nós de dados do cluster no arquivo `config.ini` usando o parâmetro de configuração `BackupDataDir`. Os arquivos de backup criados para um backup com um *`backup_id`* específico são armazenados em um subdiretório chamado `BACKUP-backup_id` no diretório de backup.

**Cancelamento de backups.** Para cancelar ou abortar um backup que já está em andamento, siga os seguintes passos:

1. Inicie o cliente de gerenciamento.
2. Execute este comando:

   ```
   ndb_mgm> ABORT BACKUP backup_id
   ```

   O número *`backup_id`* é o identificador do backup que foi incluído na resposta do cliente de gerenciamento quando o backup foi iniciado (na mensagem `Backup backup_id started from node management_node_id`).

3. O cliente de gerenciamento confirma o pedido de cancelamento com `Abort of backup backup_id ordered`.

   Nota

Neste momento, o cliente de gerenciamento ainda não recebeu uma resposta dos nós de dados do clúster a este pedido, e o backup ainda não foi realmente interrompido.

4. Após o backup ter sido interrompido, o cliente de gerenciamento relata esse fato de uma maneira semelhante à mostrada aqui:

   ```
   Node 1: Backup 3 started from 5 has been aborted.
     Error: 1321 - Backup aborted by user request: Permanent error: User defined error
   Node 3: Backup 3 started from 5 has been aborted.
     Error: 1323 - 1323: Permanent error: Internal error
   Node 2: Backup 3 started from 5 has been aborted.
     Error: 1323 - 1323: Permanent error: Internal error
   Node 4: Backup 3 started from 5 has been aborted.
     Error: 1323 - 1323: Permanent error: Internal error
   ```

   Neste exemplo, mostramos a saída de amostra para um clúster com 4 nós de dados, onde o número de sequência do backup a ser interrompido é `3`, e o nó de gerenciamento ao qual o cliente de gerenciamento do clúster está conectado tem o ID de nó `5`. O primeiro nó a completar sua parte na interrupção do backup relata que a razão para a interrupção foi devido a um pedido do usuário. (Os nós restantes relatam que o backup foi interrompido devido a um erro interno não especificado.)

   Nota

   Não há garantia de que os nós do clúster respondam a um comando `ABORT BACKUP` em qualquer ordem específica.

   As mensagens `Backup backup_id started from node management_node_id has been aborted` significam que o backup foi encerrado e que todos os arquivos relacionados a este backup foram removidos do sistema de arquivos do clúster.

Também é possível interromper um backup em andamento a partir de uma shell do sistema usando este comando:

```
$> ndb_mgm -e "ABORT BACKUP backup_id"
```

Nota

Se não houver backup com o ID *`backup_id`* em execução quando um `ABORT BACKUP` é emitido, o cliente de gerenciamento não faz nenhuma resposta, nem é indicado no log do clúster que um comando de interrupção inválido foi enviado.