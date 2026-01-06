#### 26.4.4.9 O procedimento ps\_setup\_enable\_consumer()

Habilita os consumidores do Schema de Desempenho com nomes que contenham o argumento. Produz um conjunto de resultados indicando quantos consumidores foram habilitados. Os consumidores já habilitados não são contabilizados.

##### Parâmetros

- `consumer VARCHAR(128)`: O valor usado para combinar nomes de consumidores, que são identificados usando `%consumer%` como um operando para uma correspondência de padrão `LIKE`.

  Um valor de `''` corresponde a todos os consumidores.

##### Exemplo

Ative todos os consumidores de declarações:

```sql
mysql> CALL sys.ps_setup_enable_consumer('statement');
+---------------------+
| summary             |
+---------------------+
| Enabled 4 consumers |
+---------------------+
```
