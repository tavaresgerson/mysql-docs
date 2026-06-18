### 28.3.1 INFORMATION\_SCHEMA General Table Reference

The following table summarizes
`INFORMATION_SCHEMA` general tables. For greater
detail, see the individual table descriptions.

**Table 28.2 INFORMATION\_SCHEMA General Tables**

<table frame="box" rules="all" summary="A reference that lists INFORMATION_SCHEMA general tables."><col style="width: 22%"/><col style="width: 55%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th>Table Name</th>
<th>Description</th>
<th>Introduced</th>
<th>Deprecated</th>
</tr></thead><tbody><tr><th scope="row"><a class="link" href="information-schema-administrable-role-authorizations-table.html" title="28.3.2 The INFORMATION_SCHEMA ADMINISTRABLE_ROLE_AUTHORIZATIONS Table"><code class="literal">ADMINISTRABLE_ROLE_AUTHORIZATIONS</code></a></th>
<td>Grantable users or roles for current user or role</td>
<td>8.0.19</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-applicable-roles-table.html" title="28.3.3 The INFORMATION_SCHEMA APPLICABLE_ROLES Table"><code class="literal">APPLICABLE_ROLES</code></a></th>
<td>Applicable roles for current user</td>
<td>8.0.19</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-character-sets-table.html" title="28.3.4 The INFORMATION_SCHEMA CHARACTER_SETS Table"><code class="literal">CHARACTER_SETS</code></a></th>
<td>Available character sets</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-check-constraints-table.html" title="28.3.5 The INFORMATION_SCHEMA CHECK_CONSTRAINTS Table"><code class="literal">CHECK_CONSTRAINTS</code></a></th>
<td>Table and column CHECK constraints</td>
<td>8.0.16</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-collation-character-set-applicability-table.html" title="28.3.7 The INFORMATION_SCHEMA COLLATION_CHARACTER_SET_APPLICABILITY Table"><code class="literal">COLLATION_CHARACTER_SET_APPLICABILITY</code></a></th>
<td>Character set applicable to each collation</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-collations-table.html" title="28.3.6 The INFORMATION_SCHEMA COLLATIONS Table"><code class="literal">COLLATIONS</code></a></th>
<td>Collations for each character set</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-column-privileges-table.html" title="28.3.10 The INFORMATION_SCHEMA COLUMN_PRIVILEGES Table"><code class="literal">COLUMN_PRIVILEGES</code></a></th>
<td>Privileges defined on columns</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-column-statistics-table.html" title="28.3.11 The INFORMATION_SCHEMA COLUMN_STATISTICS Table"><code class="literal">COLUMN_STATISTICS</code></a></th>
<td>Histogram statistics for column values</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-columns-table.html" title="28.3.8 The INFORMATION_SCHEMA COLUMNS Table"><code class="literal">COLUMNS</code></a></th>
<td>Columns in each table</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-columns-extensions-table.html" title="28.3.9 The INFORMATION_SCHEMA COLUMNS_EXTENSIONS Table"><code class="literal">COLUMNS_EXTENSIONS</code></a></th>
<td>Column attributes for primary and secondary storage engines</td>
<td>8.0.21</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-enabled-roles-table.html" title="28.3.12 The INFORMATION_SCHEMA ENABLED_ROLES Table"><code class="literal">ENABLED_ROLES</code></a></th>
<td>Roles enabled within current session</td>
<td>8.0.19</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-engines-table.html" title="28.3.13 The INFORMATION_SCHEMA ENGINES Table"><code class="literal">ENGINES</code></a></th>
<td>Storage engine properties</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-events-table.html" title="28.3.14 The INFORMATION_SCHEMA EVENTS Table"><code class="literal">EVENTS</code></a></th>
<td>Event Manager events</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-files-table.html" title="28.3.15 The INFORMATION_SCHEMA FILES Table"><code class="literal">FILES</code></a></th>
<td>Files that store tablespace data</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-key-column-usage-table.html" title="28.3.16 The INFORMATION_SCHEMA KEY_COLUMN_USAGE Table"><code class="literal">KEY_COLUMN_USAGE</code></a></th>
<td>Which key columns have constraints</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-keywords-table.html" title="28.3.17 The INFORMATION_SCHEMA KEYWORDS Table"><code class="literal">KEYWORDS</code></a></th>
<td>MySQL keywords</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-ndb-transid-mysql-connection-map-table.html" title="28.3.18 The INFORMATION_SCHEMA ndb_transid_mysql_connection_map Table"><code class="literal">ndb_transid_mysql_connection_map</code></a></th>
<td>NDB transaction information</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-optimizer-trace-table.html" title="28.3.19 The INFORMATION_SCHEMA OPTIMIZER_TRACE Table"><code class="literal">OPTIMIZER_TRACE</code></a></th>
<td>Information produced by optimizer trace activity</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-parameters-table.html" title="28.3.20 The INFORMATION_SCHEMA PARAMETERS Table"><code class="literal">PARAMETERS</code></a></th>
<td>Stored routine parameters and stored function return values</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-partitions-table.html" title="28.3.21 The INFORMATION_SCHEMA PARTITIONS Table"><code class="literal">PARTITIONS</code></a></th>
<td>Table partition information</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-plugins-table.html" title="28.3.22 The INFORMATION_SCHEMA PLUGINS Table"><code class="literal">PLUGINS</code></a></th>
<td>Plugin information</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-processlist-table.html" title="28.3.23 The INFORMATION_SCHEMA PROCESSLIST Table"><code class="literal">PROCESSLIST</code></a></th>
<td>Information about currently executing threads</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-profiling-table.html" title="28.3.24 The INFORMATION_SCHEMA PROFILING Table"><code class="literal">PROFILING</code></a></th>
<td>Statement profiling information</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-referential-constraints-table.html" title="28.3.25 The INFORMATION_SCHEMA REFERENTIAL_CONSTRAINTS Table"><code class="literal">REFERENTIAL_CONSTRAINTS</code></a></th>
<td>Foreign key information</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-resource-groups-table.html" title="28.3.26 The INFORMATION_SCHEMA RESOURCE_GROUPS Table"><code class="literal">RESOURCE_GROUPS</code></a></th>
<td>Resource group information</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-role-column-grants-table.html" title="28.3.27 The INFORMATION_SCHEMA ROLE_COLUMN_GRANTS Table"><code class="literal">ROLE_COLUMN_GRANTS</code></a></th>
<td>Column privileges for roles available to or granted by currently enabled roles</td>
<td>8.0.19</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-role-routine-grants-table.html" title="28.3.28 The INFORMATION_SCHEMA ROLE_ROUTINE_GRANTS Table"><code class="literal">ROLE_ROUTINE_GRANTS</code></a></th>
<td>Routine privileges for roles available to or granted by currently enabled roles</td>
<td>8.0.19</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-role-table-grants-table.html" title="28.3.29 The INFORMATION_SCHEMA ROLE_TABLE_GRANTS Table"><code class="literal">ROLE_TABLE_GRANTS</code></a></th>
<td>Table privileges for roles available to or granted by currently enabled roles</td>
<td>8.0.19</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-routines-table.html" title="28.3.30 The INFORMATION_SCHEMA ROUTINES Table"><code class="literal">ROUTINES</code></a></th>
<td>Stored routine information</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-schema-privileges-table.html" title="28.3.33 The INFORMATION_SCHEMA SCHEMA_PRIVILEGES Table"><code class="literal">SCHEMA_PRIVILEGES</code></a></th>
<td>Privileges defined on schemas</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-schemata-table.html" title="28.3.31 The INFORMATION_SCHEMA SCHEMATA Table"><code class="literal">SCHEMATA</code></a></th>
<td>Schema information</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-schemata-extensions-table.html" title="28.3.32 The INFORMATION_SCHEMA SCHEMATA_EXTENSIONS Table"><code class="literal">SCHEMATA_EXTENSIONS</code></a></th>
<td>Schema options</td>
<td>8.0.22</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-st-geometry-columns-table.html" title="28.3.35 The INFORMATION_SCHEMA ST_GEOMETRY_COLUMNS Table"><code class="literal">ST_GEOMETRY_COLUMNS</code></a></th>
<td>Columns in each table that store spatial data</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-st-spatial-reference-systems-table.html" title="28.3.36 The INFORMATION_SCHEMA ST_SPATIAL_REFERENCE_SYSTEMS Table"><code class="literal">ST_SPATIAL_REFERENCE_SYSTEMS</code></a></th>
<td>Available spatial reference systems</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-st-units-of-measure-table.html" title="28.3.37 The INFORMATION_SCHEMA ST_UNITS_OF_MEASURE Table"><code class="literal">ST_UNITS_OF_MEASURE</code></a></th>
<td>Acceptable units for ST_Distance()</td>
<td>8.0.14</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-statistics-table.html" title="28.3.34 The INFORMATION_SCHEMA STATISTICS Table"><code class="literal">STATISTICS</code></a></th>
<td>Table index statistics</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-table-constraints-table.html" title="28.3.42 The INFORMATION_SCHEMA TABLE_CONSTRAINTS Table"><code class="literal">TABLE_CONSTRAINTS</code></a></th>
<td>Which tables have constraints</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-table-constraints-extensions-table.html" title="28.3.43 The INFORMATION_SCHEMA TABLE_CONSTRAINTS_EXTENSIONS Table"><code class="literal">TABLE_CONSTRAINTS_EXTENSIONS</code></a></th>
<td>Table constraint attributes for primary and secondary storage engines</td>
<td>8.0.21</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-table-privileges-table.html" title="28.3.44 The INFORMATION_SCHEMA TABLE_PRIVILEGES Table"><code class="literal">TABLE_PRIVILEGES</code></a></th>
<td>Privileges defined on tables</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-tables-table.html" title="28.3.38 The INFORMATION_SCHEMA TABLES Table"><code class="literal">TABLES</code></a></th>
<td>Table information</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-tables-extensions-table.html" title="28.3.39 The INFORMATION_SCHEMA TABLES_EXTENSIONS Table"><code class="literal">TABLES_EXTENSIONS</code></a></th>
<td>Table attributes for primary and secondary storage engines</td>
<td>8.0.21</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-tablespaces-table.html" title="28.3.40 The INFORMATION_SCHEMA TABLESPACES Table"><code class="literal">TABLESPACES</code></a></th>
<td>Tablespace information</td>
<td></td>
<td>8.0.22</td>
</tr><tr><th scope="row"><a class="link" href="information-schema-tablespaces-extensions-table.html" title="28.3.41 The INFORMATION_SCHEMA TABLESPACES_EXTENSIONS Table"><code class="literal">TABLESPACES_EXTENSIONS</code></a></th>
<td>Tablespace attributes for primary storage engines</td>
<td>8.0.21</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-triggers-table.html" title="28.3.45 The INFORMATION_SCHEMA TRIGGERS Table"><code class="literal">TRIGGERS</code></a></th>
<td>Trigger information</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-user-attributes-table.html" title="28.3.46 The INFORMATION_SCHEMA USER_ATTRIBUTES Table"><code class="literal">USER_ATTRIBUTES</code></a></th>
<td>User comments and attributes</td>
<td>8.0.21</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-user-privileges-table.html" title="28.3.47 The INFORMATION_SCHEMA USER_PRIVILEGES Table"><code class="literal">USER_PRIVILEGES</code></a></th>
<td>Privileges defined globally per user</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-view-routine-usage-table.html" title="28.3.49 The INFORMATION_SCHEMA VIEW_ROUTINE_USAGE Table"><code class="literal">VIEW_ROUTINE_USAGE</code></a></th>
<td>Stored functions used in views</td>
<td>8.0.13</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-view-table-usage-table.html" title="28.3.50 The INFORMATION_SCHEMA VIEW_TABLE_USAGE Table"><code class="literal">VIEW_TABLE_USAGE</code></a></th>
<td>Tables and views used in views</td>
<td>8.0.13</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-views-table.html" title="28.3.48 The INFORMATION_SCHEMA VIEWS Table"><code class="literal">VIEWS</code></a></th>
<td>View information</td>
<td></td>
<td></td>
</tr></tbody></table>