#### 13.7.5.15 Instrução SHOW ENGINE

```sql
SHOW ENGINE engine_name {STATUS | MUTEX}
```

[`SHOW ENGINE`](show-engine.html "13.7.5.15 SHOW ENGINE Statement") exibe informações operacionais sobre um storage engine. Requer o privilégio [`PROCESS`](privileges-provided.html#priv_process). A instrução possui estas variantes:

```sql
SHOW ENGINE INNODB STATUS
SHOW ENGINE INNODB MUTEX
SHOW ENGINE PERFORMANCE_SCHEMA STATUS
```

[`SHOW ENGINE INNODB STATUS`](show-engine.html "13.7.5.15 SHOW ENGINE Statement") exibe informações extensas do Monitor `InnoDB` padrão sobre o estado do storage engine `InnoDB`. Para obter informações sobre o monitor padrão e outros `InnoDB` Monitors que fornecem informações sobre o processamento `InnoDB`, consulte [Seção 14.18, “Monitores InnoDB”](innodb-monitors.html "14.18 InnoDB Monitors").

[`SHOW ENGINE INNODB MUTEX`](show-engine.html "13.7.5.15 SHOW ENGINE Statement") exibe estatísticas de [mutex](glossary.html#glos_mutex "mutex") e [rw-lock](glossary.html#glos_rw_lock "rw-lock") do `InnoDB`.

Nota

Os mutexes e rw-locks do `InnoDB` também podem ser monitorados usando tabelas do [Performance Schema](performance-schema.html "Chapter 25 MySQL Performance Schema"). Consulte [Seção 14.17.2, “Monitorando Esperas de Mutex do InnoDB Usando Performance Schema”](monitor-innodb-mutex-waits-performance-schema.html "14.17.2 Monitoring InnoDB Mutex Waits Using Performance Schema").

A saída de [`SHOW ENGINE INNODB MUTEX`](show-engine.html "13.7.5.15 SHOW ENGINE Statement") foi removida no MySQL 5.7.2. Ela foi revisada e reintroduzida no MySQL 5.7.8.

No MySQL 5.7.8, a coleta de estatísticas de mutex é configurada dinamicamente usando as seguintes opções:

* Para habilitar a coleta de estatísticas de mutex, execute:

  ```sql
  SET GLOBAL innodb_monitor_enable='latch';
  ```

* Para redefinir as estatísticas de mutex, execute:

  ```sql
  SET GLOBAL innodb_monitor_reset='latch';
  ```

* Para desabilitar a coleta de estatísticas de mutex, execute:

  ```sql
  SET GLOBAL innodb_monitor_disable='latch';
  ```

A coleta de estatísticas de mutex para [`SHOW ENGINE INNODB MUTEX`](show-engine.html "13.7.5.15 SHOW ENGINE Statement") também pode ser habilitada configurando [`innodb_monitor_enable='all'`](innodb-parameters.html#sysvar_innodb_monitor_enable), ou desabilitada configurando [`innodb_monitor_disable='all'`](innodb-parameters.html#sysvar_innodb_monitor_disable).

A saída de [`SHOW ENGINE INNODB MUTEX`](show-engine.html "13.7.5.15 SHOW ENGINE Statement") possui estas colunas:

* `Type`

  Sempre `InnoDB`.

* `Name`

  Antes do MySQL 5.7.8, o campo `Name` reporta o arquivo fonte onde o mutex é implementado e o número da linha no arquivo onde o mutex é criado. O número da linha é específico para sua versão do MySQL. A partir do MySQL 5.7.8, apenas o nome do mutex é reportado. O nome do arquivo e o número da linha ainda são reportados para rwlocks.

* `Status`

  O status do mutex.

  Antes do MySQL 5.7.8, o campo `Status` exibe vários valores se [`WITH_DEBUG`](source-configuration-options.html#option_cmake_with_debug) foi definido no momento da compilação do MySQL. Se [`WITH_DEBUG`](source-configuration-options.html#option_cmake_with_debug) não foi definido, a instrução exibe apenas o valor `os_waits`. Neste último caso (sem [`WITH_DEBUG`](source-configuration-options.html#option_cmake_with_debug)), a informação na qual a saída se baseia é insuficiente para distinguir mutexes regulares e mutexes que protegem rwlocks (que permitem múltiplos leitores ou um único escritor). Consequentemente, a saída pode parecer conter múltiplas linhas para o mesmo mutex. Os valores do campo `Status` anteriores ao MySQL 5.7.8 incluem:

  + `count` indica quantas vezes o mutex foi solicitado.

  + `spin_waits` indica quantas vezes o spinlock teve que ser executado.

  + `spin_rounds` indica o número de rounds do spinlock. (`spin_rounds` dividido por `spin_waits` fornece a contagem média de rounds.)

  + `os_waits` indica o número de waits do sistema operacional. Isso ocorre quando o spinlock não funcionou (o mutex não foi Locked durante o spinlock e foi necessário ceder ao sistema operacional e esperar).

  + `os_yields` indica o número de vezes que uma Thread tentando fazer o Lock de um mutex cedeu seu timeslice e cedeu ao sistema operacional (sob a presunção de que permitir que outras Threads sejam executadas libera o mutex para que ele possa ser Locked).

  + `os_wait_times` indica a quantidade de tempo (em ms) gasta em waits do sistema operacional. No MySQL 5.7, o timing está desabilitado e este valor é sempre 0.

  A partir do MySQL 5.7.8, o campo `Status` reporta o número de spins, waits e calls. Estatísticas para mutexes de baixo nível do sistema operacional, que são implementados fora do `InnoDB`, não são reportadas.

  + `spins` indica o número de spins.
  + `waits` indica o número de mutex waits.

  + `calls` indica quantas vezes o mutex foi solicitado.

`SHOW ENGINE INNODB MUTEX` não lista mutexes e rw-locks para cada Buffer Pool block, pois a quantidade de saída seria excessiva em sistemas com um Buffer Pool grande. No entanto, `SHOW ENGINE INNODB MUTEX` imprime valores agregados de spin, wait e call de `BUF_BLOCK_MUTEX` para mutexes e rw-locks de Buffer Pool block. `SHOW ENGINE INNODB MUTEX` também não lista quaisquer mutexes ou rw-locks que nunca foram esperados (`os_waits=0`). Assim, `SHOW ENGINE INNODB MUTEX` exibe informações apenas sobre mutexes e rw-locks fora do Buffer Pool que causaram pelo menos um [wait](glossary.html#glos_wait "wait") em nível de OS.

Use [`SHOW ENGINE PERFORMANCE_SCHEMA STATUS`](show-engine.html "13.7.5.15 SHOW ENGINE Statement") para inspecionar a operação interna do código do Performance Schema:

```sql
mysql> SHOW ENGINE PERFORMANCE_SCHEMA STATUS\G
...
*************************** 3. row ***************************
  Type: performance_schema
  Name: events_waits_history.size
Status: 76
*************************** 4. row ***************************
  Type: performance_schema
  Name: events_waits_history.count
Status: 10000
*************************** 5. row ***************************
  Type: performance_schema
  Name: events_waits_history.memory
Status: 760000
...
*************************** 57. row ***************************
  Type: performance_schema
  Name: performance_schema.memory
Status: 26459600
...
```

Esta instrução visa ajudar o DBA a entender os efeitos que diferentes opções do Performance Schema têm nos requisitos de memória.

Os valores de `Name` consistem em duas partes, que nomeiam, respectivamente, um Buffer interno e um atributo de Buffer. Interprete os nomes dos Buffers da seguinte forma:

* Um Buffer interno que não é exposto como uma tabela é nomeado entre parênteses. Exemplos: `(pfs_cond_class).size`, `(pfs_mutex_class).memory`.

* Um Buffer interno que é exposto como uma tabela no Database `performance_schema` é nomeado de acordo com a tabela, sem parênteses. Exemplos: `events_waits_history.size`, `mutex_instances.count`.

* Um valor que se aplica ao Performance Schema como um todo começa com `performance_schema`. Exemplo: `performance_schema.memory`.

Os atributos de Buffer têm os seguintes significados:

* `size` é o tamanho do registro interno usado pela implementação, como o tamanho de uma linha em uma tabela. Os valores de `size` não podem ser alterados.

* `count` é o número de registros internos, como o número de linhas em uma tabela. Os valores de `count` podem ser alterados usando opções de configuração do Performance Schema.

* Para uma tabela, `tbl_name.memory` é o produto de `size` e `count`. Para o Performance Schema como um todo, `performance_schema.memory` é a soma de toda a memória usada (a soma de todos os outros valores de `memory`).

Em alguns casos, existe uma relação direta entre um parâmetro de configuração do Performance Schema e um valor de `SHOW ENGINE`. Por exemplo, `events_waits_history_long.count` corresponde a [`performance_schema_events_waits_history_long_size`](performance-schema-system-variables.html#sysvar_performance_schema_events_waits_history_long_size). Em outros casos, a relação é mais complexa. Por exemplo, `events_waits_history.count` corresponde a [`performance_schema_events_waits_history_size`](performance-schema-system-variables.html#sysvar_performance_schema_events_waits_history_size) (o número de linhas por Thread) multiplicado por [`performance_schema_max_thread_instances`](performance-schema-system-variables.html#sysvar_performance_schema_max_thread_instances) (o número de Threads).

**SHOW ENGINE NDB STATUS.** Se o servidor tiver o storage engine [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") habilitado, `SHOW ENGINE NDB STATUS` exibe informações de status do Cluster, como o número de data nodes conectados, a connectstring do Cluster e os epochs do binary log do Cluster, bem como contagens de vários objetos da Cluster API criados pelo MySQL Server quando conectado ao Cluster. Um exemplo da saída desta instrução é mostrado aqui:

```sql
mysql> SHOW ENGINE NDB STATUS;
+------------+-----------------------+--------------------------------------------------+
| Type       | Name                  | Status                                           |
+------------+-----------------------+--------------------------------------------------+
| ndbcluster | connection            | cluster_node_id=7,
  connected_host=198.51.100.103, connected_port=1186, number_of_data_nodes=4,
  number_of_ready_data_nodes=3, connect_count=0                                         |
| ndbcluster | NdbTransaction        | created=6, free=0, sizeof=212                    |
| ndbcluster | NdbOperation          | created=8, free=8, sizeof=660                    |
| ndbcluster | NdbIndexScanOperation | created=1, free=1, sizeof=744                    |
| ndbcluster | NdbIndexOperation     | created=0, free=0, sizeof=664                    |
| ndbcluster | NdbRecAttr            | created=1285, free=1285, sizeof=60               |
| ndbcluster | NdbApiSignal          | created=16, free=16, sizeof=136                  |
| ndbcluster | NdbLabel              | created=0, free=0, sizeof=196                    |
| ndbcluster | NdbBranch             | created=0, free=0, sizeof=24                     |
| ndbcluster | NdbSubroutine         | created=0, free=0, sizeof=68                     |
| ndbcluster | NdbCall               | created=0, free=0, sizeof=16                     |
| ndbcluster | NdbBlob               | created=1, free=1, sizeof=264                    |
| ndbcluster | NdbReceiver           | created=4, free=0, sizeof=68                     |
| ndbcluster | binlog                | latest_epoch=155467, latest_trans_epoch=148126,
  latest_received_binlog_epoch=0, latest_handled_binlog_epoch=0,
  latest_applied_binlog_epoch=0                                                         |
+------------+-----------------------+--------------------------------------------------+
```

A coluna `Status` em cada uma dessas linhas fornece informações sobre a conexão do MySQL server com o Cluster e sobre o status do Cluster binary log, respectivamente. A informação de `Status` está na forma de um conjunto de pares nome/valor delimitado por vírgulas.

A coluna `Status` da linha `connection` contém os pares nome/valor descritos na tabela a seguir.

<table summary="Pares nome e valor encontrados na coluna Status da linha connection na saída da instrução SHOW ENGINE NDB STATUS."><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Nome</th> <th>Valor</th> </tr></thead><tbody><tr> <td><code>cluster_node_id</code></td> <td>O ID do Node do MySQL server no Cluster</td> </tr><tr> <td><code>connected_host</code></td> <td>O nome do host ou endereço IP do servidor de gerenciamento do Cluster ao qual o MySQL server está conectado</td> </tr><tr> <td><code>connected_port</code></td> <td>A porta usada pelo MySQL server para se conectar ao servidor de gerenciamento (<code>connected_host</code>)</td> </tr><tr> <td><code>number_of_data_nodes</code></td> <td>O número de data nodes configurados para o Cluster (ou seja, o número de seções <code>[ndbd]</code> no arquivo <code>config.ini</code> do Cluster)</td> </tr><tr> <td><code>number_of_ready_data_nodes</code></td> <td>O número de data nodes no Cluster que estão realmente em execução</td> </tr><tr> <td><code>connect_count</code></td> <td>O número de vezes que este <span><strong>mysqld</strong></span> se conectou ou reconectou aos data nodes do Cluster</td> </tr></tbody></table>

A coluna `Status` da linha `binlog` contém informações relacionadas à Replicação do NDB Cluster. Os pares nome/valor que ela contém são descritos na tabela a seguir.

<table summary="Pares nome e valor encontrados na coluna Status da linha binlog na saída da instrução SHOW ENGINE NDB STATUS."><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Nome</th> <th>Valor</th> </tr></thead><tbody><tr> <td><code>latest_epoch</code></td> <td>O epoch mais recente executado neste MySQL server (ou seja, o número de sequência da transação mais recente executada no servidor)</td> </tr><tr> <td><code>latest_trans_epoch</code></td> <td>O epoch mais recente processado pelos data nodes do Cluster</td> </tr><tr> <td><code>latest_received_binlog_epoch</code></td> <td>O epoch mais recente recebido pela Binary Log Thread</td> </tr><tr> <td><code>latest_handled_binlog_epoch</code></td> <td>O epoch mais recente processado pela Binary Log Thread (para escrita no Binary Log)</td> </tr><tr> <td><code>latest_applied_binlog_epoch</code></td> <td>O epoch mais recente realmente escrito no Binary Log</td> </tr></tbody></table>

Consulte [Seção 21.7, “Replicação NDB Cluster”](mysql-cluster-replication.html "21.7 NDB Cluster Replication"), para obter mais informações.

As linhas restantes da saída de `SHOW ENGINE NDB STATUS` que têm maior probabilidade de serem úteis no monitoramento do Cluster estão listadas aqui por `Name`:

* `NdbTransaction`: O número e o tamanho dos objetos `NdbTransaction` que foram criados. Um `NdbTransaction` é criado toda vez que uma operação de schema de tabela (como [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") ou [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement")) é realizada em uma tabela [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6").

* `NdbOperation`: O número e o tamanho dos objetos `NdbOperation` que foram criados.

* `NdbIndexScanOperation`: O número e o tamanho dos objetos `NdbIndexScanOperation` que foram criados.

* `NdbIndexOperation`: O número e o tamanho dos objetos `NdbIndexOperation` que foram criados.

* `NdbRecAttr`: O número e o tamanho dos objetos `NdbRecAttr` que foram criados. Em geral, um desses é criado toda vez que uma instrução de manipulação de dados é executada por um SQL node.

* `NdbBlob`: O número e o tamanho dos objetos `NdbBlob` que foram criados. Um `NdbBlob` é criado para cada nova operação envolvendo uma coluna [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") em uma tabela [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6").

* `NdbReceiver`: O número e o tamanho de quaisquer objetos `NdbReceiver` que foram criados. O número na coluna `created` é o mesmo que o número de data nodes no Cluster aos quais o MySQL server se conectou.

Nota

`SHOW ENGINE NDB STATUS` retorna um resultado vazio se nenhuma operação envolvendo tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tiver sido realizada durante a sessão atual pelo cliente MySQL que está acessando o SQL node no qual esta instrução foi executada.