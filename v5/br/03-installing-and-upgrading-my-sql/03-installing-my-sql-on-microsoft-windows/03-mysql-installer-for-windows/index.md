### 2.3.3 Instalador do MySQL para Windows

O Instalador do MySQL é uma aplicação autônoma projetada para facilitar a complexidade da instalação e configuração dos produtos MySQL que funcionam no Microsoft Windows. Ele é baixado com suporte para os seguintes produtos do MySQL:

- Servidores MySQL

  O Instalador do MySQL pode instalar e gerenciar várias instâncias de servidores MySQL separados no mesmo host ao mesmo tempo. Por exemplo, o Instalador do MySQL pode instalar, configurar e atualizar instâncias separadas do MySQL 5.7 e do MySQL 8.0 no mesmo host. O Instalador do MySQL não permite atualizações de servidor entre números de versão principais e menores, mas permite atualizações dentro de uma série de lançamento (como 8.0.36 para 8.0.37).

  ::: info Nota
  O Instalador do MySQL não pode instalar tanto as versões *Community* quanto as versões *Comerciais* do servidor MySQL no mesmo host. Se você precisar de ambas as versões no mesmo host, considere usar a distribuição de arquivo ZIP para instalar uma das versões.
  :::

- Aplicações MySQL

  MySQL Workbench, MySQL Shell e MySQL Router.

- Conectores MySQL

  Esses não são suportados; em vez disso, instale a partir de <https://dev.mysql.com/downloads/>. Esses conectores incluem MySQL Connector/NET, MySQL Connector/Python, MySQL Connector/ODBC, MySQL Connector/J, MySQL Connector/Node.js e MySQL Connector/C++.

  ::: info Nota
  Os conectores estavam agrupados antes do MySQL Installer 1.6.7 (MySQL Server 8.0.34), e o MySQL Installer podia instalar cada conector até a versão 8.0.33 até o MySQL Installer 1.6.11 (MySQL Server 8.0.37). O MySQL Installer agora só detecta essas versões antigas dos conectores para desinstalá-las.
  :::

#### Requisitos de instalação

O Instalador do MySQL requer o Microsoft .NET Framework 4.5.2 ou versão posterior. Se essa versão não estiver instalada no computador hospedeiro, você pode baixá-la visitando o [site da Microsoft](https://www.microsoft.com/pt-br/download/details.aspx?id=42643).

Para invocar o Instalador do MySQL após uma instalação bem-sucedida:

1. Clique com o botão direito no botão Iniciar do Windows, selecione Executar e, em seguida, clique em Procurar. Navegue até `Program Files (x86) > MySQL > MySQL Installer for Windows` para abrir a pasta do programa.

2. Selecione um dos seguintes arquivos:

   - `MySQLInstaller.exe` para abrir o aplicativo gráfico.
   - `MySQLInstallerConsole.exe` para abrir o aplicativo de linha de comando.

3. Clique em Abrir e, em seguida, em OK na janela Executar. Se você for solicitado para permitir que o aplicativo faça alterações no dispositivo, selecione `Yes`.

Cada vez que você invoca o Instalador do MySQL, o processo de inicialização procura a presença de uma conexão à internet e solicita que você habilite o modo offline se não encontrar acesso à internet (e o modo offline estiver desativado). Selecione `Yes` para executar o Instalador do MySQL sem as capacidades de conexão à internet. A disponibilidade dos produtos do MySQL é limitada apenas aos produtos atualmente no cache de produtos quando você habilita o modo offline. Para baixar os produtos do MySQL, clique na ação rápida Desabilitar modo offline exibida no painel.

Uma conexão à internet é necessária para baixar um manifesto que contém metadados dos produtos MySQL mais recentes que não fazem parte de um pacote completo. O MySQL Installer tenta baixar o manifesto quando você inicia o aplicativo pela primeira vez e, em seguida, periodicamente em intervalos configuráveis (veja as opções do MySQL Installer). Alternativamente, você pode recuperar um manifesto atualizado manualmente clicando em Catálogo no painel do MySQL Installer.

::: info Nota
Se a primeira ou a subsequente tentativa de download do manifesto falhar, um erro será registrado e você poderá ter acesso limitado aos produtos MySQL durante sua sessão. O Instalador do MySQL tenta fazer o download do manifesto em cada inicialização até que a estrutura inicial do manifesto seja atualizada. Para obter ajuda para encontrar um produto, consulte Localizar produtos para instalação.
:::

#### Lançamento da Comunidade do Instalador do MySQL

Baixe o software em <https://dev.mysql.com/downloads/installer/> para instalar a versão comunitária de todos os produtos MySQL para Windows. Selecione uma das seguintes opções de pacote do Instalador MySQL:

- *Web*: Contém apenas os arquivos do instalador e de configuração do MySQL. A opção de pacote web baixa apenas os produtos do MySQL que você selecionar para instalar, mas requer uma conexão à internet para cada download. O tamanho deste arquivo é de aproximadamente 2 MB. O nome do arquivo tem a forma `mysql-installer-community-web-VERSION.N.msi`, onde *`VERSION`* é o número da versão do servidor MySQL, como 8.0 e `N` é o número do pacote, que começa em 0.

- *Pacote Completo ou Atualizado*: Agrupa todos os produtos do MySQL para Windows (incluindo o servidor MySQL). O tamanho do arquivo é superior a 300 MB, e o nome tem a forma `mysql-installer-community-VERSION.N.msi`, onde *`VERSION`* é o número da versão do MySQL Server, como 8.0, e `N` é o número do pacote, que começa em 0.

#### Lançamento comercial do instalador do MySQL

Baixe o software em <https://edelivery.oracle.com/> para instalar a versão comercial (Edição Padrão ou Empresarial) dos produtos MySQL para Windows. Se você estiver logado na sua conta do My Oracle Support (MOS), a versão comercial inclui todas as versões atuais e anteriores da versão GA disponíveis na versão comunitária, mas exclui as versões de marcos de desenvolvimento. Quando você não estiver logado, você verá apenas a lista de produtos empacotados que você já baixou.

O lançamento comercial também inclui os seguintes produtos:

- Workbench SE/EE
- MySQL Enterprise Backup
- Firewall empresarial MySQL

A versão comercial se integra à sua conta MOS. Para obter informações sobre conteúdo da base de conhecimento e correções, consulte [Meu Suporte Oracle](https://support.oracle.com/).
