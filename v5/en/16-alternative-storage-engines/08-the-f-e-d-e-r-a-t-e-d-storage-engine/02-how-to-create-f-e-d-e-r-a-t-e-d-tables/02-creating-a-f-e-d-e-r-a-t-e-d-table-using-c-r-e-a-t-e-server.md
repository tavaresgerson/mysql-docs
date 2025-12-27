#### 15.8.2.2 Creating a FEDERATED Table Using CREATE SERVER

If you are creating a number of `FEDERATED` tables on the same server, or if you want to simplify the process of creating `FEDERATED` tables, you can use the `CREATE SERVER` statement to define the server connection parameters, just as you would with the `CONNECTION` string.

The format of the `CREATE SERVER` statement is:

```sql
CREATE SERVER
server_name
FOREIGN DATA WRAPPER wrapper_name
OPTIONS (option [, option] ...)
```

The *`server_name`* is used in the connection string when creating a new `FEDERATED` table.

For example, to create a server connection identical to the `CONNECTION` string:

```sql
CONNECTION='mysql://fed_user@remote_host:9306/federated/test_table';
```

You would use the following statement:

```sql
CREATE SERVER fedlink
FOREIGN DATA WRAPPER mysql
OPTIONS (USER 'fed_user', HOST 'remote_host', PORT 9306, DATABASE 'federated');
```

To create a `FEDERATED` table that uses this connection, you still use the `CONNECTION` keyword, but specify the name you used in the `CREATE SERVER` statement.

```sql
CREATE TABLE test_table (
    id     INT(20) NOT NULL AUTO_INCREMENT,
    name   VARCHAR(32) NOT NULL DEFAULT '',
    other  INT(20) NOT NULL DEFAULT '0',
    PRIMARY KEY  (id),
    INDEX name (name),
    INDEX other_key (other)
)
ENGINE=FEDERATED
DEFAULT CHARSET=latin1
CONNECTION='fedlink/test_table';
```

The connection name in this example contains the name of the connection (`fedlink`) and the name of the table (`test_table`) to link to, separated by a slash. If you specify only the connection name without a table name, the table name of the local table is used instead.

For more information on `CREATE SERVER`, see Section 13.1.17, “CREATE SERVER Statement”.

The `CREATE SERVER` statement accepts the same arguments as the `CONNECTION` string. The `CREATE SERVER` statement updates the rows in the `mysql.servers` table. See the following table for information on the correspondence between parameters in a connection string, options in the `CREATE SERVER` statement, and the columns in the `mysql.servers` table. For reference, the format of the `CONNECTION` string is as follows:

```sql
scheme://user_name[:password]@host_name[:port_num]/db_name/tbl_name
```

<table summary="The correspondence between parameters in a connection string, options in the CREATE SERVER statement, and the columns in the mysql.servers table."><col style="width: 25%"/><col style="width: 25%"/><col style="width: 25%"/><col style="width: 25%"/><thead><tr> <th scope="col">Description</th> <th scope="col"><code class="literal">CONNECTION</code> string</th> <th scope="col"><a class="link" href="create-server.html" title="13.1.17 CREATE SERVER Statement"><code class="literal">CREATE SERVER</code></a> option</th> <th scope="col"><code class="literal">mysql.servers</code> column</th> </tr></thead><tbody><tr> <th scope="row">Connection scheme</th> <td><em class="replaceable"><code>scheme</code></em></td> <td><code class="literal">wrapper_name</code></td> <td><code class="literal">Wrapper</code></td> </tr><tr> <th scope="row">Remote user</th> <td><em class="replaceable"><code>user_name</code></em></td> <td><code class="literal">USER</code></td> <td><code class="literal">Username</code></td> </tr><tr> <th scope="row">Remote password</th> <td><em class="replaceable"><code>password</code></em></td> <td><code class="literal">PASSWORD</code></td> <td><code class="literal">Password</code></td> </tr><tr> <th scope="row">Remote host</th> <td><em class="replaceable"><code>host_name</code></em></td> <td><code class="literal">HOST</code></td> <td><code class="literal">Host</code></td> </tr><tr> <th scope="row">Remote port</th> <td><em class="replaceable"><code>port_num</code></em></td> <td><code class="literal">PORT</code></td> <td><code class="literal">Port</code></td> </tr><tr> <th scope="row">Remote database</th> <td><em class="replaceable"><code>db_name</code></em></td> <td><code class="literal">DATABASE</code></td> <td><code class="literal">Db</code></td> </tr></tbody></table>
