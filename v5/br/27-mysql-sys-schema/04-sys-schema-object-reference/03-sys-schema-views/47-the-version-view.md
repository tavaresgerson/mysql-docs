#### 26.4.3.47 A versão Visualizar

Essa visualização fornece o esquema `sys` atual e as versões do servidor MySQL.

Nota

A partir do MySQL 5.7.28, essa visão é desaconselhada e está sujeita à remoção em uma versão futura do MySQL. Aplicações que a utilizam devem ser migradas para usar uma alternativa. Por exemplo, use a função `VERSION()` para recuperar a versão do servidor MySQL.

A visualização `version` tem essas colunas:

- `sys_version`

  A versão do esquema `sys`.

- `mysql_version`

  A versão do servidor MySQL.
