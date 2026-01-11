#### 13.7.2.1 Declaração de Tabela de Análise

```sql
ANALYZE [NO_WRITE_TO_BINLOG | LOCAL]
    TABLE tbl_name [, tbl_name] ...
```

`ANALYSE TÁBLIA` realiza uma análise da distribuição de chaves e armazena a distribuição para a(s) tabela(s) nomeada(s). Para tabelas `MyISAM`, esta declaração é equivalente ao uso de **myisamchk --analyze**.

Esta declaração requer privilégios de `SELECT` e `INSERT` para a tabela.

`ANALYSE TÁBLIA` funciona com tabelas `InnoDB`, `NDB` e `MyISAM`. Não funciona com visualizações.

A opção `ANALYZE TABLE` é suportada para tabelas particionadas, e você pode usar `ALTER TABLE ... ANALYZE PARTITION` para analisar uma ou mais partições; para mais informações, consulte Seção 13.1.8, “Instrução ALTER TABLE” e Seção 22.3.4, “Manutenção de Partições”.

Durante a análise, a tabela é bloqueada com um bloqueio de leitura para `InnoDB` e `MyISAM`.

`ANALYSE Tabela` remove a tabela do cache de definição de tabela, o que requer um bloqueio de varredura. Se houver instruções ou transações em execução que ainda estejam usando a tabela, instruções e transações subsequentes devem esperar que essas operações sejam concluídas antes que o bloqueio de varredura seja liberado. Como o próprio `ANALYSE Tabela` geralmente termina rapidamente, pode não ser aparente que transações ou instruções atrasadas que envolvem a mesma tabela são devidas ao bloqueio de varredura restante.

Por padrão, o servidor escreve as instruções `ANALYZE TABLE` no log binário para que elas sejam replicadas para as réplicas. Para suprimir o registro, especifique a palavra-chave opcional `NO_WRITE_TO_BINLOG` ou seu alias `LOCAL`.

- SAIBA MAIS SOBRE A TABELA
- Análise da Distribuição de Chaves
- Outras Considerações

##### ANALISE Tabela de Saída

`ANALYSE TABELA` retorna um conjunto de resultados com as colunas mostradas na tabela a seguir.

<table summary="Colunas do conjunto de resultados da tabela ANALYZE."><col style="width: 15%"/><col style="width: 60%"/><thead><tr> <th>Coluna</th> <th>Valor</th> </tr></thead><tbody><tr> <td><code>Table</code></td> <td>O nome da tabela</td> </tr><tr> <td><code>Op</code></td> <td>Sempre <code>analyze</code></td> </tr><tr> <td><code>Msg_type</code></td> <td><code>status</code>, <code>error</code>, <code>info</code>, <code>note</code> ou <code>warning</code></td> </tr><tr> <td><code>Msg_text</code></td> <td>Uma mensagem informativa</td> </tr></tbody></table>

##### Análise da Distribuição de Chave

Se a tabela não tiver sido alterada desde a última análise de distribuição de chaves, a tabela não será analisada novamente.

O MySQL utiliza a distribuição de chaves armazenadas para decidir a ordem de junção da tabela para junções em algo que não seja uma constante. Além disso, as distribuições de chaves podem ser usadas ao decidir quais índices usar para uma tabela específica dentro de uma consulta.

Para verificar a cardinalidade da distribuição de chaves armazenadas, use a instrução `SHOW INDEX` ou a tabela `INFORMATION_SCHEMA [`STATISTICS\`]\(information-schema-statistics-table.html). Veja Seção 13.7.5.22, “Instrução SHOW INDEX” e Seção 24.3.24, “A Tabela INFORMATION_SCHEMA STATISTICS”.

Para as tabelas do `InnoDB`, o `ANALYZE TABLE` determina a cardinalidade do índice executando mergulhos aleatórios em cada um dos árvores de índice e atualizando as estimativas da cardinalidade do índice conforme necessário. Como essas são apenas estimativas, execuções repetidas do `ANALYZE TABLE` podem produzir números diferentes. Isso torna o `ANALYZE TABLE` rápido em tabelas do `InnoDB`, mas não 100% preciso, porque ele não leva em conta todas as linhas.

Você pode tornar as estatísticas coletadas pelo `ANALYZE TABLE` mais precisas e mais estáveis ao habilitar `innodb_stats_persistent`, conforme explicado em Seção 14.8.11.1, “Configurando Parâmetros de Estatísticas de Otimizador Persistente”. Quando o `innodb_stats_persistent` está habilitado, é importante executar o `ANALYZE TABLE` após alterações importantes nos dados das colunas do índice, pois as estatísticas não são recalculadas periodicamente (como após o reinício do servidor).

Se `innodb_stats_persistent` estiver habilitado, você pode alterar o número de mergulhos aleatórios modificando a variável de sistema `innodb_stats_persistent_sample_pages`. Se `innodb_stats_persistent` estiver desabilitado, modifique `innodb_stats_transient_sample_pages` em vez disso.

Para obter mais informações sobre a análise da distribuição de chaves no `InnoDB`, consulte Seção 14.8.11.1, “Configurando Parâmetros de Estatísticas do Otimizador Persistente” e Seção 14.8.11.3, “Estimativa da Complexidade da Tabela ANALYZE para Tabelas InnoDB”.

O MySQL utiliza estimativas de cardinalidade de índices na otimização de junções. Se uma junção não for otimizada da maneira correta, tente executar `ANALYZE TABLE`. Nos poucos casos em que o `ANALYZE TABLE` não produz valores suficientes para suas tabelas específicas, você pode usar `FORCE INDEX` com suas consultas para forçar o uso de um índice específico ou definir a variável de sistema `max_seeks_for_key` para garantir que o MySQL prefira buscas em índices em vez de varreduras em tabelas. Veja Seção B.3.5, “Problemas Relacionados ao Otimizador”.

##### Outras considerações

`ANALYSE TÁVEL` limpa as estatísticas da tabela do esquema de informações `INNODB_SYS_TABLESTATS` e define a coluna `STATS_INITIALIZED` como `Não inicializada`. As estatísticas são coletadas novamente na próxima vez que a tabela for acessada.
