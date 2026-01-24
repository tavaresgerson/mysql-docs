#### 16.4.1.7 Replication of CREATE SERVER, ALTER SERVER, and DROP SERVER

The statements [`CREATE SERVER`](create-server.html "13.1.17 CREATE SERVER Statement"), [`ALTER SERVER`](alter-server.html "13.1.7 ALTER SERVER Statement"), and [`DROP SERVER`](drop-server.html "13.1.28 DROP SERVER Statement") are not written to the binary log, regardless of the binary logging format that is in use.
