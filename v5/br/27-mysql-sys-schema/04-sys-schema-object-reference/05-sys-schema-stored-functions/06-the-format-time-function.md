#### 26.4.5.6 A Função format_time()

Dada uma latência do Performance Schema ou um tempo de espera em picoseconds, converte-o para um formato legível por humanos e retorna uma string que consiste em um valor e um indicador de unidades. Dependendo do tamanho do valor, a parte da unidade é `ps` (picoseconds), `ns` (nanoseconds), `us` (microseconds), `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours), `d` (days) ou `w` (weeks).

##### Parâmetros

* `picoseconds TEXT`: O valor em picoseconds a ser formatado.

##### Valor de Retorno

Um valor `TEXT`.

##### Exemplo

```sql
mysql> SELECT sys.format_time(3501), sys.format_time(188732396662000);
+-----------------------+----------------------------------+
| sys.format_time(3501) | sys.format_time(188732396662000) |
+-----------------------+----------------------------------+
| 3.50 ns               | 3.15 m                           |
+-----------------------+----------------------------------+
```