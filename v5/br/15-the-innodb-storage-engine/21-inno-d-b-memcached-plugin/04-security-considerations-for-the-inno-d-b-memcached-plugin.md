### 14.21.4 Security Considerations for the InnoDB memcached Plugin

Caution

Consult this section before deploying the `daemon_memcached` plugin on a production server, or even on a test server if the MySQL instance contains sensitive data.

Because **memcached** does not use an authentication mechanism by default, and the optional SASL authentication is not as strong as traditional DBMS security measures, only keep non-sensitive data in the MySQL instance that uses the `daemon_memcached` plugin, and wall off any servers that use this configuration from potential intruders. Do not allow **memcached** access to these servers from the Internet; only allow access from within a firewalled intranet, ideally from a subnet whose membership you can restrict.

#### Password-Protecting memcached Using SASL

SASL support provides the capability to protect your MySQL database from unauthenticated access through **memcached** clients. This section explains how to enable SASL with the `daemon_memcached` plugin. The steps are almost identical to those performed to enabled SASL for a traditional **memcached** server.

SASL stands for “Simple Authentication and Security Layer”, a standard for adding authentication support to connection-based protocols. **memcached** added SASL support in version 1.4.3.

SASL authentication is only supported with the binary protocol.

**memcached** clients are only able to access `InnoDB` tables that are registered in the `innodb_memcache.containers` table. Even though a DBA can place access restrictions on such tables, access through **memcached** applications cannot be controlled. For this reason, SASL support is provided to control access to `InnoDB` tables associated with the `daemon_memcached` plugin.

The following section shows how to build, enable, and test an SASL-enabled `daemon_memcached` plugin.

#### Building and Enabling SASL with the InnoDB memcached Plugin

By default, an SASL-enabled `daemon_memcached` plugin is not included in MySQL release packages, since an SASL-enabled `daemon_memcached` plugin requires building **memcached** with SASL libraries. To enable SASL support, download the MySQL source and rebuild the `daemon_memcached` plugin after downloading the SASL libraries:

1. Install the SASL development and utility libraries. For example, on Ubuntu, use **apt-get** to obtain the libraries:

   ```sql
   sudo apt-get -f install libsasl2-2 sasl2-bin libsasl2-2 libsasl2-dev libsasl2-modules
   ```

2. Build the `daemon_memcached` plugin shared libraries with SASL capability by adding `ENABLE_MEMCACHED_SASL=1` to your **cmake** options. **memcached** also provides *simple cleartext password support*, which facilitates testing. To enable simple cleartext password support, specify the `ENABLE_MEMCACHED_SASL_PWDB=1` **cmake** option.

   In summary, add following three **cmake** options:

   ```sql
   cmake ... -DWITH_INNODB_MEMCACHED=1 -DENABLE_MEMCACHED_SASL=1 -DENABLE_MEMCACHED_SASL_PWDB=1
   ```

3. Install the `daemon_memcached` plugin, as described in Section 14.21.3, “Setting Up the InnoDB memcached Plugin”.

4. Configure a user name and password file. (This example uses **memcached** simple cleartext password support.)

   1. In a file, create a user named `testname` and define the password as `testpasswd`:

      ```sql
      echo "testname:testpasswd:::::::" >/home/jy/memcached-sasl-db
      ```

   2. Configure the `MEMCACHED_SASL_PWDB` environment variable to inform `memcached` of the user name and password file:

      ```sql
      export MEMCACHED_SASL_PWDB=/home/jy/memcached-sasl-db
      ```

   3. Inform `memcached` that a cleartext password is used:

      ```sql
      echo "mech_list: plain" > /home/jy/work2/msasl/clients/memcached.conf
      export SASL_CONF_PATH=/home/jy/work2/msasl/clients
      ```

5. Enable SASL by restarting the MySQL server with the **memcached** `-S` option encoded in the `daemon_memcached_option` configuration parameter:

   ```sql
   mysqld ... --daemon_memcached_option="-S"
   ```

6. To test the setup, use an SASL-enabled client such as [SASL-enabled libmemcached](https://code.launchpad.net/~trond-norbye/libmemcached/sasl).

   ```sql
   memcp --servers=localhost:11211 --binary  --username=testname
     --password=password myfile.txt

   memcat --servers=localhost:11211 --binary --username=testname
     --password=password myfile.txt
   ```

   If you specify an incorrect user name or password, the operation is rejected with a `memcache error AUTHENTICATION FAILURE` message. In this case, examine the cleartext password set in the `memcached-sasl-db` file to verify that the credentials you supplied are correct.

There are other methods to test SASL authentication with **memcached**, but the method described above is the most straightforward.
