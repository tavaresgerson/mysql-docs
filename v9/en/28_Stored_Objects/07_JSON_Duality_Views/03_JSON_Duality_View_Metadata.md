### 27.7.3 JSON Duality View Metadata

You can obtain information about existing JSON duality views from the following Information Schema tables which have been implemented in this release:

* `JSON_DUALITY_VIEWS`: Provides per-view information about JSON duality views.

* `JSON_DUALITY_VIEW_COLUMNS`: Provides information about columns defined in JSON duality views.

* `JSON_DUALITY_VIEW_LINKS`: Describes parent-child relationships between JSON duality views and their base tables.

* `JSON_DUALITY_VIEW_TABLES`: Provides information about tables referenced by JSON duality views.

See the descriptions of the individual tables for more information.

JSON duality views are also supported as a feature by the Option Tracker component, which exposes a status variable `option_tracker_usage:JSON Duality View`; this variable stores the number of times that any JSON duality views have been opened by the server.
