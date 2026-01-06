#### 21.3.1.2 Instalar o NDB Cluster a partir do RPM

Esta seção abrange os passos necessários para instalar os executáveis corretos para cada tipo de nó do NDB Cluster usando pacotes RPM fornecidos pela Oracle.

Como alternativa ao método descrito nesta seção, a Oracle oferece Repositórios MySQL para o NDB Cluster 7.5.6 e versões posteriores, que são compatíveis com muitas distribuições Linux comuns. Dois repositórios, listados aqui, estão disponíveis para distribuições baseadas em RPM:

- Para distribuições que utilizam **yum** ou **dnf**, você pode usar o Repositório Yum do MySQL para o NDB Cluster. Consulte *Instalando o MySQL NDB Cluster usando o Repositório Yum*, para obter instruções e informações adicionais.

- Para o SLES, você pode usar o Repositório MySQL SLES para o NDB Cluster. Consulte \[*Instalando o NDB Cluster MySQL usando o Repositório SLES*] (/doc/mysql-sles-repo-quick-guide/pt/#repo-qg-sles-fresh-cluster-install), para obter instruções e informações adicionais.

Os RPMs estão disponíveis tanto para plataformas Linux de 32 bits quanto de 64 bits. Os nomes de arquivo desses RPMs seguem o seguinte padrão:

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

*`license`* indica se o RPM faz parte de uma versão comercial ou comunitária do NDB Cluster. No restante desta seção, assumimos, para os exemplos, que você está instalando uma versão comunitária.

Os valores possíveis para *`component`*, com descrições, podem ser encontrados na tabela a seguir:

**Tabela 21.5 Componentes da distribuição RPM do NDB Cluster**

<table><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Componente</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CODE_<code class="literal">libs</code>]</td> <td>Programa de instalador automático do NDB Cluster (DESUSO); veja<a class="xref" href="mysql-cluster-install-auto.html" title="21.3.8 O instalador automático do NDB Cluster (NDB 7.5) (já não é suportado)">Seção 21.3.8, “O instalador automático do NDB Cluster (NDB 7.5) (já não é suportado)”</a>, para uso</td> </tr><tr> <td>[[PH_HTML_CODE_<code class="literal">libs</code>]</td> <td>Programas de cliente MySQL e [[PH_HTML_CODE_<code class="literal">management-server</code>]; inclui<a class="link" href="mysql.html" title="4.5.1 mysql — O cliente de linha de comando do MySQL"><span class="command"><strong>mysql</strong></span></a>cliente,<a class="link" href="mysql-cluster-programs-ndb-mgm.html" title="21.5.5 ndb_mgm — O cliente de gerenciamento de cluster NDB"><span class="command"><strong>ndb_mgm</strong></span></a>cliente e outras ferramentas do cliente</td> </tr><tr> <td>[[PH_HTML_CODE_<code class="literal">memcached</code>]</td> <td>Conjunto de caracteres e informações de mensagem de erro necessárias pelo servidor MySQL</td> </tr><tr> <td>[[PH_HTML_CODE_<code class="literal">ndbmemcache</code>]</td> <td><a class="link" href="mysql-cluster-programs-ndbd.html" title="21.5.1 ndbd — O daemon do nó de dados do clúster NDB"><span class="command"><strong>ndbd</strong></span></a>e<a class="link" href="mysql-cluster-programs-ndbmtd.html" title="21.5.3 ndbmtd — O daemon do nó de dados do cluster NDB (multi-threaded)"><span class="command"><strong>ndbmtd</strong></span></a>binários de nós de dados</td> </tr><tr> <td>[[PH_HTML_CODE_<code class="literal">minimal-debuginfo</code>]</td> <td>Cabeçalhos e arquivos de biblioteca necessários para o desenvolvimento do cliente MySQL</td> </tr><tr> <td>[[PH_HTML_CODE_<code class="literal">ndbclient</code>]</td> <td>Servidor MySQL embutido</td> </tr><tr> <td>[[PH_HTML_CODE_<code class="literal">NDB</code>]</td> <td>Servidor MySQL embutido compatível com versões anteriores</td> </tr><tr> <td>[[PH_HTML_CODE_<code class="literal">libndbclient</code>]</td> <td>Arquivos de cabeçalho e de biblioteca para o desenvolvimento de aplicações para MySQL embutido</td> </tr><tr> <td>[[PH_HTML_CODE_<code class="literal">ndbclient-devel</code>]</td> <td>Arquivos JAR necessários para o suporte de aplicativos ClusterJ</td> </tr><tr> <td>[[<code class="literal">libs</code>]]</td> <td>Bibliotecas de clientes MySQL</td> </tr><tr> <td>[[<code class="literal">client</code><code class="literal">libs</code>]</td> <td>Bibliotecas de clientes MySQL compatíveis com versões anteriores</td> </tr><tr> <td>[[<code class="literal">management-server</code>]]</td> <td>O servidor de gerenciamento do NDB Cluster (<a class="link" href="mysql-cluster-programs-ndb-mgmd.html" title="21.5.4 ndb_mgmd — O daemon do servidor de gerenciamento de cluster NDB"><span class="command"><strong>ndb_mgmd</strong></span></a>)</td> </tr><tr> <td>[[<code class="literal">memcached</code>]]</td> <td>Arquivos necessários para suportar [[<code class="literal">ndbmemcache</code>]]</td> </tr><tr> <td>[[<code class="literal">minimal-debuginfo</code>]]</td> <td>Informações de depuração para o servidor de pacotes server-minimal; úteis ao desenvolver aplicativos que utilizam este pacote ou ao depurar este pacote</td> </tr><tr> <td>[[<code class="literal">ndbclient</code>]]</td> <td>biblioteca de clientes [[<code class="literal">NDB</code>]] para execução de aplicativos da API NDB e da API MGM ([[<code class="literal">libndbclient</code>]])</td> </tr><tr> <td>[[<code class="literal">ndbclient-devel</code>]]</td> <td>Cabeçalho e outros arquivos necessários para o desenvolvimento de aplicativos da API NDB e da API MGM</td> </tr><tr> <td>[[<code class="literal">NDB</code><code class="literal">libs</code>]</td> <td>Arquivos necessários para configurar o suporte Node.JS para o NDB Cluster</td> </tr><tr> <td>[[<code class="literal">NDB</code><code class="literal">libs</code>]</td> <td>O servidor MySQL (<a class="link" href="mysqld.html" title="4.3.1 mysqld — O Servidor MySQL"><span class="command"><strong>mysqld</strong></span></a>) com suporte ao mecanismo de armazenamento [[<code class="literal">NDB</code><code class="literal">management-server</code>] incluído e programas associados ao servidor MySQL</td> </tr><tr> <td>[[<code class="literal">NDB</code><code class="literal">memcached</code>]</td> <td>Instalação mínima do servidor MySQL para NDB e ferramentas relacionadas</td> </tr><tr> <td>[[<code class="literal">NDB</code><code class="literal">ndbmemcache</code>]</td> <td><span class="command"><strong>mysqltest</strong></span>, outros programas de teste do MySQL e arquivos de suporte</td> </tr></tbody></table>

Também está disponível um único pacote (arquivo `.tar`) de todos os RPMs do NDB Cluster para uma determinada plataforma e arquitetura. O nome deste arquivo segue o padrão mostrado aqui:

```sql
mysql-cluster-license-ver-rev.distro.arch.rpm-bundle.tar
```

Você pode extrair os arquivos RPM individuais deste arquivo usando **tar** ou sua ferramenta preferida para extrair arquivos.

Os componentes necessários para instalar os três principais tipos de nós do NDB Cluster estão listados na seguinte tabela:

- *Núcleo de gerenciamento*: `servidor de gerenciamento`

- *Núcleo de dados*: `nº de dados`

- - Nó SQL\*: `server` e `common`

Além disso, o RPM `client` deve ser instalado para fornecer o cliente de gerenciamento **ndb\_mgm** em pelo menos um nó de gerenciamento. Você também pode querer instalá-lo em nós SQL, para ter o **mysql** e outros programas de cliente MySQL disponíveis nesses. Discutiremos a instalação de nós por tipo mais adiante nesta seção.

*`ver`* representa o número de versão do motor de armazenamento `NDB` em três partes no formato `7.6.*``x`, mostrado como `7.6.35` nos exemplos. `rev` fornece o número de revisão do RPM no formato *`major`.*`minor`\*. Nos exemplos mostrados nesta seção, usamos `1.1` para esse valor.

O *`distro`* (distribuição Linux) é um dos `rhel5` (Oracle Linux 5, Red Hat Enterprise Linux 4 e 5), `el6` (Oracle Linux 6, Red Hat Enterprise Linux 6), `el7` (Oracle Linux 7, Red Hat Enterprise Linux 7) ou `sles12` (SUSE Enterprise Linux 12). Para os exemplos nesta seção, assumimos que o host executa o Oracle Linux 7, Red Hat Enterprise Linux 7 ou o equivalente (`el7`).

*`arch`* é `i686` para RPMs de 32 bits e `x86_64` para versões de 64 bits. Nos exemplos mostrados aqui, assumimos uma plataforma de 64 bits.

O número da versão do NDB Cluster nos nomes dos arquivos RPM (mostrado aqui como `7.6.35`) pode variar de acordo com a versão que você está realmente usando. *É muito importante que todos os RPMs do Cluster instalados tenham o mesmo número de versão*. A arquitetura também deve ser adequada à máquina em que o RPM será instalado; em particular, você deve ter em mente que os RPMs de 64 bits (`x86_64`) não podem ser usados com sistemas operacionais de 32 bits (use `i686` para este último).

**Nodos de dados.** Em um computador que deve hospedar um nó de dados de NDB Cluster, é necessário instalar apenas o RPM `data-node`. Para fazer isso, copie este RPM para o host do nó de dados e execute o seguinte comando como usuário root do sistema, substituindo o nome mostrado para o RPM conforme necessário para corresponder ao do RPM baixado do site da MySQL:

```sql
$> rpm -Uhv mysql-cluster-community-data-node-7.6.35-1.el7.x86_64.rpm
```

Isso instala os binários dos nós de dados **ndbd** e **ndbmtd** no `/usr/sbin`. Qualquer um desses pode ser usado para executar um processo de nó de dados neste host.

**Nodos SQL.** Copie os RPMs `server` e `common` para cada máquina que será usada para hospedar um nó SQL de NDB Cluster (`server` requer `common`). Instale o RPM `server` executando o seguinte comando como usuário root do sistema, substituindo o nome mostrado para o RPM conforme necessário para corresponder ao nome do RPM baixado do site da MySQL:

```sql
$> rpm -Uhv mysql-cluster-community-server-7.6.35-1.el7.x86_64.rpm
```

Isso instala o binário do servidor MySQL (**mysqld**), com suporte ao mecanismo de armazenamento `NDB`, no diretório `/usr/sbin`. Ele também instala todos os arquivos de suporte necessários do MySQL Server e programas úteis do servidor MySQL, incluindo os scripts de inicialização **mysql.server** e **mysqld\_safe** (em `/usr/share/mysql` e `/usr/bin`, respectivamente). O instalador RPM deve cuidar automaticamente de problemas de configuração geral (como a criação do usuário e grupo `mysql`, se necessário).

Importante

Você deve usar as versões desses RPMs lançadas para o NDB Cluster; as versões lançadas para o servidor MySQL padrão não fornecem suporte ao mecanismo de armazenamento `NDB`.

Para administrar o nó SQL (servidor MySQL), você também deve instalar o RPM `client`, conforme mostrado aqui:

```sql
$> rpm -Uhv mysql-cluster-community-client-7.6.35-1.el7.x86_64.rpm
```

Isso instala o cliente **mysql** e outros programas do cliente MySQL, como **mysqladmin** e **mysqldump**, no `/usr/bin`.

**Nodos de gerenciamento.** Para instalar o servidor de gerenciamento do NDB Cluster, é necessário usar apenas o RPM `management-server`. Copie este RPM para o computador que será o hospedeiro do nó de gerenciamento e, em seguida, instale-o executando o seguinte comando como usuário root do sistema (substitua o nome mostrado para o RPM conforme necessário para corresponder ao do RPM `management-server` baixado do site da MySQL):

```sql
$> rpm -Uhv mysql-cluster-community-management-server-7.6.35-1.el7.x86_64.rpm
```

Este RPM instala o binário do servidor de gerenciamento **ndb\_mgmd** no diretório `/usr/sbin`. Embora este seja o único programa realmente necessário para executar um nó de gerenciamento, também é uma boa ideia ter o cliente de gerenciamento do NDB Cluster **ndb\_mgm** disponível também. Você pode obter este programa, bem como outros programas de cliente `NDB`, como **ndb\_desc** e **ndb\_config**, instalando o RPM `client` conforme descrito anteriormente.

Nota

Anteriormente, o **ndb\_mgm** era instalado pelo mesmo RPM usado para instalar o servidor de gerenciamento. No NDB 7.5 (e versões posteriores), todos os programas de cliente `NDB` são obtidos a partir do mesmo RPM `client` que instala **mysql** e outros clientes MySQL.

Consulte Seção 2.5.5, “Instalando o MySQL no Linux Usando Pacotes RPM da Oracle” para obter informações gerais sobre a instalação do MySQL usando RPMs fornecidos pela Oracle.

Após a instalação a partir do RPM, você ainda precisa configurar o cluster; consulte Seção 21.3.3, “Configuração Inicial do NDB Cluster” para obter as informações relevantes.

Consulte a Seção 2.5.5, “Instalando o MySQL no Linux Usando Pacotes RPM da Oracle” para obter informações gerais sobre a instalação do MySQL usando RPMs fornecidos pela Oracle. Consulte a Seção 21.3.3, “Configuração Inicial do NDB Cluster” para obter informações sobre a configuração pós-instalação necessária.
