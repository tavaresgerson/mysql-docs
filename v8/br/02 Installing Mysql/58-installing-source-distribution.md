### 2.8.4 Instalando o MySQL usando uma distribuição de fonte padrão

Para instalar o MySQL a partir de uma distribuição de fonte padrão:

1. Verifique se o seu sistema atende aos requisitos da ferramenta listados na Seção 2.8.2, “Pré-requisitos para instalação da fonte”.
2. Obtenha um arquivo de distribuição usando as instruções na Seção 2.1.3, “Como obter o MySQL”.
3. Configure, compile e instale a distribuição usando as instruções nesta seção.
4. Realize os procedimentos pós-instalação usando as instruções na Seção 2.9, “Configuração e teste pós-instalação”.

O MySQL usa o `CMake` como framework de compilação em todas as plataformas. As instruções aqui fornecidas devem permitir que você produza uma instalação funcional. Para obter informações adicionais sobre como usar o `CMake` para compilar o MySQL, consulte [Como construir o servidor MySQL com CMake](/doc/internals/pt-BR/cmake.html).

Se você começar a partir de uma distribuição RPM padrão, use o seguinte comando para criar um pacote RPM binário que você pode instalar. Se você não tiver `rpmbuild`, use `rpm` em vez disso.

```
$> rpmbuild --rebuild --clean MySQL-VERSION.src.rpm
```

O resultado são um ou mais pacotes RPM binários que você instala conforme indicado na Seção 2.5.4, “Instalando o MySQL no Linux usando pacotes RPM da Oracle”.

A sequência para a instalação a partir de uma distribuição de fonte comprimida em `tar` ou arquivo ZIP é semelhante ao processo para a instalação a partir de uma distribuição binária genérica (consulte a Seção 2.2, “Instalando o MySQL no Unix/Linux usando binários genéricos”), exceto que é usado em todas as plataformas e inclui etapas para configurar e compilar a distribuição. Por exemplo, com uma distribuição de fonte em `tar` comprimido no Unix, a sequência básica do comando de instalação é a seguinte:

```
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
$> bin/mysqld_safe --user=mysql &
# Next command is optional
$> cp support-files/mysql.server /etc/init.d/mysql.server
```

Uma versão mais detalhada das instruções específicas da fonte e da compilação é mostrada a seguir.

::: info Nota

O procedimento mostrado aqui não configura senhas para as contas do MySQL. Após seguir o procedimento, prossiga para a Seção 2.9, “Configuração e teste pós-instalação”, para a configuração e teste pós-instalação.

* Realizar a configuração prévia
* Obter e desempacotar a distribuição
* Configurar a distribuição
* Construir a distribuição
* Instalar a distribuição
* Realizar a configuração pós-instalação

#### Realizar a Configuração Prévia

No Unix, configure o usuário `mysql` que possui o diretório do banco de dados e que deve ser usado para executar e executar o servidor MySQL, e o grupo ao qual esse usuário pertence. Para obter detalhes, consulte Criar um usuário e grupo mysql. Em seguida, execute as seguintes etapas como o usuário `mysql`, exceto conforme indicado.

#### Obter e Desempacotar a Distribuição

Escolha o diretório sob o qual deseja desempacotar a distribuição e mude para ele.

Obtenha um arquivo de distribuição usando as instruções na Seção 2.1.3, “Como obter o MySQL”.

Desempacote a distribuição no diretório atual:

* Para desempacotar um arquivo `tar` comprimido, o `tar` pode descomprimir e desempacotar a distribuição se tiver suporte à opção `z`:

  ```
  $> tar zxvf mysql-VERSION.tar.gz
  ```

  Se o seu `tar` não tiver suporte à opção `z`, use `gunzip` para descomprimir a distribuição e `tar` para desempacotá-la:

  ```
  $> gunzip < mysql-VERSION.tar.gz | tar xvf -
  ```

  Alternativamente, o `CMake` pode descomprimir e desempacotar a distribuição:

  ```
  $> cmake -E tar zxvf mysql-VERSION.tar.gz
  ```
* Para desempacotar um arquivo Zip, use o **WinZip** ou outra ferramenta que possa ler arquivos `.zip`.

O desempacotamento do arquivo de distribuição cria um diretório chamado `mysql-VERSION`.

#### Configurar a Distribuição

Mude para o diretório de nível superior da distribuição desempaquetada:

```
$> cd mysql-VERSION
```

Construa fora da árvore de origem para manter a árvore limpa. Se o diretório de origem principal estiver nomeado `mysql-src` sob o diretório de trabalho atual, você pode construir em um diretório nomeado `build` no mesmo nível. Crie o diretório e vá até ele:

```
$> mkdir bld
$> cd bld
```

Configure o diretório de construção. O comando de configuração mínimo não inclui opções para sobrescrever os valores padrão de configuração:

```
$> cmake ../mysql-src
```

O diretório de construção não precisa estar fora da árvore de código-fonte. Por exemplo, você pode construir em um diretório chamado `build` sob a árvore de código-fonte de nível superior. Para fazer isso, começando com `mysql-src` como seu diretório de trabalho atual, crie o diretório `build` e vá até lá:

```
$> mkdir build
$> cd build
```

Configure o diretório de construção. O comando de configuração mínimo não inclui opções para sobrescrever os padrões de configuração:

```
$> cmake ..
```

Se você tiver várias árvores de código-fonte no mesmo nível (por exemplo, para construir várias versões do MySQL), a segunda estratégia pode ser vantajosa. A primeira estratégia coloca todos os diretórios de construção no mesmo nível, o que exige que você escolha um nome único para cada um. Com a segunda estratégia, você pode usar o mesmo nome para o diretório de construção dentro de cada árvore de código-fonte. As instruções seguintes assumem essa segunda estratégia.

No Windows, especifique o ambiente de desenvolvimento. Por exemplo, os seguintes comandos configuram o MySQL para compilações de 32 bits ou 64 bits, respectivamente:

```
$> cmake .. -G "Visual Studio 12 2013"

$> cmake .. -G "Visual Studio 12 2013 Win64"
```

No macOS, para usar o IDE Xcode:

```
$> cmake .. -G Xcode
```

Ao executar o `Cmake`, você pode querer adicionar opções à linha de comando. Aqui estão alguns exemplos:

*  `-DBUILD_CONFIG=mysql_release`: Configure a fonte com as mesmas opções de construção usadas pela Oracle para produzir distribuições binárias para lançamentos oficiais do MySQL.
*  `-DCMAKE_INSTALL_PREFIX=dir_name`: Configure a distribuição para instalação em um local específico.
*  `-DCPACK_MONOLITHIC_INSTALL=1`: Faça com que o `make package` gere um único arquivo de instalação em vez de vários arquivos.
*  `-DWITH_DEBUG=1`: Construa a distribuição com suporte de depuração.

Para uma lista mais extensa de opções, consulte a Seção 2.8.7, “Opções de Configuração de Código-Fonte do MySQL”.

Para listar as opções de configuração, use um dos seguintes comandos:

```
$> cmake .. -L   # overview

$> cmake .. -LH  # overview with help text

$> cmake .. -LAH # all params with help text

$> ccmake ..     # interactive display
```

Se o `CMake` falhar, você pode precisar reconfigurar executando-o novamente com opções diferentes. Se você reconfigurar, tome nota do seguinte:

* Se o `CMake` for executado após ter sido executado anteriormente, ele pode usar informações coletadas durante sua invocação anterior. Essas informações são armazenadas no `CMakeCache.txt`. Quando o `CMake` começa, ele procura esse arquivo e lê seu conteúdo, se existir, assumindo que as informações ainda estão corretas. Essa suposição é inválida quando você reconfigura.
* Cada vez que você executa o `CMake`, você deve executar `make` novamente para recompilar. No entanto, você pode querer remover arquivos de objeto antigos de construções anteriores primeiro, pois eles foram compilados usando opções de configuração diferentes.

Para evitar que arquivos de objeto antigos ou informações de configuração sejam usadas, execute esses comandos no diretório de construção no Unix antes de reexecutar o `CMake`:

```
$> make clean
$> rm CMakeCache.txt
```

Ou, no Windows:

```
$> devenv MySQL.sln /clean
$> del CMakeCache.txt
```

Antes de fazer uma pergunta na [Slack da Comunidade MySQL](https://mysqlcommunity.slack.com/), verifique os arquivos no diretório `CMakeFiles` para obter informações úteis sobre o erro. Para fazer um relatório de bug, use as instruções na Seção 1.6, “Como Relatar Bugs ou Problemas”.

#### Construa a Distribuição

No Unix:

```
$> make
$> make VERBOSE=1
```

O segundo comando define `VERBOSE` para mostrar os comandos para cada fonte compilada.

Use `gmake` em vez disso em sistemas onde você está usando o `make` do GNU e ele foi instalado como `gmake`.

No Windows:

```
$> devenv MySQL.sln /build RelWithDebInfo
```

Se você chegou à etapa de compilação, mas a distribuição não compila, consulte a Seção 2.8.8, “Lidando com Problemas de Compilação do MySQL”, para obter ajuda. Se isso não resolver o problema, insira-o em nosso banco de bugs usando as instruções da Seção 1.6, “Como Relatar Bugs ou Problemas”. Se você instalou as versões mais recentes das ferramentas necessárias e elas travam ao tentar processar nossos arquivos de configuração, informe isso também. No entanto, se você receber um erro de `comando não encontrado` ou um problema semelhante para as ferramentas necessárias, não o informe. Em vez disso, certifique-se de que todas as ferramentas necessárias estão instaladas e que sua variável `PATH` está configurada corretamente para que seu shell possa encontrá-las.

#### Instale a Distribuição

No Unix:

```
$> make install
```

Isso instala os arquivos no diretório de instalação configurado (por padrão, `/usr/local/mysql`). Você pode precisar executar o comando como `root`.

Para instalar em um diretório específico, adicione um parâmetro `DESTDIR` à linha de comando:

```
$> make install DESTDIR="/opt/mysql"
```

Alternativamente, gere arquivos de pacote de instalação que você pode instalar onde quiser:

```
$> make package
```

Esta operação produz um ou mais arquivos `.tar.gz` que podem ser instalados como pacotes de distribuição binária genéricos. Consulte a Seção 2.2, “Instalando o MySQL no Unix/Linux Usando Binários Genéricos”. Se você executar o `CMake` com `-DCPACK_MONOLITHIC_INSTALL=1`, a operação produz um único arquivo. Caso contrário, produz vários arquivos.

No Windows, gere o diretório de dados e, em seguida, crie um pacote de instalação de arquivo `.zip`:

```
$> devenv MySQL.sln /build RelWithDebInfo /project initial_database
$> devenv MySQL.sln /build RelWithDebInfo /project package
```

Você pode instalar o pacote de arquivo `.zip` resultante onde quiser. Consulte a Seção 2.3.3, “Configuração: Manual”.

#### Realize o Configuração Pós-Instalação

O restante do processo de instalação envolve a configuração do arquivo de configuração, a criação dos bancos de dados principais e o início do servidor MySQL. Para instruções, consulte a Seção 2.9, “Configuração Pós-Instalação e Teste”.

::: info Nota
Português (Brasil):

As contas listadas nas tabelas de concessão do MySQL inicialmente não têm senhas. Após iniciar o servidor, você deve configurá-las usando as instruções na Seção 2.9, “Configuração e Teste Pós-Instalação”.