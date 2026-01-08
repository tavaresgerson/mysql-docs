#### 13.7.2.4 Declaração de Otimização da Tabela

```sql
OPTIMIZE [NO_WRITE_TO_BINLOG | LOCAL]
    TABLE tbl_name [, tbl_name] ...
```

`OPTIMIZAR TÁBLIA` reorganiza o armazenamento físico dos dados da tabela e dos dados de índice associados, para reduzir o espaço de armazenamento e melhorar a eficiência de E/S ao acessar a tabela. As mudanças exatas feitas em cada tabela dependem do motor de armazenamento usado por essa tabela.

Use `OPTIMIZE TABLE` nestes casos, dependendo do tipo de tabela:

- Após realizar operações de inserção, atualização ou exclusão substanciais em uma tabela `InnoDB` que possui seu próprio arquivo .ibd porque foi criada com a opção `innodb_file_per_table` habilitada. A tabela e os índices são reorganizados, e o espaço em disco pode ser recuperado para uso pelo sistema operacional.

- Após realizar operações de inserção, atualização ou exclusão substanciais em colunas que fazem parte de um índice `FULLTEXT` em uma tabela `InnoDB`. Defina a opção de configuração `innodb_optimize_fulltext_only=1` primeiro. Para manter o período de manutenção do índice em um tempo razoável, defina a opção `innodb_ft_num_word_optimize` para especificar quantas palavras serão atualizadas no índice de pesquisa e execute uma sequência de instruções `OPTIMIZE TABLE` até que o índice de pesquisa seja totalmente atualizado.

- Após excluir uma grande parte de uma tabela `MyISAM` ou `ARCHIVE` ou fazer muitas alterações em uma tabela `MyISAM` ou `ARCHIVE` com linhas de comprimento variável (tabelas que possuem colunas `[VARCHAR]` (char.html), `[VARBINARY]` (binary-varbinary.html), `[BLOB]` (blob.html) ou `[TEXT]` (blob.html)), as linhas excluídas são mantidas em uma lista enlaçada e operações subsequentes de `[INSERT]` (insert.html) reutilizam as posições das linhas antigas. Você pode usar `[OPTIMIZE TABLE]` (optimize-table.html) para recuperar o espaço não utilizado e para desfragmentar o arquivo de dados. Após alterações extensas em uma tabela, essa declaração também pode melhorar o desempenho das instruções que usam a tabela, às vezes de forma significativa.

Esta declaração requer privilégios de `SELECT` e `INSERT` para a tabela.

O comando `OPTIMIZE TABLE` funciona para tabelas de `InnoDB`, `MyISAM` e `ARCHIVE`. O comando `OPTIMIZE TABLE` também é suportado para colunas dinâmicas de tabelas de memória `NDB`]\(mysql-cluster.html). Ele não funciona para colunas de largura fixa de tabelas de memória, nem para tabelas de dados em disco. O desempenho do `OPTIMIZE` em tabelas de NDB Cluster pode ser ajustado usando `--ndb-optimization-delay`, que controla o tempo de espera entre o processamento de lotes de linhas pelo `OPTIMIZE TABLE`. Para mais informações, consulte Problemas anteriores do NDB Cluster resolvidos no NDB Cluster 8.0.

Para as tabelas do NDB Cluster, a operação `OPTIMIZE TABLE` pode ser interrompida, por exemplo, ao matar o thread SQL que está executando a operação `OPTIMIZE`.

Por padrão, `OPTIMIZE TABLE` **não** funciona para tabelas criadas usando qualquer outro mecanismo de armazenamento e retorna um resultado indicando essa falta de suporte. Você pode fazer `OPTIMIZE TABLE` funcionar para outros mecanismos de armazenamento iniciando o **mysqld** com a opção `--skip-new`. Nesse caso, `OPTIMIZE TABLE` é apenas mapeado para `ALTER TABLE`.

Essa declaração não funciona com visualizações.

A opção `OPTIMIZE TABLE` é suportada para tabelas particionadas. Para obter informações sobre como usar essa instrução com tabelas particionadas e particionamentos de tabela, consulte Seção 22.3.4, “Manutenção de Partições”.

Por padrão, o servidor escreve as instruções `OPTIMIZE TABLE` no log binário para que elas sejam replicadas para as réplicas. Para suprimir o registro, especifique a palavra-chave opcional `NO_WRITE_TO_BINLOG` ou seu alias `LOCAL`.

- SAIBA COMO OTIMIZAR A TABELA
- Detalhes do InnoDB
- Detalhes do MyISAM
- Outras Considerações

##### SAIBA COMO OTIMIZAR A Tabela de Saída

`OPTIMIZAR TÁBLIA` retorna um conjunto de resultados com as colunas mostradas na tabela a seguir.

<table summary="Colunas do conjunto de resultados da Tabela Otimizada."><col style="width: 15%"/><col style="width: 60%"/><thead><tr> <th>Coluna</th> <th>Valor</th> </tr></thead><tbody><tr> <td>[[<code>Table</code>]]</td> <td>O nome da tabela</td> </tr><tr> <td>[[<code>Op</code>]]</td> <td>Sempre [[<code>optimize</code>]]</td> </tr><tr> <td>[[<code>Msg_type</code>]]</td> <td>[[<code>status</code>]], [[<code>error</code>]], [[<code>info</code>]], [[<code>note</code>]] ou [[<code>warning</code>]]</td> </tr><tr> <td>[[<code>Msg_text</code>]]</td> <td>Uma mensagem informativa</td> </tr></tbody></table>

A tabela ``OPTIMIZAR TÁBLIA` captura e lança quaisquer erros que ocorram durante a cópia das estatísticas da tabela do arquivo antigo para o arquivo recém-criado. Por exemplo, se o ID do usuário do proprietário do arquivo `.frm`, `.MYD`ou`.MYI`for diferente do ID do usuário do processo **mysqld**, a``OPTIMIZAR TÁBLIA` gera um erro de "não é possível alterar a propriedade do arquivo" a menos que o **mysqld** seja iniciado pelo usuário `root`.

##### Detalhes do InnoDB

Para as tabelas do `InnoDB`, `OPTIMIZE TABLE` é mapeado para `ALTER TABLE ... FORCE`, que reconstrui a tabela para atualizar as estatísticas do índice e liberar espaço não utilizado no índice agrupado. Isso é exibido na saída de `OPTIMIZE TABLE` quando você executa-o em uma tabela `InnoDB`, como mostrado aqui:

```sql
mysql> OPTIMIZE TABLE foo;
+----------+----------+----------+-------------------------------------------------------------------+
| Table    | Op       | Msg_type | Msg_text                                                          |
+----------+----------+----------+-------------------------------------------------------------------+
| test.foo | optimize | note     | Table does not support optimize, doing recreate + analyze instead |
| test.foo | optimize | status   | OK                                                                |
+----------+----------+----------+-------------------------------------------------------------------+
```

`OPTIMIZE TABLE` utiliza DDL online para tabelas `InnoDB` regulares e particionadas, o que reduz o tempo de inatividade para operações DML concorrentes. A reconstrução da tabela acionada por `OPTIMIZE TABLE` é concluída no local. Uma bloqueio exclusivo da tabela é tomado apenas por um breve período durante a fase de preparação e a fase de commit da operação. Durante a fase de preparação, os metadados são atualizados e uma tabela intermediária é criada. Durante a fase de commit, as alterações nos metadados da tabela são confirmadas.

`OPTIMIZAR TÁBLIA` reconstrui a tabela usando o método de cópia da tabela nas seguintes condições:

- Quando a variável de sistema `old_alter_table` estiver habilitada.

- Quando o servidor é iniciado com a opção `--skip-new`.

A opção `OPTIMIZE TABLE` usando DDL online não é suportada para tabelas `InnoDB` que contêm índices `FULLTEXT`. O método de cópia da tabela é usado em vez disso.

O `InnoDB` armazena dados usando um método de alocação de páginas e não sofre fragmentação da mesma forma que os motores de armazenamento legados (como o `MyISAM`). Ao considerar se deve ou não executar `OPTIMIZE TABLE`, considere a carga de trabalho das transações que o seu servidor deve processar:

- É esperado um certo nível de fragmentação. O `InnoDB` preenche páginas apenas 93% cheias, para deixar espaço para atualizações sem precisar dividir as páginas.

- As operações de exclusão podem deixar lacunas que deixam as páginas menos preenchidas do que o desejado, o que pode justificar a otimização da tabela.

- As atualizações das linhas geralmente reescrevem os dados na mesma página, dependendo do tipo de dados e do formato da linha, quando há espaço suficiente disponível. Veja Seção 14.9.1.5, “Como a Compressão Funciona para Tabelas InnoDB” e Seção 14.11, “Formatos de Linha InnoDB”.

- Trabalhos com alta concorrência podem deixar lacunas nos índices ao longo do tempo, pois o `InnoDB` retém múltiplas versões dos mesmos dados devido ao seu mecanismo de MVCC. Veja Seção 14.3, “MVCC do InnoDB”.

##### Detalhes do MyISAM

Para tabelas `MyISAM`, `OPTIMIZE TABLE` funciona da seguinte forma:

1. Se a tabela tiver linhas excluídas ou divididas, repare a tabela.
2. Se as páginas de índice não estiverem ordenadas, ordene-as.
3. Se as estatísticas da tabela não estiverem atualizadas (e a reparação não puder ser realizada por meio da ordenação do índice), atualize-as.

##### Outras considerações

A operação `OPTIMIZE TABLE` é realizada online para tabelas `InnoDB` regulares e particionadas. Caso contrário, o MySQL bloqueia a tabela durante o tempo em que a operação `OPTIMIZE TABLE` está sendo executada.

A opção `OPTIMIZE TABLE` não ordena índices de R-tree, como índices espaciais em colunas `POINT`. (Bug #23578)
