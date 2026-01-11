#### 20.1.4.3 Fault-tolerance

MySQL Group Replication builds on an implementation of the Paxos distributed algorithm to provide distributed coordination between servers. As such, it requires a majority of servers to be active to reach quorum and thus make a decision. This has direct impact on the number of failures the system can tolerate without compromising itself and its overall functionality. The number of servers (n) needed to tolerate `f` failures is then `n = 2 x f + 1`.

In practice this means that to tolerate one failure the group must have three servers in it. As such if one server fails, there are still two servers to form a majority (two out of three) and allow the system to continue to make decisions automatically and progress. However, if a second server fails *involuntarily*, then the group (with one server left) blocks, because there is no majority to reach a decision.

The following is a small table illustrating the formula above.

<table summary="Relationship between replication group size, the number of servers that constitute a majority, and the number of instant failures that can be tolerated."><thead><tr> <th><p> Group Size </p></th> <th><p> Majority </p></th> <th><p> Instant Failures Tolerated </p></th> </tr></thead><tbody><tr> <th><p> 1 </p></th> <td><p> 1 </p></td> <td><p> 0 </p></td> </tr><tr> <th><p> 2 </p></th> <td><p> 2 </p></td> <td><p> 0 </p></td> </tr><tr> <th><p> 3 </p></th> <td><p> 2 </p></td> <td><p> 1 </p></td> </tr><tr> <th><p> 4 </p></th> <td><p> 3 </p></td> <td><p> 1 </p></td> </tr><tr> <th><p> 5 </p></th> <td><p> 3 </p></td> <td><p> 2 </p></td> </tr><tr> <th><p> 6 </p></th> <td><p> 4 </p></td> <td><p> 2 </p></td> </tr><tr> <th><p> 7 </p></th> <td><p> 4 </p></td> <td><p> 3 </p></td> </tr></tbody></table>
