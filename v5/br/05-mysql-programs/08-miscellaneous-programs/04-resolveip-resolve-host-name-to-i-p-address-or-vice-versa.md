### 4.8.4 resolveip — Resolver nome de host para endereço IP ou vice-versa

A utilidade **resolveip** resolve nomes de host para endereços IP e vice-versa.

Nota

O **resolveip** está desatualizado e será removido no MySQL 8.0. Você pode usar **nslookup**, **host** ou **dig** no lugar dele.

Invoque o **resolveip** da seguinte forma:

```sql
resolveip [options] {host_name|ip-addr} ...
```

O **resolveip** suporta as seguintes opções.

- `--help`, `--info`, `-?`, `-I`

  Exiba uma mensagem de ajuda e saia.

- `--silent`, `-s`

  Modo silencioso. Produza menos saída.

- `--version`, `-V`

  Exibir informações da versão e sair.
