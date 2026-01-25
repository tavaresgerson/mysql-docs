### 2.5.8 Instalando MySQL no Linux a partir dos Repositórios Nativos de Software

Muitas distribuições Linux incluem uma versão do servidor MySQL, ferramentas de cliente e componentes de desenvolvimento em seus repositórios nativos de software e podem ser instaladas com os sistemas padrão de gerenciamento de *package* das plataformas. Esta seção fornece instruções básicas para instalar o MySQL usando esses sistemas de gerenciamento de *package*.

Importante

Os *packages* nativos estão frequentemente várias versões atrás da versão atualmente disponível. Normalmente, você também não pode instalar versões de marco de desenvolvimento (DMRs), pois elas geralmente não são disponibilizadas nos repositórios nativos. Antes de prosseguir, recomendamos que você verifique as outras opções de instalação descritas na Seção 2.5, “Instalando MySQL no Linux”.

Instruções específicas da distribuição são mostradas abaixo:

* **Red Hat Linux, Fedora, CentOS**

  Nota

  Para várias distribuições Linux, você pode instalar o MySQL usando o repositório MySQL Yum em vez do repositório nativo de software da plataforma. Consulte a Seção 2.5.1, “Instalando MySQL no Linux Usando o Repositório MySQL Yum” para obter detalhes.

  Para Red Hat e distribuições semelhantes, a distribuição MySQL é dividida em vários *packages* separados: `mysql` para as ferramentas de cliente, `mysql-server` para o servidor e ferramentas associadas, e `mysql-libs` para as *libraries*. As *libraries* são necessárias se você deseja fornecer conectividade a partir de diferentes linguagens e ambientes, como Perl, Python e outros.

  Para instalar, use o comando **yum** para especificar os *packages* que você deseja instalar. Por exemplo:

  ```sql
  #> yum install mysql mysql-server mysql-libs mysql-server
  Loaded plugins: presto, refresh-packagekit
  Setting up Install Process
  Resolving Dependencies
  --> Running transaction check
  ---> Package mysql.x86_64 0:5.1.48-2.fc13 set to be updated
  ---> Package mysql-libs.x86_64 0:5.1.48-2.fc13 set to be updated
  ---> Package mysql-server.x86_64 0:5.1.48-2.fc13 set to be updated
  --> Processing Dependency: perl-DBD-MySQL for package: mysql-server-5.1.48-2.fc13.x86_64
  --> Running transaction check
  ---> Package perl-DBD-MySQL.x86_64 0:4.017-1.fc13 set to be updated
  --> Finished Dependency Resolution

  Dependencies Resolved

  ================================================================================
   Package               Arch          Version               Repository      Size
  ================================================================================
  Installing:
   mysql                 x86_64        5.1.48-2.fc13         updates        889 k
   mysql-libs            x86_64        5.1.48-2.fc13         updates        1.2 M
   mysql-server          x86_64        5.1.48-2.fc13         updates        8.1 M
  Installing for dependencies:
   perl-DBD-MySQL        x86_64        4.017-1.fc13          updates        136 k

  Transaction Summary
  ================================================================================
  Install       4 Package(s)
  Upgrade       0 Package(s)

  Total download size: 10 M
  Installed size: 30 M
  Is this ok [y/N]: y
  Downloading Packages:
  Setting up and reading Presto delta metadata
  Processing delta metadata
  Package(s) data still to download: 10 M
  (1/4): mysql-5.1.48-2.fc13.x86_64.rpm                    | 889 kB     00:04
  (2/4): mysql-libs-5.1.48-2.fc13.x86_64.rpm               | 1.2 MB     00:06
  (3/4): mysql-server-5.1.48-2.fc13.x86_64.rpm             | 8.1 MB     00:40
  (4/4): perl-DBD-MySQL-4.017-1.fc13.x86_64.rpm            | 136 kB     00:00
  --------------------------------------------------------------------------------
  Total                                           201 kB/s |  10 MB     00:52
  Running rpm_check_debug
  Running Transaction Test
  Transaction Test Succeeded
  Running Transaction
    Installing     : mysql-libs-5.1.48-2.fc13.x86_64                          1/4
    Installing     : mysql-5.1.48-2.fc13.x86_64                               2/4
    Installing     : perl-DBD-MySQL-4.017-1.fc13.x86_64                       3/4
    Installing     : mysql-server-5.1.48-2.fc13.x86_64                        4/4

  Installed:
    mysql.x86_64 0:5.1.48-2.fc13            mysql-libs.x86_64 0:5.1.48-2.fc13
    mysql-server.x86_64 0:5.1.48-2.fc13

  Dependency Installed:
    perl-DBD-MySQL.x86_64 0:4.017-1.fc13

  Complete!
  ```

  O MySQL e o servidor MySQL devem estar instalados agora. Um arquivo de configuração de exemplo é instalado em `/etc/my.cnf`. Um *init script*, para iniciar e parar o servidor, é instalado em `/etc/init.d/mysqld`. Para iniciar o servidor MySQL, use **service**:

  ```sql
  #> service mysqld start
  ```

  Para permitir que o servidor seja iniciado e parado automaticamente durante o *boot*, use **chkconfig**:

  ```sql
  #> chkconfig --levels 235 mysqld on
  ```

  O que permite que o servidor MySQL seja iniciado (e parado) automaticamente nos *run levels* especificados.

  As *database tables* são criadas automaticamente para você, se ainda não existirem. Você deve, no entanto, executar **mysql\_secure\_installation** para definir as senhas do *root* no seu servidor.

* **Debian, Ubuntu, Kubuntu**

  Nota

  No Debian, Ubuntu e Kubuntu, o MySQL pode ser instalado usando o [MySQL APT Repository](https://dev.mysql.com/downloads/repo/apt/) em vez do repositório nativo de software da plataforma. Consulte a Seção 2.5.3, “Instalando MySQL no Linux Usando o MySQL APT Repository” para obter detalhes.

  No Debian e distribuições relacionadas, existem dois *packages* para MySQL em seus repositórios de software, `mysql-client` e `mysql-server`, para os componentes de cliente e servidor, respectivamente. Você deve especificar uma versão explícita, por exemplo `mysql-client-5.1`, para garantir que instale a versão do MySQL que você deseja.

  Para fazer o *download* e instalar, incluindo quaisquer dependências, use o comando **apt-get**, especificando os *packages* que você deseja instalar.

  Nota

  Antes de instalar, certifique-se de atualizar seus arquivos de *index* do `apt-get` para garantir que você esteja baixando a versão mais recente disponível.

  Uma instalação de exemplo dos *packages* MySQL pode se parecer com isto (algumas seções foram omitidas para maior clareza):

  ```sql
  #> apt-get install mysql-client-5.1 mysql-server-5.1
  Reading package lists... Done
  Building dependency tree
  Reading state information... Done
  The following packages were automatically installed and are no longer required:
    linux-headers-2.6.28-11 linux-headers-2.6.28-11-generic
  Use 'apt-get autoremove' to remove them.
  The following extra packages will be installed:
    bsd-mailx libdbd-mysql-perl libdbi-perl libhtml-template-perl
    libmysqlclient15off libmysqlclient16 libnet-daemon-perl libplrpc-perl mailx
    mysql-common postfix
  Suggested packages:
    dbishell libipc-sharedcache-perl tinyca procmail postfix-mysql postfix-pgsql
    postfix-ldap postfix-pcre sasl2-bin resolvconf postfix-cdb
  The following NEW packages will be installed
    bsd-mailx libdbd-mysql-perl libdbi-perl libhtml-template-perl
    libmysqlclient15off libmysqlclient16 libnet-daemon-perl libplrpc-perl mailx
    mysql-client-5.1 mysql-common mysql-server-5.1 postfix
  0 upgraded, 13 newly installed, 0 to remove and 182 not upgraded.
  Need to get 1907kB/25.3MB of archives.
  After this operation, 59.5MB of additional disk space will be used.
  Do you want to continue [Y/n]? Y
  Get: 1 http://gb.archive.ubuntu.com jaunty-updates/main mysql-common 5.1.30really5.0.75-0ubuntu10.5 [63.6kB]
  Get: 2 http://gb.archive.ubuntu.com jaunty-updates/main libmysqlclient15off 5.1.30really5.0.75-0ubuntu10.5 [1843kB]
  Fetched 1907kB in 9s (205kB/s)
  Preconfiguring packages ...
  Selecting previously deselected package mysql-common.
  (Reading database ... 121260 files and directories currently installed.)
  ...
  Processing 1 added doc-base file(s)...
  Registering documents with scrollkeeper...
  Setting up libnet-daemon-perl (0.43-1) ...
  Setting up libplrpc-perl (0.2020-1) ...
  Setting up libdbi-perl (1.607-1) ...
  Setting up libmysqlclient15off (5.1.30really5.0.75-0ubuntu10.5) ...

  Setting up libdbd-mysql-perl (4.008-1) ...
  Setting up libmysqlclient16 (5.1.31-1ubuntu2) ...

  Setting up mysql-client-5.1 (5.1.31-1ubuntu2) ...

  Setting up mysql-server-5.1 (5.1.31-1ubuntu2) ...
   * Stopping MySQL database server mysqld
     ...done.
  2013-09-24T13:03:09.048353Z 0 [Note] InnoDB: 5.7.44 started; log sequence number 1566036
  2013-09-24T13:03:10.057269Z 0 [Note] InnoDB: Starting shutdown...
  2013-09-24T13:03:10.857032Z 0 [Note] InnoDB: Shutdown completed; log sequence number 1566036
   * Starting MySQL database server mysqld
     ...done.
   * Checking for corrupt, not cleanly closed and upgrade needing tables.
  ...
  Processing triggers for libc6 ...
  ldconfig deferred processing now taking place
  ```

  Nota

  O comando **apt-get** instala vários *packages*, incluindo o MySQL server, a fim de fornecer as ferramentas típicas e o ambiente de aplicação. Isso pode significar que você instale um grande número de *packages* além do *package* principal do MySQL.

  Durante a instalação, a *database* inicial é criada, e você será solicitado pela senha de *root* do MySQL (e confirmação). Um arquivo de configuração é criado em `/etc/mysql/my.cnf`. Um *init script* é criado em `/etc/init.d/mysql`.

  O servidor já está iniciado. Você pode iniciar e parar o servidor manualmente usando:

  ```sql
  #> service mysql [start|stop]
  ```

  O *service* é adicionado automaticamente aos *run levels* 2, 3 e 4, com *stop scripts* nos níveis *single*, *shutdown* e *restart*.