#### 26.4.5.6 A função format\_time()

Dado uma latência ou tempo de espera do Schema de Desempenho em picosegundos, converte-o para um formato legível por humanos e retorna uma string composta por um valor e um indicador de unidades. Dependendo do tamanho do valor, a parte das unidades é `ps` (picosegundos), `ns` (nanossegundos), `us` (microsegundos), `ms` (milissegundos), `s` (segundos), `m` (minutos), `h` (horas), `d` (dias) ou `w` (semanas).

##### Parâmetros

- `picoseconds TEXT`: O valor em picosegundos a ser formatado.

##### Valor de retorno

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
