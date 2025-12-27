#### 30.4.3.47 A vista

Essa vista fornece a versão atual do esquema `sys` e da versão do servidor MySQL.

Observação

Essa vista está desatualizada e está sujeita à remoção em uma versão futura do MySQL. As aplicações que a utilizam devem ser migradas para usar uma alternativa. Por exemplo, use a função `VERSION()` para recuperar a versão do servidor MySQL.

A vista `version` tem as seguintes colunas:

* `sys_version`

  A versão do esquema `sys`.

* `mysql_version`

  A versão do servidor MySQL.