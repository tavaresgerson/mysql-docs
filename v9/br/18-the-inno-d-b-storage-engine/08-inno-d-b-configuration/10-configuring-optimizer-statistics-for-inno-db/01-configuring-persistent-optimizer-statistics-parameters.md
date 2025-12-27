#### 17.8.10.1 Configurando Parâmetros de Estatísticas do Otimizador Persistente

O recurso de estatísticas do otimizador persistente melhora a estabilidade do plano ao armazenar estatísticas no disco e torná-las persistentes após reinicializações do servidor, para que o otimizador tenha mais chances de tomar decisões consistentes cada vez que for executada uma consulta específica.

As estatísticas do otimizador são armazenadas no disco quando `innodb_stats_persistent=ON` ou quando tabelas individuais são definidas com `STATS_PERSISTENT=1`. `innodb_stats_persistent` está habilitado por padrão.

Anteriormente, as estatísticas do otimizador eram limpas ao reiniciar o servidor e após outros tipos de operações, e recomputadas no próximo acesso à tabela. Consequentemente, diferentes estimativas poderiam ser produzidas ao recalcular as estatísticas, levando a diferentes escolhas nos planos de execução das consultas e variação no desempenho das consultas.

As estatísticas persistentes são armazenadas nas tabelas `mysql.innodb_table_stats` e `mysql.innodb_index_stats`. Consulte a Seção 17.8.10.1.5, “Tabelas de Estatísticas Otimizador Persistente”.

Se você preferir não persistir as estatísticas do otimizador no disco, consulte a Seção 17.8.10.2, “Configurando Parâmetros de Estatísticas do Otimizador Não Persistente”.

##### 17.8.10.1.1 Configurando Cálculo Automático de Estatísticas para Estatísticas do Otimizador Persistente

A variável `innodb_stats_auto_recalc`, que está habilitada por padrão, controla se as estatísticas são calculadas automaticamente quando uma tabela sofre alterações em mais de 10% de suas linhas. Você também pode configurar o recalculo automático de estatísticas para tabelas individuais, especificando a cláusula `STATS_AUTO_RECALC` ao criar ou alterar uma tabela.

Devido à natureza assíncrona do recálculo automático das estatísticas, que ocorre em segundo plano, as estatísticas podem não ser recálculadas instantaneamente após a execução de uma operação DML que afeta mais de 10% de uma tabela, mesmo quando o `innodb_stats_auto_recalc` está habilitado. Em alguns casos, o recálculo das estatísticas pode ser adiado por alguns segundos. Se estatísticas atualizadas são necessárias imediatamente, execute `ANALYZE TABLE` para iniciar um recálculo síncrono (em primeiro plano) das estatísticas.

Se o `innodb_stats_auto_recalc` estiver desabilitado, você pode garantir a precisão das estatísticas do otimizador executando a instrução `ANALYZE TABLE` após fazer alterações substanciais nas colunas indexadas. Você também pode considerar adicionar `ANALYZE TABLE` aos scripts de configuração que você executa após carregar dados e executar `ANALYZE TABLE` em um cronograma em momentos de baixa atividade.

Quando um índice é adicionado a uma tabela existente ou quando uma coluna é adicionada ou removida, as estatísticas do índice são calculadas e adicionadas à tabela `innodb_index_stats`, independentemente do valor de `innodb_stats_auto_recalc`.

Para um histograma com o `AUTO UPDATE` habilitado (consulte Análise de Estatísticas de Histograma), o recálculo automático das estatísticas persistentes também faz com que o histograma seja atualizado.

##### 17.8.10.1.2 Configurando Parâmetros de Estatísticas do Otimizador para Tabelas Individuais

`innodb_stats_persistent`, `innodb_stats_auto_recalc` e `innodb_stats_persistent_sample_pages` são variáveis globais. Para substituir essas configurações de nível de sistema e configurar parâmetros de estatísticas do otimizador para tabelas individuais, você pode definir as cláusulas `STATS_PERSISTENT`, `STATS_AUTO_RECALC` e `STATS_SAMPLE_PAGES` nas instruções `CREATE TABLE` ou `ALTER TABLE`.

* `STATS_PERSISTENT` especifica se as estatísticas persistentes devem ser habilitadas para uma tabela `InnoDB`. O valor `DEFAULT` faz com que o ajuste das estatísticas persistentes para a tabela seja determinado pelo ajuste `innodb_stats_persistent`. Um valor de `1` habilita as estatísticas persistentes para a tabela, enquanto um valor de `0` desabilita o recurso. Após habilitar as estatísticas persistentes para uma tabela individual, use `ANALYZE TABLE` para calcular as estatísticas após o carregamento dos dados da tabela.

* `STATS_AUTO_RECALC` especifica se as estatísticas persistentes devem ser recalculadas automaticamente. O valor `DEFAULT` faz com que o ajuste das estatísticas persistentes para a tabela seja determinado pelo ajuste `innodb_stats_auto_recalc`. Um valor de `1` faz com que as estatísticas sejam recalculadas quando 10% dos dados da tabela forem alterados. Um valor `0` impede a recalculação automática para a tabela. Ao usar um valor de 0, use `ANALYZE TABLE` para recalcular as estatísticas após fazer alterações substanciais na tabela.

* `STATS_SAMPLE_PAGES` especifica o número de páginas de índice a serem amostradas quando a cardinalidade e outras estatísticas são calculadas para uma coluna indexada, por exemplo, por meio de uma operação `ANALYZE TABLE`.

Todas as três cláusulas são especificadas no seguinte exemplo de `CREATE TABLE`:

```
CREATE TABLE `t1` (
`id` int(8) NOT NULL auto_increment,
`data` varchar(255),
`date` datetime,
PRIMARY KEY  (`id`),
INDEX `DATE_IX` (`date`)
) ENGINE=InnoDB,
  STATS_PERSISTENT=1,
  STATS_AUTO_RECALC=1,
  STATS_SAMPLE_PAGES=25;
```

##### 17.8.10.1.3 Configurando o Número de Páginas Amostradas para as Estatísticas do Otimizador do InnoDB

O otimizador usa estatísticas estimadas sobre as distribuições de chaves para escolher os índices para um plano de execução, com base na seletividade relativa do índice. Operações como `ANALYZE TABLE` fazem com que o `InnoDB` amostra páginas aleatórias de cada índice em uma tabela para estimar a cardinalidade do índice. Essa técnica de amostragem é conhecida como mergulho aleatório.

O `innodb_stats_persistent_sample_pages` controla o número de páginas amostradas. Você pode ajustar o ajuste em tempo de execução para gerenciar a qualidade das estimativas de estatísticas usadas pelo otimizador. O valor padrão é 20. Considere modificar o ajuste quando encontrar os seguintes problemas:

1. *As estatísticas não são precisas o suficiente e o otimizador escolhe planos subótimos*, conforme mostrado na saída do `EXPLAIN`. Você pode verificar a precisão das estatísticas comparando a cardinalidade real de um índice (determinada executando `SELECT DISTINCT` nas colunas do índice) com as estimativas na tabela `mysql.innodb_index_stats`.

   Se for determinado que as estatísticas não são precisas o suficiente, o valor de `innodb_stats_persistent_sample_pages` deve ser aumentado até que as estimativas de estatísticas sejam suficientemente precisas. No entanto, aumentar `innodb_stats_persistent_sample_pages` demais pode fazer com que a execução do `ANALYZE TABLE` seja lenta.

2. *O `ANALYZE TABLE` é muito lento*. Neste caso, `innodb_stats_persistent_sample_pages` deve ser diminuído até que o tempo de execução do `ANALYZE TABLE` seja aceitável. No entanto, diminuir o valor demais pode levar ao primeiro problema de estatísticas imprecisas e planos de execução de consultas subótimos.

   Se não for possível alcançar um equilíbrio entre estatísticas precisas e tempo de execução do `ANALYZE TABLE`, considere diminuir o número de colunas indexadas na tabela ou limitar o número de partições para reduzir a complexidade do `ANALYZE TABLE`. O número de colunas na chave primária da tabela também é importante considerar, pois as colunas da chave primária são anexadas a cada índice não único.

   Para informações relacionadas, consulte a Seção 17.8.10.3, “Estimativa da Complexidade do `ANALYZE TABLE` para Tabelas InnoDB”.

Por padrão, o `InnoDB` lê dados não confirmados ao calcular estatísticas. No caso de uma transação não confirmada que exclui linhas de uma tabela, os registros marcados para exclusão são excluídos ao calcular estimativas de linhas e estatísticas de índices, o que pode levar a planos de execução não ótimos para outras transações que operam na tabela simultaneamente usando um nível de isolamento de transação diferente de `READ UNCOMMITTED`. Para evitar esse cenário, o `innodb_stats_include_delete_marked` pode ser habilitado para garantir que os registros marcados para exclusão sejam incluídos ao calcular estatísticas do otimizador persistente.

Quando o `innodb_stats_include_delete_marked` está habilitado, o `ANALYZE TABLE` considera os registros marcados para exclusão ao recalcular as estatísticas.

`innodb_stats_include_delete_marked` é um ajuste global que afeta todas as tabelas `InnoDB` e é aplicável apenas às estatísticas do otimizador persistente.

##### 17.8.10.1.5 Tabelas de Estatísticas Persistentes do InnoDB

O recurso de estatísticas persistentes depende das tabelas gerenciadas internamente no banco de dados `mysql`, chamadas `innodb_table_stats` e `innodb_index_stats`. Essas tabelas são configuradas automaticamente em todos os procedimentos de instalação, atualização e construção a partir da fonte.

**Tabela 17.6 Colunas de innodb\_table\_stats**

<table summary="Colunas da tabela mysql.innodb_table_stats."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Nome da coluna</th> <th>Descrição</th> </tr></thead><tbody><tr> <td><code class="literal">database_name</code></td> <td>Nome do banco de dados</td> </tr><tr> <td><code class="literal">table_name</code></td> <td>Nome da tabela, nome da partição ou nome da subpartição</td> </tr><tr> <td><code class="literal">last_update</code></td> <td>Um timestamp indicando a última vez que o <code class="literal">InnoDB</code> atualizou esta linha</td> </tr><tr> <td><code class="literal">n_rows</code></td> <td>O número de linhas na tabela</td> </tr><tr> <td><code class="literal">clustered_index_size</code></td> <td>O tamanho do índice primário, em páginas</td> </tr><tr> <td><code class="literal">sum_of_other_index_sizes</code></td> <td>O tamanho total de outros índices (não primários), em páginas</td> </tr></tbody></table>

<table summary="Colunas da tabela mysql.innodb_index_stats."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Nome da coluna</th> <th>Descrição</th> </tr></thead><tbody><tr> <td><code class="literal">database_name</code></td> <td>Nome do banco de dados</td> </tr><tr> <td><code class="literal">table_name</code></td> <td>Nome da tabela, nome da partição ou nome da subpartição</td> </tr><tr> <td><code class="literal">index_name</code></td> <td>Nome do índice</td> </tr><tr> <td><code class="literal">last_update</code></td> <td>Um timestamp indicando a última vez que a linha foi atualizada</td> </tr><tr> <td><code class="literal">stat_name</code></td> <td>O nome da estatística, cujo valor é relatado na coluna <code class="literal">stat_value</code></td> </tr><tr> <td><code class="literal">stat_value</code></td> <td>O valor da estatística que é nomeada na coluna <code class="literal">stat_name</code></td> </tr><tr> <td><code class="literal">sample_size</code></td> <td>O número de páginas amostradas para a estimativa fornecida na coluna <code class="literal">stat_value</code></td> </tr><tr> <td><code class="literal">stat_description</code></td> <td>Descrição da estatística que é nomeada na coluna <code class="literal">stat_name</code></td> </tr></tbody></table>

As tabelas `innodb_table_stats` e `innodb_index_stats` incluem uma coluna `last_update` que mostra quando as estatísticas do índice foram atualizadas pela última vez:

```
mysql> SELECT * FROM innodb_table_stats \G
*************************** 1. row ***************************
           database_name: sakila
              table_name: actor
             last_update: 2014-05-28 16:16:44
                  n_rows: 200
    clustered_index_size: 1
sum_of_other_index_sizes: 1
...
```

```
mysql> SELECT * FROM innodb_index_stats \G
*************************** 1. row ***************************
   database_name: sakila
      table_name: actor
      index_name: PRIMARY
     last_update: 2014-05-28 16:16:44
       stat_name: n_diff_pfx01
      stat_value: 200
     sample_size: 1
     ...
```

As tabelas `innodb_table_stats` e `innodb_index_stats` podem ser atualizadas manualmente, o que permite forçar um plano específico de otimização de consulta ou testar planos alternativos sem modificar o banco de dados. Se você atualizar manualmente as estatísticas, use a instrução `FLUSH TABLE tbl_name` para carregar as estatísticas atualizadas.

As estatísticas persistentes são consideradas informações locais, pois estão relacionadas à instância do servidor. Portanto, as tabelas `innodb_table_stats` e `innodb_index_stats` não são replicadas quando a recalcificação automática das estatísticas ocorre. Se você executar `ANALYZE TABLE` para iniciar uma recalcificação sincronizada das estatísticas, a instrução é replicada (a menos que você tenha suprimido o registro para ela), e a recalcificação ocorre nas réplicas.

##### 17.8.10.1.6 Tabelas de Estatísticas Persistentes do InnoDB Exemplo

A tabela `innodb_table_stats` contém uma linha para cada tabela. O exemplo a seguir demonstra o tipo de dados coletados.

A tabela `t1` contém um índice primário (colunas `a`, `b`) e um índice secundário (colunas `c`, `d`), além de um índice único (colunas `e`, `f`):

```
CREATE TABLE t1 (
a INT, b INT, c INT, d INT, e INT, f INT,
PRIMARY KEY (a, b), KEY i1 (c, d), UNIQUE KEY i2uniq (e, f)
) ENGINE=INNODB;
```

Após inserir cinco linhas de dados de amostra, a tabela `t1` aparece da seguinte forma:

```
mysql> SELECT * FROM t1;
+---+---+------+------+------+------+
| a | b | c    | d    | e    | f    |
+---+---+------+------+------+------+
| 1 | 1 |   10 |   11 |  100 |  101 |
| 1 | 2 |   10 |   11 |  200 |  102 |
| 1 | 3 |   10 |   11 |  100 |  103 |
| 1 | 4 |   10 |   12 |  200 |  104 |
| 1 | 5 |   10 |   12 |  100 |  105 |
+---+---+------+------+------+------+
```

Para atualizar imediatamente as estatísticas, execute `ANALYZE TABLE` (se `innodb_stats_auto_recalc` estiver habilitado, as estatísticas são atualizadas automaticamente em poucos segundos, assumindo que o limiar de 10% de linhas de tabela alteradas é alcançado):

```
mysql> ANALYZE TABLE t1;
+---------+---------+----------+----------+
| Table   | Op      | Msg_type | Msg_text |
+---------+---------+----------+----------+
| test.t1 | analyze | status   | OK       |
+---------+---------+----------+----------+
```

As estatísticas da tabela `t1` mostram a última vez que o `InnoDB` atualizou as estatísticas da tabela (`2014-03-14 14:36:34`), o número de linhas na tabela (`5`), o tamanho do índice agrupado (`1` página) e o tamanho combinado dos outros índices (`2` páginas).

```
mysql> SELECT * FROM mysql.innodb_table_stats WHERE table_name like 't1'\G
*************************** 1. row ***************************
           database_name: test
              table_name: t1
             last_update: 2014-03-14 14:36:34
                  n_rows: 5
    clustered_index_size: 1
sum_of_other_index_sizes: 2
```

A tabela `innodb_index_stats` contém várias linhas para cada índice. Cada linha na tabela `innodb_index_stats` fornece dados relacionados a um estatístico de índice específico, que é nomeado na coluna `stat_name` e descrito na coluna `stat_description`. Por exemplo:

```
mysql> SELECT index_name, stat_name, stat_value, stat_description
       FROM mysql.innodb_index_stats WHERE table_name like 't1';
+------------+--------------+------------+-----------------------------------+
| index_name | stat_name    | stat_value | stat_description                  |
+------------+--------------+------------+-----------------------------------+
| PRIMARY    | n_diff_pfx01 |          1 | a                                 |
| PRIMARY    | n_diff_pfx02 |          5 | a,b                               |
| PRIMARY    | n_leaf_pages |          1 | Number of leaf pages in the index |
| PRIMARY    | size         |          1 | Number of pages in the index      |
| i1         | n_diff_pfx01 |          1 | c                                 |
| i1         | n_diff_pfx02 |          2 | c,d                               |
| i1         | n_diff_pfx03 |          2 | c,d,a                             |
| i1         | n_diff_pfx04 |          5 | c,d,a,b                           |
| i1         | n_leaf_pages |          1 | Number of leaf pages in the index |
| i1         | size         |          1 | Number of pages in the index      |
| i2uniq     | n_diff_pfx01 |          2 | e                                 |
| i2uniq     | n_diff_pfx02 |          5 | e,f                               |
| i2uniq     | n_leaf_pages |          1 | Number of leaf pages in the index |
| i2uniq     | size         |          1 | Number of pages in the index      |
+------------+--------------+------------+-----------------------------------+
```

A coluna `stat_name` mostra os seguintes tipos de estatísticas:

* `tamanho`: Onde `stat_name`=`tamanho`, a coluna `stat_value` exibe o número total de páginas no índice.

* `n_folhas`: Onde `stat_name`=`n_folhas`, a coluna `stat_value` exibe o número de páginas de folha no índice.

* `n_diff_pfxNN`: Onde `stat_name`=`n_diff_pfx01`, a coluna `stat_value` exibe o número de valores distintos na primeira coluna do índice. Onde `stat_name`=`n_diff_pfx02`, a coluna `stat_value` exibe o número de valores distintos nas duas primeiras colunas do índice, e assim por diante. Onde `stat_name`=`n_diff_pfxNN`, a coluna `stat_description` mostra uma lista separada por vírgula das colunas do índice que são contadas.

Para ilustrar ainda mais a estatística `n_diff_pfxNN`, que fornece dados de cardinalidade, considere novamente o exemplo da tabela `t1` que foi introduzido anteriormente. Como mostrado abaixo, a tabela `t1` é criada com um índice primário (colunas `a`, `b`), um índice secundário (colunas `c`, `d`) e um índice único (colunas `e`, `f`):

```
CREATE TABLE t1 (
  a INT, b INT, c INT, d INT, e INT, f INT,
  PRIMARY KEY (a, b), KEY i1 (c, d), UNIQUE KEY i2uniq (e, f)
) ENGINE=INNODB;
```

Após inserir cinco linhas de dados de amostra, a tabela `t1` aparece da seguinte forma:

```
mysql> SELECT * FROM t1;
+---+---+------+------+------+------+
| a | b | c    | d    | e    | f    |
+---+---+------+------+------+------+
| 1 | 1 |   10 |   11 |  100 |  101 |
| 1 | 2 |   10 |   11 |  200 |  102 |
| 1 | 3 |   10 |   11 |  100 |  103 |
| 1 | 4 |   10 |   12 |  200 |  104 |
| 1 | 5 |   10 |   12 |  100 |  105 |
+---+---+------+------+------+------+
```

Quando você consulta `index_name`, `stat_name`, `stat_value` e `stat_description`, onde `stat_name LIKE 'n_diff%'`, o seguinte conjunto de resultados é retornado:

```
mysql> SELECT index_name, stat_name, stat_value, stat_description
       FROM mysql.innodb_index_stats
       WHERE table_name like 't1' AND stat_name LIKE 'n_diff%';
+------------+--------------+------------+------------------+
| index_name | stat_name    | stat_value | stat_description |
+------------+--------------+------------+------------------+
| PRIMARY    | n_diff_pfx01 |          1 | a                |
| PRIMARY    | n_diff_pfx02 |          5 | a,b              |
| i1         | n_diff_pfx01 |          1 | c                |
| i1         | n_diff_pfx02 |          2 | c,d              |
| i1         | n_diff_pfx03 |          2 | c,d,a            |
| i1         | n_diff_pfx04 |          5 | c,d,a,b          |
| i2uniq     | n_diff_pfx01 |          2 | e                |
| i2uniq     | n_diff_pfx02 |          5 | e,f              |
+------------+--------------+------------+------------------+
```

Para o índice `PRIMARY`, há duas linhas `n_diff%`. O número de linhas é igual ao número de colunas no índice.

Nota

Para índices não únicos, o `InnoDB` adiciona as colunas da chave primária.

* Onde `nome_índice`=`PRIMARY` e `nome_estatística`=`n_diff_pfx01`, o `valor_estatística` é `1`, o que indica que há um único valor distinto na primeira coluna do índice (coluna `a`). O número de valores distintos na coluna `a` é confirmado ao visualizar os dados na coluna `a` na tabela `t1`, na qual há um único valor distinto (`1`). A coluna contada (`a`) é mostrada na coluna `stat_description` do conjunto de resultados.

* Onde `nome_índice`=`PRIMARY` e `nome_estatística`=`n_diff_pfx02`, o `valor_estatística` é `5`, o que indica que há cinco valores distintos nas duas colunas do índice (`a,b`). O número de valores distintos nas colunas `a` e `b` é confirmado ao visualizar os dados nas colunas `a` e `b` na tabela `t1`, na qual há cinco valores distintos: (`1,1`), (`1,2`), (`1,3`), (`1,4`) e (`1,5`). As colunas contadas (`a,b`) são mostradas na coluna `stat_description` do conjunto de resultados.

Para o índice secundário (`i1`), há quatro linhas `n_diff%`. Apenas duas colunas são definidas para o índice secundário (`c,d`), mas há quatro linhas `n_diff%` para o índice secundário porque o `InnoDB` sufixa todos os índices não únicos com a chave primária. Como resultado, há quatro linhas `n_diff%` em vez de duas para contabilizar tanto as colunas do índice secundário (`c,d`) quanto as colunas da chave primária (`a,b`).

* Onde `nome_índice`=`i1` e `nome_estatística`=`n_diff_pfx01`, o `valor_estatística` é `1`, o que indica que há um único valor distinto na primeira coluna do índice (coluna `c`). O número de valores distintos na coluna `c` é confirmado ao visualizar os dados na coluna `c` na tabela `t1`, na qual há um único valor distinto: (`10`). A coluna contada (`c`) é mostrada na coluna `stat_description` do conjunto de resultados.

* Onde `index_name`=`i1` e `stat_name`=`n_diff_pfx02`, o `stat_value` é `2`, o que indica que há dois valores distintos nas duas primeiras colunas do índice (`c,d`). O número de valores distintos nas colunas `c` e `d` é confirmado ao visualizar os dados nas colunas `c` e `d` na tabela `t1`, na qual há dois valores distintos: (`10,11`) e (`10,12`). As colunas contadas (`c,d`) são mostradas na coluna `stat_description` do conjunto de resultados.

* Onde `index_name`=`i1` e `stat_name`=`n_diff_pfx03`, o `stat_value` é `2`, o que indica que há dois valores distintos nas três primeiras colunas do índice (`c,d,a`). O número de valores distintos nas colunas `c`, `d` e `a` é confirmado ao visualizar os dados na coluna `c`, `d` e `a` na tabela `t1`, na qual há dois valores distintos: (`10,11,1`) e (`10,12,1`). As colunas contadas (`c,d,a`) são mostradas na coluna `stat_description` do conjunto de resultados.

* Onde `index_name`=`i1` e `stat_name`=`n_diff_pfx04`, o `stat_value` é `5`, o que indica que há cinco valores distintos nas quatro colunas do índice (`c,d,a,b`). O número de valores distintos nas colunas `c`, `d`, `a` e `b` é confirmado ao visualizar os dados nas colunas `c`, `d`, `a` e `b` na tabela `t1`, na qual há cinco valores distintos: (`10,11,1,1`), (`10,11,1,2`), (`10,11,1,3`), (`10,12,1,4`), e (`10,12,1,5`). As colunas contadas (`c,d,a,b`) são mostradas na coluna `stat_description` do conjunto de resultados.

Para o índice único (`i2uniq`), há duas linhas `n_diff%`.

* Onde `index_name`=`i2uniq` e `stat_name`=`n_diff_pfx01`, o `stat_value` é `2`, o que indica que há dois valores distintos na primeira coluna do índice (coluna `e`). O número de valores distintos na coluna `e` é confirmado ao visualizar os dados na coluna `e` na tabela `t1`, na qual há dois valores distintos: (`100`) e (`200`). A coluna contada (`e`) é mostrada na coluna `stat_description` do conjunto de resultados.

* Onde `index_name`=`i2uniq` e `stat_name`=`n_diff_pfx02`, o `stat_value` é `5`, o que indica que há cinco valores distintos nas duas colunas do índice (`e,f`). O número de valores distintos nas colunas `e` e `f` é confirmado ao visualizar os dados nas colunas `e` e `f` na tabela `t1`, na qual há cinco valores distintos: (`100,101`), (`200,102`), (`100,103`), (`200,104`), e (`100,105`). As colunas contadas (`e,f`) são mostradas na coluna `stat_description` do conjunto de resultados.

##### 17.8.10.1.7 Recuperação do Tamanho do Índice Usando a Tabela `innodb_index_stats`

Você pode recuperar o tamanho do índice para tabelas, partições ou subpartições usando a tabela `innodb_index_stats`. No exemplo a seguir, os tamanhos dos índices são recuperados para a tabela `t1`. Para uma definição da tabela `t1` e das estatísticas de índice correspondentes, consulte a Seção 17.8.10.1.6, “Exemplo de Tabelas de Estatísticas Persistentes do InnoDB”.

```
mysql> SELECT SUM(stat_value) pages, index_name,
       SUM(stat_value)*@@innodb_page_size size
       FROM mysql.innodb_index_stats WHERE table_name='t1'
       AND stat_name = 'size' GROUP BY index_name;
+-------+------------+-------+
| pages | index_name | size  |
+-------+------------+-------+
|     1 | PRIMARY    | 16384 |
|     1 | i1         | 16384 |
|     1 | i2uniq     | 16384 |
+-------+------------+-------+
```

Para partições ou subpartições, você pode usar a mesma consulta com uma cláusula `WHERE` modificada para recuperar os tamanhos dos índices. Por exemplo, a seguinte consulta recupera os tamanhos dos índices para as partições da tabela `t1`:

```
mysql> SELECT SUM(stat_value) pages, index_name,
       SUM(stat_value)*@@innodb_page_size size
       FROM mysql.innodb_index_stats WHERE table_name like 't1#P%'
       AND stat_name = 'size' GROUP BY index_name;
```