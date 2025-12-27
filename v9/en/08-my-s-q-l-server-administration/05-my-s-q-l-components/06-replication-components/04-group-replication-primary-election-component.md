#### 7.5.6.4 Group Replication Primary Election Component

The Group Replication Primary Election component is available as part of MySQL Enterprise Edition.

* Purpose: On failover, when in single-primary mode, use replication group member most-up-to-date status as a criterion for selection of the new primary.

* URN: `file://component_group_replication_elect_prefers_most_updated`

Prior to installing the Group Replication Primary Election component, the Group Replication plugin must be installed using `INSTALL PLUGIN` or `--plugin-load-add` (see Section 20.2.1.2, “Configuring an Instance for Group Replication”); otherwise, the `INSTALL COMPONENT` statement is rejected with an error. If you attempt to uninstall the Group Replication plugin when the Group Replication Primary Election component is installed, `UNINSTALL PLUGIN` fails with the error Plugin 'group\_replication' cannot be uninstalled now. Please uninstall the component 'component\_group\_replication\_elect\_prefers\_most\_updated' and then UNINSTALL PLUGIN group\_replication.

Once these conditions are met, the Group Replication Primary Election component can be installed and uninstalled using `INSTALL COMPONENT` and `UNINSTALL COMPONENT`, respectively. See the descriptions of these statements, as well as Section 7.5.1, “Installing and Uninstalling Components”, for more information.

To enable the component, set the `group_replication_elect_prefers_most_updated.enabled` system variable to `ON`, on each replication group member. This means that, on failover, the component chooses as the new primary the secondary which is most up to date, based on how many transactions are in the secondary's backlog; the secondary with the smallest backlog (fewest transactions behind) is chosen as the new primary.

In order for most-up-to-date selection to work, the Group Replication Primary Election component must be installed on all group members; `group_replication_elect_prefers_most_updated.enabled` must be `ON` for each group member as well. If the component is not available, or if there is no one secondary that is the most up to date, weighted selection is used; in the event of matching greatest weights, the server with the lowest UUID (in lexical order) is promoted to primary.

**Status variables.** The Group Replication Primary Election component provides two status variables, listed here, for use in monitoring:

* `Gr_latest_primary_election_by_most_uptodate_members_trx_delta`: When a new primary is chosen using most-up-to-date selection, this is the difference in transactions processed by the new primary and by the most up to date secondary.

* `Gr_latest_primary_election_by_most_uptodate_member_timestamp`: This timestamp is set whenever a new primary is elected using the most-up-to-date method.

The values of these status variables are reset in the event of installation or uninstallation of the component, on group bootstrap, whenever a member joins the group (including automatic rejoin), and on server restart.

**Logging.** When primary selection on failover uses the most-up-to-date method, the component writes a message to the log similar to that shown here, announcing the change, identifying the new primary, and providing the number of transactions which need to be applied from the backlog:

```
ER_GRP_PRIMARY_ELECTION_METHOD_MOST_UPDATE
2024-10-08T16:07:48.100736Z 0 [Note] [MY-015562] [Server] Plugin
group_replication reported: 'Group Replication Primary Election:
Member with uuid 8a94f357-aab4-11df-86ab-c80aa9420000  was elected
primary since it was the most up-to-date member with 100 transactions
more than second most up-to-date member
8a94f468-aab4-11df-86ab-c80aa9420000. In case of a tie member weight and
then uuid lexical order was used over the most updated members.'
```

When primary selection uses member weight order, the component writes a log message announcing the change, identifying the new primary by UUID, and its weight value. The message is similar to that shown here:

```
ER_GRP_PRIMARY_ELECTION_METHOD_MEMBER_WEIGHT
2024-10-08T16:07:48.100736Z 0 [Note] [MY-015563] [Server] Plugin
group_replication reported: 'Group Replication Primary Election:
Member with uuid 8a94f357-aab4-11df-86ab-c80aa9420000 was elected
primary since it was highest weight member with value 70. In case
of a tie uuid lexical order was used.'
```
