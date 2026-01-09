#### 30.4.4.16 O procedimento ps_setup_show_disabled_consumers()

Exibe todos os consumidores do Schema de Desempenho atualmente desativados.

##### Parâmetros

Nenhum.

##### Exemplo

```
mysql> CALL sys.ps_setup_show_disabled_consumers();
+----------------------------------+
| disabled_consumers               |
+----------------------------------+
| events_stages_current            |
| events_stages_history            |
| events_stages_history_long       |
| events_statements_history        |
| events_statements_history_long   |
| events_transactions_history      |
| events_transactions_history_long |
| events_waits_current             |
| events_waits_history             |
| events_waits_history_long        |
+----------------------------------+
```