## 2.2 Instalando MySQL em Unix/Linux Usando Binários Genéricos

A Oracle fornece um conjunto de distribuições binárias do MySQL. Estas incluem distribuições binárias genéricas na forma de arquivos **tar** compactados (arquivos com a extensão `.tar.gz`) para diversas plataformas, e binários em formatos de pacote específicos da plataforma para plataformas selecionadas.

Esta seção aborda a instalação do MySQL a partir de uma distribuição binária de arquivo **tar** compactado em plataformas Unix/Linux. Para instruções de instalação de distribuição binária genérica do Linux, com foco em recursos de segurança do MySQL, consulte o Guia de Implantação Segura (Secure Deployment Guide). Para outros formatos de pacote binário específicos da plataforma, consulte as outras seções específicas da plataforma neste manual. Por exemplo, para distribuições Windows, consulte Seção 2.3, “Instalando MySQL no Microsoft Windows”. Consulte Seção 2.1.3, “Como Obter MySQL” sobre como obter MySQL em diferentes formatos de distribuição.

As distribuições binárias de arquivo **tar** compactado do MySQL têm nomes no formato `mysql-VERSION-OS.tar.gz`, onde `VERSION` é um número (por exemplo, `5.7.44`) e *`OS`* indica o tipo de sistema operacional para o qual a distribuição se destina (por exemplo, `pc-linux-i686` ou `winx64`).

Avisos

* Se você instalou o MySQL anteriormente usando o sistema de gerenciamento de pacotes nativo do seu sistema operacional, como Yum ou APT, você pode ter problemas ao instalar usando um binário nativo. Certifique-se de que sua instalação anterior do MySQL tenha sido removida por completo (usando seu sistema de gerenciamento de pacotes) e que quaisquer arquivos adicionais, como versões antigas de seus arquivos de dados, também tenham sido removidos. Você também deve verificar arquivos de configuração como `/etc/my.cnf` ou o diretório `/etc/mysql` e excluí-los.

  Para obter informações sobre como substituir pacotes de terceiros por pacotes oficiais do MySQL, consulte o guia APT relacionado ou o guia Yum.

* O MySQL tem uma dependência da biblioteca `libaio`. A inicialização do Data directory e as etapas subsequentes de inicialização do server falharão se esta biblioteca não estiver instalada localmente. Se necessário, instale-a usando o gerenciador de pacotes apropriado. Por exemplo, em sistemas baseados em Yum:

  ```sql
  $> yum search libaio  # search for info
  $> yum install libaio # install library
  ```

  Ou, em sistemas baseados em APT:

  ```sql
  $> apt-cache search libaio # search for info
  $> apt-get install libaio1 # install library
  ```

* *Para MySQL 5.7.19 e posterior:* Foi adicionado suporte para Non-Uniform Memory Access (NUMA) à build genérica do Linux, que agora tem uma dependência da biblioteca `libnuma`; se a biblioteca não tiver sido instalada no seu sistema, use o gerenciador de pacotes do seu sistema para pesquisá-la e instalá-la (consulte o item anterior para alguns comandos de exemplo).

* **SLES 11**: A partir do MySQL 5.7.19, o formato do pacote tarball genérico do Linux é EL6 em vez de EL5. Como efeito colateral, o client MySQL **bin/mysql** precisa de `libtinfo.so.5`.

  Uma solução alternativa é criar um symlink, como **ln -s libncurses.so.5.6 /lib64/libtinfo.so.5** em sistemas de 64 bits ou **ln -s libncurses.so.5.6 /lib/libtinfo.so.5** em sistemas de 32 bits.

* Se nenhum arquivo RPM ou `.deb` específico para sua distribuição for fornecido pela Oracle (ou pelo seu fornecedor Linux), você pode tentar os binários genéricos. Em alguns casos, devido a incompatibilidades de libraries ou outros problemas, estes podem não funcionar com sua instalação Linux. Nesses casos, você pode tentar compilar e instalar o MySQL a partir do Source. Consulte Seção 2.8, “Instalando MySQL a partir do Source”, para obter mais informações e instruções.

Para instalar uma distribuição binária de arquivo **tar** compactado, descompacte-o no local de instalação que você escolher (geralmente `/usr/local/mysql`). Isso cria os diretórios mostrados na tabela a seguir.

**Tabela 2.3 Layout de Instalação do MySQL para Pacote Binário Genérico Unix/Linux**

| Diretório | Conteúdo do Diretório |
|---|---|
| `bin` | Server **mysqld**, client e programas utilitários |
| `docs` | Manual do MySQL no formato Info |
| `man` | Páginas de manual Unix |
| `include` | Arquivos Include (header) |
| `lib` | Libraries |
| `share` | Mensagens de erro, dicionário e SQL para instalação do database |
| `support-files` | Arquivos de suporte diversos |

Versões Debug do binário **mysqld** estão disponíveis como **mysqld-debug**. Para compilar sua própria versão debug do MySQL a partir de uma distribuição Source, use as opções de configuração apropriadas para habilitar o suporte a debugging. Consulte Seção 2.8, “Instalando MySQL a partir do Source”.

Para instalar e usar uma distribuição binária do MySQL, a sequência de comandos se parece com esta:

```sql
$> groupadd mysql
$> useradd -r -g mysql -s /bin/false mysql
$> cd /usr/local
$> tar zxvf /path/to/mysql-VERSION-OS.tar.gz
$> ln -s full-path-to-mysql-VERSION-OS mysql
$> cd mysql
$> mkdir mysql-files
$> chown mysql:mysql mysql-files
$> chmod 750 mysql-files
$> bin/mysqld --initialize --user=mysql
$> bin/mysql_ssl_rsa_setup
$> bin/mysqld_safe --user=mysql &
# Next command is optional
$> cp support-files/mysql.server /etc/init.d/mysql.server
```

**Nota**

Este procedimento assume que você tem acesso `root` (administrador) ao seu sistema. Alternativamente, você pode prefixar cada comando usando o comando **sudo** (Linux) ou **pfexec** (Solaris).

O diretório `mysql-files` fornece um local conveniente para ser usado como valor para a variável de sistema `secure_file_priv`, que limita as operações de importação e exportação a um diretório específico. Consulte Seção 5.1.7, “Variáveis de Sistema do Server”.

Segue-se uma versão mais detalhada da descrição anterior para instalar uma distribuição binária.

### Crie um User e Group mysql

Se o seu sistema ainda não tiver um user e group para usar para executar o **mysqld**, você pode precisar criá-los. Os comandos a seguir adicionam o group `mysql` e o user `mysql`. Você pode querer chamar o user e o group de outra forma em vez de `mysql`. Se sim, substitua o nome apropriado nas instruções a seguir. A sintaxe para **useradd** e **groupadd** pode ser ligeiramente diferente em diferentes versões do Unix/Linux, ou eles podem ter nomes diferentes, como **adduser** e **addgroup**.

```sql
$> groupadd mysql
$> useradd -r -g mysql -s /bin/false mysql
```

**Nota**

Como o user é necessário apenas para fins de propriedade, e não para fins de login, o comando **useradd** usa as opções `-r` e `-s /bin/false` para criar um user que não tem permissões de login para o seu host server. Omita essas opções se o seu **useradd** não as suportar.

### Obtenha e Descompacte a Distribuição

Escolha o diretório sob o qual você deseja descompactar a distribuição e mude o local para ele. O exemplo aqui descompacta a distribuição em `/usr/local`. As instruções, portanto, assumem que você tem permissão para criar arquivos e diretórios em `/usr/local`. Se esse diretório estiver protegido, você deve realizar a instalação como `root`.

```sql
$> cd /usr/local
```

Obtenha um arquivo de distribuição usando as instruções na Seção 2.1.3, “Como Obter MySQL”. Para um determinado release, as distribuições binárias para todas as plataformas são criadas a partir da mesma distribuição source do MySQL.

Descompacte a distribuição, o que cria o diretório de instalação. O **tar** pode descompactar e empacotar a distribuição se tiver suporte à opção `z`:

```sql
$> tar zxvf /path/to/mysql-VERSION-OS.tar.gz
```

O comando **tar** cria um diretório chamado `mysql-VERSION-OS`.

Para instalar o MySQL a partir de uma distribuição binária de arquivo **tar** compactado, seu sistema deve ter o `gunzip` GNU para descompactar a distribuição e um **tar** razoável para desempacotá-la. Se o seu programa **tar** suportar a opção `z`, ele pode descompactar e desempacotar o arquivo.

O **tar** GNU é conhecido por funcionar. O **tar** padrão fornecido com alguns sistemas operacionais não é capaz de desempacotar os nomes de arquivo longos na distribuição MySQL. Você deve fazer o download e instalar o **tar** GNU ou, se disponível, usar uma versão pré-instalada do **tar** GNU. Geralmente, ele está disponível como **gnutar**, **gtar**, ou como **tar** dentro de um diretório GNU ou Free Software, como `/usr/sfw/bin` ou `/usr/local/bin`. O **tar** GNU está disponível em <http://www.gnu.org/software/tar/>.

Se o seu **tar** não tiver suporte à opção `z`, use **gunzip** para descompactar a distribuição e **tar** para desempacotá-la. Substitua o comando **tar** anterior pelo seguinte comando alternativo para descompactar e extrair a distribuição:

```sql
$> gunzip < /path/to/mysql-VERSION-OS.tar.gz | tar xvf -
```

Em seguida, crie um symbolic link para o diretório de instalação criado pelo **tar**:

```sql
$> ln -s full-path-to-mysql-VERSION-OS mysql
```

O comando `ln` cria um symbolic link para o diretório de instalação. Isso permite que você se refira a ele mais facilmente como `/usr/local/mysql`. Para evitar ter que digitar sempre o nome do caminho dos programas client ao trabalhar com MySQL, você pode adicionar o diretório `/usr/local/mysql/bin` à sua variável `PATH`:

```sql
$> export PATH=$PATH:/usr/local/mysql/bin
```

### Execute a Configuração Pós-Instalação

O restante do processo de instalação envolve a definição de propriedade e permissões de acesso da distribuição, a inicialização do data directory, a inicialização do MySQL server e a configuração do arquivo de configuração. Para obter instruções, consulte Seção 2.9, “Configuração Pós-Instalação e Teste”.