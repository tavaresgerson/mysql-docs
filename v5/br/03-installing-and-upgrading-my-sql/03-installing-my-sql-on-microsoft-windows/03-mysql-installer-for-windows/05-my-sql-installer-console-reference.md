#### 2.3.3.5 Referência do Console do Instalador do MySQL

O **MySQLInstallerConsole.exe** oferece funcionalidades de linha de comando semelhantes às do MySQL Installer. Esta referência inclui:

- Nomes de produtos do MySQL
- Sintaxe de comando
- Ações de Comando

O console é instalado quando o Instalador do MySQL é executado pela primeira vez e, em seguida, está disponível no diretório `MySQL Installer para Windows`. Por padrão, a localização do diretório é `C:\Program Files (x86)\MySQL\MySQL Installer para Windows`. Você deve executar o console como administrador.

Para usar o console:

1. Abra um prompt de comando com privilégios administrativos selecionando "Sistema do Windows" no menu Iniciar, clique com o botão direito no Prompt de Comando, selecione "Mais" e, em seguida, selecione "Executar como administrador".

2. Na linha de comando, altere, opcionalmente, o diretório para onde o comando **MySQLInstallerConsole.exe** está localizado. Por exemplo, para usar o local de instalação padrão:

   ```sql
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

A partir do MySQL Installer 1.6.7 (8.0.34), as opções de comando `install`, `list` e `upgrade` deixam de ser aplicáveis ao MySQL para o Visual Studio (agora com suporte limitado), MySQL Connector/NET, MySQL Connector/ODBC, MySQL Connector/C++, MySQL Connector/Python e MySQL Connector/J. Para instalar os novos conectores MySQL, acesse <https://dev.mysql.com/downloads/>.

**Tabela 2.6 Frases de produtos MySQL para uso com o comando MySQLInstallerConsole.exe**

<table>
   <thead>
      <tr>
         <th>Frase</th>
         <th>Produto MySQL</th>
      </tr>
   </thead>
   <tr>
      <td><code>server</code></td>
      <td>MySQL Server</td>
   </tr>
   <tr>
      <td><code>workbench</code></td>
      <td>MySQL Workbench</td>
   </tr>
   <tr>
      <td><code>shell</code></td>
      <td>MySQL Shell</td>
   </tr>
   <tr>
      <td><code>visual</code></td>
      <td>MySQL for Visual Studio</td>
   </tr>
   <tr>
      <td><code>router</code></td>
      <td>MySQL Router</td>
   </tr>
   <tr>
      <td><code>backup</code></td>
      <td>MySQL Enterprise Backup (requires the commercial release)</td>
   </tr>
   <tr>
      <td><code>net</code></td>
      <td>MySQL Connector/NET</td>
   </tr>
   <tr>
      <td><code>odbc</code></td>
      <td>MySQL Connector/ODBC</td>
   </tr>
   <tr>
      <td><code>c++</code></td>
      <td>MySQL Connector/C++</td>
   </tr>
   <tr>
      <td><code>python</code></td>
      <td>MySQL Connector/Python</td>
   </tr>
   <tr>
      <td><code>j</code></td>
      <td>MySQL Connector/J</td>
   </tr>
   <tr>
      <td><code>documentation</code></td>
      <td>MySQL Server Documentation</td>
   </tr>
   <tr>
      <td><code>samples</code></td>
      <td>MySQL Samples (sakila and world databases)</td>
   </tr>
</table>

##### Sintaxe de comando

O comando **MySQLInstallerConsole.exe** pode ser executado com ou sem a extensão de arquivo (`.exe`) e o comando não é case-sensitive.

`mysqlinstallerconsole`[`.exe`] [`--`]*`ação`*] [*`lista_blocos_ação`*] [*`lista_opções`*

Descrição:

`action`: Uma das ações operacionais permitidas. Se omitida, a ação padrão é equivalente à ação `--status`. O uso do prefixo `--` é opcional para todas as ações.

```
Possible actions are: [--]`configure`, [--]`help`, [--]`install`, [--]`list`, [--]`modify`, [--]`remove`, [--]`set`, [--]`status`, [--]`update`, and [--]`upgrade`.
```

`action_blocks_list`: Uma lista de blocos, onde cada um representa um item diferente, dependendo da ação selecionada. Os blocos são separados por vírgulas.

  * As ações `--remove` e `--upgrade` permitem especificar um asterisco (`*`) para indicar todos os produtos. Se o caractere `*` for detectado no início deste bloco, presume-se que todos os produtos devem ser processados ​​e o restante do bloco é ignorado.

    Sintaxe: `*|action_block[,action_block][,action_block]...`

*`action_block`*: Contém um seletor de produto seguido por um número indefinido de blocos de argumentos que se comportam de maneira diferente dependendo da ação selecionada (consulte Ações de comando).

`options_list`: Zero ou mais opções com valores possíveis separados por espaços. Veja Ações de comando para identificar as opções permitidas para a ação correspondente.

  Sintaxe: `option_value_pair[ option_value_pair][ option_value_pair]...`

*`option_value_pair`*: Uma única opção (por exemplo, `--silent`) ou uma tupla de uma chave e um valor correspondente com um prefixo de opções. O par chave-valor tem o formato `--key[=value]`.

##### Ações de Comando

O **MySQLInstallerConsole.exe** suporta as seguintes ações de comando:

::: info Nota
Os valores do bloco de configuração (ou argumentos_block) que contêm um caractere de dois pontos (`:`) devem ser envolvidos em aspas. Por exemplo, `install_dir="C:\MySQL\MySQL Server 8.0"`.
:::


- `[--]configure [produto1]:[argumento_configuração]=[valor], [produto2]:[argumento_configuração]=[valor], [...]`

  Configura um ou mais produtos MySQL no seu sistema. Pode ser configurado um ou mais pares *`configuration_argument`*=*`value`* para cada produto.

  Opções:

  `--continue`: Continua o processamento do próximo produto quando um erro é detectado durante o processamento dos blocos de ação que contêm argumentos para cada produto. Se não for especificado, toda a operação é abortada em caso de erro.

  `--help`: Mostra as opções e argumentos disponíveis para a ação correspondente. Se estiver presente, a ação não é executada, apenas a ajuda é exibida, portanto, outras opções relacionadas à ação também são ignoradas.

  `--show-settings`: Exibe as opções disponíveis para o produto selecionado, passando o nome do produto após `--show-settings`.

  `--silent`: Desabilita os prompts de confirmação.

  Exemplos:

  ```bash
  MySQLInstallerConsole --configure --show-settings server
  ```

  ```bash
  mysqlinstallerconsole.exe --configure server:port=3307
  ```

- `[--]help`
  Exibe uma mensagem de ajuda com exemplos de uso e, em seguida, sai. Insira uma ação de comando adicional para receber ajuda específica para essa ação.

  Opções:
    `--action=[ação]`: Exibe a ajuda para uma ação específica. É o mesmo que usar a opção `--help` com uma ação.

    Os valores permitidos são: `all`, `configure`, `help` (padrão), `install`, `list`, `modify`, `remove`, `status`, `update`, `upgrade` e `set`.
  
  * `--help`:  Mostra as opções e argumentos disponíveis para a ação correspondente. Se estiver presente, a ação não é executada, apenas a ajuda é exibida, portanto, outras opções relacionadas à ação também são ignoradas.

  Exemplos:

  ```sql
  MySQLInstallerConsole help
  ```

  ```sql
  MySQLInstallerConsole help --action=install
  ```

- `[--]install [product1]:[features]:[config block]:[config block], [product2]:[config block], [...]`

  Instala um ou mais produtos MySQL no seu sistema. Se estiverem disponíveis produtos pré-lançamento, tanto os produtos GA quanto os pré-lançamento são instalados quando o valor da opção `--type` for `Client` ou `Full`. Use a opção `--only_ga_products` para restringir o conjunto de produtos apenas aos produtos GA ao usar esses tipos de configuração.

  Descrição:

    * `[product]` : Cada produto pode ser especificado por uma frase de produto com ou sem um qualificador de versão separado por ponto e vírgula. Ao passar apenas a palavra-chave `product`, o comando seleciona a versão mais recente do produto. Se houver várias arquiteturas disponíveis para essa versão do produto, o comando retorna a primeira na lista de manifestas para confirmação interativa. Alternativamente, você pode passar a versão exata e a arquitetura `(x86` ou `x64`) após a palavra-chave `product`, usando a opção `--silent`.

    * `[features]`: Todas as features associadas a um produto MySQL são instaladas por padrão. O bloco de features é uma lista separada por ponto e vírgula de features ou um caractere asterisco (`*`) que seleciona todas as features. Para remover uma característica, use o comando `modify`.

    * `[config block]`: Podem ser especificados um ou mais blocos de configuração. Cada bloco de configuração é uma lista separada por ponto e vírgula de pares chave-valor. Um bloco pode incluir uma chave do tipo `config` ou `user`; `config` é o tipo padrão se uma não for definida.
  
    Os valores dos blocos de configuração que contêm dois pontos (`:`) devem ser colocados entre aspas. Por exemplo, `installdir="C:\MySQL\MySQL Server 8.0"`. Apenas um bloco de tipo de configuração pode ser definido para cada produto. Um bloco de usuário deve ser definido para cada usuário a ser criado durante a instalação do produto.

    ::: info Observação:
    A chave de tipo `user` não é compatível quando um produto está sendo reconfigurado.
    :::

  Opções:

  `--auto-handle-prereqs`: Se presente, o Instalador do MySQL tenta baixar e instalar alguns pré-requisitos de software que atualmente não estão presentes, que podem ser resolvidos com intervenção mínima. Se a opção `--silent` não estiver presente, você será apresentado às páginas de instalação para cada pré-requisito. Se a opção `--auto-handle-prereqs` for omitida, os pacotes com pré-requisitos ausentes não serão instalados.

  `--continue`: Continua o processamento do próximo produto quando um erro é detectado durante o processamento dos blocos de ação que contêm argumentos para cada produto. Se não for especificado, toda a operação é abortada em caso de erro.

  `--help`: Mostra as opções e argumentos disponíveis para a ação correspondente. Se estiver presente, a ação não é executada, apenas a ajuda é exibida, portanto, outras opções relacionadas à ação também são ignoradas.

  `--mos-password=senha` : Define a senha do usuário My Oracle Support (MOS) para as versões comerciais do Instalador MySQL.

  `--mos-user=nome_do_usuário`: Especifica o nome do usuário do My Oracle Support (MOS) para acessar a versão comercial do MySQL Installer. Se não estiver presente, apenas os produtos do pacote, se houver, estarão disponíveis para instalação.

  `--only-ga-products`: Restrição do conjunto de produtos para incluir apenas produtos GA.

  `--setup-type=setup_type`: Instala um conjunto pré-definido de softwares. O tipo de instalação pode ser um dos seguintes:

    + `Server`: Instala um único servidor MySQL
    + `Client`: Instala programas e bibliotecas cliente (exclui conectores MySQL)
    + `Full`: Instala tudo (exclui conectores MySQL)
    + `Custom`: Instala os produtos selecionados pelo usuário. Esta é a opção padrão.

  ::: info Nota
  Os tipos de configuração não personalizados são válidos somente quando nenhum outro produto MySQL estiver instalado.
  :::

  `--show-settings`: Exibe as opções disponíveis para o produto selecionado, passando o nome do produto após `-showsettings`.

  `--silent`: Desative os prompts de confirmação.

  Exemplos:

  ```
  mysqlinstallerconsole.exe --install j;8.0.29, net;8.0.28 --silent
  ```

  ```bash
  MySQLInstallerConsole install server;8.0.30:*:port=3307;server_id=2:type=user;user=foo
  ```

  Um exemplo que passa em blocos de configuração adicionais, separados por `^` para caber:

  ```bash
  MySQLInstallerConsole --install server;8.0.30;x64:*:type=config;open_win_firewall=true; ^
     general_log=true;bin_log=true;server_id=3306;tcp_ip=true;port=3306;root_passwd=pass; ^
     install_dir="C:\MySQL\MySQL Server 8.0":type=user;user_name=foo;password=bar;role=DBManager
  ```

- `[--]list`

  Quando essa ação é usada sem opções, ela ativa uma lista interativa a partir da qual todos os produtos MySQL disponíveis podem ser pesquisados. Digite `MySQLInstallerConsole --list` e especifique uma subcadeia para pesquisar.

  Opções:

  `--all`: Lista todos os produtos disponíveis. Se esta opção for usada, todas as outras opções são ignoradas.

  `--arch=arquitetura`: Lista que contém a arquitetura especificada. Os valores permitidos são: `x86`, `x64` e `any` (padrão). Esta opção pode ser combinada com as opções `--name` e `--version`.

  `--help`:   Mostra as opções e argumentos disponíveis para a ação correspondente. Se estiver presente, a ação não é executada, apenas a ajuda é exibida, portanto, outras opções relacionadas à ação também são ignoradas.

  `--name=nome_do_pacote` : Lista os produtos que contêm o nome especificado (veja a frase do produto). Esta opção pode ser combinada com as opções `--version` e `--arch`.

  `--version=version`: Lista os produtos que contêm a versão especificada, como 8.0 ou 5.7. Esta opção pode ser combinada com as opções `--name` e `--arch`.

  Exemplos:

  ```sql
  MySQLInstallerConsole --list --name=net --version=8.0
  ```

- `[--]modificar [produto1:-removelist|+addlist], [produto2:-removelist|+addlist] [...]`

  Modifica ou exibe recursos de um produto MySQL instalado anteriormente. Para exibir os recursos de um produto, adicione a palavra-chave do produto ao comando, por exemplo:

  ```sql
  MySQLInstallerConsole --modify server
  ```

  Opções:

  `--help`: Mostra as opções e argumentos disponíveis para a ação correspondente. Se estiver presente, a ação não é executada, apenas a ajuda é exibida, portanto, outras opções relacionadas à ação também são ignoradas.

  `--silent` : Desative os prompts de confirmação.

  Exemplos:

  ```sql
  MySQLInstallerConsole --modify server:+documentation
  ```

  ```sql
  MySQLInstallerConsole modify server:-debug
  ```

- `[--]remover [produto1], [produto2] [...]`

  Remove um ou mais produtos do seu sistema. Um caractere asterisco (`*`) pode ser passado para remover todos os produtos MySQL com um comando.

  Opções:

  `--continue`: Continuar a operação mesmo que ocorra um erro.

  `--help`: Mostra as opções e argumentos disponíveis para a ação correspondente. Se estiver presente, a ação não é executada, apenas a ajuda é exibida, portanto, outras opções relacionadas à ação também são ignoradas.

  `--keep-datadir`: Ignora a remoção do diretório de dados ao remover produtos do MySQL Server.

  `--silent`: Desative os prompts de confirmação.

  Exemplos:

  ```
  mysqlinstallerconsole.exe remove *
  ```

  ```
  MySQLInstallerConsole --remove server --continue
  ```

- `[--] set`

  Define uma ou mais opções configuráveis que afetam a forma como o programa do Instalador do MySQL se conecta à internet e se o recurso de atualização automática do catálogo de produtos está ativado.

  Opções:

  * `--catalog-update=bool_value`: Habilita (true, padrão) ou desabilita (false) a atualização automática do catálogo de produtos. Esta opção requer uma conexão ativa à internet.
  * `--catalog-update-days=int_value`: Aceita um inteiro entre 1 (padrão) e 365 para indicar o número de dias entre as verificações de uma nova atualização do catálogo quando o MySQL Installer é iniciado. Se `--catalog-update` for `false`, essa opção é ignorada.
  * `--connection-validation=validation_type`: Define como o Instalador do MySQL realiza a verificação de uma conexão à internet. Os valores permitidos são `automatic` (padrão) e `manual`.
  * `--connection-validation-urls=url_list`: Uma string entre aspas duplas e separadas por vírgula que define a lista de URLs a serem usadas para verificar a conexão à internet quando `--connection-validation` estiver definido como `manual`. As verificações são feitas na mesma ordem fornecida. Se a primeira URL falhar, a próxima URL na lista é usada e assim por diante.
  * `--offline-mode=valor_booleano`: Permite que o Instalador do MySQL seja executado com ou sem capacidades de internet. Os modos válidos são:
    + `True` para ativar o modo offline (executar sem conexão com a internet).
    + `False` (padrão) para desativar o modo offline (executar com conexão com a internet). Defina este modo antes de baixar o catálogo de produtos ou qualquer produto para instalar.
  * `--proxy-mode`: Especifica o modo de proxy. Os modos válidos são:
      + `Automático` para identificar automaticamente o proxy com base nas configurações do sistema.
      + `Nenhum` para garantir que nenhum proxy seja configurado.
      + `Manual` para definir manualmente os detalhes do proxy (`--proxy-server`, `--proxy-port`, `--proxy-username`, `--proxy-password`).
  * `--proxy-password`: A senha usada para autenticar-se no servidor proxy.
  * `--proxy-port`: A porta usada pelo servidor proxy.
  * `--proxy-server`: O URL que aponta para o servidor proxy.
  * `--proxy-username`: O nome de usuário usado para autenticar-se no servidor proxy.
  * `--reset-defaults`: Redefine as opções do Instalador MySQL associadas à ação `--set` aos valores padrão.

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

- `[--]status`

  Fornece uma visão geral rápida dos produtos MySQL instalados no sistema. As informações incluem o nome e a versão do produto, a arquitetura, a data de instalação e o local de instalação.

  Opções:

    * `--help`: Mostra as opções e argumentos disponíveis para a ação correspondente. Se estiver presente, a ação não é executada, apenas a ajuda é exibida, portanto, outras opções relacionadas à ação também são ignoradas.

    Exemplos:

    ```sql
    MySQLInstallerConsole status
    ```

- `[--]update`

  Descarrega o catálogo mais recente do produto MySQL no seu sistema. Se o processo for bem-sucedido, o catálogo será aplicado na próxima vez que o `MySQLInstaller` ou o **MySQLInstallerConsole.exe** for executado.

  O Instalador do MySQL verifica automaticamente as atualizações do catálogo de produtos quando ele é iniciado, se *n* dias se passaram desde a última verificação. A partir do MySQL Installer 1.6.4, o valor padrão é de 1 dia. Anteriormente, o valor padrão era de 7 dias.

  Opções:

  `--help`: Mostra as opções e argumentos disponíveis para a ação correspondente. Se estiver presente, a ação não é executada, apenas a ajuda é exibida, portanto, outras opções relacionadas à ação também são ignoradas.

  Exemplos:

  ```sql
  MySQLInstallerConsole update
  ```

* `[--]upgrade [product1:version], [product2:version] [...]`

  Atualiza um ou mais produtos no seu sistema. Os seguintes caracteres são permitidos para essa ação:

  * `*`: Insira `*` para atualizar todos os produtos para a versão mais recente ou insira produtos específicos.
  * `!` : Insira `!` como número de versão para atualizar o produto MySQL para a versão mais recente.

  * Opções:
    * `--continue`: Continuar a operação mesmo que ocorra um erro.
    * `--help`: Mostra as opções e argumentos disponíveis para a ação correspondente. Se estiver presente, a ação não é executada, apenas a ajuda é exibida, portanto, outras opções relacionadas à ação também são ignoradas.
    * `--mos-password=senha`: Define a senha do usuário My Oracle Support (MOS) para as versões comerciais do Instalador MySQL.
    * `--mos-user=nome_do_usuário`: Especifica o nome do usuário do My Oracle Support (MOS) para acessar a versão comercial do MySQL Installer. Se não estiver presente, apenas os produtos do pacote, se houver, estarão disponíveis para instalação.
    * `--silent`: Desative os prompts de confirmação.

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
