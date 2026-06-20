# Capítulo 16 Replicação

A replicação permite que os dados de um servidor de banco de dados MySQL (a fonte) sejam copiados para um ou mais servidores de banco de dados MySQL (as réplicas). A replicação é assíncrona por padrão; as réplicas não precisam estar conectadas permanentemente para receber atualizações da fonte. Dependendo da configuração, você pode replicar todos os bancos de dados, bancos de dados selecionados ou até mesmo tabelas selecionadas dentro de um banco de dados.

As vantagens da replicação no MySQL incluem:

* Soluções de expansão - espalhando a carga entre múltiplas réplicas para melhorar o desempenho. Nesse ambiente, todas as escritas e atualizações devem ocorrer no servidor de origem da replicação. As leituras, no entanto, podem ocorrer em uma ou mais réplicas. Esse modelo pode melhorar o desempenho das escritas (já que a fonte é dedicada às atualizações), enquanto aumenta drasticamente a velocidade de leitura em um número crescente de réplicas.

* Segurança dos dados - porque os dados são replicados para a replica, e a replica pode pausar o processo de replicação, é possível executar serviços de backup na replica sem corromper os dados de origem correspondentes.

* Análises - dados em tempo real podem ser criados na fonte, enquanto a análise das informações pode ocorrer na replica sem afetar o desempenho da fonte.

* Distribuição de dados de longa distância: você pode usar a replicação para criar uma cópia local dos dados para uso de um site remoto, sem acesso permanente à fonte.

Para informações sobre como usar a replicação em tais cenários, consulte a Seção 16.3, “Soluções de replicação”.

O MySQL 5.7 suporta diferentes métodos de replicação. O método tradicional é baseado na replicação de eventos do log binário da fonte e requer que os arquivos de log e as posições neles sejam sincronizados entre a fonte e a replica. O método mais recente, baseado em identificadores de transação global (GTIDs), é transacional e, portanto, não requer o trabalho com arquivos de log ou posições dentro desses arquivos, o que simplifica muito muitas tarefas comuns de replicação. A replicação usando GTIDs garante consistência entre a fonte e a replica, desde que todas as transações comprometidas na fonte também tenham sido aplicadas na replica. Para mais informações sobre GTIDs e replicação baseada em GTIDs no MySQL, consulte a Seção 16.1.3, “Replicação com Identificadores de Transação Global”. Para informações sobre o uso de replicação com base na posição do arquivo de log binário, consulte a Seção 16.1, “Configuração da Replicação”.

A replicação no MySQL suporta diferentes tipos de sincronização. O tipo original de sincronização é a replicação unidirecional, assíncrona, na qual um servidor atua como a fonte, enquanto um ou mais outros servidores atuam como réplicas. Isso contrasta com a *síncrona*, que é uma característica do NDB Cluster (consulte o Capítulo 21, *MySQL NDB Cluster 7.5 e NDB Cluster 7.6*). No MySQL 5.7, a replicação semiesincrônica é suportada além da replicação assíncrona embutida. Com a replicação semiesincrônica, um commit realizado na fonte bloqueia antes de retornar à sessão que realizou a transação até que pelo menos uma réplica reconheça que recebeu e registrou os eventos da transação; consulte a Seção 16.3.9, “Replicação Semiesincrônica”. O MySQL 5.7 também suporta replicação adiada, de modo que uma réplica fique deliberadamente atrasada em relação à fonte por pelo menos um período de tempo especificado; consulte a Seção 16.3.10, “Replicação Adiada”. Para cenários em que é necessária a *síncrona*, use o NDB Cluster (consulte o Capítulo 21, *MySQL NDB Cluster 7.5 e NDB Cluster 7.6*).

Há várias soluções disponíveis para configurar a replicação entre servidores, e o melhor método a usar depende da presença de dados e dos tipos de motor que você está usando. Para obter mais informações sobre as opções disponíveis, consulte a Seção 16.1.2, “Configurando a replicação com base na posição do arquivo de registro binário”.

Existem dois tipos principais de formato de replicação, a Replicação Baseada em Declaração (SBR), que replica declarações SQL inteiras, e a Replicação Baseada em Linha (RBR), que replica apenas as linhas alteradas. Você também pode usar uma terceira variedade, a Replicação Baseada Mista (MBR). Para mais informações sobre os diferentes formatos de replicação, consulte a Seção 16.2.1, “Formatos de Replicação”.

A replicação é controlada por uma série de opções e variáveis diferentes. Para mais informações, consulte a Seção 16.1.6, “Opções e variáveis de replicação e registro binário”.

Você pode usar a replicação para resolver uma série de problemas diferentes, incluindo desempenho, suporte para backup de diferentes bancos de dados e como parte de uma solução maior para aliviar falhas no sistema. Para obter informações sobre como abordar esses problemas, consulte a Seção 16.3, “Soluções de Replicação”.

Para notas e dicas sobre como diferentes tipos de dados e declarações são tratados durante a replicação, incluindo detalhes sobre recursos de replicação, compatibilidade de versão, atualizações e problemas potenciais e suas resoluções, consulte a Seção 16.4, “Notas e dicas de replicação”. Para respostas a algumas perguntas frequentemente feitas por aqueles que são novos no MySQL Replication, consulte a Seção A.14, “Perguntas frequentes do MySQL 5.7: Replicação”.

Para informações detalhadas sobre a implementação da replicação, como a replicação funciona, o processo e o conteúdo do log binário, os threads de fundo e as regras usadas para decidir como as declarações são registradas e replicadas, consulte a Seção 16.2, “Implementação da Replicação”.