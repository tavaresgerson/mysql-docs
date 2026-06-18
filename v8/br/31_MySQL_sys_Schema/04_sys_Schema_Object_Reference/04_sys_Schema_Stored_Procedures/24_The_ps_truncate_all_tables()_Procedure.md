#### 30.4.4.24 O procedimento ps\_truncate\_all\_tables()

Trunca todas as tabelas de resumo do Schema de Desempenho, redefinindo toda a instrumentação agregada como um instantâneo. Produz um conjunto de resultados que indica quantos tabelas foram truncadas.

##### Parâmetros

- `in_verbose BOOLEAN`: Se cada declaração `TRUNCATE TABLE` deve ser exibida antes de ser executada.

##### Exemplo

```
mysql> CALL sys.ps_truncate_all_tables(FALSE);
+---------------------+
| summary             |
+---------------------+
| Truncated 49 tables |
+---------------------+
```
