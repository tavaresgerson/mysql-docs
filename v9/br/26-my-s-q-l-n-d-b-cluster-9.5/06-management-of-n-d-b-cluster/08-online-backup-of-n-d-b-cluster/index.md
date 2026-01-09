### 25.6.8 Backup Online de NDB Cluster

25.6.8.1 Conceitos de Backup de NDB Cluster

25.6.8.2 Usando o Cliente de Gerenciamento do NDB Cluster para Criar um Backup

25.6.8.3 Configuração para Backups de NDB Cluster

25.6.8.4 Solução de Problemas com o Backup de NDB Cluster

25.6.8.5 Fazendo um Backup de NDB com Nodos de Dados Paralelos

As próximas seções descrevem como se preparar e, em seguida, criar um backup de NDB Cluster usando a funcionalidade para esse propósito encontrada no cliente de gerenciamento **ndb_mgm**. Para distinguir esse tipo de backup de um backup feito usando **mysqldump**, às vezes o chamamos de backup “nativo” do NDB Cluster. (Para informações sobre a criação de backups com **mysqldump**, consulte a Seção 6.5.4, “mysqldump — Um Programa de Backup de Banco de Dados”.) A restauração de backups de NDB Cluster é feita usando o utilitário **ndb_restore** fornecido com a distribuição do NDB Cluster; para informações sobre **ndb_restore** e seu uso na restauração de backups de NDB Cluster, consulte a Seção 25.5.23, “ndb_restore — Restaurar um Backup de NDB Cluster”.

Também é possível criar backups usando múltiplos LDMs para alcançar paralelismo nos nós de dados. Veja a Seção 25.6.8.5, “Fazendo um Backup de NDB com Nodos de Dados Paralelos”.