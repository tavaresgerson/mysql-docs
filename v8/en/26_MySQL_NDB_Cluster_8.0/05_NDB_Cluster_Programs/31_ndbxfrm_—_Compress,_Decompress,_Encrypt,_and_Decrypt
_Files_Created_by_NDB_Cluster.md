### 25.5.31 ndbxfrm — Compress, Decompress, Encrypt, and Decrypt Files Created by NDB Cluster

The **ndbxfrm** utility, introduced in NDB 8.0.22, can be used to decompress, decrypt, and output information about files created by NDB Cluster that are compressed, encrypted, or both. It can also be used to compress or encrypt files.

**Table 25.52 Command-line options used with the program ndbxfrm**

<table frame="box" rules="all"><thead><tr> <th scope="col">Format</th> <th scope="col">Description</th> <th scope="col">Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th><p> <code>--compress</code>, </p><p> <code> -c </code> </p></th> <td>Compress file</td> <td><p> ADDED: NDB 8.0.22 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --decrypt-key=key </code> </p></th> <td>Supply file decryption key</td> <td><p> ADDED: NDB 8.0.31 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --decrypt-key-from-stdin </code> </p></th> <td>Supply file decryption key from stdin</td> <td><p> ADDED: NDB 8.0.31 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --decrypt-password=password </code> </p></th> <td>Use this password to decrypt file</td> <td><p> ADDED: NDB 8.0.22 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --decrypt-password-from-stdin </code> </p></th> <td>Get decryption password in a secure fashion from STDIN</td> <td><p> ADDED: NDB 8.0.24 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-extra-file=path </code> </p></th> <td>Read given file after global files are read</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-group-suffix=string </code> </p></th> <td>Also read groups with concat(group, suffix)</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-file=path </code> </p></th> <td>Read default options from given file only</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --encrypt-block-size=# </code> </p></th> <td>Print info about file including file header and trailer</td> <td><p> ADDED: NDB 8.0.31 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --encrypt-block-size=# </code> </p></th> <td>Size of input data chunks encrypted as a unit. Used with XTS, set to zero for CBC mode</td> <td><p> ADDED: NDB 8.0.29 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --encrypt-cipher=# </code> </p></th> <td>Encryption cipher: 1 for CBC, 2 for XTS</td> <td><p> ADDED: NDB 8.0.29 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--encrypt-kdf-iter-count=#</code>, </p><p> <code> <a class="link" href="mysql-cluster-programs-ndbxfrm.html#option_ndbxfrm_encrypt-kdf-iter-count">-k
                #</a> </code> </p></th> <td>Number of iterations used in key definition</td> <td><p> ADDED: NDB 8.0.22 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --encrypt-key=key </code> </p></th> <td>Use this key to encrypt file</td> <td><p> ADDED: NDB 8.0.31 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --encrypt-key-from-stdin </code> </p></th> <td>Use key supplied from stdin to encrypt file</td> <td><p> ADDED: NDB 8.0.31 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --encrypt-password=password </code> </p></th> <td>Use this password to encrypt file</td> <td><p> ADDED: NDB 8.0.22 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --encrypt-password-from-stdin </code> </p></th> <td>Get encryption password in a secure fashion from STDIN</td> <td><p> ADDED: NDB 8.0.24 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--help</code>, </p><p> <code> -? </code> </p></th> <td>Print usage information</td> <td><p> ADDED: NDB 8.0.22 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--info</code>, </p><p> <code> -i </code> </p></th> <td>Print file information</td> <td><p> ADDED: NDB 8.0.22 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --login-path=path </code> </p></th> <td>Read given path from login file</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --no-defaults </code> </p></th> <td>Do not read default options from any option file other than login file</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --print-defaults </code> </p></th> <td>Print program argument list and exit</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--usage</code>, </p><p> <code> -? </code> </p></th> <td>Prints usage information; synonym for --help</td> <td><p> ADDED: NDB 8.0.22 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--version</code>, </p><p> <code> -V </code> </p></th> <td>Output version information</td> <td><p> ADDED: NDB 8.0.22 </p></td> </tr></tbody></table>

#### Usage

```
ndbxfrm --info file[ file ...]

ndbxfrm --compress input_file output_file

ndbxfrm --decrypt-password=password input_file output_file

ndbxfrm [--encrypt-ldf-iter-count=#] --encrypt-password=password input_file output_file
```

*`input_file`* and *`output_file`* cannot be the same file.

#### Options

* `--compress`, `-c`

  <table summary="Properties for compress"><tbody><tr><th>Command-Line Format</th> <td><code>--compress</code></td> </tr><tr><th>Introduced</th> <td>8.0.22-ndb-8.0.22</td> </tr></tbody></table>

  Compresses the input file, using the same compression method as is used for compressing NDB Cluster backups, and writes the output to an output file. To decompress a compressed `NDB` backup file that is not encrypted, it is necessary only to invoke **ndbxfrm** using the names of the compressed file and an output file (with no options required).

* `--decrypt-key=key`, `-K` *`key`*

  <table summary="Properties for decrypt-key"><tbody><tr><th>Command-Line Format</th> <td><code>--decrypt-key=key</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>

  Decrypts a file encrypted by `NDB` using the supplied key.

  Note

  This option cannot be used together with `--decrypt-password`.

* `--decrypt-key-from-stdin`

  <table summary="Properties for decrypt-key-from-stdin"><tbody><tr><th>Command-Line Format</th> <td><code>--decrypt-key-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>

  Decrypts a file encrypted by `NDB` using the key supplied from `stdin`.

* `--decrypt-password=password`

  <table summary="Properties for decrypt-password"><tbody><tr><th>Command-Line Format</th> <td><code>--decrypt-password=password</code></td> </tr><tr><th>Introduced</th> <td>8.0.22-ndb-8.0.22</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Decrypts a file encrypted by `NDB` using the password supplied.

  Note

  This option cannot be used together with `--decrypt-key`.

* `--decrypt-password-from-stdin[=TRUE|FALSE]`

  <table summary="Properties for decrypt-password-from-stdin"><tbody><tr><th>Command-Line Format</th> <td><code>--decrypt-password-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>

  Decrypts a file encrypted by `NDB`, using a password supplied from standard input. This is similar to entering a password after invoking **mysql** `--password` with no password following the option.

* `--defaults-extra-file`

  <table summary="Properties for defaults-extra-file"><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Read given file after global files are read.

* `--defaults-file`

  <table summary="Properties for defaults-file"><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Read default options from given file only.

* `--defaults-group-suffix`

  <table summary="Properties for defaults-group-suffix"><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-group-suffix=string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Also read groups with `CONCAT(group, suffix)`.

* `--detailed-info`

  <table summary="Properties for detailed-info"><tbody><tr><th>Command-Line Format</th> <td><code>--encrypt-block-size=#</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Print out file information like `--info`, but include the file's header and trailer.

  Example:

  ```
  $> ndbxfrm --detailed-info S0.sysfile
  File=/var/lib/cluster-data/ndb_7_fs/D1/NDBCNTR/S0.sysfile, compression=no, encryption=yes
  header: {
    fixed_header: {
      magic: {
        magic: { 78, 68, 66, 88, 70, 82, 77, 49 },
        endian: 18364758544493064720,
        header_size: 32768,
        fixed_header_size: 160,
        zeros: { 0, 0 }
      },
      flags: 73728,
      flag_extended: 0,
      flag_zeros: 0,
      flag_file_checksum: 0,
      flag_data_checksum: 0,
      flag_compress: 0,
      flag_compress_method: 0,
      flag_compress_padding: 0,
      flag_encrypt: 18,
      flag_encrypt_cipher: 2,
      flag_encrypt_krm: 1,
      flag_encrypt_padding: 0,
      flag_encrypt_key_selection_mode: 0,
      dbg_writer_ndb_version: 524320,
      octets_size: 32,
      file_block_size: 32768,
      trailer_max_size: 80,
      file_checksum: { 0, 0, 0, 0 },
      data_checksum: { 0, 0, 0, 0 },
      zeros01: { 0 },
      compress_dbg_writer_header_version: { ... },
      compress_dbg_writer_library_version: { ... },
      encrypt_dbg_writer_header_version: { ... },
      encrypt_dbg_writer_library_version: { ... },
      encrypt_key_definition_iterator_count: 100000,
      encrypt_krm_keying_material_size: 32,
      encrypt_krm_keying_material_count: 1,
      encrypt_key_data_unit_size: 32768,
      encrypt_krm_keying_material_position_in_octets: 0,
    },
    octets: {
       102, 68, 56, 125, 78, 217, 110, 94, 145, 121, 203, 234, 26, 164, 137, 180,
       100, 224, 7, 88, 173, 123, 209, 110, 185, 227, 85, 174, 109, 123, 96, 156,
    }
  }
  trailer: {
    fixed_trailer: {
      flags: 48,
      flag_extended: 0,
      flag_zeros: 0,
      flag_file_checksum: 0,
      flag_data_checksum: 3,
      data_size: 512,
      file_checksum: { 0, 0, 0, 0 },
      data_checksum: { 226, 223, 102, 207 },
      magic: {
        zeros: { 0, 0 }
        fixed_trailer_size: 56,
        trailer_size: 32256,
        endian: 18364758544493064720,
        magic: { 78, 68, 66, 88, 70, 82, 77, 49 },
      },
    }
  }
  ```

* `--encrypt-block-size=#`

  <table summary="Properties for compress"><tbody><tr><th>Command-Line Format</th> <td><code>--compress</code></td> </tr><tr><th>Introduced</th> <td>8.0.22-ndb-8.0.22</td> </tr></tbody></table>0

  Size of input data chunks that are encrypted as a unit. Used with XTS; set to `0` (the default) for CBC mode.

* `--encrypt-cipher=#`

  <table summary="Properties for compress"><tbody><tr><th>Command-Line Format</th> <td><code>--compress</code></td> </tr><tr><th>Introduced</th> <td>8.0.22-ndb-8.0.22</td> </tr></tbody></table>1

  Cipher used for encryption. Set to `1` for CBC mode (the default), or `2` for XTS.

* `--encrypt-kdf-iter-count=#`, `-k #`

  <table summary="Properties for compress"><tbody><tr><th>Command-Line Format</th> <td><code>--compress</code></td> </tr><tr><th>Introduced</th> <td>8.0.22-ndb-8.0.22</td> </tr></tbody></table>2

  When encrypting a file, specifies the number of iterations to use for the encryption key. Requires the `--encrypt-password` option.

* `--encrypt-key=key`

  <table summary="Properties for compress"><tbody><tr><th>Command-Line Format</th> <td><code>--compress</code></td> </tr><tr><th>Introduced</th> <td>8.0.22-ndb-8.0.22</td> </tr></tbody></table>3

  Encrypts a file using the supplied key.

  Note

  This option cannot be used together with `--encrypt-password`.

* `--encrypt-key-from-stdin`

  <table summary="Properties for compress"><tbody><tr><th>Command-Line Format</th> <td><code>--compress</code></td> </tr><tr><th>Introduced</th> <td>8.0.22-ndb-8.0.22</td> </tr></tbody></table>4

  Encrypt a file using the key supplied from `stdin`.

* `--encrypt-password=password`

  <table summary="Properties for compress"><tbody><tr><th>Command-Line Format</th> <td><code>--compress</code></td> </tr><tr><th>Introduced</th> <td>8.0.22-ndb-8.0.22</td> </tr></tbody></table>5

  Encrypts the backup file using the password supplied by the option. The password must meet the requirements listed here:

  + Uses any of the printable ASCII characters except `!`, `'`, `"`, `$`, `%`, `\`, `` ` ``, and `^`

  + Is no more than 256 characters in length
  + Is enclosed by single or double quotation marks

  Note

  This option cannot be used together with `--encrypt-key`.

* `--encrypt-password-from-stdin[=TRUE|FALSE]`

  <table summary="Properties for compress"><tbody><tr><th>Command-Line Format</th> <td><code>--compress</code></td> </tr><tr><th>Introduced</th> <td>8.0.22-ndb-8.0.22</td> </tr></tbody></table>6

  Encrypts a file using a password supplied from standard input. This is similar to entering a password is entered after invoking **mysql** `--password` with no password following the option.

* `--help`, `-?`

  <table summary="Properties for compress"><tbody><tr><th>Command-Line Format</th> <td><code>--compress</code></td> </tr><tr><th>Introduced</th> <td>8.0.22-ndb-8.0.22</td> </tr></tbody></table>7

  Prints usage information for the program.

* `--info`, `-i`

  <table summary="Properties for compress"><tbody><tr><th>Command-Line Format</th> <td><code>--compress</code></td> </tr><tr><th>Introduced</th> <td>8.0.22-ndb-8.0.22</td> </tr></tbody></table>8

  Prints the following information about one or more input files:

  + The name of the file
  + Whether the file is compressed (`compression=yes` or `compression=no`)

  + Whether the file is encrypted (`encryption=yes` or `encryption=no`)

  Example:

  ```
  $> ndbxfrm -i BACKUP-10-0.5.Data BACKUP-10.5.ctl BACKUP-10.5.log
  File=BACKUP-10-0.5.Data, compression=no, encryption=yes
  File=BACKUP-10.5.ctl, compression=no, encryption=yes
  File=BACKUP-10.5.log, compression=no, encryption=yes
  ```

  Beginning with NDB 8.0.31, you can also see the file's header and trailer using the `--detailed-info` option.

* `--login-path`

  <table summary="Properties for compress"><tbody><tr><th>Command-Line Format</th> <td><code>--compress</code></td> </tr><tr><th>Introduced</th> <td>8.0.22-ndb-8.0.22</td> </tr></tbody></table>9

  Read given path from login file.

* `--no-defaults`

  <table summary="Properties for decrypt-key"><tbody><tr><th>Command-Line Format</th> <td><code>--decrypt-key=key</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>0

  Do not read default options from any option file other than login file.

* `--print-defaults`

  <table summary="Properties for decrypt-key"><tbody><tr><th>Command-Line Format</th> <td><code>--decrypt-key=key</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>1

  Print program argument list and exit.

* `--usage`, `-?`

  <table summary="Properties for decrypt-key"><tbody><tr><th>Command-Line Format</th> <td><code>--decrypt-key=key</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>2

  Synonym for `--help`.

* `--version`, `-V`

  <table summary="Properties for decrypt-key"><tbody><tr><th>Command-Line Format</th> <td><code>--decrypt-key=key</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>3

  Prints out version information.

**ndbxfrm** can encrypt backups created by any version of NDB Cluster. The `.Data`, `.ctl`, and `.log` files comprising the backup must be encrypted separately, and these files must be encrypted separately for each data node. Once encrypted, such backups can be decrypted only by **ndbxfrm**, **ndb_restore**, or **ndb_print_backup** from NDB Cluster 8.0.22 or later.

An encrypted file can be re-encrypted with a new password using the `--encrypt-password` and `--decrypt-password` options together, like this:

```
ndbxfrm --decrypt-password=old --encrypt-password=new input_file output_file
```

In the example just shown, *`old`* and *`new`* are the old and new passwords, respectively; both of these must be quoted. The input file is decrypted and then encrypted as the output file. The input file itself is not changed; if you do not want it to be accessible using the old password, you must remove the input file manually.
