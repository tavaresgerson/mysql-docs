#### 10.2.1.20 Otimização de Chamadas de Função

As funções do MySQL são marcadas internamente como determinísticas ou não determinísticas. Uma função é não determinística se, dados valores fixos para seus argumentos, ela pode retornar resultados diferentes para diferentes invocatórias. Exemplos de funções não determinísticas: `RAND()`, `UUID()`.

Se uma função é marcada como não determinística, uma referência a ela em uma cláusula `WHERE` é avaliada para cada linha (ao selecionar de uma única tabela) ou combinação de linhas (ao selecionar de uma junção de múltiplas tabelas).

O MySQL também determina quando avaliar funções com base nos tipos de argumentos, se os argumentos são colunas de tabela ou valores constantes. Uma função determinística que recebe uma coluna de tabela como argumento deve ser avaliada sempre que essa coluna mudar de valor.

Funções não determinísticas podem afetar o desempenho da consulta. Por exemplo, algumas otimizações podem não estar disponíveis ou pode ser necessário mais bloqueio. A discussão a seguir usa `RAND()`, mas se aplica a outras funções não determinísticas também.

Suponha que uma tabela `t` tenha esta definição:

```
CREATE TABLE t (id INT NOT NULL PRIMARY KEY, col_a VARCHAR(100));
```

Considere estas duas consultas:

```
SELECT * FROM t WHERE id = POW(1,2);
SELECT * FROM t WHERE id = FLOOR(1 + RAND() * 49);
```

Ambas as consultas parecem usar uma busca por chave primária devido à comparação de igualdade contra a chave primária, mas isso é verdadeiro apenas para a primeira delas:

* A primeira consulta sempre produz um máximo de uma linha porque `POW()` com argumentos constantes é um valor constante e é usado para busca de índice.
* A segunda consulta contém uma expressão que usa a função não determinística `RAND()`, que não é constante na consulta, mas na verdade tem um novo valor para cada linha da tabela `t`. Consequentemente, a consulta lê cada linha da tabela, avalia o predicado para cada linha e emite todas as linhas para as quais a chave primária corresponde ao valor aleatório. Isso pode ser zero, uma ou várias linhas, dependendo dos valores da coluna `id` e dos valores na sequência de `RAND()`.

Os efeitos do não determinismo não se limitam às instruções `SELECT`. Esta instrução `UPDATE` utiliza uma função não determinística para selecionar as linhas a serem modificadas:

```
UPDATE t SET col_a = some_expr WHERE id = FLOOR(1 + RAND() * 49);
```

Presumivelmente, a intenção é atualizar no máximo uma única linha cuja chave primária corresponda à expressão. No entanto, ela pode atualizar zero, uma ou várias linhas, dependendo dos valores da coluna `id` e dos valores na sequência `RAND()`.

O comportamento descrito acima tem implicações para o desempenho e a replicação:

* Como uma função não determinística não produz um valor constante, o otimizador não pode usar estratégias que poderiam ser aplicáveis, como consultas de índice. O resultado pode ser uma varredura da tabela.
* O `InnoDB` pode escalar para um bloqueio de chave de intervalo em vez de tomar um bloqueio de uma única linha para uma linha correspondente.
* As atualizações que não executam de forma determinística são inseguras para a replicação.

As dificuldades decorrem do fato de que a função `RAND()` é avaliada uma vez para cada linha da tabela. Para evitar múltiplas avaliações da função, use uma dessas técnicas:

* Mova a expressão que contém a função não determinística para uma declaração separada, salvando o valor em uma variável. Na declaração original, substitua a expressão por uma referência à variável, que o otimizador pode tratar como um valor constante:

  ```
  SET @keyval = FLOOR(1 + RAND() * 49);
  UPDATE t SET col_a = some_expr WHERE id = @keyval;
  ```
* Atribua o valor aleatório a uma variável em uma tabela derivada. Essa técnica faz com que a variável seja atribuída um valor, uma vez, antes de ser usada na comparação na cláusula `WHERE`:

  ```
  UPDATE /*+ NO_MERGE(dt) */ t, (SELECT FLOOR(1 + RAND() * 49) AS r) AS dt
  SET col_a = some_expr WHERE id = dt.r;
  ```

Como mencionado anteriormente, uma expressão não determinística na cláusula `WHERE` pode impedir otimizações e resultar em uma varredura da tabela. No entanto, pode ser possível otimizar parcialmente a cláusula `WHERE` se outras expressões forem determinísticas. Por exemplo:

```
SELECT * FROM t WHERE partial_key=5 AND some_column=RAND();
```

Se o otimizador puder usar `partial_key` para reduzir o conjunto de linhas selecionadas, a `RAND()` é executada menos vezes, o que diminui o efeito do não determinismo na otimização.