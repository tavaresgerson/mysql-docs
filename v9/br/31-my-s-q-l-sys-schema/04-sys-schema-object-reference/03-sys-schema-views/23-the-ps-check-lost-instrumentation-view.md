#### 30.4.3.23 A visualização ps_check_lost_instrumentation

Essa visualização retorna informações sobre os instrumentos perdidos do Schema de Desempenho, para indicar se o Schema de Desempenho não consegue monitorar todos os dados em tempo de execução.

A visualização `ps_check_lost_instrumentation` tem as seguintes colunas:

* `variable_name`

  O nome da variável de status do Schema de Desempenho que indica que tipo de instrumento foi perdido.

* `variable_value`

  O número de instrumentos perdidos.