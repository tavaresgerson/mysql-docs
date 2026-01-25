### 11.3.3 Os Tipos BINARY e VARBINARY

Os tipos `BINARY` e `VARBINARY` são semelhantes a `CHAR` e `VARCHAR`, exceto que eles armazenam strings binárias em vez de strings não binárias. Ou seja, eles armazenam strings de bytes em vez de strings de caracteres. Isso significa que eles possuem o `character set` e `collation` `binary`, e a comparação e ordenação são baseadas nos valores numéricos dos bytes nos valores.

O comprimento máximo permitido é o mesmo para `BINARY` e `VARBINARY` do que para `CHAR` e `VARCHAR`, exceto que o comprimento para `BINARY` e `VARBINARY` é medido em bytes em vez de caracteres.

Os tipos de dados `BINARY` e `VARBINARY` são distintos dos tipos de dados `CHAR BINARY` e `VARCHAR BINARY`. Para estes últimos tipos, o atributo `BINARY` não faz com que a coluna seja tratada como uma coluna de string binária. Em vez disso, ele faz com que o `collation` binário (`_bin`) seja usado para o `character set` da coluna (ou o `character set` padrão da tabela se nenhum `character set` de coluna for especificado), e a própria coluna armazena strings de caracteres não binárias em vez de strings de bytes binários. Por exemplo, se o `character set` padrão for `latin1`, `CHAR(5) BINARY` é tratado como `CHAR(5) CHARACTER SET latin1 COLLATE latin1_bin`. Isso difere de `BINARY(5)`, que armazena strings binárias de 5 bytes que possuem o `character set` e `collation` `binary`. Para obter informações sobre as diferenças entre o `collation` `binary` do `character set` `binary` e os `collations` `_bin` de `character sets` não binários, consulte Section 10.8.5, “The binary Collation Compared to _bin Collations”.

Se o `strict SQL mode` não estiver ativado e você atribuir um valor a uma coluna `BINARY` ou `VARBINARY` que exceda o comprimento máximo da coluna, o valor é truncado para caber e um aviso é gerado. Para casos de truncamento, para fazer com que um erro ocorra (em vez de um aviso) e suprimir a `INSERT` do valor, use o `strict SQL mode`. Consulte Section 5.1.10, “Server SQL Modes”.

Quando valores `BINARY` são armazenados, eles são preenchidos à direita (right-padded) com o valor de preenchimento até o comprimento especificado. O valor de preenchimento é `0x00` (o byte zero). Os valores são preenchidos à direita com `0x00` para `INSERTS`, e nenhum byte final é removido nos `RETRIEVALS`. Todos os bytes são significativos nas comparações, incluindo operações `ORDER BY` e `DISTINCT`. `0x00` e espaço diferem nas comparações, com `0x00` sendo ordenado antes do espaço.

Exemplo: Para uma coluna `BINARY(3)`, `'a '` torna-se `'a \0'` quando inserido. `'a\0'` torna-se `'a\0\0'` quando inserido. Ambos os valores inseridos permanecem inalterados nos `RETRIEVALS`.

Para `VARBINARY`, não há preenchimento para `INSERTS` e nenhum byte é removido nos `RETRIEVALS`. Todos os bytes são significativos nas comparações, incluindo operações `ORDER BY` e `DISTINCT`. `0x00` e espaço diferem nas comparações, com `0x00` sendo ordenado antes do espaço.

Nesses casos em que os bytes de preenchimento finais são removidos ou as comparações os ignoram, se uma coluna tiver um `Index` que exija valores exclusivos, a `INSERT` de valores na coluna que diferem apenas no número de bytes de preenchimento finais resulta em um erro de chave duplicada (duplicate-key error). Por exemplo, se uma tabela contiver `'a'`, uma tentativa de armazenar `'a\0'` causa um erro de chave duplicada.

Você deve considerar cuidadosamente as características anteriores de preenchimento e remoção se planeja usar o tipo de dado `BINARY` para armazenar dados binários e exige que o valor recuperado seja exatamente o mesmo que o valor armazenado. O exemplo a seguir ilustra como o preenchimento com `0x00` em valores `BINARY` afeta as comparações de valores de coluna:

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

Note

Dentro do `mysql client`, strings binárias são exibidas usando notação hexadecimal, dependendo do valor da opção `--binary-as-hex`. Para mais informações sobre essa opção, consulte Section 4.5.1, “mysql — The MySQL Command-Line Client”.