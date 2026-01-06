### 3.6.7 Pesquisar em duas chaves

Uma expressão `OR` (operadores lógicos.html#operador\_ou) usando uma única chave é bem otimizada, assim como o tratamento da expressão `AND` (operadores lógicos.html#operador\_e).

O caso mais complicado é o de pesquisar em duas chaves diferentes combinadas com \[`OR`]\(operadores lógicos.html#operador\_ou):

```sql
SELECT field1_index, field2_index FROM test_table
WHERE field1_index = '1' OR  field2_index = '1'
```

Este caso está otimizado. Veja [Seção 8.2.1.3, “Otimização da Mesclagem de Índices”](index-merge-optimization.html).

Você também pode resolver o problema de forma eficiente usando uma `UNION` que combina a saída de duas instruções `SELECT` separadas. Veja [Seção 13.2.9.3, “Cláusula UNION”](union.html).

Cada [`SELECT`](select.html) pesquisa apenas uma chave e pode ser otimizado:

```sql
SELECT field1_index, field2_index
    FROM test_table WHERE field1_index = '1'
UNION
SELECT field1_index, field2_index
    FROM test_table WHERE field2_index = '1';
```
