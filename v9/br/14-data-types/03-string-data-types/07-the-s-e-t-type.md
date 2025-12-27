### 13.3.7 O Tipo `SET`

Um `SET` é um objeto de string que pode ter zero ou mais valores, cada um dos quais deve ser escolhido de uma lista de valores permitidos especificados quando a tabela é criada. Os valores das colunas `SET` que consistem em vários membros do conjunto são especificados com membros separados por vírgulas (`,`). Uma consequência disso é que os valores dos membros `SET` não devem conter vírgulas em si.

Por exemplo, uma coluna especificada como `SET('one', 'two') NOT NULL` pode ter qualquer um desses valores:

```
''
'one'
'two'
'one,two'
```

Uma coluna `SET` pode ter um máximo de 64 membros distintos.

Valores duplicados na definição causam um aviso ou um erro se o modo SQL rigoroso estiver ativado.

Espaços finais são automaticamente excluídos dos valores dos membros `SET` na definição da tabela quando uma tabela é criada.

Consulte os Requisitos de Armazenamento do Tipo de Dados de String para os requisitos de armazenamento do tipo `SET`.

Consulte a Seção 13.3.1, “Sintaxe do Tipo de Dados de Texto”, para a sintaxe e limites de comprimento do tipo `SET`.

Quando recuperados, os valores armazenados em uma coluna `SET` são exibidos usando a letra maiúscula que foi usada na definição da coluna. Note que as colunas `SET` podem ser atribuídas a um conjunto de caracteres e uma ordenação. Para ordenações binárias ou sensíveis ao caso, a letra maiúscula é levada em consideração ao atribuir valores à coluna.

O MySQL armazena os valores `SET` numericamente, com o bit de menor ordem do valor armazenado correspondendo ao primeiro membro do conjunto. Se você recuperar um valor `SET` em um contexto numérico, o valor recuperado tem bits definidos correspondentes aos membros do conjunto que compõem o valor da coluna. Por exemplo, você pode recuperar valores numéricos de uma coluna `SET` assim:

```
mysql> SELECT set_col+0 FROM tbl_name;
```

Se um número for armazenado em uma coluna `SET`, os bits definidos na representação binária do número determinam os membros do conjunto no valor da coluna. Para uma coluna especificada como `SET('a','b','c','d')`, os membros têm os seguintes valores decimais e binários.

<table summary="Valores decimais e binários para os membros de uma coluna especificada como SET('a','b','c','d')."><col style="width: 15%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th scope="col"><code class="literal">SET</code> Member</th> <th scope="col">Decimal Value</th> <th scope="col">Binary Value</th> </tr></thead><tbody><tr> <th scope="row"><code class="literal">'a'</code></th> <td><code class="literal">1</code></td> <td><code class="literal">0001</code></td> </tr><tr> <th scope="row"><code class="literal">'b'</code></th> <td><code class="literal">2</code></td> <td><code class="literal">0010</code></td> </tr><tr> <th scope="row"><code class="literal">'c'</code></th> <td><code class="literal">4</code></td> <td><code class="literal">0100</code></td> </tr><tr> <th scope="row"><code class="literal">'d'</code></th> <td><code class="literal">8</code></td> <td><code class="literal">1000</code></td> </tr></tbody></table>

Se você atribuir o valor `9` a esta coluna, que é `1001` em binário, então os primeiros e quarto membros do valor `SET` `'a'` e `'d'` são selecionados e o valor resultante é `'a,d'`.

Para um valor que contém mais de um elemento do `SET`, não importa a ordem em que os elementos são listados ao inserir o valor. Também não importa quantas vezes um determinado elemento é listado no valor. Quando o valor é recuperado posteriormente, cada elemento no valor aparece uma vez, com os elementos listados de acordo com a ordem em que foram especificados no momento da criação da tabela. Suponha que uma coluna seja especificada como `SET('a','b','c','d')`:

```
mysql> CREATE TABLE myset (col SET('a', 'b', 'c', 'd'));
```

Se você inserir os valores `'a,d'`, `'d,a'`, `'a,d,d'`, `'a,d,a'`, e `'d,a,d'`:

```
mysql> INSERT INTO myset (col) VALUES
-> ('a,d'), ('d,a'), ('a,d,a'), ('a,d,d'), ('d,a,d');
Query OK, 5 rows affected (0.01 sec)
Records: 5  Duplicates: 0  Warnings: 0
```

Então todos esses valores aparecem como `'a,d'` quando recuperados:

```
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

Se você definir uma coluna `SET` para um valor não suportado, o valor é ignorado e uma mensagem de aviso é emitida:

```
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

Se o modo SQL rigoroso estiver habilitado, as tentativas de inserir valores `SET` inválidos resultam em um erro.

Os valores `SET` são ordenados numericamente. Valores `NULL` são ordenados antes dos valores `SET` não `NULL`.

Funções como `SUM()` ou `AVG()` que esperam um argumento numérico convertem o argumento para um número, se necessário. Para valores `SET`, a operação de conversão faz com que o valor numérico seja usado.

Normalmente, você busca por valores `SET` usando a função `FIND_IN_SET()` ou o operador `LIKE`:

```
mysql> SELECT * FROM tbl_name WHERE FIND_IN_SET('value',set_col)>0;
mysql> SELECT * FROM tbl_name WHERE set_col LIKE '%value%';
```

A primeira declaração encontra linhas onde *`set_col`* contém o *`value`* membro do conjunto. A segunda é semelhante, mas não a mesma: Encontra linhas onde *`set_col`* contém *`value`* em qualquer lugar, mesmo como uma substring de outro membro do conjunto.

As seguintes declarações também são permitidas:

```m8csmGOdta

O primeiro desses comandos procura por valores que contenham o primeiro membro do conjunto. O segundo procura por uma correspondência exata. Tenha cuidado com comparações do segundo tipo. Comparar valores de conjunto com `'val1,val2'` retorna resultados diferentes de comparar valores com `'val2,val1'`. Você deve especificar os valores na mesma ordem em que estão listados na definição da coluna.

Para determinar todos os valores possíveis para uma coluna `SET`, use `SHOW COLUMNS FROM tbl_name LIKE set_col` e analise a definição `SET` na coluna `Type` do resultado.

Na API C, os valores `SET` são retornados como strings. Para obter informações sobre como usar o metadado do conjunto de resultados para diferenciá-los de outras strings, consulte C API Basic Data Structures.