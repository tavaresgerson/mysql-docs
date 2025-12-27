#### 26.4.5.3 The format\_bytes() Function

Given a byte count, converts it to human-readable format and returns a string consisting of a value and a units indicator. Depending on the size of the value, the units part is `bytes`, `KiB` (kibibytes), `MiB` (mebibytes), `GiB` (gibibytes), `TiB` (tebibytes), or `PiB` (pebibytes).

##### Parameters

* `bytes TEXT`: The byte count to format.

##### Return Value

A `TEXT` value.

##### Example

```sql
mysql> SELECT sys.format_bytes(512), sys.format_bytes(18446644073709551615);
+-----------------------+----------------------------------------+
| sys.format_bytes(512) | sys.format_bytes(18446644073709551615) |
+-----------------------+----------------------------------------+
| 512 bytes             | 16383.91 PiB                           |
+-----------------------+----------------------------------------+
```
