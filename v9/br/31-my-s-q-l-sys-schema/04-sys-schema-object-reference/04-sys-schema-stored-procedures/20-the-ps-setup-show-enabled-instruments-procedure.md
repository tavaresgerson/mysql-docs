#### 30.4.4.20 O procedimento ps_setup_show_enabled_instruments()

Exibe todos os instrumentos do Schema de Desempenho atualmente habilitados. Isso pode ser uma lista longa.

##### Parâmetros

Nenhum.

##### Exemplo

```
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