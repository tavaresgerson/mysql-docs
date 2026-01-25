#### 2.3.3.5 Referência do Console do MySQL Installer

**MySQLInstallerConsole.exe** fornece funcionalidade de linha de comando semelhante ao MySQL Installer. Esta referência inclui:

* Nomes de Produtos MySQL
* Sintaxe de Comando
* Ações de Comando

O console é instalado quando o MySQL Installer é executado inicialmente e fica disponível no diretório `MySQL Installer for Windows`. Por padrão, a localização do diretório é `C:\Program Files (x86)\MySQL\MySQL Installer for Windows`. Você deve executar o console como administrador.

Para usar o console:

1. Abra um prompt de comando com privilégios administrativos selecionando "Sistema Windows" (Windows System) no Menu Iniciar, clique com o botão direito em "Prompt de Comando" (Command Prompt), selecione "Mais" (More) e selecione "Executar como administrador" (Run as administrator).

2. Na linha de comando, opcionalmente, altere o diretório para onde o comando **MySQLInstallerConsole.exe** está localizado. Por exemplo, para usar o local de instalação padrão:

   ```sql
   cd Program Files (x86)\MySQL\MySQL Installer for Windows
   ```

3. Digite `MySQLInstallerConsole.exe` (ou `mysqlinstallerconsole`) seguido por uma ação de comando para executar uma tarefa. Por exemplo, para mostrar a ajuda do console:

   ```sql
   MySQLInstallerConsole.exe --help
   ```

   ```sql
   =================== Start Initialization ===================
   MySQL Installer is running in Community mode

   Attempting to update manifest.
   Initializing product requirements.
   Loading product catalog.
   Checking for product packages in the bundle.
   Categorizing product catalog.
   Finding all installed packages.
   Your product catalog was last updated at 23/08/2022 12:41:05 p. m.
   Your product catalog has version number 671.
   =================== End Initialization ===================

   The following actions are available:

   Configure - Configures one or more of your installed programs.
   Help      - Provides list of available command actions.
   Install   - Installs and configures one or more available MySQL programs.
   List      - Lists all available MySQL products.
   Modify    - Modifies the features of installed products.
   Remove    - Removes one or more products from your system.
   Set       - Configures the general options of MySQL Installer.
   Status    - Shows the status of all installed products.
   Update    - Updates the current product catalog.
   Upgrade   - Upgrades one or more of your installed programs.

   The basic syntax for using MySQL Installer command actions. Brackets denote optional entities.
   Curly braces denote a list of possible entities.

   ...
   ```

##### Nomes de Produtos MySQL

Muitas das ações de comando do **MySQLInstallerConsole** aceitam uma ou mais frases abreviadas que podem corresponder a um produto MySQL (ou produtos) no catálogo. O conjunto atual de frases curtas válidas para uso com comandos é mostrado na tabela a seguir.

Nota

A partir do MySQL Installer 1.6.7 (8.0.34), as opções de comando `install`, `list` e `upgrade` não se aplicam mais ao MySQL for Visual Studio (agora EOL), MySQL Connector/NET, MySQL Connector/ODBC, MySQL Connector/C++, MySQL Connector/Python e MySQL Connector/J. Para instalar Conectores MySQL mais novos, visite https://dev.mysql.com/downloads/.

**Tabela 2.6 Frases de Produtos MySQL para uso com o comando MySQLInstallerConsole.exe**

<table><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Frase</th> <th>Produto MySQL</th> </tr></thead><tr> <td><code>server</code></td> <td>MySQL Server</td> </tr><tr> <td><code>workbench</code></td> <td>MySQL Workbench</td> </tr><tr> <td><code>shell</code></td> <td>MySQL Shell</td> </tr><tr> <td><code>visual</code></td> <td>MySQL for Visual Studio</td> </tr><tr> <td><code>router</code></td> <td>MySQL Router</td> </tr><tr> <td><code>backup</code></td> <td>MySQL Enterprise Backup (requer a versão comercial)</td> </tr><tr> <td><code>net</code></td> <td>MySQL Connector/NET</td> </tr><tr> <td><code>odbc</code></td> <td>MySQL Connector/ODBC</td> </tr><tr> <td><code>c++</code></td> <td>MySQL Connector/C++</td> </tr><tr> <td><code>python</code></td> <td>MySQL Connector/Python</td> </tr><tr> <td><code>j</code></td> <td>MySQL Connector/J</td> </tr><tr> <td><code>documentation</code></td> <td>Documentação do MySQL Server</td> </tr><tr> <td><code>samples</code></td> <td>Exemplos MySQL (databases sakila e world)</td> </tr></table>

##### Sintaxe de Comando

O comando **MySQLInstallerConsole.exe** pode ser emitido com ou sem a extensão de arquivo (`.exe`) e o comando não diferencia maiúsculas de minúsculas (case-sensitive).

`mysqlinstallerconsole`[`.exe`] [`--`]*`action`*] [*`action_blocks_list`*] [*`options_list`*

Descrição:

`action` : Uma das ações operacionais permitidas. Se omitida, a ação padrão é equivalente à ação `--status`. O uso do prefixo `--` é opcional para todas as ações.

    As ações possíveis são: [--]`configure`, [--]`help`, [--]`install`, [--]`list`, [--]`modify`, [--]`remove`, [--]`set`, [--]`status`, [--]`update` e [--]`upgrade`.

`action_blocks_list` : Uma lista de blocos nos quais cada um representa um item diferente, dependendo da ação selecionada. Os blocos são separados por vírgulas.

    As ações `--remove` e `--upgrade` permitem especificar um asterisco (`*`) para indicar todos os produtos. Se o caractere `*` for detectado no início deste bloco, presume-se que todos os produtos devem ser processados e o restante do bloco é ignorado.

    Sintaxe: `*|action_block[,action_block][,action_block]...`

    *`action_block`*: Contém um seletor de produto seguido por um número indefinido de blocos de argumento que se comportam de maneira diferente dependendo da ação selecionada (veja Ações de Comando).

`options_list` : Zero ou mais opções com possíveis valores separados por espaços. Veja Ações de Comando para identificar as opções permitidas para a ação correspondente.

    Sintaxe: `option_value_pair[ option_value_pair][ option_value_pair]...`

    *`option_value_pair`*: Uma única opção (por exemplo, `--silent`) ou uma tupla de uma chave e um valor correspondente com um prefixo de opções. O par chave-valor está no formato de `--key[=value]`.

##### Ações de Comando

**MySQLInstallerConsole.exe** suporta as seguintes ações de comando:

Nota

Os valores do bloco de configuração (ou arguments_block) que contêm o caractere de dois pontos (`:`) devem ser envolvidos por aspas. Por exemplo, `install_dir="C:\MySQL\MySQL Server 8.0"`.

* `[--]configure [product1]:[configuration_argument]=[value], [product2]:[configuration_argument]=[value], [...]`

  Configura um ou mais produtos MySQL no seu sistema. Múltiplos pares *`configuration_argument`*=*`value`* podem ser configurados para cada produto.

  Opções:

  `--continue` : Continua processando o próximo produto quando um erro é capturado durante o processamento dos blocos de ação que contêm argumentos para cada produto. Se não for especificado, toda a operação é abortada em caso de erro.

  `--help` : Mostra as opções e argumentos disponíveis para a ação correspondente. Se presente, a ação não é executada, apenas a ajuda é mostrada, de modo que outras opções relacionadas à ação também são ignoradas.

  `--show-settings` : Exibe as opções disponíveis para o produto selecionado, passando o nome do produto após `--show-settings`.

  `--silent` : Desabilita prompts de confirmação.

  Exemplos:

  ```sql
  MySQLInstallerConsole --configure --show-settings server
  ```

  ```sql
  mysqlinstallerconsole.exe --configure server:port=3307
  ```

* `[--]help`

  Exibe uma mensagem de ajuda com exemplos de uso e, em seguida, sai. Passe uma ação de comando adicional para receber ajuda específica sobre essa ação.

  Opções:

  `--action=[action]` : Mostra a ajuda para uma ação específica. É o mesmo que usar a opção `--help` com uma ação.

      Os valores permitidos são: `all`, `configure`, `help` (padrão), `install`, `list`, `modify`, `remove`, `status`, `update`, `upgrade` e `set`.

  `--help` : Mostra as opções e argumentos disponíveis para a ação correspondente. Se presente, a ação não é executada, apenas a ajuda é mostrada, de modo que outras opções relacionadas à ação também são ignoradas.

  Exemplos:

  ```sql
  MySQLInstallerConsole help
  ```

  ```sql
  MySQLInstallerConsole help --action=install
  ```

* `[--]install [product1]:[features]:[config block]:[config block], [product2]:[config block], [...]`

  Instala um ou mais produtos MySQL no seu sistema. Se produtos de pré-lançamento (pre-release) estiverem disponíveis, produtos GA e de pré-lançamento são instalados quando o valor da opção `--type` for `Client` ou `Full`. Use a opção `--only_ga_products` para restringir o conjunto de produtos apenas aos produtos GA ao usar esses tipos de setup.

  Descrição:

  `[product]` : Cada produto pode ser especificado por uma frase de produto com ou sem um qualificador de versão separado por ponto e vírgula. Passar uma palavra-chave de produto sozinha seleciona a versão mais recente do produto. Se múltiplas architectures estiverem disponíveis para essa versão do produto, o comando retorna a primeira na lista de manifestos para confirmação interativa. Alternativamente, você pode passar a versão e a architecture exatas (`x86` ou `x64`) após a palavra-chave do produto usando a opção `--silent`.

  `[features]` : Todos os features associados a um produto MySQL são instalados por padrão. O bloco de features é uma lista de features separada por ponto e vírgula ou um asterisco (`*`) que seleciona todos os features. Para remover um feature, use o comando `modify`.

  `[config block]` : Um ou mais blocos de configuração podem ser especificados. Cada bloco de configuração é uma lista de pares chave-valor separada por ponto e vírgula. Um bloco pode incluir uma chave do tipo `config` ou `user`; `config` é o tipo padrão se um não for definido.

      Os valores do bloco de configuração que contêm o caractere de dois pontos (`:`) devem ser envolvidos por aspas. Por exemplo, `installdir="C:\MySQL\MySQL Server 8.0"`. Apenas um bloco de tipo de configuração pode ser definido para cada produto. Um bloco `user` deve ser definido para cada usuário a ser criado durante a instalação do produto.

      Nota

      A chave do tipo `user` não é suportada quando um produto está sendo reconfigurado.

  Opções:

  `--auto-handle-prereqs` : Se presente, o MySQL Installer tenta baixar e instalar alguns pré-requisitos de software, não presentes atualmente, que podem ser resolvidos com intervenção mínima. Se a opção `--silent` não estiver presente, serão apresentadas páginas de instalação para cada pré-requisito. Se a opção `--auto-handle-prereqs` for omitida, pacotes com pré-requisitos ausentes não serão instalados.

  `--continue` : Continua processando o próximo produto quando um erro é capturado durante o processamento dos blocos de ação que contêm argumentos para cada produto. Se não for especificado, toda a operação é abortada em caso de erro.

  `--help` : Mostra as opções e argumentos disponíveis para a ação correspondente. Se presente, a ação não é executada, apenas a ajuda é mostrada, de modo que outras opções relacionadas à ação também são ignoradas.

  `--mos-password=password` : Define a senha do usuário My Oracle Support (MOS) para versões comerciais do MySQL Installer.

  `--mos-user=user_name` : Especifica o nome de usuário My Oracle Support (MOS) para acesso à versão comercial do MySQL Installer. Se não estiver presente, apenas os produtos no bundle, se houver, estarão disponíveis para instalação.

  `--only-ga-products` : Restringe o conjunto de produtos para incluir apenas produtos GA.

  `--setup-type=setup_type` : Instala um conjunto predefinido de software. O tipo de setup pode ser um dos seguintes:

      + `Server`: Instala um único MySQL Server

      + `Client`: Instala programas client e bibliotecas (exclui MySQL Connectors)

      + `Full`: Instala tudo (exclui MySQL Connectors)

      + `Custom`: Instala produtos selecionados pelo usuário. Esta é a opção padrão.

      Nota

      Tipos de setup não-customizados são válidos apenas quando nenhum outro produto MySQL está instalado.

  `--show-settings` : Exibe as opções disponíveis para o produto selecionado, passando o nome do produto após `--show-settings`.

  `--silent` : Desabilita prompts de confirmação.

  Exemplos:

  ```sql
  mysqlinstallerconsole.exe --install j;8.0.29, net;8.0.28 --silent
  ```

  ```sql
  MySQLInstallerConsole install server;8.0.30:*:port=3307;server_id=2:type=user;user=foo
  ```

  Um exemplo que passa blocos de configuração adicionais, separados por `^` para caber:

  ```sql
  MySQLInstallerConsole --install server;8.0.30;x64:*:type=config;open_win_firewall=true; ^
     general_log=true;bin_log=true;server_id=3306;tcp_ip=true;port=3306;root_passwd=pass; ^
     install_dir="C:\MySQL\MySQL Server 8.0":type=user;user_name=foo;password=bar;role=DBManager
  ```

* `[--]list`

  Quando esta ação é usada sem opções, ela ativa uma lista interativa a partir da qual todos os produtos MySQL disponíveis podem ser pesquisados. Digite `MySQLInstallerConsole --list` e especifique uma substring para pesquisar.

  Opções:

  `--all` : Lista todos os produtos disponíveis. Se esta opção for usada, todas as outras opções são ignoradas.

  `--arch=architecture` : Lista que contém a architecture especificada. Os valores permitidos são: `x86`, `x64` e `any` (padrão). Esta opção pode ser combinada com as opções `--name` e `--version`.

  `--help` : Mostra as opções e argumentos disponíveis para a ação correspondente. Se presente, a ação não é executada, apenas a ajuda é mostrada, de modo que outras opções relacionadas à ação também são ignoradas.

  `--name=package_name` : Lista produtos que contêm o nome especificado (veja frase do produto). Esta opção pode ser combinada com as opções `--version` e `--arch`.

  `--version=version` : Lista produtos que contêm a versão especificada, como 8.0 ou 5.7. Esta opção pode ser combinada com as opções `--name` e `--arch`.

  Exemplos:

  ```sql
  MySQLInstallerConsole --list --name=net --version=8.0
  ```

* `[--]modify [product1:-removelist|+addlist], [product2:-removelist|+addlist] [...]`

  Modifica ou exibe os features de um produto MySQL instalado anteriormente. Para exibir os features de um produto, anexe a palavra-chave do produto ao comando, por exemplo:

  ```sql
  MySQLInstallerConsole --modify server
  ```

  Opções:

  `--help` : Mostra as opções e argumentos disponíveis para a ação correspondente. Se presente, a ação não é executada, apenas a ajuda é mostrada, de modo que outras opções relacionadas à ação também são ignoradas.

  `--silent` : Desabilita prompts de confirmação.

  Exemplos:

  ```sql
  MySQLInstallerConsole --modify server:+documentation
  ```

  ```sql
  MySQLInstallerConsole modify server:-debug
  ```

* `[--]remove [product1], [product2] [...]`

  Remove um ou mais produtos do seu sistema. Um asterisco (`*`) pode ser passado para remover todos os produtos MySQL com um único comando.

  Opções:

  `--continue` : Continua a operação mesmo que ocorra um erro.

  `--help` : Mostra as opções e argumentos disponíveis para a ação correspondente. Se presente, a ação não é executada, apenas a ajuda é mostrada, de modo que outras opções relacionadas à ação também são ignoradas.

  `--keep-datadir` : Ignora a remoção do data directory ao remover produtos MySQL Server.

  `--silent` : Desabilita prompts de confirmação.

  Exemplos:

  ```sql
  mysqlinstallerconsole.exe remove *
  ```

  ```sql
  MySQLInstallerConsole --remove server --continue
  ```

* `[--]set`

  Define uma ou mais opções configuráveis que afetam como o programa MySQL Installer se conecta à internet e se o recurso de atualizações automáticas do catálogo de produtos está ativado.

  Opções:

  `--catalog-update=bool_value` : Habilita (`true`, padrão) ou desabilita (`false`) a atualização automática do catálogo de produtos. Esta opção requer uma conexão ativa com a internet.

  `--catalog-update-days=int_value` : Aceita um inteiro entre 1 (padrão) e 365 para indicar o número de dias entre as verificações de uma nova atualização de catálogo quando o MySQL Installer é iniciado. Se `--catalog-update` for `false`, esta opção é ignorada.

  `--connection-validation=validation_type` : Define como o MySQL Installer executa a verificação de uma conexão com a internet. Os valores permitidos são `automatic` (padrão) e `manual`.

  `--connection-validation-urls=url_list` : Uma string entre aspas duplas e separada por vírgulas que define a lista de URLs a serem usadas para verificar a conexão com a internet quando `--connection-validation` é definido como `manual`. As verificações são feitas na mesma ordem fornecida. Se a primeira URL falhar, a próxima URL na lista é usada e assim por diante.

  `--offline-mode=bool_value` : Permite que o MySQL Installer seja executado com ou sem recursos de internet. Os modos válidos são:

      + `True` para habilitar o modo offline (executar sem conexão com a internet).

      + `False` (padrão) para desabilitar o modo offline (executar com conexão com a internet). Defina este modo antes de baixar o catálogo de produtos ou quaisquer produtos a serem instalados.

  `--proxy-mode` : Especifica o modo proxy. Os modos válidos são:

      + `Automatic` para identificar automaticamente o proxy com base nas configurações do sistema.

      + `None` para garantir que nenhum proxy esteja configurado.

      + `Manual` para definir os detalhes do proxy manualmente (`--proxy-server`, `--proxy-port`, `--proxy-username`, `--proxy-password`).

  `--proxy-password` : A password usada para autenticar no proxy server.

  `--proxy-port` : A port usada para o proxy server.

  `--proxy-server` : A URL que aponta para o proxy server.

  `--proxy-username` : O user name usado para autenticar no proxy server.

  `--reset-defaults` : Redefine as opções do MySQL Installer associadas à ação `--set` para os valores padrão.

  Exemplos:

  ```sql
  MySQLIntallerConsole.exe set --reset-defaults
  ```

  ```sql
  mysqlintallerconsole.exe --set --catalog-update=false
  ```

  ```sql
  MySQLIntallerConsole --set --catalog-update-days=3
  ```

  ```sql
  mysqlintallerconsole --set --connection-validation=manual
  --connection-validation-urls="https://www.bing.com,http://www.google.com"
  ```

* `[--]status`

  Fornece uma visão geral rápida dos produtos MySQL instalados no sistema. As informações incluem nome e versão do produto, architecture, data de instalação e local de instalação (install location).

  Opções:

  `--help` : Mostra as opções e argumentos disponíveis para a ação correspondente. Se presente, a ação não é executada, apenas a ajuda é mostrada, de modo que outras opções relacionadas à ação também são ignoradas.

  Exemplos:

  ```sql
  MySQLInstallerConsole status
  ```

* `[--]update`

  Baixa o catálogo de produtos MySQL mais recente para o seu sistema. Em caso de sucesso, o catálogo é aplicado na próxima vez que o `MySQLInstaller` ou **MySQLInstallerConsole.exe** for executado.

  O MySQL Installer verifica automaticamente se há atualizações do catálogo de produtos quando é iniciado, caso *n* dias tenham se passado desde a última verificação. A partir do MySQL Installer 1.6.4, o valor padrão é 1 dia. Anteriormente, o valor padrão era 7 dias.

  Opções:

  `--help` : Mostra as opções e argumentos disponíveis para a ação correspondente. Se presente, a ação não é executada, apenas a ajuda é mostrada, de modo que outras opções relacionadas à ação também são ignoradas.

  Exemplos:

  ```sql
  MySQLInstallerConsole update
  ```

* `[--]upgrade [product1:version], [product2:version] [...]`

  Atualiza um ou mais produtos no seu sistema. Os seguintes caracteres são permitidos para esta ação:

  `*` : Passe `*` para atualizar todos os produtos para a versão mais recente, ou passe produtos específicos.

  `!` : Passe `!` como um número de versão para atualizar o produto MySQL para sua versão mais recente.

  Opções:

  `--continue` : Continua a operação mesmo que ocorra um erro.

  `--help` : Mostra as opções e argumentos disponíveis para a ação correspondente. Se presente, a ação não é executada, apenas a ajuda é mostrada, de modo que outras opções relacionadas à ação também são ignoradas.

  `--mos-password=password` : Define a password do usuário My Oracle Support (MOS) para versões comerciais do MySQL Installer.

  `--mos-user=user_name` : Especifica o user name My Oracle Support (MOS) para acesso à versão comercial do MySQL Installer. Se não estiver presente, apenas os produtos no bundle, se houver, estarão disponíveis para instalação.

  `--silent` : Desabilita prompts de confirmação.

  Exemplos:

  ```sql
  MySQLInstallerConsole upgrade *
  ```

  ```sql
  MySQLInstallerConsole upgrade workbench:8.0.31
  ```

  ```sql
  MySQLInstallerConsole upgrade workbench:!
  ```

  ```sql
  MySQLInstallerConsole --upgrade server;8.0.30:!, j;8.0.29:!
  ```
