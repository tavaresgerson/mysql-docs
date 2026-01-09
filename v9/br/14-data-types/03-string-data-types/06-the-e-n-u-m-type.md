### 13.3.6 O Tipo ENUM

Um `ENUM` é um objeto de string com um valor escolhido de uma lista de valores permitidos que são enumerados explicitamente na especificação da coluna no momento da criação da tabela.

Veja a Seção 13.3.1, “Sintaxe do Tipo de Dados de String” para a sintaxe e limites de comprimento do tipo `ENUM`.

O tipo `ENUM` tem essas vantagens:

* Armazenamento de dados compacto em situações em que uma coluna tem um conjunto limitado de valores possíveis. As strings que você especifica como valores de entrada são automaticamente codificadas como números. Veja a Seção 13.7, “Requisitos de Armazenamento do Tipo de Dado” para os requisitos de armazenamento do tipo `ENUM`.

* Consultas e saída legíveis. Os números são traduzidos de volta para as strings correspondentes nos resultados das consultas.

e essas possíveis questões a considerar:

* Se você criar valores de enumeração que parecem ser números, é fácil confundir os valores literais com seus números de índice internos, conforme explicado na Limitações de Enumeração.

* Usar colunas `ENUM` em cláusulas `ORDER BY` requer cuidado extra, conforme explicado na Ordenação de Enumeração.

* Criando e Usando Colunas ENUM
* Valores de Índice para Literais de Enumeração
* Tratamento de Literais de Enumeração
* Valores de Enumeração Vazios ou NULL
* Ordenação de Enumeração
* Limitações de Enumeração

#### Criando e Usando Colunas ENUM

Um valor de enumeração deve ser uma literal de string com aspas. Por exemplo, você pode criar uma tabela com uma coluna `ENUM` assim:

```
CREATE TABLE shirts (
    name VARCHAR(40),
    size ENUM('x-small', 'small', 'medium', 'large', 'x-large')
);
INSERT INTO shirts (name, size) VALUES ('dress shirt','large'), ('t-shirt','medium'),
  ('polo shirt','small');
SELECT name, size FROM shirts WHERE size = 'medium';
+---------+--------+
| name    | size   |
+---------+--------+
| t-shirt | medium |
+---------+--------+
UPDATE shirts SET size = 'small' WHERE size = 'large';
COMMIT;
```

Inserindo 1 milhão de linhas nesta tabela com um valor de `'medium'` exigiria 1 milhão de bytes de armazenamento, em oposição a 6 milhões de bytes se você armazenasse a string `'medium'` real em uma coluna `VARCHAR`.

#### Valores de Índice para Literais de Enumeração

Cada valor de enumeração tem um índice:

* Os elementos listados na especificação da coluna são atribuídos números de índice, começando com 1.

* O valor do índice do valor de erro de string vazia é 0. Isso significa que você pode usar a seguinte instrução `SELECT` para encontrar linhas nas quais valores inválidos do `ENUM` foram atribuídos:

  ```
  mysql> SELECT * FROM tbl_name WHERE enum_col=0;
  ```

* O índice do valor `NULL` é `NULL`.

* O termo “índice” aqui se refere a uma posição dentro da lista de valores de enumeração. Não tem nada a ver com índices de tabelas.

Por exemplo, uma coluna especificada como `ENUM('Mercury', 'Venus', 'Earth')` pode ter qualquer um dos valores mostrados aqui. O índice de cada valor também é mostrado.

<table summary="Possíveis valores para uma coluna especificada como ENUM('Mercury', 'Venus', 'Earth'). A tabela também mostra o índice de cada valor."><col style="width: 15%"/><col style="width: 15%"/><thead><tr> <th>Valor</th> <th>Índice</th> </tr></thead><tbody><tr> <td><code>NULL</code></td> <td><code>NULL</code></td> </tr><tr> <td><code>''</code></td> <td>0</td> </tr><tr> <td><code>'Mercury'</code></td> <td>1</td> </tr><tr> <td><code>'Venus'</code></td> <td>2</td> </tr><tr> <td><code>'Earth'</code></td> <td>3</td> </tr></tbody></table>

Uma coluna `ENUM` pode ter um máximo de 65.535 elementos distintos.

Se você recuperar um valor `ENUM` em um contexto numérico, o índice do valor da coluna é retornado. Por exemplo, você pode recuperar valores numéricos de uma coluna `ENUM` assim:

```
mysql> SELECT enum_col+0 FROM tbl_name;
```

Funções como `SUM()` ou `AVG()` que esperam um argumento numérico convertem o argumento para um número, se necessário. Para valores `ENUM`, o número de índice é usado no cálculo.

#### Tratamento de Literais de Enumeração

Espaços finais são automaticamente removidos dos valores dos membros `ENUM` na definição da tabela quando uma tabela é criada.

Quando recuperados, os valores armazenados em uma coluna `ENUM` são exibidos usando a letra maiúscula que foi usada na definição da coluna. Note que as colunas `ENUM` podem ser atribuídas a um conjunto de caracteres e uma ordenação. Para ordenações binárias ou sensíveis ao caso, a letra maiúscula é levada em consideração ao atribuir valores à coluna.

Se você armazenar um número em uma coluna `ENUM`, o número é tratado como o índice para os possíveis valores, e o valor armazenado é o membro da enumeração com esse índice. (No entanto, isso *não* funciona com `LOAD DATA`, que trata todo o input como strings.) Se o valor numérico for citado, ele ainda é interpretado como um índice se não houver uma string correspondente na lista de valores da enumeração. Por essas razões, não é aconselhável definir uma coluna `ENUM` com valores da enumeração que parecem ser números, porque isso pode facilmente se tornar confuso. Por exemplo, a seguinte coluna tem membros da enumeração com valores de string `'0'`, `'1'` e `'2'`, mas valores de índice numérico `1`, `2` e `3`:

```
numbers ENUM('0','1','2')
```

Se você armazenar `2`, ele é interpretado como um valor de índice e se torna `'1'` (o valor com índice 2). Se você armazenar `'2'`, ele corresponde a um valor da enumeração, então ele é armazenado como `'2'`. Se você armazenar `'3'`, ele não corresponde a nenhum valor da enumeração, então ele é tratado como um índice e se torna `'2'` (o valor com índice 3).

```
mysql> INSERT INTO t (numbers) VALUES(2),('2'),('3');
mysql> SELECT * FROM t;
+---------+
| numbers |
+---------+
| 1       |
| 2       |
| 2       |
+---------+
```

Para determinar todos os valores possíveis para uma coluna `ENUM`, use `SHOW COLUMNS FROM tbl_name LIKE 'enum_col'` e analise a definição `ENUM` na coluna `Type` do resultado.

Na API C, os valores `ENUM` são retornados como strings. Para obter informações sobre como usar metadados do conjunto de resultados para distingui-los de outras strings, consulte C API Basic Data Structures.

#### Valores de Enumeração Vazios ou NULL

Um valor de enumeração também pode ser a string vazia (`''`) ou `NULL` em determinadas circunstâncias:

* Se você inserir um valor inválido em uma `ENUM` (ou seja, uma string não presente na lista de valores permitidos), a string vazia é inserida em vez disso como um valor de erro especial. Essa string pode ser distinguida de uma "string vazia normal" pelo fato de essa string ter o valor numérico 0. Veja Valores de Índice para Literais de Enumeração para detalhes sobre os índices numéricos para os valores de enumeração.

* Se o modo SQL rigoroso estiver habilitado, as tentativas de inserir valores `ENUM` inválidos resultam em um erro.

* Se uma coluna `ENUM` for declarada para permitir `NULL`, o valor `NULL` é um valor válido para a coluna, e o valor padrão é `NULL`. Se uma coluna `ENUM` for declarada `NOT NULL`, seu valor padrão é o primeiro elemento da lista de valores permitidos.

#### Ordenação da Enumeração

Os valores `ENUM` são ordenados com base em seus números de índice, que dependem da ordem em que os membros da enumeração foram listados na especificação da coluna. Por exemplo, `'b'` é ordenado antes de `'a'` para `ENUM('b', 'a')`. A string vazia é ordenada antes de strings não vazias, e os valores `NULL` são ordenados antes de todos os outros valores de enumeração.

Para evitar resultados inesperados ao usar a cláusula `ORDER BY` em uma coluna `ENUM`, use uma dessas técnicas:

* Especifique a lista `ENUM` em ordem alfabética.

* Certifique-se de que a coluna seja ordenada lexicamente em vez de por número de índice, codificando `ORDER BY CAST(col AS CHAR)` ou `ORDER BY CONCAT(col)`.

#### Limitações da Enumeração

Um valor de enumeração não pode ser uma expressão, mesmo uma que avalie a um valor de string.

Por exemplo, esta declaração `CREATE TABLE` *não* funciona porque a função `CONCAT` não pode ser usada para construir um valor de enumeração:

```
CREATE TABLE sizes (
    size ENUM('small', CONCAT('med','ium'), 'large')
);
```

Você também não pode usar uma variável de usuário como um valor de enumeração. Este par de instruções *não* funciona:

```
SET @mysize = 'medium';

CREATE TABLE sizes (
    size ENUM('small', @mysize, 'large')
);
```

Recomendamos fortemente que você *não* use números como valores de enumeração, porque isso não economiza armazenamento em relação ao tipo apropriado `TINYINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") ou `SMALLINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") e é fácil confundir as strings e os valores numéricos subjacentes (que podem não ser os mesmos) se você citar os valores `ENUM` incorretamente. Se você usar um número como valor de enumeração, sempre coloque-o entre aspas. Se as aspas forem omitidas, o número é considerado um índice. Veja Como lidar com literais de enumeração para ver como até mesmo um número citado poderia ser usado erroneamente como um valor de índice numérico.

Valores duplicados na definição causam um aviso ou um erro se o modo SQL rigoroso estiver ativado.