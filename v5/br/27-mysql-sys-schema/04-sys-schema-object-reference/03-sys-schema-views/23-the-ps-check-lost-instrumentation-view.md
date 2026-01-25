#### 26.4.3.23 A View ps_check_lost_instrumentation

Esta View retorna informações sobre instrumentos perdidos do Performance Schema, para indicar se o Performance Schema é incapaz de monitorar todos os dados de runtime.

A View `ps_check_lost_instrumentation` possui estas colunas:

* `variable_name`

  O nome da variável de status do Performance Schema que indica qual tipo de instrumento foi perdido.

* `variable_value`

  O número de instrumentos perdidos.