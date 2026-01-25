### 24.3.15 A Tabela PARAMETERS do INFORMATION_SCHEMA

A tabela [`PARAMETERS`](information-schema-parameters-table.html "24.3.15 A Tabela PARAMETERS do INFORMATION_SCHEMA") fornece informações sobre *parameters* para *stored routines* (*stored procedures* e *stored functions*), e sobre valores de retorno para *stored functions*. A tabela [`PARAMETERS`](information-schema-parameters-table.html "24.3.15 A Tabela PARAMETERS do INFORMATION_SCHEMA") não inclui *built-in* (nativas) ou *loadable functions*. As informações do *parameter* são semelhantes ao conteúdo da coluna `param_list` na tabela `mysql.proc`.

A tabela [`PARAMETERS`](information-schema-parameters-table.html "24.3.15 A Tabela PARAMETERS do INFORMATION_SCHEMA") possui as seguintes colunas:

* `SPECIFIC_CATALOG`

  O nome do *catalog* ao qual pertence a *routine* que contém o *parameter*. Este valor é sempre `def`.

* `SPECIFIC_SCHEMA`

  O nome do *schema* (*database*) ao qual pertence a *routine* que contém o *parameter*.

* `SPECIFIC_NAME`

  O nome da *routine* que contém o *parameter*.

* `ORDINAL_POSITION`

  Para *parameters* sucessivos de uma *stored procedure* ou *function*, os valores de `ORDINAL_POSITION` são 1, 2, 3, e assim por diante. Para uma *stored function*, há também uma linha que se aplica ao valor de retorno da *function* (conforme descrito pela cláusula `RETURNS`). O valor de retorno não é um *parameter* verdadeiro, portanto, a linha que o descreve tem estas características únicas:

  + O valor de `ORDINAL_POSITION` é 0.
  + Os valores de `PARAMETER_NAME` e `PARAMETER_MODE` são `NULL` porque o valor de retorno não tem nome e o *mode* não se aplica.

* `PARAMETER_MODE`

  O *mode* do *parameter*. Este valor é um de `IN`, `OUT` ou `INOUT`. Para um valor de retorno de *stored function*, este valor é `NULL`.

* `PARAMETER_NAME`

  O nome do *parameter*. Para um valor de retorno de *stored function*, este valor é `NULL`.

* `DATA_TYPE`

  O *data type* (*tipo de dado*) do *parameter*.

  O valor de `DATA_TYPE` é apenas o nome do tipo, sem outras informações. O valor de `DTD_IDENTIFIER` contém o nome do tipo e possivelmente outras informações, como a *precision* ou *length*.

* `CHARACTER_MAXIMUM_LENGTH`

  Para *string parameters*, o comprimento máximo em caracteres.

* `CHARACTER_OCTET_LENGTH`

  Para *string parameters*, o comprimento máximo em *bytes*.

* `NUMERIC_PRECISION`

  Para *numeric parameters*, a *precision* numérica.

* `NUMERIC_SCALE`

  Para *numeric parameters*, a *scale* numérica.

* `DATETIME_PRECISION`

  Para *temporal parameters*, a *precision* de segundos fracionários.

* `CHARACTER_SET_NAME`

  Para *character string parameters*, o nome do *character set*.

* `COLLATION_NAME`

  Para *character string parameters*, o nome da *collation*.

* `DTD_IDENTIFIER`

  O *data type* (*tipo de dado*) do *parameter*.

  O valor de `DATA_TYPE` é apenas o nome do tipo, sem outras informações. O valor de `DTD_IDENTIFIER` contém o nome do tipo e possivelmente outras informações, como a *precision* ou *length*.

* `ROUTINE_TYPE`

  `PROCEDURE` para *stored procedures*, `FUNCTION` para *stored functions*.