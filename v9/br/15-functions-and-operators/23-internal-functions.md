## 14.23 Funções Internas

**Tabela 14.33 Funções Internas**

<table frame="box" rules="all" summary="Uma referência que lista funções destinadas apenas para uso interno pelo servidor.">
<tr><th>Nome</th> <th>Descrição</th> </tr>
<tr><td><a class="link" href="internal-functions.html#function_can-access-column"><code class="literal">CAN_ACCESS_COLUMN()</code></a></td> <td> Uso interno apenas </td> </tr>
<tr><td><a class="link" href="internal-functions.html#function_can-access-database"><code class="literal">CAN_ACCESS_DATABASE()</code></a></td> <td> Uso interno apenas </td> </tr>
<tr><td><a class="link" href="internal-functions.html#function_can-access-table"><code class="literal">CAN_ACCESS_TABLE()</code></a></td> <td> Uso interno apenas </td> </tr>
<tr><td><a class="link" href="internal-functions.html#function_can-access-user"><code class="literal">CAN_ACCESS_USER()</code></a></td> <td> Uso interno apenas </td> </tr>
<tr><td><a class="link" href="internal-functions.html#function_can-access-view"><code class="literal">CAN_ACCESS_VIEW()</code></a></td> <td> Uso interno apenas </td> </tr>
<tr><td><a class="link" href="internal-functions.html#function_get-dd-column-privileges"><code class="literal">GET_DD_COLUMN_PRIVILEGES()</code></a></td> <td> Uso interno apenas </td> </tr>
<tr><td><a class="link" href="internal-functions.html#function_get-dd-create-options"><code class="literal">GET_DD_CREATE_OPTIONS()</code></a></td> <td> Uso interno apenas </td> </tr>
<tr><td><a class="link" href="internal-functions.html#function_get-dd-index-sub-part-length"><code class="literal">GET_DD_INDEX_SUB_PART_LENGTH()</code></a></td> <td> Uso interno apenas </td> </tr>
<tr><td><a class="link" href="internal-functions.html#function_internal-auto-increment"><code class="literal">INTERNAL_AUTO_INCREMENT()</code></a></td> <td> Uso interno apenas </td> </tr>
<tr><td><a class="link" href="internal-functions.html#function_internal-avg-row-length"><code class="literal">INTERNAL_AVG_ROW_LENGTH()</code></a></td> <td> Uso interno apenas </td> </tr>
<tr><td><a class="link" href="internal-functions.html#function_internal-check-time"><code class="literal">INTERNAL_CHECK_TIME()</code></a></td> <td> Uso interno apenas </td> </tr>
<tr><td><a class="link" href="internal-functions.html#function_internal-checksum"><code class="literal">INTERNAL_CHECKSUM()</code></a></td> <td> Uso interno apenas </td> </tr>
<tr><td><a class="link" href="internal-functions.html#function_internal-data-free"><code class="literal">INTERNAL_DATA_FREE()</code></a></td> <td> Uso interno apenas </td> </tr>
<tr><td><a class="link" href="internal-functions.html#function_internal-data-length"><code class="literal">INTERNAL_DATA_LENGTH()</code></a></td> <td> Uso interno apenas </td> </tr>
<tr><td><a class="link" href="internal-functions.html#function_internal-dd-char-length"><code class="literal">INTERNAL_DD_CHAR_LENGTH()</code></a></td> <td> Uso interno apenas </td> </tr>
<tr><td><a class="link" href="internal-functions.html#function_internal-get-comment-or-error"><code class="literal">INTERNAL_GET_COMMENT_OR_ERROR()</code></a></td> <td> Uso interno apenas </td> </tr>
<tr><td><a class="link" href="internal-functions.html#function_internal-get-enabled-role-json"><code class="literal">INTERNAL_GET_ENABLED_ROLE_JSON()</code></a></td> <td> Uso interno apenas </td> </tr>
<tr><td><a class="link" href="internal-functions.html#function_internal-get-hostname"><code class="literal">INTERNAL_GET_HOSTNAME()</code></a></td> <td> Uso interno apenas </td> </tr>
<tr><td><a class="link" href="internal-functions.html#function_internal-get-username"><code class="literal">INTERNAL_GET_USERNAME()</code></a></td>

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