#### 8.7.5.1 Setting the TCP Port Context for mysqld

The default TCP port for  **mysqld** is `3306`; and the SELinux context type used is `mysqld_port_t`.

If you configure  **mysqld** to use a different TCP  `port`, you may need to set the context for the new port. For example to define the SELinux context for a non-default port such as port 3307:

```
semanage port -a -t mysqld_port_t -p tcp 3307
```

To confirm that the port is added:

```
$> semanage port -l | grep mysqld
mysqld_port_t                  tcp      3307, 1186, 3306, 63132-63164
```
