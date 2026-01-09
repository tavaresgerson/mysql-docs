### 21.7.10 Replicação em cluster do NDB: Replicação bidirecional e circular

É possível usar o NDB Cluster para replicação bidirecional entre dois clusters, bem como para replicação circular entre qualquer número de clusters.

**Exemplo de replicação circular.** Nos próximos parágrafos, consideramos o exemplo de uma configuração de replicação envolvendo três NDB Clusters numerados 1, 2 e 3, no qual o Cluster 1 atua como a fonte de replicação para o Cluster 2, o Cluster 2 atua como a fonte para o Cluster 3 e o Cluster 3 atua como a fonte para o Cluster 1. Cada cluster tem dois nós SQL, com os nós SQL A e B pertencentes ao Cluster 1, os nós SQL C e D pertencentes ao Cluster 2 e os nós SQL E e F pertencentes ao Cluster 3.

A replicação circular usando esses clusters é suportada desde que as seguintes condições sejam atendidas:

- Os nós SQL em todas as fontes e réplicas são os mesmos.
- Todos os nós SQL que atuam como fontes e réplicas são iniciados com a variável de sistema [`log_slave_updates`](https://pt.wikipedia.org/wiki/Replicação#Op%C3%A7%C3%B5es_bin%C3%A1rias_de_log) habilitada.

Esse tipo de configuração de replicação circular é mostrado no diagrama a seguir:

**Figura 21.17 Replicação Circular de Clusters NDB com Todas as Fontes como Replicas**

![Alguns conteúdos são descritos no texto ao redor. O diagrama mostra três aglomerados, cada um com dois nós. As setas que conectam os nós SQL em diferentes aglomerados ilustram que todas as fontes também são réplicas.](images/cluster-circular-replication-1.png)

Nesse cenário, o nó SQL A do Cluster 1 replica para o nó SQL C do Cluster 2; o nó SQL C replica para o nó SQL E do Cluster 3; o nó SQL E replica para o nó SQL A. Em outras palavras, a linha de replicação (indicada pelas setas curvas no diagrama) conecta diretamente todos os nós SQL usados como fontes e réplicas de replicação.

É também possível configurar a replicação circular de forma que nem todos os nós de SQL de origem sejam também réplicas, como mostrado aqui:

**Figura 21.18 Replicação Circular de Clusters NDB Onde Nem Todas as Fontes São Replicas**

![Alguns conteúdos são descritos no texto ao redor. O diagrama mostra três aglomerados, cada um com dois nós. As setas que conectam os nós SQL em diferentes aglomerados ilustram que nem todas as fontes são réplicas.](images/cluster-circular-replication-2.png)

Nesse caso, diferentes nós SQL em cada clúster são usados como fontes de replicação e réplicas. Você *não* deve iniciar nenhum dos nós SQL com a variável de sistema `log_slave_updates` habilitada. Esse tipo de esquema de replicação circular para o NDB Cluster, no qual a linha de replicação (novamente indicada pelas setas curvas no diagrama) é descontínua, deve ser possível, mas deve-se notar que ainda não foi testado completamente e, portanto, ainda deve ser considerado experimental.

**Usando backup e restauração nativas do NDB para inicializar um cluster de replica.**

Ao configurar a replicação circular, é possível inicializar o clúster de replicação usando o comando `[START BACKUP]` (mysql-cluster-backup-using-management-client.html) no NDB Cluster para criar um backup e, em seguida, aplicar esse backup em outro NDB Cluster usando **ndb_restore**. Isso não cria automaticamente logs binários no nó SQL do segundo NDB Cluster que atua como replica; para que os logs binários sejam criados, você deve emitir uma declaração `[SHOW TABLES]` (show-tables.html) nesse nó SQL; isso deve ser feito antes de executar `[START SLAVE]` (start-slave.html). Esse é um problema conhecido.

**Exemplo de falha de múltiplas fontes.** Nesta seção, discutimos a falha de múltiplas fontes em uma configuração de replicação de NDB Cluster de múltiplas fontes com três NDB Clusters com IDs de servidor 1, 2 e 3. Neste cenário, o Cluster 1 replica para os Clusters 2 e 3; o Cluster 2 também replica para o Cluster 3. Esta relação é mostrada aqui:

**Figura 21.19 Replicação de cluster NDDB com múltiplos mestres com 3 fontes**

![Configuração de replicação de NDB Cluster de múltiplas fontes com três NDB Clusters com IDs de servidor 1, 2 e 3; o Cluster 1 replica para os Clusters 2 e 3; o Cluster 2 também replica para o Cluster 3](images/cluster-replication-multi-source.png)

Em outras palavras, os dados são replicados do Cluster 1 para o Cluster 3 por meio de 2 rotas diferentes: diretamente e por meio do Cluster 2.

Nem todos os servidores MySQL que participam da replicação de múltiplas fontes precisam atuar como fonte e réplica, e um determinado NDB Cluster pode usar diferentes nós SQL para diferentes canais de replicação. Um caso como esse é mostrado aqui:

**Figura 21.20 Replicação de múltiplas fontes de cluster NDB, com servidores MySQL**

![Os conceitos são descritos no texto ao redor. Mostra três nós: o nó SQL A no Clúster 1 replica para o nó SQL F no Clúster 3; o nó SQL B no Clúster 1 replica para o nó SQL C no Clúster 2; o nó SQL E no Clúster 3 replica para o nó SQL G no Clúster 3. Os nós SQL A e B no Clúster 1 têm --log-slave-updates=0; os nós SQL C no Clúster 2 e os nós SQL F e G no Clúster 3 têm --log-slave-updates=1; e os nós SQL D e E no Clúster 2 têm --log-slave-updates=0.](images/cluster-replication-multi-source-mysqlds.png)

Os servidores MySQL que atuam como réplicas devem ser executados com a variável de sistema `log_slave_updates` habilitada. Os processos do **mysqld** que exigem essa opção também estão mostrados no diagrama anterior.

Nota

O uso da variável de sistema [`log_slave_updates`](https://pt.wikipedia.org/wiki/Replicação#Op%C3%A7%C3%B5es_bin%C3%A1rias_de_log) não tem efeito em servidores que não estão sendo executados como réplicas.

A necessidade de falha de replicação surge quando um dos clusters replicadores é interrompido. Neste exemplo, consideramos o caso em que o Cluster 1 é perdido, e, portanto, o Cluster 3 perde 2 fontes de atualizações do Cluster 1. Como a replicação entre os Clusters NDB é assíncrona, não há garantia de que as atualizações do Cluster 3 que têm origem diretamente no Cluster 1 sejam mais recentes do que as recebidas através do Cluster 2. Você pode lidar com isso garantindo que o Cluster 3 consiga se atualizar com o Cluster 2 em relação às atualizações do Cluster 1. Em termos de servidores MySQL, isso significa que você precisa replicar quaisquer atualizações pendentes do servidor MySQL C para o servidor F.

No servidor C, execute as seguintes consultas:

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

Nota

Você pode melhorar o desempenho dessa consulta e, assim, acelerar significativamente os tempos de failover, adicionando o índice apropriado à tabela `ndb_binlog_index`. Consulte Seção 21.7.4, “Esquema e tabelas de replicação de clúster NDB” para obter mais informações.

Copie manualmente os valores para *`@file`* e *`@pos`* do servidor C para o servidor F (ou faça sua aplicação realizar o equivalente). Em seguida, no servidor F, execute a seguinte declaração `CHANGE MASTER TO`:

```sql
mysqlF> CHANGE MASTER TO
     ->     MASTER_HOST = 'serverC'
     ->     MASTER_LOG_FILE='@file',
     ->     MASTER_LOG_POS=@pos;
```

Depois que isso for feito, você pode emitir uma declaração `START SLAVE` no servidor MySQL F; isso faz com que quaisquer atualizações faltantes originadas do servidor B sejam replicadas para o servidor F.

A declaração `CHANGE MASTER TO` também suporta a opção `IGNORE_SERVER_IDS`, que aceita uma lista de IDs de servidor separados por vírgula e faz com que os eventos originados nos servidores correspondentes sejam ignorados. Para obter mais informações, consulte Seção 13.4.2.1, “Declaração CHANGE MASTER TO” e Seção 13.7.5.34, “Declaração SHOW SLAVE STATUS”. Para informações sobre como essa opção interage com a variável `ndb_log_apply_status`, consulte Seção 21.7.8, “Implementação de Failover com Replicação de NDB Cluster”.
