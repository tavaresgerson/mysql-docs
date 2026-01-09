#### 30.4.4.9 O procedimento ps_setup_enable_consumer()

Habilita consumidores do Schema de Desempenho com nomes que contenham o argumento. Produz um conjunto de resultados indicando quantos consumidores foram habilitados. Os consumidores já habilitados não são contados.

##### Parâmetros

* `consumer VARCHAR(128)`: O valor usado para corresponder aos nomes dos consumidores, que são identificados usando `%consumer%` como um operando para uma correspondência de padrão `LIKE`.

  Um valor de `''` corresponde a todos os consumidores.

##### Exemplo

Habilitar todos os consumidores da declaração de comando:

```
mysql> CALL sys.ps_setup_enable_consumer('statement');
+---------------------+
| summary             |
+---------------------+
| Enabled 4 consumers |
+---------------------+
```