### 20.7.6 XCom Cache Management

20.7.6.1 Increasing the cache size

20.7.6.2 Reducing the cache size

The group communication engine for Group Replication (XCom, a Paxos variant) includes a cache for messages (and their metadata) exchanged between the group members as a part of the consensus protocol. Among other functions, the message cache is used for recovery of missed messages by members that reconnect with the group after a period where they were unable to communicate with the other group members.

A cache size limit can be set for XCom's message cache using the `group_replication_message_cache_size` system variable. If the cache size limit is reached, XCom removes the oldest entries that have been decided and delivered. The same cache size limit should be set on all group members, because an unreachable member that is attempting to reconnect selects any other member at random for recovery of missed messages. The same messages should therefore be available in each member's cache.

Ensure that sufficient memory is available on your system for your chosen cache size limit, considering the size of MySQL Server's other caches and object pools. Note that the limit set using `group_replication_message_cache_size` applies only to the data stored in the cache, and the cache structures require an additional 50 MB of memory.

When choosing the value for `group_replication_message_cache_size`, do so with regard to the expected volume of messages in the period before a member is expelled. The length of this period is controlled by the `group_replication_member_expel_timeout` system variable, which determines the waiting period (up to an hour) that is allowed *in addition to* the initial 5-second detection period for members to return to the group rather than being expelled. The timeout defaults to 5 seconds, so by default a member is not expelled until it has been absent for at least 10 seconds.
