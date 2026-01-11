#### 7.9.1.4 Debugging mysqld under gdb

On most systems you can also start **mysqld** from **gdb** to get more information if **mysqld** crashes.

With some older **gdb** versions on Linux you must use `run --one-thread` if you want to be able to debug **mysqld** threads. In this case, you can only have one thread active at a time.

NPTL threads (the new thread library on Linux) may cause problems while running **mysqld** under **gdb**. Some symptoms are:

* **mysqld** hangs during startup (before it writes `ready for connections`).

* **mysqld** crashes during a `pthread_mutex_lock()` or `pthread_mutex_unlock()` call.

In this case, you should set the following environment variable in the shell before starting **gdb**:

```
LD_ASSUME_KERNEL=2.4.1
export LD_ASSUME_KERNEL
```

When running **mysqld** under **gdb**, you should disable the stack trace with `--skip-stack-trace` to be able to catch segfaults within **gdb**.

Use the `--gdb` option to **mysqld** to install an interrupt handler for `SIGINT` (needed to stop **mysqld** with `^C` to set breakpoints) and disable stack tracing and core file handling.

It is very hard to debug MySQL under **gdb** if you do a lot of new connections the whole time as **gdb** does not free the memory for old threads. You can avoid this problem by starting **mysqld** with `thread_cache_size` set to a value equal to `max_connections`

+ 1. In most cases just using `--thread_cache_size=5'` helps a lot!

If you want to get a core dump on Linux if **mysqld** dies with a SIGSEGV signal, you can start **mysqld** with the `--core-file` option. This core file can be used to make a backtrace that may help you find out why **mysqld** died:

```
$> gdb mysqld core
gdb>   backtrace full
gdb>   quit
```

See Section B.3.3.3, “What to Do If MySQL Keeps Crashing”.

If you are using **gdb** on Linux, you should install a `.gdb` file, with the following information, in your current directory:

```
set print sevenbit off
handle SIGUSR1 nostop noprint
handle SIGUSR2 nostop noprint
handle SIGWAITING nostop noprint
handle SIGLWP nostop noprint
handle SIGPIPE nostop
handle SIGALRM nostop
handle SIGHUP nostop
handle SIGTERM nostop noprint
```

Here is an example how to debug **mysqld**:

```
$> gdb /usr/local/libexec/mysqld
gdb> run
...
backtrace full # Do this when mysqld crashes
```

Include the preceding output in a bug report, which you can file using the instructions in Section 1.5, “How to Report Bugs or Problems”.

If **mysqld** hangs, you can try to use some system tools like `strace` or `/usr/proc/bin/pstack` to examine where **mysqld** has hung.

```
strace /tmp/log libexec/mysqld
```

If you are using the Perl `DBI` interface, you can turn on debugging information by using the `trace` method or by setting the `DBI_TRACE` environment variable.
