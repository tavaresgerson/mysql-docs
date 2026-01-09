#### 30.4.4.6 O procedimento ps_setup_disable_instrument()

Desabilita instrumentos do Schema de Desempenho com nomes que contenham o argumento. Produz um conjunto de resultados indicando quantos instrumentos foram desabilitados. Os instrumentos já desabilitados não são contados.

##### Parâmetros

* `in_pattern VARCHAR(128)`: O valor usado para corresponder aos nomes dos instrumentos, que são identificados usando `%in_pattern%` como um operando para uma correspondência de padrão `LIKE`.

Um valor de `''` corresponde a todos os instrumentos.

##### Exemplo

Desabilitar um instrumento específico:

```
mysql> CALL sys.ps_setup_disable_instrument('wait/lock/metadata/sql/mdl');
+-----------------------+
| summary               |
+-----------------------+
| Disabled 1 instrument |
+-----------------------+
```

Desabilitar todos os instrumentos mutex:

```
mysql> CALL sys.ps_setup_disable_instrument('mutex');
+--------------------------+
| summary                  |
+--------------------------+
| Disabled 177 instruments |
+--------------------------+
```