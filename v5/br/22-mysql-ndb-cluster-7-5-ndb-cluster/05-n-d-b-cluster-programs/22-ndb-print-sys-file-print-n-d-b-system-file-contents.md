### 21.5.22 ndb_print_sys_file — Imprimir Conteúdo de Arquivo de Sistema NDB

[**ndb_print_sys_file**](mysql-cluster-programs-ndb-print-sys-file.html "21.5.22 ndb_print_sys_file — Imprimir Conteúdo de Arquivo de Sistema NDB") obtém informações de diagnóstico de um arquivo de sistema (system file) do NDB Cluster.

#### Uso

```sql
ndb_print_sys_file file_name
```

*`file_name`* é o nome de um arquivo de sistema do Cluster (sysfile). Arquivos de sistema do Cluster estão localizados no diretório de dados de um data node ([`DataDir`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datadir)); o caminho sob este diretório para os arquivos de sistema segue o padrão `ndb_#_fs/D#/DBDIH/P#.sysfile`. Em cada caso, o *`#`* representa um número (não necessariamente o mesmo número). Para mais informações, consulte [NDB Cluster Data Node File System Directory](/doc/ndb-internals/en/ndb-internals-ndbd-filesystemdir-files.html).

Assim como [**ndb_print_backup_file**](mysql-cluster-programs-ndb-print-backup-file.html "21.5.18 ndb_print_backup_file — Imprimir Conteúdo do Arquivo de Backup NDB") e [**ndb_print_schema_file**](mysql-cluster-programs-ndb-print-schema-file.html "21.5.21 ndb_print_schema_file — Imprimir Conteúdo do Arquivo de Schema NDB") (e diferentemente da maioria dos outros utilitários [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") que são destinados a serem executados em um host de management server ou para se conectar a um management server), [**ndb_print_backup_file**](mysql-cluster-programs-ndb-print-backup-file.html "21.5.18 ndb_print_backup_file — Imprimir Conteúdo do Arquivo de Backup NDB") deve ser executado em um data node do Cluster, uma vez que ele acessa o file system do data node diretamente. Por não utilizar o management server, este utilitário pode ser usado quando o management server não está em execução, e mesmo quando o Cluster foi completamente desligado (shut down).

#### Opções Adicionais

Nenhuma.