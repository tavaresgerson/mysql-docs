#### 15.7.7.27 SHOW PARSE\_TREE Statement

```
SHOW PARSE_TREE select_statement
```

`SHOW PARSE_TREE` displays a representation of the parse tree for the input `SELECT` statement, in JSON format.

Note

This statement is available only in debug builds, or if the MySQL server was built using `-DWITH_SHOW_PARSE_TREE`. It is intended for use in testing and development only, and not in production.

Example:

```
mysql> SHOW PARSE_TREE SELECT * FROM t3 WHERE o_id > 2\G
*************************** 1. row ***************************
Show_parse_tree: {
  "text": "SELECT * FROM t3 WHERE o_id > 2",
  "type": "PT_select_stmt",
  "components": [
    {
      "text": "SELECT * FROM t3 WHERE o_id > 2",
      "type": "PT_query_expression",
      "components": [
        {
          "text": "SELECT * FROM t3 WHERE o_id > 2",
          "type": "PT_query_specification",
          "components": [
            {
              "text": "*",
              "type": "PT_select_item_list",
              "components": [
                {
                  "text": "*",
                  "type": "Item_asterisk"
                }
              ]
            },
            {
              "text": "t3",
              "type": "PT_table_factor_table_ident",
              "table_ident": "`t3`"
            },
            {
              "text": "o_id > 2",
              "type": "PTI_where",
              "components": [
                {
                  "text": "o_id > 2",
                  "type": "PTI_comp_op",
                  "operator": ">",
                  "components": [
                    {
                      "text": "o_id",
                      "type": "PTI_simple_ident_ident"
                    },
                    {
                      "text": "2",
                      "type": "Item_int"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
1 row in set (0.01 sec)
```
