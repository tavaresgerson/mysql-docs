## 2.5 Installing MySQL on Linux

2.5.1 Installing MySQL on Linux Using the MySQL Yum Repository

2.5.2 Installing MySQL on Linux Using the MySQL APT Repository

2.5.3 Using the MySQL SLES Repository

2.5.4 Installing MySQL on Linux Using RPM Packages from Oracle

2.5.5 Installing MySQL on Linux Using Debian Packages from Oracle

2.5.6 Deploying MySQL on Linux with Docker Containers

2.5.7 Installing MySQL on Linux from the Native Software Repositories

2.5.8 Installing MySQL on Linux with Juju

2.5.9 Managing MySQL Server with systemd

Linux supports a number of different solutions for installing MySQL. We recommend that you use one of the distributions from Oracle, for which several methods for installation are available:

**Table 2.9 Linux Installation Methods and Information**

<table><col style="width: 30%"/><col style="width: 30%"/><col style="width: 40%"/><thead><tr> <th>Type</th> <th>Setup Method</th> <th>Additional Information</th> </tr></thead><tbody><tr> <th>Apt</th> <td>Enable the MySQL Apt repository</td> <td>Documentation</td> </tr><tr> <th>Yum</th> <td>Enable the MySQL Yum repository</td> <td>Documentation</td> </tr><tr> <th>Zypper</th> <td>Enable the MySQL SLES repository</td> <td>Documentation</td> </tr><tr> <th>RPM</th> <td>Download a specific package</td> <td>Documentation</td> </tr><tr> <th>DEB</th> <td>Download a specific package</td> <td>Documentation</td> </tr><tr> <th>Generic</th> <td>Download a generic package</td> <td>Documentation</td> </tr><tr> <th>Source</th> <td>Compile from source</td> <td>Documentation</td> </tr><tr> <th>Docker</th> <td>Use the Oracle Container Registry. You can also use My Oracle Support for the MySQL Enterprise Edition.</td> <td>Documentation</td> </tr><tr> <th>Oracle Unbreakable Linux Network</th> <td>Use ULN channels</td> <td>Documentation</td> </tr></tbody></table>

As an alternative, you can use the package manager on your system to automatically download and install MySQL with packages from the native software repositories of your Linux distribution. These native packages are often several versions behind the currently available release. You are also normally unable to install innovation releases, since these are not usually made available in the native repositories. For more information on using the native package installers, see Section 2.5.7, “Installing MySQL on Linux from the Native Software Repositories”.

Note

For many Linux installations, you want to set up MySQL to be started automatically when your machine starts. Many of the native package installations perform this operation for you, but for source, binary and RPM solutions you may need to set this up separately. The required script, **mysql.server**, can be found in the `support-files` directory under the MySQL installation directory or in a MySQL source tree. You can install it as `/etc/init.d/mysql` for automatic MySQL startup and shutdown. See Section 6.3.3, “mysql.server — MySQL Server Startup Script”.
