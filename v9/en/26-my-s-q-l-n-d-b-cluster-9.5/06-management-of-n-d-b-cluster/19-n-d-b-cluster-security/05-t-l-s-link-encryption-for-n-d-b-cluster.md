#### 25.6.19.5 TLS Link Encryption for NDB Cluster

This section discusses the implementation and use of Transport Layer Security (TLS) to secure network communications in MySQL NDB Cluster. Topics covered include keys and certificates, key and certificate life cycles, authentication of certificates, and how these are reflected in the configuration of the cluster, as well as NDB Cluster support for the Internet Public Key Infrastructure (PKI) used to authenticate and encrypt connections between NDB nodes, and between the NDB management server and its clients.

Note

TLS for NDB Cluster on Linux requires compiled-in support for OpenSSL 1.1 or later. For this reason, it is not available for Enterprise Linux 7, which is built with OpenSSL 1.0.

##### 25.6.19.5.1 Overview of TLS for NDB Cluster

TLS can be used to secure network communications in NDB Cluster 8.3 and later. NDB Transporter connections secured by TLS use TLS mutual authentication, in which each node validates the certificate of its peer. A node certificate can also be bound to a particular hostname; in this case, a peer authorizes the certificate only if the hostname can be verified.

A node's own certificate file contains the entire chain of trust it uses to validate the certificates of its peers. This usually includes only its own certificate and that of the issuing CA, but may include additional CAs. Because an NDB cluster is considered a realm of trust, the CA should be limited in scope to a single cluster.

In order to obtain signed node certificates, it is necessary first to create a Certification Authority (CA). When TLS is deployed, every node has an authentic certificate, which is signed by the CA. Only the administrator (DBA) should have access to the private CA signing key with which valid node certificates are created.

Hostname bindings are created for management and API node certificates by default. Since NDB Cluster data nodes are already subject to hostname checks as part of node ID allocation, the default behavior is to not add an additional hostname check for TLS.

A certificate is no longer valid upon arrival of the expiration date. To minimize the impact of certificate expiration on system availability, a cluster should have several certificates with staggered expiration dates; client certificates should expire earliest, followed by data node certificates, and then by management server certificates. To facilitate staggered expiration, each certificate is associated with a node type; a given node uses keys and certificates of the appropriate type only.

Private keys are created in place; copying of files containing private keys is minimized. Both private keys and certificates are labeled as either active (current) or pending. It is possible to rotate keys to allow for pending keys to replace active keys before the active keys expire.

Due to the potentially large numbers of files involved, NDB follows several naming conventions for files storing keys, signing requests, and certificates. These names are not user configurable, although the directories where these files are stored can be determined by the user.

By default, NDB Cluster CA private keys are protected by a passphrase which must be provided when creating a signed node certificate. Node private keys are stored unencrypted, so that they can be opened automatically at node startup time. Private key files are read-only (Unix file mode 0400).

##### 25.6.19.5.2 Creating a CA and Keys

Create a CA in the CA directory:

```
$> ndb_sign_keys --create-CA --to-dir=CA
Mode of operation: create CA.
This utility will create a cluster CA private key and a public key certificate.

You will be prompted to supply a pass phrase to protect the
cluster private key. This security of the cluster depends on this.

Only the database administrator responsible for this cluster should
have the pass phrase. Knowing the pass phrase would allow an attacker
to gain full access to the database.

The passphrase must be at least 4 characters in length.

Creating CA key file NDB-Cluster-private-key in directory CA.
Enter PEM pass phrase: Verifying - Enter PEM pass phrase:
Creating CA certificate NDB-Cluster-cert in directory CA.
$> ls -l CA
total 8
-rw-r--r-- 1 mysql mysql 1082 Dec 19 07:32 NDB-Cluster-cert
-r-------- 1 mysql mysql 1854 Dec 19 07:32 NDB-Cluster-private-key
```

Next, create keys for all nodes on this host using the `--create-key` option, like this:

```
$> ndb_sign_keys --ndb-tls-search-path='CA' --create-key -c localhost:1186 --to-dir=keys
Mode of operation: create active keys and certificates.
Enter PEM pass phrase:
Creating active private key in directory keys.
Creating active certificate in directory keys.
Creating active private key in directory keys.
Creating active certificate in directory keys.
Creating active private key in directory keys.
Creating active certificate in directory keys.
Read 5 nodes from custer configuration.
Found 5 nodes configured to run on this host.
Created 3 keys and 3 certificates.
$>
```

`--create-key` causes **ndb_sign_keys** to connect to the management server, read the cluster configuration, and then create a full set of keys and certificates for all NDB nodes configured to run on the local host. The cluster management server must be running for this to work. If the management server is not running, ndb_sign_keys can read the cluster configuration file directly using the `--config-file` option. **ndb_sign_keys** can also create a single key-certificate pair for a single node type using `--no-config` to ignore the cluster configuration and `--node-type` to specify the node type (one of `mgmd`, `db`, or `api`). In addition, you must either specify a hostname for the certificate with `--bound-hostname=host_name`, or disable hostname binding by supplying `--bind-host=0`.

Key signing by a remote host is accomplished by connecting to the CA host using **ssh**.

##### 25.6.19.5.3 Using TLS Connections

Once you have created a CA and certificate, you can test the availability of the TLS connection to the management server by running the **ndb_mgm** client with `--test-tls`, like this:

```
$> ndb_mgm --test-tls
No valid certificate.
```

An appropriate message is generated if the client can connect using TLS. You may need to include other **ndb_mgm** options such as `--ndb-tls-search-path` to facilitate the TLS connection, as shown here:

```
$> ndb_mgm --test-tls --ndb-tls-search-path="CA:keys"
Connected to management server at localhost port 1186 (using TLS)
```

If the client connects without using TLS, this is also indicated, similarly to what is shown here:

```
$> ndb_mgm
Connected to management server at localhost port 1186 (using cleartext)
$>
```

You can cause the cluster to use the CA and certificates created with **ndb_sign_keys** by performing a rolling restart of the cluster, beginning with the management nodes, which should be restarted using the `--ndb-tls-search-path` option. After this, restart the data nodes, again using `--ndb-tls-search-path`. `--ndb-tls-search-path` is also supported for **mysqld** run as a cluster API node.

For TLS to function, every node connecting to the cluster must have a valid certificate and key. This includes data nodes, API nodes, and utility programs. The same certificate and key files can be used by more than one node.

Data nodes log the TLS connection and include the full path to the certificate file used, as shown here:

```
$> ndbmtd -c localhost:1186 --ndb-tls-search-path='CA:keys'
2023-12-19 12:02:15 [ndbd] INFO     -- NDB TLS 1.3 available using certificate file 'keys/ndb-data-node-cert'
2023-12-19 12:02:15 [ndbd] INFO     -- Angel connected to 'localhost:1186'
2023-12-19 12:02:15 [ndbd] INFO     -- Angel allocated nodeid: 5
```

You can verify that cluster nodes are using TLS to connect by checking the output of the `TLS INFO` command in the **ndb_mgm** client, like this:

```
$> ndb_mgm --ndb-tls-search-path="CA:keys"
-- NDB Cluster -- Management Client --
ndb_mgm> TLS INFO
Connected to management server at localhost port 1186 (using TLS)

Main interactive connection is using TLS
Event listener connection is using TLS

Server reports 6 TLS connections.

  Session ID:          32
  Peer address:        ::
  Certificate name:    NDB Node Dec 2023
  Certificate serial:  39:1E:4A:78:E5:93:45:09:FC:56
  Certificate expires: 21-Apr-2024

  Session ID:          31
  Peer address:        127.0.0.1
  Certificate name:    NDB Node Dec 2023
  Certificate serial:  39:1E:4A:78:E5:93:45:09:FC:56
  Certificate expires: 21-Apr-2024

  Session ID:          30
  Peer address:        127.0.0.1
  Certificate name:    NDB Node Dec 2023
  Certificate serial:  39:1E:4A:78:E5:93:45:09:FC:56
  Certificate expires: 21-Apr-2024

  Session ID:          18
  Peer address:        127.0.0.1
  Certificate name:    NDB Data Node Dec 2023
  Certificate serial:  57:5E:58:70:7C:49:B3:74:1A:99
  Certificate expires: 07-May-2024

  Session ID:          12
  Peer address:        127.0.0.1
  Certificate name:    NDB Data Node Dec 2023
  Certificate serial:  57:5E:58:70:7C:49:B3:74:1A:99
  Certificate expires: 07-May-2024

  Session ID:          1
  Peer address:        127.0.0.1
  Certificate name:    NDB Management Node Dec 2023
  Certificate serial:  32:10:44:3C:F4:7D:73:40:97:41
  Certificate expires: 17-May-2024


    Server statistics since restart
  Total accepted connections:        32
  Total connections upgraded to TLS: 8
  Current connections:               6
  Current connections using TLS:     6
  Authorization failures:            0
ndb_mgm>
```

If `Current connections` and `Current connections using TLS` are the same, this means that all cluster connections are using TLS.

Once you have established TLS connections for all nodes, you should make TLS a strict requirement. For clients, you can do this by setting `ndb-mgm-tls=strict` in the `my.cnf` file on each cluster host. Enforce the TLS requirement on the management server by setting `RequireTls=true` in the `[mgm default]` section of the cluster `config.ini` file, then performing a rolling restart of the cluster so that this change takes effect. Do this for the data nodes as well, by setting `RequireTls=true` in the `[ndbd default]` section of the configuration file; after this, perform a second rolling restart of the cluster to make the changes take effect on the data nodes. Start **ndb_mgmd** with the `--reload` and `--config-file` options both times to ensure that each of the two configuration file changes is read by the management server.

To replace a private key, use **ndb_sign_keys** `--create-key` to create the new key and certificate, with the `--node-id` and `--node-type options` if and as necessary to limit the replacement to a single node ID, node type, or both. If the tool finds existing key and certificate files, it renames them to reflect their retired status, and saves the newly created key and certificate as active files; the new files are used the next time that the node is restarted.

To replace a certificate without replacing the private key, use **ndb_sign_keys** without supplying the `--create-key` option. This creates a new certificate for the existing key (without replacing the key), and retires the old certificate.

Remote key siging is is also supported by ndb_sign_keys. Using SSH, the `--remote-CA-host` option supplies the SSH address of the CA host in `user@host` format. By default, the local **ndb_sign_keys** process uses the system **ssh** utility and address to run **ndb_sign_keys** on the remote host with the correct options to perform the desired signing. Alternately, if `--remote-openssl=true`, **openssl** rather than **ndb_sign_keys** is used on the remote host.

When using remote signing, the data sent over the network is a PKCS#10 signing request, and not the private key, which never leaves the local host.
