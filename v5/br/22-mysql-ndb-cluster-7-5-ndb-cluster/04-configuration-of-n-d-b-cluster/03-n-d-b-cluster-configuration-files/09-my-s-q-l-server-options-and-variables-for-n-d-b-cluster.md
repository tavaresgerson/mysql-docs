#### 21.4.3.9 Opções e variáveis do servidor MySQL para o NDB Cluster

Esta seção fornece informações sobre as opções do servidor MySQL, variáveis do servidor e de status específicas para o NDB Cluster. Para informações gerais sobre o uso dessas opções e variáveis, e para outras opções e variáveis que não são específicas para o NDB Cluster, consulte Seção 5.1, “O Servidor MySQL”.

Para os parâmetros de configuração do NDB Cluster usados no arquivo de configuração do cluster (geralmente chamado `config.ini`), consulte Seção 21.4, “Configuração do NDB Cluster”.

##### 21.4.3.9.1 Opções do Servidor MySQL para o NDB Cluster

Esta seção fornece descrições das opções do servidor **mysqld** relacionadas ao NDB Cluster. Para informações sobre as opções do **mysqld** que não são específicas do NDB Cluster, e para informações gerais sobre o uso de opções com **mysqld**, consulte Seção 5.1.6, “Opções de Comando do Servidor”.

Para obter informações sobre as opções de linha de comando usadas com outros processos do NDB Cluster, consulte Seção 21.5, "Programas do NDB Cluster".

- `--ndbcluster`

  <table frame="box" rules="all" summary="Propriedades para ndbcluster"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndbcluster[=valu<code class="literal">skip-ndbcluster</code></code>]]</td> </tr><tr><th>Incapaz de</th> <td>[[<code class="literal">skip-ndbcluster</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">OFF</code>]]</td> </tr></tbody></table>

  O mecanismo de armazenamento `NDBCLUSTER` é necessário para usar o NDB Cluster. Se um binário do **mysqld** incluir suporte ao mecanismo de armazenamento `NDBCLUSTER`, o mecanismo será desativado por padrão. Use a opção `--ndbcluster` para ativá-lo. Use `--skip-ndbcluster` para desativá-lo explicitamente.

  Não é necessário nem desejável usar essa opção junto com `--initialize`. A partir do NDB 7.5.4, o `--ndbcluster` é ignorado (e o mecanismo de armazenamento `NDB` *não* é habilitado) se `--initialize` também for usado. (Bug #81689, Bug #23518923)

- `--ndb-allow-copying-alter-table=[ON|OFF]`

  <table frame="box" rules="all" summary="Propriedades para ndb-allow-copying-alter-table"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-allow-copying-alter-table[={OFF|ON}]</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_allow_copying_alter_table</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">ON</code>]]</td> </tr></tbody></table>

  Deixe que as instruções DDL, como `ALTER TABLE` e outras, utilizem operações de cópia em tabelas `NDB`. Defina para `OFF` para evitar isso; isso pode melhorar o desempenho de aplicações críticas.

- `--ndb-batch-size=#`

  <table frame="box" rules="all" summary="Propriedades para ndb-batch-size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-batch-size</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">32768</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo (≥ 5.7.37-ndb-7.6.22)</th> <td>[[<code class="literal">2147483648</code>]]</td> </tr><tr><th>Valor máximo (≥ 5.7.37-ndb-7.5.26)</th> <td>[[<code class="literal">2147483648</code>]]</td> </tr><tr><th>Valor máximo (≤ 5.7.37-ndb-7.5.25)</th> <td>[[<code class="literal">31536000</code>]]</td> </tr><tr><th>Valor máximo (≤ 5.7.37-ndb-7.6.21)</th> <td>[[<code class="literal">31536000</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">31536000</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>

  Isso define o tamanho em bytes utilizado para os lotes de transações do NDB.

- `--ndb-cluster-connection-pool=#`

  <table frame="box" rules="all" summary="Propriedades para ndb-cluster-connection-pool"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-cluster-connection-pool</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_cluster_connection_pool</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_cluster_connection_pool</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">63</code>]]</td> </tr></tbody></table>

  Ao definir essa opção para um valor maior que 1 (o padrão), um processo **mysqld** pode usar múltiplas conexões ao clúster, imitando efetivamente vários nós SQL. Cada conexão requer sua própria seção `[api]` ou `[mysqld]` no arquivo de configuração do clúster (`config.ini`) e é contabilizada no número máximo de conexões API suportadas pelo clúster.

  Suponha que você tenha 2 computadores hospedeiros de cluster, cada um executando um nó SQL cujo processo **mysqld** foi iniciado com `--ndb-cluster-connection-pool=4`; isso significa que o cluster deve ter 8 slots de API disponíveis para essas conexões (em vez de 2). Todas essas conexões são configuradas quando o nó SQL se conecta ao cluster e são alocadas para threads de forma round-robin.

  Esta opção é útil apenas quando você está executando **mysqld** em máquinas hospedeiras com múltiplos CPUs, múltiplos núcleos ou ambos. Para obter os melhores resultados, o valor deve ser menor que o número total de núcleos disponíveis na máquina hospedeira. Definir um valor maior que este provavelmente degradará severamente o desempenho.

  Importante

  Como cada nó SQL que usa o pool de conexões ocupa vários slots de nó da API — cada slot tem seu próprio ID de nó no cluster —, você *não deve* usar um ID de nó como parte da string de conexão do cluster ao iniciar qualquer processo **mysqld** que utilize o pool de conexões.

  Definir um ID de nó na cadeia de conexão ao usar a opção `--ndb-cluster-connection-pool` causa erros de alocação de ID de nó quando o nó SQL tenta se conectar ao cluster.

- `--ndb-cluster-connection-pool-nodeids=list`

  <table frame="box" rules="all" summary="Propriedades para ndb-cluster-connection-pool-nodeids"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-cluster-connection-pool-nodeids</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>Variável do sistema (≥ 5.7.10-ndb-7.5.0)</th> <td>[[<code class="literal">ndb_cluster_connection_pool_nodeids</code>]]</td> </tr><tr><th>Âmbito (≥ 5.7.10-ndb-7.5.0)</th> <td>Global</td> </tr><tr><th>Dinâmico (≥ 5.7.10-ndb-7.5.0)</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Conjunto</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal"></code>]]</td> </tr></tbody></table>

  Especifica uma lista separada por vírgula de IDs de nó para conexões ao clúster usadas por um nó SQL. O número de nós nesta lista deve ser o mesmo que o valor definido para a opção `--ndb-cluster-connection-pool`.

  `--ndb-cluster-connection-pool-nodeids` foi adicionado no NDB 7.5.0.

- `--ndb-blob-read-batch-bytes=bytes`

  <table frame="box" rules="all" summary="Propriedades para ndb-blob-read-batch-bytes"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-blob-read-batch-bytes</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_blob_read_batch_bytes</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">65536</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr></tbody></table>

  Essa opção pode ser usada para definir o tamanho (em bytes) para o agrupamento de leituras de dados de `BLOB` em aplicativos do NDB Cluster. Quando esse tamanho de lote é excedido pela quantidade de dados de `BLOB` a serem lidos dentro da transação atual, quaisquer operações de leitura de `BLOB` pendentes são executadas imediatamente.

  O valor máximo para esta opção é 4294967295; o padrão é 65536. Definir para 0 desabilita o agrupamento em lote de leitura de `BLOB`.

  Nota

  Em aplicativos da API NDB, você pode controlar o agrupamento de escritas de `BLOB` com os métodos `setMaxPendingBlobReadBytes()` e `getMaxPendingBlobReadBytes()` (/doc/ndbapi/pt-BR/ndb-ndbtransaction.html#ndb-ndbtransaction-setmaxpendingblobreadbytes) e (/doc/ndbapi/pt-BR/ndb-ndbtransaction.html#ndb-ndbtransaction-getmaxpendingblobreadbytes).

- `--ndb-blob-write-batch-bytes=bytes`

  <table frame="box" rules="all" summary="Propriedades para ndb-blob-write-batch-bytes"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-blob-write-batch-bytes</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_blob_write_batch_bytes</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">65536</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>

  Essa opção pode ser usada para definir o tamanho (em bytes) para o agrupamento de escritas de dados de `BLOB` em aplicativos do NDB Cluster. Quando esse tamanho de lote é excedido pela quantidade de dados de `BLOB` a serem escritos na transação atual, quaisquer operações de escrita de `BLOB` pendentes são executadas imediatamente.

  O valor máximo para esta opção é 4294967295; o padrão é 65536. Definir para 0 desativa o agrupamento de lote de escrita de `BLOB`.

  Nota

  Em aplicativos da API NDB, você pode controlar o agrupamento de escrita de `BLOB` com os métodos `setMaxPendingBlobWriteBytes()` e `getMaxPendingBlobWriteBytes()` (/doc/ndbapi/pt-BR/ndb-ndbtransaction.html#ndb-ndbtransaction-setmaxpendingblobwritebytes) e (/doc/ndbapi/pt-BR/ndb-ndbtransaction.html#ndb-ndbtransaction-getmaxpendingblobwritebytes).

- `--ndb-connectstring=connection_string`

  <table frame="box" rules="all" summary="Propriedades para ndb-connectstring"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-connectstring</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Ao usar o mecanismo de armazenamento `NDBCLUSTER`, esta opção especifica o servidor de gerenciamento que distribui os dados de configuração do cluster. Consulte Seção 21.4.3.3, “Strings de Conexão do NDB Cluster” para a sintaxe.

- `--ndb-default-column-format=[FIXO|DINÂMICO]`

  <table frame="box" rules="all" summary="Propriedades para ndb-default-column-format"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-default-column-format={FIXED|DYNAMIC}</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.11-ndb-7.5.1</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal"><a class="link" href="mysql-cluster-options-variables.html#sysvar_ndb_default_column_format">ndb_default_column_format</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão (≥ 5.7.16-ndb-7.5.4)</th> <td>[[<code class="literal">FIXED</code>]]</td> </tr><tr><th>Valor padrão (≥ 5.7.11-ndb-7.5.1, ≤ 5.7.13-ndb-7.5.3)</th> <td>[[<code class="literal">DYNAMIC</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code class="literal">FIXED</code>]]</p><p class="valid-value">[[<code class="literal">DYNAMIC</code>]]</p></td> </tr></tbody></table>

  No NDB 7.5.1 e versões posteriores, define o `COLUMN_FORMAT` e `ROW_FORMAT` padrão para novas tabelas (consulte Seção 13.1.18, “Instrução CREATE TABLE”).

  No NDB 7.5.1, o padrão para essa opção era `DYNAMIC`; no NDB 7.5.4, o padrão foi alterado para `FIXED` para manter a compatibilidade reversa com séries de lançamentos anteriores (Bug #24487363).

- `--ndb-deferred-constraints=[0|1]`

  <table frame="box" rules="all" summary="Propriedades para ndb-deferred-constraints"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-deferred-constraints</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal"><a class="link" href="mysql-cluster-options-variables.html#sysvar_ndb_deferred_constraints">ndb_deferred_constraints</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">1</code>]]</td> </tr></tbody></table>

  Controla se as verificações de restrição em índices únicos são adiadas até o momento do commit, onde essas verificações são suportadas. `0` é o padrão.

  Essa opção normalmente não é necessária para o funcionamento do NDB Cluster ou da NDB Cluster Replication, e é destinada principalmente para uso em testes.

- `--ndb-distribution=[KEYHASH|LINHASH]`

  <table frame="box" rules="all" summary="Propriedades para ndb-allow-copying-alter-table"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-allow-copying-alter-table[={OFF|ON}]</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_allow_copying_alter_table</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">ON</code>]]</td> </tr></tbody></table>0

  Controla o método de distribuição padrão para tabelas de `NDB`. Pode ser definido como `KEYHASH` (hash de chave) ou `LINHASH` (hash linear). `KEYHASH` é o padrão.

- `--ndb-log-apply-status`

  <table frame="box" rules="all" summary="Propriedades para ndb-allow-copying-alter-table"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-allow-copying-alter-table[={OFF|ON}]</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_allow_copying_alter_table</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">ON</code>]]</td> </tr></tbody></table>1

  Faz com que uma replica **mysqld** registre quaisquer atualizações recebidas de sua fonte imediata na tabela `mysql.ndb_apply_status` em seu próprio log binário usando seu próprio ID de servidor, em vez do ID de servidor da fonte. Em um ambiente de replicação circular ou em cadeia, isso permite que essas atualizações se propague para as tabelas `mysql.ndb_apply_status` de quaisquer servidores MySQL configurados como réplicas do **mysqld** atual.

  Em uma configuração de replicação em cadeia, usar essa opção permite que os clusters descendentes (replica) estejam cientes de suas posições em relação a todos os seus contribuintes (fontes) ascendentes.

  Em uma configuração de replicação circular, essa opção faz com que as alterações nas tabelas `ndb_apply_status` completem o circuito inteiro, propagando-se eventualmente de volta ao NDB Cluster de origem. Isso também permite que um cluster que atua como fonte veja quando suas alterações (épocas) foram aplicadas aos outros clusters no círculo.

  Esta opção não tem efeito, a menos que o servidor MySQL seja iniciado com a opção `--ndbcluster`.

- `--ndb-log-empty-epochs=[ON|OFF]`

  <table frame="box" rules="all" summary="Propriedades para ndb-allow-copying-alter-table"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-allow-copying-alter-table[={OFF|ON}]</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_allow_copying_alter_table</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">ON</code>]]</td> </tr></tbody></table>2

  Causas épocas em que não houve alterações a serem escritas nas tabelas `ndb_apply_status` e `ndb_binlog_index`, mesmo quando o [`log_slave_updates`](https://pt.wikipedia.org/wiki/Replicação_de_log_bin%C3%A1rio#sysvar_log_slave_updates) está habilitado.

  Por padrão, essa opção está desativada. Desativar `--ndb-log-empty-epochs` faz com que as transações de época sem alterações não sejam escritas no log binário, embora uma linha ainda seja escrita, mesmo para uma época vazia no `ndb_binlog_index`.

  Como o `--ndb-log-empty-epochs=1` faz com que o tamanho da tabela `ndb_binlog_index` aumente independentemente do tamanho do log binário, os usuários devem estar preparados para gerenciar o crescimento dessa tabela, mesmo que esperem que o clúster esteja inativo grande parte do tempo.

- `--ndb-log-empty-update=[ON|OFF]`

  <table frame="box" rules="all" summary="Propriedades para ndb-allow-copying-alter-table"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-allow-copying-alter-table[={OFF|ON}]</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_allow_copying_alter_table</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">ON</code>]]</td> </tr></tbody></table>3

  As atualizações que não produziram alterações são escritas nas tabelas `ndb_apply_status` e `ndb_binlog_index`, quando o [`log_slave_updates`](https://pt.wikipedia.org/wiki/Replicação_de_bin%C3%A1rio#sysvar_log_slave_updates) está habilitado.

  Por padrão, essa opção está desativada (`OFF`). Desativar `--ndb-log-empty-update` faz com que as atualizações sem alterações não sejam escritas no log binário.

- `--ndb-log-exclusive-reads=[0|1]`

  <table frame="box" rules="all" summary="Propriedades para ndb-allow-copying-alter-table"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-allow-copying-alter-table[={OFF|ON}]</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_allow_copying_alter_table</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">ON</code>]]</td> </tr></tbody></table>4

  Iniciar o servidor com essa opção faz com que as leituras de chave primária sejam registradas com bloqueios exclusivos, o que permite a detecção e resolução de conflitos na replicação em cluster do NDB com base em conflitos de leitura. Você também pode habilitar e desabilitar esses bloqueios em tempo de execução, definindo o valor da variável de sistema `ndb_log_exclusive_reads` para 1 ou 0, respectivamente. 0 (desabilitar bloqueio) é o padrão.

  Para obter mais informações, consulte Leia sobre detecção e resolução de conflitos.

- `--ndb-log-fail-terminate`

  <table frame="box" rules="all" summary="Propriedades para ndb-allow-copying-alter-table"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-allow-copying-alter-table[={OFF|ON}]</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_allow_copying_alter_table</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">ON</code>]]</td> </tr></tbody></table>5

  Quando essa opção é especificada e o registro completo de todos os eventos de linha encontrados não for possível, o processo **mysqld** é encerrado.

- `--ndb-log-orig`

  <table frame="box" rules="all" summary="Propriedades para ndb-allow-copying-alter-table"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-allow-copying-alter-table[={OFF|ON}]</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_allow_copying_alter_table</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">ON</code>]]</td> </tr></tbody></table>6

  Registre o ID do servidor de origem e o epílogo na tabela `ndb_binlog_index`.

  Nota

  Isso permite que uma determinada época tenha múltiplas linhas no `ndb_binlog_index`, uma para cada época de origem.

  Para obter mais informações, consulte Seção 21.7.4, “Esquema e tabelas de replicação de cluster NDB”.

- `--ndb-log-transaction-id`

  <table frame="box" rules="all" summary="Propriedades para ndb-allow-copying-alter-table"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-allow-copying-alter-table[={OFF|ON}]</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_allow_copying_alter_table</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">ON</code>]]</td> </tr></tbody></table>7

  Faz com que a replica **mysqld** escreva o ID de transação NDB em cada linha do log binário. Esse registro requer o uso do formato de evento da versão 2 para o log binário; portanto, a variável de sistema `log_bin_use_v1_row_events` deve ser desativada para usar essa opção.

  `--ndb-log-transaction-id` é necessário para habilitar a detecção e resolução de conflitos da replicação do NDB Cluster usando a função `NDB$EPOCH_TRANS()` (veja NDB$EPOCH\_TRANS()).

  Para obter mais informações, consulte Seção 21.7.11, “Resolução de conflitos de replicação de cluster NDB”.

- `--ndb-log-update-as-write`

  <table frame="box" rules="all" summary="Propriedades para ndb-allow-copying-alter-table"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-allow-copying-alter-table[={OFF|ON}]</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_allow_copying_alter_table</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">ON</code>]]</td> </tr></tbody></table>8

  Se as atualizações na fonte forem escritas no log binário como atualizações (`OFF`) ou escritas (`ON`). Quando esta opção estiver habilitada e ambas as opções `--ndb-log-updated-only` e `--ndb-log-update-minimal` estiverem desativadas, as operações de diferentes tipos serão registradas conforme descrito na lista a seguir:

  - `INSERT`: Registrado como um evento `WRITE_ROW` sem imagem anterior; a imagem após é registrada com todas as colunas.

    `ATUALIZAÇÃO`: Registrada como um evento `WRITE_ROW` sem imagem anterior; a imagem após é registrada com todas as colunas.

    `DELETE`: Registrado como um evento `DELETE_ROW` com todas as colunas registradas na imagem anterior; a imagem após não é registrada.

  Essa opção pode ser usada para resolução de conflitos de replicação NDB em combinação com as outras duas opções de registro NDB mencionadas anteriormente; consulte tabela ndb\_replication para obter mais informações.

- `--ndb-log-updated-only`

  <table frame="box" rules="all" summary="Propriedades para ndb-allow-copying-alter-table"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-allow-copying-alter-table[={OFF|ON}]</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_allow_copying_alter_table</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">ON</code>]]</td> </tr></tbody></table>9

  Se **mysqld** escreve atualizações apenas (`ON`) ou linhas completas (`OFF`) no log binário. Quando esta opção está habilitada e ambas as opções `--ndb-log-update-as-write` e `--ndb-log-update-minimal` estão desativadas, as operações de diferentes tipos são registradas conforme descrito na lista a seguir

  - `INSERT`: Registrado como um evento `WRITE_ROW` sem imagem anterior; a imagem após é registrada com todas as colunas.

  - `ATUALIZAÇÃO`: Registrada como um evento `UPDATE_ROW` com colunas de chave primária e colunas atualizadas presentes tanto nas imagens antes quanto depois.

  - `DELETE`: Registrado como um evento `DELETE_ROW` com as colunas da chave primária incluídas na imagem anterior; a imagem após não é registrada.

  Essa opção pode ser usada para resolução de conflitos de replicação NDB em combinação com as outras duas opções de registro NDB mencionadas anteriormente; consulte tabela ndb\_replication para obter mais informações sobre como essas opções interagem entre si.

- `--ndb-log-update-minimal`

  <table frame="box" rules="all" summary="Propriedades para ndb-batch-size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-batch-size</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">32768</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo (≥ 5.7.37-ndb-7.6.22)</th> <td>[[<code class="literal">2147483648</code>]]</td> </tr><tr><th>Valor máximo (≥ 5.7.37-ndb-7.5.26)</th> <td>[[<code class="literal">2147483648</code>]]</td> </tr><tr><th>Valor máximo (≤ 5.7.37-ndb-7.5.25)</th> <td>[[<code class="literal">31536000</code>]]</td> </tr><tr><th>Valor máximo (≤ 5.7.37-ndb-7.6.21)</th> <td>[[<code class="literal">31536000</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">31536000</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>0

  Faça atualizações de log de forma mínima, escrevendo apenas os valores da chave primária na imagem anterior e apenas as colunas alteradas na imagem posterior. Isso pode causar problemas de compatibilidade se a replicação for para motores de armazenamento diferentes do `NDB`. Quando essa opção estiver habilitada e ambas as opções `--ndb-log-updated-only` e `--ndb-log-update-as-write` estiverem desativadas, as operações de diferentes tipos serão registradas conforme descrito na lista a seguir:

  - `INSERT`: Registrado como um evento `WRITE_ROW` sem imagem anterior; a imagem após é registrada com todas as colunas.

  - `ATUALIZAÇÃO`: Registrada como um evento `UPDATE_ROW` com as colunas da chave primária na imagem anterior; todas as colunas *exceto* as colunas da chave primária são registradas na imagem final.

  - `DELETE`: Registrado como um evento `DELETE_ROW` com todas as colunas da imagem anterior; a imagem após não é registrada.

  Essa opção pode ser usada para resolução de conflitos de replicação NDB em combinação com as outras duas opções de registro NDB mencionadas anteriormente; consulte tabela ndb\_replication para obter mais informações.

- `--ndb-mgmd-host=host[:port]`

  <table frame="box" rules="all" summary="Propriedades para ndb-batch-size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-batch-size</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">32768</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo (≥ 5.7.37-ndb-7.6.22)</th> <td>[[<code class="literal">2147483648</code>]]</td> </tr><tr><th>Valor máximo (≥ 5.7.37-ndb-7.5.26)</th> <td>[[<code class="literal">2147483648</code>]]</td> </tr><tr><th>Valor máximo (≤ 5.7.37-ndb-7.5.25)</th> <td>[[<code class="literal">31536000</code>]]</td> </tr><tr><th>Valor máximo (≤ 5.7.37-ndb-7.6.21)</th> <td>[[<code class="literal">31536000</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">31536000</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>1

  Pode ser usado para definir o número do host e do número de porta de um único servidor de gerenciamento para que o programa se conecte. Se o programa exigir IDs de nó ou referências a múltiplos servidores de gerenciamento (ou ambos) em suas informações de conexão, use a opção `--ndb-connectstring` em vez disso.

- `--ndb-nodeid=#`

  <table frame="box" rules="all" summary="Propriedades para ndb-batch-size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-batch-size</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">32768</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo (≥ 5.7.37-ndb-7.6.22)</th> <td>[[<code class="literal">2147483648</code>]]</td> </tr><tr><th>Valor máximo (≥ 5.7.37-ndb-7.5.26)</th> <td>[[<code class="literal">2147483648</code>]]</td> </tr><tr><th>Valor máximo (≤ 5.7.37-ndb-7.5.25)</th> <td>[[<code class="literal">31536000</code>]]</td> </tr><tr><th>Valor máximo (≤ 5.7.37-ndb-7.6.21)</th> <td>[[<code class="literal">31536000</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">31536000</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>2

  Defina o ID de nó deste servidor MySQL em um NDB Cluster.

  A opção `--ndb-nodeid` substitui qualquer ID de nó definida com `--ndb-connectstring` (mysql-cluster-options-variables.html#option\_mysqld\_ndb-connectstring), independentemente da ordem em que as duas opções são usadas.

  Além disso, se `--ndb-nodeid` for usado, então deve-se encontrar um ID de nó correspondente em uma seção `[mysqld]` ou `[api]` do `config.ini`, ou deve haver uma seção `[mysqld]` ou `[api]` “aberta” no arquivo (ou seja, uma seção sem um parâmetro `NodeId` ou `Id` especificado). Isso também é verdadeiro se o ID do nó for especificado como parte da string de conexão.

  Independentemente de como o ID do nó é determinado, ele é exibido como o valor da variável de status global `Ndb_cluster_node_id` na saída de `SHOW STATUS`, e como `cluster_node_id` na linha `connection` da saída de `SHOW ENGINE NDBCLUSTER STATUS`.

  Para obter mais informações sobre os IDs de nós para nós SQL do NDB Cluster, consulte Seção 21.4.3.7, “Definindo nós SQL e outros nós de API em um NDB Cluster”.

- `--ndb-optimization-delay=milésimos`

  <table frame="box" rules="all" summary="Propriedades para ndb-batch-size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-batch-size</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">32768</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo (≥ 5.7.37-ndb-7.6.22)</th> <td>[[<code class="literal">2147483648</code>]]</td> </tr><tr><th>Valor máximo (≥ 5.7.37-ndb-7.5.26)</th> <td>[[<code class="literal">2147483648</code>]]</td> </tr><tr><th>Valor máximo (≤ 5.7.37-ndb-7.5.25)</th> <td>[[<code class="literal">31536000</code>]]</td> </tr><tr><th>Valor máximo (≤ 5.7.37-ndb-7.6.21)</th> <td>[[<code class="literal">31536000</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">31536000</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>3

  Defina o número de milissegundos para esperar entre conjuntos de linhas por instruções `OPTIMIZE TABLE` em tabelas de `NDB`. O valor padrão é 10.

- `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Propriedades para ndb-batch-size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-batch-size</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">32768</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo (≥ 5.7.37-ndb-7.6.22)</th> <td>[[<code class="literal">2147483648</code>]]</td> </tr><tr><th>Valor máximo (≥ 5.7.37-ndb-7.5.26)</th> <td>[[<code class="literal">2147483648</code>]]</td> </tr><tr><th>Valor máximo (≤ 5.7.37-ndb-7.5.25)</th> <td>[[<code class="literal">31536000</code>]]</td> </tr><tr><th>Valor máximo (≤ 5.7.37-ndb-7.6.21)</th> <td>[[<code class="literal">31536000</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">31536000</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>4

  Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

- `--ndb-transid-mysql-connection-map=estado`

  <table frame="box" rules="all" summary="Propriedades para ndb-batch-size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-batch-size</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">32768</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo (≥ 5.7.37-ndb-7.6.22)</th> <td>[[<code class="literal">2147483648</code>]]</td> </tr><tr><th>Valor máximo (≥ 5.7.37-ndb-7.5.26)</th> <td>[[<code class="literal">2147483648</code>]]</td> </tr><tr><th>Valor máximo (≤ 5.7.37-ndb-7.5.25)</th> <td>[[<code class="literal">31536000</code>]]</td> </tr><tr><th>Valor máximo (≤ 5.7.37-ndb-7.6.21)</th> <td>[[<code class="literal">31536000</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">31536000</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>5

  Habilita ou desabilita o plugin que lida com a tabela `ndb_transid_mysql_connection_map` no banco de dados `INFORMATION_SCHEMA`. Recebe um dos valores `ON`, `OFF` ou `FORCE`. `ON` (o padrão) habilita o plugin. `OFF` desabilita o plugin, tornando o `ndb_transid_mysql_connection_map` inacessível. `FORCE` impede que o MySQL Server seja iniciado se o plugin não conseguir ser carregado e iniciado.

  Você pode verificar se o plugin da tabela `ndb_transid_mysql_connection_map` está em execução verificando a saída do `SHOW PLUGINS`.

- `--ndb-wait-connected=segundos`

  <table frame="box" rules="all" summary="Propriedades para ndb-batch-size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-batch-size</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">32768</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo (≥ 5.7.37-ndb-7.6.22)</th> <td>[[<code class="literal">2147483648</code>]]</td> </tr><tr><th>Valor máximo (≥ 5.7.37-ndb-7.5.26)</th> <td>[[<code class="literal">2147483648</code>]]</td> </tr><tr><th>Valor máximo (≤ 5.7.37-ndb-7.5.25)</th> <td>[[<code class="literal">31536000</code>]]</td> </tr><tr><th>Valor máximo (≤ 5.7.37-ndb-7.6.21)</th> <td>[[<code class="literal">31536000</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">31536000</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>6

  Esta opção define o período de tempo que o servidor MySQL espera para que as conexões ao NDB Cluster e aos nós de dados sejam estabelecidas antes de aceitar as conexões dos clientes MySQL. O tempo é especificado em segundos. O valor padrão é `30`.

- `--ndb-wait-setup=segundos`

  <table frame="box" rules="all" summary="Propriedades para ndb-batch-size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-batch-size</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">32768</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo (≥ 5.7.37-ndb-7.6.22)</th> <td>[[<code class="literal">2147483648</code>]]</td> </tr><tr><th>Valor máximo (≥ 5.7.37-ndb-7.5.26)</th> <td>[[<code class="literal">2147483648</code>]]</td> </tr><tr><th>Valor máximo (≤ 5.7.37-ndb-7.5.25)</th> <td>[[<code class="literal">31536000</code>]]</td> </tr><tr><th>Valor máximo (≤ 5.7.37-ndb-7.6.21)</th> <td>[[<code class="literal">31536000</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">31536000</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>7

  Esta variável indica o período de tempo que o servidor MySQL espera para que o mecanismo de armazenamento `NDB` seja concluído antes de expirar o tempo e tratar o `NDB` como indisponível. O tempo é especificado em segundos. O valor padrão é `30`.

- `--skip-ndbcluster`

  <table frame="box" rules="all" summary="Propriedades para ndb-batch-size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-batch-size</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">32768</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo (≥ 5.7.37-ndb-7.6.22)</th> <td>[[<code class="literal">2147483648</code>]]</td> </tr><tr><th>Valor máximo (≥ 5.7.37-ndb-7.5.26)</th> <td>[[<code class="literal">2147483648</code>]]</td> </tr><tr><th>Valor máximo (≤ 5.7.37-ndb-7.5.25)</th> <td>[[<code class="literal">31536000</code>]]</td> </tr><tr><th>Valor máximo (≤ 5.7.37-ndb-7.6.21)</th> <td>[[<code class="literal">31536000</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">31536000</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>8

  Desative o mecanismo de armazenamento `NDBCLUSTER`. Este é o padrão para binários que foram compilados com suporte ao mecanismo de armazenamento `NDBCLUSTER`; o servidor aloca memória e outros recursos apenas para este mecanismo de armazenamento se a opção `--ndbcluster` for fornecida explicitamente. Veja Seção 21.4.1, “Configuração rápida do NDB Cluster” para um exemplo.

##### 21.4.3.9.2 Variáveis do Sistema de Clúster do NDB

Esta seção fornece informações detalhadas sobre as variáveis do sistema do servidor MySQL que são específicas do NDB Cluster e do mecanismo de armazenamento `NDB`. Para variáveis do sistema que não são específicas do NDB Cluster, consulte Seção 5.1.7, “Variáveis do Sistema do Servidor”. Para informações gerais sobre o uso de variáveis do sistema, consulte Seção 5.1.8, “Usando Variáveis do Sistema”.

- `ndb_autoincrement_prefetch_sz`

  <table frame="box" rules="all" summary="Propriedades para ndb-batch-size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-batch-size</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">32768</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo (≥ 5.7.37-ndb-7.6.22)</th> <td>[[<code class="literal">2147483648</code>]]</td> </tr><tr><th>Valor máximo (≥ 5.7.37-ndb-7.5.26)</th> <td>[[<code class="literal">2147483648</code>]]</td> </tr><tr><th>Valor máximo (≤ 5.7.37-ndb-7.5.25)</th> <td>[[<code class="literal">31536000</code>]]</td> </tr><tr><th>Valor máximo (≤ 5.7.37-ndb-7.6.21)</th> <td>[[<code class="literal">31536000</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">31536000</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>9

  Determina a probabilidade de lacunas em uma coluna autoincrementada. Defina-o para `1` para minimizar isso. Definir um valor alto para otimização torna as inserções mais rápidas, mas diminui a probabilidade de números consecutivos de autoincremento serem usados em um lote de inserções.

  Essa variável afeta apenas o número de IDs `AUTO_INCREMENT` que são obtidos entre as instruções; dentro de uma determinada instrução, pelo menos 32 IDs são obtidos de cada vez.

  Importante

  Essa variável não afeta os insertos realizados usando `INSERT ... SELECT`.

- `ndb_cache_check_time`

  <table frame="box" rules="all" summary="Propriedades para ndb-cluster-connection-pool"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-cluster-connection-pool</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_cluster_connection_pool</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_cluster_connection_pool</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">63</code>]]</td> </tr></tbody></table>0

  O número de milissegundos que passam entre as verificações dos nós do NDB Cluster SQL pelo cache de consultas do MySQL. Definir esse valor para 0 (o valor padrão e mínimo) significa que o cache de consultas verifica a validação em cada consulta.

  O valor máximo recomendado para essa variável é 1000, o que significa que a verificação é realizada uma vez por segundo. Um valor maior indica que a verificação é realizada e, possivelmente, invalidada devido a atualizações em diferentes nós do SQL com menos frequência. Geralmente, não é desejável definir esse valor para um valor maior que 2000.

  Nota

  O cache de consultas é descontinuado a partir do MySQL 5.7.20 e será removido no MySQL 8.0. A descontinuidade inclui `ndb_cache_check_time`.

- `ndb_clear_apply_status`

  <table frame="box" rules="all" summary="Propriedades para ndb-cluster-connection-pool"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-cluster-connection-pool</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_cluster_connection_pool</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_cluster_connection_pool</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">63</code>]]</td> </tr></tbody></table>1

  Por padrão, a execução de `RESET SLAVE` faz com que uma replica do NDB Cluster apague todas as linhas da tabela `ndb_apply_status`. Você pode desabilitar isso configurando `ndb_clear_apply_status=OFF`.

- `ndb_data_node_neighbour`

  <table frame="box" rules="all" summary="Propriedades para ndb-cluster-connection-pool"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-cluster-connection-pool</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_cluster_connection_pool</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_cluster_connection_pool</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">63</code>]]</td> </tr></tbody></table>2

  Define o ID de um nó de dados "mais próximo" — ou seja, um nó de dados não local preferido é escolhido para executar a transação, em vez de um que esteja executando no mesmo host que o nó SQL ou API. Isso costumava garantir que, quando uma tabela totalmente replicada é acessada, acessamos-a neste nó de dados, para garantir que a cópia local da tabela seja sempre usada sempre que possível. Isso também pode ser usado para fornecer dicas para transações.

  Isso pode melhorar os tempos de acesso aos dados no caso de um nó que está fisicamente mais próximo e, portanto, tem maior capacidade de transferência de rede do que outros no mesmo host.

  Consulte Seção 13.1.18.9, “Definindo opções de comentário do NDB” para obter mais informações.

  Adicionado em NDB 7.5.2.

  Nota

  Um método equivalente `set_data_node_neighbour()` é fornecido para uso em aplicativos da API NDB.

- `ndb_default_column_format`

  <table frame="box" rules="all" summary="Propriedades para ndb-cluster-connection-pool"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-cluster-connection-pool</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_cluster_connection_pool</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_cluster_connection_pool</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">63</code>]]</td> </tr></tbody></table>3

  No NDB 7.5.1 e versões posteriores, define o `COLUMN_FORMAT` e `ROW_FORMAT` padrão para novas tabelas (consulte Seção 13.1.18, “Instrução CREATE TABLE”).

  No NDB 7.5.1, o padrão para essa variável era `DYNAMIC`; no NDB 7.5.4, o padrão foi alterado para `FIXED` para manter a compatibilidade reversa com séries de lançamentos anteriores (Bug #24487363).

- `ndb_deferred_constraints`

  <table frame="box" rules="all" summary="Propriedades para ndb-cluster-connection-pool"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-cluster-connection-pool</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_cluster_connection_pool</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_cluster_connection_pool</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">63</code>]]</td> </tr></tbody></table>4

  Controla se as verificações de restrição são adiadas ou não, onde essas são suportadas. `0` é o padrão.

  Essa variável normalmente não é necessária para o funcionamento do NDB Cluster ou da NDB Cluster Replication, e é destinada principalmente para uso em testes.

- `ndb_distribution`

  <table frame="box" rules="all" summary="Propriedades para ndb-cluster-connection-pool"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-cluster-connection-pool</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_cluster_connection_pool</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_cluster_connection_pool</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">63</code>]]</td> </tr></tbody></table>5

  Controla o método de distribuição padrão para tabelas de `NDB`. Pode ser definido como `KEYHASH` (hash de chave) ou `LINHASH` (hash linear). `KEYHASH` é o padrão.

- `ndb_eventbuffer_free_percent`

  <table frame="box" rules="all" summary="Propriedades para ndb-cluster-connection-pool"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-cluster-connection-pool</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_cluster_connection_pool</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_cluster_connection_pool</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">63</code>]]</td> </tr></tbody></table>6

  Define a porcentagem da memória máxima alocada para o buffer de eventos (ndb\_eventbuffer\_max\_alloc) que deve estar disponível no buffer de eventos após atingir o máximo, antes de começar a bufferizar novamente.

- `ndb_eventbuffer_max_alloc`

  <table frame="box" rules="all" summary="Propriedades para ndb-cluster-connection-pool"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-cluster-connection-pool</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_cluster_connection_pool</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_cluster_connection_pool</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">63</code>]]</td> </tr></tbody></table>7

  Define o valor máximo de memória (em bytes) que pode ser alocado para o buffer de eventos pela API NDB. 0 significa que não há limite imposto e é o valor padrão.

- `ndb_extra_logging`

  <table frame="box" rules="all" summary="Propriedades para ndb-cluster-connection-pool"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-cluster-connection-pool</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_cluster_connection_pool</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_cluster_connection_pool</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">63</code>]]</td> </tr></tbody></table>8

  Essa variável permite a gravação no log de erro do MySQL de informações específicas do mecanismo de armazenamento `NDB`.

  Quando essa variável é definida como 0, a única informação específica do `NDB` que é escrita no log de erro do MySQL está relacionada ao gerenciamento de transações. Se o valor for maior que 0, mas menor que 10, o esquema da tabela `NDB` e os eventos de conexão também são registrados, bem como se a resolução de conflitos está em uso ou não, e outros erros e informações do `NDB`. Se o valor for definido como 10 ou mais, informações sobre o `NDB` interno, como o progresso da distribuição de dados entre os nós do cluster, também são escritas no log de erro do MySQL. O valor padrão é 1.

- `ndb_force_send`

  <table frame="box" rules="all" summary="Propriedades para ndb-cluster-connection-pool"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-cluster-connection-pool</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_cluster_connection_pool</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_cluster_connection_pool</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">63</code>]]</td> </tr></tbody></table>9

  Força o envio de buffers para `NDB` imediatamente, sem esperar por outros threads. A opção padrão é `ON`.

- `ndb_fully_replicated`

  <table frame="box" rules="all" summary="Propriedades para ndb-cluster-connection-pool-nodeids"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-cluster-connection-pool-nodeids</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>Variável do sistema (≥ 5.7.10-ndb-7.5.0)</th> <td>[[<code class="literal">ndb_cluster_connection_pool_nodeids</code>]]</td> </tr><tr><th>Âmbito (≥ 5.7.10-ndb-7.5.0)</th> <td>Global</td> </tr><tr><th>Dinâmico (≥ 5.7.10-ndb-7.5.0)</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Conjunto</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal"></code>]]</td> </tr></tbody></table>0

  Determina se novas tabelas `NDB` são replicadas completamente. Essa configuração pode ser substituída para uma tabela individual usando `COMMENT="NDB_TABLE=FULLY_REPLICATED=..."` em uma instrução `CREATE TABLE` ou `ALTER TABLE`; consulte Seção 13.1.18.9, “Definindo Opções de Comentário NDB”, para sintaxe e outras informações.

  Adicionado em NDB 7.5.2.

- `ndb_index_stat_enable`

  <table frame="box" rules="all" summary="Propriedades para ndb-cluster-connection-pool-nodeids"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-cluster-connection-pool-nodeids</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>Variável do sistema (≥ 5.7.10-ndb-7.5.0)</th> <td>[[<code class="literal">ndb_cluster_connection_pool_nodeids</code>]]</td> </tr><tr><th>Âmbito (≥ 5.7.10-ndb-7.5.0)</th> <td>Global</td> </tr><tr><th>Dinâmico (≥ 5.7.10-ndb-7.5.0)</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Conjunto</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal"></code>]]</td> </tr></tbody></table>1

  Use as estatísticas do índice `NDB` na otimização de consultas. O padrão é `ON`.

- `ndb_index_stat_option`

  <table frame="box" rules="all" summary="Propriedades para ndb-cluster-connection-pool-nodeids"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-cluster-connection-pool-nodeids</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>Variável do sistema (≥ 5.7.10-ndb-7.5.0)</th> <td>[[<code class="literal">ndb_cluster_connection_pool_nodeids</code>]]</td> </tr><tr><th>Âmbito (≥ 5.7.10-ndb-7.5.0)</th> <td>Global</td> </tr><tr><th>Dinâmico (≥ 5.7.10-ndb-7.5.0)</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Conjunto</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal"></code>]]</td> </tr></tbody></table>2

  Esta variável é usada para fornecer opções de ajuste para a geração de estatísticas de índice NDB. A lista consiste em pares de nomes e valores separados por vírgula de nomes de opções e valores, e essa lista não deve conter nenhum caractere de espaço.

  As opções não utilizadas ao configurar `ndb_index_stat_option` não são alteradas de seus valores padrão. Por exemplo, você pode definir `ndb_index_stat_option = 'loop_idle=1000ms,cache_limit=32M'`.

  Os valores de tempo podem ser sufixados com `h` (horas), `m` (minutos) ou `s` (segundos). Os valores de milissegundos podem ser especificados opcionalmente usando `ms`; valores de milissegundos não podem ser especificados usando `h`, `m` ou `s`. Valores inteiros podem ser sufixados com `K`, `M` ou `G`.

  Os nomes das opções que podem ser definidos usando essa variável estão mostrados na tabela a seguir. A tabela também fornece descrições breves das opções, seus valores padrão e (quando aplicável) seus valores mínimo e máximo.

  **Tabela 21.18 ndb\_index\_stat\_option opções e valores**

  <table frame="box" rules="all" summary="Propriedades para ndb-cluster-connection-pool-nodeids"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-cluster-connection-pool-nodeids</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>Variável do sistema (≥ 5.7.10-ndb-7.5.0)</th> <td>[[<code class="literal">ndb_cluster_connection_pool_nodeids</code>]]</td> </tr><tr><th>Âmbito (≥ 5.7.10-ndb-7.5.0)</th> <td>Global</td> </tr><tr><th>Dinâmico (≥ 5.7.10-ndb-7.5.0)</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Conjunto</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal"></code>]]</td> </tr></tbody></table>3

- `ndb_join_pushdown`

  <table frame="box" rules="all" summary="Propriedades para ndb-cluster-connection-pool-nodeids"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-cluster-connection-pool-nodeids</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>Variável do sistema (≥ 5.7.10-ndb-7.5.0)</th> <td>[[<code class="literal">ndb_cluster_connection_pool_nodeids</code>]]</td> </tr><tr><th>Âmbito (≥ 5.7.10-ndb-7.5.0)</th> <td>Global</td> </tr><tr><th>Dinâmico (≥ 5.7.10-ndb-7.5.0)</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Conjunto</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal"></code>]]</td> </tr></tbody></table>4

  Esta variável controla se as junções nas tabelas de `NDB` são impulsionadas para o kernel NDB (nós de dados). Anteriormente, uma junção era tratada usando múltiplos acessos de `NDB` pelo nó SQL; no entanto, quando `ndb_join_pushdown` é habilitado, uma junção impulsionável é enviada na íntegra para os nós de dados, onde pode ser distribuída entre os nós de dados e executada em paralelo em múltiplas cópias dos dados, com um único resultado consolidado sendo retornado para **mysqld**. Isso pode reduzir muito o número de viagens entre um nó SQL e os nós de dados necessárias para lidar com uma junção assim.

  Por padrão, `ndb_join_pushdown` está habilitado.

  **Condições para junções pushdown do NDB.** Para que uma junção seja pushável, ela deve atender às seguintes condições:

  1. Apenas as colunas podem ser comparadas, e todas as colunas a serem unidas devem usar *exatamente* o mesmo tipo de dado.

     Isso significa que expressões como `t1.a = t2.a + constante` não podem ser empurradas para baixo, e que, por exemplo, uma junção em uma coluna de tipo `INT` e uma coluna de tipo `BIGINT` também não podem ser empurradas para baixo.

  2. As consultas que fazem referência às colunas `BLOB` ou `TEXT` não são suportadas.

  3. O bloqueio explícito não é suportado; no entanto, o bloqueio implícito baseado em linhas, uma característica do mecanismo de armazenamento `NDB`, é aplicado.

     Isso significa que uma junção usando `FOR UPDATE` não pode ser empurrada para baixo.

  4. Para que uma junção seja impulsionada, as tabelas subordinadas na junção devem ser acessadas usando um dos métodos de acesso `ref`, `eq_ref` ou `const` ou alguma combinação desses métodos.

     As tabelas filhas externas podem ser empurradas apenas usando `eq_ref`.

     Se a raiz da junção empurrada for um `eq_ref` ou `const`, apenas as tabelas filhas conectadas por `eq_ref` podem ser anexadas. (Uma tabela conectada por `ref` provavelmente se tornará a raiz de outra junção empurrada.)

     Se o otimizador de consultas decidir usar o cache de junção para uma tabela filha candidata, essa tabela não pode ser empurrada como filha. No entanto, ela pode ser a raiz de outro conjunto de tabelas empurradas.

  5. As junções que fazem referência a tabelas explicitamente particionadas por `[LINEAR] HASH`, `LIST` ou `RANGE` atualmente não podem ser empurradas para baixo.

  Você pode verificar se uma junção específica pode ser simplificada consultando-a com `EXPLAIN` (explain.html); quando a junção pode ser simplificada, você pode ver referências à junção simplificada na coluna `Extra` do resultado, como mostrado neste exemplo:

  ```sql
  mysql> EXPLAIN
      ->     SELECT e.first_name, e.last_name, t.title, d.dept_name
      ->         FROM employees e
      ->         JOIN dept_emp de ON e.emp_no=de.emp_no
      ->         JOIN departments d ON d.dept_no=de.dept_no
      ->         JOIN titles t ON e.emp_no=t.emp_no\G
  *************************** 1. row ***************************
             id: 1
    select_type: SIMPLE
          table: d
           type: ALL
  possible_keys: PRIMARY
            key: NULL
        key_len: NULL
            ref: NULL
           rows: 9
          Extra: Parent of 4 pushed join@1
  *************************** 2. row ***************************
             id: 1
    select_type: SIMPLE
          table: de
           type: ref
  possible_keys: PRIMARY,emp_no,dept_no
            key: dept_no
        key_len: 4
            ref: employees.d.dept_no
           rows: 5305
          Extra: Child of 'd' in pushed join@1
  *************************** 3. row ***************************
             id: 1
    select_type: SIMPLE
          table: e
           type: eq_ref
  possible_keys: PRIMARY
            key: PRIMARY
        key_len: 4
            ref: employees.de.emp_no
           rows: 1
          Extra: Child of 'de' in pushed join@1
  *************************** 4. row ***************************
             id: 1
    select_type: SIMPLE
          table: t
           type: ref
  possible_keys: PRIMARY,emp_no
            key: emp_no
        key_len: 4
            ref: employees.de.emp_no
           rows: 19
          Extra: Child of 'e' in pushed join@1
  4 rows in set (0.00 sec)
  ```

  Nota

  Se as tabelas filhas unidas internamente forem unidas por `ref`, *e* o resultado for ordenado ou agrupado por um índice ordenado, esse índice não pode fornecer linhas ordenadas, o que obriga a gravação em um arquivo temporário ordenado.

  Dois recursos adicionais de informações sobre o desempenho da junção empurrada estão disponíveis:

  1. As variáveis de status `Ndb_pushed_queries_defined`, `Ndb_pushed_queries_dropped`, `Ndb_pushed_queries_executed` e `Ndb_pushed_reads`.

  2. Os contabilistas na tabela `ndbinfo.counters` que pertencem ao bloco do kernel `DBSPJ`.

- `ndb_log_apply_status`

  <table frame="box" rules="all" summary="Propriedades para ndb-cluster-connection-pool-nodeids"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-cluster-connection-pool-nodeids</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>Variável do sistema (≥ 5.7.10-ndb-7.5.0)</th> <td>[[<code class="literal">ndb_cluster_connection_pool_nodeids</code>]]</td> </tr><tr><th>Âmbito (≥ 5.7.10-ndb-7.5.0)</th> <td>Global</td> </tr><tr><th>Dinâmico (≥ 5.7.10-ndb-7.5.0)</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Conjunto</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal"></code>]]</td> </tr></tbody></table>5

  Uma variável somente de leitura que indica se o servidor foi iniciado com a opção `--ndb-log-apply-status`.

- `ndb_log_bin`

  <table frame="box" rules="all" summary="Propriedades para ndb-cluster-connection-pool-nodeids"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-cluster-connection-pool-nodeids</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>Variável do sistema (≥ 5.7.10-ndb-7.5.0)</th> <td>[[<code class="literal">ndb_cluster_connection_pool_nodeids</code>]]</td> </tr><tr><th>Âmbito (≥ 5.7.10-ndb-7.5.0)</th> <td>Global</td> </tr><tr><th>Dinâmico (≥ 5.7.10-ndb-7.5.0)</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Conjunto</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal"></code>]]</td> </tr></tbody></table>6

  As atualizações das tabelas `NDB` são escritas no log binário. A definição desta variável não tem efeito se o registro binário não estiver já habilitado para o servidor usando [`log_bin`](https://pt.wikipedia.org/wiki/Log_bin%C3%A1rio#sysvar_log_bin). O valor padrão de `ndb_log_bin` é 1 (ON); normalmente, não há necessidade de alterar esse valor em um ambiente de produção.

- `ndb_log_binlog_index`

  <table frame="box" rules="all" summary="Propriedades para ndb-cluster-connection-pool-nodeids"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-cluster-connection-pool-nodeids</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>Variável do sistema (≥ 5.7.10-ndb-7.5.0)</th> <td>[[<code class="literal">ndb_cluster_connection_pool_nodeids</code>]]</td> </tr><tr><th>Âmbito (≥ 5.7.10-ndb-7.5.0)</th> <td>Global</td> </tr><tr><th>Dinâmico (≥ 5.7.10-ndb-7.5.0)</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Conjunto</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal"></code>]]</td> </tr></tbody></table>7

  Faz com que a mapeo de épocas para posições no log binário seja inserido na tabela `ndb_binlog_index`. Definir essa variável não tem efeito se o registro binário não estiver já habilitado para o servidor usando `log_bin`. (Além disso, `ndb_log_bin` não deve ser desativado.) `ndb_log_binlog_index` tem o valor padrão de `1` (`ON`); normalmente, não há necessidade de alterar esse valor em um ambiente de produção.

- `ndb_log_empty_epochs`

  <table frame="box" rules="all" summary="Propriedades para ndb-cluster-connection-pool-nodeids"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-cluster-connection-pool-nodeids</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>Variável do sistema (≥ 5.7.10-ndb-7.5.0)</th> <td>[[<code class="literal">ndb_cluster_connection_pool_nodeids</code>]]</td> </tr><tr><th>Âmbito (≥ 5.7.10-ndb-7.5.0)</th> <td>Global</td> </tr><tr><th>Dinâmico (≥ 5.7.10-ndb-7.5.0)</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Conjunto</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal"></code>]]</td> </tr></tbody></table>8

  Quando essa variável é definida como 0, as transações de época sem alterações não são escritas no log binário, embora uma linha ainda seja escrita, mesmo para uma época vazia no `ndb_binlog_index`.

- `ndb_log_empty_update`

  <table frame="box" rules="all" summary="Propriedades para ndb-cluster-connection-pool-nodeids"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-cluster-connection-pool-nodeids</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>Variável do sistema (≥ 5.7.10-ndb-7.5.0)</th> <td>[[<code class="literal">ndb_cluster_connection_pool_nodeids</code>]]</td> </tr><tr><th>Âmbito (≥ 5.7.10-ndb-7.5.0)</th> <td>Global</td> </tr><tr><th>Dinâmico (≥ 5.7.10-ndb-7.5.0)</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Conjunto</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal"></code>]]</td> </tr></tbody></table>9

  Quando essa variável estiver definida como `ON` (`1`), as transações sem alterações serão escritas no log binário, mesmo quando o [`log_slave_updates`](https://pt.wikipedia.org/wiki/Op%C3%A9r_de_replic%C3%A3o#Op%C3%A3es_de_log_bin%C3%A1rio) estiver habilitado.

- `ndb_log_exclusive_reads`

  <table frame="box" rules="all" summary="Propriedades para ndb-blob-read-batch-bytes"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-blob-read-batch-bytes</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_blob_read_batch_bytes</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">65536</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr></tbody></table>0

  Essa variável determina se as leituras da chave primária são registradas com bloqueios exclusivos, o que permite a detecção e resolução de conflitos na replicação em cluster do NDB com base em conflitos de leitura. Para habilitar esses bloqueios, defina o valor de `ndb_log_exclusive_reads` para 1. 0, que desabilita esse bloqueio, é o padrão.

  Para obter mais informações, consulte Leia sobre detecção e resolução de conflitos.

- `ndb_log_orig`

  <table frame="box" rules="all" summary="Propriedades para ndb-blob-read-batch-bytes"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-blob-read-batch-bytes</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_blob_read_batch_bytes</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">65536</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr></tbody></table>1

  Mostra se o ID do servidor de origem e a época estão registrados na tabela `ndb_binlog_index`. Defina usando a opção de servidor `--ndb-log-orig`.

- `ndb_log_transaction_id`

  <table frame="box" rules="all" summary="Propriedades para ndb-blob-read-batch-bytes"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-blob-read-batch-bytes</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_blob_read_batch_bytes</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">65536</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr></tbody></table>2

  Esta variável de sistema binária de leitura somente mostra se uma replica **mysqld** escreve IDs de transação NDB no log binário (requisitado para usar a Replicação de NDB Cluster “ativo-ativo” com detecção de conflitos `NDB$EPOCH_TRANS()`). Para alterar a configuração, use a opção `--ndb-log-transaction-id`.

  `ndb_log_transaction_id` não é suportado no MySQL Server 5.7 principal.

  Para obter mais informações, consulte Seção 21.7.11, “Resolução de conflitos de replicação de cluster NDB”.

- `ndb_optimized_node_selection`

  <table frame="box" rules="all" summary="Propriedades para ndb-blob-read-batch-bytes"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-blob-read-batch-bytes</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_blob_read_batch_bytes</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">65536</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr></tbody></table>3

  Existem duas formas de seleção de nós otimizadas, descritas aqui:

  1. O nó SQL usa promixity para determinar o coordenador da transação; ou seja, o nó de dados "mais próximo" do nó SQL é escolhido como o coordenador da transação. Para esse propósito, um nó de dados que tenha uma conexão de memória compartilhada com o nó SQL é considerado "mais próximo" do nó SQL; os próximos mais próximos (em ordem decrescente de proximidade) são: conexão TCP com `localhost`, seguida por conexão TCP de um host diferente de `localhost`.

  2. O fio SQL usa a consciência de distribuição para selecionar o nó de dados. Ou seja, o nó de dados que abriga a partição do clúster acessada pelo primeiro comando de uma determinada transação é usado como coordenador da transação para toda a transação. (Isso só é eficaz se o primeiro comando da transação não acessar mais de uma partição do clúster.)

  Esta opção aceita um dos valores inteiros `0`, `1`, `2` ou `3`. O valor `3` é o padrão. Esses valores afetam a seleção de nós da seguinte forma:

  - `0`: A seleção de nós não está otimizada. Cada nó de dados é empregado como coordenador de transação 8 vezes antes que o fio SQL prossiga para o próximo nó de dados.

  - `1`: A proximidade com o nó SQL é usada para determinar o coordenador da transação.

  - `2`: A conscientização da distribuição é usada para selecionar o coordenador da transação. No entanto, se a primeira declaração da transação acessar mais de uma partição de cluster, o nó SQL retorna ao comportamento de rotação em anel visto quando essa opção é definida como `0`.

  - `3`: Se a consciência de distribuição puder ser usada para determinar o coordenador da transação, então ela é usada; caso contrário, a proximidade é usada para selecionar o coordenador da transação. (Esse é o comportamento padrão.)

  A proximidade é determinada da seguinte forma:

  1. Comece com o valor definido para o parâmetro `Group` (padrão 55).

  2. Para um nó da API que compartilha o mesmo host com outros nós da API, diminua o valor em 1. Considerando o valor padrão para `Grupo`, o valor efetivo para nós de dados no mesmo host que o nó da API é 54, e para nós de dados remotos 55.

  3. (*NDB 7.5.2 e versões posteriores:*) Definir `ndb_data_node_neighbour` reduz ainda mais o valor efetivo do `Group` em 50%, fazendo com que esse nó seja considerado o nó mais próximo. Isso é necessário apenas quando todos os nós de dados estão em hosts diferentes daquele que hospeda o nó da API e é desejável dedicar um deles ao nó da API. Nos casos normais, o ajuste padrão descrito anteriormente é suficiente.

  Mudanças frequentes em `ndb_data_node_neighbour` não são aconselháveis, pois isso altera o estado da conexão do cluster e, assim, pode interromper o algoritmo de seleção para novas transações de cada thread até que ele se estabilize.

- `ndb_read_backup`

  <table frame="box" rules="all" summary="Propriedades para ndb-blob-read-batch-bytes"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-blob-read-batch-bytes</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_blob_read_batch_bytes</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">65536</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr></tbody></table>4

  Ative a leitura de qualquer réplica de fragmento para qualquer tabela `NDB` posteriormente criada; isso melhora significativamente o desempenho da leitura da tabela a um custo relativamente baixo para as escritas.

  Se o nó SQL e o nó de dados usarem o mesmo nome de host ou endereço IP, esse fato é detectado automaticamente, portanto, a preferência é enviar leituras para o mesmo host. Se esses nós estiverem no mesmo host, mas usarem endereços IP diferentes, você pode instruir o nó SQL a usar o nó de dados correto, definindo o valor de `ndb_data_node_neighbour` no nó SQL para o ID do nó de dados.

  Para habilitar ou desabilitar a leitura de qualquer réplica de fragmento para uma tabela individual, você pode definir a opção `NDB_TABLE` `READ_BACKUP` para a tabela conforme necessário, em uma declaração de `CREATE TABLE` ou `ALTER TABLE`; consulte Seção 13.1.18.9, “Definindo Opções de Comentário NDB” para obter mais informações.

  Adicionado em NDB 7.5.2.

- `ndb_recv_thread_activation_threshold`

  <table frame="box" rules="all" summary="Propriedades para ndb-blob-read-batch-bytes"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-blob-read-batch-bytes</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_blob_read_batch_bytes</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">65536</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr></tbody></table>5

  Quando esse número de threads ativas simultaneamente é atingido, a thread de recebimento assume a verificação da conexão do cluster.

  Essa variável tem escopo global. Ela também pode ser definida na inicialização.

- `ndb_recv_thread_cpu_mask`

  <table frame="box" rules="all" summary="Propriedades para ndb-blob-read-batch-bytes"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-blob-read-batch-bytes</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_blob_read_batch_bytes</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">65536</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr></tbody></table>6

  Máscara de CPU para bloquear os threads do receptor em CPUs específicas. Isso é especificado como uma máscara de bits hexadecimal. Por exemplo, `0x33` significa que uma CPU é usada por cada thread do receptor. Uma string vazia é o padrão; definir `ndb_recv_thread_cpu_mask` para esse valor remove quaisquer bloqueios de thread do receptor previamente definidos.

  Essa variável tem escopo global. Ela também pode ser definida na inicialização.

- `ndb_report_thresh_binlog_epoch_slip`

  <table frame="box" rules="all" summary="Propriedades para ndb-blob-read-batch-bytes"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-blob-read-batch-bytes</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_blob_read_batch_bytes</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">65536</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr></tbody></table>7

  No NDB 7.5.4 e versões posteriores, isso representa o limite para o número de épocas completamente armazenadas no buffer de eventos, mas ainda não consumidas pelo fio injetor do binlog. Quando esse grau de atraso (lag) é excedido, uma mensagem de status do buffer de eventos é relatada, com `BUFFERED_EPOCHS_OVER_THRESHOLD` fornecido como a razão (veja Seção 21.6.2.3, “Relatório do Buffer de Eventos no Log do Clúster”). O atraso aumenta quando uma época é recebida dos nós de dados e armazenada completamente no buffer de eventos; diminui quando uma época é consumida pelo fio injetor do binlog, sendo reduzida. Eras vazias são armazenadas e colocadas em fila, e, portanto, incluídas neste cálculo apenas quando isso é habilitado usando o método `Ndb::setEventBufferQueueEmptyEpoch()` da API NDB.

  Antes da NDB 7.5.4, o valor desse variável servia como um limite para o número de épocas que deveriam ser ultrapassadas antes de relatar o status do log binário. Nesses lançamentos anteriores, um valor de `3` — o padrão — significa que, se a diferença entre a época que foi recebida dos nós de armazenamento e a época que foi aplicada ao log binário for de 3 ou mais, uma mensagem de status é então enviada para o log do clúster.

- `ndb_report_thresh_binlog_mem_usage`

  <table frame="box" rules="all" summary="Propriedades para ndb-blob-read-batch-bytes"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-blob-read-batch-bytes</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_blob_read_batch_bytes</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">65536</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr></tbody></table>8

  Esse é um limite sobre a porcentagem de memória livre restante antes de relatar o status do log binário. Por exemplo, um valor de `10` (o padrão) significa que, se a quantidade de memória disponível para receber dados do log binário dos nós de dados cair abaixo de 10%, uma mensagem de status é enviada para o log do clúster.

- `ndb_row_checksum`

  <table frame="box" rules="all" summary="Propriedades para ndb-blob-read-batch-bytes"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-blob-read-batch-bytes</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_blob_read_batch_bytes</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">65536</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr></tbody></table>9

  Tradicionalmente, o `NDB` criou tabelas com verificações de checksum de linha, o que verifica problemas de hardware em detrimento do desempenho. Definir `ndb_row_checksum` para 0 significa que as verificações de checksum de linha *não* são usadas para novas ou tabelas alteradas, o que tem um impacto significativo no desempenho para todos os tipos de consultas. Esta variável é definida para 1 por padrão, para fornecer um comportamento compatível com versões anteriores.

- `ndb_show_foreign_key_mock_tables`

  <table frame="box" rules="all" summary="Propriedades para ndb-blob-write-batch-bytes"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-blob-write-batch-bytes</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_blob_write_batch_bytes</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">65536</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>0

  Mostre as tabelas fictícias usadas pelo `NDB` para suportar `foreign_key_checks=0`. Quando essa opção está habilitada, avisos extras são exibidos ao criar e excluir as tabelas. O nome real (interno) da tabela pode ser visto na saída do `SHOW CREATE TABLE`.

- `ndb_slave_conflict_role`

  <table frame="box" rules="all" summary="Propriedades para ndb-blob-write-batch-bytes"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-blob-write-batch-bytes</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_blob_write_batch_bytes</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">65536</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>1

  Determine o papel deste nó SQL (e do NDB Cluster) em uma configuração de replicação circular ("ativa-ativa"). `ndb_slave_conflict_role` pode assumir qualquer um dos valores `PRIMARY`, `SECONDARY`, `PASS` ou `NULL` (o padrão). O fio SQL do replica deve ser parado antes que você possa alterar `ndb_slave_conflict_role`. Além disso, não é possível alterar diretamente entre `PASS` e `PRIMARY` ou `SECONDARY` diretamente; nesses casos, você deve garantir que o fio SQL seja parado, depois executar `SET @@GLOBAL.ndb_slave_conflict_role = 'NONE'` primeiro.

  Para obter mais informações, consulte Seção 21.7.11, “Resolução de conflitos de replicação de cluster NDB”.

- `ndb_table_no_logging`

  <table frame="box" rules="all" summary="Propriedades para ndb-blob-write-batch-bytes"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-blob-write-batch-bytes</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_blob_write_batch_bytes</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">65536</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>2

  Quando essa variável é definida como `ON` ou `1`, todas as tabelas criadas ou alteradas usando `ENGINE NDB` ficam sem registro; ou seja, nenhuma alteração de dados dessa tabela é escrita no log de refazer ou arquivada no disco, assim como se a tabela tivesse sido criada ou alterada usando a opção `NOLOGGING` para `CREATE TABLE` (create-table.html) ou `ALTER TABLE` (alter-table.html).

  Para obter mais informações sobre tabelas `NDB` sem registro, consulte Opções de comentário de tabela NDB.

  `ndb_table_no_logging` não tem efeito na criação dos arquivos de esquema de tabela `NDB`; para suprimi-los, use `ndb_table_temporary` em vez disso.

- `ndb_table_temporary`

  <table frame="box" rules="all" summary="Propriedades para ndb-blob-write-batch-bytes"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-blob-write-batch-bytes</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_blob_write_batch_bytes</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">65536</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>3

  Quando definido como `ON` ou `1`, essa variável faz com que as tabelas do `NDB` não sejam escritas em disco: Isso significa que nenhum arquivo de esquema de tabela é criado e que as tabelas não são registradas.

  Nota

  Definir essa variável atualmente não tem efeito. Esse é um problema conhecido; veja o Bug #34036.

- `ndb_use_copying_alter_table`

  <table frame="box" rules="all" summary="Propriedades para ndb-blob-write-batch-bytes"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-blob-write-batch-bytes</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_blob_write_batch_bytes</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">65536</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>4

  Força `NDB` a usar a cópia de tabelas em caso de problemas com operações de `ALTER TABLE` online. O valor padrão é `OFF`.

- `ndb_use_exact_count`

  <table frame="box" rules="all" summary="Propriedades para ndb-blob-write-batch-bytes"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-blob-write-batch-bytes</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_blob_write_batch_bytes</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">65536</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>5

  Força `NDB` a usar um contagem de registros durante o planejamento da consulta `SELECT COUNT(*)`, para acelerar esse tipo de consulta. O valor padrão é `OFF`, o que permite consultas mais rápidas no geral.

- `ndb_use_transactions`

  <table frame="box" rules="all" summary="Propriedades para ndb-blob-write-batch-bytes"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-blob-write-batch-bytes</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_blob_write_batch_bytes</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">65536</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>6

  Você pode desativar o suporte para transações `NDB` definindo o valor desta variável para `OFF`. Geralmente, isso não é recomendado, embora possa ser útil desativar o suporte para transações dentro de uma sessão de cliente específica quando essa sessão for usada para importar um ou mais arquivos de dump com transações grandes; isso permite que uma inserção de várias linhas seja executada em partes, em vez de como uma única transação. Nesses casos, uma vez que a importação tenha sido concluída, você deve reiniciar o valor da variável para essa sessão para `ON`, ou simplesmente encerrar a sessão.

- `ndb_version`

  <table frame="box" rules="all" summary="Propriedades para ndb-blob-write-batch-bytes"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-blob-write-batch-bytes</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_blob_write_batch_bytes</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">65536</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>7

  Versão do motor `NDB`, como um inteiro composto.

- `ndb_version_string`

  <table frame="box" rules="all" summary="Propriedades para ndb-blob-write-batch-bytes"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-blob-write-batch-bytes</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_blob_write_batch_bytes</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">65536</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>8

  Versão do motor `NDB` no formato `ndb-x.y.z`.

- `server_id_bits`

  <table frame="box" rules="all" summary="Propriedades para ndb-blob-write-batch-bytes"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-blob-write-batch-bytes</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal">ndb_blob_write_batch_bytes</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">65536</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>9

  Esta variável indica o número de bits menos significativos dentro do ID do servidor de 32 bits `server_id` que realmente identificam o servidor. Indicar que o servidor é realmente identificado por menos de 32 bits permite que alguns dos bits restantes sejam usados para outros propósitos, como armazenar dados do usuário gerados por aplicativos que utilizam a API de Eventos da NDB dentro do `AnyValue` de uma estrutura de `OperationOptions` (/doc/ndbapi/en/ndb-ndboperation.html#ndb-ndboperation-operationoptions) (o NDB Cluster usa o `AnyValue` para armazenar o ID do servidor).

  Ao extrair o ID do servidor efetivo de `server_id` para fins como a detecção de loops de replicação, o servidor ignora os bits restantes. A variável `server_id_bits` é usada para mascarar quaisquer bits irrelevantes de `server_id` nos threads de I/O e SQL ao decidir se um evento deve ser ignorado com base no ID do servidor.

  Esses dados podem ser lidos do log binário pelo **mysqlbinlog**, desde que seja executado com sua própria variável \`**server\_id\_bits** definida como 32 (o padrão).

  Se o valor de `server_id` for maior ou igual a 2 elevado a `server_id_bits`; caso contrário, o **mysqld** se recusa a iniciar.

  Essa variável de sistema é suportada apenas pelo NDB Cluster. Não é suportada no servidor padrão MySQL 5.7.

- `slave_allow_batching`

  <table frame="box" rules="all" summary="Propriedades para ndb-connectstring"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-connectstring</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>0

  Se as atualizações em lote estão habilitadas ou não nas réplicas do NDB Cluster.

  Permitir atualizações em lote na replica melhora significativamente o desempenho, especialmente ao replicar as colunas `TEXT`, `BLOB` e `JSON`. Por essa razão, você deve sempre habilitar `slave_allow_batching` ao usar a replicação NDB. A partir do NDB 7.6.23, uma mensagem de aviso é emitida sempre que essa variável for definida como `OFF`.

  Definir essa variável tem efeito apenas ao usar a replicação com o mecanismo de armazenamento `NDB`; no MySQL Server 5.7, ela está presente, mas não faz nada. Para mais informações, consulte \[Seção 21.7.6, “Iniciando a replicação do NDB Cluster (Canal de replicação único”]]\(mysql-cluster-replication-starting.html).

- `transaction_allow_batching`

  <table frame="box" rules="all" summary="Propriedades para ndb-connectstring"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-connectstring</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>1

  Quando definido como `1` ou `ON`, essa variável habilita o agrupamento de instruções dentro da mesma transação. Para usar essa variável, `autocommit` deve ser desativado primeiro, definindo-o como `0` ou `OFF`; caso contrário, definir `transaction_allow_batching` não terá efeito.

  É seguro usar essa variável com transações que realizam apenas escritas, pois a ativação pode levar a leituras da imagem "antes". Você deve garantir que quaisquer transações pendentes sejam confirmadas (usando um `COMMIT` explícito, se desejar) antes de emitir uma `SELECT`.

  Importante

  `transaction_allow_batching` não deve ser usado sempre que houver a possibilidade de os efeitos de uma determinada instrução dependerem do resultado de uma instrução anterior dentro da mesma transação.

  Esta variável é atualmente suportada apenas para o NDB Cluster.

As variáveis de sistema na lista a seguir estão todas relacionadas ao banco de dados de informações `ndbinfo`.

- `ndbinfo_database`

  <table frame="box" rules="all" summary="Propriedades para ndb-connectstring"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-connectstring</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>2

  Mostra o nome usado para o banco de dados de informações `NDB`; o padrão é `ndbinfo`. Esta é uma variável de leitura somente, cujo valor é determinado no momento da compilação.

- `ndbinfo_max_bytes`

  <table frame="box" rules="all" summary="Propriedades para ndb-connectstring"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-connectstring</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>3

  Usado apenas para testes e depuração.

- `ndbinfo_max_rows`

  <table frame="box" rules="all" summary="Propriedades para ndb-connectstring"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-connectstring</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>4

  Usado apenas para testes e depuração.

- `ndbinfo_offline`

  <table frame="box" rules="all" summary="Propriedades para ndb-connectstring"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-connectstring</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>5

  Coloque o banco de dados `ndbinfo` no modo offline, no qual as tabelas e visualizações podem ser abertas mesmo quando não existem na verdade, ou quando existem, mas têm definições diferentes no `NDB`. Não serão retornadas linhas dessas tabelas (ou visualizações).

- `ndbinfo_show_hidden`

  <table frame="box" rules="all" summary="Propriedades para ndb-connectstring"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-connectstring</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>6

  Se as tabelas internas subjacentes do banco de dados `ndbinfo` são ou não exibidas no cliente **mysql**. O padrão é `OFF`.

  Nota

  Quando `ndbinfo_show_hidden` está habilitado, as tabelas internas são exibidas apenas no banco de dados `ndbinfo`; elas não são visíveis em `TABELAS` ou em outras tabelas do `INFORMATION_SCHEMA`, independentemente da configuração da variável.

- `ndbinfo_table_prefix`

  <table frame="box" rules="all" summary="Propriedades para ndb-connectstring"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-connectstring</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>7

  O prefixo usado para nomear as tabelas de base do banco de dados ndbinfo (normalmente oculto, a menos que seja exibido ao definir `ndbinfo_show_hidden`). Esta é uma variável de leitura somente, cujo valor padrão é `ndb$`; o próprio prefixo é determinado no momento da compilação.

- `ndbinfo_version`

  <table frame="box" rules="all" summary="Propriedades para ndb-connectstring"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb-connectstring</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>8

  Mostra a versão do motor `ndbinfo` em uso; apenas leitura.

##### 21.4.3.9.3 Variáveis de Status do Agrupamento do BND

Esta seção fornece informações detalhadas sobre as variáveis de status do servidor MySQL que se relacionam ao NDB Cluster e ao mecanismo de armazenamento `NDB`. Para variáveis de status não específicas do NDB Cluster e para informações gerais sobre o uso de variáveis de status, consulte Seção 5.1.9, “Variáveis de Status do Servidor”.

- `Handler_discover`

  O servidor MySQL pode perguntar ao mecanismo de armazenamento `NDBCLUSTER` se ele conhece uma tabela com um nome específico. Isso é chamado de descoberta. `Handler_discover` indica o número de vezes que as tabelas foram descobertas usando esse mecanismo.

- `Ndb_api_adaptive_send_deferred_count`

  Número de chamadas de envio adaptativas que não foram realmente enviadas.

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_adaptive_send_deferred_count_session`

  Número de chamadas de envio adaptativas que não foram realmente enviadas.

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_adaptive_send_deferred_count_slave`

  Número de chamadas de envio adaptativas que não foram realmente enviadas por esta réplica.

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_adaptive_send_forced_count`

  Número de chamadas de envio adaptativas enviadas por meio do envio forçado por este servidor MySQL (nó SQL).

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_adaptive_send_forced_count_session`

  Número de chamadas de envio adaptativas com envio forçado nesta sessão do cliente.

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_adaptive_send_forced_count_slave`

  Número de chamadas de envio adaptativas enviadas por esta réplica usando o envio forçado.

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_adaptive_send_unforced_count`

  Número de chamadas de envio adaptativas sem envio forçado enviadas por este servidor MySQL (nó SQL).

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_adaptive_send_unforced_count_session`

  Número de chamadas de envio adaptativas sem envio forçado nesta sessão do cliente.

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_adaptive_send_unforced_count_slave`

  Número de chamadas de envio adaptativas sem envio forçado enviadas por esta réplica.

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_bytes_sent_count_session`

  Quantidade de dados (em bytes) enviados para os nós de dados nesta sessão do cliente.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste \[**mysqld**].

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_bytes_sent_count_slave`

  Quantidade de dados (em bytes) enviados para os nós de dados por esta réplica.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_bytes_sent_count`

  Quantidade de dados (em bytes) enviados para os nós de dados por este servidor MySQL (nó SQL).

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` (show-status.html) ou `SHOW SESSION STATUS` (show-status.html), ela é efetivamente de escopo global.

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_bytes_received_count_session`

  Quantidade de dados (em bytes) recebidos dos nós de dados nesta sessão do cliente.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste \[**mysqld**].

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_bytes_received_count_slave`

  Quantidade de dados (em bytes) recebidos dos nós de dados por esta réplica.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_bytes_received_count`

  Quantidade de dados (em bytes) recebidos dos nós de dados deste servidor MySQL (nó SQL).

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` (show-status.html) ou `SHOW SESSION STATUS` (show-status.html), ela é efetivamente de escopo global.

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_event_data_count_injector`

  O número de eventos de alteração de linha recebidos pelo fio de injeção binlog do NDB.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` (show-status.html) ou `SHOW SESSION STATUS` (show-status.html), ela é efetivamente de escopo global.

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_event_data_count`

  O número de eventos de mudança de linha recebidos por este servidor MySQL (nó SQL).

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` (show-status.html) ou `SHOW SESSION STATUS` (show-status.html), ela é efetivamente de escopo global.

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_event_nondata_count_injector`

  O número de eventos recebidos, exceto eventos de alteração de linha, pelo fio de injeção de log binário do NDB.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` (show-status.html) ou `SHOW SESSION STATUS` (show-status.html), ela é efetivamente de escopo global.

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_event_nondata_count`

  O número de eventos recebidos, além dos eventos de mudança de linha, por este servidor MySQL (nó SQL).

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` (show-status.html) ou `SHOW SESSION STATUS` (show-status.html), ela é efetivamente de escopo global.

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_event_bytes_count_injector`

  O número de bytes de eventos recebidos pelo fio de injeção binlog do NDB.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` (show-status.html) ou `SHOW SESSION STATUS` (show-status.html), ela é efetivamente de escopo global.

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_event_bytes_count`

  O número de bytes de eventos recebidos por este servidor MySQL (nó SQL).

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` (show-status.html) ou `SHOW SESSION STATUS` (show-status.html), ela é efetivamente de escopo global.

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_pk_op_count_session`

  O número de operações nesta sessão do cliente com base em ou usando chaves primárias. Isso inclui operações em tabelas de blob, operações de desbloqueio implícitas e operações de autoincremento, além das operações de chave primária visíveis pelo usuário.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste \[**mysqld**].

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_pk_op_count_slave`

  O número de operações dessa replica baseada em ou usando chaves primárias. Isso inclui operações em tabelas de blob, operações de desbloqueio implícitas e operações de autoincremento, além das operações de chave primária visíveis pelo usuário.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_pk_op_count`

  O número de operações deste servidor MySQL (nó SQL) com base em ou usando chaves primárias. Isso inclui operações em tabelas blob, operações de desbloqueio implícitas e operações de autoincremento, além das operações de chave primária visíveis pelo usuário.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` (show-status.html) ou `SHOW SESSION STATUS` (show-status.html), ela é efetivamente de escopo global.

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_pruned_scan_count_session`

  O número de varreduras nesta sessão do cliente que foram reduzidas a uma única partição.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste \[**mysqld**].

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_pruned_scan_count_slave`

  O número de varreduras desta réplica que foram reduzidas a uma única partição.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_pruned_scan_count`

  O número de varreduras deste servidor MySQL (nó SQL) que foram reduzidas a uma única partição.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` (show-status.html) ou `SHOW SESSION STATUS` (show-status.html), ela é efetivamente de escopo global.

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_range_scan_count_session`

  O número de varreduras de alcance iniciadas nesta sessão do cliente.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste \[**mysqld**].

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_range_scan_count_slave`

  O número de varreduras de alcance iniciadas por esta réplica.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_range_scan_count`

  O número de varreduras de alcance iniciadas por este servidor MySQL (nó SQL).

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` (show-status.html) ou `SHOW SESSION STATUS` (show-status.html), ela é efetivamente de escopo global.

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_read_row_count_session`

  O número total de linhas que foram lidas nesta sessão do cliente. Isso inclui todas as linhas lidas por qualquer chave primária, chave única ou operação de varredura realizada nesta sessão do cliente.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste \[**mysqld**].

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_read_row_count_slave`

  O número total de linhas que foram lidas por esta réplica. Isso inclui todas as linhas lidas por qualquer chave primária, chave única ou operação de varredura realizada por esta réplica.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_read_row_count`

  O número total de linhas que foram lidas por este servidor MySQL (nó SQL). Isso inclui todas as linhas lidas por qualquer chave primária, chave única ou operação de varredura realizada por este servidor MySQL (nó SQL).

  Você deve estar ciente de que esse valor pode não ser completamente preciso em relação às linhas lidas por consultas de `[SELECT]` (`select.html`), `[COUNT(*)]` (`aggregate-functions.html#function_count`), devido ao fato de que, neste caso, o servidor MySQL realmente lê pseudo-linhas na forma `[ID do fragmento da tabela]:[número de linhas no fragmento]` e soma as linhas por fragmento para todos os fragmentos da tabela para derivar uma contagem estimada para todas as linhas. O `Ndb_api_read_row_count` usa essa estimativa e não o número real de linhas na tabela.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` (show-status.html) ou `SHOW SESSION STATUS` (show-status.html), ela é efetivamente de escopo global.

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_scan_batch_count_session`

  O número de lotes de linhas recebidos nesta sessão do cliente. Um lote é definido como um conjunto de resultados de varredura de um único fragmento.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste \[**mysqld**].

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_scan_batch_count_slave`

  O número de lotes de linhas recebidos por esta réplica. 1 lote é definido como 1 conjunto de resultados de varredura de um único fragmento.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_scan_batch_count`

  O número de lotes de linhas recebidos por este servidor MySQL (nó SQL). 1 lote é definido como 1 conjunto de resultados de varredura de um único fragmento.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` (show-status.html) ou `SHOW SESSION STATUS` (show-status.html), ela é efetivamente de escopo global.

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_table_scan_count_session`

  O número de varreduras de tabela iniciadas nesta sessão do cliente, incluindo varreduras de tabelas internas.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste \[**mysqld**].

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_table_scan_count_slave`

  O número de varreduras de tabela iniciadas por esta réplica, incluindo varreduras de tabelas internas.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_table_scan_count`

  O número de varreduras de tabela iniciadas por este servidor MySQL (nó SQL), incluindo varreduras de tabelas internas.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` (show-status.html) ou `SHOW SESSION STATUS` (show-status.html), ela é efetivamente de escopo global.

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_trans_abort_count_session`

  Número de transações abortadas nesta sessão do cliente.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste \[**mysqld**].

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_trans_abort_count_slave`

  Número de transações abortadas por esta réplica.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_trans_abort_count`

  Número de transações abortadas por este servidor MySQL (nó SQL).

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` (show-status.html) ou `SHOW SESSION STATUS` (show-status.html), ela é efetivamente de escopo global.

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_trans_close_count_session`

  O número de transações concluídas nesta sessão do cliente. Esse valor pode ser maior que a soma de `Ndb_api_trans_commit_count_session` e `Ndb_api_trans_abort_count_session`, pois algumas transações podem ter sido revertidas.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste \[**mysqld**].

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_trans_close_count_slave`

  O número de transações concluídas por esta réplica. Esse valor pode ser maior que a soma de `Ndb_api_trans_commit_count_slave` e `Ndb_api_trans_abort_count_slave`, pois algumas transações podem ter sido revertidas.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_trans_close_count`

  O número de transações concluídas por este servidor MySQL (nó SQL). Esse valor pode ser maior que a soma de `Ndb_api_trans_commit_count` e `Ndb_api_trans_abort_count`, pois algumas transações podem ter sido revertidas.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` (show-status.html) ou `SHOW SESSION STATUS` (show-status.html), ela é efetivamente de escopo global.

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_trans_commit_count_session`

  O número de transações realizadas nesta sessão do cliente.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste \[**mysqld**].

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_trans_commit_count_slave`

  O número de transações realizadas por esta réplica.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_trans_commit_count`

  O número de transações realizadas por este servidor MySQL (nó SQL).

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` (show-status.html) ou `SHOW SESSION STATUS` (show-status.html), ela é efetivamente de escopo global.

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_trans_local_read_row_count_session`

  O número total de linhas que foram lidas nesta sessão do cliente. Isso inclui todas as linhas lidas por qualquer chave primária, chave única ou operação de varredura realizada nesta sessão do cliente.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste \[**mysqld**].

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_trans_local_read_row_count_slave`

  O número total de linhas que foram lidas por esta réplica. Isso inclui todas as linhas lidas por qualquer chave primária, chave única ou operação de varredura realizada por esta réplica.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_trans_local_read_row_count`

  O número total de linhas que foram lidas por este servidor MySQL (nó SQL). Isso inclui todas as linhas lidas por qualquer chave primária, chave única ou operação de varredura realizada por este servidor MySQL (nó SQL).

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` (show-status.html) ou `SHOW SESSION STATUS` (show-status.html), ela é efetivamente de escopo global.

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_trans_start_count_session`

  O número de transações iniciadas nesta sessão do cliente.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste \[**mysqld**].

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_trans_start_count_slave`

  O número de transações iniciadas por esta réplica.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_trans_start_count`

  O número de transações iniciadas por este servidor MySQL (nó SQL).

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` (show-status.html) ou `SHOW SESSION STATUS` (show-status.html), ela é efetivamente de escopo global.

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_uk_op_count_session`

  O número de operações nesta sessão do cliente com base em ou usando chaves únicas.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste \[**mysqld**].

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_uk_op_count_slave`

  O número de operações realizadas por esta réplica com base em ou usando chaves únicas.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_uk_op_count`

  O número de operações deste servidor MySQL (nó SQL) com base em ou usando chaves únicas.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` (show-status.html) ou `SHOW SESSION STATUS` (show-status.html), ela é efetivamente de escopo global.

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_wait_exec_complete_count_session`

  O número de vezes que um fio foi bloqueado nesta sessão do cliente enquanto aguardava a execução de uma operação para ser concluída. Isso inclui todas as chamadas de `execute()` e execuções implícitas para operações de blob e autoincremento que não são visíveis para os clientes.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste \[**mysqld**].

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_wait_exec_complete_count_slave`

  O número de vezes que um fio foi bloqueado por esta replica enquanto aguardava a execução de uma operação para ser concluída. Isso inclui todas as chamadas de `execute()` e execuções implícitas para operações de blob e auto-incremento que não são visíveis para os clientes.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_wait_exec_complete_count`

  O número de vezes que um fio foi bloqueado por este servidor MySQL (nó SQL) enquanto aguardava a conclusão da execução de uma operação. Isso inclui todas as chamadas de `execute()` e execuções implícitas para operações de blob e autoincremento que não são visíveis para os clientes.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` (show-status.html) ou `SHOW SESSION STATUS` (show-status.html), ela é efetivamente de escopo global.

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_wait_meta_request_count_session`

  O número de vezes que um fio foi bloqueado nesta sessão do cliente enquanto aguardava por um sinal baseado em metadados, como o esperado para solicitações de DDL, novas épocas e apreensão de registros de transações.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste \[**mysqld**].

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_wait_meta_request_count_slave`

  O número de vezes que um fio foi bloqueado por essa replica enquanto aguardava por um sinal baseado em metadados, como o esperado para solicitações de DDL, novas épocas e apreensão de registros de transações.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_wait_meta_request_count`

  O número de vezes que um fio foi bloqueado por este servidor MySQL (nó SQL) aguardando um sinal baseado em metadados, como o esperado para solicitações de DDL, novas épocas e apreensão de registros de transação.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` (show-status.html) ou `SHOW SESSION STATUS` (show-status.html), ela é efetivamente de escopo global.

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_wait_nanos_count_session`

  Tempo total (em nanosegundos) gasto nesta sessão do cliente esperando por qualquer tipo de sinal dos nós de dados.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste \[**mysqld**].

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_wait_nanos_count_slave`

  Tempo total (em nanosegundos) gasto por esta réplica esperando qualquer tipo de sinal dos nós de dados.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_wait_nanos_count`

  O tempo total (em nanosegundos) gasto por este servidor MySQL (nó SQL) esperando por qualquer tipo de sinal dos nós de dados.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` (show-status.html) ou `SHOW SESSION STATUS` (show-status.html), ela é efetivamente de escopo global.

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_wait_scan_result_count_session`

  O número de vezes que um fio foi bloqueado nesta sessão do cliente enquanto aguardava por um sinal baseado em varredura, como quando está aguardando mais resultados de uma varredura ou quando está aguardando que a varredura seja concluída.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste \[**mysqld**].

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_wait_scan_result_count_slave`

  O número de vezes que um fio foi bloqueado por esta réplica enquanto aguardava por um sinal baseado em varredura, como quando está aguardando mais resultados de uma varredura ou quando está aguardando que a varredura seja concluída.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_api_wait_scan_result_count`

  O número de vezes que um fio foi bloqueado por este servidor MySQL (nó SQL) enquanto aguardava por um sinal baseado em varredura, como quando está aguardando mais resultados de uma varredura ou quando está aguardando que uma varredura seja concluída.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` (show-status.html) ou `SHOW SESSION STATUS` (show-status.html), ela é efetivamente de escopo global.

  Para obter mais informações, consulte Seção 21.6.14, "Contas de estatísticas da API NDB e variáveis".

- `Ndb_cluster_node_id`

  Se o servidor estiver atuando como um nó do NDB Cluster, então o valor desta variável será o ID do nó no cluster.

  Se o servidor não faz parte de um NDB Cluster, o valor desta variável é 0.

- `Ndb_config_from_host`

  Se o servidor faz parte de um NDB Cluster, o valor desta variável é o nome do host ou o endereço IP do servidor de gerenciamento do Cluster, a partir do qual ele obtém seus dados de configuração.

  Se o servidor não faz parte de um NDB Cluster, o valor desta variável será uma string vazia.

- `Ndb_config_from_port`

  Se o servidor faz parte de um NDB Cluster, o valor desta variável é o número da porta através da qual ele está conectado ao servidor de gerenciamento do Cluster, do qual ele obtém seus dados de configuração.

  Se o servidor não faz parte de um NDB Cluster, o valor desta variável é 0.

- `Ndb_conflict_fn_epoch`

  Utilizada na resolução de conflitos da replicação em clúster do NDB, essa variável mostra o número de linhas encontradas em conflito usando a resolução de conflitos `NDB$EPOCH()` em um determinado **mysqld** desde a última vez que ele foi reiniciado.

  Para obter mais informações, consulte Seção 21.7.11, “Resolução de conflitos de replicação de cluster NDB”.

- `Ndb_conflict_fn_epoch_trans`

  Utilizada na resolução de conflitos da replicação em clúster do NDB, essa variável mostra o número de linhas encontradas em conflito usando a resolução de conflitos `NDB$EPOCH_TRANS()` em um determinado **mysqld** desde a última vez que ele foi reiniciado.

  Para obter mais informações, consulte Seção 21.7.11, “Resolução de conflitos de replicação de cluster NDB”.

- `Ndb_conflict_fn_epoch2`

  Mostra o número de linhas encontradas em conflito na resolução de conflitos da replicação em cluster NDB Cluster, quando se usa `NDB$EPOCH2()`, na fonte designada como primária desde a última vez que foi reiniciado.

  Para obter mais informações, consulte NDB$EPOCH2().

- `Ndb_conflict_fn_epoch2_trans`

  Utilizada na resolução de conflitos da replicação em clúster do NDB, essa variável mostra o número de linhas encontradas em conflito usando a resolução de conflitos `NDB$EPOCH_TRANS2()` em um determinado **mysqld** desde a última vez que ele foi reiniciado.

  Para obter mais informações, consulte NDB$EPOCH2\_TRANS().

- `Ndb_conflict_fn_max`

  Utilizada na resolução de conflitos da replicação em clúster do NDB, essa variável mostra o número de vezes que uma linha não foi aplicada no nó SQL atual devido à resolução de conflitos “maior timestamp vence” desde a última vez que esse **mysqld** foi iniciado.

  Para obter mais informações, consulte Seção 21.7.11, “Resolução de conflitos de replicação de cluster NDB”.

- `Ndb_conflict_fn_max_del_win`

  Mostra o número de vezes que uma linha foi rejeitada no nó SQL atual devido à resolução de conflitos da replicação do NDB Cluster usando `NDB$MAX_DELETE_WIN()`, desde a última vez que este **mysqld** foi iniciado.

  Para obter mais informações, consulte Seção 21.7.11, “Resolução de conflitos de replicação de cluster NDB”.

- `Ndb_conflict_fn_old`

  Utilizada na resolução de conflitos da replicação em clúster do NDB, essa variável mostra o número de vezes que uma linha não foi aplicada como resultado da resolução de conflitos "o mesmo timestamp vence" em um determinado **mysqld** desde a última vez que ele foi reiniciado.

  Para obter mais informações, consulte Seção 21.7.11, “Resolução de conflitos de replicação de cluster NDB”.

- `Ndb_conflict_last_conflict_epoch`

  A época mais recente em que um conflito foi detectado nesta réplica. Você pode comparar esse valor com `Ndb_slave_max_replicated_epoch`; se `Ndb_slave_max_replicated_epoch` for maior que `Ndb_conflict_last_conflict_epoch`, nenhum conflito ainda foi detectado.

  Para obter mais informações, consulte Seção 21.7.11, "Resolução de conflitos de replicação de cluster NDB".

- `Ndb_conflict_reflected_op_discard_count`

  Ao usar a resolução de conflitos da replicação em clúster NDB, este é o número de operações refletidas que não foram aplicadas no secundário, devido ao erro encontrado durante a execução.

  Para obter mais informações, consulte Seção 21.7.11, "Resolução de conflitos de replicação de cluster NDB".

- `Ndb_conflict_reflected_op_prepare_count`

  Ao usar a resolução de conflitos com a Replicação em Cluster do NDB, essa variável de status contém o número de operações refletidas que foram definidas (ou seja, preparadas para execução no secundário).

  Consulte seção 21.7.11, "Resolução de conflitos de replicação de cluster NDB".

- `Ndb_conflict_refresh_op_count`

  Ao usar a resolução de conflitos com a Replicação em Cluster do NDB, isso fornece o número de operações de atualização preparadas para execução no secundário.

  Para obter mais informações, consulte Seção 21.7.11, "Resolução de conflitos de replicação de cluster NDB".

- `Ndb_conflict_last_stable_epoch`

  Número de linhas encontradas em conflito por uma função de conflito transacional

  Para obter mais informações, consulte Seção 21.7.11, "Resolução de conflitos de replicação de cluster NDB".

- `Ndb_conflict_trans_row_conflict_count`

  Utilizado na resolução de conflitos da replicação em clúster do NDB, essa variável de status mostra o número de linhas encontradas como estando diretamente em conflito por uma função de conflito transacional em um determinado **mysqld** desde a última vez que ele foi reiniciado.

  Atualmente, a única função de detecção de conflitos transacionais suportada pelo NDB Cluster é a NDB$EPOCH\_TRANS(), então essa variável de status é efetivamente a mesma que `Ndb_conflict_fn_epoch_trans`.

  Para obter mais informações, consulte Seção 21.7.11, “Resolução de conflitos de replicação de cluster NDB”.

- `Ndb_conflict_trans_row_reject_count`

  Utilizado na resolução de conflitos da replicação em clúster NDB, essa variável de status mostra o número total de linhas realinhadas devido a serem determinadas como conflitantes por uma função de detecção de conflitos transacionais. Isso inclui não apenas `Ndb_conflict_trans_row_conflict_count`, mas também quaisquer linhas em transações conflitantes ou dependentes delas.

  Para obter mais informações, consulte Seção 21.7.11, “Resolução de conflitos de replicação de cluster NDB”.

- `Ndb_conflict_trans_reject_count`

  Utilizado na resolução de conflitos da replicação em clúster do NDB, essa variável de status mostra o número de transações encontradas como conflitantes por uma função de detecção de conflitos transacionais.

  Para obter mais informações, consulte Seção 21.7.11, “Resolução de conflitos de replicação de cluster NDB”.

- `Ndb_conflict_trans_detect_iter_count`

  Utilizado na resolução de conflitos da replicação em clúster do NDB, este valor indica o número de iterações internas necessárias para confirmar uma transação de época. Deve ser (levemente) maior ou igual a `Ndb_conflict_trans_conflict_commit_count`.

  Para obter mais informações, consulte Seção 21.7.11, “Resolução de conflitos de replicação de cluster NDB”.

- `Ndb_conflict_trans_conflict_commit_count`

  Utilizado na resolução de conflitos da replicação em clúster do NDB, este mostra o número de transações de época comprometidas após a necessidade de tratamento de conflitos transacionais.

  Para obter mais informações, consulte Seção 21.7.11, “Resolução de conflitos de replicação de cluster NDB”.

- `Ndb_epoch_delete_delete_count`

  Ao usar a detecção de conflitos delete-delete, este é o número de conflitos delete-delete detectados, onde uma operação de exclusão é aplicada, mas a linha indicada não existe.

- `Ndb_execute_count`

  Fornece o número de viagens de ida e volta ao kernel `NDB` realizadas por operações.

- `Ndb_last_commit_epoch_server`

  A época mais recentemente marcada pelo `NDB`.

- `Ndb_last_commit_epoch_session`

  A época mais recentemente marcada por este cliente do `NDB`.

- `Ndb_number_of_data_nodes`

  Se o servidor faz parte de um NDB Cluster, o valor desta variável é o número de nós de dados no cluster.

  Se o servidor não faz parte de um NDB Cluster, o valor desta variável é 0.

- `Ndb_pushed_queries_defined`

  O número total de junções foi reduzido para o núcleo NDB para o gerenciamento distribuído nos nós de dados.

  Nota

  Os testes de junções com `[`EXPLAIN\`]\(explain.html) que podem ser otimizados contribuem para esse número.

- `Ndb_pushed_queries_dropped`

  O número de junções que foram empurradas para o kernel do NDB, mas que não puderam ser tratadas lá.

- `Ndb_pushed_queries_executed`

  O número de junções que foram enviadas com sucesso para `NDB` e executadas lá.

- `Ndb_pushed_reads`

  O número de linhas devolvidas a **mysqld** pelo kernel NDB por junções que foram empurradas para baixo.

  Nota

  A execução de `EXPLAIN` em junções que podem ser empurradas para o `NDB` não aumenta esse número.

- `Ndb_pruned_scan_count`

  Esta variável contém um contador do número de varreduras executadas pelo `NDBCLUSTER` desde que o NDB Cluster foi iniciado pela última vez, quando o `NDBCLUSTER` conseguiu usar o corte de partições.

  Usar essa variável juntamente com `Ndb_scan_count` pode ser útil no design do esquema para maximizar a capacidade do servidor de aparar varreduras para uma única partição da tabela, envolvendo assim apenas um único nó de dados.

- `Ndb_scan_count`

  Essa variável contém um contador do número total de varreduras executadas pelo `NDBCLUSTER` desde que o NDB Cluster foi iniciado pela última vez.

- `Ndb_slave_max_replicated_epoch`

  A época mais recentemente registrada nesta replica. Você pode comparar esse valor com `Ndb_conflict_last_conflict_epoch`; se `Ndb_slave_max_replicated_epoch` for maior que o valor de `Ndb_conflict_last_conflict_epoch`, ainda não foram detectados conflitos.

  Para obter mais informações, consulte Seção 21.7.11, “Resolução de conflitos de replicação de cluster NDB”.

- `Ndb_system_name`

  Se este servidor MySQL estiver conectado a um cluster NDB, essa variável somente de leitura mostrará o nome do sistema do cluster. Caso contrário, o valor será uma string vazia.
