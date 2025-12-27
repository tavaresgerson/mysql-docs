#### B.3.2.12 Commands out of sync

If you get `Commands out of sync; you can't run this command now` in your client code, you are calling client functions in the wrong order.

This can happen, for example, if you are using  `mysql_use_result()` and try to execute a new query before you have called  `mysql_free_result()`. It can also happen if you try to execute two queries that return data without calling  `mysql_use_result()` or  `mysql_store_result()` in between.


