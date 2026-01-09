#### 13.7.5.15 Declaração do motor de exibição

```sql
SHOW ENGINE engine_name {STATUS | MUTEX}
```

`SHOW ENGINE` exibe informações operacionais sobre um motor de armazenamento. Requer o privilégio `PROCESS`. A declaração tem essas variantes:

```sql
SHOW ENGINE INNODB STATUS
SHOW ENGINE INNODB MUTEX
SHOW ENGINE PERFORMANCE_SCHEMA STATUS
```

`SHOW ENGINE INNODB STATUS` exibe informações extensas do monitor padrão `InnoDB` sobre o estado do motor de armazenamento `InnoDB`. Para informações sobre o monitor padrão e outros monitores `InnoDB` que fornecem informações sobre o processamento do `InnoDB`, consulte Seção 14.18, “Monitores InnoDB”.

`SHOW ENGINE INNODB MUTEX` exibe estatísticas do mutex e do rw-lock do InnoDB.

Nota

Os mutexes e rwlocks do `InnoDB` também podem ser monitorados usando as tabelas do Schema de Desempenho. Veja Seção 14.17.2, “Monitoramento das Esperas de Mutex do InnoDB Usando o Schema de Desempenho”.

A saída `SHOW ENGINE INNODB MUTEX` foi removida no MySQL 5.7.2. Ela foi revisada e reintroduzida no MySQL 5.7.8.

No MySQL 5.7.8, a coleta de estatísticas de mutex é configurada dinamicamente usando as seguintes opções:

- Para habilitar a coleta de estatísticas de mutex, execute:

  ```sql
  SET GLOBAL innodb_monitor_enable='latch';
  ```

- Para redefinir as estatísticas do mutex, execute:

  ```sql
  SET GLOBAL innodb_monitor_reset='latch';
  ```

- Para desativar a coleta de estatísticas de mutex, execute:

  ```sql
  SET GLOBAL innodb_monitor_disable='latch';
  ```

A coleta de estatísticas de mutex para `SHOW ENGINE INNODB MUTEX` também pode ser habilitada definindo `innodb_monitor_enable='all'`, ou desabilitada definindo `innodb_monitor_disable='all'`.

A saída `SHOW ENGINE INNODB MUTEX` tem essas colunas:

- `Tipo`

  Sempre `InnoDB`.

- `Nome`

  Antes do MySQL 5.7.8, o campo `Name` informa o arquivo de origem onde o mutex é implementado e o número da linha no arquivo onde o mutex é criado. O número da linha é específico para a sua versão do MySQL. A partir do MySQL 5.7.8, apenas o nome do mutex é informado. O nome do arquivo e o número da linha ainda são informados para rwlocks.

- `Status`

  O status do mutex.

  Antes do MySQL 5.7.8, o campo `Status` exibe vários valores se `WITH_DEBUG` foi definido no momento da compilação do MySQL. Se `WITH_DEBUG` não foi definido, a declaração exibe apenas o valor `os_waits`. No último caso (sem `WITH_DEBUG`), as informações sobre as quais o resultado é baseado são insuficientes para distinguir entre mútuos regulares e mútuos que protegem rwlocks (que permitem múltiplos leitores ou um único escritor). Consequentemente, o resultado pode parecer conter várias linhas para o mesmo mútuo. Os valores do campo `Status` antes do MySQL 5.7.8 incluem:

  - `count` indica quantas vezes o mutex foi solicitado.

  - `spin_waits` indica quantas vezes o spinlock teve que ser executado.

  - `spin_rounds` indica o número de rodadas de spinlock. (`spin_rounds` dividido por `spin_waits` fornece o número médio de rodadas.)

  - `os_waits` indica o número de espera do sistema operacional. Isso ocorre quando o spinlock não funcionou (o mutex não foi bloqueado durante o spinlock e foi necessário ceder ao sistema operacional e esperar).

  - `os_yields` indica quantas vezes uma thread que tenta bloquear um mutex desistiu de seu tempo de uso e cedeu ao sistema operacional (com a suposição de que permitir que outras threads corram libera o mutex para que ele possa ser bloqueado).

  - `os_wait_times` indica o tempo gasto (em ms) em espera do sistema operacional. No MySQL 5.7, o temporizador está desativado e esse valor é sempre 0.

  A partir do MySQL 5.7.8, o campo `Status` informa o número de rodadas, espera e chamadas. As estatísticas para mutexes do sistema operacional de baixo nível, que são implementados fora do `InnoDB`, não são relatadas.

  - `rodações` indica o número de rodadas.

  - `waits` indica o número de espera por mutex.

  - `chamadas` indica quantas vezes o mutex foi solicitado.

`SHOW ENGINE INNODB MUTEX` não lista mutexes e bloqueios de leitura/escrita (rw-locks) para cada bloco do pool de buffers, pois a quantidade de saída seria esmagadora em sistemas com um grande pool de buffers. `SHOW ENGINE INNODB MUTEX`, no entanto, imprime os valores agregados de `BUF_BLOCK_MUTEX` de spin, espera e chamada para mutexes e bloqueios de leitura/escrita (rw-locks) de blocos do pool de buffers. `SHOW ENGINE INNODB MUTEX` também não lista quaisquer mutexes ou bloqueios de leitura/escrita (rw-locks) que nunca tenham sido solicitados (`os_waits=0`). Assim, `SHOW ENGINE INNODB MUTEX` exibe apenas informações sobre mutexes e bloqueios de leitura/escrita (rw-locks) fora do pool de buffers que causaram pelo menos uma espera no nível do sistema operacional wait.

Use `SHOW ENGINE PERFORMANCE_SCHEMA STATUS` para inspecionar o funcionamento interno do código do Schema de Desempenho:

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

Esta declaração visa ajudar o DBA a entender os efeitos que as diferentes opções do Schema de Desempenho têm nos requisitos de memória.

Os valores de `Nome` consistem em duas partes, que nomeiam um buffer interno e um atributo de buffer, respectivamente. Interprete os nomes dos buffers da seguinte forma:

- Um buffer interno que não é exibido como uma tabela é nomeado entre parênteses. Exemplos: `(pfs_cond_class).size`, `(pfs_mutex_class).memory`.

- Um buffer interno que é exibido como uma tabela no banco de dados `performance_schema` é nomeado com o nome da tabela, sem parênteses. Exemplos: `events_waits_history.size`, `mutex_instances.count`.

- Um valor que se aplica ao Schema de Desempenho como um todo começa com `performance_schema`. Exemplo: `performance_schema.memory`.

Os atributos de buffer têm esses significados:

- `size` é o tamanho do registro interno usado pela implementação, como o tamanho de uma linha em uma tabela. Os valores de `size` não podem ser alterados.

- `count` é o número de registros internos, como o número de linhas em uma tabela. Os valores de `count` podem ser alterados usando as opções de configuração do Gerenciamento de Desempenho.

- Para uma tabela, `tbl_name.memory` é o produto de `size` e `count`. Para o Schema de Desempenho como um todo, `performance_schema.memory` é a soma de toda a memória usada (a soma de todos os outros valores de `memory`).

Em alguns casos, há uma relação direta entre um parâmetro de configuração do Schema de Desempenho e um valor de `SHOW ENGINE`. Por exemplo, `events_waits_history_long.count` corresponde a `performance_schema_events_waits_history_long_size`. Em outros casos, a relação é mais complexa. Por exemplo, `events_waits_history.count` corresponde a `performance_schema_events_waits_history_size` (o número de linhas por thread) multiplicado por `performance_schema_max_thread_instances` (o número de threads).

**Mostre o status do motor NDB.** Se o servidor tiver o motor de armazenamento `NDB` habilitado, o comando `SHOW ENGINE NDB STATUS` exibe informações de status do cluster, como o número de nós de dados conectados, a string de conexão do cluster e as épocas do log binário do cluster, além de contagem de vários objetos da API do Cluster criados pelo MySQL Server quando conectado ao cluster. A saída de exemplo deste comando é mostrada aqui:

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

A coluna `Status` em cada uma dessas linhas fornece informações sobre a conexão do servidor MySQL com o clúster e sobre o status do log binário do clúster, respectivamente. As informações de `Status` estão no formato de conjunto de pares nome/valor separados por vírgula.

A coluna `Status` da linha `connection` contém os pares nome/valor descritos na tabela a seguir.

<table summary="Pares de nome e valor encontrados na coluna Status da linha de conexão no resultado da instrução SHOW ENGINE NDB STATUS."><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Nome</th> <th>Valor</th> </tr></thead><tbody><tr> <td>[[<code>cluster_node_id</code>]]</td> <td>O ID do nó do servidor MySQL no cluster</td> </tr><tr> <td>[[<code>connected_host</code>]]</td> <td>O nome do host ou o endereço IP do servidor de gerenciamento de clúster ao qual o servidor MySQL está conectado</td> </tr><tr> <td>[[<code>connected_port</code>]]</td> <td>O porto usado pelo servidor MySQL para se conectar ao servidor de gerenciamento ([[<code>connected_host</code>]])</td> </tr><tr> <td>[[<code>number_of_data_nodes</code>]]</td> <td>O número de nós de dados configurados para o clúster (ou seja, o número de seções [[<code>[ndb<code>config.ini</code></code>]] no arquivo do clúster [[<code>config.ini</code>]])</td> </tr><tr> <td>[[<code>number_of_ready_data_nodes</code>]]</td> <td>O número de nós de dados no clúster que estão realmente em execução</td> </tr><tr> <td>[[<code>connect_count</code>]]</td> <td>O número de vezes que isso aconteceu<span><strong>mysqld</strong></span>conectou ou reconectou-se aos nós de dados do cluster</td> </tr></tbody></table>

A coluna `Status` da linha `binlog` contém informações relacionadas à Replicação em NDB Cluster. Os pares nome/valor que ela contém são descritos na tabela a seguir.

<table summary="Pares de nome e valor encontrados na coluna Status da linha binlog no resultado da instrução SHOW ENGINE NDB STATUS."><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Nome</th> <th>Valor</th> </tr></thead><tbody><tr> <td>[[<code>latest_epoch</code>]]</td> <td>A época mais recente que mais recentemente foi executada neste servidor MySQL (ou seja, o número de sequência da transação mais recente executada no servidor)</td> </tr><tr> <td>[[<code>latest_trans_epoch</code>]]</td> <td>A era mais recente processada pelos nós de dados do clúster</td> </tr><tr> <td>[[<code>latest_received_binlog_epoch</code>]]</td> <td>A época mais recente recebida pelo fio de log binário</td> </tr><tr> <td>[[<code>latest_handled_binlog_epoch</code>]]</td> <td>A época mais recente processada pelo fio de log binário (para gravação no log binário)</td> </tr><tr> <td>[[<code>latest_applied_binlog_epoch</code>]]</td> <td>A época mais recente realmente escrita no log binário</td> </tr></tbody></table>

Consulte Seção 21.7, “Replicação de aglomerado NDB” para obter mais informações.

As linhas restantes da saída do comando `SHOW ENGINE NDB STATUS` que provavelmente serão úteis para monitorar o clúster estão listadas aqui por `Nome`:

- `NdbTransaction`: O número e o tamanho dos objetos `NdbTransaction` que foram criados. Um `NdbTransaction` é criado sempre que uma operação de esquema de tabela (como `CREATE TABLE` ou `ALTER TABLE`) é realizada em uma tabela `NDB` (mysql-cluster.html).

- `NdbOperation`: O número e o tamanho dos objetos `NdbOperation` que foram criados.

- `NdbIndexScanOperation`: O número e o tamanho dos objetos `NdbIndexScanOperation` que foram criados.

- `NdbIndexOperation`: O número e o tamanho dos objetos `NdbIndexOperation` que foram criados.

- `NdbRecAttr`: O número e o tamanho dos objetos `NdbRecAttr` que foram criados. Geralmente, um deles é criado a cada vez que uma instrução de manipulação de dados é executada por um nó SQL.

- `NdbBlob`: O número e o tamanho dos objetos `NdbBlob` que foram criados. Um `NdbBlob` é criado para cada nova operação que envolve uma coluna `BLOB` em uma tabela `NDB`.

- `NdbReceiver`: O número e o tamanho de qualquer objeto `NdbReceiver` que tenha sido criado. O número na coluna `created` é o mesmo do número de nós de dados no clúster ao qual o servidor MySQL se conectou.

Nota

`SHOW ENGINE NDB STATUS` retorna um resultado vazio se nenhuma operação envolvendo as tabelas `NDB` tiver sido realizada durante a sessão atual pelo cliente MySQL que está acessando o nó SQL em que essa declaração é executada.
