#### 14.8.11.1 Configurando Parâmetros de Estatísticas Persistentes do Optimizer

O recurso de estatísticas persistentes do optimizer melhora a estabilidade do plano de execução, armazenando as estatísticas em disco e as tornando persistentes entre as reinicializações do servidor, de modo que o optimizer tenha maior probabilidade de fazer escolhas consistentes para uma dada Query a cada vez.

As estatísticas do optimizer são persistidas em disco quando `innodb_stats_persistent=ON` ou quando tabelas individuais são definidas com `STATS_PERSISTENT=1`. `innodb_stats_persistent` está habilitada por padrão.

Anteriormente, as estatísticas do optimizer eram limpas ao reiniciar o servidor e após alguns outros tipos de operações, sendo recalculadas no próximo acesso à tabela. Consequentemente, estimativas diferentes podiam ser produzidas ao recalcular as estatísticas, levando a diferentes escolhas nos planos de execução de Querys e variação no desempenho da Query.

As estatísticas persistentes são armazenadas nas tabelas `mysql.innodb_table_stats` e `mysql.innodb_index_stats`. Veja Seção 14.8.11.1.5, “Tabelas de Estatísticas Persistentes do InnoDB”.

Se você preferir não persistir as estatísticas do optimizer em disco, veja Seção 14.8.11.2, “Configurando Parâmetros de Estatísticas Não Persistentes do Optimizer”.

##### 14.8.11.1.1 Configurando o Cálculo Automático de Estatísticas para Estatísticas Persistentes do Optimizer

A variável `innodb_stats_auto_recalc`, que está habilitada por padrão, controla se as estatísticas são calculadas automaticamente quando uma tabela sofre alterações em mais de 10% de suas linhas. Você também pode configurar o recálculo automático de estatísticas para tabelas individuais, especificando a cláusula `STATS_AUTO_RECALC` ao criar ou alterar uma tabela.

Devido à natureza assíncrona do recálculo automático de estatísticas, que ocorre em segundo plano, as estatísticas podem não ser recalculadas instantaneamente após executar uma operação DML que afeta mais de 10% de uma tabela, mesmo quando `innodb_stats_auto_recalc` está habilitada. O recálculo das estatísticas pode ser atrasado por alguns segundos em certos casos. Se estatísticas atualizadas forem necessárias imediatamente, execute `ANALYZE TABLE` para iniciar um recálculo síncrono (em primeiro plano) das estatísticas.

Se `innodb_stats_auto_recalc` estiver desabilitada, você pode garantir a precisão das estatísticas do optimizer executando a instrução `ANALYZE TABLE` após fazer alterações substanciais em colunas indexadas. Você também pode considerar adicionar `ANALYZE TABLE` a scripts de configuração que você executa após carregar dados, e executar `ANALYZE TABLE` em um cronograma em momentos de baixa atividade.

Quando um Index é adicionado a uma tabela existente, ou quando uma coluna é adicionada ou descartada, as estatísticas do Index são calculadas e adicionadas à tabela `innodb_index_stats`, independentemente do valor de `innodb_stats_auto_recalc`.

##### 14.8.11.1.2 Configurando Parâmetros de Estatísticas do Optimizer para Tabelas Individuais

`innodb_stats_persistent`, `innodb_stats_auto_recalc`, e `innodb_stats_persistent_sample_pages` são variáveis globais. Para substituir essas configurações em todo o sistema e configurar parâmetros de estatísticas do optimizer para tabelas individuais, você pode definir as cláusulas `STATS_PERSISTENT`, `STATS_AUTO_RECALC` e `STATS_SAMPLE_PAGES` nas instruções `CREATE TABLE` ou `ALTER TABLE`.

* `STATS_PERSISTENT` especifica se deve habilitar estatísticas persistentes para uma tabela `InnoDB`. O valor `DEFAULT` faz com que a configuração de estatísticas persistentes para a tabela seja determinada pela configuração `innodb_stats_persistent`. Um valor de `1` habilita estatísticas persistentes para a tabela, enquanto um valor de `0` desabilita o recurso. Após habilitar estatísticas persistentes para uma tabela individual, use `ANALYZE TABLE` para calcular as estatísticas após o carregamento dos dados da tabela.

* `STATS_AUTO_RECALC` especifica se deve recalcular automaticamente as estatísticas persistentes. O valor `DEFAULT` faz com que a configuração de estatísticas persistentes para a tabela seja determinada pela configuração `innodb_stats_auto_recalc`. Um valor de `1` faz com que as estatísticas sejam recalculadas quando 10% dos dados da tabela tiverem sido alterados. Um valor `0` impede o recálculo automático para a tabela. Ao usar o valor 0, use `ANALYZE TABLE` para recalcular as estatísticas após fazer alterações substanciais na tabela.

* `STATS_SAMPLE_PAGES` especifica o número de páginas de Index a serem amostradas quando a cardinalidade e outras estatísticas são calculadas para uma coluna indexada, por uma operação `ANALYZE TABLE`, por exemplo.

Todas as três cláusulas são especificadas no seguinte exemplo de `CREATE TABLE`:

```sql
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

##### 14.8.11.1.3 Configurando o Número de Páginas Amostradas para Estatísticas do Optimizer do InnoDB

O optimizer usa estatísticas estimadas sobre distribuições de chave para escolher os Indexes para um plano de execução, baseado na seletividade relativa do Index. Operações como `ANALYZE TABLE` fazem com que o `InnoDB` amostre páginas aleatórias de cada Index em uma tabela para estimar a cardinalidade do Index. Esta técnica de amostragem é conhecida como *random dive* (mergulho aleatório).

A variável `innodb_stats_persistent_sample_pages` controla o número de páginas amostradas. Você pode ajustar a configuração em tempo de execução para gerenciar a qualidade das estimativas de estatísticas usadas pelo optimizer. O valor padrão é 20. Considere modificar a configuração ao encontrar os seguintes problemas:

1. *As estatísticas não são precisas o suficiente e o optimizer escolhe planos não ideais*, conforme mostrado na saída de `EXPLAIN`. Você pode verificar a precisão das estatísticas comparando a cardinalidade real de um Index (determinada pela execução de `SELECT DISTINCT` nas colunas do Index) com as estimativas na tabela `mysql.innodb_index_stats`.

   Se for determinado que as estatísticas não são precisas o suficiente, o valor de `innodb_stats_persistent_sample_pages` deve ser aumentado até que as estimativas de estatísticas sejam suficientemente precisas. Aumentar demais `innodb_stats_persistent_sample_pages`, no entanto, pode fazer com que `ANALYZE TABLE` seja executado lentamente.

2. *`ANALYZE TABLE` está muito lento*. Neste caso, `innodb_stats_persistent_sample_pages` deve ser diminuído até que o tempo de execução de `ANALYZE TABLE` seja aceitável. Diminuir demais o valor, no entanto, pode levar ao primeiro problema de estatísticas imprecisas e planos de execução de Querys não ideais.

   Se um equilíbrio não puder ser alcançado entre estatísticas precisas e o tempo de execução de `ANALYZE TABLE`, considere diminuir o número de colunas indexadas na tabela ou limitar o número de partições para reduzir a complexidade de `ANALYZE TABLE`. O número de colunas na Primary Key da tabela também é importante a considerar, pois as colunas da Primary Key são anexadas a cada Index não exclusivo.

   Para informações relacionadas, veja Seção 14.8.11.3, “Estimando a Complexidade de ANALYZE TABLE para Tabelas InnoDB”.

##### 14.8.11.1.4 Incluindo Registros Marcados para Exclusão em Cálculos de Estatísticas Persistentes

Por padrão, o `InnoDB` lê dados não confirmados ao calcular estatísticas. No caso de uma transação não confirmada que exclui linhas de uma tabela, os registros marcados para exclusão são excluídos ao calcular estimativas de linha e estatísticas de Index, o que pode levar a planos de execução não ideais para outras transações que estão operando na tabela simultaneamente usando um nível de isolamento de transação diferente de `READ UNCOMMITTED`. Para evitar esse cenário, `innodb_stats_include_delete_marked` pode ser habilitada para garantir que os registros marcados para exclusão sejam incluídos ao calcular estatísticas persistentes do optimizer.

Quando `innodb_stats_include_delete_marked` está habilitada, `ANALYZE TABLE` considera registros marcados para exclusão ao recalcular estatísticas.

`innodb_stats_include_delete_marked` é uma configuração global que afeta todas as tabelas `InnoDB` e é aplicável apenas a estatísticas persistentes do optimizer.

`innodb_stats_include_delete_marked` foi introduzida no MySQL 5.7.16.

##### 14.8.11.1.5 Tabelas de Estatísticas Persistentes do InnoDB

O recurso de estatísticas persistentes depende das tabelas gerenciadas internamente no Database `mysql`, chamadas `innodb_table_stats` e `innodb_index_stats`. Essas tabelas são configuradas automaticamente em todos os procedimentos de instalação, atualização e compilação a partir do código-fonte (*build-from-source*).

**Tabela 14.4 Colunas de innodb_table_stats**

| Nome da Coluna | Descrição |
| :--- | :--- |
| `database_name` | Nome do Database |
| `table_name` | Nome da tabela, nome da partição ou nome da subpartição |
| `last_update` | Um timestamp indicando a última vez que a linha foi atualizada |
| `n_rows` | O número de linhas na tabela |
| `clustered_index_size` | O tamanho do Primary Index, em páginas |
| `sum_of_other_index_sizes` | O tamanho total de outros Indexes (não primários), em páginas |

**Tabela 14.5 Colunas de innodb_index_stats**

| Nome da Coluna | Descrição |
| :--- | :--- |
| `database_name` | Nome do Database |
| `table_name` | Nome da tabela, nome da partição ou nome da subpartição |
| `index_name` | Nome do Index |
| `last_update` | Um timestamp indicando a última vez que o `InnoDB` atualizou esta linha |
| `stat_name` | O nome da estatística, cujo valor é relatado na coluna `stat_value` |
| `stat_value` | O valor da estatística que é nomeada na coluna `stat_name` |
| `sample_size` | O número de páginas amostradas para a estimativa fornecida na coluna `stat_value` |
| `stat_description` | Descrição da estatística que é nomeada na coluna `stat_name` |

As tabelas `innodb_table_stats` e `innodb_index_stats` incluem uma coluna `last_update` que mostra quando as estatísticas do Index foram atualizadas pela última vez:

```sql
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

```sql
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

As tabelas `innodb_table_stats` e `innodb_index_stats` podem ser atualizadas manualmente, o que possibilita forçar um plano de otimização de Query específico ou testar planos alternativos sem modificar o Database. Se você atualizar estatísticas manualmente, use a instrução `FLUSH TABLE tbl_name` para carregar as estatísticas atualizadas.

As estatísticas persistentes são consideradas informações locais, pois se relacionam à instância do servidor. As tabelas `innodb_table_stats` e `innodb_index_stats` não são, portanto, replicadas quando o recálculo automático de estatísticas ocorre. Se você executar `ANALYZE TABLE` para iniciar um recálculo síncrono de estatísticas, essa instrução será replicada (a menos que você tenha suprimido o registro dela) e o recálculo ocorrerá nas réplicas.

##### 14.8.11.1.6 Exemplo de Tabelas de Estatísticas Persistentes do InnoDB

A tabela `innodb_table_stats` contém uma linha para cada tabela. O exemplo a seguir demonstra o tipo de dados coletados.

A Tabela `t1` contém um Primary Index (colunas `a`, `b`), um Secondary Index (colunas `c`, `d`), e um Unique Index (colunas `e`,`f`):

```sql
CREATE TABLE t1 (
a INT, b INT, c INT, d INT, e INT, f INT,
PRIMARY KEY (a, b), KEY i1 (c, d), UNIQUE KEY i2uniq (e, f)
) ENGINE=INNODB;
```

Após inserir cinco linhas de dados de exemplo, a tabela `t1` aparece da seguinte forma:

```sql
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

Para atualizar as estatísticas imediatamente, execute `ANALYZE TABLE` (se `innodb_stats_auto_recalc` estiver habilitada, as estatísticas são atualizadas automaticamente em poucos segundos, assumindo que o limite de 10% para linhas de tabela alteradas seja atingido):

```sql
mysql> ANALYZE TABLE t1;
+---------+---------+----------+----------+
| Table   | Op      | Msg_type | Msg_text |
+---------+---------+----------+----------+
| test.t1 | analyze | status   | OK       |
+---------+---------+----------+----------+
```

As estatísticas da tabela `t1` mostram a última vez que o `InnoDB` atualizou as estatísticas da tabela (`2014-03-14 14:36:34`), o número de linhas na tabela (`5`), o tamanho do clustered Index (`1` página) e o tamanho combinado dos outros Indexes (`2` páginas).

```sql
mysql> SELECT * FROM mysql.innodb_table_stats WHERE table_name like 't1'\G
*************************** 1. row ***************************
           database_name: test
              table_name: t1
             last_update: 2014-03-14 14:36:34
                  n_rows: 5
    clustered_index_size: 1
sum_of_other_index_sizes: 2
```

A tabela `innodb_index_stats` contém múltiplas linhas para cada Index. Cada linha na tabela `innodb_index_stats` fornece dados relacionados a uma estatística de Index específica que é nomeada na coluna `stat_name` e descrita na coluna `stat_description`. Por exemplo:

```sql
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

* `size`: Onde `stat_name`=`size`, a coluna `stat_value` exibe o número total de páginas no Index.

* `n_leaf_pages`: Onde `stat_name`=`n_leaf_pages`, a coluna `stat_value` exibe o número de páginas *leaf* (folha) no Index.

* `n_diff_pfxNN`: Onde `stat_name`=`n_diff_pfx01`, a coluna `stat_value` exibe o número de valores distintos na primeira coluna do Index. Onde `stat_name`=`n_diff_pfx02`, a coluna `stat_value` exibe o número de valores distintos nas duas primeiras colunas do Index, e assim por diante. Onde `stat_name`=`n_diff_pfxNN`, a coluna `stat_description` mostra uma lista separada por vírgulas das colunas do Index que são contadas.

Para ilustrar ainda mais a estatística `n_diff_pfxNN`, que fornece dados de cardinalidade, considere novamente o exemplo da tabela `t1` que foi introduzido anteriormente. Conforme mostrado abaixo, a tabela `t1` é criada com um Primary Index (colunas `a`, `b`), um Secondary Index (colunas `c`, `d`), e um Unique Index (colunas `e`, `f`):

```sql
CREATE TABLE t1 (
  a INT, b INT, c INT, d INT, e INT, f INT,
  PRIMARY KEY (a, b), KEY i1 (c, d), UNIQUE KEY i2uniq (e, f)
) ENGINE=INNODB;
```

Após inserir cinco linhas de dados de exemplo, a tabela `t1` aparece da seguinte forma:

```sql
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

```sql
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

Para o Index `PRIMARY`, existem duas linhas `n_diff%`. O número de linhas é igual ao número de colunas no Index.

Nota

Para Indexes não exclusivos, o `InnoDB` anexa as colunas da Primary Key.

* Onde `index_name`=`PRIMARY` e `stat_name`=`n_diff_pfx01`, o `stat_value` é `1`, o que indica que há um único valor distinto na primeira coluna do Index (coluna `a`). O número de valores distintos na coluna `a` é confirmado visualizando os dados na coluna `a` na tabela `t1`, na qual há um único valor distinto (`1`). A coluna contada (`a`) é mostrada na coluna `stat_description` do conjunto de resultados.

* Onde `index_name`=`PRIMARY` e `stat_name`=`n_diff_pfx02`, o `stat_value` é `5`, o que indica que há cinco valores distintos nas duas colunas do Index (`a,b`). O número de valores distintos nas colunas `a` e `b` é confirmado visualizando os dados nas colunas `a` e `b` na tabela `t1`, na qual há cinco valores distintos: (`1,1`), (`1,2`), (`1,3`), (`1,4`) e (`1,5`). As colunas contadas (`a,b`) são mostradas na coluna `stat_description` do conjunto de resultados.

Para o Secondary Index (`i1`), existem quatro linhas `n_diff%`. Apenas duas colunas são definidas para o Secondary Index (`c,d`), mas existem quatro linhas `n_diff%` para o Secondary Index porque o `InnoDB` sufixa todos os Indexes não exclusivos com a Primary Key. Como resultado, existem quatro linhas `n_diff%` em vez de duas para contabilizar tanto as colunas do Secondary Index (`c,d`) quanto as colunas da Primary Key (`a,b`).

* Onde `index_name`=`i1` e `stat_name`=`n_diff_pfx01`, o `stat_value` é `1`, o que indica que há um único valor distinto na primeira coluna do Index (coluna `c`). O número de valores distintos na coluna `c` é confirmado visualizando os dados na coluna `c` na tabela `t1`, na qual há um único valor distinto: (`10`). A coluna contada (`c`) é mostrada na coluna `stat_description` do conjunto de resultados.

* Onde `index_name`=`i1` e `stat_name`=`n_diff_pfx02`, o `stat_value` é `2`, o que indica que há dois valores distintos nas duas primeiras colunas do Index (`c,d`). O número de valores distintos nas colunas `c` e `d` é confirmado visualizando os dados nas colunas `c` e `d` na tabela `t1`, na qual há dois valores distintos: (`10,11`) e (`10,12`). As colunas contadas (`c,d`) são mostradas na coluna `stat_description` do conjunto de resultados.

* Onde `index_name`=`i1` e `stat_name`=`n_diff_pfx03`, o `stat_value` é `2`, o que indica que há dois valores distintos nas três primeiras colunas do Index (`c,d,a`). O número de valores distintos nas colunas `c`, `d` e `a` é confirmado visualizando os dados nas colunas `c`, `d` e `a` na tabela `t1`, na qual há dois valores distintos: (`10,11,1`) e (`10,12,1`). As colunas contadas (`c,d,a`) são mostradas na coluna `stat_description` do conjunto de resultados.

* Onde `index_name`=`i1` e `stat_name`=`n_diff_pfx04`, o `stat_value` é `5`, o que indica que há cinco valores distintos nas quatro colunas do Index (`c,d,a,b`). O número de valores distintos nas colunas `c`, `d`, `a` e `b` é confirmado visualizando os dados nas colunas `c`, `d`, `a` e `b` na tabela `t1`, na qual há cinco valores distintos: (`10,11,1,1`), (`10,11,1,2`), (`10,11,1,3`), (`10,12,1,4`) e (`10,12,1,5`). As colunas contadas (`c,d,a,b`) são mostradas na coluna `stat_description` do conjunto de resultados.

Para o Unique Index (`i2uniq`), existem duas linhas `n_diff%`.

* Onde `index_name`=`i2uniq` e `stat_name`=`n_diff_pfx01`, o `stat_value` é `2`, o que indica que há dois valores distintos na primeira coluna do Index (coluna `e`). O número de valores distintos na coluna `e` é confirmado visualizando os dados na coluna `e` na tabela `t1`, na qual há dois valores distintos: (`100`) e (`200`). A coluna contada (`e`) é mostrada na coluna `stat_description` do conjunto de resultados.

* Onde `index_name`=`i2uniq` e `stat_name`=`n_diff_pfx02`, o `stat_value` é `5`, o que indica que há cinco valores distintos nas duas colunas do Index (`e,f`). O número de valores distintos nas colunas `e` e `f` é confirmado visualizando os dados nas colunas `e` e `f` na tabela `t1`, na qual há cinco valores distintos: (`100,101`), (`200,102`), (`100,103`), (`200,104`) e (`100,105`). As colunas contadas (`e,f`) são mostradas na coluna `stat_description` do conjunto de resultados.

##### 14.8.11.1.7 Recuperando o Tamanho do Index Usando a Tabela innodb_index_stats

Você pode recuperar o tamanho do Index para tabelas, partições ou subpartições usando a tabela `innodb_index_stats`. No exemplo a seguir, os tamanhos dos Indexes são recuperados para a tabela `t1`. Para uma definição da tabela `t1` e estatísticas de Index correspondentes, veja Seção 14.8.11.1.6, “Exemplo de Tabelas de Estatísticas Persistentes do InnoDB”.

```sql
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

Para partições ou subpartições, você pode usar a mesma Query com uma cláusula `WHERE` modificada para recuperar os tamanhos dos Indexes. Por exemplo, a seguinte Query recupera os tamanhos dos Indexes para partições da tabela `t1`:

```sql
mysql> SELECT SUM(stat_value) pages, index_name,
       SUM(stat_value)*@@innodb_page_size size
       FROM mysql.innodb_index_stats WHERE table_name like 't1#P%'
       AND stat_name = 'size' GROUP BY index_name;
```
