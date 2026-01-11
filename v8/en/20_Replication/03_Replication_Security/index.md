## 19.3 Replication Security

19.3.1 Setting Up Replication to Use Encrypted Connections

19.3.2 Encrypting Binary Log Files and Relay Log Files

19.3.3 Replication Privilege Checks

To protect against unauthorized access to data that is stored on and transferred between replication source servers and replicas, set up all the servers involved using the security measures that you would choose for any MySQL instance in your installation, as described in Chapter 8, *Security*. In addition, for servers in a replication topology, consider implementing the following security measures:

* Set up sources and replicas to use encrypted connections to transfer the binary log, which protects this data in motion. Encryption for these connections must be activated using a `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` statement, in addition to setting up the servers to support encrypted network connections. See Section 19.3.1, “Setting Up Replication to Use Encrypted Connections”.

* Encrypt the binary log files and relay log files on sources and replicas, which protects this data at rest, and also any data in use in the binary log cache. Binary log encryption is activated using the `binlog_encryption` system variable. See Section 19.3.2, “Encrypting Binary Log Files and Relay Log Files”.

* Apply privilege checks to replication appliers, which help to secure replication channels against the unauthorized or accidental use of privileged or unwanted operations. Privilege checks are implemented by setting up a `PRIVILEGE_CHECKS_USER` account, which MySQL uses to verify that you have authorized each specific transaction for that channel. See Section 19.3.3, “Replication Privilege Checks”.

For Group Replication, binary log encryption and privilege checks can be used as a security measure on replication group members. You should also consider encrypting the connections between group members, comprising group communication connections and distributed recovery connections, and applying IP address allowlisting to exclude untrusted hosts. For information on these security measures specific to Group Replication, see Section 20.6, “Group Replication Security”.
