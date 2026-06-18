#### 26.4.5.12 A Função ps_is_instrument_default_timed()

Retorna `YES` ou `NO` para indicar se um determinado *Performance Schema instrument* é temporizado por padrão.

##### Parâmetros

* `in_instrument VARCHAR(128)`: O nome do *instrument* a ser verificado.

##### Valor de Retorno

Um valor `ENUM('YES','NO')`.

##### Exemplo

```sql
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