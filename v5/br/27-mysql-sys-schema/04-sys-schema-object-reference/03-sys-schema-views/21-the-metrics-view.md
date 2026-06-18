#### 26.4.3.21 A View metrics

Esta View sumariza as metrics do servidor MySQL para exibir nomes de Variable, values, tipos e se elas estão habilitadas. Por padrão, as linhas são ordenadas pelo tipo e nome da Variable.

A View `metrics` inclui as seguintes informações:

* Global status variables da table `global_status` do Performance Schema

* `InnoDB` metrics da table `INNODB_METRICS` do `INFORMATION_SCHEMA`

* Alocação de memory atual e total, baseada na instrumentação de memory do Performance Schema

* O tempo atual (formatos legível por humanos e Unix timestamp)

Há alguma duplicação de informação entre as tables `global_status` e `INNODB_METRICS`, que a View `metrics` elimina.

A View `metrics` possui estas Columns:

* `Variable_name`

  O nome da metric. O tipo da metric determina a origem de onde o nome é retirado:

  + Para global status variables: A Column `VARIABLE_NAME` da table `global_status`

  + Para `InnoDB` metrics: A Column `NAME` da table `INNODB_METRICS`

  + Para outras metrics: Uma string descritiva fornecida pela View
* `Variable_value`

  O value da metric. O tipo da metric determina a origem de onde o value é retirado:

  + Para global status variables: A Column `VARIABLE_VALUE` da table `global_status`

  + Para `InnoDB` metrics: A Column `COUNT` da table `INNODB_METRICS`

  + Para memory metrics: A Column relevante da table `memory_summary_global_by_event_name` do Performance Schema

  + Para o tempo atual: O value de `NOW(3)` ou `UNIX_TIMESTAMP(NOW(3))`

* `Type`

  O tipo da metric:

  + Para global status variables: `Global Status`

  + Para `InnoDB` metrics: `InnoDB Metrics - %`, onde `%` é substituído pelo value da Column `SUBSYSTEM` da table `INNODB_METRICS`

  + Para memory metrics: `Performance Schema`

  + Para o tempo atual: `System Time`
* `Enabled`

  Se a metric está habilitada:

  + Para global status variables: `YES`
  + Para `InnoDB` metrics: `YES` se a Column `STATUS` da table `INNODB_METRICS` estiver `enabled` (habilitada), `NO` (NÃO) caso contrário

  + Para memory metrics: `NO`, `YES` ou `PARTIAL` (atualmente, `PARTIAL` ocorre apenas para memory metrics e indica que nem todos os instrumentos `memory/%` estão enabled; os instrumentos de memory do Performance Schema estão sempre enabled)

  + Para o tempo atual: `YES`