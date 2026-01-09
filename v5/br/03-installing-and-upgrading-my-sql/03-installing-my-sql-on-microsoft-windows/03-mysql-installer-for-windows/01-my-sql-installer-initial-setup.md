#### 2.3.3.1 Configuração inicial do instalador do MySQL

- Escolher um tipo de configuração
- Conflitos de caminho
- Verifique os requisitos
- Arquivos de configuração do instalador do MySQL

Quando você baixa o Instalador do MySQL pela primeira vez, um assistente de instalação o guia durante a instalação inicial dos produtos MySQL. Como a figura a seguir mostra, a configuração inicial é uma atividade única no processo geral. O Instalador do MySQL detecta os produtos MySQL existentes instalados no host durante sua configuração inicial e os adiciona à lista de produtos a serem gerenciados.

**Figura 2.7 Visão geral do processo do instalador do MySQL**

![Processo do instalador do MySQL. Passos não repetitivos: baixar o instalador do MySQL; realizar a configuração inicial. Passos repetitivos: instalar produtos (baixar os produtos, executar os arquivos .msi, configuração e instalação completa); gerenciar produtos e atualizar o catálogo do instalador do MySQL.](images/mi-process-overview.png)

O Instalador do MySQL extrai os arquivos de configuração (descritos mais adiante) no disco rígido do host durante a configuração inicial. Embora o Instalador do MySQL seja um aplicativo de 32 bits, ele pode instalar tanto binários de 32 bits quanto de 64 bits.

A configuração inicial adiciona um link ao menu Iniciar sob o grupo de pastas MySQL. Clique em Iniciar, MySQL e Instalador MySQL - [Comunidade | Comercial] para abrir a versão comunitária ou comercial da ferramenta gráfica.

##### Escolher um tipo de configuração

Durante a configuração inicial, você será solicitado a selecionar os produtos MySQL a serem instalados no host. Uma alternativa é usar um tipo de configuração predeterminado que corresponda aos seus requisitos de configuração. Por padrão, os produtos GA e pré-lançamento estão incluídos no download e na instalação com os tipos de configuração Cliente e Completa. Selecione a opção Instale apenas produtos GA para restringir o conjunto de produtos a incluir apenas produtos GA ao usar esses tipos de configuração.

Nota

Os produtos MySQL apenas para uso comercial, como o MySQL Enterprise Backup, estão disponíveis para seleção e instalação se você estiver usando a versão comercial do Instalador MySQL (consulte a versão comercial do Instalador MySQL).

A escolha de um dos seguintes tipos de configuração determina apenas a instalação inicial e não limita sua capacidade de instalar ou atualizar produtos MySQL para Windows posteriormente:

- **Servidor apenas**: Instale apenas o servidor MySQL. Este tipo de configuração instala o servidor de disponibilidade geral (GA) ou a versão de desenvolvimento que você selecionou ao baixar o MySQL Installer. Ele usa as diretivas de instalação e de dados padrão.

- **Apenas para clientes**: Instale apenas as versões mais recentes dos aplicativos do MySQL (como o MySQL Shell, o MySQL Router e o MySQL Workbench). Esse tipo de configuração exclui o servidor MySQL ou os programas do cliente normalmente incluídos com o servidor, como **mysql** ou **mysqladmin**.

- **Total**: Instale todos os produtos MySQL disponíveis, excluindo os conectores MySQL.

- **Personalizado**: O tipo de configuração personalizada permite que você filtre e selecione produtos MySQL individuais do catálogo do Instalador MySQL.

  Use o tipo de configuração "Personalizado" para instalar:

  - Um produto ou versão do produto que não está disponível nas locações de download habituais. O catálogo contém todas as versões do produto, incluindo as outras versões entre pré-lançamento (ou desenvolvimento) e GA.

  - Um exemplo de servidor MySQL usando um caminho de instalação alternativo, um caminho de dados ou ambos. Para obter instruções sobre como ajustar os caminhos, consulte a Seção 2.3.3.2, “Definindo caminhos de servidor alternativos com o Instalador MySQL”.

  - Duas ou mais versões do servidor MySQL no mesmo host ao mesmo tempo (por exemplo, 5.7 e 8.0).

  - Uma combinação específica de produtos e recursos que não são oferecidos como um tipo de configuração pré-definido. Por exemplo, você pode instalar um único produto, como o MySQL Workbench, em vez de instalar todas as aplicações do cliente para Windows.

##### Conflitos de caminho

Quando a pasta de instalação padrão ou de dados (requerida pelo servidor MySQL) para que um produto seja instalado já existir no host, o assistente exibe a etapa de Conflitos de Caminho para identificar cada conflito e permitir que você tome medidas para evitar que os arquivos na pasta existente sejam sobrescritos pela nova instalação. Você verá essa etapa na configuração inicial apenas quando o Instalador do MySQL detectar um conflito.

Para resolver o conflito de caminho, faça um dos seguintes:

- Selecione um produto da lista para exibir as opções de conflito. Um símbolo de alerta indica qual caminho está em conflito. Use o botão de navegação para escolher um novo caminho e, em seguida, clique em Próximo.

- Clique em Voltar para escolher um tipo de configuração ou versão do produto diferente, se aplicável. O tipo de configuração `Personalizado` permite que você selecione versões individuais do produto.

- Clique em Próximo para ignorar o conflito e sobrescrever os arquivos na pasta existente.

- Exclua o produto existente. Clique em Cancelar para interromper a configuração inicial e fechar o MySQL Installer. Abra novamente o MySQL Installer a partir do menu Iniciar e exclua o produto instalado do host usando a operação Excluir no painel do MySQL Installer.

##### Verifique os requisitos

O Instalador do MySQL usa entradas no arquivo `package-rules.xml` para determinar se o software pré-requisito para cada produto está instalado no host. Quando a verificação de requisitos falha, o Instalador do MySQL exibe a etapa Verificar Requisitos para ajudá-lo a atualizar o host. Os requisitos são avaliados sempre que você baixa um novo produto (ou versão) para instalação. A figura a seguir identifica e descreve as principais áreas desta etapa.

**Figura 2.8 Verificar Requisitos**

![MySQL Installer verifica os requisitos antes que quaisquer requisitos sejam baixados e instalados](images/mi-requirements-annotated.png)

###### Descrição dos elementos de verificação de requisitos

1. Mostra a etapa atual na configuração inicial. As etapas nesta lista podem mudar ligeiramente dependendo dos produtos já instalados no host, da disponibilidade do software pré-requisito e dos produtos a serem instalados no host.

2. Lista todos os requisitos de instalação pendentes por produto e indica o status da seguinte forma:

   - Um espaço em branco na coluna Status significa que o Instalador do MySQL pode tentar baixar e instalar o software necessário para você.

   - A palavra *Manual* na coluna Status significa que você deve atender ao requisito manualmente. Selecione cada produto na lista para ver os detalhes do requisito.

3. Descreve o requisito em detalhes para ajudá-lo com cada resolução manual. Quando possível, é fornecida uma URL de download. Após baixar e instalar o software necessário, clique em Verificar para verificar se o requisito foi atendido.

4. Oferece as seguintes operações de conjunto para prosseguir:

   - Voltar – Voltar ao passo anterior. Essa ação permite que você selecione um tipo de configuração diferente.

   - Executar – Faça com que o Instalador do MySQL tente baixar e instalar o software necessário para todos os itens sem status manual. Os requisitos manuais são resolvidos por você e verificados clicando em Verificar.

   - Próximo – Não execute a solicitação para aplicar os requisitos automaticamente e prossiga para a instalação sem incluir os produtos que não atenderem aos requisitos de verificação.

   - Cancelar – Parar a instalação dos produtos MySQL. Como o Instalador MySQL já está instalado, a configuração inicial é reiniciada quando você abre o Instalador MySQL no menu Iniciar e clica em Adicionar no painel. Para uma descrição das operações de gerenciamento disponíveis, consulte o Catálogo de Produtos.

##### Arquivos de configuração do instalador do MySQL

Todos os arquivos do Instalador do MySQL estão localizados nas pastas `C:\Program Files (x86)` e `C:\ProgramData`. A tabela a seguir descreve os arquivos e pastas que definem o Instalador do MySQL como uma aplicação autônoma.

Nota

Os produtos instalados do MySQL não são alterados nem removidos quando você atualiza ou desinstala o Instalador do MySQL.

**Tabela 2.5 Arquivos de configuração do instalador do MySQL**

<table>
   <thead>
      <tr>
         <th>Arquivo ou Pasta</th>
         <th>Descrição</th>
         <th>Hierarquia de Pasta</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <th><code>MySQL Installer for Windows</code></th>
         <td>Esta pasta contém todos os arquivos necessários para executar o MySQL Installer e o <strong>MySQLInstallerConsole.exe</strong>, um programa de linha de comando com funcionalidade semelhante.</td>
         <td><code>C:\Program Files (x86)</code></td>
      </tr>
      <tr>
         <th><code>Templates</code></th>
         <td>A pasta <code>Templates</code> contém um arquivo para cada versão do servidor MySQL. Os arquivos de modelo contêm chaves e fórmulas para calcular alguns valores dinamicamente.</td>
         <td><code>C:\ProgramData\MySQL\MySQL Installer for Windows\Manifest</code></td>
      </tr>
      <tr>
         <th><code>package-rules.xml</code></th>
         <td>Este arquivo contém os pré-requisitos para a instalação de todos os produtos.</td>
         <td><code>C:\ProgramData\MySQL\MySQL Installer for Windows\Manifest</code></td>
      </tr>
      <tr>
         <th><code>products.xml</code></th>
         <td>O arquivo <code>products</code> (ou catálogo de produtos) contém uma lista de todos os produtos disponíveis para download.</td>
         <td><code>C:\ProgramData\MySQL\MySQL Installer for Windows\Manifest</code></td>
      </tr>
      <tr>
         <th><code>Product Cache</code></th>
         <td>A pasta <code>Product Cache</code> contém todos os arquivos <code>.msi</code> independentes incluídos no pacote completo ou baixados posteriormente.</td>
         <td><code>C:\ProgramData\MySQL\MySQL Installer for Windows</code></td>
      </tr>
   </tbody>
</table>
