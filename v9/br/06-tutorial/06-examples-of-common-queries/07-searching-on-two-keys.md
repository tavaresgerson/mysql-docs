### 5.6.7 Pesquisas em Duas Chaves

Uma consulta `OR` com uma única chave é bem otimizada, assim como o tratamento de `AND`.

O caso complicado é a pesquisa em duas chaves diferentes combinadas com `OR`:

```
SELECT field1_index, field2_index FROM test_table
WHERE field1_index = '1' OR  field2_index = '1'
```

Este caso é otimizado. Veja a Seção 10.2.1.3, “Otimização da Fusão de Índices”.

Você também pode resolver o problema de forma eficiente usando uma `UNION` que combina a saída de duas instruções `SELECT` separadas. Veja a Seção 15.2.18, “Cláusula UNION”.

Cada `SELECT` pesquisa apenas uma chave e pode ser otimizado:

```
SELECT field1_index, field2_index
    FROM test_table WHERE field1_index = '1'
UNION
SELECT field1_index, field2_index
    FROM test_table WHERE field2_index = '1';
```