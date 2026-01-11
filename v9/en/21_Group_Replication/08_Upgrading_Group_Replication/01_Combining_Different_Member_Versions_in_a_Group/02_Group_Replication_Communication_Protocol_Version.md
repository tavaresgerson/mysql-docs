#### 20.8.1.2 Group Replication Communication Protocol Version

A replication group uses a Group Replication communication protocol version that differs from the MySQL Server version of the members. To check the group's communication protocol version, issue the following statement on any member:

```
SELECT @@version, group_replication_get_communication_protocol();
+------------------------------------------------------------+
| @@version | group_replication_get_communication_protocol() |
+------------------------------------------------------------+
| 8.4.0     | 8.0.27                                         |
+------------------------------------------------------------+
```

As demonstrated, the MySQL 8.4 LTS series uses the `8.0.27` communication protocol.

For more information, see Section 20.5.1.4, “Setting a Group's Communication Protocol Version”.
