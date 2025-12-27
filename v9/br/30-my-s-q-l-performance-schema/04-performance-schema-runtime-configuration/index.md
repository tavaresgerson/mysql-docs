## Configuração de Execução do Schema de Desempenho

29.4.1 Cronometragem de Eventos do Schema de Desempenho

29.4.2 Filtro de Eventos do Schema de Desempenho

29.4.3 Pré-filtragem de Eventos

29.4.4 Pré-filtragem por Instrumento

29.4.5 Pré-filtragem por Objeto

29.4.6 Pré-filtragem por Thread (Fuso)

29.4.7 Pré-filtragem por Consumidor

29.4.8 Configurações de Consumidores Exemplos

29.4.9 Nomeação de Instrumentos ou Consumidores para Operações de Filtro

29.4.10 Determinando o Que Está Instrumentado

Características específicas do Schema de Desempenho podem ser habilitadas em tempo de execução para controlar quais tipos de coleta de eventos ocorrem.

As tabelas de configuração do Schema de Desempenho contêm informações sobre a configuração de monitoramento:

```
mysql> SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
       WHERE TABLE_SCHEMA = 'performance_schema'
       AND TABLE_NAME LIKE 'setup%';
+-------------------+
| TABLE_NAME        |
+-------------------+
| setup_actors      |
| setup_consumers   |
| setup_instruments |
| setup_objects     |
| setup_threads     |
+-------------------+
```

Você pode examinar o conteúdo dessas tabelas para obter informações sobre as características de monitoramento do Schema de Desempenho. Se você tiver o privilégio de `UPDATE`, pode alterar a operação do Schema de Desempenho modificando as tabelas de configuração para afetar como o monitoramento ocorre. Para obter detalhes adicionais sobre essas tabelas, consulte a Seção 29.12.2, “Tabelas de Configuração do Schema de Desempenho”.

As tabelas `setup_instruments` e `setup_consumers` listam os instrumentos para os quais eventos podem ser coletados e os tipos de consumidores para os quais as informações dos eventos são realmente coletadas, respectivamente. Outras tabelas de configuração permitem a modificação adicional da configuração de monitoramento. A Seção 29.4.2, “Filtro de Eventos do Schema de Desempenho”, discute como você pode modificar essas tabelas para afetar a coleta de eventos.

Se houver alterações na configuração do Schema de Desempenho que precisem ser feitas em tempo de execução usando instruções SQL e você deseja que essas alterações sejam aplicadas sempre que o servidor for iniciado, coloque as instruções em um arquivo e inicie o servidor com a variável de sistema `init_file` definida para nomear o arquivo. Essa estratégia também pode ser útil se você tiver várias configurações de monitoramento, cada uma adaptada para produzir um tipo diferente de monitoramento, como monitoramento casual da saúde do servidor, investigação de incidentes, solução de problemas de comportamento de aplicativos, e assim por diante. Coloque as instruções para cada configuração de monitoramento em seu próprio arquivo e especifique o arquivo apropriado como o valor da variável `init_file` ao iniciar o servidor.