### 21.5.19 ndb_print_file — Imprimir Conteúdo de Arquivo Disk Data do NDB

**ndb_print_file** obtém informações de um arquivo Disk Data do NDB Cluster.

#### Uso

```sql
ndb_print_file [-v] [-q] file_name+
```

*`file_name`* é o nome de um arquivo Disk Data do NDB Cluster. Múltiplos nomes de arquivos são aceitos, separados por espaços.

Assim como **ndb_print_schema_file** e **ndb_print_sys_file** (e diferentemente da maioria dos outros utilitários `NDB` que são destinados a serem executados em um host de management server ou para se conectar a um management server) **ndb_print_file** deve ser executado em um data node do NDB Cluster, pois ele acessa o file system do data node diretamente. Como não utiliza o management server, este utilitário pode ser usado quando o management server não está em execução, e mesmo quando o cluster foi completamente desligado (shut down).

#### Opções Adicionais

**ndb_print_file** oferece suporte às seguintes opções:

* `-v`: Torna a saída verbosa (verbose).
* `-q`: Suprime a saída (modo quiet).
* `--help`, `-h`, `-?`: Imprime a mensagem de ajuda.

Para mais informações, consulte Section 21.6.11, “NDB Cluster Disk Data Tables”.