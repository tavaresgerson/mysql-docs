#### 30.4.3.47 A versão Visualizar

Essa visualização fornece o esquema atual `sys` e as versões do servidor MySQL.

Nota

A partir do MySQL 8.0.18, essa visualização é desaconselhada e está sujeita à remoção em uma versão futura do MySQL. Aplicações que a utilizam devem ser migradas para usar uma alternativa. Por exemplo, use a função `VERSION()` para recuperar a versão do servidor MySQL.

A visualização `version` tem essas colunas:

- `sys_version`

  A versão do esquema `sys`.

- `mysql_version`

  A versão do servidor MySQL.
