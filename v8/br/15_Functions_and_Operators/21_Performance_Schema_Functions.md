## 14.21 Funções do Schema de Desempenho

A partir do MySQL 8.0.16, o MySQL inclui funções SQL embutidas que formatam ou recuperam dados do Gerador de Desempenho, e que podem ser usadas como equivalentes para as funções armazenadas no esquema correspondente `sys`. As funções embutidas podem ser invocadas em qualquer esquema e não requerem qualificador, ao contrário das funções `sys`, que requerem um qualificador de esquema `sys.` ou que `sys` seja o esquema atual.

**Tabela 14.31 Funções do Schema de Desempenho**

<table frame="box" rules="all" summary="A reference that lists Performance Schema functions."><col style="width: 25%"/><col style="width: 62%"/><col style="width: 12%"/><thead><tr><th>Name</th> <th>Description</th> <th>Introduced</th> </tr></thead><tbody><tr><th scope="row"><code>FORMAT_BYTES()</code></th> <td>Converte o número de bytes em valor com unidades</td> <td>8.0.16</td> </tr><tr><th scope="row"><code>FORMAT_PICO_TIME()</code></th> <td>Converte o tempo em picosegundos para um valor com unidades</td> <td>8.0.16</td> </tr><tr><th scope="row"><code>PS_CURRENT_THREAD_ID()</code></th> <td>ID do esquema de desempenho do fio para o fio atual</td> <td>8.0.16</td> </tr><tr><th scope="row"><code>PS_THREAD_ID()</code></th> <td>ID do esquema de desempenho do fio para o fio dado</td> <td>8.0.16</td> </tr></tbody></table>

As funções embutidas substituem as funções correspondentes `sys`, que são descontinuadas; espera-se que elas sejam removidas em uma versão futura do MySQL. As aplicações que utilizam as funções `sys` devem ser ajustadas para utilizar as funções embutidas, mantendo em mente algumas diferenças menores entre as funções `sys` e as funções embutidas. Para obter detalhes sobre essas diferenças, consulte as descrições das funções nesta seção.

* `FORMAT_BYTES(count)`

Dado um número de bytes numérico, converte-o para um formato legível por humanos e retorna uma string que consiste em um valor e um indicador de unidades. A string contém o número de bytes arredondado a 2 casas decimais e um mínimo de 3 dígitos significativos. Os números menores que 1024 bytes são representados como números inteiros e não são arredondados. Retorna `NULL` se *`count`* é `NULL`.

O indicador de unidades depende do tamanho do argumento de contagem de bytes, conforme mostrado na tabela a seguir.

  <table summary="Units indicators used by FORMAT_BYTES() function."><col style="width: 30%"/><col style="width: 25%"/><col style="width: 45%"/><thead><tr> <th scope="col">Argument Value</th> <th scope="col">Result Units</th> <th scope="col">Result Units Indicator</th> </tr></thead><tbody><tr> <th scope="row">Up to 1023</th> <td>bytes</td> <td>bytes</td> </tr><tr> <th scope="row">Até 1024<sup>2</sup>− 1</th> <td>kibibytes</td> <td>KiB</td> </tr><tr> <th scope="row">Até 1024<sup>3</sup>− 1</th> <td>mebibytes</td> <td>MiB</td> </tr><tr> <th scope="row">Até 1024<sup>4</sup>− 1</th> <td>gibibytes</td> <td>GiB</td> </tr><tr> <th scope="row">Até 1024<sup>5</sup>− 1</th> <td>tebibytes</td> <td>TiB</td> </tr><tr> <th scope="row">Até 1024<sup>6</sup>− 1</th> <td>pebibytes</td> <td>PiB</td> </tr><tr> <th scope="row">1024<sup>6</sup> and up</th> <td>exbibytes</td> <td>EiB</td> </tr></tbody></table>

  ```
  mysql> SELECT FORMAT_BYTES(512), FORMAT_BYTES(18446644073709551615);
  +-------------------+------------------------------------+
  | FORMAT_BYTES(512) | FORMAT_BYTES(18446644073709551615) |
  +-------------------+------------------------------------+
  |  512 bytes        | 16.00 EiB                          |
  +-------------------+------------------------------------+
  ```

`FORMAT_BYTES()` foi adicionado no MySQL 8.0.16. Pode ser usado em vez do esquema `sys` `format_bytes()` Function") função, tendo em mente essa diferença:

+ `FORMAT_BYTES()` utiliza o indicador das unidades `EiB`. A função `sys.format_bytes()`

* `FORMAT_PICO_TIME(time_val)`

Dado um tempo de latência ou tempo de espera numérico do Schema de Desempenho em picosegundos, converte-o para um formato legível por humanos e retorna uma string que consiste em um valor e um indicador de unidades. A string contém o tempo decimal arredondado para 2 casas decimais e um mínimo de 3 dígitos significativos. Os tempos inferiores a 1 nanosegundo são representados como números inteiros e não são arredondados.

Se *`time_val`* for `NULL`, esta função retorna `NULL`.

O indicador de unidades depende do tamanho do argumento de valor temporal, conforme mostrado na tabela a seguir.

  <table summary="Units indicators used by FORMAT_PICO_TIME() function."><col style="width: 30%"/><col style="width: 25%"/><col style="width: 45%"/><thead><tr> <th scope="col">Argument Value</th> <th scope="col">Result Units</th> <th scope="col">Result Units Indicator</th> </tr></thead><tbody><tr> <th scope="row">Até 10<sup>3</sup>− 1</th> <td>picosegundos</td> <td>ps</td> </tr><tr> <th scope="row">Até 10<sup>6</sup>− 1</th> <td>nanosegundos</td> <td>ns</td> </tr><tr> <th scope="row">Até 10<sup>9</sup>− 1</th> <td>microssegundos</td> <td>nós</td> </tr><tr> <th scope="row">Até 10<sup>12</sup>− 1</th> <td>milisegundos</td> <td>ms</td> </tr><tr> <th scope="row">Até 60×10<sup>12</sup>− 1</th> <td>segundos</td> <td>s</td> </tr><tr> <th scope="row">Até 3,6×10<sup>15</sup>− 1</th> <td>minutos</td> <td>min</td> </tr><tr> <th scope="row">Até 8,64×10<sup>16</sup>− 1</th> <td>horas</td> <td>h</td> </tr><tr> <th scope="row">8.64×10<sup>16</sup> and up</th> <td>days</td> <td>d</td> </tr></tbody></table>

  ```
  mysql> SELECT FORMAT_PICO_TIME(3501), FORMAT_PICO_TIME(188732396662000);
  +------------------------+-----------------------------------+
  | FORMAT_PICO_TIME(3501) | FORMAT_PICO_TIME(188732396662000) |
  +------------------------+-----------------------------------+
  | 3.50 ns                | 3.15 min                          |
  +------------------------+-----------------------------------+
  ```

`FORMAT_PICO_TIME()` foi adicionado no MySQL 8.0.16. Pode ser usado em vez do esquema `sys` `format_time()` Function") função, tendo em mente essas diferenças:

+ Para indicar minutos, a função `sys.format_time()` usa o indicador de unidades `m`, enquanto `FORMAT_PICO_TIME()` usa `min`.

+ `sys.format_time()` Função") utiliza o indicador de unidades `w` (semanas). `FORMAT_PICO_TIME()` não faz isso.

* `PS_CURRENT_THREAD_ID()`

Retorna um valor `BIGINT UNSIGNED` que representa o ID do thread do Schema de Desempenho atribuído à conexão atual.

O valor de retorno do ID do fio é um valor do tipo especificado na coluna `THREAD_ID` das tabelas do Gerador de Desempenho.

A configuração do Schema de desempenho afeta `PS_CURRENT_THREAD_ID()` da mesma maneira que para `PS_THREAD_ID()`. Para obter detalhes, consulte a descrição daquela função.

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

`PS_CURRENT_THREAD_ID()` foi adicionado no MySQL 8.0.16. Pode ser usado como um atalho para invocar a função do esquema `sys` `ps_thread_id()`") com um argumento de `NULL` ou `CONNECTION_ID()`.

* `PS_THREAD_ID(connection_id)`

Dado um ID de conexão, retorna um valor `BIGINT UNSIGNED` que representa o ID do thread do Schema de Desempenho atribuído ao ID de conexão, ou `NULL` se não existir nenhum ID de thread para o ID de conexão. Este último pode ocorrer para threads que não são instrumentadas, ou se *`connection_id`* é `NULL`.

O argumento ID de conexão é um valor do tipo especificado na coluna `PROCESSLIST_ID` da tabela do Gerador de Desempenho `threads` ou na coluna `Id` da saída [`SHOW PROCESSLIST`](show-processlist.html "15.7.7.29 SHOW PROCESSLIST Statement").

O valor de retorno do ID do fio é um valor do tipo especificado na coluna `THREAD_ID` das tabelas do Gerador de Desempenho.

A configuração do Schema de desempenho afeta a operação `PS_THREAD_ID()` da seguinte forma. (Essas observações também se aplicam a `PS_CURRENT_THREAD_ID()`.)

+ Desativar o consumidor `thread_instrumentation` desativa a coleta e agregação de estatísticas no nível de thread, mas não tem efeito sobre `PS_THREAD_ID()`.

+ Se `performance_schema_max_thread_instances` não for 0, o Schema de Desempenho aloca memória para estatísticas de thread e atribui um ID interno a cada thread para a qual memória de instância está disponível. Se houver threads para as quais a memória de instância não está disponível, `PS_THREAD_ID()` retorna `NULL`; nesse caso, `Performance_schema_thread_instances_lost` não é nulo.

+ Se `performance_schema_max_thread_instances` for 0, o Schema de Desempenho não aloca memória para as threads e `PS_THREAD_ID()` retorna `NULL`.

+ Se o próprio Schema de Desempenho for desativado, `PS_THREAD_ID()` produz um erro.

  ```
  mysql> SELECT PS_THREAD_ID(6);
  +-----------------+
  | PS_THREAD_ID(6) |
  +-----------------+
  |              45 |
  +-----------------+
  ```

`PS_THREAD_ID()` foi adicionado no MySQL 8.0.16. Pode ser usado em vez do esquema `sys` `ps_thread_id()` Function") função, tendo em mente essa diferença:

+ Com um argumento de `NULL`, `sys.ps_thread_id()` Função ") retorna o ID do fio para a conexão atual, enquanto `PS_THREAD_ID()` retorna `NULL`. Para obter o ID do fio da conexão atual, use `PS_CURRENT_THREAD_ID()` em vez disso.