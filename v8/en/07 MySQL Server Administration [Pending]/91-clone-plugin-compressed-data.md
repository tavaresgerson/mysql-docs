#### 7.6.7.6 Cloning Compressed Data

Cloning of page-compressed data is supported. The following requirements apply when cloning remote data:

* The recipient file system must support sparse files and hole punching for hole punching to occur on the recipient.
* The donor and recipient file systems must have the same block size. If file system block sizes differ, an error similar to the following is reported: ERROR 3868 (HY000): Clone Configuration FS Block Size: Donor value: 114688 is different from Recipient value: 4096.

For information about the page compression feature, see Section 17.9.2, “InnoDB Page Compression”.
