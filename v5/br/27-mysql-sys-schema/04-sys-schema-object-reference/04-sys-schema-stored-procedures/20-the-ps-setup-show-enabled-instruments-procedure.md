#### 26.4.4.20 A Procedure ps_setup_show_enabled_instruments()

Exibe todos os *instruments* do *Performance Schema* atualmente habilitados. Esta pode ser uma longa lista.

##### Parâmetros

Nenhum.

##### Exemplo

```sql
mysql> CALL sys.ps_setup_show_enabled_instruments()\G
*************************** 1. row ***************************
enabled_instruments: wait/io/file/sql/map
              timed: YES
*************************** 2. row ***************************
enabled_instruments: wait/io/file/sql/binlog
              timed: YES
*************************** 3. row ***************************
enabled_instruments: wait/io/file/sql/binlog_cache
              timed: YES
...
```