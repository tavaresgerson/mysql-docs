#### 13.7.5.7 Instrução SHOW CREATE EVENT

```sql
SHOW CREATE EVENT event_name
```

Esta instrução exibe a instrução [`CREATE EVENT`](create-event.html "13.1.12 CREATE EVENT Statement") necessária para recriar um determinado Event. Ela requer o `privilege` [`EVENT`](privileges-provided.html#priv_event) para o Database do qual o Event deve ser mostrado. Por exemplo (usando o mesmo Event `e_daily` definido e depois alterado na [Seção 13.7.5.18, “SHOW EVENTS Statement”](show-events.html "13.7.5.18 SHOW EVENTS Statement")):

```sql
mysql> SHOW CREATE EVENT myschema.e_daily\G
*************************** 1. row ***************************
               Event: e_daily
            sql_mode: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,
                      NO_ZERO_IN_DATE,NO_ZERO_DATE,
                      ERROR_FOR_DIVISION_BY_ZERO,
                      NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION
           time_zone: SYSTEM
        Create Event: CREATE DEFINER=`jon`@`ghidora` EVENT `e_daily`
                        ON SCHEDULE EVERY 1 DAY
                        STARTS CURRENT_TIMESTAMP + INTERVAL 6 HOUR
                        ON COMPLETION NOT PRESERVE
                        ENABLE
                        COMMENT 'Saves total number of sessions then
                                clears the table each day'
                        DO BEGIN
                          INSERT INTO site_activity.totals (time, total)
                            SELECT CURRENT_TIMESTAMP, COUNT(*)
                              FROM site_activity.sessions;
                          DELETE FROM site_activity.sessions;
                        END
character_set_client: utf8
collation_connection: utf8_general_ci
  Database Collation: latin1_swedish_ci
```

`character_set_client` é o valor da `session` da `system variable` [`character_set_client`](server-system-variables.html#sysvar_character_set_client) quando o Event foi criado. `collation_connection` é o valor da `session` da `system variable` [`collation_connection`](server-system-variables.html#sysvar_collation_connection) quando o Event foi criado. `Database Collation` é a `collation` do Database ao qual o Event está associado.

A saída reflete o status atual do Event (`ENABLE`) em vez do status com o qual ele foi criado.