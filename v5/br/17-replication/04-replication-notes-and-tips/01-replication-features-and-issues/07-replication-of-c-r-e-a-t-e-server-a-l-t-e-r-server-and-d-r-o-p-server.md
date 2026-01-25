#### 16.4.1.7 Replicação de CREATE SERVER, ALTER SERVER e DROP SERVER

As *statements* [`CREATE SERVER`](create-server.html "13.1.17 CREATE SERVER Statement"), [`ALTER SERVER`](alter-server.html "13.1.7 ALTER SERVER Statement") e [`DROP SERVER`](drop-server.html "13.1.28 DROP SERVER Statement") não são escritas no *binary log*, independentemente do *binary logging format* que esteja em uso.