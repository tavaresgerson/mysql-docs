#### 29.12.8.2 A tabela hosts

A tabela `hosts` contém uma linha para cada host a partir do qual os clientes se conectaram ao servidor MySQL. Para cada nome de host, a tabela conta o número atual e total de conexões. O tamanho da tabela é dimensionado automaticamente ao inicializar o servidor. Para definir explicitamente o tamanho da tabela, defina a variável de sistema `performance_schema_hosts_size` ao inicializar o servidor. Para desabilitar as estatísticas de host, defina essa variável para 0.

A tabela `hosts` tem as seguintes colunas. Para uma descrição de como o Schema de Desempenho mantém as linhas nesta tabela, incluindo o efeito de `TRUNCATE TABLE`, consulte a Seção 29.12.8, “Tabelas de Conexão do Schema de Desempenho”.

* `HOST`

  O host a partir do qual o cliente se conectou. Isso é `NULL` para um thread interno ou para uma sessão de usuário que não conseguiu autenticar.

* `CURRENT_CONNECTIONS`

  O número atual de conexões para o host.

* `TOTAL_CONNECTIONS`

  O número total de conexões para o host.

* `MAX_SESSION_CONTROLLED_MEMORY`

  Relata a quantidade máxima de memória controlada usada por uma sessão pertencente ao host.

* `MAX_SESSION_TOTAL_MEMORY`

  Relata a quantidade máxima de memória usada por uma sessão pertencente ao host.

A tabela `hosts` tem esses índices:

* Chave primária em (`HOST`)