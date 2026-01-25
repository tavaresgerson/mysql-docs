#### 25.12.8.1 A Table `accounts`

A Table [`accounts`](performance-schema-accounts-table.html "25.12.8.1 The accounts Table") contém uma linha para cada conta que se conectou ao servidor MySQL. Para cada conta, a tabela conta o número atual e total de *Connections*. O tamanho da tabela é ajustado automaticamente (*autosized*) na inicialização do servidor (*server startup*). Para definir o tamanho da tabela explicitamente, defina a variável de sistema [`performance_schema_accounts_size`](performance-schema-system-variables.html#sysvar_performance_schema_accounts_size) na inicialização do servidor. Para desativar as estatísticas de contas, defina esta variável como 0.

A Table [`accounts`](performance-schema-accounts-table.html "25.12.8.1 The accounts Table") possui as seguintes colunas. Para uma descrição de como o Performance Schema mantém as linhas nesta *table*, incluindo o efeito da instrução [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement"), consulte [Seção 25.12.8, “Performance Schema Connection Tables”](performance-schema-connection-tables.html "25.12.8 Performance Schema Connection Tables”).

* `USER`

  O nome de usuário (*user name*) do cliente para a *Connection*. É `NULL` para um *Thread* interno, ou para uma sessão de usuário que falhou ao autenticar.

* `HOST`

  O *Host* do qual o cliente se conectou. É `NULL` para um *Thread* interno, ou para uma sessão de usuário que falhou ao autenticar.

* `CURRENT_CONNECTIONS`

  O número atual de *Connections* para a conta.

* `TOTAL_CONNECTIONS`

  O número total de *Connections* para a conta.