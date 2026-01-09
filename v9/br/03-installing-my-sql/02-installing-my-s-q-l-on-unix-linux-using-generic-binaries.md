## 2.2 Instalando o MySQL no Unix/Linux Usando Binários Genéricos

A Oracle fornece um conjunto de distribuições binárias do MySQL. Essas incluem distribuições binárias genéricas no formato de arquivos comprimidos **tar** (arquivos com a extensão `.tar.xz`) para várias plataformas, e binários em formatos de pacotes específicos da plataforma para plataformas selecionadas.

Esta seção abrange a instalação do MySQL a partir de uma distribuição binária de arquivo **tar** comprimido em plataformas Unix/Linux. Para instruções de instalação de distribuições binárias genéricas para Linux com foco nas funcionalidades de segurança do MySQL, consulte o Guia de Implantação Segura. Para outros formatos de pacotes binários específicos da plataforma, consulte as outras seções específicas da plataforma neste manual. Por exemplo, para distribuições para Windows, consulte a Seção 2.3, “Instalando o MySQL no Microsoft Windows”. Consulte a Seção 2.1.3, “Como Obter o MySQL” sobre como obter o MySQL em diferentes formatos de distribuição.

As distribuições binárias do MySQL em arquivos **tar** comprimidos têm nomes na forma `mysql-VERSION-OS.tar.xz`, onde `VERSION` é um número (por exemplo, `9.5.0`), e *`OS`* indica o tipo de sistema operacional para o qual a distribuição é destinada (por exemplo, `pc-linux-i686` ou `winx64`).

Há também uma versão de “instalação mínima” do arquivo **tar** comprimido do MySQL para a distribuição binária genérica do Linux, que tem um nome na forma `mysql-VERSION-OS-GLIBCVER-ARCH-minimal.tar.xz`. A distribuição de instalação mínima exclui os binários de depuração e é despojada de símbolos de depuração, tornando-a significativamente menor do que a distribuição binária regular. Se você optar por instalar a distribuição de instalação mínima, lembre-se de ajustar a diferença no formato de nome de arquivo nas instruções que se seguem.

Avisos

* Se você já instalou o MySQL usando o sistema de gerenciamento de pacotes nativo do seu sistema operacional, como Yum ou APT, você pode encontrar problemas ao instalar usando um binário nativo. Certifique-se de que sua instalação anterior do MySQL tenha sido removida completamente (usando seu sistema de gerenciamento de pacotes) e que quaisquer arquivos adicionais, como versões antigas de seus arquivos de dados, também tenham sido removidos. Você também deve verificar os arquivos de configuração, como `/etc/my.cnf` ou o diretório `/etc/mysql`, e excluí-los.

  Para obter informações sobre a substituição de pacotes de terceiros por pacotes oficiais do MySQL, consulte Substituindo uma Distribuição Terceira Nativa do MySQL ou Substituindo uma Distribuição Nativa do MySQL Usando o Repositório MySQL APT.

* O MySQL depende da biblioteca `libaio`. A inicialização do diretório de dados e as etapas subsequentes de inicialização do servidor falham se essa biblioteca não estiver instalada localmente. Se necessário, instale-a usando o gerenciador de pacotes apropriado. Por exemplo, em sistemas baseados em Yum:

  ```
  $> yum search libaio  # search for info
  $> yum install libaio # install library
  ```

  Ou, em sistemas baseados em APT:

  ```
  $> apt-cache search libaio # search for info
  $> apt-get install libaio1 # install library
  ```

* **Oracle Linux 8 / Red Hat 8** (EL8): Essas plataformas, por padrão, não instalam o arquivo `/lib64/libtinfo.so.5`, que é necessário pelo cliente MySQL **bin/mysql** para os pacotes `mysql-VERSION-el7-x86_64.tar.gz` e `mysql-VERSION-linux-glibc2.12-x86_64.tar.xz`. Para contornar esse problema, instale o pacote `ncurses-compat-libs`:

  ```
  $> yum install ncurses-compat-libs
  ```

* Se não for fornecido nenhum arquivo RPM ou `.deb` específico para sua distribuição pela Oracle (ou pelo fornecedor do seu Linux), você pode tentar os binários genéricos. Em alguns casos, devido a incompatibilidades de bibliotecas ou outros problemas, eles podem não funcionar com sua instalação do Linux. Nesses casos, você pode tentar compilar e instalar o MySQL a partir da fonte. Consulte a Seção 2.8, “Instalando o MySQL a partir da fonte”, para obter mais informações e instruções.

Para instalar uma distribuição binária de arquivo **tar** compactado, descompacte-a no local de instalação que você escolher (geralmente `/usr/local/mysql`). Isso cria os diretórios mostrados na tabela a seguir.

**Tabela 2.3 Layout de Instalação do MySQL para Pacotes Binários Genéricos Unix/Linux**

<table><col style="width: 45%"/><col style="width: 55%"/><thead><tr> <th>Diretório</th> <th>Conteúdo do Diretório</th> </tr></thead><tbody><tr> <td><code class="filename">bin</code></td> <td>Programas do servidor, cliente e utilitários do MySQL</td> </tr><tr> <td><code class="filename">docs</code></td> <td>Manual do MySQL no formato Info</td> </tr><tr> <td><code class="filename">man</code></td> <td>Páginas do manual do Unix</td> </tr><tr> <td><code class="filename">include</code></td> <td>Arquivos de cabeçalho (include)</td> </tr><tr> <td><code class="filename">lib</code></td> <td>Bibliotecas</td> </tr><tr> <td><code class="filename">share</code></td> <td>Mensagens de erro, dicionário e SQL para instalação do banco de dados</td> </tr><tr> <td><code>support-files</code></td> <td>Arquivos de suporte diversos</td> </tr></tbody></table>

Versões de depuração do binário **mysqld** estão disponíveis como **mysqld-debug**. Para compilar sua própria versão de depuração do MySQL a partir de uma distribuição de código-fonte, use as opções de configuração apropriadas para habilitar o suporte de depuração. Veja a Seção 2.8, “Instalando o MySQL a partir de código-fonte”.

Para instalar e usar uma distribuição binária do MySQL, a sequência de comandos é a seguinte:

```
$> groupadd mysql
$> useradd -r -g mysql -s /bin/false mysql
$> cd /usr/local
$> tar xvf /path/to/mysql-VERSION-OS.tar.xz
$> ln -s full-path-to-mysql-VERSION-OS mysql
$> cd mysql
$> mkdir mysql-files
$> chown mysql:mysql mysql-files
$> chmod 750 mysql-files
$> bin/mysqld --initialize --user=mysql
$> bin/mysqld_safe --user=mysql &
# Next command is optional
$> cp support-files/mysql.server /etc/init.d/mysql.server
```

Observação

Este procedimento assume que você tem acesso `root` (administrador) ao seu sistema. Alternativamente, você pode prefixar cada comando usando o comando **sudo** (Linux) ou **pfexec** (Solaris).

O diretório `mysql-files` fornece uma localização conveniente para usar como valor para a variável de sistema `secure_file_priv`, que limita as operações de importação e exportação a um diretório específico. Veja a Seção 7.1.8, “Variáveis do Sistema do Servidor”.

Segue uma versão mais detalhada da descrição anterior para instalar uma distribuição binária.

### Crie um Usuário e Grupo do MySQL

Se o seu sistema não tiver um usuário e grupo para usar para executar o **mysqld**, você pode precisar criá-los. Os seguintes comandos adicionam o grupo `mysql` e o usuário `mysql`. Você pode querer dar um nome diferente ao usuário e ao grupo em vez de `mysql`. Se sim, substitua o nome apropriado nas instruções a seguir. A sintaxe para **useradd** e **groupadd** pode diferir ligeiramente em diferentes versões do Unix/Linux, ou eles podem ter nomes diferentes, como **adduser** e **addgroup**.

```
$> groupadd mysql
$> useradd -r -g mysql -s /bin/false mysql
```

Observação

Como o usuário é necessário apenas para fins de propriedade, e não de login, o comando **useradd** usa as opções `-r` e `-s /bin/false` para criar um usuário que não tem permissões de login no seu host do servidor. Omit essas opções se o seu **useradd** não as suportar.

### Obtenha e Descompacte a Distribuição
```
$> cd /usr/local
```

Escolha o diretório onde você deseja descompactuar a distribuição e altere a localização para ele. O exemplo abaixo descompacta a distribuição no diretório `/usr/local`. As instruções, portanto, assumem que você tem permissão para criar arquivos e diretórios em `/usr/local`. Se esse diretório estiver protegido, você deve realizar a instalação como `root`.

```
$> tar xvf /path/to/mysql-VERSION-OS.tar.xz
```

Obtenha um arquivo de distribuição usando as instruções na Seção 2.1.3, “Como obter o MySQL”. Para uma determinada versão, as distribuições binárias para todas as plataformas são construídas a partir da mesma distribuição de fonte MySQL.

Descompacte a distribuição, o que cria o diretório de instalação. O **tar** pode descomprimir e descompactuar a distribuição se tiver suporte à opção `z`:

```
$> xz -dc /path/to/mysql-VERSION-OS.tar.xz | tar x
```

O comando **tar** cria um diretório chamado `mysql-VERSION-OS`.

Para instalar o MySQL a partir de uma distribuição binária comprimida do **tar**, seu sistema deve ter o **GNU XZ Utils** para descomprimir a distribuição e um **tar** razoável para descompactá-la.

O **GNU tar** é conhecido por funcionar. O **tar** padrão fornecido por alguns sistemas operacionais não é capaz de descompactuar os nomes de arquivos longos na distribuição MySQL. Você deve baixar e instalar o **GNU tar**, ou, se disponível, usar uma versão pré-instalada do **tar** GNU. Geralmente, isso está disponível como **gnutar**, **gtar** ou como **tar** dentro de um diretório de software GNU ou Livre, como `/usr/sfw/bin` ou `/usr/local/bin`. O **GNU tar** está disponível em <http://www.gnu.org/software/tar/>.

Se o seu **tar** não suportar o formato `xz`, use o comando **xz** para descomprimir a distribuição e o **tar** para descompactá-la. Substitua o comando **tar** anterior pelo seguinte comando alternativo para descomprimir e extrair a distribuição:

```
$> ln -s full-path-to-mysql-VERSION-OS mysql
```

Em seguida, crie um link simbólico para o diretório de instalação criado pelo **tar**:

O comando `ln` cria um link simbólico para o diretório de instalação. Isso permite que você se refira mais facilmente a ele como `/usr/local/mysql`. Para evitar ter que digitar o nome do caminho dos programas cliente sempre que estiver trabalhando com o MySQL, você pode adicionar o diretório `/usr/local/mysql/bin` à sua variável `PATH`:

```
$> export PATH=$PATH:/usr/local/mysql/bin
```

### Realizar a Configuração Pós-Instalação

O restante do processo de instalação envolve definir a propriedade da distribuição e as permissões de acesso, inicializar o diretório de dados, iniciar o servidor MySQL e configurar o arquivo de configuração. Para obter instruções, consulte a Seção 2.9, “Configuração Pós-Instalação e Teste”.