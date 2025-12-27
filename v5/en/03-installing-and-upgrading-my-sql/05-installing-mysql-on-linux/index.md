## 2.5 Installing MySQL on Linux

2.5.1 Installing MySQL on Linux Using the MySQL Yum Repository

2.5.2 Replacing a Third-Party Distribution of MySQL Using the MySQL Yum Repository

2.5.3 Installing MySQL on Linux Using the MySQL APT Repository

2.5.4 Installing MySQL on Linux Using the MySQL SLES Repository

2.5.5 Installing MySQL on Linux Using RPM Packages from Oracle

2.5.6 Installing MySQL on Linux Using Debian Packages from Oracle

2.5.7 Deploying MySQL on Linux with Docker

2.5.8 Installing MySQL on Linux from the Native Software Repositories

2.5.9 Installing MySQL on Linux with Juju

2.5.10 Managing MySQL Server with systemd

Linux supports a number of different solutions for installing MySQL. We recommend that you use one of the distributions from Oracle, for which several methods for installation are available:

**Table 2.8 Linux Installation Methods and Information**

<table><col style="width: 30%"/><col style="width: 30%"/><col style="width: 40%"/><thead><tr> <th scope="col">Type</th> <th scope="col">Setup Method</th> <th scope="col">Additional Information</th> </tr></thead><tbody><tr> <th scope="row">Apt</th> <td>Enable the <a class="ulink" href="https://dev.mysql.com/downloads/repo/apt/" target="_top">MySQL Apt repository</a></td> <td><a class="link" href="linux-installation-apt-repo.html" title="2.5.3 Installing MySQL on Linux Using the MySQL APT Repository">Documentation</a></td> </tr><tr> <th scope="row">Yum</th> <td>Enable the <a class="ulink" href="https://dev.mysql.com/downloads/repo/yum/" target="_top">MySQL Yum repository</a></td> <td><a class="link" href="linux-installation-yum-repo.html" title="2.5.1 Installing MySQL on Linux Using the MySQL Yum Repository">Documentation</a></td> </tr><tr> <th scope="row">Zypper</th> <td>Enable the <a class="ulink" href="https://dev.mysql.com/downloads/repo/suse/" target="_top">MySQL SLES repository</a></td> <td><a class="link" href="linux-installation-sles-repo.html" title="2.5.4 Installing MySQL on Linux Using the MySQL SLES Repository">Documentation</a></td> </tr><tr> <th scope="row">RPM</th> <td><a class="ulink" href="https://dev.mysql.com/downloads/mysql/" target="_top">Download</a> a specific package</td> <td><a class="link" href="linux-installation-rpm.html" title="2.5.5 Installing MySQL on Linux Using RPM Packages from Oracle">Documentation</a></td> </tr><tr> <th scope="row">DEB</th> <td><a class="ulink" href="https://dev.mysql.com/downloads/mysql/" target="_top">Download</a> a specific package</td> <td><a class="link" href="linux-installation-debian.html" title="2.5.6 Installing MySQL on Linux Using Debian Packages from Oracle">Documentation</a></td> </tr><tr> <th scope="row">Generic</th> <td><a class="ulink" href="https://dev.mysql.com/downloads/mysql/" target="_top">Download</a> a generic package</td> <td><a class="link" href="binary-installation.html" title="2.2 Installing MySQL on Unix/Linux Using Generic Binaries">Documentation</a></td> </tr><tr> <th scope="row">Source</th> <td>Compile from <a class="ulink" href="https://dev.mysql.com/downloads/mysql/" target="_top">source</a></td> <td><a class="link" href="source-installation.html" title="2.8 Installing MySQL from Source">Documentation</a></td> </tr><tr> <th scope="row">Docker</th> <td>Use the <a class="ulink" href="https://container-registry.oracle.com/" target="_blank">Oracle Container Registry</a>. You can also use <a class="ulink" href="https://support.oracle.com/" target="_blank">My Oracle Support</a> for the MySQL Enterprise Edition.</td> <td><a class="link" href="linux-installation-docker.html" title="2.5.7 Deploying MySQL on Linux with Docker">Documentation</a></td> </tr><tr> <th scope="row">Oracle Unbreakable Linux Network</th> <td>Use ULN channels</td> <td><a class="link" href="uln-installation.html" title="2.6 Installing MySQL Using Unbreakable Linux Network (ULN)">Documentation</a></td> </tr></tbody></table>

As an alternative, you can use the package manager on your system to automatically download and install MySQL with packages from the native software repositories of your Linux distribution. These native packages are often several versions behind the currently available release. You also normally cannot install development milestone releases (DMRs), as these are not usually made available in the native repositories. For more information on using the native package installers, see Section 2.5.8, “Installing MySQL on Linux from the Native Software Repositories”.

Note

For many Linux installations, you may want to set up MySQL to be started automatically when your machine starts. Many of the native package installations perform this operation for you, but for source, binary and RPM solutions you may need to set this up separately. The required script, **mysql.server**, can be found in the `support-files` directory under the MySQL installation directory or in a MySQL source tree. You can install it as `/etc/init.d/mysql` for automatic MySQL startup and shutdown. See Section 4.3.3, “mysql.server — MySQL Server Startup Script”.
