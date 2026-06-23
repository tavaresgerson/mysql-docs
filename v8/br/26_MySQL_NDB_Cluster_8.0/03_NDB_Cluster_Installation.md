## 25.3 Instalação do Cluster NDB

Esta seção descreve os conceitos básicos para planejar, instalar, configurar e executar um NDB Cluster. Embora os exemplos na Seção 25.4, “Configuração do NDB Cluster”, forneçam informações mais detalhadas sobre uma variedade de opções de agrupamento e configuração, o resultado de seguir as diretrizes e procedimentos descritos aqui deve ser um NDB Cluster utilizável que atenda aos requisitos *mínimos* para disponibilidade e proteção de dados.

Para obter informações sobre a atualização ou a desatualização de um NDB Cluster entre versões de lançamento, consulte a Seção 25.3.7, “Atualização e Desatualização do NDB Cluster”.

Esta seção abrange os requisitos de hardware e software; questões de rede; instalação do NDB Cluster; questões básicas de configuração; início, parada e reinício do cluster; carregamento de um banco de dados de amostra; e realização de consultas.

**Premissas.** As seções a seguir fazem várias premissas em relação à configuração física e de rede do cluster. Essas premissas são discutidas nos próximos parágrafos.

**Nodos do cluster e computadores anfitriões.** O cluster é composto por quatro nós, cada um em um computador anfitrião separado, e cada um com um endereço de rede fixo em uma rede Ethernet típica, conforme mostrado aqui:

**Tabela 25.5 Endereços de rede dos nós no cluster de exemplo**

<table><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Núcleo</th> <th>IP Address</th> </tr></thead><tbody><tr> <td>nó de gerenciamento (mgmd)</td> <td>198.51.100.10</td> </tr><tr> <td>nó SQL (mysqld)</td> <td>198.51.100.20</td> </tr><tr> <td>Núcleo de dados "A" (ndbd)</td> <td>198.51.100.30</td> </tr><tr> <td>Núcleo de dados "B" (ndbd)</td> <td>198.51.100.40</td> </tr></tbody></table>

Essa configuração também é mostrada no diagrama a seguir:

**Figura 25.4 Configuração de cluster NDBS com vários computadores**

![Most content is described in the surrounding text. The four nodes each connect to a central switch that connects to a network.](images/multi-comp-1.png)

**Endereçamento de rede.**

Por simplicidade (e confiabilidade), este *Como Fazer* usa apenas endereços IP numéricos. No entanto, se a resolução DNS estiver disponível na sua rede, é possível usar nomes de host em vez de endereços IP na configuração do Cluster. Alternativamente, você pode usar o arquivo `hosts` (tipicamente `/etc/hosts` para Linux e outros sistemas operacionais semelhantes ao Unix, `C:\WINDOWS\system32\drivers\etc\hosts` no Windows, ou o equivalente do seu sistema operacional) para fornecer um meio de fazer uma busca de host, se tal estiver disponível.

A partir da NDB 8.0.22, `NDB` suporta IPv6 para conexões entre todos os nós do NDB Cluster.

Um problema conhecido nas plataformas Linux ao executar o NDB 8.0.22 e versões posteriores era que o kernel do sistema operacional precisava fornecer suporte ao IPv6, mesmo quando não havia endereços IPv6 em uso. Esse problema é corrigido no NDB 8.0.34 e versões posteriores (Bug #33324817, Bug #33870642).

Se você está usando uma versão afetada e deseja desativar o suporte para IPv6 no sistema (porque não planeja usar nenhuma endereço IPv6 para os nós do NDB Cluster), faça isso após inicializar o sistema, da seguinte forma:

```
$> sysctl -w net.ipv6.conf.all.disable_ipv6=1
$> sysctl -w net.ipv6.conf.default.disable_ipv6=1
```

(Como alternativa, você pode adicionar as linhas correspondentes a `/etc/sysctl.conf`.). No NDB Cluster 8.0.34 e versões posteriores, o que precede não é necessário, e você pode simplesmente desabilitar o suporte ao IPv6 no kernel Linux se não desejar ou precisar disso.

Nos NDB 8.0.21 e versões anteriores, todos os endereços de rede utilizados para conexões a ou a partir de nós de dados e de gerenciamento devem usar ou ser resolvíveis usando IPv4, incluindo endereços utilizados por nós SQL para entrar em contato com os outros nós.

**Problemas com o arquivo de hosts.** Um problema comum ao tentar usar nomes de host para nós do Cluster ocorre devido à maneira como alguns sistemas operacionais (incluindo algumas distribuições Linux) configuram o próprio nome de host do sistema no `/etc/hosts` durante a instalação. Considere duas máquinas com os nomes de host `ndb1` e `ndb2`, ambas no domínio de rede `cluster`. O Red Hat Linux (incluindo algumas derivações como CentOS e Fedora) coloca as seguintes entradas nos arquivos `/etc/hosts` dessas máquinas:

```
#  ndb1 /etc/hosts:
127.0.0.1   ndb1.cluster ndb1 localhost.localdomain localhost
```

```
#  ndb2 /etc/hosts:
127.0.0.1   ndb2.cluster ndb2 localhost.localdomain localhost
```

O SUSE Linux (incluindo o OpenSUSE) coloca essas entradas nos arquivos `/etc/hosts` das máquinas:

```
#  ndb1 /etc/hosts:
127.0.0.1       localhost
127.0.0.2       ndb1.cluster ndb1
```

```
#  ndb2 /etc/hosts:
127.0.0.1       localhost
127.0.0.2       ndb2.cluster ndb2
```

Em ambos os casos, as rotas `ndb1` direcionam `ndb1.cluster` para um endereço de rede de loopback, mas obtêm um endereço IP público do DNS para `ndb2.cluster`, enquanto `ndb2` direciona `ndb2.cluster` para um endereço de loopback e obtém um endereço público para `ndb1.cluster`. O resultado é que cada nó de dados se conecta ao servidor de gerenciamento, mas não consegue saber quando outros nós de dados se conectaram, e assim os nós de dados parecem ficar suspensos ao iniciar.

Cuidado

Não é possível misturar `localhost` e outros nomes de host ou endereços IP em `config.ini`. Por essas razões, a solução nesses casos (exceto o uso de endereços IP para *todos* os registros de `config.ini` `HostName` é) remover os nomes de host totalmente qualificados de `/etc/hosts` e usá-los em `config.ini` para todos os hosts do clúster.

**Tipo de computador hospedeiro.** Cada computador hospedeiro em nosso cenário de instalação é um PC de mesa baseado em Intel que executa um sistema operacional compatível instalado em disco em uma configuração padrão, sem executar serviços desnecessários. O sistema operacional principal com capacidades padrão de rede TCP/IP deve ser suficiente. Além disso, por simplicidade, também assumimos que os sistemas de arquivos em todos os hosts estejam configurados de forma idêntica. Caso contrário, você deve adaptar essas instruções conforme necessário.

**Hardware de rede.** Cartões padrão de 100 Mbps ou 1 gigabit de Ethernet são instalados em cada máquina, juntamente com os drivers adequados para os cartões, e que todos os quatro hosts estejam conectados através de um dispositivo de rede Ethernet padrão, como um switch. (Todas as máquinas devem usar cartões de rede com o mesmo desempenho. Ou seja, todas as quatro máquinas no clúster devem ter cartões de 100 Mbps *ou* todas as quatro máquinas devem ter cartões de 1 Gbps.) O NDB Cluster funciona em uma rede de 100 Mbps; no entanto, o Ethernet de gigabit oferece melhor desempenho.

Importante

O NDB Cluster *não* é destinado para uso em uma rede para a qual o throughput seja inferior a 100 Mbps ou que apresente um alto grau de latência. Por essa razão (entre outras), tentar executar um NDB Cluster em uma rede de área ampla, como a Internet, provavelmente não será bem-sucedido e não é suportado em produção.

**Dados de amostra.** Usamos o banco de dados `world` que está disponível para download no site do MySQL (consulte https://dev.mysql.com/doc/index-other.html). Assumemos que cada máquina tenha memória suficiente para executar o sistema operacional, os processos necessários do NDB Cluster e (nos nós de dados) para armazenar o banco de dados.

Para informações gerais sobre a instalação do MySQL, consulte o Capítulo 2, *Instalando MySQL*. Para informações sobre a instalação do NDB Cluster no Linux e em outros sistemas operacionais do tipo Unix, consulte a Seção 25.3.1, “Instalação do NDB Cluster no Linux”. Para informações sobre a instalação do NDB Cluster em sistemas operacionais Windows, consulte a Seção 25.3.2, “Instalando NDB Cluster no Windows”.

Para informações gerais sobre os requisitos de hardware, software e redes do NDB Cluster, consulte a Seção 25.2.3, “Requisitos de hardware, software e redes do NDB Cluster”.

### 25.3.1 Instalação do NDB Cluster no Linux

Esta seção abrange os métodos de instalação do NDB Cluster no Linux e em outros sistemas operacionais semelhantes ao Unix. Embora as próximas seções se refiram a um sistema operacional Linux, as instruções e procedimentos fornecidos lá devem ser facilmente adaptáveis a outras plataformas Unix semelhantes suportadas. Para instruções de instalação e configuração manuais específicas para sistemas Windows, consulte a Seção 25.3.2, “Instalando o NDB Cluster no Windows”.

Cada computador hospedeiro do NDB Cluster deve ter os programas executáveis corretos instalados. Um hospedeiro que executa um nó SQL deve ter instalado nele um binário do servidor MySQL (**mysqld**). Os nós de gerenciamento requerem o daemon do servidor de gerenciamento (**ndb_mgmd**); os nós de dados requerem o daemon do nó de dados (**ndbd** ou **ndbmtd**). Não é necessário instalar o binário do servidor MySQL nos hosts dos nós de gerenciamento e dos nós de dados. É recomendável que você também instale o cliente de gerenciamento (**ndb_mgm**) no host do servidor de gerenciamento.

A instalação do NDB Cluster no Linux pode ser feita usando binários pré-compilados da Oracle (baixados como um arquivo .tar.gz), com pacotes RPM (também disponíveis na Oracle) ou a partir do código-fonte. Todos esses três métodos de instalação são descritos na seção a seguir.

Independentemente do método utilizado, ainda é necessário, após a instalação dos binários do NDB Cluster, criar arquivos de configuração para todos os nós do cluster, antes de poder iniciar o cluster. Veja a Seção 25.3.3, “Configuração Inicial do NDB Cluster”.

#### 25.3.1.1 Instalar uma versão binária do NDB Cluster no Linux

Esta seção abrange os passos necessários para instalar os executaveis corretos para cada tipo de nó do Cluster a partir de binários pré-compilados fornecidos pela Oracle.

Para configurar um clúster usando binários pré-compilados, o primeiro passo no processo de instalação de cada host do clúster é baixar o arquivo binário da página de downloads do [NDB Cluster][(https://dev.mysql.com/downloads/cluster/)]. (Para a versão mais recente do NDB 8.0 de 64 bits, isso é `mysql-cluster-gpl-8.0.43-linux-glibc2.12-x86_64.tar.gz`.). Assumemos que você colocou esse arquivo no diretório `/var/tmp` de cada máquina.

Se você precisar de um binário personalizado, consulte a Seção 2.8.5, “Instalando o MySQL usando um conjunto de fontes de desenvolvimento”.

Nota

Após completar a instalação, ainda não execute nenhum dos binários. Mostramos como fazer isso após a configuração dos nós (consulte a Seção 25.3.3, “Configuração Inicial do NDB Cluster”).

**Nodos SQL.** Em cada uma das máquinas designadas para hospedar os nós SQL, realize as etapas a seguir como usuário do sistema `root`:

1. Verifique seus arquivos `/etc/passwd` e `/etc/group` (ou use as ferramentas fornecidas pelo seu sistema operacional para gerenciar usuários e grupos) para verificar se já existe um grupo `mysql` e um usuário `mysql` no sistema. Algumas distribuições de SO criam esses grupos como parte do processo de instalação do sistema operacional. Se eles ainda não estiverem presentes, crie um novo grupo de usuário `mysql`, e depois adicione um usuário `mysql` a este grupo:

   ```
   $> groupadd mysql
   $> useradd -g mysql -s /bin/false mysql
   ```

A sintaxe para **useradd** e **groupadd** pode diferir ligeiramente em diferentes versões do Unix, ou eles podem ter nomes diferentes, como **adduser** e **addgroup**.

2. Mude o local para o diretório que contém o arquivo baixado, desempaquete o arquivo e crie um link simbólico chamado `mysql` para o diretório `mysql`.

Nota

Os nomes dos arquivos e diretórios reais variam de acordo com o número da versão do NDB Cluster.

   ```
   $> cd /var/tmp
   $> tar -C /usr/local -xzvf mysql-cluster-gpl-8.0.43-linux-glibc2.12-x86_64.tar.gz
   $> ln -s /usr/local/mysql-cluster-gpl-8.0.43-linux-glibc2.12-x86_64 /usr/local/mysql
   ```

3. Mude a localização para o diretório `mysql` e configure os bancos de dados do sistema usando **mysqld** `--initialize` conforme mostrado aqui:

   ```
   $> cd mysql
   $> mysqld --initialize
   ```

Isso gera uma senha aleatória para a conta MySQL `root`. Se você *não* quiser que a senha aleatória seja gerada, pode substituir a opção `--initialize-insecure` por `--initialize`. Em qualquer caso, você deve revisar a Seção 2.9.1, “Inicializando o Diretório de Dados”, para obter informações adicionais antes de realizar essa etapa. Veja também a Seção 6.4.2, “mysql_secure_installation — Melhorar a Segurança da Instalação do MySQL”.

4. Defina as permissões necessárias para o servidor MySQL e os diretórios de dados:

   ```
   $> chown -R root .
   $> chown -R mysql data
   $> chgrp -R mysql .
   ```

5. Copie o script de inicialização do MySQL para o diretório apropriado, torne-o executável e configure-o para iniciar quando o sistema operacional é inicializado:

   ```
   $> cp support-files/mysql.server /etc/rc.d/init.d/
   $> chmod +x /etc/rc.d/init.d/mysql.server
   $> chkconfig --add mysql.server
   ```

(O diretório de scripts de inicialização pode variar dependendo do seu sistema operacional e versão — por exemplo, em algumas distribuições Linux, é `/etc/init.d`.)

Aqui, usamos o **chkconfig** da Red Hat para criar links aos scripts de inicialização; use qualquer meio apropriado para esse propósito na sua plataforma, como **update-rc.d** no Debian.

Lembre-se de que os passos anteriores devem ser repetidos em cada máquina onde um nó SQL deve residir.

**Nodos de dados.** A instalação dos nós de dados do NDB Cluster não requer o binário **mysqld**. Apenas o executável do nó de dados do NDB Cluster **ndbd** (monotrilhado) ou **ndbmtd**") (multitrilhado) é necessário. Esses binários também podem ser encontrados no arquivo `.tar.gz`. Novamente, assumimos que você colocou esse arquivo em `/var/tmp`.

Como sistema `root` (ou seja, após usar **sudo**, **su root** ou o equivalente do seu sistema para assumir temporariamente os privilégios da conta de administrador do sistema), realize as etapas a seguir para instalar os binários do nó de dados nos hosts do nó de dados:

1. Mude a localização para o diretório `/var/tmp` e extraia os binários **ndbd** e **ndbmtd**") do arquivo para um diretório adequado, como `/usr/local/bin`:

   ```
   $> cd /var/tmp
   $> tar -zxvf mysql-cluster-gpl-8.0.43-linux-glibc2.12-x86_64.tar.gz
   $> cd mysql-cluster-gpl-8.0.43-linux-glibc2.12-x86_64
   $> cp bin/ndbd /usr/local/bin/ndbd
   $> cp bin/ndbmtd /usr/local/bin/ndbmtd
   ```

(Você pode, com segurança, excluir o diretório criado ao desempacotar o arquivo baixado e os arquivos que ele contém, a partir de `/var/tmp` assim que **ndb_mgm** e **ndb_mgmd** forem copiados para o diretório de executaveis.)

2. Mude o local para o diretório no qual você copiou os arquivos e, em seguida, torne ambos os arquivos executáveis:

   ```
   $> cd /usr/local/bin
   $> chmod +x ndb*
   ```

Os passos anteriores devem ser repetidos em cada servidor de nó de dados.

Embora apenas um dos executaveis do nó de dados seja necessário para executar um nó de dados do NDB Cluster, mostramos como instalar tanto o **ndbd** quanto o **ndbmtd**") nas instruções anteriores. Recomendamos que você faça isso ao instalar ou atualizar o NDB Cluster, mesmo que planeje usar apenas um deles, pois isso economiza tempo e problemas no caso de decidir mudar de um para o outro posteriormente.

Nota

O diretório de dados em cada máquina que hospeda um nó de dados é `/usr/local/mysql/data`. Essa informação é essencial ao configurar o nó de gerenciamento. (Veja a Seção 25.3.3, “Configuração Inicial do NDB Cluster”.)

**Nodos de gerenciamento.** A instalação do nó de gerenciamento não requer o binário **mysqld**. Apenas o servidor de gerenciamento do NDB Cluster (**ndb_mgmd**) é necessário; você provavelmente também deseja instalar o cliente de gerenciamento (**ndb_mgm**) também. Ambos esses binários também podem ser encontrados no arquivo `.tar.gz`. Novamente, assumimos que você colocou esse arquivo em `/var/tmp`.

Como sistema `root`, realize os seguintes passos para instalar **ndb_mgmd** e **ndb_mgm** no host do nó de gerenciamento:

1. Mude a localização para o diretório `/var/tmp` e extraia os arquivos **ndb_mgm** e **ndb_mgmd** do arquivo para um diretório adequado, como `/usr/local/bin`:

   ```
   $> cd /var/tmp
   $> tar -zxvf mysql-cluster-gpl-8.0.43-linux-glibc2.12-x86_64.tar.gz
   $> cd mysql-cluster-gpl-8.0.43-linux-glibc2.12-x86_64
   $> cp bin/ndb_mgm* /usr/local/bin
   ```

(Você pode, com segurança, excluir o diretório criado ao desempacotar o arquivo baixado e os arquivos que ele contém, a partir de `/var/tmp` assim que **ndb_mgm** e **ndb_mgmd** forem copiados para o diretório de executaveis.)

2. Mude o local para o diretório no qual você copiou os arquivos e, em seguida, torne ambos os arquivos executáveis:

   ```
   $> cd /usr/local/bin
   $> chmod +x ndb_mgm*
   ```

Na Seção 25.3.3, “Configuração inicial do NDB Cluster”, criamos arquivos de configuração para todos os nós do nosso exemplo de NDB Cluster.

#### 25.3.1.2 Instalar o NDB Cluster a partir do RPM

Esta seção abrange os passos necessários para instalar os executaveis corretos para cada tipo de nó do NDB Cluster 8.0, usando pacotes RPM fornecidos pela Oracle.

Como alternativa ao método descrito nesta seção, a Oracle oferece Repositórios MySQL para NDB Cluster que são compatíveis com muitas distribuições Linux comuns. Dois repositórios, listados aqui, estão disponíveis para distribuições baseadas em RPM:

* Para distribuições que utilizam **yum** ou **dnf**, você pode usar o Repositório Yum de MySQL para NDB Cluster. Consulte [*Instalando MySQL NDB Cluster usando o Repositório Yum*][(/doc/mysql-yum-repo-quick-guide/en/#repo-qg-yum-fresh-cluster-install)], para obter instruções e informações adicionais.

* Para SLES, você pode usar o Repositório MySQL SLES para NDB Cluster. Consulte [*Instalando MySQL NDB Cluster usando o Repositório SLES*] [*(/doc/mysql-sles-repo-quick-guide/en/#repo-qg-sles-fresh-cluster-install)], para obter instruções e informações adicionais.

Os RPMs estão disponíveis tanto para plataformas Linux de 32 bits quanto de 64 bits. Os nomes de arquivo desses RPMs utilizam o seguinte padrão:

```
mysql-cluster-community-data-node-8.0.43-1.el7.x86_64.rpm

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

**Tabela 25.6 Componentes da distribuição RPM do NDB Cluster**

<table><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Component</th> <th>Descrição</th> </tr></thead><tbody><tr> <td><code>auto-installer</code> (DEPRECATED)</td> <td>Programa de instalação automática do NDB Cluster; consulte a Seção 25.3.8, “O instalador automático do NDB Cluster (já não é suportado)”, para uso</td> </tr><tr> <td><code>client</code></td> <td>MySQL e<code>NDB</code>programas de cliente; inclui cliente mysql, cliente ndb_mgm e outras ferramentas de cliente</td> </tr><tr> <td><code>common</code></td> <td>Conjunto de caracteres e informações de mensagem de erro necessárias pelo servidor MySQL</td> </tr><tr> <td><code>data-node</code></td> <td>binários de nós de dados ndbd e ndbmtd</td> </tr><tr> <td><code>devel</code></td> <td>Cabeçalhos e arquivos de biblioteca necessários para o desenvolvimento do cliente MySQL</td> </tr><tr> <td><code>embedded</code></td> <td>Servidor MySQL embutido</td> </tr><tr> <td><code>embedded-compat</code></td> <td>Servidor MySQL embutido compatível com versões anteriores</td> </tr><tr> <td><code>embedded-devel</code></td> <td>Arquivos de cabeçalho e de biblioteca para o desenvolvimento de aplicações para MySQL embutido</td> </tr><tr> <td><code>java</code></td> <td>Arquivos JAR necessários para o suporte de aplicações ClusterJ</td> </tr><tr> <td><code>libs</code></td> <td>Bibliotecas de clientes MySQL</td> </tr><tr> <td><code>libs-compat</code></td> <td>Bibliotecas de clientes MySQL compatíveis com versões anteriores</td> </tr><tr> <td><code>management-server</code></td> <td>O servidor de gerenciamento do cluster NDB (ndb_mgmd)</td> </tr><tr> <td><code>memcached</code></td> <td>Arquivos necessários para suporte<code>ndbmemcache</code></td> </tr><tr> <td><code>minimal-debuginfo</code></td> <td>Informações de depuração para o pacote server-minimal; úteis ao desenvolver aplicativos que utilizam este pacote ou ao depurar este pacote</td> </tr><tr> <td><code>ndbclient</code></td> <td><code>NDB</code>biblioteca de clientes para executar aplicações da API NDB e da API MGM (<code>libndbclient</code>)</td> </tr><tr> <td><code>ndbclient-devel</code></td> <td>Cabeçalho e outros arquivos necessários para o desenvolvimento de aplicativos da API NDB e da API MGM</td> </tr><tr> <td><code>nodejs</code></td> <td>Arquivos necessários para configurar o suporte Node.JS para o NDB Cluster</td> </tr><tr> <td><code>server</code></td> <td>O servidor MySQL (mysqld) com<code>NDB</code>suporte para motor de armazenamento incluído e programas associados ao servidor MySQL</td> </tr><tr> <td><code>server-minimal</code></td> <td>Instalação mínima do servidor MySQL para NDB e ferramentas relacionadas</td> </tr><tr> <td><code>test</code></td> <td>mysqltest, outros programas de teste do MySQL e arquivos de suporte</td> </tr></tbody></table>

Também está disponível um único pacote (arquivo `.tar`) de todos os RPMs do NDB Cluster para uma determinada plataforma e arquitetura. O nome deste arquivo segue o padrão mostrado aqui:

```
mysql-cluster-license-ver-rev.distro.arch.rpm-bundle.tar
```

Você pode extrair os arquivos RPM individuais deste arquivo usando **tar** ou a ferramenta que você prefere para extrair arquivos.

Os componentes necessários para instalar os três principais tipos de nós do NDB Cluster estão listados na lista a seguir:

* Nó de gestão: `management-server`

* *Nodo de dados*: `data-node` * *Nodo SQL*: `server` e `common`

Além disso, o RPM `client` deve ser instalado para fornecer o cliente de gerenciamento **ndb_mgm** em pelo menos um nó de gerenciamento. Você também pode querer instalá-lo em nós SQL, para ter **mysql** e outros programas de cliente MySQL disponíveis nesses. Discutimos a instalação de nós por tipo mais tarde nesta seção.

*`ver`* representa o número de versão do motor de armazenamento de três partes `NDB` no formato *`x`.*, mostrado como `8.0.43` nos exemplos. `rev` fornece o número de revisão do RPM no formato *`major`.*`minor`.*, nos exemplos mostrados nesta seção, usamos `1.1` para este valor.

O *`distro` (distribuição Linux) é um dos `rhel5` (Oracle Linux 5, Red Hat Enterprise Linux 4 e 5), `el6` (Oracle Linux 6, Red Hat Enterprise Linux 6), `el7` (Oracle Linux 7, Red Hat Enterprise Linux 7) ou `sles12` (SUSE Enterprise Linux 12). Para os exemplos nesta seção, assumimos que o host executa Oracle Linux 7, Red Hat Enterprise Linux 7 ou o equivalente (`el7`).

*`arch`* é `i686` para RPMs de 32 bits e `x86_64` para versões de 64 bits. Nos exemplos mostrados aqui, assumimos uma plataforma de 64 bits.

O número da versão do NDB Cluster nos nomes dos arquivos RPM (mostrado aqui como `8.0.43`) pode variar de acordo com a versão que você está realmente usando. *É muito importante que todos os RPMs do Cluster a serem instalados tenham o mesmo número da versão*. A arquitetura também deve ser apropriada para a máquina na qual o RPM será instalado; em particular, você deve ter em mente que os RPMs de 64 bits (`x86_64`) não podem ser usados com sistemas operacionais de 32 bits (use `i686` para este último).

**Nodos de dados.** Em um computador que deve hospedar um nó de dados de NDB Cluster, é necessário instalar apenas o `data-node` RPM. Para fazer isso, copie este RPM para o host do nó de dados e execute o seguinte comando como usuário root do sistema, substituindo o nome mostrado para o RPM conforme necessário para corresponder ao do RPM baixado do site da MySQL:

```
$> rpm -Uhv mysql-cluster-community-data-node-8.0.43-1.el7.x86_64.rpm
```

Isso instala os binários do nó de dados **ndbd** e **ndbmtd** em `/usr/sbin`. Qualquer um desses pode ser usado para executar um processo de nó de dados neste host.

**Nodos SQL. Copie os RPMs `server` e `common` para cada máquina que será usada para hospedar um nó SQL de NDB Cluster (`server` requer `common`). Instale o RPM `server` executando o seguinte comando como usuário root do sistema, substituindo o nome mostrado para o RPM conforme necessário para corresponder ao nome do RPM baixado do site da MySQL:

```
$> rpm -Uhv mysql-cluster-community-server-8.0.43-1.el7.x86_64.rpm
```

Isso instala o binário do servidor MySQL (**mysqld**, com suporte ao mecanismo de armazenamento `NDB`) no diretório `/usr/sbin`. Também instala todos os arquivos de suporte necessários ao servidor MySQL e programas úteis do servidor MySQL, incluindo os scripts de inicialização **mysql.server** e **mysqld_safe** (em `/usr/share/mysql` e `/usr/bin`, respectivamente). O instalador RPM deve cuidar automaticamente de questões de configuração geral (como a criação do usuário e grupo `mysql`, se necessário).

Importante

Você deve usar as versões desses RPMs lançadas para o NDB Cluster; as versões lançadas para o servidor MySQL padrão não fornecem suporte para o mecanismo de armazenamento `NDB`.

Para administrar o nó SQL (servidor MySQL), você também deve instalar o `client` RPM, conforme mostrado aqui:

```
$> rpm -Uhv mysql-cluster-community-client-8.0.43-1.el7.x86_64.rpm
```

Isso instala o cliente **mysql** e outros programas do cliente MySQL, como **mysqladmin** e **mysqldump**, para `/usr/bin`.

**Nodos de gerenciamento.** Para instalar o servidor de gerenciamento do NDB Cluster, é necessário apenas usar o `management-server` RPM. Copie este RPM para o computador que será o anfitrião do nó de gerenciamento e, em seguida, instale-o executando o seguinte comando como usuário root do sistema (substitua o nome mostrado para o RPM conforme necessário para corresponder ao do `management-server` RPM baixado do site da MySQL):

```
$> rpm -Uhv mysql-cluster-community-management-server-8.0.43-1.el7.x86_64.rpm
```

Este RPM instala o binário do servidor de gerenciamento **ndb_mgmd** no diretório `/usr/sbin`. Embora este seja o único programa realmente necessário para executar um nó de gerenciamento, também é uma boa ideia ter o cliente de gerenciamento do NDB Cluster **ndb_mgm** disponível também. Você pode obter este programa, bem como outros programas de cliente `NDB` como **ndb_desc** e **ndb_config**, instalando o RPM `client` conforme descrito anteriormente.

Consulte a Seção 2.5.4, “Instalando MySQL no Linux usando pacotes RPM da Oracle”, para obter informações gerais sobre a instalação do MySQL usando RPMs fornecidos pela Oracle.

Após a instalação a partir do RPM, você ainda precisa configurar o clúster; consulte a Seção 25.3.3, “Configuração Inicial do Clúster NDB”, para obter as informações relevantes.

*É muito importante que todos os RPMs do cluster a serem instalados tenham o mesmo número de versão*. A designação *`architecture`* também deve ser apropriada para a máquina na qual o RPM será instalado; em particular, você deve ter em mente que os RPMs de 64 bits não podem ser usados com sistemas operacionais de 32 bits.

**Nodos de dados.** Em um computador que deve hospedar um nó de dados de cluster, é necessário instalar apenas o `server` RPM. Para fazer isso, copie este RPM para o host do nó de dados e execute o seguinte comando como usuário root do sistema, substituindo o nome mostrado para o RPM conforme necessário para corresponder ao do RPM baixado do site da MySQL:

```
$> rpm -Uhv MySQL-Cluster-server-gpl-8.0.43-1.sles11.i386.rpm
```

Embora isso instale todos os binários do NDB Cluster, apenas o programa **ndbd** ou **ndbmtd**") (ambos no `/usr/sbin`) é realmente necessário para executar um nó de dados do NDB Cluster.

**Nodos SQL.** Em cada máquina que será usada para hospedar um nó SQL de cluster, instale o `server` RPM executando o seguinte comando como usuário root do sistema, substituindo o nome mostrado para o RPM conforme necessário para corresponder ao nome do RPM baixado do site da MySQL:

```
$> rpm -Uhv MySQL-Cluster-server-gpl-8.0.43-1.sles11.i386.rpm
```

Isso instala o binário do servidor MySQL (**mysqld**) com suporte ao mecanismo de armazenamento `NDB` no diretório `/usr/sbin`, além de todos os arquivos de suporte necessários ao MySQL Server. Também instala os scripts de inicialização **mysql.server** e **mysqld_safe** (respectivamente em `/usr/share/mysql` e `/usr/bin`). O instalador RPM deve cuidar automaticamente de questões de configuração geral (como a criação do usuário e grupo `mysql`, se necessário).

Para administrar o nó SQL (servidor MySQL), você também deve instalar o `client` RPM, conforme mostrado aqui:

```
$> rpm -Uhv MySQL-Cluster-client-gpl-8.0.43-1.sles11.i386.rpm
```

Isso instala o programa cliente **mysql**.

**Nodos de gerenciamento.** Para instalar o servidor de gerenciamento do NDB Cluster, é necessário apenas usar o `server` RPM. Copie este RPM para o computador que será o anfitrião do nó de gerenciamento e, em seguida, instale-o executando o seguinte comando como usuário root do sistema (substitua o nome mostrado para o RPM conforme necessário para corresponder ao do `server` RPM baixado do site da MySQL):

```
$> rpm -Uhv MySQL-Cluster-server-gpl-8.0.43-1.sles11.i386.rpm
```

Embora este RPM instale muitos outros arquivos, apenas o binário do servidor de gerenciamento **ndb_mgmd** (no diretório `/usr/sbin`) é realmente necessário para executar um nó de gerenciamento. O RPM `server` também instala **ndb_mg**, o cliente de gerenciamento `NDB`.

Consulte a Seção 2.5.4, “Instalando o MySQL no Linux usando pacotes RPM da Oracle”, para obter informações gerais sobre a instalação do MySQL usando RPMs fornecidos pela Oracle. Consulte a Seção 25.3.3, “Configuração inicial do NDB Cluster”, para obter informações sobre a configuração pós-instalação necessária.

#### 25.3.1.3 Instalar o NDB Cluster usando arquivos .deb

A seção fornece informações sobre a instalação do NDB Cluster no Debian e em distribuições Linux relacionadas, como o Ubuntu, usando os arquivos `.deb` fornecidos pela Oracle para esse propósito.

A Oracle também fornece um repositório APT do NDB Cluster para Debian e outras distribuições. Consulte [*Instalando o MySQL NDB Cluster usando o repositório APT*](/doc/mysql-apt-repo-quick-guide/en/#repo-qg-apt-cluster-install), para obter instruções e informações adicionais.

A Oracle fornece os arquivos do instalador `.deb` para NDB Cluster para plataformas de 32 bits e 64 bits. Para um sistema baseado em Debian, apenas um único arquivo de instalador é necessário. Este arquivo é nomeado de acordo com o padrão mostrado aqui, de acordo com a versão do NDB Cluster aplicável, a versão do Debian e a arquitetura:

```
mysql-cluster-gpl-ndbver-debiandebianver-arch.deb
```

Aqui, *`ndbver`* é o número de versão do motor de 3 partes `NDB`, *`debianver`* é a versão principal do Debian (`8` ou `9`) e *`arch`* é um dos `i686` ou `x86_64`. Nos exemplos que se seguem, assumimos que você deseja instalar o NDB 8.0.43 em um sistema Debian 9 de 64 bits; nesse caso, o arquivo do instalador é denominado `mysql-cluster-gpl-8.0.43-debian9-x86_64.deb-bundle.tar`.

Depois de baixar o arquivo apropriado `.deb`, você pode desempacotar-lo e, em seguida, instalá-lo a partir da linha de comando usando `dpkg`, da seguinte forma:

```
$> dpkg -i mysql-cluster-gpl-8.0.43-debian9-i686.deb
```

Você também pode removê-lo usando `dpkg` como mostrado aqui:

```
$> dpkg -r mysql
```

O arquivo do instalador também deve ser compatível com a maioria dos gerenciadores de pacotes gráficos que trabalham com arquivos `.deb`, como o `GDebi` para o ambiente de trabalho Gnome.

O arquivo `.deb` instala o NDB Cluster sob `/opt/mysql/server-version/`, onde *`version`* é a versão da série de lançamento de duas partes para o servidor MySQL incluído. Para o NDB 8.0, isso é sempre `8.0`. O layout do diretório é o mesmo que o da distribuição binária genérica de Linux (consulte a Tabela 2.3, “Layout de Instalação do MySQL para Pacote Binário Genérico Unix/Linux”), com a exceção de que os scripts de inicialização e os arquivos de configuração são encontrados em `support-files` em vez de `share`. Todos os executaveis do NDB Cluster, como **ndb_mgm**, **ndbd** e **ndb_mgmd**, são colocados no diretório `bin`.

#### 25.3.1.4 Construindo um cluster NDB Cluster a partir do código-fonte no Linux

Esta seção fornece informações sobre a compilação do NDB Cluster no Linux e em outras plataformas semelhantes ao Unix. A construção do NDB Cluster a partir de fontes é semelhante à construção do servidor MySQL padrão, embora difira em alguns aspectos-chave discutidos aqui. Para informações gerais sobre a construção do MySQL a partir de fontes, consulte a Seção 2.8, “Instalando MySQL a partir de fontes”. Para informações sobre a compilação do NDB Cluster em plataformas Windows, consulte a Seção 25.3.2.2, “Compilando e Instalando o NDB Cluster a partir de fontes em Windows”.

Para construir o MySQL NDB Cluster 8.0, é necessário usar as fontes do MySQL Server 8.0. Elas estão disponíveis na página de downloads do MySQL em <https://dev.mysql.com/downloads/>. O arquivo de fonte arquivado deve ter um nome semelhante a `mysql-8.0.43.tar.gz`. Você também pode obter as fontes no GitHub em <https://github.com/mysql/mysql-server>.

Nota

Em versões anteriores, a construção do NDB Cluster a partir de fontes padrão do MySQL Server não era suportada. No MySQL 8.0 e no NDB Cluster 8.0, isso não é mais o caso — *ambos os produtos são agora construídos a partir das mesmas fontes*.

A opção `WITH_NDB` para o **CMake** faz com que os binários para os nós de gerenciamento, nós de dados e outros programas do NDB Cluster sejam construídos; também faz com que o **mysqld** seja compilado com suporte ao mecanismo de armazenamento `NDB`. Esta opção (ou, antes do NDB 8.0.31, `WITH_NDBCLUSTER`) é necessária ao construir o NDB Cluster.

Importante

A opção `WITH_NDB_JAVA` é habilitada por padrão. Isso significa que, por padrão, se o **CMake** não conseguir encontrar a localização do Java no seu sistema, o processo de configuração falha; se você não deseja habilitar o suporte ao Java e ao ClusterJ, deve indicar isso explicitamente, configurando a compilação usando `-DWITH_NDB_JAVA=OFF`. Use `WITH_CLASSPATH` para fornecer o caminho de classe do Java, se necessário.

Para obter mais informações sobre as opções do **CMake** específicas para a construção do NDB Cluster, consulte Opções do CMake para Compilar o NDB Cluster.

Depois de executar **make && make install** (ou o equivalente do seu sistema), o resultado é semelhante ao obtido ao desempacotar um binário pré-compilado na mesma localização.

**Nodos de gerenciamento.** Ao construir a partir da fonte e executar o **make install** padrão, os binários do servidor de gerenciamento e do cliente de gerenciamento (**ndb_mgmd** e **ndb_mgm**) podem ser encontrados em `/usr/local/mysql/bin`. Apenas **ndb_mgmd** é necessário estar presente em um host de nó de gerenciamento; no entanto, também é uma boa ideia ter **ndb_mgm** presente na mesma máquina do host. Nenhum desses executáveis requer um local específico no sistema de arquivos da máquina do host.

**Nodos de dados.** O único executável necessário em um host de nó de dados é o binário do nó de dados **ndbd** ou **ndbmtd**"). (**mysqld**, por exemplo, não precisa estar presente na máquina do host). Por padrão, ao compilar a partir do código-fonte, este arquivo é colocado no diretório `/usr/local/mysql/bin`. Para instalação em vários hosts de nó de dados, apenas **ndbd** ou **ndbmtd**") precisa ser copiado para o(s) outro(s) host(es) do computador. (Isso pressupõe que todos os hosts de nó de dados utilizem a mesma arquitetura e sistema operacional; caso contrário, você pode precisar compilar separadamente para cada plataforma diferente). O binário do nó de dados não precisa estar em qualquer local específico no sistema de arquivos do host, desde que o local seja conhecido.

Ao compilar o NDB Cluster a partir do código fonte, não são necessárias opções especiais para a construção de binários de nós de dados multithread. Configurar a compilação com suporte ao motor de armazenamento `NDB` faz com que **ndbmtd**") seja construído automaticamente; o binário **ndbmtd**") é colocado no diretório de instalação `bin` juntamente com **mysqld**, **ndbd** e **ndb_mgm**.

**Nodos SQL.** Se você compilar o MySQL com suporte a clustering e realizar a instalação padrão (usando **make install** como usuário do sistema `/usr/local/mysql/bin`), o **mysqld** é colocado em `/usr/local/mysql`. Siga os passos dados na Seção 2.8, “Instalando MySQL a partir de fonte” para preparar o **mysqld** para uso. Se você deseja executar vários nós SQL, pode usar uma cópia do mesmo executável **mysqld** e seus arquivos de suporte associados em várias máquinas. A maneira mais fácil de fazer isso é copiar o diretório inteiro do `/usr/local/mysql` e todos os diretórios e arquivos contidos nele para o(s) outro(s) host(es) do nó SQL, e depois repetir os passos da Seção 2.8, “Instalando MySQL a partir de fonte” em cada máquina. Se você configurar a compilação com uma opção não padrão do `PREFIX`, você deve ajustar o diretório conforme necessário.

Na Seção 25.3.3, “Configuração inicial do NDB Cluster”, criamos arquivos de configuração para todos os nós do nosso exemplo de NDB Cluster.

#### 25.3.1.5 Implementando o NDB Cluster com Contenedores Docker

##### Baixar uma imagem Docker do MySQL NDB Cluster

Não é estritamente necessário fazer o download da imagem Docker em um passo separado; no entanto, realizar essa etapa antes de criar seus contêineres Docker garante que sua imagem local esteja atualizada. Para fazer o download da imagem do MySQL NDB Cluster Community Edition do [Oracle Container Registry (OCR)][(https://container-registry.oracle.com/)], execute o seguinte comando:

```
docker pull container-registry.oracle.com/mysql/community-cluster:tag
```

O *`tag` é o rótulo para a versão da imagem que você deseja extrair (por exemplo, `7.5`, `7.6`, `8.0` ou `latest`). Se **`:tag`** for omitido, o rótulo `latest` é usado e a imagem para a versão mais recente do MySQL NDB Cluster é baixada.

Você pode listar as imagens de Docker descarregadas com este comando:

```
$> docker images
REPOSITORY                                              TAG       IMAGE ID       CREATED        SIZE
container-registry.oracle.com/mysql/community-cluster   8.0       d1b28e457ac5   5 weeks ago    636MB
```

Para baixar a imagem do MySQL Commercial Cluster do OCR, você precisa aceitar primeiro o acordo de licença. Siga estes passos:

* Visite o OCR em <https://container-registry.oracle.com/> e escolha MySQL.

* Na lista de repositórios do MySQL, escolha `commercial-cluster`.

* Se você ainda não se conectou ao OCR, clique no botão "Conectar-se" à direita da página e, em seguida, insira as credenciais da sua conta Oracle quando solicitado.

* Siga as instruções à direita da página para aceitar o acordo de licença.

Baixe a imagem Docker para o MySQL Commercial Cluster do OCR com este comando:

```
docker pull  container-registry.oracle.com/mysql/commercial-cluster:tag
```

##### Começando um MySQL Cluster com Configuração Padrão

Primeiro, crie uma rede interna Docker chamada `cluster` para que os contêineres se comuniquem entre si:

```
docker network create cluster --subnet=192.168.0.0/16
```

Em seguida, inicie o nó de gerenciamento:

```
docker run -d --net=cluster --name=management1 --ip=192.168.0.2 container-registry.oracle.com/mysql/community-cluster ndb_mgmd
```

Em seguida, inicie os dois nós de dados

```
docker run -d --net=cluster --name=ndb1 --ip=192.168.0.3 container-registry.oracle.com/mysql/community-cluster ndbd
```

```
docker run -d --net=cluster --name=ndb2 --ip=192.168.0.4 container-registry.oracle.com/mysql/community-cluster ndbd
```

Por fim, inicie o nó do servidor MySQL:

```
docker run -d --net=cluster --name=mysql1 --ip=192.168.0.10 -e MYSQL_RANDOM_ROOT_PASSWORD=true container-registry.oracle.com/mysql/community-cluster mysqld
```

O servidor é então inicializado com uma senha aleatória, que precisa ser alterada. Pegue a senha do log:

```
docker logs mysql1 2>&1 | grep PASSWORD
```

Se nenhuma senha for devolvida pelo comando, o servidor ainda não terminou a inicialização. Aguarde um pouco e tente novamente. Assim que receber a senha, mude-a, iniciando sessão no servidor com o cliente `mysql`:

```
docker exec -it mysql1 mysql -uroot -p
```

Uma vez que você esteja no servidor, mude a senha do root com a seguinte declaração:

```
mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'password';
```

Por fim, inicie um contêiner com um cliente de gerenciamento interativo **ndb_mgm** para monitorar o clúster:

```
$> docker run -it --net=cluster container-registry.oracle.com/mysql/community-cluster ndb_mgm
[Entrypoint] MySQL Docker Image 8.0.43-1.2.10-cluster
[Entrypoint] Starting ndb_mgm
-- NDB Cluster -- Management Client --
```

Execute o comando `SHOW` para imprimir o status do cluster. Você deve ver o seguinte:

```
ndb_mgm> SHOW
Connected to Management Server at: 192.168.0.2:1186
Cluster Configuration
---------------------
[ndbd(NDB)]	2 node(s)
id=2	@192.168.0.3  (mysql-8.0.43-ndb-8.0.43, Nodegroup: 0, *)
id=3	@192.168.0.4  (mysql-8.0.43-ndb-8.0.43, Nodegroup: 0)

[ndb_mgmd(MGM)]	1 node(s)
id=1	@192.168.0.2  (mysql-8.0.43-ndb-8.0.43)

[mysqld(API)]	1 node(s)
id=4	@192.168.0.10  (mysql-8.0.43-ndb-8.0.43)
```

##### Personalizando o MySQL Cluster

A imagem padrão do MySQL NDB Cluster inclui dois arquivos de configuração, que também estão disponíveis no [repositório do GitHub para MySQL NDB Cluster][(https://github.com/mysql/mysql-docker/tree/mysql-cluster)]

* `/etc/my.cnf`
* `/etc/mysql-cluster.cnf`

Para alterar o clúster (por exemplo, adicionar mais nós ou alterar a configuração da rede), esses arquivos devem ser atualizados. Para mais informações, consulte a Seção 25.4.3, “Arquivos de Configuração do Clúster NDB”. Para usar arquivos de configuração personalizados ao iniciar o contêiner, use a bandeira `-v` para carregar arquivos externos. Por exemplo (entre no comando inteiro na mesma linha):

```
$> docker run -d --net=cluster --name=management1 \
      --ip=192.168.0.2 -v /etc/my.cnf:/etc/my.cnf -v \
      /etc/mysql-cluster.cnf:/etc/mysql-cluster.cnf \
      container-registry.oracle.com/mysql/community-cluster ndb_mgmd
```

### 25.3.2 Instalar o NDB Cluster no Windows

Esta seção descreve os procedimentos de instalação do NDB Cluster em anfitriões Windows. Os binários do NDB Cluster 8.0 para Windows podem ser obtidos em <https://dev.mysql.com/downloads/cluster/>. Para obter informações sobre a instalação do NDB Cluster em Windows a partir de uma versão binária fornecida pela Oracle, consulte a Seção 25.3.2.1, “Instalando o NDB Cluster em Windows a partir de uma versão binária”.

É também possível compilar e instalar o NDB Cluster a partir de fonte no Windows usando o Microsoft Visual Studio. Para mais informações, consulte a Seção 25.3.2.2, “Compilar e instalar o NDB Cluster a partir de fonte no Windows”.

#### 25.3.2.1 Instalar o NDB Cluster no Windows a partir de uma versão binária

Esta seção descreve uma instalação básica do NDB Cluster no Windows usando uma versão binária do NDB Cluster “sem instalação” fornecida pela Oracle, utilizando a mesma configuração de 4 nós descrita no início desta seção (ver Seção 25.3, “Instalação do NDB Cluster”), conforme mostrado na tabela a seguir:

**Tabela 25.7 Endereços de rede dos nós no exemplo de cluster**

<table><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Núcleo</th> <th>IP Address</th> </tr></thead><tbody><tr> <td>nó de gerenciamento (mgmd)</td> <td>198.51.100.10</td> </tr><tr> <td>nó SQL (mysqld)</td> <td>198.51.100.20</td> </tr><tr> <td>Núcleo de dados "A" (ndbd)</td> <td>198.51.100.30</td> </tr><tr> <td>Núcleo de dados "B" (ndbd)</td> <td>198.51.100.40</td> </tr></tbody></table>

Assim como em outras plataformas, o computador hospedeiro do NDB Cluster que executa um nó SQL deve ter instalado nele um binário do servidor MySQL (**mysqld.exe**). Você também deve ter o cliente MySQL (**mysql.exe**) neste host. Para os nós de gerenciamento e os nós de dados, não é necessário instalar o binário do servidor MySQL; no entanto, cada nó de gerenciamento requer o daemon do servidor de gerenciamento (**ndb_mgmd.exe**); cada nó de dados requer o daemon do nó de dados (**ndbd.exe** ou **ndbmtd.exe**)). Para este exemplo, referenciamos o **ndbd.exe** como o executável do nó de dados, mas você pode instalar **ndbmtd.exe**"), a versão multithread deste programa, em vez disso, da mesma maneira. Você também deve instalar o cliente de gerenciamento (**ndb_mgm.exe**) no host do servidor de gerenciamento. Esta seção abrange os passos necessários para instalar os binários corretos do Windows para cada tipo de nó do NDB Cluster.

Nota

Assim como outros programas do Windows, os executáveis do NDB Cluster são nomeados com a extensão de arquivo `.exe`. No entanto, não é necessário incluir a extensão `.exe` ao invocar esses programas a partir da linha de comando. Portanto, muitas vezes, simplesmente referenciamos esses programas nesta documentação como **mysqld**, **mysql**, **ndb_mgmd**, e assim por diante. Você deve entender que, seja qual for o nome que usamos (por exemplo), **mysqld** ou **mysqld.exe**, ambos os nomes significam a mesma coisa (o programa do Servidor MySQL).

Para configurar um NDB Cluster usando os binários `no-install` da Oracle, o primeiro passo no processo de instalação é baixar o arquivo ZIP de binários do NDB Cluster Windows mais recente a partir de <https://dev.mysql.com/downloads/cluster/>. Este arquivo tem um nome de arquivo de `mysql-cluster-gpl-ver-winarch.zip`, onde *`ver`* é a versão do motor de armazenamento `NDB` (como `8.0.43`) e *`arch`* é a arquitetura (`32` para binários de 32 bits e `64` para binários de 64 bits). Por exemplo, o arquivo NDB Cluster 8.0.43 para sistemas Windows de 64 bits é chamado de `mysql-cluster-gpl-8.0.43-win64.zip`.

Você pode executar os binários do NDB Cluster de 32 bits em versões tanto de 32 bits quanto de 64 bits do Windows; no entanto, os binários do NDB Cluster de 64 bits só podem ser usados em versões de 64 bits do Windows. Se você estiver usando uma versão de 32 bits do Windows em um computador que tem uma CPU de 64 bits, então você deve usar os binários do NDB Cluster de 32 bits.

Para minimizar o número de arquivos que precisam ser baixados da Internet ou copiados entre máquinas, começamos com o computador onde você pretende executar o nó SQL.

**Nodo SQL.** Assumemos que você colocou uma cópia do arquivo no diretório `C:\Documents and Settings\username\My Documents\Downloads` no computador que tem o endereço IP 198.51.100.20, onde *`username`* é o nome do usuário atual. (Você pode obter esse nome usando `ECHO %USERNAME%` na linha de comando.) Para instalar e executar os executaveis do NDB Cluster como serviços do Windows, esse usuário deve ser membro do grupo `Administrators`.

Extraia todos os arquivos do arquivo. O Assistente de Extração integrado ao Windows Explorer é adequado para essa tarefa. (Se você usar um programa de arquivo diferente, certifique-se de que ele extraia todos os arquivos e diretórios do arquivo e que preserve a estrutura de diretório do arquivo.) Quando você for solicitado um diretório de destino, insira `C:\`, o que faz com que o Assistente de Extração extraia o arquivo para o diretório `C:\mysql-cluster-gpl-ver-winarch`. Renomeie esse diretório para `C:\mysql`.

É possível instalar os binários do NDB Cluster em diretórios que não sejam `C:\mysql\bin`; no entanto, se você fizer isso, deve modificar os caminhos mostrados neste procedimento conforme necessário. Em particular, se o binário do Servidor MySQL (nó SQL) estiver instalado em um local diferente de `C:\mysql` ou `C:\Program Files\MySQL\MySQL Server 8.0`, ou se o diretório de dados do nó SQL estiver em um local diferente de `C:\mysql\data` ou `C:\Program Files\MySQL\MySQL Server 8.0\data`, opções de configuração adicionais devem ser usadas na linha de comando ou adicionadas ao arquivo `my.ini` ou `my.cnf` ao iniciar o nó SQL. Para obter mais informações sobre como configurar um Servidor MySQL para rodar em um local não padrão, consulte [Seção 2.3.4, “Instalando MySQL no Microsoft Windows usando um arquivo ZIP `noinstall`”][(windows-install-archive.html "2.3.4 Installing MySQL on Microsoft Windows Using a noinstall ZIP Archive")].

Para que um servidor MySQL com suporte ao NDB Cluster funcione como parte de um NDB Cluster, ele deve ser iniciado com as opções `--ndbcluster` e `--ndb-connectstring`. Embora você possa especificar essas opções na linha de comando, geralmente é mais conveniente colocá-las em um arquivo de opções. Para fazer isso, crie um novo arquivo de texto no Bloco de Notas ou em outro editor de texto. Insira as seguintes informações de configuração neste arquivo:

```
[mysqld]
# Options for mysqld process:
ndbcluster                       # run NDB storage engine
ndb-connectstring=198.51.100.10  # location of management server
```

Você pode adicionar outras opções usadas por este servidor MySQL, se desejar (consulte a Seção 2.3.4.2, “Criando um arquivo de opção”), mas o arquivo deve conter as opções mostradas, no mínimo. Salve este arquivo como `C:\mysql\my.ini`. Isso completa a instalação e configuração do nó SQL.

**Nodos de dados.** Um nó de dados de NDB Cluster em um host Windows requer apenas um único executável, ou seja, **ndbd.exe** ou **ndbmtd.exe**"). Para este exemplo, assumimos que você está usando **ndbd.exe**, mas as mesmas instruções se aplicam quando você usa **ndbmtd.exe""). Em cada computador onde você deseja executar um nó de dados (os computadores com os endereços IP 198.51.100.30 e 198.51.100.40), crie os diretórios `C:\mysql`, `C:\mysql\bin` e `C:\mysql\cluster-data`; em seguida, no computador onde você baixou e extraiu o arquivo `no-install`, localize `ndbd.exe` no diretório `C:\mysql\bin`. Copie este arquivo para o diretório `C:\mysql\bin` em cada um dos dois hosts de nó de dados.

Para funcionar como parte de um NDB Cluster, cada nó de dados deve receber o endereço ou o nome de host do servidor de gerenciamento. Você pode fornecer essas informações na linha de comando usando a opção `--ndb-connectstring` ou `-c` ao iniciar cada processo do nó de dados. No entanto, geralmente é preferível colocar essas informações em um arquivo de opção. Para fazer isso, crie um novo arquivo de texto no Bloco de Notas ou em outro editor de texto e insira o seguinte texto:

```
[mysql_cluster]
# Options for data node process:
ndb-connectstring=198.51.100.10  # location of management server
```

Salve este arquivo como `C:\mysql\my.ini` no host do nó de dados. Crie outro arquivo de texto contendo as mesmas informações e salve-o como `C:mysql\my.ini` no outro host do nó de dados, ou copie o arquivo my.ini do primeiro host do nó de dados para o segundo, garantindo que a cópia esteja no diretório `C:\mysql` do segundo nó de dados. Ambos os hosts de nó de dados estão agora prontos para serem usados no NDB Cluster, o que deixa apenas o nó de gerenciamento a ser instalado e configurado.

**Núcleo de gerenciamento**. O único programa executável necessário em um computador usado para hospedar um nó de gerenciamento de NDB Cluster é o programa do servidor de gerenciamento **ndb_mgmd.exe**. No entanto, para administrar o NDB Cluster uma vez que ele tenha sido iniciado, você também deve instalar o programa de cliente de gerenciamento do NDB Cluster **ndb_mgm.exe** na mesma máquina que o servidor de gerenciamento. Localize esses dois programas na máquina onde você baixou e extraiu o arquivo `no-install`; isso deve ser o diretório `C:\mysql\bin` no host do nó SQL. Crie o diretório `C:\mysql\bin` no computador com o endereço IP 198.51.100.10, em seguida, copie ambos os programas para este diretório.

Agora, você deve criar dois arquivos de configuração para uso pelo `ndb_mgmd.exe`:

1. Um arquivo de configuração local para fornecer dados de configuração específicos para o próprio nó de gerenciamento. Normalmente, este arquivo só precisa fornecer a localização do arquivo de configuração global do NDB Cluster (veja o item 2).

Para criar este arquivo, comece um novo arquivo de texto no Bloco de Notas ou em outro editor de texto e insira as seguintes informações:

   ```
   [mysql_cluster]
   # Options for management node process
   config-file=C:/mysql/bin/config.ini
   ```

Salve este arquivo como o arquivo de texto `C:\mysql\bin\my.ini`.

2. Um arquivo de configuração global a partir do qual o nó de gerenciamento pode obter informações de configuração que regem o NDB Cluster como um todo. No mínimo, esse arquivo deve conter uma seção para cada nó no NDB Cluster, e os endereços IP ou nomes de host para o nó de gerenciamento e todos os nós de dados (parâmetro de configuração `HostName`). Também é aconselhável incluir as seguintes informações adicionais:

* O endereço IP ou o nome de domínio de qualquer nó SQL
* A memória de dados e a memória de índice alocada para cada nó de dados (os parâmetros de configuração `DataMemory` e `IndexMemory`)

* O número de réplicas de fragmento, usando o parâmetro de configuração `NoOfReplicas` (consulte a Seção 25.2.2, "Nodos do clúster NDB, Grupos de nó, Replicas de fragmento e Partições")

* O diretório onde cada nó de dados armazena seus dados e arquivo de registro, e o diretório onde o nó de gerenciamento mantém seus arquivos de registro (em ambos os casos, o parâmetro de configuração `DataDir`)

Crie um novo arquivo de texto usando um editor de texto, como o Bloco de Notas, e insira as seguintes informações:

   ```
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

```
DataDir=C:\mysql\bin\cluster-logs
```

Em vez disso, você pode usar qualquer uma das seguintes opções:

```
DataDir=C:\\mysql\\bin\\cluster-logs  # Escaped backslashes
```

```
DataDir=C:/mysql/bin/cluster-logs     # Forward slashes
```

Por razões de brevidade e legibilidade, recomendamos que você use barras inclinadas em caminhos de diretório usados nas opções de programa do NDB Cluster e nos arquivos de configuração no Windows.

#### 25.3.2.2 Compilando e Instalando o NDB Cluster a partir de fonte no Windows

A Oracle fornece binários pré-compilados do NDB Cluster para Windows, que devem ser adequados para a maioria dos usuários. No entanto, se desejar, também é possível compilar o NDB Cluster para Windows a partir do código-fonte. O procedimento para fazer isso é quase idêntico ao procedimento usado para compilar os binários padrão do MySQL Server para Windows, e usa as mesmas ferramentas. No entanto, há duas diferenças principais:

* Para construir o MySQL NDB Cluster 8.0, é necessário usar as fontes do MySQL Server 8.0. Elas estão disponíveis na página de downloads do MySQL em <https://dev.mysql.com/downloads/>. O arquivo de fonte arquivado deve ter um nome semelhante a `mysql-8.0.43.tar.gz`. Você também pode obter as fontes no GitHub em <https://github.com/mysql/mysql-server>.

* Você deve configurar a compilação usando a opção `WITH_NDB` além de quaisquer outras opções de compilação que você deseja usar com **CMake**. `WITH_NDBCLUSTER` também é suportado para compatibilidade reversa, mas é desaconselhado a partir do NDB 8.0.31.

Importante

A opção `WITH_NDB_JAVA` é habilitada por padrão. Isso significa que, por padrão, se o **CMake** não conseguir encontrar a localização do Java no seu sistema, o processo de configuração falha; se você não deseja habilitar o suporte ao Java e ao ClusterJ, deve indicar isso explicitamente, configurando a compilação usando `-DWITH_NDB_JAVA=OFF`. (Bug #12379735) Use `WITH_CLASSPATH` para fornecer o caminho de classe do Java, se necessário.

Para obter mais informações sobre as opções do **CMake** específicas para a construção do NDB Cluster, consulte Opções do CMake para Compilar o NDB Cluster.

Uma vez que o processo de compilação esteja concluído, você pode criar um arquivo Zip contendo os binários compilados; a Seção 2.8.4, “Instalando o MySQL usando uma distribuição de fonte padrão”, fornece os comandos necessários para realizar essa tarefa em sistemas Windows. Os binários do NDB Cluster podem ser encontrados no diretório `bin` do arquivo resultante, que é equivalente ao arquivo `no-install`, e que pode ser instalado e configurado da mesma maneira. Para mais informações, consulte a Seção 25.3.2.1, “Instalando o NDB Cluster no Windows a partir de uma versão binária”.

#### 25.3.2.3 Inicialização inicial do NDB Cluster no Windows

Uma vez que os executáveis do NDB Cluster e os arquivos de configuração necessários estejam disponíveis, realizar um início inicial do cluster é simplesmente uma questão de iniciar os executáveis do NDB Cluster para todos os nós do cluster. Cada processo do nó do cluster deve ser iniciado separadamente, no computador host onde ele reside. O nó de gerenciamento deve ser iniciado primeiro, seguido pelos nós de dados e, finalmente, pelos nós SQL.

1. No nó de gerenciamento, execute o seguinte comando na linha de comando para iniciar o processo do nó de gerenciamento. A saída deve parecer semelhante àquela mostrada aqui:

   ```
   C:\mysql\bin> ndb_mgmd
   2010-06-23 07:53:34 [MgmtSrvr] INFO -- NDB Cluster Management Server. mysql-8.0.44-ndb-8.0.44
   2010-06-23 07:53:34 [MgmtSrvr] INFO -- Reading cluster configuration from 'config.ini'
   ```

O processo do nó de gerenciamento continua a imprimir saída de registro no console. Isso é normal, porque o nó de gerenciamento não está executando como um serviço do Windows. (Se você usou o NDB Cluster em uma plataforma semelhante ao Unix, como Linux, você pode notar que o comportamento padrão do nó de gerenciamento nesse sentido no Windows é efetivamente o oposto de seu comportamento em sistemas Unix, onde ele é executado por padrão como um processo de daemon Unix. Esse comportamento também é verdadeiro para os processos de nó de dados do NDB Cluster que estão sendo executados no Windows.) Por esse motivo, não feche a janela na qual o **ndb_mgmd.exe** está sendo executado; fazer isso mata o processo do nó de gerenciamento. (Veja a Seção 25.3.2.4, “Instalando processos do NDB Cluster como serviços do Windows”, onde mostramos como instalar e executar processos do NDB Cluster como serviços do Windows.)

A opção `-f` necessária informa ao nó de gerenciamento onde encontrar o arquivo de configuração global (`config.ini`). A forma longa desta opção é `--config-file`.

Importante

Um nó de gerenciamento de cluster NDB armazena os dados de configuração que lê do `config.ini`; uma vez que ele criou um cache de configuração, ele ignora o arquivo `config.ini` em iniciações subsequentes, a menos que seja forçado a fazer o contrário. Isso significa que, se o nó de gerenciamento não iniciar devido a um erro neste arquivo, você deve fazer o nó de gerenciamento reler `config.ini` depois de ter corrigido quaisquer erros nele. Você pode fazer isso iniciando o **ndb_mgmd.exe** com a opção `--reload` ou `--initial` na linha de comando. Qualquer uma dessas opções funciona para atualizar o cache de configuração.

Não é necessário nem aconselhável usar nenhuma dessas opções no arquivo `my.ini` do nó de gerenciamento.

2. Em cada um dos hosts dos nós de dados, execute o comando mostrado aqui para iniciar os processos do nó de dados:

   ```
   C:\mysql\bin> ndbd
   2010-06-23 07:53:46 [ndbd] INFO -- Configuration fetched from 'localhost:1186', generation: 1
   ```

Em cada caso, a primeira linha de saída do processo do nó de dados deve se assemelhar ao que é mostrado no exemplo anterior, e é seguida por linhas adicionais de saída de registro. Como no caso do processo do nó de gerenciamento, isso é normal, porque o nó de dados não está sendo executado como um serviço do Windows. Por essa razão, não feche a janela do console na qual o processo do nó de dados está sendo executado; isso mata o **ndbd.exe**. (Para mais informações, consulte a Seção 25.3.2.4, “Instalando processos do NDB Cluster como serviços do Windows”.)

3. Não inicie o nó SQL ainda; ele não pode se conectar ao clúster até que os nós de dados tenham terminado de iniciar, o que pode levar algum tempo. Em vez disso, em uma nova janela do console no host do nó de gerenciamento, inicie o cliente de gerenciamento do NDB Cluster **ndb_mgm.exe**, que deve estar em `C:\mysql\bin` no host do nó de gerenciamento. (Não tente reutilizar a janela do console onde o **ndb_mgmd.exe** está em execução digitando **CTRL**+**C**, pois isso mata o nó de gerenciamento.) A saída resultante deve parecer assim:

   ```
   C:\mysql\bin> ndb_mgm
   -- NDB Cluster -- Management Client --
   ndb_mgm>
   ```

Quando o prompt `ndb_mgm>` aparecer, isso indica que o cliente de gerenciamento está pronto para receber comandos de gerenciamento do NDB Cluster. Você pode observar o status dos nós de dados, pois eles começam a aparecer ao digitar `ALL STATUS` no prompt do cliente de gerenciamento. Esse comando causa um relatório em execução da sequência de inicialização dos nós de dados, que deve parecer algo assim:

   ```
   ndb_mgm> ALL STATUS
   Connected to Management Server at: localhost:1186
   Node 2: starting (Last completed phase 3) (mysql-8.0.44-ndb-8.0.44)
   Node 3: starting (Last completed phase 3) (mysql-8.0.44-ndb-8.0.44)

   Node 2: starting (Last completed phase 4) (mysql-8.0.44-ndb-8.0.44)
   Node 3: starting (Last completed phase 4) (mysql-8.0.44-ndb-8.0.44)

   Node 2: Started (version 8.0.44)
   Node 3: Started (version 8.0.44)

   ndb_mgm>
   ```

Nota

Os comandos emitidos no cliente de gerenciamento não são sensíveis ao caso; usamos letras maiúsculas como a forma canônica desses comandos, mas você não é obrigado a observar essa convenção ao inseri-los no cliente **ndb_mgm**. Para mais informações, consulte a Seção 25.6.1, “Comandos no cliente de gerenciamento do NDB Cluster”.

A saída produzida por `ALL STATUS`(mysql-cluster-mgm-client-commands.html#ndbclient-status) provavelmente variará do que é mostrado aqui, de acordo com a velocidade com que os nós de dados conseguem começar, o número da versão de liberação do software NDB Cluster que você está usando e outros fatores. O que é significativo é que, quando você vê que ambos os nós de dados começaram, você está pronto para começar o nó SQL.

Você pode deixar o **ndb_mgm.exe** rodando; ele não tem impacto negativo no desempenho do NDB Cluster, e o usaremos no próximo passo para verificar se o nó SQL está conectado ao cluster depois de tê-lo iniciado.

4. No computador designado como anfitrião do nó SQL, abra uma janela de console e navegue até o diretório onde você desempacotou os binários do NDB Cluster (se você está seguindo nosso exemplo, isso é `C:\mysql\bin`).

Comece o nó SQL invocando o **mysqld.exe** a partir da linha de comando, conforme mostrado aqui:

   ```
   C:\mysql\bin> mysqld --console
   ```

A opção `--console` faz com que as informações de registro sejam escritas no console, o que pode ser útil em caso de problemas. (Assim que você estiver satisfeito de que o nó SQL está sendo executado de maneira satisfatória, você pode paralisá-lo e recomeçá-lo sem a opção `--console`, para que o registro seja realizado normalmente.)

Na janela do console onde o cliente de gerenciamento (**ndb_mgm.exe**) está sendo executado no host do nó de gerenciamento, insira o comando `SHOW`, que deve produzir uma saída semelhante àquela mostrada aqui:

   ```
   ndb_mgm> SHOW
   Connected to Management Server at: localhost:1186
   Cluster Configuration
   ---------------------
   [ndbd(NDB)]     2 node(s)
   id=2    @198.51.100.30  (Version: 8.0.44-ndb-8.0.44, Nodegroup: 0, *)
   id=3    @198.51.100.40  (Version: 8.0.44-ndb-8.0.44, Nodegroup: 0)

   [ndb_mgmd(MGM)] 1 node(s)
   id=1    @198.51.100.10  (Version: 8.0.44-ndb-8.0.44)

   [mysqld(API)]   1 node(s)
   id=4    @198.51.100.20  (Version: 8.0.44-ndb-8.0.44)
   ```

Você também pode verificar se o nó SQL está conectado ao NDB Cluster no cliente **mysql** (**mysql.exe**) usando a declaração `SHOW ENGINE NDB STATUS`.

Agora, você deve estar pronto para trabalhar com objetos e dados de banco de dados usando o mecanismo de armazenamento `NDBCLUSTER` do NDB Cluster. Consulte a Seção 25.3.5, “Exemplo de NDB Cluster com Tabelas e Dados”, para obter mais informações e exemplos.

Você também pode instalar **ndb_mgmd.exe**, **ndbd.exe** e **ndbmtd.exe** como serviços do Windows. Para obter informações sobre como fazer isso, consulte a Seção 25.3.2.4, “Instalando processos do NDB Cluster como serviços do Windows”).

#### 25.3.2.4 Instalar processos do NDB Cluster como serviços do Windows

Assim que você estiver satisfeito com o funcionamento do NDB Cluster conforme o desejado, você pode instalar os nós de gerenciamento e os nós de dados como serviços do Windows, para que esses processos sejam iniciados e interrompidos automaticamente sempre que o Windows for iniciado ou interrompido. Isso também permite controlar esses processos a partir da linha de comando com os comandos apropriados **SC START** e **SC STOP**, ou usando o utilitário gráfico **Serviços** do Windows. Os comandos **NET START** e **NET STOP** também podem ser usados.

A instalação de programas como serviços do Windows geralmente deve ser feita usando uma conta que tenha direitos de administrador no sistema.

Para instalar o nó de gerenciamento como um serviço no Windows, invoque **ndb_mgmd.exe** a partir da linha de comando na máquina que hospeda o nó de gerenciamento, usando a opção `--install`, conforme mostrado aqui:

```
C:\> C:\mysql\bin\ndb_mgmd.exe --install
Installing service 'NDB Cluster Management Server'
  as '"C:\mysql\bin\ndbd.exe" "--service=ndb_mgmd"'
Service successfully installed.
```

Importante

Ao instalar um programa do NDB Cluster como um serviço do Windows, você deve sempre especificar o caminho completo; caso contrário, a instalação do serviço pode falhar com o erro O sistema não pode encontrar o arquivo especificado.

A opção `--install` deve ser usada primeiro, antes de qualquer outra opção que possa ser especificada para **ndb_mgmd.exe**. No entanto, é preferível especificar essas opções em um arquivo de opções em vez disso. Se seu arquivo de opções não estiver em um dos locais padrão, conforme mostrado na saída de **ndb_mgmd.exe** `--help`, você pode especificar a localização usando a opção `--config-file`.

Agora você deve ser capaz de iniciar e parar o servidor de gerenciamento da seguinte forma:

```
C:\> SC START ndb_mgmd

C:\> SC STOP ndb_mgmd
```

Nota

Se você estiver usando comandos **NET**, também pode iniciar ou parar o servidor de gerenciamento como um serviço do Windows usando o nome descritivo, conforme mostrado aqui:

```
C:\> NET START 'NDB Cluster Management Server'
The NDB Cluster Management Server service is starting.
The NDB Cluster Management Server service was started successfully.

C:\> NET STOP  'NDB Cluster Management Server'
The NDB Cluster Management Server service is stopping..
The NDB Cluster Management Server service was stopped successfully.
```

Geralmente é mais simples especificar um nome de serviço curto ou permitir que o nome de serviço padrão seja usado ao instalar o serviço, e então fazer referência a esse nome ao iniciar ou parar o serviço. Para especificar um nome de serviço diferente de `ndb_mgmd`, adicione-o à opção `--install`, como mostrado neste exemplo:

```
C:\> C:\mysql\bin\ndb_mgmd.exe --install=mgmd1
Installing service 'NDB Cluster Management Server'
  as '"C:\mysql\bin\ndb_mgmd.exe" "--service=mgmd1"'
Service successfully installed.
```

Agora você deve ser capaz de iniciar ou parar o serviço usando o nome que você especificou, assim:

```
C:\> SC START mgmd1

C:\> SC STOP mgmd1
```

Para remover o serviço do nó de gerenciamento, use **SC DELETE *`service_name`***:

```
C:\> SC DELETE mgmd1
```

Alternativamente, invoque o **ndb_mgmd.exe** com a opção `--remove`, conforme mostrado aqui:

```
C:\> C:\mysql\bin\ndb_mgmd.exe --remove
Removing service 'NDB Cluster Management Server'
Service successfully removed.
```

Se você instalou o serviço usando um nome de serviço diferente do padrão, passe o nome do serviço como o valor da opção **ndb_mgmd.exe** `--remove` assim:

```
C:\> C:\mysql\bin\ndb_mgmd.exe --remove=mgmd1
Removing service 'mgmd1'
Service successfully removed.
```

A instalação de um processo de nó de dados de NDB Cluster como um serviço do Windows pode ser feita de maneira semelhante, usando a opção `--install` para **ndbd.exe** (ou **ndbmtd.exe**)), conforme mostrado aqui:

```
C:\> C:\mysql\bin\ndbd.exe --install
Installing service 'NDB Cluster Data Node Daemon' as '"C:\mysql\bin\ndbd.exe" "--service=ndbd"'
Service successfully installed.
```

Agora você pode iniciar ou parar o nó de dados conforme mostrado no exemplo a seguir:

```
C:\> SC START ndbd

C:\> SC STOP ndbd
```

Para remover o serviço de nó de dados, use **SC DELETE *`service_name`***:

```
C:\> SC DELETE ndbd
```

Alternativamente, invoque o **ndbd.exe** com a opção `--remove`, conforme mostrado aqui:

```
C:\> C:\mysql\bin\ndbd.exe --remove
Removing service 'NDB Cluster Data Node Daemon'
Service successfully removed.
```

Assim como o **ndb_mgmd.exe** (e o **mysqld.exe**), ao instalar o **ndbd.exe** como um serviço do Windows, você também pode especificar um nome para o serviço como o valor de `--install`, e depois usá-lo ao iniciar ou parar o serviço, assim:

```
C:\> C:\mysql\bin\ndbd.exe --install=dnode1
Installing service 'dnode1' as '"C:\mysql\bin\ndbd.exe" "--service=dnode1"'
Service successfully installed.

C:\> SC START dnode1

C:\> SC STOP dnode1
```

Se você especificou um nome de serviço ao instalar o serviço de nó de dados, você pode usar esse nome ao removê-lo também, como mostrado aqui:

```
C:\> SC DELETE dnode1
```

Como alternativa, você pode passar o nome do serviço como o valor da opção `ndbd.exe` `--remove`, conforme mostrado aqui:

```
C:\> C:\mysql\bin\ndbd.exe --remove=dnode1
Removing service 'dnode1'
Service successfully removed.
```

A instalação do nó SQL como um serviço do Windows, o início do serviço, a parada do serviço e a remoção do serviço são feitos de maneira semelhante, usando **mysqld** `--install`, **SC START**, **SC STOP** e **SC DELETE** (ou **mysqld** `--remove`). Os comandos **NET** também podem ser usados para iniciar ou parar um serviço. Para informações adicionais, consulte a Seção 2.3.4.8, “Iniciando o MySQL como um serviço do Windows”.

### 25.3.3 Configuração Inicial do NDB Cluster

Nesta seção, discutimos a configuração manual de um NDB Cluster instalado, criando e editando arquivos de configuração.

Para o nosso NDB Cluster de quatro nós e quatro hosts (veja Nodos do cluster e computadores de host), é necessário escrever quatro arquivos de configuração, um por cada host do nó.

* Cada nó de dados ou nó SQL requer um arquivo `my.cnf` que fornece duas informações: uma string de conexão que indica ao nó onde encontrar o nó de gerenciamento e uma linha que informa ao servidor MySQL neste host (a máquina que hospeda o nó de dados) para habilitar o mecanismo de armazenamento `NDBCLUSTER`.

Para mais informações sobre as cadeias de conexão, consulte a Seção 25.4.3.3, “Cadeias de conexão do NDB Cluster”.

* O nó de gerenciamento precisa de um arquivo `config.ini` que indique quantas réplicas de fragmento devem ser mantidas, quanto memória deve ser alocada para dados e índices em cada nó de dados, onde encontrar os nós de dados, onde salvar dados em disco em cada nó de dados e onde encontrar quaisquer nós SQL.

**Configurando os nós de dados e os nós SQL.** O arquivo `my.cnf` necessário para os nós de dados é bastante simples. O arquivo de configuração deve estar localizado no diretório `/etc` e pode ser editado usando qualquer editor de texto. (Crie o arquivo se ele não existir.) Por exemplo:

```
$> vi /etc/my.cnf
```

Nota

Mostramos que **vi** está sendo usado aqui para criar o arquivo, mas qualquer editor de texto deve funcionar da mesma forma.

Para cada nó de dados e nó SQL na nossa configuração de exemplo, `my.cnf` deve parecer assim:

```
[mysqld]
# Options for mysqld process:
ndbcluster                      # run NDB storage engine

[mysql_cluster]
# Options for NDB Cluster processes:
ndb-connectstring=198.51.100.10  # location of management server
```

Após inserir as informações anteriores, salve esse arquivo e saia do editor de texto. Faça isso para as máquinas que hospedam o nó de dados "A", o nó de dados "B" e o nó SQL.

Importante

Uma vez que você tenha iniciado um processo **mysqld** com os parâmetros `ndbcluster` e `ndb-connectstring` nas seções `[mysqld]` e `[mysql_cluster]` do arquivo `my.cnf` conforme mostrado anteriormente, você não pode executar quaisquer instruções `CREATE TABLE` ou `ALTER TABLE` sem ter iniciado o clúster. Caso contrário, essas instruções falharão com um erro. Isso é por design.

**Configurando o nó de gerenciamento.** O primeiro passo para configurar o nó de gerenciamento é criar o diretório em que o arquivo de configuração pode ser encontrado e, em seguida, criar o próprio arquivo. Por exemplo (executando como `root`):

```
$> mkdir /var/lib/mysql-cluster
$> cd /var/lib/mysql-cluster
$> vi config.ini
```

Para a configuração representativa, o arquivo `config.ini` deve ser lido da seguinte forma:

```
[ndbd default]
# Options affecting ndbd processes on all data nodes:
NoOfReplicas=2    # Number of fragment replicas
DataMemory=98M    # How much memory to allocate for data storage

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

Depois que todos os arquivos de configuração foram criados e essas opções mínimas foram especificadas, você está pronto para prosseguir com o início do clúster e verificar se todos os processos estão em execução. Discutimos como isso é feito na Seção 25.3.4, “Início Inicial do Clúster NDB”.

Para informações mais detalhadas sobre os parâmetros de configuração do NDB Cluster disponíveis e seus usos, consulte a Seção 25.4.3, “Arquivos de Configuração do NDB Cluster”, e a Seção 25.4, “Configuração do NDB Cluster”. Para a configuração do NDB Cluster em relação à realização de backups, consulte a Seção 25.6.8.3, “Configuração para backups do NDB Cluster”.

O porto padrão para os nós de gerenciamento do Cluster é 1186. Para os nós de dados, o cluster pode alocar automaticamente os portos dos que já estão livres.

### 25.3.4 Inicialização inicial do NDB Cluster

Iniciar o clúster não é muito difícil depois que ele foi configurado. Cada processo do nó do clúster deve ser iniciado separadamente, e no host onde ele reside. O nó de gerenciamento deve ser iniciado primeiro, seguido pelos nós de dados e, então, finalmente, pelos nós SQL:

1. No host de gerenciamento, execute o seguinte comando na linha de comandos do sistema para iniciar o processo do nó de gerenciamento:

   ```
   $> ndb_mgmd --initial -f /var/lib/mysql-cluster/config.ini
   ```

A primeira vez que ele é iniciado, **ndb_mgmd** deve ser informado onde encontrar seu arquivo de configuração, usando a opção `-f` ou `--config-file`. Esta opção exige que `--initial` ou `--reload` também seja especificado; veja Seção 25.5.4, “ndb_mgmd — O Daemon do Gerenciador de NDB Cluster”, para detalhes.

2. Em cada um dos hosts dos nós de dados, execute este comando para iniciar o processo **ndbd**:

   ```
   $> ndbd
   ```

3. Se você usou arquivos RPM para instalar o MySQL no host do clúster onde o nó SQL deve residir, você pode (e deve) usar o script de inicialização fornecido para iniciar o processo do servidor MySQL no nó SQL.

Se tudo tiver saído bem e o clúster tiver sido configurado corretamente, o clúster já deve estar operacional. Você pode testar isso invocando o cliente do nó de gerenciamento **ndb_mgm**. A saída deve parecer a mesma mostrada aqui, embora você possa ver algumas pequenas diferenças na saída, dependendo da versão exata do MySQL que você está usando:

```
$> ndb_mgm
-- NDB Cluster -- Management Client --
ndb_mgm> SHOW
Connected to Management Server at: localhost:1186
Cluster Configuration
---------------------
[ndbd(NDB)]     2 node(s)
id=2    @198.51.100.30  (Version: 8.0.44-ndb-8.0.44, Nodegroup: 0, *)
id=3    @198.51.100.40  (Version: 8.0.44-ndb-8.0.44, Nodegroup: 0)

[ndb_mgmd(MGM)] 1 node(s)
id=1    @198.51.100.10  (Version: 8.0.44-ndb-8.0.44)

[mysqld(API)]   1 node(s)
id=4    @198.51.100.20  (Version: 8.0.44-ndb-8.0.44)
```

O nó SQL é referido aqui como `[mysqld(API)]`, o que reflete o fato de que o processo **mysqld** está atuando como um nó da API do NDB Cluster.

Nota

O endereço IP mostrado para um dado nó do NDB Cluster SQL ou outro nó da API no resultado de `SHOW` é o endereço usado pelo nó SQL ou da API para se conectar aos nós de dados do cluster, e não a nenhum nó de gerenciamento.

Agora, você deve estar pronto para trabalhar com bancos de dados, tabelas e dados no NDB Cluster. Consulte a Seção 25.3.5, “Exemplo de NDB Cluster com Tabelas e Dados”, para uma breve discussão.

### 25.3.5 Exemplo de aglomerado NDB com tabelas e dados

Nota

As informações desta seção se aplicam ao NDB Cluster que está sendo executado em plataformas Unix e Windows.

Trabalhar com tabelas de banco de dados e dados no NDB Cluster não difere muito de fazer isso no MySQL padrão. Há dois pontos-chave a serem lembrados:

* Para que uma tabela seja replicada no clúster, ela deve usar o mecanismo de armazenamento `NDBCLUSTER`. Para especificar isso, use a opção `ENGINE=NDBCLUSTER` ou `ENGINE=NDB` ao criar a tabela:

  ```
  CREATE TABLE tbl_name (col_name column_definitions) ENGINE=NDBCLUSTER;
  ```

Como alternativa, para uma tabela existente que utiliza um motor de armazenamento diferente, use `ALTER TABLE` para alterar a tabela para utilizar `NDBCLUSTER`:

  ```
  ALTER TABLE tbl_name ENGINE=NDBCLUSTER;
  ```

* Cada tabela `NDBCLUSTER` tem uma chave primária. Se nenhuma chave primária for definida pelo usuário quando uma tabela é criada, o mecanismo de armazenamento `NDBCLUSTER` gera automaticamente uma chave oculta. Uma chave desse tipo ocupa espaço assim como qualquer outro índice de tabela. (Não é incomum encontrar problemas devido à memória insuficiente para acomodar esses índices criados automaticamente.)

Se você está importando tabelas de um banco de dados existente usando a saída do **mysqldump**, pode abrir o script SQL em um editor de texto e adicionar a opção `ENGINE` a quaisquer declarações de criação de tabelas, ou substituir quaisquer opções existentes de `ENGINE`. Suponha que você tenha o banco de dados de amostra `world` em outro servidor MySQL que não suporte NDB Cluster e queira exportar a tabela `City`:

```
$> mysqldump --add-drop-table world City > city_table.sql
```

O arquivo resultante `city_table.sql` contém esta declaração de criação de tabela (e as declarações `INSERT` necessárias para importar os dados da tabela):

```
DROP TABLE IF EXISTS `City`;
CREATE TABLE `City` (
  `ID` int(11) NOT NULL auto_increment,
  `Name` char(35) NOT NULL default '',
  `CountryCode` char(3) NOT NULL default '',
  `District` char(20) NOT NULL default '',
  `Population` int(11) NOT NULL default '0',
  PRIMARY KEY  (`ID`)
) ENGINE=MyISAM;

INSERT INTO `City` VALUES (1,'Kabul','AFG','Kabol',1780000);
INSERT INTO `City` VALUES (2,'Qandahar','AFG','Qandahar',237500);
INSERT INTO `City` VALUES (3,'Herat','AFG','Herat',186800);
(remaining INSERT statements omitted)
```

Você precisa garantir que o MySQL use o mecanismo de armazenamento `NDBCLUSTER` para esta tabela. Existem duas maneiras de realizar isso. Uma delas é modificar a definição da tabela *antes* de importá-la no banco de dados do Cluster. Usando a tabela `City` como exemplo, modifique a opção `ENGINE` da definição da seguinte forma:

```
DROP TABLE IF EXISTS `City`;
CREATE TABLE `City` (
  `ID` int(11) NOT NULL auto_increment,
  `Name` char(35) NOT NULL default '',
  `CountryCode` char(3) NOT NULL default '',
  `District` char(20) NOT NULL default '',
  `Population` int(11) NOT NULL default '0',
  PRIMARY KEY  (`ID`)
) ENGINE=NDBCLUSTER;

INSERT INTO `City` VALUES (1,'Kabul','AFG','Kabol',1780000);
INSERT INTO `City` VALUES (2,'Qandahar','AFG','Qandahar',237500);
INSERT INTO `City` VALUES (3,'Herat','AFG','Herat',186800);
(remaining INSERT statements omitted)
```

Isso deve ser feito para a definição de cada tabela que deve fazer parte do banco de dados agrupado. A maneira mais fácil de realizar isso é fazer uma busca e substituição no arquivo que contém as definições e substituir todas as instâncias de `TYPE=engine_name` ou `ENGINE=engine_name` por `ENGINE=NDBCLUSTER`. Se você não quiser modificar o arquivo, pode usar o arquivo não modificado para criar as tabelas e, em seguida, usar `ALTER TABLE` para alterar seu mecanismo de armazenamento. Os detalhes são fornecidos mais adiante nesta seção.

Supondo que você já tenha criado um banco de dados chamado `world` no nó SQL do clúster, você pode, então, usar o cliente de linha de comando **mysql** para ler `city_table.sql`, e criar e preencher a tabela correspondente da maneira usual:

```
$> mysql world < city_table.sql
```

É muito importante ter em mente que o comando anterior deve ser executado no host onde o nó SQL está em execução (neste caso, na máquina com o endereço IP `198.51.100.20`).

Para criar uma cópia de todo o banco de dados `world` no nó SQL, use o **mysqldump** no servidor não em cluster para exportar o banco de dados para um arquivo chamado `world.sql` (por exemplo, no diretório `/tmp`). Em seguida, modifique as definições das tabelas conforme descrito e importe o arquivo no nó SQL do clúster da seguinte forma:

```
$> mysql world < /tmp/world.sql
```

Se você salvar o arquivo em um local diferente, ajuste as instruções anteriores conforme necessário.

Executar consultas `SELECT` no nó SQL não é diferente de executá-las em qualquer outra instância de um servidor MySQL. Para executar consultas a partir da linha de comando, você primeiro precisa fazer login no Monitor MySQL da maneira usual (especifique a senha `root` no prompt `Enter password:`):

```
$> mysql -u root -p
Enter password:
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 1 to server version: 8.0.44-ndb-8.0.44

Type 'help;' or '\h' for help. Type '\c' to clear the buffer.

mysql>
```

Basta usar a conta `root` do servidor MySQL e assumir que você seguiu as precauções de segurança padrão para instalar um servidor MySQL, incluindo a definição de uma senha forte `root`. Para mais informações, consulte a Seção 2.9.4, “Segurando a Conta Inicial do MySQL”.

Vale a pena considerar que os nós do NDB Cluster *não* utilizam o sistema de privilégios do MySQL ao acessá-los entre si. Definir ou alterar contas de usuário do MySQL (incluindo a conta `root`) afeta apenas as aplicações que acessam o nó SQL, e não a interação entre nós. Consulte a Seção 25.6.20.2, “NDB Cluster e Privilégios do MySQL”, para obter mais informações.

Se você não modificou as cláusulas `ENGINE` nas definições da tabela antes de importar o script SQL, você deve executar as seguintes instruções neste ponto:

```
mysql> USE world;
mysql> ALTER TABLE City ENGINE=NDBCLUSTER;
mysql> ALTER TABLE Country ENGINE=NDBCLUSTER;
mysql> ALTER TABLE CountryLanguage ENGINE=NDBCLUSTER;
```

Selecionar um banco de dados e executar uma consulta **SELECT** contra uma tabela nesse banco de dados também é feito da maneira usual, assim como sair do Monitor MySQL:

```
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

Aplicações que utilizam MySQL podem empregar APIs padrão para acessar as tabelas `NDB`. É importante lembrar que sua aplicação deve acessar o nó SQL, e não os nós de gerenciamento ou dados. Este breve exemplo mostra como podemos executar a declaração `SELECT` mostrada acima, usando a extensão `mysqli` do PHP 5.X rodando em um servidor Web em outro lugar na rede:

```
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
    printf("<p>Affected rows: %d</p>\n", $link->affected_rows);
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

### 25.3.6 Desligamento e Reinício Seguro do NDB Cluster

Para desligar o clúster, digite o seguinte comando em uma linha de comando na máquina que hospeda o nó de gerenciamento:

```
$> ndb_mgm -e shutdown
```

A opção `-e` aqui é usada para passar um comando ao cliente **ndb_mgm** a partir do shell. O comando faz com que os processos **ndb_mgm**, **ndb_mgmd** e quaisquer **ndbd** ou **ndbmtd**) sejam encerrados de forma graciosa. Qualquer nó SQL pode ser encerrado usando [**mysqladmin shutdown**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program") e outros meios. Em plataformas Windows, assumindo que você instalou o nó SQL como um serviço do Windows, você pode usar **SC STOP *`service_name`*** ou **NET STOP *`service_name`***.

Para reiniciar o clúster em plataformas Unix, execute os seguintes comandos:

* No host de gerenciamento (`198.51.100.10` em nossa configuração de exemplo):

  ```
  $> ndb_mgmd -f /var/lib/mysql-cluster/config.ini
  ```

* Em cada um dos hosts dos nós de dados (`198.51.100.30` e `198.51.100.40`):

  ```
  $> ndbd
  ```

* Use o cliente **ndb_mgm** para verificar se ambos os nós de dados iniciaram com sucesso.

* No host SQL (`198.51.100.20`):

  ```
  $> mysqld_safe &
  ```

Em plataformas Windows, assumindo que você instalou todos os processos do NDB Cluster como serviços do Windows usando os nomes de serviço padrão (consulte a Seção 25.3.2.4, “Instalando processos do NDB Cluster como serviços do Windows”), você pode reiniciar o cluster da seguinte forma:

* No host de gerenciamento (`198.51.100.10` em nossa configuração de exemplo), execute o seguinte comando:

  ```
  C:\> SC START ndb_mgmd
  ```

* Em cada um dos hosts dos nós de dados (`198.51.100.30` e `198.51.100.40`), execute o seguinte comando:

  ```
  C:\> SC START ndbd
  ```

* No nó de gerenciamento, use o cliente **ndb_mgm** para verificar se o nó de gerenciamento e ambos os nós de dados iniciaram com sucesso (consulte a Seção 25.3.2.3, “Início inicial do NDB Cluster no Windows”).

* No servidor do nó SQL (`198.51.100.20`), execute o seguinte comando:

  ```
  C:\> SC START mysql
  ```

Em um ambiente de produção, geralmente não é desejável desligar o clúster completamente. Em muitos casos, mesmo ao fazer alterações na configuração ou ao realizar atualizações no hardware ou software do clúster (ou em ambos), que exigem o desligamento de máquinas individuais, é possível fazê-lo sem desligar o clúster como um todo, realizando um reinício contínuo do clúster. Para obter mais informações sobre como fazer isso, consulte a Seção 25.6.5, “Realizando um Reinício Contínuo de um Clúster NDB”.

### 25.3.7 Atualização e Downgrading do NDB Cluster

* Versões suportadas para atualização para NDB 8.0
* Reversão de uma atualização de NDB Cluster 8.0
* Problemas conhecidos ao atualizar ou desatualizar o NDB Cluster

Esta seção fornece informações sobre o software NDB Cluster e a compatibilidade entre diferentes versões do NDB Cluster 8.0 em relação à realização de atualizações e reduções. Você já deve estar familiarizado com a instalação e configuração do NDB Cluster antes de tentar uma atualização ou redução. Consulte a Seção 25.4, “Configuração do NDB Cluster”.

Importante

Atualizações e downgrades online entre versões menores do motor de armazenamento `NDB` são suportadas no NDB 8.0. Atualizações no local do servidor MySQL incluído (nó SQL **mysqld**) também são suportadas; com vários nós SQL, é possível manter uma aplicação SQL online enquanto os processos individuais **mysqld** são reiniciados. Descargas no local do servidor MySQL incluído *não* são suportadas (consulte o Capítulo 4, *Descarregar o MySQL*).

Em alguns casos, é possível reverter uma atualização recente de uma versão de uma versão menor do NDB 8.0 para uma versão mais recente e restaurar os estados necessários de quaisquer instâncias do MySQL Server que estejam executando como nós SQL. Contra o caso de que isso se torne desejável ou necessário, é fortemente aconselhável fazer um backup completo de cada nó SQL antes de fazer a atualização do NDB Cluster. Por motivos semelhantes, você também deve iniciar os binários do **mysqld** da nova versão com `--ndb-schema-dist-upgrade-allowed=0`, e não permitir que seja definido de volta para 1 até que você esteja certo de que não há possibilidade de reverter para uma versão mais antiga. Para mais informações, consulte Reverter uma atualização de um NDB Cluster 8.0.

Para obter informações sobre as atualizações do NDB 8.0 a partir de versões anteriores ao 8.0, consulte as versões suportadas para atualização para o NDB 8.0.

Para informações sobre problemas conhecidos e problemas encontrados ao atualizar ou desatualizar o NDB 8.0, consulte Problemas Conhecidos ao Atualizar ou Desatualizar o NDB Cluster.

#### Versões suportadas para atualização para NDB 8.0

As seguintes versões do NDB Cluster são suportadas para atualizações para versões GA do NDB Cluster 8.0 (8.0.19 e versões posteriores):

* NDB Cluster 7.6: NDB 7.6.4 e versões posteriores
* NDB Cluster 7.5: NDB 7.5.4 e versões posteriores
* NDB Cluster 7.4: NDB 7.4.6 e versões posteriores

Para fazer uma atualização a partir de uma série de lançamento anterior ao NDB 7.4, você deve fazer a atualização em etapas, primeiro para uma das versões listadas acima, e depois, a partir dessa versão, para a versão mais recente do NDB 8.0. Nesses casos, é recomendado fazer a atualização para a versão mais recente do NDB 7.6 como o primeiro passo. Para informações sobre atualizações do NDB 7.6 a partir de versões anteriores, consulte Atualizando e Desatualizando o NDB 7.6.

#### Revertendo uma atualização de um NDB Cluster 8.0

Após uma atualização recente de software de um NDB Cluster para uma versão NDB 8.0, é possível reverter o software `NDB` para a versão anterior, desde que certas condições sejam atendidas antes da atualização, durante o tempo em que o cluster está executando a versão mais recente e após o software do NDB Cluster ser revertido para a versão anterior. Os detalhes dependem das condições locais; esta seção fornece informações gerais sobre o que deve ser feito em cada um dos pontos do processo de atualização e reversão descrito acima.

Na maioria dos casos, a atualização e a desatualização dos nós de dados podem ser feitas sem problemas, conforme descrito em outros lugares; veja a Seção 25.6.5, “Realizando um Reinício Rotativo de um NDB Cluster”. (Antes de realizar uma atualização ou desatualização, você deve realizar um backup `NDB`; veja a Seção 25.6.8, “Backup Online de NDB Cluster”, para obter informações sobre como fazer isso.) A desatualização dos nós SQL online não é suportada, devido aos seguintes problemas:

* O **mysqld** de uma versão 8.0 não pode ser iniciado se detectar um sistema de arquivos de uma versão mais recente do MySQL.

* Em muitos casos, o **mysqld** não consegue abrir tabelas que foram criadas ou modificadas por uma versão posterior do MySQL.

* Na maioria, se não em todos os casos, o **mysqld** não consegue ler arquivos de registro binários que foram criados ou modificados em uma versão mais recente do MySQL.

O procedimento descrito a seguir fornece as etapas básicas necessárias para atualizar um clúster da versão *`X`* para a versão *`Y`*, permitindo uma possível reversão futura para *`X`*. (O procedimento para reverter o clúster atualizado para a versão *`X`* é seguido mais adiante nesta seção.) Para este propósito, a versão *`X`* é qualquer versão GA do NDB 8.0, ou qualquer versão anterior do NDB que seja compatível com a atualização para o NDB 8.0 (consulte Versões compatíveis para atualização para o NDB 8.0), e a versão *`Y`* é uma versão do NDB 8.0 que é posterior a *`X`*.

* *Antes da atualização*: Faça backups dos estados dos nós SQL NDB *`X`*. Isso pode ser feito de uma ou mais das seguintes formas:

+ Uma cópia do sistema de arquivos do nó de banco de dados da versão *`X`* em estado de repouso, usando uma ou mais ferramentas do sistema, como **cp**, **rsync**, **fwbackups**, Amanda, e assim por diante.

Um dump de qualquer versão das tabelas *`X`* que não estão armazenadas em `NDB`. Você pode gerar esse dump usando **mysqldump**.

Um backup criado usando o MySQL Enterprise Backup; consulte a Seção 32.1, “MySQL Enterprise Backup Overview”, para mais informações.

Recomenda-se fazer backup dos nós SQL antes de qualquer atualização, independentemente de você pretender ou não reverter o clúster para a versão anterior do `NDB` posteriormente.

* *Atualize para NDB *`Y`*: Todos os binários do *`Y`* **mysqld** do NDB devem ser iniciados com `--ndb-schema-dist-upgrade-allowed=0` para evitar qualquer atualização automática do esquema. (Uma vez que qualquer possibilidade de downgrade tenha passado, você pode, com segurança, alterar a variável de sistema correspondente `ndb_schema_dist_upgrade_allowed` de volta para 1, o padrão, no cliente **mysql*.) Quando cada nó SQL do NDB *`Y`* começa, ele se conecta ao clúster e sincroniza seus esquemas de tabela `NDB`. Após isso, você pode restaurar os dados da tabela e do estado do MySQL a partir do backup.

Para garantir a continuidade da replicação do NDB, é necessário atualizar os nós SQL do cluster de tal forma que pelo menos um **mysqld** esteja atuando como fonte de replicação em qualquer momento durante a atualização. Com dois nós SQL *`A`* e *`B`*, você pode fazer isso da seguinte forma:

1. Ao usar o nó SQL *`B`* como o canal de replicação, atualize o nó SQL *`A`* da versão NDB *`X`* para a versão *`Y`*. Isso resulta em uma lacuna no log binário em *`A`* na época *`E1`*.

2. Após todos os aplicadores de replicação consumirem o log binário do nó SQL *`B`* após a época *`E1`*, mude o canal de replicação para usar o nó SQL *`A`*.

3. Atualize o nó SQL *`B`* para a versão NDB *`Y`*. Isso resulta em uma lacuna no log binário em *`B`* na época *`E2`*.

4. Após todos os aplicadores de replicação consumirem o log binário do nó SQL *`A`* após a época *`E2`*, você pode, novamente, alternar o canal de replicação para usar qualquer um dos nós SQL conforme desejar.

Não use `ALTER TABLE` em nenhuma tabela existente `NDB`; não crie nenhuma nova tabela `NDB` que não possa ser descartada com segurança antes da desvalorização.

O procedimento a seguir mostra os passos básicos necessários para reverter (reverter) um NDB Cluster da versão *`X`* para a versão *`Y`* após uma atualização realizada como a descrita acima. Aqui, a versão *`X`* é qualquer versão GA do NDB 8.0, ou qualquer versão anterior do NDB que seja compatível com a atualização para o NDB 8.0 (consulte Versões compatíveis para atualização para o NDB 8.0); a versão *`Y`* é uma versão do NDB 8.0 que é posterior a *`X`*.

* *Antes do rollback*: Reúna todas as informações de estado do **mysqld** dos nós SQL NDB *`Y`* que devem ser mantidas. Na maioria dos casos, você pode fazer isso usando **mysqldump**.

Após fazer o backup dos dados do estado, descarte todas as tabelas `NDB` que foram criadas ou alteradas desde que a atualização ocorreu.

Fazer backup dos nós SQL é sempre recomendado antes de qualquer mudança na versão do software do NDB Cluster.

Você deve fornecer um sistema de arquivos compatível com o MySQL *`X`* para cada **mysqld** (nó SQL). Você pode usar qualquer um dos dois métodos a seguir:

+ Crie um novo estado de sistema de arquivos compatível, reiniciando o estado no disco do nó SQL da versão *`X`*. Você pode fazer isso removendo o sistema de arquivos do nó SQL, em seguida, executando o **mysqld** `--initialize`.

+ Restaure um sistema de arquivos compatível a partir de um backup feito antes da atualização (consulte a Seção 9.4, “Usando mysqldump para backups”).

* *Após a desvalorização de `NDB`*: Após desvalorizar os nós de dados para NDB *`X`*, inicie os nós SQL da versão *`X`* (instâncias do **mysqld**). Restaure ou repare qualquer outra informação de estado local necessária em cada nó SQL. O estado MySQLD pode ser alinhado conforme necessário com alguma combinação (0 ou mais) das seguintes ações:

+ comandos de inicialização, como **mysqld** `--initialize`.

+ Restaure as informações de estado desejadas ou necessárias capturadas a partir do nó SQL da versão *`X`*.

+ Restaure as informações de estado desejadas ou necessárias capturadas a partir do nó SQL da versão *`Y`*.

+ Realize a limpeza, como a exclusão de logs obsoletos, como logs binários, ou logs de retransmissão, e remova qualquer estado dependente do tempo que não seja mais válido.

Assim como ao fazer uma atualização, é necessário, ao fazer uma atualização para uma versão anterior, manter a continuidade da replicação do NDB, para que, ao menos um **mysqld** esteja atuando como fonte de replicação em qualquer momento durante o processo de atualização. Isso pode ser feito de uma maneira muito semelhante àquela descrita anteriormente para a atualização dos nós SQL. Com dois nós SQL *`A`* e *`B`*, você pode manter o registro binário sem lacunas durante a atualização da seguinte forma:

1. Com o nó SQL *`B`* atuando como o canal de replicação, desça o nó SQL *`A`* da versão NDB *`Y`* para a versão *`X`*. Isso resulta em uma lacuna no log binário em *`A`* na época *`F1`*.

2. Após todos os aplicadores de replicação consumirem o log binário do nó SQL *`B`* após a época *`F1`*, mude o canal de replicação para usar o nó SQL *`A`*.

3. Desdém o nó SQL *`B`* para a versão NDB *`X`*. Isso resulta em uma lacuna no log binário em *`B`* na época *`F2`*.

4. Após todos os aplicadores de replicação consumirem o log binário do nó SQL *`A`* após a época *`F2`*, a redundância do registro binário é restaurada e você pode usar novamente qualquer um dos nós SQL como o canal de replicação conforme desejado.

Veja também a Seção 25.7.7, “Usando dois canais de replicação para replicação de NDB Cluster”.

#### Problemas Conhecidos Ao Atualizar ou Desfazer a Atualização do NDB Cluster

Nesta seção, forneça informações sobre os problemas que são conhecidos para ocorrer ao atualizar ou desatualizar para, a partir de ou entre as versões do NDB 8.0.

Recomendamos que você não tente realizar alterações em nenhum esquema durante qualquer atualização ou downgrade do software do NDB Cluster. Algumas das razões para isso estão listadas aqui:

* As declarações DDL sobre as tabelas `NDB` não são possíveis durante algumas fases do início do nó de dados.

* As declarações DDL sobre as tabelas `NDB` podem ser rejeitadas se quaisquer nós de dados forem interrompidos durante a execução; é necessário interromper cada nó binário de dados (para que possa ser substituído por um binário da versão alvo) como parte do processo de atualização ou redução.

* As declarações DDL sobre as tabelas `NDB` não são permitidas enquanto houver nós de dados no mesmo clúster executando diferentes versões de liberação do software NDB Cluster.

Para obter informações adicionais sobre o procedimento de reinício contínuo usado para realizar uma atualização ou uma redução de dados online dos nós de dados, consulte a Seção 25.6.5, “Realizando um Reinício Contínuo de um NDB Cluster”.

Você deve estar ciente dos problemas na lista a seguir ao realizar uma atualização online entre versões menores do NDB 8.0. Esses problemas também se aplicam ao fazer uma atualização a partir de uma versão anterior do NDB Cluster para qualquer uma das versões do NDB 8.0 mencionadas.

* O NDB 8.0.22 adiciona suporte para endereçamento IPv6 para nós de gerenciamento e nós de dados no arquivo `config.ini`. Para começar a usar endereços IPv6 como parte de uma atualização, siga os passos a seguir:

1. Realize uma atualização do clúster para a versão 8.0.22 ou uma versão posterior do software NDB Cluster, da maneira usual.

2. Altere os endereços usados no arquivo `config.ini` para endereços IPv6.

3. Realize um reinício do sistema do clúster.

Um problema conhecido nas plataformas Linux ao executar o NDB 8.0.22 e versões posteriores era que o kernel do sistema operacional precisava fornecer suporte ao IPv6, mesmo quando não havia endereços IPv6 em uso. Esse problema é corrigido no NDB 8.0.34 e versões posteriores (Bug #33324817, Bug #33870642).

Se você está usando uma versão afetada e deseja desativar o suporte para IPv6 no sistema (porque não planeja usar nenhuma endereço IPv6 para os nós do NDB Cluster), faça isso após inicializar o sistema, da seguinte forma:

  ```
  $> sysctl -w net.ipv6.conf.all.disable_ipv6=1
  $> sysctl -w net.ipv6.conf.default.disable_ipv6=1
  ```

(Como alternativa, você pode adicionar as linhas correspondentes a `/etc/sysctl.conf`.). No NDB Cluster 8.0.34 e versões posteriores, o que foi mencionado anteriormente não é necessário e você pode simplesmente desabilitar o suporte ao IPv6 no kernel Linux se não desejar ou precisar disso.

* Devido às alterações na tabela interna `mysql.ndb_schema`, se você atualizar para uma versão do NDB 8.0 anterior à 8.0.24, é recomendável usar `--ndb-schema-dist-upgrade-allowed = 0` (mysql-cluster-options-variables.html#sysvar_ndb_schema_dist_upgrade_allowed) para evitar interrupções inesperadas (Bug #30876990, Bug #31016905).

Além disso, se houver alguma possibilidade de que você possa retornar a uma versão anterior do NDB Cluster após uma atualização para uma versão mais recente, você deve iniciar todos os processos do **mysqld** a partir da versão mais recente com `--ndb-schema-dist-upgrade-allowed = 0` para evitar que alterações incompatíveis com a versão mais antiga sejam feitas na tabela `ndb_schema`. Consulte Reverter uma atualização do NDB Cluster 8.0, para obter informações sobre como fazer isso.

* O parâmetro de configuração `EncryptedFileSystem`, introduzido no NDB 8.0.29, em alguns casos, pode fazer com que os arquivos de registro desfazerem-se sejam criptografados, mesmo quando definido explicitamente para `0`, o que pode levar a problemas ao usar tabelas de Dados de disco e tentar fazer uma atualização ou uma redução para o NDB 8.0.29. Nesses casos, você pode contornar o problema realizando reinicializações iniciais dos nós de dados como parte do processo de reinicialização contínua.

* Se você estiver usando nós de dados multithread (**ndbmtd**")) e o parâmetro de configuração `ThreadConfig`, você pode precisar fazer alterações no conjunto de valores para isso no arquivo `config.ini` ao fazer uma atualização de uma versão anterior para o NDB 8.0.30 ou posterior. Ao fazer uma atualização do NDB 8.0.23 ou anterior, qualquer uso de threads `main`, `rep`, `recv` ou `ldm` que estava implícito na versão anterior deve ser definido explicitamente. Ao fazer uma atualização do NDB 8.0.23 ou posterior para o NDB 8.0.30 ou posterior, qualquer uso de threads `recv` deve ser definido explicitamente na string `ThreadConfig`. Além disso, para evitar o uso de threads `main`, `rep` ou `ldm` no NDB 8.0.30 ou posterior, você deve definir o número de threads para o tipo dado explicitamente para `0`.

Segue-se um exemplo.

*NDB 8.0.22 e versões anteriores*:

O arquivo `config.ini` contém `ThreadConfig=ldm`.

+ Essas versões de `NDB` são interpretadas como `ThreadConfig=main,ldm,recv,rep` nesses textos.

+ Requerido em `config.ini` para corresponder ao efeito no NDB 8.0.30 ou posterior: `ThreadConfig=main,ldm,recv,rep`.

*NDB 8.0.23—8.0.29*:

O arquivo `config.ini` contém `ThreadConfig=ldm`.

+ Essas versões de `NDB` são interpretadas como `ThreadConfig=ldm,recv` nesses textos.

+ Requerido em `config.ini` para corresponder ao efeito no NDB 8.0.30 ou posterior: `ThreadConfig=main={count=0},ldm,recv,rep={count=0}`.

Para mais informações, consulte a descrição do parâmetro de configuração `ThreadConfig`.

As atualizações das versões anteriores das principais versões do NDB Cluster (7.4, 7.5, 7.6) para o NDB 8.0 são suportadas; consulte Versões suportadas para atualização para NDB 8.0, para versões específicas. Tais atualizações estão sujeitas aos problemas listados aqui:

* No NDB 8.0, o valor padrão para `log_bin` é 1, uma mudança em relação às versões anteriores. Além disso, a partir do NDB 8.0.16, o valor padrão para `ndb_log_bin` mudou de 1 para 0, o que significa que `ndb_log_bin` deve ser definido explicitamente como 1 para habilitar o registro binário nesta e em versões posteriores.

* Os privilégios distribuídos compartilhados entre os servidores MySQL, conforme implementado nas séries de lançamentos anteriores (consulte Privilegios Distribuídos Usando Tabelas de Concessão Compartilhada), não são suportados no NDB Cluster 8.0. Ao ser iniciado, o **mysqld** fornecido com o NDB 8.0 e versões posteriores verifica a existência de quaisquer tabelas de concessão que utilizem o mecanismo de armazenamento `NDB`; se encontrar alguma, cria cópias locais (“tabelas sombra”) dessas usando `InnoDB`. Isso é verdade para cada servidor MySQL conectado ao NDB Cluster. Após isso ter sido realizado em todos os servidores MySQL que atuam como nós SQL do NDB Cluster, as tabelas de concessão `NDB` podem ser removidas com segurança usando o utilitário **ndb_drop_table** fornecido com a distribuição do NDB Cluster, da seguinte forma:

  ```
  ndb_drop_table -d mysql user db columns_priv tables_priv proxies_priv procs_priv
  ```

É seguro manter as tabelas de concessão do `NDB`, mas elas não são usadas para controle de acesso e são efetivamente ignoradas.

Para mais informações sobre o sistema de privilégios do MySQL utilizado no NDB 8.0, consulte a Seção 25.6.13, “Sincronização de privilégios e NDB_STORED_USER”, bem como a Seção 8.2.3, “Tabelas de concessão”.

* É necessário reiniciar todos os nós de dados com `--initial` ao atualizar qualquer versão anterior ao NDB 7.6 para qualquer versão do NDB 8.0. Isso ocorre devido à adição do suporte para um número maior de nós no NDB 8.0.

Os problemas encontrados ao tentar fazer uma desativação de NDB 8.0 para uma versão anterior podem ser encontrados na lista a seguir:

* As tabelas criadas no NDB 8.0 não são compatíveis com versões anteriores do NDB 7.6 devido a uma mudança no uso da propriedade de metadados extras implementada pelas tabelas `NDB` para fornecer suporte completo ao dicionário de dados MySQL. Isso significa que é necessário tomar medidas adicionais para preservar qualquer informação de estado desejada dos nós SQL do cluster antes do downgrade e, em seguida, restaurá-la posteriormente.

Mais especificamente, as atualizações online do motor de armazenamento `NDBCLUSTER`—ou seja, dos nós de dados—são suportadas, mas os nós SQL não podem ser atualizados online. Isso ocorre porque um servidor MySQL (**mysqld**) de uma versão MySQL 8.0 ou anterior específica não pode usar arquivos do sistema de uma versão (posterior) 8.0 e não pode abrir tabelas que foram criadas na versão posterior. É possível reverter um clúster que foi recentemente atualizado a partir de uma versão anterior do NDB; consulte Reverter um Upgrade de NDB Cluster 8.0, para obter informações sobre quando e como isso pode ser feito.

Para informações adicionais relacionadas a esses tópicos, consulte Alterações no metadados extras da tabela NDB; consulte também o Capítulo 16, *Dicionário de Dados MySQL*.

* No NDB 8.0, o formato de arquivo de configuração binário foi aprimorado para oferecer suporte a um maior número de nós do que nas versões anteriores. O novo formato não é acessível aos nós que executam versões mais antigas do `NDB`, embora os servidores de gerenciamento mais recentes possam detectar nós mais antigos e se comunicar com eles usando o formato apropriado.

Embora as atualizações do NDB 8.0 não devam ser problemáticas nesse aspecto, os servidores de gerenciamento mais antigos não podem ler o novo formato de arquivo de configuração binário, portanto, é necessária alguma intervenção manual ao fazer uma desativação do NDB 8.0 para uma versão anterior da versão principal. Ao realizar essa desativação, é necessário remover quaisquer arquivos de configuração binários cacheados antes de iniciar o gerenciamento usando a versão mais antiga do software `NDB`, e ter o arquivo de configuração em texto claro disponível para o servidor de gerenciamento ler. Alternativamente, você pode iniciar o servidor de gerenciamento mais antigo usando a opção `--initial` (novamente, é necessário ter o `config.ini` disponível). Se o clúster usa vários servidores de gerenciamento, uma dessas duas coisas deve ser feita para cada arquivo binário do servidor de gerenciamento.

Além disso, em relação ao suporte para um número maior de nós, e devido às alterações incompatíveis implementadas no NDB 8.0 no nó de dados LCP `Sysfile`, é necessário, ao realizar uma atualização online de NDB 8.0 para uma versão anterior principal, reiniciar todos os nós de dados usando a opção `--initial`.

* Descerragens online de clústeres que executam mais de 48 nós de dados ou com nós de dados que utilizam IDs de nó maiores que 48, para versões anteriores do NDB Cluster, a partir do NDB 8.0, não são suportadas. É necessário, nesses casos, reduzir o número de nós de dados, alterar as configurações para todos os nós de dados de modo que eles utilizem IDs de nó menores ou iguais a 48, ou ambos, conforme necessário, para não exceder os antigos máximos.

* Se você está fazendo uma atualização para uma versão mais antiga do NDB 8.0 para o NDB 7.5 ou NDB 7.4, você deve definir um valor explícito para `IndexMemory` no arquivo de configuração do clúster, se ainda não estiver presente. Isso ocorre porque o NDB 8.0 não usa este parâmetro (que foi removido no NDB 7.6) e o define como 0 por padrão, enquanto é necessário no NDB 7.5 e NDB 7.4, nos quais o clúster se recusa a iniciar com Configuração Inválida recebida do Servidor de Gerenciamento... se `IndexMemory` não estiver definido para um valor não nulo.

A definição de `IndexMemory` *não é* necessária para as reduções de NDB 8.0 para NDB 7.6.

### 25.3.8 O Cluster Auto-Instalador do NDB (NÃO MAIS APOIADO)

Nota

Esse recurso foi removido do NDB Cluster e não é mais suportado. Consulte a Seção 25.2.4, “O que há de novo no MySQL NDB Cluster 8.0”, para obter mais informações.

O instalador gráfico baseado na web (Auto-Installer) foi removido no NDB 8.0.23 e não está mais incluído como parte da distribuição do NDB Cluster.