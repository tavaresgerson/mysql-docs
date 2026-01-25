#### 25.12.9.1 A Tabela session_account_connect_attrs

Programas de aplicação podem fornecer atributos de conexão no formato chave-valor (key-value) para serem passados ao server no momento da conexão. Para descrições de atributos comuns, consulte [Seção 25.12.9, “Performance Schema Connection Attribute Tables”](performance-schema-connection-attribute-tables.html "25.12.9 Performance Schema Connection Attribute Tables").

A tabela [`session_account_connect_attrs`](performance-schema-session-account-connect-attrs-table.html "25.12.9.1 The session_account_connect_attrs Table") contém atributos de conexão apenas para a session atual e outras sessions associadas à account da session. Para ver atributos de conexão para todas as sessions, use a tabela [`session_connect_attrs`](performance-schema-session-connect-attrs-table.html "25.12.9.2 The session_connect_attrs Table").

A tabela [`session_account_connect_attrs`](performance-schema-session-account-connect-attrs-table.html "25.12.9.1 The session_account_connect_attrs Table") possui as seguintes colunas:

* `PROCESSLIST_ID`

  O identificador de conexão para a session.

* `ATTR_NAME`

  O nome do atributo.

* `ATTR_VALUE`

  O valor do atributo.

* `ORDINAL_POSITION`

  A ordem na qual o atributo foi adicionado ao conjunto de atributos de conexão.

O comando [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") não é permitido para a tabela [`session_account_connect_attrs`](performance-schema-session-account-connect-attrs-table.html "25.12.9.1 The session_account_connect_attrs Table").