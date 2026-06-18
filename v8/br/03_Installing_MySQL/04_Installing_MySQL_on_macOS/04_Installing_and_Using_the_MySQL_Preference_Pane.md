### 2.4.4 Instalando e usando o painel de preferências do MySQL

O Pacote de Instalação do MySQL inclui uma janela de preferências do MySQL que permite iniciar, parar e controlar a inicialização automatizada durante o boot da sua instalação do MySQL.

Essa janela de preferências é instalada por padrão e está listada na janela *Preferências do Sistema* do seu sistema.

**Figura 2.20: Painel de Preferências do MySQL: Localização**

![Shows "MySQL" typed into the macOS System Preferences search box, and a highlighted "MySQL" icon in the bottom left.](images/mac-installer-preference-pane-location.png)

O painel de preferências do MySQL é instalado com o mesmo arquivo DMG que instala o MySQL Server. Normalmente, ele é instalado com o MySQL Server, mas também pode ser instalado sozinho.

Para instalar o painel de preferências do MySQL:

1. Siga o processo de instalação do servidor MySQL, conforme descrito na documentação na Seção 2.4.2, “Instalando o MySQL no macOS usando pacotes nativos”.

2. Clique em Personalizar na etapa Tipo de instalação. A opção "Painel de preferências" está listada lá e habilitada por padrão; certifique-se de que ela não esteja desmarcada. As outras opções, como MySQL Server, podem ser selecionadas ou desmarcadas.

   **Figura 2.21: Assistente do Instalador do Pacote MySQL: Personalizar**

   ![Customize shows three package name options: MySQL Server, MySQL Test, Preference Pane, and Launchd Support. All three options are checked.](images/mac-installer-installation-type-customize.png)

3. Complete o processo de instalação.

Nota

A janela de preferências do MySQL só inicia e para a instalação do MySQL instalada a partir da instalação do pacote MySQL que foram instalados na localização padrão.

Depois que o painel de preferências do MySQL for instalado, você poderá controlar sua instância do servidor MySQL usando este painel de preferências.

A página Instâncias inclui uma opção para iniciar ou parar o MySQL, e Inicializar Banco de Dados recria o diretório `data/`. A desinstalação desinstala o MySQL Server e, opcionalmente, o painel de preferências do MySQL e as informações do launchd.

**Figura 2.22 Painel de Preferências do MySQL: Instâncias**

![The left side shows a list of MySQL instances separated by "Active Instance", "Installed Instances", and "Data Directories" sections. The right side shows a "Stop MySQL Server" button, a check box titled "Start MySQL when your computer starts up", and "Initialize Database" and "Uninstall" buttons. Several fields reference 8.0.11 as the current installed MySQL version.](images/mac-installer-preference-pane-instances.png)

**Figura 2.23 Painel de Preferências do MySQL: Inicializar Banco de Dados**

![Shows an option to enter the root password, along with choosing between two password types: Strong Password Encryption that is suggested for MySQL 8 clients or Legacy Password Encryption with compatibility with older MySQL 5.x clients. The optional "Load configuration file" option is loaded by mysqld during initialization, and it notes that plugin-specific options may prevent the initialization from completing.](images/mac-installer-preference-pane-initialize.png)

A página de Configuração exibe as opções do Servidor MySQL, incluindo o caminho para o arquivo de configuração do MySQL.

**Figura 2.24 Painel de Preferências do MySQL: Configuração**

![Content is described in the surrounding text.](images/mac-installer-preference-pane-configuration.png)

O Painel de Preferências do MySQL mostra o status atual do servidor MySQL, mostrando parado (em vermelho) se o servidor não estiver em execução e em execução (em verde) se o servidor já tiver sido iniciado. O painel de preferências também mostra a configuração atual de se o servidor MySQL foi configurado para iniciar automaticamente.
