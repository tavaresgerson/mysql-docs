### 21.5.20 ndb_print_frag_file — Imprimir Conteúdo do Arquivo de Lista de Fragmentos NDB

[**ndb_print_frag_file**](mysql-cluster-programs-ndb-print-frag-file.html "21.5.20 ndb_print_frag_file — Print NDB Fragment List File Contents") obtém informações de um arquivo de lista de fragmentos do Cluster. Ele é destinado a auxiliar no diagnóstico de problemas com reinicializações de data node.

#### Uso

```sql
ndb_print_frag_file file_name
```

*`file_name`* é o nome de um arquivo de lista de fragmentos do Cluster, que corresponde ao padrão `SX.FragList`, onde *`X`* é um dígito no intervalo de 2 a 9 (inclusive), e são encontrados no file system do data node que possui o ID de node *`nodeid`*, em diretórios nomeados `ndb_nodeid_fs/DN/DBDIH/`, onde *`N`* é `1` ou `2`. Cada arquivo de fragmento contém registros dos fragmentos pertencentes a cada tabela `NDB`. Para mais informações sobre arquivos de fragmentos do Cluster, consulte [NDB Cluster Data Node File System Directory](/doc/ndb-internals/en/ndb-internals-ndbd-filesystemdir-files.html).

Assim como [**ndb_print_backup_file**](mysql-cluster-programs-ndb-print-backup-file.html "21.5.18 ndb_print_backup_file — Print NDB Backup File Contents"), [**ndb_print_sys_file**](mysql-cluster-programs-ndb-print-sys-file.html "21.5.22 ndb_print_sys_file — Print NDB System File Contents"), e [**ndb_print_schema_file**](mysql-cluster-programs-ndb-print-schema-file.html "21.5.21 ndb_print_schema_file — Print NDB Schema File Contents") (e, diferentemente da maioria dos outros utilitários [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") que se destinam a serem executados em um host de management server ou a se conectar a um management server), [**ndb_print_frag_file**](mysql-cluster-programs-ndb-print-frag-file.html "21.5.20 ndb_print_frag_file — Print NDB Fragment List File Contents") deve ser executado em um data node do Cluster, uma vez que acessa o file system do data node diretamente. Como ele não utiliza o management server, este utilitário pode ser usado quando o management server não está em execução, e mesmo quando o Cluster foi completamente encerrado.

#### Opções Adicionais

Nenhuma.

#### Exemplo de Saída

```sql
$> ndb_print_frag_file /usr/local/mysqld/data/ndb_3_fs/D1/DBDIH/S2.FragList
Filename: /usr/local/mysqld/data/ndb_3_fs/D1/DBDIH/S2.FragList with size 8192
noOfPages = 1 noOfWords = 182
Table Data
----------
Num Frags: 2 NoOfReplicas: 2 hashpointer: 4294967040
kvalue: 6 mask: 0x00000000 method: HashMap
Storage is on Logged and checkpointed, survives SR
------ Fragment with FragId: 0 --------
Preferred Primary: 2 numStoredReplicas: 2 numOldStoredReplicas: 0 distKey: 0 LogPartId: 0
-------Stored Replica----------
Replica node is: 2 initialGci: 2 numCrashedReplicas = 0 nextLcpNo = 1
LcpNo[0]: maxGciCompleted: 1 maxGciStarted: 2 lcpId: 1 lcpStatus: valid
LcpNo[1]: maxGciCompleted: 0 maxGciStarted: 0 lcpId: 0 lcpStatus: invalid
-------Stored Replica----------
Replica node is: 3 initialGci: 2 numCrashedReplicas = 0 nextLcpNo = 1
LcpNo[0]: maxGciCompleted: 1 maxGciStarted: 2 lcpId: 1 lcpStatus: valid
LcpNo[1]: maxGciCompleted: 0 maxGciStarted: 0 lcpId: 0 lcpStatus: invalid
------ Fragment with FragId: 1 --------
Preferred Primary: 3 numStoredReplicas: 2 numOldStoredReplicas: 0 distKey: 0 LogPartId: 1
-------Stored Replica----------
Replica node is: 3 initialGci: 2 numCrashedReplicas = 0 nextLcpNo = 1
LcpNo[0]: maxGciCompleted: 1 maxGciStarted: 2 lcpId: 1 lcpStatus: valid
LcpNo[1]: maxGciCompleted: 0 maxGciStarted: 0 lcpId: 0 lcpStatus: invalid
-------Stored Replica----------
Replica node is: 2 initialGci: 2 numCrashedReplicas = 0 nextLcpNo = 1
LcpNo[0]: maxGciCompleted: 1 maxGciStarted: 2 lcpId: 1 lcpStatus: valid
LcpNo[1]: maxGciCompleted: 0 maxGciStarted: 0 lcpId: 0 lcpStatus: invalid
```