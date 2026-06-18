### 29.12.15 Tabelas de variáveis de status do esquema de desempenho

O servidor MySQL mantém várias variáveis de status que fornecem informações sobre sua operação (veja a Seção 7.1.10, “Variáveis de Status do Servidor”). As informações das variáveis de status estão disponíveis nessas tabelas do Schema de Desempenho:

- `global_status`: Variáveis de status global. Uma aplicação que deseja apenas valores globais deve usar esta tabela.

- `session_status`: Variáveis de status para a sessão atual. Uma aplicação que deseja obter todos os valores das variáveis de status para sua própria sessão deve usar esta tabela. Ela inclui as variáveis de sessão para sua sessão, bem como os valores das variáveis globais que não têm contraparte de sessão.

- `status_by_thread`: Variáveis de status de sessão para cada sessão ativa. Uma aplicação que deseja saber os valores das variáveis de sessão para sessões específicas deve usar esta tabela. Ela inclui apenas variáveis de sessão, identificadas pelo ID do thread.

Há também tabelas de resumo que fornecem informações sobre variáveis de status agregadas por conta, nome do host e nome do usuário. Consulte a Seção 29.12.20.12, “Tabelas de Resumo de Variáveis de Status”.

As tabelas de variáveis de sessão (`session_status`, `status_by_thread`) contêm informações apenas para sessões ativas, não para sessões encerradas.

O Schema de Desempenho coleta estatísticas para variáveis de status globais apenas para os threads para os quais o valor `INSTRUMENTED` é `YES` na tabela `threads`. As estatísticas para variáveis de status de sessão são sempre coletadas, independentemente do valor `INSTRUMENTED`.

O Schema de Desempenho não coleta estatísticas para as variáveis de status `Com_xxx` nas tabelas de variáveis de status. Para obter contagens globais e por execução de instruções de sessão, use as tabelas `events_statements_summary_global_by_event_name` e `events_statements_summary_by_thread_by_event_name`, respectivamente. Por exemplo:

```
SELECT EVENT_NAME, COUNT_STAR
FROM performance_schema.events_statements_summary_global_by_event_name
WHERE EVENT_NAME LIKE 'statement/sql/%';
```

As tabelas `global_status` e `session_status` têm essas colunas:

- `VARIABLE_NAME`

  O nome da variável de status.

- `VARIABLE_VALUE`

  O valor da variável de status. Para `global_status`, esta coluna contém o valor global. Para `session_status`, esta coluna contém o valor da variável para a sessão atual.

As tabelas `global_status` e `session_status` possuem esses índices:

- Chave primária em (`VARIABLE_NAME`)

A tabela `status_by_thread` contém o status de cada fio ativo. Ela tem as seguintes colunas:

- `THREAD_ID`

  O identificador do fio da sessão em que a variável de status é definida.

- `VARIABLE_NAME`

  O nome da variável de status.

- `VARIABLE_VALUE`

  O valor da variável de sessão para a sessão nomeada pela coluna `THREAD_ID`.

A tabela `status_by_thread` tem esses índices:

- Chave primária em (`THREAD_ID`, `VARIABLE_NAME`)

A tabela `status_by_thread` contém informações da variável de status apenas sobre os threads em primeiro plano. Se a variável de sistema `performance_schema_max_thread_instances` não estiver autoescalonada (indicada por um valor de -1) e o número máximo permitido de objetos de thread instrumentados não for maior que o número de threads de segundo plano, a tabela estará vazia.

O Schema de Desempenho suporta `TRUNCATE TABLE` para tabelas de variáveis de status da seguinte forma:

- `global_status`: Redefine o estado do fio, da conta, do host e do usuário. Redefine as variáveis de status globais, exceto aquelas que o servidor nunca redefine.

- `session_status`: Não é suportado.

- `status_by_thread`: Agrupa o status de todas as threads ao status global e ao status da conta, e depois redefini o status da thread. Se as estatísticas da conta não forem coletadas, o status da sessão é adicionado ao status do host e do usuário, se o status do host e do usuário forem coletados.

  As estatísticas da conta, do anfitrião e do usuário não são coletadas se as variáveis de sistema `performance_schema_accounts_size`, `performance_schema_hosts_size` e `performance_schema_users_size`, respectivamente, forem definidas como 0.

`FLUSH STATUS` adiciona o status da sessão de todas as sessões ativas às variáveis de status globais, redefini o status de todas as sessões ativas e redefini os valores de status de conta, host e usuário agregados de sessões desconectadas.
