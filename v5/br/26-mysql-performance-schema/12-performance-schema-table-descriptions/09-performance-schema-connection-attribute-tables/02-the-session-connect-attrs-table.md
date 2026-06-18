#### 25.12.9.2 A Tabela session_connect_attrs

Programas de aplicação podem fornecer atributos de conexão do tipo key-value para serem passados ao server no momento da conexão (connect time). Para descrições de atributos comuns, consulte Section 25.12.9, “Performance Schema Connection Attribute Tables”.

A tabela `session_connect_attrs` contém atributos de conexão para todas as sessions. Para ver atributos de conexão apenas para a session atual e outras sessions associadas à account da session, use a tabela `session_account_connect_attrs`.

A tabela `session_connect_attrs` possui estas colunas:

* `PROCESSLIST_ID`

  O identificador da conexão (connection identifier) para a session.

* `ATTR_NAME`

  O nome do atributo (attribute name).

* `ATTR_VALUE`

  O valor do atributo (attribute value).

* `ORDINAL_POSITION`

  A ordem na qual o atributo foi adicionado ao conjunto de atributos de conexão.

`TRUNCATE TABLE` não é permitido para a tabela `session_connect_attrs`.