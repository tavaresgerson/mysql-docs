#### 26.4.4.19 A Procedure ps_setup_show_enabled_consumers()

Exibe todos os consumers do Performance Schema atualmente habilitados.

##### Parâmetros

Nenhum.

##### Exemplo

```sql
mysql> CALL sys.ps_setup_show_enabled_consumers();
+---------------------------+
| enabled_consumers         |
+---------------------------+
| events_statements_current |
| events_statements_history |
| global_instrumentation    |
| statements_digest         |
| thread_instrumentation    |
+---------------------------+
```