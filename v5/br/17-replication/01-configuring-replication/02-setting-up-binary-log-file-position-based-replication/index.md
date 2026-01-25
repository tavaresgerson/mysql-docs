### 16.1.2 Configurando a Replication Baseada na Posição do Arquivo de Binary Log

[16.1.2.1 Configurando a Source de Replication](replication-howto-masterbaseconfig.html)

[16.1.2.2 Criando um Usuário para Replication](replication-howto-repuser.html)

[16.1.2.3 Obtendo as Coordenadas do Binary Log da Source de Replication](replication-howto-masterstatus.html)

[16.1.2.4 Escolhendo um Método para Data Snapshots](replication-snapshot-method.html)

[16.1.2.5 Configurando Replicas](replication-setup-replicas.html)

[16.1.2.6 Adicionando Replicas a uma Topologia de Replication](replication-howto-additionalslaves.html)

Esta seção descreve como configurar um MySQL Server para usar a Replication baseada na posição do arquivo de Binary Log. Existem diversos métodos diferentes para configurar a Replication, e o método exato a ser usado depende de como você está configurando a Replication e se você já possui dados no Database na Source.

Existem algumas tarefas genéricas que são comuns a todas as configurações:

* Na Source, você deve habilitar o binary logging e configurar um Server ID exclusivo. Isso pode exigir a reinicialização do server. Consulte [Seção 16.1.2.1, “Configurando a Source de Replication”](replication-howto-masterbaseconfig.html "16.1.2.1 Setting the Replication Source Configuration").

* Em cada Replica que você deseja conectar à Source, você deve configurar um Server ID exclusivo. Isso pode exigir a reinicialização do server. Consulte [Seção 16.1.2.5.1, “Configurando a Replica”](replication-setup-replicas.html#replication-howto-slavebaseconfig "16.1.2.5.1 Setting the Replica Configuration").

* Opcionalmente, crie um user separado para suas Replicas usarem durante a autenticação com a Source ao ler o Binary Log para a Replication. Consulte [Seção 16.1.2.2, “Criando um Usuário para Replication”](replication-howto-repuser.html "16.1.2.2 Creating a User for Replication").

* Antes de criar um Data Snapshot ou iniciar o processo de Replication, na Source você deve registrar a posição atual no Binary Log. Você precisa dessa informação ao configurar a Replica para que ela saiba onde no Binary Log começar a executar os eventos. Consulte [Seção 16.1.2.3, “Obtendo as Coordenadas do Binary Log da Source de Replication”](replication-howto-masterstatus.html "16.1.2.3 Obtaining the Replication Source's Binary Log Coordinates").

* Se você já possui dados na Source e deseja usá-los para sincronizar a Replica, você precisa criar um Data Snapshot para copiar os dados para a Replica. A Storage Engine que você está usando tem um impacto sobre como você cria o Snapshot. Ao usar [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine"), você deve interromper o processamento de statements na Source para obter um read-lock, depois obter suas coordenadas atuais do Binary Log e fazer o dump dos seus dados, antes de permitir que a Source continue executando statements. Se você não interromper a execução de statements, o data dump e as informações de status da Source não corresponderão, resultando em Databases inconsistentes ou corrompidos nas Replicas. Para obter mais informações sobre a Replication de uma Source [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine"), consulte [Seção 16.1.2.3, “Obtendo as Coordenadas do Binary Log da Source de Replication”](replication-howto-masterstatus.html "16.1.2.3 Obtaining the Replication Source's Binary Log Coordinates"). Se você estiver usando [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"), você não precisa de um read-lock, e uma transaction longa o suficiente para transferir o Data Snapshot é suficiente. Para obter mais informações, consulte [Seção 14.20, “InnoDB e MySQL Replication”](innodb-and-mysql-replication.html "14.20 InnoDB and MySQL Replication").

* Configure a Replica com as configurações para conexão à Source, como o nome do host, credenciais de login e o nome e posição do arquivo de Binary Log. Consulte [Seção 16.1.2.5.2, “Configurando a Source na Replica”](replication-setup-replicas.html#replication-howto-slaveinit "16.1.2.5.2 Setting the Source Configuration on the Replica").

Note

Certas etapas no processo de configuração exigem o privilégio [`SUPER`](privileges-provided.html#priv_super). Se você não tiver esse privilégio, pode não ser possível habilitar a Replication.

Após configurar as opções básicas, selecione seu cenário:

* Para configurar a Replication para uma instalação nova de uma Source e Replicas que não contêm dados, consulte [Seção 16.1.2.5.3, “Configurando a Replication entre uma Nova Source e Replicas”](replication-setup-replicas.html#replication-howto-newservers "16.1.2.5.3 Setting Up Replication between a New Source and Replicas").

* Para configurar a Replication de uma nova Source usando os dados de um MySQL Server existente, consulte [Seção 16.1.2.5.4, “Configurando a Replication com Dados Existentes”](replication-setup-replicas.html#replication-howto-existingdata "16.1.2.5.4 Setting Up Replication with Existing Data").

* Para adicionar Replicas a um ambiente de Replication existente, consulte [Seção 16.1.2.6, “Adicionando Replicas a uma Topologia de Replication”](replication-howto-additionalslaves.html "16.1.2.6 Adding Replicas to a Replication Topology").

Antes de administrar os servers de MySQL Replication, leia este capítulo inteiro e teste todos os statements mencionados em [Seção 13.4.1, “SQL Statements para Controlar Servidores Source de Replication”](replication-statements-master.html "13.4.1 SQL Statements for Controlling Replication Source Servers") e [Seção 13.4.2, “SQL Statements para Controlar Servidores Replica”](replication-statements-replica.html "13.4.2 SQL Statements for Controlling Replica Servers"). Familiarize-se também com as opções de inicialização da Replication descritas em [Seção 16.1.6, “Opções e Variáveis de Replication e Binary Logging”](replication-options.html "16.1.6 Replication and Binary Logging Options and Variables").