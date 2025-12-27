#### 17.6.3.6 Moving Tablespace Files While the Server is Offline

The `innodb_directories` variable, which defines directories to scan at startup for tablespace files, supports moving or restoring tablespace files to a new location while the server is offline. During startup, discovered tablespace files are used instead those referenced in the data dictionary, and the data dictionary is updated to reference the relocated files. If duplicate tablespace files are discovered by the scan, startup fails with an error indicating that multiple files were found for the same tablespace ID.

The directories defined by the `innodb_data_home_dir`, `innodb_undo_directory`, and `datadir` variables are automatically appended to the `innodb_directories` argument value. These directories are scanned at startup regardless of whether an `innodb_directories` setting is specified explicitly. The implicit addition of these directories permits moving system tablespace files, the data directory, or undo tablespace files without configuring the `innodb_directories` setting. However, settings must be updated when directories change. For example, after relocating the data directory, you must update the `--datadir` setting before restarting the server.

The `innodb_directories` variable can be specified in a startup command or MySQL option file. Quotes are used around the argument value because a semicolon (;) is interpreted as a special character by some command interpreters. (Unix shells treat it as a command terminator, for example.)

Startup command:

```
mysqld --innodb-directories="directory_path_1;directory_path_2"
```

MySQL option file:

```
[mysqld]
innodb_directories="directory_path_1;directory_path_2"
```

The following procedure is applicable to moving individual file-per-table and general tablespace files, system tablespace files, undo tablespace files, or the data directory. Before moving files or directories, review the usage notes that follow.

1. Stop the server.
2. Move the tablespace files or directories to the desired location.

3. Make the new directory known to `InnoDB`.

   * If moving individual file-per-table or general tablespace files, add unknown directories to the `innodb_directories` value.

     + The directories defined by the `innodb_data_home_dir`, `innodb_undo_directory`, and `datadir` variables are automatically appended to the `innodb_directories` argument value, so you need not specify these.

     + A file-per-table tablespace file can only be moved to a directory with same name as the schema. For example, if the `actor` table belongs to the `sakila` schema, then the `actor.ibd` data file can only be moved to a directory named `sakila`.

     + General tablespace files cannot be moved to the data directory or a subdirectory of the data directory.

   * If moving system tablespace files, undo tablespaces, or the data directory, update the `innodb_data_home_dir`, `innodb_undo_directory`, and `datadir` settings, as necessary.

4. Restart the server.

##### Usage Notes

* Wildcard expressions cannot be used in the `innodb_directories` argument value.

* The `innodb_directories` scan also traverses subdirectories of specified directories. Duplicate directories and subdirectories are discarded from the list of directories to be scanned.

* `innodb_directories` supports moving `InnoDB` tablespace files. Moving files that belong to a storage engine other than `InnoDB` is not supported. This restriction also applies when moving the entire data directory.

* `innodb_directories` supports renaming of tablespace files when moving files to a scanned directory. It also supports moving tablespaces files to other supported operating systems.

* When moving tablespace files to a different operating system, ensure that tablespace file names do not include prohibited characters or characters with a special meaning on the destination system.

* When moving a data directory from a Windows operating system to a Linux operating system, modify the binary log file paths in the binary log index file to use backward slashes instead of forward slashes. By default, the binary log index file has the same base name as the binary log file, with the extension '`.index`'. The location of the binary log index file is defined by `--log-bin`. The default location is the data directory.

* If moving tablespace files to a different operating system introduces cross-platform replication, it is the database administrator's responsibility to ensure proper replication of DDL statements that contain platform-specific directories. Statements that permit specifying directories include `CREATE TABLE ... DATA DIRECTORY` and `CREATE TABLESPACE ... ADD DATAFILE`.

* Add the directories of file-per-table and general tablespaces created with an absolute path or in a location outside of the data directory to the `innodb_directories` setting. Otherwise, `InnoDB` is not able to locate the files during recovery. For related information, see Tablespace Discovery During Crash Recovery.

  To view tablespace file locations, query the Information Schema `FILES` table:

  ```
  mysql> SELECT TABLESPACE_NAME, FILE_NAME FROM INFORMATION_SCHEMA.FILES \G
  ```
