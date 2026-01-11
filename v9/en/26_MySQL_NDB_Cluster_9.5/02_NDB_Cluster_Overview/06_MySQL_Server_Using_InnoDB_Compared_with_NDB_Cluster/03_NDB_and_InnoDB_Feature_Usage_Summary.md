#### 25.2.6.3 NDB and InnoDB Feature Usage Summary

When comparing application feature requirements to the capabilities of `InnoDB` with `NDB`, some are clearly more compatible with one storage engine than the other.

The following table lists supported application features according to the storage engine to which each feature is typically better suited.

**Table 25.3 Supported application features according to the storage engine to which each feature is typically better suited**

<table><thead><tr> <th>Preferred application requirements for <code>InnoDB</code></th> <th>Preferred application requirements for <code>NDB</code></th> </tr></thead><tbody><tr> <td> <div> <ul style="list-style-type: disc; "><li><p> Foreign keys </p> <div style="margin-left: 0.5in; margin-right: 0.5in;"> <div> Note </div> <p> NDB Cluster 9.5 supports foreign keys </p> </div> </li><li><p> Full table scans </p></li><li><p> Very large databases, rows, or transactions </p></li><li><p> Transactions other than <code>READ COMMITTED</code> </p></li></ul> </div> </td> <td> <div> <ul style="list-style-type: disc; "><li><p> Write scaling </p></li><li><p> 99.999% uptime </p></li><li><p> Online addition of nodes and online schema operations </p></li><li><p> Multiple SQL and NoSQL APIs (see NDB Cluster APIs: Overview and Concepts) </p></li><li><p> Real-time performance </p></li><li><p> Limited use of <code>BLOB</code> columns </p></li><li><p> Foreign keys are supported, although their use may have an impact on performance at high throughput </p></li></ul> </div> </td> </tr></tbody></table>
