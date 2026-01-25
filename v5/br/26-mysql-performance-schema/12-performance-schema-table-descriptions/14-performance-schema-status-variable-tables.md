### 25.12.14 Tabelas de Variáveis de Status do Performance Schema

Nota

O valor da variável de sistema [`show_compatibility_56`](server-system-variables.html#sysvar_show_compatibility_56) afeta as informações disponíveis nas tabelas aqui descritas. Para detalhes, consulte a descrição dessa variável na [Seção 5.1.7, “Variáveis de Sistema do Servidor”](server-system-variables.html "5.1.7 Variáveis de Sistema do Servidor").

O servidor MySQL mantém muitas variáveis de Status que fornecem informações sobre sua operação (consulte [Seção 5.1.9, “Variáveis de Status do Servidor”](server-status-variables.html "5.1.9 Variáveis de Status do Servidor")). As informações das variáveis de Status estão disponíveis nestas tabelas do Performance Schema:

* [`global_status`](performance-schema-status-variable-tables.html "25.12.14 Tabelas de Variáveis de Status do Performance Schema"): Variáveis de Status globais. Uma aplicação que deseja apenas valores globais deve usar esta tabela.

* [`session_status`](performance-schema-status-variable-tables.html "25.12.14 Tabelas de Variáveis de Status do Performance Schema"): Variáveis de Status para a sessão atual. Uma aplicação que deseja todos os valores de variáveis de Status para sua própria sessão deve usar esta tabela. Ela inclui as variáveis de sessão para sua sessão, bem como os valores de variáveis globais que não têm uma contraparte de sessão.

* [`status_by_thread`](performance-schema-status-variable-tables.html "25.12.14 Tabelas de Variáveis de Status do Performance Schema"): Variáveis de Status de sessão para cada sessão ativa. Uma aplicação que deseja saber os valores das variáveis de sessão para sessões específicas deve usar esta tabela. Ela inclui apenas variáveis de sessão, identificadas pelo ID do Thread.

Existem também tabelas de resumo que fornecem informações de variáveis de Status agregadas por conta (*account*), nome do host e nome do usuário. Consulte [Seção 25.12.15.10, “Tabelas de Resumo de Variáveis de Status”](performance-schema-status-variable-summary-tables.html "25.12.15.10 Tabelas de Resumo de Variáveis de Status").

As tabelas de variáveis de sessão ([`session_status`](performance-schema-status-variable-tables.html "25.12.14 Tabelas de Variáveis de Status do Performance Schema"), [`status_by_thread`](performance-schema-status-variable-tables.html "25.12.14 Tabelas de Variáveis de Status do Performance Schema")) contêm informações apenas para sessões ativas, e não para sessões terminadas.

O Performance Schema coleta estatísticas para variáveis de Status globais apenas para Threads cujo valor `INSTRUMENTED` seja `YES` na tabela [`threads`](performance-schema-threads-table.html "25.12.16.4 A Tabela threads"). As estatísticas para variáveis de Status de sessão são sempre coletadas, independentemente do valor `INSTRUMENTED`.

O Performance Schema não coleta estatísticas para variáveis de Status `Com_xxx` nas tabelas de variáveis de Status. Para obter contagens de execução de comandos global e por sessão, use as tabelas [`events_statements_summary_global_by_event_name`](performance-schema-statement-summary-tables.html "25.12.15.3 Tabelas de Resumo de Comandos") e [`events_statements_summary_by_thread_by_event_name`](performance-schema-statement-summary-tables.html "25.12.15.3 Tabelas de Resumo de Comandos"), respectivamente. Por exemplo:

```sql
SELECT EVENT_NAME, COUNT_STAR
FROM performance_schema.events_statements_summary_global_by_event_name
WHERE EVENT_NAME LIKE 'statement/sql/%';
```

As tabelas [`global_status`](performance-schema-status-variable-tables.html "25.12.14 Tabelas de Variáveis de Status do Performance Schema") e [`session_status`](performance-schema-status-variable-tables.html "25.12.14 Tabelas de Variáveis de Status do Performance Schema") possuem estas colunas:

* `VARIABLE_NAME`

  O nome da variável de Status.

* `VARIABLE_VALUE`

  O valor da variável de Status. Para [`global_status`](performance-schema-status-variable-tables.html "25.12.14 Tabelas de Variáveis de Status do Performance Schema"), esta coluna contém o valor global. Para [`session_status`](performance-schema-status-variable-tables.html "25.12.14 Tabelas de Variáveis de Status do Performance Schema"), esta coluna contém o valor da variável para a sessão atual.

A tabela [`status_by_thread`](performance-schema-status-variable-tables.html "25.12.14 Tabelas de Variáveis de Status do Performance Schema") contém o Status de cada Thread ativo. Ela possui estas colunas:

* `THREAD_ID`

  O identificador do Thread (Thread ID) da sessão na qual a variável de Status é definida.

* `VARIABLE_NAME`

  O nome da variável de Status.

* `VARIABLE_VALUE`

  O valor da variável de sessão para a sessão nomeada pela coluna `THREAD_ID`.

A tabela [`status_by_thread`](performance-schema-status-variable-tables.html "25.12.14 Tabelas de Variáveis de Status do Performance Schema") contém informações de variáveis de Status apenas sobre Threads de primeiro plano (*foreground threads*). Se a variável de sistema [`performance_schema_max_thread_instances`](performance-schema-system-variables.html#sysvar_performance_schema_max_thread_instances) não for autoescalonada (significado por um valor de −1) e o número máximo permitido de objetos Thread instrumentados não for maior que o número de Threads de segundo plano (*background threads*), a tabela estará vazia.

O Performance Schema suporta [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") para tabelas de variáveis de Status da seguinte forma:

* [`global_status`](performance-schema-status-variable-tables.html "25.12.14 Tabelas de Variáveis de Status do Performance Schema"): Reseta o Status de Thread, conta (*account*), host e usuário. Reseta variáveis de Status globais, exceto aquelas que o servidor nunca reseta.

* [`session_status`](performance-schema-status-variable-tables.html "25.12.14 Tabelas de Variáveis de Status do Performance Schema"): Não suportado.
* [`status_by_thread`](performance-schema-status-variable-tables.html "25.12.14 Tabelas de Variáveis de Status do Performance Schema"): Agrega o Status para todos os Threads ao Status global e Status de conta (*account status*), e então reseta o Status do Thread. Se as estatísticas de conta não forem coletadas, o Status da sessão é adicionado ao Status do host e do usuário, se o Status do host e do usuário forem coletados.

  Estatísticas de conta, host e usuário não são coletadas se as variáveis de sistema [`performance_schema_accounts_size`](performance-schema-system-variables.html#sysvar_performance_schema_accounts_size), [`performance_schema_hosts_size`](performance-schema-system-variables.html#sysvar_performance_schema_hosts_size) e [`performance_schema_users_size`](performance-schema-system-variables.html#sysvar_performance_schema_users_size), respectivamente, estiverem definidas como 0.

[`FLUSH STATUS`](flush.html#flush-status) adiciona o Status da sessão de todas as sessões ativas às variáveis de Status globais, reseta o Status de todas as sessões ativas e reseta os valores de Status de conta, host e usuário agregados de sessões desconectadas.