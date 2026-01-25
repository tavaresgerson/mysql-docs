#### 8.2.1.14 Otimização de ORDER BY

Esta seção descreve quando o MySQL pode usar um Index para satisfazer uma cláusula `ORDER BY`, a operação `filesort` usada quando um Index não pode ser utilizado e as informações do plano de execução disponíveis no otimizador sobre `ORDER BY`.

Um `ORDER BY` com e sem `LIMIT` pode retornar linhas em ordens diferentes, conforme discutido na Seção 8.2.1.17, “Otimização de Querys com LIMIT”.

* Uso de Indexes para Satisfazer ORDER BY
* Uso de `filesort` para Satisfazer ORDER BY
* Influenciando a Otimização de ORDER BY
* Informações Disponíveis do Plano de Execução de ORDER BY

##### Uso de Indexes para Satisfazer ORDER BY

Em alguns casos, o MySQL pode usar um Index para satisfazer uma cláusula `ORDER BY` e evitar a classificação (sorting) extra envolvida na execução de uma operação `filesort`.

O Index também pode ser usado mesmo que o `ORDER BY` não corresponda exatamente ao Index, contanto que todas as partes não utilizadas do Index e todas as colunas `ORDER BY` extras sejam constantes na cláusula `WHERE`. Se o Index não contiver todas as colunas acessadas pela Query, o Index será usado apenas se o acesso ao Index for mais barato do que outros métodos de acesso.

Assumindo que haja um Index em `(key_part1, key_part2)`, as seguintes Querys podem usar o Index para resolver a parte `ORDER BY`. Se o otimizador realmente o fará depende de se a leitura do Index é mais eficiente do que um table scan (leitura completa da tabela) caso as colunas que não estão no Index também precisem ser lidas.

* Nesta Query, o Index em `(key_part1, key_part2)` permite ao otimizador evitar a classificação:

  ```sql
  SELECT * FROM t1
    ORDER BY key_part1, key_part2;
  ```

  No entanto, a Query usa `SELECT *`, o que pode selecionar mais colunas do que *`key_part1`* e *`key_part2`*. Nesse caso, escanear um Index inteiro e procurar linhas da tabela para encontrar colunas que não estão no Index pode ser mais caro do que escanear a tabela e classificar os resultados. Se for esse o caso, é provável que o otimizador não use o Index. Se `SELECT *` selecionar apenas as colunas do Index, o Index será usado e a classificação será evitada.

  Se `t1` for uma tabela `InnoDB`, a Primary Key da tabela faz parte implicitamente do Index, e o Index pode ser usado para resolver o `ORDER BY` para esta Query:

  ```sql
  SELECT pk, key_part1, key_part2 FROM t1
    ORDER BY key_part1, key_part2;
  ```

* Nesta Query, *`key_part1`* é constante, então todas as linhas acessadas através do Index estão na ordem *`key_part2`*, e um Index em `(key_part1, key_part2)` evita a classificação se a cláusula `WHERE` for seletiva o suficiente para tornar um index range scan mais barato do que um table scan:

  ```sql
  SELECT * FROM t1
    WHERE key_part1 = constant
    ORDER BY key_part2;
  ```

* Nas próximas duas Querys, se o Index é usado é semelhante às mesmas Querys sem `DESC` mostradas anteriormente:

  ```sql
  SELECT * FROM t1
    ORDER BY key_part1 DESC, key_part2 DESC;

  SELECT * FROM t1
    WHERE key_part1 = constant
    ORDER BY key_part2 DESC;
  ```

* Nas próximas duas Querys, *`key_part1`* é comparado a uma constante. O Index é usado se a cláusula `WHERE` for seletiva o suficiente para tornar um index range scan mais barato do que um table scan:

  ```sql
  SELECT * FROM t1
    WHERE key_part1 > constant
    ORDER BY key_part1 ASC;

  SELECT * FROM t1
    WHERE key_part1 < constant
    ORDER BY key_part1 DESC;
  ```

* Na próxima Query, o `ORDER BY` não nomeia *`key_part1`*, mas todas as linhas selecionadas têm um valor *`key_part1`* constante, então o Index ainda pode ser usado:

  ```sql
  SELECT * FROM t1
    WHERE key_part1 = constant1 AND key_part2 > constant2
    ORDER BY key_part2;
  ```

Em alguns casos, o MySQL *não pode* usar Indexes para resolver o `ORDER BY`, embora ainda possa usar Indexes para encontrar as linhas que correspondem à cláusula `WHERE`. Exemplos:

* A Query usa `ORDER BY` em Indexes diferentes:

  ```sql
  SELECT * FROM t1 ORDER BY key1, key2;
  ```

* A Query usa `ORDER BY` em partes não consecutivas de um Index:

  ```sql
  SELECT * FROM t1 WHERE key2=constant ORDER BY key1_part1, key1_part3;
  ```

* A Query mistura `ASC` e `DESC`:

  ```sql
  SELECT * FROM t1 ORDER BY key_part1 DESC, key_part2 ASC;
  ```

* O Index usado para buscar as linhas difere daquele usado no `ORDER BY`:

  ```sql
  SELECT * FROM t1 WHERE key2=constant ORDER BY key1;
  ```

* A Query usa `ORDER BY` com uma expressão que inclui termos diferentes do nome da coluna do Index:

  ```sql
  SELECT * FROM t1 ORDER BY ABS(key);
  SELECT * FROM t1 ORDER BY -key;
  ```

* A Query usa JOINs em muitas tabelas, e as colunas no `ORDER BY` não são todas provenientes da primeira tabela não constante usada para recuperar linhas. (Esta é a primeira tabela na saída do `EXPLAIN` que não possui um tipo de JOIN `const`.)

* A Query possui expressões `ORDER BY` e `GROUP BY` diferentes.

* Existe um Index em apenas um prefixo de uma coluna nomeada na cláusula `ORDER BY`. Neste caso, o Index não pode ser usado para resolver completamente a ordem de classificação. Por exemplo, se apenas os primeiros 10 bytes de uma coluna `CHAR(20)` forem indexados, o Index não pode distinguir valores após o 10º byte e é necessário um `filesort`.

* O Index não armazena linhas em ordem. Por exemplo, isso é verdade para um Index `HASH` em uma tabela `MEMORY`.

A disponibilidade de um Index para classificação pode ser afetada pelo uso de aliases de coluna. Suponha que a coluna `t1.a` esteja indexada. Nesta declaração, o nome da coluna na lista `SELECT` é `a`. Ele se refere a `t1.a`, assim como a referência a `a` no `ORDER BY`, portanto, o Index em `t1.a` pode ser usado:

```sql
SELECT a FROM t1 ORDER BY a;
```

Nesta declaração, o nome da coluna na lista `SELECT` também é `a`, mas é o nome do alias. Ele se refere a `ABS(a)`, assim como a referência a `a` no `ORDER BY`, portanto, o Index em `t1.a` não pode ser usado:

```sql
SELECT ABS(a) AS a FROM t1 ORDER BY a;
```

Na declaração seguinte, o `ORDER BY` refere-se a um nome que não é o nome de uma coluna na lista `SELECT`. Mas há uma coluna em `t1` chamada `a`, então o `ORDER BY` se refere a `t1.a` e o Index em `t1.a` pode ser usado. (A ordem de classificação resultante pode ser completamente diferente da ordem para `ABS(a)`, é claro.)

```sql
SELECT ABS(a) AS b FROM t1 ORDER BY a;
```

Por padrão, o MySQL classifica as Querys `GROUP BY col1, col2, ...` como se você também tivesse incluído `ORDER BY col1, col2, ...` na Query. Se você incluir uma cláusula `ORDER BY` explícita que contém a mesma lista de colunas, o MySQL a otimiza, eliminando-a sem penalidade de velocidade, embora a classificação ainda ocorra.

Se uma Query incluir `GROUP BY` mas você quiser evitar a sobrecarga de classificar o resultado, você pode suprimir a classificação especificando `ORDER BY NULL`. Por exemplo:

```sql
INSERT INTO foo
SELECT a, COUNT(*) FROM bar GROUP BY a ORDER BY NULL;
```

O otimizador ainda pode optar por usar a classificação para implementar operações de agrupamento. `ORDER BY NULL` suprime a classificação do resultado, e não a classificação prévia feita pelas operações de agrupamento para determinar o resultado.

Nota

`GROUP BY` classifica implicitamente por padrão (ou seja, na ausência de designadores `ASC` ou `DESC` para colunas `GROUP BY`). No entanto, confiar na classificação implícita de `GROUP BY` (ou seja, classificação na ausência de designadores `ASC` ou `DESC`) ou na classificação explícita para `GROUP BY` (ou seja, usando designadores explícitos `ASC` ou `DESC` para colunas `GROUP BY`) está obsoleto (deprecated). Para produzir uma determinada ordem de classificação, forneça uma cláusula `ORDER BY`.

##### Uso de filesort para Satisfazer ORDER BY

Se um Index não puder ser usado para satisfazer uma cláusula `ORDER BY`, o MySQL executa uma operação `filesort` que lê as linhas da tabela e as classifica. Um `filesort` constitui uma fase de classificação extra na execução da Query.

Para obter memória para operações `filesort`, o otimizador aloca uma quantidade fixa de bytes de `sort_buffer_size` antecipadamente. Sessões individuais podem alterar o valor da sessão dessa variável conforme desejado para evitar o uso excessivo de memória ou para alocar mais memória conforme necessário.

Uma operação `filesort` usa arquivos de disco temporários conforme necessário se o conjunto de resultados for muito grande para caber na memória. Alguns tipos de Querys são particularmente adequados para operações `filesort` totalmente em memória. Por exemplo, o otimizador pode usar `filesort` para lidar eficientemente na memória, sem arquivos temporários, com a operação `ORDER BY` para Querys (e subqueries) do seguinte formato:

```sql
SELECT ... FROM single_table ... ORDER BY non_index_column [DESC] LIMIT [M,]N;
```

Tais Querys são comuns em aplicações web que exibem apenas algumas linhas de um conjunto de resultados maior. Exemplos:

```sql
SELECT col1, ... FROM t1 ... ORDER BY name LIMIT 10;
SELECT col1, ... FROM t1 ... ORDER BY RAND() LIMIT 15;
```

##### Influenciando a Otimização de ORDER BY

Para Querys `ORDER BY` lentas para as quais o `filesort` não é usado, tente diminuir a variável de sistema `max_length_for_sort_data` para um valor apropriado para acionar um `filesort`. (Um sintoma de definir o valor desta variável muito alto é uma combinação de alta atividade de disco e baixa atividade de CPU.)

Para aumentar a velocidade de `ORDER BY`, verifique se você pode fazer com que o MySQL use Indexes em vez de uma fase de classificação extra. Se isso não for possível, tente as seguintes estratégias:

* Aumente o valor da variável `sort_buffer_size`. Idealmente, o valor deve ser grande o suficiente para que todo o conjunto de resultados caiba no sort buffer (para evitar gravações em disco e merge passes), mas, no mínimo, o valor deve ser grande o suficiente para acomodar 15 tuplas. (Até 15 arquivos de disco temporários são mesclados e deve haver espaço na memória para pelo menos uma tupla por arquivo.)

  Leve em consideração que o tamanho dos valores das colunas armazenados no sort buffer é afetado pelo valor da variável de sistema `max_sort_length`. Por exemplo, se as tuplas armazenam valores de colunas de string longas e você aumenta o valor de `max_sort_length`, o tamanho das tuplas do sort buffer também aumenta e pode exigir que você aumente o `sort_buffer_size`. Para valores de coluna calculados como resultado de expressões de string (como aqueles que invocam uma função com valor de string), o algoritmo `filesort` não consegue identificar o comprimento máximo dos valores de expressão, então ele deve alocar `max_sort_length` bytes para cada tupla.

  Para monitorar o número de merge passes (para mesclar arquivos temporários), verifique a variável de status `Sort_merge_passes`.

* Aumente o valor da variável `read_rnd_buffer_size` para que mais linhas sejam lidas por vez.

* Altere a variável de sistema `tmpdir` para apontar para um sistema de arquivos dedicado com grandes quantidades de espaço livre. O valor da variável pode listar vários caminhos que são usados em formato round-robin; você pode usar este recurso para distribuir a carga por vários diretórios. Separe os caminhos por dois-pontos (`:`) no Unix e ponto e vírgula (`;`) no Windows. Os caminhos devem nomear diretórios em sistemas de arquivos localizados em discos *físicos* diferentes, e não em partições diferentes no mesmo disco.

##### Informações Disponíveis do Plano de Execução de ORDER BY

Com `EXPLAIN` (consulte a Seção 8.8.1, “Otimizando Querys com EXPLAIN”), você pode verificar se o MySQL pode usar Indexes para resolver uma cláusula `ORDER BY`:

* Se a coluna `Extra` da saída do `EXPLAIN` não contiver `Using filesort`, o Index é usado e um `filesort` não é executado.

* Se a coluna `Extra` da saída do `EXPLAIN` contiver `Using filesort`, o Index não é usado e um `filesort` é executado.

Além disso, se um `filesort` for executado, a saída do trace do otimizador inclui um bloco `filesort_summary`. Por exemplo:

```sql
"filesort_summary": {
  "rows": 100,
  "examined_rows": 100,
  "number_of_tmp_files": 0,
  "sort_buffer_size": 25192,
  "sort_mode": "<sort_key, packed_additional_fields>"
}
```

O valor `sort_mode` fornece informações sobre o conteúdo das tuplas no sort buffer:

* `<sort_key, rowid>`: Isso indica que as tuplas do sort buffer são pares que contêm o valor da chave de classificação (sort key) e o row ID da linha original da tabela. As tuplas são classificadas pelo valor da chave de classificação e o row ID é usado para ler a linha da tabela.

* `<sort_key, additional_fields>`: Isso indica que as tuplas do sort buffer contêm o valor da chave de classificação e as colunas referenciadas pela Query. As tuplas são classificadas pelo valor da chave de classificação e os valores das colunas são lidos diretamente da tupla.

* `<sort_key, packed_additional_fields>`: Semelhante à variante anterior, mas as colunas adicionais são empacotadas de forma compacta em vez de usar uma codificação de comprimento fixo.

O `EXPLAIN` não distingue se o otimizador executa ou não um `filesort` na memória. O uso de um `filesort` na memória pode ser visto na saída do trace do otimizador. Procure por `filesort_priority_queue_optimization`. Para obter informações sobre o trace do otimizador, consulte a Seção 8.15, “Tracing the Optimizer”.
