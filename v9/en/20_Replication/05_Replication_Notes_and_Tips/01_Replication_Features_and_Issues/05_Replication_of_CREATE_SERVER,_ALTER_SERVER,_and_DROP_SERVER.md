#### 19.5.1.5 Replication of CREATE SERVER, ALTER SERVER, and DROP SERVER

The statements [`CREATE SERVER`](create-server.html "15.1.22 CREATE SERVER Statement"),
[`ALTER SERVER`](alter-server.html "15.1.10 ALTER SERVER Statement"), and
[`DROP SERVER`](drop-server.html "15.1.35 DROP SERVER Statement") are not written to
the binary log, regardless of the binary logging format that is
in use.