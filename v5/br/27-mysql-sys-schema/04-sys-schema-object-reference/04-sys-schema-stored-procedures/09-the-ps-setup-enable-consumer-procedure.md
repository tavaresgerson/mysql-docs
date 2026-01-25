#### 26.4.4.9 O Procedure ps_setup_enable_consumer()

Habilita os *consumers* do Performance Schema com nomes que contenham o argumento. Produz um *result set* indicando quantos *consumers* foram habilitados. *Consumers* já habilitados não são contabilizados.

##### Parâmetros

* `consumer VARCHAR(128)`: O valor usado para corresponder aos nomes dos *consumers*, que são identificados pelo uso de `%consumer%` como um operando para uma correspondência de padrão (`pattern match`) `LIKE`.

  Um valor de `''` corresponde a todos os *consumers*.

##### Exemplo

Habilita todos os *statement consumers*:

```sql
mysql> CALL sys.ps_setup_enable_consumer('statement');
+---------------------+
| summary             |
+---------------------+
| Enabled 4 consumers |
+---------------------+
```