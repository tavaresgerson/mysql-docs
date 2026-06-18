#### 26.4.4.8 O Procedure ps_setup_enable_background_threads()

Habilita a instrumentação do Performance Schema para todos os background threads. Produz um conjunto de resultados indicando quantos background threads foram habilitados. Threads já habilitados não são contabilizados.

##### Parâmetros

Nenhum.

##### Exemplo

```sql
mysql> CALL sys.ps_setup_enable_background_threads();
+-------------------------------+
| summary                       |
+-------------------------------+
| Enabled 24 background threads |
+-------------------------------+
```