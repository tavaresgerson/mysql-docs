#### 21.3.1.3 Installing NDB Cluster Using .deb Files

The section provides information about installing NDB Cluster on Debian and related Linux distributions such Ubuntu using the `.deb` files supplied by Oracle for this purpose.

For NDB Cluster 7.5.6 and later, Oracle also provides an APT repository for Debian and other distributions. See [*Installing MySQL NDB Cluster Using the APT Repository*](/doc/mysql-apt-repo-quick-guide/en/#repo-qg-apt-cluster-install), for instructions and additional information.

Oracle provides `.deb` installer files for NDB Cluster 7.5 and later for 32-bit and 64-bit platforms. For a Debian-based system, only a single installer file is necessary. This file is named using the pattern shown here, according to the applicable NDB Cluster version, Debian version, and architecture:

```sql
mysql-cluster-gpl-ndbver-debiandebianver-arch.deb
```

Here, *`ndbver`* is the 3-part `NDB` engine version number, *`debianver`* is the major version of Debian (`8` or `9`), and *`arch`* is one of `i686` or `x86_64`. In the examples that follow, we assume you wish to install NDB 7.6.35 on a 64-bit Debian 9 system; in this case, the installer file is named `mysql-cluster-gpl-7.6.35-debian9-x86_64.deb-bundle.tar`.

Once you have downloaded the appropriate `.deb` file, you can untar it, and then install it from the command line using `dpkg`, like this:

```sql
$> dpkg -i mysql-cluster-gpl-7.6.35-debian9-i686.deb
```

You can also remove it using `dpkg` as shown here:

```sql
$> dpkg -r mysql
```

The installer file should also be compatible with most graphical package managers that work with `.deb` files, such as `GDebi` for the Gnome desktop.

The `.deb` file installs NDB Cluster under `/opt/mysql/server-version/`, where *`version`* is the 2-part release series version for the included MySQL server. For NDB 7.5 and later, this is always `5.7`. The directory layout is the same as that for the generic Linux binary distribution (see [Table 2.3, “MySQL Installation Layout for Generic Unix/Linux Binary Package”](binary-installation.html#binary-installation-layout "Table 2.3 MySQL Installation Layout for Generic Unix/Linux Binary Package")), with the exception that startup scripts and configuration files are found in `support-files` instead of `share`. All NDB Cluster executables, such as [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client"), [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon"), and [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon"), are placed in the `bin` directory.
