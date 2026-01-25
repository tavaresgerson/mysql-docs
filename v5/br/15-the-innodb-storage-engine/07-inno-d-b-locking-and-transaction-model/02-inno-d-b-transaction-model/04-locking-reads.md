#### 14.7.2.4 Locking Reads

Se você consultar dados e depois inserir ou atualizar dados relacionados na mesma transaction, o `SELECT` statement regular não oferece proteção suficiente. Outras transactions podem atualizar ou deletar as mesmas rows que você acabou de consultar. O `InnoDB` suporta dois tipos de Locking Reads que oferecem segurança extra:

* `SELECT ... LOCK IN SHARE MODE`

  Define um shared mode lock em quaisquer rows que sejam lidas. Outras sessions podem ler as rows, mas não podem modificá-las até que sua transaction faça COMMIT. Se alguma dessas rows foi alterada por outra transaction que ainda não fez COMMIT, sua Query aguarda até que essa transaction termine e então utiliza os valores mais recentes.

* `SELECT ... FOR UPDATE`

  Para index records encontrados pela busca, bloqueia as rows e quaisquer index entries associadas, o mesmo que se você emitisse um `UPDATE` statement para essas rows. Outras transactions são impedidas de atualizar essas rows, de fazer `SELECT ... LOCK IN SHARE MODE`, ou de ler os dados em certos transaction isolation levels. Consistent reads ignoram quaisquer locks definidos nos records que existem na read view. (Versões antigas de um record não podem ser bloqueadas; elas são reconstruídas aplicando undo logs em uma cópia do record na memória.)

Estas cláusulas são principalmente úteis ao lidar com dados estruturados em árvore ou em grafo, seja em uma única table ou divididos em múltiplas tables. Você percorre arestas ou ramificações de árvore de um lugar para outro, enquanto reserva o direito de voltar e alterar qualquer um desses valores de “ponteiro”.

Todos os locks definidos pelas Queries `LOCK IN SHARE MODE` e `FOR UPDATE` são liberados quando a transaction faz COMMIT ou ROLLBACK.

Nota

Locking Reads só são possíveis quando o `autocommit` está desabilitado (seja iniciando a transaction com `START TRANSACTION` ou definindo `autocommit` para 0.

Uma cláusula de Locking Read em um statement externo não bloqueia as rows de uma table em uma subquery aninhada a menos que uma cláusula de Locking Read também seja especificada na subquery. Por exemplo, o statement a seguir não bloqueia rows na table `t2`.

```sql
SELECT * FROM t1 WHERE c1 = (SELECT c1 FROM t2) FOR UPDATE;
```

Para bloquear rows na table `t2`, adicione uma cláusula de Locking Read à subquery:

```sql
SELECT * FROM t1 WHERE c1 = (SELECT c1 FROM t2 FOR UPDATE) FOR UPDATE;
```

##### Exemplos de Locking Read

Suponha que você queira inserir uma nova row em uma table `child`, e garantir que a row child tenha uma row parent na table `parent`. O código da sua aplicação pode garantir a integridade referencial ao longo desta sequência de operações.

Primeiro, use um consistent read para consultar a table `PARENT` e verificar se a row parent existe. Você pode inserir a row child na table `CHILD` com segurança? Não, porque alguma outra session poderia deletar a row parent no momento entre o seu `SELECT` e o seu `INSERT`, sem que você perceba.

Para evitar esse problema potencial, execute o `SELECT` usando `LOCK IN SHARE MODE`:

```sql
SELECT * FROM parent WHERE NAME = 'Jones' LOCK IN SHARE MODE;
```

Após a Query `LOCK IN SHARE MODE` retornar o parent `'Jones'`, você pode adicionar o record child com segurança à table `CHILD` e fazer COMMIT da transaction. Qualquer transaction que tente adquirir um exclusive lock na row aplicável na table `PARENT` aguarda até que você termine, ou seja, até que os dados em todas as tables estejam em um estado consistente.

Para outro exemplo, considere um campo de contador integer em uma table `CHILD_CODES`, usado para atribuir um unique identifier a cada child adicionado à table `CHILD`. Não use consistent read nem shared mode read para ler o valor presente do contador, pois dois usuários do Database poderiam ver o mesmo valor para o contador, e um erro de duplicate-key ocorrerá se duas transactions tentarem adicionar rows com o mesmo identifier à table `CHILD`.

Aqui, `LOCK IN SHARE MODE` não é uma boa solução porque se dois usuários lerem o contador ao mesmo tempo, pelo menos um deles acaba em deadlock quando tenta atualizar o contador.

Para implementar a leitura e o incremento do contador, primeiro execute um Locking Read do contador usando `FOR UPDATE`, e então incremente o contador. Por exemplo:

```sql
SELECT counter_field FROM child_codes FOR UPDATE;
UPDATE child_codes SET counter_field = counter_field + 1;
```

Um `SELECT ... FOR UPDATE` lê os dados mais recentes disponíveis, definindo exclusive locks em cada row que ele lê. Assim, ele define os mesmos locks que um `UPDATE` SQL pesquisado definiria nas rows.

A descrição anterior é meramente um exemplo de como o `SELECT ... FOR UPDATE` funciona. No MySQL, a tarefa específica de gerar um unique identifier pode, na verdade, ser realizada usando apenas um único acesso à table:

```sql
UPDATE child_codes SET counter_field = LAST_INSERT_ID(counter_field + 1);
SELECT LAST_INSERT_ID();
```

O `SELECT` statement apenas recupera a informação do identifier (específica para a conexão atual). Ele não acessa nenhuma table.