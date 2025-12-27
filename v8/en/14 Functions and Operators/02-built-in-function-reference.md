## 14.1 Built-In Function and Operator Reference

The following table lists each built-in (native) function and operator and provides a short description of each one. For a table listing functions that are loadable at runtime, see Section 14.2, “Loadable Function Reference”.

**Table 14.1 Built-In Functions and Operators**

<table>
   <thead>
      <tr>
         <th>Name</th>
         <th>Description</th>
         <th>Deprecated</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <th><code>&amp;</code></th>
         <td> Bitwise AND </td>
         <td></td>
      </tr>
      <tr>
         <th><code>&gt;</code></th>
         <td> Greater than operator </td>
         <td></td>
      </tr>
      <tr>
         <th><code>&gt;&gt;</code></th>
         <td> Right shift </td>
         <td></td>
      </tr>
      <tr>
         <th><code>&gt;=</code></th>
         <td> Greater than or equal operator </td>
         <td></td>
      </tr>
      <tr>
         <th><code>&lt;</code></th>
         <td> Less than operator </td>
         <td></td>
      </tr>
      <tr>
         <th><code>&lt;&gt;</code>, <code>!=</code></th>
         <td> Not equal operator </td>
         <td></td>
      </tr>
      <tr>
         <th><code>&lt;&lt;</code></th>
         <td> Left shift </td>
         <td></td>
      </tr>
      <tr>
         <th><code>&lt;=</code></th>
         <td> Less than or equal operator </td>
         <td></td>
      </tr>
      <tr>
         <th><code>&lt;=&gt;</code></th>
         <td> NULL-safe equal to operator </td>
         <td></td>
      </tr>
      <tr>
         <th><code>%</code>, <code>MOD</code></th>
         <td> Modulo operator </td>
         <td></td>
      </tr>
      <tr>
         <th><code>*</code></th>
         <td> Multiplication operator </td>
         <td></td>
      </tr>
      <tr>
         <th><code>+</code></th>
         <td> Addition operator </td>
         <td></td>
      </tr>
      <tr>
         <th><code>-</code></th>
         <td> Minus operator </td>
         <td></td>
      </tr>
      <tr>
         <th><code>-</code></th>
         <td> Change the sign of the argument </td>
         <td></td>
      </tr>
      <tr>
         <th><code>-&gt;</code></th>
         <td> Return value from JSON column after evaluating path; equivalent to JSON_EXTRACT(). </td>
         <td></td>
      </tr>
      <tr>
         <th><code>-&gt;&gt;</code></th>
         <td> Return value from JSON column after evaluating path and unquoting the result; equivalent to JSON_UNQUOTE(JSON_EXTRACT()). </td>
         <td></td>
      </tr>
      <tr>
         <th><code>/</code></th>
         <td> Division operator </td>
         <td></td>
      </tr>
      <tr>
         <th><code>:=</code></th>
         <td> Assign a value </td>
         <td></td>
      </tr>
      <tr>
         <th><code>=</code></th>
         <td> Assign a value (as part of a <code>SET</code> statement, or as part of the <code>SET</code> clause in an <code>UPDATE</code> statement) </td>
         <td></td>
      </tr>
      <tr>
         <th><code>=</code></th>
         <td> Equal operator </td>
         <td></td>
      </tr>
      <tr>
         <th><code>^</code></th>
         <td> Bitwise XOR </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ABS()</code></th>
         <td> Return the absolute value </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ACOS()</code></th>
         <td> Return the arc cosine </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ADDDATE()</code></th>
         <td> Add time values (intervals) to a date value </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ADDTIME()</code></th>
         <td> Add time </td>
         <td></td>
      </tr>
      <tr>
         <th><code>AES_DECRYPT()</code></th>
         <td> Decrypt using AES </td>
         <td></td>
      </tr>
      <tr>
         <th><code>AES_ENCRYPT()</code></th>
         <td> Encrypt using AES </td>
         <td></td>
      </tr>
      <tr>
         <th><code>AND</code>, <code>&amp;&amp;</code></th>
         <td> Logical AND </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ANY_VALUE()</code></th>
         <td> Suppress ONLY_FULL_GROUP_BY value rejection </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ASCII()</code></th>
         <td> Return numeric value of left-most character </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ASIN()</code></th>
         <td> Return the arc sine </td>
         <td></td>
      </tr>
      <tr>
         <th><code>asynchronous_connection_failover_add_managed()</code></th>
         <td> Add group member source server configuration information to a replication channel source list </td>
         <td></td>
      </tr>
      <tr>
         <th><code>asynchronous_connection_failover_add_source()</code></th>
         <td> Add source server configuration information server to a replication channel source list </td>
         <td></td>
      </tr>
      <tr>
         <th><code>asynchronous_connection_failover_delete_managed()</code></th>
         <td> Remove a managed group from a replication channel source list </td>
         <td></td>
      </tr>
      <tr>
         <th><code>asynchronous_connection_failover_delete_source()</code></th>
         <td> Remove a source server from a replication channel source list </td>
         <td></td>
      </tr>
      <tr>
         <th><code>asynchronous_connection_failover_reset()</code></th>
         <td> Remove all settings relating to group replication asynchronous failover </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ATAN()</code></th>
         <td> Return the arc tangent </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ATAN2()</code>, <code>ATAN()</code></th>
         <td> Return the arc tangent of the two arguments </td>
         <td></td>
      </tr>
      <tr>
         <th><code>AVG()</code></th>
         <td> Return the average value of the argument </td>
         <td></td>
      </tr>
      <tr>
         <th><code>BENCHMARK()</code></th>
         <td> Repeatedly execute an expression </td>
         <td></td>
      </tr>
      <tr>
         <th><code>BETWEEN ... AND ...</code></th>
         <td> Whether a value is within a range of values </td>
         <td></td>
      </tr>
      <tr>
         <th><code>BIN()</code></th>
         <td> Return a string containing binary representation of a number </td>
         <td></td>
      </tr>
      <tr>
         <th><code>BIN_TO_UUID()</code></th>
         <td> Convert binary UUID to string </td>
         <td></td>
      </tr>
      <tr>
         <th><code>BINARY</code></th>
         <td> Cast a string to a binary string </td>
         <td>Yes</td>
      </tr>
      <tr>
         <th><code>BIT_AND()</code></th>
         <td> Return bitwise AND </td>
         <td></td>
      </tr>
      <tr>
         <th><code>BIT_COUNT()</code></th>
         <td> Return the number of bits that are set </td>
         <td></td>
      </tr>
      <tr>
         <th><code>BIT_LENGTH()</code></th>
         <td> Return length of argument in bits </td>
         <td></td>
      </tr>
      <tr>
         <th><code>BIT_OR()</code></th>
         <td> Return bitwise OR </td>
         <td></td>
      </tr>
      <tr>
         <th><code>BIT_XOR()</code></th>
         <td> Return bitwise XOR </td>
         <td></td>
      </tr>
      <tr>
         <th><code>CAN_ACCESS_COLUMN()</code></th>
         <td> Internal use only </td>
         <td></td>
      </tr>
      <tr>
         <th><code>CAN_ACCESS_DATABASE()</code></th>
         <td> Internal use only </td>
         <td></td>
      </tr>
      <tr>
         <th><code>CAN_ACCESS_TABLE()</code></th>
         <td> Internal use only </td>
         <td></td>
      </tr>
      <tr>
         <th><code>CAN_ACCESS_USER()</code></th>
         <td> Internal use only </td>
         <td></td>
      </tr>
      <tr>
         <th><code>CAN_ACCESS_VIEW()</code></th>
         <td> Internal use only </td>
         <td></td>
      </tr>
      <tr>
         <th><code>CASE</code></th>
         <td> Case operator </td>
         <td></td>
      </tr>
      <tr>
         <th><code>CAST()</code></th>
         <td> Cast a value as a certain type </td>
         <td></td>
      </tr>
      <tr>
         <th><code>CEIL()</code></th>
         <td> Return the smallest integer value not less than the argument </td>
         <td></td>
      </tr>
      <tr>
         <th><code>CEILING()</code></th>
         <td> Return the smallest integer value not less than the argument </td>
         <td></td>
      </tr>
      <tr>
         <th><code>CHAR()</code></th>
         <td> Return the character for each integer passed </td>
         <td></td>
      </tr>
      <tr>
         <th><code>CHAR_LENGTH()</code></th>
         <td> Return number of characters in argument </td>
         <td></td>
      </tr>
      <tr>
         <th><code>CHARACTER_LENGTH()</code></th>
         <td> Synonym for CHAR_LENGTH() </td>
         <td></td>
      </tr>
      <tr>
         <th><code>CHARSET()</code></th>
         <td> Return the character set of the argument </td>
         <td></td>
      </tr>
      <tr>
         <th><code>COALESCE()</code></th>
         <td> Return the first non-NULL argument </td>
         <td></td>
      </tr>
      <tr>
         <th><code>COERCIBILITY()</code></th>
         <td> Return the collation coercibility value of the string argument </td>
         <td></td>
      </tr>
      <tr>
         <th><code>COLLATION()</code></th>
         <td> Return the collation of the string argument </td>
         <td></td>
      </tr>
      <tr>
         <th><code>COMPRESS()</code></th>
         <td> Return result as a binary string </td>
         <td></td>
      </tr>
      <tr>
         <th><code>CONCAT()</code></th>
         <td> Return concatenated string </td>
         <td></td>
      </tr>
      <tr>
         <th><code>CONCAT_WS()</code></th>
         <td> Return concatenate with separator </td>
         <td></td>
      </tr>
      <tr>
         <th><code>CONNECTION_ID()</code></th>
         <td> Return the connection ID (thread ID) for the connection </td>
         <td></td>
      </tr>
      <tr>
         <th><code>CONV()</code></th>
         <td> Convert numbers between different number bases </td>
         <td></td>
      </tr>
      <tr>
         <th><code>CONVERT()</code></th>
         <td> Cast a value as a certain type </td>
         <td></td>
      </tr>
      <tr>
         <th><code>CONVERT_TZ()</code></th>
         <td> Convert from one time zone to another </td>
         <td></td>
      </tr>
      <tr>
         <th><code>COS()</code></th>
         <td> Return the cosine </td>
         <td></td>
      </tr>
      <tr>
         <th><code>COT()</code></th>
         <td> Return the cotangent </td>
         <td></td>
      </tr>
      <tr>
         <th><code>COUNT()</code></th>
         <td> Return a count of the number of rows returned </td>
         <td></td>
      </tr>
      <tr>
         <th><code>COUNT(DISTINCT)</code></th>
         <td> Return the count of a number of different values </td>
         <td></td>
      </tr>
      <tr>
         <th><code>CRC32()</code></th>
         <td> Compute a cyclic redundancy check value </td>
         <td></td>
      </tr>
      <tr>
         <th><code>CUME_DIST()</code></th>
         <td> Cumulative distribution value </td>
         <td></td>
      </tr>
      <tr>
         <th><code>CURDATE()</code></th>
         <td> Return the current date </td>
         <td></td>
      </tr>
      <tr>
         <th><code>CURRENT_DATE()</code>, <code>CURRENT_DATE</code></th>
         <td> Synonyms for CURDATE() </td>
         <td></td>
      </tr>
      <tr>
         <th><code>CURRENT_ROLE()</code></th>
         <td> Return the current active roles </td>
         <td></td>
      </tr>
      <tr>
         <th><code>CURRENT_TIME()</code>, <code>CURRENT_TIME</code></th>
         <td> Synonyms for CURTIME() </td>
         <td></td>
      </tr>
      <tr>
         <th><code>CURRENT_TIMESTAMP()</code>, <code>CURRENT_TIMESTAMP</code></th>
         <td> Synonyms for NOW() </td>
         <td></td>
      </tr>
      <tr>
         <th><code>CURRENT_USER()</code>, <code>CURRENT_USER</code></th>
         <td> The authenticated user name and host name </td>
         <td></td>
      </tr>
      <tr>
         <th><code>CURTIME()</code></th>
         <td> Return the current time </td>
         <td></td>
      </tr>
      <tr>
         <th><code>DATABASE()</code></th>
         <td> Return the default (current) database name </td>
         <td></td>
      </tr>
      <tr>
         <th><code>DATE()</code></th>
         <td> Extract the date part of a date or datetime expression </td>
         <td></td>
      </tr>
      <tr>
         <th><code>DATE_ADD()</code></th>
         <td> Add time values (intervals) to a date value </td>
         <td></td>
      </tr>
      <tr>
         <th><code>DATE_FORMAT()</code></th>
         <td> Format date as specified </td>
         <td></td>
      </tr>
      <tr>
         <th><code>DATE_SUB()</code></th>
         <td> Subtract a time value (interval) from a date </td>
         <td></td>
      </tr>
      <tr>
         <th><code>DATEDIFF()</code></th>
         <td> Subtract two dates </td>
         <td></td>
      </tr>
      <tr>
         <th><code>DAY()</code></th>
         <td> Synonym for DAYOFMONTH() </td>
         <td></td>
      </tr>
      <tr>
         <th><code>DAYNAME()</code></th>
         <td> Return the name of the weekday </td>
         <td></td>
      </tr>
      <tr>
         <th><code>DAYOFMONTH()</code></th>
         <td> Return the day of the month (0-31) </td>
         <td></td>
      </tr>
      <tr>
         <th><code>DAYOFWEEK()</code></th>
         <td> Return the weekday index of the argument </td>
         <td></td>
      </tr>
      <tr>
         <th><code>DAYOFYEAR()</code></th>
         <td> Return the day of the year (1-366) </td>
         <td></td>
      </tr>
      <tr>
         <th><code>DEFAULT()</code></th>
         <td> Return the default value for a table column </td>
         <td></td>
      </tr>
      <tr>
         <th><code>DEGREES()</code></th>
         <td> Convert radians to degrees </td>
         <td></td>
      </tr>
      <tr>
         <th><code>DENSE_RANK()</code></th>
         <td> Rank of current row within its partition, without gaps </td>
         <td></td>
      </tr>
      <tr>
         <th><code>DIV</code></th>
         <td> Integer division </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ELT()</code></th>
         <td> Return string at index number </td>
         <td></td>
      </tr>
      <tr>
         <th><code>EXISTS()</code></th>
         <td> Whether the result of a query contains any rows </td>
         <td></td>
      </tr>
      <tr>
         <th><code>EXP()</code></th>
         <td> Raise to the power of </td>
         <td></td>
      </tr>
      <tr>
         <th><code>EXPORT_SET()</code></th>
         <td> Return a string such that for every bit set in the value bits, you get an on string and for every unset bit, you get an off string </td>
         <td></td>
      </tr>
      <tr>
         <th><code>EXTRACT()</code></th>
         <td> Extract part of a date </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ExtractValue()</code></th>
         <td> Extract a value from an XML string using XPath notation </td>
         <td></td>
      </tr>
      <tr>
         <th><code>FIELD()</code></th>
         <td> Index (position) of first argument in subsequent arguments </td>
         <td></td>
      </tr>
      <tr>
         <th><code>FIND_IN_SET()</code></th>
         <td> Index (position) of first argument within second argument </td>
         <td></td>
      </tr>
      <tr>
         <th><code>FIRST_VALUE()</code></th>
         <td> Value of argument from first row of window frame </td>
         <td></td>
      </tr>
      <tr>
         <th><code>FLOOR()</code></th>
         <td> Return the largest integer value not greater than the argument </td>
         <td></td>
      </tr>
      <tr>
         <th><code>FORMAT()</code></th>
         <td> Return a number formatted to specified number of decimal places </td>
         <td></td>
      </tr>
      <tr>
         <th><code>FORMAT_BYTES()</code></th>
         <td> Convert byte count to value with units </td>
         <td></td>
      </tr>
      <tr>
         <th><code>FORMAT_PICO_TIME()</code></th>
         <td> Convert time in picoseconds to value with units </td>
         <td></td>
      </tr>
      <tr>
         <th><code>FOUND_ROWS()</code></th>
         <td> For a SELECT with a LIMIT clause, the number of rows that would be returned were there no LIMIT clause </td>
         <td></td>
      </tr>
      <tr>
         <th><code>FROM_BASE64()</code></th>
         <td> Decode base64 encoded string and return result </td>
         <td></td>
      </tr>
      <tr>
         <th><code>FROM_DAYS()</code></th>
         <td> Convert a day number to a date </td>
         <td></td>
      </tr>
      <tr>
         <th><code>FROM_UNIXTIME()</code></th>
         <td> Format Unix timestamp as a date </td>
         <td></td>
      </tr>
      <tr>
         <th><code>GeomCollection()</code></th>
         <td> Construct geometry collection from geometries </td>
         <td></td>
      </tr>
      <tr>
         <th><code>GeometryCollection()</code></th>
         <td> Construct geometry collection from geometries </td>
         <td></td>
      </tr>
      <tr>
         <th><code>GET_DD_COLUMN_PRIVILEGES()</code></th>
         <td> Internal use only </td>
         <td></td>
      </tr>
      <tr>
         <th><code>GET_DD_CREATE_OPTIONS()</code></th>
         <td> Internal use only </td>
         <td></td>
      </tr>
      <tr>
         <th><code>GET_DD_INDEX_SUB_PART_LENGTH()</code></th>
         <td> Internal use only </td>
         <td></td>
      </tr>
      <tr>
         <th><code>GET_FORMAT()</code></th>
         <td> Return a date format string </td>
         <td></td>
      </tr>
      <tr>
         <th><code>GET_LOCK()</code></th>
         <td> Get a named lock </td>
         <td></td>
      </tr>
      <tr>
         <th><code>GREATEST()</code></th>
         <td> Return the largest argument </td>
         <td></td>
      </tr>
      <tr>
         <th><code>GROUP_CONCAT()</code></th>
         <td> Return a concatenated string </td>
         <td></td>
      </tr>
      <tr>
         <th><code>group_replication_disable_member_action()</code></th>
         <td> Disable member action for event specified </td>
         <td></td>
      </tr>
      <tr>
         <th><code>group_replication_enable_member_action()</code></th>
         <td> Enable member action for event specified </td>
         <td></td>
      </tr>
      <tr>
         <th><code>group_replication_get_communication_protocol()</code></th>
         <td> Get version of group replication communication protocol currently in use </td>
         <td></td>
      </tr>
      <tr>
         <th><code>group_replication_get_write_concurrency()</code></th>
         <td> Get maximum number of consensus instances currently set for group </td>
         <td></td>
      </tr>
      <tr>
         <th><code>group_replication_reset_member_actions()</code></th>
         <td> Reset all member actions to defaults and configuration version number to 1 </td>
         <td></td>
      </tr>
      <tr>
         <th><code>group_replication_set_as_primary()</code></th>
         <td> Make a specific group member the primary </td>
         <td></td>
      </tr>
      <tr>
         <th><code>group_replication_set_communication_protocol()</code></th>
         <td> Set version for group replication communication protocol to use </td>
         <td></td>
      </tr>
      <tr>
         <th><code>group_replication_set_write_concurrency()</code></th>
         <td> Set maximum number of consensus instances that can be executed in parallel </td>
         <td></td>
      </tr>
      <tr>
         <th><code>group_replication_switch_to_multi_primary_mode()</code></th>
         <td> Changes the mode of a group running in single-primary mode to multi-primary mode </td>
         <td></td>
      </tr>
      <tr>
         <th><code>group_replication_switch_to_single_primary_mode()</code></th>
         <td> Changes the mode of a group running in multi-primary mode to single-primary mode </td>
         <td></td>
      </tr>
      <tr>
         <th><code>GROUPING()</code></th>
         <td> Distinguish super-aggregate ROLLUP rows from regular rows </td>
         <td></td>
      </tr>
      <tr>
         <th><code>HEX()</code></th>
         <td> Hexadecimal representation of decimal or string value </td>
         <td></td>
      </tr>
      <tr>
         <th><code>HOUR()</code></th>
         <td> Extract the hour </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ICU_VERSION()</code></th>
         <td> ICU library version </td>
         <td></td>
      </tr>
      <tr>
         <th><code>IF()</code></th>
         <td> If/else construct </td>
         <td></td>
      </tr>
      <tr>
         <th><code>IFNULL()</code></th>
         <td> Null if/else construct </td>
         <td></td>
      </tr>
      <tr>
         <th><code>IN()</code></th>
         <td> Whether a value is within a set of values </td>
         <td></td>
      </tr>
      <tr>
         <th><code>INET_ATON()</code></th>
         <td> Return the numeric value of an IP address </td>
         <td></td>
      </tr>
      <tr>
         <th><code>INET_NTOA()</code></th>
         <td> Return the IP address from a numeric value </td>
         <td></td>
      </tr>
      <tr>
         <th><code>INSERT()</code></th>
         <td> Insert substring at specified position up to specified number of characters </td>
         <td></td>
      </tr>
      <tr>
         <th><code>INSTR()</code></th>
         <td> Return the index of the first occurrence of substring </td>
         <td></td>
      </tr>
      <tr>
         <th><code>INTERNAL_AUTO_INCREMENT()</code></th>
         <td> Internal use only </td>
         <td></td>
      </tr>
      <tr>
         <th><code>INTERNAL_AVG_ROW_LENGTH()</code></th>
         <td> Internal use only </td>
         <td></td>
      </tr>
      <tr>
         <th><code>INTERNAL_CHECK_TIME()</code></th>
         <td> Internal use only </td>
         <td></td>
      </tr>
      <tr>
         <th><code>INTERNAL_CHECKSUM()</code></th>
         <td> Internal use only </td>
         <td></td>
      </tr>
      <tr>
         <th><code>INTERNAL_DATA_FREE()</code></th>
         <td> Internal use only </td>
         <td></td>
      </tr>
      <tr>
         <th><code>INTERNAL_DATA_LENGTH()</code></th>
         <td> Internal use only </td>
         <td></td>
      </tr>
      <tr>
         <th><code>INTERNAL_DD_CHAR_LENGTH()</code></th>
         <td> Internal use only </td>
         <td></td>
      </tr>
      <tr>
         <th><code>INTERNAL_GET_COMMENT_OR_ERROR()</code></th>
         <td> Internal use only </td>
         <td></td>
      </tr>
      <tr>
         <th><code>INTERNAL_GET_ENABLED_ROLE_JSON()</code></th>
         <td> Internal use only </td>
         <td></td>
      </tr>
      <tr>
         <th><code>INTERNAL_GET_HOSTNAME()</code></th>
         <td> Internal use only </td>
         <td></td>
      </tr>
      <tr>
         <th><code>INTERNAL_GET_USERNAME()</code></th>
         <td> Internal use only </td>
         <td></td>
      </tr>
      <tr>
         <th><code>INTERNAL_GET_VIEW_WARNING_OR_ERROR()</code></th>
         <td> Internal use only </td>
         <td></td>
      </tr>
      <tr>
         <th><code>INTERNAL_INDEX_COLUMN_CARDINALITY()</code></th>
         <td> Internal use only </td>
         <td></td>
      </tr>
      <tr>
         <th><code>INTERNAL_INDEX_LENGTH()</code></th>
         <td> Internal use only </td>
         <td></td>
      </tr>
      <tr>
         <th><code>INTERNAL_IS_ENABLED_ROLE()</code></th>
         <td> Internal use only </td>
         <td></td>
      </tr>
      <tr>
         <th><code>INTERNAL_IS_MANDATORY_ROLE()</code></th>
         <td> Internal use only </td>
         <td></td>
      </tr>
      <tr>
         <th><code>INTERNAL_KEYS_DISABLED()</code></th>
         <td> Internal use only </td>
         <td></td>
      </tr>
      <tr>
         <th><code>INTERNAL_MAX_DATA_LENGTH()</code></th>
         <td> Internal use only </td>
         <td></td>
      </tr>
      <tr>
         <th><code>INTERNAL_TABLE_ROWS()</code></th>
         <td> Internal use only </td>
         <td></td>
      </tr>
      <tr>
         <th><code>INTERNAL_UPDATE_TIME()</code></th>
         <td> Internal use only </td>
         <td></td>
      </tr>
      <tr>
         <th><code>INTERVAL()</code></th>
         <td> Return the index of the argument that is less than the first argument </td>
         <td></td>
      </tr>
      <tr>
         <th><code>IS</code></th>
         <td> Test a value against a boolean </td>
         <td></td>
      </tr>
      <tr>
         <th><code>IS_FREE_LOCK()</code></th>
         <td> Whether the named lock is free </td>
         <td></td>
      </tr>
      <tr>
         <th><code>IS NOT</code></th>
         <td> Test a value against a boolean </td>
         <td></td>
      </tr>
      <tr>
         <th><code>IS NOT NULL</code></th>
         <td> NOT NULL value test </td>
         <td></td>
      </tr>
      <tr>
         <th><code>IS NULL</code></th>
         <td> NULL value test </td>
         <td></td>
      </tr>
      <tr>
         <th><code>IS_USED_LOCK()</code></th>
         <td> Whether the named lock is in use; return connection identifier if true </td>
         <td></td>
      </tr>
      <tr>
         <th><code>IS_UUID()</code></th>
         <td> Whether argument is a valid UUID </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ISNULL()</code></th>
         <td> Test whether the argument is NULL </td>
         <td></td>
      </tr>
      <tr>
         <th><code>JSON_ARRAY()</code></th>
         <td> Create JSON array </td>
         <td></td>
      </tr>
      <tr>
         <th><code>JSON_ARRAY_APPEND()</code></th>
         <td> Append data to JSON document </td>
         <td></td>
      </tr>
      <tr>
         <th><code>JSON_ARRAY_INSERT()</code></th>
         <td> Insert into JSON array </td>
         <td></td>
      </tr>
      <tr>
         <th><code>JSON_ARRAYAGG()</code></th>
         <td> Return result set as a single JSON array </td>
         <td></td>
      </tr>
      <tr>
         <th><code>JSON_CONTAINS()</code></th>
         <td> Whether JSON document contains specific object at path </td>
         <td></td>
      </tr>
      <tr>
         <th><code>JSON_CONTAINS_PATH()</code></th>
         <td> Whether JSON document contains any data at path </td>
         <td></td>
      </tr>
      <tr>
         <th><code>JSON_DEPTH()</code></th>
         <td> Maximum depth of JSON document </td>
         <td></td>
      </tr>
      <tr>
         <th><code>JSON_EXTRACT()</code></th>
         <td> Return data from JSON document </td>
         <td></td>
      </tr>
      <tr>
         <th><code>JSON_INSERT()</code></th>
         <td> Insert data into JSON document </td>
         <td></td>
      </tr>
      <tr>
         <th><code>JSON_KEYS()</code></th>
         <td> Array of keys from JSON document </td>
         <td></td>
      </tr>
      <tr>
         <th><code>JSON_LENGTH()</code></th>
         <td> Number of elements in JSON document </td>
         <td></td>
      </tr>
      <tr>
         <th><code>JSON_MERGE()</code></th>
         <td> Merge JSON documents, preserving duplicate keys. Deprecated synonym for JSON_MERGE_PRESERVE() </td>
         <td>Yes</td>
      </tr>
      <tr>
         <th><code>JSON_MERGE_PATCH()</code></th>
         <td> Merge JSON documents, replacing values of duplicate keys </td>
         <td></td>
      </tr>
      <tr>
         <th><code>JSON_MERGE_PRESERVE()</code></th>
         <td> Merge JSON documents, preserving duplicate keys </td>
         <td></td>
      </tr>
      <tr>
         <th><code>JSON_OBJECT()</code></th>
         <td> Create JSON object </td>
         <td></td>
      </tr>
      <tr>
         <th><code>JSON_OBJECTAGG()</code></th>
         <td> Return result set as a single JSON object </td>
         <td></td>
      </tr>
      <tr>
         <th><code>JSON_OVERLAPS()</code></th>
         <td> Compares two JSON documents, returns TRUE (1) if these have any key-value pairs or array elements in common, otherwise FALSE (0) </td>
         <td></td>
      </tr>
      <tr>
         <th><code>JSON_PRETTY()</code></th>
         <td> Print a JSON document in human-readable format </td>
         <td></td>
      </tr>
      <tr>
         <th><code>JSON_QUOTE()</code></th>
         <td> Quote JSON document </td>
         <td></td>
      </tr>
      <tr>
         <th><code>JSON_REMOVE()</code></th>
         <td> Remove data from JSON document </td>
         <td></td>
      </tr>
      <tr>
         <th><code>JSON_REPLACE()</code></th>
         <td> Replace values in JSON document </td>
         <td></td>
      </tr>
      <tr>
         <th><code>JSON_SCHEMA_VALID()</code></th>
         <td> Validate JSON document against JSON schema; returns TRUE/1 if document validates against schema, or FALSE/0 if it does not </td>
         <td></td>
      </tr>
      <tr>
         <th><code>JSON_SCHEMA_VALIDATION_REPORT()</code></th>
         <td> Validate JSON document against JSON schema; returns report in JSON format on outcome on validation including success or failure and reasons for failure </td>
         <td></td>
      </tr>
      <tr>
         <th><code>JSON_SEARCH()</code></th>
         <td> Path to value within JSON document </td>
         <td></td>
      </tr>
      <tr>
         <th><code>JSON_SET()</code></th>
         <td> Insert data into JSON document </td>
         <td></td>
      </tr>
      <tr>
         <th><code>JSON_STORAGE_FREE()</code></th>
         <td> Freed space within binary representation of JSON column value following partial update </td>
         <td></td>
      </tr>
      <tr>
         <th><code>JSON_STORAGE_SIZE()</code></th>
         <td> Space used for storage of binary representation of a JSON document </td>
         <td></td>
      </tr>
      <tr>
         <th><code>JSON_TABLE()</code></th>
         <td> Return data from a JSON expression as a relational table </td>
         <td></td>
      </tr>
      <tr>
         <th><code>JSON_TYPE()</code></th>
         <td> Type of JSON value </td>
         <td></td>
      </tr>
      <tr>
         <th><code>JSON_UNQUOTE()</code></th>
         <td> Unquote JSON value </td>
         <td></td>
      </tr>
      <tr>
         <th><code>JSON_VALID()</code></th>
         <td> Whether JSON value is valid </td>
         <td></td>
      </tr>
      <tr>
         <th><code>JSON_VALUE()</code></th>
         <td> Extract value from JSON document at location pointed to by path provided; return this value as VARCHAR(512) or specified type </td>
         <td></td>
      </tr>
      <tr>
         <th><code>LAG()</code></th>
         <td> Value of argument from row lagging current row within partition </td>
         <td></td>
      </tr>
      <tr>
         <th><code>LAST_DAY</code></th>
         <td> Return the last day of the month for the argument </td>
         <td></td>
      </tr>
      <tr>
         <th><code>LAST_INSERT_ID()</code></th>
         <td> Value of the AUTOINCREMENT column for the last INSERT </td>
         <td></td>
      </tr>
      <tr>
         <th><code>LAST_VALUE()</code></th>
         <td> Value of argument from last row of window frame </td>
         <td></td>
      </tr>
      <tr>
         <th><code>LCASE()</code></th>
         <td> Synonym for LOWER() </td>
         <td></td>
      </tr>
      <tr>
         <th><code>LEAD()</code></th>
         <td> Value of argument from row leading current row within partition </td>
         <td></td>
      </tr>
      <tr>
         <th><code>LEAST()</code></th>
         <td> Return the smallest argument </td>
         <td></td>
      </tr>
      <tr>
         <th><code>LEFT()</code></th>
         <td> Return the leftmost number of characters as specified </td>
         <td></td>
      </tr>
      <tr>
         <th><code>LENGTH()</code></th>
         <td> Return the length of a string in bytes </td>
         <td></td>
      </tr>
      <tr>
         <th><code>LIKE</code></th>
         <td> Simple pattern matching </td>
         <td></td>
      </tr>
      <tr>
         <th><code>LineString()</code></th>
         <td> Construct LineString from Point values </td>
         <td></td>
      </tr>
      <tr>
         <th><code>LN()</code></th>
         <td> Return the natural logarithm of the argument </td>
         <td></td>
      </tr>
      <tr>
         <th><code>LOAD_FILE()</code></th>
         <td> Load the named file </td>
         <td></td>
      </tr>
      <tr>
         <th><code>LOCALTIME()</code>, <code>LOCALTIME</code></th>
         <td> Synonym for NOW() </td>
         <td></td>
      </tr>
      <tr>
         <th><code>LOCALTIMESTAMP</code>, <code>LOCALTIMESTAMP()</code></th>
         <td> Synonym for NOW() </td>
         <td></td>
      </tr>
      <tr>
         <th><code>LOCATE()</code></th>
         <td> Return the position of the first occurrence of substring </td>
         <td></td>
      </tr>
      <tr>
         <th><code>LOG()</code></th>
         <td> Return the natural logarithm of the first argument </td>
         <td></td>
      </tr>
      <tr>
         <th><code>LOG10()</code></th>
         <td> Return the base-10 logarithm of the argument </td>
         <td></td>
      </tr>
      <tr>
         <th><code>LOG2()</code></th>
         <td> Return the base-2 logarithm of the argument </td>
         <td></td>
      </tr>
      <tr>
         <th><code>LOWER()</code></th>
         <td> Return the argument in lowercase </td>
         <td></td>
      </tr>
      <tr>
         <th><code>LPAD()</code></th>
         <td> Return the string argument, left-padded with the specified string </td>
         <td></td>
      </tr>
      <tr>
         <th><code>LTRIM()</code></th>
         <td> Remove leading spaces </td>
         <td></td>
      </tr>
      <tr>
         <th><code>MAKE_SET()</code></th>
         <td> Return a set of comma-separated strings that have the corresponding bit in bits set </td>
         <td></td>
      </tr>
      <tr>
         <th><code>MAKEDATE()</code></th>
         <td> Create a date from the year and day of year </td>
         <td></td>
      </tr>
      <tr>
         <th><code>MAKETIME()</code></th>
         <td> Create time from hour, minute, second </td>
         <td></td>
      </tr>
      <tr>
         <th><code>MASTER_POS_WAIT()</code></th>
         <td> Block until the replica has read and applied all updates up to the specified position </td>
         <td>Yes</td>
      </tr>
      <tr>
         <th><code>MATCH()</code></th>
         <td> Perform full-text search </td>
         <td></td>
      </tr>
      <tr>
         <th><code>MAX()</code></th>
         <td> Return the maximum value </td>
         <td></td>
      </tr>
      <tr>
         <th><code>MBRContains()</code></th>
         <td> Whether MBR of one geometry contains MBR of another </td>
         <td></td>
      </tr>
      <tr>
         <th><code>MBRCoveredBy()</code></th>
         <td> Whether one MBR is covered by another </td>
         <td></td>
      </tr>
      <tr>
         <th><code>MBRCovers()</code></th>
         <td> Whether one MBR covers another </td>
         <td></td>
      </tr>
      <tr>
         <th><code>MBRDisjoint()</code></th>
         <td> Whether MBRs of two geometries are disjoint </td>
         <td></td>
      </tr>
      <tr>
         <th><code>MBREquals()</code></th>
         <td> Whether MBRs of two geometries are equal </td>
         <td></td>
      </tr>
      <tr>
         <th><code>MBRIntersects()</code></th>
         <td> Whether MBRs of two geometries intersect </td>
         <td></td>
      </tr>
      <tr>
         <th><code>MBROverlaps()</code></th>
         <td> Whether MBRs of two geometries overlap </td>
         <td></td>
      </tr>
      <tr>
         <th><code>MBRTouches()</code></th>
         <td> Whether MBRs of two geometries touch </td>
         <td></td>
      </tr>
      <tr>
         <th><code>MBRWithin()</code></th>
         <td> Whether MBR of one geometry is within MBR of another </td>
         <td></td>
      </tr>
      <tr>
         <th><code>MD5()</code></th>
         <td> Calculate MD5 checksum </td>
         <td></td>
      </tr>
      <tr>
         <th><code>MEMBER OF()</code></th>
         <td> Returns true (1) if first operand matches any element of JSON array passed as second operand, otherwise returns false (0) </td>
         <td></td>
      </tr>
      <tr>
         <th><code>MICROSECOND()</code></th>
         <td> Return the microseconds from argument </td>
         <td></td>
      </tr>
      <tr>
         <th><code>MID()</code></th>
         <td> Return a substring starting from the specified position </td>
         <td></td>
      </tr>
      <tr>
         <th><code>MIN()</code></th>
         <td> Return the minimum value </td>
         <td></td>
      </tr>
      <tr>
         <th><code>MINUTE()</code></th>
         <td> Return the minute from the argument </td>
         <td></td>
      </tr>
      <tr>
         <th><code>MOD()</code></th>
         <td> Return the remainder </td>
         <td></td>
      </tr>
      <tr>
         <th><code>MONTH()</code></th>
         <td> Return the month from the date passed </td>
         <td></td>
      </tr>
      <tr>
         <th><code>MONTHNAME()</code></th>
         <td> Return the name of the month </td>
         <td></td>
      </tr>
      <tr>
         <th><code>MultiLineString()</code></th>
         <td> Contruct MultiLineString from LineString values </td>
         <td></td>
      </tr>
      <tr>
         <th><code>MultiPoint()</code></th>
         <td> Construct MultiPoint from Point values </td>
         <td></td>
      </tr>
      <tr>
         <th><code>MultiPolygon()</code></th>
         <td> Construct MultiPolygon from Polygon values </td>
         <td></td>
      </tr>
      <tr>
         <th><code>NAME_CONST()</code></th>
         <td> Cause the column to have the given name </td>
         <td></td>
      </tr>
      <tr>
         <th><code>NOT</code>, <code>!</code></th>
         <td> Negates value </td>
         <td></td>
      </tr>
      <tr>
         <th><code>NOT BETWEEN ... AND ...</code></th>
         <td> Whether a value is not within a range of values </td>
         <td></td>
      </tr>
      <tr>
         <th><code>NOT EXISTS()</code></th>
         <td> Whether the result of a query contains no rows </td>
         <td></td>
      </tr>
      <tr>
         <th><code>NOT IN()</code></th>
         <td> Whether a value is not within a set of values </td>
         <td></td>
      </tr>
      <tr>
         <th><code>NOT LIKE</code></th>
         <td> Negation of simple pattern matching </td>
         <td></td>
      </tr>
      <tr>
         <th><code>NOT REGEXP</code></th>
         <td> Negation of REGEXP </td>
         <td></td>
      </tr>
      <tr>
         <th><code>NOW()</code></th>
         <td> Return the current date and time </td>
         <td></td>
      </tr>
      <tr>
         <th><code>NTH_VALUE()</code></th>
         <td> Value of argument from N-th row of window frame </td>
         <td></td>
      </tr>
      <tr>
         <th><code>NTILE()</code></th>
         <td> Bucket number of current row within its partition. </td>
         <td></td>
      </tr>
      <tr>
         <th><code>NULLIF()</code></th>
         <td> Return NULL if expr1 = expr2 </td>
         <td></td>
      </tr>
      <tr>
         <th><code>OCT()</code></th>
         <td> Return a string containing octal representation of a number </td>
         <td></td>
      </tr>
      <tr>
         <th><code>OCTET_LENGTH()</code></th>
         <td> Synonym for LENGTH() </td>
         <td></td>
      </tr>
      <tr>
         <th><code>OR</code>, <code>||</code></th>
         <td> Logical OR </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ORD()</code></th>
         <td> Return character code for leftmost character of the argument </td>
         <td></td>
      </tr>
      <tr>
         <th><code>PERCENT_RANK()</code></th>
         <td> Percentage rank value </td>
         <td></td>
      </tr>
      <tr>
         <th><code>PERIOD_ADD()</code></th>
         <td> Add a period to a year-month </td>
         <td></td>
      </tr>
      <tr>
         <th><code>PERIOD_DIFF()</code></th>
         <td> Return the number of months between periods </td>
         <td></td>
      </tr>
      <tr>
         <th><code>PI()</code></th>
         <td> Return the value of pi </td>
         <td></td>
      </tr>
      <tr>
         <th><code>Point()</code></th>
         <td> Construct Point from coordinates </td>
         <td></td>
      </tr>
      <tr>
         <th><code>Polygon()</code></th>
         <td> Construct Polygon from LineString arguments </td>
         <td></td>
      </tr>
      <tr>
         <th><code>POSITION()</code></th>
         <td> Synonym for LOCATE() </td>
         <td></td>
      </tr>
      <tr>
         <th><code>POW()</code></th>
         <td> Return the argument raised to the specified power </td>
         <td></td>
      </tr>
      <tr>
         <th><code>POWER()</code></th>
         <td> Return the argument raised to the specified power </td>
         <td></td>
      </tr>
      <tr>
         <th><code>PS_CURRENT_THREAD_ID()</code></th>
         <td> Performance Schema thread ID for current thread </td>
         <td></td>
      </tr>
      <tr>
         <th><code>PS_THREAD_ID()</code></th>
         <td> Performance Schema thread ID for given thread </td>
         <td></td>
      </tr>
      <tr>
         <th><code>QUARTER()</code></th>
         <td> Return the quarter from a date argument </td>
         <td></td>
      </tr>
      <tr>
         <th><code>QUOTE()</code></th>
         <td> Escape the argument for use in an SQL statement </td>
         <td></td>
      </tr>
      <tr>
         <th><code>RADIANS()</code></th>
         <td> Return argument converted to radians </td>
         <td></td>
      </tr>
      <tr>
         <th><code>RAND()</code></th>
         <td> Return a random floating-point value </td>
         <td></td>
      </tr>
      <tr>
         <th><code>RANDOM_BYTES()</code></th>
         <td> Return a random byte vector </td>
         <td></td>
      </tr>
      <tr>
         <th><code>RANK()</code></th>
         <td> Rank of current row within its partition, with gaps </td>
         <td></td>
      </tr>
      <tr>
         <th><code>REGEXP</code></th>
         <td> Whether string matches regular expression </td>
         <td></td>
      </tr>
      <tr>
         <th><code>REGEXP_INSTR()</code></th>
         <td> Starting index of substring matching regular expression </td>
         <td></td>
      </tr>
      <tr>
         <th><code>REGEXP_LIKE()</code></th>
         <td> Whether string matches regular expression </td>
         <td></td>
      </tr>
      <tr>
         <th><code>REGEXP_REPLACE()</code></th>
         <td> Replace substrings matching regular expression </td>
         <td></td>
      </tr>
      <tr>
         <th><code>REGEXP_SUBSTR()</code></th>
         <td> Return substring matching regular expression </td>
         <td></td>
      </tr>
      <tr>
         <th><code>RELEASE_ALL_LOCKS()</code></th>
         <td> Release all current named locks </td>
         <td></td>
      </tr>
      <tr>
         <th><code>RELEASE_LOCK()</code></th>
         <td> Release the named lock </td>
         <td></td>
      </tr>
      <tr>
         <th><code>REPEAT()</code></th>
         <td> Repeat a string the specified number of times </td>
         <td></td>
      </tr>
      <tr>
         <th><code>REPLACE()</code></th>
         <td> Replace occurrences of a specified string </td>
         <td></td>
      </tr>
      <tr>
         <th><code>REVERSE()</code></th>
         <td> Reverse the characters in a string </td>
         <td></td>
      </tr>
      <tr>
         <th><code>RIGHT()</code></th>
         <td> Return the specified rightmost number of characters </td>
         <td></td>
      </tr>
      <tr>
         <th><code>RLIKE</code></th>
         <td> Whether string matches regular expression </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ROLES_GRAPHML()</code></th>
         <td> Return a GraphML document representing memory role subgraphs </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ROUND()</code></th>
         <td> Round the argument </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ROW_COUNT()</code></th>
         <td> The number of rows updated </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ROW_NUMBER()</code></th>
         <td> Number of current row within its partition </td>
         <td></td>
      </tr>
      <tr>
         <th><code>RPAD()</code></th>
         <td> Append string the specified number of times </td>
         <td></td>
      </tr>
      <tr>
         <th><code>RTRIM()</code></th>
         <td> Remove trailing spaces </td>
         <td></td>
      </tr>
      <tr>
         <th><code>SCHEMA()</code></th>
         <td> Synonym for DATABASE() </td>
         <td></td>
      </tr>
      <tr>
         <th><code>SEC_TO_TIME()</code></th>
         <td> Converts seconds to 'hh:mm:ss' format </td>
         <td></td>
      </tr>
      <tr>
         <th><code>SECOND()</code></th>
         <td> Return the second (0-59) </td>
         <td></td>
      </tr>
      <tr>
         <th><code>SESSION_USER()</code></th>
         <td> Synonym for USER() </td>
         <td></td>
      </tr>
      <tr>
         <th><code>SHA1()</code>, <code>SHA()</code></th>
         <td> Calculate an SHA-1 160-bit checksum </td>
         <td></td>
      </tr>
      <tr>
         <th><code>SHA2()</code></th>
         <td> Calculate an SHA-2 checksum </td>
         <td></td>
      </tr>
      <tr>
         <th><code>SIGN()</code></th>
         <td> Return the sign of the argument </td>
         <td></td>
      </tr>
      <tr>
         <th><code>SIN()</code></th>
         <td> Return the sine of the argument </td>
         <td></td>
      </tr>
      <tr>
         <th><code>SLEEP()</code></th>
         <td> Sleep for a number of seconds </td>
         <td></td>
      </tr>
      <tr>
         <th><code>SOUNDEX()</code></th>
         <td> Return a soundex string </td>
         <td></td>
      </tr>
      <tr>
         <th><code>SOUNDS LIKE</code></th>
         <td> Compare sounds </td>
         <td></td>
      </tr>
      <tr>
         <th><code>SOURCE_POS_WAIT()</code></th>
         <td> Block until the replica has read and applied all updates up to the specified position </td>
         <td></td>
      </tr>
      <tr>
         <th><code>SPACE()</code></th>
         <td> Return a string of the specified number of spaces </td>
         <td></td>
      </tr>
      <tr>
         <th><code>SQRT()</code></th>
         <td> Return the square root of the argument </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_Area()</code></th>
         <td> Return Polygon or MultiPolygon area </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_AsBinary()</code>, <code>ST_AsWKB()</code></th>
         <td> Convert from internal geometry format to WKB </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_AsGeoJSON()</code></th>
         <td> Generate GeoJSON object from geometry </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_AsText()</code>, <code>ST_AsWKT()</code></th>
         <td> Convert from internal geometry format to WKT </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_Buffer()</code></th>
         <td> Return geometry of points within given distance from geometry </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_Buffer_Strategy()</code></th>
         <td> Produce strategy option for ST_Buffer() </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_Centroid()</code></th>
         <td> Return centroid as a point </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_Collect()</code></th>
         <td> Aggregate spatial values into collection </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_Contains()</code></th>
         <td> Whether one geometry contains another </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_ConvexHull()</code></th>
         <td> Return convex hull of geometry </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_Crosses()</code></th>
         <td> Whether one geometry crosses another </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_Difference()</code></th>
         <td> Return point set difference of two geometries </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_Dimension()</code></th>
         <td> Dimension of geometry </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_Disjoint()</code></th>
         <td> Whether one geometry is disjoint from another </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_Distance()</code></th>
         <td> The distance of one geometry from another </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_Distance_Sphere()</code></th>
         <td> Minimum distance on earth between two geometries </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_EndPoint()</code></th>
         <td> End Point of LineString </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_Envelope()</code></th>
         <td> Return MBR of geometry </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_Equals()</code></th>
         <td> Whether one geometry is equal to another </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_ExteriorRing()</code></th>
         <td> Return exterior ring of Polygon </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_FrechetDistance()</code></th>
         <td> The discrete Fréchet distance of one geometry from another </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_GeoHash()</code></th>
         <td> Produce a geohash value </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_GeomCollFromText()</code>, <code>ST_GeometryCollectionFromText()</code>, <code>ST_GeomCollFromTxt()</code></th>
         <td> Return geometry collection from WKT </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_GeomCollFromWKB()</code>, <code>ST_GeometryCollectionFromWKB()</code></th>
         <td> Return geometry collection from WKB </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_GeometryN()</code></th>
         <td> Return N-th geometry from geometry collection </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_GeometryType()</code></th>
         <td> Return name of geometry type </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_GeomFromGeoJSON()</code></th>
         <td> Generate geometry from GeoJSON object </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_GeomFromText()</code>, <code>ST_GeometryFromText()</code></th>
         <td> Return geometry from WKT </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_GeomFromWKB()</code>, <code>ST_GeometryFromWKB()</code></th>
         <td> Return geometry from WKB </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_HausdorffDistance()</code></th>
         <td> The discrete Hausdorff distance of one geometry from another </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_InteriorRingN()</code></th>
         <td> Return N-th interior ring of Polygon </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_Intersection()</code></th>
         <td> Return point set intersection of two geometries </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_Intersects()</code></th>
         <td> Whether one geometry intersects another </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_IsClosed()</code></th>
         <td> Whether a geometry is closed and simple </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_IsEmpty()</code></th>
         <td> Whether a geometry is empty </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_IsSimple()</code></th>
         <td> Whether a geometry is simple </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_IsValid()</code></th>
         <td> Whether a geometry is valid </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_LatFromGeoHash()</code></th>
         <td> Return latitude from geohash value </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_Latitude()</code></th>
         <td> Return latitude of Point </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_Length()</code></th>
         <td> Return length of LineString </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_LineFromText()</code>, <code>ST_LineStringFromText()</code></th>
         <td> Construct LineString from WKT </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_LineFromWKB()</code>, <code>ST_LineStringFromWKB()</code></th>
         <td> Construct LineString from WKB </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_LineInterpolatePoint()</code></th>
         <td> The point a given percentage along a LineString </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_LineInterpolatePoints()</code></th>
         <td> The points a given percentage along a LineString </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_LongFromGeoHash()</code></th>
         <td> Return longitude from geohash value </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_Longitude()</code></th>
         <td> Return longitude of Point </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_MakeEnvelope()</code></th>
         <td> Rectangle around two points </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_MLineFromText()</code>, <code>ST_MultiLineStringFromText()</code></th>
         <td> Construct MultiLineString from WKT </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_MLineFromWKB()</code>, <code>ST_MultiLineStringFromWKB()</code></th>
         <td> Construct MultiLineString from WKB </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_MPointFromText()</code>, <code>ST_MultiPointFromText()</code></th>
         <td> Construct MultiPoint from WKT </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_MPointFromWKB()</code>, <code>ST_MultiPointFromWKB()</code></th>
         <td> Construct MultiPoint from WKB </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_MPolyFromText()</code>, <code>ST_MultiPolygonFromText()</code></th>
         <td> Construct MultiPolygon from WKT </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_MPolyFromWKB()</code>, <code>ST_MultiPolygonFromWKB()</code></th>
         <td> Construct MultiPolygon from WKB </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_NumGeometries()</code></th>
         <td> Return number of geometries in geometry collection </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_NumInteriorRing()</code>, <code>ST_NumInteriorRings()</code></th>
         <td> Return number of interior rings in Polygon </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_NumPoints()</code></th>
         <td> Return number of points in LineString </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_Overlaps()</code></th>
         <td> Whether one geometry overlaps another </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_PointAtDistance()</code></th>
         <td> The point a given distance along a LineString </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_PointFromGeoHash()</code></th>
         <td> Convert geohash value to POINT value </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_PointFromText()</code></th>
         <td> Construct Point from WKT </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_PointFromWKB()</code></th>
         <td> Construct Point from WKB </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_PointN()</code></th>
         <td> Return N-th point from LineString </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_PolyFromText()</code>, <code>ST_PolygonFromText()</code></th>
         <td> Construct Polygon from WKT </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_PolyFromWKB()</code>, <code>ST_PolygonFromWKB()</code></th>
         <td> Construct Polygon from WKB </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_Simplify()</code></th>
         <td> Return simplified geometry </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_SRID()</code></th>
         <td> Return spatial reference system ID for geometry </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_StartPoint()</code></th>
         <td> Start Point of LineString </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_SwapXY()</code></th>
         <td> Return argument with X/Y coordinates swapped </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_SymDifference()</code></th>
         <td> Return point set symmetric difference of two geometries </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_Touches()</code></th>
         <td> Whether one geometry touches another </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_Transform()</code></th>
         <td> Transform coordinates of geometry </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_Union()</code></th>
         <td> Return point set union of two geometries </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_Validate()</code></th>
         <td> Return validated geometry </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_Within()</code></th>
         <td> Whether one geometry is within another </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_X()</code></th>
         <td> Return X coordinate of Point </td>
         <td></td>
      </tr>
      <tr>
         <th><code>ST_Y()</code></th>
         <td> Return Y coordinate of Point </td>
         <td></td>
      </tr>
      <tr>
         <th><code>STATEMENT_DIGEST()</code></th>
         <td> Compute statement digest hash value </td>
         <td></td>
      </tr>
      <tr>
         <th><code>STATEMENT_DIGEST_TEXT()</code></th>
         <td> Compute normalized statement digest </td>
         <td></td>
      </tr>
      <tr>
         <th><code>STD()</code></th>
         <td> Return the population standard deviation </td>
         <td></td>
      </tr>
      <tr>
         <th><code>STDDEV()</code></th>
         <td> Return the population standard deviation </td>
         <td></td>
      </tr>
      <tr>
         <th><code>STDDEV_POP()</code></th>
         <td> Return the population standard deviation </td>
         <td></td>
      </tr>
      <tr>
         <th><code>STDDEV_SAMP()</code></th>
         <td> Return the sample standard deviation </td>
         <td></td>
      </tr>
      <tr>
         <th><code>STR_TO_DATE()</code></th>
         <td> Convert a string to a date </td>
         <td></td>
      </tr>
      <tr>
         <th><code>STRCMP()</code></th>
         <td> Compare two strings </td>
         <td></td>
      </tr>
      <tr>
         <th><code>SUBDATE()</code></th>
         <td> Synonym for DATE_SUB() when invoked with three arguments </td>
         <td></td>
      </tr>
      <tr>
         <th><code>SUBSTR()</code></th>
         <td> Return the substring as specified </td>
         <td></td>
      </tr>
      <tr>
         <th><code>SUBSTRING()</code></th>
         <td> Return the substring as specified </td>
         <td></td>
      </tr>
      <tr>
         <th><code>SUBSTRING_INDEX()</code></th>
         <td> Return a substring from a string before the specified number of occurrences of the delimiter </td>
         <td></td>
      </tr>
      <tr>
         <th><code>SUBTIME()</code></th>
         <td> Subtract times </td>
         <td></td>
      </tr>
      <tr>
         <th><code>SUM()</code></th>
         <td> Return the sum </td>
         <td></td>
      </tr>
      <tr>
         <th><code>SYSDATE()</code></th>
         <td> Return the time at which the function executes </td>
         <td></td>
      </tr>
      <tr>
         <th><code>SYSTEM_USER()</code></th>
         <td> Synonym for USER() </td>
         <td></td>
      </tr>
      <tr>
         <th><code>TAN()</code></th>
         <td> Return the tangent of the argument </td>
         <td></td>
      </tr>
      <tr>
         <th><code>TIME()</code></th>
         <td> Extract the time portion of the expression passed </td>
         <td></td>
      </tr>
      <tr>
         <th><code>TIME_FORMAT()</code></th>
         <td> Format as time </td>
         <td></td>
      </tr>
      <tr>
         <th><code>TIME_TO_SEC()</code></th>
         <td> Return the argument converted to seconds </td>
         <td></td>
      </tr>
      <tr>
         <th><code>TIMEDIFF()</code></th>
         <td> Subtract time </td>
         <td></td>
      </tr>
      <tr>
         <th><code>TIMESTAMP()</code></th>
         <td> With a single argument, this function returns the date or datetime expression; with two arguments, the sum of the arguments </td>
         <td></td>
      </tr>
      <tr>
         <th><code>TIMESTAMPADD()</code></th>
         <td> Add an interval to a datetime expression </td>
         <td></td>
      </tr>
      <tr>
         <th><code>TIMESTAMPDIFF()</code></th>
         <td> Return the difference of two datetime expressions, using the units specified </td>
         <td></td>
      </tr>
      <tr>
         <th><code>TO_BASE64()</code></th>
         <td> Return the argument converted to a base-64 string </td>
         <td></td>
      </tr>
      <tr>
         <th><code>TO_DAYS()</code></th>
         <td> Return the date argument converted to days </td>
         <td></td>
      </tr>
      <tr>
         <th><code>TO_SECONDS()</code></th>
         <td> Return the date or datetime argument converted to seconds since Year 0 </td>
         <td></td>
      </tr>
      <tr>
         <th><code>TRIM()</code></th>
         <td> Remove leading and trailing spaces </td>
         <td></td>
      </tr>
      <tr>
         <th><code>TRUNCATE()</code></th>
         <td> Truncate to specified number of decimal places </td>
         <td></td>
      </tr>
      <tr>
         <th><code>UCASE()</code></th>
         <td> Synonym for UPPER() </td>
         <td></td>
      </tr>
      <tr>
         <th><code>UNCOMPRESS()</code></th>
         <td> Uncompress a string compressed </td>
         <td></td>
      </tr>
      <tr>
         <th><code>UNCOMPRESSED_LENGTH()</code></th>
         <td> Return the length of a string before compression </td>
         <td></td>
      </tr>
      <tr>
         <th><code>UNHEX()</code></th>
         <td> Return a string containing hex representation of a number </td>
         <td></td>
      </tr>
      <tr>
         <th><code>UNIX_TIMESTAMP()</code></th>
         <td> Return a Unix timestamp </td>
         <td></td>
      </tr>
      <tr>
         <th><code>UpdateXML()</code></th>
         <td> Return replaced XML fragment </td>
         <td></td>
      </tr>
      <tr>
         <th><code>UPPER()</code></th>
         <td> Convert to uppercase </td>
         <td></td>
      </tr>
      <tr>
         <th><code>USER()</code></th>
         <td> The user name and host name provided by the client </td>
         <td></td>
      </tr>
      <tr>
         <th><code>UTC_DATE()</code></th>
         <td> Return the current UTC date </td>
         <td></td>
      </tr>
      <tr>
         <th><code>UTC_TIME()</code></th>
         <td> Return the current UTC time </td>
         <td></td>
      </tr>
      <tr>
         <th><code>UTC_TIMESTAMP()</code></th>
         <td> Return the current UTC date and time </td>
         <td></td>
      </tr>
      <tr>
         <th><code>UUID()</code></th>
         <td> Return a Universal Unique Identifier (UUID) </td>
         <td></td>
      </tr>
      <tr>
         <th><code>UUID_SHORT()</code></th>
         <td> Return an integer-valued universal identifier </td>
         <td></td>
      </tr>
      <tr>
         <th><code>UUID_TO_BIN()</code></th>
         <td> Convert string UUID to binary </td>
         <td></td>
      </tr>
      <tr>
         <th><code>VALIDATE_PASSWORD_STRENGTH()</code></th>
         <td> Determine strength of password </td>
         <td></td>
      </tr>
      <tr>
         <th><code>VALUES()</code></th>
         <td> Define the values to be used during an INSERT </td>
         <td></td>
      </tr>
      <tr>
         <th><code>VAR_POP()</code></th>
         <td> Return the population standard variance </td>
         <td></td>
      </tr>
      <tr>
         <th><code>VAR_SAMP()</code></th>
         <td> Return the sample variance </td>
         <td></td>
      </tr>
      <tr>
         <th><code>VARIANCE()</code></th>
         <td> Return the population standard variance </td>
         <td></td>
      </tr>
      <tr>
         <th><code>VERSION()</code></th>
         <td> Return a string that indicates the MySQL server version </td>
         <td></td>
      </tr>
      <tr>
         <th><code>WAIT_FOR_EXECUTED_GTID_SET()</code></th>
         <td> Wait until the given GTIDs have executed on the replica. </td>
         <td></td>
      </tr>
      <tr>
         <th><code>WEEK()</code></th>
         <td> Return the week number </td>
         <td></td>
      </tr>
      <tr>
         <th><code>WEEKDAY()</code></th>
         <td> Return the weekday index </td>
         <td></td>
      </tr>
      <tr>
         <th><code>WEEKOFYEAR()</code></th>
         <td> Return the calendar week of the date (1-53) </td>
         <td></td>
      </tr>
      <tr>
         <th><code>WEIGHT_STRING()</code></th>
         <td> Return the weight string for a string </td>
         <td></td>
      </tr>
      <tr>
         <th><code>XOR</code></th>
         <td> Logical XOR </td>
         <td></td>
      </tr>
      <tr>
         <th><code>YEAR()</code></th>
         <td> Return the year </td>
         <td></td>
      </tr>
      <tr>
         <th><code>YEARWEEK()</code></th>
         <td> Return the year and week </td>
         <td></td>
      </tr>
      <tr>
         <th><code>|</code></th>
         <td> Bitwise OR </td>
         <td></td>
      </tr>
      <tr>
         <th><code>~</code></th>
         <td> Bitwise inversion </td>
         <td></td>
      </tr>
   </tbody>
</table>
