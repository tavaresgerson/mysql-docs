## 25.1 Informações Gerais

O MySQL NDB Cluster utiliza o servidor MySQL com o mecanismo de armazenamento `NDB`. O suporte ao mecanismo de armazenamento `NDB` não está incluído nas versões padrão do MySQL Server 8.0 construídas pela Oracle. Em vez disso, os usuários dos binários do NDB Cluster da Oracle devem atualizar para a versão binária mais recente do NDB Cluster para as plataformas suportadas — essas incluem RPMs que devem funcionar com a maioria das distribuições Linux. Os usuários do NDB Cluster 8.0 que constroem a partir da fonte devem usar as fontes fornecidas para o MySQL 8.0 e construir com as opções necessárias para fornecer suporte ao NDB. (Os locais onde as fontes podem ser obtidas estão listados mais adiante nesta seção.)

Importante

O MySQL NDB Cluster não suporta o InnoDB Cluster, que deve ser implantado usando o MySQL Server 8.0 com o mecanismo de armazenamento `InnoDB`, além de aplicações adicionais que não estão incluídas na distribuição do NDB Cluster. Os binários do MySQL Server 8.0 não podem ser usados com o MySQL NDB Cluster. Para obter mais informações sobre a implantação e uso do InnoDB Cluster, consulte MySQL AdminAPI. A Seção 25.2.6, “MySQL Server Usando InnoDB Comparado com NDB Cluster”, discute as diferenças entre os mecanismos de armazenamento `NDB` e `InnoDB`.

**Plataformas suportadas.** O NDB Cluster está atualmente disponível e é suportado em várias plataformas. Para obter os níveis exatos de suporte disponíveis para combinações específicas de versões de sistemas operacionais, distribuições de sistemas operacionais e plataformas de hardware, consulte <https://www.mysql.com/support/supportedplatforms/cluster.html>.

**Disponibilidade.** Os pacotes binários e de código-fonte do NDB Cluster estão disponíveis para as plataformas suportadas em <https://dev.mysql.com/downloads/cluster/>.

**Números de lançamento do NDB Cluster.** O NDB 8.0 segue o mesmo padrão de lançamento da série de lançamentos do MySQL Server 8.0, começando com o MySQL 8.0.13 e o MySQL NDB Cluster 8.0.13. Neste *Manual* e em outras documentações do MySQL, identificamos esses e lançamentos posteriores do NDB Cluster usando um número de versão que começa com “NDB”. Esse número de versão é o do motor de armazenamento `NDBCLUSTER` usado no lançamento do NDB 8.0 e é o mesmo da versão do servidor MySQL 8.0 em que o lançamento do NDB Cluster 8.0 é baseado.

**Cadeias de versão usadas no software do NDB Cluster.** A cadeia de versão exibida pelo cliente **mysql** fornecido com a distribuição do MySQL NDB Cluster usa este formato:

```
mysql-mysql_server_version-cluster
```

`mysql_server_version` representa a versão do MySQL Server na qual o lançamento do NDB Cluster é baseado. Para todos os lançamentos do NDB Cluster 8.0, este é `8.0.n`, onde `n` é o número do lançamento. A construção a partir da fonte usando `-DWITH_NDB` ou o equivalente adiciona o sufixo `-cluster` à string de versão. (Veja a Seção 25.3.1.4, “Construção do NDB Cluster a partir da Fonte no Linux” e a Seção 25.3.2.2, “Compilação e Instalação do NDB Cluster a partir da Fonte no Windows”.) Você pode ver este formato usado no cliente **mysql**, como mostrado aqui:

```
$> mysql
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 2
Server version: 8.0.44-cluster Source distribution

Type 'help;' or '\h' for help. Type '\c' to clear the buffer.

mysql> SELECT VERSION()\G
*************************** 1. row ***************************
VERSION(): 8.0.44-cluster
1 row in set (0.00 sec)
```

O primeiro lançamento de disponibilidade geral do NDB Cluster com o MySQL 8.0 é o NDB 8.0.19, usando o MySQL 8.0.19.

A string de versão exibida por outros programas do NDB Cluster que normalmente não estão incluídos na distribuição do MySQL 8.0 usa este formato:

```
mysql-mysql_server_version ndb-ndb_engine_version
```

`mysql_server_version` representa a versão do MySQL Server na qual o lançamento do NDB Cluster é baseado. Para todos os lançamentos do NDB Cluster 8.0, este é `8.0.n`, onde `n` é o número do lançamento. `ndb_engine_version` é a versão do motor de armazenamento `NDB` usado por este lançamento do software NDB Cluster. Para todos os lançamentos do NDB 8.0, este número é o mesmo da versão do MySQL Server. Você pode ver este formato usado na saída do comando `SHOW` no cliente **ndb\_mgm**, assim:

```
ndb_mgm> SHOW
Connected to Management Server at: localhost:1186
Cluster Configuration
---------------------
[ndbd(NDB)]     2 node(s)
id=1    @10.0.10.6  (mysql-8.0.44 ndb-8.0.44, Nodegroup: 0, *)
id=2    @10.0.10.8  (mysql-8.0.44 ndb-8.0.44, Nodegroup: 0)

[ndb_mgmd(MGM)] 1 node(s)
id=3    @10.0.10.2  (mysql-8.0.44 ndb-8.0.44)

[mysqld(API)]   2 node(s)
id=4    @10.0.10.10  (mysql-8.0.44 ndb-8.0.44)
id=5 (not connected, accepting connect from any host)
```

**Compatibilidade com as versões padrão do MySQL 8.0.** Embora muitos esquemas e aplicativos padrão do MySQL possam funcionar com o NDB Cluster, também é verdade que aplicativos e esquemas de banco de dados não modificados podem ser ligeiramente incompatíveis ou ter desempenho subótimo quando executados com o NDB Cluster (veja a Seção 25.2.7, “Limitações conhecidas do NDB Cluster”). A maioria desses problemas pode ser superada, mas isso também significa que é muito improvável que você possa mudar um banco de dados de aplicativo existente que atualmente usa, por exemplo, `MyISAM` ou `InnoDB` para usar o mecanismo de armazenamento `NDB` sem permitir a possibilidade de alterações em esquemas, consultas e aplicativos. Um **mysqld** compilado sem suporte ao `NDB` (ou seja, construído sem `-DWITH_NDB` ou `-DWITH_NDBCLUSTER_STORAGE_ENGINE`) não pode funcionar como um substituto direto para um **mysqld** que é construído com ele.

**Árvores de código-fonte do desenvolvimento do NDB Cluster.** As árvores de código-fonte do desenvolvimento do NDB Cluster também podem ser acessadas em <https://github.com/mysql/mysql-server>.

As fontes de desenvolvimento do NDB Cluster mantidas em <https://github.com/mysql/mysql-server> estão licenciadas sob a GPL. Para obter informações sobre como obter as fontes do MySQL usando o Git e construí-las você mesmo, consulte a Seção 2.8.5, “Instalando o MySQL Usando uma Árvore de Fontes de Desenvolvimento”.

Nota

Assim como o MySQL Server 8.0, as versões do NDB Cluster 8.0 são construídas usando **CMake**.

O NDB Cluster 8.0 está disponível a partir do NDB 8.0.19 como uma versão de disponibilidade geral e é recomendado para novas implantações. O NDB Cluster 7.6 e 7.5 são versões anteriores de disponibilidade geral ainda suportadas em produção; para informações sobre o NDB Cluster 7.6, consulte O que há de novo no NDB Cluster 7.6. Para informações semelhantes sobre o NDB Cluster 7.5, consulte O que há de novo no NDB Cluster 7.5. O NDB Cluster 7.4 e 7.3 são versões anteriores de disponibilidade geral que não são mais mantidas. Recomendamos que novas implantações para uso em produção usem o NDB Cluster 8.0.

O conteúdo deste capítulo está sujeito a revisão à medida que o NDB Cluster continua a evoluir. Informações adicionais sobre o NDB Cluster podem ser encontradas no site da MySQL em <http://www.mysql.com/products/cluster/>.

**Recursos adicionais.** Mais informações sobre o NDB Cluster podem ser encontradas nos seguintes locais:

- Para respostas a algumas perguntas frequentes sobre o NDB Cluster, consulte a Seção A.10, “Perguntas frequentes do MySQL 8.0: NDB Cluster”.

- O Fórum do NDB Cluster: <https://forums.mysql.com/list.php?25>.

- Muitos usuários e desenvolvedores do NDB Cluster criam blogs sobre suas experiências com o NDB Cluster e disponibilizam esses feeds no PlanetMySQL.
