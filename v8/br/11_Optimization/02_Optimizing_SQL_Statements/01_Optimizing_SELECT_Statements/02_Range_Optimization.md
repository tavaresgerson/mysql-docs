#### 10.2.1.2 Otimização da Alcance

O método de acesso `range` utiliza um único índice para recuperar um subconjunto de linhas da tabela que estão contidas em um ou vários intervalos de valores de índice. Ele pode ser usado para um índice de uma parte ou de várias partes. As seções a seguir descrevem as condições sob as quais o otimizador usa o acesso de intervalo.

- Método de acesso de intervalo para índices de uma única parte
- Método de acesso de intervalo para índices de várias partes
- Otimização da faixa de igualdade da comparação de muitos valores
- Ignorar o método de acesso à faixa de varredura
- Otimização da faixa de expressão do construtor de linhas
- Limitar o uso de memória para otimização de alcance

##### Método de acesso de intervalo para índices de uma única parte

Para um índice de uma única parte, os intervalos de valor do índice podem ser convenientemente representados por condições correspondentes na cláusula `WHERE`, denotadas como condições de intervalo em vez de “intervalos”.

A definição de uma condição de intervalo para um índice de uma única parte é a seguinte:

- Para os índices `BTREE` e `HASH`, a comparação de uma parte-chave com um valor constante é uma condição de intervalo ao usar os operadores `=`, `<=>`, `IN()`, `IS NULL` ou `IS NOT NULL`.

- Além disso, para índices `BTREE`, a comparação de uma parte-chave com um valor constante é uma condição de intervalo ao usar os operadores `>`, `<`, `>=`, `<=`, `BETWEEN`, `!=` ou `<>` ou comparações `LIKE` se o argumento de `LIKE` for uma string constante que não comece com um caractere de comodinho.

- Para todos os tipos de índice, múltiplas condições de intervalo combinadas com `OR` ou `AND` formam uma condição de intervalo.

“Valor constante” nas descrições anteriores significa um dos seguintes:

- Uma constante da string de consulta

- Uma coluna de uma tabela `const` ou `system` do mesmo join

- O resultado de uma subconsulta não correlacionada

- Qualquer expressão composta inteiramente por sube expressões dos tipos anteriores

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

Considere a seguinte declaração, onde `key1` é uma coluna indexada e `nonkey` não é indexada:

```
SELECT * FROM t1 WHERE
  (key1 < 'abc' AND (key1 LIKE 'abcde%' OR key1 LIKE '%b')) OR
  (key1 < 'bar' AND nonkey = 4) OR
  (key1 < 'uux' AND key1 > 'z');
```

O processo de extração para a chave `key1` é o seguinte:

1. Comece com a cláusula original `WHERE`:

   ```
   (key1 < 'abc' AND (key1 LIKE 'abcde%' OR key1 LIKE '%b')) OR
   (key1 < 'bar' AND nonkey = 4) OR
   (key1 < 'uux' AND key1 > 'z')
   ```

2. Remova `nonkey = 4` e `key1 LIKE '%b'` porque eles não podem ser usados para uma varredura de intervalo. A maneira correta de removê-los é substituí-los por `TRUE`, para que não percamos nenhuma linha correspondente ao fazer a varredura de intervalo. Substituí-los por `TRUE` resulta em:

   ```
   (key1 < 'abc' AND (key1 LIKE 'abcde%' OR TRUE)) OR
   (key1 < 'bar' AND TRUE) OR
   (key1 < 'uux' AND key1 > 'z')
   ```

3. Condições de colapso que são sempre verdadeiras ou falsas:

   - `(key1 LIKE 'abcde%' OR TRUE)` é sempre verdadeiro

   - `(key1 < 'uux' AND key1 > 'z')` é sempre falso

   Substituindo essas condições por constantes, temos:

   ```
   (key1 < 'abc' AND TRUE) OR (key1 < 'bar' AND TRUE) OR (FALSE)
   ```

   A remoção das constantes desnecessárias `TRUE` e `FALSE` resulta em:

   ```
   (key1 < 'abc') OR (key1 < 'bar')
   ```

4. Combinando intervalos sobrepostos em um único intervalo, obtém-se a condição final a ser usada para a varredura de intervalo:

   ```
   (key1 < 'bar')
   ```

Em geral (e como demonstrado no exemplo anterior), a condição usada para uma varredura de intervalo é menos restritiva do que a cláusula `WHERE`. O MySQL realiza uma verificação adicional para filtrar linhas que satisfazem a condição de intervalo, mas não a cláusula completa `WHERE`.

O algoritmo de extração de condições de intervalo pode lidar com construções aninhadas de `AND`/`OR` de qualquer profundidade, e sua saída não depende da ordem em que as condições aparecem na cláusula `WHERE`.

O MySQL não suporta a junção de múltiplos intervalos para o método de acesso `range` para índices espaciais. Para contornar essa limitação, você pode usar um `UNION` com declarações `SELECT` idênticas, exceto que você coloque cada predicado espacial em um `SELECT` diferente.

##### Método de acesso de intervalo para índices de várias partes

As condições de intervalo em um índice de várias partes são uma extensão das condições de intervalo para um índice de uma única parte. Uma condição de intervalo em um índice de várias partes restringe as linhas do índice a ficarem dentro de um ou vários intervalos de tupla de chave. Os intervalos de tupla de chave são definidos sobre um conjunto de tuplas de chave, usando a ordem do índice.

Por exemplo, considere um índice de várias partes definido como `key1(key_part1, key_part2, key_part3)` e o seguinte conjunto de tuplas de chave listadas em ordem de chave:

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

A condição `key_part1 = 1` define esse intervalo:

```
(1,-inf,-inf) <= (key_part1,key_part2,key_part3) < (1,+inf,+inf)
```

O intervalo cobre os tuplos 4º, 5º e 6º no conjunto de dados anterior e pode ser usado pelo método de acesso de intervalo.

Em contraste, a condição `key_part3 = 'abc'` não define um intervalo único e não pode ser usada pelo método de acesso de intervalo.

As descrições a seguir indicam como as condições de alcance funcionam para índices de várias partes com mais detalhes.

- Para índices `HASH`, cada intervalo contendo valores idênticos pode ser usado. Isso significa que o intervalo pode ser produzido apenas para condições na seguinte forma:

  ```
      key_part1 cmp const1
  AND key_part2 cmp const2
  AND ...
  AND key_partN cmp constN;
  ```

  Aqui, `const1`, `const2`, … são constantes, `cmp` é um dos operadores de comparação `=`, `<=>` ou `IS NULL`, e as condições cobrem todas as partes do índice. (Ou seja, existem `N` condições, uma para cada parte de um índice de `N`.) Por exemplo, o seguinte é uma condição de intervalo para um índice de três partes `HASH`:

  ```
  key_part1 = 1 AND key_part2 IS NULL AND key_part3 = 'foo'
  ```

  Para a definição do que é considerado uma constante, consulte o Método de Acesso de Intervalo para Índices de Uma Parte.

- Para um índice `BTREE`, um intervalo pode ser útil para condições combinadas com `AND`, onde cada condição compara uma parte-chave com um valor constante usando `=`, `<=>`, `IS NULL`, `>`, `<`, `>=`, `<=`, `!=`, `<>`, `BETWEEN` ou `LIKE 'pattern'` (onde `'pattern'` não começa com um caractere curinga). Um intervalo pode ser usado desde que seja possível determinar um único par de chaves que contenha todas as linhas que correspondem à condição (ou dois intervalos se `<>` ou `!=` for usado).

  O otimizador tenta usar partes de chave adicionais para determinar o intervalo, desde que o operador de comparação seja `=`, `<=>`, ou `IS NULL`. Se o operador for `>`, `<`, `>=`, `<=`, `!=`, `<>`, `BETWEEN` ou `LIKE`, o otimizador usa-o, mas não considera mais partes de chave. Para a expressão a seguir, o otimizador usa `=` da primeira comparação. Também usa `>=` da segunda comparação, mas não considera mais partes de chave e não usa a terceira comparação para a construção do intervalo:

  ```
  key_part1 = 'foo' AND key_part2 >= 10 AND key_part3 > 10
  ```

  O intervalo único é:

  ```
  ('foo',10,-inf) < (key_part1,key_part2,key_part3) < ('foo',+inf,+inf)
  ```

  É possível que o intervalo criado contenha mais linhas do que a condição inicial. Por exemplo, o intervalo anterior inclui o valor `('foo', 11, 0)`, que não satisfaz a condição original.

- Se as condições que cobrem conjuntos de linhas contidas em intervalos forem combinadas com `OR`, elas formam uma condição que cobre um conjunto de linhas contidas na união de seus intervalos. Se as condições forem combinadas com `AND`, elas formam uma condição que cobre um conjunto de linhas contidas na interseção de seus intervalos. Por exemplo, para essa condição em um índice de duas partes:

  ```
  (key_part1 = 1 AND key_part2 < 2) OR (key_part1 > 5)
  ```

  Os intervalos são:

  ```
  (1,-inf) < (key_part1,key_part2) < (1,2)
  (5,-inf) < (key_part1,key_part2)
  ```

  Neste exemplo, o intervalo na primeira linha usa uma parte chave para o limite esquerdo e duas partes chave para o limite direito. O intervalo na segunda linha usa apenas uma parte chave. A coluna `key_len` no resultado `EXPLAIN` indica o comprimento máximo do prefixo da chave usado.

  Em alguns casos, `key_len` pode indicar que uma peça chave foi usada, mas isso pode não ser o que você esperaria. Suponha que `key_part1` e `key_part2` possam ser `NULL`. Então, a coluna `key_len` exibe duas comprimentos de peças chave para a seguinte condição:

  ```
  key_part1 >= 1 AND key_part2 < 2
  ```

  Mas, na verdade, a condição é convertida para:

  ```
  key_part1 >= 1 AND key_part2 IS NOT NULL
  ```

Para uma descrição de como as otimizações são realizadas para combinar ou eliminar intervalos para condições de intervalo em um índice de uma única parte, consulte o Método de Acesso de Intervalo para Índices de Uma Única Parte. Passos análogos são realizados para condições de intervalo em índices de múltiplas partes.

##### Otimização da faixa de igualdade da comparação de muitos valores

Considere essas expressões, onde `col_name` é uma coluna indexada:

```
col_name IN(val1, ..., valN)
col_name = val1 OR ... OR col_name = valN
```

Cada expressão é verdadeira se `col_name` for igual a qualquer um dos vários valores. Essas comparações são comparações de intervalo de igualdade (onde o "intervalo" é um único valor). O otimizador estima o custo de leitura das linhas qualificadas para comparações de intervalo de igualdade da seguinte forma:

- Se houver um índice único em `col_name`, a estimativa da linha para cada intervalo é 1, porque, no máximo, uma linha pode ter o valor dado.

- Caso contrário, qualquer índice em `col_name` é não-único e o otimizador pode estimar o número de linhas para cada intervalo usando mergulhos no índice ou estatísticas do índice.

Com mergulhos de índice, o otimizador faz um mergulho em cada extremidade de uma faixa e usa o número de linhas na faixa como estimativa. Por exemplo, a expressão `col_name IN (10, 20, 30)` tem três faixas de igualdade e o otimizador faz dois mergulhos por faixa para gerar uma estimativa de linha. Cada par de mergulhos gera uma estimativa do número de linhas que têm o valor dado.

As mergulhas no índice fornecem estimativas precisas de linhas, mas à medida que o número de valores de comparação na expressão aumenta, o otimizador leva mais tempo para gerar uma estimativa de linha. O uso de estatísticas de índice é menos preciso do que as mergulhas no índice, mas permite uma estimativa de linha mais rápida para listas de valores grandes.

A variável de sistema `eq_range_index_dive_limit` permite que você configure o número de valores nos quais o otimizador muda de uma estratégia de estimativa de linha para outra. Para permitir o uso de mergulhos de índice para comparações de até `N` faixas de igualdade, defina `eq_range_index_dive_limit` para `N` + 1. Para desabilitar o uso de estatísticas e sempre usar mergulhos de índice independentemente de `N`, defina `eq_range_index_dive_limit` para 0.

Para atualizar as estatísticas do índice da tabela para as melhores estimativas, use `ANALYZE TABLE`.

Antes do MySQL 8.0, não há como evitar o uso de mergulhos de índice para estimar a utilidade do índice, exceto usando a variável de sistema `eq_range_index_dive_limit`. No MySQL 8.0, o desvio de mergulho de índice é possível para consultas que satisfazem todas essas condições:

- A consulta é para uma única tabela, não para uma junção em várias tabelas.

- Há uma dica de índice de um único `FORCE INDEX` índice. A ideia é que, se o uso do índice for forçado, não há nada a ganhar com o overhead adicional de realizar mergulhos no índice.

- O índice não é único e não é um índice `FULLTEXT`.

- Não há subconsulta presente.

- Não há cláusula `DISTINCT`, `GROUP BY` ou `ORDER BY`.

Para `EXPLAIN FOR CONNECTION`, a saída muda da seguinte forma se as quedas de índice forem ignoradas:

- Para a saída tradicional, os valores `rows` e `filtered` são `NULL`.

- Para a saída em JSON, `rows_examined_per_scan` e `rows_produced_per_join` não aparecem, `skip_index_dive_due_to_force` é `true`, e os cálculos de custo não são precisos.

Sem `FOR CONNECTION`, a saída de `EXPLAIN` não muda quando os mergulhos de índice são ignorados.

Após a execução de uma consulta para a qual os mergulhos de índice são ignorados, a linha correspondente na tabela do esquema de informações `OPTIMIZER_TRACE` contém um valor `index_dives_for_range_access` de `skipped_due_to_force_index`.

##### Ignorar o método de acesso à faixa de varredura

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

Para executar essa consulta, o MySQL pode escolher uma varredura de índice para recuperar todas as linhas (o índice inclui todas as colunas a serem selecionadas) e, em seguida, aplicar a condição `f2 > 40` da cláusula `WHERE` para produzir o conjunto de resultados final.

Uma varredura de intervalo é mais eficiente do que uma varredura completa de índice, mas não pode ser usada neste caso, porque não há nenhuma condição sobre `f1`, a primeira coluna do índice. No entanto, a partir do MySQL 8.0.13, o otimizador pode realizar múltiplas varreduras de intervalo, uma para cada valor de `f1`, usando um método chamado varredura de salto que é semelhante à varredura de índice solto (veja a Seção 10.2.1.17, “Otimização de GROUP BY”):

1. Pule entre valores distintos da primeira parte do índice, `f1` (o prefixo do índice).

2. Realize uma varredura de subintervalo para cada valor de prefixo distinto para a condição `f2 > 40` na parte restante do índice.

Para o conjunto de dados mostrado anteriormente, o algoritmo funciona da seguinte maneira:

1. Obtenha o primeiro valor distinto da primeira parte da chave (`f1 = 1`).

2. Construa a faixa com base nas primeiras e segundas partes-chave (`f1 = 1 AND f2 > 40`).

3. Realize uma varredura de alcance.

4. Obtenha o próximo valor distinto da primeira parte da chave (`f1 = 2`).

5. Construa a faixa com base nas primeiras e segundas partes-chave (`f1 = 2 AND f2 > 40`).

6. Realize uma varredura de alcance.

Usar essa estratégia diminui o número de linhas acessadas, pois o MySQL ignora as linhas que não se qualificam para cada intervalo construído. Esse método de acesso de varredura de salto é aplicável nas seguintes condições:

- A tabela T tem pelo menos um índice composto com partes-chave do formulário (\[A\_1, ..., A\_`k`*,] B\_1, ..., B\_`m`*, C \[, D\_1, ..., D\_`n`\*]). As partes-chave A e D podem estar vazias, mas B e C devem estar preenchidas.

- A consulta faz referência a apenas uma tabela.

- A consulta não usa `GROUP BY` ou `DISTINCT`.

- A consulta faz referência apenas às colunas do índice.

- Os predicados em A\_1, ..., A\_`k` devem ser predicados de igualdade e devem ser constantes. Isso inclui o operador `IN()`.

- A consulta deve ser uma consulta conjuntiva; ou seja, uma condição `AND` de condições `OR`: `(cond1(key_part1) OR cond2(key_part1)) AND (cond1(key_part2) OR ...) AND ...`

- Deve haver uma condição de intervalo em C.

- Condições nas colunas D são permitidas. As condições nas colunas D devem estar em conjunto com a condição de intervalo nas colunas C.

O uso do Deslize para pular linhas é indicado no `EXPLAIN` da saída da seguinte forma:

- O `Using index for skip scan` na coluna `Extra` indica que o método de acesso ao índice deslocado Skip Scan é utilizado.

- Se o índice puder ser usado para varredura saltando, ele deve ser visível na coluna `possible_keys`.

O uso do Deslize Descartável é indicado na saída do registro do otimizador por um elemento `"skip scan"` da seguinte forma:

```
"skip_scan_range": {
  "type": "skip_scan",
  "index": index_used_for_skip_scan,
  "key_parts_used_for_access": [key_parts_used_for_access],
  "range": [range]
}
```

Você também pode ver um elemento `"best_skip_scan_summary"`. Se o Skip Scan for escolhido como a melhor variante de acesso à faixa, um elemento `"chosen_range_access_summary"` é escrito. Se o Skip Scan for escolhido como o método de acesso mais geral, um elemento `"best_access_path"` está presente.

O uso do Deslize para pular é sujeito ao valor da bandeira `skip_scan` da variável de sistema `optimizer_switch`. Consulte a Seção 10.9.2, “Otimizações Alternativas”. Por padrão, essa bandeira é `on`. Para desabilitá-la, defina `skip_scan` para `off`.

Além de usar a variável de sistema `optimizer_switch` para controlar o uso do otimizador na sessão Skip Scan, o MySQL suporta dicas de otimizador para influenciar o otimizador em uma base por declaração. Veja a Seção 10.9.3, “Dicas de Otimizador”.

##### Otimização da faixa de expressão do construtor de linhas

O otimizador é capaz de aplicar o método de acesso à varredura de intervalo a consultas desse tipo:

```
SELECT ... FROM t1 WHERE ( col_1, col_2 ) IN (( 'a', 'b' ), ( 'c', 'd' ));
```

Anteriormente, para que as varreduras de alcance pudessem ser usadas, era necessário escrever a consulta da seguinte forma:

```
SELECT ... FROM t1 WHERE ( col_1 = 'a' AND col_2 = 'b' )
OR ( col_1 = 'c' AND col_2 = 'd' );
```

Para que o otimizador use uma varredura de intervalo, as consultas devem satisfazer estas condições:

- São utilizados apenas os predicados `IN()`, e não `NOT IN()`.

- No lado esquerdo do predicado `IN()`, o construtor de linha contém apenas referências de coluna.

- No lado direito do predicado `IN()`, os construtores de linha contêm apenas constantes de tempo de execução, que são literais ou referências de coluna locais que são vinculadas a constantes durante a execução.

- No lado direito do predicado `IN()`, há mais de um construtor de linha.

Para obter mais informações sobre o otimizador e os construtores de linhas, consulte a Seção 10.2.1.22, “Otimização da Expressão do Construtor de Linha”.

##### Limitar o uso de memória para otimização de alcance

Para controlar a memória disponível para o otimizador de faixa, use a variável de sistema `range_optimizer_max_mem_size`:

- Um valor de 0 significa “sem limite”.

- Com um valor maior que 0, o otimizador acompanha a memória consumida ao considerar o método de acesso à faixa. Se o limite especificado estiver prestes a ser ultrapassado, o método de acesso à faixa é abandonado e outros métodos, incluindo uma varredura completa da tabela, são considerados em vez disso. Isso pode ser menos otimizado. Se isso acontecer, o seguinte aviso ocorre (onde `N` é o valor atual de `range_optimizer_max_mem_size`):

  ```
  Warning    3170    Memory capacity of N bytes for
                     'range_optimizer_max_mem_size' exceeded. Range
                     optimization was not done for this query.
  ```

- Para as instruções `UPDATE` e `DELETE`, se o otimizador recorrer a uma varredura completa da tabela e a variável de sistema `sql_safe_updates` estiver habilitada, ocorrerá um erro em vez de um aviso, pois, na verdade, nenhuma chave é usada para determinar quais linhas devem ser modificadas. Para obter mais informações, consulte "Usando o modo de atualizações seguras (--safe-updates)").

Para consultas individuais que excedam a memória de otimização de alcance disponível e para as quais o otimizador recorra a planos menos ótimos, aumentar o valor de `range_optimizer_max_mem_size` pode melhorar o desempenho.

Para estimar a quantidade de memória necessária para processar uma expressão de intervalo, use essas diretrizes:

- Para uma consulta simples, como a seguinte, onde há uma chave candidata para o método de acesso por intervalo, cada predicado combinado com `OR` usa aproximadamente 230 bytes:

  ```
  SELECT COUNT(*) FROM t
  WHERE a=1 OR a=2 OR a=3 OR .. . a=N;
  ```

- Da mesma forma, para uma consulta como a seguinte, cada predicado combinado com `AND` usa aproximadamente 125 bytes:

  ```
  SELECT COUNT(*) FROM t
  WHERE a=1 AND b=1 AND c=1 ... N;
  ```

- Para uma consulta com predicados `IN()`:

  ```
  SELECT COUNT(*) FROM t
  WHERE a IN (1,2, ..., M) AND b IN (1,2, ..., N);
  ```

  Cada valor literal em uma lista `IN()` conta como um predicado combinado com `OR`. Se houver duas listas `IN()`, o número de predicados combinados com `OR` é o produto do número de valores literais em cada lista. Assim, o número de predicados combinados com `OR` no caso anterior é `M` × `N`.
