#### 21.6.8.1 Conceitos de Backup do NDB Cluster

Um Backup é um instantâneo do Database em um determinado momento. O Backup consiste em três partes principais:

* **Metadata.** Os nomes e as definições de todas as tabelas do Database

* **Table records (Registros da Tabela).** Os dados realmente armazenados nas tabelas do Database no momento em que o Backup foi realizado

* **Transaction log.** Um registro sequencial informando como e quando os dados foram armazenados no Database

Cada uma dessas partes é salva em todos os *nodes* que participam do Backup. Durante o Backup, cada *node* salva essas três partes em três arquivos no disco:

* `BACKUP-backup_id.node_id.ctl`

  Um arquivo de controle (*control file*) contendo informações de controle e *Metadata*. Cada *node* salva as mesmas definições de tabela (para todas as tabelas no Cluster) em sua própria versão deste arquivo.

* `BACKUP-backup_id-0.node_id.data`

  Um arquivo de dados (*data file*) contendo os registros da tabela, que são salvos com base em fragmentos (*per-fragment basis*). Ou seja, diferentes *nodes* salvam diferentes *fragments* durante o Backup. O arquivo salvo por cada *node* começa com um cabeçalho que indica a quais tabelas os registros pertencem. Após a lista de registros, há um rodapé contendo um *checksum* para todos os registros.

* `BACKUP-backup_id.node_id.log`

  Um arquivo de *log* (*log file*) contendo registros de *transactions* comitadas. Somente *transactions* em tabelas armazenadas no Backup são salvas no *log*. *Nodes* envolvidos no Backup salvam registros diferentes porque diferentes *nodes* hospedam diferentes *fragments* do Database.

Na listagem recém-exibida, *`backup_id`* representa o identificador do Backup e *`node_id`* é o identificador exclusivo do *node* que está criando o arquivo.

A localização dos arquivos de Backup é determinada pelo parâmetro [`BackupDataDir`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-backupdatadir).