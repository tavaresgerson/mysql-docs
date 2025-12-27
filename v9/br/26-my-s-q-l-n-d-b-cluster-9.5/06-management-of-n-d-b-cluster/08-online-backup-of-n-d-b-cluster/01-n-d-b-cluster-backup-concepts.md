#### 25.6.8.1 Conceitos de Backup de Agrupamento NDB

Um backup é uma instantânea do banco de dados em um determinado momento. O backup consiste em três partes principais:

* **Metadados.** Os nomes e definições de todas as tabelas do banco de dados

* **Registros de tabela.** Os dados realmente armazenados nas tabelas do banco de dados no momento em que o backup foi feito

* **Registro de transação.** Um registro sequencial que indica como e quando os dados foram armazenados no banco de dados

Cada uma dessas partes é salva em todos os nós que participam do backup. Durante o backup, cada nó salva essas três partes em três arquivos no disco:

* `BACKUP-backup_id.node_id.ctl`

  Um arquivo de controle que contém informações de controle e metadados. Cada nó salva as mesmas definições de tabela (para todas as tabelas no agrupamento) em sua própria versão deste arquivo.

* `BACKUP-backup_id-0.node_id.data`

  Um arquivo de dados que contém os registros de tabela, que são salvos em uma base por fragmento. Ou seja, diferentes nós salvam diferentes fragmentos durante o backup. O arquivo salvo por cada nó começa com um cabeçalho que indica as tabelas às quais os registros pertencem. Após a lista de registros, há um rodapé que contém um checksum para todos os registros.

* `BACKUP-backup_id.node_id.log`

  Um arquivo de log que contém registros de transações confirmadas. Apenas as transações nas tabelas armazenadas no backup são armazenadas no log. Os nós envolvidos no backup salvam diferentes registros porque diferentes nós hospedam diferentes fragmentos do banco de dados.

Na lista mostrada, *`backup_id`* representa o identificador do backup e *`node_id`* é o identificador único do nó que cria o arquivo.

A localização dos arquivos de backup é determinada pelo parâmetro `BackupDataDir`.