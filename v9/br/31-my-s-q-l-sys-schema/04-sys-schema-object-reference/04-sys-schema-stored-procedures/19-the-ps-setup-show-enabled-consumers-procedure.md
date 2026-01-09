#### 30.4.4.19 O procedimento ps_setup_show_enabled_consumers()

Exibe todos os consumidores do Schema de Desempenho atualmente habilitados.

##### Parâmetros

Nenhum.

##### Exemplo

```
mysql> CALL sys.ps_setup_show_enabled_consumers();
+-----------------------------+
| enabled_consumers           |
+-----------------------------+
| events_statements_current   |
| events_statements_history   |
| events_transactions_current |
| events_transactions_history |
| global_instrumentation      |
| statements_digest           |
| thread_instrumentation      |
+-----------------------------+
```