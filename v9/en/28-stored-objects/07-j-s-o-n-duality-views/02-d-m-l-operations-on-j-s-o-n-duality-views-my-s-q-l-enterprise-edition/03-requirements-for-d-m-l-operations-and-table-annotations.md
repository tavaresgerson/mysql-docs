#### 27.7.2.3 Requirements for DML Operations and Table Annotations

Review the following requirements and restrictions for table annotations and DML operations on JSON duality views.

##### Requirements and Restrictions for Insert Annotations

The root object and sub-objects of a document must have the `INSERT` annotation. Any referenced sub-objects must exist.

If a sub-object is updated as part of an insert operation, this sub-object must have the `UPDATE` annotation. *Exception*: If a given sub-object already exists and is referenced in the object being inserted or updated, no annotation check is performed.

Attempting to insert `NULL` or an empty object is rejected with an error.

Insert operations must not result in any constraint violations. This includes `NULL`, primary key, unique Key, check, and foreign key constraints.

Values for primary key columns must be specified. It is possible in some cases to deduce a primary key column value from a `JOIN`. If primary key values are not supplied, and cannot be deduced from a join condition, the insert is rejected with an error.

Values for columns other than primary keys may be omitted. In such cases, either the column's default value, if applicable, or `NULL` is stored in those columns.

When values columns used in the join condition of objects and sub-objects are specified, the values of the columns used in the join condition must be same.

If the value for a column is not specified and it is part of a sub-object's join condition, the value from the other operand is used in its place. In the `INSERT` statement shown in this example, the value of column `t2.f3` is not specified. `t2.f3` is used in the join condition for `ChildNode`, specifying the value as `t1.f1`. In this case, `t2.f3` is copied from `t1.f1`.

```
CREATE TABLE t1 (f1 INT PRIMARY KEY, f2 INT);
CREATE TABLE t2 (f3 INT PRIMARY KEY REFERENCES t1(f1), f4 INT);

INSERT INTO t1 VALUES (1, 2);
INSERT INTO t2 VALUES (1, 200);

CREATE OR REPLACE JSON DUALITY VIEW dv1
AS
  SELECT JSON_DUALITY_OBJECT(
    WITH(INSERT, UPDATE, DELETE)
    "_id" : f3,
    "f4" : f4,
    "ChildNode" , (SELECT JSON_DUALITY_OBJECT
                    (WITH(INSERT, UPDATE)
                    "f1" : f1,
                    "f2" : f2
                      )
                   FROM t1 WHERE t1.f1 = t2.f3)
) FROM t2;

INSERT INTO dv1 VALUES('{ "f4" : 400, "ChildNode" : { "f1" : 3,  "f2" : 4 } }');
```

Since, according to the view definition for `dv1`, the columns used in the join condition should match, the value for `t1.f1` is copied from `t2.f3`. If no value is specified for either column used in the join condition, the insert operation is rejected with an error.

Similarly, if a column used in a join condition is not projected in the JSON duality view, the value for the column which is not projected is copied from other column used in the join condition.

In some cases, for an object, not specifying a complete sub-object is allowed. This is the case if either of the following conditions is true:

* Rows matching the join condition already exist in the sub-object's table

* Skipping the insertion of this sub-object does not violate any table constraints.

When the root object being inserted references only existing sub-objects, then only the root object is inserted.

When the root object being inserted references only some of all existing sub-objects, then only the root object is inserted. Sub-objects which are not specified are not deleted.

When the root object being inserted references existing sub-objects and modifies some columns not part of the table's primary key, the root object is inserted, and any sub-objects are updated.

If an object or sub-object is defined on the same table at any level of the JSON duality view's definition, values for the columns must be the same; if they are not, the operation is rejected with an error.

Inserts of multiple objects are not allowed on JSON duality views.

The following types of `INSERT` statements are not allowed on JSON duality views:

* Statements using `HIGH_PRIORITY` or `DELAYED`

* `INSERT ... ON DUPLICATE KEY UPDATE` statement

* `INSERT ... SELECT` statement

##### Requirements and Restrictions for Update Annotations

Update operations on the root object and its sub-objects require the `UPDATE` annotation, and are rejected with an error without it. Referenced sub-objects must exist.

If a sub-object is inserted as part of an update operation, then the object must have the `INSERT` annotation. Otherwise, the operation is rejected with an error with the following exceptions:

* If a sub-object already exists and is referenced in the object being updated, or if it would be replaced with another existing sub-object in the table, no check for annotations is performed.

* If a sub-object is modified and the `UPDATE` annotation is not specified, only the existence of the sub-object is checked. An error is not reported for a missing annotation.

If a sub-object is a descendant of an element that is deleted, then the sub-object must have a `DELETE` annotation.

Updating JSON objects to an empty object or `NULL` is not allowed. Updates of primary key column values of the root object and sub-objects are not allowed.

Any update operation resulting in a constraint violation is rejected with an error. Such constraints include `NULL`, primary key, unique key, check, and foreign key constraints.

For update operations, all projected column values must be specified. Any missing sub-objects or elements in sub-objects are deleted.

If an object and its sub-object columns are not modified, base tables are updated.

If an object is modified but sub-object columns are not modified, then only the object's base table is updated.

If both object and sub-object columns are modified, then the base tables for both objects is updated.

If a new sub-object is inserted by the update, then a new row is inserted in the sub-object's table.

If an existing sub-object is missing (or deleted), the row for this sub-object is deleted.

If the deletion of an object caused by an update results in a table constraint violation, the update is rejected with an error.

Replacement of a sub-object with an existing sub-object in the base table is supported.

If multiple sub-objects are projected from the same table, the same value must be specified for all such sub-objects.

The `etag` supplied for an update operation must match the `etag` generated for the same object.

##### Requirements and Restrictions for Delete Annotations

If a root object must be deleted, then an object of a document must have a `DELETE` annotation.

A singleton sub-object must not be deleted.

Nested sub-objects must not be deleted if the `DELETE` annotation is not specified.

If sub-object has a `DELETE` annotation, then all elements of the nested sub-object must be deleted.

A delete operation is rejected with an error if referential constraint fails.

Singleton sub-objects are not deleted.
