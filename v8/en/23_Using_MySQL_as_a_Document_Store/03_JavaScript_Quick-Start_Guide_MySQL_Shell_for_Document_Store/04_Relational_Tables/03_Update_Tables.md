#### 22.3.4.3 Update Tables

You can use the `update()` method to modify one or more records in a table. The `update()` method works by filtering a query to include only the records to be updated and then applying the operations you specify to those records.

To replace a city name in the city table, pass to the `set()` method the new city name. Then, pass to the `where()` method the city name to locate and replace. The following example replaces the city Peking with Beijing.

```
mysql-js> db.city.update().set("Name", "Beijing").where("Name = 'Peking'")
```

Use the `select()` method to verify the change.

```
mysql-js> db.city.select(["ID", "Name", "CountryCode", "District", "Info"]).where("Name = 'Beijing'")
+------+-----------+-------------+----------+-----------------------------+
| ID   | Name      | CountryCode | District | Info                        |
+------+-----------+-------------+----------+-----------------------------+
| 1891 | Beijing   | CHN         | Peking   | {"Population": 7472000}     |
+------+-----------+-------------+----------+-----------------------------+
1 row in set (0.00 sec)
```

##### Related Information

* See TableUpdateFunction for the full syntax definition.
