## 30.1 Prerequisites for Using the sys Schema

Before using the [`sys`](sys-schema.html "Chapter 30 MySQL sys Schema") schema, the
prerequisites described in this section must be satisfied.

Because the [`sys`](sys-schema.html "Chapter 30 MySQL sys Schema") schema provides an
alternative means of accessing the Performance Schema, the
Performance Schema must be enabled for the
[`sys`](sys-schema.html "Chapter 30 MySQL sys Schema") schema to work. See
[Section 29.3, “Performance Schema Startup Configuration”](performance-schema-startup-configuration.html "29.3 Performance Schema Startup Configuration").

For full access to the [`sys`](sys-schema.html "Chapter 30 MySQL sys Schema") schema, a
user must have these privileges:

* [`SELECT`](privileges-provided.html#priv_select) on all
  [`sys`](sys-schema.html "Chapter 30 MySQL sys Schema") tables and views

* [`EXECUTE`](privileges-provided.html#priv_execute) on all
  [`sys`](sys-schema.html "Chapter 30 MySQL sys Schema") stored procedures and
  functions

* [`INSERT`](privileges-provided.html#priv_insert) and
  [`UPDATE`](privileges-provided.html#priv_update) for the
  [`sys_config`](sys-sys-config.html "30.4.2.1 The sys_config Table") table, if changes are
  to be made to it

* Additional privileges for certain
  [`sys`](sys-schema.html "Chapter 30 MySQL sys Schema") schema stored procedures and
  functions, as noted in their descriptions (for example, the
  [`ps_setup_save()`](sys-ps-setup-save.html "30.4.4.14 The ps_setup_save() Procedure") procedure)

It is also necessary to have privileges for the objects underlying
the [`sys`](sys-schema.html "Chapter 30 MySQL sys Schema") schema objects:

* [`SELECT`](privileges-provided.html#priv_select) on any Performance
  Schema tables accessed by [`sys`](sys-schema.html "Chapter 30 MySQL sys Schema")
  schema objects, and [`UPDATE`](privileges-provided.html#priv_update) for
  any tables to be updated using
  [`sys`](sys-schema.html "Chapter 30 MySQL sys Schema") schema objects

* [`PROCESS`](privileges-provided.html#priv_process) for the
  `INFORMATION_SCHEMA`
  [`INNODB_BUFFER_PAGE`](information-schema-innodb-buffer-page-table.html "28.4.2 The INFORMATION_SCHEMA INNODB_BUFFER_PAGE Table") table

Certain Performance Schema instruments and consumers must be
enabled and (for instruments) timed to take full advantage of
[`sys`](sys-schema.html "Chapter 30 MySQL sys Schema") schema capabilities:

* All `wait` instruments
* All `stage` instruments
* All `statement` instruments
* `xxx_current` and
  `xxx_history_long`
  consumers for all events

You can use the [`sys`](sys-schema.html "Chapter 30 MySQL sys Schema") schema itself to
enable all of the additional instruments and consumers:

```
CALL sys.ps_setup_enable_instrument('wait');
CALL sys.ps_setup_enable_instrument('stage');
CALL sys.ps_setup_enable_instrument('statement');
CALL sys.ps_setup_enable_consumer('current');
CALL sys.ps_setup_enable_consumer('history_long');
```

Note

For many uses of the `sys` schema, the default
Performance Schema is sufficient for data collection. Enabling
all the instruments and consumers just mentioned has a
performance impact, so it is preferable to enable only the
additional configuration you need. Also, remember that if you
enable additional configuration, you can easily restore the
default configuration like this:

```
CALL sys.ps_setup_reset_to_default(TRUE);
```