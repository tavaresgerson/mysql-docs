#### 10.12.3.3 Enabling Large Page Support

Some hardware and operating system architectures support memory pages greater than the default (usually 4KB). The actual implementation of this support depends on the underlying hardware and operating system. Applications that perform a lot of memory accesses may obtain performance improvements by using large pages due to reduced Translation Lookaside Buffer (TLB) misses.

In MySQL, large pages can be used by `InnoDB`, to allocate memory for its buffer pool and additional memory pool.

Standard use of large pages in MySQL attempts to use the largest size supported, up to 4MB. Under Solaris, a “super large pages” feature enables uses of pages up to 256MB. This feature is available for recent SPARC platforms. It can be enabled or disabled by using the `--super-large-pages` or `--skip-super-large-pages` option.

MySQL also supports the Linux implementation of large page support (which is called HugeTLB in Linux).

Before large pages can be used on Linux, the kernel must be enabled to support them and it is necessary to configure the HugeTLB memory pool. For reference, the HugeTBL API is documented in the `Documentation/vm/hugetlbpage.txt` file of your Linux sources.

The kernels for some recent systems such as Red Hat Enterprise Linux may have the large pages feature enabled by default. To check whether this is true for your kernel, use the following command and look for output lines containing “huge”:

```
$> grep -i huge /proc/meminfo
AnonHugePages:   2658304 kB
ShmemHugePages:        0 kB
HugePages_Total:       0
HugePages_Free:        0
HugePages_Rsvd:        0
HugePages_Surp:        0
Hugepagesize:       2048 kB
Hugetlb:               0 kB
```

The nonempty command output indicates that large page support is present, but the zero values indicate that no pages are configured for use.

If your kernel needs to be reconfigured to support large pages, consult the `hugetlbpage.txt` file for instructions.

Assuming that your Linux kernel has large page support enabled, configure it for use by MySQL using the following steps:

1. Determine the number of large pages needed. This is the size of the InnoDB buffer pool divided by the large page size, which we can calculate as `innodb_buffer_pool_size` / `Hugepagesize`. Assuming the default value for the `innodb_buffer_pool_size` (128MB) and using the `Hugepagesize` value obtained from `/proc/meminfo` (2MB), this is 128MB / 2MB, or 64 Huge Pages. We call this value *`P`*.
2. As system root, open the file `/etc/sysctl.conf` in a text editor, and add the line shown here, where *`P`* is the number of large pages obtained in the previous step:

   ```
   vm.nr_hugepages=P
   ```

   Using the actual value obtained previously, the additional line should look like this:

   ```
   vm.nr_hugepages=66
   ```

   Save the updated file.
3. As system root, run the following command:

   ```
   $> sudo sysctl -p
   ```

   ::: info Note

   On some systems the large pages file may be named slightly differently; for example, some distributions call it `nr_hugepages`. In the event **sysctl** returns an error relating to the file name, check the name of the corresponding file in `/proc/sys/vm` and use that instead.


   :::

   To verify the large page configuration, check `/proc/meminfo` again as described previously. Now you should see some additional nonzero values in the output, similar to this:

   ```
   $> grep -i huge /proc/meminfo
   AnonHugePages:   2686976 kB
   ShmemHugePages:        0 kB
   HugePages_Total:     233
   HugePages_Free:      233
   HugePages_Rsvd:        0
   HugePages_Surp:        0
   Hugepagesize:       2048 kB
   Hugetlb:          477184 kB
   ```
4. Optionally, you may wish to compact the Linux VM. You can do this using a sequence of commands, possibly in a script file, similar to what is shown here:

   ```
   sync
   sync
   sync
   echo 3 > /proc/sys/vm/drop_caches
   echo 1 > /proc/sys/vm/compact_memory
   ```

   See your operating platform documentation for more information about how to do this.
5. Check any configuration files such as `my.cnf` used by the server, and make sure that `innodb_buffer_pool_chunk_size` is set larger than the huge page size. The default for this variable is 128M.
6. Large page support in the MySQL server is disabled by default. To enable it, start the server with `--large-pages`. You can also do so by adding the following line to the `[mysqld]` section of the server `my.cnf` file:

   ```
   large-pages=ON
   ```

   With this option enabled, `InnoDB` uses large pages automatically for its buffer pool and additional memory pool. If `InnoDB` cannot do this, it falls back to use of traditional memory and writes a warning to the error log: Warning: Using conventional memory pool.

You can verify that MySQL is now using large pages by checking `/proc/meminfo` again after restarting `mysqld`, like this:

```
$> grep -i huge /proc/meminfo
AnonHugePages:   2516992 kB
ShmemHugePages:        0 kB
HugePages_Total:     233
HugePages_Free:      222
HugePages_Rsvd:       55
HugePages_Surp:        0
Hugepagesize:       2048 kB
Hugetlb:          477184 kB
```
