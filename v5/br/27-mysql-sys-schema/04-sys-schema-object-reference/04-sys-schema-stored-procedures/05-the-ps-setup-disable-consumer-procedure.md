#### 26.4.4.5 O Procedure ps_setup_disable_consumer()

Desabilita os *consumers* do *Performance Schema* cujos nomes contêm o argumento. Produz um conjunto de resultados (*result set*) indicando quantos *consumers* foram desabilitados. *Consumers* que já estavam desabilitados não são contabilizados.

##### Parâmetros

* `consumer VARCHAR(128)`: O valor usado para corresponder aos nomes dos *consumers*, que são identificados utilizando `%consumer%` como um operando para uma correspondência de padrão `LIKE`.

  Um valor de `''` corresponde a todos os *consumers*.

##### Exemplo

Desabilita todos os *statement consumers*:

```sql
mysql> CALL sys.ps_setup_disable_consumer('statement');
+----------------------+
| summary              |
+----------------------+
| Disabled 4 consumers |
+----------------------+
```