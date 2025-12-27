#### 30.4.5.3 A função `format_bytes()`

Nota

A função ``format_bytes()``) está desatualizada e está sujeita à remoção em uma versão futura do MySQL. As aplicações que a utilizam devem ser migradas para usar a função embutida `FORMAT_BYTES()` em vez disso. Consulte a Seção 14.22, “Funções do Schema de Desempenho”

Dado um número de bytes, converte-o para um formato legível para humanos e retorna uma string composta por um valor e um indicador de unidades. Dependendo do tamanho do valor, a parte das unidades é `bytes`, `KiB` (kibibytes), `MiB` (mebibytes), `GiB` (gibibytes), `TiB` (tebibytes) ou `PiB` (pebibytes).

##### Parâmetros

* `bytes TEXT`: O número de bytes a ser formatado.

##### Valor de retorno

Um valor `TEXT`.

##### Exemplo

```
mysql> SELECT sys.format_bytes(512), sys.format_bytes(18446644073709551615);
+-----------------------+----------------------------------------+
| sys.format_bytes(512) | sys.format_bytes(18446644073709551615) |
+-----------------------+----------------------------------------+
| 512 bytes             | 16383.91 PiB                           |
+-----------------------+----------------------------------------+
```