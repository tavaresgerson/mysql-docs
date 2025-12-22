#### 7.6.3.1 Elementos do conjunto de roscas

O MySQL Enterprise Thread Pool inclui os seguintes elementos:

- Um arquivo de biblioteca de plugins implementa um plugin para o código do pool de tópicos, bem como várias tabelas de monitoramento associadas que fornecem informações sobre o funcionamento do pool de tópicos:

  - No MySQL 8.4, as tabelas de monitorização são tabelas do esquema de desempenho; ver secção 29.12.16, "Tablas de conjunto de tópicos do esquema de desempenho".
  - Em versões mais antigas do MySQL, as tabelas de monitoramento eram as tabelas `INFORMATION_SCHEMA` (ver Seção 28.5, INFORMATION\_SCHEMA Thread Pool Tables). As tabelas `INFORMATION_SCHEMA` estão desatualizadas; esperamos que sejam removidas em uma versão futura do MySQL. As aplicações devem fazer a transição das tabelas `INFORMATION_SCHEMA` para as tabelas do Esquema de Desempenho. Por exemplo, se uma aplicação usa esta consulta:

    ```
    SELECT * FROM INFORMATION_SCHEMA.TP_THREAD_STATE;
    ```

    Em vez disso, a aplicação deve utilizar esta consulta:

    ```
    SELECT * FROM performance_schema.tp_thread_state;
    ```

  ::: info Note

  Se você não carregar todas as tabelas de monitoramento, alguns ou todos os gráficos de conjunto de threads do MySQL Enterprise Monitor podem estar vazios.

  :::

  Para uma descrição pormenorizada do funcionamento do conjunto de roscas, ver secção 7.6.3.3, "Operação do conjunto de roscas".
- Várias variáveis de sistema estão relacionadas ao pool de threads. A variável de sistema `thread_handling` tem um valor de `loaded-dynamically` quando o servidor carrega com sucesso o plugin do pool de threads.

  As outras variáveis do sistema relacionadas são implementadas pelo plugin do pool de threads e não estão disponíveis a menos que este seja habilitado.
- O Esquema de Desempenho possui instrumentos que expõem informações sobre o pool de tópicos e podem ser usados para investigar o desempenho operacional.

  ```
  SELECT * FROM performance_schema.setup_instruments
  WHERE NAME LIKE '%thread_pool%';
  ```

  Para mais informações, ver Capítulo 29, *MySQL Performance Schema*.
