### 14.1.5 Turning Off InnoDB

Oracle recommends `InnoDB` as the preferred storage engine for typical database applications, from single-user wikis and blogs running on a local system, to high-end applications pushing the limits of performance. In MySQL 5.7, `InnoDB` is the default storage engine for new tables.

Important

`InnoDB` cannot be disabled. The `--skip-innodb` option is deprecated and has no effect, and its use results in a warning. Expect it to be removed in a future MySQL release. This also applies to its synonyms (`--innodb=OFF`, `--disable-innodb`, and so forth).
