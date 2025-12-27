#### 29.12.8.3 A tabela de usuários

A tabela `users` contém uma linha para cada usuário que se conectou ao servidor MySQL. Para cada nome de usuário, a tabela conta o número atual e total de conexões. O tamanho da tabela é dimensionado automaticamente ao inicializar o servidor. Para definir explicitamente o tamanho da tabela, defina a variável de sistema `performance_schema_users_size` ao inicializar o servidor. Para desabilitar as estatísticas de usuários, defina essa variável para 0.

A tabela `users` tem as seguintes colunas. Para uma descrição de como o Schema de Desempenho mantém as linhas nesta tabela, incluindo o efeito de `TRUNCATE TABLE`, consulte a Seção 29.12.8, “Tabelas de Conexão do Schema de Desempenho”.

* `USER`

  O nome do usuário cliente para a conexão. Isso é `NULL` para um thread interno ou para uma sessão de usuário que não conseguiu autenticar.

* `CURRENT_CONNECTIONS`

  O número atual de conexões para o usuário.

* `TOTAL_CONNECTIONS`

  O número total de conexões para o usuário.

* `MAX_SESSION_CONTROLLED_MEMORY`

  Relata a quantidade máxima de memória controlada usada por uma sessão pertencente ao usuário.

* `MAX_SESSION_TOTAL_MEMORY`

  Relata a quantidade máxima de memória usada por uma sessão pertencente ao usuário.

A tabela `users` tem esses índices:

* Chave primária em (`USER`)