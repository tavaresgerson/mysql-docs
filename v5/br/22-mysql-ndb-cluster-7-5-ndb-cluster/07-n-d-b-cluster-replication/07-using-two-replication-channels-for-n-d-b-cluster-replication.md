### 21.7.7 Usar dois canais de replicação para a replicação de clusters NDB

Em um cenário de exemplo mais completo, imaginamos dois canais de replicação para fornecer redundância e, assim, proteger contra possíveis falhas de um único canal de replicação. Isso requer um total de quatro servidores de replicação, dois servidores de origem no clúster de origem e dois servidores de replica no clúster de replica. Para os fins da discussão a seguir, assumimos que identificadores únicos são atribuídos conforme mostrado aqui:

**Tabela 21.67 Servidores de replicação de cluster do NDB descritos no texto**

<table><thead><tr> <th>ID do servidor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>1</td> <td>Fonte - canal de replicação primário (<span><em>S</em></span>)</td> </tr><tr> <td>2</td> <td>Fonte - canal de replicação secundário (<span><em>S'</em></span>)</td> </tr><tr> <td>3</td> <td>Replica - canal de replicação primário (<span><em>R</em></span>)</td> </tr><tr> <td>4</td> <td>replica - canal de replicação secundário (<span><em>R'</em></span>)</td> </tr></tbody></table>

Configurar a replicação com dois canais não difere radicalmente de configurar um único canal de replicação. Primeiro, os processos do **mysqld** dos servidores de origem primária e secundária de replicação devem ser iniciados, seguidos pelos processos das réplicas primária e secundária. Os processos de replicação podem ser iniciados emitindo a instrução `START SLAVE` em cada uma das réplicas. Os comandos e a ordem em que eles precisam ser emitidos estão mostrados aqui:

1. Comece a fonte de replicação primária:

   ```sql
   shellS> mysqld --ndbcluster --server-id=1 \
                  --log-bin &
   ```

2. Inicie a fonte de replicação secundária:

   ```sql
   shellS'> mysqld --ndbcluster --server-id=2 \
                  --log-bin &
   ```

3. Comece o servidor de replicação primária:

   ```sql
   shellR> mysqld --ndbcluster --server-id=3 \
                  --skip-slave-start &
   ```

4. Comece o servidor de replica secundária:

   ```sql
   shellR'> mysqld --ndbcluster --server-id=4 \
                   --skip-slave-start &
   ```

5. Por fim, inicie a replicação no canal primário executando a instrução `START SLAVE` na replica primária, conforme mostrado aqui:

   ```sql
   mysqlR> START SLAVE;
   ```

   Aviso

   Neste ponto, apenas o canal primário deve ser iniciado. O canal de replicação secundário deve ser iniciado apenas no caso de o canal primário de replicação falhar, conforme descrito em Seção 21.7.8, “Implementando o Failover com a Replicação de NDB Cluster”. Executar múltiplos canais de replicação simultaneamente pode resultar na criação de registros duplicados indesejados nas réplicas.

Como mencionado anteriormente, não é necessário habilitar o registro binário nas réplicas.
