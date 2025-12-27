#### 17.7.5.3 Como minimizar e lidar com bloqueios

Esta seção baseia-se nas informações conceituais sobre bloqueios na Seção 17.7.5.2, “Detecção de bloqueios”. Ela explica como organizar as operações do banco de dados para minimizar bloqueios e o subsequente tratamento de erros necessário nas aplicações.

Bloqueios são um problema clássico em bancos de dados transacionais, mas não são perigosos a menos que sejam tão frequentes que você não possa executar certas transações. Normalmente, você deve escrever suas aplicações para que estejam sempre preparadas para reemitir uma transação se ela for revertida devido a um bloqueio.

O `InnoDB` usa bloqueio automático em nível de linha. Você pode obter bloqueios mesmo no caso de transações que apenas inserem ou excluem uma única linha. Isso ocorre porque essas operações não são realmente “atomicas”; elas definem automaticamente bloqueios nos (possíveis vários) registros de índice da linha inserida ou excluída.

Você pode lidar com bloqueios e reduzir a probabilidade de sua ocorrência com as seguintes técnicas:

* Em qualquer momento, execute `SHOW ENGINE INNODB STATUS` para determinar a causa do bloqueio mais recente. Isso pode ajudá-lo a ajustar sua aplicação para evitar bloqueios.

* Se avisos frequentes de bloqueios causarem preocupação, cole informações de depuração mais extensas ativando a variável `innodb_print_all_deadlocks`. Informações sobre cada bloqueio, não apenas o mais recente, são registradas no log de erro do MySQL. Desative essa opção quando terminar de depurar.

* Sempre esteja preparado para reemitir uma transação se ela falhar devido a um bloqueio. Bloqueios não são perigosos. Apenas tente novamente.

* Mantenha as transações pequenas e de curta duração para torná-las menos propensas a colisões.

* Realize transações imediatamente após realizar um conjunto de alterações relacionadas para torná-las menos propensas a colisões. Em particular, não deixe uma sessão **mysql** interativa aberta por muito tempo com uma transação não confirmada.

* Se você usar leituras com bloqueio (`SELECT ... FOR UPDATE` ou `SELECT ... FOR SHARE`), tente usar um nível de isolamento mais baixo, como `READ COMMITTED`.

* Ao modificar várias tabelas dentro de uma transação ou diferentes conjuntos de linhas na mesma tabela, realize essas operações em uma ordem consistente cada vez. As transações formam filas bem definidas e não causam deadlock. Por exemplo, organize as operações do banco de dados em funções dentro do seu aplicativo ou chame rotinas armazenadas, em vez de codificar várias sequências semelhantes de instruções `INSERT`, `UPDATE` e `DELETE` em diferentes lugares.

* Adicione índices bem escolhidos às suas tabelas para que suas consultas pesquisem menos registros de índice e estabeleçam menos blocos. Use `EXPLAIN SELECT` para determinar quais índices o servidor MySQL considera os mais apropriados para suas consultas.

* Use menos bloqueio. Se puder permitir que um `SELECT` retorne dados de um snapshot antigo, não adicione uma cláusula `FOR UPDATE` ou `FOR SHARE`. O nível de isolamento `READ COMMITTED` é bom aqui, porque cada leitura consistente dentro da mesma transação lê de seu próprio snapshot fresco.

* Se nada mais ajudar, serealize as transações com bloqueios de nível de tabela. A maneira correta de usar `LOCK TABLES` com tabelas transacionais, como tabelas `InnoDB`, é começar uma transação com `SET autocommit = 0` (não `START TRANSACTION`) seguido de `LOCK TABLES`, e não chamar `UNLOCK TABLES` até que você confirme a transação explicitamente. Por exemplo, se você precisa escrever na tabela `t1` e ler da tabela `t2`, você pode fazer isso:

  ```
  SET autocommit=0;
  LOCK TABLES t1 WRITE, t2 READ, ...;
  ... do something with tables t1 and t2 here ...
  COMMIT;
  UNLOCK TABLES;
  ```

Os bloqueios de nível de tabela impedem atualizações concorrentes na tabela, evitando deadlocks em detrimento de uma resposta mais lenta em um sistema ocupado.

* Outra maneira de serializar transações é criar uma tabela auxiliar "semáforo" que contenha apenas uma única linha. Faça com que cada transação atualize essa linha antes de acessar outras tabelas. Dessa forma, todas as transações ocorrem de forma serializada. Observe que o algoritmo de detecção instantânea de deadlocks do `InnoDB` também funciona nesse caso, porque o bloqueio de serialização é um bloqueio de nível de linha. Com os bloqueios de nível de tabela do MySQL, o método de tempo limite deve ser usado para resolver deadlocks.