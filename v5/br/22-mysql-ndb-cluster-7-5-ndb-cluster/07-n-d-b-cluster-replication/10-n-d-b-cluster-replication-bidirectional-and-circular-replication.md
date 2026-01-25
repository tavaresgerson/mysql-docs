### 21.7.10 Replicação do NDB Cluster: Replicação Bidirecional e Circular

É possível usar o NDB Cluster para replicação bidirecional entre dois Clusters, bem como para replicação circular entre qualquer número de Clusters.

**Exemplo de replicação circular.** Nos próximos parágrafos, consideramos o exemplo de uma configuração de replicação envolvendo três NDB Clusters numerados 1, 2 e 3, nos quais o Cluster 1 atua como Source de replicação para o Cluster 2, o Cluster 2 atua como Source para o Cluster 3, e o Cluster 3 atua como Source para o Cluster 1. Cada Cluster tem dois SQL nodes, sendo os SQL nodes A e B pertencentes ao Cluster 1, os SQL nodes C e D pertencentes ao Cluster 2, e os SQL nodes E e F pertencentes ao Cluster 3.

A replicação circular usando esses Clusters é suportada desde que as seguintes condições sejam atendidas:

* Os SQL nodes em todos os Sources e Replicas são os mesmos.
* Todos os SQL nodes que atuam como Sources e Replicas são iniciados com a variável de sistema [`log_slave_updates`](replication-options-binary-log.html#sysvar_log_slave_updates) habilitada.

Este tipo de configuração de replicação circular é mostrado no diagrama a seguir:

**Figura 21.17 Replicação Circular do NDB Cluster com Todos os Sources Como Replicas**

![O conteúdo é descrito no texto circundante. O diagrama mostra três clusters, cada um com dois nós. Setas conectando SQL nodes em diferentes clusters ilustram que todos os sources também são replicas.](images/cluster-circular-replication-1.png)

Neste cenário, o SQL node A no Cluster 1 replica para o SQL node C no Cluster 2; o SQL node C replica para o SQL node E no Cluster 3; o SQL node E replica para o SQL node A. Em outras palavras, a linha de replicação (indicada pelas setas curvas no diagrama) conecta diretamente todos os SQL nodes usados como Sources e Replicas de replicação.

Também é possível configurar a replicação circular de forma que nem todos os SQL nodes Source também sejam Replicas, conforme mostrado aqui:

**Figura 21.18 Replicação Circular do NDB Cluster Onde Nem Todos os Sources São Replicas**

![O conteúdo é descrito no texto circundante. O diagrama mostra três clusters, cada um com dois nós. Setas conectando SQL nodes em diferentes clusters ilustram que nem todos os sources são replicas.](images/cluster-circular-replication-2.png)

Neste caso, diferentes SQL nodes em cada Cluster são usados como Sources e Replicas de replicação. Você *não* deve iniciar nenhum dos SQL nodes com a variável de sistema [`log_slave_updates`](replication-options-binary-log.html#sysvar_log_slave_updates) habilitada. Este tipo de esquema de replicação circular para NDB Cluster, no qual a linha de replicação (novamente indicada pelas setas curvas no diagrama) é descontínua, deve ser possível, mas deve-se notar que ainda não foi totalmente testado e, portanto, ainda deve ser considerado experimental.

**Uso de backup e restore nativos do NDB para inicializar um Cluster Replica.**

Ao configurar a replicação circular, é possível inicializar o Cluster Replica usando o comando [`START BACKUP`](mysql-cluster-backup-using-management-client.html "21.6.8.2 Using The NDB Cluster Management Client to Create a Backup") do cliente de gerenciamento em um NDB Cluster para criar um backup e, em seguida, aplicar esse backup em outro NDB Cluster usando [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup"). Isso não cria automaticamente Binary Logs no SQL node do segundo NDB Cluster que atua como a Replica; para que os Binary Logs sejam criados, você deve emitir uma instrução [`SHOW TABLES`](show-tables.html "13.7.5.37 SHOW TABLES Statement") nesse SQL node; isso deve ser feito antes de executar [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement"). Este é um problema conhecido (*known issue*).

**Exemplo de Failover Multi-Source.** Nesta seção, discutimos o Failover em uma configuração de replicação multi-source de NDB Cluster com três NDB Clusters com server IDs 1, 2 e 3. Neste cenário, o Cluster 1 replica para os Clusters 2 e 3; o Cluster 2 também replica para o Cluster 3. Este relacionamento é mostrado aqui:

**Figura 21.19 Replicação Multi-Master do NDB Cluster Com 3 Sources**

![Configuração de replicação multi-source do NDB Cluster com três NDB Clusters com server IDs 1, 2 e 3; o Cluster 1 replica para os Clusters 2 e 3; o Cluster 2 também replica para o Cluster 3.](images/cluster-replication-multi-source.png)

Em outras palavras, os dados replicam do Cluster 1 para o Cluster 3 por 2 rotas diferentes: diretamente e via Cluster 2.

Nem todos os servidores MySQL que participam da replicação multi-source devem atuar simultaneamente como Source e Replica, e um determinado NDB Cluster pode usar diferentes SQL nodes para diferentes canais de replicação. Esse caso é mostrado aqui:

**Figura 21.20 Replicação Multi-Source do NDB Cluster, Com Servidores MySQL**

![Os conceitos são descritos no texto circundante. Mostra três nós: o SQL node A no Cluster 1 replica para o SQL node F no Cluster 3; o SQL node B no Cluster 1 replica para o SQL node C no Cluster 2; o SQL node E no Cluster 3 replica para o SQL node G no Cluster 3. Os SQL nodes A e B no Cluster 1 usam --log-slave-updates=0; os SQL nodes C no Cluster 2 e os SQL nodes F e G no Cluster 3 usam --log-slave-updates=1; e os SQL nodes D e E no Cluster 2 usam --log-slave-updates=0.](images/cluster-replication-multi-source-mysqlds.png)

Servidores MySQL que atuam como Replicas devem ser executados com a variável de sistema [`log_slave_updates`](replication-options-binary-log.html#sysvar_log_slave_updates) habilitada. Quais processos [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") exigem esta opção também é mostrado no diagrama anterior.

Note

O uso da variável de sistema [`log_slave_updates`](replication-options-binary-log.html#sysvar_log_slave_updates) não tem efeito em servidores que não estão sendo executados como Replicas.

A necessidade de Failover surge quando um dos Clusters de replicação falha. Neste exemplo, consideramos o caso em que o Cluster 1 é perdido, e o Cluster 3, portanto, perde 2 Sources de updates do Cluster 1. Como a replicação entre NDB Clusters é assíncrona, não há garantia de que os updates do Cluster 3 originados diretamente do Cluster 1 sejam mais recentes do que aqueles recebidos através do Cluster 2. Você pode lidar com isso garantindo que o Cluster 3 alcance o Cluster 2 no que diz respeito aos updates do Cluster 1. Em termos de servidores MySQL, isso significa que você precisa replicar quaisquer updates pendentes do servidor MySQL C para o servidor F.

No servidor C, execute as seguintes Queries:

```sql
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

Note

Você pode melhorar a performance desta Query e, consequentemente, acelerar significativamente os tempos de Failover, adicionando o Index apropriado à tabela `ndb_binlog_index`. Consulte a [Seção 21.7.4, “NDB Cluster Replication Schema and Tables”](mysql-cluster-replication-schema.html "21.7.4 NDB Cluster Replication Schema and Tables"), para obter mais informações.

Copie manualmente os valores de *`@file`* e *`@pos`* do servidor C para o servidor F (ou faça com que sua aplicação realize o equivalente). Em seguida, no servidor F, execute a seguinte instrução [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement"):

```sql
mysqlF> CHANGE MASTER TO
     ->     MASTER_HOST = 'serverC'
     ->     MASTER_LOG_FILE='@file',
     ->     MASTER_LOG_POS=@pos;
```

Assim que isso for feito, você poderá emitir uma instrução [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") no servidor MySQL F; isso fará com que quaisquer updates ausentes originados do servidor B sejam replicados para o servidor F.

A instrução [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") também suporta uma opção `IGNORE_SERVER_IDS` que aceita uma lista de server IDs separada por vírgulas e faz com que eventos originados dos servidores correspondentes sejam ignorados. Para mais informações, consulte a [Seção 13.4.2.1, “CHANGE MASTER TO Statement”](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") e a [Seção 13.7.5.34, “SHOW SLAVE STATUS Statement”](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement"). Para informações sobre como essa opção interage com a variável [`ndb_log_apply_status`](mysql-cluster-options-variables.html#sysvar_ndb_log_apply_status), consulte a [Seção 21.7.8, “Implementing Failover with NDB Cluster Replication”](mysql-cluster-replication-failover.html "21.7.8 Implementing Failover with NDB Cluster Replication").