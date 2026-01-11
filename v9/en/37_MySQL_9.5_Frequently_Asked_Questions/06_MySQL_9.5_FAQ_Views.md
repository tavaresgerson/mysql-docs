## A.6 MySQL 9.5 FAQ: Views

A.6.1. Where can I find documentation covering MySQL Views?

A.6.2. Is there a discussion forum for MySQL Views?

A.6.3. What happens to a view if an underlying table is dropped or renamed?

A.6.4. Does MySQL have table snapshots?

A.6.5. Does MySQL have materialized views?

A.6.6. Can you insert into views that are based on joins?

<table style="width: 100%;"><tbody><tr><td><p><b>A.6.1.</b></p></td><td><p> Where can I find documentation covering MySQL Views? </p></td></tr><tr><td></td><td><p> See Section 27.6, “Using Views”. </p><p> You may also find the MySQL User Forums to be helpful. </p></td></tr><tr><td><p><b>A.6.2.</b></p></td><td><p> Is there a discussion forum for MySQL Views? </p></td></tr><tr><td></td><td><p> See the MySQL User Forums. </p></td></tr><tr><td><p><b>A.6.3.</b></p></td><td><p> What happens to a view if an underlying table is dropped or renamed? </p></td></tr><tr><td></td><td><p> After a view has been created, it is possible to drop or alter a table or view to which the definition refers. To check a view definition for problems of this kind, use the <code>CHECK TABLE</code> statement. (See Section 15.7.3.2, “CHECK TABLE Statement”.) </p></td></tr><tr><td><p><b>A.6.4.</b></p></td><td><p> Does MySQL have table snapshots? </p></td></tr><tr><td></td><td><p> No. </p></td></tr><tr><td><p><b>A.6.5.</b></p></td><td><p> Does MySQL have materialized views? </p></td></tr><tr><td></td><td><p> No. </p></td></tr><tr><td><p><b>A.6.6.</b></p></td><td><p> Can you insert into views that are based on joins? </p></td></tr><tr><td></td><td><p> It is possible, provided that your <code>INSERT</code> statement has a column list that makes it clear there is only one table involved. </p><p> You <span><em>cannot</em></span> insert into multiple tables with a single insert on a view. </p></td></tr></tbody></table>
