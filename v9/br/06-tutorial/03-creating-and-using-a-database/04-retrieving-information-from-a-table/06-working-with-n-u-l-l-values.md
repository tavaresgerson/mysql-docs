#### 5.3.4.6 Trabalhando com Valores NULL

O valor `NULL` pode ser surpreendente até que você se acostume com ele. Conceitualmente, `NULL` significa “um valor desconhecido ausente” e é tratado de maneira um pouco diferente de outros valores.

Para testar `NULL`, use os operadores `IS NULL` e `IS NOT NULL`, como mostrado aqui:

```
mysql> SELECT 1 IS NULL, 1 IS NOT NULL;
+-----------+---------------+
| 1 IS NULL | 1 IS NOT NULL |
+-----------+---------------+
|         0 |             1 |
+-----------+---------------+
```

Você não pode usar operadores de comparação aritmética, como `=`, `<` ou `<>`, para testar `NULL`. Para demonstrar isso por si mesmo, tente a seguinte consulta:

```
mysql> SELECT 1 = NULL, 1 <> NULL, 1 < NULL, 1 > NULL;
+----------+-----------+----------+----------+
| 1 = NULL | 1 <> NULL | 1 < NULL | 1 > NULL |
+----------+-----------+----------+----------+
|     NULL |      NULL |     NULL |     NULL |
+----------+-----------+----------+----------+
```

Como o resultado de qualquer comparação aritmética com `NULL` também é `NULL`, você não pode obter resultados significativos dessas comparações.

No MySQL, `0` ou `NULL` significa falso e qualquer outra coisa significa verdadeiro. O valor padrão do valor lógico de uma operação booleana é `1`.

Esse tratamento especial de `NULL` é a razão pela qual, na seção anterior, foi necessário determinar quais animais não estão mais vivos usando `death IS NOT NULL` em vez de `death <> NULL`.

Dois valores `NULL` são considerados iguais em um `GROUP BY`.

Ao fazer uma `ORDER BY`, os valores `NULL` são apresentados primeiro se você fizer `ORDER BY ... ASC` e por último se você fizer `ORDER BY ... DESC`.

Um erro comum ao trabalhar com `NULL` é assumir que não é possível inserir um zero ou uma string vazia em uma coluna definida como `NOT NULL`, mas isso não é o caso. Esses são, na verdade, valores, enquanto `NULL` significa “não ter um valor”. Você pode testar isso facilmente usando `IS [NOT] NULL` como mostrado:

```
mysql> SELECT 0 IS NULL, 0 IS NOT NULL, '' IS NULL, '' IS NOT NULL;
+-----------+---------------+------------+----------------+
| 0 IS NULL | 0 IS NOT NULL | '' IS NULL | '' IS NOT NULL |
+-----------+---------------+------------+----------------+
|         0 |             1 |          0 |              1 |
+-----------+---------------+------------+----------------+
```

Assim, é totalmente possível inserir um zero ou uma string vazia em uma coluna `NOT NULL`, pois esses são, na verdade, `NOT NULL`. Veja a Seção B.3.4.3, “Problemas com Valores NULL”.