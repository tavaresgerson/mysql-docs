### 29.12.20 Tabelas Resumo de Schema de Desempenho

29.12.20.1 Tabelas Resumo de Eventos de Aguardar

29.12.20.2 Tabelas Resumo de Etapas

29.12.20.3 Tabelas Resumo de Declarações

29.12.20.4 Tabelas Resumo de Histogramas de Declarações

29.12.20.5 Tabelas Resumo de Transações

29.12.20.6 Tabela Resumo de Objetos de Aguardar

29.12.20.7 Tabelas Resumo de I/O de Arquivos

29.12.20.8 Tabelas Resumo de I/O e Aguarda de Bloqueio

29.12.20.9 Tabelas Resumo de Soquetes

29.12.20.10 Tabelas Resumo de Memória

29.12.20.11 Tabelas Resumo de Erros

29.12.20.12 Tabelas Resumo de Variáveis de Status

As tabelas de resumo fornecem informações agregadas para eventos terminados ao longo do tempo. As tabelas deste grupo resumem os dados dos eventos de maneiras diferentes.

Cada tabela de resumo tem colunas de agrupamento que determinam como os dados serão agrupados para serem agregados, e colunas de resumo que contêm os valores agregados. Tabelas que resumem eventos de maneiras semelhantes geralmente têm conjuntos semelhantes de colunas de resumo e diferem apenas nas colunas de agrupamento usadas para determinar como os eventos são agregados.

As tabelas de resumo podem ser truncadas com `TRUNCATE TABLE`. Geralmente, o efeito é resetear as colunas de resumo para 0 ou `NULL`, e não remover linhas. Isso permite que você limpe os valores coletados e reinicie a agregação. Isso pode ser útil, por exemplo, após você ter feito uma mudança na configuração de tempo de execução. Exceções a esse comportamento de truncação são observadas nas seções individuais das tabelas de resumo.

#### Resumos de Eventos de Aguardar

**Tabela 29.5 Tabelas Resumo de Eventos de Aguardar do Schema de Desempenho**

<table frame="box" rules="all" summary="Uma referência que lista todas as tabelas de resumo de eventos de espera do Schema de Desempenho."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome da Tabela</th> <th>Descrição</th> </tr></thead><tbody><tr><td><a class="link" href="performance-schema-wait-summary-tables.html" title="Tabelas de Resumo de Eventos de Espera 29.12.20.1">events_waits_summary_by_account_by_event_name</a></td> <td>Eventos de espera por conta e nome de evento</td> </tr><tr><td><a class="link" href="performance-schema-wait-summary-tables.html" title="Tabelas de Resumo de Eventos de Espera 29.12.20.1">events_waits_summary_by_host_by_event_name</a></td> <td>Eventos de espera por nome de host e nome de evento</td> </tr><tr><td><a class="link" href="performance-schema-wait-summary-tables.html" title="Tabelas de Resumo de Eventos de Espera 29.12.20.1">events_waits_summary_by_instance</a></td> <td>Eventos de espera por instância</td> </tr><tr><td><a class="link" href="performance-schema-wait-summary-tables.html" title="Tabelas de Resumo de Eventos de Espera 29.12.20.1">events_waits_summary_by_thread_by_event_name</a></td> <td>Eventos de espera por thread e nome de evento</td> </tr><tr><td><a class="link" href="performance-schema-wait-summary-tables.html" title="Tabelas de Resumo de Eventos de Espera 29.12.20.1">events_waits_summary_by_user_by_event_name</a></td> <td>Eventos de espera por nome de usuário e nome de evento</td> </tr><tr><td><a class="link" href="performance-schema-wait-summary-tables.html" title="Tabelas de Resumo de Eventos de Espera 29.12.20.1">events_waits_summary_global_by_event_name</a></td> <td>Eventos de espera por nome de evento</td> </tr></tbody></table>

#### Resumos de Estágio

**Tabela 29.7 Tabelas de Resumo de Eventos de Mensagens do Schema de Desempenho**

<table frame="box" rules="all" summary="Uma referência que lista todas as tabelas de resumo de eventos de mensagens do Schema de Desempenho."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome da Tabela</th> <th>Descrição</th> </tr></thead><tbody><tr><td><a class="link" href="performance-schema-statement-summary-tables.html" title="29.12.20.2 Tabelas de Resumo de Eventos de Mensagens"><code>statements_by_account_by_event_name</code></a></td> <td>Eventos de mensagens por conta e nome de evento</td> </tr><tr><td><a class="link" href="performance-schema-statement-summary-tables.html" title="29.12.20.2 Tabelas de Resumo de Eventos de Mensagens"><code>statements_by_host_by_event_name</code></a></td> <td>Eventos de mensagens por nome de host e nome de evento</td> </tr><tr><td><a class="link" href="performance-schema-statement-summary-tables.html" title="29.12.20.2 Tabelas de Resumo de Eventos de Mensagens"><code>statements_by_thread_by_event_name</code></a></td> <td>Eventos de mensagens por thread e nome de evento</td> </tr><tr><td><a class="link" href="performance-schema-statement-summary-tables.html" title="29.12.20.2 Tabelas de Resumo de Eventos de Mensagens"><code>statements_by_user_by_event_name</code></a></td> <td>Eventos de mensagens por nome de usuário e nome de evento</td> </tr><tr><td><a class="link" href="performance-schema-statement-summary-tables.html" title="29.12.20.2 Tabelas de Resumo de Eventos de Mensagens"><code>statements_by_event_name_global</code></a></td> <td>Eventos de mensagens por nome de evento</td> </tr></tbody></table>

#### Resumos de Declarações

**Tabela 29.8 Tabelas de Resumo de Eventos de Mensagens do Schema de Declarações**

<table frame="box" rules="all" summary="Uma referência que lista todas as tabelas de resumo de eventos de declarações do Schema de Desempenho.">
<col style="width: 28%"/><col style="width: 71%"/>
<thead><tr><th>Nome da Tabela</th> <th>Descrição</th> </tr></thead><tbody><tr><td><a class="link" href="performance-schema-statement-histogram-summary-tables.html" title="Tabelas de Resumo de Histogramas de Declarações de 29.12.20.4">eventos_statements_histogram_by_digest</a></td> <td>Histogramas de declarações por esquema e valor de digest</td> </tr><tr><td><a class="link" href="performance-schema-statement-histogram-summary-tables.html" title="Tabelas de Resumo de Histogramas de Declarações de 29.12.20.4">eventos_statements_histogram_global</a></td> <td>Histogramas de declarações resumidos globalmente</td> </tr><tr><td><a class="link" href="performance-schema-statement-summary-tables.html" title="Tabelas de Resumo de Declarações de 29.12.20.3">events_statements_summary_by_account_by_event_name</a></td> <td>Eventos de declarações por conta e nome de evento</td> </tr><tr><td><a class="link" href="performance-schema-statement-summary-tables.html" title="Tabelas de Resumo de Declarações de 29.12.20.3">events_statements_summary_by_digest</a></td> <td>Eventos de declarações por esquema e valor de digest</td> </tr><tr><td><a class="link" href="performance-schema-statement-summary-tables.html" title="Tabelas de Resumo de Declarações de 29.12.20.3">events_statements_summary_by_host_by_event_name</a></td> <td>Eventos de declarações por nome de host e nome de evento</td> </tr><tr><td><a class="link" href="performance-schema-statement-summary-tables.html" title="Tabelas de Resumo de Declarações de 29.12.20.3">events_statements_summary_by_program</a></td> <td>Eventos de declarações por programa armazenado</td> </tr><tr><td><a class="link" href="performance-schema-statement-summary-tables.html" title="Tabelas de Resumo de Declarações de 29.12.20.3">events_statements_summary_by_thread_by_event_name</a></td> <td>Eventos de declarações por thread e nome de evento</td> </tr><tr><td><a class="link" href="performance-schema-statement-summary-tables.html" title="Tabelas de Resumo de Declarações de 29.12.20.3">events_statements_summary_by_user_by_event_name</a></td> <td>Eventos de declarações por nome de usuário e nome de evento</td> </tr><tr><td><a class="link" href="performance-schema-statement-summary-tables.html" title="Tabelas de Resumo de Declarações de 29.12.20.3">events_statements_summary_global_by_event_name</a></td> <td>Eventos de declarações por nome de evento</td> </tr><tr><td><a class="link" href="performance-schema-prepared-statements-instances-table.html" title="performance-schema-prepared-statements-instances Table">prepared_statements_instances</a></td> <td>Instâncias e estatísticas de declarações preparadas</td> </tr></tbody></table>

#### Resumos de Transações

**Tabela 29.8 Tabelas de Resumo de Eventos de Transações do Schema de Desempenho**

<table frame="box" rules="all" summary="Uma referência que lista todas as tabelas de resumo de eventos de transações do Schema de Desempenho."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome da Tabela</th> <th>Descrição</th> </tr></thead><tbody><tr><td><a class="link" href="performance-schema-transaction-summary-tables.html" title="Tabelas de Resumo de Transações 29.12.20.5"><code>events_transactions_summary_by_account_by_event_name</code></a></td> <td>Eventos de transações por conta e nome de evento</td> </tr><tr><td><a class="link" href="performance-schema-transaction-summary-tables.html" title="Tabelas de Resumo de Transações 29.12.20.5"><code>events_transactions_summary_by_host_by_event_name</code></a></td> <td>Eventos de transações por nome de host e nome de evento</td> </tr><tr><td><a class="link" href="performance-schema-transaction-summary-tables.html" title="Tabelas de Resumo de Transações 29.12.20.5"><code>events_transactions_summary_by_thread_by_event_name</code></a></td> <td>Eventos de transações por thread e nome de evento</td> </tr><tr><td><a class="link" href="performance-schema-transaction-summary-tables.html" title="Tabelas de Resumo de Transações 29.12.20.5"><code>events_transactions_summary_by_user_by_event_name</code></a></td> <td>Eventos de transações por nome de usuário e nome de evento</td> </tr><tr><td><a class="link" href="performance-schema-transaction-summary-tables.html" title="Tabelas de Resumo de Transações 29.12.20.5"><code>events_transactions_summary_global_by_event_name</code></a></td> <td>Eventos de transações por nome de evento</td> </tr></tbody></table>

#### Resumos de Espera de Objetos

**Tabela 29.9 Tabelas de Resumo de Eventos de Objetos do Schema de Desempenho**

<table frame="box" rules="all" summary="Uma referência que lista todas as tabelas de resumo de eventos de objetos do Schema de Desempenho.">
<col style="width: 28%"/><col style="width: 71%"/>
<thead><tr><th>Nome da Tabela</th> <th>Descrição</th> </tr></thead>
<tbody><tr><td><a class="link" href="performance-schema-objects-summary-global-by-type-table.html" title="29.12.20.6 Tabela de Resumo de Espera de Objetos Globais por Tipo"><code>objects_summary_global_by_type</code></a></td> <td>Sumários de objetos</td> </tr></tbody></table>

#### Resumos de Arquivo/E/S

**Tabela 29.10 Tabelas de Resumo de Eventos de Arquivo/S do Schema de Desempenho**

<table frame="box" rules="all" summary="Uma referência que lista todas as tabelas de resumo de eventos de arquivo/S do Schema de Desempenho.">
<col style="width: 28%"/><col style="width: 71%"/>
<thead><tr><th>Nome da Tabela</th> <th>Descrição</th> </tr></thead>
<tbody><tr><td><a class="link" href="performance-schema-file-summary-tables.html" title="29.12.20.7 Tabelas de Resumo de Arquivo/S Globais por Nome de Evento"><code>file_summary_by_event_name</code></a></td> <td>Eventos de arquivo/S por nome de evento</td> </tr>
<tr><td><a class="link" href="performance-schema-file-summary-tables.html" title="29.12.20.7 Tabelas de Resumo de Arquivo/S Globais por Instância de Arquivo"><code>file_summary_by_instance</code></a></td> <td>Eventos de arquivo/S por instância de arquivo</td> </tr></tbody></table>

#### Resumos de Tabela/E/S e Espera de Bloqueio

**Tabela 29.11 Tabelas de Resumo de Eventos de Tabela/E/S e Espera de Bloqueio do Schema de Desempenho**

<table frame="box" rules="all" summary="Uma referência que lista todas as tabelas de resumo de eventos de sockets do Schema de Desempenho.">
<col style="width: 28%"/><col style="width: 71%"/>
<thead><tr><th>Nome da Tabela</th> <th>Descrição</th> </tr></thead><tbody><tr><td><a class="link" href="performance-schema-table-wait-summary-tables.html#performance-schema-table-io-waits-summary-by-index-usage-table" title="29.12.20.8.2 A tabela_io_waits_summary_by_index_usage"><code>table_io_waits_summary_by_index_usage</code></a></td> <td>Esperas de I/O por índice</td> </tr><tr><td><a class="link" href="performance-schema-table-wait-summary-tables.html#performance-schema-table-io-waits-summary-by-table-table" title="29.12.20.8.1 A tabela_io_waits_summary_by_table"><code>table_io_waits_summary_by_table</code></a></td> <td>Esperas de I/O por tabela</td> </tr><tr><td><a class="link" href="performance-schema-table-wait-summary-tables.html#performance-schema-table-lock-waits-summary-by-table-table" title="29.12.20.8.3 A tabela_lock_waits_summary_by_table"><code>table_lock_waits_summary_by_table</code></a></td> <td>Esperas de bloqueio por tabela</td> </tr></tbody></table>

#### Resumos de Sockets

**Tabelas de Resumo de Eventos de Sockets do Schema de Desempenho 29.12**


<table frame="box" rules="all" summary="Uma referência que lista todas as tabelas de resumo de eventos de soquete do Schema de Desempenho."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome da Tabela</th> <th>Descrição</th> </tr></thead><tbody><tr><td><a class="link" href="performance-schema-socket-summary-tables.html" title="Tabelas de Resumo de Eventos de Soquete 29.12.20.9"><code>socket_summary_by_event_name</code></a></td> <td>Espera de soquete e I/O por nome de evento</td> </tr><tr><td><a class="link" href="performance-schema-socket-summary-tables.html" title="Tabelas de Resumo de Eventos de Soquete 29.12.20.9"><code>socket_summary_by_instance</code></a></td> <td>Espera de soquete e I/O por instância</td> </tr></tbody></table>

#### Resumos de Memória

**Tabelas de Resumo de Operações de Memória do Schema de Desempenho 29.13**

<table frame="box" rules="all" summary="Uma referência que lista todas as tabelas de resumo das operações de memória do Schema de Desempenho.">
<col style="width: 28%"/><col style="width: 71%"/>
<thead><tr><th>Nome da Tabela</th> <th>Descrição</th> </tr></thead><tbody><tr><td><a class="link" href="performance-schema-error-summary-tables.html" title="Tabelas de Resumo de Erros do Schema de Desempenho 29.14"><code>summary_of_errors_by_account_by_event_name</code></a></td> <td>Operações de memória por conta e nome de evento</td> </tr><tr><td><a class="link" href="performance-schema-error-summary-tables.html" title="Tabelas de Resumo de Erros do Schema de Desempenho 29.14"><code>summary_of_errors_by_host_by_event_name</code></a></td> <td>Operações de memória por host e nome de evento</td> </tr><tr><td><a class="link" href="performance-schema-error-summary-tables.html" title="Tabelas de Resumo de Erros do Schema de Desempenho 29.14"><code>summary_of_errors_by_thread_by_event_name</code></a></td> <td>Operações de memória por thread e nome de evento</td> </tr><tr><td><a class="link" href="performance-schema-error-summary-tables.html" title="Tabelas de Resumo de Erros do Schema de Desempenho 29.14"><code>summary_of_errors_by_user_by_event_name</code></a></td> <td>Operações de memória por usuário e nome de evento</td> </tr><tr><td><a class="link" href="performance-schema-error-summary-tables.html" title="Tabelas de Resumo de Erros do Schema de Desempenho 29.14"><code>summary_of_errors_global_by_event_name</code></a></td> <td>Operações de memória globalmente por nome de evento</td> </tr></tbody></table>

#### Resumos de Erros

**Tabelas de Resumo de Erros do Schema de Desempenho 29.14**

<table frame="box" rules="all" summary="Uma referência que lista todas as tabelas de resumo de variáveis de status de erro do Schema de Desempenho.">
<col style="width: 28%"/><col style="width: 71%"/>
<thead><tr><th>Nome da Tabela</th> <th>Descrição</th> </tr></thead><tbody><tr><td><a class="link" href="performance-schema-error-status-variable-summary-tables.html" title="Tabelas de Resumo de Variáveis de Status de Erro do Schema de Desempenho 29.15.02.11"><code>events_status_errors_summary_by_account_by_error</code></a></td> <td>Erros por conta e código de erro</td> </tr><tr><td><a class="link" href="performance-schema-error-status-variable-summary-tables.html" title="Tabelas de Resumo de Variáveis de Status de Erro do Schema de Desempenho 29.15.02.11"><code>events_status_errors_summary_by_host_by_error</code></a></td> <td>Erros por host e código de erro</td> </tr><tr><td><a class="link" href="performance-schema-error-status-variable-summary-tables.html" title="Tabelas de Resumo de Variáveis de Status de Erro do Schema de Desempenho 29.15.02.11"><code>events_status_errors_summary_by_thread_by_error</code></a></td> <td>Erros por thread e código de erro</td> </tr><tr><td><a class="link" href="performance-schema-error-status-variable-summary-tables.html" title="Tabelas de Resumo de Variáveis de Status de Erro do Schema de Desempenho 29.15.02.11"><code>events_status_errors_summary_by_user_by_error</code></a></td> <td>Erros por usuário e código de erro</td> </tr><tr><td><a class="link" href="performance-schema-error-status-variable-summary-tables.html" title="Tabelas de Resumo de Variáveis de Status de Erro do Schema de Desempenho 29.15.02.11"><code>events_status_errors_summary_global_by_error</code></a></td> <td>Erros por código de erro</td> </tr></tbody></table>

<table frame="box" rules="all" summary="Uma referência que lista todas as tabelas de resumo de eventos de estágio do Schema de Desempenho."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome da Tabela</th> <th>Descrição</th> </tr></thead><tbody><tr><td><a class="link" href="performance-schema-stage-summary-tables.html" title="Tabelas de Resumo de Eventos de Estágio 29.12.20.2" target="_blank"><code>events_stages_summary_by_account_by_event_name</code></a></td> <td>Eventos de estágio por conta e nome de evento</td> </tr><tr><td><a class="link" href="performance-schema-stage-summary-tables.html" title="Tabelas de Resumo de Eventos de Estágio 29.12.20.2" target="_blank"><code>events_stages_summary_by_host_by_event_name</code></a></td> <td>Eventos de estágio por nome de host e nome de evento</td> </tr><tr><td><a class="link" href="performance-schema-stage-summary-tables.html" title="Tabelas de Resumo de Eventos de Estágio 29.12.20.2" target="_blank"><code>events_stages_summary_by_thread_by_event_name</code></a></td> <td>Espera de estágio por thread e nome de evento</td> </tr><tr><td><a class="link" href="performance-schema-stage-summary-tables.html" title="Tabelas de Resumo de Eventos de Estágio 29.12.20.2" target="_blank"><code>events_stages_summary_by_user_by_event_name</code></a></td> <td>Eventos de estágio por nome de usuário e nome de evento</td> </tr><tr><td><a class="link" href="performance-schema-stage-summary-tables.html" title="Tabelas de Resumo de Eventos de Estágio 29.12.20.2" target="_blank"><code>events_stages_summary_global_by_event_name</code></a></td> <td>Espera de estágio por nome de evento</td> </tr></tbody></table>