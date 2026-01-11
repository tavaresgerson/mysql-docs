### 8.7.5 SELinux TCP Port Context

8.7.5.1 Setting the TCP Port Context for mysqld

8.7.5.2 Setting the TCP Port Context for MySQL Features

The instructions that follow use the `semanage` binary to manage port context; on RHEL, it's part of the `policycoreutils-python-utils` package:

```
yum install -y policycoreutils-python-utils
```

After installing the `semanage` binary, you can list ports defined with the `mysqld_port_t` context using `semanage` with the `port` option.

```
$> semanage port -l | grep mysqld
mysqld_port_t                  tcp      1186, 3306, 63132-63164
```
