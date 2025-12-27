### 17.6.1 Group Replication IP Address Allowlisting

The Group Replication plugin has a configuration option to determine from which hosts an incoming Group Communication System connection can be accepted. This option is called [`group_replication_ip_whitelist`](group-replication-system-variables.html#sysvar_group_replication_ip_whitelist). If you set this option on a server s1, then when server s2 is establishing a connection to s1 for the purpose of engaging group communication, s1 first checks the allowlist before accepting the connection from s2. If s2 is in the allowlist, then s1 accepts the connection, otherwise s1 rejects the connection attempt by s2.

If you do not specify an allowlist explicitly, the group communication engine (XCom) automatically scans active interfaces on the host, and identifies those with addresses on private subnetworks. These addresses and the `localhost` IP address for IPv4 are used to create an automatic Group Replication allowlist. The automatic allowlist therefore includes any IP addresses found for the host in the following ranges:

```sql
10/8 prefix       (10.0.0.0 - 10.255.255.255) - Class A
172.16/12 prefix  (172.16.0.0 - 172.31.255.255) - Class B
192.168/16 prefix (192.168.0.0 - 192.168.255.255) - Class C
127.0.0.1 - localhost for IPv4
```

An entry is added to the error log stating the addresses that have been allowlisted automatically for the host.

The automatic allowlist of private addresses cannot be used for connections from servers outside the private network, so a server, even if it has interfaces on public IPs, does not by default allow Group Replication connections from external hosts. For Group Replication connections between server instances that are on different machines, you must provide public IP addresses and specify these as an explicit allowlist. If you specify any entries for the allowlist, the private and `localhost` addresses are not added automatically, so if you use any of these, you must specify them explicitly.

To specify an allowlist manually, use the [`group_replication_ip_whitelist`](group-replication-system-variables.html#sysvar_group_replication_ip_whitelist) option. You cannot change the allowlist on a server while it is an active member of a replication group. If the member is active, you must issue a [`STOP GROUP_REPLICATION`](stop-group-replication.html "13.4.3.2 STOP GROUP_REPLICATION Statement") statement before changing the allowlist, and a [`START GROUP_REPLICATION`](start-group-replication.html "13.4.3.1 START GROUP_REPLICATION Statement") statement afterwards.

In the allowlist, you can specify any combination of the following:

* IPv4 addresses (for example, `198.51.100.44`)
* IPv4 addresses with CIDR notation (for example, `192.0.2.21/24`)

* Host names, from MySQL 5.7.21 (for example, `example.org`)

* Host names with CIDR notation, from MySQL 5.7.21 (for example, `www.example.com/24`)

IPv6 addresses, and host names that resolve to IPv6 addresses, are not supported in MySQL 5.7. You can use CIDR notation in combination with host names or IP addresses to allowlist a block of IP addresses with a particular network prefix, but do ensure that all the IP addresses in the specified subnet are under your control.

You must stop and restart Group Replication on a member in order to change its allowlist. A comma must separate each entry in the allowlist. For example:

```sql
mysql> STOP GROUP_REPLICATION;
mysql> SET GLOBAL group_replication_ip_whitelist="192.0.2.21/24,198.51.100.44,203.0.113.0/24,example.org,www.example.com/24";
mysql> START GROUP_REPLICATION;
```

The allowlist must contain the IP address or host name that is specified in each member's [`group_replication_local_address`](group-replication-system-variables.html#sysvar_group_replication_local_address) system variable. This address is not the same as the MySQL server SQL protocol host and port, and is not specified in the [`bind_address`](server-system-variables.html#sysvar_bind_address) system variable for the server instance.

When a replication group is reconfigured (for example, when a new primary is elected or a member joins or leaves), the group members re-establish connections between themselves. If a group member is only allowlisted by servers that are no longer part of the replication group after the reconfiguration, it is unable to reconnect to the remaining servers in the replication group that do not allowlist it. To avoid this scenario entirely, specify the same allowlist for all servers that are members of the replication group.

Note

It is possible to configure different allowlists on different group members according to your security requirements, for example, in order to keep different subnets separate. If you need to configure different allowlists to meet your security requirements, ensure that there is sufficient overlap between the allowlists in the replication group to maximize the possibility of servers being able to reconnect in the absence of their original seed member.

For host names, name resolution takes place only when a connection request is made by another server. A host name that cannot be resolved is not considered for allowlist validation, and a warning message is written to the error log. Forward-confirmed reverse DNS (FCrDNS) verification is carried out for resolved host names.

Warning

Host names are inherently less secure than IP addresses in an allowlist. FCrDNS verification provides a good level of protection, but can be compromised by certain types of attack. Specify host names in your allowlist only when strictly necessary, and ensure that all components used for name resolution, such as DNS servers, are maintained under your control. You can also implement name resolution locally using the hosts file, to avoid the use of external components.
