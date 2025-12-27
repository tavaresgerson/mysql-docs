### 4.8.4 resolveip — Resolve Host name to IP Address or Vice Versa

The **resolveip** utility resolves host names to IP addresses and vice versa.

Note

**resolveip** is deprecated and is removed in MySQL 8.0. **nslookup**, **host**, or **dig** can be used instead.

Invoke **resolveip** like this:

```sql
resolveip [options] {host_name|ip-addr} ...
```

**resolveip** supports the following options.

* `--help`, `--info`, `-?`, `-I`

  Display a help message and exit.

* `--silent`, `-s`

  Silent mode. Produce less output.

* `--version`, `-V`

  Display version information and exit.
