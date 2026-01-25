#### 21.3.1.3 Instalando o NDB Cluster Usando Arquivos .deb

Esta seção fornece informações sobre a instalação do NDB Cluster em Debian e distribuições Linux relacionadas, como Ubuntu, usando os arquivos .deb fornecidos pela Oracle para este fim.

Para o NDB Cluster 7.5.6 e superior, a Oracle também fornece um APT repository para Debian e outras distribuições. Consulte [*Instalando o MySQL NDB Cluster Usando o APT Repository*](/doc/mysql-apt-repo-quick-guide/en/#repo-qg-apt-cluster-install) para instruções e informações adicionais.

A Oracle fornece arquivos installer .deb para o NDB Cluster 7.5 e superior para plataformas de 32 bits e 64 bits. Para um sistema baseado em Debian, apenas um único arquivo installer é necessário. Este arquivo é nomeado usando o padrão mostrado abaixo, de acordo com a versão aplicável do NDB Cluster, versão do Debian e architecture:

```sql
mysql-cluster-gpl-ndbver-debiandebianver-arch.deb
```

Aqui, *`ndbver`* é o número de versão do engine `NDB` de 3 partes, *`debianver`* é a versão principal do Debian (`8` ou `9`), e *`arch`* é um de `i686` ou `x86_64`. Nos exemplos que se seguem, assumimos que você deseja instalar o NDB 7.6.35 em um sistema Debian 9 de 64 bits; neste caso, o arquivo installer é nomeado `mysql-cluster-gpl-7.6.35-debian9-x86_64.deb-bundle.tar`.

Assim que você tiver baixado o arquivo `.deb` apropriado, você pode descompactá-lo (untar), e então instalá-lo a partir da linha de comando usando `dpkg`, assim:

```sql
$> dpkg -i mysql-cluster-gpl-7.6.35-debian9-i686.deb
```

Você também pode removê-lo usando `dpkg`, conforme mostrado aqui:

```sql
$> dpkg -r mysql
```

O arquivo installer também deve ser compatível com a maioria dos package managers gráficos que funcionam com arquivos .deb, como o `GDebi` para o desktop Gnome.

O arquivo .deb instala o NDB Cluster em `/opt/mysql/server-version/`, onde *`version`* é a versão da série de lançamento de 2 partes para o MySQL server incluído. Para NDB 7.5 e superior, esta é sempre `5.7`. O layout do diretório é o mesmo que o da distribuição binária genérica do Linux (consulte [Tabela 2.3, “Layout de Instalação do MySQL para Pacotes Binários Genéricos Unix/Linux”](binary-installation.html#binary-installation-layout "Table 2.3 MySQL Installation Layout for Generic Unix/Linux Binary Package")), com a exceção de que os startup scripts e arquivos de configuração são encontrados em `support-files` em vez de `share`. Todos os executáveis do NDB Cluster, como [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client"), [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon") e [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon"), são colocados no diretório `bin`.