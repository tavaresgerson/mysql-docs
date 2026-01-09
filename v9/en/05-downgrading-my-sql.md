# Chapter 4 Downgrading MySQL

Notes

* Make sure you understand the MySQL release model for MySQL long-term support (LTS) and Innovation releases before proceeding with a downgrade.

* A replication topology is downgraded by following the rolling downgrade scheme described at Section 19.5.3, “Upgrading or Downgrading a Replication Topology”, which uses one of the supported single-server methods for each individual server downgrade.

* Monthly Rapid Updates (MRUs) and hot fixes also count as releases in this documentation.

**Table 4.1 Downgrade Paths for MySQL Server**

<table width="1062"><col width="25%"/><col width="15%"/><col width="30%"/><col width="30%"/><thead><tr> <th>Downgrade Path</th> <th>Path Examples</th> <th>Supported Downgrade Methods</th> <th>Notes</th> </tr></thead><tbody><tr> <th>Within an LTS series</th> <td><p> 8.4.y LTS to 8.4.x LTS </p></td> <td>In-place, logical dump and load, MySQL Clone, or by using replication</td> <td></td> </tr><tr> <th>From an LTS or Bugfix series to the previous LTS or Bugfix series</th> <td>8.4.x LTS to 8.0.y</td> <td>Logical dump and load or by using replication</td> <td>Only supported for rollback purposes (that is, if no new server functionality has been applied to the data)</td> </tr><tr> <th>From an LTS or Bugfix series to an Innovation series <span class="emphasis"><em>after the previous LTS series</em></span></th> <td>8.4.x LTS to 8.3.0 Innovation</td> <td>Logical dump and load or by using replication</td> <td>Only supported for rollback purposes (that is, if no new server functionality has been applied to the data)</td> </tr><tr> <th>From within an Innovation series</th> <td>9.5 to 9.4</td> <td>Logical dump and load or by using replication</td> <td>Only supported for rollback purposes (that is, if no new server functionality has been applied to the data)</td> </tr></tbody></table>

Downgrading to MySQL 5.7 or earlier is not supported.
