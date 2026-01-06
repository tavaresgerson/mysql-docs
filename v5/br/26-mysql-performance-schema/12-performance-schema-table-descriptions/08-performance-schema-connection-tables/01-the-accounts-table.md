#### 25.12.8.1 A tabela de contas

A tabela `accounts` contém uma linha para cada conta que se conectou ao servidor MySQL. Para cada conta, a tabela conta o número atual e total de conexões. O tamanho da tabela é dimensionado automaticamente ao iniciar o servidor. Para definir explicitamente o tamanho da tabela, defina a variável de sistema `performance_schema_accounts_size` ao iniciar o servidor. Para desabilitar as estatísticas de conta, defina essa variável para 0.

A tabela `accounts` possui as seguintes colunas. Para uma descrição de como o Schema de Desempenho mantém as linhas nesta tabela, incluindo o efeito do `TRUNCATE TABLE`, consulte Seção 25.12.8, “Tabelas de Conexão do Schema de Desempenho”.

- `USUARIO`

  O nome de usuário do cliente para a conexão. Este é `NULL` para um thread interno ou para uma sessão de usuário que não conseguiu se autenticar.

- `HOST`

  O host a partir do qual o cliente se conectou. Isso é `NULL` para um thread interno ou para uma sessão de usuário que não conseguiu se autenticar.

- `CONEXÕES APRESENTADAS`

  O número atual de conexões para a conta.

- `TOTAL_CONEXÕES`

  O número total de conexões para a conta.
