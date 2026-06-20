## 2.8 Instalando o MySQL a partir de fonte

Construir o MySQL a partir do código-fonte permite que você personalize os parâmetros de compilação, otimizações do compilador e localização de instalação. Para uma lista dos sistemas em que o MySQL é conhecido para funcionar, consulte <https://www.mysql.com/support/supportedplatforms/database.html>.

Antes de prosseguir com uma instalação a partir de fonte, verifique se a Oracle produz uma distribuição binária pré-compilada para sua plataforma e se ela funciona para você. Colocamos um grande esforço em garantir que nossos binários sejam construídos com as melhores opções possíveis para desempenho ótimo. As instruções para instalar distribuições binárias estão disponíveis na Seção 2.2, “Instalando MySQL em Unix/Linux Usando Binários Genericos”.

Se você está interessado em construir o MySQL a partir de uma distribuição de fonte usando opções de compilação as mesmas ou semelhantes às usadas pela Oracle para produzir distribuições binárias na sua plataforma, obtenha uma distribuição binária, desempacote-a e procure no arquivo `docs/INFO_BIN`, que contém informações sobre como essa distribuição do MySQL foi configurada e compilada.

Aviso

Construir o MySQL com opções não padrão pode resultar em redução da funcionalidade, desempenho ou segurança.

### 2.8.1 Métodos de instalação da fonte

Existem dois métodos para instalar o MySQL a partir de fonte:

* Use uma distribuição padrão do MySQL. Para obter uma distribuição padrão, consulte a Seção 2.1.3, “Como obter o MySQL”. Para obter instruções sobre como construir a partir de uma distribuição padrão, consulte a Seção 2.8.4, “Instalando o MySQL usando uma distribuição de fonte padrão”.

As distribuições padrão estão disponíveis como arquivos comprimidos em formato **tar**, arquivos Zip ou pacotes RPM. Os arquivos de distribuição têm nomes na forma de `mysql-VERSION.tar.gz`, `mysql-VERSION.zip` ou `mysql-VERSION.rpm`, onde *`VERSION`* é um número como `5.7.44`. Os nomes dos arquivos das distribuições de fonte podem ser distinguidos dos nomes das distribuições binárias pré-compiladas, pois os nomes das distribuições de fonte são genéricos e não incluem o nome da plataforma, enquanto os nomes das distribuições binárias incluem um nome da plataforma que indica o tipo de sistema para o qual a distribuição é destinada (por exemplo, `pc-linux-i686` ou `winx64`).

* Use uma árvore de desenvolvimento MySQL. Para obter informações sobre a construção a partir de uma das árvores de desenvolvimento, consulte a Seção 2.8.5, “Instalando MySQL usando uma árvore de fonte de desenvolvimento”.

### 2.8.2 Pré-requisitos para a instalação da fonte

A instalação do MySQL a partir de fonte requer várias ferramentas de desenvolvimento. Algumas dessas ferramentas são necessárias, independentemente de você usar uma distribuição de fonte padrão ou uma árvore de fonte de desenvolvimento. Outros requisitos de ferramentas dependem do método de instalação que você usa.

Para instalar o MySQL a partir de fonte, os seguintes requisitos do sistema devem ser atendidos, independentemente do método de instalação:

* **CMake**, que é usado como o framework de construção em todas as plataformas. **CMake** pode ser baixado de <http://www.cmake.org>.

* Um bom programa de **make**. Embora algumas plataformas venham com suas próprias implementações de **make**, é altamente recomendável que você use o **make** GNU 3.75 ou posterior. Ele já pode estar disponível em seu sistema como **gmake**. O **make** GNU está disponível em <http://www.gnu.org/software/make/>.

Em sistemas semelhantes ao Unix, incluindo o Linux, você pode verificar a versão do **make** do seu sistema da seguinte forma:

  ```sql
  $> make --version
  GNU Make 4.2.1
  ```

* Um compilador ANSI C++ funcional. Consulte a descrição da opção `FORCE_UNSUPPORTED_COMPILER` para obter algumas orientações.

* Uma biblioteca SSL é necessária para o suporte de conexões criptografadas, entropia para geração de números aleatórios e outras operações relacionadas à criptografia. Por padrão, a compilação usa a biblioteca OpenSSL instalada no sistema do host. Para especificar explicitamente a biblioteca, use a opção `WITH_SSL` ao invocar o **CMake**. Para informações adicionais, consulte a Seção 2.8.6, “Configurando o Suporte à Biblioteca SSL”.

* As bibliotecas Boost C++ são necessárias para construir o MySQL (mas não para usá-lo). O Boost 1.59.0 deve ser instalado. Para obter o Boost e suas instruções de instalação, visite o site oficial do Boost [(https://www.boost.org)]. Após o Boost ser instalado, informe ao sistema de construção onde os arquivos do Boost estão localizados de acordo com o valor definido para a opção `WITH_BOOST` ao invocar o CMake. Por exemplo:

  ```sql
  cmake . -DWITH_BOOST=/usr/local/boost_version_number
  ```

Ajuste o caminho conforme necessário para corresponder à sua instalação.

* A biblioteca [ncurses][(https://www.gnu.org/software/ncurses/ncurses.html)].

* Memória livre suficiente. Se você encontrar erros de compilação, como erro interno do compilador, ao compilar arquivos de código-fonte grandes, pode ser que você tenha memória insuficiente. Se estiver compilando em uma máquina virtual, tente aumentar a alocação de memória.

* O Perl é necessário se você pretende executar scripts de teste. A maioria dos sistemas semelhantes ao Unix inclui Perl. Para o Windows, você pode usar [ActiveState Perl][(https://www.activestate.com/products/perl/)]. ou [Strawberry Perl][(https://strawberryperl.com/)].

Para instalar o MySQL a partir de uma distribuição padrão, é necessário um dos seguintes programas para descompactuar o arquivo da distribuição:

* Para um arquivo **tar** compactado `.tar.gz`: GNU `gunzip` para descompactação da distribuição e um **tar** razoável para desempacotamento. Se o seu programa **tar** suportar a opção `z`, ele pode descompactuar e desempacotar o arquivo.

O GNU **tar** é conhecido por funcionar. O **tar** padrão fornecido por alguns sistemas operacionais não é capaz de desempacotar os nomes de arquivo longos da distribuição MySQL. Você deve baixar e instalar o GNU **tar**, ou, se disponível, usar uma versão pré-instalada do GNU tar. Geralmente, isso está disponível como **gnutar**, **gtar**, ou como **tar** dentro de um diretório de software GNU ou Livre, como `/usr/sfw/bin` ou `/usr/local/bin`. O GNU **tar** está disponível em <https://www.gnu.org/software/tar/>.

* Para um arquivo Zip `.zip`: **WinZip** ou outra ferramenta que possa ler arquivos `.zip`.

* Para um pacote RPM `.rpm`: O programa **rpmbuild**, usado para construir a distribuição, o desfaz.

Para instalar o MySQL a partir de uma árvore de fonte de desenvolvimento, são necessários os seguintes recursos adicionais:

* O sistema de controle de revisão Git é necessário para obter o código-fonte de desenvolvimento. [GitHub Help][(https://help.github.com/)] fornece instruções para baixar e instalar o Git em diferentes plataformas.

* **bison** 2.1 ou posterior, disponível em <http://www.gnu.org/software/bison/>. (A versão 1 não é mais suportada.) Use a versão mais recente do **bison** sempre que possível; se você tiver problemas, atualize para uma versão posterior, em vez de reverter para uma versão anterior.

**bison** está disponível em <http://www.gnu.org/software/bison/>. `bison` para Windows pode ser baixado em <http://gnuwin32.sourceforge.net/packages/bison.htm>. Faça o download do pacote rotulado “Pacote completo, excluindo fontes”. Em Windows, a localização padrão para **bison** é o diretório `C:\Program Files\GnuWin32`. Algumas utilidades podem não encontrar **bison** devido ao espaço no nome do diretório. Além disso, o Visual Studio pode simplesmente ficar parado se houver espaços no caminho. Você pode resolver esses problemas instalando em um diretório que não contenha espaço (por exemplo, `C:\GnuWin32`).

* No Solaris Express, o **m4** deve ser instalado em conjunto com o **bison**. O **m4** está disponível em <http://www.gnu.org/software/m4/>.

Nota

Se você tiver que instalar algum programa, modifique a variável de ambiente `PATH` para incluir quaisquer diretórios nos quais os programas estão localizados. Veja a Seção 4.2.7, “Definindo Variáveis de Ambiente”.

Se você encontrar problemas e precisar fazer um relatório de erro, use as instruções na Seção 1.5, “Como relatar erros ou problemas”.

### 2.8.3 Layout do MySQL para Instalação de Fonte

Por padrão, quando você instala o MySQL após compilar o código fonte, a etapa de instalação instala os arquivos em `/usr/local/mysql`. Os locais dos componentes sob o diretório de instalação são os mesmos que para as distribuições binárias. Veja a Tabela 2.3, “Estrutura de instalação do MySQL para pacote binário genérico Unix/Linux”, e a Seção 2.3.1, “Estrutura de instalação do MySQL no Microsoft Windows”. Para configurar locais de instalação diferentes dos padrões, use as opções descritas na Seção 2.8.7, “Opções de configuração de fonte do MySQL”.

### 2.8.4 Instalar o MySQL usando uma distribuição de fonte padrão

Para instalar o MySQL a partir de uma distribuição de fonte padrão:

1. Verifique se seu sistema atende aos requisitos da ferramenta listados na Seção 2.8.2, “Pré-requisitos de Instalação da Fonte”.

2. Obtenha um arquivo de distribuição usando as instruções na Seção 2.1.3, “Como obter o MySQL”.

3. Configure, construa e instale a distribuição usando as instruções nesta seção.

4. Realize os procedimentos pós-instalação usando as instruções na Seção 2.9, “Configuração e Teste Pós-Instalação”.

O MySQL utiliza **CMake** como o framework de construção em todas as plataformas. As instruções fornecidas aqui devem permitir que você produza uma instalação funcional. Para informações adicionais sobre o uso do **CMake** para construir o MySQL, consulte Como construir o servidor MySQL com CMake.

Se você começar a partir de um RPM de origem, use o seguinte comando para criar um RPM binário que você pode instalar. Se você não tiver **rpmbuild**, use **rpm** em vez disso.

```sql
$> rpmbuild --rebuild --clean MySQL-VERSION.src.rpm
```

O resultado é um ou mais pacotes RPM binários que você instala conforme indicado na Seção 2.5.5, "Instalando o MySQL no Linux usando pacotes RPM da Oracle".

A sequência para a instalação a partir de uma distribuição de fonte em formato **tar** comprimido ou de um arquivo Zip é semelhante ao processo para a instalação a partir de uma distribuição binária genérica (veja a Seção 2.2, “Instalando o MySQL no Unix/Linux Usando Binários Genéricos”), exceto que é usada em todas as plataformas e inclui etapas para configurar e compilar a distribuição. Por exemplo, com uma distribuição de fonte em formato **tar** comprimido no Unix, a sequência básica de comandos de instalação é a seguinte:

```sql
# Preconfiguration setup
$> groupadd mysql
$> useradd -r -g mysql -s /bin/false mysql
# Beginning of source-build specific instructions
$> tar zxvf mysql-VERSION.tar.gz
$> cd mysql-VERSION
$> mkdir bld
$> cd bld
$> cmake ..
$> make
$> make install
# End of source-build specific instructions
# Postinstallation setup
$> cd /usr/local/mysql
$> mkdir mysql-files
$> chown mysql:mysql mysql-files
$> chmod 750 mysql-files
$> bin/mysqld --initialize --user=mysql
$> bin/mysql_ssl_rsa_setup
$> bin/mysqld_safe --user=mysql &
# Next command is optional
$> cp support-files/mysql.server /etc/init.d/mysql.server
```

Uma versão mais detalhada das instruções específicas para o build de origem é mostrada a seguir.

Nota

O procedimento mostrado aqui não configura nenhuma senha para as contas do MySQL. Após seguir o procedimento, prossiga para a Seção 2.9, “Configuração e Teste Pós-Instalação”, para a configuração e teste pós-instalação.

* Realizar a configuração pré-configurada
* Obter e desempacotar a distribuição
* Configurar a distribuição
* Construir a distribuição
* Instalar a distribuição
* Realizar a configuração pós-instalação

#### Realize a configuração préconfigurada

Em Unix, configure o usuário `mysql` que possui o diretório do banco de dados e que deve ser usado para executar o servidor MySQL, e o grupo ao qual esse usuário pertence. Para obter detalhes, consulte Criar um usuário e um grupo mysql. Em seguida, realize as etapas a seguir como o usuário `mysql`, exceto conforme indicado.

#### Obtenha e desempaquete a distribuição

Escolha o diretório sob o qual você deseja desempacotar a distribuição e altere a localização para ele.

Obtenha um arquivo de distribuição usando as instruções na Seção 2.1.3, “Como obter o MySQL”.

Descompacte a distribuição no diretório atual:

* Para desempacotar um arquivo **tar** comprimido, o **tar** pode descomprimir e desempacotar a distribuição se tiver suporte à opção `z`:

  ```sql
  $> tar zxvf mysql-VERSION.tar.gz
  ```

Se o seu **tar** não tiver suporte à opção `z`, use **gunzip** para descomprimir a distribuição e **tar** para descompac-la:

  ```sql
  $> gunzip < mysql-VERSION.tar.gz | tar xvf -
  ```

Alternativamente, o **CMake** pode descomprimir e desempacotar a distribuição:

  ```sql
  $> cmake -E tar zxvf mysql-VERSION.tar.gz
  ```

* Para descompactar um arquivo Zip, use o **WinZip** ou outra ferramenta que possa ler arquivos `.zip`.

Ao descompactuar o arquivo de distribuição, é criado um diretório denominado `mysql-VERSION`.

#### Configure a Distribuição

Altere a localização para o diretório de nível superior da distribuição desempaquetada:

```sql
$> cd mysql-VERSION
```

Construa fora da árvore de origem para manter a árvore limpa. Se o diretório de origem de nível superior estiver nomeado `mysql-src` sob o diretório de trabalho atual, você pode construir em um diretório nomeado `build` no mesmo nível. Crie o diretório e vá até lá:

```sql
$> mkdir bld
$> cd bld
```

Configure o diretório de compilação. O comando de configuração mínima não inclui opções para sobrescrever os valores padrão de configuração:

```sql
$> cmake ../mysql-src
```

O diretório de construção não precisa estar fora da árvore de origem. Por exemplo, você pode construir em um diretório chamado `build` sob a árvore de origem de nível superior. Para fazer isso, começando com `mysql-src` como seu diretório de trabalho atual, crie o diretório `build` e vá até lá:

```sql
$> mkdir build
$> cd build
```

Configure o diretório de compilação. O comando de configuração mínima não inclui opções para sobrescrever os valores padrão de configuração:

```sql
$> cmake ..
```

Se você tiver várias árvores de origem no mesmo nível (por exemplo, para construir várias versões do MySQL), a segunda estratégia pode ser vantajosa. A primeira estratégia coloca todos os diretórios de compilação no mesmo nível, o que exige que você escolha um nome único para cada um. Com a segunda estratégia, você pode usar o mesmo nome para o diretório de compilação dentro de cada árvore de origem. As instruções a seguir assumem essa segunda estratégia.

Em Windows, especifique o ambiente de desenvolvimento. Por exemplo, os seguintes comandos configuram o MySQL para compilações de 32 bits ou 64 bits, respectivamente:

```sql
$> cmake .. -G "Visual Studio 12 2013"

$> cmake .. -G "Visual Studio 12 2013 Win64"
```

No macOS, para usar o IDE do Xcode:

```sql
$> cmake .. -G Xcode
```

Quando você executa o **Cmake**, talvez queira adicionar opções à string de comando. Aqui estão alguns exemplos:

* `-DBUILD_CONFIG=mysql_release`: Configure a fonte com as mesmas opções de compilação usadas pela Oracle para produzir distribuições binárias para as versões oficiais do MySQL.

* `-DCMAKE_INSTALL_PREFIX=dir_name`: Configure a distribuição para instalação em um local específico.

* `-DCPACK_MONOLITHIC_INSTALL=1`: Faça com que o **make package** gere um único arquivo de instalação em vez de vários arquivos.

* `-DWITH_DEBUG=1`: Construa a distribuição com suporte de depuração.

Para uma lista mais extensa de opções, consulte a Seção 2.8.7, “Opções de configuração de fonte MySQL”.

Para listar as opções de configuração, use um dos seguintes comandos:

```sql
$> cmake .. -L   # overview

$> cmake .. -LH  # overview with help text

$> cmake .. -LAH # all params with help text

$> ccmake ..     # interactive display
```

Se o **CMake** falhar, você pode precisar reconfigurá-lo executando-o novamente com opções diferentes. Se você realmente precisar reconfigurá-lo, tome nota do seguinte:

* Se o **CMake** for executado após ter sido executado anteriormente, ele pode usar informações que foram coletadas durante sua invocação anterior. Essas informações são armazenadas em `CMakeCache.txt`. Quando o **CMake** começa, ele procura esse arquivo e lê seu conteúdo, se existir, assumindo que as informações ainda estão corretas. Essa suposição é inválida quando você reconfigura.

* Toda vez que você executar o **CMake**, você deve executar novamente o **make** para recompilar. No entanto, você pode querer remover os arquivos de objeto antigos das compilações anteriores primeiro, porque eles foram compilados usando opções de configuração diferentes.

Para evitar que arquivos de objeto antigos ou informações de configuração sejam usados, execute esses comandos no diretório de compilação no Unix antes de executar novamente o **CMake**:

```sql
$> make clean
$> rm CMakeCache.txt
```

Ou, no Windows:

```sql
$> devenv MySQL.sln /clean
$> del CMakeCache.txt
```

Antes de fazer uma solicitação no Slack da Comunidade [MySQL][(https://mysqlcommunity.slack.com/)], verifique os arquivos no diretório `CMakeFiles` para obter informações úteis sobre o erro. Para fazer um relatório de erro, use as instruções na Seção 1.5, “Como relatar erros ou problemas”.

#### Construa a Distribuição

Em Unix:

```sql
$> make
$> make VERBOSE=1
```

O segundo comando define `VERBOSE` para mostrar os comandos para cada fonte compilada.

Use **gmake** em vez disso em sistemas onde você está usando o **GNU make** e ele foi instalado como **gmake**.

Em Windows:

```sql
$> devenv MySQL.sln /build RelWithDebInfo
```

Se você chegou à fase de compilação, mas a distribuição não compila, consulte a Seção 2.8.8, “Lidando com problemas de compilação do MySQL”, para obter ajuda. Se isso não resolver o problema, entre em contato com nossa base de bugs usando as instruções fornecidas na Seção 1.5, “Como relatar bugs ou problemas”. Se você instalou as versões mais recentes das ferramentas necessárias e elas falham ao tentar processar nossos arquivos de configuração, informe isso também. No entanto, se você receber um erro `command not found` ou um problema semelhante para as ferramentas necessárias, não o informe. Em vez disso, certifique-se de que todas as ferramentas necessárias estão instaladas e que sua variável `PATH` está definida corretamente para que seu shell as encontre.

#### Instale a Distribuição

Em Unix:

```sql
$> make install
```

Isso instala os arquivos sob o diretório de instalação configurado (por padrão, `/usr/local/mysql`). Você pode precisar executar o comando como `root`.

Para instalar em um diretório específico, adicione um parâmetro `DESTDIR` à string de comando:

```sql
$> make install DESTDIR="/opt/mysql"
```

Alternativamente, você pode gerar arquivos de pacote de instalação que você pode instalar onde quiser:

```sql
$> make package
```

Essa operação produz um ou mais arquivos `.tar.gz` que podem ser instalados como pacotes de distribuição binária genéricos. Veja a Seção 2.2, “Instalando MySQL em Unix/Linux Usando Binários Genéricos”. Se você executar o **CMake** com `-DCPACK_MONOLITHIC_INSTALL=1`, a operação produz um único arquivo. Caso contrário, ela produz vários arquivos.

Em Windows, gere o diretório de dados e, em seguida, crie um pacote de instalação de `.zip`:

```sql
$> devenv MySQL.sln /build RelWithDebInfo /project initial_database
$> devenv MySQL.sln /build RelWithDebInfo /project package
```

Você pode instalar o arquivo resultante `.zip` onde você desejar. Veja a Seção 2.3.4, “Instalando MySQL no Microsoft Windows usando um arquivo ZIP [[`noinstall`] ].

#### Realize o Configuração pós-instalação

O restante do processo de instalação envolve a configuração do arquivo de configuração, a criação dos bancos de dados principais e o início do servidor MySQL. Para instruções, consulte a Seção 2.9, “Configuração e Teste Pós-Instalação”.

Nota

As contas que estão listadas nas tabelas de concessão do MySQL inicialmente não têm senhas. Após iniciar o servidor, você deve configurar senhas para elas usando as instruções na Seção 2.9, "Configuração e Teste Pós-Instalação".

### 2.8.5 Instalar o MySQL usando um diretório de fonte de desenvolvimento

Esta seção descreve como instalar o MySQL a partir do código-fonte de desenvolvimento mais recente, que é hospedado no [GitHub][(https://github.com/)]. Para obter o código-fonte do MySQL Server deste serviço de hospedagem de repositório, você pode configurar um repositório local de Git do MySQL.

Em [GitHub][(https://github.com/)], o MySQL Server e outros projetos do MySQL podem ser encontrados na página [MySQL][(https://github.com/mysql)]. O projeto MySQL Server é um único repositório que contém ramos para várias séries do MySQL.

* Pré-requisitos para instalação a partir de fonte de desenvolvimento
* Configurando um repositório Git MySQL

#### Precedentes para Instalação a partir de Fonte de Desenvolvimento

Para instalar o MySQL a partir de uma árvore de fonte de desenvolvimento, o seu sistema deve satisfazer os requisitos da ferramenta listados na Seção 2.8.2, “Requisitos de Pré-requisitos de Instalação de Fonte”.

#### Configurando um repositório Git do MySQL

Para configurar um repositório Git MySQL na sua máquina:

1. Faça uma cópia do repositório Git do MySQL para sua máquina. O comando a seguir faz uma cópia do repositório Git do MySQL para um diretório chamado `mysql-server`. O download inicial pode levar algum tempo para ser concluído, dependendo da velocidade da sua conexão.

   ```sql
   $> git clone https://github.com/mysql/mysql-server.git
   Cloning into 'mysql-server'...
   remote: Counting objects: 1198513, done.
   remote: Total 1198513 (delta 0), reused 0 (delta 0), pack-reused 1198513
   Receiving objects: 100% (1198513/1198513), 1.01 GiB | 7.44 MiB/s, done.
   Resolving deltas: 100% (993200/993200), done.
   Checking connectivity... done.
   Checking out files: 100% (25510/25510), done.
   ```

2. Quando a operação de clone for concluída, o conteúdo do seu repositório local MySQL Git aparecerá semelhante ao seguinte:

   ```sql
   ~> cd mysql-server
   ~/mysql-server> ls
   client             extra                mysys              storage
   cmake              include              packaging          strings
   CMakeLists.txt     INSTALL              plugin             support-files
   components         libbinlogevents      README             testclients
   config.h.cmake     libchangestreams     router             unittest
   configure.cmake    libmysql             run_doxygen.cmake  utilities
   Docs               libservices          scripts            VERSION
   Doxyfile-ignored   LICENSE              share              vio
   Doxyfile.in        man                  sql                win
   doxygen_resources  mysql-test           sql-common
   ```

3. Use o comando **git branch -r** para visualizar os ramos de rastreamento remoto do repositório MySQL.

   ```sql
   ~/mysql-server> git branch -r
     origin/5.7
     origin/8.0
     origin/HEAD -> origin/trunk
     origin/cluster-7.4
     origin/cluster-7.5
     origin/cluster-7.6
     origin/trunk
   ```

4. Para visualizar o ramo que está verificado em seu repositório local, execute o comando **git branch**. Ao clonar o repositório MySQL Git, o ramo MySQL mais recente é verificado automaticamente. O asterisco identifica o ramo ativo.

   ```sql
   ~/mysql-server$ git branch
   * trunk
   ```

5. Para fazer checkout de um ramo anterior do MySQL, execute o comando **git checkout**, especificando o nome do ramo. Por exemplo, para fazer checkout do ramo MySQL 5.7:

   ```sql
   ~/mysql-server$ git checkout 5.7
   Checking out files: 100% (9600/9600), done.
   Branch 5.7 set up to track remote branch 5.7 from origin.
   Switched to a new branch '5.7'
   ```

6. Para obter as alterações feitas após a configuração inicial do repositório Git do MySQL, mude para o ramo que você deseja atualizar e execute o comando **git pull**:

   ```sql
   ~/mysql-server$ git checkout 8.0
   ~/mysql-server$ git pull
   ```

Para examinar o histórico de commit, use o comando **git log**:

   ```sql
   ~/mysql-server$ git log
   ```

Você também pode navegar pelo histórico de commit e código-fonte no site do GitHub [MySQL][(https://github.com/mysql)].

Se você notar alterações ou código sobre o qual você tem alguma dúvida, pergunte no [Slack da Comunidade MySQL][(https://mysqlcommunity.slack.com/)].

7. Após ter clonado o repositório Git do MySQL e verificado o ramo que você deseja construir, você pode construir o MySQL Server a partir do código-fonte. As instruções estão fornecidas na Seção 2.8.4, “Instalando o MySQL usando uma distribuição de fonte padrão”, exceto que você põe de lado a parte sobre a obtenção e desempacotamento da distribuição.

Tenha cuidado ao instalar uma compilação de uma árvore de fonte de distribuição em uma máquina de produção. O comando de instalação pode sobrescrever a instalação do seu lançamento ao vivo. Se você já tem o MySQL instalado e não quer sobrescrevê-lo, execute o **CMake** com valores para as opções `CMAKE_INSTALL_PREFIX`, `MYSQL_TCP_PORT` e `MYSQL_UNIX_ADDR` diferentes daquelas usadas pelo seu servidor de produção. Para informações adicionais sobre como evitar que vários servidores interfiram uns com os outros, consulte a Seção 5.7, “Executando várias instâncias do MySQL em uma única máquina”.

Jogue bastante com sua nova instalação. Por exemplo, tente fazer com que novos recursos falhem. Comece executando **make test**. Veja a Unidade de Teste MySQL.

### 2.8.6 Configurando o suporte à biblioteca SSL

Uma biblioteca SSL é necessária para o suporte de conexões criptografadas, entropia para geração de números aleatórios e outras operações relacionadas à criptografia. Seu sistema deve suportar o OpenSSL ou o yaSSL:

* Todas as distribuições binárias da Edição Empresarial do MySQL são compiladas usando OpenSSL. Não é possível usar o yaSSL com a Edição Empresarial do MySQL.

* Antes do MySQL 5.7.28, as distribuições binárias da Edição Comunitária do MySQL são compiladas usando yaSSL. A partir do MySQL 5.7.28, o suporte para yaSSL é removido e todas as compilações do MySQL usam OpenSSL.

* Antes do MySQL 5.7.28, as distribuições de código-fonte da Edição Comunitária do MySQL podem ser compiladas usando o OpenSSL ou o yaSSL. A partir do MySQL 5.7.28, o suporte ao yaSSL é removido.

Se você compilar o MySQL a partir de uma distribuição de fonte, o **CMake** configura a distribuição para usar a biblioteca OpenSSL instalada por padrão.

Para compilar usando o OpenSSL, use este procedimento:

1. Certifique-se de que o OpenSSL 1.0.1 ou uma versão mais recente esteja instalada no seu sistema. Se a versão instalada do OpenSSL for mais antiga que 1.0.1, o **CMake** produz um erro no momento da configuração do MySQL. Se for necessário obter o OpenSSL, visite <http://www.openssl.org>.

2. A opção `WITH_SSL` **CMake** determina qual biblioteca SSL deve ser usada para compilar o MySQL (consulte a Seção 2.8.7, “Opções de configuração de fonte do MySQL”). O padrão é `-DWITH_SSL=system`, que usa o OpenSSL. Para tornar isso explícito, especifique essa opção. Por exemplo:

   ```sql
   cmake . -DWITH_SSL=system
   ```

Esse comando configura a distribuição para usar a biblioteca OpenSSL instalada. Alternativamente, para especificar explicitamente o nome do caminho da instalação do OpenSSL, use a seguinte sintaxe. Isso pode ser útil se você tiver várias versões do OpenSSL instaladas, para evitar que o **CMake** escolha a versão errada:

   ```sql
   cmake . -DWITH_SSL=path_name
   ```

3. Compile e instale a distribuição.

Para verificar se um servidor `mysqld` suporta conexões criptografadas, examine o valor da variável de sistema `have_ssl`:

```sql
mysql> SHOW VARIABLES LIKE 'have_ssl';
+---------------+-------+
| Variable_name | Value |
+---------------+-------+
| have_ssl      | YES   |
+---------------+-------+
```

Se o valor for `YES`, o servidor suporta conexões criptografadas. Se o valor for `DISABLED`, o servidor é capaz de suportar conexões criptografadas, mas não foi iniciado com as opções apropriadas `--ssl-xxx` para permitir o uso de conexões criptografadas; consulte a Seção 6.3.1, “Configurando o MySQL para usar conexões criptografadas”.

Para determinar se um servidor foi compilado com OpenSSL ou yaSSL, verifique a existência de qualquer uma das variáveis de sistema ou de status que estão presentes apenas para OpenSSL. Veja a Seção 6.3.4, “Capacidades dependentes da biblioteca SSL”.

### 2.8.7 Opções de configuração de fonte do MySQL

O programa **CMake** oferece um grande controle sobre como você configura uma distribuição de fonte MySQL. Normalmente, você faz isso usando opções na string de comando do **CMake**. Para obter informações sobre as opções suportadas pelo **CMake**, execute qualquer um desses comandos no diretório de fonte de nível superior:

```sql
$> cmake . -LH

$> ccmake .
```

Você também pode afetar o **CMake** usando certas variáveis de ambiente. Veja a Seção 4.9, “Variáveis de ambiente”.

Para opções booleanas, o valor pode ser especificado como `1` ou `ON` para habilitar a opção, ou como `0` ou `OFF` para desabilitar a opção.

Muitas opções configuram padrões de compilação que podem ser sobrescritos na inicialização do servidor. Por exemplo, as opções `CMAKE_INSTALL_PREFIX`, `MYSQL_TCP_PORT` e `MYSQL_UNIX_ADDR` que configuram o diretório de base de instalação padrão, o número de porta TCP/IP e o arquivo de soquete Unix podem ser alteradas na inicialização do servidor com as opções `--basedir`, `--port` e `--socket` para `mysqld`. Quando aplicável, as descrições das opções de configuração indicam a opção de inicialização correspondente `mysqld`.

As seções a seguir fornecem mais informações sobre as opções do **CMake**.

* Referência de Opções do CMake
* Opções Gerais
* Opções de Layout de Instalação
* Opções do Motor de Armazenamento
* Opções de Recursos
* Fлагаdos do Compilador
* Opções do CMake para Compilar o NDB Cluster

#### Referência de Opções do CMake

A tabela a seguir mostra as opções disponíveis do **CMake**. Na coluna `Default`, `PREFIX` representa o valor da opção `CMAKE_INSTALL_PREFIX`, que especifica o diretório de base de instalação. Esse valor é usado como localização pai para vários dos subdiretórios de instalação.

**Tabela 2.14 Referência de opção de configuração de fonte do MySQL (CMake)** <table>
<thead>
<tr>
<th>Formats</th>
<th>Description</th>
<th>Default</th>
<th>Introduced</th>
<th>Removed</th>
</tr>
</thead>
<tbody>
<tr>
<th><code>BUILD_CONFIG</code></th>
<td>Use as mesmas opções de compilação das versões oficiais</td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>CMAKE_BUILD_TYPE</code></th>
<td>Type of build to produce</td>
<td><code>RelWithDebInfo</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>CMAKE_CXX_FLAGS</code></th>
<td>Bandeiras para Compilador C++</td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>CMAKE_C_FLAGS</code></th>
<td>Bandeiras para Compilador C</td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>CMAKE_INSTALL_PREFIX</code></th>
<td>Installation base directory</td>
<td><code>/usr/local/mysql</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>COMPILATION_COMMENT</code></th>
<td>Comentário sobre o ambiente de compilação</td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>CPACK_MONOLITHIC_INSTALL</code></th>
<td>Se a construção do pacote produz um único arquivo</td>
<td><code>OFF</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>DEFAULT_CHARSET</code></th>
<td>The default server character set</td>
<td><code>latin1</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>DEFAULT_COLLATION</code></th>
<td>The default server collation</td>
<td><code>latin1_swedish_ci</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>DISABLE_PSI_COND</code></th>
<td>Exclude Performance Schema condition instrumentation</td>
<td><code>OFF</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>DISABLE_PSI_FILE</code></th>
<td>Exclude Performance Schema file instrumentation</td>
<td><code>OFF</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>DISABLE_PSI_IDLE</code></th>
<td>Exclude Performance Schema idle instrumentation</td>
<td><code>OFF</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>DISABLE_PSI_MEMORY</code></th>
<td>Exclude Performance Schema memory instrumentation</td>
<td><code>OFF</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>DISABLE_PSI_METADATA</code></th>
<td>Exclude Performance Schema metadata instrumentation</td>
<td><code>OFF</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>DISABLE_PSI_MUTEX</code></th>
<td>Exclude Performance Schema mutex instrumentation</td>
<td><code>OFF</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>DISABLE_PSI_PS</code></th>
<td>Exclua as declarações do esquema de desempenho preparadas</td>
<td><code>OFF</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>DISABLE_PSI_RWLOCK</code></th>
<td>Exclude Performance Schema rwlock instrumentation</td>
<td><code>OFF</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>DISABLE_PSI_SOCKET</code></th>
<td>Exclude Performance Schema socket instrumentation</td>
<td><code>OFF</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>DISABLE_PSI_SP</code></th>
<td>Exclua a instrumentação de programas armazenados do Schema de desempenho</td>
<td><code>OFF</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>DISABLE_PSI_STAGE</code></th>
<td>Exclude Performance Schema stage instrumentation</td>
<td><code>OFF</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>DISABLE_PSI_STATEMENT</code></th>
<td>Exclude Performance Schema statement instrumentation</td>
<td><code>OFF</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>DISABLE_PSI_STATEMENT_DIGEST</code></th>
<td>Exclude Performance Schema statements_digest instrumentation</td>
<td><code>OFF</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>DISABLE_PSI_TABLE</code></th>
<td>Exclude Performance Schema table instrumentation</td>
<td><code>OFF</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>DISABLE_PSI_THREAD</code></th>
<td>Exclua a instrumentação de thread do esquema de desempenho</td>
<td><code>OFF</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>DISABLE_PSI_TRANSACTION</code></th>
<td>Exclua a instrumentação de transação do esquema de desempenho</td>
<td><code>OFF</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>DOWNLOAD_BOOST</code></th>
<td>Se deve baixar a biblioteca Boost</td>
<td><code>OFF</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>DOWNLOAD_BOOST_TIMEOUT</code></th>
<td>Tempo de espera em segundos para baixar a biblioteca Boost</td>
<td><code>600</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>ENABLED_LOCAL_INFILE</code></th>
<td>Se deve habilitar LOCAL para LOAD DATA</td>
<td><code>OFF</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>ENABLED_PROFILING</code></th>
<td>Se deve habilitar o código de perfilamento de consulta</td>
<td><code>ON</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>ENABLE_DOWNLOADS</code></th>
<td>Whether to download optional files</td>
<td><code>OFF</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>ENABLE_DTRACE</code></th>
<td>Se incluir suporte para DTrace</td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>ENABLE_GCOV</code></th>
<td>Se deve incluir suporte para gcov</td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>ENABLE_GPROF</code></th>
<td>Ative o gprof (apenas para compilações otimizadas do Linux)</td>
<td><code>OFF</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>FORCE_UNSUPPORTED_COMPILER</code></th>
<td>Whether to permit unsupported compilers</td>
<td><code>OFF</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>IGNORE_AIO_CHECK</code></th>
<td>With -DBUILD_CONFIG=mysql_release, ignore libaio check</td>
<td><code>OFF</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>INSTALL_BINDIR</code></th>
<td>User executables directory</td>
<td><code>PREFIX/bin</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>INSTALL_DOCDIR</code></th>
<td>Documentation directory</td>
<td><code>PREFIX/docs</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>INSTALL_DOCREADMEDIR</code></th>
<td>README file directory</td>
<td><code>PREFIX</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>INSTALL_INCLUDEDIR</code></th>
<td>Header file directory</td>
<td><code>PREFIX/include</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>INSTALL_INFODIR</code></th>
<td>Info file directory</td>
<td><code>PREFIX/docs</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>INSTALL_LAYOUT</code></th>
<td>Select predefined installation layout</td>
<td><code>STANDALONE</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>INSTALL_LIBDIR</code></th>
<td>Library file directory</td>
<td><code>PREFIX/lib</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>INSTALL_MANDIR</code></th>
<td>Manual page directory</td>
<td><code>PREFIX/man</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>INSTALL_MYSQLKEYRINGDIR</code></th>
<td>Directory for keyring_file plugin data file</td>
<td><code>platform specific</code></td>
<td>5.7.11</td>
<td></td>
</tr>
<tr>
<th><code>INSTALL_MYSQLSHAREDIR</code></th>
<td>Shared data directory</td>
<td><code>PREFIX/share</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>INSTALL_MYSQLTESTDIR</code></th>
<td>mysql-test directory</td>
<td><code>PREFIX/mysql-test</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>INSTALL_PKGCONFIGDIR</code></th>
<td>Directory for mysqlclient.pc pkg-config file</td>
<td><code>INSTALL_LIBDIR/pkgconfig</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>INSTALL_PLUGINDIR</code></th>
<td>Plugin directory</td>
<td><code>PREFIX/lib/plugin</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>INSTALL_SBINDIR</code></th>
<td>Server executable directory</td>
<td><code>PREFIX/bin</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>INSTALL_SCRIPTDIR</code></th>
<td>Scripts directory</td>
<td><code>PREFIX/scripts</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>INSTALL_SECURE_FILE_PRIVDIR</code></th>
<td>secure_file_priv default value</td>
<td><code>platform specific</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>INSTALL_SECURE_FILE_PRIV_EMBEDDEDDIR</code></th>
<td>secure_file_priv default value for libmysqld</td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>INSTALL_SHAREDIR</code></th>
<td>aclocal/mysql.m4 installation directory</td>
<td><code>PREFIX/share</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>INSTALL_SUPPORTFILESDIR</code></th>
<td>Extra support files directory</td>
<td><code>PREFIX/support-files</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>MAX_INDEXES</code></th>
<td>Maximum indexes per table</td>
<td><code>64</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>MEMCACHED_HOME</code></th>
<td>Path to memcached; obsolete</td>
<td><code>[none]</code></td>
<td></td>
<td>5.7.33</td>
</tr>
<tr>
<th><code>MUTEX_TYPE</code></th>
<td>InnoDB mutex type</td>
<td><code>event</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>MYSQLX_TCP_PORT</code></th>
<td>TCP/IP port number used by X Plugin</td>
<td><code>33060</code></td>
<td>5.7.17</td>
<td></td>
</tr>
<tr>
<th><code>MYSQLX_UNIX_ADDR</code></th>
<td>Unix socket file used by X Plugin</td>
<td><code>/tmp/mysqlx.sock</code></td>
<td>5.7.15</td>
<td></td>
</tr>
<tr>
<th><code>MYSQL_DATADIR</code></th>
<td>Data directory</td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>MYSQL_MAINTAINER_MODE</code></th>
<td>Se deve habilitar o ambiente de desenvolvimento específico para o mantenedor do MySQL</td>
<td><code>OFF</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>MYSQL_PROJECT_NAME</code></th>
<td>Windows/macOS project name</td>
<td><code>MySQL</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>MYSQL_TCP_PORT</code></th>
<td>TCP/IP port number</td>
<td><code>3306</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>MYSQL_UNIX_ADDR</code></th>
<td>Unix socket file</td>
<td><code>/tmp/mysql.sock</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>ODBC_INCLUDES</code></th>
<td>ODBC includes directory</td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>ODBC_LIB_DIR</code></th>
<td>ODBC library directory</td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>OPTIMIZER_TRACE</code></th>
<td>Se deve ou não suportar o rastreamento do otimizador</td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>REPRODUCIBLE_BUILD</code></th>
<td>Tome cuidado extra para criar um resultado de construção independente da localização e do horário de construção</td>
<td></td>
<td>5.7.19</td>
<td></td>
</tr>
<tr>
<th><code>SUNPRO_CXX_LIBRARY</code></th>
<td>Biblioteca de links de cliente em Solaris 10+</td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>SYSCONFDIR</code></th>
<td>Option file directory</td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>SYSTEMD_PID_DIR</code></th>
<td>Diretório para arquivos PID sob o systemd</td>
<td><code>/var/run/mysqld</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>SYSTEMD_SERVICE_NAME</code></th>
<td>Nome do serviço MySQL sob o systemd</td>
<td><code>mysqld</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>TMPDIR</code></th>
<td>tmpdir default value</td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>WIN_DEBUG_NO_INLINE</code></th>
<td>Whether to disable function inlining</td>
<td><code>OFF</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>WITHOUT_SERVER</code></th>
<td>Não construa o servidor; uso interno apenas</td>
<td><code>OFF</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>WITHOUT_xxx_STORAGE_ENGINE</code></th>
<td>Exclua o motor de armazenamento xxx da construção</td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>WITH_ASAN</code></th>
<td>Enable AddressSanitizer</td>
<td><code>OFF</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>WITH_ASAN_SCOPE</code></th>
<td>Enable AddressSanitizer -fsanitize-address-use-after-scope Clang flag</td>
<td><code>OFF</code></td>
<td>5.7.21</td>
<td></td>
</tr>
<tr>
<th><code>WITH_AUTHENTICATION_LDAP</code></th>
<td>Whether to report error if LDAP authentication plugins cannot be built</td>
<td><code>OFF</code></td>
<td>5.7.19</td>
<td></td>
</tr>
<tr>
<th><code>WITH_AUTHENTICATION_PAM</code></th>
<td>Build PAM authentication plugin</td>
<td><code>OFF</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>WITH_AWS_SDK</code></th>
<td>Localização do kit de desenvolvimento de software da Amazon Web Services</td>
<td></td>
<td>5.7.19</td>
<td></td>
</tr>
<tr>
<th><code>WITH_BOOST</code></th>
<td>A localização das fontes do Boost library</td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>WITH_BUNDLED_LIBEVENT</code></th>
<td>Use bundled libevent when building ndbmemcache; obsolete</td>
<td><code>ON</code></td>
<td></td>
<td>5.7.33</td>
</tr>
<tr>
<th><code>WITH_BUNDLED_MEMCACHED</code></th>
<td>Use bundled memcached when building ndbmemcache; obsolete</td>
<td><code>ON</code></td>
<td></td>
<td>5.7.33</td>
</tr>
<tr>
<th><code>WITH_CLASSPATH</code></th>
<td>Classe de caminho a ser usada ao construir o Conector do MySQL Cluster para Java. O padrão é uma string vazia.</td>
<td><code></code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>WITH_CLIENT_PROTOCOL_TRACING</code></th>
<td>Build client-side protocol tracing framework</td>
<td><code>ON</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>WITH_CURL</code></th>
<td>Location of curl library</td>
<td></td>
<td>5.7.19</td>
<td></td>
</tr>
<tr>
<th><code>WITH_DEBUG</code></th>
<td>Whether to include debugging support</td>
<td><code>OFF</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>WITH_DEFAULT_COMPILER_OPTIONS</code></th>
<td>Se deve usar as opções de compilador padrão</td>
<td><code>ON</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>WITH_DEFAULT_FEATURE_SET</code></th>
<td>Se deve usar o conjunto de recursos padrão</td>
<td><code>ON</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>WITH_EDITLINE</code></th>
<td>Which libedit/editline library to use</td>
<td><code>bundled</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>WITH_EMBEDDED_SERVER</code></th>
<td>Whether to build embedded server</td>
<td><code>OFF</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>WITH_EMBEDDED_SHARED_LIBRARY</code></th>
<td>Se é necessário construir uma biblioteca de servidor embutido compartilhada</td>
<td><code>OFF</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>WITH_ERROR_INSERT</code></th>
<td>Ative a injeção de erros no motor de armazenamento NDB. Não deve ser usado para construir binários destinados à produção.</td>
<td><code>OFF</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>WITH_EXTRA_CHARSETS</code></th>
<td>Quais conjuntos de caracteres adicionais incluir</td>
<td><code>all</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>WITH_GMOCK</code></th>
<td>Caminho para a distribuição do googlemock</td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>WITH_INNODB_EXTRA_DEBUG</code></th>
<td>Se deve incluir suporte adicional de depuração para o InnoDB.</td>
<td><code>OFF</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>WITH_INNODB_MEMCACHED</code></th>
<td>Se deve gerar bibliotecas compartilhadas do memcached.</td>
<td><code>OFF</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>WITH_KEYRING_TEST</code></th>
<td>Build the keyring test program</td>
<td><code>OFF</code></td>
<td>5.7.11</td>
<td></td>
</tr>
<tr>
<th><code>WITH_LDAP</code></th>
<td>Internal use only</td>
<td></td>
<td>5.7.29</td>
<td></td>
</tr>
<tr>
<th><code>WITH_LIBEVENT</code></th>
<td>Which libevent library to use</td>
<td><code>bundled</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>WITH_LIBWRAP</code></th>
<td>Se incluir suporte para libwrap (wrappers TCP)</td>
<td><code>OFF</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>WITH_LZ4</code></th>
<td>Type of LZ4 library support</td>
<td><code>bundled</code></td>
<td>5.7.14</td>
<td></td>
</tr>
<tr>
<th><code>WITH_MECAB</code></th>
<td>Compiles MeCab</td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>WITH_MSAN</code></th>
<td>Enable MemorySanitizer</td>
<td><code>OFF</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>WITH_MSCRT_DEBUG</code></th>
<td>Habilitar o rastreamento de vazamento de memória do CRT do Visual Studio</td>
<td><code>OFF</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>WITH_NDBAPI_EXAMPLES</code></th>
<td>Build API example programs.</td>
<td><code>OFF</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>WITH_NDBCLUSTER</code></th>
<td>NDB 8.0.30 and earlier: Build NDB storage engine. NDB 8.0.31 and later: Deprecated; use WITH_NDB instead</td>
<td><code>ON</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>WITH_NDBCLUSTER_STORAGE_ENGINE</code></th>
<td>Antes da NDB 8.0.31, isso era para uso interno apenas. NDB 8.0.31 e versões posteriores: alternar (apenas) a inclusão do mecanismo de armazenamento NDBCLUSTER</td>
<td><code>ON</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>WITH_NDBMTD</code></th>
<td>Build multithreaded data node binary</td>
<td><code>ON</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>WITH_NDB_BINLOG</code></th>
<td>Habilitar o registro binário por padrão pelo mysqld.</td>
<td><code>ON</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>WITH_NDB_DEBUG</code></th>
<td>Produza uma versão de depuração para testes ou solução de problemas.</td>
<td><code>OFF</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>WITH_NDB_JAVA</code></th>
<td>Habilitar a construção do suporte Java e ClusterJ. Ativado por padrão. Suportado apenas no MySQL Cluster.</td>
<td><code>ON</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>WITH_NDB_PORT</code></th>
<td>Porta padrão usada por um servidor de gerenciamento construído com esta opção. Se esta opção não foi usada para construí-lo, a porta padrão do servidor de gerenciamento é 1186.</td>
<td><code>[none]</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>WITH_NDB_TEST</code></th>
<td>Include NDB API test programs.</td>
<td><code>OFF</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>WITH_NUMA</code></th>
<td>Set NUMA memory allocation policy</td>
<td></td>
<td>5.7.17</td>
<td></td>
</tr>
<tr>
<th><code>WITH_PROTOBUF</code></th>
<td>Which Protocol Buffers package to use</td>
<td><code>bundled</code></td>
<td>5.7.12</td>
<td></td>
</tr>
<tr>
<th><code>WITH_RAPID</code></th>
<td>Whether to build rapid development cycle plugins</td>
<td><code>ON</code></td>
<td>5.7.12</td>
<td></td>
</tr>
<tr>
<th><code>WITH_SASL</code></th>
<td>Internal use only</td>
<td></td>
<td>5.7.29</td>
<td></td>
</tr>
<tr>
<th><code>WITH_SSL</code></th>
<td>Type of SSL support</td>
<td><code>system</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>WITH_SYSTEMD</code></th>
<td>Habilitar a instalação dos arquivos de suporte do systemd</td>
<td><code>OFF</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>WITH_TEST_TRACE_PLUGIN</code></th>
<td>Build test protocol trace plugin</td>
<td><code>OFF</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>WITH_UBSAN</code></th>
<td>Enable Undefined Behavior Sanitizer</td>
<td><code>OFF</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>WITH_UNIT_TESTS</code></th>
<td>Compile MySQL with unit tests</td>
<td><code>ON</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>WITH_UNIXODBC</code></th>
<td>Enable unixODBC support</td>
<td><code>OFF</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>WITH_VALGRIND</code></th>
<td>Se deve compilar em arquivos de cabeçalho do Valgrind</td>
<td><code>OFF</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>WITH_ZLIB</code></th>
<td>Type of zlib support</td>
<td><code>bundled</code></td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>WITH_xxx_STORAGE_ENGINE</code></th>
<td>Compilar o mecanismo de armazenamento xxx estaticamente no servidor</td>
<td></td>
<td></td>
<td></td>
</tr>
</tbody>
</table>

#### Opções Gerais

* `-DBUILD_CONFIG=mysql_release`

Essa opção configura uma distribuição de fonte com as mesmas opções de compilação usadas pela Oracle para produzir distribuições binárias para as versões oficiais do MySQL.

* `-DCMAKE_BUILD_TYPE=type`

O tipo de construção a ser produzido:

+ `RelWithDebInfo`: Habilitar otimizações e gerar informações de depuração. Este é o tipo de compilação padrão do MySQL.

+ `Debug`: Desative as otimizações e gere informações de depuração. Esse tipo de compilação também é usado se a opção `WITH_DEBUG` estiver habilitada. Ou seja, `-DWITH_DEBUG=1` tem o mesmo efeito que `-DCMAKE_BUILD_TYPE=Debug`.

* `-DCPACK_MONOLITHIC_INSTALL=bool`

Esta opção afeta se a operação **fazer pacote** produz vários arquivos de pacote de instalação ou um único arquivo. Se desativada, a operação produz vários arquivos de pacote de instalação, o que pode ser útil se você deseja instalar apenas um subconjunto de uma instalação completa do MySQL. Se ativada, ela produz um único arquivo para instalar tudo.

#### Opções de Layout de Instalação

A opção `CMAKE_INSTALL_PREFIX` indica o diretório de instalação básica. Outras opções com nomes na forma `INSTALL_xxx` que indicam os locais dos componentes são interpretadas em relação ao prefixo e seus valores são nomes de caminho relativos. Seus valores não devem incluir o prefixo.

* `-DCMAKE_INSTALL_PREFIX=dir_name`

O diretório de base de instalação.

Esse valor pode ser definido na inicialização do servidor usando a opção `--basedir`.

* `-DINSTALL_BINDIR=dir_name`

Onde instalar programas do usuário.

* `-DINSTALL_DOCDIR=dir_name`

Onde instalar a documentação.

* `-DINSTALL_DOCREADMEDIR=dir_name`

Onde instalar os arquivos `README`

* `-DINSTALL_INCLUDEDIR=dir_name`

Onde instalar os arquivos de cabeçalho.

* `-DINSTALL_INFODIR=dir_name`

Onde instalar os arquivos Info.

* `-DINSTALL_LAYOUT=name`

Selecione um layout de instalação pré-definido:

+ `STANDALONE`: O mesmo layout utilizado para os pacotes `.tar.gz` e `.zip`. Este é o padrão.

+ `RPM`: Layout semelhante aos pacotes RPM.  
  + `SVR4`: Layout de pacotes Solaris.  
  + `DEB`: Layout de pacotes DEB (experimental).

Você pode selecionar um layout predefinido, mas modificar os locais de instalação de componentes individuais, especificando outras opções. Por exemplo:

  ```sql
  cmake . -DINSTALL_LAYOUT=SVR4 -DMYSQL_DATADIR=/var/mysql/data
  ```

O valor `INSTALL_LAYOUT` determina o valor padrão das variáveis de sistema `secure_file_priv`, `keyring_encrypted_file_data` e `keyring_file_data`. Consulte as descrições dessas variáveis nas Seções 5.1.7, “Variáveis de sistema do servidor”, e 6.4.4.12, “Variáveis de sistema do Keychain”.

* `-DINSTALL_LIBDIR=dir_name`

Onde instalar os arquivos da biblioteca.

* `-DINSTALL_MANDIR=dir_name`

Onde instalar as páginas manuais.

* `-DINSTALL_MYSQLKEYRINGDIR=dir_path`

O diretório padrão a ser usado como localização do arquivo de dados do plugin `keyring_file`. O valor padrão é específico da plataforma e depende do valor da opção `INSTALL_LAYOUT` **CMake**. Veja a descrição da variável de sistema `keyring_file_data` na Seção 5.1.7, “Variáveis do sistema do servidor”.

Essa opção foi adicionada no MySQL 5.7.11.

* `-DINSTALL_MYSQLSHAREDIR=dir_name`

Onde instalar arquivos de dados compartilhados.

* `-DINSTALL_MYSQLTESTDIR=dir_name`

Onde instalar o diretório `mysql-test`. Para suprimir a instalação deste diretório, configure explicitamente a opção para o valor vazio (`-DINSTALL_MYSQLTESTDIR=`).

* `-DINSTALL_PKGCONFIGDIR=dir_name`

O diretório onde instalar o arquivo `mysqlclient.pc` para uso pelo **pkg-config**. O valor padrão é `INSTALL_LIBDIR/pkgconfig`, a menos que `INSTALL_LIBDIR` termine com `/mysql`, no caso, esse é removido primeiro.

* `-DINSTALL_PLUGINDIR=dir_name`

O local do diretório do plugin.

Esse valor pode ser definido na inicialização do servidor com a opção `--plugin_dir`.

* `-DINSTALL_SBINDIR=dir_name`

Onde instalar o servidor `mysqld`.

* `-DINSTALL_SCRIPTDIR=dir_name`

Onde instalar **mysql\_install\_db**.

* `-DINSTALL_SECURE_FILE_PRIVDIR=dir_name`

O valor padrão para a variável de sistema `secure_file_priv`. O valor padrão é específico da plataforma e depende do valor da opção `INSTALL_LAYOUT` **CMake**. Veja a descrição da variável de sistema `secure_file_priv` na Seção 5.1.7, “Variáveis do sistema do servidor”.

Para definir o valor para o servidor embutido `libmysqld`, use `INSTALL_SECURE_FILE_PRIV_EMBEDDEDDIR`.

* `-DINSTALL_SECURE_FILE_PRIV_EMBEDDEDDIR=dir_name`

O valor padrão para a variável de sistema `secure_file_priv`, para o servidor embutido `libmysqld`.

Nota

A biblioteca de servidor embutida `libmysqld` é descontinuada a partir do MySQL 5.7.19; espere que ela seja removida no MySQL 8.0.

* `-DINSTALL_SHAREDIR=dir_name`

Onde instalar `aclocal/mysql.m4`.

* `-DINSTALL_SUPPORTFILESDIR=dir_name`

Onde instalar arquivos de suporte adicionais.

* `-DMYSQL_DATADIR=dir_name`

O local do diretório de dados do MySQL.

Esse valor pode ser definido na inicialização do servidor com a opção `--datadir`.

* `-DODBC_INCLUDES=dir_name`

O local do diretório ODBC, que pode ser usado durante a configuração do Connector/ODBC, está incluído.

* `-DODBC_LIB_DIR=dir_name`

O local do diretório da biblioteca ODBC, que pode ser usado ao configurar o Connector/ODBC.

* `-DSYSCONFDIR=dir_name`

O diretório padrão do arquivo de opção `my.cnf`.

Essa localização não pode ser definida na inicialização do servidor, mas você pode iniciar o servidor com um arquivo de opção especificado usando a opção `--defaults-file=file_name`, onde *`file_name`* é o nome completo do caminho do arquivo.

* `-DSYSTEMD_PID_DIR=dir_name`

O nome do diretório onde o arquivo PID deve ser criado quando o MySQL é gerenciado pelo systemd. O padrão é `/var/run/mysqld`; esse valor pode ser alterado implicitamente de acordo com o valor `INSTALL_LAYOUT`.

Esta opção é ignorada, a menos que `WITH_SYSTEMD` esteja habilitado.

* `-DSYSTEMD_SERVICE_NAME=name`

O nome do serviço MySQL a ser usado quando o MySQL é gerenciado pelo **systemd**. O padrão é `mysqld`; esse valor pode ser alterado implicitamente de acordo com o valor `INSTALL_LAYOUT`.

Esta opção é ignorada, a menos que `WITH_SYSTEMD` esteja habilitado.

* `-DTMPDIR=dir_name`

O local padrão a ser usado para a variável de sistema `tmpdir`. Se não especificado, o valor padrão é `P_tmpdir` em `<stdio.h>`.

#### Opções do Motor de Armazenamento

Os motores de armazenamento são construídos como plugins. Você pode construir um plugin como um módulo estático (compilado no servidor) ou um módulo dinâmico (construído como uma biblioteca dinâmica que deve ser instalada no servidor usando a declaração `INSTALL PLUGIN` ou a opção `--plugin-load` antes que ele possa ser usado). Alguns plugins podem não suportar a construção estática ou dinâmica.

Os motores `InnoDB`, `MyISAM`, `MERGE`, `MEMORY` e `CSV` são obrigatórios (sempre compilados no servidor) e não precisam ser instalados explicitamente.

Para compilar um motor de armazenamento estaticamente no servidor, use `-DWITH_engine_STORAGE_ENGINE=1`. Alguns valores *`engine`* permitidos são `ARCHIVE`, `BLACKHOLE`, `EXAMPLE`, `FEDERATED` e `PARTITION` (suporte de particionamento). Exemplos:

```sql
-DWITH_ARCHIVE_STORAGE_ENGINE=1
-DWITH_BLACKHOLE_STORAGE_ENGINE=1
```

Para construir o MySQL com suporte para o NDB Cluster, use a opção `WITH_NDBCLUSTER`.

Nota

`WITH_NDBCLUSTER` é suportado apenas ao construir o NDB Cluster usando as fontes do NDB Cluster. Não pode ser usado para habilitar o suporte de agrupamento em outras árvores de fontes ou distribuições do MySQL. Nas distribuições de fontes do NDB Cluster, ele é habilitado por padrão. Consulte a Seção 21.3.1.4, “Construindo o NDB Cluster a partir de fontes no Linux”, e a Seção 21.3.2.2, “Compilando e Instalando o NDB Cluster a partir de fontes no Windows”, para obter mais informações.

Nota

Não é possível compilar sem o suporte do Performance Schema. Se deseja compilar sem tipos específicos de instrumentação, isso pode ser feito com as seguintes opções do **CMake**:

```sql
DISABLE_PSI_COND
DISABLE_PSI_FILE
DISABLE_PSI_IDLE
DISABLE_PSI_MEMORY
DISABLE_PSI_METADATA
DISABLE_PSI_MUTEX
DISABLE_PSI_PS
DISABLE_PSI_RWLOCK
DISABLE_PSI_SOCKET
DISABLE_PSI_SP
DISABLE_PSI_STAGE
DISABLE_PSI_STATEMENT
DISABLE_PSI_STATEMENT_DIGEST
DISABLE_PSI_TABLE
DISABLE_PSI_THREAD
DISABLE_PSI_TRANSACTION
```

Por exemplo, para compilar sem instrumentação de mutex, configure o MySQL usando `-DDISABLE_PSI_MUTEX=1`.

Para excluir um mecanismo de armazenamento da construção, use `-DWITH_engine_STORAGE_ENGINE=0`. Exemplos:

```sql
-DWITH_EXAMPLE_STORAGE_ENGINE=0
-DWITH_FEDERATED_STORAGE_ENGINE=0
-DWITH_PARTITION_STORAGE_ENGINE=0
```

Também é possível excluir um mecanismo de armazenamento da compilação usando `-DWITHOUT_engine_STORAGE_ENGINE=1` (mas `-DWITH_engine_STORAGE_ENGINE=0` é preferido). Exemplos:

```sql
-DWITHOUT_EXAMPLE_STORAGE_ENGINE=1
-DWITHOUT_FEDERATED_STORAGE_ENGINE=1
-DWITHOUT_PARTITION_STORAGE_ENGINE=1
```

Se nem o `-DWITH_engine_STORAGE_ENGINE` nem o `-DWITHOUT_engine_STORAGE_ENGINE` forem especificados para um determinado motor de armazenamento, o motor é construído como um módulo compartilhado, ou excluído se não puder ser construído como um módulo compartilhado.

#### Opções de recursos

* `-DCOMPILATION_COMMENT=string`

Um comentário descritivo sobre o ambiente de compilação.

* `-DDEFAULT_CHARSET=charset_name`

O conjunto de caracteres do servidor. Por padrão, o MySQL usa o conjunto de caracteres `latin1` (`cp1252` do Oeste Europeu).

*`charset_name`* pode ser um dos `binary`, `armscii8`, `ascii`, `big5`, `cp1250`, `cp1251`, `cp1256`, `cp1257`, `cp850`, `cp852`, `cp866`, `cp932`, `dec8`, `eucjpms`, `euckr`, `gb2312`, `gbk`, `geostd8`, `greek`, `hebrew`, `hp8`, `keybcs2`, `koi8r`, `koi8u`, `latin1`, `latin2`, `latin5`, `latin7`, `macce`, `macroman`, `sjis`, `swe7`, `tis620`, `ucs2`, `ujis`, `utf8`, `utf8mb4`, `utf16`, `utf16le`, `utf32`. Os conjuntos de caracteres permitidos estão listados no arquivo `cmake/character_sets.cmake` como o valor de `CHARSETS_AVAILABLE`.

Esse valor pode ser definido na inicialização do servidor com a opção `--character-set-server`.

* `-DDEFAULT_COLLATION=collation_name`

A correção do servidor. Por padrão, o MySQL usa `latin1_swedish_ci`. Use a declaração `SHOW COLLATION` para determinar quais correções estão disponíveis para cada conjunto de caracteres.

Esse valor pode ser definido na inicialização do servidor com a opção `--collation_server`.

* `-DDISABLE_PSI_COND=bool`

Se deseja excluir a instrumentação da condição do Schema de desempenho. O padrão é `OFF` (incluir).

* `-DDISABLE_PSI_FILE=bool`

Se deseja excluir a instrumentação do arquivo do Schema de Desempenho. O padrão é `OFF` (incluir).

* `-DDISABLE_PSI_IDLE=bool`

Se deseja excluir a instrumentação de inatividade do Schema de Desempenho. O padrão é `OFF` (incluir).

* `-DDISABLE_PSI_MEMORY=bool`

Se deseja excluir a instrumentação de memória do Schema de desempenho. O padrão é `OFF` (incluir).

* `-DDISABLE_PSI_METADATA=bool`

Se deseja excluir a instrumentação de metadados do Schema de desempenho. O padrão é `OFF` (incluir).

* `-DDISABLE_PSI_MUTEX=bool`

Se deseja excluir a instrumentação do mutex do Schema de desempenho. O padrão é `OFF` (incluir).

* `-DDISABLE_PSI_RWLOCK=bool`

Se deseja excluir a instrumentação do esquema de desempenho rwlock. O padrão é `OFF` (incluir).

* `-DDISABLE_PSI_SOCKET=bool`

Se deseja excluir a instrumentação de soquete do Schema de Desempenho. O padrão é `OFF` (incluir).

* `-DDISABLE_PSI_SP=bool`

Se deseja excluir a instrumentação de programas armazenados do Schema de Desempenho. O padrão é `OFF` (incluir).

* `-DDISABLE_PSI_STAGE=bool`

Se deseja excluir a instrumentação da etapa do Schema de desempenho. O padrão é `OFF` (incluir).

* `-DDISABLE_PSI_STATEMENT=bool`

Se deseja excluir a instrumentação da declaração do Schema de desempenho. O padrão é `OFF` (incluir).

* `-DDISABLE_PSI_STATEMENT_DIGEST=bool`

Se deseja excluir a instrumentação do digest do relatório do Schema de desempenho. O padrão é `OFF` (incluir).

* `-DDISABLE_PSI_TABLE=bool`

Se deseja excluir a instrumentação da tabela do Schema de Desempenho. O padrão é `OFF` (incluir).

* `-DDISABLE_PSI_PS=bool`

Exclua as instâncias de instrumentação de declarações do Schema de desempenho. O padrão é `OFF` (incluir).

* `-DDISABLE_PSI_THREAD=bool`

Exclua a instrumentação do esquema de desempenho do thread. O padrão é `OFF` (inclua).

Desative apenas os threads ao compilar sem qualquer instrumentação, pois outras instrumentações dependem dos threads.

* `-DDISABLE_PSI_TRANSACTION=bool`

Exclua a instrumentação de transações do Schema de desempenho. O padrão é `OFF` (incluir).

* `-DDOWNLOAD_BOOST=bool`

Se deseja baixar a biblioteca Boost. O padrão é `OFF`.

Veja a opção `WITH_BOOST` para uma discussão adicional sobre o uso do Boost.

* `-DDOWNLOAD_BOOST_TIMEOUT=seconds`

O tempo de espera em segundos para o download da biblioteca Boost. O padrão é 600 segundos.

Veja a opção `WITH_BOOST` para uma discussão adicional sobre o uso do Boost.

* `-DENABLE_DOWNLOADS=bool`

Se deseja baixar arquivos opcionais. Por exemplo, com esta opção ativada, o **CMake** baixa a distribuição do Google Test que é usada pela suite de teste para executar testes unitários.

* `-DENABLE_DTRACE=bool`

Se deve incluir suporte para sondagens DTrace. Para informações sobre DTrace, consulte a Seção 5.8.4, “Rastreamento do mysqld usando DTrace”.

Essa opção é descontinuada porque o suporte para DTrace é descontinuado no MySQL 5.7 e é removido no MySQL 8.0.

* `-DENABLE_GCOV=bool`

Se deve incluir suporte para **gcov** (apenas Linux).

* `-DENABLE_GPROF=bool`

Se você deseja habilitar o **gprof** (apenas para compilações otimizadas do Linux).

* `-DENABLED_LOCAL_INFILE=bool`

Esta opção controla a capacidade `LOCAL` integrada automaticamente para a biblioteca de clientes MySQL. Os clientes que não fazem disposições explícitas, portanto, têm a capacidade `LOCAL` desativada ou ativada de acordo com a configuração `ENABLED_LOCAL_INFILE` especificada no momento da construção do MySQL.

Por padrão, a biblioteca de clientes nas distribuições binárias do MySQL é compilada com `ENABLED_LOCAL_INFILE` desativado. (Antes do MySQL 5.7.6, ela era ativada por padrão.) Se você compilar o MySQL a partir de fonte, configure-o com `ENABLED_LOCAL_INFILE` desativado ou ativado, dependendo se os clientes que não fazem acordos explícitos devem ter a capacidade `LOCAL` desativada ou ativada, respectivamente.

`ENABLED_LOCAL_INFILE` controla a configuração padrão da capacidade `LOCAL` do lado do cliente. Para o servidor, a variável de sistema `local_infile` controla a capacidade `LOCAL` do lado do servidor. Para causar explicitamente que o servidor recuse ou permita as declarações `LOAD DATA LOCAL` (independentemente de como os programas e bibliotecas do cliente são configurados no momento da construção ou no tempo de execução), inicie `mysqld` com `--local-infile` desativado ou ativado, respectivamente. `local_infile` também pode ser definido no tempo de execução. Veja a Seção 6.1.6, “Considerações de Segurança para LOAD DATA LOCAL”.

* `-DENABLED_PROFILING=bool`

Se deve habilitar o código de perfilamento de consulta (para as declarações `SHOW PROFILE` e `SHOW PROFILES`).

* `-DFORCE_UNSUPPORTED_COMPILER=bool`

Por padrão, o **CMake** verifica as versões mínimas dos compiladores suportados: Visual Studio 2013 (Windows); GCC 4.4 ou Clang 3.3 (Linux); Developer Studio 12.5 (Solaris servidor); Developer Studio 12.2 ou GCC 4.4 (biblioteca de clientes Solaris); Clang 3.3 (macOS), Clang 3.3 (FreeBSD). Para desabilitar essa verificação, use `-DFORCE_UNSUPPORTED_COMPILER=ON`.

* `-DIGNORE_AIO_CHECK=bool`

Se a opção `-DBUILD_CONFIG=mysql_release` for fornecida no Linux, a biblioteca `libaio` deve ser vinculada por padrão. Se você não tiver `libaio` ou não quiser instalá-la, pode suprimir a verificação para ela, especificando `-DIGNORE_AIO_CHECK=1`.

* `-DMAX_INDEXES=num`

O número máximo de índices por tabela. O padrão é 64. O máximo é 255. Valores menores que 64 são ignorados e o padrão de 64 é usado.

* `-DMYSQL_MAINTAINER_MODE=bool`

Se deseja habilitar um ambiente de desenvolvimento específico para o mantenedor do MySQL. Se habilitado, esta opção faz com que as advertências do compilador se tornem erros.

* `-DMUTEX_TYPE=type`

O tipo de mutex usado por `InnoDB`. As opções incluem:

+ `event`: Use muts de evento. Este é o valor padrão e a implementação original do mutex `InnoDB`.

+ `sys`: Use mutexes POSIX em sistemas UNIX. Use objetos `CRITICAL_SECTION` em Windows, se disponíveis.

+ `futex`: Use futextos Linux em vez de variáveis de condição para agendar threads em espera.

* `-DMYSQLX_TCP_PORT=port_num`

O número do porto no qual o X Plugin escuta conexões TCP/IP. O padrão é 33060.

Esse valor pode ser definido na inicialização do servidor com a variável de sistema `mysqlx_port`.

* `-DMYSQLX_UNIX_ADDR=file_name`

O caminho do arquivo de socket Unix no qual o servidor escuta conexões de socket do Plugin X. Este deve ser um nome de caminho absoluto. O padrão é `/tmp/mysqlx.sock`.

Esse valor pode ser definido na inicialização do servidor com a variável de sistema `mysqlx_port`.

* `-DMYSQL_PROJECT_NAME=name`

Para Windows ou macOS, o nome do projeto a ser incorporado no nome do arquivo do projeto.

* `-DMYSQL_TCP_PORT=port_num`

O número do porto no qual o servidor escuta as conexões TCP/IP. O padrão é 3306.

Esse valor pode ser definido na inicialização do servidor com a opção `--port`.

* `-DMYSQL_UNIX_ADDR=file_name`

O caminho do arquivo de socket Unix no qual o servidor escuta conexões de socket. Este deve ser um nome de caminho absoluto. O padrão é `/tmp/mysql.sock`.

Esse valor pode ser definido na inicialização do servidor com a opção `--socket`.

* `-DOPTIMIZER_TRACE=bool`

Se deseja-se suportar o rastreamento do otimizador. Veja a Seção 8.15, “Rastreamento do Otimizador”.

* `-DREPRODUCIBLE_BUILD=bool`

Para compilações em sistemas Linux, esta opção controla se é necessário ter um cuidado extra para criar um resultado de compilação independente da localização e do momento da compilação.

Essa opção foi adicionada no MySQL 5.7.19.

* `-DWIN_DEBUG_NO_INLINE=bool`

Se você deseja desabilitar a inlining de funções no Windows. O padrão é `OFF` (inlining habilitado).

* `-DWITH_ASAN=bool`

Se deve habilitar o AddressSanitizer, para os compiladores que o suportam. O padrão é `OFF`.

* `-DWITH_ASAN_SCOPE=bool`

Se deseja habilitar a bandeira `-fsanitize-address-use-after-scope` AddressSanitizer para detecção de uso após escopo. O padrão é desativado. Para usar esta opção, `-DWITH_ASAN` também deve ser habilitado.

* `-DWITH_AUTHENTICATION_LDAP=bool`

Se deve relatar um erro se os plugins de autenticação LDAP não puderem ser construídos:

+ Se esta opção estiver desativada (padrão), os plugins LDAP são construídos se os arquivos de cabeçalho e as bibliotecas necessárias forem encontrados. Se não forem, o **CMake** exibe uma nota sobre isso.

+ Se esta opção estiver habilitada, a falha em encontrar o arquivo de cabeçalho e as bibliotecas necessárias faz com que o CMake produza um erro, impedindo a construção do servidor.

Para informações sobre autenticação LDAP, consulte a Seção 6.4.1.9, “Autenticação Pluggable LDAP”. Esta opção foi adicionada no MySQL 5.7.19.

* `-DWITH_AUTHENTICATION_PAM=bool`

Se deseja construir o plugin de autenticação PAM, para árvores de origem que incluem este plugin. (Veja a Seção 6.4.1.7, “Autenticação Conectada ao PAM”.) Se esta opção for especificada e o plugin não puder ser compilado, a construção falha.

* `-DWITH_AWS_SDK=path_name`

O local do kit de desenvolvimento de software do Amazon Web Services.

Essa opção foi adicionada no MySQL 5.7.19.

* `-DWITH_BOOST=path_name`

A biblioteca Boost é necessária para a construção do MySQL. Essas opções de **CMake** permitem o controle da localização da fonte da biblioteca e se ela deve ser baixada automaticamente:

+ `-DWITH_BOOST=path_name` especifica a localização do diretório da biblioteca Boost. É também possível especificar a localização do Boost definindo a variável de ambiente `BOOST_ROOT` ou `WITH_BOOST`.

A partir do MySQL 5.7.11, `-DWITH_BOOST=system` também é permitido e indica que a versão correta do Boost está instalada no host de compilação na localização padrão. Neste caso, a versão instalada do Boost é usada em vez de qualquer versão incluída em uma distribuição de fonte MySQL.

+ `-DDOWNLOAD_BOOST=bool` especifica se o código-fonte do Boost deve ser baixado se ele não estiver presente no local especificado. O padrão é `OFF`.

+ `-DDOWNLOAD_BOOST_TIMEOUT=seconds` o tempo de espera em segundos para o download da biblioteca Boost. O padrão é 600 segundos.

Por exemplo, se você normalmente constrói o MySQL colocando a saída do objeto no subdiretório `bld` da sua árvore de origem do MySQL, você pode construir com o Boost da seguinte maneira:

  ```sql
  mkdir bld
  cd bld
  cmake .. -DDOWNLOAD_BOOST=ON -DWITH_BOOST=$HOME/my_boost
  ```

Isso faz com que o Boost seja baixado no diretório `my_boost` sob seu diretório de casa. Se a versão do Boost necessária já estiver lá, nenhum download é feito. Se a versão do Boost necessária mudar, a versão mais recente é baixada.

Se o Boost já estiver instalado localmente e o compilador encontrar os arquivos de cabeçalho do Boost por si próprio, talvez não seja necessário especificar as opções anteriores do **CMake**. No entanto, se a versão do Boost exigida pelo MySQL mudar e a versão instalada localmente não tiver sido atualizada, você pode ter problemas de compilação. O uso das opções do **CMake** deve lhe dar uma compilação bem-sucedida.

Com as configurações acima que permitem o download do Boost em um local especificado, quando a versão necessária do Boost muda, você precisa remover a pasta `bld`, recriá-la e realizar novamente a etapa **cmake**. Caso contrário, a nova versão do Boost pode não ser baixada e a compilação pode falhar.

* `-DWITH_CLIENT_PROTOCOL_TRACING=bool`

Se deve incluir o framework de rastreamento de protocolo do lado do cliente na biblioteca do cliente. Por padrão, essa opção está habilitada.

Para obter informações sobre como escrever plugins de rastreamento de cliente de protocolo, consulte Escrever plugins de rastreamento de protocolo.

Veja também a opção `WITH_TEST_TRACE_PLUGIN`.

* `-DWITH_CURL=curl_type`

A localização da biblioteca `curl`. *`curl_type`* pode ser `system` (use a biblioteca do sistema `curl`) ou um nome de caminho para a biblioteca `curl`.

Essa opção foi adicionada no MySQL 5.7.19.

* `-DWITH_DEBUG=bool`

Se deve incluir suporte para depuração.

Configurar o MySQL com suporte de depuração permite que você use a opção `--debug="d,parser_debug"` ao iniciar o servidor. Isso faz com que o analisador Bison, que é usado para processar declarações SQL, descarregue uma traçada do analisador na saída padrão de erro do servidor. Normalmente, essa saída é escrita no log de erro.

A verificação de depuração para o mecanismo de armazenamento `InnoDB` é definida em `UNIV_DEBUG` e está disponível quando o suporte de depuração é compilado usando a opção `WITH_DEBUG`. Quando o suporte de depuração é compilado, a opção de configuração `innodb_sync_debug` pode ser usada para habilitar ou desabilitar a verificação de depuração de sincronização `InnoDB`.

A partir do MySQL 5.7.18, habilitar `WITH_DEBUG` também habilita o Debug Sync. Para uma descrição da facilidade Debug Sync e como usar pontos de sincronização, consulte MySQL Internals: Test Synchronization.

* `-DWITH_DEFAULT_FEATURE_SET=bool`

Se deve usar as bandeiras de `cmake/build_configurations/feature_set.cmake`.

* `-DWITH_EDITLINE=value`

Qual biblioteca `libedit`/`editline` utilizar. Os valores permitidos são `bundled` (padrão) e `system`.

`WITH_EDITLINE` substitui `WITH_LIBEDIT`, que foi removida.

* `-DWITH_EMBEDDED_SERVER=bool`

Se deve construir a biblioteca de servidor embutida `libmysqld`.

Nota

A biblioteca de servidor embutida `libmysqld` é descontinuada a partir do MySQL 5.7.17 e foi removida no MySQL 8.0.

* `-DWITH_EMBEDDED_SHARED_LIBRARY=bool`

Se deve construir uma biblioteca de servidor embutida `libmysqld` compartilhada.

Nota

A biblioteca de servidor embutida `libmysqld` é descontinuada a partir do MySQL 5.7.17 e foi removida no MySQL 8.0.

* `-DWITH_EXTRA_CHARSETS=name`

Quais conjuntos de caracteres adicionais incluir:

+ `all`: Todos os conjuntos de caracteres. Este é o padrão.

+ `complex`: Conjuntos de caracteres complexos.
  + `none`: Sem conjuntos de caracteres extras.
* `-DWITH_GMOCK=path_name`

O caminho para a distribuição do googlemock, para uso com testes unitários baseados no Google Test. O valor da opção é o caminho do arquivo Zip da distribuição. Alternativamente, defina a variável de ambiente `WITH_GMOCK` para o nome do caminho. Também é possível usar `-DENABLE_DOWNLOADS=1`, nesse caso, o **CMake** baixa a distribuição do GitHub.

Se você construir o MySQL sem os testes unitários do Google Test (configurando sem `WITH_GMOCK`), o **CMake** exibe uma mensagem indicando como baixá-lo.

* `-DWITH_INNODB_EXTRA_DEBUG=bool`

Se deve incluir suporte adicional para depuração do InnoDB.

Ativação de `WITH_INNODB_EXTRA_DEBUG` habilita verificações de depuração adicionais do InnoDB. Esta opção só pode ser ativada quando `WITH_DEBUG` está ativada.

* `-DWITH_INNODB_MEMCACHED=bool`

Se deve gerar bibliotecas compartilhadas do memcached (`libmemcached.so` e `innodb_engine.so`).

* `-DWITH_KEYRING_TEST=bool`

Se deve construir o programa de teste que acompanha o plugin `keyring_file`. O padrão é `OFF`. O código-fonte do arquivo de teste está localizado no diretório `plugin/keyring/keyring-test`.

Essa opção foi adicionada no MySQL 5.7.11.

* `-DWITH_LDAP=value`

Uso interno apenas. Esta opção foi adicionada no MySQL 5.7.29.

* `-DWITH_LIBEVENT=string`

Qual biblioteca `libevent` usar. Os valores permitidos são `bundled` (padrão) e `system`. Antes do MySQL 5.7.31, se você especificar `system`, a biblioteca `libevent` do sistema é usada, se estiver presente, e ocorre um erro caso contrário. No MySQL 5.7.31 e posterior, se `system` for especificado e não for possível encontrar a biblioteca `libevent` do sistema, um erro ocorre independentemente, e o `libevent` incorporado não é usado.

A biblioteca `libevent` é necessária pelo memcached `InnoDB` e pelo X Plugin.

* `-DWITH_LIBWRAP=bool`

Se deve incluir o suporte ao `libwrap` (wrappers TCP).

* `-DWITH_LZ4=lz4_type`

A opção `WITH_LZ4` indica a fonte de suporte do `zlib`:

+ `bundled`: Use a biblioteca `lz4` empacotada com a distribuição. Isso é o padrão.

+ `system`: Use a biblioteca do sistema `lz4`. Se `WITH_LZ4` estiver definido para este valor, o utilitário **lz4\_decompress** não será construído. Neste caso, o comando **lz4** do sistema pode ser usado em vez disso.

* `-DWITH_MECAB={disabled|system|path_name}`

Use esta opção para compilar o analisador MeCab. Se você instalou o MeCab no diretório de instalação padrão, defina `-DWITH_MECAB=system`. A opção `system` se aplica a instalações do MeCab realizadas a partir de fontes ou de binários usando um utilitário de gerenciamento de pacotes nativo. Se você instalou o MeCab em um diretório de instalação personalizado, especifique o caminho da instalação do MeCab, por exemplo, `-DWITH_MECAB=/opt/mecab`. Se a opção `system` não funcionar, especificar o caminho da instalação do MeCab deve funcionar em todos os casos.

Para informações relacionadas, consulte a Seção 12.9.9, “Plugin do Parser de Texto Completo MeCab”.

* `-DWITH_MSAN=bool`

Se você deseja habilitar o MemorySanitizer, para compiladores que o suportam. O padrão é desativado.

Para que essa opção tenha efeito se habilitada, todas as bibliotecas vinculadas ao MySQL também devem ter sido compiladas com a opção habilitada.

* `-DWITH_MSCRT_DEBUG=bool`

Se deve habilitar o rastreamento de vazamento de memória do Visual Studio CRT. O padrão é `OFF`.

* `-DWITH_NUMA=bool`

Defina explicitamente a política de alocação de memória NUMA. **CMake** define o valor padrão `WITH_NUMA` com base no suporte `NUMA` da plataforma atual. Para plataformas sem suporte NUMA, **CMake** se comporta da seguinte forma:

+ Sem a opção NUMA (o caso normal), o **CMake** continua normalmente, produzindo apenas este aviso: Biblioteca NUMA ausente ou versão necessária não disponível.

+ Com `-DWITH_NUMA=ON`, o **CMake** é interrompido com este erro: biblioteca NUMA ausente ou versão necessária não disponível.

Essa opção foi adicionada no MySQL 5.7.17.

* `-DWITH_PROTOBUF=protobuf_type`

Qual pacote de Protocol Buffers usar. *`protobuf_type`* pode ser um dos seguintes valores:

+ `bundled`: Use o pacote que vem com a distribuição. Esse é o padrão.

+ `system`: Use o pacote instalado no sistema.

Outros valores são ignorados, com uma opção de fallback para `bundled`.

Essa opção foi adicionada no MySQL 5.7.12.

* `-DWITH_RAPID=bool`

Se deve construir os plugins do ciclo de desenvolvimento rápido. Quando habilitado, um diretório `rapid` é criado na árvore de construção, contendo esses plugins. Quando desabilitado, nenhum diretório `rapid` é criado na árvore de construção. O padrão é `ON`, a menos que o diretório `rapid` seja removido da árvore de origem, no qual caso o padrão se torna `OFF`. Esta opção foi adicionada no MySQL 5.7.12.

* `-DWITH_SASL=value`

Uso interno apenas. Esta opção foi adicionada no MySQL 5.7.29. Não é suportada no Windows.

* `-DWITH_SSL={ssl_type`|*`path_name`*}

Para suporte a conexões criptografadas, entropia para geração de números aleatórios e outras operações relacionadas à criptografia, o MySQL deve ser construído usando uma biblioteca SSL. Esta opção especifica qual biblioteca SSL deve ser usada.

+ *`ssl_type`* pode ser um dos seguintes valores:

- `yes`: Use a biblioteca OpenSSL do sistema, se estiver presente, caso contrário, a biblioteca empacotada com a distribuição.

- `bundled`: Use a biblioteca SSL empacotada com a distribuição. Este é o valor padrão antes do MySQL 5.7.28. A partir do 5.7.28, este não é mais um valor permitido e o padrão é `system`.

- `system`: Use a biblioteca OpenSSL do sistema. Isso é o padrão a partir do MySQL 5.7.28.

+ *`path_name`* é o nome do caminho para a instalação do OpenSSL a ser utilizada. Isso pode ser preferível ao uso do valor *`ssl_type`* de `system`, pois pode evitar que o CMake detecte e use uma versão mais antiga ou incorreta do OpenSSL instalada no sistema. (Outra maneira permitida de fazer a mesma coisa é definir `WITH_SSL` para `system` e definir a opção `CMAKE_PREFIX_PATH` para *`path_name`*.)

Para obter informações adicionais sobre a configuração da biblioteca SSL, consulte a Seção 2.8.6, “Configuração do suporte à biblioteca SSL”.

* `-DWITH_SYSTEMD=bool`

Se deve habilitar a instalação de arquivos de suporte do **systemd**. Por padrão, essa opção está desativada. Quando habilitada, os arquivos de suporte do **systemd** são instalados e scripts como `mysqld_safe` e o script de inicialização do System V não são instalados. Em plataformas onde o **systemd** não está disponível, habilitar `WITH_SYSTEMD` resulta em um erro do **CMake**.

Para obter mais informações sobre o uso do **systemd**, consulte a Seção 2.5.10, “Gerenciamento do servidor MySQL com systemd”. Essa seção também inclui informações sobre a especificação de opções especificadas de outra forma nos grupos de opções `[mysqld_safe]`. Como o `mysqld_safe` não é instalado quando o **systemd** é usado, essas opções devem ser especificadas de outra maneira.

* `-DWITH_TEST_TRACE_PLUGIN=bool`

Se deseja construir o plugin de rastreamento de protocolo de teste do cliente (consulte Usando o Plugin de Rastreamento de Protocolo de Teste). Por padrão, esta opção está desativada. Ativação desta opção não tem efeito, a menos que a opção `WITH_CLIENT_PROTOCOL_TRACING` esteja ativada. Se o MySQL estiver configurado com ambas as opções ativadas, a biblioteca de clientes `libmysqlclient` é construída com o plugin de rastreamento de protocolo de teste embutido e todos os clientes padrão do MySQL carregam o plugin. No entanto, mesmo quando o plugin de teste está ativado, ele não tem efeito por padrão. O controle do plugin é concedido usando variáveis de ambiente; consulte Usando o Plugin de Rastreamento de Protocolo de Teste.

Nota

Não habilite a opção `WITH_TEST_TRACE_PLUGIN` se você deseja usar seus próprios plugins de rastreamento de protocolo, porque apenas um desses plugins pode ser carregado de cada vez e uma mensagem de erro ocorre para tentativas de carregar um segundo plugin. Se você já construiu o MySQL com o plugin de rastreamento de protocolo de teste habilitado para ver como ele funciona, você deve reconstruir o MySQL sem ele antes de poder usar seus próprios plugins.

Para obter informações sobre como escrever plugins de rastreamento, consulte Escrever plugins de rastreamento de protocolo.

* `-DWITH_UBSAN=bool`

Se você deseja habilitar o Sanitizer de Comportamento Indefinido, para compiladores que o suportem. O padrão é desativado.

* `-DWITH_UNIT_TESTS={ON|OFF}`

Se habilitado, compile o MySQL com testes unitários. O padrão é `ON` a menos que o servidor não esteja sendo compilado.

* `-DWITH_UNIXODBC=1`

Permite o suporte unixODBC, para o Connector/ODBC.

* `-DWITH_VALGRIND=bool`

Se compilar em arquivos de cabeçalho do Valgrind, que expõe a API do Valgrind ao código do MySQL. O padrão é `OFF`.

Para gerar uma compilação de depuração compatível com Valgrind, `-DWITH_VALGRIND=1` normalmente é combinado com `-DWITH_DEBUG=1`. Veja Construção de Configurações de Depuração.

* `-DWITH_ZLIB=zlib_type`

Algumas funcionalidades exigem que o servidor seja construído com suporte a bibliotecas de compressão, como as funções `COMPRESS()` e `UNCOMPRESS()`, e a compressão do protocolo cliente/servidor. A opção `WITH_ZLIB` indica a origem do suporte ao `zlib`:

+ `bundled`: Use a biblioteca `zlib` empacotada com a distribuição. Isso é o padrão.

+ `system`: Use a biblioteca do sistema `zlib`.

* `-DWITHOUT_SERVER=bool`

Se deseja construir sem o MySQL Server. O padrão é DESATIVADO, o que constrói o servidor.

Isso é considerado uma opção experimental; é preferível construir com o servidor.

#### Fлагаres do compilador

* `-DCMAKE_C_FLAGS="flags`

Bandeiras para o compilador C.

* `-DCMAKE_CXX_FLAGS="flags`

Bandeiras para o compilador C++.

* `-DWITH_DEFAULT_COMPILER_OPTIONS=bool`

Se deve usar as bandeiras de `cmake/build_configurations/compiler_options.cmake`.

Nota

Todas as bandeiras de otimização são cuidadosamente escolhidas e testadas pela equipe de construção do MySQL. A supressão delas pode levar a resultados inesperados e é feita por sua conta e risco.

* `-DSUNPRO_CXX_LIBRARY="lib_name`

Ative a vinculação contra `libCstd` em vez de `stlport4` no Solaris 10 ou posterior. Isso funciona apenas para código cliente, pois o servidor depende do C++98.

Para especificar suas próprias opções de compilador C e C++, para as opções que não afetam a otimização, use as opções `CMAKE_C_FLAGS` e `CMAKE_CXX_FLAGS` do CMake.

Ao fornecer suas próprias flags do compilador, você pode querer especificar `CMAKE_BUILD_TYPE` também.

Por exemplo, para criar uma versão de compilação de 32 bits em uma máquina Linux de 64 bits, faça o seguinte:

```sql
$> mkdir build
$> cd build
$> cmake .. -DCMAKE_C_FLAGS=-m32 \
  -DCMAKE_CXX_FLAGS=-m32 \
  -DCMAKE_BUILD_TYPE=RelWithDebInfo
```

Se você definir flags que afetam a otimização (`-Onumber`), você deve definir as opções `CMAKE_C_FLAGS_build_type` e/ou `CMAKE_CXX_FLAGS_build_type`, onde *`build_type`* corresponde ao valor de `CMAKE_BUILD_TYPE`. Para especificar uma otimização diferente para o tipo de compilação padrão (`RelWithDebInfo`, defina as opções `CMAKE_C_FLAGS_RELWITHDEBINFO` e `CMAKE_CXX_FLAGS_RELWITHDEBINFO`. Por exemplo, para compilar no Linux com `-O3` e com símbolos de depuração, faça o seguinte:

```sql
$> cmake .. -DCMAKE_C_FLAGS_RELWITHDEBINFO="-O3 -g" \
  -DCMAKE_CXX_FLAGS_RELWITHDEBINFO="-O3 -g"
```

#### Opções do CMake para Compilar o NDB Cluster

As opções a seguir são para uso ao construir um NDB Cluster com as fontes do NDB Cluster; elas não são atualmente suportadas ao usar fontes da árvore do MySQL 5.7 Server.

* `-DMEMCACHED_HOME=dir_name`

O suporte para memcached do `NDB` foi removido no NDB 7.5.21 e no NDB 7.6.17; portanto, essa opção não é mais suportada para a construção do `NDB` nessas ou em versões posteriores.

* `-DWITH_BUNDLED_LIBEVENT={ON|OFF}`

O suporte para memcached do `NDB` foi removido no NDB 7.5.21 e no NDB 7.6.17, e, portanto, essa opção não é mais suportada para a construção do `NDB` nessas ou em versões posteriores.

* `-DWITH_BUNDLED_MEMCACHED={ON|OFF}`

O suporte para memcached do `NDB` foi removido no NDB 7.5.21 e no NDB 7.6.17, e, portanto, essa opção não é mais suportada para a construção do `NDB` nessas ou em versões posteriores.

* `-DWITH_CLASSPATH=path`

Define o caminho de classe para a construção do MySQL NDB Cluster Connector para Java. O padrão é vazio. Esta opção é ignorada se `-DWITH_NDB_JAVA=OFF` for usada.

* `-DWITH_ERROR_INSERT={ON|OFF}`

Permite a injeção de erros no kernel `NDB`. Apenas para testes; não é destinado ao uso na construção de binários de produção. O padrão é `OFF`.

* `-DWITH_NDBAPI_EXAMPLES={ON|OFF}`

Construa programas de exemplo da API NDB em `storage/ndb/ndbapi-examples/`. Consulte Exemplos da API NDB para obter informações sobre esses exemplos.

* `-DWITH_NDBCLUSTER_STORAGE_ENGINE={ON|OFF}`

Apenas para uso interno; pode não funcionar sempre conforme o esperado. Para construir com suporte ao `NDB`, use `WITH_NDBCLUSTER` em vez disso.

* `-DWITH_NDBCLUSTER={ON|OFF}`

Construa e faça referência ao suporte para o motor de armazenamento `NDB` no `mysqld`. O padrão é `ON`.

* `-DWITH_NDBMTD={ON|OFF}`

Construa o executável do nó de dados multithreading **ndbmtd"). O padrão é `ON`.

* `-DWITH_NDB_BINLOG={ON|OFF}`

Ative o registro binário por padrão no `mysqld` construído usando esta opção. `ON` por padrão.

* `-DWITH_NDB_DEBUG={ON|OFF}`

Habilitar a construção das versões de depuração dos binários do NDB Cluster. Isso é `OFF` por padrão.

* `-DWITH_NDB_JAVA={ON|OFF}`

Habilitar o NDB Cluster de construção com suporte a Java, incluindo suporte para ClusterJ (consulte o Conecta para Java do NDB Cluster MySQL).

Esta opção é `ON` por padrão. Se você não deseja compilar o NDB Cluster com suporte a Java, você deve desabilitar explicitamente especificando `-DWITH_NDB_JAVA=OFF` ao executar o **CMake**. Caso contrário, se o Java não for encontrado, a configuração da compilação falha.

* `-DWITH_NDB_PORT=port`

Faz com que o servidor de gerenciamento do NDB Cluster (**ndb\_mgmd**) que é construído para usar este *`port`* por padrão. Se esta opção não for definida, o servidor de gerenciamento resultante tenta usar a porta 1186 por padrão.

* `-DWITH_NDB_TEST={ON|OFF}`

Se habilitado, inclua um conjunto de programas de teste da API NDB. O padrão é `OFF`.

### 2.8.8 Lidando com problemas de compilação do MySQL

A solução para muitos problemas envolve a recalibração. Se você fizer a recalibração, tome nota do seguinte:

* Se o **CMake** for executado após ter sido executado anteriormente, ele pode usar informações que foram coletadas durante sua invocação anterior. Essas informações são armazenadas em `CMakeCache.txt`. Quando o **CMake** começa, ele procura esse arquivo e lê seu conteúdo, se existir, assumindo que as informações ainda estão corretas. Essa suposição é inválida quando você reconfigura.

* Toda vez que você executar o **CMake**, você deve executar novamente o **make** para recompilar. No entanto, você pode querer remover os arquivos de objeto antigos das compilações anteriores primeiro, porque eles foram compilados usando opções de configuração diferentes.

Para evitar que arquivos de objeto antigos ou informações de configuração sejam usados, execute os seguintes comandos antes de executar novamente o **CMake**:

Em Unix:

```sql
$> make clean
$> rm CMakeCache.txt
```

Em Windows:

```sql
$> devenv MySQL.sln /clean
$> del CMakeCache.txt
```

Se você construir fora da árvore de origem, remova e recree seu diretório de construção antes de executar novamente o **CMake**. Para obter instruções sobre como construir fora da árvore de origem, consulte Como construir o MySQL Server com CMake.

Em alguns sistemas, os avisos podem ocorrer devido a diferenças nos arquivos de inclusão do sistema. A lista a seguir descreve outros problemas que foram encontrados com maior frequência ao compilar o MySQL:

* Para definir quais compiladores C e C++ devem ser usados, você pode definir as variáveis de ambiente `CC` e `CXX`. Por exemplo:

  ```sql
  $> CC=gcc
  $> CXX=g++
  $> export CC CXX
  ```

Embora isso possa ser feito na string de comando, como mostrado acima, você pode preferir definir esses valores em um script de construção, nesse caso, o comando **export** não é necessário.

Para especificar suas próprias opções de compilador C e C++, use as opções `CMAKE_C_FLAGS` e `CMAKE_CXX_FLAGS` do CMake. Veja Flags de compilador.

Para ver quais bandeiras você pode precisar especificar, invoque o **mysql\_config** com as opções `--cflags` e `--cxxflags`.

* Para ver quais comandos são executados durante a fase de compilação, após usar o **CMake** para configurar o MySQL, execute **make VERBOSE=1** em vez de apenas **make**.

* Se a compilação falhar, verifique se a opção `MYSQL_MAINTAINER_MODE` está habilitada. Esse modo faz com que as advertências do compilador se tornem erros, então desabilitá-la pode permitir que a compilação prossiga.

* Se sua compilação falhar com erros como qualquer um dos seguintes, você deve atualizar sua versão do **make** para **GNU make**:

  ```sql
  make: Fatal error in reader: Makefile, line 18:
  Badly formed macro assignment
  ```

Ou:

  ```sql
  make: file `Makefile' line 18: Must be a separator (:
  ```

Ou:

  ```sql
  pthread.h: No such file or directory
  ```

Sabe-se que o Solaris e o FreeBSD têm programas **make** problemáticos.

O GNU **make** 3.75 é conhecido por funcionar.

* O arquivo `sql_yacc.cc` é gerado a partir de `sql_yacc.yy`. Normalmente, o processo de construção não precisa criar `sql_yacc.cc`, porque o MySQL vem com uma cópia pré-gerada. No entanto, se você precisar recriá-lo, você pode encontrar este erro:

  ```sql
  "sql_yacc.yy", line xxx fatal: default action causes potential...
  ```

Isso é um sinal de que sua versão do **yacc** está deficiente. Provavelmente, você precisa instalar uma versão recente do **bison** (a versão GNU do **yacc**) e usá-la em vez disso.

Versões do **bison** mais antigas que 1,75 podem relatar esse erro:

  ```sql
  sql_yacc.yy:#####: fatal error: maximum table size (32767) exceeded
  ```

O tamanho máximo da tabela não é realmente excedido; o erro é causado por bugs em versões mais antigas do **bison**.

Para obter informações sobre a aquisição ou atualização de ferramentas, consulte os requisitos do sistema na Seção 2.8, “Instalando MySQL a partir de fonte”.

### 2.8.9 Configuração do MySQL e Ferramentas de Terceiros

As ferramentas de terceiros que precisam determinar a versão do MySQL a partir da fonte MySQL podem ler o arquivo `VERSION` no diretório da fonte de nível superior. O arquivo lista as partes da versão separadamente. Por exemplo, se a versão for MySQL 5.7.4-m14, o arquivo parece assim:

```sql
MYSQL_VERSION_MAJOR=5
MYSQL_VERSION_MINOR=7
MYSQL_VERSION_PATCH=4
MYSQL_VERSION_EXTRA=-m14
```

Se a fonte não for para uma versão de disponibilidade geral (GA) do MySQL Server, o valor `MYSQL_VERSION_EXTRA` não está vazio. No exemplo anterior, o valor corresponde ao Milestone 14.

`MYSQL_VERSION_EXTRA` também não está vazio para as versões do NDB Cluster (incluindo as versões GA do NDB Cluster), conforme mostrado aqui:

```sql
MYSQL_VERSION_MAJOR=5
MYSQL_VERSION_MINOR=7
MYSQL_VERSION_PATCH=32
MYSQL_VERSION_EXTRA=-ndb-7.5.21
```

Para construir um número de cinco dígitos a partir dos componentes da versão, use esta fórmula:

```sql
MYSQL_VERSION_MAJOR*10000 + MYSQL_VERSION_MINOR*100 + MYSQL_VERSION_PATCH
```
