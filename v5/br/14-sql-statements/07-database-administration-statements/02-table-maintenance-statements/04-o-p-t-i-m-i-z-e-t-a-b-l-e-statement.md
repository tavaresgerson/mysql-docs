#### 13.7.2.4 Instrução OPTIMIZE TABLE

```sql
OPTIMIZE [NO_WRITE_TO_BINLOG | LOCAL]
    TABLE tbl_name [, tbl_name] ...
```

`OPTIMIZE TABLE` reorganiza o armazenamento físico dos dados da tabela e dos dados de Index associados, para reduzir o espaço de armazenamento e melhorar a eficiência de I/O ao acessar a tabela. As alterações exatas feitas em cada tabela dependem do storage engine utilizado por essa tabela.

Use `OPTIMIZE TABLE` nestes casos, dependendo do tipo de tabela:

*   Após realizar operações substanciais de insert, update ou delete em uma tabela `InnoDB` que possui seu próprio .ibd file porque foi criada com a opção `innodb_file_per_table` habilitada. A tabela e os Indexes são reorganizados, e o espaço em disco pode ser recuperado para uso pelo sistema operacional.

*   Após realizar operações substanciais de insert, update ou delete em colunas que fazem parte de um Index `FULLTEXT` em uma tabela `InnoDB`. Defina primeiro a opção de configuração `innodb_optimize_fulltext_only=1`. Para manter o período de manutenção do Index em um tempo razoável, defina a opção `innodb_ft_num_word_optimize` para especificar quantas palavras atualizar no Index de pesquisa e execute uma sequência de instruções `OPTIMIZE TABLE` até que o Index de pesquisa esteja totalmente atualizado.

*   Após deletar uma grande parte de uma tabela `MyISAM` ou `ARCHIVE`, ou fazer muitas alterações em uma tabela `MyISAM` ou `ARCHIVE` com linhas de comprimento variável (tabelas que possuem colunas `VARCHAR`, `VARBINARY`, `BLOB`, ou `TEXT`). Linhas deletadas são mantidas em uma lista ligada e operações subsequentes de `INSERT` reutilizam posições antigas das linhas. Você pode usar `OPTIMIZE TABLE` para recuperar o espaço não utilizado e desfragmentar o arquivo de dados. Após alterações extensas em uma tabela, esta instrução também pode melhorar o performance de instruções que utilizam a tabela, às vezes significativamente.

Esta instrução requer privilégios `SELECT` e `INSERT` para a tabela.

`OPTIMIZE TABLE` funciona para tabelas `InnoDB`, `MyISAM` e `ARCHIVE`. `OPTIMIZE TABLE` também é suportado para colunas dinâmicas de tabelas `NDB` in-memory. Não funciona para colunas de largura fixa de tabelas in-memory, nem funciona para tabelas Disk Data. O performance do `OPTIMIZE` em tabelas NDB Cluster pode ser ajustado usando `--ndb-optimization-delay`, que controla o tempo de espera entre o processamento de batches de linhas por `OPTIMIZE TABLE`. Para mais informações, consulte Previous NDB Cluster Issues Resolved in NDB Cluster 8.0.

Para tabelas NDB Cluster, `OPTIMIZE TABLE` pode ser interrompido por (por exemplo) encerrando a Thread SQL que executa a operação `OPTIMIZE`.

Por padrão, `OPTIMIZE TABLE` *não* funciona para tabelas criadas usando qualquer outro storage engine e retorna um resultado indicando essa falta de suporte. Você pode fazer com que `OPTIMIZE TABLE` funcione para outros storage engines iniciando o **mysqld** com a opção `--skip-new`. Neste caso, `OPTIMIZE TABLE` é apenas mapeado para `ALTER TABLE`.

Esta instrução não funciona com views.

`OPTIMIZE TABLE` é suportado para tabelas particionadas. Para informações sobre como usar esta instrução com tabelas e partições particionadas, consulte Section 22.3.4, “Maintenance of Partitions”.

Por padrão, o servidor escreve instruções `OPTIMIZE TABLE` no binary log para que sejam replicadas para as réplicas. Para suprimir o log, especifique a palavra-chave opcional `NO_WRITE_TO_BINLOG` ou seu alias `LOCAL`.

*   Saída de OPTIMIZE TABLE
*   Detalhes do InnoDB
*   Detalhes do MyISAM
*   Outras Considerações

##### Saída de OPTIMIZE TABLE

`OPTIMIZE TABLE` retorna um result set com as colunas mostradas na tabela a seguir.

<table summary="Colunas do result set OPTIMIZE TABLE."><col style="width: 15%"/><col style="width: 60%"/><thead><tr> <th>Coluna</th> <th>Valor</th> </tr></thead><tbody><tr> <td><code>Table</code></td> <td>O nome da tabela</td> </tr><tr> <td><code>Op</code></td> <td>Sempre <code>optimize</code></td> </tr><tr> <td><code>Msg_type</code></td> <td><code>status</code>, <code>error</code>, <code>info</code>, <code>note</code>, ou <code>warning</code></td> </tr><tr> <td><code>Msg_text</code></td> <td>Uma mensagem informativa</td> </tr> </tbody></table>

`OPTIMIZE TABLE` captura e lança quaisquer erros que ocorram durante a cópia de estatísticas da tabela do arquivo antigo para o arquivo recém-criado. Por exemplo, se o ID de usuário do proprietário do arquivo `.frm`, `.MYD` ou `.MYI` for diferente do ID de usuário do processo **mysqld**, `OPTIMIZE TABLE` gera um erro "cannot change ownership of the file" (não é possível alterar a propriedade do arquivo), a menos que o **mysqld** seja iniciado pelo usuário `root`.

##### Detalhes do InnoDB

Para tabelas `InnoDB`, `OPTIMIZE TABLE` é mapeado para `ALTER TABLE ... FORCE`, que reconstrói a tabela para atualizar as estatísticas de Index e liberar espaço não utilizado no clustered Index. Isso é exibido na saída de `OPTIMIZE TABLE` quando você o executa em uma tabela `InnoDB`, conforme mostrado aqui:

```sql
mysql> OPTIMIZE TABLE foo;
+----------+----------+----------+-------------------------------------------------------------------+
| Table    | Op       | Msg_type | Msg_text                                                          |
+----------+----------+----------+-------------------------------------------------------------------+
| test.foo | optimize | note     | Table does not support optimize, doing recreate + analyze instead |
| test.foo | optimize | status   | OK                                                                |
+----------+----------+----------+-------------------------------------------------------------------+
```

`OPTIMIZE TABLE` usa online DDL para tabelas `InnoDB` regulares e particionadas, o que reduz o downtime para operações DML concorrentes. A reconstrução da tabela acionada por `OPTIMIZE TABLE` é concluída no local. Um Lock de tabela exclusivo (exclusive table Lock) é aplicado brevemente apenas durante a fase de prepare e a fase de commit da operação. Durante a fase de prepare, os metadados são atualizados e uma tabela intermediária é criada. Durante a fase de commit, as alterações de metadados da tabela são confirmadas.

`OPTIMIZE TABLE` reconstrói a tabela usando o método de cópia da tabela sob as seguintes condições:

*   Quando a variável de sistema `old_alter_table` está habilitada.

*   Quando o servidor é iniciado com a opção `--skip-new`.

`OPTIMIZE TABLE` usando online DDL não é suportado para tabelas `InnoDB` que contêm Indexes `FULLTEXT`. O método de cópia da tabela é usado em vez disso.

O `InnoDB` armazena dados usando um método de alocação de page e não sofre de fragmentação da mesma forma que storage engines legados (como `MyISAM`). Ao considerar se deve ou não executar `OPTIMIZE TABLE`, considere a workload de transações que seu servidor deve processar:

*   Algum nível de fragmentação é esperado. O `InnoDB` preenche as pages apenas em 93%, para deixar espaço para updates sem ter que dividir as pages.

*   Operações de Delete podem deixar lacunas que deixam as pages menos preenchidas do que o desejado, o que pode fazer com que valha a pena otimizar a tabela.

*   Updates em linhas geralmente reescrevem os dados dentro da mesma page, dependendo do tipo de dado e formato da linha, quando há espaço suficiente disponível. Consulte Section 14.9.1.5, “How Compression Works for InnoDB Tables” e Section 14.11, “InnoDB Row Formats”.

*   Workloads de alta concorrência podem deixar lacunas nos Indexes ao longo do tempo, visto que o `InnoDB` retém múltiplas versões dos mesmos dados através do seu mecanismo MVCC. Consulte Section 14.3, “InnoDB Multi-Versioning”.

##### Detalhes do MyISAM

Para tabelas `MyISAM`, `OPTIMIZE TABLE` funciona da seguinte forma:

1.  Se a tabela tiver linhas deletadas ou divididas, repare a tabela.
2.  Se as pages do Index não estiverem ordenadas, ordene-as.
3.  Se as estatísticas da tabela não estiverem atualizadas (e o reparo não pôde ser realizado pela ordenação do Index), atualize-as.

##### Outras Considerações

`OPTIMIZE TABLE` é executado online para tabelas `InnoDB` regulares e particionadas. Caso contrário, o MySQL locks a tabela (table Lock) durante o tempo em que o `OPTIMIZE TABLE` está em execução.

`OPTIMIZE TABLE` não ordena Indexes R-tree, como Indexes espaciais em colunas `POINT`. (Bug #23578)