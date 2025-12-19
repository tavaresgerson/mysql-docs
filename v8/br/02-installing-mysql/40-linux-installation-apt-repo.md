### 2.5.2 Instalar o MySQL no Linux usando o Repositório MySQL APT

Esta seção fornece orientações sobre a instalação do MySQL usando o repositório MySQL APT.

#### Passos para uma nova instalação do MySQL

::: info Note

As instruções a seguir assumem que nenhuma versão do MySQL (distribuída pela Oracle ou outras partes) já foi instalada em seu sistema; se esse não for o caso, siga as instruções dadas em Substituir uma Distribuição Nativa do MySQL Usando o Repositório APT do MySQL ou Substituir um Servidor MySQL Instalado por um Download Direto de Pacote de Deb.

:::

\*\* Adicionando o Repositório Apt do MySQL. \*\* Primeiro, adicione o repositório APT do MySQL à lista de repositórios de software do seu sistema. Siga estas etapas:

1. Vá para a página de download do repositório MySQL APT em <https://dev.mysql.com/downloads/repo/apt/>.
2. Selecione e baixe o pacote de lançamento para sua distribuição Linux.

   Embora isso não seja necessário para cada atualização, ele atualiza as informações do repositório MySQL para incluir as informações atuais, o que inclui a adição de uma nova série LTS.
3. Instale o pacote de lançamento baixado com o seguinte comando, substituindo `version-specific-package-name` pelo nome do pacote baixado (precedido por seu caminho, se você não estiver executando o comando dentro da pasta onde o pacote está):

   ```
   $> sudo dpkg -i /PATH/version-specific-package-name.deb
   ```

   Por exemplo, para a versão `w.x.y-z` do pacote, o comando é:

   ```
   $> sudo dpkg -i mysql-apt-config_w.x.y-z_all.deb
   ```

   Observe que o mesmo pacote funciona em todas as plataformas Debian e Ubuntu suportadas.
4. Durante a instalação do pacote, você será solicitado a escolher as versões do servidor MySQL e outros componentes (por exemplo, o MySQL Workbench) que você deseja instalar. Se você não tiver certeza de qual versão escolher, não altere as opções padrão selecionadas para você. Você também pode escolher nenhuma se você não quiser que um componente específico seja instalado. Depois de fazer as escolhas para todos os componentes, escolha Ok para terminar a configuração e instalação do pacote de lançamento.

   ::: info Note

   A faixa de inovação, que começa com o MySQL 8.1, inclui "-inovação-" no nome do componente.

   :::

   Você sempre pode alterar suas escolhas para as versões mais tarde; veja Selecionando uma versão de lançamento principal para instruções.
5. Atualizar as informações do pacote a partir do repositório MySQL APT com o seguinte comando (*esta etapa é obrigatória*):

   ```
   $> sudo apt-get update
   ```

Em vez de usar o pacote de lançamento, você também pode adicionar e configurar o repositório MySQL APT manualmente; veja o Apêndice A: Adicionar e Configurar o Repositório MySQL APT Manualmente para detalhes.

::: info Note

Uma vez que o repositório MySQL APT esteja habilitado em seu sistema, você não poderá mais instalar nenhum pacote MySQL dos repositórios de software nativos de sua plataforma até que o repositório MySQL APT seja desativado.

:::

::: info Note

Uma vez que o repositório MySQL APT esteja habilitado em seu sistema, qualquer atualização em todo o sistema pelo comando **apt-get upgrade** atualizará automaticamente os pacotes MySQL em seu sistema e também substituirá todos os pacotes nativos MySQL que você instalou do repositório de software de sua distribuição Linux, se o APT encontrar substituições para eles dentro do repositório MySQL APT.

:::

#### Selecionando uma versão de lançamento principal

Por padrão, todas as instalações e atualizações para o seu servidor MySQL e os outros componentes necessários vêm da série de lançamentos da versão principal que você selecionou durante a instalação do pacote de configuração (consulte Adicionar o Repositório de Aptidão do MySQL). No entanto, você pode mudar para outra série de lançamentos principais suportados a qualquer momento, reconfigurando o pacote de configuração que você instalou. Use o seguinte comando:

```
$> sudo dpkg-reconfigure mysql-apt-config
```

Uma caixa de diálogo então pede que você escolha a versão de lançamento principal que você deseja. Faça sua seleção e escolha Ok. Depois de retornar ao prompt de comando, atualize as informações do pacote do repositório MySQL APT com este comando:

```
$> sudo apt-get update
```

A versão mais recente da série selecionada será então instalada quando você usar o comando **apt-get install** da próxima vez.

Você pode usar o mesmo método para alterar a versão para qualquer outro componente do MySQL que você deseja instalar com o repositório MySQL APT.

#### Instalar o MySQL com o APT

Instalar o MySQL com o seguinte comando:

```
$> sudo apt-get install mysql-server
```

Isso instala o pacote para o servidor MySQL, bem como os pacotes para o cliente e para os arquivos comuns do banco de dados.

Durante a instalação, você é solicitado a fornecer uma senha para o usuário raiz para a sua instalação do MySQL.

Importância

Certifique-se de lembrar a senha raiz que você definiu. Os usuários que desejam definir uma senha mais tarde podem deixar o campo de senha em branco na caixa de diálogo e apenas pressionar Ok; nesse caso, o acesso raiz ao servidor será autenticado pela Seção 8.4.1.10, Socket Peer-Credential Pluggable Authentication para conexões usando um arquivo de soquete Unix. Você pode definir a senha raiz mais tarde usando o programa **mysql\_secure\_installation**.

#### Iniciar e parar o servidor MySQL

O servidor MySQL é iniciado automaticamente após a instalação. Pode verificar o estado do servidor MySQL com o seguinte comando:

```
$> systemctl status mysql
```

Se o sistema operacional estiver habilitado, os comandos padrão \*\* systemctl \*\* (ou, alternativamente, \*\* service \*\* com os argumentos invertidos) como \*\* stop \*\*, \*\* start \*\*, \*\* status \*\* e \*\* restart \*\* devem ser usados para gerenciar o serviço de servidor MySQL. O serviço `mysql` está habilitado por padrão e inicia-se na reinicialização do sistema. Veja a Seção 2.5.9, Gerenciando o MySQL Server com systemd para informações adicionais.

::: info Note

Alguns pacotes de repositório nativos de terceiros que têm dependências dos pacotes nativos do MySQL podem não funcionar com os pacotes de repositório MySQL APT e não devem ser usados junto com eles; estes incluem akonadi-backend-mysql, handlersocket-mysql-5.5 e zoneminder.

:::

#### Instalação de Produtos e Componentes MySQL Adicionais com APT

Você pode usar o APT para instalar componentes individuais do MySQL a partir do repositório do MySQL APT. Supondo que você já tenha o repositório do MySQL APT na lista de repositórios do seu sistema (consulte Adicionar o Repositório do MySQL Apt para instruções), primeiro, use o seguinte comando para obter as informações mais recentes do pacote do repositório do MySQL APT:

```
$> sudo apt-get update
```

Instale qualquer pacote de sua escolha com o seguinte comando, substituindo `package-name` pelo nome do pacote a instalar:

```
$> sudo apt-get install package-name
```

Por exemplo, para instalar o MySQL Workbench:

```
$> sudo apt-get install mysql-workbench-community
```

Para instalar as bibliotecas de cliente compartilhadas:

```
$> sudo apt-get install libmysqlclient21
```

#### Instalar o MySQL a partir do Source com o Repositório MySQL APT

::: info Note

Este recurso só é suportado em sistemas de 64 bits.

:::

Você pode baixar o código-fonte para o MySQL e construí-lo usando o Repositório MySQL APT:

1. Adicione o repositório MySQL APT à lista de repositórios do seu sistema e escolha a série de versões principais que deseja (consulte Adicionar o Repositório MySQL Apt para instruções).
2. Atualizar as informações do pacote a partir do repositório MySQL APT com o seguinte comando (*esta etapa é obrigatória*):

   ```
   $> sudo apt-get update
   ```
3. Instalar pacotes que o processo de compilação depende:

   ```
   $> sudo apt-get build-dep mysql-server
   ```
4. Baixe o código-fonte para os principais componentes do MySQL e, em seguida, construí-los (executar este comando na pasta em que você deseja os arquivos baixados e as compilações a ser localizado):

   ```
   $> apt-get source -b mysql-server
   ```

   São criados pacotes `deb` para instalar os vários componentes do MySQL.
5. Escolha os pacotes `deb` para os componentes do MySQL de que precisa e instale-os com o comando:

   ```
   $> sudo dpkg -i package-name.deb
   ```

   Observe que existem relações de dependência entre os pacotes MySQL. Para uma instalação básica do servidor MySQL, instale o pacote de arquivos comuns do banco de dados, o pacote do cliente, o metapackage do cliente, o pacote do servidor e o metapackage do servidor (naquela ordem) com as seguintes etapas:

   - Preconfigure o pacote do servidor MySQL com o seguinte comando:

     ```
     $> sudo dpkg-preconfigure mysql-community-server_version-and-platform-specific-part.deb
     ```

     Você será solicitado a fornecer uma senha para o usuário raiz para sua instalação do MySQL; veja informações importantes sobre a senha raiz fornecida em Instalar o MySQL com APT acima. Você também pode ser perguntado outras perguntas sobre a instalação.
   - Instalar os pacotes necessários com um único comando:

     ```
     $> sudo dpkg -i mysql-{common,community-client,client,community-server,server}_*.deb
     ```
   - Se você está sendo avisado de dependências não atendidas por dpkg, você pode corrigi-las usando apt-get:

     ```
     sudo apt-get -f install
     ```

   Aqui estão os arquivos instalados no sistema:

   - Todos os arquivos de configuração (como `my.cnf`) estão em `/etc/mysql`
   - Todos os binários, bibliotecas, cabeçalhos, etc., estão em `/usr/bin` e `/usr/sbin`
   - O diretório de dados está em `/var/lib/mysql`

Ver também as informações dadas em Iniciar e parar o servidor MySQL.

#### Atualização do MySQL com o Repositório APT do MySQL

::: info Notes

- Antes de executar qualquer atualização para o MySQL, siga cuidadosamente as instruções no Capítulo 3, *Atualização do MySQL*. Entre outras instruções discutidas lá, *é especialmente importante fazer backup do seu banco de dados antes da atualização*.
- As instruções a seguir assumem que o MySQL foi instalado no seu sistema usando o repositório MySQL APT; se esse não for o caso, siga as instruções dadas em Substituir uma distribuição nativa do MySQL usando o repositório MySQL APT ou Substituir um servidor MySQL instalado por um download direto de pacotes de deb. Observe também que você não pode usar o repositório MySQL APT para atualizar uma distribuição do MySQL que você instalou de um repositório de software não nativo (por exemplo, do MariaDB ou Percona).

:::

Use o repositório APT do MySQL para realizar uma atualização no local para sua instalação do MySQL (ou seja, substituindo a versão antiga e depois executando a nova versão usando os arquivos de dados antigos) seguindo estas etapas:

1. Certifique-se de que você já tem o repositório MySQL APT na lista de repositórios do seu sistema (consulte Adicionar o Repositório MySQL Apt para instruções).
2. Certifique-se de ter as informações mais atualizadas sobre o pacote no repositório APT do MySQL executando:

   ```
   $> sudo apt-get update
   ```
3. Observe que, por padrão, o repositório MySQL APT atualizará o MySQL para a série de lançamentos que você selecionou quando você estava \[adicionando o repositório MySQL APT ao seu sistema] ((linux-installation-apt-repo.html#apt-repo-setup). Se você quiser atualizar para outra série de lançamentos, selecione-a seguindo as etapas dadas em Selecionar uma versão de lançamento principal.

   Como regra geral, para atualizar de uma série de lançamento para outra, vá para a próxima série em vez de pular uma série. Por exemplo, se você estiver executando o MySQL 5.7 e deseja atualizar para uma série mais nova, atualize para o MySQL 8.0 primeiro antes de atualizar para o 8.4.

   Importância

   O repositório APT do MySQL não suporta a degradação local do MySQL. Siga as instruções no Capítulo 4, *Downgrading MySQL*.
4. Atualizar o MySQL com o seguinte comando:

   ```
   $> sudo apt-get install mysql-server
   ```

   O servidor MySQL, o cliente e os arquivos comuns do banco de dados são atualizados se as versões mais recentes estiverem disponíveis. Para atualizar qualquer outro pacote MySQL, use o mesmo comando **apt-get install** e forneça o nome do pacote que você deseja atualizar:

   ```
   $> sudo apt-get install package-name
   ```

   Para ver os nomes dos pacotes que você instalou a partir do repositório APT do MySQL, use o seguinte comando:

   ```
   $> dpkg -l | grep mysql | grep ii
   ```

   ::: info Note

   Se você executar uma atualização em todo o sistema usando **apt-get upgrade**, apenas a biblioteca MySQL e os pacotes de desenvolvimento serão atualizados com versões mais recentes (se disponíveis). Para atualizar outros componentes, incluindo o servidor, o cliente, o conjunto de testes, etc., use o comando **apt-get install**.

   :::
5. O servidor MySQL é sempre reiniciado após uma atualização pela APT.

#### Substituir uma distribuição nativa do MySQL usando o repositório MySQL APT

Variantes e bifurcações do MySQL são distribuídas por diferentes partes através de seus próprios repositórios de software ou sites de download.

::: info Note

O repositório MySQL APT só pode substituir distribuições do MySQL mantidas e distribuídas pelo Debian ou Ubuntu. Ele não pode substituir quaisquer forks do MySQL encontrados dentro ou fora dos repositórios nativos das distribuições. Para substituir tais forks do MySQL, você deve desinstalar-os primeiro antes de instalar o MySQL usando o repositório MySQL APT. Siga as instruções para desinstalação dos distribuidores dos forks e, antes de prosseguir, certifique-se de fazer backup de seus dados e saber como restaurá-los em um novo servidor.

:::

Advertência

Alguns pacotes de repositório nativos de terceiros que têm dependências dos pacotes nativos do MySQL podem não funcionar com os pacotes de repositório MySQL APT e não devem ser usados junto com eles; estes incluem akonadi-backend-mysql, handlersocket-mysql-5.5 e zoneminder.

1. ##### Fazer backup de seu banco de dados

   Para evitar a perda de dados, faça sempre um backup do seu banco de dados antes de tentar substituir a sua instalação MySQL usando o repositório MySQL APT. Consulte o Capítulo 9, *Backup e Recuperação* para obter instruções.
2. ##### Adicionando o repositório APT do MySQL e selecionando uma série de versões

   Adicione o repositório MySQL APT à lista de repositórios do seu sistema e selecione a série de versões desejada seguindo as instruções dadas em Adicionar o Repositório MySQL Apt.
3. ##### Substituindo a Distribuição Nativa por uma Atualização APT

   Por design, o repositório MySQL APT substitui sua distribuição nativa do MySQL quando você executa atualizações nos pacotes MySQL. Para executar as atualizações, siga as mesmas instruções dadas na Etapa 4 em Atualizar o MySQL com o Repositório MySQL APT. Aviso

Uma vez que a distribuição nativa do MySQL foi substituída usando o repositório MySQL APT, purgar os pacotes antigos do repositório nativo usando o comando **apt-get purge**, **apt-get remove --purge**, ou **dpkg -P** pode impactar o servidor MySQL recém-instalado de várias maneiras. Portanto, *não purgar os pacotes antigos do MySQL dos pacotes do repositório nativo*.

#### Substituição de um servidor MySQL instalado por um pacote de descarregamento de deb direto

Os pacotes `deb` do MySQL para instalar o servidor MySQL e seus componentes podem ser baixados da página de download do MySQL da MySQL Developer Zone ou do repositório MySQL APT. Os pacotes `deb` das duas fontes são diferentes e instalam e configuram o MySQL de maneiras diferentes.

Se você instalou o MySQL com os pacotes `deb` da MySQL Developer Zone e agora deseja substituir a instalação usando os do repositório MySQL APT, siga estas etapas:

1. Para obter instruções, consulte o Capítulo 9, "Backup e Recuperação".
2. Siga as etapas dadas anteriormente para \[adicionar o repositório MySQL APT] ((linux-installation-apt-repo.html#apt-repo-setup).
3. Remover a antiga instalação do MySQL executando:

   ```
   $> sudo dpkg -P mysql
   ```
4. Instalar o MySQL a partir do repositório MySQL APT:

   ```
   $> sudo apt-get install mysql-server
   ```
5. Se necessário, restaure os dados na nova instalação do MySQL. Ver Capítulo 9, "Backup e Recuperação" para instruções.

##### Remover MySQL com APT

Para desinstalar o servidor MySQL e os componentes relacionados que foram instalados usando o repositório MySQL APT, primeiro, remova o servidor MySQL usando o seguinte comando:

```
$> sudo apt-get remove mysql-server
```

Em seguida, remova qualquer outro software que foi instalado automaticamente com o servidor MySQL:

```
$> sudo apt-get autoremove
```

Para desinstalar outros componentes, use o seguinte comando, substituindo `package-name` pelo nome do pacote do componente que você deseja remover:

```
$> sudo apt-get remove package-name
```

Para ver uma lista de pacotes que você instalou a partir do repositório APT do MySQL, use o seguinte comando:

```
$> dpkg -l | grep mysql | grep ii
```

##### Notas especiais sobre a atualização das bibliotecas de clientes compartilhados

Você pode instalar as bibliotecas de clientes compartilhados do repositório APT do MySQL pelo seguinte comando (consulte Instalar Produtos e Componentes Adicionais do MySQL com APT para mais detalhes):

```
$> sudo apt-get install libmysqlclient21
```

Se você já tem as bibliotecas de clientes compartilhados instaladas no repositório de software da plataforma Linux, elas podem ser atualizadas pelo repositório de APT do MySQL com seu próprio pacote usando o mesmo comando (veja Substituir a Distribuição Nativa por uma Atualização de APT para mais detalhes).

Após a atualização do MySQL usando o repositório APT, os aplicativos compilados com versões mais antigas das bibliotecas de clientes compartilhados devem continuar a funcionar.

- Se você recompilar aplicativos e ligá-los dinamicamente com as bibliotecas atualizadas:\* como é típico com novas versões de bibliotecas compartilhadas, quaisquer aplicativos compilados usando as bibliotecas compartilhadas atualizadas e mais recentes podem exigir essas bibliotecas atualizadas em sistemas onde os aplicativos são implantados. Se essas bibliotecas não estiverem no lugar, os aplicativos que exigem as bibliotecas compartilhadas podem falhar. Portanto, é recomendado que os pacotes para as bibliotecas compartilhadas do MySQL sejam implantados nesses sistemas. Você pode fazer isso adicionando o repositório MySQL APT aos sistemas (veja Adicionar o Repositório MySQL A) e instalando as bibliotecas compartilhadas mais recentes do cliente usando o comando dado no início desta seção.

#### Instalação do cluster NDB do MySQL usando o repositório APT

::: info Notes

- O repositório MySQL APT suporta a instalação do MySQL NDB Cluster em sistemas Debian e Ubuntu.
- Se você já tiver o servidor MySQL ou o MySQL NDB Cluster instalado no seu sistema, certifique-se de que ele está parado e que você tenha seus dados e arquivos de configuração backup antes de prosseguir.

:::

1. ##### Adicionando o Repositório APT do MySQL para o Cluster NDB do MySQL

   Seguir os passos em Adicionar o Repositório Apt MySQL para adicionar o repositório APT MySQL à lista de repositórios do seu sistema. Durante o processo de instalação do pacote de configuração, quando você for perguntado qual produto MySQL você deseja configurar, escolha MySQL Server & Cluster; quando perguntado qual versão você deseja receber, escolha mysql-cluster-`x`. `y`. Depois de retornar ao prompt de comando, vá para a Etapa 2 abaixo.

   Se você já tiver o pacote de configuração instalado no seu sistema, verifique se ele está atualizado executando o seguinte comando:

   ```
   $> sudo apt-get install mysql-apt-config
   ```

   Em seguida, use o mesmo método descrito em Seleção de uma versão de lançamento principal para selecionar o MySQL NDB Cluster para instalação. Quando for solicitado qual produto do MySQL você deseja configurar, escolha MySQL Server & Cluster; quando for solicitado qual versão você deseja receber, escolha mysql-cluster-`x`. `y`. Depois de retornar ao prompt de comando, atualize as informações do pacote do repositório MySQL APT com este comando:

   ```
   $> sudo apt-get update
   ```
2. ##### Instalação do MySQL NDB Cluster

   Para uma instalação mínima do MySQL NDB Cluster, siga estas etapas:

   - Instalar os componentes para os nós SQL:

     ```
     $> sudo apt-get install mysql-cluster-community-server
     ```

     Você será solicitado a fornecer uma senha para o usuário raiz para o seu nó SQL; veja informações importantes sobre a senha raiz fornecida em Instalar MySQL com APT acima. Você também pode ser perguntado outras perguntas sobre a instalação.
   - Instalar os executáveis para os nós de gestão:

     ```
     $> sudo apt-get install mysql-cluster-community-management-server
     ```
   - Instalar os executáveis para os nós de dados:

     ```
     $> sudo apt-get install mysql-cluster-community-data-node
     ```
3. ##### Configurar e iniciar o cluster MySQL NDB

   Veja a Seção 25.3.3, "Configuração Inicial do Cluster NDB" sobre como configurar o Cluster NDB do MySQL e a Seção 25.3.4, "Início Inicial do Cluster NDB" sobre como iniciá-lo pela primeira vez. Ao seguir essas instruções, ajuste-as de acordo com os seguintes detalhes sobre os nós SQL da sua instalação do Cluster NDB:

   - Todos os arquivos de configuração (como `my.cnf`) estão em `/etc/mysql`
   - Todos os binários, bibliotecas, cabeçalhos, etc., estão em `/usr/bin` e `/usr/sbin`
   - O diretório de dados é `/var/lib/mysql`

##### Instalação de produtos e componentes de cluster NDB MySQL adicionais

Você pode usar o APT para instalar componentes individuais e produtos adicionais do MySQL NDB Cluster a partir do repositório do MySQL APT. Para fazer isso, supondo que você já tenha o repositório do MySQL APT na lista de repositórios do seu sistema (consulte Adicionar o Repositório do MySQL Apt para o MySQL NDB Cluster), siga as mesmas etapas dadas em Instalar Produtos e Componentes Adicionais do MySQL com o APT.

::: info Note

*Problema conhecido:* Atualmente, nem todos os componentes necessários para executar o conjunto de testes do MySQL NDB Cluster são instalados automaticamente quando você instala o pacote de testes (`mysql-cluster-community-test`). Instale os seguintes pacotes com **apt-get install** antes de executar o conjunto de testes:

- `mysql-cluster-community-auto-installer`
- `mysql-cluster-community-management-server`
- `mysql-cluster-community-data-node`
- `mysql-cluster-community-memcached`
- `mysql-cluster-community-java`
- `ndbclient-dev`

:::

#### Apêndice A: Adição e configuração do repositório APT do MySQL manualmente

Aqui estão os passos para adicionar manualmente o repositório MySQL APT à lista de repositórios de software do seu sistema e configurá-lo, sem usar os pacotes de lançamento fornecidos pelo MySQL:

- Descarregue a chave pública GPG do MySQL (consulte a Seção 2.1.4.2, "Controlo de assinatura usando GnuPG" sobre como fazer isso) e salve-a em um arquivo, sem adicionar espaços ou caracteres especiais.

  ```
  $> sudo apt-key add path/to/signature-file
  ```

- Alternativamente, você pode baixar a chave GPG para o seu keyring APT diretamente usando o utilitário apt-key:

  ```
  $> sudo apt-key adv --keyserver pgp.mit.edu --recv-keys A8D3785C
  ```

  ::: info Note

  O KeyID para o MySQL 8.0.36 e versões posteriores é `A8D3785C`, como mostrado acima. Para versões anteriores do MySQL, o keyID é `3A79BD29`.

  :::

- Crie um arquivo chamado `/etc/apt/sources.list.d/mysql.list`, e coloque nele as entradas do repositório no seguinte formato (este não é um comando para executar):

  ```
  deb http://repo.mysql.com/apt/{debian|ubuntu}/ {bookworm|jammy} {mysql-tools|mysql-8.4-lts|mysql-8.0}
  ```

  Escolha as opções relevantes para a configuração do repositório:

  - Escolha debian ou ubuntu de acordo com a sua plataforma.

  - Escolha o nome de versão apropriado para a versão do seu sistema; exemplos incluem bookworm (para Debian 12) e jammy (para Ubuntu 22.04).

  - Para instalar o servidor MySQL, o cliente e os arquivos comuns de banco de dados, escolha mysql-8.4, mysql-8.0 ou mysql-innovation de acordo com a série MySQL que você deseja. Para mudar para outra série de lançamento mais tarde, volte e ajuste a entrada com sua nova escolha. Isso também inclui acesso a ferramentas como MySQL Router e MySQL Shell.

    ::: info Note

    Se você já tem uma versão do MySQL instalada em seu sistema, não escolha uma versão inferior nesta etapa, ou pode resultar em uma operação de atualização não suportada.

    :::

  - Incluir mysql-tools para instalar um conector.

  Por exemplo, na plataforma Ubuntu 22.04 use essas linhas em seus arquivos `mysql.list` para instalar o MySQL 8.4 e os mais recentes Conectores MySQL do repositório MySQL APT:

  ```
  deb http://repo.mysql.com/apt/ubuntu/ jammy mysql-8.4 mysql-tools
  ```

- Use o seguinte comando para obter as informações mais atualizadas sobre o pacote do repositório APT do MySQL:

  ```
  $> sudo apt-get update
  ```

Você configurou seu sistema para usar o repositório MySQL APT e agora está pronto para continuar com a Instalação do MySQL com APT ou Instalação de Produtos e Componentes Adicionais do MySQL com APT.
