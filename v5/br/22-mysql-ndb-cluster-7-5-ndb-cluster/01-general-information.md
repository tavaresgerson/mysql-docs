## 21.1 Informações Gerais

O MySQL NDB Cluster usa o MySQL Server com o storage engine `NDB`. O suporte para o storage engine [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") não está incluído nos binaries padrão do MySQL Server 5.7 construídos pela Oracle. Em vez disso, os usuários de binaries do NDB Cluster fornecidos pela Oracle devem fazer upgrade para a release binária mais recente do NDB Cluster para plataformas suportadas — estas incluem RPMs que devem funcionar com a maioria das distribuições Linux. Usuários do NDB Cluster que compilarem a partir do source devem usar os sources fornecidos para o NDB Cluster. (Os locais onde os sources podem ser obtidos são listados mais adiante nesta seção.)

Importante

O MySQL NDB Cluster não suporta o InnoDB Cluster, que deve ser implantado usando o MySQL Server 5.7 com o storage engine [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"), bem como aplicações adicionais que não estão incluídas na distribuição NDB Cluster. Os binaries do MySQL Server 5.7 não podem ser usados com o MySQL NDB Cluster. Para obter mais informações sobre a implantação e uso do InnoDB Cluster, consulte [MySQL AdminAPI](/doc/mysql-shell/8.0/en/admin-api-userguide.html). A [Seção 21.2.6, “MySQL Server Using InnoDB Compared with NDB Cluster”](mysql-cluster-compared.html "21.2.6 MySQL Server Using InnoDB Compared with NDB Cluster"), discute as diferenças entre os storage engines `NDB` e `InnoDB`.

**Plataformas Suportadas.** O NDB Cluster está atualmente disponível e suportado em diversas plataformas. Para os níveis exatos de suporte disponíveis para combinações específicas de versões de sistemas operacionais, distribuições de sistemas operacionais e plataformas de hardware, consulte <https://www.mysql.com/support/supportedplatforms/cluster.html>.

**Disponibilidade.** Os pacotes binary e source do NDB Cluster estão disponíveis para plataformas suportadas em <https://dev.mysql.com/downloads/cluster/>.

**Números de release do NDB Cluster.** O NDB Cluster segue um padrão de release um pouco diferente da série de releases principal do MySQL Server 5.7. Neste *Manual* e em outra documentação do MySQL, identificamos estas e as releases posteriores do NDB Cluster empregando um número de versão que começa com “NDB”. Este número de versão é o do storage engine [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") usado na release, e não da versão do MySQL Server na qual a release do NDB Cluster está baseada.

**Strings de versão usadas no software NDB Cluster.** A string de versão exibida pelos programas NDB Cluster usa este formato:

```sql
mysql-mysql_server_version-ndb-ndb_engine_version
```

*`mysql_server_version`* representa a versão do MySQL Server na qual a release do NDB Cluster está baseada. Para todas as releases NDB Cluster 7.5 e NDB Cluster 7.6, este é “5.7”. *`ndb_engine_version`* é a versão do storage engine [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") usada por esta release do software NDB Cluster. Você pode ver este formato usado no cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"), conforme mostrado aqui:

```sql
$> mysql
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 2
Server version: 5.7.44-ndb-7.5.36 Source distribution

Type 'help;' or '\h' for help. Type '\c' to clear the buffer.

mysql> SELECT VERSION()\G
*************************** 1. row ***************************
VERSION(): 5.7.44-ndb-7.5.36
1 row in set (0.00 sec)
```

Esta string de versão também é exibida na saída do comando `SHOW` no cliente [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client"):

```sql
ndb_mgm> SHOW
Connected to Management Server at: localhost:1186
Cluster Configuration
---------------------
[ndbd(NDB)]     2 node(s)
id=1    @10.0.10.6  (5.7.44-ndb-7.5.36, Nodegroup: 0, *)
id=2    @10.0.10.8  (5.7.44-ndb-7.5.36, Nodegroup: 0)

[ndb_mgmd(MGM)] 1 node(s)
id=3    @10.0.10.2  (5.7.44-ndb-7.5.36)

[mysqld(API)]   2 node(s)
id=4    @10.0.10.10  (5.7.44-ndb-7.5.36)
id=5 (not connected, accepting connect from any host)
```

A string de versão identifica a versão principal do MySQL da qual a release do NDB Cluster foi ramificada e a versão do storage engine [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") usada. Por exemplo, a string de versão completa para NDB 7.5.4 (a primeira release GA do NDB 7.5) foi `mysql-5.7.16-ndb-7.5.4`. A partir disso, podemos determinar o seguinte:

* Uma vez que a porção da string de versão que precede `-ndb-` é a versão base do MySQL Server, isso significa que NDB 7.5.4 derivou do MySQL 5.7.16 e continha todos os aprimoramentos de recursos (*feature enhancements*) e correções de bugs (*bug fixes*) do MySQL 5.7 até e incluindo o MySQL 5.7.16.

* Uma vez que a porção da string de versão que segue `-ndb-` representa o número de versão do storage engine [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") (ou [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6")), o NDB 7.5.4 usou a versão 7.5.4 do storage engine [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6").

As novas releases do NDB Cluster são numeradas de acordo com as atualizações no storage engine NDB e não correspondem necessariamente de forma direta com as releases principais do MySQL Server. Por exemplo, NDB 7.5.4 (conforme observado anteriormente) foi baseada no MySQL 5.7.16, enquanto NDB 7.5.3 foi baseada no MySQL 5.7.13 (string de versão: `mysql-5.7.13-ndb-7.5.3`).

**Compatibilidade com releases padrão do MySQL 5.7.** Embora muitos schemas e aplicações padrão do MySQL possam funcionar usando o NDB Cluster, também é verdade que aplicações e schemas de database não modificados podem ser ligeiramente incompatíveis ou ter desempenho abaixo do ideal ao serem executados usando o NDB Cluster (consulte a [Seção 21.2.7, “Known Limitations of NDB Cluster”](mysql-cluster-limitations.html "21.2.7 Known Limitations of NDB Cluster")). A maioria desses problemas pode ser superada, mas isso também significa que é muito improvável que você consiga mudar um datastore de aplicação existente — que atualmente usa, por exemplo, [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") ou [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") — para usar o storage engine [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") sem considerar a possibilidade de alterações em schemas, queries e aplicações. Além disso, os codebases do MySQL Server e do NDB Cluster divergem consideravelmente, de modo que o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") padrão não pode funcionar como um substituto direto (*drop-in replacement*) para a versão do [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") fornecida com o NDB Cluster.

**Source trees de desenvolvimento do NDB Cluster.** As trees de desenvolvimento do NDB Cluster também podem ser acessadas em <https://github.com/mysql/mysql-server>.

Os sources de desenvolvimento do NDB Cluster mantidos em <https://github.com/mysql/mysql-server> são licenciados sob a GPL. Para obter informações sobre como obter sources MySQL usando Git e compilá-los por conta própria, consulte a [Seção 2.8.5, “Installing MySQL Using a Development Source Tree”](installing-development-tree.html "2.8.5 Installing MySQL Using a Development Source Tree").

Nota

As releases NDB Cluster 7.6 são construídas usando **CMake**.

NDB Cluster 8.0 (GA) e NDB Cluster 8.4 (LTS), são recomendados para novas implantações; consulte [What is New in MySQL NDB Cluster 8.0](/doc/refman/8.0/en/mysql-cluster-what-is-new.html) e [What is New in MySQL NDB Cluster 8.4](/doc/refman/8.4/en/mysql-cluster-what-is-new.html), respectivamente, para obter mais informações sobre essas séries de releases. O NDB Cluster 9.3 também está disponível como uma Innovation release (consulte [What is New in MySQL NDB Cluster 9.4](/doc/refman/9.4/en/mysql-cluster-what-is-new.html)). O NDB Cluster 7.6 é uma release GA anterior ainda suportada em produção. NDB Cluster 7.5 e anteriores são releases GA anteriores que não são mais mantidas. Recomendamos que novas implantações para uso em produção usem o MySQL NDB Cluster 8.0.

O conteúdo deste capítulo está sujeito a revisões à medida que o NDB Cluster continua a evoluir. Informações adicionais sobre o NDB Cluster podem ser encontradas no website do MySQL em <http://www.mysql.com/products/cluster/>.

**Recursos Adicionais.** Mais informações sobre o NDB Cluster podem ser encontradas nos seguintes locais:

* Para respostas a algumas perguntas frequentes sobre o NDB Cluster, consulte a [Seção A.10, “MySQL 5.7 FAQ: NDB Cluster”](faqs-mysql-cluster.html "A.10 MySQL 5.7 FAQ: NDB Cluster").

* O Fórum NDB Cluster: <https://forums.mysql.com/list.php?25>.
* Muitos usuários e desenvolvedores do NDB Cluster blogam sobre suas experiências com o NDB Cluster e disponibilizam feeds desses conteúdos através do [PlanetMySQL](http://www.planetmysql.org/).
