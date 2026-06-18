### 21.6.8 Backup Online do NDB Cluster

21.6.8.1 Conceitos de Backup do NDB Cluster

21.6.8.2 Usando o Cliente de Gerenciamento do NDB Cluster para Criar um Backup

21.6.8.3 Configuração para Backups do NDB Cluster

21.6.8.4 Solução de Problemas de Backup do NDB Cluster

As próximas seções descrevem como se preparar e, em seguida, como criar um Backup do NDB Cluster usando a funcionalidade para este propósito encontrada no cliente de gerenciamento **ndb_mgm**. Para distinguir este tipo de Backup de um Backup realizado usando **mysqldump**, às vezes nos referimos a ele como um Backup "nativo" do NDB Cluster. (Para obter informações sobre a criação de Backups com **mysqldump**, consulte Seção 4.5.4, “mysqldump — Um Programa de Backup de Database”.) A Restauração de Backups do NDB Cluster é feita usando o utilitário **ndb_restore** fornecido com a distribuição do NDB Cluster; para obter informações sobre **ndb_restore** e seu uso na restauração de Backups do NDB Cluster, consulte Seção 21.5.24, “ndb_restore — Restauração de um Backup do NDB Cluster”.