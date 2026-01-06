#### 14.7.5.3 Como minimizar e lidar com bloqueios

Esta seção baseia-se nas informações conceituais sobre bloqueios apresentadas na Seção 14.7.5.2, “Detecção de Bloqueios”. Ela explica como organizar as operações do banco de dados para minimizar bloqueios e o tratamento de erros subsequentes necessário nas aplicações.

Os bloqueios são um problema clássico em bancos de dados transacionais, mas não são perigosos a menos que sejam tão frequentes que você não consiga executar certas transações. Normalmente, você deve escrever seus aplicativos para que estejam sempre preparados para reemitir uma transação se ela for revertida devido a um bloqueio.

O `InnoDB` usa o bloqueio automático em nível de linha. Você pode obter deadlocks mesmo no caso de transações que apenas inserem ou excluem uma única linha. Isso ocorre porque essas operações não são realmente “atômicas”; elas automaticamente definem bloqueios nos (possíveis vários) registros de índice da linha inserida ou excluída.

Você pode lidar com impasses e reduzir a probabilidade de sua ocorrência com as seguintes técnicas:

- Em qualquer momento, execute `SHOW ENGINE INNODB STATUS` para determinar a causa do último deadlock. Isso pode ajudá-lo a ajustar sua aplicação para evitar deadlocks.

- Se os avisos frequentes de travamento causarem preocupação, colete informações de depuração mais extensas ao habilitar a variável `innodb_print_all_deadlocks`. As informações sobre cada travamento, não apenas o mais recente, são registradas no log de erro do MySQL. Desative essa opção quando terminar de depurar.

- Sempre esteja preparado para emitir novamente uma transação se ela falhar devido a um impasse. Impasses não são perigosos. Apenas tente novamente.

- Mantenha as transações pequenas e de curta duração para torná-las menos propensas a colisões.

- Realize as transações imediatamente após realizar um conjunto de alterações relacionadas para torná-las menos propensas a colisões. Em particular, não deixe uma sessão **mysql** interativa aberta por muito tempo com uma transação não confirmada.

- Se você estiver usando leituras de bloqueio (`SELECT ... FOR UPDATE` ou `SELECT ... LOCK IN SHARE MODE`), tente usar um nível de isolamento mais baixo, como `READ COMMITTED`.

- Ao modificar várias tabelas dentro de uma transação ou diferentes conjuntos de linhas na mesma tabela, realize essas operações em uma ordem consistente cada vez. As transações formam filas bem definidas e não causam travamento. Por exemplo, organize as operações do banco de dados em funções dentro do seu aplicativo ou chame rotinas armazenadas, em vez de codificar várias sequências semelhantes de instruções `INSERT`, `UPDATE` e `DELETE` em diferentes lugares.

- Adicione índices bem escolhidos às suas tabelas para que suas consultas pesquisem menos registros de índice e estabeleçam menos bloqueios. Use `EXPLAIN SELECT` para determinar quais índices o servidor MySQL considera os mais apropriados para suas consultas.

- Use menos bloqueios. Se você puder permitir que um `SELECT` retorne dados de um snapshot antigo, não adicione uma cláusula `FOR UPDATE` ou `LOCK IN SHARE MODE` a ele. Usar o nível de isolamento `READ COMMITTED` é bom aqui, porque cada leitura consistente dentro da mesma transação lê do seu próprio snapshot fresco.

- Se nada mais ajudar, realize a serialização das transações com bloqueios de nível de tabela. A maneira correta de usar `LOCK TABLES` com tabelas transacionais, como as tabelas `InnoDB`, é iniciar uma transação com `SET autocommit = 0` (não `START TRANSACTION`) seguida de `LOCK TABLES`, e não chamar `UNLOCK TABLES` até que você comunique explicitamente a transação. Por exemplo, se você precisa escrever na tabela `t1` e ler da tabela `t2`, você pode fazer isso:

  ```sql
  SET autocommit=0;
  LOCK TABLES t1 WRITE, t2 READ, ...;
  ... do something with tables t1 and t2 here ...
  COMMIT;
  UNLOCK TABLES;
  ```

  Os bloqueios de nível de tabela impedem atualizações concorrentes na tabela, evitando deadlocks em detrimento de uma resposta mais lenta em um sistema ocupado.

- Outra maneira de serializar transações é criar uma tabela auxiliar de "semáforo" que contenha apenas uma única linha. Faça com que cada transação atualize essa linha antes de acessar outras tabelas. Dessa forma, todas as transações ocorrem de forma serializada. Observe que o algoritmo de detecção de travamento instantâneo do `InnoDB` também funciona nesse caso, porque o bloqueio de serialização é um bloqueio de nível de linha. Com bloqueios de nível de tabela do MySQL, o método de tempo limite deve ser usado para resolver travamentos.
