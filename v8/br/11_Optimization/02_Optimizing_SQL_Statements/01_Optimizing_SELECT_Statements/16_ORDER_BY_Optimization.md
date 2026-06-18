#### 10.2.1.16 ORDEM POR Otimização

Esta seção descreve quando o MySQL pode usar um índice para satisfazer uma cláusula `ORDER BY`, a operação `filesort` usada quando um índice não pode ser usado e as informações do plano de execução disponíveis do otimizador sobre `ORDER BY`.

Um `ORDER BY` com e sem `LIMIT` pode retornar linhas em diferentes ordens, conforme discutido na Seção 10.2.1.19, “Otimização da Consulta LIMIT”.

- Uso de índices para satisfazer a cláusula ORDER BY
- Uso do filesort para satisfazer a cláusula ORDER BY
- Influenciando a Otimização de ORDER BY
- ORDEM PELO Plano de Execução de Informações Disponíveis

##### Uso de índices para satisfazer a cláusula ORDER BY

Em alguns casos, o MySQL pode usar um índice para satisfazer uma cláusula `ORDER BY` e evitar a ordenação extra envolvida na execução de uma operação `filesort`.

O índice também pode ser usado mesmo se o `ORDER BY` não corresponder exatamente ao índice, desde que todas as partes não utilizadas do índice e todas as colunas extras do `ORDER BY` sejam constantes na cláusula `WHERE`. Se o índice não contiver todas as colunas acessadas pela consulta, o índice é usado apenas se o acesso ao índice for mais barato do que outros métodos de acesso.

Supondo que exista um índice em `(key_part1, key_part2)`, as seguintes consultas podem usar o índice para resolver a parte `ORDER BY`. Se o otimizador realmente fizer isso, isso depende se a leitura do índice é mais eficiente do que uma varredura da tabela, caso as colunas que não estão no índice também precisem ser lidas.

- Nesta consulta, o índice em `(key_part1, key_part2)` permite que o otimizador evite a ordenação:

  ```
  SELECT * FROM t1
    ORDER BY key_part1, key_part2;
  ```

  No entanto, a consulta usa `SELECT *`, o que pode selecionar mais colunas do que `key_part1` e `key_part2`. Nesse caso, a varredura de um índice inteiro e a busca de linhas da tabela para encontrar colunas que não estão no índice podem ser mais caras do que a varredura da tabela e a ordenação dos resultados. Se assim for, o otimizador provavelmente não usa o índice. Se `SELECT *` seleciona apenas as colunas do índice, o índice é usado e a ordenação é evitada.

  Se a tabela `t1` for uma tabela `InnoDB`, a chave primária da tabela faz parte implicitamente do índice, e o índice pode ser usado para resolver o `ORDER BY` para essa consulta:

  ```
  SELECT pk, key_part1, key_part2 FROM t1
    ORDER BY key_part1, key_part2;
  ```

- Nesta consulta, `key_part1` é constante, então todas as linhas acessadas através do índice estão na ordem de `key_part2`, e um índice em `(key_part1, key_part2)` evita a ordenação se a cláusula `WHERE` for seletiva o suficiente para tornar uma varredura de intervalo do índice mais barata do que uma varredura da tabela:

  ```
  SELECT * FROM t1
    WHERE key_part1 = constant
    ORDER BY key_part2;
  ```

- Nas próximas duas consultas, o uso do índice é semelhante às mesmas consultas sem o `DESC` mostrado anteriormente:

  ```
  SELECT * FROM t1
    ORDER BY key_part1 DESC, key_part2 DESC;

  SELECT * FROM t1
    WHERE key_part1 = constant
    ORDER BY key_part2 DESC;
  ```

- Duas colunas em um `ORDER BY` podem ser ordenadas na mesma direção (ambas `ASC`, ou ambas `DESC`) ou em direções opostas (uma `ASC`, uma `DESC`). Uma condição para o uso do índice é que o índice deve ter a mesma homogeneidade, mas não precisa ter a mesma direção real.

  Se uma consulta misturar `ASC` e `DESC`, o otimizador pode usar um índice nas colunas se o índice também usar colunas mistas ascendentes e descendentes correspondentes:

  ```
  SELECT * FROM t1
    ORDER BY key_part1 DESC, key_part2 ASC;
  ```

  O otimizador pode usar um índice em (`key_part1`, `key_part2`) se `key_part1` estiver em ordem decrescente e `key_part2` estiver em ordem crescente. Ele também pode usar um índice nessas colunas (com varredura reversa) se `key_part1` estiver em ordem crescente e `key_part2` estiver em ordem decrescente. Veja a Seção 10.3.13, “Indicações em ordem decrescente”.

- Nas próximas duas consultas, `key_part1` é comparado a uma constante. O índice é usado se a cláusula `WHERE` for seletiva o suficiente para tornar uma varredura de intervalo de índice mais barata do que uma varredura da tabela:

  ```
  SELECT * FROM t1
    WHERE key_part1 > constant
    ORDER BY key_part1 ASC;

  SELECT * FROM t1
    WHERE key_part1 < constant
    ORDER BY key_part1 DESC;
  ```

- Na próxima consulta, o `ORDER BY` não nomeia `key_part1`, mas todas as linhas selecionadas têm um valor constante de `key_part1`, então o índice ainda pode ser usado:

  ```
  SELECT * FROM t1
    WHERE key_part1 = constant1 AND key_part2 > constant2
    ORDER BY key_part2;
  ```

Em alguns casos, o MySQL *não pode* usar índices para resolver o `ORDER BY`, embora ainda possa usar índices para encontrar as linhas que correspondem à cláusula `WHERE`. Exemplos:

- A consulta usa `ORDER BY` em diferentes índices:

  ```
  SELECT * FROM t1 ORDER BY key1, key2;
  ```

- A consulta usa `ORDER BY` em partes não consecutivas de um índice:

  ```
  SELECT * FROM t1 WHERE key2=constant ORDER BY key1_part1, key1_part3;
  ```

- O índice usado para buscar as linhas difere do usado no `ORDER BY`:

  ```
  SELECT * FROM t1 WHERE key2=constant ORDER BY key1;
  ```

- A consulta usa `ORDER BY` com uma expressão que inclui termos diferentes do nome da coluna de índice:

  ```
  SELECT * FROM t1 ORDER BY ABS(key);
  SELECT * FROM t1 ORDER BY -key;
  ```

- A consulta une várias tabelas, e as colunas no `ORDER BY` não são todas da primeira tabela não constante que é usada para recuperar linhas. (Esta é a primeira tabela no `EXPLAIN` de saída que não tem um tipo de junção `const`.)

- A consulta tem diferentes expressões `ORDER BY` e `GROUP BY`.

- Existe um índice apenas em um prefixo de uma coluna denominada na cláusula `ORDER BY`. Nesse caso, o índice não pode ser usado para resolver completamente a ordem de classificação. Por exemplo, se apenas os primeiros 10 bytes de uma coluna `CHAR(20)` forem indexados, o índice não pode distinguir valores além do décimo byte e é necessário um `filesort`.

- O índice não armazena as linhas em ordem. Por exemplo, isso é verdade para um índice `HASH` em uma tabela `MEMORY`.

A disponibilidade de um índice para classificação pode ser afetada pelo uso de aliases de coluna. Suponha que a coluna `t1.a` esteja indexada. Neste comando, o nome da coluna na lista de seleção é `a`. Ela se refere a `t1.a`, assim como a referência a `a` no `ORDER BY`, então o índice em `t1.a` pode ser usado:

```
SELECT a FROM t1 ORDER BY a;
```

Nesta declaração, o nome da coluna na lista de seleção também é `a`, mas é o nome do alias. Ele se refere a `ABS(a)`, assim como a referência a `a` no `ORDER BY`, então o índice em `t1.a` não pode ser usado:

```
SELECT ABS(a) AS a FROM t1 ORDER BY a;
```

Na seguinte declaração, o `ORDER BY` refere-se a um nome que não é o nome de uma coluna na lista de seleção. Mas há uma coluna no `t1` chamada `a`, então o `ORDER BY` refere-se a `t1.a` e o índice em `t1.a` pode ser usado. (O resultado da ordem de classificação pode ser completamente diferente da ordem para `ABS(a)`, é claro.)

```
SELECT ABS(a) AS b FROM t1 ORDER BY a;
```

Anteriormente (MySQL 5.7 e versões inferiores), `GROUP BY` era classificado implicitamente sob certas condições. No MySQL 8.0, isso não ocorre mais, portanto, não é mais necessário especificar `ORDER BY NULL` no final para suprimir o classificação implícita (como era feito anteriormente). No entanto, os resultados das consultas podem diferir das versões anteriores do MySQL. Para produzir uma determinada ordem de classificação, forneça uma cláusula `ORDER BY`.

##### Uso do filesort para satisfazer a cláusula ORDER BY

Se um índice não puder ser usado para satisfazer uma cláusula `ORDER BY`, o MySQL executa uma operação `filesort` que lê as linhas da tabela e as ordena. Uma `filesort` constitui uma fase de ordenação extra na execução da consulta.

Para obter memória para operações `filesort`, a partir do MySQL 8.0.12, o otimizador aloca buffers de memória incrementalmente conforme necessário, até o tamanho indicado pela variável de sistema `sort_buffer_size`, em vez de alocar um montante fixo de `sort_buffer_size` bytes de antemão, como era feito antes do MySQL 8.0.12. Isso permite que os usuários definam `sort_buffer_size` para valores maiores para acelerar ordenamentos maiores, sem preocupação com o uso excessivo de memória para ordenamentos pequenos. (Esse benefício pode não ocorrer para ordenamentos múltiplos simultâneos no Windows, que tem um `malloc` multithread fraco).

Uma operação `filesort` usa arquivos de disco temporários quando necessário, caso o conjunto de resultados seja muito grande para caber na memória. Alguns tipos de consultas são particularmente adequados para operações `filesort` completamente na memória. Por exemplo, o otimizador pode usar `filesort` para lidar eficientemente na memória, sem arquivos temporários, com a operação `ORDER BY` para consultas (e subconsultas) da seguinte forma:

```
SELECT ... FROM single_table ... ORDER BY non_index_column [DESC] LIMIT [M,]N;
```

Essas consultas são comuns em aplicações web que exibem apenas algumas linhas de um conjunto de resultados maior. Exemplos:

```
SELECT col1, ... FROM t1 ... ORDER BY name LIMIT 10;
SELECT col1, ... FROM t1 ... ORDER BY RAND() LIMIT 15;
```

##### Influenciando a Otimização de ORDER BY

Para consultas lentas `ORDER BY` para as quais `filesort` não é usado, tente diminuir a variável de sistema `max_length_for_sort_data` para um valor apropriado para desencadear um `filesort`. (Um sintoma de definir o valor desta variável muito alto é uma combinação de alta atividade de disco e baixa atividade da CPU.) Esta técnica só se aplica antes do MySQL 8.0.20. A partir do 8.0.20, `max_length_for_sort_data` é desatualizado devido às mudanças no otimizador que o tornam obsoleto e sem efeito.

Para aumentar a velocidade do `ORDER BY` verifique se você pode fazer com que o MySQL use índices em vez de uma fase de ordenação extra. Se isso não for possível, experimente as seguintes estratégias:

- Aumente o valor da variável `sort_buffer_size`. Idealmente, o valor deve ser grande o suficiente para que todo o conjunto de resultados caiba no buffer de ordenação (para evitar gravações no disco e passes de junção).

  Tenha em conta que o tamanho dos valores das colunas armazenados no buffer de ordenação é afetado pelo valor da variável de sistema `max_sort_length`. Por exemplo, se os tuplos armazenam valores de colunas de strings longas e você aumentar o valor de `max_sort_length`, o tamanho dos tuplos do buffer de ordenação também aumenta e pode ser necessário aumentar `sort_buffer_size`.

  Para monitorar o número de passes de fusão (para fundir arquivos temporários), verifique a variável de status `Sort_merge_passes`.

- Aumente o valor da variável `read_rnd_buffer_size` para que mais linhas sejam lidas de uma só vez.

- Altere a variável de sistema `tmpdir` para apontar para um sistema de arquivos dedicado com grandes quantidades de espaço livre. O valor da variável pode listar vários caminhos que são usados de forma round-robin; você pode usar esse recurso para espalhar a carga por vários diretórios. Separe os caminhos por caracteres de colon (`:`) no Unix e por caracteres de ponto e vírgula (`;`) no Windows. Os caminhos devem nomear diretórios em sistemas de arquivos localizados em diferentes *discos físicos*, não em diferentes partições no mesmo disco.

##### ORDEM PELO Plano de Execução de Informações Disponíveis

Com `EXPLAIN` (veja a Seção 10.8.1, “Otimizando Consultas com EXPLAIN”), você pode verificar se o MySQL pode usar índices para resolver uma cláusula `ORDER BY`:

- Se a coluna `Extra` do `EXPLAIN` de saída não contiver `Using filesort`, o índice é usado e um `filesort` não é realizado.

- Se a coluna `Extra` do `EXPLAIN` de saída contiver `Using filesort`, o índice não é usado e um `filesort` é realizado.

Além disso, se um `filesort` for executado, a saída do rastreamento do otimizador inclui um bloco `filesort_summary`. Por exemplo:

```
"filesort_summary": {
  "rows": 100,
  "examined_rows": 100,
  "number_of_tmp_files": 0,
  "peak_memory_used": 25192,
  "sort_mode": "<sort_key, packed_additional_fields>"
}
```

`peak_memory_used` indica a memória máxima usada em qualquer momento durante a ordenação. Esse é um valor que pode ser até maior que o valor da variável de sistema `sort_buffer_size`, mas não necessariamente. Antes do MySQL 8.0.12, a saída mostra `sort_buffer_size`, indicando o valor de `sort_buffer_size`. (Antes do MySQL 8.0.12, o otimizador aloca sempre `sort_buffer_size` bytes para o buffer de ordenação. A partir do 8.0.12, o otimizador aloca a memória do buffer de ordenação de forma incremental, começando com uma pequena quantidade e adicionando mais conforme necessário, até `sort_buffer_size` bytes.)

O valor `sort_mode` fornece informações sobre o conteúdo dos tuplas no buffer de ordenação:

- `<sort_key, rowid>`: Isso indica que os tuplos do buffer de ordenação são pares que contêm o valor da chave de ordenação e o ID da linha da linha original da tabela. Os tuplos são ordenados pelo valor da chave de ordenação e o ID da linha é usado para ler a linha da tabela.

- `<sort_key, additional_fields>`: Isso indica que os tuplos do buffer de ordenação contêm o valor da chave de ordenação e as colunas referenciadas pela consulta. Os tuplos são ordenados pelo valor da chave de ordenação e os valores das colunas são lidos diretamente do tuplo.

- `<sort_key, packed_additional_fields>`: Como a variante anterior, mas as colunas adicionais estão compactadas juntas, em vez de usar uma codificação de comprimento fixo.

`EXPLAIN` não distingue se o otimizador executa ou não uma `filesort` na memória. O uso de uma `filesort` na memória pode ser visto na saída da execução do otimizador. Procure por `filesort_priority_queue_optimization`. Para obter informações sobre a execução do otimizador, consulte a Seção 10.15, “Rastrear o Otimizador”.
