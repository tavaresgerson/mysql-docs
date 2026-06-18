### 28.3.30 A tabela Tabela de rotinas do esquema de informações

A tabela `ROUTINES` fornece informações sobre rotinas armazenadas (procedimentos armazenados e funções armazenadas). A tabela `ROUTINES` não inclui funções integradas (nativas) ou funções carregáveis.

A tabela `ROUTINES` tem essas colunas:

- `SPECIFIC_NAME`

  O nome da rotina.

- `ROUTINE_CATALOG`

  O nome do catálogo ao qual a rotina pertence. Esse valor é sempre `def`.

- `ROUTINE_SCHEMA`

  O nome do esquema (banco de dados) ao qual a rotina pertence.

- `ROUTINE_NAME`

  O nome da rotina.

- `ROUTINE_TYPE`

  `PROCEDURE` para procedimentos armazenados, `FUNCTION` para funções armazenadas.

- `DATA_TYPE`

  Se a rotina for uma função armazenada, o tipo de dados do valor de retorno. Se a rotina for um procedimento armazenado, esse valor está vazio.

  O valor `DATA_TYPE` é apenas o nome do tipo sem nenhuma outra informação. O valor `DTD_IDENTIFIER` contém o nome do tipo e, possivelmente, outras informações, como a precisão ou o comprimento.

- `CHARACTER_MAXIMUM_LENGTH`

  Para valores de retorno de strings de funções armazenadas, o comprimento máximo em caracteres. Se a rotina for um procedimento armazenado, esse valor é `NULL`.

- `CHARACTER_OCTET_LENGTH`

  Para valores de retorno de strings de funções armazenadas, o comprimento máximo em bytes. Se a rotina for um procedimento armazenado, esse valor é `NULL`.

- `NUMERIC_PRECISION`

  Para valores de retorno numéricos de funções armazenadas, a precisão numérica. Se a rotina for um procedimento armazenado, esse valor é `NULL`.

- `NUMERIC_SCALE`

  Para valores de retorno numéricos de funções armazenadas, a escala numérica. Se a rotina for um procedimento armazenado, esse valor é `NULL`.

- `DATETIME_PRECISION`

  Para valores de retorno temporais de funções armazenadas, a precisão de segundos fracionários. Se a rotina for um procedimento armazenado, esse valor é `NULL`.

- `CHARACTER_SET_NAME`

  Para valores de retorno de cadeias de caracteres de funções armazenadas, o nome do conjunto de caracteres. Se a rotina for um procedimento armazenado, esse valor é `NULL`.

- `COLLATION_NAME`

  Para valores de retorno de cadeias de caracteres de funções armazenadas, o nome da collation. Se a rotina for um procedimento armazenado, esse valor é `NULL`.

- `DTD_IDENTIFIER`

  Se a rotina for uma função armazenada, o tipo de dados do valor de retorno. Se a rotina for um procedimento armazenado, esse valor está vazio.

  O valor `DATA_TYPE` é apenas o nome do tipo sem nenhuma outra informação. O valor `DTD_IDENTIFIER` contém o nome do tipo e, possivelmente, outras informações, como a precisão ou o comprimento.

- `ROUTINE_BODY`

  A linguagem usada para a definição de rotina. Esse valor é sempre `SQL`.

- `ROUTINE_DEFINITION`

  O texto da instrução SQL executada pela rotina.

- `EXTERNAL_NAME`

  Esse valor é sempre `NULL`.

- `EXTERNAL_LANGUAGE`

  A linguagem da rotina armazenada. O valor é lido da coluna `external_language` da tabela do dicionário de dados `mysql.routines`.

- `PARAMETER_STYLE`

  Esse valor é sempre `SQL`.

- `IS_DETERMINISTIC`

  `YES` ou `NO`, dependendo se a rotina é definida com a característica `DETERMINISTIC`.

- `SQL_DATA_ACCESS`

  A característica de acesso aos dados para a rotina. O valor é um dos `CONTAINS SQL`, `NO SQL`, `READS SQL DATA` ou `MODIFIES SQL DATA`.

- `SQL_PATH`

  Esse valor é sempre `NULL`.

- `SECURITY_TYPE`

  A rotina `SQL SECURITY` característica. O valor é um dos `DEFINER` ou `INVOKER`.

- `CREATED`

  A data e a hora em que a rotina foi criada. Este é um valor `TIMESTAMP`.

- `LAST_ALTERED`

  A data e a hora em que a rotina foi modificada pela última vez. Este é um valor `TIMESTAMP`. Se a rotina não foi modificada desde sua criação, este valor é o mesmo que o valor `CREATED`.

- `SQL_MODE`

  O modo SQL em vigor quando a rotina foi criada ou alterada, e sob o qual a rotina é executada. Para os valores permitidos, consulte a Seção 7.1.11, “Modos SQL do Servidor”.

- `ROUTINE_COMMENT`

  O texto do comentário, se a rotina tiver um. Se não, esse valor está vazio.

- `DEFINER`

  A conta nomeada na cláusula `DEFINER` (geralmente o usuário que criou a rotina), no formato `'user_name'@'host_name'`.

- `CHARACTER_SET_CLIENT`

  O valor da sessão da variável de sistema `character_set_client` quando a rotina foi criada.

- `COLLATION_CONNECTION`

  O valor da sessão da variável de sistema `collation_connection` quando a rotina foi criada.

- `DATABASE_COLLATION`

  A agregação do banco de dados com o qual a rotina está associada.

#### Notas

- Para ver informações sobre uma rotina, você deve ser o usuário nomeado como a rotina `DEFINER`, ter o privilégio `SHOW_ROUTINE`, ter o privilégio `SELECT` no nível global ou ter os privilégios `CREATE ROUTINE`, `ALTER ROUTINE` ou `EXECUTE` concedidos em um escopo que inclua a rotina. A coluna `ROUTINE_DEFINITION` é `NULL` se você tiver apenas `CREATE ROUTINE`, `ALTER ROUTINE` ou `EXECUTE`.

- Informações sobre os valores de retorno de funções armazenadas também estão disponíveis na tabela `PARAMETERS`. A linha de valor de retorno para uma função armazenada pode ser identificada como a linha que tem um valor `ORDINAL_POSITION` de 0.
