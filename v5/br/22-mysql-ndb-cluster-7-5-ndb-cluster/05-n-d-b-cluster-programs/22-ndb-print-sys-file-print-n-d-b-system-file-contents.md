### 21.5.22 ndb_print_sys_file — Imprimir Conteúdo de Arquivo de Sistema NDB

**ndb_print_sys_file** obtém informações de diagnóstico de um arquivo de sistema (system file) do NDB Cluster.

#### Uso

```sql
ndb_print_sys_file file_name
```

*`file_name`* é o nome de um arquivo de sistema do Cluster (sysfile). Arquivos de sistema do Cluster estão localizados no diretório de dados de um data node (`DataDir`); o caminho sob este diretório para os arquivos de sistema segue o padrão `ndb_#_fs/D#/DBDIH/P#.sysfile`. Em cada caso, o *`#`* representa um número (não necessariamente o mesmo número). Para mais informações, consulte NDB Cluster Data Node File System Directory.

Assim como **ndb_print_backup_file** e **ndb_print_schema_file** (e diferentemente da maioria dos outros utilitários `NDB` que são destinados a serem executados em um host de management server ou para se conectar a um management server), **ndb_print_backup_file** deve ser executado em um data node do Cluster, uma vez que ele acessa o file system do data node diretamente. Por não utilizar o management server, este utilitário pode ser usado quando o management server não está em execução, e mesmo quando o Cluster foi completamente desligado (shut down).

#### Opções Adicionais

Nenhuma.