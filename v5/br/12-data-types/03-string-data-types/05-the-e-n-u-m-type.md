### 11.3.5 O Tipo ENUM

Um `ENUM` é um objeto string com um valor escolhido a partir de uma lista de valores permitidos que são explicitamente enumerados na especificação da coluna no momento da criação da tabela.

Consulte a Seção 11.3.1, “Sintaxe de Tipo de Dados String” para a sintaxe e limites de comprimento do tipo `ENUM`.

O tipo `ENUM` possui as seguintes vantagens:

* Armazenamento de dados compacto em situações onde uma coluna tem um conjunto limitado de valores possíveis. As strings que você especifica como valores de entrada são automaticamente codificadas como números. Consulte a Seção 11.7, “Requisitos de Armazenamento de Tipo de Dados” para os requisitos de armazenamento para o tipo `ENUM`.

* Queries e saída legíveis. Os números são traduzidos de volta para as strings correspondentes nos resultados da Query.

e estas potenciais questões a considerar:

* Se você criar valores de enumeração que pareçam números, é fácil confundir os valores literais com seus números de Index internos, conforme explicado em Limitações de Enumeração.

* Usar colunas `ENUM` em cláusulas `ORDER BY` requer cuidado extra, conforme explicado em Ordenação de Enumeração.

* Criação e Uso de Colunas ENUM
* Valores de Index para Literais de Enumeração
* Manipulação de Literais de Enumeração
* Valores de Enumeração Vazios ou NULL
* Ordenação de Enumeração
* Limitações de Enumeração

#### Criação e Uso de Colunas ENUM

Um valor de enumeração deve ser um literal de string entre aspas. Por exemplo, você pode criar uma tabela com uma coluna `ENUM` assim:

```sql
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

Inserir 1 milhão de linhas nesta tabela com um valor de `'medium'` exigiria 1 milhão de bytes de armazenamento, em oposição a 6 milhões de bytes se você armazenasse a string real `'medium'` em uma coluna `VARCHAR`.

#### Valores de Index para Literais de Enumeração

Cada valor de enumeração tem um Index:

* Os elementos listados na especificação da coluna recebem números de Index, começando em 1.

* O valor de Index do valor de erro de string vazia é 0. Isso significa que você pode usar o seguinte comando `SELECT` para encontrar linhas nas quais valores `ENUM` inválidos foram atribuídos:

  ```sql
  mysql> SELECT * FROM tbl_name WHERE enum_col=0;
  ```

* O Index do valor `NULL` é `NULL`.

* O termo “Index” aqui se refere a uma posição dentro da lista de valores de enumeração. Não tem relação com os Indexes da tabela.

Por exemplo, uma coluna especificada como `ENUM('Mercury', 'Venus', 'Earth')` pode ter qualquer um dos valores mostrados aqui. O Index de cada valor também é mostrado.

<table summary="Valores possíveis para uma coluna especificada como ENUM('Mercury', 'Venus', 'Earth'). A tabela também mostra o Index de cada valor."><col style="width: 15%"/><col style="width: 15%"/><thead><tr> <th>Valor</th> <th>Index</th> </tr></thead><tbody><tr> <td><code>NULL</code></td> <td><code>NULL</code></td> </tr><tr> <td><code>''</code></td> <td>0</td> </tr><tr> <td><code>'Mercury'</code></td> <td>1</td> </tr><tr> <td><code>'Venus'</code></td> <td>2</td> </tr><tr> <td><code>'Earth'</code></td> <td>3</td> </tr></tbody></table>

Uma coluna `ENUM` pode ter um máximo de 65.535 elementos distintos. (O limite prático é inferior a 3000.) Uma tabela pode ter no máximo 255 definições de listas de elementos exclusivos entre suas colunas `ENUM` e `SET` consideradas como um grupo. Para mais informações sobre esses limites, consulte Limites Impostos pela Estrutura do Arquivo .frm.

Se você recuperar um valor `ENUM` em um contexto numérico, o Index do valor da coluna será retornado. Por exemplo, você pode recuperar valores numéricos de uma coluna `ENUM` assim:

```sql
mysql> SELECT enum_col+0 FROM tbl_name;
```

Funções como `SUM()` ou `AVG()` que esperam um argumento numérico convertem o argumento para um número, se necessário. Para valores `ENUM`, o número do Index é usado no cálculo.

#### Manipulação de Literais de Enumeração

Espaços finais (trailing spaces) são automaticamente excluídos dos valores de membros `ENUM` na definição da tabela quando uma tabela é criada.

Quando recuperados, os valores armazenados em uma coluna `ENUM` são exibidos usando o casing (uso de maiúsculas/minúsculas) que foi utilizado na definição da coluna. Observe que colunas `ENUM` podem receber um `character set` e uma `collation`. Para `collations` binárias ou `case-sensitive`, o casing é levado em consideração ao atribuir valores à coluna.

Se você armazenar um número em uma coluna `ENUM`, o número é tratado como o Index dos valores possíveis, e o valor armazenado é o membro da enumeração com aquele Index. (No entanto, isso *não* funciona com `LOAD DATA`, que trata todas as entradas como strings.) Se o valor numérico estiver entre aspas, ele ainda será interpretado como um Index se não houver uma string correspondente na lista de valores de enumeração. Por essas razões, não é aconselhável definir uma coluna `ENUM` com valores de enumeração que pareçam números, pois isso pode facilmente causar confusão. Por exemplo, a coluna a seguir tem membros de enumeração com valores string de `'0'`, `'1'` e `'2'`, mas valores de Index numéricos de `1`, `2` e `3`:

```sql
numbers ENUM('0','1','2')
```

Se você armazenar `2`, ele é interpretado como um valor de Index e se torna `'1'` (o valor com Index 2). Se você armazenar `'2'`, ele corresponde a um valor de enumeração, então é armazenado como `'2'`. Se você armazenar `'3'`, ele não corresponde a nenhum valor de enumeração, então é tratado como um Index e se torna `'2'` (o valor com Index 3).

```sql
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

Para determinar todos os valores possíveis para uma coluna `ENUM`, use `SHOW COLUMNS FROM tbl_name LIKE 'enum_col'` e faça o parse (análise) da definição `ENUM` na coluna `Type` da saída.

Na C API, os valores `ENUM` são retornados como strings. Para informações sobre como usar metadados do result set para distingui-los de outras strings, consulte Estruturas de Dados Básicas da C API.

#### Valores de Enumeração Vazios ou NULL

Um valor de enumeração também pode ser a string vazia (`''`) ou `NULL` sob certas circunstâncias:

* Se você inserir um valor inválido em um `ENUM` (ou seja, uma string não presente na lista de valores permitidos), a string vazia é inserida como um valor de erro especial. Esta string pode ser distinguida de uma string vazia “normal” pelo fato de que ela tem o valor numérico 0. Consulte Valores de Index para Literais de Enumeração para detalhes sobre os Indexes numéricos para os valores de enumeração.

  Se o `strict SQL mode` estiver habilitado, as tentativas de inserir valores `ENUM` inválidos resultam em um erro.

* Se uma coluna `ENUM` for declarada para permitir `NULL`, o valor `NULL` é um valor válido para a coluna, e o valor padrão é `NULL`. Se uma coluna `ENUM` for declarada `NOT NULL`, seu valor padrão é o primeiro elemento da lista de valores permitidos.

#### Ordenação de Enumeração

Os valores `ENUM` são ordenados com base em seus números de Index, que dependem da ordem em que os membros da enumeração foram listados na especificação da coluna. Por exemplo, `'b'` é ordenado antes de `'a'` para `ENUM('b', 'a')`. A string vazia é ordenada antes das strings não vazias, e os valores `NULL` são ordenados antes de todos os outros valores de enumeração.

Para evitar resultados inesperados ao usar a cláusula `ORDER BY` em uma coluna `ENUM`, utilize uma destas técnicas:

* Especifique a lista `ENUM` em ordem alfabética.

* Certifique-se de que a coluna seja ordenada lexicalmente em vez de por número de Index, codificando `ORDER BY CAST(col AS CHAR)` ou `ORDER BY CONCAT(col)`.

#### Limitações de Enumeração

Um valor de enumeração não pode ser uma expressão, mesmo uma que avalie para um valor string.

Por exemplo, este comando `CREATE TABLE` *não* funciona porque a função `CONCAT` não pode ser usada para construir um valor de enumeração:

```sql
CREATE TABLE sizes (
    size ENUM('small', CONCAT('med','ium'), 'large')
);
```

Você também não pode empregar uma variável de usuário como valor de enumeração. Este par de comandos *não* funciona:

```sql
SET @mysize = 'medium';

CREATE TABLE sizes (
    size ENUM('small', @mysize, 'large')
);
```

Recomendamos fortemente que você *não* use números como valores de enumeração, porque isso não economiza armazenamento em comparação com o tipo apropriado `TINYINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") ou `SMALLINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), e é fácil confundir as strings e os valores numéricos subjacentes (que podem não ser os mesmos) se você citar os valores `ENUM` incorretamente. Se você usar um número como valor de enumeração, sempre o coloque entre aspas. Se as aspas forem omitidas, o número será considerado um Index. Consulte Manipulação de Literais de Enumeração para ver como mesmo um número entre aspas pode ser usado erroneamente como um valor de Index numérico.

Valores duplicados na definição causam um `warning` (aviso), ou um `error` (erro) se o `strict SQL mode` estiver habilitado.