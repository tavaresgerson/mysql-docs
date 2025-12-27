## 34.2 Deploying MySQL EE on Oracle Cloud Infrastructure

To deploy MySQL EE on Oracle Cloud Infrastructure, do the following:

1. Open the OCI Marketplace and search for MySQL.

   The MySQL listings are displayed.

2. Select MySQL Enterprise Edition.

   The MySQL Enterprise Edition overview is displaed.

3. Click Launch Instance to begin the application launch process.

   The Create Compute Instance dialog is displayed.

   See [To create a Linux instance](https://docs.cloud.oracle.com/iaas/Content/Compute/Tasks/launchinginstance.htm) for information on how to complete the fields.

By default, the MySQL server listens on port 3306 and is configured with a single user, root.

Important

When the deployment is complete, and the MySQL server is started, you must connect to the compute instance and retrieve the default root password which was written to the MySQL log file.

See Connecting with SSH for more information.

The following MySQL software is installed:

* MySQL Server EE
* MySQL Enterprise Backup
* MySQL Shell
* MySQL Router

### MySQL Configuration

For security, the following are enabled:

* SELinux: for more information, see [Configuring and Using SELinux](https://docs.oracle.com/en/operating-systems/oracle-linux/7/admin/ol7-s1-syssec.html)

* `firewalld`: for more information, see [Controlling the firewalld Firewall Service](https://docs.oracle.com/en/operating-systems/oracle-linux/7/security/ol7-implement-sec.html#ol7-firewalld-cfg)

The following MySQL plugins are enabled:

* `thread_pool`
* `validate_password`

On startup, the following occurs:

* MySQL Server reads `/etc/my.cnf` and all files named `*.cnf` in `/etc/my.cnf.d/`.

* `/etc/my.cnf.d/perf-tuning.cnf` is created by `/usr/bin/mkcnf` based on the selected OCI shape.

  Note

  To disable this mechanism, remove `/etc/systemd/system/mysqld.service.d/perf-tuning.conf`.

  Performance tuning is configured for the following shapes:

  + VM.Standard2.1
  + VM.Standard2.2
  + VM.Standard2.4
  + VM.Standard2.8
  + VM.Standard2.16
  + VM.Standard2.24
  + VM.Standard.E2.1
  + VM.Standard.E2.2
  + VM.Standard.E2.4
  + VM.Standard.E2.8
  + VM.Standard.E3.Flex
  + VM.Standard.E4.Flex
  + BM.Standard2.52

  Important

  For all other shapes, the tuning for VM.Standard2.1 is used.
