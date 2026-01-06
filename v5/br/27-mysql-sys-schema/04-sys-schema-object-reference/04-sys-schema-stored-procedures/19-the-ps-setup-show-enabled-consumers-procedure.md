#### 26.4.4.19 O procedimento ps\_setup\_show\_enabled\_consumers()

Exibe todos os consumidores do Schema de Desempenho atualmente habilitados.

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
