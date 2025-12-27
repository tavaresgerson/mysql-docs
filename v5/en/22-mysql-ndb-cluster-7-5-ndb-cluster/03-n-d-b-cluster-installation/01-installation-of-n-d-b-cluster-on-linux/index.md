### 21.3.1 Installation of NDB Cluster on Linux

[21.3.1.1 Installing an NDB Cluster Binary Release on Linux](mysql-cluster-install-linux-binary.html)

[21.3.1.2 Installing NDB Cluster from RPM](mysql-cluster-install-linux-rpm.html)

[21.3.1.3 Installing NDB Cluster Using .deb Files](mysql-cluster-install-debian.html)

[21.3.1.4 Building NDB Cluster from Source on Linux](mysql-cluster-install-linux-source.html)

This section covers installation methods for NDB Cluster on Linux and other Unix-like operating systems. While the next few sections refer to a Linux operating system, the instructions and procedures given there should be easily adaptable to other supported Unix-like platforms. For manual installation and setup instructions specific to Windows systems, see [Section 21.3.2, “Installing NDB Cluster on Windows”](mysql-cluster-install-windows.html "21.3.2 Installing NDB Cluster on Windows").

Each NDB Cluster host computer must have the correct executable programs installed. A host running an SQL node must have installed on it a MySQL Server binary ([**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server")). Management nodes require the management server daemon ([**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon")); data nodes require the data node daemon ([**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon") or [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)")). It is not necessary to install the MySQL Server binary on management node hosts and data node hosts. It is recommended that you also install the management client ([**ndb\_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client")) on the management server host.

Installation of NDB Cluster on Linux can be done using precompiled binaries from Oracle (downloaded as a .tar.gz archive), with RPM packages (also available from Oracle), or from source code. All three of these installation methods are described in the section that follow.

Regardless of the method used, it is still necessary following installation of the NDB Cluster binaries to create configuration files for all cluster nodes, before you can start the cluster. See [Section 21.3.3, “Initial Configuration of NDB Cluster”](mysql-cluster-install-configuration.html "21.3.3 Initial Configuration of NDB Cluster").
