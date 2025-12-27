## Replicação de NDB Cluster

25.7.1 Replicação de NDB Cluster: Abreviações e Símbolos

25.7.2 Requisitos Gerais para a Replicação de NDB Cluster

25.7.3 Problemas Conhecidos na Replicação de NDB Cluster

25.7.4 Esquema e Tabelas de Replicação de NDB Cluster

25.7.5 Preparando o NDB Cluster para a Replicação

25.7.6 Iniciando a Replicação de NDB Cluster (Canal de Replicação Único)

25.7.7 Usando Dois Canais de Replicação para a Replicação de NDB Cluster

25.7.8 Implementando o Failover com a Replicação de NDB Cluster

25.7.9 Backups de NDB Cluster com a Replicação de NDB Cluster

25.7.10 Replicação de NDB Cluster: Replicação Bidirecional e Circular

25.7.11 Replicação de NDB Cluster Usando o Aplicável Multithreaded

25.7.12 Resolução de Conflitos na Replicação de NDB Cluster

O NDB Cluster suporta a replicação assíncrona, mais comumente referida simplesmente como “replicação”. Esta seção explica como configurar e gerenciar uma configuração em que um grupo de computadores operando como um NDB Cluster replica para um segundo computador ou grupo de computadores. Assumemos que o leitor tem alguma familiaridade com a replicação padrão do MySQL, conforme discutido em outras partes deste Manual. (Veja o Capítulo 19, *Replicação*).

Nota

O NDB Cluster não suporta replicação usando GTIDs; a replicação semissíncrona e a replicação em grupo também não são suportadas pelo motor de armazenamento `NDB`.

A replicação normal (não agrupada) envolve um servidor fonte e um servidor replica, sendo o fonte assim chamado porque as operações e os dados a serem replicados têm origem nele, e o replica sendo o destinatário desses dados. No NDB Cluster, a replicação é conceitualmente muito semelhante, mas pode ser mais complexa na prática, pois pode ser estendida para cobrir várias configurações diferentes, incluindo a replicação entre dois clusters completos. Embora um NDB Cluster em si dependa do motor de armazenamento `NDB` para a funcionalidade de agrupamento, não é necessário usar `NDB` como o motor de armazenamento para as cópias das tabelas replicadas da replica (veja Replicação de NDB para outros motores de armazenamento). No entanto, para a máxima disponibilidade, é possível (e preferível) replicar de um NDB Cluster para outro, e é esse cenário que discutimos, conforme mostrado na figura a seguir:

**Figura 25.10 Layout de Replicação Cluster-Cluster NDB**

![Grande parte do conteúdo é descrito no texto ao redor. Visualiza como um MySQL fonte é replicado. A replica difere na medida em que mostra um fio de I/O (receptor) apontando para um log binário de relevo que aponta para um fio de SQL (aplicador). Além disso, enquanto o log binário aponta para e de o motor NDBCLUSTER no servidor fonte, na replica aponta diretamente para um nó SQL (servidor MySQL).](images/cluster-replication-overview.png)

Nesse cenário, o processo de replicação é aquele em que os estados sucessivos de um cluster de origem são registrados e salvos em um cluster de replica. Esse processo é realizado por um fio especial conhecido como fio de injeção de log binário NDB, que roda em cada servidor MySQL e produz um log binário (`binlog`). Esse fio garante que todas as alterações no cluster que produz o log binário — e não apenas as alterações efetuadas através do MySQL Server — sejam inseridas no log binário com a ordem de serialização correta. Referenciamos os servidores de origem e replica MySQL como servidores de replicação ou nós de replicação, e o fluxo de dados ou linha de comunicação entre eles como um canal de replicação.

Para obter informações sobre a realização da recuperação em um ponto no tempo com o NDB Cluster e a replicação do NDB Cluster, consulte a Seção 25.7.9.2, “Recuperação em Ponto no Tempo Usando a Replicação do NDB Cluster”.

**Variáveis de status da API NDB replica.** Os contadores da API NDB podem fornecer capacidades de monitoramento aprimoradas em clusters de replica. Esses contadores são implementados como variáveis de status de estatísticas NDB `_replica`, conforme visto na saída de `SHOW STATUS`, ou nos resultados de consultas contra a tabela `session_status` ou `global_status` do Schema de Desempenho em uma sessão do cliente **mysql** conectada a um servidor MySQL que está atuando como uma replica na replicação do NDB Cluster. Ao comparar os valores dessas variáveis de status antes e depois da execução de declarações que afetam as tabelas `NDB` replicadas, você pode observar as ações correspondentes tomadas no nível da API NDB pela replica, o que pode ser útil ao monitorar ou solucionar problemas na replicação do NDB Cluster. A Seção 25.6.14, “Contadores e Variáveis de Estatísticas da API NDB”, fornece informações adicionais.

**Replicação de tabelas NDB para tabelas não NDB.** É possível replicar tabelas `NDB` de um NDB Cluster que atua como fonte de replicação para tabelas que utilizam outros motores de armazenamento MySQL, como `InnoDB` ou `MyISAM`, em uma replica **mysqld**. Isso está sujeito a várias condições; consulte Replicação de NDB para outros motores de armazenamento e Replicação de NDB para um motor de armazenamento não transacional para obter mais informações.