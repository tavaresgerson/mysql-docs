#### 30.4.4.23 O procedimento ps\_trace\_thread()

Arrejeta todos os dados do Schema de Desempenho para um fio instrumentado em um arquivo de gráfico formatado em `.dot` (para a linguagem de descrição de gráficos DOT). Cada conjunto de resultados retornado pelo procedimento deve ser usado para um gráfico completo.

Este procedimento desabilita o registro binário durante sua execução manipulando o valor da sessão da variável de sistema `sql_log_bin`. Essa é uma operação restrita, portanto, o procedimento requer privilégios suficientes para definir variáveis de sessão restritas. Veja a Seção 7.1.9.1, “Privilégios de variáveis de sistema”.

##### Parâmetros

* `in_thread_id INT`: O fio a ser rastreado.

* `in_outfile VARCHAR(255)`: O nome a ser usado para o arquivo de saída em `.dot`.

* `in_max_runtime DECIMAL(20,2)`: O número máximo de segundos (que pode ser fracionário) para coletar dados. Use `NULL` para coletar dados pelo valor padrão de 60 segundos.

* `in_interval DECIMAL(20,2)`: O número de segundos (que pode ser fracionário) para dormir entre as coleções de dados. Use `NULL` para dormir pelo valor padrão de 1 segundo.

* `in_start_fresh BOOLEAN`: Se os dados do Schema de Desempenho devem ser zerados antes da execução do rastreamento.

* `in_auto_setup BOOLEAN`: Se todos os outros fios devem ser desabilitados e todos os instrumentos e consumidores devem ser habilitados. Isso também redefere as configurações no final da execução.

* `in_debug BOOLEAN`: Se as informações `file:lineno` devem ser incluídas no gráfico.

##### Exemplo

```
mysql> CALL sys.ps_trace_thread(25, CONCAT('/tmp/stack-', REPLACE(NOW(), ' ', '-'), '.dot'), NULL, NULL, TRUE, TRUE, TRUE);
+-------------------+
| summary           |
+-------------------+
| Disabled 1 thread |
+-------------------+
1 row in set (0.00 sec)

+---------------------------------------------+
| Info                                        |
+---------------------------------------------+
| Data collection starting for THREAD_ID = 25 |
+---------------------------------------------+
1 row in set (0.03 sec)

+-----------------------------------------------------------+
| Info                                                      |
+-----------------------------------------------------------+
| Stack trace written to /tmp/stack-2014-02-16-21:18:41.dot |
+-----------------------------------------------------------+
1 row in set (60.07 sec)

+-------------------------------------------------------------------+
| Convert to PDF                                                    |
+-------------------------------------------------------------------+
| dot -Tpdf -o /tmp/stack_25.pdf /tmp/stack-2014-02-16-21:18:41.dot |
+-------------------------------------------------------------------+
1 row in set (60.07 sec)

+-------------------------------------------------------------------+
| Convert to PNG                                                    |
+-------------------------------------------------------------------+
| dot -Tpng -o /tmp/stack_25.png /tmp/stack-2014-02-16-21:18:41.dot |
+-------------------------------------------------------------------+
1 row in set (60.07 sec)

+------------------+
| summary          |
+------------------+
| Enabled 1 thread |
+------------------+
1 row in set (60.32 sec)
```