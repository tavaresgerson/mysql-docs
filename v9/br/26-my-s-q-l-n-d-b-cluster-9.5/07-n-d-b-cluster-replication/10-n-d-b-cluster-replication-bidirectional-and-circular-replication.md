### 25.7.10 Replicação em Agrupamento NDB: Replicação Bidirecional e Circular

É possível usar o NDB Cluster para replicação bidirecional entre dois agrupamentos, bem como para replicação circular entre qualquer número de agrupamentos.

**Exemplo de replicação circular.** Nos próximos parágrafos, consideramos o exemplo de uma configuração de replicação envolvendo três agrupamentos NDB numerados 1, 2 e 3, nos quais o Agrupamento 1 atua como a fonte de replicação para o Agrupamento 2, o Agrupamento 2 atua como a fonte para o Agrupamento 3 e o Agrupamento 3 atua como a fonte para o Agrupamento 1. Cada agrupamento tem dois nós SQL, com os nós SQL A e B pertencentes ao Agrupamento 1, os nós SQL C e D pertencentes ao Agrupamento 2 e os nós SQL E e F pertencentes ao Agrupamento 3.

A replicação circular usando esses agrupamentos é suportada desde que as seguintes condições sejam atendidas:

* Os nós SQL em todas as fontes e réplicas sejam os mesmos.
* Todos os nós SQL atuando como fontes e réplicas sejam iniciados com a variável de sistema `log_replica_updates` habilitada.

Esse tipo de configuração de replicação circular é mostrado no diagrama a seguir:

**Figura 25.14 Replicação Circular em Agrupamento NDB com Todas as Fontes Como Replicação**

![Alguns conteúdos são descritos no texto ao redor. O diagrama mostra três agrupamentos, cada um com dois nós. As setas conectando nós SQL em diferentes agrupamentos ilustram que todas as fontes também são réplicas.](images/cluster-circular-replication-1.png)

Neste cenário, o nó SQL A no Agrupamento 1 replica para o nó SQL C no Agrupamento 2; o nó SQL C replica para o nó SQL E no Agrupamento 3; o nó SQL E replica para o nó SQL A. Em outras palavras, a linha de replicação (indicada pelas setas curvas no diagrama) conecta diretamente todos os nós SQL usados como fontes e réplicas de replicação.

Também é possível configurar a replicação circular de forma que nem todos os nós SQL de origem sejam também réplicas, como mostrado aqui:

**Figura 25.15 Replicação Circular de NDB Cluster Onde Nem Todas as Fontes São Réplicas**

![Alguns conteúdos são descritos no texto ao redor. O diagrama mostra três clusters, cada um com dois nós. As setas conectando os nós SQL em diferentes clusters ilustram que nem todas as fontes são réplicas.](images/cluster-circular-replication-2.png)

Neste caso, diferentes nós SQL em cada cluster são usados como fontes e réplicas de replicação. Você *não* deve iniciar nenhum dos nós SQL com a variável de sistema `log_replica_updates` habilitada. Este tipo de esquema de replicação circular para o NDB Cluster, no qual a linha de replicação (novamente indicada pelas setas curvas no diagrama) é descontínua, deve ser possível, mas deve-se notar que ainda não foi testado completamente e, portanto, ainda deve ser considerado experimental.

**Usando backup e restauração nativas do NDB para inicializar um cluster de réplica.**

Ao configurar a replicação circular, é possível inicializar o cluster de réplica usando o comando do cliente de gerenciamento `START BACKUP` em um NDB Cluster para criar um backup e, em seguida, aplicar este backup em outro NDB Cluster usando **ndb\_restore**. Isso não cria automaticamente logs binários no nó SQL do segundo NDB Cluster que atua como a réplica; para fazer com que os logs binários sejam criados, você deve emitir uma declaração `SHOW TABLES` nesse nó SQL; isso deve ser feito antes de executar `START REPLICA`. Este é um problema conhecido.

**Exemplo de falha de múltiplas fontes.** Nesta seção, discutimos a falha de múltiplas fontes em uma configuração de replicação de NDB Cluster com três NDB Clusters com IDs de servidor 1, 2 e 3. Neste cenário, o Cluster 1 replica para os Clusters 2 e 3; o Cluster 2 também replica para o Cluster 3. Esta relação é mostrada aqui:

**Figura 25.16 Replicação de NDB Cluster de Múltiplas Fontes com 3 Fontes**

![Replicação de NDB Cluster de múltiplas fontes com três NDB Clusters tendo IDs de servidor 1, 2 e 3; o Cluster 1 replica para os Clusters 2 e 3; o Cluster 2 também replica para o Cluster 3.](images/cluster-replication-multi-source.png)

Em outras palavras, os dados replicam do Cluster 1 para o Cluster 3 por meio de 2 rotas diferentes: diretamente e por meio do Cluster 2.

Nem todos os servidores MySQL que participam da replicação de múltiplas fontes precisam atuar como fonte e replica, e um determinado NDB Cluster pode usar diferentes nós SQL para diferentes canais de replicação. Um caso como este é mostrado aqui:

**Figura 25.17 Replicação de NDB Cluster de Múltiplas Fontes, Com Servidores MySQL**

![Os conceitos são descritos no texto ao redor. Mostra três nós: o nó SQL A no Cluster 1 replica para o nó SQL F no Cluster 3; o nó SQL B no Cluster 1 replica para o nó SQL C no Cluster 2; o nó SQL E no Cluster 3 replica para o nó SQL G no Cluster 3. Os nós SQL A e B no cluster 1 têm --log-replica-updates=0; os nós SQL C no Cluster 2 e os nós SQL F e G no Cluster 3 têm --log-replica-updates=1; e os nós SQL D e E no Cluster 2 têm --log-replica-updates=0.](images/cluster-replication-multi-source-mysqlds.png)

Os servidores MySQL que atuam como replicados devem ser executados com a variável de sistema `log_replica_updates` habilitada. Os processos do **mysqld** que requerem essa opção também são mostrados no diagrama anterior.

Nota

O uso da variável de sistema `log_replica_updates` não tem efeito em servidores que não são executados como réplicas.

A necessidade de failover surge quando um dos clusters replicadores cai. Neste exemplo, consideramos o caso em que o Cluster 1 é perdido, e assim o Cluster 3 perde 2 fontes de atualizações do Cluster 1. Como a replicação entre os Clusters NDB é assíncrona, não há garantia de que as atualizações do Cluster 3 que se originam diretamente do Cluster 1 sejam mais recentes do que as recebidas através do Cluster 2. Você pode lidar com isso garantindo que o Cluster 3 ative o rastreamento do Cluster 2 em relação às atualizações do Cluster 1. Em termos de servidores MySQL, isso significa que você precisa replicar quaisquer atualizações pendentes do servidor MySQL C para o servidor F.

No servidor C, execute as seguintes consultas:

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

Observação

Você pode melhorar o desempenho desta consulta e, assim, acelerar significativamente os tempos de failover, adicionando o índice apropriado à tabela `ndb_binlog_index`. Consulte a Seção 25.7.4, “NDB Cluster Replication Schema and Tables” (Esquema e tabelas de replicação de clusters NDB), para obter mais informações.

Copie os valores para *`@file`* e *`@pos`* manualmente do servidor C para o servidor F (ou faça com que sua aplicação realize o equivalente). Em seguida, no servidor F, execute a seguinte declaração `CHANGE REPLICATION SOURCE TO`:

```
mysqlF> CHANGE REPLICATION SOURCE TO
     ->     SOURCE_HOST = 'serverC'
     ->     SOURCE_LOG_FILE='@file',
     ->     SOURCE_LOG_POS=@pos;
```

Uma vez feito isso, você pode emitir a declaração `START REPLICA` no servidor MySQL F; isso faz com que quaisquer atualizações faltantes que se originam do servidor B sejam replicadas para o servidor F.

A declaração `CHANGE REPLICATION SOURCE TO` também suporta a opção `IGNORE_SERVER_IDS`, que aceita uma lista de IDs de servidor separados por vírgula e faz com que os eventos originados nos servidores correspondentes sejam ignorados. Consulte a documentação desta declaração para obter mais informações, bem como a Seção 15.7.7.36, “Declaração SHOW REPLICA STATUS”. Para informações sobre como essa opção interage com a variável `ndb_log_apply_status`, consulte a Seção 25.7.8, “Implementação de Failover com Replicação de NDB Cluster”.