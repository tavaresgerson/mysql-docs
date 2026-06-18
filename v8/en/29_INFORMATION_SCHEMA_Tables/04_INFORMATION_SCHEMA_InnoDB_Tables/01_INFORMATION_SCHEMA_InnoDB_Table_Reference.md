### 28.4.1 INFORMATION\_SCHEMA InnoDB Table Reference

The following table summarizes
`INFORMATION_SCHEMA` InnoDB tables. For greater
detail, see the individual table descriptions.

**Table 28.3 INFORMATION\_SCHEMA InnoDB Tables**

<table frame="box" rules="all" summary="A reference that lists INFORMATION_SCHEMA InnoDB tables."><col style="width: 25%"/><col style="width: 62%"/><col style="width: 12%"/><thead><tr><th>Table Name</th>
<th>Description</th>
<th>Introduced</th>
</tr></thead><tbody><tr><th scope="row"><a class="link" href="information-schema-innodb-buffer-page-table.html" title="28.4.2 The INFORMATION_SCHEMA INNODB_BUFFER_PAGE Table"><code class="literal">INNODB_BUFFER_PAGE</code></a></th>
<td>Pages in InnoDB buffer pool</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-innodb-buffer-page-lru-table.html" title="28.4.3 The INFORMATION_SCHEMA INNODB_BUFFER_PAGE_LRU Table"><code class="literal">INNODB_BUFFER_PAGE_LRU</code></a></th>
<td>LRU ordering of pages in InnoDB buffer pool</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-innodb-buffer-pool-stats-table.html" title="28.4.4 The INFORMATION_SCHEMA INNODB_BUFFER_POOL_STATS Table"><code class="literal">INNODB_BUFFER_POOL_STATS</code></a></th>
<td>InnoDB buffer pool statistics</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-innodb-cached-indexes-table.html" title="28.4.5 The INFORMATION_SCHEMA INNODB_CACHED_INDEXES Table"><code class="literal">INNODB_CACHED_INDEXES</code></a></th>
<td>Number of index pages cached per index in InnoDB buffer pool</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-innodb-cmp-table.html" title="28.4.6 The INFORMATION_SCHEMA INNODB_CMP and INNODB_CMP_RESET Tables"><code class="literal">INNODB_CMP</code></a></th>
<td>Status for operations related to compressed InnoDB tables</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-innodb-cmp-per-index-table.html" title="28.4.8 The INFORMATION_SCHEMA INNODB_CMP_PER_INDEX and INNODB_CMP_PER_INDEX_RESET Tables"><code class="literal">INNODB_CMP_PER_INDEX</code></a></th>
<td>Status for operations related to compressed InnoDB tables and indexes</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-innodb-cmp-per-index-table.html" title="28.4.8 The INFORMATION_SCHEMA INNODB_CMP_PER_INDEX and INNODB_CMP_PER_INDEX_RESET Tables"><code class="literal">INNODB_CMP_PER_INDEX_RESET</code></a></th>
<td>Status for operations related to compressed InnoDB tables and indexes</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-innodb-cmp-table.html" title="28.4.6 The INFORMATION_SCHEMA INNODB_CMP and INNODB_CMP_RESET Tables"><code class="literal">INNODB_CMP_RESET</code></a></th>
<td>Status for operations related to compressed InnoDB tables</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-innodb-cmpmem-table.html" title="28.4.7 The INFORMATION_SCHEMA INNODB_CMPMEM and INNODB_CMPMEM_RESET Tables"><code class="literal">INNODB_CMPMEM</code></a></th>
<td>Status for compressed pages within InnoDB buffer pool</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-innodb-cmpmem-table.html" title="28.4.7 The INFORMATION_SCHEMA INNODB_CMPMEM and INNODB_CMPMEM_RESET Tables"><code class="literal">INNODB_CMPMEM_RESET</code></a></th>
<td>Status for compressed pages within InnoDB buffer pool</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-innodb-columns-table.html" title="28.4.9 The INFORMATION_SCHEMA INNODB_COLUMNS Table"><code class="literal">INNODB_COLUMNS</code></a></th>
<td>Columns in each InnoDB table</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-innodb-datafiles-table.html" title="28.4.10 The INFORMATION_SCHEMA INNODB_DATAFILES Table"><code class="literal">INNODB_DATAFILES</code></a></th>
<td>Data file path information for InnoDB file-per-table and general tablespaces</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-innodb-fields-table.html" title="28.4.11 The INFORMATION_SCHEMA INNODB_FIELDS Table"><code class="literal">INNODB_FIELDS</code></a></th>
<td>Key columns of InnoDB indexes</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-innodb-foreign-table.html" title="28.4.12 The INFORMATION_SCHEMA INNODB_FOREIGN Table"><code class="literal">INNODB_FOREIGN</code></a></th>
<td>InnoDB foreign-key metadata</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-innodb-foreign-cols-table.html" title="28.4.13 The INFORMATION_SCHEMA INNODB_FOREIGN_COLS Table"><code class="literal">INNODB_FOREIGN_COLS</code></a></th>
<td>InnoDB foreign-key column status information</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-innodb-ft-being-deleted-table.html" title="28.4.14 The INFORMATION_SCHEMA INNODB_FT_BEING_DELETED Table"><code class="literal">INNODB_FT_BEING_DELETED</code></a></th>
<td>Snapshot of INNODB_FT_DELETED table</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-innodb-ft-config-table.html" title="28.4.15 The INFORMATION_SCHEMA INNODB_FT_CONFIG Table"><code class="literal">INNODB_FT_CONFIG</code></a></th>
<td>Metadata for InnoDB table FULLTEXT index and associated processing</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-innodb-ft-default-stopword-table.html" title="28.4.16 The INFORMATION_SCHEMA INNODB_FT_DEFAULT_STOPWORD Table"><code class="literal">INNODB_FT_DEFAULT_STOPWORD</code></a></th>
<td>Default list of stopwords for InnoDB FULLTEXT indexes</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-innodb-ft-deleted-table.html" title="28.4.17 The INFORMATION_SCHEMA INNODB_FT_DELETED Table"><code class="literal">INNODB_FT_DELETED</code></a></th>
<td>Rows deleted from InnoDB table FULLTEXT index</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-innodb-ft-index-cache-table.html" title="28.4.18 The INFORMATION_SCHEMA INNODB_FT_INDEX_CACHE Table"><code class="literal">INNODB_FT_INDEX_CACHE</code></a></th>
<td>Token information for newly inserted rows in InnoDB FULLTEXT index</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-innodb-ft-index-table-table.html" title="28.4.19 The INFORMATION_SCHEMA INNODB_FT_INDEX_TABLE Table"><code class="literal">INNODB_FT_INDEX_TABLE</code></a></th>
<td>Inverted index information for processing text searches against InnoDB table FULLTEXT index</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-innodb-indexes-table.html" title="28.4.20 The INFORMATION_SCHEMA INNODB_INDEXES Table"><code class="literal">INNODB_INDEXES</code></a></th>
<td>InnoDB index metadata</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-innodb-metrics-table.html" title="28.4.21 The INFORMATION_SCHEMA INNODB_METRICS Table"><code class="literal">INNODB_METRICS</code></a></th>
<td>InnoDB performance information</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-innodb-session-temp-tablespaces-table.html" title="28.4.22 The INFORMATION_SCHEMA INNODB_SESSION_TEMP_TABLESPACES Table"><code class="literal">INNODB_SESSION_TEMP_TABLESPACES</code></a></th>
<td>Session temporary-tablespace metadata</td>
<td>8.0.13</td>
</tr><tr><th scope="row"><a class="link" href="information-schema-innodb-tables-table.html" title="28.4.23 The INFORMATION_SCHEMA INNODB_TABLES Table"><code class="literal">INNODB_TABLES</code></a></th>
<td>InnoDB table metadata</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-innodb-tablespaces-table.html" title="28.4.24 The INFORMATION_SCHEMA INNODB_TABLESPACES Table"><code class="literal">INNODB_TABLESPACES</code></a></th>
<td>InnoDB file-per-table, general, and undo tablespace metadata</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-innodb-tablespaces-brief-table.html" title="28.4.25 The INFORMATION_SCHEMA INNODB_TABLESPACES_BRIEF Table"><code class="literal">INNODB_TABLESPACES_BRIEF</code></a></th>
<td>Brief file-per-table, general, undo, and system tablespace metadata</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-innodb-tablestats-table.html" title="28.4.26 The INFORMATION_SCHEMA INNODB_TABLESTATS View"><code class="literal">INNODB_TABLESTATS</code></a></th>
<td>InnoDB table low-level status information</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-innodb-temp-table-info-table.html" title="28.4.27 The INFORMATION_SCHEMA INNODB_TEMP_TABLE_INFO Table"><code class="literal">INNODB_TEMP_TABLE_INFO</code></a></th>
<td>Information about active user-created InnoDB temporary tables</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-innodb-trx-table.html" title="28.4.28 The INFORMATION_SCHEMA INNODB_TRX Table"><code class="literal">INNODB_TRX</code></a></th>
<td>Active InnoDB transaction information</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="information-schema-innodb-virtual-table.html" title="28.4.29 The INFORMATION_SCHEMA INNODB_VIRTUAL Table"><code class="literal">INNODB_VIRTUAL</code></a></th>
<td>InnoDB virtual generated column metadata</td>
<td></td>
</tr></tbody></table>