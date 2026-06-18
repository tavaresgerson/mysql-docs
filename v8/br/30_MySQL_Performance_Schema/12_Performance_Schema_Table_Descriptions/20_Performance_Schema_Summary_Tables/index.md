### 29.12.20 Tabelas de Resumo do Schema de Desempenho

29.12.20.1 Resumo de tabelas de eventos de espera

29.12.20.2 Tabelas de Resumo das Fases

29.12.20.3 Tabelas de Resumo das Declarações

29.12.20.4 Declaração Histograma Tabelas de Resumo

29.12.20.5 Tabelas de Resumo de Transações

29.12.20.6 Tabela de Resumo da Observação do Objeto

Tabelas de Resumo de E/S de Arquivos 29.12.20.7

29.12.20.8 Tabelas de Resumo de Atendimento de Entrada/Saída e Bloqueio

Tabelas de resumo de soquetes 29.12.20.9

29.12.20.10 Tabelas de Resumo de Memória

Tabelas de Resumo de Erros 29.12.20.11

29.12.20.12 Tabelas de Resumo de Estatísticas de Status Variável

As tabelas de resumo fornecem informações agregadas para eventos encerrados ao longo do tempo. As tabelas deste grupo resumem os dados dos eventos de diferentes maneiras.

Cada tabela de resumo tem colunas de agrupamento que determinam como os dados serão agrupados para serem agregados, e colunas de resumo que contêm os valores agregados. Tabelas que resumem eventos de maneiras semelhantes geralmente têm conjuntos semelhantes de colunas de resumo e diferem apenas nas colunas de agrupamento usadas para determinar como os eventos são agregados.

As tabelas de resumo podem ser truncadas com `TRUNCATE TABLE`. Geralmente, o efeito é redefinir as colunas de resumo para 0 ou `NULL`, e não remover linhas. Isso permite que você limpe os valores coletados e reinicie a agregação. Isso pode ser útil, por exemplo, após você ter feito uma alteração na configuração de execução. Exceções a esse comportamento de truncação são mencionadas nas seções individuais das tabelas de resumo.

#### Esperar Resumos de Eventos

**Tabela 29.7 Tabelas de Resumo de Eventos de Aguarda do Schema de Desempenho**

<table summary="Uma referência que lista todas as tabelas de resumo dos eventos de espera do Schema de Desempenho."><thead><tr><th>Nome da tabela</th> <th>Descrição</th> </tr></thead><tbody><tr><td>[[<code>events_waits_summary_by_account_by_event_name</code>]]</td> <td>Eventos esperados por conta e nome do evento</td> </tr><tr><td>[[<code>events_waits_summary_by_host_by_event_name</code>]]</td> <td>Eventos esperados por nome de host e nome de evento</td> </tr><tr><td>[[<code>events_waits_summary_by_instance</code>]]</td> <td>Eventos de espera por instância</td> </tr><tr><td>[[<code>events_waits_summary_by_thread_by_event_name</code>]]</td> <td>Eventos esperados por fio e nome do evento</td> </tr><tr><td>[[<code>events_waits_summary_by_user_by_event_name</code>]]</td> <td>Eventos esperados por nome de usuário e nome de evento</td> </tr><tr><td>[[<code>events_waits_summary_global_by_event_name</code>]]</td> <td>Esperar eventos por nome de evento</td> </tr></tbody></table>

#### Resumo das etapas

**Tabela 29.8 Tabelas de Resumo de Eventos de Etapas do Schema de Desempenho**

<table summary="Uma referência que lista todas as tabelas de resumo de eventos do estágio do Schema de Desempenho."><thead><tr><th>Nome da tabela</th> <th>Descrição</th> </tr></thead><tbody><tr><td>[[<code>events_stages_summary_by_account_by_event_name</code>]]</td> <td>Eventos em palco por conta e nome do evento</td> </tr><tr><td>[[<code>events_stages_summary_by_host_by_event_name</code>]]</td> <td>Eventos em palco por nome do anfitrião e nome do evento</td> </tr><tr><td>[[<code>events_stages_summary_by_thread_by_event_name</code>]]</td> <td>Espera de estágio por fio e nome do evento</td> </tr><tr><td>[[<code>events_stages_summary_by_user_by_event_name</code>]]</td> <td>Eventos em estágio por nome de usuário e nome de evento</td> </tr><tr><td>[[<code>events_stages_summary_global_by_event_name</code>]]</td> <td>Tempo de espera por nome de evento</td> </tr></tbody></table>

#### Resumo das declarações

**Tabela 29.9 Tabelas de Resumo de Eventos de Declaração do Schema de Desempenho**

<table summary="Uma referência que lista todas as tabelas de resumo dos eventos de declaração do Schema de Desempenho."><thead><tr><th>Nome da tabela</th> <th>Descrição</th> </tr></thead><tbody><tr><td>[[<code>events_statements_histogram_by_digest</code>]]</td> <td>Histograma de declarações por esquema e valor de digestão</td> </tr><tr><td>[[<code>events_statements_histogram_global</code>]]</td> <td>Histograma de declaração resumido globalmente</td> </tr><tr><td>[[<code>events_statements_summary_by_account_by_event_name</code>]]</td> <td>Eventos declarados por conta e nome do evento</td> </tr><tr><td>[[<code>events_statements_summary_by_digest</code>]]</td> <td>Eventos declarativos por esquema e valor de digestão</td> </tr><tr><td>[[<code>events_statements_summary_by_host_by_event_name</code>]]</td> <td>Eventos declarados por nome do host e nome do evento</td> </tr><tr><td>[[<code>events_statements_summary_by_program</code>]]</td> <td>Eventos declarados por programa armazenado</td> </tr><tr><td>[[<code>events_statements_summary_by_thread_by_event_name</code>]]</td> <td>Eventos declarados por fio e nome do evento</td> </tr><tr><td>[[<code>events_statements_summary_by_user_by_event_name</code>]]</td> <td>Eventos declarados por nome de usuário e nome de evento</td> </tr><tr><td>[[<code>events_statements_summary_global_by_event_name</code>]]</td> <td>Eventos declarados por nome de evento</td> </tr><tr><td>[[<code>prepared_statements_instances</code>]]</td> <td>Instâncias de declarações preparadas e estatísticas</td> </tr></tbody></table>

#### Resumo das transações

**Tabela 29.10 Tabelas de Resumo de Eventos de Transação do Schema de Desempenho**

<table summary="Uma referência que lista todas as tabelas de resumo dos eventos de transação do Schema de Desempenho."><thead><tr><th>Nome da tabela</th> <th>Descrição</th> </tr></thead><tbody><tr><td>[[<code>events_transactions_summary_by_account_by_event_name</code>]]</td> <td>Eventos de transação por conta e nome do evento</td> </tr><tr><td>[[<code>events_transactions_summary_by_host_by_event_name</code>]]</td> <td>Eventos de transação por nome do host e nome do evento</td> </tr><tr><td>[[<code>events_transactions_summary_by_thread_by_event_name</code>]]</td> <td>Eventos de transação por fio e nome do evento</td> </tr><tr><td>[[<code>events_transactions_summary_by_user_by_event_name</code>]]</td> <td>Eventos de transação por nome de usuário e nome de evento</td> </tr><tr><td>[[<code>events_transactions_summary_global_by_event_name</code>]]</td> <td>Eventos de transação por nome de evento</td> </tr></tbody></table>

#### Resumo de espera de objetos

**Tabela 29.11 Tabelas de Resumo de Eventos de Objetos do Schema de Desempenho**

<table summary="Uma referência que lista todas as tabelas de resumo de eventos de objetos do Schema de Desempenho."><thead><tr><th>Nome da tabela</th> <th>Descrição</th> </tr></thead><tbody><tr><td>[[<code>objects_summary_global_by_type</code>]]</td> <td>Resumo dos objetos</td> </tr></tbody></table>

#### Resumo de E/S de Arquivos

**Tabela 29.12 Tabelas de Resumo de Eventos de Acesso/Saída de Arquivo do Schema de Desempenho**

<table summary="Uma referência que lista todas as tabelas de resumo de eventos de E/S do Schema de Desempenho."><thead><tr><th>Nome da tabela</th> <th>Descrição</th> </tr></thead><tbody><tr><td>[[<code>file_summary_by_event_name</code>]]</td> <td>Filtre os arquivos por nome do evento</td> </tr><tr><td>[[<code>file_summary_by_instance</code>]]</td> <td>Eventos por instância do arquivo</td> </tr></tbody></table>

#### Resumo de espera de entrada/saída da tabela e bloqueio

**Tabela 29.13 Tabela de Schema de Desempenho I/O e Tabelas de Resumo de Eventos de Aguarda de Bloqueio**

<table summary="Uma referência que lista todas as tabelas de eventos de bloqueio e de I/O do Schema de Desempenho."><thead><tr><th>Nome da tabela</th> <th>Descrição</th> </tr></thead><tbody><tr><td>[[<code>table_io_waits_summary_by_index_usage</code>]]</td> <td>Espera de entrada/saída de tabela por índice</td> </tr><tr><td>[[<code>table_io_waits_summary_by_table</code>]]</td> <td>Espera de I/O de tabela por tabela</td> </tr><tr><td>[[<code>table_lock_waits_summary_by_table</code>]]</td> <td>Esperas de bloqueio de tabela por tabela</td> </tr></tbody></table>

#### Resumo dos Soquetes

**Tabela 29.14 Tabelas de Resumo de Eventos de Sockets do Schema de Desempenho**

<table summary="Uma referência que lista todas as tabelas de resumo de eventos de soquete do Schema de Desempenho."><thead><tr><th>Nome da tabela</th> <th>Descrição</th> </tr></thead><tbody><tr><td>[[<code>socket_summary_by_event_name</code>]]</td> <td>Socket espera e I/O por nome de evento</td> </tr><tr><td>[[<code>socket_summary_by_instance</code>]]</td> <td>Socket espera e I/O por instância</td> </tr></tbody></table>

#### Resumo de Memória

**Tabela 29.15 Tabelas de Resumo das Operações de Memória do Schema de Desempenho**

<table summary="Uma referência que lista todas as tabelas de resumo das operações de memória do Gerenciamento de Desempenho."><thead><tr><th>Nome da tabela</th> <th>Descrição</th> </tr></thead><tbody><tr><td>[[<code>memory_summary_by_account_by_event_name</code>]]</td> <td>Operações de memória por conta e nome de evento</td> </tr><tr><td>[[<code>memory_summary_by_host_by_event_name</code>]]</td> <td>Operações de memória por host e nome de evento</td> </tr><tr><td>[[<code>memory_summary_by_thread_by_event_name</code>]]</td> <td>Operações de memória por fio e nome de evento</td> </tr><tr><td>[[<code>memory_summary_by_user_by_event_name</code>]]</td> <td>Operações de memória por usuário e nome de evento</td> </tr><tr><td>[[<code>memory_summary_global_by_event_name</code>]]</td> <td>Operações de memória global por nome de evento</td> </tr></tbody></table>

#### Resumo de Erros

**Tabela 29.16 Tabelas de Resumo de Erros do Schema de Desempenho**

<table summary="Uma referência que lista todas as tabelas de resumo de erros do Schema de Desempenho."><thead><tr><th>Nome da tabela</th> <th>Descrição</th> </tr></thead><tbody><tr><td>[[<code>events_errors_summary_by_account_by_error</code>]]</td> <td>Erros por conta e código de erro</td> </tr><tr><td>[[<code>events_errors_summary_by_host_by_error</code>]]</td> <td>Erros por host e código de erro</td> </tr><tr><td>[[<code>events_errors_summary_by_thread_by_error</code>]]</td> <td>Erros por fio e código de erro</td> </tr><tr><td>[[<code>events_errors_summary_by_user_by_error</code>]]</td> <td>Erros por usuário e código de erro</td> </tr><tr><td>[[<code>events_errors_summary_global_by_error</code>]]</td> <td>Erros por código de erro</td> </tr></tbody></table>

#### Resumo dos Status Variáveis

**Tabela 29.17 Resumo das tabelas de variáveis de status de erro do esquema de desempenho**

<table summary="Uma referência que lista todas as tabelas de resumo de eventos do estágio do Schema de Desempenho."><thead><tr><th>Nome da tabela</th> <th>Descrição</th> </tr></thead><tbody><tr><td>[[<code>events_stages_summary_by_account_by_event_name</code>]]</td> <td>Eventos em palco por conta e nome do evento</td> </tr><tr><td>[[<code>events_stages_summary_by_host_by_event_name</code>]]</td> <td>Eventos em palco por nome do anfitrião e nome do evento</td> </tr><tr><td>[[<code>events_stages_summary_by_thread_by_event_name</code>]]</td> <td>Espera de estágio por fio e nome do evento</td> </tr><tr><td>[[<code>events_stages_summary_by_user_by_event_name</code>]]</td> <td>Eventos em estágio por nome de usuário e nome de evento</td> </tr><tr><td>[[<code>events_stages_summary_global_by_event_name</code>]]</td> <td>Tempo de espera por nome de evento</td> </tr></tbody></table>0
