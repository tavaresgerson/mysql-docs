### 24.3.15 A tabela INFORMATION\_SCHEMA PARAMETERS

A tabela `PARAMETERS` fornece informações sobre os parâmetros para rotinas armazenadas (procedimentos armazenados e funções armazenadas) e sobre os valores de retorno para funções armazenadas. A tabela `PARAMETERS` não inclui funções integradas (nativas) ou funções carregáveis. As informações dos parâmetros são semelhantes ao conteúdo da coluna `param_list` na tabela `mysql.proc`.

A tabela `PARAMETERS` tem as seguintes colunas:

- `ESPECÍFICO_CATÁLOGO`

  O nome do catálogo ao qual a rotina que contém o parâmetro pertence. Esse valor é sempre `def`.

- `ESPECÍFICO_ESQUEMA`

  O nome do esquema (banco de dados) ao qual a rotina que contém o parâmetro pertence.

- `NOME ESPECÍFICO`

  O nome da rotina que contém o parâmetro.

- `ORDINAL_POSITION`

  Para os parâmetros sucessivos de um procedimento ou função armazenada, os valores de `ORDINAL_POSITION` são 1, 2, 3 e assim por diante. Para uma função armazenada, também há uma linha que se aplica ao valor de retorno da função (como descrito pela cláusula `RETURNS`). O valor de retorno não é um parâmetro verdadeiro, então a linha que o descreve tem essas características únicas:

  - O valor `ORDINAL_POSITION` é 0.
  - Os valores `PARAMETER_NAME` e `PARAMETER_MODE` são `NULL` porque o valor de retorno não tem nome e o modo não se aplica.

- `PARAMETER_MODE`

  O modo do parâmetro. Esse valor é `IN`, `OUT` ou `INOUT`. Para um valor de retorno de função armazenada, esse valor é `NULL`.

- `NOME_PARAMETRO`

  O nome do parâmetro. Para um valor de retorno de função armazenada, esse valor é `NULL`.

- `DATA_TYPE`

  O tipo de dado do parâmetro.

  O valor `DATA_TYPE` é apenas o nome do tipo, sem nenhuma outra informação. O valor `DTD_IDENTIFIER` contém o nome do tipo e, possivelmente, outras informações, como a precisão ou o comprimento.

- `CHARACTER_MAXIMUM_LENGTH`

  Para parâmetros de string, o comprimento máximo em caracteres.

- `CHARACTER_OCTET_LENGTH`

  Para parâmetros de string, o comprimento máximo em bytes.

- `NUMERIC_PRECISION`

  Para parâmetros numéricos, a precisão numérica.

- `NUMERIC_SCALE`

  Para parâmetros numéricos, a escala numérica.

- `DATETIME_PRECISION`

  Para os parâmetros temporais, a precisão de frações de segundo.

- `CHARACTER_SET_NAME`

  Para parâmetros de cadeia de caracteres, o nome do conjunto de caracteres.

- `COLLATION_NAME`

  Para parâmetros de cadeia de caracteres, o nome da collation.

- `DTD_IDENTIFIER`

  O tipo de dado do parâmetro.

  O valor `DATA_TYPE` é apenas o nome do tipo, sem nenhuma outra informação. O valor `DTD_IDENTIFIER` contém o nome do tipo e, possivelmente, outras informações, como a precisão ou o comprimento.

- `ROUTINE_TYPE`

  `PROCEDURE` para procedimentos armazenados, `FUNCTION` para funções armazenadas.
