### 21.5.21 ndb_print_schema_file — Imprimir o conteúdo do arquivo de esquema do NDB

**ndb_print_schema_file** obtém informações de diagnóstico de um arquivo de esquema de cluster.

#### Uso

```sql
ndb_print_schema_file file_name
```

*`file_name`* é o nome de um arquivo de esquema de cluster. Para obter mais informações sobre arquivos de esquema de cluster, consulte Diretório do Sistema de Arquivos do Nó de Dados do NDB Cluster.

Assim como **ndb_print_backup_file** e **ndb_print_sys_file** (e ao contrário da maioria das outras ferramentas de `NDB` (mysql-cluster.html) que são destinadas a serem executadas em um servidor de gerenciamento ou para se conectar a um servidor de gerenciamento), **ndb_print_schema_file** deve ser executado em um nó de dados do cluster, pois ele acessa diretamente o sistema de arquivos do nó de dados. Como ele não faz uso do servidor de gerenciamento, essa ferramenta pode ser usada quando o servidor de gerenciamento não está em execução e até mesmo quando o cluster foi completamente desligado.

#### Opções adicionais

Nenhum.
