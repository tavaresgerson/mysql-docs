# Chapter 2 Installing MySQL

**Table of Contents**

[2.1 General Installation Guidance](general-installation-issues.html)
:   [2.1.1 Supported Platforms](platform-support.html)

    [2.1.2 Which MySQL Version and Distribution to Install](which-version.html)

    [2.1.3 How to Get MySQL](getting-mysql.html)

    [2.1.4 Verifying Package Integrity Using MD5 Checksums or GnuPG](verifying-package-integrity.html)

    [2.1.5 Installation Layouts](installation-layouts.html)

    [2.1.6 Compiler-Specific Build Characteristics](compiler-characteristics.html)

[2.2 Installing MySQL on Unix/Linux Using Generic Binaries](binary-installation.html)

[2.3 Installing MySQL on Microsoft Windows](windows-installation.html)
:   [2.3.1 MySQL Installation Layout on Microsoft Windows](windows-installation-layout.html)

    [2.3.2 Choosing an Installation Package](windows-choosing-package.html)

    [2.3.3 MySQL Installer for Windows](mysql-installer.html)

    [2.3.4 Installing MySQL on Microsoft Windows Using a `noinstall` ZIP Archive](windows-install-archive.html)

    [2.3.5 Troubleshooting a Microsoft Windows MySQL Server Installation](windows-troubleshooting.html)

    [2.3.6 Windows Postinstallation Procedures](windows-postinstallation.html)

    [2.3.7 Windows Platform Restrictions](windows-restrictions.html)

[2.4 Installing MySQL on macOS](macos-installation.html)
:   [2.4.1 General Notes on Installing MySQL on macOS](macos-installation-notes.html)

    [2.4.2 Installing MySQL on macOS Using Native Packages](macos-installation-pkg.html)

    [2.4.3 Installing and Using the MySQL Launch Daemon](macos-installation-launchd.html)

    [2.4.4 Installing and Using the MySQL Preference Pane](macos-installation-prefpane.html)

[2.5 Installing MySQL on Linux](linux-installation.html)
:   [2.5.1 Installing MySQL on Linux Using the MySQL Yum Repository](linux-installation-yum-repo.html)

    [2.5.2 Installing MySQL on Linux Using the MySQL APT Repository](linux-installation-apt-repo.html)

    [2.5.3 Installing MySQL on Linux Using the MySQL SLES Repository](linux-installation-sles-repo.html)

    [2.5.4 Installing MySQL on Linux Using RPM Packages from Oracle](linux-installation-rpm.html)

    [2.5.5 Installing MySQL on Linux Using Debian Packages from Oracle](linux-installation-debian.html)

    [2.5.6 Deploying MySQL on Linux with Docker Containers](linux-installation-docker.html)

    [2.5.7 Installing MySQL on Linux from the Native Software Repositories](linux-installation-native.html)

    [2.5.8 Installing MySQL on Linux with Juju](linux-installation-juju.html)

    [2.5.9 Managing MySQL Server with systemd](using-systemd.html)

[2.6 Installing MySQL Using Unbreakable Linux Network (ULN)](uln-installation.html)

[2.7 Installing MySQL on Solaris](solaris-installation.html)
:   [2.7.1 Installing MySQL on Solaris Using a Solaris PKG](solaris-installation-pkg.html)

[2.8 Installing MySQL from Source](source-installation.html)
:   [2.8.1 Source Installation Methods](source-installation-methods.html)

    [2.8.2 Source Installation Prerequisites](source-installation-prerequisites.html)

    [2.8.3 MySQL Layout for Source Installation](source-installation-layout.html)

    [2.8.4 Installing MySQL Using a Standard Source Distribution](installing-source-distribution.html)

    [2.8.5 Installing MySQL Using a Development Source Tree](installing-development-tree.html)

    [2.8.6 Configuring SSL Library Support](source-ssl-library-configuration.html)

    [2.8.7 MySQL Source-Configuration Options](source-configuration-options.html)

    [2.8.8 Dealing with Problems Compiling MySQL](compilation-problems.html)

    [2.8.9 MySQL Configuration and Third-Party Tools](source-configuration-third-party.html)

    [2.8.10 Generating MySQL Doxygen Documentation Content](source-installation-doxygen.html)

[2.9 Postinstallation Setup and Testing](postinstallation.html)
:   [2.9.1 Initializing the Data Directory](data-directory-initialization.html)

    [2.9.2 Starting the Server](starting-server.html)

    [2.9.3 Testing the Server](testing-server.html)

    [2.9.4 Securing the Initial MySQL Account](default-privileges.html)

    [2.9.5 Starting and Stopping MySQL Automatically](automatic-start.html)

[2.10 Perl Installation Notes](perl-support.html)
:   [2.10.1 Installing Perl on Unix](perl-installation.html)

    [2.10.2 Installing ActiveState Perl on Windows](activestate-perl.html)

    [2.10.3 Problems Using the Perl DBI/DBD Interface](perl-support-problems.html)

This chapter describes how to obtain and install MySQL. A summary of
the procedure follows and later sections provide the details. If you
plan to upgrade an existing version of MySQL to a newer version
rather than install MySQL for the first time, see
[Chapter 3, *Upgrading MySQL*](upgrading.html "Chapter 3 Upgrading MySQL"), for information about upgrade
procedures and about issues that you should consider before
upgrading.

If you are interested in migrating to MySQL from another database
system, see [Section A.8, “MySQL 8.0 FAQ: Migration”](faqs-migration.html "A.8 MySQL 8.0 FAQ: Migration"), which contains answers
to some common questions concerning migration issues.

Installation of MySQL generally follows the steps outlined here:

1. **Determine whether MySQL runs and is
   supported on your platform.**

   Please note that not all platforms are equally suitable for
   running MySQL, and that not all platforms on which MySQL is
   known to run are officially supported by Oracle Corporation. For
   information about those platforms that are officially supported,
   see <https://www.mysql.com/support/supportedplatforms/database.html> on the MySQL
   website.

2. **Choose which distribution to
   install.**

   Several versions of MySQL are available, and most are available
   in several distribution formats. You can choose from
   pre-packaged distributions containing binary (precompiled)
   programs or source code. When in doubt, use a binary
   distribution. Oracle also provides access to the MySQL source
   code for those who want to see recent developments and test new
   code. To determine which version and type of distribution you
   should use, see [Section 2.1.2, “Which MySQL Version and Distribution to Install”](which-version.html "2.1.2 Which MySQL Version and Distribution to Install").

3. **Choose which track to install.**

   MySQL offers a bugfix track (such as MySQL
   8.4), and an innovation track (today it's MySQL
   9.5) and each track addresses different
   use cases. Both tracks are considered production-ready and
   include bug fixes, while innovation releases also include new
   features and potential for modified behavior.

   A bugfix track upgrade includes point releases, such as MySQL
   8.4.*`x`* upgrading to
   8.4.*`y`*, while
   innovation track releases typically only have minor releases,
   such as MySQL 9.5.0 upgrading to
   9.6.0. However, an innovation track does
   have the occasional point release.

4. **Download the distribution that you want to
   install.**

   For instructions, see [Section 2.1.3, “How to Get MySQL”](getting-mysql.html "2.1.3 How to Get MySQL"). To verify
   the integrity of the distribution, use the instructions in
   [Section 2.1.4, “Verifying Package Integrity Using MD5 Checksums or GnuPG”](verifying-package-integrity.html "2.1.4 Verifying Package Integrity Using MD5 Checksums or GnuPG").

5. **Install the distribution.**

   To install MySQL from a binary distribution, use the
   instructions in [Section 2.2, “Installing MySQL on Unix/Linux Using Generic Binaries”](binary-installation.html "2.2 Installing MySQL on Unix/Linux Using Generic Binaries").
   Alternatively, use the
   [Secure
   Deployment Guide](/doc/mysql-secure-deployment-guide/8.0/en/), which provides procedures for
   deploying a generic binary distribution of MySQL Enterprise Edition Server with
   features for managing the security of your MySQL installation.

   To install MySQL from a source distribution or from the current
   development source tree, use the instructions in
   [Section 2.8, “Installing MySQL from Source”](source-installation.html "2.8 Installing MySQL from Source").

6. **Perform any necessary postinstallation
   setup.**

   After installing MySQL, see [Section 2.9, “Postinstallation Setup and Testing”](postinstallation.html "2.9 Postinstallation Setup and Testing")
   for information about making sure the MySQL server is working
   properly. Also refer to the information provided in
   [Section 2.9.4, “Securing the Initial MySQL Account”](default-privileges.html "2.9.4 Securing the Initial MySQL Account"). This section describes how
   to secure the initial MySQL `root` user
   account, *which has no password* until you
   assign one. The section applies whether you install MySQL using
   a binary or source distribution.

7. If you want to run the MySQL benchmark scripts, Perl support for
   MySQL must be available. See [Section 2.10, “Perl Installation Notes”](perl-support.html "2.10 Perl Installation Notes").

Instructions for installing MySQL on different platforms and
environments is available on a platform by platform basis:

* **Unix, Linux**

  For instructions on installing MySQL on most Linux and Unix
  platforms using a generic binary (for example, a
  `.tar.gz` package), see
  [Section 2.2, “Installing MySQL on Unix/Linux Using Generic Binaries”](binary-installation.html "2.2 Installing MySQL on Unix/Linux Using Generic Binaries").

  For information on building MySQL entirely from the source code
  distributions or the source code repositories, see
  [Section 2.8, “Installing MySQL from Source”](source-installation.html "2.8 Installing MySQL from Source")

  For specific platform help on installation, configuration, and
  building from source see the corresponding platform section:

  + Linux, including notes on distribution specific methods, see
    [Section 2.5, “Installing MySQL on Linux”](linux-installation.html "2.5 Installing MySQL on Linux").

  + IBM AIX, see [Section 2.7, “Installing MySQL on Solaris”](solaris-installation.html "2.7 Installing MySQL on Solaris").
* **Microsoft Windows**

  For instructions on installing MySQL on Microsoft Windows, using
  either the MySQL Installer or Zipped binary, see
  [Section 2.3, “Installing MySQL on Microsoft Windows”](windows-installation.html "2.3 Installing MySQL on Microsoft Windows").

  For details and instructions on building MySQL from source code
  using Microsoft Visual Studio, see
  [Section 2.8, “Installing MySQL from Source”](source-installation.html "2.8 Installing MySQL from Source").

* **macOS**

  For installation on macOS, including using both the binary
  package and native PKG formats, see
  [Section 2.4, “Installing MySQL on macOS”](macos-installation.html "2.4 Installing MySQL on macOS").

  For information on making use of an macOS Launch Daemon to
  automatically start and stop MySQL, see
  [Section 2.4.3, “Installing and Using the MySQL Launch Daemon”](macos-installation-launchd.html "2.4.3 Installing and Using the MySQL Launch Daemon").

  For information on the MySQL Preference Pane, see
  [Section 2.4.4, “Installing and Using the MySQL Preference Pane”](macos-installation-prefpane.html "2.4.4 Installing and Using the MySQL Preference Pane").