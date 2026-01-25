### 25.12.15 Tabelas de Resumo do Performance Schema

[25.12.15.1 Tabelas de Resumo de Eventos de Wait](performance-schema-wait-summary-tables.html)

[25.12.15.2 Tabelas de Resumo de Stage](performance-schema-stage-summary-tables.html)

[25.12.15.3 Tabelas de Resumo de Statement](performance-schema-statement-summary-tables.html)

[25.12.15.4 Tabelas de Resumo de Transaction](performance-schema-transaction-summary-tables.html)

[25.12.15.5 Tabela de Resumo de Wait de Object](performance-schema-objects-summary-global-by-type-table.html)

[25.12.15.6 Tabelas de Resumo de I/O de Arquivo](performance-schema-file-summary-tables.html)

[25.12.15.7 Tabelas de Resumo de I/O de Tabela e Wait de Lock](performance-schema-table-wait-summary-tables.html)

[25.12.15.8 Tabelas de Resumo de Socket](performance-schema-socket-summary-tables.html)

[25.12.15.9 Tabelas de Resumo de Memória](performance-schema-memory-summary-tables.html)

[25.12.15.10 Tabelas de Resumo de Variáveis de Status](performance-schema-status-variable-summary-tables.html)

Tabelas de resumo fornecem informações agregadas para eventos finalizados ao longo do tempo. As tabelas neste grupo resumem dados de eventos de diferentes maneiras.

Cada tabela de resumo possui colunas de agrupamento que determinam como agrupar os dados a serem agregados, e colunas de resumo que contêm os valores agregados. Tabelas que resumem eventos de maneiras semelhantes frequentemente têm conjuntos similares de colunas de resumo e diferem apenas nas colunas de agrupamento usadas para determinar como os eventos são agregados.

Tabelas de resumo podem ser truncadas usando [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement"). Geralmente, o efeito é redefinir as colunas de resumo para 0 ou `NULL`, e não remover linhas. Isso permite limpar os valores coletados e reiniciar a agregação. Isso pode ser útil, por exemplo, após você realizar uma alteração de configuração em tempo de execução. Exceções a este comportamento de truncamento são observadas nas seções de tabelas de resumo individuais.

#### Resumos de Eventos de Wait

**Tabela 25.3 Tabelas de Resumo de Eventos de Wait do Performance Schema**

<table frame="box" rules="all" summary="Uma referência que lista todas as tabelas de resumo de eventos de wait do Performance Schema."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome da Tabela</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>events_waits_summary_by_account_by_event_name</code></td> <td>Eventos de Wait por account e event name</td> </tr><tr><td><code>events_waits_summary_by_host_by_event_name</code></td> <td>Eventos de Wait por host name e event name</td> </tr><tr><td><code>events_waits_summary_by_instance</code></td> <td>Eventos de Wait por instance</td> </tr><tr><td><code>events_waits_summary_by_thread_by_event_name</code></td> <td>Eventos de Wait por thread e event name</td> </tr><tr><td><code>events_waits_summary_by_user_by_event_name</code></td> <td>Eventos de Wait por user name e event name</td> </tr><tr><td><code>events_waits_summary_global_by_event_name</code></td> <td>Eventos de Wait por event name</td> </tr> </tbody></table>

#### Resumos de Stage

**Tabela 25.4 Tabelas de Resumo de Eventos de Stage do Performance Schema**

<table frame="box" rules="all" summary="Uma referência que lista todas as tabelas de resumo de eventos de stage do Performance Schema."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome da Tabela</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>events_stages_summary_by_account_by_event_name</code></td> <td>Eventos de Stage por account e event name</td> </tr><tr><td><code>events_stages_summary_by_host_by_event_name</code></td> <td>Eventos de Stage por host name e event name</td> </tr><tr><td><code>events_stages_summary_by_thread_by_event_name</code></td> <td>Waits de Stage por thread e event name</td> </tr><tr><td><code>events_stages_summary_by_user_by_event_name</code></td> <td>Eventos de Stage por user name e event name</td> </tr><tr><td><code>events_stages_summary_global_by_event_name</code></td> <td>Waits de Stage por event name</td> </tr> </tbody></table>

#### Resumos de Statement

**Tabela 25.5 Tabelas de Resumo de Eventos de Statement do Performance Schema**

<table frame="box" rules="all" summary="Uma referência que lista todas as tabelas de resumo de eventos de statement do Performance Schema."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome da Tabela</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>events_statements_summary_by_account_by_event_name</code></td> <td>Eventos de Statement por account e event name</td> </tr><tr><td><code>events_statements_summary_by_digest</code></td> <td>Eventos de Statement por schema e valor de digest</td> </tr><tr><td><code>events_statements_summary_by_host_by_event_name</code></td> <td>Eventos de Statement por host name e event name</td> </tr><tr><td><code>events_statements_summary_by_program</code></td> <td>Eventos de Statement por stored program</td> </tr><tr><td><code>events_statements_summary_by_thread_by_event_name</code></td> <td>Eventos de Statement por thread e event name</td> </tr><tr><td><code>events_statements_summary_by_user_by_event_name</code></td> <td>Eventos de Statement por user name e event name</td> </tr><tr><td><code>events_statements_summary_global_by_event_name</code></td> <td>Eventos de Statement por event name</td> </tr><tr><td><code>prepared_statements_instances</code></td> <td>Instâncias e estatísticas de prepared statement</td> </tr> </tbody></table>

#### Resumos de Transaction

**Tabela 25.6 Tabelas de Resumo de Eventos de Transaction do Performance Schema**

<table frame="box" rules="all" summary="Uma referência que lista todas as tabelas de resumo de eventos de transaction do Performance Schema."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome da Tabela</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>events_transactions_summary_by_account_by_event_name</code></td> <td>Eventos de Transaction por account e event name</td> </tr><tr><td><code>events_transactions_summary_by_host_by_event_name</code></td> <td>Eventos de Transaction por host name e event name</td> </tr><tr><td><code>events_transactions_summary_by_thread_by_event_name</code></td> <td>Eventos de Transaction por thread e event name</td> </tr><tr><td><code>events_transactions_summary_by_user_by_event_name</code></td> <td>Eventos de Transaction por user name e event name</td> </tr><tr><td><code>events_transactions_summary_global_by_event_name</code></td> <td>Eventos de Transaction por event name</td> </tr> </tbody></table>

#### Resumos de Wait de Object

**Tabela 25.7 Tabelas de Resumo de Eventos de Object do Performance Schema**

<table frame="box" rules="all" summary="Uma referência que lista todas as tabelas de resumo de eventos de object do Performance Schema."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome da Tabela</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>objects_summary_global_by_type</code></td> <td>Resumos de Object</td> </tr> </tbody></table>

#### Resumos de I/O de Arquivo

**Tabela 25.8 Tabelas de Resumo de Eventos de I/O de Arquivo do Performance Schema**

<table frame="box" rules="all" summary="Uma referência que lista todas as tabelas de resumo de eventos de I/O de Arquivo do Performance Schema."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome da Tabela</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>file_summary_by_event_name</code></td> <td>Eventos de Arquivo por event name</td> </tr><tr><td><code>file_summary_by_instance</code></td> <td>Eventos de Arquivo por file instance</td> </tr> </tbody></table>

#### Resumos de I/O de Tabela e Wait de Lock

**Tabela 25.9 Tabelas de Resumo de Eventos de I/O de Tabela e Wait de Lock do Performance Schema**

<table frame="box" rules="all" summary="Uma referência que lista todas as tabelas de resumo de eventos de I/O de tabela e lock do Performance Schema."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome da Tabela</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>table_io_waits_summary_by_index_usage</code></td> <td>Waits de I/O de Tabela por Index</td> </tr><tr><td><code>table_io_waits_summary_by_table</code></td> <td>Waits de I/O de Tabela por table</td> </tr><tr><td><code>table_lock_waits_summary_by_table</code></td> <td>Waits de Lock de Tabela por table</td> </tr> </tbody></table>

#### Resumos de Socket

**Tabela 25.10 Tabelas de Resumo de Eventos de Socket do Performance Schema**

<table frame="box" rules="all" summary="Uma referência que lista todas as tabelas de resumo de eventos de socket do Performance Schema."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome da Tabela</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>socket_summary_by_event_name</code></td> <td>Waits de Socket e I/O por event name</td> </tr><tr><td><code>socket_summary_by_instance</code></td> <td>Waits de Socket e I/O por instance</td> </tr> </tbody></table>

#### Resumos de Memória

**Tabela 25.11 Tabelas de Resumo de Operações de Memória do Performance Schema**

<table frame="box" rules="all" summary="Uma referência que lista todas as tabelas de resumo de operações de memória do Performance Schema."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome da Tabela</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>memory_summary_by_account_by_event_name</code></td> <td>Operações de Memória por account e event name</td> </tr><tr><td><code>memory_summary_by_host_by_event_name</code></td> <td>Operações de Memória por host e event name</td> </tr><tr><td><code>memory_summary_by_thread_by_event_name</code></td> <td>Operações de Memória por thread e event name</td> </tr><tr><td><code>memory_summary_by_user_by_event_name</code></td> <td>Operações de Memória por user e event name</td> </tr><tr><td><code>memory_summary_global_by_event_name</code></td> <td>Operações de Memória globalmente por event name</td> </tr> </tbody></table>

#### Resumos de Variáveis de Status

**Tabela 25.12 Tabelas de Resumo de Variáveis de Status de Erro do Performance Schema**

<table frame="box" rules="all" summary="Uma referência que lista todas as tabelas de resumo de variáveis de status do Performance Schema."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome da Tabela</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>status_by_account</code></td> <td>Variáveis de status de Session por account</td> </tr><tr><td><code>status_by_host</code></td> <td>Variáveis de status de Session por host name</td> </tr><tr><td><code>status_by_user</code></td> <td>Variáveis de status de Session por user name</td> </tr> </tbody></table>
