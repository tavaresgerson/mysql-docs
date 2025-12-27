# Chapter 2 Installing and Upgrading MySQL

**Table of Contents**

2.1 General Installation Guidance :   2.1.1 Supported Platforms

    2.1.2 Which MySQL Version and Distribution to Install

    2.1.3 How to Get MySQL

    2.1.4 Verifying Package Integrity Using MD5 Checksums or GnuPG

    2.1.5 Installation Layouts

    2.1.6 Compiler-Specific Build Characteristics

2.2 Installing MySQL on Unix/Linux Using Generic Binaries

2.3 Installing MySQL on Microsoft Windows :   2.3.1 MySQL Installation Layout on Microsoft Windows

    2.3.2 Choosing an Installation Package

    2.3.3 MySQL Installer for Windows

    2.3.4 Installing MySQL on Microsoft Windows Using a `noinstall` ZIP Archive

    2.3.5 Troubleshooting a Microsoft Windows MySQL Server Installation

    2.3.6 Windows Postinstallation Procedures

    2.3.7 Windows Platform Restrictions

2.4 Installing MySQL on macOS :   2.4.1 General Notes on Installing MySQL on macOS

    2.4.2 Installing MySQL on macOS Using Native Packages

    2.4.3 Installing a MySQL Launch Daemon

    2.4.4 Installing and Using the MySQL Preference Pane

2.5 Installing MySQL on Linux :   2.5.1 Installing MySQL on Linux Using the MySQL Yum Repository

    2.5.2 Replacing a Third-Party Distribution of MySQL Using the MySQL Yum Repository

    2.5.3 Installing MySQL on Linux Using the MySQL APT Repository

    2.5.4 Installing MySQL on Linux Using the MySQL SLES Repository

    2.5.5 Installing MySQL on Linux Using RPM Packages from Oracle

    2.5.6 Installing MySQL on Linux Using Debian Packages from Oracle

    2.5.7 Deploying MySQL on Linux with Docker

    2.5.8 Installing MySQL on Linux from the Native Software Repositories

    2.5.9 Installing MySQL on Linux with Juju

    2.5.10 Managing MySQL Server with systemd

2.6 Installing MySQL Using Unbreakable Linux Network (ULN)

2.7 Installing MySQL on Solaris :   2.7.1 Installing MySQL on Solaris Using a Solaris PKG

2.8 Installing MySQL from Source :   2.8.1 Source Installation Methods

    2.8.2 Source Installation Prerequisites

    2.8.3 MySQL Layout for Source Installation

    2.8.4 Installing MySQL Using a Standard Source Distribution

    2.8.5 Installing MySQL Using a Development Source Tree

    2.8.6 Configuring SSL Library Support

    2.8.7 MySQL Source-Configuration Options

    2.8.8 Dealing with Problems Compiling MySQL

    2.8.9 MySQL Configuration and Third-Party Tools

2.9 Postinstallation Setup and Testing :   2.9.1 Initializing the Data Directory

    2.9.2 Starting the Server

    2.9.3 Testing the Server

    2.9.4 Securing the Initial MySQL Account

    2.9.5 Starting and Stopping MySQL Automatically

2.10 Upgrading MySQL :   2.10.1 Before You Begin

    2.10.2 Upgrade Paths

    2.10.3 Changes in MySQL 5.7

    2.10.4 Upgrading MySQL Binary or Package-based Installations on Unix/Linux

    2.10.5 Upgrading MySQL with the MySQL Yum Repository

    2.10.6 Upgrading MySQL with the MySQL APT Repository

    2.10.7 Upgrading MySQL with the MySQL SLES Repository

    2.10.8 Upgrading MySQL on Windows

    2.10.9 Upgrading a Docker Installation of MySQL

    2.10.10 Upgrading MySQL with Directly-Downloaded RPM Packages

    2.10.11 Upgrade Troubleshooting

    2.10.12 Rebuilding or Repairing Tables or Indexes

    2.10.13 Copying MySQL Databases to Another Machine

2.11 Downgrading MySQL :   2.11.1 Before You Begin

    2.11.2 Downgrade Paths

    2.11.3 Downgrade Notes

    2.11.4 Downgrading Binary and Package-based Installations on Unix/Linux

    2.11.5 Downgrade Troubleshooting

2.12 Perl Installation Notes :   2.12.1 Installing Perl on Unix

    2.12.2 Installing ActiveState Perl on Windows

    2.12.3 Problems Using the Perl DBI/DBD Interface

This chapter describes how to obtain and install MySQL. A summary of the procedure follows and later sections provide the details. If you plan to upgrade an existing version of MySQL to a newer version rather than install MySQL for the first time, see Section 2.10, “Upgrading MySQL”, for information about upgrade procedures and about issues that you should consider before upgrading.

If you are interested in migrating to MySQL from another database system, see Section A.8, “MySQL 5.7 FAQ: Migration”, which contains answers to some common questions concerning migration issues.

Installation of MySQL generally follows the steps outlined here:

1. **Determine whether MySQL runs and is supported on your platform.**

   Please note that not all platforms are equally suitable for running MySQL, and that not all platforms on which MySQL is known to run are officially supported by Oracle Corporation. For information about those platforms that are officially supported, see <https://www.mysql.com/support/supportedplatforms/database.html> on the MySQL website.

2. **Choose which distribution to install.**

   Several versions of MySQL are available, and most are available in several distribution formats. You can choose from pre-packaged distributions containing binary (precompiled) programs or source code. When in doubt, use a binary distribution. Oracle also provides access to the MySQL source code for those who want to see recent developments and test new code. To determine which version and type of distribution you should use, see Section 2.1.2, “Which MySQL Version and Distribution to Install”.

3. **Download the distribution that you want to install.**

   For instructions, see Section 2.1.3, “How to Get MySQL”. To verify the integrity of the distribution, use the instructions in Section 2.1.4, “Verifying Package Integrity Using MD5 Checksums or GnuPG”.

4. **Install the distribution.**

   To install MySQL from a binary distribution, use the instructions in Section 2.2, “Installing MySQL on Unix/Linux Using Generic Binaries”. Alternatively, use the Secure Deployment Guide, which provides procedures for deploying a generic binary distribution of MySQL Enterprise Edition Server with features for managing the security of your MySQL installation.

   To install MySQL from a source distribution or from the current development source tree, use the instructions in Section 2.8, “Installing MySQL from Source”.

5. **Perform any necessary postinstallation setup.**

   After installing MySQL, see Section 2.9, “Postinstallation Setup and Testing” for information about making sure the MySQL server is working properly. Also refer to the information provided in Section 2.9.4, “Securing the Initial MySQL Account”. This section describes how to secure the initial MySQL `root` user account, *which has no password* until you assign one. The section applies whether you install MySQL using a binary or source distribution.

6. If you want to run the MySQL benchmark scripts, Perl support for MySQL must be available. See Section 2.12, “Perl Installation Notes”.

Instructions for installing MySQL on different platforms and environments is available on a platform by platform basis:

* **Unix, Linux**

  For instructions on installing MySQL on most Linux and Unix platforms using a generic binary (for example, a `.tar.gz` package), see Section 2.2, “Installing MySQL on Unix/Linux Using Generic Binaries”.

  For information on building MySQL entirely from the source code distributions or the source code repositories, see Section 2.8, “Installing MySQL from Source”

  For specific platform help on installation, configuration, and building from source see the corresponding platform section:

  + Linux, including notes on distribution specific methods, see Section 2.5, “Installing MySQL on Linux”.

  + Solaris, including PKG and IPS formats, see Section 2.7, “Installing MySQL on Solaris”.

  + IBM AIX, see Section 2.7, “Installing MySQL on Solaris”.
* **Microsoft Windows**

  For instructions on installing MySQL on Microsoft Windows, using either the MySQL Installer or Zipped binary, see Section 2.3, “Installing MySQL on Microsoft Windows”.

  For details and instructions on building MySQL from source code using Microsoft Visual Studio, see Section 2.8, “Installing MySQL from Source”.

* **macOS**

  For installation on macOS, including using both the binary package and native PKG formats, see Section 2.4, “Installing MySQL on macOS”.

  For information on making use of an macOS Launch Daemon to automatically start and stop MySQL, see Section 2.4.3, “Installing a MySQL Launch Daemon”.

  For information on the MySQL Preference Pane, see Section 2.4.4, “Installing and Using the MySQL Preference Pane”.
