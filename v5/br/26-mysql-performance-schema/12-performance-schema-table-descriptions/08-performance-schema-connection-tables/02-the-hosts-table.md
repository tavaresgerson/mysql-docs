#### 25.12.8.2 A Tabela hosts

A tabela `hosts` contém uma linha para cada HOST do qual os clientes se conectaram ao servidor MySQL. Para cada nome de HOST, a tabela contabiliza o número atual e total de connections. O tamanho da tabela é dimensionado automaticamente (autosized) na inicialização do servidor. Para definir o tamanho da tabela explicitamente, defina a variável de sistema `performance_schema_hosts_size` na inicialização do servidor. Para desativar as estatísticas de HOST, defina esta variável como 0.

A tabela `hosts` possui as seguintes colunas. Para uma descrição de como o Performance Schema mantém as linhas nesta tabela, incluindo o efeito da instrução `TRUNCATE TABLE`, consulte Seção 25.12.8, “Performance Schema Connection Tables”.

* `HOST`

  O HOST do qual o cliente se conectou. É `NULL` para um Thread interno ou para uma sessão de usuário que falhou na autenticação.

* `CURRENT_CONNECTIONS`

  O número atual de connections para o HOST.

* `TOTAL_CONNECTIONS`

  O número total de connections para o HOST.