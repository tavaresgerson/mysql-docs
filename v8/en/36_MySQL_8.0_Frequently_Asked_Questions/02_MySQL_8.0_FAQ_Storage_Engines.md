## A.2 MySQL 8.0 FAQ: Storage Engines

A.2.1. [Where can I obtain complete documentation for MySQL storage engines?](faqs-storage-engines.html#faq-mysql-what-storage-engines)

A.2.2. [Are there any new storage engines in MySQL 8.0?](faqs-storage-engines.html#faq-mysql-have-new-storage-engines)

A.2.3. [Have any storage engines been removed in MySQL 8.0?](faqs-storage-engines.html#faq-mysql-removed-storage-engines)

A.2.4. [Can I prevent the use of a particular storage engine?](faqs-storage-engines.html#faq-mysql-disabling-storage-engines)

A.2.5. [Is there an advantage to using the InnoDB storage engine exclusively, as opposed to a combination of InnoDB and non-InnoDB storage engines?](faqs-storage-engines.html#faq-mysql-innodb-backup-recovery-advantage)

A.2.6. [What are the unique benefits of the ARCHIVE storage engine?](faqs-storage-engines.html#faq-mysql-what-archive-engine)

<table border="0" style="width: 100%;"><colgroup><col align="left" width="1%"/><col/></colgroup><tbody><tr class="question"><td align="left" valign="top"><a name="faq-mysql-what-storage-engines"></a><a name="id480612"></a><p><b>A.2.1.</b></p></td><td align="left" valign="top"><p>
        Where can I obtain complete documentation for MySQL storage
        engines?
      </p></td></tr><tr class="answer"><td align="left" valign="top"></td><td align="left" valign="top"><p>
        See <a class="xref" href="storage-engines.html" title="Chapter 18 Alternative Storage Engines">Chapter 18, <i>Alternative Storage Engines</i></a>. That chapter contains
        information about all MySQL storage engines except for the
        <a class="link" href="innodb-storage-engine.html" title="Chapter 17 The InnoDB Storage Engine"><code class="literal">InnoDB</code></a> storage engine and the
        <a class="link" href="mysql-cluster.html" title="Chapter 25 MySQL NDB Cluster 8.0"><code class="literal">NDB</code></a> storage engine (used for MySQL
        Cluster). <a class="link" href="innodb-storage-engine.html" title="Chapter 17 The InnoDB Storage Engine"><code class="literal">InnoDB</code></a> is covered in
        <a class="xref" href="innodb-storage-engine.html" title="Chapter 17 The InnoDB Storage Engine">Chapter 17, <i>The InnoDB Storage Engine</i></a>.
        <a class="link" href="mysql-cluster.html" title="Chapter 25 MySQL NDB Cluster 8.0"><code class="literal">NDB</code></a> is covered in
        <a class="xref" href="mysql-cluster.html" title="Chapter 25 MySQL NDB Cluster 8.0">Chapter 25, <i>MySQL NDB Cluster 8.0</i></a>.
      </p></td></tr><tr class="question"><td align="left" valign="top"><a name="faq-mysql-have-new-storage-engines"></a><a name="id480628"></a><p><b>A.2.2.</b></p></td><td align="left" valign="top"><p>
        Are there any new storage engines in MySQL 8.0?
      </p></td></tr><tr class="answer"><td align="left" valign="top"></td><td align="left" valign="top"><p>
        No. <code class="literal">InnoDB</code> is the default storage engine for
        new tables. See <a class="xref" href="innodb-introduction.html" title="17.1 Introduction to InnoDB">Section 17.1, “Introduction to InnoDB”</a> for
        details.
      </p></td></tr><tr class="question"><td align="left" valign="top"><a name="faq-mysql-removed-storage-engines"></a><a name="id480635"></a><p><b>A.2.3.</b></p></td><td align="left" valign="top"><p>
        Have any storage engines been removed in MySQL 8.0?
      </p></td></tr><tr class="answer"><td align="left" valign="top"></td><td align="left" valign="top"><p>
        The <code class="literal">PARTITION</code> storage engine plugin which
        provided partitioning support is replaced by a native
        partitioning handler. As part of this change, the server can no
        longer be built using
        <code class="option">-DWITH_PARTITION_STORAGE_ENGINE</code>.
        <code class="literal">partition</code> is also no longer displayed in the
        output of <a class="link" href="show-plugins.html" title="15.7.7.25 SHOW PLUGINS Statement"><code class="literal">SHOW PLUGINS</code></a>, or shown
        in the <a class="link" href="information-schema-plugins-table.html" title="28.3.22 The INFORMATION_SCHEMA PLUGINS Table"><code class="literal">INFORMATION_SCHEMA.PLUGINS</code></a>
        table.
      </p><p>
        In order to support partitioning of a given table, the storage
        engine used for the table must now provide its own
        (<span class="quote">“<span class="quote">native</span>”</span>) partitioning handler.
        <a class="link" href="innodb-storage-engine.html" title="Chapter 17 The InnoDB Storage Engine"><code class="literal">InnoDB</code></a> is the only storage engine
        supported in MySQL 8.0 that includes a native partitioning
        handler. An attempt to create partitioned tables in MySQL 8.0
        using any other storage engine fails. (The
        <a class="link" href="mysql-cluster.html" title="Chapter 25 MySQL NDB Cluster 8.0"><code class="literal">NDB</code></a> storage engine used by MySQL
        Cluster also provides its own partitioning handler, but is
        currently not supported by MySQL 8.0.)
      </p></td></tr><tr class="question"><td align="left" valign="top"><a name="faq-mysql-disabling-storage-engines"></a><a name="id480653"></a><p><b>A.2.4.</b></p></td><td align="left" valign="top"><p>
        Can I prevent the use of a particular storage engine?
      </p></td></tr><tr class="answer"><td align="left" valign="top"></td><td align="left" valign="top"><p>
        Yes. The
        <a class="link" href="server-system-variables.html#sysvar_disabled_storage_engines"><code class="literal">disabled_storage_engines</code></a>
        configuration option defines which storage engines cannot be
        used to create tables or tablespaces. By default,
        <a class="link" href="server-system-variables.html#sysvar_disabled_storage_engines"><code class="literal">disabled_storage_engines</code></a> is
        empty (no engines disabled), but it can be set to a
        comma-separated list of one or more engines.
      </p></td></tr><tr class="question"><td align="left" valign="top"><a name="faq-mysql-innodb-backup-recovery-advantage"></a><a name="id480662"></a><p><b>A.2.5.</b></p></td><td align="left" valign="top"><p>
        Is there an advantage to using the <code class="literal">InnoDB</code>
        storage engine exclusively, as opposed to a combination of
        <code class="literal">InnoDB</code> and non-<code class="literal">InnoDB</code>
        storage engines?
      </p></td></tr><tr class="answer"><td align="left" valign="top"></td><td align="left" valign="top"><p>
        Yes. Using <code class="literal">InnoDB</code> tables exclusively can
        simplify backup and recovery operations. MySQL Enterprise Backup does a
        <a class="link" href="glossary.html#glos_hot_backup" title="hot backup">hot backup</a> of all tables
        that use the <code class="literal">InnoDB</code> storage engine. For
        tables using <code class="literal">MyISAM</code> or other
        non-<code class="literal">InnoDB</code> storage engines, it does a
        <span class="quote">“<span class="quote">warm</span>”</span> backup, where the database continues to run,
        but those tables cannot be modified while being backed up. See
        <a class="xref" href="mysql-enterprise-backup.html" title="32.1 MySQL Enterprise Backup Overview">Section 32.1, “MySQL Enterprise Backup Overview”</a>.
      </p></td></tr><tr class="question"><td align="left" valign="top"><a name="faq-mysql-what-archive-engine"></a><a name="id480677"></a><p><b>A.2.6.</b></p></td><td align="left" valign="top"><p>
        What are the unique benefits of the <code class="literal">ARCHIVE</code>
        storage engine?
      </p></td></tr><tr class="answer"><td align="left" valign="top"></td><td align="left" valign="top"><p>
        The <code class="literal">ARCHIVE</code> storage engine stores large
        amounts of data without indexes; it has a small footprint, and
        performs selects using table scans. See
        <a class="xref" href="archive-storage-engine.html" title="18.5 The ARCHIVE Storage Engine">Section 18.5, “The ARCHIVE Storage Engine”</a>, for details.
</p></td></tr></tbody></table>