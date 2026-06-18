#### 2.3.3.5 Referência do Console do Instalador do MySQL

O **MySQLInstallerConsole.exe** oferece funcionalidades de linha de comando semelhantes às do MySQL Installer. Esta referência inclui:

- Nomes de produtos do MySQL
- Sintaxe de comando
- Ações de Comando

O console é instalado quando o Instalador do MySQL é executado pela primeira vez e, em seguida, está disponível dentro do diretório `MySQL Installer for Windows`. Por padrão, a localização do diretório é `C:\Program Files (x86)\MySQL\MySQL Installer for Windows`. Você deve executar o console como administrador.

Para usar o console:

1. Abra um prompt de comando com privilégios administrativos selecionando "Sistema do Windows" no menu Iniciar, clique com o botão direito no Prompt de Comando, selecione "Mais" e, em seguida, selecione "Executar como administrador".

2. Na linha de comando, altere, opcionalmente, o diretório para onde o comando **MySQLInstallerConsole.exe** está localizado. Por exemplo, para usar o local de instalação padrão:

   ```
   cd Program Files (x86)\MySQL\MySQL Installer for Windows
   ```

3. Digite `MySQLInstallerConsole.exe` (ou `mysqlinstallerconsole`) seguido de uma ação de comando para realizar uma tarefa. Por exemplo, para exibir a ajuda do console:

   ```
   MySQLInstallerConsole.exe --help
   ```

   ```
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

##### Nomes de produtos do MySQL

Muitas das ações do comando **MySQLInstallerConsole** aceitam uma ou mais frases abreviadas que podem corresponder a um ou mais produtos MySQL (ou produtos) no catálogo. O conjunto atual de frases curtas válidas para uso com comandos é mostrado na tabela a seguir.

Nota

A partir do MySQL Installer 1.6.7 (8.0.34), as opções de comando `install`, `list` e `upgrade` deixam de ser aplicáveis ao MySQL para o Visual Studio (agora EOL), MySQL Connector/NET, MySQL Connector/ODBC, MySQL Connector/C++, MySQL Connector/Python e MySQL Connector/J. Para instalar os novos conectores MySQL, acesse <https://dev.mysql.com/downloads/>.

**Tabela 2.6 Frases de produtos MySQL para uso com o comando MySQLInstallerConsole.exe**

<table><thead><tr> <th scope="col">Frase</th> <th scope="col">Produto MySQL</th> </tr></thead><tr> <td>[[PH_HTML_CODE_<code>j</code>]</td> <td>Servidor MySQL</td> </tr><tr> <td>[[PH_HTML_CODE_<code>j</code>]</td> <td>MySQL Workbench</td> </tr><tr> <td>[[PH_HTML_CODE_<code>samples</code>]</td> <td>MySQL Shell</td> </tr><tr> <td>[[<code>visual</code>]]</td> <td>MySQL para o Visual Studio</td> </tr><tr> <td>[[<code>router</code>]]</td> <td>MySQL Router</td> </tr><tr> <td>[[<code>backup</code>]]</td> <td>MySQL Enterprise Backup (requer a versão comercial)</td> </tr><tr> <td>[[<code>net</code>]]</td> <td>MySQL Connector/NET</td> </tr><tr> <td>[[<code>odbc</code>]]</td> <td>MySQL Connector/ODBC</td> </tr><tr> <td>[[<code>c++</code>]]</td> <td>MySQL Connector/C++</td> </tr><tr> <td>[[<code>python</code>]]</td> <td>MySQL Connector/Python</td> </tr><tr> <td>[[<code>j</code>]]</td> <td>MySQL Connector/J</td> </tr><tr> <td>[[<code>workbench</code><code>j</code>]</td> <td>Documentação do MySQL Server</td> </tr><tr> <td>[[<code>samples</code>]]</td> <td>Amostras do MySQL (bancos de dados sakila e world)</td> </tr></table>

##### Sintaxe de comando

O comando **MySQLInstallerConsole.exe** pode ser executado com ou sem a extensão de arquivo (`.exe`) e o comando não é case-sensitive.

`mysqlinstallerconsole`\[`.exe`] \[\[\[`--`]`action`] \[`action_blocks_list`] \[`options_list`]]

Descrição:

`action` :   Uma das ações operacionais permitidas. Se omitida, a ação padrão é equivalente à ação `--status`. O uso do prefixo `--` é opcional para todas as ações.

```
Possible actions are: [--]`configure`, [--]`help`, [--]`install`, [--]`list`, [--]`modify`, [--]`remove`, [--]`set`, [--]`status`, [--]`update`, and [--]`upgrade`.
```

`action_blocks_list` :   Uma lista de blocos, onde cada um representa um item diferente, dependendo da ação selecionada. Os blocos são separados por vírgulas.

```
The `--remove` and `--upgrade` actions permit specifying an asterisk character (`*`) to indicate all products. If the `*` character is detected at the start of this block, it is assumed all products are to be processed and the remainder of the block is ignored.

Syntax: `*|action_block[,action_block][,action_block]...`

*`action_block`*: Contains a product selector followed by an indefinite number of argument blocks that behave differently depending on the selected action (see Command Actions).
```

`options_list` :   Zero ou mais opções com valores possíveis separados por espaços. Veja Ações de comando para identificar as opções permitidas para a ação correspondente.

```
Syntax: `option_value_pair[ option_value_pair][ option_value_pair]...`

*`option_value_pair`*: A single option (for example, `--silent`) or a tuple of a key and a corresponding value with an options prefix. The key-value pair is in the form of `--key[=value]`.
```

##### Ações de Comando

O **MySQLInstallerConsole.exe** suporta as seguintes ações de comando:

Nota

Os valores do bloco de configuração (ou argumentos\_block) que contêm um caractere de dois pontos (`:`) devem ser envolvidos em aspas. Por exemplo, `install_dir="C:\MySQL\MySQL Server 8.0"`.

- `[--]configure [product1]:[configuration_argument]=[value], [product2]:[configuration_argument]=[value], [...]`

  Configura um ou mais produtos MySQL no seu sistema. Pode ser configurado um par `configuration_argument`=`value` para cada produto.

  Opções:

  `--continue` :   Continua processando o próximo produto quando um erro é detectado durante o processamento dos blocos de ação que contêm argumentos para cada produto. Se não for especificado, toda a operação é abortada em caso de erro.

  `--help` :   Mostra as opções e os argumentos disponíveis para a ação correspondente. Se estiver presente, a ação não é executada, apenas a ajuda é exibida, portanto, outras opções relacionadas à ação também são ignoradas.

  `--show-settings` :   Exibe as opções disponíveis para o produto selecionado, passando o nome do produto após `--show-settings`.

  `--silent` : Desabilita os prompts de confirmação.

  Exemplos:

  ```
  MySQLInstallerConsole --configure --show-settings server
  ```

  ```
  mysqlinstallerconsole.exe --configure server:port=3307
  ```

- `[--]help`

  Exibe uma mensagem de ajuda com exemplos de uso e, em seguida, sai. Insira uma ação de comando adicional para receber ajuda específica para essa ação.

  Opções:

  `--action=[action]` :   Mostra a ajuda para uma ação específica. O mesmo que usar a opção `--help` com uma ação.

  ```
  Permitted values are: `all`, `configure`, `help` (default), `install`, `list`, `modify`, `remove`, `status`, `update`, `upgrade`, and `set`.
  ```

  `--help` :   Mostra as opções e os argumentos disponíveis para a ação correspondente. Se estiver presente, a ação não é executada, apenas a ajuda é exibida, portanto, outras opções relacionadas à ação também são ignoradas.

  Exemplos:

  ```
  MySQLInstallerConsole help
  ```

  ```
  MySQLInstallerConsole help --action=install
  ```

- `[--]install [product1]:[features]:[config block]:[config block], [product2]:[config block], [...]`

  Instala um ou mais produtos MySQL no seu sistema. Se produtos pré-lançamento estiverem disponíveis, tanto os produtos GA quanto os pré-lançamento são instalados quando o valor da opção `--type` for `Client` ou `Full`. Use a opção `--only_ga_products` para restringir o conjunto de produtos apenas aos produtos GA ao usar esses tipos de configuração.

  Descrição:

  `[product]` :   Cada produto pode ser especificado por uma frase de produto com ou sem um qualificador de versão separado por ponto e vírgula. Ao passar apenas a palavra-chave do produto, o comando seleciona a versão mais recente do produto. Se houver várias arquiteturas disponíveis para essa versão do produto, o comando retorna a primeira na lista de manifest para confirmação interativa. Alternativamente, você pode passar a versão exata e a arquitetura `(x86` ou `x64`) após a palavra-chave do produto usando a opção `--silent`.

  `[features]` : Todos os recursos associados a um produto MySQL são instalados por padrão. O bloco de recursos é uma lista separada por ponto e vírgula de recursos ou um caractere asterisco (`*`) que seleciona todos os recursos. Para remover um recurso, use o comando `modify`.

  `[config block]` :   Podem ser especificados um ou mais blocos de configuração. Cada bloco de configuração é uma lista separada por ponto e vírgula de pares chave-valor. Um bloco pode incluir uma chave do tipo `config` ou `user`; `config` é o tipo padrão se uma não for definida.

  ```
  Configuration block values that contain a colon character (`:`) must be wrapped in quotation marks. For example, `installdir="C:\MySQL\MySQL Server 8.0"`. Only one configuration type block can be defined for each product. A user block should be defined for each user to be created during the product installation.

  Note

  The `user` type key is not supported when a product is being reconfigured.
  ```

  Opções:

  `--auto-handle-prereqs` :   Se presente, o Instalador do MySQL tenta baixar e instalar alguns pré-requisitos de software que atualmente não estão presentes, que podem ser resolvidos com intervenção mínima. Se a opção `--silent` não estiver presente, você será apresentado às páginas de instalação para cada pré-requisito. Se a opção `--auto-handle-prereqs` for omitida, os pacotes com pré-requisitos ausentes não serão instalados.

  `--continue` :   Continua processando o próximo produto quando um erro é detectado durante o processamento dos blocos de ação que contêm argumentos para cada produto. Se não for especificado, toda a operação é abortada em caso de erro.

  `--help` :   Mostra as opções e os argumentos disponíveis para a ação correspondente. Se estiver presente, a ação não é executada, apenas a ajuda é exibida, portanto, outras opções relacionadas à ação também são ignoradas.

  `--mos-password=password` :   Define a senha do usuário do My Oracle Support (MOS) para as versões comerciais do Instalador do MySQL.

  `--mos-user=user_name` : Especifica o nome de usuário do My Oracle Support (MOS) para acessar a versão comercial do MySQL Installer. Se não estiver presente, apenas os produtos do pacote, se houver, estarão disponíveis para instalação.

  `--only-ga-products` :   Restringe o conjunto de produtos para incluir apenas produtos GA.

  `--setup-type=setup_type` : Instala um conjunto pré-definido de software. O tipo de configuração pode ser um dos seguintes:

  ```
  + `Server`: Installs a single MySQL server

  + `Client`: Installs client programs and libraries (excludes MySQL connectors)

  + `Full`: Installs everything (excludes MySQL connectors)

  + `Custom`: Installs user-selected products. This is the default option.

  Note

  Non-custom setup types are valid only when no other MySQL products are installed.
  ```

  `--show-settings` :   Exibe as opções disponíveis para o produto selecionado, passando o nome do produto após `-showsettings`.

  `--silent` :   Desative os prompts de confirmação.

  Exemplos:

  ```
  mysqlinstallerconsole.exe --install j;8.0.29, net;8.0.28 --silent
  ```

  ```
  MySQLInstallerConsole install server;8.0.30:*:port=3307;server_id=2:type=user;user=foo
  ```

  Um exemplo que passa em blocos de configuração adicionais, separados por `^` para caber:

  ```
  MySQLInstallerConsole --install server;8.0.30;x64:*:type=config;open_win_firewall=true; ^
     general_log=true;bin_log=true;server_id=3306;tcp_ip=true;port=3306;root_passwd=pass; ^
     install_dir="C:\MySQL\MySQL Server 8.0":type=user;user_name=foo;password=bar;role=DBManager
  ```

- `[--]list`

  Quando essa ação é usada sem opções, ela ativa uma lista interativa a partir da qual todos os produtos MySQL disponíveis podem ser pesquisados. Insira `MySQLInstallerConsole --list` e especifique uma subcadeia para pesquisar.

  Opções:

  `--all` :   Lista todos os produtos disponíveis. Se esta opção for usada, todas as outras opções serão ignoradas.

  `--arch=architecture` :   Listas que contêm a arquitetura especificada. Os valores permitidos são: `x86`, `x64` e `any` (padrão). Esta opção pode ser combinada com as opções `--name` e `--version`.

  `--help` :   Mostra as opções e os argumentos disponíveis para a ação correspondente. Se estiver presente, a ação não é executada, apenas a ajuda é exibida, portanto, outras opções relacionadas à ação também são ignoradas.

  `--name=package_name` :   Lista produtos que contêm o nome especificado (ver frase do produto), Esta opção pode ser combinada com as opções `--version` e `--arch`.

  `--version=version` :   Lista os produtos que contêm a versão especificada, como 8.0 ou 5.7. Esta opção pode ser combinada com as opções `--name` e `--arch`.

  Exemplos:

  ```
  MySQLInstallerConsole --list --name=net --version=8.0
  ```

- `[--]modify [product1:-removelist|+addlist], [product2:-removelist|+addlist] [...]`

  Modifica ou exibe recursos de um produto MySQL instalado anteriormente. Para exibir os recursos de um produto, adicione a palavra-chave do produto ao comando, por exemplo:

  ```
  MySQLInstallerConsole --modify server
  ```

  Opções:

  `--help` :   Mostra as opções e os argumentos disponíveis para a ação correspondente. Se estiver presente, a ação não é executada, apenas a ajuda é exibida, portanto, outras opções relacionadas à ação também são ignoradas.

  `--silent` :   Desative os prompts de confirmação.

  Exemplos:

  ```
  MySQLInstallerConsole --modify server:+documentation
  ```

  ```
  MySQLInstallerConsole modify server:-debug
  ```

- `[--]remove [product1], [product2] [...]`

  Remove um ou mais produtos do seu sistema. Um caractere asterisco (`*`) pode ser passado para remover todos os produtos MySQL com um comando.

  Opções:

  `--continue` :   Continue a operação mesmo que ocorra um erro.

  `--help` :   Mostra as opções e os argumentos disponíveis para a ação correspondente. Se estiver presente, a ação não é executada, apenas a ajuda é exibida, portanto, outras opções relacionadas à ação também são ignoradas.

  `--keep-datadir` : Ignora a remoção do diretório de dados ao remover produtos do MySQL Server.

  `--silent` :   Desative os prompts de confirmação.

  Exemplos:

  ```
  mysqlinstallerconsole.exe remove *
  ```

  ```
  MySQLInstallerConsole --remove server --continue
  ```

- `[--]set`

  Define uma ou mais opções configuráveis que afetam a forma como o programa do Instalador do MySQL se conecta à internet e se o recurso de atualização automática do catálogo de produtos está ativado.

  Opções:

  `--catalog-update=bool_value` : Habilita (`true`, padrão) ou desabilita (`false`) a atualização automática do catálogo de produtos. Esta opção requer uma conexão ativa à internet.

  `--catalog-update-days=int_value` :   Aceita um número inteiro entre 1 (padrão) e 365 para indicar o número de dias entre as verificações de uma nova atualização do catálogo quando o Instalador do MySQL é iniciado. Se `--catalog-update` for `false`, essa opção é ignorada.

  `--connection-validation=validation_type` : Define como o Instalador do MySQL realiza a verificação de uma conexão à internet. Os valores permitidos são `automatic` (padrão) e `manual`.

  `--connection-validation-urls=url_list` : Uma string entre aspas duplas e separadas por vírgula que define a lista de URLs a serem usadas para verificar a conexão à internet quando `--connection-validation` está definido como `manual`. As verificações são feitas na mesma ordem fornecida. Se o primeiro URL falhar, o próximo URL na lista é usado e assim por diante.

  `--offline-mode=bool_value` :   Habilita o Instalador do MySQL a funcionar com ou sem capacidades de internet. Os modos válidos são:

  ```
  + `True` to enable offline mode (run without an internet connection).

  + `False` (default) to disable offline mode (run with an internet connection). Set this mode before downloading the product catalog or any products to install.
  ```

  `--proxy-mode` : Especifica o modo de proxy. Os modos válidos são:

  ```
  + `Automatic` to automatically identify the proxy based on the system settings.

  + `None` to ensure that no proxy is configured.

  + `Manual` to set the proxy details manually (`--proxy-server`, `--proxy-port`, `--proxy-username`, `--proxy-password`).
  ```

  `--proxy-password` :   A senha usada para autenticar-se no servidor proxy.

  `--proxy-port` :   O porto utilizado para o servidor proxy.

  `--proxy-server` :   O URL que aponta para o servidor proxy.

  `--proxy-username` :   O nome de usuário usado para autenticar-se no servidor proxy.

  `--reset-defaults` :   Redefine as opções do Instalador MySQL associadas à ação `--set` aos valores padrão.

  Exemplos:

  ```
  MySQLIntallerConsole.exe set --reset-defaults
  ```

  ```
  mysqlintallerconsole.exe --set --catalog-update=false
  ```

  ```
  MySQLIntallerConsole --set --catalog-update-days=3
  ```

  ```
  mysqlintallerconsole --set --connection-validation=manual
  --connection-validation-urls="https://www.bing.com,http://www.google.com"
  ```

- `[--]status`

  Fornece uma visão geral rápida dos produtos MySQL instalados no sistema. As informações incluem o nome e a versão do produto, a arquitetura, a data de instalação e o local de instalação.

  Opções:

  `--help` :   Mostra as opções e os argumentos disponíveis para a ação correspondente. Se estiver presente, a ação não é executada, apenas a ajuda é exibida, portanto, outras opções relacionadas à ação também são ignoradas.

  Exemplos:

  ```
  MySQLInstallerConsole status
  ```

- `[--]update`

  Descarrega o catálogo mais recente do produto MySQL no seu sistema. Se o processo for bem-sucedido, o catálogo será aplicado na próxima vez que o `MySQLInstaller` ou **MySQLInstallerConsole.exe** for executado.

  O Instalador do MySQL verifica automaticamente as atualizações do catálogo de produtos quando é iniciado, se `n` dias se passaram desde a última verificação. A partir do MySQL Installer 1.6.4, o valor padrão é de 1 dia. Anteriormente, o valor padrão era de 7 dias.

  Opções:

  `--help` :   Mostra as opções e os argumentos disponíveis para a ação correspondente. Se estiver presente, a ação não é executada, apenas a ajuda é exibida, portanto, outras opções relacionadas à ação também são ignoradas.

  Exemplos:

  ```
  MySQLInstallerConsole update
  ```

- `[--]upgrade [product1:version], [product2:version] [...]`

  Atualiza um ou mais produtos no seu sistema. Os seguintes caracteres são permitidos para essa ação:

  `*` :   Passe `*` para atualizar todos os produtos para a versão mais recente ou passe produtos específicos.

  `!` :   Passe `!` como um número de versão para atualizar o produto MySQL para a versão mais recente.

  Opções:

  `--continue` :   Continue a operação mesmo que ocorra um erro.

  `--help` :   Mostra as opções e os argumentos disponíveis para a ação correspondente. Se estiver presente, a ação não é executada, apenas a ajuda é exibida, portanto, outras opções relacionadas à ação também são ignoradas.

  `--mos-password=password` :   Define a senha do usuário do My Oracle Support (MOS) para as versões comerciais do Instalador do MySQL.

  `--mos-user=user_name` : Especifica o nome de usuário do My Oracle Support (MOS) para acessar a versão comercial do MySQL Installer. Se não estiver presente, apenas os produtos do pacote, se houver, estarão disponíveis para instalação.

  `--silent` :   Desative os prompts de confirmação.

  Exemplos:

  ```
  MySQLInstallerConsole upgrade *
  ```

  ```
  MySQLInstallerConsole upgrade workbench:8.0.31
  ```

  ```
  MySQLInstallerConsole upgrade workbench:!
  ```

  ```
  MySQLInstallerConsole --upgrade server;8.0.30:!, j;8.0.29:!
  ```
