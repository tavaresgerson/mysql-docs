#### 18.8.2.2 Creating a FEDERATED Table Using CREATE SERVER

If you are creating a number of `FEDERATED` tables on the same server, or if you want to simplify the process of creating `FEDERATED` tables, you can use the `CREATE SERVER` statement to define the server connection parameters, just as you would with the `CONNECTION` string.

The format of the `CREATE SERVER` statement is:

```
CREATE SERVER
server_name
FOREIGN DATA WRAPPER wrapper_name
OPTIONS (option [, option] ...)
```

The *`server_name`* is used in the connection string when creating a new `FEDERATED` table.

For example, to create a server connection identical to the `CONNECTION` string:

```
CONNECTION='mysql://fed_user@remote_host:9306/federated/test_table';
```

You would use the following statement:

```
CREATE SERVER fedlink
FOREIGN DATA WRAPPER mysql
OPTIONS (USER 'fed_user', HOST 'remote_host', PORT 9306, DATABASE 'federated');
```

To create a `FEDERATED` table that uses this connection, you still use the `CONNECTION` keyword, but specify the name you used in the `CREATE SERVER` statement.

```
CREATE TABLE test_table (
    id     INT(20) NOT NULL AUTO_INCREMENT,
    name   VARCHAR(32) NOT NULL DEFAULT '',
    other  INT(20) NOT NULL DEFAULT '0',
    PRIMARY KEY  (id),
    INDEX name (name),
    INDEX other_key (other)
)
ENGINE=FEDERATED
DEFAULT CHARSET=utf8mb4
CONNECTION='fedlink/test_table';
```

The connection name in this example contains the name of the connection (`fedlink`) and the name of the table (`test_table`) to link to, separated by a slash. If you specify only the connection name without a table name, the table name of the local table is used instead.

For more information on `CREATE SERVER`, see Section 15.1.22, “CREATE SERVER Statement”.

The `CREATE SERVER` statement accepts the same arguments as the `CONNECTION` string. The `CREATE SERVER` statement updates the rows in the `mysql.servers` table. See the following table for information on the correspondence between parameters in a connection string, options in the `CREATE SERVER` statement, and the columns in the `mysql.servers` table. For reference, the format of the `CONNECTION` string is as follows:

```
scheme://user_name[:password]@host_name[:port_num]/db_name/tbl_name
```

<table summary="The correspondence between parameters in a connection string, options in the CREATE SERVER statement, and the columns in the mysql.servers table."><thead><tr> <th>Description</th> <th><code>CONNECTION</code> string</th> <th><code>CREATE SERVER</code> option</th> <th><code>mysql.servers</code> column</th> </tr></thead><tbody><tr> <th>Connection scheme</th> <td><em><code>scheme</code></em></td> <td><code>wrapper_name</code></td> <td><code>Wrapper</code></td> </tr><tr> <th>Remote user</th> <td><em><code>user_name</code></em></td> <td><code>USER</code></td> <td><code>Username</code></td> </tr><tr> <th>Remote password</th> <td><em><code>password</code></em></td> <td><code>PASSWORD</code></td> <td><code>Password</code></td> </tr><tr> <th>Remote host</th> <td><em><code>host_name</code></em></td> <td><code>HOST</code></td> <td><code>Host</code></td> </tr><tr> <th>Remote port</th> <td><em><code>port_num</code></em></td> <td><code>PORT</code></td> <td><code>Port</code></td> </tr><tr> <th>Remote database</th> <td><em><code>db_name</code></em></td> <td><code>DATABASE</code></td> <td><code>Db</code></td> </tr></tbody></table>
