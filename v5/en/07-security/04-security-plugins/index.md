## 6.4 Security Plugins

[6.4.1 Authentication Plugins](authentication-plugins.html)

[6.4.2 Connection Control Plugins](connection-control-plugin.html)

[6.4.3 The Password Validation Plugin](validate-password.html)

[6.4.4 The MySQL Keyring](keyring.html)

[6.4.5 MySQL Enterprise Audit](audit-log.html)

[6.4.6 MySQL Enterprise Firewall](firewall.html)

MySQL includes several plugins that implement security features:

* Plugins for authenticating attempts by clients to connect to MySQL Server. Plugins are available for several authentication protocols. For general discussion of the authentication process, see [Section 6.2.13, “Pluggable Authentication”](pluggable-authentication.html "6.2.13 Pluggable Authentication"). For characteristics of specific authentication plugins, see [Section 6.4.1, “Authentication Plugins”](authentication-plugins.html "6.4.1 Authentication Plugins").

* A password-validation plugin for implementing password strength policies and assessing the strength of potential passwords. See [Section 6.4.3, “The Password Validation Plugin”](validate-password.html "6.4.3 The Password Validation Plugin").

* Keyring plugins that provide secure storage for sensitive information. See [Section 6.4.4, “The MySQL Keyring”](keyring.html "6.4.4 The MySQL Keyring").

* (MySQL Enterprise Edition only) MySQL Enterprise Audit, implemented using a server plugin, uses the open MySQL Audit API to enable standard, policy-based monitoring and logging of connection and query activity executed on specific MySQL servers. Designed to meet the Oracle audit specification, MySQL Enterprise Audit provides an out of box, easy to use auditing and compliance solution for applications that are governed by both internal and external regulatory guidelines. See [Section 6.4.5, “MySQL Enterprise Audit”](audit-log.html "6.4.5 MySQL Enterprise Audit").

* (MySQL Enterprise Edition only) MySQL Enterprise Firewall, an application-level firewall that enables database administrators to permit or deny SQL statement execution based on matching against lists of accepted statement patterns. This helps harden MySQL Server against attacks such as SQL injection or attempts to exploit applications by using them outside of their legitimate query workload characteristics. See [Section 6.4.6, “MySQL Enterprise Firewall”](firewall.html "6.4.6 MySQL Enterprise Firewall").

* (MySQL Enterprise Edition only) MySQL Enterprise Data Masking and De-Identification, implemented as a plugin library containing a plugin and a set of functions. Data masking hides sensitive information by replacing real values with substitutes. MySQL Enterprise Data Masking and De-Identification functions enable masking existing data using several methods such as obfuscation (removing identifying characteristics), generation of formatted random data, and data replacement or substitution. See [Section 6.5, “MySQL Enterprise Data Masking and De-Identification”](data-masking.html "6.5 MySQL Enterprise Data Masking and De-Identification").
