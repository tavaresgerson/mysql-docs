#### 25.6.15.25 The ndbinfo dict\_obj\_info Table

The `dict_obj_info` table provides information
about `NDB` data dictionary
([`DICT`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbdict.html)) objects such as
tables and indexes. (The
[`dict_obj_types`](mysql-cluster-ndbinfo-dict-obj-types.html "25.6.15.27 The ndbinfo dict_obj_types Table") table can be
queried for a list of all the types.) This information includes
the object's type, state, parent object (if any), and fully
qualified name.

The `dict_obj_info` table contains the
following columns:

* `type`

  Type of [`DICT`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbdict.html) object;
  join on [`dict_obj_types`](mysql-cluster-ndbinfo-dict-obj-types.html "25.6.15.27 The ndbinfo dict_obj_types Table") to
  obtain the name

* `id`

  Object identifier; for Disk Data undo log files and data
  files, this is the same as the value shown in the
  `LOGFILE_GROUP_NUMBER` column of the
  Information Schema [`FILES`](information-schema-files-table.html "28.3.15 The INFORMATION_SCHEMA FILES Table") table;
  for undo log files, it also the same as the value shown for
  the `log_id` column in the
  `ndbinfo`
  [`logbuffers`](mysql-cluster-ndbinfo-logbuffers.html "25.6.15.43 The ndbinfo logbuffers Table") and
  [`logspaces`](mysql-cluster-ndbinfo-logspaces.html "25.6.15.44 The ndbinfo logspaces Table") tables

* `version`

  Object version

* `state`

  Object state; see [Object::State](/doc/ndbapi/en/ndb-object.html#ndb-object-state) for
  values and descriptions.

* `parent_obj_type`

  Parent object's type (a
  `dict_obj_types` type ID); 0 indicates that
  the object has no parent

* `parent_obj_id`

  Parent object ID (such as a base table); 0 indicates that
  the object has no parent

* `fq_name`

  Fully qualified object name; for a table, this has the form
  `database_name/def/table_name`,
  for a primary key, the form is
  `sys/def/table_id/PRIMARY`,
  and for a unique key it is
  `sys/def/table_id/uk_name$unique`