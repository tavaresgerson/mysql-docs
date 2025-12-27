#### 29.12.8.1 A tabela `accounts`

A tabela `accounts` contém uma linha para cada conta que se conectou ao servidor MySQL. Para cada conta, a tabela conta o número atual e total de conexões. O tamanho da tabela é dimensionado automaticamente ao iniciar o servidor. Para definir explicitamente o tamanho da tabela, defina a variável de sistema `performance_schema_accounts_size` ao iniciar o servidor. Para desabilitar as estatísticas das contas, defina essa variável para 0.

A tabela `accounts` tem as seguintes colunas. Para uma descrição de como o Schema de Desempenho mantém as linhas nesta tabela, incluindo o efeito do `TRUNCATE TABLE`, consulte a Seção 29.12.8, “Tabelas de Conexão do Schema de Desempenho”.

* `USER`

  O nome do usuário do cliente para a conexão. Isso é `NULL` para um thread interno ou para uma sessão de usuário que não conseguiu autenticar.

* `HOST`

  O host a partir do qual o cliente se conectou. Isso é `NULL` para um thread interno ou para uma sessão de usuário que não conseguiu autenticar.

* `CURRENT_CONNECTIONS`

  O número atual de conexões para a conta.

* `TOTAL_CONNECTIONS`

  O número total de conexões para a conta.

* `MAX_SESSION_CONTROLLED_MEMORY`

  Relata a quantidade máxima de memória controlada usada por uma sessão pertencente à conta.

* `MAX_SESSION_TOTAL_MEMORY`

  Relata a quantidade máxima de memória usada por uma sessão pertencente à conta.

A tabela `accounts` tem esses índices:

* Chave primária em (`USER`, `HOST`)