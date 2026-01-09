#### 15.7.3.1 Declaração de Análise de Tabela

```
ANALYZE [NO_WRITE_TO_BINLOG | LOCAL]
    TABLE tbl_name [, tbl_name] ...

ANALYZE [NO_WRITE_TO_BINLOG | LOCAL]
    TABLE tbl_name
    UPDATE HISTOGRAM ON col_name [, col_name] ...
        [WITH N BUCKETS]
    [{MANUAL | AUTO} UPDATE]

ANALYZE [NO_WRITE_TO_BINLOG | LOCAL]
    TABLE tbl_name
    UPDATE HISTOGRAM ON col_name [USING DATA 'json_data']

ANALYZE [NO_WRITE_TO_BINLOG | LOCAL]
    TABLE tbl_name
    DROP HISTOGRAM ON col_name [, col_name] ...
```

`ANALYZE TABLE` gera estatísticas da tabela:

* `ANALYZE TABLE` sem a cláusula `HISTOGRAM` realiza uma análise da distribuição de chaves e armazena a distribuição para a(s) tabela(s) nomeada(s). Para tabelas `MyISAM`, `ANALYZE TABLE` para análise de distribuição de chaves é equivalente ao uso de **myisamchk --analyze**.

* `ANALYZE TABLE` com a cláusula `UPDATE HISTOGRAM` gera estatísticas de histograma para as colunas da tabela nomeada e as armazena no dicionário de dados. Apenas um nome de tabela é permitido com essa sintaxe. O MySQL também suporta a definição do histograma de uma única coluna para um valor JSON definido pelo usuário.

* `ANALYZE TABLE` com a cláusula `DROP HISTOGRAM` remove estatísticas de histograma para as colunas da tabela nomeada do dicionário de dados. Apenas um nome de tabela é permitido para essa sintaxe.

Esta declaração requer privilégios de `SELECT` e `INSERT` para a tabela.

`ANALYZE TABLE` funciona com tabelas `InnoDB`, `NDB` e `MyISAM`. Não funciona com visualizações.

Se a variável de sistema `innodb_read_only` estiver habilitada, `ANALYZE TABLE` pode falhar porque não pode atualizar tabelas de estatísticas no dicionário de dados, que usam `InnoDB`. Para operações de `ANALYZE TABLE` que atualizam a distribuição de chaves, a falha pode ocorrer mesmo se a operação atualizar a própria tabela (por exemplo, se for uma tabela `MyISAM`). Para obter as estatísticas de distribuição atualizadas, defina `information_schema_stats_expiry=0`.

`ANALYZE TABLE` é suportado para tabelas particionadas e você pode usar `ALTER TABLE ... ANALYZE PARTITION` para analisar uma ou mais particionamentos; para mais informações, consulte a Seção 15.1.11, “Declaração `ALTER TABLE`” e a Seção 26.3.4, “Manutenção de Partições”.

Durante a análise, a tabela é bloqueada com um bloqueio de leitura para `InnoDB` e `MyISAM`.

Por padrão, o servidor escreve instruções `ANALYZE TABLE` no log binário para que elas sejam replicadas para as réplicas. Para suprimir o registro, especifique a palavra-chave opcional `NO_WRITE_TO_BINLOG` ou seu alias `LOCAL`.

* Saída de ANALYZE TABLE
* Análise da Distribuição de Chaves
* Análise de Estatísticas de Histograma
* Outras Considerações

##### Saída de ANALYZE TABLE

`ANALYZE TABLE` retorna um conjunto de resultados com as colunas mostradas na tabela a seguir.

<table summary="Colunas do conjunto de resultados de ANALYZE TABLE."><col style="width: 15%"/><col style="width: 60%"/><thead><tr> <th>Coluna</th> <th>Valor</th> </tr></thead><tbody><tr> <td><code>Table</code></td> <td>O nome da tabela</td> </tr><tr> <td><code>Op</code></td> <td><code>analyze</code> ou <code>histogram</code></td> </tr><tr> <td><code>Msg_type</code></td> <td><code>status</code>, <code>error</code>, <code>info</code>, <code>note</code>, ou <code>warning</code></td> </tr><tr> <td><code>Msg_text</code></td> <td>Uma mensagem informativa</td> </tr></tbody></table>

##### Análise da Distribuição de Chaves

`ANALYZE TABLE` sem a cláusula `HISTOGRAM` realiza uma análise da distribuição de chaves e armazena a distribuição para a(s) tabela(s). Quaisquer estatísticas de histogramas existentes permanecem inalteradas.

Se a tabela não tiver sido alterada desde a última análise da distribuição de chaves, a tabela não é analisada novamente.

O MySQL usa a distribuição de chaves armazenada para decidir a ordem em que as tabelas devem ser unidas para junções em algo além de uma constante. Além disso, as distribuições de chaves podem ser usadas ao decidir quais índices usar para uma tabela específica dentro de uma consulta.

Para verificar a cardinalidade da distribuição de chaves armazenadas, use a instrução `SHOW INDEX` ou a tabela `STATÍSTICAS` do `INFORMATION_SCHEMA`. Veja a Seção 15.7.7.24, “Instrução SHOW INDEX”, e a Seção 28.3.40, “A Tabela STATÍSTICAS do INFORMATION_SCHEMA”.

Para tabelas `InnoDB`, o `ANALYZE TABLE` determina a cardinalidade do índice realizando mergulhos aleatórios em cada um dos árvores de índice e atualizando as estimativas da cardinalidade do índice de acordo. Como essas são apenas estimativas, execuções repetidas do `ANALYZE TABLE` podem produzir números diferentes. Isso torna o `ANALYZE TABLE` rápido em tabelas `InnoDB`, mas não 100% preciso porque não leva em conta todas as linhas.

Você pode tornar as estatísticas coletadas pelo `ANALYZE TABLE` mais precisas e mais estáveis, habilitando `innodb_stats_persistent`, conforme explicado na Seção 17.8.10.1, “Configurando Parâmetros de Estatísticas de Otimizador Persistente”. Quando `innodb_stats_persistent` está habilitado, é importante executar o `ANALYZE TABLE` após mudanças importantes nos dados das colunas do índice, pois as estatísticas não são recalculadas periodicamente (como após o reinício do servidor).

Se `innodb_stats_persistent` estiver habilitado, você pode alterar o número de mergulhos aleatórios modificando a variável de sistema `innodb_stats_persistent_sample_pages`. Se `innodb_stats_persistent` estiver desabilitado, modifique `innodb_stats_transient_sample_pages` em vez disso.

Para mais informações sobre a análise da distribuição de chaves em `InnoDB`, consulte a Seção 17.8.10.1, “Configurando Parâmetros de Estatísticas de Otimizador Persistente”, e a Seção 17.8.10.3, “Estimativa da Complexidade do ANALYZE TABLE para Tabelas InnoDB”.

O MySQL utiliza estimativas de cardinalidade de índices na otimização de junções. Se uma junção não for otimizada da maneira correta, tente executar `ANALYZE TABLE`. Nos poucos casos em que o `ANALYZE TABLE` não produz valores suficientes para suas tabelas específicas, você pode usar `FORCE INDEX` com suas consultas para forçar o uso de um índice específico ou definir a variável de sistema `max_seeks_for_key` para garantir que o MySQL prefira buscas em índices em vez de varreduras em tabelas. Veja a Seção B.3.5, “Problemas Relacionados ao Otimizador”.

##### Análise de Estatísticas de Histograma

`ANALYZE TABLE` com a cláusula `HISTOGRAM` permite a gestão de estatísticas de histograma para os valores das colunas da tabela. Para informações sobre estatísticas de histograma, consulte a Seção 10.9.6, “Estatísticas do Otimizador”.

Estas operações de histograma estão disponíveis:

* `ANALYZE TABLE` com uma cláusula `UPDATE HISTOGRAM` gera estatísticas de histograma para as colunas da tabela nomeadas e armazena-as no dicionário de dados. Apenas um nome de tabela é permitido para este sintaxe.

A cláusula opcional `WITH N BUCKETS` especifica o número de buckets para o histograma. O valor de *`N`* deve ser um inteiro no intervalo de 1 a 1024. Se esta cláusula for omitida, o número de buckets é 100.

A cláusula opcional `AUTO UPDATE` habilita atualizações automáticas dos histogramas na tabela. Quando habilitada, uma declaração `ANALYZE TABLE` nesta tabela atualiza automaticamente o histograma, usando o mesmo número de buckets especificados anteriormente por `WITH ... BUCKETS` se isso foi previamente definido para esta tabela. Além disso, ao recalcular estatísticas persistentes para a tabela (veja a Seção 17.8.10.1, “Configurando Parâmetros de Estatísticas do Otimizador Persistente”), o fio de estatísticas de fundo do `InnoDB` também atualiza o histograma. `MANUAL UPDATE` desabilita atualizações automáticas e é o ajuste padrão se não for especificado.

* `ANALYSE TÁBLIA` com uma cláusula `DROP HISTÓGRAMA` remove as estatísticas do histograma para as colunas da tabela nomeadas do dicionário de dados. Apenas um nome de tabela é permitido para essa sintaxe.

As declarações de gerenciamento de histograma armazenadas afetam apenas as colunas nomeadas. Considere estas declarações:

```
ANALYZE TABLE t UPDATE HISTOGRAM ON c1, c2, c3 WITH 10 BUCKETS;
ANALYZE TABLE t UPDATE HISTOGRAM ON c1, c3 WITH 10 BUCKETS;
ANALYZE TABLE t DROP HISTOGRAM ON c2;
```

A primeira declaração atualiza os histogramas para as colunas `c1`, `c2` e `c3`, substituindo quaisquer histogramas existentes para essas colunas. A segunda declaração atualiza os histogramas para `c1` e `c3`, deixando o histograma de `c2` ileso. A terceira declaração remove o histograma para `c2`, deixando os de `c1` e `c3` ilesos.

Ao coletar amostras de dados de usuários como parte da construção de um histograma, nem todos os valores são lidos; isso pode levar à perda de alguns valores considerados importantes. Nesses casos, pode ser útil modificar o histograma ou definir seu próprio histograma explicitamente com base em seus próprios critérios, como o conjunto de dados completo. `ANALYSE TÁBLIA tbl_name UPDATE HISTÓGRAMA COM COLUNA col_name USANDO DATA 'json_data'` atualiza uma coluna da tabela de histograma com dados fornecidos no mesmo formato JSON usado para exibir os valores da coluna `HISTÓGRAMA` da tabela `COLUMN_STATISTICS` do Schema de Informações. Apenas uma coluna pode ser modificada ao atualizar o histograma com dados JSON.

Podemos ilustrar o uso de `USING DATA` gerando primeiro um histograma na coluna `c1` da tabela `t`, assim:

```
mysql> ANALYZE TABLE t UPDATE HISTOGRAM ON c1;
+-------+-----------+----------+-----------------------------------------------+
| Table | Op        | Msg_type | Msg_text                                      |
+-------+-----------+----------+-----------------------------------------------+
| h.t   | histogram | status   | Histogram statistics created for column 'c1'. |
+-------+-----------+----------+-----------------------------------------------+
1 row in set (0.00 sec)
```

Podemos ver o histograma gerado na tabela `COLUMN_STATISTICS`:

```
mysql> TABLE information_schema.column_statistics\G
*************************** 1. row ***************************
SCHEMA_NAME: h
 TABLE_NAME: t
COLUMN_NAME: c1
  HISTOGRAM: {"buckets": [], "data-type": "int", "auto-update": false,
"null-values": 0.0, "collation-id": 8, "last-updated": "2024-03-26
16:54:43.674995", "sampling-rate": 1.0, "histogram-type": "singleton",
"number-of-buckets-specified": 100}
1 row in set (0.00 sec)
```

Agora, descartamos o histograma, e ao verificar `COLUMN_STATISTICS`, ele está vazio:

```
mysql> ANALYZE TABLE t DROP HISTOGRAM ON c1;
+-------+-----------+----------+-----------------------------------------------+
| Table | Op        | Msg_type | Msg_text                                      |
+-------+-----------+----------+-----------------------------------------------+
| h.t   | histogram | status   | Histogram statistics removed for column 'c1'. |
+-------+-----------+----------+-----------------------------------------------+
1 row in set (0.01 sec)

mysql> TABLE information_schema.column_statistics\G
Empty set (0.00 sec)
```

Podemos restaurar o histograma perdido inserindo sua representação JSON obtida anteriormente da coluna `HISTOGRAM` da tabela `COLUMN_STATISTICS`, e quando fizermos uma nova consulta a essa tabela, veremos que o histograma foi restaurado ao seu estado anterior:

```
mysql> ANALYZE TABLE t UPDATE HISTOGRAM ON c1
    ->     USING DATA '{"buckets": [], "data-type": "int", "auto-update": false,
    ->               "null-values": 0.0, "collation-id": 8, "last-updated": "2024-03-26
    ->               16:54:43.674995", "sampling-rate": 1.0, "histogram-type": "singleton",
    ->               "number-of-buckets-specified": 100}';
+-------+-----------+----------+-----------------------------------------------+
| Table | Op        | Msg_type | Msg_text                                      |
+-------+-----------+----------+-----------------------------------------------+
| h.t   | histogram | status   | Histogram statistics created for column 'c1'. |
+-------+-----------+----------+-----------------------------------------------+

mysql> TABLE information_schema.column_statistics\G
*************************** 1. row ***************************
SCHEMA_NAME: h
 TABLE_NAME: t
COLUMN_NAME: c1
  HISTOGRAM: {"buckets": [], "data-type": "int", "auto-update": false,
"null-values": 0.0, "collation-id": 8, "last-updated": "2024-03-26
16:54:43.674995", "sampling-rate": 1.0, "histogram-type": "singleton",
"number-of-buckets-specified": 100}
```

A geração de histogramas não é suportada para tabelas criptografadas (para evitar expor dados nas estatísticas) ou tabelas `TEMPORARY`.

A geração de histogramas se aplica a colunas de todos os tipos de dados, exceto tipos de geometria (dados espaciais) e `JSON`.

Histogramas podem ser gerados para colunas armazenadas e geradas virtualmente.

Histogramas não podem ser gerados para colunas que estão cobertas por índices únicos de uma coluna.

As instruções de gerenciamento de histogramas tentam realizar a maior parte da operação solicitada possível e relatam mensagens de diagnóstico para o restante. Por exemplo, se uma instrução `UPDATE HISTOGRAM` nomear várias colunas, mas algumas delas não existirem ou tiverem um tipo de dado não suportado, os histogramas são gerados para as outras colunas e mensagens são produzidas para as colunas inválidas.

Os histogramas são afetados por essas instruções DDL:

* `DROP TABLE` remove histogramas para colunas na tabela removida.

* `DROP DATABASE` remove histogramas para qualquer tabela na base de dados removida, pois a instrução remove todas as tabelas na base de dados.

* `RENAME TABLE` não remove histogramas. Em vez disso, renomeia os histogramas para a tabela renomeada para ser associada ao novo nome da tabela.

* As instruções `ALTER TABLE` que removem ou modificam uma coluna removem histogramas para essa coluna.

* `ALTER TABLE ... CONVERT TO CHARACTER SET` remove histogramas para colunas de caracteres porque elas são afetadas pela mudança do conjunto de caracteres. Os histogramas para colunas não de caracteres permanecem inalterados.

A variável de sistema `histogram_generation_max_mem_size` controla o tamanho máximo de memória disponível para a geração de histogramas. Os valores globais e de sessão podem ser definidos em tempo de execução.

Para alterar o valor global `histogram_generation_max_mem_size`, é necessário ter privilégios suficientes para definir variáveis de sistema globais. Para alterar o valor de sessão `histogram_generation_max_mem_size`, é necessário ter privilégios suficientes para definir variáveis de sistema de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

Se a quantidade estimada de dados a ser lida na memória para a geração de histogramas exceder o limite definido por `histogram_generation_max_mem_size`, o MySQL amostra os dados em vez de lê-los completamente na memória. A amostragem é distribuída uniformemente por toda a tabela. O MySQL usa a amostragem `SYSTEM`, que é um método de amostragem de nível de página.

O valor `sampling-rate` na coluna `HISTOGRAM` da tabela `COLUMN_STATISTICS` do Schema de Informações pode ser consultada para determinar a fração de dados que foi amostrada para criar o histograma. O `sampling-rate` é um número entre 0,0 e 1,0. Um valor de 1 significa que todos os dados foram lidos (sem amostragem).

O seguinte exemplo demonstra a amostragem. Para garantir que a quantidade de dados exceda o limite `histogram_generation_max_mem_size` para o propósito do exemplo, o limite é definido para um valor baixo (2.000.000 bytes) antes de gerar estatísticas de histograma para a coluna `birth_date` da tabela `employees`.

```
mysql> SET histogram_generation_max_mem_size = 2000000;

mysql> USE employees;

mysql> ANALYZE TABLE employees UPDATE HISTOGRAM ON birth_date WITH 16 BUCKETS\G
*************************** 1. row ***************************
   Table: employees.employees
      Op: histogram
Msg_type: status
Msg_text: Histogram statistics created for column 'birth_date'.

mysql> SELECT HISTOGRAM->>'$."sampling-rate"'
       FROM INFORMATION_SCHEMA.COLUMN_STATISTICS
       WHERE TABLE_NAME = "employees"
       AND COLUMN_NAME = "birth_date";
+---------------------------------+
| HISTOGRAM->>'$."sampling-rate"' |
+---------------------------------+
| 0.0491431208869665              |
+---------------------------------+
```

Um valor de `sampling-rate` de 0,0491431208869665 significa que aproximadamente 4,9% dos dados da coluna `birth_date` foram lidos na memória para a geração de estatísticas de histograma.

O mecanismo de armazenamento `InnoDB` fornece sua própria implementação de amostragem para dados armazenados em tabelas `InnoDB`. A implementação padrão de amostragem usada pelo MySQL quando os mecanismos de armazenamento não fornecem sua própria exige uma varredura completa da tabela, o que é custoso para tabelas grandes. A implementação de amostragem do `InnoDB` melhora o desempenho da amostragem ao evitar varreduras completas da tabela.

Os contadores `sampled_pages_read` e `sampled_pages_skipped` do `INNODB_METRICS` podem ser usados para monitorar a amostragem de páginas de dados `InnoDB`. (Para informações gerais sobre o uso do contador `INNODB_METRICS`, consulte a Seção 28.4.21, “A Tabela INFORMATION_SCHEMA INNODB_METRICS”.)

O exemplo seguinte demonstra o uso do contador de amostragem, que requer a habilitação dos contadores antes de gerar estatísticas de histograma.

```
mysql> SET GLOBAL innodb_monitor_enable = 'sampled%';

mysql> USE employees;

mysql> ANALYZE TABLE employees UPDATE HISTOGRAM ON birth_date WITH 16 BUCKETS\G
*************************** 1. row ***************************
   Table: employees.employees
      Op: histogram
Msg_type: status
Msg_text: Histogram statistics created for column 'birth_date'.

mysql> USE INFORMATION_SCHEMA;

mysql> SELECT NAME, COUNT FROM INNODB_METRICS WHERE NAME LIKE 'sampled%'\G
*************************** 1. row ***************************
 NAME: sampled_pages_read
COUNT: 43
*************************** 2. row ***************************
 NAME: sampled_pages_skipped
COUNT: 843
```

Esta fórmula aproxima uma taxa de amostragem com base nos dados do contador de amostragem:

```
sampling rate = sampled_page_read/(sampled_pages_read + sampled_pages_skipped)
```

Uma taxa de amostragem com base nos dados do contador de amostragem é aproximadamente a mesma que o valor `sampling-rate` na coluna `HISTOGRAM` da tabela `COLUMN_STATISTICS` do Schema de Informações `INNODB_METRICS`.

Para informações sobre as alocações de memória realizadas para a geração do histograma, monitore o instrumento do Schema de Desempenho `memory/sql/histograms`. Consulte a Seção 29.12.20.10, “Tabelas de Resumo de Memória”.

##### Outras Considerações

`ANALYZE TABLE` limpa as estatísticas da tabela da tabela `INNODB_TABLESTATS` do Schema de Informações e define a coluna `STATS_INITIALIZED` para `Uninitialized`. As estatísticas são coletadas novamente na próxima vez que a tabela for acessada.