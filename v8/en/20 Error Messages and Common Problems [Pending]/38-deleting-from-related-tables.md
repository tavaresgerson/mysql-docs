#### B.3.4.6 Deleting Rows from Related Tables

If the total length of the  `DELETE` statement for `related_table` is more than the default value of the  `max_allowed_packet` system variable, you should split it into smaller parts and execute multiple  `DELETE` statements. You probably get the fastest  `DELETE` by specifying only 100 to 1,000 `related_column` values per statement if the `related_column` is indexed. If the `related_column` is not indexed, the speed is independent of the number of arguments in the `IN` clause.


