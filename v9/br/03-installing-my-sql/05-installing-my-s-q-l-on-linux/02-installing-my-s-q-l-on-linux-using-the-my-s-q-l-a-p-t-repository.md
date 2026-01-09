### 2.5.2 Instalando o MySQL no Linux Usando o Repositório APT do MySQL

Esta seção fornece orientações sobre como instalar o MySQL usando o repositório APT do MySQL.

#### Passos para uma Instalação Nova do MySQL

Observação

As instruções a seguir assumem que nenhuma versão do MySQL (distribuída pela Oracle ou por outras partes) já foi instalada no seu sistema; se não for esse o caso, siga as instruções fornecidas em Substituindo uma Distribuição Native do MySQL Usando o Repositório APT do MySQL ou Substituindo um Servidor MySQL Instalado por um Download Direto de um Pacote DEB.

**Adicionando o Repositório APT do MySQL.** Primeiro, adicione o repositório APT do MySQL à lista de repositórios de software do seu sistema. Siga estes passos:

1. Vá para a página de download do repositório APT do MySQL em <https://dev.mysql.com/downloads/repo/apt/>.

2. Selecione e baixe o pacote de lançamento para a sua distribuição Linux.

Embora isso não seja necessário para cada atualização, ele atualiza as informações do repositório do MySQL para incluir as informações atuais, o que inclui a adição de uma nova série LTS.

3. Instale o pacote de lançamento baixado com o seguinte comando, substituindo *`version-specific-package-name`* pelo nome do pacote baixado (previamente pelo seu caminho, se você não estiver executando o comando dentro da pasta onde o pacote está):

   ```
   $> sudo dpkg -i /PATH/version-specific-package-name.deb
   ```

   Por exemplo, para a versão *`w.x.y-z`* do pacote, o comando é:

   ```
   $> sudo dpkg -i mysql-apt-config_w.x.y-z_all.deb
   ```

   Observe que o mesmo pacote funciona em todas as plataformas Debian e Ubuntu suportadas.

4. Durante a instalação do pacote, você será solicitado a escolher as versões do servidor MySQL e outros componentes (por exemplo, o MySQL Workbench) que deseja instalar. Se você não tiver certeza de qual versão escolher, não altere as opções padrão selecionadas para você. Você também pode escolher "Nenhuma" se não quiser que um componente específico seja instalado. Após fazer as escolhas para todos os componentes, escolha "Ok" para finalizar a configuração e a instalação do pacote de lançamento.

   Nota

   A trilha de inovação, que inclui o MySQL 9.5, contém "-innovation-" no nome do componente.

   Você sempre pode alterar suas escolhas para as versões mais tarde; consulte Selecionando uma versão de lançamento principal para obter instruções.

5. Atualize as informações do pacote do repositório MySQL APT com o seguinte comando (*este passo é obrigatório*):

   ```
   $> sudo apt-get update
   ```

Em vez de usar o pacote de lançamento, você também pode adicionar e configurar o repositório MySQL APT manualmente; consulte Apêndice A: Adicionando e Configurando o Repositório MySQL APT Manualmente para obter detalhes.

Nota

Uma vez que o repositório MySQL APT seja habilitado no seu sistema, você não poderá mais instalar quaisquer pacotes MySQL dos repositórios de software nativos da sua plataforma até que o repositório MySQL APT seja desabilitado.

Nota

Uma vez que o repositório MySQL APT seja habilitado no seu sistema, qualquer atualização em nível de sistema pelo comando **apt-get upgrade** atualizará automaticamente os pacotes MySQL no seu sistema e também substituirá quaisquer pacotes MySQL nativos que você instalou do repositório de software da sua distribuição Linux, se o APT encontrar substitutos para eles dentro do repositório MySQL APT.

#### Selecionando uma Versão de Lançamento Principal

Por padrão, todas as instalações e atualizações para o seu servidor MySQL e outros componentes necessários vêm da série de lançamento da versão principal que você selecionou durante a instalação do pacote de configuração (veja Adicionando o repositório MySQL Apt). No entanto, você pode alternar para outra série de lançamento principal suportada a qualquer momento, reconfigurando o pacote de configuração que você instalou. Use o seguinte comando:

```
$> sudo dpkg-reconfigure mysql-apt-config
```

Uma caixa de diálogo então pedirá que você escolha a versão da série de lançamento principal que deseja. Faça sua seleção e escolha Ok. Após retornar à linha de comando, atualize as informações do pacote do repositório MySQL APT com este comando:

```
$> sudo apt-get update
```

A versão mais recente na série selecionada será então instalada quando você usar o comando **apt-get install** da próxima vez.

Você pode usar o mesmo método para alterar a versão para qualquer outro componente MySQL que você deseja instalar com o repositório MySQL APT.

#### Instalando o MySQL com o APT

Instale o MySQL pelo seguinte comando:

```
$> sudo apt-get install mysql-server
```

Isso instala o pacote para o servidor MySQL, bem como os pacotes para o cliente e para os arquivos comuns do banco de dados.

Durante a instalação, você será solicitado a fornecer uma senha para o usuário root da sua instalação do MySQL.

Importante

Certifique-se de lembrar a senha do root que você definiu. Usuários que desejam definir uma senha mais tarde podem deixar o campo de senha em branco na caixa de diálogo e apenas pressionar Ok; nesse caso, o acesso root ao servidor será autenticado pela Seção 8.4.1.10, “Socket Peer-Credential Pluggable Authentication” para conexões usando um arquivo de socket Unix. Você pode definir a senha do root mais tarde usando o programa **mysql_secure_installation**.

#### Iniciando e Parando o Servidor MySQL

O servidor MySQL é iniciado automaticamente após a instalação. Você pode verificar o status do servidor MySQL com o seguinte comando:

```
$> systemctl status mysql
```

Se o sistema operacional estiver habilitado para systemd, os comandos padrão **systemctl** (ou, como alternativa, **service** com os argumentos invertidos) como **stop**, **start**, **status** e **restart** devem ser usados para gerenciar o serviço do servidor MySQL. O serviço `mysql` está habilitado por padrão e é iniciado ao reiniciar o sistema. Consulte a Seção 2.5.9, “Gerenciando o Servidor MySQL com systemd” para obter informações adicionais.

Observação

Alguns pacotes nativos de repositório de terceiros que dependem dos pacotes nativos MySQL podem não funcionar com os pacotes de repositório MySQL APT e não devem ser usados junto com eles; esses incluem akonadi-backend-mysql, handlersocket-mysql-5.5 e zoneminder.

#### Instalando Produtos e Componentes Adicionais do MySQL com o APT

Você pode usar o APT para instalar componentes individuais do MySQL a partir do repositório MySQL APT. Supondo que você já tenha o repositório MySQL APT na lista de repositórios do seu sistema (consulte Adicionando o repositório MySQL Apt para obter instruções), primeiro, use o seguinte comando para obter as informações do pacote mais recentes do repositório MySQL APT:

```
$> sudo apt-get update
```

Instale os pacotes que você escolher com o seguinte comando, substituindo *`package-name`* pelo nome do pacote a ser instalado:

```
$> sudo apt-get install package-name
```

Para instalar as bibliotecas de cliente compartilhadas:

```
$> sudo apt-get install libmysqlclient21
```

#### Instalando o MySQL a partir da Fonte com o Repositório MySQL APT

Observação

Esta funcionalidade é suportada apenas em sistemas de 64 bits.

Você pode baixar o código-fonte do MySQL e compilar usando o Repositório MySQL APT:

1. Adicione o repositório MySQL APT à lista de repositórios do seu sistema e escolha a série de versões principais que deseja (consulte Adicionando o repositório MySQL APT para obter instruções).

2. Atualize as informações dos pacotes do repositório MySQL APT com o seguinte comando (*este passo é obrigatório*):

   ```
   $> sudo apt-get update
   ```

3. Instale os pacotes que o processo de compilação depende:

   ```
   $> sudo apt-get build-dep mysql-server
   ```

4. Baixe o código-fonte dos principais componentes do MySQL e, em seguida, compile-os (execute este comando na pasta onde você deseja que os arquivos baixados e as compilações estejam localizados):

   ```
   $> apt-get source -b mysql-server
   ```

   Pacotes `deb` para a instalação dos vários componentes do MySQL são criados.

5. Escolha os pacotes `deb` para os componentes do MySQL que você precisa e instale-os com o comando:

   ```
   $> sudo dpkg -i package-name.deb
   ```

   Observe que existem relações de dependência entre os pacotes do MySQL. Para uma instalação básica do servidor MySQL, instale o pacote de arquivos comuns do banco de dados, o pacote cliente, o metapacote do cliente, o pacote do servidor e o metapacote do servidor (naquela ordem) com os seguintes passos:

   * Preconfigure o pacote do servidor MySQL com o seguinte comando:

     ```
     $> sudo dpkg-preconfigure mysql-community-server_version-and-platform-specific-part.deb
     ```

     Você será solicitado a fornecer uma senha para o usuário root para a instalação do MySQL; consulte informações importantes sobre a senha do root fornecidas em Instalar o MySQL com APT acima. Você também pode ser solicitado outras perguntas sobre a instalação.

   * Instale os pacotes necessários com um único comando:

     ```
     $> sudo dpkg -i mysql-{common,community-client,client,community-server,server}_*.deb
     ```

   * Se você for avisado de dependências não atendidas pelo **dpkg**, você pode corrigi-las usando **apt-get**:

     ```
     sudo apt-get -f install
     ```

   Aqui estão os locais onde os arquivos são instalados no sistema:

   * Todos os arquivos de configuração (como `my.cnf`) estão em `/etc/mysql`

* Todos os binários, bibliotecas, cabeçalhos, etc., estão em `/usr/bin` e `/usr/sbin`

* O diretório de dados está em `/var/lib/mysql`

Veja também as informações fornecidas em Começando e Parando o Servidor MySQL.

#### Atualizando o MySQL com o Repositório MySQL APT

Observações

* Antes de realizar qualquer atualização do MySQL, siga cuidadosamente as instruções no Capítulo 3, *Atualizando o MySQL*. Entre outras instruções discutidas, *é especialmente importante fazer backup do seu banco de dados antes da atualização*.

* As instruções seguintes assumem que o MySQL foi instalado no seu sistema usando o repositório MySQL APT; se esse não for o caso, siga as instruções fornecidas em Substituindo uma Distribuição Native do MySQL Usando o Repositório MySQL APT ou Substituindo um Servidor MySQL Instalado por um Download Direto de Pacote DEB. Além disso, note que você não pode usar o repositório MySQL APT para atualizar uma distribuição do MySQL que você instalou a partir de um repositório de software não nativo (por exemplo, de MariaDB ou Percona).

Use o repositório MySQL APT para realizar uma atualização in-place para sua instalação do MySQL (ou seja, substituindo a versão antiga e, em seguida, executando a nova versão usando os arquivos de dados antigos) seguindo estes passos:

1. Certifique-se de que você já tem o repositório MySQL APT na lista de repositórios do seu sistema (veja Adicionando o Repositório MySQL Apt para obter instruções).

2. Certifique-se de que você tem as informações mais atualizadas do pacote no repositório MySQL APT executando:

   ```
   $> sudo apt-get update
   ```

3. Observe que, por padrão, o repositório MySQL APT atualizará o MySQL para a série de lançamento que você selecionou quando você estava adicionando o repositório MySQL APT ao seu sistema. Se você quiser atualizar para outra série de lançamento, selecione-a seguindo os passos fornecidos em Selecionando uma Versão de Lançamento Principal.

Como regra geral, para fazer uma atualização de uma série de lançamentos para outra, vá para a série seguinte, em vez de pular uma série. Por exemplo, se você está executando atualmente o MySQL 5.7 e deseja atualizar para uma versão mais recente, faça a atualização para o MySQL 8.0 primeiro antes de atualizar para 8.4.

Importante

A atualização local do MySQL não é suportada pelo repositório MySQL APT. Siga as instruções no Capítulo 4, *Atualizando o MySQL*.

4. Atualize o MySQL pelo seguinte comando:

   ```
   $> sudo apt-get install mysql-server
   ```

   O servidor MySQL, o cliente e os arquivos comuns do banco de dados são atualizados se versões mais recentes estiverem disponíveis. Para atualizar qualquer outro pacote MySQL, use o mesmo comando **apt-get install** e forneça o nome do pacote que você deseja atualizar:

   ```
   $> sudo apt-get install package-name
   ```

   Para ver os nomes dos pacotes que você instalou do repositório MySQL APT, use o seguinte comando:

   ```
   $> dpkg -l | grep mysql | grep ii
   ```

   Observação

   Se você realizar uma atualização em todo o sistema usando **apt-get upgrade**, apenas a biblioteca MySQL e os pacotes de desenvolvimento são atualizados com versões mais recentes (se disponíveis). Para atualizar outros componentes, incluindo o servidor, cliente, conjunto de testes, etc., use o comando **apt-get install**.

5. O servidor MySQL sempre reinicia após uma atualização pelo APT.

#### Substituindo uma Distribuição Native do MySQL Usando o Repositório MySQL APT

Variantes e forks do MySQL são distribuídos por diferentes partes através de seus próprios repositórios de software ou sites de download. Você pode substituir uma distribuição nativa do MySQL instalada do repositório de software da sua plataforma Linux com uma distribuição do repositório MySQL APT em alguns passos.

Nota

O repositório MySQL APT só pode substituir distribuições do MySQL mantidas e distribuídas pelo Debian ou Ubuntu. Ele não pode substituir quaisquer forks do MySQL encontrados dentro ou fora dos repositórios nativos das distribuições. Para substituir esses forks do MySQL, você deve primeiro desinstalá-los antes de instalar o MySQL usando o repositório MySQL APT. Siga as instruções para desinstalação dos distribuidores dos forks e, antes de prosseguir, certifique-se de fazer backup dos seus dados e saber como restaurá-los em um novo servidor.

Aviso

Alguns pacotes de repositórios nativos de terceiros que dependem dos pacotes nativos do MySQL podem não funcionar com os pacotes do repositório MySQL APT e não devem ser usados junto com eles; esses incluem akonadi-backend-mysql, handlersocket-mysql-5.5 e zoneminder.

1. ##### Fazendo Backup do Seu Banco de Dados

   Para evitar a perda de dados, sempre faça backup do seu banco de dados antes de tentar substituir sua instalação do MySQL usando o repositório MySQL APT. Veja o Capítulo 9, *Backup e Recuperação* para instruções.

2. ##### Adicionando o Repositório MySQL APT e Selecionando uma Série de Lançamento

   Adicione o repositório MySQL APT à lista de repositórios do seu sistema e selecione a série de lançamento que deseja seguindo as instruções dadas em Adicionando o Repositório MySQL Apt.

3. ##### Substituindo a Distribuição Nativa por uma Atualização do APT

   Por design, o repositório MySQL APT substitui sua distribuição nativa do MySQL quando você realiza atualizações nos pacotes do MySQL. Para realizar as atualizações, siga as mesmas instruções dadas no Passo 4 em Atualizando o MySQL com o Repositório MySQL APT.

Aviso

Uma vez que a distribuição nativa do MySQL tenha sido substituída usando o repositório MySQL APT, a purga dos antigos pacotes MySQL do repositório nativo usando os comandos **apt-get purge**, **apt-get remove --purge** ou **dpkg -P** pode afetar o novo servidor MySQL de várias maneiras. Portanto, *não purgue os antigos pacotes MySQL do repositório nativo*.

#### Substituindo um Servidor MySQL Instalado por um Download Direto de Pacote DEB

Os pacotes `deb` do MySQL para instalar o servidor MySQL e seus componentes podem ser baixados da página de download do MySQL Developer Zone ([MySQL Developer Zone's MySQL Download page](https://dev.mysql.com/downloads/)) ou do repositório MySQL APT. Os pacotes `deb` das duas fontes são diferentes e instalam e configuram o MySQL de maneiras distintas.

Se você instalou o MySQL com os pacotes `deb` da MySQL Developer Zone e agora deseja substituir a instalação usando os da MySQL APT, siga estes passos:

1. Faça backup de sua base de dados. Consulte o Capítulo 9, *Backup e Recuperação* para instruções.

2. Siga os passos dados anteriormente para adicionar o repositório MySQL APT.

3. Remova a instalação antiga do MySQL executando:

   ```
   $> sudo dpkg -P mysql
   ```

4. Instale o MySQL a partir do repositório MySQL APT:

   ```
   $> sudo apt-get install mysql-server
   ```

5. Se necessário, restaure os dados na nova instalação do MySQL. Consulte o Capítulo 9, *Backup e Recuperação* para instruções.

##### Removendo o MySQL com o APT

Para desinstalar o servidor MySQL e os componentes relacionados que foram instalados usando o repositório MySQL APT, primeiro, remova o servidor MySQL usando o seguinte comando:

```
$> sudo apt-get remove mysql-server
```

Em seguida, remova qualquer outro software que foi instalado automaticamente com o servidor MySQL:

```
$> sudo apt-get autoremove
```

Para desinstalar outros componentes, use o seguinte comando, substituindo **`package-name`** pelo nome do pacote do componente que você deseja remover:

```
$> sudo apt-get remove package-name
```

Para ver uma lista dos pacotes instalados a partir do repositório MySQL APT, use o seguinte comando:

```
$> dpkg -l | grep mysql | grep ii
```

##### Notas Especiais sobre a Atualização das Bibliotecas de Cliente Compartilhadas

Você pode instalar as bibliotecas de cliente compartilhadas a partir do repositório MySQL APT usando o seguinte comando (consulte Instalar Produtos e Componentes MySQL Adicionais com o APT para mais detalhes):

```
$> sudo apt-get install libmysqlclient21
```

Se você já tiver as bibliotecas de cliente compartilhadas instaladas a partir do repositório de software da sua plataforma Linux, elas podem ser atualizadas pelo repositório MySQL APT com seu próprio pacote usando o mesmo comando (consulte Substituir a Distribuição Native por uma Atualização do APT para mais detalhes).

Após atualizar o MySQL usando o repositório APT, as aplicações compiladas com versões mais antigas das bibliotecas de cliente compartilhadas devem continuar funcionando.

*Se você recompilar as aplicações e vinculá-las dinamicamente com as bibliotecas compartilhadas atualizadas:* como é típico com novas versões de bibliotecas compartilhadas, quaisquer aplicações compiladas usando as bibliotecas compartilhadas mais recentes e atualizadas podem exigir essas bibliotecas atualizadas em sistemas onde as aplicações estão implantadas. Se essas bibliotecas não estiverem disponíveis, as aplicações que requerem as bibliotecas compartilhadas podem falhar. Portanto, é recomendável que os pacotes das bibliotecas compartilhadas do MySQL sejam implantados nesses sistemas. Você pode fazer isso adicionando o repositório MySQL APT aos sistemas (consulte Adicionar o Repositório Apt MySQL) e instalando as bibliotecas de cliente compartilhadas mais recentes usando o comando fornecido no início desta seção.

#### Instalação do MySQL NDB Cluster Usando o Repositório APT

Notas

* O repositório MySQL APT suporta a instalação do MySQL NDB Cluster no Debian e no Ubuntu. Para métodos de instalação do NDB Cluster em outros sistemas baseados no Debian, consulte Instalar o NDB Cluster Usando Arquivos .deb.

* Se você já tiver o servidor MySQL ou o MySQL NDB Cluster instalado no seu sistema, certifique-se de que ele esteja parado e que você tenha feito backup dos seus arquivos de dados e de configuração antes de prosseguir.

1. ##### Adicionando o Repositório MySQL APT para MySQL NDB Cluster

   Siga os passos na Adicionando o Repositório MySQL Apt para adicionar o repositório MySQL APT à lista de repositórios do seu sistema. Durante o processo de instalação do pacote de configuração, quando você for perguntado qual produto MySQL deseja configurar, escolha “MySQL Server & Cluster”; quando perguntado qual versão deseja receber, escolha “mysql-cluster-*`x`*.*`y`*.” Após retornar à linha de comando, vá para o Passo 2 abaixo.

   Se você já tiver o pacote de configuração instalado no seu sistema, certifique-se de que ele esteja atualizado executando o seguinte comando:

   ```
   $> sudo apt-get install mysql-apt-config
   ```

   Em seguida, use o mesmo método descrito na Selecionando uma Versão de Lançamento Principal para selecionar o MySQL NDB Cluster para instalação. Quando for perguntado qual produto MySQL deseja configurar, escolha “MySQL Server & Cluster”; quando for perguntado qual versão deseja receber, escolha “mysql-cluster-*`x`*.*`y`*.” Após retornar à linha de comando, atualize as informações do pacote do repositório MySQL APT com este comando:

   ```
   $> sudo apt-get update
   ```

2. ##### Instalando o MySQL NDB Cluster

   Para uma instalação mínima do MySQL NDB Cluster, siga estes passos:

   * Instale os componentes para nós SQL:

     ```
     $> sudo apt-get install mysql-cluster-community-server
     ```

Você será solicitado a fornecer uma senha para o usuário root do seu nó SQL; consulte informações importantes sobre a senha do root fornecidas na seção Instalação do MySQL com APT acima. Você também pode ser solicitado outras perguntas sobre a instalação.

* Instale os executáveis para os nós de gerenciamento:

     ```
     $> sudo apt-get install mysql-cluster-community-management-server
     ```

* Instale os executáveis para os nós de dados:

     ```
     $> sudo apt-get install mysql-cluster-community-data-node
     ```

3. ##### Configuração e Inicialização do MySQL NDB Cluster

Consulte a Seção 25.3.3, “Configuração Inicial do NDB Cluster”, sobre como configurar o MySQL NDB Cluster e a Seção 25.3.4, “Inicialização Inicial do NDB Cluster”, sobre como iniciá-lo pela primeira vez. Ao seguir essas instruções, ajuste-as de acordo com os seguintes detalhes sobre os nós SQL da sua instalação do NDB Cluster:

* Todos os arquivos de configuração (como `my.cnf`) estão em `/etc/mysql`

* Todos os binários, bibliotecas, cabeçalhos, etc., estão em `/usr/bin` e `/usr/sbin`

* O diretório de dados está em `/var/lib/mysql`

##### Instalação de Produtos e Componentes Adicionais do MySQL NDB Cluster

Você pode usar o APT para instalar componentes individuais e produtos adicionais do MySQL NDB Cluster a partir do repositório do MySQL APT. Para fazer isso, assumindo que você já tem o repositório do MySQL APT na lista de repositórios do seu sistema (consulte Adicionar o Repositório do APT do MySQL para o MySQL NDB Cluster), siga os mesmos passos fornecidos na seção Instalação de Produtos e Componentes Adicionais do MySQL com o APT.

Nota

*Problema conhecido:* Atualmente, nem todos os componentes necessários para executar a suíte de testes do MySQL NDB Cluster são instalados automaticamente quando você instala o pacote da suíte de testes (`mysql-cluster-community-test`). Instale os seguintes pacotes com **apt-get install** antes de executar a suíte de testes:

* `mysql-cluster-community-auto-installer`
* `mysql-cluster-community-management-server`
* `mysql-cluster-community-data-node`
* `mysql-cluster-community-memcached`
* `mysql-cluster-community-java`
* `ndbclient-dev`

#### Apêndice A: Adicionando e Configurando o Repositório MySQL APT Manualmente

Aqui estão os passos para adicionar manualmente o repositório MySQL APT à lista de repositórios de software do seu sistema e configurá-lo, sem usar os pacotes de lançamento fornecidos pelo MySQL:

* Faça o download da chave pública GPG do MySQL (veja a Seção 2.1.4.2, “Verificação de Assinatura Usando GnuPG” sobre como fazer isso) e salve-a em um arquivo, sem adicionar espaços ou caracteres especiais. Em seguida, adicione a chave ao grupo de chaves GPG do seu sistema com o seguinte comando:

  ```
  $> sudo apt-key add path/to/signature-file
  ```

* Alternativamente, você pode fazer o download da chave GPG para o seu grupo de chaves APT diretamente usando o utilitário apt-key:

  ```
  $> sudo apt-key adv --keyserver pgp.mit.edu --recv-keys A8D3785C
  ```

  Observação

  O ID da chave para os pacotes de lançamento MySQL 8.0.36 e versões posteriores é `A8D3785C`, conforme mostrado acima. Para versões anteriores do MySQL, o ID da chave é `3A79BD29`. Usar uma chave incorreta pode causar um erro de verificação de chave.

* Crie um arquivo chamado `/etc/apt/sources.list.d/mysql.list` e coloque nele as entradas de repositório no seguinte formato (este não é um comando a ser executado):

  ```
  deb http://repo.mysql.com/apt/{debian|ubuntu}/ {bookworm|jammy} {mysql-tools|mysql-8.4-lts|mysql-8.0}
  ```

  Escolha as opções relevantes para o seu conjunto de repositórios configurado:

  + Escolha “debian” ou “ubuntu” de acordo com sua plataforma.

  + Escolha o nome da versão apropriado para a versão do seu sistema; exemplos incluem “bookworm” (para Debian 12) e “jammy” (para Ubuntu 22.04).

+ Para instalar o servidor MySQL, o cliente e os arquivos comuns do banco de dados, escolha “mysql-8.4”, “mysql-8.0” ou “mysql-innovation” (para o MySQL 9.5), de acordo com a série do MySQL que você deseja. Para mudar para outra série de lançamento mais tarde, volte e ajuste a entrada com sua nova escolha. Isso também inclui o acesso a ferramentas como o MySQL Router e o MySQL Shell.

    Nota

    Se você já tiver uma versão do MySQL instalada no seu sistema, não escolha uma versão inferior nesta etapa, pois isso pode resultar em uma operação de downgrade não suportada.

  + Inclua “mysql-tools” para instalar um conector.

  Por exemplo, na plataforma Ubuntu 22.04, use essas linhas em seus arquivos `mysql.list` para instalar o MySQL 8.4 e os últimos Conectores MySQL do repositório MySQL APT:

  ```
  deb http://repo.mysql.com/apt/ubuntu/ jammy mysql-8.4 mysql-tools
  ```

* Use o seguinte comando para obter as informações mais atualizadas do pacote do repositório MySQL APT:

  ```
  $> sudo apt-get update
  ```

Você configurou seu sistema para usar o repositório MySQL APT e agora está pronto para continuar com a Instalação do MySQL com o APT ou a Instalação de Produtos e Componentes Adicionais do MySQL com o APT.