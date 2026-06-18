### 5.6.7 Pesquisar em duas chaves

Um `OR` que usa uma única chave está bem otimizado, assim como o tratamento do `AND`.

O caso mais complicado é o de pesquisar em duas chaves diferentes combinadas com `OR`:

```
SELECT field1_index, field2_index FROM test_table
WHERE field1_index = '1' OR  field2_index = '1'
```

Este caso está otimizado. Veja a Seção 10.2.1.3, “Otimização da Mesclagem de Índices”.

Você também pode resolver o problema de forma eficiente usando um `UNION` que combina a saída de duas declarações separadas `SELECT`. Veja a Seção 15.2.18, “Cláusula UNION”.

Cada `SELECT` busca apenas uma chave e pode ser otimizado:

```
SELECT field1_index, field2_index
    FROM test_table WHERE field1_index = '1'
UNION
SELECT field1_index, field2_index
    FROM test_table WHERE field2_index = '1';
```
