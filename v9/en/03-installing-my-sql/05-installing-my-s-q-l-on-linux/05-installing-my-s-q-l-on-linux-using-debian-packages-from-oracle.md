### 2.5.5 Installing MySQL on Linux Using Debian Packages from Oracle

Oracle provides Debian packages for installing MySQL on Debian or Debian-like Linux systems. The packages are available through two different channels:

* The [MySQL APT Repository](https://dev.mysql.com/downloads/repo/apt/). This is the preferred method for installing MySQL on Debian-like systems, as it provides a simple and convenient way to install and update MySQL products. For details, see Section 2.5.2, “Installing MySQL on Linux Using the MySQL APT Repository”.

* The [MySQL Developer Zone's Download Area](https://dev.mysql.com/downloads/). For details, see Section 2.1.3, “How to Get MySQL”. The following are some information on the Debian packages available there and the instructions for installing them:

  + Various Debian packages are provided in the MySQL Developer Zone for installing different components of MySQL on the current Debian and Ubuntu platforms. The preferred method is to use the tarball bundle, which contains the packages needed for a basic setup of MySQL. The tarball bundles have names in the format of `mysql-server_MVER-DVER_CPU.deb-bundle.tar`. *`MVER`* is the MySQL version and *`DVER`* is the Linux distribution version. The *`CPU`* value indicates the processor type or family for which the package is built, as shown in the following table:

    **Table 2.14 MySQL Debian and Ubuntu Installation Packages CPU Identifiers**

    <table><col style="width: 25%"/><col style="width: 75%"/><thead><tr> <th><em class="replaceable"><code>CPU</code></em> Value</th> <th>Intended Processor Type or Family</th> </tr></thead><tbody><tr> <td><code class="literal">i386</code></td> <td>Pentium processor or better, 32 bit</td> </tr><tr> <td><code class="literal">amd64</code></td> <td>64-bit x86 processor</td> </tr></tbody></table>

  + After downloading the tarball, unpack it with the following command:

    ```
    $> tar -xvf mysql-server_MVER-DVER_CPU.deb-bundle.tar
    ```

  + You may need to install the `libaio` library if it is not already present on your system:

    ```
    $> sudo apt-get install libaio1
    ```

  + Preconfigure the MySQL server package with the following command:

    ```
    $> sudo dpkg-preconfigure mysql-community-server_*.deb
    ```

    You are asked to provide a password for the root user for your MySQL installation. You might also be asked other questions regarding the installation.

    Important

    Make sure you remember the root password you set. Users who want to set a password later can leave the password field blank in the dialogue box and just press OK; in that case, root access to the server is authenticated using the MySQL Socket Peer-Credential Authentication Plugin for connections using a Unix socket file. You can set the root password later using **mysql\_secure\_installation**.

  + For a basic installation of the MySQL server, install the database common files package, the client package, the client metapackage, the server package, and the server metapackage (in that order); you can do that with a single command:

    ```
    $> sudo dpkg -i mysql-{common,community-client-plugins,community-client-core,community-client,client,community-server-core,community-server,server}_*.deb
    ```

    There are also packages with `server-core` and `client-core` in the package names. These contain binaries only and are installed automatically by the standard packages. Installing them by themselves does not result in a functioning MySQL setup.

    If you are being warned of unmet dependencies by **dpkg** (such as libmecab2), you can fix them using **apt-get**:

    ```
    sudo apt-get -f install
    ```

    Here are where the files are installed on the system:

    - All configuration files (like `my.cnf`) are under `/etc/mysql`

    - All binaries, libraries, headers, etc., are under `/usr/bin` and `/usr/sbin`

    - The data directory is under `/var/lib/mysql`

Note

Debian distributions of MySQL are also provided by other vendors. Be aware that they may differ from those built by Oracle in features, capabilities, and conventions (including communication setup), and that the instructions in this manual do not necessarily apply to installing them. The vendor's instructions should be consulted instead.
