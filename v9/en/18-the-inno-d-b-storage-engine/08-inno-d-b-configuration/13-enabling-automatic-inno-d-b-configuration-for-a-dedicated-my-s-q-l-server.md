### 17.8.13 Enabling Automatic InnoDB Configuration for a Dedicated MySQL Server

When the server is started with `--innodb-dedicated-server`, `InnoDB` automatically calculates values for and sets the following system variables:

* `innodb_buffer_pool_size`
* `innodb_redo_log_capacity`

You should consider using `--innodb-dedicated-server` only if the MySQL instance resides on a dedicated server where it can use all available system resources—for example, if you run MySQL Server in a Docker container or dedicated VM that runs MySQL only. Using `--innodb-dedicated-server` is not recommended if the MySQL instance shares system resources with other applications.

The value for each affected variable is determined and applied by `--innodb-dedicated-server` as described in the following list:

* `innodb_buffer_pool_size`

  Buffer pool size is calculated according to the amount of memory detected on the server, as shown in the following table:

  **Table 17.8 Automatically Configured Buffer Pool Size**

  <table summary="The first column           shows the amount of server memory detected. The second column shows           the buffer pool size which is automatically determined."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Detected Server Memory</th> <th>Buffer Pool Size</th> </tr></thead><tbody><tr> <td>Less than 1GB</td> <td>128MB (the default value)</td> </tr><tr> <td>1GB to 4GB</td> <td><em class="replaceable"><code>detected server memory</code></em> * 0.5</td> </tr><tr> <td>Greater than 4GB</td> <td><em class="replaceable"><code>detected server memory</code></em> * 0.75</td> </tr></tbody></table>

* `innodb_redo_log_capacity`

  Redo log capacity is calculated according to the number of logical processors available on the server. The formula is (number of available logical processors / 2) GB, with a maximum dynamic default value of 16 GB.

If one of the variables listed previously is set explicitly in an option file or elsewhere, this explicit value is used, and a startup warning similar to this one is printed to `stderr`:

[Warning] [000000] InnoDB: Option innodb_dedicated_server is ignored for innodb_buffer_pool_size because innodb_buffer_pool_size=134217728 is specified explicitly.

Setting one variable explicitly does not prevent the automatic configuration of other options.

If the server is started with `--innodb-dedicated-server` and `innodb_buffer_pool_size` is set explicitly, variable settings based on buffer pool size use the buffer pool size value calculated according to the amount of memory detected on the server rather than the explicitly defined buffer pool size value.

Note

Automatic configuration settings are applied by `--innodb-dedicated-server` *only* when the MySQL server is started. If you later set any of the affected variables explicitly, this overrides its predetermined value, and the value that was explicitly set is applied. Setting one of these variables to `DEFAULT` causes it to be set to the actual default value as shown in the variable's description in the Manual, and does *not* cause it to revert to the value set by `--innodb-dedicated-server`. The corresponding system variable `innodb_dedicated_server` is changed only by starting the server with `--innodb-dedicated-server` (or with `--innodb-dedicated-server=ON` or `--innodb-dedicated-server=OFF`); it is otherwise read-only.
