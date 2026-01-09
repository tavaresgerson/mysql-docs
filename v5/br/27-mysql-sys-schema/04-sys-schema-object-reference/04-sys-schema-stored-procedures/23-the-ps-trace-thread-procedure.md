#### 26.4.4.23 O procedimento ps_trace_thread()

Descarrega todos os dados do Schema de Desempenho de um fio instrumentado em um arquivo de gráfico formatado em `.dot` (para a linguagem de descrição de gráficos DOT). Cada conjunto de resultados retornado pelo procedimento deve ser usado para um gráfico completo.

Esse procedimento desabilita o registro binário durante sua execução, manipulando o valor da sessão da variável de sistema `sql_log_bin`. Essa é uma operação restrita, portanto, o procedimento requer privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 5.1.8.1, “Privilégios de Variáveis de Sistema”.

##### Parâmetros

- `in_thread_id INT`: O thread a ser rastreado.

- `in_outfile VARCHAR(255)`: O nome a ser usado para o arquivo de saída `.dot`.

- `in_max_runtime DECIMAL(20,2)`: O número máximo de segundos (que pode ser fracionário) para coletar dados. Use `NULL` para coletar dados pelo valor padrão de 60 segundos.

- `in_interval DECIMAL(20,2)`: O número de segundos (que pode ser fracionário) para dormir entre as coleções de dados. Use `NULL` para dormir por 1 segundo padrão.

- `in_start_fresh BOOLEAN`: Se deseja reiniciar todos os dados do Schema de Desempenho antes de iniciar o rastreamento.

- `in_auto_setup BOOLEAN`: Se desabilitar todos os outros threads e habilitar todos os instrumentos e consumidores. Isso também redefinirá as configurações no final da execução.

- `in_debug BOOLEAN`: Se incluir as informações `file:lineno` no gráfico.

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
