#### 10.2.1.3 Otimização da Mesclagem de Índices

O método de acesso de junção de índice recupera linhas com múltiplas varreduras `range` e une seus resultados em uma única. Esse método de acesso une varreduras de índice de uma única tabela, não varreduras em várias tabelas. A junção pode produzir uniões, interseções ou uniões de interseções de suas varreduras subjacentes.

Exemplos de consultas para as quais a junção de índice pode ser usada:

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

Nota

O algoritmo de otimização de junção de índice tem as seguintes limitações conhecidas:

- Se sua consulta tiver uma cláusula `WHERE` complexa com uma profundidade de `AND`/`OR` nesting e o MySQL não escolher o plano ótimo, tente distribuir os termos usando as seguintes transformações de identidade:

  ```
  (x AND y) OR z => (x OR z) AND (y OR z)
  (x OR y) AND z => (x AND z) OR (y AND z)
  ```

- A opção de mesclagem de índice não é aplicável a índices de texto completo.

Na saída `EXPLAIN`, o método de junção de índices aparece como `index_merge` na coluna `type`. Neste caso, a coluna `key` contém uma lista de índices usados, e `key_len` contém uma lista das partes de chave mais longas para esses índices.

O método de acesso à junção de índices tem vários algoritmos, que são exibidos no campo `Extra` da saída `EXPLAIN`:

- `Using intersect(...)`
- `Using union(...)`
- `Using sort_union(...)`

As seções a seguir descrevem esses algoritmos com mais detalhes. O otimizador escolhe entre diferentes algoritmos possíveis de Mesclagem de Índices e outros métodos de acesso com base nas estimativas de custo das várias opções disponíveis.

- Índice de junção do algoritmo de acesso à interseção
- Índice de junção de união de algoritmos de acesso
- Índice Merge Sort-União Algoritmo de Acesso
- Influenciando a Otimização da Fusão do Índice

##### Índice de junção do algoritmo de acesso à interseção

Este algoritmo de acesso é aplicável quando uma cláusula `WHERE` é convertida em várias condições de intervalo em diferentes chaves combinadas com `AND`, e cada condição é uma das seguintes:

- Uma expressão de `N`-parte desta forma, onde o índice tem exatamente `N` partes (ou seja, todas as partes do índice estão cobertas):

  ```
  key_part1 = const1 AND key_part2 = const2 ... AND key_partN = constN
  ```

- Qualquer condição de intervalo sobre a chave primária de uma tabela `InnoDB`.

Exemplos:

```
SELECT * FROM innodb_table
  WHERE primary_key < 10 AND key_col1 = 20;

SELECT * FROM tbl_name
  WHERE key1_part1 = 1 AND key1_part2 = 2 AND key2 = 2;
```

O algoritmo de interseção de junção de índices realiza varreduras simultâneas em todos os índices usados e produz a interseção das sequências de linhas que recebe das varreduras de índice juncionado.

Se todas as colunas usadas na consulta estiverem cobertas pelos índices usados, as linhas inteiras da tabela não serão recuperadas (o resultado `EXPLAIN` contém `Using index` no campo `Extra` neste caso). Aqui está um exemplo de tal consulta:

```
SELECT COUNT(*) FROM t1 WHERE key1 = 1 AND key2 = 1;
```

Se os índices usados não cobrem todas as colunas usadas na consulta, as linhas completas são recuperadas apenas quando as condições de intervalo para todas as chaves usadas forem atendidas.

Se uma das condições unidas for uma condição sobre a chave primária de uma tabela `InnoDB`, ela não é usada para recuperar linhas, mas sim para filtrar as linhas recuperadas usando outras condições.

##### Índice de junção de união de algoritmos de acesso

Os critérios deste algoritmo são semelhantes aos do algoritmo de interseção de junção de índices. O algoritmo é aplicável quando a cláusula `WHERE` da tabela é convertida em várias condições de intervalo em diferentes chaves combinadas com `OR`, e cada condição é uma das seguintes:

- Uma expressão de `N`-parte desta forma, onde o índice tem exatamente `N` partes (ou seja, todas as partes do índice estão cobertas):

  ```
  key_part1 = const1 OR key_part2 = const2 ... OR key_partN = constN
  ```

- Qualquer condição de intervalo sobre uma chave primária de uma tabela `InnoDB`.

- Uma condição para a qual o algoritmo de interseção de junção de índices é aplicável.

Exemplos:

```
SELECT * FROM t1
  WHERE key1 = 1 OR key2 = 2 OR key3 = 3;

SELECT * FROM innodb_table
  WHERE (key1 = 1 AND key2 = 2)
     OR (key3 = 'foo' AND key4 = 'bar') AND key5 = 5;
```

##### Índice Merge Sort-União Algoritmo de Acesso

Este algoritmo de acesso é aplicável quando a cláusula `WHERE` é convertida em várias condições de intervalo combinadas por `OR`, mas o algoritmo de união de junção de índice não é aplicável.

Exemplos:

```
SELECT * FROM tbl_name
  WHERE key_col1 < 10 OR key_col2 < 20;

SELECT * FROM tbl_name
  WHERE (key_col1 > 10 OR key_col2 = 20) AND nonkey_col = 30;
```

A diferença entre o algoritmo de união por ordenação e o algoritmo de união é que o algoritmo de união por ordenação deve primeiro buscar os IDs das linhas para todas as linhas e ordená-las antes de retornar qualquer linha.

##### Influenciando a Otimização da Fusão do Índice

O uso da junção de índices está sujeito ao valor das bandeiras `index_merge`, `index_merge_intersection`, `index_merge_union` e `index_merge_sort_union` da variável de sistema `optimizer_switch`. Consulte a Seção 10.9.2, “Otimizações Alternativas”. Por padrão, todas essas bandeiras são `on`. Para habilitar apenas certos algoritmos, defina `index_merge` para `off` e habilite apenas aqueles outros que devem ser permitidos.

Além de usar a variável de sistema `optimizer_switch` para controlar o uso do otimizador dos algoritmos de junção de índices em toda a sessão, o MySQL suporta dicas de otimizador para influenciar o otimizador em uma base por declaração. Veja a Seção 10.9.3, “Dicas de Otimizador”.
