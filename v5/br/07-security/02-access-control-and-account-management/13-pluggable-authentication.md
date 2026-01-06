### 6.2.13 Autenticação encaixável

Quando um cliente se conecta ao servidor MySQL, o servidor usa o nome de usuário fornecido pelo cliente e o host do cliente para selecionar a linha de conta apropriada da tabela de sistema `mysql.user`. O servidor, em seguida, autentica o cliente, determinando, a partir da linha de conta, qual plugin de autenticação se aplica ao cliente:

- Se o servidor não conseguir encontrar o plugin, ocorrerá um erro e a tentativa de conexão será rejeitada.

- Caso contrário, o servidor invoca esse plugin para autenticar o usuário, e o plugin retorna um status ao servidor, indicando se o usuário forneceu a senha correta e se está autorizado a se conectar.

A autenticação plugável permite essas capacidades importantes:

- **Escolha dos métodos de autenticação.** A autenticação plugável facilita para os administradores de banco de dados escolher e alterar o método de autenticação usado para contas individuais do MySQL.

- **Autenticação externa.** A autenticação plugável permite que os clientes se conectem ao servidor MySQL com credenciais apropriadas para métodos de autenticação que armazenam as credenciais em locais diferentes da tabela de sistema `mysql.user`. Por exemplo, plugins podem ser criados para usar métodos de autenticação externa, como PAM, IDs de login do Windows, LDAP ou Kerberos.

- **Usuários proxy:** Se um usuário tiver permissão para se conectar, um plugin de autenticação pode retornar ao servidor um nome de usuário diferente do nome do usuário que está se conectando, para indicar que o usuário que está se conectando é um proxy para outro usuário (o usuário proxy). Enquanto a conexão durar, o usuário proxy será tratado, para fins de controle de acesso, como tendo os privilégios do usuário proxy. Na verdade, um usuário assume a identidade de outro. Para mais informações, consulte Seção 6.2.14, “Usuários proxy”.

Nota

Se você iniciar o servidor com a opção `--skip-grant-tables`, os plugins de autenticação não são usados, mesmo que sejam carregados, porque o servidor não realiza autenticação de clientes e permite que qualquer cliente se conecte. Como isso é inseguro, você pode querer usar `--skip-grant-tables` em conjunto com a habilitação da variável de sistema `skip_networking` para impedir que clientes remotos se conectem.

- Plugins de autenticação disponíveis
- Uso do Plugin de Autenticação
- Restrições de Autenticação Pluggable

#### Plugins de autenticação disponíveis

O MySQL 5.7 oferece esses plugins de autenticação:

- Plugins que realizam autenticação nativa; ou seja, autenticação baseada nos métodos de hash de senha em uso antes da introdução da autenticação plugável no MySQL. O plugin `mysql_native_password` implementa a autenticação com base no método de hash de senha nativo. O plugin `mysql_old_password` implementa a autenticação nativa com base no método de hash de senha mais antigo (pré-4.1) (e é desatualizado e removido no MySQL 5.7.5). Veja Seção 6.4.1.1, “Autenticação Plugável Nativa” e Seção 6.4.1.2, “Autenticação Plugável Nativa Antiga”.

- Plugins que realizam autenticação usando hashing de senha SHA-256. Esse é um tipo de criptografia mais forte do que a disponível com a autenticação nativa. Veja Seção 6.4.1.5, “Autenticação Pluggable SHA-256” e Seção 6.4.1.4, “Cache de Autenticação Pluggable SHA-2”.

- Um plugin do lado do cliente que envia a senha para o servidor sem hash ou criptografia. Este plugin é usado em conjunto com plugins do lado do servidor que exigem acesso à senha exatamente como fornecida pelo usuário do cliente. Veja Seção 6.4.1.6, “Autenticação Pluggable de Texto Claro do Lado do Cliente”.

- Um plugin que realiza autenticação externa usando o PAM (Módulos de Autenticação Conectam-se), permitindo que o MySQL Server use o PAM para autenticar usuários do MySQL. Este plugin também suporta usuários proxy. Veja Seção 6.4.1.7, “PAM Conectam-se”.

- Um plugin que realiza autenticação externa no Windows, permitindo que o MySQL Server use serviços nativos do Windows para autenticar conexões de clientes. Usuários que estiverem conectados ao Windows podem se conectar a partir de programas clientes do MySQL ao servidor com base nas informações de seu ambiente, sem precisar especificar uma senha adicional. Esse plugin também suporta usuários proxy. Veja Seção 6.4.1.8, “Autenticação Plugável do Windows”.

- Plugins que realizam autenticação usando o LDAP (Lightweight Directory Access Protocol) para autenticar usuários do MySQL acessando serviços de diretório, como o X.500. Esses plugins também suportam usuários proxy. Veja Seção 6.4.1.9, “Autenticação Pluggable LDAP”.

- Um plugin que impede todas as conexões do cliente em qualquer conta que o utilize. Os casos de uso deste plugin incluem contas proxy que nunca devem permitir login direto, mas são acessadas apenas por meio de contas proxy e contas que devem ser capazes de executar programas e visualizações armazenadas com privilégios elevados, sem expor esses privilégios aos usuários comuns. Consulte Seção 6.4.1.10, “Autenticação Pluggable sem Login”.

- Um plugin que autentica clientes que se conectam a partir do host local através do arquivo de socket Unix. Veja Seção 6.4.1.11, “Autenticação Pluggable de Credenciais Peer-Socket”.

- Um plugin de teste que verifica as credenciais da conta e registra o sucesso ou o fracasso no log de erros do servidor. Este plugin é destinado a fins de teste e desenvolvimento, e como exemplo de como escrever um plugin de autenticação. Veja Seção 6.4.1.12, “Autenticação Pluggable de Teste”.

Nota

Para obter informações sobre as restrições atuais sobre o uso de autenticação plugável, incluindo quais conectores suportam quais plugins, consulte Restrições sobre Autenticação Plugável.

Os desenvolvedores de conectores de terceiros devem ler essa seção para determinar em que medida um conector pode aproveitar as capacidades de autenticação plugáveis e quais são as etapas a serem seguidas para se tornar mais compatível.

Se você estiver interessado em escrever seus próprios plugins de autenticação, consulte Escrevendo Plugins de Autenticação.

#### Uso do Plugin de Autenticação

Esta seção fornece instruções gerais para instalar e usar plugins de autenticação. Para instruções específicas de um plugin dado, consulte a seção que descreve esse plugin em Seção 6.4.1, “Plugins de Autenticação”.

Em geral, a autenticação plugável utiliza um par de plugins correspondentes nos lados do servidor e do cliente, então você usa um método de autenticação dado da seguinte maneira:

- Se necessário, instale a biblioteca de plugins ou as bibliotecas que contêm os plugins apropriados. No host do servidor, instale a biblioteca que contém o plugin do lado do servidor, para que o servidor possa usá-lo para autenticar as conexões do cliente. Da mesma forma, em cada host do cliente, instale a biblioteca que contém o plugin do lado do cliente para uso por programas de cliente. Os plugins de autenticação que são integrados não precisam ser instalados.

- Para cada conta do MySQL que você criar, especifique o plugin apropriado para uso no lado do servidor para autenticação. Se a conta usar o plugin de autenticação padrão, a declaração de criação da conta não precisa especificar o plugin explicitamente. A variável de sistema `default_authentication_plugin` configura o plugin de autenticação padrão.

- Quando um cliente se conecta, o plugin do lado do servidor informa ao programa do cliente qual plugin do lado do cliente deve ser usado para autenticação.

No caso de uma conta usar um método de autenticação que seja o padrão tanto para o servidor quanto para o programa cliente, o servidor não precisa comunicar ao cliente qual plugin do lado do cliente deve ser usado, e uma negociação de ida e volta no cliente/servidor pode ser evitada. Isso é verdade para contas que usam autenticação nativa MySQL.

Para clientes padrão do MySQL, como **mysql** e **mysqladmin**, a opção `--default-auth=plugin_name` pode ser especificada na linha de comando como uma dica sobre qual plugin do lado do cliente o programa pode esperar usar, embora o servidor substitua isso se o plugin do lado do servidor associado à conta do usuário exigir um plugin do lado do cliente diferente.

Se o programa cliente não encontrar o arquivo da biblioteca de plugins do lado do cliente, especifique a opção `--plugin-dir=dir_name` para indicar a localização do diretório da biblioteca de plugins.

#### Restrições sobre autenticação plugável

A primeira parte desta seção descreve as restrições gerais sobre a aplicabilidade da estrutura de autenticação plugável descrita em Seção 6.2.13, “Autenticação Plugável”. A segunda parte descreve como os desenvolvedores de conectores de terceiros podem determinar em que medida um conector pode aproveitar as capacidades de autenticação plugável e quais são as etapas a serem seguidas para se tornar mais compatível.

O termo “autenticação nativa” usado aqui se refere à autenticação contra senhas armazenadas na tabela de sistema `mysql.user`. Este é o mesmo método de autenticação fornecido por servidores MySQL mais antigos, antes que a autenticação plugável fosse implementada. “Autenticação nativa do Windows” refere-se à autenticação usando as credenciais de um usuário que já iniciou sessão no Windows, conforme implementado pelo plugin de Autenticação Nativa do Windows (“plugin do Windows” para abreviar).

- Restrições gerais de autenticação plugável
- Autenticação Pluggable e Conectores de Terceiros

##### Restrições gerais de autenticação plugáveis

- **Conectador/C++:** Os clientes que usam este conector podem se conectar ao servidor apenas por meio de contas que utilizam autenticação nativa.

  Exceção: um conector suporta autenticação plugável se foi construído para se conectar dinamicamente ao `libmysqlclient` (em vez de staticamente) e carrega a versão atual do `libmysqlclient` se essa versão estiver instalada, ou se o conector for recompilado a partir da fonte para se conectar ao `libmysqlclient` atual.

- **Connector/NET:** Os clientes que utilizam o Connector/NET podem se conectar ao servidor por meio de contas que utilizam autenticação nativa ou autenticação nativa do Windows.

- **Conectador/PHP:** Os clientes que usam este conector podem se conectar ao servidor apenas através de contas que utilizam autenticação nativa, quando compilados usando o driver nativo MySQL para PHP (`mysqlnd`).

- **Autenticação nativa do Windows:** A conexão através de uma conta que utiliza o plugin do Windows requer a configuração do domínio do Windows. Sem isso, a autenticação NTLM é usada e, então, apenas conexões locais são possíveis; ou seja, o cliente e o servidor devem estar no mesmo computador.

- **Usuários de proxy:** O suporte para usuários de proxy está disponível na medida em que os clientes podem se conectar por meio de contas autenticadas com plugins que implementam a capacidade de usuário proxy (ou seja, plugins que podem retornar um nome de usuário diferente do do usuário que está se conectando). Por exemplo, os plugins PAM e Windows suportam usuários de proxy. Os plugins de autenticação `mysql_native_password` e `sha256_password` não suportam usuários de proxy por padrão, mas podem ser configurados para isso; consulte Suporte do servidor para mapeamento de usuários de proxy.

- **Replicação**: As réplicas podem usar não apenas contas de origem com autenticação nativa, mas também se conectar através de contas de origem que usam autenticação não nativa, se o plugin necessário do lado do cliente estiver disponível. Se o plugin estiver integrado ao `libmysqlclient`, ele estará disponível por padrão. Caso contrário, o plugin deve ser instalado no lado da réplica no diretório nomeado pela variável de sistema da réplica `plugin_dir`.

- Tabelas de `FEDERATED`: Uma tabela de `FEDERATED` pode acessar a tabela remota apenas por meio de contas no servidor remoto que utilizem autenticação nativa.

##### Autenticação Conectable e Conectores de Terceiros

Os desenvolvedores de conectores de terceiros podem usar as seguintes diretrizes para determinar a prontidão de um conector para aproveitar as capacidades de autenticação plugável e quais etapas devem ser tomadas para se tornar mais compatível:

- Um conector existente que não foi modificado usa autenticação nativa e os clientes que usam o conector podem se conectar ao servidor apenas por meio de contas que usam autenticação nativa. *No entanto, você deve testar o conector contra uma versão recente do servidor para verificar se essas conexões ainda funcionam sem problemas.*

  Exceção: um conector pode funcionar com autenticação plugável sem qualquer alteração se ele se conectar ao `libmysqlclient` dinamicamente (em vez de staticamente) e carregar a versão atual do `libmysqlclient` se essa versão estiver instalada.

- Para aproveitar as capacidades de autenticação plugáveis, um conector baseado em `libmysqlclient` deve ser relinkado contra a versão atual do `libmysqlclient`. Isso permite que o conector suporte conexões através de contas que exigem plugins do lado do cliente agora integrados ao `libmysqlclient` (como o plugin em texto claro necessário para a autenticação PAM e o plugin para Windows necessário para a autenticação nativa do Windows). A vinculação com um `libmysqlclient` atual também permite que o conector acesse plugins do lado do cliente instalados no diretório padrão do plugin MySQL (tipicamente o diretório nomeado pelo valor padrão da variável de sistema `plugin_dir` do servidor local).

  Se um conector estiver vinculado dinamicamente ao `libmysqlclient`, é necessário garantir que a versão mais recente do `libmysqlclient` esteja instalada no host do cliente e que o conector o carregue em tempo de execução.

- Outra maneira de um conector suportar um método de autenticação específico é implementá-lo diretamente no protocolo cliente/servidor. O Connector/NET utiliza essa abordagem para fornecer suporte à autenticação nativa do Windows.

- Se um conector deve ser capaz de carregar plugins do lado do cliente de um diretório diferente do diretório padrão de plugins, ele deve implementar algum meio para que os usuários do cliente especifiquem o diretório. As possibilidades para isso incluem uma opção de linha de comando ou uma variável de ambiente a partir da qual o conector pode obter o nome do diretório. Programas padrão de clientes MySQL, como **mysql** e **mysqladmin**, implementam uma opção `--plugin-dir`. Veja também Interface de Plugin do Cliente da API C.

- O suporte de usuários proxy por um conector depende, conforme descrito anteriormente nesta seção, se os métodos de autenticação que ele suporta permitem usuários proxy.
