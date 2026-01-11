#### 7.6.6.8 Directories and Files Created During a Cloning Operation

When data is cloned, the following directories and files are created for internal use. They should not be modified.

* `#clone`: Contains internal clone files used by the cloning operation. Created in the directory that data is cloned to.

* `#ib_archive`: Contains internally archived log files, archived on the donor during the cloning operation.

* `*.#clone` files: Temporary data files created on the recipient while data is removed from the recipient data directory and new data is cloned during a remote cloning operation.
