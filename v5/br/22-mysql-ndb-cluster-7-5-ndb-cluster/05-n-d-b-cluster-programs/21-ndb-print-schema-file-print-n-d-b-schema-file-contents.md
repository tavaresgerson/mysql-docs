### 21.5.21 ndb_print_schema_file — Imprimir Conteúdo do Arquivo Schema NDB

[**ndb_print_schema_file**](mysql-cluster-programs-ndb-print-schema-file.html "21.5.21 ndb_print_schema_file — Print NDB Schema File Contents") obtém informações de diagnóstico de um cluster schema file.

#### Uso

```sql
ndb_print_schema_file file_name
```

*`file_name`* é o nome de um cluster schema file. Para mais informações sobre cluster schema files, consulte [NDB Cluster Data Node File System Directory](/doc/ndb-internals/en/ndb-internals-ndbd-filesystemdir-files.html).

Assim como [**ndb_print_backup_file**](mysql-cluster-programs-ndb-print-backup-file.html "21.5.18 ndb_print_backup_file — Print NDB Backup File Contents") e [**ndb_print_sys_file**](mysql-cluster-programs-ndb-print-sys-file.html "21.5.22 ndb_print_sys_file — Print NDB System File Contents") (e diferentemente da maioria dos outros utilitários [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") que são destinados a serem executados em um host de management server ou para se conectar a um management server), [**ndb_print_schema_file**](mysql-cluster-programs-ndb-print-schema-file.html "21.5.21 ndb_print_schema_file — Print NDB Schema File Contents") deve ser executado em um cluster data node, visto que ele acessa o file system do data node diretamente. Como ele não utiliza o management server, este utilitário pode ser usado quando o management server não está em execução, e mesmo quando o Cluster tiver sido completamente encerrado (shut down).

#### Opções Adicionais

Nenhuma.