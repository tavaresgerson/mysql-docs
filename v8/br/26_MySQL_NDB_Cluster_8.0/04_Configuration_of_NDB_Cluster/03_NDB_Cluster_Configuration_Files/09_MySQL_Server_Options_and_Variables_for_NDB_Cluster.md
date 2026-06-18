#### 25.4.3.9 Opções e variáveis do servidor MySQL para o NDB Cluster

Esta seção fornece informações sobre as opções do servidor MySQL, variáveis de servidor e status específicas para o NDB Cluster. Para informações gerais sobre o uso dessas opções e variáveis, e para outras opções e variáveis que não são específicas para o NDB Cluster, consulte a Seção 7.1, “O Servidor MySQL”.

Para os parâmetros de configuração do NDB Cluster usados no arquivo de configuração do cluster (geralmente chamado de `config.ini`), consulte a Seção 25.4, “Configuração do NDB Cluster”.

##### 25.4.3.9.1 Opções do Servidor MySQL para o NDB Cluster

Esta seção fornece descrições das opções do servidor **mysqld** relacionadas ao NDB Cluster. Para informações sobre as opções do **mysqld** que não são específicas do NDB Cluster, e para informações gerais sobre o uso de opções com o **mysqld**, consulte a Seção 7.1.7, “Opções de comando do servidor”.

Para obter informações sobre as opções de linha de comando usadas com outros processos do NDB Cluster, consulte a Seção 25.5, “Programas do NDB Cluster”.

- `--ndbcluster`

  <table summary="Propriedades para ndbcluster"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndbcluster[=valu<code>skip-ndbcluster</code></code>]]</td> </tr><tr><th>Incapaz de</th> <td>[[<code>skip-ndbcluster</code>]]</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p></td> </tr></tbody></table>

  O motor de armazenamento `NDBCLUSTER` é necessário para usar o NDB Cluster. Se um binário do **mysqld** incluir suporte para o motor de armazenamento `NDBCLUSTER`, o motor é desativado por padrão. Use a opção `--ndbcluster` para ativá-lo. Use `--skip-ndbcluster` para desativá-lo explicitamente.

  A opção `--ndbcluster` é ignorada (e o mecanismo de armazenamento `NDB` *não* é habilitado) se `--initialize` também for usado. (Não é necessário nem desejável usar essa opção junto com `--initialize`.)

- `--ndb-allow-copying-alter-table=[ON|OFF]`

  <table summary="Propriedades para ndb-allow-copying-alter-table"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-allow-copying-alter-table[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_allow_copying_alter_table</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>

  Deixe que as instruções DDL `ALTER TABLE` e outras usem operações de cópia em tabelas `NDB`. Defina para `OFF` para evitar que isso aconteça; fazer isso pode melhorar o desempenho de aplicações críticas.

- `--ndb-applier-allow-skip-epoch`

  <table summary="Propriedades para ndb-applier-allow-skip-epoch"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-applier-allow-skip-epoch</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.28-ndb-8.0.28</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_applier_allow_skip_epoch</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr></tbody></table>

  Use junto com `--slave-skip-errors` para fazer com que `NDB` ignore as transações de época ignoradas. Não tem efeito quando usado sozinho.

- `--ndb-batch-size=#`

  <table summary="Propriedades para ndb-batch-size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-batch-size</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>32768</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo (≥ 8.0.29-ndb-8.0.29)</th> <td>[[<code>2147483648</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>2147483648</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>2147483648</code>]]</td> </tr><tr><th>Valor máximo (≤ 8.0.28-ndb-8.0.28)</th> <td>[[<code>31536000</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>

  Isso define o tamanho em bytes utilizado para os lotes de transações do NDB.

- `--ndb-cluster-connection-pool=#`

  <table summary="Propriedades para ndb-cluster-connection-pool"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-cluster-connection-pool</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_cluster_connection_pool</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_cluster_connection_pool</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>63</code>]]</td> </tr></tbody></table>

  Ao definir essa opção para um valor maior que 1 (o padrão), um processo **mysqld** pode usar múltiplas conexões ao clúster, imitando efetivamente vários nós SQL. Cada conexão requer sua própria seção `[api]` ou `[mysqld]` no arquivo de configuração do clúster (`config.ini`) e é contabilizada no número máximo de conexões de API suportadas pelo clúster.

  Suponha que você tenha 2 computadores hospedeiros de clúster, cada um executando um nó SQL cujo processo **mysqld** foi iniciado com `--ndb-cluster-connection-pool=4`; isso significa que o clúster deve ter 8 slots de API disponíveis para essas conexões (em vez de 2). Todas essas conexões são configuradas quando o nó SQL se conecta ao clúster e são alocadas para threads de forma round-robin.

  Esta opção é útil apenas quando o **mysqld** está sendo executado em máquinas hospedeiras com múltiplos CPUs, múltiplos núcleos ou ambos. Para obter os melhores resultados, o valor deve ser menor que o número total de núcleos disponíveis na máquina hospedeira. Definir um valor maior que este provavelmente degradará severamente o desempenho.

  Importante

  Como cada nó SQL que usa o pool de conexões ocupa vários slots de nó da API — cada slot tem seu próprio ID de nó no cluster —, você *não* deve usar um ID de nó como parte da string de conexão do cluster ao iniciar qualquer processo **mysqld** que utilize o pool de conexões.

  Definir um ID de nó na cadeia de conexão ao usar a opção `--ndb-cluster-connection-pool` causa erros de alocação de ID de nó quando o nó SQL tenta se conectar ao clúster.

- `--ndb-cluster-connection-pool-nodeids=list`

  <table summary="Propriedades para ndb-cluster-connection-pool-nodeids"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-cluster-connection-pool-nodeids</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_cluster_connection_pool_nodeids</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Conjunto</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>

  Especifica uma lista separada por vírgula de IDs de nó para conexões ao clúster usadas por um nó SQL. O número de nós nesta lista deve ser o mesmo do valor definido para a opção `--ndb-cluster-connection-pool`.

- `--ndb-blob-read-batch-bytes=bytes`

  <table summary="Propriedades para ndb-blob-read-batch-bytes"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-blob-read-batch-bytes</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_blob_read_batch_bytes</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>65536</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>

  Essa opção pode ser usada para definir o tamanho (em bytes) para o agrupamento de leituras de dados `BLOB` em aplicativos do NDB Cluster. Quando esse tamanho de lote é excedido pela quantidade de dados `BLOB` a serem lidos dentro da transação atual, quaisquer operações de leitura pendentes `BLOB` são executadas imediatamente.

  O valor máximo para esta opção é 4294967295; o padrão é 65536. Definir para 0 desativa o agrupamento de lotes de leitura `BLOB`.

  Nota

  Em aplicativos da API NDB, você pode controlar o agrupamento de escritas `BLOB` com os métodos `setMaxPendingBlobReadBytes()` e `getMaxPendingBlobReadBytes()`.

- `--ndb-blob-write-batch-bytes=bytes`

  <table summary="Propriedades para ndb-blob-write-batch-bytes"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-blob-write-batch-bytes</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_blob_write_batch_bytes</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>65536</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>4294967295</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>

  Essa opção pode ser usada para definir o tamanho (em bytes) para o agrupamento de `BLOB` escritas de dados em aplicativos do NDB Cluster. Quando esse tamanho de lote é excedido pela quantidade de `BLOB` dados a serem escritos dentro da transação atual, quaisquer operações de escrita pendentes de `BLOB` são executadas imediatamente.

  O valor máximo para esta opção é 4294967295; o padrão é 65536. Definir para 0 desativa o agrupamento de lotes de escrita `BLOB`.

  Nota

  Em aplicativos da API NDB, você pode controlar o agrupamento de escritas `BLOB` com os métodos `setMaxPendingBlobWriteBytes()` e `getMaxPendingBlobWriteBytes()`.

- `--ndb-connectstring=connection_string`

  <table summary="Propriedades para ndb-connectstring"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-connectstring</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>

  Ao usar o mecanismo de armazenamento `NDBCLUSTER`, esta opção especifica o servidor de gerenciamento que distribui os dados de configuração do clúster. Consulte a Seção 25.4.3.3, “Strings de Conexão de Clúster NDB”, para a sintaxe.

- `--ndb-default-column-format=[FIXED|DYNAMIC]`

  <table summary="Propriedades para ndb-default-column-format"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-default-column-format={FIXED|DYNAMIC}</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_default_column_format</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FIXED</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>FIXED</code>]]</p><p class="valid-value">[[<code>DYNAMIC</code>]]</p></td> </tr></tbody></table>

  Define o valor padrão de `COLUMN_FORMAT` e `ROW_FORMAT` para novas tabelas (consulte a Seção 15.1.20, “Instrução CREATE TABLE”). O padrão é `FIXED`.

- `--ndb-deferred-constraints=[0|1]`

  <table summary="Propriedades para ndb-allow-copying-alter-table"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-allow-copying-alter-table[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_allow_copying_alter_table</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>0

  Controla se as verificações de restrição em índices únicos são adiadas até o momento do commit, onde essas verificações são suportadas. `0` é o padrão.

  Essa opção normalmente não é necessária para o funcionamento do NDB Cluster ou da NDB Cluster Replication, e é destinada principalmente para uso em testes.

- `--ndb-schema-dist-timeout=#`

  <table summary="Propriedades para ndb-allow-copying-alter-table"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-allow-copying-alter-table[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_allow_copying_alter_table</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>1

  Especifica o tempo máximo em segundos que o **mysqld** aguarda por uma operação de esquema para ser concluída antes de marcar como tendo esgotado o tempo limite.

- `--ndb-distribution=[KEYHASH|LINHASH]`

  <table summary="Propriedades para ndb-allow-copying-alter-table"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-allow-copying-alter-table[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_allow_copying_alter_table</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>2

  Controla o método de distribuição padrão para tabelas `NDB`. Pode ser configurado para `KEYHASH` (hashing de chave) ou `LINHASH` (hashing linear). `KEYHASH` é o padrão.

- `--ndb-log-apply-status`

  <table summary="Propriedades para ndb-allow-copying-alter-table"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-allow-copying-alter-table[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_allow_copying_alter_table</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>3

  Faz com que uma replica do **mysqld** registre todas as atualizações recebidas de sua fonte imediata na tabela `mysql.ndb_apply_status` em seu próprio log binário usando seu próprio ID de servidor em vez do ID do servidor da fonte. Em um ambiente de replicação circular ou em cadeia, isso permite que essas atualizações se propague para as tabelas `mysql.ndb_apply_status` de quaisquer servidores MySQL configurados como réplicas do **mysqld** atual.

  Em uma configuração de replicação em cadeia, usar essa opção permite que os clusters descendentes (replica) estejam cientes de suas posições em relação a todos os seus contribuintes upstream (fontes).

  Em uma configuração de replicação circular, essa opção faz com que as alterações nas tabelas `ndb_apply_status` completem o circuito inteiro, propagando-se eventualmente de volta ao cluster NDB de origem. Isso também permite que um cluster que atua como fonte de replicação veja quando suas alterações (épocas) foram aplicadas aos outros clusters no círculo.

  Esta opção não tem efeito, a menos que o servidor MySQL seja iniciado com a opção `--ndbcluster`.

- `--ndb-log-empty-epochs=[ON|OFF]`

  <table summary="Propriedades para ndb-allow-copying-alter-table"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-allow-copying-alter-table[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_allow_copying_alter_table</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>4

  Causas épocas em que não houve alterações a serem escritas nas tabelas `ndb_apply_status` e `ndb_binlog_index`, mesmo quando `log_replica_updates` ou `log_slave_updates` está ativado.

  Por padrão, essa opção está desativada. Desativar `--ndb-log-empty-epochs` faz com que as transações de época sem alterações não sejam escritas no log binário, embora uma linha ainda seja escrita, mesmo para uma época vazia em `ndb_binlog_index`.

  Como o `--ndb-log-empty-epochs=1` faz com que o tamanho da tabela `ndb_binlog_index` aumente independentemente do tamanho do log binário, os usuários devem estar preparados para gerenciar o crescimento dessa tabela, mesmo que esperem que o clúster esteja inativo grande parte do tempo.

- `--ndb-log-empty-update=[ON|OFF]`

  <table summary="Propriedades para ndb-allow-copying-alter-table"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-allow-copying-alter-table[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_allow_copying_alter_table</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>5

  As atualizações que não produziram alterações são escritas nas tabelas `ndb_apply_status` e `ndb_binlog_index`, mesmo quando o `log_replica_updates` ou `log_slave_updates` está ativado.

  Por padrão, essa opção está desativada (`OFF`). A desativação de `--ndb-log-empty-update` faz com que as atualizações sem alterações não sejam escritas no log binário.

- `--ndb-log-exclusive-reads=[0|1]`

  <table summary="Propriedades para ndb-allow-copying-alter-table"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-allow-copying-alter-table[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_allow_copying_alter_table</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>6

  Iniciar o servidor com essa opção faz com que as leituras da chave primária sejam registradas com bloqueios exclusivos, o que permite a detecção e resolução de conflitos da Replicação em NDB Cluster com base em conflitos de leitura. Você também pode habilitar e desabilitar esses bloqueios em tempo de execução, definindo o valor da variável de sistema `ndb_log_exclusive_reads` para 1 ou 0, respectivamente. 0 (desativar o bloqueio) é o padrão.

  Para obter mais informações, consulte Detectar e resolver conflitos.

- `--ndb-log-fail-terminate`

  <table summary="Propriedades para ndb-allow-copying-alter-table"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-allow-copying-alter-table[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_allow_copying_alter_table</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>7

  Quando essa opção é especificada e o registro completo de todos os eventos de linha encontrados não for possível, o processo **mysqld** é encerrado.

- `--ndb-log-orig`

  <table summary="Propriedades para ndb-allow-copying-alter-table"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-allow-copying-alter-table[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_allow_copying_alter_table</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>8

  Registre o ID do servidor de origem e o período na tabela `ndb_binlog_index`.

  Nota

  Isso permite que uma determinada época tenha várias linhas no `ndb_binlog_index`, uma para cada época de origem.

  Para obter mais informações, consulte a Seção 25.7.4, “Esquema e tabelas de replicação de cluster NDB”.

- `--ndb-log-transaction-dependency`

  <table summary="Propriedades para ndb-allow-copying-alter-table"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-allow-copying-alter-table[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_allow_copying_alter_table</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>9

  Faz com que o fio de registro binário `NDB` calcule as dependências de transação para cada transação que ele escreve no log binário. O valor padrão é `FALSE`.

  Esta opção não pode ser definida em tempo de execução; a variável de sistema `ndb_log_transaction_dependency` correspondente é de leitura somente.

- `--ndb-log-transaction-id`

  <table summary="Propriedades para ndb-applier-allow-skip-epoch"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-applier-allow-skip-epoch</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.28-ndb-8.0.28</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_applier_allow_skip_epoch</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr></tbody></table>0

  Faz com que a replica **mysqld** escreva o ID de transação NDB em cada linha do log binário. O valor padrão é `FALSE`.

  É necessário `--ndb-log-transaction-id` para habilitar a detecção e resolução de conflitos da replicação em cluster NDB usando a função `NDB$EPOCH_TRANS()` (consulte NDB$EPOCH\_TRANS()). Para mais informações, consulte a Seção 25.7.12, “Resolução de Conflitos da Replicação em Cluster NDB”.

  A variável de sistema `log_bin_use_v1_row_events`, descontinuada, que tem o valor padrão `OFF`, não deve ser definida como `ON` quando você estiver usando `--ndb-log-transaction-id=ON`.

- `--ndb-log-update-as-write`

  <table summary="Propriedades para ndb-applier-allow-skip-epoch"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-applier-allow-skip-epoch</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.28-ndb-8.0.28</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_applier_allow_skip_epoch</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr></tbody></table>1

  Se as atualizações na fonte forem escritas no log binário como atualizações (`OFF`) ou escritas (`ON`). Quando esta opção estiver habilitada e os `--ndb-log-updated-only` e `--ndb-log-update-minimal` estiverem desativados, as operações de diferentes tipos serão registradas conforme descrito na lista a seguir:

  - `INSERT`: Registrado como um evento `WRITE_ROW` sem imagem anterior; a imagem após é registrada com todas as colunas.

    `UPDATE`: Registrado como um evento `WRITE_ROW` sem imagem anterior; a imagem após é registrada com todas as colunas.

    `DELETE`: Registrado como um evento `DELETE_ROW` com todas as colunas registradas na imagem anterior; a imagem após não foi registrada.

  Essa opção pode ser usada para resolução de conflitos de replicação NDB em combinação com as outras duas opções de registro NDB mencionadas anteriormente; consulte a tabela ndb\_replication para obter mais informações.

- `--ndb-log-updated-only`

  <table summary="Propriedades para ndb-applier-allow-skip-epoch"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-applier-allow-skip-epoch</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.28-ndb-8.0.28</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_applier_allow_skip_epoch</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr></tbody></table>2

  Se o **mysqld** escreve atualizações apenas (`ON`) ou linhas completas (`OFF`) no log binário. Quando esta opção está habilitada e os `--ndb-log-update-as-write` e `--ndb-log-update-minimal` estão desativados, as operações de diferentes tipos são registradas conforme descrito na lista a seguir:

  - `INSERT`: Registrado como um evento `WRITE_ROW` sem imagem anterior; a imagem após é registrada com todas as colunas.

  - `UPDATE`: Registrado como um evento `UPDATE_ROW` com colunas de chave primária e colunas atualizadas presentes tanto nas imagens antes quanto depois.

  - `DELETE`: Registrado como um evento `DELETE_ROW` com as colunas da chave primária incluídas na imagem anterior; a imagem após não foi registrada.

  Essa opção pode ser usada para resolução de conflitos de replicação NDB em combinação com as outras duas opções de registro NDB mencionadas anteriormente; consulte a tabela ndb\_replication para obter mais informações sobre como essas opções interagem entre si.

- `--ndb-log-update-minimal`

  <table summary="Propriedades para ndb-applier-allow-skip-epoch"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-applier-allow-skip-epoch</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.28-ndb-8.0.28</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_applier_allow_skip_epoch</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr></tbody></table>3

  Faça atualizações de log de forma mínima, escrevendo apenas os valores da chave primária na imagem anterior e apenas as colunas alteradas na imagem posterior. Isso pode causar problemas de compatibilidade se a replicação for para motores de armazenamento diferentes do `NDB`. Quando essa opção estiver habilitada e os `--ndb-log-updated-only` e `--ndb-log-update-as-write` estiverem desativados, as operações de diferentes tipos serão registradas conforme descrito na lista a seguir:

  - `INSERT`: Registrado como um evento `WRITE_ROW` sem imagem anterior; a imagem após é registrada com todas as colunas.

  - `UPDATE`: Registrado como um evento `UPDATE_ROW` com colunas de chave primária na imagem anterior; todas as colunas *exceto* as colunas de chave primária são registradas na imagem posterior.

  - `DELETE`: Registrado como um evento `DELETE_ROW` com todas as colunas na imagem anterior; a imagem após não foi registrada.

  Essa opção pode ser usada para resolução de conflitos de replicação NDB em combinação com as outras duas opções de registro NDB mencionadas anteriormente; consulte a tabela ndb\_replication para obter mais informações.

- `--ndb-mgmd-host=host[:port]`

  <table summary="Propriedades para ndb-applier-allow-skip-epoch"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-applier-allow-skip-epoch</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.28-ndb-8.0.28</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_applier_allow_skip_epoch</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr></tbody></table>4

  Pode ser usado para definir o número do host e do número de porta de um único servidor de gerenciamento para que o programa se conecte. Se o programa exigir IDs de nó ou referências a múltiplos servidores de gerenciamento (ou ambos) em suas informações de conexão, use a opção `--ndb-connectstring` em vez disso.

- `--ndb-nodeid=#`

  <table summary="Propriedades para ndb-applier-allow-skip-epoch"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-applier-allow-skip-epoch</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.28-ndb-8.0.28</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_applier_allow_skip_epoch</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr></tbody></table>5

  Defina o ID de nó deste servidor MySQL em um NDB Cluster.

  A opção `--ndb-nodeid` substitui qualquer ID de nó definido com `--ndb-connectstring`, independentemente da ordem em que as duas opções são usadas.

  Além disso, se `--ndb-nodeid` for usado, então deve-se encontrar um ID de nó correspondente em uma seção `[mysqld]` ou `[api]` de `config.ini`, ou deve haver uma seção “aberta” `[mysqld]` ou `[api]` no arquivo (ou seja, uma seção sem um parâmetro `NodeId` ou `Id` especificado). Isso também é verdadeiro se o ID de nó for especificado como parte da string de conexão.

  Independentemente de como o ID do nó é determinado, ele é exibido como o valor da variável de status global `Ndb_cluster_node_id` na saída de `SHOW STATUS`, e como `cluster_node_id` na linha `connection` da saída de `SHOW ENGINE NDBCLUSTER STATUS`.

  Para obter mais informações sobre os IDs de nós para nós SQL do NDB Cluster, consulte a Seção 25.4.3.7, “Definindo nós SQL e outros nós de API em um NDB Cluster”.

- `--ndbinfo={ON|OFF|FORCE}`

  <table summary="Propriedades para ndb-applier-allow-skip-epoch"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-applier-allow-skip-epoch</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.28-ndb-8.0.28</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_applier_allow_skip_epoch</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr></tbody></table>6

  Habilita o plugin para o banco de dados de informações `ndbinfo`. Por padrão, isso está ativado sempre que o `NDBCLUSTER` estiver ativado.

- `--ndb-optimization-delay=milliseconds`

  <table summary="Propriedades para ndb-applier-allow-skip-epoch"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-applier-allow-skip-epoch</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.28-ndb-8.0.28</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_applier_allow_skip_epoch</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr></tbody></table>7

  Defina o número de milissegundos para esperar entre conjuntos de linhas por instruções `OPTIMIZE TABLE` em tabelas `NDB`. O padrão é 10.

- `--ndb-optimized-node-selection`

  <table summary="Propriedades para ndb-applier-allow-skip-epoch"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-applier-allow-skip-epoch</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.28-ndb-8.0.28</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_applier_allow_skip_epoch</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr></tbody></table>8

  Ative as otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

- `--ndb-transid-mysql-connection-map=state`

  <table summary="Propriedades para ndb-applier-allow-skip-epoch"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-applier-allow-skip-epoch</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.28-ndb-8.0.28</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_applier_allow_skip_epoch</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr></tbody></table>9

  Habilita ou desabilita o plugin que lida com a tabela `ndb_transid_mysql_connection_map` no banco de dados `INFORMATION_SCHEMA`. Tomada uma das seguintes opções: `ON`, `OFF` ou `FORCE`. `ON` (padrão) habilita o plugin. `OFF` desabilita o plugin, o que torna `ndb_transid_mysql_connection_map` inacessível. `FORCE` impede que o MySQL Server seja iniciado se o plugin não conseguir ser carregado e iniciado.

  Você pode verificar se o plugin da tabela `ndb_transid_mysql_connection_map` está em execução verificando a saída de `SHOW PLUGINS`.

- `--ndb-wait-connected=seconds`

  <table summary="Propriedades para ndb-batch-size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-batch-size</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>32768</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo (≥ 8.0.29-ndb-8.0.29)</th> <td>[[<code>2147483648</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>2147483648</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>2147483648</code>]]</td> </tr><tr><th>Valor máximo (≤ 8.0.28-ndb-8.0.28)</th> <td>[[<code>31536000</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>0

  Esta opção define o período de tempo que o servidor MySQL espera para que as conexões ao NDB Cluster e aos nós de dados sejam estabelecidas antes de aceitar as conexões dos clientes MySQL. O tempo é especificado em segundos. O valor padrão é `30`.

- `--ndb-wait-setup=seconds`

  <table summary="Propriedades para ndb-batch-size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-batch-size</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>32768</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo (≥ 8.0.29-ndb-8.0.29)</th> <td>[[<code>2147483648</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>2147483648</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>2147483648</code>]]</td> </tr><tr><th>Valor máximo (≤ 8.0.28-ndb-8.0.28)</th> <td>[[<code>31536000</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>1

  Esta variável indica o período de tempo que o servidor MySQL espera para que o mecanismo de armazenamento `NDB` seja concluído antes de expirar o tempo e tratar `NDB` como indisponível. O tempo é especificado em segundos. O valor padrão é `30`.

- `--skip-ndbcluster`

  <table summary="Propriedades para ndb-batch-size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-batch-size</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>32768</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo (≥ 8.0.29-ndb-8.0.29)</th> <td>[[<code>2147483648</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>2147483648</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>2147483648</code>]]</td> </tr><tr><th>Valor máximo (≤ 8.0.28-ndb-8.0.28)</th> <td>[[<code>31536000</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>2

  Desative o mecanismo de armazenamento `NDBCLUSTER`. Este é o padrão para binários que foram compilados com suporte ao mecanismo de armazenamento `NDBCLUSTER`. O servidor aloca memória e outros recursos para este mecanismo de armazenamento apenas se a opção `--ndbcluster` for fornecida explicitamente. Veja a Seção 25.4.1, “Configuração rápida do NDB Cluster”, para um exemplo.

##### 25.4.3.9.2 Variáveis do Sistema de Clúster do NDB

Esta seção fornece informações detalhadas sobre as variáveis do sistema do servidor MySQL que são específicas para o NDB Cluster e o mecanismo de armazenamento `NDB`. Para variáveis de sistema que não são específicas para o NDB Cluster, consulte a Seção 7.1.8, “Variáveis do Sistema do Servidor”. Para informações gerais sobre o uso de variáveis de sistema, consulte a Seção 7.1.9, “Usando Variáveis de Sistema”.

- `ndb_autoincrement_prefetch_sz`

  <table summary="Propriedades para ndb-batch-size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-batch-size</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>32768</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo (≥ 8.0.29-ndb-8.0.29)</th> <td>[[<code>2147483648</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>2147483648</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>2147483648</code>]]</td> </tr><tr><th>Valor máximo (≤ 8.0.28-ndb-8.0.28)</th> <td>[[<code>31536000</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>3

  Determina a probabilidade de lacunas em uma coluna autoincrementada. Defina-o para `1` para minimizar isso. Definir um valor alto para otimização torna as inserções mais rápidas, mas diminui a probabilidade de números de autoincremento consecutivos serem usados em um lote de inserções.

  Essa variável afeta apenas o número de IDs `AUTO_INCREMENT` que são recuperados entre as instruções; dentro de uma determinada instrução, pelo menos 32 IDs são obtidos de cada vez.

  Importante

  Essa variável não afeta os insertos realizados usando `INSERT ... SELECT`.

- `ndb_clear_apply_status`

  <table summary="Propriedades para ndb-batch-size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-batch-size</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>32768</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo (≥ 8.0.29-ndb-8.0.29)</th> <td>[[<code>2147483648</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>2147483648</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>2147483648</code>]]</td> </tr><tr><th>Valor máximo (≤ 8.0.28-ndb-8.0.28)</th> <td>[[<code>31536000</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>4

  Por padrão, a execução de `RESET SLAVE` faz com que uma replica do NDB Cluster apague todas as linhas da sua tabela `ndb_apply_status`. Você pode desativá-lo configurando `ndb_clear_apply_status=OFF`.

- `ndb_conflict_role`

  <table summary="Propriedades para ndb-batch-size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-batch-size</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>32768</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo (≥ 8.0.29-ndb-8.0.29)</th> <td>[[<code>2147483648</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>2147483648</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>2147483648</code>]]</td> </tr><tr><th>Valor máximo (≤ 8.0.28-ndb-8.0.28)</th> <td>[[<code>31536000</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>5

  Determina o papel deste nó SQL (e do NDB Cluster) em uma configuração de replicação circular (“ativa-ativa”). `ndb_slave_conflict_role` pode assumir qualquer um dos valores `PRIMARY`, `SECONDARY`, `PASS` ou `NULL` (o padrão). O fio de SQL da replica deve ser parado antes que você possa alterar `ndb_slave_conflict_role`. Além disso, não é possível alterar diretamente entre `PASS` e qualquer um dos valores `PRIMARY` ou `SECONDARY` diretamente; nesses casos, você deve garantir que o fio de SQL seja parado e, em seguida, executar `SET @@GLOBAL.ndb_slave_conflict_role = 'NONE'` primeiro.

  Essa variável substitui `ndb_slave_conflict_role`, que está desatualizada a partir da NDB 8.0.23.

  Para obter mais informações, consulte a Seção 25.7.12, “Resolução de conflitos de replicação de cluster NDB”.

- `ndb_data_node_neighbour`

  <table summary="Propriedades para ndb-batch-size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-batch-size</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>32768</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo (≥ 8.0.29-ndb-8.0.29)</th> <td>[[<code>2147483648</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>2147483648</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>2147483648</code>]]</td> </tr><tr><th>Valor máximo (≤ 8.0.28-ndb-8.0.28)</th> <td>[[<code>31536000</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>6

  Define o ID de um nó de dados "mais próximo" — ou seja, um nó de dados não local preferido é escolhido para executar a transação, em vez de um que esteja executando no mesmo host que o nó SQL ou API. Isso costumava garantir que, quando uma tabela totalmente replicada é acessada, acessamos-a neste nó de dados, para garantir que a cópia local da tabela seja sempre usada sempre que possível. Isso também pode ser usado para fornecer dicas para transações.

  Isso pode melhorar os tempos de acesso aos dados no caso de um nó que está fisicamente mais próximo e, portanto, tem maior capacidade de transferência de rede do que outros no mesmo host.

  Consulte a Seção 15.1.20.12, “Definindo Opções de Comentário NDB”, para obter mais informações.

  Nota

  Um método equivalente `set_data_node_neighbour()` é fornecido para uso em aplicativos da API NDB.

- `ndb_dbg_check_shares`

  <table summary="Propriedades para ndb-batch-size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-batch-size</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>32768</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo (≥ 8.0.29-ndb-8.0.29)</th> <td>[[<code>2147483648</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>2147483648</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>2147483648</code>]]</td> </tr><tr><th>Valor máximo (≤ 8.0.28-ndb-8.0.28)</th> <td>[[<code>31536000</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>7

  Quando configurado para 1, verifique se nenhuma ação está pendente. Disponível apenas em builds de depuração.

- `ndb_default_column_format`

  <table summary="Propriedades para ndb-batch-size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-batch-size</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>32768</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo (≥ 8.0.29-ndb-8.0.29)</th> <td>[[<code>2147483648</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>2147483648</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>2147483648</code>]]</td> </tr><tr><th>Valor máximo (≤ 8.0.28-ndb-8.0.28)</th> <td>[[<code>31536000</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>8

  Define o valor padrão de `COLUMN_FORMAT` e `ROW_FORMAT` para novas tabelas (consulte a Seção 15.1.20, “Instrução CREATE TABLE”). O padrão é `FIXED`.

- `ndb_deferred_constraints`

  <table summary="Propriedades para ndb-batch-size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-batch-size</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_batch_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>32768</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo (≥ 8.0.29-ndb-8.0.29)</th> <td>[[<code>2147483648</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>2147483648</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>2147483648</code>]]</td> </tr><tr><th>Valor máximo (≤ 8.0.28-ndb-8.0.28)</th> <td>[[<code>31536000</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>9

  Controla se as verificações de restrição são adiadas ou não, onde essas são suportadas. `0` é o padrão.

  Essa variável normalmente não é necessária para o funcionamento do NDB Cluster ou da NDB Cluster Replication, e é destinada principalmente para uso em testes.

- `ndb_distribution`

  <table summary="Propriedades para ndb-cluster-connection-pool"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-cluster-connection-pool</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_cluster_connection_pool</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_cluster_connection_pool</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>63</code>]]</td> </tr></tbody></table>0

  Controla o método de distribuição padrão para tabelas `NDB`. Pode ser configurado para `KEYHASH` (hashing de chave) ou `LINHASH` (hashing linear). `KEYHASH` é o padrão.

- `ndb_eventbuffer_free_percent`

  <table summary="Propriedades para ndb-cluster-connection-pool"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-cluster-connection-pool</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_cluster_connection_pool</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_cluster_connection_pool</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>63</code>]]</td> </tr></tbody></table>1

  Define a porcentagem da memória máxima alocada para o buffer de eventos (ndb\_eventbuffer\_max\_alloc) que deve estar disponível no buffer de eventos após atingir o máximo, antes de começar a bufferizar novamente.

- `ndb_eventbuffer_max_alloc`

  <table summary="Propriedades para ndb-cluster-connection-pool"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-cluster-connection-pool</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_cluster_connection_pool</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_cluster_connection_pool</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>63</code>]]</td> </tr></tbody></table>2

  Define o valor máximo de memória (em bytes) que pode ser alocado para o buffer de eventos pela API NDB. 0 significa que não há limite imposto e é o valor padrão.

- `ndb_extra_logging`

  <table summary="Propriedades para ndb-cluster-connection-pool"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-cluster-connection-pool</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_cluster_connection_pool</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_cluster_connection_pool</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>63</code>]]</td> </tr></tbody></table>3

  Essa variável permite a gravação no log de erro do MySQL de informações específicas ao mecanismo de armazenamento `NDB`.

  Quando essa variável é definida como 0, a única informação específica para `NDB` que é escrita no log de erro do MySQL está relacionada ao gerenciamento de transações. Se for definida como um valor maior que 0, mas menor que 10, o esquema da tabela `NDB` e os eventos de conexão também são registrados, bem como se a resolução de conflitos está em uso ou não, e outros erros e informações de `NDB`. Se o valor for definido como 10 ou mais, informações sobre os `NDB` internos, como o progresso da distribuição de dados entre os nós do cluster, também são escritas no log de erro do MySQL. O valor padrão é 1.

- `ndb_force_send`

  <table summary="Propriedades para ndb-cluster-connection-pool"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-cluster-connection-pool</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_cluster_connection_pool</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_cluster_connection_pool</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>63</code>]]</td> </tr></tbody></table>4

  Força o envio de buffers para `NDB` imediatamente, sem esperar por outros threads. O padrão é `ON`.

- `ndb_fully_replicated`

  <table summary="Propriedades para ndb-cluster-connection-pool"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-cluster-connection-pool</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_cluster_connection_pool</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_cluster_connection_pool</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>63</code>]]</td> </tr></tbody></table>5

  Determina se as novas tabelas `NDB` são replicadas completamente. Essa configuração pode ser substituída para uma tabela individual usando `COMMENT="NDB_TABLE=FULLY_REPLICATED=..."` em uma instrução `CREATE TABLE` ou `ALTER TABLE`; consulte a Seção 15.1.20.12, “Definindo Opções de Comentário NDB”, para sintaxe e outras informações.

- `ndb_index_stat_enable`

  <table summary="Propriedades para ndb-cluster-connection-pool"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-cluster-connection-pool</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_cluster_connection_pool</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_cluster_connection_pool</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>63</code>]]</td> </tr></tbody></table>6

  Use as estatísticas de índice `NDB` na otimização de consultas. O padrão é `ON`.

  Antes da versão 8.0.27 do NDB, iniciar o servidor com `--ndb-index-stat-enable` definido como `OFF` impediu a criação das tabelas de estatísticas do índice. Na versão 8.0.27 e em versões posteriores, essas tabelas são sempre criadas quando o servidor é iniciado, independentemente do valor dessa opção.

- `ndb_index_stat_option`

  <table summary="Propriedades para ndb-cluster-connection-pool"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-cluster-connection-pool</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_cluster_connection_pool</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_cluster_connection_pool</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>63</code>]]</td> </tr></tbody></table>7

  Esta variável é usada para fornecer opções de ajuste para a geração de estatísticas de índice NDB. A lista consiste em pares de nomes e valores separados por vírgula de nomes de opções e valores, e essa lista não deve conter nenhum caractere de espaço.

  As opções não utilizadas ao definir `ndb_index_stat_option` não são alteradas de seus valores padrão. Por exemplo, você pode definir `ndb_index_stat_option = 'loop_idle=1000ms,cache_limit=32M'`.

  Os valores de tempo podem ser sufixados opcionalmente com `h` (horas), `m` (minutos) ou `s` (segundos). Os valores em milissegundos podem ser especificados opcionalmente usando `ms`; valores em milissegundos não podem ser especificados usando `h`, `m` ou `s`.) Os valores inteiros podem ser sufixados com `K`, `M` ou `G`.

  Os nomes das opções que podem ser definidos usando essa variável estão mostrados na tabela a seguir. A tabela também fornece descrições breves das opções, seus valores padrão e (quando aplicável) seus valores mínimo e máximo.

  **Tabela 25.20 ndb\_index\_stat\_option opções e valores**

  <table summary="Propriedades para ndb-cluster-connection-pool"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-cluster-connection-pool</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_cluster_connection_pool</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_cluster_connection_pool</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>63</code>]]</td> </tr></tbody></table>8

- `ndb_join_pushdown`

  <table summary="Propriedades para ndb-cluster-connection-pool"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-cluster-connection-pool</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_cluster_connection_pool</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_cluster_connection_pool</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>63</code>]]</td> </tr></tbody></table>9

  Esta variável controla se as junções nas tabelas `NDB` são empurradas para o núcleo NDB (nós de dados). Anteriormente, uma junção era tratada usando múltiplos acessos do `NDB` pelo nó SQL; no entanto, quando `ndb_join_pushdown` é habilitado, uma junção empurrável é enviada na íntegra para os nós de dados, onde pode ser distribuída entre os nós de dados e executada em paralelo em múltiplas cópias dos dados, com um único resultado combinado sendo retornado ao **mysqld**. Isso pode reduzir muito o número de viagens entre um nó SQL e os nós de dados necessárias para lidar com uma junção como essa.

  Por padrão, `ndb_join_pushdown` está habilitado.

  **Condições para junções pushdown do NDB.** Para que uma junção seja pushável, ela deve atender às seguintes condições:

  1. Apenas as colunas podem ser comparadas, e todas as colunas a serem unidas devem usar *exatamente* o mesmo tipo de dado. Isso significa que, por exemplo, uma junção em uma coluna `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") e uma coluna `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") também não podem ser empurradas para baixo.

     Anteriormente, expressões como `t1.a = t2.a + constant` não podiam ser deslocadas. Essa restrição foi removida no NDB 8.0. O resultado de qualquer operação em qualquer coluna a ser comparada deve produzir o mesmo tipo que a própria coluna.

     As expressões que comparam colunas da mesma tabela também podem ser empurradas para baixo. As colunas (ou o resultado de quaisquer operações nessas colunas) devem ser exatamente do mesmo tipo, incluindo a mesma sinalização, comprimento, conjunto de caracteres e ordenação, precisão e escala, quando aplicável.

  2. As consultas que fazem referência às colunas `BLOB` ou `TEXT` não são suportadas.

  3. O bloqueio explícito não é suportado; no entanto, o mecanismo de armazenamento `NDB` tem o bloqueio implícito baseado em linhas como característica.

     Isso significa que uma junção usando `FOR UPDATE` não pode ser empurrada para baixo.

  4. Para que uma junção seja impulsionada, as tabelas subordinadas na junção devem ser acessadas usando um dos métodos de acesso `ref`, `eq_ref` ou `const`, ou uma combinação desses métodos.

     As tabelas filhas externas podem ser empurradas apenas com `eq_ref`.

     Se a raiz da junção empurrada for um `eq_ref` ou `const`, apenas as tabelas filhas conectadas por `eq_ref` podem ser anexadas. (Uma tabela conectada por `ref` provavelmente se tornará a raiz de outra junção empurrada.)

     Se o otimizador de consultas decidir por `Using join cache` para uma tabela filha candidata, essa tabela não pode ser empurrada como filha. No entanto, ela pode ser a raiz de outro conjunto de tabelas empurradas.

  5. As junções que fazem referência a tabelas explicitamente particionadas por `[LINEAR] HASH`, `LIST` ou `RANGE` atualmente não podem ser empurradas para baixo.

  Você pode verificar se uma junção específica pode ser empurrada para baixo verificando-a com `EXPLAIN`; quando a junção pode ser empurrada para baixo, você pode ver referências ao `pushed join` na coluna `Extra` do resultado, como mostrado neste exemplo:

  ```
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

  2. Os contabilistas da tabela `ndbinfo.counters` que pertencem ao bloco de kernel `DBSPJ`.

- `ndb_log_apply_status`

  <table summary="Propriedades para ndb-cluster-connection-pool-nodeids"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-cluster-connection-pool-nodeids</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_cluster_connection_pool_nodeids</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Conjunto</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>0

  Uma variável somente de leitura que indica se o servidor foi iniciado com a opção `--ndb-log-apply-status`.

- `ndb_log_bin`

  <table summary="Propriedades para ndb-cluster-connection-pool-nodeids"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-cluster-connection-pool-nodeids</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_cluster_connection_pool_nodeids</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Conjunto</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>1

  As atualizações das tabelas `NDB` são escritas no log binário. A configuração desta variável não tem efeito se o registro binário não estiver habilitado no servidor usando `log_bin`. No NDB 8.0, `ndb_log_bin` tem o valor padrão de 0 (FALSO).

- `ndb_log_binlog_index`

  <table summary="Propriedades para ndb-cluster-connection-pool-nodeids"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-cluster-connection-pool-nodeids</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_cluster_connection_pool_nodeids</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Conjunto</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>2

  Faz com que a mapeo de épocas para posições no log binário seja inserido na tabela `ndb_binlog_index`. Definir essa variável não tem efeito se o registro binário não estiver já habilitado para o servidor usando `log_bin`. (Além disso, `ndb_log_bin` não deve ser desativado.) `ndb_log_binlog_index` tem como padrão `1` (`ON`); normalmente, não há necessidade de alterar esse valor em um ambiente de produção.

- `ndb_log_cache_size`

  <table summary="Propriedades para ndb-cluster-connection-pool-nodeids"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-cluster-connection-pool-nodeids</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_cluster_connection_pool_nodeids</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Conjunto</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>3

  Defina o tamanho do cache de transações usado para gravar o log binário `NDB`.

- `ndb_log_empty_epochs`

  <table summary="Propriedades para ndb-cluster-connection-pool-nodeids"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-cluster-connection-pool-nodeids</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_cluster_connection_pool_nodeids</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Conjunto</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>4

  Quando essa variável é definida como 0, as transações de época sem alterações não são escritas no log binário, embora uma linha ainda seja escrita, mesmo para uma época vazia em `ndb_binlog_index`.

- `ndb_log_empty_update`

  <table summary="Propriedades para ndb-cluster-connection-pool-nodeids"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-cluster-connection-pool-nodeids</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_cluster_connection_pool_nodeids</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Conjunto</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>5

  Quando essa variável estiver definida como `ON` (`1`), as transações sem alterações serão escritas no log binário, mesmo quando o `log_replica_updates` ou `log_slave_updates` estiverem habilitados.

- `ndb_log_exclusive_reads`

  <table summary="Propriedades para ndb-cluster-connection-pool-nodeids"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-cluster-connection-pool-nodeids</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_cluster_connection_pool_nodeids</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Conjunto</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>6

  Essa variável determina se as leituras da chave primária são registradas com bloqueios exclusivos, o que permite a detecção e resolução de conflitos na replicação em cluster do NDB com base em conflitos de leitura. Para habilitar esses bloqueios, defina o valor de `ndb_log_exclusive_reads` para 1. 0, que desabilita esse bloqueio, é o padrão.

  Para obter mais informações, consulte Detectar e resolver conflitos.

- `ndb_log_orig`

  <table summary="Propriedades para ndb-cluster-connection-pool-nodeids"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-cluster-connection-pool-nodeids</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_cluster_connection_pool_nodeids</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Conjunto</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>7

  Mostra se o ID do servidor de origem e a época estão registrados na tabela `ndb_binlog_index`. Defina usando a opção de servidor `--ndb-log-orig`.

- `ndb_log_transaction_id`

  <table summary="Propriedades para ndb-cluster-connection-pool-nodeids"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-cluster-connection-pool-nodeids</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_cluster_connection_pool_nodeids</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Conjunto</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>8

  Esta variável de sistema binária de leitura somente mostra se uma replica **mysqld** escreve IDs de transação NDB no log binário (requisitado para usar a replicação de clúster NDB “ativo-ativo” com detecção de conflitos `NDB$EPOCH_TRANS()`). Para alterar a configuração, use a opção `--ndb-log-transaction-id`.

  `ndb_log_transaction_id` não é suportado no MySQL Server 8.0 principal.

  Para obter mais informações, consulte a Seção 25.7.12, “Resolução de conflitos de replicação de cluster NDB”.

- `ndb_log_transaction_compression`

  <table summary="Propriedades para ndb-cluster-connection-pool-nodeids"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-cluster-connection-pool-nodeids</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_cluster_connection_pool_nodeids</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Conjunto</td> </tr><tr><th>Valor padrão</th> <td>[[<code></code>]]</td> </tr></tbody></table>9

  Se uma réplica do **mysqld** grava transações compactadas no log binário; apresenta apenas se o **mysqld** foi compilado com suporte para `NDB`.

  Você deve notar que iniciar o servidor MySQL com `--binlog-transaction-compression` força essa variável a ser habilitada (`ON`), e que isso substitui qualquer configuração para `--ndb-log-transaction-compression` feita na linha de comando ou em um arquivo `my.cnf`, como mostrado aqui:

  ```
  $> mysqld_safe --ndbcluster --ndb-connectstring=127.0.0.1 \
    --binlog-transaction-compression=ON --ndb-log-transaction-compression=OFF &
  [1] 27667
  $> 2022-07-07T12:29:20.459937Z mysqld_safe Logging to '/usr/local/mysql/data/myhost.err'.
  2022-07-07T12:29:20.509873Z mysqld_safe Starting mysqld daemon with databases from /usr/local/mysql/data

  $> mysql -e 'SHOW VARIABLES LIKE "%transaction_compression%"'
  +--------------------------------------------+-------+
  | Variable_name                              | Value |
  +--------------------------------------------+-------+
  | binlog_transaction_compression             | ON    |
  | binlog_transaction_compression_level_zstd  | 3     |
  | ndb_log_transaction_compression            | ON    |
  | ndb_log_transaction_compression_level_zstd | 3     |
  +--------------------------------------------+-------+
  ```

  Para desabilitar a compressão de transações de log binário apenas para as tabelas `NDB`, defina a variável de sistema `ndb_log_transaction_compression` para `OFF` em uma sessão do **mysql** ou de outro cliente após iniciar o **mysqld**.

  Definir a variável `binlog_transaction_compression` após o início não tem efeito no valor de `ndb_log_transaction_compression`.

  Para obter mais informações sobre a compressão de transações de log binário, como quais eventos são ou não comprimidos, bem como sobre as mudanças de comportamento a serem consideradas ao usar esse recurso, consulte a Seção 7.4.4.5, “Compressão de Transações de Log Binário”.

- `ndb_log_transaction_compression_level_zstd`

  <table summary="Propriedades para ndb-blob-read-batch-bytes"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-blob-read-batch-bytes</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_blob_read_batch_bytes</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>65536</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>0

  O nível de compressão `ZSTD` usado para escrever transações compactadas no log binário da replica, se habilitado por `ndb_log_transaction_compression`. Não é suportado se o **mysqld** não foi compilado com suporte ao motor de armazenamento `NDB`.

  Consulte a Seção 7.4.4.5, “Compressão de Transações de Log Binário”, para obter mais informações.

- `ndb_metadata_check`

  <table summary="Propriedades para ndb-blob-read-batch-bytes"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-blob-read-batch-bytes</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_blob_read_batch_bytes</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>65536</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>1

  `NDB` usa uma thread de fundo para verificar as alterações de metadados a cada `ndb_metadata_check_interval` segundos em comparação com o dicionário de dados do MySQL. Esse thread de detecção de alterações de metadados pode ser desativado definindo `ndb_metadata_check` para `OFF`. O thread está ativado por padrão.

- `ndb_metadata_check_interval`

  <table summary="Propriedades para ndb-blob-read-batch-bytes"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-blob-read-batch-bytes</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_blob_read_batch_bytes</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>65536</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>2

  `NDB` executa um fio de detecção de alterações de metadados em segundo plano para determinar quando o dicionário NDB foi alterado em relação ao dicionário de dados MySQL. Por padrão, o intervalo entre essas verificações é de 60 segundos; isso pode ser ajustado definindo o valor de `ndb_metadata_check_interval`. Para habilitar ou desabilitar o fio, use `ndb_metadata_check`.

- `ndb_metadata_sync`

  <table summary="Propriedades para ndb-blob-read-batch-bytes"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-blob-read-batch-bytes</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_blob_read_batch_bytes</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>65536</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>3

  Definir essa variável faz com que o fio de monitoramento de mudanças substitua quaisquer valores definidos para `ndb_metadata_check` ou `ndb_metadata_check_interval` e entre em um período de detecção contínua de mudanças. Quando o fio verifica que não há mais mudanças a serem detectadas, ele fica parado até que o fio de registro binário tenha terminado a sincronização de todos os objetos detectados. `ndb_metadata_sync` é então definido para `false`, e o fio de monitoramento de mudanças retorna ao comportamento determinado pelas configurações de `ndb_metadata_check` e `ndb_metadata_check_interval`.

  No NDB 8.0.22 e versões posteriores, definir essa variável para `true` faz com que a lista de objetos excluídos seja limpa, e definir para `false` limpa a lista de objetos a serem repetidos.

- `ndb_optimized_node_selection`

  <table summary="Propriedades para ndb-blob-read-batch-bytes"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-blob-read-batch-bytes</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_blob_read_batch_bytes</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>65536</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>4

  Existem duas formas de seleção de nós otimizadas, descritas aqui:

  1. O nó SQL usa promixity para determinar o coordenador da transação; ou seja, o nó de dados "mais próximo" do nó SQL é escolhido como coordenador da transação. Para esse propósito, um nó de dados que tenha uma conexão de memória compartilhada com o nó SQL é considerado "mais próximo" do nó SQL; os próximos mais próximos (em ordem decrescente de proximidade) são: conexão TCP para `localhost`, seguida por conexão TCP de um host diferente de `localhost`.

  2. O fio SQL usa a consciência de distribuição para selecionar o nó de dados. Ou seja, o nó de dados que abriga a partição do clúster acessada pelo primeiro comando de uma determinada transação é usado como coordenador da transação para toda a transação. (Isso só é eficaz se o primeiro comando da transação não acessar mais de uma partição do clúster.)

  Esta opção aceita um dos valores inteiros `0`, `1`, `2` ou `3`. `3` é o padrão. Esses valores afetam a seleção de nós da seguinte forma:

  - `0`: A seleção de nós não está otimizada. Cada nó de dados é empregado como coordenador de transação 8 vezes antes que o fio SQL prossiga para o próximo nó de dados.

  - `1`: A proximidade com o nó SQL é usada para determinar o coordenador da transação.

  - `2`: A conscientização sobre a distribuição é usada para selecionar o coordenador da transação. No entanto, se a primeira declaração da transação acessar mais de uma partição de cluster, o nó SQL retorna ao comportamento de rotação em anel visto quando essa opção é definida como `0`.

  - `3`: Se a consciência de distribuição puder ser usada para determinar o coordenador da transação, então ela é usada; caso contrário, a proximidade é usada para selecionar o coordenador da transação. (Esse é o comportamento padrão.)

  A proximidade é determinada da seguinte forma:

  1. Comece com o valor definido para o parâmetro `Group` (padrão 55).

  2. Para um nó da API que compartilha o mesmo host com outros nós da API, diminua o valor em 1. Considerando o valor padrão para `Group`, o valor efetivo para nós de dados no mesmo host que o nó da API é 54, e para nós de dados remotos 55.

  3. Definir `ndb_data_node_neighbour` reduz ainda mais o valor efetivo `Group` em 50%, fazendo com que esse nó seja considerado o nó mais próximo. Isso é necessário apenas quando todos os nós de dados estão em hosts diferentes daquele que hospeda o nó da API e é desejável dedicar um deles ao nó da API. Nos casos normais, o ajuste padrão descrito anteriormente é suficiente.

  Mudanças frequentes no `ndb_data_node_neighbour` não são aconselháveis, pois isso altera o estado da conexão do cluster e, assim, pode interromper o algoritmo de seleção de novas transações de cada fio até que ele se estabilize.

- `ndb_read_backup`

  <table summary="Propriedades para ndb-blob-read-batch-bytes"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-blob-read-batch-bytes</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_blob_read_batch_bytes</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>65536</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>5

  Ative a leitura de qualquer réplica de fragmento para qualquer tabela `NDB` posteriormente criada; isso melhora significativamente o desempenho da leitura da tabela a um custo relativamente baixo para as escritas.

  Se o nó SQL e o nó de dados usarem o mesmo nome de host ou endereço IP, esse fato é detectado automaticamente, de modo que a preferência é enviar leituras para o mesmo host. Se esses nós estiverem no mesmo host, mas usarem endereços IP diferentes, você pode instruir o nó SQL a usar o nó de dados correto, definindo o valor de `ndb_data_node_neighbour` no nó SQL para o ID do nó de dados.

  Para habilitar ou desabilitar a leitura de qualquer réplica de fragmento para uma tabela individual, você pode definir a opção `NDB_TABLE` `READ_BACKUP` para a tabela conforme necessário, em uma declaração `CREATE TABLE` ou `ALTER TABLE`; consulte a Seção 15.1.20.12, “Definindo Opções de Comentário NDB”, para obter mais informações.

- `ndb_recv_thread_activation_threshold`

  <table summary="Propriedades para ndb-blob-read-batch-bytes"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-blob-read-batch-bytes</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_blob_read_batch_bytes</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>65536</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>6

  Quando esse número de threads ativas simultaneamente é atingido, a thread de recebimento assume a verificação da conexão do cluster.

  Essa variável tem escopo global. Ela também pode ser definida na inicialização.

- `ndb_recv_thread_cpu_mask`

  <table summary="Propriedades para ndb-blob-read-batch-bytes"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-blob-read-batch-bytes</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_blob_read_batch_bytes</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>65536</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>7

  Máscara de CPU para bloquear os threads do receptor em CPUs específicas. Isso é especificado como uma máscara de bits hexadecimal. Por exemplo, `0x33` significa que uma CPU é usada por thread de receptor. Uma string vazia é o padrão; definir `ndb_recv_thread_cpu_mask` para esse valor remove quaisquer bloqueios de thread de receptor previamente definidos.

  Essa variável tem escopo global. Ela também pode ser definida na inicialização.

- `ndb_report_thresh_binlog_epoch_slip`

  <table summary="Propriedades para ndb-blob-read-batch-bytes"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-blob-read-batch-bytes</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_blob_read_batch_bytes</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>65536</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>8

  Isso representa o limite para o número de épocas completamente armazenadas no buffer de eventos, mas ainda não consumidas pelo fio injetor do binlog. Quando esse grau de atraso (lag) é excedido, uma mensagem de status do buffer de eventos é relatada, com `BUFFERED_EPOCHS_OVER_THRESHOLD` fornecido como a razão (veja a Seção 25.6.2.3, “Relatório do Buffer de Eventos no Log do Clúster”). O atraso aumenta quando uma época é recebida dos nós de dados e armazenada completamente no buffer de eventos; diminui quando uma época é consumida pelo fio injetor do binlog, sendo reduzida. Eras vazias são armazenadas e colocadas em fila, e, portanto, incluídas neste cálculo apenas quando isso é habilitado usando o método `Ndb::setEventBufferQueueEmptyEpoch()` da API NDB.

- `ndb_report_thresh_binlog_mem_usage`

  <table summary="Propriedades para ndb-blob-read-batch-bytes"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-blob-read-batch-bytes</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_blob_read_batch_bytes</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>65536</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>9

  Esse é um limite sobre a porcentagem de memória livre restante antes de relatar o status do log binário. Por exemplo, um valor de `10` (o padrão) significa que, se a quantidade de memória disponível para receber dados do log binário dos nós de dados cair abaixo de 10%, uma mensagem de status é enviada para o log do clúster.

- `ndb_row_checksum`

  <table summary="Propriedades para ndb-blob-write-batch-bytes"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-blob-write-batch-bytes</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_blob_write_batch_bytes</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>65536</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>4294967295</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>0

  Tradicionalmente, o `NDB` criou tabelas com verificações de checksum de linha, o que verifica problemas de hardware em detrimento do desempenho. Definir `ndb_row_checksum` para 0 significa que as verificações de checksum de linha *não* são usadas para novas ou alteradas tabelas, o que tem um impacto significativo no desempenho para todos os tipos de consultas. Esta variável é definida para 1 por padrão, para fornecer um comportamento compatível com versões anteriores.

- `ndb_schema_dist_lock_wait_timeout`

  <table summary="Propriedades para ndb-blob-write-batch-bytes"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-blob-write-batch-bytes</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_blob_write_batch_bytes</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>65536</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>4294967295</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>1

  Número de segundos para esperar durante a distribuição do esquema para que o bloqueio de metadados seja tomado em cada nó SQL, a fim de alterar seu dicionário de dados local para refletir a mudança na instrução DDL. Após esse tempo, um aviso é retornado com a mensagem de que o dicionário de dados de um determinado nó SQL não foi atualizado com a mudança. Isso evita que o fio de registro binário espere por um período excessivamente longo ao lidar com operações de esquema.

- `ndb_schema_dist_timeout`

  <table summary="Propriedades para ndb-blob-write-batch-bytes"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-blob-write-batch-bytes</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_blob_write_batch_bytes</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>65536</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>4294967295</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>2

  Número de segundos para esperar antes de detectar um tempo de espera durante a distribuição do esquema. Isso pode indicar que outros nós do SQL estão experimentando atividade excessiva ou que estão sendo impedidos de adquirir os recursos necessários neste momento.

- `ndb_schema_dist_upgrade_allowed`

  <table summary="Propriedades para ndb-blob-write-batch-bytes"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-blob-write-batch-bytes</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_blob_write_batch_bytes</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>65536</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>4294967295</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>3

  Permitir a atualização da tabela de distribuição do esquema ao se conectar ao `NDB`. Quando verdadeiro (padrão), essa alteração é adiada até que todos os nós SQL tenham sido atualizados para a mesma versão do software do NDB Cluster.

  Nota

  O desempenho da distribuição do esquema pode ser um pouco degradado até que a atualização seja realizada.

- `ndb_show_foreign_key_mock_tables`

  <table summary="Propriedades para ndb-blob-write-batch-bytes"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-blob-write-batch-bytes</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_blob_write_batch_bytes</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>65536</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>4294967295</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>4

  Mostre as tabelas fictícias usadas por `NDB` para suportar `foreign_key_checks=0`. Quando isso estiver habilitado, avisos extras são mostrados ao criar e excluir as tabelas. O nome real (interno) da tabela pode ser visto na saída de `SHOW CREATE TABLE`.

- `ndb_slave_conflict_role`

  <table summary="Propriedades para ndb-blob-write-batch-bytes"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-blob-write-batch-bytes</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_blob_write_batch_bytes</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>65536</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>4294967295</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>5

  Desatualizado no NDB 8.0.23 e sujeito à remoção em uma futura versão. Use `ndb_conflict_role` em vez disso.

- `ndb_table_no_logging`

  <table summary="Propriedades para ndb-blob-write-batch-bytes"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-blob-write-batch-bytes</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_blob_write_batch_bytes</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>65536</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>4294967295</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>6

  Quando essa variável é definida como `ON` ou `1`, todas as tabelas criadas ou alteradas usando `ENGINE NDB` tornam-se não-registradas; ou seja, nenhuma alteração de dados dessa tabela é escrita no log de refazer ou arquivada no disco, assim como se a tabela tivesse sido criada ou alterada usando a opção `NOLOGGING` para `CREATE TABLE` ou `ALTER TABLE`.

  Para obter mais informações sobre tabelas não registradas `NDB`, consulte Opções de NDB\_TABLE.

  `ndb_table_no_logging` não tem efeito na criação de arquivos de esquema de tabela `NDB`; para suprimi-los, use `ndb_table_temporary` em vez disso.

- `ndb_table_temporary`

  <table summary="Propriedades para ndb-blob-write-batch-bytes"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-blob-write-batch-bytes</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_blob_write_batch_bytes</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>65536</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>4294967295</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>7

  Quando definido como `ON` ou `1`, essa variável faz com que as tabelas `NDB` não sejam escritas em disco: Isso significa que nenhum arquivo de esquema de tabela é criado e as tabelas não são registradas.

  Nota

  Definir essa variável atualmente não tem efeito. Esse é um problema conhecido; veja o Bug #34036.

- `ndb_use_copying_alter_table`

  <table summary="Propriedades para ndb-blob-write-batch-bytes"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-blob-write-batch-bytes</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_blob_write_batch_bytes</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>65536</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>4294967295</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>8

  Força `NDB` a usar a cópia de tabelas em caso de problemas com operações online `ALTER TABLE`. O valor padrão é `OFF`.

- `ndb_use_exact_count`

  <table summary="Propriedades para ndb-blob-write-batch-bytes"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-blob-write-batch-bytes</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_blob_write_batch_bytes</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>65536</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>4294967295</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>9

  Força o `NDB` a usar um contagem de registros durante o planejamento da consulta `SELECT COUNT(*)` para acelerar esse tipo de consulta. O valor padrão é `OFF`, que permite consultas mais rápidas no geral.

- `ndb_use_transactions`

  <table summary="Propriedades para ndb-connectstring"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-connectstring</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>0

  Você pode desativar o suporte para transações `NDB` definindo o valor desta variável para `OFF`. Geralmente, isso não é recomendado, embora possa ser útil desativar o suporte para transações dentro de uma sessão de cliente específica quando essa sessão for usada para importar um ou mais arquivos de dump com transações grandes; isso permite que uma inserção de várias linhas seja executada em partes, em vez de como uma única transação. Nesses casos, uma vez que a importação tenha sido concluída, você deve reiniciar o valor da variável para essa sessão para `ON`, ou simplesmente encerrar a sessão.

- `ndb_version`

  <table summary="Propriedades para ndb-connectstring"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-connectstring</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>1

  Versão do motor `NDB`, como um inteiro composto.

- `ndb_version_string`

  <table summary="Propriedades para ndb-connectstring"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-connectstring</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>2

  Versão do motor `NDB` no formato `ndb-x.y.z`.

- `replica_allow_batching`

  <table summary="Propriedades para ndb-connectstring"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-connectstring</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>3

  Se as atualizações em lote estão habilitadas ou não nas réplicas do NDB Cluster. A partir do NDB 8.0.26, você deve usar `replica_allow_batching` no lugar de `slave_allow_batching`, que está desatualizado nessa versão.

  Permitir atualizações em lote na replica melhora significativamente o desempenho, especialmente ao replicar as colunas `TEXT`, `BLOB` e `JSON`. Por essa razão, `replica_allow_batching` é habilitado por padrão no NDB 8.0.30 e versões posteriores.

  Definir essa variável tem efeito apenas ao usar a replicação com o mecanismo de armazenamento `NDB`; no MySQL Server 8.0, ele está presente, mas não faz nada. Para mais informações, consulte a Seção 25.7.6, “Iniciando a replicação do NDB Cluster (Canal de replicação único”)”).

- `ndb_replica_batch_size`

  <table summary="Propriedades para ndb-connectstring"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-connectstring</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>4

  Determina o tamanho do lote em bytes usado pelo fio aplicador de replicação. No NDB 8.0.30 e versões posteriores, defina essa variável em vez da opção `--ndb-batch-size` para aplicar essa configuração à replica, excluindo quaisquer outras sessões.

  Se essa variável não for definida (padrão: 2 MB), seu valor efetivo será o maior entre o valor de `--ndb-batch-size` e 2 MB.

- `ndb_replica_blob_write_batch_bytes`

  <table summary="Propriedades para ndb-connectstring"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-connectstring</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>5

  Controle o tamanho do lote de escrita usado para dados blob pelo fio do aplicativo de replicação.

  A partir do NDB 8.0.30, você deve definir essa variável em vez da opção `--ndb-blob-write-batch-bytes` para controlar o tamanho do lote de blobs na replica, excluindo quaisquer outras sessões. A razão para isso é que, quando `ndb_replica_blob_write_batch_bytes` não é definido, o tamanho efetivo do lote de blobs (ou seja, o número máximo de bytes pendentes para serem escritos para as colunas de blobs) é determinado pelo maior valor de `--ndb-blob-write-batch-bytes` e 2 MB (o padrão para `ndb_replica_blob_write_batch_bytes`).

  Definir `ndb_replica_blob_write_batch_bytes` para 0 significa que `NDB` não impõe limite ao tamanho das gravações em lote de blobs na replica.

- `server_id_bits`

  <table summary="Propriedades para ndb-connectstring"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-connectstring</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>6

  Essa variável indica o número de bits menos significativos dentro do `server_id` de 32 bits que realmente identificam o servidor. Indicar que o servidor é realmente identificado por menos de 32 bits permite que alguns dos bits restantes sejam usados para outros propósitos, como armazenar dados do usuário gerados por aplicativos que utilizam a API de Eventos da NDB dentro do `AnyValue` de uma estrutura `OperationOptions` (o NDB Cluster usa o `AnyValue` para armazenar o ID do servidor).

  Ao extrair o ID do servidor efetivo de `server_id` para fins como a detecção de loops de replicação, o servidor ignora os bits restantes. A variável `server_id_bits` é usada para mascarar quaisquer bits irrelevantes de `server_id` nos threads de I/O e SQL ao decidir se um evento deve ser ignorado com base no ID do servidor.

  Esses dados podem ser lidos do log binário pelo **mysqlbinlog**, desde que ele seja executado com sua própria variável `server_id_bits` definida como 32 (o padrão).

  Se o valor de `server_id` for maior ou igual a 2 elevado a `server_id_bits`; caso contrário, o **mysqld** se recusa a iniciar.

  Essa variável de sistema é suportada apenas pelo NDB Cluster. Não é suportada no servidor padrão MySQL 8.0.

- `slave_allow_batching`

  <table summary="Propriedades para ndb-connectstring"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-connectstring</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>7

  Se as atualizações em lote estão habilitadas ou não nas réplicas do NDB Cluster. A partir do NDB 8.0.26, essa variável está desatualizada e você deve usar `replica_allow_batching` em vez disso.

  Permitir atualizações em lote na replica melhora significativamente o desempenho, especialmente ao replicar as colunas `TEXT`, `BLOB` e `JSON`. Por essa razão, `replica_allow_batching` é `ON` por padrão no NDB 8.0.30 e versões posteriores. Além disso, a partir do NDB 8.0.30, uma mensagem de aviso é emitida sempre que essa variável for definida como `OFF`.

  Definir essa variável tem efeito apenas ao usar a replicação com o mecanismo de armazenamento `NDB`; no MySQL Server 8.0, ele está presente, mas não faz nada. Para mais informações, consulte a Seção 25.7.6, “Iniciando a replicação do NDB Cluster (Canal de replicação único”)”).

- `transaction_allow_batching`

  <table summary="Propriedades para ndb-connectstring"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-connectstring</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>8

  Quando definido para `1` ou `ON`, essa variável permite a agrupamento de declarações dentro da mesma transação. Para usar essa variável, `autocommit` deve ser desativado primeiro, definindo-o para `0` ou `OFF`; caso contrário, definir `transaction_allow_batching` não terá efeito.

  É seguro usar essa variável em transações que realizam apenas escritas, pois a ativação pode levar a leituras da imagem "antes". Você deve garantir que quaisquer transações pendentes sejam confirmadas (usando um `COMMIT` explícito, se desejar) antes de emitir um `SELECT`.

  Importante

  `transaction_allow_batching` não deve ser usado sempre que houver a possibilidade de que os efeitos de uma determinada declaração dependam do resultado de uma declaração anterior dentro da mesma transação.

  Esta variável é atualmente suportada apenas para o NDB Cluster.

As variáveis do sistema na lista a seguir estão todas relacionadas ao banco de dados de informações `ndbinfo`.

- `ndbinfo_database`

  <table summary="Propriedades para ndb-connectstring"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-connectstring</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>9

  Mostra o nome usado para o banco de dados de informações `NDB`; o padrão é `ndbinfo`. Esta é uma variável de leitura somente, cujo valor é determinado no momento da compilação.

- `ndbinfo_max_bytes`

  <table summary="Propriedades para ndb-default-column-format"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-default-column-format={FIXED|DYNAMIC}</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_default_column_format</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FIXED</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>FIXED</code>]]</p><p class="valid-value">[[<code>DYNAMIC</code>]]</p></td> </tr></tbody></table>0

  Usado apenas para testes e depuração.

- `ndbinfo_max_rows`

  <table summary="Propriedades para ndb-default-column-format"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-default-column-format={FIXED|DYNAMIC}</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_default_column_format</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FIXED</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>FIXED</code>]]</p><p class="valid-value">[[<code>DYNAMIC</code>]]</p></td> </tr></tbody></table>1

  Usado apenas para testes e depuração.

- `ndbinfo_offline`

  <table summary="Propriedades para ndb-default-column-format"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-default-column-format={FIXED|DYNAMIC}</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_default_column_format</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FIXED</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>FIXED</code>]]</p><p class="valid-value">[[<code>DYNAMIC</code>]]</p></td> </tr></tbody></table>2

  Coloque o banco de dados `ndbinfo` no modo offline, no qual as tabelas e visualizações podem ser abertas mesmo quando não existem na verdade, ou quando existem, mas têm definições diferentes em `NDB`. Não são retornadas linhas dessas tabelas (ou visualizações).

- `ndbinfo_show_hidden`

  <table summary="Propriedades para ndb-default-column-format"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-default-column-format={FIXED|DYNAMIC}</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_default_column_format</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FIXED</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>FIXED</code>]]</p><p class="valid-value">[[<code>DYNAMIC</code>]]</p></td> </tr></tbody></table>3

  Se as tabelas internas subjacentes do banco de dados `ndbinfo` são ou não exibidas no cliente **mysql**. O padrão é `OFF`.

  Nota

  Quando o `ndbinfo_show_hidden` está ativado, as tabelas internas são exibidas apenas no banco de dados `ndbinfo`; elas não são visíveis em `TABLES` ou em outras tabelas `INFORMATION_SCHEMA`, independentemente da configuração da variável.

- `ndbinfo_table_prefix`

  <table summary="Propriedades para ndb-default-column-format"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-default-column-format={FIXED|DYNAMIC}</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_default_column_format</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FIXED</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>FIXED</code>]]</p><p class="valid-value">[[<code>DYNAMIC</code>]]</p></td> </tr></tbody></table>4

  O prefixo usado para nomear as tabelas de base do banco de dados ndbinfo (normalmente oculto, a menos que seja exposto definindo `ndbinfo_show_hidden`). Esta é uma variável de leitura somente, cujo valor padrão é `ndb$`; o próprio prefixo é determinado no momento da compilação.

- `ndbinfo_version`

  <table summary="Propriedades para ndb-default-column-format"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb-default-column-format={FIXED|DYNAMIC}</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ndb_default_column_format</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FIXED</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>FIXED</code>]]</p><p class="valid-value">[[<code>DYNAMIC</code>]]</p></td> </tr></tbody></table>5

  Mostra a versão do motor `ndbinfo` em uso; apenas leitura.

##### 25.4.3.9.3 Variáveis de Status do Agrupamento do BND

Esta seção fornece informações detalhadas sobre as variáveis de status do servidor MySQL que se relacionam ao NDB Cluster e ao motor de armazenamento `NDB`. Para variáveis de status que não são específicas do NDB Cluster e para informações gerais sobre o uso de variáveis de status, consulte a Seção 7.1.10, “Variáveis de Status do Servidor”.

- `Handler_discover`

  O servidor MySQL pode perguntar ao mecanismo de armazenamento `NDBCLUSTER` se ele conhece uma tabela com um nome dado. Isso é chamado de descoberta. `Handler_discover` indica o número de vezes que as tabelas foram descobertas usando esse mecanismo.

- `Ndb_api_adaptive_send_deferred_count`

  Número de chamadas de envio adaptativas que não foram realmente enviadas.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_adaptive_send_deferred_count_session`

  Número de chamadas de envio adaptativas que não foram realmente enviadas.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_adaptive_send_deferred_count_replica`

  Número de chamadas de envio adaptativas que não foram realmente enviadas por esta réplica.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_adaptive_send_deferred_count_slave`

  Nota

  Desatualizado em NDB 8.0.23; use `Ndb_api_adaptive_send_deferred_count_replica` em vez disso.

  Número de chamadas de envio adaptativas que não foram realmente enviadas por esta réplica.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_adaptive_send_forced_count`

  Número de chamadas de envio adaptativas enviadas por meio do envio forçado por este servidor MySQL (nó SQL).

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_adaptive_send_forced_count_session`

  Número de chamadas de envio adaptativas com envio forçado nesta sessão do cliente.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_adaptive_send_forced_count_replica`

  Número de chamadas de envio adaptativas enviadas por esta réplica usando o envio forçado.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_adaptive_send_forced_count_slave`

  Nota

  Desatualizado em NDB 8.0.23; use `Ndb_api_adaptive_send_forced_count_replica` em vez disso.

  Número de chamadas de envio adaptativas enviadas por esta réplica usando o envio forçado.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_adaptive_send_unforced_count`

  Número de chamadas de envio adaptativas sem envio forçado enviadas por este servidor MySQL (nó SQL).

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_adaptive_send_unforced_count_session`

  Número de chamadas de envio adaptativas sem envio forçado nesta sessão do cliente.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_adaptive_send_unforced_count_replica`

  Número de chamadas de envio adaptativas sem envio forçado enviadas por esta réplica.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_adaptive_send_unforced_count_slave`

  Nota

  Desatualizado em NDB 8.0.23; use `Ndb_api_adaptive_send_unforced_count_replica` em vez disso.

  Número de chamadas de envio adaptativas sem envio forçado enviadas por esta réplica.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_bytes_sent_count_session`

  Quantidade de dados (em bytes) enviados para os nós de dados nesta sessão do cliente.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste **mysqld**.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_bytes_sent_count_replica`

  Quantidade de dados (em bytes) enviados para os nós de dados por esta réplica.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_bytes_sent_count_slave`

  Nota

  Desatualizado em NDB 8.0.23; use `Ndb_api_bytes_sent_count_replica` em vez disso.

  Quantidade de dados (em bytes) enviados para os nós de dados por esta réplica.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_bytes_sent_count`

  Quantidade de dados (em bytes) enviados para os nós de dados por este servidor MySQL (nó SQL).

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_bytes_received_count_session`

  Quantidade de dados (em bytes) recebidos dos nós de dados nesta sessão do cliente.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste **mysqld**.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_bytes_received_count_replica`

  Quantidade de dados (em bytes) recebidos dos nós de dados por esta réplica.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_bytes_received_count_slave`

  Nota

  Desatualizado em NDB 8.0.23; use `Ndb_api_bytes_received_count_replica` em vez disso.

  Quantidade de dados (em bytes) recebidos dos nós de dados por esta réplica.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_bytes_received_count`

  Quantidade de dados (em bytes) recebidos dos nós de dados deste servidor MySQL (nó SQL).

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_event_data_count_injector`

  O número de eventos de alteração de linha recebidos pelo fio de injeção binlog do NDB.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_event_data_count`

  O número de eventos de mudança de linha recebidos por este servidor MySQL (nó SQL).

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_event_nondata_count_injector`

  O número de eventos recebidos, exceto eventos de alteração de linha, pelo fio de injeção de log binário do NDB.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_event_nondata_count`

  O número de eventos recebidos, além dos eventos de mudança de linha, por este servidor MySQL (nó SQL).

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_event_bytes_count_injector`

  O número de bytes de eventos recebidos pelo fio de injeção binlog do NDB.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_event_bytes_count`

  O número de bytes de eventos recebidos por este servidor MySQL (nó SQL).

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_pk_op_count_session`

  O número de operações nesta sessão do cliente com base em ou usando chaves primárias. Isso inclui operações em tabelas de blob, operações de desbloqueio implícitas e operações de autoincremento, além das operações de chave primária visíveis pelo usuário.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste **mysqld**.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_pk_op_count_replica`

  O número de operações dessa replica baseada em ou usando chaves primárias. Isso inclui operações em tabelas de blob, operações de desbloqueio implícitas e operações de autoincremento, além das operações de chave primária visíveis pelo usuário.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_pk_op_count_slave`

  Nota

  Desatualizado em NDB 8.0.23; use `Ndb_api_pk_op_count_replica` em vez disso.

  O número de operações dessa replica baseada em ou usando chaves primárias. Isso inclui operações em tabelas de blob, operações de desbloqueio implícitas e operações de autoincremento, além das operações de chave primária visíveis pelo usuário.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_pk_op_count`

  O número de operações deste servidor MySQL (nó SQL) com base em ou usando chaves primárias. Isso inclui operações em tabelas blob, operações de desbloqueio implícitas e operações de autoincremento, além das operações de chave primária visíveis pelo usuário.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_pruned_scan_count_session`

  O número de varreduras nesta sessão do cliente que foram reduzidas a uma única partição.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste **mysqld**.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_pruned_scan_count_replica`

  O número de varreduras desta réplica que foram reduzidas a uma única partição.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_pruned_scan_count_slave`

  Nota

  Desatualizado em NDB 8.0.23; use `Ndb_api_pruned_scan_count_replica` em vez disso.

  O número de varreduras desta réplica que foram reduzidas a uma única partição.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_pruned_scan_count`

  O número de varreduras deste servidor MySQL (nó SQL) que foram reduzidas a uma única partição.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_range_scan_count_session`

  O número de varreduras de alcance iniciadas nesta sessão do cliente.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste **mysqld**.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_range_scan_count_replica`

  O número de varreduras de alcance iniciadas por esta réplica.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_range_scan_count_slave`

  Nota

  Desatualizado em NDB 8.0.23; use `Ndb_api_range_scan_count_replica` em vez disso.

  O número de varreduras de alcance iniciadas por esta réplica.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_range_scan_count`

  O número de varreduras de alcance iniciadas por este servidor MySQL (nó SQL).

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_read_row_count_session`

  O número total de linhas que foram lidas nesta sessão do cliente. Isso inclui todas as linhas lidas por qualquer chave primária, chave única ou operação de varredura realizada nesta sessão do cliente.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste **mysqld**.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_read_row_count_replica`

  O número total de linhas que foram lidas por esta réplica. Isso inclui todas as linhas lidas por qualquer chave primária, chave única ou operação de varredura realizada por esta réplica.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_read_row_count_slave`

  Nota

  Desatualizado em NDB 8.0.23; use `Ndb_api_read_row_count_replica` em vez disso.

  O número total de linhas que foram lidas por esta réplica. Isso inclui todas as linhas lidas por qualquer chave primária, chave única ou operação de varredura realizada por esta réplica.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_read_row_count`

  O número total de linhas que foram lidas por este servidor MySQL (nó SQL). Isso inclui todas as linhas lidas por qualquer chave primária, chave única ou operação de varredura realizada por este servidor MySQL (nó SQL).

  Você deve estar ciente de que esse valor pode não ser completamente preciso em relação às linhas lidas por consultas `SELECT` `COUNT(*)`, devido ao fato de que, neste caso, o servidor MySQL realmente lê pseudo-linhas na forma `[table fragment ID]:[number of rows in fragment]` e soma as linhas por fragmento para todos os fragmentos na tabela para derivar um contagem estimada para todas as linhas. `Ndb_api_read_row_count` usa essa estimativa e não o número real de linhas na tabela.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_scan_batch_count_session`

  O número de lotes de linhas recebidos nesta sessão do cliente. Um lote é definido como um conjunto de resultados de varredura de um único fragmento.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste **mysqld**.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_scan_batch_count_replica`

  O número de lotes de linhas recebidos por esta réplica. 1 lote é definido como 1 conjunto de resultados de varredura de um único fragmento.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_scan_batch_count_slave`

  Nota

  Desatualizado em NDB 8.0.23; use `Ndb_api_scan_batch_count_replica` em vez disso.

  O número de lotes de linhas recebidos por esta réplica. 1 lote é definido como 1 conjunto de resultados de varredura de um único fragmento.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_scan_batch_count`

  O número de lotes de linhas recebidos por este servidor MySQL (nó SQL). 1 lote é definido como 1 conjunto de resultados de varredura de um único fragmento.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_table_scan_count_session`

  O número de varreduras de tabela iniciadas nesta sessão do cliente, incluindo varreduras de tabelas internas.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste **mysqld**.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_table_scan_count_replica`

  O número de varreduras de tabela iniciadas por esta réplica, incluindo varreduras de tabelas internas.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_table_scan_count_slave`

  Nota

  Desatualizado em NDB 8.0.23; use `Ndb_api_table_scan_count_replica` em vez disso.

  O número de varreduras de tabela iniciadas por esta réplica, incluindo varreduras de tabelas internas.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_table_scan_count`

  O número de varreduras de tabela iniciadas por este servidor MySQL (nó SQL), incluindo varreduras de tabelas internas.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_trans_abort_count_session`

  Número de transações abortadas nesta sessão do cliente.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste **mysqld**.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_trans_abort_count_replica`

  Número de transações abortadas por esta réplica.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_trans_abort_count_slave`

  Nota

  Desatualizado em NDB 8.0.23; use `Ndb_api_trans_abort_count_replica` em vez disso.

  Número de transações abortadas por esta réplica.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_trans_abort_count`

  Número de transações abortadas por este servidor MySQL (nó SQL).

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_trans_close_count_session`

  O número de transações concluídas nesta sessão do cliente. Esse valor pode ser maior que a soma de `Ndb_api_trans_commit_count_session` e `Ndb_api_trans_abort_count_session`, pois algumas transações podem ter sido revertidas.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste **mysqld**.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_trans_close_count_replica`

  O número de transações concluídas por esta réplica. Esse valor pode ser maior que a soma de `Ndb_api_trans_commit_count_replica` e `Ndb_api_trans_abort_count_replica`, pois algumas transações podem ter sido revertidas.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_trans_close_count_slave`

  Nota

  Desatualizado em NDB 8.0.23; use `Ndb_api_trans_close_count_replica` em vez disso.

  O número de transações concluídas por esta réplica. Esse valor pode ser maior que a soma de `Ndb_api_trans_commit_count_replica` e `Ndb_api_trans_abort_count_replica`, pois algumas transações podem ter sido revertidas.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_trans_close_count`

  O número de transações concluídas por este servidor MySQL (nó SQL). Esse valor pode ser maior que a soma de `Ndb_api_trans_commit_count` e `Ndb_api_trans_abort_count`, pois algumas transações podem ter sido revertidas.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_trans_commit_count_session`

  O número de transações realizadas nesta sessão do cliente.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste **mysqld**.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_trans_commit_count_replica`

  O número de transações realizadas por esta réplica.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_trans_commit_count_slave`

  Nota

  Desatualizado em NDB 8.0.23; use `Ndb_api_trans_commit_count_replica` em vez disso.

  O número de transações realizadas por esta réplica.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_trans_commit_count`

  O número de transações realizadas por este servidor MySQL (nó SQL).

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_trans_local_read_row_count_session`

  O número total de linhas que foram lidas nesta sessão do cliente. Isso inclui todas as linhas lidas por qualquer chave primária, chave única ou operação de varredura realizada nesta sessão do cliente.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste **mysqld**.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_trans_local_read_row_count_replica`

  O número total de linhas que foram lidas por esta réplica. Isso inclui todas as linhas lidas por qualquer chave primária, chave única ou operação de varredura realizada por esta réplica.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_trans_local_read_row_count_slave`

  Nota

  Desatualizado em NDB 8.0.23; use `Ndb_api_trans_local_read_row_count_replica` em vez disso.

  O número total de linhas que foram lidas por esta réplica. Isso inclui todas as linhas lidas por qualquer chave primária, chave única ou operação de varredura realizada por esta réplica.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_trans_local_read_row_count`

  O número total de linhas que foram lidas por este servidor MySQL (nó SQL). Isso inclui todas as linhas lidas por qualquer chave primária, chave única ou operação de varredura realizada por este servidor MySQL (nó SQL).

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_trans_start_count_session`

  O número de transações iniciadas nesta sessão do cliente.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste **mysqld**.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_trans_start_count_replica`

  O número de transações iniciadas por esta réplica.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_trans_start_count_slave`

  Nota

  Desatualizado em NDB 8.0.23; use `Ndb_api_trans_start_count_replica` em vez disso.

  O número de transações iniciadas por esta réplica.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_trans_start_count`

  O número de transações iniciadas por este servidor MySQL (nó SQL).

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_uk_op_count_session`

  O número de operações nesta sessão do cliente com base em ou usando chaves únicas.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste **mysqld**.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_uk_op_count_replica`

  O número de operações realizadas por esta réplica com base em ou usando chaves únicas.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_uk_op_count_slave`

  Nota

  Desatualizado em NDB 8.0.23; use `Ndb_api_uk_op_count_replica` em vez disso.

  O número de operações realizadas por esta réplica com base em ou usando chaves únicas.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_uk_op_count`

  O número de operações deste servidor MySQL (nó SQL) com base em ou usando chaves únicas.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_wait_exec_complete_count_session`

  O número de vezes que um fio foi bloqueado nesta sessão do cliente enquanto aguardava a execução de uma operação para ser concluída. Isso inclui todas as chamadas `execute()` e execuções implícitas para operações de blob e autoincremento que não são visíveis para os clientes.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste **mysqld**.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_wait_exec_complete_count_replica`

  O número de vezes que um fio foi bloqueado por esta replica enquanto aguardava a execução de uma operação para ser concluída. Isso inclui todas as chamadas `execute()` e execuções implícitas para operações de blob e auto-incremento que não são visíveis para os clientes.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_wait_exec_complete_count_slave`

  Nota

  Desatualizado em NDB 8.0.23; use `Ndb_api_wait_exec_complete_count_replica` em vez disso.

  O número de vezes que um fio foi bloqueado por esta replica enquanto aguardava a execução de uma operação para ser concluída. Isso inclui todas as chamadas `execute()` e execuções implícitas para operações de blob e auto-incremento que não são visíveis para os clientes.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_wait_exec_complete_count`

  O número de vezes que um fio foi bloqueado por este servidor MySQL (nó SQL) enquanto aguardava a conclusão de uma operação. Isso inclui todas as chamadas `execute()` e execuções implícitas para operações de blob e autoincremento que não são visíveis para os clientes.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_wait_meta_request_count_session`

  O número de vezes que um fio foi bloqueado nesta sessão do cliente enquanto aguardava por um sinal baseado em metadados, como o esperado para solicitações de DDL, novas épocas e apreensão de registros de transações.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste **mysqld**.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_wait_meta_request_count_replica`

  O número de vezes que um fio foi bloqueado por essa replica enquanto aguardava por um sinal baseado em metadados, como o esperado para solicitações de DDL, novas épocas e apreensão de registros de transações.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_wait_meta_request_count_slave`

  Nota

  Desatualizado em NDB 8.0.23; use `Ndb_api_wait_meta_request_count_replica` em vez disso.

  O número de vezes que um fio foi bloqueado por essa replica enquanto aguardava por um sinal baseado em metadados, como o esperado para solicitações de DDL, novas épocas e apreensão de registros de transações.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_wait_meta_request_count`

  O número de vezes que um fio foi bloqueado por este servidor MySQL (nó SQL) aguardando um sinal baseado em metadados, como o esperado para solicitações de DDL, novas épocas e apreensão de registros de transação.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_wait_nanos_count_session`

  Tempo total (em nanosegundos) gasto nesta sessão do cliente esperando por qualquer tipo de sinal dos nós de dados.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste **mysqld**.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_wait_nanos_count_replica`

  Tempo total (em nanosegundos) gasto por esta réplica esperando qualquer tipo de sinal dos nós de dados.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_wait_nanos_count_slave`

  Nota

  Desatualizado em NDB 8.0.23; use `Ndb_api_wait_nanos_count_replica` em vez disso.

  Tempo total (em nanosegundos) gasto por esta réplica esperando qualquer tipo de sinal dos nós de dados.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_wait_nanos_count`

  O tempo total (em nanosegundos) gasto por este servidor MySQL (nó SQL) esperando por qualquer tipo de sinal dos nós de dados.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_wait_scan_result_count_session`

  O número de vezes que um fio foi bloqueado nesta sessão do cliente enquanto aguardava por um sinal baseado em varredura, como quando está aguardando mais resultados de uma varredura ou quando está aguardando que a varredura seja concluída.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por nenhum outro cliente deste **mysqld**.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_wait_scan_result_count_replica`

  O número de vezes que um fio foi bloqueado por esta réplica enquanto aguardava por um sinal baseado em varredura, como quando está aguardando mais resultados de uma varredura ou quando está aguardando que a varredura seja concluída.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_wait_scan_result_count_slave`

  Nota

  Desatualizado em NDB 8.0.23; use `Ndb_api_wait_scan_result_count_replica` em vez disso.

  O número de vezes que um fio foi bloqueado por esta réplica enquanto aguardava por um sinal baseado em varredura, como quando está aguardando mais resultados de uma varredura ou quando está aguardando que a varredura seja concluída.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se esse servidor MySQL não atuar como replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_api_wait_scan_result_count`

  O número de vezes que um fio foi bloqueado por este servidor MySQL (nó SQL) enquanto aguardava por um sinal baseado em varredura, como quando está aguardando mais resultados de uma varredura ou quando está aguardando que uma varredura seja concluída.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global.

  Para obter mais informações, consulte a Seção 25.6.15, “Contas e variáveis de estatísticas da API NDB”.

- `Ndb_cluster_node_id`

  Se o servidor estiver atuando como um nó do NDB Cluster, então o valor desta variável será o ID do nó no cluster.

  Se o servidor não faz parte de um NDB Cluster, o valor desta variável é 0.

- `Ndb_config_from_host`

  Se o servidor faz parte de um NDB Cluster, o valor desta variável é o nome do host ou o endereço IP do servidor de gerenciamento do Cluster, a partir do qual ele obtém seus dados de configuração.

  Se o servidor não faz parte de um NDB Cluster, o valor desta variável será uma string vazia.

- `Ndb_config_from_port`

  Se o servidor faz parte de um NDB Cluster, o valor desta variável é o número da porta através da qual ele está conectado ao servidor de gerenciamento do Cluster, do qual ele obtém seus dados de configuração.

  Se o servidor não faz parte de um NDB Cluster, o valor desta variável é 0.

- `Ndb_config_generation`

  Mostra o número de geração da configuração atual do cluster. Isso pode ser usado como um indicador para determinar se a configuração do cluster mudou desde que esse nó SQL se conectou ao cluster pela última vez.

- `Ndb_conflict_fn_epoch`

  Utilizada na resolução de conflitos da replicação em clúster do NDB, essa variável mostra o número de linhas encontradas em conflito usando a resolução de conflitos `NDB$EPOCH()` em um determinado **mysqld** desde a última vez que ele foi reiniciado.

  Para obter mais informações, consulte a Seção 25.7.12, “Resolução de conflitos de replicação de cluster NDB”.

- `Ndb_conflict_fn_epoch_trans`

  Utilizada na resolução de conflitos da replicação em clúster do NDB, essa variável mostra o número de linhas encontradas em conflito usando a resolução de conflitos `NDB$EPOCH_TRANS()` em um determinado **mysqld** desde a última vez que ele foi reiniciado.

  Para obter mais informações, consulte a Seção 25.7.12, “Resolução de conflitos de replicação de cluster NDB”.

- `Ndb_conflict_fn_epoch2`

  Mostra o número de linhas encontradas em conflito na resolução de conflitos da replicação em cluster NDB, quando se usa `NDB$EPOCH2()`, na fonte designada como primária desde a última vez que foi reiniciado.

  Para mais informações, consulte NDB$EPOCH2()").

- `Ndb_conflict_fn_epoch2_trans`

  Utilizada na resolução de conflitos da replicação em clúster do NDB, essa variável mostra o número de linhas encontradas em conflito usando a resolução de conflitos `NDB$EPOCH_TRANS2()` em um determinado **mysqld** desde a última vez que ele foi reiniciado.

  Para mais informações, consulte NDB$EPOCH2\_TRANS()").

- `Ndb_conflict_fn_max`

  Utilizada na resolução de conflitos da replicação em clúster do NDB Cluster, essa variável mostra o número de vezes que uma linha não foi aplicada no nó SQL atual devido à resolução de conflitos “maior timestamp vence” desde a última vez que este **mysqld** foi iniciado.

  Para obter mais informações, consulte a Seção 25.7.12, “Resolução de conflitos de replicação de cluster NDB”.

- `Ndb_conflict_fn_max_del_win`

  Mostra o número de vezes que uma linha foi rejeitada no nó SQL atual devido à resolução de conflitos da replicação do NDB Cluster usando `NDB$MAX_DELETE_WIN()`, desde a última vez que este **mysqld** foi iniciado.

  Para obter mais informações, consulte a Seção 25.7.12, “Resolução de conflitos de replicação de cluster NDB”.

- `Ndb_conflict_fn_max_del_win_ins`

  Mostra o número de vezes que a inserção de uma linha foi rejeitada no nó SQL atual devido à resolução de conflitos da replicação do NDB Cluster usando `NDB$MAX_DEL_WIN_INS()`, desde a última vez que este **mysqld** foi iniciado.

  Para obter mais informações, consulte a Seção 25.7.12, “Resolução de conflitos de replicação de cluster NDB”.

- `Ndb_conflict_fn_max_ins`

  Utilizada na resolução de conflitos da replicação em clúster do NDB, essa variável mostra o número de vezes que uma linha não foi inserida no nó SQL atual devido à resolução de conflitos “o maior timestamp vence” desde a última vez que este **mysqld** foi iniciado.

  Para obter mais informações, consulte a Seção 25.7.12, “Resolução de conflitos de replicação de cluster NDB”.

- `Ndb_conflict_fn_old`

  Utilizada na resolução de conflitos da replicação em clúster do NDB, essa variável mostra o número de vezes que uma linha não foi aplicada como resultado da resolução de conflitos "o mesmo timestamp vence" em um **mysqld** específico desde a última vez que ele foi reiniciado.

  Para obter mais informações, consulte a Seção 25.7.12, “Resolução de conflitos de replicação de cluster NDB”.

- `Ndb_conflict_last_conflict_epoch`

  A época mais recente em que um conflito foi detectado nesta réplica. Você pode comparar esse valor com `Ndb_replica_max_replicated_epoch`; se `Ndb_replica_max_replicated_epoch` for maior que `Ndb_conflict_last_conflict_epoch`, nenhum conflito ainda foi detectado.

  Consulte a Seção 25.7.12, “Resolução de Conflitos de Replicação de Agrupamento NDB”, para obter mais informações.

- `Ndb_conflict_reflected_op_discard_count`

  Ao usar a resolução de conflitos da replicação em clúster NDB, este é o número de operações refletidas que não foram aplicadas no secundário, devido ao erro encontrado durante a execução.

  Consulte a Seção 25.7.12, “Resolução de Conflitos de Replicação de Agrupamento NDB”, para obter mais informações.

- `Ndb_conflict_reflected_op_prepare_count`

  Ao usar a resolução de conflitos com a Replicação em Cluster do NDB, essa variável de status contém o número de operações refletidas que foram definidas (ou seja, preparadas para execução no secundário).

  Consulte a Seção 25.7.12, "Resolução de Conflitos de Replicação de Agrupamento NDB".

- `Ndb_conflict_refresh_op_count`

  Ao usar a resolução de conflitos com a Replicação em Cluster do NDB, isso fornece o número de operações de atualização preparadas para execução no secundário.

  Consulte a Seção 25.7.12, “Resolução de Conflitos de Replicação de Agrupamento NDB”, para obter mais informações.

- `Ndb_conflict_last_stable_epoch`

  Número de linhas encontradas em conflito por uma função de conflito transacional

  Consulte a Seção 25.7.12, “Resolução de Conflitos de Replicação de Agrupamento NDB”, para obter mais informações.

- `Ndb_conflict_trans_row_conflict_count`

  Utilizado na resolução de conflitos da replicação em clúster do NDB, essa variável de status mostra o número de linhas encontradas como estando diretamente em conflito por uma função de conflito transacional em um **mysqld** específico desde a última vez que ele foi reiniciado.

  Atualmente, a única função de detecção de conflitos transacionais suportada pelo NDB Cluster é a NDB$EPOCH\_TRANS(), então essa variável de status é efetivamente a mesma que `Ndb_conflict_fn_epoch_trans`.

  Para obter mais informações, consulte a Seção 25.7.12, “Resolução de conflitos de replicação de cluster NDB”.

- `Ndb_conflict_trans_row_reject_count`

  Utilizado na resolução de conflitos da replicação em clúster do NDB, essa variável de status mostra o número total de linhas realinhadas devido a serem determinadas como conflitantes por uma função de detecção de conflitos transacionais. Isso inclui não apenas `Ndb_conflict_trans_row_conflict_count`, mas também quaisquer linhas em transações conflitantes ou dependentes delas.

  Para obter mais informações, consulte a Seção 25.7.12, “Resolução de conflitos de replicação de cluster NDB”.

- `Ndb_conflict_trans_reject_count`

  Utilizado na resolução de conflitos da replicação em clúster do NDB, essa variável de status mostra o número de transações encontradas como conflitantes por uma função de detecção de conflitos transacionais.

  Para obter mais informações, consulte a Seção 25.7.12, “Resolução de conflitos de replicação de cluster NDB”.

- `Ndb_conflict_trans_detect_iter_count`

  Utilizado na resolução de conflitos da replicação em clúster do NDB, este valor indica o número de iterações internas necessárias para confirmar uma transação de época. Deve ser (levemente) maior ou igual a `Ndb_conflict_trans_conflict_commit_count`.

  Para obter mais informações, consulte a Seção 25.7.12, “Resolução de conflitos de replicação de cluster NDB”.

- `Ndb_conflict_trans_conflict_commit_count`

  Utilizado na resolução de conflitos da replicação em clúster do NDB, este mostra o número de transações de época comprometidas após a necessidade de tratamento de conflitos transacionais.

  Para obter mais informações, consulte a Seção 25.7.12, “Resolução de conflitos de replicação de cluster NDB”.

- `Ndb_epoch_delete_delete_count`

  Ao usar a detecção de conflitos delete-delete, este é o número de conflitos delete-delete detectados, onde uma operação de exclusão é aplicada, mas a linha indicada não existe.

- `Ndb_execute_count`

  Fornece o número de viagens de ida e volta ao kernel `NDB` realizadas pelas operações.

- `Ndb_fetch_table_stats`

  Esse contador é incrementado sempre que um servidor MySQL que atua como um nó da API do NDB Cluster obtém estatísticas de tabela para uma tabela específica, em vez de usar estatísticas armazenadas em cache.

  Essa variável de status foi adicionada no NDB 8.0.27.

- `Ndb_last_commit_epoch_server`

  A época mais recentemente marcada por `NDB`.

- `Ndb_last_commit_epoch_session`

  A época mais recentemente registrada por este cliente `NDB`.

- `Ndb_metadata_detected_count`

  O número de vezes desde que este servidor foi iniciado pela última vez que o fio de detecção de mudanças de metadados do NDB descobriu mudanças em relação ao dicionário de dados do MySQL.

- `Ndb_metadata_excluded_count`

  O número de objetos de metadados que o NDB binlog thread não conseguiu sincronizar neste nó SQL desde que foi reiniciado pela última vez.

  Se um objeto for excluído, ele não será considerado novamente para sincronização automática até que o usuário corrija a incompatibilidade manualmente. Isso pode ser feito tentando usar a tabela com uma declaração como `SHOW CREATE TABLE table`, `SELECT * FROM table` ou qualquer outra declaração que possa desencadear a descoberta da tabela.

  Antes da versão 8.0.22 do NDB, essa variável era chamada de `Ndb_metadata_blacklist_size`.

- `Ndb_metadata_synced_count`

  O número de objetos de metadados do NDB que foram sincronizados neste nó SQL desde que ele foi reiniciado pela última vez.

- `Ndb_number_of_data_nodes`

  Se o servidor faz parte de um NDB Cluster, o valor desta variável é o número de nós de dados no cluster.

  Se o servidor não faz parte de um NDB Cluster, o valor desta variável é 0.

- `Ndb_pushed_queries_defined`

  O número total de junções foi reduzido para o núcleo NDB para o gerenciamento distribuído nos nós de dados.

  Nota

  Os dispositivos que utilizam `EXPLAIN` e podem ser empurrados para baixo contribuem para esse número.

- `Ndb_pushed_queries_dropped`

  O número de junções que foram empurradas para o kernel do NDB, mas que não puderam ser tratadas lá.

- `Ndb_pushed_queries_executed`

  O número de junções foi reduzido com sucesso para `NDB` e executado lá.

- `Ndb_pushed_reads`

  O número de linhas devolvidas ao **mysqld** pelo kernel NDB por junções que foram empurradas para baixo.

  Nota

  A execução de `EXPLAIN` em junções que podem ser reduzidas para `NDB` não aumenta esse número.

- `Ndb_pruned_scan_count`

  Essa variável contém um contador do número de varreduras executadas por `NDBCLUSTER` desde que o NDB Cluster foi iniciado pela última vez, quando `NDBCLUSTER` conseguiu usar o corte de partições.

  Usar essa variável juntamente com `Ndb_scan_count` pode ser útil no design do esquema para maximizar a capacidade do servidor de podar as varreduras em uma única partição da tabela, envolvendo assim apenas um único nó de dados.

- `Ndb_replica_max_replicated_epoch`

  A época mais recentemente comprometida nesta réplica. Você pode comparar esse valor com `Ndb_conflict_last_conflict_epoch`; se `Ndb_replica_max_replicated_epoch` for maior que os dois, nenhum conflito ainda foi detectado.

  Para obter mais informações, consulte a Seção 25.7.12, “Resolução de conflitos de replicação de cluster NDB”.

- `Ndb_scan_count`

  Essa variável contém um contador do número total de varreduras executadas por `NDBCLUSTER` desde que o NDB Cluster foi iniciado pela última vez.

- `Ndb_schema_participant_count`

  Indica o número de servidores MySQL que estão participando da distribuição de alterações no esquema NDB.

  Adicionado na NDB 8.0.42.

- `Ndb_slave_max_replicated_epoch`

  Nota

  Desatualizado em NDB 8.0.23; use `Ndb_slave_max_replicated_epoch` em vez disso.

  A época mais recentemente comprometida nesta réplica. Você pode comparar esse valor com `Ndb_conflict_last_conflict_epoch`; se `Ndb_slave_max_replicated_epoch` for maior que os dois, nenhum conflito ainda foi detectado.

  Para obter mais informações, consulte a Seção 25.7.12, “Resolução de conflitos de replicação de cluster NDB”.

- `Ndb_system_name`

  Se este servidor MySQL estiver conectado a um cluster NDB, essa variável somente de leitura mostrará o nome do sistema do cluster. Caso contrário, o valor será uma string vazia.

- `Ndb_trans_hint_count_session`

  O número de transações que utilizam dicas que foram iniciadas na sessão atual. Compare com `Ndb_api_trans_start_count_session` para obter a proporção de todas as transações NDB que podem usar dicas.
