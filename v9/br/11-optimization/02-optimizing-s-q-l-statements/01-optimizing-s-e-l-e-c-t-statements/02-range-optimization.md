#### 10.2.1.2 Otimização de Faixa

O método de acesso `range` usa um único índice para recuperar um subconjunto de linhas da tabela que estão contidas em um ou vários intervalos de valores de índice. Ele pode ser usado para índices de uma ou mais partes. As seções a seguir descrevem as condições sob as quais o otimizador usa o acesso de faixa.

* Método de Acesso de Faixa para Índices de Uma Parte
* Método de Acesso de Faixa para Índices de Muitas Partes
* Otimização de Faixa de Comparação de Muitos Valores
* Método de Acesso de Faixa de Scan de Ignorar
* Otimização de Faixa de Expressões de Construtor de Linhas
* Limitação do Uso de Memória para Otimização de Faixa

##### Método de Acesso de Faixa para Índices de Uma Parte

Para um índice de uma parte, os intervalos de valores de índice podem ser convenientemente representados por condições correspondentes na cláusula `WHERE`, denotadas como condições de faixa em vez de “intervalos”.

A definição de uma condição de faixa para um índice de uma parte é a seguinte:

* Para índices `BTREE` e `HASH`, a comparação de uma parte da chave com um valor constante é uma condição de faixa ao usar os operadores `=`, `<=>`, `IN()`, `IS NULL` ou `IS NOT NULL`.

* Além disso, para índices `BTREE`, a comparação de uma parte da chave com um valor constante é uma condição de faixa ao usar os operadores `>`, `<`, `>=`, `<=`, `BETWEEN`, `!=` ou `<>`, ou comparações `LIKE` se o argumento de `LIKE` for uma string constante que não comece com um caractere de comodinho.

* Para todos os tipos de índice, múltiplas condições de faixa combinadas com `OR` ou `AND` formam uma condição de faixa.

“Valor constante” nas descrições anteriores significa um dos seguintes:

* Uma constante do string de consulta
* Uma coluna de uma tabela `const` ou `system` da mesma junção

* O resultado de uma subconsulta não correlacionada
* Qualquer expressão composta inteiramente por subexpressões dos tipos anteriores

## 10.2.1.2 Otimização de Faixa

O método de acesso `range` usa um único índice para recuperar um subconjunto de linhas da tabela que estão contidas em um ou vários intervalos de valores de índice. Ele pode ser usado para índices de uma ou mais partes. As seções a seguir descrevem as condições sob as quais o otimizador usa o acesso de faixa.

* Método de Acesso de Faixa para Índices de Uma Parte
* Método de Acesso de Faixa para Índices de Muitas Partes
* Otimização de Faixa de Comparação de Muitos Valores
* Método de Acesso de Faixa de Scan de Ignorar
* Otimização de Faixa de Expressões de Construtor de Linhas
* Limitação do Uso de Memória para Otimização de Faixa

##### Método de Acesso de Faixa para Índices de Uma Parte

Para um índice de uma parte, os intervalos de valores de índice podem ser convenientemente representados por condições correspondentes na cláusula `WHERE`, denotadas como condições de faixa em vez de “intervalos”.

A definição de uma condição de faixa para um índice de uma parte é a seguinte:

* Para índices `BTREE` e `HASH`, a comparação de uma parte da chave com um valor constante é uma condição de faixa ao usar os operadores `=`, `<=>`, `IN()`, `IS NULL` ou `IS NOT NULL`.

* Além disso, para índices `BTREE`, a comparação de uma parte da chave com um valor constante é uma condição de faixa ao usar os operadores `>`, `<`, `>=`, `<=`, `BETWEEN`, `!=` ou `<>`, ou comparações `LIKE` se o argumento de `LIKE` for uma string constante que não comece com um caractere de comodinho.

* Para todos os tipos de índice, múltiplas condições de faixa combinadas com `OR` ou `AND` formam uma condição de faixa.

“Valor constante” nas descrições anteriores significa um dos seguintes:

* Uma constante do string de consulta
* Uma coluna de uma tabela `const` ou `system` da mesma junção

* O resultado de uma subconsulta não correlacionada
* Qualquer expressão composta inteiramente por subexpressões dos tipos anteriores

Aqui estão alguns exemplos de consultas com condições de intervalo na cláusula `WHERE`:

```
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

Alguns valores não constantes podem ser convertidos em constantes durante a fase de propagação de constantes do otimizador.

O MySQL tenta extrair condições de intervalo da cláusula `WHERE` para cada um dos possíveis índices. Durante o processo de extração, as condições que não podem ser usadas para construir a condição de intervalo são descartadas, as condições que produzem intervalos sobrepostos são combinadas e as condições que produzem intervalos vazios são removidas.

Considere a seguinte declaração, onde `key1` é uma coluna indexada e `nonkey` não está indexada:

```
SELECT * FROM t1 WHERE
  (key1 < 'abc' AND (key1 LIKE 'abcde%' OR key1 LIKE '%b')) OR
  (key1 < 'bar' AND nonkey = 4) OR
  (key1 < 'uux' AND key1 > 'z');
```

O processo de extração para a chave `key1` é o seguinte:

1. Comece com a cláusula `WHERE` original:

   ```
   (key1 < 'abc' AND (key1 LIKE 'abcde%' OR key1 LIKE '%b')) OR
   (key1 < 'bar' AND nonkey = 4) OR
   (key1 < 'uux' AND key1 > 'z')
   ```

2. Remova `nonkey = 4` e `key1 LIKE '%b'` porque não podem ser usados para uma varredura de intervalo. A maneira correta de removê-los é substituí-los por `TRUE`, para que não percamos nenhuma linha que corresponda ao fazer a varredura de intervalo. Substituí-los por `TRUE` resulta em:

   ```
   (key1 < 'abc' AND (key1 LIKE 'abcde%' OR TRUE)) OR
   (key1 < 'bar' AND TRUE) OR
   (key1 < 'uux' AND key1 > 'z')
   ```

3. Reduza as condições que são sempre verdadeiras ou falsas:

   * `(key1 LIKE 'abcde%' OR TRUE)` é sempre verdade

   * `(key1 < 'uux' AND key1 > 'z')` é sempre falso

   Substituir essas condições por constantes resulta em:

   ```
   (key1 < 'abc' AND TRUE) OR (key1 < 'bar' AND TRUE) OR (FALSE)
   ```

   Remover as constantes `TRUE` e `FALSE` desnecessárias resulta em:

   ```
   (key1 < 'abc') OR (key1 < 'bar')
   ```

4. Combinar intervalos sobrepostos em um resulta na condição final a ser usada para a varredura de intervalo:

   ```
   (key1 < 'bar')
   ```

Em geral (e como demonstrado pelo exemplo anterior), a condição usada para uma varredura de intervalo é menos restritiva do que a cláusula `WHERE`. O MySQL realiza uma verificação adicional para filtrar linhas que satisfazem a condição de intervalo, mas não a cláusula `WHERE` completa.

O algoritmo de extração de condições de intervalo pode lidar com construções aninhadas de `AND`/`OR` de qualquer profundidade, e sua saída não depende da ordem em que as condições aparecem na cláusula `WHERE`.

O MySQL não suporta a junção de múltiplos intervalos para o método de acesso `range` para índices espaciais. Para contornar essa limitação, você pode usar uma `UNION` com declarações `SELECT` idênticas, exceto que você coloca cada predicado espacial em um `SELECT` diferente.

##### Método de Acesso ao Intervalo para Índices de Múltiplas Partes

As condições de intervalo em um índice de múltiplas partes são uma extensão das condições de intervalo para um índice de uma parte. Uma condição de intervalo em um índice de múltiplas partes restringe as linhas do índice a estarem dentro de um ou vários intervalos de tuplas de chave. Os intervalos de tuplas de chave são definidos sobre um conjunto de tuplas de chave, usando a ordem do índice.

Por exemplo, considere um índice de múltiplas partes definido como `key1(key_part1, key_part2, key_part3)`, e o seguinte conjunto de tuplas de chave listadas em ordem de chave:

```
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

```
(1,-inf,-inf) <= (key_part1,key_part2,key_part3) < (1,+inf,+inf)
```

O intervalo cobre os 4º, 5º e 6º tuplos no conjunto de dados anterior e pode ser usado pelo método de acesso ao intervalo.

Em contraste, a condição `key_part3 = 'abc'` não define um único intervalo e não pode ser usada pelo método de acesso ao intervalo.

As descrições seguintes indicam como as condições de intervalo funcionam para índices de múltiplas partes com mais detalhes.

* Para índices `HASH`, cada intervalo contendo valores idênticos pode ser usado. Isso significa que o intervalo pode ser produzido apenas para condições na forma:

  ```
      key_part1 cmp const1
  AND key_part2 cmp const2
  AND ...
  AND key_partN cmp constN;
  ```

Aqui, *`const1`*, *`const2`*, … são constantes, *`cmp`* é um dos operadores de comparação `=`, `<=>` ou `IS NULL`, e as condições cobrem todas as partes do índice. (Ou seja, há *`N`* condições, uma para cada parte de um índice de *`N`* partes.) Por exemplo, a seguinte é uma condição de intervalo para um índice `HASH` de três partes:

  ```
  key_part1 = 1 AND key_part2 IS NULL AND key_part3 = 'foo'
  ```

  Para a definição do que é considerado uma constante, consulte o Método de Acesso de Intervalo para Índices de Uma Parte.

* Para um índice `BTREE`, um intervalo pode ser usado para condições combinadas com `AND`, onde cada condição compara uma parte da chave com um valor constante usando `=`, `<=>`, `IS NULL`, `>`, `<`, `>=`, `<=`, `!=`, `<>`, `BETWEEN` ou `LIKE 'pattern'` (onde `'pattern'` não começa com um caractere curinga). Um intervalo pode ser usado desde que seja possível determinar um único tuplo de chave que contenha todas as linhas que correspondem à condição (ou dois intervalos se `<>` ou `!=` for usado).

O otimizador tenta usar partes de chave adicionais para determinar o intervalo, desde que o operador de comparação seja `=`, `<=>` ou `IS NULL`. Se o operador for `>`, `<`, `>=`, `<=`, `!=`, `<>`, `BETWEEN` ou `LIKE`, o otimizador usa-o, mas não considera mais partes de chave. Para a expressão a seguir, o otimizador usa `=` da primeira comparação. Também usa `>=` da segunda comparação, mas não considera mais partes de chave e não usa a terceira comparação para a construção do intervalo:

  ```
  key_part1 = 'foo' AND key_part2 >= 10 AND key_part3 > 10
  ```

  O único intervalo é:

  ```
  ('foo',10,-inf) < (key_part1,key_part2,key_part3) < ('foo',+inf,+inf)
  ```

É possível que o intervalo criado contenha mais linhas do que a condição inicial. Por exemplo, o intervalo anterior inclui o valor `('foo', 11, 0)`, o que não satisfaz a condição original.

* Se as condições que cobrem conjuntos de linhas contidas em intervalos forem combinadas com `OR`, elas formam uma condição que cobre um conjunto de linhas contidas na união de seus intervalos. Se as condições forem combinadas com `AND`, elas formam uma condição que cobre um conjunto de linhas contidas na interseção de seus intervalos. Por exemplo, para esta condição em um índice de duas partes:

  ```
  (key_part1 = 1 AND key_part2 < 2) OR (key_part1 > 5)
  ```

  Os intervalos são:

  ```
  (1,-inf) < (key_part1,key_part2) < (1,2)
  (5,-inf) < (key_part1,key_part2)
  ```

  Neste exemplo, o intervalo na primeira linha usa uma parte da chave para o limite esquerdo e duas partes da chave para o limite direito. O intervalo na segunda linha usa apenas uma parte da chave. A coluna `key_len` (comprimento da chave) no resultado `EXPLAIN` indica o comprimento máximo do prefixo da chave usado.

  Em alguns casos, `key_len` pode indicar que uma parte da chave foi usada, mas isso pode não ser o que você esperaria. Suponha que *`key_part1`* e *`key_part2`* possam ser `NULL`. Então, a coluna `key_len` exibe dois comprimentos de parte da chave para a seguinte condição:

  ```
  key_part1 >= 1 AND key_part2 < 2
  ```

  Mas, na verdade, a condição é convertida para esta:

  ```
  key_part1 >= 1 AND key_part2 IS NOT NULL
  ```

  Para uma descrição de como as otimizações são realizadas para combinar ou eliminar intervalos para condições de intervalo em um índice de uma parte, consulte o Método de Acesso de Intervalo para Índices de Uma Parte. Passos análogos são realizados para condições de intervalo em índices de várias partes.

##### Otimização de Intervalo de Igualdade de Comparativos de Múltiplas Vales

Considere estas expressões, onde *`col_name`* é uma coluna indexada:

```
col_name IN(val1, ..., valN)
col_name = val1 OR ... OR col_name = valN
```

Cada expressão é verdadeira se *`col_name`* for igual a vários valores. Essas comparações são comparações de intervalo de igualdade (onde o “intervalo” é um único valor). O otimizador estima o custo de leitura de linhas qualificadoras para comparações de intervalo de igualdade da seguinte forma:

* Se houver um índice único em *`col_name`*, a estimativa de linha para cada intervalo é 1 porque, no máximo, uma linha pode ter o valor dado.

* Caso contrário, qualquer índice em *`col_name`* é não-único e o otimizador pode estimar o número de linhas para cada intervalo usando mergulhos no índice ou estatísticas do índice.

Com mergulhos no índice, o otimizador faz um mergulho em cada extremidade de um intervalo e usa o número de linhas no intervalo como estimativa. Por exemplo, a expressão `col_name IN (10, 20, 30)` tem três intervalos de igualdade e o otimizador faz dois mergulhos por intervalo para gerar uma estimativa de linha. Cada par de mergulhos gera uma estimativa do número de linhas que têm o valor dado.

Os mergulhos no índice fornecem estimativas de linha precisas, mas à medida que o número de valores de comparação na expressão aumenta, o otimizador leva mais tempo para gerar uma estimativa de linha. O uso de estatísticas do índice é menos preciso do que os mergulhos no índice, mas permite uma estimativa de linha mais rápida para listas de valores grandes.

A variável de sistema `eq_range_index_dive_limit` permite que você configure o número de valores em que o otimizador troca de uma estratégia de estimativa de linha para a outra. Para permitir o uso de mergulhos no índice para comparações de até *`N`* intervalos de igualdade, defina `eq_range_index_dive_limit` para *`N`* + 1. Para desabilitar o uso de estatísticas e sempre usar mergulhos no índice independentemente de *`N`*, defina `eq_range_index_dive_limit` para 0.

Para atualizar as estatísticas do índice da tabela para as melhores estimativas, use `ANALYZE TABLE`.

Antes do MySQL 9.5, não há maneira de pular o uso de mergulhos no índice para estimar a utilidade do índice, exceto usando a variável de sistema `eq_range_index_dive_limit`. No MySQL 9.5, o pular mergulhos no índice é possível para consultas que satisfazem todas essas condições:

* A consulta é para uma única tabela, não para uma junção em múltiplas tabelas.

* Há uma dica de índice `FORCE INDEX` de um único índice. A ideia é que, se o uso do índice for forçado, não há nada a ganhar com o overhead adicional de realizar mergulhos no índice.

* O índice não é único e não é um índice `FULLTEXT`.

* Não há subconsulta.
* Não há cláusulas `DISTINCT`, `GROUP BY` ou `ORDER BY`.

Para `EXPLAIN FOR CONNECTION`, a saída muda da seguinte forma se os mergulhos no índice forem ignorados:

* Para a saída tradicional, os valores `rows` e `filtered` são `NULL`.

* Para a saída JSON, `rows_examined_per_scan` e `rows_produced_per_join` não aparecem, `skip_index_dive_due_to_force` é `true` e os cálculos de custo não são precisos.

Sem `FOR CONNECTION`, a saída do `EXPLAIN` não muda quando os mergulhos no índice são ignorados.

Após a execução de uma consulta para a qual os mergulhos no índice são ignorados, a linha correspondente na tabela do Schema de Informações `OPTIMIZER_TRACE` contém um valor `index_dives_for_range_access` de `skipped_due_to_force_index`.

##### Método de Ignorar o Acesso ao Alcance de Alcance de Escaneio

Considere o seguinte cenário:

```
CREATE TABLE t1 (f1 INT NOT NULL, f2 INT NOT NULL, PRIMARY KEY(f1, f2));
INSERT INTO t1 VALUES
  (1,1), (1,2), (1,3), (1,4), (1,5),
  (2,1), (2,2), (2,3), (2,4), (2,5);
INSERT INTO t1 SELECT f1, f2 + 5 FROM t1;
INSERT INTO t1 SELECT f1, f2 + 10 FROM t1;
INSERT INTO t1 SELECT f1, f2 + 20 FROM t1;
INSERT INTO t1 SELECT f1, f2 + 40 FROM t1;
ANALYZE TABLE t1;

EXPLAIN SELECT f1, f2 FROM t1 WHERE f2 > 40;
```

Para executar esta consulta, o MySQL pode escolher um escaneamento de índice para obter todas as linhas (o índice inclui todas as colunas a serem selecionadas), e depois aplicar a condição `f2 > 40` da cláusula `WHERE` para produzir o conjunto de resultados final.

Um escaneamento de alcance é mais eficiente do que um escaneamento completo do índice, mas não pode ser usado neste caso porque não há condição no `f1`, a primeira coluna do índice. O otimizador pode realizar múltiplos escaneamentos de alcance, um para cada valor de `f1`, usando um método chamado Skip Scan que é semelhante ao Loose Index Scan (veja a Seção 10.2.1.17, “Otimização GROUP BY”):

1. Ignorar entre valores distintos da primeira parte do índice, `f1` (o prefixo do índice).

2. Realize uma varredura de subintervalo em cada valor distinto do prefixo para a condição `f2 > 40` na parte restante do índice.

Para o conjunto de dados mostrado anteriormente, o algoritmo funciona da seguinte maneira:

1. Obtenha o primeiro valor distinto da primeira parte da chave (`f1 = 1`).

2. Construa o intervalo com base nas primeiras e segunda partes das chaves (`f1 = 1 E f2 > 40`).

3. Realize uma varredura de intervalo.

4. Obtenha o próximo valor distinto da primeira parte da chave (`f1 = 2`).

5. Construa o intervalo com base nas primeiras e segunda partes das chaves (`f1 = 2 E f2 > 40`).

6. Realize uma varredura de intervalo.

Usar essa estratégia diminui o número de linhas acessadas porque o MySQL ignora as linhas que não se qualificam para cada intervalo construído. Esse método de acesso de varredura de salto é aplicável nas seguintes condições:

* A tabela T tem pelo menos um índice composto com partes de chave da forma ([A\_1, ..., A\_*`k`*,] B\_1, ..., B\_*`m`*, C [, D\_1, ..., D\_*`n`*]). As partes A e D podem ser vazias, mas B e C devem ser não vazias.

* A consulta faz referência apenas a uma tabela.

* A consulta não usa `GROUP BY` ou `DISTINCT`.

* A consulta faz referência apenas às colunas do índice.

* Os predicados em A\_1, ..., A\_*`k`* devem ser predicados de igualdade e devem ser constantes. Isso inclui o operador `IN()`.

* A consulta deve ser uma consulta conjuntiva; ou seja, uma `AND` de condições `OR`: `(cond1(chave_parte1) OR cond2(chave_parte1)) E (cond1(chave_parte2) OR ...) E ...`

* Deve haver uma condição de intervalo em C.

* As condições em colunas D são permitidas. As condições em D devem estar em conjunto com a condição de intervalo em C.

O uso de varredura de salto é indicado na saída `EXPLAIN` da seguinte forma:

* `Usando índice para varredura de salto` na coluna `Extra` indica que o método de acesso de varredura de salto do índice solto é usado.

* Se o índice puder ser usado para Skip Scan, ele deve ser visível na coluna `possible_keys`.

O uso do Skip Scan é indicado na saída do rastreamento do otimizador por um elemento `"skip scan"` dessa forma:

```
"skip_scan_range": {
  "type": "skip_scan",
  "index": index_used_for_skip_scan,
  "key_parts_used_for_access": [key_parts_used_for_access],
  "range": [range]
}
```

Você também pode ver um elemento `"best_skip_scan_summary"`. Se o Skip Scan for escolhido como a melhor variante de acesso de intervalo, um `"chosen_range_access_summary"` é escrito. Se o Skip Scan for escolhido como o método de acesso geral melhor, um elemento `"best_access_path"` está presente.

O uso do Skip Scan está sujeito ao valor da bandeira `skip_scan` da variável de sistema `optimizer_switch`. Veja a Seção 10.9.2, “Otimizações Conexíveis”. Por padrão, essa bandeira é `on`. Para desabilitá-la, defina `skip_scan` para `off`.

Além de usar a variável de sistema `optimizer_switch` para controlar o uso do otimizador do Skip Scan em nível de sessão, o MySQL suporta dicas do otimizador para influenciar o otimizador em nível de declaração. Veja a Seção 10.9.3, “Dicas do Otimizador”.

##### Otimização de Intervalos de Expressões de Construtores de Linhas

O otimizador é capaz de aplicar o método de acesso de varredura de intervalo a consultas dessa forma:

```
SELECT ... FROM t1 WHERE ( col_1, col_2 ) IN (( 'a', 'b' ), ( 'c', 'd' ));
```

Anteriormente, para que os varreduras de intervalo fossem usadas, era necessário escrever a consulta da seguinte forma:

```
SELECT ... FROM t1 WHERE ( col_1 = 'a' AND col_2 = 'b' )
OR ( col_1 = 'c' AND col_2 = 'd' );
```

Para que o otimizador use uma varredura de intervalo, as consultas devem satisfazer essas condições:

* Somente predicados `IN()` são usados, não `NOT IN()`.

* No lado esquerdo do predicado `IN()`, o construtor de linha contém apenas referências de coluna.

* No lado direito do predicado `IN()`, os construtores de linha contêm apenas constantes de tempo de execução, que são literais ou referências de coluna locais que são vinculadas a constantes durante a execução.

* No lado direito do predicado `IN()`, há mais de um construtor de linha.

Para obter mais informações sobre o otimizador e os construtores de linhas, consulte a Seção 10.2.1.22, “Otimização da Expressão de Construtores de Linha”

##### Limitação do Uso de Memória para Otimização de Cálculo de Cálculos

Para controlar a memória disponível para o otimizador de cálculo de cálculos, use a variável de sistema `range_optimizer_max_mem_size`:

* Um valor de 0 significa “sem limite”.
* Com um valor maior que 0, o otimizador acompanha a memória consumida ao considerar o método de acesso à faixa. Se o limite especificado estiver prestes a ser excedido, o método de acesso à faixa é abandonado e outros métodos, incluindo uma varredura completa da tabela, são considerados. Isso pode ser menos otimizado. Se isso acontecer, o seguinte aviso ocorre (onde *`N`* é o valor atual de `range_optimizer_max_mem_size`):

  ```
  Warning    3170    Memory capacity of N bytes for
                     'range_optimizer_max_mem_size' exceeded. Range
                     optimization was not done for this query.
  ```

* Para as instruções `UPDATE` e `DELETE`, se o otimizador retornar a uma varredura completa da tabela e a variável de sistema `sql_safe_updates` estiver habilitada, um erro ocorre em vez de um aviso porque, na verdade, nenhuma chave é usada para determinar quais linhas devem ser modificadas. Para mais informações, consulte “Modo de Atualizações Seguras (--safe-updates”)”.

Para consultas individuais que excederem a memória disponível para otimização de cálculos e para as quais o otimizador retorne a planos menos otimizados, aumentar o valor de `range_optimizer_max_mem_size` pode melhorar o desempenho.

Para estimar a quantidade de memória necessária para processar uma expressão de cálculo, use essas diretrizes:

* Para uma consulta simples, como a seguinte, onde há uma chave candidata para o método de acesso à faixa, cada predicado combinado com `OR` usa aproximadamente 230 bytes:

  ```
  SELECT COUNT(*) FROM t
  WHERE a=1 OR a=2 OR a=3 OR .. . a=N;
  ```

* Da mesma forma, para uma consulta como a seguinte, cada predicado combinado com `AND` usa aproximadamente 125 bytes:

  ```
  SELECT COUNT(*) FROM t
  WHERE a=1 AND b=1 AND c=1 ... N;
  ```

* Para uma consulta com predicados `IN()`:

  ```
  SELECT COUNT(*) FROM t
  WHERE a IN (1,2, ..., M) AND b IN (1,2, ..., N);
  ```

Cada valor literal em uma lista `IN()` conta como um predicado combinado com `OR`. Se houver duas listas `IN()`, o número de predicados combinados com `OR` é o produto do número de valores literais em cada lista. Assim, o número de predicados combinados com `OR` no caso anterior é *`M`* × *`N`*.