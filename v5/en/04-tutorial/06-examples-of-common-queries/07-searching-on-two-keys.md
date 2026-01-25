### 3.6.7 Pesquisando em Duas Chaves

Um [`OR`](logical-operators.html#operator_or) usando uma única chave é bem otimizado, assim como o tratamento de [`AND`](logical-operators.html#operator_and).

O único caso complicado é o de pesquisar em duas chaves diferentes combinadas com [`OR`](logical-operators.html#operator_or):

```sql
SELECT field1_index, field2_index FROM test_table
WHERE field1_index = '1' OR  field2_index = '1'
```

Este caso é otimizado. Consulte a [Seção 8.2.1.3, “Otimização Index Merge”](index-merge-optimization.html "8.2.1.3 Index Merge Optimization").

Você também pode resolver o problema de forma eficiente usando uma [`UNION`](union.html "13.2.9.3 UNION Clause") que combina a saída de duas instruções [`SELECT`](select.html "13.2.9 SELECT Statement") separadas. Consulte a [Seção 13.2.9.3, “Cláusula UNION”](union.html "13.2.9.3 UNION Clause").

Cada [`SELECT`](select.html "13.2.9 SELECT Statement") pesquisa apenas uma chave e pode ser otimizado:

```sql
SELECT field1_index, field2_index
    FROM test_table WHERE field1_index = '1'
UNION
SELECT field1_index, field2_index
    FROM test_table WHERE field2_index = '1';
```