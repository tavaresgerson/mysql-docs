#### 29.12.22.12 A tabela `user_defined_functions`

A tabela `user_defined_functions` contém uma linha para cada função carregável registrada automaticamente por um componente ou plugin, ou manualmente por uma declaração `CREATE FUNCTION`. Para obter informações sobre operações que adicionam ou removem linhas da tabela, consulte a Seção 7.7.1, “Instalando e Desinstalando Funções Carregáveis”.

Nota

O nome da tabela `user_defined_functions` deriva da terminologia usada em sua criação para o tipo de função agora conhecido como função carregável (ou seja, função definida pelo usuário, ou UDF).

A tabela `user_defined_functions` tem as seguintes colunas:

* `UDF_NAME`

  O nome da função conforme referido em declarações SQL. O valor é `NULL` se a função foi registrada por uma declaração `CREATE FUNCTION` e está em processo de descarregamento.

* `UDF_RETURN_TYPE`

  O tipo do valor de retorno da função. O valor é um dos tipos `int`, `decimal`, `real`, `char` ou `row`.

* `UDF_TYPE`

  O tipo da função. O valor é um dos tipos `function` (escalar) ou `aggregate`.

* `UDF_LIBRARY`

  O nome do arquivo de biblioteca que contém o código executável da função. O arquivo está localizado no diretório nomeado pela variável de sistema `plugin_dir`. O valor é `NULL` se a função foi registrada por um componente ou plugin em vez de por uma declaração `CREATE FUNCTION`.

* `UDF_USAGE_COUNT`

  O número atual de usos da função. Isso é usado para indicar se as declarações estão atualmente acessando a função.

A tabela `user_defined_functions` tem esses índices:

* Chave primária em (`UDF_NAME`)

O `TRUNCATE TABLE` não é permitido para a tabela `user_defined_functions`.

A tabela `mysql.func` do sistema também lista as funções carregáveis instaladas, mas apenas aquelas instaladas usando `CREATE FUNCTION`. A tabela `user_defined_functions` lista as funções carregáveis instaladas usando `CREATE FUNCTION`, bem como as funções carregáveis instaladas automaticamente por componentes ou plugins. Essa diferença torna `user_defined_functions` preferível a `mysql.func` para verificar quais funções carregáveis estão instaladas.