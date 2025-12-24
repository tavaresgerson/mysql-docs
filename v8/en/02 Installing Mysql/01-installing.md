# Chapter 2 Installing MySQL

This chapter describes how to obtain and install MySQL. A summary of the procedure follows and later sections provide the details. If you plan to upgrade an existing version of MySQL to a newer version rather than install MySQL for the first time, see Chapter 3, *Upgrading MySQL*, for information about upgrade procedures and about issues that you should consider before upgrading.

If you are interested in migrating to MySQL from another database system, which contains answers to some common questions concerning migration issues.

Installation of MySQL generally follows the steps outlined here:

1. **Determine whether MySQL runs and is supported on your platform.**

   Please note that not all platforms are equally suitable for running MySQL, and that not all platforms on which MySQL is known to run are officially supported by Oracle Corporation. For information about those platforms that are officially supported, see <https://www.mysql.com/support/supportedplatforms/database.html> on the MySQL website.
2. **Choose which track to install.**

   MySQL offers an LTS series, such as MySQL 8.4, and an Innovation series. They address different use cases as described at Section 1.3, “MySQL Releases: Innovation and LTS”.
3. **Choose which distribution to install.**

   Several versions of MySQL are available, and most are available in several distribution formats. You can choose from pre-packaged distributions containing binary (precompiled) programs or source code. When in doubt, use a binary distribution. Oracle also provides access to the MySQL source code for those who want to see recent developments and test new code. To determine which version and type of distribution you should use, see  Section 2.1.2, “Which MySQL Version and Distribution to Install”.
4. **Download the distribution that you want to install.**

   For instructions, see  Section 2.1.3, “How to Get MySQL”. To verify the integrity of the distribution, use the instructions in Section 2.1.4, “Verifying Package Integrity Using MD5 Checksums or GnuPG”.
5. **Install the distribution.**

   To install MySQL from a binary distribution, use the instructions in  Section 2.2, “Installing MySQL on Unix/Linux Using Generic Binaries”. Alternatively, use the Secure Deployment Guide, which provides procedures for deploying a generic binary distribution of MySQL Enterprise Edition Server with features for managing the security of your MySQL installation.

   To install MySQL from a source distribution or from the current development source tree, use the instructions in Section 2.8, “Installing MySQL from Source”.
6. **Perform any necessary postinstallation setup.**

   After installing MySQL, see  Section 2.9, “Postinstallation Setup and Testing”, for information about making sure the MySQL server is working properly. Also refer to the information provided in Section 2.9.4, “Securing the Initial MySQL Account”. This section describes how to secure the initial MySQL `root` user account, *which has no password until you assign one*. The section applies whether you install MySQL using a binary or source distribution.
7. If you want to run the MySQL benchmark scripts, Perl support for MySQL must be available.

Instructions for installing MySQL on different platforms and environments is available on a platform by platform basis:

* **Unix, Linux**

  For instructions on installing MySQL on most Linux and Unix platforms using a generic binary (for example, a `.tar.gz` package).

  For information on building MySQL entirely from the source code distributions or the source code repositories.

  For specific platform help on installation, configuration, and building from source see the corresponding platform section:

  + Linux, including notes on distribution specific methods, see Section 2.5, “Installing MySQL on Linux”.
  + IBM AIX, see  Section 2.7, “Installing MySQL on Solaris”.
* **Microsoft Windows**

  For instructions on installing MySQL on Microsoft Windows, using either the MSI installer or Zipped binary, see Section 2.3, “Installing MySQL on Microsoft Windows”.

  For details and instructions on building MySQL from source code, see  Section 2.8, “Installing MySQL from Source”.
* **macOS**

  For installation on macOS, including using both the binary package and native PKG formats, see Section 2.4, “Installing MySQL on macOS”.

  For information on making use of an macOS Launch Daemon to automatically start and stop MySQL, see Section 2.4.3, “Installing and Using the MySQL Launch Daemon”.

  For information on the MySQL Preference Pane, see Section 2.4.4, “Installing and Using the MySQL Preference Pane”.
