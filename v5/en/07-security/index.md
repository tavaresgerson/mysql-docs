# Chapter 6 Security

**Table of Contents**

[6.1 General Security Issues](general-security-issues.html) :   [6.1.1 Security Guidelines](security-guidelines.html)

    [6.1.2 Keeping Passwords Secure](password-security.html)

    [6.1.3 Making MySQL Secure Against Attackers](security-against-attack.html)

    [6.1.4 Security-Related mysqld Options and Variables](security-options.html)

    [6.1.5 How to Run MySQL as a Normal User](changing-mysql-user.html)

    [6.1.6 Security Considerations for LOAD DATA LOCAL](load-data-local-security.html)

    [6.1.7 Client Programming Security Guidelines](secure-client-programming.html)

[6.2 Access Control and Account Management](access-control.html) :   [6.2.1 Account User Names and Passwords](user-names.html)

    [6.2.2 Privileges Provided by MySQL](privileges-provided.html)

    [6.2.3 Grant Tables](grant-tables.html)

    [6.2.4 Specifying Account Names](account-names.html)

    [6.2.5 Access Control, Stage 1: Connection Verification](connection-access.html)

    [6.2.6 Access Control, Stage 2: Request Verification](request-access.html)

    [6.2.7 Adding Accounts, Assigning Privileges, and Dropping Accounts](creating-accounts.html)

    [6.2.8 Reserved Accounts](reserved-accounts.html)

    [6.2.9 When Privilege Changes Take Effect](privilege-changes.html)

    [6.2.10 Assigning Account Passwords](assigning-passwords.html)

    [6.2.11 Password Management](password-management.html)

    [6.2.12 Server Handling of Expired Passwords](expired-password-handling.html)

    [6.2.13 Pluggable Authentication](pluggable-authentication.html)

    [6.2.14 Proxy Users](proxy-users.html)

    [6.2.15 Account Locking](account-locking.html)

    [6.2.16 Setting Account Resource Limits](user-resources.html)

    [6.2.17 Troubleshooting Problems Connecting to MySQL](problems-connecting.html)

    [6.2.18 SQL-Based Account Activity Auditing](account-activity-auditing.html)

[6.3 Using Encrypted Connections](encrypted-connections.html) :   [6.3.1 Configuring MySQL to Use Encrypted Connections](using-encrypted-connections.html)

    [6.3.2 Encrypted Connection TLS Protocols and Ciphers](encrypted-connection-protocols-ciphers.html)

    [6.3.3 Creating SSL and RSA Certificates and Keys](creating-ssl-rsa-files.html)

    [6.3.4 SSL Library-Dependent Capabilities](ssl-libraries.html)

    [6.3.5 Connecting to MySQL Remotely from Windows with SSH](windows-and-ssh.html)

[6.4 Security Plugins](security-plugins.html) :   [6.4.1 Authentication Plugins](authentication-plugins.html)

    [6.4.2 Connection Control Plugins](connection-control-plugin.html)

    [6.4.3 The Password Validation Plugin](validate-password.html)

    [6.4.4 The MySQL Keyring](keyring.html)

    [6.4.5 MySQL Enterprise Audit](audit-log.html)

    [6.4.6 MySQL Enterprise Firewall](firewall.html)

[6.5 MySQL Enterprise Data Masking and De-Identification](data-masking.html) :   [6.5.1 MySQL Enterprise Data Masking and De-Identification Elements](data-masking-elements.html)

    [6.5.2 Installing or Uninstalling MySQL Enterprise Data Masking and De-Identification](data-masking-installation.html)

    [6.5.3 Using MySQL Enterprise Data Masking and De-Identification](data-masking-usage.html)

    [6.5.4 MySQL Enterprise Data Masking and De-Identification Function Reference](data-masking-function-reference.html)

    [6.5.5 MySQL Enterprise Data Masking and De-Identification Function Descriptions](data-masking-functions.html)

[6.6 MySQL Enterprise Encryption](enterprise-encryption.html) :   [6.6.1 MySQL Enterprise Encryption Installation](enterprise-encryption-installation.html)

    [6.6.2 MySQL Enterprise Encryption Usage and Examples](enterprise-encryption-usage.html)

    [6.6.3 MySQL Enterprise Encryption Function Reference](enterprise-encryption-function-reference.html)

    [6.6.4 MySQL Enterprise Encryption Function Descriptions](enterprise-encryption-functions.html)

[6.7 SELinux](selinux.html) :   [6.7.1 Check if SELinux is Enabled](selinux-checking.html)

    [6.7.2 Changing the SELinux Mode](selinux-mode.html)

    [6.7.3 MySQL Server SELinux Policies](selinux-policies.html)

    [6.7.4 SELinux File Context](selinux-file-context.html)

    [6.7.5 SELinux TCP Port Context](selinux-context-tcp-port.html)

    [6.7.6 Troubleshooting SELinux](selinux-troubleshooting.html)

When thinking about security within a MySQL installation, you should consider a wide range of possible topics and how they affect the security of your MySQL server and related applications:

* General factors that affect security. These include choosing good passwords, not granting unnecessary privileges to users, ensuring application security by preventing SQL injections and data corruption, and others. See [Section 6.1, “General Security Issues”](general-security-issues.html "6.1 General Security Issues").

* Security of the installation itself. The data files, log files, and the all the application files of your installation should be protected to ensure that they are not readable or writable by unauthorized parties. For more information, see [Section 2.9, “Postinstallation Setup and Testing”](postinstallation.html "2.9 Postinstallation Setup and Testing").

* Access control and security within the database system itself, including the users and databases granted with access to the databases, views and stored programs in use within the database. For more information, see [Section 6.2, “Access Control and Account Management”](access-control.html "6.2 Access Control and Account Management").

* The features offered by security-related plugins. See [Section 6.4, “Security Plugins”](security-plugins.html "6.4 Security Plugins").

* Network security of MySQL and your system. The security is related to the grants for individual users, but you may also wish to restrict MySQL so that it is available only locally on the MySQL server host, or to a limited set of other hosts.

* Ensure that you have adequate and appropriate backups of your database files, configuration and log files. Also be sure that you have a recovery solution in place and test that you are able to successfully recover the information from your backups. See [Chapter 7, *Backup and Recovery*](backup-and-recovery.html "Chapter 7 Backup and Recovery").

Note

Several topics in this chapter are also addressed in the [Secure Deployment Guide](/doc/mysql-secure-deployment-guide/5.7/en/), which provides procedures for deploying a generic binary distribution of MySQL Enterprise Edition Server with features for managing the security of your MySQL installation.
