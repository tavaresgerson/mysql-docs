## 3.2 Upgrade Paths

::: info Notes

* Make sure you understand the MySQL release model for MySQL for MySQL long long-term support (LTS) and Innovation versions before proceeding with a downgrade.
* We recommend checking upgrade compatibility with MySQL Shell's  Upgrade Checker Utility before performing an upgrade.
* A replication topology is upgraded by following the rolling upgrade scheme described at Section 19.5.3, “Upgrading or Downgrading a Replication Topology”, which uses one of the supported single-server methods for each individual server upgrade.
* Monthly Rapid Updates (MRUs) and hot fixes also count as releases in this documentation.

:::

**Table 3.1 Upgrade Paths for MySQL Server**

<table><thead><tr> <th scope="col">Upgrade Path</th> <th scope="col">Path Examples</th> <th scope="col">Supported Upgrade Methods</th> </tr></thead><tbody><tr> <th>Within an LTS or Bugfix series</th> <td>8.0.37 to 8.0.41 or 8.4.0 to 8.4.4</td> <td>In-place upgrade, logical dump and load, replication, and MySQL Clone</td> </tr><tr> <th>From an LTS or Bugfix series to the next LTS series</th> <td>8.0.37 to 8.4.x LTS</td> <td>In-place upgrade, logical dump and load, and replication</td> </tr><tr> <th>From an LTS or Bugfix release to an Innovation release <span><em>before the next LTS series</em></span></th> <td>8.0.34 to 8.3.0 or 8.4.0 to 9.0.0</td> <td>In-place upgrade, logical dump and load, and replication</td> </tr><tr> <th>From an Innovation series to the next LTS series</th> <td>8.3.0 to 8.4 LTS</td> <td>In-place upgrade, logical dump and load, and replication</td> </tr><tr> <th>From an Innovation series to an Innovation release <span><em>after the next LTS series</em></span></th> <td>Not allowed, two steps are required: 8.3.0 to 8.4 LTS, and 8.4 LTS to 9.x Innovation</td> <td>In-place upgrade, logical dump and load, and replication</td> </tr><tr> <th>From within an Innovation series</th> <td>8.1.0 to 8.3.0</td> <td>In-place upgrade, logical dump and load, and replication</td> </tr><tr> <th>From MySQL 5.7 to an LTS or Innovation release</th> <td>MySQL 5.7 to 8.4</td> <td>A bugfix or LTS series cannot be skipped, so in this example first upgrade MySQL 5.7 to MySQL 8.0, and then upgrade MySQL 8.0 to MySQL 8.4.</td> </tr></tbody></table>
