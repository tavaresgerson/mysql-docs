#### 26.4.4.6 O procedimento ps_setup_disable_instrument()

Desabilita instrumentos do esquema de desempenho com nomes que contenham o argumento. Produz um conjunto de resultados indicando quantos instrumentos foram desativados. Os instrumentos já desativados não são contabilizados.

##### Parâmetros

- `in_pattern VARCHAR(128)`: O valor usado para corresponder aos nomes dos instrumentos, que são identificados usando `%in_pattern%` como um operando para uma correspondência de padrão `LIKE`.

  Um valor de `''` corresponde a todos os instrumentos.

##### Exemplo

Desativar um instrumento específico:

```sql
mysql> CALL sys.ps_setup_disable_instrument('wait/lock/metadata/sql/mdl');
+-----------------------+
| summary               |
+-----------------------+
| Disabled 1 instrument |
+-----------------------+
```

Desative todos os instrumentos de mutex:

```sql
mysql> CALL sys.ps_setup_disable_instrument('mutex');
+--------------------------+
| summary                  |
+--------------------------+
| Disabled 177 instruments |
+--------------------------+
```
