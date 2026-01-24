### 17.5.1 Deploying in Multi-Primary or Single-Primary Mode

[17.5.1.1 Single-Primary Mode](group-replication-single-primary-mode.html)

[17.5.1.2 Multi-Primary Mode](group-replication-multi-primary-mode.html)

[17.5.1.3 Finding the Primary](group-replication-find-primary.html)

Group Replication operates in the following different modes:

* single-primary mode
* multi-primary mode

The default mode is single-primary. It is not possible to have members of the group deployed in different modes, for example one configured in multi-primary mode while another one is in single-primary mode. To switch between modes, the group and not the server, needs to be restarted with a different operating configuration. Regardless of the deployed mode, Group Replication does not handle client-side fail-over, that must be handled by the application itself, a connector or a middleware framework such as a proxy or [MySQL Router 8.0](/doc/mysql-router/8.0/en/).

When deployed in multi-primary mode, statements are checked to ensure they are compatible with the mode. The following checks are made when Group Replication is deployed in multi-primary mode:

* If a transaction is executed under the SERIALIZABLE isolation level, then its commit fails when synchronizing itself with the group.

* If a transaction executes against a table that has foreign keys with cascading constraints, then the transaction fails to commit when synchronizing itself with the group.

These checks can be deactivated by setting the option [`group_replication_enforce_update_everywhere_checks`](group-replication-system-variables.html#sysvar_group_replication_enforce_update_everywhere_checks) to `FALSE`. When deploying in single-primary mode, this option *must* be set to `FALSE`.
