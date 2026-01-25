#### 21.4.3.9 MySQL Server Options and Variables for NDB Cluster

Esta seção fornece informações sobre opções, variáveis de servidor e variáveis de status do MySQL Server específicas para o NDB Cluster. Para informações gerais sobre o uso destas, e para outras opções e variáveis não específicas do NDB Cluster, consulte [Section 5.1, “The MySQL Server”](mysqld-server.html "5.1 The MySQL Server").

Para parâmetros de configuração do NDB Cluster usados no arquivo de configuração do cluster (geralmente chamado `config.ini`), consulte [Section 21.4, “Configuration of NDB Cluster”](mysql-cluster-configuration.html "21.4 Configuration of NDB Cluster").

##### 21.4.3.9.1 MySQL Server Options for NDB Cluster

Esta seção fornece descrições das opções do MySQL Server ([**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server")) relacionadas ao NDB Cluster. Para obter informações sobre opções do [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") não específicas do NDB Cluster, e para informações gerais sobre o uso de opções com [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"), consulte [Section 5.1.6, “Server Command Options”](server-options.html "5.1.6 Server Command Options").

Para obter informações sobre opções de linha de comando usadas com outros processos do NDB Cluster, consulte [Section 21.5, “NDB Cluster Programs”](mysql-cluster-programs.html "21.5 NDB Cluster Programs").

* [`--ndbcluster`](mysql-cluster-options-variables.html#option_mysqld_ndbcluster)

  <table frame="box" rules="all" summary="Propriedades para ndbcluster"><thead><tr><th>Formato da Linha de Comando</th> <td><code>--ndbcluster[=value]</code></td> </tr><tr><th>Desabilitado por</th> <td><code>skip-ndbcluster</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></thead></table>

  O Storage Engine [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") é necessário para usar o NDB Cluster. Se um binário [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") incluir suporte para o Storage Engine [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), o engine estará desabilitado por padrão. Use a opção [`--ndbcluster`](mysql-cluster-options-variables.html#option_mysqld_ndbcluster) para habilitá-lo. Use `--skip-ndbcluster` para desabilitar o engine explicitamente.

  Não é necessário nem desejável usar esta opção juntamente com [`--initialize`](server-options.html#option_mysqld_initialize). A partir do NDB 7.5.4, `--ndbcluster` é ignorado (e o Storage Engine `NDB` *não* é habilitado) se `--initialize` também for usado. (Bug #81689, Bug #23518923)

* `--ndb-allow-copying-alter-table=[ON|OFF]`

  <table frame="box" rules="all" summary="Propriedades para ndb-allow-copying-alter-table"><thead><tr><th>Formato da Linha de Comando</th> <td><code>--ndb-allow-copying-alter-table[={OFF|ON}]</code></td> </tr><tr><th>Introduzido</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>Variável de Sistema</th> <td><code>ndb_allow_copying_alter_table</code></td> </tr><tr><th>Escopo</th> <td>Global, Session</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>

  Permite que [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") e outras instruções DDL usem operações de cópia em tabelas `NDB`. Defina como `OFF` para impedir que isso aconteça; isso pode melhorar o desempenho de aplicações críticas.

* `--ndb-batch-size=#`

  <table frame="box" rules="all" summary="Propriedades para ndb-batch-size"><thead><tr><th>Formato da Linha de Comando</th> <td><code>--ndb-batch-size</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>ndb_batch_size</code></td> </tr><tr><th>Escopo</th> <td>Global, Session</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>32768</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo (≥ 5.7.37-ndb-7.6.22)</th> <td><code>2147483648</code></td> </tr><tr><th>Valor Máximo (≥ 5.7.37-ndb-7.5.26)</th> <td><code>2147483648</code></td> </tr><tr><th>Valor Máximo (≤ 5.7.37-ndb-7.5.25)</th> <td><code>31536000</code></td> </tr><tr><th>Valor Máximo (≤ 5.7.37-ndb-7.6.21)</th> <td><code>31536000</code></td> </tr><tr><th>Valor Máximo</th> <td><code>31536000</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></thead></table>

  Define o tamanho em bytes usado para lotes (batches) de transações NDB.

* `--ndb-cluster-connection-pool=#`

  <table frame="box" rules="all" summary="Propriedades para ndb-cluster-connection-pool"><thead><tr><th>Formato da Linha de Comando</th> <td><code>--ndb-cluster-connection-pool</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>63</code></td> </tr></thead></table>

  Ao definir esta opção para um valor maior que 1 (o padrão), um processo [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") pode usar múltiplas conexões com o cluster, imitando efetivamente vários SQL nodes. Cada conexão requer sua própria seção `[api]` ou `[mysqld]` no arquivo de configuração do cluster (`config.ini`) e é contabilizada em relação ao número máximo de conexões API suportadas pelo cluster.

  Suponha que você tenha 2 hosts de cluster, cada um executando um SQL node cujo processo [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") foi iniciado com `--ndb-cluster-connection-pool=4`; isso significa que o cluster deve ter 8 slots API disponíveis para essas conexões (em vez de 2). Todas essas conexões são configuradas quando o SQL node se conecta ao cluster e são alocadas a Threads em um estilo Round-Robin.

  Esta opção é útil apenas ao executar [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") em hosts com múltiplas CPUs, múltiplos cores ou ambos. Para melhores resultados, o valor deve ser menor que o número total de cores disponíveis no host. Definir um valor maior do que isso pode degradar seriamente o desempenho.

  Importante

  Como cada SQL node que usa Pool de Conexões (Connection Pooling) ocupa múltiplos slots de nó API — cada slot tendo seu próprio Node ID no cluster — você *não* deve usar um Node ID como parte da string de conexão do cluster ao iniciar qualquer processo [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") que empregue Pool de Conexões.

  A definição de um Node ID na string de conexão ao usar a opção `--ndb-cluster-connection-pool` causa erros de alocação de Node ID quando o SQL node tenta se conectar ao cluster.

* `--ndb-cluster-connection-pool-nodeids=list`

  <table frame="box" rules="all" summary="Propriedades para ndb-cluster-connection-pool-nodeids"><thead><tr><th>Formato da Linha de Comando</th> <td><code>--ndb-cluster-connection-pool-nodeids</code></td> </tr><tr><th>Introduzido</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>Variável de Sistema (≥ 5.7.10-ndb-7.5.0)</th> <td><code>ndb_cluster_connection_pool_nodeids</code></td> </tr><tr><th>Escopo (≥ 5.7.10-ndb-7.5.0)</th> <td>Global</td> </tr><tr><th>Dinâmico (≥ 5.7.10-ndb-7.5.0)</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Set</td> </tr><tr><th>Valor Padrão</th> <td><code></code></td> </tr></thead></table>

  Especifica uma lista de Node IDs, separados por vírgula, para conexões com o cluster usadas por um SQL node. O número de nós nesta lista deve ser o mesmo que o valor definido para a opção [`--ndb-cluster-connection-pool`](mysql-cluster-options-variables.html#option_mysqld_ndb-cluster-connection-pool).

  `--ndb-cluster-connection-pool-nodeids` foi adicionado no NDB 7.5.0.

* `--ndb-blob-read-batch-bytes=bytes`

  <table frame="box" rules="all" summary="Propriedades para ndb-blob-read-batch-bytes"><thead><tr><th>Formato da Linha de Comando</th> <td><code>--ndb-blob-read-batch-bytes</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>ndb_blob_read_batch_bytes</code></td> </tr><tr><th>Escopo</th> <td>Global, Session</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>65536</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr></thead></table>

  Esta opção pode ser usada para definir o tamanho (em bytes) para o Batching de leituras de dados [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") em aplicações NDB Cluster. Quando este tamanho de Batch é excedido pela quantidade de dados [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") a ser lida dentro da transação atual, quaisquer operações de leitura [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") pendentes são executadas imediatamente.

  O valor máximo para esta opção é 4294967295; o padrão é 65536. Definir como 0 tem o efeito de desabilitar o Batching de leitura de [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types").

  Note

  Em aplicações NDB API, você pode controlar o Batching de escrita de [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") com os métodos [`setMaxPendingBlobReadBytes()`](/doc/ndbapi/en/ndb-ndbtransaction.html#ndb-ndbtransaction-setmaxpendingblobreadbytes) e [`getMaxPendingBlobReadBytes()`](/doc/ndbapi/en/ndb-ndbtransaction.html#ndb-ndbtransaction-getmaxpendingblobreadbytes).

* `--ndb-blob-write-batch-bytes=bytes`

  <table frame="box" rules="all" summary="Propriedades para ndb-blob-write-batch-bytes"><thead><tr><th>Formato da Linha de Comando</th> <td><code>--ndb-blob-write-batch-bytes</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>ndb_blob_write_batch_bytes</code></td> </tr><tr><th>Escopo</th> <td>Global, Session</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>65536</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></thead></table>

  Esta opção pode ser usada para definir o tamanho (em bytes) para o Batching de escritas de dados [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") em aplicações NDB Cluster. Quando este tamanho de Batch é excedido pela quantidade de dados [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") a ser escrita dentro da transação atual, quaisquer operações de escrita [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") pendentes são executadas imediatamente.

  O valor máximo para esta opção é 4294967295; o padrão é 65536. Definir como 0 tem o efeito de desabilitar o Batching de escrita de [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types").

  Note

  Em aplicações NDB API, você pode controlar o Batching de escrita de [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") com os métodos [`setMaxPendingBlobWriteBytes()`](/doc/ndbapi/en/ndb-ndbtransaction.html#ndb-ndbtransaction-setmaxpendingblobwritebytes) e [`getMaxPendingBlobWriteBytes()`](/doc/ndbapi/en/ndb-ndbtransaction.html#ndb-ndbtransaction-getmaxpendingblobwritebytes).

* `--ndb-connectstring=connection_string`

  <table frame="box" rules="all" summary="Propriedades para ndb-connectstring"><thead><tr><th>Formato da Linha de Comando</th> <td><code>--ndb-connectstring</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></thead></table>

  Ao usar o Storage Engine [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), esta opção especifica o Management Server que distribui os dados de configuração do cluster. Consulte [Section 21.4.3.3, “NDB Cluster Connection Strings”](mysql-cluster-connection-strings.html "21.4.3.3 NDB Cluster Connection Strings"), para a sintaxe.

* `--ndb-default-column-format=[FIXED|DYNAMIC]`

  <table frame="box" rules="all" summary="Propriedades para ndb-default-column-format"><thead><tr><th>Formato da Linha de Comando</th> <td><code>--ndb-default-column-format={FIXED|DYNAMIC}</code></td> </tr><tr><th>Introduzido</th> <td>5.7.11-ndb-7.5.1</td> </tr><tr><th>Variável de Sistema</th> <td><code>ndb_default_column_format</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeration</td> </tr><tr><th>Valor Padrão (≥ 5.7.16-ndb-7.5.4)</th> <td><code>FIXED</code></td> </tr><tr><th>Valor Padrão (≥ 5.7.11-ndb-7.5.1, ≤ 5.7.13-ndb-7.5.3)</th> <td><code>DYNAMIC</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>FIXED</code></p><p><code>DYNAMIC</code></p></td> </tr></thead></table>

  No NDB 7.5.1 e posterior, define o `COLUMN_FORMAT` e `ROW_FORMAT` padrão para novas tabelas (consulte [Section 13.1.18, “CREATE TABLE Statement”](create-table.html "13.1.18 CREATE TABLE Statement")).

  No NDB 7.5.1, o padrão para esta opção era `DYNAMIC`; no NDB 7.5.4, o padrão foi alterado para `FIXED` para manter a compatibilidade retroativa com séries de versões mais antigas (Bug #24487363).

* `--ndb-deferred-constraints=[0|1]`

  <table frame="box" rules="all" summary="Propriedades para ndb-deferred-constraints"><thead><tr><th>Formato da Linha de Comando</th> <td><code>--ndb-deferred-constraints</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>ndb_deferred_constraints</code></td> </tr><tr><th>Escopo</th> <td>Global, Session</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>0</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>1</code></td> </tr></thead></table>

  Controla se as verificações de Constraint em Unique Indexes são adiadas (deferred) até o momento do Commit, onde tais verificações são suportadas. `0` é o padrão.

  Esta opção não é normalmente necessária para a operação do NDB Cluster ou NDB Cluster Replication, e destina-se principalmente ao uso em testes.

* `--ndb-distribution=[KEYHASH|LINHASH]`

  <table frame="box" rules="all" summary="Propriedades para ndb-allow-copying-alter-table"><thead><tr><th>Formato da Linha de Comando</th> <td><code>--ndb-allow-copying-alter-table[={OFF|ON}]</code></td> </tr><tr><th>Introduzido</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>Variável de Sistema</th> <td><code>ndb_allow_copying_alter_table</code></td> </tr><tr><th>Escopo</th> <td>Global, Session</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>

  Controla o método de distribuição padrão para tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"). Pode ser definido como `KEYHASH` (hashing de chave) ou `LINHASH` (hashing linear). `KEYHASH` é o padrão.

* `--ndb-log-apply-status`

  <table frame="box" rules="all" summary="Propriedades para ndb-allow-copying-alter-table"><thead><tr><th>Formato da Linha de Comando</th> <td><code>--ndb-allow-copying-alter-table[={OFF|ON}]</code></td> </tr><tr><th>Introduzido</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>Variável de Sistema</th> <td><code>ndb_allow_copying_alter_table</code></td> </tr><tr><th>Escopo</th> <td>Global, Session</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>

  Faz com que um replica [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") registre quaisquer atualizações recebidas de sua Source imediata na tabela `mysql.ndb_apply_status` em seu próprio Binary Log, usando seu próprio Server ID em vez do Server ID da Source. Em uma configuração de replicação circular ou em cadeia, isso permite que tais atualizações se propaguem para as tabelas `mysql.ndb_apply_status` de quaisquer MySQL Servers configurados como replicas do [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") atual.

  Em uma configuração de replicação em cadeia, o uso desta opção permite que clusters downstream (replica) estejam cientes de suas posições em relação a todos os seus contribuidores upstream (Sources).

  Em uma configuração de replicação circular, esta opção faz com que as alterações nas tabelas `ndb_apply_status` completem todo o circuito, eventualmente se propagando de volta para o NDB Cluster de origem. Isso também permite que um cluster atuando como Source veja quando suas alterações (epochs) foram aplicadas aos outros clusters no círculo.

  Esta opção não tem efeito a menos que o MySQL Server seja iniciado com a opção [`--ndbcluster`](mysql-cluster-options-variables.html#option_mysqld_ndbcluster).

* `--ndb-log-empty-epochs=[ON|OFF]`

  <table frame="box" rules="all" summary="Propriedades para ndb-allow-copying-alter-table"><thead><tr><th>Formato da Linha de Comando</th> <td><code>--ndb-allow-copying-alter-table[={OFF|ON}]</code></td> </tr><tr><th>Introduzido</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>Variável de Sistema</th> <td><code>ndb_allow_copying_alter_table</code></td> </tr><tr><th>Escopo</th> <td>Global, Session</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>

  Faz com que os epochs durante os quais não houve alterações sejam escritos nas tabelas `ndb_apply_status` e `ndb_binlog_index`, mesmo quando [`log_slave_updates`](replication-options-binary-log.html#sysvar_log_slave_updates) está habilitado.

  Por padrão, esta opção está desabilitada. Desabilitar `--ndb-log-empty-epochs` faz com que as transações de epoch sem alterações não sejam escritas no Binary Log, embora uma linha ainda seja escrita mesmo para um epoch vazio em `ndb_binlog_index`.

  Como `--ndb-log-empty-epochs=1` faz com que o tamanho da tabela `ndb_binlog_index` aumente independentemente do tamanho do Binary Log, os usuários devem estar preparados para gerenciar o crescimento desta tabela, mesmo que esperem que o cluster fique ocioso por uma grande parte do tempo.

* `--ndb-log-empty-update=[ON|OFF]`

  <table frame="box" rules="all" summary="Propriedades para ndb-allow-copying-alter-table"><thead><tr><th>Formato da Linha de Comando</th> <td><code>--ndb-allow-copying-alter-table[={OFF|ON}]</code></td> </tr><tr><th>Introduzido</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>Variável de Sistema</th> <td><code>ndb_allow_copying_alter_table</code></td> </tr><tr><th>Escopo</th> <td>Global, Session</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>

  Faz com que as atualizações que não produziram alterações sejam escritas nas tabelas `ndb_apply_status` e `ndb_binlog_index`, mesmo quando [`log_slave_updates`](replication-options-binary-log.html#sysvar_log_slave_updates) estiver habilitado.

  Por padrão, esta opção está desabilitada (`OFF`). Desabilitar `--ndb-log-empty-update` faz com que as atualizações sem alterações não sejam escritas no Binary Log.

* `--ndb-log-exclusive-reads=[0|1]`

  <table frame="box" rules="all" summary="Propriedades para ndb-allow-copying-alter-table"><thead><tr><th>Formato da Linha de Comando</th> <td><code>--ndb-allow-copying-alter-table[={OFF|ON}]</code></td> </tr><tr><th>Introduzido</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>Variável de Sistema</th> <td><code>ndb_allow_copying_alter_table</code></td> </tr><tr><th>Escopo</th> <td>Global, Session</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>

  Iniciar o servidor com esta opção faz com que as leituras de Primary Key sejam registradas com Exclusive Locks, o que permite a detecção e resolução de conflitos de NDB Cluster Replication baseadas em conflitos de leitura. Você também pode habilitar e desabilitar esses Locks em tempo de execução definindo o valor da variável de sistema [`ndb_log_exclusive_reads`](mysql-cluster-options-variables.html#sysvar_ndb_log_exclusive_reads) como 1 ou 0, respectivamente. 0 (desabilitar Locks) é o padrão.

  Para mais informações, consulte [Read conflict detection and resolution](mysql-cluster-replication-conflict-resolution.html#conflict-resolution-read-conflicts "Read conflict detection and resolution").

* `--ndb-log-fail-terminate`

  <table frame="box" rules="all" summary="Propriedades para ndb-allow-copying-alter-table"><thead><tr><th>Formato da Linha de Comando</th> <td><code>--ndb-allow-copying-alter-table[={OFF|ON}]</code></td> </tr><tr><th>Introduzido</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>Variável de Sistema</th> <td><code>ndb_allow_copying_alter_table</code></td> </tr><tr><th>Escopo</th> <td>Global, Session</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>

  Quando esta opção é especificada, e o log completo de todos os eventos de linha encontrados não é possível, o processo [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") é encerrado.

* `--ndb-log-orig`

  <table frame="box" rules="all" summary="Propriedades para ndb-allow-copying-alter-table"><thead><tr><th>Formato da Linha de Comando</th> <td><code>--ndb-allow-copying-alter-table[={OFF|ON}]</code></td> </tr><tr><th>Introduzido</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>Variável de Sistema</th> <td><code>ndb_allow_copying_alter_table</code></td> </tr><tr><th>Escopo</th> <td>Global, Session</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>

  Registra o Server ID de origem e o epoch na tabela `ndb_binlog_index`.

  Note

  Isso torna possível para um determinado epoch ter múltiplas linhas em `ndb_binlog_index`, uma para cada epoch de origem.

  Para mais informações, consulte [Section 21.7.4, “NDB Cluster Replication Schema and Tables”](mysql-cluster-replication-schema.html "21.7.4 NDB Cluster Replication Schema and Tables").

* `--ndb-log-transaction-id`

  <table frame="box" rules="all" summary="Propriedades para ndb-allow-copying-alter-table"><thead><tr><th>Formato da Linha de Comando</th> <td><code>--ndb-allow-copying-alter-table[={OFF|ON}]</code></td> </tr><tr><th>Introduzido</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>Variável de Sistema</th> <td><code>ndb_allow_copying_alter_table</code></td> </tr><tr><th>Escopo</th> <td>Global, Session</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>

  Faz com que um replica [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") escreva o NDB Transaction ID em cada linha do Binary Log. Tal registro requer o uso do formato de evento Versão 2 para o Binary Log; assim, a variável de sistema [`log_bin_use_v1_row_events`](replication-options-binary-log.html#sysvar_log_bin_use_v1_row_events) deve ser desabilitada para usar esta opção.

  `--ndb-log-transaction-id` é necessário para habilitar a detecção e resolução de conflitos de NDB Cluster Replication usando a função `NDB$EPOCH_TRANS()` (consulte [NDB$EPOCH_TRANS()](mysql-cluster-replication-conflict-resolution.html#mysql-cluster-replication-ndb-epoch-trans "NDB$EPOCH_TRANS()")).

  Para mais informações, consulte [Section 21.7.11, “NDB Cluster Replication Conflict Resolution”](mysql-cluster-replication-conflict-resolution.html "21.7.11 NDB Cluster Replication Conflict Resolution").

* `--ndb-log-update-as-write`

  <table frame="box" rules="all" summary="Propriedades para ndb-allow-copying-alter-table"><thead><tr><th>Formato da Linha de Comando</th> <td><code>--ndb-allow-copying-alter-table[={OFF|ON}]</code></td> </tr><tr><th>Introduzido</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>Variável de Sistema</th> <td><code>ndb_allow_copying_alter_table</code></td> </tr><tr><th>Escopo</th> <td>Global, Session</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>

  Se as atualizações na Source são escritas no Binary Log como updates (`OFF`) ou writes (`ON`). Quando esta opção está habilitada, e [`--ndb-log-updated-only`](mysql-cluster-options-variables.html#option_mysqld_ndb-log-updated-only) e [`--ndb-log-update-minimal`](mysql-cluster-options-variables.html#option_mysqld_ndb-log-update-minimal) estão desabilitadas, as operações de diferentes tipos são registradas conforme a lista a seguir:

  + `INSERT`: Registrado como um evento `WRITE_ROW` sem before image; o after image é registrado com todas as colunas.

    `UPDATE`: Registrado como um evento `WRITE_ROW` sem before image; o after image é registrado com todas as colunas.

    `DELETE`: Registrado como um evento `DELETE_ROW` com todas as colunas registradas no before image; o after image não é registrado.

  Esta opção pode ser usada para resolução de conflitos de NDB Replication em combinação com as outras duas opções de log NDB mencionadas anteriormente; consulte [ndb_replication Table](mysql-cluster-replication-schema.html#ndb-replication-ndb-replication "ndb_replication Table"), para obter mais informações.

* `--ndb-log-updated-only`

  <table frame="box" rules="all" summary="Propriedades para ndb-allow-copying-alter-table"><thead><tr><th>Formato da Linha de Comando</th> <td><code>--ndb-allow-copying-alter-table[={OFF|ON}]</code></td> </tr><tr><th>Introduzido</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>Variável de Sistema</th> <td><code>ndb_allow_copying_alter_table</code></td> </tr><tr><th>Escopo</th> <td>Global, Session</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></thead></table>

  Se [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") escreve apenas atualizações (`ON`) ou linhas completas (`OFF`) no Binary Log. Quando esta opção está habilitada, e [`--ndb-log-update-as-write`](mysql-cluster-options-variables.html#option_mysqld_ndb-log-update-as-write) e [`--ndb-log-update-minimal`](mysql-cluster-options-variables.html#option_mysqld_ndb-log-update-minimal) estão desabilitadas, as operações de diferentes tipos são registradas conforme a lista a seguir:

  + `INSERT`: Registrado como um evento `WRITE_ROW` sem before image; o after image é registrado com todas as colunas.

  + `UPDATE`: Registrado como um evento `UPDATE_ROW` com colunas Primary Key e colunas atualizadas presentes tanto no before image quanto no after image.

  + `DELETE`: Registrado como um evento `DELETE_ROW` com colunas Primary Key incluídas no before image; o after image não é registrado.

  Esta opção pode ser usada para resolução de conflitos de NDB Replication em combinação com as outras duas opções de log NDB mencionadas anteriormente; consulte [ndb_replication Table](mysql-cluster-replication-schema.html#ndb-replication-ndb-replication "ndb_replication Table"), para obter mais informações sobre como essas opções interagem entre si.

* `--ndb-log-update-minimal`

  <table frame="box" rules="all" summary="Propriedades para ndb-batch-size"><thead><tr><th>Formato da Linha de Comando</th> <td><code>--ndb-batch-size</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>ndb_batch_size</code></td> </tr><tr><th>Escopo</th> <td>Global, Session</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>32768</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo (≥ 5.7.37-ndb-7.6.22)</th> <td><code>2147483648</code></td> </tr><tr><th>Valor Máximo (≥ 5.7.37-ndb-7.5.26)</th> <td><code>2147483648</code></td> </tr><tr><th>Valor Máximo (≤ 5.7.37-ndb-7.5.25)</th> <td><code>31536000</code></td> </tr><tr><th>Valor Máximo (≤ 5.7.37-ndb-7.6.21)</th> <td><code>31536000</code></td> </tr><tr><th>Valor Máximo</th> <td><code>31536000</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></thead></table>

  Registra atualizações de forma mínima, escrevendo apenas os valores da Primary Key no before image e apenas as colunas alteradas no after image. Isso pode causar problemas de compatibilidade se a replicação for para Storage Engines diferentes de `NDB`. Quando esta opção está habilitada, e [`--ndb-log-updated-only`](mysql-cluster-options-variables.html#option_mysqld_ndb-log-updated-only) e [`--ndb-log-update-as-write`](mysql-cluster-options-variables.html#option_mysqld_ndb-log-update-as-write) estão desabilitadas, as operações de diferentes tipos são registradas conforme a lista a seguir:

  + `INSERT`: Registrado como um evento `WRITE_ROW` sem before image; o after image é registrado com todas as colunas.

  + `UPDATE`: Registrado como um evento `UPDATE_ROW` com colunas Primary Key no before image; todas as colunas *exceto* as colunas Primary Key são registradas no after image.

  + `DELETE`: Registrado como um evento `DELETE_ROW` com todas as colunas no before image; o after image não é registrado.

  Esta opção pode ser usada para resolução de conflitos de NDB Replication em combinação com as outras duas opções de log NDB mencionadas anteriormente; consulte [ndb_replication Table](mysql-cluster-replication-schema.html#ndb-replication-ndb-replication "ndb_replication Table"), para obter mais informações.

* `--ndb-mgmd-host=host[:port]`

  <table frame="box" rules="all" summary="Propriedades para ndb-batch-size"><thead><tr><th>Formato da Linha de Comando</th> <td><code>--ndb-batch-size</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>ndb_batch_size</code></td> </tr><tr><th>Escopo</th> <td>Global, Session</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>32768</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo (≥ 5.7.37-ndb-7.6.22)</th> <td><code>2147483648</code></td> </tr><tr><th>Valor Máximo (≥ 5.7.37-ndb-7.5.26)</th> <td><code>2147483648</code></td> </tr><tr><th>Valor Máximo (≤ 5.7.37-ndb-7.5.25)</th> <td><code>31536000</code></td> </tr><tr><th>Valor Máximo (≤ 5.7.37-ndb-7.6.21)</th> <td><code>31536000</code></td> </tr><tr><th>Valor Máximo</th> <td><code>31536000</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></thead></table>

  Pode ser usado para definir o host e o número da porta de um único Management Server ao qual o programa deve se conectar. Se o programa exigir Node IDs ou referências a múltiplos Management Servers (ou ambos) em suas informações de conexão, use a opção [`--ndb-connectstring`](mysql-cluster-options-variables.html#option_mysqld_ndb-connectstring) em seu lugar.

* `--ndb-nodeid=#`

  <table frame="box" rules="all" summary="Propriedades para ndb-batch-size"><thead><tr><th>Formato da Linha de Comando</th> <td><code>--ndb-batch-size</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>ndb_batch_size</code></td> </tr><tr><th>Escopo</th> <td>Global, Session</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>32768</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo (≥ 5.7.37-ndb-7.6.22)</th> <td><code>2147483648</code></td> </tr><tr><th>Valor Máximo (≥ 5.7.37-ndb-7.5.26)</th> <td><code>2147483648</code></td> </tr><tr><th>Valor Máximo (≤ 5.7.37-ndb-7.5.25)</th> <td><code>31536000</code></td> </tr><tr><th>Valor Máximo (≤ 5.7.37-ndb-7.6.21)</th> <td><code>31536000</code></td> </tr><tr><th>Valor Máximo</th> <td><code>31536000</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></thead></table>

  Define o Node ID deste MySQL Server em um NDB Cluster.

  A opção `--ndb-nodeid` anula qualquer Node ID definido com [`--ndb-connectstring`](mysql-cluster-options-variables.html#option_mysqld_ndb-connectstring), independentemente da ordem em que as duas opções são usadas.

  Além disso, se `--ndb-nodeid` for usado, então um Node ID correspondente deve ser encontrado em uma seção `[mysqld]` ou `[api]` de `config.ini`, ou deve haver uma seção `[mysqld]` ou `[api]` "aberta" no arquivo (ou seja, uma seção sem um parâmetro `NodeId` ou `Id` especificado). Isso também é verdade se o Node ID for especificado como parte da string de conexão.

  Independentemente de como o Node ID é determinado, ele é mostrado como o valor da variável de status global `Ndb_cluster_node_id` na saída de [`SHOW STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), e como `cluster_node_id` na linha `connection` da saída de [`SHOW ENGINE NDBCLUSTER STATUS`](show-engine.html "13.7.5.15 SHOW ENGINE Statement").

  Para mais informações sobre Node IDs para SQL nodes do NDB Cluster, consulte [Section 21.4.3.7, “Defining SQL and Other API Nodes in an NDB Cluster”](mysql-cluster-api-definition.html "21.4.3.7 Defining SQL and Other API Nodes in an NDB Cluster").

* `--ndb-optimization-delay=milliseconds`

  <table frame="box" rules="all" summary="Propriedades para ndb-batch-size"><thead><tr><th>Formato da Linha de Comando</th> <td><code>--ndb-batch-size</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>ndb_batch_size</code></td> </tr><tr><th>Escopo</th> <td>Global, Session</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>32768</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo (≥ 5.7.37-ndb-7.6.22)</th> <td><code>2147483648</code></td> </tr><tr><th>Valor Máximo (≥ 5.7.37-ndb-7.5.26)</th> <td><code>2147483648</code></td> </tr><tr><th>Valor Máximo (≤ 5.7.37-ndb-7.5.25)</th> <td><code>31536000</code></td> </tr><tr><th>Valor Máximo (≤ 5.7.37-ndb-7.6.21)</th> <td><code>31536000</code></td> </tr><tr><th>Valor Máximo</th> <td><code>31536000</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></thead></table>

  Define o número de milissegundos de espera entre conjuntos de linhas pelas instruções [`OPTIMIZE TABLE`](optimize-table.html "13.7.2.4 OPTIMIZE TABLE Statement") em tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"). O padrão é 10.

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Propriedades para ndb-batch-size"><thead><tr><th>Formato da Linha de Comando</th> <td><code>--ndb-batch-size</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>ndb_batch_size</code></td> </tr><tr><th>Escopo</th> <td>Global, Session</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>32768</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo (≥ 5.7.37-ndb-7.6.22)</th> <td><code>2147483648</code></td> </tr><tr><th>Valor Máximo (≥ 5.7.37-ndb-7.5.26)</th> <td><code>2147483648</code></td> </tr><tr><th>Valor Máximo (≤ 5.7.37-ndb-7.5.25)</th> <td><code>31536000</code></td> </tr><tr><th>Valor Máximo (≤ 5.7.37-ndb-7.6.21)</th> <td><code>31536000</code></td> </tr><tr><th>Valor Máximo</th> <td><code>31536000</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></thead></table>

  Habilita otimizações para a seleção de nós para transações. Habilitado por padrão; use `--skip-ndb-optimized-node-selection` para desabilitar.

* `--ndb-transid-mysql-connection-map=state`

  <table frame="box" rules="all" summary="Propriedades para ndb-batch-size"><thead><tr><th>Formato da Linha de Comando</th> <td><code>--ndb-batch-size</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>ndb_batch_size</code></td> </tr><tr><th>Escopo</th> <td>Global, Session</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>32768</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo (≥ 5.7.37-ndb-7.6.22)</th> <td><code>2147483648</code></td> </tr><tr><th>Valor Máximo (≥ 5.7.37-ndb-7.5.26)</th> <td><code>2147483648</code></td> </tr><tr><th>Valor Máximo (≤ 5.7.37-ndb-7.5.25)</th> <td><code>31536000</code></td> </tr><tr><th>Valor Máximo (≤ 5.7.37-ndb-7.6.21)</th> <td><code>31536000</code></td> </tr><tr><th>Valor Máximo</th> <td><code>31536000</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></thead></table>

  Habilita ou desabilita o plugin que gerencia a tabela [`ndb_transid_mysql_connection_map`](information-schema-ndb-transid-mysql-connection-map-table.html "24.3.13 The INFORMATION_SCHEMA ndb_transid_mysql_connection_map Table") no Database `INFORMATION_SCHEMA`. Aceita um dos valores `ON`, `OFF` ou `FORCE`. `ON` (o padrão) habilita o plugin. `OFF` desabilita o plugin, o que torna `ndb_transid_mysql_connection_map` inacessível. `FORCE` impede que o MySQL Server inicie se o plugin falhar ao carregar e iniciar.

  Você pode verificar se o plugin da tabela [`ndb_transid_mysql_connection_map`](information-schema-ndb-transid-mysql-connection-map-table.html "24.3.13 The INFORMATION_SCHEMA ndb_transid_mysql_connection_map Table") está em execução verificando a saída de [`SHOW PLUGINS`](show-plugins.html "13.7.5.25 SHOW PLUGINS Statement").

* `--ndb-wait-connected=seconds`

  <table frame="box" rules="all" summary="Propriedades para ndb-batch-size"><thead><tr><th>Formato da Linha de Comando</th> <td><code>--ndb-batch-size</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>ndb_batch_size</code></td> </tr><tr><th>Escopo</th> <td>Global, Session</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>32768</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo (≥ 5.7.37-ndb-7.6.22)</th> <td><code>2147483648</code></td> </tr><tr><th>Valor Máximo (≥ 5.7.37-ndb-7.5.26)</th> <td><code>2147483648</code></td> </tr><tr><th>Valor Máximo (≤ 5.7.37-ndb-7.5.25)</th> <td><code>31536000</code></td> </tr><tr><th>Valor Máximo (≤ 5.7.37-ndb-7.6.21)</th> <td><code>31536000</code></td> </tr><tr><th>Valor Máximo</th> <td><code>31536000</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></thead></table>

  Esta opção define o período de tempo que o MySQL Server aguarda o estabelecimento de conexões com os Management Nodes e Data Nodes do NDB Cluster antes de aceitar conexões de clientes MySQL. O tempo é especificado em segundos. O valor padrão é `30`.

* `--ndb-wait-setup=seconds`

  <table frame="box" rules="all" summary="Propriedades para ndb-batch-size"><thead><tr><th>Formato da Linha de Comando</th> <td><code>--ndb-batch-size</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>ndb_batch_size</code></td> </tr><tr><th>Escopo</th> <td>Global, Session</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>32768</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo (≥ 5.7.37-ndb-7.6.22)</th> <td><code>2147483648</code></td> </tr><tr><th>Valor Máximo (≥ 5.7.37-ndb-7.5.26)</th> <td><code>2147483648</code></td> </tr><tr><th>Valor Máximo (≤ 5.7.37-ndb-7.5.25)</th> <td><code>31536000</code></td> </tr><tr><th>Valor Máximo (≤ 5.7.37-ndb-7.6.21)</th> <td><code>31536000</code></td> </tr><tr><th>Valor Máximo</th> <td><code>31536000</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></thead></table>

  Esta variável mostra o período de tempo que o MySQL Server aguarda a conclusão da configuração do Storage Engine [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") antes de atingir o Timeout e tratar o [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") como indisponível. O tempo é especificado em segundos. O valor padrão é `30`.

* `--skip-ndbcluster`

  <table frame="box" rules="all" summary="Propriedades para ndb-batch-size"><thead><tr><th>Formato da Linha de Comando</th> <td><code>--ndb-batch-size</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>ndb_batch_size</code></td> </tr><tr><th>Escopo</th> <td>Global, Session</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>32768</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo (≥ 5.7.37-ndb-7.6.22)</th> <td><code>2147483648</code></td> </tr><tr><th>Valor Máximo (≥ 5.7.37-ndb-7.5.26)</th> <td><code>2147483648</code></td> </tr><tr><th>Valor Máximo (≤ 5.7.37-ndb-7.5.25)</th> <td><code>31536000</code></td> </tr><tr><th>Valor Máximo (≤ 5.7.37-ndb-7.6.21)</th> <td><code>31536000</code></td> </tr><tr><th>Valor Máximo</th> <td><code>31536000</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></thead></table>

  Desabilita o Storage Engine [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"). Este é o padrão para binários que foram construídos com suporte ao Storage Engine [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"); o servidor aloca memória e outros recursos para este Storage Engine apenas se a opção [`--ndbcluster`](mysql-cluster-options-variables.html#option_mysqld_ndbcluster) for fornecida explicitamente. Consulte [Section 21.4.1, “Quick Test Setup of NDB Cluster”](mysql-cluster-quick.html "21.4.1 Quick Test Setup of NDB Cluster"), para um exemplo.

##### 21.4.3.9.2 NDB Cluster System Variables

Esta seção fornece informações detalhadas sobre as variáveis de sistema do MySQL Server que são específicas para o NDB Cluster e o Storage Engine [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"). Para variáveis de sistema não específicas do NDB Cluster, consulte [Section 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables"). Para informações gerais sobre o uso de variáveis de sistema, consulte [Section 5.1.8, “Using System Variables”](using-system-variables.html "5.1.8 Using System Variables").

* [`ndb_autoincrement_prefetch_sz`](mysql-cluster-options-variables.html#sysvar_ndb_autoincrement_prefetch_sz)

  <table frame="box" rules="all" summary="Propriedades para ndb-batch-size"><thead><tr><th>Formato da Linha de Comando</th> <td><code>--ndb-batch-size</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>ndb_batch_size</code></td> </tr><tr><th>Escopo</th> <td>Global, Session</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>32768</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo (≥ 5.7.37-ndb-7.6.22)</th> <td><code>2147483648</code></td> </tr><tr><th>Valor Máximo (≥ 5.7.37-ndb-7.5.26)</th> <td><code>2147483648</code></td> </tr><tr><th>Valor Máximo (≤ 5.7.37-ndb-7.5.25)</th> <td><code>31536000</code></td> </tr><tr><th>Valor Máximo (≤ 5.7.37-ndb-7.6.21)</th> <td><code>31536000</code></td> </tr><tr><th>Valor Máximo</th> <td><code>31536000</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></thead></table>

  Determina a probabilidade de lacunas em uma coluna autoincrementada. Defina como `1` para minimizar isso. Definir para um valor alto para otimização torna os Inserts mais rápidos, mas diminui a probabilidade de que números autoincrementais consecutivos sejam usados em um Batch de Inserts.

  Esta variável afeta apenas o número de IDs `AUTO_INCREMENT` que são buscados entre instruções; dentro de uma determinada instrução, pelo menos 32 IDs são obtidos por vez.

  Importante

  Esta variável não afeta os Inserts realizados usando [`INSERT ... SELECT`](insert-select.html "13.2.5.1 INSERT ... SELECT Statement").

* [`ndb_cache_check_time`](mysql-cluster-options-variables.html#sysvar_ndb_cache_check_time)

  <table frame="box" rules="all" summary="Propriedades para ndb-cluster-connection-pool"><thead><tr><th>Formato da Linha de Comando</th> <td><code>--ndb-cluster-connection-pool</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>63</code></td> </tr></thead></table>

  O número de milissegundos que se passam entre as verificações de SQL nodes do NDB Cluster pelo Query Cache do MySQL. Definir isso como 0 (o valor padrão e mínimo) significa que o Query Cache verifica a validação em cada Query.

  O valor máximo recomendado para esta variável é 1000, o que significa que a verificação é realizada uma vez por segundo. Um valor maior significa que a verificação é realizada e possivelmente invalidada devido a atualizações em diferentes SQL nodes com menos frequência. Geralmente, não é desejável definir isso para um valor maior que 2000.

  Note

  O Query Cache está descontinuado (deprecated) a partir do MySQL 5.7.20 e foi removido no MySQL 8.0. A descontinuação inclui [`ndb_cache_check_time`](mysql-cluster-options-variables.html#sysvar_ndb_cache_check_time).

* [`ndb_clear_apply_status`](mysql-cluster-options-variables.html#sysvar_ndb_clear_apply_status)

  <table frame="box" rules="all