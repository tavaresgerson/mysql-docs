#### 30.4.4.17 O procedimento ps_setup_show_disabled_instruments()

Exibe todos os instrumentos do Schema de Desempenho atualmente desativados. Isso pode ser uma lista longa.

##### Parâmetros

Nenhum.

##### Exemplo

```
mysql> CALL sys.ps_setup_show_disabled_instruments()\G
*************************** 1. row ***************************
disabled_instruments: wait/synch/mutex/sql/TC_LOG_MMAP::LOCK_tc
               timed: NO
*************************** 2. row ***************************
disabled_instruments: wait/synch/mutex/sql/THD::LOCK_query_plan
               timed: NO
*************************** 3. row ***************************
disabled_instruments: wait/synch/mutex/sql/MYSQL_BIN_LOG::LOCK_commit
               timed: NO
...
```