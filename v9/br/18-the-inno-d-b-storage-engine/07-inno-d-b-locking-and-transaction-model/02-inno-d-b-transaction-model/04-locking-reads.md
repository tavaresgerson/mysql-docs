#### 17.7.2.4 Leitura com Bloqueio

Se você fizer uma consulta aos dados e, em seguida, inserir ou atualizar dados relacionados na mesma transação, a declaração regular `SELECT` não oferece proteção suficiente. Outras transações podem atualizar ou excluir as mesmas linhas que você acabou de consultar. O `InnoDB` suporta dois tipos de leituras com bloqueio que oferecem segurança extra:

* `SELECT ... FOR SHARE`

  Define um bloqueio de modo compartilhado em quaisquer linhas que são lidas. Outras sessões podem ler as linhas, mas não podem modificá-las até que sua transação seja confirmada. Se alguma dessas linhas tiver sido alterada por outra transação que ainda não foi confirmada, sua consulta aguarda até que essa transação termine e, então, usa os valores mais recentes.

  Observação

  `SELECT ... FOR SHARE` é um substituto de `SELECT ... LOCK IN SHARE MODE`, mas `LOCK IN SHARE MODE` permanece disponível para compatibilidade com versões anteriores. As declarações são equivalentes. No entanto, `FOR SHARE` suporta as opções `OF table_name`, `NOWAIT` e `SKIP LOCKED`. Veja Concorrência de Leitura com Bloqueio e NOWAIT e SKIP LOCKED.

  `SELECT ... FOR SHARE` requer o privilégio `SELECT`.

  As declarações `SELECT ... FOR SHARE` não adquirem bloqueios de leitura em tabelas de concessão do MySQL. Para mais informações, consulte Concorrência de Tabela de Concessão.

* `SELECT ... FOR UPDATE`

  Para os registros de índice que a pesquisa encontra, bloqueia as linhas e quaisquer entradas de índice associadas, o mesmo que se você tivesse emitido uma declaração `UPDATE` para essas linhas. Outras transações são bloqueadas para atualizar essas linhas, para fazer `SELECT ... FOR SHARE` ou para ler os dados em certos níveis de isolamento de transação. Leitura consistente ignora quaisquer bloqueios definidos nos registros que existem na visão de leitura. (Versões antigas de um registro não podem ser bloqueadas; elas são reconstruídas aplicando logs de desfazer em uma cópia em memória do registro.)

`SELECT ... FOR UPDATE` requer o privilégio `SELECT` e pelo menos um dos privilégios `DELETE`, `LOCK TABLES` ou `UPDATE`.

Essas cláusulas são principalmente úteis ao lidar com dados estruturados em forma de árvore ou gráfico, seja em uma única tabela ou distribuídos em várias tabelas. Você percorre arestas ou ramos de árvore de um lugar para outro, reservando o direito de voltar e alterar qualquer um desses valores de "ponteiro".

Todos os bloqueios definidos por consultas `FOR SHARE` e `FOR UPDATE` são liberados quando a transação é confirmada ou revertida.

Nota

Leitura com bloqueio é possível apenas quando o autocommit é desativado (iniciando a transação com `START TRANSACTION` ou configurando `autocommit` para 0.

Uma cláusula de leitura com bloqueio em uma declaração externa não bloqueia as linhas de uma tabela em uma subconsulta aninhada, a menos que uma cláusula de leitura com bloqueio também seja especificada na subconsulta. Por exemplo, a seguinte declaração não bloqueia linhas na tabela `t2`.

```
SELECT * FROM t1 WHERE c1 = (SELECT c1 FROM t2) FOR UPDATE;
```

Para bloquear linhas na tabela `t2`, adicione uma cláusula de leitura com bloqueio à subconsulta:

```
SELECT * FROM t1 WHERE c1 = (SELECT c1 FROM t2 FOR UPDATE) FOR UPDATE;
```

##### Exemplos de Leitura com Bloqueio

Suponha que você queira inserir uma nova linha em uma tabela `child` e garantir que a linha da criança tenha uma linha pai na tabela `parent`. Seu código de aplicativo pode garantir a integridade referencial ao longo dessa sequência de operações.

Primeiro, use uma leitura consistente para consultar a tabela `PARENT` e verificar se a linha pai existe. Você pode inserir com segurança a linha da criança na tabela `CHILD`? Não, porque outra sessão poderia excluir a linha pai no momento entre seu `SELECT` e sua `INSERT`, sem que você soubesse disso.

Para evitar esse problema potencial, realize a `SELECT` usando `FOR SHARE`:

```
SELECT * FROM parent WHERE NAME = 'Jones' FOR SHARE;
```

Após a consulta `FOR SHARE` retornar o registro pai `'Jones'`, você pode adicionar com segurança o registro filho à tabela `CHILD` e confirmar a transação. Qualquer transação que tente adquirir um bloqueio exclusivo na linha aplicável na tabela `PARENT` aguarda até que você termine, ou seja, até que os dados em todas as tabelas estejam em um estado consistente.

Para outro exemplo, considere um campo de contador inteiro em uma tabela `CHILD_CODES`, usado para atribuir um identificador único a cada filho adicionado à tabela `CHILD`. Não use leitura consistente ou leitura em modo compartilhado para ler o valor atual do contador, porque dois usuários do banco de dados poderiam ver o mesmo valor para o contador, e um erro de chave duplicada ocorre se duas transações tentarem adicionar linhas com o mesmo identificador à tabela `CHILD`.

Aqui, `FOR SHARE` não é uma boa solução porque, se dois usuários lerem o contador ao mesmo tempo, pelo menos um deles acaba em um impasse ao tentar atualizar o contador.

Para implementar a leitura e o incremento do contador, primeiro realize uma leitura com bloqueio usando `FOR UPDATE`, e depois incremente o contador. Por exemplo:

```
SELECT counter_field FROM child_codes FOR UPDATE;
UPDATE child_codes SET counter_field = counter_field + 1;
```

A consulta `SELECT ... FOR UPDATE` lê os dados mais recentes disponíveis, estabelecendo bloqueios exclusivos em cada linha que lê. Assim, estabelece os mesmos bloqueios que um `UPDATE` SQL pesquisado estabeleceria nas linhas.

A descrição anterior é apenas um exemplo de como o `SELECT ... FOR UPDATE` funciona. No MySQL, a tarefa específica de gerar um identificador único pode ser realizada usando apenas um único acesso à tabela:

```
UPDATE child_codes SET counter_field = LAST_INSERT_ID(counter_field + 1);
SELECT LAST_INSERT_ID();
```

A instrução `SELECT` apenas recupera as informações do identificador (específicas para a conexão atual). Ela não acessa nenhuma tabela.

##### Concorrência de Leitura com Bloqueio com NOWAIT e SKIP LOCKED
```
# Session 1:

mysql> CREATE TABLE t (i INT, PRIMARY KEY (i)) ENGINE = InnoDB;

mysql> INSERT INTO t (i) VALUES(1),(2),(3);

mysql> START TRANSACTION;

mysql> SELECT * FROM t WHERE i = 2 FOR UPDATE;
+---+
| i |
+---+
| 2 |
+---+

# Session 2:

mysql> START TRANSACTION;

mysql> SELECT * FROM t WHERE i = 2 FOR UPDATE NOWAIT;
ERROR 3572 (HY000): Do not wait for lock.

# Session 3:

mysql> START TRANSACTION;

mysql> SELECT * FROM t FOR UPDATE SKIP LOCKED;
+---+
| i |
+---+
| 1 |
| 3 |
+---+
```

No exemplo acima, a consulta `SELECT ... FOR UPDATE` lê os dados mais recentes disponíveis, estabelecendo bloqueios exclusivos em cada linha que lê. A instrução `UPDATE` incrementa o contador, e a transação é confirmada.

Se uma linha for bloqueada por uma transação, uma transação `SELECT ... FOR UPDATE` ou `SELECT ... FOR SHARE` que solicita a mesma linha bloqueada deve esperar até que a transação bloqueadora libere o bloqueio da linha. Esse comportamento impede que as transações atualizem ou excluam linhas que são consultadas para atualizações por outras transações. No entanto, não é necessário esperar que um bloqueio de linha seja liberado se você deseja que a consulta retorne imediatamente quando uma linha solicitada for bloqueada, ou se excluir linhas bloqueadas do conjunto de resultados for aceitável.

Para evitar esperar que outras transações liberem bloqueios de linha, as opções `NOWAIT` e `SKIP LOCKED` podem ser usadas com instruções de bloqueio `SELECT ... FOR UPDATE` ou `SELECT ... FOR SHARE`.

* `NOWAIT`

  Uma leitura de bloqueio que usa `NOWAIT` nunca aguarda para adquirir um bloqueio de linha. A consulta é executada imediatamente, com erro se uma linha solicitada for bloqueada.

* `SKIP LOCKED`

  Uma leitura de bloqueio que usa `SKIP LOCKED` nunca aguarda para adquirir um bloqueio de linha. A consulta é executada imediatamente, removendo linhas bloqueadas do conjunto de resultados.

  Nota

  Consultas que ignoram linhas bloqueadas retornam uma visão inconsistente dos dados. `SKIP LOCKED` não é, portanto, adequado para trabalho transacional geral. No entanto, pode ser usado para evitar a disputa por bloqueios quando múltiplas sessões acessam a mesma tabela semelhante a uma fila.

`NOWAIT` e `SKIP LOCKED` aplicam-se apenas a bloqueios de nível de linha.

Instruções que usam `NOWAIT` ou `SKIP LOCKED` não são seguras para replicação baseada em declarações.

O exemplo a seguir demonstra `NOWAIT` e `SKIP LOCKED`. A sessão 1 inicia uma transação que assume um bloqueio de linha em um único registro. A sessão 2 tenta uma leitura com bloqueio no mesmo registro usando a opção `NOWAIT`. Como a linha solicitada está bloqueada pela sessão 1, a leitura com bloqueio retorna imediatamente com um erro. Na sessão 3, a leitura com bloqueio com `SKIP LOCKED` retorna as linhas solicitadas, exceto a linha que está bloqueada pela sessão 1.

