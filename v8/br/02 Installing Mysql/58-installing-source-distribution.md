### 2.8.4 Instalar o MySQL usando uma distribuição de código-fonte padrão

Para instalar o MySQL a partir de uma distribuição de origem padrão:

1. Verifique se o seu sistema satisfaz os requisitos das ferramentas enumerados na secção 2.8.2, "Pré-requisitos de instalação de origem".
2. Obter um ficheiro de distribuição utilizando as instruções da secção 2.1.3, "Como obter o MySQL".
3. Configure, construa e instale a distribuição usando as instruções nesta seção.
4. Executar os procedimentos pós-instalação seguindo as instruções da secção 2.9, "Configuração e ensaio pós-instalação".

O MySQL usa `CMake` como estrutura de construção em todas as plataformas. As instruções dadas aqui devem permitir que você produza uma instalação funcional. Para informações adicionais sobre o uso de `CMake` para construir o MySQL, consulte \[How to Build MySQL Server with CMake] (em inglês).

Se você começar a partir de um RPM de origem, use o seguinte comando para criar um RPM binário que você pode instalar. Se você não tem `rpmbuild`, use `rpm` em vez disso.

```
$> rpmbuild --rebuild --clean MySQL-VERSION.src.rpm
```

O resultado é um ou mais pacotes RPM binários que você instala conforme indicado na Seção 2.5.4, Instalar MySQL no Linux Usando Pacotes RPM do Oracle.

A sequência de instalação a partir de um arquivo comprimido de código-fonte ou distribuição de arquivo Zip é semelhante ao processo de instalação a partir de uma distribuição binária genérica (ver Seção 2.2, Instalar MySQL em Unix/Linux Usando Binários Genéricos), exceto que é usado em todas as plataformas e inclui etapas para configurar e compilar a distribuição. Por exemplo, com uma distribuição de código-fonte de arquivo comprimido em Unix, a sequência de comando de instalação básica parece assim:

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

Uma versão mais detalhada das instruções específicas de construção de código-fonte é mostrada a seguir.

::: info Note

O procedimento mostrado aqui não configura nenhuma senha para contas MySQL. Após seguir o procedimento, siga para a Seção 2.9, "Configuração e Teste de Pós-instalação", para configuração e teste de pós-instalação.

:::

- Executar a configuração prévia
- Obter e Desembalar a Distribuição
- Configurar a distribuição
- Construir a Distribuição
- Instalar a Distribuição
- Executar Configuração pós-instalação

#### Executar a configuração prévia

No Unix, configure o usuário `mysql` que possui o diretório do banco de dados e que deve ser usado para executar o servidor MySQL, e o grupo ao qual esse usuário pertence.

#### Obter e Desembalar a Distribuição

Escolha o diretório sob o qual você deseja descompactar a distribuição e mudar de localização para ele.

Obter um ficheiro de distribuição utilizando as instruções da secção 2.1.3, "Como obter o MySQL".

Desembalar a distribuição para o diretório atual:

- Para descompactar um arquivo comprimido `tar`, `tar` pode descompactar e descompactar a distribuição se tiver suporte à opção `z`:

  ```
  $> tar zxvf mysql-VERSION.tar.gz
  ```

  Se o seu `tar` não tiver suporte à opção `z`, use `gunzip` para descompactar a distribuição e `tar` para desembacá-la:

  ```
  $> gunzip < mysql-VERSION.tar.gz | tar xvf -
  ```

  Alternativamente, `CMake` pode descompactar e descompactar a distribuição:

  ```
  $> cmake -E tar zxvf mysql-VERSION.tar.gz
  ```
- Para descompactar um arquivo Zip, use **WinZip** ou outra ferramenta que possa ler arquivos `.zip`.

Desembalar o arquivo de distribuição cria um diretório chamado `mysql-VERSION`.

#### Configurar a distribuição

Alterar a localização no diretório de nível superior da distribuição desembalada:

```
$> cd mysql-VERSION
```

Crie fora da árvore de origem para manter a árvore limpa. Se o diretório de origem de nível superior é chamado de `mysql-src` sob o seu diretório de trabalho atual, você pode construir em um diretório chamado de `build` no mesmo nível. Crie o diretório e vá lá:

```
$> mkdir bld
$> cd bld
```

Configurar o diretório de compilação. O comando de configuração mínima não inclui opções para substituir os padrões de configuração:

```
$> cmake ../mysql-src
```

O diretório de compilação não precisa estar fora da árvore de origem. Por exemplo, você pode criar em um diretório chamado `build` sob a árvore de origem de nível superior. Para fazer isso, começando com `mysql-src` como seu diretório de trabalho atual, crie o diretório `build` e depois vá para lá:

```
$> mkdir build
$> cd build
```

Configurar o diretório de compilação. O comando de configuração mínima não inclui opções para substituir os padrões de configuração:

```
$> cmake ..
```

Se você tem várias árvores de origem no mesmo nível (por exemplo, para construir várias versões do MySQL), a segunda estratégia pode ser vantajosa. A primeira estratégia coloca todos os diretórios de construção no mesmo nível, o que exige que você escolha um nome exclusivo para cada um. Com a segunda estratégia, você pode usar o mesmo nome para o diretório de construção dentro de cada árvore de origem. As instruções a seguir assumem esta segunda estratégia.

No Windows, especifique o ambiente de desenvolvimento. Por exemplo, os seguintes comandos configuram o MySQL para compilações de 32 bits ou 64 bits, respectivamente:

```
$> cmake .. -G "Visual Studio 12 2013"

$> cmake .. -G "Visual Studio 12 2013 Win64"
```

No macOS, para usar o IDE Xcode:

```
$> cmake .. -G Xcode
```

Quando você executar `Cmake`, você pode querer adicionar opções à linha de comando. Aqui estão alguns exemplos:

- `-DBUILD_CONFIG=mysql_release`: Configure o código-fonte com as mesmas opções de compilação usadas pela Oracle para produzir distribuições binárias para lançamentos oficiais do MySQL.
- `-DCMAKE_INSTALL_PREFIX=dir_name`: Configurar a distribuição para instalação em um local específico.
- `-DCPACK_MONOLITHIC_INSTALL=1`: Fazer com que `make package` gere um único arquivo de instalação em vez de vários arquivos.
- `-DWITH_DEBUG=1`: Construa a distribuição com suporte de depuração.

Para uma lista mais extensa de opções, consulte a Seção 2.8.7, "Opções de configuração de origem do MySQL".

Para listar as opções de configuração, use um dos seguintes comandos:

```
$> cmake .. -L   # overview

$> cmake .. -LH  # overview with help text

$> cmake .. -LAH # all params with help text

$> ccmake ..     # interactive display
```

Se `CMake` falhar, talvez seja necessário reconfigurar executando-o novamente com opções diferentes. Se você reconfigurar, tome nota do seguinte:

- Se `CMake` é executado depois de ter sido executado anteriormente, ele pode usar informações que foram coletadas durante sua invocação anterior. Estas informações são armazenadas em `CMakeCache.txt`. Quando `CMake` é iniciado, ele procura por esse arquivo e lê seu conteúdo, se ele existe, supondo que as informações ainda estão corretas. Essa suposição é inválida quando você reconfigura.
- Cada vez que você executa `CMake`, você deve executar `make` novamente para recompilar. No entanto, você pode querer remover arquivos de objetos antigos de builds anteriores primeiro porque eles foram compilados usando opções de configuração diferentes.

Para evitar que arquivos de objetos antigos ou informações de configuração sejam usados, execute estes comandos no diretório de compilação no Unix antes de re-executar `CMake`:

```
$> make clean
$> rm CMakeCache.txt
```

Ou, no Windows:

```
$> devenv MySQL.sln /clean
$> del CMakeCache.txt
```

Antes de perguntar no \[MySQL Community Slack] ((<https://mysqlcommunity.slack.com/>), verifique os arquivos no diretório `CMakeFiles` para obter informações úteis sobre a falha. Para arquivar um relatório de bug, use as instruções na Seção 1.6, "Como relatar bugs ou problemas".

#### Construir a Distribuição

Em Unix:

```
$> make
$> make VERBOSE=1
```

O segundo comando define `VERBOSE` para mostrar os comandos para cada fonte compilada.

Use `gmake` em vez disso em sistemas onde você está usando o GNU `make` e ele foi instalado como `gmake`.

Em Windows:

```
$> devenv MySQL.sln /build RelWithDebInfo
```

Se você chegou ao estágio de compilação, mas a distribuição não se constrói, consulte a Seção 2.8.8, "Dealing with Problems Compiling MySQL", para obter ajuda. Se isso não resolver o problema, por favor, insira-o em nosso banco de dados de bugs usando as instruções dadas na Seção 1.6, "Como relatar bugs ou problemas". Se você instalou as versões mais recentes das ferramentas necessárias, e elas falham ao tentar processar nossos arquivos de configuração, por favor, informe isso também. No entanto, se você receber um erro `command not found` ou um problema semelhante para ferramentas necessárias, não relate. Em vez disso, verifique se todas as ferramentas necessárias estão instaladas e que sua variável `PATH` está definida corretamente para que seu shell possa encontrá-las.

#### Instalar a Distribuição

Em Unix:

```
$> make install
```

Isso instala os arquivos sob o diretório de instalação configurado (por padrão, `/usr/local/mysql`). Você pode precisar executar o comando como `root`.

Para instalar em um diretório específico, adicione um parâmetro `DESTDIR` à linha de comando:

```
$> make install DESTDIR="/opt/mysql"
```

Alternativamente, gerar arquivos de pacote de instalação que você pode instalar onde quiser:

```
$> make package
```

Esta operação produz um ou mais arquivos `.tar.gz` que podem ser instalados como pacotes de distribuição binários genéricos. Veja Seção 2.2, Instalar MySQL no Unix/Linux Usando Binários Genéricos. Se você executar `CMake` com `-DCPACK_MONOLITHIC_INSTALL=1`, a operação produz um único arquivo. Caso contrário, produz vários arquivos.

No Windows, gerar o diretório de dados, em seguida, criar um pacote de instalação de arquivo:

```
$> devenv MySQL.sln /build RelWithDebInfo /project initial_database
$> devenv MySQL.sln /build RelWithDebInfo /project package
```

Você pode instalar o arquivo resultante `.zip` onde quiser. Veja Seção 2.3.3, Configuração: Manualmente.

#### Executar Configuração pós-instalação

O restante do processo de instalação envolve a configuração do arquivo de configuração, a criação dos bancos de dados principais e o início do servidor MySQL.

::: info Note

As contas que estão listadas nas tabelas de concessão do MySQL inicialmente não têm senhas. Depois de iniciar o servidor, você deve configurar senhas para elas usando as instruções na Seção 2.9, "Configuração e Teste de Pós-instalação".

:::
