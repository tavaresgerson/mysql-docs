### 2.1.2 Which MySQL Version and Distribution to Install

When preparing to install MySQL, decide which version and distribution format (binary or source) to use.

First, decide whether to install from an LTS series like MySQL 8.4, or install from an Innovation series like MySQL 9.5. Both tracks include bug fixes while innovation releases includes the latest new features and changes. For additional details, see Section 1.3, “MySQL Releases: Innovation and LTS”.

The naming scheme in MySQL 9.5 uses release names that consist of three numbers and an optional suffix (for example, **mysql-9.0.0**). The numbers within the release name are interpreted as follows:

* The first number (**9**) is the major version number.

* The second number (**0**) is the minor version number. The minor version number does not change for an LTS series, but it does change for an Innovation series.

* The third number (**0**) is the version number within a series. This is incremented for each new LTS release, but is likely always 0 for innovation releases.

After choosing which MySQL version to install, decide which distribution format to install for your operating system. For most use cases, a binary distribution is the right choice. Binary distributions are available in native format for many platforms, such as RPM packages for Linux or DMG packages for macOS. Distributions are also available in more generic formats such as Zip archives or compressed **tar** files. On Windows, you might use an MSI to install a binary distribution.

Under some circumstances, it may be preferable to install MySQL from a source distribution:

* You want to install MySQL at some explicit location. The standard binary distributions are ready to run at any installation location, but you might require even more flexibility to place MySQL components where you want.

* You want to configure **mysqld** with features that might not be included in the standard binary distributions. Here is a list of the most common extra options used to ensure feature availability:

  + `-DWITH_LIBWRAP=1` for TCP wrappers support.

  + `-DWITH_ZLIB={system|bundled}` for features that depend on compression

  + `-DWITH_DEBUG=1` for debugging support

  For additional information, see Section 2.8.7, “MySQL Source-Configuration Options”.

* You want to configure **mysqld** without some features that are included in the standard binary distributions.

* You want to read or modify the C and C++ code that makes up MySQL. For this purpose, obtain a source distribution.

* Source distributions contain more tests and examples than binary distributions.
