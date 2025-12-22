### 5.6.7 Pesquisar em duas chaves

Um `OR` usando uma única chave é bem otimizado, assim como o manuseio de `AND`.

O único caso complicado é o de pesquisar em duas chaves diferentes combinadas com `OR`:

```
SELECT field1_index, field2_index FROM test_table
WHERE field1_index = '1' OR  field2_index = '1'
```

Este caso é otimizado. Ver Secção 10.2.1.3, "Otimização da fusão de índices".

Você também pode resolver o problema de forma eficiente usando um `UNION` que combina a saída de duas instruções `SELECT` separadas.

Cada `SELECT` procura apenas uma chave e pode ser otimizado:

```
SELECT field1_index, field2_index
    FROM test_table WHERE field1_index = '1'
UNION
SELECT field1_index, field2_index
    FROM test_table WHERE field2_index = '1';
```
