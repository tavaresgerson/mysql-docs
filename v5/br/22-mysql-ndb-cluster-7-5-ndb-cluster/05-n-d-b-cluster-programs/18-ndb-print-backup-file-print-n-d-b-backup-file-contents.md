### 21.5.18 ndb_print_backup_file — Imprimir Conteúdo de Arquivo de Backup NDB

**ndb_print_backup_file** obtém informações de diagnóstico de um arquivo de Backup do Cluster.

#### Uso

```sql
ndb_print_backup_file file_name
```

*`file_name`* é o nome de um arquivo de Backup do Cluster. Este pode ser qualquer um dos arquivos (`.Data`, `.ctl` ou `.log` file) encontrados em um diretório de Backup do Cluster. Esses arquivos são encontrados no diretório de Backup do Data Node, sob o subdiretório `BACKUP-#`, onde *`#`* é o número de sequência do Backup. Para mais informações sobre arquivos de Backup do Cluster e seus conteúdos, consulte Section 21.6.8.1, “NDB Cluster Backup Concepts”.

Assim como **ndb_print_schema_file** e **ndb_print_sys_file** (e diferentemente da maioria dos outros `NDB` utilities que se destinam a ser executados em um host de Management Server ou a se conectar a um Management Server), **ndb_print_backup_file** deve ser executado em um Data Node do Cluster, visto que ele acessa o sistema de arquivos do Data Node diretamente. Como ele não utiliza o Management Server, este utility pode ser usado quando o Management Server não estiver em execução, e mesmo quando o Cluster tiver sido completamente desligado (shut down).

#### Opções Adicionais

Nenhuma.