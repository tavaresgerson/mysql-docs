#### 20.8.3.1 Online Upgrade Considerations

When upgrading an online group you should consider the following points:

* Regardless of the way which you upgrade your group, it is important to disable any writes to group members until they are ready to rejoin the group.

* When a member is stopped, the `super_read_only` variable is set to on automatically, but this change is not persisted.

* When MySQL 5.7.22 or MySQL 8.0.11 tries to join a group running MySQL 5.7.21 or lower it fails to join the group because MySQL 5.7.21 does not send its value of `lower_case_table_names`.
