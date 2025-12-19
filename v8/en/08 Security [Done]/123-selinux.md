## 8.7 SELinux

Security-Enhanced Linux (SELinux) is a mandatory access control (MAC) system that implements access rights by applying a security label referred to as an *SELinux context* to each system object. SELinux policy modules use SELinux contexts to define rules for how processes, files, ports, and other system objects interact with each other. Interaction between system objects is only permitted if a policy rule allows it.

An SELinux context (the label applied to a system object) has the following fields: `user`, `role`, `type`, and `security level`. Type information rather than the entire SELinux context is used most commonly to define rules for how processes interact with other system objects. MySQL SELinux policy modules, for example, define policy rules using `type` information.

You can view SELinux contexts using operating system commands such as **ls** and **ps** with the `-Z` option. Assuming that SELinux is enabled and a MySQL Server is running, the following commands show the SELinux context for the  **mysqld** process and MySQL data directory:

 **mysqld** process:

```
$> ps -eZ | grep mysqld
system_u:system_r:mysqld_t:s0    5924 ?        00:00:03 mysqld
```

MySQL data directory:

```
$> cd /var/lib
$> ls -Z | grep mysql
system_u:object_r:mysqld_db_t:s0 mysql
```

where:

* `system_u` is an SELinux user identity for system processes and objects.
* `system_r` is an SELinux role used for system processes.
* `objects_r` is an SELinux role used for system objects.
* `mysqld_t` is the type associated with the mysqld process.
* `mysqld_db_t` is the type associated with the MySQL data directory and its files.
* `s0` is the security level.

For more information about interpreting SELinux contexts, refer to your distribution's SELinux documentation.
