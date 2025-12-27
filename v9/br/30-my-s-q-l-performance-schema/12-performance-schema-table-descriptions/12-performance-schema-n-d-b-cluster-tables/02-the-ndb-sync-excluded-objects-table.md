#### 29.12.12.2 A tabela ndb\_sync\_excluded\_objects

Esta tabela fornece informações sobre os objetos do banco de dados `NDB` que não podem ser sincronizados automaticamente entre o dicionário do NDB Cluster e o dicionário de dados do MySQL.

Informações de exemplo sobre objetos do banco de dados `NDB` que não podem ser sincronizados com o dicionário de dados do MySQL:

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

A tabela `ndb_sync_excluded_objects` tem as seguintes colunas:

* `SCHEMA_NAME`: O nome do esquema (banco de dados) no qual o objeto que não conseguiu ser sincronizado reside; isso é `NULL` para espaços de armazenamento e grupos de arquivos de log

* `NAME`: O nome do objeto que não conseguiu ser sincronizado; isso é `NULL` se o objeto for um esquema

* `TYPE`: O tipo do objeto que não conseguiu ser sincronizado; isso é um dos `LOGFILE GROUP`, `TABLESPACE`, `SCHEMA` ou `TABLE`

* `REASON`: A razão para a exclusão (bloqueio) do objeto; ou seja, a razão para o erro de sincronização deste objeto

As razões possíveis incluem as seguintes:

+ `Falha injetada`
+ `Não conseguiu determinar se o objeto existia no NDB`
+ `Não conseguiu determinar se o objeto existia no DD`
+ `Não conseguiu descartar o objeto no DD`
+ `Não conseguiu atribuir arquivos de dados ao grupo de arquivos de log`
+ `Não conseguiu obter o ID e a versão do objeto`
+ `Não conseguiu instalar o objeto no DD`
+ `Não conseguiu atribuir arquivos de dados ao espaço de armazenamento`
+ `Não conseguiu criar o esquema`
+ `Não conseguiu determinar se o objeto era uma tabela local`
+ `Não conseguiu invalidar referências de tabela`
+ `Não conseguiu definir o nome do banco de dados do objeto NDB`
+ `Não conseguiu obter metadados extras da tabela`
+ `Não conseguiu migrar a tabela com metadados extras versão 1`
+ `Não conseguiu obter o objeto do DD`
+ `A definição da tabela mudou no Dicionário NDB`
+ `Não conseguiu configurar o binlogging para a tabela`

Esta lista não é necessariamente exaustiva e está sujeita a alterações em futuras versões do `NDB`.