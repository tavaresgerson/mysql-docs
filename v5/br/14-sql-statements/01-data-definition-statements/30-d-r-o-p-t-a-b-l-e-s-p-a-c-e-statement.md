### 13.1.30 Declaração DROP TABLESPACE

```sql
DROP TABLESPACE tablespace_name
    [ENGINE [=] engine_name]
```

Esta declaração descarta um tablespace que foi previamente criado usando [`CREATE TABLESPACE`](create-tablespace.html "13.1.19 CREATE TABLESPACE Statement"). Ela é suportada em todos os lançamentos do MySQL NDB Cluster 7.5, e também com `InnoDB` no MySQL Server padrão.

`ENGINE` define a storage engine que usa o tablespace, onde *`engine_name`* é o nome da storage engine. Atualmente, os valores `InnoDB` e `NDB` são suportados. Se não for definido, o valor de [`default_storage_engine`](server-system-variables.html#sysvar_default_storage_engine) é usado. Se não for o mesmo que a storage engine usada para criar o tablespace, a declaração `DROP TABLESPACE` falha.

Para um tablespace `InnoDB`, todas as tables devem ser descartadas (dropped) do tablespace antes de uma operação `DROP TABLESPACE`. Se o tablespace não estiver vazio, `DROP TABLESPACE` retorna um erro.

Assim como no tablespace de sistema do `InnoDB`, truncar ou descartar tables `InnoDB` armazenadas em um general tablespace cria espaço livre no [.ibd data file](glossary.html#glos_ibd_file ".ibd file") do tablespace, que só pode ser usado para novos dados `InnoDB`. O espaço não é liberado de volta para o sistema operacional por tais operações, como ocorre com tablespaces file-per-table.

Um tablespace `NDB` a ser descartado não deve conter nenhum data file; em outras palavras, antes que você possa descartar um tablespace `NDB`, você deve primeiro descartar cada um de seus data files usando [`ALTER TABLESPACE ... DROP DATAFILE`](alter-tablespace.html "13.1.9 ALTER TABLESPACE Statement").

#### Notas

*   Tablespaces não são excluídos automaticamente. Um tablespace deve ser descartado explicitamente usando `DROP TABLESPACE`. [`DROP DATABASE`](drop-database.html "13.1.22 DROP DATABASE Statement") não tem efeito a este respeito, mesmo que a operação descarte todas as tables pertencentes ao tablespace.

*   Uma operação [`DROP DATABASE`](drop-database.html "13.1.22 DROP DATABASE Statement") pode descartar tables que pertencem a um general tablespace, mas não pode descartar o tablespace, mesmo que a operação descarte todas as tables que pertencem ao tablespace. O tablespace deve ser descartado explicitamente usando `DROP TABLESPACE tablespace_name`.

*   Similar ao tablespace de sistema, truncar ou descartar tables armazenadas em um general tablespace cria espaço livre internamente no [.ibd data file](glossary.html#glos_ibd_file ".ibd file") do general tablespace, que só pode ser usado para novos dados `InnoDB`. O espaço não é liberado de volta para o sistema operacional, como ocorre com tablespaces file-per-table.

#### Exemplo InnoDB

Este exemplo demonstra como descartar um general tablespace `InnoDB`. O general tablespace `ts1` é criado com uma única table. Antes de descartar o tablespace, a table deve ser descartada (dropped).

```sql
mysql> CREATE TABLESPACE `ts1` ADD DATAFILE 'ts1.ibd' Engine=InnoDB;

mysql> CREATE TABLE t1 (c1 INT PRIMARY KEY) TABLESPACE ts1 Engine=InnoDB;

mysql> DROP TABLE t1;

mysql> DROP TABLESPACE ts1;
```

#### Exemplo NDB

Este exemplo mostra como descartar um tablespace `NDB` chamado `myts` que possui um data file chamado `mydata-1.dat` após a criação inicial do tablespace, e assume a existência de um log file group chamado `mylg` (veja [Seção 13.1.15, “Declaração CREATE LOGFILE GROUP”](create-logfile-group.html "13.1.15 CREATE LOGFILE GROUP Statement")).

```sql
mysql> CREATE TABLESPACE myts
    ->     ADD DATAFILE 'mydata-1.dat'
    ->     USE LOGFILE GROUP mylg
    ->     ENGINE=NDB;
```

Você deve remover todos os data files do tablespace usando [`ALTER TABLESPACE`](alter-tablespace.html "13.1.9 ALTER TABLESPACE Statement"), conforme mostrado aqui, antes que ele possa ser descartado:

```sql
mysql> ALTER TABLESPACE myts
    ->     DROP DATAFILE 'mydata-1.dat'
    ->     ENGINE=NDB;

mysql> DROP TABLESPACE myts;
```