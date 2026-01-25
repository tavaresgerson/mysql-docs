### 21.7.7 Usando Dois Canais de Replicação para Replicação do Cluster NDB

Em um cenário de exemplo mais completo, prevemos dois canais de replicação para fornecer redundância e, consequentemente, proteger contra a possível falha de um único canal de replicação. Isso exige um total de quatro servidores de replicação, dois servidores source no source cluster (cluster de origem) e dois servidores replica no replica cluster (cluster de réplica). Para fins da discussão a seguir, presumimos que identificadores exclusivos sejam atribuídos conforme mostrado aqui:

**Tabela 21.67 Servidores de Replicação do Cluster NDB descritos no texto**

<table><thead><tr> <th>Server ID</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>1</td> <td>Source - canal de replicação primário (<span><em>S</em></span>)</td> </tr><tr> <td>2</td> <td>Source - canal de replicação secundário (<span><em>S'</em></span>)</td> </tr><tr> <td>3</td> <td>Replica - canal de replicação primário (<span><em>R</em></span>)</td> </tr><tr> <td>4</td> <td>Replica - canal de replicação secundário (<span><em>R'</em></span>)</td> </tr></tbody></table>

Configurar a replicação com dois canais não é radicalmente diferente de configurar um único canal de replicação. Primeiro, os processos [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") para os servidores source de replicação primária e secundária devem ser iniciados, seguidos pelos das replicas primárias e secundárias. Os processos de replicação podem ser iniciados emitindo o Statement [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") em cada uma das replicas. Os comandos e a ordem em que devem ser emitidos são mostrados aqui:

1. Inicie o source de replicação primário:

   ```sql
   shellS> mysqld --ndbcluster --server-id=1 \
                  --log-bin &
   ```

2. Inicie o source de replicação secundário:

   ```sql
   shellS'> mysqld --ndbcluster --server-id=2 \
                  --log-bin &
   ```

3. Inicie o servidor replica primário:

   ```sql
   shellR> mysqld --ndbcluster --server-id=3 \
                  --skip-slave-start &
   ```

4. Inicie o servidor replica secundário:

   ```sql
   shellR'> mysqld --ndbcluster --server-id=4 \
                   --skip-slave-start &
   ```

5. Finalmente, inicie a replicação no canal primário executando o Statement [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") na replica primária, conforme mostrado aqui:

   ```sql
   mysqlR> START SLAVE;
   ```

   Aviso

   Apenas o canal primário deve ser iniciado neste ponto. O canal de replicação secundário precisa ser iniciado somente no caso de falha do canal de replicação primário, conforme descrito na [Seção 21.7.8, “Implementando Failover com Replicação do Cluster NDB”](mysql-cluster-replication-failover.html "21.7.8 Implementing Failover with NDB Cluster Replication"). Executar múltiplos canais de replicação simultaneamente pode resultar na criação indesejada de registros duplicados nas replicas.

Conforme mencionado anteriormente, não é necessário habilitar o binary logging nas replicas.