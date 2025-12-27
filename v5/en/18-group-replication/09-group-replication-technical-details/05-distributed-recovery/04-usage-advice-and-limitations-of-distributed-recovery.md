#### 17.9.5.4 Usage Advice and Limitations of Distributed Recovery

Distributed recovery does have some limitations. It is based on classic asynchronous replication and as such it may be slow if the server joining the group is not provisioned at all or is provisioned with a very old backup image. This means that if the data to transfer is too big at phase 1, the server may take a very long time to recover. As such, the recommendation is that before adding a server to the group, one should provision it with a fairly recent snapshot of a server already in the group. This minimizes the length of phase 1 and reduces the impact on the donor server, since it has to save and transfer less binary logs.

Warning

It is recommended that a server is provisioned before it is added to a group. That way, one minimizes the time spent on the recovery step.
