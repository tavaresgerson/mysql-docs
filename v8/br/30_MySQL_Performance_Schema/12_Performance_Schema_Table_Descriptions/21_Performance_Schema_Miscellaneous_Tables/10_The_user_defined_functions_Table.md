#### 29.12.21.10 Tabela user\_defined\_functions

A tabela `user_defined_functions` contém uma linha para cada função carregável registrada automaticamente por um componente ou plugin, ou manualmente por uma declaração `CREATE FUNCTION`. Para obter informações sobre operações que adicionam ou removem linhas da tabela, consulte a Seção 7.7.1, “Instalando e Desinstalando Funções Carregáveis”.

Nota

O nome da tabela `user_defined_functions` deriva da terminologia usada em sua criação para o tipo de função agora conhecido como função carregável (ou seja, função definida pelo usuário, ou UDF).

A tabela `user_defined_functions` tem essas colunas:

- `UDF_NAME`

  O nome da função conforme mencionado nas declarações SQL. O valor é `NULL` se a função foi registrada por uma declaração `CREATE FUNCTION` e está em processo de descarregamento.

- `UDF_RETURN_TYPE`

  O tipo de valor de retorno da função. O valor é um dos `int`, `decimal`, `real`, `char` ou `row`.

- `UDF_TYPE`

  O tipo de função. O valor é um dos `function` (escalar) ou `aggregate`.

- `UDF_LIBRARY`

  O nome do arquivo da biblioteca que contém o código da função executável. O arquivo está localizado no diretório nomeado pela variável de sistema `plugin_dir`. O valor é `NULL` se a função foi registrada por um componente ou plugin, em vez de por uma declaração `CREATE FUNCTION`.

- `UDF_USAGE_COUNT`

  O número atual de utilizações da função. Isso é usado para indicar se as declarações estão atualmente acessando a função.

A tabela `user_defined_functions` tem esses índices:

- Chave primária em (`UDF_NAME`)

`TRUNCATE TABLE` não é permitido para a tabela `user_defined_functions`.

A tabela do sistema `mysql.func` também lista as funções carregáveis instaladas, mas apenas aquelas instaladas usando `CREATE FUNCTION`. A tabela `user_defined_functions` lista as funções carregáveis instaladas usando `CREATE FUNCTION`, bem como as funções carregáveis instaladas automaticamente por componentes ou plugins. Essa diferença torna `user_defined_functions` preferível a `mysql.func` para verificar quais funções carregáveis estão instaladas.
