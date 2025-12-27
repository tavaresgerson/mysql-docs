# Capítulo 19 Replicação

**Índice**

19.1 Configurando a Replicação:   19.1.1 Configuração Geral da Replicação Baseada na Posição do Arquivo de Log Binário

    19.1.2 Configurando a Replicação Baseada na Posição do Arquivo de Log Binário

    19.1.3 Replicação com Identificadores Globais de Transação

    19.1.4 Alterando o Modo GTID em Servidores Online

    19.1.5 Replicação Multimídia MySQL

    19.1.6 Opções e Variáveis de Replicação e Registro de Log Binário

    19.1.7 Tarefas Comuns de Administração da Replicação

19.2 Implementação da Replicação:   19.2.1 Formatos de Replicação

    19.2.2 Canais de Replicação

    19.2.3 Threads de Replicação

    19.2.4 Repositórios de Metadados de Registro de Log e Registro de Log de Relay

    19.2.5 Como os Servidores Avaliam as Regras de Filtragem de Replicação

19.3 Segurança da Replicação:   19.3.1 Configurando a Replicação para Usar Conexões Encriptadas

    19.3.2 Encriptando Arquivos de Registro Binário e Arquivos de Registro de Relay

    19.3.3 Verificações de Privilégios de Replicação

19.4 Soluções de Replicação:   19.4.1 Usando a Replicação para Backups

    19.4.2 Lidando com um Parada Inesperada de uma Replicação

    19.4.3 Monitoramento da Replicação Baseada em Linhas

    19.4.4 Usando a Replicação com Diferentes Motores de Armazenamento de Fonte e Replicação

    19.4.5 Usando a Replicação para Expansão

    19.4.6 Replicando Diferentes Bancos de Dados para Diferentes Replicações

    19.4.7 Melhorando o Desempenho da Replicação

    19.4.8 Trocando Fontes Durante o Failover

    19.4.9 Trocando Fontes e Replicações com Failover de Conexão Assincrônica

    19.4.10 Replicação Semisincronizada

    19.4.11 Replicação Atrasar

19.5 Notas e Dicas sobre Replicação:   19.5.1 Recursos e Problemas de Replicação

    19.5.2 Compatibilidade da Replicação entre Versões do MySQL

    19.5.3 Atualizando ou Desatualizando uma Topologia de Replicação

    19.5.4 Solução de Problemas com a Replicação

19.5.5 Como relatar erros ou problemas de replicação

A replicação permite que os dados de um servidor de banco de dados MySQL (conhecido como fonte) sejam copiados para um ou mais servidores de banco de dados MySQL (conhecidos como réplicas). A replicação é assíncrona por padrão; as réplicas não precisam estar permanentemente conectadas para receber atualizações de uma fonte. Dependendo da configuração, é possível replicar todos os bancos de dados, bancos de dados selecionados ou até mesmo tabelas selecionadas dentro de um banco de dados.

As vantagens da replicação no MySQL incluem:

* Soluções de escalabilidade - espalhando a carga entre múltiplas réplicas para melhorar o desempenho. Nesse ambiente, todas as escritas e atualizações devem ocorrer no servidor de origem. As leituras, no entanto, podem ocorrer em uma ou mais réplicas. Esse modelo pode melhorar o desempenho das escritas (já que a fonte é dedicada às atualizações), enquanto aumenta drasticamente a velocidade de leitura em um número crescente de réplicas.

* Segurança dos dados - porque a réplica pode pausar o processo de replicação, é possível executar serviços de backup na réplica sem corromper os dados correspondentes da fonte.

* Análises - dados em tempo real podem ser criados na fonte, enquanto a análise das informações pode ocorrer na réplica sem afetar o desempenho da fonte.

* Distribuição de dados de longa distância - é possível usar a replicação para criar uma cópia local dos dados para uso em um site remoto, sem acesso permanente à fonte.

Para obter informações sobre como usar a replicação em tais cenários, consulte a Seção 19.4, “Soluções de replicação”.

O MySQL 9.5 suporta diferentes métodos de replicação. O método tradicional é baseado na replicação de eventos do log binário da fonte e requer que os arquivos de log e suas posições sejam sincronizados entre a fonte e a replica. O método mais recente, baseado em identificadores de transações globais (GTIDs), é transacional e, portanto, não requer o trabalho com arquivos de log ou suas posições dentro desses arquivos, o que simplifica muito muitas tarefas comuns de replicação. A replicação usando GTIDs garante consistência entre a fonte e a replica, desde que todas as transações comprometidas na fonte também tenham sido aplicadas na replica. Para mais informações sobre GTIDs e replicação baseada em GTIDs no MySQL, consulte a Seção 19.1.3, “Replicação com Identificadores de Transações Globais”. Para informações sobre o uso da replicação baseada na posição do arquivo de log binário, consulte a Seção 19.1, “Configurando a Replicação”.

A replicação no MySQL suporta diferentes tipos de sincronização. O tipo original de sincronização é a replicação assíncrona de um único sentido, na qual um servidor atua como a fonte, enquanto um ou mais outros servidores atuam como réplicas. Isso contrasta com a replicação *síncrona*, que é uma característica do NDB Cluster (veja o Capítulo 25, *MySQL NDB Cluster 9.5*). No MySQL 9.5, a replicação semissíncrona é suportada além da replicação assíncrona integrada. Com a replicação semissíncrona, um commit realizado na fonte bloqueia antes de retornar à sessão que realizou a transação até que pelo menos uma réplica reconheça que recebeu e registrou os eventos para a transação; veja a Seção 19.4.10, “Replicação Semissíncrona”. O MySQL 9.5 também suporta replicação atrasada, de modo que uma réplica fica deliberadamente atrasada em relação à fonte por pelo menos um período de tempo especificado; veja a Seção 19.4.11, “Replicação Atrasada”. Para cenários em que a replicação *síncrona* é necessária, use o NDB Cluster (veja o Capítulo 25, *MySQL NDB Cluster 9.5*).

Existem várias soluções disponíveis para configurar a replicação entre servidores, e o melhor método a ser usado depende da presença de dados e dos tipos de motor que você está usando. Para mais informações sobre as opções disponíveis, veja a Seção 19.1.2, “Configurando a Replicação com Base no Posição do Arquivo de Log Binário”.

Existem dois tipos principais de formato de replicação, a Replicação Baseada em Declarações (SBR), que replica declarações SQL inteiras, e a Replicação Baseada em Linhas (RBR), que replica apenas as linhas alteradas. Você também pode usar uma terceira variedade, a Replicação Baseada em Mistura (MBR). Para mais informações sobre os diferentes formatos de replicação, veja a Seção 19.2.1, “Formatos de Replicação”.

A replicação é controlada por várias opções e variáveis diferentes. Para obter mais informações, consulte a Seção 19.1.6, “Opções e variáveis de replicação e registro binário”. Medidas de segurança adicionais podem ser aplicadas a uma topologia de replicação, conforme descrito na Seção 19.3, “Segurança da replicação”.

Você pode usar a replicação para resolver vários problemas diferentes, incluindo desempenho, suporte à cópia de segurança de diferentes bancos de dados e como parte de uma solução maior para aliviar falhas no sistema. Para obter informações sobre como resolver esses problemas, consulte a Seção 19.4, “Soluções de replicação”.

Para notas e dicas sobre como diferentes tipos de dados e declarações são tratados durante a replicação, incluindo detalhes sobre recursos de replicação, compatibilidade de versão, atualizações e problemas potenciais e sua resolução, consulte a Seção 19.5, “Notas e dicas de replicação”. Para respostas a algumas perguntas frequentemente feitas por aqueles que são novos no MySQL Replication, consulte a Seção A.14, “Perguntas frequentes do MySQL 9.5: Replicação”.

Para informações detalhadas sobre a implementação da replicação, como a replicação funciona, o processo e o conteúdo do log binário, os threads de segundo plano e as regras usadas para decidir como as declarações são registradas e replicadas, consulte a Seção 19.2, “Implementação da replicação”.