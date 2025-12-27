#### 30.4.5.12 A função ps\_is\_instrument\_default\_timed()

Retorna `YES` ou `NO` para indicar se um instrumento do Schema de Desempenho é temporizado por padrão.

##### Parâmetros

* `in_instrument VARCHAR(128)`: O nome do instrumento a ser verificado.

##### Valor de retorno

Um valor `ENUM('YES','NO')`.

##### Exemplo

```
mysql> SELECT sys.ps_is_instrument_default_timed('memory/innodb/row_log_buf');
+-----------------------------------------------------------------+
| sys.ps_is_instrument_default_timed('memory/innodb/row_log_buf') |
+-----------------------------------------------------------------+
| NO                                                              |
+-----------------------------------------------------------------+
mysql> SELECT sys.ps_is_instrument_default_timed('statement/sql/alter_user');
+----------------------------------------------------------------+
| sys.ps_is_instrument_default_timed('statement/sql/alter_user') |
+----------------------------------------------------------------+
| YES                                                            |
+----------------------------------------------------------------+
```