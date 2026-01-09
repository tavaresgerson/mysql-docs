#### 5.5.3.1 Elementos do Pool de Fios

O MySQL Enterprise Thread Pool compreende esses elementos:

- Um arquivo de biblioteca de plugins implementa um plugin para o código do pool de threads, além de várias tabelas de monitoramento associadas que fornecem informações sobre a operação do pool de threads.

  Para uma descrição detalhada de como o pool de threads funciona, consulte Seção 5.5.3.3, “Operação do Pool de Threads”.

  As tabelas `INFORMATION_SCHEMA` são chamadas de `TP_THREAD_STATE`, `TP_THREAD_GROUP_STATE` e `TP_THREAD_GROUP_STATS`. Essas tabelas fornecem informações sobre a operação do pool de threads. Para mais informações, consulte Seção 24.5, “Tabelas do Pool de Threads do INFORMATION_SCHEMA”.

- Várias variáveis do sistema estão relacionadas ao pool de threads. A variável de sistema `thread_handling` tem o valor `loaded-dynamically` quando o servidor carrega com sucesso o plugin do pool de threads.

  As outras variáveis de sistema relacionadas são implementadas pelo plugin de pool de threads e não estão disponíveis a menos que estejam habilitadas. Para obter informações sobre o uso dessas variáveis, consulte Seção 5.5.3.3, “Operação do Pool de Threads” e Seção 5.5.3.4, “Ajuste do Pool de Threads”.

- O Schema de Desempenho possui instrumentos que exibem informações sobre o pool de threads e podem ser usados para investigar o desempenho operacional. Para identificá-los, use esta consulta:

  ```sql
  SELECT * FROM performance_schema.setup_instruments
  WHERE NAME LIKE '%thread_pool%';
  ```

  Para obter mais informações, consulte [Capítulo 25, *MySQL Performance Schema*] (performance-schema.html).
