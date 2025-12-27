#### 30.4.3.21 A visualização de métricas

Esta visualização resume as métricas do servidor MySQL para mostrar os nomes das variáveis, valores, tipos e se estão habilitadas. Por padrão, as linhas são ordenadas por tipo e nome da variável.

A visualização `metrics` inclui as seguintes informações:

* Variáveis de status globais da tabela `global_status` do Schema de Desempenho
* Métricas `InnoDB` da tabela `INNODB_METRICS` do `INFORMATION_SCHEMA`
* Alocação de memória atual e total, com base na instrumentação de memória do Schema de Desempenho
* A hora atual (formatos legíveis para humanos e timestamp Unix)

Há alguma duplicação de informações entre as tabelas `global_status` e `INNODB_METRICS`, que a visualização `metrics` elimina.

A visualização `metrics` tem as seguintes colunas:

* `Variable_name`

  O nome da métrica. O tipo da métrica determina a fonte de onde o nome é retirado:

  + Para variáveis de status globais: A coluna `VARIABLE_NAME` da tabela `global_status`
  + Para métricas `InnoDB`: A coluna `NAME` da tabela `INNODB_METRICS`
  + Para outras métricas: Uma string descritiva fornecida pela visualização

* `Variable_value`

  O valor da métrica. O tipo da métrica determina a fonte de onde o valor é retirado:

  + Para variáveis de status globais: A coluna `VARIABLE_VALUE` da tabela `global_status`
  + Para métricas `InnoDB`: A coluna `COUNT` da tabela `INNODB_METRICS`
  + Para métricas de memória: A coluna relevante da tabela `memory_summary_global_by_event_name` do Schema de Desempenho
  + Para a hora atual: O valor de `NOW(3)` ou `UNIX_TIMESTAMP(NOW(3))`

* `Type`

  O tipo da métrica:

  + Para variáveis de status globais: `Global Status`
  + Para métricas `InnoDB`: `InnoDB Metrics - %`, onde `%` é substituído pelo valor da coluna `SUBSYSTEM` da tabela `INNODB_METRICS`
  + Para métricas de memória: `Performance Schema`

+ Para a hora atual: `Tempo do Sistema`
* `Ativado`

Se a métrica está ativada:

+ Para variáveis de status globais: `SIM`
+ Para métricas de `InnoDB`: `SIM` se a coluna `STATUS` da tabela `INNODB_METRICS` estiver `ativada`, `NÃO` caso contrário

+ Para métricas de memória: `NÃO`, `SIM` ou `PARTIAL` (atualmente, `PARTIAL` ocorre apenas para métricas de memória e indica que nem todos os instrumentos de memória `%mem` estão ativados; os instrumentos de memória do Schema de Desempenho estão sempre ativados)

+ Para a hora atual: `SIM`