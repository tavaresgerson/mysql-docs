## 14.22 Funções internas

**Tabela 14.32 Funções Internas**

<table summary="Uma referência que lista funções destinadas apenas para uso interno pelo servidor."><thead><tr><th>Nome</th> <th>Descrição</th> <th>Introduzido</th> </tr></thead><tbody><tr><th>[[PH_HTML_CODE_<code>INTERNAL_CHECK_TIME()</code>]</th> <td>Uso interno apenas</td> <td></td> </tr><tr><th>[[PH_HTML_CODE_<code>INTERNAL_CHECK_TIME()</code>]</th> <td>Uso interno apenas</td> <td></td> </tr><tr><th>[[PH_HTML_CODE_<code>INTERNAL_DATA_FREE()</code>]</th> <td>Uso interno apenas</td> <td></td> </tr><tr><th>[[PH_HTML_CODE_<code>INTERNAL_DATA_LENGTH()</code>]</th> <td>Uso interno apenas</td> <td>8.0.22</td> </tr><tr><th>[[PH_HTML_CODE_<code>INTERNAL_DD_CHAR_LENGTH()</code>]</th> <td>Uso interno apenas</td> <td></td> </tr><tr><th>[[PH_HTML_CODE_<code>INTERNAL_GET_COMMENT_OR_ERROR()</code>]</th> <td>Uso interno apenas</td> <td></td> </tr><tr><th>[[PH_HTML_CODE_<code>INTERNAL_GET_ENABLED_ROLE_JSON()</code>]</th> <td>Uso interno apenas</td> <td></td> </tr><tr><th>[[PH_HTML_CODE_<code>INTERNAL_GET_HOSTNAME()</code>]</th> <td>Uso interno apenas</td> <td></td> </tr><tr><th>[[PH_HTML_CODE_<code>INTERNAL_GET_USERNAME()</code>]</th> <td>Uso interno apenas</td> <td></td> </tr><tr><th>[[PH_HTML_CODE_<code>INTERNAL_GET_VIEW_WARNING_OR_ERROR()</code>]</th> <td>Uso interno apenas</td> <td></td> </tr><tr><th>[[<code>INTERNAL_CHECK_TIME()</code>]]</th> <td>Uso interno apenas</td> <td></td> </tr><tr><th>[[<code>CAN_ACCESS_DATABASE()</code><code>INTERNAL_CHECK_TIME()</code>]</th> <td>Uso interno apenas</td> <td></td> </tr><tr><th>[[<code>INTERNAL_DATA_FREE()</code>]]</th> <td>Uso interno apenas</td> <td></td> </tr><tr><th>[[<code>INTERNAL_DATA_LENGTH()</code>]]</th> <td>Uso interno apenas</td> <td></td> </tr><tr><th>[[<code>INTERNAL_DD_CHAR_LENGTH()</code>]]</th> <td>Uso interno apenas</td> <td></td> </tr><tr><th>[[<code>INTERNAL_GET_COMMENT_OR_ERROR()</code>]]</th> <td>Uso interno apenas</td> <td></td> </tr><tr><th>[[<code>INTERNAL_GET_ENABLED_ROLE_JSON()</code>]]</th> <td>Uso interno apenas</td> <td>8.0.19</td> </tr><tr><th>[[<code>INTERNAL_GET_HOSTNAME()</code>]]</th> <td>Uso interno apenas</td> <td>8.0.19</td> </tr><tr><th>[[<code>INTERNAL_GET_USERNAME()</code>]]</th> <td>Uso interno apenas</td> <td>8.0.19</td> </tr><tr><th>[[<code>INTERNAL_GET_VIEW_WARNING_OR_ERROR()</code>]]</th> <td>Uso interno apenas</td> <td></td> </tr><tr><th>[[<code>CAN_ACCESS_TABLE()</code><code>INTERNAL_CHECK_TIME()</code>]</th> <td>Uso interno apenas</td> <td></td> </tr><tr><th>[[<code>CAN_ACCESS_TABLE()</code><code>INTERNAL_CHECK_TIME()</code>]</th> <td>Uso interno apenas</td> <td></td> </tr><tr><th>[[<code>CAN_ACCESS_TABLE()</code><code>INTERNAL_DATA_FREE()</code>]</th> <td>Uso interno apenas</td> <td>8.0.19</td> </tr><tr><th>[[<code>CAN_ACCESS_TABLE()</code><code>INTERNAL_DATA_LENGTH()</code>]</th> <td>Uso interno apenas</td> <td>8.0.19</td> </tr><tr><th>[[<code>CAN_ACCESS_TABLE()</code><code>INTERNAL_DD_CHAR_LENGTH()</code>]</th> <td>Uso interno apenas</td> <td></td> </tr><tr><th>[[<code>CAN_ACCESS_TABLE()</code><code>INTERNAL_GET_COMMENT_OR_ERROR()</code>]</th> <td>Uso interno apenas</td> <td></td> </tr><tr><th>[[<code>CAN_ACCESS_TABLE()</code><code>INTERNAL_GET_ENABLED_ROLE_JSON()</code>]</th> <td>Uso interno apenas</td> <td></td> </tr><tr><th>[[<code>CAN_ACCESS_TABLE()</code><code>INTERNAL_GET_HOSTNAME()</code>]</th> <td>Uso interno apenas</td> <td></td> </tr></tbody></table>

As funções listadas nesta seção são destinadas apenas para uso interno pelo servidor. Tentativas dos usuários de invocá-las resultam em um erro.

- `CAN_ACCESS_COLUMN(ARGS)`
- `CAN_ACCESS_DATABASE(ARGS)`
- `CAN_ACCESS_TABLE(ARGS)`
- `CAN_ACCESS_USER(ARGS)`
- `CAN_ACCESS_VIEW(ARGS)`
- `GET_DD_COLUMN_PRIVILEGES(ARGS)`
- `GET_DD_CREATE_OPTIONS(ARGS)`
- `GET_DD_INDEX_SUB_PART_LENGTH(ARGS)`
- `INTERNAL_AUTO_INCREMENT(ARGS)`
- `INTERNAL_AVG_ROW_LENGTH(ARGS)`
- `INTERNAL_CHECK_TIME(ARGS)`
- `INTERNAL_CHECKSUM(ARGS)`
- `INTERNAL_DATA_FREE(ARGS)`
- `INTERNAL_DATA_LENGTH(ARGS)`
- `INTERNAL_DD_CHAR_LENGTH(ARGS)`
- `INTERNAL_GET_COMMENT_OR_ERROR(ARGS)`
- `INTERNAL_GET_ENABLED_ROLE_JSON(ARGS)`
- `INTERNAL_GET_HOSTNAME(ARGS)`
- `INTERNAL_GET_USERNAME(ARGS)`
- `INTERNAL_GET_VIEW_WARNING_OR_ERROR(ARGS)`
- `INTERNAL_INDEX_COLUMN_CARDINALITY(ARGS)`
- `INTERNAL_INDEX_LENGTH(ARGS)`
- `INTERNAL_IS_ENABLED_ROLE(ARGS)`
- `INTERNAL_IS_MANDATORY_ROLE(ARGS)`
- `INTERNAL_KEYS_DISABLED(ARGS)`
- `INTERNAL_MAX_DATA_LENGTH(ARGS)`
- `INTERNAL_TABLE_ROWS(ARGS)`
- `INTERNAL_UPDATE_TIME(ARGS)`
- `IS_VISIBLE_DD_OBJECT(ARGS)`
