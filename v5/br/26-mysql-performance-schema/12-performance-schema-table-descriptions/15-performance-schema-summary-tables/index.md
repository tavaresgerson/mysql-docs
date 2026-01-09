### 25.12.15 Tabelas de Resumo do Schema de Desempenho

25.12.15.1 Tabelas de Resumo de Eventos de Aguarda

Tabelas de Resumo das Etapas do Schema de Desempenho

Tabelas de resumo de declarações do esquema de desempenho

25.12.15.4 Tabelas de Resumo de Transações

Resumo da tabela de espera de objetos do esquema de desempenho

Tabelas de Resumo de E/S de Arquivos do Schema de Desempenho

25.12.15.7 Tabelas de Resumo de Espera de Entrada/Saída e Bloqueio do Schema de Desempenho

Tabelas de Resumo de Sockets do Schema de Desempenho

25.12.15.9 Tabelas de Resumo de Memória

Tabelas de Resumo de Estatísticas Variáveis do Status (25.12.15.10)

As tabelas de resumo fornecem informações agregadas para eventos encerrados ao longo do tempo. As tabelas deste grupo resumem os dados dos eventos de diferentes maneiras.

Cada tabela de resumo tem colunas de agrupamento que determinam como os dados serão agrupados para serem agregados, e colunas de resumo que contêm os valores agregados. Tabelas que resumem eventos de maneiras semelhantes geralmente têm conjuntos semelhantes de colunas de resumo e diferem apenas nas colunas de agrupamento usadas para determinar como os eventos são agregados.

As tabelas de resumo podem ser truncadas com `TRUNCATE TABLE`. Geralmente, o efeito é redefinir as colunas de resumo para 0 ou `NULL`, e não para remover linhas. Isso permite limpar os valores coletados e reiniciar a agregação. Isso pode ser útil, por exemplo, após você ter feito uma alteração na configuração de execução. Exceções a esse comportamento de truncação são mencionadas nas seções individuais das tabelas de resumo.

#### Esperar Resumos de Eventos

**Tabela 25.3 Tabelas de Resumo de Eventos de Aguarda do Schema de Desempenho**

<table frame="box" rules="all" summary="Uma referência que lista todas as tabelas de resumo dos eventos de espera do Schema de Desempenho."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome da tabela</th> <th>Descrição</th> </tr></thead><tbody><tr><td>[[<code>events_waits_summary_by_account_by_event_name</code>]]</td> <td>Eventos esperados por conta e nome do evento</td> </tr><tr><td>[[<code>events_waits_summary_by_host_by_event_name</code>]]</td> <td>Eventos esperados por nome de host e nome de evento</td> </tr><tr><td>[[<code>events_waits_summary_by_instance</code>]]</td> <td>Eventos de espera por instância</td> </tr><tr><td>[[<code>events_waits_summary_by_thread_by_event_name</code>]]</td> <td>Eventos esperados por fio e nome do evento</td> </tr><tr><td>[[<code>events_waits_summary_by_user_by_event_name</code>]]</td> <td>Eventos esperados por nome de usuário e nome de evento</td> </tr><tr><td>[[<code>events_waits_summary_global_by_event_name</code>]]</td> <td>Esperar eventos por nome de evento</td> </tr></tbody></table>

#### Resumo das etapas

**Tabela 25.4 Tabelas de Resumo de Eventos de Etapas do Schema de Desempenho**

<table frame="box" rules="all" summary="Uma referência que lista todas as tabelas de resumo de eventos do estágio do Schema de Desempenho."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome da tabela</th> <th>Descrição</th> </tr></thead><tbody><tr><td>[[<code>events_stages_summary_by_account_by_event_name</code>]]</td> <td>Eventos em palco por conta e nome do evento</td> </tr><tr><td>[[<code>events_stages_summary_by_host_by_event_name</code>]]</td> <td>Eventos em palco por nome do anfitrião e nome do evento</td> </tr><tr><td>[[<code>events_stages_summary_by_thread_by_event_name</code>]]</td> <td>Espera de estágio por fio e nome do evento</td> </tr><tr><td>[[<code>events_stages_summary_by_user_by_event_name</code>]]</td> <td>Eventos em estágio por nome de usuário e nome de evento</td> </tr><tr><td>[[<code>events_stages_summary_global_by_event_name</code>]]</td> <td>Tempo de espera por nome de evento</td> </tr></tbody></table>

#### Resumo das declarações

**Tabela 25.5 Tabelas de Resumo de Eventos de Declaração do Schema de Desempenho**

<table frame="box" rules="all" summary="Uma referência que lista todas as tabelas de resumo dos eventos de declaração do Schema de Desempenho."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome da tabela</th> <th>Descrição</th> </tr></thead><tbody><tr><td>[[<code>events_statements_summary_by_account_by_event_name</code>]]</td> <td>Eventos declarados por conta e nome do evento</td> </tr><tr><td>[[<code>events_statements_summary_by_digest</code>]]</td> <td>Eventos declarativos por esquema e valor de digestão</td> </tr><tr><td>[[<code>events_statements_summary_by_host_by_event_name</code>]]</td> <td>Eventos declarados por nome do host e nome do evento</td> </tr><tr><td>[[<code>events_statements_summary_by_program</code>]]</td> <td>Eventos declarados por programa armazenado</td> </tr><tr><td>[[<code>events_statements_summary_by_thread_by_event_name</code>]]</td> <td>Eventos declarados por fio e nome do evento</td> </tr><tr><td>[[<code>events_statements_summary_by_user_by_event_name</code>]]</td> <td>Eventos declarados por nome de usuário e nome de evento</td> </tr><tr><td>[[<code>events_statements_summary_global_by_event_name</code>]]</td> <td>Eventos declarados por nome de evento</td> </tr><tr><td>[[<code>prepared_statements_instances</code>]]</td> <td>Instâncias de declarações preparadas e estatísticas</td> </tr></tbody></table>

#### Resumo das transações

**Tabela 25.6 Tabelas de Resumo de Eventos de Transação do Schema de Desempenho**

<table frame="box" rules="all" summary="Uma referência que lista todas as tabelas de resumo dos eventos de transação do Schema de Desempenho."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome da tabela</th> <th>Descrição</th> </tr></thead><tbody><tr><td>[[<code>events_transactions_summary_by_account_by_event_name</code>]]</td> <td>Eventos de transação por conta e nome do evento</td> </tr><tr><td>[[<code>events_transactions_summary_by_host_by_event_name</code>]]</td> <td>Eventos de transação por nome do host e nome do evento</td> </tr><tr><td>[[<code>events_transactions_summary_by_thread_by_event_name</code>]]</td> <td>Eventos de transação por fio e nome do evento</td> </tr><tr><td>[[<code>events_transactions_summary_by_user_by_event_name</code>]]</td> <td>Eventos de transação por nome de usuário e nome de evento</td> </tr><tr><td>[[<code>events_transactions_summary_global_by_event_name</code>]]</td> <td>Eventos de transação por nome de evento</td> </tr></tbody></table>

#### Resumo de espera de objetos

**Tabela 25.7 Tabelas de Resumo de Eventos de Objetos do Schema de Desempenho**

<table frame="box" rules="all" summary="Uma referência que lista todas as tabelas de resumo de eventos de objetos do Schema de Desempenho."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome da tabela</th> <th>Descrição</th> </tr></thead><tbody><tr><td>[[<code>objects_summary_global_by_type</code>]]</td> <td>Resumo dos objetos</td> </tr></tbody></table>

#### Resumo de E/S de Arquivos

**Tabela 25.8 Resumo das tabelas de eventos de I/O de arquivos do Schema de desempenho**

<table frame="box" rules="all" summary="Uma referência que lista todas as tabelas de resumo de eventos de E/S do Schema de Desempenho."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome da tabela</th> <th>Descrição</th> </tr></thead><tbody><tr><td>[[<code>file_summary_by_event_name</code>]]</td> <td>Filtre os arquivos por nome do evento</td> </tr><tr><td>[[<code>file_summary_by_instance</code>]]</td> <td>Eventos por instância do arquivo</td> </tr></tbody></table>

#### Resumo de espera de entrada/saída da tabela e bloqueio

**Tabela 25.9 Tabela de desempenho Schema I/O e tabelas de resumo de eventos de espera de bloqueio**

<table frame="box" rules="all" summary="Uma referência que lista todas as tabelas de eventos de bloqueio e de I/O do Schema de Desempenho."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome da tabela</th> <th>Descrição</th> </tr></thead><tbody><tr><td>[[<code>table_io_waits_summary_by_index_usage</code>]]</td> <td>Espera de entrada/saída de tabela por índice</td> </tr><tr><td>[[<code>table_io_waits_summary_by_table</code>]]</td> <td>Espera de I/O de tabela por tabela</td> </tr><tr><td>[[<code>table_lock_waits_summary_by_table</code>]]</td> <td>Esperas de bloqueio de tabela por tabela</td> </tr></tbody></table>

#### Resumo dos Soquetes

**Tabela 25.10 Tabelas de Resumo de Eventos de Sockets do Schema de Desempenho**

<table frame="box" rules="all" summary="Uma referência que lista todas as tabelas de resumo de eventos de soquete do Schema de Desempenho."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome da tabela</th> <th>Descrição</th> </tr></thead><tbody><tr><td>[[<code>socket_summary_by_event_name</code>]]</td> <td>Socket espera e I/O por nome de evento</td> </tr><tr><td>[[<code>socket_summary_by_instance</code>]]</td> <td>Socket espera e I/O por instância</td> </tr></tbody></table>

#### Resumo de Memória

**Tabela 25.11 Tabelas de Resumo das Operações de Memória do Schema de Desempenho**

<table frame="box" rules="all" summary="Uma referência que lista todas as tabelas de resumo das operações de memória do Gerenciamento de Desempenho."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome da tabela</th> <th>Descrição</th> </tr></thead><tbody><tr><td>[[<code>memory_summary_by_account_by_event_name</code>]]</td> <td>Operações de memória por conta e nome de evento</td> </tr><tr><td>[[<code>memory_summary_by_host_by_event_name</code>]]</td> <td>Operações de memória por host e nome de evento</td> </tr><tr><td>[[<code>memory_summary_by_thread_by_event_name</code>]]</td> <td>Operações de memória por fio e nome de evento</td> </tr><tr><td>[[<code>memory_summary_by_user_by_event_name</code>]]</td> <td>Operações de memória por usuário e nome de evento</td> </tr><tr><td>[[<code>memory_summary_global_by_event_name</code>]]</td> <td>Operações de memória global por nome de evento</td> </tr></tbody></table>

#### Resumo dos Status Variáveis

**Tabela 25.12 Resumo das tabelas de variáveis de status de erro do esquema de desempenho**

<table frame="box" rules="all" summary="Uma referência que lista todas as tabelas de resumo das variáveis de status do Schema de Desempenho."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome da tabela</th> <th>Descrição</th> </tr></thead><tbody><tr><td>[[<code>status_by_account</code>]]</td> <td>Variáveis de status de sessão por conta</td> </tr><tr><td>[[<code>status_by_host</code>]]</td> <td>Variáveis de status de sessão por nome de host</td> </tr><tr><td>[[<code>status_by_user</code>]]</td> <td>Variáveis de status de sessão por nome de usuário</td> </tr></tbody></table>
