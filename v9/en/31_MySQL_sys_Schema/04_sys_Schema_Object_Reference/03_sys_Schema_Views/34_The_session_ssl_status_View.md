#### 30.4.3.34 The session\_ssl\_status View

For each connection, this view displays the SSL version, cipher, and count of reused SSL sessions.

The `session_ssl_status` view has these columns:

* `thread_id`

  The thread ID for the connection.

* `ssl_version`

  The version of SSL used for the connection.

* `ssl_cipher`

  The SSL cipher used for the connection.

* `ssl_sessions_reused`

  The number of reused SSL sessions for the connection.
