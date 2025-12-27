### 27.5.4 Event Metadata

To obtain metadata about events:

* Query the `EVENTS` table of the `INFORMATION_SCHEMA` database. See Section 28.3.14, “The INFORMATION\_SCHEMA EVENTS Table”.

* Use the `SHOW CREATE EVENT` statement. See Section 15.7.7.8, “SHOW CREATE EVENT Statement”.

* Use the `SHOW EVENTS` statement. See Section 15.7.7.20, “SHOW EVENTS Statement”.

**Event Scheduler Time Representation**

Each session in MySQL has a session time zone (STZ). This is the session `time_zone` value that is initialized from the server's global `time_zone` value when the session begins but may be changed during the session.

The session time zone that is current when a `CREATE EVENT` or `ALTER EVENT` statement executes is used to interpret times specified in the event definition. This becomes the event time zone (ETZ); that is, the time zone that is used for event scheduling and is in effect within the event as it executes.

For representation of event information in the data dictionary, the `execute_at`, `starts`, and `ends` times are converted to UTC and stored along with the event time zone. This enables event execution to proceed as defined regardless of any subsequent changes to the server time zone or daylight saving time effects. The `last_executed` time is also stored in UTC.

Event times can be obtained by selecting from the Information Schema `EVENTS` table or from `SHOW EVENTS`, but they are reported as ETZ or STZ values. The following table summarizes representation of event times.

<table summary="Summary of event time representation (as UTC, EZT, or STZ values) from INFORMATION_SCHEMA.EVENTS, and SHOW EVENTS."><col style="width: 25%"/><col style="width: 25%"/><col style="width: 25%"/><thead><tr> <th scope="col">Value</th> <th scope="col"><a class="link" href="information-schema-events-table.html" title="28.3.14 The INFORMATION_SCHEMA EVENTS Table"><code class="literal">EVENTS</code></a> Table</th> <th scope="col"><a class="link" href="show-events.html" title="15.7.7.20 SHOW EVENTS Statement"><code class="literal">SHOW EVENTS</code></a></th> </tr></thead><tbody><tr> <th scope="row">Execute at</th> <td>ETZ</td> <td>ETZ</td> </tr><tr> <th scope="row">Starts</th> <td>ETZ</td> <td>ETZ</td> </tr><tr> <th scope="row">Ends</th> <td>ETZ</td> <td>ETZ</td> </tr><tr> <th scope="row">Last executed</th> <td>ETZ</td> <td>n/a</td> </tr><tr> <th scope="row">Created</th> <td>STZ</td> <td>n/a</td> </tr><tr> <th scope="row">Last altered</th> <td>STZ</td> <td>n/a</td> </tr></tbody></table>
