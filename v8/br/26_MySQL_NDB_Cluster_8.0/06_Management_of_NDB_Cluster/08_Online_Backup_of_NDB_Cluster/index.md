### 25.6.8 Backup online do NDB Cluster

25.6.8.1 Conceitos de backup de cluster NDB

25.6.8.2 Usar o cliente de gerenciamento de cluster do NDB para criar um backup

25.6.8.3 Configuração para backups de NDB Cluster

25.6.8.4 Solução de problemas de backup do cluster NDB

25.6.8.5 Fazer um backup do NDB com nós de dados paralelos

As próximas seções descrevem como preparar e, em seguida, criar um backup de um NDB Cluster usando a funcionalidade para esse propósito encontrada no cliente de gerenciamento **ndb\_mgm**. Para distinguir esse tipo de backup de um backup feito usando **mysqldump**, às vezes o chamamos de backup "nativo" do NDB Cluster. (Para informações sobre a criação de backups com **mysqldump**, consulte a Seção 6.5.4, “mysqldump — Um Programa de Backup de Banco de Dados”.) A restauração de backups de NDB Cluster é feita usando o utilitário **ndb\_restore** fornecido com a distribuição do NDB Cluster; para informações sobre **ndb\_restore** e seu uso na restauração de backups do NDB Cluster, consulte a Seção 25.5.23, “ndb\_restore — Restaurar um Backup de NDB Cluster”.

O NDB 8.0 permite criar backups usando múltiplos LDMs para alcançar paralelismo nos nós de dados. Veja a Seção 25.6.8.5, “Fazendo um backup do NDB com nós de dados paralelos”.
