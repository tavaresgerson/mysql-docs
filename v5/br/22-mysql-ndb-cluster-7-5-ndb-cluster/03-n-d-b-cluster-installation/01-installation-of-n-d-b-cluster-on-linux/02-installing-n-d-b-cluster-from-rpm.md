#### 21.3.1.2 Instalando o NDB Cluster a partir de RPM

Esta seção cobre os passos necessários para instalar os executáveis corretos para cada tipo de node do NDB Cluster utilizando pacotes RPM fornecidos pela Oracle.

Como alternativa ao método descrito nesta seção, a Oracle fornece Repositórios MySQL para NDB Cluster 7.5.6 e posterior, que são compatíveis com muitas distribuições Linux comuns. Dois repositórios, listados a seguir, estão disponíveis para distribuições baseadas em RPM:

* Para distribuições que utilizam **yum** ou **dnf**, você pode usar o MySQL Yum Repository para NDB Cluster. Consulte [*Instalando o MySQL NDB Cluster Utilizando o Repositório Yum*](/doc/mysql-yum-repo-quick-guide/en/#repo-qg-yum-fresh-cluster-install), para instruções e informações adicionais.

* Para SLES, você pode usar o MySQL SLES Repository para NDB Cluster. Consulte [*Instalando o MySQL NDB Cluster Utilizando o Repositório SLES*](/doc/mysql-sles-repo-quick-guide/en/#repo-qg-sles-fresh-cluster-install), para instruções e informações adicionais.

RPMs estão disponíveis para plataformas Linux de 32-bit e 64-bit. Os nomes de arquivo para estes RPMs utilizam o seguinte padrão:

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

*`license`* indica se o RPM faz parte de um release Commercial (Comercial) ou Community (Comunitário) do NDB Cluster. No restante desta seção, assumimos nos exemplos que você está instalando um release Community.

Os valores possíveis para *`component`*, com descrições, podem ser encontrados na tabela a seguir:

**Tabela 21.5 Componentes da distribuição RPM do NDB Cluster**

| Componente | Descrição |
| :--- | :--- |
| `auto-installer` | Programa NDB Cluster Auto Installer (DEPRECATED); consulte Seção 21.3.8, “The NDB Cluster Auto-Installer (NDB 7.5) (NO LONGER SUPPORTED)”, para uso |
| `client` | Programas MySQL e `NDB` client; inclui o client **mysql**, o client **ndb_mgm** e outras ferramentas client |
| `common` | Conjunto de caracteres e informações de mensagens de erro necessárias pelo MySQL server |
| `data-node` | Binários **ndbd** e **ndbmtd** do data node |
| `devel` | Cabeçalhos e arquivos de biblioteca necessários para o desenvolvimento de MySQL client |
| `embedded` | MySQL server Embedded |
| `embedded-compat` | MySQL server Embedded compatível com versões anteriores |
| `embedded-devel` | Cabeçalho e arquivos de biblioteca para desenvolvimento de aplicações para MySQL Embedded |
| `java` | Arquivos JAR necessários para suporte de aplicações ClusterJ |
| `libs` | Bibliotecas MySQL client |
| `libs-compat` | Bibliotecas MySQL client compatíveis com versões anteriores |
| `management-server` | O management server do NDB Cluster (**ndb_mgmd**) |
| `memcached` | Arquivos necessários para suportar `ndbmemcache` |
| `minimal-debuginfo` | Informações de Debug para o pacote `server-minimal`; útil ao desenvolver ou depurar aplicações que usam este pacote ou ao depurar este pacote |
| `ndbclient` | Biblioteca client `NDB` para execução de aplicações NDB API e MGM API (`libndbclient`) |
| `ndbclient-devel` | Cabeçalho e outros arquivos necessários para o desenvolvimento de aplicações NDB API e MGM API |
| `nodejs` | Arquivos necessários para configurar o suporte Node.JS para NDB Cluster |
| `server` | O MySQL server (**mysqld**) com suporte à storage engine `NDB` incluído, e programas associados do MySQL server |
| `server-minimal` | Instalação mínima do MySQL server para NDB e ferramentas relacionadas |
| `test` | **mysqltest**, outros programas de test do MySQL e arquivos de suporte |

Um bundle único (arquivo `.tar`) de todos os RPMs do NDB Cluster para uma determinada plataforma e arquitetura também está disponível. O nome deste arquivo segue o padrão mostrado aqui:

```sql
mysql-cluster-license-ver-rev.distro.arch.rpm-bundle.tar
```

Você pode extrair os arquivos RPM individuais deste arquivo usando **tar** ou sua ferramenta preferida para extração de arquivos.

Os componentes necessários para instalar os três principais tipos de nodes do NDB Cluster são fornecidos na lista a seguir:

* *Management node*: `management-server`

* *Data node*: `data-node`
* *SQL node*: `server` e `common`

Além disso, o RPM `client` deve ser instalado para fornecer o client de gerenciamento [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client") em pelo menos um management node. Você também pode querer instalá-lo em SQL nodes, para ter [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") e outros programas MySQL client disponíveis neles. Discutiremos a instalação de nodes por tipo mais adiante nesta seção.

*`ver`* representa o número da versão de três partes da storage engine `NDB` no formato 7.6.*`x`*, mostrado como `7.6.35` nos exemplos. `rev` fornece o número de revisão do RPM no formato *`major`*.*`minor`*. Nos exemplos mostrados nesta seção, usamos `1.1` para este valor.

A *`distro`* (distribuição Linux) é uma de `rhel5` (Oracle Linux 5, Red Hat Enterprise Linux 4 e 5), `el6` (Oracle Linux 6, Red Hat Enterprise Linux 6), `el7` (Oracle Linux 7, Red Hat Enterprise Linux 7), ou `sles12` (SUSE Enterprise Linux 12). Para os exemplos nesta seção, assumimos que o host executa Oracle Linux 7, Red Hat Enterprise Linux 7, ou o equivalente (`el7`).

*`arch`* é `i686` para RPMs de 32-bit e `x86_64` para versões de 64-bit. Nos exemplos mostrados aqui, assumimos uma plataforma de 64-bit.

O número de versão do NDB Cluster nos nomes de arquivo RPM (mostrado aqui como `7.6.35`) pode variar de acordo com a versão que você está realmente utilizando. *É muito importante que todos os RPMs do Cluster a serem instalados tenham o mesmo número de versão*. A arquitetura também deve ser apropriada para a máquina na qual o RPM será instalado; em particular, você deve ter em mente que RPMs de 64-bit (`x86_64`) não podem ser usados com sistemas operacionais de 32-bit (use `i686` para este último).

**Data nodes.** Em um computador que hospedará um data node do NDB Cluster, é necessário instalar apenas o RPM `data-node`. Para fazer isso, copie este RPM para o host do data node e execute o seguinte command como o usuário root do sistema, substituindo o nome mostrado para o RPM conforme necessário para corresponder ao RPM baixado do website do MySQL:

```sql
$> rpm -Uhv mysql-cluster-community-data-node-7.6.35-1.el7.x86_64.rpm
```

Isto instala os binários [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon") e [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") do data node em `/usr/sbin`. Qualquer um deles pode ser usado para executar um processo data node neste host.

**SQL nodes.** Copie os RPMs `server` e `common` para cada máquina a ser usada para hospedar um SQL node do NDB Cluster (`server` requer `common`). Instale o RPM `server` executando o seguinte command como o usuário root do sistema, substituindo o nome mostrado para o RPM conforme necessário para corresponder ao nome do RPM baixado do website do MySQL:

```sql
$> rpm -Uhv mysql-cluster-community-server-7.6.35-1.el7.x86_64.rpm
```

Isto instala o binário do MySQL server ([**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server")), com suporte à storage engine `NDB`, no diretório `/usr/sbin`. Ele também instala todos os arquivos de suporte necessários do MySQL Server e programas úteis do MySQL server, incluindo os startup scripts [**mysql.server**](mysql-server.html "4.3.3 mysql.server — MySQL Server Startup Script") e [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") (em `/usr/share/mysql` e `/usr/bin`, respectivamente). O instalador RPM deve cuidar automaticamente das questões gerais de configuration (como criar o usuário e grupo `mysql`, se necessário).

Importante

Você deve usar as versões desses RPMs lançados para NDB Cluster; aqueles lançados para o MySQL server padrão não fornecem suporte para a storage engine `NDB`.

Para administrar o SQL node (MySQL server), você também deve instalar o RPM `client`, conforme mostrado aqui:

```sql
$> rpm -Uhv mysql-cluster-community-client-7.6.35-1.el7.x86_64.rpm
```

Isto instala o client [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") e outros programas MySQL client, como [**mysqladmin**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") e [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program"), em `/usr/bin`.

**Management nodes.** Para instalar o management server do NDB Cluster, é necessário apenas usar o RPM `management-server`. Copie este RPM para o computador destinado a hospedar o management node e instale-o executando o seguinte command como o usuário root do sistema (substitua o nome mostrado para o RPM conforme necessário para corresponder ao RPM `management-server` baixado do website do MySQL):

```sql
$> rpm -Uhv mysql-cluster-community-management-server-7.6.35-1.el7.x86_64.rpm
```

Este RPM instala o binário do management server [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") no diretório `/usr/sbin`. Embora este seja o único programa realmente exigido para executar um management node, também é uma boa ideia ter o client de gerenciamento [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client") do NDB Cluster disponível. Você pode obter este programa, bem como outros programas client `NDB` como [**ndb_desc**](mysql-cluster-programs-ndb-desc.html "21.5.10 ndb_desc — Describe NDB Tables") e [**ndb_config**](mysql-cluster-programs-ndb-config.html "21.5.7 ndb_config — Extract NDB Cluster Configuration Information"), instalando o RPM `client` conforme descrito anteriormente.

Nota

Anteriormente, [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client") era instalado pelo mesmo RPM usado para instalar o management server. No NDB 7.5 (e posterior), todos os programas client `NDB` são obtidos do mesmo RPM `client` que instala [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") e outros clients MySQL.

Consulte [Seção 2.5.5, “Instalando MySQL no Linux Usando Pacotes RPM da Oracle”](linux-installation-rpm.html "2.5.5 Installing MySQL on Linux Using RPM Packages from Oracle"), para obter informações gerais sobre a instalação do MySQL usando RPMs fornecidos pela Oracle.

Após a installation a partir do RPM, você ainda precisa configurar o cluster; consulte [Seção 21.3.3, “Configuração Inicial do NDB Cluster”](mysql-cluster-install-configuration.html "21.3.3 Initial Configuration of NDB Cluster"), para obter as informações relevantes.

Consulte [Seção 2.5.5, “Instalando MySQL no Linux Usando Pacotes RPM da Oracle”](linux-installation-rpm.html "2.5.5 Installing MySQL on Linux Using RPM Packages from Oracle"), para obter informações gerais sobre a instalação do MySQL usando RPMs fornecidos pela Oracle. Consulte [Seção 21.3.3, “Configuração Inicial do NDB Cluster”](mysql-cluster-install-configuration.html "21.3.3 Initial Configuration of NDB Cluster"), para obter informações sobre a configuration pós-installation necessária.