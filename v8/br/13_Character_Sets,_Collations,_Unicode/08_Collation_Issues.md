## 12.8 Problemas de colagem

As seções a seguir discutem vários aspectos das colatações de conjuntos de caracteres.

### 12.8.1 Usando COLLATE em declarações SQL

Com a cláusula `COLLATE`, você pode substituir qualquer collation padrão para uma comparação. `COLLATE` pode ser usado em várias partes das declarações SQL. Aqui estão alguns exemplos:

* Com `ORDER BY`:

  ```
  SELECT k
  FROM t1
  ORDER BY k COLLATE latin1_german2_ci;
  ```

* Com `AS`:

  ```
  SELECT k COLLATE latin1_german2_ci AS k1
  FROM t1
  ORDER BY k1;
  ```

* Com `GROUP BY`:

  ```
  SELECT k
  FROM t1
  GROUP BY k COLLATE latin1_german2_ci;
  ```

* Com funções agregadas:

  ```
  SELECT MAX(k COLLATE latin1_german2_ci)
  FROM t1;
  ```

* Com `DISTINCT`:

  ```
  SELECT DISTINCT k COLLATE latin1_german2_ci
  FROM t1;
  ```

* Com `WHERE`:

  ```
  SELECT *
  FROM t1
  WHERE _latin1 'Müller' COLLATE latin1_german2_ci = k;
  ```

  ```
  SELECT *
  FROM t1
  WHERE k LIKE _latin1 'Müller' COLLATE latin1_german2_ci;
  ```

* Com `HAVING`:

  ```
  SELECT k
  FROM t1
  GROUP BY k
  HAVING k = _latin1 'Müller' COLLATE latin1_german2_ci;
  ```

### 12.8.2 Prioridade da cláusula COLLATE

A cláusula `COLLATE` tem alta precedência (maior que `||`), portanto, as seguintes duas expressões são equivalentes:

```
x || y COLLATE z
x || (y COLLATE z)
```

### 12.8.3 Conjunto de caracteres e compatibilidade de codificação de caracteres

Cada conjunto de caracteres tem uma ou mais colatações, mas cada colatação está associada a um e apenas um conjunto de caracteres. Portanto, a seguinte declaração causa uma mensagem de erro porque a colatação `latin2_bin` não é legal com o conjunto de caracteres `latin1`:

```
mysql> SELECT _latin1 'x' COLLATE latin2_bin;
ERROR 1253 (42000): COLLATION 'latin2_bin' is not valid
for CHARACTER SET 'latin1'
```

### 12.8.4 Coercitividade da Collatória em Expressões

Na grande maioria das declarações, é óbvio qual a collation que o MySQL usa para resolver uma operação de comparação. Por exemplo, nos seguintes casos, deve ser claro que a collation é a collation da coluna `x`:

```
SELECT x FROM T ORDER BY x;
SELECT x FROM T WHERE x = x;
SELECT DISTINCT x FROM T;
```

No entanto, com múltiplos operandos, pode haver ambiguidade. Por exemplo, esta declaração realiza uma comparação entre a coluna `x` e a literal de string `'Y'`:

```
SELECT x FROM T WHERE x = 'Y';
```

Se `x` e `'Y'` tiverem a mesma ordem de classificação, não haverá ambiguidade sobre a ordem de classificação a ser usada para a comparação. Mas se tiverem ordens de classificação diferentes, a comparação deve usar a ordem de classificação de `x`, ou de `'Y'`? Ambos `x` e `'Y'` têm ordens de classificação, então qual ordem de classificação tem precedência?

Uma mistura de colatões também pode ocorrer em contextos que não são comparações. Por exemplo, uma operação de concatenação de múltiplos argumentos, como `CONCAT(x,'Y')`, combina seus argumentos para produzir uma única string. Qual colatão o resultado deve ter?

Para resolver questões como essas, o MySQL verifica se a collation de um item pode ser coercida com a collation do outro. O MySQL atribui valores de coercibilidade da seguinte forma:

* Uma cláusula explícita `COLLATE` tem uma coercibilidade de 0 (não coercivel de forma alguma).

* A concatenação de duas cadeias de caracteres com diferentes codificações tem uma coercibilidade de 1.

* A agregação de uma coluna ou de um parâmetro de rotina armazenada ou de uma variável local tem uma coercibilidade de 2.

* Uma "constante do sistema" (a string retornada por funções como `USER()` ou `VERSION()`) tem uma coercibilidade de 3.

* A colagem de um literal tem uma coercibilidade de 4. * A colagem de um valor numérico ou temporal tem uma coercibilidade de 5.

* `NULL` ou uma expressão que é derivada de `NULL` tem uma coercibilidade de 6.

O MySQL utiliza valores de coercibilidade com as seguintes regras para resolver ambiguidades:

* Use a combinação com o menor valor de coercibilidade.
* Se ambos os lados tiverem a mesma coercibilidade, então:

+ Se ambos os lados forem Unicode, ou se ambos os lados não forem Unicode, é um erro.

+ Se um dos lados tiver um conjunto de caracteres Unicode e o outro tiver um conjunto de caracteres que não é Unicode, o lado com o conjunto de caracteres Unicode vence, e a conversão automática de conjunto de caracteres é aplicada ao lado que não é Unicode. Por exemplo, a seguinte declaração não retorna um erro:

    ```
    SELECT CONCAT(utf8mb4_column, latin1_column) FROM t1;
    ```

Ele retorna um resultado que tem um conjunto de caracteres de `utf8mb4` e a mesma correção que `utf8mb4_column`. Os valores de `latin1_column` são automaticamente convertidos para `utf8mb4` antes da concatenação.

+ Para uma operação com operandos do mesmo conjunto de caracteres, mas que misturam uma `_bin` collation e uma `_ci` ou `_cs` collation, a collation `_bin` é usada. Isso é semelhante à forma como operações que misturam strings não binárias e binárias avaliam os operandos como strings binárias, aplicada a collation em vez de tipos de dados.

Embora a conversão automática não esteja no padrão SQL, o padrão diz que cada conjunto de caracteres é (em termos de caracteres suportados) um “subconjunto” do Unicode. Como é um princípio bem conhecido que “o que se aplica a um superconjunto pode se aplicar a um subconjunto”, acreditamos que uma codificação para Unicode pode ser aplicada para comparações com strings não Unicode. Mais genericamente, o MySQL usa o conceito de repertório de conjuntos de caracteres, que às vezes pode ser usado para determinar relações de subconjunto entre conjuntos de caracteres e permitir a conversão de operandos em operações que, de outra forma, produziriam um erro. Veja a Seção 12.2.1, “Repertório de Conjuntos de Caracteres”.

A tabela a seguir ilustra algumas aplicações das regras anteriores.

<table summary="Comparisons and the collation used for each comparison."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Comparação</th> <th>Collinação usada</th> </tr></thead><tbody><tr> <td><code>column1 = 'A'</code></td> <td>Utilize a colagem de<code>column1</code></td> </tr><tr> <td><code>column1 = 'A' COLLATE x</code></td> <td>Utilize a colagem de<code>'A' COLLATE x</code></td> </tr><tr> <td><code>column1 COLLATE x = 'A' COLLATE y</code></td> <td>Erro</td> </tr></tbody></table>

Para determinar a coercibilidade de uma expressão de cadeia, use a função `COERCIBILITY()` (consulte a Seção 14.15, “Funções de Informação”):

```
mysql> SELECT COERCIBILITY(_utf8mb4'A' COLLATE utf8mb4_bin);
        -> 0
mysql> SELECT COERCIBILITY(VERSION());
        -> 3
mysql> SELECT COERCIBILITY('A');
        -> 4
mysql> SELECT COERCIBILITY(1000);
        -> 5
mysql> SELECT COERCIBILITY(NULL);
        -> 6
```

Para a conversão implícita de um valor numérico ou temporal em uma string, como ocorre com o argumento `1` na expressão `CONCAT(1, 'abc')`, o resultado é uma string (não binária) que tem um conjunto de caracteres e uma ordenação determinados pelos `character_set_connection` e `collation_connection` variáveis do sistema. Veja a Seção 14.3, “Conversão de Tipo na Avaliação da Expressão”.

### 12.8.5 Codificação binária em comparação com codificações _bin

Esta seção descreve como a ordenação `binary` para strings binárias se compara às ordenações `_bin` para strings não binárias.

As cadeias binárias (conforme armazenadas usando os tipos de dados `BINARY`, `VARBINARY` e `BLOB`) têm um conjunto de caracteres e uma ordenação nomeados `binary`. As cadeias binárias são sequências de bytes e os valores numéricos desses bytes determinam a ordem de comparação e ordenação. Veja a Seção 12.10.8, “O Conjunto de Caracteres Binário”.

As cadeias não binárias (conforme armazenadas usando os tipos de dados `CHAR`, `VARCHAR` e `TEXT`) têm um conjunto de caracteres e uma ordenação diferentes de `binary`. Um conjunto de caracteres não binário pode ter várias ordenações, cada uma das quais define uma comparação e um determinado ordem de classificação para os caracteres do conjunto. Para a maioria dos conjuntos de caracteres, uma dessas ordenações é a binária, indicada por um sufixo `_bin` no nome da ordenação. Por exemplo, as ordenações binárias para `latin1` e `big5` são nomeadas `latin1_bin` e `big5_bin`, respectivamente. `utf8mb4` é uma exceção que tem duas ordenações binárias, `utf8mb4_bin` e `utf8mb4_0900_bin`; veja Seção 12.10.1, “Sistemas de caracteres Unicode”.

A ordenação `binary` difere das ordenações `_bin` em vários aspectos, discutidos nas seções a seguir:

* Unidade de Comparação e Ordenação * Conversão de Conjunto de Caracteres * Conversão de Letra * Tratamento de Espaço Final em Comparativos * Tratamento de Espaço Final para Inserções e Recuperações

#### A Unidade de Comparação e Ordenação

As cadeias binárias são sequências de bytes. Para a codificação `binary`, a comparação e ordenação são baseadas em valores numéricos de bytes. As cadeias não binárias são sequências de caracteres, que podem ser multibytes. As codificações para cadeias não binárias definem uma ordem dos valores de caracteres para comparação e ordenação. Para as codificações `_bin`, essa ordem é baseada em valores de código de caracteres numéricos, o que é semelhante à ordem para cadeias binárias, exceto que os valores de código de caracteres podem ser multibytes.

#### Conversão de Conjunto de Caracteres

Uma cadeia não binária tem um conjunto de caracteres e é automaticamente convertida para outro conjunto de caracteres em muitos casos, mesmo quando a cadeia tem uma `_bin` collation:

* Ao atribuir valores de coluna a outra coluna que tem um conjunto de caracteres diferente:

  ```
  UPDATE t1 SET utf8mb4_bin_column=latin1_column;
  INSERT INTO t1 (latin1_column) SELECT utf8mb4_bin_column FROM t2;
  ```

* Ao atribuir valores de coluna para `INSERT` ou `UPDATE` usando uma literal de string:

  ```
  SET NAMES latin1;
  INSERT INTO t1 (utf8mb4_bin_column) VALUES ('string-in-latin1');
  ```

* Ao enviar resultados do servidor para um cliente:

  ```
  SET NAMES latin1;
  SELECT utf8mb4_bin_column FROM t2;
  ```

Para colunas de string binária, não ocorre nenhuma conversão. Para casos semelhantes aos anteriores, o valor da string é copiado byte a byte.

#### Conversão de Letracase

As colatões para conjuntos de caracteres não binários fornecem informações sobre a grafia dos caracteres, de modo que os caracteres em uma cadeia não binária podem ser convertidos de uma grafia para outra, mesmo para colatões `_bin` que ignoram a grafia para a ordenação:

```
mysql> SET NAMES utf8mb4 COLLATE utf8mb4_bin;
mysql> SELECT LOWER('aA'), UPPER('zZ');
+-------------+-------------+
| LOWER('aA') | UPPER('zZ') |
+-------------+-------------+
| aa          | ZZ          |
+-------------+-------------+
```

O conceito de maiúsculas e minúsculas não se aplica a bytes em uma string binária. Para realizar a conversão de maiúsculas e minúsculas, a string deve ser convertida primeiro em uma string não binária usando um conjunto de caracteres apropriado para os dados armazenados na string:

```
mysql> SET NAMES binary;
mysql> SELECT LOWER('aA'), LOWER(CONVERT('aA' USING utf8mb4));
+-------------+------------------------------------+
| LOWER('aA') | LOWER(CONVERT('aA' USING utf8mb4)) |
+-------------+------------------------------------+
| aA          | aa                                 |
+-------------+------------------------------------+
```

#### Tratamento de Espaço de Retração em Comparativos

As colatelias do MySQL possuem um atributo pad, que tem o valor `PAD SPACE` ou `NO PAD`:

* A maioria das colatões do MySQL tem um atributo pad `PAD SPACE`.

* As codificações Unicode baseadas na UCA 9.0.0 e superior possuem um atributo de `NO PAD`; veja a Seção 12.10.1, “Conjunto de Caracteres Unicode”.

Para cadeias não binárias (os valores `CHAR`, `VARCHAR` e `TEXT`), o atributo de pad de ordenação de cadeia determina o tratamento em comparações de espaços finais nas extremidades das cadeias:

* Para as `PAD SPACE` colações, os espaços finais são insignificantes em comparações; as cadeias são comparadas sem considerar os espaços finais.

* As `NO PAD` tratam as extremidades de espaço como significativas em comparações, como qualquer outro caractere.

Os comportamentos diferentes podem ser demonstrados usando as duas colatações binárias `utf8mb4`, uma das quais é `PAD SPACE`, e a outra é `NO PAD`. O exemplo também mostra como usar a tabela `INFORMATION_SCHEMA` `COLLATIONS` para determinar o atributo de bloco para colatações.

```
mysql> SELECT COLLATION_NAME, PAD_ATTRIBUTE
       FROM INFORMATION_SCHEMA.COLLATIONS
       WHERE COLLATION_NAME LIKE 'utf8mb4%bin';
+------------------+---------------+
| COLLATION_NAME   | PAD_ATTRIBUTE |
+------------------+---------------+
| utf8mb4_bin      | PAD SPACE     |
| utf8mb4_0900_bin | NO PAD        |
+------------------+---------------+
mysql> SET NAMES utf8mb4 COLLATE utf8mb4_bin;
mysql> SELECT 'a ' = 'a';
+------------+
| 'a ' = 'a' |
+------------+
|          1 |
+------------+
mysql> SET NAMES utf8mb4 COLLATE utf8mb4_0900_bin;
mysql> SELECT 'a ' = 'a';
+------------+
| 'a ' = 'a' |
+------------+
|          0 |
+------------+
```

Nota

“Comparação” neste contexto não inclui o operador de correspondência de padrões `LIKE`, para o qual espaços finais são significativos, independentemente da ordenação.

Para as strings binárias (os valores `BINARY`, `VARBINARY` e `BLOB`), todos os bytes são significativos em comparações, incluindo espaços finais:

```
mysql> SET NAMES binary;
mysql> SELECT 'a ' = 'a';
+------------+
| 'a ' = 'a' |
+------------+
|          0 |
+------------+
```

#### Gerenciamento de Espaço de Seguimento para Inserções e Recuperações

As colunas `CHAR(N)` armazenam cadeias de caracteres não binárias de comprimento *`N`*. Para inserções, os valores mais curtos que *`N`* caracteres são estendidos com espaços. Para recuperações, os espaços finais são removidos.

As colunas `BINARY(N)` armazenam cadeias binárias de *`N`* bytes. Para inserções, os valores mais curtos que *`N`* bytes são estendidos com `0x00` bytes. Para recuperações, nada é removido; um valor do comprimento declarado é sempre retornado.

```
mysql> CREATE TABLE t1 (
         a CHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
         b BINARY(10)
       );
mysql> INSERT INTO t1 VALUES ('x','x');
mysql> INSERT INTO t1 VALUES ('x ','x ');
mysql> SELECT a, b, HEX(a), HEX(b) FROM t1;
+------+------------------------+--------+----------------------+
| a    | b                      | HEX(a) | HEX(b)               |
+------+------------------------+--------+----------------------+
| x    | 0x78000000000000000000 | 78     | 78000000000000000000 |
| x    | 0x78200000000000000000 | 78     | 78200000000000000000 |
+------+------------------------+--------+----------------------+
```

### 12.8.6 Exemplos do efeito da colagem

**Exemplo 1: Ordenação de umlaut alemão**

Suponha que a coluna `X` na tabela `T` tenha esses valores na coluna `latin1`:

```
Muffler
Müller
MX Systems
MySQL
```

Suponha também que os valores da coluna sejam recuperados usando a seguinte declaração:

```
SELECT X FROM T ORDER BY X COLLATE collation_name;
```

A tabela a seguir mostra a ordem resultante dos valores se usarmos `ORDER BY` com diferentes colatões.

<table summary="An example of the effect of collation, as described in the preceding text. The table shows the resulting order of values for three collations (latin1_swedish_ci, latin1_german1_ci, latin1_german2_ci) when using ORDER BY."><col style="width: 30%"/><col style="width: 30%"/><col style="width: 30%"/><thead><tr> <th scope="col"><code>latin1_swedish_ci</code></th> <th scope="col"><code>latin1_german1_ci</code></th> <th scope="col"><code>latin1_german2_ci</code></th> </tr></thead><tbody><tr> <th scope="row">Muffler</th> <td>Muffler</td> <td>Müller</td> </tr><tr> <th scope="row">MX Systems</th> <td>Müller</td> <td>Muffler</td> </tr><tr> <th scope="row">Müller</th> <td>MX Systems</td> <td>MX Systems</td> </tr><tr> <th scope="row">MySQL</th> <td>MySQL</td> <td>MySQL</td> </tr></tbody></table>

O caractere que causa os diferentes tipos de ordem neste exemplo é `ü` (alemão “U-umlaut”).

* A primeira coluna mostra o resultado do `SELECT` usando a regra de correspondência sueco/finlandês, que diz que o U-umlaut é ordenado com Y.

* A segunda coluna mostra o resultado do `SELECT` usando a regra da DIN-1 alemã, que diz que o U-umlaut se classifica com U.

* A terceira coluna mostra o resultado do `SELECT` usando a regra da DIN-2 alemã, que diz que o U-umlaut se classifica com UE.

**Exemplo 2: Procurando por um til alemão**

Suponha que você tenha três tabelas que diferem apenas pelo conjunto de caracteres e pela collation utilizados:

```
mysql> SET NAMES utf8mb4;
mysql> CREATE TABLE german1 (
         c CHAR(10)
       ) CHARACTER SET latin1 COLLATE latin1_german1_ci;
mysql> CREATE TABLE german2 (
         c CHAR(10)
       ) CHARACTER SET latin1 COLLATE latin1_german2_ci;
mysql> CREATE TABLE germanutf8 (
         c CHAR(10)
       ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Cada tabela contém dois registros:

```
mysql> INSERT INTO german1 VALUES ('Bar'), ('Bär');
mysql> INSERT INTO german2 VALUES ('Bar'), ('Bär');
mysql> INSERT INTO germanutf8 VALUES ('Bar'), ('Bär');
```

Dois dos colégios mencionados acima têm uma igualdade `A = Ä`, e um deles não tem tal igualdade ([[`latin1_german2_ci`]). Por essa razão, as comparações produzem os resultados mostrados aqui:

```
mysql> SELECT * FROM german1 WHERE c = 'Bär';
+------+
| c    |
+------+
| Bar  |
| Bär  |
+------+
mysql> SELECT * FROM german2 WHERE c = 'Bär';
+------+
| c    |
+------+
| Bär  |
+------+
mysql> SELECT * FROM germanutf8 WHERE c = 'Bär';
+------+
| c    |
+------+
| Bar  |
| Bär  |
+------+
```

Isto não é um erro, mas sim uma consequência das propriedades de classificação de `latin1_german1_ci` e `utf8mb4_unicode_ci` (a classificação mostrada é feita de acordo com o padrão alemão DIN 5007).

### 12.8.7 Uso da Colaboração em Pesquisas do SCHEMA_INFORMÁCIA

As colunas de texto em tabelas de `INFORMATION_SCHEMA` têm uma correção de `utf8mb3_general_ci`, que é insensível ao caso. No entanto, para valores que correspondem a objetos que são representados no sistema de arquivos, como bancos de dados e tabelas, as pesquisas em colunas de texto de `INFORMATION_SCHEMA` podem ser sensíveis ao caso ou insensíveis ao caso, dependendo das características do sistema de arquivos subjacente e da configuração da variável de sistema `lower_case_table_names`. Por exemplo, as pesquisas podem ser sensíveis ao caso se o sistema de arquivos for sensível ao caso. Esta seção descreve esse comportamento e como modificá-lo, se necessário.

Suponha que uma consulta procure a coluna `SCHEMATA.SCHEMA_NAME` no banco de dados `test`. Nos sistemas de arquivos do Linux, as comparações de `SCHEMATA.SCHEMA_NAME` com `'test'` são coincidentes, mas as comparações com `'TEST'` não são:

```
mysql> SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA
       WHERE SCHEMA_NAME = 'test';
+-------------+
| SCHEMA_NAME |
+-------------+
| test        |
+-------------+

mysql> SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA
       WHERE SCHEMA_NAME = 'TEST';
Empty set (0.00 sec)
```

Esses resultados ocorrem quando a variável de sistema `lower_case_table_names` é definida como 0. Uma configuração de `lower_case_table_names` de 1 ou 2 faz com que a segunda consulta retorne o mesmo (não vazio) resultado que a primeira consulta.

Nota

É proibido iniciar o servidor com uma configuração `lower_case_table_names` que seja diferente da configuração usada quando o servidor foi inicializado.

Em Windows ou macOS, os sistemas de arquivos não são sensíveis ao caso, então as comparações correspondem tanto a `'test'` quanto a `'TEST'`:

```
mysql> SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA
       WHERE SCHEMA_NAME = 'test';
+-------------+
| SCHEMA_NAME |
+-------------+
| test        |
+-------------+

mysql> SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA
       WHERE SCHEMA_NAME = 'TEST';
+-------------+
| SCHEMA_NAME |
+-------------+
| TEST        |
+-------------+
```

O valor de `lower_case_table_names` não faz diferença neste contexto.

O comportamento anterior ocorre porque a collation `utf8mb3_general_ci` não é usada para consultas `INFORMATION_SCHEMA` ao procurar valores que correspondem a objetos representados no sistema de arquivos.

Se o resultado de uma operação de cadeia em uma coluna `INFORMATION_SCHEMA` diferir das expectativas, uma solução é usar uma cláusula explícita `COLLATE` para forçar uma ordenação adequada (consulte Seção 12.8.1, “Usando COLLATE em Declarações SQL”). Por exemplo, para realizar uma pesquisa não sensível ao caso, use `COLLATE` com o nome da coluna `INFORMATION_SCHEMA`:

```
mysql> SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA
       WHERE SCHEMA_NAME COLLATE utf8mb3_general_ci = 'test';
+-------------+
| SCHEMA_NAME |
+-------------+
| test        |
+-------------+

mysql> SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA
       WHERE SCHEMA_NAME COLLATE utf8mb3_general_ci = 'TEST';
+-------------+
| SCHEMA_NAME |
+-------------+
| test        |
+-------------+
```

Você também pode usar as funções `UPPER()` ou `LOWER()`:

```
WHERE UPPER(SCHEMA_NAME) = 'TEST'
WHERE LOWER(SCHEMA_NAME) = 'test'
```

Embora uma comparação não sensível ao caso possa ser realizada mesmo em plataformas com sistemas de arquivos sensíveis ao caso, como mostrado acima, não é necessariamente sempre a coisa certa a fazer. Nessas plataformas, é possível ter vários objetos com nomes que diferem apenas na maiúscula. Por exemplo, as tabelas com os nomes `city`, `CITY` e `City` podem existir simultaneamente. Considere se uma busca deve corresponder a todos esses nomes ou apenas a um deles e escreva consultas de acordo. A primeira das seguintes comparações (com `utf8mb3_bin`) é sensível ao caso; as outras não são:

```
WHERE TABLE_NAME COLLATE utf8mb3_bin = 'City'
WHERE TABLE_NAME COLLATE utf8mb3_general_ci = 'city'
WHERE UPPER(TABLE_NAME) = 'CITY'
WHERE LOWER(TABLE_NAME) = 'city'
```

As pesquisas nas colunas de string `INFORMATION_SCHEMA` que referem-se ao próprio `INFORMATION_SCHEMA` não utilizam a collation `utf8mb3_general_ci`, pois `INFORMATION_SCHEMA` é um banco de dados “virtual” que não está representado no sistema de arquivos. Por exemplo, as comparações com `SCHEMATA.SCHEMA_NAME` correspondem a `'information_schema'` ou `'INFORMATION_SCHEMA'`, independentemente da plataforma:

```
mysql> SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA
       WHERE SCHEMA_NAME = 'information_schema';
+--------------------+
| SCHEMA_NAME        |
+--------------------+
| information_schema |
+--------------------+

mysql> SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA
       WHERE SCHEMA_NAME = 'INFORMATION_SCHEMA';
+--------------------+
| SCHEMA_NAME        |
+--------------------+
| information_schema |
+--------------------+
```
