### 27.7.3 JSON Duality View Metadata

You can obtain information about existing JSON duality views from
the following Information Schema tables which have been
implemented in this release:

* [`JSON_DUALITY_VIEWS`](information-schema-json-duality-views-table.html "28.3.18 The INFORMATION SCHEMA JSON_DUALITY_VIEWS Table"): Provides
  per-view information about JSON duality views.

* [`JSON_DUALITY_VIEW_COLUMNS`](information-schema-json-duality-view-columns-table.html "28.3.19 The INFORMATION SCHEMA JSON_DUALITY_VIEW_COLUMNS Table"):
  Provides information about columns defined in JSON duality
  views.

* [`JSON_DUALITY_VIEW_LINKS`](information-schema-json-duality-view-links-table.html "28.3.20 The INFORMATION SCHEMA JSON_DUALITY_VIEW_LINKS Table"):
  Describes parent-child relationships between JSON duality
  views and their base tables.

* [`JSON_DUALITY_VIEW_TABLES`](information-schema-json-duality-view-tables-table.html "28.3.21 The INFORMATION SCHEMA JSON_DUALITY_VIEW_TABLES Table"):
  Provides information about tables referenced by JSON duality
  views.

See the descriptions of the individual tables for more
information.

JSON duality views are also supported as a feature by the Option
Tracker component, which exposes a status variable
[`option_tracker_usage:JSON Duality
View`](option-tracker-component-status-variables.html#statvar_option_tracker_usage-JSON_Duality_View); this variable stores the number of times that any
JSON duality views have been opened by the server.