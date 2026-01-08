#### 2.3.3.5 MySQL Installer Console Reference

**MySQLInstallerConsole.exe** provides command-line functionality that is similar to MySQL Installer. This reference includes:

* MySQL Product Names
* Command Syntax
* Command Actions

The console is installed when MySQL Installer is initially executed and then available within the `MySQL Installer for Windows` directory. By default, the directory location is `C:\Program Files (x86)\MySQL\MySQL Installer for Windows`. You must run the console as administrator.

To use the console:

1. Open a command prompt with administrative privileges by selecting Windows System from Start, then right-click Command Prompt, select More, and select Run as administrator.

2. From the command line, optionally change the directory to where the **MySQLInstallerConsole.exe** command is located. For example, to use the default installation location:

   ```sql
   cd Program Files (x86)\MySQL\MySQL Installer for Windows
   ```

3. Type `MySQLInstallerConsole.exe` (or `mysqlinstallerconsole`) followed by a command action to perform a task. For example, to show the console's help:

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

##### MySQL Product Names

Many of the **MySQLInstallerConsole** command actions accept one or more abbreviated phrases that can match a MySQL product (or products) in the catalog. The current set of valid short phrases for use with commands is shown in the following table.

Note

Starting with MySQL Installer 1.6.7 (8.0.34), the `install`, `list`, and `upgrade` command options no longer apply to MySQL for Visual Studio (now EOL), MySQL Connector/NET, MySQL Connector/ODBC, MySQL Connector/C++, MySQL Connector/Python, and MySQL Connector/J. To install newer MySQL connectors, visit https://dev.mysql.com/downloads/.

**Table 2.6 MySQL Product Phrases for use with the MySQLInstallerConsole.exe command**

<table><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th scope="col">Phrase</th> <th scope="col">MySQL Product</th> </tr></thead><tr> <td><code>server</code></td> <td>MySQL Server</td> </tr><tr> <td><code>workbench</code></td> <td>MySQL Workbench</td> </tr><tr> <td><code>shell</code></td> <td>MySQL Shell</td> </tr><tr> <td><code>visual</code></td> <td>MySQL for Visual Studio</td> </tr><tr> <td><code>router</code></td> <td>MySQL Router</td> </tr><tr> <td><code>backup</code></td> <td>MySQL Enterprise Backup (requires the commercial release)</td> </tr><tr> <td><code>net</code></td> <td>MySQL Connector/NET</td> </tr><tr> <td><code>odbc</code></td> <td>MySQL Connector/ODBC</td> </tr><tr> <td><code>c++</code></td> <td>MySQL Connector/C++</td> </tr><tr> <td><code>python</code></td> <td>MySQL Connector/Python</td> </tr><tr> <td><code>j</code></td> <td>MySQL Connector/J</td> </tr><tr> <td><code>documentation</code></td> <td>MySQL Server Documentation</td> </tr><tr> <td><code>samples</code></td> <td>MySQL Samples (sakila and world databases)</td> </tr></table>

##### Command Syntax

The **MySQLInstallerConsole.exe** command can be issued with or without the file extension (`.exe`) and the command is not case-sensitive.

`mysqlinstallerconsole`[`.exe`] [[[`--`]*`action`*] [*`action_blocks_list`*] [*`options_list`*]]

Description:

`action` :   One of the permitted operational actions. If omitted, the default action is equivalent to the `--status` action. Using the `--` prefix is optional for all actions.

    Possible actions are: [--]`configure`, [--]`help`, [--]`install`, [--]`list`, [--]`modify`, [--]`remove`, [--]`set`, [--]`status`, [--]`update`, and [--]`upgrade`.

`action_blocks_list` :   A list of blocks in which each represents a different item depending on the selected action. Blocks are separated by commas.

    The `--remove` and `--upgrade` actions permit specifying an asterisk character (`*`) to indicate all products. If the `*` character is detected at the start of this block, it is assumed all products are to be processed and the remainder of the block is ignored.

    Syntax: `*|action_block[,action_block][,action_block]...`

    *`action_block`*: Contains a product selector followed by an indefinite number of argument blocks that behave differently depending on the selected action (see Command Actions).

`options_list` :   Zero or more options with possible values separated by spaces. See Command Actions to identify the options permitted for the corresponding action.

    Syntax: `option_value_pair[ option_value_pair][ option_value_pair]...`

    *`option_value_pair`*: A single option (for example, `--silent`) or a tuple of a key and a corresponding value with an options prefix. The key-value pair is in the form of `--key[=value]`.

##### Command Actions

**MySQLInstallerConsole.exe** supports the following command actions:

Note

Configuration block (or arguments\_block) values that contain a colon character (`:`) must be wrapped in quotation marks. For example, `install_dir="C:\MySQL\MySQL Server 8.0"`.

* `[--]configure [product1]:[configuration_argument]=[value], [product2]:[configuration_argument]=[value], [...]`

  Configures one or more MySQL products on your system. Multiple *`configuration_argument`*=*`value`* pairs can be configured for each product.

  Options:

  `--continue` :   Continues processing the next product when an error is caught while processing the action blocks containing arguments for each product. If not specified the whole operation is aborted in case of an error.

  `--help` :   Shows the options and available arguments for the corresponding action. If present the action is not executed, only the help is shown, so other action-related options are ignored as well.

  `--show-settings` :   Displays the available options for the selected product by passing in the product name after `--show-settings`.

  `--silent` :   Disables confirmation prompts.

  Examples:

  ```sql
  MySQLInstallerConsole --configure --show-settings server
  ```

  ```sql
  mysqlinstallerconsole.exe --configure server:port=3307
  ```

* `[--]help`

  Displays a help message with usage examples and then exits. Pass in an additional command action to receive help specific to that action.

  Options:

  `--action=[action]` :   Shows the help for a specific action. Same as using the `--help` option with an action.

      Permitted values are: `all`, `configure`, `help` (default), `install`, `list`, `modify`, `remove`, `status`, `update`, `upgrade`, and `set`.

  `--help` :   Shows the options and available arguments for the corresponding action. If present the action is not executed, only the help is shown, so other action-related options are ignored as well.

  Examples:

  ```sql
  MySQLInstallerConsole help
  ```

  ```sql
  MySQLInstallerConsole help --action=install
  ```

* `[--]install [product1]:[features]:[config block]:[config block], [product2]:[config block], [...]`

  Installs one or more MySQL products on your system. If pre-release products are available, both GA and pre-release products are installed when the value of the `--type` option value is `Client` or `Full`. Use the `--only_ga_products` option to restrict the product set to GA products only when using these setup types.

  Description:

  `[product]` :   Each product can be specified by a product phrase with or without a semicolon-separated version qualifier. Passing in a product keyword alone selects the latest version of the product. If multiple architectures are available for that version of the product, the command returns the first one in the manifest list for interactive confirmation. Alternatively, you can pass in the exact version and architecture `(x86` or `x64`) after the product keyword using the `--silent` option.

  `[features]` :   All features associated with a MySQL product are installed by default. The feature block is a semicolon-separated list of features or an asterisk character (`*`) that selects all features. To remove a feature, use the `modify` command.

  `[config block]` :   One or more configuration blocks can be specified. Each configuration block is a semicolon-separated list of key-value pairs. A block can include either a `config` or `user` type key; `config` is the default type if one is not defined.

      Configuration block values that contain a colon character (`:`) must be wrapped in quotation marks. For example, `installdir="C:\MySQL\MySQL Server 8.0"`. Only one configuration type block can be defined for each product. A user block should be defined for each user to be created during the product installation.

      Note

      The `user` type key is not supported when a product is being reconfigured.

  Options:

  `--auto-handle-prereqs` :   If present, MySQL Installer attempts to download and install some software prerequisites, not currently present. that can be resolved with minimal intervention. If the `--silent` option is not present, you are presented with installation pages for each prerequisite. If the `--auto-handle-prereqs` options is omitted, packages with missing prerequisites are not installed.

  `--continue` :   Continues processing the next product when an error is caught while processing the action blocks containing arguments for each product. If not specified the whole operation is aborted in case of an error.

  `--help` :   Shows the options and available arguments for the corresponding action. If present the action is not executed, only the help is shown, so other action-related options are ignored as well.

  `--mos-password=password` :   Sets the My Oracle Support (MOS) user's password for commercial versions of the MySQL Installer.

  `--mos-user=user_name` :   Specifies the My Oracle Support (MOS) user name for access to the commercial version of MySQL Installer. If not present, only the products in the bundle, if any, are available to be installed.

  `--only-ga-products` :   Restricts the product set to include GA products only.

  `--setup-type=setup_type` :   Installs a predefined set of software. The setup type can be one of the following:

      + `Server`: Installs a single MySQL server

      + `Client`: Installs client programs and libraries (excludes MySQL connectors)

      + `Full`: Installs everything (excludes MySQL connectors)

      + `Custom`: Installs user-selected products. This is the default option.

      Note

      Non-custom setup types are valid only when no other MySQL products are installed.

  `--show-settings` :   Displays the available options for the selected product, by passing in the product name after `-showsettings`.

  `--silent` :   Disable confirmation prompts.

  Examples:

  ```sql
  mysqlinstallerconsole.exe --install j;8.0.29, net;8.0.28 --silent
  ```

  ```sql
  MySQLInstallerConsole install server;8.0.30:*:port=3307;server_id=2:type=user;user=foo
  ```

  An example that passes in additional configuration blocks, separated by `^` to fit:

  ```sql
  MySQLInstallerConsole --install server;8.0.30;x64:*:type=config;open_win_firewall=true; ^
     general_log=true;bin_log=true;server_id=3306;tcp_ip=true;port=3306;root_passwd=pass; ^
     install_dir="C:\MySQL\MySQL Server 8.0":type=user;user_name=foo;password=bar;role=DBManager
  ```

* `[--]list`

  When this action is used without options, it activates an interactive list from which all of the available MySQL products can be searched. Enter `MySQLInstallerConsole --list` and specify a substring to search.

  Options:

  `--all` :   Lists all available products. If this option is used, all other options are ignored.

  `--arch=architecture` :   Lists that contain the specified architecture. Permitted values are: `x86`, `x64`, and `any` (default). This option can be combined with the `--name` and `--version` options.

  `--help` :   Shows the options and available arguments for the corresponding action. If present the action is not executed, only the help is shown, so other action-related options are ignored as well.

  `--name=package_name` :   Lists products that contain the specified name (see product phrase), This option can be combined with the `--version` and `--arch` options.

  `--version=version` :   Lists products that contain the specified version, such as 8.0 or 5.7. This option can be combined with the `--name` and `--arch` options.

  Examples:

  ```sql
  MySQLInstallerConsole --list --name=net --version=8.0
  ```

* `[--]modify [product1:-removelist|+addlist], [product2:-removelist|+addlist] [...]`

  Modifies or displays features of a previously installed MySQL product. To display the features of a product, append the product keyword to the command, for example:

  ```sql
  MySQLInstallerConsole --modify server
  ```

  Options:

  `--help` :   Shows the options and available arguments for the corresponding action. If present the action is not executed, only the help is shown, so other action-related options are ignored as well.

  `--silent` :   Disable confirmation prompts.

  Examples:

  ```sql
  MySQLInstallerConsole --modify server:+documentation
  ```

  ```sql
  MySQLInstallerConsole modify server:-debug
  ```

* `[--]remove [product1], [product2] [...]`

  Removes one ore more products from your system. An asterisk character (`*`) can be passed in to remove all MySQL products with one command.

  Options:

  `--continue` :   Continue the operation even if an error occurs.

  `--help` :   Shows the options and available arguments for the corresponding action. If present the action is not executed, only the help is shown, so other action-related options are ignored as well.

  `--keep-datadir` :   Skips the removal of the data directory when removing MySQL Server products.

  `--silent` :   Disable confirmation prompts.

  Examples:

  ```sql
  mysqlinstallerconsole.exe remove *
  ```

  ```sql
  MySQLInstallerConsole --remove server --continue
  ```

* `[--]set`

  Sets one or more configurable options that affect how the MySQL Installer program connects to the internet and whether the automatic products-catalog updates feature is activated.

  Options:

  `--catalog-update=bool_value` :   Enables (`true`, default) or disables (`false`) the automatic products catalog update. This option requires an active connection to the internet.

  `--catalog-update-days=int_value` :   Accepts an integer between 1 (default) and 365 to indicate the number of days between checks for a new catalog update when MySQL Installer is started. If `--catalog-update` is `false`, this option is ignored.

  `--connection-validation=validation_type` :   Sets how MySQL Installer performs the check for an internet connection. Permitted values are `automatic` (default) and `manual`.

  `--connection-validation-urls=url_list` :   A double-quote enclosed and comma-separated string that defines the list of URLs to use for checking the internet connection when `--connection-validation` is set to `manual`. Checks are made in the same order provided. If the first URL fails, the next URL in the list is used and so on.

  `--offline-mode=bool_value` :   Enables MySQL Installer to run with or without internet capabilities. Valid modes are:

      + `True` to enable offline mode (run without an internet connection).

      + `False` (default) to disable offline mode (run with an internet connection). Set this mode before downloading the product catalog or any products to install.

  `--proxy-mode` :   Specifies the proxy mode. Valid modes are:

      + `Automatic` to automatically identify the proxy based on the system settings.

      + `None` to ensure that no proxy is configured.

      + `Manual` to set the proxy details manually (`--proxy-server`, `--proxy-port`, `--proxy-username`, `--proxy-password`).

  `--proxy-password` :   The password used to authenticate to the proxy server.

  `--proxy-port` :   The port used for the proxy server.

  `--proxy-server` :   The URL that point to the proxy server.

  `--proxy-username` :   The user name used to authenticate to the proxy server.

  `--reset-defaults` :   Resets the MySQL Installer options associated with the `--set` action to the default values.

  Examples:

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

  Provides a quick overview of the MySQL products that are installed on the system. Information includes product name and version, architecture, date installed, and install location.

  Options:

  `--help` :   Shows the options and available arguments for the corresponding action. If present the action is not executed, only the help is shown, so other action-related options are ignored as well.

  Examples:

  ```sql
  MySQLInstallerConsole status
  ```

* `[--]update`

  Downloads the latest MySQL product catalog to your system. On success, the catalog is applied the next time either `MySQLInstaller` or **MySQLInstallerConsole.exe** is executed.

  MySQL Installer automatically checks for product catalog updates when it is started if *`n`* days have passed since the last check. Starting with MySQL Installer 1.6.4, the default value is 1 day. Previously, the default value was 7 days.

  Options:

  `--help` :   Shows the options and available arguments for the corresponding action. If present the action is not executed, only the help is shown, so other action-related options are ignored as well.

  Examples:

  ```sql
  MySQLInstallerConsole update
  ```

* `[--]upgrade [product1:version], [product2:version] [...]`

  Upgrades one or more products on your system. The following characters are permitted for this action:

  `*` :   Pass in `*` to upgrade all products to the latest version, or pass in specific products.

  `!` :   Pass in `!` as a version number to upgrade the MySQL product to its latest version.

  Options:

  `--continue` :   Continue the operation even if an error occurs.

  `--help` :   Shows the options and available arguments for the corresponding action. If present the action is not executed, only the help is shown, so other action-related options are ignored as well.

  `--mos-password=password` :   Sets the My Oracle Support (MOS) user's password for commercial versions of the MySQL Installer.

  `--mos-user=user_name` :   Specifies the My Oracle Support (MOS) user name for access to the commercial version of MySQL Installer. If not present, only the products in the bundle, if any, are available to be installed.

  `--silent` :   Disable confirmation prompts.

  Examples:

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
