#### 25.3.1.2 Instalando o NDB Cluster a partir do RPM

Esta seção abrange os passos necessários para instalar os executáveis corretos para cada tipo de nó do NDB Cluster usando pacotes RPM fornecidos pela Oracle.

Como alternativa ao método descrito nesta seção, a Oracle fornece Repositórios MySQL para o NDB Cluster que são compatíveis com muitas distribuições Linux comuns. Dois repositórios, listados aqui, estão disponíveis para distribuições baseadas em RPM:

* Para distribuições que usam **yum** ou **dnf**, você pode usar o Repositório MySQL Yum para NDB Cluster. Veja *Instalando o NDB Cluster MySQL Usando o Repositório Yum*, para instruções e informações adicionais.

* Para SLES, você pode usar o Repositório MySQL SLES para NDB Cluster. Veja *Instalando o NDB Cluster MySQL Usando o Repositório SLES*, para instruções e informações adicionais.

Os RPMs estão disponíveis tanto para plataformas Linux de 32 bits quanto de 64 bits. Os nomes dos arquivos desses RPMs usam o seguinte padrão:

```
mysql-cluster-community-data-node-9.4.0-1.el7.x86_64.rpm

mysql-cluster-license-component-ver-rev.distro.arch.rpm

    license:= {commercial | community}

    component: {management-server | data-node | server | client | other—see text}

    ver: major.minor.release

    rev: major[.minor]

    distro: {el6 | el7 | sles12}

    arch: {i686 | x86_64}
```

*`license`* indica se o RPM faz parte de uma versão Comercial ou Comunitária do NDB Cluster. No restante desta seção, assumimos, para os exemplos, que você está instalando uma versão Comunitária.

Os valores possíveis para *`component`*, com descrições, podem ser encontrados na tabela a seguir:

**Tabela 25.5 Componentes da distribuição RPM do NDB Cluster**

<table><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Componente</th> <th>Descrição</th> </tr></thead><tbody><tr> <td><code>auto-installer</code> (DESAPARECIDO)</td> <td>Programa de Auto-Instalador do NDB Cluster; consulte O Auto-Instalador do NDB Cluster (NÃO MAIS APOIADO), para uso</td> </tr><tr> <td><code>client</code></td> <td>Programas de cliente MySQL e <code>NDB</code>; inclui o cliente <span><strong>mysql</strong></span>, o cliente <span><strong>ndb_mgm</strong></span> e outras ferramentas de cliente</td> </tr><tr> <td><code>common</code></td> <td>Informações sobre o conjunto de caracteres e mensagens de erro necessárias pelo servidor MySQL</td> </tr><tr> <td><code>data-node</code></td> <td>Binários do nó de dados do NDB Cluster (<span><strong>ndbd</strong></span>) e <span><strong>ndbmtd</strong></span> e outros binários de nó de dados</td> </tr><tr> <td><code>devel</code></td> <td>Cabeçalhos e arquivos de biblioteca necessários para o desenvolvimento de aplicativos do cliente MySQL</td> </tr><tr> <td><code>embedded</code></td> <td>Servidor MySQL embutido</td> </tr><tr> <td><code>embedded-compat</code></td> <td>Servidor MySQL embutido compatível com versões anteriores</td> </tr><tr> <td><code>embedded-devel</code></td> <td>Cabeçalhos e outros arquivos necessários para o desenvolvimento de aplicativos para servidores MySQL embutidos</td> </tr><tr> <td><code>java</code></td> <td>Arquivos JAR necessários para o suporte a aplicativos ClusterJ</td> </tr><tr> <td><code>libs</code></td> <td>Bibliotecas de cliente MySQL</td> </tr><tr> <td><code>libs-compat</code></td> <td>Bibliotecas de cliente MySQL compatíveis com versões anteriores</td> </tr><tr> <td><code>management-server</code></td> <td>O servidor de gerenciamento do NDB Cluster (<span><strong>ndb_mgmd</strong></span>)</td> </tr><tr> <td><code>memcached</code></td> <td>Arquivos necessários para suportar o <code>ndbmemcache</code></td> </tr><tr> <td><code>minimal-debuginfo</code></td> <td>Informações de depuração para o pacote server-minimal; útil ao desenvolver aplicativos que utilizam este pacote ou ao depurar este pacote</td> </tr><tr> <td><code>ndbclient</code></td> <td>Biblioteca de cliente <code>NDB</code> para executar aplicativos da API e API MGM do NDB (<code>libndbclient</code>))</td> </tr><tr> <td><code>ndbclient-devel</code></td> <td>Cabeçalhos e outros arquivos necessários para o desenvolvimento de aplicativos da API e API MGM do NDB</td> </tr><tr> <td><code>server</code></td> <td>O servidor MySQL (<span><strong>mysqld</strong></span>) com suporte ao mecanismo de armazenamento <code>NDB</code> incluído, e os programas de

Observação

O pacote `nodejs`, que anteriormente continha arquivos usados para a configuração do `Node.js`, foi removido.

Também está disponível um único pacote (arquivo `.tar`) de todos os RPMs do NDB Cluster para uma determinada plataforma e arquitetura. O nome deste arquivo segue o padrão mostrado aqui:

```
mysql-cluster-license-ver-rev.distro.arch.rpm-bundle.tar
```

Você pode extrair os arquivos RPM individuais deste arquivo usando **tar** ou sua ferramenta preferida para extrair arquivos.

Os componentes necessários para instalar os três principais tipos de nós do NDB Cluster estão listados na seguinte lista:

* *Nó de gerenciamento*: `management-server`
* *Nó de dados*: `data-node`
* *Nó SQL*: `server` e `common`

Além disso, o RPM `client` deve ser instalado para fornecer o cliente de gerenciamento **ndb_mgm** em pelo menos um nó de gerenciamento. Você também pode querer instalá-lo nos nós SQL, para ter **mysql** e outros programas de cliente MySQL disponíveis nesses. Discutimos a instalação dos nós por tipo mais adiante nesta seção.

*`ver`* representa o número de versão do motor de armazenamento `NDB` de três partes no formato `9.x.*``, mostrado como `9.4.0` nos exemplos. `rev` fornece o número de revisão do RPM no formato `major.*minor`. Nos exemplos mostrados nesta seção, usamos `1.1` para este valor.

O *`distro`* (distribuição Linux) é um dos `rhel5` (Oracle Linux 5, Red Hat Enterprise Linux 4 e 5), `el6` (Oracle Linux 6, Red Hat Enterprise Linux 6), `el7` (Oracle Linux 7, Red Hat Enterprise Linux 7) ou `sles12` (SUSE Enterprise Linux 12). Para os exemplos nesta seção, assumimos que o host executa o Oracle Linux 7, Red Hat Enterprise Linux 7 ou o equivalente (`el7`).

*`arch`* é `i686` para RPMs de 32 bits e `x86_64` para versões de 64 bits. Nos exemplos mostrados aqui, assumimos uma plataforma de 64 bits.

O número da versão do NDB Cluster nos nomes dos arquivos RPM (mostrado aqui como `9.4.0`) pode variar de acordo com a versão que você está realmente usando. *É muito importante que todos os RPMs do Cluster instalados tenham o mesmo número de versão*. A arquitetura também deve ser adequada à máquina em que o RPM será instalado; em particular, você deve ter em mente que os RPMs de 64 bits (`x86_64`) não podem ser usados com sistemas operacionais de 32 bits (use `i686` para este último).

**Nodos de dados.** Em um computador que será o host de um nó de dados do NDB Cluster, é necessário instalar apenas o RPM `data-node`. Para fazer isso, copie este RPM para o host do nó de dados e execute o seguinte comando como usuário root do sistema, substituindo o nome mostrado para o RPM conforme necessário para corresponder ao nome do RPM baixado do site da MySQL:

```
$> rpm -Uhv mysql-cluster-community-data-node-9.4.0-1.el7.x86_64.rpm
```

Isso instala os binários de nó de dados **ndbd** e **ndbmtd") `/usr/sbin`. Qualquer um desses pode ser usado para executar um processo de nó de dados neste host.

**Nodos de SQL.** Copie os RPMs `server` e `common` para cada máquina que será usada para hospedar um nó de SQL do NDB Cluster (`server` requer `common`). Instale o RPM `server` executando o seguinte comando como usuário root do sistema, substituindo o nome mostrado para o RPM conforme necessário para corresponder ao nome do RPM baixado do site da MySQL:

```
$> rpm -Uhv mysql-cluster-community-server-9.4.0-1.el7.x86_64.rpm
```

Isso instala o binário do servidor MySQL (**mysqld**), com suporte ao mecanismo de armazenamento **NDB**, no diretório `/usr/sbin`. Ele também instala todos os arquivos de suporte necessários do servidor MySQL e programas úteis do servidor MySQL, incluindo os scripts de inicialização **mysql.server** e **mysqld_safe** (em `/usr/share/mysql` e `/usr/bin`, respectivamente). O instalador RPM deve cuidar automaticamente de questões de configuração geral (como a criação do usuário e grupo `mysql`, se necessário).

Importante

Você deve usar as versões desses RPMs lançadas para o NDB Cluster; aqueles lançados para o servidor MySQL padrão não fornecem suporte ao mecanismo de armazenamento **NDB**.

Para administrar o nó SQL (servidor MySQL), você também deve instalar o RPM `client`, como mostrado aqui:

```
$> rpm -Uhv mysql-cluster-community-client-9.4.0-1.el7.x86_64.rpm
```

Isso instala o cliente **mysql** e outros programas do cliente MySQL, como **mysqladmin** e **mysqldump**, para `/usr/bin`.

**Nodos de gerenciamento**. Para instalar o servidor de gerenciamento do NDB Cluster, é necessário usar apenas o RPM `management-server`. Copie este RPM para o computador destinado a hospedar o nó de gerenciamento e, em seguida, instale-o executando o seguinte comando como usuário root do sistema (substitua o nome mostrado para o RPM conforme necessário para corresponder ao do RPM `management-server` baixado do site da MySQL):

```
$> rpm -Uhv mysql-cluster-community-management-server-9.4.0-1.el7.x86_64.rpm
```

Este RPM instala o binário do servidor de gerenciamento **ndb_mgmd** no diretório `/usr/sbin`. Embora este seja o único programa realmente necessário para executar um nó de gerenciamento, também é uma boa ideia ter o cliente de gerenciamento do NDB Cluster **ndb_mgm** disponível também. Você pode obter este programa, bem como outros programas do cliente **NDB** como **ndb_desc** e **ndb_config**, instalando o RPM `client` conforme descrito anteriormente.

Consulte a Seção 2.5.4, “Instalando o MySQL no Linux Usando Pacotes RPM da Oracle”, para obter informações gerais sobre a instalação do MySQL usando RPMs fornecidos pela Oracle.

Após a instalação a partir do RPM, ainda é necessário configurar o clúster; consulte a Seção 25.3.3, “Configuração Inicial do Clúster NDB”, para obter as informações relevantes.

*É muito importante que todos os RPMs do Clúster a serem instalados tenham o mesmo número de versão*. A designação de *`arquitetura`* também deve ser apropriada para a máquina em que o RPM será instalado; em particular, você deve ter em mente que RPMs de 64 bits não podem ser usados com sistemas operacionais de 32 bits.

**Nodos de dados.** Em um computador que será o host de um nó de dados do clúster, é necessário instalar apenas o RPM `server`. Para fazer isso, copie este RPM para o host do nó de dados e execute o seguinte comando como usuário root do sistema, substituindo o nome mostrado para o RPM conforme necessário para corresponder ao nome do RPM baixado do site da MySQL:

```
$> rpm -Uhv MySQL-Cluster-server-gpl-9.4.0-1.sles11.i386.rpm
```

Embora isso instale todos os binários do NDB Cluster, apenas o programa **ndbd** ou **ndbmtd**") (ambos em `/usr/sbin`) é realmente necessário para executar um nó de dados do NDB Cluster.

**Nodos de SQL.** Em cada máquina que será usada para hospedar um nó de SQL do clúster, instale o RPM `server` executando o seguinte comando como usuário root do sistema, substituindo o nome mostrado para o RPM conforme necessário para corresponder ao nome do RPM baixado do site da MySQL:

```
$> rpm -Uhv MySQL-Cluster-server-gpl-9.4.0-1.sles11.i386.rpm
```

Isso instala o binário do servidor MySQL (**mysqld**) com suporte ao mecanismo de armazenamento **NDB** no diretório `/usr/sbin`, além de todos os arquivos de suporte necessários ao MySQL Server. Também instala os scripts de inicialização **mysql.server** e **mysqld_safe** (em `/usr/share/mysql` e `/usr/bin`, respectivamente). O instalador RPM deve cuidar automaticamente de questões de configuração geral (como a criação do usuário e grupo `mysql`, se necessário).

Para administrar o nó SQL (servidor MySQL), você também deve instalar o RPM `client`, como mostrado aqui:

```
$> rpm -Uhv MySQL-Cluster-client-gpl-9.4.0-1.sles11.i386.rpm
```

Isso instala o programa cliente **mysql**.

**Nodos de gerenciamento.** Para instalar o servidor de gerenciamento do NDB Cluster, é necessário usar apenas o RPM `server`. Copie este RPM para o computador destinado a hospedar o nó de gerenciamento e, em seguida, instale-o executando o seguinte comando como usuário root do sistema (substitua o nome mostrado para o RPM conforme necessário para corresponder ao do RPM `server` baixado do site da MySQL):

```
$> rpm -Uhv MySQL-Cluster-server-gpl-9.4.0-1.sles11.i386.rpm
```

Embora este RPM instale muitos outros arquivos, apenas o binário do servidor de gerenciamento **ndb_mgmd** (no diretório `/usr/sbin`) é realmente necessário para rodar um nó de gerenciamento. O RPM `server` também instala **ndb_mgm**, o cliente de gerenciamento **NDB**.

Consulte a Seção 2.5.4, “Instalando MySQL no Linux Usando Pacotes RPM da Oracle”, para obter informações gerais sobre a instalação do MySQL usando RPMs fornecidos pela Oracle. Consulte a Seção 25.3.3, “Configuração Inicial do NDB Cluster”, para obter informações sobre a configuração pós-instalação necessária.