#### 15.7.7.27 Declaração SHOW PARSE\_TREE

```
SHOW PARSE_TREE select_statement
```

`SHOW PARSE_TREE` exibe uma representação da árvore de análise da declaração `SELECT` de entrada, no formato JSON.

Observação

Esta declaração está disponível apenas em compilações de depuração ou se o servidor MySQL foi compilado usando `-DWITH_SHOW_PARSE_TREE`. É destinada ao uso apenas em testes e desenvolvimento, e não em produção.

Exemplo:

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