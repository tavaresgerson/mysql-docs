### 21.5.19 ndb_print_file — Imprimir o conteúdo do arquivo de dados do disco NDB

**ndb_print_file** obtém informações de um arquivo de dados de disco do NDB Cluster.

#### Uso

```sql
ndb_print_file [-v] [-q] file_name+
```

*`file_name`* é o nome de um arquivo de dados de disco do NDB Cluster. Vários nomes de arquivos são aceitos, separados por espaços.

Assim como **ndb_print_schema_file** e **ndb_print_sys_file** (e ao contrário da maioria das outras ferramentas de `NDB` (mysql-cluster.html) que são destinadas a serem executadas em um servidor de gerenciamento ou para se conectar a um servidor de gerenciamento), **ndb_print_file** deve ser executado em um nó de dados do NDB Cluster, pois ele acessa diretamente o sistema de arquivos do nó de dados. Como ele não faz uso do servidor de gerenciamento, essa ferramenta pode ser usada quando o servidor de gerenciamento não está em execução e até mesmo quando o cluster foi completamente desligado.

#### Opções adicionais

**ndb_print_file** suporta as seguintes opções:

- `-v`: Torna a saída mais detalhada.
- `-q`: Supressão da saída (modo silencioso).
- `--help`, `-h`, `-?`: Imprima a mensagem de ajuda.

Para mais informações, consulte Seção 21.6.11, “Tabelas de dados de disco do NDB Cluster”.
