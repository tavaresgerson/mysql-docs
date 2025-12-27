#### 15.7.3.4 Declaração `OPTIMIZE TABLE`

```
OPTIMIZE [NO_WRITE_TO_BINLOG | LOCAL]
    TABLE tbl_name [, tbl_name] ...
```

A instrução `OPTIMIZE TABLE` reorganiza o armazenamento físico dos dados da tabela e dos dados de índice associados, para reduzir o espaço de armazenamento e melhorar a eficiência de E/S ao acessar a tabela. As mudanças exatas feitas em cada tabela dependem do mecanismo de armazenamento usado por essa tabela.

Use `OPTIMIZE TABLE` nesses casos, dependendo do tipo de tabela:

* Após realizar operações substanciais de inserção, atualização ou exclusão em uma tabela `InnoDB` que tenha seu próprio arquivo .ibd, porque foi criada com a opção `innodb_file_per_table` habilitada. A tabela e os índices são reorganizados, e o espaço em disco pode ser recuperado para uso pelo sistema operacional.

* Após realizar operações substanciais de inserção, atualização ou exclusão em colunas que fazem parte de um índice `FULLTEXT` em uma tabela `InnoDB`. Defina a opção de configuração `innodb_optimize_fulltext_only=1` primeiro. Para manter o período de manutenção do índice em um tempo razoável, defina a opção `innodb_ft_num_word_optimize` para especificar quantas palavras atualizar no índice de busca, e execute uma sequência de declarações `OPTIMIZE TABLE` até que o índice de busca seja totalmente atualizado.

* Após excluir uma grande parte de uma tabela `MyISAM` ou `ARCHIVE`, ou fazer muitas alterações em uma tabela `MyISAM` ou `ARCHIVE` com linhas de comprimento variável (tabelas que têm colunas `VARCHAR`, `VARBINARY`, `BLOB` ou `TEXT`). As linhas excluídas são mantidas em uma lista enlaçada e operações de `INSERT` subsequentes reutilizam as posições das linhas antigas. Você pode usar `OPTIMIZE TABLE` para recuperar o espaço não utilizado e para desfragmentar o arquivo de dados. Após alterações extensas em uma tabela, essa declaração também pode melhorar o desempenho das declarações que usam a tabela, às vezes significativamente.

Esta declaração requer privilégios de `SELECT` e `INSERT` para a tabela.

`OPTIMIZE TABLE` funciona para tabelas `InnoDB`, `MyISAM` e `ARCHIVE`. `OPTIMIZE TABLE` também é suportado para colunas dinâmicas de tabelas `NDB` em memória. Ele não funciona para colunas de largura fixa de tabelas em memória, nem para tabelas de dados em disco. O desempenho de `OPTIMIZE` em tabelas de NDB Cluster pode ser ajustado usando `--ndb-optimization-delay`, que controla o tempo de espera entre o processamento de lotes de linhas por `OPTIMIZE TABLE`.

Para tabelas de NDB Cluster, `OPTIMIZE TABLE` pode ser interrompido (por exemplo, ao matar o thread SQL que executa a operação `OPTIMIZE`).

Por padrão, `OPTIMIZE TABLE` *não* funciona para tabelas criadas usando qualquer outro motor de armazenamento e retorna um resultado indicando essa falta de suporte. Você pode fazer `OPTIMIZE TABLE` funcionar com outros motores de armazenamento iniciando o **mysqld** com a opção `--skip-new`. Nesse caso, `OPTIMIZE TABLE` é mapeado apenas para `ALTER TABLE`.

Esta declaração não funciona com visualizações.

`OPTIMIZE TABLE` é suportado para tabelas particionadas. Para obter informações sobre como usar essa declaração com tabelas particionadas e particionamentos de tabela, consulte a Seção 26.3.4, “Manutenção de Partições”.

Por padrão, o servidor escreve declarações `OPTIMIZE TABLE` no log binário para que sejam replicadas para réplicas. Para suprimir o registro, especifique a palavra-chave opcional `NO_WRITE_TO_BINLOG` ou seu alias `LOCAL`. Você deve ter o privilégio `OPTIMIZE_LOCAL_TABLE` para usar essa opção.

* Saída de `OPTIMIZE TABLE`
* Detalhes do InnoDB
* Detalhes do MyISAM
* Outras Considerações

<table summary="Colunas do conjunto de resultados da Tabela OPTIMIZAR".><col style="width: 15%"/><col style="width: 60%"/><thead><tr> <th>Coluna</th> <th>Valor</th> </tr></thead><tbody><tr> <td><code class="literal">Tabela</code></td> <td>O nome da tabela</td> </tr><tr> <td><code class="literal">Op</code></td> <td>Sempre <code class="literal">optimizar</code></td> </tr><tr> <td><code class="literal">Msg_type</code></td> <td><code class="literal">status</code>, <code class="literal">error</code>, <code class="literal">info</code>, <code class="literal">note</code>, ou <code class="literal">warning</code></td> </tr><tr> <td><code class="literal">Msg_text</code></td> <td>Uma mensagem informativa</td> </tr></tbody></table>

A tabela `OPTIMIZAR Tabela` captura e lança quaisquer erros que ocorram durante a cópia das estatísticas da tabela do arquivo antigo para o arquivo recém-criado. Por exemplo, se o ID do usuário do proprietário do arquivo `.MYD` ou `.MYI` for diferente do ID do usuário do processo **mysqld**, a `OPTIMIZAR Tabela` gera um erro de "não é possível alterar a propriedade do arquivo" a menos que **mysqld** seja iniciado pelo usuário `root`.

##### Detalhes do InnoDB

Para tabelas do **InnoDB**, a `OPTIMIZAR Tabela` é mapeada para `ALTER TABLE ... FORCE`, que reconstrui a tabela para atualizar as estatísticas do índice e liberar espaço não utilizado no índice agrupado. Isso é exibido na saída da `OPTIMIZAR Tabela` quando você a executa em uma tabela do **InnoDB**, como mostrado aqui:

```mL4ncFRwHS

`OPTIMIZE TABLE` utiliza DDL online para tabelas `InnoDB` regulares e particionadas, o que reduz o tempo de inatividade para operações DML concorrentes. A reconstrução da tabela acionada por `OPTIMIZE TABLE` é concluída no local. Uma bloqueio exclusivo da tabela é tomado apenas por um breve período durante a fase de preparação e a fase de commit da operação. Durante a fase de preparação, os metadados são atualizados e uma tabela intermediária é criada. Durante a fase de commit, as alterações nos metadados da tabela são confirmadas.

`OPTIMIZE TABLE` reconstrui a tabela usando o método de cópia da tabela nas seguintes condições:

* Quando a variável de sistema `old_alter_table` está habilitada.

* Quando o servidor é iniciado com a opção `--skip-new`.

`OPTIMIZE TABLE` usando DDL online não é suportado para tabelas `InnoDB` que contêm índices `FULLTEXT`. O método de cópia da tabela é usado em vez disso.

`InnoDB` armazena dados usando um método de alocação de páginas e não sofre fragmentação da mesma forma que os motores de armazenamento legados (como `MyISAM`). Ao considerar se deve ou não executar a otimização, considere a carga de trabalho das transações que o seu servidor deve processar:

* É esperado algum nível de fragmentação. `InnoDB` preenche apenas páginas 93% cheias, para deixar espaço para atualizações sem precisar dividir páginas.

* Operações de exclusão podem deixar lacunas que deixam as páginas menos cheias do que desejado, o que poderia justificar a otimização da tabela.

* Atualizações de linhas geralmente reescrevem os dados dentro da mesma página, dependendo do tipo de dados e do formato da linha, quando há espaço suficiente disponível. Veja a Seção 17.9.1.5, “Como a Compressão Funciona para Tabelas `InnoDB” e a Seção 17.10, “Formatos de Linha `InnoDB”

* Cargas de trabalho de alta concorrência podem deixar lacunas nos índices ao longo do tempo, pois o `InnoDB` retém múltiplas versões dos mesmos dados devido ao seu mecanismo MVCC. Veja a Seção 17.3, “Multiversão do InnoDB”.

##### Detalhes do MyISAM

Para tabelas `MyISAM`, a `OPTIMIZE TABLE` funciona da seguinte forma:

1. Se a tabela tiver linhas excluídas ou divididas, repare a tabela.
2. Se as páginas do índice não estiverem ordenadas, ordene-as.
3. Se as estatísticas da tabela não estiverem atualizadas (e a reparação não puder ser realizada ordenando o índice), atualize-as.

##### Outras Considerações

A `OPTIMIZE TABLE` é realizada online para tabelas `InnoDB` regulares e particionadas. Caso contrário, o MySQL bloqueia a tabela durante o tempo em que a `OPTIMIZE TABLE` está sendo executada.

A `OPTIMIZE TABLE` não ordena índices R-tree, como índices espaciais em colunas `POINT`. (Bug #23578)