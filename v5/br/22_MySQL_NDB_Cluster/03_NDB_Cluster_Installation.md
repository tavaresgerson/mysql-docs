## 21.3 Instalação do Cluster NDB

Esta seção descreve os conceitos básicos para planejar, instalar, configurar e executar um NDB Cluster. Embora os exemplos na Seção 21.4, “Configuração do NDB Cluster”, forneçam informações mais detalhadas sobre uma variedade de opções de agrupamento e configuração, o resultado de seguir as diretrizes e procedimentos descritos aqui deve ser um NDB Cluster utilizável que atenda aos requisitos *mínimos* para disponibilidade e proteção de dados.

Para obter informações sobre a atualização ou a desatualização de um NDB Cluster entre versões de lançamento, consulte a Seção 21.3.7, “Atualização e Desatualização do NDB Cluster”.

Esta seção abrange os requisitos de hardware e software; questões de rede; instalação do NDB Cluster; questões básicas de configuração; início, parada e reinício do cluster; carregamento de um banco de dados de amostra; e realização de consultas.

**Premissas.** As seções a seguir fazem várias premissas em relação à configuração física e de rede do cluster. Essas premissas são discutidas nos próximos parágrafos.

**Nodos do cluster e computadores anfitriões.** O cluster é composto por quatro nós, cada um em um computador anfitrião separado, e cada um com um endereço de rede fixo em uma rede Ethernet típica, conforme mostrado aqui:

**Tabela 21.4 Endereços de rede dos nós no cluster de exemplo**

<table><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Núcleo</th> <th>IP Address</th> </tr></thead><tbody><tr> <td>nó de gestão (<strong>mgmd</strong>)</td> <td>198.51.100.10</td> </tr><tr> <td>nó SQL (<strong>mysqld</strong>)</td> <td>198.51.100.20</td> </tr><tr> <td>Nodo de dados "A" (<strong>ndbd</strong>)</td> <td>198.51.100.30</td> </tr><tr> <td>Nodo de dados "B" (<strong>ndbd</strong>)</td> <td>198.51.100.40</td> </tr></tbody></table>

Essa configuração também é mostrada no diagrama a seguir:

**Figura 21.4 Configuração de cluster NDBS com vários computadores**

![Most content is described in the surrounding text. The four nodes each connect to a central switch that connects to a network.](images/multi-comp-1.png)

**Endereçamento de rede.**

Por simplicidade (e confiabilidade), este *Como Fazer* usa apenas endereços IP numéricos. No entanto, se a resolução DNS estiver disponível na sua rede, é possível usar nomes de host em vez de endereços IP na configuração do Cluster. Alternativamente, você pode usar o arquivo `hosts` (tipicamente `/etc/hosts` para Linux e outros sistemas operacionais semelhantes ao Unix, `C:\WINDOWS\system32\drivers\etc\hosts` no Windows, ou o equivalente do seu sistema operacional) para fornecer um meio de fazer uma busca de host, se tal estiver disponível.

**Problemas com o arquivo de hosts potencial.** Um problema comum ao tentar usar nomes de host para nós do Cluster ocorre devido à maneira como alguns sistemas operacionais (incluindo algumas distribuições Linux) configuram o próprio nome de host do sistema no `/etc/hosts` durante a instalação. Considere duas máquinas com os nomes de host `ndb1` e `ndb2`, ambas no domínio de rede `cluster`. O Red Hat Linux (incluindo algumas derivações como CentOS e Fedora) coloca as seguintes entradas nos arquivos `/etc/hosts` dessas máquinas:

```sql
#  ndb1 /etc/hosts:
127.0.0.1   ndb1.cluster ndb1 localhost.localdomain localhost
```

```sql
#  ndb2 /etc/hosts:
127.0.0.1   ndb2.cluster ndb2 localhost.localdomain localhost
```

O SUSE Linux (incluindo o OpenSUSE) coloca essas entradas nos arquivos `/etc/hosts` das máquinas:

```sql
#  ndb1 /etc/hosts:
127.0.0.1       localhost
127.0.0.2       ndb1.cluster ndb1
```

```sql
#  ndb2 /etc/hosts:
127.0.0.1       localhost
127.0.0.2       ndb2.cluster ndb2
```

Em ambos os casos, as rotas `ndb1` redirecionam `ndb1.cluster` para um endereço de rede de loopback, mas obtêm um endereço IP público do DNS para `ndb2.cluster`, enquanto `ndb2` redireciona `ndb2.cluster` para um endereço de loopback e obtém um endereço público para `ndb1.cluster`. O resultado é que cada nó de dados se conecta ao servidor de gerenciamento, mas não consegue saber quando outros nós de dados se conectaram, e, assim, os nós de dados parecem ficar suspensos ao iniciar.

Cuidado

Não é possível misturar `localhost` e outros nomes de host ou endereços IP em `config.ini`. Por essas razões, a solução nesses casos (exceto o uso de endereços IP para *todos* os registros `config.ini` `HostName` é) é remover os nomes de host totalmente qualificados de `/etc/hosts` e usá-los em `config.ini` para todos os hosts do cluster.

**Tipo de computador hospedeiro.** Cada computador hospedeiro em nosso cenário de instalação é um PC de mesa baseado em Intel que executa um sistema operacional compatível instalado em disco em uma configuração padrão, sem executar serviços desnecessários. O sistema operacional principal com capacidades padrão de rede TCP/IP deve ser suficiente. Além disso, por simplicidade, também assumimos que os sistemas de arquivos em todos os hosts estejam configurados de forma idêntica. Caso contrário, você deve adaptar essas instruções conforme necessário.

**Hardware de rede.** Cartões padrão de 100 Mbps ou 1 gigabit de Ethernet são instalados em cada máquina, juntamente com os drivers adequados para os cartões, e que todos os quatro hosts estejam conectados através de um dispositivo de rede Ethernet padrão, como um switch. (Todas as máquinas devem usar cartões de rede com o mesmo desempenho. Ou seja, todas as quatro máquinas no clúster devem ter cartões de 100 Mbps *ou* todas as quatro máquinas devem ter cartões de 1 Gbps.) O NDB Cluster funciona em uma rede de 100 Mbps; no entanto, o Ethernet de gigabit oferece melhor desempenho.

Importante

O NDB Cluster *não* é destinado para uso em uma rede para a qual o throughput seja inferior a 100 Mbps ou que apresente um alto grau de latência. Por essa razão (entre outras), tentar executar um NDB Cluster em uma rede de área ampla, como a Internet, provavelmente não será bem-sucedido e não é suportado em produção.

**Dados de amostra.** Usamos o banco de dados `world`, que está disponível para download no site do MySQL (consulte https://dev.mysql.com/doc/index-other.html). Assumemos que cada máquina tenha memória suficiente para executar o sistema operacional, os processos necessários do NDB Cluster e (nos nós de dados) para armazenar o banco de dados.

Para informações gerais sobre a instalação do MySQL, consulte o Capítulo 2, *Instalando e Atualizando o MySQL*. Para informações sobre a instalação do NDB Cluster no Linux e em outros sistemas operacionais do tipo Unix, consulte a Seção 21.3.1, “Instalação do NDB Cluster no Linux”. Para informações sobre a instalação do NDB Cluster em sistemas operacionais Windows, consulte a Seção 21.3.2, “Instalando o NDB Cluster no Windows”.

Para informações gerais sobre os requisitos de hardware, software e redes do NDB Cluster, consulte a Seção 21.2.3, “Requisitos de hardware, software e redes do NDB Cluster”.

### 21.3.1 Instalação do NDB Cluster no Linux

Esta seção abrange os métodos de instalação do NDB Cluster no Linux e em outros sistemas operacionais semelhantes ao Unix. Embora as próximas seções se refiram a um sistema operacional Linux, as instruções e procedimentos fornecidos lá devem ser facilmente adaptáveis a outras plataformas Unix semelhantes suportadas. Para instruções de instalação e configuração manuais específicas para sistemas Windows, consulte a Seção 21.3.2, “Instalando o NDB Cluster no Windows”.

Cada computador hospedeiro do NDB Cluster deve ter os programas executáveis corretos instalados. Um hospedeiro que executa um nó SQL deve ter instalado nele um binário do servidor MySQL (`mysqld`). Os nós de gerenciamento requerem o daemon do servidor de gerenciamento (**ndb\_mgmd**); os nós de dados requerem o daemon do nó de dados (**ndbd** ou **ndbmtd**). Não é necessário instalar o binário do servidor MySQL nos hosts dos nós de gerenciamento e dos hosts dos nós de dados. É recomendável que você também instale o cliente de gerenciamento (**ndb\_mgm**) no host do servidor de gerenciamento.

A instalação do NDB Cluster no Linux pode ser feita usando binários pré-compilados da Oracle (baixados como um arquivo .tar.gz), com pacotes RPM (também disponíveis na Oracle) ou a partir do código-fonte. Todos esses três métodos de instalação são descritos na seção a seguir.

Independentemente do método utilizado, ainda é necessário, após a instalação dos binários do NDB Cluster, criar arquivos de configuração para todos os nós do cluster, antes de poder iniciar o cluster. Veja a Seção 21.3.3, “Configuração Inicial do NDB Cluster”.

#### 21.3.1.1 Instalar uma versão binária do NDB Cluster no Linux

Esta seção abrange os passos necessários para instalar os executaveis corretos para cada tipo de nó do Cluster a partir de binários pré-compilados fornecidos pela Oracle.

Para configurar um clúster usando binários pré-compilados, o primeiro passo no processo de instalação de cada host do clúster é baixar o arquivo binário da página de downloads do [NDB Cluster][(https://dev.mysql.com/downloads/cluster/)]. (Para a versão mais recente do NDB 7.6 de 64 bits, isso é `mysql-cluster-gpl-7.6.35-linux-glibc2.12-x86_64.tar.gz`.). Assumemos que você colocou esse arquivo no diretório `/var/tmp` de cada máquina.

Se você precisar de um binário personalizado, consulte a Seção 2.8.5, “Instalando o MySQL usando um conjunto de fontes de desenvolvimento”.

Nota

Após completar a instalação, ainda não execute nenhum dos binários. Mostramos como fazer isso após a configuração dos nós (consulte a Seção 21.3.3, “Configuração Inicial do NDB Cluster”).

**Nodos SQL.** Em cada uma das máquinas designadas para hospedar os nós SQL, realize as etapas a seguir como usuário do sistema `root`:

1. Verifique seus arquivos `/etc/passwd` e `/etc/group` (ou use as ferramentas fornecidas pelo seu sistema operacional para gerenciar usuários e grupos) para verificar se já existe um grupo `mysql` e um usuário `mysql` no sistema. Algumas distribuições de SO criam esses grupos como parte do processo de instalação do sistema operacional. Se eles ainda não estiverem presentes, crie um novo grupo de usuário `mysql`, e depois adicione um usuário `mysql` a este grupo:

   ```sql
   $> groupadd mysql
   $> useradd -g mysql -s /bin/false mysql
   ```

A sintaxe para **useradd** e **groupadd** pode diferir ligeiramente em diferentes versões do Unix, ou eles podem ter nomes diferentes, como **adduser** e **addgroup**.

2. Mude o local para o diretório que contém o arquivo baixado, desempaquete o arquivo e crie um link simbólico chamado `mysql` para o diretório `mysql`.

Nota

Os nomes dos arquivos e diretórios reais variam de acordo com o número da versão do NDB Cluster.

   ```sql
   $> cd /var/tmp
   $> tar -C /usr/local -xzvf mysql-cluster-gpl-7.6.35-linux-glibc2.12-x86_64.tar.gz
   $> ln -s /usr/local/mysql-cluster-gpl-7.6.35-linux-glibc2.12-x86_64 /usr/local/mysql
   ```

3. Mude a localização para o diretório `mysql` e configure os bancos de dados do sistema usando `mysqld` `--initialize` conforme mostrado aqui:

   ```sql
   $> cd mysql
   $> mysqld --initialize
   ```

Isso gera uma senha aleatória para a conta MySQL `root`. Se você *não* quiser que a senha aleatória seja gerada, pode substituir a opção `--initialize-insecure` por `--initialize`. Em qualquer caso, você deve revisar a Seção 2.9.1, “Inicializando o Diretório de Dados”, para obter informações adicionais antes de realizar essa etapa. Veja também a Seção 4.4.4, “mysql\_secure\_installation — Melhorar a Segurança da Instalação do MySQL”.

4. Defina as permissões necessárias para o servidor MySQL e os diretórios de dados:

   ```sql
   $> chown -R root .
   $> chown -R mysql data
   $> chgrp -R mysql .
   ```

5. Copie o script de inicialização do MySQL para o diretório apropriado, torne-o executável e configure-o para iniciar quando o sistema operacional é inicializado:

   ```sql
   $> cp support-files/mysql.server /etc/rc.d/init.d/
   $> chmod +x /etc/rc.d/init.d/mysql.server
   $> chkconfig --add mysql.server
   ```

(O diretório de scripts de inicialização pode variar dependendo do seu sistema operacional e versão — por exemplo, em algumas distribuições Linux, é `/etc/init.d`.)

Aqui, usamos o **chkconfig** da Red Hat para criar links aos scripts de inicialização; use qualquer meio apropriado para esse propósito na sua plataforma, como **update-rc.d** no Debian.

Lembre-se de que os passos anteriores devem ser repetidos em cada máquina onde um nó SQL deve residir.

**Nodos de dados.** A instalação dos nós de dados do NDB Cluster não requer o binário `mysqld`. Apenas o executável do nó de dados do NDB Cluster **ndbd** (monotrilhado) ou **ndbmtd**") (multitrilhado) é necessário. Esses binários também podem ser encontrados no arquivo `.tar.gz`. Novamente, assumimos que você colocou esse arquivo em `/var/tmp`.

Como sistema `root` (ou seja, após usar **sudo**, **su root** ou o equivalente do seu sistema para assumir temporariamente os privilégios da conta de administrador do sistema), realize as etapas a seguir para instalar os binários do nó de dados nos hosts do nó de dados:

1. Mude a localização para o diretório `/var/tmp` e extraia os binários **ndbd** e **ndbmtd**") do arquivo para um diretório adequado, como `/usr/local/bin`:

   ```sql
   $> cd /var/tmp
   $> tar -zxvf mysql-cluster-gpl-7.6.35-linux-glibc2.12-x86_64.tar.gz
   $> cd mysql-cluster-gpl-7.6.35-linux-glibc2.12-x86_64
   $> cp bin/ndbd /usr/local/bin/ndbd
   $> cp bin/ndbmtd /usr/local/bin/ndbmtd
   ```

(Você pode, com segurança, excluir o diretório criado ao desempacotar o arquivo baixado e os arquivos que ele contém, a partir de `/var/tmp` assim que **ndb\_mgm** e **ndb\_mgmd** forem copiados para o diretório de executaveis.)

2. Mude o local para o diretório no qual você copiou os arquivos e, em seguida, torne ambos os arquivos executáveis:

   ```sql
   $> cd /usr/local/bin
   $> chmod +x ndb*
   ```

Os passos anteriores devem ser repetidos em cada servidor de nó de dados.

Embora apenas um dos executaveis do nó de dados seja necessário para executar um nó de dados do NDB Cluster, mostramos como instalar tanto o **ndbd** quanto o **ndbmtd**") nas instruções anteriores. Recomendamos que você faça isso ao instalar ou atualizar o NDB Cluster, mesmo que planeje usar apenas um deles, pois isso deve economizar tempo e problemas no caso de você decidir mudar de um para o outro posteriormente.

Nota

O diretório de dados em cada máquina que hospeda um nó de dados é `/usr/local/mysql/data`. Essa informação é essencial ao configurar o nó de gerenciamento. (Veja a Seção 21.3.3, “Configuração Inicial do NDB Cluster”.)

**Nodos de gerenciamento.** A instalação do nó de gerenciamento não requer o binário `mysqld`. Apenas o servidor de gerenciamento do NDB Cluster (**ndb\_mgmd**) é necessário; você provavelmente quer instalar o cliente de gerenciamento (**ndb\_mgm**) também. Ambos esses binários também podem ser encontrados no arquivo `.tar.gz`. Novamente, assumimos que você colocou esse arquivo em `/var/tmp`.

Como sistema `root`, realize os seguintes passos para instalar **ndb\_mgmd** e **ndb\_mgm** no host do nó de gerenciamento:

1. Mude a localização para o diretório `/var/tmp` e extraia os arquivos **ndb\_mgm** e **ndb\_mgmd** do arquivo para um diretório adequado, como `/usr/local/bin`:

   ```sql
   $> cd /var/tmp
   $> tar -zxvf mysql-cluster-gpl-7.6.35-linux-glibc2.12-x86_64.tar.gz
   $> cd mysql-cluster-gpl-7.6.35-linux-glibc2.12-x86_64
   $> cp bin/ndb_mgm* /usr/local/bin
   ```

(Você pode, com segurança, excluir o diretório criado ao desempacotar o arquivo baixado e os arquivos que ele contém, a partir de `/var/tmp` assim que **ndb\_mgm** e **ndb\_mgmd** forem copiados para o diretório de executaveis.)

2. Mude o local para o diretório no qual você copiou os arquivos e, em seguida, torne ambos os arquivos executáveis:

   ```sql
   $> cd /usr/local/bin
   $> chmod +x ndb_mgm*
   ```

Na Seção 21.3.3, “Configuração inicial do NDB Cluster”, criamos arquivos de configuração para todos os nós do nosso exemplo de NDB Cluster.

#### 21.3.1.2 Instalar o NDB Cluster a partir do RPM

Esta seção abrange os passos necessários para instalar os executaveis corretos para cada tipo de nó do NDB Cluster usando pacotes RPM fornecidos pela Oracle.

Como alternativa ao método descrito nesta seção, a Oracle oferece Repositórios MySQL para NDB Cluster 7.5.6 e versões posteriores que são compatíveis com muitas distribuições Linux comuns. Dois repositórios, listados aqui, estão disponíveis para distribuições baseadas em RPM:

* Para distribuições que utilizam **yum** ou **dnf**, você pode usar o Repositório Yum de MySQL para NDB Cluster. Consulte *Instalando MySQL NDB Cluster usando o Repositório Yum*, para obter instruções e informações adicionais.

* Para SLES, você pode usar o Repositório MySQL SLES para NDB Cluster. Consulte *Instalando MySQL NDB Cluster usando o Repositório SLES*, para obter instruções e informações adicionais.

Os RPMs estão disponíveis tanto para plataformas Linux de 32 bits quanto de 64 bits. Os nomes de arquivo desses RPMs utilizam o seguinte padrão:

```sql
mysql-cluster-community-data-node-7.5.8-1.el7.x86_64.rpm

mysql-cluster-license-component-ver-rev.distro.arch.rpm

    license:= {commercial | community}

    component: {management-server | data-node | server | client | other—see text}

    ver: major.minor.release

    rev: major[.minor]

    distro: {el6 | el7 | sles12}

    arch: {i686 | x86_64}
```

*`license`* indica se o RPM faz parte de uma versão comercial ou comunitária do NDB Cluster. No restante desta seção, assumimos que você está instalando uma versão comunitária para os exemplos.

Os possíveis valores para *`component`*, com descrições, podem ser encontrados na tabela a seguir:

**Tabela 21.5 Componentes da distribuição RPM do NDB Cluster**

<table><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Component</th> <th>Descrição</th> </tr></thead><tbody><tr> <td><code>auto-installer</code></td> <td>Programa de Autoinstalador do NDB Cluster (DESAPARECIDO); consulte a Seção 21.3.8, “O Autoinstalador do NDB Cluster (NDB 7.5) (NÃO MAIS APOIADO)”, para uso</td> </tr><tr> <td><code>client</code></td> <td>MySQL e<code>NDB</code>programas de clientes; inclui<strong>mysql</strong>cliente,<strong>ndb_mgm</strong>cliente e outras ferramentas do cliente</td> </tr><tr> <td><code>common</code></td> <td>Conjunto de caracteres e informações de mensagem de erro necessárias pelo servidor MySQL</td> </tr><tr> <td><code>data-node</code></td> <td><strong>ndbd</strong>e<strong>ndbmtd</strong>binários de nó de dados</td> </tr><tr> <td><code>devel</code></td> <td>Cabeçalhos e arquivos de biblioteca necessários para o desenvolvimento do cliente MySQL</td> </tr><tr> <td><code>embedded</code></td> <td>Servidor MySQL embutido</td> </tr><tr> <td><code>embedded-compat</code></td> <td>Servidor MySQL embutido compatível com versões anteriores</td> </tr><tr> <td><code>embedded-devel</code></td> <td>Arquivos de cabeçalho e de biblioteca para o desenvolvimento de aplicações para MySQL embutido</td> </tr><tr> <td><code>java</code></td> <td>Arquivos JAR necessários para o suporte de aplicações ClusterJ</td> </tr><tr> <td><code>libs</code></td> <td>Bibliotecas de clientes MySQL</td> </tr><tr> <td><code>libs-compat</code></td> <td>Bibliotecas de clientes MySQL compatíveis com versões anteriores</td> </tr><tr> <td><code>management-server</code></td> <td>O servidor de gerenciamento do cluster do NDB<strong>ndb_mgmd</strong>)</td> </tr><tr> <td><code>memcached</code></td> <td>Arquivos necessários para suporte<code>ndbmemcache</code></td> </tr><tr> <td><code>minimal-debuginfo</code></td> <td>Informações de depuração para o pacote server-minimal; úteis ao desenvolver aplicativos que utilizam este pacote ou ao depurar este pacote</td> </tr><tr> <td><code>ndbclient</code></td> <td><code>NDB</code>biblioteca de clientes para executar aplicações da API NDB e da API MGM (<code>libndbclient</code>)</td> </tr><tr> <td><code>ndbclient-devel</code></td> <td>Cabeçalho e outros arquivos necessários para o desenvolvimento de aplicativos da API NDB e da API MGM</td> </tr><tr> <td><code>nodejs</code></td> <td>Arquivos necessários para configurar o suporte Node.JS para o NDB Cluster</td> </tr><tr> <td><code>server</code></td> <td>O servidor MySQL (<strong>mysqld</strong>) com<code>NDB</code>suporte para motor de armazenamento incluído e programas associados ao servidor MySQL</td> </tr><tr> <td><code>server-minimal</code></td> <td>Instalação mínima do servidor MySQL para NDB e ferramentas relacionadas</td> </tr><tr> <td><code>test</code></td> <td><strong>mysqltest</strong>, outros programas de teste do MySQL e arquivos de suporte</td> </tr></tbody></table>

Também está disponível um único pacote (arquivo `.tar`) de todos os RPMs do NDB Cluster para uma determinada plataforma e arquitetura. O nome deste arquivo segue o padrão mostrado aqui:

```sql
mysql-cluster-license-ver-rev.distro.arch.rpm-bundle.tar
```

Você pode extrair os arquivos RPM individuais deste arquivo usando **tar** ou a ferramenta que você prefere para extrair arquivos.

Os componentes necessários para instalar os três principais tipos de nós do NDB Cluster estão listados na lista a seguir:

* Nó de gestão: `management-server`

* *Nodo de dados*: `data-node`
* *Nodo SQL*: `server` e `common`

Além disso, o RPM `client` deve ser instalado para fornecer o cliente de gerenciamento **ndb\_mgm** em pelo menos um nó de gerenciamento. Você também pode querer instalá-lo em nós SQL, para ter **mysql** e outros programas de cliente MySQL disponíveis nesses. Discutimos a instalação de nós por tipo mais tarde nesta seção.

*`ver`* representa o número de versão do motor de armazenamento de três partes `NDB` no formato *`x`*.*`7.6.35`* mostrado como `rev` nos exemplos. `major` fornece o número de revisão do RPM no formato *`minor`.*`1.1`*. Nos exemplos mostrados nesta seção, usamos `1.1` para este valor.

O *`distro` (distribuição Linux) é um dos `rhel5` (Oracle Linux 5, Red Hat Enterprise Linux 4 e 5), `el6` (Oracle Linux 6, Red Hat Enterprise Linux 6), `el7` (Oracle Linux 7, Red Hat Enterprise Linux 7) ou `sles12` (SUSE Enterprise Linux 12). Para os exemplos nesta seção, assumimos que o host executa Oracle Linux 7, Red Hat Enterprise Linux 7 ou o equivalente (`el7`).

*`arch`* é `i686` para RPMs de 32 bits e `x86_64` para versões de 64 bits. Nos exemplos mostrados aqui, assumimos uma plataforma de 64 bits.

O número da versão do NDB Cluster nos nomes dos arquivos RPM (mostrado aqui como `7.6.35`) pode variar de acordo com a versão que você está realmente usando. *É muito importante que todos os RPMs do Cluster a serem instalados tenham o mesmo número da versão*. A arquitetura também deve ser apropriada para a máquina na qual o RPM deve ser instalado; em particular, você deve ter em mente que os RPMs de 64 bits (`x86_64`) não podem ser usados com sistemas operacionais de 32 bits (use `i686` para este último).

**Nodos de dados.** Em um computador que deve hospedar um nó de dados de NDB Cluster, é necessário instalar apenas o `data-node` RPM. Para fazer isso, copie este RPM para o host do nó de dados e execute o seguinte comando como usuário root do sistema, substituindo o nome mostrado para o RPM conforme necessário para corresponder ao do RPM baixado do site da MySQL:

```sql
$> rpm -Uhv mysql-cluster-community-data-node-7.6.35-1.el7.x86_64.rpm
```

Isso instala os binários do nó de dados **ndbd** e **ndbmtd** em `/usr/sbin`. Qualquer um desses pode ser usado para executar um processo de nó de dados neste host.

**Nodos SQL. Copie os RPMs `server` e `common` para cada máquina que será usada para hospedar um nó SQL de NDB Cluster (`server` requer `common`). Instale o RPM `server` executando o seguinte comando como usuário root do sistema, substituindo o nome mostrado para o RPM conforme necessário para corresponder ao nome do RPM baixado do site da MySQL:

```sql
$> rpm -Uhv mysql-cluster-community-server-7.6.35-1.el7.x86_64.rpm
```

Isso instala o binário do servidor MySQL (`mysqld`), com suporte ao mecanismo de armazenamento `NDB`, no diretório `/usr/sbin`. Também instala todos os arquivos de suporte necessários ao servidor MySQL e programas úteis do servidor MySQL, incluindo os scripts de inicialização **mysql.server** e `mysqld_safe` (em `/usr/share/mysql` e `/usr/bin`, respectivamente). O instalador RPM deve cuidar automaticamente de questões de configuração geral (como a criação do usuário e grupo `mysql`, se necessário).

Importante

Você deve usar as versões desses RPMs lançadas para o NDB Cluster; as versões lançadas para o servidor MySQL padrão não fornecem suporte para o mecanismo de armazenamento `NDB`.

Para administrar o nó SQL (servidor MySQL), você também deve instalar o `client` RPM, conforme mostrado aqui:

```sql
$> rpm -Uhv mysql-cluster-community-client-7.6.35-1.el7.x86_64.rpm
```

Isso instala o cliente **mysql** e outros programas do cliente MySQL, como **mysqladmin** e **mysqldump**, para `/usr/bin`.

**Nodos de gerenciamento.** Para instalar o servidor de gerenciamento do NDB Cluster, é necessário apenas usar o `management-server` RPM. Copie este RPM para o computador que será o anfitrião do nó de gerenciamento e, em seguida, instale-o executando o seguinte comando como usuário root do sistema (substitua o nome mostrado para o RPM conforme necessário para corresponder ao do `management-server` RPM baixado do site da MySQL):

```sql
$> rpm -Uhv mysql-cluster-community-management-server-7.6.35-1.el7.x86_64.rpm
```

Este RPM instala o binário do servidor de gerenciamento **ndb\_mgmd** no diretório `/usr/sbin`. Embora este seja o único programa realmente necessário para executar um nó de gerenciamento, também é uma boa ideia ter o cliente de gerenciamento do NDB Cluster **ndb\_mgm** disponível também. Você pode obter este programa, bem como outros programas de cliente `NDB` como **ndb\_desc** e **ndb\_config**, instalando o RPM `client` conforme descrito anteriormente.

Nota

Anteriormente, o **ndb\_mgm** era instalado pelo mesmo RPM usado para instalar o servidor de gerenciamento. Em NDB 7.5 (e posteriormente), todos os programas de cliente `NDB` são obtidos a partir do mesmo RPM `client` que instala o **mysql** e outros clientes MySQL.

Consulte a Seção 2.5.5, “Instalando MySQL no Linux usando pacotes RPM da Oracle”, para obter informações gerais sobre a instalação do MySQL usando RPMs fornecidos pela Oracle.

Após a instalação a partir do RPM, você ainda precisa configurar o clúster; consulte a Seção 21.3.3, “Configuração Inicial do Clúster NDB”, para obter as informações relevantes.

Consulte a Seção 2.5.5, “Instalando o MySQL no Linux usando pacotes RPM da Oracle”, para obter informações gerais sobre a instalação do MySQL usando RPMs fornecidos pela Oracle. Consulte a Seção 21.3.3, “Configuração inicial do NDB Cluster”, para obter informações sobre a configuração pós-instalação necessária.

#### 21.3.1.3 Instalar o NDB Cluster usando arquivos .deb

A seção fornece informações sobre a instalação do NDB Cluster no Debian e em distribuições Linux relacionadas, como o Ubuntu, usando os arquivos `.deb` fornecidos pela Oracle para esse propósito.

Para o NDB Cluster 7.5.6 e versões posteriores, a Oracle também oferece um repositório APT para Debian e outras distribuições. Consulte *Instalando o MySQL NDB Cluster usando o repositório APT*, para obter instruções e informações adicionais.

A Oracle fornece os arquivos do instalador `.deb` para o NDB Cluster 7.5 e versões posteriores para plataformas de 32 bits e 64 bits. Para um sistema baseado em Debian, apenas um único arquivo de instalação é necessário. Este arquivo é nomeado de acordo com o padrão mostrado aqui, de acordo com a versão do NDB Cluster aplicável, a versão do Debian e a arquitetura:

```sql
mysql-cluster-gpl-ndbver-debiandebianver-arch.deb
```

Aqui, *`ndbver`* é o número de versão do motor de 3 partes `NDB`, *`debianver`* é a versão principal do Debian (`8` ou `9`) e *`arch`* é um dos `i686` ou `x86_64`. Nos exemplos que se seguem, assumimos que você deseja instalar o NDB 7.6.35 em um sistema Debian 9 de 64 bits; nesse caso, o arquivo do instalador é denominado `mysql-cluster-gpl-7.6.35-debian9-x86_64.deb-bundle.tar`.

Depois de baixar o arquivo apropriado `.deb`, você pode desempacotar-lo e, em seguida, instalá-lo a partir da linha de comando usando `dpkg`, da seguinte forma:

```sql
$> dpkg -i mysql-cluster-gpl-7.6.35-debian9-i686.deb
```

Você também pode removê-lo usando `dpkg` como mostrado aqui:

```sql
$> dpkg -r mysql
```

O arquivo do instalador também deve ser compatível com a maioria dos gerenciadores de pacotes gráficos que trabalham com arquivos `.deb`, como o `GDebi` para o ambiente de trabalho Gnome.

O arquivo `.deb` instala o NDB Cluster sob `/opt/mysql/server-version/`, onde *`version`* é a versão da série de lançamento de duas partes para o servidor MySQL incluído. Para o NDB 7.5 e versões posteriores, isso é sempre `5.7`. O layout do diretório é o mesmo que o da distribuição binária genérica de Linux (consulte a Tabela 2.3, “Layout de Instalação do MySQL para Pacote Binário Genérico Unix/Linux”), com a exceção de que os scripts de inicialização e os arquivos de configuração são encontrados em `support-files` em vez de `share`. Todos os executaveis do NDB Cluster, como **ndb\_mgm**, **ndbd** e **ndb\_mgmd**, são colocados no diretório `bin`.

#### 21.3.1.4 Construindo um cluster NDB Cluster a partir do código-fonte no Linux

Esta seção fornece informações sobre a compilação do NDB Cluster no Linux e em outras plataformas semelhantes ao Unix. A construção do NDB Cluster a partir de fontes é semelhante à construção do servidor MySQL padrão, embora difira em alguns aspectos-chave discutidos aqui. Para informações gerais sobre a construção do MySQL a partir de fontes, consulte a Seção 2.8, “Instalando MySQL a partir de fontes”. Para informações sobre a compilação do NDB Cluster em plataformas Windows, consulte a Seção 21.3.2.2, “Compilando e Instalando o NDB Cluster a partir de fontes em Windows”.

Para construir o NDB Cluster, é necessário usar as fontes do NDB Cluster. Elas estão disponíveis na página de downloads do NDB Cluster em <https://dev.mysql.com/downloads/cluster/>. O arquivo de fonte arquivado deve ter um nome semelhante a `mysql-cluster-gpl-7.6.35.tar.gz`. Você também pode obter as fontes do NDB Cluster no GitHub em <https://github.com/mysql/mysql-server/tree/cluster-7.5> (NDB 7.5) e <https://github.com/mysql/mysql-server/tree/cluster-7.6> (NDB 7.6). *A construção do NDB Cluster 7.5 ou 7.6 a partir das fontes padrão do MySQL Server 5.7 não é suportada*.

A opção `WITH_NDBCLUSTER_STORAGE_ENGINE` para o **CMake** faz com que os binários para os nós de gerenciamento, nós de dados e outros programas do NDB Cluster sejam construídos; também faz com que o `mysqld` seja compilado com suporte ao mecanismo de armazenamento `NDB`. Esta opção (ou seu alias `WITH_NDBCLUSTER`) é necessária ao construir o NDB Cluster.

Importante

A opção `WITH_NDB_JAVA` é habilitada por padrão. Isso significa que, por padrão, se o **CMake** não conseguir encontrar a localização do Java no seu sistema, o processo de configuração falha; se você não deseja habilitar o suporte ao Java e ao ClusterJ, deve indicar isso explicitamente, configurando a compilação usando `-DWITH_NDB_JAVA=OFF`. Use `WITH_CLASSPATH` para fornecer o caminho de classe do Java, se necessário.

Para obter mais informações sobre as opções do **CMake** específicas para a construção do NDB Cluster, consulte Opções do CMake para Compilar o NDB Cluster.

Depois de executar **make && make install** (ou o equivalente do seu sistema), o resultado é semelhante ao obtido ao desempacotar um binário pré-compilado na mesma localização.

**Nodos de gerenciamento.** Ao construir a partir da fonte e executar o **make install** padrão, os binários do servidor de gerenciamento e do cliente de gerenciamento (**ndb\_mgmd** e **ndb\_mgm**) podem ser encontrados em `/usr/local/mysql/bin`. Apenas **ndb\_mgmd** é necessário estar presente em um host de nó de gerenciamento; no entanto, também é uma boa ideia ter **ndb\_mgm** presente na mesma máquina do host. Nenhum desses executáveis requer um local específico no sistema de arquivos da máquina do host.

**Nodos de dados.** O único executável necessário em um host de nó de dados é o binário do nó de dados **ndbd** ou **ndbmtd**"). (`mysqld`, por exemplo, não precisa estar presente na máquina do host). Por padrão, ao compilar a partir de fonte, este arquivo é colocado no diretório `/usr/local/mysql/bin`. Para instalação em vários hosts de nó de dados, apenas **ndbd** ou **ndbmtd**") precisa ser copiado para a(s) outra(s) máquina(s) do host. (Isso assume que todos os hosts de nó de dados utilizam a mesma arquitetura e sistema operacional; caso contrário, você pode precisar compilar separadamente para cada plataforma diferente.) O binário do nó de dados não precisa estar em qualquer local específico no sistema de arquivos do host, desde que o local seja conhecido.

Ao compilar o NDB Cluster a partir do código fonte, não são necessárias opções especiais para a construção de binários de nós de dados multithread. Configurar a compilação com suporte ao motor de armazenamento `NDB` faz com que **ndbmtd**") seja construído automaticamente; o binário **ndbmtd**") é colocado no diretório de instalação `bin` juntamente com `mysqld`, **ndbd** e **ndb\_mgm**.

**Nodos SQL.** Se você compilar o MySQL com suporte a clustering e realizar a instalação padrão (usando **make install** como usuário do sistema `root`), `mysqld` é colocado em `/usr/local/mysql/bin`. Siga os passos dados na Seção 2.8, “Instalando MySQL a partir de fonte” para preparar `mysqld` para uso. Se você deseja executar vários nós SQL, pode usar uma cópia do mesmo executável `mysqld` e seus arquivos de suporte associados em várias máquinas. A maneira mais fácil de fazer isso é copiar o diretório inteiro `/usr/local/mysql` e todos os diretórios e arquivos contidos nele para o(s) outro(s) host(es) do nó SQL, e depois repetir os passos da Seção 2.8, “Instalando MySQL a partir de fonte” em cada máquina. Se você configurar a compilação com uma opção `PREFIX` não padrão, você deve ajustar o diretório conforme necessário.

Na Seção 21.3.3, “Configuração inicial do NDB Cluster”, criamos arquivos de configuração para todos os nós do nosso exemplo de NDB Cluster.

### 21.3.2 Instalar o NDB Cluster no Windows

Esta seção descreve os procedimentos de instalação do NDB Cluster em anfitriões Windows. Os binários do NDB Cluster 7.5 e 7.6 para Windows podem ser obtidos em <https://dev.mysql.com/downloads/cluster/>. Para informações sobre a instalação do NDB Cluster em Windows a partir de uma versão binária fornecida pela Oracle, consulte a Seção 21.3.2.1, “Instalando o NDB Cluster em Windows a partir de uma versão binária”.

É também possível compilar e instalar o NDB Cluster a partir de fonte no Windows usando o Microsoft Visual Studio. Para mais informações, consulte a Seção 21.3.2.2, “Compilar e instalar o NDB Cluster a partir de fonte no Windows”.

#### 21.3.2.1 Instalar o NDB Cluster no Windows a partir de uma versão binária

Esta seção descreve uma instalação básica do NDB Cluster no Windows usando uma versão binária do NDB Cluster “sem instalação” fornecida pela Oracle, utilizando a mesma configuração de 4 nós descrita no início desta seção (consulte a Seção 21.3, “Instalação do NDB Cluster”), conforme mostrado na tabela a seguir:

**Tabela 21.6 Endereços de rede dos nós no exemplo de cluster**

<table><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Núcleo</th> <th>IP Address</th> </tr></thead><tbody><tr> <td>nó de gestão (<strong>mgmd</strong>)</td> <td>198.51.100.10</td> </tr><tr> <td>nó SQL (<strong>mysqld</strong>)</td> <td>198.51.100.20</td> </tr><tr> <td>Nodo de dados "A" (<strong>ndbd</strong>)</td> <td>198.51.100.30</td> </tr><tr> <td>Nodo de dados "B" (<strong>ndbd</strong>)</td> <td>198.51.100.40</td> </tr></tbody></table>

Assim como em outras plataformas, o computador hospedeiro do NDB Cluster que executa um nó SQL deve ter instalado nele um binário do servidor MySQL (**mysqld.exe**). Você também deve ter o cliente MySQL (**mysql.exe**) neste host. Para os nós de gerenciamento e os nós de dados, não é necessário instalar o binário do servidor MySQL; no entanto, cada nó de gerenciamento requer o daemon do servidor de gerenciamento (**ndb\_mgmd.exe**); cada nó de dados requer o daemon do nó de dados (**ndbd.exe** ou **ndbmtd.exe**)). Para este exemplo, referenciamos o **ndbd.exe** como o executável do nó de dados, mas você pode instalar **ndbmtd.exe**"), a versão multithread deste programa, em vez disso, da mesma maneira. Você também deve instalar o cliente de gerenciamento (**ndb\_mgm.exe**) no host do servidor de gerenciamento. Esta seção abrange os passos necessários para instalar os binários corretos do Windows para cada tipo de nó do NDB Cluster.

Nota

Assim como outros programas do Windows, os executáveis do NDB Cluster são nomeados com a extensão de arquivo `.exe`. No entanto, não é necessário incluir a extensão `.exe` ao invocar esses programas a partir da linha de comando. Portanto, muitas vezes, simplesmente referenciamos esses programas nesta documentação como `mysqld`, **mysql**, **ndb\_mgmd**, e assim por diante. Você deve entender que, seja qual for o nome que referenciamos (por exemplo), `mysqld` ou **mysqld.exe**, ambos os nomes significam a mesma coisa (o programa do Servidor MySQL).

Para configurar um NDB Cluster usando os binários `no-install` da Oracle, o primeiro passo no processo de instalação é baixar o arquivo ZIP de binários do NDB Cluster Windows mais recente a partir de <https://dev.mysql.com/downloads/cluster/>. Este arquivo tem um nome de arquivo de `mysql-cluster-gpl-ver-winarch.zip`, onde *`ver`* é a versão do motor de armazenamento `NDB` (como `7.6.35`) e *`arch`* é a arquitetura (`32` para binários de 32 bits e `64` para binários de 64 bits). Por exemplo, o arquivo NDB Cluster 7.6.35 para sistemas Windows de 64 bits é chamado de `mysql-cluster-gpl-7.6.35-win64.zip`.

Você pode executar os binários do NDB Cluster de 32 bits em versões tanto de 32 bits quanto de 64 bits do Windows; no entanto, os binários do NDB Cluster de 64 bits só podem ser usados em versões de 64 bits do Windows. Se você estiver usando uma versão de 32 bits do Windows em um computador que tem uma CPU de 64 bits, então você deve usar os binários do NDB Cluster de 32 bits.

Para minimizar o número de arquivos que precisam ser baixados da Internet ou copiados entre máquinas, começamos com o computador onde você pretende executar o nó SQL.

**Nodo SQL.** Assumemos que você colocou uma cópia do arquivo no diretório `C:\Documents and Settings\username\My Documents\Downloads` no computador que tem o endereço IP 198.51.100.20, onde *`username`* é o nome do usuário atual. (Você pode obter esse nome usando `ECHO %USERNAME%` na linha de comando.) Para instalar e executar os executaveis do NDB Cluster como serviços do Windows, esse usuário deve ser membro do grupo `Administrators`.

Extraia todos os arquivos do arquivo. O Assistente de Extração integrado ao Windows Explorer é adequado para essa tarefa. (Se você usar um programa de arquivo diferente, certifique-se de que ele extraia todos os arquivos e diretórios do arquivo e que preserve a estrutura de diretório do arquivo.) Quando você for solicitado um diretório de destino, insira `C:\`, o que faz com que o Assistente de Extração extraia o arquivo para o diretório `C:\mysql-cluster-gpl-ver-winarch`. Renomeie esse diretório para `C:\mysql`.

É possível instalar os binários do NDB Cluster em diretórios que não sejam `C:\mysql\bin`; no entanto, se você fizer isso, deve modificar os caminhos mostrados neste procedimento conforme necessário. Em particular, se o binário do Servidor MySQL (nó SQL) estiver instalado em um local diferente de `C:\mysql` ou `C:\Program Files\MySQL\MySQL Server 5.7`, ou se o diretório de dados do nó SQL estiver em um local diferente de `C:\mysql\data` ou `C:\Program Files\MySQL\MySQL Server 5.7\data`, opções de configuração adicionais devem ser usadas na linha de comando ou adicionadas ao arquivo `my.ini` ou `my.cnf` ao iniciar o nó SQL. Para obter mais informações sobre como configurar um Servidor MySQL para executar em um local não padrão, consulte a Seção 2.3.4, “Instalando MySQL no Microsoft Windows usando um arquivo ZIP [[`noinstall`]”.

Para que um servidor MySQL com suporte ao NDB Cluster funcione como parte de um NDB Cluster, ele deve ser iniciado com as opções `--ndbcluster` e `--ndb-connectstring`. Embora você possa especificar essas opções na linha de comando, geralmente é mais conveniente colocá-las em um arquivo de opções. Para fazer isso, crie um novo arquivo de texto no Bloco de Notas ou em outro editor de texto. Insira as seguintes informações de configuração neste arquivo:

```sql
[mysqld]
# Options for mysqld process:
ndbcluster                       # run NDB storage engine
ndb-connectstring=198.51.100.10  # location of management server
```

Você pode adicionar outras opções usadas por este servidor MySQL, se desejar (consulte a Seção 2.3.4.2, “Criando um arquivo de opção”), mas o arquivo deve conter as opções mostradas, no mínimo. Salve este arquivo como `C:\mysql\my.ini`. Isso completa a instalação e configuração do nó SQL.

**Nodos de dados.** Um nó de dados de NDB Cluster em um host Windows requer apenas um único executável, ou seja, **ndbd.exe** ou **ndbmtd.exe**"). Para este exemplo, assumimos que você está usando **ndbd.exe**, mas as mesmas instruções se aplicam quando você usa **ndbmtd.exe""). Em cada computador onde você deseja executar um nó de dados (os computadores com os endereços IP 198.51.100.30 e 198.51.100.40), crie os diretórios `C:\mysql`, `C:\mysql\bin` e `C:\mysql\cluster-data`; em seguida, no computador onde você baixou e extraiu o arquivo `no-install`, localize `ndbd.exe` no diretório `C:\mysql\bin`. Copie este arquivo para o diretório `C:\mysql\bin` em cada um dos dois hosts de nó de dados.

Para funcionar como parte de um NDB Cluster, cada nó de dados deve receber o endereço ou o nome de host do servidor de gerenciamento. Você pode fornecer essas informações na linha de comando usando a opção `--ndb-connectstring` ou `-c` ao iniciar cada processo do nó de dados. No entanto, geralmente é preferível colocar essas informações em um arquivo de opção. Para fazer isso, crie um novo arquivo de texto no Bloco de Notas ou em outro editor de texto e insira o seguinte texto:

```sql
[mysql_cluster]
# Options for data node process:
ndb-connectstring=198.51.100.10  # location of management server
```

Salve este arquivo como `C:\mysql\my.ini` no host do nó de dados. Crie outro arquivo de texto contendo as mesmas informações e salve-o como `C:mysql\my.ini` no outro host do nó de dados, ou copie o arquivo my.ini do primeiro host do nó de dados para o segundo, garantindo que a cópia esteja no diretório `C:\mysql` do segundo nó de dados. Ambos os hosts de nó de dados estão agora prontos para serem usados no NDB Cluster, o que deixa apenas o nó de gerenciamento a ser instalado e configurado.

**Núcleo de gerenciamento**. O único programa executável necessário em um computador usado para hospedar um nó de gerenciamento de NDB Cluster é o programa do servidor de gerenciamento **ndb\_mgmd.exe**. No entanto, para administrar o NDB Cluster uma vez que ele tenha sido iniciado, você também deve instalar o programa de cliente de gerenciamento do NDB Cluster **ndb\_mgm.exe** na mesma máquina que o servidor de gerenciamento. Localize esses dois programas na máquina onde você baixou e extraiu o arquivo `no-install`; isso deve ser o diretório `C:\mysql\bin` no host do nó SQL. Crie o diretório `C:\mysql\bin` no computador com o endereço IP 198.51.100.10, em seguida, copie ambos os programas para este diretório.

Agora, você deve criar dois arquivos de configuração para uso pelo `ndb_mgmd.exe`:

1. Um arquivo de configuração local para fornecer dados de configuração específicos para o próprio nó de gerenciamento. Normalmente, este arquivo só precisa fornecer a localização do arquivo de configuração global do NDB Cluster (veja o item 2).

Para criar este arquivo, comece um novo arquivo de texto no Bloco de Notas ou em outro editor de texto e insira as seguintes informações:

   ```sql
   [mysql_cluster]
   # Options for management node process
   config-file=C:/mysql/bin/config.ini
   ```

Salve este arquivo como o arquivo de texto `C:\mysql\bin\my.ini`.

2. Um arquivo de configuração global a partir do qual o nó de gerenciamento pode obter informações de configuração que regem o NDB Cluster como um todo. No mínimo, esse arquivo deve conter uma seção para cada nó no NDB Cluster, e os endereços IP ou nomes de host para o nó de gerenciamento e todos os nós de dados (parâmetro de configuração `HostName`). Também é aconselhável incluir as seguintes informações adicionais:

* O endereço IP ou o nome de domínio de qualquer nó SQL
* A memória de dados e a memória de índice alocada para cada nó de dados (os parâmetros de configuração `DataMemory` e `IndexMemory`)

* O número de réplicas de fragmento, usando o parâmetro de configuração `NoOfReplicas` (consulte a Seção 21.2.2, "Nodos do clúster NDB, Grupos de nó, Replicatas de fragmento e Partições")

* O diretório onde cada nó de dados armazena seus dados e arquivo de registro, e o diretório onde o nó de gerenciamento mantém seus arquivos de registro (em ambos os casos, o parâmetro de configuração `DataDir`)

Crie um novo arquivo de texto usando um editor de texto, como o Bloco de Notas, e insira as seguintes informações:

   ```sql
   [ndbd default]
   # Options affecting ndbd processes on all data nodes:
   NoOfReplicas=2                      # Number of fragment replicas
   DataDir=C:/mysql/cluster-data       # Directory for each data node's data files
                                       # Forward slashes used in directory path,
                                       # rather than backslashes. This is correct;
                                       # see Important note in text
   DataMemory=80M    # Memory allocated to data storage
   IndexMemory=18M   # Memory allocated to index storage
                     # For DataMemory and IndexMemory, we have used the
                     # default values. Since the "world" database takes up
                     # only about 500KB, this should be more than enough for
                     # this example Cluster setup.

   [ndb_mgmd]
   # Management process options:
   HostName=198.51.100.10              # Hostname or IP address of management node
   DataDir=C:/mysql/bin/cluster-logs   # Directory for management node log files

   [ndbd]
   # Options for data node "A":
                                   # (one [ndbd] section per data node)
   HostName=198.51.100.30          # Hostname or IP address

   [ndbd]
   # Options for data node "B":
   HostName=198.51.100.40          # Hostname or IP address

   [mysqld]
   # SQL node options:
   HostName=198.51.100.20          # Hostname or IP address
   ```

Salve este arquivo como o arquivo de texto `C:\mysql\bin\config.ini`.

Importante

Um único caractere barra invertida (`\`) não pode ser usado ao especificar caminhos de diretório em opções de programa ou arquivos de configuração usados pelo NDB Cluster no Windows. Em vez disso, você deve escapar cada caractere barra invertida com uma segunda barra invertida (`\\`), ou substituir a barra invertida por um caractere barra (`/`). Por exemplo, a seguinte linha da seção `[ndb_mgmd]` de um arquivo `config.ini` do NDB Cluster não funciona:

```sql
DataDir=C:\mysql\bin\cluster-logs
```

Em vez disso, você pode usar qualquer uma das seguintes opções:

```sql
DataDir=C:\\mysql\\bin\\cluster-logs  # Escaped backslashes
```

```sql
DataDir=C:/mysql/bin/cluster-logs     # Forward slashes
```

Por razões de brevidade e legibilidade, recomendamos que você use barras inclinadas em caminhos de diretório usados nas opções de programa do NDB Cluster e nos arquivos de configuração no Windows.

#### 21.3.2.2 Compilando e Instalando o NDB Cluster a partir de fonte no Windows

A Oracle fornece binários pré-compilados do NDB Cluster para Windows, que devem ser adequados para a maioria dos usuários. No entanto, se desejar, também é possível compilar o NDB Cluster para Windows a partir do código-fonte. O procedimento para fazer isso é quase idêntico ao procedimento usado para compilar os binários padrão do MySQL Server para Windows, e usa as mesmas ferramentas. No entanto, há duas diferenças principais:

* Para construir o NDB Cluster, é necessário usar as fontes do NDB Cluster. Elas estão disponíveis na página de downloads do NDB Cluster em <https://dev.mysql.com/downloads/cluster/>. O arquivo de fonte arquivado deve ter um nome semelhante a `mysql-cluster-gpl-7.6.35.tar.gz`. Você também pode obter as fontes do NDB Cluster no GitHub em <https://github.com/mysql/mysql-server/tree/cluster-7.5> (NDB 7.5) e <https://github.com/mysql/mysql-server/tree/cluster-7.6> (NDB 7.6). * A construção do NDB Cluster 7.5 ou 7.6 a partir das fontes padrão do MySQL Server 5.7 não é suportada.

* Você deve configurar a compilação usando a opção `WITH_NDBCLUSTER`, além de quaisquer outras opções de compilação que você deseja usar com o **CMake**. (`WITH_NDBCLUSTER_STORAGE_ENGINE` é suportado como um alias.)

Importante

A opção `WITH_NDB_JAVA` é habilitada por padrão. Isso significa que, por padrão, se o **CMake** não conseguir encontrar a localização do Java no seu sistema, o processo de configuração falha; se você não deseja habilitar o suporte ao Java e ao ClusterJ, deve indicar isso explicitamente, configurando a compilação usando `-DWITH_NDB_JAVA=OFF`. (Bug #12379735) Use `WITH_CLASSPATH` para fornecer o caminho de classe do Java, se necessário.

Para obter mais informações sobre as opções do **CMake** específicas para a construção do NDB Cluster, consulte Opções do CMake para Compilar o NDB Cluster.

Uma vez que o processo de compilação esteja concluído, você pode criar um arquivo Zip contendo os binários compilados; a Seção 2.8.4, “Instalando o MySQL usando uma distribuição de fonte padrão”, fornece os comandos necessários para realizar essa tarefa em sistemas Windows. Os binários do NDB Cluster podem ser encontrados no diretório `bin` do arquivo resultante, que é equivalente ao arquivo `no-install`, e que pode ser instalado e configurado da mesma maneira. Para mais informações, consulte a Seção 21.3.2.1, “Instalando o NDB Cluster no Windows a partir de uma versão binária”.

#### 21.3.2.3 Inicialização inicial do NDB Cluster no Windows

Uma vez que os executáveis do NDB Cluster e os arquivos de configuração necessários estejam disponíveis, realizar um início inicial do cluster é simplesmente uma questão de iniciar os executáveis do NDB Cluster para todos os nós do cluster. Cada processo do nó do cluster deve ser iniciado separadamente, no computador host onde ele reside. O nó de gerenciamento deve ser iniciado primeiro, seguido pelos nós de dados e, finalmente, pelos nós SQL.

1. No nó de gerenciamento, execute o seguinte comando na linha de comando para iniciar o processo do nó de gerenciamento. A saída deve parecer semelhante àquela mostrada aqui:

   ```sql
   C:\mysql\bin> ndb_mgmd
   2010-06-23 07:53:34 [MgmtSrvr] INFO -- NDB Cluster Management Server. mysql-5.7.44-ndb-7.6.36
   2010-06-23 07:53:34 [MgmtSrvr] INFO -- Reading cluster configuration from 'config.ini'
   ```

O processo do nó de gerenciamento continua a imprimir saída de registro no console. Isso é normal, porque o nó de gerenciamento não está executando como um serviço do Windows. (Se você usou o NDB Cluster em uma plataforma semelhante ao Unix, como Linux, você pode notar que o comportamento padrão do nó de gerenciamento nesse sentido no Windows é efetivamente o oposto de seu comportamento em sistemas Unix, onde ele é executado por padrão como um processo de daemon Unix. Esse comportamento também é verdadeiro para os processos de nó de dados do NDB Cluster que estão sendo executados no Windows.) Por esse motivo, não feche a janela na qual o **ndb\_mgmd.exe** está sendo executado; fazer isso mata o processo do nó de gerenciamento. (Veja a Seção 21.3.2.4, “Instalando processos do NDB Cluster como serviços do Windows”, onde mostramos como instalar e executar processos do NDB Cluster como serviços do Windows.)

A opção `-f` necessária informa ao nó de gerenciamento onde encontrar o arquivo de configuração global (`config.ini`). A forma longa desta opção é `--config-file`.

Importante

Um nó de gerenciamento de cluster NDB armazena os dados de configuração que lê do `config.ini`; uma vez que ele criou um cache de configuração, ele ignora o arquivo `config.ini` em iniciações subsequentes, a menos que seja forçado a fazer o contrário. Isso significa que, se o nó de gerenciamento não iniciar devido a um erro neste arquivo, você deve fazer o nó de gerenciamento reler `config.ini` depois de ter corrigido quaisquer erros nele. Você pode fazer isso iniciando o **ndb\_mgmd.exe** com a opção `--reload` ou `--initial` na linha de comando. Qualquer uma dessas opções funciona para atualizar o cache de configuração.

Não é necessário nem aconselhável usar nenhuma dessas opções no arquivo `my.ini` do nó de gerenciamento.

2. Em cada um dos hosts dos nós de dados, execute o comando mostrado aqui para iniciar os processos do nó de dados:

   ```sql
   C:\mysql\bin> ndbd
   2010-06-23 07:53:46 [ndbd] INFO -- Configuration fetched from 'localhost:1186', generation: 1
   ```

Em cada caso, a primeira linha de saída do processo do nó de dados deve se assemelhar ao que é mostrado no exemplo anterior, e é seguida por linhas adicionais de saída de registro. Como no caso do processo do nó de gerenciamento, isso é normal, porque o nó de dados não está sendo executado como um serviço do Windows. Por essa razão, não feche a janela do console na qual o processo do nó de dados está sendo executado; isso mata o **ndbd.exe**. (Para mais informações, consulte a Seção 21.3.2.4, “Instalando processos do NDB Cluster como serviços do Windows”.)

3. Não inicie o nó SQL ainda; ele não pode se conectar ao clúster até que os nós de dados tenham terminado de iniciar, o que pode levar algum tempo. Em vez disso, em uma nova janela do console no host do nó de gerenciamento, inicie o cliente de gerenciamento do NDB Cluster **ndb\_mgm.exe**, que deve estar em `C:\mysql\bin` no host do nó de gerenciamento. (Não tente reutilizar a janela do console onde o **ndb\_mgmd.exe** está em execução digitando **CTRL**+**C**, pois isso mata o nó de gerenciamento.) A saída resultante deve parecer assim:

   ```sql
   C:\mysql\bin> ndb_mgm
   -- NDB Cluster -- Management Client --
   ndb_mgm>
   ```

Quando o prompt `ndb_mgm>` aparecer, isso indica que o cliente de gerenciamento está pronto para receber comandos de gerenciamento do NDB Cluster. Você pode observar o status dos nós de dados, pois eles começam a aparecer ao digitar `ALL STATUS` no prompt do cliente de gerenciamento. Esse comando causa um relatório em execução da sequência de inicialização dos nós de dados, que deve parecer algo assim:

   ```sql
   ndb_mgm> ALL STATUS
   Connected to Management Server at: localhost:1186
   Node 2: starting (Last completed phase 3) (mysql-5.7.44-ndb-7.6.36)
   Node 3: starting (Last completed phase 3) (mysql-5.7.44-ndb-7.6.36)

   Node 2: starting (Last completed phase 4) (mysql-5.7.44-ndb-7.6.36)
   Node 3: starting (Last completed phase 4) (mysql-5.7.44-ndb-7.6.36)

   Node 2: Started (version 7.6.36)
   Node 3: Started (version 7.6.36)

   ndb_mgm>
   ```

Nota

Os comandos emitidos no cliente de gerenciamento não são sensíveis ao caso; usamos letras maiúsculas como a forma canônica desses comandos, mas você não é obrigado a observar essa convenção ao inseri-los no cliente **ndb\_mgm**. Para mais informações, consulte a Seção 21.6.1, “Comandos no cliente de gerenciamento do NDB Cluster”.

A saída produzida por `ALL STATUS` provavelmente variará do que é mostrado aqui, de acordo com a velocidade com que os nós de dados conseguem começar, o número da versão de liberação do software NDB Cluster que você está usando e outros fatores. O que é significativo é que, quando você vê que ambos os nós de dados começaram, você está pronto para começar o nó SQL.

Você pode deixar o **ndb\_mgm.exe** rodando; ele não tem impacto negativo no desempenho do NDB Cluster, e o usaremos no próximo passo para verificar se o nó SQL está conectado ao cluster depois de tê-lo iniciado.

4. No computador designado como anfitrião do nó SQL, abra uma janela de console e navegue até o diretório onde você desempacotou os binários do NDB Cluster (se você está seguindo nosso exemplo, isso é `C:\mysql\bin`).

Comece o nó SQL invocando o **mysqld.exe** a partir da linha de comando, conforme mostrado aqui:

   ```sql
   C:\mysql\bin> mysqld --console
   ```

A opção `--console` faz com que as informações de registro sejam escritas no console, o que pode ser útil em caso de problemas. (Assim que você estiver satisfeito de que o nó SQL está sendo executado de maneira satisfatória, você pode paralisá-lo e recomeçá-lo sem a opção `--console`, para que o registro seja realizado normalmente.)

Na janela do console onde o cliente de gerenciamento (**ndb\_mgm.exe**) está sendo executado no host do nó de gerenciamento, insira o comando `SHOW`, que deve produzir uma saída semelhante àquela mostrada aqui:

   ```sql
   ndb_mgm> SHOW
   Connected to Management Server at: localhost:1186
   Cluster Configuration
   ---------------------
   [ndbd(NDB)]     2 node(s)
   id=2    @198.51.100.30  (Version: 5.7.44-ndb-7.6.36, Nodegroup: 0, *)
   id=3    @198.51.100.40  (Version: 5.7.44-ndb-7.6.36, Nodegroup: 0)

   [ndb_mgmd(MGM)] 1 node(s)
   id=1    @198.51.100.10  (Version: 5.7.44-ndb-7.6.36)

   [mysqld(API)]   1 node(s)
   id=4    @198.51.100.20  (Version: 5.7.44-ndb-7.6.36)
   ```

Você também pode verificar se o nó SQL está conectado ao NDB Cluster no cliente **mysql** (**mysql.exe**) usando a declaração `SHOW ENGINE NDB STATUS`.

Agora, você deve estar pronto para trabalhar com objetos e dados de banco de dados usando o mecanismo de armazenamento `NDBCLUSTER` do NDB Cluster. Consulte a Seção 21.3.5, “Exemplo de NDB Cluster com Tabelas e Dados”, para obter mais informações e exemplos.

Você também pode instalar **ndb\_mgmd.exe**, **ndbd.exe** e **ndbmtd.exe** como serviços do Windows. Para obter informações sobre como fazer isso, consulte a Seção 21.3.2.4, “Instalando processos do NDB Cluster como serviços do Windows”).

#### 21.3.2.4 Instalar processos do NDB Cluster como serviços do Windows

Assim que você estiver satisfeito com o funcionamento do NDB Cluster conforme o desejado, você pode instalar os nós de gerenciamento e os nós de dados como serviços do Windows, para que esses processos sejam iniciados e interrompidos automaticamente sempre que o Windows for iniciado ou interrompido. Isso também permite controlar esses processos a partir da linha de comando com os comandos apropriados **SC START** e **SC STOP**, ou usando o utilitário gráfico **Serviços** do Windows. Os comandos **NET START** e **NET STOP** também podem ser usados.

A instalação de programas como serviços do Windows geralmente deve ser feita usando uma conta que tenha direitos de administrador no sistema.

Para instalar o nó de gerenciamento como um serviço no Windows, execute o **ndb\_mgmd.exe** a partir da linha de comando na máquina que hospeda o nó de gerenciamento, usando a opção `--install`, conforme mostrado aqui:

```sql
C:\> C:\mysql\bin\ndb_mgmd.exe --install
Installing service 'NDB Cluster Management Server'
  as '"C:\mysql\bin\ndbd.exe" "--service=ndb_mgmd"'
Service successfully installed.
```

Importante

Ao instalar um programa do NDB Cluster como um serviço do Windows, você deve sempre especificar o caminho completo; caso contrário, a instalação do serviço pode falhar com o erro O sistema não pode encontrar o arquivo especificado.

A opção `--install` deve ser usada primeiro, antes de qualquer outra opção que possa ser especificada para **ndb\_mgmd.exe**. No entanto, é preferível especificar essas opções em um arquivo de opções em vez disso. Se seu arquivo de opções não estiver em um dos locais padrão, conforme mostrado na saída de **ndb\_mgmd.exe** `--help`, você pode especificar a localização usando a opção `--config-file`.

Agora você deve ser capaz de iniciar e parar o servidor de gerenciamento da seguinte forma:

```sql
C:\> SC START ndb_mgmd

C:\> SC STOP ndb_mgmd
```

Nota

Se você estiver usando comandos **NET**, também pode iniciar ou parar o servidor de gerenciamento como um serviço do Windows usando o nome descritivo, conforme mostrado aqui:

```sql
C:\> NET START 'NDB Cluster Management Server'
The NDB Cluster Management Server service is starting.
The NDB Cluster Management Server service was started successfully.

C:\> NET STOP  'NDB Cluster Management Server'
The NDB Cluster Management Server service is stopping..
The NDB Cluster Management Server service was stopped successfully.
```

Geralmente, é mais simples especificar um nome de serviço curto ou permitir que o nome de serviço padrão seja usado ao instalar o serviço, e então fazer referência a esse nome ao iniciar ou parar o serviço. Para especificar um nome de serviço diferente de `ndb_mgmd`, adicione-o à opção `--install`, como mostrado neste exemplo:

```sql
C:\> C:\mysql\bin\ndb_mgmd.exe --install=mgmd1
Installing service 'NDB Cluster Management Server'
  as '"C:\mysql\bin\ndb_mgmd.exe" "--service=mgmd1"'
Service successfully installed.
```

Agora você deve ser capaz de iniciar ou parar o serviço usando o nome que você especificou, assim:

```sql
C:\> SC START mgmd1

C:\> SC STOP mgmd1
```

Para remover o serviço do nó de gerenciamento, use **SC DELETE *`service_name`***:

```sql
C:\> SC DELETE mgmd1
```

Alternativamente, invoque o **ndb\_mgmd.exe** com a opção `--remove`, conforme mostrado aqui:

```sql
C:\> C:\mysql\bin\ndb_mgmd.exe --remove
Removing service 'NDB Cluster Management Server'
Service successfully removed.
```

Se você instalou o serviço usando um nome de serviço diferente do padrão, passe o nome do serviço como o valor da opção **ndb\_mgmd.exe** `--remove` assim:

```sql
C:\> C:\mysql\bin\ndb_mgmd.exe --remove=mgmd1
Removing service 'mgmd1'
Service successfully removed.
```

A instalação de um processo de nó de dados de NDB Cluster como um serviço do Windows pode ser feita de maneira semelhante, usando a opção `--install` para **ndbd.exe** (ou **ndbmtd.exe**)), conforme mostrado aqui:

```sql
C:\> C:\mysql\bin\ndbd.exe --install
Installing service 'NDB Cluster Data Node Daemon' as '"C:\mysql\bin\ndbd.exe" "--service=ndbd"'
Service successfully installed.
```

Agora você pode iniciar ou parar o nó de dados conforme mostrado no exemplo a seguir:

```sql
C:\> SC START ndbd

C:\> SC STOP ndbd
```

Para remover o serviço de nó de dados, use **SC DELETE *`service_name`***:

```sql
C:\> SC DELETE ndbd
```

Alternativamente, invoque o **ndbd.exe** com a opção `--remove`, conforme mostrado aqui:

```sql
C:\> C:\mysql\bin\ndbd.exe --remove
Removing service 'NDB Cluster Data Node Daemon'
Service successfully removed.
```

Assim como o **ndb\_mgmd.exe** (e o **mysqld.exe**), ao instalar o **ndbd.exe** como um serviço do Windows, você também pode especificar um nome para o serviço como o valor de `--install`, e depois usá-lo ao iniciar ou parar o serviço, assim:

```sql
C:\> C:\mysql\bin\ndbd.exe --install=dnode1
Installing service 'dnode1' as '"C:\mysql\bin\ndbd.exe" "--service=dnode1"'
Service successfully installed.

C:\> SC START dnode1

C:\> SC STOP dnode1
```

Se você especificou um nome de serviço ao instalar o serviço de nó de dados, você pode usar esse nome ao removê-lo também, como mostrado aqui:

```sql
C:\> SC DELETE dnode1
```

Como alternativa, você pode passar o nome do serviço como o valor da opção `ndbd.exe` `--remove`, conforme mostrado aqui:

```sql
C:\> C:\mysql\bin\ndbd.exe --remove=dnode1
Removing service 'dnode1'
Service successfully removed.
```

A instalação do nó SQL como um serviço do Windows, o início do serviço, a parada do serviço e a remoção do serviço são feitos de maneira semelhante, usando `mysqld` `--install`, **SC START**, **SC STOP** e **SC DELETE** (ou `mysqld` `--remove`). Os comandos **NET** também podem ser usados para iniciar ou parar um serviço. Para informações adicionais, consulte a Seção 2.3.4.8, “Iniciando o MySQL como um serviço do Windows”.

### 21.3.3 Configuração Inicial do NDB Cluster

Nesta seção, discutimos a configuração manual de um NDB Cluster instalado, criando e editando arquivos de configuração.

Para o nosso NDB Cluster de quatro nós e quatro hosts (veja Nodos do cluster e computadores de host), é necessário escrever quatro arquivos de configuração, um por cada host do nó.

* Cada nó de dados ou nó SQL requer um arquivo `my.cnf` que fornece duas informações: uma string de conexão que indica ao nó onde encontrar o nó de gerenciamento e uma linha que informa ao servidor MySQL neste host (a máquina que hospeda o nó de dados) para habilitar o mecanismo de armazenamento `NDBCLUSTER`.

Para mais informações sobre as cadeias de conexão, consulte a Seção 21.4.3.3, “Cadeias de conexão do NDB Cluster”.

* O nó de gerenciamento precisa de um arquivo `config.ini` que indique quantas réplicas de fragmento devem ser mantidas, quanto memória deve ser alocada para dados e índices em cada nó de dados, onde encontrar os nós de dados, onde salvar dados em disco em cada nó de dados e onde encontrar quaisquer nós SQL.

**Configurando os nós de dados e os nós SQL.** O arquivo `my.cnf` necessário para os nós de dados é bastante simples. O arquivo de configuração deve estar localizado no diretório `/etc` e pode ser editado usando qualquer editor de texto. (Crie o arquivo se ele não existir.) Por exemplo:

```sql
$> vi /etc/my.cnf
```

Nota

Mostramos que **vi** está sendo usado aqui para criar o arquivo, mas qualquer editor de texto deve funcionar da mesma forma.

Para cada nó de dados e nó SQL na nossa configuração de exemplo, `my.cnf` deve parecer assim:

```sql
[mysqld]
# Options for mysqld process:
ndbcluster                      # run NDB storage engine

[mysql_cluster]
# Options for NDB Cluster processes:
ndb-connectstring=198.51.100.10  # location of management server
```

Após inserir as informações anteriores, salve esse arquivo e saia do editor de texto. Faça isso para as máquinas que hospedam o nó de dados "A", o nó de dados "B" e o nó SQL.

Importante

Uma vez que você tenha iniciado um processo `mysqld` com os parâmetros `ndbcluster` e `ndb-connectstring` nas seções `[mysqld]` e `[mysql_cluster]` do arquivo `my.cnf` conforme mostrado anteriormente, você não pode executar quaisquer instruções `CREATE TABLE` ou `ALTER TABLE` sem ter iniciado o clúster. Caso contrário, essas instruções falharão com um erro. Isso é por design.

**Configurando o nó de gerenciamento.** O primeiro passo para configurar o nó de gerenciamento é criar o diretório em que o arquivo de configuração pode ser encontrado e, em seguida, criar o próprio arquivo. Por exemplo (executando como `root`):

```sql
$> mkdir /var/lib/mysql-cluster
$> cd /var/lib/mysql-cluster
$> vi config.ini
```

Para a configuração representativa, o arquivo `config.ini` deve ser lido da seguinte forma:

```sql
[ndbd default]
# Options affecting ndbd processes on all data nodes:
NoOfReplicas=2    # Number of fragment replicas
DataMemory=80M    # How much memory to allocate for data storage
IndexMemory=18M   # How much memory to allocate for index storage
                  # For DataMemory and IndexMemory, we have used the
                  # default values. Since the "world" database takes up
                  # only about 500KB, this should be more than enough for
                  # this example NDB Cluster setup.
                  # NOTE: IndexMemory is deprecated in NDB 7.6 and later; in
                  # these versions, resources for all data and indexes are
                  # allocated by DataMemory and any that are set for IndexMemory
                  # are added to the DataMemory resource pool

[ndb_mgmd]
# Management process options:
HostName=198.51.100.10          # Hostname or IP address of management node
DataDir=/var/lib/mysql-cluster  # Directory for management node log files

[ndbd]
# Options for data node "A":
                                # (one [ndbd] section per data node)
HostName=198.51.100.30          # Hostname or IP address
NodeId=2                        # Node ID for this data node
DataDir=/usr/local/mysql/data   # Directory for this data node's data files

[ndbd]
# Options for data node "B":
HostName=198.51.100.40          # Hostname or IP address
NodeId=3                        # Node ID for this data node
DataDir=/usr/local/mysql/data   # Directory for this data node's data files

[mysqld]
# SQL node options:
HostName=198.51.100.20          # Hostname or IP address
                                # (additional mysqld connections can be
                                # specified for this node for various
                                # purposes such as running ndb_restore)
```

Nota

O banco de dados `world` pode ser baixado em https://dev.mysql.com/doc/index-other.html.

Depois que todos os arquivos de configuração foram criados e essas opções mínimas foram especificadas, você está pronto para prosseguir com o início do clúster e verificar se todos os processos estão em execução. Discutimos como isso é feito na Seção 21.3.4, “Início Inicial do Clúster NDB”.

Para informações mais detalhadas sobre os parâmetros de configuração do NDB Cluster disponíveis e seus usos, consulte a Seção 21.4.3, “Arquivos de Configuração do NDB Cluster”, e a Seção 21.4, “Configuração do NDB Cluster”. Para a configuração do NDB Cluster em relação à realização de backups, consulte a Seção 21.6.8.3, “Configuração para backups do NDB Cluster”.

O porto padrão para os nós de gerenciamento do Cluster é 1186. Para os nós de dados, o cluster pode alocar automaticamente os portos dos que já estão livres.

### 21.3.4 Inicialização inicial do NDB Cluster

Iniciar o clúster não é muito difícil depois que ele foi configurado. Cada processo do nó do clúster deve ser iniciado separadamente, e no host onde ele reside. O nó de gerenciamento deve ser iniciado primeiro, seguido pelos nós de dados e, então, finalmente, pelos nós SQL:

1. No host de gerenciamento, execute o seguinte comando na linha de comandos do sistema para iniciar o processo do nó de gerenciamento:

   ```sql
   $> ndb_mgmd --initial -f /var/lib/mysql-cluster/config.ini
   ```

A primeira vez que ele é iniciado, o **ndb\_mgmd** deve ser informado sobre o local onde está localizado seu arquivo de configuração, usando a opção `-f` ou `--config-file`. Esta opção exige que `--initial` ou `--reload` também seja especificado; veja a Seção 21.5.4, “ndb\_mgmd — O Daemon do Gerenciador de NDB Cluster”, para detalhes.

2. Em cada um dos hosts dos nós de dados, execute este comando para iniciar o processo **ndbd**:

   ```sql
   $> ndbd
   ```

3. Se você usou arquivos RPM para instalar o MySQL no host do clúster onde o nó SQL deve residir, você pode (e deve) usar o script de inicialização fornecido para iniciar o processo do servidor MySQL no nó SQL.

Se tudo tiver saído bem e o clúster tiver sido configurado corretamente, o clúster já deve estar operacional. Você pode testar isso invocando o cliente do nó de gerenciamento **ndb\_mgm**. A saída deve parecer a mesma mostrada aqui, embora você possa ver algumas pequenas diferenças na saída, dependendo da versão exata do MySQL que você está usando:

```sql
$> ndb_mgm
-- NDB Cluster -- Management Client --
ndb_mgm> SHOW
Connected to Management Server at: localhost:1186
Cluster Configuration
---------------------
[ndbd(NDB)]     2 node(s)
id=2    @198.51.100.30  (Version: 5.7.44-ndb-7.6.36, Nodegroup: 0, *)
id=3    @198.51.100.40  (Version: 5.7.44-ndb-7.6.36, Nodegroup: 0)

[ndb_mgmd(MGM)] 1 node(s)
id=1    @198.51.100.10  (Version: 5.7.44-ndb-7.6.36)

[mysqld(API)]   1 node(s)
id=4    @198.51.100.20  (Version: 5.7.44-ndb-7.6.36)
```

O nó SQL é referido aqui como `[mysqld(API)]`, o que reflete o fato de que o processo `mysqld` está atuando como um nó da API do NDB Cluster.

Nota

O endereço IP mostrado para um dado nó do NDB Cluster SQL ou outro nó da API no resultado de `SHOW` é o endereço usado pelo nó SQL ou da API para se conectar aos nós de dados do cluster, e não a nenhum nó de gerenciamento.

Agora, você deve estar pronto para trabalhar com bancos de dados, tabelas e dados no NDB Cluster. Consulte a Seção 21.3.5, “Exemplo de NDB Cluster com Tabelas e Dados”, para uma breve discussão.

### 21.3.5 Exemplo de aglomerado NDB com tabelas e dados

Nota

As informações desta seção se aplicam ao NDB Cluster que está sendo executado em plataformas Unix e Windows.

Trabalhar com tabelas de banco de dados e dados no NDB Cluster não difere muito de fazer isso no MySQL padrão. Há dois pontos-chave a serem lembrados:

* Para que uma tabela seja replicada no clúster, ela deve usar o mecanismo de armazenamento `NDBCLUSTER`. Para especificar isso, use a opção `ENGINE=NDBCLUSTER` ou `ENGINE=NDB` ao criar a tabela:

  ```sql
  CREATE TABLE tbl_name (col_name column_definitions) ENGINE=NDBCLUSTER;
  ```

Como alternativa, para uma tabela existente que utiliza um motor de armazenamento diferente, use `ALTER TABLE` para alterar a tabela para utilizar `NDBCLUSTER`:

  ```sql
  ALTER TABLE tbl_name ENGINE=NDBCLUSTER;
  ```

* Cada tabela `NDBCLUSTER` tem uma chave primária. Se nenhuma chave primária for definida pelo usuário quando uma tabela é criada, o mecanismo de armazenamento `NDBCLUSTER` gera automaticamente uma chave oculta. Uma chave desse tipo ocupa espaço assim como qualquer outro índice de tabela. (Não é incomum encontrar problemas devido à memória insuficiente para acomodar esses índices criados automaticamente.)

Se você está importando tabelas de um banco de dados existente usando a saída do **mysqldump**, pode abrir o script SQL em um editor de texto e adicionar a opção `ENGINE` a quaisquer declarações de criação de tabelas, ou substituir quaisquer opções existentes `ENGINE`. Suponha que você tenha o banco de dados de amostra `world` em outro servidor MySQL que não suporte NDB Cluster e queira exportar a tabela `City`:

```sql
$> mysqldump --add-drop-table world City > city_table.sql
```

O arquivo resultante `city_table.sql` contém essa declaração de criação de tabela (e as declarações `INSERT` necessárias para importar os dados da tabela):

```sql
DROP TABLE IF EXISTS `City`;
CREATE TABLE `City` (
  `ID` int(11) NOT NULL auto_increment,
  `Name` char(35) NOT NULL default '',
  `CountryCode` char(3) NOT NULL default '',
  `District` char(20) NOT NULL default '',
  `Population` int(11) NOT NULL default '0',
  PRIMARY KEY  (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

INSERT INTO `City` VALUES (1,'Kabul','AFG','Kabol',1780000);
INSERT INTO `City` VALUES (2,'Qandahar','AFG','Qandahar',237500);
INSERT INTO `City` VALUES (3,'Herat','AFG','Herat',186800);
(remaining INSERT statements omitted)
```

Você precisa garantir que o MySQL use o mecanismo de armazenamento `NDBCLUSTER` para esta tabela. Existem duas maneiras de realizar isso. Uma delas é modificar a definição da tabela *antes* de importá-la no banco de dados do Cluster. Usando a tabela `City` como exemplo, modifique a opção `ENGINE` da definição da seguinte forma:

```sql
DROP TABLE IF EXISTS `City`;
CREATE TABLE `City` (
  `ID` int(11) NOT NULL auto_increment,
  `Name` char(35) NOT NULL default '',
  `CountryCode` char(3) NOT NULL default '',
  `District` char(20) NOT NULL default '',
  `Population` int(11) NOT NULL default '0',
  PRIMARY KEY  (`ID`)
) ENGINE=NDBCLUSTER DEFAULT CHARSET=latin1;

INSERT INTO `City` VALUES (1,'Kabul','AFG','Kabol',1780000);
INSERT INTO `City` VALUES (2,'Qandahar','AFG','Qandahar',237500);
INSERT INTO `City` VALUES (3,'Herat','AFG','Herat',186800);
(remaining INSERT statements omitted)
```

Isso deve ser feito para a definição de cada tabela que deve fazer parte do banco de dados agrupado. A maneira mais fácil de realizar isso é fazer uma busca e substituição no arquivo que contém as definições e substituir todas as instâncias de `TYPE=engine_name` ou `ENGINE=engine_name` por `ENGINE=NDBCLUSTER`. Se você não quiser modificar o arquivo, pode usar o arquivo não modificado para criar as tabelas e, em seguida, usar `ALTER TABLE` para alterar seu mecanismo de armazenamento. Os detalhes são fornecidos mais adiante nesta seção.

Supondo que você já tenha criado um banco de dados chamado `world` no nó SQL do clúster, você pode, então, usar o cliente de linha de comando **mysql** para ler `city_table.sql`, e criar e preencher a tabela correspondente da maneira usual:

```sql
$> mysql world < city_table.sql
```

É muito importante ter em mente que o comando anterior deve ser executado no host onde o nó SQL está em execução (neste caso, na máquina com o endereço IP `198.51.100.20`).

Para criar uma cópia de todo o banco de dados `world` no nó SQL, use o **mysqldump** no servidor não em cluster para exportar o banco de dados para um arquivo chamado `world.sql` (por exemplo, no diretório `/tmp`). Em seguida, modifique as definições das tabelas conforme descrito e importe o arquivo no nó SQL do clúster da seguinte forma:

```sql
$> mysql world < /tmp/world.sql
```

Se você salvar o arquivo em um local diferente, ajuste as instruções anteriores conforme necessário.

Executar consultas `SELECT` no nó SQL não é diferente de executá-las em qualquer outra instância de um servidor MySQL. Para executar consultas a partir da linha de comando, você primeiro precisa fazer login no Monitor MySQL da maneira usual (especifique a senha `root` no prompt `Enter password:`):

```sql
$> mysql -u root -p
Enter password:
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 1 to server version: 5.7.44-ndb-7.6.36

Type 'help;' or '\h' for help. Type '\c' to clear the buffer.

mysql>
```

Basta usar a conta `root` do servidor MySQL e assumir que você seguiu as precauções de segurança padrão para a instalação de um servidor MySQL, incluindo a definição de uma senha forte `root`. Para mais informações, consulte a Seção 2.9.4, “Segurando a Conta Inicial do MySQL”.

Vale a pena considerar que os nós do Cluster *não* utilizam o sistema de privilégios do MySQL ao acessá-los. Definir ou alterar contas de usuário do MySQL (incluindo a conta `root`) afeta apenas as aplicações que acessam o nó SQL, não a interação entre nós. Consulte a Seção 21.6.18.2, “NDB Cluster e Privilégios MySQL”, para obter mais informações.

Se você não modificou as cláusulas `ENGINE` nas definições da tabela antes de importar o script SQL, você deve executar as seguintes instruções neste ponto:

```sql
mysql> USE world;
mysql> ALTER TABLE City ENGINE=NDBCLUSTER;
mysql> ALTER TABLE Country ENGINE=NDBCLUSTER;
mysql> ALTER TABLE CountryLanguage ENGINE=NDBCLUSTER;
```

Selecionar um banco de dados e executar uma consulta **SELECT** contra uma tabela nesse banco de dados também é feito da maneira usual, assim como sair do Monitor MySQL:

```sql
mysql> USE world;
mysql> SELECT Name, Population FROM City ORDER BY Population DESC LIMIT 5;
+-----------+------------+
| Name      | Population |
+-----------+------------+
| Bombay    |   10500000 |
| Seoul     |    9981619 |
| São Paulo |    9968485 |
| Shanghai  |    9696300 |
| Jakarta   |    9604900 |
+-----------+------------+
5 rows in set (0.34 sec)

mysql> \q
Bye

$>
```

Aplicações que utilizam MySQL podem empregar APIs padrão para acessar as tabelas `NDB`. É importante lembrar que sua aplicação deve acessar o nó SQL, e não os nós de gerenciamento ou dados. Este breve exemplo mostra como podemos executar a declaração `SELECT` mostrada anteriormente, usando a extensão `mysqli` do PHP 5.X rodando em um servidor Web em outro lugar na rede:

```sql
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
  "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
  <meta http-equiv="Content-Type"
           content="text/html; charset=iso-8859-1">
  <title>SIMPLE mysqli SELECT</title>
</head>
<body>
<?php
  # connect to SQL node:
  $link = new mysqli('198.51.100.20', 'root', 'root_password', 'world');
  # parameters for mysqli constructor are:
  #   host, user, password, database

  if( mysqli_connect_errno() )
    die("Connect failed: " . mysqli_connect_error());

  $query = "SELECT Name, Population
            FROM City
            ORDER BY Population DESC
            LIMIT 5";

  # if no errors...
  if( $result = $link->query($query) )
  {
?>
<table border="1" width="40%" cellpadding="4" cellspacing ="1">
  <tbody>
  <tr>
    <th width="10%">City</th>
    <th>Population</th>
  </tr>
<?
    # then display the results...
    while($row = $result->fetch_object())
      printf("<tr>\n  <td align=\"center\">%s</td><td>%d</td>\n</tr>\n",
              $row->Name, $row->Population);
?>
  </tbody
</table>
<?
  # ...and verify the number of rows that were retrieved
    printf("Affected rows: %d\n", $link->affected_rows);
  }
  else
    # otherwise, tell us what went wrong
    echo mysqli_error();

  # free the result set and the mysqli connection object
  $result->close();
  $link->close();
?>
</body>
</html>
```

Suponhamos que o processo em execução no servidor Web possa alcançar o endereço IP do nó SQL.

Da mesma forma, você pode usar a API C MySQL, Perl-DBI, Python-mysql ou Conectadores MySQL para realizar as tarefas de definição e manipulação de dados, exatamente como faria normalmente com o MySQL.

### 21.3.6 Reinício e desligamento seguro do NDB Cluster

Para desligar o clúster, digite o seguinte comando em uma linha de comando na máquina que hospeda o nó de gerenciamento:

```sql
$> ndb_mgm -e shutdown
```

A opção `-e` aqui é usada para passar um comando ao cliente **ndb\_mgm** a partir do shell. O comando faz com que os processos **ndb\_mgm**, **ndb\_mgmd** e quaisquer **ndbd** ou **ndbmtd**) sejam encerrados de forma graciosa. Qualquer nó SQL pode ser encerrado usando **mysqladmin shutdown** e outros meios. Em plataformas Windows, assumindo que você instalou o nó SQL como um serviço do Windows, você pode usar **SC STOP *`service_name`*** ou **NET STOP *`service_name`***.

Para reiniciar o clúster em plataformas Unix, execute os seguintes comandos:

* No host de gerenciamento (`198.51.100.10` em nossa configuração de exemplo):

  ```sql
  $> ndb_mgmd -f /var/lib/mysql-cluster/config.ini
  ```

* Em cada um dos hosts dos nós de dados (`198.51.100.30` e `198.51.100.40`):

  ```sql
  $> ndbd
  ```

* Use o cliente **ndb\_mgm** para verificar se ambos os nós de dados iniciaram com sucesso.

* No host SQL (`198.51.100.20`):

  ```sql
  $> mysqld_safe &
  ```

Em plataformas Windows, assumindo que você instalou todos os processos do NDB Cluster como serviços do Windows usando os nomes de serviço padrão (consulte a Seção 21.3.2.4, “Instalando processos do NDB Cluster como serviços do Windows”), você pode reiniciar o cluster da seguinte forma:

* No host de gerenciamento (`198.51.100.10` em nossa configuração de exemplo), execute o seguinte comando:

  ```sql
  C:\> SC START ndb_mgmd
  ```

* Em cada um dos hosts dos nós de dados (`198.51.100.30` e `198.51.100.40`), execute o seguinte comando:

  ```sql
  C:\> SC START ndbd
  ```

* No nó de gerenciamento, use o cliente **ndb\_mgm** para verificar se o nó de gerenciamento e ambos os nós de dados iniciaram com sucesso (consulte a Seção 21.3.2.3, “Início inicial do NDB Cluster no Windows”).

* No servidor do nó SQL (`198.51.100.20`), execute o seguinte comando:

  ```sql
  C:\> SC START mysql
  ```

Em um ambiente de produção, geralmente não é desejável desligar o clúster completamente. Em muitos casos, mesmo ao fazer alterações na configuração ou ao realizar atualizações no hardware ou software do clúster (ou em ambos), que exigem o desligamento de máquinas individuais, é possível fazê-lo sem desligar o clúster como um todo, realizando um reinício contínuo do clúster. Para obter mais informações sobre como fazer isso, consulte a Seção 21.6.5, “Realizando um Reinício Contínuo de um Clúster NDB”.

### 21.3.7 Atualização e Downgrading do NDB Cluster

As seções a seguir fornecem informações sobre a atualização e a desatualização do NDB Cluster 7.5 e 7.6.

As operações de esquema, incluindo declarações de DDL SQL, não podem ser realizadas enquanto quaisquer nós de dados estiverem sendo reiniciados, e, portanto, durante uma atualização ou redução online do clúster. Para obter outras informações sobre o procedimento de reinício contínuo usado para realizar uma atualização online, consulte a Seção 21.6.5, “Realizando um Reinício Contínuo de um Clúster NDB”.

Importante

A compatibilidade entre as versões de lançamento é considerada apenas em relação ao `NDBCLUSTER` nesta seção, e há questões adicionais a serem consideradas. Veja a Seção 2.10, “Atualização do MySQL”.

*Assim como em qualquer outro upgrade ou downgrade de software MySQL, é fortemente recomendado que você revise as partes relevantes do Manual MySQL para as versões do MySQL de onde e para onde você pretende migrar, antes de tentar um upgrade ou downgrade do software NDB Cluster*.

#### 21.3.7.1 Atualização e Downgrading do NDB 7.5

Esta seção fornece informações sobre a compatibilidade entre diferentes lançamentos do NDB Cluster 7.5 em relação à realização de atualizações e reduções, bem como matrizes de compatibilidade e notas. Informações adicionais também podem ser encontradas aqui sobre reduções do NDB 7.5 para séries anteriores de lançamento do NDB. Você já deve estar familiarizado com a instalação e configuração do NDB Cluster antes de tentar uma atualização ou redução. Veja a Seção 21.4, “Configuração do NDB Cluster”.

A tabela mostrada aqui fornece informações sobre a compatibilidade de atualização e desatualização do NDB Cluster entre diferentes versões do NDB 7.5. Notas adicionais sobre atualizações e desatualizações para, a partir de ou dentro da série de versões do NDB Cluster 7.5 podem ser encontradas seguindo a tabela.

**Figura 21.5 Compatibilidade de atualização e desatualização de cluster NDB, MySQL NDB Cluster 7.5**

![Graphical representation of the upgrade/downgrade matrix contained in the file storage/ndb/src/common/util/version.cpp from the NDB 7.5 source tree.](images/mysql-cluster-upgrade-downgrade-7-5.png)

**Suporte para versão.** As seguintes versões do NDB Cluster são suportadas para atualizações para versões GA do NDB Cluster 7.5 (7.5.4 e versões posteriores):

* Releases do NDB Cluster 7.4 GA (7.4.4 e versões posteriores)
* Releases do NDB Cluster 7.3 GA (7.3.2 e versões posteriores)

**Problemas Conhecidos ao Atualizar ou Desfazer o Downgrade do NDB Cluster 7.5.** Os seguintes problemas são conhecidos para ocorrer ao atualizar para ou entre as versões do NDB 7.5:

* Quando executado com `--initialize`, o servidor não requer suporte ao `NDB`; ter o `NDB` ativado neste momento pode causar problemas com as tabelas do `ndbinfo`. Para evitar isso, a opção `--initialize` agora faz com que o `mysqld` ignore a opção do `--ndbcluster` se esta última também for especificada.

Uma solução para uma atualização que falhou por esses motivos pode ser realizada da seguinte forma:

1. Realize um reinício contínuo de todo o clúster.  
2. Exclua todos os arquivos `.frm` no diretório `data/ndbinfo`.

3. Execute `mysqld_upgrade`.

(Bug #81689, Bug #82724, Bug #24521927, Bug #23518923)

* Durante uma atualização online de uma versão do NDB Cluster 7.3 para uma versão do NDB 7.4 (ou posterior), os falhos de vários nós de dados que executavam a versão mais baixa durante os pontos de verificação locais (LCPs) e logo antes da atualização desses nós levaram a falhas adicionais de nós após a atualização. Isso ocorreu devido a elementos persistentes do protocolo `EMPTY_LCP` iniciado pelos nós mais antigos como parte de uma sequência LCP-plus-restart, e que não é mais usado no NDB 7.4 e versões posteriores devido às otimizações LCP implementadas nessas versões. Esse problema foi corrigido no NDB 7.5.4. (Bug #23129433)

* No NDB 7.5 (e posteriormente), a tabela `ndb_binlog_index` utiliza o mecanismo de armazenamento `InnoDB`. O uso do mecanismo de armazenamento `MyISAM` para esta tabela continua a ser suportado para compatibilidade reversa.

Ao atualizar uma versão anterior para o NDB 7.5 (ou posterior), você pode usar as opções `--force` `--upgrade-system-tables` com `mysqld_upgrade` para que ele realize `ALTER TABLE ... ENGINE=INNODB` na tabela `ndb_binlog_index`.

Para mais informações, consulte a Seção 21.7.4, “Esquema e tabelas de replicação de cluster NDB”.

#### 21.3.7.2 Atualização e Downgrading do NDB 7.6

Esta seção fornece informações sobre a compatibilidade entre diferentes lançamentos do NDB Cluster 7.6 em relação à realização de atualizações e reduções, bem como matrizes de compatibilidade e notas. Informações adicionais também podem ser encontradas aqui sobre reduções do NDB 7.6 para séries anteriores de lançamentos do NDB. Você já deve estar familiarizado com a instalação e configuração do NDB Cluster antes de tentar uma atualização ou redução. Veja a Seção 21.4, “Configuração do NDB Cluster”.

A tabela mostrada aqui fornece informações sobre a compatibilidade de atualização e desatualização do NDB Cluster entre diferentes versões do NDB 7.6. Notas adicionais sobre atualizações e desatualizações para, a partir de ou dentro da série de versões do NDB Cluster 7.6 podem ser encontradas seguindo a tabela.

**Figura 21.6 Compatibilidade de atualização e desatualização do cluster NDB, MySQL NDB Cluster 7.6**

![Graphical representation of the upgrade/downgrade matrix contained in the file storage/ndb/src/common/util/version.cpp from the NDB 7.6 source tree.](images/mysql-cluster-upgrade-downgrade-7-6.png)

**Suporte para versão.** As seguintes versões do NDB Cluster são suportadas para atualizações para versões GA do NDB Cluster 7.6 (7.6.6 e versões posteriores):

* Releases do NDB Cluster 7.5 GA (7.5.4 e posteriores) * Releases do NDB Cluster 7.4 GA (7.4.4 e posteriores) * Releases do NDB Cluster 7.3 GA (7.3.2 e posteriores)

**Problemas Conhecidos ao Atualizar ou Desfazer o Downgrade do NDB Cluster 7.6.** Os seguintes problemas são conhecidos para ocorrer ao atualizar para, desfazer o downgrade do ou entre as versões do NDB 7.6:

**Alterações no formato do arquivo de dados do disco.** Devido às alterações no formato do disco, a atualização ou a redução de qualquer uma das versões listadas aqui requer um reinício inicial do nó de cada nó de dados:

* NDB 7.6.2
* NDB 7.6.4

Para evitar problemas relacionados ao antigo formato, você deve recriar quaisquer espaços de tabela existentes e desfazer grupos de arquivos de registro ao fazer a atualização. Você pode fazer isso realizando um reinício inicial de cada nó de dados (ou seja, usando a opção `--initial`) como parte do processo de atualização.

Se você estiver usando tabelas de Dados de disco, uma desativação de qualquer versão do NDB 7.6 para qualquer versão do NDB 7.5 ou anterior exige que você reinicie todos os nós de dados com `--initial` como parte do processo de desativação. Isso ocorre porque as séries de versões do NDB 7.5 e anteriores não são capazes de ler o novo formato de arquivo de Dados de disco.

**O IndexMemory muda.** Se você está fazendo uma atualização para uma versão mais antiga do NDB 7.6 para o NDB 7.5 (ou versões anteriores), você deve definir um valor explícito para `IndexMemory` no arquivo de configuração do clúster, se nenhum valor já estiver presente. Isso ocorre porque o NDB 7.6 não usa esse parâmetro e o define como 0 por padrão, enquanto é necessário no NDB 7.5 e versões anteriores, em que o clúster se recusa a iniciar com Configuração Inválida recebida do Servidor de Gerenciamento... se `IndexMemory` não estiver definido como um valor não nulo.

Importante

Para fazer a atualização para o NDB 7.6 a partir de uma versão anterior ou para fazer a desativação para uma versão anterior do NDB 7.6, é necessário purgar e, em seguida, recriar o sistema de arquivos do nó de dados `NDB`, o que significa que cada nó de dados deve ser reiniciado usando a opção `--initial` como parte do reinício contínuo ou do reinício do sistema normalmente necessário. (Iniciar um nó de dados sem sistema de arquivos já é equivalente a um reinício inicial; nesses casos, `--initial` é implícito e não é necessário. Isso não muda em relação às versões anteriores do NDB Cluster.)

Quando esse reinício é realizado como parte de uma atualização para o NDB 7.6, quaisquer arquivos LCP existentes são verificados quanto à presença do LCP `Sysfile`, indicando que o sistema de arquivos de nó de dados existente foi escrito usando o NDB 7.6. Se tal sistema de arquivos de nó existir, mas não contiver o `Sysfile`, e se quaisquer nós de dados forem reiniciados sem a opção `--initial`, o `NDB` faz com que o reinício falhe com uma mensagem de erro apropriada.

Você também deve estar ciente de que nenhuma proteção é possível ao fazer uma atualização para uma versão anterior à NDB 7.6 a partir da NDB 7.6.

### 21.3.8 O instalador automático do cluster NDB (NDB 7.5) (NÃO MAIS APOIADO)

Nota

Esse recurso foi removido do NDB Cluster e não é mais suportado. Consulte a Seção 21.2.4, “O que há de novo no MySQL NDB Cluster”, para obter mais informações.

O instalador gráfico baseado na web (Auto-Installer) foi removido no NDB 7.5.21 e não está mais incluído como parte da distribuição do NDB Cluster.

### 21.3.9 O Cluster Auto-Instalador do NDB (NÃO MAIS APOIADO)

Nota

Esse recurso foi removido do NDB Cluster e não é mais suportado. Consulte a Seção 21.2.4, “O que há de novo no MySQL NDB Cluster”, para obter mais informações.

O instalador gráfico baseado na web (Auto-Installer) foi removido no NDB 7.6.17 e não está mais incluído como parte da distribuição do NDB Cluster.