#### 29.12.12.1 A tabela ndb_sync_pending_objects

Esta tabela fornece informações sobre os objetos do banco de dados `NDB` para os quais foram detectados desvios e que estão aguardando a sincronização entre o dicionário `NDB` e o dicionário de dados MySQL.

Informações de exemplo sobre objetos do banco de dados `NDB` aguardando sincronização:

```
mysql> SELECT * FROM performance_schema.ndb_sync_pending_objects;
+-------------+------+----------------+
| SCHEMA_NAME | NAME |  TYPE          |
+-------------+------+----------------+
| NULL        | lg1  |  LOGFILE GROUP |
| NULL        | ts1  |  TABLESPACE    |
| db1         | NULL |  SCHEMA        |
| test        | t1   |  TABLE         |
| test        | t2   |  TABLE         |
| test        | t3   |  TABLE         |
+-------------+------+----------------+
```

A tabela `ndb_sync_pending_objects` tem as seguintes colunas:

* `SCHEMA_NAME`: O nome do esquema (banco de dados) no qual o objeto aguardando sincronização reside; este é `NULL` para espaços de armazenamento e grupos de arquivos de log

* `NAME`: O nome do objeto aguardando sincronização; este é `NULL` se o objeto for um esquema

* `TYPE`: O tipo do objeto aguardando sincronização; este é um dos valores `LOGFILE GROUP`, `TABLESPACE`, `SCHEMA` ou `TABLE`