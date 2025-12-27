### 2.1.4 Verifying Package Integrity Using MD5 Checksums or GnuPG

2.1.4.1 Verifying the MD5 Checksum

2.1.4.2 Signature Checking Using GnuPG

2.1.4.3 Signature Checking Using Gpg4win for Windows

2.1.4.4 Signature Checking Using RPM

2.1.4.5 GPG Public Build Key for Archived Packages

After downloading the MySQL package that suits your needs and before attempting to install it, make sure that it is intact and has not been tampered with. There are three means of integrity checking:

* MD5 checksums
* Cryptographic signatures using `GnuPG`, the GNU Privacy Guard

* For RPM packages, the built-in RPM integrity verification mechanism

The following sections describe how to use these methods.

If you notice that the MD5 checksum or GPG signatures do not match, first try to download the respective package one more time, perhaps from another mirror site.
