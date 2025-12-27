#### 15.7.7.17.1 Declaração do Motor de Banco de Dados

```
SHOW ENGINE engine_name {STATUS | MUTEX}
```

`SHOW ENGINE` exibe informações operacionais sobre um motor de armazenamento. Requer o privilégio `PROCESS`. A declaração tem essas variantes:

```
SHOW ENGINE INNODB STATUS
SHOW ENGINE INNODB MUTEX
SHOW ENGINE PERFORMANCE_SCHEMA STATUS
```

`SHOW ENGINE INNODB STATUS` exibe informações extensas do Monitor padrão `InnoDB` sobre o estado do motor de armazenamento `InnoDB`. Para informações sobre o monitor padrão e outros monitores `InnoDB` que fornecem informações sobre o processamento do `InnoDB`, consulte a Seção 17.17, “Monitores InnoDB”.

`SHOW ENGINE INNODB MUTEX` exibe estatísticas de mutexes e bloqueios rw-do `InnoDB`.

Nota

Os mutexes e bloqueios rw-do `InnoDB` também podem ser monitorados usando as tabelas do Schema de Desempenho. Consulte a Seção 17.16.2, “Monitoramento de Espera de Mutex InnoDB Usando o Schema de Desempenho”.

A coleta de estatísticas de mutexes é configurada dinamicamente usando as seguintes opções:

* Para habilitar a coleta de estatísticas de mutexes, execute:

  ```
  SET GLOBAL innodb_monitor_enable='latch';
  ```

* Para reiniciar as estatísticas de mutexes, execute:

  ```
  SET GLOBAL innodb_monitor_reset='latch';
  ```

* Para desabilitar a coleta de estatísticas de mutexes, execute:

  ```
  SET GLOBAL innodb_monitor_disable='latch';
  ```

A coleta de estatísticas de mutexes para `SHOW ENGINE INNODB MUTEX` também pode ser habilitada definindo `innodb_monitor_enable='all'`, ou desabilitada definindo `innodb_monitor_disable='all'`.

A saída de `SHOW ENGINE INNODB MUTEX` tem essas colunas:

* `Type`

  Sempre `InnoDB`.

* `Name`

  Para mutexes, o campo `Name` relata apenas o nome do mutex. Para bloqueios rw, o campo `Name` relata o arquivo de origem onde o bloqueio rw é implementado e o número de linha no arquivo onde o bloqueio rw é criado. O número de linha é específico para sua versão do MySQL.

* `Status`

  O status do mutex. Este campo relata o número de giros, espera e chamadas. As estatísticas para mutexes de nível operacional, que são implementados fora do `InnoDB`, não são relatadas.

+ `spins` indica o número de rodadas.
+ `waits` indica o número de espera por mutex.

+ `calls` indica quantas vezes o mutex foi solicitado.

`SHOW ENGINE INNODB MUTEX` não lista mutexes e bloqueios rw para cada bloco do pool de buffers, pois a quantidade de saída seria esmagadora em sistemas com um grande pool de buffers. `SHOW ENGINE INNODB MUTEX`, no entanto, imprime os valores agregados de `BUF_BLOCK_MUTEX` para rodadas, espera e chamadas de mutexes e bloqueios rw do bloco do pool de buffers. `SHOW ENGINE INNODB MUTEX` também não lista nenhum mutex ou bloqueio rw que nunca tenha sido aguardado (`os_waits=0`). Assim, `SHOW ENGINE INNODB MUTEX` exibe apenas informações sobre mutexes e bloqueios rw fora do pool de buffers que causaram pelo menos uma espera no nível do sistema operacional.

Use `SHOW ENGINE PERFORMANCE_SCHEMA STATUS` para inspecionar o funcionamento interno do código do Schema de Desempenho:

```
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

Esta declaração destina-se a ajudar o DBA a entender os efeitos que diferentes opções do Schema de Desempenho têm nos requisitos de memória.

Os valores `Name` consistem em duas partes, que nomeiam um buffer interno e um atributo do buffer, respectivamente. Interprete os nomes dos buffers da seguinte forma:

* Um buffer interno que não é exibido como uma tabela é nomeado entre parênteses. Exemplos: `(pfs_cond_class).size`, `(pfs_mutex_class).memory`.

* Um buffer interno que é exibido como uma tabela no banco de dados `performance_schema` é nomeado após a tabela, sem parênteses. Exemplos: `events_waits_history.size`, `mutex_instances.count`.

* Um valor que se aplica ao Schema de Desempenho como um todo começa com `performance_schema`. Exemplo: `performance_schema.memory`.

Os atributos dos buffers têm esses significados:

* `size` é o tamanho do registro interno usado pela implementação, como o tamanho de uma linha em uma tabela. Os valores de `size` não podem ser alterados.

* `count` é o número de registros internos, como o número de linhas em uma tabela. Os valores de `count` podem ser alterados usando as opções de configuração do Schema de Desempenho.

* Para uma tabela, `tbl_name.memory` é o produto de `size` e `count`. Para o Schema de Desempenho como um todo, `performance_schema.memory` é a soma de toda a memória usada (a soma de todos os outros valores de `memory`).

Em alguns casos, há uma relação direta entre um parâmetro de configuração do Schema de Desempenho e um valor de `SHOW ENGINE`. Por exemplo, `events_waits_history_long.count` corresponde a `performance_schema_events_waits_history_long_size`. Em outros casos, a relação é mais complexa. Por exemplo, `events_waits_history.count` corresponde a `performance_schema_events_waits_history_size` (o número de linhas por thread) multiplicado por `performance_schema_max_thread_instances` (o número de threads).

**SHOW ENGINE NDB STATUS.** Se o servidor tiver o mecanismo de armazenamento `NDB` habilitado, `SHOW ENGINE NDB STATUS` exibe informações de status do clúster, como o número de nós de dados conectados, a string de conexão do clúster e as epocas do log binário do clúster, além de contagens de vários objetos da API do Clúster criados pelo MySQL Server quando conectado ao clúster. A saída de exemplo desta declaração é mostrada aqui:

```
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

A coluna `Status` em cada uma dessas linhas fornece informações sobre a conexão do servidor MySQL com o clúster e sobre o status do log binário do clúster, respectivamente. As informações de `Status` estão na forma de um conjunto de pares nome-valor separados por vírgula.

A coluna `Status` da linha `connection` contém os pares nome-valor descritos na tabela a seguir.

<table summary="Pares nome-valor encontrados na coluna Status da linha connection no resultado da declaração SHOW ENGINE NDB STATUS."><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Nome</th> <th>Valor</th> </tr></thead><tbody><tr> <td><code class="literal">cluster_node_id</code></td> <td>O ID do nó do servidor MySQL no cluster</td> </tr><tr> <td><code class="literal">connected_host</code></td> <td>O nome do host ou endereço IP do servidor de gerenciamento do cluster ao qual o servidor MySQL está conectado</td> </tr><tr> <td><code class="literal">connected_port</code></td> <td>A porta usada pelo servidor MySQL para se conectar ao servidor de gerenciamento (<code class="literal">connected_host</code>)</td> </tr><tr> <td><code class="literal">number_of_data_nodes</code></td> <td>O número de nós de dados configurados para o cluster (ou seja, o número de seções de [ndbd] no arquivo de configuração do cluster</code> config.ini`)</td> </tr><tr> <td><code class="literal">number_of_ready_data_nodes</code></td> <td>O número de nós de dados no cluster que estão realmente em execução</td> </tr><tr> <td><code class="literal">connect_count</code></td> <td>O número de vezes que este <a class="link" href="mysqld.html" title="6.3.1 mysqld — O Servidor MySQL"><span class="command"><strong>mysqld</strong></span></a> se conectou ou reconectou aos nós de dados do cluster</td> </tr></tbody></table>

A coluna `Status` da linha `binlog` contém informações relacionadas à Replicação do NDB Cluster. Os pares nome-valor que ela contém são descritos na tabela a seguir.

<table summary="Pares de nome e valor encontrados na coluna Status da linha binlog do resultado da instrução SHOW ENGINE NDB STATUS."><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Nome</th> <th>Valor</th> </tr></thead><tbody><tr> <td><code class="literal">latest_epoch</code></td> <td>A epoca mais recente executada neste servidor MySQL (ou seja, o número de sequência da transação mais recente executada no servidor)</td> </tr><tr> <td><code class="literal">latest_trans_epoch</code></td> <td>A epoca mais recente processada pelos nós de dados do clúster</td> </tr><tr> <td><code class="literal">latest_received_binlog_epoch</code></td> <td>A epoca mais recente recebida pelo thread do log binário</td> </tr><tr> <td><code class="literal">latest_handled_binlog_epoch</code></td> <td>A epoca mais recente processada pelo thread do log binário (para escrita no log binário)</td> </tr><tr> <td><code class="literal">latest_applied_binlog_epoch</code></td> <td>A epoca mais recente efetivamente escrita no log binário</td> </tr></tbody></table>

Consulte a Seção 25.7, “Replicação de Clúster NDB”, para obter mais informações.

As linhas restantes do resultado da instrução `SHOW ENGINE NDB STATUS` que provavelmente serão úteis para monitorar o clúster estão listadas aqui por `Nome`:

* `NdbTransaction`: O número e o tamanho dos objetos `NdbTransaction` que foram criados. Um `NdbTransaction` é criado cada vez que uma operação de esquema de tabela (como `CREATE TABLE` ou `ALTER TABLE`) é realizada em uma tabela `NDB`.

* `NdbOperation`: O número e o tamanho dos objetos `NdbOperation` que foram criados.

* `NdbIndexScanOperation`: O número e o tamanho dos objetos `NdbIndexScanOperation` que foram criados.

* `NdbIndexOperation`: O número e o tamanho dos objetos `NdbIndexOperation` que foram criados.

* `NdbRecAttr`: O número e o tamanho dos objetos `NdbRecAttr` que foram criados. Geralmente, um deles é criado a cada vez que uma instrução de manipulação de dados é executada por um nó SQL.

* `NdbBlob`: O número e o tamanho dos objetos `NdbBlob` que foram criados. Um `NdbBlob` é criado para cada nova operação que envolve uma coluna `BLOB` em uma tabela `NDB`.

* `NdbReceiver`: O número e o tamanho de qualquer objeto `NdbReceiver` que foram criados. O número na coluna `created` é o mesmo do número de nós de dados no clúster ao qual o servidor MySQL se conectou.

Observação

`SHOW ENGINE NDB STATUS` retorna um resultado vazio se nenhuma operação envolvendo tabelas `NDB` tiver sido realizada durante a sessão atual pelo cliente MySQL que está acessando o nó SQL em que essa declaração é executada.