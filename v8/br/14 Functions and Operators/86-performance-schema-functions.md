## 14.21 Funções do Schema de Desempenho

O MySQL inclui funções SQL integradas que formatam ou recuperam dados do Schema de Desempenho e podem ser usadas como equivalentes das funções armazenadas no esquema `sys`. As funções integradas podem ser chamadas em qualquer esquema e não requerem um qualificador, ao contrário das funções `sys`, que requerem um qualificador do esquema `sys` ou que `sys` seja o esquema atual.

**Tabela 14.31 Funções do Schema de Desempenho**

<table><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>FORMAT_BYTES()</code></td> <td> Converte a contagem de bytes para um valor com unidades </td> </tr><tr><td><code>FORMAT_PICO_TIME()</code></td> <td> Converte o tempo em picosegundos para um valor com unidades </td> </tr><tr><td><code>PS_CURRENT_THREAD_ID()</code></td> <td> ID de thread do Schema de Desempenho para o thread atual </td> </tr><tr><td><code>PS_THREAD_ID()</code></td> <td> ID de thread do Schema de Desempenho para o thread especificado </td> </tr></tbody></table>

As funções integradas substituem as funções `sys` correspondentes, que estão em desuso; espera-se que sejam removidas em uma versão futura do MySQL. Aplicações que usam as funções `sys` devem ser ajustadas para usar as funções integradas, mantendo em mente algumas diferenças menores entre as funções `sys` e as funções integradas. Para detalhes sobre essas diferenças, consulte as descrições das funções nesta seção.

*  `FORMAT_BYTES(count)`

  Dado um número de contagem de bytes, converte-o para um formato legível por humanos e retorna uma string composta por um valor e um indicador de unidades. A string contém o número de bytes arredondado para 2 casas decimais e um mínimo de 3 dígitos significativos. Números menores que 1024 bytes são representados como números inteiros e não são arredondados. Retorna `NULL` se *`count`* for `NULL`.

  O indicador de unidades depende do tamanho do argumento de contagem de bytes, conforme mostrado na tabela a seguir.

<table><col style="width: 30%"/><col style="width: 25%"/><col style="width: 45%"/><thead><tr> <th>Valor do argumento</th> <th>Unidades do resultado</th> <th>Indicador de unidades do resultado</th> </tr></thead><tbody><tr> <th>Até 1023</th> <td>bytes</td> <td>bytes</td> </tr><tr> <th>Até 1024<sup>2</sup> − 1</th> <td>kibibytes</td> <td>KiB</td> </tr><tr> <th>Até 1024<sup>3</sup> − 1</th> <td>mebibytes</td> <td>MiB</td> </tr><tr> <th>Até 1024<sup>4</sup> − 1</th> <td>gibibytes</td> <td>GiB</td> </tr><tr> <th>Até 1024<sup>5</sup> − 1</th> <td>tebibytes</td> <td>TiB</td> </tr><tr> <th>Até 1024<sup>6</sup> − 1</th> <td>pebibytes</td> <td>PiB</td> </tr><tr> <th>1024<sup>6</sup> e acima</th> <td>exbibytes</td> <td>EiB</td> </tr></tbody></table>

  ```
  mysql> SELECT FORMAT_BYTES(512), FORMAT_BYTES(18446644073709551615);
  +-------------------+------------------------------------+
  | FORMAT_BYTES(512) | FORMAT_BYTES(18446644073709551615) |
  +-------------------+------------------------------------+
  |  512 bytes        | 16.00 EiB                          |
  +-------------------+------------------------------------+
  ```

  Pode-se usar `FORMAT_BYTES()` em vez da função do esquema `sys` `format_bytes()`")`, mantendo em mente essa diferença:

  +  `FORMAT_BYTES()` usa o indicador de unidades `EiB`. A função `sys.format_bytes()` não.
*  `FORMAT_PICO_TIME(time_val)`

  Dado um tempo de latência ou tempo de espera do desempenho numérico em picosegundos, converte-o para o formato legível por humanos e retorna uma string composta por um valor e um indicador de unidades. A string contém o tempo decimal arredondado para 2 casas decimais e um mínimo de 3 dígitos significativos. Tempos menores que 1 nanosegundo são representados como números inteiros e não são arredondados.

  Se *`time_val`* for `NULL`, esta função retorna `NULL`.

  O indicador de unidades depende do tamanho do argumento de valor de tempo, conforme mostrado na tabela a seguir.

<table><col style="width: 30%"/><col style="width: 25%"/><col style="width: 45%"/><thead><tr> <th>Valor do Argumento</th> <th>Unidades do Resultado</th> <th>Indicador de Unidades do Resultado</th> </tr></thead><tbody><tr> <th>Até 10<sup>3</sup> − 1</th> <td>picosegundos</td> <td>ps</td> </tr><tr> <th>Até 10<sup>6</sup> − 1</th> <td>nanosegundos</td> <td>ns</td> </tr><tr> <th>Até 10<sup>9</sup> − 1</th> <td>microsegundos</td> <td>us</td> </tr><tr> <th>Até 10<sup>12</sup> − 1</th> <td>milissegundos</td> <td>ms</td> </tr><tr> <th>Até 60×10<sup>12</sup> − 1</th> <td>segundos</td> <td>s</td> </tr><tr> <th>Até 3.6×10<sup>15</sup> − 1</th> <td>minutos</td> <td>min</td> </tr><tr> <th>Até 8.64×10<sup>16</sup> − 1</th> <td>horas</td> <td>h</td> </tr><tr> <th>8.64×10<sup>16</sup> e acima</th> <td>dias</td> <td>d</td> </tr></tbody></table>

  ```
  mysql> SELECT FORMAT_PICO_TIME(3501), FORMAT_PICO_TIME(188732396662000);
  +------------------------+-----------------------------------+
  | FORMAT_PICO_TIME(3501) | FORMAT_PICO_TIME(188732396662000) |
  +------------------------+-----------------------------------+
  | 3.50 ns                | 3.15 min                          |
  +------------------------+-----------------------------------+
  ```

   `FORMAT_PICO_TIME()` pode ser usado em vez da função `sys.format_time()` do esquema `format_time()` do `sys`)")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")")
"A"
"B"
"C"
"D"
"E"
"F"
"G"
"H"
"I"
"J"
"K"
"L"
"M"
"N"
"O"
"P"
"Q"
"R"
"S"
"T"
"U"
"V"
"W"
"X"
"Y"
"Z"
"a"
"b"
"c"
"d"
"e"
"f"


Dado um ID de conexão, retorna um valor `BIGINT UNSIGNED` que representa o ID de thread do Schema de Desempenho atribuído ao ID de conexão, ou `NULL` se não existir nenhum ID de thread para o ID de conexão. Este último pode ocorrer para threads que não são instrumentados ou se *`connection_id`* for `NULL`.

O argumento ID de conexão é um valor do tipo dado na coluna `PROCESSLIST_ID` da tabela `threads` do Schema de Desempenho ou na coluna `Id` da saída do comando `SHOW PROCESSLIST`.

O valor de retorno do ID de thread é um valor do tipo dado na coluna `THREAD_ID` das tabelas do Schema de Desempenho.

A configuração do Schema de Desempenho afeta a operação `PS_THREAD_ID()` da seguinte forma. (Essas observações também se aplicam a `PS_CURRENT_THREAD_ID()`.

+ A desativação do consumidor `thread_instrumentation` desativa a coleta e agregação de estatísticas no nível do thread, mas não tem efeito sobre `PS_THREAD_ID()`.
+ Se `performance_schema_max_thread_instances` não for 0, o Schema de Desempenho aloca memória para as estatísticas do thread e atribui um ID interno a cada thread para o qual há memória de instância disponível. Se houver threads para as quais a memória de instância não estiver disponível, `PS_THREAD_ID()` retorna `NULL`; nesse caso, `Performance_schema_thread_instances_lost` é diferente de zero.
+ Se `performance_schema_max_thread_instances` for 0, o Schema de Desempenho não aloca memória para o thread e `PS_THREAD_ID()` retorna `NULL`.
+ Se o próprio Schema de Desempenho for desativado, `PS_THREAD_ID()` produz um erro.

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

`PS_THREAD_ID()` pode ser usado em vez da função do esquema `sys.ps_thread_id()` ("Função sys.ps_thread_id()"), mantendo em mente essa diferença:

+ Com um argumento de `NULL`, `sys.ps_thread_id()` ("Função sys.ps_thread_id()`) retorna o ID de thread da conexão atual, enquanto `PS_THREAD_ID()` retorna `NULL`. Para obter o ID de thread da conexão atual, use `PS_CURRENT_THREAD_ID()`.