### 11.3.3 Os tipos BINARY e VARBINARY

Os tipos `BINARY` e `VARBINARY` são semelhantes aos `CHAR` e `VARCHAR`, exceto que eles armazenam strings binárias em vez de strings não binárias. Isso significa que eles armazenam strings de bytes em vez de strings de caracteres. Isso significa que eles têm o conjunto de caracteres `binary` e a ordenação, e a comparação e ordenação são baseadas nos valores numéricos dos bytes nos valores.

O comprimento máximo permitido é o mesmo para `BINARY` e `VARBINARY` quanto para `CHAR` e `VARCHAR`, exceto que o comprimento para `BINARY` e `VARBINARY` é medido em bytes, e não em caracteres.

Os tipos de dados `BINARY` e `VARBINARY` são distintos dos tipos de dados `CHAR BINARY` e `VARCHAR BINARY`. Para esses últimos tipos, o atributo `BINARY` não faz com que a coluna seja tratada como uma coluna de string binária. Em vez disso, faz com que a collation binária (\_bin) para o conjunto de caracteres da coluna (ou o conjunto de caracteres padrão da tabela, se nenhum conjunto de caracteres da coluna for especificado) seja usada, e a própria coluna armazena strings de caracteres não binárias, em vez de strings de bytes binários. Por exemplo, se o conjunto de caracteres padrão for `latin1`, `CHAR(5) BINARY` é tratado como `CHAR(5) CHARACTER SET latin1 COLLATE latin1_bin`. Isso difere de `BINARY(5)`, que armazena strings de bytes binários de 5 bytes que têm o conjunto de caracteres `binary` e a collation. Para obter informações sobre as diferenças entre a collation `binary` do conjunto de caracteres `binary` e as collation `_bin` dos conjuntos de caracteres não binários, consulte a Seção 10.8.5, “A collation binary em comparação com as collation \_bin”.

Se o modo SQL rigoroso não estiver habilitado e você atribuir um valor a uma coluna `BINARY` ou `VARBINARY` que exceda o comprimento máximo da coluna, o valor será truncado para caber e um aviso será gerado. Para casos de truncação, para causar um erro (em vez de um aviso) e suprimir a inserção do valor, use o modo SQL rigoroso. Consulte a Seção 5.1.10, “Modos SQL do Servidor”.

Quando os valores `BINARY` são armazenados, eles são preenchidos à direita com o valor de preenchimento até a comprimento especificado. O valor de preenchimento é `0x00` (o byte zero). Os valores são preenchidos à direita com `0x00` para inserções, e nenhum byte final é removido para recuperações. Todos os bytes são significativos em comparações, incluindo operações de `ORDER BY` e `DISTINCT`. `0x00` e o espaço diferem em comparações, com `0x00` sendo classificado antes do espaço.

Exemplo: Para uma coluna `BINARY(3)`, `'a '` se torna `'a \0'` quando inserido. `'a\0'` se torna `'a\0\0'` quando inserido. Ambos os valores inseridos permanecem inalterados para recuperações.

Para `VARBINARY`, não há preenchimento para inserções e nenhum byte é removido para recuperações. Todos os bytes são significativos em comparações, incluindo operações de `ORDER BY` e `DISTINCT`. `0x00` e o espaço diferem em comparações, com `0x00` sendo classificado antes do espaço.

Nos casos em que os bytes finais de preenchimento são removidos ou as comparações os ignoram, se uma coluna tiver um índice que exige valores únicos, inserir valores na coluna que diferem apenas no número de bytes finais de preenchimento resulta em um erro de chave duplicada. Por exemplo, se uma tabela contém `'a'`, uma tentativa de armazenar `'a\0'` causa um erro de chave duplicada.

Você deve considerar cuidadosamente as características de alinhamento e remoção anteriores se planeja usar o tipo de dados `BINARY` para armazenar dados binários e exigir que o valor recuperado seja exatamente o mesmo que o valor armazenado. O exemplo a seguir ilustra como o alinhamento `0x00` de valores `BINARY` afeta as comparações de valores de coluna:

```sql
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

Se o valor recuperado deve ser o mesmo que o valor especificado para armazenamento sem preenchimento, pode ser preferível usar `VARBINARY` ou um dos tipos de dados `BLOB` em vez disso.

Nota

No cliente **mysql**, as cadeias binárias são exibidas usando notação hexadecimal, dependendo do valor da opção `--binary-as-hex`. Para obter mais informações sobre essa opção, consulte a Seção 4.5.1, “mysql — O cliente de linha de comando do MySQL”.
