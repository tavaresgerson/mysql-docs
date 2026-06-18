#### 15.7.3.4. Declaração de Otimização da Tabela

```
OPTIMIZE [NO_WRITE_TO_BINLOG | LOCAL]
    TABLE tbl_name [, tbl_name] ...
```

`OPTIMIZE TABLE` reorganiza o armazenamento físico dos dados da tabela e dos dados de índice associados, para reduzir o espaço de armazenamento e melhorar a eficiência de E/S ao acessar a tabela. As mudanças exatas feitas em cada tabela dependem do mecanismo de armazenamento usado por essa tabela.

Use `OPTIMIZE TABLE` nesses casos, dependendo do tipo de tabela:

- Após realizar operações de inserção, atualização ou exclusão substanciais em uma tabela `InnoDB` que possui seu próprio arquivo .ibd, pois foi criada com a opção `innodb_file_per_table` habilitada. A tabela e os índices são reorganizados, e o espaço em disco pode ser recuperado para uso pelo sistema operacional.

- Após realizar operações de inserção, atualização ou exclusão substanciais em colunas que fazem parte de um índice `FULLTEXT` em uma tabela `InnoDB`. Defina a opção de configuração `innodb_optimize_fulltext_only=1` primeiro. Para manter o período de manutenção do índice em um tempo razoável, defina a opção `innodb_ft_num_word_optimize` para especificar quantas palavras serão atualizadas no índice de pesquisa e execute uma sequência de instruções `OPTIMIZE TABLE` até que o índice de pesquisa seja totalmente atualizado.

- Após excluir uma grande parte de uma tabela `MyISAM` ou `ARCHIVE` ou fazer muitas alterações em uma tabela `MyISAM` ou `ARCHIVE` com linhas de comprimento variável (tabelas que possuem as colunas `VARCHAR`, `VARBINARY`, `BLOB` ou `TEXT`). As linhas excluídas são mantidas em uma lista enlaçada e as operações subsequentes de `INSERT` reutilizam as posições das linhas antigas. Você pode usar `OPTIMIZE TABLE` para recuperar o espaço não utilizado e para desfragmentar o arquivo de dados. Após alterações extensas em uma tabela, essa declaração também pode melhorar o desempenho das declarações que usam a tabela, às vezes de forma significativa.

Esta declaração requer privilégios `SELECT` e `INSERT` para a tabela.

O `OPTIMIZE TABLE` funciona para as tabelas `InnoDB`, `MyISAM` e `ARCHIVE`. O `OPTIMIZE TABLE` também é suportado para colunas dinâmicas de tabelas `NDB` de memória. Ele não funciona para colunas de largura fixa de tabelas de memória, nem para tabelas de Dados em Disco. O desempenho do `OPTIMIZE` em tabelas NDB Cluster pode ser ajustado usando o `--ndb-optimization-delay`, que controla o tempo de espera entre o processamento de lotes de linhas por `OPTIMIZE TABLE`. Para mais informações, consulte a Seção 25.2.7.11, “Problemas anteriores do NDB Cluster resolvidos no NDB Cluster 8.0”.

Para as tabelas do NDB Cluster, o `OPTIMIZE TABLE` pode ser interrompido (por exemplo) ao matar o thread SQL que está executando a operação `OPTIMIZE`.

Por padrão, `OPTIMIZE TABLE` *não* funciona para tabelas criadas usando qualquer outro mecanismo de armazenamento e retorna um resultado indicando essa falta de suporte. Você pode fazer `OPTIMIZE TABLE` funcionar para outros mecanismos de armazenamento iniciando o **mysqld** com a opção `--skip-new`. Nesse caso, `OPTIMIZE TABLE` é apenas mapeado para `ALTER TABLE`.

Essa declaração não funciona com visualizações.

O `OPTIMIZE TABLE` é suportado para tabelas particionadas. Para obter informações sobre como usar essa instrução com tabelas particionadas e particionamentos de tabela, consulte a Seção 26.3.4, “Manutenção de Partições”.

Por padrão, o servidor escreve as instruções `OPTIMIZE TABLE` no log binário para que elas sejam replicadas para as réplicas. Para suprimir o registro, especifique a palavra-chave opcional `NO_WRITE_TO_BINLOG` ou seu alias `LOCAL`.

- SAIBA COMO OTIMIZAR A Tabela de Saída
- Detalhes do InnoDB
- Detalhes do MyISAM
- Outras considerações

##### SAIBA COMO OTIMIZAR A Tabela de Saída

`OPTIMIZE TABLE` retorna um conjunto de resultados com as colunas mostradas na tabela a seguir.

<table summary="Colunas do conjunto de resultados da Tabela Otimizada."><thead><tr> <th>Coluna</th> <th>Valor</th> </tr></thead><tbody><tr> <td>[[<code>Table</code>]]</td> <td>O nome da tabela</td> </tr><tr> <td>[[<code>Op</code>]]</td> <td>Sempre [[<code>optimize</code>]]</td> </tr><tr> <td>[[<code>Msg_type</code>]]</td> <td>[[<code>status</code>]], [[<code>error</code>]], [[<code>info</code>]], [[<code>note</code>]] ou [[<code>warning</code>]]</td> </tr><tr> <td>[[<code>Msg_text</code>]]</td> <td>Uma mensagem informativa</td> </tr></tbody></table>

A tabela `OPTIMIZE TABLE` captura e exibe quaisquer erros que ocorram durante a cópia das estatísticas da tabela do arquivo antigo para o arquivo recém-criado. Por exemplo, se o ID do usuário do proprietário do arquivo `.MYD` ou `.MYI` for diferente do ID do usuário do processo **mysqld**, o `OPTIMIZE TABLE` gera um erro de "não é possível alterar a propriedade do arquivo", a menos que **mysqld** seja iniciado pelo usuário `root`.

##### Detalhes do InnoDB

Para as tabelas `InnoDB`, `OPTIMIZE TABLE` é mapeado para `ALTER TABLE ... FORCE`, o que reconstrui a tabela para atualizar as estatísticas do índice e liberar espaço não utilizado no índice agrupado. Isso é exibido na saída de `OPTIMIZE TABLE` quando você executá-lo em uma tabela `InnoDB`, como mostrado aqui:

```
mysql> OPTIMIZE TABLE foo;
+----------+----------+----------+-------------------------------------------------------------------+
| Table    | Op       | Msg_type | Msg_text                                                          |
+----------+----------+----------+-------------------------------------------------------------------+
| test.foo | optimize | note     | Table does not support optimize, doing recreate + analyze instead |
| test.foo | optimize | status   | OK                                                                |
+----------+----------+----------+-------------------------------------------------------------------+
```

O `OPTIMIZE TABLE` utiliza o DDL online para tabelas regulares e particionadas `InnoDB` que reduzem o tempo de inatividade para operações DML concorrentes. A reconstrução da tabela acionada pelo `OPTIMIZE TABLE` é concluída no local. Uma bloqueio exclusivo da tabela é tomado apenas por um breve período durante a fase de preparação e a fase de commit da operação. Durante a fase de preparação, os metadados são atualizados e uma tabela intermediária é criada. Durante a fase de commit, as alterações dos metadados da tabela são confirmadas.

`OPTIMIZE TABLE` reconstrui a tabela usando o método de cópia da tabela nas seguintes condições:

- Quando a variável de sistema `old_alter_table` estiver habilitada.

- Quando o servidor é iniciado com a opção `--skip-new`.

A utilização do DDL online não é suportada para tabelas `InnoDB` que contêm índices `FULLTEXT`. O método de cópia da tabela é usado em vez disso.

`InnoDB` armazena dados usando um método de alocação de páginas e não sofre fragmentação da mesma forma que os motores de armazenamento legados (como `MyISAM`). Ao considerar se deve ou não executar a otimização, considere a carga de trabalho das transações que o seu servidor deve processar:

- É esperado um certo nível de fragmentação. `InnoDB` preenche apenas 93% da página, para deixar espaço para atualizações sem precisar dividir as páginas.

- As operações de exclusão podem deixar lacunas que deixam as páginas menos preenchidas do que o desejado, o que pode justificar a otimização da tabela.

- As atualizações das linhas geralmente reescrevem os dados na mesma página, dependendo do tipo de dados e do formato da linha, quando há espaço suficiente disponível. Veja a Seção 17.9.1.5, “Como a Compressão Funciona para Tabelas InnoDB” e a Seção 17.10, “Formatos de Linha InnoDB”.

- Trabalhos com alta concorrência podem deixar lacunas nos índices ao longo do tempo, pois o `InnoDB` retém múltiplas versões dos mesmos dados devido ao seu mecanismo MVCC. Veja a Seção 17.3, “Multiversão InnoDB”.

##### Detalhes do MyISAM

Para as tabelas `MyISAM`, `OPTIMIZE TABLE` funciona da seguinte forma:

1. Se a tabela tiver linhas excluídas ou divididas, repare a tabela.
2. Se as páginas de índice não estiverem ordenadas, ordene-as.
3. Se as estatísticas da tabela não estiverem atualizadas (e a reparação não puder ser realizada por meio da ordenação do índice), atualize-as.

##### Outras considerações

A operação `OPTIMIZE TABLE` é realizada online para tabelas `InnoDB` regulares e particionadas. Caso contrário, o MySQL bloqueia a tabela durante o tempo em que a operação `OPTIMIZE TABLE` está sendo executada.

`OPTIMIZE TABLE` não ordena índices de árvores R, como índices espaciais em colunas de `POINT`. (Bug #23578)
