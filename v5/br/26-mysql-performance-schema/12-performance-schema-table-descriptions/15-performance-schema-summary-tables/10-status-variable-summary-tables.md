#### 25.12.15.10 Tabelas de Resumo de Status Variable

Nota

O valor da System Variable [`show_compatibility_56`](server-system-variables.html#sysvar_show_compatibility_56) afeta as informações disponíveis nas tabelas aqui descritas. Para detalhes, consulte a descrição dessa variável em [Seção 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables").

O Performance Schema disponibiliza informações de Status Variable nas tabelas descritas em [Seção 25.12.14, “Performance Schema Status Variable Tables”](performance-schema-status-variable-tables.html "25.12.14 Performance Schema Status Variable Tables"). Ele também disponibiliza informações agregadas de Status Variable em tabelas de resumo (summary tables), descritas aqui. Cada tabela de resumo de Status Variable possui uma ou mais colunas de agrupamento para indicar como a tabela agrega os valores de status:

* [`status_by_account`](performance-schema-status-variable-summary-tables.html "25.12.15.10 Status Variable Summary Tables") possui as colunas `USER`, `HOST` e `VARIABLE_NAME` para resumir Status Variables por account.

* [`status_by_host`](performance-schema-status-variable-summary-tables.html "25.12.15.10 Status Variable Summary Tables") possui as colunas `HOST` e `VARIABLE_NAME` para resumir Status Variables pelo host a partir do qual os clientes se conectaram.

* [`status_by_user`](performance-schema-status-variable-summary-tables.html "25.12.15.10 Status Variable Summary Tables") possui as colunas `USER` e `VARIABLE_NAME` para resumir Status Variables pelo nome de usuário (user name) do cliente.

Cada tabela de resumo de Status Variable possui esta coluna de resumo contendo valores agregados:

* `VARIABLE_VALUE`

  O valor agregado da Status Variable para Sessions ativas e terminadas.

O significado de "account" (conta) nessas tabelas é semelhante ao seu significado nas grant tables do MySQL no Database de sistema `mysql`, no sentido de que o termo se refere a uma combinação de valores de user e host. Eles diferem no fato de que, para as grant tables, a parte host de uma account pode ser um padrão (pattern), enquanto para as tabelas do Performance Schema, o valor do host é sempre um nome de host específico sem padrão (nonpattern).

O status da account é coletado quando as Sessions terminam. Os contadores de status da Session são adicionados aos contadores de status globais e aos contadores de status da account correspondente. Se as estatísticas de account não forem coletadas, o status da Session será adicionado ao status do host e do user, caso os status de host e user sejam coletados.

As estatísticas de account, host e user não são coletadas se as System Variables [`performance_schema_accounts_size`](performance-schema-system-variables.html#sysvar_performance_schema_accounts_size), [`performance_schema_hosts_size`](performance-schema-system-variables.html#sysvar_performance_schema_hosts_size) e [`performance_schema_users_size`](performance-schema-system-variables.html#sysvar_performance_schema_users_size), respectivamente, estiverem definidas como 0.

O Performance Schema suporta [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") para tabelas de resumo de Status Variable da seguinte forma; em todos os casos, o status para Sessions ativas não é afetado:

* [`status_by_account`](performance-schema-status-variable-summary-tables.html "25.12.15.10 Status Variable Summary Tables"): Agrega o status da account de Sessions terminadas ao status do user e do host e, em seguida, redefine o status da account.

* [`status_by_host`](performance-schema-status-variable-summary-tables.html "25.12.15.10 Status Variable Summary Tables"): Redefine o status agregado do host de Sessions terminadas.

* [`status_by_user`](performance-schema-status-variable-summary-tables.html "25.12.15.10 Status Variable Summary Tables"): Redefine o status agregado do user de Sessions terminadas.

[`FLUSH STATUS`](flush.html#flush-status) adiciona o status da Session de todas as Sessions ativas às Status Variables globais, redefine o status de todas as Sessions ativas e redefine os valores de status de account, host e user agregados a partir de Sessions desconectadas.