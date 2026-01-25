### 2.3.3 MySQL Installer para Windows

2.3.3.1 Configuração Inicial do MySQL Installer

2.3.3.2 Definindo Caminhos de Server Alternativos com o MySQL Installer

2.3.3.3 Fluxos de Trabalho de Instalação com o MySQL Installer

2.3.3.4 Catálogo de Produtos e Dashboard do MySQL Installer

2.3.3.5 Referência do Console do MySQL Installer

O MySQL Installer é uma aplicação *standalone* (autônoma) projetada para facilitar a complexidade de instalação e configuração de produtos MySQL executados no Microsoft Windows. Ele é baixado com e suporta os seguintes produtos MySQL:

*   MySQL Servers

    O MySQL Installer pode instalar e gerenciar múltiplas e separadas instâncias de MySQL Server no mesmo *host* simultaneamente. Por exemplo, o MySQL Installer pode instalar, configurar e fazer *upgrade* de instâncias separadas do MySQL 5.7 e MySQL 8.0 no mesmo *host*. O MySQL Installer não permite *upgrades* de *server* entre números de versão maiores e menores, mas permite *upgrades* dentro de uma série de lançamento (como de 8.0.36 para 8.0.37).

    Nota

    O MySQL Installer não pode instalar as edições (*releases*) *Community* e *Commercial* do MySQL Server no mesmo *host*. Se você precisar de ambas as edições no mesmo *host*, considere usar a distribuição de arquivo ZIP para instalar uma delas.

*   Aplicações MySQL

    MySQL Workbench, MySQL Shell e MySQL Router.

*   Connectors MySQL

    Estes não são suportados; em vez disso, instale a partir de <https://dev.mysql.com/downloads/>. Esses *connectors* incluem MySQL Connector/NET, MySQL Connector/Python, MySQL Connector/ODBC, MySQL Connector/J, MySQL Connector/Node.js e MySQL Connector/C++.

    Nota

    Os *connectors* eram empacotados antes do MySQL Installer 1.6.7 (MySQL Server 8.0.34), e o MySQL Installer podia instalar cada *connector* até a versão 8.0.33, até o MySQL Installer 1.6.11 (MySQL Server 8.0.37). O MySQL Installer agora apenas detecta essas versões antigas de *connectors* para desinstalá-las.

#### Requisitos de Instalação

O MySQL Installer requer o Microsoft .NET Framework 4.5.2 ou posterior. Se esta versão não estiver instalada no computador *host*, você pode baixá-la visitando o [site da Microsoft](https://www.microsoft.com/en-us/download/details.aspx?id=42643).

Para invocar o MySQL Installer após uma instalação bem-sucedida:

1.  Clique com o botão direito em Iniciar do Windows, selecione Executar (Run) e clique em Procurar (Browse). Navegue até `Program Files (x86) > MySQL > MySQL Installer for Windows` para abrir a pasta do programa.

2.  Selecione um dos seguintes arquivos:

    *   `MySQLInstaller.exe` para abrir a aplicação gráfica.

    *   `MySQLInstallerConsole.exe` para abrir a aplicação de linha de comando.

3.  Clique em Abrir (Open) e, em seguida, clique em OK na janela Executar (Run). Se for solicitado que você permita que a aplicação faça alterações no dispositivo, selecione `Sim` (Yes).

Toda vez que você invoca o MySQL Installer, o processo de inicialização verifica a presença de uma conexão com a internet e solicita que você habilite o modo *offline* se não encontrar acesso à internet (e se o modo *offline* estiver desativado). Selecione `Sim` para executar o MySQL Installer sem recursos de conexão à internet. A disponibilidade de produtos MySQL fica limitada apenas àqueles produtos que estão atualmente no *cache* de produto quando você habilita o modo *offline*. Para baixar produtos MySQL, clique na ação rápida "Desabilitar" o modo *offline* exibida no *dashboard*.

É necessária uma conexão com a internet para baixar um *manifest* contendo metadados para os produtos MySQL mais recentes que não fazem parte de um pacote completo (*full bundle*). O MySQL Installer tenta baixar o *manifest* quando você inicia a aplicação pela primeira vez e, em seguida, periodicamente em intervalos configuráveis (consulte Opções do MySQL Installer). Alternativamente, você pode recuperar um *manifest* atualizado manualmente clicando em Catálogo (Catalog) no *dashboard* do MySQL Installer.

Nota

Se o primeiro *download* ou os subsequentes *downloads* do *manifest* não forem bem-sucedidos, um erro será registrado e você poderá ter acesso limitado aos produtos MySQL durante sua sessão. O MySQL Installer tenta baixar o *manifest* a cada inicialização até que a estrutura inicial do *manifest* seja atualizada. Para obter ajuda na localização de um produto, consulte Localizando Produtos para Instalação.

#### Edição Community do MySQL Installer

Baixe o software em <https://dev.mysql.com/downloads/installer/> para instalar a edição Community de todos os produtos MySQL para Windows. Selecione uma das seguintes opções de pacote do MySQL Installer:

*   *Web*: Contém apenas o MySQL Installer e os arquivos de configuração. A opção de pacote *web* baixa somente os produtos MySQL que você selecionar para instalar, mas requer uma conexão com a internet para cada *download*. O tamanho deste arquivo é de aproximadamente 2 MB. O nome do arquivo tem o formato `mysql-installer-community-web-VERSION.N.msi`, onde *`VERSION`* é o número da versão do MySQL Server, como 8.0, e `N` é o número do pacote, que começa em 0.

*   *Pacote Completo (Full) ou Atual (Current Bundle)*: Empacota todos os produtos MySQL para Windows (incluindo o MySQL Server). O tamanho do arquivo é superior a 300 MB, e o nome tem o formato `mysql-installer-community-VERSION.N.msi`, onde *`VERSION`* é o número da versão do MySQL Server, como 8.0, e `N` é o número do pacote, que começa em 0.

#### Edição Commercial do MySQL Installer

Baixe o software em <https://edelivery.oracle.com/> para instalar a edição Commercial (Standard ou Enterprise Edition) de produtos MySQL para Windows. Se você estiver logado em sua conta do My Oracle Support (MOS), a edição Commercial inclui todas as versões GA (General Availability) atuais e anteriores disponíveis na edição Community, mas exclui as versões de marco de desenvolvimento (*development-milestone*). Quando você não está logado, você vê apenas a lista de produtos empacotados que você já baixou.

A edição Commercial também inclui os seguintes produtos:

*   Workbench SE/EE
*   MySQL Enterprise Backup
*   MySQL Enterprise Firewall

A edição Commercial se integra à sua conta MOS. Para conteúdo de base de conhecimento e *patches*, consulte [My Oracle Support](https://support.oracle.com/).