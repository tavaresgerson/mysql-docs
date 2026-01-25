#### 21.6.15.31 A Tabela ndbinfo resources

Esta tabela fornece informações sobre a disponibilidade e o uso de Resources do data node.

Estes Resources são por vezes conhecidos como super-pools.

A tabela `resources` contém as seguintes colunas:

* `node_id`

  O ID de node exclusivo deste data node.

* `resource_name`

  Nome do Resource; veja o texto.

* `reserved`

  A quantidade reservada para este Resource, como um número de páginas de 32KB.

* `used`

  A quantidade realmente utilizada por este Resource, como um número de páginas de 32KB.

* `max`

  A quantidade máxima (número de páginas de 32KB) deste Resource que está disponível para este data node. 0 nesta coluna indica que o Resource é ilimitado, o que significa que o máximo efetivo é 4294967295 (232-1).

##### Notas

O `resource_name` pode ser um dos nomes mostrados na tabela a seguir:

* `RESERVED`: Reservado pelo sistema; não pode ser substituído.

* `TRANSACTION_MEMORY`: Memory alocada para Transactions neste data node.

* `DISK_OPERATIONS`: Se um log file group for alocado, o tamanho do undo log buffer é usado para definir o tamanho deste Resource. Este Resource é usado apenas para alocar o undo log buffer para um undo log file group; pode haver apenas um grupo assim. A overallocation (sobrealocação) ocorre conforme necessário por [\`CREATE LOGFILE GROUP\`](create-logfile-group.html "13.1.15 CREATE LOGFILE GROUP Statement").

* `DISK_RECORDS`: Records alocados para operações de Disk Data.

* `DATA_MEMORY`: Usado para tuplas na Memory principal, Indexes e hash Indexes. Soma de DataMemory e IndexMemory, mais 8 páginas de 32 KB cada, se IndexMemory tiver sido configurado. Não pode ser overallocated.

* `JOBBUFFER`: Usado para alocar job buffers pelo scheduler NDB; não pode ser overallocated. Isso é aproximadamente 2 MB por Thread mais um Buffer de 1 MB em ambas as direções para todos os Threads que podem se comunicar. Para grandes configurações, isso consome vários GB.

* `FILE_BUFFERS`: Usado pelo redo log handler no Kernel Block [\`DBLQH\`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dblqh.html); não pode ser overallocated. O tamanho é [\`NoOfFragmentLogParts\`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-nooffragmentlogparts) \* [\`RedoBuffer\`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-redobuffer), mais 1 MB por log file part.

* `TRANSPORTER_BUFFERS`: Usado para send buffers por [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)"); é a soma de [\`TotalSendBufferMemory\`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-totalsendbuffermemory) e [\`ExtraSendBufferMemory\`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-extrasendbuffermemory). Este Resource pode ser overallocated em até 25 por cento. O \`TotalSendBufferMemory\` é calculado somando a send buffer memory por node, cujo valor default é 2 MB. Assim, em um sistema com quatro data nodes e oito API nodes, os data nodes têm 12 * 2 MB de send buffer memory. O \`ExtraSendBufferMemory\` é usado por [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") e equivale a 2 MB de Memory extra por Thread. Assim, com 4 LDM threads, 2 TC threads, 1 main thread, 1 replication thread e 2 receive threads, o \`ExtraSendBufferMemory\` é 10 * 2 MB. A overallocation deste Resource pode ser realizada configurando o parâmetro de configuração do data node [\`SharedGlobalMemory\`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-sharedglobalmemory).

* `DISK_PAGE_BUFFER`: Usado para o disk page buffer; determinado pelo parâmetro de configuração [\`DiskPageBufferMemory\`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-diskpagebuffermemory). Não pode ser overallocated.

* `QUERY_MEMORY`: Usado pelo Kernel Block [\`DBSPJ\`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbspj.html).

* `SCHEMA_TRANS_MEMORY`: O mínimo é 2 MB; pode ser overallocated para usar qualquer Memory disponível restante.