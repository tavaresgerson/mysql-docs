### 20.6.3 Securing Distributed Recovery Connections

20.6.3.1 Secure User Credentials for Distributed Recovery

20.6.3.2 Secure Socket Layer (SSL) Connections for Distributed Recovery

Important

When using the MySQL communication stack (`group_replication_communication_stack=MYSQL`) AND secure connections between members (`group_replication_ssl_mode` is not set to `DISABLED`), the security settings discussed in this section are applied not just to distributed recovery connections, but to group communications between members in general.

When a member joins the group, distributed recovery is carried out using a combination of a remote cloning operation, if available and appropriate, and an asynchronous replication connection. For a full description of distributed recovery, see Section 20.5.4, “Distributed Recovery”.

Group members offer their standard SQL client connection to joining members for distributed recovery, as specified by MySQL Server's `hostname` and `port` system variables, and may (also) advertise an alternative list of distributed recovery endpoints as dedicated client connections for joining members. For more details, see Section 20.5.4.1, “Connections for Distributed Recovery”. Notice that such connections offered to a joining member for distributed recovery is *not* the same connections that are used by Group Replication for communication between online members when the XCom communication stack is used for group communications (`group_replication_communication_stack=XCOM`).

To secure distributed recovery connections in the group, ensure that user credentials for the replication user are properly secured, and use SSL for distributed recovery connections if possible.
