#### 14.7.2.4 Leitura de bloqueio

Se você fizer uma consulta aos dados e, em seguida, inserir ou atualizar dados relacionados na mesma transação, a declaração `SELECT` regular não oferece proteção suficiente. Outras transações podem atualizar ou excluir as mesmas linhas que você acabou de consultar. O `InnoDB` suporta dois tipos de leituras com bloqueio que oferecem segurança extra:

- `SELECT ... LOCK IN SHARE MODE`

  Define um bloqueio de modo compartilhado em quaisquer linhas que estejam sendo lidas. Outras sessões podem ler as linhas, mas não podem modificá-las até que sua transação seja confirmada. Se alguma dessas linhas tiver sido alterada por outra transação que ainda não tenha sido confirmada, sua consulta aguarda até que essa transação termine e, em seguida, usa os valores mais recentes.

- `SELECT ... FOR UPDATE`

  Para registros de índice, a pesquisa encontra, bloqueia as linhas e quaisquer entradas de índice associadas, da mesma forma que se emitisse uma declaração `UPDATE` para essas linhas. Outras transações são bloqueadas para atualizar essas linhas, para fazer `SELECT ... LOCK IN SHARE MODE` ou para ler os dados em certos níveis de isolamento de transação. Leitura consistente ignora quaisquer bloqueios definidos nos registros que existem na visão de leitura. (Versões antigas de um registro não podem ser bloqueadas; elas são reconstruídas aplicando registros de desfazer em uma cópia em memória do registro.)

Essas cláusulas são principalmente úteis ao lidar com dados estruturados em árvore ou em gráficos, seja em uma única tabela ou distribuídos em várias tabelas. Você percorre arestas ou ramos da árvore de um lugar para outro, reservando o direito de voltar e alterar qualquer um desses valores de "ponteiro".

Todas as bloquagens definidas pelas consultas `LOCK IN SHARE MODE` e `FOR UPDATE` são liberadas quando a transação é confirmada ou revertida.

Nota

As leituras bloqueadas só são possíveis quando o autocommit está desativado (iniciando a transação com `START TRANSACTION` ou configurando o `autocommit` para 0.

Uma cláusula de leitura com bloqueio em uma declaração externa não bloqueia as linhas de uma tabela em uma subconsulta aninhada, a menos que uma cláusula de leitura com bloqueio também seja especificada na subconsulta. Por exemplo, a seguinte declaração não bloqueia as linhas da tabela `t2`.

```sql
SELECT * FROM t1 WHERE c1 = (SELECT c1 FROM t2) FOR UPDATE;
```

Para bloquear linhas na tabela `t2`, adicione uma cláusula de leitura de bloqueio à subconsulta:

```sql
SELECT * FROM t1 WHERE c1 = (SELECT c1 FROM t2 FOR UPDATE) FOR UPDATE;
```

##### Bloquear Exemplos de Leitura

Suponha que você queira inserir uma nova linha em uma tabela `child` e garantir que a linha filha tenha uma linha pai na tabela `parent`. Seu código de aplicação pode garantir a integridade referencial ao longo dessa sequência de operações.

Primeiro, use uma leitura consistente para consultar a tabela `PARENT` e verificar se a linha pai existe. Você pode inserir com segurança a linha filho na tabela `CHILD`? Não, porque outra sessão pode excluir a linha pai no momento entre seu `SELECT` e seu `INSERT`, sem que você perceba.

Para evitar esse problema potencial, execute a consulta `SELECT` usando `LOCK IN SHARE MODE`:

```sql
SELECT * FROM parent WHERE NAME = 'Jones' LOCK IN SHARE MODE;
```

Depois que a consulta `LOCK IN SHARE MODE` retorna o registro pai `'Jones'`, você pode adicionar com segurança o registro filho à tabela `CHILD` e confirmar a transação. Qualquer transação que tente adquirir um bloqueio exclusivo na linha aplicável na tabela `PARENT` aguarda até que você termine, ou seja, até que os dados em todas as tabelas estejam em um estado consistente.

Para outro exemplo, considere um campo de contador inteiro em uma tabela `CHILD_CODES`, usado para atribuir um identificador único a cada criança adicionada à tabela `CHILD`. Não use leitura consistente ou leitura em modo compartilhado para ler o valor atual do contador, porque dois usuários do banco de dados poderiam ver o mesmo valor para o contador, e um erro de chave duplicada ocorreria se duas transações tentassem adicionar linhas com o mesmo identificador à tabela `CHILD`.

Aqui, `LOCK IN SHARE MODE` não é uma boa solução, pois, se dois usuários lerem o contador ao mesmo tempo, pelo menos um deles acaba em um impasse ao tentar atualizar o contador.

Para implementar a leitura e o incremento do contador, primeiro realize uma leitura com bloqueio do contador usando `FOR UPDATE` e, em seguida, incremente o contador. Por exemplo:

```sql
SELECT counter_field FROM child_codes FOR UPDATE;
UPDATE child_codes SET counter_field = counter_field + 1;
```

Um `SELECT ... FOR UPDATE` lê os dados mais recentes disponíveis, configurando bloqueios exclusivos em cada linha que lê. Assim, ele configura os mesmos bloqueios que um `UPDATE` SQL pesquisado configuraria nas linhas.

A descrição anterior é apenas um exemplo de como o `SELECT ... FOR UPDATE` funciona. No MySQL, a tarefa específica de gerar um identificador único pode ser realizada usando apenas um único acesso à tabela:

```sql
UPDATE child_codes SET counter_field = LAST_INSERT_ID(counter_field + 1);
SELECT LAST_INSERT_ID();
```

A instrução `SELECT` apenas recupera as informações de identificador (específicas para a conexão atual). Ela não acessa nenhuma tabela.
