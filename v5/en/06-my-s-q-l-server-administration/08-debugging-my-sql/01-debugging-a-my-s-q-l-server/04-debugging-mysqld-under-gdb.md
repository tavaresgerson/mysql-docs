#### 5.8.1.4 Debugging mysqld under gdb

On most systems you can also start [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") from **gdb** to get more information if [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") crashes.

With some older **gdb** versions on Linux you must use `run --one-thread` if you want to be able to debug [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") threads. In this case, you can only have one thread active at a time.

NPTL threads (the new thread library on Linux) may cause problems while running [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") under **gdb**. Some symptoms are:

* [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") hangs during startup (before it writes `ready for connections`).

* [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") crashes during a `pthread_mutex_lock()` or `pthread_mutex_unlock()` call.

In this case, you should set the following environment variable in the shell before starting **gdb**:

```sql
LD_ASSUME_KERNEL=2.4.1
export LD_ASSUME_KERNEL
```

When running [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") under **gdb**, you should disable the stack trace with [`--skip-stack-trace`](server-options.html#option_mysqld_skip-stack-trace) to be able to catch segfaults within **gdb**.

Use the [`--gdb`](server-options.html#option_mysqld_gdb) option to [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") to install an interrupt handler for `SIGINT` (needed to stop [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") with `^C` to set breakpoints) and disable stack tracing and core file handling.

It is very hard to debug MySQL under **gdb** if you do a lot of new connections the whole time as **gdb** does not free the memory for old threads. You can avoid this problem by starting [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") with [`thread_cache_size`](server-system-variables.html#sysvar_thread_cache_size) set to a value equal to [`max_connections`](server-system-variables.html#sysvar_max_connections)

+ 1. In most cases just using [`--thread_cache_size=5'`](server-system-variables.html#sysvar_thread_cache_size) helps a lot!

If you want to get a core dump on Linux if [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") dies with a SIGSEGV signal, you can start [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") with the [`--core-file`](server-options.html#option_mysqld_core-file) option. This core file can be used to make a backtrace that may help you find out why [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") died:

```sql
$> gdb mysqld core
gdb>   backtrace full
gdb>   quit
```

See [Section B.3.3.3, “What to Do If MySQL Keeps Crashing”](crashing.html "B.3.3.3 What to Do If MySQL Keeps Crashing").

If you are using **gdb** on Linux, you should install a `.gdb` file, with the following information, in your current directory:

```sql
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

Here is an example how to debug [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"):

```sql
$> gdb /usr/local/libexec/mysqld
gdb> run
...
backtrace full # Do this when mysqld crashes
```

Include the preceding output in a bug report, which you can file using the instructions in [Section 1.5, “How to Report Bugs or Problems”](bug-reports.html "1.5 How to Report Bugs or Problems").

If [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") hangs, you can try to use some system tools like `strace` or `/usr/proc/bin/pstack` to examine where [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") has hung.

```sql
strace /tmp/log libexec/mysqld
```

If you are using the Perl `DBI` interface, you can turn on debugging information by using the `trace` method or by setting the `DBI_TRACE` environment variable.
