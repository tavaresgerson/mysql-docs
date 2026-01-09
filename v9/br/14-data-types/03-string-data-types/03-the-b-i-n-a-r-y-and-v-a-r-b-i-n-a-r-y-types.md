### 13.3.3 Os tipos BINARY e VARBINARY

Os tipos `BINARY` e `VARBINARY` são semelhantes aos `CHAR` e `VARCHAR`, exceto que eles armazenam strings binárias em vez de strings não binárias. Isso significa que eles armazenam strings de bytes em vez de strings de caracteres. Isso implica que eles têm o conjunto de caracteres `binary` e a ordenação `binary`, e a comparação e ordenação são baseadas nos valores numéricos dos bytes nos valores.

O comprimento máximo permitido é o mesmo para `BINARY` e `VARBINARY` como para `CHAR` e `VARCHAR`, exceto que o comprimento para `BINARY` e `VARBINARY` é medido em bytes em vez de caracteres.

Os tipos de dados `BINARY` e `VARBINARY` são distintos dos tipos de dados `CHAR BINARY` e `VARCHAR BINARY`. Para esses últimos tipos, o atributo `BINARY` não faz com que a coluna seja tratada como uma coluna de string binária. Em vez disso, faz com que a ordenação binária (`_bin`) para o conjunto de caracteres da coluna (ou o conjunto de caracteres padrão da tabela, se nenhum conjunto de caracteres da coluna for especificado) seja usada, e a própria coluna armazena strings de caracteres não binárias em vez de strings de bytes binários. Por exemplo, se o conjunto de caracteres padrão é `utf8mb4`, `CHAR(5) BINARY` é tratado como `CHAR(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin`. Isso difere de `BINARY(5)`, que armazena strings binárias de 5 bytes que têm o conjunto de caracteres `binary` e a ordenação `binary`. Para informações sobre as diferenças entre a ordenação `binary` do conjunto de caracteres `binary` e as ordenações `_bin` dos conjuntos de caracteres não binários, consulte a Seção 12.8.5, “A ordenação binary comparada às ordenações _bin”.

Se o modo SQL rigoroso não estiver habilitado e você atribuir um valor a uma coluna `BINARY` ou `VARBINARY` que exceda o comprimento máximo da coluna, o valor é truncado para caber e um aviso é gerado. Para casos de truncação, para causar um erro (em vez de um aviso) e suprimir a inserção do valor, use o modo SQL rigoroso. Veja a Seção 7.1.11, “Modos SQL do Servidor”.

Quando os valores `BINARY` são armazenados, eles são preenchidos à direita com o valor de preenchimento até o comprimento especificado. O valor de preenchimento é `0x00` (o byte zero). Os valores são preenchidos à direita com `0x00` para inserções e nenhum byte final é removido para recuperações. Todos os bytes são significativos em comparações, incluindo operações de `ORDER BY` e `DISTINCT`. `0x00` e espaço diferem em comparações, com `0x00` sendo classificado antes de espaço.

Exemplo: Para uma coluna `BINARY(3)`, `'a '` se torna `'a \0'` quando inserido. `'a\0'` se torna `'a\0\0'` quando inserido. Ambos os valores inseridos permanecem inalterados para recuperações.

Para `VARBINARY`, não há preenchimento para inserções e nenhum byte é removido para recuperações. Todos os bytes são significativos em comparações, incluindo operações de `ORDER BY` e `DISTINCT`. `0x00` e espaço diferem em comparações, com `0x00` sendo classificado antes de espaço.

Para aqueles casos em que bytes de preenchimento finais são removidos ou comparações os ignoram, se uma coluna tiver um índice que requer valores únicos, inserir valores na coluna que diferem apenas no número de bytes de preenchimento finais resulta em um erro de chave duplicada. Por exemplo, se uma tabela contém `'a'`, uma tentativa de armazenar `'a\0'` causa um erro de chave duplicada.

Você deve considerar cuidadosamente as características de alinhamento e remoção anteriores se planeja usar o tipo de dados `BINARY` para armazenar dados binários e exigir que o valor recuperado seja exatamente o mesmo que o valor armazenado. O exemplo a seguir ilustra como o alinhamento `0x00` de valores `BINARY` afeta as comparações de valores de coluna:

```
mysql> CREATE TABLE t (c BINARY(3));
Query OK, 0 rows affected (0.01 sec)

mysql> INSERT INTO t SET c = 'a';
Query OK, 1 row affected (0.01 sec)

mysql> SELECT HEX(c), c = 'a', c = 'a\0\0' from t;
+--------+---------+-------------+
| HEX(c) | c = 'a' | c = 'a\0\0' |
+--------+---------+-------------+
| 610000 |       0 |           1 |
+--------+---------+-------------+
1 row in set (0.09 sec)
```

Se o valor recuperado deve ser o mesmo que o valor especificado para armazenamento sem alinhamento, pode ser preferível usar `VARBINARY` ou um dos tipos de dados `BLOB` em vez disso.

Nota

Dentro do cliente **mysql**, as strings binárias são exibidas usando notação hexadecimal, dependendo do valor da opção `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O Cliente de Linha de Comando do MySQL”.