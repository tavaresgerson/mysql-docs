#### 26.4.4.4 O Procedure ps_setup_disable_background_threads()

Desabilita a instrumentação do Performance Schema para todos os *background Threads*. Produz um *Result Set* que indica quantos *background Threads* foram desabilitados. *Threads* que já estavam desabilitados não são contabilizados.

##### Parâmetros

Nenhum.

##### Exemplo

```sql
mysql> CALL sys.ps_setup_disable_background_threads();
+--------------------------------+
| summary                        |
+--------------------------------+
| Disabled 24 background threads |
+--------------------------------+
```