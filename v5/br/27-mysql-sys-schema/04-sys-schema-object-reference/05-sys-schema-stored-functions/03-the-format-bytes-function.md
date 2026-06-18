#### 26.4.5.3 A Função format_bytes()

Dada uma contagem de bytes, a função a converte para um formato legível por humanos e retorna uma string consistindo em um valor e um indicador de unidade. Dependendo do tamanho do valor, a unidade pode ser `bytes`, `KiB` (kibibytes), `MiB` (mebibytes), `GiB` (gibibytes), `TiB` (tebibytes) ou `PiB` (pebibytes).

##### Parâmetros

* `bytes TEXT`: A contagem de bytes a ser formatada.

##### Valor de Retorno

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