#### 17.7.2.4 Leitura de bloqueio

Se você consultar dados e, em seguida, inserir ou atualizar dados relacionados na mesma transação, a declaração regular `SELECT` não oferece proteção suficiente. Outras transações podem atualizar ou excluir as mesmas linhas que você acabou de consultar. `InnoDB` suporta dois tipos de leituras com bloqueio que oferecem segurança extra:

- `SELECT ... FOR SHARE`

  Define um bloqueio de modo compartilhado em quaisquer linhas que estejam sendo lidas. Outras sessões podem ler as linhas, mas não podem modificá-las até que sua transação seja confirmada. Se alguma dessas linhas tiver sido alterada por outra transação que ainda não tenha sido confirmada, sua consulta aguarda até que essa transação termine e, em seguida, usa os valores mais recentes.

  Nota

  `SELECT ... FOR SHARE` é um substituto de `SELECT ... LOCK IN SHARE MODE`, mas `LOCK IN SHARE MODE` permanece disponível para compatibilidade reversa. As declarações são equivalentes. No entanto, `FOR SHARE` suporta as opções `OF table_name`, `NOWAIT` e `SKIP LOCKED`. Veja Acionamento da Concorrência de Leitura com NOWAIT e SKIP LOCKED.

  Antes do MySQL 8.0.22, o `SELECT ... FOR SHARE` exige o privilégio `SELECT` e pelo menos um dos privilégios `DELETE`, `LOCK TABLES` ou `UPDATE`. A partir do MySQL 8.0.22, apenas o privilégio `SELECT` é necessário.

  A partir do MySQL 8.0.22, as instruções `SELECT ... FOR SHARE` não adquiririam bloqueios de leitura nas tabelas de concessão do MySQL. Para mais informações, consulte Concorrência na Tabela de Concessão.

- `SELECT ... FOR UPDATE`

  Para registros de índice, a pesquisa encontra, bloqueia as linhas e quaisquer entradas de índice associadas, da mesma forma que se emitisse uma declaração `UPDATE` para essas linhas. Outras transações são bloqueadas para atualizar essas linhas, para realizar `SELECT ... FOR SHARE` ou para ler os dados em certos níveis de isolamento de transação. Leitura consistente ignora quaisquer bloqueios definidos nos registros que existem na visão de leitura. (Versões antigas de um registro não podem ser bloqueadas; elas são reconstruídas aplicando registros de desfazer em uma cópia em memória do registro.)

  O `SELECT ... FOR UPDATE` requer o privilégio `SELECT` e pelo menos um dos privilégios `DELETE`, `LOCK TABLES` ou `UPDATE`.

Essas cláusulas são principalmente úteis ao lidar com dados estruturados em árvore ou em gráficos, seja em uma única tabela ou distribuídos em várias tabelas. Você percorre arestas ou ramos da árvore de um lugar para outro, reservando o direito de voltar e alterar qualquer um desses valores de "ponteiro".

Todas as trancas definidas pelas consultas `FOR SHARE` e `FOR UPDATE` são liberadas quando a transação é confirmada ou revertida.

Nota

As leituras de bloqueio só são possíveis quando o autocommit está desativado (iniciando a transação com `START TRANSACTION` ou configurando `autocommit` para 0.

Uma cláusula de leitura com bloqueio em uma declaração externa não bloqueia as linhas de uma tabela em uma subconsulta aninhada, a menos que uma cláusula de leitura com bloqueio também seja especificada na subconsulta. Por exemplo, a seguinte declaração não bloqueia as linhas da tabela `t2`.

```
SELECT * FROM t1 WHERE c1 = (SELECT c1 FROM t2) FOR UPDATE;
```

Para bloquear linhas na tabela `t2`, adicione uma cláusula de leitura de bloqueio à subconsulta:

```
SELECT * FROM t1 WHERE c1 = (SELECT c1 FROM t2 FOR UPDATE) FOR UPDATE;
```

##### Bloquear Exemplos de Leitura

Suponha que você queira inserir uma nova linha em uma tabela `child` e garantir que a linha filha tenha uma linha pai na tabela `parent`. O código da sua aplicação pode garantir a integridade referencial ao longo dessa sequência de operações.

Primeiro, use uma leitura consistente para consultar a tabela `PARENT` e verificar se a linha pai existe. Você pode inserir com segurança a linha filha na tabela `CHILD`? Não, porque outra sessão pode excluir a linha pai no momento entre seus `SELECT` e seu `INSERT`, sem que você saiba disso.

Para evitar esse problema potencial, execute o `SELECT` usando `FOR SHARE`:

```
SELECT * FROM parent WHERE NAME = 'Jones' FOR SHARE;
```

Após a consulta `FOR SHARE` retornar o registro pai `'Jones'`, você pode adicionar com segurança o registro filho à tabela `CHILD` e confirmar a transação. Qualquer transação que tente adquirir um bloqueio exclusivo na linha aplicável na tabela `PARENT` aguarda até que você termine, ou seja, até que os dados em todas as tabelas estejam em um estado consistente.

Para outro exemplo, considere um campo de contador inteiro em uma tabela `CHILD_CODES`, usado para atribuir um identificador único a cada filho adicionado à tabela `CHILD`. Não use leitura consistente ou leitura em modo compartilhado para ler o valor atual do contador, porque dois usuários do banco de dados poderiam ver o mesmo valor para o contador, e um erro de chave duplicada ocorreria se duas transações tentassem adicionar linhas com o mesmo identificador à tabela `CHILD`.

Aqui, `FOR SHARE` não é uma boa solução, pois, se dois usuários lerem o contador ao mesmo tempo, pelo menos um deles acaba em um impasse ao tentar atualizar o contador.

Para implementar a leitura e o incremento do contador, primeiro realize uma leitura de bloqueio do contador usando `FOR UPDATE` e, em seguida, incremente o contador. Por exemplo:

```
SELECT counter_field FROM child_codes FOR UPDATE;
UPDATE child_codes SET counter_field = counter_field + 1;
```

Um `SELECT ... FOR UPDATE` lê os dados mais recentes disponíveis, configurando bloqueios exclusivos em cada linha que lê. Assim, ele configura os mesmos bloqueios que um `UPDATE` SQL pesquisado configuraria nas linhas.

A descrição anterior é apenas um exemplo de como o `SELECT ... FOR UPDATE` funciona. No MySQL, a tarefa específica de gerar um identificador único pode ser realizada usando apenas uma única consulta à tabela:

```
UPDATE child_codes SET counter_field = LAST_INSERT_ID(counter_field + 1);
SELECT LAST_INSERT_ID();
```

A declaração `SELECT` apenas recupera as informações de identificador (específicas para a conexão atual). Ela não acessa nenhuma tabela.

##### Bloquear a Concorrência de Leitura com NOWAIT e SKIP LOCKED

Se uma linha for bloqueada por uma transação, uma transação `SELECT ... FOR UPDATE` ou `SELECT ... FOR SHARE` que solicite a mesma linha bloqueada deve esperar até que a transação que bloqueou libere o bloqueio da linha. Esse comportamento impede que as transações atualizem ou excluam linhas que são consultadas para atualizações por outras transações. No entanto, não é necessário esperar que o bloqueio da linha seja liberado se você deseja que a consulta retorne imediatamente quando uma linha solicitada for bloqueada, ou se a exclusão de linhas bloqueadas do conjunto de resultados for aceitável.

Para evitar a espera por outras transações liberarem as blocações de linhas, as opções `NOWAIT` e `SKIP LOCKED` podem ser usadas com as opções `SELECT ... FOR UPDATE` ou `SELECT ... FOR SHARE` para bloquear instruções de leitura.

- `NOWAIT`

  Uma leitura de bloqueio que usa `NOWAIT` nunca aguarda para adquirir um bloqueio de linha. A consulta é executada imediatamente, com falha em caso de erro se uma linha solicitada estiver bloqueada.

- `SKIP LOCKED`

  Uma leitura de bloqueio que usa `SKIP LOCKED` nunca aguarda para adquirir um bloqueio de linha. A consulta é executada imediatamente, removendo as linhas bloqueadas do conjunto de resultados.

  Nota

  Consultas que ignoram linhas bloqueadas retornam uma visão inconsistente dos dados. `SKIP LOCKED` não é, portanto, adequado para trabalhos transacionais gerais. No entanto, ele pode ser usado para evitar a disputa por bloqueio quando múltiplas sessões acessam a mesma tabela semelhante a uma fila.

`NOWAIT` e `SKIP LOCKED` só se aplicam a bloqueios em nível de linha.

As declarações que utilizam `NOWAIT` ou `SKIP LOCKED` não são seguras para a replicação baseada em declarações.

O exemplo a seguir demonstra `NOWAIT` e `SKIP LOCKED`. A sessão 1 inicia uma transação que obtém um bloqueio de linha em um único registro. A sessão 2 tenta uma leitura com bloqueio no mesmo registro usando a opção `NOWAIT`. Como a linha solicitada está bloqueada pela sessão 1, a leitura com bloqueio retorna imediatamente com um erro. Na sessão 3, a leitura com bloqueio com `SKIP LOCKED` retorna as linhas solicitadas, exceto pela linha que está bloqueada pela sessão 1.

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
