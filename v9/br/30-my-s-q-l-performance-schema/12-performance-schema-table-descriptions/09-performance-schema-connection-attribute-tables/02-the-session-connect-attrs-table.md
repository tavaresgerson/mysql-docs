#### 29.12.9.2 A tabela `session_connect_attrs`

Os programas de aplicação podem fornecer atributos de conexão de chave-valor para serem passados ao servidor no momento da conexão. Para descrições de atributos comuns, consulte a Seção 29.12.9, “Tabelas de atributos de conexão do Schema de Desempenho”.

A tabela `session_connect_attrs` contém atributos de conexão para todas as sessões. Para ver os atributos de conexão apenas para a sessão atual e outras sessões associadas à conta de sessão, use a tabela `session_account_connect_attrs`.

A tabela `session_connect_attrs` tem as seguintes colunas:

* `PROCESSLIST_ID`

  O identificador de conexão para a sessão.

* `ATTR_NAME`

  O nome do atributo.

* `ATTR_VALUE`

  O valor do atributo.

* `ORDINAL_POSITION`

  A ordem em que o atributo foi adicionado ao conjunto de atributos de conexão.

A tabela `session_connect_attrs` tem os seguintes índices:

* Chave primária em (`PROCESSLIST_ID`, `ATTR_NAME`)

O `TRUNCATE TABLE` não é permitido para a tabela `session_connect_attrs`.