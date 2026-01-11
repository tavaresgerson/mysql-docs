## 8.4 Security Components and Plugins

8.4.1 Authentication Plugins

8.4.2 The Connection Control Component

8.4.3 Connection Control Plugins

8.4.4 The Password Validation Component

8.4.5 The MySQL Keyring

8.4.6 MySQL Enterprise Audit

8.4.7 The Audit Message Component

8.4.8 MySQL Enterprise Firewall

MySQL includes several components and plugins that implement security features:

* Plugins for authenticating attempts by clients to connect to MySQL Server. Plugins are available for several authentication protocols. For general discussion of the authentication process, see Section 8.2.17, “Pluggable Authentication”. For characteristics of specific authentication plugins, see Section 8.4.1, “Authentication Plugins”.

* A password-validation component for implementing password strength policies and assessing the strength of potential passwords. See Section 8.4.4, “The Password Validation Component”.

* Keyring components and plugins that provide secure storage for sensitive information. See Section 8.4.5, “The MySQL Keyring”.

* (MySQL Enterprise Edition only) MySQL Enterprise Audit, implemented using a server plugin, uses the open MySQL Audit API to enable standard, policy-based monitoring and logging of connection and query activity executed on specific MySQL servers. Designed to meet the Oracle audit specification, MySQL Enterprise Audit provides an out of box, easy to use auditing and compliance solution for applications that are governed by both internal and external regulatory guidelines. See Section 8.4.6, “MySQL Enterprise Audit”.

* A function enables applications to add their own message events to the audit log. See Section 8.4.7, “The Audit Message Component”.

* (MySQL Enterprise Edition only) MySQL Enterprise Firewall, an application-level firewall that enables database administrators to permit or deny SQL statement execution based on matching against lists of accepted statement patterns. This helps harden MySQL Server against attacks such as SQL injection or attempts to exploit applications by using them outside of their legitimate query workload characteristics. See Section 8.4.8, “MySQL Enterprise Firewall”.

* (MySQL Enterprise Edition only) MySQL Enterprise Data Masking, implemented as a plugin library containing a plugin and a set of functions. Data masking hides sensitive information by replacing real values with substitutes. MySQL Enterprise Data Masking functions enable masking existing data using several methods such as obfuscation (removing identifying characteristics), generation of formatted random data, and data replacement or substitution. See Section 8.5, “MySQL Enterprise Data Masking”.
