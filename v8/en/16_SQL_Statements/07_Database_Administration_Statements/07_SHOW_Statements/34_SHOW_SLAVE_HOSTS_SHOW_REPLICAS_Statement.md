#### 15.7.7.34 SHOW SLAVE HOSTS | SHOW REPLICAS Statement

```
{SHOW SLAVE HOSTS | SHOW REPLICAS}
```

Displays a list of replicas currently registered with the
source. From MySQL 8.0.22, [`SHOW SLAVE
HOSTS`](show-slave-hosts.html "15.7.7.34 SHOW SLAVE HOSTS | SHOW REPLICAS Statement") is deprecated and the alias
[`SHOW REPLICAS`](show-replicas.html "15.7.7.33 SHOW REPLICAS Statement") should be used
instead. The statement works in the same way as before, only the
terminology used for the statement and its output has changed.
Both versions of the statement update the same status variables
when used. Please see the documentation for
[`SHOW REPLICAS`](show-replicas.html "15.7.7.33 SHOW REPLICAS Statement") for a description
of the statement.