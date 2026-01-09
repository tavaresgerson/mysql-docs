### 25.7.7 Usando Dois Canais de Replicação para a Replicação de NDB Cluster

Em um cenário de exemplo mais completo, imaginamos dois canais de replicação para fornecer redundância e, assim, proteger contra possíveis falhas de um único canal de replicação. Isso requer um total de quatro servidores de replicação, dois servidores de origem no cluster de origem e dois servidores de replica no cluster de replica. Para os fins da discussão a seguir, assumimos que identificadores únicos são atribuídos conforme mostrado aqui:

**Tabela 25.45 Servidores de replicação de NDB Cluster descritos no texto**

<table><thead><tr> <th>ID do Servidor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>1</td> <td>Origem - canal de replicação primário (<span class="emphasis"><em>S</em></span>)</td> </tr><tr> <td>2</td> <td>Origem - canal de replicação secundário (<span class="emphasis"><em>S'</em></span>)</td> </tr><tr> <td>3</td> <td>Replica - canal de replicação primário (<span class="emphasis"><em>R</em></span>)</td> </tr><tr> <td>4</td> <td>replica - canal de replicação secundário (<span class="emphasis"><em>R'</em></span>)</td> </tr></tbody></table>

Configurar a replicação com dois canais não é radicalmente diferente de configurar um único canal de replicação. Primeiro, os processos **mysqld** dos servidores de origem primária e secundária de replicação devem ser iniciados, seguidos pelos processos dos servidores primários e secundários de replica. Os processos de replicação podem ser iniciados emitindo a declaração `START REPLICA` em cada uma das replicas. Os comandos e a ordem em que eles precisam ser emitidos são mostrados aqui:

1. Inicie o servidor de origem de replicação primário:

   ```
   shellS> mysqld --ndbcluster --server-id=1 \
                  --log-bin &
   ```

2. Inicie o servidor de origem de replicação secundário:

   ```
   shellS'> mysqld --ndbcluster --server-id=2 \
                  --log-bin &
   ```

3. Inicie o servidor de replica primário:

4. Inicie o servidor de replica secundária:

   ```
   shellR> mysqld --ndbcluster --server-id=3 \
                  --skip-replica-start &
   ```

5. Por fim, inicie a replicação no canal primário executando a instrução `START REPLICA` no replica primário, conforme mostrado aqui:

   ```
   shellR'> mysqld --ndbcluster --server-id=4 \
                   --skip-replica-start &
   ```

   Aviso

   Neste ponto, apenas o canal primário deve ser iniciado. O canal de replica secundária só precisa ser iniciado caso o canal de replica primário falhe, conforme descrito na Seção 25.7.8, “Implementando Failover com Replicação de NDB Cluster”. Executar múltiplos canais de replicação simultaneamente pode resultar na criação de registros duplicados indesejados nas réplicas.

Como mencionado anteriormente, não é necessário habilitar o registro binário nas réplicas.