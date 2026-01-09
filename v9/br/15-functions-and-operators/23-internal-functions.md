## 14.23 Funções Internas

**Tabela 14.33 Funções Internas**

<table frame="box" rules="all" summary="Uma referência que lista funções destinadas apenas para uso interno pelo servidor.">
<tr><th>Nome</th> <th>Descrição</th> </tr>
<tr><td><code>CAN_ACCESS_COLUMN()</code></td> <td> Uso interno apenas </td> </tr>
<tr><td><code>CAN_ACCESS_DATABASE()</code></td> <td> Uso interno apenas </td> </tr>
<tr><td><code>CAN_ACCESS_TABLE()</code></td> <td> Uso interno apenas </td> </tr>
<tr><td><code>CAN_ACCESS_USER()</code></td> <td> Uso interno apenas </td> </tr>
<tr><td><code>CAN_ACCESS_VIEW()</code></td> <td> Uso interno apenas </td> </tr>
<tr><td><code>GET_DD_COLUMN_PRIVILEGES()</code></td> <td> Uso interno apenas </td> </tr>
<tr><td><code>GET_DD_CREATE_OPTIONS()</code></td> <td> Uso interno apenas </td> </tr>
<tr><td><code>GET_DD_INDEX_SUB_PART_LENGTH()</code></td> <td> Uso interno apenas </td> </tr>
<tr><td><code>INTERNAL_AUTO_INCREMENT()</code></td> <td> Uso interno apenas </td> </tr>
<tr><td><code>INTERNAL_AVG_ROW_LENGTH()</code></td> <td> Uso interno apenas </td> </tr>
<tr><td><code>INTERNAL_CHECK_TIME()</code></td> <td> Uso interno apenas </td> </tr>
<tr><td><code>INTERNAL_CHECKSUM()</code></td> <td> Uso interno apenas </td> </tr>
<tr><td><code>INTERNAL_DATA_FREE()</code></td> <td> Uso interno apenas </td> </tr>
<tr><td><code>INTERNAL_DATA_LENGTH()</code></td> <td> Uso interno apenas </td> </tr>
<tr><td><code>INTERNAL_DD_CHAR_LENGTH()</code></td> <td> Uso interno apenas </td> </tr>
<tr><td><code>INTERNAL_GET_COMMENT_OR_ERROR()</code></td> <td> Uso interno apenas </td> </tr>
<tr><td><code>INTERNAL_GET_ENABLED_ROLE_JSON()</code></td> <td> Uso interno apenas </td> </tr>
<tr><td><code>INTERNAL_GET_HOSTNAME()</code></td> <td> Uso interno apenas </td> </tr>
<tr><td><code>INTERNAL_GET_USERNAME()</code></td>

As funções listadas nesta seção são destinadas apenas para uso interno pelo servidor. Tentativas de invocação por parte dos usuários resultam em um erro.

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