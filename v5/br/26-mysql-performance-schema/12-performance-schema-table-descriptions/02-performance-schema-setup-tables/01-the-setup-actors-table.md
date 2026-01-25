#### 25.12.2.1 A Tabela setup_actors

A tabela [`setup_actors`](performance-schema-setup-actors-table.html "25.12.2.1 The setup_actors Table") contém informações que determinam se o monitoramento e o registro de eventos históricos devem ser habilitados para novos foreground server threads (threads associados a conexões de cliente). Esta tabela tem um tamanho máximo padrão de 100 linhas. Para alterar o tamanho da tabela, modifique a variável de sistema [`performance_schema_setup_actors_size`](performance-schema-system-variables.html#sysvar_performance_schema_setup_actors_size) durante a inicialização do server.

Para cada novo foreground thread, o Performance Schema compara o user e o host do thread com as linhas da tabela [`setup_actors`](performance-schema-setup-actors-table.html "25.12.2.1 The setup_actors Table"). Se uma linha dessa tabela corresponder, seus valores de coluna `ENABLED` e `HISTORY` são usados para definir as colunas `INSTRUMENTED` e `HISTORY`, respectivamente, da linha da tabela [`threads`](performance-schema-threads-table.html "25.12.16.4 The threads Table") para o thread. Isso permite que a instrumentação e o registro de eventos históricos sejam aplicados seletivamente por host, user ou account (combinação de user e host). Se não houver correspondência, as colunas `INSTRUMENTED` e `HISTORY` para o thread são definidas como `NO`.

Para background threads, não há um user associado. `INSTRUMENTED` e `HISTORY` são `YES` por padrão e [`setup_actors`](performance-schema-setup-actors-table.html "25.12.2.1 The setup_actors Table") não é consultada.

O conteúdo inicial da tabela [`setup_actors`](performance-schema-setup-actors-table.html "25.12.2.1 The setup_actors Table") corresponde a qualquer combinação de user e host, de modo que o monitoramento e a coleta de eventos históricos são habilitados por padrão para todos os foreground threads:

```sql
mysql> SELECT * FROM performance_schema.setup_actors;
+------+------+------+---------+---------+
| HOST | USER | ROLE | ENABLED | HISTORY |
+------+------+------+---------+---------+
| %    | %    | %    | YES     | YES     |
+------+------+------+---------+---------+
```

Para obter informações sobre como usar a tabela [`setup_actors`](performance-schema-setup-actors-table.html "25.12.2.1 The setup_actors Table") para afetar o monitoramento de eventos, consulte [Seção 25.4.6, “Pre-Filtering by Thread”](performance-schema-thread-filtering.html "25.4.6 Pre-Filtering by Thread").

Modificações na tabela [`setup_actors`](performance-schema-setup-actors-table.html "25.12.2.1 The setup_actors Table") afetam apenas foreground threads criados subsequentemente à modificação, e não os threads existentes. Para afetar threads existentes, modifique as colunas `INSTRUMENTED` e `HISTORY` das linhas da tabela [`threads`](performance-schema-threads-table.html "25.12.16.4 The threads Table").

A tabela [`setup_actors`](performance-schema-setup-actors-table.html "25.12.2.1 The setup_actors Table") possui as seguintes colunas:

* `HOST`

  O nome do host. Deve ser um nome literal, ou `'%'` para significar "qualquer host".

* `USER`

  O nome do user. Deve ser um nome literal, ou `'%'` para significar "qualquer user".

* `ROLE`

  Não utilizado.

* `ENABLED`

  Se deve habilitar a instrumentation para foreground threads correspondidos pela linha. O valor é `YES` ou `NO`.

* `HISTORY`

  Se deve registrar eventos históricos para foreground threads correspondidos pela linha. O valor é `YES` ou `NO`.

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") é permitido para a tabela [`setup_actors`](performance-schema-setup-actors-table.html "25.12.2.1 The setup_actors Table"). Ele remove as linhas.