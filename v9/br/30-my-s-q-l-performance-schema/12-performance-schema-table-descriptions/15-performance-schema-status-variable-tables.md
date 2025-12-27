### 29.12.15 Tabelas de Variáveis de Estado do Schema de Desempenho

O servidor MySQL mantém muitas variáveis de estado que fornecem informações sobre sua operação (veja a Seção 7.1.10, “Variáveis de Estado do Servidor”). As informações das variáveis de estado estão disponíveis nessas tabelas do Schema de Desempenho:

* `global_status`: Variáveis de estado globais. Uma aplicação que deseja apenas valores globais deve usar essa tabela.

* `session_status`: Variáveis de estado para a sessão atual. Uma aplicação que deseja todos os valores das variáveis de estado para sua própria sessão deve usar essa tabela. Ela inclui as variáveis de sessão para sua sessão, bem como os valores das variáveis globais que não têm contraparte de sessão.

* `status_by_thread`: Variáveis de estado de sessão para cada sessão ativa. Uma aplicação que deseja saber os valores das variáveis de sessão para sessões específicas deve usar essa tabela. Ela inclui apenas as variáveis de sessão, identificadas pelo ID de thread.

Há também tabelas resumidas que fornecem informações sobre variáveis de estado agregadas por conta, nome do host e nome do usuário. Veja a Seção 29.12.20.12, “Tabelas de Resumo de Variáveis de Estado”.

As tabelas de variáveis de sessão (`session_status`, `status_by_thread`) contêm informações apenas para sessões ativas, não para sessões terminadas.

O Schema de Desempenho coleta estatísticas para variáveis de estado globais apenas para threads para os quais o valor `INSTRUMENTED` é `YES` na tabela `threads`. As estatísticas para variáveis de estado de sessão são sempre coletadas, independentemente do valor `INSTRUMENTED`.

O Schema de Desempenho não coleta estatísticas para as variáveis de status `Com_xxx` nas tabelas de variáveis de status. Para obter contagem de execução de instruções globais e por sessão, use as tabelas `events_statements_summary_global_by_event_name` e `events_statements_summary_by_thread_by_event_name`, respectivamente. Por exemplo:

```
SELECT EVENT_NAME, COUNT_STAR
FROM performance_schema.events_statements_summary_global_by_event_name
WHERE EVENT_NAME LIKE 'statement/sql/%';
```

As tabelas `global_status` e `session_status` têm as seguintes colunas:

* `VARIABLE_NAME`

  O nome da variável de status.

* `VARIABLE_VALUE`

  O valor da variável de status. Para `global_status`, esta coluna contém o valor global. Para `session_status`, esta coluna contém o valor da variável para a sessão atual.

As tabelas `global_status` e `session_status` têm os seguintes índices:

* Chave primária em (`VARIABLE_NAME`)

A tabela `status_by_thread` contém o status de cada thread ativo. Ela tem as seguintes colunas:

* `THREAD_ID`

  O identificador de thread da sessão em que a variável de status é definida.

* `VARIABLE_NAME`

  O nome da variável de status.

* `VARIABLE_VALUE`

  O valor da variável de sessão para a sessão nomeada pelo colunã `THREAD_ID`.

A tabela `status_by_thread` tem os seguintes índices:

* Chave primária em (`THREAD_ID`, `VARIABLE_NAME`)

A tabela `status_by_thread` contém informações de variáveis de status apenas sobre threads em primeiro plano. Se a variável de sistema `performance_schema_max_thread_instances` não for escalonada automaticamente (indicada por um valor de −1) e o número máximo de objetos de thread instrumentados permitido não for maior que o número de threads de segundo plano, a tabela está vazia.

O Schema de Desempenho suporta `TRUNCATE TABLE` para as tabelas de variáveis de status da seguinte forma:

* `global_status`: Redefine o status de thread, conta, host e usuário. Redefine as variáveis de status globais, exceto aquelas que o servidor nunca redefine.

* `session_status`: Não é suportado.
* `status_by_thread`: Agrupa o status de todas as threads no status global e no status da conta, e depois redefere o status das threads. Se as estatísticas da conta não forem coletadas, o status da sessão é adicionado ao status do host e do usuário, se o status do host e do usuário forem coletados.

As estatísticas da conta, do host e do usuário não são coletadas se as variáveis de sistema `performance_schema_accounts_size`, `performance_schema_hosts_size` e `performance_schema_users_size`, respectivamente, forem definidas como 0.

`FLUSH STATUS` adiciona o status da sessão de todas as sessões ativas às variáveis de status global, redefere o status de todas as sessões ativas e redefere os valores do status da conta, do host e do usuário agregados de sessões desconectadas.