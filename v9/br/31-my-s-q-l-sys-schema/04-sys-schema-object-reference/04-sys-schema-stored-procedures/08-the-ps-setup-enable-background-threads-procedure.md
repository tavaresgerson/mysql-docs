#### 30.4.4.8 O procedimento ps_setup_enable_background_threads()

Habilita a instrumentação do Schema de Desempenho para todos os threads de segundo plano. Gera um conjunto de resultados indicando quantos threads de segundo plano foram habilitados. Os threads já habilitados não são contados.

##### Parâmetros

Nenhum.

##### Exemplo

```
mysql> CALL sys.ps_setup_enable_background_threads();
+-------------------------------+
| summary                       |
+-------------------------------+
| Enabled 24 background threads |
+-------------------------------+
```