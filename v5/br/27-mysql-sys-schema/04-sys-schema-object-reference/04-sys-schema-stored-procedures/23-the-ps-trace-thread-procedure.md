#### 26.4.4.23 O Procedure ps_trace_thread()

Faz o dump de todos os dados do Performance Schema para uma Thread instrumentada em um arquivo de gráfico formatado como `.dot` (para a linguagem de descrição de gráfico DOT). Cada result set retornado do procedure deve ser usado para um gráfico completo.

Este procedure desabilita o binary logging durante sua execução ao manipular o valor de sessão da variável de sistema `sql_log_bin`. Essa é uma operação restrita, portanto, o procedure requer privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 5.1.8.1, “System Variable Privileges”.

##### Parâmetros

* `in_thread_id INT`: A Thread a ser rastreada.

* `in_outfile VARCHAR(255)`: O nome a ser usado para o arquivo de saída `.dot`.

* `in_max_runtime DECIMAL(20,2)`: O número máximo de segundos (que pode ser fracionário) para coletar dados. Use `NULL` para coletar dados pelo padrão de 60 segundos.

* `in_interval DECIMAL(20,2)`: O número de segundos (que pode ser fracionário) para "dormir" entre as coletas de dados. Use `NULL` para "dormir" pelo padrão de 1 segundo.

* `in_start_fresh BOOLEAN`: Se deve redefinir todos os dados do Performance Schema antes do rastreamento.

* `in_auto_setup BOOLEAN`: Se deve desabilitar todas as outras Threads e habilitar todos os instruments e consumers. Isso também redefine as configurações no final da execução.

* `in_debug BOOLEAN`: Se deve incluir informações `file:lineno` no gráfico.

##### Exemplo

```sql
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