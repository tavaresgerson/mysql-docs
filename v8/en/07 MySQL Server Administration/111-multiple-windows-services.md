#### 7.8.2.2 Starting Multiple MySQL Instances as Windows Services

On Windows, a MySQL server can run as a Windows service. The procedures for installing, controlling, and removing a single MySQL service are described in Section 2.3.3.8, “Starting MySQL as a Windows Service”.

To set up multiple MySQL services, you must make sure that each instance uses a different service name in addition to the other parameters that must be unique per instance.

For the following instructions, suppose that you want to run the **mysqld** server from two different versions of MySQL that are installed at `C:\mysql-5.7.9` and `C:\mysql-8.4.6`, respectively. (This might be the case if you are running 5.7.9 as your production server, but also want to conduct tests using 8.4.6.)

To install MySQL as a Windows service, use the `--install` or `--install-manual` option. For information about these options, see Section 2.3.3.8, “Starting MySQL as a Windows Service”.

Based on the preceding information, you have several ways to set up multiple services. The following instructions describe some examples. Before trying any of them, shut down and remove any existing MySQL services.

* **Approach 1:** Specify the options for all services in one of the standard option files. To do this, use a different service name for each server. Suppose that you want to run the 5.7.9 **mysqld** using the service name of `mysqld1` and the 8.4.6 **mysqld** using the service name `mysqld2`. In this case, you can use the `[mysqld1]` group for 5.7.9 and the `[mysqld2]` group for 8.4.6. For example, you can set up `C:\my.cnf` like this:

  ```
  # options for mysqld1 service
  [mysqld1]
  basedir = C:/mysql-5.7.9
  port = 3307
  enable-named-pipe
  socket = mypipe1

  # options for mysqld2 service
  [mysqld2]
  basedir = C:/mysql-8.4.6
  port = 3308
  enable-named-pipe
  socket = mypipe2
  ```

  Install the services as follows, using the full server path names to ensure that Windows registers the correct executable program for each service:

  ```
  C:\> C:\mysql-5.7.9\bin\mysqld --install mysqld1
  C:\> C:\mysql-8.4.6\bin\mysqld --install mysqld2
  ```

  To start the services, use the services manager, or **NET START** or **SC START** with the appropriate service names:

  ```
  C:\> SC START mysqld1
  C:\> SC START mysqld2
  ```

  To stop the services, use the services manager, or use **NET STOP** or **SC STOP** with the appropriate service names:

  ```
  C:\> SC STOP mysqld1
  C:\> SC STOP mysqld2
  ```
* **Approach 2:** Specify options for each server in separate files and use `--defaults-file` when you install the services to tell each server what file to use. In this case, each file should list options using a `[mysqld]` group.

  With this approach, to specify options for the 5.7.9 **mysqld**, create a file `C:\my-opts1.cnf` that looks like this:

  ```
  [mysqld]
  basedir = C:/mysql-5.7.9
  port = 3307
  enable-named-pipe
  socket = mypipe1
  ```

  For the 8.4.6  **mysqld**, create a file `C:\my-opts2.cnf` that looks like this:

  ```
  [mysqld]
  basedir = C:/mysql-8.4.6
  port = 3308
  enable-named-pipe
  socket = mypipe2
  ```

  Install the services as follows (enter each command on a single line):

  ```
  C:\> C:\mysql-5.7.9\bin\mysqld --install mysqld1
             --defaults-file=C:\my-opts1.cnf
  C:\> C:\mysql-8.4.6\bin\mysqld --install mysqld2
             --defaults-file=C:\my-opts2.cnf
  ```

  When you install a MySQL server as a service and use a `--defaults-file` option, the service name must precede the option.

  After installing the services, start and stop them the same way as in the preceding example.

To remove multiple services, use **SC DELETE *`mysqld_service_name`*** for each one. Alternatively, use  **mysqld --remove** for each one, specifying a service name following the `--remove` option. If the service name is the default (`MySQL`), you can omit it when using  **mysqld --remove**.
