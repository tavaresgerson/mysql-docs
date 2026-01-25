### 25.12.9 Tabelas de Atributos de Conexão do Performance Schema

[25.12.9.1 A Tabela session_account_connect_attrs](performance-schema-session-account-connect-attrs-table.html)

[25.12.9.2 A Tabela session_connect_attrs](performance-schema-session-connect-attrs-table.html)

Atributos de conexão são pares chave-valor (key-value pairs) que programas de aplicação podem passar para o server no momento da conexão (connect time). Para aplicações baseadas na C API implementada pela biblioteca cliente `libmysqlclient`, as funções [`mysql_options()`](/doc/c-api/5.7/en/mysql-options.html) e [`mysql_options4()`](/doc/c-api/5.7/en/mysql-options4.html) definem o conjunto de atributos de conexão. Outros MySQL Connectors podem fornecer seus próprios métodos de definição de atributos.

Estas tabelas do Performance Schema expõem informações de atributos:

* [`session_account_connect_attrs`](performance-schema-session-account-connect-attrs-table.html "25.12.9.1 The session_account_connect_attrs Table"): Atributos de conexão para a `session` atual e outras `sessions` associadas à conta da `session`.

* [`session_connect_attrs`](performance-schema-session-connect-attrs-table.html "25.12.9.2 The session_connect_attrs Table"): Atributos de conexão para todas as `sessions`.

Nomes de atributos que começam com um underscore (`_`) são reservados para uso interno e não devem ser criados por programas de aplicação. Esta convenção permite que novos atributos sejam introduzidos pelo MySQL sem colidir com atributos de aplicação, e permite que programas de aplicação definam seus próprios atributos que não colidam com atributos internos.

* [Atributos de Conexão Disponíveis](performance-schema-connection-attribute-tables.html#performance-schema-connection-attributes-available "Available Connection Atrributes")
* [Limites de Atributos de Conexão](performance-schema-connection-attribute-tables.html#performance-schema-connection-attribute-limits "Connection Atrribute Limits")

#### Atributos de Conexão Disponíveis

O conjunto de atributos de conexão visível em uma dada conexão varia dependendo de fatores como sua plataforma, o MySQL Connector usado para estabelecer a conexão ou o programa cliente.

A biblioteca cliente `libmysqlclient` define estes atributos:

* `_client_name`: O nome do cliente (`libmysql` para a biblioteca cliente).

* `_client_version`: A versão da biblioteca cliente.

* `_os`: O sistema operacional (por exemplo, `Linux`, `Win64`).

* `_pid`: O ID do processo cliente (process ID).
* `_platform`: A plataforma da máquina (por exemplo, `x86_64`).

* `_thread`: O ID da Thread cliente (somente Windows).

Outros MySQL Connectors podem definir seus próprios atributos de conexão.

O MySQL Connector/J define estes atributos:

* `_client_license`: O tipo de licença do Connector.

* `_runtime_vendor`: O fornecedor do ambiente de execução Java (JRE).

* `_runtime_version`: A versão do ambiente de execução Java (JRE).

O MySQL Connector/NET define estes atributos:

* `_client_version`: A versão da biblioteca cliente.

* `_os`: O sistema operacional (por exemplo, `Linux`, `Win64`).

* `_pid`: O ID do processo cliente (process ID).
* `_platform`: A plataforma da máquina (por exemplo, `x86_64`).

* `_program_name`: O nome do cliente.
* `_thread`: O ID da Thread cliente (somente Windows).

O PHP define atributos que dependem de como foi compilado:

* Compilado usando `libmysqlclient`: Os atributos padrão `libmysqlclient`, descritos anteriormente.

* Compilado usando `mysqlnd`: Apenas o atributo `_client_name`, com valor `mysqlnd`.

Muitos programas cliente MySQL definem um atributo `program_name` com um valor igual ao nome do cliente. Por exemplo, [**mysqladmin**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") e [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") definem `program_name` como `mysqladmin` e `mysqldump`, respectivamente.

Alguns programas cliente MySQL definem atributos adicionais:

* [**mysqlbinlog**](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files"):

  + `_client_role`: `binary_log_listener`

* Conexões de Replica:

  + `program_name`: `mysqld`

  + `_client_role`: `binary_log_listener`

  + `_client_replication_channel_name`: O nome do canal.

* Conexões do storage engine [`FEDERATED`](federated-storage-engine.html "15.8 The FEDERATED Storage Engine"):

  + `program_name`: `mysqld`

  + `_client_role`: `federated_storage`

#### Limites de Atributos de Conexão

Existem limites na quantidade de dados de atributos de conexão transmitidos do cliente para o server:

* Um limite fixo imposto pelo cliente antes do connect time.
* Um limite fixo imposto pelo server no connect time.
* Um limite configurável imposto pelo Performance Schema no connect time.

Para conexões iniciadas usando a C API, a biblioteca `libmysqlclient` impõe um limite de 64KB no tamanho agregado dos dados de atributos de conexão no lado cliente: Chamadas a [`mysql_options()`](/doc/c-api/5.7/en/mysql-options.html) que fazem com que este limite seja excedido produzem um erro [`CR_INVALID_PARAMETER_NO`](/doc/mysql-errors/5.7/en/client-error-reference.html#error_cr_invalid_parameter_no). Outros MySQL Connectors podem impor seus próprios limites do lado cliente sobre a quantidade de dados de atributos de conexão que pode ser transmitida ao server.

No lado do server, estas verificações de tamanho nos dados de atributos de conexão ocorrem:

* O server impõe um limite de 64KB no tamanho agregado dos dados de atributos de conexão que ele pode aceitar. Se um cliente tentar enviar mais de 64KB de dados de atributos, o server rejeita a conexão.

* Para conexões aceitas, o Performance Schema verifica o tamanho agregado do atributo em relação ao valor da variável de sistema [`performance_schema_session_connect_attrs_size`](performance-schema-system-variables.html#sysvar_performance_schema_session_connect_attrs_size). Se o tamanho do atributo exceder este valor, as seguintes ações ocorrem:

  + O Performance Schema trunca os dados do atributo e incrementa a variável de status [`Performance_schema_session_connect_attrs_lost`](performance-schema-status-variables.html#statvar_Performance_schema_session_connect_attrs_lost), que indica o número de conexões para as quais ocorreu o truncamento do atributo.

  + O Performance Schema escreve uma mensagem no error log se a variável de sistema [`log_error_verbosity`](server-system-variables.html#sysvar_log_error_verbosity) for maior que 1:

    ```sql
    [Warning] Connection attributes of length N were truncated
    ```
