#### 5.8.1.5 Using a Stack Trace

On some operating systems, the error log contains a stack trace if [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") dies unexpectedly. You can use this to find out where (and maybe why) [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") died. See [Section 5.4.2, “The Error Log”](error-log.html "5.4.2 The Error Log"). To get a stack trace, you must not compile [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") with the `-fomit-frame-pointer` option to gcc. See [Section 5.8.1.1, “Compiling MySQL for Debugging”](compiling-for-debugging.html "5.8.1.1 Compiling MySQL for Debugging").

A stack trace in the error log looks something like this:

```sql
mysqld got signal 11;
Attempting backtrace. You can use the following information
to find out where mysqld died. If you see no messages after
this, something went terribly wrong...

stack_bottom = 0x41fd0110 thread_stack 0x40000
mysqld(my_print_stacktrace+0x32)[0x9da402]
mysqld(handle_segfault+0x28a)[0x6648e9]
/lib/libpthread.so.0[0x7f1a5af000f0]
/lib/libc.so.6(strcmp+0x2)[0x7f1a5a10f0f2]
mysqld(_Z21check_change_passwordP3THDPKcS2_Pcj+0x7c)[0x7412cb]
mysqld(_ZN16set_var_password5checkEP3THD+0xd0)[0x688354]
mysqld(_Z17sql_set_variablesP3THDP4ListI12set_var_baseE+0x68)[0x688494]
mysqld(_Z21mysql_execute_commandP3THD+0x41a0)[0x67a170]
mysqld(_Z11mysql_parseP3THDPKcjPS2_+0x282)[0x67f0ad]
mysqld(_Z16dispatch_command19enum_server_commandP3THDPcj+0xbb7[0x67fdf8]
mysqld(_Z10do_commandP3THD+0x24d)[0x6811b6]
mysqld(handle_one_connection+0x11c)[0x66e05e]
```

If resolution of function names for the trace fails, the trace contains less information:

```sql
mysqld got signal 11;
Attempting backtrace. You can use the following information
to find out where mysqld died. If you see no messages after
this, something went terribly wrong...

stack_bottom = 0x41fd0110 thread_stack 0x40000
[0x9da402]
[0x6648e9]
[0x7f1a5af000f0]
[0x7f1a5a10f0f2]
[0x7412cb]
[0x688354]
[0x688494]
[0x67a170]
[0x67f0ad]
[0x67fdf8]
[0x6811b6]
[0x66e05e]
```

In the latter case, you can use the [**resolve\_stack\_dump**](resolve-stack-dump.html "4.7.3 resolve_stack_dump — Resolve Numeric Stack Trace Dump to Symbols") utility to determine where [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") died by using the following procedure:

1. Copy the numbers from the stack trace to a file, for example `mysqld.stack`. The numbers should not include the surrounding square brackets:

   ```sql
   0x9da402
   0x6648e9
   0x7f1a5af000f0
   0x7f1a5a10f0f2
   0x7412cb
   0x688354
   0x688494
   0x67a170
   0x67f0ad
   0x67fdf8
   0x6811b6
   0x66e05e
   ```

2. Make a symbol file for the [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") server:

   ```sql
   $> nm -n libexec/mysqld > /tmp/mysqld.sym
   ```

   If [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") is not linked statically, use the following command instead:

   ```sql
   $> nm -D -n libexec/mysqld > /tmp/mysqld.sym
   ```

   If you want to decode C++ symbols, use the `--demangle`, if available, to **nm**. If your version of **nm** does not have this option, you must use the **c++filt** command after the stack dump has been produced to demangle the C++ names.

3. Execute the following command:

   ```sql
   $> resolve_stack_dump -s /tmp/mysqld.sym -n mysqld.stack
   ```

   If you were not able to include demangled C++ names in your symbol file, process the [**resolve\_stack\_dump**](resolve-stack-dump.html "4.7.3 resolve_stack_dump — Resolve Numeric Stack Trace Dump to Symbols") output using **c++filt**:

   ```sql
   $> resolve_stack_dump -s /tmp/mysqld.sym -n mysqld.stack | c++filt
   ```

   This prints out where [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") died. If that does not help you find out why [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") died, you should create a bug report and include the output from the preceding command with the bug report.

   However, in most cases it does not help us to have just a stack trace to find the reason for the problem. To be able to locate the bug or provide a workaround, in most cases we need to know the statement that killed [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") and preferably a test case so that we can repeat the problem! See [Section 1.5, “How to Report Bugs or Problems”](bug-reports.html "1.5 How to Report Bugs or Problems").

Newer versions of `glibc` stack trace functions also print the address as relative to the object. On `glibc`-based systems (Linux), the trace for an unexpected exit within a plugin looks something like:

```sql
plugin/auth/auth_test_plugin.so(+0x9a6)[0x7ff4d11c29a6]
```

To translate the relative address (`+0x9a6`) into a file name and line number, use this command:

```sql
$> addr2line -fie auth_test_plugin.so 0x9a6
auth_test_plugin
mysql-trunk/plugin/auth/test_plugin.c:65
```

The **addr2line** utility is part of the `binutils` package on Linux.

On Solaris, the procedure is similar. The Solaris `printstack()` already prints relative addresses:

```sql
plugin/auth/auth_test_plugin.so:0x1510
```

To translate, use this command:

```sql
$> gaddr2line -fie auth_test_plugin.so 0x1510
mysql-trunk/plugin/auth/test_plugin.c:88
```

Windows already prints the address, function name and line:

```sql
000007FEF07E10A4 auth_test_plugin.dll!auth_test_plugin()[test_plugin.c:72]
```
