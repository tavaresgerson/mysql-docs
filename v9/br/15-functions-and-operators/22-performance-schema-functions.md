## Funções do Schema de Desempenho

O MySQL inclui funções SQL integradas que formatam ou recuperam dados do Schema de Desempenho e podem ser usadas como equivalentes das funções armazenadas no esquema `sys`. As funções integradas podem ser chamadas em qualquer esquema e não requerem qualificador, ao contrário das funções `sys`, que requerem um qualificador do esquema `sys` ou que `sys` seja o esquema atual.

**Tabela 14.32 Funções do Schema de Desempenho**

<table frame="box" rules="all" summary="Uma referência que lista as funções do Schema de Desempenho."><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>FORMAT_BYTES()</code></td> <td> Converte a contagem de bytes para um valor com unidades </td> </tr><tr><td><code>FORMAT_PICO_TIME()</code></td> <td> Converte o tempo em picosegundos para um valor com unidades </td> </tr><tr><td><code>PS_CURRENT_THREAD_ID()</code></td> <td> ID do thread do Schema de Desempenho para o thread atual </td> </tr><tr><td><code>PS_THREAD_ID()</code></td> <td> ID do thread do Schema de Desempenho para o thread especificado </td> </tr></tbody></table>

As funções integradas substituem as funções correspondentes do `sys`, que estão desatualizadas; espera-se que sejam removidas em uma versão futura do MySQL. As aplicações que usam as funções `sys` devem ser ajustadas para usar as funções integradas, mantendo em mente algumas diferenças menores entre as funções `sys` e as funções integradas. Para obter detalhes sobre essas diferenças, consulte as descrições das funções nesta seção.

* `FORMAT_BYTES(count)`

  Dado um número de bytes, converte-o para um formato legível para humanos e retorna uma string composta por um valor e um indicador de unidades. A string contém o número de bytes arredondado para 2 casas decimais e um mínimo de 3 dígitos significativos. Números menores que 1024 bytes são representados como números inteiros e não são arredondados. Retorna `NULL` se *`count`* for `NULL`.

  O indicador de unidades depende do tamanho do argumento de contagem de bytes, conforme mostrado na tabela a seguir.

<table summary="Indicadores de unidades usados pela função FORMAT_BYTES().">
<col style="width: 30%"/><col style="width: 25%"/><col style="width: 45%"/>
<thead><tr>
<th>Valor do argumento</th>
<th>Unidades do resultado</th>
<th>Indicador de unidades do resultado</th>
</tr></thead>
<tbody>
<tr>
<th>Até 1023</th>
<td>bytes</td>
<td>bytes</td>
</tr>
<tr>
<th>Até 1024<sup>2</sup> − 1</th>
<td>kibibytes</td>
<td>KiB</td>
</tr>
<tr>
<th>Até 1024<sup>3</sup> − 1</th>
<td>mebibytes</td>
<td>MiB</td>
</tr>
<tr>
<th>Até 1024<sup>4</sup> − 1</th>
<td>gibibytes</td>
<td>GiB</td>
</tr>
<tr>
<th>Até 1024<sup>5</sup> − 1</th>
<td>tebibytes</td>
<td>TiB</td>
</tr>
<tr>
<th>Até 1024<sup>6</sup> − 1</th>
<td>pebibytes</td>
<td>PiB</td>
</tr>
<tr>
<th>1024<sup>6</sup> e acima</th>
<td>exbibytes</td>
<td>EiB</td>
</tr>
</tbody></table>

```
  mysql> SELECT FORMAT_BYTES(512), FORMAT_BYTES(18446644073709551615);
  +-------------------+------------------------------------+
  | FORMAT_BYTES(512) | FORMAT_BYTES(18446644073709551615) |
  +-------------------+------------------------------------+
  |  512 bytes        | 16.00 EiB                          |
  +-------------------+------------------------------------+
  ```lKishbY6In```
  mysql> SELECT FORMAT_PICO_TIME(3501), FORMAT_PICO_TIME(188732396662000);
  +------------------------+-----------------------------------+
  | FORMAT_PICO_TIME(3501) | FORMAT_PICO_TIME(188732396662000) |
  +------------------------+-----------------------------------+
  | 3.50 ns                | 3.15 min                          |
  +------------------------+-----------------------------------+
  ```8LAB0Nywjv```
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
  ```JTPH3AS42c```

O `PS_THREAD_ID()` pode ser usado em vez da função `sys.ps_thread_id()` (Função"), mantendo em mente essa diferença:

+ Com um argumento de `NULL`, a função `sys.ps_thread_id()` (Função") retorna o ID do thread para a conexão atual, enquanto o `PS_THREAD_ID()` retorna `NULL`. Para obter o ID do thread da conexão atual, use `PS_CURRENT_THREAD_ID()` em vez disso.