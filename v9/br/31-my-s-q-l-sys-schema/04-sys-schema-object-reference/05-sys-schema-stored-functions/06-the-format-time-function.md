#### 30.4.5.6 A função `format_time()`

Nota

A função `format_time()`") está desatualizada e está sujeita à remoção em uma versão futura do MySQL. As aplicações que a utilizam devem ser migradas para usar a função embutida `FORMAT_PICO_TIME()`. Consulte a Seção 14.22, “Funções do Schema de Desempenho”

Dado um tempo de latência ou espera do Schema de Desempenho em picosegundos, converte-o para um formato legível para humanos e retorna uma string composta por um valor e um indicador de unidades. Dependendo do tamanho do valor, a parte das unidades é `ps` (picosegundos), `ns` (nanosegundos), `us` (microsegundos), `ms` (milisegundos), `s` (segundos), `m` (minutos), `h` (horas), `d` (dias) ou `w` (semanas).

##### Parâmetros

* `picoseconds TEXT`: O valor em picosegundos a ser formatado.

##### Valor de retorno

Um valor `TEXT`.

##### Exemplo

```
mysql> SELECT sys.format_time(3501), sys.format_time(188732396662000);
+-----------------------+----------------------------------+
| sys.format_time(3501) | sys.format_time(188732396662000) |
+-----------------------+----------------------------------+
| 3.50 ns               | 3.15 m                           |
+-----------------------+----------------------------------+
```