### 2.4.4 Instalar e usar o painel de preferências do MySQL

O pacote de instalação do MySQL inclui um painel de preferências do MySQL que permite iniciar, parar e controlar a inicialização automática durante a inicialização da sua instalação do MySQL.

Este painel de preferências é instalado por padrão e está listado na janela *Preferências do sistema* do seu sistema.

\*\* Figura 2.8 Painel de Preferências MySQL: Localização\*\*

![Shows "MySQL" typed into the macOS System Preferences search box, and a highlighted "MySQL" icon in the bottom left.](images/mac-installer-preference-pane-location.png)

O painel de preferências do MySQL é instalado com o mesmo arquivo DMG que instala o MySQL Server. Normalmente, ele é instalado com o MySQL Server, mas também pode ser instalado por si mesmo.

Para instalar o painel de preferências do MySQL:

1. Passe pelo processo de instalação do servidor MySQL, conforme descrito na documentação na Seção 2.4.2, Instalar MySQL no macOS Usando Pacotes Nativos.
2. Clique em Personalizar na etapa Tipo de instalação. A opção "Panela de preferências" está listada lá e ativada por padrão; certifique-se de que não está deselecionada. As outras opções, como o MySQL Server, podem ser selecionadas ou deselecionadas.

   \*\* Figura 2.9 Assistente de instalação de pacotes MySQL: Personalizar\*\*

   ![Customize shows three package name options: MySQL Server, MySQL Test, Preference Pane, and Launchd Support. All three options are checked.](images/mac-installer-installation-type-customize.png)
3. Concluir o processo de instalação.

::: info Note

O painel de preferências do MySQL só inicia e interrompe a instalação do MySQL instalado a partir da instalação do pacote do MySQL que foi instalado no local padrão.

:::

Uma vez instalado o painel de preferências do MySQL, você pode controlar sua instância do servidor MySQL usando este painel de preferências.

A página Instâncias inclui uma opção para iniciar ou parar o MySQL, e Iniciar o banco de dados recria o diretório `data/`. Desinstalar desinstala o MySQL Server e opcionalmente o painel de preferências do MySQL e informações de lançamento.

\*\* Figura 2.10 Painel de Preferências MySQL: Instâncias\*\*

![The left side shows a list of MySQL instances separated by "Active Instance", "Installed Instances", and "Data Directories" sections. The right side shows a "Stop MySQL Server" button, a check box titled "Start MySQL when your computer starts up", and "Initialize Database" and "Uninstall" buttons.](images/mac-installer-preference-pane-instances.png)

A página Configuração mostra as opções do MySQL Server, incluindo o caminho para o arquivo de configuração do MySQL.

\*\* Figura 2.11 Painel de Preferências MySQL: Configuração\*\*

![Content is described in the surrounding text.](images/mac-installer-preference-pane-configuration.png)

O painel de preferências do MySQL mostra o status atual do servidor MySQL, mostrando parado (em vermelho) se o servidor não estiver em execução e em execução (em verde) se o servidor já tiver sido iniciado. O painel de preferências também mostra a configuração atual para saber se o servidor MySQL foi configurado para iniciar automaticamente.
