#### 25.4.3.9 Opções e variáveis do servidor MySQL para NDB Cluster

Esta seção fornece informações sobre as opções do servidor MySQL, variáveis do servidor e de status que são específicas para o NDB Cluster. Para informações gerais sobre o uso dessas opções e para outras opções e variáveis que não são específicas para o NDB Cluster, consulte a Seção 7.1, “O Servidor MySQL”.

Para os parâmetros de configuração do NDB Cluster usados no arquivo de configuração do cluster (geralmente chamado `config.ini`), consulte a Seção 25.4, “Configuração do NDB Cluster”.

##### 25.4.3.9.1 Opções do servidor MySQL para NDB Cluster

Esta seção fornece descrições das opções do servidor **mysqld** relacionadas ao NDB Cluster. Para informações sobre as opções do **mysqld** que não são específicas para o NDB Cluster e para informações gerais sobre o uso de opções com o **mysqld**, consulte a Seção 7.1.7, “Opções de comando do servidor”.

Para informações sobre as opções de linha de comando usadas com outros processos do NDB Cluster, consulte a Seção 25.5, “Programas do NDB Cluster”.

* `--ndbcluster`

  <table frame="box" rules="all" summary="Propriedades para ndbcluster"><tbody><tr><th>Formato de linha de comando</th> <td><code>--ndbcluster[=value]</code></td> </tr><tr><th>Desabilitado por</th> <td><code>skip-ndbcluster</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>OFF</code></p><p><code>FORCE</code></p></td> </tr></tbody></table>

O mecanismo de armazenamento `NDBCLUSTER` é necessário para usar o NDB Cluster. Se um binário do **mysqld** incluir suporte ao mecanismo de armazenamento `NDBCLUSTER`, o mecanismo é desativado por padrão. Use a opção `--ndbcluster` para ativá-lo. Use `--skip-ndbcluster` para desativá-lo explicitamente.

A opção `--ndbcluster` é ignorada (e o mecanismo de armazenamento `NDB` *não* é ativado) se `--initialize` também for usado. (Não é necessário nem desejável usar essa opção junto com `--initialize`.)

* `--ndb-allow-copying-alter-table=[ON|OFF]`

  <table frame="box" rules="all" summary="Propriedades para ndb-allow-copying-alter-table"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--ndb-allow-copying-alter-table[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>ndb_allow_copying_alter_table</code></td> </tr><tr><th>Alcance</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code></code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Deixe que as instruções `ALTER TABLE` e outras instruções DDL usem operações de cópia em tabelas `NDB`. Defina para `OFF` para impedir que isso aconteça; fazer isso pode melhorar o desempenho de aplicações críticas.

* `--ndb-applier-allow-skip-epoch`

<table frame="box" rules="all" summary="Propriedades para ndb-applier-allow-skip-epoch"><tbody><tr><th>Formato de linha de comando</th> <td><code>--ndb-applier-allow-skip-epoch</code></td> </tr><tr><th>Variável do sistema</th> <td><code>ndb_applier_allow_skip_epoch</code></td> </tr><tr><th>Alcance</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dica de sintaxe para <code>SET_VAR</code> é aplicada</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>32768</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>2147483648</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>

  Use junto com `--replica-skip-errors` para fazer com que o `NDB` ignore as transações de epocão ignoradas. Não tem efeito quando usado sozinho.

* `--ndb-batch-size=#`

  <table frame="box" rules="all" summary="Propriedades para ndb-batch-size"><tbody><tr><th>Formato de linha de comando</th> <td><code>--ndb-batch-size</code></td> </tr><tr><th>Variável do sistema</th> <td><code>ndb_batch_size</code></td> </tr><tr><th>Alcance</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Dica de sintaxe para <code>SET_VAR</code> é aplicada</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>32768</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>2147483648</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>

  Isso define o tamanho em bytes que é usado para lotes de transações NDB.

* `--ndb-cluster-connection-pool=#`

  <table frame="box" rules="all" summary="Propriedades para ndb-cluster-connection-pool"><tbody><tr><th>Formato de linha de comando</th> <td><code>--ndb-cluster-connection-pool</code></td> </tr><tr><th>Variável do sistema</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>Variável do sistema</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <code>SET_VAR</code> se aplica</th> <td>Não</td> </tr><tr><th>Hinta de <code>SET_VAR</code> se aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>1</code></td> </tr><tr><th>Valor mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor máximo</th> <td><code>63</code></td> </tr></tbody></table>

  Ao definir essa opção para um valor maior que 1 (o padrão), um processo do **mysqld** pode usar múltiplas conexões ao cluster, imitando efetivamente vários nós SQL. Cada conexão requer sua própria seção `[api]` ou `[mysqld]` no arquivo de configuração do cluster (`config.ini`), e conta para o número máximo de conexões API suportadas pelo cluster.

Suponha que você tenha 2 computadores hospedeiros de clúster, cada um executando um nó SQL cujo processo **mysqld** foi iniciado com `--ndb-cluster-connection-pool=4`; isso significa que o clúster deve ter 8 slots de API disponíveis para essas conexões (em vez de 2). Todas essas conexões são configuradas quando o nó SQL se conecta ao clúster e são alocadas para threads de forma round-robin.

Esta opção é útil apenas quando você está executando **mysqld** em máquinas hospedeiras com múltiplos CPUs, múltiplos núcleos ou ambos. Para obter os melhores resultados, o valor deve ser menor que o número total de núcleos disponíveis na máquina hospedeira. Definir um valor maior que este provavelmente degradará severamente o desempenho.

Importante

Como cada nó SQL que usa o pool de conexões ocupa múltiplos slots de nó API — cada slot com seu próprio ID de nó no clúster —, você *não* deve usar um ID de nó como parte da string de conexão do clúster ao iniciar qualquer processo **mysqld** que utilize o pool de conexões.

Definir um ID de nó na string de conexão ao usar a opção `--ndb-cluster-connection-pool` causa erros de alocação de ID de nó quando o nó SQL tenta se conectar ao clúster.
* `--ndb-cluster-connection-pool-nodeids=list`

<table frame="box" rules="all" summary="Propriedades para ndb-cluster-connection-pool-nodeids">
  <tr><th>Formato de linha de comando</th> <td><code>--ndb-cluster-connection-pool-nodeids</code></td> </tr>
  <tr><th>Variável do sistema</th> <td><code>ndb_cluster_connection_pool_nodeids</code></td> </tr>
  <tr><th>Âmbito</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Definir</td> </tr>
  <tr><th>Valor padrão</th> <td><code></code></td> </tr>
</table>

Especifica uma lista separada por vírgula de IDs de nós para conexões ao cluster usadas por um nó SQL. O número de nós nesta lista deve ser o mesmo que o valor definido para a opção `--ndb-cluster-connection-pool`.

* `--ndb-blob-read-batch-bytes=bytes`

<table frame="box" rules="all" summary="Propriedades para ndb-blob-read-batch-bytes">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--ndb-blob-read-batch-bytes</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>ndb_blob_read_batch_bytes</code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global, Sessão</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Hinta de <code>SET_VAR</code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>65536</code></td>
  </tr>
  <tr>
    <th>Valor Mínimo</th>
    <td><code>0</code></td>
  </tr>
  <tr>
    <th>Valor Máximo</th>
    <td><code>4294967295</code></td>
  </tr>
</table>

  Esta opção pode ser usada para definir o tamanho (em bytes) para o agrupamento de leituras de dados `BLOB` em aplicações do NDB Cluster. Quando esse tamanho de lote é excedido pela quantidade de dados `BLOB` a serem lidos dentro da transação atual, quaisquer operações de leitura de `BLOB` pendentes são executadas imediatamente.

  O valor máximo para esta opção é 4294967295; o valor padrão é 65536. Definí-lo como 0 tem o efeito de desabilitar o agrupamento de leituras de `BLOB`.

  Nota

  Em aplicações da API NDB, você pode controlar o agrupamento de escritas de `BLOB` com os métodos `setMaxPendingBlobReadBytes()` e `getMaxPendingBlobReadBytes()`.

* `--ndb-blob-write-batch-bytes=bytes`

<table frame="box" rules="all" summary="Propriedades para ndb-blob-write-batch-bytes">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--ndb-blob-write-batch-bytes</code></td>
  </tr>
  <tr>
    <th>Variável do sistema</th>
    <td><code>ndb_blob_write_batch_bytes</code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global, Sessão</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Hinta de <code>SET_VAR</code> se aplica</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code>65536</code></td>
  </tr>
  <tr>
    <th>Valor mínimo</th>
    <td><code>0</code></td>
  </tr>
  <tr>
    <th>Valor máximo</th>
    <td><code>4294967295</code></td>
  </tr>
  <tr>
    <th>Unidade</th>
    <td>bytes</td>
  </tr>
</table>

  Esta opção pode ser usada para definir o tamanho (em bytes) para o agrupamento de escritas de dados `BLOB` em aplicações do NDB Cluster. Quando esse tamanho de lote é excedido pela quantidade de dados `BLOB` a serem escritos na transação atual, quaisquer operações de escrita de `BLOB` pendentes são executadas imediatamente.

  O valor máximo para esta opção é 4294967295; o valor padrão é 65536. Definir para 0 tem o efeito de desabilitar o agrupamento de escritas de `BLOB`.

  Nota

  Em aplicações da API NDB, você pode controlar o agrupamento de escritas de `BLOB` com os métodos `setMaxPendingBlobWriteBytes()` e `getMaxPendingBlobWriteBytes()`.

* `--ndb-connectstring=connection_string`

<table frame="box" rules="all" summary="Propriedades para ndb-connectstring">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--ndb-connectstring</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
  </tbody>
</table>

  Ao usar o mecanismo de armazenamento `NDBCLUSTER`, esta opção especifica o servidor de gerenciamento que distribui os dados de configuração do clúster. Consulte a Seção 25.4.3.3, “Strings de Conexão de Clúster NDB”, para a sintaxe.

* `--ndb-default-column-format=[FIXED|DYNAMIC]`

  <table frame="box" rules="all" summary="Propriedades para ndb-default-column-format">
    <tr>
      <th>Formato de Linha de Comando</th>
      <td><code>--ndb-default-column-format={FIXED|DYNAMIC}</code></td>
    </tr>
    <tr>
      <th>Variável do Sistema</th>
      <td>ndb_default_column_format</td>
    </tr>
    <tr>
      <th>Alcance</th>
      <td>Global</td>
    </tr>
    <tr>
      <th>Dinâmico</th>
      <td>Sim</td>
    </tr>
    <tr>
      <th>Hinta de SET_VAR Aplica-se</th>
      <td>Não</td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>Enumeração</td>
    </tr>
    <tr>
      <th>Valor Padrão</th>
      <td><code>FIXED</code></td>
    </tr>
    <tr>
      <th>Valores Válidos</th>
      <td><p><code>FIXED</code></p><p><code>DYNAMIC</code></p></td>
    </tr>
  </table>

  Define o `COLUMN_FORMAT` e `ROW_FORMAT` padrão para novas tabelas (consulte a Seção 15.1.24, “Instrução CREATE TABLE”). O padrão é `FIXED`.

* `--ndb-deferred-constraints=[0|1]`

<table frame="box" rules="all" summary="Propriedades para ndb-allow-copying-alter-table">
  <tr><th>Formato de Linha de Comando</th> <td><code>--ndb-allow-copying-alter-table[={OFF|ON}]</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>ndb_allow_copying_alter_table</code></td> </tr>
  <tr><th>Alcance</th> <td>Global, Sessão</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Booleano</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr>
</table>

Controla se as verificações de restrições em índices únicos são adiadas até o momento do commit, quando tais verificações forem suportadas. `0` é o valor padrão.

Esta opção normalmente não é necessária para o funcionamento do NDB Cluster ou da NDB Cluster Replication, e é destinada principalmente para uso em testes.

* `--ndb-schema-dist-timeout=#`

<table frame="box" rules="all" summary="Propriedades para ndb-allow-copying-alter-table">
  <tr><th>Formato de Linha de Comando</th> <td><code>--ndb-allow-copying-alter-table[={OFF|ON}]</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>ndb_allow_copying_alter_table</code></td> </tr>
  <tr><th>Alcance</th> <td>Global, Sessão</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Booleano</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr>
</table>
1

  Especifica o tempo máximo em segundos que este **mysqld** espera para que uma operação de esquema seja concluída antes de marcar como tendo esgotado o tempo.

* `--ndb-distribution=[KEYHASH|LINHASH]`

  <table frame="box" rules="all" summary="Propriedades para ndb-allow-copying-alter-table">
    <tr><th>Formato de Linha de Comando</th> <td><code>--ndb-allow-copying-alter-table[={OFF|ON}]</code></td> </tr>
    <tr><th>Variável do Sistema</th> <td><code>ndb_allow_copying_alter_table</code></td> </tr>
    <tr><th>Alcance</th> <td>Global, Sessão</td> </tr>
    <tr><th>Dinâmico</th> <td>Sim</td> </tr>
    <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
    <tr><th>Tipo</th> <td>Booleano</td> </tr>
    <tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr>
  </table>
2

Controla o método de distribuição padrão para as tabelas `NDB`. Pode ser definido como `KEYHASH` (hashing de chave) ou `LINHASH` (hashing linear). `KEYHASH` é o padrão.

* `--ndb-log-apply-status`

  <table frame="box" rules="all" summary="Propriedades para ndb-allow-copying-alter-table"><tbody><tr><th>Formato de linha de comando</th> <td><code>--ndb-allow-copying-alter-table[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>ndb_allow_copying_alter_table</code></td> </tr><tr><th>Alcance</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hinta de <code>SET_VAR</code> Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Faz com que o **mysqld** replicador registre quaisquer atualizações recebidas de sua fonte imediata na tabela `mysql.ndb_apply_status` em seu próprio log binário usando seu próprio ID de servidor em vez do ID de servidor da fonte. Em um ambiente de replicação em cadeia ou em série, isso permite que essas atualizações sejam propagadas para as tabelas `mysql.ndb_apply_status` de quaisquer servidores MySQL configurados como replicados do **mysqld** atual.

  Em uma configuração de replicação em cadeia, usar essa opção permite que os clusters descendentes (replicados) estejam cientes de suas posições em relação a todos os seus contribuidores upstream (fontes).

Em uma configuração de replicação circular, essa opção faz com que as alterações nas tabelas `ndb_apply_status` sejam concluídas em todo o circuito, propagando-se eventualmente de volta ao clúster NDB de origem. Isso também permite que um clúster que atue como fonte de replicação veja quando suas alterações (épocas) foram aplicadas aos outros clústeres no círculo.

Esta opção não tem efeito a menos que o servidor MySQL seja iniciado com a opção `--ndbcluster`.

* `--ndb-log-empty-epochs=[ON|OFF]`

  <table frame="box" rules="all" summary="Propriedades para ndb-allow-copying-alter-table"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--ndb-allow-copying-alter-table[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>ndb_allow_copying_alter_table</code></td> </tr><tr><th>Alcance</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code></code> Dicas de Configuração de Variáveis Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Faz com que as épocas durante as quais não houve alterações sejam escritas nas tabelas `ndb_apply_status` e `ndb_binlog_index`, mesmo quando `log_replica_updates` está habilitado.

  Por padrão, esta opção está desabilitada. Desabilitar `--ndb-log-empty-epochs` faz com que as transações de época sem alterações não sejam escritas no log binário, embora uma linha ainda seja escrita mesmo para uma época vazia no `ndb_binlog_index`.

Como `--ndb-log-empty-epochs=1` faz com que o tamanho da tabela `ndb_binlog_index` aumente independentemente do tamanho do log binário, os usuários devem estar preparados para gerenciar o crescimento dessa tabela, mesmo que esperem que o clúster esteja inativo grande parte do tempo.

* `--ndb-log-empty-update=[ON|OFF]`

  <table frame="box" rules="all" summary="Propriedades para ndb-allow-copying-alter-table"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--ndb-allow-copying-alter-table[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>ndb_allow_copying_alter_table</code></td> </tr><tr><th>Alcance</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hinta de <code>SET_VAR</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Faz com que as atualizações que não produziram alterações sejam escritas nas tabelas `ndb_apply_status` e `ndb_binlog_index`, mesmo quando `log_replica_updates` está habilitado.

  Por padrão, essa opção está desabilitada (`OFF`). Desabilitar `--ndb-log-empty-update` faz com que as atualizações sem alterações não sejam escritas no log binário.

* `--ndb-log-exclusive-reads=[0|1]`

<table frame="box" rules="all" summary="Propriedades para ndb-allow-copying-alter-table">
  <tr><th>Formato de Linha de Comando</th> <td><code>--ndb-allow-copying-alter-table[={OFF|ON}]</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>ndb_allow_copying_alter_table</code></td> </tr>
  <tr><th>Alcance</th> <td>Global, Sessão</td> </tr>
  <tr><th>Dinâmica</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Booleano</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr>
</table>

  Iniciar o servidor com esta opção faz com que as leituras de chave primária sejam registradas com bloqueios exclusivos, o que permite a detecção e resolução de conflitos de replicação do NDB Cluster com base em conflitos de leitura. Você também pode habilitar e desabilitar esses bloqueios em tempo de execução, definindo o valor da variável de sistema `ndb_log_exclusive_reads` para 1 ou 0, respectivamente. 0 (desativar o bloqueio) é o valor padrão.

  Para mais informações, consulte Detecção e resolução de conflitos de leitura.

* `--ndb-log-fail-terminate`

<table frame="box" rules="all" summary="Propriedades para ndb-allow-copying-alter-table">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--ndb-log-orig[={OFF|ON}]</code></td>
  </tr>
  <tr>
    <th>Variável do sistema</th>
    <td><code>ndb_log_orig</code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global, Sessão</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Hinta de <code>SET_VAR</code> é aplicada</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Booleano</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code>ON</code></td>
  </tr>
  </tbody></table>

  Quando esta opção é especificada e o registro completo de todos os eventos de linha de registro encontrados não é possível, o processo do **mysqld** é encerrado.

* `--ndb-log-orig`

Isso permite que uma determinada época tenha múltiplas linhas no `ndb_binlog_index`, uma para cada época de origem.

Para mais informações, consulte a Seção 25.7.4, “Esquema e tabelas de replicação de clúster NDB”.

* `--ndb-log-row-slice-count`

<table frame="box" rules="all" summary="Propriedades para ndb-allow-copying-alter-table"><tr><th>Formato de linha de comando</th> <td><code>--ndb-allow-copying-alter-table[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>ndb_allow_copying_alter_table</code></td> </tr><tr><th>Alcance</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code></code> Dicas de sintaxe de configuração de variáveis</td> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Define o número de fatias (*`count`*) usadas por este servidor ao se inscrever em fluxos de eventos de alteração de tabela NDB usados para gravação de logs binários. Se este *`count`* for maior que 1, o fluxo de eventos de alteração para uma determinada tabela é dividido em `1 / count` fatias lógicas. Cada **mysqld** que realiza o registro de logs binários pode se inscrever em uma fatia (determinada por `--ndb-log-row-slice-id`), recebendo `100 / count` por cento das alterações para cada tabela afetada.

  Esta opção não pode ser definida em tempo de execução; a variável de sistema correspondente `ndb_log_row_slice_count` é de leitura somente.

* `--ndb-log-row-slice-id`

<table frame="box" rules="all" summary="Propriedades para ndb-applier-allow-skip-epoch"><tbody><tr><th>Formato de linha de comando</th> <td><code>--ndb-applier-allow-skip-epoch</code></td> </tr><tr><th>Variável do sistema</th> <td><code>ndb_applier_allow_skip_epoch</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dica de sintaxe para <code>SET_VAR</code></th> <td>Não</td> </tr></tbody></table>

  Especifica o ID do corte virtual dos fluxos de eventos de alteração de tabela NDB a que este servidor se inscreve. O valor máximo *efetivo* do ID é `--ndb-log-row-slice-count` - 1. Suponha que existem quatro servidores MySQL, todos com log binário habilitado e conectados ao mesmo NDB Cluster, que rotulamos como A, B, C e D. Podemos fazer com que cada **mysqld** registre um dos quatro cortes de tamanho igual do fluxo de eventos de alteração de tabela, especificando `--ndb-log-row-slice-count=4` ao iniciar cada **mysqld**. Para cada **mysqld**, podemos especificar qual dos quatro cortes deve ser registrado usando a opção `--ndb-log-row-slice-id`, começando com 0 para o servidor A. Usando as duas opções juntas dessa maneira resulta nas seguintes quatro invocatórias do **mysqld**:

  ```
  A$> mysqld --ndb-log-row-slice-count=4 --ndb-log-row-slice-id=0

  B$> mysqld --ndb-log-row-slice-count=4 --ndb-log-row-slice-id=1

  C$> mysqld --ndb-log-row-slice-count=4 --ndb-log-row-slice-id=2

  D$> mysqld --ndb-log-row-slice-count=4 --ndb-log-row-slice-id=3
  ```

  Além de fornecer capacidade de escalonamento para o log binário, também é possível estabelecer conjuntos redundantes de servidores MySQL. Usando os mesmos quatro servidores A, B, C e D do exemplo anterior, podemos, em vez disso, criar dois grupos de dois servidores cada, cada grupo dividindo as alterações a serem registradas em duas partes, iniciando os servidores como mostrado aqui:

  ```
  A$> mysqld --ndb-log-row-slice-count=2 --ndb-log-row-slice-id=0

  B$> mysqld --ndb-log-row-slice-count=2 --ndb-log-row-slice-id=1

  C$> mysqld --ndb-log-row-slice-count=2 --ndb-log-row-slice-id=0

  D$> mysqld --ndb-log-row-slice-count=2 --ndb-log-row-slice-id=1
  ```

Aqui, os servidores A e B dividem o log binário, e os servidores C e D também o fazem. Também é possível aproveitar a redundância para escalabilidade enquanto se mantém a redundância. Considere uma configuração com dois servidores MySQL iniciados como mostrado aqui:

```
  A$> mysqld --ndb-log-row-slice-count=2 --ndb-log-row-slice-id=0

  B$> mysqld --ndb-log-row-slice-count=2 --ndb-log-row-slice-id=1
  ```

Um segundo conjunto de servidores não precisa ter o mesmo tamanho do primeiro. Você pode iniciar um segundo conjunto que consiste em três servidores D, E e F, da seguinte forma:

```
  D$> mysqld --ndb-log-row-slice-count=3 --ndb-log-row-slice-id=0

  E$> mysqld --ndb-log-row-slice-count=3 --ndb-log-row-slice-id=1

  F$> mysqld --ndb-log-row-slice-count=3 --ndb-log-row-slice-id=2
  ```

Agora que o segundo conjunto está escrevendo uma cópia completa do log binário entre seus três membros, você pode reiniciar os servidores A e B e iniciar outro servidor C (assumindo que ele não esteja rodando ainda), como mostrado aqui:

```
  A$> mysqladmin shutdown
  A$> mysqld --ndb-log-row-slice-count=3 --ndb-log-row-slice-id=0

  B$> mysqladmin shutdown
  B$> mysqld --ndb-log-row-slice-count=3 --ndb-log-row-slice-id=1

  C$> mysqld --ndb-log-row-slice-count=3 --ndb-log-row-slice-id=2
  ```

Essa opção não pode ser definida em tempo de execução; a variável de sistema correspondente `ndb_log_row_slice_id` é somente leitura.

Também é possível controlar o registro binário dessa maneira, mas por tabela, usando a tabela `mysql.ndb_replication`. Veja a tabela ndb_replication para mais informações.

* `--ndb-log-transaction-dependency`

<table frame="box" rules="all" summary="Propriedades para ndb-applier-allow-skip-epoch"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--ndb-applier-allow-skip-epoch</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>ndb_applier_allow_skip_epoch</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr></tbody></table>

Faz com que o fio de registro binário `NDB` calcule as dependências de transação para cada transação que escreve no log binário. O valor padrão é `FALSE`.

Esta opção não pode ser definida em tempo de execução; a variável de sistema correspondente `ndb_log_transaction_dependency` é de leitura somente.

* `--ndb-log-transaction-id`

  <table frame="box" rules="all" summary="Propriedades para ndb-applier-allow-skip-epoch"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--ndb-applier-allow-skip-epoch</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>ndb_applier_allow_skip_epoch</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <code>SET_VAR</a> Aplica-se</th> <td>Não</td> </tr></tbody></table>

  Faz com que a replica **mysqld** escreva o ID de transação NDB em cada linha do log binário. O valor padrão é `FALSE`.

  `--ndb-log-transaction-id` é necessário para habilitar a detecção e resolução de conflitos da replicação em cluster NDB usando a função `NDB$EPOCH_TRANS()` (veja NDB$EPOCH_TRANS()). Para mais informações, consulte a Seção 25.7.12, “Resolução de Conflitos de Replicação em Cluster NDB”.

* `--ndb-log-update-as-write`

<table frame="box" rules="all" summary="Propriedades para ndb-applier-allow-skip-epoch"><tbody><tr><th>Formato de linha de comando</th> <td><code>--ndb-applier-allow-skip-epoch</code></td> </tr><tr><th>Variável do sistema</th> <td><code>ndb_applier_allow_skip_epoch</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dica de sintaxe para <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr></tbody></table>

  Se as atualizações na fonte forem escritas no log binário como atualizações (`OFF`) ou escritas (`ON`). Quando esta opção estiver habilitada e `--ndb-log-updated-only` e `--ndb-log-update-minimal` estiverem desabilitados, as operações de diferentes tipos serão registradas conforme a lista a seguir:

  + `INSERT`: Registrada como um evento `WRITE_ROW` sem imagem anterior; a imagem após é registrada com todas as colunas.

    `UPDATE`: Registrada como um evento `WRITE_ROW` sem imagem anterior; a imagem após é registrada com todas as colunas.

    `DELETE`: Registrada como um evento `DELETE_ROW` com todas as colunas registradas na imagem anterior; a imagem após não é registrada.

  Esta opção pode ser usada para resolução de conflitos de replicação NDB em combinação com as outras duas opções de registro NDB mencionadas anteriormente; consulte a tabela ndb_replication para mais informações.

* `--ndb-log-updated-only`

<table frame="box" rules="all" summary="Propriedades para ndb-applier-allow-skip-epoch"><tbody><tr><th>Formato de linha de comando</th> <td><code>--ndb-applier-allow-skip-epoch</code></td> </tr><tr><th>Variável do sistema</th> <td><code>ndb_applier_allow_skip_epoch</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dica de sintaxe para <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr></tbody></table>

  Se o **mysqld** escrever atualizações apenas (`ON`) ou linhas completas (`OFF`) no log binário. Quando esta opção está habilitada e tanto `--ndb-log-update-as-write` quanto `--ndb-log-update-minimal` estão desabilitados, as operações de diferentes tipos são registradas conforme descrito na lista a seguir:

  + `INSERT`: Registrada como um evento `WRITE_ROW` sem imagem anterior; a imagem após é registrada com todas as colunas.

  + `UPDATE`: Registrada como um evento `UPDATE_ROW` com colunas da chave primária e colunas atualizadas presentes tanto na imagem anterior quanto na imagem após.

  + `DELETE`: Registrada como um evento `DELETE_ROW` com colunas da chave primária incluídas na imagem anterior; a imagem após não é registrada.

  Esta opção pode ser usada para resolução de conflitos de replicação NDB em combinação com as outras duas opções de registro NDB mencionadas anteriormente; consulte a tabela ndb_replication para mais informações sobre como essas opções interagem entre si.

* `--ndb-log-update-minimal`

<table frame="box" rules="all" summary="Propriedades para ndb-applier-allow-skip-epoch"><tbody><tr><th>Formato de linha de comando</th> <td><code>--ndb-applier-allow-skip-epoch</code></td> </tr><tr><th>Variável do sistema</th> <td><code>ndb_applier_allow_skip_epoch</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr></tbody></table>

  Atualize o log de forma mínima, escrevendo apenas os valores das chaves primárias na imagem anterior e apenas as colunas alteradas na imagem posterior. Isso pode causar problemas de compatibilidade ao replicar para motores de armazenamento diferentes do `NDB`. Quando esta opção está habilitada e `--ndb-log-updated-only` e `--ndb-log-update-as-write` estão desabilitados, as operações de diferentes tipos são registradas conforme descrito na lista a seguir:

  + `INSERT`: Registrado como um evento `WRITE_ROW` sem imagem anterior; a imagem posterior é registrada com todas as colunas.

  + `UPDATE`: Registrado como um evento `UPDATE_ROW` com colunas da chave primária na imagem anterior; todas as colunas *exceto* as colunas da chave primária são registradas na imagem posterior.

  + `DELETE`: Registrado como um evento `DELETE_ROW` com todas as colunas na imagem anterior; a imagem posterior não é registrada.

  Esta opção pode ser usada para resolução de conflitos de replicação NDB em combinação com as outras duas opções de registro NDB mencionadas anteriormente; consulte a tabela ndb_replication, para mais informações.

* `--ndb-mgm-tls=[relaxed|strict]`

<table frame="box" rules="all" summary="Propriedades para ndb-applier-allow-skip-epoch"><tbody><tr><th>Formato de linha de comando</th> <td><code>--ndb-applier-allow-skip-epoch</code></td> </tr><tr><th>Variável do sistema</th> <td><code>ndb_applier_allow_skip_epoch</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr></tbody></table>

  Define o nível de suporte TLS necessário para conexões TLS ao NDB Cluster; o valor é `relaxed` ou `strict`. `relaxed` significa que uma conexão TLS é tentada, mas o sucesso não é necessário; `strict` significa que o TLS é necessário para se conectar. O padrão é `relaxed`.

* `--ndb-mgmd-host=host[:port]`

Pode ser usado para definir o ID do nó e o número do porto de um único servidor de gerenciamento para que o programa se conecte. Se o programa exigir IDs de nó ou referências a múltiplos servidores de gerenciamento (ou ambos) nas informações de conexão, use a opção `--ndb-connectstring` em vez disso.

* `--ndb-nodeid=#`

  <table frame="box" rules="all" summary="Propriedades para ndb-applier-allow-skip-epoch"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--ndb-applier-allow-skip-epoch</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>ndb_applier_allow_skip_epoch</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code></code> Hint Aplica-se</th> <td>Não</td> </tr></tbody></table>

  Defina o ID do nó deste servidor MySQL em um NDB Cluster.

  A opção `--ndb-nodeid` substitui qualquer ID de nó definido com `--ndb-connectstring`, independentemente da ordem em que as duas opções são usadas.

  Além disso, se `--ndb-nodeid` for usado, então um ID de nó correspondente deve ser encontrado em uma seção `[mysqld]` ou `[api]` do `config.ini`, ou deve haver uma seção `[mysqld]` ou `[api]` “aberta” no arquivo (ou seja, uma seção sem um parâmetro `NodeId` ou `Id` especificado). Isso também é verdadeiro se o ID de nó for especificado como parte da string de conexão.

  Independentemente de como o ID de nó é determinado, ele é exibido como o valor da variável de status global `Ndb_cluster_node_id` na saída de `SHOW STATUS`, e como `cluster_node_id` na linha `connection` da saída de `SHOW ENGINE NDBCLUSTER STATUS`.

Para obter mais informações sobre os IDs de nós para nós SQL do NDB Cluster, consulte a Seção 25.4.3.7, “Definindo nós SQL e outros nós de API em um NDB Cluster”.

* `--ndbinfo={ON|OFF|FORCE}`

  <table frame="box" rules="all" summary="Propriedades para ndb-applier-allow-skip-epoch"><tr><th>Formato de linha de comando</th> <td><code>--ndb-applier-allow-skip-epoch</code></td> </tr><tr><th>Variável de sistema</th> <td><code>ndb_applier_allow_skip_epoch</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr></table>

  Habilita o plugin para a base de dados de informações `ndbinfo`. Por padrão, isso está ativado quando o `NDBCLUSTER` está ativado.

* `--ndb-optimization-delay=milliseconds`

<table frame="box" rules="all" summary="Propriedades para ndb-batch-size">
  <tr><th>Formato de Linha de Comando</th> <td><code>--ndb-batch-size</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>ndb_batch_size</code></td> </tr>
  <tr><th>Alcance</th> <td>Global, Sessão</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>32768</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>2147483648</code></td> </tr>
  <tr><th>Unidade</th> <td>bytes</td> </tr>
</table>

  Defina o número de milissegundos para esperar entre conjuntos de linhas por meio das instruções `OPTIMIZE TABLE` em tabelas `NDB`. O valor padrão é 10.

* `--ndb-optimized-node-selection`

<table frame="box" rules="all" summary="Propriedades para ndb-batch-size">
  <tr><th>Formato de Linha de Comando</th> <td><code>--ndb-batch-size</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>ndb_batch_size</code></td> </tr>
  <tr><th>Alcance</th> <td>Global, Sessão</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>32768</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>2147483648</code></td> </tr>
  <tr><th>Unidade</th> <td>bytes</td> </tr>
</table>

  Ative otimizações para a seleção de nós para transações. Ativado por padrão; use `--skip-ndb-optimized-node-selection` para desativá-lo.

* `ndb-tls-search-path=path`

<table frame="box" rules="all" summary="Propriedades para ndb-batch-size">
  <tr><th>Formato de Linha de Comando</th> <td><code>--ndb-batch-size</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>ndb_batch_size</code></td> </tr>
  <tr><th>Âmbito</th> <td>Global, Sessão</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>32768</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>2147483648</code></td> </tr>
  <tr><th>Unidade</th> <td>bytes</td> </tr>
</table>

Lista de diretórios para procurar por CAs e chaves privadas para conexões NDB TLS. A lista é delimitada por vírgula em plataformas Unix e por ponto e vírgula em plataformas Windows.

* `--ndb-transid-mysql-connection-map=state`

<table frame="box" rules="all" summary="Propriedades para ndb-batch-size">
  <tr><th>Formato de Linha de Comando</th> <td><code>--ndb-batch-size</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>ndb_batch_size</code></td> </tr>
  <tr><th>Alcance</th> <td>Global, Sessão</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>32768</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>2147483648</code></td> </tr>
  <tr><th>Unidade</th> <td>bytes</td> </tr>
</table>

  Habilita ou desabilita o plugin que lida com a tabela `ndb_transid_mysql_connection_map` no banco de dados `INFORMATION_SCHEMA`. Assume um dos valores `ON`, `OFF` ou `FORCE`. `ON` (o padrão) habilita o plugin. `OFF` desabilita o plugin, o que torna `ndb_transid_mysql_connection_map` inacessível. `FORCE` impede que o MySQL Server seja iniciado se o plugin não conseguir carregar e iniciar.

  Você pode ver se o plugin da tabela `ndb_transid_mysql_connection_map` está em execução verificando a saída de `SHOW PLUGINS`.

* `--ndb-wait-connected=segundos`

<table frame="box" rules="all" summary="Propriedades para ndb-batch-size"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--ndb-wait-setup=segundos</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>ndb_wait_setup</code></td> </tr><tr><th>Alcance</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>32768</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>2147483648</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>

Esta opção define o período de tempo que o servidor MySQL espera para que as conexões ao NDB Cluster de gerenciamento e nós de dados sejam estabelecidas antes de aceitar conexões de clientes MySQL. O tempo é especificado em segundos. O valor padrão é `30`.

* `--ndb-wait-setup=segundos`

<table frame="box" rules="all" summary="Propriedades para ndb-batch-size"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--ndb-batch-size</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>ndb_batch_size</code></td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>32768</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>2147483648</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>

Esta variável indica o período de tempo que o servidor MySQL espera que o mecanismo de armazenamento `NDB` complete a configuração antes de expirar o tempo e tratar o `NDB` como indisponível. O tempo é especificado em segundos. O valor padrão é `30`.

* `--skip-ndbcluster`

<table frame="box" rules="all" summary="Propriedades para ndb-batch-size"><tbody><tr><th>Formato de linha de comando</th> <td><code>--ndb-batch-size</code></td> </tr><tr><th>Variável do sistema</th> <td><code>ndb_batch_size</code></td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hinta de <code>SET_VAR</code> se aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>32768</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>2147483648</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>

Desative o mecanismo de armazenamento `NDBCLUSTER`. Este é o padrão para binários que foram compilados com suporte ao mecanismo de armazenamento `NDBCLUSTER`; o servidor aloca memória e outros recursos para este mecanismo de armazenamento apenas se a opção `--ndbcluster` for fornecida explicitamente. Veja a Seção 25.4.1, “Configuração rápida do NDB Cluster”, para um exemplo.

##### 25.4.3.9.2 Variáveis de sistema do NDB Cluster

Esta seção fornece informações detalhadas sobre as variáveis de sistema do servidor MySQL que são específicas do NDB Cluster e do mecanismo de armazenamento `NDB`. Para variáveis de sistema que não são específicas do NDB Cluster, consulte a Seção 7.1.8, “Variáveis de sistema do servidor”. Para informações gerais sobre o uso de variáveis de sistema, consulte a Seção 7.1.9, “Usando variáveis de sistema”.

* `ndb_autoincrement_prefetch_sz`

<table frame="box" rules="all" summary="Propriedades para ndb-batch-size"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--ndb-batch-size</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>ndb_batch_size</code></td> </tr><tr><th>Alcance</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>32768</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>2147483648</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>

  Determina a probabilidade de lacunas em uma coluna com autoincremento. Defina-o em `1` para minimizar isso. Definir um valor alto para otimização torna as inserções mais rápidas, mas diminui a probabilidade de números consecutivos de autoincremento serem usados em um lote de inserções.

  Esta variável afeta apenas o número de IDs de `AUTO_INCREMENT` que são buscados entre instruções; dentro de uma determinada instrução, pelo menos 32 IDs são obtidos de cada vez.

  Importante

  Esta variável não afeta inserções realizadas usando `INSERT ... SELECT`.

<table frame="box" rules="all" summary="Propriedades para ndb-batch-size"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--ndb-batch-size</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>ndb_batch_size</code></td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>32768</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>2147483648</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>

Por padrão, a execução de `RESET REPLICA` faz com que uma replica do NDB Cluster apague todas as linhas de sua tabela `ndb_apply_status`. Você pode desativá-lo definindo `ndb_clear_apply_status=OFF`.

* `ndb_conflict_role`

<table frame="box" rules="all" summary="Propriedades para ndb-batch-size"><tbody><tr><th>Formato de linha de comando</th> <td><code>--ndb-batch-size</code></td> </tr><tr><th>Variável do sistema</th> <td><code>ndb_batch_size</code></td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>32768</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>2147483648</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>

  Determina o papel deste nó SQL (e do NDB Cluster) em uma configuração de replicação circular (“ativo-ativo”). `ndb_conflict_role` pode assumir qualquer um dos valores `PRIMARY`, `SECONDARY`, `PASS` ou `NULL` (o padrão). O thread SQL da replica deve ser parado antes que você possa alterar `ndb_conflict_role`. Além disso, não é possível alterar diretamente entre `PASS` e `PRIMARY` ou `SECONDARY` diretamente; nesse caso, você deve garantir que o thread SQL seja parado e, em seguida, executar `SET @@GLOBAL.ndb_conflict_role = 'NONE'` primeiro.

  Esta variável substitui a desatualizada `ndb_slave_conflict_role`.

  Para mais informações, consulte a Seção 25.7.12, “Resolução de conflitos de replicação do NDB Cluster”.

* `ndb_data_node_neighbour`

<table frame="box" rules="all" summary="Propriedades para ndb-cluster-connection-pool"><tbody><tr><th>Formato de linha de comando</th> <td><code>--ndb-cluster-connection-pool</code></td> </tr><tr><th>Variável do sistema</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>Variável do sistema</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <code>SET_VAR</code> se aplica</th> <td>Não</td> </tr><tr><th>Hinta de <code>SET_VAR</code> se aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>1</code></td> </tr><tr><th>Valor mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor máximo</th> <td><code>63</code></td> </tr></tbody></table>

  Define o ID de um "próximo" nó de dados—ou seja, um nó de dados não local preferido é escolhido para executar a transação, em vez de um que esteja executando no mesmo host que o nó de SQL ou API. Isso costumava garantir que, quando uma tabela totalmente replicada fosse acessada, acessássemos-na neste nó de dados, para garantir que a cópia local da tabela fosse sempre usada sempre que possível. Isso também pode ser usado para fornecer dicas para transações.

Isso pode melhorar os tempos de acesso aos dados no caso de um nó que está fisicamente mais próximo e, portanto, tem maior capacidade de transferência de rede do que outros no mesmo host.

Consulte a Seção 15.1.24.12, “Definindo Opções de Comentários de NDB”, para obter mais informações.

Nota

Um método equivalente `set_data_node_neighbour()` é fornecido para uso em aplicativos da API NDB.

* `ndb_dbg_check_shares`

<table frame="box" rules="all" summary="Propriedades para ndb-cluster-connection-pool"><tr><th>Formato de Linha de Comando</th> <td><code>--ndb-cluster-connection-pool</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de Sintaxe de Definição de Variável</th> <td><code>SET_VAR</code></td> <td>Não</td> </tr><tr><th>Hinta de Sintaxe de Definição de Variável</th> <td><code>SET_VAR</code></td> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>63</code></td> </tr></table>

Quando definido para 1, verifique se nenhuma partilha está em espera. Disponível apenas em builds de depuração.

* `ndb_default_column_format`

<table frame="box" rules="all" summary="Propriedades para ndb-cluster-connection-pool">
  <tr><th>Formato de Linha de Comando</th> <td><code>--ndb-cluster-connection-pool</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>ndb_cluster_connection_pool</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>ndb_cluster_connection_pool</code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>1</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>63</code></td> </tr>
</table>

  Define o formato padrão de `COLUMN_FORMAT` e `ROW_FORMAT` para novas tabelas (consulte a Seção 15.1.24, “Instrução CREATE TABLE”). O padrão é `FIXED`.

* `ndb_deferred_constraints`

<table frame="box" rules="all" summary="Propriedades para ndb-cluster-connection-pool">
  <tr><th>Formato de Linha de Comando</th> <td><code>--ndb-cluster-connection-pool</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>ndb_cluster_connection_pool</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>ndb_cluster_connection_pool</code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>1</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>63</code></td> </tr>
</table>

  Controla se as verificações de restrições são adiadas, quando suportadas. `0` é o valor padrão.

  Esta variável normalmente não é necessária para o funcionamento do NDB Cluster ou da NDB Cluster Replication, e é destinada principalmente para uso em testes.

* `ndb_distribution`

<table frame="box" rules="all" summary="Propriedades para ndb-cluster-connection-pool">
  <tr><th>Formato de Linha de Comando</th> <td><code>--ndb-cluster-connection-pool</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>ndb_cluster_connection_pool</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>ndb_cluster_connection_pool</code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>1</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>63</code></td> </tr>
</table>

  Controla o método de distribuição padrão para tabelas `NDB`. Pode ser definido como `KEYHASH` (hashing de chave) ou `LINHASH` (hashing linear). `KEYHASH` é o padrão.

<table frame="box" rules="all" summary="Propriedades para ndb-cluster-connection-pool">
  <tr><th>Formato de Linha de Comando</th> <td><code>--ndb-cluster-connection-pool</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>ndb_cluster_connection_pool</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>ndb_cluster_connection_pool</code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>1</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>63</code></td> </tr>
</table>

  Define a porcentagem da memória máxima alocada para o buffer de eventos (ndb_eventbuffer_max_alloc) que deve estar disponível no buffer de eventos após atingir o máximo, antes de começar a bufferizar novamente.

<table frame="box" rules="all" summary="Propriedades para ndb-cluster-connection-pool">
  <tr><th>Formato de Linha de Comando</th> <td><code>--ndb-cluster-connection-pool</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>ndb_cluster_connection_pool</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>ndb_cluster_connection_pool</code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>1</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>63</code></td> </tr>
</table>

  Define a quantidade máxima de memória (em bytes) que pode ser alocada para o bufferamento de eventos pela API NDB. 0 significa que não há limite imposto, e é o valor padrão.

* `ndb_extra_logging`

<table frame="box" rules="all" summary="Propriedades para ndb-cluster-connection-pool">
  <tr><th>Formato de Linha de Comando</th> <td><code>--ndb-cluster-connection-pool</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>ndb_cluster_connection_pool</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>ndb_cluster_connection_pool</code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>1</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>63</code></td> </tr>
</table>

  Esta variável permite a gravação no log de erro do MySQL de informações específicas do motor de armazenamento `NDB`.

Quando essa variável é definida como 0, a única informação específica do `NDB` que é escrita no log de erro do MySQL está relacionada ao gerenciamento de transações. Se o valor for maior que 0, mas menor que 10, o esquema da tabela `NDB` e os eventos de conexão também são registrados, bem como se a resolução de conflitos está em uso ou não, e outros erros e informações do `NDB`. Se o valor for definido como 10 ou mais, informações sobre o `NDB` interno, como o progresso da distribuição de dados entre os nós do cluster, também são escritas no log de erro do MySQL. O valor padrão é 1.

<table frame="box" rules="all" summary="Propriedades para ndb-cluster-connection-pool"><tbody><tr><th>Formato de linha de comando</th> <td><code>--ndb-cluster-connection-pool</code></td> </tr><tr><th>Variável de sistema</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>Variável de sistema</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr><tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>1</code></td> </tr><tr><th>Valor mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor máximo</th> <td><code>63</code></td> </tr></tbody></table>

Força o envio de buffers para o `NDB` imediatamente, sem esperar por outros threads. Tem como padrão `ON`.

* `ndb_fully_replicated`

<table frame="box" rules="all" summary="Propriedades para ndb-cluster-connection-pool">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--ndb-cluster-connection-pool</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>ndb_cluster_connection_pool</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>ndb_cluster_connection_pool</code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de <code>SET_VAR</code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de <code>SET_VAR</code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>1</code></td>
  </tr>
  <tr>
    <th>Valor Mínimo</th>
    <td><code>1</code></td>
  </tr>
  <tr>
    <th>Valor Máximo</th>
    <td><code>63</code></td>
  </tr>
</table>

9. Determina se novas tabelas `NDB` são replicadas completamente. Essa configuração pode ser substituída para uma tabela individual usando `COMMENT="NDB_TABLE=COMPLETAMENTE_REPLICADO=..."` em uma instrução `CREATE TABLE` ou `ALTER TABLE`; consulte a Seção 15.1.24.12, “Opções de Comentário NDB”, para sintaxe e outras informações.

* `ndb_index_stat_enable`

<table frame="box" rules="all" summary="Propriedades para ndb-cluster-connection-pool-nodeids"><tbody><tr><th>Formato de linha de comando</th> <td><code>--ndb-cluster-connection-pool-nodeids</code></td> </tr><tr><th>Variável do sistema</th> <td><code>ndb_cluster_connection_pool_nodeids</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Definir</td> </tr><tr><th>Valor padrão</th> <td><code></code></td> </tr></tbody></table>

Use estatísticas de índice `NDB` na otimização de consultas. O padrão é `ON`.

As tabelas de estatísticas de índice são sempre criadas quando o servidor é iniciado, independentemente do valor dessa opção.

* `ndb_index_stat_option`

Esta variável é usada para fornecer opções de ajuste para a geração de estatísticas de índice NDB. A lista consiste em pares de nomes e valores separados por vírgula de nomes de opções e valores, e essa lista não deve conter nenhum caractere de espaço.

As opções não usadas ao definir `ndb_index_stat_option` não são alteradas de seus valores padrão. Por exemplo, você pode definir `ndb_index_stat_option = 'loop_idle=1000ms,cache_limit=32M'`.

Os valores de tempo podem ser sufixados opcionalmente com `h` (horas), `m` (minutos) ou `s` (segundos). Valores de milissegundos podem ser especificados opcionalmente usando `ms`; valores de milissegundos não podem ser especificados usando `h`, `m` ou `s`.

Os nomes das opções que podem ser definidos usando essa variável são mostrados na tabela que segue. A tabela também fornece descrições breves das opções, seus valores padrão e (quando aplicável) seus valores mínimo e máximo.

**Tabela 25.19 opções e valores de ndb_index_stat_option**

<table frame="box" rules="all" summary="Propriedades para ndb-cluster-connection-pool-nodeids"><tr><th>Formato de Linha de Comando</th> <td><code>--ndb-cluster-connection-pool-nodeids</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>ndb_cluster_connection_pool_nodeids</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Definir</td> </tr><tr><th>Valor Padrão</th> <td><code></code></td> </tr></tbody></table>

* `ndb_join_pushdown`

<table frame="box" rules="all" summary="Propriedades para ndb-cluster-connection-pool-nodeids"><tbody><tr><th>Formato de linha de comando</th> <td><code>--ndb-cluster-connection-pool-nodeids</code></td> </tr><tr><th>Variável do sistema</th> <td><code>ndb_cluster_connection_pool_nodeids</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <code>SET_VAR</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Definir</td> </tr><tr><th>Valor padrão</th> <td><code></code></td> </tr></tbody></table>

  Esta variável controla se as junções nas tabelas `NDB` são empurradas para o kernel NDB (nós de dados). Anteriormente, uma junção era tratada usando múltiplos acessos ao `NDB` pelo nó SQL; no entanto, quando o `ndb_join_pushdown` é habilitado, uma junção empurrável é enviada na íntegra para os nós de dados, onde pode ser distribuída entre os nós de dados e executada em paralelo em múltiplas cópias dos dados, com um único resultado consolidado sendo retornado ao **mysqld**. Isso pode reduzir muito o número de viagens entre um nó SQL e os nós de dados necessárias para lidar com uma junção desse tipo.

  Por padrão, o `ndb_join_pushdown` está habilitado.

  **Condições para junções empurradas pelo NDB.** Para que uma junção seja empurrável, ela deve atender às seguintes condições:

1. Apenas colunas podem ser comparadas, e todas as colunas a serem unidas devem usar *exatamente* o mesmo tipo de dado. Isso significa que (por exemplo) uma junção em uma coluna de `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") e uma coluna de `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") também não podem ser empurradas para baixo.

     Expressões que comparam colunas da mesma tabela também podem ser empurradas para baixo. As colunas (ou o resultado de quaisquer operações nessas colunas) devem ser do mesmo tipo, incluindo a mesma sinalização, comprimento, conjunto de caracteres e ordenação, precisão e escala, onde essas são aplicáveis.

  2. Consultas que fazem referência a colunas `BLOB` ou `TEXT` não são suportadas.

  3. O bloqueio explícito não é suportado; no entanto, o bloqueio implícito baseado em linhas do motor de armazenamento `NDB` é aplicado.

     Isso significa que uma junção usando `FOR UPDATE` não pode ser empurrada para baixo.

  4. Para que uma junção seja empurrada para baixo, as tabelas filhas na junção devem ser acessadas usando um dos métodos de acesso `ref`, `eq_ref` ou `const`, ou uma combinação desses métodos.

     Tabelas filhas unidas externamente só podem ser empurradas usando `eq_ref`.

     Se a raiz da junção empurrada for um `eq_ref` ou `const`, apenas tabelas filhas unidas por `eq_ref` podem ser anexadas. (Uma tabela unida por `ref` provavelmente se tornará a raiz de outra junção empurrada.)

     Se o otimizador de consulta decidir sobre `Usar cache de junção` para uma tabela candidata, essa tabela não pode ser empurrada como filha. No entanto, pode ser a raiz de outro conjunto de tabelas empurradas.

  5. Junções que fazem referência a tabelas explicitamente particionadas por `[LINEAR] HASH`, `LIST` ou `RANGE` atualmente não podem ser empurradas para baixo.

Você pode verificar se uma junção específica pode ser otimizada verificando-a com `EXPLAIN`; quando a junção pode ser otimizada, você pode ver referências à junção otimizada na coluna `Extra` do resultado, como mostrado neste exemplo:

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

Se as tabelas filhas unidas por `ref` forem unidas por `ref`, *e* o resultado for ordenado ou agrupado por um índice ordenado, esse índice não pode fornecer linhas ordenadas, o que obriga a gravação em um temporário ordenado.

Existem duas fontes adicionais de informações sobre o desempenho da junção otimizada:

1. As variáveis de status `Ndb_pushed_queries_defined`, `Ndb_pushed_queries_dropped`, `Ndb_pushed_queries_executed` e `Ndb_pushed_reads`.

2. Os contadores na tabela `ndbinfo.counters` que pertencem ao bloco de kernel `DBSPJ`.

* `ndb_log_apply_status`

<table frame="box" rules="all" summary="Propriedades para ndb-cluster-connection-pool-nodeids"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--ndb-cluster-connection-pool-nodeids</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>ndb_cluster_connection_pool_nodeids</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Definir</td> </tr><tr><th>Valor Padrão</th> <td><code></code></td> </tr></tbody></table>

Uma variável somente leitura que mostra se o servidor foi iniciado com a opção `--ndb-log-apply-status`.

* `ndb_log_bin`

<table frame="box" rules="all" summary="Propriedades para ndb-cluster-connection-pool-nodeids"><tbody><tr><th>Formato de linha de comando</th> <td><code>--ndb-cluster-connection-pool-nodeids</code></td> </tr><tr><th>Variável do sistema</th> <td><code>ndb_cluster_connection_pool_nodeids</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Definir</td> </tr><tr><th>Valor padrão</th> <td><code></code></td> </tr></tbody></table>

  Faz com que as atualizações das tabelas `NDB` sejam escritas no log binário. A configuração desta variável não tem efeito se o registro binário não estiver habilitado no servidor usando `log_bin`. `ndb_log_bin` tem o valor padrão de 0 (FALSO).

* `ndb_log_binlog_index`

  <table frame="box" rules="all" summary="Propriedades para ndb-cluster-connection-pool-nodeids"><tbody><tr><th>Formato de linha de comando</th> <td><code>--ndb-cluster-connection-pool-nodeids</code></td> </tr><tr><th>Variável do sistema</th> <td><code>ndb_cluster_connection_pool_nodeids</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Definir</td> </tr><tr><th>Valor padrão</th> <td><code></code></td> </tr></tbody></table>

Faz com que a mapeia de épocas para posições no log binário seja inserida na tabela `ndb_binlog_index`. Definir essa variável não tem efeito se o registro binário não estiver já habilitado para o servidor usando `log_bin`. (Além disso, `ndb_log_bin` não deve ser desativado.) `ndb_log_binlog_index` tem o valor padrão de `1` (`ON`); normalmente, não há necessidade de alterar esse valor em um ambiente de produção.

* `ndb_log_cache_size`

  <table frame="box" rules="all" summary="Propriedades para ndb-cluster-connection-pool-nodeids"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--ndb-cluster-connection-pool-nodeids</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>ndb_cluster_connection_pool_nodeids</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Definir</td> </tr><tr><th>Valor Padrão</th> <td><code></code></td> </tr></tbody></table>

  Defina o tamanho do cache de transações usado para gravar o log binário `NDB`.

* `ndb_log_empty_epochs`

<table frame="box" rules="all" summary="Propriedades para ndb-cluster-connection-pool-nodeids">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--ndb-cluster-connection-pool-nodeids</code></td>
  </tr>
  <tr>
    <th>Variável do sistema</th>
    <td><code>ndb_cluster_connection_pool_nodeids</code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de <code>SET_VAR</code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Definir</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code></code></td>
  </tr>
  </table>
10

Quando essa variável estiver definida como `ON` (`1`), as transações sem alterações serão escritas no log binário, mesmo quando o `log_replica_updates` estiver habilitado.

* `ndb_log_exclusive_reads`

  <table frame="box" rules="all" summary="Propriedades para ndb-blob-read-batch-bytes"><tr><th>Formato de Linha de Comando</th> <td><code>--ndb-blob-read-batch-bytes</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>ndb_blob_read_batch_bytes</code></td> </tr><tr><th>Alcance</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>65536</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Essa variável determina se as leituras de chave primária são registradas com bloqueios exclusivos, o que permite a detecção e resolução de conflitos da Replicação do NDB Cluster com base em conflitos de leitura. Para habilitar esses bloqueios, defina o valor de `ndb_log_exclusive_reads` para 1, o que desabilita esse bloqueio, que é o valor padrão.

  Para obter mais informações, consulte Detecção e resolução de conflitos de leitura.

<table frame="box" rules="all" summary="Propriedades para ndb-blob-read-batch-bytes">
  <tr><th>Formato de Linha de Comando</th> <td><code>--ndb-log-orig</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>ndb_log_transaction_id</code></td> </tr>
  <tr><th>Alcance</th> <td>Global, Sessão</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>65536</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr>
</table>

Mostra se o ID do servidor de origem e a época são registrados na tabela `ndb_binlog_index`. Definido usando a opção de servidor `--ndb-log-orig`.

<table frame="box" rules="all" summary="Propriedades para ndb-blob-read-batch-bytes">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--ndb-blob-read-batch-bytes</code></td>
  </tr>
  <tr>
    <th>Variável de sistema</th>
    <td><code>ndb_blob_read_batch_bytes</code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global, Sessão</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Hinta de <code>SET_VAR</code> se aplica</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code>65536</code></td>
  </tr>
  <tr>
    <th>Valor mínimo</th>
    <td><code>0</code></td>
  </tr>
  <tr>
    <th>Valor máximo</th>
    <td><code>4294967295</code></td>
  </tr>
</table>

  Esta variável de sistema binária e somente leitura indica se uma replica do **mysqld** escreve IDs de transação NDB no log binário (requisitado para usar a replicação de clúster NDB “ativo-ativo” com detecção de conflitos `NDB$EPOCH_TRANS()`). Para alterar a configuração, use a opção `--ndb-log-transaction-id`.

  `ndb_log_transaction_id` não é suportado no MySQL Server mainline 9.5.

  Para mais informações, consulte a Seção 25.7.12, “Resolução de conflitos de replicação de clúster NDB”.

* `ndb_log_transaction_compression`

<table frame="box" rules="all" summary="Propriedades para ndb-blob-read-batch-bytes"><tbody><tr><th>Formato de linha de comando</th> <td><code>--ndb-blob-read-batch-bytes</code></td> </tr><tr><th>Variável do sistema</th> <td><code>ndb_blob_read_batch_bytes</code></td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>65536</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Se uma replica **mysqld** escreve transações compactadas no log binário; presente apenas se **mysqld** foi compilado com suporte para `NDB`.

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

  Para desabilitar a compressão de transações no log binário apenas para tabelas `NDB`, defina a variável `ndb_log_transaction_compression` para `OFF` em uma sessão de **mysql** ou outro cliente após iniciar **mysqld**.

  Definir a variável `binlog_transaction_compression` após o início não tem efeito no valor de `ndb_log_transaction_compression`.

Para obter mais informações sobre a compressão de transações de log binário, como quais eventos são ou não comprimidos, além das mudanças de comportamento a serem consideradas ao usar esse recurso, consulte a Seção 7.4.4.5, “Compressão de Transações de Log Binário”.

* `ndb_log_transaction_compression_level_zstd`

  <table frame="box" rules="all" summary="Propriedades para ndb-blob-read-batch-bytes"><tr><th>Formato de Linha de Comando</th> <td><code>--ndb-blob-read-batch-bytes</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>ndb_blob_read_batch_bytes</code></td> </tr><tr><th>Alcance</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hinta de Sintaxe de Definição de Hinta `<code>SET_VAR</code>` Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>65536</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr></tbody></table>

  O nível de compressão `ZSTD` usado para escrever transações comprimidas no log binário da replica, se habilitado por `ndb_log_transaction_compression`. Não é suportado se o **mysqld** não foi compilado com suporte para o mecanismo de armazenamento `NDB`.

  Consulte a Seção 7.4.4.5, “Compressão de Transações de Log Binário”, para obter mais informações.

* `ndb_metadata_check`

<table frame="box" rules="all" summary="Propriedades para ndb-blob-read-batch-bytes">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--ndb-blob-read-batch-bytes</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>ndb_blob_read_batch_bytes</code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global, Sessão</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Hinta de <code>SET_VAR</code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>65536</code></td>
  </tr>
  <tr>
    <th>Valor Mínimo</th>
    <td><code>0</code></td>
  </tr>
  <tr>
    <th>Valor Máximo</th>
    <td><code>4294967295</code></td>
  </tr>
</table>

O `NDB` usa um thread de fundo para verificar alterações de metadados a cada `ndb_metadata_check_interval` segundos, em comparação com o dicionário de dados do MySQL. Esse thread de detecção de alterações de metadados pode ser desativado definindo `ndb_metadata_check` para `OFF`. O thread está ativado por padrão.

* `ndb_metadata_check_interval`

<table frame="box" rules="all" summary="Propriedades para ndb-blob-read-batch-bytes">
  <tr><th>Formato de Linha de Comando</th> <td><code>--ndb-blob-read-batch-bytes</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>ndb_blob_read_batch_bytes</code></td> </tr>
  <tr><th>Alcance</th> <td>Global, Sessão</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>65536</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr>
</table>

O `NDB` executa um fio de detecção de alterações de metadados em segundo plano para determinar quando o dicionário NDB foi alterado em relação ao dicionário de dados MySQL. Por padrão, o intervalo entre essas verificações é de 60 segundos; isso pode ser ajustado definindo o valor de `ndb_metadata_check_interval`. Para habilitar ou desabilitar o fio, use `ndb_metadata_check`.

* `ndb_metadata_sync`

<table frame="box" rules="all" summary="Propriedades para ndb-blob-read-batch-bytes">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--ndb-blob-read-batch-bytes</code></td>
  </tr>
  <tr>
    <th>Variável do sistema</th>
    <td><code>ndb_blob_read_batch_bytes</code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global, Sessão</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Hinta de <code>SET_VAR</code> se aplica</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code>65536</code></td>
  </tr>
  <tr>
    <th>Valor mínimo</th>
    <td><code>0</code></td>
  </tr>
  <tr>
    <th>Valor máximo</th>
    <td><code>4294967295</code></td>
  </tr>
</table>

  Definir essa variável faz com que o thread de monitoramento de mudanças substitua quaisquer valores definidos para `ndb_metadata_check` ou `ndb_metadata_check_interval` e entre em um período de detecção contínua de mudanças. Quando o thread determina que não há mais mudanças a serem detectadas, ele fica parado até que o thread de registro binário tenha terminado a sincronização de todos os objetos detectados. O `ndb_metadata_sync` é então definido como `false`, e o thread de monitoramento de mudanças retorna ao comportamento determinado pelas configurações de `ndb_metadata_check` e `ndb_metadata_check_interval`.

  Definir essa variável para `true` faz com que a lista de objetos excluídos seja limpa; definir para `false` limpa a lista de objetos a serem repetidos.

* `ndb_optimized_node_selection`

<table frame="box" rules="all" summary="Propriedades para ndb-blob-read-batch-bytes">
  <tr><th>Formato de Linha de Comando</th> <td><code>--ndb-blob-read-batch-bytes</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>ndb_blob_read_batch_bytes</code></td> </tr>
  <tr><th>Alcance</th> <td>Global, Sessão</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>65536</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr>
</table>

Existem duas formas de seleção de nó otimizada, descritas aqui:

1. O nó SQL usa a promixity para determinar o coordenador de transação; ou seja, o nó de dados "mais próximo" do nó SQL é escolhido como o coordenador de transação. Para esse propósito, um nó de dados com uma conexão de memória compartilhada com o nó SQL é considerado "mais próximo" do nó SQL; os próximos mais próximos (em ordem decrescente de proximidade) são: conexão TCP para `localhost`, seguida por conexão TCP de um host diferente de `localhost`.

2. O thread SQL usa a consciência de distribuição para selecionar o nó de dados. Ou seja, o nó de dados que abriga a partição do cluster acessada pelo primeiro comando de uma transação dada é usado como o coordenador de transação para toda a transação. (Isso é eficaz apenas se o primeiro comando da transação acessar não mais de uma partição do cluster.)

Esta opção aceita um dos valores inteiros `0`, `1`, `2` ou `3`. `3` é o padrão. Esses valores afetam a seleção de nós da seguinte forma:

  + `0`: A seleção de nós não é otimizada. Cada nó de dados é empregado como coordenador de transação 8 vezes antes que o fio SQL prossiga para o próximo nó de dados.

  + `1`: A proximidade com o nó SQL é usada para determinar o coordenador de transação.

  + `2`: A consciência da distribuição é usada para selecionar o coordenador de transação. No entanto, se a primeira declaração da transação acessar mais de uma partição de cluster, o nó SQL retorna ao comportamento de rotação em anel visto quando esta opção é definida como `0`.

  + `3`: Se a consciência da distribuição puder ser empregada para determinar o coordenador de transação, então ele é usado; caso contrário, a proximidade é usada para selecionar o coordenador de transação. (Este é o comportamento padrão.)

A proximidade é determinada da seguinte forma:

1. Comece com o valor definido para o parâmetro `Group` (padrão 55).

2. Para um nó de API que compartilha o mesmo host com outros nós de API, diminua o valor em 1. Considerando o valor padrão para `Group`, o valor efetivo para nós de dados no mesmo host que o nó de API é 54, e para nós de dados remotos 55.

3. Definir `ndb_data_node_neighbour` diminui ainda mais o valor efetivo de `Group` em 50, fazendo com que este nó seja considerado o nó mais próximo. Isso é necessário apenas quando todos os nós de dados estão em hosts diferentes daquele que hospeda o nó de API e é desejável dedicar um deles ao nó de API. Em casos normais, o ajuste padrão descrito anteriormente é suficiente.

Mudanças frequentes em `ndb_data_node_neighbour` não são aconselháveis, pois isso altera o estado da conexão do cluster e, portanto, pode interromper o algoritmo de seleção para novas transações de cada fio até que ele se estabilize.

* `ndb_read_backup`

  <table frame="box" rules="all" summary="Propriedades para ndb-blob-read-batch-bytes"><tr><th>Formato de linha de comando</th> <td><code>--ndb-blob-read-batch-bytes</code></td> </tr><tr><th>Variável do sistema</th> <td><code>ndb_blob_read_batch_bytes</code></td> </tr><tr><th>Alcance</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hinta de sintaxe de definição de variável</th> <td><code>SET_VAR</code></a> Aplica-se</td> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>65536</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Ative a leitura de qualquer replica de fragmento para qualquer tabela `NDB` posteriormente criada; isso melhora significativamente o desempenho da leitura da tabela a um custo relativamente baixo para as escritas.

  Se o nó SQL e o nó de dados usam o mesmo nome de host ou endereço IP, esse fato é detectado automaticamente, de modo que a preferência é enviar leituras para o mesmo host. Se esses nós estiverem no mesmo host, mas usarem endereços IP diferentes, você pode informar ao nó SQL para usar o nó de dados correto configurando o valor de `ndb_data_node_neighbour` no nó SQL para o ID do nó de dados.

  Para habilitar ou desabilitar a leitura de qualquer replica de fragmento para uma tabela individual, você pode definir a opção `NDB_TABLE` `READ_BACKUP` para a tabela de acordo, em uma declaração de `CREATE TABLE` ou `ALTER TABLE`; consulte a Seção 15.1.24.12, “Definição de Opções de Comentário NDB”, para obter mais informações.

* `ndb_recv_thread_activation_threshold`

  <table frame="box" rules="all" summary="Propriedades para ndb-blob-write-batch-bytes"><tr><th>Formato de Linha de Comando</th> <td><code>--ndb-blob-write-batch-bytes</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>ndb_blob_write_batch_bytes</code></td> </tr><tr><th>Alcance</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>65536</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></table>

  Quando este número de threads ativas simultaneamente é alcançado, o thread de recebimento assume a tarefa de fazer o polling da conexão do cluster.

  Esta variável tem alcance global. Também pode ser definida na inicialização.

* `ndb_recv_thread_cpu_mask`

<table frame="box" rules="all" summary="Propriedades para ndb-blob-write-batch-bytes">
  <tr><th>Formato de Linha de Comando</th> <td><code>--ndb-blob-write-batch-bytes</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>ndb_blob_write_batch_bytes</code></td> </tr>
  <tr><th>Alcance</th> <td>Global, Sessão</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>65536</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr>
  <tr><th>Unidade</th> <td>bytes</td> </tr>
</table>

  Máscara de CPU para bloquear threads de recebimento em CPUs específicas. Isso é especificado como uma máscara de bits hexadecimal. Por exemplo, `0x33` significa que uma CPU é usada por thread de recebimento. Uma string vazia é o valor padrão; definir `ndb_recv_thread_cpu_mask` para esse valor remove quaisquer bloqueios de thread de recebimento previamente definidos.

  Esta variável tem alcance global. Também pode ser definida no início.

* `ndb_report_thresh_binlog_epoch_slip`

<table frame="box" rules="all" summary="Propriedades para ndb-blob-write-batch-bytes">
  <tr><th>Formato de Linha de Comando</th> <td><code>--ndb-blob-write-batch-bytes</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>ndb_blob_write_batch_bytes</code></td> </tr>
  <tr><th>Alcance</th> <td>Global, Sessão</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>65536</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr>
  <tr><th>Unidade</th> <td>bytes</td> </tr>
</table>

Isso representa o limiar para o número de épocas completamente armazenadas no buffer de eventos, mas ainda não consumidas pelo thread do injetor do binlog. Quando esse grau de atraso (lag) é excedido, uma mensagem de status do buffer de eventos é relatada, com `BUFFERED_EPOCHS_OVER_THRESHOLD` fornecido como a razão (veja a Seção 25.6.2.3, “Relatório do Buffer de Eventos no Log do Clúster”). O atraso é aumentado quando uma época é recebida dos nós de dados e armazenada completamente no buffer de eventos; é reduzido quando uma época é consumida pelo thread do injetor do binlog. Epocas vazias são armazenadas e colocadas em fila, e, portanto, incluídas neste cálculo apenas quando isso é habilitado usando o método `Ndb::setEventBufferQueueEmptyEpoch()` da API NDB.

* `ndb_report_thresh_binlog_mem_usage`

<table frame="box" rules="all" summary="Propriedades para ndb-blob-write-batch-bytes">
  <tr><th>Formato de Linha de Comando</th> <td><code>--ndb-blob-write-batch-bytes</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>ndb_blob_write_batch_bytes</code></td> </tr>
  <tr><th>Alcance</th> <td>Global, Sessão</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>65536</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr>
  <tr><th>Unidade</th> <td>bytes</td> </tr>
</table>

Este é um limiar sobre a porcentagem de memória livre restante antes de relatar o status do log binário. Por exemplo, um valor de `10` (o padrão) significa que, se a quantidade de memória disponível para receber dados do log binário dos nós de dados cair abaixo de 10%, uma mensagem de status é enviada para o log do clúster.

* `ndb_row_checksum`

<table frame="box" rules="all" summary="Propriedades para ndb-blob-write-batch-bytes">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--ndb-blob-write-batch-bytes</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>ndb_blob_write_batch_bytes</code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global, Sessão</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Hinta de <code>SET_VAR</code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>65536</code></td>
  </tr>
  <tr>
    <th>Valor Mínimo</th>
    <td><code>0</code></td>
  </tr>
  <tr>
    <th>Valor Máximo</th>
    <td><code>4294967295</code></td>
  </tr>
  <tr>
    <th>Unidade</th>
    <td>bytes</td>
  </tr>
  </tbody></table>

  Tradicionalmente, o `NDB` criou tabelas com verificações de checksum de linha, o que verifica problemas de hardware em detrimento do desempenho. Definir `ndb_row_checksum` para 0 significa que os checksums de linha *não* são usados para novas ou tabelas alteradas, o que tem um impacto significativo no desempenho para todos os tipos de consultas. Esta variável é definida para 1 por padrão, para fornecer um comportamento compatível com versões anteriores.

* `ndb_schema_dist_lock_wait_timeout`

<table frame="box" rules="all" summary="Propriedades para ndb-blob-write-batch-bytes">
  <tr><th>Formato de Linha de Comando</th> <td><code>--ndb-blob-write-batch-bytes</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>ndb_blob_write_batch_bytes</code></td> </tr>
  <tr><th>Âmbito</th> <td>Global, Sessão</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>65536</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr>
  <tr><th>Unidade</th> <td>bytes</td> </tr>
</table>

<table frame="box" rules="all" summary="Propriedades para ndb-blob-write-batch-bytes">
  <tr><th>Formato de Linha de Comando</th> <td><code>--ndb-blob-write-batch-bytes</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>ndb_blob_write_batch_bytes</code></td> </tr>
  <tr><th>Alcance</th> <td>Global, Sessão</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>65536</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr>
  <tr><th>Unidade</th> <td>bytes</td> </tr>
</table>

Número de segundos para aguardar antes de detectar um tempo de espera durante a distribuição do esquema. Isso pode indicar que outros nós SQL estão experimentando atividade excessiva ou que estão sendo impedidos de adquirir os recursos necessários neste momento.

* `ndb_schema_dist_upgrade_allowed`

<table frame="box" rules="all" summary="Propriedades para ndb-blob-write-batch-bytes">
  <tr><th>Formato de Linha de Comando</th> <td><code>--ndb-blob-write-batch-bytes</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>ndb_blob_write_batch_bytes</code></td> </tr>
  <tr><th>Alcance</th> <td>Global, Sessão</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>65536</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr>
  <tr><th>Unidade</th> <td>bytes</td> </tr>
</table>

  Permite a atualização da tabela de distribuição de esquema ao se conectar ao `NDB`. Quando verdadeiro (o padrão), essa alteração é adiada até que todos os nós SQL tenham sido atualizados para a mesma versão do software do NDB Cluster.

  Nota

  O desempenho da distribuição de esquema pode ser um pouco degradado até que a atualização seja realizada.

* `ndb_show_foreign_key_mock_tables`

<table frame="box" rules="all" summary="Propriedades para ndb-blob-write-batch-bytes">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--ndb-blob-write-batch-bytes</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>ndb_blob_write_batch_bytes</code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global, Sessão</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Hinta de <code>SET_VAR</code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>65536</code></td>
  </tr>
  <tr>
    <th>Valor Mínimo</th>
    <td><code>0</code></td>
  </tr>
  <tr>
    <th>Valor Máximo</th>
    <td><code>4294967295</code></td>
  </tr>
  <tr>
    <th>Unidade</th>
    <td>bytes</td>
  </tr>
  </tbody></table>

  Mostre as tabelas fictícias usadas pelo `NDB` para suportar `foreign_key_checks=0`. Quando habilitado, avisos extras são mostrados ao criar e excluir as tabelas. O nome real (interno) da tabela pode ser visto na saída de `SHOW CREATE TABLE`.

* `ndb_slave_conflict_role`

<table frame="box" rules="all" summary="Propriedades para ndb-blob-write-batch-bytes">
  <tr><th>Formato de Linha de Comando</th> <td><code>--ndb-blob-write-batch-bytes</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>ndb_blob_write_batch_bytes</code></td> </tr>
  <tr><th>Alcance</th> <td>Global, Sessão</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>65536</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr>
  <tr><th>Unidade</th> <td>bytes</td> </tr>
</table>

Símbolo desatualizado para `ndb_conflict_role`.

* `ndb_table_no_logging`

  <table frame="box" rules="all" summary="Propriedades para ndb-connectstring">
    <tr><th>Formato de Linha de Comando</th> <td><code>--ndb-connectstring</code></td> </tr>
    <tr><th>Tipo</th> <td>String</td> </tr>
  </table>

Quando esta variável é definida como `ON` ou `1`, ela faz com que todas as tabelas criadas ou alteradas usando `ENGINE NDB` sejam não-registradoras; ou seja, nenhuma alteração de dados para esta tabela é escrita no log de refazer ou pinçada no disco, assim como se a tabela tivesse sido criada ou alterada usando a opção `NOLOGGING` para `CREATE TABLE` ou `ALTER TABLE`.

Para obter mais informações sobre tabelas `NDB` não-registradoras, consulte Opções de Tabela NDB.

`ndb_table_no_logging` não tem efeito na criação de arquivos de esquema de tabelas `NDB`; para suprimi-los, use `ndb_table_temporary` em vez disso.

* `ndb_table_temporary`

  <table frame="box" rules="all" summary="Propriedades para ndb-connectstring"><tbody><tr><th>Formato de linha de comando</th> <td><code>--ndb-connectstring</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Quando definido como `ON` ou `1`, essa variável faz com que as tabelas `NDB` não sejam escritas em disco: Isso significa que nenhum arquivo de esquema de tabela é criado e as tabelas não são registradas.

  Nota

  Definir essa variável atualmente não tem efeito. Esse é um problema conhecido; veja o Bug #34036.

* `ndb_use_copying_alter_table`

  <table frame="box" rules="all" summary="Propriedades para ndb-connectstring"><tbody><tr><th>Formato de linha de comando</th> <td><code>--ndb-connectstring</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Força o `NDB` a usar a cópia de tabelas em caso de problemas com operações `ALTER TABLE` online. O valor padrão é `OFF`.

* `ndb_use_exact_count`

  <table frame="box" rules="all" summary="Propriedades para ndb-connectstring"><tbody><tr><th>Formato de linha de comando</th> <td><code>--ndb-connectstring</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Força o `NDB` a usar um contagem de registros durante o planejamento da consulta `SELECT COUNT(*)` para acelerar esse tipo de consulta. O valor padrão é `OFF`, o que permite consultas mais rápidas no geral.

* `ndb_use_transactions`

<table frame="box" rules="all" summary="Propriedades para ndb-connectstring"><tbody><tr><th>Formato de linha de comando</th> <td><code>--ndb-connectstring</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Você pode desabilitar o suporte de transações `NDB` configurando o valor desta variável para `OFF`. Isso geralmente não é recomendado, embora possa ser útil desabilitar o suporte de transações dentro de uma sessão de cliente específica quando essa sessão for usada para importar um ou mais arquivos de dump com transações grandes; isso permite que uma inserção de várias linhas seja executada em partes, em vez de como uma única transação. Nesses casos, uma vez que a importação tenha sido concluída, você deve reiniciar o valor da variável para essa sessão para `ON`, ou simplesmente encerrar a sessão.

* `ndb_version`

  <table frame="box" rules="all" summary="Propriedades para ndb-connectstring"><tbody><tr><th>Formato de linha de comando</th> <td><code>--ndb-connectstring</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Versão do motor `NDB`, como um inteiro composto.

* `ndb_version_string`

  <table frame="box" rules="all" summary="Propriedades para ndb-connectstring"><tbody><tr><th>Formato de linha de comando</th> <td><code>--ndb-connectstring</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Versão do motor `NDB` no formato `ndb-x.y.z`.

* `replica_allow_batching`

<table frame="box" rules="all" summary="Propriedades para ndb-connectstring"><tbody><tr><th>Formato de linha de comando</th> <td><code>--ndb-connectstring</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Se as atualizações em lote estão habilitadas nas réplicas do NDB Cluster.

  Permitir atualizações em lote na replica melhora significativamente o desempenho, especialmente ao replicar colunas `TEXT`, `BLOB` e `JSON`. Por essa razão, `replica_allow_batching` está habilitado por padrão.

  Definir essa variável tem efeito apenas ao usar a replicação com o motor de armazenamento `NDB`; no MySQL Server 9.5, está presente, mas não faz nada. Para mais informações, consulte a Seção 25.7.6, “Iniciar a replicação do NDB Cluster (Canal de replicação único”)”).

* `ndb_replica_batch_size`

  <table frame="box" rules="all" summary="Propriedades para ndb-connectstring"><tbody><tr><th>Formato de linha de comando</th> <td><code>--ndb-connectstring</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Determina o tamanho do lote em bytes usado pelo thread do aplicável de replicação. Defina essa variável em vez da opção `--ndb-batch-size` para aplicar essa configuração à replica, excluindo quaisquer outras sessões.

  Se essa variável não for definida (padrão 2 MB), seu valor efetivo é o maior entre o valor de `--ndb-batch-size` e 2 MB.

* `ndb_replica_blob_write_batch_bytes`

Controle o tamanho do lote de escrita usado para dados blob pelo fio aplicador de replicação.

Use esta variável em vez da opção `--ndb-blob-write-batch-bytes` para controlar o tamanho do lote de escrita de blob no replica, excluindo quaisquer outras sessões. A razão para isso é que, quando `ndb_replica_blob_write_batch_bytes` não é definido, o tamanho efetivo do lote de escrita de blob (ou seja, o número máximo de bytes pendentes para serem escritos para colunas de blob) é determinado pelo maior valor de `--ndb-blob-write-batch-bytes` e 2 MB (o valor padrão para `ndb_replica_blob_write_batch_bytes`).

Definir `ndb_replica_blob_write_batch_bytes` para 0 significa que o `NDB` não impõe nenhum limite ao tamanho das escritas de lote de blob no replica.

* `server_id_bits`

  <table frame="box" rules="all" summary="Propriedades para ndb-default-column-format"><tr><th>Formato de Linha de Comando</th> <td><code>--ndb-default-column-format={FIXED|DYNAMIC}</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>ndb_default_column_format</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>FIXED</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>FIXED</code></p><p><code>DYNAMIC</code></p></td> </tr></table>

Esta variável indica o número de bits menos significativos dentro do `server_id` de 32 bits que realmente identificam o servidor. Indicar que o servidor é realmente identificado por menos de 32 bits permite que alguns dos bits restantes sejam usados para outros propósitos, como armazenar dados do usuário gerados por aplicativos que utilizam a API de Eventos da NDB API dentro do `AnyValue` de uma estrutura `OperationOptions` (o NDB Cluster usa o `AnyValue` para armazenar o ID do servidor).

Ao extrair o ID de servidor efetivo do `server_id` para fins como a detecção de loops de replicação, o servidor ignora os bits restantes. A variável `server_id_bits` é usada para mascarar quaisquer bits irrelevantes do `server_id` nos threads de I/O e SQL ao decidir se um evento deve ser ignorado com base no ID do servidor.

Esses dados podem ser lidos do log binário pelo **mysqlbinlog**, desde que seja executado com sua própria variável `server_id_bits` definida como 32 (o padrão).

Se o valor de `server_id` for maior ou igual a 2 elevado a `server_id_bits`; caso contrário, o **mysqld** se recusa a iniciar.

Esta variável de sistema é suportada apenas pelo NDB Cluster. Não é suportada no servidor padrão MySQL 9.5.

* `slave_allow_batching`

<table frame="box" rules="all" summary="Propriedades para ndb-default-column-format">
  <tr><th>Formato de Linha de Comando</th> <td><code>--ndb-default-column-format={FIXED|DYNAMIC}</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>ndb_default_column_format</code></td> </tr>
  <tr><th>Âmbito</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Enumeração</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>FIXED</code></td> </tr>
  <tr><th>Valores Válidos</th> <td><p><code>FIXED</code></p><p><code>DYNAMIC</code></p></td> </tr>
</table>

Sinônimo descontinuado para `replica_allow_batching`.

* `transaction_allow_batching`

<table frame="box" rules="all" summary="Propriedades para ndb-default-column-format">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--ndb-default-column-format={FIXED|DYNAMIC}</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>ndb_default_column_format</code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Hinta de <code>SET_VAR</code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Enumeração</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>FIXED</code></td>
  </tr>
  <tr>
    <th>Valores Válidos</th>
    <td><p><code>FIXED</code></p><p><code>DYNAMIC</code></p></td>
  </tr>
</table>

  Quando definido para `1` ou `ON`, essa variável habilita o agrupamento de instruções dentro da mesma transação. Para usar essa variável, o `autocommit` deve ser desabilitado primeiro, definindo-o para `0` ou `OFF`; caso contrário, definir `transaction_allow_batching` não terá efeito.

  É seguro usar essa variável com transações que realizam apenas escritas, pois ativá-la pode levar a leituras da imagem “antes”. Você deve garantir que quaisquer transações pendentes sejam confirmadas (usando um `COMMIT` explícito, se desejado) antes de emitir um `SELECT`.

  Importante

  `transaction_allow_batching` não deve ser usado sempre que houver a possibilidade de que os efeitos de uma determinada instrução dependam do resultado de uma instrução anterior dentro da mesma transação.

Esta variável é atualmente suportada apenas para o NDB Cluster.

As variáveis do sistema na lista a seguir estão todas relacionadas ao banco de dados de informações `ndbinfo`.

* `ndbinfo_database`

  <table frame="box" rules="all" summary="Propriedades para o formato de coluna ndb-default-column-format"><tr><th>Formato de Linha de Comando</th> <td><code>--ndb-default-column-format={FIXED|DYNAMIC}</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>ndb_default_column_format</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hinta de Definição de Variável</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>FIXED</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>FIXED</code></p><p><code>DYNAMIC</code></p></td> </tr></table>

  Mostra o nome usado para o banco de dados de informações `NDB`; o padrão é `ndbinfo`. Esta é uma variável de leitura apenas cujo valor é determinado no momento da compilação.

* `ndbinfo_max_bytes`

<table frame="box" rules="all" summary="Propriedades para ndb-default-column-format">
  <tr><th>Formato de Linha de Comando</th> <td><code>--ndb-default-column-format={FIXED|DYNAMIC}</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>ndb_default_column_format</code></td> </tr>
  <tr><th>Âmbito</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Enumeração</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>FIXED</code></td> </tr>
  <tr><th>Valores Válidos</th> <td><p><code>FIXED</code></p><p><code>DYNAMIC</code></p></td> </tr>
</table>

  Usado apenas em testes e depuração.

<table frame="box" rules="all" summary="Propriedades para ndb-default-column-format">
  <tr><th>Formato de Linha de Comando</th> <td><code>--ndb-default-column-format={FIXED|DYNAMIC}</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>ndb_default_column_format</code></td> </tr>
  <tr><th>Âmbito</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Enumeração</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>FIXED</code></td> </tr>
  <tr><th>Valores Válidos</th> <td><p><code>FIXED</code></p><p><code>DYNAMIC</code></p></td> </tr>
</table>

  Usado apenas em testes e depuração.

<table frame="box" rules="all" summary="Propriedades para ndb-default-column-format">
  <tr><th>Formato de Linha de Comando</th> <td><code>--ndb-default-column-format={FIXED|DYNAMIC}</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>ndb_default_column_format</code></td> </tr>
  <tr><th>Âmbito</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Enumeração</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>FIXED</code></td> </tr>
  <tr><th>Valores Válidos</th> <td><p><code>FIXED</code></p><p><code>DYNAMIC</code></p></td> </tr>
</table>

  Coloque a base de dados `ndbinfo` no modo offline, na qual as tabelas e visualizações podem ser abertas mesmo quando elas não existem na verdade, ou quando existem, mas têm definições diferentes em `NDB`. Nenhuma linha é retornada dessas tabelas (ou visualizações).

* `ndbinfo_show_hidden`

<table frame="box" rules="all" summary="Propriedades para ndb-default-column-format">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--ndb-default-column-format={FIXED|DYNAMIC}</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>ndb_default_column_format</code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Hinta de Definição de Variável</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Enumeração</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>FIXED</code></td>
  </tr>
  <tr>
    <th>Valores Válidos</th>
    <td><p><code>FIXED</code></p><p><code>DYNAMIC</code></p></td>
  </tr>
</table>
7

  Se as tabelas internas do banco de dados `ndbinfo` sejam exibidas ou não no cliente `mysql`. O padrão é `OFF`.

  Nota

  Quando `ndbinfo_show_hidden` está habilitado, as tabelas internas são exibidas apenas no banco de dados `ndbinfo`; elas não são visíveis em `TABLES` ou outras tabelas de `INFORMATION_SCHEMA`, independentemente da configuração da variável.

* `ndbinfo_table_prefix`

<table frame="box" rules="all" summary="Propriedades para o formato de coluna ndb-default-column-format">
  <tr><th>Formato de Linha de Comando</th> <td><code>--ndb-default-column-format={FIXED|DYNAMIC}</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>ndb_default_column_format</code></td> </tr>
  <tr><th>Âmbito</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Enumeração</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>FIXED</code></td> </tr>
  <tr><th>Valores Válidos</th> <td><p><code>FIXED</code></p><p><code>DYNAMIC</code></p></td> </tr>
</table>

O prefixo usado no nome das tabelas de base do banco de dados ndbinfo (normalmente oculto, a menos que exposto definindo `ndbinfo_show_hidden`). Esta é uma variável de leitura apenas cujo valor padrão é `ndb$`; o próprio prefixo é determinado no momento da compilação.

* `ndbinfo_version`

<table frame="box" rules="all" summary="Propriedades para o formato de coluna ndb-default-column-format">
  <tr><th>Formato de Linha de Comando</th> <td><code>--ndb-default-column-format={FIXED|DYNAMIC}</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>ndb_default_column_format</code></td> </tr>
  <tr><th>Âmbito</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Enumeração</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>FIXED</code></td> </tr>
  <tr><th>Valores Válidos</th> <td><p><code>FIXED</code></p><p><code>DYNAMIC</code></p></td> </tr>
</table>

  Mostra a versão do motor `ndbinfo` em uso; apenas para leitura.

##### 25.4.3.9.3 Variáveis de Status do NDB Cluster

Esta seção fornece informações detalhadas sobre as variáveis de status do servidor MySQL que se relacionam ao NDB Cluster e ao motor de armazenamento `NDB`. Para variáveis de status não específicas do NDB Cluster e para informações gerais sobre o uso de variáveis de status, consulte a Seção 7.1.10, “Variáveis de Status do Servidor”.

* `Handler_discover`

  O servidor MySQL pode perguntar ao motor de armazenamento `NDBCLUSTER` se ele conhece uma tabela com um nome dado. Isso é chamado de descoberta. `Handler_discover` indica o número de vezes que as tabelas foram descobertas usando esse mecanismo.

* `Ndb_api_adaptive_send_deferred_count`

  Número de chamadas de envio adaptativo que não foram realmente enviadas.

Para mais informações, consulte a Seção 25.6.14, “Contatores e Variáveis de Estatísticas da API NDB”.

* `Ndb_api_adaptive_send_deferred_count_session`

  Número de chamadas de envio adaptativo que não foram realmente enviadas.

  Para mais informações, consulte a Seção 25.6.14, “Contatores e Variáveis de Estatísticas da API NDB”.

* `Ndb_api_adaptive_send_deferred_count_replica`

  Número de chamadas de envio adaptativo que não foram realmente enviadas por esta replica.

  Para mais informações, consulte a Seção 25.6.14, “Contatores e Variáveis de Estatísticas da API NDB”.

* `Ndb_api_adaptive_send_deferred_count_slave`

  Símbolo obsoleto para `Ndb_api_adaptive_send_deferred_count_replica`.

* `Ndb_api_adaptive_send_forced_count`

  Número de chamadas de envio adaptativo usando envio forçado enviadas por este servidor MySQL (nó SQL).

  Para mais informações, consulte a Seção 25.6.14, “Contatores e Variáveis de Estatísticas da API NDB”.

* `Ndb_api_adaptive_send_forced_count_session`

  Número de chamadas de envio adaptativo usando envio forçado enviadas nesta sessão do cliente.

  Para mais informações, consulte a Seção 25.6.14, “Contatores e Variáveis de Estatísticas da API NDB”.

* `Ndb_api_adaptive_send_forced_count_replica`

  Número de chamadas de envio adaptativo usando envio forçado enviadas por esta replica.

  Para mais informações, consulte a Seção 25.6.14, “Contatores e Variáveis de Estatísticas da API NDB”.

* `Ndb_api_adaptive_send_forced_count_slave`

  Símbolo obsoleto para `Ndb_api_adaptive_send_forced_count_replica`.

* `Ndb_api_adaptive_send_unforced_count`

  Número de chamadas de envio adaptativo sem envio forçado enviadas por este servidor MySQL (nó SQL).

  Para mais informações, consulte a Seção 25.6.14, “Contatores e Variáveis de Estatísticas da API NDB”.

* `Ndb_api_adaptive_send_unforced_count_session`

  Número de chamadas de envio adaptativo sem envio forçado enviadas nesta sessão do cliente.

Para mais informações, consulte a Seção 25.6.14, “Contatores e Variáveis de Estatísticas da API NDB”.

* `Ndb_api_adaptive_send_unforced_count_replica`

  Número de chamadas de envio adaptativo sem envio forçado enviadas por esta replica.

  Para mais informações, consulte a Seção 25.6.14, “Contatores e Variáveis de Estatísticas da API NDB”.

* `Ndb_api_adaptive_send_unforced_count_slave`

  Símbolo obsoleto para `Ndb_api_adaptive_send_unforced_count_replica`.

* `Ndb_api_bytes_sent_count_session`

  Quantidade de dados (em bytes) enviados aos nós de dados nesta sessão do cliente.

  Embora esta variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas com a sessão atual e não é afetada por outros clientes deste **mysqld**.

  Para mais informações, consulte a Seção 25.6.14, “Contatores e Variáveis de Estatísticas da API NDB”.

* `Ndb_api_bytes_sent_count_replica`

  Quantidade de dados (em bytes) enviados aos nós de dados por esta replica.

  Embora esta variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente global em escopo. Se este servidor MySQL não atuar como uma replica ou não usar tabelas NDB, esse valor é sempre 0.

  Para mais informações, consulte a Seção 25.6.14, “Contatores e Variáveis de Estatísticas da API NDB”.

* `Ndb_api_bytes_sent_count_slave`

  Símbolo obsoleto para `Ndb_api_bytes_sent_count_replica`.

* `Ndb_api_bytes_sent_count`

  Quantidade de dados (em bytes) enviados aos nós de dados por este servidor MySQL (nó SQL).

  Embora esta variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente global em escopo.

  Para mais informações, consulte a Seção 25.6.14, “Contatores e Variáveis de Estatísticas da API NDB”.

* `Ndb_api_bytes_received_count_session`

Quantidade de dados (em bytes) recebidos dos nós de dados nesta sessão do cliente.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por outros clientes deste **mysqld**.

Para mais informações, consulte a Seção 25.6.14, “Contas e variáveis de estatísticas de API NDB”.

* `Ndb_api_bytes_received_count_replica`

Quantidade de dados (em bytes) recebidos dos nós de dados por essa replica.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente global em escopo. Se este servidor MySQL não atuar como uma replica ou não usar tabelas NDB, esse valor é sempre 0.

Para mais informações, consulte a Seção 25.6.14, “Contas e variáveis de estatísticas de API NDB”.

* `Ndb_api_bytes_received_count_slave`

Símbolo desatualizado para `Ndb_api_bytes_received_count_replica`.

* `Ndb_api_bytes_received_count`

Quantidade de dados (em bytes) recebidos dos nós de dados por este servidor MySQL (nó SQL).

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente global em escopo.

Para mais informações, consulte a Seção 25.6.14, “Contas e variáveis de estatísticas de API NDB”.

* `Ndb_api_event_data_count_injector`

O número de eventos de mudança de linha recebidos pelo fio de injetor de binlog NDB.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente global em escopo.

Para mais informações, consulte a Seção 25.6.14, “Contas e variáveis de estatísticas de API NDB”.

* `Ndb_api_event_data_count`

O número de eventos de mudança de linha recebidos por este servidor MySQL (nó SQL).

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente global em escopo.

Para mais informações, consulte a Seção 25.6.14, “Contas e variáveis de estatísticas da API NDB”.

* `Ndb_api_event_nondata_count_injector`

  O número de eventos recebidos, exceto eventos de alteração de linha, pelo fio de injeção do log binário NDB.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente global em escopo.

  Para mais informações, consulte a Seção 25.6.14, “Contas e variáveis de estatísticas da API NDB”.

* `Ndb_api_event_nondata_count`

  O número de eventos recebidos, exceto eventos de alteração de linha, por este servidor MySQL (nó SQL).

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente global em escopo.

  Para mais informações, consulte a Seção 25.6.14, “Contas e variáveis de estatísticas da API NDB”.

* `Ndb_api_event_bytes_count_injector`

  O número de bytes de eventos recebidos pelo fio de injeção do log binário NDB.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente global em escopo.

  Para mais informações, consulte a Seção 25.6.14, “Contas e variáveis de estatísticas da API NDB”.

* `Ndb_api_event_bytes_count`

  O número de bytes de eventos recebidos por este servidor MySQL (nó SQL).

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente global em escopo.

  Para mais informações, consulte a Seção 25.6.14, “Contas e variáveis de estatísticas da API NDB”.

* `Ndb_api_pk_op_count_session`

O número de operações nesta sessão do cliente com base em ou usando chaves primárias. Isso inclui operações em tabelas de blobs, operações de desbloqueio implícitas e operações de autoincremento, bem como operações de chave primária visíveis pelo usuário.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas com a sessão atual e não é afetada por outros clientes deste **mysqld**.

Para mais informações, consulte a Seção 25.6.14, “Contas e variáveis de estatísticas da API NDB”.

* `Ndb_api_pk_op_count_replica`

  O número de operações desta replica com base em ou usando chaves primárias. Isso inclui operações em tabelas de blobs, operações de desbloqueio implícitas e operações de autoincremento, bem como operações de chave primária visíveis pelo usuário.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente global em escopo. Se este servidor MySQL não atuar como uma replica ou não usar tabelas NDB, esse valor é sempre 0.

  Para mais informações, consulte a Seção 25.6.14, “Contas e variáveis de estatísticas da API NDB”.

* `Ndb_api_pk_op_count_slave`

  Símbolo desatualizado para `Ndb_api_pk_op_count_replica`.

* `Ndb_api_pk_op_count`

  O número de operações neste servidor MySQL (nó SQL) com base em ou usando chaves primárias. Isso inclui operações em tabelas de blobs, operações de desbloqueio implícitas e operações de autoincremento, bem como operações de chave primária visíveis pelo usuário.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente global em escopo.

  Para mais informações, consulte a Seção 25.6.14, “Contas e variáveis de estatísticas da API NDB”.

* `Ndb_api_pruned_scan_count_session`

O número de varreduras nesta sessão do cliente que foram reduzidas a uma única partição.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas com a sessão atual e não é afetada por outros clientes deste **mysqld**.

Para mais informações, consulte a Seção 25.6.14, “Contas e variáveis de estatísticas da API NDB”.

* `Ndb_api_pruned_scan_count_replica`

O número de varreduras por esta replica que foram reduzidas a uma única partição.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente global em escopo. Se este servidor MySQL não atuar como uma replica ou não usar tabelas NDB, esse valor é sempre 0.

Para mais informações, consulte a Seção 25.6.14, “Contas e variáveis de estatísticas da API NDB”.

* `Ndb_api_pruned_scan_count_slave`

Símbolo desatualizado para `Ndb_api_pruned_scan_count_replica`.

* `Ndb_api_pruned_scan_count`

O número de varreduras por este servidor MySQL (nó SQL) que foram reduzidas a uma única partição.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente global em escopo.

Para mais informações, consulte a Seção 25.6.14, “Contas e variáveis de estatísticas da API NDB”.

* `Ndb_api_range_scan_count_session`

O número de varreduras de intervalo que foram iniciadas nesta sessão do cliente.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas com a sessão atual e não é afetada por outros clientes deste **mysqld**.

Para mais informações, consulte a Seção 25.6.14, “Contas e variáveis de estatísticas da API NDB”.

* `Ndb_api_range_scan_count_replica`

O número de varreduras de intervalo que foram iniciadas por esta replica.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente global em escopo. Se este servidor MySQL não atuar como uma replica ou não usar tabelas NDB, esse valor é sempre 0.

Para mais informações, consulte a Seção 25.6.14, “Contas e Variáveis de Estatísticas da API NDB”.

* `Ndb_api_range_scan_count_slave`

Símbolo desatualizado para `Ndb_api_range_scan_count_replica`.

* `Ndb_api_range_scan_count`

O número de varreduras de intervalo que foram iniciadas por este servidor MySQL (nó SQL).

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente global em escopo.

Para mais informações, consulte a Seção 25.6.14, “Contas e Variáveis de Estatísticas da API NDB”.

* `Ndb_api_read_row_count_session`

O número total de linhas que foram lidas nesta sessão do cliente. Isso inclui todas as linhas lidas por qualquer chave primária, chave única ou operação de varredura realizada nesta sessão do cliente.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas com a sessão atual e não é afetada por outros clientes deste **mysqld**.

Para mais informações, consulte a Seção 25.6.14, “Contas e Variáveis de Estatísticas da API NDB”.

* `Ndb_api_read_row_count_replica`

O número total de linhas que foram lidas por esta replica. Isso inclui todas as linhas lidas por qualquer chave primária, chave única ou operação de varredura realizada por esta replica.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente global em escopo. Se este servidor MySQL não atuar como uma replica ou não usar tabelas NDB, esse valor é sempre 0.

Para mais informações, consulte a Seção 25.6.14, “Contas e Variáveis de Estatísticas da API NDB”.

* `Ndb_api_read_row_count_slave`

  Símbolo desatualizado para `Ndb_api_read_row_count_replica`.

* `Ndb_api_read_row_count`

  O número total de linhas que foram lidas por este servidor MySQL (nó SQL). Isso inclui todas as linhas lidas por qualquer chave primária, chave única ou operação de varredura realizada por este servidor MySQL (nó SQL).

  Você deve estar ciente de que esse valor pode não ser completamente preciso em relação às linhas lidas por consultas `SELECT` `COUNT(*)`, devido ao fato de que, neste caso, o servidor MySQL realmente lê pseudo-linhas na forma `[ID do fragmento da tabela]:[número de linhas no fragmento]` e soma as linhas por fragmento para todos os fragmentos da tabela para derivar um contagem estimada para todas as linhas. O `Ndb_api_read_row_count` usa essa estimativa e não o número real de linhas na tabela.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global.

  Para mais informações, consulte a Seção 25.6.14, “Contas e Variáveis de Estatísticas da API NDB”.

* `Ndb_api_scan_batch_count_session`

  O número de lotes de linhas recebidos nesta sessão do cliente. 1 lote é definido como 1 conjunto de resultados de varredura de um único fragmento.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por outros clientes deste **mysqld**.

  Para mais informações, consulte a Seção 25.6.14, “Contas e Variáveis de Estatísticas da API NDB”.

* `Ndb_api_scan_batch_count_replica`

  O número de lotes de linhas recebidos por esta replica. 1 lote é definido como 1 conjunto de resultados de varredura de um único fragmento.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente global em escopo. Se este servidor MySQL não atuar como uma replica ou não usar tabelas NDB, esse valor é sempre 0.

Para mais informações, consulte a Seção 25.6.14, “Contas e variáveis de estatísticas da API NDB”.

* `Ndb_api_scan_batch_count_slave`

Símbolo desatualizado para `Ndb_api_scan_batch_count_replica`.

* `Ndb_api_scan_batch_count`

O número de lotes de linhas recebidos por este servidor MySQL (nó SQL). 1 lote é definido como 1 conjunto de resultados de varredura de um único fragmento.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela está efetivamente no escopo global.

Para mais informações, consulte a Seção 25.6.14, “Contas e variáveis de estatísticas da API NDB”.

* `Ndb_api_table_scan_count_session`

O número de varreduras de tabelas que foram iniciadas nesta sessão do cliente, incluindo varreduras de tabelas internas.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas com a sessão atual e não é afetada por outros clientes deste **mysqld**.

Para mais informações, consulte a Seção 25.6.14, “Contas e variáveis de estatísticas da API NDB”.

* `Ndb_api_table_scan_count_replica`

O número de varreduras de tabelas que foram iniciadas por esta replica, incluindo varreduras de tabelas internas.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela está efetivamente no escopo global. Se este servidor MySQL não atuar como uma replica ou não usar tabelas NDB, esse valor é sempre 0.

Para mais informações, consulte a Seção 25.6.14, “Contas e variáveis de estatísticas da API NDB”.

* `Ndb_api_table_scan_count_slave`

Sinônimo desatualizado para `Ndb_api_table_scan_count_replica`.

* `Ndb_api_table_scan_count`

  O número de varreduras de tabela iniciadas por este servidor MySQL (nó SQL), incluindo varreduras de tabelas internas.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente global em escopo.

  Para mais informações, consulte a Seção 25.6.14, “Contas e variáveis de estatísticas da API NDB”.

* `Ndb_api_trans_abort_count_session`

  O número de transações abortadas nesta sessão do cliente.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas com a sessão atual e não é afetada por outros clientes deste **mysqld**.

  Para mais informações, consulte a Seção 25.6.14, “Contas e variáveis de estatísticas da API NDB”.

* `Ndb_api_trans_abort_count_replica`

  O número de transações abortadas por esta replica.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente global em escopo. Se este servidor MySQL não atuar como uma replica ou não usar tabelas NDB, esse valor é sempre 0.

  Para mais informações, consulte a Seção 25.6.14, “Contas e variáveis de estatísticas da API NDB”.

* `Ndb_api_trans_abort_count_slave`

  Sinônimo desatualizado para `Ndb_api_trans_abort_count_replica`.

* `Ndb_api_trans_abort_count`

  O número de transações abortadas por este servidor MySQL (nó SQL).

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente global em escopo.

  Para mais informações, consulte a Seção 25.6.14, “Contas e variáveis de estatísticas da API NDB”.

* `Ndb_api_trans_close_count_session`

O número de transações fechadas nesta sessão do cliente. Este valor pode ser maior que a soma de `Ndb_api_trans_commit_count_session` e `Ndb_api_trans_abort_count_session`, pois algumas transações podem ter sido revertidas.

Embora esta variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas com a sessão atual e não é afetada por outros clientes deste **mysqld**.

Para mais informações, consulte a Seção 25.6.14, “Contatores e Variáveis de Estatísticas da API NDB”.

* `Ndb_api_trans_close_count_replica`

  O número de transações fechadas por esta replica. Este valor pode ser maior que a soma de `Ndb_api_trans_commit_count_replica` e `Ndb_api_trans_abort_count_replica`, pois algumas transações podem ter sido revertidas.

  Embora esta variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente global em escopo. Se este servidor MySQL não atuar como uma replica ou não usar tabelas NDB, este valor é sempre 0.

  Para mais informações, consulte a Seção 25.6.14, “Contatores e Variáveis de Estatísticas da API NDB”.

* `Ndb_api_trans_close_count_slave`

  Símbolo desatualizado para `Ndb_api_trans_close_count_replica`.

* `Ndb_api_trans_close_count`

  O número de transações fechadas por este servidor MySQL (nó SQL). Este valor pode ser maior que a soma de `Ndb_api_trans_commit_count` e `Ndb_api_trans_abort_count`, pois algumas transações podem ter sido revertidas.

  Embora esta variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente global em escopo.

  Para mais informações, consulte a Seção 25.6.14, “Contatores e Variáveis de Estatísticas da API NDB”.

* `Ndb_api_trans_commit_count_session`

  O número de transações comprometidas nesta sessão do cliente.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas com a sessão atual e não é afetada por nenhum outro cliente deste **mysqld**.

Para mais informações, consulte a Seção 25.6.14, “Contas e variáveis de estatísticas da API NDB”.

* `Ndb_api_trans_commit_count_replica`

  O número de transações comprometidas por essa replica.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente global em escopo. Se este servidor MySQL não atuar como uma replica ou não usar tabelas NDB, esse valor é sempre 0.

  Para mais informações, consulte a Seção 25.6.14, “Contas e variáveis de estatísticas da API NDB”.

* `Ndb_api_trans_commit_count_slave`

  Símbolo desatualizado para `Ndb_api_trans_commit_count_replica`.

* `Ndb_api_trans_commit_count`

  O número de transações comprometidas por este servidor MySQL (nó SQL).

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente global em escopo.

  Para mais informações, consulte a Seção 25.6.14, “Contas e variáveis de estatísticas da API NDB”.

* `Ndb_api_trans_local_read_row_count_session`

  O número total de linhas lidas nesta sessão do cliente. Isso inclui todas as linhas lidas por qualquer chave primária, chave única ou operação de varredura realizada nesta sessão do cliente.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas com a sessão atual e não é afetada por nenhum outro cliente deste **mysqld**.

  Para mais informações, consulte a Seção 25.6.14, “Contas e variáveis de estatísticas da API NDB”.

* `Ndb_api_trans_local_read_row_count_replica`

O número total de linhas que foram lidas por esta replica. Isso inclui todas as linhas lidas por qualquer chave primária, chave única ou operação de varredura realizada por esta replica.

Embora esta variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se este servidor MySQL não atuar como uma replica ou não usar tabelas NDB, este valor é sempre 0.

Para mais informações, consulte a Seção 25.6.14, “Contas e variáveis de estatísticas da API NDB”.

* `Ndb_api_trans_local_read_row_count_slave`

Símbolo desatualizado para `Ndb_api_trans_local_read_row_count_replica`.

* `Ndb_api_trans_local_read_row_count`

O número total de linhas que foram lidas por este servidor MySQL (nó SQL). Isso inclui todas as linhas lidas por qualquer chave primária, chave única ou operação de varredura realizada por este servidor MySQL (nó SQL).

Embora esta variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global.

Para mais informações, consulte a Seção 25.6.14, “Contas e variáveis de estatísticas da API NDB”.

* `Ndb_api_trans_start_count_session`

O número de transações iniciadas nesta sessão do cliente.

Embora esta variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas com a sessão atual e não é afetada por outros clientes deste **mysqld**.

Para mais informações, consulte a Seção 25.6.14, “Contas e variáveis de estatísticas da API NDB”.

* `Ndb_api_trans_start_count_replica`

O número de transações iniciadas por esta replica.

Embora esta variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente de escopo global. Se este servidor MySQL não atuar como uma replica ou não usar tabelas NDB, este valor é sempre 0.

Para mais informações, consulte a Seção 25.6.14, “Contatores e Variáveis de Estatísticas da API NDB”.

* `Ndb_api_trans_start_count_slave`

Símbolo desatualizado para `Ndb_api_trans_start_count_replica`.

* `Ndb_api_trans_start_count`

O número de transações iniciadas por este servidor MySQL (nó SQL).

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente global em escopo.

Para mais informações, consulte a Seção 25.6.14, “Contatores e Variáveis de Estatísticas da API NDB”.

* `Ndb_api_uk_op_count_session`

O número de operações nesta sessão do cliente com base em ou usando chaves únicas.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas com a sessão atual e não é afetada por outros clientes deste **mysqld**.

Para mais informações, consulte a Seção 25.6.14, “Contatores e Variáveis de Estatísticas da API NDB”.

* `Ndb_api_uk_op_count_replica`

O número de operações por esta replica com base em ou usando chaves únicas.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente global em escopo. Se este servidor MySQL não atuar como uma replica ou não usar tabelas NDB, esse valor é sempre 0.

Para mais informações, consulte a Seção 25.6.14, “Contatores e Variáveis de Estatísticas da API NDB”.

* `Ndb_api_uk_op_count_slave`

Símbolo desatualizado para `Ndb_api_uk_op_count_replica`.

* `Ndb_api_uk_op_count`

O número de operações por este servidor MySQL (nó SQL) com base em ou usando chaves únicas.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente global em escopo.

Para mais informações, consulte a Seção 25.6.14, “Contatores e Variáveis de Estatísticas da API NDB”.

* `Ndb_api_wait_exec_complete_count_session`

  O número de vezes que um fio foi bloqueado nesta sessão do cliente enquanto aguardava a execução de uma operação para ser concluída. Isso inclui todas as chamadas `execute()` e execuções implícitas para operações de blob e autoincremento não visíveis para os clientes.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por outros clientes deste **mysqld**.

  Para mais informações, consulte a Seção 25.6.14, “Contas e variáveis de estatísticas da API NDB”.

* `Ndb_api_wait_exec_complete_count_replica`

  O número de vezes que um fio foi bloqueado por essa replica enquanto aguardava a execução de uma operação para ser concluída. Isso inclui todas as chamadas `execute()` e execuções implícitas para operações de blob e autoincremento não visíveis para os clientes.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente global em escopo. Se esse servidor MySQL não atuar como uma replica ou não usar tabelas NDB, esse valor é sempre 0.

  Para mais informações, consulte a Seção 25.6.14, “Contas e variáveis de estatísticas da API NDB”.

* `Ndb_api_wait_exec_complete_count_slave`

  Símbolo desatualizado para `Ndb_api_wait_exec_complete_count_replica`.

* `Ndb_api_wait_exec_complete_count`

  O número de vezes que um fio foi bloqueado por este servidor MySQL (nó SQL) enquanto aguardava a execução de uma operação para ser concluída. Isso inclui todas as chamadas `execute()` e execuções implícitas para operações de blob e autoincremento não visíveis para os clientes.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente global em escopo.

Para mais informações, consulte a Seção 25.6.14, “Contas e Variáveis de Estatísticas da API NDB”.

* `Ndb_api_wait_meta_request_count_session`

  O número de vezes que um thread foi bloqueado nesta sessão do cliente enquanto aguardava por um sinal baseado em metadados, como o esperado para solicitações de DDL, novas épocas e apreensão de registros de transações.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por outros clientes deste **mysqld**.

  Para mais informações, consulte a Seção 25.6.14, “Contas e Variáveis de Estatísticas da API NDB”.

* `Ndb_api_wait_meta_request_count_replica`

  O número de vezes que um thread foi bloqueado por essa replica enquanto aguardava por um sinal baseado em metadados, como o esperado para solicitações de DDL, novas épocas e apreensão de registros de transações.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente global em escopo. Se esse servidor MySQL não atuar como uma replica ou não usar tabelas NDB, esse valor será sempre 0.

  Para mais informações, consulte a Seção 25.6.14, “Contas e Variáveis de Estatísticas da API NDB”.

* `Ndb_api_wait_nanos_count_session`

Tempo total (em nanosegundos) gasto nesta sessão do cliente esperando qualquer tipo de sinal dos nós de dados.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por outros clientes deste **mysqld**.

Para mais informações, consulte a Seção 25.6.14, “Contas e variáveis de estatísticas de API NDB”.

* `Ndb_api_wait_nanos_count_replica`

Tempo total (em nanosegundos) gasto por essa replica esperando qualquer tipo de sinal dos nós de dados.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente global em escopo. Se este servidor MySQL não atuar como uma replica ou não usar tabelas NDB, esse valor é sempre 0.

Para mais informações, consulte a Seção 25.6.14, “Contas e variáveis de estatísticas de API NDB”.

* `Ndb_api_wait_nanos_count_slave`

Símbolo desatualizado para `Ndb_api_wait_nanos_count_replica`.

* `Ndb_api_wait_nanos_count`

Tempo total (em nanosegundos) gasto neste servidor MySQL (nó SQL) esperando qualquer tipo de sinal dos nós de dados.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente global em escopo.

Para mais informações, consulte a Seção 25.6.14, “Contas e variáveis de estatísticas de API NDB”.

* `Ndb_api_wait_scan_result_count_session`

O número de vezes que um thread foi bloqueado nesta sessão do cliente enquanto esperava por um sinal baseado em varredura, como quando esperando por mais resultados de uma varredura ou quando esperando por uma varredura para fechar.

Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela se relaciona apenas à sessão atual e não é afetada por outros clientes deste **mysqld**.

Para mais informações, consulte a Seção 25.6.14, “Contas e variáveis de estatísticas da API NDB”.

* `Ndb_api_wait_scan_result_count_replica`

  O número de vezes que um thread foi bloqueado por essa replica enquanto aguardava um sinal baseado em varredura, como quando aguardando mais resultados de uma varredura ou quando aguardando que uma varredura seja encerrada.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente global em escopo. Se esse servidor MySQL não atuar como uma replica ou não usar tabelas NDB, esse valor é sempre 0.

  Para mais informações, consulte a Seção 25.6.14, “Contas e variáveis de estatísticas da API NDB”.

* `Ndb_api_wait_scan_result_count_slave`

  Símbolo desatualizado para `Ndb_api_wait_scan_result_count_replica`.

* `Ndb_api_wait_scan_result_count`

  O número de vezes que um thread foi bloqueado por esse servidor MySQL (nó SQL) enquanto aguardava um sinal baseado em varredura, como quando aguardando mais resultados de uma varredura ou quando aguardando que uma varredura seja encerrada.

  Embora essa variável possa ser lida usando `SHOW GLOBAL STATUS` ou `SHOW SESSION STATUS`, ela é efetivamente global em escopo.

  Para mais informações, consulte a Seção 25.6.14, “Contas e variáveis de estatísticas da API NDB”.

* `Ndb_cluster_node_id`

  Se o servidor estiver atuando como um nó do NDB Cluster, então o valor dessa variável é o ID do nó do cluster.

  Se o servidor não fazer parte de um NDB Cluster, então o valor dessa variável é 0.

* `Ndb_config_from_host`

  Se o servidor fizer parte de um NDB Cluster, o valor dessa variável é o nome do host ou o endereço IP do servidor de gerenciamento do Cluster do qual ele obtém seus dados de configuração.

  Se o servidor não fazer parte de um NDB Cluster, então o valor dessa variável é uma string vazia.

* `Ndb_config_from_port`

Se o servidor faz parte de um NDB Cluster, o valor desta variável é o número da porta através da qual ele está conectado ao servidor de gerenciamento do cluster, do qual ele obtém seus dados de configuração.

Se o servidor não faz parte de um NDB Cluster, então o valor desta variável é 0.

* `Ndb_config_generation`

  Mostra o número de geração da configuração atual do cluster. Isso pode ser usado como um indicador para determinar se a configuração do cluster mudou desde que este nó SQL se conectou pela última vez ao cluster.

* `Ndb_conflict_fn_epoch`

  Usado na resolução de conflitos da replicação do NDB Cluster, esta variável mostra o número de linhas encontradas em conflito usando a resolução de conflitos `NDB$EPOCH()` em um **mysqld** dado desde a última vez que ele foi reiniciado.

  Para mais informações, consulte a Seção 25.7.12, “Resolução de Conflitos da Replicação do NDB Cluster”.

* `Ndb_conflict_fn_epoch_trans`

  Usado na resolução de conflitos da replicação do NDB Cluster, esta variável mostra o número de linhas encontradas em conflito usando a resolução de conflitos `NDB$EPOCH_TRANS()` em um **mysqld** dado desde a última vez que ele foi reiniciado.

  Para mais informações, consulte `NDB$EPOCH_TRANS()`.

* `Ndb_conflict_fn_epoch2`

  Mostra o número de linhas encontradas em conflito na resolução de conflitos da replicação do NDB Cluster, quando usando `NDB$EPOCH2()`, no fonte designado como primário desde a última vez que ele foi reiniciado.

  Para mais informações, consulte `NDB$EPOCH2()`.

* `Ndb_conflict_fn_epoch2_trans`

  Usado na resolução de conflitos da replicação do NDB Cluster, esta variável mostra o número de linhas encontradas em conflito usando a resolução de conflitos `NDB$EPOCH_TRANS2()` em um **mysqld** dado desde a última vez que ele foi reiniciado.

Para mais informações, consulte NDB$EPOCH2_TRANS()").

* `Ndb_conflict_fn_max`

  Utilizada na resolução de conflitos da replicação do NDB Cluster, essa variável mostra o número de vezes que uma linha não foi aplicada no nó SQL atual devido à resolução de conflitos "o maior timestamp vence" desde a última vez que este **mysqld** foi iniciado.

  Para mais informações, consulte a Seção 25.7.12, "Resolução de Conflitos da Replicação do NDB Cluster".

* `Ndb_conflict_fn_max_del_win`

  Mostra o número de vezes que uma linha foi rejeitada no nó SQL atual devido à resolução de conflitos da replicação do NDB Cluster usando `NDB$MAX_DELETE_WIN()`, desde a última vez que este **mysqld** foi iniciado.

  Para mais informações, consulte a Seção 25.7.12, "Resolução de Conflitos da Replicação do NDB Cluster".

* `Ndb_conflict_fn_max_del_win_ins`

  Mostra o número de vezes que a inserção de uma linha foi rejeitada no nó SQL atual devido à resolução de conflitos da replicação do NDB Cluster usando `NDB$MAX_DEL_WIN_INS()`, desde a última vez que este **mysqld** foi iniciado.

  Para mais informações, consulte a Seção 25.7.12, "Resolução de Conflitos da Replicação do NDB Cluster".

* `Ndb_conflict_fn_max_ins`

  Utilizada na resolução de conflitos da replicação do NDB Cluster, essa variável mostra o número de vezes que uma linha não foi inserida no nó SQL atual devido à resolução de conflitos "o maior timestamp vence" desde a última vez que este **mysqld** foi iniciado.

  Para mais informações, consulte a Seção 25.7.12, "Resolução de Conflitos da Replicação do NDB Cluster".

* `Ndb_conflict_fn_old`

  Utilizada na resolução de conflitos da replicação do NDB Cluster, essa variável mostra o número de vezes que uma linha não foi aplicada como resultado da resolução de conflitos "o mesmo timestamp vence" em um determinado **mysqld** desde a última vez que ele foi reiniciado.

Para mais informações, consulte a Seção 25.7.12, “Resolução de Conflitos de Replicação de NDB Cluster”.

* `Ndb_conflict_last_conflict_epoch`

  A epoca mais recente em que um conflito foi detectado nesta replica. Você pode comparar esse valor com `Ndb_replica_max_replicated_epoch`; se `Ndb_replica_max_replicated_epoch` for maior que `Ndb_conflict_last_conflict_epoch`, nenhum conflito foi detectado ainda.

  Consulte a Seção 25.7.12, “Resolução de Conflitos de Replicação de NDB Cluster”, para mais informações.

* `Ndb_conflict_reflected_op_discard_count`

  Ao usar a resolução de conflitos de replicação de NDB Cluster, este é o número de operações refletidas que não foram aplicadas no secundário, devido ao encontro de um erro durante a execução.

  Consulte a Seção 25.7.12, “Resolução de Conflitos de Replicação de NDB Cluster”, para mais informações.

* `Ndb_conflict_reflected_op_prepare_count`

  Ao usar a resolução de conflitos com a replicação de NDB Cluster, esta variável de status contém o número de operações refletidas que foram definidas (ou seja, preparadas para execução no secundário).

  Consulte a Seção 25.7.12, “Resolução de Conflitos de Replicação de NDB Cluster”.

* `Ndb_conflict_refresh_op_count`

  Ao usar a resolução de conflitos com a replicação de NDB Cluster, este número indica o número de operações de atualização que foram preparadas para execução no secundário.

  Consulte a Seção 25.7.12, “Resolução de Conflitos de Replicação de NDB Cluster”, para mais informações.

* `Ndb_conflict_last_stable_epoch`

  Número de linhas encontradas em conflito por uma função de conflito transacional

  Consulte a Seção 25.7.12, “Resolução de Conflitos de Replicação de NDB Cluster”, para mais informações.

* `Ndb_conflict_trans_row_conflict_count`

Utilizado na resolução de conflitos da replicação em clúster NDB, essa variável de status mostra o número de linhas encontradas como estando diretamente em conflito por uma função de detecção de conflitos transacionais em um **mysqld** específico desde a última vez que ele foi reiniciado.

Atualmente, a única função de detecção de conflitos transacionais suportada pelo NDB Cluster é o NDB$EPOCH_TRANS(), então essa variável de status é efetivamente a mesma que `Ndb_conflict_fn_epoch_trans`.

Para mais informações, consulte a Seção 25.7.12, “Resolução de Conflitos de Replicação em Clúster NDB”.

* `Ndb_conflict_trans_row_reject_count`

  Utilizado na resolução de conflitos da replicação em clúster NDB, essa variável de status mostra o número total de linhas realineadas devido a serem determinadas como conflitantes por uma função de detecção de conflitos transacionais. Isso inclui não apenas `Ndb_conflict_trans_row_conflict_count`, mas quaisquer linhas em ou dependentes de transações conflitantes.

  Para mais informações, consulte a Seção 25.7.12, “Resolução de Conflitos de Replicação em Clúster NDB”.

* `Ndb_conflict_trans_reject_count`

  Utilizado na resolução de conflitos da replicação em clúster NDB, essa variável de status mostra o número de transações encontradas como estando em conflito por uma função de detecção de conflitos transacionais.

  Para mais informações, consulte a Seção 25.7.12, “Resolução de Conflitos de Replicação em Clúster NDB”.

* `Ndb_conflict_trans_detect_iter_count`

  Utilizado na resolução de conflitos da replicação em clúster NDB, isso mostra o número de iterações internas necessárias para confirmar uma transação de época. Deve ser (levemente) maior ou igual a `Ndb_conflict_trans_conflict_commit_count`.

  Para mais informações, consulte a Seção 25.7.12, “Resolução de Conflitos de Replicação em Clúster NDB”.

* `Ndb_conflict_trans_conflict_commit_count`

Utilizado na resolução de conflitos da replicação em clúster NDB, este mostra o número de transações de epoch comprometidas após a necessidade de lidar com conflitos transacionais.

Para mais informações, consulte a Seção 25.7.12, “Resolução de Conflitos da Replicação em Clúster NDB”.

* `Ndb_epoch_delete_delete_count`

  Ao usar a detecção de conflitos delete-delete, este é o número de conflitos delete-delete detectados, onde uma operação de exclusão é aplicada, mas a linha indicada não existe.

* `Ndb_execute_count`

  Fornece o número de viagens para o kernel `NDB` feitas por operações.

* `Ndb_fetch_table_stats`

  Este contador é incrementado sempre que um servidor MySQL que atua como um nó da API do NDB Cluster busca estatísticas de tabela para uma tabela específica, em vez de usar estatísticas armazenadas em cache.

* `Ndb_last_commit_epoch_server`

  O epoch mais recentemente comprometido pelo `NDB`.

* `Ndb_last_commit_epoch_session`

  O epoch mais recentemente comprometido pelo cliente `NDB` atual.

* `Ndb_metadata_detected_count`

  O número de vezes desde que o servidor foi iniciado pela última vez que o thread de detecção de mudanças de metadados do NDB descobriu mudanças em relação ao dicionário de dados do MySQL.

* `Ndb_metadata_excluded_count`

  O número de objetos de metadados que o thread binlog do NDB não conseguiu sincronizar neste nó SQL desde que foi reiniciado pela última vez.

  Se um objeto for excluído, ele não será mais considerado para sincronização automática até que o usuário corrija a incompatibilidade manualmente. Isso pode ser feito tentando usar a tabela com uma instrução como `SHOW CREATE TABLE table`, `SELECT * FROM table` ou qualquer outra instrução que acione a descoberta da tabela.

* `Ndb_metadata_synced_count`

  O número de objetos de metadados do NDB que foram sincronizados neste nó SQL desde que foi reiniciado pela última vez.

* `Ndb_número_de_nós_de_dados`

  Se o servidor faz parte de um NDB Cluster, o valor desta variável é o número de nós de dados no cluster.

  Se o servidor não faz parte de um NDB Cluster, o valor desta variável é 0.

* `Ndb_consultas_empurradas_definidas`

  O número total de junções empurradas para o núcleo NDB para tratamento distribuído nos nós de dados.

  Nota

  As junções testadas usando `EXPLAIN` que podem ser empurradas contribuem para este número.

* `Ndb_consultas_empurradas_abandonadas`

  O número de junções que foram empurradas para o núcleo NDB, mas que não puderam ser tratadas lá.

* `Ndb_consultas_empurradas_executadas`

  O número de junções executadas com sucesso empurradas para `NDB` e executadas lá.

* `Ndb_leitura_empurradas`

  O número de linhas devolvidas ao **mysqld** a partir do núcleo NDB por junções que foram empurradas.

  Nota

  Executar `EXPLAIN` em junções que podem ser empurradas para `NDB` não adiciona a este número.

* `Ndb_quantidade_de_varreduras_eliminadas`

  Esta variável contém uma contagem do número de varreduras executadas pelo `NDBCLUSTER` desde que o NDB Cluster foi iniciado pela última vez onde o `NDBCLUSTER` pôde usar a eliminação de partições.

  Usar esta variável juntamente com `Ndb_quantidade_de_varreduras` pode ser útil no design do esquema para maximizar a capacidade do servidor de eliminar varreduras para uma única partição da tabela, envolvendo assim apenas um único nó de dados.

* `Ndb_max_epoch_replica_reprogramada`

  O epoch mais recentemente comprometido nesta replica. Você pode comparar este valor com `Ndb_epoch_ultimo_conflito_epoch`; se `Ndb_max_epoch_replica_reprogramada` for o maior dos dois, nenhum conflito foi detectado ainda.

  Para mais informações, consulte a Seção 25.7.12, “Resolução de Conflitos de Replicação de NDB Cluster”.

* `Ndb_quantidade_de_varreduras`

Esta variável contém um contador do número total de varreduras executadas pelo `NDBCLUSTER` desde que o NDB Cluster foi iniciado pela última vez.

* `Ndb_schema_participant_count`

  Indica o número de servidores MySQL que estão participando da distribuição de alterações de esquema NDB.

* `Ndb_slave_max_replicated_epoch`

  Sinônimo desatualizado de `Ndb_replica_max_replicated_epoch`.

* `Ndb_system_name`

  Se este servidor MySQL estiver conectado a um cluster NDB, esta variável de leitura somente mostra o nome do sistema do cluster. Caso contrário, o valor é uma string vazia.

* `Ndb_trans_hint_count_session`

  O número de transações que utilizam dicas que foram iniciadas na sessão atual. Compare com `Ndb_api_trans_start_count_session` para obter a proporção de todas as transações NDB que podem usar dicas.