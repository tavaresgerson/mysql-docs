#### 13.7.2.1 Instrução ANALYZE TABLE

```sql
ANALYZE [NO_WRITE_TO_BINLOG | LOCAL]
    TABLE tbl_name [, tbl_name] ...
```

A instrução `ANALYZE TABLE` executa uma análise de distribuição de Key e armazena essa distribuição para a(s) table(s) nomeada(s). Para tables `MyISAM`, esta instrução é equivalente a usar [**myisamchk --analyze**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility").

Esta instrução requer os privilégios [`SELECT`](privileges-provided.html#priv_select) e [`INSERT`](privileges-provided.html#priv_insert) para a table.

`ANALYZE TABLE` funciona com tables `InnoDB`, `NDB` e `MyISAM`. Não funciona com Views.

`ANALYZE TABLE` é suportado para tables particionadas, e você pode usar `ALTER TABLE ... ANALYZE PARTITION` para analisar uma ou mais Partitions; para mais informações, consulte [Seção 13.1.8, “Instrução ALTER TABLE”](alter-table.html "13.1.8 ALTER TABLE Statement"), e [Seção 22.3.4, “Manutenção de Partitions”](partitioning-maintenance.html "22.3.4 Maintenance of Partitions").

Durante a análise, a table é bloqueada com um Read Lock para `InnoDB` e `MyISAM`.

`ANALYZE TABLE` remove a table do cache de definição da table, o que requer um Flush Lock. Se houver instruções ou Transactions de longa duração ainda usando a table, as instruções e Transactions subsequentes devem esperar que essas operações terminem antes que o Flush Lock seja liberado. Como o próprio `ANALYZE TABLE` geralmente termina rapidamente, pode não ser aparente que as Transactions ou instruções atrasadas envolvendo a mesma table sejam devidas ao Flush Lock restante.

Por padrão, o servidor grava as instruções `ANALYZE TABLE` no Binary Log para que sejam replicadas para as Replicas. Para suprimir o log, especifique a palavra-chave opcional `NO_WRITE_TO_BINLOG` ou seu alias `LOCAL`.

* [Saída do ANALYZE TABLE](analyze-table.html#analyze-table-output "ANALYZE TABLE Output")
* [Análise de Distribuição de Key](analyze-table.html#analyze-table-key-distribution-analysis "Key Distribution Analysis")
* [Outras Considerações](analyze-table.html#analyze-table-other-considerations "Other Considerations")

##### Saída do ANALYZE TABLE

`ANALYZE TABLE` retorna um conjunto de resultados com as colunas mostradas na tabela a seguir.

<table summary="Colunas do conjunto de resultados do ANALYZE TABLE."><col style="width: 15%"/><col style="width: 60%"/><thead><tr> <th>Coluna</th> <th>Valor</th> </tr></thead><tbody><tr> <td><code>Table</code></td> <td>O nome da table</td> </tr><tr> <td><code>Op</code></td> <td>Sempre <code>analyze</code></td> </tr><tr> <td><code>Msg_type</code></td> <td><code>status</code>, <code>error</code>, <code>info</code>, <code>note</code>, ou <code>warning</code></td> </tr><tr> <td><code>Msg_text</code></td> <td>Uma mensagem informativa</td> </tr> </tbody></table>

##### Análise de Distribuição de Key

Se a table não foi alterada desde a última análise de distribuição de Key, a table não é analisada novamente.

O MySQL usa a distribuição de Key armazenada para decidir a ordem de JOIN das tables para JOINs em algo diferente de uma constante. Além disso, as distribuições de Key podem ser usadas ao decidir quais Indexes usar para uma table específica dentro de uma Query.

Para verificar a Cardinality da distribuição de Key armazenada, use a instrução [`SHOW INDEX`](show-index.html "13.7.5.22 SHOW INDEX Statement") ou a table [`STATISTICS`](information-schema-statistics-table.html "24.3.24 The INFORMATION_SCHEMA STATISTICS Table") do `INFORMATION_SCHEMA`. Consulte [Seção 13.7.5.22, “Instrução SHOW INDEX”](show-index.html "13.7.5.22 SHOW INDEX Statement"), e [Seção 24.3.24, “A Tabela INFORMATION_SCHEMA STATISTICS”](information-schema-statistics-table.html "24.3.24 The INFORMATION_SCHEMA STATISTICS Table").

Para tables `InnoDB`, `ANALYZE TABLE` determina a Cardinality do Index realizando 'mergulhos' (dives) aleatórios em cada uma das árvores de Index e atualizando as estimativas de Cardinality do Index de acordo. Como estas são apenas estimativas, execuções repetidas de `ANALYZE TABLE` podem produzir números diferentes. Isso torna o `ANALYZE TABLE` rápido em tables `InnoDB`, mas não 100% preciso porque não leva todas as Rows em consideração.

Você pode tornar as Statistics coletadas por `ANALYZE TABLE` mais precisas e mais estáveis ativando [`innodb_stats_persistent`], conforme explicado na [Seção 14.8.11.1, “Configurando Parâmetros de Statistics Persistentes do Optimizer”](innodb-persistent-stats.html "14.8.11.1 Configuring Persistent Optimizer Statistics Parameters"). Quando [`innodb_stats_persistent`] está ativado, é importante executar `ANALYZE TABLE` após grandes alterações nos dados da coluna do Index, pois as Statistics não são recalculadas periodicamente (como após a reinicialização de um servidor).

Se [`innodb_stats_persistent`] estiver ativado, você pode alterar o número de 'mergulhos' aleatórios modificando a variável de sistema [`innodb_stats_persistent_sample_pages`]. Se [`innodb_stats_persistent`] estiver desativado, modifique [`innodb_stats_transient_sample_pages`] em vez disso.

Para mais informações sobre a análise de distribuição de Key no `InnoDB`, consulte [Seção 14.8.11.1, “Configurando Parâmetros de Statistics Persistentes do Optimizer”](innodb-persistent-stats.html "14.8.11.1 Configuring Persistent Optimizer Statistics Parameters"), e [Seção 14.8.11.3, “Estimando a Complexidade do ANALYZE TABLE para Tables InnoDB”](innodb-analyze-table-complexity.html "14.8.11.3 Estimating ANALYZE TABLE Complexity for InnoDB Tables").

O MySQL usa estimativas de Cardinality de Index na otimização de JOIN. Se um JOIN não for otimizado da maneira correta, tente executar `ANALYZE TABLE`. Nos poucos casos em que `ANALYZE TABLE` não produz valores bons o suficiente para suas tables específicas, você pode usar `FORCE INDEX` com suas Queries para forçar o uso de um Index específico, ou definir a variável de sistema [`max_seeks_for_key`] para garantir que o MySQL prefira Index Lookups em vez de Table Scans. Consulte [Seção B.3.5, “Questões Relacionadas ao Optimizer”](optimizer-issues.html "B.3.5 Optimizer-Related Issues").

##### Outras Considerações

`ANALYZE TABLE` limpa as Statistics da table na View [`INNODB_SYS_TABLESTATS`] do Information Schema e define a coluna `STATS_INITIALIZED` como `Uninitialized`. As Statistics são coletadas novamente na próxima vez que a table for acessada.