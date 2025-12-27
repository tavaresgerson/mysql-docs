### 2.8.8 Dealing with Problems Compiling MySQL

The solution to many problems involves reconfiguring. If you do reconfigure, take note of the following:

* If **CMake** is run after it has previously been run, it may use information that was gathered during its previous invocation. This information is stored in `CMakeCache.txt`. When **CMake** starts, it looks for that file and reads its contents if it exists, on the assumption that the information is still correct. That assumption is invalid when you reconfigure.

* Each time you run **CMake**, you must run **make** again to recompile. However, you may want to remove old object files from previous builds first because they were compiled using different configuration options.

To prevent old object files or configuration information from being used, run the following commands before re-running **CMake**:

On Unix:

```sql
$> make clean
$> rm CMakeCache.txt
```

On Windows:

```sql
$> devenv MySQL.sln /clean
$> del CMakeCache.txt
```

If you build outside of the source tree, remove and recreate your build directory before re-running **CMake**. For instructions on building outside of the source tree, see How to Build MySQL Server with CMake.

On some systems, warnings may occur due to differences in system include files. The following list describes other problems that have been found to occur most often when compiling MySQL:

* To define which C and C++ compilers to use, you can define the `CC` and `CXX` environment variables. For example:

  ```sql
  $> CC=gcc
  $> CXX=g++
  $> export CC CXX
  ```

  While this can be done on the command line, as just shown, you may prefer to define these values in a build script, in which case the **export** command is not needed.

  To specify your own C and C++ compiler flags, use the `CMAKE_C_FLAGS` and `CMAKE_CXX_FLAGS` CMake options. See Compiler Flags.

  To see what flags you might need to specify, invoke **mysql\_config** with the `--cflags` and `--cxxflags` options.

* To see what commands are executed during the compile stage, after using **CMake** to configure MySQL, run **make VERBOSE=1** rather than just **make**.

* If compilation fails, check whether the `MYSQL_MAINTAINER_MODE` option is enabled. This mode causes compiler warnings to become errors, so disabling it may enable compilation to proceed.

* If your compile fails with errors such as any of the following, you must upgrade your version of **make** to GNU **make**:

  ```sql
  make: Fatal error in reader: Makefile, line 18:
  Badly formed macro assignment
  ```

  Or:

  ```sql
  make: file `Makefile' line 18: Must be a separator (:
  ```

  Or:

  ```sql
  pthread.h: No such file or directory
  ```

  Solaris and FreeBSD are known to have troublesome **make** programs.

  GNU **make** 3.75 is known to work.

* The `sql_yacc.cc` file is generated from `sql_yacc.yy`. Normally, the build process does not need to create `sql_yacc.cc` because MySQL comes with a pregenerated copy. However, if you do need to re-create it, you might encounter this error:

  ```sql
  "sql_yacc.yy", line xxx fatal: default action causes potential...
  ```

  This is a sign that your version of **yacc** is deficient. You probably need to install a recent version of **bison** (the GNU version of **yacc**) and use that instead.

  Versions of **bison** older than 1.75 may report this error:

  ```sql
  sql_yacc.yy:#####: fatal error: maximum table size (32767) exceeded
  ```

  The maximum table size is not actually exceeded; the error is caused by bugs in older versions of **bison**.

For information about acquiring or updating tools, see the system requirements in Section 2.8, “Installing MySQL from Source”.
