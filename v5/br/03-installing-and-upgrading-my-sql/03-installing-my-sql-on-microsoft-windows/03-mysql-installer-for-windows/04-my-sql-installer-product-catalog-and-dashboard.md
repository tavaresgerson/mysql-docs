#### 2.3.3.4 Catálogo de produtos e painel de controle do instalador MySQL

Esta seção descreve o catálogo do produto MySQL Installer, o painel de controle e outras ações relacionadas à seleção e atualização do produto.

- Catálogo de produtos
- Painel do Instalador do MySQL
- Localizar produtos para instalação
- Atualizando o MySQL Server
- Remover o servidor MySQL
- Atualizando o Instalador do MySQL

##### Catálogo de produtos

O catálogo de produtos armazena a lista completa dos produtos MySQL lançados para o Microsoft Windows, disponíveis para download em [MySQL Downloads](https://dev.mysql.com/downloads/). Por padrão, e quando uma conexão com a Internet estiver disponível, o Instalador do MySQL tenta atualizar o catálogo ao iniciar a cada sete dias. Você também pode atualizar o catálogo manualmente no painel de controle (descrito mais adiante).

Um catálogo atualizado realiza as seguintes ações:

- Popula a guia "Produtos disponíveis" da página "Selecionar produtos". Essa etapa aparece quando você seleciona:

  - O tipo de configuração `Personalizado` durante a configuração inicial.

  - A operação Adicionar a partir do painel de controle.

- Identifica quando as atualizações do produto estão disponíveis para os produtos instalados listados no painel.

O catálogo inclui todas as versões de desenvolvimento (Pré-Lançamento), versões gerais (Atual GA) e versões menores (Outras Versões). Os produtos no catálogo podem variar um pouco, dependendo da versão do Instalador MySQL que você baixar.

##### Painel do Instalador do MySQL

O painel do Instalador do MySQL é a visualização padrão que você vê quando inicia o Instalador do MySQL após o término da configuração inicial. Se você fechou o Instalador do MySQL antes que a configuração fosse concluída, o Instalador do MySQL retoma a configuração inicial antes de exibir o painel.

Nota

Os produtos cobertos pelo Suporte de Manutenção Vitalício da Oracle, se instalados, podem aparecer no painel de controle. Esses produtos, como MySQL para Excel e MySQL Notifier, podem ser modificados ou removidos apenas.

**Figura 2.11 Elementos do Painel do Instalador do MySQL**

![O conteúdo é descrito no texto ao redor.](images/mi-dashboard-annotated.png)

###### Descrição dos elementos do painel do instalador do MySQL

1. As operações do painel do Instalador do MySQL oferecem uma variedade de ações que se aplicam a produtos instalados ou produtos listados no catálogo. Para iniciar as seguintes operações, clique primeiro no link da operação e, em seguida, selecione o(s) produto(s) a serem gerenciados:

   - Adicionar: Esta operação abre a página Selecionar Produtos. A partir daí, você pode ajustar o filtro, selecionar um ou mais produtos para baixar (se necessário) e iniciar a instalação. Para obter dicas sobre como usar o filtro, consulte Localizar Produtos para Instalação.

     Use as setas direcionais para mover cada produto da coluna Produtos Disponíveis para a coluna Produtos a serem instalados. Para habilitar a página de Recursos do Produto, onde você pode personalizar recursos, clique na caixa de seleção relacionada (desabilitada por padrão).

   - Modificar: Use esta operação para adicionar ou remover as funcionalidades associadas aos produtos instalados. As funcionalidades que você pode modificar variam em complexidade de acordo com o produto. Quando a caixa de seleção Atalho do Programa estiver selecionada, o produto aparecerá no menu Iniciar sob o grupo `MySQL`.

   - Atualização: Esta operação carrega a página Selecionar Produtos para Atualização e a preenche com todos os candidatos à atualização. Um produto instalado pode ter mais de uma versão de atualização e a operação requer um catálogo de produtos atual. O Instalador do MySQL atualiza todos os produtos selecionados em uma única ação. Clique em Mostrar detalhes para visualizar as ações realizadas pelo Instalador do MySQL.

   - Remover: Essa operação abre a página Remover Produtos e a preenche com os produtos MySQL instalados no host. Selecione os produtos MySQL que deseja remover (desinstalar) e, em seguida, clique em Executar para iniciar o processo de remoção. Durante a operação, um indicador mostra o número de etapas executadas como porcentagem de todas as etapas.

     Para selecionar os produtos a serem removidos, faça um dos seguintes:

     - Marque a caixa de seleção para um ou mais produtos.
     - Marque a caixa de seleção Produto para selecionar todos os produtos.

2. O link Reconfigurar na coluna Ação Rápida ao lado de cada servidor instalado carrega os valores de configuração atuais do servidor e, em seguida, percorre todas as etapas de configuração, permitindo que você altere as opções e os valores. Você deve fornecer credenciais com privilégios de administrador para reconfigurar esses itens. Clique na guia Log para exibir a saída de cada etapa de configuração realizada pelo Instalador do MySQL.

   Após a conclusão, o Instalador do MySQL para de funcionar no servidor, aplica as alterações de configuração e reinicia o servidor para você. Para uma descrição de cada opção de configuração, consulte a Seção 2.3.3.3.1, “Configuração do Servidor MySQL com o Instalador do MySQL”. Os `Samples and Examples` instalados associados a uma versão específica do servidor MySQL também podem ser reconfigurados para aplicar novas configurações de recursos, se houver.

3. O link do catálogo permite que você faça o download do catálogo mais recente dos produtos MySQL manualmente e, em seguida, integre essas alterações dos produtos com o Instalador do MySQL. A ação de download do catálogo não realiza uma atualização dos produtos já instalados no host. Em vez disso, retorna ao painel de controle e adiciona um ícone de seta à coluna Versão para cada produto instalado que tenha uma versão mais recente. Use a operação de Atualização para instalar a versão do produto mais recente.

   Você também pode usar o link do catálogo para exibir o histórico de alterações atuais de cada produto sem precisar baixar o novo catálogo. Marque a caixa de seleção Não atualizar neste momento para exibir apenas o histórico de alterações.

4. O ícone "Sobre" do Instalador MySQL (!) mostra a versão atual do Instalador MySQL e informações gerais sobre o MySQL. O número da versão está localizado acima do botão Voltar.

   Dica

   Sempre inclua este número de versão ao relatar um problema com o Instalador do MySQL.

   Além das informações sobre o MySQL (!), você também pode selecionar os seguintes ícones no painel lateral:

   - Ícone de licença (!) para o instalador do MySQL.

     Este produto pode incluir software de terceiros, utilizado sob licença. Se você estiver usando uma versão comercial do MySQL Installer, o ícone abre o Manual do Usuário da Informação da Licença Comercial do MySQL Installer para obter informações sobre a licença, incluindo informações sobre a licença relacionadas ao software de terceiros que pode estar incluído nesta versão comercial. Se você estiver usando uma versão comunitária do MySQL Installer, o ícone abre o Manual do Usuário da Informação da Licença Comunitária do MySQL Installer para obter informações sobre a licença, incluindo informações sobre a licença relacionadas ao software de terceiros que pode estar incluído nesta versão comunitária.

   - Os links de recursos (!) levam à documentação mais recente do produto MySQL, blogs, webinars e muito mais.

5. O ícone Opções do Instalador do MySQL (!) inclui as seguintes guias:

   - Geral: Habilita ou desabilita a opção Modo Off-line. Se selecionada, essa opção configura o Instalador do MySQL para funcionar sem depender das capacidades de conexão à internet. Ao executar o Instalador do MySQL no modo off-line, você verá um aviso junto com uma ação rápida Desabilitar no painel de controle. O aviso serve para lembrá-lo de que executar o Instalador do MySQL no modo off-line o impede de baixar os produtos e atualizações do catálogo de produtos mais recentes do MySQL. O modo off-line persiste até que você desabilite a opção.

     Ao iniciar, o Instalador do MySQL determina se há uma conexão à internet e, se não houver, solicita que você habilite o modo offline para continuar trabalhando sem conexão.

   - Catálogo de Produtos: Gerencia as atualizações automáticas do catálogo. Por padrão, o Instalador do MySQL verifica as atualizações do catálogo ao iniciar a cada sete dias. Quando novos produtos ou versões de produtos estão disponíveis, o Instalador do MySQL adiciona-os ao catálogo e, em seguida, insere um ícone de seta (!) ao lado do número da versão dos produtos instalados listados no painel de controle.

     Use a opção de catálogo de produtos para habilitar ou desabilitar as atualizações automáticas e para redefinir o número de dias entre as atualizações automáticas do catálogo. Ao iniciar, o Instalador do MySQL usa o número de dias que você definiu para determinar se uma tentativa de download deve ser feita. Essa ação é repetida durante a próxima inicialização se o Instalador do MySQL encontrar um erro ao baixar o catálogo.

   - Configurações de Conectividade: Várias operações realizadas pelo Instalador do MySQL requerem acesso à internet. Esta opção permite que você use um valor padrão para validar a conexão ou usar uma URL diferente, selecionada de uma lista ou adicionada manualmente. Com a opção Manual selecionada, novas URLs podem ser adicionadas e todas as URLs na lista podem ser movidas ou excluídas. Quando a opção Automática é selecionada, o Instalador do MySQL tenta se conectar a cada URL padrão na lista (em ordem) até que uma conexão seja estabelecida. Se não for possível estabelecer uma conexão, ele gera um erro.

   - Proxy: O Instalador do MySQL oferece vários modos de proxy que permitem que você faça o download de produtos, atualizações ou até mesmo do catálogo do produto na maioria dos ambientes de rede. Os modos são:

     - Sem proxy

       Selecione este modo para impedir que o Instalador do MySQL procure configurações do sistema. Este modo desativa todas as configurações de proxy.

     - Automático

       Selecione este modo para que o Instalador do MySQL procure as configurações do sistema e use essas configurações se encontradas, ou para não usar proxy se nada for encontrado. Este modo é o padrão.

     - Manual

       Selecione este modo para que o Instalador do MySQL use seus detalhes de autenticação para configurar o acesso proxy à internet. Especificamente:

       - Um endereço de servidor proxy (`http://`*`endereço-para-servidor`*) e número de porta

       - Um nome de usuário e senha para autenticação

##### Localizar produtos para instalação

Os produtos do MySQL no catálogo são listados por categoria: Servidores MySQL, Aplicações, Conectores MySQL e Documentação. Apenas as versões GA mais recentes aparecem no painel Produtos Disponíveis por padrão. Se você estiver procurando uma versão pré-lançamento ou mais antiga de um produto, ela pode não estar visível na lista padrão.

Nota

Mantenha o catálogo de produtos atualizado. Clique em Catálogo no painel do Instalador MySQL para baixar o manifesto mais recente.

Para alterar a lista de produtos padrão, clique em Adicionar no painel para abrir a página Selecionar Produtos e, em seguida, clique em Editar para abrir a caixa de diálogo mostrada na figura a seguir. Modifique as configurações e, em seguida, clique em Filtrar.

**Figura 2.12 Filtro Produtos disponíveis**

![Filtro por Texto, Categoria, Maturidade, Já Baixado e Arquitetura](images/mi-product-filter.png)

Reinicie um ou mais dos seguintes campos para modificar a lista de produtos disponíveis:

- Filtrar por texto.

- Categoria: Todos os softwares (padrão), Servidores MySQL, Aplicações, Conectores MySQL ou Documentação (para amostras e documentação).

- Maturidade: Conjunto atual (aparece inicialmente apenas com o pacote completo), pré-lançamento, GA atual ou outras versões. Se você vir uma mensagem de alerta, confirme que tem o manifesto do produto mais recente clicando em Catálogo no painel do MySQL Installer. Se o MySQL Installer não conseguir baixar o manifesto, a gama de produtos que você vê é limitada aos produtos em conjunto, aos MSIs de produtos autônomos localizados na pasta `Product Cache` já, ou a ambos.

  ::: info Nota
  A versão comercial do Instalador do MySQL não exibe nenhum produto do MySQL quando você seleciona o filtro de maturidade de pré-lançamento. Os produtos em desenvolvimento estão disponíveis apenas na versão comunitária do Instalador do MySQL.
  :::

- Já baixado (a caixa de seleção está desmarcada por padrão). Permite que você visualize e gerencie apenas produtos baixados.

- Arquitetura: Qualquer (padrão), 32 bits ou 64 bits.

##### Atualizando o MySQL Server

Condições importantes para a atualização do servidor:

- O Instalador do MySQL não permite atualizações de servidor entre versões principais ou versões menores de lançamento, mas permite atualizações dentro de uma série de lançamento, como uma atualização de 8.0.36 para 8.0.37.

- As atualizações entre versões de marco (ou de uma versão de marco para uma versão GA) não são suportadas. Alterações significativas de desenvolvimento ocorrem em versões de marco e você pode encontrar problemas de compatibilidade ou problemas ao iniciar o servidor.

- Para atualizações, uma caixa de seleção permite que você pule a verificação de atualização e processe as tabelas do sistema, enquanto verifica e processa as tabelas do dicionário de dados normalmente. O Instalador do MySQL não solicita a caixa de seleção quando a atualização do servidor anterior foi pular ou quando o servidor foi configurado como um clúster InnoDB sandbox. Esse comportamento representa uma mudança na forma como o MySQL Server executa uma atualização (veja O que a atualização do processo do MySQL atualiza) e altera a sequência de etapas que o Instalador do MySQL aplica ao processo de configuração.

  Se você selecionar Verificar e processar a atualização das tabelas do sistema (não recomendado), o Instalador do MySQL inicia o servidor atualizado com a opção `--upgrade=MINIMAL` do servidor, que atualiza apenas o dicionário de dados. Se você parar e, em seguida, reiniciar o servidor sem a opção `--upgrade=MINIMAL`, o servidor atualiza as tabelas do sistema automaticamente, se necessário.

  As seguintes informações aparecem na guia Log e no arquivo de log após a configuração de atualização (com tabelas do sistema ignoradas) estar concluída:

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

  ::: info Nota
  Para versões de marcos de servidor da mesma série de lançamento, o Instalador do MySQL desmarca a atualização do servidor e exibe um aviso para indicar que a atualização não é suportada, identifica os riscos de continuar e fornece um resumo dos passos para realizar uma atualização lógica manualmente. Você pode remarcar a atualização do servidor por sua conta e risco. Para obter instruções sobre como realizar uma atualização lógica com uma versão de marco de lançamento, consulte Atualização Lógica.
  :::

2. Clique em um produto na lista para destacar. Essa ação preenche a aba Versões Atualizáveis com os detalhes de cada versão disponível para o produto selecionado: número da versão, data de publicação e um link de "Alterações" para abrir as notas de lançamento dessa versão.

##### Remover o servidor MySQL

Para remover um servidor MySQL local:

1. Determine se o diretório de dados local deve ser removido. Se você manter o diretório de dados, outra instalação do servidor poderá reutilizar os dados. Esta opção está habilitada por padrão (remove o diretório de dados).

2. Clique em Executar para começar a desinstalar o servidor local. Observe que todos os produtos que você selecionou para remover também serão desinstalados neste momento.

3. (Opcional) Clique na guia Log para exibir as ações atuais realizadas pelo Instalador do MySQL.

##### Atualizando o Instalador do MySQL

O Instalador do MySQL permanece instalado no seu computador, e, como outros softwares, o Instalador do MySQL pode ser atualizado a partir da versão anterior. Em alguns casos, outros softwares do MySQL podem exigir que você atualize o Instalador do MySQL para garantir a compatibilidade. Esta seção descreve como identificar a versão atual do Instalador do MySQL e como atualizar o Instalador do MySQL manualmente.

**Para localizar a versão instalada do MySQL Installer:**

1. Comece o Instalador do MySQL a partir do menu de pesquisa. O painel do Instalador do MySQL é aberto.
2. Clique no ícone "Sobre" do Instalador MySQL (!). O número da versão está localizado acima do botão Voltar.

**Para iniciar uma atualização sob demanda do Instalador do MySQL:**

1. Conecte o computador com o Instalador MySQL instalado à internet.

2. Comece o Instalador do MySQL a partir do menu de pesquisa. O painel do Instalador do MySQL é aberto.

3. Clique em Catálogo na parte inferior do painel para abrir a janela Atualizar Catálogo.

4. Clique em Executar para iniciar o processo. Se a versão instalada do MySQL Installer puder ser atualizada, você será solicitado para iniciar a atualização.

5. Clique em Próximo para revisar todas as alterações no catálogo e, em seguida, clique em Concluir para retornar ao painel de controle.

6. Verifique a versão (nova) instalada do Instalador do MySQL (consulte o procedimento anterior).
