#### 30.4.4.24 O procedimento ps_truncate_all_tables()

Trunca todas as tabelas de resumo do Gerenciador de Desempenho, redefinindo toda a instrumentação agregada como um instantâneo. Produz um conjunto de resultados indicando quantos tabelas foram truncadas.

##### Parâmetros

* `in_verbose BOOLEAN`: Se deve exibir cada instrução `TRUNCATE TABLE` antes de executá-la.

##### Exemplo

```
mysql> CALL sys.ps_truncate_all_tables(FALSE);
+---------------------+
| summary             |
+---------------------+
| Truncated 49 tables |
+---------------------+
```