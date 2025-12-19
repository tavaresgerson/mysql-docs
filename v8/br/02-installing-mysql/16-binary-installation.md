## 2.2 Instalar o MySQL em Unix/Linux usando binários genéricos

O Oracle fornece um conjunto de distribuições binárias do MySQL. Estas incluem distribuições binárias genéricas na forma de arquivos **tar** compactados (arquivos com uma extensão `.tar.xz`) para várias plataformas, e binários em formatos de pacote específicos para plataformas selecionadas.

Esta seção abrange a instalação do MySQL a partir de uma distribuição binária de arquivos **tar** comprimidos em plataformas Unix/Linux. Para instruções de instalação de distribuição binária genéricas do Linux com foco em recursos de segurança do MySQL, consulte o Guia de implantação segura. Para outros formatos de pacotes binários específicos da plataforma, consulte as outras seções específicas da plataforma neste manual. Por exemplo, para distribuições do Windows, consulte a Seção 2.3, Installing MySQL on Microsoft Windows. Veja a Seção 2.1.3, How to Get MySQL sobre como obter o MySQL em diferentes formatos de distribuição.

As distribuições binárias de arquivos **tar** compactados do MySQL têm nomes da forma `mysql-VERSION-OS.tar.xz`, onde `VERSION` é um número (por exemplo, `8.4.6`), e `OS` indica o tipo de sistema operacional para o qual a distribuição é destinada (por exemplo, `pc-linux-i686` ou `winx64`).

Há também uma versão de instalação mínima do arquivo **tar** comprimido do MySQL para a distribuição binária genérica do Linux, que tem um nome da forma `mysql-VERSION-OS-GLIBCVER-ARCH-minimal.tar.xz`.

Advertências

- Se você já instalou o MySQL usando o sistema de gerenciamento de pacotes nativo do sistema operacional, como o Yum ou o APT, você pode ter problemas ao instalar usando um binário nativo. Certifique-se de que sua instalação anterior do MySQL foi removida completamente (usando seu sistema de gerenciamento de pacotes) e que quaisquer arquivos adicionais, como versões antigas de seus arquivos de dados, também foram removidos. Você também deve verificar se há arquivos de configuração, como o `/etc/my.cnf` ou o `/etc/mysql` diretório e excluí-los.

  Para obter informações sobre a substituição de pacotes de terceiros por pacotes oficiais do MySQL, consulte Substituir uma distribuição nativa de terceiros do MySQL ou Substituir uma distribuição nativa do MySQL Usando o Repositório APT do MySQL.
- O MySQL tem uma dependência da biblioteca `libaio`. A inicialização do diretório de dados e as etapas subsequentes de inicialização do servidor falham se esta biblioteca não for instalada localmente. Se necessário, instale-a usando o gerenciador de pacotes apropriado. Por exemplo, em sistemas baseados em Yum:

  ```
  $> yum search libaio  # search for info
  $> yum install libaio # install library
  ```

  Ou, em sistemas baseados em APT:

  ```
  $> apt-cache search libaio # search for info
  $> apt-get install libaio1 # install library
  ```
- **Oracle Linux 8 / Red Hat 8** (EL8): Essas plataformas por padrão não instalam o arquivo `/lib64/libtinfo.so.5`, que é exigido pelo cliente MySQL **bin/mysql** para os pacotes `mysql-VERSION-el7-x86_64.tar.gz` e `mysql-VERSION-linux-glibc2.12-x86_64.tar.xz`.

  ```
  $> yum install ncurses-compat-libs
  ```
- Se nenhum arquivo RPM ou `.deb` específico para sua distribuição for fornecido pela Oracle (ou pelo seu fornecedor Linux), você pode tentar os binários genéricos. Em alguns casos, devido a incompatibilidades de biblioteca ou outros problemas, eles podem não funcionar com sua instalação Linux. Nesses casos, você pode tentar compilar e instalar o MySQL a partir do código-fonte. Veja a Seção 2.8, "Instalar o MySQL a partir do código-fonte", para mais informações e instruções.

Para instalar uma distribuição binária de arquivos **tar** compactados, desempaquete-o no local de instalação escolhido (normalmente `/usr/local/mysql`). Isso cria os diretórios mostrados na tabela a seguir.

**Tabela 2.3 Layout de instalação do MySQL para pacote binário genérico Unix/Linux**

<table><col style="width: 45%"/><col style="width: 55%"/><thead><tr> <th>Repertório</th> <th>Conteúdo do diretório</th> </tr></thead><tbody><tr> <td>[[<code>bin</code>]]</td> <td><span><strong>- Não ,</strong></span>Programas de servidor, de cliente e de utilidade</td> </tr><tr> <td>[[<code>docs</code>]]</td> <td>Manual MySQL em formato Info</td> </tr><tr> <td>[[<code>man</code>]]</td> <td>Páginas do manual do Unix</td> </tr><tr> <td>[[<code>include</code>]]</td> <td>Incluir arquivos de cabeçalho</td> </tr><tr> <td>[[<code>lib</code>]]</td> <td>Bibliotecas</td> </tr><tr> <td>[[<code>share</code>]]</td> <td>Mensagens de erro, dicionário e SQL para instalação de banco de dados</td> </tr><tr> <td>[[<code>support-files</code>]]</td> <td>Arquivos de apoio diversos</td> </tr></tbody></table>

As versões de depuração do **mysqld** binário estão disponíveis como **mysqld-debug**. Para compilar sua própria versão de depuração do MySQL a partir de uma distribuição de origem, use as opções de configuração apropriadas para habilitar o suporte de depuração. Veja Seção 2.8, "Instalar o MySQL a partir da fonte".

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

::: info Note

Este procedimento pressupõe que você tenha acesso de `root` (administrador) ao seu sistema. Alternativamente, você pode prefixar cada comando usando o comando **sudo** (Linux) ou **pfexec** (Solaris).

:::

O diretório `mysql-files` fornece uma localização conveniente para usar como o valor da variável do sistema `secure_file_priv`, que limita as operações de importação e exportação a um diretório específico.

Segue-se uma versão mais detalhada da descrição anterior para a instalação de uma distribuição binária.

### Criar um usuário e um grupo mysql

Se o seu sistema ainda não tiver um usuário e um grupo para usar para executar **mysqld**, você pode precisar criá-los. Os seguintes comandos adicionam o grupo `mysql` e o usuário `mysql`. Você pode querer chamar o usuário e o grupo de outra coisa em vez de `mysql`. Se assim for, substitua o nome apropriado nas instruções a seguir. A sintaxe para **useradd** e **graddoup** pode diferir ligeiramente em diferentes versões do Unix/Linux, ou eles podem ter nomes diferentes, como **adduser** e **addgroup**.

```
$> groupadd mysql
$> useradd -r -g mysql -s /bin/false mysql
```

::: info Note

Como o usuário é necessário apenas para fins de propriedade, não para fins de login, o comando **useradd** usa as opções `-r` e `-s /bin/false` para criar um usuário que não tenha permissões de login para o seu servidor host. Omita essas opções se o seu **useradd** não as suportar.

:::

### Obter e Desembalar a Distribuição

Escolha o diretório sob o qual você deseja descompactar a distribuição e mudar o local para ele. O exemplo aqui descompacta a distribuição sob `/usr/local`. As instruções, portanto, assumem que você tem permissão para criar arquivos e diretórios em `/usr/local`. Se esse diretório for protegido, você deve executar a instalação como `root`.

```
$> cd /usr/local
```

Obter um arquivo de distribuição usando as instruções na Seção 2.1.3, "Como Obter o MySQL". Para uma determinada versão, distribuições binárias para todas as plataformas são construídas a partir da mesma distribuição de origem do MySQL.

Desembalar a distribuição, que cria o diretório de instalação. **tar** pode descompactar e desembalar a distribuição se tiver suporte à opção `z`:

```
$> tar xvf /path/to/mysql-VERSION-OS.tar.xz
```

O comando **tar** cria um diretório chamado `mysql-VERSION-OS`.

Para instalar o MySQL a partir de uma distribuição binária de arquivos **tar** compactados, seu sistema deve ter GNU `XZ Utils` para descompactar a distribuição e um **tar** razoável para descompactá-la.

O GNU **tar** é conhecido por funcionar. O **tar** padrão fornecido com alguns sistemas operacionais não é capaz de descompactar os nomes de arquivos longos na distribuição MySQL. Você deve baixar e instalar o GNU **tar**, ou se disponível, usar uma versão pré-instalada do GNU tar. Normalmente, isso está disponível como **gnutar**, **gtar**, ou como **tar** dentro de um diretório GNU ou Software Livre, como `/usr/sfw/bin` ou `/usr/local/bin`.

Se o seu **tar** não suporta o formato `xz` então use o comando **xz** para descompactar a distribuição e **tar** para descompactá-la. Substitua o comando **tar** anterior pelo seguinte comando alternativo para descompactar e extrair a distribuição:

```
$> xz -dc /path/to/mysql-VERSION-OS.tar.xz | tar x
```

Em seguida, crie um link simbólico para o diretório de instalação criado por **tar**:

```
$> ln -s full-path-to-mysql-VERSION-OS mysql
```

O comando `ln` faz um link simbólico para o diretório de instalação. Isso permite que você se refira mais facilmente a ele como `/usr/local/mysql`. Para evitar ter que digitar o nome do caminho dos programas cliente sempre quando estiver trabalhando com o MySQL, você pode adicionar o diretório `/usr/local/mysql/bin` à sua variável `PATH`:

```
$> export PATH=$PATH:/usr/local/mysql/bin
```

### Executar Configuração pós-instalação

O restante do processo de instalação envolve a definição de propriedade da distribuição e permissões de acesso, inicialização do diretório de dados, inicialização do servidor MySQL e configuração do arquivo de configuração.
