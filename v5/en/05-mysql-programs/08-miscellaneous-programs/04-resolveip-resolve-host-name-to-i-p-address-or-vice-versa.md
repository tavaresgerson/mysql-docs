### 4.8.4 resolveip — Resolve Host name para IP Address ou Vice-Versa

O utilitário **resolveip** resolve Host names para IP addresses e vice-versa.

Nota

O **resolveip** está descontinuado e foi removido no MySQL 8.0. **nslookup**, **host**, ou **dig** podem ser usados em seu lugar.

Invoque o **resolveip** desta forma:

```sql
resolveip [options] {host_name|ip-addr} ...
```

O **resolveip** suporta as seguintes opções.

* `--help`, `--info`, `-?`, `-I`

  Exibe uma mensagem de ajuda e sai.

* `--silent`, `-s`

  Modo silencioso (Silent mode). Produz menos saída (output).

* `--version`, `-V`

  Exibe informações da versão e sai.