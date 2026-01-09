#### 26.4.4.4 O procedimento ps_setup_disable_background_threads()

Desabilita a instrumentação do Schema de Desempenho para todos os threads de segundo plano. Produz um conjunto de resultados que indica quantos threads de segundo plano foram desativados. Os threads já desativados não são contados.

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
