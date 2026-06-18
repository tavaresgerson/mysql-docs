#### 26.4.4.24 O Procedimento ps_truncate_all_tables()

Trunca todas as tabelas de resumo do Performance Schema, redefinindo toda a instrumentação agregada como um snapshot. Produz um result set indicando quantas tabelas foram truncadas.

##### Parâmetros

* `in_verbose BOOLEAN`: Se deve exibir cada instrução `TRUNCATE TABLE` antes de executá-la.

##### Exemplo

```sql
mysql> CALL sys.ps_truncate_all_tables(FALSE);
+---------------------+
| summary             |
+---------------------+
| Truncated 44 tables |
+---------------------+
```