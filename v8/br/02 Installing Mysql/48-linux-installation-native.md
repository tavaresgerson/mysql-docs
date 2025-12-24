### 2.5.7 Instalar o MySQL no Linux a partir dos Repositórios de Software Nativo

Muitas distribuições Linux incluem uma versão do servidor MySQL, ferramentas de cliente e componentes de desenvolvimento em seus repositórios de software nativos e podem ser instalados com os sistemas de gerenciamento de pacotes padrão das plataformas.

Importância

Os pacotes nativos são muitas vezes várias versões atrás da versão atualmente disponível. Você também normalmente não é capaz de instalar versões de marco de desenvolvimento (DMRs), uma vez que estes não são geralmente disponibilizados nos repositórios nativos. Antes de prosseguir, recomendamos que você verifique as outras opções de instalação descritas na Seção 2.5, Instalar MySQL no Linux.

As instruções específicas de distribuição são mostradas abaixo:

- \*\* Red Hat Linux, Fedora, CentOS \*\*

  ::: info Note

  Para uma série de distribuições Linux, você pode instalar o MySQL usando o repositório MySQL Yum em vez do repositório de software nativo da plataforma.

  :::

  Para Red Hat e distribuições semelhantes, a distribuição MySQL é dividida em vários pacotes separados, `mysql` para as ferramentas do cliente, `mysql-server` para o servidor e ferramentas associadas, e `mysql-libs` para as bibliotecas. As bibliotecas são necessárias se você quiser fornecer conectividade de diferentes linguagens e ambientes, como Perl, Python e outros.

  Para instalar, use o comando `yum` para especificar os pacotes que você deseja instalar. Por exemplo:

  ```
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

  O MySQL e o servidor MySQL devem agora ser instalados. Um arquivo de configuração de exemplo está instalado em `/etc/my.cnf`. Para iniciar o servidor MySQL use `systemctl`:

  ```
  $> systemctl start mysqld
  ```

  As tabelas de banco de dados são criadas automaticamente para você, se elas ainda não existem. No entanto, você deve executar `mysql_secure_installation` para definir as senhas raiz em seu servidor.
- **Debian, Ubuntu, Kubuntu**

  ::: info Note

  Para as versões suportadas do Debian e do Ubuntu, o MySQL pode ser instalado usando o \[MySQL APT Repository] em vez do repositório de software nativo da plataforma.

  :::

  No Debian e distribuições relacionadas, existem dois pacotes para o MySQL em seus repositórios de software, `mysql-client` e `mysql-server`, para os componentes do cliente e do servidor, respectivamente. Você deve especificar uma versão explícita, por exemplo `mysql-client-5.1`, para garantir que você instale a versão do MySQL que deseja.

  Para baixar e instalar, incluindo quaisquer dependências, use o comando `apt-get`, especificando os pacotes que você deseja instalar.

  ::: info Note

  Antes de instalar, certifique-se de que você atualizar seus arquivos de índice `apt-get` para garantir que você está baixando a versão mais recente disponível.

  :::

  ::: info Note

  O comando `apt-get` instala uma série de pacotes, incluindo o servidor MySQL, a fim de fornecer as ferramentas típicas e ambiente de aplicação. Isso pode significar que você instalar um grande número de pacotes, além do pacote principal do MySQL.

  :::

  Durante a instalação, o banco de dados inicial é criado, e você é solicitado para a senha raiz do MySQL (e confirmação). Um arquivo de configuração é criado em `/etc/mysql/my.cnf`. Um script de inicialização é criado em `/etc/init.d/mysql`.

  O servidor já deve estar iniciado. Pode iniciar e parar o servidor manualmente usando:

  ```
  #> service mysql [start|stop]
  ```

  O serviço é adicionado automaticamente aos níveis de execução 2, 3 e 4, com scripts de parada nos níveis simples, de desligamento e de reinicio.
