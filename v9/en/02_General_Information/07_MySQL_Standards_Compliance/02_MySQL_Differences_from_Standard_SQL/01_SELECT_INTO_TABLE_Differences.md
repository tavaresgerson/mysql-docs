#### 1.7.2.1 SELECT INTO TABLE Differences

MySQL Server doesn't support the `SELECT ... INTO TABLE` Sybase SQL extension. Instead, MySQL Server supports the [`INSERT INTO ... SELECT`](insert-select.html "15.2.7.1 INSERT ... SELECT Statement") standard SQL syntax, which is basically the same thing. See Section 15.2.7.1, “INSERT ... SELECT Statement”. For example:

```
INSERT INTO tbl_temp2 (fld_id)
    SELECT tbl_temp1.fld_order_id
    FROM tbl_temp1 WHERE tbl_temp1.fld_order_id > 100;
```

Alternatively, you can use [`SELECT ... INTO OUTFILE`](select-into.html "15.2.13.1 SELECT ... INTO Statement") or [`CREATE TABLE ... SELECT`](create-table.html "15.1.24 CREATE TABLE Statement").

You can use [`SELECT ... INTO`](select.html "15.2.13 SELECT Statement") with user-defined variables. The same syntax can also be used inside stored routines using cursors and local variables. See Section 15.2.13.1, “SELECT ... INTO Statement”.