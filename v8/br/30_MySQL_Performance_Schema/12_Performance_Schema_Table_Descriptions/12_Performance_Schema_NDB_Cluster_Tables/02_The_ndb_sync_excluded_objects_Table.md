#### 29.12.12.2 Tabela ndb\_sync\_excluded\_objects

Esta tabela fornece informações sobre os objetos de banco de dados `NDB` que não podem ser sincronizados automaticamente entre o dicionário do NDB Cluster e o dicionário de dados do MySQL.

Informações de exemplo sobre os objetos de banco de dados `NDB` que não podem ser sincronizados com o dicionário de dados do MySQL:

```
mysql> SELECT * FROM performance_schema.ndb_sync_excluded_objects\G
*************************** 1. row ***************************
SCHEMA_NAME: NULL
       NAME: lg1
       TYPE: LOGFILE GROUP
     REASON: Injected failure
*************************** 2. row ***************************
SCHEMA_NAME: NULL
       NAME: ts1
       TYPE: TABLESPACE
     REASON: Injected failure
*************************** 3. row ***************************
SCHEMA_NAME: db1
       NAME: NULL
       TYPE: SCHEMA
     REASON: Injected failure
*************************** 4. row ***************************
SCHEMA_NAME: test
       NAME: t1
       TYPE: TABLE
     REASON: Injected failure
*************************** 5. row ***************************
SCHEMA_NAME: test
       NAME: t2
       TYPE: TABLE
     REASON: Injected failure
*************************** 6. row ***************************
SCHEMA_NAME: test
       NAME: t3
       TYPE: TABLE
     REASON: Injected failure
```

A tabela `ndb_sync_excluded_objects` tem essas colunas:

- `SCHEMA_NAME`: O nome do esquema (banco de dados) no qual o objeto que não conseguiu se sincronizar reside; isso é `NULL` para espaços de tabela e grupos de arquivos de log

- `NAME`: O nome do objeto que não conseguiu se sincronizar; isso é `NULL` se o objeto for um esquema

- `TYPE`: O tipo do objeto não conseguiu se sincronizar; isso é um dos `LOGFILE GROUP`, `TABLESPACE`, `SCHEMA` ou `TABLE`

- `REASON`: A razão para a exclusão (bloqueio) do objeto; ou seja, a razão para o fracasso na sincronização deste objeto

  As possíveis razões incluem as seguintes:

  - `Injected failure`

  - `Failed to determine if object existed in NDB`

  - `Failed to determine if object existed in DD`

  - `Failed to drop object in DD`

  - `Failed to get undofiles assigned to logfile group`

  - `Failed to get object id and version`

  - `Failed to install object in DD`

  - `Failed to get datafiles assigned to tablespace`

  - `Failed to create schema`

  - `Failed to determine if object was a local table`

  - `Failed to invalidate table references`

  - `Failed to set database name of NDB object`

  - `Failed to get extra metadata of table`

  - `Failed to migrate table with extra metadata version 1`

  - `Failed to get object from DD`

  - `Definition of table has changed in NDB Dictionary`

  - `Failed to setup binlogging for table`

  Esta lista não é necessariamente exaustiva e está sujeita a alterações em futuras versões do `NDB`.

A tabela `ndb_sync_excluded_objects` foi adicionada no NDB 8.0.21.
