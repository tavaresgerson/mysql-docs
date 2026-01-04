### 2.5.8 Instalando o MySQL no Linux a partir dos repositórios de software nativo

Muitas distribuições Linux incluem uma versão do servidor MySQL, ferramentas de cliente e componentes de desenvolvimento em seus repositórios de software nativos e podem ser instaladas com os sistemas padrão de gerenciamento de pacotes das plataformas. Esta seção fornece instruções básicas para instalar o MySQL usando esses sistemas de gerenciamento de pacotes.

Importante

Os pacotes nativos geralmente estão várias versões atrás da versão atualmente disponível. Além disso, normalmente você não pode instalar versões de marcos de desenvolvimento (DMRs), pois essas versões geralmente não estão disponíveis nos repositórios nativos. Antes de prosseguir, recomendamos que você verifique as outras opções de instalação descritas na Seção 2.5, “Instalando o MySQL no Linux”.

As instruções específicas de distribuição estão mostradas abaixo:

- **Red Hat Linux, Fedora, CentOS**

  Nota

  Para várias distribuições Linux, você pode instalar o MySQL usando o repositório MySQL Yum em vez do repositório de software nativo da plataforma. Consulte a Seção 2.5.1, “Instalando o MySQL no Linux Usando o Repositório MySQL Yum”, para obter detalhes.

  Para a Red Hat e distribuições semelhantes, a distribuição MySQL é dividida em vários pacotes separados: `mysql` para as ferramentas do cliente, `mysql-server` para o servidor e as ferramentas associadas, e `mysql-libs` para as bibliotecas. As bibliotecas são necessárias se você deseja fornecer conectividade a diferentes linguagens e ambientes, como Perl, Python e outros.

  Para instalar, use o comando **yum** para especificar os pacotes que você deseja instalar. Por exemplo:

  ```shell
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

  Agora, o MySQL e o servidor MySQL devem estar instalados. Um arquivo de configuração de exemplo está instalado em `/etc/my.cnf`. Um script de inicialização, para iniciar e parar o servidor, está instalado em `/etc/init.d/mysqld`. Para iniciar o servidor MySQL, use **service**:

  ```shell
  #> service mysqld start
  ```

  Para permitir que o servidor seja iniciado e desligado automaticamente durante o boot, use o **chkconfig**:

  ```shell
  #> chkconfig --levels 235 mysqld on
  ```

  Isso permite que o servidor MySQL seja iniciado (e desligado) automaticamente nos níveis de execução especificados.

  As tabelas do banco de dados são criadas automaticamente para você, se ainda não existirem. No entanto, você deve executar **mysql\_secure\_installation** para definir as senhas do root no seu servidor.

- **Debian, Ubuntu, Kubuntu**

  Nota

  No Debian, Ubuntu e Kubuntu, o MySQL pode ser instalado usando o [Repositório MySQL APT](https://dev.mysql.com/downloads/repo/apt/) em vez do repositório de software nativo da plataforma. Consulte a Seção 2.5.3, “Instalando o MySQL no Linux Usando o Repositório MySQL APT”, para obter detalhes.

  Nos repositórios de software do Debian e das distribuições relacionadas, existem dois pacotes para o MySQL: `mysql-client` e `mysql-server`, para os componentes cliente e servidor, respectivamente. Você deve especificar uma versão explícita, por exemplo, `mysql-client-5.1`, para garantir que você instale a versão do MySQL que deseja.

  Para fazer o download e a instalação, incluindo quaisquer dependências, use o comando **apt-get**, especificando os pacotes que você deseja instalar.

  Nota

  Antes de instalar, certifique-se de atualizar seus arquivos de índice do `apt-get` para garantir que você esteja baixando a versão mais recente disponível.

  Uma instalação de amostra dos pacotes MySQL pode parecer assim (algumas seções foram cortadas para clareza):

  ```shell
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

  O comando **apt-get** instala vários pacotes, incluindo o servidor MySQL, para fornecer as ferramentas e o ambiente de aplicação típicos. Isso pode significar que você instala um grande número de pacotes além do pacote principal do MySQL.

  Durante a instalação, o banco de dados inicial é criado e você é solicitado a fornecer a senha do usuário root do MySQL (e a confirmação). Um arquivo de configuração é criado em `/etc/mysql/my.cnf`. Um script de inicialização é criado em `/etc/init.d/mysql`.

  O servidor já está iniciado. Você pode iniciar e parar o servidor manualmente usando:

  ```shell
  #> service mysql [start|stop]
  ```

  O serviço é adicionado automaticamente para rodar nos níveis 2, 3 e 4, com scripts de parada nos níveis de inicialização única, desligamento e reinício.
