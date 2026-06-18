## 14.21 Funções do Schema de Desempenho

A partir do MySQL 8.0.16, o MySQL inclui funções SQL integradas que formatam ou recuperam dados do Schema de Desempenho e podem ser usadas como equivalentes às funções armazenadas no esquema correspondente `sys`. As funções integradas podem ser chamadas em qualquer esquema e não exigem nenhum qualificador, ao contrário das funções `sys`, que exigem um qualificador de esquema `sys.` ou que `sys` seja o esquema atual.

**Tabela 14.31 Funções do Schema de Desempenho**

<table summary="Uma referência que lista as funções do Schema de Desempenho."><thead><tr><th>Nome</th> <th>Descrição</th> <th>Introduzido</th> </tr></thead><tbody><tr><th>[[<code>FORMAT_BYTES()</code>]]</th> <td>Converta o número de bytes em valor com unidades</td> <td>8.0.16</td> </tr><tr><th>[[<code>FORMAT_PICO_TIME()</code>]]</th> <td>Converta o tempo em picosegundos para um valor com unidades</td> <td>8.0.16</td> </tr><tr><th>[[<code>PS_CURRENT_THREAD_ID()</code>]]</th> <td>ID do fio do Schema de desempenho para o fio atual</td> <td>8.0.16</td> </tr><tr><th>[[<code>PS_THREAD_ID()</code>]]</th> <td>ID do fio do Schema de desempenho para o fio dado</td> <td>8.0.16</td> </tr></tbody></table>

As funções embutidas substituem as funções correspondentes `sys` que estão desatualizadas; espera-se que elas sejam removidas em uma versão futura do MySQL. As aplicações que usam as funções `sys` devem ser ajustadas para usar as funções embutidas, mantendo em mente algumas diferenças menores entre as funções `sys` e as funções embutidas. Para obter detalhes sobre essas diferenças, consulte as descrições das funções nesta seção.

- `FORMAT_BYTES(count)`

  Dado um número de bytes, converte-o para um formato legível por humanos e retorna uma string que consiste em um valor e um indicador de unidades. A string contém o número de bytes arredondado para 2 casas decimais e um mínimo de 3 dígitos significativos. Números menores que 1024 bytes são representados como números inteiros e não são arredondados. Retorna `NULL` se `count` for `NULL`.

  O indicador de unidades depende do tamanho do argumento de contagem de bytes, conforme mostrado na tabela a seguir.

  <table summary="Indicadores de unidades usados pela função FORMAT_BYTES()."><thead><tr> <th scope="col">Valor do argumento</th> <th scope="col">Resultado Unidades</th> <th scope="col">Indicador de Unidades de Resultado</th> </tr></thead><tbody><tr> <th>Até 1023</th> <td>bytes</td> <td>bytes</td> </tr><tr> <th>Até 1024<sup>2</sup>− 1</th> <td>kibibytes</td> <td>KiB</td> </tr><tr> <th>Até 1024<sup>3</sup>− 1</th> <td>mebibytes</td> <td>MiB</td> </tr><tr> <th>Até 1024<sup>4</sup>− 1</th> <td>gibibytes</td> <td>GiB</td> </tr><tr> <th>Até 1024<sup>5</sup>− 1</th> <td>tebibytes</td> <td>TiB</td> </tr><tr> <th>Até 1024<sup>6</sup>− 1</th> <td>pebibytes</td> <td>PiB</td> </tr><tr> <th>1024<sup>6</sup>e para cima</th> <td>exbibytes</td> <td>EiB</td> </tr></tbody></table>

  ```
  mysql> SELECT FORMAT_BYTES(512), FORMAT_BYTES(18446644073709551615);
  +-------------------+------------------------------------+
  | FORMAT_BYTES(512) | FORMAT_BYTES(18446644073709551615) |
  +-------------------+------------------------------------+
  |  512 bytes        | 16.00 EiB                          |
  +-------------------+------------------------------------+
  ```

  `FORMAT_BYTES()` foi adicionado no MySQL 8.0.16. Ele pode ser usado em vez da função de esquema `sys` `format_bytes()` Function")", tendo em mente essa diferença:

  - `FORMAT_BYTES()` usa o indicador de unidades `EiB`. `sys.format_bytes()` Função")

- `FORMAT_PICO_TIME(time_val)`

  Dado um tempo de latência ou tempo de espera numérico do Schema de Desempenho em picosegundos, converte-o para um formato legível por humanos e retorna uma string que consiste em um valor e um indicador de unidades. A string contém o tempo decimal arredondado para 2 casas decimais e um mínimo de 3 dígitos significativos. Os tempos inferiores a 1 nanosegundo são representados como números inteiros e não são arredondados.

  Se `time_val` for `NULL`, esta função retorna `NULL`.

  O indicador de unidades depende do tamanho do argumento valor\_temporal, conforme mostrado na tabela a seguir.

  <table summary="Indicadores de unidades usados pela função FORMAT_PICO_TIME()."><thead><tr> <th scope="col">Valor do argumento</th> <th scope="col">Resultado Unidades</th> <th scope="col">Indicador de Unidades de Resultado</th> </tr></thead><tbody><tr> <th>Até 10<sup>3</sup>− 1</th> <td>picosegundos</td> <td>ps</td> </tr><tr> <th>Até 10<sup>6</sup>− 1</th> <td>nanosegundos</td> <td>ns</td> </tr><tr> <th>Até 10<sup>9</sup>− 1</th> <td>microssegundos</td> <td>EUA</td> </tr><tr> <th>Até 10<sup>12</sup>− 1</th> <td>milissegundos</td> <td>ms</td> </tr><tr> <th>Até 60×10<sup>12</sup>− 1</th> <td>segundos</td> <td>s</td> </tr><tr> <th>Até 3,6×10<sup>15</sup>− 1</th> <td>minutos</td> <td>min</td> </tr><tr> <th>Até 8,64×10<sup>16</sup>− 1</th> <td>horas</td> <td>h</td> </tr><tr> <th>8,64×10<sup>16</sup>e para cima</th> <td>dias</td> <td>d</td> </tr></tbody></table>

  ```
  mysql> SELECT FORMAT_PICO_TIME(3501), FORMAT_PICO_TIME(188732396662000);
  +------------------------+-----------------------------------+
  | FORMAT_PICO_TIME(3501) | FORMAT_PICO_TIME(188732396662000) |
  +------------------------+-----------------------------------+
  | 3.50 ns                | 3.15 min                          |
  +------------------------+-----------------------------------+
  ```

  `FORMAT_PICO_TIME()` foi adicionado no MySQL 8.0.16. Ele pode ser usado em vez da função de esquema `sys` `format_time()` Function")", tendo em mente essas diferenças:

  - Para indicar minutos, a função `sys.format_time()` (Função de Indicador de Unidades `m`) utiliza o indicador de unidades `m`, enquanto `FORMAT_PICO_TIME()` utiliza `min`.

  - `sys.format_time()` Função") utiliza o indicador de unidades `w` (semanas). `FORMAT_PICO_TIME()`

- `PS_CURRENT_THREAD_ID()`

  Retorna um valor `BIGINT UNSIGNED` que representa o ID de thread do Schema de Desempenho atribuído à conexão atual.

  O valor de retorno do ID do fio é um valor do tipo especificado na coluna `THREAD_ID` das tabelas do Gerenciamento de Desempenho.

  A configuração do esquema de desempenho afeta `PS_CURRENT_THREAD_ID()` da mesma maneira que para `PS_THREAD_ID()`. Para obter detalhes, consulte a descrição daquela função.

  ```
  mysql> SELECT PS_CURRENT_THREAD_ID();
  +------------------------+
  | PS_CURRENT_THREAD_ID() |
  +------------------------+
  |                     52 |
  +------------------------+
  mysql> SELECT PS_THREAD_ID(CONNECTION_ID());
  +-------------------------------+
  | PS_THREAD_ID(CONNECTION_ID()) |
  +-------------------------------+
  |                            52 |
  +-------------------------------+
  ```

  `PS_CURRENT_THREAD_ID()` foi adicionado no MySQL 8.0.16. Ele pode ser usado como um atalho para invocar a função do esquema `sys` `ps_thread_id()`") com um argumento de `NULL` ou `CONNECTION_ID()`.

- `PS_THREAD_ID(connection_id)`

  Dada uma ID de conexão, retorna um valor `BIGINT UNSIGNED` que representa a ID de thread do Schema de Desempenho atribuída à ID de conexão, ou `NULL` se não existir nenhuma ID de thread para a ID de conexão. Este último pode ocorrer para threads que não são instrumentadas ou se `connection_id` for `NULL`.

  O argumento ID de conexão é um valor do tipo especificado na coluna `PROCESSLIST_ID` da tabela do Gerenciamento de Desempenho `threads` ou na coluna `Id` do relatório `SHOW PROCESSLIST`.

  O valor de retorno do ID do fio é um valor do tipo especificado na coluna `THREAD_ID` das tabelas do Gerenciamento de Desempenho.

  A configuração do esquema de desempenho afeta a operação do `PS_THREAD_ID()` da seguinte forma. (Essas observações também se aplicam ao `PS_CURRENT_THREAD_ID()`.)

  - Desativar o consumidor `thread_instrumentation` desativa a coleta e agregação de estatísticas no nível de thread, mas não tem efeito sobre `PS_THREAD_ID()`.

  - Se `performance_schema_max_thread_instances` não for 0, o Schema de Desempenho aloca memória para estatísticas de threads e atribui um ID interno a cada thread para a qual a memória de instância está disponível. Se houver threads para as quais a memória de instância não estiver disponível, `PS_THREAD_ID()` retorna `NULL`; nesse caso, `Performance_schema_thread_instances_lost` é diferente de zero.

  - Se `performance_schema_max_thread_instances` for 0, o Schema de Desempenho não aloca memória para as threads e `PS_THREAD_ID()` retorna `NULL`.

  - Se o próprio Schema de Desempenho for desativado, o `PS_THREAD_ID()` produz um erro.

  ```
  mysql> SELECT PS_THREAD_ID(6);
  +-----------------+
  | PS_THREAD_ID(6) |
  +-----------------+
  |              45 |
  +-----------------+
  ```

  `PS_THREAD_ID()` foi adicionado no MySQL 8.0.16. Ele pode ser usado em vez da função de esquema `sys` `ps_thread_id()` Function")", tendo em mente essa diferença:

  - Com um argumento de `NULL`, `sys.ps_thread_id()` Função") retorna o ID de thread para a conexão atual, enquanto `PS_THREAD_ID()` retorna `NULL`. Para obter o ID de thread da conexão atual, use `PS_CURRENT_THREAD_ID()` em vez disso.
