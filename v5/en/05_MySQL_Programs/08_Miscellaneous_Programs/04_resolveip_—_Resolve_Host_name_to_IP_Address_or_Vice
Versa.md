### 4.8.4 resolveip — Resolve Host name to IP Address or Vice Versa

The [**resolveip**](resolveip.html "4.8.4 resolveip — Resolve Host name to IP Address or Vice Versa") utility resolves host names to
IP addresses and vice versa.

Note

[**resolveip**](resolveip.html "4.8.4 resolveip — Resolve Host name to IP Address or Vice Versa") is deprecated and is removed in
MySQL 8.0. **nslookup**,
**host**, or **dig** can be used
instead.

Invoke [**resolveip**](resolveip.html "4.8.4 resolveip — Resolve Host name to IP Address or Vice Versa") like this:

```sql
resolveip [options] {host_name|ip-addr} ...
```

[**resolveip**](resolveip.html "4.8.4 resolveip — Resolve Host name to IP Address or Vice Versa") supports the following options.

* [`--help`](resolveip.html#option_resolveip_help),
  [`--info`](resolveip.html#option_resolveip_help),
  `-?`, `-I`

  Display a help message and exit.

* [`--silent`](resolveip.html#option_resolveip_silent),
  `-s`

  Silent mode. Produce less output.

* [`--version`](resolveip.html#option_resolveip_version),
  `-V`

  Display version information and exit.