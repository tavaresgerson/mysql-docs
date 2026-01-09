### 21.5.22 ndb_print_sys_file — Imprimir o conteúdo do arquivo do sistema NDB

**ndb_print_sys_file** obtém informações de diagnóstico de um arquivo de sistema do NDB Cluster.

#### Uso

```sql
ndb_print_sys_file file_name
```

*`file_name`* é o nome de um arquivo de sistema de cluster (sysfile). Os arquivos de sistema de cluster estão localizados no diretório de dados de um nó de dados (`DataDir`); o caminho sob este diretório para arquivos de sistema corresponde ao padrão `ndb_#_fs/D#/DBDIH/P#.sysfile`. Em cada caso, o *`#`* representa um número (não necessariamente o mesmo número). Para mais informações, consulte Diretório de Sistema de Arquivos de Nó de Dados de Cluster NDB.

Assim como **ndb_print_backup_file** e **ndb_print_schema_file** (e ao contrário da maioria das outras ferramentas de `NDB`]\(mysql-cluster.html) que são destinadas a serem executadas em um servidor de gerenciamento ou para se conectar a um servidor de gerenciamento), **ndb_print_backup_file** deve ser executado em um nó de dados do cluster, pois ele acessa diretamente o sistema de arquivos do nó de dados. Como ele não faz uso do servidor de gerenciamento, essa ferramenta pode ser usada quando o servidor de gerenciamento não está em execução e até mesmo quando o cluster foi completamente desligado.

#### Opções adicionais

Nenhum.
