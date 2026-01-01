## 2.2 Instalar o MySQL no Unix/Linux usando binários genéricos

A Oracle oferece um conjunto de distribuições binárias do MySQL. Essas incluem distribuições binárias genéricas em formato de arquivos **tar** comprimidos (arquivos com a extensão `.tar.gz`) para várias plataformas e binários em formatos de pacotes específicos para plataformas selecionadas.

Esta seção abrange a instalação do MySQL a partir de uma distribuição binária em formato **tar** comprimido em plataformas Unix/Linux. Para instruções de instalação de distribuição binária genérica para Linux com foco nas funcionalidades de segurança do MySQL, consulte o Guia de Implantação Segura. Para outros formatos de pacotes binários específicos da plataforma, consulte as outras seções específicas da plataforma neste manual. Por exemplo, para distribuições para Windows, consulte a Seção 2.3, “Instalando o MySQL no Microsoft Windows”. Consulte a Seção 2.1.3, “Como Obter o MySQL”, sobre como obter o MySQL em diferentes formatos de distribuição.

As distribuições binárias de arquivos compactados **tar** do MySQL têm nomes na forma `mysql-VERSÃO-SISTEMA.tar.gz`, onde `VERSÃO` é um número (por exemplo, `5.7.44`) e *`SISTEMA`* indica o tipo de sistema operacional para o qual a distribuição é destinada (por exemplo, `pc-linux-i686` ou `winx64`).

Avisos

- Se você já instalou o MySQL usando o sistema de gerenciamento de pacotes nativo do seu sistema operacional, como Yum ou APT, você pode enfrentar problemas ao tentar instalá-lo usando um binário nativo. Certifique-se de que sua instalação anterior do MySQL tenha sido removida completamente (usando seu sistema de gerenciamento de pacotes) e que quaisquer arquivos adicionais, como versões antigas de seus arquivos de dados, também tenham sido removidos. Você também deve verificar os arquivos de configuração, como `/etc/my.cnf` ou o diretório `/etc/mysql`, e excluí-los.

  Para obter informações sobre a substituição de pacotes de terceiros por pacotes oficiais do MySQL, consulte o guia relacionado do APT ou do Yum.

- O MySQL depende da biblioteca `libaio`. A inicialização do diretório de dados e os passos subsequentes de inicialização do servidor falham se essa biblioteca não estiver instalada localmente. Se necessário, instale-a usando o gerenciador de pacotes apropriado. Por exemplo, em sistemas baseados no Yum:

  ```sql
  $> yum search libaio  # search for info
  $> yum install libaio # install library
  ```

  Ou, em sistemas baseados em APT:

  ```sql
  $> apt-cache search libaio # search for info
  $> apt-get install libaio1 # install library
  ```

- *Para o MySQL 5.7.19 e versões posteriores:* O suporte ao Acesso Não Uniforme à Memória (NUMA) foi adicionado à compilação genérica do Linux, que agora depende da biblioteca `libnuma`; se a biblioteca não tiver sido instalada no seu sistema, use o gerenciador de pacotes do seu sistema para procurá-la e instalá-la (consulte o item anterior para obter alguns comandos de exemplo).

- **SLES 11**: A partir do MySQL 5.7.19, o formato do pacote tarball genérico do Linux é EL6, em vez de EL5. Como efeito colateral, o cliente MySQL **bin/mysql** precisa do `libtinfo.so.5`.

  Uma solução é criar um link simbólico, como **ln -s libncurses.so.5.6 /lib64/libtinfo.so.5** em sistemas de 64 bits ou **ln -s libncurses.so.5.6 /lib/libtinfo.so.5** em sistemas de 32 bits.

- Se o Oracle (ou o fornecedor do seu Linux) não fornecer nenhum arquivo RPM ou `.deb` específico para sua distribuição, você pode tentar os binários genéricos. Em alguns casos, devido a incompatibilidades de bibliotecas ou outros problemas, eles podem não funcionar com sua instalação do Linux. Nesses casos, você pode tentar compilar e instalar o MySQL a partir da fonte. Consulte a Seção 2.8, “Instalando o MySQL a partir da fonte”, para obter mais informações e instruções.

Para instalar uma distribuição binária de um arquivo **tar** compactado, descompacte-o no local de instalação que você escolher (geralmente `/usr/local/mysql`). Isso cria os diretórios mostrados na tabela a seguir.

**Tabela 2.3. Configuração de Instalação do MySQL para Pacotes Binários Genéricos Unix/Linux**

<table>
   <col style="width: 45%"/>
   <col style="width: 55%"/>
   <thead>
      <tr>
         <th>Diretório</th>
         <th>Conteúdo do diretório</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td>[[<code>bin</code>]]</td>
         <td><strong>mysqld</strong> programas de servidor, cliente e utilitário</td>
      </tr>
      <tr>
         <td>[[<code>docs</code>]]</td>
         <td>Manual do MySQL no formato Info</td>
      </tr>
      <tr>
         <td>[[<code>man</code>]]</td>
         <td>Páginas de manual do Unix</td>
      </tr>
      <tr>
         <td>[[<code>include</code>]]</td>
         <td>Incluir arquivos (cabeçalho)</td>
      </tr>
      <tr>
         <td>[[<code>lib</code>]]</td>
         <td>Livrarias</td>
      </tr>
      <tr>
         <td>[[<code>share</code>]]</td>
         <td>Mensagens de erro, dicionário e SQL para instalação do banco de dados</td>
      </tr>
      <tr>
         <td>[[<code>support-files</code>]]</td>
         <td>Arquivos de suporte variados</td>
      </tr>
   </tbody>
</table>

Versões de depuração do binário **mysqld** estão disponíveis como **mysqld-debug**. Para compilar sua própria versão de depuração do MySQL a partir de uma distribuição de código-fonte, use as opções de configuração apropriadas para habilitar o suporte de depuração. Consulte a Seção 2.8, “Instalando o MySQL a partir de código-fonte”.

Para instalar e usar uma distribuição binária do MySQL, a sequência de comandos é a seguinte:

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

Nota

Este procedimento assume que você tem acesso de administrador (root) ao seu sistema. Alternativamente, você pode prefixar cada comando usando o comando **sudo** (Linux) ou **pfexec** (Solaris).

O diretório `mysql-files` fornece um local conveniente para usar como valor para a variável de sistema `secure_file_priv`, que limita as operações de importação e exportação a um diretório específico. Veja a Seção 5.1.7, “Variáveis do Sistema do Servidor”.

Segue uma versão mais detalhada da descrição anterior para a instalação de uma distribuição binária.

### Crie um usuário e um grupo no MySQL

Se o seu sistema não tiver um usuário e um grupo para usar no **mysqld**, você pode precisar criá-los. Os seguintes comandos adicionam o grupo `mysql` e o usuário `mysql`. Você pode querer dar um nome diferente ao usuário e ao grupo, em vez de `mysql`. Se for o caso, substitua o nome apropriado nas instruções a seguir. A sintaxe para **useradd** e **groupadd** pode variar ligeiramente em diferentes versões do Unix/Linux, ou eles podem ter nomes diferentes, como **adduser** e **addgroup**.

```sql
$> groupadd mysql
$> useradd -r -g mysql -s /bin/false mysql
```

Nota

Como o usuário é necessário apenas para fins de propriedade, e não para fins de login, o comando **useradd** usa as opções `-r` e `-s /bin/false` para criar um usuário que não tem permissões de login no seu host do servidor. Omit essas opções se o seu **useradd** não as suportar.

### Obtenha e desempacote a distribuição

Escolha o diretório sob o qual você deseja descompactar a distribuição e altere a localização para ele. O exemplo abaixo descompacta a distribuição em `/usr/local`. As instruções, portanto, assumem que você tem permissão para criar arquivos e diretórios em `/usr/local`. Se esse diretório estiver protegido, você deve realizar a instalação como `root`.

```sql
$> cd /usr/local
```

Obtenha um arquivo de distribuição usando as instruções na Seção 2.1.3, “Como obter o MySQL”. Para uma determinada versão, as distribuições binárias para todas as plataformas são construídas a partir da mesma distribuição de fonte do MySQL.

Descompacte a distribuição, que cria o diretório de instalação. O **tar** pode descompactuar e desempacotar a distribuição se tiver suporte à opção `z`:

```sql
$> tar zxvf /path/to/mysql-VERSION-OS.tar.gz
```

O comando **tar** cria um diretório chamado `mysql-VERSION-OS`.

Para instalar o MySQL a partir de uma distribuição binária em formato **tar** compactado, o sistema deve ter o GNU `gunzip` para descompactação da distribuição e um **tar** razoável para descompactação. Se o seu programa **tar** suportar a opção `z`, ele pode descompactuar e descomprimir o arquivo.

O **GNU tar** é conhecido por funcionar. O **tar** padrão fornecido por alguns sistemas operacionais não consegue descompactar os nomes de arquivos longos na distribuição do MySQL. Você deve baixar e instalar o **GNU tar**, ou, se disponível, usar uma versão pré-instalada do GNU tar. Geralmente, isso está disponível como **gnutar**, **gtar** ou como **tar** dentro de um diretório de software GNU ou de software livre, como `/usr/sfw/bin` ou `/usr/local/bin`. O **GNU tar** está disponível em <http://www.gnu.org/software/tar/>.

Se o seu **tar** não tiver suporte à opção `z`, use **gunzip** para descomprimir a distribuição e **tar** para descomprimir. Substitua o comando anterior de **tar** pelo seguinte comando alternativo para descomprimir e extrair a distribuição:

```sql
$> gunzip < /path/to/mysql-VERSION-OS.tar.gz | tar xvf -
```

Em seguida, crie um link simbólico para o diretório de instalação criado pelo **tar**:

```sql
$> ln -s full-path-to-mysql-VERSION-OS mysql
```

O comando `ln` cria um link simbólico para o diretório de instalação. Isso permite que você faça referência mais facilmente a ele como `/usr/local/mysql`. Para evitar ter que digitar o nome do caminho dos programas cliente sempre que estiver trabalhando com o MySQL, você pode adicionar o diretório `/usr/local/mysql/bin` à sua variável `PATH`:

```sql
$> export PATH=$PATH:/usr/local/mysql/bin
```

### Realize a configuração pós-instalação

O restante do processo de instalação envolve definir a propriedade da distribuição e permissões de acesso, inicializar o diretório de dados, iniciar o servidor MySQL e configurar o arquivo de configuração. Para obter instruções, consulte a Seção 2.9, “Configuração e Teste Pós-Instalação”.
