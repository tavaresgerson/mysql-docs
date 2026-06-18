#### 26.4.3.47 A View version

Esta View fornece as versões atuais do schema `sys` e do servidor MySQL.

Nota

A partir do MySQL 5.7.28, esta View está descontinuada (deprecated) e sujeita a remoção em uma versão futura do MySQL. As aplicações que a utilizam devem ser migradas para usar uma alternativa. Por exemplo, use a function `VERSION()` para recuperar a versão do servidor MySQL.

A View `version` possui estas colunas:

* `sys_version`

  A versão do schema `sys`.

* `mysql_version`

  A versão do servidor MySQL.