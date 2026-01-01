#### 2.3.3.3 Fluxos de trabalho de instalação com o Instalador MySQL

O Instalador do MySQL oferece uma ferramenta semelhante a um assistente para instalar e configurar novos produtos do MySQL para o Windows. Ao contrário da configuração inicial, que é executada apenas uma vez, o Instalador do MySQL aciona o assistente cada vez que você baixa ou instala um novo produto. Para instalações pela primeira vez, os passos da configuração inicial são seguidos diretamente pelos passos da instalação. Para obter ajuda com a seleção do produto, consulte Localizar produtos para instalação.

Nota

Os usuários que executam o Instalador do MySQL têm permissões completas para todos os arquivos gerados, como o `my.ini`. Isso não se aplica a arquivos e diretórios específicos de produtos, como o diretório de dados do servidor MySQL em `%ProgramData%`, que pertence ao `SISTEMA`.

Os produtos instalados e configurados em um host seguem um padrão geral que pode exigir sua intervenção durante as várias etapas. Se você tentar instalar um produto que seja incompatível com a versão do servidor MySQL existente (ou uma versão selecionada para atualização), você será alertado sobre o possível desajuste.

O Instalador do MySQL fornece a seguinte sequência de ações que se aplicam a diferentes fluxos de trabalho:

- **Selecione os produtos.** Se você selecionou o tipo de configuração `Personalizado` durante a configuração inicial ou clicou em Adicionar no painel do Instalador MySQL, o Instalador MySQL inclui essa ação na barra lateral. Nesta página, você pode aplicar um filtro para modificar a lista de Produtos disponíveis e, em seguida, selecionar um ou mais produtos para mover (usando as setas) para a lista de Produtos a serem instalados.

  Marque a caixa de seleção nesta página para ativar a ação Selecionar recursos, onde você pode personalizar os recursos dos produtos após o produto ser baixado.

- **Baixar.** Se você instalou o pacote completo (não web) do instalador MySQL, todos os arquivos `.msi` foram carregados na pasta `Cache do Produto` durante a configuração inicial e não são baixados novamente. Caso contrário, clique em Executar para iniciar o download. O status de cada produto muda de `Pronto para Download`, para `Baixando`, e depois para `Baixado`.

  Para tentar novamente um único download que falhou, clique no link Tente novamente.

  Para tentar novamente todos os downloads não concluídos, clique em Tentar tudo.

- **Selecione as funcionalidades a serem instaladas (desativadas por padrão).** Após o instalador do MySQL baixar o arquivo `.msi` de um produto, você pode personalizar as funcionalidades se tiver habilitado a caixa de seleção opcional anteriormente durante a ação Selecionar Produtos.

  Para personalizar as características do produto após a instalação, clique em Modificar no painel do Instalador MySQL.

- **Instalação.** O status de cada produto na lista muda de `Pronto para Instalar`, para `Instalando` e, por fim, para `Concluído`. Durante o processo, clique em Mostrar Detalhes para visualizar as ações de instalação.

  Se você cancelar a instalação neste ponto, os produtos serão instalados, mas o servidor (se instalado) ainda não estará configurado. Para reiniciar a configuração do servidor, abra o Instalador MySQL no menu Iniciar e clique em Reconfigurar ao lado do servidor apropriado no painel.

- **Configuração do produto.** Este passo é aplicável apenas ao MySQL Server, MySQL Router e aos exemplos. O status de cada item na lista deve indicar `Pronto para Configurar`. Clique em Próximo para iniciar o assistente de configuração para todos os itens da lista. As opções de configuração apresentadas durante este passo são específicas para a versão do banco de dados ou do roteador que você selecionou para instalar.

  Clique em Executar para começar a aplicar as opções de configuração ou clique em Voltar (repetidamente) para retornar a cada página de configuração.

- **Instalação concluída.** Este passo finaliza a instalação para produtos que não requerem configuração. Ele permite que você copie o log para uma área de transferência e inicie certas aplicações, como o MySQL Workbench e o MySQL Shell. Clique em "Concluir" para abrir o painel do Instalador do MySQL.

##### 2.3.3.3.1 Configuração do Servidor MySQL com o Instalador do MySQL

O Instalador do MySQL realiza a configuração inicial do servidor MySQL. Por exemplo:

- Ele cria o arquivo de configuração (`my.ini`) que é usado para configurar o servidor MySQL. Os valores escritos neste arquivo são influenciados pelas escolhas que você faz durante o processo de instalação. Algumas definições dependem do host.

- Por padrão, um serviço do Windows para o servidor MySQL é adicionado.

- Fornece caminhos de instalação e de dados padrão para o servidor MySQL. Para obter instruções sobre como alterar os caminhos padrão, consulte a Seção 2.3.3.2, “Definindo caminhos de servidor alternativos com o instalador do MySQL”.

- Ele pode, opcionalmente, criar contas de usuário do servidor MySQL com permissões configuráveis com base em papéis gerais, como Administrador de BD, Designer de BD e Administrador de Backup. Ele cria opcionalmente um usuário do Windows chamado `MysqlSys` com privilégios limitados, que então executará o Servidor MySQL.

  As contas de usuário também podem ser adicionadas e configuradas no MySQL Workbench.

- Ao marcar Mostrar Opções Avançadas, você pode definir opções de registro adicionais. Isso inclui definir caminhos de arquivo personalizados para o log de erro, log geral, log de consultas lentas (incluindo a configuração dos segundos necessários para executar uma consulta) e o log binário.

Durante o processo de configuração, clique em Próximo para prosseguir para a próxima etapa ou em Voltar para retornar à etapa anterior. Clique em Executar na etapa final para aplicar a configuração do servidor.

As seções a seguir descrevem as opções de configuração do servidor que se aplicam ao servidor MySQL no Windows. A versão do servidor que você instalou determinará quais etapas e opções você pode configurar. Configurar o servidor MySQL pode incluir algumas ou todas as etapas.

###### 2.3.3.3.1.1 Tipo e rede de comunicação

- Tipo de Configuração do Servidor

  Escolha o tipo de configuração do servidor MySQL que descreve sua configuração. Esta configuração define a quantidade de recursos do sistema (memória) a ser atribuída à sua instância do servidor MySQL.

  - **Desenvolvimento**: Um computador que hospeda muitas outras aplicações, e, normalmente, essa é sua estação de trabalho pessoal. Esta configuração configura o MySQL para usar a menor quantidade de memória possível.

  - **Servidor**: Espera-se que vários outros aplicativos funcionem nesse computador, como um servidor web. A configuração de Servidor configura o MySQL para usar uma quantidade média de memória.

  - **Dedicado**: Um computador dedicado para executar o servidor MySQL. Como nenhuma outra aplicação importante é executada neste servidor, esta configuração configura o MySQL para usar a maior parte da memória disponível.

  - **Manual**

    Previne o Instalador do MySQL de tentar otimizar a instalação do servidor e, em vez disso, define os valores padrão para as variáveis do servidor incluídas no arquivo de configuração `my.ini`. Com o tipo `Manual` selecionado, o Instalador do MySQL usa o valor padrão de 16M para a atribuição da variável `tmp_table_size`.

- Conectividade

  As opções de conectividade controlam a forma como a conexão com o MySQL é feita. As opções incluem:

  - TCP/IP: Esta opção é selecionada por padrão. Você pode desativar a Rede TCP/IP para permitir apenas conexões de host local. Com a opção de conexão TCP/IP selecionada, você pode modificar os seguintes itens:

    - Porta para conexões de protocolo MySQL clássico. O valor padrão é `3306`.

    - O número do protocolo da porta mostrado ao configurar o servidor MySQL 8.0. O valor padrão é `33060`

    - Abra a porta do Firewall do Windows para o acesso à rede, que é selecionada por padrão para conexões TCP/IP.

    Se um número de porta já estiver em uso, você verá o ícone de informação (!) ao lado do valor padrão e o botão Próximo será desativado até que você forneça um novo número de porta.

  - Pipe Named: Ative e defina o nome da pipe, semelhante a definir a variável de sistema `named_pipe`. O nome padrão é `MySQL`.

    Quando você selecionar a conectividade de Pipe Nomeado e prosseguir para o próximo passo, será solicitado a definir o nível de controle de acesso concedido ao software cliente nas conexões de pipe nomeado. Alguns clientes exigem apenas controle de acesso mínimo para a comunicação, enquanto outros clientes exigem acesso total ao pipe nomeado.

    Você pode definir o nível de controle de acesso com base no(s) usuário(s) do Windows que executam o cliente da seguinte forma:

    - **Acesso mínimo para todos os usuários (RECOMENDADO).** Esse nível é ativado por padrão porque é o mais seguro.

    - **Acesso total aos membros de um grupo local.** Se a opção de acesso mínimo for restritiva para o software do cliente, use essa opção para reduzir o número de usuários que têm acesso total no tubo nomeado. O grupo deve ser criado no Windows antes de poder ser selecionado da lista. A associação a esse grupo deve ser limitada e gerenciada. O Windows exige que um membro recém-adicionado faça logout e, em seguida, faça login novamente para se juntar a um grupo local.

    - **Acesso total para todos os usuários (NÃO RECOMENDADO).** Esta opção é menos segura e deve ser configurada apenas quando outras medidas de segurança forem implementadas.

  - Memória compartilhada: Habilitar e definir o nome da memória, semelhante a definir a variável de sistema `shared_memory`. O nome padrão é `MySQL`.

- Configuração Avançada

  Verifique a opção Mostrar opções avançadas e de registro para definir opções personalizadas de registro e avançadas nas etapas subsequentes. A etapa Opções de registro permite definir caminhos de arquivo personalizados para o log de erro, log geral, log de consultas lentas (incluindo a configuração dos segundos necessários para executar uma consulta) e o log binário. A etapa Opções avançadas permite definir o ID único do servidor necessário quando o registro binário estiver habilitado em uma topologia de replicação.

- Firewall empresarial MySQL (apenas a edição Enterprise)

  A caixa de seleção Habilitar o Firewall Empresarial do MySQL está desmarcada por padrão. Selecione essa opção para habilitar uma lista de segurança que ofereça proteção contra certos tipos de ataques. É necessária uma configuração adicional após a instalação (consulte a Seção 6.4.6, "Firewall Empresarial do MySQL").

###### 2.3.3.3.1.2 Método de autenticação

O passo Método de Autenticação é visível apenas durante a instalação ou atualização do MySQL 8.0.4 ou superior. Ele introduz uma escolha entre duas opções de autenticação no lado do servidor. As contas de usuário do MySQL que você criar no próximo passo usarão o método de autenticação que você selecionar neste passo.

Os conectores e drivers da comunidade do MySQL 8.0 que utilizam o `libmysqlclient` 8.0 agora suportam o plugin de autenticação padrão `caching_sha2_password`. No entanto, se você não puder atualizar seus clientes e aplicativos para suportar esse novo método de autenticação, pode configurar o servidor MySQL para usar `mysql_native_password` para autenticação legada. Para obter mais informações sobre as implicações dessa mudança, consulte `caching_sha2_password` como o plugin de autenticação preferido.

Se você estiver instalando ou atualizando para o MySQL 8.0.4 ou superior, selecione um dos seguintes métodos de autenticação:

- Use criptografia de senha forte para autenticação (recomendado)

  O MySQL 8.0 suporta uma nova autenticação baseada em métodos de senha mais fortes e aprimorados baseados em SHA256. Recomenda-se que todas as novas instalações do servidor MySQL usem esse método a partir de agora.

  Importante

  O plugin de autenticação `caching_sha2_password` no servidor requer novas versões dos conectores e clientes, que adicionam suporte para a nova autenticação padrão do MySQL 8.0.

- Use o Método de Autenticação Legado (Reter a Compatibilidade com o MySQL 5.x)

  O uso do antigo método de autenticação legado do MySQL 5.x deve ser considerado apenas nos seguintes casos:

  - As aplicações não podem ser atualizadas para usar os conectores e drivers do MySQL 8.0.

  - A recompilação de um aplicativo existente não é viável.

  - Um conector ou driver atualizado, específico para a língua, ainda não está disponível.

###### 2.3.3.3.1.3 Contas e papéis

- Senha da Conta de Root

  É necessário atribuir uma senha de Root e você será solicitado a fornecê-la ao realizar outras operações do Instalador do MySQL. A força da senha é avaliada quando você repete a senha na caixa fornecida. Para obter informações descritivas sobre os requisitos ou status da senha, mova o ponteiro do mouse sobre o ícone de informação (!) quando ele aparecer.

- Contas de Usuário do MySQL (Opcional)

  Clique em Adicionar Usuário ou Editar Usuário para criar ou modificar contas de usuário do MySQL com papéis pré-definidos. Em seguida, insira as credenciais da conta necessárias:

  - Nome do usuário: os nomes de usuário do MySQL podem ter até 32 caracteres.

  - Anfitrião: Selecione `localhost` para conexões locais ou `<Todos os anfitriões (%)>` quando são necessárias conexões remotas ao servidor.

  - Papel: Cada papel predefinido, como `DB Admin`, é configurado com seu próprio conjunto de privilégios. Por exemplo, o papel `DB Admin` tem mais privilégios do que o papel `DB Designer`. A lista suspensa Papel contém uma descrição de cada papel.

  - Senha: A avaliação da força da senha é realizada enquanto você digita a senha. As senhas devem ser confirmadas. O MySQL permite uma senha em branco ou vazia (considerada insegura).

  **Lançamento Comercial do Instalação do MySQL:** A Edição Empresarial do MySQL para Windows, um produto comercial, também suporta um método de autenticação que realiza autenticação externa no Windows. As contas autenticadas pelo sistema operacional Windows podem acessar o servidor MySQL sem fornecer uma senha adicional.

  Para criar uma nova conta MySQL que use autenticação do Windows, insira o nome do usuário e, em seguida, selecione um valor para Host e Role. Clique em Autenticação do Windows para habilitar o plugin `authentication_windows`. Na área Tokens de Segurança do Windows, insira um token para cada usuário (ou grupo) do Windows que possa autenticar com o nome do usuário do MySQL. As contas do MySQL podem incluir tokens de segurança tanto para usuários locais do Windows quanto para usuários do Windows que pertencem a um domínio. Múltiplos tokens de segurança são separados pelo caractere ponto e vírgula (`;`). Use o seguinte formato para contas locais e de domínio:

  - Conta local

    Digite o nome de usuário simples do Windows como o token de segurança para cada usuário ou grupo local; por exemplo, **`finley;jeffrey;admin`**.

  - Conta de domínio

    Use a sintaxe padrão do Windows (*`domain`*`\`*`domainuser`*) ou a sintaxe do MySQL (*`domain`*`\\`*`domainuser`*) para inserir usuários e grupos do domínio do Windows.

    Para contas de domínio, você pode precisar usar as credenciais de um administrador dentro do domínio, caso a conta que executa o Instalador do MySQL não tenha permissões para consultar o Active Directory. Nesse caso, selecione Validação de usuários do Active Directory para ativar as credenciais do administrador do domínio.

  A autenticação do Windows permite que você teste todos os tokens de segurança toda vez que adicionar ou modificar um token. Clique em Testar Tokens de Segurança para validar (ou revalidar) cada token. Tokens inválidos geram uma mensagem de erro descritiva, juntamente com um ícone `X` vermelho e texto do token vermelho. Quando todos os tokens forem resolvidos como válidos (texto verde sem o ícone `X`), você pode clicar em OK para salvar as alterações.

###### 2.3.3.3.1.4 Serviço do Windows

Na plataforma Windows, o servidor MySQL pode ser executado como um serviço nomeado gerenciado pelo sistema operacional e configurado para iniciar automaticamente quando o Windows for iniciado. Alternativamente, você pode configurar o servidor MySQL para ser executado como um programa executável que requer configuração manual.

- Configure o servidor MySQL como um serviço do Windows (selecionado por padrão).

  Quando a opção de configuração padrão for selecionada, você também pode selecionar o seguinte:

  - Iniciar o servidor MySQL no início do sistema

    Quando selecionado (padrão), o tipo de inicialização do serviço é definido como Automático; caso contrário, o tipo de inicialização é definido como Manual.

  - Executar o Serviço do Windows

    Quando a Conta de Sistema Padrão é selecionada (padrão), o serviço inicia sessão como Serviço de Rede.

    A opção Usuário Personalizado deve ter privilégios para fazer login no Microsoft Windows como serviço. O botão Próximo será desativado até que esse usuário seja configurado com os privilégios necessários.

    Uma conta de usuário personalizada é configurada no Windows procurando por "política de segurança local" no menu Iniciar. Na janela Política de Segurança Local, selecione Políticas Locais, Atribuição de Direitos de Usuário e, em seguida, Log On As A Service para abrir o diálogo de propriedades. Clique em Adicionar Usuário ou Grupo para adicionar o usuário personalizado e, em seguida, clique em OK em cada diálogo para salvar as alterações.

- Desmarque a opção Serviço do Windows.

###### 2.3.3.3.1.5 Permissões de arquivo do servidor

Opcionalmente, as permissões definidas nas pastas e arquivos localizados em `C:\ProgramData\MySQL\MySQL Server 8.0\Data` podem ser gerenciadas durante a operação de configuração do servidor. Você tem as seguintes opções:

- O Instalador do MySQL pode configurar as pastas e arquivos com controle total concedido exclusivamente ao usuário que executa o serviço do Windows, se aplicável, e ao grupo Administradores.

  Todos os outros grupos e usuários são negados acesso. Esta é a opção padrão.

- Faça com que o Instalador do MySQL use uma opção de configuração semelhante àquela descrita acima, mas também faça com que o Instalador do MySQL mostre quais usuários poderiam ter controle total.

  Você pode então decidir se um grupo ou usuário deve ter controle total. Se não, você pode mover os membros qualificados dessa lista para uma segunda lista que restringe todo o acesso.

- Faça o MySQL Installer ignorar as alterações de permissões de arquivo durante a operação de configuração.

  Se você selecionar essa opção, você será responsável por proteger a pasta `Dados` e seus arquivos relacionados manualmente após a conclusão da configuração do servidor.

###### 2.3.3.3.1.6 Opções de registro

Essa etapa está disponível se a caixa de seleção Mostrar configuração avançada foi selecionada durante a etapa Tipo e Rede. Para habilitar essa etapa agora, clique em Voltar para retornar à etapa Tipo e Rede e selecione a caixa de seleção.

As opções de configuração avançadas estão relacionadas aos seguintes arquivos de log do MySQL:

- Registro de erros
- Diário Geral
- Registro de consultas lentas
- Registro de Bin

Nota

O log binário está ativado por padrão.

###### 2.3.3.3.1.7 Opções Avançadas

Essa etapa está disponível se a caixa de seleção Mostrar configuração avançada foi selecionada durante a etapa Tipo e Rede. Para habilitar essa etapa agora, clique em Voltar para retornar à etapa Tipo e Rede e selecione a caixa de seleção.

As opções de configuração avançada incluem:

- ID do servidor

  Defina o identificador único usado em uma topologia de replicação. Se o registro binário estiver habilitado, você deve especificar um ID do servidor. O valor padrão do ID depende da versão do servidor. Para obter mais informações, consulte a descrição da variável de sistema `server_id`.

- Tabela de Nomes Caso

  Você pode definir as seguintes opções durante a configuração inicial e subsequente do servidor. Para a série de lançamentos do MySQL 8.0, essas opções se aplicam apenas à configuração inicial do servidor.

  - Minúsculas

    Define o valor da opção `lower_case_table_names` para 1 (padrão), na qual os nomes das tabelas são armazenados em minúsculas no disco e as comparações não são sensíveis ao caso.

  - Preservar o caso dado

    Define o valor da opção `lower_case_table_names` para 2, na qual os nomes das tabelas são armazenados conforme fornecido, mas comparados em minúsculas.

###### 2.3.3.3.1.8 Aplicar Configuração do Servidor

Todas as configurações são aplicadas ao servidor MySQL quando você clica em Executar. Use a guia Etapas de Configuração para acompanhar o progresso de cada ação; o ícone para cada uma muda de branco para verde (com uma marca de verificação) em caso de sucesso. Caso contrário, o processo para e exibe uma mensagem de erro se uma ação individual ficar bloqueada. Clique na guia Log para visualizar o log.

Quando a instalação for concluída com sucesso e você clicar em "Concluir", o Instalador do MySQL e os produtos do MySQL instalados serão adicionados ao menu Iniciar do Microsoft Windows, sob o grupo "MySQL". Ao abrir o Instalador do MySQL, será carregado o painel de controle onde os produtos do MySQL instalados serão listados e outras operações do Instalador do MySQL estarão disponíveis.

##### 2.3.3.3.2 Configuração do roteador MySQL com o instalador do MySQL

Durante a configuração inicial, escolha qualquer tipo de configuração predeterminado, exceto `Servidor apenas`, para instalar a versão mais recente das ferramentas do GA. Use o tipo de configuração `Personalizado` para instalar uma ferramenta individual ou uma versão específica. Se o Instalador do MySQL já estiver instalado no host, use a operação Adicionar para selecionar e instalar ferramentas no painel do Instalador do MySQL.

###### Configuração do roteador MySQL

O Instalador do MySQL oferece um assistente de configuração que pode iniciar uma instância instalada do MySQL Router 8.0 para direcionar o tráfego entre aplicativos do MySQL e um Cluster InnoDB. Quando configurado, o MySQL Router é executado como um serviço local do Windows.

Nota

Você será solicitado a configurar o MySQL Router após a instalação inicial e quando você reconfigurar explicitamente um roteador instalado. Em contraste, a operação de atualização não exige ou solicita que você configure o produto atualizado.

Para configurar o MySQL Router, faça o seguinte:

1. Configure o InnoDB Cluster.

2. Usando o Instalador do MySQL, baixe e instale o aplicativo MySQL Router. Após a instalação terminar, o assistente de configuração solicitará informações. Selecione a caixa de seleção Configurar o MySQL Router para o Cluster InnoDB para iniciar a configuração e forneça os seguintes valores de configuração:

   - Nome de domínio: Nome de domínio do servidor primário (séptimo) no Cluster InnoDB (`localhost` por padrão).

   - Porta: O número da porta do servidor primário (seed) no Cluster InnoDB (`3306` por padrão).

   - Usuário de Gerenciamento: Um usuário administrativo com privilégios de nível de Root.

   - Senha: A senha do usuário de gerenciamento.

   - Conexões clássicas com o protocolo MySQL para o InnoDB Cluster

     Ler/Escrever: Defina o número de porta da primeira base para um número não utilizado (entre 80 e 65532) e o assistente selecionará as portas restantes para você.

     A figura a seguir mostra um exemplo da página de configuração do roteador MySQL, com o primeiro número de porta de base especificado como 6446 e as portas restantes definidas pelo assistente como 6447, 6448 e 6449.

   **Figura 2.10 Configuração do roteador MySQL**

   ![O conteúdo é descrito no texto ao redor.](images/mi-router-config.png)

3. Clique em Próximo e, em seguida, em Executar para aplicar a configuração. Clique em Concluir para fechar o Instalador do MySQL ou retornar ao painel do Instalador do MySQL.

Após configurar o MySQL Router, a conta root existe na tabela de usuários como `root@localhost` (local), em vez de `root@%` (remoto). Independentemente de onde o roteador e o cliente estiverem localizados, mesmo que ambos estejam no mesmo host do servidor mestre, qualquer conexão que passe pelo roteador é vista pelo servidor como sendo remota, não local. Como resultado, uma conexão feita ao servidor usando o host local (veja o exemplo a seguir), não se autentica.

```sql
$> \c root@localhost:6446
```
