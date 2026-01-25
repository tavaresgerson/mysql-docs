### 11.3.6 O Tipo SET

Um `SET` é um objeto string que pode ter zero ou mais valores, cada um dos quais deve ser escolhido de uma lista de valores permitidos especificada quando a table é criada. Valores de `SET` column que consistem em múltiplos membros do set são especificados com membros separados por vírgulas (`,`). Uma consequência disso é que os valores dos membros do `SET` não devem, eles próprios, conter vírgulas.

Por exemplo, uma column especificada como `SET('one', 'two') NOT NULL` pode ter qualquer um destes valores:

```sql
''
'one'
'two'
'one,two'
```

Uma `SET` column pode ter um máximo de 64 membros distintos. Uma table pode ter no máximo 255 definições de lista de elementos únicos entre suas columns `ENUM` e `SET` consideradas em grupo. Para mais informações sobre este limite, consulte Limites Impostos pela Estrutura de Arquivo .frm.

Valores duplicados na definição causam um *warning*, ou um *error* se o modo SQL estrito estiver habilitado.

Espaços à direita (*trailing spaces*) são automaticamente excluídos dos valores de membro `SET` na definição da table quando uma table é criada.

Consulte Requisitos de Armazenamento de Tipos String para os requisitos de armazenamento para o tipo `SET`.

Consulte a Seção 11.3.1, “Sintaxe de Tipos de Dados String” para a sintaxe e limites de comprimento do tipo `SET`.

Quando recuperados, os valores armazenados em uma `SET` column são exibidos usando o case de letras (*lettercase*) que foi usado na definição da column. Note que `SET` columns podem ter um *character set* e *collation* atribuídos. Para *collations* binárias ou *case-sensitive* (sensíveis a maiúsculas/minúsculas), o *lettercase* é levado em consideração ao atribuir valores à column.

O MySQL armazena valores `SET` numericamente, com o *low-order bit* do valor armazenado correspondendo ao primeiro membro do *set*. Se você recuperar um valor `SET` em um contexto numérico, o valor recuperado terá *bits set* correspondentes aos membros do *set* que compõem o valor da column. Por exemplo, você pode recuperar valores numéricos de uma `SET` column assim:

```sql
mysql> SELECT set_col+0 FROM tbl_name;
```

Se um número for armazenado em uma `SET` column, os *bits* definidos na representação binária do número determinam os membros do *set* no valor da column. Para uma column especificada como `SET('a','b','c','d')`, os membros têm os seguintes valores decimais e binários.

<table summary="Valores decimais e binários para membros de uma coluna especificada como SET('a','b','c','d')."><col style="width: 15%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th>Membro `SET`</th> <th>Valor Decimal</th> <th>Valor Binário</th> </tr></thead><tbody><tr> <th>`'a'`</th> <td>`1`</td> <td>`0001`</td> </tr><tr> <th>`'b'`</th> <td>`2`</td> <td>`0010`</td> </tr><tr> <th>`'c'`</th> <td>`4`</td> <td>`0100`</td> </tr><tr> <th>`'d'`</th> <td>`8`</td> <td>`1000`</td> </tr></tbody></table>

Se você atribuir um valor de `9` a esta column, que é `1001` em binário, o primeiro e o quarto membros do valor `SET`, `'a'` e `'d'`, são selecionados e o valor resultante é `'a,d'`.

Para um valor contendo mais de um elemento `SET`, não importa em qual ordem os elementos são listados quando você insere o valor. Também não importa quantas vezes um determinado elemento é listado no valor. Quando o valor é recuperado posteriormente, cada elemento no valor aparece uma vez, com os elementos listados de acordo com a ordem em que foram especificados no momento da criação da table. Suponha que uma column seja especificada como `SET('a','b','c','d')`:

```sql
mysql> CREATE TABLE myset (col SET('a', 'b', 'c', 'd'));
```

Se você inserir os valores `'a,d'`, `'d,a'`, `'a,d,d'`, `'a,d,a'` e `'d,a,d'`:

```sql
mysql> INSERT INTO myset (col) VALUES
-> ('a,d'), ('d,a'), ('a,d,a'), ('a,d,d'), ('d,a,d');
Query OK, 5 rows affected (0.01 sec)
Records: 5  Duplicates: 0  Warnings: 0
```

Então, todos esses valores aparecem como `'a,d'` quando recuperados:

```sql
mysql> SELECT col FROM myset;
+------+
| col  |
+------+
| a,d  |
| a,d  |
| a,d  |
| a,d  |
| a,d  |
+------+
5 rows in set (0.04 sec)
```

Se você definir uma `SET` column para um valor não suportado, o valor é ignorado e um *warning* é emitido:

```sql
mysql> INSERT INTO myset (col) VALUES ('a,d,d,s');
Query OK, 1 row affected, 1 warning (0.03 sec)

mysql> SHOW WARNINGS;
+---------+------+------------------------------------------+
| Level   | Code | Message                                  |
+---------+------+------------------------------------------+
| Warning | 1265 | Data truncated for column 'col' at row 1 |
+---------+------+------------------------------------------+
1 row in set (0.04 sec)

mysql> SELECT col FROM myset;
+------+
| col  |
+------+
| a,d  |
| a,d  |
| a,d  |
| a,d  |
| a,d  |
| a,d  |
+------+
6 rows in set (0.01 sec)
```

Se o modo SQL estrito estiver habilitado, tentativas de inserir valores `SET` inválidos resultam em um *error*.

Valores `SET` são ordenados numericamente. Valores `NULL` são ordenados antes dos valores `SET` não-`NULL`.

Functions como `SUM()` ou `AVG()` que esperam um argumento numérico convertem o argumento para um número, se necessário. Para valores `SET`, a operação de conversão faz com que o valor numérico seja usado.

Normalmente, você procura por valores `SET` usando a função `FIND_IN_SET()` ou o operador `LIKE`:

```sql
mysql> SELECT * FROM tbl_name WHERE FIND_IN_SET('value',set_col)>0;
mysql> SELECT * FROM tbl_name WHERE set_col LIKE '%value%';
```

A primeira instrução encontra as linhas onde *`set_col`* contém o membro *`value`* do *set*. A segunda é similar, mas não a mesma: Ela encontra linhas onde *`set_col`* contém *`value`* em qualquer lugar, mesmo como uma *substring* de outro membro do *set*.

As seguintes instruções também são permitidas:

```sql
mysql> SELECT * FROM tbl_name WHERE set_col & 1;
mysql> SELECT * FROM tbl_name WHERE set_col = 'val1,val2';
```

A primeira dessas instruções procura por valores que contenham o primeiro membro do *set*. A segunda procura por uma correspondência exata. Tenha cuidado com comparações do segundo tipo. Comparar valores de *set* com `'val1,val2'` retorna resultados diferentes do que comparar valores com `'val2,val1'`. Você deve especificar os valores na mesma ordem em que estão listados na definição da column.

Para determinar todos os valores possíveis para uma `SET` column, use `SHOW COLUMNS FROM tbl_name LIKE set_col` e faça o parse da definição `SET` na column `Type` da saída.

Na API C, os valores `SET` são retornados como *strings*. Para obter informações sobre como usar metadados de *result set* para distingui-los de outras *strings*, consulte Estruturas de Dados Básicas da API C.
