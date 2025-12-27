#### 6.4.4.5 Using the keyring\_aws Amazon Web Services Keyring Plugin

Note

The `keyring_aws` plugin is an extension included in MySQL Enterprise Edition, a commercial product. To learn more about commercial products, see <https://www.mysql.com/products/>.

The `keyring_aws` keyring plugin communicates with the Amazon Web Services Key Management Service (AWS KMS) as a back end for key generation and uses a local file for key storage. All keyring material is generated exclusively by the AWS server, not by `keyring_aws`.

MySQL Enterprise Edition can work with `keyring_aws` on Red Hat Enterprise Linux, SUSE Linux Enterprise Server, Debian, Ubuntu, macOS, and Windows. MySQL Enterprise Edition does not support the use of `keyring_aws` on these platforms:

* EL6
* Generic Linux (glibc2.12)
* Solaris

The discussion here assumes that you are familiar with AWS in general and KMS in particular. Some pertinent information sources:

* [AWS site](https://aws.amazon.com/kms/)
* [KMS documentation](https://docs.aws.amazon.com/kms/)

The following sections provide configuration and usage information for the `keyring_aws` keyring plugin:

* [keyring\_aws Configuration](keyring-aws-plugin.html#keyring-aws-plugin-configuration "keyring_aws Configuration")
* [keyring\_aws Operation](keyring-aws-plugin.html#keyring-aws-plugin-operation "keyring_aws Operation")
* [keyring\_aws Credential Changes](keyring-aws-plugin.html#keyring-aws-plugin-credential-changes "keyring_aws Credential Changes")

##### keyring\_aws Configuration

To install `keyring_aws`, use the general instructions found in [Section 6.4.4.1, “Keyring Plugin Installation”](keyring-plugin-installation.html "6.4.4.1 Keyring Plugin Installation"), together with the plugin-specific configuration information found here.

The plugin library file contains the `keyring_aws` plugin and two loadable functions, [`keyring_aws_rotate_cmk()`](keyring-functions-plugin-specific.html#function_keyring-aws-rotate-cmk) and [`keyring_aws_rotate_keys()`](keyring-functions-plugin-specific.html#function_keyring-aws-rotate-keys).

To configure `keyring_aws`, you must obtain a secret access key that provides credentials for communicating with AWS KMS and write it to a configuration file:

1. Create an AWS KMS account.
2. Use AWS KMS to create a secret access key ID and secret access key. The access key serves to verify your identity and that of your applications.

3. Use the AWS KMS account to create a customer master key (CMK) ID. At MySQL startup, set the [`keyring_aws_cmk_id`](keyring-system-variables.html#sysvar_keyring_aws_cmk_id) system variable to the CMK ID value. This variable is mandatory and there is no default. (Its value can be changed at runtime if desired using [`SET GLOBAL`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment").)

4. If necessary, create the directory in which the configuration file should be located. The directory should have a restrictive mode and be accessible only to the account used to run the MySQL server. For example, on many Unix and Unix-like systems, such as Oracle Enterprise Linux, to use `/usr/local/mysql/mysql-keyring/keyring_aws_conf` as the file name, the following commands (executed as `root`) create its parent directory and set the directory mode and ownership:

   ```sql
   $> cd /usr/local/mysql
   $> mkdir mysql-keyring
   $> chmod 750 mysql-keyring
   $> chown mysql mysql-keyring
   $> chgrp mysql mysql-keyring
   ```

   At MySQL startup, set the [`keyring_aws_conf_file`](keyring-system-variables.html#sysvar_keyring_aws_conf_file) system variable to `/usr/local/mysql/mysql-keyring/keyring_aws_conf` to indicate the configuration file location to the server.

   The location of the configuration file may vary according to Linux distribution; the directory for this file may also already be provided by a system module or other application such as AppArmor. For example, under AppArmor on recent editions of Ubuntu Linux, the keyring directory is specified as `/var/lib/mysql-keyring`. See [Ubuntu Server: AppArmor](https://documentation.ubuntu.com/server/how-to/security/apparmor/index.html) for more information about using AppArmor on Ubuntu systems; see also [this example MySQL configuration file](https://exampleconfig.com/view/mysql-ubuntu20-04-etc-apparmor-d-usr-sbin-mysqld). For other operating platforms, see the system documentation for guidance.

5. Prepare the `keyring_aws` configuration file, which should contain two lines:

   * Line 1: The secret access key ID
   * Line 2: The secret access key

   For example, if the key ID is `wwwwwwwwwwwwwEXAMPLE` and the key is `xxxxxxxxxxxxx/yyyyyyy/zzzzzzzzEXAMPLEKEY`, the configuration file looks like this:

   ```sql
   wwwwwwwwwwwwwEXAMPLE
   xxxxxxxxxxxxx/yyyyyyy/zzzzzzzzEXAMPLEKEY
   ```

To be usable during the server startup process, `keyring_aws` must be loaded using the [`--early-plugin-load`](server-options.html#option_mysqld_early-plugin-load) option. The [`keyring_aws_cmk_id`](keyring-system-variables.html#sysvar_keyring_aws_cmk_id) system variable is mandatory and configures the customer master key (CMK) ID obtained from the AWS KMS server. The [`keyring_aws_conf_file`](keyring-system-variables.html#sysvar_keyring_aws_conf_file) and [`keyring_aws_data_file`](keyring-system-variables.html#sysvar_keyring_aws_data_file) system variables optionally configure the locations of the files used by the `keyring_aws` plugin for configuration information and data storage. The file location variable default values are platform specific. To configure the locations explicitly, set the variable values at startup. For example, use these lines in the server `my.cnf` file, adjusting the `.so` suffix and file locations for your platform as necessary:

```sql
[mysqld]
early-plugin-load=keyring_aws.so
keyring_aws_cmk_id='arn:aws:kms:us-west-2:111122223333:key/abcd1234-ef56-ab12-cd34-ef56abcd1234'
keyring_aws_conf_file=/usr/local/mysql/mysql-keyring/keyring_aws_conf
keyring_aws_data_file=/usr/local/mysql/mysql-keyring/keyring_aws_data
```

For the `keyring_aws` plugin to start successfully, the configuration file must exist and contain valid secret access key information, initialized as described previously. The storage file need not exist. If it does not, `keyring_aws` attempts to create it (as well as its parent directory, if necessary).

Important

The default AWS region is `us-east-1`. For any other region, you must also set [`keyring_aws_region`](keyring-system-variables.html#sysvar_keyring_aws_region) explicitly in `my.cnf`.

For additional information about the system variables used to configure the `keyring_aws` plugin, see [Section 6.4.4.12, “Keyring System Variables”](keyring-system-variables.html "6.4.4.12 Keyring System Variables").

Start the MySQL server and install the functions associated with the `keyring_aws` plugin. This is a one-time operation, performed by executing the following statements, adjusting the `.so` suffix for your platform as necessary:

```sql
CREATE FUNCTION keyring_aws_rotate_cmk RETURNS INTEGER
  SONAME 'keyring_aws.so';
CREATE FUNCTION keyring_aws_rotate_keys RETURNS INTEGER
  SONAME 'keyring_aws.so';
```

For additional information about the `keyring_aws` functions, see [Section 6.4.4.9, “Plugin-Specific Keyring Key-Management Functions”](keyring-functions-plugin-specific.html "6.4.4.9 Plugin-Specific Keyring Key-Management Functions").

##### keyring\_aws Operation

At plugin startup, the `keyring_aws` plugin reads the AWS secret access key ID and key from its configuration file. It also reads any encrypted keys contained in its storage file into its in-memory cache.

During operation, `keyring_aws` maintains encrypted keys in the in-memory cache and uses the storage file as local persistent storage. Each keyring operation is transactional: `keyring_aws` either successfully changes both the in-memory key cache and the keyring storage file, or the operation fails and the keyring state remains unchanged.

To ensure that keys are flushed only when the correct keyring storage file exists, `keyring_aws` stores a SHA-256 checksum of the keyring in the file. Before updating the file, the plugin verifies that it contains the expected checksum.

The `keyring_aws` plugin supports the functions that comprise the standard MySQL Keyring service interface. Keyring operations performed by these functions are accessible at two levels:

* SQL interface: In SQL statements, call the functions described in [Section 6.4.4.8, “General-Purpose Keyring Key-Management Functions”](keyring-functions-general-purpose.html "6.4.4.8 General-Purpose Keyring Key-Management Functions").

* C interface: In C-language code, call the keyring service functions described in [Section 5.5.6.2, “The Keyring Service”](keyring-service.html "5.5.6.2 The Keyring Service").

Example (using the SQL interface):

```sql
SELECT keyring_key_generate('MyKey', 'AES', 32);
SELECT keyring_key_remove('MyKey');
```

In addition, the [`keyring_aws_rotate_cmk()`](keyring-functions-plugin-specific.html#function_keyring-aws-rotate-cmk) and [`keyring_aws_rotate_keys()`](keyring-functions-plugin-specific.html#function_keyring-aws-rotate-keys) functions “extend” the keyring plugin interface to provide AWS-related capabilities not covered by the standard keyring service interface. These capabilities are accessible only by calling these functions using SQL. There are no corresponding C-languge key service functions.

For information about the characteristics of key values permitted by `keyring_aws`, see [Section 6.4.4.6, “Supported Keyring Key Types and Lengths”](keyring-key-types.html "6.4.4.6 Supported Keyring Key Types and Lengths").

##### keyring\_aws Credential Changes

Assuming that the `keyring_aws` plugin has initialized properly at server startup, it is possible to change the credentials used for communicating with AWS KMS:

1. Use AWS KMS to create a new secret access key ID and secret access key.

2. Store the new credentials in the configuration file (the file named by the [`keyring_aws_conf_file`](keyring-system-variables.html#sysvar_keyring_aws_conf_file) system variable). The file format is as described previously.

3. Reinitialize the `keyring_aws` plugin so that it re-reads the configuration file. Assuming that the new credentials are valid, the plugin should initialize successfully.

   There are two ways to reinitialize the plugin:

   * Restart the server. This is simpler and has no side effects, but is not suitable for installations that require minimal server downtime with as few restarts as possible.

   * Reinitialize the plugin without restarting the server by executing the following statements, adjusting the `.so` suffix for your platform as necessary:

     ```sql
     UNINSTALL PLUGIN keyring_aws;
     INSTALL PLUGIN keyring_aws SONAME 'keyring_aws.so';
     ```

     Note

     In addition to loading a plugin at runtime, [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") has the side effect of registering the plugin it in the `mysql.plugin` system table. Because of this, if you decide to stop using `keyring_aws`, it is not sufficient to remove the [`--early-plugin-load`](server-options.html#option_mysqld_early-plugin-load) option from the set of options used to start the server. That stops the plugin from loading early, but the server still attempts to load it when it gets to the point in the startup sequence where it loads the plugins registered in `mysql.plugin`.

     Consequently, if you execute the [`UNINSTALL PLUGIN`](uninstall-plugin.html "13.7.3.4 UNINSTALL PLUGIN Statement") plus [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") sequence just described to change the AWS KMS credentials, then to stop using `keyring_aws`, it is necessary to execute [`UNINSTALL PLUGIN`](uninstall-plugin.html "13.7.3.4 UNINSTALL PLUGIN Statement") again to unregister the plugin in addition to removing the [`--early-plugin-load`](server-options.html#option_mysqld_early-plugin-load) option.
