#### 30.4.4.10 O procedimento ps\_setup\_enable\_instrument()

Habilita instrumentos do Schema de Desempenho com nomes que contenham o argumento. Produz um conjunto de resultados indicando quantos instrumentos foram habilitados. Os instrumentos já habilitados não são contados.

##### Parâmetros

* `in_pattern VARCHAR(128)`: O valor usado para corresponder aos nomes dos instrumentos, que são identificados usando `%in_pattern%` como um operando para uma correspondência de padrão `LIKE`.

Um valor de `''` corresponde a todos os instrumentos.

##### Exemplo

Habilitar um instrumento específico:

```
mysql> CALL sys.ps_setup_enable_instrument('wait/lock/metadata/sql/mdl');
+----------------------+
| summary              |
+----------------------+
| Enabled 1 instrument |
+----------------------+
```

Habilitar todos os instrumentos mutex:

```
mysql> CALL sys.ps_setup_enable_instrument('mutex');
+-------------------------+
| summary                 |
+-------------------------+
| Enabled 177 instruments |
+-------------------------+
```