#### 27.3.7.2 Declarações Preparadas

A API de declarações preparadas permite que declarações SQL suportadas (consulte Sintaxe SQL Permitida em Declarações Preparadas) sejam reexecutadas sem incorrer no custo de análise e otimização a cada vez.

As declarações preparadas suportam parametrização. O ponto de interrogação ou ponto de exclamação (`?`) é usado como marcador de parâmetro; os parâmetros são atualizados (ligados a valores) antecipadamente, cada vez que a declaração é executada, usando `PreparedStatement.bind()`. Consulte a descrição deste método para obter mais informações.

Para liberar recursos ocupados por parâmetros de consultas e declarações analisadas, chame `PreparedStatement.deallocate()`, que fecha a declaração preparada e libera seus recursos. Omitindo a alocação, não há erro, mas a memória consumida durante a execução do procedimento armazenado não é liberada até que a execução da rotina termine. Uma vez que uma declaração preparada tenha sido fechada (alocada), ela não estará mais disponível para execução.

O fluxo de execução para declarações preparadas consiste nas seguintes etapas:

1. Preparar a declaração (`prepare()`)

2. Atualizar os parâmetros (`bind()`)

3. Executar a declaração (`execute()`)

4. Fechar a declaração (`deallocate()`)

As etapas 2 e 3 podem ser repetidas quantas vezes forem necessárias antes de fechar a declaração preparada.

O procedimento armazenado em JavaScript `jssp_prep1()`, mostrado aqui, aceita uma declaração SQL arbitrária contendo dois marcadores de parâmetro, prepara a declaração, depois a executa duas vezes, ligando valores diferentes aos parâmetros cada vez, e imprime o resultado para `stdout`:

```
CREATE PROCEDURE jssp_prep1(IN query VARCHAR(200))
LANGUAGE JAVASCRIPT AS $$

  function print_result(result) {
    console.log(result.getColumnNames())
    let row = result.fetchOne()

    while(row) {
      console.log(row.toArray())
      row = result.fetchOne()
    }
  }

  function fetch_warnings(result) {
    console.log("Number of warnings: " + result.getWarningsCount())

    for (var w in result.getWarnings()) {
      console.log(w.level + ", " + w.code + ", " + w.message)
     }
  }

  let stmt = session.prepare(query)

  stmt.bind(3, 4)
  let res1 = stmt.execute()
  print_result(res1)
  fetch_warnings(res1)

  stmt.bind(2, 3)
  let res2 = stmt.execute()
  print_result(res2)
  fetch_warnings(res2)

  stmt.bind(5)
  let res3 = stmt.execute()
  print_result(res3)
  fetch_warnings(res3)

  stmt.deallocate()
$$;
```

Quando você estiver pronto para fechar a declaração preparada, feche-a, liberando quaisquer recursos usados na preparação e execução dela, chamando `deallocate()`.

Chamar `bind()` com menos argumentos do que o número de parâmetros na instrução é permitido depois que todos os parâmetros tiverem sido vinculados pelo menos uma vez. Nesse caso, chamar `stmt.bind(5)` após ter chamado `stmt.bind(2,3)` anteriormente é o mesmo que chamar `stmt.bind(5,3)` — o valor faltante do segundo parâmetro é reutilizado da invocação anterior, como podemos ver aqui:

```
mysql> CALL jssp_prep1("
    ">   SELECT *
    ">   FROM t1
    ">   WHERE c1 = ? OR c1 = ?
    "> ");
Query OK, 0 rows affected (0.03 sec)

mysql> SELECT mle_session_state("stdout")\G
*************************** 1. row ***************************
mle_session_state('stdout'): c1,c2,c3
3,37,peach
4,221,watermelon
Number of warnings: 0
c1,c2,c3
2,139,apple
3,37,peach
Number of warnings: 0
c1,c2,c3
3,37,peach
5,83,pear
Number of warnings: 0

1 row in set (0.00 sec)
```