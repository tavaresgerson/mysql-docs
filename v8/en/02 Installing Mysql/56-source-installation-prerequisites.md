### 2.8.2 Source Installation Prerequisites

Installation of MySQL from source requires several development tools. Some of these tools are needed no matter whether you use a standard source distribution or a development source tree. Other tool requirements depend on which installation method you use.

To install MySQL from source, the following system requirements must be satisfied, regardless of installation method:

* `CMake`, which is used as the build framework on all platforms. `CMake` can be downloaded from <http://www.cmake.org>.
* A good `make` program. Although some platforms come with their own `make` implementations, it is highly recommended that you use GNU `make` 3.75 or later. It may already be available on your system as `gmake`. GNU `make` is available from <http://www.gnu.org/software/make/>.

  On Unix-like systems, including Linux, you can check your system's version of `make` like this:

  ```
  $> make --version
  GNU Make 4.2.1
  ```
* MySQL 8.4 source code permits use of `C++17` features. To enable the necessary level of `C++17` support across all supported platforms, the following minimum compiler versions apply:

  + Linux: GCC 10 or Clang 12
  + macOS: XCode 10
  + Solaris: (*Prior to MySQL 8.4.4*) GCC 10; (*MySQL 8.4.4 and later*) GCC 11.4
  + Windows: Visual Studio 2019
* Building MySQL on Windows requires Windows version 10 or later. (MySQL binaries built on recent versions of Windows can generally be run on older versions.) You can determine the Windows version by executing **`WMIC.exe os` get version** in the Windows Command Prompt.
* The MySQL C API requires a C++ or C99 compiler to compile.
* An SSL library is required for support of encrypted connections, entropy for random number generation, and other encryption-related operations. By default, the build uses the OpenSSL library installed on the host system. To specify the library explicitly, use the `WITH_SSL` option when you invoke `CMake`. For additional information, see Section 2.8.6, “Configuring SSL Library Support”.
* The Boost C++ libraries are required to build MySQL (but not to use it). In MySQL 8.3 and later, these libraries are always bundled with the MySQL source.
* The ncurses library.
* Sufficient free memory. If you encounter build errors such as internal compiler error when compiling large source files, it may be that you have too little memory. If compiling on a virtual machine, try increasing the memory allocation.
* Perl is needed if you intend to run test scripts. Most Unix-like systems include Perl. For Windows, you can use [ActiveState Perl](https://www.activestate.com/products/perl/). or [Strawberry Perl](https://strawberryperl.com/).

To install MySQL from a standard source distribution, one of the following tools is required to unpack the distribution file:

* For a `.tar.gz` compressed `tar` file: GNU `gunzip` to uncompress the distribution and a reasonable `tar` to unpack it. If your `tar` program supports the `z` option, it can both uncompress and unpack the file.

  GNU `tar` is known to work. The standard `tar` provided with some operating systems is not able to unpack the long file names in the MySQL distribution. You should download and install GNU `tar`, or if available, use a preinstalled version of GNU tar. Usually this is available as `gnutar`, `gtar`, or as `tar` within a GNU or Free Software directory, such as `/usr/sfw/bin` or `/usr/local/bin`. GNU `tar` is available from <https://www.gnu.org/software/tar/>.
* For a `.zip` Zip archive: `WinZip` or another tool that can read `.zip` files.
* For an `.rpm` RPM package: The `rpmbuild` program used to build the distribution unpacks it.

To install MySQL from a development source tree, the following additional tools are required:

* The Git revision control system is required to obtain the development source code. GitHub Help provides instructions for downloading and installing Git on different platforms.
* `bison` 2.1 or later, available from <http://www.gnu.org/software/bison/>. (Version 1 is no longer supported.) Use the latest version of `bison` where possible; if you experience problems, upgrade to a later version, rather than revert to an earlier one.

  `bison` is available from <http://www.gnu.org/software/bison/>. `bison` for Windows can be downloaded from <http://gnuwin32.sourceforge.net/packages/bison.htm>. Download the package labeled “Complete package, excluding sources”. On Windows, the default location for `bison` is the `C:\Program Files\GnuWin32` directory. Some utilities may fail to find `bison` because of the space in the directory name. Also, Visual Studio may simply hang if there are spaces in the path. You can resolve these problems by installing into a directory that does not contain a space (for example `C:\GnuWin32`).
* On Solaris Express, `m4` must be installed in addition to `bison`. `m4` is available from <http://www.gnu.org/software/m4/>. 

::: info Note

If you have to install any programs, modify your `PATH` environment variable to include any directories in which the programs are located.

:::

If you run into problems and need to file a bug report, please use the instructions in  Section 1.6, “How to Report Bugs or Problems”.
