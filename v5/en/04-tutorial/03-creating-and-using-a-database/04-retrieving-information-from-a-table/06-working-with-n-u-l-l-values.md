#### 3.3.4.6 Trabalhando com Valores NULL

O valor `NULL` pode ser surpreendente até que você se acostume com ele. Conceitualmente, `NULL` significa "um valor ausente desconhecido" e é tratado de forma um pouco diferente dos outros valores.

Para testar `NULL`, use os operadores [`IS NULL`](comparison-operators.html#operator_is-null) e [`IS NOT NULL`](comparison-operators.html#operator_is-not-null), conforme mostrado aqui:

```sql
mysql> SELECT 1 IS NULL, 1 IS NOT NULL;
+-----------+---------------+
| 1 IS NULL | 1 IS NOT NULL |
+-----------+---------------+
|         0 |             1 |
+-----------+---------------+
```

Você não pode usar operadores de comparação aritmética como [`=`](comparison-operators.html#operator_equal), [`<`](comparison-operators.html#operator_less-than) ou [`<>`](comparison-operators.html#operator_not-equal) para testar `NULL`. Para demonstrar isso por conta própria, tente a seguinte Query:

```sql
mysql> SELECT 1 = NULL, 1 <> NULL, 1 < NULL, 1 > NULL;
+----------+-----------+----------+----------+
| 1 = NULL | 1 <> NULL | 1 < NULL | 1 > NULL |
+----------+-----------+----------+----------+
|     NULL |      NULL |     NULL |     NULL |
+----------+-----------+----------+----------+
```

Como o resultado de qualquer comparação aritmética com `NULL` também é `NULL`, você não pode obter resultados significativos a partir de tais comparações.

No MySQL, `0` ou `NULL` significa falso e qualquer outra coisa significa verdadeiro. O valor de verdade padrão de uma operação booleana é `1`.

Este tratamento especial de `NULL` é a razão pela qual, na seção anterior, foi necessário determinar quais animais não estão mais vivos usando `death IS NOT NULL` em vez de `death <> NULL`.

Dois valores `NULL` são considerados iguais em um `GROUP BY`.

Ao executar um `ORDER BY`, os valores `NULL` são apresentados primeiro se você fizer `ORDER BY ... ASC` e por último se você fizer `ORDER BY ... DESC`.

Um erro comum ao trabalhar com `NULL` é presumir que não é possível inserir um zero ou uma string vazia em uma coluna definida como `NOT NULL`, mas este não é o caso. Estes são, na verdade, valores, enquanto `NULL` significa "não ter um valor." Você pode testar isso facilmente usando `IS [NOT] NULL`, conforme mostrado:

```sql
mysql> SELECT 0 IS NULL, 0 IS NOT NULL, '' IS NULL, '' IS NOT NULL;
+-----------+---------------+------------+----------------+
| 0 IS NULL | 0 IS NOT NULL | '' IS NULL | '' IS NOT NULL |
+-----------+---------------+------------+----------------+
|         0 |             1 |          0 |              1 |
+-----------+---------------+------------+----------------+
```

Assim, é inteiramente possível inserir um zero ou uma string vazia em uma coluna `NOT NULL`, pois estes são, de fato, `NOT NULL`. Consulte [Seção B.3.4.3, “Problems with NULL Values”](problems-with-null.html "B.3.4.3 Problems with NULL Values").