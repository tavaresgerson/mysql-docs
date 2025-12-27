### 19.5.3 Upgrading or Downgrading a Replication Topology

When you upgrade servers that participate in a replication topology, you need to take into account each server's role in the topology and look out for issues specific to replication. For general information and instructions for upgrading a MySQL Server instance, see Chapter 3, *Upgrading MySQL*.

As explained in Section 19.5.2, “Replication Compatibility Between MySQL Versions”, MySQL supports replication from an older source to a newer replica for version combinations where we support upgrades from the source version to the replica version as described at Section 1.3, “MySQL Releases: Innovation and LTS” and Section 3.2, “Upgrade Paths”, but does not support replication from a source running a later release to a replica running an earlier release. A replica at an earlier release might not have the required capability to process transactions that can be handled by the source at a later release. You must therefore upgrade all of the replicas in a replication topology to the target MySQL Server release, before you upgrade the source server to the target release. In this way you will never be in the situation where a replica still at the earlier release is attempting to handle transactions from a source at the later release.

In a replication topology where there are multiple sources (multi-source replication), the use of more than two MySQL Server versions is not supported, regardless of the number of source or replica MySQL servers. For example, you cannot use MySQL X.Y.1, MySQL X.Y.2, and MySQL X.Y.3 concurrently in such a setup, although you could use any two of these releases together.

#### Pre-Check Servers before Upgrade

It is possible to encounter replication difficulties when replicating from a source at an earlier release that has not yet been upgraded, to a replica at a later release that has been upgraded. This can happen if the source uses statements or relies on behavior that is no longer supported in the later release installed on the replica. You can use the MySQL Shell upgrade checker utility `util.checkForServerUpgrade()` to check MySQL 8.0 server instances for upgrade to a MySQL 8.4 release. This utility identifies configuration and stored data that is known to potentially cause upgrade problems, including features and behaviors that are no longer available in the later release. See Upgrade Checker Utility for information on the upgrade checker utility.

#### Standard Upgrade Procedure

To upgrade a replication topology, follow the instructions in Chapter 3, *Upgrading MySQL* for each individual MySQL Server instance, using this overall procedure:

1. Upgrade the replicas first. On each replica instance:

   * Carry out the preliminary checks and steps described in Section 3.6, “Preparing Your Installation for Upgrade”.

   * Shut down MySQL Server.
   * Upgrade the MySQL Server binaries or packages.
   * Restart MySQL Server.
   * MySQL Server performs the entire MySQL upgrade procedure automatically, disabling binary logging during the upgrade.

   * Restart replication using a `START REPLICA`.

2. If there are multiple layers of replicas (replicas-of-replicas) start upgrading the replicas that are farthest away from the source, performing the upgrade in a bottom-up fashion.

3. When all replicas have upgraded and only the source remains, perform a switch-over to one of the replicas. In other words, stop client updates on the source, wait for at least one replica to apply all changes, reconfigure the replication topology so that replica becomes the source and that the source is left outside the replication topology. Upgrade the old source according to the procedure for a single server, and then reinsert it into the topology.

If you need to downgrade the servers in a replication topology, the source must be downgraded before the replicas are downgraded. On the replicas, you must ensure that the binary log and relay log have been fully processed, and purge them before proceeding with the downgrade.

##### Rolling Downgrade Procedure

1. Stop the updates.
2. Wait for replicas to receive all updates. It is not necessary to wait for them to apply all changes. If they have not applied all changes, leave their applier running so they can process the received transactions in the background.

3. Downgrade the source server, following the instructions for single server downgrade.

4. Insert the downgraded source server in the topology again.
5. Allow updates again.
6. Wait until all replicas have applied all remaining transactions from the previous primary.

7. For each replica, take out the replica from the topology, wait for it to apply all its relay log, downgrade it following the instructions for a single server downgrade, and reinsert it back into the topology. If there are multiple levels of replicas (replicas-of-replicas) then downgrade top-down starting with the replicas nearest to the source server.
