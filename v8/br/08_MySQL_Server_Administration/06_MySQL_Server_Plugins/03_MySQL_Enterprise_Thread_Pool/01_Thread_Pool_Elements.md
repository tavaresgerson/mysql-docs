#### 7.6.3.1 Elementos do Pool de Fios

O MySQL Enterprise Thread Pool compreende esses elementos:

- Um arquivo de biblioteca de plugins implementa um plugin para o código do pool de threads, além de várias tabelas de monitoramento associadas que fornecem informações sobre a operação do pool de threads:

  - A partir do MySQL 8.0.14, as tabelas de monitoramento são as tabelas do Gerenciador de Desempenho; veja a Seção 29.12.16, “Tabelas do Pool de Threads do Gerenciador de Desempenho”.

  - Antes do MySQL 8.0.14, as tabelas de monitoramento são as tabelas `INFORMATION_SCHEMA`; veja a Seção 28.5, “Tabelas do Pool de Threads do INFORMATION\_SCHEMA”.

    As tabelas `INFORMATION_SCHEMA` já estão desatualizadas; espera-se que sejam removidas em uma versão futura do MySQL. As aplicações devem migrar das tabelas `INFORMATION_SCHEMA` para as tabelas do Gerenciamento de Desempenho. Por exemplo, se uma aplicação usa esta consulta:

    ```
    SELECT * FROM INFORMATION_SCHEMA.TP_THREAD_STATE;
    ```

    O aplicativo deve usar essa consulta em vez disso:

    ```
    SELECT * FROM performance_schema.tp_thread_state;
    ```

  Nota

  Se você não carregar todas as tabelas de monitoramento, alguns ou todos os gráficos do pool de threads do MySQL Enterprise Monitor podem ficar vazios.

  Para uma descrição detalhada de como o pool de threads funciona, consulte a Seção 7.6.3.3, “Operação do Pool de Threads”.

- Várias variáveis do sistema estão relacionadas ao pool de threads. A variável de sistema `thread_handling` tem o valor `loaded-dynamically` quando o servidor carrega com sucesso o plugin do pool de threads.

  As outras variáveis de sistema relacionadas são implementadas pelo plugin de pilha de threads e não estão disponíveis a menos que estejam habilitadas. Para obter informações sobre o uso dessas variáveis, consulte a Seção 7.6.3.3, “Operação da Pilha de Threads”, e a Seção 7.6.3.4, “Ajuste da Pilha de Threads”.

- O Schema de Desempenho possui instrumentos que exibem informações sobre o pool de threads e podem ser usados para investigar o desempenho operacional. Para identificá-los, use esta consulta:

  ```
  SELECT * FROM performance_schema.setup_instruments
  WHERE NAME LIKE '%thread_pool%';
  ```

  Para obter mais informações, consulte o Capítulo 29, *MySQL Performance Schema*.
