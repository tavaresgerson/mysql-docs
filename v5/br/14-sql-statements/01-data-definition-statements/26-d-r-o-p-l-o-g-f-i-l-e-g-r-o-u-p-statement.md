### 13.1.26 Declaração DROP LOGFILE GROUP

```sql
DROP LOGFILE GROUP logfile_group
    ENGINE [=] engine_name
```

Essa declaração exclui o grupo de arquivos de registro com o nome *`logfile_group`*. O grupo de arquivos de registro deve já existir ou ocorrerá um erro. (Para obter informações sobre como criar grupos de arquivos de registro, consulte Seção 13.1.15, “Instrução CREATE LOGFILE GROUP”.)

Importante

Antes de excluir um grupo de arquivos de registro, você deve excluir todos os espaços de tabela que utilizam esse grupo de arquivos de registro para o registro `UNDO`.

A cláusula `ENGINE` necessária fornece o nome do motor de armazenamento usado pelo grupo de arquivos de registro a ser excluído. Atualmente, os únicos valores permitidos para *`engine_name`* são `NDB` e `NDBCLUSTER`.

`DROP LOGFILE GROUP` é útil apenas com o armazenamento de dados de disco para o NDB Cluster. Veja Seção 21.6.11, “Tabelas de Dados de Disco do NDB Cluster”.
