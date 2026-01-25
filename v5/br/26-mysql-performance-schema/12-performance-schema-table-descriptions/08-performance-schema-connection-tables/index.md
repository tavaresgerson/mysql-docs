### 25.12.8 Tabelas de Connection do Performance Schema

[25.12.8.1 A Tabela accounts](performance-schema-accounts-table.html)

[25.12.8.2 A Tabela hosts](performance-schema-hosts-table.html)

[25.12.8.3 A Tabela users](performance-schema-users-table.html)

Quando um cliente se conecta ao servidor MySQL, ele o faz sob um nome de user específico e a partir de um host específico. O Performance Schema fornece estatísticas sobre essas Connections, rastreando-as por account (combinação de user e host), bem como separadamente por nome de user e nome de host, usando estas tabelas:

* [`accounts`](performance-schema-accounts-table.html "25.12.8.1 A Tabela accounts"): Estatísticas de Connection por account do cliente

* [`hosts`](performance-schema-hosts-table.html "25.12.8.2 A Tabela hosts"): Estatísticas de Connection por nome de host do cliente

* [`users`](performance-schema-users-table.html "25.12.8.3 A Tabela users"): Estatísticas de Connection por nome de user do cliente

O significado de "account" nas tabelas de Connection é semelhante ao seu significado nas grant tables do MySQL no Database de sistema `mysql`, no sentido de que o termo se refere a uma combinação de valores de user e host. Eles diferem no fato de que, para as grant tables, a parte host de um account pode ser um padrão (pattern), enquanto para as tabelas do Performance Schema, o valor do host é sempre um nome de host específico sem padrão (nonpattern).

Cada tabela de Connection possui as colunas `CURRENT_CONNECTIONS` e `TOTAL_CONNECTIONS` para rastrear o número atual e total de Connections por "valor de rastreamento" (tracking value) no qual suas estatísticas são baseadas. As tabelas diferem no que usam para o valor de rastreamento. A tabela [`accounts`](performance-schema-accounts-table.html "25.12.8.1 A Tabela accounts") possui as colunas `USER` e `HOST` para rastrear Connections por combinação de user e host. As tabelas [`users`](performance-schema-users-table.html "25.12.8.3 A Tabela users") e [`hosts`](performance-schema-hosts-table.html "25.12.8.2 A Tabela hosts") possuem uma coluna `USER` e `HOST`, respectivamente, para rastrear Connections por nome de user e nome de host.

O Performance Schema também contabiliza Threads internos e Threads para sessões de user que falharam na autenticação, usando linhas com valores `NULL` nas colunas `USER` e `HOST`.

Suponha que clientes chamados `user1` e `user2` se conectem uma vez cada, a partir de `hosta` e `hostb`. O Performance Schema rastreia as Connections da seguinte forma:

* A tabela [`accounts`](performance-schema-accounts-table.html "25.12.8.1 A Tabela accounts") tem quatro linhas, para os valores de account `user1`/`hosta`, `user1`/`hostb`, `user2`/`hosta` e `user2`/`hostb`, com cada linha contando uma Connection por account.

* A tabela [`hosts`](performance-schema-hosts-table.html "25.12.8.2 A Tabela hosts") tem duas linhas, para `hosta` e `hostb`, com cada linha contando duas Connections por nome de host.

* A tabela [`users`](performance-schema-users-table.html "25.12.8.3 A Tabela users") tem duas linhas, para `user1` e `user2`, com cada linha contando duas Connections por nome de user.

Quando um cliente se conecta, o Performance Schema determina qual linha em cada tabela de Connection se aplica, usando o valor de rastreamento apropriado para cada tabela. Se não houver tal linha, uma é adicionada. Em seguida, o Performance Schema incrementa em um as colunas `CURRENT_CONNECTIONS` e `TOTAL_CONNECTIONS` nessa linha.

Quando um cliente se desconecta, o Performance Schema decrementa em um a coluna `CURRENT_CONNECTIONS` na linha e mantém a coluna `TOTAL_CONNECTIONS` inalterada.

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") é permitido para tabelas de Connection. Ele tem os seguintes efeitos:

* Linhas são removidas para accounts, hosts ou users que não possuem Connections atuais (linhas com `CURRENT_CONNECTIONS = 0`).

* Linhas não removidas são redefinidas para contar apenas Connections atuais: Para linhas com `CURRENT_CONNECTIONS > 0`, `TOTAL_CONNECTIONS` é redefinido para `CURRENT_CONNECTIONS`.

* Tabelas de resumo (summary tables) que dependem da tabela de Connection são implicitamente truncadas, conforme descrito posteriormente nesta seção.

O Performance Schema mantém summary tables que agregam estatísticas de Connection para vários tipos de eventos por account, host ou user. Essas tabelas têm `_summary_by_account`, `_summary_by_host` ou `_summary_by_user` no nome. Para identificá-las, use esta Query:

```sql
mysql> SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
       WHERE TABLE_SCHEMA = 'performance_schema'
       AND TABLE_NAME REGEXP '_summary_by_(account|host|user)'
       ORDER BY TABLE_NAME;
+------------------------------------------------------+
| TABLE_NAME                                           |
+------------------------------------------------------+
| events_stages_summary_by_account_by_event_name       |
| events_stages_summary_by_host_by_event_name          |
| events_stages_summary_by_user_by_event_name          |
| events_statements_summary_by_account_by_event_name   |
| events_statements_summary_by_host_by_event_name      |
| events_statements_summary_by_user_by_event_name      |
| events_transactions_summary_by_account_by_event_name |
| events_transactions_summary_by_host_by_event_name    |
| events_transactions_summary_by_user_by_event_name    |
| events_waits_summary_by_account_by_event_name        |
| events_waits_summary_by_host_by_event_name           |
| events_waits_summary_by_user_by_event_name           |
| memory_summary_by_account_by_event_name              |
| memory_summary_by_host_by_event_name                 |
| memory_summary_by_user_by_event_name                 |
+------------------------------------------------------+
```

Para obter detalhes sobre summary tables de Connection individuais, consulte a seção que descreve as tabelas para o tipo de evento resumido:

* Resumos de eventos Wait: [Section 25.12.15.1, “Wait Event Summary Tables”](performance-schema-wait-summary-tables.html "25.12.15.1 Wait Event Summary Tables")

* Resumos de eventos Stage: [Section 25.12.15.2, “Stage Summary Tables”](performance-schema-stage-summary-tables.html "25.12.15.2 Stage Summary Tables")

* Resumos de eventos Statement: [Section 25.12.15.3, “Statement Summary Tables”](performance-schema-statement-summary-tables.html "25.12.15.3 Statement Summary Tables")

* Resumos de eventos Transaction: [Section 25.12.15.4, “Transaction Summary Tables”](performance-schema-transaction-summary-tables.html "25.12.15.4 Transaction Summary Tables")

* Resumos de eventos Memory: [Section 25.12.15.9, “Memory Summary Tables”](performance-schema-memory-summary-tables.html "25.12.15.9 Memory Summary Tables")

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") é permitido para as summary tables de Connection. Ele remove linhas para accounts, hosts ou users sem Connections, e redefine as colunas de resumo para zero nas linhas restantes. Além disso, cada summary table que é agregada por account, host, user ou Thread é implicitamente truncada pelo truncamento da tabela de Connection da qual ela depende. A tabela a seguir descreve a relação entre o truncamento da tabela de Connection e as tabelas implicitamente truncadas.

**Tabela 25.2 Efeitos Implícitos do Truncamento de Tabelas de Connection**

| Tabela de Connection Truncada | Summary Tables Implicitamente Truncadas |
|---|---|
| `accounts` | Tabelas com nomes contendo `_summary_by_account`, `_summary_by_thread` |
| `hosts` | Tabelas com nomes contendo `_summary_by_account`, `_summary_by_host`, `_summary_by_thread` |
| `users` | Tabelas com nomes contendo `_summary_by_account`, `_summary_by_user`, `_summary_by_thread` |

Truncar uma summary table `_summary_global` também trunca implicitamente suas summary tables de Connection e Thread correspondentes. Por exemplo, truncar [`events_waits_summary_global_by_event_name`](performance-schema-wait-summary-tables.html "25.12.15.1 Wait Event Summary Tables") trunca implicitamente as summary tables de eventos Wait que são agregadas por account, host, user ou Thread.