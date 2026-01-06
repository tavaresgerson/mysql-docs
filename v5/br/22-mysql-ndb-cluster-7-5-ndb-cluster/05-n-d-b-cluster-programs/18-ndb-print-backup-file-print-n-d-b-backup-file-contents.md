### 21.5.18 ndb\_print\_backup\_file — Imprimir o conteúdo do arquivo de backup do NDB

**ndb\_print\_backup\_file** obtém informações de diagnóstico de um arquivo de backup de cluster.

#### Uso

```sql
ndb_print_backup_file file_name
```

*`file_name`* é o nome de um arquivo de backup de cluster. Pode ser qualquer um dos arquivos (`.Data`, `.ctl` ou `.log`) encontrados em um diretório de backup de cluster. Esses arquivos são encontrados no diretório de backup do nó de dados sob o subdiretório `BACKUP-#`, onde *`#`* é o número de sequência do backup. Para mais informações sobre arquivos de backup de cluster e seus conteúdos, consulte Seção 21.6.8.1, “Conceitos de Backup de Cluster NDB”.

Assim como **ndb\_print\_schema\_file** e **ndb\_print\_sys\_file** (e ao contrário da maioria das outras ferramentas de `NDB` (mysql-cluster.html) que são destinadas a serem executadas em um servidor de gerenciamento ou para se conectar a um servidor de gerenciamento), **ndb\_print\_backup\_file** deve ser executado em um nó de dados do cluster, pois ele acessa diretamente o sistema de arquivos do nó de dados. Como ele não faz uso do servidor de gerenciamento, essa ferramenta pode ser usada quando o servidor de gerenciamento não está em execução e até mesmo quando o cluster foi completamente desligado.

#### Opções adicionais

Nenhum.
