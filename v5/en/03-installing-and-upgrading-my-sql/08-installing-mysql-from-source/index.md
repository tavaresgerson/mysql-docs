## 2.8 Installing MySQL from Source

2.8.1 Source Installation Methods

2.8.2 Source Installation Prerequisites

2.8.3 MySQL Layout for Source Installation

2.8.4 Installing MySQL Using a Standard Source Distribution

2.8.5 Installing MySQL Using a Development Source Tree

2.8.6 Configuring SSL Library Support

2.8.7 MySQL Source-Configuration Options

2.8.8 Dealing with Problems Compiling MySQL

2.8.9 MySQL Configuration and Third-Party Tools

Building MySQL from the source code enables you to customize build parameters, compiler optimizations, and installation location. For a list of systems on which MySQL is known to run, see <https://www.mysql.com/support/supportedplatforms/database.html>.

Before you proceed with an installation from source, check whether Oracle produces a precompiled binary distribution for your platform and whether it works for you. We put a great deal of effort into ensuring that our binaries are built with the best possible options for optimal performance. Instructions for installing binary distributions are available in Section 2.2, “Installing MySQL on Unix/Linux Using Generic Binaries”.

If you are interested in building MySQL from a source distribution using build options the same as or similar to those use by Oracle to produce binary distributions on your platform, obtain a binary distribution, unpack it, and look in the `docs/INFO_BIN` file, which contains information about how that MySQL distribution was configured and compiled.

Warning

Building MySQL with nonstandard options may lead to reduced functionality, performance, or security.
