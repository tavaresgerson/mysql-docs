### 25.5.21 ndb_print_sys_file — Imprimir conteúdo de um arquivo de sistema do NDB Cluster

O **ndb_print_sys_file** obtém informações de diagnóstico de um arquivo de sistema do NDB Cluster.

#### Uso

```
ndb_print_sys_file file_name
```

*`file_name`* é o nome de um arquivo de sistema do cluster (sysfile). Os arquivos de sistema do cluster estão localizados no diretório de dados de um nó de dados do cluster (`DataDir`); o caminho sob este diretório para os arquivos de sistema corresponde ao padrão `ndb_#_fs/D#/DBDIH/P#.sysfile`. Em cada caso, o *`#`* representa um número (não necessariamente o mesmo número). Para mais informações, consulte o diretório do sistema de arquivos de nó de dados do NDB Cluster.

Assim como o **ndb_print_backup_file** e o **ndb_print_schema_file** (e ao contrário da maioria das outras ferramentas `NDB` que são destinadas a serem executadas em um host do servidor de gerenciamento ou para se conectar a um servidor de gerenciamento), o **ndb_print_backup_file** deve ser executado em um nó de dados do cluster, pois ele acessa diretamente o sistema de arquivos do nó de dados. Como ele não faz uso do servidor de gerenciamento, essa ferramenta pode ser usada quando o servidor de gerenciamento não está em execução e até mesmo quando o cluster foi completamente desligado.

#### Opções Adicionais

Nenhuma.