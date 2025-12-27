### 29.12.9 Tabelas de atributos de conexão do Schema de Desempenho

29.12.9.1 Tabela `session_account_connect_attrs`

29.12.9.2 Tabela `session_connect_attrs`

Os atributos de conexão são pares chave-valor que os programas de aplicação podem passar ao servidor no momento da conexão. Para aplicações baseadas na API C implementada pela biblioteca de cliente `libmysqlclient`, as funções `mysql_options()` e `mysql_options4()` definem o conjunto de atributos de conexão. Outros Conectores MySQL podem fornecer seus próprios métodos de definição de atributos.

Esses tabelas do Schema de Desempenho exibem informações sobre os atributos:

* `session_account_connect_attrs`: Atributos de conexão para a sessão atual e outras sessões associadas à conta da sessão

* `session_connect_attrs`: Atributos de conexão para todas as sessões

Além disso, eventos de conexão escritos no log de auditoria podem incluir atributos de conexão. Veja a Seção 8.4.6.4, “Formulários de arquivos de log de auditoria”.

Os nomes dos atributos que começam com um sublinhado (`_`) são reservados para uso interno e não devem ser criados por programas de aplicação. Essa convenção permite que novos atributos sejam introduzidos pelo MySQL sem colidirem com atributos de aplicação e permite que programas de aplicação definam seus próprios atributos que não colidem com atributos internos.

* Atributos de Conexão Disponíveis
* Limites de Atributos de Conexão

#### Atributos de Conexão Disponíveis

O conjunto de atributos de conexão visíveis dentro de uma conexão específica varia dependendo de fatores como sua plataforma, o Conector MySQL usado para estabelecer a conexão ou o programa cliente.

A biblioteca de cliente `libmysqlclient` define esses atributos:

* `_client_name`: O nome do cliente (`libmysql` para a biblioteca de cliente).

* `_client_version`: A versão da biblioteca de cliente.

* `_os`: O sistema operacional (por exemplo, `Linux`, `Win64`).

* `_pid`: O ID do processo do cliente.
* `_platform`: A plataforma da máquina (por exemplo, `x86_64`).

* `_thread`: O ID do thread do cliente (apenas no Windows).

Outros Conectores MySQL podem definir seus próprios atributos de conexão.

O Conector MySQL/C++ define esses atributos para aplicativos que usam X DevAPI ou X DevAPI para C:

* `_client_license`: A licença do conector (por exemplo, `GPL-2.0`).

* `_client_name`: O nome do conector (`mysql-connector-cpp`).

* `_client_version`: A versão do conector.
* `_os`: O sistema operacional (por exemplo, `Linux`, `Win64`).

* `_pid`: O ID do processo do cliente.
* `_platform`: A plataforma da máquina (por exemplo, `x86_64`).

* `_source_host`: O nome do host da máquina em que o cliente está sendo executado.

* `_thread`: O ID do thread do cliente (apenas no Windows).

O Conector MySQL/J define esses atributos:

* `_client_name`: O nome do cliente
* `_client_version`: A versão da biblioteca do cliente

* `_os`: O sistema operacional (por exemplo, `Linux`, `Win64`)

* `_client_license`: O tipo de licença do conector

* `_platform`: A plataforma da máquina (por exemplo, `x86_64`)

* `_runtime_vendor`: O fornecedor do ambiente de tempo de execução Java (JRE)

* `_runtime_version`: A versão do ambiente de tempo de execução Java (JRE)

O Conector MySQL/NET define esses atributos:

* `_client_version`: A versão da biblioteca do cliente.

* `_os`: O sistema operacional (por exemplo, `Linux`, `Win64`).

* `_pid`: O ID do processo do cliente.
* `_platform`: A plataforma da máquina (por exemplo, `x86_64`).

* `_program_name`: O nome do cliente.
* `_thread`: O ID do thread do cliente (apenas no Windows).

A implementação do Conector/Python define esses atributos; alguns valores e atributos dependem da implementação do Conector/Python (python puro ou c-ext):

* `_client_license`: O tipo de licença do conector; `GPL-2.0` ou `Comercial`. (apenas para Python puro)

* `_client_name`: Definido como `mysql-connector-python` (apenas para Python puro) ou `libmysql` (extensão C)

* `_client_version`: A versão do conector (apenas para Python puro) ou a versão da biblioteca mysqlclient (extensão C).

* `_os`: O sistema operacional com o conector (por exemplo, `Linux`, `Win64`).

* `_pid`: O identificador de processo na máquina de origem (por exemplo, `26955`)

* `_platform`: A plataforma da máquina (por exemplo, `x86_64`).

* `_source_host`: O nome do host da máquina a partir da qual o conector está se conectando.

* `_connector_version`: A versão do conector (por exemplo, `9.5.0`) (apenas para extensão C).

* `_connector_license`: O tipo de licença do conector; `GPL-2.0` ou `Comercial` (apenas para extensão C).

* `_connector_name`: Sempre definido como `mysql-connector-python` (apenas para extensão C).

O PHP define atributos que dependem de como ele foi compilado:

* Compilado usando `libmysqlclient`: Os atributos padrão do `libmysqlclient`, descritos anteriormente.

* Compilado usando `mysqlnd`: Apenas o atributo `_client_name`, com o valor `mysqlnd`.

Muitos programas de cliente MySQL definem um atributo `program_name` com um valor igual ao nome do cliente. Por exemplo, **mysqladmin** e **mysqldump** definem `program_name` como `mysqladmin` e `mysqldump`, respectivamente. O MySQL Shell define `program_name` como `mysqlsh`.

Alguns programas de cliente MySQL definem atributos adicionais:

* **mysql**:

  + `os_user`: O nome do usuário do sistema operacional que está executando o programa. Disponível em sistemas Unix e Unix-like e Windows.

  + `os_sudouser`: O valor da variável de ambiente `SUDO_USER`. Disponível em sistemas Unix e Unix-like e Windows.

Os atributos de conexão `mysql` para os quais o valor está vazio não são enviados.

* **mysqlbinlog**:

+ `_client_role`: `binary_log_listener`

* Conexões de replicação:

  + `program_name`: `mysqld`

  + `_client_role`: `binary_log_listener`

  + `_client_replication_channel_name`: O nome do canal de replicação.

* Conexões do mecanismo de armazenamento `FEDERATED`:

  + `program_name`: `mysqld`

  + `_client_role`: `federated_storage`

#### Limites de atributos de conexão

Há limites sobre a quantidade de dados de atributos de conexão transmitidos do cliente para o servidor:

* Um limite fixo imposto pelo cliente antes do tempo de conexão.
* Um limite fixo imposto pelo servidor no momento da conexão.
* Um limite configurável imposto pelo Schema de Desempenho no momento da conexão.

Para conexões iniciadas usando a API C, a biblioteca `libmysqlclient` impõe um limite de 64KB no tamanho agregado dos dados de atributos de conexão no lado do cliente: Chamadas a `mysql_options()` que causam o excedente desse limite produzem um erro `CR_INVALID_PARAMETER_NO`. Outros Conectores MySQL podem impor seus próprios limites no lado do cliente sobre quanto dados de atributos de conexão podem ser transmitidos ao servidor.

No lado do servidor, esses verificações de tamanho nos dados de atributos de conexão ocorrem:

* O servidor impõe um limite de 64KB no tamanho agregado dos dados de atributos de conexão que aceita. Se um cliente tentar enviar mais de 64KB de dados de atributos, o servidor rejeita a conexão. Caso contrário, o servidor considera o buffer de atributos válido e rastreia o tamanho do buffer mais longo desse tipo na variável de status `Performance_schema_session_connect_attrs_longest_seen`.

* Para conexões aceitas, o Schema de Desempenho verifica o tamanho agregado dos atributos contra o valor da variável de sistema `performance_schema_session_connect_attrs_size`. Se o tamanho do atributo exceder esse valor, essas ações ocorrem:

+ O Schema de Desempenho trunca os dados dos atributos e incrementa a variável `Performance_schema_session_connect_attrs_lost`, que indica o número de conexões para as quais ocorreu a truncagem de atributos.

+ O Schema de Desempenho escreve uma mensagem no log de erro se a variável de sistema `log_error_verbosity` for maior que 1:

    ```
    Connection attributes of length N were truncated
    (N bytes lost)
    for connection N, user user_name@host_name
    (as user_name), auth: {yes|no}
    ```

    As informações na mensagem de aviso são destinadas a ajudar os administradores de banco de dados a identificar os clientes para os quais ocorreu a truncagem de atributos.

+ Um atributo `_truncated` é adicionado aos atributos de sessão com um valor que indica quantos bytes foram perdidos, se o buffer do atributo tiver espaço suficiente. Isso permite que o Schema de Desempenho exponha informações de truncagem por conexão nas tabelas de atributos de conexão. Essas informações podem ser examinadas sem precisar verificar o log de erro.