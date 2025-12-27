#### 7.6.3.1 Elementos do Pool de Fios

O Pool de Fios do MySQL Enterprise inclui esses elementos:

* Um arquivo de biblioteca de plugins implementa um plugin para o código do pool de fios, bem como várias tabelas de monitoramento associadas que fornecem informações sobre a operação do pool de fios:

  + No MySQL 8.4, as tabelas de monitoramento são tabelas do Schema de Desempenho; consulte a Seção 29.12.16, “Tabelas de Pool de Fios do Schema de Desempenho”.
  + Em versões mais antigas do MySQL, as tabelas de monitoramento eram tabelas do `INFORMATION_SCHEMA`. As tabelas do `INFORMATION_SCHEMA` estão desatualizadas; espera-se que sejam removidas em uma futura versão do MySQL. As aplicações devem migrar das tabelas do `INFORMATION_SCHEMA` para as tabelas do Schema de Desempenho. Por exemplo, se uma aplicação usa esta consulta:

    ```
    SELECT * FROM INFORMATION_SCHEMA.TP_THREAD_STATE;
    ```

    A aplicação deve usar esta consulta em vez disso:

    ```
    SELECT * FROM performance_schema.tp_thread_state;
    ```
  ::: info Nota

  Se você não carregar todas as tabelas de monitoramento, algumas ou todas as grafias do pool de fios do MySQL Enterprise Monitor podem estar vazias.

  :::

  Para uma descrição detalhada de como o pool de fios funciona, consulte a Seção 7.6.3.3, “Operação do Pool de Fios”.
* Várias variáveis de sistema estão relacionadas ao pool de fios. A variável de sistema `thread_handling` tem o valor `loaded-dynamically` quando o servidor carrega com sucesso o plugin do pool de fios.

  As outras variáveis de sistema relacionadas são implementadas pelo plugin do pool de fios e não estão disponíveis a menos que estejam habilitadas. Para obter informações sobre o uso dessas variáveis, consulte a Seção 7.6.3.3, “Operação do Pool de Fios”, e a Seção 7.6.3.4, “Ajuste do Pool de Fios”.
* O Schema de Desempenho tem instrumentos que exibem informações sobre o pool de fios e podem ser usados para investigar o desempenho operacional. Para identificá-los, use esta consulta:

  ```
  SELECT * FROM performance_schema.setup_instruments
  WHERE NAME LIKE '%thread_pool%';
  ```

  Para mais informações, consulte o Capítulo 29, *MySQL Schema de Desempenho*.