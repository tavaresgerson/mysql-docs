### 6.2.13 Autenticação Pluggable

Quando um Client se conecta ao MySQL Server, o Server utiliza o nome de usuário fornecido pelo Client e o host do Client para selecionar a linha de Account apropriada na tabela de sistema `mysql.user`. O Server então autentica o Client, determinando, a partir da linha de Account, qual authentication plugin se aplica ao Client:

* Se o Server não conseguir encontrar o plugin, ocorre um erro e a tentativa de conexão é rejeitada.

* Caso contrário, o Server invoca esse plugin para autenticar o usuário, e o plugin retorna um status ao Server indicando se o usuário forneceu a senha correta e se tem permissão para conectar.

A autenticação pluggable permite estas capacidades importantes:

* **Escolha de métodos de autenticação.** A autenticação pluggable torna fácil para os DBAs escolher e mudar o método de autenticação usado para contas MySQL individuais (Accounts).

* **Autenticação externa.** A autenticação pluggable possibilita que Clients se conectem ao MySQL Server com credenciais apropriadas para métodos de autenticação que armazenam credenciais em outro lugar que não na tabela de sistema `mysql.user`. Por exemplo, plugins podem ser criados para usar métodos de autenticação externos como PAM, IDs de login do Windows, LDAP ou Kerberos.

* **Proxy users:** Se um usuário tiver permissão para conectar, um authentication plugin pode retornar ao Server um nome de usuário diferente do nome do usuário de conexão, para indicar que o usuário de conexão é um *proxy* para outro usuário (o usuário *proxied*). Enquanto a conexão durar, o *proxy user* é tratado, para fins de controle de acesso, como possuindo os Privileges do usuário *proxied*. Na prática, um usuário se passa por outro. Para mais informações, consulte [Section 6.2.14, “Proxy Users”](proxy-users.html "6.2.14 Proxy Users").

Nota

Se você iniciar o Server com a opção [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables), os authentication plugins não são usados, mesmo se carregados, porque o Server não executa nenhuma autenticação de Client e permite que qualquer Client se conecte. Como isso é inseguro, você pode querer usar [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables) em conjunto com a ativação da variável de sistema [`skip_networking`](server-system-variables.html#sysvar_skip_networking) para evitar que Clients remotos se conectem.

* [Authentication Plugins Disponíveis](pluggable-authentication.html#pluggable-authentication-available-plugins "Available Authentication Plugins")
* [Uso de Authentication Plugin](pluggable-authentication.html#pluggable-authentication-usage "Authentication Plugin Usage")
* [Restrições à Autenticação Pluggable](pluggable-authentication.html#pluggable-authentication-restrictions "Restrictions on Pluggable Authentication")

#### Authentication Plugins Disponíveis

O MySQL 5.7 fornece estes authentication plugins:

* Plugins que executam a native authentication; ou seja, autenticação baseada nos métodos de *hashing* de senha em uso antes da introdução da autenticação pluggable no MySQL. O plugin `mysql_native_password` implementa a autenticação baseada no método de *hashing* de senha nativo. O plugin `mysql_old_password` implementa a native authentication baseada no método de *hashing* de senha mais antigo (pré-4.1) (e está depreciado e foi removido no MySQL 5.7.5). Consulte [Section 6.4.1.1, “Native Pluggable Authentication”](native-pluggable-authentication.html "6.4.1.1 Native Pluggable Authentication") e [Section 6.4.1.2, “Old Native Pluggable Authentication”](old-native-pluggable-authentication.html "6.4.1.2 Old Native Pluggable Authentication").

* Plugins que executam a autenticação usando SHA-256 password hashing. Esta é uma *encryption* mais forte do que a disponível com a native authentication. Consulte [Section 6.4.1.5, “SHA-256 Pluggable Authentication”](sha256-pluggable-authentication.html "6.4.1.5 SHA-256 Pluggable Authentication") e [Section 6.4.1.4, “Caching SHA-2 Pluggable Authentication”](caching-sha2-pluggable-authentication.html "6.4.1.4 Caching SHA-2 Pluggable Authentication").

* Um plugin *client-side* que envia a senha para o Server sem *hashing* ou *encryption*. Este plugin é usado em conjunto com plugins *server-side* que requerem acesso à senha exatamente como fornecida pelo usuário Client. Consulte [Section 6.4.1.6, “Client-Side Cleartext Pluggable Authentication”](cleartext-pluggable-authentication.html "6.4.1.6 Client-Side Cleartext Pluggable Authentication").

* Um plugin que executa a autenticação externa usando PAM (Pluggable Authentication Modules), permitindo que o MySQL Server use PAM para autenticar usuários MySQL. Este plugin também suporta *proxy users*. Consulte [Section 6.4.1.7, “PAM Pluggable Authentication”](pam-pluggable-authentication.html "6.4.1.7 PAM Pluggable Authentication").

* Um plugin que executa a autenticação externa no Windows, permitindo que o MySQL Server use serviços nativos do Windows para autenticar as conexões de Client. Usuários que fizeram login no Windows podem se conectar de programas Client MySQL ao Server com base nas informações em seu ambiente sem especificar uma senha adicional. Este plugin também suporta *proxy users*. Consulte [Section 6.4.1.8, “Windows Pluggable Authentication”](windows-pluggable-authentication.html "6.4.1.8 Windows Pluggable Authentication").

* Plugins que executam a autenticação usando LDAP (Lightweight Directory Access Protocol) para autenticar usuários MySQL acessando serviços de diretório, como X.500. Estes plugins também suportam *proxy users*. Consulte [Section 6.4.1.9, “LDAP Pluggable Authentication”](ldap-pluggable-authentication.html "6.4.1.9 LDAP Pluggable Authentication").

* Um plugin que impede todas as conexões de Client a qualquer Account que o utilize. Os casos de uso para este plugin incluem Accounts *proxied* que nunca devem permitir login direto, mas são acessados apenas através de *proxy accounts*, e Accounts que devem ser capazes de executar stored programs e views com privileges elevados sem expor esses privileges a usuários comuns. Consulte [Section 6.4.1.10, “No-Login Pluggable Authentication”](no-login-pluggable-authentication.html "6.4.1.10 No-Login Pluggable Authentication").

* Um plugin que autentica Clients que se conectam a partir do host local através do Unix socket file. Consulte [Section 6.4.1.11, “Socket Peer-Credential Pluggable Authentication”](socket-pluggable-authentication.html "6.4.1.11 Socket Peer-Credential Pluggable Authentication").

* Um plugin de teste que verifica as credenciais de Account e registra sucesso ou falha no error log do Server. Este plugin é destinado a fins de teste e desenvolvimento, e como um exemplo de como escrever um authentication plugin. Consulte [Section 6.4.1.12, “Test Pluggable Authentication”](test-pluggable-authentication.html "6.4.1.12 Test Pluggable Authentication").

Nota

Para obter informações sobre as restrições atuais ao uso da autenticação pluggable, incluindo quais *connectors* suportam quais plugins, consulte [Restrictions on Pluggable Authentication](pluggable-authentication.html#pluggable-authentication-restrictions "Restrictions on Pluggable Authentication").

Desenvolvedores de *connectors* de terceiros devem ler essa seção para determinar em que medida um *connector* pode tirar proveito dos recursos de autenticação pluggable e quais passos tomar para se tornar mais compatível (*compliant*).

Se você estiver interessado em escrever seus próprios authentication plugins, consulte [Writing Authentication Plugins](/doc/extending-mysql/5.7/en/writing-authentication-plugins.html).

#### Uso de Authentication Plugin

Esta seção fornece instruções gerais para instalação e uso de authentication plugins. Para instruções específicas a um determinado plugin, consulte a seção que descreve esse plugin em [Section 6.4.1, “Authentication Plugins”](authentication-plugins.html "6.4.1 Authentication Plugins").

Em geral, a autenticação pluggable usa um par de plugins correspondentes nos lados do Server e do Client, portanto, você usa um determinado método de autenticação da seguinte forma:

* Se necessário, instale a *library* do plugin ou *libraries* contendo os plugins apropriados. No host do Server, instale a *library* contendo o plugin *server-side*, para que o Server possa usá-lo para autenticar as conexões de Client. Da mesma forma, em cada host Client, instale a *library* contendo o plugin *client-side* para uso por programas Client. Authentication plugins que são *built in* não precisam ser instalados.

* Para cada Account MySQL que você criar, especifique o plugin *server-side* apropriado a ser usado para autenticação. Se a Account for usar o authentication plugin padrão, a instrução de criação da Account não precisa especificar o plugin explicitamente. A variável de sistema [`default_authentication_plugin`](server-system-variables.html#sysvar_default_authentication_plugin) configura o authentication plugin padrão.

* Quando um Client se conecta, o plugin *server-side* informa ao programa Client qual plugin *client-side* usar para autenticação.

Caso uma Account use um método de autenticação que seja o padrão tanto para o Server quanto para o programa Client, o Server não precisa comunicar ao Client qual plugin *client-side* usar, e um *round trip* na negociação Client/Server pode ser evitado. Isso é verdadeiro para Accounts que usam a native MySQL authentication.

Para Clients MySQL padrão, como [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") e [**mysqladmin**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program"), a opção [`--default-auth=plugin_name`](mysql-command-options.html#option_mysql_default-auth) pode ser especificada na linha de comando como uma dica sobre qual plugin *client-side* o programa pode esperar usar, embora o Server se sobreponha a isso se o plugin *server-side* associado à Account de usuário exigir um plugin *client-side* diferente.

Se o programa Client não encontrar o arquivo da *library* do plugin *client-side*, especifique uma opção [`--plugin-dir=dir_name`](mysql-command-options.html#option_mysql_plugin-dir) para indicar a localização do diretório da *library* do plugin.

#### Restrições à Autenticação Pluggable

A primeira parte desta seção descreve restrições gerais sobre a aplicabilidade da estrutura de autenticação pluggable descrita em [Section 6.2.13, “Pluggable Authentication”](pluggable-authentication.html "6.2.13 Pluggable Authentication"). A segunda parte descreve como os desenvolvedores de *connectors* de terceiros podem determinar a extensão em que um *connector* pode tirar proveito dos recursos de autenticação pluggable e quais passos tomar para se tornar mais compatível (*compliant*).

O termo “native authentication” usado aqui se refere à autenticação contra senhas armazenadas na tabela de sistema `mysql.user`. Este é o mesmo método de autenticação fornecido por Servers MySQL mais antigos, antes que a autenticação pluggable fosse implementada. “Windows native authentication” refere-se à autenticação usando as credenciais de um usuário que já fez login no Windows, conforme implementado pelo Windows Native Authentication plugin (abreviado como “Windows plugin”).

##### Restrições Gerais à Autenticação Pluggable

* **Connector/C++:** Clients que usam este *connector* podem se conectar ao Server apenas por meio de Accounts que usam native authentication.

  Exceção: Um *connector* suporta autenticação pluggable se ele foi construído para fazer *link* com `libmysqlclient` dinamicamente (em vez de estaticamente) e ele carrega a versão atual de `libmysqlclient` se essa versão estiver instalada, ou se o *connector* for recompilado a partir do código-fonte para fazer *link* com a `libmysqlclient` atual.

* **Connector/NET:** Clients que usam o Connector/NET podem se conectar ao Server através de Accounts que usam native authentication ou Windows native authentication.

* **Connector/PHP:** Clients que usam este *connector* podem se conectar ao Server apenas por meio de Accounts que usam native authentication, quando compilados usando o MySQL native driver para PHP (`mysqlnd`).

* **Windows native authentication:** Conectar-se através de uma Account que usa o Windows plugin requer a configuração de um Windows Domain. Sem isso, a autenticação NTLM é usada e, nesse caso, apenas conexões locais são possíveis; ou seja, o Client e o Server devem rodar no mesmo computador.

* **Proxy users:** O suporte a *proxy user* está disponível na medida em que Clients podem se conectar através de Accounts autenticadas com plugins que implementam a capacidade de *proxy user* (ou seja, plugins que podem retornar um nome de usuário diferente daquele do usuário de conexão). Por exemplo, os plugins PAM e Windows suportam *proxy users*. Os authentication plugins `mysql_native_password` e `sha256_password` não suportam *proxy users* por padrão, mas podem ser configurados para fazê-lo; consulte [Server Support for Proxy User Mapping](proxy-users.html#proxy-users-server-user-mapping "Server Support for Proxy User Mapping").

* **Replication**: Réplicas podem empregar não apenas source accounts que usam native authentication, mas também podem se conectar através de source accounts que usam autenticação não nativa se o plugin *client-side* necessário estiver disponível. Se o plugin estiver *built into* `libmysqlclient`, ele está disponível por padrão. Caso contrário, o plugin deve ser instalado no lado da réplica no diretório nomeado pela variável de sistema [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir) da réplica.

* **Tabelas [`FEDERATED`](federated-storage-engine.html "15.8 The FEDERATED Storage Engine"):** Uma tabela [`FEDERATED`](federated-storage-engine.html "15.8 The FEDERATED Storage Engine") pode acessar a tabela remota apenas por meio de Accounts no Server remoto que usam native authentication.

##### Autenticação Pluggable e Connectors de Terceiros

Desenvolvedores de *connectors* de terceiros podem usar as seguintes diretrizes para determinar a prontidão de um *connector* para tirar proveito dos recursos de autenticação pluggable e quais passos tomar para se tornar mais compatível:

* Um *connector* existente, no qual nenhuma alteração foi feita, usa native authentication e Clients que usam o *connector* podem se conectar ao Server apenas por meio de Accounts que usam native authentication. *No entanto, você deve testar o connector em relação a uma versão recente do Server para verificar se tais conexões ainda funcionam sem problemas.*

  Exceção: Um *connector* pode funcionar com autenticação pluggable sem quaisquer alterações se ele fizer *link* com `libmysqlclient` dinamicamente (em vez de estaticamente) e carregar a versão atual de `libmysqlclient` se essa versão estiver instalada.

* Para tirar proveito dos recursos de autenticação pluggable, um *connector* baseado em `libmysqlclient` deve ser *relinked* contra a versão atual de `libmysqlclient`. Isso permite que o *connector* suporte conexões através de Accounts que exigem plugins *client-side* agora *built into* `libmysqlclient` (como o plugin *cleartext* necessário para a autenticação PAM e o plugin Windows necessário para a Windows native authentication). Fazer *link* com uma `libmysqlclient` atual também permite que o *connector* acesse plugins *client-side* instalados no diretório de plugin MySQL padrão (tipicamente o diretório nomeado pelo valor padrão da variável de sistema [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir) do Server local).

  Se um *connector* faz *link* com `libmysqlclient` dinamicamente, deve-se garantir que a versão mais recente de `libmysqlclient` esteja instalada no host Client e que o *connector* a carregue em tempo de execução.

* Outra maneira de um *connector* suportar um determinado método de autenticação é implementá-lo diretamente no protocolo Client/Server. O Connector/NET usa essa abordagem para fornecer suporte à Windows native authentication.

* Se um *connector* deve ser capaz de carregar plugins *client-side* de um diretório diferente do diretório de plugin padrão, ele deve implementar algum meio para os usuários Client especificarem o diretório. As possibilidades para isso incluem uma opção de linha de comando ou variável de ambiente a partir da qual o *connector* pode obter o nome do diretório. Programas Client MySQL padrão, como [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") e [**mysqladmin**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program"), implementam a opção `--plugin-dir`. Consulte também [C API Client Plugin Interface](/doc/c-api/5.7/en/c-api-plugin-interface.html).

* O suporte a *proxy user* por um *connector* depende, conforme descrito anteriormente nesta seção, se os métodos de autenticação que ele suporta permitem *proxy users*.