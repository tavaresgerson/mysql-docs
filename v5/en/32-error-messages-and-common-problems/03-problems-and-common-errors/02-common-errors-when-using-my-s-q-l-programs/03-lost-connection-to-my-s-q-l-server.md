#### B.3.2.3 Lost connection to MySQL server

There are three likely causes for this error message.

Usually it indicates network connectivity trouble and you should check the condition of your network if this error occurs frequently. If the error message includes “during query,” this is probably the case you are experiencing.

Sometimes the “during query” form happens when millions of rows are being sent as part of one or more queries. If you know that this is happening, you should try increasing [`net_read_timeout`](server-system-variables.html#sysvar_net_read_timeout) from its default of 30 seconds to 60 seconds or longer, sufficient for the data transfer to complete.

More rarely, it can happen when the client is attempting the initial connection to the server. In this case, if your [`connect_timeout`](server-system-variables.html#sysvar_connect_timeout) value is set to only a few seconds, you may be able to resolve the problem by increasing it to ten seconds, perhaps more if you have a very long distance or slow connection. You can determine whether you are experiencing this more uncommon cause by using `SHOW GLOBAL STATUS LIKE 'Aborted_connects'`. It increases by one for each initial connection attempt that the server aborts. You may see “reading authorization packet” as part of the error message; if so, that also suggests that this is the solution that you need.

If the cause is none of those just described, you may be experiencing a problem with [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") values that are larger than [`max_allowed_packet`](server-system-variables.html#sysvar_max_allowed_packet), which can cause this error with some clients. Sometime you may see an [`ER_NET_PACKET_TOO_LARGE`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_net_packet_too_large) error, and that confirms that you need to increase [`max_allowed_packet`](server-system-variables.html#sysvar_max_allowed_packet).
