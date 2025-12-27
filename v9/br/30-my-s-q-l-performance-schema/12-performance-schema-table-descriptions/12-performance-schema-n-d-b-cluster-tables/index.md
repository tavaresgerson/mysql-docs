### 29.12.12 Tabelas do Schema de Desempenho NDB Cluster

29.12.12.1 A tabela ndb\_sync\_pending\_objects

29.12.12.2 A tabela ndb\_sync\_excluded\_objects

29.12.12.3 A tabela ndb\_replication\_applier\_status

A tabela a seguir mostra todas as tabelas do Schema de Desempenho relacionadas ao motor de armazenamento `NDBCLUSTER`.

**Tabela 29.3 Tabelas do Schema de Desempenho NDB**

<table frame="box" rules="all" summary="Uma referência que lista todas as tabelas do Schema de Desempenho relacionadas ao NDB Cluster."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome da Tabela</th> <th>Descrição</th> </tr></thead><tbody><tr><td><a class="link" href="performance-schema-ndb-replication-applier-status-table.html" title="29.12.12.3 A tabela ndb_replication_applier_status"><code class="literal">ndb_replication_applier_status</code></a></td> <td>Informações de status do aplicador de replicação NDB para cada canal de replicação</td> </tr><tr><td><a class="link" href="performance-schema-ndb-sync-excluded-objects-table.html" title="29.12.12.2 A tabela ndb_sync_excluded_objects"><code class="literal">ndb_sync_excluded_objects</code></a></td> <td>Objetos NDB que não podem ser sincronizados</td> </tr><tr><td><a class="link" href="performance-schema-ndb-sync-pending-objects-table.html" title="29.12.12.1 A tabela ndb_sync_pending_objects"><code class="literal">ndb_sync_pending_objects</code></a></td> <td>Objetos NDB aguardando sincronização</td> </tr></tbody></table>

Observação

Essas tabelas estão presentes apenas se o MySQL tiver suporte habilitado para o motor de armazenamento `NDBCLUSTER`.

A sincronização automática no `NDB` tenta detectar e sincronizar automaticamente todos os desalinhamentos nos metadados entre o dicionário interno do NDB Cluster e o dicionário de dados do MySQL Server. Isso é feito por padrão em segundo plano em intervalos regulares, conforme determinado pela variável de sistema `ndb_metadata_check_interval`, a menos que seja desativada usando `ndb_metadata_check` ou sobrescrita definindo `ndb_metadata_sync`.

As informações sobre o estado atual da sincronização automática são exibidas por um servidor MySQL que atua como um nó SQL em um NDB Cluster nessas duas tabelas do Schema de Desempenho:

* `ndb_sync_pending_objects`: Exibe informações sobre os objetos de banco de dados `NDB` para os quais desalinhamentos foram detectados entre o dicionário `NDB` e o dicionário de dados do MySQL. Ao tentar sincronizar esses objetos, o `NDB` remove o objeto da fila de espera para sincronização e desta tabela, e tenta reconciliar o desalinhamento. Se a sincronização do objeto falhar devido a um erro temporário, ele é recuperado e adicionado de volta à fila (e a esta tabela) na próxima vez que o `NDB` realizar a detecção de desalinhamento; se as tentativas falharem devido a um erro permanente, o objeto é adicionado à tabela `ndb_sync_excluded_objects`.

* `ndb_sync_excluded_objects`: Exibe informações sobre os objetos de banco de dados `NDB` para os quais a sincronização automática falhou devido a erros permanentes resultantes de desalinhamentos que não podem ser reconciliados sem intervenção manual; esses objetos são bloqueados e não são considerados novamente para detecção de desalinhamento até que isso seja feito.

Essas tabelas são descritas com mais detalhes nas próximas duas seções.

Historicamente, as informações sobre o estado do aplicativo de replicação `NDB` estavam disponíveis apenas como um conjunto de variáveis de status do servidor, que refletiam apenas o estado do canal de replicação padrão. A tabela `ndb_replication_applier_status` fornece essas informações para cada canal de replicação ativo. Consulte a Seção 29.12.12.3, “A tabela ndb\_replication\_applier\_status”, para uma descrição detalhada dessa tabela e de suas colunas.