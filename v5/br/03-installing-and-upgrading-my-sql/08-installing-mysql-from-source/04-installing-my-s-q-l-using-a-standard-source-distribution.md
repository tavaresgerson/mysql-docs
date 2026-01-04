### 2.8.4 Instalação do MySQL usando uma distribuição de fonte padrão

Para instalar o MySQL a partir de uma distribuição de fonte padrão:

1. Verifique se o seu sistema atende aos requisitos da ferramenta listados na Seção 2.8.2, “Pré-requisitos de Instalação da Fonte”.
2. Obtenha um arquivo de distribuição usando as instruções na Seção 2.1.3, “Como obter o MySQL”.
3. Configure, construa e instale a distribuição usando as instruções nesta seção.
4. Realize os procedimentos pós-instalação usando as instruções na Seção 2.9, “Configuração e Teste Pós-Instalação”.

O MySQL utiliza **CMake** como o framework de compilação em todas as plataformas. As instruções fornecidas aqui devem permitir que você produza uma instalação funcional. Para obter informações adicionais sobre como usar **CMake** para compilar o MySQL, consulte Como construir o servidor MySQL com CMake.

Se você começar com um RPM de origem, use o seguinte comando para criar um RPM binário que você pode instalar. Se você não tiver **rpmbuild**, use **rpm** em vez disso.

```shell
$> rpmbuild --rebuild --clean MySQL-VERSION.src.rpm
```

O resultado é um ou mais pacotes RPM binários que você instala conforme indicado na Seção 2.5.5, “Instalando o MySQL no Linux Usando Pacotes RPM da Oracle”.

A sequência para a instalação a partir de uma distribuição de fonte em formato **tar** comprimido ou de um arquivo ZIP é semelhante ao processo para a instalação a partir de uma distribuição de binários genéricos (consulte a Seção 2.2, “Instalando o MySQL no Unix/Linux Usando Binários Genéricos”), exceto que é usada em todas as plataformas e inclui etapas para configurar e compilar a distribuição. Por exemplo, com uma distribuição de fonte em formato **tar** comprimido no Unix, a sequência básica do comando de instalação é a seguinte:

```shell
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

::: info Nota
O procedimento mostrado aqui não configura senhas para contas do MySQL. Após seguir o procedimento, prossiga para a Seção 2.9, “Configuração e Teste Pós-Instalação”, para a configuração e teste pós-instalação.
:::

- Realize a configuração préconfigurada
- Obtenha e desempacote a distribuição
- Configure a Distribuição
- Construa a Distribuição
- Instale a Distribuição
- Realize a configuração pós-instalação

#### Realize a configuração préconfigurada

No Unix, configure o usuário `mysql` que possui o diretório do banco de dados e que deve ser usado para executar o servidor MySQL, e o grupo ao qual esse usuário pertence. Para obter detalhes, consulte Criar um usuário e um grupo mysql. Em seguida, execute as etapas a seguir como o usuário `mysql`, exceto conforme indicado.

#### Obtenha e desempacote a distribuição

Escolha o diretório sob o qual você deseja descompactar a distribuição e altere a localização para ele.

Obtenha um arquivo de distribuição usando as instruções na Seção 2.1.3, “Como obter o MySQL”.

Descompacte a distribuição no diretório atual:

- Para desempacotar um arquivo **tar** compactado, o **tar** pode descompactar e desempacotar a distribuição se tiver suporte à opção `z`:

  ```shell
  $> tar zxvf mysql-VERSION.tar.gz
  ```

  Se o seu **tar** não tiver suporte à opção `z`, use **gunzip** para descomprimir a distribuição e **tar** para descompac-la:

  ```shell
  $> gunzip < mysql-VERSION.tar.gz | tar xvf -
  ```

  Alternativamente, o **CMake** pode descomprimir e desempacotar a distribuição:

  ```shell
  $> cmake -E tar zxvf mysql-VERSION.tar.gz
  ```

- Para descompactar um arquivo Zip, use o **WinZip** ou outra ferramenta que possa ler arquivos `.zip`.

Ao descompactar o arquivo de distribuição, é criado um diretório chamado `mysql-VERSION`.

#### Configure a Distribuição

Altere a localização para o diretório de nível superior da distribuição desempacotada:

```shell
$> cd mysql-VERSION
```

Construa fora da árvore de origem para manter a árvore limpa. Se o diretório de origem de nível superior estiver nomeado `mysql-src` sob o diretório de trabalho atual, você pode construir em um diretório nomeado `build` no mesmo nível. Crie o diretório e vá até lá:

```shell
$> mkdir bld
$> cd bld
```

Configure o diretório de compilação. O comando de configuração mínima não inclui opções para substituir os valores padrão de configuração:

```shell
$> cmake ../mysql-src
```

O diretório de compilação não precisa estar fora da árvore de origem. Por exemplo, você pode compilar em um diretório chamado `build` sob a árvore de origem de nível superior. Para fazer isso, começando com `mysql-src` como seu diretório de trabalho atual, crie o diretório `build` e vá até lá:

```shell
$> mkdir build
$> cd build
```

Configure o diretório de compilação. O comando de configuração mínima não inclui opções para substituir os valores padrão de configuração:

```shell
$> cmake ..
```

Se você tiver vários repositórios de origem no mesmo nível (por exemplo, para construir várias versões do MySQL), a segunda estratégia pode ser vantajosa. A primeira estratégia coloca todos os diretórios de compilação no mesmo nível, o que exige que você escolha um nome único para cada um. Com a segunda estratégia, você pode usar o mesmo nome para o diretório de compilação dentro de cada repositório de origem. As instruções a seguir assumem essa segunda estratégia.

Em Windows, especifique o ambiente de desenvolvimento. Por exemplo, os seguintes comandos configuram o MySQL para compilações de 32 bits ou 64 bits, respectivamente:

```shell
$> cmake .. -G "Visual Studio 12 2013"

$> cmake .. -G "Visual Studio 12 2013 Win64"
```

No macOS, para usar o IDE Xcode:

```shell
$> cmake .. -G Xcode
```

Quando você executar o **Cmake**, você pode querer adicionar opções à linha de comando. Aqui estão alguns exemplos:

- `-DBUILD_CONFIG=mysql_release`: Configure a fonte com as mesmas opções de compilação usadas pela Oracle para produzir distribuições binárias para as versões oficiais do MySQL.
- `-DCMAKE_INSTALL_PREFIX=dir_name`: Configure a distribuição para instalação em um local específico.
- `-DCPACK_MONOLITHIC_INSTALL=1`: Faça com que o **make package** gere um único arquivo de instalação em vez de vários arquivos.
- `-DWITH_DEBUG=1`: Construa a distribuição com suporte de depuração.

Para uma lista mais extensa de opções, consulte a Seção 2.8.7, “Opções de Configuração de Fonte do MySQL”.

Para listar as opções de configuração, use um dos seguintes comandos:

```shell
$> cmake .. -L   # overview

$> cmake .. -LH  # overview with help text

$> cmake .. -LAH # all params with help text

$> ccmake ..     # interactive display
```

Se o **CMake** falhar, você pode precisar reconfigurá-lo executando-o novamente com opções diferentes. Se você reconfigurar, anote o seguinte:

- Se o **CMake** for executado após ter sido executado anteriormente, ele pode usar informações coletadas durante sua invocação anterior. Essas informações são armazenadas no `CMakeCache.txt`. Quando o **CMake** começa, ele procura esse arquivo e lê seu conteúdo, se ele existir, assumindo que as informações ainda estão corretas. Essa suposição é inválida quando você reconfigura.
- Cada vez que você executar o **CMake**, você deve executar novamente o **make** para recompilar. No entanto, você pode querer remover os arquivos de objeto antigos de construções anteriores primeiro, pois eles foram compilados usando opções de configuração diferentes.

Para evitar que arquivos de objeto antigos ou informações de configuração sejam usados, execute esses comandos no diretório de compilação no Unix antes de executar novamente o **CMake**:

```shell
$> make clean
$> rm CMakeCache.txt
```

Ou, no Windows:

```shell
$> devenv MySQL.sln /clean
$> del CMakeCache.txt
```

Antes de fazer uma solicitação no [MySQL Community Slack](https://mysqlcommunity.slack.com/), verifique os arquivos no diretório `CMakeFiles` para obter informações úteis sobre o erro. Para enviar um relatório de erro, use as instruções na Seção 1.5, “Como relatar erros ou problemas”.

#### Construa a Distribuição

No Unix:

```shell
$> make
$> make VERBOSE=1
```

O segundo comando define `VERBOSE` para mostrar os comandos para cada fonte compilada.

Use **gmake** em vez disso em sistemas onde você está usando o **GNU make** e ele foi instalado como **gmake**.

No Windows:

```shell
$> devenv MySQL.sln /build RelWithDebInfo
```

Se você chegou à fase de compilação, mas a distribuição não compila, consulte a Seção 2.8.8, “Como lidar com problemas de compilação do MySQL”, para obter ajuda. Se isso não resolver o problema, insira-o em nosso banco de bugs usando as instruções da Seção 1.5, “Como relatar bugs ou problemas”. Se você instalou as versões mais recentes das ferramentas necessárias e elas travam ao tentar processar nossos arquivos de configuração, informe isso também. No entanto, se você receber um erro de “comando não encontrado” ou um problema semelhante para as ferramentas necessárias, não o informe. Em vez disso, certifique-se de que todas as ferramentas necessárias estão instaladas e que sua variável `PATH` está configurada corretamente para que seu shell possa encontrá-las.

#### Instale a Distribuição

No Unix:

```shell
$> make install
```

Isso instala os arquivos no diretório de instalação configurado (por padrão, `/usr/local/mysql`). Você pode precisar executar o comando como `root`.

Para instalar em um diretório específico, adicione um parâmetro `DESTDIR` à linha de comando:

```shell
$> make install DESTDIR="/opt/mysql"
```

Alternativamente, você pode gerar arquivos de pacote de instalação que você pode instalar onde quiser:

```shell
$> make package
```

Essa operação gera um ou mais arquivos `.tar.gz` que podem ser instalados como pacotes de distribuição binária genéricos. Veja a Seção 2.2, “Instalando o MySQL no Unix/Linux usando Binários Genéricos”. Se você executar o **CMake** com `-DCPACK_MONOLITHIC_INSTALL=1`, a operação gera um único arquivo. Caso contrário, ela gera vários arquivos.

No Windows, crie o diretório de dados e, em seguida, crie um pacote de instalação de arquivo `.zip`:

```shell
$> devenv MySQL.sln /build RelWithDebInfo /project initial_database
$> devenv MySQL.sln /build RelWithDebInfo /project package
```

Você pode instalar o arquivo `.zip` resultante onde desejar. Veja a Seção 2.3.4, “Instalando o MySQL no Microsoft Windows usando um arquivo ZIP `noinstall`”.

#### Realize a configuração pós-instalação

O restante do processo de instalação envolve a configuração do arquivo de configuração, a criação dos bancos de dados principais e o início do servidor MySQL. Para obter instruções, consulte a Seção 2.9, “Configuração e Teste Pós-Instalação”.

::: info Nota
As contas listadas nas tabelas de concessão do MySQL inicialmente não têm senhas. Após iniciar o servidor, você deve configurá-las usando as instruções na Seção 2.9, "Configuração e Teste Pós-Instalação".
:::
