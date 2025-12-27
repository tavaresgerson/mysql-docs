#### 19.2.1.2 Installing MySQL Shell on Linux

Note

Installation packages for MySQL Shell are available only for a limited number of Linux distributions, and only for 64-bit systems.

For supported Linux distributions, the easiest way to install MySQL Shell on Linux is to use the [MySQL APT repository](https://dev.mysql.com/downloads/repo/apt/) or [MySQL Yum repository](https://dev.mysql.com/downloads/repo/yum/). For systems not using the MySQL repositories, MySQL Shell can also be downloaded and installed directly.

##### Installing MySQL Shell with the MySQL APT Repository

For Linux distributions supported by the [MySQL APT repository](https://dev.mysql.com/downloads/repo/apt/), follow one of the paths below:

* If you do not yet have the [MySQL APT repository](https://dev.mysql.com/downloads/repo/apt/) as a software repository on your system, do the following:

  + Follow the steps given in Adding the MySQL APT Repository, paying special attention to the following:

    - During the installation of the configuration package, when asked in the dialogue box to configure the repository, make sure you choose MySQL 5.7 (which is the default option) as the release series you want, and enable the MySQL Preview Packages component.

    - Make sure you do not skip the step for updating package information for the MySQL APT repository:

      ```sql
      sudo apt-get update
      ```

  + Install MySQL Shell with this command:

    ```sql
    sudo apt-get install mysql-shell
    ```

* If you already have the [MySQL APT repository](https://dev.mysql.com/downloads/repo/apt/) as a software repository on your system, do the following:

  + Update package information for the MySQL APT repository:

    ```sql
    sudo apt-get update
    ```

  + Update the MySQL APT repository configuration package with the following command:

    ```sql
    sudo apt-get install mysql-apt-config
    ```

    When asked in the dialogue box to configure the repository, make sure you choose MySQL 5.7 (which is the default option) as the release series you want, and enable the MySQL Preview Packages component.

  + Install MySQL Shell with this command:

    ```sql
    sudo apt-get install mysql-shell
    ```

##### Installing MySQL Shell with the MySQL Yum Repository

For Linux distributions supported by the [MySQL Yum repository](https://dev.mysql.com/downloads/repo/yum/), follow these steps to install MySQL Shell:

* Do one of the following:

  + If you already have the [MySQL Yum repository](https://dev.mysql.com/downloads/repo/yum/) as a software repository on your system and the repository was configured with the new release package `mysql57-community-release`, skip to the next step (“Enable the MySQL Tools Preview subrepository...”).

  + If you already have the [MySQL Yum repository](https://dev.mysql.com/downloads/repo/yum/) as a software repository on your system but have configured the repository with the old release package `mysql-community-release`, it is easiest to install MySQL Shell by first reconfiguring the MySQL Yum repository with the new `mysql57-community-release` package. To do so, you need to remove your old release package first, with the following command :

    ```sql
    sudo yum remove mysql-community-release
    ```

    For dnf-enabled systems, do this instead:

    ```sql
    sudo dnf erase mysql-community-release
    ```

    Then, follow the steps given in Adding the MySQL Yum Repository to install the new release package, `mysql57-community-release`.

  + If you do not yet have the [MySQL Yum repository](https://dev.mysql.com/downloads/repo/yum/) as a software repository on your system, follow the steps given in Adding the MySQL Yum Repository.

* Enable the MySQL Tools Preview subrepository. You can do that by editing manually the `/etc/yum.repos.d/mysql-community.repo` file. This is an example of the subrepository's default entry in the file (the `baseurl` entry in your file might look different, depending on your Linux distribution):

  ```sql
  [mysql-tools-preview]
  name=MySQL Tools Preview
  baseurl=http://repo.mysql.com/yum/mysql-tools-preview/el/6/$basearch/
  enabled=0
  gpgcheck=1
  gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql
  ```

  Change the entry `enabled=0` to `enabled=1` to enable the subrepository.

* Install MySQL Shell with this command:

  ```sql
  sudo yum install mysql-shell
  ```

  For dnf-enabled systems, do this instead:

  ```sql
  sudo dnf install mysql-shell
  ```

##### Installing MySQL Shell from Direct Downloads from the MySQL Developer Zone

RPM, Debian, and source packages for installing MySQL Shell are also available for download at [Download MySQL Shell](https://dev.mysql.com/downloads/shell/).
