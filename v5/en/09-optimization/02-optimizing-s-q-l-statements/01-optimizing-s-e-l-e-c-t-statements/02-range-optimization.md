#### 8.2.1.2 Otimização de Range

O método de acesso `range` usa um único Index para recuperar um subconjunto de linhas da tabela que estão contidas em um ou vários intervalos de valores do Index. Ele pode ser usado para um Index de parte única ou de múltiplas partes. As seções a seguir descrevem as condições sob as quais o optimizer usa o acesso por range.

* Método de Acesso Range para Indexes de Parte Única
* Método de Acesso Range para Indexes de Múltiplas Partes
* Otimização de Equality Range de Comparações com Muitos Valores
* Otimização de Range de Expressões Row Constructor
* Limitando o Uso de Memória para Otimização de Range

##### Método de Acesso Range para Indexes de Parte Única

Para um Index de parte única, os intervalos de valores do Index podem ser convenientemente representados pelas condições correspondentes na cláusula `WHERE`, denominadas condições de range, em vez de “intervalos.”

A definição de uma condição de range para um Index de parte única é a seguinte:

* Tanto para Indexes `BTREE` quanto para `HASH`, a comparação de uma parte da chave com um valor constante é uma condição de range ao usar os operadores `=`, `<=>`, `IN()`, `IS NULL` ou `IS NOT NULL`.

* Além disso, para Indexes `BTREE`, a comparação de uma parte da chave com um valor constante é uma condição de range ao usar os operadores `>`, `<`, `>=`, `<=`, `BETWEEN`, `!=` ou `<>`, ou comparações `LIKE` se o argumento para `LIKE` for uma string constante que não comece com um caractere wildcard.

* Para todos os tipos de Index, múltiplas condições de range combinadas com `OR` ou `AND` formam uma condição de range.

“Valor constante” nas descrições anteriores significa um dos seguintes:

* Uma constante da string da Query
* Uma coluna de uma tabela `const` ou `system` do mesmo JOIN
* O resultado de uma subquery não correlacionada
* Qualquer expressão composta inteiramente por subexpressões dos tipos precedentes

Aqui estão alguns exemplos de Queries com condições de range na cláusula `WHERE`:

```sql
SELECT * FROM t1
  WHERE key_col > 1
  AND key_col < 10;

SELECT * FROM t1
  WHERE key_col = 1
  OR key_col IN (15,18,20);

SELECT * FROM t1
  WHERE key_col LIKE 'ab%'
  OR key_col BETWEEN 'bar' AND 'foo';
```

Alguns valores não constantes podem ser convertidos em constantes durante a fase de propagação de constantes do optimizer.

O MySQL tenta extrair as condições de range da cláusula `WHERE` para cada um dos Indexes possíveis. Durante o processo de extração, as condições que não podem ser usadas para construir a condição de range são descartadas, as condições que produzem ranges sobrepostos são combinadas e as condições que produzem ranges vazios são removidas.

Considere a seguinte instrução, onde `key1` é uma coluna indexada e `nonkey` não é indexada:

```sql
SELECT * FROM t1 WHERE
  (key1 < 'abc' AND (key1 LIKE 'abcde%' OR key1 LIKE '%b')) OR
  (key1 < 'bar' AND nonkey = 4) OR
  (key1 < 'uux' AND key1 > 'z');
```

O processo de extração para a chave `key1` é o seguinte:

1. Começa com a cláusula `WHERE` original:

   ```sql
   (key1 < 'abc' AND (key1 LIKE 'abcde%' OR key1 LIKE '%b')) OR
   (key1 < 'bar' AND nonkey = 4) OR
   (key1 < 'uux' AND key1 > 'z')
   ```

2. Remove `nonkey = 4` e `key1 LIKE '%b'` porque não podem ser usados para um range scan. A maneira correta de removê-los é substituí-los por `TRUE`, para que não percamos nenhuma linha correspondente ao realizar o range scan. Substituí-los por `TRUE` resulta em:

   ```sql
   (key1 < 'abc' AND (key1 LIKE 'abcde%' OR TRUE)) OR
   (key1 < 'bar' AND TRUE) OR
   (key1 < 'uux' AND key1 > 'z')
   ```

3. Colapsa as condições que são sempre verdadeiras ou falsas:

   * `(key1 LIKE 'abcde%' OR TRUE)` é sempre verdadeiro

   * `(key1 < 'uux' AND key1 > 'z')` é sempre falso

   A substituição dessas condições por constantes resulta em:

   ```sql
   (key1 < 'abc' AND TRUE) OR (key1 < 'bar' AND TRUE) OR (FALSE)
   ```

   A remoção de constantes `TRUE` e `FALSE` desnecessárias resulta em:

   ```sql
   (key1 < 'abc') OR (key1 < 'bar')
   ```

4. A combinação de intervalos sobrepostos em um único resulta na condição final a ser usada para o range scan:

   ```sql
   (key1 < 'bar')
   ```

Em geral (e como demonstrado pelo exemplo anterior), a condição usada para um range scan é menos restritiva do que a cláusula `WHERE`. O MySQL executa uma verificação adicional para filtrar as linhas que satisfazem a condição de range, mas não a cláusula `WHERE` completa.

O algoritmo de extração de condição de range pode lidar com construções `AND`/`OR` aninhadas de profundidade arbitrária, e sua saída não depende da ordem em que as condições aparecem na cláusula `WHERE`.

O MySQL não suporta a mesclagem de múltiplos ranges para o método de acesso `range` em Indexes espaciais. Para contornar essa limitação, você pode usar um `UNION` com instruções `SELECT` idênticas, exceto pelo fato de colocar cada predicado espacial em um `SELECT` diferente.

##### Método de Acesso Range para Indexes de Múltiplas Partes

As condições de range em um Index de múltiplas partes são uma extensão das condições de range para um Index de parte única. Uma condição de range em um Index de múltiplas partes restringe as linhas do Index a estarem dentro de um ou vários intervalos de tuplas de chave. Os intervalos de tuplas de chave são definidos sobre um conjunto de tuplas de chave, usando a ordenação do Index.

Por exemplo, considere um Index de múltiplas partes definido como `key1(key_part1, key_part2, key_part3)` e o seguinte conjunto de tuplas de chave listadas na ordem da chave:

```sql
key_part1  key_part2  key_part3
  NULL       1          'abc'
  NULL       1          'xyz'
  NULL       2          'foo'
   1         1          'abc'
   1         1          'xyz'
   1         2          'abc'
   2         1          'aaa'
```

A condição `key_part1 = 1` define este intervalo:

```sql
(1,-inf,-inf) <= (key_part1,key_part2,key_part3) < (1,+inf,+inf)
```

O intervalo abrange a 4ª, 5ª e 6ª tuplas no conjunto de dados anterior e pode ser usado pelo método de acesso range.

Em contraste, a condição `key_part3 = 'abc'` não define um único intervalo e não pode ser usada pelo método de acesso range.

As descrições a seguir indicam como as condições de range funcionam para Indexes de múltiplas partes com mais detalhes.

* Para Indexes `HASH`, cada intervalo contendo valores idênticos pode ser usado. Isso significa que o intervalo pode ser produzido apenas para condições no seguinte formato:

  ```sql
      key_part1 cmp const1
  AND key_part2 cmp const2
  AND ...
  AND key_partN cmp constN;
  ```

  Aqui, *`const1`*, *`const2`*, … são constantes, *`cmp`* é um dos operadores de comparação `=`, `<=>` ou `IS NULL`, e as condições cobrem todas as partes do Index. (Ou seja, existem *`N`* condições, uma para cada parte de um Index de *`N`* partes.) Por exemplo, o seguinte é uma condição de range para um Index `HASH` de três partes:

  ```sql
  key_part1 = 1 AND key_part2 IS NULL AND key_part3 = 'foo'
  ```

  Para a definição do que é considerado uma constante, consulte Método de Acesso Range para Indexes de Parte Única.

* Para um Index `BTREE`, um intervalo pode ser utilizável para condições combinadas com `AND`, onde cada condição compara uma parte da chave com um valor constante usando `=`, `<=>`, `IS NULL`, `>`, `<`, `>=`, `<=`, `!=`, `<>`, `BETWEEN` ou `LIKE 'pattern'` (onde `'pattern'` não começa com um wildcard). Um intervalo pode ser usado contanto que seja possível determinar uma única tupla de chave contendo todas as linhas que correspondam à condição (ou dois intervalos se `<>` ou `!=` for usado).

  O optimizer tenta usar partes adicionais da chave para determinar o intervalo, desde que o operador de comparação seja `=`, `<=>` ou `IS NULL`. Se o operador for `>`, `<`, `>=`, `<=`, `!=`, `<>`, `BETWEEN` ou `LIKE`, o optimizer o usa, mas não considera mais partes da chave. Para a expressão a seguir, o optimizer usa `=` da primeira comparação. Ele também usa `>=` da segunda comparação, mas não considera mais partes da chave e não usa a terceira comparação para construção do intervalo:

  ```sql
  key_part1 = 'foo' AND key_part2 >= 10 AND key_part3 > 10
  ```

  O intervalo único é:

  ```sql
  ('foo',10,-inf) < (key_part1,key_part2,key_part3) < ('foo',+inf,+inf)
  ```

  É possível que o intervalo criado contenha mais linhas do que a condição inicial. Por exemplo, o intervalo anterior inclui o valor `('foo', 11, 0)`, que não satisfaz a condição original.

* Se as condições que cobrem conjuntos de linhas contidas em intervalos forem combinadas com `OR`, elas formam uma condição que cobre um conjunto de linhas contidas na união de seus intervalos. Se as condições forem combinadas com `AND`, elas formam uma condição que cobre um conjunto de linhas contidas na intersecção de seus intervalos. Por exemplo, para esta condição em um Index de duas partes:

  ```sql
  (key_part1 = 1 AND key_part2 < 2) OR (key_part1 > 5)
  ```

  Os intervalos são:

  ```sql
  (1,-inf) < (key_part1,key_part2) < (1,2)
  (5,-inf) < (key_part1,key_part2)
  ```

  Neste exemplo, o intervalo na primeira linha usa uma parte da chave para o limite esquerdo e duas partes da chave para o limite direito. O intervalo na segunda linha usa apenas uma parte da chave. A coluna `key_len` na saída do `EXPLAIN` indica o comprimento máximo do prefixo da chave usado.

  Em alguns casos, `key_len` pode indicar que uma parte da chave foi usada, mas isso pode não ser o que você esperaria. Suponha que *`key_part1`* e *`key_part2`* possam ser `NULL`. Então a coluna `key_len` exibe dois comprimentos de parte da chave para a seguinte condição:

  ```sql
  key_part1 >= 1 AND key_part2 < 2
  ```

  Mas, de fato, a condição é convertida para isto:

  ```sql
  key_part1 >= 1 AND key_part2 IS NOT NULL
  ```

Para uma descrição de como as otimizações são realizadas para combinar ou eliminar intervalos para condições de range em um Index de parte única, consulte Método de Acesso Range para Indexes de Parte Única. Etapas análogas são realizadas para condições de range em Indexes de múltiplas partes.

##### Otimização de Equality Range de Comparações com Muitos Valores

Considere estas expressões, onde *`col_name`* é uma coluna indexada:

```sql
col_name IN(val1, ..., valN)
col_name = val1 OR ... OR col_name = valN
```

Cada expressão é verdadeira se *`col_name`* for igual a qualquer um de vários valores. Essas comparações são comparações de equality range (onde o “range” é um único valor). O optimizer estima o custo da leitura de linhas qualificadas para comparações de equality range da seguinte forma:

* Se houver um Index unique em *`col_name`*, a estimativa de linha para cada range é 1, pois no máximo uma linha pode ter o valor fornecido.

* Caso contrário, qualquer Index em *`col_name`* é não-unique e o optimizer pode estimar a contagem de linhas para cada range usando dives no Index ou estatísticas do Index.

Com index dives, o optimizer faz um dive em cada extremidade de um range e usa o número de linhas no range como estimativa. Por exemplo, a expressão `col_name IN (10, 20, 30)` tem três equality ranges e o optimizer faz dois dives por range para gerar uma estimativa de linha. Cada par de dives resulta em uma estimativa do número de linhas que têm o valor fornecido.

Index dives fornecem estimativas de linha precisas, mas à medida que o número de valores de comparação na expressão aumenta, o optimizer leva mais tempo para gerar uma estimativa de linha. O uso de estatísticas do Index é menos preciso do que index dives, mas permite uma estimativa de linha mais rápida para listas de valores grandes.

A variável de sistema `eq_range_index_dive_limit` permite configurar o número de valores nos quais o optimizer muda de uma estratégia de estimativa de linha para a outra. Para permitir o uso de index dives para comparações de até *`N`* equality ranges, defina `eq_range_index_dive_limit` como *`N`* + 1. Para desativar o uso de estatísticas e sempre usar index dives, independentemente de *`N`*, defina `eq_range_index_dive_limit` como 0.

Para atualizar as estatísticas do Index da tabela para obter as melhores estimativas, use `ANALYZE TABLE`.

Mesmo em condições nas quais index dives seriam usados, eles são ignorados para Queries que satisfazem todas estas condições:

* Um Index hint de índice único `FORCE INDEX` está presente. A ideia é que se o uso do Index é forçado, não há nada a ganhar com o overhead adicional de executar dives no Index.

* O Index é não-unique e não é um Index `FULLTEXT`.

* Nenhuma subquery está presente.
* Nenhuma cláusula `DISTINCT`, `GROUP BY` ou `ORDER BY` está presente.

Essas condições de ignorar dives se aplicam apenas a Queries de tabela única. Index dives não são ignorados para Queries de múltiplas tabelas (JOINs).

##### Otimização de Range de Expressões Row Constructor

O optimizer é capaz de aplicar o método de acesso range scan a Queries neste formato:

```sql
SELECT ... FROM t1 WHERE ( col_1, col_2 ) IN (( 'a', 'b' ), ( 'c', 'd' ));
```

Anteriormente, para que os range scans fossem usados, era necessário escrever a Query como:

```sql
SELECT ... FROM t1 WHERE ( col_1 = 'a' AND col_2 = 'b' )
OR ( col_1 = 'c' AND col_2 = 'd' );
```

Para que o optimizer use um range scan, as Queries devem satisfazer estas condições:

* Apenas predicados `IN()` são usados, não `NOT IN()`.

* No lado esquerdo do predicado `IN()`, o row constructor contém apenas referências de coluna.

* No lado direito do predicado `IN()`, os row constructors contêm apenas constantes de runtime, que são literais ou referências de coluna local vinculadas a constantes durante a execução.

* No lado direito do predicado `IN()`, há mais de um row constructor.

Para mais informações sobre o optimizer e row constructors, consulte a Seção 8.2.1.19, “Otimização de Expressões Row Constructor”

##### Limitando o Uso de Memória para Otimização de Range

Para controlar a memória disponível para o range optimizer, use a variável de sistema `range_optimizer_max_mem_size`:

* Um valor de 0 significa “sem limite.”
* Com um valor maior que 0, o optimizer rastreia a memória consumida ao considerar o método de acesso range. Se o limite especificado estiver prestes a ser excedido, o método de acesso range é abandonado e outros métodos, incluindo um full table scan, são considerados. Isso pode ser menos ideal. Se isso ocorrer, o seguinte warning (aviso) é emitido (onde *`N`* é o valor atual de `range_optimizer_max_mem_size`):

  ```sql
  Warning    3170    Memory capacity of N bytes for
                     'range_optimizer_max_mem_size' exceeded. Range
                     optimization was not done for this query.
  ```

* Para instruções `UPDATE` e `DELETE`, se o optimizer retornar a um full table scan e a variável de sistema `sql_safe_updates` estiver habilitada, um erro ocorre em vez de um warning, pois, na prática, nenhuma chave é usada para determinar quais linhas modificar. Para mais informações, consulte Using Safe-Updates Mode (--safe-updates)").

Para Queries individuais que excedem a memória disponível de otimização de range e para as quais o optimizer retorna a planos menos ideais, aumentar o valor de `range_optimizer_max_mem_size` pode melhorar o desempenho.

Para estimar a quantidade de memória necessária para processar uma expressão de range, use estas diretrizes:

* Para uma Query simples como a seguinte, onde há uma chave candidata para o método de acesso range, cada predicado combinado com `OR` usa aproximadamente 230 bytes:

  ```sql
  SELECT COUNT(*) FROM t
  WHERE a=1 OR a=2 OR a=3 OR .. . a=N;
  ```

* Da mesma forma para uma Query como a seguinte, cada predicado combinado com `AND` usa aproximadamente 125 bytes:

  ```sql
  SELECT COUNT(*) FROM t
  WHERE a=1 AND b=1 AND c=1 ... N;
  ```

* Para uma Query com predicados `IN()`:

  ```sql
  SELECT COUNT(*) FROM t
  WHERE a IN (1,2, ..., M) AND b IN (1,2, ..., N);
  ```

  Cada valor literal em uma lista `IN()` conta como um predicado combinado com `OR`. Se houver duas listas `IN()`, o número de predicados combinados com `OR` é o produto do número de valores literais em cada lista. Assim, o número de predicados combinados com `OR` no caso anterior é *`M`* × *`N`*.

Antes da 5.7.11, o número de bytes por predicado combinado com `OR` era maior, aproximadamente 700 bytes.