### 21.7.1 NDB Cluster Replication: Abbreviations and Symbols

Throughout this section, we use the following abbreviations or
symbols for referring to the source and replica clusters, and to
processes and commands run on the clusters or cluster nodes:

**Table 21.63 Abbreviations used throughout this section referring to source
and replica clusters, and to processes and
commands run on cluster nodes**

<table><col style="width: 25%"/><col style="width: 75%"/><thead><tr>
<th>Symbol or Abbreviation</th>
<th>Description (Refers to...)</th>
</tr></thead><tbody><tr>
<td><code>S</code></td>
<td>The cluster serving as the (primary) replication source</td>
</tr><tr>
<td><code>R</code></td>
<td>The cluster acting as the (primary) replica</td>
</tr><tr>
<td><code>shell<code>S</code>&gt;</code></td>
<td>Shell command to be issued on the source cluster</td>
</tr><tr>
<td><code>mysql<code>S</code>&gt;</code></td>
<td>MySQL client command issued on a single MySQL server running as an SQL
            node on the source cluster</td>
</tr><tr>
<td><code>mysql<code>S*</code>&gt;</code></td>
<td>MySQL client command to be issued on all SQL nodes participating in the
            replication source cluster</td>
</tr><tr>
<td><code>shell<code>R</code>&gt;</code></td>
<td>Shell command to be issued on the replica cluster</td>
</tr><tr>
<td><code>mysql<code>R</code>&gt;</code></td>
<td>MySQL client command issued on a single MySQL server running as an SQL
            node on the replica cluster</td>
</tr><tr>
<td><code>mysql<code>R*</code>&gt;</code></td>
<td>MySQL client command to be issued on all SQL nodes participating in the
            replica cluster</td>
</tr><tr>
<td><code>C</code></td>
<td>Primary replication channel</td>
</tr><tr>
<td><code>C'</code></td>
<td>Secondary replication channel</td>
</tr><tr>
<td><code>S'</code></td>
<td>Secondary replication source</td>
</tr><tr>
<td><code>R'</code></td>
<td>Secondary replica</td>
</tr></tbody></table>