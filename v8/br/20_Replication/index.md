# Capítulo 19 Replicação

A replicação permite que os dados de um servidor de banco de dados MySQL (conhecido como fonte) sejam copiados para um ou mais servidores de banco de dados MySQL (conhecidos como réplicas). A replicação é assíncrona por padrão; as réplicas não precisam estar conectadas permanentemente para receber atualizações de uma fonte. Dependendo da configuração, você pode replicar todos os bancos de dados, bancos de dados selecionados ou até mesmo tabelas selecionadas dentro de um banco de dados.

As vantagens da replicação no MySQL incluem:

* Soluções de expansão - espalhando a carga entre múltiplas réplicas para melhorar o desempenho. Nesse ambiente, todas as gravações e atualizações devem ocorrer no servidor de origem. As leituras, no entanto, podem ocorrer em uma ou mais réplicas. Esse modelo pode melhorar o desempenho das gravações (já que a fonte é dedicada a atualizações), enquanto aumenta drasticamente a velocidade de leitura em um número crescente de réplicas.

* Segurança dos dados - porque a replica pode pausar o processo de replicação, é possível executar serviços de backup na replica sem corromper os dados correspondentes da fonte.

* Análises - dados em tempo real podem ser criados na fonte, enquanto a análise das informações pode ocorrer na replica sem afetar o desempenho da fonte.

* Distribuição de dados de longa distância: você pode usar a replicação para criar uma cópia local dos dados para uso de um site remoto, sem acesso permanente à fonte.

Para informações sobre como usar a replicação em tais cenários, consulte a Seção 19.4, “Soluções de replicação”.

O MySQL 8.0 suporta diferentes métodos de replicação. O método tradicional é baseado na replicação de eventos do log binário da fonte e requer que os arquivos de log e as posições neles sejam sincronizados entre a fonte e a replica. O método mais recente, baseado em identificadores de transação global (GTIDs), é transacional e, portanto, não requer o trabalho com arquivos de log ou posições dentro desses arquivos, o que simplifica muito muitas tarefas comuns de replicação. A replicação usando GTIDs garante consistência entre a fonte e a replica, desde que todas as transações comprometidas na fonte também tenham sido aplicadas na replica. Para mais informações sobre GTIDs e replicação baseada em GTIDs no MySQL, consulte a Seção 19.1.3, “Replicação com Identificadores de Transação Global”. Para informações sobre o uso de replicação com base na posição do arquivo de log binário, consulte a Seção 19.1, “Configuração da Replicação”.

A replicação no MySQL suporta diferentes tipos de sincronização. O tipo original de sincronização é a replicação unidirecional, assíncrona, na qual um servidor atua como a fonte, enquanto um ou mais outros servidores atuam como réplicas. Isso contrasta com a replicação *síncrona*, que é uma característica do NDB Cluster (ver Capítulo 25, *MySQL NDB Cluster 8.0*). No MySQL 8.0, a replicação semiesincrônica é suportada além da replicação assíncrona embutida. Com a replicação semiesincrônica, um commit realizado na fonte bloquea antes de retornar à sessão que realizou a transação até que pelo menos uma réplica reconheça que recebeu e registrou os eventos da transação; veja Seção 19.4.10, “Replicação Semiesincrônica”. O MySQL 8.0 também suporta replicação adiada, de modo que uma réplica fique deliberadamente atrasada em relação à fonte por pelo menos um período de tempo especificado; veja Seção 19.4.11, “Replicação Adiada”. Para cenários em que é necessária a replicação *síncrona*, use o NDB Cluster (ver Capítulo 25, *MySQL NDB Cluster 8.0*).

Há várias soluções disponíveis para configurar a replicação entre servidores, e o melhor método a usar depende da presença de dados e dos tipos de motor que você está usando. Para obter mais informações sobre as opções disponíveis, consulte a Seção 19.1.2, “Configurando a replicação com base na posição do arquivo de registro binário”.

Existem dois tipos principais de formato de replicação, a Replicação Baseada em Declaração (SBR), que replica declarações SQL inteiras, e a Replicação Baseada em Linha (RBR), que replica apenas as linhas alteradas. Você também pode usar uma terceira variedade, a Replicação Baseada Mista (MBR). Para mais informações sobre os diferentes formatos de replicação, consulte a Seção 19.2.1, “Formatos de Replicação”.

A replicação é controlada por uma série de opções e variáveis diferentes. Para mais informações, consulte a Seção 19.1.6, “Opções e variáveis de replicação e registro binário”. Medidas adicionais de segurança podem ser aplicadas a uma topologia de replicação, conforme descrito na Seção 19.3, “Segurança da replicação”.

Você pode usar a replicação para resolver uma série de problemas diferentes, incluindo desempenho, suporte para backup de diferentes bancos de dados e como parte de uma solução maior para aliviar falhas no sistema. Para obter informações sobre como abordar esses problemas, consulte a Seção 19.4, “Soluções de Replicação”.

Para notas e dicas sobre como diferentes tipos de dados e declarações são tratados durante a replicação, incluindo detalhes sobre recursos de replicação, compatibilidade de versão, atualizações e problemas potenciais e sua resolução, consulte a Seção 19.5, “Notas e dicas de replicação”. Para respostas a algumas perguntas frequentemente feitas por aqueles que são novos no MySQL Replication, consulte a Seção A.14, “Perguntas frequentes do MySQL 8.0: Replicação”.

Para informações detalhadas sobre a implementação da replicação, como a replicação funciona, o processo e o conteúdo do log binário, os threads de fundo e as regras usadas para decidir como as declarações são registradas e replicadas, consulte a Seção 19.2, “Implementação da Replicação”.