### 29.12.12 Tabela de esquema de desempenho NDB Cluster

29.12.12.1 A tabela ndb\_sync\_pending\_objects

29.12.12.2 A tabela ndb\_sync\_excluded\_objects

A tabela a seguir mostra todas as tabelas do Schema de Desempenho relacionadas ao mecanismo de armazenamento `NDBCLUSTER`.

**Tabela 29.3 Tabelas do Schema de Desempenho NDB**

<table summary="Uma referência que lista todas as tabelas do Schema de Desempenho relacionadas ao NDB Cluster."><thead><tr><th>Nome da tabela</th> <th>Descrição</th> <th>Introduzido</th> </tr></thead><tbody><tr><th>[[<code>ndb_sync_excluded_objects</code>]]</th> <td>Objetos do NDB que não podem ser sincronizados</td> <td>8.0.21</td> </tr><tr><th>[[<code>ndb_sync_pending_objects</code>]]</th> <td>Objetos do NDB aguardando sincronização</td> <td>8.0.21</td> </tr></tbody></table>

A partir do NDB 8.0.16, a sincronização automática em `NDB` tenta detectar e sincronizar automaticamente todos os desalinhamentos nos metadados entre o dicionário interno do NDB Cluster e a datadictionary do MySQL Server. Isso é feito por padrão em segundo plano em intervalos regulares, conforme determinado pela variável de sistema `ndb_metadata_check_interval`, a menos que seja desativado usando `ndb_metadata_check` ou sobrescrito definindo `ndb_metadata_sync`. Antes do NDB 8.0.21, a única informação acessível aos usuários sobre esse processo estava na forma de mensagens de registro e contagens de objetos disponíveis (a partir do NDB 8.0.18) como as variáveis de status `Ndb_metadata_detected_count`, `Ndb_metadata_synced_count` e `Ndb_metadata_excluded_count` (antes do NDB 8.0.22, essa variável era chamada de `Ndb_metadata_blacklist_size`). A partir do NDB 8.0.21, informações mais detalhadas sobre o estado atual da sincronização automática são exibidas por um servidor MySQL que atua como um nó SQL em um NDB Cluster nessas duas tabelas do Schema de Desempenho:

- `ndb_sync_pending_objects`: Exibe informações sobre os objetos de banco de dados `NDB` para os quais foram detectados desvios entre o dicionário `NDB` e o dicionário de dados MySQL. Ao tentar sincronizar esses objetos, `NDB` remove o objeto da fila de espera para sincronização e desta tabela, e tenta conciliar o desvio. Se a sincronização do objeto falhar devido a um erro temporário, ele é recuperado e adicionado novamente à fila (e a esta tabela) na próxima vez que `NDB` realizar a detecção de desvios; se as tentativas falharem devido a um erro permanente, o objeto é adicionado à tabela `ndb_sync_excluded_objects`.

- `ndb_sync_excluded_objects`: Exibe informações sobre os objetos de banco de dados `NDB` para os quais a sincronização automática falhou devido a erros permanentes resultantes de desalinhamentos que não podem ser reconciliados sem intervenção manual; esses objetos estão bloqueados e não são considerados novamente para detecção de desalinhamento até que isso seja feito.

As tabelas `ndb_sync_pending_objects` e `ndb_sync_excluded_objects` estão presentes apenas se o MySQL tiver suporte habilitado para o mecanismo de armazenamento `NDBCLUSTER`.

Essas tabelas são descritas com mais detalhes nas duas seções a seguir.
