### 21.5.19 ndb_print_file — Imprimir Conteúdo de Arquivo Disk Data do NDB

[**ndb_print_file**](mysql-cluster-programs-ndb-print-file.html "21.5.19 ndb_print_file — Imprimir Conteúdo de Arquivo Disk Data do NDB") obtém informações de um arquivo Disk Data do NDB Cluster.

#### Uso

```sql
ndb_print_file [-v] [-q] file_name+
```

*`file_name`* é o nome de um arquivo Disk Data do NDB Cluster. Múltiplos nomes de arquivos são aceitos, separados por espaços.

Assim como [**ndb_print_schema_file**](mysql-cluster-programs-ndb-print-schema-file.html "21.5.21 ndb_print_schema_file — Imprimir Conteúdo do Arquivo Schema do NDB") e [**ndb_print_sys_file**](mysql-cluster-programs-ndb-print-sys-file.html "21.5.22 ndb_print_sys_file — Imprimir Conteúdo do Arquivo System do NDB") (e diferentemente da maioria dos outros utilitários [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") que são destinados a serem executados em um host de management server ou para se conectar a um management server) [**ndb_print_file**](mysql-cluster-programs-ndb-print-file.html "21.5.19 ndb_print_file — Imprimir Conteúdo de Arquivo Disk Data do NDB") deve ser executado em um data node do NDB Cluster, pois ele acessa o file system do data node diretamente. Como não utiliza o management server, este utilitário pode ser usado quando o management server não está em execução, e mesmo quando o cluster foi completamente desligado (shut down).

#### Opções Adicionais

[**ndb_print_file**](mysql-cluster-programs-ndb-print-file.html "21.5.19 ndb_print_file — Imprimir Conteúdo de Arquivo Disk Data do NDB") oferece suporte às seguintes opções:

* `-v`: Torna a saída verbosa (verbose).
* `-q`: Suprime a saída (modo quiet).
* `--help`, `-h`, `-?`: Imprime a mensagem de ajuda.

Para mais informações, consulte [Section 21.6.11, “NDB Cluster Disk Data Tables”](mysql-cluster-disk-data.html "21.6.11 NDB Cluster Disk Data Tables").