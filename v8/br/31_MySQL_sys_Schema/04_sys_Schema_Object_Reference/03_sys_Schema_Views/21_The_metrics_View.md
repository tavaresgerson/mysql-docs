#### 30.4.3.21 As métricas Visualizar

Essa visualização resume as métricas do servidor MySQL para mostrar os nomes, valores, tipos e se eles estão habilitados. Por padrão, as linhas são ordenadas por tipo e nome de variável.

A visualização `metrics` inclui essas informações:

- Variáveis de status global da tabela do Schema de Desempenho `global_status`

- `InnoDB` métricas da tabela `INFORMATION_SCHEMA` `INNODB_METRICS`

- Alocação de memória atual e total, com base na instrumentação de memória do Gerenciamento de Desempenho

- A hora atual (em formatos legíveis para humanos e timestamp Unix)

Há alguma duplicação de informações entre as tabelas `global_status` e `INNODB_METRICS`, que a visualização `metrics` elimina.

A visualização `metrics` tem essas colunas:

- `Variable_name`

  O nome métrico. O tipo métrico determina a fonte a partir da qual o nome é retirado:

  - Para variáveis de status global: A coluna `VARIABLE_NAME` da tabela `global_status`

  - Para métricas `InnoDB`: A coluna `NAME` da tabela `INNODB_METRICS`

  - Para outras métricas: uma string descritiva fornecida pela visualização

- `Variable_value`

  O valor métrico. O tipo métrico determina a fonte a partir da qual o valor é obtido:

  - Para variáveis de status global: A coluna `VARIABLE_VALUE` da tabela `global_status`

  - Para métricas `InnoDB`: A coluna `COUNT` da tabela `INNODB_METRICS`

  - Para métricas de memória: A coluna relevante da tabela do Gerenciamento de Desempenho `memory_summary_global_by_event_name`

  - Para o momento atual: O valor de `NOW(3)` ou `UNIX_TIMESTAMP(NOW(3))`

- `Type`

  O tipo métrico:

  - Para variáveis de status globais: `Global Status`

  - Para as métricas `InnoDB`: `InnoDB Metrics - %`, onde `%` é substituído pelo valor da coluna `SUBSYSTEM` da tabela `INNODB_METRICS`

  - Para métricas de memória: `Performance Schema`

  - Para o momento atual: `System Time`

- `Enabled`

  Se a métrica está habilitada:

  - Para variáveis de status globais: `YES`

  - Para as métricas `InnoDB`: `YES` se a coluna `STATUS` da tabela `INNODB_METRICS` for `enabled`, `NO` caso contrário

  - Para métricas de memória: `NO`, `YES` ou `PARTIAL` (atualmente, `PARTIAL` ocorre apenas para métricas de memória e indica que nem todos os instrumentos de memória `memory/%` estão habilitados; os instrumentos de memória do Schema de Desempenho estão sempre habilitados)

  - Para o momento atual: `YES`
