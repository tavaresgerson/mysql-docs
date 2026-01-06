#### 26.4.5.3 A função format\_bytes()

Dado um número de bytes, converte-o para um formato legível por humanos e retorna uma string composta por um valor e um indicador de unidades. Dependendo do tamanho do valor, a parte das unidades é `bytes`, `KiB` (kibibytes), `MiB` (mebibytes), `GiB` (gibibytes), `TiB` (tebibytes) ou `PiB` (pebibytes).

##### Parâmetros

- `bytes TEXT`: O número de bytes para formatar.

##### Valor de retorno

Um valor `TEXT`.

##### Exemplo

```sql
mysql> SELECT sys.format_bytes(512), sys.format_bytes(18446644073709551615);
+-----------------------+----------------------------------------+
| sys.format_bytes(512) | sys.format_bytes(18446644073709551615) |
+-----------------------+----------------------------------------+
| 512 bytes             | 16383.91 PiB                           |
+-----------------------+----------------------------------------+
```
