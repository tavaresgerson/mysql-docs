#### 21.6.15.8 The ndbinfo config\_params Table

The `config_params` table is a static table which provides the names and internal ID numbers of and other information about NDB Cluster configuration parameters.

The `config_params` table contains the following columns:

* `param_number`

  The parameter's internal ID number

* `param_name`

  The name of the parameter

* `param_description`

  A brief description of the parameter

* `param_type`

  The parameter's data type

* `param_default`

  The parameter's default value, if any

* `param_min`

  The parameter's maximum value, if any

* `param_max`

  The parameter's minimum value, if any

* `param_mandatory`

  This is 1 if the parameter is required, otherwise 0

* `param_status`

  Currently unused

##### Notes

In NDB Cluster 7.5 (and later), this table is read-only. The `param_description`, `param_type`, `param_default`, `param_min`, `param_max`, `param_mandatory`, and `param_status` columns were all added in NDB 7.5.0.

Although this is a static table, its content can vary between NDB Cluster installations, since supported parameters can vary due to differences between software releases, cluster hardware configurations, and other factors.
