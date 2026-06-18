### 21.5.21 ndb_print_schema_file — Imprimir Conteúdo do Arquivo Schema NDB

**ndb_print_schema_file** obtém informações de diagnóstico de um cluster schema file.

#### Uso

```sql
ndb_print_schema_file file_name
```

*`file_name`* é o nome de um cluster schema file. Para mais informações sobre cluster schema files, consulte NDB Cluster Data Node File System Directory.

Assim como **ndb_print_backup_file** e **ndb_print_sys_file** (e diferentemente da maioria dos outros utilitários `NDB` que são destinados a serem executados em um host de management server ou para se conectar a um management server), **ndb_print_schema_file** deve ser executado em um cluster data node, visto que ele acessa o file system do data node diretamente. Como ele não utiliza o management server, este utilitário pode ser usado quando o management server não está em execução, e mesmo quando o Cluster tiver sido completamente encerrado (shut down).

#### Opções Adicionais

Nenhuma.