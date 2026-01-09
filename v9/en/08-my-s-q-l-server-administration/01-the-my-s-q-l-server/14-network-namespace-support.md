### 7.1.14 Network Namespace Support

A network namespace is a logical copy of the network stack from the host system. Network namespaces are useful for setting up containers or virtual environments. Each namespace has its own IP addresses, network interfaces, routing tables, and so forth. The default or global namespace is the one in which the host system physical interfaces exist.

Namespace-specific address spaces can lead to problems when MySQL connections cross namespaces. For example, the network address space for a MySQL instance running in a container or virtual network may differ from the address space of the host machine. This can produce phenomena such as a client connection from an address in one namespace appearing to the MySQL server to be coming from a different address, even for client and server running on the same machine. Suppose that both processes run on a host with IP address `203.0.113.10` but use different namespaces. A connection may produce a result like this:

```
$> mysql --user=admin --host=203.0.113.10 --protocol=tcp

mysql> SELECT USER();
+--------------------+
| USER()             |
+--------------------+
| admin@198.51.100.2 |
+--------------------+
```

In this case, the expected `USER()` value is `admin@203.0.113.10`. Such behavior can make it difficult to assign account permissions properly if the address from which an connection originates is not what it appears.

To address this issue, MySQL enables specifying the network namespace to use for TCP/IP connections, so that both endpoints of connections use an agreed-upon common address space.

MySQL supports network namespaces on platforms that implement them. Support within MySQL applies to:

* The MySQL server, **mysqld**.
* X Plugin.
* The **mysql** client and the **mysqlxtest** test suite client. (Other clients are not supported. They must be invoked from within the network namespace of the server to which they are to connect.)

* Regular replication.
* Group Replication, only when using the MySQL communication stack to establish group communication connections.

The following sections describe how to use network namespaces in MySQL:

* Host System Prerequisites
* MySQL Configuration
* Network Namespace Monitoring

#### Host System Prerequisites

Prior to using network namespace support in MySQL, these host system prerequisites must be satisfied:

* The host operating system must support network namespaces. (For example, Linux.)

* Any network namespace to be used by MySQL must first be created on the host system.

* Host name resolution must be configured by the system administrator to support network namespaces.

  Note

  A known limitation is that, within MySQL, host name resolution does not work for names specified in network namespace-specific host files. For example, if the address for a host name in the `red` namespace is specified in the `/etc/netns/red/hosts` file, binding to the name fails on both the server and client sides. The workaround is to use the IP address rather than the host name.

* The system administrator must enable the `CAP_SYS_ADMIN` operating system privilege for the MySQL binaries that support network namespaces (**mysqld**, **mysql**, **mysqlxtest**).

  Important

  Enabling `CAP_SYS_ADMIN` is a security sensitive operation because it enables a process to perform other privileged actions in addition to setting namespaces. For a description of its effects, see <https://man7.org/linux/man-pages/man7/capabilities.7.html>.

  Because `CAP_SYS_ADMIN` must be enabled explicitly by the system administrator, MySQL binaries by default do not have network namespace support enabled. The system administrator should evaluate the security implications of running MySQL processes with `CAP_SYS_ADMIN` before enabling it.

The instructions in the following example set up network namespaces named `red` and `blue`. The names you choose may differ, as may the network addresses and interfaces on your host system.

Invoke the commands shown here either as the `root` operating system user or by prefixing each command with **sudo**. For example, to invoke the **ip** or **setcap** command if you are not `root`, use **sudo ip** or **sudo setcap**.

To configure network namespaces, use the **ip** command. For some operations, the **ip** command must execute within a particular namespace (which must already exist). In such cases, begin the command like this:

```
ip netns exec namespace_name
```

For example, this command executes within the `red` namespace to bring up the loopback interface:

```
ip netns exec red ip link set lo up
```

To add namespaces named `red` and `blue`, each with its own virtual Ethernet device used as a link between namespaces and its own loopback interface:

```
ip netns add red
ip link add veth-red type veth peer name vpeer-red
ip link set vpeer-red netns red
ip addr add 192.0.2.1/24 dev veth-red
ip link set veth-red up
ip netns exec red ip addr add 192.0.2.2/24 dev vpeer-red
ip netns exec red ip link set vpeer-red up
ip netns exec red ip link set lo up

ip netns add blue
ip link add veth-blue type veth peer name vpeer-blue
ip link set vpeer-blue netns blue
ip addr add 198.51.100.1/24 dev veth-blue
ip link set veth-blue up
ip netns exec blue ip addr add 198.51.100.2/24 dev vpeer-blue
ip netns exec blue ip link set vpeer-blue up
ip netns exec blue ip link set lo up

# if you want to enable inter-subnet routing...
sysctl net.ipv4.ip_forward=1
ip netns exec red ip route add default via 192.0.2.1
ip netns exec blue ip route add default via 198.51.100.1
```

A diagram of the links between namespaces looks like this:

```
red              global           blue

192.0.2.2   <=>  192.0.2.1
(vpeer-red)      (veth-red)

                 198.51.100.1 <=> 198.51.100.2
                 (veth-blue)      (vpeer-blue)
```

To check which namespaces and links exist:

```
ip netns list
ip link list
```

To see the routing tables for the global and named namespaces:

```
ip route show
ip netns exec red ip route show
ip netns exec blue ip route show
```

To remove the `red` and `blue` links and namespaces:

```
ip link del veth-red
ip link del veth-blue

ip netns del red
ip netns del blue

sysctl net.ipv4.ip_forward=0
```

So that the MySQL binaries that include network namespace support can actually use namespaces, you must grant them the `CAP_SYS_ADMIN` capability. The following **setcap** commands assume that you have changed location to the directory containing your MySQL binaries (adjust the pathname for your system as necessary):

```
cd /usr/local/mysql/bin
```

To grant `CAP_SYS_ADMIN` capability to the appropriate binaries:

```
setcap cap_sys_admin+ep ./mysqld
setcap cap_sys_admin+ep ./mysql
setcap cap_sys_admin+ep ./mysqlxtest
```

To check `CAP_SYS_ADMIN` capability:

```
$> getcap ./mysqld ./mysql ./mysqlxtest
./mysqld = cap_sys_admin+ep
./mysql = cap_sys_admin+ep
./mysqlxtest = cap_sys_admin+ep
```

To remove `CAP_SYS_ADMIN` capability:

```
setcap -r ./mysqld
setcap -r ./mysql
setcap -r ./mysqlxtest
```

Important

If you reinstall binaries to which you have previously applied **setcap**, you must use **setcap** again. For example, if you perform an in-place MySQL upgrade, failure to grant the `CAP_SYS_ADMIN` capability again results in namespace-related failures. The server fails with this error for attempts to bind to an address with a named namespace:

```
[ERROR] [MY-013408] [Server] setns() failed with error 'Operation not permitted'
```

A client invoked with the `--network-namespace` option fails like this:

```
ERROR: Network namespace error: Operation not permitted
```

#### MySQL Configuration

Assuming that the preceding host system prerequisites have been satisfied, MySQL enables configuring the server-side namespace for the listening (inbound) side of connections and the client-side namespace for the outbound side of connections.

On the server side, the `bind_address`, `admin_address`, and `mysqlx_bind_address` system variables have extended syntax for specifying the network namespace to use for a given IP address or host name on which to listen for incoming connections. To specify a namespace for an address, add a slash and the namespace name. For example, a server `my.cnf` file might contain these lines:

```
[mysqld]
bind_address = 127.0.1.1,192.0.2.2/red,198.51.100.2/blue
admin_address = 102.0.2.2/red
mysqlx_bind_address = 102.0.2.2/red
```

These rules apply:

* A network namespace can be specified for an IP address or a host name.

* A network namespace cannot be specified for a wildcard IP address.

* For a given address, the network namespace is optional. If given, it must be specified as a `/ns` suffix immediately following the address.

* An address with no `/ns` suffix uses the host system global namespace. The global namespace is therefore the default.

* An address with a `/ns` suffix uses the namespace named *`ns`*.

* The host system must support network namespaces and each named namespace must previously have been set up. Naming a nonexistent namespace produces an error.

* `bind_address` and `mysqlx_bind_address` accept a list of multiple comma-separated addresses, the variable value can specify addresses in the global namespace, in named namespaces, or a mix.

If an error occurs during server startup for attempts to use a namespace, the server does not start. If errors occur for X Plugin during plugin initialization such that it is unable to bind to any address, the plugin fails its initialization sequence and the server does not load it.

On the client side, a network namespace can be specified in these contexts:

* For the **mysql** client and the **mysqlxtest** test suite client, use the `--network-namespace` option. For example:

  ```
  mysql --host=192.0.2.2 --network-namespace=red
  ```

  If the `--network-namespace` option is omitted, the connection uses the default (global) namespace.

* For replication connections from replica servers to source servers, use the `CHANGE REPLICATION SOURCE TO` statement and specify the `NETWORK_NAMESPACE` option. For example:

  ```
  CHANGE REPLICATION SOURCE TO
    SOURCE_HOST = '192.0.2.2',
    NETWORK_NAMESPACE = 'red';
  ```

  If the `NETWORK_NAMESPACE` option is omitted, replication connections use the default (global) namespace.

The following example sets up a MySQL server that listens for connections in the global, `red`, and `blue` namespaces, and shows how to configure accounts that connect from the `red` and `blue` namespaces. It is assumed that the `red` and `blue` namespaces have already been created as shown in Host System Prerequisites.

1. Configure the server to listen on addresses in multiple namespaces. Put these lines in the server `my.cnf` file and start the server:

   ```
   [mysqld]
   bind_address = 127.0.1.1,192.0.2.2/red,198.51.100.2/blue
   ```

   The value tells the server to listen on the loopback address `127.0.0.1` in the global namespace, the address `192.0.2.2` in the `red` namespace, and the address `198.51.100.2` in the `blue` namespace.

2. Connect to the server in the global namespace and create accounts that have permission to connect from an address in the address space of each named namespace:

   ```
   $> mysql -u root -h 127.0.0.1 -p
   Enter password: root_password

   mysql> CREATE USER 'red_user'@'192.0.2.2'
          IDENTIFIED BY 'red_user_password';
   mysql> CREATE USER 'blue_user'@'198.51.100.2'
          IDENTIFIED BY 'blue_user_password';
   ```

3. Verify that you can connect to the server in each named namespace:

   ```
   $> mysql -u red_user -h 192.0.2.2 --network-namespace=red -p
   Enter password: red_user_password

   mysql> SELECT USER();
   +--------------------+
   | USER()             |
   +--------------------+
   | red_user@192.0.2.2 |
   +--------------------+
   ```

   ```
   $> mysql -u blue_user -h 198.51.100.2 --network-namespace=blue -p
   Enter password: blue_user_password

   mysql> SELECT USER();
   +------------------------+
   | USER()                 |
   +------------------------+
   | blue_user@198.51.100.2 |
   +------------------------+
   ```

   Note

   You might see different results from `USER()`, which can return a value that includes a host name rather than an IP address if your DNS is configured to be able to resolve the address to the corresponding host name and the server is not run with the `skip_name_resolve` system variable enabled.

   You might also try invoking **mysql** without the `--network-namespace` option to see whether the connection attempt succeeds, and, if so, how the `USER()` value is affected.

#### Network Namespace Monitoring

For replication monitoring purposes, these information sources have a column that displays the applicable network namespace for connections:

* The Performance Schema `replication_connection_configuration` table. See Section 29.12.11.12, “The replication_connection_configuration Table”.

* The replica server connection metadata repository. See Section 19.2.4.2, “Replication Metadata Repositories”.

* The `SHOW REPLICA STATUS` statement.
