#### 17.7.2.1 Níveis de Isolamento de Transações

A isolação de transações é um dos fundamentos do processamento de bancos de dados. A isolação é a letra I do acrônimo ACID; o nível de isolamento é a configuração que ajusta o equilíbrio entre desempenho e confiabilidade, consistência e reprodutibilidade dos resultados quando múltiplas transações estão fazendo alterações e executando consultas ao mesmo tempo.

O `InnoDB` oferece todos os quatro níveis de isolamento de transação descritos pelo padrão SQL:1992: `READ UNCOMMITTED`, `READ COMMITTED`, `REPEATABLE READ` e `SERIALIZABLE`. O nível de isolamento padrão para `InnoDB` é `REPEATABLE READ`.

Um usuário pode alterar o nível de isolamento para uma única sessão ou para todas as conexões subsequentes com a instrução `SET TRANSACTION`. Para definir o nível de isolamento padrão do servidor para todas as conexões, use a opção `--transaction-isolation` na linha de comando ou em um arquivo de opções. Para obter informações detalhadas sobre os níveis de isolamento e a sintaxe de definição de nível, consulte a Seção 15.3.7, “Instrução SET TRANSACTION”.

`InnoDB` suporta cada um dos níveis de isolamento de transação descritos aqui usando diferentes estratégias de bloqueio. Você pode impor um alto grau de consistência com o nível padrão `REPEATABLE READ`, para operações em dados cruciais onde a conformidade ACID é importante. Ou você pode relaxar as regras de consistência com `READ COMMITTED` ou até mesmo `READ UNCOMMITTED`, em situações como relatórios em massa, onde a consistência precisa e resultados repetidos são menos importantes do que minimizar a quantidade de overhead para o bloqueio. `SERIALIZABLE` impõe regras ainda mais rigorosas do que `REPEATABLE READ`, e é usado principalmente em situações especializadas, como com transações XA e para solucionar problemas com concorrência e bloqueios.

A lista a seguir descreve como o MySQL suporta os diferentes níveis de transação. A lista vai do nível mais comumente usado ao menos usado.

- `REPEATABLE READ`

  Este é o nível de isolamento padrão para `InnoDB`. Leitura consistente dentro da mesma transação lê o instantâneo estabelecido pelo primeiro acesso. Isso significa que, se você emitir várias instruções simples (não bloqueantes) `SELECT` dentro da mesma transação, essas instruções `SELECT` são consistentes também entre si. Veja a Seção 17.7.2.3, “Leitura Consistente Não Bloqueante”.

  Para bloqueios de leituras (`SELECT` com `FOR UPDATE` ou `FOR SHARE`), as instruções `UPDATE` e `DELETE` dependem se a instrução usa um índice único com uma condição de pesquisa única ou uma condição de pesquisa de tipo intervalo.

  - Para um índice único com uma condição de busca única, `InnoDB` bloqueia apenas o registro do índice encontrado, não o espaço antes dele.

  - Para outras condições de pesquisa, `InnoDB` bloqueia o intervalo do índice pesquisado, usando bloqueios de lacuna ou bloqueios de próxima chave para bloquear inserções por outras sessões nos intervalos cobertos pelo intervalo. Para informações sobre bloqueios de lacuna e bloqueios de próxima chave, consulte a Seção 17.7.1, “Bloqueio InnoDB”.

  Não é recomendado misturar declarações de bloqueio (`UPDATE`, `INSERT`, `DELETE` ou `SELECT ... FOR ...`) com declarações sem bloqueio `SELECT` em uma única transação `REPEATABLE READ`, porque, normalmente, nesse caso, você deseja `SERIALIZABLE`. Isso ocorre porque uma declaração sem bloqueio `SELECT` apresenta o estado do banco de dados de uma visão de leitura que consiste em transações comprometidas antes da criação da visão de leitura e antes das próprias escritas da transação atual, enquanto as declarações de bloqueio usam o estado mais recente do banco de dados para usar o bloqueio. De maneira geral, esses dois estados de tabela diferentes são inconsistentes entre si e difíceis de interpretar.

- `READ COMMITTED`

  Cada leitura consistente, mesmo dentro da mesma transação, define e lê seu próprio instantâneo fresco. Para informações sobre leituras consistentes, consulte a Seção 17.7.2.3, “Leituras Não Bloqueadas Consistentes”.

  Para bloqueios de leituras (`SELECT` com `FOR UPDATE` ou `FOR SHARE`), declarações `UPDATE` e declarações `DELETE`, o bloqueio `InnoDB` bloqueia apenas os registros de índice, não as lacunas antes deles, permitindo assim a inserção livre de novos registros ao lado dos registros bloqueados. O bloqueio de lacunas é usado apenas para verificação de restrições de chave estrangeira e verificação de chave duplicada.

  Como o bloqueio de lacunas está desativado, podem ocorrer problemas com linhas fantasmas, pois outras sessões podem inserir novas linhas nas lacunas. Para obter informações sobre linhas fantasmas, consulte a Seção 17.7.4, “Linhas Fantasmas”.

  Apenas o registro binário baseado em linhas é suportado com o nível de isolamento `READ COMMITTED`. Se você usar `READ COMMITTED` com `binlog_format=MIXED`, o servidor usa automaticamente o registro baseado em linhas.

  O uso de `READ COMMITTED` tem efeitos adicionais:

  - Para as instruções `UPDATE` ou `DELETE`, `InnoDB` mantém as bloqueadoras apenas para as linhas que ele atualiza ou exclui. As bloqueadoras de registro para linhas não correspondentes são liberadas após o MySQL ter avaliado a condição `WHERE`. Isso reduz muito a probabilidade de deadlocks, mas ainda podem ocorrer.

  - Para as declarações `UPDATE`, se uma linha já estiver bloqueada, `InnoDB` realiza uma leitura “semi-consistente”, retornando a versão mais recente comprometida ao MySQL para que o MySQL possa determinar se a linha corresponde à condição `WHERE` do `UPDATE`. Se a linha corresponder (deve ser atualizada), o MySQL lê a linha novamente e, desta vez, `InnoDB` a bloqueia ou aguarda por um bloqueio nela.

  Considere o exemplo a seguir, começando com esta tabela:

  ```
  CREATE TABLE t (a INT NOT NULL, b INT) ENGINE = InnoDB;
  INSERT INTO t VALUES (1,2),(2,3),(3,2),(4,3),(5,2);
  COMMIT;
  ```

  Nesse caso, a tabela não tem índices, então as pesquisas e varreduras de índice usam o índice agrupado oculto para o bloqueio de registros (veja a Seção 17.6.2.1, “Indekses Agrupados e Secundários”) em vez das colunas indexadas.

  Suponha que uma sessão execute uma `UPDATE` usando essas instruções:

  ```
  # Session A
  START TRANSACTION;
  UPDATE t SET b = 5 WHERE b = 3;
  ```

  Suponha também que uma segunda sessão execute uma `UPDATE` executando essas instruções após as da primeira sessão:

  ```
  # Session B
  UPDATE t SET b = 4 WHERE b = 2;
  ```

  À medida que o `InnoDB` executa cada `UPDATE`, ele primeiro adquire um bloqueio exclusivo para cada linha e, em seguida, determina se deve modificá-la. Se o `InnoDB` não modificar a linha, ele libera o bloqueio. Caso contrário, o `InnoDB` retém o bloqueio até o final da transação. Isso afeta o processamento da transação da seguinte forma.

  Ao usar o nível de isolamento padrão `REPEATABLE READ`, o primeiro `UPDATE` adquire um x-lock em cada linha que lê e não libera nenhuma delas:

  ```
  x-lock(1,2); retain x-lock
  x-lock(2,3); update(2,3) to (2,5); retain x-lock
  x-lock(3,2); retain x-lock
  x-lock(4,3); update(4,3) to (4,5); retain x-lock
  x-lock(5,2); retain x-lock
  ```

  O segundo bloco `UPDATE` é bloqueado assim que ele tenta adquirir qualquer bloqueio (porque a primeira atualização reteriu os bloqueios em todas as linhas), e não prossegue até que o primeiro `UPDATE` commit ou rollback:

  ```
  x-lock(1,2); block and wait for first UPDATE to commit or roll back
  ```

  Se for usado `READ COMMITTED` em vez disso, o primeiro `UPDATE` adquire um bloqueio x em cada linha que lê e libera essas linhas que não modifica:

  ```
  x-lock(1,2); unlock(1,2)
  x-lock(2,3); update(2,3) to (2,5); retain x-lock
  x-lock(3,2); unlock(3,2)
  x-lock(4,3); update(4,3) to (4,5); retain x-lock
  x-lock(5,2); unlock(5,2)
  ```

  Para o segundo `UPDATE`, `InnoDB` faz uma leitura “semi-consistente”, retornando a versão comprometida mais recente de cada linha que lê para o MySQL, para que o MySQL possa determinar se a linha corresponde à condição `WHERE` do `UPDATE`:

  ```
  x-lock(1,2); update(1,2) to (1,4); retain x-lock
  x-lock(2,3); unlock(2,3)
  x-lock(3,2); update(3,2) to (3,4); retain x-lock
  x-lock(4,3); unlock(4,3)
  x-lock(5,2); update(5,2) to (5,4); retain x-lock
  ```

  No entanto, se a condição `WHERE` incluir uma coluna indexada e o `InnoDB` usar o índice, apenas a coluna indexada será considerada ao adquirir e reter bloqueios de registro. No exemplo a seguir, o primeiro `UPDATE` adquire e mantém um bloqueio x em cada linha onde b = 2. O segundo `UPDATE` bloqueia quando tenta adquirir bloqueios x nos mesmos registros, pois também usa o índice definido na coluna b.

  ```
  CREATE TABLE t (a INT NOT NULL, b INT, c INT, INDEX (b)) ENGINE = InnoDB;
  INSERT INTO t VALUES (1,2,3),(2,2,4);
  COMMIT;

  # Session A
  START TRANSACTION;
  UPDATE t SET b = 3 WHERE b = 2 AND c = 3;

  # Session B
  UPDATE t SET b = 4 WHERE b = 2 AND c = 4;
  ```

  O nível de isolamento `READ COMMITTED` pode ser definido na inicialização ou alterado durante a execução. Durante a execução, ele pode ser definido globalmente para todas as sessões ou individualmente por sessão.

- `READ UNCOMMITTED`

  As declarações `SELECT` são realizadas de forma não bloqueante, mas uma versão anterior possível de uma linha pode ser usada. Assim, ao usar esse nível de isolamento, essas leituras não são consistentes. Isso também é chamado de leitura suja. Caso contrário, esse nível de isolamento funciona como `READ COMMITTED`.

- `SERIALIZABLE`

  Esse nível é como `REPEATABLE READ`, mas `InnoDB` converte implicitamente todas as declarações simples `SELECT` para `SELECT ... FOR SHARE` se `autocommit` estiver desativado. Se `autocommit` estiver ativado, o `SELECT` é sua própria transação. Portanto, é conhecido por ser apenas de leitura e pode ser serializado se realizado como uma leitura consistente (não bloqueante) e não precisa bloquear outras transações. (Para forçar uma declaração simples `SELECT` a bloquear se outras transações tiverem modificado as linhas selecionadas, desative `autocommit`.)

  Nota

  A partir do MySQL 8.0.22, as operações DML que leem dados do MySQL concedem tabelas (através de uma lista de junção ou subconsulta) que não as modificam, mas não adquirem bloqueios de leitura nas tabelas concedidas do MySQL, independentemente do nível de isolamento. Para mais informações, consulte Concorrência de Tabelas Concedidas.
