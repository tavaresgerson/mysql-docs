### 24.3.4 The INFORMATION\_SCHEMA COLLATION\_CHARACTER\_SET\_APPLICABILITY Table

The [`COLLATION_CHARACTER_SET_APPLICABILITY`](information-schema-collation-character-set-applicability-table.html "24.3.4 The INFORMATION_SCHEMA COLLATION_CHARACTER_SET_APPLICABILITY Table") table indicates what character set is applicable for what collation.

The [`COLLATION_CHARACTER_SET_APPLICABILITY`](information-schema-collation-character-set-applicability-table.html "24.3.4 The INFORMATION_SCHEMA COLLATION_CHARACTER_SET_APPLICABILITY Table") table has these columns:

* `COLLATION_NAME`

  The collation name.

* `CHARACTER_SET_NAME`

  The name of the character set with which the collation is associated.

#### Notes

The [`COLLATION_CHARACTER_SET_APPLICABILITY`](information-schema-collation-character-set-applicability-table.html "24.3.4 The INFORMATION_SCHEMA COLLATION_CHARACTER_SET_APPLICABILITY Table") columns are equivalent to the first two columns displayed by the [`SHOW COLLATION`](show-collation.html "13.7.5.4 SHOW COLLATION Statement") statement.
