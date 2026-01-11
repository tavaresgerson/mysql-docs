#### 15.7.8.8 RESTART Statement

```
RESTART
```

This statement stops and restarts the MySQL server. It requires the `SHUTDOWN` privilege.

One use for `RESTART` is when it is not possible or convenient to gain command-line access to the MySQL server on the server host to restart it. For example, `SET PERSIST_ONLY` can be used at runtime to make configuration changes to system variables that can be set only at server startup, but the server must still be restarted for those changes to take effect. The `RESTART` statement provides a way to do so from within client sessions, without requiring command-line access on the server host.

Note

After executing a `RESTART` statement, the client can expect the current connection to be lost. If auto-reconnect is enabled, the connection is reestablished after the server restarts. Otherwise, the connection must be reestablished manually.

A successful `RESTART` operation requires **mysqld** to be running in an environment that has a monitoring process available to detect a server shutdown performed for restart purposes:

* In the presence of a monitoring process, `RESTART` causes **mysqld** to terminate such that the monitoring process can determine that it should start a new **mysqld** instance.

* If no monitoring process is present, `RESTART` fails with an error.

These platforms provide the necessary monitoring support for the `RESTART` statement:

* Windows, when **mysqld** is started as a Windows service or standalone. (**mysqld** forks, and one process acts as a monitor to the other, which acts as the server.)

* Unix and Unix-like systems that use systemd or **mysqld\_safe** to manage **mysqld**.

To configure a monitoring environment such that **mysqld** enables the `RESTART` statement:

1. Set the `MYSQLD_PARENT_PID` environment variable to the value of the process ID of the process that starts **mysqld**, before starting **mysqld**.

2. When **mysqld** performs a shutdown due to use of the `RESTART` statement, it returns exit code 16.

3. When the monitoring process detects an exit code of 16, it starts **mysqld** again. Otherwise, it exits.

Here is a minimal example as implemented in the **bash** shell:

```
#!/bin/bash

export MYSQLD_PARENT_PID=$$

export MYSQLD_RESTART_EXIT=16

while true ; do
  bin/mysqld mysqld options here
  if [ $? -ne $MYSQLD_RESTART_EXIT ]; then
    break
  fi
done
```

On Windows, the forking used to implement `RESTART` makes determining the server process to attach to for debugging more difficult. To alleviate this, starting the server with `--gdb` suppresses forking, in addition to its other actions done to set up a debugging environment. In non-debug settings, `--no-monitor` may be used for the sole purpose of suppressing forking the monitor process. For a server started with either `--gdb` or `--no-monitor`, executing `RESTART` causes the server to simply exit without restarting.

The `Com_restart` status variable tracks the number of `RESTART` statements. Because status variables are initialized for each server startup and do not persist across restarts, `Com_restart` normally has a value of zero, but can be nonzero if `RESTART` statements were executed but failed.
