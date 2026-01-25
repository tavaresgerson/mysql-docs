#### 8.2.1.18 Otimização de Chamada de Função

As funções do MySQL são rotuladas internamente como determinísticas ou não determinísticas. Uma função é não determinística se, dados valores fixos para seus argumentos, ela puder retornar resultados diferentes para diferentes invocações. Exemplos de funções não determinísticas: `RAND()`, `UUID()`.

Se uma função for rotulada como não determinística, uma referência a ela em uma cláusula `WHERE` é avaliada para cada linha (ao selecionar de uma tabela) ou combinação de linhas (ao selecionar de um JOIN de múltiplas tabelas).

O MySQL também determina quando avaliar funções com base nos tipos de argumentos, se os argumentos são colunas da tabela ou valores constantes. Uma função determinística que utiliza uma coluna da tabela como argumento deve ser avaliada sempre que essa coluna mudar de valor.

Funções não determinísticas podem afetar a performance de Querys. Por exemplo, algumas otimizações podem não estar disponíveis, ou pode ser necessário mais Lock. A discussão a seguir usa `RAND()`, mas se aplica a outras funções não determinísticas também.

Suponha que uma tabela `t` tenha esta definição:

```sql
CREATE TABLE t (id INT NOT NULL PRIMARY KEY, col_a VARCHAR(100));
```

Considere estas duas Querys:

```sql
SELECT * FROM t WHERE id = POW(1,2);
SELECT * FROM t WHERE id = FLOOR(1 + RAND() * 49);
```

Ambas as Querys parecem usar uma Primary Key lookup devido à comparação de igualdade com a Primary Key, mas isso é verdade apenas para a primeira delas:

*   A primeira Query sempre produz no máximo uma linha porque `POW()` com argumentos constantes é um valor constante e é usado para Index lookup.

*   A segunda Query contém uma expressão que usa a função não determinística `RAND()`, que não é constante na Query, mas na verdade tem um novo valor para cada linha da tabela `t`. Consequentemente, a Query lê todas as linhas da tabela, avalia o predicado para cada linha e exibe todas as linhas para as quais a Primary Key corresponde ao valor aleatório. Isso pode ser zero, uma ou múltiplas linhas, dependendo dos valores da coluna `id` e dos valores na sequência `RAND()`.

Os efeitos do não determinismo não se limitam às instruções `SELECT`. Esta instrução `UPDATE` usa uma função não determinística para selecionar linhas a serem modificadas:

```sql
UPDATE t SET col_a = some_expr WHERE id = FLOOR(1 + RAND() * 49);
```

Presumivelmente, a intenção é atualizar no máximo uma única linha para a qual a Primary Key corresponda à expressão. No entanto, ela pode atualizar zero, uma ou múltiplas linhas, dependendo dos valores da coluna `id` e dos valores na sequência `RAND()`.

O comportamento recém-descrito tem implicações para performance e replicação:

*   Como uma função não determinística não produz um valor constante, o optimizer não pode usar estratégias que de outra forma seriam aplicáveis, como Index lookups. O resultado pode ser um table scan.

*   O `InnoDB` pode escalar para um range-key Lock em vez de aplicar um single row Lock para uma linha correspondente.

*   Updates que não são executados deterministicamente não são seguros para replicação.

As dificuldades decorrem do fato de que a função `RAND()` é avaliada uma vez para cada linha da tabela. Para evitar múltiplas avaliações de função, use uma destas técnicas:

*   Mova a expressão que contém a função não determinística para uma instrução separada, salvando o valor em uma variável. Na instrução original, substitua a expressão por uma referência à variável, que o optimizer pode tratar como um valor constante:

    ```sql
  SET @keyval = FLOOR(1 + RAND() * 49);
  UPDATE t SET col_a = some_expr WHERE id = @keyval;
  ```

*   Atribua o valor aleatório a uma variável em uma derived table. Esta técnica faz com que a variável receba um valor, uma única vez, antes de seu uso na comparação na cláusula `WHERE`:

    ```sql
  SET optimizer_switch = 'derived_merge=off';
  UPDATE t, (SELECT @keyval := FLOOR(1 + RAND() * 49)) AS dt
  SET col_a = some_expr WHERE id = @keyval;
  ```

Conforme mencionado anteriormente, uma expressão não determinística na cláusula `WHERE` pode impedir otimizações e resultar em um table scan. No entanto, pode ser possível otimizar parcialmente a cláusula `WHERE` se outras expressões forem determinísticas. Por exemplo:

```sql
SELECT * FROM t WHERE partial_key=5 AND some_column=RAND();
```

Se o optimizer puder usar `partial_key` para reduzir o conjunto de linhas selecionadas, `RAND()` será executada menos vezes, o que diminui o efeito do não determinismo na otimização.