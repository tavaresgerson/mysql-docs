#### 26.4.4.6 O Procedure ps_setup_disable_instrument()

Desabilita instruments do Performance Schema cujos nomes contenham o argumento. Produz um result set indicando quantos instruments foram desabilitados. Instruments que já estavam desabilitados não são contados.

##### Parâmetros

* `in_pattern VARCHAR(128)`: O valor usado para corresponder (match) nomes de instrument, que são identificados usando `%in_pattern%` como um operando para uma correspondência de padrão `LIKE`.

  Um valor de `''` corresponde a todos os instruments.

##### Exemplo

Desabilita um instrument específico:

```sql
mysql> CALL sys.ps_setup_disable_instrument('wait/lock/metadata/sql/mdl');
+-----------------------+
| summary               |
+-----------------------+
| Disabled 1 instrument |
+-----------------------+
```

Desabilita todos os instruments de mutex:

```sql
mysql> CALL sys.ps_setup_disable_instrument('mutex');
+--------------------------+
| summary                  |
+--------------------------+
| Disabled 177 instruments |
+--------------------------+
```