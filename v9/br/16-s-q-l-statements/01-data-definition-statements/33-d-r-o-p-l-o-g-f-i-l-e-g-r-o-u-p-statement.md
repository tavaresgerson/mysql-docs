### 15.1.33 Declaração DROP LOGFILE GROUP

```
DROP LOGFILE GROUP logfile_group
    ENGINE [=] engine_name
```

Esta declaração exclui o grupo de arquivos de log com o nome *`logfile_group`*. O grupo de arquivos de log deve já existir ou ocorrerá um erro. (Para informações sobre a criação de grupos de arquivos de log, consulte a Seção 15.1.20, “Declaração CREATE LOGFILE GROUP”.)

Importante

Antes de excluir um grupo de arquivos de log, você deve excluir todos os espaços de tabela que utilizam esse grupo de arquivos de log para a logon `UNDO`.

A cláusula `ENGINE` necessária fornece o nome do motor de armazenamento utilizado pelo grupo de arquivos de log a ser excluído. Os únicos valores permitidos para *`engine_name`* são `NDB` e `NDBCLUSTER`.

`DROP LOGFILE GROUP` é útil apenas com o armazenamento de Dados de Disco para NDB Cluster. Consulte a Seção 25.6.11, “Tabelas de Dados de Disco de NDB Cluster”.