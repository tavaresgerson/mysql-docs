#### 17.9.5.2 Recovering From a Point-in-time

To synchronize the server joining the group with the donor up to a specific point in time, the server joining the group and donor make use of the MySQL Global Transaction Identifiers (GTIDs) mechanism. See [Section 16.1.3, “Replication with Global Transaction Identifiers”](replication-gtids.html "16.1.3 Replication with Global Transaction Identifiers"). However, GTIDS only provide a means to realize which transactions the server joining the group is missing, they do not help marking a specific point in time to which the server joining the group must catch up, nor do they help conveying certification information. This is the job of binary log view markers, which mark view changes in the binary log stream, and also contain additional metadata information, provisioning the server joining the group with missing certification related data.

##### View and View Changes

To explain the concept of view change markers, it is important to understand what a view and a view change are.

A *view* corresponds to a group of members participating actively in the current configuration, in other words at a specific point in time. They are correct and online in the system.

A *view change* occurs when a modification to the group configuration happens, such as a member joining or leaving. Any group membership change results in an independent view change communicated to all members at the same logical point in time.

A *view identifier* uniquely identifies a view. It is generated whenever a view change happens

At the group communication layer, view changes with their associated view ids are then boundaries between the data exchanged before and after a member joins. This concept is implemented through a new binary log event: the"view change log event". The view id thus becomes a marker as well for transactions transmitted before and after changes happen in the group membership.

The view identifier itself is built from two parts: *(i)* one that is randomly generated and *(ii)* a monotonically increasing integer. The first part is generated when the group is created, and remains unchanged while there is at least one member in the group. The second part is incremented every time a view change happens.

The reason for this heterogeneous pair that makes up the view id is the need to unambiguously mark group changes whenever a member joins or leaves but also whenever all members leave the group and no information remains of what view the group was in. In fact, the sole use of monotonic increasing identifiers could lead to the reuse of the same id after full group shutdowns, destroying the uniqueness of the binary log data markers that recovery depends on. To summarize, the first part identifies whenever the group was started from the beginning and the incremental part when the group changed from that point on.
