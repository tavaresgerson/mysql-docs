## 2.2 Instalando o MySQL no Unix/Linux Usando Binários Genéricos

A Oracle fornece um conjunto de distribuições binárias do MySQL. Essas incluem distribuições binárias genéricas no formato de arquivos `tar` comprimidos (arquivos com a extensão `.tar.xz`) para várias plataformas, e binários em formatos de pacotes específicos da plataforma para plataformas selecionadas.

Esta seção abrange a instalação do MySQL a partir de uma distribuição binária de arquivo `tar` comprimido em plataformas Unix/Linux. Para instruções de instalação de distribuições binárias genéricas para Linux com foco nas funcionalidades de segurança do MySQL, consulte o Guia de Implantação Segura. Para outros formatos de pacotes binários específicos da plataforma, consulte as outras seções específicas da plataforma neste manual. Por exemplo, para distribuições para Windows, consulte a Seção 2.3, “Instalando o MySQL no Microsoft Windows”. Consulte a Seção 2.1.3, “Como Obter o MySQL” sobre como obter o MySQL em diferentes formatos de distribuição.

As distribuições binárias de arquivo `tar` comprimidos do MySQL têm nomes na forma `mysql-VERSION-OS.tar.xz`, onde `VERSION` é um número (por exemplo, `8.4.6`), e *`OS`* indica o tipo de sistema operacional para o qual a distribuição é destinada (por exemplo, `pc-linux-i686` ou `winx64`).

Há também uma versão de “instalação mínima” do arquivo `tar` comprimido do MySQL para a distribuição binária genérica do Linux, que tem um nome na forma `mysql-VERSION-OS-GLIBCVER-ARCH-minimal.tar.xz`. A distribuição de instalação mínima exclui os binários de depuração e é despojada de símbolos de depuração, tornando-a significativamente menor do que a distribuição binária regular. Se você optar por instalar a distribuição de instalação mínima, lembre-se de ajustar a diferença no formato de nome de arquivo nas instruções que se seguem.

Avisos

* Se você já instalou o MySQL usando o sistema de gerenciamento de pacotes nativo do seu sistema operacional, como Yum ou APT, você pode encontrar problemas ao tentar instalá-lo usando um binário nativo. Certifique-se de que sua instalação anterior do MySQL tenha sido removida completamente (usando seu sistema de gerenciamento de pacotes) e que quaisquer arquivos adicionais, como versões antigas de seus arquivos de dados, também tenham sido removidos. Você também deve verificar os arquivos de configuração, como `/etc/my.cnf` ou o diretório `/etc/mysql`, e excluí-los.

  Para obter informações sobre como substituir pacotes de terceiros por pacotes oficiais do MySQL, consulte Substituindo uma Distribuição Terceira Nativa do MySQL ou Substituindo uma Distribuição Nativa do MySQL Usando o Repositório MySQL APT.
* O MySQL depende da biblioteca `libaio`. A inicialização do diretório de dados e os passos subsequentes de inicialização do servidor falham se essa biblioteca não estiver instalada localmente. Se necessário, instale-a usando o gerenciador de pacotes apropriado. Por exemplo, em sistemas baseados em Yum:

  ```bash
  $> yum search libaio  # search for info
  $> yum install libaio # install library
  ```

  Ou, em sistemas baseados em APT:

  ```bash
  $> apt-cache search libaio # search for info
  $> apt-get install libaio1 # install library
  ```
* **Oracle Linux 8 / Red Hat 8** (EL8): Essas plataformas, por padrão, não instalam o arquivo `/lib64/libtinfo.so.5`, que é necessário pelo cliente MySQL `bin/mysql` para os pacotes `mysql-VERSION-el7-x86_64.tar.gz` e `mysql-VERSION-linux-glibc2.12-x86_64.tar.xz`. Para contornar esse problema, instale o pacote `ncurses-compat-libs`:

  ```bash
  $> yum install ncurses-compat-libs
  ```
* Se nenhum arquivo RPM ou `.deb` específico para sua distribuição for fornecido pela Oracle (ou pelo seu fornecedor de Linux), você pode tentar os binários genéricos. Em alguns casos, devido a incompatibilidades de bibliotecas ou outros problemas, eles podem não funcionar com sua instalação do Linux. Nesses casos, você pode tentar compilar e instalar o MySQL a partir da fonte. Consulte a Seção 2.8, “Instalando o MySQL a partir da Fonte”, para obter mais informações e instruções.

Para instalar uma distribuição binária de arquivo `tar` compactado, descompacte-a no local de instalação que você escolher (tipicamente `/usr/local/mysql`). Isso cria os diretórios mostrados na tabela a seguir.

**Tabela 2.3 Layout de Instalação do MySQL para Pacote Binário Genérico Unix/Linux**

<table><thead><tr> <th>Diretório</th> <th>Conteúdo do Diretório</th> </tr></thead><tbody><tr> <td><code>bin</code></td> <td>Programas do servidor, cliente e utilitários do <code>mysqld</code></td> </tr><tr> <td><code>docs</code></td> <td>Manual do MySQL no formato Info</td> </tr><tr> <td><code>man</code></td> <td>Páginas de manual do Unix</td> </tr><tr> <td><code>include</code></td> <td>Arquivos de inclusão (cabeçalho)</td> </tr><tr> <td><code>lib</code></td> <td>Bibliotecas</td> </tr><tr> <td><code>share</code></td> <td>Mensagens de erro, dicionário e SQL para instalação do banco de dados</td> </tr><tr> <td><code>support-files</code></td> <td>Arquivos de suporte diversos</td> </tr></tbody></table>

Versões de depuração do pacote binário do <code>mysqld</code> estão disponíveis como `mysqld-debug`. Para compilar sua própria versão de depuração do MySQL a partir de uma distribuição de código-fonte, use as opções de configuração apropriadas para habilitar o suporte de depuração. Veja a Seção 2.8, “Instalando o MySQL a partir de Código-Fonte”.

Para instalar e usar uma distribuição binária do MySQL, a sequência de comandos é a seguinte:

```bash
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

::: info Nota

Este procedimento assume que você tem acesso `root` (administrador) ao seu sistema. Alternativamente, você pode prefixar cada comando usando o comando `sudo` (Linux) ou `pfexec` (Solaris).

:::

O diretório `mysql-files` fornece uma localização conveniente para usar como valor para a variável de sistema `secure_file_priv`, que limita as operações de importação e exportação a um diretório específico.

Segue uma versão mais detalhada da descrição anterior para a instalação de uma distribuição binária.

### Crie um Usuário e Grupo do MySQL


Se o seu sistema não tiver um usuário e um grupo para usar no comando `mysqld`, você pode precisar criá-los. Os seguintes comandos adicionam o grupo `mysql` e o usuário `mysql`. Se quiser dar um nome diferente ao usuário e ao grupo, em vez de `mysql`, substitua o nome apropriado nas instruções a seguir. A sintaxe do comando `useradd` e `groupadd` pode variar ligeiramente em diferentes versões do Unix/Linux, ou pode ter nomes diferentes, como `adduser` e `addgroup`.

```bash
$> groupadd mysql
$> useradd -r -g mysql -s /bin/false mysql
```

::: info Nota

Como o usuário é necessário apenas para fins de propriedade, e não de login, o comando `useradd` usa as opções `-r` e `-s /bin/false` para criar um usuário que não tem permissões de login no seu host do servidor. Omit essas opções se o seu `useradd` não as suportar.

:::

### Obter e Descompactar a Distribuição

Escolha o diretório onde você deseja descompactar a distribuição e mude para ele. O exemplo abaixo descompacta a distribuição em `/usr/local`. As instruções assumem, portanto, que você tem permissão para criar arquivos e diretórios em `/usr/local`. Se esse diretório estiver protegido, você deve realizar a instalação como `root`.

```bash
$> cd /usr/local
```

Obtenha um arquivo de distribuição usando as instruções na Seção 2.1.3, “Como obter o MySQL”. Para uma determinada versão, as distribuições binárias para todas as plataformas são construídas a partir da mesma distribuição de fonte do MySQL.

Descompacte a distribuição, que cria o diretório de instalação. O `tar` pode descomprimir e descompactar a distribuição se tiver suporte à opção `z`:

```bash
$> tar xvf /path/to/mysql-VERSION-OS.tar.xz
```

O comando `tar` cria um diretório chamado `mysql-VERSION-OS`.

Para instalar o MySQL a partir de uma distribuição binária comprimida em `tar`, seu sistema deve ter os `GNU XZ Utils` para descomprimir a distribuição e um `tar` razoável para descompac-la.

O GNU `tar` é conhecido por funcionar. O `tar` padrão fornecido por alguns sistemas operacionais não consegue descompactuar os nomes de arquivos longos na distribuição do MySQL. Você deve baixar e instalar o GNU `tar`, ou, se disponível, usar uma versão pré-instalada do GNU tar. Geralmente, isso está disponível como `gnutar`, `gtar` ou como `tar` dentro de um diretório de Software Livre ou GNU, como `/usr/sfw/bin` ou `/usr/local/bin`. O GNU `tar` está disponível em <http://www.gnu.org/software/tar/>.

Se o seu `tar` não suportar o formato `xz`, use o comando `xz` para descompactuar a distribuição e `tar` para descompactuar. Substitua o comando de `tar` anterior pelo seguinte comando alternativo para descomprimir e extrair a distribuição:

```bash
$> xz -dc /path/to/mysql-VERSION-OS.tar.xz | tar x
```

Em seguida, crie um link simbólico para o diretório de instalação criado pelo `tar`:

```bash
$> ln -s full-path-to-mysql-VERSION-OS mysql
```

O comando `ln` cria um link simbólico para o diretório de instalação. Isso permite que você se refira mais facilmente a ele como `/usr/local/mysql`. Para evitar ter que digitar o nome do caminho dos programas cliente sempre que estiver trabalhando com o MySQL, você pode adicionar o diretório `/usr/local/mysql/bin` à sua variável `PATH`:

```bash
$> export PATH=$PATH:/usr/local/mysql/bin
```

### Realize a Configuração Pós-Instalação

O restante do processo de instalação envolve definir a propriedade e as permissões de acesso da distribuição, inicializar o diretório de dados, iniciar o servidor MySQL e configurar o arquivo de configuração. Para instruções, consulte a Seção 2.9, “Configuração Pós-Instalação e Teste”.