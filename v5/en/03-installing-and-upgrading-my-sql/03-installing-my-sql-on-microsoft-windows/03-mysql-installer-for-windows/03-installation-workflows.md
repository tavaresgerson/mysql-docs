#### 2.3.3.3 Fluxos de Trabalho de Instalação com o MySQL Installer

O MySQL Installer oferece uma ferramenta assistida por wizard para instalar e configurar novos produtos MySQL para Windows. Diferente da configuração inicial, que é executada apenas uma vez, o MySQL Installer invoca o wizard toda vez que você baixa ou instala um novo produto. Para instalações pela primeira vez, as etapas da configuração inicial prosseguem diretamente para as etapas da installation. Para obter ajuda com a seleção de produtos, consulte Localizando Produtos para Instalar.

**Nota**

Permissões totais são concedidas ao usuário que executa o MySQL Installer para todos os arquivos gerados, como `my.ini`. Isso não se aplica a arquivos e diretórios para produtos específicos, como o diretório de dados do MySQL server em `%ProgramData%`, que é de propriedade do `SYSTEM`.

Os produtos instalados e configurados em um host seguem um padrão geral que pode exigir sua entrada de dados durante as várias etapas. Se você tentar instalar um produto incompatível com a versão existente do MySQL server (ou uma versão selecionada para upgrade), você será alertado sobre a possível incompatibilidade (*mismatch*).

O MySQL Installer oferece a seguinte sequência de ações que se aplicam a diferentes fluxos de trabalho:

* **Select Products (Selecionar Produtos).** Se você selecionou o tipo de configuração `Custom` durante a configuração inicial ou clicou em Add no dashboard do MySQL Installer, o MySQL Installer inclui esta ação na barra lateral. Nesta página, você pode aplicar um filtro para modificar a lista Available Products e, em seguida, selecionar um ou mais produtos para mover (usando as setas) para a lista Products To Be Installed.

  Marque a caixa de seleção nesta página para ativar a ação Select Features onde você pode personalizar os features do produto após o download.

* **Download.** Se você instalou o pacote completo (não web) do MySQL Installer, todos os arquivos `.msi` foram carregados na pasta `Product Cache` durante a configuração inicial e não serão baixados novamente. Caso contrário, clique em Execute para iniciar o download. O status de cada produto muda de `Ready to Download`, para `Downloading` e, em seguida, para `Downloaded`.

  Para tentar novamente um único download sem sucesso, clique no link Try Again.

  Para tentar novamente todos os downloads sem sucesso, clique em Try All.

* **Select Features To Install (Selecionar Features Para Instalar) (desabilitado por padrão).** Depois que o MySQL Installer baixa o arquivo `.msi` de um produto, você pode personalizar os features se tiver habilitado a caixa de seleção opcional anteriormente durante a ação Select Products.

  Para personalizar features do produto após a installation, clique em Modify no dashboard do MySQL Installer.

* **Installation.** O status de cada produto na lista muda de `Ready to Install`, para `Installing` e, por último, para `Complete`. Durante o processo, clique em Show Details para visualizar as ações de installation.

  Se você cancelar a installation neste ponto, os produtos serão instalados, mas o server (se instalado) ainda não estará configurado. Para reiniciar a configuração do server, abra o MySQL Installer no menu Iniciar e clique em Reconfigure ao lado do server apropriado no dashboard.

* **Configuração do Produto (Product configuration).** Esta etapa se aplica apenas ao MySQL Server, MySQL Router e samples. O status para cada item na lista deve indicar `Ready to Configure`. Clique em Next para iniciar o wizard de configuração para todos os itens da lista. As opções de configuração apresentadas durante esta etapa são específicas para a versão do database ou router que você selecionou para instalar.

  Clique em Execute para começar a aplicar as opções de configuração ou clique em Back (repetidamente) para retornar a cada página de configuração.

* **Installation completa.** Esta etapa finaliza a installation para produtos que não exigem configuração. Ela permite que você copie o log para a área de transferência (*clipboard*) e inicie determinados aplicativos, como MySQL Workbench e MySQL Shell. Clique em Finish para abrir o dashboard do MySQL Installer.

##### 2.3.3.3.1 Configuração do MySQL Server com o MySQL Installer

O MySQL Installer executa a configuração inicial do MySQL server. Por exemplo:

* Ele cria o arquivo de configuração (`my.ini`) que é usado para configurar o MySQL server. Os valores escritos neste arquivo são influenciados pelas escolhas que você faz durante o processo de installation. Algumas definições dependem do host.

* Por padrão, um Windows service para o MySQL server é adicionado.
* Fornece caminhos de installation e paths de data default para o MySQL server. Para obter instruções sobre como alterar os paths default, consulte a Seção 2.3.3.2, “Configurando Paths Alternativos para o Server com o MySQL Installer”.

* Ele pode, opcionalmente, criar contas de usuário do MySQL server com permissions configuráveis baseadas em roles gerais, como DB Administrator, DB Designer e Backup Admin. Ele, opcionalmente, cria um usuário Windows chamado `MysqlSys` com privilégios limitados, que executaria o MySQL Server.

  Contas de usuário também podem ser adicionadas e configuradas no MySQL Workbench.

* Marcar Show Advanced Options (Mostrar Opções Avançadas) permite que opções adicionais de Logging Options (Opções de Log) sejam definidas. Isso inclui definir file paths customizados para o error log, general log, slow query log (incluindo a configuração de segundos que uma Query requer para ser executada) e o binary log.

Durante o processo de configuração, clique em Next para prosseguir para a próxima etapa ou em Back para retornar à etapa anterior. Clique em Execute na etapa final para aplicar a configuração do server.

As seções a seguir descrevem as opções de configuração do server que se aplicam ao MySQL server no Windows. A versão do server que você instalou determinará quais etapas e opções você pode configurar. A configuração do MySQL server pode incluir algumas ou todas as etapas.

###### 2.3.3.3.1.1 Tipo e Networking

* Tipo de Configuração do Server (Server Configuration Type)

  Escolha o tipo de configuração do MySQL server que descreve sua instalação. Esta configuração define a quantidade de recursos do sistema (memória) a serem atribuídos à sua instância do MySQL server.

  + **Development**: Um computador que hospeda muitos outros aplicativos e, tipicamente, este é seu workstation pessoal. Esta configuração define o MySQL para usar a menor quantidade de memória.

  + **Server**: Espera-se que vários outros aplicativos sejam executados neste computador, como um web server. A configuração Server define o MySQL para usar uma quantidade média de memória.

  + **Dedicated**: Um computador dedicado a executar o MySQL server. Como nenhuma outra aplicação importante é executada neste server, esta configuração define o MySQL para usar a maior parte da memória disponível.

  + **Manual**

    Impede que o MySQL Installer tente otimizar a installation do server e, em vez disso, define os valores default para as variáveis do server incluídas no arquivo de configuração `my.ini`. Com o tipo `Manual` selecionado, o MySQL Installer usa o valor default de 16M para a atribuição da variável `tmp_table_size`.

* Conectividade (Connectivity)

  As opções de Connectivity controlam como a conexão com o MySQL é feita. As opções incluem:

  + TCP/IP: Esta opção é selecionada por padrão. Você pode desabilitar o TCP/IP Networking para permitir apenas conexões de host local. Com a opção de conexão TCP/IP selecionada, você pode modificar os seguintes itens:

    - Port para conexões de protocolo MySQL clássico. O valor default é `3306`.

    - X Protocol Port mostrado apenas ao configurar o MySQL 8.0 server. O valor default é `33060`.

    - Abrir porta do Windows Firewall para acesso à network, que é selecionada por padrão para conexões TCP/IP.

    Se um número de port já estiver em uso, você verá o ícone de informação (!) ao lado do valor default e Next será desabilitado até que você forneça um novo número de port.

  + Named Pipe: Habilitar e definir o nome do pipe, semelhante a configurar a system variable `named_pipe`. O nome default é `MySQL`.

    Quando você seleciona a conectividade Named Pipe e, em seguida, prossegue para a próxima etapa, você é solicitado a definir o nível de access control concedido ao client software em conexões named-pipe. Alguns clients requerem apenas access control mínimo para comunicação, enquanto outros clients requerem acesso total ao named pipe.

    Você pode definir o nível de access control com base no usuário Windows (ou usuários) executando o client, da seguinte forma:

    - **Minimum access to all users (RECOMMENDED).** (Acesso mínimo a todos os usuários - RECOMENDADO). Este nível é habilitado por padrão porque é o mais seguro.

    - **Full access to members of a local group.** (Acesso total a membros de um grupo local). Se a opção de acesso mínimo for muito restritiva para o client software, use esta opção para reduzir o número de usuários que têm acesso total no named pipe. O grupo deve ser estabelecido no Windows antes que você possa selecioná-lo na lista. A adesão a este grupo deve ser limitada e gerenciada. O Windows exige que um membro recém-adicionado primeiro faça log out e depois log in novamente para entrar em um grupo local.

    - **Full access to all users (NOT RECOMMENDED).** (Acesso total a todos os usuários - NÃO RECOMENDADO). Esta opção é menos segura e deve ser definida apenas quando outras salvaguardas forem implementadas.

  + Shared Memory: Habilitar e definir o nome da memória, semelhante a configurar a system variable `shared_memory`. O nome default é `MySQL`.

* Configuração Avançada (Advanced Configuration)

  Marque Show Advanced and Logging Options (Mostrar Opções Avançadas e de Log) para definir log customizado e opções avançadas em etapas posteriores. A etapa Logging Options (Opções de Log) permite que você defina file paths customizados para o error log, general log, slow query log (incluindo a configuração de segundos que uma Query requer para ser executada) e o binary log. A etapa Advanced Options (Opções Avançadas) permite que você defina o Server ID único exigido quando o binary log está habilitado em uma topologia de replication.

* MySQL Enterprise Firewall (Enterprise Edition only)

  A caixa de seleção Enable MySQL Enterprise Firewall (Habilitar MySQL Enterprise Firewall) é desmarcada por padrão. Selecione esta opção para habilitar uma security list que oferece proteção contra certos tipos de ataques. É necessária uma configuração adicional pós-installation (consulte a Seção 6.4.6, “MySQL Enterprise Firewall”).

###### 2.3.3.3.1.2 Método de Autenticação

A etapa Authentication Method (Método de Autenticação) é visível apenas durante a installation ou upgrade do MySQL 8.0.4 ou superior. Ela introduz uma escolha entre duas opções de autenticação server-side. As contas de usuário MySQL que você criar na próxima etapa usarão o método de autenticação que você selecionar nesta etapa.

Os connectors e drivers community do MySQL 8.0 que usam `libmysqlclient` 8.0 agora suportam o authentication plugin default `caching_sha2_password`. No entanto, se você não puder atualizar seus clients e applications para suportar este novo método de autenticação, você pode configurar o MySQL server para usar `mysql_native_password` para autenticação legacy. Para obter mais informações sobre as implicações desta mudança, consulte caching_sha2_password como o Plugin de Autenticação Preferido.

Se você estiver instalando ou fazendo upgrade para o MySQL 8.0.4 ou superior, selecione um dos seguintes métodos de autenticação:

* Usar Criptografia de Senha Forte para Autenticação (RECOMENDADO)

  O MySQL 8.0 suporta uma nova autenticação baseada em métodos de senha aprimorados e mais fortes baseados em SHA256. É recomendado que todas as novas instalações do MySQL server usem este método daqui para frente.

  **Importante**

  O authentication plugin `caching_sha2_password` no server requer novas versões de connectors e clients, que adicionam suporte para a nova autenticação default do MySQL 8.0.

* Usar Método de Autenticação Legado (Manter Compatibilidade com MySQL 5.x)

  O uso do método de autenticação legacy antigo do MySQL 5.x deve ser considerado apenas nos seguintes casos:

  + Applications não podem ser atualizadas para usar connectors e drivers do MySQL 8.0.

  + A recompilation de um application existente não é viável.

  + Um connector ou driver específico do idioma atualizado ainda não está disponível.

###### 2.3.3.3.1.3 Contas e Roles

* Senha da Conta Root (Root Account Password)

  Atribuir uma root password é obrigatório e você será solicitado a fornecê-la ao realizar outras operações do MySQL Installer. A password strength é avaliada quando você repete a senha na caixa fornecida. Para informações descritivas sobre os requisitos ou status da senha, mova o ponteiro do mouse sobre o ícone de informação (!) quando ele aparecer.

* Contas de Usuário MySQL (Opcional) (MySQL User Accounts)

  Clique em Add User ou Edit User para criar ou modificar contas de usuário MySQL com roles predefinidos. Em seguida, insira as credenciais de conta necessárias:

  + User Name: Os nomes de usuário MySQL podem ter até 32 caracteres.

  + Host: Selecione `localhost` apenas para conexões locais ou `<All Hosts (%)>` quando forem necessárias conexões remotas ao server.

  + Role: Cada role predefinido, como `DB Admin`, é configurado com seu próprio conjunto de privileges. Por exemplo, o role `DB Admin` tem mais privileges do que o role `DB Designer`. A lista suspensa Role contém uma descrição de cada role.

  + Password: A avaliação da password strength é realizada enquanto você digita a senha. As senhas devem ser confirmadas. O MySQL permite uma senha em branco ou vazia (considerada insegura).

  **MySQL Installer Commercial Release Only:** O MySQL Enterprise Edition para Windows, um produto comercial, também suporta um método de autenticação que realiza autenticação externa no Windows. Contas autenticadas pelo sistema operacional Windows podem acessar o MySQL server sem fornecer uma senha adicional.

  Para criar uma nova conta MySQL que usa autenticação Windows, insira o nome de usuário e selecione um valor para Host e Role. Clique em Windows authentication para habilitar o plugin `authentication_windows`. Na área Windows Security Tokens, insira um token para cada usuário Windows (ou grupo) que pode se autenticar com o nome de usuário MySQL. As contas MySQL podem incluir security tokens para usuários Windows locais e usuários Windows que pertencem a um domain. Vários security tokens são separados pelo caractere ponto e vírgula (`;`) e usam o seguinte formato para contas locais e de domain:

  + Conta local

    Insira o nome de usuário Windows simples como security token para cada usuário ou grupo local; por exemplo, **`finley;jeffrey;admin`**.

  + Conta de Domain

    Use a sintaxe padrão do Windows (*`domain`*`\`*`domainuser`*) ou a sintaxe do MySQL (*`domain`*`\\`*`domainuser`*) para inserir usuários e grupos de domain Windows.

    Para contas de domain, talvez seja necessário usar as credenciais de um administrator dentro do domain se a conta que executa o MySQL Installer não tiver as permissions para consultar o Active Directory. Se for esse o caso, selecione Validate Active Directory users with para ativar as credenciais de administrator do domain.

  A autenticação Windows permite que você teste todos os security tokens cada vez que adicionar ou modificar um token. Clique em Test Security Tokens para validar (ou revalidar) cada token. Tokens inválidos geram uma mensagem de erro descritiva junto com um ícone de "X" vermelho e texto do token em vermelho. Quando todos os tokens se resolvem como válidos (texto verde sem um ícone "X"), você pode clicar em OK para salvar as alterações.

###### 2.3.3.3.1.4 Serviço Windows

Na plataforma Windows, o MySQL server pode ser executado como um named service gerenciado pelo sistema operacional e configurado para iniciar automaticamente quando o Windows é iniciado. Alternativamente, você pode configurar o MySQL server para ser executado como um programa executável que requer configuração manual.

* Configurar o MySQL server como um Windows service (Selecionado por padrão.)

  Quando a opção de configuração default é selecionada, você também pode selecionar o seguinte:

  + Start the MySQL Server at System Startup (Iniciar o MySQL Server na Inicialização do Sistema)

    Quando selecionado (default), o tipo de startup do service é definido como Automatic; caso contrário, o tipo de startup é definido como Manual.

  + Run Windows Service as (Executar Windows Service como)

    Quando Standard System Account é selecionado (default), o service faz log on como Network Service.

    A opção Custom User deve ter privileges para fazer log on no Microsoft Windows como um service. O botão Next será desabilitado até que este usuário seja configurado com os privileges necessários.

    Uma conta de usuário customizada é configurada no Windows pesquisando por "local security policy" no menu Iniciar. Na janela Local Security Policy, selecione Local Policies, User Rights Assignment e, em seguida, Log On As A Service para abrir a caixa de diálogo de propriedade. Clique em Add User or Group para adicionar o usuário customizado e clique em OK em cada caixa de diálogo para salvar as alterações.

* Desmarcar a opção Windows Service.

###### 2.3.3.3.1.5 Permissões de Arquivos do Server

Opcionalmente, as permissions definidas nas pastas e arquivos localizados em `C:\ProgramData\MySQL\MySQL Server 8.0\Data` podem ser gerenciadas durante a operação de configuração do server. Você tem as seguintes opções:

* O MySQL Installer pode configurar as pastas e arquivos com full control concedido exclusivamente ao usuário que executa o Windows service, se aplicável, e ao grupo Administrators.

  Todos os outros grupos e usuários têm o acesso negado. Esta é a opção default.

* Fazer com que o MySQL Installer use uma opção de configuração semelhante à que acabou de ser descrita, mas também fazer com que o MySQL Installer mostre quais usuários podem ter full control.

  Você pode então decidir se um grupo ou usuário deve receber full control. Caso contrário, você pode mover os membros qualificados desta lista para uma segunda lista que restringe todo o acesso.

* Fazer com que o MySQL Installer ignore as alterações de file-permission durante a operação de configuração.

  Se você selecionar esta opção, você será responsável por proteger a pasta `Data` e seus arquivos relacionados manualmente após a conclusão da configuração do server.

###### 2.3.3.3.1.6 Opções de Log

Esta etapa está disponível se a caixa de seleção Show Advanced Configuration (Mostrar Configuração Avançada) foi selecionada durante a etapa Type and Networking. Para habilitar esta etapa agora, clique em Back para retornar à etapa Type and Networking e marque a caixa de seleção.

As opções de configuração avançada estão relacionadas aos seguintes arquivos de log do MySQL:

* Error Log
* General Log
* Slow Query Log
* Bin Log

**Nota**

O binary log é habilitado por padrão.

###### 2.3.3.3.1.7 Opções Avançadas

Esta etapa está disponível se a caixa de seleção Show Advanced Configuration (Mostrar Configuração Avançada) foi selecionada durante a etapa Type and Networking. Para habilitar esta etapa agora, clique em Back para retornar à etapa Type and Networking e marque a caixa de seleção.

As opções de configuração avançada incluem:

* Server ID

  Defina o Server ID, o identificador único usado em uma topologia de replication. Se o binary log estiver habilitado, você deve especificar um Server ID. O valor default do ID depende da versão do server. Para obter mais informações, consulte a descrição da system variable `server_id`.

* Case de Nomes de Tabela (Table Names Case)

  Você pode definir as seguintes opções durante a configuração inicial e subsequente do server. Para a série de lançamento do MySQL 8.0, essas opções se aplicam apenas à configuração inicial do server.

  + Lower Case (Minúsculas)

    Define o valor da opção `lower_case_table_names` para 1 (default), no qual os nomes de tabela são armazenados em minúsculas no disk e as comparações não diferenciam maiúsculas de minúsculas.

  + Preserve Given Case (Preservar Case Fornecido)

    Define o valor da opção `lower_case_table_names` para 2, no qual os nomes de tabela são armazenados conforme fornecido, mas comparados em minúsculas.

###### 2.3.3.3.1.8 Aplicar Configuração do Server

Todas as configurações são aplicadas ao MySQL server quando você clica em Execute. Use a guia Configuration Steps para acompanhar o progresso de cada ação; o ícone de cada uma alterna de branco para verde (com uma marca de verificação) em caso de sucesso. Caso contrário, o processo para e exibe uma mensagem de erro se uma ação individual expirar (*time out*). Clique na guia Log para visualizar o log.

Quando a installation é concluída com sucesso e você clica em Finish, o MySQL Installer e os produtos MySQL instalados são adicionados ao menu Iniciar do Microsoft Windows sob o grupo `MySQL`. Abrir o MySQL Installer carrega o dashboard onde os produtos MySQL instalados são listados e outras operações do MySQL Installer estão disponíveis.

##### 2.3.3.3.2 Configuração do MySQL Router com o MySQL Installer

Durante a configuração inicial, escolha qualquer tipo de configuração predeterminado, exceto `Server only`, para instalar a versão GA mais recente das ferramentas. Use o tipo de configuração `Custom` para instalar uma ferramenta individual ou uma versão específica. Se o MySQL Installer já estiver instalado no host, use a operação Add para selecionar e instalar ferramentas do dashboard do MySQL Installer.

###### Configuração do MySQL Router

O MySQL Installer fornece um wizard de configuração que pode fazer o bootstrap de uma instância instalada do MySQL Router 8.0 para direcionar o tráfego entre applications MySQL e um InnoDB Cluster. Quando configurado, o MySQL Router é executado como um Windows service local.

**Nota**

Você é solicitado a configurar o MySQL Router após a installation inicial e quando você reconfigura um router instalado explicitamente. Em contraste, a operação de upgrade não exige nem solicita que você configure o produto atualizado.

Para configurar o MySQL Router, faça o seguinte:

1. Configure o InnoDB Cluster (Set up InnoDB Cluster).
2. Usando o MySQL Installer, baixe e instale a aplicação MySQL Router. Após a conclusão da installation, o wizard de configuração solicitará informações. Marque a caixa de seleção Configure MySQL Router for InnoDB Cluster para iniciar a configuração e forneça os seguintes valores de configuração:

   * Hostname: Host name do primary (seed) server no InnoDB Cluster (`localhost` por padrão).

   * Port: O número da Port do primary (seed) server no InnoDB Cluster (`3306` por padrão).

   * Management User: Um usuário administrativo com privileges de nível root.

   * Password: A Password para o management user.

   * Classic MySQL protocol connections to InnoDB Cluster

     Read/Write: Defina o primeiro número de base port como um que não esteja em uso (entre 80 e 65532) e o wizard selecionará as ports restantes para você.

     A figura a seguir mostra um exemplo da página de configuração do MySQL Router, com o primeiro número de base port especificado como 6446 e as ports restantes definidas pelo wizard como 6447, 6448 e 6449.

   **Figura 2.10 Configuração do MySQL Router**

   ![O conteúdo é descrito no texto circundante.](images/mi-router-config.png)

3. Clique em Next e depois em Execute para aplicar a configuração. Clique em Finish para fechar o MySQL Installer ou retornar ao dashboard do MySQL Installer.

Após configurar o MySQL Router, a conta root existe na tabela de usuários como `root@localhost` (local) apenas, em vez de `root@%` (remoto). Independentemente de onde o router e o client estão localizados, mesmo que ambos estejam localizados no mesmo host que o seed server, qualquer conexão que passe pelo router é vista pelo server como remota, não local. Como resultado, uma conexão feita ao server usando o host local (veja o exemplo a seguir) não se autentica.

```sql
$> \c root@localhost:6446
```