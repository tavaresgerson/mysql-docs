#### 17.7.2.1 Níveis de Isolamento de Transações

O isolamento de transações é um dos pilares do processamento de bancos de dados. O isolamento é a letra I do acrônimo ACID; o nível de isolamento é a configuração que ajusta o equilíbrio entre desempenho e confiabilidade, consistência e reprodutibilidade dos resultados quando múltiplas transações estão fazendo alterações e executando consultas ao mesmo tempo.

O `InnoDB` oferece todos os quatro níveis de isolamento de transações descritos pelo padrão SQL:1992: `READ UNCOMMITTED`, `READ COMMITTED`, `REPEATABLE READ` e `SERIALIZABLE`. O nível de isolamento padrão para o `InnoDB` é `REPEATABLE READ`.

Um usuário pode alterar o nível de isolamento para uma única sessão ou para todas as conexões subsequentes com a instrução `SET TRANSACTION`. Para definir o nível de isolamento padrão do servidor para todas as conexões, use a opção `--transaction-isolation` na linha de comando ou em um arquivo de opções. Para informações detalhadas sobre os níveis de isolamento e a sintaxe de definição de nível, consulte a Seção 15.3.7, “Instrução SET TRANSACTION”.

O `InnoDB` suporta cada um dos níveis de isolamento de transações descritos aqui usando diferentes estratégias de bloqueio. Você pode impor um alto grau de consistência com o nível `REPEATABLE READ` padrão, para operações em dados cruciais onde a conformidade ACID é importante. Ou você pode relaxar as regras de consistência com `READ COMMITTED` ou até mesmo `READ UNCOMMITTED`, em situações como relatórios em massa onde a consistência precisa e os resultados repetidos são menos importantes do que minimizar a quantidade de overhead para bloqueio. `SERIALIZABLE` impõe regras ainda mais rigorosas do que `REPEATABLE READ` e é usado principalmente em situações especializadas, como com transações XA e para solucionar problemas com concorrência e bloqueios.

A lista a seguir descreve como o MySQL suporta os diferentes níveis de transação. A lista vai do nível mais comumente usado ao menos usado.

* `REPEATABLE READ`

  Este é o nível de isolamento padrão para `InnoDB`. Leitura consistente dentro da mesma transação lê o instantâneo estabelecido pela primeira leitura. Isso significa que, se você emitir várias instruções `SELECT` simples (sem bloqueio) dentro da mesma transação, essas instruções `SELECT` são consistentes também entre si. Veja a Seção 17.7.2.3, “Leitura Consistente Sem Bloqueio”.

  Para leituras com bloqueio (`SELECT` com `FOR UPDATE` ou `FOR SHARE`), instruções `UPDATE` e `DELETE`, o bloqueio depende se a instrução usa um índice único com uma condição de busca única, ou uma condição de busca de tipo intervalo.

  + Para um índice único com uma condição de busca única, o `InnoDB` bloqueia apenas o registro do índice encontrado, não o intervalo antes dele.

  + Para outras condições de busca, o `InnoDB` bloqueia o intervalo do índice escaneado, usando bloqueios de intervalo ou bloqueios de próxima chave para bloquear inserções por outras sessões nos intervalos cobertos pelo intervalo. Para informações sobre bloqueios de intervalo e bloqueios de próxima chave, veja a Seção 17.7.1, “Bloqueio InnoDB”.

Não é recomendado misturar instruções de bloqueio (`UPDATE`, `INSERT`, `DELETE` ou `SELECT ... FOR ...`) com instruções `SELECT` não de bloqueio em uma única transação `REPEATABLE READ`, porque, tipicamente, em tais casos, você deseja `SERIALIZABLE`. Isso ocorre porque uma instrução `SELECT` não de bloqueio apresenta o estado do banco de dados de uma visão de leitura que consiste em transações comprometidas antes da visão de leitura ser criada e antes das próprias escritas da transação atual, enquanto as instruções de bloqueio usam o estado mais recente do banco de dados para usar o bloqueio. Em geral, esses dois estados de tabela diferentes são inconsistentes entre si e difíceis de interpretar.

* `READ COMMITTED`

  Cada leitura consistente, mesmo dentro da mesma transação, cria e lê seu próprio instantâneo fresco. Para informações sobre leituras consistentes, consulte a Seção 17.7.2.3, “Leituras Não de Bloqueio Consistentes”.

  Para leituras de bloqueio (`SELECT` com `FOR UPDATE` ou `FOR SHARE`), instruções `UPDATE` e instruções `DELETE`, o `InnoDB` bloqueia apenas os registros de índice, não as lacunas antes deles, e, portanto, permite a inserção livre de novos registros ao lado de registros bloqueados. O bloqueio de lacunas é usado apenas para verificação de restrições de chave estrangeira e verificação de chaves duplicadas.

  Como o bloqueio de lacunas está desativado, problemas de linha fantasma podem ocorrer, pois outras sessões podem inserir novas linhas nas lacunas. Para informações sobre linhas fantasmas, consulte a Seção 17.7.4, “Linhas Fantasmas”.

  Apenas o registro de log binário baseado em linha é suportado com o nível de isolamento `READ COMMITTED`. Se você usar `READ COMMITTED` com `binlog_format=MIXED`, o servidor usa automaticamente o registro baseado em linha.

  Usar `READ COMMITTED` tem efeitos adicionais:

+ Para as instruções `UPDATE` ou `DELETE`, o `InnoDB` mantém travamentos apenas para as linhas que ele atualiza ou exclui. Os travamentos de registro para linhas não correspondentes são liberados após o MySQL avaliar a condição `WHERE`. Isso reduz significativamente a probabilidade de deadlocks, mas ainda podem ocorrer.

+ Para as instruções `UPDATE`, se uma linha já estiver travada, o `InnoDB` realiza uma leitura "semi-consistente", retornando a versão comprometida mais recente ao MySQL para que o MySQL possa determinar se a linha corresponde à condição `WHERE` do `UPDATE`. Se a linha corresponder (deve ser atualizada), o MySQL lê a linha novamente e, desta vez, o `InnoDB` a travam ou aguarda um travamento nela.

Considere a tabela criada e preenchida da seguinte forma:

```
  CREATE TABLE t (a INT NOT NULL, b INT) ENGINE = InnoDB;
  INSERT INTO t VALUES (1,2),(2,3),(3,2),(4,3),(5,2);
  COMMIT;
  ```

Neste caso, a tabela não tem índices, portanto, as pesquisas e varreduras de índice usam o índice agrupado oculto para o travamento de registro (veja a Seção 17.6.2.1, "Indizes Agrupados e Secundários") em vez de colunas indexadas.

Suponha que uma sessão realize uma `UPDATE` usando essas instruções:

```
  # Session A
  START TRANSACTION;
  UPDATE t SET b = 5 WHERE b = 3;
  ```

Suponha também que uma segunda sessão realize uma `UPDATE` executando essas instruções após as da primeira sessão:

```
  # Session B
  UPDATE t SET b = 4 WHERE b = 2;
  ```

À medida que o `InnoDB` executa cada `UPDATE`, ele primeiro adquire um travamento exclusivo para cada linha e, em seguida, determina se a modificará. Se o `InnoDB` não modificar a linha, ele libera o travamento. Caso contrário, o `InnoDB` retém o travamento até o final da transação. Isso afeta o processamento da transação da seguinte forma.

Ao usar o nível de isolamento `REPEATABLE READ` padrão, a primeira `UPDATE` adquire um travamento x em cada linha que lê e não libera nenhum deles:

```
  x-lock(1,2); retain x-lock
  x-lock(2,3); update(2,3) to (2,5); retain x-lock
  x-lock(3,2); retain x-lock
  x-lock(4,3); update(4,3) to (4,5); retain x-lock
  x-lock(5,2); retain x-lock
  ```

O segundo `UPDATE` bloqueia assim que tenta adquirir quaisquer bloqueios (porque o primeiro `UPDATE` retivou bloqueios em todas as linhas), e não prossegue até que o primeiro `UPDATE` commit ou rollback:

```
  x-lock(1,2); block and wait for first UPDATE to commit or roll back
  ```

Se `READ COMMITTED` for usado, o primeiro `UPDATE` adquire um bloqueio x em cada linha que lê e libera para as linhas que não modifica:

```
  x-lock(1,2); unlock(1,2)
  x-lock(2,3); update(2,3) to (2,5); retain x-lock
  x-lock(3,2); unlock(3,2)
  x-lock(4,3); update(4,3) to (4,5); retain x-lock
  x-lock(5,2); unlock(5,2)
  ```

Para o segundo `UPDATE`, o `InnoDB` faz uma leitura "semi-consistente", retornando a versão mais recente comprometida de cada linha que lê para o MySQL, para que o MySQL possa determinar se a linha corresponde à condição `WHERE` do `UPDATE`:

```
  x-lock(1,2); update(1,2) to (1,4); retain x-lock
  x-lock(2,3); unlock(2,3)
  x-lock(3,2); update(3,2) to (3,4); retain x-lock
  x-lock(4,3); unlock(4,3)
  x-lock(5,2); update(5,2) to (5,4); retain x-lock
  ```

No entanto, se a condição `WHERE` incluir uma coluna indexada e o `InnoDB` usar o índice, apenas a coluna indexada é considerada ao adquirir e reter bloqueios de registro. No exemplo seguinte, o primeiro `UPDATE` adquire e reter um bloqueio x em cada linha onde b = 2. O segundo `UPDATE` bloqueia quando tenta adquirir bloqueios x nos mesmos registros, pois também usa o índice definido na coluna b.

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

O nível de isolamento `READ COMMITTED` pode ser definido no início ou alterado no runtime. No runtime, pode ser definido globalmente para todas as sessões ou individualmente por sessão.

* `READ UNCOMMITTED`

As instruções `SELECT` são executadas de forma não bloqueante, mas uma versão anterior possível de uma linha pode ser usada. Assim, usando este nível de isolamento, essas leituras não são consistentes. Isso também é chamado de leitura suja. Caso contrário, este nível de isolamento funciona como `READ COMMITTED`.

* `SERIALIZABLE`

Esse nível é como o `REPEATABLE READ`, mas o `InnoDB` converte implicitamente todas as instruções `SELECT` simples para `SELECT ... FOR SHARE` se o `autocommit` estiver desativado. Se o `autocommit` estiver ativado, o `SELECT` é uma transação própria. Portanto, é conhecido por ser apenas de leitura e pode ser serializado se realizado como uma leitura consistente (sem bloqueio) e não precisa bloquear outras transações. (Para forçar uma simples `SELECT` a bloquear se outras transações modificaram as linhas selecionadas, desative o `autocommit`.)

As operações de DML que leem dados do MySQL concedem tabelas (através de uma lista de junção ou subconsulta) mas não as modificam, não adquirem bloqueios de leitura nas tabelas de concessão do MySQL, independentemente do nível de isolamento. Para mais informações, consulte Concessão de Concorrência de Tabelas.