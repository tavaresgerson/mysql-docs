## 14.22 Internal Functions

**Table 14.32 Internal Functions**

<table summary="A reference that lists functions intended only for internal use by the server."><thead><tr><th>Name</th> <th>Description</th> <th>Introduced</th> </tr></thead><tbody><tr><th><code>CAN_ACCESS_COLUMN()</code></th> <td> Internal use only </td> <td></td> </tr><tr><th><code>CAN_ACCESS_DATABASE()</code></th> <td> Internal use only </td> <td></td> </tr><tr><th><code>CAN_ACCESS_TABLE()</code></th> <td> Internal use only </td> <td></td> </tr><tr><th><code>CAN_ACCESS_USER()</code></th> <td> Internal use only </td> <td>8.0.22</td> </tr><tr><th><code>CAN_ACCESS_VIEW()</code></th> <td> Internal use only </td> <td></td> </tr><tr><th><code>GET_DD_COLUMN_PRIVILEGES()</code></th> <td> Internal use only </td> <td></td> </tr><tr><th><code>GET_DD_CREATE_OPTIONS()</code></th> <td> Internal use only </td> <td></td> </tr><tr><th><code>GET_DD_INDEX_SUB_PART_LENGTH()</code></th> <td> Internal use only </td> <td></td> </tr><tr><th><code>INTERNAL_AUTO_INCREMENT()</code></th> <td> Internal use only </td> <td></td> </tr><tr><th><code>INTERNAL_AVG_ROW_LENGTH()</code></th> <td> Internal use only </td> <td></td> </tr><tr><th><code>INTERNAL_CHECK_TIME()</code></th> <td> Internal use only </td> <td></td> </tr><tr><th><code>INTERNAL_CHECKSUM()</code></th> <td> Internal use only </td> <td></td> </tr><tr><th><code>INTERNAL_DATA_FREE()</code></th> <td> Internal use only </td> <td></td> </tr><tr><th><code>INTERNAL_DATA_LENGTH()</code></th> <td> Internal use only </td> <td></td> </tr><tr><th><code>INTERNAL_DD_CHAR_LENGTH()</code></th> <td> Internal use only </td> <td></td> </tr><tr><th><code>INTERNAL_GET_COMMENT_OR_ERROR()</code></th> <td> Internal use only </td> <td></td> </tr><tr><th><code>INTERNAL_GET_ENABLED_ROLE_JSON()</code></th> <td> Internal use only </td> <td>8.0.19</td> </tr><tr><th><code>INTERNAL_GET_HOSTNAME()</code></th> <td> Internal use only </td> <td>8.0.19</td> </tr><tr><th><code>INTERNAL_GET_USERNAME()</code></th> <td> Internal use only </td> <td>8.0.19</td> </tr><tr><th><code>INTERNAL_GET_VIEW_WARNING_OR_ERROR()</code></th> <td> Internal use only </td> <td></td> </tr><tr><th><code>INTERNAL_INDEX_COLUMN_CARDINALITY()</code></th> <td> Internal use only </td> <td></td> </tr><tr><th><code>INTERNAL_INDEX_LENGTH()</code></th> <td> Internal use only </td> <td></td> </tr><tr><th><code>INTERNAL_IS_ENABLED_ROLE()</code></th> <td> Internal use only </td> <td>8.0.19</td> </tr><tr><th><code>INTERNAL_IS_MANDATORY_ROLE()</code></th> <td> Internal use only </td> <td>8.0.19</td> </tr><tr><th><code>INTERNAL_KEYS_DISABLED()</code></th> <td> Internal use only </td> <td></td> </tr><tr><th><code>INTERNAL_MAX_DATA_LENGTH()</code></th> <td> Internal use only </td> <td></td> </tr><tr><th><code>INTERNAL_TABLE_ROWS()</code></th> <td> Internal use only </td> <td></td> </tr><tr><th><code>INTERNAL_UPDATE_TIME()</code></th> <td> Internal use only </td> <td></td> </tr></tbody></table>

The functions listed in this section are intended only for internal use by the server. Attempts by users to invoke them result in an error.

* `CAN_ACCESS_COLUMN(ARGS)`
* `CAN_ACCESS_DATABASE(ARGS)`
* `CAN_ACCESS_TABLE(ARGS)`
* `CAN_ACCESS_USER(ARGS)`
* `CAN_ACCESS_VIEW(ARGS)`
* `GET_DD_COLUMN_PRIVILEGES(ARGS)`
* `GET_DD_CREATE_OPTIONS(ARGS)`
* `GET_DD_INDEX_SUB_PART_LENGTH(ARGS)`
* `INTERNAL_AUTO_INCREMENT(ARGS)`
* `INTERNAL_AVG_ROW_LENGTH(ARGS)`
* `INTERNAL_CHECK_TIME(ARGS)`
* `INTERNAL_CHECKSUM(ARGS)`
* `INTERNAL_DATA_FREE(ARGS)`
* `INTERNAL_DATA_LENGTH(ARGS)`
* `INTERNAL_DD_CHAR_LENGTH(ARGS)`
* `INTERNAL_GET_COMMENT_OR_ERROR(ARGS)`
* `INTERNAL_GET_ENABLED_ROLE_JSON(ARGS)`
* `INTERNAL_GET_HOSTNAME(ARGS)`
* `INTERNAL_GET_USERNAME(ARGS)`
* `INTERNAL_GET_VIEW_WARNING_OR_ERROR(ARGS)`
* `INTERNAL_INDEX_COLUMN_CARDINALITY(ARGS)`
* `INTERNAL_INDEX_LENGTH(ARGS)`
* `INTERNAL_IS_ENABLED_ROLE(ARGS)`
* `INTERNAL_IS_MANDATORY_ROLE(ARGS)`
* `INTERNAL_KEYS_DISABLED(ARGS)`
* `INTERNAL_MAX_DATA_LENGTH(ARGS)`
* `INTERNAL_TABLE_ROWS(ARGS)`
* `INTERNAL_UPDATE_TIME(ARGS)`
* `IS_VISIBLE_DD_OBJECT(ARGS)`
