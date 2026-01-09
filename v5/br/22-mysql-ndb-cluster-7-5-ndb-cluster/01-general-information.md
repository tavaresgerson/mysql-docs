## 21.1 Informações Gerais

O MySQL NDB Cluster utiliza o servidor MySQL com o mecanismo de armazenamento `NDB`. O suporte ao mecanismo de armazenamento `NDB` não está incluído nos binários padrão do MySQL Server 5.7 construídos pela Oracle. Em vez disso, os usuários dos binários do NDB Cluster da Oracle devem atualizar para a versão binária mais recente do NDB Cluster para as plataformas suportadas — essas incluem RPMs que devem funcionar com a maioria das distribuições Linux. Os usuários do NDB Cluster que constroem a partir da fonte devem usar as fontes fornecidas para o NDB Cluster. (Os locais onde as fontes podem ser obtidas estão listados mais adiante nesta seção.)

Importante

O MySQL NDB Cluster não suporta o InnoDB Cluster, que deve ser implantado usando o MySQL Server 5.7 com o mecanismo de armazenamento `InnoDB`, além de aplicações adicionais que não estão incluídas na distribuição do NDB Cluster. Os binários do MySQL Server 5.7 não podem ser usados com o MySQL NDB Cluster. Para obter mais informações sobre a implantação e uso do InnoDB Cluster, consulte MySQL AdminAPI. Seção 21.2.6, “MySQL Server Usando InnoDB Comparado com NDB Cluster”, discute as diferenças entre os mecanismos de armazenamento `NDB` e `InnoDB`.

**Plataformas suportadas.** O NDB Cluster está atualmente disponível e é suportado em várias plataformas. Para obter os níveis exatos de suporte disponíveis para combinações específicas de versões de sistemas operacionais, distribuições de sistemas operacionais e plataformas de hardware, consulte <https://www.mysql.com/support/supportedplatforms/cluster.html>.

**Disponibilidade.** Os pacotes binários e de código-fonte do NDB Cluster estão disponíveis para as plataformas suportadas em <https://dev.mysql.com/downloads/cluster/>.

**Números de lançamento do NDB Cluster.** O NDB Cluster segue um padrão de lançamento um pouco diferente da série de lançamentos do MySQL Server 5.7 principal. Neste *Manual* e em outras documentações do MySQL, identificamos esses e lançamentos posteriores do NDB Cluster usando um número de versão que começa com “NDB”. Este número de versão é o do motor de armazenamento `NDBCLUSTER` usado no lançamento, e não da versão do servidor MySQL em que o lançamento do NDB Cluster é baseado.

**Cadeias de versão usadas no software do NDB Cluster.** A cadeia de versão exibida pelos programas do NDB Cluster usa este formato:

```sql
mysql-mysql_server_version-ndb-ndb_engine_version
```

*`mysql_server_version`* representa a versão do MySQL Server em que a versão do NDB Cluster é baseada. Para todas as versões do NDB Cluster 7.5 e 7.6, este é "5.7". *`ndb_engine_version`* é a versão do motor de armazenamento `NDB` usado por esta versão do software NDB Cluster. Você pode ver este formato usado no cliente **mysql**, como mostrado aqui:

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

Essa string de versão também é exibida na saída do comando `SHOW` no cliente **ndb_mgm**:

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

A string de versão identifica a versão principal do MySQL da qual a versão do NDB Cluster foi derivada e a versão do motor de armazenamento `NDB` utilizado. Por exemplo, a string de versão completa para o NDB 7.5.4 (a primeira versão GA do NDB 7.5) foi `mysql-5.7.16-ndb-7.5.4`. Com isso, podemos determinar o seguinte:

- Como a parte da string da versão que precede `-ndb-` é a versão base do servidor MySQL, isso significa que o NDB 7.5.4 derivado do MySQL 5.7.16 continha todas as melhorias de recursos e correções de bugs do MySQL 5.7 até e incluindo o MySQL 5.7.16.

- Como a parte da string de versão após `-ndb-` representa o número de versão do mecanismo de armazenamento `NDB` (ou `NDBCLUSTER`), o NDB 7.5.4 usou a versão 7.5.4 do mecanismo de armazenamento `NDBCLUSTER`.

As novas versões do NDB Cluster são numeradas de acordo com as atualizações do motor de armazenamento `NDB` e não correspondem necessariamente de forma direta às versões do MySQL Server principal. Por exemplo, o NDB 7.5.4 (como mencionado anteriormente) foi baseado no MySQL 5.7.16, enquanto o NDB 7.5.3 foi baseado no MySQL 5.7.13 (string de versão: `mysql-5.7.13-ndb-7.5.3`).

**Compatibilidade com as versões padrão do MySQL 5.7.** Embora muitos esquemas e aplicativos padrão do MySQL possam funcionar com o NDB Cluster, também é verdade que aplicativos e esquemas de banco de dados não modificados podem ser ligeiramente incompatíveis ou ter desempenho subótimo quando executados com o NDB Cluster (consulte Seção 21.2.7, “Limitações Conhecidas do NDB Cluster”). A maioria desses problemas pode ser superada, mas isso também significa que é muito improvável que você possa mudar um banco de dados de aplicativo existente que atualmente usa, por exemplo, `MyISAM` ou `InnoDB` para usar o mecanismo de armazenamento `NDB` sem permitir a possibilidade de alterações em esquemas, consultas e aplicativos. Além disso, as bases de código do MySQL Server e do NDB Cluster divergem consideravelmente, de modo que o padrão **mysqld** não pode funcionar como um substituto direto para a versão de **mysqld** fornecida com o NDB Cluster.

**Árvores de código-fonte do desenvolvimento do NDB Cluster.** As árvores de código-fonte do desenvolvimento do NDB Cluster também podem ser acessadas em <https://github.com/mysql/mysql-server>.

As fontes de desenvolvimento do NDB Cluster mantidas em <https://github.com/mysql/mysql-server> estão licenciadas sob a GPL. Para obter informações sobre como obter as fontes do MySQL usando o Git e construí-las você mesmo, consulte Seção 2.8.5, “Instalando o MySQL usando uma árvore de fonte de desenvolvimento”.

Nota

As versões do NDB Cluster 7.6 são construídas usando **CMake**.

O NDB Cluster 8.0 (GA) e o NDB Cluster 8.4 (LTS) são recomendados para novas implantações; consulte O que há de novo no MySQL NDB Cluster 8.0 e O que há de novo no MySQL NDB Cluster 8.4, respectivamente, para obter mais informações sobre essas séries de lançamento. O NDB Cluster 9.3 também está disponível como um lançamento de inovação (consulte O que há de novo no MySQL NDB Cluster 9.4). O NDB Cluster 7.6 é um lançamento GA anterior ainda suportado em produção. O NDB Cluster 7.5 e versões anteriores são lançamentos GA anteriores que não são mais mantidos. Recomendamos que novas implantações para uso em produção usem o MySQL NDB Cluster 8.0.

O conteúdo deste capítulo está sujeito a revisão à medida que o NDB Cluster continua a evoluir. Informações adicionais sobre o NDB Cluster podem ser encontradas no site da MySQL em <http://www.mysql.com/products/cluster/>.

**Recursos adicionais.** Mais informações sobre o NDB Cluster podem ser encontradas nos seguintes locais:

- Para respostas a algumas perguntas frequentes sobre o NDB Cluster, consulte Seção A.10, “Perguntas Frequentes do MySQL 5.7: NDB Cluster”.

- O Fórum do NDB Cluster: <https://forums.mysql.com/list.php?25>.

- Muitos usuários e desenvolvedores do NDB Cluster criam blogs sobre suas experiências com o NDB Cluster e disponibilizam esses feeds no PlanetMySQL.
