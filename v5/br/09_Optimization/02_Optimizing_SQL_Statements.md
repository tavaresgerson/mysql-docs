## 8.2 Otimizando declarações SQL

A lógica central de uma aplicação de banco de dados é realizada por meio de instruções SQL, seja emitidas diretamente por um interpretador ou submetidas nos bastidores por meio de uma API. As diretrizes de ajuste nesta seção ajudam a acelerar todos os tipos de aplicações MySQL. As diretrizes cobrem operações SQL que leem e escrevem dados, o overhead nos bastidores para operações SQL em geral e operações usadas em cenários específicos, como monitoramento de banco de dados.

### 8.2.1 Otimizando declarações SELECT

As consultas, na forma de declarações `SELECT`, realizam todas as operações de busca no banco de dados. A otimização dessas declarações é uma prioridade máxima, seja para alcançar tempos de resposta inferiores a um segundo para páginas web dinâmicas, ou para reduzir horas no tempo para gerar grandes relatórios noturnos.

Além das declarações `SELECT`, as técnicas de ajuste para consultas também se aplicam a construções como as cláusulas `CREATE TABLE...AS SELECT`, `INSERT INTO...SELECT` e `WHERE` nas declarações `DELETE`. Essas declarações têm considerações de desempenho adicionais porque combinam operações de escrita com operações de consulta orientadas para leitura.

O NDB Cluster suporta uma otimização de empurrar a junção, na qual uma junção qualificada é enviada em sua totalidade para os nós de dados do NDB Cluster, onde ela pode ser distribuída entre eles e executada em paralelo. Para mais informações sobre essa otimização, consulte Condições para junções de empurrar NDB.

As principais considerações para otimizar as consultas são:

* Para tornar uma consulta lenta do `SELECT ... WHERE` mais rápida, a primeira coisa a verificar é se você pode adicionar um índice. Configure índices nas colunas usadas na cláusula `WHERE`, para acelerar a avaliação, filtragem e a recuperação final dos resultados. Para evitar o espaço em disco desperdiçado, construa um pequeno conjunto de índices que acelere muitas consultas relacionadas usadas em sua aplicação.

Os índices são especialmente importantes para consultas que fazem referência a diferentes tabelas, utilizando recursos como junções e chaves estrangeiras. Você pode usar a declaração `EXPLAIN` para determinar quais índices são usados para um `SELECT`. Veja a Seção 8.3.1, “Como o MySQL usa índices” e a Seção 8.8.1, “Otimizando consultas com EXPLAIN”.

* Isolate e ajuste qualquer parte da consulta, como uma chamada de função, que leva tempo excessivo. Dependendo da estrutura da consulta, uma função pode ser chamada uma vez para cada string no conjunto de resultados, ou até mesmo uma vez para cada string da tabela, aumentando significativamente qualquer ineficiência.

* Minimize o número de varreduras completas da tabela em suas consultas, especialmente para tabelas grandes.

* Mantenha as estatísticas da tabela atualizadas usando a declaração `ANALYZE TABLE` periodicamente, para que o otimizador tenha as informações necessárias para construir um plano de execução eficiente.

* Aprenda as técnicas de ajuste, técnicas de indexação e parâmetros de configuração específicos para o motor de armazenamento de cada tabela. Tanto `InnoDB` quanto `MyISAM` têm conjuntos de diretrizes para habilitar e sustentar alto desempenho em consultas. Para detalhes, consulte a Seção 8.5.6, “Otimizando consultas InnoDB” e a Seção 8.6.1, “Otimizando consultas MyISAM”.

* Você pode otimizar transações de consulta única para tabelas de `InnoDB`, usando a técnica na Seção 8.5.3, “Otimizando Transações de Leitura Apenas de InnoDB”.

* Evite transformar a consulta de maneiras que tornem difícil entendê-la, especialmente se o otimizador fizer algumas das mesmas transformações automaticamente.

* Se um problema de desempenho não for facilmente resolvido por uma das diretrizes básicas, investigue os detalhes internos da consulta específica lendo o plano `EXPLAIN` e ajuste seus índices, cláusulas `WHERE`, cláusulas de junção, e assim por diante. (Quando você atingir um certo nível de experiência, ler o plano `EXPLAIN` pode ser seu primeiro passo para cada consulta.)

* Ajuste o tamanho e as propriedades das áreas de memória que o MySQL usa para cache. Com o uso eficiente do pool de buffers `InnoDB`, cache de chave `MyISAM` e o cache de consultas MySQL, consultas repetidas são executadas mais rapidamente, pois os resultados são recuperados da memória nas segundas e subsequentes tentativas.

* Mesmo para uma consulta que roda rápido usando as áreas de memória cache, você ainda pode otimizar mais para que elas precisem de menos memória cache, tornando sua aplicação mais escalável. Escalabilidade significa que sua aplicação pode lidar com mais usuários simultâneos, solicitações maiores, e assim por diante, sem experimentar uma grande queda de desempenho.

* Trate problemas de bloqueio, onde a velocidade da sua consulta pode ser afetada por outras sessões acessando as tabelas ao mesmo tempo.

#### 8.2.1.1 Otimização da cláusula WHERE

Esta seção discute as otimizações que podem ser feitas para o processamento das cláusulas `WHERE`. Os exemplos utilizam as declarações `SELECT`, mas as mesmas otimizações se aplicam às cláusulas `WHERE` nas declarações `DELETE` e `UPDATE`.

Nota

Como o trabalho no otimizador do MySQL está em andamento, nem todas as otimizações que o MySQL realiza estão documentadas aqui.

Você pode ser tentado a reescrever suas consultas para tornar as operações aritméticas mais rápidas, sacrificando a legibilidade. Como o MySQL realiza otimizações semelhantes automaticamente, você pode muitas vezes evitar esse trabalho e deixar a consulta em uma forma mais compreensível e manutenível. Algumas das otimizações realizadas pelo MySQL incluem:

* Remoção de parênteses desnecessários:

  ```sql
     ((a AND b) AND c OR (((a AND b) AND (c AND d))))
  -> (a AND b AND c) OR (a AND b AND c AND d)
  ```

* Dobragem constante:

  ```sql
     (a<b AND b=c) AND a=5
  -> b>5 AND b=c AND a=5
  ```

* Remoção de condição constante:

  ```sql
     (b>=5 AND b=5) OR (b=6 AND 5=5) OR (b=7 AND 5=6)
  -> b=5 OR b=6
  ```

* Expressões constantes usadas por índices são avaliadas apenas uma vez.

* `COUNT(*)` em uma única tabela sem um `WHERE` é recuperado diretamente das informações da tabela para as tabelas `MyISAM` e `MEMORY`. Isso também é feito para qualquer expressão `NOT NULL` quando usada com apenas uma tabela.

* Detecção precoce de expressões constantes inválidas. O MySQL rapidamente detecta que algumas declarações `SELECT` são impossíveis e não retorna nenhuma string.

* `HAVING` é fundido com `WHERE` se você não usar funções agregadas (`COUNT()`, `MIN()` e assim por diante) ou funções `GROUP BY`.

* Para cada tabela em uma junção, é construído um `WHERE` mais simples para obter uma avaliação rápida do `WHERE` para a tabela e também para ignorar as strings o mais rápido possível.

* Todas as tabelas constantes são lidas primeiro antes de qualquer outra tabela na consulta. Uma tabela constante é qualquer uma das seguintes:

+ Uma tabela vazia ou uma tabela com uma única string.  + Uma tabela que é usada com uma cláusula `WHERE` em um índice `PRIMARY KEY` ou `UNIQUE`, onde todas as partes do índice são comparadas a expressões constantes e são definidas como `NOT NULL`.

Todas as tabelas a seguir são usadas como tabelas constantes:

  ```sql
  SELECT * FROM t WHERE primary_key=1;
  SELECT * FROM t1,t2
    WHERE t1.primary_key=1 AND t2.primary_key=t1.id;
  ```

* A melhor combinação de junção para unir as tabelas é encontrada ao testar todas as possibilidades. Se todas as colunas nas cláusulas `ORDER BY` e `GROUP BY` vierem da mesma tabela, essa tabela é preferida primeiro ao realizar a junção.

* Se houver uma cláusula `ORDER BY` e uma cláusula `GROUP BY` diferente, ou se a `ORDER BY` ou `GROUP BY` contiver colunas de tabelas que não sejam a primeira tabela na fila de junção, uma tabela temporária é criada.

* Se você usar o modificador `SQL_SMALL_RESULT`, o MySQL usa uma tabela temporária de memória.

* Cada índice de tabela é pesquisado e o melhor índice é usado, a menos que o otimizador acredite que seja mais eficiente usar uma varredura de tabela. Em um momento, uma varredura foi usada com base no fato de que o melhor índice abrangia mais de 30% da tabela, mas uma porcentagem fixa não determina mais a escolha entre usar um índice ou uma varredura. O otimizador agora é mais complexo e baseia sua estimativa em fatores adicionais, como o tamanho da tabela, o número de strings e o tamanho do bloco de E/S.

* Em alguns casos, o MySQL pode ler strings do índice sem consultar o arquivo de dados. Se todas as colunas usadas do índice forem numéricas, apenas a árvore do índice é usada para resolver a consulta.

* Antes de cada string ser exibida, as que não correspondem à cláusula `HAVING` são ignoradas.

Alguns exemplos de consultas que são muito rápidas:

```sql
SELECT COUNT(*) FROM tbl_name;

SELECT MIN(key_part1),MAX(key_part1) FROM tbl_name;

SELECT MAX(key_part2) FROM tbl_name
  WHERE key_part1=constant;

SELECT ... FROM tbl_name
  ORDER BY key_part1,key_part2,... LIMIT 10;

SELECT ... FROM tbl_name
  ORDER BY key_part1 DESC, key_part2 DESC, ... LIMIT 10;
```

O MySQL resolve as seguintes consultas usando apenas a árvore de índice, assumindo que as colunas indexadas são numéricas:

```sql
SELECT key_part1,key_part2 FROM tbl_name WHERE key_part1=val;

SELECT COUNT(*) FROM tbl_name
  WHERE key_part1=val1 AND key_part2=val2;

SELECT MAX(key_part2) FROM tbl_name GROUP BY key_part1;
```

As seguintes consultas utilizam indexação para recuperar as strings em ordem ordenada, sem uma passagem de ordenação separada:

```sql
SELECT ... FROM tbl_name
  ORDER BY key_part1,key_part2,... ;

SELECT ... FROM tbl_name
  ORDER BY key_part1 DESC, key_part2 DESC, ... ;
```

#### 8.2.1.2 Otimização da Gama

O método de acesso `range` utiliza um único índice para recuperar um subconjunto de strings de tabela que estão contidas em um ou vários intervalos de valor de índice. Ele pode ser usado para índice de uma parte ou de múltiplas partes. As seções a seguir descrevem as condições sob as quais o otimizador utiliza o acesso de intervalo.

* Método de acesso de intervalo para índices de uma parte
* Método de acesso de intervalo para índices de várias partes
* Otimização de intervalo de igualdade de comparações de muitos valores
* Otimização de intervalo de expressões do construtor de string
* Limitar o uso de memória para otimização de intervalo

##### Método de acesso de intervalo para índices de uma única parte

Para um índice de uma única parte, os intervalos dos valores do índice podem ser convenientemente representados por condições correspondentes na cláusula `WHERE`, denotados como condições de intervalo em vez de “intervalos”.

A definição de uma condição de intervalo para um índice de uma única parte é a seguinte:

* Para os índices `BTREE` e `HASH`, a comparação de uma parte chave com um valor constante é uma condição de intervalo ao usar os operadores `=`, `<=>`, `IN()`, `IS NULL` ou `IS NOT NULL`.

* Além disso, para índices `BTREE`, a comparação de uma parte chave com um valor constante é uma condição de intervalo ao usar os operadores `>`, `<`, `>=`, `<=`, `BETWEEN`, `!=` ou `<>`, ou comparações `LIKE` se o argumento de `LIKE` for uma string constante que não comece com um caractere de comodinho.

* Para todos os tipos de índice, múltiplas condições de intervalo combinadas com `OR` ou `AND` formam uma condição de intervalo.

“Valor constante” nas descrições anteriores significa um dos seguintes:

* Uma constante da string de consulta * Uma coluna de uma tabela `const` ou `system` do mesmo junção

* O resultado de uma subconsulta não correlacionada; * Qualquer expressão composta inteiramente por subexpressões dos tipos anteriores.

Aqui estão alguns exemplos de consultas com condições de intervalo na cláusula `WHERE`:

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

Alguns valores não constantes podem ser convertidos em constantes durante a fase de propagação de constantes do otimizador.

O MySQL tenta extrair condições de intervalo da cláusula `WHERE` para cada um dos possíveis índices. Durante o processo de extração, as condições que não podem ser usadas para construir a condição de intervalo são descartadas, as condições que produzem intervalos sobrepostos são combinadas e as condições que produzem intervalos vazios são removidas.

Considere a seguinte declaração, onde `key1` é uma coluna indexada e `nonkey` não é indexada:

```sql
SELECT * FROM t1 WHERE
  (key1 < 'abc' AND (key1 LIKE 'abcde%' OR key1 LIKE '%b')) OR
  (key1 < 'bar' AND nonkey = 4) OR
  (key1 < 'uux' AND key1 > 'z');
```

O processo de extração para a chave `key1` é o seguinte:

1. Comece com a cláusula original `WHERE`:

   ```sql
   (key1 < 'abc' AND (key1 LIKE 'abcde%' OR key1 LIKE '%b')) OR
   (key1 < 'bar' AND nonkey = 4) OR
   (key1 < 'uux' AND key1 > 'z')
   ```

2. Remova `nonkey = 4` e `key1 LIKE '%b'` porque não podem ser usados para uma varredura de intervalo. A maneira correta de removê-los é substituí-los por `TRUE`, para que não percamos nenhuma string correspondente ao fazer a varredura de intervalo. Substituí-los por `TRUE` resulta em:

   ```sql
   (key1 < 'abc' AND (key1 LIKE 'abcde%' OR TRUE)) OR
   (key1 < 'bar' AND TRUE) OR
   (key1 < 'uux' AND key1 > 'z')
   ```

3. Collapsar condições que são sempre verdadeiras ou falsas:

* `(key1 LIKE 'abcde%' OR TRUE)` é sempre verdadeiro

* `(key1 < 'uux' AND key1 > 'z')` é sempre falso

Substituindo essas condições por constantes, obtém-se:

   ```sql
   (key1 < 'abc' AND TRUE) OR (key1 < 'bar' AND TRUE) OR (FALSE)
   ```

A remoção das constantes desnecessárias `TRUE` e `FALSE` resulta em:

   ```sql
   (key1 < 'abc') OR (key1 < 'bar')
   ```

4. Combinar intervalos sobrepostos em um resulta na condição final a ser usada para a varredura de intervalo:

   ```sql
   (key1 < 'bar')
   ```

Em geral (e como demonstrado pelo exemplo anterior), a condição usada para uma varredura de intervalo é menos restritiva do que a cláusula `WHERE`. O MySQL realiza uma verificação adicional para filtrar strings que satisfazem a condição de intervalo, mas não a cláusula completa `WHERE`.

O algoritmo de extração de condições de intervalo pode lidar com construções aninhadas de `AND`/`OR` de profundidade arbitrária, e sua saída não depende da ordem em que as condições aparecem na cláusula `WHERE`.

O MySQL não suporta a junção de múltiplos intervalos para o método de acesso `range` para índices espaciais. Para contornar essa limitação, você pode usar um `UNION` com declarações `SELECT` idênticas, exceto que você coloca cada predicado espacial em um `SELECT` diferente.

##### Método de acesso de intervalo para índices de várias partes

As condições de intervalo em um índice de várias partes são uma extensão das condições de intervalo para um índice de uma única parte. Uma condição de intervalo em um índice de várias partes restringe as strings do índice a ficarem dentro de um ou vários intervalos de tupla de chave. Os intervalos de tupla de chave são definidos sobre um conjunto de tuplas de chave, usando a ordem do índice.

Por exemplo, considere um índice de várias partes definido como `key1(key_part1, key_part2, key_part3)`, e o seguinte conjunto de tuplas chave listadas em ordem de chave:

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

A condição `key_part1 = 1` define esse intervalo:

```sql
(1,-inf,-inf) <= (key_part1,key_part2,key_part3) < (1,+inf,+inf)
```

O intervalo cobre os 4º, 5º e 6º tuplos no conjunto de dados anterior e pode ser usado pelo método de acesso de intervalo.

Em contraste, a condição `key_part3 = 'abc'` não define um intervalo único e não pode ser usada pelo método de acesso de intervalo.

As descrições a seguir indicam como as condições de intervalo funcionam para índices de várias partes de forma mais detalhada.

* Para os índices `HASH`, cada intervalo contendo valores idênticos pode ser utilizado. Isso significa que o intervalo pode ser produzido apenas para condições na seguinte forma:

  ```sql
      key_part1 cmp const1
  AND key_part2 cmp const2
  AND ...
  AND key_partN cmp constN;
  ```

Aqui, *`const1`*, *`const2`*, … são constantes, *`cmp`* é um dos operadores de comparação de `=`, `<=>` ou `IS NULL`, e as condições cobrem todas as partes do índice. (Ou seja, existem condições de *`N`*, uma para cada parte de um índice de *`N`*. Por exemplo, o seguinte é uma condição de intervalo para um índice de três partes de `HASH`:

  ```sql
  key_part1 = 1 AND key_part2 IS NULL AND key_part3 = 'foo'
  ```

Para a definição do que é considerado uma constante, consulte o Método de Acesso de Gama para Índices de uma Parte.

* Para um índice `BTREE`, um intervalo pode ser útil para condições combinadas com `AND`, onde cada condição compara uma parte chave com um valor constante usando `=`, `<=>`, `IS NULL`, `>`, `<`, `>=`, `<=`, `!=`, `<>`, `BETWEEN` ou `LIKE 'pattern'` (onde `'pattern'` não começa com um caractere curinga). Um intervalo pode ser usado desde que seja possível determinar um único par de chave que contenha todas as strings que correspondem à condição (ou dois intervalos se `<>` ou `!=` for usado).

O otimizador tenta usar partes de chave adicionais para determinar o intervalo, desde que o operador de comparação seja `=`, `<=>` ou `IS NULL`. Se o operador for `>`, `<`, `>=`, `<=`, `!=`, `<>`, `BETWEEN` ou `LIKE`, o otimizador usa-o, mas não considera mais partes de chave. Para a expressão a seguir, o otimizador usa `=` da primeira comparação. Também usa `>=` da segunda comparação, mas não considera mais partes de chave e não usa a terceira comparação para a construção do intervalo:

  ```sql
  key_part1 = 'foo' AND key_part2 >= 10 AND key_part3 > 10
  ```

O intervalo único é:

  ```sql
  ('foo',10,-inf) < (key_part1,key_part2,key_part3) < ('foo',+inf,+inf)
  ```

É possível que o intervalo criado contenha mais strings do que a condição inicial. Por exemplo, o intervalo anterior inclui o valor `('foo', 11, 0)`, que não satisfaz a condição original.

* Se as condições que cobrem conjuntos de strings contidas em intervalos forem combinadas com `OR`, elas formam uma condição que cobre um conjunto de strings contidas na união de seus intervalos. Se as condições forem combinadas com `AND`, elas formam uma condição que cobre um conjunto de strings contidas na interseção de seus intervalos. Por exemplo, para essa condição em um índice de duas partes:

  ```sql
  (key_part1 = 1 AND key_part2 < 2) OR (key_part1 > 5)
  ```

Os intervalos são:

  ```sql
  (1,-inf) < (key_part1,key_part2) < (1,2)
  (5,-inf) < (key_part1,key_part2)
  ```

Neste exemplo, o intervalo na primeira string utiliza uma parte chave para o limite esquerdo e duas partes chave para o limite direito. O intervalo na segunda string utiliza apenas uma parte chave. A coluna `key_len` no `EXPLAIN` indica o comprimento máximo do prefixo chave utilizado.

Em alguns casos, `key_len` pode indicar que uma peça chave foi usada, mas isso pode não ser o que você esperaria. Suponha que *`key_part1`* e *`key_part2`* possam ser `NULL`. Então, a coluna `key_len` exibe duas comprimentos de peça chave para a seguinte condição:

  ```sql
  key_part1 >= 1 AND key_part2 < 2
  ```

Mas, na verdade, a condição é convertida para o seguinte:

  ```sql
  key_part1 >= 1 AND key_part2 IS NOT NULL
  ```

Para uma descrição de como as otimizações são realizadas para combinar ou eliminar intervalos para condições de intervalo em um índice de uma única parte, consulte o Método de Acesso de Alcance para Índices de Uma Única Parte. Passos análogos são realizados para condições de intervalo em índices de várias partes.

##### Otimização da faixa de igualdade da otimização de comparações de vários valores

Considere essas expressões, onde *`col_name`* é uma coluna indexada:

```sql
col_name IN(val1, ..., valN)
col_name = val1 OR ... OR col_name = valN
```

Cada expressão é verdadeira se *`col_name`* for igual a qualquer um dos vários valores. Essas comparações são comparações de intervalo de igualdade (onde o "intervalo" é um único valor). O otimizador estima o custo de leitura de strings qualificadas para comparações de intervalo de igualdade da seguinte forma:

* Se houver um índice único em *`col_name`*, a estimativa da string para cada intervalo é 1, porque, no máximo, uma string pode ter o valor dado.

* Caso contrário, qualquer índice em *`col_name`* é não único e o otimizador pode estimar o número de strings para cada intervalo usando mergulhos no índice ou estatísticas do índice.

Com mergulhos de índice, o otimizador faz um mergulho em cada extremidade de uma faixa e usa o número de strings na faixa como a estimativa. Por exemplo, a expressão `col_name IN (10, 20, 30)` tem três faixas de igualdade e o otimizador faz dois mergulhos por faixa para gerar uma estimativa de string. Cada par de mergulhos gera uma estimativa do número de strings que têm o valor dado.

As mergulhas no índice fornecem estimativas precisas de string, mas, à medida que o número de valores de comparação na expressão aumenta, o otimizador leva mais tempo para gerar uma estimativa de string. O uso de estatísticas de índice é menos preciso do que as mergulhas no índice, mas permite uma estimativa de string mais rápida para listas de valores grandes.

A variável de sistema `eq_range_index_dive_limit` permite que você configure o número de valores em que o otimizador muda de uma estratégia de estimativa de string para outra. Para permitir o uso de mergulhos de índice para comparações de até *`N`* intervalos de igualdade, defina `eq_range_index_dive_limit` para *`N`* + 1. Para desabilitar o uso de estatísticas e usar sempre mergulhos de índice, independentemente de *`N`*, defina `eq_range_index_dive_limit` para 0.

Para atualizar as estatísticas do índice de tabela para as melhores estimativas, use `ANALYZE TABLE`.

Mesmo em condições em que as quedas de índice seriam usadas de outra forma, elas são ignoradas para consultas que satisfazem todas essas condições:

* Há uma dica de índice `FORCE INDEX` de um único índice. A ideia é que, se o uso do índice for forçado, não há nada a ganhar com o sobrecarga adicional de realizar mergulhos no índice.

* O índice não é único e não é um índice `FULLTEXT`.

* Não há subconsulta presente. * Não há cláusula `DISTINCT`, `GROUP BY` ou `ORDER BY` presente.

Essas condições de omissão de mergulho se aplicam apenas a consultas de tabela única. Mergulhos em índice não são omitidos para consultas de múltiplas tabelas (juntas).

##### Otimização de faixa de expressão do construtor de strings

O otimizador é capaz de aplicar o método de acesso à varredura de intervalo a consultas deste tipo:

```sql
SELECT ... FROM t1 WHERE ( col_1, col_2 ) IN (( 'a', 'b' ), ( 'c', 'd' ));
```

Anteriormente, para que as varreduras de alcance fossem usadas, era necessário escrever a consulta da seguinte forma:

```sql
SELECT ... FROM t1 WHERE ( col_1 = 'a' AND col_2 = 'b' )
OR ( col_1 = 'c' AND col_2 = 'd' );
```

Para que o otimizador utilize uma varredura de intervalo, as consultas devem satisfazer estas condições:

* Apenas os predicados `IN()` são utilizados, não `NOT IN()`.

* Do lado esquerdo do predicado `IN()`, o construtor de string contém apenas referências de coluna.

* No lado direito do predicado `IN()`, os construtores de string contêm apenas constantes de tempo de execução, que são literais ou referências de coluna local que são vinculadas a constantes durante a execução.

* Do lado direito do predicado `IN()`, há mais de um construtor de string.

Para mais informações sobre o otimizador e os construtores de string, consulte a Seção 8.2.1.19, “Otimização da expressão do construtor de string”.

##### Limitar o uso de memória para otimização de alcance

Para controlar a memória disponível para o otimizador de faixa, use a variável de sistema `range_optimizer_max_mem_size`:

* Um valor de 0 significa “sem limite”.
* Com um valor maior que 0, o otimizador acompanha a memória consumida ao considerar o método de acesso à faixa. Se o limite especificado está prestes a ser excedido, o método de acesso à faixa é abandonado e outros métodos, incluindo uma varredura completa da tabela, são considerados em vez disso. Isso pode ser menos ótimo. Se isso acontecer, o seguinte aviso ocorre (onde *`N`* é o valor atual do `range_optimizer_max_mem_size`):

  ```sql
  Warning    3170    Memory capacity of N bytes for
                     'range_optimizer_max_mem_size' exceeded. Range
                     optimization was not done for this query.
  ```

* Para as declarações `UPDATE` e `DELETE`, se o otimizador voltar a um varredura completa da tabela e a variável de sistema `sql_safe_updates` estiver habilitada, ocorre um erro em vez de um aviso, pois, na verdade, nenhuma chave é usada para determinar quais strings devem ser modificadas. Para mais informações, consulte "Usando o modo de atualizações seguras (--safe-updates)".

Para consultas individuais que excedem a memória de otimização de alcance disponível e para as quais o otimizador recorre a planos menos ótimos, aumentar o valor de `range_optimizer_max_mem_size` pode melhorar o desempenho.

Para estimar a quantidade de memória necessária para processar uma expressão de intervalo, use essas diretrizes:

* Para uma consulta simples, como a seguinte, onde há uma chave candidata para o método de acesso de intervalo, cada predicado combinado com `OR` usa aproximadamente 230 bytes:

  ```sql
  SELECT COUNT(*) FROM t
  WHERE a=1 OR a=2 OR a=3 OR .. . a=N;
  ```

* Da mesma forma, para uma consulta como a seguinte, cada predicado combinado com `AND` usa aproximadamente 125 bytes:

  ```sql
  SELECT COUNT(*) FROM t
  WHERE a=1 AND b=1 AND c=1 ... N;
  ```

* Para uma consulta com predicados `IN()`:

  ```sql
  SELECT COUNT(*) FROM t
  WHERE a IN (1,2, ..., M) AND b IN (1,2, ..., N);
  ```

Cada valor literal em uma lista `IN()` conta como um predicado combinado com `OR`. Se houver duas listas `IN()`, o número de predicados combinados com `OR` é o produto do número de valores literais em cada lista. Assim, o número de predicados combinados com `OR` no caso anterior é *`M`* × *`N`*.

Antes de 5.7.11, o número de bytes por predicado combinado com `OR` era maior, aproximadamente 700 bytes.

#### 8.2.1.3 Otimização da Mesclagem de Índices

O método de acesso de junção de índice recupera strings com múltiplos `range` e une seus resultados em uma única. Este método de acesso une varreduras de índice de uma única tabela, não varreduras em várias tabelas. A junção pode produzir uniões, interseções ou uniões de interseções de seus scans subjacentes.

Exemplos de consultas para as quais a Mesclagem de Índices pode ser usada:

```sql
SELECT * FROM tbl_name WHERE key1 = 10 OR key2 = 20;

SELECT * FROM tbl_name
  WHERE (key1 = 10 OR key2 = 20) AND non_key = 30;

SELECT * FROM t1, t2
  WHERE (t1.key1 IN (1,2) OR t1.key2 LIKE 'value%')
  AND t2.key1 = t1.some_col;

SELECT * FROM t1, t2
  WHERE t1.key1 = 1
  AND (t2.key1 = t1.some_col OR t2.key2 = t1.some_col2);
```

Nota

O algoritmo de otimização de junção de índice tem as seguintes limitações conhecidas:

* Se sua consulta tiver uma cláusula `WHERE` complexa com uma profundidade de `AND`/`OR` e o MySQL não escolher o plano ótimo, tente distribuir os termos usando as seguintes transformações de identidade:

  ```sql
  (x AND y) OR z => (x OR z) AND (y OR z)
  (x OR y) AND z => (x AND z) OR (y AND z)
  ```

* A junção de índice não é aplicável a índices de texto completo.

No `EXPLAIN` de saída, o método de junção de índices aparece como `index_merge` na coluna `type`. Neste caso, a coluna `key` contém uma lista de índices utilizados, e `key_len` contém uma lista das partes de chave mais longas para esses índices.

O método de acesso à junção de índices tem vários algoritmos, que são exibidos no campo `Extra` do `EXPLAIN` de saída:

* `Using intersect(...)`
* `Using union(...)`
* `Using sort_union(...)`

As seções a seguir descrevem esses algoritmos com mais detalhes. O otimizador escolhe entre diferentes algoritmos possíveis de Mesclagem de Índices e outros métodos de acesso com base nas estimativas de custo das várias opções disponíveis.

O uso da junção de índices está sujeito ao valor das bandeiras `index_merge`, `index_merge_intersection`, `index_merge_union` e `index_merge_sort_union` da variável de sistema `optimizer_switch`. Veja a Seção 8.9.2, “Otimizações Desconectables”. Por padrão, todas essas bandeiras são `on`. Para habilitar apenas certos algoritmos, defina `index_merge` para `off`, e habilite apenas aqueles outros que devem ser permitidos.

* Índice Merge Interseção Acesso Algoritmo
* Índice Merge União Acesso Algoritmo
* Índice Merge Sorteio União Acesso Algoritmo

##### Índice Merge Interseção Algoritmo de Acesso

Este algoritmo de acesso é aplicável quando uma cláusula `WHERE` é convertida em várias condições de intervalo em diferentes chaves combinadas com `AND`, e cada condição é uma das seguintes:

* Uma expressão de *`N`* dessa forma, onde o índice tem exatamente *`N`* partes (ou seja, todas as partes do índice são cobertas):

  ```sql
  key_part1 = const1 AND key_part2 = const2 ... AND key_partN = constN
  ```

* Qualquer condição de intervalo sobre a chave primária de uma tabela `InnoDB`.

Exemplos:

```sql
SELECT * FROM innodb_table
  WHERE primary_key < 10 AND key_col1 = 20;

SELECT * FROM tbl_name
  WHERE key1_part1 = 1 AND key1_part2 = 2 AND key2 = 2;
```

O algoritmo de interseção de junção de índices realiza varreduras simultâneas em todos os índices usados e produz a interseção de sequências de string que recebe dos varreduros de índice juncionado.

Se todas as colunas utilizadas na consulta estiverem cobertas pelos índices utilizados, as strings inteiras da tabela não serão recuperadas (a saída `EXPLAIN` contém `Using index` no campo `Extra` neste caso). Aqui está um exemplo de tal consulta:

```sql
SELECT COUNT(*) FROM t1 WHERE key1 = 1 AND key2 = 1;
```

Se os índices utilizados não cobrem todas as colunas utilizadas na consulta, as strings completas são recuperadas apenas quando as condições de intervalo para todas as chaves utilizadas são satisfeitas.

Se uma das condições unidas for uma condição sobre a chave primária de uma tabela `InnoDB`, ela não é usada para recuperação de string, mas é usada para filtrar as strings recuperadas usando outras condições.

##### Índice Merge Union Access Algorithm

Os critérios para este algoritmo são semelhantes aos do algoritmo de interseção de junção de índices. O algoritmo é aplicável quando a cláusula `WHERE` da tabela é convertida em várias condições de intervalo em diferentes chaves combinadas com `OR`, e cada condição é uma das seguintes:

* Uma expressão de *`N`* dessa forma, onde o índice tem exatamente *`N`* partes (ou seja, todas as partes do índice são cobertas):

  ```sql
  key_part1 = const1 OR key_part2 = const2 ... OR key_partN = constN
  ```

* Qualquer condição de intervalo sobre uma chave primária de uma tabela `InnoDB`.

* Uma condição para a qual o algoritmo de interseção de junção de índice é aplicável.

Exemplos:

```sql
SELECT * FROM t1
  WHERE key1 = 1 OR key2 = 2 OR key3 = 3;

SELECT * FROM innodb_table
  WHERE (key1 = 1 AND key2 = 2)
     OR (key3 = 'foo' AND key4 = 'bar') AND key5 = 5;
```

##### Índice Merge Sort-Algoritmo de Acesso Unificado

Este algoritmo de acesso é aplicável quando a cláusula `WHERE` é convertida em várias condições de intervalo combinadas por `OR`, mas o algoritmo de junção de índice não é aplicável.

Exemplos:

```sql
SELECT * FROM tbl_name
  WHERE key_col1 < 10 OR key_col2 < 20;

SELECT * FROM tbl_name
  WHERE (key_col1 > 10 OR key_col2 = 20) AND nonkey_col = 30;
```

A diferença entre o algoritmo de união por ordem e o algoritmo de união é que o algoritmo de união por ordem deve primeiro buscar os IDs de string para todas as strings e ordená-las antes de retornar qualquer string.

#### 8.2.1.4 Otimização da Depressão do Condição do Motor

Essa otimização melhora a eficiência das comparações diretas entre uma coluna não indexada e uma constante. Nesses casos, a condição é "deslocada" para o mecanismo de armazenamento para avaliação. Essa otimização só pode ser usada pelo mecanismo de armazenamento `NDB`.

Para o NDB Cluster, essa otimização pode eliminar a necessidade de enviar strings não correspondentes pela rede entre os nós de dados do cluster e o servidor MySQL que emitiu a consulta, e pode acelerar as consultas onde é usada em um fator de 5 a 10 vezes em relação aos casos em que a projeção de condição pode ser usada, mas não é usada.

Suponha que uma tabela de um NDB Cluster seja definida da seguinte forma:

```sql
CREATE TABLE t1 (
    a INT,
    b INT,
    KEY(a)
) ENGINE=NDB;
```

O pushdown de condição do motor pode ser usado com consultas como a mostrada aqui, que inclui uma comparação entre uma coluna não indexada e uma constante:

```sql
SELECT a, b FROM t1 WHERE b = 10;
```

O uso do pushdown da condição do motor pode ser visto na saída de `EXPLAIN`:

```sql
mysql> EXPLAIN SELECT a,b FROM t1 WHERE b = 10\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: t1
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 10
        Extra: Using where with pushed condition
```

No entanto, o pushdown da condição do motor *não pode* ser usado com nenhuma dessas duas consultas:

```sql
SELECT a,b FROM t1 WHERE a = 10;
SELECT a,b FROM t1 WHERE b + 1 = 10;
```

O pushdown de condição de motor não é aplicável à primeira consulta porque existe um índice na coluna `a`. (Um método de acesso a índice seria mais eficiente e, portanto, seria escolhido preferencialmente em detrimento do pushdown de condição.) O pushdown de condição de motor não pode ser empregado para a segunda consulta porque a comparação envolvendo a coluna não indexada `b` é indireta. (No entanto, o pushdown de condição de motor poderia ser aplicado se você reduzisse `b + 1 = 10` para `b = 9` na cláusula `WHERE`.

A exclusão de condição de motor também pode ser empregada quando uma coluna indexada é comparada com uma constante usando um operador `>` ou `<`:

```sql
mysql> EXPLAIN SELECT a, b FROM t1 WHERE a < 2\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: t1
         type: range
possible_keys: a
          key: a
      key_len: 5
          ref: NULL
         rows: 2
        Extra: Using where with pushed condition
```

Outras comparações suportadas para a análise da condição do motor incluem as seguintes:

* `column [NOT] LIKE pattern`

*`pattern`* deve ser uma literal de string que contém o padrão a ser correspondido; para sintaxe, consulte a Seção 12.8.1, “Funções e Operadores de Comparação de String”.

* `column IS [NOT] NULL`

* `column IN (value_list)`

Cada item no *`value_list`* deve ser um valor constante, literal.

* `column BETWEEN constant1 AND constant2`

*`constant1`* e *`constant2`* devem ser, cada um deles, um valor constante, literal.

Em todos os casos da lista anterior, é possível converter a condição na forma de uma ou mais comparações diretas entre uma coluna e uma constante.

O pushdown da condição do motor é ativado por padrão. Para desativá-lo na inicialização do servidor, defina a bandeira `engine_condition_pushdown` da variável de sistema `optimizer_switch` para `off`. Por exemplo, em um arquivo `my.cnf`, use essas strings:

```sql
[mysqld]
optimizer_switch=engine_condition_pushdown=off
```

Na execução, desative a condição pushdown da seguinte forma:

```sql
SET optimizer_switch='engine_condition_pushdown=off';
```

**Limitações.** A função de empurrar a condição do motor está sujeita às seguintes limitações:

* O empurrão de condição do motor é suportado apenas pelo motor de armazenamento `NDB`.

* As colunas podem ser comparadas apenas com constantes; no entanto, isso inclui expressões que avaliam valores constantes.

* As colunas utilizadas em comparações não podem ser de nenhum dos tipos `BLOB` ou `TEXT`. Essa exclusão também se estende às colunas `JSON`, `BIT` e `ENUM`.

* Um valor de cadeia que será comparado com uma coluna deve usar a mesma codificação que a coluna.

* As junções não são diretamente suportadas; as condições que envolvem múltiplas tabelas são empurradas separadamente, sempre que possível. Use a saída `EXPLAIN` estendida para determinar quais condições são realmente empurradas. Veja a Seção 8.8.3, “Formato de saída de EXPLAIN estendida”.

#### 8.2.1.5 Otimização da Depuração da Condição do Índice

O Índice de Condição Pushdown (ICP) é uma otimização para o caso em que o MySQL recupera strings de uma tabela usando um índice. Sem ICP, o mecanismo de armazenamento percorre o índice para localizar as strings na tabela base e as retorna ao servidor MySQL, que avalia a condição `WHERE` para as strings. Com ICP habilitado e, se partes da condição `WHERE` puderem ser avaliadas usando apenas colunas do índice, o servidor MySQL empurra essa parte da condição `WHERE` para o mecanismo de armazenamento. O mecanismo de armazenamento então avalia a condição de índice empurrada usando a entrada do índice e, apenas se isso for satisfeito, a string é lida da tabela. O ICP pode reduzir o número de vezes que o mecanismo de armazenamento deve acessar a tabela base e o número de vezes que o servidor MySQL deve acessar o mecanismo de armazenamento.

A aplicação da otimização da condição de empurrar o índice está sujeita a estas condições:

* O ICP é usado para os métodos de acesso `range`, `ref`, `eq_ref` e `ref_or_null` quando é necessário acessar strings completas da tabela.

* O ICP pode ser usado para as tabelas `InnoDB` e `MyISAM`, incluindo as tabelas particionadas `InnoDB` e `MyISAM`.

* Para as tabelas `InnoDB`, o ICP é usado apenas para índices secundários. O objetivo do ICP é reduzir o número de leituras completas de string e, assim, reduzir as operações de E/S. Para índices agrupados `InnoDB`, o registro completo já é lido no buffer [[`InnoDB`]. O uso do ICP neste caso não reduz a E/S.

* O ICP não é suportado com índices secundários criados em colunas geradas virtualmente. `InnoDB` suporta índices secundários em colunas geradas virtualmente.

* As condições que se referem a subconsultas não podem ser empurradas para baixo. * As condições que se referem a funções armazenadas não podem ser empurradas para baixo. Os motores de armazenamento não podem invocar funções armazenadas.

As condições desencadeadas não podem ser deslocadas. (Para informações sobre condições desencadeadas, consulte a Seção 8.2.2.3, “Otimizando subconsultas com a estratégia EXISTS”.)

Para entender como essa otimização funciona, considere primeiro como um varredura de índice ocorre quando o Index Condition Pushdown não é usado:

1. Obtenha a próxima string, primeiro lendo o tuplo do índice e, em seguida, usando o tuplo do índice para localizar e ler a string completa da tabela.

2. Teste a parte da condição `WHERE` que se aplica a esta tabela. Aceite ou rejeite a string com base no resultado do teste.

Usando o Pushdown da Condição de Índice, a varredura prossegue da seguinte maneira:

1. Obtenha o tuplo de índice da próxima string (mas não a string completa da tabela).

2. Teste a parte da condição `WHERE` que se aplica a esta tabela e que pode ser verificada usando apenas colunas de índice. Se a condição não for satisfeita, prossiga para o tuplo de índice para a próxima string.

3. Se a condição for atendida, use o tuplo de índice para localizar e ler a string completa da tabela.

4. Teste a parte restante da condição `WHERE` que se aplica a esta tabela. Aceite ou rejeite a string com base no resultado do teste.

A saída `EXPLAIN` exibe `Using index condition` na coluna `Extra` quando o Index Condition Pushdown é usado. Não exibe `Using index`, porque isso não se aplica quando as strings inteiras da tabela devem ser lidas.

Suponha que uma tabela contenha informações sobre pessoas e seus endereços e que a tabela tenha um índice definido como `INDEX (zipcode, lastname, firstname)`. Se soubermos o valor `zipcode` de uma pessoa, mas não tiver certeza sobre o sobrenome, podemos pesquisar da seguinte forma:

```sql
SELECT * FROM people
  WHERE zipcode='95054'
  AND lastname LIKE '%etrunia%'
  AND address LIKE '%Main Street%';
```

O MySQL pode usar o índice para percorrer pessoas com `zipcode='95054'`. A segunda parte (`lastname LIKE '%etrunia%'`) não pode ser usada para limitar o número de strings que devem ser percorridas, portanto, sem o Pushdown da Condição de Índice, esta consulta deve recuperar strings completas da tabela para todas as pessoas que têm `zipcode='95054'`.

Com o Pushdown da Condição de Índice, o MySQL verifica a parte `lastname LIKE '%etrunia%'` antes de ler a string completa da tabela. Isso evita a leitura de strings completas correspondentes a tuplas de índice que correspondem à condição `zipcode`, mas não à condição `lastname`.

O Índice de Condição Pushdown é ativado por padrão. Ele pode ser controlado com a variável de sistema `optimizer_switch` definindo a bandeira `index_condition_pushdown`:

```sql
SET optimizer_switch = 'index_condition_pushdown=off';
SET optimizer_switch = 'index_condition_pushdown=on';
```

Veja a Seção 8.9.2, “Otimizações Desconectables”.

#### 8.2.1.6 Algoritmos de Conjunção de Loop Aninhado

O MySQL executa junções entre tabelas usando um algoritmo de loop aninhado ou variações sobre ele.

* Algoritmo de junção de laço aninhado * Algoritmo de junção de laço aninhado em bloco

##### Algoritmo de Conjunção com Loop Aninhado

Um algoritmo de junção em laço aninhado (NLJ) lê as strings da primeira tabela em um laço, uma de cada vez, passando cada string para um laço aninhado que processa a próxima tabela na junção. Esse processo é repetido tantas vezes quanto houver tabelas a serem juncionadas.

Suponha que uma junção entre três tabelas `t1`, `t2` e `t3` deva ser executada usando os seguintes tipos de junção:

```sql
Table   Join Type
t1      range
t2      ref
t3      ALL
```

Se um algoritmo NLJ simples for utilizado, a junção é processada da seguinte forma:

```sql
for each row in t1 matching range {
  for each row in t2 matching reference key {
    for each row in t3 {
      if row satisfies join conditions, send to client
    }
  }
}
```

Como o algoritmo NLJ passa as strings uma de cada vez dos loops externos para os loops internos, ele geralmente lê as tabelas processadas nos loops internos muitas vezes.

##### Algoritmo de Conjunção de Nó de Nó Nested

Um algoritmo de junção de laço aninhado (BNL) usa o buffer de strings lidas em laços externos para reduzir o número de vezes que as tabelas em laços internos devem ser lidas. Por exemplo, se 10 strings são lidas em um buffer e o buffer é passado para o próximo laço interno, cada string lida no laço interno pode ser comparada com todas as 10 strings no buffer. Isso reduz em uma ordem de magnitude o número de vezes que a tabela interna deve ser lida.

O bufferamento de junção no MySQL tem essas características:

* O join de buffer pode ser usado quando a junção é do tipo `ALL` ou `index` (ou seja, quando não podem ser usadas possíveis chaves e uma varredura completa é feita, seja nos dados ou nas strings do índice, respectivamente), ou `range`. O uso de buffer também é aplicável a junções externas, conforme descrito na Seção 8.2.1.11, "Junções de Bloco de Busca e Acesso a Chave em Batel".

* Nunca é alocada uma reserva de junção para a primeira tabela não constante, mesmo que ela fosse do tipo `ALL` ou `index`.

* Apenas as colunas de interesse para uma junção são armazenadas em seu buffer de junção, não as strings inteiras.

* A variável de sistema `join_buffer_size` determina o tamanho de cada buffer de junção utilizado para processar uma consulta.

* Um buffer é alocado para cada junção que pode ser bufferizada, portanto, uma consulta específica pode ser processada usando múltiplos buffers de junção.

* Um buffer de junção é alocado antes de executar a junção e liberado após a consulta ser concluída.

Para o exemplo de junção descrito anteriormente para o algoritmo NLJ (sem buffer), a junção é feita da seguinte forma usando buffer de junção:

```sql
for each row in t1 matching range {
  for each row in t2 matching reference key {
    store used columns from t1, t2 in join buffer
    if buffer is full {
      for each row in t3 {
        for each t1, t2 combination in join buffer {
          if row satisfies join conditions, send to client
        }
      }
      empty join buffer
    }
  }
}

if buffer is not empty {
  for each row in t3 {
    for each t1, t2 combination in join buffer {
      if row satisfies join conditions, send to client
    }
  }
}
```

Se *`S`* for o tamanho de cada combinação armazenada no buffer de junção `t1` e `t2` e *`C`* for o número de combinações no buffer, o número de vezes que a tabela `t3` é percorrida é:

```sql
(S * C)/join_buffer_size + 1
```

O número de varreduras de `t3` diminui à medida que o valor de `join_buffer_size` aumenta, até o ponto em que `join_buffer_size` é grande o suficiente para conter todas as combinações anteriores da string. Nesse ponto, não se ganha velocidade ao torná-lo maior.

#### 8.2.1.7 Otimização de Conjunção Aninhada

A sintaxe para expressar junções permite junções aninhadas. A discussão a seguir se refere à sintaxe de junção descrita na Seção 13.2.9.2, “Cláusula JOIN”.

A sintaxe de *`table_factor`* é estendida em comparação com o Padrão SQL. Este último aceita apenas *`table_reference`*, não uma lista deles dentro de um par de parênteses. Esta é uma extensão conservadora se considerarmos cada vírgula em uma lista de itens de *`table_reference`* como equivalente a uma junção interna. Por exemplo:

```sql
SELECT * FROM t1 LEFT JOIN (t2, t3, t4)
                 ON (t2.a=t1.a AND t3.b=t1.b AND t4.c=t1.c)
```

É equivalente a:

```sql
SELECT * FROM t1 LEFT JOIN (t2 CROSS JOIN t3 CROSS JOIN t4)
                 ON (t2.a=t1.a AND t3.b=t1.b AND t4.c=t1.c)
```

Em MySQL, `CROSS JOIN` é equivalente sintaticamente a `INNER JOIN`; eles podem substituir um ao outro. Em SQL padrão, eles não são equivalentes. `INNER JOIN` é usado com uma cláusula `ON`; `CROSS JOIN` é usado de outra forma.

Em geral, as chaves de parênteses podem ser ignoradas em expressões de junção que contenham apenas operações de junção interna. Considere esta expressão de junção:

```sql
t1 LEFT JOIN (t2 LEFT JOIN t3 ON t2.b=t3.b OR t2.b IS NULL)
   ON t1.a=t2.a
```

Após a remoção dos parênteses e a agrupamento das operações para a esquerda, essa expressão de junção se transforma nesta expressão:

```sql
(t1 LEFT JOIN t2 ON t1.a=t2.a) LEFT JOIN t3
    ON t2.b=t3.b OR t2.b IS NULL
```

No entanto, as duas expressões não são equivalentes. Para entender isso, suponha que as tabelas `t1`, `t2` e `t3` tenham o seguinte estado:

* A tabela `t1` contém as strings `(1)`, `(2)`

* A tabela `t2` contém a string `(1,101)`

* A tabela `t3` contém a string `(101)`

Neste caso, a primeira expressão retorna um conjunto de resultados que inclui as strings `(1,1,101,101)`, `(2,NULL,NULL,NULL)`, enquanto a segunda expressão retorna as strings `(1,1,101,101)`, `(2,NULL,NULL,101)`:

```sql
mysql> SELECT *
       FROM t1
            LEFT JOIN
            (t2 LEFT JOIN t3 ON t2.b=t3.b OR t2.b IS NULL)
            ON t1.a=t2.a;
+------+------+------+------+
| a    | a    | b    | b    |
+------+------+------+------+
|    1 |    1 |  101 |  101 |
|    2 | NULL | NULL | NULL |
+------+------+------+------+

mysql> SELECT *
       FROM (t1 LEFT JOIN t2 ON t1.a=t2.a)
            LEFT JOIN t3
            ON t2.b=t3.b OR t2.b IS NULL;
+------+------+------+------+
| a    | a    | b    | b    |
+------+------+------+------+
|    1 |    1 |  101 |  101 |
|    2 | NULL | NULL |  101 |
+------+------+------+------+
```

No exemplo a seguir, uma operação de junção externa é usada juntamente com uma operação de junção interna:

```sql
t1 LEFT JOIN (t2, t3) ON t1.a=t2.a
```

Essa expressão não pode ser transformada na seguinte expressão:

```sql
t1 LEFT JOIN t2 ON t1.a=t2.a, t3
```

Para as declarações da tabela fornecida, as duas expressões retornam conjuntos diferentes de strings:

```sql
mysql> SELECT *
       FROM t1 LEFT JOIN (t2, t3) ON t1.a=t2.a;
+------+------+------+------+
| a    | a    | b    | b    |
+------+------+------+------+
|    1 |    1 |  101 |  101 |
|    2 | NULL | NULL | NULL |
+------+------+------+------+

mysql> SELECT *
       FROM t1 LEFT JOIN t2 ON t1.a=t2.a, t3;
+------+------+------+------+
| a    | a    | b    | b    |
+------+------+------+------+
|    1 |    1 |  101 |  101 |
|    2 | NULL | NULL |  101 |
+------+------+------+------+
```

Portanto, se omitirmos as chaves de parêntese em uma expressão de junção com operadores de junção externa, podemos alterar o conjunto de resultados da expressão original.

Mais precisamente, não podemos ignorar parênteses no operador direito da operação de junção externa à esquerda e no operador esquerdo de uma operação de junção à direita. Em outras palavras, não podemos ignorar parênteses para as expressões de tabela interna das operações de junção externa. Os parênteses para o outro operador (operador para a tabela externa) podem ser ignorados.

A expressão a seguir:

```sql
(t1,t2) LEFT JOIN t3 ON P(t2.b,t3.b)
```

É equivalente a esta expressão para quaisquer tabelas `t1,t2,t3` e qualquer condição `P` sobre os atributos `t2.b` e `t3.b`:

```sql
t1, t2 LEFT JOIN t3 ON P(t2.b,t3.b)
```

Sempre que a ordem de execução das operações de junção em uma expressão de junção (*`joined_table`*) não for de esquerda para direita, falamos em junções aninhadas. Considere as seguintes consultas:

```sql
SELECT * FROM t1 LEFT JOIN (t2 LEFT JOIN t3 ON t2.b=t3.b) ON t1.a=t2.a
  WHERE t1.a > 1

SELECT * FROM t1 LEFT JOIN (t2, t3) ON t1.a=t2.a
  WHERE (t2.b=t3.b OR t2.b IS NULL) AND t1.a > 1
```

Essas consultas são consideradas que contêm essas junções aninhadas:

```sql
t2 LEFT JOIN t3 ON t2.b=t3.b
t2, t3
```

Na primeira consulta, a junção aninhada é formada com uma operação de junção esquerda. Na segunda consulta, ela é formada com uma operação de junção interna.

Na primeira consulta, as chaves podem ser omitidas: a estrutura gramatical da expressão de junção dita o mesmo ordem de execução para as operações de junção. Para a segunda consulta, as chaves não podem ser omitidas, embora a expressão de junção aqui possa ser interpretada de forma inequívoca sem elas. Em nossa sintaxe estendida, as chaves em `(t2, t3)` da segunda consulta são necessárias, embora teoricamente a consulta possa ser analisada sem elas: ainda teríamos uma estrutura sintática inequívoca para a consulta porque `LEFT JOIN` e `ON` desempenham o papel de delimitadores esquerdo e direito para a expressão `(t2,t3)`.

Os exemplos anteriores demonstram esses pontos:

* Para expressões de junção que envolvem apenas junções internas (e não junções externas), os parênteses podem ser removidos e as junções são avaliadas da esquerda para a direita. De fato, as tabelas podem ser avaliadas em qualquer ordem.

* O mesmo não é verdade, em geral, para junções externas ou para junções externas misturadas com junções internas. A remoção dos parênteses pode alterar o resultado.

As consultas com junções externas aninhadas são executadas da mesma maneira que as consultas com junções internas. Mais precisamente, uma variação do algoritmo de junção de laço aninhado é explorada. Lembre-se do algoritmo pelo qual a junção de laço aninhado executa uma consulta (veja Seção 8.2.1.6, “Algoritmos de Junção de Laço Aninhado”). Suponha que uma consulta de junção sobre 3 tabelas `T1,T2,T3` tenha esta forma:

```sql
SELECT * FROM T1 INNER JOIN T2 ON P1(T1,T2)
                 INNER JOIN T3 ON P2(T2,T3)
  WHERE P(T1,T2,T3)
```

Aqui, `P1(T1,T2)` e `P2(T3,T3)` são algumas condições de junção (em expressões), enquanto `P(T1,T2,T3)` é uma condição sobre colunas de tabelas `T1,T2,T3`.

O algoritmo de junção de laço aninhado executaria essa consulta da seguinte maneira:

```sql
FOR each row t1 in T1 {
  FOR each row t2 in T2 such that P1(t1,t2) {
    FOR each row t3 in T3 such that P2(t2,t3) {
      IF P(t1,t2,t3) {
         t:=t1||t2||t3; OUTPUT t;
      }
    }
  }
}
```

A notação `t1||t2||t3` indica uma string construída concatenando as colunas das strings `t1`, `t2` e `t3`. Em alguns dos exemplos a seguir, `NULL` onde aparece o nome de uma tabela significa uma string na qual `NULL` é usado para cada coluna dessa tabela. Por exemplo, `t1||t2||NULL` indica uma string construída concatenando as colunas das strings `t1` e `t2`, e `NULL` para cada coluna de `t3`. Tal string é dita `NULL`-completada.

Agora, considere uma consulta com junções externas aninhadas:

```sql
SELECT * FROM T1 LEFT JOIN
              (T2 LEFT JOIN T3 ON P2(T2,T3))
              ON P1(T1,T2)
  WHERE P(T1,T2,T3)
```

Para esta consulta, modifique o padrão de loop aninhado para obter:

```sql
FOR each row t1 in T1 {
  BOOL f1:=FALSE;
  FOR each row t2 in T2 such that P1(t1,t2) {
    BOOL f2:=FALSE;
    FOR each row t3 in T3 such that P2(t2,t3) {
      IF P(t1,t2,t3) {
        t:=t1||t2||t3; OUTPUT t;
      }
      f2=TRUE;
      f1=TRUE;
    }
    IF (!f2) {
      IF P(t1,t2,NULL) {
        t:=t1||t2||NULL; OUTPUT t;
      }
      f1=TRUE;
    }
  }
  IF (!f1) {
    IF P(t1,NULL,NULL) {
      t:=t1||NULL||NULL; OUTPUT t;
    }
  }
}
```

Em geral, para qualquer laço aninhado na primeira tabela interna em uma operação de junção externa, é introduzida uma bandeira que é desligada antes do laço e verificada após o laço. A bandeira é ativada quando, para a string atual da tabela externa, é encontrada uma correspondência na tabela que representa o operando interno. Se, no final do ciclo do laço, a bandeira ainda estiver desligada, não foi encontrada nenhuma correspondência para a string atual da tabela externa. Neste caso, a string é complementada com os valores `NULL` para as colunas das tabelas internas. A string de resultado é passada para a verificação final para a saída ou para o próximo laço aninhado, mas apenas se a string satisfazer a condição de junção de todas as junções externas incorporadas.

No exemplo, a tabela de junção externa expressa pela seguinte expressão está embutida:

```sql
(T2 LEFT JOIN T3 ON P2(T2,T3))
```

Para a consulta com junções internas, o otimizador pode escolher uma ordem diferente de loops aninhados, como esta:

```sql
FOR each row t3 in T3 {
  FOR each row t2 in T2 such that P2(t2,t3) {
    FOR each row t1 in T1 such that P1(t1,t2) {
      IF P(t1,t2,t3) {
         t:=t1||t2||t3; OUTPUT t;
      }
    }
  }
}
```

Para consultas com junções externas, o otimizador pode escolher apenas esse tipo de ordem onde os ciclos das tabelas externas precedem os ciclos das tabelas internas. Assim, para a nossa consulta com junções externas, apenas um único nível de ninho é possível. Para a consulta a seguir, o otimizador avalia duas diferentes ninhos. Em ambos os ninhos, `T1` deve ser processado no ciclo externo, porque é usado em uma junção externa. `T2` e `T3` são usados em uma junção interna, então essa junção deve ser processada no ciclo interno. No entanto, como a junção é uma junção interna, `T2` e `T3` podem ser processados em qualquer ordem.

```sql
SELECT * T1 LEFT JOIN (T2,T3) ON P1(T1,T2) AND P2(T1,T3)
  WHERE P(T1,T2,T3)
```

Um ninho avalia `T2`, em seguida `T3`:

```sql
FOR each row t1 in T1 {
  BOOL f1:=FALSE;
  FOR each row t2 in T2 such that P1(t1,t2) {
    FOR each row t3 in T3 such that P2(t1,t3) {
      IF P(t1,t2,t3) {
        t:=t1||t2||t3; OUTPUT t;
      }
      f1:=TRUE
    }
  }
  IF (!f1) {
    IF P(t1,NULL,NULL) {
      t:=t1||NULL||NULL; OUTPUT t;
    }
  }
}
```

O outro ninho avalia `T3`, em seguida `T2`:

```sql
FOR each row t1 in T1 {
  BOOL f1:=FALSE;
  FOR each row t3 in T3 such that P2(t1,t3) {
    FOR each row t2 in T2 such that P1(t1,t2) {
      IF P(t1,t2,t3) {
        t:=t1||t2||t3; OUTPUT t;
      }
      f1:=TRUE
    }
  }
  IF (!f1) {
    IF P(t1,NULL,NULL) {
      t:=t1||NULL||NULL; OUTPUT t;
    }
  }
}
```

Ao discutir o algoritmo de laço aninhado para junções internas, omitimos alguns detalhes cujo impacto na execução da consulta pode ser enorme. Não mencionamos as chamadas condições "empurradas para baixo". Suponha que nossa condição `WHERE` `P(T1,T2,T3)` possa ser representada por uma fórmula conjuntiva:

```sql
P(T1,T2,T2) = C1(T1) AND C2(T2) AND C3(T3).
```

Neste caso, o MySQL, na verdade, utiliza o seguinte algoritmo de loop aninhado para a execução da consulta com junções internas:

```sql
FOR each row t1 in T1 such that C1(t1) {
  FOR each row t2 in T2 such that P1(t1,t2) AND C2(t2)  {
    FOR each row t3 in T3 such that P2(t2,t3) AND C3(t3) {
      IF P(t1,t2,t3) {
         t:=t1||t2||t3; OUTPUT t;
      }
    }
  }
}
```

Você vê que cada um dos conjuntos `C1(T1)`, `C2(T2)`, `C3(T3)` é empurrado do laço mais interno para o laço mais externo, onde ele pode ser avaliado. Se `C1(T1)` for uma condição muito restritiva, essa empurrada de condição pode reduzir significativamente o número de strings da tabela `T1` passadas para os laços internos. Como resultado, o tempo de execução da consulta pode melhorar imensamente.

Para uma consulta com junções externas, a condição `WHERE` deve ser verificada apenas após ter sido verificado que a string atual da tabela externa tem uma correspondência nas tabelas internas. Assim, a otimização de condições fora dos laços aninhados internos não pode ser aplicada diretamente a consultas com junções externas. Aqui, devemos introduzir predicados condicionados empurrados para baixo protegidos pelos indicadores que são ativados quando uma correspondência foi encontrada.

Lembre-se deste exemplo com junções externas:

```sql
P(T1,T2,T3)=C1(T1) AND C(T2) AND C3(T3)
```

Para esse exemplo, o algoritmo de loop aninhado usando condições empurradas para baixo protegidas parece assim:

```sql
FOR each row t1 in T1 such that C1(t1) {
  BOOL f1:=FALSE;
  FOR each row t2 in T2
      such that P1(t1,t2) AND (f1?C2(t2):TRUE) {
    BOOL f2:=FALSE;
    FOR each row t3 in T3
        such that P2(t2,t3) AND (f1&&f2?C3(t3):TRUE) {
      IF (f1&&f2?TRUE:(C2(t2) AND C3(t3))) {
        t:=t1||t2||t3; OUTPUT t;
      }
      f2=TRUE;
      f1=TRUE;
    }
    IF (!f2) {
      IF (f1?TRUE:C2(t2) && P(t1,t2,NULL)) {
        t:=t1||t2||NULL; OUTPUT t;
      }
      f1=TRUE;
    }
  }
  IF (!f1 && P(t1,NULL,NULL)) {
      t:=t1||NULL||NULL; OUTPUT t;
  }
}
```

Em geral, os predicados empurrados para baixo podem ser extraídos de condições de junção, como `P1(T1,T2)` e `P(T2,T3)`. Neste caso, um predicado empurrado para baixo é protegido também por uma bandeira que impede a verificação do predicado para a string completada pelo `NULL`, gerada pela operação de junção externa correspondente.

O acesso por chave de uma tabela interna para outra na mesma junção aninhada é proibido se for induzido por um predicado da condição do `WHERE`.

#### 8.2.1.8 Otimização de Conjunção Externa

As junções externas incluem `LEFT JOIN` e `RIGHT JOIN`.

O MySQL implementa um `A LEFT JOIN B join_specification` da seguinte forma:

* A tabela *`B`* está definida para depender da tabela *`A`* e de todas as tabelas nas quais *`A`* depende.

* A tabela *`A`* está definida para depender de todas as tabelas (exceto *`B`*) que são utilizadas na condição `LEFT JOIN`.

* A condição `LEFT JOIN` é usada para decidir como recuperar strings da tabela *`B`*. (Em outras palavras, qualquer condição na cláusula `WHERE` não é usada.)

* Todas as otimizações padrão de junção são realizadas, com exceção de que uma tabela é sempre lida após todas as tabelas nas quais ela depende. Se houver uma dependência circular, ocorre um erro.

* Todas as otimizações padrão do `WHERE` são realizadas.

* Se houver uma string em *`A`* que corresponda à cláusula `WHERE`, mas não houver uma string em *`B`* que corresponda à condição `ON`, uma string extra *`B`* é gerada com todas as colunas definidas como `NULL`.

* Se você usar `LEFT JOIN` para encontrar strings que não existem em alguma tabela e você tiver o seguinte teste: `col_name IS NULL` na parte `WHERE`, onde *`NOT NULL`* é uma coluna declarada como `NOT NULL`, o MySQL para de procurar mais strings (para uma combinação de chave particular) depois de encontrar uma string que corresponde à condição `LEFT JOIN`.

A implementação do `RIGHT JOIN` é análoga à do `LEFT JOIN`, com as tabelas trocadas de posição. As junções direitas são convertidas em junções equivalentes à esquerda, conforme descrito na Seção 8.2.1.9, “Simplificação de Junção Externa”.

Para um `LEFT JOIN`, se a condição `WHERE` sempre for falsa para a string gerada `NULL`, o `LEFT JOIN` é alterado para uma junção interna. Por exemplo, a cláusula `WHERE` seria falsa na seguinte consulta se `t2.column1` fosse `NULL`:

```sql
SELECT * FROM t1 LEFT JOIN t2 ON (column1) WHERE t2.column2=5;
```

Portanto, é seguro converter a consulta em uma junção interna:

```sql
SELECT * FROM t1, t2 WHERE t2.column2=5 AND t1.column1=t2.column1;
```

Agora, o otimizador pode usar a tabela `t2` antes da tabela `t1` se isso resultar em um plano de consulta melhor. Para fornecer uma dica sobre a ordem de junção da tabela, use `STRAIGHT_JOIN`; veja Seção 13.2.9, “Instrução SELECT”. No entanto, `STRAIGHT_JOIN` pode impedir que índices sejam usados porque desativa transformações de junção parcial; veja Seção 8.2.2.1, “Otimizando subconsultas, tabelas derivadas e referências de visão com transformações de junção parcial”.

#### 8.2.1.9 Simplificação da Conjunção Externa

As expressões de tabela na cláusula `FROM` de uma consulta são simplificadas em muitos casos.

Na fase de análise, as consultas com operações de junção externa direita são convertidas em consultas equivalentes que contêm apenas operações de junção esquerda. No caso geral, a conversão é realizada de tal forma que essa junção direita:

```sql
(T1, ...) RIGHT JOIN (T2, ...) ON P(T1, ..., T2, ...)
```

Torna-se este um join esquerdo equivalente:

```sql
(T2, ...) LEFT JOIN (T1, ...) ON P(T1, ..., T2, ...)
```

Todas as expressões de junção interna na forma `T1 INNER JOIN T2 ON P(T1,T2)` são substituídas pela lista `T1,T2`, sendo `P(T1,T2)` unido como conjunto à condição `WHERE` (ou à condição de junção da junção incorporada, se houver).

Quando o otimizador avalia os planos para operações de junção externa, ele leva em consideração apenas os planos em que, para cada operação desse tipo, as tabelas externas são acessadas antes das tabelas internas. As escolhas do otimizador são limitadas porque apenas esses planos permitem que as junções externas sejam executadas usando o algoritmo de laço aninhado.

Considere uma consulta dessa forma, onde `R(T2)` reduz significativamente o número de strings correspondentes da tabela `T2`:

```sql
SELECT * T1 FROM T1
  LEFT JOIN T2 ON P1(T1,T2)
  WHERE P(T1,T2) AND R(T2)
```

Se a consulta for executada conforme escrito, o otimizador não tem outra escolha senão acessar a tabela menos restrita `T1` antes da tabela mais restrita `T2`, o que pode produzir um plano de execução muito ineficiente.

Em vez disso, o MySQL converte a consulta em uma consulta sem operação de junção externa se a condição `WHERE` for rejeitada como nula. (Ou seja, ele converte a junção externa em uma junção interna.) Uma condição é considerada rejeitada como nula para uma operação de junção externa se for avaliada como `FALSE` ou `UNKNOWN` para qualquer string `NULL` completada gerada para a operação.

Assim, para esta junção externa:

```sql
T1 LEFT JOIN T2 ON T1.A=T2.A
```

Condições como essas são rejeitadas porque não podem ser verdadeiras para qualquer string `NULL` (com as colunas `T2` definidas como `NULL`):

```sql
T2.B IS NOT NULL
T2.B > 3
T2.C <= T1.C
T2.B < 2 OR T2.C > 1
```

Condições como essas não são rejeitadas como nulas porque podem ser verdadeiras para uma string `NULL` complementada:

```sql
T2.B IS NULL
T1.B < 3 OR T2.B IS NOT NULL
T1.B < 3 OR T2.B > 3
```

As regras gerais para verificar se uma condição é rejeitada por nulidade em uma operação de junção externa são simples:

* É da forma `A IS NOT NULL`, onde `A` é um atributo de qualquer uma das tabelas internas

* É um predicado que contém uma referência a uma tabela interna que é avaliada como `UNKNOWN` quando um de seus argumentos é `NULL`

* É uma conjunção que contém uma condição rejeitada como conjunto

* É uma disjunção de condições rejeitadas como nulos

Uma condição pode ser rejeitada como nula em uma operação de junção externa em uma consulta e não ser rejeitada como nula em outra. Nesta consulta, a condição `WHERE` é rejeitada como nula na segunda operação de junção externa, mas não é rejeitada como nula na primeira:

```sql
SELECT * FROM T1 LEFT JOIN T2 ON T2.A=T1.A
                 LEFT JOIN T3 ON T3.B=T1.B
  WHERE T3.C > 0
```

Se a condição `WHERE` for rejeitada por nulo para uma operação de junção externa em uma consulta, a operação de junção externa é substituída por uma operação de junção interna.

Por exemplo, na consulta anterior, a segunda junção externa é rejeitada e pode ser substituída por uma junção interna:

```sql
SELECT * FROM T1 LEFT JOIN T2 ON T2.A=T1.A
                 INNER JOIN T3 ON T3.B=T1.B
  WHERE T3.C > 0
```

Para a consulta original, o otimizador avalia apenas os planos compatíveis com a ordem de acesso à tabela única `T1,T2,T3`. Para a consulta reescrita, ele considera adicionalmente a ordem de acesso `T3,T1,T2`.

Uma conversão de uma operação de junção externa pode desencadear a conversão de outra. Assim, a consulta:

```sql
SELECT * FROM T1 LEFT JOIN T2 ON T2.A=T1.A
                 LEFT JOIN T3 ON T3.B=T2.B
  WHERE T3.C > 0
```

É convertido primeiro na consulta:

```sql
SELECT * FROM T1 LEFT JOIN T2 ON T2.A=T1.A
                 INNER JOIN T3 ON T3.B=T2.B
  WHERE T3.C > 0
```

Que é equivalente à consulta:

```sql
SELECT * FROM (T1 LEFT JOIN T2 ON T2.A=T1.A), T3
  WHERE T3.C > 0 AND T3.B=T2.B
```

A operação de junção externa restante também pode ser substituída por uma junção interna, pois a condição `T3.B=T2.B` é rejeitada como nula. Isso resulta em uma consulta sem nenhuma junção externa:

```sql
SELECT * FROM (T1 INNER JOIN T2 ON T2.A=T1.A), T3
  WHERE T3.C > 0 AND T3.B=T2.B
```

Às vezes, o otimizador consegue substituir uma operação de junção externa embutida, mas não consegue converter a junção externa embutida. A seguinte consulta:

```sql
SELECT * FROM T1 LEFT JOIN
              (T2 LEFT JOIN T3 ON T3.B=T2.B)
              ON T2.A=T1.A
  WHERE T3.C > 0
```

É convertido em:

```sql
SELECT * FROM T1 LEFT JOIN
              (T2 INNER JOIN T3 ON T3.B=T2.B)
              ON T2.A=T1.A
  WHERE T3.C > 0
```

Isso só pode ser reescrito na forma que ainda contém a operação de junção externa incorporada:

```sql
SELECT * FROM T1 LEFT JOIN
              (T2,T3)
              ON (T2.A=T1.A AND T3.B=T2.B)
  WHERE T3.C > 0
```

Qualquer tentativa de converter uma operação de junção externa embutida em uma consulta deve levar em consideração a condição de junção da junção externa embutida juntamente com a condição `WHERE`. Nesta consulta, a condição `WHERE` não é rejeitada como nula para a junção externa embutida, mas a condição de junção da junção externa embutida `T2.A=T1.A AND T3.C=T1.C` é rejeitada como nula:

```sql
SELECT * FROM T1 LEFT JOIN
              (T2 LEFT JOIN T3 ON T3.B=T2.B)
              ON T2.A=T1.A AND T3.C=T1.C
  WHERE T3.D > 0 OR T1.D > 0
```

Consequentemente, a consulta pode ser convertida em:

```sql
SELECT * FROM T1 LEFT JOIN
              (T2, T3)
              ON T2.A=T1.A AND T3.C=T1.C AND T3.B=T2.B
  WHERE T3.D > 0 OR T1.D > 0
```

#### 8.2.1.10 Otimização da leitura em várias faixas de faixa
#### 8.2.1.11 Otimização da leitura em várias faixas de faixa

Ler strings usando uma varredura de intervalo em um índice secundário pode resultar em muitos acessos aleatórios ao disco na tabela base quando a tabela é grande e não está armazenada no cache do mecanismo de armazenamento. Com a otimização de Leitura Multi-Intervalo de Varredura em Disco (MRR), o MySQL tenta reduzir o número de acessos aleatórios ao disco para varreduras de intervalo, primeiro verificando o índice apenas e coletando as chaves para as strings relevantes. Em seguida, as chaves são ordenadas e, finalmente, as strings são recuperadas da tabela base usando a ordem da chave primária. A motivação do MRR de varredura em disco é reduzir o número de acessos aleatórios ao disco e, em vez disso, alcançar uma varredura mais sequencial dos dados da tabela base.

A otimização da leitura de Multi-Range oferece esses benefícios:

* O MRR permite que as strings de dados sejam acessadas sequencialmente, em vez de em ordem aleatória, com base em tuplas de índice. O servidor obtém um conjunto de tuplas de índice que satisfazem as condições da consulta, as ordena de acordo com a ordem do ID da string de dados e usa as tuplas ordenadas para recuperar as strings de dados em ordem. Isso torna o acesso aos dados mais eficiente e menos caro.

* O MRR permite o processamento em lote de solicitações de acesso a chaves para operações que exigem acesso a strings de dados por meio de tuplas de índice, como varreduras de índice de intervalo e equi-joins que utilizam um índice para o atributo de junção. O MRR itera sobre uma sequência de intervalos de índice para obter tuplas de índice qualificadoras. À medida que esses resultados se acumulam, eles são usados para acessar as strings de dados correspondentes. Não é necessário adquirir todos os tuplos de índice antes de começar a ler as strings de dados.

A otimização do MRR não é suportada com índices secundários criados em colunas geradas virtualmente. `InnoDB` suporta índices secundários em colunas geradas virtualmente.

Os seguintes cenários ilustram quando a otimização do MRR pode ser vantajosa:

Cenário A: O MRR pode ser usado para as tabelas `InnoDB` e `MyISAM` para varreduras de intervalo de índice e operações de equi-join.

1. Uma porção dos tuplos do índice é acumulada em um buffer.

2. Os tuplos no buffer são ordenados por seu ID de string de dados.

3. As strings de dados são acessadas de acordo com a sequência do tuplo de índice ordenado.

Cenário B: O MRR pode ser usado para tabelas `NDB` para varreduras de índice de múltiplo alcance ou quando se realiza uma junção equi por um atributo.

1. Uma porção de intervalos, possivelmente intervalos de chave única, é acumulada em um buffer no nó central onde a consulta é enviada.

2. As faixas são enviadas aos nós de execução que acessam as strings de dados.

3. As strings acessadas são embaladas em pacotes e enviadas de volta ao nó central.

4. Os pacotes recebidos com strings de dados são colocados em um buffer.

5. As strings de dados são lidas do buffer.

Quando o MRR é utilizado, a coluna `Extra` na saída `EXPLAIN` mostra `Using MRR`.

`InnoDB` e `MyISAM` não utilizam MRR se não for necessário acessar strings inteiras da tabela para produzir o resultado da consulta. Esse é o caso se os resultados puderem ser produzidos inteiramente com base nas informações dos tuplos do índice (através de um índice de cobertura); o MRR não oferece nenhum benefício.

Duas `optimizer_switch` variáveis de sistema fornecem uma interface para o uso da otimização MRR. A `mrr` flag controla se o MRR está habilitado. Se `mrr` está habilitado (`on`), a `mrr_cost_based` flag controla se o otimizador tenta fazer uma escolha baseada no custo entre usar e não usar MRR (`on`) ou usa MRR sempre que possível (`off`). Por padrão, `mrr` é `on` e `mrr_cost_based` é `on`. Veja a Seção 8.9.2, “Otimizações Desconectables”.

Para o MRR, um motor de armazenamento usa o valor da variável de sistema `read_rnd_buffer_size` como uma orientação sobre quanto memória pode alocar para seu buffer. O motor usa até `read_rnd_buffer_size` bytes e determina o número de intervalos a serem processados em uma única passagem.

#### 8.2.1.11 Conjuntos de acesso a chave em lote e junções de laço aninhado em bloco

Em MySQL, está disponível um algoritmo de Acesso de Chave em Batel (BKA, na sigla em inglês) que utiliza tanto o acesso ao índice da tabela unificada quanto um buffer de junção. O algoritmo BKA suporta operações de junção interna, externa e semijunção, incluindo junções externas aninhadas. As vantagens do BKA incluem um desempenho de junção melhorado devido à varredura de tabela mais eficiente. Além disso, o algoritmo de Junção Bloco em Loop (BNL, na sigla em inglês) anteriormente usado apenas para junções internas é ampliado e pode ser empregado para operações de junção externa e semijunção, incluindo junções externas aninhadas.

As seções a seguir discutem a gestão do buffer de junção que está por trás da extensão do algoritmo original BNL, o algoritmo BNL estendido e o algoritmo BKA. Para informações sobre estratégias de semijoin, consulte a Seção 8.2.2.1, “Otimizando subconsultas, tabelas derivadas e referências de visão com transformações de semijoin”

* Participe da Gerenciamento de Buffer para Algoritmos de Acesso a Chave em Lote e em Lote de Nó Inzado

* Algoritmo de laço aninhado para junções externas e semijoin
* Junções de acesso a chave em lote
* Dicas de otimizador para algoritmos de laço aninhado em bloco e junções de acesso a chave em lote

##### Junte-se à Gerenciamento de Buffer para Algoritmos de Acesso a Chave em Bloco de Nó e em Batel

O MySQL pode empregar tampões de junção para executar não apenas junções internas sem acesso ao índice da tabela interna, mas também junções externas e semijoções que aparecem após o achatamento de subconsultas. Além disso, um buffer de junção pode ser efetivamente usado quando há acesso ao índice da tabela interna.

O código de gerenciamento do buffer de junção utiliza de forma um pouco mais eficiente o espaço do buffer de junção ao armazenar os valores das colunas das strings de interesse: não são alocados bytes adicionais nos buffers para uma coluna de string se seu valor for `NULL`, e o número mínimo de bytes é alocado para qualquer valor do tipo `VARCHAR`.

O código suporta dois tipos de buffers, regulares e incrementais. Suponha que o buffer de junção `B1` seja empregado para unir as tabelas `t1` e `t2` e o resultado dessa operação seja unido com a tabela `t3` usando o buffer de junção `B2`:

* Um buffer de junção regular contém colunas de cada operando de junção. Se `B2` é um buffer de junção regular, cada string *`r`* inserida em `B2` é composta pelas colunas de uma string *`r1`* de `B1` e pelas colunas de interesse de uma string correspondente *`r2`* da tabela `t3`.

* Um buffer de junção incremental contém apenas as colunas das strings da tabela produzida pelo segundo operador de junção. Isso significa que é incremental em relação a uma string do buffer do primeiro operador. Se `B2` for um buffer de junção incremental, ele contém as colunas interessantes da string *`r2`* juntamente com um link para a string *`r1`* de `B1`.

Os buffers de junção incremental são sempre incrementais em relação a um buffer de junção de uma operação de junção anterior, portanto, o buffer do primeiro processo de junção é sempre um buffer regular. No exemplo que foi dado, o buffer `B1` usado para unir as tabelas `t1` e `t2` deve ser um buffer regular.

Cada string do buffer incremental utilizado para uma operação de junção contém apenas as colunas interessantes de uma string da tabela que será juncionada. Essas colunas são aumentadas com uma referência às colunas interessantes da string correspondente da tabela produzida pelo primeiro operador de junção. Várias strings no buffer incremental podem se referir à mesma string *`r`* cujas colunas são armazenadas nos buffers de junção anteriores, na medida em que todas essas strings correspondem à string *`r`*.

Os buffers incrementais permitem uma cópia menos frequente de colunas dos buffers utilizados para operações de junção anteriores. Isso proporciona uma economia de espaço no buffer, pois, no caso geral, uma string produzida pelo primeiro operador de junção pode ser correspondida por várias strings produzidas pelo segundo operador de junção. Não é necessário fazer várias cópias de uma string do primeiro operador. Os buffers incrementais também proporcionam uma economia de tempo de processamento devido à redução do tempo de cópia.

As bandeiras `block_nested_loop` e `batched_key_access` da variável de sistema `optimizer_switch` controlam como o otimizador usa os algoritmos de junção de Bloco de Repetição Aninhada e Acesso a Chave em Batel. Por padrão, `block_nested_loop` é `on` e `batched_key_access` é `off`. Veja a Seção 8.9.2, “Otimizações Desconectables”. Também podem ser aplicadas dicas do otimizador; veja Dicas do Otimizador para Algoritmos de Bloco de Repetição Aninhada e Acesso a Chave em Batel.

Para informações sobre estratégias de semijoin, consulte a Seção 8.2.2.1, “Otimizando subconsultas, tabelas derivadas e referências de visão com transformações semijoin”

##### Algoritmo de Bloco de Percurso Aninhado para Conjunções Externas e Semiconjunções

A implementação original do algoritmo BNL do MySQL é estendida para suportar operações de junção externa e semijoin.

Quando essas operações são executadas com um buffer de junção, cada string colocada no buffer é fornecida com uma bandeira de correspondência.

Se uma operação de junção externa for executada usando um buffer de junção, cada string da tabela produzida pelo segundo operador é verificada para uma correspondência com cada string no buffer de junção. Quando uma correspondência é encontrada, uma nova string estendida é formada (a string original mais as colunas do segundo operador) e enviada para extensões adicionais pelas operações de junção restantes. Além disso, a bandeira de correspondência da string correspondente no buffer é ativada. Após todas as strings da tabela a ser juncionada terem sido examinadas, o buffer de junção é verificado. Cada string do buffer que não tenha sua bandeira de correspondência ativada é estendida por complementos `NULL` (valores `NULL` para cada coluna no segundo operador) e enviada para extensões adicionais pelas operações de junção restantes.

A bandeira `block_nested_loop` da variável de sistema `optimizer_switch` controla como o otimizador utiliza o algoritmo de laço aninhado de bloco. Por padrão, `block_nested_loop` é `on`. Veja a Seção 8.9.2, “Otimizações Desconectables”. Também podem ser aplicadas dicas do otimizador; veja Dicas do Otimizador para algoritmos de acesso a chave em lote e laço aninhado de bloco.

Na saída `EXPLAIN`, o uso de BNL para uma tabela é indicado quando o valor `Extra` contém `Using join buffer (Block Nested Loop)` e o valor `type` é `ALL`, `index` ou `range`.

Alguns casos que envolvem a combinação de uma ou mais subconsultas com uma ou mais junções esquerdas, especialmente aqueles que retornam muitas strings, podem usar BNL, mesmo que não seja ideal nesses casos. Esse é um problema conhecido que é corrigido no MySQL 8.0. Se a atualização do MySQL não for imediatamente viável para você, você pode desejar desativar o BNL enquanto isso, definindo `optimizer_switch='block_nested_loop=off'` ou empregando a dica de otimizador `NO_BNL` para permitir que o otimizador escolha um plano melhor, usando uma ou mais dicas de índice (consulte Seção 8.9.4, “Dicas de índice”), ou alguma combinação dessas, para melhorar o desempenho dessas consultas.

Para informações sobre estratégias de semijoin, consulte a Seção 8.2.2.1, “Otimizando subconsultas, tabelas derivadas e referências de visão com transformações semijoin”

Juntas de Acesso Chave em Massa ##### Batched Key Access Joins

O MySQL implementa um método de junção de tabelas chamado algoritmo de acesso por chave em lote (BKA, na sigla em inglês). O BKA pode ser aplicado quando há um acesso ao índice da tabela produzido pelo segundo operador de junção. Assim como o algoritmo de junção BNL, o algoritmo de junção BKA emprega um buffer de junção para acumular as colunas interessantes das strings produzidas pelo primeiro operador da operação de junção. Em seguida, o algoritmo BKA constrói chaves para acessar a tabela a ser juncionada para todas as strings no buffer e envia essas chaves em um lote para o motor do banco de dados para buscas de índice. As chaves são enviadas ao motor através da interface de leitura de várias faixas (MRR, na sigla em inglês) (ver Seção 8.2.1.10, “Otimização da Leitura de Várias Faixas”). Após a submissão das chaves, as funções do motor MRR realizam buscas no índice de maneira otimizada, obtendo as strings da tabela juncionada encontradas por essas chaves e começa a alimentar o algoritmo de junção BKA com strings correspondentes. Cada string correspondente é acoplada com uma referência a uma string no buffer de junção.

Quando o BKA é usado, o valor de `join_buffer_size` define o tamanho do lote de chaves em cada solicitação ao motor de armazenamento. Quanto maior o buffer, mais acesso sequencial é feito à tabela direita de uma operação de junção, o que pode melhorar significativamente o desempenho.

Para que o BKA seja utilizado, a bandeira `batched_key_access` da variável de sistema `optimizer_switch` deve ser definida como `on`. O BKA utiliza MRR, portanto, a bandeira `mrr` também deve ser `on`. Atualmente, a estimativa de custo para MRR é muito pessimista. Portanto, também é necessário que `mrr_cost_based` seja `off` para que o BKA seja utilizado. O seguinte ajuste permite o BKA:

```sql
mysql> SET optimizer_switch='mrr=on,mrr_cost_based=off,batched_key_access=on';
```

Existem dois cenários pelos quais os MRR funcionam:

* O primeiro cenário é utilizado para motores de armazenamento baseados em disco convencional, como `InnoDB` e `MyISAM`. Para esses motores, geralmente as chaves de todas as strings do buffer de junção são enviadas para a interface MRR de uma vez. As funções MRR específicas do motor realizam pesquisas de índice para as chaves enviadas, obtêm IDs de string (ou chaves primárias) a partir delas e, em seguida, buscam strings para todos esses IDs de string selecionados um a um por solicitação do algoritmo BKA. Cada string é devolvida com uma referência de associação que permite o acesso à string correspondente no buffer de junção. As strings são obtidas pelas funções MRR de uma maneira otimizada: são obtidas na ordem do ID de string (chave primária). Isso melhora o desempenho porque as leituras são em ordem de disco em vez de ordem aleatória.

* O segundo cenário é utilizado para motores de armazenamento remoto, como `NDB`. Um pacote de chaves para uma porção de strings do buffer de junção, juntamente com suas associações, é enviado por um servidor MySQL (nó SQL) para os nós de dados do NDB Cluster. Em troca, o nó SQL recebe um pacote (ou vários pacotes) de strings correspondentes acopladas com as associações correspondentes. O algoritmo de junção BKA toma essas strings e constrói novas strings juncionadas. Em seguida, um novo conjunto de chaves é enviado para os nós de dados e as strings dos pacotes retornados são usadas para construir novas strings juncionadas. O processo continua até que as últimas chaves do buffer de junção sejam enviadas para os nós de dados, e o nó SQL tenha recebido e juncionado todas as strings que correspondem a essas chaves. Isso melhora o desempenho, pois menos pacotes que carregam chaves enviados pelo nó SQL para os nós de dados significa menos viagens entre ele e os nós de dados para realizar a operação de junção.

No primeiro cenário, uma parte do buffer de junção é reservada para armazenar IDs de string (chaves primárias) selecionados por pesquisas de índice e passados como um parâmetro para as funções MRR.

Não há um buffer especial para armazenar chaves construídas para as strings do buffer de junção. Em vez disso, uma função que constrói a chave para a próxima string no buffer é passada como um parâmetro para as funções MRR.

Na saída `EXPLAIN`, o uso de BKA para uma tabela é indicado quando o valor `Extra` contém `Using join buffer (Batched Key Access)` e o valor `type` é `ref` ou `eq_ref`.

##### Dicas de otimização para algoritmos de acesso a chave em lote e de busca em laço aninhado

Além de usar a variável de sistema `optimizer_switch` para controlar o uso do otimizador dos algoritmos BNL e BKA em nível de sessão, o MySQL suporta dicas de otimizador para influenciar o otimizador em uma base por declaração. Veja a Seção 8.9.3, “Dicas de Otimizador”.

Para usar uma dica do BNL ou do BKA para habilitar o bufferamento de junção para qualquer tabela interna de uma junção externa, o bufferamento de junção deve ser habilitado para todas as tabelas internas da junção externa.

#### 8.2.1.12 Filtragem de Condição

No processamento de junção, as strings prefixadas são aquelas strings passadas de uma tabela em uma junção para a próxima. Em geral, o otimizador tenta colocar tabelas com baixo número de prefixos no início da ordem de junção para evitar que o número de combinações de strings aumente rapidamente. Na medida em que o otimizador pode usar informações sobre condições em strings selecionadas de uma tabela e passadas para a próxima, mais precisamente ele pode calcular estimativas de strings e escolher o melhor plano de execução.

Sem filtragem condicional, o número de strings do prefixo para uma tabela é baseado no número estimado de strings selecionadas pela cláusula `WHERE`, de acordo com o método de acesso que o otimizador escolher. A filtragem condicional permite que o otimizador use outras condições relevantes na cláusula `WHERE` que não são levadas em conta pelo método de acesso, e assim melhore suas estimativas de número de strings do prefixo. Por exemplo, embora possa haver um método de acesso baseado em índice que pode ser usado para selecionar strings da tabela atual em uma junção, também pode haver condições adicionais para a tabela na cláusula `WHERE` que podem filtrar (restrição adicional) a estimativa para as strings qualificadas passadas para a próxima tabela.

Uma condição contribui para a estimativa de filtragem apenas se:

* Se refere à tabela atual. * Depende de um valor constante ou de valores de tabelas anteriores na sequência de junção.

* Não foi levada em conta pelo método de acesso.

Na saída de `EXPLAIN`, a coluna `rows` indica a estimativa da string para o método de acesso escolhido, e a coluna `filtered` reflete o efeito do filtro de condição. Os valores de `filtered` são expressos como porcentagem. O valor máximo é de 100, o que significa que não houve filtragem de strings. Valores que diminuem de 100 indicam quantidades crescentes de filtragem.

O número de strings prefixado (o número de strings estimadas para serem passadas da tabela atual em uma junção para a próxima) é o produto dos valores de `rows` e `filtered`. Ou seja, o número de strings prefixado é o número de strings estimado, reduzido pelo efeito de filtragem estimado. Por exemplo, se `rows` é 1000 e `filtered` é 20%, o filtragem condicional reduz o número de strings estimado de 1000 a um número de strings prefixado de 1000 × 20% = 1000 × .2 = 200.

Considere a seguinte consulta:

```sql
SELECT *
  FROM employee JOIN department ON employee.dept_no = department.dept_no
  WHERE employee.first_name = 'John'
  AND employee.hire_date BETWEEN '2018-01-01' AND '2018-06-01';
```

Suponha que o conjunto de dados tenha essas características:

* A tabela `employee` tem 1024 strings.
* A tabela `department` tem 12 strings.
* Ambas as tabelas têm um índice em `dept_no`.
* A tabela `employee` tem um índice em `first_name`.

* 8 strings satisfazem essa condição em `employee.first_name`:

  ```sql
  employee.first_name = 'John'
  ```

* 150 strings satisfazem essa condição em `employee.hire_date`:

  ```sql
  employee.hire_date BETWEEN '2018-01-01' AND '2018-06-01'
  ```

* 1 string satisfaz ambas as condições:

  ```sql
  employee.first_name = 'John'
  AND employee.hire_date BETWEEN '2018-01-01' AND '2018-06-01'
  ```

Sem filtragem condicional, `EXPLAIN` produz uma saída como esta:

```sql
+----+------------+--------+------------------+---------+---------+------+----------+
| id | table      | type   | possible_keys    | key     | ref     | rows | filtered |
+----+------------+--------+------------------+---------+---------+------+----------+
| 1  | employee   | ref    | name,h_date,dept | name    | const   | 8    | 100.00   |
| 1  | department | eq_ref | PRIMARY          | PRIMARY | dept_no | 1    | 100.00   |
+----+------------+--------+------------------+---------+---------+------+----------+
```

Para `employee`, o método de acesso no índice `name` coleta as 8 strings que correspondem a um nome de `'John'`. Não há filtragem (`filtered` é 100%), portanto, todas as strings são strings prefixadas para a próxima tabela: O número de strings prefixadas é `rows` × `filtered` = 8 × 100% = 8.

Com o filtro de condições, o otimizador também leva em consideração as condições da cláusula `WHERE`, que não são consideradas pelo método de acesso. Neste caso, o otimizador utiliza heurísticas para estimar um efeito de filtragem de 16,31% para a condição `BETWEEN` em `employee.hire_date`. Como resultado, `EXPLAIN` produz uma saída como esta:

```sql
+----+------------+--------+------------------+---------+---------+------+----------+
| id | table      | type   | possible_keys    | key     | ref     | rows | filtered |
+----+------------+--------+------------------+---------+---------+------+----------+
| 1  | employee   | ref    | name,h_date,dept | name    | const   | 8    | 16.31    |
| 1  | department | eq_ref | PRIMARY          | PRIMARY | dept_no | 1    | 100.00   |
+----+------------+--------+------------------+---------+---------+------+----------+
```

Agora, o número de contagem de prefixo é `rows` × `filtered` = 8 × 16,31% = 1,3, o que reflete mais fielmente o conjunto de dados reais.

Normalmente, o otimizador não calcula o efeito de filtragem de condição (redução do número de strings de pré-pré) para a última tabela associada, porque não há próxima tabela para passar as strings. Uma exceção ocorre para `EXPLAIN`: Para fornecer mais informações, o efeito de filtragem é calculado para todas as tabelas associadas, incluindo a última.

Para controlar se o otimizador considera condições de filtragem adicionais, use a bandeira `condition_fanout_filter` da variável de sistema `optimizer_switch` (consulte Seção 8.9.2, “Otimizações Desconectables”). Essa bandeira é ativada por padrão, mas pode ser desativada para suprimir o filtragem das condições (por exemplo, se uma consulta específica for encontrada para produzir um melhor desempenho sem ela).

Se o otimizador superestimar o efeito do filtro de condição, o desempenho pode ser pior do que se o filtro de condição não fosse usado. Nesses casos, essas técnicas podem ajudar:

* Se uma coluna não estiver indexada, indexe-a para que o otimizador tenha alguma informação sobre a distribuição dos valores da coluna e possa melhorar suas estimativas de string.

* Altere a ordem de junção. As formas de realizar isso incluem dicas de otimização de ordem de junção (consulte Seção 8.9.3, “Dicas de otimizador”), `STRAIGHT_JOIN` imediatamente após o `SELECT`, e o operador de junção `STRAIGHT_JOIN`.

* Desative a filtragem de condições para a sessão:

  ```sql
  SET optimizer_switch = 'condition_fanout_filter=off';
  ```

#### 8.2.1.13 Otimização de IS NULL

O MySQL pode realizar a mesma otimização no *`col_name`* `IS NULL` que pode usar para *`col_name`* `=` *`constant_value`*. Por exemplo, o MySQL pode usar índices e faixas para procurar `NULL` com `IS NULL`.

Exemplos:

```sql
SELECT * FROM tbl_name WHERE key_col IS NULL;

SELECT * FROM tbl_name WHERE key_col <=> NULL;

SELECT * FROM tbl_name
  WHERE key_col=const1 OR key_col=const2 OR key_col IS NULL;
```

Se uma cláusula `WHERE` incluir uma condição *`col_name`* `IS NULL` para uma coluna declarada como `NOT NULL`, essa expressão é otimizada. Essa otimização não ocorre em casos em que a coluna pode produzir `NULL` de qualquer maneira (por exemplo, se ela vem de uma tabela do lado direito de um `LEFT JOIN`).

O MySQL também pode otimizar a combinação `col_name = expr OR col_name IS NULL`, um formulário que é comum em subconsultas resolvidas. `EXPLAIN` mostra `ref_or_null` quando essa otimização é usada.

Essa otimização pode lidar com um `IS NULL` para qualquer peça chave.

Alguns exemplos de consultas que são otimizadas, assumindo que há um índice nas colunas `a` e `b` da tabela `t2`:

```sql
SELECT * FROM t1 WHERE t1.a=expr OR t1.a IS NULL;

SELECT * FROM t1, t2 WHERE t1.a=t2.a OR t2.a IS NULL;

SELECT * FROM t1, t2
  WHERE (t1.a=t2.a OR t2.a IS NULL) AND t2.b=t1.b;

SELECT * FROM t1, t2
  WHERE t1.a=t2.a AND (t2.b=t1.b OR t2.b IS NULL);

SELECT * FROM t1, t2
  WHERE (t1.a=t2.a AND t2.a IS NULL AND ...)
  OR (t1.a=t2.a AND t2.a IS NULL AND ...);
```

`ref_or_null` funciona fazendo uma leitura na chave de referência e, em seguida, uma busca separada por strings com um valor de chave `NULL`.

A otimização pode lidar apenas com um nível `IS NULL`. Na consulta a seguir, o MySQL usa buscas por chave apenas na expressão `(t1.a=t2.a AND t2.a IS NULL)` e não é capaz de usar a parte da chave em `b`:

```sql
SELECT * FROM t1, t2
  WHERE (t1.a=t2.a AND t2.a IS NULL)
  OR (t1.b=t2.b AND t2.b IS NULL);
```

#### 8.2.1.14 ORDEM POR Otimização

Esta seção descreve quando o MySQL pode usar um índice para satisfazer uma cláusula `ORDER BY`, a operação `filesort` usada quando um índice não pode ser usado, e as informações do plano de execução disponíveis do otimizador sobre `ORDER BY`.

Um `ORDER BY` com e sem `LIMIT` pode retornar strings em diferentes ordens, conforme discutido na Seção 8.2.1.17, “Otimização da consulta LIMIT”.

* Uso de índices para satisfazer ORDER BY
* Uso de filesort para satisfazer ORDER BY
* Influenciando a otimização de ORDER BY
* Informações sobre o plano de execução de ORDER BY disponíveis

##### Uso de índices para satisfazer a cláusula ORDER BY

Em alguns casos, o MySQL pode usar um índice para satisfazer uma cláusula `ORDER BY` e evitar a ordenação extra envolvida na realização de uma operação `filesort`.

O índice também pode ser usado mesmo se o `ORDER BY` não corresponder ao índice exatamente, desde que todas as partes não utilizadas do índice e todas as colunas extras do `ORDER BY` sejam constantes na cláusula `WHERE`. Se o índice não contiver todas as colunas acessadas pela consulta, o índice é usado apenas se o acesso ao índice for mais barato do que outros métodos de acesso.

Supondo que haja um índice em `(key_part1, key_part2)`, as seguintes consultas podem usar o índice para resolver a parte `ORDER BY`. Se o otimizador realmente fizer isso, depende de ler o índice ser mais eficiente do que um varrido de tabela se as colunas que não estão no índice também devem ser lidas.

* Nesta consulta, o índice em `(key_part1, key_part2)` permite que o otimizador evite a ordenação:

  ```sql
  SELECT * FROM t1
    ORDER BY key_part1, key_part2;
  ```

No entanto, a consulta utiliza `SELECT *`, que pode selecionar mais colunas do que *`key_part1`* e *`key_part2`*. Nesse caso, digitalizar um índice inteiro e procurar strings de tabela para encontrar colunas que não estão no índice pode ser mais caro do que digitalizar a tabela e ordenar os resultados. Se assim for, o otimizador provavelmente não usará o índice. Se `SELECT *` selecionar apenas as colunas do índice, o índice é usado e a ordenação é evitada.

Se `t1` for uma tabela `InnoDB`, a chave primária da tabela faz parte implicitamente do índice, e o índice pode ser usado para resolver o `ORDER BY` para esta consulta:

  ```sql
  SELECT pk, key_part1, key_part2 FROM t1
    ORDER BY key_part1, key_part2;
  ```

* Nesta consulta, *`key_part1`* é constante, portanto, todas as strings acessadas através do índice estão na ordem de *`key_part2`*, e um índice em `(key_part1, key_part2)` evita a ordenação se a cláusula `WHERE` for seletiva o suficiente para fazer uma varredura de intervalo de índice mais barata do que uma varredura de tabela:

  ```sql
  SELECT * FROM t1
    WHERE key_part1 = constant
    ORDER BY key_part2;
  ```

* Nas próximas duas consultas, se o índice é usado é semelhante às mesmas consultas sem `DESC` mostrado anteriormente:

  ```sql
  SELECT * FROM t1
    ORDER BY key_part1 DESC, key_part2 DESC;

  SELECT * FROM t1
    WHERE key_part1 = constant
    ORDER BY key_part2 DESC;
  ```

* Nas próximas duas consultas, *`key_part1`* é comparado a uma constante. O índice é usado se a cláusula `WHERE` for seletiva o suficiente para tornar um varredura de intervalo de índice mais barata do que uma varredura de tabela:

  ```sql
  SELECT * FROM t1
    WHERE key_part1 > constant
    ORDER BY key_part1 ASC;

  SELECT * FROM t1
    WHERE key_part1 < constant
    ORDER BY key_part1 DESC;
  ```

* Na próxima consulta, o `ORDER BY` não nomeia *`key_part1`*, mas todas as strings selecionadas têm um valor constante *`key_part1`*, então o índice ainda pode ser usado:

  ```sql
  SELECT * FROM t1
    WHERE key_part1 = constant1 AND key_part2 > constant2
    ORDER BY key_part2;
  ```

Em alguns casos, o MySQL *não pode* usar índices para resolver o `ORDER BY`, embora ainda possa usar índices para encontrar as strings que correspondem à cláusula `WHERE`. Exemplos:

* A consulta utiliza `ORDER BY` em diferentes índices:

  ```sql
  SELECT * FROM t1 ORDER BY key1, key2;
  ```

* A consulta utiliza `ORDER BY` em partes não consecutivas de um índice:

  ```sql
  SELECT * FROM t1 WHERE key2=constant ORDER BY key1_part1, key1_part3;
  ```

* A consulta mistura `ASC` e `DESC`:

  ```sql
  SELECT * FROM t1 ORDER BY key_part1 DESC, key_part2 ASC;
  ```

* O índice usado para obter as strings difere do usado no `ORDER BY`:

  ```sql
  SELECT * FROM t1 WHERE key2=constant ORDER BY key1;
  ```

* A consulta utiliza `ORDER BY` com uma expressão que inclui termos além do nome da coluna do índice:

  ```sql
  SELECT * FROM t1 ORDER BY ABS(key);
  SELECT * FROM t1 ORDER BY -key;
  ```

* A consulta une muitas tabelas, e as colunas no `ORDER BY` não são todas da primeira tabela não constante que é usada para recuperar strings. (Esta é a primeira tabela na saída `EXPLAIN` que não tem um tipo de junção `const`.)

* A consulta tem diferentes expressões `ORDER BY` e `GROUP BY`.

* Há um índice apenas em um prefixo de uma coluna denominada na cláusula `ORDER BY`. Neste caso, o índice não pode ser usado para resolver completamente a ordem de classificação. Por exemplo, se apenas os primeiros 10 bytes de uma coluna `CHAR(20)` forem indexados, o índice não pode distinguir valores além do 10º byte e é necessário um `filesort`.

* O índice não armazena as strings em ordem. Por exemplo, isso é verdade para um índice `HASH` em uma tabela `MEMORY`.

A disponibilidade de um índice para classificação pode ser afetada pelo uso de aliases de coluna. Suponha que a coluna `t1.a` esteja indexada. Nesta declaração, o nome da coluna na lista de seleção é `a`. Ela se refere a `t1.a`, assim como a referência a `a` no `ORDER BY`, então o índice em `t1.a` pode ser usado:

```sql
SELECT a FROM t1 ORDER BY a;
```

Nesta declaração, o nome da coluna na lista de seleção também é `a`, mas é o nome do alias. Refere-se a `ABS(a)`, assim como a referência a `a` no `ORDER BY`, portanto, o índice em `t1.a` não pode ser usado:

```sql
SELECT ABS(a) AS a FROM t1 ORDER BY a;
```

Na seguinte declaração, o `ORDER BY` se refere a um nome que não é o nome de uma coluna na lista de seleção. Mas há uma coluna no `t1` chamada `a`, então o `ORDER BY` se refere a `t1.a` e o índice em `t1.a` pode ser usado. (O resultado da ordem de classificação pode ser completamente diferente da ordem para `ABS(a)`, é claro.)

```sql
SELECT ABS(a) AS b FROM t1 ORDER BY a;
```

Por padrão, o MySQL classifica as consultas `GROUP BY col1, col2, ...` como se você também tivesse incluído `ORDER BY col1, col2, ...` na consulta. Se você incluir uma cláusula explícita `ORDER BY` que contenha a mesma lista de colunas, o MySQL otimiza-a sem qualquer penalização de velocidade, embora a classificação ainda ocorra.

Se uma consulta incluir `GROUP BY`, mas você queira evitar o overhead de ordenar o resultado, pode suprimir a ordenação especificando `ORDER BY NULL`. Por exemplo:

```sql
INSERT INTO foo
SELECT a, COUNT(*) FROM bar GROUP BY a ORDER BY NULL;
```

O otimizador ainda pode optar por usar a classificação para implementar operações de agrupamento. `ORDER BY NULL` suprime a classificação do resultado, não a classificação anterior realizada por operações de agrupamento para determinar o resultado.

Nota

`GROUP BY` ordena implicitamente por padrão (ou seja, na ausência de `ASC` ou `DESC` designators para colunas `GROUP BY`). No entanto, confiar em ordenação `GROUP BY` implicitamente (ou seja, ordenação na ausência de `ASC` ou `DESC` designators) ou ordenação explícita para `GROUP BY` (ou seja, usando designators explícitos `ASC` ou `DESC` para colunas `GROUP BY` é desaconselhável. Para produzir um determinado ordem de classificação, forneça uma cláusula `ORDER BY`.

##### Uso do filesort para satisfazer a cláusula ORDER BY

Se um índice não puder ser usado para satisfazer uma cláusula de `ORDER BY`, o MySQL realiza uma operação de `filesort` que lê as strings da tabela e as ordena. Um `filesort` constitui uma fase de ordenação extra na execução da consulta.

Para obter memória para as operações do `filesort`, o otimizador aloca um valor fixo de `sort_buffer_size` bytes de antemão. As sessões individuais podem alterar o valor da variável deste modo, conforme desejado, para evitar o uso excessivo de memória, ou para alocar mais memória conforme necessário.

Uma operação `filesort` utiliza arquivos de disco temporários, se necessário, se o conjunto de resultados for muito grande para caber na memória. Alguns tipos de consultas são particularmente adequados para operações `filesort` completamente em memória. Por exemplo, o otimizador pode usar `filesort` para lidar eficientemente em memória, sem arquivos temporários, com a operação `ORDER BY` para consultas (e subconsultas) da seguinte forma:

```sql
SELECT ... FROM single_table ... ORDER BY non_index_column [DESC] LIMIT [M,]N;
```

Tais consultas são comuns em aplicativos da web que exibem apenas algumas strings de um conjunto de resultados maior. Exemplos:

```sql
SELECT col1, ... FROM t1 ... ORDER BY name LIMIT 10;
SELECT col1, ... FROM t1 ... ORDER BY RAND() LIMIT 15;
```

##### Influenciando a Otimização de ORDER BY

Para consultas lentas do `ORDER BY` para as quais o `filesort` não é usado, tente diminuir a variável de sistema `max_length_for_sort_data` para um valor apropriado que desencadeie um `filesort`. (Um sintoma de definir o valor desta variável muito alto é uma combinação de alta atividade de disco e baixa atividade da CPU.)

Para aumentar a velocidade do `ORDER BY`, verifique se você pode fazer o MySQL usar índices em vez de uma fase de ordenação extra. Se isso não for possível, tente as seguintes estratégias:

* Aumente o valor da variável `sort_buffer_size`. Idealmente, o valor deve ser grande o suficiente para que todo o conjunto de resultados se encaixe no buffer de ordenação (para evitar gravações no disco e passes de junção), mas, no mínimo, o valor deve ser grande o suficiente para acomodar 15 tuplas. (Até 15 arquivos temporários de disco são juncionados e deve haver espaço na memória para pelo menos uma tupla por arquivo.)

Tenha em conta que o tamanho dos valores das colunas armazenados no buffer de ordenação é afetado pelo valor da variável de sistema `max_sort_length`. Por exemplo, se os tuplos armazenam valores de colunas de longa cadeia de caracteres e você aumenta o valor de `max_sort_length`, o tamanho dos tuplos do buffer de ordenação também aumenta e pode ser necessário aumentar `sort_buffer_size`. Para valores de coluna calculados como resultado de expressões de cadeia de caracteres (como aqueles que invocam uma função com valor de cadeia de caracteres), o algoritmo `filesort` não pode determinar o comprimento máximo dos valores das expressões, portanto, deve alocar `max_sort_length` bytes para cada tupla.

Para monitorar o número de passes de junção (para unir arquivos temporários), verifique a variável de status `Sort_merge_passes`.

* Aumente o valor da variável `read_rnd_buffer_size` para que mais strings sejam lidas de cada vez.

* Altere a variável de sistema `tmpdir` para apontar para um sistema de arquivos dedicado com grandes quantidades de espaço livre. O valor da variável pode listar vários caminhos que são usados de forma rotativa; você pode usar esse recurso para espalhar a carga por vários diretórios. Separe os caminhos por caracteres de colon (`:`) em Unix e por caracteres de ponto e vírgula (`;`) em Windows. Os caminhos devem nomear diretórios em sistemas de arquivos localizados em diferentes discos *físicos*, não diferentes partições no mesmo disco.

##### Informações do Plano de Execução Disponíveis

Com `EXPLAIN` (consulte a Seção 8.8.1, “Otimizando consultas com EXPLAIN”), você pode verificar se o MySQL pode usar índices para resolver uma cláusula `ORDER BY`:

* Se a coluna `Extra` do `EXPLAIN` de saída não contiver `Using filesort`, o índice é utilizado e não é realizada uma `filesort`.

* Se a coluna `Extra` do `EXPLAIN` de saída contiver `Using filesort`, o índice não é utilizado e um `filesort` é realizado.

Além disso, se um `filesort` for realizado, a saída do rastreamento do otimizador inclui um bloco `filesort_summary`. Por exemplo:

```sql
"filesort_summary": {
  "rows": 100,
  "examined_rows": 100,
  "number_of_tmp_files": 0,
  "sort_buffer_size": 25192,
  "sort_mode": "<sort_key, packed_additional_fields>"
}
```

O valor `sort_mode` fornece informações sobre o conteúdo dos tuplos no buffer de ordenação:

* `<sort_key, rowid>`: Isso indica que os tuplos do buffer de classificação são pares que contêm o valor da chave de classificação e o ID da string da string original da tabela. Os tuplos são classificados pelo valor da chave de classificação e o ID da string é usado para ler a string da tabela.

* `<sort_key, additional_fields>`: Isso indica que os tuplos do buffer de classificação contêm o valor da chave de classificação e as colunas referenciadas pela consulta. Os tuplos são classificados pelo valor da chave de classificação e os valores das colunas são lidos diretamente do tuplo.

* `<sort_key, packed_additional_fields>`: Assim como a variante anterior, mas as colunas adicionais são compactadas juntas em vez de usar uma codificação de comprimento fixo.

`EXPLAIN` não distingue se o otimizador realiza ou não uma `filesort` na memória. O uso de uma `filesort` na memória pode ser visto na saída da análise do otimizador. Procure `filesort_priority_queue_optimization`. Para informações sobre a análise do otimizador, consulte a Seção 8.15, “Rastreamento do Otimizador”.

#### 8.2.1.15 Otimização por GROUP BY

A maneira mais geral de satisfazer uma cláusula `GROUP BY` é digitalizar toda a tabela e criar uma nova tabela temporária onde todas as strings de cada grupo são consecutivas, e, em seguida, usar essa tabela temporária para descobrir grupos e aplicar funções agregadas (se houver). Em alguns casos, o MySQL é capaz de fazer muito melhor do que isso e evitar a criação de tabelas temporárias usando acesso a índices.

As condições prévias mais importantes para o uso de índices para `GROUP BY` são que todas as colunas `GROUP BY` façam referência a atributos do mesmo índice e que o índice armazene suas chaves em ordem (como é o caso, por exemplo, de um índice `BTREE`, mas não para um índice `HASH`). Se o uso de tabelas temporárias pode ser substituído pelo acesso ao índice também depende de quais partes de um índice são usadas em uma consulta, as condições especificadas para essas partes e as funções agregadas selecionadas.

Existem duas maneiras de executar uma consulta `GROUP BY` por meio de acesso ao índice, conforme detalhado nas seções a seguir. O primeiro método aplica a operação de agrupamento juntamente com todos os predicados de intervalo (se houver). O segundo método realiza primeiro uma varredura de intervalo e, em seguida, agrupa os tuplos resultantes.

Em MySQL, `GROUP BY` é usado para classificação, portanto, o servidor também pode aplicar otimizações de `ORDER BY` para agrupamento. No entanto, confiar em classificação implícita ou explícita de `GROUP BY` é desaconselhável. Veja a Seção 8.2.1.14, “Otimização de ORDER BY”.

* Pesquisa de índice solta
* Pesquisa de índice apertada

##### Escaneamento de índice solto

A maneira mais eficiente de processar `GROUP BY` é quando um índice é usado para recuperar diretamente as colunas de agrupamento. Com esse método de acesso, o MySQL utiliza a propriedade de alguns tipos de índice de que as chaves estão ordenadas (por exemplo, `BTREE`). Essa propriedade permite o uso de grupos de busca em um índice sem ter que considerar todas as chaves do índice que satisfazem todas as condições de `WHERE`. Esse método de acesso considera apenas uma fração das chaves em um índice, então é chamado de varredura de índice solta. Quando não há cláusula de `WHERE`, uma varredura de índice solta lê tantas chaves quanto o número de grupos, o que pode ser um número muito menor do que o de todas as chaves. Se a cláusula de `WHERE` contém predicados de intervalo (veja a discussão do tipo de junção `range` na Seção 8.8.1, “Otimizando consultas com EXPLAIN”), uma varredura de índice solta busca a primeira chave de cada grupo que satisfaça as condições de intervalo, e lê novamente o menor número possível de chaves. Isso é possível sob as seguintes condições:

* A consulta é sobre uma única tabela.
* Os nomes `GROUP BY` formam apenas colunas que formam um prefixo à esquerda do índice e nenhuma outra coluna. (Se, em vez de `GROUP BY`, a consulta tiver uma cláusula `DISTINCT`, todos os atributos distintos referem-se a colunas que formam um prefixo à esquerda do índice.) Por exemplo, se uma tabela `t1` tiver um índice em `(c1,c2,c3)`, o Loose Index Scan é aplicável se a consulta tiver `GROUP BY c1, c2`. Não é aplicável se a consulta tiver `GROUP BY c2, c3` (as colunas não formam um prefixo à esquerda) ou `GROUP BY c1, c2, c4` (`c4` não está no índice).

* As únicas funções agregadas utilizadas na lista de seleção (se houver) são `MIN()` e `MAX()`, e todas elas se referem à mesma coluna. A coluna deve estar no índice e deve seguir imediatamente as colunas no `GROUP BY`.

* Quaisquer outras partes do índice que não sejam as do `GROUP BY` referenciadas na consulta devem ser constantes (ou seja, devem ser referenciadas em igualdades com constantes), exceto o argumento das funções `MIN()` ou `MAX()`.

* Para colunas no índice, os valores completos da coluna devem ser indexados, não apenas um prefixo. Por exemplo, com `c1 VARCHAR(20), INDEX (c1(10))`, o índice usa apenas um prefixo dos valores `c1` e não pode ser usado para varredura de índice solto.

Se o Índice Solto for aplicável a uma consulta, a saída `EXPLAIN` mostra `Using index for group-by` na coluna `Extra`.

Suponha que haja um índice `idx(c1,c2,c3)` na tabela `t1(c1,c2,c3,c4)`. O método de acesso ao Loose Index Scan pode ser usado para as seguintes consultas:

```sql
SELECT c1, c2 FROM t1 GROUP BY c1, c2;
SELECT DISTINCT c1, c2 FROM t1;
SELECT c1, MIN(c2) FROM t1 GROUP BY c1;
SELECT c1, c2 FROM t1 WHERE c1 < const GROUP BY c1, c2;
SELECT MAX(c3), MIN(c3), c1, c2 FROM t1 WHERE c2 > const GROUP BY c1, c2;
SELECT c2 FROM t1 WHERE c1 < const GROUP BY c1, c2;
SELECT c1, c2 FROM t1 WHERE c3 = const GROUP BY c1, c2;
```

As seguintes consultas não podem ser executadas com este método de seleção rápida, pelas razões apresentadas:

* Existem funções agregadas que não são `MIN()` ou `MAX()`:

  ```sql
  SELECT c1, SUM(c2) FROM t1 GROUP BY c1;
  ```

* As colunas na cláusula `GROUP BY` não formam um prefixo à esquerda do índice:

  ```sql
  SELECT c1, c2 FROM t1 GROUP BY c2, c3;
  ```

* A consulta refere-se a uma parte de uma chave que vem após a parte `GROUP BY`, e para a qual não há igualdade com uma constante:

  ```sql
  SELECT c1, c3 FROM t1 GROUP BY c1, c2;
  ```

Se a consulta incluir `WHERE c3 = const`, pode ser usado o Loose Index Scan.

O método de acesso ao Loose Index Scan pode ser aplicado a outras formas de referência de função agregada na lista de seleção, além das referências `MIN()` e `MAX()` já suportadas:

* `AVG(DISTINCT)`, `SUM(DISTINCT)` e `COUNT(DISTINCT)` são suportados. `AVG(DISTINCT)` e `SUM(DISTINCT)` aceitam um único argumento. `COUNT(DISTINCT)` pode ter mais de um argumento de coluna.

* Não deve haver nenhuma cláusula `GROUP BY` ou `DISTINCT` na consulta.

* As limitações do exame de índice solto descritas anteriormente ainda se aplicam.

Suponha que haja um índice `idx(c1,c2,c3)` na tabela `t1(c1,c2,c3,c4)`. O método de acesso ao Índice Solto pode ser usado para as seguintes consultas:

```sql
SELECT COUNT(DISTINCT c1), SUM(DISTINCT c1) FROM t1;

SELECT COUNT(DISTINCT c1, c2), COUNT(DISTINCT c2, c1) FROM t1;
```

##### Escaneamento de Índice Fechado

Um exame de índice apertado pode ser um exame de índice completo ou um exame de índice de intervalo, dependendo das condições da consulta.

Quando as condições para um varredura de índice solto não são atendidas, ainda é possível evitar a criação de tabelas temporárias para consultas do `GROUP BY`. Se houver condições de intervalo na cláusula do `WHERE`, este método lê apenas as chaves que satisfazem essas condições. Caso contrário, ele realiza uma varredura de índice. Como este método lê todas as chaves em cada intervalo definido pela cláusula do `WHERE`, ou varre todo o índice se não houver condições de intervalo, é chamado de varredura de índice apertado. Com uma varredura de índice apertada, a operação de agrupamento é realizada apenas após todas as chaves que satisfazem as condições de intervalo terem sido encontradas.

Para que esse método funcione, é suficiente que haja uma condição de igualdade constante para todas as colunas em uma consulta que faça referência a partes da chave que vêm antes ou entre partes da chave `GROUP BY`. As constantes das condições de igualdade preenchem quaisquer "lacunas" nas chaves de pesquisa para que seja possível formar prefixos completos do índice. Esses prefixos de índice podem então ser usados para buscas no índice. Se o resultado `GROUP BY` exigir ordenação, e for possível formar chaves de pesquisa que sejam prefixos do índice, o MySQL também evita operações de ordenação adicionais porque a busca com prefixos em um índice ordenado já recupera todas as chaves em ordem.

Suponha que haja um índice `idx(c1,c2,c3)` na tabela `t1(c1,c2,c3,c4)`. As seguintes consultas não funcionam com o método de acesso de varredura de índice solto descrito anteriormente, mas ainda funcionam com o método de acesso de varredura de índice apertado.

* Há uma lacuna no `GROUP BY`, mas ela é coberta pela condição `c2 = 'a'`:

  ```sql
  SELECT c1, c2, c3 FROM t1 WHERE c2 = 'a' GROUP BY c1, c3;
  ```

* O `GROUP BY` não começa com a primeira parte da chave, mas há uma condição que fornece uma constante para essa parte:

  ```sql
  SELECT c1, c2, c3 FROM t1 WHERE c1 = 'a' GROUP BY c2, c3;
  ```

#### 8.2.1.16 Otimização DISTINTA

`DISTINCT` combinado com `ORDER BY` precisa de uma tabela temporária em muitos casos.

Como o `DISTINCT` pode usar o `GROUP BY`, aprenda como o MySQL funciona com colunas em cláusulas de `ORDER BY` ou `HAVING` que não fazem parte das colunas selecionadas. Veja a Seção 12.19.3, “Tratamento do MySQL do GROUP BY”.

Na maioria dos casos, uma cláusula `DISTINCT` pode ser considerada como um caso especial de `GROUP BY`. Por exemplo, as seguintes duas consultas são equivalentes:

```sql
SELECT DISTINCT c1, c2, c3 FROM t1
WHERE c1 > const;

SELECT c1, c2, c3 FROM t1
WHERE c1 > const GROUP BY c1, c2, c3;
```

Devido a essa equivalência, as otimizações aplicáveis às consultas de `GROUP BY` também podem ser aplicadas a consultas com uma cláusula de `DISTINCT`. Assim, para mais detalhes sobre as possibilidades de otimização para consultas de `DISTINCT`, consulte a Seção 8.2.1.15, “Otimização por GROUP BY”.

Quando se combina `LIMIT row_count` com `DISTINCT`, o MySQL para assim que encontrar *`row_count`* strings únicas.

Se você não usar colunas de todas as tabelas mencionadas em uma consulta, o MySQL para de analisar quaisquer tabelas não utilizadas assim que encontrar a primeira correspondência. No caso a seguir, assumindo que `t1` é usado antes de `t2` (que você pode verificar com `EXPLAIN`), o MySQL para de ler a partir de `t2` (para qualquer string específica em `t1`) quando encontrar a primeira string em `t2`:

```sql
SELECT DISTINCT t1.a FROM t1, t2 where t1.a=t2.a;
```

#### 8.2.1.17 Otimização da consulta de limite

Se você precisa apenas de um número especificado de strings de um conjunto de resultados, use uma cláusula `LIMIT` na consulta, em vez de obter todo o conjunto de resultados e descartar os dados extras.

O MySQL, às vezes, otimiza uma consulta que tem uma cláusula `LIMIT row_count` e nenhuma cláusula `HAVING`:

* Se você selecionar apenas algumas strings com `LIMIT`, o MySQL usa índices em alguns casos, quando normalmente preferiria realizar uma varredura completa da tabela.

* Se você combinar `LIMIT row_count` com `ORDER BY`, o MySQL para de ordenar assim que encontrar as primeiras strings *`row_count`* do resultado ordenado, em vez de ordenar todo o resultado. Se a ordenação for feita usando um índice, isso é muito rápido. Se um filesort deve ser feito, todas as strings que correspondem à consulta sem a cláusula `LIMIT` são selecionadas e a maioria ou todas elas são ordenadas, antes de serem encontradas as primeiras *`row_count`*. Após as primeiras strings terem sido encontradas, o MySQL não ordena nenhum restante do conjunto de resultados.

Uma manifestação desse comportamento é que uma consulta `ORDER BY` com e sem `LIMIT` pode retornar strings em ordem diferente, conforme descrito mais adiante nesta seção.

* Se você combinar `LIMIT row_count` com `DISTINCT`, o MySQL para assim que encontrar *`row_count`* strings únicas.

* Em alguns casos, um `GROUP BY` pode ser resolvido lendo o índice em ordem (ou fazendo uma ordenação no índice), e depois calculando resumos até que o valor do índice mude. Nesse caso, o `LIMIT row_count` não calcula quaisquer valores desnecessários do `GROUP BY`.

* Assim que o MySQL tiver enviado o número necessário de strings ao cliente, ele interrompe a consulta, a menos que você esteja usando `SQL_CALC_FOUND_ROWS`. Nesse caso, o número de strings pode ser recuperado com `SELECT FOUND_ROWS()`. Veja a Seção 12.15, “Funções de Informação”.

* `LIMIT 0` retorna rapidamente um conjunto vazio. Isso pode ser útil para verificar a validade de uma consulta. Também pode ser empregado para obter os tipos das colunas de resultado em aplicativos que utilizam uma API MySQL que disponibiliza metadados do conjunto de resultados. Com o programa cliente **mysql**, você pode usar a opção `--column-type-info` para exibir os tipos das colunas de resultado.

* Se o servidor usar tabelas temporárias para resolver uma consulta, ele usa a cláusula `LIMIT row_count` para calcular o espaço necessário.

* Se um índice não for usado para `ORDER BY`, mas uma cláusula `LIMIT` também estiver presente, o otimizador pode ser capaz de evitar o uso de um arquivo de junção e ordenar as strings na memória usando uma operação `filesort` de memória.

Se várias strings tiverem valores idênticos nas colunas `ORDER BY`, o servidor pode retornar essas strings em qualquer ordem, e pode fazer isso de maneira diferente, dependendo do plano de execução geral. Em outras palavras, o ordem de classificação dessas strings é não determinística em relação às colunas não ordenadas.

Um fator que afeta o plano de execução é `LIMIT`, portanto, uma consulta `ORDER BY` com e sem `LIMIT` pode retornar strings em ordens diferentes. Considere esta consulta, que é ordenada pela coluna `category`, mas não determinada em relação às colunas `id` e `rating`:

```sql
mysql> SELECT * FROM ratings ORDER BY category;
+----+----------+--------+
| id | category | rating |
+----+----------+--------+
|  1 |        1 |    4.5 |
|  5 |        1 |    3.2 |
|  3 |        2 |    3.7 |
|  4 |        2 |    3.5 |
|  6 |        2 |    3.5 |
|  2 |        3 |    5.0 |
|  7 |        3 |    2.7 |
+----+----------+--------+
```

Incluir `LIMIT` pode afetar a ordem das strings dentro de cada valor de `category`. Por exemplo, este é um resultado de consulta válido:

```sql
mysql> SELECT * FROM ratings ORDER BY category LIMIT 5;
+----+----------+--------+
| id | category | rating |
+----+----------+--------+
|  1 |        1 |    4.5 |
|  5 |        1 |    3.2 |
|  4 |        2 |    3.5 |
|  3 |        2 |    3.7 |
|  6 |        2 |    3.5 |
+----+----------+--------+
```

Em cada caso, as strings são ordenadas pela coluna `ORDER BY`, que é tudo o que é exigido pelo padrão SQL.

Se for importante garantir a mesma ordem de string com e sem `LIMIT`, inclua colunas adicionais na cláusula `ORDER BY` para tornar a ordem determinística. Por exemplo, se os valores de `id` forem únicos, você pode fazer com que as strings para um valor dado de `category` apareçam na ordem de `id` ao fazer o seguinte:

```sql
mysql> SELECT * FROM ratings ORDER BY category, id;
+----+----------+--------+
| id | category | rating |
+----+----------+--------+
|  1 |        1 |    4.5 |
|  5 |        1 |    3.2 |
|  3 |        2 |    3.7 |
|  4 |        2 |    3.5 |
|  6 |        2 |    3.5 |
|  2 |        3 |    5.0 |
|  7 |        3 |    2.7 |
+----+----------+--------+

mysql> SELECT * FROM ratings ORDER BY category, id LIMIT 5;
+----+----------+--------+
| id | category | rating |
+----+----------+--------+
|  1 |        1 |    4.5 |
|  5 |        1 |    3.2 |
|  3 |        2 |    3.7 |
|  4 |        2 |    3.5 |
|  6 |        2 |    3.5 |
+----+----------+--------+
```

Para uma consulta com uma cláusula `ORDER BY` ou `GROUP BY` e uma cláusula `LIMIT`, o otimizador tenta escolher um índice ordenado por padrão, quando isso parecer acelerar a execução da consulta. Antes do MySQL 5.7.33, não havia como sobrepor esse comportamento, mesmo em casos em que o uso de outra otimização poderia ser mais rápido. A partir do MySQL 5.7.33, é possível desativar essa otimização, definindo a bandeira `prefer_ordering_index` da variável de sistema `optimizer_switch` como `off`.

*Exemplo*: Primeiro, criamos e preenchemos uma tabela `t` como mostrado aqui:

```sql
# Create and populate a table t:

mysql> CREATE TABLE t (
    ->     id1 BIGINT NOT NULL,
    ->     id2 BIGINT NOT NULL,
    ->     c1 VARCHAR(50) NOT NULL,
    ->     c2 VARCHAR(50) NOT NULL,
    ->  PRIMARY KEY (id1),
    ->  INDEX i (id2, c1)
    -> );

# [Insert some rows into table t - not shown]
```

Verifique se a bandeira `prefer_ordering_index` está habilitada:

```sql
mysql> SELECT @@optimizer_switch LIKE '%prefer_ordering_index=on%';
+------------------------------------------------------+
| @@optimizer_switch LIKE '%prefer_ordering_index=on%' |
+------------------------------------------------------+
|                                                    1 |
+------------------------------------------------------+
```

Como a seguinte consulta tem uma cláusula `LIMIT`, esperamos que ela use um índice ordenado, se possível. Neste caso, como podemos ver pelo resultado da `EXPLAIN`, ela usa a chave primária da tabela.

```sql
mysql> EXPLAIN SELECT c2 FROM t
    ->     WHERE id2 > 3
    ->     ORDER BY id1 ASC LIMIT 2\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: t
   partitions: NULL
         type: index
possible_keys: i
          key: PRIMARY
      key_len: 8
          ref: NULL
         rows: 2
     filtered: 70.00
        Extra: Using where
```

Agora, desabilitamos a bandeira `prefer_ordering_index` e executamos novamente a mesma consulta; desta vez, ela utiliza o índice `i` (que inclui a coluna `id2` usada na cláusula `WHERE`), e um filesort:

```sql
mysql> SET optimizer_switch = "prefer_ordering_index=off";

mysql> EXPLAIN SELECT c2 FROM t
    ->     WHERE id2 > 3
    ->     ORDER BY id1 ASC LIMIT 2\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: t
   partitions: NULL
         type: range
possible_keys: i
          key: i
      key_len: 8
          ref: NULL
         rows: 14
     filtered: 100.00
        Extra: Using index condition; Using filesort
```

Veja também a Seção 8.9.2, “Otimizações Desconectables”.

#### 8.2.1.18 Otimização da Chamada de Função

As funções do MySQL são marcadas internamente como determinísticas ou não determinísticas. Uma função é não determinística se, dados valores fixos para seus argumentos, ela pode retornar resultados diferentes para diferentes invocatórias. Exemplos de funções não determinísticas: `RAND()`, `UUID()`.

Se uma função for marcada como não determinística, uma referência a ela em uma cláusula de `WHERE` é avaliada para cada string (ao selecionar de uma única tabela) ou combinação de strings (ao selecionar de uma junção de múltiplas tabelas).

O MySQL também determina quando deve avaliar funções com base nos tipos de argumentos, se os argumentos são colunas de tabela ou valores constantes. Uma função determinística que recebe uma coluna de tabela como argumento deve ser avaliada sempre que essa coluna mude de valor.

As funções não determinísticas podem afetar o desempenho das consultas. Por exemplo, algumas otimizações podem não estar disponíveis, ou pode ser necessário mais bloqueio. O seguinte texto utiliza `RAND()`, mas se aplica também a outras funções não determinísticas.

Suponha que uma tabela `t` tenha esta definição:

```sql
CREATE TABLE t (id INT NOT NULL PRIMARY KEY, col_a VARCHAR(100));
```

Considere essas duas perguntas:

```sql
SELECT * FROM t WHERE id = POW(1,2);
SELECT * FROM t WHERE id = FLOOR(1 + RAND() * 49);
```

Ambas as consultas parecem usar uma pesquisa de chave primária devido à comparação de igualdade contra a chave primária, mas isso é verdadeiro apenas para a primeira delas:

* A primeira consulta sempre produz um máximo de uma string porque `POW()` com argumentos constantes é um valor constante e é usado para busca de índice.

* A segunda consulta contém uma expressão que utiliza a função não determinística `RAND()`, que não é constante na consulta, mas na verdade tem um novo valor para cada string da tabela `t`. Consequentemente, a consulta lê todas as strings da tabela, avalia o predicado para cada string e emite todas as strings para as quais a chave primária corresponde ao valor aleatório. Isso pode ser zero, um ou várias strings, dependendo dos valores da coluna `id` e dos valores na sequência `RAND()`.

Os efeitos do não determinismo não se limitam às declarações do `SELECT`. Esta declaração do `UPDATE` utiliza uma função não determinística para selecionar as strings que serão modificadas:

```sql
UPDATE t SET col_a = some_expr WHERE id = FLOOR(1 + RAND() * 49);
```

Presumivelmente, a intenção é atualizar no máximo uma única string para a qual a chave primária corresponda à expressão. No entanto, ela pode atualizar zero, uma ou várias strings, dependendo dos valores da coluna `id` e dos valores na sequência `RAND()`.

O comportamento descrito acima tem implicações para o desempenho e a replicação:

* Como uma função não determinística não produz um valor constante, o otimizador não pode usar estratégias que, de outra forma, poderiam ser aplicáveis, como consultas de índice. O resultado pode ser uma varredura de tabela.

* `InnoDB` pode escalar para um bloqueio de chave de intervalo em vez de assumir um bloqueio de uma única string para uma string correspondente.

* As atualizações que não são executadas de forma determinística não são seguras para replicação.

As dificuldades decorrem do fato de que a função `RAND()` é avaliada uma vez para cada string da tabela. Para evitar múltiplas avaliações da função, use uma dessas técnicas:

* Mova a expressão que contém a função não determinística para uma declaração separada, salvando o valor em uma variável. Na declaração original, substitua a expressão por uma referência à variável, que o otimizador pode tratar como um valor constante:

  ```sql
  SET @keyval = FLOOR(1 + RAND() * 49);
  UPDATE t SET col_a = some_expr WHERE id = @keyval;
  ```

* Atribua o valor aleatório a uma variável em uma tabela derivada. Essa técnica faz com que a variável seja atribuída um valor, uma vez, antes de seu uso na comparação na cláusula `WHERE`:

  ```sql
  SET optimizer_switch = 'derived_merge=off';
  UPDATE t, (SELECT @keyval := FLOOR(1 + RAND() * 49)) AS dt
  SET col_a = some_expr WHERE id = @keyval;
  ```

Como mencionado anteriormente, uma expressão não determinística na cláusula `WHERE` pode impedir otimizações e resultar em uma varredura de tabela. No entanto, pode ser possível otimizar parcialmente a cláusula `WHERE` se outras expressões forem determinísticas. Por exemplo:

```sql
SELECT * FROM t WHERE partial_key=5 AND some_column=RAND();
```

Se o otimizador puder usar `partial_key` para reduzir o conjunto de strings selecionadas, `RAND()` é executado menos vezes, o que diminui o efeito do não determinismo na otimização.

#### 8.2.1.19 Otimização da expressão do construtor de string

Os construtores de string permitem comparações simultâneas de múltiplos valores. Por exemplo, essas duas declarações são semanticamente equivalentes:

```sql
SELECT * FROM t1 WHERE (column1,column2) = (1,1);
SELECT * FROM t1 WHERE column1 = 1 AND column2 = 1;
```

Além disso, o otimizador trata ambas as expressões da mesma maneira.

O otimizador é menos provável que use índices disponíveis se as colunas do construtor de string não cobrem o prefixo de um índice. Considere a tabela a seguir, que tem uma chave primária em `(c1, c2, c3)`:

```sql
CREATE TABLE t1 (
  c1 INT, c2 INT, c3 INT, c4 CHAR(100),
  PRIMARY KEY(c1,c2,c3)
);
```

Nesta consulta, a cláusula `WHERE` usa todas as colunas do índice. No entanto, o próprio construtor de string não cobre um prefixo de índice, com o resultado de que o otimizador usa apenas `c1` (`key_len=4`, o tamanho de `c1`):

```sql
mysql> EXPLAIN SELECT * FROM t1
       WHERE c1=1 AND (c2,c3) > (1,1)\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: t1
   partitions: NULL
         type: ref
possible_keys: PRIMARY
          key: PRIMARY
      key_len: 4
          ref: const
         rows: 3
     filtered: 100.00
        Extra: Using where
```

Nesses casos, a reescrita da expressão do construtor de string usando uma expressão não-construtor equivalente pode resultar em um uso de índice mais completo. Para a consulta dada, as expressões do construtor de string e não-construtor equivalente são:

```sql
(c2,c3) > (1,1)
c2 > 1 OR ((c2 = 1) AND (c3 > 1))
```

Reescrever a consulta para usar a expressão não-construtor resulta no otimizador usando todas as três colunas no índice (`key_len=12`):

```sql
mysql> EXPLAIN SELECT * FROM t1
       WHERE c1 = 1 AND (c2 > 1 OR ((c2 = 1) AND (c3 > 1)))\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: t1
   partitions: NULL
         type: range
possible_keys: PRIMARY
          key: PRIMARY
      key_len: 12
          ref: NULL
         rows: 3
     filtered: 100.00
        Extra: Using where
```

Assim, para obter melhores resultados, evite misturar construtores de string com expressões `AND`/`OR`. Use uma ou a outra.

Sob certas condições, o otimizador pode aplicar o método de acesso de intervalo às expressões de `IN()` que possuem argumentos do construtor de string. Veja Otimização de intervalo de expressões de construtor de string.

#### 8.2.1.20 Evitando varreduras completas da tabela

A saída do `EXPLAIN` mostra `ALL` na coluna `type` quando o MySQL usa uma varredura completa da tabela para resolver uma consulta. Isso geralmente acontece nas seguintes condições:

* A tabela é tão pequena que é mais rápido realizar uma varredura da tabela do que se preocupar com uma busca de chave. Isso é comum para tabelas com menos de 10 strings e um comprimento de string curto.

* Não há restrições utilizáveis na cláusula `ON` ou `WHERE` para colunas indexadas.

* Você está comparando colunas indexadas com valores constantes e o MySQL calculou (com base na árvore de índice) que as constantes cobrem uma parte muito grande da tabela e que uma varredura da tabela seria mais rápida. Veja a Seção 8.2.1.1, “Otimização da cláusula WHERE”.

* Você está usando uma chave com baixa cardinalidade (muitas strings correspondem ao valor da chave) através de outra coluna. Nesse caso, o MySQL assume que, ao usar a chave, é provável que realize muitas pesquisas de chave e que uma varredura de tabela seria mais rápida.

Para tabelas pequenas, uma varredura de tabela é frequentemente apropriada e o impacto no desempenho é negligenciável. Para tabelas grandes, tente as seguintes técnicas para evitar que o otimizador escolha incorretamente uma varredura de tabela:

* Use `ANALYZE TABLE tbl_name` para atualizar as distribuições de chave para a tabela digitalizada. Veja a Seção 13.7.2.1, “Declaração ANALYZE TABLE”.

* Use `FORCE INDEX` para a tabela digitalizada para informar ao MySQL que as varreduras da tabela são muito caras em comparação com o uso do índice fornecido:

  ```sql
  SELECT * FROM t1, t2 FORCE INDEX (index_for_column)
    WHERE t1.col_name=t2.col_name;
  ```

Veja a Seção 8.9.4, “Dicas de índice”.

* Inicie `mysqld` com a opção `--max-seeks-for-key=1000` ou use `SET max_seeks_for_key=1000` para informar ao otimizador que nenhuma varredura de chave causa mais de 1.000 buscas de chave. Veja a Seção 5.1.7, “Variáveis do Sistema do Servidor”.

### 8.2.2 Otimizando subconsultas, tabelas derivadas e referências de visualização

O otimizador de consultas do MySQL tem diferentes estratégias disponíveis para avaliar subconsultas:

* Para subconsultas de `IN` (ou `=ANY`), o otimizador tem essas opções:

+ Semijoin
+ Materialização
+ `EXISTS` estratégia
* Para subconsultas de `NOT IN` (ou `<>ALL`), o otimizador tem essas opções:

+ Materialização
  + `EXISTS` estratégia

Para tabelas derivadas, o otimizador tem essas opções (que também se aplicam às referências de visualização):

* Conjure a tabela derivada no bloco de consulta externa
* Materialize a tabela derivada em uma tabela temporária interna

A discussão a seguir fornece mais informações sobre as estratégias de otimização anteriores.

Nota

Uma limitação das declarações `UPDATE` e `DELETE` que utilizam uma subconsulta para modificar uma única tabela é que o otimizador não utiliza otimizações de subconsulta semijoin ou materialização. Como uma solução alternativa, tente reescrevê-las como declarações `UPDATE` e `DELETE` de múltiplas tabelas que utilizam uma junção em vez de uma subconsulta.

#### 8.2.2.1 Otimizando subconsultas, tabelas derivadas e referências de visualizações com transformações de semijoin

Um semijoin é uma transformação que permite várias estratégias de execução, como extração de tabela, eliminação de duplicatas, primeira correspondência, varredura solta e materialização. O otimizador utiliza estratégias de semijoin para melhorar a execução de subconsultas, conforme descrito nesta seção.

Para uma junção interna entre duas tabelas, a junção retorna uma string de uma tabela tantas vezes quanto houver correspondências na outra tabela. Mas, para algumas perguntas, a única informação que importa é se há uma correspondência, não o número de correspondências. Suponha que existam tabelas chamadas `class` e `roster` que listam as classes em um currículo de curso e listas de aulas (alunos matriculados em cada aula), respectivamente. Para listar as aulas que realmente têm alunos matriculados, você poderia usar essa junção:

```sql
SELECT class.class_num, class.class_name
FROM class INNER JOIN roster
WHERE class.class_num = roster.class_num;
```

No entanto, o resultado lista cada classe uma vez para cada aluno matriculado. Para a questão que está sendo feita, essa é uma duplicação desnecessária de informações.

Supondo que `class_num` seja uma chave primária na tabela `class`, a supressão de duplicatas é possível usando `SELECT DISTINCT`, mas é ineficiente gerar todas as strings correspondentes primeiro e apenas eliminar as duplicatas posteriormente.

O mesmo resultado sem duplicatas pode ser obtido usando uma subconsulta:

```sql
SELECT class_num, class_name
FROM class
WHERE class_num IN (SELECT class_num FROM roster);
```

Aqui, o otimizador pode reconhecer que a cláusula `IN` exige que a subconsulta retorne apenas uma instância de cada número de classe da tabela `roster`. Neste caso, a consulta pode usar uma semijoin; ou seja, uma operação que retorne apenas uma instância de cada string em `class` que seja correspondida por strings em `roster`.

A sintaxe de junção externa e junção interna é permitida na especificação da consulta externa, e as referências de tabela podem ser tabelas base, tabelas derivadas ou referências de visão.

Em MySQL, uma subconsulta deve satisfazer esses critérios para ser tratada como uma semijoin:

* Deve ser uma subconsulta `IN` (ou `=ANY`) que apareça no nível superior da cláusula `WHERE` ou `ON`, possivelmente como um termo em uma expressão `AND`. Por exemplo:

  ```sql
  SELECT ...
  FROM ot1, ...
  WHERE (oe1, ...) IN (SELECT ie1, ... FROM it1, ... WHERE ...);
  ```

Aqui, `ot_i` e `it_i` representam tabelas nas partes externa e interna da consulta, e `oe_i` e `ie_i` representam expressões que se referem a colunas nas tabelas externa e interna.

* Deve ser um único `SELECT` sem construções de `UNION`.

* Não deve conter uma cláusula `GROUP BY` ou `HAVING`.

* Não deve ser agrupado implicitamente (não deve conter funções agregadas).

* Não deve ter `ORDER BY` com `LIMIT`.

* A declaração não deve usar o tipo de junção `STRAIGHT_JOIN` na consulta externa.

* O modificador `STRAIGHT_JOIN` não deve estar presente.

* O número de tabelas externas e internas, somadas, deve ser menor que o número máximo de tabelas permitidas em uma junção.

A subconsulta pode ser correlacionada ou não correlacionada. `DISTINCT` é permitido, assim como `LIMIT`, a menos que `ORDER BY` também seja utilizado.

Se uma subconsulta atender aos critérios anteriores, o MySQL a converte em uma semijoin e faz uma escolha baseada no custo dessas estratégias:

* Converte a subconsulta em uma junção, ou use a extração de tabela e execute a consulta como uma junção interna entre as tabelas da subconsulta e as tabelas externas. A extração de tabela extrai uma tabela da subconsulta para a consulta externa.

* Duplo Weedout: Execute a semijoin como se fosse uma junção e remova os registros duplicados usando uma tabela temporária.

* FirstMatch: Ao digitalizar as tabelas internas em busca de combinações de strings e houver múltiplas instâncias de um grupo de valores específico, escolha uma em vez de retornar todas. Esse "atalho" de digitalização elimina a produção de strings desnecessárias.

* LooseScan: Escanear uma tabela de subconsulta usando um índice que permite que um único valor seja escolhido do grupo de valores de cada subconsulta.

* Materialize a subconsulta em uma tabela temporária indexada que é usada para realizar uma junção, onde o índice é usado para remover duplicatas. O índice também pode ser usado posteriormente para pesquisas ao unir a tabela temporária com as tabelas externas; se não for o caso, a tabela é examinada. Para mais informações sobre materialização, consulte a Seção 8.2.2.2, “Otimizando subconsultas com materialização”.

Cada uma dessas estratégias pode ser habilitada ou desabilitada usando as seguintes `optimizer_switch` flags da variável do sistema:

* A bandeira `semijoin` controla se junções semijoias são usadas.

* Se o `semijoin` estiver habilitado, as bandeiras `firstmatch`, `loosescan`, `duplicateweedout` e `materialization` permitem um controle mais preciso sobre as estratégias de junção semijoinha permitidas.

* Se a estratégia de semijoin `duplicateweedout` for desativada, ela não será usada, a menos que todas as outras estratégias aplicáveis também sejam desativadas.

* Se `duplicateweedout` estiver desativado, por vezes, o otimizador pode gerar um plano de consulta que está longe de ser ótimo. Isso ocorre devido à poda heurística durante a busca gananciosa, que pode ser evitada definindo `optimizer_prune_level=0`.

Essas bandeiras são ativadas por padrão. Veja a Seção 8.9.2, “Otimizações Desconectables”.

O otimizador minimiza as diferenças no tratamento de visualizações e tabelas derivadas. Isso afeta as consultas que utilizam o modificador `STRAIGHT_JOIN` e uma visualização com uma subconsulta `IN` que pode ser convertida em um semijoin. A consulta a seguir ilustra isso, pois a mudança no processamento causa uma mudança na transformação e, portanto, uma estratégia de execução diferente:

```sql
CREATE VIEW v AS
SELECT *
FROM t1
WHERE a IN (SELECT b
           FROM t2);

SELECT STRAIGHT_JOIN *
FROM t3 JOIN v ON t3.x = v.a;
```

O otimizador primeiro analisa a visão e converte a subconsulta `IN` em uma semijoin, depois verifica se é possível mesclar a visão na consulta externa. Como o modificador `STRAIGHT_JOIN` na consulta externa impede a semijoin, o otimizador recusa a mesclagem, causando a avaliação da tabela derivada usando uma tabela materializada.

A saída `EXPLAIN` indica o uso de estratégias de semijoin da seguinte forma:

As tabelas semijoinadas aparecem no select externo. Para uma saída `EXPLAIN` ampliada, o texto exibido por um `SHOW WARNINGS` subsequente mostra a consulta reescrita, que exibe a estrutura semijoin. (Veja a Seção 8.8.3, “Formato de saída EXPLAIN ampliado”.) Com isso, você pode ter uma ideia de quais tabelas foram extraídas da semijoin. Se uma subconsulta foi convertida em uma semijoin, você pode ver que o predicado da subconsulta desapareceu e suas tabelas e a cláusula `WHERE` foram mescladas na lista de junção da consulta externa e a cláusula `WHERE`.

* O uso de tabela temporária para Weedout Duplo é indicado por `Start temporary` e `End temporary` na coluna `Extra`. As tabelas que não foram extraídas e estão na faixa das strings de saída `EXPLAIN` cobertas por `Start temporary` e [[`End temporary`] têm seu `rowid` na tabela temporária.

* `FirstMatch(tbl_name)` na coluna `Extra` indica o uso de atalhos de junção.

* `LooseScan(m..n)` na coluna `Extra` indica o uso da estratégia LooseScan. *`m`* e *`n`* são números de peças-chave.

* O uso de tabela temporária para materialização é indicado por strings com um valor de `select_type` de `MATERIALIZED` e strings com um valor de `table` de `<subqueryN>`.

#### 8.2.2.2 Otimizando subconsultas com materialização

O otimizador utiliza a materialização para permitir um processamento de subconsultas mais eficiente. A materialização acelera a execução da consulta ao gerar um resultado de subconsulta como uma tabela temporária, normalmente na memória. A primeira vez que o MySQL precisa do resultado da subconsulta, ele materializa esse resultado em uma tabela temporária. Em qualquer momento subsequente em que o resultado seja necessário, o MySQL faz referência novamente à tabela temporária. O otimizador pode indexar a tabela com um índice hash para tornar as consultas rápidas e econômicas. O índice contém valores únicos para eliminar duplicatas e tornar a tabela menor.

A materialização de subconsultas usa uma tabela temporária de memória quando possível, revertendo para armazenamento em disco se a tabela se tornar muito grande. Veja a Seção 8.4.4, “Uso de tabela temporária interna no MySQL”.

Se a materialização não for usada, o otimizador, por vezes, reescreve uma subconsulta não correlacionada como uma subconsulta correlacionada. Por exemplo, a seguinte subconsulta `IN` é não correlacionada (*`where_condition`* envolve apenas colunas de `t2` e não de `t1`):

```sql
SELECT * FROM t1
WHERE t1.a IN (SELECT t2.b FROM t2 WHERE where_condition);
```

O otimizador pode reescrever isso como uma subconsulta correlacionada `EXISTS`:

```sql
SELECT * FROM t1
WHERE EXISTS (SELECT t2.b FROM t2 WHERE where_condition AND t1.a=t2.b);
```

A materialização de subconsultas usando uma tabela temporária evita tais reescritas e permite executar a subconsulta apenas uma vez, em vez de uma vez por string da consulta externa.

Para que a materialização de subconsulta seja usada no MySQL, a variável de sistema `optimizer_switch` `materialization` deve ser habilitada. (Veja a Seção 8.9.2, “Otimizações Alternativas”). Com a bandeira `materialization` habilitada, a materialização se aplica a predicados de subconsulta que aparecem em qualquer lugar (na lista de seleção, `WHERE`, `ON`, `GROUP BY`, `HAVING` ou `ORDER BY`), para predicados que se enquadram em qualquer um desses casos de uso:

* O predicado tem essa forma, quando nenhuma expressão externa *`oe_i`* ou expressão interna *`ie_i`* é opcional. *`N`* é 1 ou maior.

  ```sql
  (oe_1, oe_2, ..., oe_N) [NOT] IN (SELECT ie_1, i_2, ..., ie_N ...)
  ```

* O predicado tem essa forma quando há uma única expressão externa *`oe`* e uma expressão interna *`ie`*. As expressões podem ser nulos.

  ```sql
  oe [NOT] IN (SELECT ie ...)
  ```

* O predicado é `IN` ou `NOT IN` e um resultado de `UNKNOWN` (`NULL`) tem o mesmo significado que um resultado de `FALSE`.

Os exemplos a seguir ilustram como o requisito de equivalência da avaliação do predicado `UNKNOWN` e `FALSE` afeta se a materialização de subconsulta pode ser usada. Suponha que *`where_condition`* envolva apenas colunas de `t2` e não de `t1` de modo que a subconsulta não seja correlacionada.

Essa consulta está sujeita à materialização:

```sql
SELECT * FROM t1
WHERE t1.a IN (SELECT t2.b FROM t2 WHERE where_condition);
```

Aqui, não importa se o predicado `IN` retorna `UNKNOWN` ou `FALSE`. De qualquer forma, a string de `t1` não está incluída no resultado da consulta.

Um exemplo em que a materialização de subconsulta não é usada é a seguinte consulta, onde `t2.b` é uma coluna nula:

```sql
SELECT * FROM t1
WHERE (t1.a,t1.b) NOT IN (SELECT t2.a,t2.b FROM t2
                          WHERE where_condition);
```

As seguintes restrições se aplicam ao uso da materialização de subconsulta:

* Os tipos das expressões internas e externas devem corresponder. Por exemplo, o otimizador pode ser capaz de usar materialização se ambas as expressões forem inteiras ou ambas forem decimais, mas não pode se uma expressão for inteira e a outra for decimal.

* A expressão interna não pode ser um `BLOB`.

O uso de `EXPLAIN` com uma consulta fornece uma indicação de se o otimizador utiliza materialização de subconsulta:

* Comparado à execução de consulta que não utiliza materialização, `select_type` pode mudar de `DEPENDENT SUBQUERY` para `SUBQUERY`. Isso indica que, para uma subconsulta que seria executada uma vez por string externa, a materialização permite que a subconsulta seja executada apenas uma vez.

* Para uma saída `EXPLAIN` estendida, o texto exibido por um `SHOW WARNINGS` subsequente inclui `materialize` e `materialized-subquery`.

#### 8.2.2.3 Otimizando subconsultas com a estratégia EXISTS

Algumas otimizações são aplicáveis a comparações que utilizam o operador `IN` (ou `=ANY`) para testar os resultados de subconsultas. Esta seção discute essas otimizações, particularmente em relação aos desafios que os valores de `NULL` apresentam. A última parte da discussão sugere como você pode ajudar o otimizador.

Considere a seguinte comparação de subconsulta:

```sql
outer_expr IN (SELECT inner_expr FROM ... WHERE subquery_where)
```

O MySQL avalia as consultas “de fora para dentro”. Ou seja, ele obtém primeiro o valor da expressão externa *`outer_expr`*, e depois executa a subconsulta e captura as strings que ela produz.

Uma otimização muito útil é "informar" a subconsulta que as únicas strings de interesse são aquelas onde a expressão interna *`inner_expr`* é igual a *`outer_expr`*. Isso é feito empurrando uma igualdade apropriada na cláusula `WHERE` da subconsulta para torná-la mais restritiva. A comparação convertida parece assim:

```sql
EXISTS (SELECT 1 FROM ... WHERE subquery_where AND outer_expr=inner_expr)
```

Após a conversão, o MySQL pode usar a igualdade empurrada para limitar o número de strings que deve examinar para avaliar a subconsulta.

Mais genericamente, uma comparação de valores de *`N`* com uma subconsulta que retorna strings com valores de *`N`* está sujeita à mesma conversão. Se *`oe_i`* e *`ie_i`* representam valores correspondentes de expressão externa e interna, respectivamente, essa comparação da subconsulta:

```sql
(oe_1, ..., oe_N) IN
  (SELECT ie_1, ..., ie_N FROM ... WHERE subquery_where)
```

Torna-se:

```sql
EXISTS (SELECT 1 FROM ... WHERE subquery_where
                          AND oe_1 = ie_1
                          AND ...
                          AND oe_N = ie_N)
```

Por simplicidade, a discussão a seguir assume um único par de valores de expressão externa e interna.

A conversão descrita acima tem suas limitações. Ela é válida apenas se ignorarmos possíveis valores de `NULL`. Ou seja, a estratégia de “empurrar para baixo” funciona enquanto ambas essas condições forem verdadeiras:

* *`outer_expr`* e *`inner_expr`* não podem ser `NULL`.

* Você não precisa distinguir os resultados da subconsulta `NULL` de `FALSE`. Se a subconsulta for parte de uma expressão `OR` ou `AND` na cláusula `WHERE`, o MySQL assume que você não se importa. Outra instância em que o otimizador percebe que os resultados da subconsulta `NULL` e `FALSE` não precisam ser distinguidos é essa construção:

  ```sql
  ... WHERE outer_expr IN (subquery)
  ```

Neste caso, a cláusula `WHERE` rejeita a string se `IN (subquery)` retornar `NULL` ou `FALSE`.

Quando uma ou ambas essas condições não se aplicam, a otimização se torna mais complexa.

Suponha que *`outer_expr`* seja conhecido como um valor não `NULL`, mas a subconsulta não produza uma string de tal forma que *`outer_expr`* = *`inner_expr`*. Então, `outer_expr IN (SELECT ...)` é avaliado da seguinte forma:

* `NULL`, se o `SELECT` produzir qualquer string onde *`inner_expr`* é `NULL`

* `FALSE`, se o `SELECT` produz apenas valores não `NULL` ou não produz nada

Nessa situação, a abordagem de procurar strings com `outer_expr = inner_expr` não é mais válida. É necessário procurar tais strings, mas se nenhuma for encontrada, também procure strings onde *`inner_expr`* é `NULL`. Grosso modo, a subconsulta pode ser convertida em algo como este:

```sql
EXISTS (SELECT 1 FROM ... WHERE subquery_where AND
        (outer_expr=inner_expr OR inner_expr IS NULL))
```

A necessidade de avaliar a condição extra `IS NULL` é a razão pela qual o MySQL tem o método de acesso `ref_or_null`:

```sql
mysql> EXPLAIN
       SELECT outer_expr IN (SELECT t2.maybe_null_key
                             FROM t2, t3 WHERE ...)
       FROM t1;
*************************** 1. row ***************************
           id: 1
  select_type: PRIMARY
        table: t1
...
*************************** 2. row ***************************
           id: 2
  select_type: DEPENDENT SUBQUERY
        table: t2
         type: ref_or_null
possible_keys: maybe_null_key
          key: maybe_null_key
      key_len: 5
          ref: func
         rows: 2
        Extra: Using where; Using index
...
```

Os métodos de acesso específicos para subconsultas `unique_subquery` e `index_subquery` também têm variantes de “ou [[`NULL`]”.

A condição adicional `OR ... IS NULL` torna a execução da consulta um pouco mais complicada (e algumas otimizações dentro da subconsulta tornam-se inaplicáveis), mas, em geral, isso é tolerável.

A situação é muito pior quando *`outer_expr`* pode ser `NULL`. De acordo com a interpretação SQL de `NULL` como “valor desconhecido”, `NULL IN (SELECT inner_expr ...)` deve ser avaliado como:

* `NULL`, se o `SELECT` produzir quaisquer strings

* `FALSE`, se o `SELECT` não produzir nenhuma string

Para uma avaliação adequada, é necessário verificar se o `SELECT` produziu alguma string, de modo que o `outer_expr = inner_expr` não possa ser empurrado para baixo na subconsulta. Esse é um problema, pois muitas subconsultas do mundo real tornam-se muito lentas, a menos que a igualdade possa ser empurrada para baixo.

Essencialmente, deve haver diferentes maneiras de executar a subconsulta, dependendo do valor de *`outer_expr`*.

O otimizador escolhe a conformidade com SQL em detrimento da velocidade, portanto, leva em conta a possibilidade de que *`outer_expr`* possa ser `NULL`:

* Se *`outer_expr`* é `NULL`, para avaliar a expressão a seguir, é necessário executar o `SELECT` para determinar se ela produz quaisquer strings:

  ```sql
  NULL IN (SELECT inner_expr FROM ... WHERE subquery_where)
  ```

É necessário executar o original `SELECT` aqui, sem quaisquer igualdades empurradas para baixo do tipo mencionado anteriormente.

* Por outro lado, quando *`outer_expr`* não é `NULL`, é absolutamente essencial que essa comparação:

  ```sql
  outer_expr IN (SELECT inner_expr FROM ... WHERE subquery_where)
  ```

Seja convertido a esta expressão que utiliza uma condição empurrada para baixo:

  ```sql
  EXISTS (SELECT 1 FROM ... WHERE subquery_where AND outer_expr=inner_expr)
  ```

Sem essa conversão, as subconsultas são lentas.

Para resolver o dilema de se empurrar ou não as condições para a subconsulta, as condições são envolvidas em funções "trigger". Assim, uma expressão do seguinte formato:

```sql
outer_expr IN (SELECT inner_expr FROM ... WHERE subquery_where)
```

É convertido em:

```sql
EXISTS (SELECT 1 FROM ... WHERE subquery_where
                          AND trigcond(outer_expr=inner_expr))
```

De forma mais geral, se a comparação da subconsulta for baseada em vários pares de expressões externas e internas, a conversão leva essa comparação:

```sql
(oe_1, ..., oe_N) IN (SELECT ie_1, ..., ie_N FROM ... WHERE subquery_where)
```

E o converte para esta expressão:

```sql
EXISTS (SELECT 1 FROM ... WHERE subquery_where
                          AND trigcond(oe_1=ie_1)
                          AND ...
                          AND trigcond(oe_N=ie_N)
       )
```

Cada `trigcond(X)` é uma função especial que avalia os seguintes valores:

* *`X`* quando a expressão externa “ligada” *`oe_i`* não é `NULL`

* `TRUE` quando a expressão externa "ligada" *`oe_i`* é `NULL`

Nota

As funções de gatilho *não* são gatilhos do tipo que você cria com `CREATE TRIGGER`.

As igualdades que estão envolvidas nas funções `trigcond()` não são predicados de primeira classe para o otimizador de consulta. A maioria das otimizações não pode lidar com predicados que podem ser ativados e desativados no tempo de execução da consulta, então elas assumem que qualquer `trigcond(X)` seja uma função desconhecida e a ignoram. As igualdades desencadeadas podem ser usadas por essas otimizações:

* Otimizações de referência: `trigcond(X=Y [OR Y IS NULL])` pode ser usado para construir acessos à tabela `ref`, `eq_ref` ou `ref_or_null`.

* Motores de execução de subconsultas com busca por índice: `trigcond(X=Y)` pode ser usado para construir acessos de `unique_subquery` ou `index_subquery`.

* Gerador de condição de tabela: Se a subconsulta for uma junção de várias tabelas, a condição acionada é verificada o mais rápido possível.

Quando o otimizador usa uma condição acionada para criar algum tipo de acesso baseado em busca de índice (como nos dois primeiros itens da lista anterior), ele deve ter uma estratégia de fallback para o caso em que a condição seja desativada. Essa estratégia de fallback é sempre a mesma: faça uma varredura completa da tabela. No `EXPLAIN` de saída, o fallback aparece como `Full scan on NULL key` na coluna `Extra`:

```sql
mysql> EXPLAIN SELECT t1.col1,
       t1.col1 IN (SELECT t2.key1 FROM t2 WHERE t2.col2=t1.col2) FROM t1\G
*************************** 1. row ***************************
           id: 1
  select_type: PRIMARY
        table: t1
        ...
*************************** 2. row ***************************
           id: 2
  select_type: DEPENDENT SUBQUERY
        table: t2
         type: index_subquery
possible_keys: key1
          key: key1
      key_len: 5
          ref: func
         rows: 2
        Extra: Using where; Full scan on NULL key
```

Se você executar `EXPLAIN` seguido por `SHOW WARNINGS`, você pode ver a condição desencadeada:

```sql
*************************** 1. row ***************************
  Level: Note
   Code: 1003
Message: select `test`.`t1`.`col1` AS `col1`,
         <in_optimizer>(`test`.`t1`.`col1`,
         <exists>(<index_lookup>(<cache>(`test`.`t1`.`col1`) in t2
         on key1 checking NULL
         where (`test`.`t2`.`col2` = `test`.`t1`.`col2`) having
         trigcond(<is_not_null_test>(`test`.`t2`.`key1`))))) AS
         `t1.col1 IN (select t2.key1 from t2 where t2.col2=t1.col2)`
         from `test`.`t1`
```

O uso de condições desencadeadas tem algumas implicações de desempenho. Uma expressão `NULL IN (SELECT ...)` agora pode causar uma varredura completa da tabela (o que é lento) quando anteriormente não o fazia. Esse é o preço pago por resultados corretos (o objetivo da estratégia de condição desencadeada é melhorar a conformidade, não a velocidade).

Para subconsultas de múltiplas tabelas, a execução de `NULL IN (SELECT ...)` é particularmente lenta porque o otimizador de junção não otimiza para o caso em que a expressão externa é `NULL`. Assume-se que as avaliações de subconsultas com `NULL` no lado esquerdo são muito raras, mesmo que existam estatísticas que indiquem o contrário. Por outro lado, se a expressão externa pode ser `NULL`, mas nunca é realmente, não há penalidade de desempenho.

Para ajudar o otimizador de consulta a executar suas consultas melhor, use essas sugestões:

* Declare uma coluna como `NOT NULL` se realmente for. Isso também ajuda outros aspectos do otimizador ao simplificar a verificação de condições para a coluna.

* Se você não precisa distinguir um resultado de subconsulta `NULL` de `FALSE`, você pode facilmente evitar o caminho de execução lento. Substitua uma comparação que se parece com esta:

  ```sql
  outer_expr IN (SELECT inner_expr FROM ...)
  ```

com esta expressão:

  ```sql
  (outer_expr IS NOT NULL) AND (outer_expr IN (SELECT inner_expr FROM ...))
  ```

Então, `NULL IN (SELECT ...)` nunca é avaliado porque o MySQL para de avaliar as partes de `AND` assim que o resultado da expressão fica claro.

Outra possível reescrita:

  ```sql
  EXISTS (SELECT inner_expr FROM ...
          WHERE inner_expr=outer_expr)
  ```

Isso se aplicaria quando você não precisa distinguir os resultados da subconsulta `NULL` de `FALSE`, no caso em que você pode querer `EXISTS`.

A bandeira `subquery_materialization_cost_based` da variável de sistema `optimizer_switch` permite o controle sobre a escolha entre materialização de subconsulta e transformação de subconsulta de `IN` para `EXISTS`. Veja a Seção 8.9.2, “Otimizações Desconectables”.

#### 8.2.2.4 Otimizando tabelas derivadas e referências de visualização com junção ou materialização

O otimizador pode lidar com referências a tabelas derivadas usando duas estratégias (que também se aplicam a referências de visualização):

* Conjure a tabela derivada no bloco de consulta externa
* Materialize a tabela derivada em uma tabela temporária interna

Exemplo 1:

```sql
SELECT * FROM (SELECT * FROM t1) AS derived_t1;
```

Com a fusão da tabela derivada `derived_t1`, essa consulta é executada de forma semelhante a:

```sql
SELECT * FROM t1;
```

Exemplo 2:

```sql
SELECT *
  FROM t1 JOIN (SELECT t2.f1 FROM t2) AS derived_t2 ON t1.f2=derived_t2.f1
  WHERE t1.f1 > 0;
```

Com a fusão da tabela derivada `derived_t2`, essa consulta é executada de forma semelhante a:

```sql
SELECT t1.*, t2.f1
  FROM t1 JOIN t2 ON t1.f2=t2.f1
  WHERE t1.f1 > 0;
```

Com a materialização, `derived_t1` e `derived_t2` são tratados como tabelas separadas dentro de suas respectivas consultas.

O otimizador trata as tabelas derivadas e as referências de visão da mesma maneira: ele evita a materialização desnecessária sempre que possível, o que permite a redução de condições da consulta externa para as tabelas derivadas e produz planos de execução mais eficientes. (Para um exemplo, consulte a Seção 8.2.2.2, “Otimizando subconsultas com materialização”.)

Se a fusão resultar em um bloco de consulta externa que faça referência a mais de 61 tabelas de base, o otimizador escolhe a materialização em vez disso.

O otimizador propaga uma cláusula `ORDER BY` em uma referência de tabela derivada ou visão para o bloco de consulta externa se todas essas condições forem verdadeiras:

* A consulta externa não está agrupada ou agregada. * A consulta externa não especifica `DISTINCT`, `HAVING` ou `ORDER BY`.

* A consulta externa tem essa referência de tabela ou visão derivada como a única fonte na cláusula `FROM`.

Caso contrário, o otimizador ignora a cláusula `ORDER BY`.

Os seguintes meios estão disponíveis para influenciar se o otimizador tenta combinar tabelas derivadas e referências de visão no bloco de consulta externa:

* A bandeira `derived_merge` da variável de sistema `optimizer_switch` pode ser usada, assumindo que nenhuma outra regra impeça a fusão. Veja a Seção 8.9.2, “Otimizações Alternativas”. Por padrão, a bandeira é habilitada para permitir a fusão. Desabilitar a bandeira impede a fusão e evita os erros `ER_UPDATE_TABLE_USED`.

A bandeira `derived_merge` também se aplica a visualizações que não contêm nenhuma cláusula `ALGORITHM`. Assim, se ocorrer um erro `ER_UPDATE_TABLE_USED` para uma referência de visualização que utiliza uma expressão equivalente à subconsulta, adicionar `ALGORITHM=TEMPTABLE` à definição da visualização impede a fusão e tem precedência sobre o valor `derived_merge`.

* É possível desabilitar a junção usando na subconsulta quaisquer construções que impeçam a junção, embora essas não sejam tão explícitas em seu efeito na materialização. As construções que impedem a junção são as mesmas para tabelas derivadas e referências de visão:

funções agregadas (`SUM()`, `MIN()`, `MAX()`, `COUNT()`, e assim por diante)

+ `DISTINCT`
  + `GROUP BY`
  + `HAVING`
  + `LIMIT`
  + `UNION` ou `UNION ALL`

+ Subconsultas na lista de seleção  
+ Atribuições a variáveis de usuário  
+ Referências apenas a valores literais (neste caso, não há tabela subjacente)

A bandeira `derived_merge` também se aplica a visualizações que não contêm nenhuma cláusula `ALGORITHM`. Assim, se ocorrer um erro `ER_UPDATE_TABLE_USED` para uma referência de visualização que utiliza uma expressão equivalente à subconsulta, adicionar `ALGORITHM=TEMPTABLE` à definição da visualização impede a fusão e tem precedência sobre o valor atual `derived_merge`.

Se o otimizador optar pela estratégia de materialização em vez de fusão para uma tabela derivada, ele trata a consulta da seguinte forma:

* O otimizador adiou a materialização de tabelas derivadas até que seu conteúdo seja necessário durante a execução da consulta. Isso melhora o desempenho, pois o adiamento da materialização pode resultar em não precisar realizá-la. Considere uma consulta que une o resultado de uma tabela derivada a outra tabela: Se o otimizador processar essa outra tabela primeiro e descobrir que ela não retorna nenhuma string, a união não precisa ser realizada e o otimizador pode pular completamente a materialização da tabela derivada.

* Durante a execução da consulta, o otimizador pode adicionar um índice a uma tabela derivada para acelerar a recuperação de strings dela.

Considere a seguinte declaração `EXPLAIN`, para uma consulta `SELECT` que contém uma tabela derivada:

```sql
EXPLAIN SELECT * FROM (SELECT * FROM t1) AS derived_t1;
```

O otimizador evita a materialização da tabela derivada, atrasando-a até que o resultado seja necessário durante a execução do `SELECT`. Neste caso, a consulta não é executada (porque ocorre em uma declaração do `EXPLAIN`, portanto, o resultado nunca é necessário.

Mesmo para consultas que são executadas, o atraso da materialização da tabela derivada pode permitir que o otimizador evite a materialização completamente. Quando isso acontece, a execução da consulta é mais rápida no momento necessário para realizar a materialização. Considere a seguinte consulta, que junta o resultado de uma tabela derivada a outra tabela:

```sql
SELECT *
  FROM t1 JOIN (SELECT t2.f1 FROM t2) AS derived_t2
          ON t1.f2=derived_t2.f1
  WHERE t1.f1 > 0;
```

Se os processos de otimização `t1` forem realizados primeiro e a cláusula `WHERE` produzir um resultado vazio, a junção deve necessariamente ser vazia e a tabela derivada não precisa ser materializada.

Para casos em que uma tabela derivada requer materialização, o otimizador pode adicionar um índice à tabela materializada para acelerar o acesso a ela. Se tal índice permitir o acesso ao `ref` à tabela, pode reduzir significativamente a quantidade de dados lidos durante a execução da consulta. Considere a seguinte consulta:

```sql
SELECT *
 FROM t1 JOIN (SELECT DISTINCT f1 FROM t2) AS derived_t2
         ON t1.f1=derived_t2.f1;
```

O otimizador constrói um índice sobre a coluna `f1` a partir de `derived_t2`, se isso permitir o uso do acesso ao `ref` para o plano de execução de menor custo. Após adicionar o índice, o otimizador pode tratar a tabela derivada materializada da mesma forma que uma tabela regular com um índice, e se beneficia de forma semelhante do índice gerado. O custo da criação do índice é negligenciável em comparação com o custo da execução da consulta sem o índice. Se o acesso ao `ref` resultar em um custo maior do que algum outro método de acesso, o otimizador não cria nenhum índice e não perde nada.

Para a saída de rastreamento do otimizador, uma referência de tabela ou visão derivada combinada não é exibida como um nó. Apenas suas tabelas subjacentes aparecem no plano da consulta superior.

### 8.2.3 Otimizando consultas do INFORMATION\_SCHEMA

Aplicações que monitoram bancos de dados podem fazer uso frequente das tabelas `INFORMATION_SCHEMA`. Certos tipos de consultas para as tabelas `INFORMATION_SCHEMA` podem ser otimizados para executar mais rapidamente. O objetivo é minimizar as operações de arquivo (por exemplo, varredura de um diretório ou abertura de um arquivo de tabela) para coletar as informações que compõem essas tabelas dinâmicas.

Nota

O comportamento de comparação para nomes de banco de dados e tabelas em consultas de `INFORMATION_SCHEMA` pode diferir do que você espera. Para obter detalhes, consulte a Seção 10.8.7, “Usando a Colaboração em Pesquisas do SCHEMA_INFORMÁTICO”.

**1) Tente usar valores de consulta constantes para os nomes de banco de dados e tabela na cláusula `WHERE`**

Você pode aproveitar esse princípio da seguinte forma:

* Para consultar bancos de dados ou tabelas, use expressões que resultem em uma constante, como valores literais, funções que retornam uma constante ou subconsultas escalares.

* Evite consultas que utilizem um valor de busca de nome de banco de dados não constante (ou sem valor de busca), porque elas exigem uma varredura do diretório de dados para encontrar nomes de diretórios de banco de dados correspondentes.

* Dentro de um banco de dados, evite consultas que utilizem um valor de busca de nome de tabela não constante (ou sem valor de busca), porque elas exigem uma varredura do diretório do banco de dados para encontrar arquivos de tabela correspondentes.

Este princípio se aplica às tabelas `INFORMATION_SCHEMA` mostradas na tabela a seguir, que mostra as colunas para as quais um valor de busca constante permite que o servidor evite uma varredura de diretório. Por exemplo, se você estiver selecionando a partir de `TABLES`, usar um valor de busca constante para `TABLE_SCHEMA` na cláusula `WHERE` permite que uma varredura de diretório de dados seja evitada.

<table summary="INFORMATION_SCHEMA tables and table columns for which a constant lookup value enables the server to avoid directory scans.">
<col style="width: 34%"/>
<col style="width: 33%"/>
<col style="width: 33%"/>
<thead>
<tr>
<th>Tabela</th>
<th>Coluna para especificar para evitar varredura do diretório de dados</th>
<th>Coluna para especificar para evitar varredura do diretório do banco de dados</th>
</tr>
</thead>
<tbody>
<tr>
<th><code>COLUMNS</code></th>
<td><code>TABLE_SCHEMA</code></td>
<td><code>TABLE_NAME</code></td>
</tr>
<tr>
<th><code>KEY_COLUMN_USAGE</code></th>
<td><code>TABLE_SCHEMA</code></td>
<td><code>TABLE_NAME</code></td>
</tr>
<tr>
<th><code>PARTITIONS</code></th>
<td><code>TABLE_SCHEMA</code></td>
<td><code>TABLE_NAME</code></td>
</tr>
<tr>
<th><code>REFERENTIAL_CONSTRAINTS</code></th>
<td><code>CONSTRAINT_SCHEMA</code></td>
<td><code>TABLE_NAME</code></td>
</tr>
<tr>
<th><code>STATISTICS</code></th>
<td><code>TABLE_SCHEMA</code></td>
<td><code>TABLE_NAME</code></td>
</tr>
<tr>
<th><code>TABLES</code></th>
<td><code>TABLE_SCHEMA</code></td>
<td><code>TABLE_NAME</code></td>
</tr>
<tr>
<th><code>TABLE_CONSTRAINTS</code></th>
<td><code>TABLE_SCHEMA</code></td>
<td><code>TABLE_NAME</code></td>
</tr>
<tr>
<th><code>TRIGGERS</code></th>
<td><code>EVENT_OBJECT_SCHEMA</code></td>
<td><code>EVENT_OBJECT_TABLE</code></td>
</tr>
<tr>
<th><code>VIEWS</code></th>
<td><code>TABLE_SCHEMA</code></td>
<td><code>TABLE_NAME</code></td>
</tr>
</tbody>
</table>

A vantagem de uma consulta que é limitada a um nome específico de banco de dados constante é que as verificações precisam ser feitas apenas para o diretório do banco de dados nomeado. Exemplo:

```sql
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'test';
```

O uso do nome literal do banco de dados `test` permite que o servidor verifique apenas o diretório do banco de dados `test`, independentemente de quantos bancos de dados possam existir. Em contraste, a seguinte consulta é menos eficiente, pois exige uma varredura do diretório de dados para determinar quais nomes de banco de dados correspondem ao padrão `'test%'`:

```sql
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA LIKE 'test%';
```

Para uma consulta que é limitada a um nome específico de tabela constante, as verificações precisam ser feitas apenas para a tabela nomeada dentro do diretório do banco de dados correspondente. Exemplo:

```sql
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'test' AND TABLE_NAME = 't1';
```

O uso do nome literal da tabela `t1` permite que o servidor verifique apenas os arquivos da tabela `t1`, independentemente de quantas tabelas possam existir no diretório do banco de dados `test`. Em contraste, a seguinte consulta exige uma varredura do diretório do banco de dados `test` para determinar quais nomes de tabela correspondem ao padrão `'t%'`:

```sql
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'test' AND TABLE_NAME LIKE 't%';
```

A consulta a seguir requer uma varredura do diretório do banco de dados para determinar os nomes de banco de dados correspondentes ao padrão `'test%'`, e, para cada banco de dados correspondente, requer uma varredura do diretório do banco de dados para determinar os nomes de tabela correspondentes ao padrão `'t%'`:

```sql
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'test%' AND TABLE_NAME LIKE 't%';
```

**2) Escreva consultas que minimizem o número de arquivos de tabela que devem ser abertos**

Para consultas que se referem a certas colunas da tabela `INFORMATION_SCHEMA`, há várias otimizações disponíveis que minimizam o número de arquivos de tabela que devem ser abertos. Exemplo:

```sql
SELECT TABLE_NAME, ENGINE FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'test';
```

Neste caso, após o servidor ter verificado o diretório do banco de dados para determinar os nomes das tabelas no banco de dados, esses nomes ficam disponíveis sem mais buscas no sistema de arquivos. Assim, o `TABLE_NAME` não requer que arquivos sejam abertos. O valor do `ENGINE` (motor de armazenamento) pode ser determinado abrindo o arquivo da tabela `.frm`, sem tocar em outros arquivos de tabela, como o arquivo `.MYD` ou `.MYI`.

Alguns valores, como `INDEX_LENGTH` para as tabelas `MyISAM`, também exigem a abertura do arquivo `.MYD` ou `.MYI`.

Os tipos de otimização de abertura de arquivo são indicados da seguinte forma:

* `SKIP_OPEN_TABLE`: Não é necessário abrir os arquivos de tabela. As informações já se tornaram disponíveis na consulta ao digitalizar o diretório do banco de dados.

* `OPEN_FRM_ONLY`: Apenas o arquivo `.frm` da tabela precisa ser aberto.

* `OPEN_TRIGGER_ONLY`: Apenas o arquivo `.TRG` da tabela precisa ser aberto.

* `OPEN_FULL_TABLE`: A busca de informações não otimizada. Os arquivos `.frm`, `.MYD` e `.MYI` devem ser abertos.

A lista a seguir indica como os tipos de otimização anteriores se aplicam às colunas da tabela `INFORMATION_SCHEMA`. Para tabelas e colunas não nomeadas, nenhuma das otimizações se aplica.

* `COLUMNS`: `OPEN_FRM_ONLY` se aplica a todas as colunas

* `KEY_COLUMN_USAGE`: `OPEN_FULL_TABLE` se aplica a todas as colunas

* `PARTITIONS`: `OPEN_FULL_TABLE` se aplica a todas as colunas

* `REFERENTIAL_CONSTRAINTS`: `OPEN_FULL_TABLE` se aplica a todas as colunas

* `STATISTICS`:

<table summary="Optimization types that apply to INFORMATION_SCHEMA STATISTICS table columns.">
<col style="width: 50%"/>
<col style="width: 50%"/>
<thead>
<tr>
<th>Column</th>
<th>Optimization type</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>TABLE_CATALOG</code></td>
<td><code>OPEN_FRM_ONLY</code></td>
</tr>
<tr>
<td><code>TABLE_SCHEMA</code></td>
<td><code>OPEN_FRM_ONLY</code></td>
</tr>
<tr>
<td><code>TABLE_NAME</code></td>
<td><code>OPEN_FRM_ONLY</code></td>
</tr>
<tr>
<td><code>NON_UNIQUE</code></td>
<td><code>OPEN_FRM_ONLY</code></td>
</tr>
<tr>
<td><code>INDEX_SCHEMA</code></td>
<td><code>OPEN_FRM_ONLY</code></td>
</tr>
<tr>
<td><code>INDEX_NAME</code></td>
<td><code>OPEN_FRM_ONLY</code></td>
</tr>
<tr>
<td><code>SEQ_IN_INDEX</code></td>
<td><code>OPEN_FRM_ONLY</code></td>
</tr>
<tr>
<td><code>COLUMN_NAME</code></td>
<td><code>OPEN_FRM_ONLY</code></td>
</tr>
<tr>
<td><code>COLLATION</code></td>
<td><code>OPEN_FRM_ONLY</code></td>
</tr>
<tr>
<td><code>CARDINALITY</code></td>
<td><code>OPEN_FULL_TABLE</code></td>
</tr>
<tr>
<td><code>SUB_PART</code></td>
<td><code>OPEN_FRM_ONLY</code></td>
</tr>
<tr>
<td><code>PACKED</code></td>
<td><code>OPEN_FRM_ONLY</code></td>
</tr>
<tr>
<td><code>NULLABLE</code></td>
<td><code>OPEN_FRM_ONLY</code></td>
</tr>
<tr>
<td><code>INDEX_TYPE</code></td>
<td><code>OPEN_FULL_TABLE</code></td>
</tr>
<tr>
<td><code>COMMENT</code></td>
<td><code>OPEN_FRM_ONLY</code></td>
</tr>
</tbody>
</table>

* `TABLES`:

  <table summary="Optimization types that apply to INFORMATION_SCHEMA TABLES table columns."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Column</th> <th>Optimization type</th> </tr></thead><tbody><tr> <td><code>TABLE_CATALOG</code></td> <td><code>SKIP_OPEN_TABLE</code></td> </tr><tr> <td><code>TABLE_SCHEMA</code></td> <td><code>SKIP_OPEN_TABLE</code></td> </tr><tr> <td><code>TABLE_NAME</code></td> <td><code>SKIP_OPEN_TABLE</code></td> </tr><tr> <td><code>TABLE_TYPE</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>ENGINE</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>VERSION</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>ROW_FORMAT</code></td> <td><code>OPEN_FULL_TABLE</code></td> </tr><tr> <td><code>TABLE_ROWS</code></td> <td><code>OPEN_FULL_TABLE</code></td> </tr><tr> <td><code>AVG_ROW_LENGTH</code></td> <td><code>OPEN_FULL_TABLE</code></td> </tr><tr> <td><code>DATA_LENGTH</code></td> <td><code>OPEN_FULL_TABLE</code></td> </tr><tr> <td><code>MAX_DATA_LENGTH</code></td> <td><code>OPEN_FULL_TABLE</code></td> </tr><tr> <td><code>INDEX_LENGTH</code></td> <td><code>OPEN_FULL_TABLE</code></td> </tr><tr> <td><code>DATA_FREE</code></td> <td><code>OPEN_FULL_TABLE</code></td> </tr><tr> <td><code>AUTO_INCREMENT</code></td> <td><code>OPEN_FULL_TABLE</code></td> </tr><tr> <td><code>CREATE_TIME</code></td> <td><code>OPEN_FULL_TABLE</code></td> </tr><tr> <td><code>UPDATE_TIME</code></td> <td><code>OPEN_FULL_TABLE</code></td> </tr><tr> <td><code>CHECK_TIME</code></td> <td><code>OPEN_FULL_TABLE</code></td> </tr><tr> <td><code>TABLE_COLLATION</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>CHECKSUM</code></td> <td><code>OPEN_FULL_TABLE</code></td> </tr><tr> <td><code>CREATE_OPTIONS</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>TABLE_COMMENT</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr></tbody></table>

* `TABLE_CONSTRAINTS`: `OPEN_FULL_TABLE` se aplica a todas as colunas

* `TRIGGERS`: `OPEN_TRIGGER_ONLY` se aplica a todas as colunas

* `VIEWS`:

  <table summary="Optimization types that apply to INFORMATION_SCHEMA VIEWS table columns."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Column</th> <th>Optimization type</th> </tr></thead><tbody><tr> <td><code>TABLE_CATALOG</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>TABLE_SCHEMA</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>TABLE_NAME</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>VIEW_DEFINITION</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>CHECK_OPTION</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>IS_UPDATABLE</code></td> <td><code>OPEN_FULL_TABLE</code></td> </tr><tr> <td><code>DEFINER</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>SECURITY_TYPE</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>CHARACTER_SET_CLIENT</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>COLLATION_CONNECTION</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr></tbody></table>

**3) Use `EXPLAIN` para determinar se o servidor pode usar as otimizações de `INFORMATION_SCHEMA` para uma consulta**

Isso se aplica especialmente às consultas `INFORMATION_SCHEMA` que buscam informações de mais de um banco de dados, o que pode levar muito tempo e impactar o desempenho. O valor `Extra` no `EXPLAIN` de saída indica quais, se houver, das otimizações descritas anteriormente o servidor pode usar para avaliar as consultas `INFORMATION_SCHEMA`. Os seguintes exemplos demonstram os tipos de informações que você pode esperar ver no valor `Extra`.

```sql
mysql> EXPLAIN SELECT TABLE_NAME FROM INFORMATION_SCHEMA.VIEWS WHERE
       TABLE_SCHEMA = 'test' AND TABLE_NAME = 'v1'\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: VIEWS
         type: ALL
possible_keys: NULL
          key: TABLE_SCHEMA,TABLE_NAME
      key_len: NULL
          ref: NULL
         rows: NULL
        Extra: Using where; Open_frm_only; Scanned 0 databases
```

O uso de valores constantes de busca em banco de dados e tabelas permite que o servidor evite varreduras de diretório. Para referências a `VIEWS.TABLE_NAME`, apenas o arquivo `.frm` precisa ser aberto.

```sql
mysql> EXPLAIN SELECT TABLE_NAME, ROW_FORMAT FROM INFORMATION_SCHEMA.TABLES\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: TABLES
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: NULL
        Extra: Open_full_table; Scanned all databases
```

Não são fornecidos valores de pesquisa (não há cláusula `WHERE`), então o servidor deve analisar o diretório de dados e cada diretório de banco de dados. Para cada tabela assim identificada, o nome da tabela e o formato de string são selecionados. `TABLE_NAME` não requer que mais arquivos de tabela sejam abertos (a otimização `SKIP_OPEN_TABLE` se aplica). `ROW_FORMAT` requer que todos os arquivos de tabela sejam abertos (`OPEN_FULL_TABLE` se aplica). `EXPLAIN` relata `OPEN_FULL_TABLE` porque é mais caro do que `SKIP_OPEN_TABLE`.

```sql
mysql> EXPLAIN SELECT TABLE_NAME, TABLE_TYPE FROM INFORMATION_SCHEMA.TABLES
       WHERE TABLE_SCHEMA = 'test'\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: TABLES
         type: ALL
possible_keys: NULL
          key: TABLE_SCHEMA
      key_len: NULL
          ref: NULL
         rows: NULL
        Extra: Using where; Open_frm_only; Scanned 1 database
```

Não há valor de pesquisa de nome de tabela fornecido, então o servidor deve analisar o diretório do banco de dados `test`. Para as colunas `TABLE_NAME` e `TABLE_TYPE`, as otimizações `SKIP_OPEN_TABLE` e `OPEN_FRM_ONLY` se aplicam, respectivamente. O `EXPLAIN` relata `OPEN_FRM_ONLY` porque é mais caro.

```sql
mysql> EXPLAIN SELECT B.TABLE_NAME
       FROM INFORMATION_SCHEMA.TABLES AS A, INFORMATION_SCHEMA.COLUMNS AS B
       WHERE A.TABLE_SCHEMA = 'test'
       AND A.TABLE_NAME = 't1'
       AND B.TABLE_NAME = A.TABLE_NAME\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: A
         type: ALL
possible_keys: NULL
          key: TABLE_SCHEMA,TABLE_NAME
      key_len: NULL
          ref: NULL
         rows: NULL
        Extra: Using where; Skip_open_table; Scanned 0 databases
*************************** 2. row ***************************
           id: 1
  select_type: SIMPLE
        table: B
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: NULL
        Extra: Using where; Open_frm_only; Scanned all databases;
               Using join buffer
```

Para a primeira string de saída `EXPLAIN`: os valores constantes de busca em banco de dados e tabela permitem que o servidor evite varreduras de diretório para valores de `TABLES`. As referências a `TABLES.TABLE_NAME` não requerem mais arquivos de tabela.

Para a segunda string de saída do `EXPLAIN`: Todos os valores da tabela `COLUMNS` são consultas `OPEN_FRM_ONLY`, portanto, o `COLUMNS.TABLE_NAME` requer que o arquivo `.frm` seja aberto.

```sql
mysql> EXPLAIN SELECT * FROM INFORMATION_SCHEMA.COLLATIONS\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: COLLATIONS
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: NULL
        Extra:
```

Neste caso, nenhuma otimização é aplicada porque `COLLATIONS` não é uma das tabelas `INFORMATION_SCHEMA` para as quais são disponíveis otimizações.

### 8.2.4 Otimizando declarações de alteração de dados

Esta seção explica como acelerar as declarações de mudança de dados: `INSERT`, `UPDATE` e `DELETE`. Aplicações tradicionais OLTP e aplicações modernas da web tipicamente realizam muitas pequenas operações de mudança de dados, onde a concorrência é vital. Aplicações de análise e relatórios de dados tipicamente executam operações de mudança de dados que afetam muitas strings de uma vez, onde as principais considerações são o I/O para escrever grandes quantidades de dados e manter os índices atualizados. Para inserir e atualizar grandes volumes de dados (conhecidos na indústria como ETL, para “extrair-transformar-carregar”), às vezes você usa outras declarações SQL ou comandos externos, que imitam os efeitos das declarações `INSERT`, `UPDATE` e `DELETE`.

#### 8.2.4.1 Otimizando instruções INSERT

Para otimizar a velocidade de inserção, combine muitas operações pequenas em uma única operação grande. Idealmente, faça uma única conexão, envie os dados para muitas novas strings de uma só vez e adiar todas as atualizações de índice e verificação de consistência até o final.

O tempo necessário para inserir uma string é determinado pelos seguintes fatores, onde os números indicam proporções aproximadas:

* Conectando: (3)
* Enviando consulta ao servidor: (2)
* Parsing consulta: (2)
* Inserindo string: (1 × tamanho da string)
* Inserindo índices: (1 × número de índices)
* Fechando: (1)

Isso não leva em consideração o custo inicial para abrir tabelas, que é feito uma vez para cada consulta que está sendo executada simultaneamente.

O tamanho da tabela desacelera a inserção de índices por log *`N`*, assumindo índices de árvore B.

Você pode usar os seguintes métodos para acelerar as inserções:

* Se você está inserindo muitas strings do mesmo cliente ao mesmo tempo, use as declarações `INSERT` com várias listas `VALUES` para inserir várias strings de cada vez. Isso é consideravelmente mais rápido (muitas vezes mais rápido em alguns casos) do que usar declarações separadas de uma única string `INSERT`. Se você está adicionando dados a uma tabela não vazia, pode ajustar a variável `bulk_insert_buffer_size` para tornar a inserção de dados ainda mais rápida. Veja a Seção 5.1.7, “Variáveis do Sistema do Servidor”.

* Ao carregar uma tabela a partir de um arquivo de texto, use `LOAD DATA`. Isso geralmente é 20 vezes mais rápido do que usar as instruções `INSERT`. Veja a Seção 13.2.6, “Instrução LOAD DATA”.

* Aproveite o fato de que as colunas têm valores padrão. Insira valores explicitamente apenas quando o valor a ser inserido difere do padrão. Isso reduz a análise que o MySQL deve fazer e melhora a velocidade de inserção.

* Veja a Seção 8.5.5, “Carregamento de Dados em Massa para Tabelas InnoDB”, para dicas específicas para as tabelas `InnoDB`.

* Veja a Seção 8.6.2, “Carregamento de Dados em Massa para Tabelas MyISAM”, para dicas específicas para as tabelas `MyISAM`.

#### 8.2.4.2 Otimizando declarações UPDATE

Uma declaração de atualização é otimizada como uma consulta `SELECT` com o sobrecarga adicional de uma escrita. A velocidade da escrita depende da quantidade de dados que estão sendo atualizados e do número de índices que estão sendo atualizados. Os índices que não são alterados não são atualizados.

Outra maneira de obter atualizações rápidas é adiar as atualizações e, em seguida, fazer muitas atualizações em sequência mais tarde. Realizar várias atualizações ao mesmo tempo é muito mais rápido do que fazer uma de cada vez, se você bloquear a tabela.

Para uma tabela `MyISAM` que utiliza formato de string dinâmico, atualizar uma string para um comprimento total mais longo pode dividir a string. Se você fizer isso com frequência, é muito importante usar ocasionalmente `OPTIMIZE TABLE`. Veja a Seção 13.7.2.4, “Instrução OPTIMIZE TABLE”.

#### 8.2.4.3 Otimizando declarações DELETE

O tempo necessário para excluir strings individuais em uma tabela `MyISAM` é exatamente proporcional ao número de índices. Para excluir as strings mais rapidamente, você pode aumentar o tamanho do cache de chave aumentando a variável de sistema `key_buffer_size`. Veja a Seção 5.1.1, “Configurando o servidor”.

Para excluir todas as strings de uma tabela `MyISAM`, `TRUNCATE TABLE tbl_name` é mais rápido do que `DELETE FROM tbl_name`. As operações de truncar não são seguras em transação; ocorre um erro ao tentar uma delas durante uma transação ativa ou bloqueio de tabela ativo. Veja a Seção 13.1.34, “Instrução TRUNCATE TABLE”.

### 8.2.5 Otimizando privilégios do banco de dados

Quanto mais complexo o seu conjunto de privilégios, mais overhead é aplicado a todas as declarações SQL. Simplificar os privilégios estabelecidos pelas declarações `GRANT` permite que o MySQL reduza o overhead de verificação de permissões quando os clientes executam declarações. Por exemplo, se você não conceder quaisquer privilégios em nível de tabela ou coluna, o servidor não precisa verificar o conteúdo das tabelas `tables_priv` e `columns_priv`. Da mesma forma, se você não estabelecer limites de recursos em nenhuma conta, o servidor não precisa realizar contagem de recursos. Se você tiver uma carga de processamento de declarações muito alta, considere usar uma estrutura de concessão simplificada para reduzir o overhead de verificação de permissões.

### 8.2.6 Outras dicas de otimização

Esta seção lista uma série de dicas variadas para melhorar a velocidade do processamento de consultas:

* Se sua aplicação fizer várias solicitações ao banco de dados para realizar atualizações relacionadas, combinar as declarações em uma rotina armazenada pode ajudar no desempenho. Da mesma forma, se sua aplicação calcular um único resultado com base em vários valores de coluna ou grandes volumes de dados, combinar a computação em uma função carregável pode ajudar no desempenho. As operações de banco de dados rápidas resultantes então estão disponíveis para serem reutilizadas por outras consultas, aplicações e até mesmo código escrito em diferentes linguagens de programação. Consulte a Seção 23.2, “Usando Rotinas Armazenadas” e Adicionando Funções ao MySQL para mais informações.

* Para corrigir quaisquer problemas de compressão que ocorram com as tabelas `ARCHIVE`, use `OPTIMIZE TABLE`. Veja a Seção 15.5, “O Motor de Armazenamento ARCHIVE”.

* Se possível, classifique os relatórios como "ao vivo" ou como "estatísticos", onde os dados necessários para relatórios estatísticos são criados apenas a partir de tabelas resumidas que são geradas periodicamente a partir dos dados ao vivo.

* Se você tiver dados que não se encaixam bem em uma estrutura de tabela de strings e colunas, você pode embalar e armazenar dados em uma coluna `BLOB`. Nesse caso, você deve fornecer código em sua aplicação para embalar e desembalar informações, mas isso pode economizar operações de E/S para ler e escrever conjuntos de valores relacionados.

* Com servidores da Web, armazene imagens e outros ativos binários como arquivos, com o nome do caminho armazenado no banco de dados em vez do próprio arquivo. A maioria dos servidores da Web é melhor em cache de arquivos do que em conteúdo de banco de dados, então usar arquivos é geralmente mais rápido. (Embora você deva lidar com backups e questões de armazenamento por conta própria neste caso.)

* Se você precisa de uma velocidade realmente alta, veja as interfaces de nível baixo do MySQL. Por exemplo, ao acessar diretamente o mecanismo de armazenamento `InnoDB` ou `MyISAM` do MySQL, você pode obter um aumento substancial de velocidade em comparação com o uso da interface SQL.

Da mesma forma, para bancos de dados que utilizam o mecanismo de armazenamento `NDBCLUSTER`, você pode querer investigar o uso possível da API NDB (consulte o Guia do Desenvolvedor da API MySQL NDB Cluster).

* A replicação pode proporcionar um benefício de desempenho para algumas operações. Você pode distribuir as recuperações dos clientes entre as réplicas para dividir a carga. Para evitar o atraso da fonte ao fazer backups, você pode fazer backups usando uma réplica. Veja o Capítulo 16, *Replicação*.