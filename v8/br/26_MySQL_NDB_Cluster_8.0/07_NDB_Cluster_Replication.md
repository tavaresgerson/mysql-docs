## 25.7 Replicação de aglomerado do NDB

O NDB Cluster suporta replicação assíncrona, mais comumente referida simplesmente como “replicação”. Esta seção explica como configurar e gerenciar uma configuração na qual um grupo de computadores operando como um NDB Cluster replica para um segundo computador ou grupo de computadores. Assumemos que o leitor tenha alguma familiaridade com a replicação padrão do MySQL, conforme discutido em outros lugares deste Manual. (Veja o Capítulo 19, *Replicação*).

Nota

O NDB Cluster não suporta replicação usando GTIDs; a replicação semisíncrona e a replicação em grupo também não são suportadas pelo mecanismo de armazenamento `NDB`.

A replicação normal (não agrupada) envolve um servidor fonte e um servidor replica, sendo o servidor fonte denominado dessa forma porque as operações e os dados a serem replicados têm origem nele, e o servidor replica é o receptor desses dados. No NDB Cluster, a replicação é conceitualmente muito semelhante, mas pode ser mais complexa na prática, pois pode ser estendida para cobrir uma série de diferentes configurações, incluindo a replicação entre dois clusters completos. Embora um NDB Cluster em si dependa do motor de armazenamento `NDB` para a funcionalidade de agrupamento, não é necessário usar `NDB` como o motor de armazenamento para as cópias das tabelas replicadas da replica (veja Replicação de NDB para outros motores de armazenamento). No entanto, para máxima disponibilidade, é possível (e preferível) replicar de um NDB Cluster para outro, e é esse cenário que discutimos, conforme mostrado na figura a seguir:

**Figura 25.10 Layout de Replicação de NDB Cluster a Cluster**

![Much of the content is described in the surrounding text. It visualizes how a MySQL source is replicated. The replica differs in that it shows an I/O (receiver) thread pointing to a relay binary log which points to an SQL (applier) thread. In addition, while the binary log points to and from the NDBCLUSTER engine on the source server, on the replica it points directly to an SQL node (MySQL server).](images/cluster-replication-overview.png)

Nesse cenário, o processo de replicação é aquele em que os estados sucessivos de um cluster fonte são registrados e salvos em um cluster replica. Esse processo é realizado por um fio especial conhecido como fio de inserção do log binário NDB, que é executado em cada servidor MySQL e produz um log binário (`binlog`). Esse fio garante que todas as alterações no cluster que produz o log binário — e não apenas as alterações que são efetuadas através do servidor MySQL — sejam inseridas no log binário com a ordem de serialização correta. Referimos aos servidores fonte e replica do MySQL como servidores de replicação ou nós de replicação, e ao fluxo de dados ou linha de comunicação entre eles como um canal de replicação.

Para obter informações sobre a realização de recuperação em um ponto no tempo com o NDB Cluster e a Replicação do NDB Cluster, consulte a Seção 25.7.9.2, “Recuperação em um Ponto no Tempo Usando a Replicação do NDB Cluster”.

**Variáveis de status da replica da API NDB.** Os contadores da API NDB podem fornecer capacidades de monitoramento aprimoradas em clusters replicados. Esses contadores são implementados como variáveis de status de estatísticas NDB `_slave`, conforme visto na saída de `SHOW STATUS`, ou nos resultados de consultas contra a tabela do Schema de Desempenho `session_status` ou `global_status` em uma sessão de cliente **mysql** conectada a um servidor MySQL que está atuando como uma replica no NDB Cluster Replication. Ao comparar os valores dessas variáveis de status antes e depois da execução de declarações que afetam as tabelas replicadas `NDB`, você pode observar as ações correspondentes realizadas no nível da API NDB pela replica, o que pode ser útil ao monitorar ou solucionar problemas na Replicação do NDB Cluster. A Seção 25.6.15, “Contadores e Variáveis de Estatísticas da API NDB”, fornece informações adicionais.

**Replicação de `NDB` de tabelas NDB para tabelas não NDB.** É possível replicar as tabelas `NDB` de um NDB Cluster que atue como fonte de replicação para tabelas usando outros motores de armazenamento MySQL, como `InnoDB` ou `MyISAM`, em uma replica **mysqld**. Isso está sujeito a várias condições; consulte Replicação de NDB para outros motores de armazenamento e Replicação de NDB para um motor de armazenamento não transacional, para obter mais informações.

### 25.7.1 Replicação de aglomerado do NDB: Abreviações e símbolos

Ao longo desta seção, usamos as seguintes abreviações ou símbolos para se referir às réplicas de clusters e ao fonte, bem como aos processos e comandos executados nos clusters ou nos nós do cluster:

**Tabela 25.69 Abreviações utilizadas ao longo desta seção, referindo-se a clusters de origem e replicação, e a processos e comandos executados em nós do cluster**

<table><col style="width: 25%"/><col style="width: 75%"/><thead><tr> <th>Symbol or Abbreviation</th> <th>Descrição (Refere-se a...)</th> </tr></thead><tbody><tr> <td><em class="replaceable"><code>S</code></em></td> <td>O grupo que atua como a fonte (primária) de replicação</td> </tr><tr> <td><em class="replaceable"><code>R</code></em></td> <td>O grupo que atua como a (replica) (primaria)</td> </tr><tr> <td><code>shell<em class="replaceable"><code>S</code></em>&gt;</code></td> <td>Comando de shell a ser emitido no clúster de origem</td> </tr><tr> <td><code>mysql<em class="replaceable"><code>S</code></em>&gt;</code></td> <td>Comando do cliente MySQL emitido em um único servidor MySQL que funciona como um nó SQL no clúster de origem</td> </tr><tr> <td><code>mysql<em class="replaceable"><code>S*</code></em>&gt;</code></td> <td>Comando do cliente MySQL a ser emitido em todos os nós SQL que participam do clúster de origem de replicação</td> </tr><tr> <td><code>shell<em class="replaceable"><code>R</code></em>&gt;</code></td> <td>Comando de shell a ser emitido no clúster replica</td> </tr><tr> <td><code>mysql<em class="replaceable"><code>R</code></em>&gt;</code></td> <td>Comando do cliente MySQL emitido em um único servidor MySQL que funciona como um nó SQL no clúster de replica</td> </tr><tr> <td><code>mysql<em class="replaceable"><code>R*</code></em>&gt;</code></td> <td>Comando do cliente MySQL a ser emitido em todos os nós SQL que participam do clúster de replica</td> </tr><tr> <td><em class="replaceable"><code>C</code></em></td> <td>Canal de replicação primário</td> </tr><tr> <td><em class="replaceable"><code>C'</code></em></td> <td>Canal de replicação secundário</td> </tr><tr> <td><em class="replaceable"><code>S'</code></em></td> <td>Fonte de replicação secundária</td> </tr><tr> <td><em class="replaceable"><code>R'</code></em></td> <td>Replica secundária</td> </tr></tbody></table>

### 25.7.2 Requisitos Gerais para a Replicação de NDB Cluster

Um canal de replicação requer dois servidores MySQL atuando como servidores de replicação (um para cada fonte e replica). Por exemplo, isso significa que, no caso de uma configuração de replicação com dois canais de replicação (para fornecer um canal extra para redundância), deve haver um total de quatro nós de replicação, dois por clúster.

A replicação de um NDB Cluster conforme descrito nesta seção e nas seguintes é dependente da replicação baseada em linhas. Isso significa que o servidor MySQL da fonte de replicação deve estar em execução com `--binlog-format=ROW` ou `--binlog-format=MIXED`, conforme descrito na Seção 25.7.6, “Começando a replicação do NDB Cluster (Canal de replicação único”)”). Para informações gerais sobre replicação baseada em linhas, consulte a Seção 19.2.1, “Formatos de replicação”.

Importante

Se você tentar usar a Replicação de NDB Cluster com `--binlog-format=STATEMENT`, a replicação não funciona corretamente porque a tabela `ndb_binlog_index` no cluster de origem e a coluna `epoch` da tabela `ndb_apply_status` no cluster de replica não são atualizadas (consulte a Seção 25.7.4, “Esquema e tabelas de Replicação de NDB Cluster”). Em vez disso, apenas as atualizações no servidor MySQL que atua como fonte de replicação são propagadas para a replica, e nenhuma atualização de qualquer outro nó SQL no cluster de origem é replicada.

O valor padrão para a opção `--binlog-format` é `MIXED`.

Cada servidor MySQL utilizado para replicação em qualquer um dos clústeres deve ser identificado de forma única entre todos os servidores de replicação MySQL que participam em qualquer um dos clústeres (não é possível ter servidores de replicação em ambos os clústeres de origem e replicação compartilhando o mesmo ID). Isso pode ser feito iniciando cada nó SQL usando a opção `--server-id=id`, onde *`id`* é um número inteiro único. Embora não seja estritamente necessário, assumimos, para fins desta discussão, que todos os binários do NDB Cluster são da mesma versão de lançamento.

É geralmente verdade que, no MySQL Replication, ambos os servidores MySQL (**mysqld** processos) envolvidos devem ser compatíveis entre si, tanto em relação à versão do protocolo de replicação utilizado quanto aos conjuntos de recursos SQL que eles suportam (ver Seção 19.5.2, “Compatibilidade de Replicação entre Versões MySQL”). Devido a tais diferenças entre os binários do NDB Cluster e as distribuições do MySQL Server 8.0, a Replicação do NDB Cluster tem o requisito adicional de que ambos os binários **mysqld** vêm de uma distribuição do NDB Cluster. A maneira mais simples e fácil de garantir que os servidores **mysqld** sejam compatíveis é usar a mesma distribuição do NDB Cluster para todos os binários **mysqld** de origem e replica.

Suponhamos que o servidor ou clúster de replicação seja dedicado à replicação do clúster de origem e que nenhum outro dado esteja sendo armazenado nele.

Todas as tabelas `NDB` que estão sendo replicadas devem ser criadas usando um servidor e cliente MySQL. As tabelas e outros objetos do banco de dados criados usando a API NDB (com, por exemplo, `Dictionary::createTable()`) não são visíveis para um servidor MySQL e, portanto, não são replicadas. As atualizações feitas por aplicativos da API NDB em tabelas existentes que foram criadas usando um servidor MySQL podem ser replicadas.

Nota

É possível replicar um NDB Cluster usando replicação baseada em declarações. No entanto, neste caso, as seguintes restrições se aplicam:

* Todas as atualizações das linhas de dados no clúster que atuam como fonte devem ser direcionadas a um único servidor MySQL.

* Não é possível replicar um clúster usando vários processos de replicação MySQL simultâneos.

* Apenas as alterações feitas no nível SQL são replicadas.

Essas são, além das outras limitações da replicação baseada em declarações em oposição à replicação baseada em linhas; consulte [Seção 19.2.1.1, “Vantagens e desvantagens da replicação baseada em declarações e baseada em linhas”][(replication-sbr-rbr.html "19.2.1.1 Advantages and Disadvantages of Statement-Based and Row-Based Replication")], para informações mais específicas sobre as diferenças entre os dois formatos de replicação.

### 25.7.3 Problemas conhecidos na replicação do NDB Cluster

Esta seção discute problemas ou questões conhecidas ao usar replicação com NDB Cluster.

**Perda de conexão entre a fonte e a réplica.**

Uma perda de conexão pode ocorrer entre o nó SQL do cluster de origem e o nó SQL do cluster de replica, ou entre o nó SQL da fonte e os nós de dados do cluster de origem. Neste último caso, isso pode ocorrer não apenas como resultado da perda de conexão física (por exemplo, um cabo de rede quebrado), mas devido ao excesso de buffers de eventos dos nós de dados; se o nó SQL for lento demais para responder, ele pode ser descartado pelo cluster (isso pode ser controlado em certa medida ajustando os parâmetros de configuração `MaxBufferedEpochs` e `TimeBetweenEpochs`). Se isso ocorrer, *é totalmente possível que novos dados sejam inseridos no cluster de origem sem serem registrados no log binário do nó SQL da fonte*. Por essa razão, para garantir alta disponibilidade, é extremamente importante manter um canal de replicação de backup, monitorar o canal primário e realizar a transição para o canal de replicação secundário quando necessário para manter o cluster de replica sincronizado com a fonte. O NDB Cluster não é projetado para realizar tal monitoramento por si só; para isso, é necessária uma aplicação externa.

O nó SQL de origem emite um evento de "lacuna" ao se conectar ou reconectar ao clúster de origem. (Um evento de lacuna é um tipo de "evento de incidente", que indica um incidente que ocorre e que afeta o conteúdo do banco de dados, mas que não pode ser facilmente representado como um conjunto de alterações. Exemplos de incidentes são falhas no servidor, ressocialização do banco de dados, algumas atualizações de software e algumas alterações de hardware.) Quando a replica encontra uma lacuna no log de replicação, ela para com uma mensagem de erro. Esta mensagem está disponível na saída de `SHOW REPLICA STATUS` (antes do NDB 8.0.22, use `SHOW SLAVE STATUS`), e indica que o thread SQL parou devido a um incidente registrado na corrente de replicação, e que uma intervenção manual é necessária. Consulte a Seção 25.7.8, “Implementando Failover com Replicação de NDB Cluster”, para obter mais informações sobre o que fazer nessas circunstâncias.

Importante

Como o NDB Cluster não é projetado para monitorar o status da replicação ou fornecer falha de replicação por si só, se a alta disponibilidade é uma exigência para o servidor ou cluster de replicação, você deve configurar várias linhas de replicação, monitorar o **mysqld** da linha de replicação primária e estar preparado para fazer a transição para uma linha secundária, se e quando necessário. Isso deve ser feito manualmente, ou possivelmente por meio de uma aplicação de terceiros. Para obter informações sobre a implementação desse tipo de configuração, consulte a Seção 25.7.7, “Usando Dois Canais de Replicação para a Replicação do NDB Cluster”, e a Seção 25.7.8, “Implementando Falha de Replicação com a Replicação do NDB Cluster”.

Se você estiver replicando de um servidor MySQL autônomo para um NDB Cluster, um canal geralmente é suficiente.

**Replicação circular.**

A Replicação em Arranjo NDB suporta replicação circular, conforme demonstrado no próximo exemplo. A configuração de replicação envolve três Arranjos NDB numerados 1, 2 e 3, nos quais o Arranjo 1 atua como fonte de replicação para o Arranjo 2, o Arranjo 2 atua como fonte para o Arranjo 3 e o Arranjo 3 atua como fonte para o Arranjo 1, completando assim o círculo. Cada Arranjo NDB tem dois nós SQL, com os nós SQL A e B pertencentes ao Arranjo 1, os nós SQL C e D pertencentes ao Arranjo 2 e os nós SQL E e F pertencentes ao Arranjo 3.

A replicação circular usando esses clusters é suportada desde que as seguintes condições sejam atendidas:

* Os nós SQL em todos os clusters de origem e replicação são os mesmos. * Todos os nós SQL que atuam como fontes e réplicas são iniciados com a variável do sistema `log_replica_updates` (NDB 8.0.26 e posterior) ou `log_slave_updates` (anterior ao NDB 8.0.26) habilitada.

Esse tipo de configuração de replicação circular é mostrado no diagrama a seguir:

**Figura 25.11 Replicação Circular de Cluster NDB com Todas as Fontes como Replicas**

![Some content is described in the surrounding text. The diagram shows three clusters, each with two nodes. Arrows connecting SQL nodes in different clusters illustrate that all sources are also replicas.](images/cluster-circular-replication-1.png)

Nesse cenário, o nó SQL A do Cluster 1 replica para o nó SQL C do Cluster 2; o nó SQL C replica para o nó SQL E do Cluster 3; o nó SQL E replica para o nó SQL A. Em outras palavras, a linha de replicação (indicada pelas setas curvas no diagrama) conecta diretamente todos os nós SQL usados como fontes e réplicas.

Também deve ser possível configurar a replicação circular, na qual nem todos os nós SQL de origem são também réplicas, como mostrado aqui:

**Figura 25.12 Replicação Circular de Aglomerado NDB Onde Nem Todas as Fontes São Replicas**

![Some content is described in the surrounding text. The diagram shows three clusters, each with two nodes. Arrows connecting SQL nodes in different clusters illustrate that not all sources are replicas.](images/cluster-circular-replication-2.png)

Neste caso, diferentes nós SQL em cada clúster são usados como fontes e réplicas. No entanto, você não deve *não* iniciar nenhum dos nós SQL com a variável de sistema `log_replica_updates` ou `log_slave_updates` habilitada. Este tipo de esquema de replicação circular para o NDB Cluster, no qual a linha de replicação (novamente indicada pelas setas curvas no diagrama) é descontínua, deve ser possível, mas deve-se notar que ainda não foi completamente testado e, portanto, ainda deve ser considerado experimental.

Nota

O motor de armazenamento `NDB` utiliza o modo de execução idempotente, que suprime erros de chave duplicada e outros erros que, de outra forma, interrompem a replicação circular do NDB Cluster. Isso é equivalente a definir o valor global da variável do sistema `replica_exec_mode` ou `slave_exec_mode` para `IDEMPOTENT`, embora isso não seja necessário na replicação do NDB Cluster, uma vez que o NDB Cluster define essa variável automaticamente e ignora quaisquer tentativas de defini-la explicitamente.

**Replicação do cluster NDB e chaves primárias.**

Em caso de falha de um nó, podem ocorrer erros na replicação das tabelas `NDB` sem chaves primárias, devido à possibilidade de inserção de linhas duplicadas nesses casos. Por essa razão, é altamente recomendável que todas as tabelas `NDB` que estão sendo replicadas tenham chaves primárias explícitas.

**Reprodução em cluster do NDB e chaves únicas.**

Em versões mais antigas do NDB Cluster, as operações que atualizaram os valores das colunas de chave única das tabelas `NDB` poderiam resultar em erros de chave duplicada durante a replicação. Esse problema é resolvido para a replicação entre as tabelas `NDB`, diferindo os verificações de chave única até que todas as atualizações das linhas da tabela tenham sido realizadas.

A adiamento de restrições dessa forma é atualmente suportado apenas por `NDB`. Assim, as atualizações de chaves únicas ao replicar de `NDB` para um motor de armazenamento diferente, como `InnoDB` ou `MyISAM`, ainda não são suportadas.

O problema encontrado ao replicar sem verificação diferida de atualizações de chave única pode ser ilustrado usando a tabela `NDB` como `t`, que é criada e preenchida na fonte (e transmitida para uma réplica que não suporta atualizações de chave única diferidas) como mostrado aqui:

```
CREATE TABLE t (
    p INT PRIMARY KEY,
    c INT,
    UNIQUE KEY u (c)
)   ENGINE NDB;

INSERT INTO t
    VALUES (1,1), (2,2), (3,3), (4,4), (5,5);
```

A seguinte declaração `UPDATE` sobre `t` é válida na fonte, uma vez que as linhas afetadas são processadas na ordem determinada pela opção `ORDER BY`, realizada sobre toda a tabela:

```
UPDATE t SET c = c - 1 ORDER BY p;
```

A mesma declaração falha com um erro de chave duplicada ou outra violação de restrição na replica, porque a ordenação das atualizações de linha é realizada para uma partição de cada vez, em vez de para a tabela como um todo.

Nota

Cada tabela `NDB` é implicitamente dividida por chave quando é criada. Consulte a Seção 26.2.5, “Divisão por chave”, para obter mais informações.

**GTIDs não são suportados.** A replicação usando IDs de transação global não é compatível com o mecanismo de armazenamento `NDB`, e não é suportada. A ativação de GTIDs provavelmente fará com que a Replicação do NDB Cluster falhe.

**Replicação multithread.** Anteriormente, o NDB Cluster não suportava replicações multithread. Essa restrição foi removida no NDB 8.0.33.

Para habilitar o multithreading na replica no NDB 8.0.33 e versões posteriores, é necessário realizar os seguintes passos:

1. Defina `--ndb-log-transaction-dependency` para `ON` ao iniciar a fonte **mysqld**.

2. Também no **mysqld** de origem, defina `binlog_transaction_dependency_tracking` como `WRITESET`. Isso pode ser feito enquanto o processo **mysqld** está em execução.

3. Para garantir que a replica utilize múltiplos threads de trabalho, defina o valor de `replica_parallel_workers` maior que 1. O padrão é 4, e pode ser alterado na replica enquanto ela está em execução.

Antes da NDB 8.0.26, definir quaisquer variáveis de sistema relacionadas a réplicas multithread, como `replica_parallel_workers` ou `slave_parallel_workers`, e `replica_checkpoint_group` ou `slave_checkpoint_group` (ou as opções de inicialização equivalentes do **mysqld**) era completamente ignorado e não tinha efeito.

Nos NDB 8.0.27 a NDB 8.0.32, `replica_parallel_workers` deve ser definido como 0. Nestas versões, se este for definido com qualquer outro valor no início, `NDB` o altera para 0 e escreve uma mensagem no arquivo de log do servidor **mysqld**. Esta restrição também é levantada no NDB 8.0.33.

**Reiniciando com --initial.**

Reiniciar o clúster com a opção `--initial` faz com que a sequência dos números de GCI e de época comece novamente a partir de `0`. (Isso geralmente é verdadeiro para o NDB Cluster e não é limitado a cenários de replicação que envolvem o Cluster.) Os servidores MySQL envolvidos na replicação devem ser reiniciados neste caso. Após isso, você deve usar as declarações `RESET MASTER` e `RESET REPLICA` (antes do NDB 8.0.22, use `RESET SLAVE`) para limpar as tabelas inválidas `ndb_binlog_index` e `ndb_apply_status`, respectivamente.

**Replicação de uma tabela NDB para outros motores de armazenamento.** É possível replicar uma tabela `NDB` na fonte para uma tabela usando um motor de armazenamento diferente na replica, levando em consideração as restrições listadas aqui:

* A replicação circular e de múltiplas fontes não são suportadas (as tabelas tanto na fonte quanto na replica devem usar o mecanismo de armazenamento `NDB` para que isso funcione).

* O uso de um mecanismo de armazenamento que não realiza registro binário para tabelas na replica requer um tratamento especial.

* O uso de um motor de armazenamento não transacional para tabelas na replica também requer um tratamento especial.

* A fonte **mysqld** deve ser iniciada com `--ndb-log-update-as-write=0` ou `--ndb-log-update-as-write=OFF`.

Os próximos parágrafos fornecem informações adicionais sobre cada um dos problemas descritos acima.

**Múltiplas fontes não são suportadas ao replicar NDB para outros motores de armazenamento.** Para a replicação de `NDB` para um motor de armazenamento diferente, a relação entre as duas bases de dados deve ser de um para um. Isso significa que a replicação bidirecional ou circular não é suportada entre o NDB Cluster e outros motores de armazenamento.

Além disso, não é possível configurar mais de um canal de replicação ao replicar entre `NDB` e um motor de armazenamento diferente. (Um banco de dados de NDB Cluster *pode* replicar simultaneamente para múltiplos bancos de dados NDB Cluster.) Se a fonte usa tabelas `NDB`, ainda é possível ter mais de um servidor MySQL mantendo um log binário de todas as alterações, mas para a replica mudar de fonte (fail over), a nova relação fonte-replica deve ser definida explicitamente na replica.

**Replicando tabelas NDB para um mecanismo de armazenamento que não realiza registro binário.**

Se você tentar replicar de um NDB Cluster para uma replica que usa um mecanismo de armazenamento que não gerencia seu próprio registro binário, o processo de replicação será interrompido com o erro "Registro binário não possível... A declaração não pode ser escrita atomicamente, pois mais de um mecanismo está envolvido e pelo menos um mecanismo está fazendo autoregistro (Erro 1595). É possível contornar esse problema de uma das seguintes maneiras:

* **Desative o registro binário na replica.** Isso pode ser feito definindo `sql_log_bin = 0`.

* **Altere o mecanismo de armazenamento usado para a tabela mysql.ndb_apply_status.** Fazer com que essa tabela use um mecanismo que não gere seu próprio registro binário também pode eliminar o conflito. Isso pode ser feito emitindo uma declaração como `ALTER TABLE mysql.ndb_apply_status ENGINE=MyISAM` (alter-table.html "15.1.9 ALTER TABLE Statement") na replica. É seguro fazer isso ao usar um mecanismo de armazenamento diferente de `NDB` na replica, pois você não precisa se preocupar em manter várias réplicas sincronizadas.

* **Exclua as alterações na tabela mysql.ndb_apply_status na replica.** Isso pode ser feito iniciando a replica com `--replicate-ignore-table=mysql.ndb_apply_status`. Se você precisar que outras tabelas sejam ignoradas pela replicação, talvez queira usar uma opção apropriada `--replicate-wild-ignore-table` em vez disso.

Importante

Você *não* deve desabilitar a replicação ou o registro binário de `mysql.ndb_apply_status` ou alterar o mecanismo de armazenamento usado para esta tabela ao replicar de um NDB Cluster para outro. Consulte [Regras de filtragem de replicação e registro binário com replicação entre NDB Clusters](mysql-cluster-replication-issues.html#mysql-cluster-replication-issues-filtering "Replication and binary log filtering rules with replication between NDB Clusters"), para obter detalhes.

**Replicação de NDB para um motor de armazenamento não transacional.** Ao replicar de `NDB` para um motor de armazenamento não transacional, como `MyISAM`, você pode encontrar erros de chave duplicada desnecessários ao replicar declarações [`INSERT ... ON DUPLICATE KEY UPDATE`](insert-on-duplicate.html "15.2.7.2 INSERT ... ON DUPLICATE KEY UPDATE Statement"). Você pode suprimir esses erros usando `--ndb-log-update-as-write=0`, que força as atualizações a serem registradas como escritas, em vez de como atualizações.

**Replicação do NDB e criptografia do sistema de arquivos (TDE).** O uso de um sistema de arquivos criptografado não afeta a Replicação do NDB. Todos os seguintes cenários são suportados:

* Replicação de um NDB Cluster com um sistema de arquivos criptografado para um NDB Cluster cujo sistema de arquivos não é criptografado.

* Replicação de um NDB Cluster cujo sistema de arquivos não está criptografado para um NDB Cluster cujo sistema de arquivos está criptografado.

* Replicação de um NDB Cluster cujo sistema de arquivos é criptografado para um servidor MySQL autônomo usando tabelas `InnoDB` que não estão criptografadas.

* Replicação de um NDB Cluster com um sistema de arquivos não criptografado para um servidor MySQL autônomo usando tabelas `InnoDB` com criptografia de sistema de arquivos.

**Regras de filtragem de replicação e log binário com replicação entre NDB Clusters.** Se você estiver usando alguma das opções `--replicate-do-*`, `--replicate-ignore-*`, `--binlog-do-db` ou `--binlog-ignore-db` para filtrar bancos de dados ou tabelas que estão sendo replicados, você deve ter cuidado para não bloquear a replicação ou o registro binário do `mysql.ndb_apply_status`, que é necessário para que a replicação entre NDB Clusters funcione corretamente. Em particular, você deve ter em mente o seguinte:

1. Usar `--replicate-do-db=db_name` (e nenhuma outra opção `--replicate-do-*` ou `--replicate-ignore-*`) significa que *apenas* as tabelas no banco de dados *`db_name`* são replicadas. Neste caso, você também deve usar `--replicate-do-db=mysql`, `--binlog-do-db=mysql` ou `--replicate-do-table=mysql.ndb_apply_status` para garantir que `mysql.ndb_apply_status` seja preenchido nas réplicas.

Usar `--binlog-do-db=db_name` (e nenhuma outra opção de `--binlog-do-db`) significa que as alterações *apenas* nas tabelas do banco de dados *`db_name`* são escritas no log binário. Neste caso, você também deve usar `--replicate-do-db=mysql`, `--binlog-do-db=mysql` ou `--replicate-do-table=mysql.ndb_apply_status` para garantir que `mysql.ndb_apply_status` seja preenchido nas réplicas.

Usando `--replicate-ignore-db=mysql` significa que nenhuma tabela no banco de dados `mysql` é replicada. Nesse caso, você também deve usar `--replicate-do-table=mysql.ndb_apply_status` para garantir que `mysql.ndb_apply_status` seja replicada.

Usar `--binlog-ignore-db=mysql` significa que nenhuma alteração nas tabelas do banco de dados `mysql` é escrita no log binário. Nesse caso, você também deve usar `--replicate-do-table=mysql.ndb_apply_status` para garantir que `mysql.ndb_apply_status` seja replicado.

Você também deve lembrar que cada regra de replicação exige o seguinte:

1. A opção própria `--replicate-do-*` ou `--replicate-ignore-*`, e que múltiplas regras não podem ser expressas em uma única opção de filtragem de replicação. Para informações sobre essas regras, consulte a Seção 19.1.6, “Opções e variáveis de replicação e registro binário”.

2. A opção própria `--binlog-do-db` ou `--binlog-ignore-db`, e que múltiplas regras não podem ser expressas em uma única opção de filtragem de log binário. Para informações sobre essas regras, consulte a Seção 7.4.4, “O Log Binário”.

Se você estiver replicando um NDB Cluster para uma replica que usa um mecanismo de armazenamento diferente do `NDB`, as considerações mencionadas anteriormente podem não se aplicar, conforme discutido em outras partes desta seção.

**Replicação do NDB Cluster e IPv6.** A partir do NDB 8.0.22, todos os tipos de nós do NDB Cluster suportam IPv6; isso inclui nós de gerenciamento, nós de dados e nós de API ou SQL.

Antes da NDB 8.0.22, a API NDB e a API MGM (e, portanto, os nós de dados e os nós de gerenciamento) não suportam IPv6, embora os Servidores MySQL — incluindo aqueles que atuam como nós SQL em um NDB Cluster — possam usar IPv6 para se conectar a outros Servidores MySQL. Em versões do NDB Cluster anteriores à 8.0.22, você pode replicar entre clusters usando IPv6 para conectar os nós SQL que atuam como fonte e replica como mostrado pela seta pontilhada no diagrama a seguir:

**Figura 25.13 Replicação entre nós SQL conectados usando IPv6**

![Most content is described in the surrounding text. The dotted line representing a MySQL-to-MySQL IPv6 connection is between two nodes, one each from the source and replica clusters. All connections within the cluster, such as data node to data node or data node to management node, are connected with solid lines to indicate IPv4 connections only.](images/cluster-replication-ipv6.png)

Antes da NDB 8.0.22, todas as conexões que se originam *dentro* do NDB Cluster — representadas no diagrama anterior por setas sólidas — devem usar IPv4. Em outras palavras, todos os nós de dados do NDB Cluster, servidores de gerenciamento e clientes de gerenciamento devem ser acessíveis uns aos outros usando IPv4. Além disso, os nós SQL devem usar IPv4 para se comunicar com o cluster. Na NDB 8.0.22 e em versões posteriores, essas restrições não se aplicam mais; além disso, quaisquer aplicativos escritos usando as APIs NDB e MGM podem ser escritos e implantados assumindo um ambiente apenas com IPv6.

Nota

Nas versões 8.0.22 a 8.0.33, inclusive, o `NDB` exigia suporte do sistema para IPv6 para funcionar, independentemente de o clúster realmente usar endereços IPv6 ou não. No NDB Cluster 8.0.34 e versões posteriores, isso não é mais um problema, e você pode desabilitar o IPv6 no kernel Linux se o endereçamento IPv6 não estiver sendo usado pelo clúster.

**Atribuição de promoção e demissão de atributos.** A Replicação do NDB Cluster inclui suporte para promoção e demissão de atributos. A implementação da última distingue entre conversões de tipos com perda e sem perda, e seu uso na replica pode ser controlado definindo o valor global da variável do sistema `replica_type_conversions` (NDB 8.0.26 e posterior) ou `slave_type_conversions` (anterior ao NDB 8.0.26).

Para mais informações sobre promoção e demissão de atributos no NDB Cluster, consulte Replicação baseada em linha: promoção e demissão de atributos.

`NDB`, ao contrário de `InnoDB` ou `MyISAM`, não escreve alterações em colunas virtuais no log binário; no entanto, isso não tem efeitos prejudiciais na Replicação do NDB Cluster ou na replicação entre `NDB` e outros motores de armazenamento. Alterações em colunas geradas armazenadas são registradas.

### 25.7.4 Esquema e tabelas de replicação de cluster do NDB

* tabela ndb_apply_status
* tabela ndb_binlog_index
* tabela ndb_replication

A replicação no NDB Cluster utiliza uma série de tabelas dedicadas no banco de dados `mysql` em cada instância do servidor MySQL que atua como um nó SQL tanto no cluster que está sendo replicado quanto na replica. Isso é verdade, independentemente de a replica ser um único servidor ou um cluster.

As tabelas `ndb_binlog_index` e `ndb_apply_status` são criadas no banco de dados `mysql`. Elas não devem ser explicitamente replicadas pelo usuário. A intervenção do usuário normalmente não é necessária para criar ou manter nenhuma dessas tabelas, uma vez que ambas são mantidas pelo fio de injeção de log binário (binlog) do `NDB`. Isso mantém o processo **mysqld** fonte atualizado com as alterações realizadas pelo motor de armazenamento `NDB`. O fio de injeção binlog `NDB` recebe eventos diretamente do motor de armazenamento `NDB`. O injetor `NDB` é responsável por capturar todos os eventos de dados dentro do clúster e garante que todos os eventos que alteram, inserem ou excluem dados sejam registrados na tabela `ndb_binlog_index`. O fio de I/O (receptor) de replicação transfere os eventos do log binário da fonte para o log de relevo da replica.

A tabela `ndb_replication` deve ser criada manualmente. Essa tabela pode ser atualizada pelo usuário para realizar filtragem por banco de dados ou tabela. Consulte a tabela ndb_replication para obter mais informações. `ndb_replication` também é usado na detecção e resolução de conflitos de replicação NDB para controle de resolução de conflitos; consulte Controle de Resolução de Conflitos.

Embora `ndb_binlog_index` e `ndb_apply_status` sejam criados e mantidos automaticamente, é aconselhável verificar a existência e a integridade dessas tabelas como um passo inicial na preparação de um NDB Cluster para replicação. É possível visualizar os dados de evento registrados no log binário consultando a tabela `mysql.ndb_binlog_index` diretamente na fonte. Isso também pode ser realizado usando a declaração `SHOW BINLOG EVENTS` em qualquer um dos nós SQL da fonte ou da replica. (Veja a Seção 15.7.7.2, “Declaração SHOW BINLOG EVENTS”).

Você também pode obter informações úteis a partir da saída de `SHOW ENGINE NDB STATUS`(show-engine.html "15.7.7.15 SHOW ENGINE Statement").

Nota

Ao realizar alterações de esquema nas tabelas `NDB`, as aplicações devem esperar até que a instrução `ALTER TABLE` tenha sido devolvida na conexão do cliente MySQL que emitiu a instrução antes de tentar usar a definição atualizada da tabela.

#### Tabela ndb_apply_status

`ndb_apply_status` é usado para manter um registro das operações que foram replicadas da fonte para a replica. Se a tabela `ndb_apply_status` não existir na replica, o **ndb_restore** a recria.

Ao contrário do caso do `ndb_binlog_index`, os dados neste quadro não são específicos para nenhum dos nós SQL do clúster (replica), e, portanto, o `ndb_apply_status` pode usar o mecanismo de armazenamento `NDBCLUSTER`, conforme mostrado aqui:

```
CREATE TABLE `ndb_apply_status` (
    `server_id`   INT(10) UNSIGNED NOT NULL,
    `epoch`       BIGINT(20) UNSIGNED NOT NULL,
    `log_name`    VARCHAR(255) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,
    `start_pos`   BIGINT(20) UNSIGNED NOT NULL,
    `end_pos`     BIGINT(20) UNSIGNED NOT NULL,
    PRIMARY KEY (`server_id`) USING HASH
) ENGINE=NDBCLUSTER DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

A tabela `ndb_apply_status` é preenchida apenas em réplicas, o que significa que, na fonte, essa tabela nunca contém nenhuma linha; portanto, não é necessário alocar nenhum `DataMemory` para `ndb_apply_status` lá.

Como esta tabela é preenchida com dados originários da fonte, deve ser permitido que ela se replique; quaisquer regras de filtragem de replicação ou de filtragem de registro binário que, inadvertidamente, impeçam a atualização do `ndb_apply_status` da replica, ou que impeçam a fonte de escrever no registro binário, podem impedir que a replicação entre clusters opere corretamente. Para mais informações sobre problemas potenciais decorrentes dessas regras de filtragem, consulte [Regra de filtragem de replicação e registro binário com replicação entre NDB Clusters](mysql-cluster-replication-issues.html#mysql-cluster-replication-issues-filtering "Replication and binary log filtering rules with replication between NDB Clusters").

É possível excluir essa tabela, mas isso não é recomendado. Excluí-la coloca todos os nós SQL em modo de leitura somente; no NDB 8.0.24 e versões posteriores, `NDB` detecta que essa tabela foi excluída e a recria, após o que é possível realizar atualizações novamente. A exclusão e a recriação de `ndb_apply_status` cria um evento de lacuna no log binário; o evento de lacuna faz com que os nós SQL replicados parem de aplicar as alterações da fonte até que o canal de replicação seja reiniciado. Antes do NDB 8.0.24, era necessário, nesses casos, reiniciar todos os nós SQL para tirá-los do modo de leitura somente, e depois recriar manualmente `ndb_apply_status`.

`0` na coluna `epoch` desta tabela indica uma transação originada de um mecanismo de armazenamento diferente de `NDB`.

`ndb_apply_status` é usado para registrar quais transações foram replicadas e aplicadas a um clúster replica de uma fonte upstream. Essas informações são capturadas em um backup online `NDB`, mas (por design) não são restauradas pelo **ndb_restore**. Em alguns casos, pode ser útil restaurar essas informações para uso em novas configurações; a partir do NDB 8.0.29, você pode fazer isso invocando o **ndb_restore** com a opção `--with-apply-status`. Veja a descrição da opção para mais informações.

Tabela ndb_binlog_index

A Replicação em NDB Cluster usa a tabela `ndb_binlog_index` para armazenar os dados de indexação do log binário. Como essa tabela é local para cada servidor MySQL e não participa do clúster, ela usa o mecanismo de armazenamento `InnoDB`. Isso significa que ela deve ser criada separadamente em cada **mysqld** que participa do clúster de origem. (O próprio log binário contém atualizações de todos os servidores MySQL no clúster.) Essa tabela é definida da seguinte forma:

```
CREATE TABLE `ndb_binlog_index` (
    `Position` BIGINT(20) UNSIGNED NOT NULL,
    `File` VARCHAR(255) NOT NULL,
    `epoch` BIGINT(20) UNSIGNED NOT NULL,
    `inserts` INT(10) UNSIGNED NOT NULL,
    `updates` INT(10) UNSIGNED NOT NULL,
    `deletes` INT(10) UNSIGNED NOT NULL,
    `schemaops` INT(10) UNSIGNED NOT NULL,
    `orig_server_id` INT(10) UNSIGNED NOT NULL,
    `orig_epoch` BIGINT(20) UNSIGNED NOT NULL,
    `gci` INT(10) UNSIGNED NOT NULL,
    `next_position` bigint(20) unsigned NOT NULL,
    `next_file` varchar(255) NOT NULL,
    PRIMARY KEY (`epoch`,`orig_server_id`,`orig_epoch`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

Nota

Se você está atualizando a partir de uma versão mais antiga (anterior ao NDB 7.5.2), realize o procedimento de atualização do MySQL e garanta que as tabelas do sistema sejam atualizadas, iniciando o servidor MySQL com a opção `--upgrade=FORCE`. O upgrade da tabela do sistema faz com que a instrução `ALTER TABLE ... ENGINE=INNODB` seja executada para essa tabela. O uso do mecanismo de armazenamento `MyISAM` para essa tabela continua sendo suportado para compatibilidade reversa.

`ndb_binlog_index` pode exigir espaço adicional no disco após ser convertido para `InnoDB`. Se isso se tornar um problema, você poderá conservar espaço usando um espaço de tabelas `InnoDB` para essa tabela, alterando seu `ROW_FORMAT` para `COMPRESSED`, ou ambos. Para mais informações, consulte a Seção 15.1.21, “Declaração CREATE TABLESPACE”, e a Seção 15.1.20, “Declaração CREATE TABLE”, além da Seção 17.6.3, “Tabelas”.

O tamanho da tabela `ndb_binlog_index` depende do número de épocas por arquivo de registro binário e do número de arquivos de registro binário. O número de épocas por arquivo de registro binário normalmente depende da quantidade de registro binário gerado por época e do tamanho do arquivo de registro binário, com épocas menores resultando em mais épocas por arquivo. Você deve estar ciente de que épocas vazias produzem inserções na tabela `ndb_binlog_index`, mesmo quando a opção `OFF` é `--ndb-log-empty-epochs=ON`, o que significa que o número de entradas por arquivo depende do tempo que o arquivo está em uso; essa relação pode ser representada pela fórmula mostrada aqui:

```
[number of epochs per file] = [time spent per file] / TimeBetweenEpochs
```

Um NDB Cluster ocupado escreve no log binário regularmente e, presumivelmente, rola os arquivos de log binário mais rapidamente do que um tranquilo. Isso significa que um NDB Cluster “tranquilo” com `--ndb-log-empty-epochs=ON` pode, na verdade, ter um número muito maior de `ndb_binlog_index` de linhas por arquivo do que um com muita atividade.

Quando o **mysqld** é iniciado com a opção `--ndb-log-orig`, as colunas `orig_server_id` e `orig_epoch` armazenam, respectivamente, o ID do servidor em que o evento se originou e a época em que o evento ocorreu no servidor de origem, o que é útil em configurações de replicação do NDB Cluster que empregam múltiplas fontes. A declaração `SELECT` usada para encontrar a posição mais próxima do log binário à época mais aplicada na replica em uma configuração de múltiplas fontes (ver Seção 25.7.10, “Replicação do NDB Cluster: Replicação Bidirecional e Circular”) emprega essas duas colunas, que não são indexadas. Isso pode levar a problemas de desempenho ao tentar realizar uma falha, pois a consulta deve realizar uma varredura na tabela, especialmente quando a fonte tem sido executada com `--ndb-log-empty-epochs=ON`. Você pode melhorar os tempos de falha de múltiplas fontes adicionando um índice a essas colunas, como mostrado aqui:

```
ALTER TABLE mysql.ndb_binlog_index
    ADD INDEX orig_lookup USING BTREE (orig_server_id, orig_epoch);
```

A adição deste índice não oferece nenhum benefício ao replicar de uma única fonte para uma única réplica, uma vez que a consulta usada para obter a posição do log binário, nesses casos, não faz uso de `orig_server_id` ou `orig_epoch`.

Consulte a Seção 25.7.8, “Implementando Failover com Replicação do NDB Cluster”, para obter mais informações sobre o uso das colunas `next_position` e `next_file`.

A figura a seguir mostra a relação entre o servidor de origem de replicação do NDB Cluster, seu fio de injetor de log binário e a tabela `mysql.ndb_binlog_index`.

**Figura 25.14. O clúster de fonte de replicação**

![Most concepts are described in the surrounding text. This complex image has three main areas. The top left area is divided into three sections: MySQL Server (mysqld), NDBCLUSTER table handler, and mutex. A connection thread connects these, and receiver and injector threads connect the NDBCLUSTER table handler and mutex. The bottom area shows four data nodes (ndbd). They all produce events represented by arrows pointing to the receiver thread, and the receiver thread also points to the connection and injector threads. One node sends and receives to the mutex area. The arrow representing the injector thread points to a binary log as well as the ndb_binlog_index table, which is described in the surrounding text.](images/cluster-replication-binlog-injector.png)

#### Tabela ndb_replication

A tabela `ndb_replication` é usada para controlar o registro binário e a resolução de conflitos, e atua em uma base por tabela. Cada linha desta tabela corresponde a uma tabela que está sendo replicada, determina como registrar as alterações na tabela e, se uma função de resolução de conflitos é especificada, e determina como resolver conflitos para essa tabela.

Ao contrário das tabelas `ndb_apply_status` e `ndb_replication`, a tabela `ndb_replication` deve ser criada manualmente, usando a declaração SQL mostrada aqui:

```
CREATE TABLE mysql.ndb_replication  (
    db VARBINARY(63),
    table_name VARBINARY(63),
    server_id INT UNSIGNED,
    binlog_type INT UNSIGNED,
    conflict_fn VARBINARY(128),
    PRIMARY KEY USING HASH (db, table_name, server_id)
)   ENGINE=NDB
PARTITION BY KEY(db,table_name);
```

As colunas desta tabela estão listadas aqui, com descrições:

* coluna `db`

O nome do banco de dados que contém a tabela a ser replicada.

Você pode usar um ou ambos os caracteres curinga `_` e `%` como parte do nome do banco de dados. (Veja Ajuste com caracteres curinga, mais adiante nesta seção.)

* coluna `table_name`

O nome da tabela a ser replicada.

O nome da tabela pode incluir um ou ambos os caracteres especiais `_` e `%`. Veja Ajuste com caracteres especiais, mais adiante nesta seção.

* coluna `server_id`

O ID único do servidor da instância do MySQL (nó SQL) onde a tabela reside.

`0` nesta coluna age como um equivalente de comodinho, equivalente a `%`, e corresponde a qualquer ID do servidor. (Veja Correspondência com comodinhos, mais adiante nesta seção.)

* coluna `binlog_type`

O tipo de registro binário a ser empregado. Veja o texto para valores e descrições.

* coluna `conflict_fn`

A função de resolução de conflitos a ser aplicada; uma das NDB$OLD()"), NDB$MAX()"), NDB$MAX_DELETE_WIN()"), NDB$EPOCH()"), NDB$EPOCH_TRANS()"), NDB$EPOCH2()"), NDB$EPOCH2_TRANS()"). `NULL` indica que a resolução de conflitos não é usada para esta tabela. O NDB 8.0.30 e versões posteriores suportam duas funções adicionais de resolução de conflitos NDB$MAX_INS()") e NDB$MAX_DEL_WIN_INS()").

Veja Funções de Resolução de Conflitos, para mais informações sobre essas funções e seus usos na resolução de conflitos da replicação NDB.

Algumas funções de resolução de conflitos (`NDB$OLD()`, `NDB$EPOCH()`, `NDB$EPOCH_TRANS()`) exigem o uso de uma ou mais tabelas de exceções criadas pelo usuário. Veja a Tabela de Exceções de Resolução de Conflitos.

Para habilitar a resolução de conflitos com a Replicação NDB, é necessário criar e preencher esta tabela com informações de controle no(s) nó(s) SQL em que o conflito deve ser resolvido. Dependendo do tipo e do método de resolução de conflitos a serem empregados, este pode ser a fonte, a replica ou ambos os servidores. Em uma configuração simples de fonte-replica, onde os dados também podem ser alterados localmente na replica, este é normalmente a replica. Em um esquema de replicação mais complexo, como a replicação bidirecional, este geralmente é todas as fontes envolvidas. Consulte a Seção 25.7.12, “Resolução de Conflitos de Replicação de NDB Cluster”, para obter mais informações.

A tabela `ndb_replication` permite o controle de nível de tabela sobre o registro binário fora do escopo da resolução de conflitos, nesse caso, `conflict_fn` é especificado como `NULL`, enquanto os valores restantes das colunas são usados para controlar o registro binário para uma determinada tabela ou conjunto de tabelas que correspondem a uma expressão de wildcard. Ao definir o valor apropriado para a coluna `binlog_type`, você pode fazer com que o registro para uma determinada tabela ou tabelas use um formato de log binário desejado, ou desativar o registro binário por completo. Os valores possíveis para esta coluna, com valores e descrições, são mostrados na tabela a seguir:

**Tabela 25.70 valores de binlog_type, com valores e descrições**

<table><col width="10%"/><col width="55%"/><thead><tr> <th scope="col">Value</th> <th scope="col">Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Use o padrão do servidor</td> </tr><tr> <td>1</td> <td>Não registre esta tabela no log binário (mesmo efeito que<code>sql_log_bin = 0</code>, mas se aplica a uma ou mais tabelas especificadas apenas)</td> </tr><tr> <td>2</td> <td>Atualize os atributos apenas quando necessário; registre-os como<code>WRITE_ROW</code>eventos</td> </tr><tr> <td>3</td> <td>Registre a linha completa, mesmo que não seja atualizada (comportamento padrão do servidor MySQL)</td> </tr><tr> <td>6</td> <td>Utilize atributos atualizados, mesmo que os valores não tenham mudado</td> </tr><tr> <td>7</td> <td>Registre a linha completa, mesmo que nenhum valor seja alterado; registre as atualizações como<code>UPDATE_ROW</code>eventos</td> </tr><tr> <td>8</td> <td>Atualize o log<code>UPDATE_ROW</code>; registre apenas as colunas da chave primária na imagem anterior e apenas as colunas atualizadas na imagem posterior (o mesmo efeito que<code>--ndb-log-update-minimal</code>, mas se aplica a uma ou mais tabelas especificadas apenas)</td> </tr><tr> <td>9</td> <td>Atualize o log<code>UPDATE_ROW</code>; registre apenas as colunas da chave primária na imagem anterior e todas as colunas, exceto as colunas da chave primária, na imagem posterior</td> </tr></tbody></table>

Nota

Os valores `binlog_type` 4 e 5 não são utilizados e, portanto, são omitidos da tabela mostrada anteriormente, bem como da próxima tabela.

Vários valores de `binlog_type` são equivalentes a várias combinações das opções de registro do **mysqld** `--ndb-log-updated-only`, `--ndb-log-update-as-write` e `--ndb-log-update-minimal`, conforme mostrado na tabela a seguir:

**Tabela 25.71 valores de binlog_type com combinações equivalentes de opções de registro NDB**

<table><col width="10%"/><col width="30%"/><col width="30%"/><col width="30%"/><thead><tr> <th scope="col">Value</th> <th scope="col"><code>--ndb-log-updated-only</code> Value</th> <th scope="col"><code>--ndb-log-update-as-write</code> Value</th> <th scope="col"><code>--ndb-log-update-minimal</code> Value</th> </tr></thead><tbody><tr> <th scope="row">0</th> <td>--</td> <td>--</td> <td>--</td> </tr><tr> <th scope="row">1</th> <td>--</td> <td>--</td> <td>--</td> </tr><tr> <th scope="row">2</th> <td>ON</td> <td>ON</td> <td>OFF</td> </tr><tr> <th scope="row">3</th> <td>OFF</td> <td>ON</td> <td>OFF</td> </tr><tr> <th scope="row">6</th> <td>ON</td> <td>OFF</td> <td>OFF</td> </tr><tr> <th scope="row">7</th> <td>OFF</td> <td>OFF</td> <td>OFF</td> </tr><tr> <th scope="row">8</th> <td>ON</td> <td>OFF</td> <td>ON</td> </tr><tr> <th scope="row">9</th> <td>OFF</td> <td>OFF</td> <td>ON</td> </tr></tbody></table>

O registro binário pode ser configurado em diferentes formatos para diferentes tabelas, inserindo linhas na tabela `ndb_replication` usando os valores apropriados das colunas `db`, `table_name` e `binlog_type`. O valor inteiro interno mostrado na tabela anterior deve ser usado ao configurar o formato de registro binário. As duas seguintes declarações configuram o registro binário para registro de linhas completas (valor 3) para a tabela `test.a`, e para registro de atualizações apenas (valor 2) para a tabela `test.b`:

```
# Table test.a: Log full rows
INSERT INTO mysql.ndb_replication VALUES("test", "a", 0, 3, NULL);

# Table test.b: log updates only
INSERT INTO mysql.ndb_replication VALUES("test", "b", 0, 2, NULL);
```

Para desativar o registro para uma ou mais tabelas, use 1 para `binlog_type`, conforme mostrado aqui:

```
# Disable binary logging for table test.t1
INSERT INTO mysql.ndb_replication VALUES("test", "t1", 0, 1, NULL);

# Disable binary logging for any table in 'test' whose name begins with 't'
INSERT INTO mysql.ndb_replication VALUES("test", "t%", 0, 1, NULL);
```

Desabilitar o registro para uma tabela específica é equivalente a definir `sql_log_bin = 0`, exceto que isso se aplica a uma ou mais tabelas individualmente. Se um nó SQL não estiver realizando o registro binário para uma tabela específica, não serão enviados os eventos de alteração de linha para essas tabelas. Isso significa que ele não está recebendo todas as alterações e descartando algumas, mas sim não está se subscrendo a essas alterações.

Desabilitar o registro pode ser útil por várias razões, incluindo as listadas aqui:

* Não enviar alterações pela rede geralmente economiza largura de banda, buffer e recursos de CPU.

* Não registrar alterações em tabelas com atualizações muito frequentes, mas cujo valor não é grande, é adequado para dados transitórios (como dados de sessão) que podem ser relativamente irrelevantes em caso de falha completa do clúster.

* Usando uma variável de sessão (ou `sql_log_bin`) e código de aplicação, também é possível (ou não) registrar certas declarações SQL ou tipos de declarações SQL; por exemplo, pode ser desejável, em alguns casos, não registrar declarações DDL em uma ou mais tabelas.

* A divisão dos fluxos de replicação em dois (ou mais) logs binários pode ser feita por razões de desempenho, necessidade de replicar diferentes bancos de dados para diferentes locais, uso de diferentes tipos de registro binário para diferentes bancos de dados, e assim por diante.

**Compatibilidade com caracteres curinga.** Para não ser necessário inserir uma linha na tabela `ndb_replication` para cada combinação de banco de dados, tabela e nó SQL no seu conjunto de replicação, o `NDB` suporta a compatibilidade com caracteres curinga na coluna `db`, `table_name` e `server_id` desta tabela. Os nomes de banco de dados e tabela utilizados, respectivamente, em `db` e `table_name` podem conter um ou ambos dos seguintes caracteres curinga:

* `_` (caractere sublinhado): corresponde a zero ou mais caracteres

* `%` (símbolo de porcentagem): corresponde a um único caractere

(Estes são os mesmos caracteres curinga suportados pelo operador `LIKE` do MySQL.)

A coluna `server_id` suporta `0` como um equivalente wildcard para `_` (encaixa qualquer coisa). Isso é usado nos exemplos mostrados anteriormente.

Uma linha específica da tabela `ndb_replication` pode usar caracteres curinga para corresponder a qualquer um dos nomes do banco de dados, nomes de tabela e ID do servidor em qualquer combinação. Quando houver várias combinações potenciais na tabela, a melhor combinação é escolhida, de acordo com a tabela mostrada aqui, onde *W* representa uma correspondência com caracteres curinga, *E* uma correspondência exata e quanto maior o valor na coluna *Qualidade*, melhor a correspondência:

**Tabela 25.72 Pesos de diferentes combinações de correspondências com asterisco e correspondências exatas em colunas na tabela mysql.ndb_replication**

<table><col style="width: 25%"/><col style="width: 25%"/><col style="width: 25%"/><col style="width: 25%"/><thead><tr> <th scope="col"><code>db</code></th> <th scope="col"><code>table_name</code></th> <th scope="col"><code>server_id</code></th> <th scope="col">Quality</th> </tr></thead><tbody><tr> <th scope="row">W</th> <td>W</td> <td>W</td> <td>1</td> </tr><tr> <th scope="row">W</th> <td>W</td> <td>E</td> <td>2</td> </tr><tr> <th scope="row">W</th> <td>E</td> <td>W</td> <td>3</td> </tr><tr> <th scope="row">W</th> <td>E</td> <td>E</td> <td>4</td> </tr><tr> <th scope="row">E</th> <td>W</td> <td>W</td> <td>5</td> </tr><tr> <th scope="row">E</th> <td>W</td> <td>E</td> <td>6</td> </tr><tr> <th scope="row">E</th> <td>E</td> <td>W</td> <td>7</td> </tr><tr> <th scope="row">E</th> <td>E</td> <td>E</td> <td>8</td> </tr></tbody></table>

Assim, uma correspondência exata no nome do banco de dados, no nome da tabela e no ID do servidor é considerada a melhor (mais forte), enquanto a correspondência mais fraca (pior) é uma correspondência com um caractere curinga em todas as três colunas. Apenas a força da correspondência é considerada ao escolher qual regra aplicar; a ordem em que as linhas ocorrem na tabela não tem efeito nessa determinação.

**Registro de linhas completas ou parciais.**

Existem dois métodos básicos de registro de linhas, conforme determinado pela configuração da opção `--ndb-log-updated-only` para o **mysqld**:

* Registre linhas completas (opção definida como `ON`)
* Registre apenas os dados da coluna que foram atualizados, ou seja, os dados da coluna cujos valores foram definidos, independentemente de o valor ter sido alterado ou não. Esse é o comportamento padrão (opção definida como `OFF`).

Geralmente é suficiente — e mais eficiente — registrar apenas as colunas atualizadas; no entanto, se você precisar registrar linhas completas, pode fazê-lo definindo `--ndb-log-updated-only` para `0` ou `OFF`.

**Registro de dados alterados como atualizações.**

A definição da opção `--ndb-log-update-as-write` do MySQL Server determina se o registro é realizado com ou sem a imagem “antes”.

Como a resolução de conflitos para operações de atualização e exclusão é realizada no manipulador de atualização do MySQL Server, é necessário controlar o registro realizado pela fonte de replicação de modo que as atualizações sejam atualizações e não escritas; ou seja, de modo que as atualizações sejam tratadas como alterações em linhas existentes, em vez da escrita de novas linhas, mesmo que estas substituam as linhas existentes.

Essa opção está ativada por padrão; em outras palavras, as atualizações são tratadas como escritas. Isso significa que, por padrão, as atualizações são escritas como eventos `write_row` no log binário, em vez de como eventos `update_row`.

Para desabilitar a opção, inicie a fonte **mysqld** com `--ndb-log-update-as-write=0` ou `--ndb-log-update-as-write=OFF`. Você deve fazer isso ao replicar de tabelas NDB para tabelas que utilizam um motor de armazenamento diferente; consulte Replicação de NDB para outros motores de armazenamento e Replicação de NDB para um motor de armazenamento não transacional, para obter mais informações.

Importante

(*NDB 8.0.30 e versões posteriores*:) Para a resolução de conflitos de inserção usando `NDB$MAX_INS()` ou `NDB$MAX_DEL_WIN_INS()`, um nó SQL (ou seja, um processo **mysqld**) pode registrar atualizações de linha no cluster de origem como eventos `WRITE_ROW` com a opção `--ndb-log-update-as-write` habilitada para idempotência e tamanho ótimo. Isso funciona para esses algoritmos, pois ambos mapeiam um evento `WRITE_ROW` para uma inserção ou atualização, dependendo se a linha já existe, e os metadados necessários (a imagem “after” para a coluna de data e hora) estão presentes no evento “WRITE_ROW”.

### 25.7.5 Preparando o NDB Cluster para Replicação

Preparar o NDB Cluster para replicação consiste nos seguintes passos:

1. Verifique todas as versões dos servidores MySQL para compatibilidade de versão (consulte a Seção 25.7.2, “Requisitos gerais para replicação do NDB Cluster”).

2. Crie uma conta de replicação no Cluster de origem com os privilégios apropriados, usando as seguintes duas instruções SQL:

   ```
   mysqlS> CREATE USER 'replica_user'@'replica_host'
        -> IDENTIFIED BY 'replica_password';

   mysqlS> GRANT REPLICATION SLAVE ON *.*
        -> TO 'replica_user'@'replica_host';
   ```

Na declaração anterior, *`replica_user`* é o nome do usuário da conta de replicação, *`replica_host`* é o nome do host ou endereço IP da replica, e *`replica_password`* é a senha a ser atribuída a esta conta.

Por exemplo, para criar uma conta de usuário replica com o nome `myreplica`, faça login no host denominado `replica-host` e use a senha `53cr37`, use as seguintes declarações `CREATE USER` e `GRANT`:

   ```
   mysqlS> CREATE USER 'myreplica'@'replica-host'
        -> IDENTIFIED BY '53cr37';

   mysqlS> GRANT REPLICATION SLAVE ON *.*
        -> TO 'myreplica'@'replica-host';
   ```

Por razões de segurança, é preferível usar uma conta de usuário única, que não seja empregada para qualquer outro propósito, para a conta de replicação.

3. Configure a replica para usar a fonte. Usando o cliente **mysql**, isso pode ser feito com a declaração `CHANGE REPLICATION SOURCE TO` (change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") (começando com NDB 8.0.23) ou a declaração `CHANGE MASTER TO` (anterior a NDB 8.0.23):

   ```
   mysqlR> CHANGE MASTER TO
        -> MASTER_HOST='source_host',
        -> MASTER_PORT=source_port,
        -> MASTER_USER='replica_user',
        -> MASTER_PASSWORD='replica_password';
   ```

A partir do NDB 8.0.23, você também pode usar a seguinte declaração:

   ```
   mysqlR> CHANGE REPLICATION SOURCE TO
        -> SOURCE_HOST='source_host',
        -> SOURCE_PORT=source_port,
        -> SOURCE_USER='replica_user',
        -> SOURCE_PASSWORD='replica_password';
   ```

Na declaração anterior, *`source_host`* é o nome do host ou endereço IP da fonte de replicação, *`source_port`* é a porta que a replica deve usar ao se conectar à fonte, *`replica_user`* é o nome de usuário configurado para a replica na fonte e *`replica_password`* é a senha configurada para essa conta de usuário no passo anterior.

Por exemplo, para dizer à replica que use o servidor MySQL cujo nome de host é `rep-source` com a conta de replicação criada no passo anterior, use a seguinte declaração:

   ```
   mysqlR> CHANGE MASTER TO
        -> MASTER_HOST='rep-source',
        -> MASTER_PORT=3306,
        -> MASTER_USER='myreplica',
        -> MASTER_PASSWORD='53cr37';
   ```

A partir do NDB 8.0.23, você também pode usar a seguinte declaração:

   ```
   mysqlR> CHANGE REPLICATION SOURCE TO
        -> SOURCE_HOST='rep-source',
        -> SOURCE_PORT=3306,
        -> SOURCE_USER='myreplica',
        -> SOURCE_PASSWORD='53cr37';
   ```

Para uma lista completa das opções que podem ser usadas com esta declaração, consulte a Seção 15.4.2.1, “Declarar MASTER para”.

Para fornecer capacidade de backup de replicação, você também precisa adicionar uma opção `--ndb-connectstring` ao arquivo `my.cnf` da replica antes de iniciar o processo de replicação. Consulte a Seção 25.7.9, “Backup de NDB Cluster com Replicação de NDB Cluster”, para obter detalhes.

Para opções adicionais que podem ser definidas em `my.cnf` para réplicas, consulte a Seção 19.1.6, “Opções e variáveis de replicação e registro binário”.

4. Se o clúster de origem já estiver em uso, você pode criar um backup do clúster de origem e carregá-lo na replica para reduzir o tempo necessário para que a replica se sincronize com a fonte. Se a replica também estiver executando o NDB Cluster, isso pode ser feito usando o procedimento de backup e restauração descrito na Seção 25.7.9, "Backup do NDB Cluster com Replicação do NDB Cluster".

   ```
   ndb-connectstring=management_host[:port]
   ```

Caso você não esteja usando o NDB Cluster na replica, você pode criar um backup com este comando na fonte:

   ```
   shellS> mysqldump --master-data=1
   ```

Em seguida, importe o dump de dados resultante na replica, copiando o arquivo de dump para ela. Depois disso, você pode usar o cliente **mysql** para importar os dados do arquivo de dump para o banco de dados da replica, conforme mostrado aqui, onde *`dump_file`* é o nome do arquivo que foi gerado usando **mysqldump** na fonte, e *`db_name`* é o nome do banco de dados a ser replicado:

   ```
   shellR> mysql -u root -p db_name < dump_file
   ```

Para uma lista completa das opções que podem ser usadas com o **mysqldump**, consulte a Seção 6.5.4, “mysqldump — Um programa de backup de banco de dados”.

Nota

Se você copiar os dados para a replica dessa maneira, certifique-se de que a replica não tente se conectar à fonte para começar a replicar antes que todos os dados tenham sido carregados. Você pode fazer isso iniciando a replica com a opção `--skip-slave-start` na linha de comando, incluindo `skip-slave-start` no arquivo `my.cnf` da replica, ou começando com NDB 8.0.24, definindo a variável de sistema `skip_slave_start`. Começando com NDB 8.0.26, use `--skip-replica-start` ou `skip_replica_start` em vez disso. Uma vez que o carregamento dos dados tenha sido concluído, siga as etapas adicionais descritas nas próximas duas seções.

5. Certifique-se de que cada servidor MySQL que atua como fonte de replicação seja atribuído um ID de servidor único e que tenha o registro binário habilitado, usando o formato baseado em linha. (Veja a Seção 19.2.1, “Formatos de Replicação”.) Além disso, recomendamos fortemente habilitar a variável de sistema `replica_allow_batching` (NDB 8.0.26 e posterior; antes do NDB 8.0.26, use `slave_allow_batching`). A partir do NDB 8.0.30, isso é habilitado por padrão.

Se você estiver usando uma versão do NDB Cluster anterior à NDB 8.0.30, também deve considerar aumentar os valores usados com as opções `--ndb-batch-size` e `--ndb-blob-write-batch-bytes`. Em NDB 8.0.30 e versões posteriores, use `--ndb-replica-batch-size` para definir o tamanho do lote usado para gravações na replica em vez de `--ndb-batch-size`, e `--ndb-replica-blob-write-batch-bytes` em vez de `--ndb-blob-write-batch-bytes` para determinar o tamanho do lote usado pelo aplicativo de replicação para gravação de dados blob. Todas essas opções podem ser definidas no arquivo `my.cnf` do servidor de origem, ou na linha de comando ao iniciar o processo **mysqld** da origem. Consulte a Seção 25.7.6, “Começando a Replicação do NDB Cluster (Canal de Replicação Único)”), para obter mais informações.

### 25.7.6 Início da replicação do cluster NDB (canal de replicação único)

Esta seção descreve o procedimento para iniciar a replicação do NDB Cluster usando um único canal de replicação.

1. Inicie o servidor de origem de replicação do MySQL, emitindo este comando, onde *`id`* é o ID único deste servidor (consulte a Seção 25.7.2, “Requisitos gerais para replicação do NDB Cluster”):

   ```
   shellS> mysqld --ndbcluster --server-id=id \
           --log-bin --ndb-log-bin &
   ```

Isso inicia o processo do servidor **mysqld** com registro binário habilitado, usando o formato de registro apropriado. Também é necessário no NDB 8.0 habilitar o registro de atualizações nas tabelas `NDB` explicitamente, usando a opção `--ndb-log-bin`; essa é uma mudança em relação às versões anteriores do NDB Cluster, na qual essa opção era habilitada por padrão.

Nota

Você também pode iniciar a fonte com `--binlog-format=MIXED`, nesse caso, a replicação baseada em linha é usada automaticamente ao replicar entre clusters. O registro binário baseado em declaração não é suportado para a replicação de NDB Cluster (consulte a Seção 25.7.2, “Requisitos Gerais para a Replicação de NDB Cluster”).

2. Inicie o servidor de réplica do MySQL conforme mostrado aqui:

   ```
   shellR> mysqld --ndbcluster --server-id=id &
   ```

No comando mostrado acima, *`id`* é o ID único do servidor replica. Não é necessário habilitar o registro no replica.

Nota

A menos que você queira que a replicação comece imediatamente, adiar o início dos threads de replicação até que a declaração apropriada `START REPLICA` tenha sido emitida, conforme explicado no Passo 4 abaixo. Você pode fazer isso iniciando a replica com a opção `--skip-slave-start` na linha de comando, incluindo `skip-slave-start` no arquivo `my.cnf` da replica, ou em NDB 8.0.24 e posterior, definindo a variável de sistema `skip_slave_start`. Em NDB 8.0.26 e posterior, use `--skip-replica-start` e `skip_replica_start`.

3. É necessário sincronizar o servidor de replicação com o log binário de replicação do servidor de origem. Se o registro binário não estiver sendo executado anteriormente na origem, execute a seguinte declaração no replica:

   ```
   mysqlR> CHANGE MASTER TO
        -> MASTER_LOG_FILE='',
        -> MASTER_LOG_POS=4;
   ```

A partir do NDB 8.0.23, você também pode usar a seguinte declaração:

   ```
   mysqlR> CHANGE REPLICATION SOURCE TO
        -> SOURCE_LOG_FILE='',
        -> SOURCE_LOG_POS=4;
   ```

Isso instrui a réplica a começar a ler o log binário do servidor de origem a partir do ponto de início do log. Caso contrário — ou seja, se você estiver carregando dados da fonte usando um backup — consulte a Seção 25.7.8, “Implementando Failover com Replicação do NDB Cluster”, para obter informações sobre como obter os valores corretos para usar para `SOURCE_LOG_FILE` | `MASTER_LOG_FILE` e `SOURCE_LOG_POS` | `MASTER_LOG_POS` nesses casos.

4. Por fim, instrua a réplica a começar a aplicar a replicação, emitindo este comando a partir do cliente **mysql** na réplica:

   ```
   mysqlR> START SLAVE;
   ```

Em NDB 8.0.22 e versões posteriores, você também pode usar a seguinte declaração:

   ```
   mysqlR> START REPLICA;
   ```

Isso também inicia a transmissão de dados e alterações da fonte para a réplica.

É também possível usar dois canais de replicação, de uma maneira semelhante ao procedimento descrito na próxima seção; as diferenças entre isso e o uso de um único canal de replicação são abordadas na Seção 25.7.7, “Usando dois canais de replicação para replicação de NDB Cluster”.

É também possível melhorar o desempenho da replicação de clusters ao habilitar atualizações em lote. Isso pode ser feito definindo a variável de sistema `replica_allow_batching` (NDB 8.0.26 e versões posteriores) ou `slave_allow_batching` (antes da versão 8.0.26) nos processos **mysqld** das réplicas. Normalmente, as atualizações são aplicadas assim que são recebidas. No entanto, o uso de atualizações em lote faz com que as atualizações sejam aplicadas em lotes de 32 KB cada; isso pode resultar em maior desempenho e menor uso de CPU, especialmente quando as atualizações individuais são relativamente pequenas.

Nota

O agrupamento funciona em uma base por período; as atualizações que pertencem a mais de uma transação podem ser enviadas como parte do mesmo agrupamento.

Todas as atualizações pendentes são aplicadas quando o fim de uma época é alcançado, mesmo que as atualizações totalizem menos de 32 KB.

O agrupamento pode ser ativado e desativado em tempo de execução. Para ativá-lo em tempo de execução, você pode usar qualquer uma dessas duas declarações:

```
SET GLOBAL slave_allow_batching = 1;
SET GLOBAL slave_allow_batching = ON;
```

A partir da versão NDB 8.0.26, você pode (e deve) usar uma das seguintes declarações:

```
SET GLOBAL replica_allow_batching = 1;
SET GLOBAL replica_allow_batching = ON;
```

Se um lote específico causar problemas (como uma declaração cujos efeitos não parecem ser replicados corretamente), o agrupamento pode ser desativado usando uma das seguintes declarações:

```
SET GLOBAL slave_allow_batching = 0;
SET GLOBAL slave_allow_batching = OFF;
```

A partir da versão NDB 8.0.26, você pode (e deve) usar uma das seguintes declarações:

```
SET GLOBAL replica_allow_batching = 0;
SET GLOBAL replica_allow_batching = OFF;
```

Você pode verificar se o agrupamento está sendo usado atualmente por meio de uma declaração apropriada `SHOW VARIABLES`, como esta:

```
mysql> SHOW VARIABLES LIKE 'slave%';
```

Em ŃDB 8.0.26 e versões posteriores, use a seguinte declaração:

```
mysql> SHOW VARIABLES LIKE 'replica%';
```

### 25.7.7 Usando dois canais de replicação para replicação de cluster NDB

Em um cenário de exemplo mais completo, imaginamos dois canais de replicação para fornecer redundância e, assim, proteger contra possíveis falhas de um único canal de replicação. Isso requer um total de quatro servidores de replicação, dois servidores de origem no clúster de origem e dois servidores de replicação no clúster de replicação. Para os propósitos da discussão que segue, assumimos que identificadores únicos são atribuídos como mostrado aqui:

**Tabela 25.73 Servidores de replicação de cluster NDB descritos no texto**

<table><col style="width: 25%"/><col style="width: 75%"/><thead><tr> <th>Server ID</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>1</td> <td>Fonte - canal de replicação primário (S)</td> </tr><tr> <td>2</td> <td>Fonte - canal de replicação secundário (S')</td> </tr><tr> <td>3</td> <td>Replica - canal de replicação primário (R)</td> </tr><tr> <td>4</td> <td>replica - canal de replicação secundário (R')</td> </tr></tbody></table>

Configurar a replicação com dois canais não é radicalmente diferente de configurar um único canal de replicação. Primeiro, os processos do **mysqld** para os servidores de origem de replicação primária e secundária devem ser iniciados, seguidos pelos processos das réplicas primária e secundária. Os processos de replicação podem ser iniciados emitindo a declaração `START REPLICA` (start-replica.html "15.4.2.6 START REPLICA Statement") em cada uma das réplicas. Os comandos e a ordem em que eles precisam ser emitidos são mostrados aqui:

1. Inicie a fonte de replicação primária:

   ```
   shellS> mysqld --ndbcluster --server-id=1 \
                  --log-bin &
   ```

2. Inicie a fonte de replicação secundária:

   ```
   shellS'> mysqld --ndbcluster --server-id=2 \
                  --log-bin &
   ```

3. Inicie o servidor de replicação primária:

   ```
   shellR> mysqld --ndbcluster --server-id=3 \
                  --skip-slave-start &
   ```

4. Inicie o servidor de replicação secundário:

   ```
   shellR'> mysqld --ndbcluster --server-id=4 \
                   --skip-slave-start &
   ```

5. Por fim, inicie a replicação no canal primário executando a instrução `START REPLICA` no replica primário, conforme mostrado aqui:

   ```
   mysqlR> START SLAVE;
   ```

A partir do NDB 8.0.22, você também pode usar a seguinte declaração:

   ```
   mysqlR> START REPLICA;
   ```

Aviso

Neste ponto, apenas o canal primário deve ser iniciado. O canal de replicação secundário precisa ser iniciado apenas no caso de o canal de replicação primário falhar, conforme descrito na Seção 25.7.8, “Implementando failover com replicação de NDB Cluster”. Executar vários canais de replicação simultaneamente pode resultar na criação de registros duplicados indesejados nos replicantes.

Como mencionado anteriormente, não é necessário habilitar o registro binário nas réplicas.

### 25.7.8 Implementando Failover com Replicação do NDB Cluster

Caso o processo primário de replicação do grupo falhe, é possível alternar para o canal de replicação secundário. O procedimento a seguir descreve os passos necessários para realizar isso.

1. Obtenha o horário do ponto de verificação global mais recente (GCP). Ou seja, você precisa determinar a época mais recente da tabela `ndb_apply_status` no clúster de replicação, que pode ser encontrada usando a seguinte consulta:

   ```
   mysqlR'> SELECT @latest:=MAX(epoch)
         ->        FROM mysql.ndb_apply_status;
   ```

Em uma topologia de replicação circular, com uma fonte e uma réplica em cada host, quando você está usando `ndb_log_apply_status=1`, as épocas do NDB Cluster são escritas nos logs binários das réplicas. Isso significa que a tabela `ndb_apply_status` contém informações para a réplica neste host, bem como para qualquer outro host que atue como réplica do servidor de fonte de replicação que está em execução neste host.

Neste caso, você precisa determinar a última época nesta réplica, excluindo quaisquer épocas de quaisquer outras réplicas no log binário desta réplica que não foram listadas nas opções `IGNORE_SERVER_IDS` da declaração `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` usada para configurar esta réplica. A razão para excluir tais épocas é que as linhas na tabela `mysql.ndb_apply_status` cujos IDs de servidor têm uma correspondência na lista `IGNORE_SERVER_IDS` da declaração `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` usada para preparar a fonte desta réplica também são consideradas de servidores locais, além daqueles que têm o próprio ID de servidor da réplica. Você pode recuperar esta lista como `Replicate_Ignore_Server_Ids` da saída de `SHOW REPLICA STATUS`. Assumemos que você obteve esta lista e está substituindo-a por *`ignore_server_ids`* na consulta mostrada aqui, que, como a versão anterior da consulta, seleciona a maior época em uma variável chamada `@latest`:

   ```
   mysqlR'> SELECT @latest:=MAX(epoch)
         ->        FROM mysql.ndb_apply_status
         ->        WHERE server_id NOT IN (ignore_server_ids);
   ```

Em alguns casos, pode ser mais simples ou mais eficiente (ou ambos) usar uma lista dos IDs do servidor a serem incluídos e `server_id IN server_id_list` na condição `WHERE` da consulta anterior.

2. Usando as informações obtidas da consulta mostrada no Passo 1, obtenha os registros correspondentes da tabela `ndb_binlog_index` no clúster de origem.

Você pode usar a seguinte consulta para obter os registros necessários da tabela `ndb_binlog_index` na fonte:

   ```
   mysqlS'> SELECT
       ->     @file:=SUBSTRING_INDEX(next_file, '/', -1),
       ->     @pos:=next_position
       -> FROM mysql.ndb_binlog_index
       -> WHERE epoch = @latest;
   ```

Estes são os registros salvos na fonte desde o falecimento do canal de replicação primário. Nós empregamos uma variável de usuário `@latest` aqui para representar o valor obtido no Passo 1. Claro, não é possível que uma instância de **mysqld** acesse diretamente as variáveis de usuário definidas em outra instância do servidor. Esses valores devem ser "conectados" à segunda consulta manualmente ou por uma aplicação.

Importante

Você deve garantir que a replica **mysqld** seja iniciada com `--slave-skip-errors=ddl_exist_errors` antes de executar `START REPLICA`](start-replica.html "15.4.2.6 START REPLICA Statement"). Caso contrário, a replicação pode parar com erros de DDL duplicados.

3. Agora é possível sincronizar o canal secundário executando a seguinte consulta no servidor replica secundário:

   ```
   mysqlR'> CHANGE MASTER TO
         ->     MASTER_LOG_FILE='@file',
         ->     MASTER_LOG_POS=@pos;
   ```

No NDB 8.0.23 e versões posteriores, você também pode usar a declaração mostrada aqui:

   ```
   mysqlR'> CHANGE REPLICATION SOURCE TO
         ->     SOURCE_LOG_FILE='@file',
         ->     SOURCE_LOG_POS=@pos;
   ```

Novamente, empregamos variáveis de usuário (neste caso, `@file` e `@pos`) para representar os valores obtidos no Passo 2 e aplicados no Passo 3; na prática, esses valores devem ser inseridos manualmente ou usando uma aplicação que possa acessar ambos os servidores envolvidos.

Nota

`@file` é um valor de cadeia, como `'/var/log/mysql/replication-source-bin.00001'`, e, portanto, deve ser citado quando utilizado em código SQL ou de aplicação. No entanto, o valor representado por `@pos` *não* deve ser citado. Embora o MySQL normalmente tente converter strings em números, este caso é uma exceção.

4. Agora, você pode iniciar a replicação no canal secundário, emitindo o comando apropriado no replica **mysqld**:

   ```
   mysqlR'> START SLAVE;
   ```

Em NDB 8.0.22 ou posterior, você também pode usar a seguinte declaração:

   ```
   mysqlR'> START REPLICA;
   ```

Uma vez que o canal de replicação secundário esteja ativo, você pode investigar a falha do canal primário e efetuar as reparações necessárias. As ações precisas necessárias para fazer isso dependem das razões pelas quais o canal primário falhou.

Aviso

O canal de replicação secundário deve ser iniciado apenas se e quando o canal de replicação primário falhar. Executar vários canais de replicação simultaneamente pode resultar na criação de registros duplicados indesejados nos replicados.

Se a falha estiver limitada a um único servidor, teoricamente seria possível replicar de *`S`* para *`R'`*, ou de *`S'`* para *`R`*.

### 25.7.9 Backup de aglomerado NDB Com Replicação de Aglomerado NDB

Esta seção discute a realização de backups e a restauração a partir deles usando a replicação do NDB Cluster. Assume-se que os servidores de replicação já tenham sido configurados como mencionado anteriormente (consulte a Seção 25.7.5, “Preparando o NDB Cluster para Replicação”, e as seções imediatamente subsequentes). Após isso, o procedimento para realizar um backup e, em seguida, restaurá-lo a partir dele é o seguinte:

1. Existem dois métodos diferentes pelos quais o backup pode ser iniciado.

* **Método A.** Este método exige que o processo de backup do clúster tenha sido habilitado previamente no servidor de origem, antes de iniciar o processo de replicação. Isso pode ser feito incluindo a seguinte linha em uma seção `[mysql_cluster]` no `my.cnf file`, onde *`management_host`* é o endereço IP ou nome de host do servidor de gerenciamento do *`NDB`* para o clúster de origem, e *`port`* é o número da porta do servidor de gerenciamento:

     ```
     ndb-connectstring=management_host[:port]
     ```

Nota

O número do porto precisa ser especificado apenas se o porto padrão (1186) não estiver sendo usado. Consulte a Seção 25.3.3, “Configuração Inicial do NDB Cluster”, para obter mais informações sobre os portos e a alocação de portos no NDB Cluster.

Neste caso, o backup pode ser iniciado executando esta declaração na fonte de replicação:

     ```
     shellS> ndb_mgm -e "START BACKUP"
     ```

* **Método B.** Se o arquivo `my.cnf` não especificar onde encontrar o host de gerenciamento, você pode iniciar o processo de backup passando essas informações ao cliente de gerenciamento `NDB` como parte do comando `START BACKUP`(mysql-cluster-backup-using-management-client.html "25.6.8.2 Using The NDB Cluster Management Client to Create a Backup"). Isso pode ser feito conforme mostrado aqui, onde *`management_host`* e *`port`* são o nome do host e o número de porta do servidor de gerenciamento:

     ```
     shellS> ndb_mgm management_host:port -e "START BACKUP"
     ```

No nosso cenário, conforme descrito anteriormente (ver Seção 25.7.5, “Preparando o NDB Cluster para Replicação”), isso seria executado da seguinte forma:

     ```
     shellS> ndb_mgm rep-source:1186 -e "START BACKUP"
     ```

2. Copie os arquivos de backup do clúster para a replica que está sendo colocada em linha. Cada sistema que executa um processo **ndbd** para o clúster de origem tem arquivos de backup do clúster localizados nele, e *todos* desses arquivos devem ser copiados para a replica para garantir um restabelecimento bem-sucedido. Os arquivos de backup podem ser copiados em qualquer diretório do computador onde o host de gerenciamento da replica reside, desde que os binários MySQL e NDB tenham permissões de leitura nesse diretório. Neste caso, assumimos que esses arquivos tenham sido copiados para o diretório `/var/BACKUPS/BACKUP-1`.

Embora não seja necessário que o clúster de replicação tenha o mesmo número de nós de dados que o da fonte, é altamente recomendável que esse número seja o mesmo. É *necessário* que o processo de replicação não seja iniciado quando o servidor de replicação é iniciado. Você pode fazer isso iniciando a replicação com a opção `--skip-slave-start` na linha de comando, incluindo `skip-slave-start` no arquivo `my.cnf` da replica, ou no NDB 8.0.24 ou posterior, definindo a variável de sistema `skip_slave_start`.

3. Crie quaisquer bancos de dados no clúster de replicação que estejam presentes no clúster de origem e que devam ser replicados.

Importante

Uma declaração `CREATE DATABASE` (ou `CREATE SCHEMA` (create-database.html "15.1.12 CREATE DATABASE Statement")) correspondente a cada banco de dados a ser replicado deve ser executada em cada nó SQL no clúster de replicação.

4. Resete o cluster de replicação usando esta declaração no cliente **mysql**:

   ```
   mysqlR> RESET SLAVE;
   ```

Em NDB 8.0.22 ou posterior, você também pode usar esta declaração:

   ```
   mysqlR> RESET REPLICA;
   ```

5. Agora, você pode iniciar o processo de restauração do clúster na replica usando o comando **ndb_restore** para cada arquivo de backup, uma a uma. Para o primeiro deles, é necessário incluir a opção `-m` para restaurar os metadados do clúster, como mostrado aqui:

   ```
   shellR> ndb_restore -c replica_host:port -n node-id \
           -b backup-id -m -r dir
   ```

*`dir`* é o caminho para o diretório onde os arquivos de backup foram colocados na replica. Para os comandos **ndb_restore** correspondentes aos arquivos de backup restantes, a opção `-m` *não* deve ser usada.

Para restaurar a partir de um cluster de origem com quatro nós de dados (como mostrado na figura na Seção 25.7, “Replicação de Cluster NDB”), onde os arquivos de backup foram copiados para o diretório `/var/BACKUPS/BACKUP-1`, a sequência correta de comandos a serem executados na replica pode parecer assim:

   ```
   shellR> ndb_restore -c replica-host:1186 -n 2 -b 1 -m \
           -r ./var/BACKUPS/BACKUP-1
   shellR> ndb_restore -c replica-host:1186 -n 3 -b 1 \
           -r ./var/BACKUPS/BACKUP-1
   shellR> ndb_restore -c replica-host:1186 -n 4 -b 1 \
           -r ./var/BACKUPS/BACKUP-1
   shellR> ndb_restore -c replica-host:1186 -n 5 -b 1 -e \
           -r ./var/BACKUPS/BACKUP-1
   ```

Importante

A opção `-e` (ou `--restore-epoch`) na invocação final do **ndb_restore** neste exemplo é necessária para garantir que a época seja escrita na tabela `mysql.ndb_apply_status` da réplica. Sem essas informações, a réplica não pode se sincronizar corretamente com a fonte. (Veja a Seção 25.5.23, “ndb_restore — Restaurar um backup de um NDB Cluster”).

6. Agora, você precisa obter a época mais recente da tabela `ndb_apply_status` na replica (como discutido na Seção 25.7.8, “Implementando Failover com Replicação de NDB Cluster”):

   ```
   mysqlR> SELECT @latest:=MAX(epoch)
           FROM mysql.ndb_apply_status;
   ```

7. Usando `@latest` como o valor da época obtido no passo anterior, você pode obter a posição inicial correta `@pos` no arquivo de log binário correto `@file` a partir da tabela `mysql.ndb_binlog_index` na fonte. A consulta mostrada aqui obtém esses valores das colunas `Position` e `File` da última época aplicada antes da posição de restauração lógica:

   ```
   mysqlS> SELECT
        ->     @file:=SUBSTRING_INDEX(File, '/', -1),
        ->     @pos:=Position
        -> FROM mysql.ndb_binlog_index
        -> WHERE epoch > @latest
        -> ORDER BY epoch ASC LIMIT 1;
   ```

Caso atualmente não haja tráfego de replicação, você pode obter informações semelhantes executando `SHOW MASTER STATUS` na fonte e usando o valor mostrado na coluna `Position` do resultado do arquivo cujo nome tem o sufixo com o maior valor de todos os arquivos mostrados na coluna `File`. Nesse caso, você deve determinar qual é esse arquivo e fornecer o nome no próximo passo manualmente ou analisando o resultado com um script.

8. Usando os valores obtidos no passo anterior, você pode agora emitir o apropriado no cliente **mysql** da replica. No NDB 8.0.23 e versões posteriores, use a seguinte declaração `CHANGE REPLICATION SOURCE TO` (change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement"):

   ```
   mysqlR> CHANGE REPLICATION SOURCE TO
        ->     SOURCE_LOG_FILE='@file',
        ->     SOURCE_LOG_POS=@pos;
   ```

Antes da NDB 8.0.23, você deve usar a declaração `CHANGE MASTER TO` mostrada aqui:

   ```
   mysqlR> CHANGE MASTER TO
        ->     MASTER_LOG_FILE='@file',
        ->     MASTER_LOG_POS=@pos;
   ```

9. Agora que a replica sabe a partir de que ponto do arquivo de log binário começar a ler dados da fonte, você pode fazer com que a replica comece a replicar com essa declaração:

   ```
   mysqlR> START SLAVE;
   ```

A partir do NDB 8.0.22, você também pode usar a seguinte declaração:

   ```
   mysqlR> START REPLICA;
   ```

Para realizar uma cópia de segurança e restauração em um segundo canal de replicação, é necessário apenas repetir esses passos, substituindo os nomes de host e IDs da fonte secundária e replica pelos dos servidores de fonte primária e replica, conforme apropriado, e executando as declarações anteriores neles.

Para obter informações adicionais sobre a realização de backups de cluster e a restauração de um cluster a partir de backups, consulte a Seção 25.6.8, “Backup online do NDB Cluster”.

#### 25.7.9.1 Replicação de cluster NDB: Automatizando a sincronização da réplica com o log binário de origem

É possível automatizar grande parte do processo descrito na seção anterior (ver Seção 25.7.9, "Backup de NDB Cluster com Replicação de NDB Cluster"). O seguinte script Perl `reset-replica.pl` serve como exemplo de como você pode fazer isso.

```
#!/user/bin/perl -w

#  file: reset-replica.pl

#  Copyright (c) 2005, 2020, Oracle and/or its affiliates. All rights reserved.

#  This program is free software; you can redistribute it and/or modify
#  it under the terms of the GNU General Public License as published by
#  the Free Software Foundation; either version 2 of the License, or
#  (at your option) any later version.

#  This program is distributed in the hope that it will be useful,
#  but WITHOUT ANY WARRANTY; without even the implied warranty of
#  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#  GNU General Public License for more details.

#  You should have received a copy of the GNU General Public License
#  along with this program; if not, write to:
#  Free Software Foundation, Inc.
#  59 Temple Place, Suite 330
#  Boston, MA 02111-1307 USA
#
#  Version 1.1


######################## Includes ###############################

use DBI;

######################## Globals ################################

my  $m_host='';
my  $m_port='';
my  $m_user='';
my  $m_pass='';
my  $s_host='';
my  $s_port='';
my  $s_user='';
my  $s_pass='';
my  $dbhM='';
my  $dbhS='';

####################### Sub Prototypes ##########################

sub CollectCommandPromptInfo;
sub ConnectToDatabases;
sub DisconnectFromDatabases;
sub GetReplicaEpoch;
sub GetSourceInfo;
sub UpdateReplica;

######################## Program Main ###########################

CollectCommandPromptInfo;
ConnectToDatabases;
GetReplicaEpoch;
GetSourceInfo;
UpdateReplica;
DisconnectFromDatabases;

################## Collect Command Prompt Info ##################

sub CollectCommandPromptInfo
{
  ### Check that user has supplied correct number of command line args
  die "Usage:\n
       reset-replica >source MySQL host< >source MySQL port< \n
                   >source user< >source pass< >replica MySQL host< \n
                   >replica MySQL port< >replica user< >replica pass< \n
       All 8 arguments must be passed. Use BLANK for NULL passwords\n"
       unless @ARGV == 8;

  $m_host  =  $ARGV[0];
  $m_port  =  $ARGV[1];
  $m_user  =  $ARGV[2];
  $m_pass  =  $ARGV[3];
  $s_host  =  $ARGV[4];
  $s_port  =  $ARGV[5];
  $s_user  =  $ARGV[6];
  $s_pass  =  $ARGV[7];

  if ($m_pass eq "BLANK") { $m_pass = '';}
  if ($s_pass eq "BLANK") { $s_pass = '';}
}

###############  Make connections to both databases #############

sub ConnectToDatabases
{
  ### Connect to both source and replica cluster databases

  ### Connect to source
  $dbhM
    = DBI->connect(
    "dbi:mysql:database=mysql;host=$m_host;port=$m_port",
    "$m_user", "$m_pass")
      or die "Can't connect to source cluster MySQL process!
              Error: $DBI::errstr\n";

  ### Connect to replica
  $dbhS
    = DBI->connect(
          "dbi:mysql:database=mysql;host=$s_host",
          "$s_user", "$s_pass")
    or die "Can't connect to replica cluster MySQL process!
            Error: $DBI::errstr\n";
}

################  Disconnect from both databases ################

sub DisconnectFromDatabases
{
  ### Disconnect from source

  $dbhM->disconnect
  or warn " Disconnection failed: $DBI::errstr\n";

  ### Disconnect from replica

  $dbhS->disconnect
  or warn " Disconnection failed: $DBI::errstr\n";
}

######################  Find the last good GCI ##################

sub GetReplicaEpoch
{
  $sth = $dbhS->prepare("SELECT MAX(epoch)
                         FROM mysql.ndb_apply_status;")
      or die "Error while preparing to select epoch from replica: ",
             $dbhS->errstr;

  $sth->execute
      or die "Selecting epoch from replica error: ", $sth->errstr;

  $sth->bind_col (1, \$epoch);
  $sth->fetch;
  print "\tReplica epoch =  $epoch\n";
  $sth->finish;
}

#######  Find the position of the last GCI in the binary log ########

sub GetSourceInfo
{
  $sth = $dbhM->prepare("SELECT
                           SUBSTRING_INDEX(File, '/', -1), Position
                         FROM mysql.ndb_binlog_index
                         WHERE epoch > $epoch
                         ORDER BY epoch ASC LIMIT 1;")
      or die "Prepare to select from source error: ", $dbhM->errstr;

  $sth->execute
      or die "Selecting from source error: ", $sth->errstr;

  $sth->bind_col (1, \$binlog);
  $sth->bind_col (2, \$binpos);
  $sth->fetch;
  print "\tSource binary log file =  $binlog\n";
  print "\tSource binary log position =  $binpos\n";
  $sth->finish;
}

##########  Set the replica to process from that location #########

sub UpdateReplica
{
  $sth = $dbhS->prepare("CHANGE MASTER TO
                         MASTER_LOG_FILE='$binlog',
                         MASTER_LOG_POS=$binpos;")
      or die "Prepare to CHANGE MASTER error: ", $dbhS->errstr;

  $sth->execute
       or die "CHANGE MASTER on replica error: ", $sth->errstr;
  $sth->finish;
  print "\tReplica has been updated. You may now start the replica.\n";
}

# end reset-replica.pl
```

#### 25.7.9.2 Recuperação no Momento Atual Usando a Replicação do NDB Cluster

A recuperação em um ponto no tempo, ou seja, a recuperação de alterações de dados feitas desde um determinado ponto no tempo, é realizada após a restauração de um backup completo que retorna o servidor ao seu estado quando o backup foi feito. A realização da recuperação em um ponto no tempo de tabelas do NDB Cluster com o NDB Cluster e a Replicação do NDB Cluster pode ser realizada usando um backup de dados nativo `NDB` (tomado emitindo `CREATE BACKUP` (mysql-cluster-mgm-client-commands.html#ndbclient-create-nodegroup) no cliente **ndb_mgm**) e restaurando a tabela `ndb_binlog_index` (de um dump feito usando **mysqldump**).

Para realizar a recuperação em um ponto no tempo do NDB Cluster, é necessário seguir os passos mostrados aqui:

1. Faça backup de todos os bancos de dados `NDB` no clúster, usando o comando `START BACKUP` no cliente **ndb_mgm** (consulte Seção 25.6.8, “Backup Online do NDB Cluster”).

2. Em um momento posterior, antes de restaurar o grupo, faça um backup da tabela [[`mysql.ndb_binlog_index`]. É provavelmente mais simples usar o **mysqldump** para essa tarefa. Também faça um backup dos arquivos de log binário neste momento.

Esse backup deve ser atualizado regularmente — talvez até a cada hora — dependendo das suas necessidades.

3. (*Ocorre falha ou erro catastrófico.*) 4. Localize o último backup conhecido. 5. Limpe os sistemas de arquivos do nó de dados (usando **ndbd** `--initial` ou **ndbmtd**") `--initial`).

Nota

A partir do NDB 8.0.21, os espaços de dados de disco e os arquivos de registro são removidos pelo `--initial`. Anteriormente, era necessário excluí-los manualmente.

6. Use `DROP TABLE` ou `TRUNCATE TABLE` com a tabela `mysql.ndb_binlog_index`.

7. Execute **ndb_restore**, restaurando todos os dados. Você deve incluir a opção `--restore-epoch` ao executar **ndb_restore**, para que a tabela `ndb_apply_status` seja preenchida corretamente. (Consulte a Seção 25.5.23, “ndb_restore — Restaurar um backup de um NDB Cluster”, para obter mais informações.)

8. Restaure a tabela `ndb_binlog_index` a partir da saída do **mysqldump** e, se necessário, restaure os arquivos de log binário dos backups.

9. Encontre a época aplicada mais recentemente, ou seja, o valor máximo da coluna `epoch` na tabela `ndb_apply_status`, como variável de usuário `@LATEST_EPOCH` (destacada):

   ```
   SELECT @LATEST_EPOCH:=MAX(epoch)
       FROM mysql.ndb_apply_status;
   ```

10. Encontre o arquivo de registro binário mais recente (`@FIRST_FILE`) e a posição (valor da coluna `Position`) neste arquivo que correspondam a `@LATEST_EPOCH` na tabela `ndb_binlog_index`:

    ```
    SELECT Position, @FIRST_FILE:=File
        FROM mysql.ndb_binlog_index
        WHERE epoch > @LATEST_EPOCH ORDER BY epoch ASC LIMIT 1;
    ```

11. Usando o **mysqlbinlog**, repita os eventos do log binário do arquivo fornecido e posicione até o ponto do falha. (Veja a Seção 6.6.9, “mysqlbinlog — Utilitário para Processamento de Arquivos de Log Binário”.)

Veja também a Seção 9.5, “Recuperação Ponto em Tempo (Incremental) de Recuperação”), para mais informações sobre o log binário, replicação e recuperação incremental.

### 25.7.10 Replicação de aglomerado do NDB: Replicação bidirecional e circular

É possível usar o NDB Cluster para replicação bidirecional entre dois clusters, bem como para replicação circular entre qualquer número de clusters.

**Exemplo de replicação circular.** Nos próximos parágrafos, consideramos o exemplo de uma configuração de replicação que envolve três NDB Clusters numerados 1, 2 e 3, na qual o Cluster 1 atua como fonte de replicação para o Cluster 2, o Cluster 2 atua como fonte para o Cluster 3 e o Cluster 3 atua como fonte para o Cluster 1. Cada cluster tem dois nós SQL, com os nós SQL A e B pertencentes ao Cluster 1, os nós SQL C e D pertencentes ao Cluster 2 e os nós SQL E e F pertencentes ao Cluster 3.

A replicação circular usando esses clusters é suportada desde que as seguintes condições sejam atendidas:

* Os nós SQL em todas as fontes e réplicas são os mesmos. * Todos os nós SQL que atuam como fontes e réplicas são iniciados com a variável do sistema `log_replica_updates` (começando com NDB 8.0.26) ou `log_slave_updates` (NDB 8.0.26 e anteriores) habilitada.

Esse tipo de configuração de replicação circular é mostrado no diagrama a seguir:

**Figura 25.15 Replicação Circular de Aglomerado NDB com Todas as Fontes como Replicas**

![Some content is described in the surrounding text. The diagram shows three clusters, each with two nodes. Arrows connecting SQL nodes in different clusters illustrate that all sources are also replicas.](images/cluster-circular-replication-1.png)

Nesse cenário, o nó SQL A do Cluster 1 replica para o nó SQL C do Cluster 2; o nó SQL C replica para o nó SQL E do Cluster 3; o nó SQL E replica para o nó SQL A. Em outras palavras, a linha de replicação (indicada pelas setas curvas no diagrama) conecta diretamente todos os nós SQL usados como fontes e réplicas de replicação.

Também é possível configurar a replicação circular de forma que nem todos os nós SQL de origem sejam também réplicas, como mostrado aqui:

**Figura 25.16 Replicação Circular de Aglomerado NDB Onde Nem Todas as Fontes São Replicas**

![Some content is described in the surrounding text. The diagram shows three clusters, each with two nodes. Arrows connecting SQL nodes in different clusters illustrate that not all sources are replicas.](images/cluster-circular-replication-2.png)

Neste caso, diferentes nós SQL em cada clúster são usados como fontes e réplicas de replicação. Você não deve *emitir* nenhum dos nós SQL com a variável de sistema `log_replica_updates` (NDB 8.0.26 e posterior) ou `log_slave_updates` (anterior ao NDB 8.0.26) habilitada. Este tipo de esquema de replicação circular para o NDB Cluster, no qual a linha de replicação (novamente indicada pelas setas curvas no diagrama) é descontínua, deve ser possível, mas deve-se notar que ainda não foi testada completamente e, portanto, ainda deve ser considerada experimental.

**Usando backup e restauração nativa do NDB para inicializar um cluster de replica.**

Ao configurar a replicação circular, é possível inicializar o clúster de replicação usando o comando do cliente de gerenciamento `START BACKUP` em um NDB Cluster para criar um backup e, em seguida, aplicar esse backup em outro NDB Cluster usando **ndb_restore**. Isso não cria automaticamente logs binários no nó SQL do segundo NDB Cluster que atua como replica; para fazer com que os logs binários sejam criados, você deve emitir uma declaração `SHOW TABLES` nesse nó SQL; isso deve ser feito antes de executar `START REPLICA`. Esse é um problema conhecido.

**Exemplo de falha em múltiplos recursos.** Nesta seção, discutimos a falha em múltiplos recursos em um cenário de configuração de replicação de NDB Cluster de múltiplos recursos, com três NDB Clusters que possuem IDs de servidor 1, 2 e 3. Neste cenário, o Cluster 1 replica para os Clusters 2 e 3; o Cluster 2 também replica para o Cluster 3. Esta relação é mostrada aqui:

**Figura 25.17 Replicação Multi-Mestre de Cluster NDB com 3 Fontes**

![Multi-source NDB Cluster replication setup with three NDB Clusters having server IDs 1, 2, and 3; Cluster 1 replicates to Clusters 2 and 3; Cluster 2 also replicates to Cluster 3.](images/cluster-replication-multi-source.png)

Em outras palavras, os dados são replicados do Cluster 1 para o Cluster 3 por meio de 2 rotas diferentes: diretamente e por meio do Cluster 2.

Nem todos os servidores MySQL que participam da replicação de várias fontes devem atuar como fonte e réplica, e um determinado NDB Cluster pode usar diferentes nós SQL para diferentes canais de replicação. Um caso como esse é mostrado aqui:

**Figura 25.18 Replicação de múltiplas fontes de cluster NDB, com servidores MySQL**

![Concepts are described in the surrounding text. Shows three nodes: SQL node A in Cluster 1 replicates to SQL node F in Cluster 3; SQL node B in Cluster 1 replicates to SQL node C in Cluster 2; SQL node E in Cluster 3 replicates to SQL node G in Cluster 3. SQL nodes A and B in cluster 1 have --log-slave-updates=0; SQL nodes C in Cluster 2, and SQL nodes F and G in Cluster 3 have --log-slave-updates=1; and SQL nodes D and E in Cluster 2 have --log-slave-updates=0.](images/cluster-replication-multi-source-mysqlds.png)

Os servidores MySQL que atuam como réplicas devem ser executados com a variável de sistema `log_replica_updates` (começando com NDB 8.0.26) ou `log_slave_updates` (NDB 8.0.26 e versões anteriores) habilitada. Os processos do **mysqld** que exigem essa opção também são mostrados no diagrama anterior.

Nota

O uso da variável de sistema `log_replica_updates` ou `log_slave_updates` não afeta os servidores que não são executados como réplicas.

A necessidade de falha ocorre quando um dos clústeres replicados fica indisponível. Neste exemplo, consideramos o caso em que o Clúster 1 é perdido, e assim o Clúster 3 perde 2 fontes de atualizações do Clúster 1. Como a replicação entre os Clústeres NDB é assíncrona, não há garantia de que as atualizações do Clúster 3 que se originam diretamente do Clúster 1 sejam mais recentes do que as recebidas através do Clúster 2. Você pode lidar com isso garantindo que o Clúster 3 ative o acompanhamento do Clúster 2 em relação às atualizações do Clúster 1. Em termos de servidores MySQL, isso significa que você precisa replicar quaisquer atualizações pendentes do servidor MySQL C para o servidor F.

No servidor C, realize as seguintes consultas:

```
mysqlC> SELECT @latest:=MAX(epoch)
     ->     FROM mysql.ndb_apply_status
     ->     WHERE server_id=1;

mysqlC> SELECT
     ->     @file:=SUBSTRING_INDEX(File, '/', -1),
     ->     @pos:=Position
     ->     FROM mysql.ndb_binlog_index
     ->     WHERE orig_epoch >= @latest
     ->     AND orig_server_id = 1
     ->     ORDER BY epoch ASC LIMIT 1;
```

Nota

Você pode melhorar o desempenho dessa consulta e, assim, provavelmente acelerar os tempos de failover significativamente, adicionando o índice apropriado à tabela `ndb_binlog_index`. Consulte a Seção 25.7.4, “Esquema e tabelas de replicação de clúster NDB”, para obter mais informações.

Copie os valores para *`@file`* e *`@pos`* manualmente do servidor C para o servidor F (ou faça com que sua aplicação realize o equivalente). Em seguida, no servidor F, execute a seguinte declaração `CHANGE REPLICATION SOURCE TO` (change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") (NDB 8.0.23 e posterior) ou declaração `CHANGE MASTER TO` (anterior ao NDB 8.0.23):

```
mysqlF> CHANGE MASTER TO
     ->     MASTER_HOST = 'serverC'
     ->     MASTER_LOG_FILE='@file',
     ->     MASTER_LOG_POS=@pos;
```

A partir da versão NDB 8.0.23, você também pode usar a seguinte declaração:

```
mysqlF> CHANGE REPLICATION SOURCE TO
     ->     SOURCE_HOST = 'serverC'
     ->     SOURCE_LOG_FILE='@file',
     ->     SOURCE_LOG_POS=@pos;
```

Uma vez feito isso, você pode emitir uma declaração `START REPLICA` no servidor F do MySQL; isso faz com que quaisquer atualizações ausentes originadas do servidor B sejam replicadas para o servidor F.

A declaração `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` também suporta uma opção `IGNORE_SERVER_IDS` que recebe uma lista de IDs de servidor separados por vírgula e faz com que eventos originados dos servidores correspondentes sejam ignorados. Para mais informações, consulte a Seção 15.4.2.1, “Declaração CHANGE MASTER TO”, e a Seção 15.7.7.36, “Declaração SHOW SLAVE | REPLICA STATUS”. Para informações sobre como essa opção interage com a variável `ndb_log_apply_status`, consulte a Seção 25.7.8, “Implementação de Failover com Replicação NDB Cluster”.

### 25.7.11 Replicação do NDDB em aglomerado usando o Aplicativo Multithread

* Requisitos
* Configuração do MTA: Fonte
* Configuração do MTA: Replicação
* Dependência de transação e gerenciamento de conjunto de escritas
* Rastreamento de uso de memória do conjunto de escritas
* Limitações conhecidas

A partir do NDB 8.0.33, a replicação do NDB suporta o uso do mecanismo de Aplicativo Multithreaded do MySQL Server genérico (MTA), que permite que transações de log binário independentes sejam aplicadas em paralelo em uma replica, aumentando o desempenho máximo da replicação.

#### Requisitos

A implementação do MySQL Server MTA delega o processamento de transações binárias separadas a um conjunto de threads de trabalho (cujo tamanho é configurável) e coordena as threads de trabalho para garantir que as dependências de transação codificadas no log binário sejam respeitadas e que a ordem de compromisso seja mantida, se necessário (consulte a Seção 19.2.3, “Threads de Replicação”). Para usar essa funcionalidade com o NDB Cluster, é necessário que as seguintes três condições sejam atendidas:

1. *As dependências das transações de registro binário são determinadas na fonte*.

Para que isso seja verdade, a variável do sistema de servidor `binlog_transaction_dependency_tracking` deve ser definida como `WRITESET` na fonte. Isso é suportado pelo NDB 8.0.33 e versões posteriores. (O padrão é `COMMIT_ORDER`.

O trabalho de manutenção de writeset em `NDB` é realizado pelo thread do injetor de log binário MySQL como parte da preparação e do compromisso de cada transação de época no log binário. Isso requer recursos adicionais e pode reduzir o desempenho máximo.

2. *As dependências das transações são codificadas no log binário*.

O NDB 8.0.33 e versões posteriores suportam a opção de inicialização `--ndb-log-transaction-dependency` para o **mysqld**. Configure essa opção para `ON` para habilitar a gravação das dependências de transação `NDB` no log binário.

3. *A réplica é configurada para usar vários threads de trabalho*.

O NDB 8.0.33 e versões posteriores permitem definir `replica_parallel_workers` para valores não nulos para controlar o número de threads de trabalho na replica. O padrão é 4.

#### Configuração da MTA: Fonte

A configuração do **mysqld** para o MTA `NDB` deve incluir os seguintes ajustes explícitos:

* `binlog_transaction_dependency_tracking` deve ser definido como `WRITESET`.

* A fonte de replicação mysqld deve ser iniciada com `--ndb-log-transaction-dependency=ON`.

Se definido, `replica_parallel_type` deve ser `LOGICAL_CLOCK` (o valor padrão).

Nota

`NDB` não suporta `replica_parallel_type=DATABASE`.

Além disso, é recomendável que você defina a quantidade de memória usada para rastrear conjuntos de escrita de transações de log binário no fonte (`binlog_transaction_dependency_history_size`) para `E * P`, onde *`E`* é o tamanho médio da época (como o número de operações por época) e *`P`* é o paralelismo máximo esperado. Consulte Uso de Memória de Rastreamento de Conjuntos de Escrita, para obter mais informações.

#### Configuração da MTA: Replica

A configuração do **mysqld** para o MTA `NDB` exige que `replica_parallel_workers` seja maior que 1. O valor inicial recomendado ao primeiro uso do MTA é 4, que é o padrão.

Além disso, `replica_preserve_commit_order` deve ser `ON`. Esse também é o valor padrão.

#### Dependência de Transação e Gerenciamento de Conjunto de Escrita

As dependências de transação são detectadas através da análise do conjunto de escritas de cada transação, ou seja, o conjunto de linhas (tabela, valores de chave) escritas pela transação. Quando duas transações modificam a mesma linha, elas são consideradas dependentes e devem ser aplicadas em ordem (ou seja, sequencialmente) para evitar deadlocks ou resultados incorretos. Quando uma tabela tem chaves únicas secundárias, esses valores também são adicionados ao conjunto de escritas da transação para detectar o caso em que há dependências de transação implícitas por diferentes transações que afetam o mesmo valor de chave única, exigindo, assim, a ordenação. Quando as dependências não podem ser determinadas de forma eficiente, o **mysqld** recorre à consideração de transações como dependentes por razões de segurança.

As dependências das transações são codificadas no log binário pelo servidor **mysqld**. As dependências são codificadas em um evento `ANONYMOUS_GTID` usando um esquema chamado 'Relógio lógico'. (Veja a Seção 19.1.4.1, "Conceitos do Modo de Replicação".)

A implementação de conjunto de escrita empregada pelo MySQL (e pelo NDB Cluster) utiliza detecção de conflitos baseada em hash, com base na correspondência de hashes de linha de 64 bits de valores relevantes de tabela e índice. Isso detecta de forma confiável quando a mesma chave é vista duas vezes, mas também pode produzir falsos positivos se diferentes valores de tabela e índice hash para o mesmo valor de 64 bits; isso pode resultar em dependências artificiais que podem reduzir o paralelismo disponível.

As dependências de transação são forçadas por qualquer uma das seguintes razões:

* Declarações DDL
* Rotações de registro binário ou detecção de limites de arquivos de registro binário
* Tamanho do histórico do conjunto de escrita
* Escritas que fazem referência a chaves estrangeiras parentes na tabela de destino

Mais especificamente, as transações que realizam inserções, atualizações e exclusões em tabelas de chave estrangeira *parent* são serializadas em relação a todas as transações anteriores e seguintes, e não apenas às transações que afetam tabelas envolvidas em uma relação de restrição. Por outro lado, as transações que realizam inserções, atualizações e exclusões em tabelas de chave estrangeira *child* (referenciando) não são especialmente serializadas em relação umas às outras.

A implementação do MySQL MTA tenta aplicar transações de log binário independentes em paralelo. `NDB` registra todas as alterações que ocorrem em todas as transações de usuário que se comprometem em uma época (`TimeBetweenEpochs`, padrão 100 milissegundos), em uma única transação de log binário, referida como uma transação de época. Portanto, para que duas transações consecutivas de época sejam independentes e possíveis de serem aplicadas em paralelo, é necessário que nenhuma linha seja modificada em ambas as épocas. Se qualquer linha única for modificada em ambas as épocas, então elas são dependentes e são aplicadas seriamente, o que pode limitar o paralelismo explorável disponível.

As transações de época são consideradas independentes com base no conjunto de linhas modificadas no clúster de origem na época, mas sem incluir os eventos `mysql.ndb_apply_status` `WRITE_ROW` gerados que transmitem metadados da época. Isso evita que cada transação de época seja trivialmente dependente da época anterior, mas exige que o binlog seja aplicado na replica com a ordem de compromisso preservada. Isso também implica que um log binário NDB com dependências de writeset não é adequado para uso por um banco de dados replica com um motor de armazenamento MySQL diferente.

Pode ser possível ou desejável modificar o comportamento das transações de aplicação para evitar padrões de modificações repetidas nas mesmas linhas, em transações separadas ao longo de um curto período de tempo, a fim de aumentar o paralelismo explorável.

#### Rastreamento do uso da memória do Writeset

A quantidade de memória usada para rastrear conjuntos de transações de registro binário pode ser definida usando a variável de sistema do servidor `binlog_transaction_dependency_history_size`, que tem como padrão 25.000 hashes de linha.

Se uma transação binária média modificar *`N`* linhas, para poder identificar transações independentes (paralelizáveis) até um nível de paralelismo de *`P`*, precisamos que `binlog_transaction_dependency_history_size` esteja no mínimo `N * P`. (O máximo é 1.000.000.)

O tamanho finito da história resulta em um comprimento máximo de dependência finito que pode ser determinado de forma confiável, proporcionando um paralelismo finito que pode ser expresso. Qualquer linha não encontrada na história pode ser dependente da última transação excluída da história.

O histórico de escrita não age como uma janela deslizante sobre as últimas transações do *`N`*; em vez disso, é um buffer finito que pode ser preenchido completamente, e seus conteúdos são completamente descartados quando ele se torna cheio. Isso significa que o tamanho do histórico segue um padrão de serra ao longo do tempo, e, portanto, o comprimento máximo da dependência detectável também segue um padrão de serra ao longo do tempo, de modo que transações independentes ainda podem ser marcadas como dependentes se o buffer de histórico de escrita do conjunto de escrita tiver sido redefinido entre serem processadas.

Neste esquema, cada transação em um arquivo de registro binário é anotada com um `sequence_number` (1, 2, 3, etc.), bem como o número de sequência da transação de registro binário mais recente da qual depende, à qual nos referimos como `last_committed`.

Dentro de um arquivo de registro binário dado, a primeira transação tem `sequence_number` 1 e `last_committed` 0.

Se uma transação de registro binário depender de seu predecessor imediato, sua aplicação é serializada. Se a dependência for em uma transação anterior, pode ser possível aplicar a transação em paralelo com as transações independentes anteriores.

O conteúdo dos eventos de `ANONYMOUS_GTID`, incluindo `sequence_number` e `last_committed` (e, portanto, as dependências das transações), pode ser visto usando **mysqlbinlog**.

Os eventos `ANONYMOUS_GTID` gerados na fonte são tratados separadamente do payload de transação comprimida com eventos em massa `BEGIN`, `TABLE_MAP*`, `WRITE_ROW*`, `UPDATE_ROW*`, `DELETE_ROW*` e `COMMIT`, permitindo que as dependências sejam determinadas antes da descomprimagem. Isso significa que o fio do coordenador de replica pode delegar a descomprimagem do payload de transação a um fio de trabalho, fornecendo uma descomprimagem paralela automática de transações independentes na replica.

#### Limitações Conhecidas

**Colunas únicas secundárias.** As tabelas com colunas únicas secundárias (ou seja, chaves únicas que não são a chave primária) enviam todas as colunas para a fonte para que conflitos relacionados a chaves únicas possam ser detectados.

Se o modo atual de registro binário não incluir todas as colunas, mas apenas as colunas alteradas (`--ndb-log-updated-only=OFF`, `--ndb-log-update-minimal=ON`, `--ndb-log-update-as-write=OFF`), isso pode aumentar o volume de dados enviados dos nós de dados para os nós SQL.

O impacto depende tanto da taxa de modificação (atualização ou exclusão) de linhas nessas tabelas quanto do volume de dados em colunas que não são realmente modificadas.

**Replicação de NDB para InnoDB.** `NDB` O injetor de registro binário de dependência de transação ignora intencionalmente as dependências entre transações criadas por eventos de metadados gerados `mysql.ndb_apply_status`, que são tratados separadamente como parte do compromisso da transação da época no aplicativo replicador. Para a replicação em `InnoDB`, não há tratamento especial; isso pode resultar em desempenho reduzido ou outros problemas ao usar um aplicativo multithread `InnoDB` para consumir um registro binário de MTA `NDB`.

### 25.7.12 Resolução de conflitos de replicação de cluster do NDB

* Requisitos
* Controle de Coluna de Fonte
* Controle de Resolução de Conflitos
* Funções de Resolução de Conflitos
* Tabela de Exceções de Resolução de Conflitos
* Variáveis de Status de Detecção de Conflitos
* Exemplos

Ao usar uma configuração de replicação que envolve múltiplas fontes (incluindo replicação circular), é possível que diferentes fontes tentem atualizar a mesma linha na replica com dados diferentes. A resolução de conflitos na Replicação do NDB Cluster fornece um meio de resolver tais conflitos, permitindo que uma coluna de resolução definida pelo usuário seja usada para determinar se uma atualização em uma fonte específica deve ser aplicada na replica ou

Alguns tipos de resolução de conflitos suportados pelo NDB Cluster (`NDB$OLD()`, `NDB$MAX()` e `NDB$MAX_DELETE_WIN()`; além disso, no NDB 8.0.30 e versões posteriores, `NDB$MAX_INS()` e `NDB$MAX_DEL_WIN_INS()`) implementam essa coluna definida pelo usuário como uma coluna de “timestamp” (embora seu tipo não possa ser `TIMESTAMP`, conforme explicado mais adiante nesta seção). Esses tipos de resolução de conflitos são sempre aplicados linha a linha, em vez de uma base transacional. As funções de resolução baseadas em época `NDB$EPOCH()` e `NDB$EPOCH_TRANS()` comparam a ordem em que as épocas são replicadas (e, portanto, essas funções são transacionais). Diferentes métodos podem ser usados para comparar os valores das colunas de resolução na replica quando ocorrem conflitos, conforme explicado mais adiante nesta seção; o método usado pode ser definido para agir em uma única tabela, banco de dados ou servidor, ou em um conjunto de uma ou mais tabelas usando correspondência de padrões. Consulte Correspondência com caracteres curinga, para informações sobre o uso de correspondências de padrões nas colunas `db`, `table_name` e `server_id` da tabela `mysql.ndb_replication`.

Você também deve ter em mente que é responsabilidade do aplicativo garantir que a coluna de resolução esteja corretamente preenchida com valores relevantes, para que a função de resolução possa fazer a escolha apropriada ao determinar se deve aplicar uma atualização.

#### Requisitos

Os preparativos para a resolução de conflitos devem ser feitos tanto na fonte quanto na réplica. Essas tarefas são descritas na lista a seguir:

* Ao escrever os logs binários na fonte, você deve determinar quais colunas serão enviadas (todas as colunas ou apenas aquelas que foram atualizadas). Isso é feito para o MySQL Server como um todo, aplicando a opção de inicialização **mysqld** `--ndb-log-updated-only` (descrita mais tarde nesta seção), ou em uma ou mais tabelas específicas, colocando as entradas apropriadas na tabela `mysql.ndb_replication` (consulte a Tabela ndb_replication).

Nota

Se você está replicando tabelas com colunas muito grandes (como as colunas `TEXT` ou `BLOB`), o `--ndb-log-updated-only` também pode ser útil para reduzir o tamanho dos logs binários e evitar possíveis falhas de replicação devido ao excedente de `max_allowed_packet`.

Veja a Seção 19.5.1.20, “Replicação e max_allowed_packet”, para mais informações sobre esse problema.

* Na replica, você deve determinar que tipo de resolução de conflitos aplicar (“último timestamp vence”, “mesmo timestamp vence”, “primário vence”, “primário vence, transação completa” ou nenhum). Isso é feito usando a tabela do sistema `mysql.ndb_replication`, e se aplica a uma ou mais tabelas específicas (consulte a Tabela ndb_replication).

* O NDB Cluster também suporta detecção de conflitos de leitura, ou seja, a detecção de conflitos entre leituras de uma determinada linha em um cluster e atualizações ou exclusões da mesma linha em outro cluster. Isso requer bloqueios de leitura exclusivos obtidos ao definir `ndb_log_exclusive_reads` igual a 1 na replica. Todas as linhas lidas por uma leitura em conflito são registradas na tabela de exceções. Para mais informações, consulte Detecção e resolução de conflitos de leitura.

* Antes da NDB 8.0.30, os eventos `NDB` aplicavam `WRITE_ROW` estritamente como inserções, exigindo que não houvesse já nenhuma linha desse tipo; ou seja, uma escrita de entrada era sempre rejeitada se a linha já existisse. (Isso ainda é o caso quando se usa qualquer função de resolução de conflitos, exceto `NDB$MAX_INS()` ou `NDB$MAX_DEL_WIN_INS()`.)

Começando com o NDB 8.0.30, ao usar `NDB$MAX_INS()` ou `NDB$MAX_DEL_WIN_INS()`, o `NDB` pode aplicar os eventos `WRITE_ROW` de forma idempotente, mapeando tal evento para um inserção quando a linha de entrada não existir já, ou para uma atualização se existir.

Ao usar as funções `NDB$OLD()`, `NDB$MAX()` e `NDB$MAX_DELETE_WIN()` para resolução de conflitos baseada em marca-passo (assim como `NDB$MAX_INS()` e `NDB$MAX_DEL_WIN_INS()`, começando com NDB 8.0.30), frequentemente referimos a coluna usada para determinar as atualizações como uma coluna de “marca-passo”. No entanto, o tipo de dados dessa coluna nunca é `TIMESTAMP`; em vez disso, seu tipo de dados deve ser `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") (`INTEGER` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")) ou `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"). A coluna de “marca-passo” também deve ser `UNSIGNED` e `NOT NULL`.

As funções `NDB$EPOCH()` e `NDB$EPOCH_TRANS()` discutidas mais adiante nesta seção funcionam comparando a ordem relativa das épocas de replicação aplicadas em um NDB Cluster primário e secundário, e não utilizam marcapassos.

#### Controle de Coluna de Fonte

Podemos ver as operações de atualização em termos de imagens de “antes” e “depois” — ou seja, os estados da tabela antes e depois que a atualização é aplicada. Normalmente, ao atualizar uma tabela com uma chave primária, a imagem de “antes” não é de grande interesse; no entanto, quando precisamos determinar, em uma base por atualização, se os valores atualizados devem ser usados ou não em uma réplica, precisamos garantir que ambas as imagens sejam escritas no log binário da fonte. Isso é feito com a opção `--ndb-log-update-as-write` para **mysqld**, conforme descrito mais adiante nesta seção.

Importante

A decisão de registrar linhas completas ou apenas colunas atualizadas é tomada quando o servidor MySQL é iniciado e não pode ser alterada online; você deve reiniciar o **mysqld** ou iniciar uma nova instância do **mysqld** com opções de registro diferentes.

#### Controle de Resolução de Conflitos

A resolução de conflitos geralmente é habilitada no servidor onde os conflitos podem ocorrer. Assim como a seleção do método de registro, ela é habilitada por entradas na tabela `mysql.ndb_replication`.

`NBT_UPDATED_ONLY_MINIMAL` e `NBT_UPDATED_FULL_MINIMAL` podem ser usados com `NDB$EPOCH()`, `NDB$EPOCH2()` e `NDB$EPOCH_TRANS()`, porque esses não exigem valores de coluna “antes” que não sejam chaves primárias. Algoritmos de resolução de conflitos que exigem os valores antigos, como `NDB$MAX()` e `NDB$OLD()`, não funcionam corretamente com esses valores de `binlog_type`.

#### Funções de Resolução de Conflitos

Esta seção fornece informações detalhadas sobre as funções que podem ser usadas para detecção e resolução de conflitos com a Replicação NDB.

* NDB$OLD()")
* NDB$MAX()")
* NDB$MAX_DELETE_WIN()")
* NDB$MAX_INS()")
* NDB$MAX_DEL_WIN_INS()")
* NDB$EPOCH()")
* NDB$EPOCH_TRANS()")
* NDB$EPOCH2()")
* NDB$EPOCH2_TRANS()")

##### NDB$OLD()

Se o valor de *`column_name`* for o mesmo tanto na fonte quanto na réplica, a atualização é aplicada; caso contrário, a atualização não é aplicada na réplica e uma exceção é escrita no log. Isso é ilustrado pelo seguinte pseudocodigo:

```
if (source_old_column_value == replica_current_column_value)
  apply_update();
else
  log_exception();
```

Essa função pode ser usada para resolução de conflitos de "ganho de mesmo valor". Esse tipo de resolução de conflitos garante que as atualizações não sejam aplicadas na replica da fonte errada.

Importante

O valor da coluna da imagem "antes" da fonte é usado por esta função.

##### NDB$MAX()

Para uma operação de atualização ou exclusão, se o valor da coluna “timestamp” para uma determinada linha proveniente da fonte for maior que o da réplica, ela é aplicada; caso contrário, não é aplicada na réplica. Isso é ilustrado pelo seguinte pseudocodigo:

```
if (source_new_column_value > replica_current_column_value)
  apply_update();
```

Essa função pode ser usada para resolução de conflitos de "maior timestamp vencedor". Esse tipo de resolução de conflitos garante que, em caso de conflito, a versão da linha que foi atualizada mais recentemente é a versão que persiste.

Essa função não tem efeitos em conflitos entre operações de escrita, exceto que uma operação de escrita com a mesma chave primária que uma escrita anterior é sempre rejeitada; ela é aceita e aplicada apenas se nenhuma operação de escrita usando a mesma chave primária já existe. A partir do NDB 8.0.30, você pode usar `NDB$MAX_INS()` para lidar com a resolução de conflitos entre escritas.

Importante

O valor da coluna da imagem "after" das fontes é utilizado por esta função.

##### NDB$MAX_DELETE_WIN()

Esta é uma variação de `NDB$MAX()`. Devido ao fato de que não há marcação de tempo disponível para uma operação de exclusão, uma exclusão usando `NDB$MAX()` é, na verdade, processada como `NDB$OLD`, mas, para alguns casos de uso, isso não é ótimo. Para `NDB$MAX_DELETE_WIN()`, se o valor da coluna “marcação de tempo” para uma determinada linha que adiciona ou atualiza uma linha existente proveniente da fonte for maior que o da replica, ele é aplicado. No entanto, as operações de exclusão são tratadas como sempre tendo o valor mais alto. Isso é ilustrado pelo seguinte pseudocodigo:

```
if ( (source_new_column_value > replica_current_column_value)
        ||
      operation.type == "delete")
  apply_update();
```

Essa função pode ser usada para resolução de conflitos de "maior timestamp, exclua vitórias". Esse tipo de resolução de conflitos garante que, em caso de conflito, a versão da linha que foi excluída ou (de outra forma) mais recentemente atualizada é a versão que persiste.

Nota

Assim como no caso de `NDB$MAX()`, o valor da coluna da imagem "after" da fonte é o valor utilizado por esta função.

##### NDB$MAX_INS()

Essa função oferece suporte para a resolução de operações de escrita conflitantes. Esses conflitos são tratados pelo "NDB$MAX_INS()" da seguinte forma:

1. Se não houver uma escrita em conflito, aplique esta (isso é o mesmo que `NDB$MAX()`).

2. Caso contrário, aplique a resolução de conflitos com o maior timestamp, conforme segue:

1. Se o timestamp do registro de entrada for maior que o do registro de escrita em conflito, aplique a operação de entrada.

2. Se o timestamp para a escrita de entrada *não* for maior, rejeite a operação de escrita de entrada.

Ao realizar uma operação de inserção, `NDB$MAX_INS()` compara os timestamps da fonte e da replica, conforme ilustrado pelo seguinte pseudocodigo:

```
if (source_new_column_value > replica_current_column_value)
  apply_insert();
else
  log_exception();
```

Para uma operação de atualização, o valor da coluna de marcação de tempo atualizada da fonte é comparado com o valor da coluna de marcação de tempo da replica, conforme mostrado aqui:

```
if (source_new_column_value > replica_current_column_value)
  apply_update();
else
  log_exception();
```

Isso é o mesmo que foi feito por `NDB$MAX()`.

Para operações de exclusão, o procedimento também é o mesmo que o realizado por `NDB$MAX()` (e, portanto, o mesmo que `NDB$OLD()`), e é feito da seguinte forma:

```
if (source_new_column_value == replica_current_column_value)
  apply_delete();
else
  log_exception();
```

`NDB$MAX_INS()` foi adicionado no NDB 8.0.30.

##### NDB$MAX_DEL_WIN_INS()

Essa função oferece suporte para a resolução de operações de escrita conflitantes, juntamente com a resolução de "delete wins" como a do `NDB$MAX_DELETE_WIN()`. Os conflitos de escrita são tratados pelo `NDB$MAX_DEL_WIN_INS()` como mostrado aqui:

1. Se não houver uma escrita em conflito, aplique esta (isso é o mesmo que `NDB$MAX_DELETE_WIN()`).

2. Caso contrário, aplique a resolução de conflitos com o maior timestamp, conforme segue:

1. Se o timestamp do registro de entrada for maior que o do registro de escrita em conflito, aplique a operação de entrada.

2. Se o timestamp para a escrita de entrada *não* for maior, rejeite a operação de escrita de entrada.

O tratamento das operações de inserção, conforme realizado por `NDB$MAX_DEL_WIN_INS()`, pode ser representado em pseudocodigo, conforme mostrado aqui:

```
if (source_new_column_value > replica_current_column_value)
  apply_insert();
else
  log_exception();
```

Para operações de atualização, o valor da coluna de marcação de tempo do banco de origem é comparado com o valor da coluna de marcação de tempo da réplica, da seguinte forma (novamente usando pseudocodigo):

```
if (source_new_column_value > replica_current_column_value)
  apply_update();
else
  log_exception();
```

Os apagamentos são tratados usando uma estratégia de “apagar sempre vence” (a mesma que `NDB$MAX_DELETE_WIN()`); um `DELETE` é sempre aplicado sem qualquer consideração a quaisquer valores de data e hora, como ilustrado por este pseudocodigo:

```
if (operation.type == "delete")
  apply_delete();
```

Para conflitos entre operações de atualização e exclusão, essa função se comporta de forma idêntica à `NDB$MAX_DELETE_WIN()`.

`NDB$MAX_DEL_WIN_INS()` foi adicionado no NDB 8.0.30.

##### NDB$EPOCH()

A função `NDB$EPOCH()` acompanha a ordem em que as épocas replicadas são aplicadas em um clúster de replicação em relação às alterações que se originam na replica. Essa ordem relativa é usada para determinar se as alterações que se originam na replica são concorrentes com quaisquer alterações que se originam localmente e, portanto, potencialmente em conflito.

A maioria do que segue na descrição de `NDB$EPOCH()` também se aplica a `NDB$EPOCH_TRANS()`. Quaisquer exceções são mencionadas no texto.

`NDB$EPOCH()` é assimétrico, operando em um NDB Cluster em uma configuração de replicação bidirecional (às vezes referida como replicação “ativa-ativa”). Aqui, referimo-nos ao cluster no qual ele opera como o primário, e o outro como o secundário. A replica no primário é responsável por detectar e lidar com conflitos, enquanto a replica no secundário não está envolvida em qualquer detecção ou tratamento de conflitos.

Quando a réplica no primário detecta conflitos, ela injeta eventos em seu próprio log binário para compensar esses conflitos; isso garante que o NDB Cluster secundário acabe realinhando-se com o primário e, assim, mantém o primário e o secundário não divergindo. Esse mecanismo de compensação e realinhamento exige que o NDB Cluster primário sempre vença quaisquer conflitos com o secundário — ou seja, que as alterações do primário sejam sempre usadas em vez das do secundário em caso de conflito. Essa regra de "sempre o primário vence" tem as seguintes implicações:

* As operações que alteram dados, uma vez comprometidas no primário, são totalmente persistentes e não são desfeitas ou revertidas pela detecção e resolução de conflitos.

* Os dados lidos do primário são totalmente consistentes. Quaisquer alterações realizadas no primário (localmente ou a partir da replica) não são revertidas posteriormente.

* As operações que alteram dados no secundário podem ser revertidas posteriormente, se o primário determinar que elas estão em conflito.

* As linhas individuais lidas no secundário são consistentes em todos os momentos, cada linha sempre refletindo um estado comprometido pelo secundário ou um comprometido pelo primário.

* Os conjuntos de linhas lidos no secundário não são necessariamente consistentes em um único ponto de tempo. Para `NDB$EPOCH_TRANS()`, esse é um estado transitório; para `NDB$EPOCH()`, pode ser um estado persistente.

* Supondo um período de duração suficiente sem quaisquer conflitos, todos os dados do NDB Cluster secundário (eventualmente) se tornam consistentes com os dados do primário.

`NDB$EPOCH()` e `NDB$EPOCH_TRANS()` não exigem nenhuma modificação no esquema do usuário ou alterações na aplicação para fornecer detecção de conflitos. No entanto, é necessário pensar cuidadosamente sobre o esquema utilizado e os padrões de acesso utilizados para verificar se o sistema completo se comporta dentro dos limites especificados.

Cada uma das funções `NDB$EPOCH()` e `NDB$EPOCH_TRANS()` pode ter um parâmetro opcional; este é o número de bits a serem utilizados para representar os 32 bits inferiores da época, e deve ser definido como no mínimo o valor calculado conforme mostrado aqui:

```
CEIL( LOG2( TimeBetweenGlobalCheckpoints / TimeBetweenEpochs ), 1)
```

Para os valores padrão desses parâmetros de configuração (2000 e 100 milissegundos, respectivamente), isso resulta em um valor de 5 bits, portanto, o valor padrão (6) deve ser suficiente, a menos que outros valores sejam usados para `TimeBetweenGlobalCheckpoints`, `TimeBetweenEpochs` ou ambos. Um valor que é muito pequeno pode resultar em falsos positivos, enquanto um valor muito grande pode levar a um espaço excessivamente desperdiçado no banco de dados.

Tanto o `NDB$EPOCH()` quanto o `NDB$EPOCH_TRANS()` inserem entradas para linhas conflitantes nas tabelas de exceções relevantes, desde que essas tabelas tenham sido definidas de acordo com as mesmas regras do esquema de tabela de exceções, conforme descrito em outras partes desta seção (ver NDB$OLD()")). Você deve criar qualquer tabela de exceções antes de criar a tabela de dados com a qual ela deve ser usada.

Assim como as outras funções de detecção de conflitos discutidas nesta seção, `NDB$EPOCH()` e `NDB$EPOCH_TRANS()` são ativadas ao incluir entradas relevantes na tabela `mysql.ndb_replication` (ver tabela ndb_replication). Os papéis dos NDB Clusters primário e secundário neste cenário são totalmente determinados pelas entradas da tabela `mysql.ndb_replication`.

Como os algoritmos de detecção de conflitos empregados pelo `NDB$EPOCH()` e pelo `NDB$EPOCH_TRANS()` são assimétricos, você deve usar valores diferentes para as entradas do `server_id` das réplicas primária e secundária.

Um conflito entre operações de `DELETE` por si só não é suficiente para desencadear um conflito usando `NDB$EPOCH()` ou `NDB$EPOCH_TRANS()`, e o posicionamento relativo dentro das épocas não importa.

**Limitações do NDB$EPOCH()**

As seguintes limitações atualmente se aplicam ao uso de `NDB$EPOCH()` para realizar a detecção de conflitos:

* Os conflitos são detectados usando limites de época do NDB Cluster, com granularidade proporcional a `TimeBetweenEpochs` (padrão: 100 milissegundos). A janela mínima de conflito é o tempo mínimo durante o qual atualizações concorrentes dos mesmos dados em ambos os clusters sempre relatam um conflito. Isso é sempre um tempo não nulo, e é aproximadamente proporcional a `2 * (latency + queueing + TimeBetweenEpochs)`. Isso implica que, assumindo o padrão para `TimeBetweenEpochs` e ignorando qualquer latência entre os clusters (assim como quaisquer atrasos em filas), o tamanho da janela mínima de conflito é aproximadamente 200 milissegundos. Essa janela mínima deve ser considerada ao analisar os padrões esperados de "race" do aplicativo.

* Armazenamento adicional é necessário para tabelas que utilizam as funções `NDB$EPOCH()` e `NDB$EPOCH_TRANS()`; de 1 a 32 bits de espaço extra por linha são necessários, dependendo do valor passado para a função.

* Conflitos entre operações de exclusão podem resultar em divergência entre o primário e o secundário. Quando uma linha é excluída em ambos os clusters simultaneamente, o conflito pode ser detectado, mas não é registrado, uma vez que a linha é excluída. Isso significa que conflitos adicionais durante a propagação de quaisquer operações subsequentes de realinhamento não são detectados, o que pode levar a divergência.

As exclusões devem ser serializadas externamente ou encaminhadas para apenas um clúster. Alternativamente, uma linha separada deve ser atualizada transacionalmente com essas exclusões e quaisquer inserções que as sigam, para que os conflitos possam ser rastreados em exclusões de linha. Isso pode exigir mudanças nos aplicativos.

* Apenas dois NDB Clusters em uma configuração bidirecional "ativa-ativa" são atualmente suportados ao usar `NDB$EPOCH()` ou `NDB$EPOCH_TRANS()` para detecção de conflitos.

* As tabelas que possuem as colunas `BLOB` ou `TEXT` não são atualmente suportadas com `NDB$EPOCH()` ou `NDB$EPOCH_TRANS()`.

##### NDB$EPOCH_TRANS()

`NDB$EPOCH_TRANS()` estende a função `NDB$EPOCH()`. Conflitos são detectados e tratados da mesma maneira, usando a regra “o primário vence sempre” (ver NDB$EPOCH()”), mas com a condição adicional de que quaisquer outras linhas atualizadas na mesma transação em que ocorreu o conflito também são consideradas em conflito. Em outras palavras, onde `NDB$EPOCH()` realinha linhas individuais em conflito no secundário, `NDB$EPOCH_TRANS()` realinha transações em conflito.

Além disso, quaisquer transações que sejam detectabilmente dependentes de uma transação conflitante também são consideradas conflitantes, essas dependências sendo determinadas pelo conteúdo do log binário do cluster secundário. Como o log binário contém apenas operações de modificação de dados (inserções, atualizações e exclusões), apenas as modificações de dados que se sobrepõem são usadas para determinar as dependências entre as transações.

`NDB$EPOCH_TRANS()` está sujeito às mesmas condições e limitações que `NDB$EPOCH()`, e, além disso, exige que todos os IDs de transação sejam registrados no log binário do secundário, usando `--ndb-log-transaction-id` configurado para `ON`. Isso adiciona uma quantidade variável de sobrecarga (até 13 bytes por linha).

A variável de sistema `log_bin_use_v1_row_events`, que tem como padrão `OFF`, *não* deve ser definida como `ON` com `NDB$EPOCH_TRANS()`.

Veja NDB$EPOCH()").

##### NDB$EPOCH2()

A função `NDB$EPOCH2()` é semelhante à `NDB$EPOCH()`, exceto que `NDB$EPOCH2()` prevê o tratamento de apagamento com uma topologia de replicação bidirecional. Neste cenário, os papéis primário e secundário são atribuídos às duas fontes ao definir a variável de sistema `ndb_slave_conflict_role` para o valor apropriado em cada fonte (geralmente um de cada em `PRIMARY`, `SECONDARY`). Quando isso é feito, as modificações feitas pelo secundário são refletidas pelo primário e voltadas ao secundário, que as aplica condicionalmente.

##### NDB$EPOCH2_TRANS()

`NDB$EPOCH2_TRANS()` estende a função `NDB$EPOCH2()`. Conflitos são detectados e tratados da mesma maneira, e a atribuição de papéis primários e secundários aos clústeres replicados, mas com a condição adicional de que quaisquer outras linhas atualizadas na mesma transação na qual o conflito ocorreu também são consideradas em conflito. Isso significa que `NDB$EPOCH2()` realinha as linhas conflitantes individuais no secundário, enquanto `NDB$EPOCH_TRANS()` realinha as transações conflitantes.

Quando `NDB$EPOCH()` e `NDB$EPOCH_TRANS()` utilizam metadados especificados por linha, por última modificação, para determinar se uma mudança de linha replicada recebida do secundário é concorrente com uma mudança localmente comprometida; as mudanças concorrentes são consideradas conflitantes, com atualizações subsequentes da tabela de exceções e realinhamento do secundário. Surge um problema quando uma linha é excluída no primário, não havendo mais nenhuma última modificação disponível para determinar se alguma operação replicada é conflitante, o que significa que operações de exclusão conflitantes não são detectadas. Isso pode resultar em divergência, um exemplo sendo uma exclusão em um clúster que é concorrente com uma exclusão e inserção em outro; é por isso que as operações de exclusão podem ser encaminhadas apenas para um clúster ao usar `NDB$EPOCH()` e `NDB$EPOCH_TRANS()`.

`NDB$EPOCH2()` contorna o problema descrito acima, armazenando informações sobre as linhas excluídas no PRIMARY, ignorando qualquer conflito de exclusão-exclusão e evitando qualquer divergência potencial resultante também. Isso é feito refletindo qualquer operação aplicada com sucesso e replicada do secundário de volta ao secundário. Ao retornar ao secundário, ele pode ser usado para reaplicar uma operação no secundário que foi excluída por uma operação originada do primário.

Ao usar `NDB$EPOCH2()`, você deve ter em mente que o secundário aplica a exclusão do primário, removendo a nova linha até que ela seja restaurada por uma operação refletida. Teoricamente, a subsequente inserção ou atualização no secundário entra em conflito com a exclusão do primário, mas, neste caso, escolhemos ignorar isso e permitir que o secundário "ganhe", no interesse de prevenir a divergência entre os clusters. Em outras palavras, após uma exclusão, o primário não detecta conflitos e, em vez disso, adota as seguintes alterações do secundário imediatamente. Por isso, o estado do secundário pode revisar vários estados anteriores comprometidos à medida que progride para um estado final (estável), e alguns desses podem ser visíveis.

Você também deve estar ciente de que refletir todas as operações do secundário para o primário aumenta o tamanho do logbinary do log do primário, além de exigir largura de banda, uso de CPU e I/O de disco.

A aplicação de operações refletidas no secundário depende do estado da linha-alvo no secundário. Se as alterações refletidas são aplicadas no secundário ou não, pode ser verificado verificando as variáveis de status `Ndb_conflict_reflected_op_prepare_count` e `Ndb_conflict_reflected_op_discard_count`. O número de alterações aplicadas é simplesmente a diferença entre esses dois valores (note que `Ndb_conflict_reflected_op_prepare_count` é sempre maior ou igual a `Ndb_conflict_reflected_op_discard_count`).

Os eventos são aplicados se e somente se ambas as seguintes condições forem verdadeiras:

* A existência da linha — ou seja, se ela existe ou não — está de acordo com o tipo de operação. Para operações de exclusão e atualização, a linha já deve existir. Para operações de inserção, a linha *não* deve existir.

* A linha foi modificada pela última vez pelo primário. É possível que a modificação tenha sido realizada através da execução de uma operação refletida.

Se nenhuma dessas condições for atendida, a operação refletida é descartada pelo secundário.

#### Tabela de exceções para resolução de conflitos

Para usar a função de resolução de conflitos `NDB$OLD()`, também é necessário criar uma tabela de exceções correspondente a cada tabela `NDB` para a qual este tipo de resolução de conflitos deve ser empregado. Isso também é verdadeiro ao usar `NDB$EPOCH()` ou `NDB$EPOCH_TRANS()`. O nome desta tabela é o nome da tabela para a qual a resolução de conflitos deve ser aplicada, com a string `$EX` anexada. (Por exemplo, se o nome da tabela original é `mytable`, o nome do nome da tabela de exceções correspondente deve ser `mytable$EX`.) A sintaxe para criar a tabela de exceções é mostrada aqui:

```
CREATE TABLE original_table$EX  (
    [NDB$]server_id INT UNSIGNED,
    [NDB$]source_server_id INT UNSIGNED,
    [NDB$]source_epoch BIGINT UNSIGNED,
    [NDB$]count INT UNSIGNED,

    [NDB$OP_TYPE ENUM('WRITE_ROW','UPDATE_ROW', 'DELETE_ROW',
      'REFRESH_ROW', 'READ_ROW') NOT NULL,]
    [NDB$CFT_CAUSE ENUM('ROW_DOES_NOT_EXIST', 'ROW_ALREADY_EXISTS',
      'DATA_IN_CONFLICT', 'TRANS_IN_CONFLICT') NOT NULL,]
    [NDB$ORIG_TRANSID BIGINT UNSIGNED NOT NULL,]

    original_table_pk_columns,

    [orig_table_column|orig_table_column$OLD|orig_table_column$NEW,]

    [additional_columns,]

    PRIMARY KEY([NDB$]server_id, [NDB$]source_server_id, [NDB$]source_epoch, [NDB$]count)
) ENGINE=NDB;
```

As quatro primeiras colunas são obrigatórias. Os nomes das primeiras quatro colunas e as colunas que correspondem às colunas da chave primária da tabela original não são críticos; no entanto, para fins de clareza e consistência, sugerimos que você use os nomes mostrados aqui para as colunas `server_id`, `source_server_id`, `source_epoch` e `count`, e que use os mesmos nomes que na tabela original para as colunas que correspondem às da chave primária da tabela original.

Se a tabela de exceções utilizar uma ou mais das colunas opcionais `NDB$OP_TYPE`, `NDB$CFT_CAUSE` ou `NDB$ORIG_TRANSID`, discutidas mais adiante nesta seção, então cada uma das colunas exigidas também deve ser nomeada usando o prefixo `NDB$`. Se desejar, pode usar o prefixo `NDB$` para nomear as colunas exigidas mesmo que não defina nenhuma coluna opcional, mas, neste caso, todas as quatro colunas exigidas devem ser nomeadas usando o prefixo.

Após essas colunas, as colunas que compõem a chave primária da tabela original devem ser copiadas na ordem em que são usadas para definir a chave primária da tabela original. Os tipos de dados para as colunas que duplicam as colunas da chave primária da tabela original devem ser os mesmos (ou maiores que) os dos colunas originais. Pode-se usar um subconjunto das colunas da chave primária.

A tabela de exceções deve usar o mecanismo de armazenamento `NDB`. (Um exemplo que usa `NDB$OLD()` com uma tabela de exceções é mostrado mais adiante nesta seção.)

Colunas adicionais podem ser definidas opcionalmente após as colunas da chave primária copiadas, mas não antes de qualquer uma delas; quaisquer colunas adicionais desse tipo não podem ser `NOT NULL`. O NDB Cluster suporta três colunas adicionais, pré-definidas e opcionais `NDB$OP_TYPE`, `NDB$CFT_CAUSE` e `NDB$ORIG_TRANSID`, que são descritas nos próximos parágrafos.

`NDB$OP_TYPE`: Esta coluna pode ser usada para obter o tipo de operação que está causando o conflito. Se você usar esta coluna, defina-a conforme mostrado aqui:

```
NDB$OP_TYPE ENUM('WRITE_ROW', 'UPDATE_ROW', 'DELETE_ROW',
    'REFRESH_ROW', 'READ_ROW') NOT NULL
```

Os tipos de operações `WRITE_ROW`, `UPDATE_ROW` e `DELETE_ROW` representam operações iniciadas pelo usuário. As operações `REFRESH_ROW` são operações geradas pela resolução de conflitos em transações compensatórias enviadas de volta ao clúster de origem do clúster que detectou o conflito. As operações `READ_ROW` são operações de rastreamento de leitura iniciadas pelo usuário, definidas com bloqueios exclusivos de linha.

`NDB$CFT_CAUSE`: Você pode definir uma coluna opcional `NDB$CFT_CAUSE` que fornece a causa do conflito registrado. Essa coluna, se usada, é definida conforme mostrado aqui:

```
NDB$CFT_CAUSE ENUM('ROW_DOES_NOT_EXIST', 'ROW_ALREADY_EXISTS',
    'DATA_IN_CONFLICT', 'TRANS_IN_CONFLICT') NOT NULL
```

`ROW_DOES_NOT_EXIST` pode ser relatado como a causa para as operações de `UPDATE_ROW` e `WRITE_ROW`; `ROW_ALREADY_EXISTS` pode ser relatado para eventos de `WRITE_ROW`. `DATA_IN_CONFLICT` é relatado quando uma função de conflito baseada em linha detecta um conflito; `TRANS_IN_CONFLICT` é relatado quando uma função de conflito transacional rejeita todas as operações pertencentes a uma transação completa.

`NDB$ORIG_TRANSID`: A coluna `NDB$ORIG_TRANSID`, se utilizada, contém o ID da transação de origem. Esta coluna deve ser definida da seguinte forma:

```
NDB$ORIG_TRANSID BIGINT UNSIGNED NOT NULL
```

`NDB$ORIG_TRANSID` é um valor de 64 bits gerado por `NDB`. Esse valor pode ser usado para correlacionar várias entradas da tabela de exceções que pertencem à mesma transação conflitante, provenientes das mesmas tabelas de exceções ou de tabelas diferentes.

Colunas de referência adicionais que não fazem parte da chave primária da tabela original podem ser nomeadas `colname$OLD` ou `colname$NEW`. `colname$OLD` refere-se a valores antigos em operações de atualização e exclusão — ou seja, operações que contêm eventos `DELETE_ROW`. `colname$NEW` pode ser usado para referenciar novos valores em operações de inserção e atualização — em outras palavras, operações que utilizam eventos `WRITE_ROW`, `UPDATE_ROW` ou ambos os tipos de eventos. Quando uma operação conflitante não fornece um valor para uma coluna de referência específica que não é uma chave primária, a linha da tabela de exceções contém `NULL`, ou um valor padrão definido para essa coluna.

Importante

A tabela `mysql.ndb_replication` é lida quando uma tabela de dados é configurada para replicação, portanto, a linha correspondente a uma tabela a ser replicada deve ser inserida em `mysql.ndb_replication` *antes* de a tabela a ser replicada ser criada.

#### Variáveis de Status de Detecção de Conflitos

Várias variáveis de status podem ser usadas para monitorar a detecção de conflitos. Você pode ver quantas linhas foram encontradas em conflito por `NDB$EPOCH()` desde que essa replica foi reiniciada pela última vez a partir do valor atual da variável de status do sistema `Ndb_conflict_fn_epoch`.

`Ndb_conflict_fn_epoch_trans` fornece o número de linhas que foram encontradas diretamente em conflito por `NDB$EPOCH_TRANS()`. `Ndb_conflict_fn_epoch2` e `Ndb_conflict_fn_epoch2_trans` mostram o número de linhas encontradas em conflito por `NDB$EPOCH2()`, respectivamente. O número de linhas que realmente foram realinhadas, incluindo aquelas afetadas devido à sua pertença ou dependência das mesmas transações que outras linhas em conflito, é dado por `Ndb_conflict_trans_row_reject_count`.

Outra variável de status do servidor `Ndb_conflict_fn_max` fornece um contador do número de vezes que uma linha não foi aplicada no nó SQL atual devido à resolução de conflitos de maior timestamp desde a última vez que o **mysqld** foi iniciado. `Ndb_conflict_fn_max_del_win` fornece um contador do número de vezes que a resolução de conflitos com base no resultado de `NDB$MAX_DELETE_WIN()` foi aplicada.

O NDB 8.0.30 e versões posteriores fornecem `Ndb_conflict_fn_max_ins` para rastrear o número de vezes que o tratamento de "maior marca-horário vence" foi aplicado a operações de escrita (usando `NDB$MAX_INS()`); uma contagem do número de vezes que o tratamento de "mesma marca-horário vence" de escritas foi aplicado (conforme implementado por `NDB$MAX_DEL_WIN_INS()`) é fornecida pela variável de status `Ndb_conflict_fn_max_del_win_ins`.

O número de vezes em que uma linha não foi aplicada como resultado da resolução de conflitos de "mesma marcação de tempo" em um **mysqld** dado desde a última vez que foi reiniciado é dado pela variável de status global `Ndb_conflict_fn_old`. Além de incrementar `Ndb_conflict_fn_old`, a chave primária da linha que não foi usada é inserida em uma tabela de exceções, conforme explicado em outra parte desta seção.

Veja também a Seção 25.4.3.9.3, “Variáveis de Status do Aglomerado NDB”.

#### Exemplos

Os exemplos a seguir pressupõem que você já tenha uma configuração de replicação do NDB Cluster funcionando, conforme descrito na Seção 25.7.5, “Preparando o NDB Cluster para Replicação”, e na Seção 25.7.6, “Começando a Replicação do NDB Cluster (Canal de Replicação Único)”).

**Exemplo de NDB$MAX().** Suponha que você queira habilitar a resolução de conflitos com o maior timestamp na tabela `test.t1`, usando a coluna `mycol` como o “timestamp”. Isso pode ser feito usando os seguintes passos:

1. Certifique-se de que você iniciou a fonte **mysqld** com `--ndb-log-update-as-write=OFF`.

2. Na fonte, execute esta declaração `INSERT`:

   ```
   INSERT INTO mysql.ndb_replication
       VALUES ('test', 't1', 0, NULL, 'NDB$MAX(mycol)');
   ```

Nota

Se a tabela `ndb_replication` ainda não existir, você deve criá-la. Veja a tabela ndb_replication.

Inserir um 0 na coluna `server_id` indica que todos os nós SQL que acessam esta tabela devem usar resolução de conflitos. Se você deseja usar resolução de conflitos apenas em um **mysqld** específico, use o ID do servidor real.

Inserir `NULL` na coluna `binlog_type` tem o mesmo efeito que inserir 0 (`NBT_DEFAULT`); o padrão do servidor é usado.

3. Crie a tabela `test.t1`:

   ```
   CREATE TABLE test.t1 (
       columns
       mycol INT UNSIGNED,
       columns
   ) ENGINE=NDB;
   ```

Agora, quando as atualizações são realizadas nesta tabela, a resolução de conflitos é aplicada e a versão da linha com o maior valor para `mycol` é escrita na replica.

Nota

Outras opções do `binlog_type` como `NBT_UPDATED_ONLY_USE_UPDATE` (`6`) devem ser usadas para controlar o registro na fonte usando a tabela `ndb_replication`, em vez de usar opções de linha de comando.

**Exemplo de NDB$OLD().** Suponha que uma tabela `NDB` como a definida aqui esteja sendo replicada e você deseja habilitar a resolução de conflitos de "mesmo timestamp vence" para atualizações nesta tabela:

```
CREATE TABLE test.t2  (
    a INT UNSIGNED NOT NULL,
    b CHAR(25) NOT NULL,
    columns,
    mycol INT UNSIGNED NOT NULL,
    columns,
    PRIMARY KEY pk (a, b)
)   ENGINE=NDB;
```

Os seguintes passos são necessários, na ordem mostrada:

1. Primeiro — e *antes* de criar `test.t2` — você deve inserir uma linha na tabela `mysql.ndb_replication`, conforme mostrado aqui:

   ```
   INSERT INTO mysql.ndb_replication
       VALUES ('test', 't2', 0, 0, 'NDB$OLD(mycol)');
   ```

Os valores possíveis para a coluna `binlog_type` são mostrados anteriormente nesta seção; neste caso, usamos `0` para especificar que o comportamento padrão de registro do servidor seja usado. O valor `'NDB$OLD(mycol)'` deve ser inserido na coluna `conflict_fn`.

2. Crie uma tabela de exceções apropriada para `test.t2`. A declaração de criação da tabela mostrada aqui inclui todas as colunas necessárias; quaisquer colunas adicionais devem ser declaradas após essas colunas e antes da definição da chave primária da tabela.

   ```
   CREATE TABLE test.t2$EX  (
       server_id INT UNSIGNED,
       source_server_id INT UNSIGNED,
       source_epoch BIGINT UNSIGNED,
       count INT UNSIGNED,
       a INT UNSIGNED NOT NULL,
       b CHAR(25) NOT NULL,

       [additional_columns,]

       PRIMARY KEY(server_id, source_server_id, source_epoch, count)
   )   ENGINE=NDB;
   ```

Podemos incluir colunas adicionais para informações sobre o tipo, causa e ID de transação de origem para um determinado conflito. Também não somos obrigados a fornecer colunas correspondentes para todas as colunas da chave primária na tabela original. Isso significa que você pode criar a tabela de exceções da seguinte maneira:

   ```
   CREATE TABLE test.t2$EX  (
       NDB$server_id INT UNSIGNED,
       NDB$source_server_id INT UNSIGNED,
       NDB$source_epoch BIGINT UNSIGNED,
       NDB$count INT UNSIGNED,
       a INT UNSIGNED NOT NULL,

       NDB$OP_TYPE ENUM('WRITE_ROW','UPDATE_ROW', 'DELETE_ROW',
         'REFRESH_ROW', 'READ_ROW') NOT NULL,
       NDB$CFT_CAUSE ENUM('ROW_DOES_NOT_EXIST', 'ROW_ALREADY_EXISTS',
         'DATA_IN_CONFLICT', 'TRANS_IN_CONFLICT') NOT NULL,
       NDB$ORIG_TRANSID BIGINT UNSIGNED NOT NULL,

       [additional_columns,]

       PRIMARY KEY(NDB$server_id, NDB$source_server_id, NDB$source_epoch, NDB$count)
   )   ENGINE=NDB;
   ```

Nota

O prefixo `NDB$` é necessário para as quatro colunas exigidas, pois incluímos pelo menos uma das colunas `NDB$OP_TYPE`, `NDB$CFT_CAUSE` ou `NDB$ORIG_TRANSID` na definição da tabela.

3. Crie a tabela `test.t2` conforme mostrado anteriormente.

Esses passos devem ser seguidos para cada tabela para a qual você deseja realizar a resolução de conflitos usando `NDB$OLD()`. Para cada tabela desse tipo, deve haver uma linha correspondente em `mysql.ndb_replication`, e deve haver uma tabela de exceções no mesmo banco de dados que a tabela que está sendo replicada.

**Leia sobre detecção e resolução de conflitos.**

O NDB Cluster também suporta o rastreamento de operações de leitura, o que permite, em configurações de replicação circular, gerenciar conflitos entre leituras de uma determinada linha em um cluster e atualizações ou exclusões da mesma linha em outro. Este exemplo utiliza as tabelas `employee` e `department` para modelar um cenário em que um funcionário é movido de um departamento para outro no cluster de origem (a que nos referimos a seguir como cluster *A*) enquanto o cluster de replica (a seguir *B*) atualiza o número de funcionários do departamento anterior do funcionário em uma transação intercalada.

As tabelas de dados foram criadas usando os seguintes comandos SQL:

```
# Employee table
CREATE TABLE employee (
    id INT PRIMARY KEY,
    name VARCHAR(2000),
    dept INT NOT NULL
)   ENGINE=NDB;

# Department table
CREATE TABLE department (
    id INT PRIMARY KEY,
    name VARCHAR(2000),
    members INT
)   ENGINE=NDB;
```

Os conteúdos das duas tabelas incluem as linhas mostradas na saída (parcial) das seguintes declarações `SELECT`:

```
mysql> SELECT id, name, dept FROM employee;
+---------------+------+
| id   | name   | dept |
+------+--------+------+
...
| 998  |  Mike  | 3    |
| 999  |  Joe   | 3    |
| 1000 |  Mary  | 3    |
...
+------+--------+------+

mysql> SELECT id, name, members FROM department;
+-----+-------------+---------+
| id  | name        | members |
+-----+-------------+---------+
...
| 3   | Old project | 24      |
...
+-----+-------------+---------+
```

Suponhamos que já esteja usando uma tabela de exceções que inclui as quatro colunas necessárias (e essas são usadas para a chave primária dessa tabela), as colunas opcionais para tipo de operação e causa, e a coluna da chave primária da tabela original, criada usando a declaração SQL mostrada aqui:

```
CREATE TABLE employee$EX  (
    NDB$server_id INT UNSIGNED,
    NDB$source_server_id INT UNSIGNED,
    NDB$source_epoch BIGINT UNSIGNED,
    NDB$count INT UNSIGNED,

    NDB$OP_TYPE ENUM( 'WRITE_ROW','UPDATE_ROW', 'DELETE_ROW',
                      'REFRESH_ROW','READ_ROW') NOT NULL,
    NDB$CFT_CAUSE ENUM( 'ROW_DOES_NOT_EXIST',
                        'ROW_ALREADY_EXISTS',
                        'DATA_IN_CONFLICT',
                        'TRANS_IN_CONFLICT') NOT NULL,

    id INT NOT NULL,

    PRIMARY KEY(NDB$server_id, NDB$source_server_id, NDB$source_epoch, NDB$count)
)   ENGINE=NDB;
```

Suponha que ocorram as duas transações simultâneas nos dois clusters. No cluster *A*, criamos um novo departamento e, em seguida, movemos o número de empregado 999 para esse departamento, usando os seguintes comandos SQL:

```
BEGIN;
  INSERT INTO department VALUES (4, "New project", 1);
  UPDATE employee SET dept = 4 WHERE id = 999;
COMMIT;
```

Ao mesmo tempo, no grupo *B*, outra transação lê de `employee`, conforme mostrado aqui:

```
BEGIN;
  SELECT name FROM employee WHERE id = 999;
  UPDATE department SET members = members - 1  WHERE id = 3;
commit;
```

As transações conflitantes normalmente não são detectadas pelo mecanismo de resolução de conflitos, uma vez que o conflito está entre uma operação de leitura (`SELECT`) e uma operação de atualização. Você pode contornar esse problema executando `SET` `ndb_log_exclusive_reads` `= 1` no clúster de replica. Adquirir bloqueios de leitura exclusivos dessa maneira faz com que quaisquer linhas lidas na fonte sejam marcadas como necessitando de resolução de conflito no clúster de replica. Se habilitarmos leituras exclusivas dessa maneira antes da logagem dessas transações, a leitura no clúster *B* é rastreada e enviada para o clúster *A* para resolução; o conflito na linha do empregado é subsequentemente detectado e a transação no clúster *B* é abortada.

O conflito está registrado na tabela de exceções (no grupo *A*) como uma operação `READ_ROW` (consulte a Tabela de Exceções de Resolução de Conflitos, para uma descrição dos tipos de operações), conforme mostrado aqui:

```
mysql> SELECT id, NDB$OP_TYPE, NDB$CFT_CAUSE FROM employee$EX;
+-------+-------------+-------------------+
| id    | NDB$OP_TYPE | NDB$CFT_CAUSE     |
+-------+-------------+-------------------+
...
| 999   | READ_ROW    | TRANS_IN_CONFLICT |
+-------+-------------+-------------------+
```

Quaisquer linhas existentes encontradas na operação de leitura são marcadas. Isso significa que várias linhas resultantes do mesmo conflito podem ser registradas na tabela de exceção, conforme demonstrado ao examinar os efeitos de um conflito entre uma atualização no clúster *A* e uma leitura de várias linhas no clúster *B* da mesma tabela em transações simultâneas. A transação executada no clúster *A* é mostrada aqui:

```
BEGIN;
  INSERT INTO department VALUES (4, "New project", 0);
  UPDATE employee SET dept = 4 WHERE dept = 3;
  SELECT COUNT(*) INTO @count FROM employee WHERE dept = 4;
  UPDATE department SET members = @count WHERE id = 4;
COMMIT;
```

Concomitantemente, uma transação contendo as declarações mostradas aqui é executada no clúster *B*:

```
SET ndb_log_exclusive_reads = 1;  # Must be set if not already enabled
...
BEGIN;
  SELECT COUNT(*) INTO @count FROM employee WHERE dept = 3 FOR UPDATE;
  UPDATE department SET members = @count WHERE id = 3;
COMMIT;
```

Neste caso, todas as três linhas que correspondem à condição `WHERE` na segunda transação no `SELECT` são lidas e, portanto, marcadas na tabela de exceções, conforme mostrado aqui:

```
mysql> SELECT id, NDB$OP_TYPE, NDB$CFT_CAUSE FROM employee$EX;
+-------+-------------+-------------------+
| id    | NDB$OP_TYPE | NDB$CFT_CAUSE     |
+-------+-------------+-------------------+
...
| 998   | READ_ROW    | TRANS_IN_CONFLICT |
| 999   | READ_ROW    | TRANS_IN_CONFLICT |
| 1000  | READ_ROW    | TRANS_IN_CONFLICT |
...
+-------+-------------+-------------------+
```

A leitura de rastreamento é realizada com base em linhas existentes apenas. Uma leitura baseada em uma condição dada conflitam apenas com quaisquer linhas que são *encontradas* e não com quaisquer linhas que são inseridas em uma transação interligada. Isso é semelhante à forma como o bloqueio exclusivo de linha é realizado em uma única instância do NDB Cluster.

**Insira o exemplo de detecção e resolução de conflitos (NDB 8.0.30 e posterior).** O exemplo a seguir ilustra o uso das funções de detecção de conflitos de inserção adicionadas no NDB 8.0.30. Assumemos que estamos replicando duas tabelas `t1` e `t2` no banco de dados `test`, e que desejamos usar a detecção de conflitos de inserção com `NDB$MAX_INS()` para `t1` e `NDB$MAX_DEL_WIN_INS()` para `t2`. As duas tabelas de dados não são criadas até mais tarde no processo de configuração.

Configurar a resolução de conflitos de inserção é semelhante a configurar outros algoritmos de detecção e resolução de conflitos, conforme mostrado nos exemplos anteriores. Se a tabela `mysql.ndb_replication` usada para configurar o registro binário e a resolução de conflitos não já existir, é necessário primeiro criá-la, conforme mostrado aqui:

```
CREATE TABLE mysql.ndb_replication (
    db VARBINARY(63),
    table_name VARBINARY(63),
    server_id INT UNSIGNED,
    binlog_type INT UNSIGNED,
    conflict_fn VARBINARY(128),
    PRIMARY KEY USING HASH (db, table_name, server_id)
) ENGINE=NDB
PARTITION BY KEY(db,table_name);
```

A tabela `ndb_replication` atua por tabela; ou seja, é necessário inserir uma linha contendo informações da tabela, um valor da tabela `binlog_type`, a função de resolução de conflitos a ser empregada e o nome da coluna de marcação de tempo (`X`) para cada tabela a ser configurada, da seguinte forma:

```
INSERT INTO mysql.ndb_replication VALUES ("test", "t1", 0, 7, "NDB$MAX_INS(X)");
INSERT INTO mysql.ndb_replication VALUES ("test", "t2", 0, 7, "NDB$MAX_DEL_WIN_INS(X)");
```

Aqui, definimos o binlog_type como `NBT_FULL_USE_UPDATE` (`7`) o que significa que as linhas completas são sempre registradas. Consulte a tabela ndb_replication, para outros valores possíveis.

Você também pode criar uma tabela de exceções correspondente a cada tabela `NDB` para a qual a resolução de conflitos deve ser empregada. Uma tabela de exceções registra todas as linhas rejeitadas pela função de resolução de conflitos para uma determinada tabela. Tabelas de exceções para detecção de conflitos de replicação para as tabelas `t1` e `t2` podem ser criadas usando os seguintes dois comandos SQL:

```
CREATE TABLE `t1$EX` (
    NDB$server_id INT UNSIGNED,
    NDB$master_server_id INT UNSIGNED,
    NDB$master_epoch BIGINT UNSIGNED,
    NDB$count INT UNSIGNED,
    NDB$OP_TYPE ENUM('WRITE_ROW', 'UPDATE_ROW', 'DELETE_ROW',
                     'REFRESH_ROW', 'READ_ROW') NOT NULL,
    NDB$CFT_CAUSE ENUM('ROW_DOES_NOT_EXIST', 'ROW_ALREADY_EXISTS',
                       'DATA_IN_CONFLICT', 'TRANS_IN_CONFLICT') NOT NULL,
    a INT NOT NULL,
    PRIMARY KEY(NDB$server_id, NDB$master_server_id,
                NDB$master_epoch, NDB$count)
) ENGINE=NDB;

CREATE TABLE `t2$EX` (
    NDB$server_id INT UNSIGNED,
    NDB$master_server_id INT UNSIGNED,
    NDB$master_epoch BIGINT UNSIGNED,
    NDB$count INT UNSIGNED,
    NDB$OP_TYPE ENUM('WRITE_ROW', 'UPDATE_ROW', 'DELETE_ROW',
                     'REFRESH_ROW', 'READ_ROW') NOT NULL,
    NDB$CFT_CAUSE ENUM( 'ROW_DOES_NOT_EXIST', 'ROW_ALREADY_EXISTS',
                        'DATA_IN_CONFLICT', 'TRANS_IN_CONFLICT') NOT NULL,
    a INT NOT NULL,
    PRIMARY KEY(NDB$server_id, NDB$master_server_id,
                NDB$master_epoch, NDB$count)
) ENGINE=NDB;
```

Por fim, após criar as tabelas de exceção que acabamos de mostrar, você pode criar as tabelas de dados que serão replicadas e sujeitas ao controle de resolução de conflitos, usando as seguintes duas instruções SQL:

```
CREATE TABLE t1 (
    a INT PRIMARY KEY,
    b VARCHAR(32),
    X INT UNSIGNED
) ENGINE=NDB;

CREATE TABLE t2 (
    a INT PRIMARY KEY,
    b VARCHAR(32),
    X INT UNSIGNED
) ENGINE=NDB;
```

Para cada tabela, a coluna `X` é usada como coluna de data e hora.

Uma vez criado na fonte, `t1` e `t2` são replicados e pode-se assumir que existem tanto na fonte quanto na replica. No restante deste exemplo, usamos `mysqlS>` para indicar um cliente **mysql** conectado à fonte, e `mysqlR>` para indicar um cliente **mysql** em execução na replica.

Primeiro, inserimos uma linha em cada tabela da fonte, como este:

```
mysqlS> INSERT INTO t1 VALUES (1, 'Initial X=1', 1);
Query OK, 1 row affected (0.01 sec)

mysqlS> INSERT INTO t2 VALUES (1, 'Initial X=1', 1);
Query OK, 1 row affected (0.01 sec)
```

Podemos ter certeza de que essas duas linhas são replicadas sem causar conflitos, uma vez que as tabelas na replica não continham nenhuma linha antes de emitir as declarações `INSERT` na fonte. Podemos verificar isso selecionando as tabelas na replica, conforme mostrado aqui:

```
mysqlR> TABLE t1 ORDER BY a;
+---+-------------+------+
| a | b           | X    |
+---+-------------+------+
| 1 | Initial X=1 |    1 |
+---+-------------+------+
1 row in set (0.00 sec)

mysqlR> TABLE t2 ORDER BY a;
+---+-------------+------+
| a | b           | X    |
+---+-------------+------+
| 1 | Initial X=1 |    1 |
+---+-------------+------+
1 row in set (0.00 sec)
```

Em seguida, inserimos novas linhas nas tabelas na replica, assim:

```
mysqlR> INSERT INTO t1 VALUES (2, 'Replica X=2', 2);
Query OK, 1 row affected (0.01 sec)

mysqlR> INSERT INTO t2 VALUES (2, 'Replica X=2', 2);
Query OK, 1 row affected (0.01 sec)
```

Agora, inserimos linhas conflitantes nas tabelas da fonte com valores maiores na coluna de timestamp (`X`) usando as instruções mostradas aqui:

```
mysqlS> INSERT INTO t1 VALUES (2, 'Source X=20', 20);
Query OK, 1 row affected (0.01 sec)

mysqlS> INSERT INTO t2 VALUES (2, 'Source X=20', 20);
Query OK, 1 row affected (0.01 sec)
```

Agora, observamos os resultados selecionando (novamente) de ambas as tabelas na réplica, conforme mostrado aqui:

```
mysqlR> TABLE t1 ORDER BY a;
+---+-------------+-------+
| a | b           | X     |
+---+-------------+-------+
| 1 | Initial X=1 |    1  |
+---+-------------+-------+
| 2 | Source X=20 |   20  |
+---+-------------+-------+
2 rows in set (0.00 sec)

mysqlR> TABLE t2 ORDER BY a;
+---+-------------+-------+
| a | b           | X     |
+---+-------------+-------+
| 1 | Initial X=1 |    1  |
+---+-------------+-------+
| 1 | Source X=20 |   20  |
+---+-------------+-------+
2 rows in set (0.00 sec)
```

As linhas inseridas na fonte, que possuem timestamps maiores do que as das linhas conflitantes na replica, substituíram essas linhas. Na replica, inserimos as duas novas linhas seguintes, que não conflitam com nenhuma das linhas existentes em `t1` ou `t2`, da seguinte forma:

```
mysqlR> INSERT INTO t1 VALUES (3, 'Slave X=30', 30);
Query OK, 1 row affected (0.01 sec)

mysqlR> INSERT INTO t2 VALUES (3, 'Slave X=30', 30);
Query OK, 1 row affected (0.01 sec)
```

Inserir mais linhas na fonte com o mesmo valor da chave primária (`3`) traz conflitos como antes, mas desta vez usamos um valor para a coluna de data e hora menos que o da mesma coluna nas linhas conflitantes na replica.

```
mysqlS> INSERT INTO t1 VALUES (3, 'Source X=3', 3);
Query OK, 1 row affected (0.01 sec)

mysqlS> INSERT INTO t2 VALUES (3, 'Source X=3', 3);
Query OK, 1 row affected (0.01 sec)
```

Podemos ver, ao consultar as tabelas, que ambas as inserções da fonte foram rejeitadas pela réplica, e as linhas inseridas na réplica não foram sobrescritas anteriormente, conforme mostrado aqui no cliente **mysql** na réplica:

```
mysqlR> TABLE t1 ORDER BY a;
+---+--------------+-------+
| a | b            | X     |
+---+--------------+-------+
| 1 |  Initial X=1 |    1  |
+---+--------------+-------+
| 2 |  Source X=20 |   20  |
+---+--------------+-------+
| 3 | Replica X=30 |   30  |
+---+--------------+-------+
3 rows in set (0.00 sec)

mysqlR> TABLE t2 ORDER BY a;
+---+--------------+-------+
| a | b            | X     |
+---+--------------+-------+
| 1 |  Initial X=1 |    1  |
+---+--------------+-------+
| 2 |  Source X=20 |   20  |
+---+--------------+-------+
| 3 | Replica X=30 |   30  |
+---+--------------+-------+
3 rows in set (0.00 sec)
```

Você pode ver informações sobre as linhas que foram rejeitadas nas tabelas de exceção, conforme mostrado aqui:

```
mysqlR> SELECT  NDB$server_id, NDB$master_server_id, NDB$count,
      >         NDB$OP_TYPE, NDB$CFT_CAUSE, a
      > FROM t1$EX
      > ORDER BY NDB$count\G
*************************** 1. row ***************************
NDB$server_id       : 2
NDB$master_server_id: 1
NDB$count           : 1
NDB$OP_TYPE         : WRITE_ROW
NDB$CFT_CAUSE       : DATA_IN_CONFLICT
a                   : 3
1 row in set (0.00 sec)

mysqlR> SELECT  NDB$server_id, NDB$master_server_id, NDB$count,
      >         NDB$OP_TYPE, NDB$CFT_CAUSE, a
      > FROM t2$EX
      > ORDER BY NDB$count\G
*************************** 1. row ***************************
NDB$server_id       : 2
NDB$master_server_id: 1
NDB$count           : 1
NDB$OP_TYPE         : WRITE_ROW
NDB$CFT_CAUSE       : DATA_IN_CONFLICT
a                   : 3
1 row in set (0.00 sec)
```

Como vimos anteriormente, nenhuma das outras linhas inseridas na fonte foi rejeitada pela réplica, apenas as linhas que tinham um valor de marcação de tempo menor do que as linhas em conflito na réplica.