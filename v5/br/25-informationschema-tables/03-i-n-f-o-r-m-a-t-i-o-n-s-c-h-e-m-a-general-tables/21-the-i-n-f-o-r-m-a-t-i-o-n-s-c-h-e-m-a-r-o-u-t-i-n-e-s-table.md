### 24.3.21 A Tabela ROUTINES do INFORMATION_SCHEMA

A tabela [`ROUTINES`](information-schema-routines-table.html "24.3.21 A Tabela ROUTINES do INFORMATION_SCHEMA") fornece informações sobre stored routines (stored procedures e stored functions). A tabela [`ROUTINES`](information-schema-routines-table.html "24.3.21 A Tabela ROUTINES do INFORMATION_SCHEMA") não inclui funções nativas (built-in) ou funções carregáveis (loadable functions).

A coluna chamada “Nome `mysql.proc`” indica a coluna da tabela `mysql.proc` que corresponde à coluna da tabela [`ROUTINES`](information-schema-routines-table.html "24.3.21 A Tabela ROUTINES do INFORMATION_SCHEMA") do `INFORMATION_SCHEMA`, se houver.

A tabela [`ROUTINES`](information-schema-routines-table.html "24.3.21 A Tabela ROUTINES do INFORMATION_SCHEMA") possui as seguintes colunas:

* `SPECIFIC_NAME`

  O nome da routine.

* `ROUTINE_CATALOG`

  O nome do catalog ao qual a routine pertence. Este valor é sempre `def`.

* `ROUTINE_SCHEMA`

  O nome do schema (Database) ao qual a routine pertence.

* `ROUTINE_NAME`

  O nome da routine.

* `ROUTINE_TYPE`

  `PROCEDURE` para stored procedures, `FUNCTION` para stored functions.

* `DATA_TYPE`

  Se a routine for uma stored function, o data type do valor de retorno. Se a routine for uma stored procedure, este valor estará vazio.

  O valor `DATA_TYPE` é apenas o nome do tipo, sem outras informações. O valor `DTD_IDENTIFIER` contém o nome do tipo e possivelmente outras informações, como a precisão ou o comprimento.

* `CHARACTER_MAXIMUM_LENGTH`

  Para valores de retorno de string de stored function, o comprimento máximo em caracteres. Se a routine for uma stored procedure, este valor é `NULL`.

* `CHARACTER_OCTET_LENGTH`

  Para valores de retorno de string de stored function, o comprimento máximo em bytes. Se a routine for uma stored procedure, este valor é `NULL`.

* `NUMERIC_PRECISION`

  Para valores de retorno numéricos de stored function, a precisão numérica. Se a routine for uma stored procedure, este valor é `NULL`.

* `NUMERIC_SCALE`

  Para valores de retorno numéricos de stored function, a escala numérica. Se a routine for uma stored procedure, este valor é `NULL`.

* `DATETIME_PRECISION`

  Para valores de retorno temporais de stored function, a precisão de segundos fracionários. Se a routine for uma stored procedure, este valor é `NULL`.

* `CHARACTER_SET_NAME`

  Para valores de retorno de string de stored function, o nome do conjunto de caracteres (character set). Se a routine for uma stored procedure, este valor é `NULL`.

* `COLLATION_NAME`

  Para valores de retorno de string de stored function, o nome da collation. Se a routine for uma stored procedure, este valor é `NULL`.

* `DTD_IDENTIFIER`

  Se a routine for uma stored function, o data type do valor de retorno. Se a routine for uma stored procedure, este valor estará vazio.

  O valor `DATA_TYPE` é apenas o nome do tipo, sem outras informações. O valor `DTD_IDENTIFIER` contém o nome do tipo e possivelmente outras informações, como a precisão ou o comprimento.

* `ROUTINE_BODY`

  A linguagem utilizada para a definição da routine. Este valor é sempre `SQL`.

* `ROUTINE_DEFINITION`

  O texto da instrução SQL executada pela routine.

* `EXTERNAL_NAME`

  Este valor é sempre `NULL`.

* `EXTERNAL_LANGUAGE`

  A linguagem da stored routine. O MySQL calcula `EXTERNAL_LANGUAGE` da seguinte forma:

  + Se `mysql.proc.language='SQL'`, `EXTERNAL_LANGUAGE` é `NULL`

  + Caso contrário, `EXTERNAL_LANGUAGE` é o que está em `mysql.proc.language`. No entanto, ainda não temos linguagens externas, então é sempre `NULL`.

* `PARAMETER_STYLE`

  Este valor é sempre `SQL`.

* `IS_DETERMINISTIC`

  `YES` ou `NO`, dependendo se a routine está definida com a característica `DETERMINISTIC`.

* `SQL_DATA_ACCESS`

  A característica de acesso a dados para a routine. O valor é um de `CONTAINS SQL`, `NO SQL`, `READS SQL DATA` ou `MODIFIES SQL DATA`.

* `SQL_PATH`

  Este valor é sempre `NULL`.

* `SECURITY_TYPE`

  A característica `SQL SECURITY` da routine. O valor é um de `DEFINER` ou `INVOKER`.

* `CREATED`

  A data e hora em que a routine foi criada. Este é um valor [`TIMESTAMP`](datetime.html "11.2.2 Os Tipos DATE, DATETIME e TIMESTAMP").

* `LAST_ALTERED`

  A data e hora em que a routine foi modificada pela última vez. Este é um valor [`TIMESTAMP`](datetime.html "11.2.2 Os Tipos DATE, DATETIME e TIMESTAMP"). Se a routine não foi modificada desde sua criação, este valor é o mesmo que o valor `CREATED`.

* `SQL_MODE`

  O SQL mode em vigor quando a routine foi criada ou alterada, e sob o qual a routine é executada. Para os valores permitidos, consulte [Seção 5.1.10, “Modos SQL do Servidor”](sql-mode.html "5.1.10 Server SQL Modes").

* `ROUTINE_COMMENT`

  O texto do comment, se a routine tiver um. Caso contrário, este valor está vazio.

* `DEFINER`

  A conta nomeada na cláusula `DEFINER` (frequentemente o usuário que criou a routine), no formato `'user_name'@'host_name'`.

* `CHARACTER_SET_CLIENT`

  O valor de sessão da variável de sistema [`character_set_client`](server-system-variables.html#sysvar_character_set_client) quando a routine foi criada.

* `COLLATION_CONNECTION`

  O valor de sessão da variável de sistema [`collation_connection`](server-system-variables.html#sysvar_collation_connection) quando a routine foi criada.

* `DATABASE_COLLATION`

  A collation do Database ao qual a routine está associada.

#### Notes

* Para visualizar informações sobre uma routine, você deve ser o usuário nomeado na cláusula `DEFINER` da routine ou ter acesso [`SELECT`](select.html "13.2.9 SELECT Statement") à tabela `mysql.proc`. Se você não tiver privilégios para a routine em si, o valor exibido para a coluna `ROUTINE_DEFINITION` será `NULL`.

* Informações sobre valores de retorno de stored function também estão disponíveis na tabela [`PARAMETERS`](information-schema-parameters-table.html "24.3.15 A Tabela PARAMETERS do INFORMATION_SCHEMA"). A linha de valor de retorno para uma stored function pode ser identificada como a linha que possui um valor `ORDINAL_POSITION` igual a 0.
