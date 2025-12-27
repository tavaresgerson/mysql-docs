#### 2.3.2.1 Configuração do Servidor MySQL com o Configurator MySQL

O Configurator MySQL realiza a configuração inicial, uma reconfiguração e também funciona como parte do processo de desinstalação.

Nota

São concedidas permissões completas ao usuário que executa o Configurator MySQL para todos os arquivos gerados, como o `my.ini`. Isso não se aplica a arquivos e diretórios de produtos específicos, como o diretório de dados do servidor MySQL em `%ProgramData%` que é de propriedade do `SYSTEM`.

O Configurator MySQL realiza a configuração do servidor MySQL. Por exemplo:

* Cria o arquivo de configuração (`my.ini`) que é usado para configurar o servidor MySQL. Os valores escritos neste arquivo são influenciados pelas escolhas que você faz durante o processo de instalação. Algumas definições dependem do host.

* Por padrão, um serviço do Windows para o servidor MySQL é adicionado.
* Fornece caminhos de instalação e de dados padrão para o servidor MySQL.
* Opcionalmente, pode criar contas de usuário do servidor MySQL com permissões configuráveis com base em papéis gerais, como Administrador de BD, Designer de BD e Administrador de Backup.

* A opção Mostrar Opções Avançadas habilita a definição de Opções de Registro adicionais. Isso inclui a definição de caminhos de arquivo personalizados para o log de erro, log geral, log de consultas lentas (incluindo a configuração de segundos necessários para executar uma consulta) e o log binário.

As seções que seguem descrevem as opções de configuração do servidor que se aplicam ao servidor MySQL no Windows. A versão do servidor que você instalou determinará quais etapas e opções você pode configurar. Configurar o servidor MySQL pode incluir algumas ou todas as etapas.

##### 2.3.2.1.1 Instalações do Servidor MySQL

O Configurator MySQL adiciona uma opção de atualização se encontrar uma instalação existente do Servidor MySQL. Ele oferece duas opções:

Nota

Essa funcionalidade de atualização foi adicionada no MySQL 8.3.0.

* Atualização In-Place de uma Instalação Existente do Servidor MySQL
* Adicionar uma Instalação Separada do Servidor MySQL

###### Atualização In-Place de uma Instalação Existente do Servidor MySQL

Isso substitui a instalação existente do servidor MySQL como parte do processo de atualização, que também pode atualizar o esquema de dados. Após o sucesso, a instalação existente do servidor MySQL é removida do sistema.

Nota

A instância do servidor MySQL existente deve estar em execução para que a opção de atualização in-place funcione.

Embora o MySQL Configurator possa tentar (e conseguir) realizar uma atualização in-place para outros cenários, a tabela a seguir lista os cenários oficialmente suportados pelo configurator:

**Tabela 2.5 Caminhos de Atualização Suportado**

<table summary="Caminhos de atualização oficialmente suportados pelo MySQL Configurator"><col style="width: 25%"/><col style="width: 75%"/><thead><tr> <th scope="col">Um cenário de atualização suportado</th> <th scope="col">Descrição</th> </tr></thead><tbody><tr> <td>8.0.35+ para 8.1</td> <td>De 8.0.35 ou superior para a primeira versão de inovação do MySQL 8.</td> </tr><tr> <td>8.0.35+ para 8.4</td> <td>De 8.0.35 ou superior para a próxima versão LTS do MySQL.</td> </tr><tr> <td>8.X para 8.Y onde Y = X + 1</td> <td>De uma versão de inovação para a próxima versão de inovação consecutiva.</td> </tr><tr> <td>8.3 para 8.4</td> <td>De última versão de inovação do MySQL 8 para a próxima versão LTS do MySQL 8.</td> </tr><tr> <td>8.4.X para 8.4.Y onde Y &gt; X</td> <td>Dentro da mesma versão LTS.</td> </tr><tr> <td>8.4.X para 9.0.0</td> <td>De uma versão LTS para a primeira versão de inovação consecutiva.</td> </tr><tr> <td>8.4 para 9.7</td> <td>De uma versão LTS para a próxima versão LTS consecutiva.</td> </tr></tbody></table>

Esse diálogo solicita o protocolo (padrão: TCP/IP), a porta (padrão: 3306) e a senha de root para a instalação existente. Execute o comando connect e, em seguida, revise e confirme as informações da instância do MySQL (como a versão, os caminhos e o arquivo de configuração) antes de prosseguir com a atualização.

Essa atualização pode substituir os caminhos de arquivo. Por exemplo, "MySQL Server 8.2\Data" muda para "MySQL Server 8.3\Data" ao atualizar o 8.2 para o 8.3.

Essa funcionalidade de atualização também oferece essas opções adicionais: "Backup de Dados" permite executar o **mysqldump** antes de realizar a atualização, e "Permissões de Arquivo do Servidor" para personalizar opcionalmente as permissões de arquivo.

###### Adicione uma Instalação Separada do MySQL Server

Configure uma instalação padrão lado a lado com a nova instalação do servidor MySQL. Isso significa ter várias instalações de servidor MySQL instaladas e em execução no sistema.

##### 2.3.2.1.2 Tipo e Rede

* Tipo de Configuração do Servidor

  Escolha o tipo de configuração do servidor MySQL que descreve sua configuração. Essa configuração define a quantidade de recursos do sistema (memória) a ser atribuída à instância do seu servidor MySQL.

  + **Desenvolvimento**: Um computador que hospeda muitas outras aplicações, e, tipicamente, essa é sua estação de trabalho pessoal. Essa configuração configura o MySQL para usar a menor quantidade de memória.

  + **Servidor**: Espera-se que várias outras aplicações sejam executadas neste computador, como um servidor web. A configuração Servidor configura o MySQL para usar uma quantidade média de memória.

  + **Dedicado**: Um computador dedicado para executar o servidor MySQL. Como nenhuma outra aplicação importante é executada neste servidor, essa configuração configura o MySQL para usar a maioria da memória disponível.

+ **Manual**: Impedir que o MySQL Configurator tente otimizar a instalação do servidor e, em vez disso, definir os valores padrão para as variáveis do servidor incluídas no arquivo de configuração `my.ini`. Com o tipo `Manual` selecionado, o MySQL Configurator usa o valor padrão de 16M para a atribuição da variável `tmp_table_size`.

* Conectividade

  As opções de conectividade controlam como a conexão com o MySQL é feita. As opções incluem:

  + TCP/IP: Esta opção é selecionada por padrão. Você pode desabilitar a Rede TCP/IP para permitir conexões de host local apenas. Com a opção de conexão TCP/IP selecionada, você pode modificar os seguintes itens:

    - Porta para conexões do protocolo MySQL clássico. O valor padrão é `3306`.

    - Porta X Protocol padrão para `33060`

    - Porta do Firewall do Windows aberta para acesso à rede, que é selecionada por padrão para conexões TCP/IP.

    Se um número de porta já estiver em uso, você verá o ícone de erro (!) ao lado do valor padrão e o botão Próximo será desativado até que você forneça um novo número de porta.

  + Pipe Nomeado: Ative e defina o nome do pipe, semelhante a definir a variável de sistema `named_pipe`. O nome padrão é `MySQL`.

    Quando você selecionar a conectividade Pipe Nomeado e, em seguida, prosseguir para o próximo passo, você será solicitado a definir o nível de controle de acesso concedido ao software cliente nas conexões de pipe nomeado. Alguns clientes requerem apenas controle mínimo de acesso para a comunicação, enquanto outros clientes requerem acesso total ao pipe nomeado.

    Você pode definir o nível de controle de acesso com base no usuário (ou usuários) do Windows que executam o cliente da seguinte forma:

    - **Acesso mínimo para todos os usuários (RECOMENDADO).** Este nível é ativado por padrão porque é o mais seguro.

- **Acesso total aos membros de um grupo local.** Se a opção de acesso mínimo for restritiva demais para o software do cliente, use essa opção para reduzir o número de usuários que têm acesso total no tubo nomeado. O grupo deve ser criado no Windows antes de poder ser selecionado da lista. A associação a esse grupo deve ser limitada e gerenciada. O Windows exige que um membro recém-adicionado faça logout e, em seguida, faça login novamente para se juntar a um grupo local.

- **Acesso total a todos os usuários (NÃO RECOMENDADO).** Essa opção é menos segura e deve ser definida apenas quando outras medidas de segurança forem implementadas.

  + Memória Compartilhada: Ative e defina o nome da memória, semelhante à definição da variável de sistema `shared_memory`. O nome padrão é `MySQL`.

* Configuração Avançada

  Marque a caixa Mostrar Opções Avançadas e de Registro para definir opções de registro personalizadas nas etapas subsequentes. A etapa Opções de Registro permite definir caminhos de arquivo personalizados para o log de erro, log geral, log de consultas lentas (incluindo a configuração de segundos necessários para executar uma consulta) e o log binário. A etapa Opções Avançadas permite definir o ID único do servidor necessário quando o registro binário estiver habilitado em uma topologia de replicação.

##### 2.3.2.1.3 Firewall do MySQL (apenas a Edição Empresarial)

* *Para novas configurações:* Selecione a caixa de seleção Habilitar Firewall do MySQL Empresarial para habilitar o componente Firewall do MySQL Empresarial, uma lista de segurança que oferece proteção contra certos tipos de ataques. É necessária uma configuração pós-instalação adicional (consulte a Seção 8.4.8, “Firewall do MySQL Empresarial”). A caixa de seleção está desmarcada por padrão.

* *Para reconfigurações:*

+ Selecione a caixa de seleção Atualizar Firewall Empresarial MySQL para atualizar seu plugin de firewall (desatualizado) para o componente de firewall. A caixa de seleção está desmarcada por padrão.

+ Selecione a caixa de seleção Habilitar Firewall Empresarial MySQL para habilitar o componente de Firewall Empresarial MySQL. É necessária uma configuração pós-instalação adicional (consulte a Seção 8.4.8, “Firewall Empresarial MySQL”). A caixa de seleção está desmarcada por padrão.

* *Para atualizações:*

+ Selecione a caixa de seleção Atualizar Firewall Empresarial MySQL para atualizar seu plugin de firewall (desatualizado) para o componente de firewall. A caixa de seleção está desmarcada por padrão.

##### 2.3.2.1.4 Contas e Papéis

* Senha da Conta de Root

A atribuição de uma senha de root é necessária e você será solicitado a fornecê-la ao reconfigurar com o MySQL Configurator no futuro. A força da senha é avaliada quando você repete a senha na caixa fornecida. Para informações descritivas sobre os requisitos ou status da senha, mova o ponteiro do mouse sobre o ícone de informação (!) quando ele aparecer.

* Contas de Usuário MySQL (Opcional)

Clique em Adicionar Usuário ou Editar Usuário para criar ou modificar contas de usuário MySQL com papéis pré-definidos. Em seguida, insira as credenciais de conta necessárias:

+ Nome do Usuário: Os nomes de usuário MySQL podem ter até 32 caracteres.

+ Host: Selecione `localhost` para conexões locais ou `<Todos os Hosts (%)>` quando conexões remotas ao servidor são necessárias.

+ Papel: Cada papel pré-definido, como `DB Admin`, é configurado com seu próprio conjunto de privilégios. Por exemplo, o papel `DB Admin` tem mais privilégios do que o papel `DB Designer`. A lista suspensa de Papéis contém uma descrição de cada papel.

+ Senha: A avaliação da força da senha é realizada enquanto você digita a senha. As senhas devem ser confirmadas. O MySQL permite uma senha em branco ou vazia (considerada insegura).

**Apenas para a versão comercial do MySQL Configurator:** A Edição Empresarial do MySQL para Windows, um produto comercial, também suporta um método de autenticação que realiza autenticação externa no Windows. Contas autenticadas pelo sistema operacional Windows podem acessar o servidor MySQL sem fornecer uma senha adicional.

Para criar uma nova conta MySQL que use a autenticação do Windows, insira o nome do usuário e, em seguida, selecione um valor para Host e Papel. Clique em Autenticação do Windows para habilitar o plugin `authentication_windows`. Na área de Tokens de Segurança do Windows, insira um token para cada usuário (ou grupo) do Windows que possa autenticar com o nome do usuário do MySQL. As contas do MySQL podem incluir tokens de segurança para usuários locais do Windows e usuários do Windows que pertencem a um domínio. Múltiplos tokens de segurança são separados pelo caractere ponto e vírgula (`;`). Use o seguinte formato para contas locais e de domínio:

+ Conta local

Insira o nome simples do usuário do Windows como token de segurança para cada usuário ou grupo local; por exemplo, **`finley;jeffrey;admin`**.

+ Conta de domínio

Use a sintaxe padrão do Windows (*`domain`*`\`*`domainuser`*) ou a sintaxe do MySQL (*`domain`*`\\`*`domainuser`*) para inserir usuários e grupos do domínio do Windows.

Para contas de domínio, você pode precisar usar as credenciais de um administrador dentro do domínio se a conta que executa o MySQL Configurator não tiver as permissões para consultar o Active Directory. Se esse for o caso, selecione Validação de usuários do Active Directory com para ativar as credenciais do administrador do domínio.

A autenticação do Windows permite que você teste todos os tokens de segurança toda vez que adicionar ou modificar um token. Clique em Testar Tokens de Segurança para validar (ou revalidar) cada token. Tokens inválidos geram uma mensagem de erro descritiva junto com um ícone `X` vermelho e texto do token vermelho. Quando todos os tokens forem resolvidos como válidos (texto verde sem o ícone `X`), você pode clicar em OK para salvar as alterações.

##### 2.3.2.1.5 Serviço do Windows

Na plataforma Windows, o servidor MySQL pode ser executado como um serviço nomeado gerenciado pelo sistema operacional e configurado para iniciar automaticamente quando o Windows iniciar. Alternativamente, você pode configurar o servidor MySQL para ser executado como um programa executável que requer configuração manual.

* Configure o servidor MySQL como um serviço do Windows (Selecionado por padrão.)

  Quando a opção de configuração padrão for selecionada, você também pode selecionar o seguinte:

  + Nome do Serviço do Windows

    Padrão para MySQL*XY* onde XY é 81 para o MySQL 8.1.

  + Iniciar o Servidor MySQL no Início do Sistema

    Quando selecionado (padrão), o tipo de inicialização do serviço é definido como Automático; caso contrário, o tipo de inicialização é definido como Manual.

  + Executar Serviço do Windows como

    Quando a Conta de Sistema Padrão for selecionada (padrão), o serviço inicia sessão como Serviço de Rede.

    A opção Usuário Personalizado deve ter privilégios para iniciar sessão no Microsoft Windows como um serviço. O botão Próximo será desabilitado até que esse usuário seja configurado com os privilégios necessários.

    Uma conta de usuário personalizada é configurada no Windows pesquisando "política de segurança local" no menu Iniciar. Na janela Política de Segurança Local, selecione Políticas Locais, Atribuição de Direitos de Usuário e, em seguida, Iniciar Sessão Como Serviço para abrir o diálogo de propriedades. Clique em Adicionar Usuário ou Grupo para adicionar o usuário personalizado e, em seguida, clique em OK em cada diálogo para salvar as alterações.

##### 2.3.2.1.6 Permissões de Arquivo do Servidor

Opcionalmente, as permissões definidas nas pastas e arquivos localizados em `C:\ProgramData\MySQL\MySQL Server X.Y\Data` podem ser gerenciadas durante a operação de configuração do servidor. Você tem as seguintes opções:

* O MySQL Configurator pode configurar as pastas e arquivos com controle total concedido exclusivamente ao usuário que executa o serviço do Windows, se aplicável, e ao grupo Administradores.

  Todos os outros grupos e usuários são negados o acesso. Esta é a opção padrão.

* Peça ao MySQL Configurator que use uma opção de configuração semelhante à descrita acima, mas também peça ao MySQL Configurator que mostre quais usuários poderiam ter controle total.

  Você então pode decidir se um grupo ou usuário deve ter controle total. Se não, você pode mover os membros qualificados desta lista para uma segunda lista que restringe todo o acesso.

* Peça ao MySQL Configurator que ignore as alterações de permissão de arquivo durante a operação de configuração.

  Se você selecionar esta opção, você é responsável por proteger a pasta `Data` e seus arquivos relacionados manualmente após o término da configuração do servidor.

##### 2.3.2.1.7 Opções de Registro

Esta etapa está disponível se a caixa de seleção Mostrar Configuração Avançada foi selecionada durante a etapa Tipo e Redes. Para habilitar esta etapa agora, clique em Voltar para retornar à etapa Tipo e Redes e selecione a caixa de seleção.

As opções de configuração avançada estão relacionadas aos seguintes arquivos de log do MySQL:

* Log de Erro
* Log Geral
* Log de Pergunta Lenta
* Log Binário

##### 2.3.2.1.8 Opções Avançadas

Esta etapa está disponível se a caixa de seleção Mostrar Configuração Avançada foi selecionada durante a etapa Tipo e Redes. Para habilitar esta etapa agora, clique em Voltar para retornar à etapa Tipo e Redes e selecione a caixa de seleção.

As opções de configuração avançada incluem:

* ID do servidor

  Defina o identificador único usado em uma topologia de replicação. Se o registro binário estiver habilitado, você deve especificar um ID de servidor. O valor padrão do ID depende da versão do servidor. Para obter mais informações, consulte a descrição da variável de sistema `server_id`.

* Nomes das tabelas em maiúsculas

  Essas opções só se aplicam à configuração inicial do servidor MySQL.

  + Maiúsculas

    Define o valor da opção `lower_case_table_names` para 1 (padrão), na qual os nomes das tabelas são armazenados em maiúsculas no disco e as comparações não são case-sensitive.

  + Preservar caso dado

    Define o valor da opção `lower_case_table_names` para 2, na qual os nomes das tabelas são armazenados como dados, mas comparados em maiúsculas.

##### 2.3.2.1.9 Bancos de dados de amostra

Opcionalmente, instale bancos de dados de amostra que incluem dados de teste para ajudar a desenvolver aplicativos com MySQL. As opções incluem os bancos de dados sakila e world.

##### 2.3.2.1.10 Aplicar configuração

Todas as configurações são aplicadas ao servidor MySQL quando você clica em Executar. Use a guia Etapas de Configuração para acompanhar o progresso de cada ação; o ícone para cada uma muda de branco para verde (com uma marca de verificação) em caso de sucesso. Caso contrário, o processo pára e exibe uma mensagem de erro se uma ação individual ficar bloqueada. Clique na guia Log para visualizar o log.