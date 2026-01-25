### 8.15.12 Exemplo

Aqui, tomamos um exemplo da suíte de testes.

```sql
#
# Tracing of ORDER BY & GROUP BY simplification.
#
SET optimizer_trace="enabled=on",end_markers_in_json=on; # make readable
SET optimizer_trace_max_mem_size=1000000; # avoid small default

CREATE TABLE t1 (
  pk INT, col_int_key INT,
  col_varchar_key VARCHAR(1),
  col_varchar_nokey VARCHAR(1)
);

INSERT INTO t1 VALUES
  (10,7,'v','v'),(11,0,'s','s'),(12,9,'l','l'),(13,3,'y','y'),(14,4,'c','c'),
  (15,2,'i','i'),(16,5,'h','h'),(17,3,'q','q'),(18,1,'a','a'),(19,3,'v','v'),
  (20,6,'u','u'),(21,7,'s','s'),(22,5,'y','y'),(23,1,'z','z'),(24,204,'h','h'),
  (25,224,'p','p'),(26,9,'e','e'),(27,5,'i','i'),(28,0,'y','y'),(29,3,'w','w');

CREATE TABLE t2 (
  pk INT, col_int_key INT,
  col_varchar_key VARCHAR(1),
  col_varchar_nokey VARCHAR(1),
  PRIMARY KEY (pk)
);

INSERT INTO t2 VALUES
  (1,4,'b','b'),(2,8,'y','y'),(3,0,'p','p'),(4,0,'f','f'),(5,0,'p','p'),
  (6,7,'d','d'),(7,7,'f','f'),(8,5,'j','j'),(9,3,'e','e'),(10,188,'u','u'),
  (11,4,'v','v'),(12,9,'u','u'),(13,6,'i','i'),(14,1,'x','x'),(15,5,'l','l'),
  (16,6,'q','q'),(17,2,'n','n'),(18,4,'r','r'),(19,231,'c','c'),(20,4,'h','h'),
  (21,3,'k','k'),(22,3,'t','t'),(23,7,'t','t'),(24,6,'k','k'),(25,7,'g','g'),
  (26,9,'z','z'),(27,4,'n','n'),(28,4,'j','j'),(29,2,'l','l'),(30,1,'d','d'),
  (31,2,'t','t'),(32,194,'y','y'),(33,2,'i','i'),(34,3,'j','j'),(35,8,'r','r'),
  (36,4,'b','b'),(37,9,'o','o'),(38,4,'k','k'),(39,5,'a','a'),(40,5,'f','f'),
  (41,9,'t','t'),(42,3,'c','c'),(43,8,'c','c'),(44,0,'r','r'),(45,98,'k','k'),
  (46,3,'l','l'),(47,1,'o','o'),(48,0,'t','t'),(49,189,'v','v'),(50,8,'x','x'),
  (51,3,'j','j'),(52,3,'x','x'),(53,9,'k','k'),(54,6,'o','o'),(55,8,'z','z'),
  (56,3,'n','n'),(57,9,'c','c'),(58,5,'d','d'),(59,9,'s','s'),(60,2,'j','j'),
  (61,2,'w','w'),(62,5,'f','f'),(63,8,'p','p'),(64,6,'o','o'),(65,9,'f','f'),
  (66,0,'x','x'),(67,3,'q','q'),(68,6,'g','g'),(69,5,'x','x'),(70,8,'p','p'),
  (71,2,'q','q'),(72,120,'q','q'),(73,25,'v','v'),(74,1,'g','g'),(75,3,'l','l'),
  (76,1,'w','w'),(77,3,'h','h'),(78,153,'c','c'),(79,5,'o','o'),(80,9,'o','o'),
  (81,1,'v','v'),(82,8,'y','y'),(83,7,'d','d'),(84,6,'p','p'),(85,2,'z','z'),
  (86,4,'t','t'),(87,7,'b','b'),(88,3,'y','y'),(89,8,'k','k'),(90,4,'c','c'),
  (91,6,'z','z'),(92,1,'t','t'),(93,7,'o','o'),(94,1,'u','u'),(95,0,'t','t'),
  (96,2,'k','k'),(97,7,'u','u'),(98,2,'b','b'),(99,1,'m','m'),(100,5,'o','o');

SELECT SUM(alias2.col_varchar_nokey) AS c1, alias2.pk AS c2
  FROM t1 AS alias1
  STRAIGHT_JOIN t2 AS alias2
  ON alias2.pk = alias1.col_int_key
  WHERE alias1.pk
  GROUP BY c2
  ORDER BY alias1.col_int_key, alias2.pk;

+------+----+
| c1   | c2 |
+------+----+
|    0 |  1 |
|    0 |  2 |
|    0 |  3 |
|    0 |  4 |
|    0 |  5 |
|    0 |  6 |
|    0 |  7 |
|    0 |  9 |
+------+----+
```

Nota

Para referência, o trace completo é mostrado ininterruptamente no final desta seção.

Agora podemos examinar o trace, cuja primeira coluna (`QUERY`), contendo a instrução original a ser rastreada (traced), é mostrada aqui:

```sql
SELECT * FROM INFORMATION_SCHEMA.OPTIMIZER_TRACE\G
*************************** 1. row ***************************
QUERY: SELECT SUM(alias2.col_varchar_nokey) AS c1, alias2.pk AS c2
  FROM t1 AS alias1
  STRAIGHT_JOIN t2 AS alias2
  ON alias2.pk = alias1.col_int_key
  WHERE alias1.pk
  GROUP BY c2
  ORDER BY alias1.col_int_key, alias2.pk
```

Isso pode ser uma marca útil quando vários traces estão armazenados.

A coluna `TRACE` começa mostrando que a execução da instrução é composta de etapas discretas, assim:

```sql
"steps": [
  {
```

Isto é seguido pela preparação do JOIN para o primeiro (e único) `SELECT` na instrução sendo rastreada, conforme mostrado aqui:

```sql
"steps": [
  {
    "expanded_query": "/* select#1 */ select \
       sum(`test`.`alias2`.`col_varchar_nokey`) AS \
       `SUM(alias2.col_varchar_nokey)`,`test`.`alias2`.`pk` AS `field2` \
       from (`test`.`t1` `alias1` straight_join `test`.`t2` `alias2` \
       on((`test`.`alias2`.`pk` = `test`.`alias1`.`col_int_key`))) \
       where `test`.`alias1`.`pk` \
       group by `test`.`alias2`.`pk` \
       order by `test`.`alias1`.`col_int_key`,`test`.`alias2`.`pk`"
   }
] /* steps */
       } /* join_preparation */
     },
```

A saída que acabamos de mostrar exibe a Query como ela é usada para preparar o JOIN; todas as colunas (fields) foram resolvidas para seus Databases e tables, e cada `SELECT` é anotado com um número de sequência, o que pode ser útil ao estudar subqueries.

A próxima porção do trace mostra como o JOIN é otimizado, começando pelo processamento de condições:

```sql
     {
      "join_optimization": {
               "select#": 1,
               "steps": [
                 {
                   "condition_processing": {
                     "condition": "WHERE",
                     "original_condition": "(`test`.`alias1`.`pk` and \
                     (`test`.`alias2`.`pk` = `test`.`alias1`.`col_int_key`))",
                     "steps": [
                       {
                         "transformation": "equality_propagation",
                         "resulting_condition": "(`test`.`alias1`.`pk` and \
                         multiple equal(`test`.`alias2`.`pk`, \
                         `test`.`alias1`.`col_int_key`))"
                       },
                       {
                         "transformation": "constant_propagation",
                         "resulting_condition": "(`test`.`alias1`.`pk` and \
                         multiple equal(`test`.`alias2`.`pk`, \
                         `test`.`alias1`.`col_int_key`))"
                       },
                       {
                         "transformation": "trivial_condition_removal",
                         "resulting_condition": "(`test`.`alias1`.`pk` and \
                         multiple equal(`test`.`alias2`.`pk`, \
                         `test`.`alias1`.`col_int_key`))"
                 }
               ] /* steps */
             } /* condition_processing */
           },
```

Em seguida, o otimizador verifica possíveis acessos `ref` e identifica um:

```sql
           {
             "ref_optimizer_key_uses": [
               {
                 "database": "test",
                 "table": "alias2",
                 "field": "pk",
                 "equals": "`test`.`alias1`.`col_int_key`",
                 "null_rejecting": true
              }
           ] /* ref_optimizer_key_uses */
         },
```

Um acesso `ref` que rejeita `NULL` foi identificado: nenhum `NULL` em `test.alias1.col_int_key` pode ter uma correspondência (match). (Observe que poderia haver uma correspondência, caso o operador fosse um null-safe equals `<=>`).

Em seguida, para cada table na Query, estimamos o custo e o número de registros retornados por um table scan ou por um range access.

Precisamos encontrar uma ordem ótima para as tables. Normalmente, a busca gulosa (greedy search) é usada, mas como a instrução usa um straight join, apenas a ordem solicitada é explorada, e um ou mais métodos de acesso são selecionados. Conforme mostrado nesta porção do trace, podemos escolher um table scan:

```sql
           {
"records_estimation": [
               {
                 "database": "test",
                 "table": "alias1",
                 "const_keys_added": {
                   "keys": [
                   ] /* keys */,
                   "cause": "group_by"
                 } /* const_keys_added */,
                 "range_analysis": {
                   "table_scan": {
                     "records": 20,
                     "cost": 8.1977
                   } /* table_scan */
                 } /* range_analysis */
               },
               {
                 "database": "test",
                 "table": "alias2",
                 "const_keys_added": {
                   "keys": [
                     "PRIMARY"
                   ] /* keys */,
                   "cause": "group_by"
                 } /* const_keys_added */,
                 "range_analysis": {
                   "table_scan": {
                     "records": 100,
                     "cost": 24.588
                   } /* table_scan */,
                   "potential_range_indices": [
                     {
                       "index": "PRIMARY",
                       "usable": true,
                       "key_parts": [
                         "pk"
                       ] /* key_parts */
                     }
                   ] /* potential_range_indices */,
                   "setup_range_conditions": [
                   ] /* setup_range_conditions */,
                   "group_index_range": {
                     "chosen": false,
                     "cause": "not_single_table"
                      } /* group_index_range */
                } /* range_analysis */
               }
             ] /* records_estimation */
           },
```

Conforme mostrado na segunda porção da análise de range, não é possível usar `GROUP_MIN_MAX` porque ele aceita apenas uma table, e temos duas no JOIN. Isso significa que nenhum range access é possível.

O otimizador estima que ler a primeira table, e aplicar quaisquer condições necessárias a ela, resulta em 20 linhas (rows):

```sql
           {
"considered_execution_plans": [
               {
                 "database": "test",
                 "table": "alias1",
                 "best_access_path": {
                   "considered_access_paths": [
                     {
                       "access_type": "scan",
                       "records": 20,
                       "cost": 2.0977,
                       "chosen": true
                     }
                   ] /* considered_access_paths */
                 } /* best_access_path */,
                 "cost_for_plan": 6.0977,
                 "records_for_plan": 20,
```

Para `alias2`, escolhemos o acesso `ref` na Primary Key em vez de um table scan, porque o número de registros retornados por este último (75) é muito maior do que o retornado pelo acesso `ref` (1), conforme mostrado aqui:

```sql
                 "rest_of_plan": [
                   {
                     "database": "test",
                     "table": "alias2",
                     "best_access_path": {
                       "considered_access_paths": [
                         {
                           "access_type": "ref",
                           "index": "PRIMARY",
                           "records": 1,
                           "cost": 20.2,
                           "chosen": true
                         },
                         {
                           "access_type": "scan",
                           "using_join_cache": true,
                           "records": 75,
                           "cost": 7.4917,
                           "chosen": false
                         }
                       ] /* considered_access_paths */
                     } /* best_access_path */,
                     "cost_for_plan": 30.098,
                     "records_for_plan": 20,
                     "chosen": true
                   }
                 ] /* rest_of_plan */
               }
             ] /* considered_execution_plans */
           },
```

Agora que a ordem das tables está definida, podemos dividir a condição `WHERE` em partes (chunks) que podem ser testadas precocemente (pushdown de condições na árvore do JOIN):

```sql
           {
              "attaching_conditions_to_tables": {
                "original_condition": "((`test`.`alias2`.`pk` = \
                `test`.`alias1`.`col_int_key`) and `test`.`alias1`.`pk`)",
                "attached_conditions_computation": [
                ] /* attached_conditions_computation */,
                "attached_conditions_summary": [
                  {
                    "database": "test",
                    "table": "alias1",
                    "attached": "(`test`.`alias1`.`pk` and \
                    (`test`.`alias1`.`col_int_key` is not null))"
           },
```

Esta condição pode ser testada nas linhas de `alias1` sem ler linhas de `alias2`.

```sql
                 {
                   "database": "test",
                   "table": "alias2",
                   "attached": null
                 }
               ] /* attached_conditions_summary */
             } /* attaching_conditions_to_tables */
           },
           {
```

Agora tentamos simplificar o `ORDER BY`:

```sql
              "clause_processing": {
               "clause": "ORDER BY",
               "original_clause": "`test`.`alias1`.`col_int_key`,`test`.`alias2`.`pk`",
               "items": [
                 {
                   "item": "`test`.`alias1`.`col_int_key`"
                 },
                 {
                   "item": "`test`.`alias2`.`pk`",
                   "eq_ref_to_preceding_items": true
                 }
               ] /* items */,
```

Como a cláusula `WHERE` contém `alias2.pk=alias1.col_int_key`, a ordenação por ambas as colunas é desnecessária; podemos ordenar apenas pela primeira coluna, já que a segunda coluna é sempre igual a ela.

```sql
               "resulting_clause_is_simple": true,
               "resulting_clause": "`test`.`alias1`.`col_int_key`"
              } /* clause_processing */
           },
```

A cláusula `ORDER BY` mais curta (que não é visível na saída do `EXPLAIN`) pode ser implementada como um index scan, já que usa apenas uma única coluna de uma table.

```sql
           {
             "clause_processing": {
               "clause": "GROUP BY",
               "original_clause": "`test`.`alias2`.`pk`",
               "items": [
                 {
                   "item": "`test`.`alias2`.`pk`"
                 }
               ] /* items */,
               "resulting_clause_is_simple": false,
               "resulting_clause": "`test`.`alias2`.`pk`"
             } /* clause_processing */
           },
           {
             "refine_plan": [
               {
                 "database": "test",
                 "table": "alias1",
                 "scan_type": "table"
               },
               {
                 "database": "test",
                 "table": "alias2"
               }
             ] /* refine_plan */
           }
         ] /* steps */
       } /* join_optimization */
     },
     {
```

Agora o JOIN é executado:

```sql
       "join_execution": {
         "select#": 1,
         "steps": [
         ] /* steps */
       } /* join_execution */
     }
   ] /* steps */
 }	0	0
```

Todos os traces têm a mesma estrutura básica. Se uma instrução usa subqueries, pode haver múltiplas preparações, otimizações e execuções, bem como transformações específicas para subqueries.

O trace completo é mostrado aqui:

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.OPTIMIZER_TRACE\G
*************************** 1. row ***************************
                            QUERY: SELECT SUM(alias2.col_varchar_nokey) AS c1, alias2.pk AS c2
  FROM t1 AS alias1
  STRAIGHT_JOIN t2 AS alias2
  ON alias2.pk = alias1.col_int_key
  WHERE alias1.pk
  GROUP BY c2
  ORDER BY alias1.col_int_key, alias2.pk
                            TRACE: {
  "steps": [
    {
      "join_preparation": {
        "select#": 1,
        "steps": [
          {
            "expanded_query": "/* select#1 */ select sum(`alias2`.`col_varchar_nokey`) AS `c1`,`alias2`.`pk` AS `c2` from (`t1` `alias1` straight_join `t2` `alias2` on((`alias2`.`pk` = `alias1`.`col_int_key`))) where (0 <> `alias1`.`pk`) group by `c2` order by `alias1`.`col_int_key`,`alias2`.`pk`"
          },
          {
            "transformations_to_nested_joins": {
              "transformations": [
                "JOIN_condition_to_WHERE",
                "parenthesis_removal"
              ] /* transformations */,
              "expanded_query": "/* select#1 */ select sum(`alias2`.`col_varchar_nokey`) AS `c1`,`alias2`.`pk` AS `c2` from `t1` `alias1` straight_join `t2` `alias2` where ((0 <> `alias1`.`pk`) and (`alias2`.`pk` = `alias1`.`col_int_key`)) group by `c2` order by `alias1`.`col_int_key`,`alias2`.`pk`"
            } /* transformations_to_nested_joins */
          },
          {
            "functional_dependencies_of_GROUP_columns": {
              "all_columns_of_table_map_bits": [
                1
              ] /* all_columns_of_table_map_bits */,
              "columns": [
                "test.alias2.pk",
                "test.alias1.col_int_key"
              ] /* columns */
            } /* functional_dependencies_of_GROUP_columns */
          }
        ] /* steps */
      } /* join_preparation */
    },
    {
      "join_optimization": {
        "select#": 1,
        "steps": [
          {
            "condition_processing": {
              "condition": "WHERE",
              "original_condition": "((0 <> `alias1`.`pk`) and (`alias2`.`pk` = `alias1`.`col_int_key`))",
              "steps": [
                {
                  "transformation": "equality_propagation",
                  "resulting_condition": "((0 <> `alias1`.`pk`) and multiple equal(`alias2`.`pk`, `alias1`.`col_int_key`))"
                },
                {
                  "transformation": "constant_propagation",
                  "resulting_condition": "((0 <> `alias1`.`pk`) and multiple equal(`alias2`.`pk`, `alias1`.`col_int_key`))"
                },
                {
                  "transformation": "trivial_condition_removal",
                  "resulting_condition": "((0 <> `alias1`.`pk`) and multiple equal(`alias2`.`pk`, `alias1`.`col_int_key`))"
                }
              ] /* steps */
            } /* condition_processing */
          },
          {
            "substitute_generated_columns": {
            } /* substitute_generated_columns */
          },
          {
            "table_dependencies": [
              {
                "table": "`t1` `alias1`",
                "row_may_be_null": false,
                "map_bit": 0,
                "depends_on_map_bits": [
                ] /* depends_on_map_bits */
              },
              {
                "table": "`t2` `alias2`",
                "row_may_be_null": false,
                "map_bit": 1,
                "depends_on_map_bits": [
                  0
                ] /* depends_on_map_bits */
              }
            ] /* table_dependencies */
          },
          {
            "ref_optimizer_key_uses": [
              {
                "table": "`t2` `alias2`",
                "field": "pk",
                "equals": "`alias1`.`col_int_key`",
                "null_rejecting": true
              }
            ] /* ref_optimizer_key_uses */
          },
          {
            "rows_estimation": [
              {
                "table": "`t1` `alias1`",
                "table_scan": {
                  "rows": 20,
                  "cost": 0.25
                } /* table_scan */
              },
              {
                "table": "`t2` `alias2`",
                "const_keys_added": {
                  "keys": [
                    "PRIMARY"
                  ] /* keys */,
                  "cause": "group_by"
                } /* const_keys_added */,
                "range_analysis": {
                  "table_scan": {
                    "rows": 100,
                    "cost": 12.35
                  } /* table_scan */,
                  "potential_range_indexes": [
                    {
                      "index": "PRIMARY",
                      "usable": true,
                      "key_parts": [
                        "pk"
                      ] /* key_parts */
                    }
                  ] /* potential_range_indexes */,
                  "setup_range_conditions": [
                  ] /* setup_range_conditions */,
                  "group_index_skip_scan": {
                    "chosen": false,
                    "cause": "not_single_table"
                  } /* group_index_skip_scan */,
                  "skip_scan_range": {
                    "chosen": false,
                    "cause": "not_single_table"
                  } /* skip_scan_range */
                } /* range_analysis */
              }
            ] /* rows_estimation */
          },
          {
            "considered_execution_plans": [
              {
                "plan_prefix": [
                ] /* plan_prefix */,
                "table": "`t1` `alias1`",
                "best_access_path": {
                  "considered_access_paths": [
                    {
                      "rows_to_scan": 20,
                      "filtering_effect": [
                      ] /* filtering_effect */,
                      "final_filtering_effect": 0.9,
                      "access_type": "scan",
                      "resulting_rows": 18,
                      "cost": 2.25,
                      "chosen": true
                    }
                  ] /* considered_access_paths */
                } /* best_access_path */,
                "condition_filtering_pct": 100,
                "rows_for_plan": 18,
                "cost_for_plan": 2.25,
                "rest_of_plan": [
                  {
                    "plan_prefix": [
                      "`t1` `alias1`"
                    ] /* plan_prefix */,
                    "table": "`t2` `alias2`",
                    "best_access_path": {
                      "considered_access_paths": [
                        {
                          "access_type": "eq_ref",
                          "index": "PRIMARY",
                          "rows": 1,
                          "cost": 6.3,
                          "chosen": true,
                          "cause": "clustered_pk_chosen_by_heuristics"
                        },
                        {
                          "rows_to_scan": 100,
                          "filtering_effect": [
                          ] /* filtering_effect */,
                          "final_filtering_effect": 1,
                          "access_type": "scan",
                          "using_join_cache": true,
                          "buffers_needed": 1,
                          "resulting_rows": 100,
                          "cost": 180.25,
                          "chosen": false
                        }
                      ] /* considered_access_paths */
                    } /* best_access_path */,
                    "condition_filtering_pct": 100,
                    "rows_for_plan": 18,
                    "cost_for_plan": 8.55,
                    "chosen": true
                  }
                ] /* rest_of_plan */
              }
            ] /* considered_execution_plans */
          },
          {
            "attaching_conditions_to_tables": {
              "original_condition": "((`alias2`.`pk` = `alias1`.`col_int_key`) and (0 <> `alias1`.`pk`))",
              "attached_conditions_computation": [
              ] /* attached_conditions_computation */,
              "attached_conditions_summary": [
                {
                  "table": "`t1` `alias1`",
                  "attached": "((0 <> `alias1`.`pk`) and (`alias1`.`col_int_key` is not null))"
                },
                {
                  "table": "`t2` `alias2`",
                  "attached": "(`alias2`.`pk` = `alias1`.`col_int_key`)"
                }
              ] /* attached_conditions_summary */
            } /* attaching_conditions_to_tables */
          },
          {
            "optimizing_distinct_group_by_order_by": {
              "simplifying_order_by": {
                "original_clause": "`alias1`.`col_int_key`,`alias2`.`pk`",
                "items": [
                  {
                    "item": "`alias1`.`col_int_key`"
                  },
                  {
                    "item": "`alias2`.`pk`",
                    "eq_ref_to_preceding_items": true
                  }
                ] /* items */,
                "resulting_clause_is_simple": true,
                "resulting_clause": "`alias1`.`col_int_key`"
              } /* simplifying_order_by */,
              "simplifying_group_by": {
                "original_clause": "`c2`",
                "items": [
                  {
                    "item": "`alias2`.`pk`"
                  }
                ] /* items */,
                "resulting_clause_is_simple": false,
                "resulting_clause": "`c2`"
              } /* simplifying_group_by */
            } /* optimizing_distinct_group_by_order_by */
          },
          {
            "finalizing_table_conditions": [
              {
                "table": "`t1` `alias1`",
                "original_table_condition": "((0 <> `alias1`.`pk`) and (`alias1`.`col_int_key` is not null))",
                "final_table_condition   ": "((0 <> `alias1`.`pk`) and (`alias1`.`col_int_key` is not null))"
              },
              {
                "table": "`t2` `alias2`",
                "original_table_condition": "(`alias2`.`pk` = `alias1`.`col_int_key`)",
                "final_table_condition   ": null
              }
            ] /* finalizing_table_conditions */
          },
          {
            "refine_plan": [
              {
                "table": "`t1` `alias1`"
              },
              {
                "table": "`t2` `alias2`"
              }
            ] /* refine_plan */
          },
          {
            "considering_tmp_tables": [
              {
                "adding_tmp_table_in_plan_at_position": 2,
                "write_method": "continuously_update_group_row"
              },
              {
                "adding_sort_to_table": ""
              } /* filesort */
            ] /* considering_tmp_tables */
          }
        ] /* steps */
      } /* join_optimization */
    },
    {
      "join_execution": {
        "select#": 1,
        "steps": [
          {
            "temp_table_aggregate": {
              "select#": 1,
              "steps": [
                {
                  "creating_tmp_table": {
                    "tmp_table_info": {
                      "table": "<temporary>",
                      "in_plan_at_position": 2,
                      "columns": 3,
                      "row_length": 18,
                      "key_length": 4,
                      "unique_constraint": false,
                      "makes_grouped_rows": true,
                      "cannot_insert_duplicates": false,
                      "location": "TempTable"
                    } /* tmp_table_info */
                  } /* creating_tmp_table */
                }
              ] /* steps */
            } /* temp_table_aggregate */
          },
          {
            "sorting_table": "<temporary>",
            "filesort_information": [
              {
                "direction": "asc",
                "expression": "`alias1`.`col_int_key`"
              }
            ] /* filesort_information */,
            "filesort_priority_queue_optimization": {
              "usable": false,
              "cause": "not applicable (no LIMIT)"
            } /* filesort_priority_queue_optimization */,
            "filesort_execution": [
            ] /* filesort_execution */,
            "filesort_summary": {
              "memory_available": 262144,
              "key_size": 9,
              "row_size": 26,
              "max_rows_per_buffer": 7710,
              "num_rows_estimate": 18446744073709551615,
              "num_rows_found": 8,
              "num_initial_chunks_spilled_to_disk": 0,
              "peak_memory_used": 32832,
              "sort_algorithm": "std::sort",
              "unpacked_addon_fields": "skip_heuristic",
              "sort_mode": "<fixed_sort_key, additional_fields>"
            } /* filesort_summary */
          }
        ] /* steps */
      } /* join_execution */
    }
  ] /* steps */
}
MISSING_BYTES_BEYOND_MAX_MEM_SIZE: 0
          INSUFFICIENT_PRIVILEGES: 0
```