#### 26.4.4.10 O Procedimento ps_setup_enable_instrument()

Habilita Instruments do Performance Schema cujos nomes contêm o argumento. Produz um result set indicando quantos Instruments foram habilitados. Instruments já habilitados não são contabilizados.

##### Parâmetros

* `in_pattern VARCHAR(128)`: O valor usado para corresponder aos nomes dos Instruments, que são identificados usando `%in_pattern%` como operando para uma correspondência de Pattern `LIKE`.

  Um valor de `''` corresponde a todos os Instruments.

##### Exemplo

Habilitar um Instrument específico:

```sql
mysql> CALL sys.ps_setup_enable_instrument('wait/lock/metadata/sql/mdl');
+----------------------+
| summary              |
+----------------------+
| Enabled 1 instrument |
+----------------------+
```

Habilitar todos os mutex Instruments:

```sql
mysql> CALL sys.ps_setup_enable_instrument('mutex');
+-------------------------+
| summary                 |
+-------------------------+
| Enabled 177 instruments |
+-------------------------+
```