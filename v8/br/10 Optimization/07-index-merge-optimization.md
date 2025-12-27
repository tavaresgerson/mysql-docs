#### 10.2.1.3 Otimização da Fusão de Índices

O método de acesso por fusão de índices recupera linhas com múltiplas varreduras de `range` e combina seus resultados em um único conjunto. Esse método de acesso combina varreduras de índices de uma única tabela, não varreduras entre múltiplas tabelas. A fusão pode produzir uniões, interseções ou uniões-de-interseções de suas varreduras subjacentes.

Consultas de exemplo para as quais a fusão de índices pode ser usada:

```
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

::: info Nota

O algoritmo de otimização da fusão de índices tem as seguintes limitações conhecidas:

* Se sua consulta tiver uma cláusula `WHERE` complexa com profundidade de aninhamento `AND`/`OR` e o MySQL não escolher o plano ótimo, tente distribuir os termos usando as seguintes transformações de identidade:

  ```
  (x AND y) OR z => (x OR z) AND (y OR z)
  (x OR y) AND z => (x AND z) OR (y AND z)
  ```
* A fusão de índices não é aplicável a índices de texto completo.

:::

Na saída `EXPLAIN`, o método de acesso por fusão de índices aparece como `index_merge` na coluna `type`. Neste caso, a coluna `key` contém uma lista de índices usados e `key_len` contém uma lista das partes de chave mais longas para esses índices.

O método de acesso por fusão de índices tem vários algoritmos, que são exibidos no campo `Extra` da saída `EXPLAIN`:

* `Using intersect(...)`
* `Using union(...)`
* `Using sort_union(...)`

As seções seguintes descrevem esses algoritmos com mais detalhes. O otimizador escolhe entre diferentes algoritmos possíveis de fusão de índices e outros métodos de acesso com base nas estimativas de custo das várias opções disponíveis.

*  Algoritmo de Acesso por Fusão de Índices de Interseção
*  Algoritmo de Acesso por Fusão de Índices de União
*  Algoritmo de Acesso por Fusão de Índices de Ordenação-União
*  Influenciando a Otimização da Fusão de Índices

##### Algoritmo de Acesso por Fusão de Índices de Interseção

Este algoritmo de acesso é aplicável quando uma cláusula `WHERE` é convertida em várias condições de intervalo em diferentes chaves combinadas com `AND`, e cada condição é uma das seguintes:

* Uma expressão de *`N`*-partes desta forma, onde o índice tem exatamente *`N`* partes (ou seja, todas as partes da chave são cobertas):

* Qualquer condição de intervalo sobre a chave primária de uma tabela `InnoDB`.

Exemplos:

```
  key_part1 = const1 AND key_part2 = const2 ... AND key_partN = constN
  ```

O algoritmo de junção de índice realiza varreduras simultâneas em todos os índices usados e produz a interseção das sequências de linhas que recebe das varreduras de índice juncionado.

Se todas as colunas usadas na consulta forem cobertas pelos índices usados, as linhas inteiras da tabela não são recuperadas (a saída do `EXPLAIN` contém `Usando índice` no campo `Extra` neste caso). Aqui está um exemplo de tal consulta:

```
SELECT * FROM innodb_table
  WHERE primary_key < 10 AND key_col1 = 20;

SELECT * FROM tbl_name
  WHERE key1_part1 = 1 AND key1_part2 = 2 AND key2 = 2;
```

Se os índices usados não cobrirem todas as colunas usadas na consulta, as linhas inteiras são recuperadas apenas quando as condições de intervalo para todas as chaves usadas são satisfeitas.

Se uma das condições juncionadas for uma condição sobre a chave primária de uma tabela `InnoDB`, ela não é usada para a recuperação de linhas, mas é usada para filtrar as linhas recuperadas usando outras condições.

##### Algoritmo de Acesso de Junção de Índice

Os critérios para este algoritmo são semelhantes aos do algoritmo de junção de índice interseção. O algoritmo é aplicável quando a cláusula `WHERE` da tabela é convertida em várias condições de intervalo em diferentes chaves combinadas com `OR`, e cada condição é uma das seguintes:

* Uma expressão de *`N`*-partes desta forma, onde o índice tem exatamente *`N`* partes (ou seja, todas as partes do índice são cobertas):

  ```
SELECT COUNT(*) FROM t1 WHERE key1 = 1 AND key2 = 1;
```
* Qualquer condição de intervalo sobre uma chave primária de uma tabela `InnoDB`.
* Uma condição para a qual o algoritmo de junção de índice interseção seja aplicável.

Exemplos:

```
  key_part1 = const1 OR key_part2 = const2 ... OR key_partN = constN
  ```

##### Algoritmo de Acesso de Junção de Ordenação e Unificação de Índice

Este algoritmo de acesso é aplicável quando a cláusula `WHERE` é convertida em várias condições de intervalo combinadas por `OR`, mas o algoritmo de junção de índice não é aplicável.

Exemplos:

```
SELECT * FROM t1
  WHERE key1 = 1 OR key2 = 2 OR key3 = 3;

SELECT * FROM innodb_table
  WHERE (key1 = 1 AND key2 = 2)
     OR (key3 = 'foo' AND key4 = 'bar') AND key5 = 5;
```

A diferença entre o algoritmo de ordenação e união e o algoritmo de junção é que o algoritmo de ordenação e união deve primeiro recuperar os IDs de linha para todas as linhas e ordená-las antes de retornar quaisquer linhas.

O uso da junção de índices está sujeito aos valores das flags `index_merge`, `index_merge_intersection`, `index_merge_union` e `index_merge_sort_union` da variável de sistema `optimizer_switch`. Consulte a Seção 10.9.2, “Otimizações comutadas”. Por padrão, todas essas flags estão ativadas. Para habilitar apenas certos algoritmos, defina `index_merge` para `off` e habilite apenas aqueles que devem ser permitidos.

Além de usar a variável de sistema `optimizer_switch` para controlar o uso do otimizador dos algoritmos de junção de índices em nível de sessão, o MySQL suporta dicas de otimizador para influenciar o otimizador em nível de declaração. Consulte a Seção 10.9.3, “Dicas de otimizador”.