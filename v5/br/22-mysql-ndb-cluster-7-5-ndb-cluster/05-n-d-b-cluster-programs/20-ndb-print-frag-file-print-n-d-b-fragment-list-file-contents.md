### 21.5.20 ndb\_print\_frag\_file — Imprimir o conteúdo do arquivo de lista de fragmentos do NDB

**ndb\_print\_frag\_file** obtém informações de um arquivo de lista de fragmentos de clúster. É destinado ao uso para ajudar a diagnosticar problemas com reinicializações de nós de dados.

#### Uso

```sql
ndb_print_frag_file file_name
```

*`file_name`* é o nome de um arquivo de lista de fragmentos de cluster, que corresponde ao padrão `SX.FragList`, onde *`X`* é um dígito no intervalo de 2 a 9, inclusive, e são encontrados no sistema de arquivos do nó de dados que tem o ID de nó *`nodeid`*, em diretórios nomeados `ndb_nodeid_fs/DN/DBDIH/`, onde *`N`* é `1` ou `2`. Cada arquivo de fragmento contém registros dos fragmentos pertencentes a cada tabela `NDB`. Para mais informações sobre os arquivos de dados de nó de cluster de NDB, consulte Diretório de Sistema de Arquivos de Nó de Dados de Cluster de NDB.

Assim como **ndb\_print\_backup\_file**, **ndb\_print\_sys\_file** e **ndb\_print\_schema\_file** (e ao contrário da maioria das outras ferramentas de `NDB`]\(mysql-cluster.html) que são destinadas a serem executadas em um host de servidor de gerenciamento ou para se conectar a um servidor de gerenciamento), **ndb\_print\_frag\_file** deve ser executado em um nó de dados do cluster, pois ele acessa diretamente o sistema de arquivos do nó de dados. Como ele não faz uso do servidor de gerenciamento, essa ferramenta pode ser usada quando o servidor de gerenciamento não está em execução e até mesmo quando o cluster foi completamente desligado.

#### Opções adicionais

Nenhum.

#### Saída de amostra

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
