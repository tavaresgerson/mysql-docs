### 25.12.9 Tabelas de atributos de conexão do esquema de desempenho

25.12.9.1 Tabela session_account_connect_attrs

25.12.9.2 Tabela session_connect_attrs

Os atributos de conexão são pares chave-valor que os programas de aplicação podem passar ao servidor no momento da conexão. Para aplicações baseadas na API C implementada pela biblioteca de cliente `libmysqlclient`, as funções `mysql_options()` e `mysql_options4()` definem o conjunto de atributos de conexão. Outros Conectores MySQL podem fornecer seus próprios métodos de definição de atributos.

Essas tabelas do Schema de Desempenho exibem informações de atributos:

- `session_account_connect_attrs`: Atributos de conexão para a sessão atual e outras sessões associadas à conta de sessão

- `session_connect_attrs`: Atributos de conexão para todas as sessões

Os nomes de atributos que começam com um sublinhado (`_`) são reservados para uso interno e não devem ser criados por programas de aplicação. Essa convenção permite que novos atributos sejam introduzidos pelo MySQL sem colidirem com atributos de aplicação e permite que programas de aplicação definam seus próprios atributos que não colidem com atributos internos.

- Atributos de conexão disponíveis
- Limites de atributos de conexão

#### Atributos de Conexão Disponíveis

O conjunto de atributos de conexão visíveis dentro de uma conexão específica varia dependendo de fatores como sua plataforma, o Conector MySQL usado para estabelecer a conexão ou o programa cliente.

A biblioteca de clientes `libmysqlclient` define esses atributos:

- `_client_name`: O nome do cliente (`libmysql` para a biblioteca do cliente).

- `_client_version`: A versão da biblioteca do cliente.

- _os: O sistema operacional (por exemplo, `Linux`, `Win64`).

- `_pid`: O ID do processo do cliente.

- _platform: A plataforma da máquina (por exemplo, `x86_64`).

- _thread: O ID do thread do cliente (apenas no Windows).

Outros Conectores MySQL podem definir seus próprios atributos de conexão.

O MySQL Connector/J define esses atributos:

- _client_license: O tipo de licença do conector.

- _runtime_vendor: O fornecedor do ambiente de execução Java (JRE).

- `_runtime_version`: A versão do ambiente de execução Java (JRE).

O MySQL Connector/NET define esses atributos:

- `_client_version`: A versão da biblioteca do cliente.

- _os: O sistema operacional (por exemplo, `Linux`, `Win64`).

- `_pid`: O ID do processo do cliente.

- _platform: A plataforma da máquina (por exemplo, `x86_64`).

- `_program_name`: O nome do cliente.

- _thread: O ID do thread do cliente (apenas no Windows).

O PHP define atributos que dependem de como ele foi compilado:

- Compilado usando `libmysqlclient`: Os atributos padrão do `libmysqlclient`, descritos anteriormente.

- Compilado usando `mysqlnd`: Apenas o atributo `_client_name`, com um valor de `mysqlnd`.

Muitos programas clientes do MySQL definem um atributo `program_name` com um valor igual ao nome do cliente. Por exemplo, **mysqladmin** e **mysqldump** definem `program_name` como `mysqladmin` e `mysqldump`, respectivamente.

Alguns programas clientes do MySQL definem atributos adicionais:

- **mysqlbinlog**:

  - `_client_role`: `binary_log_listener`

- Conexões de réplica:

  - `program_name`: `mysqld`

  - `_client_role`: `binary_log_listener`

  - `_client_replication_channel_name`: O nome do canal.

- Conexões do mecanismo de armazenamento `FEDERATED` (federated-storage-engine.html):

  - `program_name`: `mysqld`

  - `_client_role`: `armazenamento_federado`

#### Conexão Limites de atributo

Há limites para a quantidade de dados do atributo de conexão transmitidos do cliente para o servidor:

- Um limite fixo imposto pelo cliente antes do horário de conexão.
- Um limite fixo imposto pelo servidor no momento da conexão.
- Um limite configurável imposto pelo Schema de Desempenho no momento da conexão.

Para conexões iniciadas usando a API C, a biblioteca `libmysqlclient` impõe um limite de 64 KB no tamanho agregado dos dados do atributo de conexão no lado do cliente: Chamadas a `mysql_options()` que excederem esse limite produzem um erro `CR_INVALID_PARAMETER_NO`. Outros Conectores MySQL podem impor seus próprios limites no lado do cliente sobre o quanto os dados do atributo de conexão podem ser transmitidos ao servidor.

No lado do servidor, essas verificações de tamanho dos dados do atributo de conexão ocorrem:

- O servidor impõe um limite de 64 KB no tamanho agregado dos dados do atributo de conexão que ele pode aceitar. Se um cliente tentar enviar mais de 64 KB de dados do atributo, o servidor rejeita a conexão.

- Para conexões aceitas, o Schema de Desempenho verifica o tamanho do atributo agregado contra o valor da variável de sistema `performance_schema_session_connect_attrs_size`. Se o tamanho do atributo exceder esse valor, essas ações ocorrem:

  - O Schema de Desempenho trunca os dados do atributo e incrementa a variável de status `Performance_schema_session_connect_attrs_lost`, que indica o número de conexões para as quais ocorreu a truncagem de atributos.

  - O Schema de Desempenho escreve uma mensagem no log de erros se a variável de sistema `log_error_verbosity` for maior que 1:

    ```sql
    [Warning] Connection attributes of length N were truncated
    ```
