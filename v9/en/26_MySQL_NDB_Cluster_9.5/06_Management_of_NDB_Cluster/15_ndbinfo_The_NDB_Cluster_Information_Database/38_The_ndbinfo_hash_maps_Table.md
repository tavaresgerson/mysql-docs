#### 25.6.15.38 The ndbinfo hash\_maps Table

* `id`

  The hash map's unique ID

* `version`

  Hash map version (integer)

* `state`

  Hash map state; see [Object::State](/doc/ndbapi/en/ndb-object.html#ndb-object-state) for
  values and descriptions.

* `fq_name`

  The hash map's fully qualified name

The `hash_maps` table is actually a view
consisting of the four columns having the same names of the
[`dict_obj_info`](mysql-cluster-ndbinfo-dict-obj-info.html "25.6.15.25 The ndbinfo dict_obj_info Table") table, as shown
here:

```
CREATE VIEW hash_maps AS
  SELECT id, version, state, fq_name
  FROM dict_obj_info
  WHERE type=24;  # Hash map; defined in dict_obj_types
```

See the description of
[`dict_obj_info`](mysql-cluster-ndbinfo-dict-obj-info.html "25.6.15.25 The ndbinfo dict_obj_info Table") for more
information.