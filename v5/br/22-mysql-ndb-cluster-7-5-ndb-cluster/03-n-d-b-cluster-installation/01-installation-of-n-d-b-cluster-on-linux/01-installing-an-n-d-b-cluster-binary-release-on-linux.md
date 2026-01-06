#### 21.3.1.1 Instalar uma versão binária de um cluster NDB no Linux

Esta seção abrange os passos necessários para instalar os executáveis corretos para cada tipo de nó do Cluster a partir de binários pré-compilados fornecidos pela Oracle.

Para configurar um clúster usando binários pré-compilados, o primeiro passo no processo de instalação de cada host do clúster é baixar o arquivo binário da página de downloads do [NDB Cluster](https://dev.mysql.com/downloads/cluster/). (Para a versão mais recente do NDB 7.6 de 64 bits, este é `mysql-cluster-gpl-7.6.35-linux-glibc2.12-x86_64.tar.gz`.) Assumemos que você colocou este arquivo no diretório `/var/tmp` de cada máquina.

Se você precisar de um binário personalizado, consulte Seção 2.8.5, “Instalando o MySQL usando uma árvore de fonte de desenvolvimento”.

Nota

Após concluir a instalação, ainda não inicie nenhum dos binários. Mostramos como fazer isso após a configuração dos nós (consulte Seção 21.3.3, “Configuração Inicial do NDB Cluster”).

**Nodos SQL.** Em cada uma das máquinas designadas para hospedar os nós SQL, execute as etapas a seguir como usuário `root` do sistema:

1. Verifique seus arquivos `/etc/passwd` e `/etc/group` (ou use as ferramentas fornecidas pelo seu sistema operacional para gerenciar usuários e grupos) para ver se já existe um grupo `mysql` e um usuário `mysql` no sistema. Algumas distribuições do SO criam esses grupos como parte do processo de instalação do sistema operacional. Se eles ainda não estiverem presentes, crie um novo grupo de usuário `mysql` e, em seguida, adicione um usuário `mysql` a esse grupo:

   ```sql
   $> groupadd mysql
   $> useradd -g mysql -s /bin/false mysql
   ```

   A sintaxe para **useradd** e **groupadd** pode variar ligeiramente em diferentes versões do Unix, ou eles podem ter nomes diferentes, como **adduser** e **addgroup**.

2. Altere a localização para o diretório que contém o arquivo baixado, descompacte o arquivo e crie um link simbólico chamado `mysql` para o diretório `mysql`.

   Nota

   Os nomes dos arquivos e diretórios reais variam de acordo com o número da versão do NDB Cluster.

   ```sql
   $> cd /var/tmp
   $> tar -C /usr/local -xzvf mysql-cluster-gpl-7.6.35-linux-glibc2.12-x86_64.tar.gz
   $> ln -s /usr/local/mysql-cluster-gpl-7.6.35-linux-glibc2.12-x86_64 /usr/local/mysql
   ```

3. Altere a localização para o diretório `mysql` e configure os bancos de dados do sistema usando **mysqld** `--initialize` conforme mostrado aqui:

   ```sql
   $> cd mysql
   $> mysqld --initialize
   ```

   Isso gera uma senha aleatória para a conta `root` do MySQL. Se você *não* quiser que a senha aleatória seja gerada, pode substituir a opção `--initialize-insecure` pelo `--initialize`. Em qualquer caso, você deve revisar Seção 2.9.1, “Inicializando o diretório de dados” para obter informações adicionais antes de realizar essa etapa. Veja também Seção 4.4.4, “mysql\_secure\_installation — Melhorar a segurança da instalação do MySQL”.

4. Defina as permissões necessárias para o servidor MySQL e os diretórios de dados:

   ```sql
   $> chown -R root .
   $> chown -R mysql data
   $> chgrp -R mysql .
   ```

5. Copie o script de inicialização do MySQL para o diretório apropriado, torne-o executável e configure-o para iniciar quando o sistema operacional for inicializado:

   ```sql
   $> cp support-files/mysql.server /etc/rc.d/init.d/
   $> chmod +x /etc/rc.d/init.d/mysql.server
   $> chkconfig --add mysql.server
   ```

   (O diretório de scripts de inicialização pode variar dependendo do seu sistema operacional e versão — por exemplo, em algumas distribuições Linux, é `/etc/init.d`.

   Aqui, usamos o **chkconfig** da Red Hat para criar links para os scripts de inicialização; use qualquer meio apropriado para esse propósito na sua plataforma, como **update-rc.d** no Debian.

Lembre-se de que as etapas anteriores devem ser repetidas em cada máquina onde um nó SQL deve residir.

**Nodos de dados.** A instalação dos nós de dados do NDB Cluster não requer o binário **mysqld**. É necessário apenas o executável do nó de dados do NDB Cluster **ndbd** (monotático) ou **ndbmtd** (multitático). Esses binários também podem ser encontrados no arquivo `.tar.gz`. Novamente, assumimos que você colocou esse arquivo em `/var/tmp`.

Como administrador do sistema (ou seja, após usar **sudo**, **su root** ou o equivalente do seu sistema para assumir temporariamente os privilégios da conta de administrador do sistema), execute as etapas a seguir para instalar os binários do nó de dados nos hosts do nó de dados:

1. Altere a localização para o diretório `/var/tmp` e extraia os binários **ndbd** e **ndbmtd** do arquivo para um diretório adequado, como `/usr/local/bin`:

   ```sql
   $> cd /var/tmp
   $> tar -zxvf mysql-cluster-gpl-7.6.35-linux-glibc2.12-x86_64.tar.gz
   $> cd mysql-cluster-gpl-7.6.35-linux-glibc2.12-x86_64
   $> cp bin/ndbd /usr/local/bin/ndbd
   $> cp bin/ndbmtd /usr/local/bin/ndbmtd
   ```

   (Você pode excluir com segurança o diretório criado ao descompactar o arquivo baixado e os arquivos que ele contém, a partir de `/var/tmp`, assim que **ndb\_mgm** e **ndb\_mgmd** tiverem sido copiados para o diretório de executaveis.)

2. Altere a localização para o diretório no qual você copiou os arquivos e, em seguida, torne ambos executáveis:

   ```sql
   $> cd /usr/local/bin
   $> chmod +x ndb*
   ```

As etapas anteriores devem ser repetidas em cada servidor de nó de dados.

Embora seja necessário apenas um dos executáveis do nó de dados para executar um nó de dados do NDB Cluster, mostramos como instalar tanto o **ndbd** quanto o **ndbmtd** nas instruções anteriores. Recomendamos que você faça isso ao instalar ou atualizar o NDB Cluster, mesmo que planeje usar apenas um deles, pois isso deve economizar tempo e problemas no caso de você decidir mudar de um para o outro mais tarde.

Nota

O diretório de dados em cada máquina que hospeda um nó de dados é `/usr/local/mysql/data`. Essa informação é essencial ao configurar o nó de gerenciamento. (Veja Seção 21.3.3, “Configuração Inicial do NDB Cluster”).

**Nodos de gerenciamento.** A instalação do nó de gerenciamento não requer o binário **mysqld**. É necessário apenas o servidor de gerenciamento do NDB Cluster (**ndb\_mgmd**). Você provavelmente também deseja instalar o cliente de gerenciamento (**ndb\_mgm**). Ambos os binários também podem ser encontrados no arquivo `.tar.gz`. Novamente, assumimos que você colocou esse arquivo em `/var/tmp`.

Como sistema `root`, execute os seguintes passos para instalar **ndb\_mgmd** e **ndb\_mgm** no host do nó de gerenciamento:

1. Altere a localização para o diretório `/var/tmp` e extraia os arquivos **ndb\_mgm** e **ndb\_mgmd** do arquivo em um diretório adequado, como `/usr/local/bin`:

   ```sql
   $> cd /var/tmp
   $> tar -zxvf mysql-cluster-gpl-7.6.35-linux-glibc2.12-x86_64.tar.gz
   $> cd mysql-cluster-gpl-7.6.35-linux-glibc2.12-x86_64
   $> cp bin/ndb_mgm* /usr/local/bin
   ```

   (Você pode excluir com segurança o diretório criado ao descompactar o arquivo baixado e os arquivos que ele contém, a partir de `/var/tmp`, assim que **ndb\_mgm** e **ndb\_mgmd** tiverem sido copiados para o diretório de executaveis.)

2. Altere a localização para o diretório no qual você copiou os arquivos e, em seguida, torne ambos executáveis:

   ```sql
   $> cd /usr/local/bin
   $> chmod +x ndb_mgm*
   ```

Na Seção 21.3.3, “Configuração Inicial do NDB Cluster”, criamos arquivos de configuração para todos os nós do nosso exemplo de NDB Cluster.
