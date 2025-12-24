#### 5.3.4.6 Trabalho com valores de `NULL`

O valor `NULL` pode ser surpreendente até você se acostumar com ele. Conceitualmente, `NULL` significa "um valor desconhecido ausente" e é tratado de forma um pouco diferente de outros valores.

Para testar o `NULL`, use os operadores `IS NULL` e `IS NOT NULL`, como mostrado aqui:

```
mysql> SELECT 1 IS NULL, 1 IS NOT NULL;
+-----------+---------------+
| 1 IS NULL | 1 IS NOT NULL |
+-----------+---------------+
|         0 |             1 |
+-----------+---------------+
```

Você não pode usar operadores de comparação aritmética como `=`, `<`, ou `<>` para testar para `NULL`.

```
mysql> SELECT 1 = NULL, 1 <> NULL, 1 < NULL, 1 > NULL;
+----------+-----------+----------+----------+
| 1 = NULL | 1 <> NULL | 1 < NULL | 1 > NULL |
+----------+-----------+----------+----------+
|     NULL |      NULL |     NULL |     NULL |
+----------+-----------+----------+----------+
```

Como o resultado de qualquer comparação aritmética com \[`NULL`] também é \[`NULL`], você não pode obter resultados significativos de tais comparações.

No MySQL, `0` ou `NULL` significa falso e qualquer outra coisa significa verdadeiro. O valor de verdade padrão de uma operação booleana é `1`.

Este tratamento especial de \[`NULL`] é o motivo pelo qual, na seção anterior, foi necessário determinar quais animais não estão mais vivos usando \[`death IS NOT NULL`]] em vez de \[`death <> NULL`].

Dois valores de `NULL` são considerados iguais em um `GROUP BY`.

Ao fazer um `ORDER BY`, os valores de `NULL` são apresentados primeiro se você fizer `ORDER BY ... ASC` e por último se você fizer `ORDER BY ... DESC`.

Um erro comum quando se trabalha com o `NULL` é assumir que não é possível inserir um zero ou uma string vazia em uma coluna definida como `NOT NULL`, mas este não é o caso. Estes são de fato valores, enquanto que o `NULL` significa não ter um valor. Você pode testar isso facilmente usando o `IS [NOT] NULL` como mostrado:

```
mysql> SELECT 0 IS NULL, 0 IS NOT NULL, '' IS NULL, '' IS NOT NULL;
+-----------+---------------+------------+----------------+
| 0 IS NULL | 0 IS NOT NULL | '' IS NULL | '' IS NOT NULL |
+-----------+---------------+------------+----------------+
|         0 |             1 |          0 |              1 |
+-----------+---------------+------------+----------------+
```

Assim, é inteiramente possível inserir uma string zero ou vazia em uma coluna `NOT NULL`, pois estas são de fato `NOT NULL`.
