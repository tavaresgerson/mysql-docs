#### 16.4.1.17 Replication e LIMIT

A Replication baseada em Statement (Statement-based replication) de cláusulas `LIMIT` em comandos [`DELETE`](delete.html "13.2.2 DELETE Statement"), [`UPDATE`](update.html "13.2.11 UPDATE Statement") e [`INSERT ... SELECT`](insert-select.html "13.2.5.1 INSERT ... SELECT Statement") é insegura (unsafe), pois a ordem das linhas afetadas não está definida. (Tais comandos só podem ser replicados corretamente com Statement-based replication se também contiverem uma cláusula `ORDER BY`.) Quando tal comando é encontrado:

*   Ao usar o modo `STATEMENT`, um aviso (warning) de que o comando não é seguro para Statement-based replication é emitido.

    Ao usar o modo `STATEMENT`, avisos são emitidos para comandos DML contendo `LIMIT` mesmo quando eles também possuem uma cláusula `ORDER BY` (e, portanto, são tornados determinísticos). Este é um problema conhecido (known issue). (Bug #42851)

*   Ao usar o modo `MIXED`, o comando é automaticamente replicado usando o modo Row-based.