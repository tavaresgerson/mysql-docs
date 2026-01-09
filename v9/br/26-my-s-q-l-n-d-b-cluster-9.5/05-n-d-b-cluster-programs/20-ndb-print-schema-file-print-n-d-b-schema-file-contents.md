### 25.5.2.ndb_print_schema_file — Imprimir conteúdo do arquivo de esquema do NDB

O **ndb_print_schema_file** obtém informações de diagnóstico de um arquivo de esquema de cluster.

#### Uso

```
ndb_print_schema_file file_name
```

*`file_name`* é o nome de um arquivo de esquema de cluster. Para mais informações sobre arquivos de esquema de cluster, consulte o diretório do sistema de arquivos do NDB Cluster Data Node.

Assim como o **ndb_print_backup_file** e o **ndb_print_sys_file** (e diferentemente da maioria das outras ferramentas do `NDB` que são destinadas a serem executadas em um host do servidor de gerenciamento ou para se conectar a um servidor de gerenciamento), o **ndb_print_schema_file** deve ser executado em um nó de dados do cluster, pois ele acessa diretamente o sistema de arquivos do nó de dados. Como ele não faz uso do servidor de gerenciamento, essa ferramenta pode ser usada quando o servidor de gerenciamento não está em execução e até mesmo quando o cluster foi completamente desligado.

#### Opções Adicionais

Nenhuma.