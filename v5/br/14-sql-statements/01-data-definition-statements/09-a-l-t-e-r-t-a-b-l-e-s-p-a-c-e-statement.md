### 13.1.9 ALTER TABLESPACE Statement

```sql
ALTER TABLESPACE tablespace_name
    {ADD | DROP} DATAFILE 'file_name'
    [INITIAL_SIZE [=] size]
    [WAIT]
    ENGINE [=] engine_name
```

Esta instrução é usada para adicionar um novo data file ou para descartar um data file de um tablespace.

A variante `ADD DATAFILE` permite especificar um tamanho inicial usando uma cláusula `INITIAL_SIZE`, onde *`tamanho`* é medido em bytes; o valor padrão é 134217728 (128 MB). Opcionalmente, você pode seguir *`tamanho`* com uma abreviação de uma letra para uma ordem de magnitude, semelhante às usadas em `my.cnf`. Geralmente, esta é uma das letras `M` (megabytes) ou `G` (gigabytes).

Nota

Todos os objetos NDB Cluster Disk Data compartilham o mesmo namespace. Isso significa que *cada objeto Disk Data* deve ter um nome exclusivo (e não apenas cada objeto Disk Data de um determinado tipo). Por exemplo, você não pode ter um tablespace e um data file com o mesmo nome, nem um arquivo de log de undo e um tablespace com o mesmo nome.

Em sistemas de 32 bits, o valor máximo suportado para `INITIAL_SIZE` é 4294967296 (4 GB). (Bug #29186)

`INITIAL_SIZE` é explicitamente arredondado, assim como para [`CREATE TABLESPACE`](create-tablespace.html "13.1.19 CREATE TABLESPACE Statement").

Uma vez que um data file tenha sido criado, seu tamanho não pode ser alterado; no entanto, você pode adicionar mais data files ao tablespace usando instruções `ALTER TABLESPACE ... ADD DATAFILE` adicionais.

Usar `DROP DATAFILE` com [`ALTER TABLESPACE`](alter-tablespace.html "13.1.9 ALTER TABLESPACE Statement") descarta o data file '*`file_name`*' do tablespace. Você não pode descartar um data file de um tablespace que esteja em uso por qualquer tabela; em outras palavras, o data file deve estar vazio (nenhum extent usado). Veja [Section 21.6.11.1, “NDB Cluster Disk Data Objects”](mysql-cluster-disk-data-objects.html "21.6.11.1 NDB Cluster Disk Data Objects"). Além disso, qualquer data file a ser descartado deve ter sido adicionado previamente ao tablespace com [`CREATE TABLESPACE`](create-tablespace.html "13.1.19 CREATE TABLESPACE Statement") ou [`ALTER TABLESPACE`](alter-tablespace.html "13.1.9 ALTER TABLESPACE Statement").

Ambos `ALTER TABLESPACE ... ADD DATAFILE` e `ALTER TABLESPACE ... DROP DATAFILE` exigem uma cláusula `ENGINE` que especifica o storage engine usado pelo tablespace. Atualmente, os únicos valores aceitos para *`engine_name`* são [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") e [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6").

`WAIT` é analisado, mas ignorado de outra forma, e, portanto, não tem efeito no MySQL 5.7. Ele é destinado a expansão futura.

Quando `ALTER TABLESPACE ... ADD DATAFILE` é usado com `ENGINE = NDB`, um data file é criado em cada data node do Cluster. Você pode verificar se os data files foram criados e obter informações sobre eles consultando a tabela [`FILES`](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table") do Information Schema. Por exemplo, a seguinte Query mostra todos os data files pertencentes ao tablespace nomeado `newts`:

```sql
mysql> SELECT LOGFILE_GROUP_NAME, FILE_NAME, EXTRA
    -> FROM INFORMATION_SCHEMA.FILES
    -> WHERE TABLESPACE_NAME = 'newts' AND FILE_TYPE = 'DATAFILE';
+--------------------+--------------+----------------+
| LOGFILE_GROUP_NAME | FILE_NAME    | EXTRA          |
+--------------------+--------------+----------------+
| lg_3               | newdata.dat  | CLUSTER_NODE=3 |
| lg_3               | newdata.dat  | CLUSTER_NODE=4 |
| lg_3               | newdata2.dat | CLUSTER_NODE=3 |
| lg_3               | newdata2.dat | CLUSTER_NODE=4 |
+--------------------+--------------+----------------+
2 rows in set (0.03 sec)
```

Veja [Section 24.3.9, “The INFORMATION_SCHEMA FILES Table”](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table").

[`ALTER TABLESPACE`](alter-tablespace.html "13.1.9 ALTER TABLESPACE Statement") é útil apenas com Disk Data storage para NDB Cluster. Veja [Section 21.6.11, “NDB Cluster Disk Data Tables”](mysql-cluster-disk-data.html "21.6.11 NDB Cluster Disk Data Tables").