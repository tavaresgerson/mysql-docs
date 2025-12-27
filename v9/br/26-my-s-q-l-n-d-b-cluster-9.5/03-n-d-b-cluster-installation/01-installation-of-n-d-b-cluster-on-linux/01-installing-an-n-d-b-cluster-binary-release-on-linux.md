#### 25.3.1.1 Instalando uma Edição Binária de um Clúster NDB no Linux

Esta seção abrange os passos necessários para instalar os executáveis corretos para cada tipo de nó do Clúster a partir de binários pré-compilados fornecidos pela Oracle.

Para configurar um clúster usando binários pré-compilados, o primeiro passo no processo de instalação para cada host do clúster é baixar o arquivo binário da página de downloads do [Clúster NDB](https://dev.mysql.com/downloads/cluster/). (Para a versão mais recente do NDB 9.5 de 64 bits, este é `mysql-cluster-gpl-9.4.0-linux-glibc2.12-x86_64.tar.gz`.) Supomos que você tenha colocado este arquivo no diretório `/var/tmp` de cada máquina.

Se você precisar de um binário personalizado, consulte a Seção 2.8.5, “Instalando o MySQL Usando uma Árvore de Fontes de Desenvolvimento”.

Nota

Após completar a instalação, ainda não inicie nenhum dos binários. Mostramos como fazer isso após a configuração dos nós (veja a Seção 25.3.3, “Configuração Inicial do Clúster NDB”).

**Nodos SQL.** Em cada uma das máquinas designadas para hospedar nós SQL, execute as seguintes etapas como usuário `root` do sistema:

1. Verifique seus arquivos `/etc/passwd` e `/etc/group` (ou use as ferramentas fornecidas pelo seu sistema operacional para gerenciar usuários e grupos) para ver se já existe um grupo `mysql` e um usuário `mysql` no sistema. Algumas distribuições de SO criam esses grupos como parte do processo de instalação do sistema operacional. Se eles ainda não estiverem presentes, crie um novo grupo de usuário `mysql`, e depois adicione um usuário `mysql` a esse grupo:

   ```
   $> groupadd mysql
   $> useradd -g mysql -s /bin/false mysql
   ```

   A sintaxe para **useradd** e **groupadd** pode variar ligeiramente em diferentes versões do Unix, ou eles podem ter nomes diferentes, como **adduser** e **addgroup**.

2. Mude a localização para o diretório que contém o arquivo baixado, descompacte o arquivo e crie um link simbólico chamado `mysql` para o diretório `mysql`.

   Nota

   Os nomes do arquivo e do diretório reais variam de acordo com o número de versão do NDB Cluster.

   ```
   $> cd /var/tmp
   $> tar -C /usr/local -xzvf mysql-cluster-gpl-9.4.0-linux-glibc2.12-x86_64.tar.gz
   $> ln -s /usr/local/mysql-cluster-gpl-9.4.0-linux-glibc2.12-x86_64 /usr/local/mysql
   ```

3. Mude a localização para o diretório `mysql` e configure as bases de dados do sistema usando **mysqld** `--initialize` como mostrado aqui:

   ```
   $> cd mysql
   $> mysqld --initialize
   ```

   Isso gera uma senha aleatória para a conta `root` do MySQL. Se você *não* quiser que a senha aleatória seja gerada, pode substituir a opção `--initialize-insecure` por `--initialize`. Em qualquer caso, você deve revisar a Seção 2.9.1, “Inicializando o Diretório de Dados”, para obter informações adicionais antes de realizar essa etapa. Veja também a Seção 6.4.2, “mysql\_secure\_installation — Melhorar a Segurança da Instalação do MySQL”.

4. Defina as permissões necessárias para o servidor MySQL e os diretórios de dados:

   ```
   $> chown -R root .
   $> chown -R mysql data
   $> chgrp -R mysql .
   ```

5. Copie o script de inicialização do MySQL para o diretório apropriado, torne-o executável e configure-o para iniciar quando o sistema operacional for inicializado:

   ```
   $> cp support-files/mysql.server /etc/rc.d/init.d/
   $> chmod +x /etc/rc.d/init.d/mysql.server
   $> chkconfig --add mysql.server
   ```

   (O diretório de scripts de inicialização pode variar dependendo do seu sistema operacional e versão — por exemplo, em algumas distribuições Linux, é `/etc/init.d`.)

   Aqui, usamos o **chkconfig** da Red Hat para criar links para os scripts de inicialização; use o meio apropriado para essa finalidade na sua plataforma, como **update-rc.d** no Debian.

Lembre-se de que os passos anteriores devem ser repetidos em cada máquina onde um nó do SQL deve residir.

**Nodos de dados.** A instalação dos binários de nó de dados do NDB Cluster não requer o binário **mysqld**. São necessários apenas os binários de nó de dados do NDB Cluster **ndbd** (monotêmico) ou **ndbmtd**") (multitêmico). Esses binários também podem ser encontrados no arquivo `.tar.gz`. Novamente, assumimos que você colocou esse arquivo em `/var/tmp`.

Com o sistema como `root` (ou seja, após usar **sudo**, **su root** ou o equivalente do seu sistema para assumir temporariamente os privilégios da conta de administrador do sistema), execute as seguintes etapas para instalar os binários do nó de dados no hosts dos nós de dados:

1. Mude para o diretório `/var/tmp` e extraia os binários **ndbd** e **ndbmtd**") do arquivo para um diretório adequado, como `/usr/local/bin`:

   ```
   $> cd /var/tmp
   $> tar -zxvf mysql-cluster-gpl-9.4.0-linux-glibc2.12-x86_64.tar.gz
   $> cd mysql-cluster-gpl-9.4.0-linux-glibc2.12-x86_64
   $> cp bin/ndbd /usr/local/bin/ndbd
   $> cp bin/ndbmtd /usr/local/bin/ndbmtd
   ```

   (Você pode excluir com segurança o diretório criado ao descompactar o arquivo baixado e os arquivos que ele contém de `/var/tmp` assim que **ndb\_mgm** e **ndb\_mgmd** forem copiados para o diretório de executações.)

2. Mude para o diretório onde você copiou os arquivos e, em seguida, torne ambos os arquivos executáveis:

   ```
   $> cd /usr/local/bin
   $> chmod +x ndb*
   ```

As etapas anteriores devem ser repetidas em cada host do nó de dados.

Embora apenas um dos binários do nó de dados seja necessário para executar um nó de dados do NDB Cluster, mostramos como instalar os binários **ndbd** e **ndbmtd**") nas instruções anteriores. Recomendamos que você faça isso ao instalar ou atualizar o NDB Cluster, mesmo que planeje usar apenas um deles, pois isso economiza tempo e problemas no caso de você decidir mudar de um para o outro mais tarde.

Nota

O diretório de dados em cada máquina que hospeda um nó de dados é `/usr/local/mysql/data`. Essa informação é essencial ao configurar o nó de gerenciamento. (Veja a Seção 25.3.3, “Configuração Inicial do NDB Cluster”.)

**Nodos de gerenciamento.** A instalação do nó de gerenciamento não requer o binário **mysqld**. Apenas o servidor de gerenciamento do NDB Cluster (**ndb\_mgmd**) é necessário; você provavelmente deseja instalar o cliente de gerenciamento (**ndb\_mgm**) também. Ambos os binários também podem ser encontrados no arquivo `.tar.gz`. Novamente, assumimos que você colocou esse arquivo em `/var/tmp`.

Como sistema `root`, execute as seguintes etapas para instalar **ndb\_mgmd** e **ndb\_mgm** no host do nó de gerenciamento:

1. Mude para o diretório `/var/tmp` e extraia os arquivos **ndb\_mgm** e **ndb\_mgmd** do arquivo para um diretório adequado, como `/usr/local/bin`:

   ```
   $> cd /var/tmp
   $> tar -zxvf mysql-cluster-gpl-9.4.0-linux-glibc2.12-x86_64.tar.gz
   $> cd mysql-cluster-gpl-9.4.0-linux-glibc2.12-x86_64
   $> cp bin/ndb_mgm* /usr/local/bin
   ```

   (Você pode excluir com segurança o diretório criado ao descompactar o arquivo baixado e os arquivos que ele contém de `/var/tmp` assim que **ndb\_mgm** e **ndb\_mgmd** forem copiados para o diretório de executaveis.)

2. Mude para o diretório onde você copiou os arquivos e, em seguida, torne ambos os arquivos executáveis:

   ```
   $> cd /usr/local/bin
   $> chmod +x ndb_mgm*
   ```

Na Seção 25.3.3, “Configuração Inicial do NDB Cluster”, criamos arquivos de configuração para todos os nós em nosso exemplo de NDB Cluster.