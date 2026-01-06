### 21.6.8 Backup online do NDB Cluster

21.6.8.1 Conceitos de backup de clusters NDB

21.6.8.2 Usando o Cliente de Gerenciamento de NDB Cluster para Criar um Backup

21.6.8.3 Configuração para backups de NDB Cluster

21.6.8.4 Solução de problemas de backup do cluster NDB

As próximas seções descrevem como preparar e criar um backup de um NDB Cluster, utilizando a funcionalidade para esse propósito encontrada no cliente de gerenciamento **ndb\_mgm**. Para distinguir esse tipo de backup de um backup feito usando **mysqldump**, às vezes o chamamos de “backup nativo” do NDB Cluster. (Para informações sobre a criação de backups com **mysqldump**, consulte Seção 4.5.4, “mysqldump — Um Programa de Backup de Banco de Dados”.) A restauração de backups do NDB Cluster é feita usando o utilitário **ndb\_restore** fornecido com a distribuição do NDB Cluster; para informações sobre **ndb\_restore** e seu uso na restauração de backups do NDB Cluster, consulte Seção 21.5.24, “ndb\_restore — Restaurar um Backup do NDB Cluster”.
