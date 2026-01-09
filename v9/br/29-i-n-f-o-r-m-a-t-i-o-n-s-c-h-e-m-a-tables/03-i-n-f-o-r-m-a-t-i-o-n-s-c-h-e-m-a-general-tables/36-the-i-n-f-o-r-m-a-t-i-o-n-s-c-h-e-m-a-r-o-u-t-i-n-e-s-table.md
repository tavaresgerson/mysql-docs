### 28.3.36 A Tabela ROUTINES da SCHEMA_INFORMAÇÃO

A tabela `ROUTINES` fornece informações sobre rotinas armazenadas (procedimentos armazenados e funções armazenadas). A tabela `ROUTINES` não inclui funções nativas (integradas) ou funções carregáveis.

A tabela `ROUTINES` tem as seguintes colunas:

* `SPECIFIC_NAME`

  O nome da rotina.

* `ROUTINE_CATALOG`

  O nome do catálogo ao qual a rotina pertence. Esse valor é sempre `def`.

* `ROUTINE_SCHEMA`

  O nome do esquema (banco de dados) ao qual a rotina pertence.

* `ROUTINE_NAME`

  O nome da rotina.

* `ROUTINE_TYPE`

  `PROCEDURE` para procedimentos armazenados, `FUNCTION` para funções armazenadas.

* `DATA_TYPE`

  Se a rotina for uma função armazenada, o tipo de dados do valor de retorno. Se a rotina for um procedimento armazenado, esse valor está vazio.

  O valor `DATA_TYPE` é o nome do tipo sem nenhuma outra informação. O valor `DTD_IDENTIFIER` contém o nome do tipo e, possivelmente, outras informações, como a precisão ou o comprimento.

* `CHARACTER_MAXIMUM_LENGTH`

  Para valores de retorno de string de funções armazenadas, o comprimento máximo em caracteres. Se a rotina for um procedimento armazenado, esse valor é `NULL`.

* `CHARACTER_OCTET_LENGTH`

  Para valores de retorno de string de funções armazenadas, o comprimento máximo em bytes. Se a rotina for um procedimento armazenado, esse valor é `NULL`.

* `NUMERIC_PRECISION`

  Para valores de retorno numéricos de funções armazenadas, a precisão numérica. Se a rotina for um procedimento armazenado, esse valor está vazio.

* `NUMERIC_SCALE`

  Para valores de retorno numéricos de funções armazenadas, a escala numérica. Se a rotina for um procedimento armazenado, esse valor está vazio.

* `DATETIME_PRECISION`

  Para valores de retorno temporais de funções armazenadas, a precisão de frações de segundo. Se a rotina for um procedimento armazenado, esse valor está vazio.

* `NOME_SETE_CARACTERES`

  Para valores de retorno de strings de caracteres de funções armazenadas, o nome do conjunto de caracteres. Se a rotina for uma função armazenada, esse valor é `NULL`.

* `NOME_COLAION`

  Para valores de retorno de strings de caracteres de funções armazenadas, o nome da colação. Se a rotina for uma função armazenada, esse valor é `NULL`.

* `TIPO_VALOR_DE_DATA`

  Se a rotina for uma função armazenada, o tipo de dados do valor de retorno. Se a rotina for uma função armazenada, esse valor é vazio.

  O valor `DATA_TYPE` é apenas o nome do tipo sem nenhuma outra informação. O valor `DTD_IDENTIFIER` contém o nome do tipo e possivelmente outras informações, como a precisão ou o comprimento.

* `CORPO_ROUTINE`

  A linguagem usada para a definição da rotina. Esse valor é sempre `SQL`.

* `DEFINIÇÃO_ROUTINE`

  O texto da instrução SQL executada pela rotina.

* `NOME_EXTÉRNEO`

  Esse valor é sempre `NULL`.

* `LÍNGUA_EXTÉRNEO`

  A língua da rotina armazenada. O valor é lido da coluna `external_language` da tabela `mysql.routines` do dicionário de dados.

* `ESTILO_PARAMETRO`

  Esse valor é sempre `SQL`.

* `É_DETERMINÍSTICO`

  `SIM` ou `NÃO`, dependendo se a rotina é definida com a característica `DETERMINISTIC`.

* `ACESSO_DE_Dados_SQL`

  A característica de acesso de dados para a rotina. O valor é um dos `CONTAINS SQL`, `NO SQL`, `LEITURA DE DADOS SQL` ou `MODIFICAÇÃO DE DADOS SQL`.

* `PATH_SQL`

  Esse valor é sempre `NULL`.

* `TIPO_SEGURANÇA_SQL`

  A característica de segurança `SQL` da rotina. O valor é um dos `DEFINER` ou `INVOKER`.

* `CRIADO`

  A data e hora em que a rotina foi criada. Esse é um valor `TIMESTAMP`.

* `última_alterada`

A data e a hora em que a rotina foi modificada pela última vez. Este é um valor `TIMESTAMP`. Se a rotina não foi modificada desde sua criação, este valor é o mesmo que o valor `CREATED`.

* `SQL_MODE`

  O modo SQL em vigor quando a rotina foi criada ou alterada, e sob o qual a rotina é executada. Para os valores permitidos, consulte a Seção 7.1.11, “Modos SQL do Servidor”.

* `ROUTINE_COMMENT`

  O texto do comentário, se a rotina tiver um. Se não, este valor está vazio.

* `DEFINER`

  A conta nomeada na cláusula `DEFINER` (geralmente o usuário que criou a rotina), no formato `'user_name'@'host_name'`.

* `CHARACTER_SET_CLIENT`

  O valor de sessão da variável de sistema `character_set_client` quando a rotina foi criada.

* `COLLATION_CONNECTION`

  O valor de sessão da variável de sistema `collation_connection` quando a rotina foi criada.

* `DATABASE_COLLATION`

  A collation do banco de dados com o qual a rotina está associada.

#### Notas

* Para ver informações sobre uma rotina, você deve ser o usuário nomeado como o `DEFINER` da rotina, ter o privilégio `SHOW_ROUTINE`, ter o privilégio `SELECT` no nível global ou ter o privilégio `CREATE ROUTINE`, `ALTER ROUTINE` ou `EXECUTE` concedido em um escopo que inclua a rotina. A coluna `ROUTINE_DEFINITION` é `NULL` se você tiver apenas `CREATE ROUTINE`, `ALTER ROUTINE` ou `EXECUTE`.

* Informações sobre os valores de retorno de funções armazenadas também estão disponíveis na tabela `PARAMETERS`. A linha de valor de retorno de uma função armazenada pode ser identificada como a linha que tem um valor de `ORDINAL_POSITION` de 0.