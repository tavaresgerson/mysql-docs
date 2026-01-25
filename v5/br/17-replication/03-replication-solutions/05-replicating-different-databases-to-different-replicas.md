### 16.3.5 Replicando Databases Diferentes para Replicas Diferentes

Pode haver situações em que você tenha um único Source e deseje replicar Databases diferentes para Replicas diferentes. Por exemplo, você pode querer distribuir dados de vendas distintos para diferentes departamentos para ajudar a distribuir a carga durante a análise de dados. Um exemplo deste arranjo é mostrado na [Figura 16.2, “Replicando Databases para Replicas Separadas”](replication-solutions-partitioning.html#figure_replication-multi-db "Figura 16.2 Replicando Databases para Replicas Separadas").

**Figura 16.2 Replicando Databases para Replicas Separadas**

![O MySQL Source tem três Databases, databaseA, databaseB e databaseC. databaseA é replicado apenas para o MySQL Replica 1, databaseB é replicado apenas para o MySQL Replica 2 e databaseC é replicado apenas para o MySQL Replica 3.](images/multi-db.png)

Você pode alcançar essa separação configurando o Source e as Replicas normalmente e, em seguida, limitando as declarações do Binary Log que cada Replica processa usando a opção de configuração [`--replicate-wild-do-table`](replication-options-replica.html#option_mysqld_replicate-wild-do-table) em cada Replica.

Importante

Você *não* deve usar [`--replicate-do-db`](replication-options-replica.html#option_mysqld_replicate-do-db) para este fim ao usar a replicação statement-based, visto que a replicação statement-based faz com que os efeitos desta opção variem de acordo com o Database atualmente selecionado. Isso se aplica também à replicação de formato misto (mixed-format replication), visto que isso permite que algumas atualizações sejam replicadas usando o formato statement-based.

No entanto, deve ser seguro usar [`--replicate-do-db`](replication-options-replica.html#option_mysqld_replicate-do-db) para este fim se você estiver usando apenas a replicação row-based, pois, neste caso, o Database atualmente selecionado não afeta a operação da opção.

Por exemplo, para suportar a separação conforme mostrado na [Figura 16.2, “Replicando Databases para Replicas Separadas”](replication-solutions-partitioning.html#figure_replication-multi-db "Figura 16.2 Replicando Databases para Replicas Separadas"), você deve configurar cada Replica da seguinte forma, antes de executar [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement"):

* O Replica 1 deve usar `--replicate-wild-do-table=databaseA.%`.

* O Replica 2 deve usar `--replicate-wild-do-table=databaseB.%`.

* O Replica 3 deve usar `--replicate-wild-do-table=databaseC.%`.

Cada Replica nesta configuração recebe o Binary Log inteiro do Source, mas executa apenas os eventos do Binary Log que se aplicam aos Databases e Tables incluídos pela opção [`--replicate-wild-do-table`](replication-options-replica.html#option_mysqld_replicate-wild-do-table) em vigor nesse Replica.

Se você tiver dados que devem ser sincronizados com as Replicas antes do início da replicação, você tem várias opções:

* Sincronizar todos os dados para cada Replica e excluir os Databases, Tables ou ambos que você não deseja manter.

* Use o [**mysqldump**](mysqldump.html "4.5.4 mysqldump — Um Programa de Backup de Database") para criar um arquivo de dump separado para cada Database e carregar o arquivo de dump apropriado em cada Replica.

* Use um dump de arquivo de dados brutos (*raw data file dump*) e inclua apenas os arquivos e Databases específicos de que você precisa para cada Replica.

  Nota

  Isso não funciona com Databases [`InnoDB`](innodb-storage-engine.html "Capítulo 14 O InnoDB Storage Engine") a menos que você use [`innodb_file_per_table`](innodb-parameters.html#sysvar_innodb_file_per_table).