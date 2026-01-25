#### 25.12.8.3 A Tabela users

A tabela [`users`](performance-schema-users-table.html "25.12.8.3 The users Table") contém uma linha para cada usuário que se conectou ao *server* MySQL. Para cada nome de usuário, a tabela conta o número atual e total de conexões. O tamanho da tabela é ajustado automaticamente na inicialização do *server*. Para definir o tamanho da tabela explicitamente, defina a variável de sistema [`performance_schema_users_size`](performance-schema-system-variables.html#sysvar_performance_schema_users_size) na inicialização do *server*. Para desabilitar as estatísticas de usuário, defina esta variável como 0.

A tabela [`users`](performance-schema-users-table.html "25.12.8.3 The users Table") possui as seguintes colunas. Para uma descrição de como o Performance Schema mantém as linhas nesta tabela, incluindo o efeito da instrução [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement"), consulte a [Seção 25.12.8, “Tabelas de Conexão do Performance Schema”](performance-schema-connection-tables.html "25.12.8 Performance Schema Connection Tables").

* `USER`

  O nome de usuário (user name) cliente para a conexão. Este campo é `NULL` para um *thread* interno ou para uma sessão de usuário que falhou na autenticação.

* `CURRENT_CONNECTIONS`

  O número atual de conexões para o usuário.

* `TOTAL_CONNECTIONS`

  O número total de conexões para o usuário.