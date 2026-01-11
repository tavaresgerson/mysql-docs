### 20.5.1 Configuring an Online Group

20.5.1.1 Changing the Primary

20.5.1.2 Changing the Group Mode

20.5.1.3 Using Group Replication Group Write Consensus

20.5.1.4 Setting a Group's Communication Protocol Version

20.5.1.5 Configuring Member Actions

You can configure an online group while Group Replication is running by using a set of functions, which rely on a group action coordinator. These functions are installed by the Group Replication plugin in version 8.0.13 and higher. This section describes how changes are made to a running group, and the available functions.

Important

For the coordinator to be able to configure group wide actions on a running group, all members must be running MySQL 8.0.13 or higher and have the functions installed.

To use the functions, connect to a member of the running group and invoke the function with the `SELECT` statement. The Group Replication plugin processes the action and its parameters and the coordinator sends it to all members which are visible to the member where you invoked the function. If the action is accepted, all members execute the action and send a termination message when completed. Once all members declare the action as finished, the invoking member returns the result to the client.

When configuring a whole group, the distributed nature of the operations means that they interact with many processes of the Group Replication plugin, and therefore you should observe the following:

**You can issue configuration operations everywhere.** If you want to make member A the new primary you do not need to invoke the operation on member A. All operations are sent and executed in a coordinated way on all group members. Also, this distributed execution of an operation has a different ramification: if the invoking member dies, any already running configuration process continues to run on other members. In the unlikely event that the invoking member dies, you can still use the monitoring features to ensure other members complete the operation successfully.

**All members must be online.** To simplify the migration or election processes and guarantee they are as fast as possible, the group must not contain any member currently in the distributed recovery process, otherwise the configuration action is rejected by the member where you issue the statement.

**No members can join a group during a configuration change.** Any member that attempts to join the group during a coordinated configuration change leaves the group and cancels its join process.

**Only one configuration at once.** A group which is executing a configuration change cannot accept any other group configuration change, because concurrent configuration operations could lead to member divergence.

**All members must be running MySQL 8.0.13 or higher.** Due to the distributed nature of the configuration actions, all members must recognize them in order to execute them. The operation is therefore rejected if any server running MySQL Server version 8.0.12 or lower is present in the group.
