### 2.8.4 Instalação do MySQL Usando uma Distribuição Padrão de Fonte

Para instalar o MySQL a partir de uma distribuição padrão de código-fonte:

1. Verifique se o seu sistema satisfaz os requisitos de ferramenta listados na Seção 2.8.2, “Source Installation Prerequisites”.

2. Obtenha um arquivo de distribuição usando as instruções na Seção 2.1.3, “How to Get MySQL”.

3. Configure, compile (build) e instale a distribuição usando as instruções contidas nesta seção.

4. Execute os procedimentos de pós-instalação usando as instruções na Seção 2.9, “Postinstallation Setup and Testing”.

O MySQL usa o **CMake** como o framework de build em todas as plataformas. As instruções fornecidas aqui devem permitir que você produza uma instalação funcional. Para informações adicionais sobre o uso do **CMake** para compilar o MySQL, consulte How to Build MySQL Server with CMake.

Se você começar a partir de um Source RPM, use o seguinte comando para criar um Binary RPM que você pode instalar. Se você não tiver o **rpmbuild**, use o **rpm**.

```sql
$> rpmbuild --rebuild --clean MySQL-VERSION.src.rpm
```

O resultado é um ou mais pacotes Binary RPM que você instala conforme indicado na Seção 2.5.5, “Installing MySQL on Linux Using RPM Packages from Oracle”.

A sequência para instalação a partir de um arquivo **tar** compactado ou de um Zip archive Source Distribution (Distribuição de Fonte) é semelhante ao processo de instalação a partir de uma Generic Binary Distribution (Distribuição Binária Genérica) (consulte a Seção 2.2, “Installing MySQL on Unix/Linux Using Generic Binaries”), exceto que é usada em todas as plataformas e inclui etapas para configurar e compilar a distribuição. Por exemplo, com um Source Distribution (Distribuição de Fonte) em arquivo **tar** compactado no Unix, a sequência básica de comandos de instalação é a seguinte:

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

Uma versão mais detalhada das instruções específicas para Source-Build (compilação a partir do código-fonte) é mostrada a seguir.

Nota

O procedimento mostrado aqui não configura senhas para contas MySQL. Após seguir o procedimento, prossiga para a Seção 2.9, “Postinstallation Setup and Testing”, para a configuração e teste de pós-instalação.

* Executar Configuração Prévia
* Obter e Descompactar a Distribuição
* Configurar a Distribuição
* Compilar a Distribuição
* Instalar a Distribuição
* Executar Configuração Pós-Instalação

#### Executar Configuração Prévia

No Unix, configure o usuário `mysql` que é proprietário do Database Directory e que deve ser usado para rodar e executar o MySQL server, e o grupo ao qual este usuário pertence. Para detalhes, consulte Create a mysql User and Group. Em seguida, execute as seguintes etapas como o usuário `mysql`, exceto quando indicado.

#### Obter e Descompactar a Distribuição

Escolha o diretório sob o qual você deseja descompactar a distribuição e mude a localização para ele.

Obtenha um arquivo de distribuição usando as instruções na Seção 2.1.3, “How to Get MySQL”.

Descompacte a distribuição no diretório atual:

* Para descompactar um arquivo **tar** compactado, o **tar** pode descompactar e desembalar a distribuição se tiver suporte à opção `z`:

  ```sql
  $> tar zxvf mysql-VERSION.tar.gz
  ```

  Se o seu **tar** não tiver suporte à opção `z`, use o **gunzip** para descompactar a distribuição e o **tar** para desembalá-la:

  ```sql
  $> gunzip < mysql-VERSION.tar.gz | tar xvf -
  ```

  Alternativamente, o **CMake** pode descompactar e desembalar a distribuição:

  ```sql
  $> cmake -E tar zxvf mysql-VERSION.tar.gz
  ```

* Para descompactar um Zip archive, use o **WinZip** ou outra ferramenta que possa ler arquivos `.zip`.

A descompactação do arquivo de distribuição cria um diretório chamado `mysql-VERSION`.

#### Configurar a Distribuição

Mude a localização para o diretório de nível superior da distribuição descompactada:

```sql
$> cd mysql-VERSION
```

Compile fora da Source Tree (Árvore de Código-Fonte) para manter a árvore limpa. Se o diretório de Source de nível superior for chamado `mysql-src` sob o seu diretório de trabalho atual, você pode compilar em um diretório chamado `build` no mesmo nível. Crie o diretório e navegue até ele:

```sql
$> mkdir bld
$> cd bld
```

Configure o Build Directory. O comando mínimo de configuração não inclui opções para substituir os defaults (padrões) de configuração:

```sql
$> cmake ../mysql-src
```

O Build Directory não precisa estar fora da Source Tree. Por exemplo, você pode compilar em um diretório chamado `build` sob a Source Tree de nível superior. Para fazer isso, começando com `mysql-src` como seu diretório de trabalho atual, crie o diretório `build` e navegue até ele:

```sql
$> mkdir build
$> cd build
```

Configure o Build Directory. O comando mínimo de configuração não inclui opções para substituir os defaults de configuração:

```sql
$> cmake ..
```

Se você tiver múltiplas Source Trees no mesmo nível (por exemplo, para compilar múltiplas versões do MySQL), a segunda estratégia pode ser vantajosa. A primeira estratégia coloca todos os Build Directories no mesmo nível, o que exige que você escolha um nome exclusivo para cada um. Com a segunda estratégia, você pode usar o mesmo nome para o Build Directory dentro de cada Source Tree. As instruções a seguir assumem esta segunda estratégia.

No Windows, especifique o ambiente de desenvolvimento. Por exemplo, os seguintes comandos configuram o MySQL para builds de 32 bits ou 64 bits, respectivamente:

```sql
$> cmake .. -G "Visual Studio 12 2013"

$> cmake .. -G "Visual Studio 12 2013 Win64"
```

No macOS, para usar o Xcode IDE:

```sql
$> cmake .. -G Xcode
```

Ao executar o **CMake**, você pode querer adicionar opções à linha de comando. Aqui estão alguns exemplos:

* `-DBUILD_CONFIG=mysql_release`: Configura o Source com as mesmas opções de build usadas pela Oracle para produzir distribuições binárias para lançamentos oficiais do MySQL.

* `-DCMAKE_INSTALL_PREFIX=dir_name`: Configura a distribuição para instalação em um local específico.

* `-DCPACK_MONOLITHIC_INSTALL=1`: Causa o **make package** a gerar um único arquivo de instalação em vez de múltiplos arquivos.

* `-DWITH_DEBUG=1`: Compila a distribuição com suporte a debugging.

Para uma lista mais extensa de opções, consulte a Seção 2.8.7, “MySQL Source-Configuration Options”.

Para listar as opções de configuração, use um dos seguintes comandos:

```sql
$> cmake .. -L   # overview

$> cmake .. -LH  # overview with help text

$> cmake .. -LAH # all params with help text

$> ccmake ..     # interactive display
```

Se o **CMake** falhar, pode ser necessário reconfigurar executando-o novamente com opções diferentes. Se você reconfigurar, observe o seguinte:

* Se o **CMake** for executado após ter sido executado anteriormente, ele pode usar informações que foram coletadas durante sua invocação anterior. Essas informações são armazenadas em `CMakeCache.txt`. Quando o **CMake** inicia, ele procura por esse arquivo e lê seu conteúdo se existir, assumindo que a informação ainda está correta. Essa suposição é inválida quando você reconfigura.

* Toda vez que você executar o **CMake**, você deve executar o **make** novamente para recompilar. No entanto, você pode querer remover primeiro os arquivos de objeto antigos de builds anteriores, pois eles foram compilados usando diferentes opções de configuração.

Para evitar que arquivos de objeto antigos ou informações de configuração sejam usados, execute estes comandos no Build Directory no Unix antes de executar o **CMake** novamente:

```sql
$> make clean
$> rm CMakeCache.txt
```

Ou, no Windows:

```sql
$> devenv MySQL.sln /clean
$> del CMakeCache.txt
```

Antes de perguntar no [MySQL Community Slack], verifique os arquivos no diretório `CMakeFiles` para obter informações úteis sobre a falha. Para registrar um Bug Report, use as instruções fornecidas na Seção 1.5, “How to Report Bugs or Problems”.

#### Compilar a Distribuição

No Unix:

```sql
$> make
$> make VERBOSE=1
```

O segundo comando define `VERBOSE` para mostrar os comandos de cada Source compilado.

Use **gmake** em vez disso em sistemas onde você está usando o GNU **make** e ele foi instalado como **gmake**.

No Windows:

```sql
$> devenv MySQL.sln /build RelWithDebInfo
```

Se você chegou ao estágio de compilação, mas a distribuição não compila (não faz o build), consulte a Seção 2.8.8, “Dealing with Problems Compiling MySQL”, para obter ajuda. Se isso não resolver o problema, registre-o em nosso Database de Bugs usando as instruções fornecidas na Seção 1.5, “How to Report Bugs or Problems”. Se você instalou as versões mais recentes das ferramentas necessárias e elas falham ao tentar processar nossos arquivos de configuração, relate isso também. No entanto, se você receber um erro de `command not found` ou um problema semelhante para ferramentas necessárias, não o reporte. Em vez disso, certifique-se de que todas as ferramentas necessárias estão instaladas e que sua variável `PATH` está configurada corretamente para que seu shell possa encontrá-las.

#### Instalar a Distribuição

No Unix:

```sql
$> make install
```

Isso instala os arquivos sob o diretório de instalação configurado (por default, `/usr/local/mysql`). Você pode precisar executar o comando como `root`.

Para instalar em um diretório específico, adicione um parâmetro `DESTDIR` à linha de comando:

```sql
$> make install DESTDIR="/opt/mysql"
```

Alternativamente, gere arquivos de Installation Package (Pacote de Instalação) que você pode instalar onde quiser:

```sql
$> make package
```

Essa operação produz um ou mais arquivos `.tar.gz` que podem ser instalados como Generic Binary Distribution Packages (Pacotes de Distribuição Binária Genérica). Consulte a Seção 2.2, “Installing MySQL on Unix/Linux Using Generic Binaries”. Se você executar o **CMake** com `-DCPACK_MONOLITHIC_INSTALL=1`, a operação produz um único arquivo. Caso contrário, produz múltiplos arquivos.

No Windows, gere o Data Directory e então crie um Installation Package (Pacote de Instalação) em `.zip` archive:

```sql
$> devenv MySQL.sln /build RelWithDebInfo /project initial_database
$> devenv MySQL.sln /build RelWithDebInfo /project package
```

Você pode instalar o `.zip` archive resultante onde quiser. Consulte a Seção 2.3.4, “Installing MySQL on Microsoft Windows Using a `noinstall` ZIP Archive”.

#### Executar Configuração Pós-Instalação

O restante do processo de instalação envolve a configuração do arquivo de configuração, a criação dos Core Databases e a inicialização do MySQL server. Para instruções, consulte a Seção 2.9, “Postinstallation Setup and Testing”.

Nota

As contas listadas nas Grant Tables do MySQL inicialmente não têm senhas. Após iniciar o server, você deve configurar senhas para elas usando as instruções na Seção 2.9, “Postinstallation Setup and Testing”.