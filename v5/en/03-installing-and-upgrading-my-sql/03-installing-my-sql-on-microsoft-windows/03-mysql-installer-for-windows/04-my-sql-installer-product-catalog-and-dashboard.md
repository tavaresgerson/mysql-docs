#### 2.3.3.4 Catálogo de Produtos e Dashboard do MySQL Installer

Esta seção descreve o catálogo de produtos do MySQL Installer, o Dashboard e outras ações relacionadas à seleção e ao Upgrade de produtos.

* Catálogo de Produtos
* Dashboard do MySQL Installer
* Localizando Produtos para Install
* Upgrading do MySQL Server
* Removendo o MySQL Server
* Upgrading do MySQL Installer

##### Catálogo de Produtos

O catálogo de produtos armazena a lista completa de produtos MySQL lançados para Microsoft Windows que estão disponíveis para Download em [MySQL Downloads](https://dev.mysql.com/downloads/). Por padrão, e quando há uma conexão com a Internet, o MySQL Installer tenta atualizar o catálogo na inicialização a cada sete dias. Você também pode atualizar o catálogo manualmente a partir do Dashboard (descrito posteriormente).

Um catálogo atualizado executa as seguintes ações:

* Preenche o painel de Produtos Disponíveis (Available Products) da página Selecionar Produtos (Select Products). Esta etapa aparece quando você seleciona:

  + O tipo de Setup `Custom` durante o Setup inicial.

  + A operação Add a partir do Dashboard.

* Identifica quando há Updates de produtos disponíveis para os produtos instalados listados no Dashboard.

O catálogo inclui todos os lançamentos de desenvolvimento (Pre-Release), lançamentos gerais (Current GA) e lançamentos secundários (Other Releases). Os produtos no catálogo podem variar um pouco, dependendo do Release do MySQL Installer que você baixou.

##### Dashboard do MySQL Installer

O Dashboard do MySQL Installer é a visualização padrão que você vê ao iniciar o MySQL Installer após a conclusão do Setup inicial. Se você fechou o MySQL Installer antes da conclusão do Setup, o MySQL Installer retoma o Setup inicial antes de exibir o Dashboard.

Nota

Produtos cobertos pelo Oracle Lifetime Sustaining Support, se instalados, podem aparecer no Dashboard. Esses produtos, como MySQL for Excel e MySQL Notifier, podem apenas ser modificados ou removidos.

**Figure 2.11 Elementos do Dashboard do MySQL Installer**

![O conteúdo é descrito no texto circundante.](images/mi-dashboard-annotated.png)

###### Descrição dos Elementos do Dashboard do MySQL Installer

1. As operações do Dashboard do MySQL Installer oferecem uma variedade de ações que se aplicam a produtos instalados ou a produtos listados no catálogo. Para iniciar as seguintes operações, primeiro clique no link da operação e, em seguida, selecione o produto ou produtos a serem gerenciados:

   * Add: Esta operação abre a página Selecionar Produtos (Select Products). A partir dela, você pode ajustar o filtro, selecionar um ou mais produtos para Download (conforme necessário) e iniciar a Install. Para obter dicas sobre como usar o filtro, consulte Localizando Produtos para Install.

     Use as setas direcionais para mover cada produto da coluna Produtos Disponíveis (Available Products) para a coluna Produtos a Serem Instalados (Products To Be Installed). Para habilitar a página Recursos do Produto (Product Features), onde você pode personalizar os Features, clique na caixa de seleção relacionada (desabilitada por padrão).

   * Modify: Use esta operação para adicionar ou remover os Features associados a produtos instalados. Os Features que você pode modificar variam em complexidade por produto. Quando a caixa de seleção Atalho do Programa (Program Shortcut) está selecionada, o produto aparece no menu Iniciar (Start) sob o grupo `MySQL`.

   * Upgrade: Esta operação carrega a página Selecionar Produtos para Upgrade (Select Products to Upgrade) e a preenche com todos os candidatos a Upgrade. Um produto instalado pode ter mais de uma versão de Upgrade e a operação requer um catálogo de produtos atualizado. O MySQL Installer faz o Upgrade de todos os produtos selecionados em uma única ação. Clique em Exibir Detalhes (Show Details) para visualizar as ações executadas pelo MySQL Installer.

   * Remove: Esta operação abre a página Remover Produtos (Remove Products) e a preenche com os produtos MySQL instalados no host. Selecione os produtos MySQL que deseja remover (Uninstall) e, em seguida, clique em Executar (Execute) para iniciar o processo de remoção. Durante a operação, um indicador mostra o número de etapas executadas como uma porcentagem do total de etapas.

     Para selecionar produtos para remoção, faça o seguinte:

     + Selecione a caixa de seleção de um ou mais produtos.
     + Selecione a caixa de seleção Produto (Product) para selecionar todos os produtos.

2. O link Reconfigurar (Reconfigure) na coluna Ação Rápida (Quick Action) ao lado de cada Server instalado carrega os valores de configuração atuais para o Server e, em seguida, percorre todas as etapas de configuração, permitindo que você altere as opções e valores. Você deve fornecer credenciais com privilégios de root para reconfigurar esses itens. Clique na guia Log para exibir a saída de cada etapa de configuração executada pelo MySQL Installer.

   Após a conclusão, o MySQL Installer para o Server, aplica as alterações de configuração e reinicia o Server para você. Para uma descrição de cada opção de configuração, consulte a Seção 2.3.3.3.1, “Configuração do MySQL Server com o MySQL Installer”. Os `Samples and Examples` instalados associados a uma versão específica do MySQL Server também podem ser reconfigurados para aplicar novas configurações de Feature, se houver.

3. O link Catálogo (Catalog) permite que você faça o Download manual do catálogo mais recente de produtos MySQL e, em seguida, integre essas alterações de produto ao MySQL Installer. A ação de Download do catálogo não executa um Upgrade dos produtos já instalados no host. Em vez disso, ele retorna ao Dashboard e adiciona um ícone de seta à coluna Versão para cada produto instalado que possui uma versão mais recente. Use a operação Upgrade para instalar a versão mais recente do produto.

   Você também pode usar o link Catálogo (Catalog) para exibir o histórico de alterações atual de cada produto sem baixar o novo catálogo. Selecione a caixa de seleção Não atualizar neste momento (Do not update at this time) para visualizar apenas o histórico de alterações.

4. O ícone Sobre o MySQL Installer (About - !) mostra a versão atual do MySQL Installer e informações gerais sobre o MySQL. O número da versão está localizado acima do botão Voltar (Back).

   Dica

   Sempre inclua este número de versão ao relatar um problema com o MySQL Installer.

   Além das informações Sobre o MySQL (!), você também pode selecionar os seguintes ícones no painel lateral:

   * Ícone Licença (!) para o MySQL Installer.

     Este produto pode incluir software de terceiros, usado sob licença. Se você estiver usando um Release Comercial do MySQL Installer, o ícone abre o Manual do Usuário de Informações de Licença Comercial do MySQL Installer (MySQL Installer Commercial License Information User Manual) para informações de licenciamento, incluindo informações de licenciamento relacionadas a software de terceiros que podem estar incluídas neste Release Comercial. Se você estiver usando um Release Community do MySQL Installer, o ícone abre o Manual do Usuário de Informações de Licença Community do MySQL Installer (MySQL Installer Community License Information User Manual) para informações de licenciamento, incluindo informações de licenciamento relacionadas a software de terceiros que podem estar incluídas neste Release Community.

   * Ícone Links de Recurso (!) para a documentação, Blogs, Webinars e mais recentes do produto MySQL.

5. O ícone Opções do MySQL Installer (Options - !) inclui as seguintes guias:

   * Geral (General): Habilita ou desabilita a opção Modo Offline (Offline mode). Se selecionada, esta opção configura o MySQL Installer para rodar sem depender de capacidades de conexão com a Internet. Ao rodar o MySQL Installer no modo Offline, você verá um aviso juntamente com uma ação rápida Desabilitar (Disable) no Dashboard. O aviso serve para lembrar que rodar o MySQL Installer no modo Offline impede o Download dos produtos MySQL mais recentes e das atualizações do catálogo de produtos. O modo Offline persiste até que você desabilite a opção.

     Na inicialização, o MySQL Installer determina se uma conexão com a Internet está presente e, se não estiver, solicita que você habilite o modo Offline para retomar o trabalho sem uma conexão.

   * Catálogo de Produtos (Product Catalog): Gerencia as atualizações automáticas do catálogo. Por padrão, o MySQL Installer verifica atualizações do catálogo na inicialização a cada sete dias. Quando novos produtos ou versões de produtos estão disponíveis, o MySQL Installer os adiciona ao catálogo e, em seguida, insere um ícone de seta (!) próximo ao número de versão dos produtos instalados listados no Dashboard.

     Use a opção Catálogo de Produtos para habilitar ou desabilitar atualizações automáticas e para redefinir o número de dias entre os Downloads automáticos do catálogo. Na inicialização, o MySQL Installer usa o número de dias que você definiu para determinar se uma tentativa de Download deve ser feita. Essa ação é repetida durante a próxima inicialização se o MySQL Installer encontrar um erro ao baixar o catálogo.

   * Configurações de Conectividade (Connectivity Settings): Várias operações realizadas pelo MySQL Installer requerem acesso à Internet. Esta opção permite que você use um valor padrão para validar a conexão ou use um URL diferente, selecionado em uma lista ou adicionado manualmente por você. Com a opção Manual selecionada, novos URLs podem ser adicionados e todos os URLs na lista podem ser movidos ou excluídos. Quando a opção Automático (Automatic) é selecionada, o MySQL Installer tenta se conectar a cada URL padrão na lista (em ordem) até que uma conexão seja estabelecida. Se nenhuma conexão puder ser feita, ele levanta um Error.

   * Proxy: O MySQL Installer fornece múltiplos modos de Proxy que permitem que você baixe produtos MySQL, Updates ou mesmo o catálogo de produtos na maioria dos ambientes de rede. Os modos são:

     + Sem Proxy (No proxy)

       Selecione este modo para impedir que o MySQL Installer procure por configurações do sistema. Este modo desabilita quaisquer configurações de Proxy.

     + Automático (Automatic)

       Selecione este modo para que o MySQL Installer procure por configurações do sistema e use essas configurações, se encontradas, ou não use Proxy, se nada for encontrado. Este modo é o padrão (default).

     + Manual

       Selecione este modo para que o MySQL Installer use seus detalhes de autenticação para configurar o acesso Proxy à Internet. Especificamente:

       - Um endereço de Proxy Server (`http://`*`address-to-server`*) e número da porta (port number)

       - Um nome de usuário e senha para autenticação

##### Localizando Produtos para Install

Os produtos MySQL no catálogo são listados por categoria: MySQL Servers, Applications, MySQL Connectors e Documentation. Apenas as versões GA mais recentes aparecem no painel Produtos Disponíveis (Available Products) por padrão. Se você estiver procurando por um pre-release ou uma versão mais antiga de um produto, ela pode não estar visível na lista padrão.

Nota

Mantenha o catálogo de produtos atualizado. Clique em Catálogo (Catalog) no Dashboard do MySQL Installer para baixar o manifesto mais recente.

Para alterar a lista de produtos padrão, clique em Add no Dashboard para abrir a página Selecionar Produtos (Select Products) e, em seguida, clique em Editar (Edit) para abrir a caixa de diálogo mostrada na figura a seguir. Modifique as configurações e, em seguida, clique em Filtrar (Filter).

**Figure 2.12 Filtrar Produtos Disponíveis**

![Filtre por Texto, Categoria, Maturidade, Já Baixados e Arquitetura.](images/mi-product-filter.png)

Redefina um ou mais dos seguintes campos para modificar a lista de produtos disponíveis:

* Text: Filtra por texto (Text).
* Category: Todo o Software (All Software - padrão), MySQL Servers, Applications, MySQL Connectors ou Documentation (para samples e documentation).

* Maturity: Bundle Atual (Current Bundle - aparece inicialmente apenas com o pacote completo), Pre-Release, Current GA ou Outros Releases (Other Releases). Se você vir um aviso, confirme se possui o manifesto de produto mais recente clicando em Catálogo (Catalog) no Dashboard do MySQL Installer. Se o MySQL Installer não conseguir baixar o manifesto, o intervalo de produtos que você vê é limitado a produtos agrupados (bundled products), MSIs de produtos Standalone já localizados na pasta `Product Cache` ou ambos.

  Nota

  O Release Comercial do MySQL Installer não exibe nenhum produto MySQL quando você seleciona o filtro de maturidade Pre-Release. Os produtos em desenvolvimento estão disponíveis apenas no Release Community do MySQL Installer.

* Already Downloaded: Já Baixado (Already Downloaded - a caixa de seleção está desmarcada por padrão). Permite visualizar e gerenciar apenas produtos baixados.

* Architecture: Qualquer (Any - padrão), 32-bit ou 64-bit.

##### Upgrading do MySQL Server

Condições importantes para Upgrade de Server:

* O MySQL Installer não permite Upgrades de Server entre versões de Major Release ou versões de Minor Release, mas permite Upgrades dentro de uma série de Release, como um Upgrade de 8.0.36 para 8.0.37.

* Upgrades entre Milestone Releases (ou de um Milestone Release para um Release GA) não são suportados. Ocorrem mudanças significativas de desenvolvimento nos Milestone Releases e você pode encontrar problemas de compatibilidade ou problemas ao iniciar o Server.

* Para Upgrades, uma caixa de seleção permite ignorar a verificação e o processo de Upgrade para System Tables, enquanto verifica e processa as tabelas do Data Dictionary normalmente. O MySQL Installer não solicita a caixa de seleção quando o Upgrade de Server anterior foi ignorado ou quando o Server foi configurado como um Sandbox InnoDB Cluster. Este comportamento representa uma mudança na forma como o MySQL Server realiza um Upgrade (consulte O que o Processo de Upgrade do MySQL Atualiza) e altera a sequência de etapas que o MySQL Installer aplica ao processo de configuração.

  Se você selecionar Ignorar verificação e processo de Upgrade de System Tables. (Não recomendado) (Skip system tables upgrade check and process. (Not recommended)), o MySQL Installer inicia o Server atualizado com a opção de Server `--upgrade=MINIMAL`, que faz o Upgrade apenas do Data Dictionary. Se você parar e, em seguida, reiniciar o Server sem a opção `--upgrade=MINIMAL`, o Server faz o Upgrade das System Tables automaticamente, se necessário.

  A seguinte informação aparece na guia Log e no arquivo de Log após a conclusão da configuração de Upgrade (com System Tables ignoradas):

  ```sql
  WARNING: The system tables upgrade was skipped after upgrading MySQL Server. The
  server will be started now with the --upgrade=MINIMAL option, but then each
  time the server is started it will attempt to upgrade the system tables, unless
  you modify the Windows service (command line) to add --upgrade=MINIMAL to bypass
  the upgrade.

  FOR THE BEST RESULTS: Run mysqld.exe --upgrade=FORCE on the command line to upgrade
  the system tables manually.
  ```

Para escolher uma nova versão do Server:

1. Clique em Upgrade. Confirme se a caixa de seleção ao lado do nome do produto no painel Produtos Passíveis de Upgrade (Upgradeable Products) está marcada. Desmarque os produtos que você não pretende atualizar neste momento.

   Nota

   Para Milestone Releases de Server na mesma série de Release, o MySQL Installer desmarca o Upgrade de Server e exibe um aviso para indicar que o Upgrade não é suportado, identifica os riscos de continuar e fornece um resumo das etapas para realizar um Upgrade lógico manualmente. Você pode reselecionar o Upgrade de Server por sua própria conta e risco. Para obter instruções sobre como realizar um Upgrade lógico com um Milestone Release, consulte Upgrade Lógico (Logical Upgrade).

2. Clique em um produto na lista para destacá-lo. Esta ação preenche o painel Versões Passíveis de Upgrade (Upgradeable Versions) com os detalhes de cada versão disponível para o produto selecionado: número da versão, data de publicação e um link `Changes` para abrir as Notas de Release para essa versão.

##### Removendo o MySQL Server

Para remover um MySQL Server local:

1. Determine se o Data Directory local deve ser removido. Se você mantiver o Data Directory, outra Install de Server pode reutilizar os dados. Esta opção está habilitada por padrão (remove o Data Directory).

2. Clique em Executar (Execute) para começar a Uninstall do Server local. Observe que todos os produtos que você selecionou para remover também são desinstalados neste momento.

3. (Opcional) Clique na guia Log para exibir as ações atuais executadas pelo MySQL Installer.

##### Upgrading do MySQL Installer

O MySQL Installer permanece instalado em seu computador e, assim como outro software, o MySQL Installer pode ser atualizado a partir da versão anterior (Upgrade). Em alguns casos, outro software MySQL pode exigir que você faça o Upgrade do MySQL Installer para garantir a compatibilidade. Esta seção descreve como identificar a versão atual do MySQL Installer e como fazer o Upgrade do MySQL Installer manualmente.

**Para localizar a versão instalada do MySQL Installer:**

1. Inicie o MySQL Installer a partir do menu de pesquisa. O Dashboard do MySQL Installer é aberto.
2. Clique no ícone Sobre o MySQL Installer (About - !). O número da versão está localizado acima do botão Voltar (Back).

**Para iniciar um Upgrade sob demanda do MySQL Installer:**

1. Conecte o computador com o MySQL Installer instalado à Internet.
2. Inicie o MySQL Installer a partir do menu de pesquisa. O Dashboard do MySQL Installer é aberto.
3. Clique em Catálogo (Catalog) na parte inferior do Dashboard para abrir a janela Atualizar Catálogo (Update Catalog).

4. Clique em Executar (Execute) para iniciar o processo. Se a versão instalada do MySQL Installer puder ser atualizada (Upgrade), você será solicitado a iniciar o Upgrade.

5. Clique em Avançar (Next) para revisar todas as alterações no catálogo e, em seguida, clique em Concluir (Finish) para retornar ao Dashboard.

6. Verifique a (nova) versão instalada do MySQL Installer (consulte o procedimento anterior).