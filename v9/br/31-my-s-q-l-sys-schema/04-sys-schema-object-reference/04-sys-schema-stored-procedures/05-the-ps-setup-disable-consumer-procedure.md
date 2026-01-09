#### 30.4.4.5 O procedimento ps_setup_disable_consumer()

Desabilita os consumidores do Schema de Desempenho com nomes que contêm o argumento. Produz um conjunto de resultados indicando quantos consumidores foram desativados. Os consumidores já desativados não são contados.

##### Parâmetros

* `consumer VARCHAR(128)`: O valor usado para corresponder aos nomes dos consumidores, que são identificados usando `%consumer%` como um operando para uma correspondência de padrão `LIKE`.

  Um valor de `''` corresponde a todos os consumidores.

##### Exemplo

Desabilitar todos os consumidores de declaração:

```
mysql> CALL sys.ps_setup_disable_consumer('statement');
+----------------------+
| summary              |
+----------------------+
| Disabled 4 consumers |
+----------------------+
```