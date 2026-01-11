## 34.4 Connecting

This section describes the various connection methods for connecting to the deployed MySQL server on the OCI Compute Instance.

### Connecting with SSH

This section gives some detail on connecting from a UNIX-like platform to the OCI Compute. For more information on connecting with SSH, see Accessing an Oracle Linux Instance Using SSH and Connecting to Your Instance.

To connect to the Oracle Linux running on the Compute Instance with SSH, run the following command:

```
ssh opc@computeIP
```

where `opc` is the compute user and *`computeIP`* is the IP address of your Compute Instance.

To find the temporary root password created for the root user, run the following command:

```
sudo grep 'temporary password' /var/log/mysqld.log
```

To change your default password, log in to the server using the generated, temporary password, using the following command: `mysql -uroot -p`. Then run the following:

```
ALTER USER 'root'@'localhost' IDENTIFIED BY 'MyNewPass4!';
```

### Connecting with MySQL Client

Note

To connect from your local MySQL client, you must first create on the MySQL server a user which allows remote login.

To connect to the MySQL Server from your local MySQL client, run the following command from your shell session:

```
mysql -uroot -p -hcomputeIP
```

where *`computeIP`* is the IP address of your Compute Instance.

### Connecting with MySQL Shell

To connect to the MySQL Server from your local MySQL Shell, run the following command to start your shell session:

```
mysqlsh root@computeIP
```

where *`computeIP`* is the IP address of your Compute Instance.

For more information on MySQL Shell connections, see MySQL Shell Connections.

### Connecting with Workbench

To connect to the MySQL Server from MySQL Workbench, see Connections in MySQL Workbench.
