#### 8.2.1.14 Otimização de ORDER BY

Esta seção descreve quando o MySQL pode usar um índice para satisfazer uma cláusula `ORDER BY`, a operação `filesort` usada quando um índice não pode ser usado e as informações do plano de execução disponíveis do otimizador sobre `ORDER BY`.

Uma consulta `ORDER BY` com e sem `LIMIT` pode retornar linhas em ordens diferentes, conforme discutido na Seção 8.2.1.17, “Otimização da consulta LIMIT”.

- Uso de índices para satisfazer a cláusula ORDER BY
- Uso do filesort para satisfazer a cláusula ORDER BY
- Influenciando a Otimização de ORDER BY
- ORDEM PELO Plano de Execução de Informações Disponíveis

##### Uso de índices para satisfazer a cláusula ORDER BY

Em alguns casos, o MySQL pode usar um índice para satisfazer uma cláusula `ORDER BY` e evitar a ordenação extra envolvida na execução de uma operação `filesort`.

O índice também pode ser usado mesmo que a cláusula `ORDER BY` não corresponda exatamente ao índice, desde que todas as partes não utilizadas do índice e todas as colunas `ORDER BY` extras sejam constantes na cláusula `WHERE`. Se o índice não contiver todas as colunas acessadas pela consulta, o índice é usado apenas se o acesso ao índice for mais barato do que outros métodos de acesso.

Supondo que exista um índice sobre `(chave1, chave2)`, as seguintes consultas podem usar o índice para resolver a parte `ORDER BY`. Se o otimizador realmente fizer isso, isso depende se a leitura do índice é mais eficiente do que uma varredura da tabela, caso as colunas que não estão no índice também precisem ser lidas.

- Nesta consulta, o índice em `(key_part1, key_part2)` permite que o otimizador evite a ordenação:

  ```sql
  SELECT * FROM t1
    ORDER BY key_part1, key_part2;
  ```

  No entanto, a consulta usa `SELECT *`, o que pode selecionar mais colunas do que *`key_part1`* e *`key_part2`*. Nesse caso, a varredura de um índice inteiro e a busca de linhas da tabela para encontrar colunas que não estão no índice podem ser mais caras do que a varredura da tabela e a ordenação dos resultados. Se assim for, o otimizador provavelmente não usará o índice. Se `SELECT *` seleciona apenas as colunas do índice, o índice é usado e a ordenação é evitada.

  Se `t1` for uma tabela `InnoDB`, a chave primária da tabela faz parte implicitamente do índice, e o índice pode ser usado para resolver a cláusula `ORDER BY` dessa consulta:

  ```sql
  SELECT pk, key_part1, key_part2 FROM t1
    ORDER BY key_part1, key_part2;
  ```

- Nesta consulta, *`key_part1`* é constante, então todas as linhas acessadas através do índice estão na ordem de *`key_part2`*, e um índice em `(key_part1, key_part2)` evita a ordenação se a cláusula `WHERE` for seletiva o suficiente para tornar uma varredura de intervalo do índice mais barata do que uma varredura da tabela:

  ```sql
  SELECT * FROM t1
    WHERE key_part1 = constant
    ORDER BY key_part2;
  ```

- Nas próximas duas consultas, o uso do índice é semelhante às mesmas consultas sem `DESC` mostradas anteriormente:

  ```sql
  SELECT * FROM t1
    ORDER BY key_part1 DESC, key_part2 DESC;

  SELECT * FROM t1
    WHERE key_part1 = constant
    ORDER BY key_part2 DESC;
  ```

- Nas próximas duas consultas, *`key_part1`* é comparado a uma constante. O índice é usado se a cláusula `WHERE` for seletiva o suficiente para tornar uma varredura de intervalo de índice mais barata do que uma varredura da tabela:

  ```sql
  SELECT * FROM t1
    WHERE key_part1 > constant
    ORDER BY key_part1 ASC;

  SELECT * FROM t1
    WHERE key_part1 < constant
    ORDER BY key_part1 DESC;
  ```

- Na próxima consulta, o `ORDER BY` não nomeia *`key_part1`*, mas todas as linhas selecionadas têm um valor constante de *`key_part1`*, então o índice ainda pode ser usado:

  ```sql
  SELECT * FROM t1
    WHERE key_part1 = constant1 AND key_part2 > constant2
    ORDER BY key_part2;
  ```

Em alguns casos, o MySQL *não pode* usar índices para resolver a cláusula `ORDER BY`, embora ainda possa usar índices para encontrar as linhas que correspondem à cláusula `WHERE`. Exemplos:

- A consulta usa `ORDER BY` em diferentes índices:

  ```sql
  SELECT * FROM t1 ORDER BY key1, key2;
  ```

- A consulta usa `ORDER BY` em partes não consecutivas de um índice:

  ```sql
  SELECT * FROM t1 WHERE key2=constant ORDER BY key1_part1, key1_part3;
  ```

- A consulta mistura `ASC` e `DESC`:

  ```sql
  SELECT * FROM t1 ORDER BY key_part1 DESC, key_part2 ASC;
  ```

- O índice usado para buscar as linhas difere do usado na cláusula `ORDER BY`:

  ```sql
  SELECT * FROM t1 WHERE key2=constant ORDER BY key1;
  ```

- A consulta usa `ORDER BY` com uma expressão que inclui termos diferentes do nome da coluna do índice:

  ```sql
  SELECT * FROM t1 ORDER BY ABS(key);
  SELECT * FROM t1 ORDER BY -key;
  ```

- A consulta une várias tabelas, e as colunas no `ORDER BY` não são todas da primeira tabela não constante que é usada para recuperar linhas. (Essa é a primeira tabela na saída `EXPLAIN` que não tem um tipo de junção `const`.)

- A consulta tem expressões `ORDER BY` e `GROUP BY` diferentes.

- Existe um índice apenas em um prefixo de uma coluna nomeada na cláusula `ORDER BY`. Nesse caso, o índice não pode ser usado para resolver completamente a ordem de classificação. Por exemplo, se apenas os primeiros 10 bytes de uma coluna `CHAR(20)` estiverem indexados, o índice não pode distinguir valores além do décimo byte e é necessário um `filesort`.

- O índice não armazena as linhas em ordem. Por exemplo, isso é verdade para um índice `HASH` em uma tabela `MEMORY`.

A disponibilidade de um índice para ordenação pode ser afetada pelo uso de aliases de coluna. Suponha que a coluna `t1.a` esteja indexada. Nesta declaração, o nome da coluna na lista de seleção é `a`. Isso se refere a `t1.a`, assim como a referência a `a` na cláusula `ORDER BY`, então o índice em `t1.a` pode ser usado:

```sql
SELECT a FROM t1 ORDER BY a;
```

Nesta declaração, o nome da coluna na lista de seleção também é `a`, mas é o nome de alias. Ele se refere a `ABS(a)`, assim como a referência a `a` na cláusula `ORDER BY`, então o índice em `t1.a` não pode ser usado:

```sql
SELECT ABS(a) AS a FROM t1 ORDER BY a;
```

Na seguinte declaração, a `ORDER BY` refere-se a um nome que não é o nome de uma coluna na lista de seleção. No entanto, há uma coluna em `t1` chamada `a`, então a `ORDER BY` refere-se a `t1.a` e o índice em `t1.a` pode ser usado. (O resultado da ordem de classificação pode ser completamente diferente da ordem para `ABS(a)`, é claro.)

```sql
SELECT ABS(a) AS b FROM t1 ORDER BY a;
```

Por padrão, o MySQL ordena as consultas `GROUP BY col1, col2, ...` como se você tivesse incluído `ORDER BY col1, col2, ...` na consulta. Se você incluir uma cláusula `ORDER BY` explícita que contenha a mesma lista de colunas, o MySQL otimiza isso sem qualquer penalidade de velocidade, embora o ordenamento ainda ocorra.

Se uma consulta incluir `GROUP BY`, mas você quiser evitar o overhead do ordenamento dos resultados, você pode suprimir o ordenamento especificando `ORDER BY NULL`. Por exemplo:

```sql
INSERT INTO foo
SELECT a, COUNT(*) FROM bar GROUP BY a ORDER BY NULL;
```

O otimizador pode ainda optar por usar a ordenação para implementar operações de agrupamento. `ORDER BY NULL` suprime a ordenação do resultado, não a ordenação anterior realizada por operações de agrupamento para determinar o resultado.

Nota

O `GROUP BY` ordena implicitamente por padrão (ou seja, na ausência de designadores `ASC` ou `DESC` para as colunas `GROUP BY`). No entanto, a dependência da ordenação `GROUP BY` implícita (ou seja, ordenação na ausência de designadores `ASC` ou `DESC`) ou a ordenação explícita para `GROUP BY` (ou seja, usando designadores `ASC` ou `DESC` explícitos para as colunas `GROUP BY`) é desaconselhada. Para produzir um determinado ordem de classificação, forneça uma cláusula `ORDER BY`.

##### Uso do filesort para satisfazer a cláusula ORDER BY

Se um índice não puder ser usado para satisfazer uma cláusula `ORDER BY`, o MySQL executa uma operação `filesort` que lê as linhas da tabela e as ordena. Uma `filesort` constitui uma fase de ordenação extra na execução da consulta.

Para obter memória para operações `filesort`, o otimizador aloca um tamanho fixo de `sort_buffer_size` bytes de antemão. As sessões individuais podem alterar o valor da variável dessa sessão conforme desejado para evitar o uso excessivo de memória ou para alocar mais memória conforme necessário.

Uma operação `filesort` usa arquivos de disco temporários quando necessário, caso o conjunto de resultados seja muito grande para caber na memória. Alguns tipos de consultas são particularmente adequados para operações `filesort` completamente na memória, sem arquivos temporários. Por exemplo, o otimizador pode usar `filesort` para lidar eficientemente na memória, sem arquivos temporários, com a operação `ORDER BY` para consultas (e subconsultas) da seguinte forma:

```sql
SELECT ... FROM single_table ... ORDER BY non_index_column [DESC] LIMIT [M,]N;
```

Essas consultas são comuns em aplicações web que exibem apenas algumas linhas de um conjunto de resultados maior. Exemplos:

```sql
SELECT col1, ... FROM t1 ... ORDER BY name LIMIT 10;
SELECT col1, ... FROM t1 ... ORDER BY RAND() LIMIT 15;
```

##### Influenciando a Otimização de ORDER BY

Para consultas `ORDER BY` lentas para as quais o `filesort` não é utilizado, tente diminuir a variável de sistema `max_length_for_sort_data` para um valor apropriado para desencadear um `filesort`. (Um sintoma de definir o valor desta variável muito alto é uma combinação de alta atividade de disco e baixa atividade da CPU.)

Para aumentar a velocidade do `ORDER BY`, verifique se você pode fazer com que o MySQL use índices em vez de uma fase de ordenação extra. Se isso não for possível, experimente as seguintes estratégias:

- Aumente o valor da variável `sort_buffer_size`. Idealmente, o valor deve ser grande o suficiente para que todo o conjunto de resultados cabem no buffer de ordenação (para evitar gravações no disco e passes de junção), mas, no mínimo, o valor deve ser grande o suficiente para acomodar 15 tuplas. (Até 15 arquivos temporários no disco são juncionados e deve haver espaço na memória para pelo menos uma tupla por arquivo.)

  Tenha em mente que o tamanho dos valores das colunas armazenados no buffer de ordenação é afetado pelo valor da variável de sistema `max_sort_length`. Por exemplo, se os tuplos armazenam valores de colunas de strings longas e você aumentar o valor de `max_sort_length`, o tamanho dos tuplos do buffer de ordenação também aumenta e pode ser necessário aumentar `sort_buffer_size`. Para valores de coluna calculados como resultado de expressões de string (como aquelas que invocam uma função com valor de string), o algoritmo `filesort` não pode determinar o comprimento máximo dos valores das expressões, então ele deve alocar `max_sort_length` bytes para cada tupla.

  Para monitorar o número de passes de fusão (para fundir arquivos temporários), verifique a variável `Sort_merge_passes`.

- Aumente o valor da variável `read_rnd_buffer_size` para que mais linhas sejam lidas de uma só vez.

- Altere a variável de sistema `tmpdir` para apontar para um sistema de arquivos dedicado com grandes quantidades de espaço livre. O valor da variável pode listar vários caminhos que são usados de forma rotativa; você pode usar esse recurso para espalhar a carga por vários diretórios. Separe os caminhos por caracteres de colon (`:`) no Unix e por caracteres de ponto e vírgula (`;`) no Windows. Os caminhos devem nomear diretórios em sistemas de arquivos localizados em diferentes *discos físicos*, não em partições diferentes no mesmo disco.

##### ORDEM PELO Plano de Execução de Informações Disponíveis

Com `EXPLAIN` (veja a Seção 8.8.1, “Otimizando consultas com EXPLAIN”), você pode verificar se o MySQL pode usar índices para resolver uma cláusula `ORDER BY`:

- Se a coluna `Extra` da saída `EXPLAIN` não contiver `Using filesort`, o índice é usado e um `filesort` não é executado.

- Se a coluna `Extra` da saída `EXPLAIN` contiver `Using filesort`, o índice não é usado e um `filesort` é realizado.

Além disso, se uma `filesort` for realizada, a saída do rastreamento do otimizador inclui um bloco `filesort_summary`. Por exemplo:

```json
"filesort_summary": {
  "rows": 100,
  "examined_rows": 100,
  "number_of_tmp_files": 0,
  "sort_buffer_size": 25192,
  "sort_mode": "<sort_key, packed_additional_fields>"
}
```

O valor `sort_mode` fornece informações sobre o conteúdo dos tuplas no buffer de ordenação:

- `<sort_key, rowid>`: Isso indica que os tuplos do buffer de ordenação são pares que contêm o valor da chave de ordenação e o ID da linha da linha original da tabela. Os tuplos são ordenados pelo valor da chave de ordenação e o ID da linha é usado para ler a linha da tabela.

- `<chave_de_ordem, campos_adicionais>`: Isso indica que os tuplos do buffer de ordenação contêm o valor da chave de ordem e as colunas referenciadas pela consulta. Os tuplos são ordenados pelo valor da chave de ordem e os valores das colunas são lidos diretamente do tuplo.

- `<sort_key, packed_additional_fields>`: Assim como a variante anterior, mas as colunas adicionais são compactadas juntas, em vez de usar uma codificação de comprimento fixo.

A opção `EXPLAIN` não distingue se o otimizador executa ou não uma `filesort` na memória. O uso de uma `filesort` na memória pode ser observado na saída da execução do otimizador. Procure por `filesort_priority_queue_optimization`. Para obter informações sobre a execução do otimizador, consulte a Seção 8.15, “Rastreamento do Otimizador”.
