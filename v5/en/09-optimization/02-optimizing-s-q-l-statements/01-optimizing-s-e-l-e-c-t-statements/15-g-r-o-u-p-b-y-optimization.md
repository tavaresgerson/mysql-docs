#### 8.2.1.15 Otimização de GROUP BY

A maneira mais geral de satisfazer uma cláusula `GROUP BY` é varrer a tabela inteira e criar uma nova temporary table onde todas as linhas de cada grupo são consecutivas, e então usar esta temporary table para descobrir grupos e aplicar aggregate functions (se houver). Em alguns casos, o MySQL consegue ser muito mais eficiente e evitar a criação de temporary tables usando index access.

As pré-condições mais importantes para usar Indexes em `GROUP BY` são que todas as colunas `GROUP BY` referenciem atributos do mesmo Index, e que o Index armazene suas Keys em ordem (o que é verdadeiro, por exemplo, para um Index `BTREE`, mas não para um Index `HASH`). Se o uso de temporary tables pode ser substituído por index access também depende de quais partes de um Index são usadas na Query, das condições especificadas para essas partes e das aggregate functions selecionadas.

Existem duas maneiras de executar uma Query `GROUP BY` através de index access, conforme detalhado nas seções seguintes. O primeiro método aplica a operação de agrupamento juntamente com todos os range predicates (se houver). O segundo método primeiro executa um range scan e, em seguida, agrupa as tuplas resultantes.

No MySQL, `GROUP BY` é usado para sorting (ordenação), então o servidor também pode aplicar otimizações de `ORDER BY` ao agrupamento. No entanto, depender da ordenação implícita ou explícita de `GROUP BY` está obsoleto (deprecated). Consulte a Seção 8.2.1.14, “ORDER BY Optimization”.

* Loose Index Scan
* Tight Index Scan

##### Loose Index Scan

A maneira mais eficiente de processar `GROUP BY` é quando um Index é usado para recuperar diretamente as colunas de agrupamento. Com este método de acesso, o MySQL usa a propriedade de alguns tipos de Index de que as Keys são ordenadas (por exemplo, `BTREE`). Esta propriedade permite o uso de grupos de Lookup em um Index sem ter que considerar todas as Keys no Index que satisfazem todas as condições `WHERE`. Este método de acesso considera apenas uma fração das Keys em um Index, por isso é chamado de Loose Index Scan. Quando não há uma cláusula `WHERE`, um Loose Index Scan lê tantas Keys quanto o número de grupos, o que pode ser um número muito menor do que o total de Keys. Se a cláusula `WHERE` contiver range predicates (consulte a discussão sobre o tipo de JOIN `range` na Seção 8.8.1, “Optimizing Queries with EXPLAIN”), um Loose Index Scan procura a primeira Key de cada grupo que satisfaz as range conditions e, novamente, lê o menor número possível de Keys. Isto é possível sob as seguintes condições:

* A Query é sobre uma única tabela.
* O `GROUP BY` nomeia apenas colunas que formam um leftmost prefix do Index e nenhuma outra coluna. (Se, em vez de `GROUP BY`, a Query tiver uma cláusula `DISTINCT`, todos os atributos distinct referem-se a colunas que formam um leftmost prefix do Index.) Por exemplo, se uma tabela `t1` tiver um Index em `(c1,c2,c3)`, o Loose Index Scan é aplicável se a Query tiver `GROUP BY c1, c2`. Não é aplicável se a Query tiver `GROUP BY c2, c3` (as colunas não são um leftmost prefix) ou `GROUP BY c1, c2, c4` (`c4` não está no Index).

* As únicas aggregate functions usadas na lista de seleção (se houver) são `MIN()` e `MAX()`, e todas elas se referem à mesma coluna. A coluna deve estar no Index e deve seguir imediatamente as colunas no `GROUP BY`.

* Quaisquer outras partes do Index além das do `GROUP BY` referenciadas na Query devem ser constantes (ou seja, devem ser referenciadas em igualdades com constantes), exceto pelo argumento das funções `MIN()` ou `MAX()`.

* Para colunas no Index, os valores completos da coluna devem ser indexados, não apenas um prefixo. Por exemplo, com `c1 VARCHAR(20), INDEX (c1(10))`, o Index usa apenas um prefixo dos valores de `c1` e não pode ser usado para Loose Index Scan.

Se o Loose Index Scan for aplicável a uma Query, a saída do `EXPLAIN` mostra `Using index for group-by` na coluna `Extra`.

Suponha que exista um Index `idx(c1,c2,c3)` na tabela `t1(c1,c2,c3,c4)`. O método de acesso Loose Index Scan pode ser usado para as seguintes Queries:

```sql
SELECT c1, c2 FROM t1 GROUP BY c1, c2;
SELECT DISTINCT c1, c2 FROM t1;
SELECT c1, MIN(c2) FROM t1 GROUP BY c1;
SELECT c1, c2 FROM t1 WHERE c1 < const GROUP BY c1, c2;
SELECT MAX(c3), MIN(c3), c1, c2 FROM t1 WHERE c2 > const GROUP BY c1, c2;
SELECT c2 FROM t1 WHERE c1 < const GROUP BY c1, c2;
SELECT c1, c2 FROM t1 WHERE c3 = const GROUP BY c1, c2;
```

As seguintes Queries não podem ser executadas com este método de seleção rápida, pelas razões apresentadas:

* Existem aggregate functions diferentes de `MIN()` ou `MAX()`:

  ```sql
  SELECT c1, SUM(c2) FROM t1 GROUP BY c1;
  ```

* As colunas na cláusula `GROUP BY` não formam um leftmost prefix do Index:

  ```sql
  SELECT c1, c2 FROM t1 GROUP BY c2, c3;
  ```

* A Query se refere a uma parte de uma Key que vem depois da parte `GROUP BY`, e para a qual não há igualdade com uma constante:

  ```sql
  SELECT c1, c3 FROM t1 GROUP BY c1, c2;
  ```

  Se a Query incluísse `WHERE c3 = const`, o Loose Index Scan poderia ser usado.

O método de acesso Loose Index Scan pode ser aplicado a outras formas de referências de aggregate function na lista de seleção, além das referências `MIN()` e `MAX()` já suportadas:

* `AVG(DISTINCT)`, `SUM(DISTINCT)` e `COUNT(DISTINCT)` são suportados. `AVG(DISTINCT)` e `SUM(DISTINCT)` aceitam um único argumento. `COUNT(DISTINCT)` pode ter mais de um argumento de coluna.

* Não deve haver cláusula `GROUP BY` ou `DISTINCT` na Query.

* As limitações do Loose Index Scan descritas anteriormente ainda se aplicam.

Suponha que exista um Index `idx(c1,c2,c3)` na tabela `t1(c1,c2,c3,c4)`. O método de acesso Loose Index Scan pode ser usado para as seguintes Queries:

```sql
SELECT COUNT(DISTINCT c1), SUM(DISTINCT c1) FROM t1;

SELECT COUNT(DISTINCT c1, c2), COUNT(DISTINCT c2, c1) FROM t1;
```

##### Tight Index Scan

Um Tight Index Scan pode ser um full index scan ou um range index scan, dependendo das condições da Query.

Quando as condições para um Loose Index Scan não são atendidas, ainda pode ser possível evitar a criação de temporary tables para Queries `GROUP BY`. Se houver range conditions na cláusula `WHERE`, este método lê apenas as Keys que satisfazem essas condições. Caso contrário, ele executa um index scan. Como este método lê todas as Keys em cada range definido pela cláusula `WHERE`, ou varre o Index inteiro se não houver range conditions, ele é chamado de Tight Index Scan. Com um Tight Index Scan, a operação de agrupamento é realizada somente depois que todas as Keys que satisfazem as range conditions forem encontradas.

Para que este método funcione, é suficiente que haja uma constant equality condition para todas as colunas em uma Query que se referem a partes da Key que vêm antes ou entre as partes da Key `GROUP BY`. As constantes das constant equality conditions preenchem quaisquer "lacunas" (gaps) nas search keys, de modo que seja possível formar prefixos completos do Index. Estes prefixos de Index podem então ser usados para Index Lookups. Se o resultado do `GROUP BY` exigir sorting, e for possível formar search keys que são prefixos do Index, o MySQL também evita operações de sorting extras porque a busca com prefixos em um Index ordenado já recupera todas as Keys em ordem.

Suponha que exista um Index `idx(c1,c2,c3)` na tabela `t1(c1,c2,c3,c4)`. As seguintes Queries não funcionam com o método de acesso Loose Index Scan descrito anteriormente, mas ainda funcionam com o método de acesso Tight Index Scan.

* Há uma lacuna (gap) no `GROUP BY`, mas ela é coberta pela condição `c2 = 'a'`:

  ```sql
  SELECT c1, c2, c3 FROM t1 WHERE c2 = 'a' GROUP BY c1, c3;
  ```

* O `GROUP BY` não começa com a primeira parte da Key, mas há uma condição que fornece uma constante para essa parte:

  ```sql
  SELECT c1, c2, c3 FROM t1 WHERE c1 = 'a' GROUP BY c2, c3;
  ```