### 22.3.4 Relational Tables

22.3.4.1 Insert Records into Tables

22.3.4.2 Select Tables

22.3.4.3 Update Tables

22.3.4.4 Delete Tables

You can also use X DevAPI to work with relational tables. In MySQL, each relational table is associated with a particular storage engine. The examples in this section use `InnoDB` tables in the `world_x` schema.

#### Confirm the Schema

To show the schema that is assigned to the `db` global variable, issue `db`.

```
mysql-js> db
<Schema:world_x>
```

If the returned value is not `Schema:world_x`, set the `db` variable as follows:

```
mysql-js> \use world_x
Schema `world_x` accessible through db.
```

#### Show All Tables

To display all relational tables in the `world_x` schema, use the `getTables()` method on the `db` object.

```
mysql-js> db.getTables()
{
    "city": <Table:city>,
    "country": <Table:country>,
    "countrylanguage": <Table:countrylanguage>
}
```

#### Basic Table Operations

Basic operations scoped by tables include:

<table summary="CRUD operations to use interactively on tables within MySQL Shell"><thead><tr> <th>Operation form</th> <th>Description</th> </tr></thead><tbody><tr> <td><code>db.<em class="replaceable"><code>name</code></em>.insert()</code></td> <td>The insert() method inserts one or more records into the named table.</td> </tr><tr> <td><code>db.<em class="replaceable"><code>name</code></em>.select()</code></td> <td>The select() method returns some or all records in the named table.</td> </tr><tr> <td><code>db.<em class="replaceable"><code>name</code></em>.update()</code></td> <td>The update() method updates records in the named table.</td> </tr><tr> <td><code>db.<em class="replaceable"><code>name</code></em>.delete()</code></td> <td>The delete() method deletes one or more records from the named table.</td> </tr></tbody></table>

#### Related Information

* See Working with Relational Tables for more information.

* CRUD EBNF Definitions provides a complete list of operations.

* See Section 22.3.2, “Download and Import world_x Database” for instructions on setting up the `world_x` schema sample.
