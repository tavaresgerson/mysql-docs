#### 2.3.3.1 Configuração Inicial do MySQL Installer

* Escolhendo um Tipo de Setup
* Conflitos de Path
* Verificação de Requisitos
* Arquivos de Configuração do MySQL Installer

Ao baixar o MySQL Installer pela primeira vez, um assistente de Setup (setup wizard) guia você pela instalação inicial dos produtos MySQL. Como a figura a seguir mostra, o Setup inicial é uma atividade única no processo geral. O MySQL Installer detecta produtos MySQL existentes instalados no host durante seu Setup inicial e os adiciona à lista de produtos a serem gerenciados.

**Figura 2.7 Visão Geral do Processo do MySQL Installer**

![Processo do MySQL Installer. Etapas não repetitivas: fazer o download do MySQL Installer; realizar o Setup inicial. Etapas repetitivas: instalar produtos (baixar produtos, executar arquivos .msi, configuration, e instalação completa); gerenciar produtos e atualizar o Catalog do MySQL Installer.](images/mi-process-overview.png)

O MySQL Installer extrai arquivos de Configuration (descritos posteriormente) para o disco rígido do host durante o Setup inicial. Embora o MySQL Installer seja um aplicativo 32-bit, ele pode instalar Binaries 32-bit e 64-bit.

O Setup inicial adiciona um link ao menu Start sob o grupo de pastas MySQL. Clique em Start, MySQL e MySQL Installer - [Community | Commercial] para abrir a versão community ou commercial da ferramenta gráfica.

##### Escolhendo um Tipo de Setup

Durante o Setup inicial, você é solicitado a selecionar os produtos MySQL a serem instalados no host. Uma alternativa é usar um tipo de Setup predeterminado que corresponda aos seus requisitos de Setup. Por padrão, produtos GA (General Availability) e de pré-lançamento estão incluídos no download e na instalação com os tipos de Setup Client only (Apenas Client) e Full (Completo). Selecione a opção Only install GA products (Instalar apenas produtos GA) para restringir o conjunto de produtos a incluir apenas produtos GA ao usar esses tipos de Setup.

Nota

Produtos MySQL apenas comerciais, como o MySQL Enterprise Backup, estão disponíveis para seleção e instalação se você estiver usando a versão Commercial do MySQL Installer (consulte MySQL Installer Commercial Release).

A escolha de um dos seguintes tipos de Setup determina apenas a instalação inicial e não limita sua capacidade de instalar ou atualizar produtos MySQL para Windows posteriormente:

* **Server only** (Apenas Server): Apenas instala o MySQL server. Este tipo de Setup instala o Server de disponibilidade geral (GA) ou de release de desenvolvimento que você selecionou ao baixar o MySQL Installer. Ele usa os Paths de instalação e Data Paths padrão.

* **Client only** (Apenas Client): Apenas instala os aplicativos MySQL mais recentes (como MySQL Shell, MySQL Router e MySQL Workbench). Este tipo de Setup exclui o MySQL server ou os programas Client tipicamente incluídos com o Server, como **mysql** ou **mysqladmin**.

* **Full** (Completo): Instala todos os produtos MySQL disponíveis, excluindo os Connectors MySQL.

* **Custom** (Personalizado): O tipo de Setup custom permite filtrar e selecionar produtos MySQL individuais do Catalog do MySQL Installer.

  Use o tipo de Setup `Custom` para instalar:

  + Um produto ou versão de produto que não esteja disponível nos locais de download habituais. O Catalog contém todas as releases de produtos, incluindo outras releases entre pré-lançamento (ou desenvolvimento) e GA.

  + Uma instância do MySQL server usando um Path de instalação alternativo, Data Path ou ambos. Para instruções sobre como ajustar os Paths, consulte Seção 2.3.3.2, “Definindo Paths Alternativos de Server com o MySQL Installer”.

  + Duas ou mais versões do MySQL server no mesmo host simultaneamente (por exemplo, 5.7 e 8.0).

  + Uma combinação específica de produtos e funcionalidades não oferecida como um tipo de Setup predeterminado. Por exemplo, você pode instalar um único produto, como MySQL Workbench, em vez de instalar todos os aplicativos Client para Windows.

##### Conflitos de Path

Quando a pasta de instalação ou Data folder padrão (exigida pelo MySQL server) para um produto a ser instalado já existe no host, o assistente exibe a etapa Path Conflict para identificar cada conflito e permitir que você tome medidas para evitar que arquivos na pasta existente sejam sobrescritos pela nova instalação. Você verá esta etapa no Setup inicial apenas quando o MySQL Installer detectar um conflito.

Para resolver o conflito de Path, execute uma das seguintes ações:

* Selecione um produto na lista para exibir as opções de conflito. Um símbolo de aviso indica qual Path está em conflito. Use o botão de navegação (browse button) para escolher um novo Path e clique em Next.

* Clique em Back para escolher um tipo de Setup ou versão de produto diferente, se aplicável. O tipo de Setup `Custom` permite que você selecione versões individuais de produtos.

* Clique em Next para ignorar o conflito e sobrescrever arquivos na pasta existente.

* Exclua o produto existente. Clique em Cancel para interromper o Setup inicial e fechar o MySQL Installer. Abra o MySQL Installer novamente no menu Start e exclua o produto instalado do host usando a operação Delete (Excluir) no Dashboard do MySQL Installer.

##### Verificação de Requisitos

O MySQL Installer usa entradas no arquivo `package-rules.xml` para determinar se o software pré-requisito para cada produto está instalado no host. Quando a verificação de requisitos falha, o MySQL Installer exibe a etapa Check Requirements para ajudar você a atualizar o host. Os requisitos são avaliados toda vez que você baixa um novo produto (ou versão) para instalação. A figura a seguir identifica e descreve as áreas principais desta etapa.

**Figura 2.8 Verificação de Requisitos**

![Verificação de requisitos do MySQL Installer antes que quaisquer requisitos sejam baixados e instalados.](images/mi-requirements-annotated.png)

###### Descrição dos Elementos de Verificação de Requisitos

1. Mostra a etapa atual no Setup inicial. As etapas nesta lista podem mudar ligeiramente dependendo dos produtos já instalados no host, da disponibilidade do software pré-requisito e dos produtos a serem instalados no host.

2. Lista todos os requisitos de instalação pendentes por produto e indica o Status da seguinte forma:

   * Um espaço em branco na coluna Status significa que o MySQL Installer pode tentar baixar e instalar o software necessário para você.

   * A palavra *Manual* na coluna Status significa que você deve satisfazer o requisito manualmente. Selecione cada produto na lista para ver os detalhes do seu requisito.

3. Descreve o requisito em detalhes para ajudar você com cada resolução manual. Quando possível, um URL de download é fornecido. Depois de baixar e instalar o software necessário, clique em Check para verificar se o requisito foi atendido.

4. Fornece o seguinte conjunto de operações para prosseguir:

   * Back – Retorna à etapa anterior. Esta ação permite que você selecione um tipo de Setup diferente.

   * Execute – Faz com que o MySQL Installer tente baixar e instalar o software necessário para todos os itens sem um Status manual. Os requisitos manuais são resolvidos por você e verificados clicando em Check.

   * Next – Não executa a solicitação para aplicar os requisitos automaticamente e prossegue para a instalação sem incluir os produtos que falham na etapa de verificação de requisitos.

   * Cancel – Interrompe a instalação dos produtos MySQL. Como o MySQL Installer já está instalado, o Setup inicial recomeça quando você abre o MySQL Installer no menu Start e clica em Add no Dashboard. Para uma descrição das operações de gerenciamento disponíveis, consulte Product Catalog.

##### Arquivos de Configuração do MySQL Installer

Todos os arquivos do MySQL Installer estão localizados nas pastas `C:\Program Files (x86)` e `C:\ProgramData`. A tabela a seguir descreve os arquivos e pastas que definem o MySQL Installer como um aplicativo standalone.

Nota

Os produtos MySQL instalados não são alterados nem removidos quando você atualiza ou desinstala o MySQL Installer.

**Tabela 2.5 Arquivos de Configuração do MySQL Installer**

| Arquivo ou Pasta | Descrição | Hierarquia da Pasta |
| :--- | :--- | :--- |
| `MySQL Installer for Windows` | Esta pasta contém todos os arquivos necessários para executar o MySQL Installer e o **MySQLInstallerConsole.exe**, um programa Command-Line com funcionalidade semelhante. | `C:\Program Files (x86)` |
| `Templates` | A pasta `Templates` possui um arquivo para cada versão do MySQL server. Os arquivos Template contêm chaves e fórmulas para calcular alguns valores dinamicamente. | `C:\ProgramData\MySQL\MySQL Installer for Windows\Manifest` |
| `package-rules.xml` | Este arquivo contém os pré-requisitos para todos os produtos a serem instalados. | `C:\ProgramData\MySQL\MySQL Installer for Windows\Manifest` |
| `products.xml` | O arquivo `products` (ou Product Catalog) contém uma lista de todos os produtos disponíveis para download. | `C:\ProgramData\MySQL\MySQL Installer for Windows\Manifest` |
| `Product Cache` | A pasta `Product Cache` contém todos os arquivos `.msi` standalone incluídos no pacote completo ou baixados posteriormente. | `C:\ProgramData\MySQL\MySQL Installer for Windows` |