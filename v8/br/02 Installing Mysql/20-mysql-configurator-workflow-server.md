#### 2.3.2.1 Configuração do servidor MySQL com o configurador MySQL

O MySQL Configurator executa a configuração inicial, uma reconfiguração e também funciona como parte do processo de desinstalação.

::: info Note

Permissões completas são concedidas ao usuário que executa o MySQL Configurator para todos os arquivos gerados, como `my.ini`. Isto não se aplica a arquivos e diretórios para produtos específicos, como o diretório de dados do servidor MySQL em `%ProgramData%` que é de propriedade de `SYSTEM`.

:::

O MySQL Configurator executa a configuração do servidor MySQL. Por exemplo:

- Ele cria o arquivo de configuração (`my.ini`) que é usado para configurar o servidor MySQL. Os valores escritos neste arquivo são influenciados pelas escolhas que você faz durante o processo de instalação. Algumas definições são dependentes do host.
- Por padrão, um serviço do Windows para o servidor MySQL é adicionado.
- Fornece instalação padrão e caminhos de dados para o servidor MySQL.
- Ele pode criar opcionalmente contas de usuário do servidor MySQL com permissões configuráveis com base em funções gerais, como DB Administrator, DB Designer e Backup Admin.
- Verificar Mostrar Opções Avançadas permite definir Opções de Registro adicionais. Isso inclui a definição de caminhos de arquivo personalizados para o log de erros, log geral, log de consulta lenta (incluindo a configuração de segundos necessários para executar uma consulta) e o log binário.

As seções a seguir descrevem as opções de configuração do servidor que se aplicam ao servidor MySQL no Windows. A versão do servidor que você instalou determinará quais etapas e opções você pode configurar. Configurar o servidor MySQL pode incluir algumas ou todas as etapas.

##### 2.3.2.1.1 Instalações do servidor MySQL

O MySQL Configurator adiciona uma opção de atualização se encontrar uma instalação existente do MySQL Server.

::: info Note

Esta funcionalidade de atualização foi adicionada no MySQL 8.3.0.

:::

- In-Place Upgrade de uma Instalação de Servidor MySQL Existente
- Adicionar uma instalação de servidor MySQL separada

###### In-Place Upgrade de uma Instalação de Servidor MySQL Existente

Isso substitui a instalação do servidor MySQL existente como parte do processo de atualização, que também pode atualizar o esquema de dados.

::: info Note

A instância de servidor MySQL existente deve estar em execução para que a opção de atualização local funcione.

:::

Embora o MySQL Configurator possa tentar (e ter sucesso) em realizar uma atualização local para outros cenários, a tabela a seguir lista os cenários oficialmente suportados pelo configurador:

**Tabela 2.5 Caminhos de actualização suportados**

<table><thead><tr> <th>Um cenário de atualização suportado</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>8.0.35+ para 8.1</td> <td>De 8.0.35 ou superior à primeira versão do MySQL 8 Innovation.</td> </tr><tr> <td>8.0.35+ para 8.4</td> <td>De 8.0.35 ou superior para a próxima versão LTS do MySQL.</td> </tr><tr> <td>8.X a 8.Y onde Y = X + 1</td> <td>De um lançamento de inovação para o próximo lançamento de inovação consecutivo.</td> </tr><tr> <td>8.3 a 8.4</td> <td>Do último lançamento do MySQL 8 Innovation ao próximo lançamento do MySQL 8 LTS.</td> </tr><tr> <td>8.4.X a 8.4.Y onde Y &gt; X</td> <td>Do mesmo lançamento LTS.</td> </tr><tr> <td>8.4.X a 9.0.0</td> <td>De uma versão LTS para a primeira versão consecutiva de Inovação.</td> </tr><tr> <td>8.4 a 9.7</td> <td>De uma liberação LTS para a próxima liberação LTS consecutiva.</td> </tr></tbody></table>

Este diálogo solicita o protocolo (padrão: `TCP/IP`), a porta (padrão: `3306`), e a senha raiz para a instalação existente. Execute a conexão e, em seguida, revise e confirme as informações da instância do MySQL (como versão, caminhos e arquivo de configuração) antes de prosseguir com a atualização.

Esta atualização pode substituir os caminhos de arquivo. Por exemplo, "MySQL Server 8.2 Data" muda para "MySQL Server 8.3 Data" ao atualizar 8.2 para 8.3.

Esta funcionalidade de atualização também fornece essas opções adicionais: "Backup Data" permite executar `mysqldump` antes de executar a atualização e "Server File Permissions" para personalizar opcionalmente as permissões de arquivo.

###### Adicionar uma instalação de servidor MySQL separada

Configurar uma instalação padrão lado a lado com a nova instalação do servidor MySQL. Isto significa ter várias instalações do servidor MySQL instaladas e em execução no sistema.

##### 2.3.2.1.2 Tipo e Rede

- Tipo de configuração do servidor

  Escolha o tipo de configuração do servidor MySQL que descreve a sua configuração. Esta configuração define a quantidade de recursos do sistema (memória) a atribuir à sua instância do servidor MySQL.

  - \*\* Desenvolvimento \*\*: Um computador que hospeda muitas outras aplicações, e normalmente esta é a sua estação de trabalho pessoal. Esta configuração configura o MySQL para usar a menor quantidade de memória.
  - **Servidor**: Vários outros aplicativos devem ser executados neste computador, como um servidor web. A configuração do servidor configura o MySQL para usar uma quantidade média de memória.
  - **Dedicado**: Um computador dedicado à execução do servidor MySQL. Como nenhum outro aplicativo principal é executado neste servidor, essa configuração configura o MySQL para usar a maioria da memória disponível.
  - **Manual**: Impede o MySQL Configurator de tentar otimizar a instalação do servidor e, em vez disso, define os valores padrão para as variáveis do servidor incluídas no arquivo de configuração `my.ini`. Com o tipo `Manual` selecionado, o MySQL Configurator usa o valor padrão de 16M para a atribuição da variável `tmp_table_size`.
- Conectividade

  As opções de conectividade controlam como a conexão com o MySQL é feita.

  - `TCP/IP`: Esta opção é selecionada por padrão. Você pode desativar `TCP/IP` Networking para permitir apenas conexões de host local. Com a opção de conexão `TCP/IP` selecionada, você pode modificar os seguintes itens:

    - Porta para conexões clássicas do protocolo MySQL. O valor padrão é `3306`.
    - X Protocolo A porta padrão é `33060`
    - Abra a porta do Firewall do Windows para acesso à rede, que é selecionada por padrão para conexões `TCP/IP`.

    Se um número de porta já estiver em uso, você verá o ícone de erro (![](images/mi-info-symbol.png)) ao lado do valor padrão e o Next será desativado até que você forneça um novo número de porta.
  - Named Pipe: Ativa e define o nome do tubo, semelhante à configuração da variável de sistema `named_pipe` . O nome padrão é `MySQL`.

    Quando você seleciona conectividade Named Pipe e, em seguida, prossegue para a próxima etapa, você é solicitado a definir o nível de controle de acesso concedido ao software cliente em conexões de named-pipe. Alguns clientes exigem apenas controle de acesso mínimo para comunicação, enquanto outros clientes exigem acesso total ao tubo nomeado.

    Você pode definir o nível de controle de acesso com base no usuário (ou usuários) do Windows executando o cliente da seguinte forma:

    - \*\* Acesso mínimo a todos os utilizadores (RECOMENDADO). \*\* Este nível está habilitado por defeito porque é o mais seguro.
    - \*\* Acesso total aos membros de um grupo local. \*\* Se a opção de acesso mínimo for muito restritiva para o software cliente, use essa opção para reduzir o número de usuários que têm acesso total ao tubo nomeado. O grupo deve ser estabelecido no Windows antes de você poder selecioná-lo da lista. A associação a este grupo deve ser limitada e gerenciada. O Windows exige que um membro recém-adicionado primeiro faça o logout e, em seguida, faça o login novamente para se juntar a um grupo local.
    - \*\* Acesso total a todos os utilizadores (NÃO RECOMENDADO). \*\* Esta opção é menos segura e deve ser definida apenas quando outras salvaguardas estiverem implementadas.
  - Memória compartilhada: Ative e defina o nome da memória, semelhante à definição da variável do sistema `shared_memory`. O nome padrão é `MySQL`.
- Configuração Avançada

  Verifique Mostrar opções avançadas e de registro para definir o registro personalizado e opções avançadas em etapas posteriores. A etapa de Opções de registro permite definir caminhos de arquivo personalizados para o registro de erros, o registro geral, o registro de consultas lentas (incluindo a configuração de segundos necessários para executar uma consulta) e o registro binário. A etapa de Opções Avançadas permite definir o ID de servidor exclusivo necessário quando o registro binário é habilitado em uma topologia de replicação.
- Firewall MySQL Enterprise (apenas Edição Enterprise)

  A caixa de seleção Ativar MySQL Enterprise Firewall é desmarcada por padrão. Selecione esta opção para ativar uma lista de segurança que oferece proteção contra certos tipos de ataques. Configuração pós-instalação adicional é necessária (ver Seção 8.4.7, MySQL Enterprise Firewall).

##### 2.3.2.1.3 Contas e funções

- Senha da conta raiz

  A atribuição de uma senha de raiz é necessária e você será solicitado a ela quando reconfigurar com o configurador do MySQL no futuro. A força da senha é avaliada quando você repete a senha na caixa fornecida. Para informações descritivas sobre requisitos de senha ou status, mova o ponteiro do mouse sobre o ícone de informações (![](images/mi-info-symbol.png)) quando ele aparecer.
- Contas de utilizador MySQL (opcional)

  Clique em Adicionar usuário ou Editar usuário para criar ou modificar contas de usuário do MySQL com funções predefinidas. Em seguida, insira as credenciais de conta necessárias:

  - Nome do usuário: os nomes de usuário do MySQL podem ter até 32 caracteres de comprimento.
  - Anfitrião: selecione `localhost` apenas para conexões locais ou `<All Hosts (%)>` quando são necessárias conexões remotas com o servidor.
  - Papel: Cada papel predefinido, como `DB Admin`, é configurado com seu próprio conjunto de privilégios. Por exemplo, o papel `DB Admin` tem mais privilégios do que o papel `DB Designer`. A lista suspensa de Papel contém uma descrição de cada papel.
  - Senha: A avaliação da força da senha é realizada enquanto você digita a senha. As senhas devem ser confirmadas. O MySQL permite uma senha em branco ou vazia (considerada insegura).

  \*\* MySQL Configurator Commercial Release Only:\*\* MySQL Enterprise Edition para Windows, um produto comercial, também suporta um método de autenticação que executa autenticação externa no Windows.

  Para criar uma nova conta MySQL que usa autenticação do Windows, digite o nome do usuário e, em seguida, selecione um valor para anfitrião e função. Clique em autenticação do Windows para ativar o plugin `authentication_windows`. Na área de Tokens de Segurança do Windows, digite um token para cada usuário do Windows (ou grupo) que pode autenticar com o nome de usuário do MySQL. As contas do MySQL podem incluir tokens de segurança para usuários locais do Windows e usuários do Windows que pertencem a um domínio. Vários tokens de segurança são separados pelo caractere ponto e vírgula (`;`) e usam o seguinte formato para contas locais e de domínio:

  - Conta local

    Insira o nome de usuário do Windows simples como o token de segurança para cada usuário ou grupo local; por exemplo, `finley;jeffrey;admin`.
  - Conta de domínio

    Use a sintaxe padrão do Windows (\* `domain` \* `\` \* `domainuser` *) ou a sintaxe do MySQL (* `domain` \* `\\` \* `domainuser` \*) para inserir usuários e grupos do domínio do Windows.

    Para contas de domínio, você pode precisar usar as credenciais de um administrador dentro do domínio se a conta executando o MySQL Configurator não tiver permissões para consultar o Active Directory. Se for esse o caso, selecione Validar usuários do Active Directory com para ativar as credenciais de administrador de domínio.

  A autenticação do Windows permite testar todos os tokens de segurança cada vez que você adiciona ou modifica um token. Clique em Test Security Tokens para validar (ou revalidar) cada token. Tokens inválidos geram uma mensagem de erro descritiva junto com um ícone `X` vermelho e texto de token vermelho. Quando todos os tokens são resolvidos como válidos (texto verde sem um ícone `X`), você pode clicar em OK para salvar as alterações.

##### 2.3.2.1.4 Serviço Windows

Na plataforma Windows, o servidor MySQL pode ser executado como um serviço nomeado gerenciado pelo sistema operacional e ser configurado para iniciar automaticamente quando o Windows é iniciado. Alternativamente, você pode configurar o servidor MySQL para ser executado como um programa executável que requer configuração manual.

- Configurar o servidor MySQL como um serviço do Windows (Selecionado por padrão.)

  Quando a opção de configuração padrão é selecionada, também pode selecionar o seguinte:

  - Nome do Serviço Windows

    Defaults para MySQL\*`XY`\* onde XY é 81 para MySQL 8.1.
  - Iniciar o servidor MySQL na inicialização do sistema

    Quando selecionado (padrão), o tipo de inicialização do serviço é definido como Automático; caso contrário, o tipo de inicialização é definido como Manual.
  - Executar o Serviço Windows como

    Quando a conta de sistema padrão é selecionada (padrão), o serviço inicia sessão como serviço de rede.

    A opção Usuário personalizado deve ter privilégios para fazer login no Microsoft Windows como um serviço. O botão Próximo será desativado até que este usuário seja configurado com os privilégios necessários.

    Uma conta de usuário personalizada é configurada no Windows pesquisando "política de segurança local" no menu Iniciar. Na janela Política de segurança local, selecione Políticas locais, Atribuição de direitos do usuário e, em seguida, Logue como um serviço para abrir a caixa de diálogo de propriedades. Clique em Adicionar usuário ou grupo para adicionar o usuário personalizado e, em seguida, clique em OK em cada caixa de diálogo para salvar as alterações.

##### 2.3.2.1.5 Permissões de arquivo do servidor

Opcionalmente, as permissões definidas nas pastas e arquivos localizados em `C:\ProgramData\MySQL\MySQL Server X.Y\Data` podem ser gerenciadas durante a operação de configuração do servidor. Você tem as seguintes opções:

- O MySQL Configurator pode configurar as pastas e arquivos com controle total concedido exclusivamente ao usuário que executa o serviço do Windows, se aplicável, e ao grupo Administradores.

  Todos os outros grupos e usuários são negados o acesso. Esta é a opção padrão.
- Faça o MySQL Configurator usar uma opção de configuração semelhante à descrita, mas também faça o MySQL Configurator mostrar quais usuários poderiam ter controle total.

  Se não, você pode mover os membros qualificados desta lista para uma segunda lista que restringe todo o acesso.
- Deixe o configurador do MySQL ignorar as alterações de permissão de arquivo durante a operação de configuração.

  Se você selecionar esta opção, você é responsável por proteger a pasta `Data` e seus arquivos relacionados manualmente após a configuração do servidor terminar.

##### Opções de registo

Esta etapa está disponível se a caixa de seleção Mostrar Configuração Avançada foi selecionada durante a etapa Tipo e Rede. Para ativar esta etapa agora, clique em Voltar para voltar à etapa Tipo e Rede e selecione a caixa de seleção.

As opções de configuração avançadas estão relacionadas com os seguintes arquivos de log do MySQL:

- Registro de erros
- Registro Geral
- Registro de consultas lentas
- Registro binário

##### 2.3.2.1.7 Opções avançadas

Esta etapa está disponível se a caixa de seleção Mostrar Configuração Avançada foi selecionada durante a etapa Tipo e Rede. Para ativar esta etapa agora, clique em Voltar para voltar à etapa Tipo e Rede e selecione a caixa de seleção.

As opções de configuração avançada incluem:

- Identificação do servidor

  Defina o identificador exclusivo usado em uma topologia de replicação. Se o registro binário estiver habilitado, você deve especificar um ID de servidor. O valor do ID padrão depende da versão do servidor. Para mais informações, consulte a descrição da variável do sistema `server_id`.
- Caso dos nomes das tabelas

  Estas opções só se aplicam à configuração inicial do servidor MySQL.

  - Maiúsculas

    Define o valor da opção `lower_case_table_names` em 1 (padrão), em que os nomes das tabelas são armazenados em minúsculas no disco e as comparações não são sensíveis a maiúsculas e minúsculas.
  - Preservar o caso dado

    Define o valor da opção `lower_case_table_names` em 2, no qual os nomes das tabelas são armazenados como dados, mas comparados em minúsculas.

##### 2.3.2.1.8 Bases de dados de amostras

Opcionalmente instalar bancos de dados de amostra que incluem dados de teste para ajudar a desenvolver aplicativos com MySQL. As opções incluem os bancos de dados sakila e mundo.

##### 2.3.2.1.9 Aplicar a configuração

Todas as configurações são aplicadas ao servidor MySQL quando você clica em Executar. Use a guia Passos de Configuração para acompanhar o progresso de cada ação; o ícone para cada um alterna de branco para verde (com uma marca de verificação) em caso de sucesso. Caso contrário, o processo para e exibe uma mensagem de erro se uma ação individual estiver fora de tempo. Clique na guia Log para ver o log.
