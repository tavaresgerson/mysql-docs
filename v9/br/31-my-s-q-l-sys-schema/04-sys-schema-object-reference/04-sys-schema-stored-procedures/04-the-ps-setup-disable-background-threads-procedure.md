#### 30.4.4.4 O procedimento ps\_setup\_disable\_background\_threads()

Desabilita a instrumentação do Schema de Desempenho para todos os threads de segundo plano. Gera um conjunto de resultados indicando quantos threads de segundo plano foram desativados. Os threads já desativados não são contados.

##### Parâmetros

Nenhum.

##### Exemplo

```
mysql> CALL sys.ps_setup_disable_background_threads();
+--------------------------------+
| summary                        |
+--------------------------------+
| Disabled 24 background threads |
+--------------------------------+
```