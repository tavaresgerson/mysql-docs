#### 21.3.1.1 Instalando uma Release Binária do NDB Cluster no Linux

Esta seção cobre os passos necessários para instalar os executáveis corretos para cada tipo de **node** do **Cluster** a partir de **binaries** pré-compilados fornecidos pela Oracle.

Para configurar um **Cluster** usando **binaries** pré-compilados, o primeiro passo no processo de instalação para cada **host** do **Cluster** é fazer o **download** do arquivo **binary** da [página de **downloads** do NDB **Cluster**](https://dev.mysql.com/downloads/cluster/). (Para a **release** NDB 7.6 mais recente de 64 bits, este é `mysql-cluster-gpl-7.6.35-linux-glibc2.12-x86_64.tar.gz`.) Assumimos que você colocou este arquivo no diretório `/var/tmp` de cada máquina.

Se você precisar de um **binary** personalizado, consulte [Seção 2.8.5, “Instalando o MySQL Usando uma Source Tree de Desenvolvimento”](installing-development-tree.html "2.8.5 Instalando o MySQL Usando uma Source Tree de Desenvolvimento").

Nota

Após completar a instalação, não inicie nenhum dos **binaries** ainda. Mostraremos como fazer isso após a configuração dos **nodes** (consulte [Seção 21.3.3, “Configuração Inicial do NDB Cluster”](mysql-cluster-install-configuration.html "21.3.3 Configuração Inicial do NDB Cluster")).

**SQL nodes.** Em cada uma das máquinas designadas para hospedar **SQL nodes**, execute os seguintes passos como o usuário `root` do sistema:

1. Verifique seus arquivos `/etc/passwd` e `/etc/group` (ou use quaisquer ferramentas fornecidas pelo seu sistema operacional para gerenciar usuários e grupos) para ver se já existe um grupo `mysql` e um usuário `mysql` no sistema. Algumas distribuições de SO criam estes como parte do processo de instalação do sistema operacional. Se eles ainda não estiverem presentes, crie um novo grupo de usuários `mysql` e, em seguida, adicione um usuário `mysql` a este grupo:

   ```sql
   $> groupadd mysql
   $> useradd -g mysql -s /bin/false mysql
   ```

   A sintaxe para **useradd** e **groupadd** pode diferir ligeiramente em diferentes versões do Unix, ou elas podem ter nomes diferentes, como **adduser** e **addgroup**.

2. Mude o local para o diretório que contém o arquivo baixado, descompacte o arquivo e crie um **link simbólico** chamado `mysql` para o diretório `mysql`.

   Nota

   Os nomes reais dos arquivos e diretórios variam de acordo com o número da versão do NDB **Cluster**.

   ```sql
   $> cd /var/tmp
   $> tar -C /usr/local -xzvf mysql-cluster-gpl-7.6.35-linux-glibc2.12-x86_64.tar.gz
   $> ln -s /usr/local/mysql-cluster-gpl-7.6.35-linux-glibc2.12-x86_64 /usr/local/mysql
   ```

3. Mude o local para o diretório `mysql` e configure os **databases** do sistema usando [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") [`--initialize`](server-options.html#option_mysqld_initialize) conforme mostrado aqui:

   ```sql
   $> cd mysql
   $> mysqld --initialize
   ```

   Isso gera uma senha aleatória para a conta `root` do MySQL. Se você *não* quiser que a senha aleatória seja gerada, você pode substituir a opção `--initialize` pela opção [`--initialize-insecure`](server-options.html#option_mysqld_initialize-insecure). Em ambos os casos, você deve revisar [Seção 2.9.1, “Inicializando o Data Directory”](data-directory-initialization.html "2.9.1 Inicializando o Data Directory"), para obter informações adicionais antes de executar esta etapa. Consulte também [Seção 4.4.4, “mysql_secure_installation — Melhore a Segurança da Instalação do MySQL”](mysql-secure-installation.html "4.4.4 mysql_secure_installation — Melhore a Segurança da Instalação do MySQL").

4. Defina as permissões necessárias para o **MySQL server** e os **Data directories**:

   ```sql
   $> chown -R root .
   $> chown -R mysql data
   $> chgrp -R mysql .
   ```

5. Copie o **startup script** do MySQL para o diretório apropriado, torne-o executável e defina-o para iniciar quando o sistema operacional for inicializado:

   ```sql
   $> cp support-files/mysql.server /etc/rc.d/init.d/
   $> chmod +x /etc/rc.d/init.d/mysql.server
   $> chkconfig --add mysql.server
   ```

   (O diretório dos **startup scripts** pode variar dependendo do seu sistema operacional e versão — por exemplo, em algumas distribuições Linux, é `/etc/init.d`.)

   Aqui usamos o **chkconfig** do Red Hat para criar **links** para os **startup scripts**; use o meio apropriado para este propósito em sua plataforma, como **update-rc.d** no Debian.

Lembre-se de que os passos precedentes devem ser repetidos em cada máquina onde um **SQL node** irá residir.

**Data nodes.** A instalação dos **data nodes** não requer o **binary** [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"). Apenas o executável do **data node** do NDB **Cluster** [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon") (**single-threaded**) ou [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") (**multithreaded**) é requerido. Estes **binaries** também podem ser encontrados no arquivo `.tar.gz`. Novamente, assumimos que você colocou este arquivo em `/var/tmp`.

Como `root` do sistema (isto é, após usar **sudo**, **su root**, ou o equivalente do seu sistema para assumir temporariamente os privilégios da conta de administrador do sistema), execute os seguintes passos para instalar os **data node binaries** nos **hosts** do **data node**:

1. Mude o local para o diretório `/var/tmp` e extraia os **binaries** [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon") e [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") do arquivo para um diretório adequado, como `/usr/local/bin`:

   ```sql
   $> cd /var/tmp
   $> tar -zxvf mysql-cluster-gpl-7.6.35-linux-glibc2.12-x86_64.tar.gz
   $> cd mysql-cluster-gpl-7.6.35-linux-glibc2.12-x86_64
   $> cp bin/ndbd /usr/local/bin/ndbd
   $> cp bin/ndbmtd /usr/local/bin/ndbmtd
   ```

   (Você pode excluir com segurança o diretório criado ao desempacotar o arquivo baixado, e os arquivos que ele contém, de `/var/tmp` assim que [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client") e [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") tiverem sido copiados para o diretório de executáveis.)

2. Mude o local para o diretório onde você copiou os arquivos e, em seguida, torne ambos executáveis:

   ```sql
   $> cd /usr/local/bin
   $> chmod +x ndb*
   ```

Os passos precedentes devem ser repetidos em cada **host data node**.

Embora apenas um dos executáveis do **data node** seja necessário para executar um **data node** do NDB **Cluster**, mostramos como instalar tanto [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon") quanto [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") nas instruções precedentes. Recomendamos que você faça isso ao instalar ou atualizar o NDB **Cluster**, mesmo que planeje usar apenas um deles, pois isso deve economizar tempo e problemas caso decida mudar de um para o outro posteriormente.

Nota

O **data directory** em cada máquina que hospeda um **data node** é `/usr/local/mysql/data`. Esta informação é essencial ao configurar o **management node**. (Consulte [Seção 21.3.3, “Configuração Inicial do NDB Cluster”](mysql-cluster-install-configuration.html "21.3.3 Configuração Inicial do NDB Cluster").)

**Management nodes.** A instalação do **management node** não requer o **binary** [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"). Apenas o **management server** do NDB **Cluster** ([**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon")) é requerido; você provavelmente também desejará instalar o **management client** ([**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client")). Ambos os **binaries** também podem ser encontrados no arquivo `.tar.gz`. Novamente, assumimos que você colocou este arquivo em `/var/tmp`.

Como `root` do sistema, execute os seguintes passos para instalar [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") e [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client") no **host** do **management node**:

1. Mude o local para o diretório `/var/tmp` e extraia [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client") e [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") do arquivo para um diretório adequado, como `/usr/local/bin`:

   ```sql
   $> cd /var/tmp
   $> tar -zxvf mysql-cluster-gpl-7.6.35-linux-glibc2.12-x86_64.tar.gz
   $> cd mysql-cluster-gpl-7.6.35-linux-glibc2.12-x86_64
   $> cp bin/ndb_mgm* /usr/local/bin
   ```

   (Você pode excluir com segurança o diretório criado ao desempacotar o arquivo baixado, e os arquivos que ele contém, de `/var/tmp` assim que [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client") e [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") tiverem sido copiados para o diretório de executáveis.)

2. Mude o local para o diretório onde você copiou os arquivos e, em seguida, torne ambos executáveis:

   ```sql
   $> cd /usr/local/bin
   $> chmod +x ndb_mgm*
   ```

Em [Seção 21.3.3, “Configuração Inicial do NDB Cluster”](mysql-cluster-install-configuration.html "21.3.3 Configuração Inicial do NDB Cluster"), criamos arquivos de configuração para todos os **nodes** em nosso exemplo de NDB **Cluster**.