#### 13.7.5.7. Declaração SHOW CREATE EVENT EVENT

```sql
SHOW CREATE EVENT event_name
```

Esta declaração exibe a declaração `CREATE EVENT` necessária para recriar um evento específico. Ela requer o privilégio `EVENT` para o banco de dados a partir do qual o evento deve ser exibido. Por exemplo (usando o mesmo evento `e_daily` definido e alterado na Seção 13.7.5.18, “Declaração SHOW EVENTS”):

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

`character_set_client` é o valor da sessão da variável de sistema `character_set_client` quando o evento foi criado. `collation_connection` é o valor da sessão da variável de sistema `collation_connection` quando o evento foi criado. `Database Collation` é a collation do banco de dados com o qual o evento está associado.

A saída reflete o status atual do evento (`ENABLE`) e não o status com o qual ele foi criado.
