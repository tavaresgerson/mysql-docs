### 21.6.8 Backup Online do NDB Cluster

[21.6.8.1 Conceitos de Backup do NDB Cluster](mysql-cluster-backup-concepts.html)

[21.6.8.2 Usando o Cliente de Gerenciamento do NDB Cluster para Criar um Backup](mysql-cluster-backup-using-management-client.html)

[21.6.8.3 Configuração para Backups do NDB Cluster](mysql-cluster-backup-configuration.html)

[21.6.8.4 Solução de Problemas de Backup do NDB Cluster](mysql-cluster-backup-troubleshooting.html)

As próximas seções descrevem como se preparar e, em seguida, como criar um Backup do NDB Cluster usando a funcionalidade para este propósito encontrada no cliente de gerenciamento [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — O Cliente de Gerenciamento do NDB Cluster"). Para distinguir este tipo de Backup de um Backup realizado usando [**mysqldump**](mysqldump.html "4.5.4 mysqldump — Um Programa de Backup de Database"), às vezes nos referimos a ele como um Backup "nativo" do NDB Cluster. (Para obter informações sobre a criação de Backups com [**mysqldump**](mysqldump.html "4.5.4 mysqldump — Um Programa de Backup de Database"), consulte [Seção 4.5.4, “mysqldump — Um Programa de Backup de Database”](mysqldump.html "4.5.4 mysqldump — Um Programa de Backup de Database").) A Restauração de Backups do NDB Cluster é feita usando o utilitário [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") fornecido com a distribuição do NDB Cluster; para obter informações sobre [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster") e seu uso na restauração de Backups do NDB Cluster, consulte [Seção 21.5.24, “ndb_restore — Restauração de um Backup do NDB Cluster”](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster").