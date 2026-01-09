## 25.1 Informações Gerais

O MySQL NDB Cluster utiliza o servidor MySQL com o mecanismo de armazenamento `NDB`. O suporte ao mecanismo de armazenamento `NDB` não está incluído nos binários padrão do MySQL Server 9.5 construídos pela Oracle. Em vez disso, os usuários dos binários do NDB Cluster da Oracle devem atualizar para a versão binária mais recente do NDB Cluster para as plataformas suportadas — esses incluem RPMs que devem funcionar com a maioria das distribuições Linux. Os usuários do NDB Cluster 9.5 que constroem a partir da fonte devem usar as fontes fornecidas para o MySQL 9.5 e construir com as opções necessárias para fornecer suporte ao NDB. (Os locais onde as fontes podem ser obtidas estão listados mais adiante nesta seção.)

Importante

O MySQL NDB Cluster não suporta o InnoDB Cluster, que deve ser implantado usando o mecanismo de armazenamento `InnoDB` do MySQL Server, bem como aplicativos adicionais que não estão incluídos na distribuição do NDB Cluster. Os binários do MySQL Server 9.5 não podem ser usados com o MySQL NDB Cluster. Para mais informações sobre a implantação e uso do InnoDB Cluster, consulte MySQL AdminAPI. A Seção 25.2.6, “MySQL Server Usando InnoDB Comparado com NDB Cluster”, discute as diferenças entre os mecanismos de armazenamento `NDB` e `InnoDB`.

**Plataformas Suportadas.** O NDB Cluster está atualmente disponível e suportado em várias plataformas. Para os níveis exatos de suporte disponíveis para combinações específicas de versões de sistemas operacionais, distribuições de sistemas operacionais e plataformas de hardware, consulte <https://www.mysql.com/support/supportedplatforms/cluster.html>.

**Disponibilidade.** Os pacotes binários e de fonte do NDB Cluster estão disponíveis para plataformas suportadas em <https://dev.mysql.com/downloads/cluster/>.

**Strings de versão usadas no software do NDB Cluster.** A string de versão exibida pelo cliente **mysql** fornecido com a distribuição do NDB Cluster MySQL usa este formato:

```
mysql-mysql_server_version-cluster
```

*`mysql_server_version`* representa a versão do MySQL Server em que o lançamento do NDB Cluster é baseado. A construção a partir do código-fonte usando `-DWITH_NDB` ou o equivalente adiciona o sufixo `-cluster` à string de versão. (Veja a Seção 25.3.1.4, “Construção do NDB Cluster a partir do Código-Fonte no Linux” e a Seção 25.3.2.2, “Compilação e Instalação do NDB Cluster a partir do Código-Fonte no Windows”.) Você pode ver este formato usado no cliente **mysql**, como mostrado aqui:

```
$> mysql
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 2
Server version: 9.4.0-cluster Source distribution

Type 'help;' or '\h' for help. Type '\c' to clear the buffer.

mysql> SELECT VERSION()\G
*************************** 1. row ***************************
VERSION(): 9.4.0-cluster
1 row in set (0.00 sec)
```

A string de versão exibida por outros programas do NDB Cluster que normalmente não estão incluídos na distribuição do MySQL 9.5 usa este formato:

```
mysql-mysql_server_version ndb-ndb_engine_version
```

*`mysql_server_version`* representa a versão do MySQL Server em que o lançamento do NDB Cluster é baseado. Para o NDB Cluster 9.5, isso é `9.5.n`, onde *`n`* é o número do lançamento. *`ndb_engine_version`* é a versão do motor de armazenamento `NDB` usado por este lançamento do software do NDB Cluster. Para o NDB 9.5, esse número é o mesmo que a versão do MySQL Server. Você pode ver este formato usado na saída do comando **SHOW** no cliente **ndb_mgm**, assim:

```
ndb_mgm> SHOW
Connected to Management Server at: localhost:1186 (using cleartext)
Cluster Configuration
---------------------
[ndbd(NDB)]     2 node(s)
id=1    @10.0.10.6  (mysql-9.5.0 ndb-9.5.0, Nodegroup: 0, *)
id=2    @10.0.10.8  (mysql-9.5.0 ndb-9.5.0, Nodegroup: 0)

[ndb_mgmd(MGM)] 1 node(s)
id=3    @10.0.10.2  (mysql-9.5.0 ndb-9.5.0)

[mysqld(API)]   2 node(s)
id=4    @10.0.10.10  (mysql-9.5.0 ndb-9.5.0)
id=5 (not connected, accepting connect from any host)
```

**Compatibilidade com as versões padrão do MySQL 9.5.** Embora muitos esquemas e aplicativos padrão do MySQL possam funcionar usando o NDB Cluster, também é verdade que aplicativos e esquemas de banco de dados não modificados podem ser ligeiramente incompatíveis ou ter desempenho subótimo quando executados usando o NDB Cluster (veja a Seção 25.2.7, “Limitações Conhecidas do NDB Cluster”). A maioria desses problemas pode ser superada, mas isso também significa que é muito improvável que você possa mudar um banco de dados de aplicativo existente que atualmente usa, por exemplo, `MyISAM` ou `InnoDB` para usar o motor de armazenamento `NDB` sem permitir a possibilidade de alterações em esquemas, consultas e aplicativos. Um **mysqld** compilado sem suporte ao NDB (ou seja, construído sem `-DWITH_NDB` ou `-DWITH_NDBCLUSTER_STORAGE_ENGINE`) não pode funcionar como um substituto direto para um **mysqld** que é construído com ele.

**Arvores de código-fonte de desenvolvimento do NDB Cluster.** As árvores de código-fonte de desenvolvimento do NDB Cluster também podem ser acessadas em <https://github.com/mysql/mysql-server>.

As fontes de desenvolvimento do NDB Cluster mantidas em <https://github.com/mysql/mysql-server> estão licenciadas sob a GPL. Para obter informações sobre como obter as fontes do MySQL usando o Git e construí-las você mesmo, consulte a Seção 2.8.5, “Instalando MySQL Usando uma Árvore de Código-Fonte de Desenvolvimento”.

Nota

Assim como no MySQL Server 9.5, as versões 9.5 do NDB Cluster são construídas usando **CMake**.

O NDB Cluster 9.5 está disponível como uma versão de Inovação, com novos recursos em desenvolvimento e destinados a pré-visualização e teste. O NDB Cluster 8.4 é a série de lançamentos LTS atual e é recomendado para novas implantações (veja MySQL NDB Cluster 8.4). O NDB Cluster 8.0, 7.6 e 7.5 são lançamentos GA anteriores ainda suportados em produção, embora recomendação o NDB Cluster 8.4 para novas implantações destinadas a uso em produção.

Informações adicionais sobre o NDB Cluster podem ser encontradas no site do MySQL em <https://www.mysql.com/products/cluster/>.

**Recursos Adicionais.** Mais informações sobre o NDB Cluster podem ser encontradas nos seguintes locais:

* Para respostas a algumas perguntas frequentes sobre o NDB Cluster, consulte a Seção A.10, “MySQL 9.5 FAQ: NDB Cluster”.

* O Fórum do NDB Cluster: <https://forums.mysql.com/list.php?25>.
* Muitos usuários e desenvolvedores do NDB Cluster criam blogs sobre suas experiências com o NDB Cluster e disponibilizam esses feeds no PlanetMySQL.