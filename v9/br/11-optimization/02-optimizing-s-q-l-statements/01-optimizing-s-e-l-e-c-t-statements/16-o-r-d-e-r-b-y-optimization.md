#### 10.2.1.16 Otimização de ORDEM POR

Esta seção descreve quando o MySQL pode usar um índice para satisfazer uma cláusula `ORDER BY`, a operação `filesort` usada quando um índice não pode ser usado e as informações do plano de execução disponíveis do otimizador sobre `ORDER BY`.

Uma `ORDER BY` com e sem `LIMIT` pode retornar linhas em ordens diferentes, conforme discutido na Seção 10.2.1.19, “Otimização de Consultas LIMIT”.

* Uso de Índices para Satisfazer ORDEM POR
* Uso de filesort para Satisfazer ORDEM POR
* Influenciando a Otimização de ORDEM POR
* Informações do Plano de Execução de ORDEM POR Disponíveis

##### Uso de Índices para Satisfazer ORDEM POR

Em alguns casos, o MySQL pode usar um índice para satisfazer uma cláusula `ORDER BY` e evitar a ordenação extra envolvida na execução de uma operação `filesort`.

O índice também pode ser usado mesmo que a `ORDER BY` não corresponda exatamente ao índice, desde que todas as partes não utilizadas do índice e todas as colunas `ORDER BY` extras sejam constantes na cláusula `WHERE`. Se o índice não contiver todas as colunas acessadas pela consulta, o índice é usado apenas se o acesso ao índice for mais barato do que outros métodos de acesso.

Assumindo que existe um índice em `(key_part1, key_part2)`, as seguintes consultas podem usar o índice para resolver a parte `ORDER BY`. Se o otimizador realmente o faz, isso depende se a leitura do índice é mais eficiente do que uma varredura da tabela se as colunas não no índice também precisam ser lidas.

* Nesta consulta, o índice em `(key_part1, key_part2)` permite que o otimizador evite a ordenação:

  ```
  SELECT * FROM t1
    ORDER BY key_part1, key_part2;
  ```

No entanto, a consulta usa `SELECT *`, o que pode selecionar mais colunas do que *`key_part1`* e *`key_part2`*. Nesse caso, a varredura de um índice inteiro e a busca de linhas da tabela para encontrar colunas não no índice podem ser mais caras do que a varredura da tabela e a ordenação dos resultados. Se assim for, o otimizador provavelmente não usa o índice. Se `SELECT *` seleciona apenas as colunas do índice, o índice é usado e a ordenação é evitada.

Se `t1` for uma tabela `InnoDB`, a chave primária da tabela faz parte implicitamente do índice, e o índice pode ser usado para resolver a cláusula `ORDER BY` dessa consulta:

```
  SELECT pk, key_part1, key_part2 FROM t1
    ORDER BY key_part1, key_part2;
  ```

* Na consulta, *`key_part1`* é constante, então todas as linhas acessadas através do índice estão em ordem de *`key_part2`*, e um índice em `(key_part1, key_part2)` evita a ordenação se a cláusula `WHERE` for seletiva o suficiente para fazer uma varredura de intervalo do índice ser mais barata do que uma varredura da tabela:

```
  SELECT * FROM t1
    WHERE key_part1 = constant
    ORDER BY key_part2;
  ```

* Nas próximas duas consultas, se o índice é usado é semelhante às mesmas consultas sem a cláusula `DESC` mostrada anteriormente:

```
  SELECT * FROM t1
    ORDER BY key_part1 DESC, key_part2 DESC;

  SELECT * FROM t1
    WHERE key_part1 = constant
    ORDER BY key_part2 DESC;
  ```

* Duas colunas em uma `ORDER BY` podem ser ordenadas na mesma direção (ambas `ASC`, ou ambas `DESC`) ou em direções opostas (uma `ASC`, uma `DESC`). Uma condição para o uso do índice é que o índice deve ter a mesma homogeneidade, mas não precisa ter a mesma direção real.

Se uma consulta mistura `ASC` e `DESC`, o otimizador pode usar um índice nas colunas se o índice também usar colunas correspondentes mistas ascendentes e descendentes:

```
  SELECT * FROM t1
    ORDER BY key_part1 DESC, key_part2 ASC;
  ```

O otimizador pode usar um índice em (*`key_part1`*, *`key_part2`*) se *`key_part1`* estiver em ordem descendente e *`key_part2`* estiver em ordem ascendente. Também pode usar um índice nessas colunas (com uma varredura reversa) se *`key_part1`* estiver em ordem ascendente e *`key_part2`* estiver em ordem descendente. Veja a Seção 10.3.13, “Indizes em ordem decrescente”.

* Nas próximas duas consultas, *`key_part1`* é comparado a uma constante. O índice é usado se a cláusula `WHERE` for seletiva o suficiente para tornar uma varredura de intervalo de índice mais barata do que uma varredura de tabela:

  ```
  SELECT * FROM t1
    WHERE key_part1 > constant
    ORDER BY key_part1 ASC;

  SELECT * FROM t1
    WHERE key_part1 < constant
    ORDER BY key_part1 DESC;
  ```

* Na próxima consulta, a cláusula `ORDER BY` não nomeia *`key_part1`*, mas todas as linhas selecionadas têm um valor constante de *`key_part1`*, então o índice ainda pode ser usado:

  ```
  SELECT * FROM t1
    WHERE key_part1 = constant1 AND key_part2 > constant2
    ORDER BY key_part2;
  ```

Em alguns casos, o MySQL *não pode* usar índices para resolver a `ORDER BY`, embora ainda possa usar índices para encontrar as linhas que correspondem à cláusula `WHERE`. Exemplos:

* A consulta usa `ORDER BY` em índices diferentes:

  ```
  SELECT * FROM t1 ORDER BY key1, key2;
  ```

* A consulta usa `ORDER BY` em partes não consecutivas de um índice:

  ```
  SELECT * FROM t1 WHERE key2=constant ORDER BY key1_part1, key1_part3;
  ```

* O índice usado para buscar as linhas difere do usado na `ORDER BY`:

  ```
  SELECT * FROM t1 WHERE key2=constant ORDER BY key1;
  ```

* A consulta usa `ORDER BY` com uma expressão que inclui termos além do nome da coluna do índice:

  ```
  SELECT * FROM t1 ORDER BY ABS(key);
  SELECT * FROM t1 ORDER BY -key;
  ```

* A consulta junta várias tabelas, e as colunas na `ORDER BY` não são todas da primeira tabela não constante que é usada para recuperar linhas. (Esta é a primeira tabela na saída `EXPLAIN` que não tem um tipo de junção `const`.)

* A consulta tem expressões de `ORDER BY` e `GROUP BY` diferentes.

* Há um índice apenas em um prefixo de uma coluna nomeada na cláusula `ORDER BY`. Neste caso, o índice não pode ser usado para resolver completamente a ordem de classificação. Por exemplo, se apenas os primeiros 10 bytes de uma coluna `CHAR(20)` estiverem indexados, o índice não pode distinguir valores além do 10º byte e é necessário um `filesort`.

* O índice não armazena as linhas em ordem. Por exemplo, isso é verdade para um índice `HASH` em uma tabela `MEMORY`.

A disponibilidade de um índice para ordenação pode ser afetada pelo uso de aliases de coluna. Suponha que a coluna `t1.a` esteja indexada. Nesta declaração, o nome da coluna na lista de seleção é `a`. Isso se refere a `t1.a`, assim como a referência a `a` na cláusula `ORDER BY`, então o índice em `t1.a` pode ser usado:

```
SELECT a FROM t1 ORDER BY a;
```

Nesta declaração, o nome da coluna na lista de seleção também é `a`, mas é o nome do alias. Isso se refere a `ABS(a)`, assim como a referência a `a` na cláusula `ORDER BY`, então o índice em `t1.a` não pode ser usado:

```
SELECT ABS(a) AS a FROM t1 ORDER BY a;
```

Na declaração seguinte, a `ORDER BY` se refere a um nome que não é o nome de uma coluna na lista de seleção. Mas há uma coluna em `t1` chamada `a`, então a `ORDER BY` se refere a `t1.a` e o índice em `t1.a` pode ser usado. (O resultado da ordem de classificação pode ser completamente diferente da ordem para `ABS(a)`, claro.)

```
SELECT ABS(a) AS b FROM t1 ORDER BY a;
```

Anteriormente (MySQL 9.4 e versões inferiores), a `GROUP BY` ordenava implicitamente sob certas condições. No MySQL 9.5, isso não ocorre mais, então especificar `ORDER BY NULL` no final para suprimir a ordenação implícita (como era feito anteriormente) não é mais necessário. No entanto, os resultados das consultas podem diferir das versões anteriores do MySQL. Para produzir uma determinada ordem de classificação, forneça uma cláusula `ORDER BY`.

##### Uso do filesort para Satisfazer a cláusula ORDER BY

Se um índice não puder ser usado para satisfazer uma cláusula `ORDER BY`, o MySQL executa uma operação `filesort` que lê as linhas da tabela e as ordena. Um `filesort` constitui uma fase de classificação extra na execução da consulta.

Para obter memória para operações `filesort`, o otimizador aloca buffers de memória incrementalmente conforme necessário, até o tamanho indicado pela variável de sistema `sort_buffer_size`. Isso permite que os usuários definam `sort_buffer_size` para valores maiores para acelerar operações de ordenação maiores, sem preocupação com o uso excessivo de memória para operações de ordenação menores. (Esse benefício pode não ocorrer para múltiplas ordenações concorrentes no Windows, que tem um `malloc` multithread fraco.)

Uma operação `filesort` usa arquivos de disco temporários conforme necessário se o conjunto de resultados for muito grande para caber na memória. Alguns tipos de consultas são particularmente adequados para operações `filesort` completamente na memória. Por exemplo, o otimizador pode usar `filesort` para lidar eficientemente na memória, sem arquivos temporários, com a operação `ORDER BY` para consultas (e subconsultas) da seguinte forma:

```
SELECT ... FROM single_table ... ORDER BY non_index_column [DESC] LIMIT [M,]N;
```

Tais consultas são comuns em aplicações web que exibem apenas algumas linhas de um conjunto de resultados maior. Exemplos:

```
SELECT col1, ... FROM t1 ... ORDER BY name LIMIT 10;
SELECT col1, ... FROM t1 ... ORDER BY RAND() LIMIT 15;
```

##### Influenciando a Otimização de ORDER BY

Para aumentar a velocidade da `ORDER BY`, verifique se é possível fazer com que o MySQL use índices em vez de uma fase de ordenação extra. Se isso não for possível, experimente as seguintes estratégias:

* Aumente o valor da variável `sort_buffer_size`. Idealmente, o valor deve ser grande o suficiente para que todo o conjunto de resultados cabe no buffer de ordenação (para evitar gravações no disco e passes de fusão).

Tenha em mente que o tamanho dos valores das colunas armazenados no buffer de ordenação é afetado pelo valor da variável de sistema `max_sort_length`. Por exemplo, se os tuplos armazenam valores de colunas de strings longas e você aumentar o valor de `max_sort_length`, o tamanho dos tuplos do buffer de ordenação também aumenta e pode exigir que você aumente `sort_buffer_size`.

Para monitorar o número de passes de fusão (para fundir arquivos temporários), verifique a variável `Sort_merge_passes`.

* Aumente o valor da variável `read_rnd_buffer_size` para que mais linhas sejam lidas de uma vez.

* Mude a variável de sistema `tmpdir` para apontar para um sistema de arquivos dedicado com grandes quantidades de espaço livre. O valor da variável pode listar vários caminhos que são usados de forma round-robin; você pode usar essa funcionalidade para distribuir a carga por vários diretórios. Separe os caminhos por caracteres de colon (`:`) no Unix e por caracteres de ponto-e-vírgula (`;`) no Windows. Os caminhos devem nomear diretórios em sistemas de arquivos localizados em diferentes *discos físicos*, não em diferentes partições no mesmo disco.

##### Informações do Plano de Execução Disponíveis

Com `EXPLAIN` (veja a Seção 10.8.1, “Otimizando Consultas com EXPLAIN”), você pode verificar se o MySQL pode usar índices para resolver uma cláusula `ORDER BY`:

* Se a coluna `Extra` da saída de `EXPLAIN` não contiver `Using filesort`, o índice é usado e um `filesort` não é realizado.

* Se a coluna `Extra` da saída de `EXPLAIN` contiver `Using filesort`, o índice não é usado e um `filesort` é realizado.

Além disso, se um `filesort` for realizado, a saída do rastreamento do otimizador inclui um bloco `filesort_summary`. Por exemplo:

```
"filesort_summary": {
  "rows": 100,
  "examined_rows": 100,
  "number_of_tmp_files": 0,
  "peak_memory_used": 25192,
  "sort_mode": "<sort_key, packed_additional_fields>"
}
```

`peak_memory_used` indica a memória máxima usada em algum momento durante a ordenação. Esse é um valor até, mas não necessariamente tão grande quanto o valor da variável de sistema `sort_buffer_size`. O otimizador aloca a memória do buffer de ordenação incrementalmente, começando com uma pequena quantidade e adicionando mais conforme necessário, até `sort_buffer_size` bytes.)

O valor `sort_mode` fornece informações sobre o conteúdo dos tuplas no buffer de ordenação:

* `<sort_key, rowid>`: Isso indica que os tuplos do buffer de ordenação são pares que contêm o valor da chave de ordenação e o ID da linha da tabela original. Os tuplos são ordenados pelo valor da chave de ordenação e o ID da linha é usado para ler a linha da tabela.

* `<sort_key, campos_adicionais>`: Isso indica que os tuplos do buffer de ordenação contêm o valor da chave de ordenação e as colunas referenciadas pela consulta. Os tuplos são ordenados pelo valor da chave de ordenação e os valores das colunas são lidos diretamente do tuplo.

* `<sort_key, campos_adicionais_empacotados>`: Como a variante anterior, mas as colunas adicionais são compactadas juntas em vez de usar uma codificação de comprimento fixo.

A consulta `EXPLAIN` não distingue se o otimizador executa ou não uma `filesort` em memória. O uso de uma `filesort` em memória pode ser visto na saída da análise do otimizador. Procure por `filesort_priority_queue_optimization`. Para informações sobre a análise do otimizador, consulte a Seção 10.15, “Analisando o Otimizador”.