## 2.3 Instalar o MySQL no Microsoft Windows

Importante

O MySQL 8.0 Server requer o Pacote de Redistribuição Microsoft Visual C++ 2019 para funcionar em plataformas Windows. Os usuários devem garantir que o pacote tenha sido instalado no sistema antes de instalar o servidor. O pacote está disponível no [Centro de Download da Microsoft][(http://www.microsoft.com/en-us/download/default.aspx)]. Além disso, os binários de depuração do MySQL requerem que o Visual Studio 2019 esteja instalado.

O MySQL está disponível apenas para sistemas operacionais Microsoft Windows de 64 bits. Para informações sobre a plataforma Windows compatível, consulte <https://www.mysql.com/support/supportedplatforms/database.html>.

Existem diferentes métodos para instalar o MySQL no Microsoft Windows.

### Método do Instalador do MySQL

O método mais simples e recomendado é baixar o Instalador MySQL (para Windows) e deixá-lo instalar e configurar uma versão específica do MySQL Server da seguinte forma:

1. Baixe o instalador do MySQL de <https://dev.mysql.com/downloads/installer/> e execute-o.

Nota

Ao contrário do instalador padrão do MySQL, a versão menor `web-community` não inclui quaisquer aplicativos do MySQL, mas apenas baixa os produtos do MySQL que você escolheu para instalar.

2. Determine o tipo de configuração a ser usado para a instalação inicial dos produtos MySQL. Por exemplo:

* Desenvolvedor Padrão: Fornece um tipo de configuração que inclui a versão selecionada do MySQL Server e outras ferramentas relacionadas ao desenvolvimento do MySQL, como o MySQL Workbench.

* Somente servidor: Fornece uma configuração para a versão selecionada do MySQL Server sem outros produtos.

* Personalizado: Permite que você selecione qualquer versão do MySQL Server e outros produtos MySQL.

3. Instale a instância do servidor (e os produtos) e, em seguida, comece a configuração do servidor, seguindo as instruções na tela. Para mais informações sobre cada etapa individual, consulte a Seção 2.3.3.3.1, “Configuração do Servidor MySQL com o Instalador MySQL”.

O MySQL está instalado agora. Se você configurou o MySQL como um serviço, o Windows iniciará automaticamente o servidor MySQL toda vez que você reiniciar o sistema. Além disso, esse processo instala o aplicativo do Instalador do MySQL no host local, que você pode usar mais tarde para atualizar ou reconfigurar o servidor MySQL.

Nota

Se você instalou o MySQL Workbench no seu sistema, considere usá-lo para verificar a conexão do seu novo servidor MySQL. Por padrão, o programa é iniciado automaticamente após a instalação do MySQL.

### Informações adicionais sobre a instalação

É possível executar o MySQL como uma aplicação padrão ou como um serviço do Windows. Ao usar um serviço, você pode monitorar e controlar a operação do servidor por meio das ferramentas padrão de gerenciamento de serviços do Windows. Para mais informações, consulte a Seção 2.3.4.8, "Começando o MySQL como um serviço do Windows".

Para acomodar a declaração `RESTART`, o servidor MySQL se divide quando executado como um serviço ou de forma independente, para permitir que um processo de monitoramento supervisione o processo do servidor. Neste caso, existem dois processos **mysqld**. Se a capacidade `RESTART` não for necessária, o servidor pode ser iniciado com a opção `--no-monitor`. Veja a Seção 15.7.8.8, “Declaração de REINICIO”.

Geralmente, você deve instalar o MySQL no Windows usando uma conta que tenha direitos de administrador. Caso contrário, você pode encontrar problemas com certas operações, como editar a variável de ambiente `PATH` ou acessar o **Service Control Manager**. Quando instalado, o MySQL não precisa ser executado usando um usuário com privilégios de administrador.

Para uma lista de limitações sobre o uso do MySQL na plataforma Windows, consulte a Seção 2.3.7, “Restrições da Plataforma Windows”.

Além do pacote do MySQL Server, você pode precisar ou querer componentes adicionais para usar o MySQL com sua aplicação ou ambiente de desenvolvimento. Esses incluem, mas não estão limitados a:

* Para se conectar ao servidor MySQL usando ODBC, você deve ter um driver Connector/ODBC. Para obter mais informações, incluindo instruções de instalação e configuração, consulte o Guia do Desenvolvedor do MySQL Connector/ODBC.

Nota

O Instalador do MySQL instala e configura o Connector/ODBC para você.

* Para usar o servidor MySQL com aplicativos .NET, você deve ter o driver Connector/NET. Para obter mais informações, incluindo instruções de instalação e configuração, consulte o Guia do Desenvolvedor do MySQL Connector/NET.

Nota

O Instalador do MySQL instala e configura o Conectador/NET do MySQL para você.

As distribuições do MySQL para Windows podem ser descarregadas em <https://dev.mysql.com/downloads/>. Veja a Seção 2.1.3, “Como obter o MySQL”.

O MySQL para Windows está disponível em vários formatos de distribuição, detalhados aqui. De modo geral, você deve usar o Instalador do MySQL. Ele contém mais recursos e produtos do MySQL do que o MSI mais antigo, é mais simples de usar do que o arquivo compactado e você não precisa de ferramentas adicionais para fazer o MySQL funcionar. O Instalador do MySQL instala automaticamente o MySQL Server e outros produtos do MySQL, cria um arquivo de opções, inicia o servidor e permite que você crie contas de usuário padrão. Para mais informações sobre a escolha de um pacote, consulte a Seção 2.3.2, “Escolhendo um pacote de instalação”.

* Uma distribuição do Instalador MySQL inclui o MySQL Server e outros produtos MySQL, incluindo o MySQL Workbench e o MySQL para Visual Studio. O Instalador MySQL também pode ser usado para atualizar esses produtos no futuro (consulte https://dev.mysql.com/doc/mysql-compat-matrix/en/).

Para obter instruções sobre a instalação do MySQL usando o Instalador do MySQL, consulte a Seção 2.3.3, “Instalador do MySQL para Windows”.

* A distribuição binária padrão (empacotada como um arquivo comprimido) contém todos os arquivos necessários que você descompactará no local escolhido. Este pacote contém todos os arquivos do pacote completo do instalador MSI do Windows, mas não inclui um programa de instalação.

Para obter instruções sobre a instalação do MySQL usando o arquivo compactado, consulte [Seção 2.3.4, “Instalando MySQL no Microsoft Windows usando um arquivo ZIP `noinstall`”](windows-install-archive.html "2.3.4 Installing MySQL on Microsoft Windows Using a noinstall ZIP Archive").

* O formato de distribuição da fonte contém todo o código e os arquivos de suporte para a construção dos executáveis usando o sistema de compilador do Visual Studio.

Para obter instruções sobre como construir o MySQL a partir do código-fonte no Windows, consulte a Seção 2.8, “Instalando o MySQL a partir do código-fonte”.

### Considerações sobre o MySQL no Windows

* **Suporte para mesa grande**

Se você precisar de tabelas com um tamanho maior que 4 GB, instale o MySQL em um sistema de arquivos NTFS ou mais recente. Não se esqueça de usar `MAX_ROWS` e `AVG_ROW_LENGTH` ao criar tabelas. Veja a Seção 15.1.20, “Instrução CREATE TABLE”.

* **MySQL e Software de Verificação de Vírus**

O software de varredura de vírus, como o Norton/Symantec Anti-Virus, em diretórios que contêm dados do MySQL e tabelas temporárias, pode causar problemas, tanto em termos do desempenho do MySQL quanto da identificação incorreta do conteúdo dos arquivos como contendo spam pelo software de varredura de vírus. Isso ocorre devido ao mecanismo de impressão digital utilizado pelo software de varredura de vírus e à maneira como o MySQL atualiza rapidamente diferentes arquivos, que podem ser identificados como um risco potencial de segurança.

Após instalar o MySQL Server, é recomendável desativar a varredura de vírus no diretório principal (`datadir`) usado para armazenar os dados da sua tabela MySQL. Geralmente, o software de varredura de vírus possui um sistema integrado que permite ignorar diretórios específicos.

Além disso, por padrão, o MySQL cria arquivos temporários no diretório padrão de arquivos temporários do Windows. Para evitar que os arquivos temporários também sejam verificados, configure um diretório temporário separado para os arquivos temporários do MySQL e adicione esse diretório à lista de exclusão da verificação de vírus. Para fazer isso, adicione uma opção de configuração para o parâmetro `tmpdir` ao seu arquivo de configuração `my.ini`. Para mais informações, consulte a Seção 2.3.4.2, “Criando um arquivo de opção”.

### 2.3.1 Estrutura de instalação do MySQL no Microsoft Windows

Para o MySQL 8.0 no Windows, o diretório de instalação padrão é `C:\Program Files\MySQL\MySQL Server 8.0` para instalações realizadas com o MySQL Installer. Se você usar o método de arquivo ZIP para instalar o MySQL, pode preferir instalar em `C:\mysql`. No entanto, o layout dos subdiretórios permanece o mesmo.

Todos os arquivos estão localizados dentro deste diretório pai, utilizando a estrutura mostrada na tabela a seguir.

**Tabela 2.4 Estrutura de instalação padrão do MySQL para Microsoft Windows**

<table><col style="width: 30%"/><col style="width: 40%"/><col style="width: 30%"/><thead><tr> <th scope="col">Directory</th> <th scope="col">Contents of Directory</th> <th scope="col">Notes</th> </tr></thead><tbody><tr> <th scope="row"><code>bin</code></th> <td>servidor mysqld, programas de cliente e utilitários</td> <td></td> </tr><tr> <th scope="row"><code>%PROGRAMDATA%\MySQL\MySQL Server 8.0\</code></th> <td>Arquivos de registro, bancos de dados</td> <td>A variável do sistema Windows<code>%PROGRAMDATA%</code>por padrão para<code>C:\ProgramData</code>.</td> </tr><tr> <th scope="row"><code>docs</code></th> <td>Documentação de lançamento</td> <td>Com o Instalador MySQL, use o<code>Modify</code>Para selecionar esta pasta opcional, execute a operação.</td> </tr><tr> <th scope="row"><code>include</code></th> <td>Include (header) files</td> <td></td> </tr><tr> <th scope="row"><code>lib</code></th> <td>Libraries</td> <td></td> </tr><tr> <th scope="row"><code>share</code></th> <td>Arquivos de suporte diversos, incluindo mensagens de erro, arquivos de conjunto de caracteres, arquivos de configuração de amostra, SQL para instalação de banco de dados</td> <td></td> </tr></tbody></table>

#### Métodos de instalação silenciosa

Use o Instalador MySQL, veja a Seção 2.3.3.5, “Referências do Console do Instalador MySQL”.

### 2.3.2 Escolhendo um pacote de instalação

Para o MySQL 8.0, há vários formatos de pacote de instalação disponíveis para escolher ao instalar o MySQL no Windows. Os formatos de pacote descritos nesta seção são:

* Instalador MySQL
* Arquivos ZIP noinstall MySQL
* Imagens Docker MySQL

Os arquivos do Banco de Dados do Programa (PDB) (com a extensão de nome de arquivo `pdb`) fornecem informações para depuração da sua instalação do MySQL, no caso de um problema. Esses arquivos estão incluídos nas distribuições de Arquivo ZIP (mas não nas distribuições MSI) do MySQL.

#### Instalador do MySQL

Este pacote tem um nome de arquivo semelhante a `mysql-installer-community-8.0.44.0.msi` ou `mysql-installer-commercial-8.0.44.0.msi`, e utiliza MSIs para instalar o servidor MySQL e outros produtos automaticamente. O Instalador do MySQL baixa e aplica atualizações em si mesmo e em cada um dos produtos instalados. Ele também configura o servidor MySQL instalado (incluindo uma configuração de teste de cluster InnoDB sandbox) e o MySQL Router. O Instalador do MySQL é recomendado para a maioria dos usuários.

O Instalador do MySQL pode instalar e gerenciar (adicionar, modificar, atualizar e remover) muitos outros produtos do MySQL, incluindo:

* Aplicações – MySQL Workbench, MySQL para Visual Studio, MySQL Shell e MySQL Router (consulte https://dev.mysql.com/doc/mysql-compat-matrix/en/)

* Conectores – MySQL Connector/C++, MySQL Connector/NET, Conector/ODBC, MySQL Conector/Python, MySQL Conector/J, MySQL Conector/Node.js

* Documentação – Manual do MySQL (formato PDF), amostras e exemplos

O Instalador do MySQL funciona em todas as versões do Windows compatíveis com o MySQL (consulte <https://www.mysql.com/support/supportedplatforms/database.html>).

Nota

Como o Instalador MySQL não é um componente nativo do Microsoft Windows e depende do .NET, ele não funciona com opções de instalação mínima, como a versão Server Core do Windows Server.

Para obter instruções sobre como instalar o MySQL usando o Instalador do MySQL, consulte a Seção 2.3.3, “Instalador do MySQL para Windows”.

#### Arquivos ZIP no MySQL noinstalável

Esses pacotes contêm os arquivos encontrados no pacote de instalação completo do MySQL Server, com exceção da GUI. Esse formato não inclui um instalador automatizado e deve ser instalado e configurado manualmente.

Os arquivos ZIP `noinstall` são divididos em dois arquivos comprimidos separados. O pacote principal é chamado `mysql-VERSION-winx64.zip`. Este contém os componentes necessários para usar o MySQL no seu sistema. A suíte de testes opcionais do MySQL, a suíte de benchmarks do MySQL e os componentes binários/de informações de depuração (incluindo arquivos PDB) estão em um arquivo comprimido separado chamado `mysql-VERSION-winx64-debug-test.zip`.

Se você optar por instalar um arquivo ZIP `noinstall`, consulte [Seção 2.3.4, “Instalando MySQL no Microsoft Windows usando um arquivo ZIP `noinstall`”](windows-install-archive.html "2.3.4 Installing MySQL on Microsoft Windows Using a noinstall ZIP Archive").

#### Imagens Docker do MySQL

Para obter informações sobre o uso das imagens do MySQL Docker fornecidas pela Oracle na plataforma Windows, consulte a Seção 2.5.6.3, “Deploying MySQL on Windows and Other Non-Linux Platforms with Docker”.

Aviso

As imagens do Docker do MySQL fornecidas pela Oracle são construídas especificamente para plataformas Linux. Outras plataformas não são suportadas, e os usuários que executam as imagens do Docker do MySQL da Oracle nelas estão fazendo isso por sua própria conta e risco.

### 2.3.3 Instalação do MySQL para Windows

O Instalador MySQL é uma aplicação independente projetada para facilitar a complexidade da instalação e configuração de produtos MySQL que funcionam no Microsoft Windows. Ele é baixado com e suporta os seguintes produtos MySQL:

* Servidores MySQL

O Instalador do MySQL pode instalar e gerenciar múltiplas instâncias de servidor MySQL separadas no mesmo host ao mesmo tempo. Por exemplo, o Instalador do MySQL pode instalar, configurar e atualizar instâncias separadas do MySQL 5.7 e do MySQL 8.0 no mesmo host. O Instalador do MySQL não permite atualizações de servidor entre números de versão major e minor, mas permite atualizações dentro de uma série de lançamento (como 8.0.36 para 8.0.37).

Nota

O Instalador do MySQL não pode instalar as versões *Community* e *Commercial* do servidor MySQL no mesmo host. Se você precisar de ambas as versões no mesmo host, considere usar a distribuição de arquivo ZIP [ZIP archive][(windows-choosing-package.html#windows-choosing-package-no-zip "MySQL noinstall ZIP Archives")] para instalar uma das versões.

* Aplicações MySQL

MySQL Workbench, MySQL Shell e MySQL Router.

* Conectores MySQL

Esses não são suportados, em vez disso, instale a partir de <https://dev.mysql.com/downloads/>. Esses conectores incluem MySQL Connector/NET, MySQL Connector/Python, MySQL Connector/ODBC, MySQL Connector/J, MySQL Connector/Node.js e MySQL Connector/C++.

Nota

Os conectores eram agrupados antes do Instalador MySQL 1.6.7 (MySQL Server 8.0.34), e o Instalador MySQL podia instalar cada conector até a versão 8.0.33 até o Instalador MySQL 1.6.11 (MySQL Server 8.0.37). O Instalador MySQL agora só detecta essas versões antigas dos conectores para desinstalá-las.

#### Requisitos de instalação

O Instalador do MySQL requer o Microsoft .NET Framework 4.5.2 ou uma versão posterior. Se essa versão não estiver instalada no computador hospedeiro, você pode baixá-la visitando o site da [Microsoft][(https://www.microsoft.com/en-us/download/details.aspx?id=42643)].

Para invocar o Instalador MySQL após uma instalação bem-sucedida:

1. Clique com o botão direito do mouse no botão Iniciar do Windows, selecione Executar e, em seguida, clique em Procurar. Navegue até `Program Files (x86) > MySQL > MySQL Installer for Windows` para abrir a pasta do programa.

2. Selecione um dos seguintes arquivos:

* `MySQLInstaller.exe` para abrir o aplicativo gráfico.

* `MySQLInstallerConsole.exe` para abrir o aplicativo de linha de comando.

3. Clique em Abrir e, em seguida, em OK na janela Executar. Se for solicitado para permitir que o aplicativo faça alterações no dispositivo, selecione `Yes`.

Cada vez que você invoca o Instalador MySQL, o processo de inicialização procura a presença de uma conexão à internet e solicita que você habilite o modo offline se não encontrar acesso à internet (e o modo offline estiver desativado). Selecione `Yes` para executar o Instalador MySQL sem capacidades de conexão à internet. A disponibilidade dos produtos MySQL é limitada apenas aos produtos atualmente na cache de produtos quando você habilita o modo offline. Para baixar os produtos MySQL, clique na ação rápida Desabilitar modo offline mostrada no painel.

Uma conexão à internet é necessária para baixar um manifesto que contém metadados dos últimos produtos MySQL que não fazem parte de um pacote completo. O MySQL Installer tenta baixar o manifesto quando você inicia o aplicativo pela primeira vez e, em seguida, periodicamente em intervalos configuráveis (consulte [MySQL Installer options][(mysql-installer-catalog-dashboard.html#mysql-installer-options-icon)]). Alternativamente, você pode recuperar um manifesto atualizado manualmente clicando em Catálogo no painel do MySQL Installer.

Nota

Se o download do manifesto realizado pela primeira vez ou subsequente não for bem-sucedido, um erro é registrado e você pode ter acesso limitado aos produtos MySQL durante sua sessão. O Instalador MySQL tenta fazer o download do manifesto em cada inicialização até que a estrutura inicial do manifesto seja atualizada. Para obter ajuda na localização de um produto a ser instalado, consulte Localizar produtos para instalação.

#### Lançamento da Comunidade do Instalador MySQL

Baixe o software do <https://dev.mysql.com/downloads/installer/> para instalar a versão comunitária de todos os produtos MySQL para Windows. Selecione uma das seguintes opções de pacote do Instalador MySQL:

* *Web*: Contém apenas os arquivos do instalador e de configuração do MySQL. A opção de pacote web baixa apenas os produtos do MySQL que você seleciona para instalar, mas requer uma conexão à internet para cada download. O tamanho deste arquivo é de aproximadamente 2 MB. O nome do arquivo tem a forma `mysql-installer-community-web-VERSION.N.msi`, na qual *`VERSION`* é o número da versão do servidor MySQL, como 8.0 e `N` é o número do pacote, que começa em 0.

* *Pacote Completo ou Atual*: Pacotes todos os produtos do MySQL para Windows (incluindo o servidor MySQL). O tamanho do arquivo é superior a 300 MB, e o nome tem a forma `mysql-installer-community-VERSION.N.msi`, na qual *`VERSION`* é o número da versão do MySQL Server, como 8.0 e `N` é o número do pacote, que começa em 0.

#### Lançamento Comercial do Instalador MySQL

Baixe o software do <https://edelivery.oracle.com/> para instalar a versão comercial (Padrão ou Edição Empresarial) dos produtos MySQL para Windows. Se você estiver logado na sua conta do My Oracle Support (MOS), a versão comercial inclui todas as versões atuais e anteriores do GA disponíveis na versão comunitária, mas exclui as versões de marco de desenvolvimento. Quando você não estiver logado, você verá apenas a lista de produtos empacotados que você já baixou.

O lançamento comercial também inclui os seguintes produtos:

* Workbench SE/EE
* MySQL Enterprise Backup
* MySQL Enterprise Firewall

A versão comercial se integra à sua conta MOS. Para conteúdo e patches da base de conhecimento, consulte [Meu Suporte Oracle][(https://support.oracle.com/)].

#### 2.3.3.1 Configuração inicial do instalador do MySQL

* Escolher um tipo de configuração
* Conflitos de caminho
* Verificar requisitos
* Arquivos de configuração do instalador MySQL

Quando você baixa o Instalador MySQL pela primeira vez, um assistente de configuração o guia pela instalação inicial dos produtos MySQL. Como a figura a seguir mostra, a configuração inicial é uma atividade única no processo geral. O Instalador MySQL detecta os produtos MySQL existentes instalados no host durante sua configuração inicial e os adiciona à lista de produtos a serem gerenciados.

**Figura 2.7 Visão geral do processo do instalador do MySQL**

![MySQL Installer process. Non-repeating steps: download MySQL Installer; perform the initial setup. Repeating steps: install products (download products, run .msi files, configuration, and install complete); manage products and update the MySQL Installer catalog.](images/mi-process-overview.png)

O Instalador do MySQL extrai os arquivos de configuração (descritos mais adiante) no disco rígido do host durante a configuração inicial. Embora o Instalador do MySQL seja um aplicativo de 32 bits, ele pode instalar binários tanto de 32 quanto de 64 bits.

A configuração inicial adiciona um link ao menu Iniciar sob o grupo de pastas de pasta MySQL. Clique em Iniciar, MySQL e Instalador MySQL - [Comunidade | Comercial] para abrir a versão comunitária ou comercial da ferramenta gráfica.

##### Escolhendo um tipo de configuração

Durante a configuração inicial, você será solicitado a selecionar os produtos MySQL a serem instalados no host. Uma alternativa é usar um tipo de configuração predeterminado que corresponda aos seus requisitos de configuração. Por padrão, os produtos GA e pré-lançamento estão incluídos no download e na instalação com os tipos de configuração Cliente apenas e Completo. Selecione a opção Instale apenas produtos GA para restringir o conjunto de produtos a incluir apenas produtos GA ao usar esses tipos de configuração.

Nota

Os produtos MySQL apenas comerciais, como o MySQL Enterprise Backup, estão disponíveis para seleção e instalação se você estiver usando a versão comercial do Instalador MySQL (consulte a versão comercial do Instalador MySQL).

Escolher um dos seguintes tipos de configuração determina apenas a instalação inicial e não limita sua capacidade de instalar ou atualizar produtos MySQL para Windows posteriormente:

* **Servidor apenas**: Instale apenas o servidor do MySQL. Este tipo de configuração instala o servidor de disponibilidade geral (GA) ou a versão de desenvolvimento que você selecionou ao baixar o MySQL Installer. Ele usa as permissões de instalação e caminhos de dados padrão.

* **Apenas para o cliente**: Instale apenas as aplicações MySQL mais recentes (como MySQL Shell, MySQL Router e MySQL Workbench). Este tipo de configuração exclui o servidor MySQL ou os programas do cliente normalmente incluídos com o servidor, como **mysql** ou **mysqladmin**.

* **Total**: Instale todos os produtos MySQL disponíveis, exceto os conectores MySQL.

* **Personalizado**: O tipo de configuração personalizada permite que você filtre e selecione produtos MySQL individuais do catálogo do Instalador MySQL.

Use o tipo de configuração `Custom` para instalar:

+ Um produto ou versão de produto que não está disponível nos locais de download habituais. O catálogo contém todas as versões do produto, incluindo as outras versões entre pré-lançamento (ou desenvolvimento) e GA.

+ Uma instância do servidor MySQL usando um caminho de instalação alternativo, um caminho de dados ou ambos. Para instruções sobre como ajustar os caminhos, consulte a Seção 2.3.3.2, “Definindo caminhos de servidor alternativos com o instalador MySQL”.

+ Duas ou mais versões do servidor MySQL no mesmo host ao mesmo tempo (por exemplo, 5.7 e 8.0).

+ Uma combinação específica de produtos e recursos que não são oferecidos como um tipo de configuração pré-definida. Por exemplo, você pode instalar um único produto, como o MySQL Workbench, em vez de instalar todas as aplicações do cliente para Windows.

##### Conflitos de caminho

Quando a pasta de instalação ou de dados padrão (requerida pelo servidor MySQL) para que um produto seja instalado já existe no host, o assistente exibe a etapa de Conflitos de caminho para identificar cada conflito e permitir que você tome medidas para evitar que os arquivos na pasta existente sejam sobrescritos pela nova instalação. Você vê essa etapa na configuração inicial apenas quando o Instalador MySQL detecta um conflito.

Para resolver o conflito de caminho, faça um dos seguintes:

* Selecione um produto da lista para exibir as opções de conflito. Um símbolo de alerta indica qual caminho está em conflito. Use o botão de navegação para escolher um novo caminho e, em seguida, clique em Próximo.

* Clique em Voltar para escolher um tipo de configuração ou versão do produto diferente, se aplicável. O tipo de configuração `Custom` permite que você selecione versões individuais do produto.

* Clique em Próximo para ignorar o conflito e sobrescrever os arquivos na pasta existente.

* Exclua o produto existente. Clique em Cancelar para interromper a configuração inicial e fechar o MySQL Installer. Abra novamente o MySQL Installer a partir do menu Iniciar e exclua o produto instalado do host usando a operação Exclua do painel do [MySQL Installer][(mysql-installer-catalog-dashboard.html#windows-product-dashboard "MySQL Installer Dashboard")].

##### Verifique os requisitos

O Instalador MySQL utiliza entradas no arquivo `package-rules.xml` para determinar se o software pré-requisito para cada produto está instalado no host. Quando a verificação dos requisitos falha, o Instalador MySQL exibe a etapa Verificar Requisitos para ajudá-lo a atualizar o host. Os requisitos são avaliados cada vez que você baixa um novo produto (ou versão) para instalação. A figura a seguir identifica e descreve as principais áreas desta etapa.

**Figura 2.8 Verificar Requisitos**

![MySQL Installer check-requirements before any requirements are downloaded and installed.](images/mi-requirements-annotated.png)

###### Descrição dos elementos dos requisitos de verificação

1. Mostra a etapa atual na configuração inicial. As etapas nesta lista podem mudar ligeiramente dependendo dos produtos já instalados no host, da disponibilidade do software pré-requisito e dos produtos que serão instalados no host.

2. Lista todos os requisitos de instalação pendentes por produto e indica o status da seguinte forma:

* Um espaço em branco na coluna Status significa que o Instalador MySQL pode tentar baixar e instalar o software necessário para você.

* A palavra *Manual* na coluna Status significa que você deve satisfazer o requisito manualmente. Selecione cada produto na lista para ver os detalhes do requisito.

3. Descreve o requisito em detalhes para ajudá-lo com cada resolução manual. Quando possível, é fornecida uma URL de download. Após baixar e instalar o software necessário, clique em Verificar para verificar se o requisito foi atendido.

4. Oferece as seguintes operações de conjunto para prosseguir:

* Voltar – Voltar ao passo anterior. Essa ação permite que você selecione um tipo de configuração diferente.

* Executar – Faça com que o Instalador MySQL tente baixar e instalar o software necessário para todos os itens sem status manual. As exigências manuais são resolvidas por você e verificadas clicando em Verificar.

* Próximo – Não execute a solicitação para aplicar os requisitos automaticamente e prossiga com a instalação sem incluir os produtos que falham na etapa de requisitos de verificação.

* Cancelar – Parar a instalação dos produtos MySQL. Como o MySQL Installer já está instalado, a configuração inicial é iniciada novamente quando você abre o MySQL Installer no menu Iniciar e clica em Adicionar no painel. Para uma descrição das operações de gerenciamento disponíveis, consulte o Catálogo de produtos.

##### Arquivos de configuração do instalador do MySQL

Todos os arquivos do Instalador MySQL estão localizados dentro dos pastas `C:\Program Files (x86)` e `C:\ProgramData`. O seguinte quadro descreve os arquivos e pastas que definem o Instalador MySQL como uma aplicação autônoma.

Nota

Os produtos instalados do MySQL não são alterados nem removidos quando você atualiza ou desinstala o Instalador do MySQL.

**Tabela 2.5 Arquivos de configuração do instalador MySQL**

<table><col style="width: 30%"/><col style="width: 40%"/><col style="width: 30%"/><thead><tr> <th scope="col">File or Folder</th> <th scope="col">Description</th> <th scope="col">Folder Hierarchy</th> </tr></thead><tbody><tr> <th scope="row"><code>MySQL Installer for Windows</code></th> <td>Este pasta contém todos os arquivos necessários para executar o MySQL Installer e o MySQLInstallerConsole.exe, um programa de linha de comando com funcionalidades semelhantes.</td> <td><code>C:\Program Files (x86)</code></td> </tr><tr> <th scope="row"><code>Templates</code></th> <td>O<code>Templates</code>O pasta tem um arquivo para cada versão do servidor MySQL. Os arquivos de modelo contêm chaves e fórmulas para calcular alguns valores dinamicamente.</td> <td><code>C:\ProgramData\MySQL\MySQL Installer for Windows\Manifest</code></td> </tr><tr> <th scope="row"><code>package-rules.xml</code></th> <td><p>Este arquivo contém os pré-requisitos para que cada produto seja instalado.</p></td> <td><code>C:\ProgramData\MySQL\MySQL Installer for Windows\Manifest</code></td> </tr><tr> <th scope="row"><code>products.xml</code></th> <td><p>O<code>products</code>O arquivo (ou catálogo de produtos) contém uma lista de todos os produtos disponíveis para download.</p></td> <td><code>C:\ProgramData\MySQL\MySQL Installer for Windows\Manifest</code></td> </tr><tr> <th scope="row"><code>Product Cache</code></th> <td><p>O<code>Product Cache</code>o diretório contém todos os aplicativos independentes<code>.msi</code>arquivos agrupados com o pacote completo ou baixados posteriormente.</p></td> <td><code>C:\ProgramData\MySQL\MySQL Installer for Windows</code></td> </tr></tbody></table>

#### 2.3.3.2 Configurando caminhos alternativos de servidor com o instalador do MySQL

Você pode alterar o caminho de instalação padrão, o caminho dos dados ou ambos quando você instala o servidor MySQL. Após instalar o servidor, os caminhos não podem ser alterados sem remover e reinstalar a instância do servidor.

Nota

A partir do MySQL Installer 1.4.39, se você mover o diretório de dados de um servidor instalado manualmente, o MySQL Installer identifica a mudança e pode processar uma operação de reconfiguração sem erros.

**Para alterar caminhos para o servidor MySQL**

1. Identifique o servidor MySQL a ser alterado e ative o link Opções Avançadas da seguinte forma:

1. Vá para a página Selecionar Produtos fazendo um dos seguintes:

1. Se esta for uma (mysql-installer-setup.html "2.3.3.1 MySQL Installer Initial Setup") de instalação do MySQL, selecione o tipo de instalação `Custom` e clique em Próximo.

2. Se o Instalador MySQL estiver instalado no seu computador, clique em Adicionar no painel de controle.

2. Clique em Editar para aplicar um filtro na lista de produtos exibida em Produtos disponíveis (consulte Localizar produtos para instalação).

3. Com a instância do servidor selecionada, use a seta para mover o servidor selecionado para a lista de Produtos a serem instalados.

4. Clique no servidor para selecioná-lo. Quando você selecionar o servidor, o link Opções Avançadas será ativado abaixo da lista de produtos a serem instalados (consulte a figura a seguir).

2. Clique em Opções Avançadas para abrir uma caixa de diálogo onde você pode inserir nomes de caminho alternativos. Após os nomes de caminho serem validados, clique em Próximo para continuar com os passos de configuração.

**Figura 2.9 Mudar o caminho do servidor MySQL**

   ![Content is described in the surrounding text.](images/mi-path-advanced-options-annotated.png)

#### 2.3.3.3 Fluxos de trabalho de instalação com o instalador MySQL

O Instalador MySQL oferece uma ferramenta semelhante a um assistente para instalar e configurar novos produtos MySQL para o Windows. Ao contrário da configuração inicial, que é executada apenas uma vez, o Instalador MySQL invoca o assistente cada vez que você baixa ou instala um novo produto. Para instalações de primeira vez, os passos da configuração inicial procedem diretamente para os passos da instalação. Para obter assistência com a seleção do produto, consulte Localizar produtos para instalação.

Nota

São concedidos permissões completas ao usuário que executa o Instalador MySQL para todos os arquivos gerados, como `my.ini`. Isso não se aplica a arquivos e diretórios de produtos específicos, como o diretório de dados do servidor MySQL em `%ProgramData%` que pertence a `SYSTEM`.

Os produtos instalados e configurados em um host seguem um padrão geral que pode exigir sua intervenção durante as várias etapas. Se você tentar instalar um produto que é incompatível com a versão do servidor MySQL existente (ou uma versão selecionada para atualização), você será alertado sobre o possível desajuste.

O Instalador do MySQL fornece a seguinte sequência de ações que se aplicam a diferentes fluxos de trabalho:

* **Selecionar Produtos.** Se você selecionou o tipo de configuração `Custom` durante a configuração inicial ou clicou em Adicionar no painel do [MySQL Installer][(mysql-installer-catalog-dashboard.html#windows-product-dashboard "MySQL Installer Dashboard")], o MySQL Installer inclui essa ação na barra lateral. Nesta página, você pode aplicar um filtro para modificar a lista de Produtos Disponíveis e, em seguida, selecionar um ou mais produtos para mover (usando as teclas de seta) para a lista de Produtos a serem instalados.

Marque a caixa de seleção nesta página para ativar a ação Selecionar características, onde você pode personalizar as características dos produtos após o produto ser baixado.

* **Baixar.** Se você instalou o pacote completo (não web) do instalador MySQL, todos os arquivos `.msi` foram carregados na pasta `Product Cache` durante a configuração inicial e não são baixados novamente. Caso contrário, clique em Executar para iniciar o download. O status de cada produto muda de `Ready to Download`, para `Downloading`, e depois para `Downloaded`.

Para tentar novamente um único download não bem-sucedido, clique no link Tentar novamente.

Para tentar novamente todos os downloads não bem-sucedidos, clique em Tentar tudo.

* **Selecionar as funcionalidades a serem instaladas (desativada por padrão).** Após o instalador MySQL baixar o arquivo `.msi` de um produto, você pode personalizar as funcionalidades se tiver habilitado a caixa de seleção opcional anteriormente durante a ação Selecionar produtos.

Para personalizar as características do produto após a instalação, clique em Modificar no painel do [MySQL Installer][(mysql-installer-catalog-dashboard.html#windows-product-dashboard "MySQL Installer Dashboard")].

* **Instalação. O status de cada produto na lista muda de `Ready to Install`, para `Installing`, e, por fim, para `Complete`. Durante o processo, clique em Mostrar detalhes para visualizar as ações de instalação.

Se você cancelar a instalação neste ponto, os produtos serão instalados, mas o servidor (se instalado) ainda não está configurado. Para reiniciar a configuração do servidor, abra o Instalador MySQL no menu Iniciar e clique em Reconfigurar ao lado do servidor apropriado no painel.

* **Configuração do produto.** Este passo se aplica apenas ao MySQL Server, MySQL Router e amostras. O status para cada item na lista deve indicar `Ready to Configure`. Clique em Próximo para iniciar o assistente de configuração para todos os itens na lista. As opções de configuração apresentadas durante este passo são específicas para a versão do banco de dados ou roteador que você selecionou para instalar.

Clique em Executar para começar a aplicar as opções de configuração ou clique em Voltar (repetidamente) para retornar a cada página de configuração.

* **Instalação completa.** Este passo finaliza a instalação para produtos que não requerem configuração. Ele permite que você copie o log em um clipboard e comece a usar certas aplicações, como o MySQL Workbench e o MySQL Shell. Clique em "Concluir" para abrir o painel do [MySQL Installer][(mysql-installer-catalog-dashboard.html#windows-product-dashboard "MySQL Installer Dashboard")].

##### 2.3.3.3.1 Configuração do MySQL Server com o Instalador MySQL

O Instalador do MySQL realiza a configuração inicial do servidor MySQL. Por exemplo:

* Cria o arquivo de configuração (`my.ini`) que é usado para configurar o servidor MySQL. Os valores escritos neste arquivo são influenciados pelas escolhas que você faz durante o processo de instalação. Algumas definições dependem do host.

* Por padrão, um serviço do Windows para o servidor MySQL é adicionado.
* Fornece caminhos de instalação e de dados padrão para o servidor MySQL. Para instruções sobre como alterar os caminhos padrão, consulte a Seção 2.3.3.2, “Definindo caminhos de servidor alternativos com o instalador do MySQL”.

* Opcionalmente, pode criar contas de usuário do servidor MySQL com permissões configuráveis com base em papéis gerais, como Administrador de banco de dados, Desenvolvedor de banco de dados e Administrador de backup. Opcionalmente, cria um usuário do Windows chamado `MysqlSys` com privilégios limitados, que então executará o servidor MySQL.

As contas de usuário também podem ser adicionadas e configuradas no MySQL Workbench.

* Verificar Mostrar Opções Avançadas permite que opções de registro adicionais sejam definidas. Isso inclui definir caminhos de arquivo personalizados para o log de erro, log geral, log de consultas lentas (incluindo a configuração dos segundos necessários para executar uma consulta) e o log binário.

Durante o processo de configuração, clique em Próximo para prosseguir para o próximo passo ou em Voltar para retornar ao passo anterior. Clique em Executar no passo final para aplicar a configuração do servidor.

As seções que seguem descrevem as opções de configuração do servidor que se aplicam ao servidor MySQL no Windows. A versão do servidor que você instalou determinará quais etapas e opções você pode configurar. Configurar o servidor MySQL pode incluir algumas ou todas as etapas.

###### 2.3.3.3.1.1 Tipo e rede de comunicação

* Tipo de Configuração do Servidor

Escolha o tipo de configuração do servidor MySQL que descreve sua configuração. Esta configuração define a quantidade de recursos do sistema (memória) a ser atribuída à sua instância do servidor MySQL.

+ **Desenvolvimento**: Um computador que hospeda muitas outras aplicações, e, normalmente, essa é sua estação de trabalho pessoal. Esta configuração configura o MySQL para usar a menor quantidade de memória.

+ **Servidor**: Espera-se que várias outras aplicações funcionem nesse computador, como um servidor web. A configuração do Servidor configura o MySQL para usar uma quantidade média de memória.

+ **Dedicado**: Um computador que é dedicado para executar o servidor MySQL. Como nenhuma outra aplicação importante é executada neste servidor, esta configuração configura o MySQL para usar a maioria da memória disponível.

+ **Manual**

Previne o MySQL Installer de tentar otimizar a instalação do servidor e, em vez disso, define os valores padrão para as variáveis do servidor incluídas no arquivo de configuração `my.ini`. Com o tipo `Manual` selecionado, o MySQL Installer usa o valor padrão de 16M para a atribuição da variável `tmp_table_size`.

* Conectividade

As opções de conectividade controlam a forma como a conexão com o MySQL é feita. As opções incluem:

+ TCP/IP: Esta opção é selecionada por padrão. Você pode desativar a Rede TCP/IP para permitir conexões apenas do host local. Com a opção de conexão TCP/IP selecionada, você pode modificar os seguintes itens:

- Porta para conexões clássicas com o protocolo MySQL. O valor padrão é `3306`.

- Protocolo X Port exibido ao configurar o servidor MySQL 8.0. O valor padrão é `33060`

- Abra a porta do Firewall do Windows para acesso à rede, que é selecionada por padrão para conexões TCP/IP.

Se um número de porta já estiver em uso, você verá o ícone de informação (!) ao lado do valor padrão e o botão Próximo será desativado até que você forneça um novo número de porta.

+ Pipe nomeado: Habilitar e definir o nome do pipe, semelhante a definir a variável de sistema `named_pipe`. O nome padrão é `MySQL`.

Quando você seleciona a conectividade de Pipe Nomeado e, em seguida, prossegue para o próximo passo, você será solicitado a definir o nível de controle de acesso concedido ao software do cliente nas conexões de pipe nomeado. Alguns clientes exigem apenas controle mínimo de acesso para comunicação, enquanto outros clientes exigem acesso total ao pipe nomeado.

Você pode definir o nível de controle de acesso com base no usuário (ou usuários) do Windows que executam o cliente da seguinte forma:

- **Acesso mínimo para todos os usuários (RECOMENDADO).** Esse nível é ativado por padrão porque é o mais seguro.

- **Acesso total a membros de um grupo local.** Se a opção de acesso mínimo for restritiva demais para o software do cliente, use esta opção para reduzir o número de usuários que têm acesso total no tubo nomeado. O grupo deve ser estabelecido no Windows antes de poder ser selecionado da lista. A associação a este grupo deve ser limitada e gerenciada. O Windows exige que um membro recém-adicionado faça logout e, em seguida, faça login novamente para se juntar a um grupo local.

- **Acesso total a todos os usuários (NÃO RECOMENDADO).** Esta opção é menos segura e deve ser definida apenas quando outras medidas de segurança são implementadas.

+ Memória compartilhada: Ative e defina o nome da memória, semelhante ao definir a variável de sistema `shared_memory`. O nome padrão é `MySQL`.

* Configuração Avançada

Verifique Mostrar opções avançadas e de registro para definir opções de registro personalizadas nas etapas subsequentes. O passo Opções de registro permite definir caminhos de arquivo personalizados para o log de erro, log geral, log de consultas lentas (incluindo a configuração dos segundos necessários para executar uma consulta) e o log binário. O passo Opções avançadas permite definir o ID único do servidor necessário quando o registro binário está habilitado em uma topologia de replicação.

* Firewall empresarial MySQL (apenas a Edição Empresarial)

A caixa de seleção Habilitar o firewall empresarial do MySQL é desmarcada por padrão. Selecione esta opção para habilitar uma lista de segurança que ofereça proteção contra certos tipos de ataques. É necessária uma configuração adicional após a instalação (consulte Seção 8.4.7, "Firewall empresarial do MySQL").

###### 2.3.3.3.1.2 Método de autenticação

O passo Método de autenticação é visível apenas durante a instalação ou atualização do MySQL 8.0.4 ou superior. Ele introduz uma escolha entre duas opções de autenticação no lado do servidor. As contas de usuário do MySQL que você criar no próximo passo usarão o método de autenticação que você selecionar neste passo.

Os conectores e drivers da comunidade do MySQL 8.0 que utilizam `libmysqlclient` 8.0 agora suportam o plugin de autenticação padrão `caching_sha2_password`. No entanto, se você não puder atualizar seus clientes e aplicativos para suportar esse novo método de autenticação, pode configurar o servidor MySQL para usar `mysql_native_password` para autenticação legada. Para obter mais informações sobre as implicações dessa mudança, consulte `caching_sha2_password` como o Plugin de Autenticação Preferido.

Se você estiver instalando ou atualizando para o MySQL 8.0.4 ou superior, selecione um dos seguintes métodos de autenticação:

* Use criptografia de senha forte para autenticação (RECOMENDADO)

O MySQL 8.0 suporta uma nova autenticação baseada em métodos de senha mais fortes e aprimorados baseados em SHA256. É recomendável que todas as novas instalações do servidor MySQL usem esse método a partir de agora.

Importante

O plugin de autenticação `caching_sha2_password` no servidor requer novas versões de conectores e clientes, que adicionam suporte para a nova autenticação padrão do MySQL 8.0.

* Use o Método de Autenticação Legado (Retire a Compatibilidade com o MySQL 5.x)

O uso do antigo método de autenticação legado do MySQL 5.x deve ser considerado apenas nos seguintes casos:

+ Os aplicativos não podem ser atualizados para usar os conectores e drivers do MySQL 8.0.

+ A recompilação de um aplicativo existente não é viável.

+ Um conector ou driver atualizado, específico para o idioma, ainda não está disponível.

###### 2.3.3.3.1.3 Contas e papéis

* Senha da Conta Raiz

É necessário atribuir uma senha de raiz e você será solicitado a fornecê-la ao realizar outras operações do Instalador MySQL. A força da senha é avaliada quando você repete a senha na caixa fornecida. Para informações descritivas sobre os requisitos ou status da senha, mova o ponteiro do mouse sobre o ícone de informação (!) quando ele aparecer.

* Contas de Usuário do MySQL (Opcional)

Clique em Adicionar Usuário ou Editar Usuário para criar ou modificar contas de usuário do MySQL com papéis predefinidos. Em seguida, insira as credenciais da conta necessárias:

+ Nome do usuário: os nomes de usuário do MySQL podem ter até 32 caracteres.

+ Host: Selecione `localhost` para conexões locais apenas ou `<All Hosts (%)>` quando são necessárias conexões remotas ao servidor.

+ Papel: Cada papel predefinido, como `DB Admin`, é configurado com seu próprio conjunto de privilégios. Por exemplo, o papel `DB Admin` tem mais privilégios do que o papel `DB Designer`. A lista suspensa de Papel contém uma descrição de cada papel.

+ Senha: A avaliação da força da senha é realizada enquanto você digita a senha. As senhas devem ser confirmadas. O MySQL permite uma senha em branco ou vazia (considerada insegura).

**Apenas para lançamento comercial do MySQL Installer:** A Edição Empresarial do MySQL para Windows, um produto comercial, também suporta um método de autenticação que realiza autenticação externa no Windows. As contas autenticadas pelo sistema operacional do Windows podem acessar o servidor MySQL sem fornecer uma senha adicional.

Para criar uma nova conta MySQL que use autenticação do Windows, insira o nome do usuário e, em seguida, selecione um valor para Host e Role. Clique em Autenticação do Windows para habilitar o plugin `authentication_windows`. Na área Tokens de Segurança do Windows, insira um token para cada usuário (ou grupo) do Windows que possa autenticar com o nome do usuário do MySQL. As contas do MySQL podem incluir tokens de segurança tanto para usuários locais do Windows quanto para usuários do Windows que pertencem a um domínio. Múltiplos tokens de segurança são separados pelo caractere ponto e vírgula (`;`) e usam o seguinte formato para contas locais e de domínio:

+ Conta local

Digite o nome simples do usuário do Windows como o token de segurança para cada usuário ou grupo local; por exemplo, **`finley;jeffrey;admin`**.

+ Conta de domínio

Use a sintaxe padrão do Windows (*`domain`*`\`*`domainuser`*) ou a sintaxe do MySQL (*`domain`*`\\`*`domainuser`*) para inserir usuários e grupos do domínio do Windows.

Para contas de domínio, você pode precisar usar as credenciais de um administrador dentro do domínio, se a conta que executa o Instalador MySQL não tiver as permissões para consultar o Active Directory. Se este for o caso, selecione Valide usuários do Active Directory para ativar as credenciais do administrador do domínio.

A autenticação do Windows permite que você teste todos os tokens de segurança cada vez que você adicionar ou modificar um token. Clique em Testar Tokens de Segurança para validar (ou revalidar) cada token. Tokens inválidos geram uma mensagem de erro descritiva junto com um ícone `X` vermelho e texto do token vermelho. Quando todos os tokens são resolvidos como válidos (texto verde sem um ícone `X`, você pode clicar em OK para salvar as alterações.

###### 2.3.3.3.1.4 Serviço do Windows

Na plataforma Windows, o servidor MySQL pode ser executado como um serviço com nome gerenciado pelo sistema operacional e configurado para iniciar automaticamente quando o Windows é iniciado. Alternativamente, você pode configurar o servidor MySQL para ser executado como um programa executável que requer configuração manual.

* Configure o servidor MySQL como um serviço do Windows (selecionado por padrão).

Quando a opção de configuração padrão é selecionada, você também pode selecionar o seguinte:

+ Inicie o servidor MySQL no início do sistema

Quando selecionado (padrão), o tipo de inicialização do serviço é definido como Automático; caso contrário, o tipo de inicialização é definido como Manual.

+ Execute o Serviço do Windows como

Quando a Conta padrão do sistema é selecionada (padrão), o serviço inicia sessão como Serviço de rede.

A opção Usuário Personalizado deve ter privilégios para fazer login no Microsoft Windows como um serviço. O botão Próximo será desabilitado até que este usuário seja configurado com os privilégios necessários.

Uma conta de usuário personalizada é configurada no Windows, procurando "política de segurança local" no menu Iniciar. Na janela Política de Segurança Local, selecione Políticas locais, Atribuição de direitos do usuário e, em seguida, Conectar-se como um serviço para abrir o diálogo de propriedades. Clique em Adicionar usuário ou grupo para adicionar o usuário personalizado e, em seguida, clique em OK em cada diálogo para salvar as alterações.

Desative a opção Serviços do Windows.

###### 2.3.3.3.1.5 Permissões de arquivo do servidor

Opcionalmente, as permissões definidas nas pastas e arquivos localizados em `C:\ProgramData\MySQL\MySQL Server 8.0\Data` podem ser gerenciadas durante a operação de configuração do servidor. Você tem as seguintes opções:

* O Instalador do MySQL pode configurar as pastas e arquivos com controle total concedido exclusivamente ao usuário que executa o serviço do Windows, se aplicável, e ao grupo Administradores.

Todos os outros grupos e usuários são negados acesso. Esta é a opção padrão.

* Faça com que o Instalador MySQL use uma opção de configuração semelhante àquela descrita acima, mas também faça com que o Instalador MySQL mostre quais usuários poderiam ter controle total.

Você pode então decidir se um grupo ou usuário deve ter controle total. Se não, você pode mover os membros qualificados desta lista para uma segunda lista que restringe todo o acesso.

* Faça com que o Instalador MySQL ignore as alterações de permissão de arquivo durante a operação de configuração.

Se você selecionar essa opção, você será responsável por proteger a pasta `Data` e seus arquivos relacionados manualmente após a conclusão da configuração do servidor.

###### 2.3.3.3.1.6 Opções de registro

Essa etapa está disponível se a caixa de seleção Mostrar configuração avançada foi selecionada durante a etapa Tipo e Rede. Para habilitar essa etapa agora, clique em Voltar para retornar à etapa Tipo e Rede e selecione a caixa de seleção.

As opções de configuração avançada estão relacionadas aos seguintes arquivos de registro do MySQL:

* Diário de erros
* Diário geral
* Diário de consultas lentas
* Diário de binários

Nota

O log binário é ativado por padrão.

###### 2.3.3.3.1.7 Opções Avançadas

Essa etapa está disponível se a caixa de seleção Mostrar configuração avançada foi selecionada durante a etapa Tipo e Rede. Para habilitar essa etapa agora, clique em Voltar para retornar à etapa Tipo e Rede e selecione a caixa de seleção.

As opções de configuração avançada incluem:

* ID do servidor

Defina o identificador único usado em uma topologia de replicação. Se o registro binário estiver habilitado, você deve especificar um ID do servidor. O valor padrão do ID depende da versão do servidor. Para mais informações, consulte a descrição da variável de sistema `server_id`.

* Caso de Nomes de Tabelas

Você pode definir as seguintes opções durante a configuração inicial e subsequente do servidor. Para a série de lançamento do MySQL 8.0, essas opções se aplicam apenas à configuração inicial do servidor.

+ Minúsculas

Define o valor da opção `lower_case_table_names` para 1 (padrão), na qual os nomes dos tabelas são armazenados em minúsculas no disco e as comparações não são sensíveis ao caso.

+ Preservar o caso dado

Define o valor da opção `lower_case_table_names` para 2, na qual os nomes dos tabelas são armazenados conforme fornecido, mas comparados em minúsculas.

###### 2.3.3.3.1.8 Aplicar configuração do servidor

Todos os ajustes de configuração são aplicados ao servidor MySQL quando você clica em Executar. Use a guia Etapas de Configuração para acompanhar o progresso de cada ação; o ícone para cada um muda do branco para verde (com uma marca de verificação) no sucesso. Caso contrário, o processo para e exibe uma mensagem de erro se uma ação individual ficar bloqueada. Clique na guia Log para visualizar o log.

Quando a instalação for concluída com sucesso e você clicar em "Concluir", o MySQL Installer e os produtos instalados do MySQL serão adicionados ao menu Iniciar do Microsoft Windows sob o grupo `MySQL`. Ao abrir o MySQL Installer, o painel será carregado, onde os produtos instalados do MySQL serão listados e outras operações do MySQL Installer estarão disponíveis.

##### 2.3.3.3.2 Configuração do roteador MySQL com o instalador MySQL

Durante a configuração inicial (mysql-installer-setup.html "2.3.3.1 MySQL Installer Initial Setup"), escolha qualquer tipo de configuração predeterminado, exceto `Server only`, para instalar a versão mais recente da ferramenta GA. Use o tipo de configuração `Custom` para instalar uma ferramenta individual ou versão específica. Se o Instalador MySQL já estiver instalado no host, use a operação Adicionar para selecionar e instalar ferramentas do painel do Instalador MySQL.

###### Configuração do roteador MySQL

O Instalador do MySQL oferece um assistente de configuração que pode iniciar uma instância instalada do MySQL Router 8.0 para direcionar o tráfego entre aplicativos do MySQL e um InnoDB Cluster. Quando configurado, o MySQL Router é executado como um serviço local do Windows.

Nota

Você é solicitado a configurar o MySQL Router após a instalação inicial e quando você reconfigura explicitamente um roteador instalado. Em contraste, a operação de atualização não exige ou solicita que você configure o produto atualizado.

Para configurar o MySQL Router, faça o seguinte:

1. Configure o InnoDB Cluster.
2. Usando o Instalador do MySQL, faça o download e instale o aplicativo MySQL Router. Após a conclusão da instalação, o assistente de configuração solicitará informações. Selecione a caixa de seleção Configurar o MySQL Router para InnoDB Cluster para iniciar a configuração e forneça os seguintes valores de configuração:

* Nome de domínio: Nome de domínio do servidor primário (séptimo) no Cluster InnoDB (`localhost` por padrão).

* Porto: O número do porto do servidor primário (séptimo) no InnoDB Cluster (`3306` por padrão).

* Usuário de Gerenciamento: Um usuário administrativo com privilégios de nível raiz.

* Senha: A senha para o usuário de administração.

* Conexões clássicas com o protocolo MySQL para o InnoDB Cluster

Leitura/Escrita: Defina o número do primeiro número de porta não utilizado (entre 80 e 65532) e o assistente selecionará os restantes portos para você.

A figura que segue mostra um exemplo da página de configuração do roteador MySQL, com o primeiro número de porta de base especificado como 6446 e as demais portas definidas pelo assistente como 6447, 6448 e 6449.

**Figura 2.10 Configuração do roteador MySQL**

   ![Content is described in the surrounding text.](images/mi-router-config.png)

3. Clique em Próximo e, em seguida, em Executar para aplicar a configuração. Clique em Finalizar para fechar o Instalador MySQL ou retornar ao painel do [Instalador MySQL][(mysql-installer-catalog-dashboard.html#windows-product-dashboard "MySQL Installer Dashboard")].

Após configurar o MySQL Router, a conta de root existe na tabela de usuários como `root@localhost` (local) apenas, em vez de `root@%` (remoto). Independentemente de onde o roteador e o cliente estão localizados, mesmo que ambos estejam localizados no mesmo host do servidor de semente, qualquer conexão que passe pelo roteador é vista pelo servidor como sendo remota, não local. Como resultado, uma conexão feita para o servidor usando o host local (veja o exemplo que segue), não se autentica.

```
$> \c root@localhost:6446
```

#### 2.3.3.4 Catálogo e Painel de Controle do Instalador do MySQL
#### 2.3.3.5.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1

Esta seção descreve o catálogo do produto do MySQL Installer, o painel de controle e outras ações relacionadas à seleção e atualização do produto.

* Catálogo de produtos
* Painel do instalador do MySQL
* Localizando os produtos a serem instalados
* Atualizando o servidor MySQL
* Removendo o servidor MySQL
* Atualizando o instalador do MySQL

##### Catálogo de Produtos

O catálogo de produtos armazena a lista completa dos produtos MySQL lançados para Microsoft Windows, disponíveis para download em [MySQL Downloads][(https://dev.mysql.com/downloads/)]. Por padrão, e quando uma conexão com a Internet está presente, o Instalador MySQL tenta atualizar o catálogo no início de cada sete dias. Você também pode atualizar o catálogo manualmente no painel de controle (descrito mais adiante).

Um catálogo atualizado realiza as seguintes ações:

* Popula a aba "Produtos disponíveis" da página "Selecionar produtos". Esse passo aparece quando você seleciona:

+ O tipo de configuração `Custom` durante a configuração inicial [(mysql-installer-setup.html "2.3.3.1 MySQL Installer Initial Setup")].

+ A operação Adicionar a partir do painel de controle.

* Identifica quando atualizações de produtos estão disponíveis para os produtos instalados listados no painel de controle.

O catálogo inclui todas as versões de desenvolvimento (Pré-Lançamento), versões gerais (Atual GA) e versões menores (Outras versões). Os produtos no catálogo variam um pouco, dependendo da versão do Instalador MySQL que você baixar.

##### Painel do Instalador do MySQL

O painel do Instalador do MySQL é a visualização padrão que você vê quando inicia o Instalador do MySQL após o término da configuração inicial. Se você fechou o Instalador do MySQL antes do término da configuração, o Instalador do MySQL retoma a configuração inicial antes de exibir o painel.

Nota

Os produtos cobertos pelo Suporte de Manutenção Vitalício da Oracle, se instalados, podem aparecer no painel de controle. Esses produtos, como MySQL para Excel e MySQL Notifier, podem ser modificados ou removidos apenas.

**Figura 2.11 Elementos do painel do instalador do MySQL**

![Content is described in the surrounding text.](images/mi-dashboard-annotated.png)

###### Descrição dos elementos do painel do instalador do MySQL

1. As operações do painel do Instalador do MySQL fornecem uma variedade de ações que se aplicam a produtos instalados ou produtos listados no catálogo. Para iniciar as operações a seguir, clique primeiro no link da operação e, em seguida, selecione o produto ou os produtos a serem gerenciados:

* Adicionar: Esta operação abre a página Selecionar Produtos. De lá, você pode ajustar o filtro, selecionar um ou mais produtos para baixar (se necessário) e iniciar a instalação. Para dicas sobre o uso do filtro, consulte Localizar Produtos para Instalar.

Use as setas direcionais para mover cada produto da coluna Produtos disponíveis para a coluna Produtos a serem instalados. Para habilitar a página de Recursos do produto, onde você pode personalizar recursos, clique na caixa de seleção relacionada (desabilitada por padrão).

* Modificar: Use esta operação para adicionar ou remover as características associadas aos produtos instalados. As características que você pode modificar variam em complexidade de acordo com o produto. Quando a caixa de seleção Atalho do programa é selecionada, o produto aparece no menu Iniciar sob o grupo `MySQL`.

* Atualização: Esta operação carrega a página Selecionar Produtos para Atualização e a preenche com todos os candidatos à atualização. Um produto instalado pode ter mais de uma versão de atualização e a operação requer um catálogo de produtos atual. O MySQL Installer atualiza todos os produtos selecionados em uma ação. Clique em Mostrar detalhes para visualizar as ações realizadas pelo MySQL Installer.

* Remova: Esta operação abre a página Remover produtos e a preenche com os produtos MySQL instalados no host. Selecione os produtos MySQL que deseja remover (desinstalar) e, em seguida, clique em Executar para iniciar o processo de remoção. Durante a operação, um indicador mostra o número de etapas que são executadas como uma porcentagem de todas as etapas.

Para selecionar os produtos a serem removidos, faça um dos seguintes:

+ Selecione a caixa de seleção para um ou mais produtos.  
+ Selecione a caixa de seleção Produto para selecionar todos os produtos.

2. O link Reconfigurar na coluna Ação Rápida ao lado de cada servidor instalado carrega os valores de configuração atuais do servidor e, em seguida, percorre todos os passos de configuração, permitindo que você altere as opções e os valores. Você deve fornecer credenciais com privilégios de administrador para reconfigurar esses itens. Clique na guia Log para exibir a saída de cada etapa de configuração realizada pelo Instalador MySQL.

Após a conclusão, o Instalador do MySQL para com o servidor, aplica as alterações de configuração e reinicia o servidor para você. Para uma descrição de cada opção de configuração, consulte a Seção 2.3.3.3.1, “Configuração do Servidor MySQL com o Instalador do MySQL”. O `Samples and Examples` instalado associado a uma versão específica do servidor MySQL também pode ser reconfigurado para aplicar novos ajustes de recursos, se houver.

3. O link do catálogo permite que você faça o download do catálogo mais recente dos produtos MySQL manualmente e, em seguida, integre essas alterações dos produtos com o MySQL Installer. A ação de download do catálogo não realiza uma atualização dos produtos já instalados no host. Em vez disso, retorna ao painel e adiciona um ícone de seta à coluna Versão para cada produto instalado que tenha uma versão mais recente. Use a operação de Atualização para instalar a versão mais recente do produto.

Você também pode usar o link do Catálogo para exibir o histórico de alterações atuais de cada produto sem fazer o download do novo catálogo. Selecione a caixa de seleção Não atualizar neste momento para visualizar apenas o histórico de alterações.

4. O ícone do Instalação do MySQL (!) mostra a versão atual do MySQL e informações gerais sobre o MySQL. O número da versão está localizado acima do botão Voltar.

Dica

Sempre inclua este número de versão ao relatar um problema com o Instalador do MySQL.

Além das informações sobre o MySQL (!), você também pode selecionar os seguintes ícones do painel lateral:

* ícone de licença (!) para o Instalador MySQL.

Este produto pode incluir software de terceiros, utilizado sob licença. Se você estiver usando uma versão comercial do MySQL Installer, o ícone abre o Manual do Usuário de Informações de Licença do MySQL Installer Comercial para informações de licenciamento, incluindo informações de licenciamento relacionadas ao software de terceiros que podem ser incluídas nesta versão comercial. Se você estiver usando uma versão comunitária do MySQL Installer, o ícone abre o Manual do Usuário de Informações de Licença do MySQL Installer Comunitário para informações de licenciamento, incluindo informações de licenciamento relacionadas ao software de terceiros que podem ser incluídas nesta versão comunitária.

* Conexão de recursos com o ícone (!) para a documentação mais recente do produto MySQL, blogs, webinars e muito mais.

5. O ícone Opções do Instalador MySQL (!) inclui as seguintes guias:

* Geral: Habilita ou desabilita a opção Modo Off-line. Se selecionada, esta opção configura o Instalador MySQL para funcionar sem depender das capacidades de conexão à internet. Ao executar o Instalador MySQL em modo off-line, você verá um aviso junto com uma ação rápida Desabilitar no painel de controle. O aviso serve para lembrá-lo de que executar o Instalador MySQL em modo off-line o impede de baixar os últimos produtos MySQL e atualizações do catálogo de produtos. O modo off-line persiste até que você desabilite a opção.

Ao iniciar, o Instalador do MySQL determina se há uma conexão com a internet e, se não houver, solicita que você habilite o modo offline para continuar trabalhando sem conexão.

* Catálogo de produtos: Gerencia as atualizações automáticas do catálogo. Por padrão, o Instalador MySQL verifica as atualizações do catálogo ao iniciar, a cada sete dias. Quando novos produtos ou versões de produtos estão disponíveis, o Instalador MySQL os adiciona ao catálogo e, em seguida, insere um ícone de seta (!) ao lado do número da versão dos produtos instalados listados no painel de controle.

Use a opção do catálogo de produtos para habilitar ou desabilitar atualizações automáticas e para redefinir o número de dias entre os downloads automáticos do catálogo. Ao iniciar, o Instalador MySQL usa o número de dias que você definiu para determinar se um download deve ser tentado. Essa ação é repetida durante a próxima inicialização se o Instalador MySQL encontrar um erro ao baixar o catálogo.

* Configurações de Conectividade: Várias operações realizadas pelo Instalador MySQL requerem acesso à internet. Esta opção permite que você use um valor padrão para validar a conexão ou usar um URL diferente, um selecionado de uma lista ou adicionado manualmente. Com a opção Manual selecionada, novos URLs podem ser adicionados e todos os URLs na lista podem ser movidos ou excluídos. Quando a opção Automática é selecionada, o Instalador MySQL tenta se conectar a cada URL padrão na lista (em ordem) até que uma conexão seja feita. Se nenhuma conexão puder ser feita, ele gera um erro.

* Proxy: O Instalador MySQL oferece vários modos de proxy que permitem que você baixe produtos, atualizações ou até mesmo o catálogo do produto na maioria dos ambientes de rede. Os modos são:

+ Sem proxy

Selecione este modo para impedir que o Instalador MySQL procure configurações do sistema. Este modo desativa todas as configurações de proxy.

+ Automático

Selecione este modo para que o Instalador do MySQL procure as configurações do sistema e use essas configurações se encontradas, ou para não usar proxy se nada for encontrado. Este modo é o padrão.

+ Manual

Selecione este modo para que o Instalador MySQL use seus detalhes de autenticação para configurar o acesso proxy à internet. Especificamente:

- Endereço do servidor proxy (`http://`*`address-to-server`*) e número de porta

- Um nome de usuário e senha para autenticação

##### Localizando os produtos a serem instalados

Os produtos do MySQL no catálogo são listados por categoria: Servidores MySQL, Aplicações, Conectadores MySQL e Documentação. Apenas as versões GA mais recentes aparecem no painel Produtos disponíveis por padrão. Se você está procurando uma versão pré-lançada ou mais antiga de um produto, ela pode não ser visível na lista padrão.

Nota

Mantenha o catálogo de produtos atualizado. Clique em Catálogo no painel do Instalador MySQL para baixar o manifesto mais recente.

Para alterar a lista de produtos padrão, clique em Adicionar no painel para abrir a página Selecionar Produtos e, em seguida, clique em Editar para abrir a caixa de diálogo mostrada na figura a seguir. Modifique as configurações e, em seguida, clique em Filtrar.

**Figura 2.12 Produtos disponíveis no filtro**

![Filter by Text, Category, Maturity, Already Downloaded, and Architecture.](images/mi-product-filter.png)

Redefinir um ou mais dos seguintes campos para modificar a lista de produtos disponíveis:

* Texto: Filtre por texto. * Categoria: Todos os softwares (padrão), Servidores MySQL, Aplicações, Conectadores MySQL ou Documentação (para amostras e documentação).

* Maturidade: Conjunto atual (aparece inicialmente apenas com o pacote completo), Pré-lançamento, Atual GA ou Outras versões. Se você ver um aviso, confirme que tem o manifesto do produto mais recente clicando em Catálogo no painel do MySQL Installer. Se o MySQL Installer não conseguir baixar o manifesto, a gama de produtos que você vê é limitada a produtos em conjunto, MSIs de produtos independentes localizados na pasta `Product Cache` já, ou ambos.

Nota

A versão comercial do Instalador MySQL não exibe nenhum produto MySQL quando você seleciona o filtro de maturidade de pré-lançamento. Os produtos em desenvolvimento estão disponíveis apenas na versão comunitária do Instalador MySQL.

* Já baixado (a caixa de seleção é desselecionada por padrão). Permite que você visualize e gerencie apenas os produtos baixados.

* Arquitetura: Qualquer (padrão), 32 bits ou 64 bits.

##### Atualizando o servidor MySQL

Condições importantes para a atualização do servidor:

* O Instalador do MySQL não permite atualizações de servidor entre versões principais ou versões menores de lançamento, mas permite atualizações dentro de uma série de lançamento, como uma atualização de 8.0.36 para 8.0.37.

* As atualizações entre as versões de marco (ou de uma versão de marco para uma versão GA) não são suportadas. Alterações significativas de desenvolvimento ocorrem em versões de marco e você pode encontrar problemas de compatibilidade ou problemas ao iniciar o servidor.

* Para atualizações, uma caixa de seleção permite que você ignore a verificação de atualização e o processo para tabelas do sistema, enquanto verifica e processa tabelas do dicionário de dados normalmente. O Instalador do MySQL não solicita a caixa de seleção quando a atualização anterior do servidor foi ignorada ou quando o servidor foi configurado como um InnoDB Cluster sandbox. Esse comportamento representa uma mudança na forma como o MySQL Server executa uma atualização (consulte a Seção 3.4, “O que o processo de atualização do MySQL atualiza”) e altera a sequência de etapas que o Instalador do MySQL aplica ao processo de configuração.

Se você selecionar a opção Ignorar atualização de tabelas do sistema e processar. (Não recomendado), o Instalador MySQL inicia o servidor atualizado com a opção de servidor `--upgrade=MINIMAL`, que atualiza apenas o dicionário de dados. Se você parar e, em seguida, reiniciar o servidor sem a opção `--upgrade=MINIMAL`, o servidor atualiza as tabelas do sistema automaticamente, se necessário.

As seguintes informações aparecem na guia Log e no arquivo de registro após a configuração de upgrade (com tabelas do sistema ignoradas) estar concluída:

  ```
  WARNING: The system tables upgrade was skipped after upgrading MySQL Server. The
  server will be started now with the --upgrade=MINIMAL option, but then each
  time the server is started it will attempt to upgrade the system tables, unless
  you modify the Windows service (command line) to add --upgrade=MINIMAL to bypass
  the upgrade.

  FOR THE BEST RESULTS: Run mysqld.exe --upgrade=FORCE on the command line to upgrade
  the system tables manually.
  ```

Para escolher uma nova versão do servidor:

1. Clique em Atualizar. Confirme que a caixa de seleção ao lado do nome do produto na aba Produtos Atualizáveis tem uma marca de seleção. Desmarque os produtos que você não pretende atualizar neste momento.

Nota

Para releases de marco do servidor na mesma série de lançamento, o Instalador do MySQL desmarca a atualização do servidor e exibe um aviso para indicar que a atualização não é suportada, identifica os riscos de continuar e fornece um resumo dos passos para realizar uma atualização lógica manualmente. Você pode remarcar a atualização do servidor por sua conta e risco. Para instruções sobre como realizar uma atualização lógica com um lançamento de marco, consulte Atualização lógica.

2. Clique em um produto na lista para destacar ele. Essa ação preenche a aba Versões Atualizáveis com os detalhes de cada versão disponível para o produto selecionado: número da versão, data de publicação e um link `Changes` para abrir as notas de lançamento para essa versão.

##### Remoção do servidor MySQL

Para remover um servidor MySQL local:

1. Determine se o diretório de dados local deve ser removido. Se você reter o diretório de dados, outra instalação do servidor pode reutilizar os dados. Esta opção é habilitada por padrão (remove o diretório de dados).

2. Clique em Executar para começar a desinstalar o servidor local. Observe que todos os produtos que você selecionou para remover também serão desinstalados neste momento.

3. (Opcional) Clique na guia Log para exibir as ações atuais realizadas pelo Instalador MySQL.

##### Atualizando o Instalador do MySQL

O Instalador do MySQL permanece instalado no seu computador, e, como outros softwares, o Instalador do MySQL pode ser atualizado a partir da versão anterior. Em alguns casos, outros softwares do MySQL podem exigir que você atualize o Instalador do MySQL para compatibilidade. Esta seção descreve como identificar a versão atual do Instalador do MySQL e como atualizar manualmente o Instalador do MySQL.

**Para localizar a versão instalada do Instalador do MySQL:**

1. Inicie o MySQL Installer a partir do menu de pesquisa. O painel do MySQL Installer é aberto. 
2. Clique no ícone "Sobre" do MySQL Installer (!). O número da versão está localizado acima do botão Voltar.

**Para iniciar uma atualização sob demanda do Instalador do MySQL:**

1. Conecte o computador com o MySQL Installer instalado à internet.
2. Inicie o MySQL Installer a partir do menu de pesquisa. A tela do MySQL Installer é aberta.
3. Clique em Catalog (Catálogo) na parte inferior da tela para abrir a janela de Atualização do Catálogo.

4. Clique em Executar para iniciar o processo. Se a versão instalada do MySQL Installer puder ser atualizada, você será solicitado a iniciar a atualização.

5. Clique em Próximo para revisar todas as alterações no catálogo e, em seguida, clique em Finalizar para retornar ao painel de controle.

6. Verifique a versão (nova) instalada do Instalador do MySQL (consulte o procedimento anterior).

#### 2.3.3.5 Referência do Console do Instalador do MySQL

O **MySQLInstallerConsole.exe** oferece funcionalidades de linha de comando semelhantes às do MySQL Installer. Esta referência inclui:

* Nomes dos produtos do MySQL
* Sintaxe de comando
* Ações do comando

O console é instalado quando o Instalador MySQL é executado inicialmente e, em seguida, está disponível dentro do diretório `MySQL Installer for Windows`. Por padrão, a localização do diretório é `C:\Program Files (x86)\MySQL\MySQL Installer for Windows`. Você deve executar o console como administrador.

Para usar o console:

1. Abra um prompt de comando com privilégios administrativos selecionando "Sistema do Windows" no menu Iniciar, clique com o botão direito no Prompt de comando, selecione Mais e, em seguida, execute como administrador.

2. A partir da linha de comando, altere, opcionalmente, o diretório para onde o comando **MySQLInstallerConsole.exe** está localizado. Por exemplo, para usar o local de instalação padrão:

   ```
   cd Program Files (x86)\MySQL\MySQL Installer for Windows
   ```

3. Digite `MySQLInstallerConsole.exe` (ou `mysqlinstallerconsole`) seguido por uma ação de comando para realizar uma tarefa. Por exemplo, para mostrar a ajuda do console:

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

##### Nomes dos produtos do MySQL

Muitas das ações de comando do **MySQLInstallerConsole** aceitam uma ou mais frases abreviadas que podem corresponder a um ou mais produtos MySQL (ou produtos) no catálogo. O conjunto atual de frases curtas válidas para uso com comandos é mostrado na tabela a seguir.

Nota

Começando com o MySQL Installer 1.6.7 (8.0.34), as opções de comando `install`, `list` e `upgrade` não se aplicam mais ao MySQL para o Visual Studio (agora EOL), MySQL Connector/NET, MySQL Connector/ODBC, MySQL Connector/C++, MySQL Connector/Python e MySQL Connector/J. Para instalar os novos conectores MySQL, visite https://dev.mysql.com/downloads/.

**Tabela 2.6 Frases de produto do MySQL para uso com o comando MySQLInstallerConsole.exe**

<table><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th scope="col">Phrase</th> <th scope="col">Produto MySQL</th> </tr></thead><tr> <td><code>server</code></td> <td>Servidor MySQL</td> </tr><tr> <td><code>workbench</code></td> <td>MySQL Workbench</td> </tr><tr> <td><code>shell</code></td> <td>MySQL Shell</td> </tr><tr> <td><code>visual</code></td> <td>MySQL para Visual Studio</td> </tr><tr> <td><code>router</code></td> <td>MySQL Router</td> </tr><tr> <td><code>backup</code></td> <td>MySQL Enterprise Backup (requer a versão comercial)</td> </tr><tr> <td><code>net</code></td> <td>MySQL Connector/NET</td> </tr><tr> <td><code>odbc</code></td> <td>Conectivo MySQL/ODBC</td> </tr><tr> <td><code>c++</code></td> <td>MySQL Connector/C++</td> </tr><tr> <td><code>python</code></td> <td>Conectivo MySQL/Python</td> </tr><tr> <td><code>j</code></td> <td>MySQL Connector/J</td> </tr><tr> <td><code>documentation</code></td> <td>Documentação do MySQL Server</td> </tr><tr> <td><code>samples</code></td> <td>Amostras do MySQL (bases de dados sakila e world)</td> </tr></table>

##### Sintaxe de comando

O comando **MySQLInstallerConsole.exe** pode ser emitido com ou sem a extensão do arquivo (`.exe`) e o comando não é sensível ao caso.

`mysqlinstallerconsole`[`.exe`] [[[`--`]*`action`*] [*`action_blocks_list`*] [*`options_list`*]]

Descrição:

`action` :   Uma das ações operacionais permitidas. Se omitida, a ação padrão é equivalente à ação `--status`. O uso do prefixo `--` é opcional para todas as ações.

As possíveis ações são: [--]`configure`, [--]`help`, [--]`install`, [--]`list`, [--]`modify`, [--]`remove`, [--]`set`, [--]`status`, [--]`update`, e [--]`upgrade`.

`action_blocks_list` :   Uma lista de blocos, em que cada um representa um item diferente, dependendo da ação selecionada. Os blocos são separados por vírgulas.

As ações `--remove` e `--upgrade` permitem especificar um caractere de asterisco (`*`) para indicar todos os produtos. Se o caractere `*` for detectado no início deste bloco, presume-se que todos os produtos devem ser processados e o restante do bloco é ignorado.

Sintaxe: `*|action_block[,action_block][,action_block]...`

*`action_block`*: Contém um selecionador de produto seguido por um número indefinido de blocos de argumento que se comportam de maneira diferente dependendo da ação selecionada (veja Ações de comando).

`options_list` :   Zero ou mais opções com valores possíveis separados por espaços. Veja Ações de comando para identificar as opções permitidas para a ação correspondente.

Sintaxe: `option_value_pair[ option_value_pair][ option_value_pair]...`

*`option_value_pair`*: Uma única opção (por exemplo, `--silent`) ou uma tupla de uma chave e um valor correspondente com um prefixo de opções. O par chave-valor está na forma de `--key[=value]`.

##### Ações de comando

O **MySQLInstallerConsole.exe** suporta as seguintes ações de comando:

Nota

Os valores do bloco de configuração (ou argumentos_block) que contêm um caractere de colon (`:`) devem ser envolvidos em aspas. Por exemplo, `install_dir="C:\MySQL\MySQL Server 8.0"`.

* `[--]configure [product1]:[configuration_argument]=[value], [product2]:[configuration_argument]=[value], [...]`

Configura um ou mais produtos MySQL no seu sistema. Pode ser configurado um par *`configuration_argument`*=*`value`* para cada produto.

Opções:

`--continue` :   Continua processando o próximo produto quando um erro é detectado durante o processamento dos blocos de ação que contêm argumentos para cada produto. Se não for especificado, toda a operação é abortada em caso de erro.

`--help` :   Mostra as opções e os argumentos disponíveis para a ação correspondente. Se presente, a ação não é executada, apenas a ajuda é mostrada, portanto, outras opções relacionadas à ação também são ignoradas.

`--show-settings` :   Exibe as opções disponíveis para o produto selecionado, passando o nome do produto após `--show-settings`.

`--silent` : Desabilita os prompts de confirmação.

Exemplos:

  ```
  MySQLInstallerConsole --configure --show-settings server
  ```

  ```
  mysqlinstallerconsole.exe --configure server:port=3307
  ```

* `[--]help`

Exibe uma mensagem de ajuda com exemplos de uso e, em seguida, sai. Insira uma ação de comando adicional para receber ajuda específica para essa ação.

Opções:

`--action=[action]` :   Mostra a ajuda para uma ação específica. Igual ao uso da opção `--help` com uma ação.

Os valores permitidos são: `all`, `configure`, `help` (padrão), `install`, `list`, `modify`, `remove`, `status`, `update`, `upgrade` e `set`.

`--help` :   Mostra as opções e os argumentos disponíveis para a ação correspondente. Se presente, a ação não é executada, apenas a ajuda é mostrada, portanto, outras opções relacionadas à ação também são ignoradas.

Exemplos:

  ```
  MySQLInstallerConsole help
  ```

  ```
  MySQLInstallerConsole help --action=install
  ```

* `[--]install [product1]:[features]:[config block]:[config block], [product2]:[config block], [...]`

Instala um ou mais produtos MySQL no seu sistema. Se produtos pré-lançamento estiverem disponíveis, os produtos GA e pré-lançamento são instalados quando o valor da opção `--type` tiver o valor `Client` ou `Full`. Use a opção `--only_ga_products` para restringir o conjunto de produtos apenas aos produtos GA ao usar esses tipos de configuração.

Descrição:

`[product]` :   Cada produto pode ser especificado por uma frase de produto (MySQLInstallerConsole.html#mi-console-product-phrase "Table 2.6 MySQL Product Phrases for use with the MySQLInstallerConsole.exe command") com ou sem um qualificador de versão separado por ponto e vírgula. Passar uma palavra-chave de produto sozinha seleciona a versão mais recente do produto. Se houver várias arquiteturas disponíveis para essa versão do produto, o comando retorna a primeira na lista de manifest para confirmação interativa. Alternativamente, você pode passar a versão e a arquitetura exata `(x86` ou `x64`) após a palavra-chave de produto usando a opção `--silent`.

`[features]` :   Todas as funcionalidades associadas a um produto MySQL são instaladas por padrão. O bloco de funcionalidades é uma lista de funcionalidades separadas por ponto e vírgula ou um caractere asterisco (`*`) que seleciona todas as funcionalidades. Para remover uma funcionalidade, use o comando `modify`.

`[config block]` :   Pode ser especificado um ou mais blocos de configuração. Cada bloco de configuração é uma lista de pares chave-valor separados por ponto e vírgula. Um bloco pode incluir um tipo `config` ou `user` como chave; `config` é o tipo padrão se um não for definido.

Os valores do bloco de configuração que contêm um caractere de colon (`:`) devem ser envolvidos em aspas. Por exemplo, `installdir="C:\MySQL\MySQL Server 8.0"`. Apenas um bloco de tipo de configuração pode ser definido para cada produto. Um bloco de usuário deve ser definido para cada usuário que será criado durante a instalação do produto.

Nota

A chave do tipo `user` não é suportada quando um produto está sendo reconfigurado.

Opções:

`--auto-handle-prereqs` :   Se presente, o Instalador MySQL tenta baixar e instalar alguns pré-requisitos de software que atualmente não estão presentes. Isso pode ser resolvido com intervenção mínima. Se a opção `--silent` não estiver presente, você será apresentado com páginas de instalação para cada pré-requisito. Se a opção `--auto-handle-prereqs` for omitida, os pacotes com pré-requisitos ausentes não serão instalados.

`--continue` :   Continua processando o próximo produto quando um erro é detectado durante o processamento dos blocos de ação que contêm argumentos para cada produto. Se não for especificado, toda a operação é abortada em caso de erro.

`--help` :   Mostra as opções e os argumentos disponíveis para a ação correspondente. Se presente, a ação não é executada, apenas a ajuda é mostrada, portanto, outras opções relacionadas à ação também são ignoradas.

`--mos-password=password` :   Define a senha do usuário do My Oracle Support (MOS) para as versões comerciais do Instalador MySQL.

`--mos-user=user_name` :   Especifica o nome do usuário do My Oracle Support (MOS) para acesso à versão comercial do MySQL Installer. Se não estiver presente, apenas os produtos do pacote, se houver, estarão disponíveis para instalação.

`--only-ga-products` :   Restringe o conjunto de produtos para incluir apenas produtos GA.

`--setup-type=setup_type` :   Instala um conjunto pré-definido de software. O tipo de configuração pode ser um dos seguintes:

+ `Server`: Instala um único servidor MySQL

+ `Client`: Instala programas e bibliotecas do cliente (excluindo conectores MySQL)

+ `Full`: Instala tudo (excluindo os conectores MySQL)

+ `Custom`: Instala produtos selecionados pelo usuário. Esta é a opção padrão.

Nota

Os tipos de configuração não personalizados são válidos apenas quando nenhum outro produto MySQL está instalado.

`--show-settings` :   Exibe as opções disponíveis para o produto selecionado, passando o nome do produto após `-showsettings`.

`--silent` : Desative os prompts de confirmação.

Exemplos:

  ```
  mysqlinstallerconsole.exe --install j;8.0.29, net;8.0.28 --silent
  ```

  ```
  MySQLInstallerConsole install server;8.0.30:*:port=3307;server_id=2:type=user;user=foo
  ```

Um exemplo que passa em blocos de configuração adicionais, separados por `^` para se encaixar:

  ```
  MySQLInstallerConsole --install server;8.0.30;x64:*:type=config;open_win_firewall=true; ^
     general_log=true;bin_log=true;server_id=3306;tcp_ip=true;port=3306;root_passwd=pass; ^
     install_dir="C:\MySQL\MySQL Server 8.0":type=user;user_name=foo;password=bar;role=DBManager
  ```

* `[--]list`

Quando essa ação é usada sem opções, ela ativa uma lista interativa a partir da qual todos os produtos MySQL disponíveis podem ser pesquisados. Digite `MySQLInstallerConsole --list` e especifique uma subdivisão para pesquisar.

Opções:

`--all` :   Lista todos os produtos disponíveis. Se esta opção for usada, todas as outras opções são ignoradas.

`--arch=architecture` :   Listas que contêm a arquitetura especificada. Os valores permitidos são: `x86`, `x64` e `any` (padrão). Esta opção pode ser combinada com as opções `--name` e `--version`.

`--help` :   Mostra as opções e os argumentos disponíveis para a ação correspondente. Se presente, a ação não é executada, apenas a ajuda é mostrada, portanto, outras opções relacionadas à ação também são ignoradas.

`--name=package_name` :   Lista os produtos que contêm o nome especificado (consulte [frase do produto][(MySQLInstallerConsole.html#mi-console-product-phrase "Table 2.6 MySQL Product Phrases for use with the MySQLInstallerConsole.exe command")]) Esta opção pode ser combinada com as opções `--version` e `--arch`.

`--version=version` :   Lista os produtos que contêm a versão especificada, como 8.0 ou 5.7. Esta opção pode ser combinada com as opções `--name` e `--arch`.

Exemplos:

  ```
  MySQLInstallerConsole --list --name=net --version=8.0
  ```

* `[--]modify [product1:-removelist|+addlist], [product2:-removelist|+addlist] [...]`

Modifica ou exibe recursos de um produto MySQL instalado anteriormente. Para exibir os recursos de um produto, adicione a palavra-chave do produto ao comando, por exemplo:

  ```
  MySQLInstallerConsole --modify server
  ```

Opções:

`--help` :   Mostra as opções e os argumentos disponíveis para a ação correspondente. Se presente, a ação não é executada, apenas a ajuda é mostrada, portanto, outras opções relacionadas à ação também são ignoradas.

`--silent` : Desative os prompts de confirmação.

Exemplos:

  ```
  MySQLInstallerConsole --modify server:+documentation
  ```

  ```
  MySQLInstallerConsole modify server:-debug
  ```

* `[--]remove [product1], [product2] [...]`

Remove um ou mais produtos do seu sistema. Um caractere asterisco (`*`) pode ser passado para remover todos os produtos MySQL com um comando.

Opções:

`--continue` :   Continuar a operação mesmo que ocorra um erro.

`--help` :   Mostra as opções e os argumentos disponíveis para a ação correspondente. Se presente, a ação não é executada, apenas a ajuda é mostrada, portanto, outras opções relacionadas à ação também são ignoradas.

`--keep-datadir` : Ignora a remoção do diretório de dados ao remover produtos do MySQL Server.

`--silent` : Desative os prompts de confirmação.

Exemplos:

  ```
  mysqlinstallerconsole.exe remove *
  ```

  ```
  MySQLInstallerConsole --remove server --continue
  ```

* `[--]set`

Define uma ou mais opções configuráveis que afetam a forma como o programa do Instalador MySQL se conecta à internet e se o recurso de atualização automática do catálogo de produtos está ativado.

Opções:

`--catalog-update=bool_value` :   Habilita (`true`, padrão) ou desabilita (`false`) a atualização automática do catálogo de produtos. Esta opção requer uma conexão ativa com a internet.

`--catalog-update-days=int_value` :   Aceita um número inteiro entre 1 (padrão) e 365 para indicar o número de dias entre as verificações para uma nova atualização do catálogo quando o Instalador MySQL é iniciado. Se `--catalog-update` é `false`, esta opção é ignorada.

`--connection-validation=validation_type` :   Define como o Instalador MySQL realiza a verificação de uma conexão à internet. Os valores permitidos são `automatic` (padrão) e `manual`.

`--connection-validation-urls=url_list` :   Uma string fechada entre aspas e separada por vírgula que define a lista de URLs a serem usados para verificar a conexão com a internet quando `--connection-validation` está definido como `manual`. As verificações são feitas na mesma ordem fornecida. Se o primeiro URL falhar, o próximo URL na lista é usado e assim por diante.

`--offline-mode=bool_value` :   Permite que o Instalador MySQL seja executado com ou sem capacidades de internet. Os modos válidos são:

+ `True` para habilitar o modo offline (funcionar sem conexão à internet).

+ `False` (padrão) para desativar o modo offline (executar com uma conexão à internet). Defina este modo antes de baixar o catálogo de produtos ou quaisquer produtos a serem instalados.

`--proxy-mode` : Especifica o modo proxy. Os modos válidos são:

+ `Automatic` para identificar automaticamente o proxy com base nas configurações do sistema.

+ `None` para garantir que nenhum proxy seja configurado.

+ `Manual` para definir os detalhes do proxy manualmente (`--proxy-server`, `--proxy-port`, `--proxy-username`, `--proxy-password`).

`--proxy-password` :   A senha usada para autenticar no servidor proxy.

`--proxy-port` :   O porto utilizado para o servidor proxy.

`--proxy-server` :   O URL que aponta para o servidor proxy.

`--proxy-username` :   O nome de usuário usado para autenticar no servidor proxy.

`--reset-defaults` :   Redefinir as opções do Instalador MySQL associadas à ação `--set` para os valores padrão.

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

* `[--]status`

Fornece uma visão rápida dos produtos MySQL instalados no sistema. As informações incluem o nome e a versão do produto, a arquitetura, a data de instalação e o local de instalação.

Opções:

`--help` :   Mostra as opções e os argumentos disponíveis para a ação correspondente. Se presente, a ação não é executada, apenas a ajuda é mostrada, portanto, outras opções relacionadas à ação também são ignoradas.

Exemplos:

  ```
  MySQLInstallerConsole status
  ```

* `[--]update`

Baixa o catálogo mais recente do produto MySQL no seu sistema. Se for bem-sucedido, o catálogo é aplicado na próxima vez que o `MySQLInstaller` ou **MySQLInstallerConsole.exe** é executado.

O Instalador do MySQL verifica automaticamente as atualizações do catálogo de produtos quando é iniciado se *`n`* dias se passaram desde a última verificação. A partir do Instalador do MySQL 1.6.4, o valor padrão é de 1 dia. Anteriormente, o valor padrão era de 7 dias.

Opções:

`--help` :   Mostra as opções e os argumentos disponíveis para a ação correspondente. Se presente, a ação não é executada, apenas a ajuda é mostrada, portanto, outras opções relacionadas à ação também são ignoradas.

Exemplos:

  ```
  MySQLInstallerConsole update
  ```

* `[--]upgrade [product1:version], [product2:version] [...]`

Atualiza um ou mais produtos no seu sistema. Os seguintes caracteres são permitidos para esta ação:

`*` :   Passe no `*` para atualizar todos os produtos para a versão mais recente, ou passe produtos específicos.

`!` :   Passe em `!` como um número de versão para atualizar o produto MySQL para sua versão mais recente.

Opções:

`--continue` :   Continuar a operação mesmo que ocorra um erro.

`--help` :   Mostra as opções e os argumentos disponíveis para a ação correspondente. Se presente, a ação não é executada, apenas a ajuda é mostrada, portanto, outras opções relacionadas à ação também são ignoradas.

`--mos-password=password` :   Define a senha do usuário do My Oracle Support (MOS) para as versões comerciais do Instalador MySQL.

`--mos-user=user_name` :   Especifica o nome do usuário do My Oracle Support (MOS) para acesso à versão comercial do MySQL Installer. Se não estiver presente, apenas os produtos do pacote, se houver, estarão disponíveis para instalação.

`--silent` : Desative os prompts de confirmação.

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

### 2.3.4 Instalar o MySQL no Microsoft Windows usando um arquivo ZIP `noinstall`

Os usuários que estão instalando a partir do pacote `noinstall` podem usar as instruções nesta seção para instalar manualmente o MySQL. O processo para instalar o MySQL a partir de um pacote de arquivo ZIP é o seguinte:

1. Extraia o arquivo principal para o diretório de instalação desejado

*Opcional*: também extraia o arquivo debug-test, se você planeja executar o benchmark e a suíte de testes do MySQL

2. Crie um arquivo de opção 3. Escolha um tipo de servidor MySQL 4. Inicie o MySQL 5. Inicie o servidor MySQL 6. Proteja as contas de usuário padrão

Esse processo é descrito nas seções que seguem.

#### 2.3.4.1 Extrair o arquivo de instalação

Para instalar o MySQL manualmente, faça o seguinte:

1. Se você está atualizando uma versão anterior, consulte a Seção 3.11, “Atualizando o MySQL no Windows”, antes de começar o processo de atualização.

2. Certifique-se de que você está logado como um usuário com privilégios de administrador.

3. Escolha um local de instalação. Tradicionalmente, o servidor MySQL é instalado em `C:\mysql`. Se você não instalar o MySQL em `C:\mysql`, você deve especificar o caminho do diretório de instalação durante a inicialização ou em um arquivo de opção. Veja a Seção 2.3.4.2, “Criando um arquivo de opção”.

Nota

O Instalador do MySQL instala o MySQL em `C:\Program Files\MySQL`.

4. Extraia o arquivo de instalação para o local de instalação escolhido usando a ferramenta de compactação de arquivos que você prefere. Algumas ferramentas podem extrair o arquivo para uma pasta dentro do local de instalação escolhido. Se isso ocorrer, você pode mover o conteúdo da subpasta para o local de instalação escolhido.

#### 2.3.4.2 Criando um arquivo de opção

Se você precisar especificar opções de inicialização ao executar o servidor, pode indicá-las na linha de comando ou colocá-las em um arquivo de opção. Para opções que são usadas toda vez que o servidor é iniciado, pode ser mais conveniente usar um arquivo de opção para especificar sua configuração MySQL. Isso é particularmente verdadeiro nas seguintes circunstâncias:

* Os locais de instalação ou diretórios de dados são diferentes dos locais padrão (`C:\Program Files\MySQL\MySQL Server 8.0` e `C:\Program Files\MySQL\MySQL Server 8.0\data`).

* Você precisa ajustar as configurações do servidor, como memória, cache ou informações de configuração do InnoDB.

Quando o servidor MySQL é iniciado no Windows, ele procura arquivos de opção em vários locais, como o diretório do Windows, `C:\`, e o diretório de instalação do MySQL (para a lista completa dos locais, consulte a Seção 6.2.2.2, “Usando arquivos de opção”). O diretório do Windows geralmente é nomeado algo como `C:\WINDOWS`. Você pode determinar sua localização exata pelo valor da variável de ambiente `WINDIR` usando o seguinte comando:

```
C:\> echo %WINDIR%
```

O MySQL procura opções em cada local primeiro no arquivo `my.ini` e, em seguida, no arquivo `my.cnf`. No entanto, para evitar confusão, é melhor se você usar apenas um arquivo. Se o seu PC usa um carregador de inicialização onde `C:` não é o disco de inicialização, sua única opção é usar o arquivo `my.ini`. Independentemente do arquivo de opção que você usar, ele deve ser um arquivo de texto simples.

Nota

Ao usar o Instalador MySQL para instalar o MySQL Server, ele cria o `my.ini` na localização padrão, e o usuário que executa o Instalador MySQL recebe permissões completas para esse novo arquivo `my.ini`.

Em outras palavras, certifique-se de que o usuário do MySQL Server tenha permissão para ler o arquivo `my.ini`.

Você também pode utilizar os arquivos de exemplo de opção incluídos na sua distribuição MySQL; veja a Seção 7.1.2, “Configuração padrão do servidor”.

Um arquivo de opção pode ser criado e modificado com qualquer editor de texto, como o Bloco de Notas. Por exemplo, se o MySQL estiver instalado em `E:\mysql` e o diretório de dados estiver em `E:\mydata\data`, você pode criar um arquivo de opção contendo uma seção `[mysqld]` para especificar valores para as opções `basedir` e `datadir`:

```
[mysqld]
# set basedir to your installation path
basedir=E:/mysql
# set datadir to the location of your data directory
datadir=E:/mydata/data
```

Os nomes de caminho do Microsoft Windows são especificados em arquivos de opção usando barras (avançadas) em vez de barras de retorno. Se você usar barras de retorno, duplique-as:

```
[mysqld]
# set basedir to your installation path
basedir=E:\\mysql
# set datadir to the location of your data directory
datadir=E:\\mydata\\data
```

As regras para o uso de barras inclinadas nos valores dos arquivos de opção estão descritas na Seção 6.2.2.2, “Usando arquivos de opção”.

O arquivo ZIP não inclui um diretório `data`. Para inicializar uma instalação do MySQL criando o diretório de dados e preenchendo as tabelas no banco de dados do sistema mysql, inicialize o MySQL usando `--initialize` ou `--initialize-insecure`. Para informações adicionais, consulte a Seção 2.9.1, “Inicializando o diretório de dados”.

Se você deseja usar um diretório de dados em um local diferente, você deve copiar todo o conteúdo do diretório `data` para o novo local. Por exemplo, se você deseja usar `E:\mydata` como o diretório de dados em vez disso, você deve fazer duas coisas:

1. Mova todo o diretório `data` e todos os seus conteúdos do local padrão (por exemplo, `C:\Program Files\MySQL\MySQL Server 8.0\data`) para `E:\mydata`.

2. Use a opção `--datadir` para especificar a nova localização do diretório de dados cada vez que você iniciar o servidor.

#### 2.3.4.3 Selecionando um tipo de servidor MySQL

A tabela a seguir mostra os servidores disponíveis para Windows no MySQL 8.0.

<table summary="Servers available for Windows in MySQL 8.0."><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Binary</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>mysqld</td> <td>Binário otimizado com suporte a canal de nomeação</td> </tr><tr> <td>mysqld-debug</td> <td>Como o mysqld, mas compilado com depuração completa e verificação automática de alocação de memória</td> </tr></tbody></table>

Todos os binários anteriores são otimizados para processadores Intel modernos, mas devem funcionar em qualquer processador da classe i386 ou superior da Intel.

Cada servidor de uma distribuição suporta o mesmo conjunto de motores de armazenamento. A declaração `SHOW ENGINES` exibe quais motores um servidor específico suporta.

Todos os servidores Windows com MySQL 8.0 têm suporte para vinculação simbólica de diretórios de banco de dados.

O MySQL suporta TCP/IP em todas as plataformas do Windows. Os servidores do MySQL no Windows também suportam tubos nomeados, se você iniciar o servidor com a variável de sistema `named_pipe` habilitada. É necessário habilitar essa variável explicitamente, porque alguns usuários tiveram problemas ao desligar o servidor MySQL quando tubos nomeados foram usados. O padrão é usar TCP/IP, independentemente da plataforma, porque os tubos nomeados são mais lentos do que o TCP/IP em muitas configurações do Windows.

#### 2.3.4.4 Inicializando o Diretório de Dados

Se você instalou o MySQL usando o pacote `noinstall`, não há um diretório de dados incluído. Para inicializar o diretório de dados, use as instruções na Seção 2.9.1, “Inicializando o diretório de dados”.

#### 2.3.4.5 Começando o servidor pela primeira vez

Esta seção oferece uma visão geral geral sobre como iniciar o servidor MySQL. As seções a seguir fornecem informações mais específicas para iniciar o servidor MySQL a partir da linha de comando ou como um serviço do Windows.

As informações aqui aplicam-se principalmente se você instalou o MySQL usando a versão `noinstall`, ou se deseja configurar e testar o MySQL manualmente, em vez do Instalador do MySQL.

Os exemplos nessas seções assumem que o MySQL está instalado na localização padrão de `C:\Program Files\MySQL\MySQL Server 8.0`. Ajuste os nomes de caminho mostrados nos exemplos se o MySQL estiver instalado em um local diferente.

Os clientes têm duas opções. Eles podem usar TCP/IP ou podem usar um tubo nomeado se o servidor suportar conexões de tubo nomeado.

O MySQL para Windows também suporta conexões de memória compartilhada se o servidor for iniciado com a variável de sistema `shared_memory` habilitada. Os clientes podem se conectar através da memória compartilhada usando a opção `--protocol=MEMORY`.

Para obter informações sobre qual binário do servidor deve ser executado, consulte a Seção 2.3.4.3, “Selecionando um tipo de servidor MySQL”.

Os testes são melhores realizados a partir de uma linha de comando em uma janela de console (ou "janela DOS"). Dessa forma, você pode ter o servidor exibindo mensagens de status na janela onde elas são fáceis de ver. Se algo estiver errado com sua configuração, essas mensagens facilitam a identificação e a correção de quaisquer problemas.

Nota

O banco de dados deve ser inicializado antes que o MySQL possa ser iniciado. Para informações adicionais sobre o processo de inicialização, consulte a Seção 2.9.1, “Inicializando o diretório de dados”.

Para iniciar o servidor, digite este comando:

```
C:\> "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld" --console
```

Você deve ver mensagens semelhantes às seguintes, conforme o servidor começar a funcionar (os nomes dos caminhos e tamanhos podem variar). As mensagens `ready for connections` indicam que o servidor está pronto para atender conexões de clientes.

```
[Server] C:\mysql\bin\mysqld.exe (mysqld 8.0.30) starting as process 21236
[InnoDB] InnoDB initialization has started.
[InnoDB] InnoDB initialization has ended.
[Server] CA certificate ca.pem is self signed.
[Server] Channel mysql_main configured to support TLS.
Encrypted connections are now supported for this channel.
[Server] X Plugin ready for connections. Bind-address: '::' port: 33060
[Server] C:\mysql\bin\mysqld.exe: ready for connections.
Version: '8.0.30'  socket: ''  port: 3306  MySQL Community Server - GPL.
```

Agora você pode abrir uma nova janela do console para executar programas de cliente.

Se você omitir a opção `--console`, o servidor escreve a saída diagnóstica no log de erro no diretório de dados (`C:\Program Files\MySQL\MySQL Server 8.0\data` por padrão). O log de erro é o arquivo com a extensão `.err`, e pode ser definido usando a opção `--log-error`.

Nota

A conta inicial `root` nas tabelas de concessão do MySQL não tem senha. Após iniciar o servidor, você deve configurar uma senha para ele usando as instruções na Seção 2.9.4, "Segurando a Conta Inicial do MySQL".

#### 2.3.4.6 Iniciar o MySQL a partir da linha de comando do Windows

O servidor MySQL pode ser iniciado manualmente a partir da linha de comando. Isso pode ser feito em qualquer versão do Windows.

Para iniciar o servidor **mysqld** a partir da linha de comando, você deve iniciar uma janela de console (ou "janela DOS") e digitar o seguinte comando:

```
C:\> "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld"
```

O caminho para o **mysqld** pode variar dependendo da localização de instalação do MySQL no seu sistema.

Você pode parar o servidor MySQL executando este comando:

```
C:\> "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqladmin" -u root shutdown
```

Nota

Se a conta de usuário MySQL `root` tiver uma senha, você precisa invocar o **mysqladmin** com a opção `-p` e fornecer a senha quando solicitado.

Este comando invoca o utilitário administrativo MySQL **mysqladmin** para se conectar ao servidor e dizer-lhe que ele deve ser desligado. O comando se conecta como o usuário `root` do MySQL, que é a conta administrativa padrão no sistema de concessão do MySQL.

Nota

Os usuários no sistema de concessão MySQL são totalmente independentes de quaisquer usuários de sistemas operacionais sob o Microsoft Windows.

Se o **mysqld** não começar, verifique o log de erro para ver se o servidor escreveu alguma mensagem lá para indicar a causa do problema. Por padrão, o log de erro está localizado no diretório `C:\Program Files\MySQL\MySQL Server 8.0\data`. É o arquivo com um sufixo de `.err`, ou pode ser especificado passando a opção `--log-error`. Alternativamente, você pode tentar iniciar o servidor com a opção [[`--console`]; nesse caso, o servidor pode exibir algumas informações úteis na tela para ajudar a resolver o problema.

A última opção é iniciar o **mysqld** com as opções `--standalone` e `--debug`. Neste caso, o **mysqld** escreve um arquivo de registro `C:\mysqld.trace` que deve conter o motivo pelo qual o **mysqld** não inicia. Veja a Seção 7.9.4, “O pacote DBUG”.

Use **mysqld --verbose --help** para exibir todas as opções que o **mysqld** suporta.

#### 2.3.4.7 Personalizando o PATH para Ferramentas do MySQL

Aviso

Você deve exercer grande cuidado ao editar seu sistema `PATH` manualmente; a exclusão ou modificação acidental de qualquer parte do valor existente do `PATH` pode deixá-lo com um sistema que não funciona ou até mesmo inutilizável.

Para facilitar a invocação de programas MySQL, você pode adicionar o nome do caminho do diretório MySQL `bin` à sua variável de ambiente `PATH` do sistema Windows:

* No desktop do Windows, clique com o botão direito no ícone Meu Computador e selecione Propriedades.

* Em seguida, selecione a guia Avançado do menu Propriedades do sistema que aparece e clique no botão Variáveis de ambiente.

* Sob Variáveis do sistema, selecione Caminho e, em seguida, clique no botão Editar. O diálogo Editar variável do sistema deve aparecer.

* Posicione o cursor no final do texto que aparece no espaço marcado Valor Variável. (Use a tecla **Final** para garantir que o cursor esteja posicionado no final do texto neste espaço.) Em seguida, insira o nome completo do caminho do seu diretório MySQL `bin` (por exemplo, `C:\Program Files\MySQL\MySQL Server 8.0\bin`)

Nota

Deve haver um ponto e vírgula separando este caminho de quaisquer valores presentes neste campo.

Desconsidere este diálogo e, em seguida, cada diálogo, clicando em OK até que todos os diálogos que foram abertos tenham sido descartados. O novo valor `PATH` deve estar disponível para qualquer novo shell de comando que você abrir, permitindo que você invoque qualquer programa executável do MySQL digitando seu nome no prompt do DOS em qualquer diretório do sistema, sem precisar fornecer o caminho. Isso inclui os servidores, o cliente **mysql** e todas as ferramentas de linha de comando do MySQL, como **mysqladmin** e **mysqldump**.

Você não deve adicionar o diretório MySQL `bin` ao seu Windows `PATH` se você estiver executando vários servidores MySQL na mesma máquina.

#### 2.3.4.8 Começando o MySQL como um serviço do Windows

Em Windows, a maneira recomendada para executar o MySQL é instalá-lo como um serviço do Windows, para que o MySQL comece e pare automaticamente quando o Windows começa e para. Um servidor MySQL instalado como um serviço também pode ser controlado a partir da linha de comando usando comandos **NET**, ou com o utilitário gráfico **Serviços**. Geralmente, para instalar o MySQL como um serviço do Windows, você deve estar logado usando uma conta que tenha direitos de administrador.

O utilitário **Serviços** (o Gestor de Controlo de Serviços do Windows) pode ser encontrado no Painel de Controlo do Windows. Para evitar conflitos, é aconselhável fechar o utilitário **Serviços** enquanto realiza operações de instalação ou remoção de servidores a partir da linha de comando.

##### Instalação do serviço

Antes de instalar o MySQL como um serviço do Windows, você deve primeiro parar o servidor atual, se ele estiver em execução, usando o seguinte comando:

```
C:\> "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqladmin"
          -u root shutdown
```

Nota

Se a conta de usuário MySQL `root` tiver uma senha, você precisa invocar o **mysqladmin** com a opção `-p` e fornecer a senha quando solicitado.

Este comando invoca o utilitário administrativo MySQL **mysqladmin** para se conectar ao servidor e dizer-lhe que ele deve ser desligado. O comando se conecta como o usuário `root` do MySQL, que é a conta administrativa padrão no sistema de concessão do MySQL.

Nota

Os usuários no sistema de concessão MySQL são totalmente independentes de quaisquer usuários de sistemas operacionais sob Windows.

Instale o servidor como um serviço usando este comando:

```
C:\> "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld" --install
```

O comando de instalação de serviço não inicia o servidor. As instruções para isso são fornecidas mais adiante nesta seção.

Para facilitar a invocação de programas MySQL, você pode adicionar o nome do caminho do diretório MySQL `bin` à sua variável de ambiente `PATH` do sistema Windows:

* No desktop do Windows, clique com o botão direito no ícone Meu Computador e selecione Propriedades.

* Em seguida, selecione a guia Avançado do menu Propriedades do sistema que aparece e clique no botão Variáveis de ambiente.

* Sob Variáveis do sistema, selecione Caminho e, em seguida, clique no botão Editar. O diálogo Editar variável do sistema deve aparecer.

* Coloque o cursor no final do texto que aparece no espaço marcado com Valor Variável. (Use a tecla **Final** para garantir que o cursor esteja posicionado na extremidade final do texto neste espaço.) Em seguida, insira o nome completo do caminho do diretório MySQL `bin` (por exemplo, `C:\Program Files\MySQL\MySQL Server 8.0\bin`), e deve haver um ponto e vírgula separando este caminho de quaisquer valores presentes neste campo. Desconsidere este diálogo e, em seguida, cada diálogo, clicando em OK até que todos os diálogos que foram abertos tenham sido descartados. Agora você deve ser capaz de invocar qualquer programa executável MySQL digitando seu nome no prompt do DOS em qualquer diretório do sistema, sem precisar fornecer o caminho. Isso inclui os servidores, o cliente **mysql** e todas as ferramentas de linha de comando MySQL, como **mysqladmin** e **mysqldump**.

Você não deve adicionar o diretório MySQL `bin` ao seu Windows `PATH` se você estiver executando vários servidores MySQL na mesma máquina.

Aviso

Você deve exercer grande cuidado ao editar seu sistema `PATH` manualmente; a exclusão ou modificação acidental de qualquer parte do valor existente do `PATH` pode deixá-lo com um sistema que não funciona ou até mesmo inutilizável.

Os seguintes argumentos adicionais podem ser utilizados ao instalar o serviço:

* Você pode especificar um nome de serviço imediatamente após a opção `--install`. O nome de serviço padrão é `MySQL`.

* Se um nome de serviço for fornecido, ele pode ser seguido por uma única opção. Por convenção, isso deve ser `--defaults-file=file_name` para especificar o nome de um arquivo de opções do qual o servidor deve ler opções quando ele começa.

O uso de uma única opção, que não seja `--defaults-file`, é possível, mas não é recomendado. `--defaults-file` é mais flexível, pois permite que você especifique várias opções de inicialização para o servidor, colocando-as no arquivo de opção nomeado.

* Você também pode especificar uma opção `--local-service` após o nome do serviço. Isso faz com que o servidor seja executado usando a conta do Windows `LocalService` que tem privilégios limitados no sistema. Se ambos `--defaults-file` e `--local-service` forem fornecidos após o nome do serviço, eles podem ser em qualquer ordem.

Para um servidor MySQL que está instalado como um serviço do Windows, as seguintes regras determinam o nome do serviço e os arquivos de opção que o servidor utiliza:

* Se o comando de instalação de serviço não especificar nenhum nome de serviço ou o nome de serviço padrão (`MySQL`) após a opção `--install`, o servidor usa o nome de serviço de `MySQL` e lê as opções do grupo `[mysqld]` nos arquivos de opção padrão.

* Se o comando de instalação de serviço especificar um nome de serviço diferente de `MySQL` após a opção `--install`, o servidor usa esse nome de serviço. Ele lê as opções do grupo `[mysqld]` e do grupo que tem o mesmo nome do serviço nos arquivos de opção padrão. Isso permite que você use o grupo `[mysqld]` para opções que devem ser usadas por todos os serviços MySQL e um grupo de opções com o nome do serviço para uso pelo servidor instalado com esse nome de serviço.

* Se o comando de instalação de serviço especificar uma opção `--defaults-file` após o nome do serviço, o servidor lê as opções da mesma maneira que descrito no item anterior, exceto que ele lê as opções apenas a partir do arquivo nomeado e ignora os arquivos de opção padrão.

Como exemplo mais complexo, considere o seguinte comando:

```
C:\> "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld"
          --install MySQL --defaults-file=C:\my-opts.cnf
```

Aqui, o nome do serviço padrão (`MySQL`) é dado após a opção `--install`. Se não tivesse sido dada a opção `--defaults-file`, este comando teria o efeito de fazer com que o servidor leia o grupo `[mysqld]` a partir dos arquivos de opção padrão. No entanto, como a opção `--defaults-file` está presente, o servidor lê as opções do grupo de opção `[mysqld]`, e apenas a partir do arquivo nomeado.

Nota

Em Windows, se o servidor for iniciado com as opções `--defaults-file` e `--install`, o `--install` deve ser o primeiro. Caso contrário, o `mysqld.exe` tenta iniciar o servidor MySQL.

Você também pode especificar opções como parâmetros de início no utilitário **Serviços** do Windows antes de iniciar o serviço MySQL.

Por fim, antes de tentar iniciar o serviço MySQL, certifique-se de que as variáveis de usuário `%TEMP%` e `%TMP%` (e também `%TMPDIR%`, se já tiver sido definida) para o usuário do sistema operacional que deve executar o serviço estejam apontando para uma pasta para a qual o usuário tenha acesso de escrita. O usuário padrão para executar o serviço MySQL é `LocalSystem`, e o valor padrão para seus `%TEMP%` e `%TMP%` é `C:\Windows\Temp`, um diretório `LocalSystem` que tem acesso de escrita por padrão. No entanto, se houver alguma alteração nessa configuração padrão (por exemplo, alterações no usuário que executa o serviço ou nas variáveis de usuário mencionadas, ou a opção `--tmpdir` tenha sido usada para colocar o diretório temporário em outro lugar), o serviço MySQL pode não funcionar corretamente porque o acesso de escrita para o diretório temporário não foi concedido ao usuário apropriado.

##### Início do serviço

Depois que uma instância do servidor MySQL foi instalada como um serviço, o Windows inicia o serviço automaticamente sempre que o Windows é iniciado. O serviço também pode ser iniciado imediatamente a partir do utilitário **Serviços**, ou usando o comando **sc start *`mysqld_service_name`*** ou **NET START *`mysqld_service_name`***. Os comandos **SC** e **NET** não são sensíveis ao caso.

Quando executado como um serviço, o **mysqld** não tem acesso a uma janela de console, então não é possível ver mensagens lá. Se o **mysqld** não iniciar, verifique o log de erro para ver se o servidor escreveu alguma mensagem lá para indicar a causa do problema. O log de erro está localizado no diretório de dados do MySQL (por exemplo, `C:\Program Files\MySQL\MySQL Server 8.0\data`). É o arquivo com um sufixo de `.err`.

Quando um servidor MySQL foi instalado como um serviço e o serviço está em execução, o Windows para o serviço automaticamente quando o Windows é desligado. O servidor também pode ser parado manualmente usando o utilitário `Services`, o comando **sc stop *`mysqld_service_name`***, o comando **NET STOP *`mysqld_service_name`*** ou o comando **mysqladmin shutdown**.

Você também tem a opção de instalar o servidor como um serviço manual, se não deseja que o serviço seja iniciado automaticamente durante o processo de inicialização. Para fazer isso, use a opção `--install-manual` em vez da opção `--install`:

```
C:\> "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld" --install-manual
```

##### Removendo o serviço

Para remover um servidor que está instalado como um serviço, primeiro pare-o se ele estiver em execução, executando **SC STOP *`mysqld_service_name`*** ou **NET STOP *`mysqld_service_name`***. Em seguida, use **SC DELETE *`mysqld_service_name`*** para removê-lo:

```
C:\> SC DELETE mysql
```

Como alternativa, use a opção **mysqld** `--remove` para remover o serviço.

```
C:\> "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld" --remove
```

Se o **mysqld** não estiver rodando como um serviço, você pode iniciá-lo a partir da linha de comando. Para obter instruções, consulte a Seção 2.3.4.6, “Iniciando o MySQL a partir da linha de comando do Windows”.

Se você encontrar dificuldades durante a instalação, consulte a Seção 2.3.5, “Solucionando problemas de instalação do Microsoft Windows MySQL Server”.

Para obter mais informações sobre como parar ou remover um serviço do Windows, consulte a Seção 7.8.2.2, “Iniciar várias instâncias do MySQL como serviços do Windows”.

#### 2.3.4.9 Testando a Instalação do MySQL

Você pode testar se o servidor MySQL está funcionando executando qualquer um dos seguintes comandos:

```
C:\> "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqlshow"
C:\> "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqlshow" -u root mysql
C:\> "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqladmin" version status proc
C:\> "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql" test
```

Se o **mysqld** demorar a responder a conexões TCP/IP de programas de cliente, provavelmente há um problema com o seu DNS. Neste caso, inicie o **mysqld** com a variável de sistema `skip_name_resolve` habilitada e use apenas `localhost` e endereços IP na coluna `Host` das tabelas de concessão MySQL. (Certifique-se de que existe uma conta que especifica um endereço IP, caso contrário, você pode não conseguir se conectar.)

Você pode forçar um cliente MySQL a usar uma conexão de canal nomeado em vez de TCP/IP, especificando a opção `--pipe` ou `--protocol=PIPE`, ou especificando `.` (período) como o nome do host. Use a opção `--socket` para especificar o nome do canal se você não quiser usar o nome de canal padrão.

Se você configurou uma senha para a conta `root`, excluiu a conta anônima ou criou uma nova conta de usuário, então para se conectar ao servidor MySQL, você deve usar as opções apropriadas `-u` e `-p` com os comandos mostrados anteriormente. Veja a Seção 6.2.4, “Conectando ao servidor MySQL usando opções de comando”.

Para mais informações sobre **mysqlshow**, consulte a Seção 6.5.7, “mysqlshow — Exibir informações de banco de dados, tabela e coluna”.

### 2.3.5 Solução de problemas de uma instalação do Microsoft Windows MySQL Server

Ao instalar e executar o MySQL pela primeira vez, você pode encontrar certos erros que impedem o início do servidor MySQL. Esta seção ajuda você a diagnosticar e corrigir alguns desses erros.

Seu primeiro recurso ao resolver problemas no servidor é o log de erro. O servidor MySQL usa o log de erro para registrar informações relevantes ao erro que impede o início do servidor. O log de erro está localizado no diretório de dados especificado no seu arquivo `my.ini`. O local padrão do diretório de dados é `C:\Program Files\MySQL\MySQL Server 8.0\data`, ou `C:\ProgramData\Mysql` no Windows 7 e no Windows Server 2008. O diretório `C:\ProgramData` é oculto por padrão. Você precisa alterar suas opções de pasta para ver o diretório e o conteúdo. Para mais informações sobre o log de erro e entender o conteúdo, consulte a Seção 7.4.2, “O Log de Erro”.

Para obter informações sobre possíveis erros, consulte também as mensagens do console exibidas quando o serviço MySQL está sendo iniciado. Use o comando **SC START *`mysqld_service_name`*** ou **NET START *`mysqld_service_name`*** a partir da linha de comando após instalar o **mysqld** como um serviço para ver quaisquer mensagens de erro relacionadas ao início do servidor MySQL como um serviço. Veja a Seção 2.3.4.8, “Iniciando o MySQL como um serviço do Windows”.

Os exemplos a seguir mostram outras mensagens de erro comuns que você pode encontrar ao instalar o MySQL e iniciar o servidor pela primeira vez:

* Se o servidor MySQL não conseguir encontrar o banco de dados de privilégios `mysql` ou outros arquivos críticos, ele exibe essas mensagens:

  ```
  System error 1067 has occurred.
  Fatal error: Can't open and lock privilege tables:
  Table 'mysql.user' doesn't exist
  ```

Essas mensagens geralmente ocorrem quando a base MySQL ou os diretórios de dados são instalados em locais diferentes dos locais padrão (`C:\Program Files\MySQL\MySQL Server 8.0` e `C:\Program Files\MySQL\MySQL Server 8.0\data`, respectivamente).

Essa situação pode ocorrer quando o MySQL é atualizado e instalado em um novo local, mas o arquivo de configuração não é atualizado para refletir o novo local. Além disso, arquivos de configuração antigos e novos podem entrar em conflito. Certifique-se de excluir ou renomear quaisquer arquivos de configuração antigos ao atualizar o MySQL.

Se você instalou o MySQL em um diretório diferente de `C:\Program Files\MySQL\MySQL Server 8.0`, certifique-se de que o servidor MySQL esteja ciente disso por meio do uso de um arquivo de configuração (`my.ini`). Coloque o arquivo `my.ini` em seu diretório do Windows, tipicamente `C:\WINDOWS`. Para determinar sua localização exata a partir do valor da variável de ambiente `WINDIR`, execute o seguinte comando no prompt de comando:

  ```
  C:\> echo %WINDIR%
  ```

Você pode criar ou modificar um arquivo de opções com qualquer editor de texto, como o Bloco de Notas. Por exemplo, se o MySQL estiver instalado em `E:\mysql` e o diretório de dados for `D:\MySQLdata`, você pode criar o arquivo de opções e configurar uma seção `[mysqld]` para especificar valores para as opções `basedir` e `datadir`:

  ```
  [mysqld]
  # set basedir to your installation path
  basedir=E:/mysql
  # set datadir to the location of your data directory
  datadir=D:/MySQLdata
  ```

Os nomes de caminho do Microsoft Windows são especificados em arquivos de opção usando barras (avançadas) em vez de barras de retorno. Se você usar barras de retorno, duplique-as:

  ```
  [mysqld]
  # set basedir to your installation path
  basedir=C:\\Program Files\\MySQL\\MySQL Server 8.0
  # set datadir to the location of your data directory
  datadir=D:\\MySQLdata
  ```

As regras para o uso de barras inclinadas nos valores dos arquivos de opção são fornecidas na Seção 6.2.2.2, “Usando arquivos de opção”.

Se você alterar o valor `datadir` no seu arquivo de configuração do MySQL, você deve mover o conteúdo do diretório de dados existente do MySQL antes de reiniciar o servidor MySQL.

Veja a Seção 2.3.4.2, “Criando um arquivo de opção”.

* Se você reinstalar ou atualizar o MySQL sem primeiro parar e remover o serviço MySQL existente e instalar o MySQL usando o Instalador do MySQL, você pode ver este erro:

  ```
  Error: Cannot create Windows service for MySql. Error: 0
  ```

Isso ocorre quando o Assistente de Configuração tenta instalar o serviço e encontra um serviço existente com o mesmo nome.

Uma solução para esse problema é escolher um nome de serviço diferente de `mysql` ao usar o assistente de configuração. Isso permite que o novo serviço seja instalado corretamente, mas deixa o serviço desatualizado no lugar. Embora isso seja inócuo, é melhor remover serviços antigos que não são mais usados.

Para remover permanentemente o serviço antigo `mysql`, execute o seguinte comando como um usuário com privilégios administrativos, na linha de comando:

  ```
  C:\> SC DELETE mysql
  [SC] DeleteService SUCCESS
  ```

Se o utilitário `SC` não estiver disponível para a sua versão do Windows, baixe o utilitário `delsrv` a partir do <http://www.microsoft.com/windows2000/techinfo/reskit/tools/existing/delsrv-o.asp> e use a sintaxe do `delsrv mysql`.

### 2.3.6 Procedimentos pós-instalação do Windows

Existem ferramentas de interface gráfica de usuário que realizam a maioria das tarefas descritas nesta seção, incluindo:

* Instalador MySQL: Usado para instalar e atualizar produtos MySQL.

* MySQL Workbench: Gerencia o servidor MySQL e edita declarações SQL.

Se necessário, inicialize o diretório de dados e crie as tabelas de concessão do MySQL. As operações de instalação do Windows realizadas pelo Instalador do MySQL inicializam o diretório de dados automaticamente. Para a instalação a partir de um pacote de arquivo ZIP, inicialize o diretório de dados conforme descrito na Seção 2.9.1, “Inicializando o diretório de dados”.

Em relação às senhas, se você instalou o MySQL usando o Instalador do MySQL, já pode ter atribuído uma senha à conta inicial `root`. (Veja a Seção 2.3.3, “Instalador do MySQL para Windows”.) Caso contrário, use o procedimento de atribuição de senha descrito na Seção 2.9.4, “Segurando a Conta Inicial do MySQL”.

Antes de atribuir uma senha, você pode querer tentar executar alguns programas de cliente para garantir que você possa se conectar ao servidor e que ele esteja funcionando corretamente. Certifique-se de que o servidor esteja em execução (consulte Seção 2.3.4.5, “Começando o Servidor pela Primeira Vez”). Você também pode configurar um serviço MySQL que seja executado automaticamente quando o Windows é iniciado (consulte Seção 2.3.4.8, “Começando o MySQL como um Serviço do Windows”).

Essas instruções assumem que sua localização atual é o diretório de instalação do MySQL e que ele possui um subdiretório `bin` contendo os programas MySQL utilizados aqui. Se isso não for verdade, ajuste os nomes dos caminhos do comando conforme necessário.

Se você instalou o MySQL usando o MySQL Installer (consulte a Seção 2.3.3, “MySQL Installer para Windows”), o diretório de instalação padrão é `C:\Program Files\MySQL\MySQL Server 8.0`:

```
C:\> cd "C:\Program Files\MySQL\MySQL Server 8.0"
```

Um local comum de instalação para a instalação a partir de um arquivo ZIP é `C:\mysql`:

```
C:\> cd C:\mysql
```

Como alternativa, adicione o diretório `bin` à configuração da variável de ambiente `PATH`. Isso permite que o interpretador de comandos encontre os programas MySQL corretamente, para que você possa executar um programa digitando apenas seu nome, e não o nome do caminho. Veja a Seção 2.3.4.7, “Personalizando o PATH para Ferramentas MySQL”.

Com o servidor em execução, execute os seguintes comandos para verificar se você pode recuperar informações do servidor. A saída deve ser semelhante àquela mostrada aqui.

Use **mysqlshow** para ver quais bancos de dados existem:

```
C:\> bin\mysqlshow
+--------------------+
|     Databases      |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
```

A lista de bancos de dados instalados pode variar, mas sempre inclui pelo menos `mysql` e `information_schema`.

O comando anterior (e comandos para outros programas MySQL, como **mysql**) pode não funcionar se a conta correta do MySQL não existir. Por exemplo, o programa pode falhar com um erro, ou você pode não ser capaz de visualizar todos os bancos de dados. Se você instalar o MySQL usando o MySQL Installer, o usuário `root` é criado automaticamente com a senha que você forneceu. Neste caso, você deve usar as opções `-u root` e `-p`. (Você deve usar essas opções se já tiver protegido as contas iniciais do MySQL.) Com `-p`, o programa cliente solicita a senha do [[`root`]. Por exemplo:

```
C:\> bin\mysqlshow -u root -p
Enter password: (enter root password here)
+--------------------+
|     Databases      |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
```

Se você especificar um nome de banco de dados, o **mysqlshow** exibe uma lista das tabelas dentro do banco de dados:

```
C:\> bin\mysqlshow mysql
Database: mysql
+---------------------------+
|          Tables           |
+---------------------------+
| columns_priv              |
| component                 |
| db                        |
| default_roles             |
| engine_cost               |
| func                      |
| general_log               |
| global_grants             |
| gtid_executed             |
| help_category             |
| help_keyword              |
| help_relation             |
| help_topic                |
| innodb_index_stats        |
| innodb_table_stats        |
| ndb_binlog_index          |
| password_history          |
| plugin                    |
| procs_priv                |
| proxies_priv              |
| role_edges                |
| server_cost               |
| servers                   |
| slave_master_info         |
| slave_relay_log_info      |
| slave_worker_info         |
| slow_log                  |
| tables_priv               |
| time_zone                 |
| time_zone_leap_second     |
| time_zone_name            |
| time_zone_transition      |
| time_zone_transition_type |
| user                      |
+---------------------------+
```

Use o programa **mysql** para selecionar informações de uma tabela no banco de dados `mysql`:

```
C:\> bin\mysql -e "SELECT User, Host, plugin FROM mysql.user" mysql
+------+-----------+-----------------------+
| User | Host      | plugin                |
+------+-----------+-----------------------+
| root | localhost | caching_sha2_password |
+------+-----------+-----------------------+
```

Para mais informações sobre **mysql** e **mysqlshow**, consulte a Seção 6.5.1, “mysql — O cliente de linha de comando MySQL”, e a Seção 6.5.7, “mysqlshow — Exibir informações de banco de dados, tabela e coluna”.

### 2.3.7 Restrições da Plataforma Windows

As seguintes restrições se aplicam ao uso do MySQL na plataforma Windows:

* **Memória de processo**

Nas plataformas de 32 bits do Windows, não é possível, por padrão, usar mais de 2 GB de RAM em um único processo, incluindo o MySQL. Isso ocorre porque o limite de endereço físico no Windows de 32 bits é de 4 GB e a configuração padrão do Windows é dividir o espaço de endereçamento virtual entre o kernel (2 GB) e o usuário/aplicativos (2 GB).

Algumas versões do Windows têm um ajuste de tempo de inicialização para habilitar aplicativos maiores, reduzindo o aplicativo do kernel. Alternativamente, para usar mais de 2 GB, use uma versão de 64 bits do Windows.

* **Alias do sistema de arquivos**

Ao usar as tabelas `MyISAM`, você não pode usar aliases dentro do link de Windows para os arquivos de dados em outro volume e, em seguida, vincular de volta para a localização principal do MySQL `datadir`.

Essa facilidade é frequentemente usada para mover os arquivos de dados e de índice para um RAID ou outra solução rápida.

* **Número limitado de portas**

Os sistemas Windows têm cerca de 4.000 portas disponíveis para conexões de clientes, e após uma conexão em uma porta ser fechada, leva de dois a quatro minutos antes que a porta possa ser reutilizada. Em situações em que clientes se conectam e desconectam do servidor em alta taxa, é possível que todas as portas disponíveis sejam usadas antes que as portas fechadas se tornem disponíveis novamente. Se isso acontecer, o servidor MySQL parece não estar respondendo, mesmo estando em execução. As portas também podem ser usadas por outras aplicações que estão em execução na máquina, nesse caso, o número de portas disponíveis para o MySQL é menor.

Para mais informações sobre esse problema, consulte <https://support.microsoft.com/kb/196271>.

* **`DATA DIRECTORY` e `INDEX DIRECTORY`**

A cláusula `DATA DIRECTORY` da declaração `CREATE TABLE` é suportada em Windows apenas para tabelas `InnoDB`, conforme descrito na Seção 17.6.1.2, “Criando Tabelas Externamente”. Para `MyISAM` e outros motores de armazenamento, as cláusulas `DATA DIRECTORY` e `INDEX DIRECTORY` para [`CREATE TABLE`](create-table.html "15.1.20 CREATE TABLE Statement") são ignoradas em Windows e em outras plataformas com uma chamada `realpath()` não funcional.

* **`DROP DATABASE`(drop-database.html "15.1.24 DROP DATABASE Statement")**

Você não pode descartar um banco de dados que está sendo usado por outra sessão.

* Nomes que não são sensíveis a maiúsculas e minúsculas

Os nomes dos arquivos não são sensíveis ao caso em Windows, portanto, os nomes dos bancos de dados e das tabelas do MySQL também não são sensíveis ao caso em Windows. A única restrição é que os nomes dos bancos de dados e das tabelas devem ser especificados usando o mesmo caso em toda uma declaração dada. Veja a Seção 11.2.3, “Sensibilidade ao Caso do Identificador”.

* **Diretório e nomes de arquivos**

No Windows, o MySQL Server suporta apenas nomes de diretório e de arquivo que são compatíveis com as páginas de código ANSI atuais. Por exemplo, o seguinte nome de diretório japonês não funciona no local ocidental (página de código 1252):

  ```
  datadir="C:/私たちのプロジェクトのデータ"
  ```

A mesma limitação se aplica aos nomes de diretórios e arquivos referenciados em declarações SQL, como o nome do caminho do arquivo de dados em `LOAD DATA`.

* **O caractere de separador do nome do caminho `\`**

Os componentes do nome do caminho no Windows são separados pelo caractere `\`, que também é o caractere de escape no MySQL. Se você estiver usando [`LOAD DATA`](load-data.html "15.2.9 LOAD DATA Statement") ou [`SELECT ... INTO OUTFILE`](select-into.html "15.2.13.1 SELECT ... INTO Statement"), use nomes de arquivos estilo Unix com caracteres `/`:

  ```
  mysql> LOAD DATA INFILE 'C:/tmp/skr.txt' INTO TABLE skr;
  mysql> SELECT * INTO OUTFILE 'C:/tmp/skr.txt' FROM skr;
  ```

Alternativamente, você deve duplicar o caractere `\`:

  ```
  mysql> LOAD DATA INFILE 'C:\\tmp\\skr.txt' INTO TABLE skr;
  mysql> SELECT * INTO OUTFILE 'C:\\tmp\\skr.txt' FROM skr;
  ```

* **Problemas com tubulações**

As tubulações não funcionam de forma confiável a partir do prompt de linha de comando do Windows. Se a tubulação incluir o caractere `^Z` / `CHAR(24)`, o Windows pensa que encontrou o fim de arquivo e interrompe o programa.

Esse é principalmente um problema quando você tenta aplicar um log binário da seguinte forma:

  ```
  C:\> mysqlbinlog binary_log_file | mysql --user=root
  ```

Se você tiver um problema ao aplicar o log e suspeitar que isso seja devido a um caractere `^Z` / `CHAR(24)`, você pode usar a solução alternativa a seguir:

  ```
  C:\> mysqlbinlog binary_log_file --result-file=/tmp/bin.sql
  C:\> mysql --user=root --execute "source /tmp/bin.sql"
  ```

O último comando também pode ser usado para ler de forma confiável qualquer arquivo SQL que possa conter dados binários.