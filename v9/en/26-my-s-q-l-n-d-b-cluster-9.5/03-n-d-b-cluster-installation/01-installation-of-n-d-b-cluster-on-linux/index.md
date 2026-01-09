### 25.3.1 Installation of NDB Cluster on Linux

25.3.1.1 Installing an NDB Cluster Binary Release on Linux

25.3.1.2 Installing NDB Cluster from RPM

25.3.1.3 Installing NDB Cluster Using .deb Files

25.3.1.4 Building NDB Cluster from Source on Linux

This section covers installation methods for NDB Cluster on Linux and other Unix-like operating systems. While the next few sections refer to a Linux operating system, the instructions and procedures given there should be easily adaptable to other supported Unix-like platforms. For manual installation and setup instructions specific to Windows systems, see Section 25.3.2, “Installing NDB Cluster on Windows”.

Each NDB Cluster host computer must have the correct executable programs installed. A host running an SQL node must have installed on it a MySQL Server binary (**mysqld**). Management nodes require the management server daemon (**ndb_mgmd**); data nodes require the data node daemon (**ndbd** or **ndbmtd**")). It is not necessary to install the MySQL Server binary on management node hosts and data node hosts. It is recommended that you also install the management client (**ndb_mgm**) on the management server host.

Installation of NDB Cluster on Linux can be done using precompiled binaries from Oracle (downloaded as a .tar.gz archive), with RPM packages (also available from Oracle), or from source code. All three of these installation methods are described in the section that follow.

Regardless of the method used, it is still necessary following installation of the NDB Cluster binaries to create configuration files for all cluster nodes, before you can start the cluster. See Section 25.3.3, “Initial Configuration of NDB Cluster”.
